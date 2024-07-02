<template>
  <div v-for="products">
    <div class="grid grid-cols-1 gap-3 bg-white p-3 shadow rounded-lg mb-3">
      <h3 class="text-[24px] font-bold">Пополнение склада</h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
        <el-select v-model="supplier" placeholder="Поставщик">
          <el-option
            v-for="(item, index) in suppliersList"
            :value="item?.id"
            :label="item?.name"
            :key="index"
          />
        </el-select>
        <el-select v-model="location" placeholder="Локация">
          <el-option
            v-for="(item, index) in locationsList"
            :value="item?.id"
            :label="item?.name"
            :key="index"
          />
        </el-select>
        <el-select v-model="payment" placeholder="Тип оплаты">
          <el-option
            v-for="(item, index) in paymentsList"
            :value="item?.value"
            :label="item?.label"
            :key="index"
          />
        </el-select>
      </div>
      <div>
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
          <template #item-opera="data">
            <div class="flex items-center">
              <el-button size="small" class="!py-2 !px-1" type="primary" plain>
                <Pencil class="w-[15px] h-[15px]" />
              </el-button>
              <el-button
                size="small"
                class="!py-2 !px-1 !ml-[8px]"
                type="danger"
                plain
              >
                <Trash class="w-[15px] h-[15px]" />
              </el-button>
            </div>
          </template>
        </Vue3EasyDataTable>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Pencil, Trash } from 'lucide-vue-next'
import { computed, onMounted, Ref, ref } from 'vue'
import Vue3EasyDataTable, { type Header, type Item } from 'vue3-easy-data-table'

import { paymentType } from '@/data'
import { getOffices } from '@/modules/Offices/controller'
import { getProducts } from '@/modules/Products/controller'
import { IProduct } from '@/modules/Products/types.ts'
import { getCustomers } from '@/modules/UserController/controller'

const searchValue = ref('')
const supplier = ref('')
const location = ref('')
const payment = ref('')
const suppliersList = ref(null)
const locationsList = ref(null)
const products: Ref<IProduct[] | undefined> = ref()
const paymentsList = paymentType
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
  { text: 'Operations', value: 'opera' },
]
const items = computed((): Item[] | undefined => {
  return products.value
})

onMounted(async () => {
  suppliersList.value = await getCustomers()
  locationsList.value = await getOffices()
  products.value = await getProducts()
})
</script>
<style scoped></style>
