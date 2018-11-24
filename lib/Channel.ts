import { Channel as BaseChannel, Connection as BaseConnection } from "amqplib";
import { Logger } from "ts-framework-common";
import { AMQPOptions, AMQPMessage } from "./AMQP";
import Exchange, { ExchangeOptions } from "./Exchange";
import { Serializer } from "./utils";
import Queue, { QueueOptions } from "./Queue";
import { NACK_TIMEOUT } from "./defaults";

export interface ChannelOptions<Data> {
  name?: string;
  logger?: Logger;
  nackTimeout?: number;
  exchanges?: Exchange<Data>[];
  serializer?: Serializer;
}

export default class Channel<Data> {
  public logger: Logger;
  protected exchanges: Exchange<Data>[] = [];
  protected serializer: Serializer = new Serializer();

  constructor(protected channel: BaseChannel, public options: ChannelOptions<Data> = {}) {
    this.logger = options.logger || Logger.getInstance();
    this.serializer = options.serializer || this.serializer;
  }

  public static async from<Data>(connection: BaseConnection, options: ChannelOptions<Data>): Promise<Channel<Data>> {
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
  async exchange(name, options: ExchangeOptions<Data>): Promise<Exchange<Data>> {
    this.logger.debug('Initializing AMQP exchange instance', {
      exchange: name,
      bind: options.bind,
      options: options.exchangeOptions,
    });

    // Ensure exchange exists in remote server
    await this.channel.assertExchange(name, options.type || 'direct', options.exchangeOptions);
    return Exchange.from(name, this, { logger: this.logger, ...options });
  }

  /**
   * Gets a queue ready for publishing and consuming.
   */
  async queue(name, options: QueueOptions = {}): Promise<Queue<Data>> {
    this.logger.debug('Initializing AMQP exchange instance', {
      exchange: name,
      options: options.queueOptions,
    });

    // Ensure queue exists in remote server
    await this.channel.assertQueue(name, options.queueOptions);
    return Queue.from(name, this, { logger: this.logger, ...options });
  }

  async assertQueue(name: string, options: AMQPOptions.AssertQueue) {
    return this.channel.assertQueue(name, options);
  }

  async bindQueue(queueName: string, exchangeName: string, route: string) {
    return this.channel.bindQueue(queueName, exchangeName, route);
  }

  async publish(name: string, route: string, data: any, options?: AMQPOptions.Publish) {
    const content = this.serializer.serialize(data);
    return this.channel.publish(name, route, Buffer.from(content), options);
  }

  async sendToQueue(name: string, data: any, options?: AMQPOptions.Publish) {
    const content = this.serializer.serialize(data);
    return this.channel.sendToQueue(name, Buffer.from(content), options);
  }

  async prefetch(num: number, global?: boolean) {
    return this.channel.prefetch(num, global);
  }

  async consume(queue: string, onMessage: (content: any, msg: AMQPMessage) => any, options?: AMQPOptions.Consume) {
    const wrapper = (msg: AMQPMessage) => onMessage(this.serializer.deserialize(msg.content), msg);
    return this.channel.consume(queue, wrapper, options);
  }

  public async ack(message: AMQPMessage, allUpTo?: boolean) {
    return this.channel.ack(message, allUpTo);
  }

  public async nack(message: AMQPMessage, allUpTo?: boolean, requeue?: boolean) {
    return setTimeout(() => this.channel.nack(message, allUpTo, requeue), this.options.nackTimeout || NACK_TIMEOUT);
  }
}
