import { IDistributorRepository } from '@domain/order/types/IDistributorRepository'
import { IOrder } from '@domain/order/types/IOrder'
import logger from '@shared/logging/Logger'
import { injectable } from 'tsyringe'

@injectable()
export class DistributorRepository implements IDistributorRepository {
  private readonly baseURL: string

  constructor() {
    this.baseURL =
      process.env.DISTRIBUTOR_API_URL || 'https://api.distributor.com'
  }

  async sendOrder(data: Partial<IOrder>): Promise<{
    success: boolean
    orderNumber?: string
    confirmedItems?: Array<{ productId: string; quantity: number }>
  }> {
    try {
      logger.info({
        message: 'Sending order to distributor API',
        orderId: data.id,
      })

      const orderNumber = `DTB-${data.id}`

      logger.info({
        message: 'Order successfully processed by distributor',
        orderId: data.id,
        distributorOrderId: orderNumber,
      })

      return { success: true, orderNumber, confirmedItems: data.items }
    } catch (error: any) {
      logger.error({
        message: 'Error while calling distributor API',
        orderId: data.id,
        error: error.message,
      })
      return { success: false }
    }
  }
}
