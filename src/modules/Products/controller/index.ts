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

export const getProducts = () => {
  return new Promise((resolve, reject) => {
    useApi()
      .$get('products/getProducts')
      .then((res) => {
        resolve(res.data)
      })
      .catch((err) => {
        reject(err)
      })
  })
}

export const updateProduct = (data: IProduct) => {
  return new Promise((resolve, reject) => {
    useApi()
      .$post('products/updateProduct', data)
      .then((res) => {
        resolve(res.data)
      })
      .catch((err) => {
        reject(err)
      })
  })
}

export const deleteProduct = (id: number) => {
  return new Promise((resolve, reject) => {
    useApi()
      .$post('products/deleteProduct', { id: id })
      .then((res) => {
        resolve(res.data)
      })
      .catch((err) => {
        reject(err)
      })
  })
}
