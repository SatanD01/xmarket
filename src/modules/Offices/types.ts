export interface IOffice {
  id?: number | string
  name: string
  description: string
  address: string
  addressUrl: string
  type: string
  createdAt?: string | Date | null
  updatedAt?: string | Date | null
}
