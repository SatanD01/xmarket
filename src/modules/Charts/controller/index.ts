import { useApi } from '@/composables/useApi.ts'

export const getDailyReport = (time) => {
  return new Promise((resolve, reject) => {
    useApi()
      .$post('/Reports/GetDailySalesReport', {
        startDate: `${time}T00:00:00Z`,
      })
      .then((res) => {
        resolve(res?.data)
      })
      .catch((err) => {
        reject(err)
      })
  })
}
export const getWeeklyReport = (time) => {
  return new Promise((resolve, reject) => {
    useApi()
      .$post('/Reports/GetWeeklySalesReport', {
        startDate: `${time}T00:00:00Z`,
      })
      .then((res) => {
        resolve(res?.data)
      })
      .catch((err) => {
        reject(err)
      })
  })
}
export const getMonthlyReport = (time) => {
  return new Promise((resolve, reject) => {
    useApi()
      .$post('/Reports/GetMonthlySalesReport', {
        startDate: `${time}T00:00:00Z`,
      })
      .then((res) => {
        resolve(res?.data)
      })
      .catch((err) => {
        reject(err)
      })
  })
}
