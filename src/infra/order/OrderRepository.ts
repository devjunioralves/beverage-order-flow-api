import { IOrderRepository } from '@domain/order/infra/IOrderRepository'
import { Order } from '@domain/order/models/Order'
import { EOrderStatus, IOrder } from '@domain/order/types/IOrder'
import { redisClient } from '@infra/cache/Redis'
import { injectable } from 'tsyringe'
import { Repository } from 'typeorm'
import { AppDataSource } from '../database/connection'

@injectable()
export class OrderRepository implements IOrderRepository {
  private readonly ormRepository: Repository<Order>

  constructor() {
    this.ormRepository = AppDataSource.getRepository(Order)
  }

  async findById(id: string): Promise<IOrder | null> {
    const cachedOrder = await redisClient.get(`order:${id}`)
    if (cachedOrder) {
      return JSON.parse(cachedOrder)
    }

    const order = await this.ormRepository.findOne({ where: { id } })
    if (order) {
      await redisClient.setex(`order:${id}`, 3600, JSON.stringify(order))
    }
    return order
  }

  async create(data: Omit<IOrder, 'id'>): Promise<IOrder> {
    const order = this.ormRepository.create(data)
    await this.ormRepository.save(order)

    if (!order) {
      throw new Error('Order not found')
    }

    await redisClient.setex(`order:${order.id}`, 3600, JSON.stringify(order))

    return order
  }

  async updateStatus(id: string, status: EOrderStatus): Promise<void> {
    await this.ormRepository.update(id, { status })
    await redisClient.del(`order:${id}`)
  }
}
