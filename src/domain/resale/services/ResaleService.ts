import { tokens } from '@di/tokens'
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
    const resale = await this.resaleRepository.create(data)
    return resale
  }

  async findByCnpj(cnpj: string): Promise<IResale | null> {
    return this.resaleRepository.findByCnpj(cnpj)
  }
}
