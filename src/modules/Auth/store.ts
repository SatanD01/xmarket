import { defineStore } from 'pinia'

import { useApi } from '@/composables/useApi'
import { IUser } from '@/modules/Auth/types'

export const useAuthStore = defineStore('authStore', {
  state: () => ({
    user: null as IUser | null,
    loggedIn: false,
    token: '',
  }),
  actions: {
    getTokens() {
      return localStorage.getItem('access_token')
    },
    setToken(token: string) {
      localStorage.setItem('access_token', token)
    },
    removeToken() {
      localStorage.removeItem('access_token')
    },
    fetchUser() {
      return new Promise((resolve, reject) => {
        useApi()
          .$get<IUser>('/users/getUser')
          .then((res) => {
            this.user = res?.data
            resolve(res.data)
          })
          .catch((err) => {
            reject(err)
          })
      })
    },
    async logout() {
      this.removeToken()
      this.user = null
    },
  },
})
