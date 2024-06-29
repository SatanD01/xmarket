import { defineStore } from 'pinia'

import { useApi } from '@/composables/useApi'
import { IUser } from '@/modules/Auth/types'
import type { IResponse } from '@/types'

export const useAuthStore = defineStore('authStore1', {
  state: () => ({
    user: null as IUser | null,
    loggedIn: false,
    token: '',
  }),
  actions: {
    getTokens() {
      return localStorage.getItem('token')
    },
    fetchUser() {
      return new Promise((resolve, reject) => {
        useApi()
          .$get<IResponse<IUser>>('/Users/GetUsers')
          .then((res) => {
            this.user = res?.data.data
            this.loggedIn = true
            resolve(res)
          })
          .catch((err) => {
            console.log(err)
            reject(err)
          })
      })
    },
    login(data): Promise<IResponse<{ token: string }>> {
      return new Promise((resolve, reject) => {
        useApi()
          .$post<IResponse<{ token: string }>>('/users/authenticate', data)
          .then((res) => {
            this.token = res.data.data.token
            localStorage.setItem('token', res?.data?.data?.token)
            resolve(res.data)
          })
          .catch((err) => {
            reject(err)
          })
      })
    },
    async logout() {
      localStorage.removeItem('token')
      this.user = null
      this.loggedIn = false
    },
  },
})
