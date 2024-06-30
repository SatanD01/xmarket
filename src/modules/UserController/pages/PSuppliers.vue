<template>
  <div class="bg-white p-3 shadow rounded-lg">
    <h3 class="text-[24px] font-bold mb-3">Поставщики</h3>
    <div class="grid md:grid-cols-4 grid-cols-1 gap-3">
      <Vue3EasyDataTable :headers="headers" :items="items"> </Vue3EasyDataTable>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Header, Item } from 'vue3-easy-data-table'
import Vue3EasyDataTable from 'vue3-easy-data-table'
import { useApi } from "@/composables/useApi.ts"

const suppliers = ref(null)
const headers: Header[] = [
  { text: 'Id', value: 'id' },
  { text: 'Тип', value: 'type' },
  { text: 'Имя', value: 'name', sortable: true },
  { text: 'Описание', value: 'description', sortable: true },
  { text: 'Телефон', value: 'phone', sortable: true },
  { text: 'Создан', value: 'createdAt', sortable: true },
]

const getSuppliers = async () => {
  await useApi()
    .$get('/Partners/GetSuppliers')
    .then((res) => {
      suppliers.value = res.data
    })
}

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
    return suppliers.value?.map((item) => {
      return {
        id: item.id,
        type: item?.type,
        name: item?.name,
        description: item?.description,
        phone: item?.phone,
        createdAt: item?.createdAt,
      }
    })
  },
)
console.log(suppliers.value)
getSuppliers()
</script>
<style scoped></style>
