<template>
  <div class="bg-white p-3 shadow rounded-lg">
    <h3 class="text-[24px] font-bold mb-3">Поставщики</h3>
    <div class="grid md:grid-cols-4 grid-cols-1 gap-3">
      {{ suppliers }}
      <Vue3EasyDataTable :headers="headers" :items="items" />
    </div>
  </div>
</template>
<script setup lang="ts">
import 'vue3-easy-data-table/dist/style.css'

import { computed, onMounted, ref } from 'vue'
import type { Header } from 'vue3-easy-data-table'
import Vue3EasyDataTable from 'vue3-easy-data-table'

import { getSuppliers } from '@/modules/UserController/controller'
import { ISuppliers } from '@/modules/UserController/types'

const suppliers = ref<ISuppliers[] | undefined>()
const headers: Header[] = [
  { text: 'Id', value: 'id' },
  { text: 'Тип', value: 'type' },
  { text: 'Имя', value: 'name', sortable: true },
  { text: 'Описание', value: 'description', sortable: true },
  { text: 'Телефон', value: 'phone', sortable: true },
  { text: 'Создан', value: 'createdAt' }
]

const items = computed(
  ():
    | {
        id: number | undefined
        type: string | undefined
        name: string | undefined
        description: string | undefined
        phone: string | undefined
        createdAt: string | undefined
      }[]
    | undefined => {
    return suppliers.value
  },
)
onMounted(async () => {
  console.log(123)
  suppliers.value = await getSuppliers()
  console.log(suppliers.value)
})
</script>
<style scoped></style>
