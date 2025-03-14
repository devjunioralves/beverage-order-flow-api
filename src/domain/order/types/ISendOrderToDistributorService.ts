import { IOrder, IOrderItem } from './IOrder'

export interface ISendOrderToDistributorService {
  execute(
    data: IOrder
  ): Promise<{ orderNumber: string; confirmedItems: IOrderItem[] }>
}
