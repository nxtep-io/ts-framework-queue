import { connect, Connection, Message as AMQPMessage, Options as AMQPOptions } from "amqplib";
import { Database, DatabaseOptions, BaseError } from "ts-framework-common";
import Channel, { ChannelOptions } from "./Channel";

export { AMQPOptions, AMQPMessage };

export interface AMQPServiceOptions extends DatabaseOptions {
  host?: string;
  nackTimeout?: number;
  messageTimeToLive?: number;
}

export default class AMQPService<Data> extends Database {
  public options: AMQPServiceOptions;
  protected connection?: Connection;
  protected channels: Channel<Data>[] = [];

  constructor(options: AMQPServiceOptions) {
    super(options);
  }

  isConnected(): boolean {
    return !!this.connection;
  }

  async query() {
    throw new BaseError('AMQP service does not support querying');
  }

  async connect(options?: AMQPOptions.Connect): Promise<DatabaseOptions> {
    this.logger.debug('Connecting to the AMQP cluster', {
      host: this.options.host || "amqp://localhost",
    });

    // Prepare connection and channel for messaging
    this.connection = await connect(
      this.options.host || "amqp://localhost",
      options
    );

    process.once('SIGINT', () => this.connection.close().bind(this.connection))
    process.once('SIGTERM', () => this.connection.close().bind(this.connection))

    return this.options;
  }

  /**
   * Opens a new channel in the AMQP connection.
   */
  async channel(name: string, options?: ChannelOptions<Data>): Promise<Channel<Data>> {
    this.ensureConnection();
    let channel = this.channels.find(channel => channel.options.name === name);

    if (!channel) {
      channel = await Channel.from(this.connection, { logger: this.logger, ...options });
      this.channels.push(channel);
    }

    return channel;
  }

  /**
   * Disconnects from AMQP server.
   */
  async disconnect(): Promise<void> {
    // Close all available channels
    if (this.channels) {
      const tasks = this.channels.map(channel => channel.close());
      await Promise.all(tasks);
      this.channels = [];
    }

    // Close the connection
    await this.connection.close();
    this.connection = undefined;
  }

  /**
   * Ensures the database is connected.
   */
  protected ensureConnection() {
    if (!this.isConnected()) {
      throw new Error("Channel is not available, queue may not be connected");
    }
  }

  entities(): { [name: string]: any } {
    return {};
  }
}
