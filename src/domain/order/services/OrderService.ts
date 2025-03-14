import { tokens } from '@di/tokens'
import { IResaleRepository } from '@domain/resale/infra/IResaleRepository'
import { BaseError } from '@shared/exceptions/BaseError'
import { inject, injectable } from 'tsyringe'
import { IOrderRepository } from '../infra/IOrderRepository'
import { IOrder } from '../types/IOrder'
import { IOrderService } from '../types/IOrderService'

@injectable()
export default class OrderService implements IOrderService {
  constructor(
    @inject(tokens.OrderRepository)
    private orderRepository: IOrderRepository,
    @inject(tokens.ResaleRepository)
    private resaleRepository: IResaleRepository
  ) {}

  async create(data: IOrder): Promise<IOrder> {
    const resaleExists = await this.resaleRepository.findById(data.resaleId)

    if (!resaleExists) {
      throw new BaseError({
        message: 'Resale not found. The provided resaleId does not exist.',
        name: 'ResaleNotFoundError',
        statusCode: 404,
      })
    }

    return this.orderRepository.create(data)
  }
}
