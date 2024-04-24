const pino = require('pino')

const targets = [
  {
    target: 'pino/file',
    options: {
      destination: 1
    }
  },
  {
    target: './kafkaTransport.js',
    options: {
      topic: 'my-topic-1',
      'client.id': 'my-clien-id-1',
      'metadata.broker.list': 'kafka:9092'
    }
  }
]

const logger = pino({
  transport: { targets }
})

logger.info('This is a test')
setTimeout(() => {
  console.log('bye')
  //process.exit(0)
}, 1000)
