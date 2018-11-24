/// <reference types="node" />
import { Channel as BaseChannel, Connection as BaseConnection } from "amqplib";
import { Logger } from "ts-framework-common";
import { AMQPOptions, AMQPMessage } from "./AMQP";
import Exchange, { ExchangeOptions } from "./Exchange";
import { Serializer } from "./utils";
import Queue, { QueueOptions } from "./Queue";
export interface ChannelOptions<Data> {
    name?: string;
    logger?: Logger;
    nackTimeout?: number;
    exchanges?: Exchange<Data>[];
    serializer?: Serializer;
}
export default class Channel<Data> {
    protected channel: BaseChannel;
    options: ChannelOptions<Data>;
    logger: Logger;
    protected exchanges: Exchange<Data>[];
    protected serializer: Serializer;
    constructor(channel: BaseChannel, options?: ChannelOptions<Data>);
    static from<Data>(connection: BaseConnection, options: ChannelOptions<Data>): Promise<Channel<Data>>;
    /**
     * Closes the channel connection.
     */
    close(): Promise<void>;
    /**
     * Gets an exchange ready for publishing and consuming.
     */
    exchange(name: any, options: ExchangeOptions<Data>): Promise<Exchange<Data>>;
    /**
     * Gets a queue ready for publishing and consuming.
     */
    queue(name: any, options?: QueueOptions): Promise<Queue<Data>>;
    assertQueue(name: string, options: AMQPOptions.AssertQueue): Promise<import("amqplib/properties").Replies.AssertQueue>;
    bindQueue(queueName: string, exchangeName: string, route: string): Promise<import("amqplib/properties").Replies.Empty>;
    publish(name: string, route: string, data: any, options?: AMQPOptions.Publish): Promise<boolean>;
    sendToQueue(name: string, data: any, options?: AMQPOptions.Publish): Promise<boolean>;
    prefetch(num: number, global?: boolean): Promise<import("amqplib/properties").Replies.Empty>;
    consume(queue: string, onMessage: (content: any, msg: AMQPMessage) => any, options?: AMQPOptions.Consume): Promise<import("amqplib/properties").Replies.Consume>;
    ack(message: AMQPMessage, allUpTo?: boolean): Promise<void>;
    nack(message: AMQPMessage, allUpTo?: boolean, requeue?: boolean): Promise<NodeJS.Timer>;
}
