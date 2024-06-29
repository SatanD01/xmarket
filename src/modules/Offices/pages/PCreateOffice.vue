<template>
  <div class="bg-white rounded-lg shadow p-3">
    <h2 class="text-[24px] font-bold mb-3">Создать офис</h2>
    <div class="grid md:grid-cols-4 grid-cols-1 gap-3">
      <el-input v-model="officeData.name" placeholder="Name" />
      <el-input v-model="officeData.description" placeholder="Description" />
      <el-input v-model="officeData.address" placeholder="Address" />
      <el-input v-model="officeData.addressUrl" placeholder="Link" />
      <el-select v-model="officeData.type" placeholder="Type">
        <el-option
          v-for="item in officeTypes"
          :key="item"
          :label="item"
          :value="item"
        />
      </el-select>
      <el-button @click="createOffice" type="primary">Добавить</el-button>
      <el-button type="primary" class="!ms-0">Все офисы</el-button>
    </div>
  </div>
</template>
<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from 'vue3-toastify'

import { useApi } from '@/composables/useApi.ts'
import { IOffice } from '@/modules/Offices/types.ts'

const router = useRouter()
const officeTypes = ref(['Warehouse'])
const officeData = reactive<IOffice>({
  address: '',
  addressUrl: '',
  description: '',
  name: '',
  type: '',
})

const createOffice = async () => {
  await useApi()
    .$post('locations/addLocation', officeData)
    .then((res) => {
      console.log(res)
      router.push({ name: 'Offices' })
      toast.success('Added successfully.')
    })
    .catch((err) => {
      console.log(err)
    })
}
</script>
<style scoped></style>
