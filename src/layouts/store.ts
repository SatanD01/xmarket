import { defineStore } from 'pinia'
export const useLayoutStore = defineStore('layoutStore', {
  state: () => ({
    langDialog: false,
    isSidebarOpen: true,
    blockRoutesList: [],
    loginForm: {
      phone_or_email: '',
      password: '',
    },
  }),
})
