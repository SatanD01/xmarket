<template>
  <div v-if="products">
    <div>
      <div
        class="bg-white gap-3 shadow rounded-lg mb-3 p-3 flex items-center justify-between"
      >
        <h1 class="font-bold text-[32px]">Товары</h1>
        <el-button
          type="primary"
          @click="$router.push({ name: 'CreateProduct' })"
          >Создать товар</el-button
        >
      </div>
      <div class="bg-white p-3 rounded-lg shadow">
        <el-input
          placeholder="Search"
          class="mb-3 md:!w-[300px]"
          size="large"
          v-model="searchValue"
        />
        <Vue3EasyDataTable
          :headers="headers"
          :items="items"
          :search-field="[
            'id',
            'name',
            'description',
            'manufacturer',
            'origin',
            'carModel',
            'carYear',
            'group',
            'partNumber',
            'manualCode',
            'weight',
          ]"
          :search-value="searchValue"
        >
          <template #item-image="item">
            <div class="py-3">
              <el-image
                style="width: 80px; height: 60px"
                :src="`data:image/jpeg;base64,${item.image}`"
                :zoom-rate="1.0"
                :max-scale="5"
                :min-scale="0.2"
                :preview-src-list="[`data:image/jpeg;base64,${item.image}`]"
                :initial-index="4"
                fit="cover"
              />
            </div>
          </template>
        </Vue3EasyDataTable>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, Ref, ref } from 'vue'
import type { Header, Item } from 'vue3-easy-data-table'
import Vue3EasyDataTable from 'vue3-easy-data-table'

import { getProducts } from '@/modules/Products/controller'
import { IProduct } from '@/modules/Products/types.ts'

const searchValue = ref('')
const products: Ref<IProduct[] | undefined> = ref()
const headers: Header[] = [
  { text: 'Id', value: 'id', sortable: true },
  { text: 'Фото', value: 'image' },
  { text: 'Название', value: 'name', sortable: true },
  { text: 'Описание', value: 'description', sortable: true },
  { text: 'Поставщик', value: 'manufacturer', sortable: true },
  { text: 'Тип', value: 'origin', sortable: true },
  { text: 'Модель', value: 'carModel', sortable: true },
  { text: 'Год выпуска', value: 'carYear', sortable: true },
  { text: 'Группа', value: 'group', sortable: true },
  { text: 'Баркод', value: 'partNumber', sortable: true },
  { text: 'Код', value: 'manualCode', sortable: true },
  { text: 'Вес', value: 'weight', sortable: true },
]

const items = computed((): Item[] | undefined => {
  return products.value
})

onMounted(async () => {
  products.value = await getProducts()
  console.log(products.value)
})
</script>
