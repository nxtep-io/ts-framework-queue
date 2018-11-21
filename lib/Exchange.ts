import { Logger } from "ts-framework-common";
import { AMQPOptions, AMQPServiceOptions } from "./AMQP";
import Channel from "./Channel";

export const NACK_TIMEOUT = 30000;

export interface BoundQueue {
  name: string;
  logger?: Logger;
  routes?: string[];
}

export interface ExchangeOptions extends AMQPServiceOptions {
  type?: string;
  queues: BoundQueue[];
  queueOptions?: AMQPOptions.AssertQueue;
  exchangeOptions?: AMQPOptions.AssertExchange;
}

export default class Exchange {
  public logger: Logger;

  constructor(public name: string, protected channel: Channel, public options: ExchangeOptions) {
    this.logger = options.logger || Logger.getInstance();
  }

  public static async from(name: string, channel: Channel, options: ExchangeOptions): Promise<Exchange> {
    const exchange = new Exchange(name, channel, options);

    if (options.queues) {
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

    const tasks = this.options.queues.map(async queue => {
      // Asert queue exists in current channel
      await this.channel.assertQueue(queue.name, this.options.queueOptions || this.options.queueOptions);

      // Bind all routes from channel
      if (queue.routes && queue.routes.length) {
        await Promise.all(
          queue.routes.map(route => {
            return this.channel.bindQueue(queue.name, this.name, route);
          })
        );
      }
    });

    // Bind all queues in parallel
    await Promise.all(tasks);
  }
}
