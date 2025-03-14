import { tokens } from '@di/tokens'
import { inject, injectable } from 'tsyringe'
import { IOrderRepository } from '../infra/IOrderRepository'
import { IOrder } from '../types/IOrder'
import { IOrderService } from '../types/IOrderService'

@injectable()
export default class OrderService implements IOrderService {
  constructor(
    @inject(tokens.OrderRepository)
    private orderRepository: IOrderRepository
  ) {}

  async create(data: Partial<IOrder>): Promise<IOrder> {
    return await this.orderRepository.create(data)
  }
}
