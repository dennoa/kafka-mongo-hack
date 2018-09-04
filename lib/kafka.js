import EventEmitter from 'events'
import { KafkaClient, Producer, ConsumerGroup } from 'kafka-node'

import config from './config'
import logger from './utils/logger'

class Events extends EventEmitter {}
const events = new Events()

const { kafkaHost, groupId } = config.kafka
const topic = 'hackday'

const client = new KafkaClient({ kafkaHost, autoConnect: false })
const producer = new Producer(client)
const consumer = new ConsumerGroup({ kafkaHost, groupId }, topic)

const handleError = thing => err => {
  logger.error(`Kafka ${thing} error: ${err}`)
  process.exit(-1)
}

function connectClient() {
  return new Promise(resolve => {
    logger.info(`Connecting to Kafka: ${kafkaHost}`)
    client.on('ready', resolve)
    client.on('error', handleError('çlient'))
    client.connect()
  })
}

function connectProducer() {
  return new Promise(resolve => {
    logger.info('Creating Kafka producer')
    producer.on('ready', resolve)
    producer.on('error', handleError('producer'))
    producer.connect()
  })
}

function emitMessage(message) {
  process.nextTick(() => events.emit(topic, message))
}

function connectConsumer() {
  logger.info(`Creating Kafka consumer for "${topic}" topic`)
  consumer.on('message', emitMessage)
  consumer.on('error', handleError('consumer'))
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

export function setOffset(offset) {
  throw new Error(`Did not get this function to work well. Not setting the offset to ${offset}`)
}

export default {
  connect,
  notifyHackday,
  onHackdayMessage,
  setOffset,
}
