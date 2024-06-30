import { useApi } from '@/composables/useApi.ts'
import { IProduct } from '@/modules/Products/types.ts'

export const createProduct = (data: IProduct) => {
  return new Promise((resolve, reject) => {
    useApi()
      .$post('products/addProduct', data)
      .then((res) => {
        resolve(res)
      })
      .catch((err) => {
        reject(err)
      })
  })
}
