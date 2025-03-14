import { Order } from '@domain/order/models/Order'
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { IResale } from '../types/IResale'

@Entity('resales')
export class Resale implements IResale {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ unique: true })
  cnpj!: string

  @Column()
  corporateName!: string

  @Column()
  tradeName!: string

  @Column({ unique: true })
  email!: string

  @Column({ type: 'text', array: true, nullable: true })
  phones?: string[]

  @Column({ type: 'jsonb' })
  contacts!: { name: string; isPrimary: boolean }[]

  @Column({ type: 'text', array: true, default: '{}' })
  deliveryAddresses!: string[]

  @OneToMany(() => Order, (order) => order.resale)
  orders!: Order[]
}
