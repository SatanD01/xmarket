import { useApi } from '@/composables/useApi.ts'

export const getDailyReport = (time) => {
  return new Promise((resolve, reject) => {
    useApi()
      .$post('/Reports/GetDailySalesReport', {
        startDate: '2024-07-09T10:22:46.937737Z',
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
        startDate: '2024-07-09T10:22:46.937737Z',
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
        year: 2024,
        month: 7,
      })
      .then((res) => {
        resolve(res?.data)
      })
      .catch((err) => {
        reject(err)
      })
  })
}
