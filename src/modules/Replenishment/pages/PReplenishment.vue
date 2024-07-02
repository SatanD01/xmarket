<template>
  <div v-if="products">
    <div class="grid grid-cols-1 gap-3 bg-white p-3 shadow rounded-lg mb-3">
      <h3 class="text-[24px] font-bold">Пополнение склада</h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
        <el-select size="large" v-model="supplier" placeholder="Поставщик">
          <el-option
            v-for="(item, index) in suppliersList"
            :value="item?.id"
            :label="item?.name"
            :key="index"
          />
        </el-select>
        <el-select size="large" v-model="location" placeholder="Локация">
          <el-option
            v-for="(item, index) in locationsList"
            :value="item?.id"
            :label="item?.name"
            :key="index"
          />
        </el-select>
        <el-select size="large" v-model="payment" placeholder="Тип оплаты">
          <el-option
            v-for="(item, index) in paymentType"
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
          <template #item-opera="item">
            <div class="flex items-center">
              <el-button
                @click="openModal(item)"
                size="small"
                class="!p-2 !ml-[8px]"
                type="primary"
              >
                Добавить
              </el-button>
            </div>
          </template>
        </Vue3EasyDataTable>
      </div>
      <el-dialog v-model="dialog" width="500">
        <div class="grid gap-3 md:grid-cols-3 mt-3">
          <el-input
            size="large"
            placeholder="Quantity"
            v-model="data.quantity"
          />
          <el-input
            size="large"
            placeholder="Net price"
            v-model="data.costPrice"
          />
          <el-input
            size="large"
            placeholder="Sale price"
            v-model="data.salePrice"
          />
        </div>
        <template #footer>
          <el-button type="primary">Save</el-button>
        </template>
      </el-dialog>
    </div>
    <div class="bg-white p-3 mt-5 rounded-lg shadow">
      <h3 class="text-[24px] font-bold">Products</h3>
      <Vue3EasyDataTable :headers="headers" :items="items">
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
        <template #item-opera="item">
          <div class="flex items-center">
            <el-button
              @click="openModal(item)"
              size="small"
              class="!p-2 !ml-[8px]"
              type="primary"
            >
              Добавить
            </el-button>
          </div>
        </template>
      </Vue3EasyDataTable>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, Ref, ref } from 'vue'
import Vue3EasyDataTable, { type Header, type Item } from 'vue3-easy-data-table'

import { paymentType } from '@/data'
import { getOffices } from '@/modules/Offices/controller'
import { IOffice } from '@/modules/Offices/types.ts'
import { getProducts } from '@/modules/Products/controller'
import { IProduct } from '@/modules/Products/types.ts'
import { getCustomers } from '@/modules/UserController/controller'
import { ISuppliers } from '@/modules/UserController/types.ts'

const searchValue = ref('')
const supplier = ref('')
const location = ref('')
const payment = ref('')
const dialog = ref(false)
const suppliersList: Ref<ISuppliers[] | undefined> = ref()
const locationsList: Ref<IOffice[] | undefined> = ref()
const products: Ref<IProduct[] | undefined> = ref()
const data = reactive<{
  productId: number | null
  quantity: number | null
  costPrice: number | null
  salePrice: number | null
}>({
  productId: null,
  quantity: null,
  costPrice: null,
  salePrice: null,
})
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

const openModal = (item: IProduct) => {
  dialog.value = true
  console.log(item)
}

onMounted(async () => {
  suppliersList.value = await getCustomers()
  locationsList.value = await getOffices()
  products.value = await getProducts()
})
</script>
<style scoped></style>
