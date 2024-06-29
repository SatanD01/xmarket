<template>
  <div class="md:p-3 md:bg-white md:shadow md:rounded-lg">
    <div class="flex items-center justify-between mb-3">
      <h3 class="text-[24px] font-bold">Офисы</h3>
      <el-button @click="$router.push({ name: 'CreateOffice' })" type="primary"
        >Create office</el-button
      >
    </div>
    <div class="grid md:grid-cols-5 grid-cols-1 gap-3">
      <COfficeCard v-for="(elem, i) in offices" :key="i" :office="elem" />
    </div>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue'

import { useApi } from '@/composables/useApi.ts'
import COfficeCard from '@/modules/Offices/components/COfficeCard.vue'
import { IOffice } from '@/modules/Offices/types.ts'

const offices = ref<IOffice[] | undefined>()

onMounted(async () => {
  await useApi()
    .$get('/locations/getLocations')
    .then((res) => {
      console.log(res)
      offices.value = res.data
    })
    .catch((err) => {
      console.log(err)
    })
})
</script>
<style scoped></style>
