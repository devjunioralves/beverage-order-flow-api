import ResaleAppService from '@application/resale/ResaleAppService'
import { tokens } from '@di/tokens'
import { IResale } from '@domain/resale/types/IResale'
import { IResaleService } from '@domain/resale/types/IResaleService'
import { jest } from '@jest/globals'
import ResaleCreateController from '@presentation/http/controllers/resale/ResaleCreateController'
import { IRequest } from '@presentation/http/types/IRequest'
import { BaseError } from '@shared/exceptions/BaseError'
import 'reflect-metadata'
import { container } from 'tsyringe'

jest.mock('@application/resale/ResaleAppService')

describe('ResaleCreateController', () => {
  let controller: ResaleCreateController
  let resaleAppService: jest.Mocked<ResaleAppService>

  beforeEach(() => {
    const mockResaleService = {} as jest.Mocked<IResaleService>
    resaleAppService = new ResaleAppService(
      mockResaleService
    ) as jest.Mocked<ResaleAppService>
    container.register(tokens.ResaleAppService, { useValue: resaleAppService })
    controller = container.resolve(ResaleCreateController)
  })

  it('should create resale with success', async () => {
    const request: IRequest = {
      body: {
        cnpj: '12345678000195',
        corporateName: 'Razão Social',
        tradeName: 'Nome Fantasia',
        email: 'test@example.com',
        phones: ['1234567890'],
        contacts: [{ name: 'Contato Primário', isPrimary: true }],
        deliveryAddresses: ['Endereco 1'],
      },
      params: {},
      query: {},
      headers: {},
    }

    resaleAppService.create.mockResolvedValue({
      id: 'uuid1234',
      ...request.body,
    } as IResale)

    const response: { statusCode: number; body: any } | Record<string, any> =
      await controller.execute(request)

    expect(response.data.id).toBe('uuid1234')
    expect(resaleAppService.create).toHaveBeenCalledWith(request.body)
  })

  it('should return validation error when cnpj is invalid', async () => {
    const request: IRequest = {
      body: {
        cnpj: '12345678',
        corporateName: 'Razão Social',
        tradeName: 'Nome Fantasia',
        email: 'test@example.com',
        phones: ['1234567890'],
        contacts: [{ name: 'Contato Primário', isPrimary: true }],
        deliveryAddresses: ['Endereco 1'],
      },
      params: {},
      query: {},
      headers: {},
    }

    const response: { statusCode: number; body: any } | Record<string, any> =
      await controller.execute(request)

    expect(response.error.message.value).toBe(
      '"cnpj" contains an invalid value'
    )
  })

  it('should return validation error when primary contact is not provided', async () => {
    const request: IRequest = {
      body: {
        cnpj: '12345678000195',
        corporateName: 'Razão Social',
        tradeName: 'Nome Fantasia',
        email: 'test@example.com',
        phones: ['1234567890'],
        contacts: [{ name: 'Contato Secundário', isPrimary: false }],
        deliveryAddresses: ['Endereco 1'],
      },
      params: {},
      query: {},
      headers: {},
    }

    const response: { statusCode: number; body: any } | Record<string, any> =
      await controller.execute(request)

    expect(response.error.message.value).toBe('"contacts" is required')
  })

  it('should return error when service fails', async () => {
    const request: IRequest = {
      body: {
        cnpj: '12345678000195',
        corporateName: 'Razão Social',
        tradeName: 'Nome Fantasia',
        email: 'test@example.com',
        phones: ['1234567890'],
        contacts: [{ name: 'Contato Primário', isPrimary: true }],
        deliveryAddresses: ['Endereco 1'],
      },
      params: {},
      query: {},
      headers: {},
    }

    resaleAppService.create.mockRejectedValue(
      new BaseError({
        message: 'Erro ao criar revenda',
        name: 'ServiceError',
        statusCode: 500,
      })
    )

    const response: { statusCode: number; body: any } | Record<string, any> =
      await controller.execute(request)

    expect(response.error.message.value).toBe('Erro ao criar revenda')
  })
})
