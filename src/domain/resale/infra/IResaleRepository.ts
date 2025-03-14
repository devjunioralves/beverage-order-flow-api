import { IResale } from '../types/IResale'

export interface IResaleRepository {
  create(data: Omit<IResale, 'id'>): Promise<IResale>
  findByCnpjOrEmail(cnpj: string, email: string): Promise<IResale | null>
  findById(id: string): Promise<IResale | null>
}
