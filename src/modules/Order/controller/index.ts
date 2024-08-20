import { toast } from 'vue3-toastify'

import { useApi } from '@/composables/useApi.ts'
import { IProduct } from '@/modules/Products/types.ts'

export const getSaleOrders = () => {
  return new Promise((resolve, reject) => {
    useApi()
      .$get('inventory/getSaleOrders')
      .then((res) => {
        resolve(res.data)
      })
      .catch((err) => {
        reject(err)
      })
  })
}

export const getAllProducts = (id: string) => {
  return new Promise((resolve, reject) => {
    useApi()
      .$post('inventory/getAvailableInventoryItems', { id: id })
      .then((res) => {
        resolve(res.data)
      })
      .catch((err) => {
        toast.error(
          'Выберите другой магазин или клиента. Возможно в магазине нету товаров',
        )
        reject(err)
      })
  })
}

export const addProductItem = (data: IProduct) => {
  return new Promise((resolve, reject) => {
    useApi()
      .$post('inventory/addSaleOrder', data)
      .then((res) => {
        resolve(res)
      })
      .catch((err) => {
        reject(err)
      })
  })
}

export const processSaleOrder = (id: number) => {
  return new Promise((resolve, reject) => {
    useApi()
      .$post('inventory/processSaleOrder', { id: id })
      .then((res) => {
        resolve(res)
      })
      .catch((err) => {
        reject(err)
      })
  })
}

export const deleteTemOrder = (id: number) => {
  return new Promise((resolve, reject) => {
    useApi()
      .$post('inventory/deleteOrder', { id: id })
      .then((res) => {
        resolve(res)
      })
      .catch((err) => {
        reject(err)
      })
  })
}

// export const addSaleOrderItem = (data) => {
//   return new Promise((resolve, reject) => {
//     useApi()
//       .$post('inventory/addOrderItem', data)
//       .then((res) => {
//         resolve(res)
//       })
//       .catch((err) => {
//         reject(err)
//       })
//   })
// }
//
// export const deleteSaleOrderItem = (id: number, orderId: number) => {
//   return new Promise((resolve, reject) => {
//     useApi()
//       .$post('inventory/deleteOrderItem', { id: id, orderId: orderId })
//       .then((res) => {
//         resolve(res)
//       })
//       .catch((err) => {
//         reject(err)
//       })
//   })
// }
