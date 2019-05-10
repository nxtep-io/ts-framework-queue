import { BaseError, Logger, LoggerInstance } from "ts-framework-common";
import { AMQPMessage, AMQPOptions } from "./AMQP";
import Channel from "./Channel";
import { QueueActions } from "./utils";

export interface QueueOptions {
  routes?: string[];
  logger?: LoggerInstance;
  exchangeName?: string;
  queueOptions?: AMQPOptions.AssertQueue;
}

// tslint:disable-next-line:max-line-length
export type QueueSubscriber<Data> = (data: Data, message: AMQPMessage, actions: QueueActions<Data>) => Promise<void>;

export default class Queue<Data> {
  public logger: LoggerInstance;

  constructor(public name: string, public channel: Channel<Data>, public options: QueueOptions) {
    this.logger = options.logger || Logger.getInstance();
    this.options.routes = this.options.routes || [];
  }

  public static async from<Data>(name: string, channel: Channel<Data>, options: QueueOptions): Promise<Queue<Data>> {
    const queue = new Queue(name, channel, options);
    await queue.bind();
    return queue;
  }

  public async bind() {
    // Asert queue exists in current channel
    await this.assert();

    // Bind all routes from channel
    if (this.options.routes && this.options.routes.length && this.options.exchangeName) {
      const subTasks = this.options.routes.map(route => {
        return this.channel.bindQueue(this.name, this.options.exchangeName, route);
      });

      // TODO: Improve this eventually, parallel may not be safe
      await Promise.all(subTasks);
    } else if (this.options.routes && this.options.routes.length) {
      throw new BaseError('Cannot bind queue to exchange without a valid name');
    }
  }

  /**
   * Assert queue in the channel.
   */
  public async assert() {
    return this.channel.assertQueue(this.name, this.options.queueOptions);
  }

  /**
   * Publishes data to queue.
   */
  public async publish(data: Data, options?: AMQPOptions.Publish) {
    return this.channel.sendToQueue(this.name, data, options);
  }

  /**
   * Subscribes to queue messages.
   */
  public subscribe(onData: QueueSubscriber<Data>, options?: AMQPOptions.Consume): void {
    const wrapper = async (content: any, message: AMQPMessage) => {
      await onData(content, message, new QueueActions(this, message))
    };
    this.channel.consume(this.name, wrapper, options);
  }
}