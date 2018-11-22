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
    name: string;
    channel: Channel<Data>;
    options: QueueOptions;
    logger: Logger;
    constructor(name: string, channel: Channel<Data>, options: QueueOptions);
    static from<Data>(name: string, channel: Channel<Data>, options: QueueOptions): Promise<Queue<Data>>;
    bind(): Promise<void>;
    /**
     * Publishes data to queue.
     */
    publish(data: any, options?: AMQPOptions.Publish): Promise<boolean>;
}
