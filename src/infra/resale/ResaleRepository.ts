import { injectable } from 'tsyringe'
import { Repository } from 'typeorm'
import { IResaleRepository } from '../../domain/resale/infra/IResaleRepository'
import { Resale } from '../../domain/resale/models/Resale'
import { IResale } from '../../domain/resale/types/IResale'
import { AppDataSource } from '../database/connection'

@injectable()
export class ResaleRepository implements IResaleRepository {
  private ormRepository: Repository<Resale>

  constructor() {
    this.ormRepository = AppDataSource.getRepository(Resale)
  }

  async create(data: Omit<IResale, 'id'>): Promise<IResale> {
    const resale = this.ormRepository.create(data)
    await this.ormRepository.save(resale)
    return resale
  }

  async findByCnpj(cnpj: string): Promise<IResale | null> {
    return this.ormRepository.findOne({ where: { cnpj } })
  }
}
