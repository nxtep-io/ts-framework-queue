import { LoggerInstance } from "ts-framework-common";
import { AMQPMessage, AMQPOptions } from "./AMQP";
import Channel from "./Channel";
import Queue from "./Queue";
import { ExchangeActions } from "./utils";
export interface QueueInformation {
    name: string;
    routes?: string[];
}
export declare type ExchangeSubscriber<Data> = (data: Data, message: AMQPMessage, actions: ExchangeActions<Data>) => Promise<void>;
export interface ExchangeOptions<Data> {
    bind: QueueInformation[];
    type?: string;
    logger?: LoggerInstance;
    queues?: Queue<Data>[];
    prefetch?: number;
    queueOptions?: AMQPOptions.AssertQueue;
    exchangeOptions?: AMQPOptions.AssertExchange;
}
export default class Exchange<Data> {
    name: string;
    channel: Channel<Data>;
    options: ExchangeOptions<Data>;
    logger: LoggerInstance;
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
    publish(route: string, data: Data, options?: AMQPOptions.Publish): Promise<boolean>;
    /**
     * Listens for new messages in the exchange.
     */
    subscribe(queueName: string, onData: ExchangeSubscriber<Data>, options?: AMQPOptions.Consume): void;
}
