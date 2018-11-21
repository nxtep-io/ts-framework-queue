import { Channel as BaseChannel, Connection as BaseConnection } from "amqplib";
import { Logger } from "ts-framework-common";
import { AMQPOptions } from "./AMQP";
import Exchange, { ExchangeOptions } from "./Exchange";
import { Serializer } from "./utils";

export const NACK_TIMEOUT = 30000;

export interface ChannelOptions {
  name?: string;
  logger?: Logger;
  nackTimeout?: number;
  exchanges?: Exchange[];
  serializer?: Serializer;
}

export default class Channel {
  public logger: Logger;
  protected exchanges: Exchange[] = [];
  protected serializer: Serializer = new Serializer();

  constructor(protected channel: BaseChannel, public options: ChannelOptions = {}) {
    this.logger = options.logger || Logger.getInstance();
    this.serializer = options.serializer || this.serializer;
  }

  public static async from(connection: BaseConnection, options: ChannelOptions): Promise<Channel> {
    const base = await connection.createChannel();
    return new Channel(base, options);
  }

  /**
   * Closes the channel connection.
   */
  public async close(): Promise<void> {
    await this.channel.close();
  }

  /**
   * Gets an exchange ready for publishing and consuming.
   */
  async exchange(name, options?: ExchangeOptions): Promise<Exchange> {
    this.logger.debug('Initializing AMQP exchange instance', {
      exchange: name,
      queues: options.queues,
      options: options.exchangeOptions,
    });

    // Ensure exchange exists in remote server
    await this.channel.assertExchange(name, options.type || 'direct', options.exchangeOptions);
    return Exchange.from(name, this, { logger: this.logger, ...options });
  }

  async assertQueue(name: string, options: AMQPOptions.AssertQueue) {
    return this.channel.assertQueue(name, options);
  }

  async bindQueue(queueName: string, exchangeName: string, route: string) {
    return this.channel.bindQueue(queueName, exchangeName, route);
  }

  // async sendToQueue(name: string, data: any, options?: AMQPOptions.Publish) {
  //   const content = this.serializer.serialize(data);
  //   return this.channel.sendToQueue(name, Buffer.from(content), options);
  // }

  // async publish(name: string, route: string, data: any, options?: AMQPOptions.Publish) {
  //   const content = this.serializer.serialize(data);
  //   return this.channel.publish(name, route, Buffer.from(content), options);
  // }

  // async prefetch(num: number, global?: boolean) {
  //   return this.channel.prefetch(num, global);
  // }

  // async ack(message: BaseMessage, allUpTo?: boolean) {
  //   return this.channel.ack(message, allUpTo);
  // }

  // async nack(message: BaseMessage, allUpTo?: boolean, requeue?: boolean) {
  //   return setTimeout(() => this.channel.nack(message, allUpTo, requeue), this.options.nackTimeout || NACK_TIMEOUT);
  // }

  // async consume(queue: string, onMessage: (content: any, msg: BaseMessage) => any, options?: AMQPOptions.Consume) {
  //   const wrapper = (msg: BaseMessage) => onMessage(this.serializer.deserialize(msg.content), msg);
  //   return this.channel.consume(queue, wrapper, options);
  // }
}
