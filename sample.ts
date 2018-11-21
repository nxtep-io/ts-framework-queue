import AMQP from './lib';

const amqp = new AMQP({ host: 'amqp://localhost' });

amqp.connect().then(async () => {
  amqp.logger.debug('Connected to server successfully!');

  const channel = await amqp.channel('test');
  amqp.logger.debug('Created channel successfully!');

  const exchange = await channel.exchange('test_exc', {
    queues: [{ name: 'test_queue' }]
  })

  amqp.logger.debug('Created exchange successfully!');
  // await channel.publish('test', 'lib', { test: 2 });
  // amqp.logger.info('Published to channel successfully!');
});