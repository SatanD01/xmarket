<template>
  <div class="p-3 bg-white shadow rounded-lg">
    <h3 class="text-[24px] font-bold">Перенос товара</h3>
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
        :search-field="[
          'product.id',
          'product.name',
          'quantity',
          'salePrice',
          'minSalePrice',
          'minSalePriceRetail',
        ]"
        :search-value="searchValue"
      >
        <template #item-input="item">
          <el-input
            v-if="order.items[item.index - 1]"
            class="!w-[150px]"
            type="number"
            v-model="order.items[item.index - 1].quantity"
            :max="item.quantity"
            :min="1"
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
        :loading="createLoading"
      >
        Сохранить
      </el-button>
    </div>
  </el-dialog>
  <div v-if="templateOrders.length">
    <div>
      <div
        v-if="templateOrders.some((el) => el.status === 'Template')"
        class="bg-white p-3 mt-5 rounded-lg shadow"
      >
        <h3 class="text-[24px] font-bold">Заготовки переноса</h3>
        <Vue3EasyDataTable
          hover:shadow-xl
          transition
          duration-200
          buttons-pagination
          ease-in-out
          class="mt-4 h-[35%] overflow-y-scroll"
          :headers="tempCardHeadersView"
          :items="templateOrdersFiltered"
        >
          <template #item-createdAt="data">
            {{ dayjs(data.createdAt).format('DD.MM.YYYY HH:MM') }}
          </template>
          <template #item-button="item">
            <el-button
              @click="openDialogUpdate(item)"
              size="small"
              class="!p-2"
              type="primary"
              plain
            >
              <ShoppingCart class="w-[15px] h-[15px]" />
            </el-button>
            <el-button
              @click="processTransferOrder(item.id)"
              size="small"
              class="!p-2"
              type="success"
              plain
            >
              <Check class="w-[15px] h-[15px]" />
            </el-button>
            <el-button
              @click="deleteOrder(item.id)"
              size="small"
              class="!p-2"
              type="danger"
              plain
            >
              <Trash2 class="w-[15px] h-[15px]" />
            </el-button>
          </template>
        </Vue3EasyDataTable>
      </div>
      <div
        v-if="templateOrders.length"
        class="bg-white p-3 mt-5 rounded-lg shadow"
      >
        <h3 class="text-[24px] font-bold">Завершенные переносы</h3>
        <Vue3EasyDataTable
          hover:shadow-xl
          transition
          duration-200
          buttons-pagination
          ease-in-out
          class="mt-4 h-[35%] overflow-y-scroll"
          :headers="compHeadersView"
          :items="completedOrdersFiltered"
        >
          <template #item-createdAt="data">
            {{ dayjs(data.createdAt).format('DD.MM.YYYY HH:MM') }}
          </template>
          <template #item-button="item">
            <el-button
              @click="openDialogUpdate(item, true)"
              size="small"
              class="!p-2"
              type="primary"
              plain
            >
              <ShoppingCart class="w-[15px] h-[15px]" />
            </el-button>
          </template>
        </Vue3EasyDataTable>
      </div>
    </div>
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
            :min="0"
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
          :search-field="[
            'product.id',
            'product.name',
            'quantity',
            'salePrice',
            'minSalePrice',
            'minSalePriceRetail',
          ]"
          :search-value="searchValue"
        >
          <template #item-input="item">
            <el-input
              v-if="order.items[item.index - 1]"
              class="!w-[150px]"
              type="number"
              v-model="order.items[item.index - 1].quantity"
              :max="item.quantity"
              :min="0"
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
    <el-dialog
      :fullscreen="fullscreen"
      align-center
      v-model="viewDialog"
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
      </Vue3EasyDataTable>
    </el-dialog>
  </div>
  <CTableSkeleton class="mt-5" v-else />
</template>
<script setup lang="ts">
import { Delete } from '@element-plus/icons-vue'
import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import { useWindowSize } from '@vueuse/core'
import dayjs from 'dayjs'
import { Check, ShoppingCart, Trash2 } from 'lucide-vue-next'
import { computed, onMounted, reactive, Ref, ref } from 'vue'
import Vue3EasyDataTable, { type Header } from 'vue3-easy-data-table'
import { toast } from 'vue3-toastify'

