import { defineStore } from 'pinia'

export const useMainStore = defineStore('main', {
  state: () => ({
    count: 0,
    loading: false,
  }),
  getters: {
    getCount: (state) => state.count,
  },
  actions: {
    doubleIncrement() {
      this.count += 2
    },
  },
})
