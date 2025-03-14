import { IResale } from './IResale'

export interface IResaleService {
  create(data: IResale): Promise<IResale>
}
