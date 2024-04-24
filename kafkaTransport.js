const build = require('pino-abstract-transport')
const Kafka = require('node-rdkafka')

module.exports = function (opts) {
  let kafkaReady = false

  const { topic, ...kafkaOpts } = opts
  const producer = new Kafka.Producer(kafkaOpts)
  producer.connect()
  producer.on('ready', () => {
    kafkaReady = true
  })
  producer.on('error', err => {
    console.log(err.message)
  })
  producer.setPollInterval(1000)

  return build(
    function (source) {
      source.on('data', function (obj) {
        if (!kafkaReady) {
          return
        }
        producer.produce(
          topic,
          null,
          Buffer.from(JSON.stringify(obj)),
          null,
          Date.now()
        )
      })
    },
    {
      close (err, cb) {
        process._rawDebug('To close kafka producder')
        if (err) {
          console.error(err.message)
        }
        producer.disconnect(() => {
          process._rawDebug('Kafka producder disconnected')
          cb()
        })
      }
    }
  )
}
