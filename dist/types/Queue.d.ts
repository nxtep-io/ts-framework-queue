import { LoggerInstance } from "ts-framework-common";
import { AMQPMessage, AMQPOptions } from "./AMQP";
import Channel from "./Channel";
import { QueueActions } from "./utils";
export interface QueueOptions {
    routes?: string[];
    logger?: LoggerInstance;
    exchangeName?: string;
    queueOptions?: AMQPOptions.AssertQueue;
}
export declare type QueueSubscriber<Data> = (data: Data, message: AMQPMessage, actions: QueueActions<Data>) => Promise<void>;
export default class Queue<Data> {
    name: string;
    channel: Channel<Data>;
    options: QueueOptions;
    logger: LoggerInstance;
    constructor(name: string, channel: Channel<Data>, options: QueueOptions);
    static from<Data>(name: string, channel: Channel<Data>, options: QueueOptions): Promise<Queue<Data>>;
    bind(): Promise<void>;
    /**
     * Publishes data to queue.
     */
    publish(data: Data, options?: AMQPOptions.Publish): Promise<boolean>;
    /**
     * Subscribes to queue messages.
     */
    subscribe(onData: QueueSubscriber<Data>, options?: AMQPOptions.Consume): void;
}
