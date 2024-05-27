<template>
  <CSearch />
  <div>
    <h1 class="mb-4 font-bold text-[32px]">Топ товары</h1>
    <div class="grid md:grid-cols-5 grid-cols-1 gap-3">
      <CCard
        :card="false"
        v-for="item in products"
        :data="item"
        :key="item.id"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import CCard from '@/components/CCard.vue'
import CSearch from '@/components/CSearch.vue'
import { products } from '@/data/products.ts'
</script>
