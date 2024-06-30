<template>
  <h3 class="text-[24px] font-bold mb-3">Создать заказ</h3>
  <CSearch />
  <div class="grid grid-cols-1 gap-3">
    <CCard :card="false" :data="index" />
  </div>
</template>
<script setup lang="ts">
import CCard from '@/components/CCard.vue'
import CSearch from '@/components/CSearch.vue'
import { index } from '@/data'
</script>
<style scoped></style>
