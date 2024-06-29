import { defineStore } from 'pinia'

export const useLayoutStore = defineStore('layoutStore', {
  state: () => ({
    langDialog: false,
    isSidebarOpen: false,
    blockRoutesList: [],
    loginForm: {
      phone_or_email: '',
      password: '',
    },
  }),
})
