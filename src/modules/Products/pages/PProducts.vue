<template>
  <CSearch />
  <div>
    <div class="flex items-center justify-between">
      <h1 class="mb-4 font-bold text-[32px]">Топ товары</h1>
      <el-button type="primary" @click="$router.push({ name: 'CreateProduct' })"
        >Create product</el-button
      >
    </div>
    <div class="grid grid-cols-1 gap-3">
      <CCard :card="false" :data="index" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import CCard from '@/components/CCard.vue'
import CSearch from '@/components/CSearch.vue'
import { index } from '@/data'
</script>
