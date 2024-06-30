<template>
  <div class="bg-white p-3 shadow rounded-lg" v-if="suppliers">
    <h3 class="text-[24px] font-bold mb-3">Поставщики</h3>
    <div>
      <Vue3EasyDataTable :headers="headers" :items="suppliers" />
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import type { Header, Item } from 'vue3-easy-data-table'
import Vue3EasyDataTable from 'vue3-easy-data-table'

import { getSuppliers } from '@/modules/UserController/controller'
import { ISuppliers } from '@/modules/UserController/types'

let suppliers: Ref<ISuppliers> = ref()
const headers: Header[] = [
  { text: 'Id', value: 'id' },
  { text: 'Тип', value: 'type' },
  { text: 'Имя', value: 'name', sortable: true },
  { text: 'Описание', value: 'description', sortable: true },
  { text: 'Телефон', value: 'phone', sortable: true },
  { text: 'Создан', value: 'createdAt', sortable: true }
]
onMounted(async () => {
  suppliers.value = await getSuppliers()
})
</script>
<style scoped></style>
