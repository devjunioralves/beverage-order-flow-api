import { IOrder } from './IOrder'

export interface IOrderService {
  create(data: Partial<IOrder>): Promise<IOrder>
}
