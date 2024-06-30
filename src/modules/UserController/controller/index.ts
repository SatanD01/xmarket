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