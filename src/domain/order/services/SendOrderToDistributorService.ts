import { tokens } from '@di/tokens'
import { IOrderRepository } from '@domain/order/infra/IOrderRepository'
import { IDistributorRepository } from '@domain/order/types/IDistributorRepository'
import { EOrderStatus } from '@domain/order/types/IOrder'
import logger from '@shared/logging/Logger'
import { inject, injectable } from 'tsyringe'
import { IOrder, IOrderItem } from '../types/IOrder'
import { ISendOrderToDistributorService } from '../types/ISendOrderToDistributorService'

@injectable()
export default class SendOrderToDistributorService
  implements ISendOrderToDistributorService
{
  constructor(
    @inject(tokens.OrderRepository)
    private orderRepository: IOrderRepository,

    @inject(tokens.DistributorRepository)
    private distributorRepository: IDistributorRepository
  ) {}

  async execute(
    data: IOrder
  ): Promise<{ orderNumber: string; confirmedItems: IOrderItem[] }> {
    const order = await this.orderRepository.findById(data.id as string)

    if (!order) {
      logger.warn({
        message: 'Order not found, cannot send to distributor',
        orderId: data.id,
      })
      throw new Error('Order not found')
    }

    const totalItems = order.items.reduce(
      (sum: number, item: IOrderItem) => sum + item.quantity,
      0
    )
    if (totalItems < 1000) {
      logger.warn({
        message: 'Order below minimum quantity requirement',
        orderId: data.id,
        totalItems,
      })
      throw new Error('Order does not meet the minimum quantity requirement')
    }

    try {
      const response = await this.distributorRepository.sendOrder({
        id: order.id as string,
        resaleId: order.resaleId,
        items: order.items,
      })

      if (!response.success) {
        await this.orderRepository.updateStatus(
          order.id as string,
          EOrderStatus.FAILED
        )
        logger.error({
          message: 'Failed to send order to distributor',
          orderId: order.id,
        })
        throw new Error('Failed to send order to Distributor')
      }

      await this.orderRepository.updateStatus(
        order.id as string,
        EOrderStatus.SENT
      )
      logger.info({
        message: 'Order successfully sent to distributor',
        orderId: order.id,
        orderNumber: response.orderNumber,
      })

      return {
        orderNumber: response.orderNumber || '',
        confirmedItems: response.confirmedItems || [],
      }
    } catch (error: any) {
      await this.orderRepository.updateStatus(
        order.id as string,
        EOrderStatus.FAILED
      )
      logger.error({
        message: 'Unexpected error sending order to distributor',
        orderId: order.id,
        error: error.message,
      })
      throw error
    }
  }
}
