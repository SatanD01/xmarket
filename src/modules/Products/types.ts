export interface IProduct {
  id?: number | null
  name: string
  description: string
  manufacturer: string
  origin: string
  carModel: string
  carYear: string
  group: string
  partNumber: string
  manualCode: string
  weight: number | string
  imageString: string
  image?: string
}
