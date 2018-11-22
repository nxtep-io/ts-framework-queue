import { Connection, Message as AMQPMessage, Options as AMQPOptions } from "amqplib";
import { Database, DatabaseOptions } from "ts-framework-common";
import Channel, { ChannelOptions } from "./Channel";
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
    /**
     * Opens a new channel in the AMQP connection.
     */
    channel(name: string, options?: ChannelOptions<Data>): Promise<Channel<Data>>;
    /**
     * Disconnects from AMQP server.
     */
    disconnect(): Promise<void>;
    /**
     * Ensures the database is connected.
     */
    protected ensureConnection(): void;
    entities(): {
        [name: string]: any;
    };
}
