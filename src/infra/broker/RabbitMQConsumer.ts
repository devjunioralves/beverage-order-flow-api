import { tokens } from '@di/tokens'
import { ISendOrderToDistributorService } from '@domain/order/types/ISendOrderToDistributorService'
import logger from '@shared/logging/Logger'
import client from 'amqplib'
import { inject, injectable } from 'tsyringe'

@injectable()
export class RabbitMQConsumer {
  constructor(
    @inject(tokens.SendOrderToDistributorService)
    private sendOrderToDistributorService: ISendOrderToDistributorService
  ) {}

  async start(): Promise<void> {
    try {
      const connection = await client.connect(
        'amqp://guest:guest@rabbitmq:5672'
      )
      const channel = await connection.createChannel()
      await channel.assertQueue('order_queue', { durable: true })

      logger.info({
        message: '📩 RabbitMQ consumer started, waiting for messages...',
        queue: 'order_queue',
      })

      channel.consume('order_queue', async (msg) => {
        if (msg !== null) {
          const startTime = Date.now()
          const order = JSON.parse(msg.content.toString())
          const retryCount = msg.properties.headers?.['x-retry-count'] ?? 0

          logger.info({
            message: `📦 Processing order ${order.id}`,
            orderId: order.id,
            retryCount,
          })

          try {
            const result = await this.sendOrderToDistributorService.execute(
              order
            )

            logger.info({
              message: `✅ Order successfully sent to distributor`,
              orderId: order.id,
              distributorOrderNumber: result.orderNumber,
              executionTimeMs: Date.now() - startTime,
            })

            channel.ack(msg)
          } catch (error: any) {
            logger.error({
              message: `❌ Error sending order ${order.id} to distributor`,
              orderId: order.id,
              error: error.message,
              retryCount,
            })

            if (retryCount >= 5) {
              logger.error({
                message: `🚨 Order ${order.id} reached max retry limit and will be discarded`,
                orderId: order.id,
              })
              channel.ack(msg)
            } else {
              const delay = this.getExponentialBackoffDelay(retryCount)

              logger.warn({
                message: `🔄 Retrying order ${order.id} after ${delay}ms`,
                orderId: order.id,
                nextRetryAttempt: retryCount + 1,
              })

              setTimeout(() => {
                channel.sendToQueue(
                  'order_queue',
                  Buffer.from(JSON.stringify(order)),
                  { headers: { 'x-retry-count': retryCount + 1 } }
                )
              }, delay)

              channel.ack(msg)
            }
          }
        }
      })
    } catch (error: any) {
      logger.error({
        message: '🚨 Failed to start RabbitMQ consumer',
        error: error.message,
      })
    }
  }

  private getExponentialBackoffDelay(retryCount: number): number {
    const baseDelay = Math.pow(2, retryCount) * 1000
    const jitter = Math.random() * 500
    return baseDelay + jitter
  }
}
