import { useApi } from '@/composables/useApi.ts'

export const getDailyReport = (time) => {
  return new Promise((resolve, reject) => {
    useApi()
      .$post('/Reports/GetDailySalesReport', {
        startDate: '2024-07-14T19:03:37.498799Z',
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
        startDate: '2024-07-14T19:03:37.498799Z',
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
        startDate: '2024-07-14T19:03:37.498799Z',
      })
      .then((res) => {
        resolve(res?.data)
      })
      .catch((err) => {
        reject(err)
      })
  })
}
