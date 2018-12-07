import AMQP from '../../lib';

const amqp = new AMQP({ host: 'amqp://localhost' });

amqp.connect().then(async () => {
  const channel = await amqp.channel('test');
  const queue = await channel.queue('test_queue');

  await queue.publish({ time: Date.now() });
  amqp.logger.info('Published to channel successfully!');

  // Wait some time to allow the message to be published correctly
  setTimeout(async () => await amqp.disconnect(), 1000);

}).catch(exception => {
  amqp.logger.error(exception, exception.details);
  process.exit(-1);
});