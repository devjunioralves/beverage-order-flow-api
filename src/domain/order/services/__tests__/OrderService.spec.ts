import { IOrderRepository } from '@domain/order/infra/IOrderRepository'
import { IOrder } from '@domain/order/types/IOrder'
import { IResaleRepository } from '@domain/resale/infra/IResaleRepository'
import { BaseError } from '@shared/exceptions/BaseError'
import OrderService from '../OrderService'

describe('OrderService', () => {
  let orderService: OrderService
  let mockOrderRepository: jest.Mocked<IOrderRepository>
  let mockResaleRepository: jest.Mocked<IResaleRepository>

  beforeEach(() => {
    mockOrderRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      updateStatus: jest.fn(),
    } as jest.Mocked<IOrderRepository>

    mockResaleRepository = {
      create: jest.fn(),
      findByCnpjOrEmail: jest.fn(),
      findById: jest.fn(),
    } as jest.Mocked<IResaleRepository>

    orderService = new OrderService(mockOrderRepository, mockResaleRepository)
  })

  it('should create an order successfully when resale exists', async () => {
    const mockOrder: Partial<IOrder> = {
      id: 'order-123',
      customerId: 'customer',
      resaleId: 'resale-456',
      items: [{ productId: 'p123', quantity: 10 }],
    }

    mockResaleRepository.findById.mockResolvedValue({ id: 'resale-456' } as any)
    mockOrderRepository.create.mockResolvedValue(mockOrder as IOrder)

    const result = await orderService.create(mockOrder as IOrder)

    expect(result).toEqual(mockOrder)
    expect(mockResaleRepository.findById).toHaveBeenCalledWith(
      mockOrder.resaleId
    )
    expect(mockOrderRepository.create).toHaveBeenCalledWith(mockOrder)
    expect(mockOrderRepository.create).toHaveBeenCalledTimes(1)
  })

  it('should throw an error if resale does not exist', async () => {
    const mockOrder: Partial<IOrder> = {
      id: 'order-123',
      customerId: 'customer',
      resaleId: 'resale-999',
      items: [{ productId: 'p123', quantity: 10 }],
    }

    mockResaleRepository.findById.mockResolvedValue(null)

    await expect(orderService.create(mockOrder as IOrder)).rejects.toThrow(
      BaseError
    )
    expect(mockResaleRepository.findById).toHaveBeenCalledWith(
      mockOrder.resaleId
    )
    expect(mockOrderRepository.create).not.toHaveBeenCalled()
  })

  it('should throw an error if order creation fails', async () => {
    const mockOrder: Partial<IOrder> = {
      id: 'order-123',
      customerId: 'customer',
      resaleId: 'resale-456',
      items: [{ productId: 'p123', quantity: 10 }],
    }

    mockResaleRepository.findById.mockResolvedValue({ id: 'resale-456' } as any)
    mockOrderRepository.create.mockRejectedValue(new Error('Database error'))

    await expect(orderService.create(mockOrder as IOrder)).rejects.toThrow(
      'Database error'
    )

    expect(mockOrderRepository.create).toHaveBeenCalledTimes(1)
  })
})