import CTableSkeleton from '@/components/CTableSceleton.vue'
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
const viewDialog = ref(false)
const searchValue = ref('')
const dialogUpdate = ref(false)
const currentOrder = ref(null)
const processLoading = ref(false)
const createLoading = ref(false)
const tempHeaders: Header[] = [
  { text: 'Id', value: 'product.id', sortable: true },
  { text: 'Название', value: 'product.name', sortable: true },
  { text: 'Количество', value: 'quantity' },
  { text: 'Количество', value: 'input' },
  { text: 'Мин. цена продажи опт.', value: 'minSalePrice' },
  { text: 'Мин. цена продажи роз.', value: 'minSalePriceRetail' },
  // { text: 'Operations', value: 'opera' },
]
const tempHeadersWithButton: Header[] = [
  { text: 'Id', value: 'product.id', sortable: true },
  { text: 'Название', value: 'product.name', sortable: true },
  { text: 'Количество', value: 'quantity' },
  { text: 'Количество', value: 'input' },
  { text: 'Мин. цена продажи опт.', value: 'minSalePrice' },
  { text: 'Мин. цена продажи роз.', value: 'minSalePriceRetail' },
  { text: 'Управление', value: 'button' },
]
const compHeadersView: Header[] = [
  { text: 'Id', value: 'id', sortable: true },
  { text: 'Поставщик', value: 'source.name', sortable: true },
  { text: 'Локация', value: 'destination.name' },
  { text: 'Создан', value: 'createdAt' },
  { text: 'Просмотр', value: 'button' },
]

const tempCardHeadersView: Header[] = [
  { text: 'Id', value: 'id', sortable: true },
  { text: 'Поставщик', value: 'source.name', sortable: true },
  { text: 'Локация', value: 'destination.name' },
  { text: 'Создан', value: 'createdAt' },
  { text: 'Управление', value: 'button' },
]
const tempUpdateHeaders: Header[] = [
  { text: 'Id', value: 'product.id', sortable: true },
  { text: 'Название', value: 'product.name', sortable: true },
  { text: 'Количество', value: 'quantity' },
  // { text: 'Enter quantity', value: 'input' },
  { text: 'Мин. цена продажи опт.', value: 'minSalePrice' },
  { text: 'Мин. цена продажи роз.', value: 'minSalePriceRetail' },
  { text: 'Управление', value: 'opera' },
]
const rules = {
  sourceId: { required },
  destinationId: { required },
  paymentType: { required },
}

const templateOrdersFiltered = computed(() => {
  return templateOrders.value.filter((el) => el.status === 'Template')
})

const completedOrdersFiltered = computed(() => {
  return templateOrders.value.filter((el) => el.status === 'Completed')
})

const v$ = useVuelidate(rules, order)
const onInputChange = (index: number, count: number) => {
  if (order.items[index].quantity > count) {
    order.items[index].quantity = Number(count)
  }
}
const addTransaction = async () => {
  v$.value.$touch()
  if (v$.value.$invalid) return
  selectDialog.value = true
}
const confirmTransaction = async () => {
  try {
    createLoading.value = true
    order.items = order.items.filter((el) => Number(el.quantity))
    const res = await useApi().$post('Inventory/AddTransferOrder', order)
    await getTransferOrders()
    selectDialog.value = false
  } catch (err) {
    console.log(err)
  } finally {
    createLoading.value = false
  }
}
const getProductByWarehouse = async () => {
  try {
    products.value = await getAvailableProducts(order.sourceId)
    if (!products.value?.length) {
      toast.warn(
        'Нет доступных товаров на складе. Добавьте товар в склад или выберите другой склад',
      )
    }
    order.items = products.value.map((el) => {
      return {
        productId: el.product?.id,
        quantity: null,
        costPrice: el.costPrice,
        minSalePrice: el.minSalePrice,
        minSalePriceRetail: el.minSalePriceRetail,
        salePrice: 0,
      }
    })
  } catch (err) {
    console.log(err)
  }
}
const openDialogUpdate = (item, view?: boolean) => {
  if (view) {
    viewDialog.value = true
  } else {
    dialogUpdate.value = true
  }
  currentOrder.value = item
  order.sourceId = item.sourceId
  getProductByWarehouse()
}
const getTransferOrders = async () => {
  try {
    const res = await useApi().$get('/Inventory/GetTransferOrders')
    templateOrders.value = res.data
    if (!templateOrders.value.length) {
      toast.warn('Нет перенесенных товаров, таблица не может быть загружена')
    }
  } catch (err) {
    console.log(err)
  }
}
const processTransferOrder = async (id: number) => {
  processLoading.value = true
  try {
    await useApi().$post('Inventory/ProcessTransferOrder', {
      id: id,
    })
    await getTransferOrders()
    await getProductByWarehouse()
  } catch (err) {
    console.log(err)
  } finally {
    processLoading.value = false
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
  const res = await useApi().$post('Inventory/AddOrderItem', data)
  currentOrder.value?.items.push({
    ...product,
    id: res.data?.id,
    orderId: res.data?.orderId,
    quantity: Number(order.items[index].quantity),
  })
}

const deleteOrder = async (id: number) => {
  try {
    await useApi().$post('Inventory/DeleteOrder', {
      id,
    })
    await getTransferOrders()
  } catch (err) {
    console.log(err)
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
