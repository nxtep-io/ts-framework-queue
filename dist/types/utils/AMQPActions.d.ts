import { AMQPMessage, AMQPOptions } from "../AMQP";
import Exchange from "../Exchange";
import Queue from "../Queue";
export interface AMQPActionsIntf<Data> {
    ack(allUpTo?: boolean): Promise<void>;
    nack(allUpTo?: boolean, requeue?: boolean): Promise<void>;
    publish(route: string, data: Data, options?: AMQPOptions.Publish): Promise<boolean>;
}
export declare class ExchangeActions<Data> {
    exchange: Exchange<Data>;
    message: AMQPMessage;
    constructor(exchange: Exchange<Data>, message: AMQPMessage);
    ack(allUpTo?: boolean): Promise<void>;
    nack(allUpTo?: boolean, requeue?: boolean): Promise<void>;
    publish(route: any, data: any, options?: AMQPOptions.Publish): Promise<boolean>;
}
export declare class QueueActions<Data> {
    queue: Queue<Data>;
    message: AMQPMessage;
    constructor(queue: Queue<Data>, message: AMQPMessage);
    ack(allUpTo?: boolean): Promise<void>;
    nack(allUpTo?: boolean, requeue?: boolean): Promise<void>;
    publish(data: any, options?: AMQPOptions.Publish): Promise<boolean>;
}
