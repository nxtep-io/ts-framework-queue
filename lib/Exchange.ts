import { BaseError, Logger } from "ts-framework-common";
import { AMQPMessage, AMQPOptions } from "./AMQP";
import Channel from "./Channel";
import Queue from "./Queue";
import { ExchangeActions } from "./utils";

export interface QueueInformation {
  name: string;
  routes?: string[];
}

// tslint:disable-next-line:max-line-length
export type ExchangeSubscriber<Data> = (data: Data, message: AMQPMessage, actions: ExchangeActions<Data>) => Promise<void>;

export interface ExchangeOptions<Data> {
  bind: QueueInformation[];
  type?: string;
  logger?: Logger;
  queues?: Queue<Data>[];
  prefetch?: number;
  queueOptions?: AMQPOptions.AssertQueue;
  exchangeOptions?: AMQPOptions.AssertExchange;
}

export default class Exchange<Data> {
  public logger: Logger;
  public queues: Queue<Data>[] = [];

  constructor(public name: string, public channel: Channel<Data>, public options: ExchangeOptions<Data>) {
    this.logger = options.logger || Logger.getInstance();
    this.queues = options.queues || [];

    if (options.prefetch) {
      this.channel.prefetch(options.prefetch);
    }
  }

  // tslint:disable-next-line:max-line-length
  public static async from<Data>(name: string, channel: Channel<Data>, options: ExchangeOptions<Data>): Promise<Exchange<Data>> {
    const exchange = new Exchange(name, channel, options);

    if (options.bind) {
      // Ensure all requested queues exists in channel
      await exchange.bindQueues();
    }

    return exchange;
  }

  /**
   * Binds a new queue in the current channel.
   */
  async bindQueues(): Promise<void> {
    this.logger.debug('Binding queues to AMQP exchange instance', {
      exchange: this.name,
      queues: this.options.queues,
    });

    const tasks = this.options.bind.map(async info => {
      this.logger.debug('Initializing AMQP queue instance in exchange', info);
      const queue = await Queue.from(info.name, this.channel, {
        exchangeName: this.name,
        routes: info.routes
      });
      this.queues.push(queue);
    });

    // TODO: Improve this eventually, parallel may not be safe
    await Promise.all(tasks);
  }

  /**
   * Publishes data to exchange with specific routing.
   */
  public async publish(route: string, data: Data, options?: AMQPOptions.Publish) {
    return this.channel.publish(this.name, route, data, options);
  }

  /**
   * Listens for new messages in the exchange.
   */
  public subscribe(queueName: string, onData: ExchangeSubscriber<Data>, options?: AMQPOptions.Consume): void {
    const queue = this.queues.find(q => q.name === queueName);

    // Ensure queue is bound to curren exchange
    if (!queue) {
      throw new BaseError(`Cannot subscribe to unbound queue "${queueName}"`);
    }

    // Prepare wrapper for channel subscriber
    const wrapper = async (content: any, message: AMQPMessage) => {
      await onData(content, message, new ExchangeActions(this, message))
    };

    this.channel.consume(queueName, wrapper, options);
  }
}
