<template>
  <div class="">
    <div
      class="flex items-center justify-between mb-3 gap-3 p-3 bg-white shadow rounded-lg"
    >
      <h3 class="text-[24px] font-bold">Магазины и склады</h3>
      <el-button @click="$router.push({ name: 'CreateOffice' })" type="primary"
        >Создать магазин\склад</el-button
      >
    </div>
    <div
      class="grid md:grid-cols-5 grid-cols-1 gap-3 md:p-3 md:bg-white md:shadow md:rounded-lg"
    >
      <COfficeCard v-for="(elem, i) in offices" :key="i" :office="elem" />
    </div>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue'

import COfficeCard from '@/modules/Offices/components/COfficeCard.vue'
import { getOffices } from '@/modules/Offices/controller'
import { IOffice } from '@/modules/Offices/types.ts'

const offices = ref<IOffice[] | undefined>()

onMounted(async () => {
  offices.value = await getOffices()
})
</script>
<style scoped></style>
