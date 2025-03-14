import { IResale } from '../types/IResale'

export interface IResaleRepository {
  create(data: Omit<IResale, 'id'>): Promise<IResale>
  findByCnpj(cnpj: string): Promise<IResale | null>
}
