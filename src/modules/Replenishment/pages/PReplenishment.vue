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
      <el-dialog v-model="dialog" width="80%">
        <Vue3EasyDataTable
          buttons-pagination
          class="mt-4"
          :headers="tempHeaders"
          :items="templateProducts"
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
            <div class="flex items-center gap-2">
              <el-input
                class="!w-[150px]"
                placeholder="Quantity"
                v-model="data.quantity"
              />
              <el-input
                class="!w-[150px]"
                placeholder="Net price"
                v-model="data.costPrice"
              />
              <el-input
                class="!w-[150px]"
                placeholder="Sale price"
                v-model="data.salePrice"
              />
              <el-icon
                @click="removeItem(item)"
                class="cursor-pointer"
                size="large"
                ><Delete
              /></el-icon>
            </div>
          </template>
        </Vue3EasyDataTable>
        <!--        <div class="grid gap-3 md:grid-cols-3 mt-3">-->

        <!--        </div>-->
        <div class="mt-4">
          <el-input
            placeholder="Search"
            class="mb-3 md:!w-[300px]"
            size="large"
            v-model="searchValue"
          />
          <Vue3EasyDataTable
            buttons-pagination
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
                  @click="templateProducts.push(item)"
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
        <template #footer>
          <el-button @click="addProduct" type="primary">Save</el-button>
        </template>
      </el-dialog>
    </div>
    <div class="bg-white p-3 mt-5 rounded-lg shadow">
      <h3 class="text-[24px] font-bold">Orders</h3>
      <div class="grid grid-cols-5 gap-3 mt-4">
        <div
          @click="openModal"
          class="rounded-lg shadow p-3 flex flex-col gap-1 justify-center items-center cursor-pointer hover:shadow-xl transition duration-200 ease-in-out"
        >
          <el-icon size="22"><CirclePlus /></el-icon>
          <p class="text-center">Create Order</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CirclePlus, Delete } from '@element-plus/icons-vue'
import { computed, onMounted, reactive, Ref, ref } from 'vue'
import Vue3EasyDataTable, { type Header, type Item } from 'vue3-easy-data-table'

import { paymentType } from '@/data'
import { getOffices } from '@/modules/Offices/controller'
import { IOffice } from '@/modules/Offices/types.ts'
import { getProducts } from '@/modules/Products/controller'
import { IProduct } from '@/modules/Products/types.ts'
import { addProductItem } from '@/modules/Replenishment/controller'
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
const templateProducts = ref([])
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
const tempHeaders: Header[] = [
  { text: 'Id', value: 'id', sortable: true },
  { text: 'Фото', value: 'image' },
  { text: 'Название', value: 'name', sortable: true },
  { text: 'Operations', value: 'opera' },
]
const items = computed((): Item[] | undefined => {
  return products.value
})

const openModal = () => {
  dialog.value = true
  console.log()
}
const addProduct = async () => {
  templateProducts.value = await addProductItem({})
}
const removeItem = (item: IProduct) => {
  const fIndex = (element) => element.id == item.id
  const index = templateProducts.value.findIndex(fIndex)
  templateProducts.value.splice(index, 1)
}

onMounted(async () => {
  suppliersList.value = await getCustomers()
  locationsList.value = await getOffices()
  products.value = await getProducts()
})
</script>
<style scoped></style>
