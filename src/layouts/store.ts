import { defineStore } from 'pinia'
import { useWindowSize } from '@vueuse/core'
const { width } = useWindowSize()
export const useLayoutStore = defineStore('layoutStore', {
  state: () => ({
    langDialog: false,
    isSidebarOpen: width.value < 768,
    blockRoutesList: [],
    loginForm: {
      phone_or_email: '',
      password: '',
    },
  }),
})
