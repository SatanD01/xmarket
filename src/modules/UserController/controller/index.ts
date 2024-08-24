import { toast } from 'vue3-toastify'

import { useApi } from '@/composables/useApi.ts'
import { ISuppliers } from '@/modules/UserController/types.ts'

export const getSuppliers = () => {
  return new Promise((resolve, reject) => {
    useApi()
      .$get('/Partners/GetSuppliers')
      .then((res) => {
        resolve(res.data)
      })
      .catch((err) => {
        reject(err)
      })
  })
}

export const updateSuppliers = (state: ISuppliers) => {
  return new Promise((resolve, reject) => {
    useApi()
      .$post('/Partners/UpdateSupplier', state)
      .then((res) => {
        resolve(res.data)
      })
      .catch((err) => {
        reject(err)
      })
  })
}

export const createSuppliers = (state: ISuppliers) => {
  return new Promise((resolve, reject) => {
    useApi()
      .$post('/Partners/AddSupplier', state)
      .then((res) => {
        resolve(res.data)
      })
      .catch((err) => {
        reject(err)
      })
  })
}

export const getCustomers = () => {
  return new Promise((resolve, reject) => {
    useApi()
      .$get('/Partners/GetCustomers')
      .then((res) => {
        resolve(res.data)
      })
      .catch((err) => {
        reject(err)
      })
  })
}

export const updateCustomers = (state: ISuppliers) => {
  return new Promise((resolve, reject) => {
    useApi()
      .$post('/Partners/UpdateCustomer', state)
      .then((res) => {
        resolve(res.data)
      })
      .catch((err) => {
        reject(err)
      })
  })
}

export const ordersCustomers = (state) => {
  return new Promise((resolve, reject) => {
    useApi()
      .$post('/Inventory/GetSaleOrdersByPartnerId', { id: state })
      .then((res) => {
        resolve(res.data)
      })
      .catch((err) => {
        reject(err)
      })
  })
}

export const ordersSuppliers = (state) => {
  return new Promise((resolve, reject) => {
    useApi()
      .$post('/Inventory/GetReplenishmentOrdersByPartnerId', { id: state })
      .then((res) => {
        resolve(res.data)
      })
      .catch((err) => {
        reject(err)
      })
  })
}

export const createCustomers = (state: ISuppliers) => {
  return new Promise((resolve, reject) => {
    useApi()
      .$post('/Partners/AddCustomer', state)
      .then((res) => {
        resolve(res.data)
      })
      .catch((err) => {
        reject(err)
      })
  })
}
