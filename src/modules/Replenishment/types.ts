export interface IReplenishment {
  id: number
  type: string
  sourceType: string
  sourceId: number
  destinationType: string
  destinationId: number
  userId: number
  status: 'Template' | 'Completed'
  paymentType: string
  items: IReplenishmentItem[]
  createdAt: string
  updatedAt: null | Date | string
}

interface IReplenishmentItem {
  id: number
  orderId: number
  productId: number
  product: {
    id: number
    name: string
    description: string
    image: string
    manufacturer: string
    origin: string
    carModel: string
    carYear: string
    group: string
    partNumber: string
    manualCode: string
    weight: number
    createdAt: string | Date
    updatedAt: string | Date
  }
  quantity: number
  costPrice: number
  salePrice: number
  createdAt: string | Date
  updatedAt: null | string | Date
}
