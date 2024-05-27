import { defineStore } from 'pinia'

export const useBasketStore = defineStore('basketStore', {
  state: () => ({
    basketItems: [] as { id: number; count: number }[],
  }),
})
