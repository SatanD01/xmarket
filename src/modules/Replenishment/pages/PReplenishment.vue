<template>
  <div v-if="products">
    <div class="grid grid-cols-1 gap-3 bg-white p-3 shadow rounded-lg mb-3">
      <div class="flex items-center justify-between">
        <h3 class="text-[24px] font-bold">Пополнение склада</h3>
        <el-button @click="openModal(-1, 'create')" type="primary">
          <p class="text-center">Create Order</p>
        </el-button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
        <el-select
          size="large"
          v-model="order.sourceId"
          :class="v$.sourceId.$error ? 'error' : ''"
          placeholder="Поставщик"
        >
          <el-option
            v-for="(item, index) in suppliersList"
            :value="item?.id"
            :label="item?.name"
            :key="index"
          />
        </el-select>
        <el-select
          size="large"
          v-model="order.destinationId"
          :class="v$.destinationId.$error ? 'error' : ''"
          placeholder="Локация"
        >
          <el-option
            v-for="(item, index) in locationsList"
            :value="item?.id"
            :label="item?.name"
            :key="index"
          />
        </el-select>
        <el-select
          size="large"
          v-model="order.paymentType"
          :class="v$.paymentType.$error ? 'error' : ''"
          placeholder="Тип оплаты"
        >
          <el-option
            v-for="(item, index) in paymentType"
            :value="item?.value"
            :label="item?.label"
            :key="index"
          />
        </el-select>
      </div>

      <el-dialog align-center v-model="dialogCreate" width="80%">
        <Vue3EasyDataTable
          hover:shadow-xl
          transition
          duration-200
          ease-in-out
          class="mt-4 h-[300px] overflow-y-scroll"
          :headers="tempHeaders"
          :items="templateProducts"
        >
          <template #item-opera="item">
            <div class="flex items-center gap-2">
              <el-icon
                @click="removeItem(item)"
                class="cursor-pointer"
                size="large"
                ><Delete
              /></el-icon>
            </div>
          </template>
        </Vue3EasyDataTable>

        <div class="flex items-center justify-end my-3">
          <el-button @click="saveProducts" type="primary" class="w-[100px]"
            >Save</el-button
          >
        </div>

        <div class="mt-4">
          <el-input
            placeholder="Поиск"
            class="mb-3 md:!w-[300px]"
            size="large"
            v-model="searchValue"
          />
          <Vue3EasyDataTable
            buttons-pagination
            :headers="headers"
            class="h-[500px] overflow-y-auto"
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
                  @click="addProduct(item)"
                  size="small"
                  class="!p-2 !ml-[8px]"
                  type="primary"
                >
                  Добавить
                </el-button>
              </div>
            </template>
          </Vue3EasyDataTable>

          <el-dialog
            v-model="innerVisible"
            width="500"
            title="Inner Dialog"
            append-to-body
          >
            <div class="flex items-center gap-2">
              <el-input
                class="!w-[150px]"
                placeholder="Quantity"
                v-model="quantity"
              />
              <el-input
                class="!w-[150px]"
                placeholder="Net price"
                v-model="costPrice"
              />
              <el-input
                class="!w-[150px]"
                placeholder="Sale price"
                v-model="salePrice"
              />
            </div>

            <template #footer>
              <el-button type="primary" @click="updCount">Save</el-button>
            </template>
          </el-dialog>
        </div>
      </el-dialog>
    </div>

    <div class="bg-white p-3 mt-5 rounded-lg shadow">
      <h3 class="text-[24px] font-bold">Template orders</h3>
      <div class="grid grid-cols-6 gap-3 mt-4">
        <div
          v-for="(elem, index) in tempOrders"
          :key="index"
          class="cursor-pointer"
        >
          <div
            @click="openModal(elem, 'update')"
            class="shadow p-3 bg-[#409eef] rounded-lg w-full flex flex-col gap-1 justify-center items-center hover:shadow-xl transition duration-200 ease-in-out"
          >
            <el-icon size="22" color="white"><FolderOpened /></el-icon>
            <p class="text-center text-white">
              {{ dayjs(elem.createdAt).format('DD.MM.YYYY HH:mm') }}
            </p>
          </div>

          <el-button
            @click="processReplenishment(elem)"
            type="primary"
            plain
            class="mt-1 w-full"
            >Oбработка</el-button
          >
        </div>
      </div>
    </div>
    <div class="bg-white p-3 mt-5 rounded-lg shadow">
      <h3 class="text-[24px] font-bold">Completed orders</h3>
      <div class="grid grid-cols-6 gap-3 mt-4">
        <div
          v-for="(elem, index) in completedOrders"
          :key="index"
          class="cursor-pointer"
        >
          <div
            class="shadow p-3 bg-[#2EB959] rounded-lg w-full flex flex-col gap-1 justify-center items-center hover:shadow-xl transition duration-200 ease-in-out"
          >
            <el-icon size="22" color="white"><FolderOpened /></el-icon>
            <p class="text-center text-white">
              {{ dayjs(elem.createdAt).format('DD.MM.YYYY HH:mm') }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
  <CTableSceleton v-else />
</template>

<script setup lang="ts">
import { Delete, FolderOpened } from '@element-plus/icons-vue'
import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import dayjs from 'dayjs'
import { computed, onMounted, reactive, Ref, ref } from 'vue'
import Vue3EasyDataTable, { type Header, type Item } from 'vue3-easy-data-table'

import CTableSceleton from '@/components/CTableSceleton.vue'
import { paymentType } from '@/data'
import { getOffices } from '@/modules/Offices/controller'
import { IOffice } from '@/modules/Offices/types.ts'
import { getProducts } from '@/modules/Products/controller'
import { IProduct } from '@/modules/Products/types.ts'
import {
  addProductItem,
  addReplenishmentOrderItem,
  deleteReplenishmentOrderItem,
  getReplenishmentOrders,
  processReplenishmentOrder,
} from '@/modules/Replenishment/controller'
import { IReplenishment } from '@/modules/Replenishment/types.ts'
import { getCustomers } from '@/modules/UserController/controller'
import { ISuppliers } from '@/modules/UserController/types.ts'

const innerVisible = ref(false)
const searchValue = ref('')
const quantity = ref(null)
const costPrice = ref(null)
const salePrice = ref(null)
const dialogCreate = ref(false)
const suppliersList: Ref<ISuppliers[] | undefined> = ref()
const locationsList: Ref<IOffice[] | undefined> = ref()
const products: Ref<IProduct[] | undefined> = ref()
const allReplenishments: Ref<IReplenishment[] | undefined> = ref()
const tempOrders: Ref<IReplenishment[] | undefined> = ref()
const completedOrders: Ref<IReplenishment[] | undefined> = ref()
const statusUpdate = ref('')
const currentOrder = ref(null)
const templateProducts: Ref<
  {
    productId: number | null | undefined
    name: string | null
    image: string | undefined
    quantity: number | null
    costPrice: number | null
    salePrice: number | null
  }[]
> = ref([])
const order = reactive({
  sourceId: null,
  destinationId: null,
  paymentType: null,
  items: [],
})
const product: Ref<{
  id: number | null
  name: string | null
  image: string | null
}> = ref()

const headers: Header[] = [
  { text: 'Id', value: 'id', sortable: true },
  { text: 'Фото', value: 'image' },
  { text: 'Название', value: 'name', sortable: true },
  { text: 'Описание', value: 'description', sortable: true },
  { text: 'Поставщик', value: 'manufacturer', sortable: true },
  { text: 'Тип', value: 'origin', sortable: true },
  { text: 'Модель', value: 'carModel', sortable: true },
  { text: 'Год выпуска', value: 'carYear', sortable: true },
  { text: 'Категория', value: 'group', sortable: true },
  { text: 'Баркод', value: 'partNumber', sortable: true },
  { text: 'Код', value: 'manualCode', sortable: true },
  { text: 'Вес', value: 'weight', sortable: true },
  { text: 'Operations', value: 'opera' },
]
const tempHeaders: Header[] = [
  { text: 'Id', value: 'productId', sortable: true },
  { text: 'Название', value: 'product.name', sortable: true },
  { text: 'Quantity', value: 'quantity' },
  { text: 'Cost price', value: 'costPrice' },
  { text: 'Sale price', value: 'salePrice' },
  { text: 'Operations', value: 'opera' },
]
const items = computed((): Item[] | undefined => {
  return products.value
})
const rules = {
  sourceId: { required },
  destinationId: { required },
  paymentType: { required },
}
const v$ = useVuelidate(rules, order)

const openModal = async (order, status: string) => {
  if (order === -1) {
    v$.value.$touch()
    if (v$.value.$invalid) return
    dialogCreate.value = true
    templateProducts.value = []
  }
  statusUpdate.value = status
  dialogCreate.value = true
  templateProducts.value = []
  if (order !== -1) {
    allReplenishments.value = await getReplenishmentOrders()
    currentOrder.value = allReplenishments.value.filter(
      (item) => item.id === order.id,
    )
    templateProducts.value = currentOrder.value[0].items
  }
}

const addProduct = async (item: IProduct) => {
  innerVisible.value = true
  quantity.value = null
  costPrice.value = null
  salePrice.value = null
  product.value = item
}
const updCount = async () => {
  if (statusUpdate.value === 'create') {
    if (quantity.value && costPrice.value && salePrice.value) {
      templateProducts.value.push({
        productId: product.value.id,
        name: product.value.name,
        image: product.value.image,
        quantity: quantity.value,
        costPrice: costPrice.value,
        salePrice: salePrice.value,
      })
      innerVisible.value = false
    }
  } else {
    await addReplenishmentOrderItem({
      productId: product.value.id,
      orderId: currentOrder.value[0].id,
      quantity: quantity.value,
      costPrice: costPrice.value,
      salePrice: salePrice.value,
    }).then(async () => {
      allReplenishments.value = await getReplenishmentOrders()
      currentOrder.value = allReplenishments.value.filter(
        (item) => item.id === currentOrder.value[0].id,
      )
      templateProducts.value = currentOrder.value[0].items
    })
    innerVisible.value = false
  }
}
const saveProducts = async () => {
  console.log('update', statusUpdate.value)
  if (statusUpdate.value === 'create') {
    order.items = templateProducts.value.map((el) => {
      return {
        productId: el.productId,
        quantity: el.quantity,
        costPrice: el.costPrice,
        salePrice: el.salePrice,
      }
    })
    templateProducts.value = await addProductItem(order)
  }
  dialogCreate.value = false
}
const removeItem = async (item: IProduct) => {
  if (statusUpdate.value === 'create') {
    const fIndex = (element) => element.id == item.id
    const index = templateProducts.value.findIndex(fIndex)
    templateProducts.value.splice(index, 1)
  } else {
    console.log('ccrrr', currentOrder.value)
    await deleteReplenishmentOrderItem(item.id, currentOrder.value[0].id).then(
      () => {
        const fIndex = (element) => element.id == item.id
        const index = templateProducts.value.findIndex(fIndex)
        templateProducts.value.splice(index, 1)
      },
    )
  }
}
const processReplenishment = async (item: IReplenishment) => {
  await processReplenishmentOrder(item.id)
  allReplenishments.value = await getReplenishmentOrders()
  tempOrders.value = allReplenishments.value.filter((el) => {
    if (el.status === 'Template') return el
  })
  completedOrders.value = allReplenishments.value.filter((el) => {
    if (el.status === 'Completed') return el
  })
}
onMounted(async () => {
  suppliersList.value = await getCustomers()
  locationsList.value = await getOffices()
  products.value = await getProducts()
  allReplenishments.value = await getReplenishmentOrders()
  tempOrders.value = allReplenishments.value.filter((el) => {
    if (el.status === 'Template') return el
  })
  completedOrders.value = allReplenishments.value.filter((el) => {
    if (el.status === 'Completed') return el
  })
})
</script>
<style scoped></style>
