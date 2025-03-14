import { tokens } from '@di/tokens'
import { BaseError } from '@shared/exceptions/BaseError'
import { inject, injectable } from 'tsyringe'
import { IResaleRepository } from '../infra/IResaleRepository'
import { IResale } from '../types/IResale'
import { IResaleService } from '../types/IResaleService'

@injectable()
export default class ResaleService implements IResaleService {
  constructor(
    @inject(tokens.ResaleRepository)
    private resaleRepository: IResaleRepository
  ) {}

  async create(data: IResale): Promise<IResale> {
    const existingResale = await this.resaleRepository.findByCnpjOrEmail(
      data.cnpj,
      data.email
    )

    if (existingResale) {
      throw new BaseError({
        message: 'A resale with this CNPJ or email already exists.',
        name: 'DuplicateEntryError',
        statusCode: 409,
      })
    }

    return this.resaleRepository.create(data)
  }
}
