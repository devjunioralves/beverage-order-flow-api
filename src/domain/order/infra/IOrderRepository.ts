import { IOrder } from '../types/IOrder'

export interface IOrderRepository {
  create(data: Partial<IOrder>): Promise<IOrder>
  findById(id: string): Promise<IOrder | null>
}
