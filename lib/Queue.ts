import { Logger } from "ts-framework-common";
import { AMQPOptions } from "./AMQP";
import Channel from "./Channel";

export interface QueueOptions {
  exchangeName: string;
  routes?: string[];
  logger?: Logger;
  queueOptions?: AMQPOptions.AssertQueue;
}

export default class Queue<Data> {
  public logger: Logger;

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
    await this.channel.assertQueue(this.name, this.options.queueOptions);

    // Bind all routes from channel
    if (this.options.routes && this.options.routes.length) {
      const subTasks = this.options.routes.map(route => {
        return this.channel.bindQueue(this.name, this.options.exchangeName, route);
      });

      // TODO: Improve this eventually, parallel may not be safe
      await Promise.all(subTasks);
    }
  }

  /**
   * Publishes data to queue.
   */
  public async publish(data: any, options?: AMQPOptions.Publish) {
    return this.channel.sendToQueue(this.name, data, options);
  }
}