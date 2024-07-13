<template>
  <div>
    <div class="p-3 bg-white shadow rounded-lg">
      <h3 class="text-[24px] font-bold capitalize">Перенос товара</h3>
      <div class="grid grid-cols-1 mt-4 md:grid-cols-4 gap-3">
        <el-select
          size="large"
          v-model="order.sourceId"
          placeholder="Склад"
          @change="getProductByWarehouse"
          :class="v$.sourceId.$error ? 'error' : ''"
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
          :class="v$.destinationId.$error ? 'error' : ''"
          placeholder="Магазин"
        >
          <el-option
            v-for="(item, index) in locationsList"
            v-show="item.type === 'Store'"
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
        <el-button type="primary" size="large" @click="addTransaction">
          Создать перенос
        </el-button>
      </div>
    </div>
    <div class="bg-white p-3 mt-5 rounded-lg shadow">
      <h3 class="text-[24px] font-bold">Загатовки переноса</h3>
      <div class="grid grid-cols-2 md:grid-cols-6 gap-3 mt-4">
        <template v-for="(elem, index) in templateOrders" :key="index">
          <div class="cursor-pointer" v-if="elem?.status === 'Template'">
            <div
              @click="openDialogUpdate(elem)"
              class="shadow p-3 bg-[#409eef] rounded-lg w-full flex flex-col gap-1 justify-center items-center hover:shadow-xl transition duration-200 ease-in-out"
            >
              <el-icon size="22" color="white"><FolderOpened /></el-icon>
              <p class="text-center text-white">
                {{ dayjs(elem.createdAt).format('DD.MM.YYYY HH:mm') }}
              </p>
            </div>

            <el-button
              @click="processTransferOrder(elem?.id)"
              type="primary"
              plain
              class="mt-1 w-full"
              >Oбработка</el-button
            >
          </div>
        </template>
      </div>
    </div>
    <div class="bg-white p-3 mt-5 rounded-lg shadow">
      <h3 class="text-[24px] font-bold">Завершенные переносы</h3>
      <div class="grid grid-cols-2 md:grid-cols-6 gap-3 mt-4">
        <template v-for="(elem, index) in templateOrders" :key="index">
          <div class="cursor-pointer" v-if="elem?.status === 'Completed'">
            <div
              @click="openDialogUpdate(elem)"
              class="shadow p-3 bg-[#2EB959] rounded-lg w-full flex flex-col gap-1 justify-center items-center hover:shadow-xl transition duration-200 ease-in-out"
            >
              <el-icon size="22" color="white"><FolderOpened /></el-icon>
              <p class="text-center text-white">
                {{ dayjs(elem.createdAt).format('DD.MM.YYYY HH:mm') }}
              </p>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
  <el-dialog :fullscreen="fullscreen" v-model="selectDialog">
    <div class="flex flex-col justify-center">
      <el-input
        placeholder="Поиск"
        class="mb-3 md:!w-[300px]"
        size="large"
        v-model="searchValue"
      />
      <Vue3EasyDataTable
        hover:shadow-xl
        transition
        duration-200
        ease-in-out
        class="mt-4 h-[300px] overflow-y-scroll"
        :headers="tempHeaders"
        :items="products"
        show-index
        :search-field="['product.id', 'product.name', 'quantity', 'salePrice']"
        :search-value="searchValue"
      >
        <template #item-input="item">
          <el-input
            v-if="order.items[item.index - 1]"
            class="!w-[150px]"
            type="number"
            v-model="order.items[item.index - 1].quantity"
            :max="item.quantity"
            placeholder="Количество"
            @input="onInputChange(item.index - 1, item.quantity)"
          />
        </template>
      </Vue3EasyDataTable>
      <el-button
        type="primary"
        size="large"
        @click="confirmTransaction"
        class="mt-5"
      >
        Сохранить
      </el-button>
    </div>
  </el-dialog>
  <el-dialog
    :fullscreen="fullscreen"
    align-center
    v-model="dialogUpdate"
    width="80%"
  >
    <Vue3EasyDataTable
      hover:shadow-xl
      transition
      duration-200
      ease-in-out
      class="mt-4 h-[35%] overflow-y-scroll"
      :headers="tempUpdateHeaders"
      :items="currentOrder?.items"
    >
      <template #item-opera="item">
        <div class="flex items-center gap-2">
          <el-icon
            @click="deleteItem(item?.id, item?.orderId)"
            class="cursor-pointer"
            size="large"
            ><Delete
          /></el-icon>
        </div>
      </template>
      <template #item-input="item">
        <el-input
          v-if="order.items[item.index - 1]"
          class="!w-[150px]"
          type="number"
          v-model="order.items[item.index - 1].quantity"
          :max="item.quantity"
          placeholder="Введите количество"
          @input="onInputChange(item.index - 1, item.quantity)"
        />
      </template>
    </Vue3EasyDataTable>
    <div class="mt-5">
      <el-input
        placeholder="Поиск"
        class="mb-3 md:!w-[300px]"
        size="large"
        v-model="searchValue"
      />
      <Vue3EasyDataTable
        hover:shadow-xl
        transition
        duration-200
        ease-in-out
        class="mt-4 h-[300px] overflow-y-scroll"
        :headers="tempHeadersWithButton"
        :items="products"
        show-index
        :search-field="['product.id', 'product.name', 'quantity', 'salePrice']"
        :search-value="searchValue"
      >
        <template #item-input="item">
          <el-input
            v-if="order.items[item.index - 1]"
            class="!w-[150px]"
            type="number"
            v-model="order.items[item.index - 1].quantity"
            :max="item.quantity"
            placeholder="Количество"
            @input="onInputChange(item.index - 1, item.quantity)"
          />
        </template>
        <template #item-button="item">
          <el-button
            type="primary"
            plain
            class="!h-7"
            @click="
              updateTransferOrder(item.index - 1, item?.product?.id, item)
            "
          >
            Добавить
          </el-button>
        </template>
      </Vue3EasyDataTable>
    </div>
  </el-dialog>
