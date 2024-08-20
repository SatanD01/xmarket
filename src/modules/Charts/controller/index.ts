import { useApi } from '@/composables/useApi.ts'

export const getSalesReports = (start, end) => {
  return new Promise((resolve, reject) => {
    useApi()
      .$post('/Reports/GetSalesReport', {
        startDate: `${start}T00:00:00Z`,
        endDate: `${end}T00:00:00Z`,
      })
      .then((res) => {
        resolve(res?.data)
      })
      .catch((err) => {
        reject(err)
      })
  })
}
