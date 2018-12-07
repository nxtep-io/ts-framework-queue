import AMQP from '../../lib';

const amqp = new AMQP({ host: 'amqp://localhost' });

amqp.connect().then(async () => {
  const channel = await amqp.channel('test');
  const exchange = await channel.exchange('test_exc', {
    bind: [{
      name: 'test_queue',
      routes: ['tasks']
    }]
  });

  await exchange.publish('tasks', { time: Date.now() });
  amqp.logger.info('Published to channel successfully!');

  // Wait some time to allow the message to be published correctly
  setTimeout(async () => await amqp.disconnect(), 1000);

}).catch(exception => {
  amqp.logger.error(exception, exception.details);
  process.exit(-1);
});