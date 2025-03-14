import { IOrder, IOrderItem } from './IOrder'

export interface IDistributorRepository {
  sendOrder(data: Partial<IOrder>): Promise<{
    success: boolean
    orderNumber?: string
    confirmedItems?: IOrderItem[]
  }>
}
