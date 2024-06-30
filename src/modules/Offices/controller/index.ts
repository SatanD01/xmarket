import { useApi } from '@/composables/useApi.ts'

export const getOffices = () => {
  return new Promise((resolve, reject) => {
    useApi()
      .$get('/locations/getLocations')
      .then((res) => {
        resolve(res?.data)
      })
      .catch((err) => {
        reject(err)
      })
  })
}
