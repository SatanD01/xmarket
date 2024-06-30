<template>
  <div class="bg-white rounded-lg shadow p-3">
    <h2 class="text-[24px] font-bold mb-3">Создать офис</h2>
    <div class="grid md:grid-cols-4 grid-cols-1 gap-3">
      <el-input
        size="large"
        :class="v$.name.$error ? 'error' : ''"
        v-model="officeData.name"
        placeholder="Name"
      />
      <el-input
        size="large"
        v-model="officeData.description"
        placeholder="Description"
        :class="v$.description.$error ? 'error' : ''"
      />
      <el-input
        size="large"
        v-model="officeData.address"
        placeholder="Address"
        :class="v$.address.$error ? 'error' : ''"
      />
      <el-input
        size="large"
        v-model="officeData.addressUrl"
        placeholder="Link"
        :class="v$.addressUrl.$error ? 'error' : ''"
      />
      <el-select
        size="large"
        v-model="officeData.type"
        :class="v$.type.$error ? 'error' : ''"
        placeholder="Type"
      >
        <el-option
          v-for="item in officeTypes"
          :key="item"
          :label="item"
          :value="item"
        />
      </el-select>
      <el-button size="large" @click="createOffice" type="primary"
        >Добавить</el-button
      >
      <el-button
        size="large"
        @click="$router.push({ name: 'Offices' })"
        type="primary"
        class="!ms-0"
        >Все офисы</el-button
      >
    </div>
  </div>
</template>
<script setup lang="ts">
import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from 'vue3-toastify'

import { useApi } from '@/composables/useApi.ts'
import { IOffice } from '@/modules/Offices/types.ts'

const router = useRouter()
const officeTypes = ref(['Warehouse'])
const rules = {
  address: { required },
  addressUrl: { required },
  description: { required },
  name: { required },
  type: { required },
}
const officeData = reactive<IOffice>({
  address: '',
  addressUrl: '',
  description: '',
  name: '',
  type: '',
})
const v$ = useVuelidate(rules, officeData)
const createOffice = async () => {
  v$.value.$touch()
  if (v$.value.$invalid) return
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
