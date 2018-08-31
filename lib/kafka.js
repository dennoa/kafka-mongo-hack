import EventEmitter from 'events'
import { KafkaClient, Producer, Consumer } from 'kafka-node'

import config from './config'
import logger from './utils/logger'

class Events extends EventEmitter {}
const events = new Events()

const { kafkaHost } = config.kafka
const topic = 'hackday'

const client = new KafkaClient({ kafkaHost, autoConnect: false })
const producer = new Producer(client)
const consumer = new Consumer(client, [{ topic }])

const handleConnectionError = thing => err => {
  logger.error(`Kafka ${thing} connection error: ${err}`)
  process.exit(-1)
}

function connectClient() {
  return new Promise(resolve => {
    logger.info(`Connecting to Kafka: ${kafkaHost}`)
    client.on('ready', resolve)
    client.on('error', handleConnectionError('çlient'))
    client.connect()
  })
}

function connectProducer() {
  return new Promise(resolve => {
    logger.info('Creating Kafka producer')
    producer.on('ready', resolve)
    producer.on('error', handleConnectionError('producer'))
    producer.connect()
  })
}

function emitMessage(message) {
  process.nextTick(() => events.emit(topic, message))
}

function connectConsumer() {
  logger.info(`Creating Kafka consumer for "${topic}" topic`)
  consumer.on('message', emitMessage)
  consumer.on('error', handleConnectionError('consumer'))
  consumer.connect()
}

async function connect() {
  await connectClient()
  await connectProducer()
  return connectConsumer()
}

export function notifyHackday(messages) {
  return new Promise((resolve, reject) => {
    producer.send([{ topic, messages }], err => {
      if (err) {
        return reject(err)
      }
      return resolve()
    })
  })
}

export const onHackdayMessage = listener => events.on(topic, listener)

export default {
  connect,
  notifyHackday,
  onHackdayMessage,
}
