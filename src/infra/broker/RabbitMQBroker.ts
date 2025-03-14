import { IMessageBroker } from '@domain/shared/broker/IMessageBroker'
import client, { Channel, Connection } from 'amqplib'

export class RabbitMQBroker implements IMessageBroker {
  connection!: Connection
  channel!: Channel
  private connected!: Boolean

  async connect() {
    if (this.connected && this.channel) return
    else this.connected = true

    try {
      console.log(`⌛️ Connecting to Rabbit-MQ Server`)
      this.connection = (await client.connect(
        'amqp://guest:guest@rabbitmq:5672'
      )) as unknown as Connection

      console.log(`✅ Rabbit MQ Connection is ready`)

      this.channel = await (this.connection as any).createChannel()

      console.log(`🛸 Created RabbitMQ Channel successfully`)
    } catch (error) {
      console.error(error)
      console.error(`Not connected to MQ Server`)
    }
  }

  async publish(queue: string, message: object): Promise<void> {
    try {
      if (!this.channel) {
        throw new Error('RabbitMQ connection not initialized')
      }

      this.channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), {
        persistent: true,
      })
    } catch (error) {
      console.error(error)
    }
  }

  async close(): Promise<void> {
    await this.channel.close()
    await (this.connection as any).close()
  }
}
