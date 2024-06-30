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
