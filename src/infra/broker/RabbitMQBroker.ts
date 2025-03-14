import { IMessageBroker } from '@domain/shared/broker/IMessageBroker'
import logger from '@shared/logging/Logger'
import client, { Channel, Connection } from 'amqplib'

export class RabbitMQBroker implements IMessageBroker {
  private connection!: Connection
  private channel!: Channel
  private connected = false

  async connect() {
    if (this.connected && this.channel) {
      logger.info({ message: '🐇 RabbitMQ is already connected.' })
      return
    }

    try {
      logger.info({ message: '⌛ Connecting to RabbitMQ Server...' })

      this.connection = (await client.connect(
        'amqp://guest:guest@rabbitmq:5672'
      )) as unknown as Connection
      this.channel = await (this.connection as any).createChannel()
      this.connected = true

      logger.info({
        message: '✅ RabbitMQ Connection established successfully.',
      })
    } catch (error: any) {
      logger.error({
        message: '❌ Failed to connect to RabbitMQ.',
        error: error.message,
      })
      throw error
    }
  }

  async publish(queue: string, message: object): Promise<void> {
    try {
      if (!this.channel) {
        throw new Error('RabbitMQ connection not initialized')
      }

      await this.channel.assertQueue(queue, { durable: true })
      this.channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), {
        persistent: true,
      })

      logger.info({
        message: '📤 Message published to queue',
        queueName: queue,
        payload: message,
      })
    } catch (error: any) {
      logger.error({
        message: '❌ Error publishing message to queue',
        queue,
        error: error.message,
      })
    }
  }

  async close(): Promise<void> {
    try {
      if (this.channel) {
        await this.channel.close()
      }
      if (this.connection) {
        await (this.connection as any).close()
      }
      this.connected = false

      logger.info({ message: '🔌 RabbitMQ connection closed.' })
    } catch (error: any) {
      logger.error({
        message: '❌ Error closing RabbitMQ connection',
        error: error.message,
      })
    }
  }
}
