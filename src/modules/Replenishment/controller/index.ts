import { useApi } from '@/composables/useApi.ts'
import { IProduct } from '@/modules/Products/types.ts'

export const addProductItem = (data: IProduct) => {
  return new Promise((resolve, reject) => {
    useApi()
      .$post('inventory/addOrderItem', data)
      .then((res) => {
        resolve(res)
      })
      .catch((err) => {
        reject(err)
      })
  })
}
