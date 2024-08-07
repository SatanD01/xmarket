import { useApi } from '@/composables/useApi.ts'
import { IProduct } from '@/modules/Products/types.ts'

export const addProductItem = (data: IProduct) => {
  return new Promise((resolve, reject) => {
    useApi()
      .$post('inventory/addReplenishmentOrder', data)
      .then((res) => {
        resolve(res)
      })
      .catch((err) => {
        reject(err)
      })
  })
}

export const getReplenishmentOrders = () => {
  return new Promise((resolve, reject) => {
    useApi()
      .$get('inventory/getReplenishmentOrders')
      .then((res) => {
        resolve(res.data)
      })
      .catch((err) => {
        reject(err)
      })
  })
}

export const processReplenishmentOrder = (id: number) => {
  return new Promise((resolve, reject) => {
    useApi()
      .$post('inventory/processReplenishmentOrder', { id: id })
      .then((res) => {
        resolve(res)
      })
      .catch((err) => {
        reject(err)
      })
  })
}

export const addOrderItem = (data) => {
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

export const deleteOrderItem = (id: number, orderId: number) => {
  return new Promise((resolve, reject) => {
    useApi()
      .$post('inventory/deleteOrderItem', { id: id, orderId: orderId })
      .then((res) => {
        resolve(res)
      })
      .catch((err) => {
        reject(err)
      })
  })
}
