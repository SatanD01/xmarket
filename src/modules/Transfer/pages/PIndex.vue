<template>
  <div>
    <h3 class="text-[24px] font-bold capitalize">перенос товара</h3>
    <div class="grid grid-cols-1 md:grid-cols-4 gap-3">
      <el-select
        size="large"
        v-model="order.sourceId"
        placeholder="Warehouse"
        @change="getProductByWarehouse"
      >
        <el-option
          v-for="(item, index) in locationsList"
          v-show="item.type === 'Warehouse'"
          :value="item?.id"
          :label="item?.name"
          :key="index"
        />
      </el-select>
      <el-select
        size="large"
        v-model="order.destinationId"
        placeholder="Локация"
      >
        <el-option
          v-for="(item, index) in locationsList"
          v-show="item.type === 'Store'"
          :value="item?.id"
          :label="item?.name"
          :key="index"
        />
      </el-select>
    </div>
    <Vue3EasyDataTable
      hover:shadow-xl
      transition
      duration-200
      ease-in-out
      class="mt-4 h-[300px] overflow-y-scroll"
      :headers="tempHeaders"
      :items="products"
    >
      <template #item-opera="item">
        <div class="flex items-center gap-2">
          <el-icon @click="removeItem(item)" class="cursor-pointer" size="large"
            ><Delete
          /></el-icon>
        </div>
      </template>
    </Vue3EasyDataTable>
    <pre> products:{{ locationsList }} </pre>
  </div>
</template>
<script setup lang="ts">
import { Delete } from '@element-plus/icons-vue'
import { onMounted, reactive, Ref, ref } from 'vue'
import Vue3EasyDataTable, { type Header } from 'vue3-easy-data-table'

import { getOffices } from '@/modules/Offices/controller'
import { IOffice } from '@/modules/Offices/types.ts'
import { getAvailableProducts } from '@/modules/Products/controller'
import { IProduct } from '@/modules/Products/types.ts'

const locationsList: Ref<IOffice[] | undefined> = ref()
const products: Ref<IProduct[] | undefined> = ref()
const order = reactive({
  sourceId: null,
  destinationId: null,
  paymentType: null,
  items: [],
})
const tempHeaders: Header[] = [
  { text: 'Id', value: 'productId', sortable: true },
  { text: 'Название', value: 'product.name', sortable: true },
  { text: 'Quantity', value: 'quantity' },
  { text: 'Cost price', value: 'costPrice' },
  { text: 'Sale price', value: 'salePrice' },
  { text: 'Operations', value: 'opera' },
]

const getProductByWarehouse = async () => {
  try {
    products.value = await getAvailableProducts(order.sourceId)
  } catch (err) {
    console.log(err)
  }
}
onMounted(async () => {
  try {
    locationsList.value = await getOffices()
  } catch (err) {
    console.log(err)
  }
})
</script>
