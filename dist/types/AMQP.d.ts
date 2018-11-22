import { Connection, Options as AMQPOptions, Message as AMQPMessage } from "amqplib";
import { Database, DatabaseOptions } from "ts-framework-common";
import Channel, { ChannelOptions } from "./Channel";
export declare const NACK_TIMEOUT = 30000;
export { AMQPOptions, AMQPMessage };
export interface AMQPServiceOptions extends DatabaseOptions {
    host?: string;
    nackTimeout?: number;
    messageTimeToLive?: number;
}
export default class AMQPService<Data> extends Database {
    options: AMQPServiceOptions;
    protected connection?: Connection;
    protected channels: Channel<Data>[];
    constructor(options: AMQPServiceOptions);
    isConnected(): boolean;
    connect(options?: AMQPOptions.Connect): Promise<DatabaseOptions>;
    channel(name: string, options?: ChannelOptions<Data>): Promise<Channel<Data>>;
    disconnect(): Promise<void>;
    protected ensureConnection(): void;
    entities(): {
        [name: string]: any;
    };
}
