import { tokens } from '@di/tokens'
import { IResale } from '@domain/resale/types/IResale'
import { IResaleService } from '@domain/resale/types/IResaleService'
import { inject, injectable } from 'tsyringe'

@injectable()
export default class ResaleAppService {
  constructor(
    @inject(tokens.ResaleService)
    private resaleService: IResaleService
  ) {}
  async create(data: IResale): Promise<IResale> {
    return await this.resaleService.create(data)
  }
}
