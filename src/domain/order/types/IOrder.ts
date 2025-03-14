export interface IOrder {
  id?: string
  resaleId: string
  customerId: string
  items: IOrderItem[]
  status: EOrderStatus
  createdAt?: Date
  updatedAt?: Date
}

export interface IOrderItem {
  productId: string
  quantity: number
}

export enum EOrderStatus {
  PENDING = 'pending',
  SENT = 'sent',
  FAILED = 'failed',
}
