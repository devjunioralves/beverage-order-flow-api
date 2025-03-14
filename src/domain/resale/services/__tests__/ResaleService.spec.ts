import { BaseError } from '@shared/exceptions/BaseError'
import { IResaleRepository } from '../../infra/IResaleRepository'
import { IResale } from '../../types/IResale'
import ResaleService from '../ResaleService'

describe('ResaleService', () => {
  let resaleService: ResaleService
  let mockResaleRepository: jest.Mocked<IResaleRepository>

  beforeEach(() => {
    mockResaleRepository = {
      create: jest.fn(),
      findByCnpjOrEmail: jest.fn(),
      findById: jest.fn(),
    } as jest.Mocked<IResaleRepository>

    resaleService = new ResaleService(mockResaleRepository)
  })

  it('should create a resale successfully when CNPJ and email are unique', async () => {
    const mockResale: IResale = {
      id: 'resale-123',
      cnpj: '12345678000195',
      corporateName: 'Empresa Teste LTDA',
      tradeName: 'Empresa Teste',
      email: 'teste@empresa.com',
      phones: ['11999999999'],
      contacts: [{ name: 'João', isPrimary: true }],
      deliveryAddresses: ['Rua Exemplo, 123'],
    }

    mockResaleRepository.findByCnpjOrEmail.mockResolvedValue(null)
    mockResaleRepository.create.mockResolvedValue(mockResale)

    const result = await resaleService.create(mockResale)

    expect(result).toEqual(mockResale)
    expect(mockResaleRepository.findByCnpjOrEmail).toHaveBeenCalledWith(
      mockResale.cnpj,
      mockResale.email
    )
    expect(mockResaleRepository.create).toHaveBeenCalledWith(mockResale)
  })

  it('should throw an error if a resale with the same CNPJ or email already exists', async () => {
    const existingResale: IResale = {
      id: 'resale-123',
      cnpj: '12345678000195',
      corporateName: 'Empresa Existente',
      tradeName: 'Empresa Existente',
      email: 'teste@empresa.com',
      phones: ['11999999999'],
      contacts: [{ name: 'João', isPrimary: true }],
      deliveryAddresses: ['Rua Exemplo, 123'],
    }

    mockResaleRepository.findByCnpjOrEmail.mockResolvedValue(existingResale)

    await expect(
      resaleService.create({
        id: 'resale-456',
        cnpj: '12345678000195',
        corporateName: 'Nova Empresa',
        tradeName: 'Nova Empresa',
        email: 'teste@empresa.com',
        phones: ['11999999999'],
        contacts: [{ name: 'Maria', isPrimary: true }],
        deliveryAddresses: ['Rua Nova, 456'],
      })
    ).rejects.toThrow(BaseError)

    expect(mockResaleRepository.findByCnpjOrEmail).toHaveBeenCalledWith(
      '12345678000195',
      'teste@empresa.com'
    )
    expect(mockResaleRepository.create).not.toHaveBeenCalled()
  })

  it('should throw an error if repository create fails', async () => {
    mockResaleRepository.findByCnpjOrEmail.mockResolvedValue(null)
    mockResaleRepository.create.mockRejectedValue(new Error('Database error'))

    await expect(
      resaleService.create({
        id: 'resale-789',
        cnpj: '22345678000195',
        corporateName: 'Empresa Nova',
        tradeName: 'Empresa Nova',
        email: 'nova@empresa.com',
        phones: ['11988888888'],
        contacts: [{ name: 'Carlos', isPrimary: true }],
        deliveryAddresses: ['Rua Nova, 789'],
      })
    ).rejects.toThrow('Database error')

    expect(mockResaleRepository.create).toHaveBeenCalledTimes(1)
  })
})
