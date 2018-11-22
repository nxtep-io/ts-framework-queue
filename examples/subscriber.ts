import AMQP from '../lib';

const amqp = new AMQP({ host: 'amqp://localhost' });

amqp.connect().then(async () => {
  amqp.logger.debug('Connected to server successfully!');

  const channel = await amqp.channel('test');
  const exchange = await channel.exchange('test_exc', {
    bind: [{
      name: 'test_queue',
      routes: ['lib']
    }]
  });

  await exchange.subscribe('test_queue', async (data, msg, actions) => {
    amqp.logger.info('Task received', { data }, '\n');

    // Notify task has been executed
    await actions.ack();
  });

  amqp.logger.info('Subscribed successfully to exchange\n\n[*] Waiting for tasks. To exit press CTRL+C\n');

}).catch(exception => {
  amqp.logger.error(exception, exception.details);
  process.exit(-1);
});