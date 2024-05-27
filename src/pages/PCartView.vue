<template>
  <div class="grid grid-cols-12 gap-3">
    <div class="col-span-12">
      <el-empty v-if="store.basketItems.length === 0" class="m-auto w-full" description="Ваша корзинка пуста"/>
    </div>
    <div class="md:col-span-8 col-span-12 gap-3 grid" :class="store.basketItems.length === 0 ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-3'">
      <template v-if="store.basketItems.length !== 0">
        <CCard
            card
            v-for="(item, index) in list"
            :data="item"
            :key="index"
            @on-delete="onDelete(item.id)"
        />
      </template>
    </div>
    <div class="md:col-span-4 col-span-12" v-if="store.basketItems.length !== 0">
      <CBuyDetailCard />
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue'

import CBuyDetailCard from '@/components/CBuyDetailCard.vue'
import CCard from '@/components/CCard.vue'
import { useBasketStore } from '@/store/basket.ts'

const store = useBasketStore()
const list = computed(() => store.basketItems)

const onDelete = (index: number) => {
  console.log('index:', index)
  store.basketItems.splice(
    store.basketItems.findIndex((el) => el.id === index),
    1,
  )
}
</script>
<style scoped></style>
