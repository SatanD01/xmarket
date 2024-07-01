<template>
  <div v-if="products">
    <CSearch />
    <div>
      <div class="flex items-center justify-between">
        <h1 class="mb-4 font-bold text-[32px]">Топ товары</h1>
        <el-button
          type="primary"
          @click="$router.push({ name: 'CreateProduct' })"
          >Create product</el-button
        >
      </div>
      <div>
        <Vue3EasyDataTable :headers="headers" :items="items">
          <template #item-image="data">
            <div class="w-[100px] py-3">
              {{ data.image }}
              <!--              <img-->
              <!--                class="w-[100px]"-->
              <!--                :src="`data:image/jpeg;base64,${data.image}`"-->
              <!--                alt=""-->
              <!--              />-->
              <!--              <el-image-->
              <!--                style="width: 100px; height: 100px"-->
              <!--                :src="`data:image/jpeg;base64,${item.imgString}`"-->
              <!--                :zoom-rate="1.0"-->
              <!--                :max-scale="6"-->
              <!--                :min-scale="0.2"-->
              <!--                :preview-src-list="`data:image/jpeg;base64,${item.imgString}`"-->
              <!--                :initial-index="4"-->
              <!--                fit="cover"-->
              <!--              />-->
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

import CSearch from '@/components/CSearch.vue'
import { getProducts } from '@/modules/Products/controller'
import { IProduct } from '@/modules/Products/types.ts'

const products: Ref<IProduct[] | undefined> = ref()
const headers: Header[] = [
  { text: 'Id', value: 'id' },
  { text: 'Фото', value: 'imageString' },
  { text: 'Name', value: 'name', sortable: true },
  { text: 'Description', value: 'description', sortable: true },
  { text: 'Manufacturer', value: 'manufacturer', sortable: true },
  { text: 'Origin', value: 'origin', sortable: true },
  { text: 'Model', value: 'carModel', sortable: true },
  { text: 'Year', value: 'carYear', sortable: true },
  { text: 'Group', value: 'group', sortable: true },
  { text: 'Part number', value: 'partNumber', sortable: true },
  { text: 'Code', value: 'manualCode', sortable: true },
  { text: 'Weight', value: 'weight', sortable: true },
]

const items = computed((): Item[] | undefined => {
  return products.value
})

onMounted(async () => {
  products.value = await getProducts()
  console.log(products.value)
})
</script>
