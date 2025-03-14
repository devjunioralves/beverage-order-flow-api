import { tokens } from '@di/tokens'
import { IOrder } from '@domain/order/types/IOrder'
import { IOrderService } from '@domain/order/types/IOrderService'
import { IMessageBroker } from '@domain/shared/broker/IMessageBroker'
import logger from '@shared/logging/Logger'
import { inject, injectable } from 'tsyringe'

@injectable()
export default class OrderAppService {
  constructor(
    @inject(tokens.OrderService)
    private orderService: IOrderService,

    @inject(tokens.MessageBroker)
    private messageBroker: IMessageBroker
  ) {}

  async create(data: IOrder): Promise<Partial<IOrder>> {
    const order = await this.orderService.create(data)

    this.messageBroker
      .publish('order_queue', {
        id: order.id,
        resaleId: order.resaleId,
        items: order.items,
      })
      .catch((err) => {
        logger.error({
          message: '❌ Failed to publish order to queue',
          error: err.message,
        })
      })

    return {
      id: order.id,
      items: order.items,
    }
  }
}
