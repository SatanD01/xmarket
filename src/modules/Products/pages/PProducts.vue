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
        <CSearch />
        <Vue3EasyDataTable :headers="headers" :items="products">
          <template #item-img="item">
            <div class="w-[100px] py-3">
              <el-image
                style="width: 100px; height: 100px"
                :src="item.imgString"
                :zoom-rate="1.0"
                :max-scale="6"
                :min-scale="0.2"
                :preview-src-list="item.img_list"
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
import { onMounted, Ref, ref } from 'vue'
import type { Header } from 'vue3-easy-data-table'
import Vue3EasyDataTable from 'vue3-easy-data-table'

import CSearch from '@/components/CSearch.vue'
import { getProducts } from '@/modules/Products/controller'
import { IProduct } from '@/modules/Products/types.ts'

const products: Ref<IProduct[] | undefined> = ref()
const headers: Header[] = [
  { text: 'Id', value: 'id' },
  { text: 'Фото', value: 'imageString' },
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

onMounted(async () => {
  products.value = await getProducts()
  console.log(products.value)
})
</script>
