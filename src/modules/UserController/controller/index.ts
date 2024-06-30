import { useApi } from '@/composables/useApi.ts'

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

export const updateSuppliers = (state) => {
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

export const createSuppliers = (state) => {
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

export const updateCustomers = (state) => {
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

export const createCustomers = (state) => {
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