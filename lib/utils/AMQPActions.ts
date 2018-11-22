import { AMQPMessage, AMQPOptions } from "../AMQP";
import Exchange from "../Exchange";
import Queue from "../Queue";

export interface AMQPActionsIntf<Data> {
  ack(allUpTo?: boolean): Promise<void>;
  nack(allUpTo?: boolean, requeue?: boolean): Promise<void>;
  publish(route: string, data: Data, options?: AMQPOptions.Publish): Promise<boolean>;
}

export class ExchangeActions<Data> {
  constructor(public exchange: Exchange<Data>, public message: AMQPMessage) {

  }

  public async ack(allUpTo?: boolean) {
    this.exchange.channel.ack(this.message, allUpTo)
  }

  public async nack(allUpTo?: boolean, requeue?: boolean) {
    this.exchange.channel.nack(this.message, allUpTo, requeue)
  }

  async publish(route, data, options?: AMQPOptions.Publish) {
    this.exchange.publish(route, data, options);
    return true;
  }
}

export class QueueActions<Data> {
  constructor(public queue: Queue<Data>, public message: AMQPMessage) {

  }

  public async ack(allUpTo?: boolean) {
    this.queue.channel.ack(this.message, allUpTo)
  }

  public async nack(allUpTo?: boolean, requeue?: boolean) {
    this.queue.channel.nack(this.message, allUpTo, requeue)
  }

  async publish(data, options?: AMQPOptions.Publish) {
    this.queue.publish(data, options);
    return true;
  }
}
