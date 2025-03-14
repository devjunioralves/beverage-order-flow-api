import { Resale } from '@domain/resale/models/Resale'
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { EOrderStatus, IOrderItem } from '../types/IOrder'

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @ManyToOne(() => Resale, (resale) => resale.orders, { nullable: false })
  resale!: Resale

  @Column({ type: 'uuid' })
  resaleId!: string

  @Column({ type: 'uuid' })
  customerId!: string

  @Column({ type: 'jsonb' })
  items!: IOrderItem[]

  @Column({
    type: 'enum',
    enum: EOrderStatus,
    default: EOrderStatus.PENDING,
  })
  status!: EOrderStatus

  @CreateDateColumn()
  createdAt!: Date

  @UpdateDateColumn()
  updatedAt!: Date
}
