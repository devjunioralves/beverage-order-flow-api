import { IResaleRepository } from '../../infra/IResaleRepository'
import { IResale } from '../../types/IResale'
import ResaleService from '../ResaleService'

describe('ResaleService', () => {
  let resaleService: ResaleService
  let mockResaleRepository: jest.Mocked<IResaleRepository>

  beforeEach(() => {
    mockResaleRepository = {
      create: jest.fn(),
      findByCnpj: jest.fn(),
    } as jest.Mocked<IResaleRepository>

    resaleService = new ResaleService(mockResaleRepository)
  })

  it('should create a resale successfully', async () => {
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

    mockResaleRepository.create.mockResolvedValue(mockResale)

    const result = await resaleService.create(mockResale)

    expect(result).toEqual(mockResale)
    expect(mockResaleRepository.create).toHaveBeenCalledWith(mockResale)
    expect(mockResaleRepository.create).toHaveBeenCalledTimes(1)
  })

  it('should find a resale by CNPJ', async () => {
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

    mockResaleRepository.findByCnpj.mockResolvedValue(mockResale)

    const result = await resaleService.findByCnpj('12345678000195')

    expect(result).toEqual(mockResale)
    expect(mockResaleRepository.findByCnpj).toHaveBeenCalledWith(
      '12345678000195'
    )
    expect(mockResaleRepository.findByCnpj).toHaveBeenCalledTimes(1)
  })

  it('should return null if resale is not found', async () => {
    mockResaleRepository.findByCnpj.mockResolvedValue(null)

    const result = await resaleService.findByCnpj('12345678000195')

    expect(result).toBeNull()
    expect(mockResaleRepository.findByCnpj).toHaveBeenCalledWith(
      '12345678000195'
    )
    expect(mockResaleRepository.findByCnpj).toHaveBeenCalledTimes(1)
  })

  it('should throw an error if repository create fails', async () => {
    mockResaleRepository.create.mockRejectedValue(new Error('Database error'))

    await expect(
      resaleService.create({
        id: 'resale-123',
        cnpj: '12345678000195',
        corporateName: 'Empresa Teste LTDA',
        tradeName: 'Empresa Teste',
        email: 'teste@empresa.com',
        phones: ['11999999999'],
        contacts: [{ name: 'João', isPrimary: true }],
        deliveryAddresses: ['Rua Exemplo, 123'],
      })
    ).rejects.toThrow('Database error')

    expect(mockResaleRepository.create).toHaveBeenCalledTimes(1)
  })

  it('should throw an error if repository findByCnpj fails', async () => {
    mockResaleRepository.findByCnpj.mockRejectedValue(
      new Error('Database error')
    )

    await expect(resaleService.findByCnpj('12345678000195')).rejects.toThrow(
      'Database error'
    )

    expect(mockResaleRepository.findByCnpj).toHaveBeenCalledTimes(1)
  })
})
