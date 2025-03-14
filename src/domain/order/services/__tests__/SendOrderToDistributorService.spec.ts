import logger from '@shared/logging/Logger'
import { IOrderRepository } from '../../infra/IOrderRepository'
import { IDistributorRepository } from '../../types/IDistributorRepository'
import { IOrder } from '../../types/IOrder'
import SendOrderToDistributorService from '../SendOrderToDistributorService'

describe('SendOrderToDistributorService', () => {
  let service: SendOrderToDistributorService
  let mockOrderRepository: jest.Mocked<IOrderRepository>
  let mockDistributorRepository: jest.Mocked<IDistributorRepository>

  beforeEach(() => {
    mockOrderRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      updateStatus: jest.fn(),
    } as jest.Mocked<IOrderRepository>

    mockDistributorRepository = {
      sendOrder: jest.fn(),
    } as jest.Mocked<IDistributorRepository>

    service = new SendOrderToDistributorService(
      mockOrderRepository,
      mockDistributorRepository
    )

    jest
      .spyOn(logger, 'warn')
      .mockImplementation((infoObject: object) => logger)
    jest
      .spyOn(logger, 'error')
      .mockImplementation((infoObject: object) => logger)
  })

  it('should send an order to the distributor successfully', async () => {
    const mockOrder: Partial<IOrder> = {
      id: 'order-123',
      resaleId: 'resale-456',
      items: [
        { productId: 'p123', quantity: 500 },
        { productId: 'p456', quantity: 600 },
      ],
    }

    mockOrderRepository.findById.mockResolvedValue(mockOrder as IOrder)
    mockDistributorRepository.sendOrder.mockResolvedValue({
      success: true,
      orderNumber: 'DTB-123',
      confirmedItems: mockOrder.items,
    })

    const result = await service.execute(mockOrder as IOrder)

    expect(result).toEqual({
      orderNumber: 'DTB-123',
      confirmedItems: mockOrder.items,
    })
    expect(mockDistributorRepository.sendOrder).toHaveBeenCalledWith({
      id: mockOrder.id,
      resaleId: mockOrder.resaleId,
      items: mockOrder.items,
    })
  })

  it('should throw an error if order is not found', async () => {
    mockOrderRepository.findById.mockResolvedValue(null)

    await expect(
      service.execute({
        id: 'invalid-order',
        resaleId: '',
        items: [],
        customerId: 'customer-123',
        status: 'pending',
      } as IOrder)
    ).rejects.toThrow('Order not found')

    expect(logger.warn).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Order not found, cannot send to distributor',
        orderId: 'invalid-order',
      })
    )
  })

  it('should throw an error if order does not meet the minimum quantity requirement', async () => {
    const mockOrder: Partial<IOrder> = {
      id: 'order-123',
      resaleId: 'resale-456',
      items: [{ productId: 'p123', quantity: 500 }],
    }

    mockOrderRepository.findById.mockResolvedValue(mockOrder as IOrder)

    await expect(service.execute(mockOrder as IOrder)).rejects.toThrow(
      'Order does not meet the minimum quantity requirement'
    )

    expect(logger.warn).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Order below minimum quantity requirement',
        orderId: mockOrder.id,
        totalItems: 500,
      })
    )
  })

  it('should throw an error if distributor fails to process the order', async () => {
    const mockOrder: Partial<IOrder> = {
      id: 'order-123',
      resaleId: 'resale-456',
      items: [
        { productId: 'p123', quantity: 500 },
        { productId: 'p456', quantity: 600 },
      ],
    }

    mockOrderRepository.findById.mockResolvedValue(mockOrder as IOrder)
    mockDistributorRepository.sendOrder.mockResolvedValue({
      success: false,
    })

    await expect(service.execute(mockOrder as IOrder)).rejects.toThrow(
      'Failed to send order to Distributor'
    )

    expect(logger.error).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Failed to send order to distributor',
        orderId: mockOrder.id,
      })
    )
  })

  it('should log an unexpected error and throw it', async () => {
    const mockOrder: Partial<IOrder> = {
      id: 'order-123',
      resaleId: 'resale-456',
      items: [
        { productId: 'p123', quantity: 500 },
        { productId: 'p456', quantity: 600 },
      ],
    }

    mockOrderRepository.findById.mockResolvedValue(mockOrder as IOrder)
    mockDistributorRepository.sendOrder.mockRejectedValue(
      new Error('Unexpected network error')
    )

    await expect(service.execute(mockOrder as IOrder)).rejects.toThrow(
      'Unexpected network error'
    )

    expect(logger.error).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Unexpected error sending order to distributor',
        orderId: mockOrder.id,
        error: 'Unexpected network error',
      })
    )
  })
})
