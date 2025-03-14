import { EOrderStatus, IOrder } from '../types/IOrder'

export interface IOrderRepository {
  create(data: Partial<IOrder>): Promise<IOrder>
  findById(id: string): Promise<IOrder | null>
  updateStatus(id: string, status: EOrderStatus): Promise<void>
}