</template>
<script setup lang="ts">
import { Delete, FolderOpened } from '@element-plus/icons-vue'
import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import { useWindowSize } from '@vueuse/core'
import dayjs from 'dayjs'
import { onMounted, reactive, Ref, ref } from 'vue'
import Vue3EasyDataTable, { type Header } from 'vue3-easy-data-table'

import { useApi } from '@/composables/useApi.ts'
import { paymentType } from '@/data'
import { getOffices } from '@/modules/Offices/controller'
import { IOffice } from '@/modules/Offices/types.ts'
import { getAvailableProducts } from '@/modules/Products/controller'
import { IProduct } from '@/modules/Products/types.ts'
import { deleteOrderItem } from '@/modules/Replenishment/controller'

const fullscreen = ref(false)
const { width } = useWindowSize()
const locationsList: Ref<IOffice[] | undefined> = ref()
const products: Ref<IProduct[] | undefined> = ref([])
const templateOrders = ref([])
const order = reactive({
  sourceId: null,
  destinationId: null,
  paymentType: null,
  items: [],
})
const selectDialog = ref(false)
const searchValue = ref('')
const dialogUpdate = ref(false)
const currentOrder = ref(null)
const tempHeaders: Header[] = [
  { text: 'Id', value: 'product.id', sortable: true },
  { text: 'Название', value: 'product.name', sortable: true },
  { text: 'Количество', value: 'quantity' },
  { text: 'Количество', value: 'input' },
  { text: 'Цена продажи', value: 'salePrice' },
  // { text: 'Operations', value: 'opera' },
]
const tempHeadersWithButton: Header[] = [
  { text: 'Id', value: 'product.id', sortable: true },
  { text: 'Название', value: 'product.name', sortable: true },
  { text: 'Количество', value: 'quantity' },
  { text: 'Количество', value: 'input' },
  { text: 'Цена продажи', value: 'salePrice' },
  { text: 'Управление', value: 'button' },
]
const tempUpdateHeaders: Header[] = [
  { text: 'Id', value: 'product.id', sortable: true },
  { text: 'Название', value: 'product.name', sortable: true },
  { text: 'Количество', value: 'quantity' },
  // { text: 'Enter quantity', value: 'input' },
  { text: 'Цена продажи', value: 'salePrice' },
  { text: 'Управление', value: 'opera' },
]
const rules = {
  sourceId: { required },
  destinationId: { required },
  paymentType: { required },
}

const v$ = useVuelidate(rules, order)
const onInputChange = (index: number, count: number) => {
  if (order.items[index].quantity > count) {
    order.items[index].quantity = count
  }
}
const addTransaction = async () => {
  v$.value.$touch()
  if (v$.value.$invalid) return
  selectDialog.value = true
}
const confirmTransaction = async () => {
  try {
    order.items = order.items.filter((el) => el.quantity)
    const res = await useApi().$post('Inventory/AddTransferOrder', order)
    await getTransferOrders()
    selectDialog.value = false
    console.log(res)
  } catch (err) {
    console.log(err)
  }
}
const getProductByWarehouse = async () => {
  try {
    products.value = await getAvailableProducts(order.sourceId)
    order.items = products.value.map((el) => {
      return {
        productId: el.product?.id,
        quantity: null,
        costPrice: el.costPrice,
        salePrice: el.salePrice,
      }
    })
  } catch (err) {
    console.log(err)
  }
}
const openDialogUpdate = (item) => {
  dialogUpdate.value = true
  currentOrder.value = item
  order.sourceId = item.sourceId
  getProductByWarehouse()
}
const getTransferOrders = async () => {
  try {
    const res = await useApi().$get('/Inventory/GetTransferOrders')
    templateOrders.value = res.data
  } catch (err) {
    console.log(err)
  }
}
const processTransferOrder = async (id: number) => {
  try {
    await useApi().$post('Inventory/ProcessTransferOrder', {
      id: id,
    })
    await getTransferOrders()
  } catch (err) {
    console.log(err)
  }
}
const deleteItem = async (id: number, orderId: number) => {
  try {
    await deleteOrderItem(id, orderId)
    currentOrder.value?.items?.splice(
      currentOrder.value?.items.findIndex((el) => el.id === id),
      1,
    )
  } catch (err) {
    console.log(err)
  }
}
const updateTransferOrder = async (index: number, id: number, product) => {
  const obj = order.items[index]
  const data = {
    ...obj,
    orderId: currentOrder.value.items[0]?.orderId,
  }
  await useApi().$post('Inventory/AddOrderItem', data)
  const instance = currentOrder.value?.items.findIndex(
    (el) => el.product?.id === id,
  )
  if (instance === -1) {
    currentOrder.value?.items.push({
      ...product,
      quantity: order.items[index].quantity,
    })
  } else {
    currentOrder.value?.items.splice(instance, 1, {
      ...product,
      quantity: order.items[index].quantity,
    })
  }
}
onMounted(async () => {
  try {
    locationsList.value = await getOffices()
    await getTransferOrders()
  } catch (err) {
    console.log(err)
  }
  fullscreen.value = width.value <= 768
})
</script>
