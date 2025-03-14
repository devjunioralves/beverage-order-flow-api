import { IOrderRepository } from '../../infra/IOrderRepository'
import { IOrder } from '../../types/IOrder'
import OrderService from '../OrderService'

describe('OrderService', () => {
  let orderService: OrderService
  let mockOrderRepository: jest.Mocked<IOrderRepository>

  beforeEach(() => {
    mockOrderRepository = {
      create: jest.fn(),
      findById: jest.fn(),
    } as jest.Mocked<IOrderRepository>

    orderService = new OrderService(mockOrderRepository)
  })

  it('should create an order successfully', async () => {
    const mockOrder: Partial<IOrder> = {
      customerId: 'customer',
      resaleId: 'resale-456',
      items: [{ productId: 'p123', quantity: 10 }],
    }

    mockOrderRepository.create.mockResolvedValue(mockOrder as IOrder)

    const result = await orderService.create(mockOrder)

    expect(result).toEqual(mockOrder)
    expect(mockOrderRepository.create).toHaveBeenCalledWith(mockOrder)
    expect(mockOrderRepository.create).toHaveBeenCalledTimes(1)
  })

  it('should throw an error if order creation fails', async () => {
    mockOrderRepository.create.mockRejectedValue(new Error('Database error'))

    await expect(
      orderService.create({
        customerId: 'customer',
        resaleId: 'resale-456',
        items: [],
      } as Partial<IOrder>)
    ).rejects.toThrow('Database error')

    expect(mockOrderRepository.create).toHaveBeenCalledTimes(1)
  })
})
