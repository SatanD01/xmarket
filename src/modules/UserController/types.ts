export interface ISuppliers {
  id?: number | undefined
  type?: string | undefined
  name: string | undefined
  description: string | undefined
  phone: string | undefined
  createdAt?: string | undefined
  updatedAt?: string | undefined
}
export interface IUsers {
  id: number
  login: string
  passwordHash: string
  passwordSalt: string
  role: string
  name: string
  phone: string
  createdAt: string
  updatedAt: null | string
}
export interface ITemplateProducts {
  productId: number | null | undefined
  name?: string | null
  image: string | undefined
  quantity: number | null
  costPrice: number | null
  salePrice: number | null
  product?: {
    name: string | undefined
  }
}
