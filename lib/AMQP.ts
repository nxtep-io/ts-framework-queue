import { connect, Connection, Options as AMQPOptions, Message as AMQPMessage } from "amqplib";
import { Database, DatabaseOptions } from "ts-framework-common";
import Channel, { ChannelOptions } from "./Channel";

export const NACK_TIMEOUT = 30000;

export { AMQPOptions, AMQPMessage};

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

  async connect(options?: AMQPOptions.Connect): Promise<DatabaseOptions> {
    // Prepare connection and channel for messaging
    this.connection = await connect(
      this.options.host || "amqp://localhost",
      options
    );
    return this.options;
  }

  async channel(name: string, options?: ChannelOptions<Data>): Promise<Channel<Data>> {
    this.ensureConnection();
    let channel = this.channels.find(channel => channel.options.name === name);

    if (!channel) {
      channel = await Channel.from(this.connection, { logger: this.logger, ...options });
      this.channels.push(channel);
    }

    return channel;
  }

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

  protected ensureConnection() {
    if (!this.isConnected()) {
      throw new Error("Channel is not available, queue may not be connected");
    }
  }

  entities(): { [name: string]: any } {
    return {};
  }
}
