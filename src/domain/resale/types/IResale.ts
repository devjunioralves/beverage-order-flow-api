export interface IResale {
  id: string
  cnpj: string
  corporateName: string
  tradeName: string
  email: string
  phones?: string[]
  contacts: { name: string; isPrimary: boolean }[]
  deliveryAddresses: string[]
}
