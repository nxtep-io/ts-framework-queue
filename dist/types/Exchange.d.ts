import { Logger } from "ts-framework-common";
import { AMQPOptions, AMQPMessage, AMQPActions } from "./AMQP";
import Channel from "./Channel";
import Queue from "./Queue";
export declare const NACK_TIMEOUT = 30000;
export interface QueueInformation {
    name: string;
    routes?: string[];
}
export declare type ExchangeSubscriber<Data> = (data: any, message: AMQPMessage, actions: AMQPActions<Data>) => Promise<void>;
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
    name: string;
    protected channel: Channel<Data>;
    options: ExchangeOptions<Data>;
    logger: Logger;
    queues: Queue<Data>[];
    constructor(name: string, channel: Channel<Data>, options: ExchangeOptions<Data>);
    static from<Data>(name: string, channel: Channel<Data>, options: ExchangeOptions<Data>): Promise<Exchange<Data>>;
    /**
     * Binds a new queue in the current channel.
     */
    bindQueues(): Promise<void>;
    /**
     * Publishes data to exchange with specific routing.
     */
    publish(route: string, data: any, options?: AMQPOptions.Publish): Promise<boolean>;
    subscribe(queueName: string, onData: ExchangeSubscriber<Data>, options?: AMQPOptions.Consume): void;
}