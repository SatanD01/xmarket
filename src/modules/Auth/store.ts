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
      return localStorage.getItem('token')
    },
    fetchUser() {
      return new Promise((resolve, reject) => {
        useApi()
          .$get<IUser>('/users/getuser')
          .then((res) => {
            console.log(res)
            this.user = res?.data
            this.loggedIn = true
            resolve(res)
          })
          .catch((err) => {
            console.log(err)
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
