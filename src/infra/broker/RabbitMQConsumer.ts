import { tokens } from '@di/tokens'
import { ISendOrderToDistributorService } from '@domain/order/types/ISendOrderToDistributorService'
import client from 'amqplib'
import { inject, injectable } from 'tsyringe'

@injectable()
export class RabbitMQConsumer {
  constructor(
    @inject(tokens.SendOrderToDistributorService)
    private sendOrderToDistributorService: ISendOrderToDistributorService
  ) {}

  async start(): Promise<void> {
    const connection = await client.connect('amqp://guest:guest@rabbitmq:5672')
    const channel = await connection.createChannel()
    await channel.assertQueue('order_queue', { durable: true })

    console.log('📩 Aguardando pedidos...')

    channel.consume('order_queue', async (msg) => {
      if (msg !== null) {
        const order = JSON.parse(msg.content.toString())
        const retryCount = msg.properties.headers?.['x-retry-count'] ?? 0

        console.log(
          `📦 Processando pedido: ${order.id} (Tentativa ${retryCount})`
        )

        try {
          const result = await this.sendOrderToDistributorService.execute(order)
          console.log(`✅ Pedido confirmado! Número: ${result.orderNumber}`)
          channel.ack(msg)
        } catch (error) {
          console.error(
            `❌ Erro ao enviar pedido ${order.id} para Distribuidor:`,
            error
          )

          if (retryCount >= 5) {
            console.error(
              `🚨 Pedido ${order.id} atingiu o limite de retries e será descartado.`
            )
            channel.ack(msg)
          } else {
            console.log(`🔄 Reenviando pedido ${order.id} após um atraso...`)
            setTimeout(() => {
              channel.sendToQueue(
                'order_queue',
                Buffer.from(JSON.stringify(order)),
                { headers: { 'x-retry-count': retryCount + 1 } }
              )
            }, 2000 * (retryCount + 1))
            channel.ack(msg)
          }
        }
      }
    })
  }
}
