<template>
  <div v-if="tempOrders">
    <div class="grid grid-cols-1 gap-3 bg-white p-3 shadow rounded-lg mb-3">
      <div class="flex items-center justify-between">
        <h3 class="text-[24px] font-bold">Пополнение склада</h3>
        <el-button @click="openCreateModal()" type="primary">
          <p class="text-center">Создать заказ</p>
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
            v-show="item.type === 'Warehouse'"
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
      <el-dialog
        v-model="scanDialog"
        @closed="stopVideo"
        title="Сканер бар кода"
        :align-center="width < 768"
        :width="width > 768 ? 500 : 300"
      >
        <div>
          <StreamBarcodeReader
            v-if="scanDialog"
            @decode="onDecode"
            @load="onLoaded"
          />
        </div>
      </el-dialog>
      <el-dialog
        :fullscreen="fullscreen"
        align-center
        v-model="dialogCreate"
        width="80%"
      >
        <Vue3EasyDataTable
          hover:shadow-xl
          transition
          duration-200
          ease-in-out
          class="mt-4 h-[35%] overflow-y-scroll"
          :headers="tempHeaders"
          :items="templateProducts"
        >
          <template #item-opera="item">
            <div class="flex items-center gap-2">
              <el-icon
                @click="removeItemCreate(item)"
                class="cursor-pointer"
                size="large"
                ><Delete
              /></el-icon>
            </div>
          </template>
        </Vue3EasyDataTable>

        <div class="flex items-center justify-end my-3">
          <el-button
            @click="saveCreateProducts"
            type="primary"
            class="w-[100px]"
            :loading="store.loading"
            >Сохранить</el-button
          >
        </div>

        <div class="mt-4">
          <el-input
            placeholder="Поиск"
            class="mb-3 md:!w-[300px]"
            size="large"
            v-model="searchValue"
          />
          <el-button
            size="large"
            @click="scanDialogOpen"
            type="primary"
            class="ms-2 mb-3 !p-2"
            ><QrCode
          /></el-button>
          <Vue3EasyDataTable
            buttons-pagination
            :headers="headers"
            class="h-[40%] overflow-y-auto"
            :items="products"
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
                  @click="innerDialogCreate(item)"
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
            v-model="innerVisibleCreate"
            width="500"
            title="Добавить товар"
            append-to-body
          >
            <div class="grid md:grid-cols-2 grid-cols-1 gap-2">
              <el-input placeholder="Количество" v-model="quantity" />
              <el-input placeholder="Чистая цена" v-model="costPrice" />
              <el-input
                placeholder="Мин. цена продажи"
                v-model="minSalePrice"
              />
            </div>

            <template #footer>
              <el-button type="primary" @click="addProduct('create')"
                >Сохранить</el-button
              >
            </template>
          </el-dialog>
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
          :headers="tempHeaders"
          :items="templateProducts"
        >
          <template #item-opera="item">
            <div class="flex items-center gap-2">
              <el-icon
                @click="removeItemUpdate(item)"
                class="cursor-pointer"
                size="large"
                ><Delete
              /></el-icon>
            </div>
          </template>
        </Vue3EasyDataTable>

        <div class="flex items-center justify-end my-3">
          <el-button
            @click="saveUpdateProducts"
            type="primary"
            class="w-[100px]"
            >Сохранить</el-button
          >
        </div>

        <div class="mt-4">
          <el-input
            placeholder="Поиск"
            class="mb-3 md:!w-[300px]"
            size="large"
            v-model="searchValue"
          />
          <el-button
            size="large"
            @click="scanDialogOpen"
            type="primary"
            class="ms-2 mb-3 !p-2"
            ><QrCode
          /></el-button>
          <Vue3EasyDataTable
            buttons-pagination
            :headers="headers"
            class="h-[40%] overflow-y-auto"
            :items="products"
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
                  @click="innerDialogUpdate(item)"
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
            v-model="innerVisibleUpdate"
            width="500"
            title="Добавить товар"
            append-to-body
          >
            <div class="grid md:grid-cols-2 grid-cols-1 gap-2">
              <el-input placeholder="Количество" v-model="quantity" />
              <el-input placeholder="Чистая цена" v-model="costPrice" />
              <el-input
                placeholder="Мин. цена продажи"
                v-model="minSalePrice"
              />
            </div>

            <template #footer>
              <el-button
                type="primary"
                :loading="store.loading"
                @click="addProduct('update')"
                >Добавить</el-button
              >
            </template>
          </el-dialog>
        </div>
      </el-dialog>
      <el-dialog
        :fullscreen="fullscreen"
        align-center
        v-model="dialogView"
        width="80%"
      >
        <Vue3EasyDataTable
          hover:shadow-xl
          transition
          duration-200
          ease-in-out
          class="mt-4 h-[35%] overflow-y-scroll"
          :headers="tempHeadersView"
          :items="templateProducts"
        />
      </el-dialog>
    </div>

    <div v-if="tempOrders.length" class="bg-white p-3 mt-5 rounded-lg shadow">
      <h3 class="text-[24px] font-bold">Заготовки заказов</h3>
      <Vue3EasyDataTable
        hover:shadow-xl
        transition
        duration-200
        buttons-pagination
        ease-in-out
        class="mt-4 h-[35%] overflow-y-scroll"
        :headers="tempCardHeadersView"
        :items="tempOrders"
      >
        <template #item-createdAt="{ item }">
          {{ dayjs(item).format('DD.MM.YYYY') }}
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
            @click="processReplenishment(item)"
            size="small"
            class="!p-2"
            type="success"
            plain
          >
            <Check class="w-[15px] h-[15px]" />
          </el-button>
          <el-button
            @click="deleteTempOrder(item)"
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
    <div v-if="completedOrders" class="bg-white p-3 mt-5 rounded-lg shadow">
      <h3 class="text-[24px] font-bold">Завершенные заказы</h3>
      <Vue3EasyDataTable
        hover:shadow-xl
        transition
        buttons-pagination
        duration-200
        ease-in-out
        class="mt-4 h-[35%] overflow-y-scroll"
        :headers="compHeadersView"
        :items="completedOrders"
      >
        <template #item-createdAt="{ item }">
          {{ dayjs(item).format('DD.MM.YYYY') }}
        </template>
        <template #item-button="item">
          <el-button
            @click="viewOrders(item)"
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
  <CTableSkeleton v-else />
</template>

<script setup lang="ts">
import { Delete, FolderOpened } from '@element-plus/icons-vue'
import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import { useWindowSize } from '@vueuse/core'
import dayjs from 'dayjs'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Check, QrCode, ShoppingCart, Trash2 } from 'lucide-vue-next'
import { onMounted, reactive, Ref, ref } from 'vue'
import { StreamBarcodeReader } from 'vue-barcode-reader'
import Vue3EasyDataTable, { type Header } from 'vue3-easy-data-table'

import CTableSkeleton from '@/components/CTableSceleton.vue'
import { paymentType } from '@/data'
import { getOffices } from '@/modules/Offices/controller'
import { IOffice } from '@/modules/Offices/types.ts'
import { deleteTemOrder } from '@/modules/Order/controller'
import { getProducts } from '@/modules/Products/controller'
import { IProduct } from '@/modules/Products/types.ts'
import {
  addOrderItem,
  addProductItem,
  deleteOrderItem,
  getReplenishmentOrders,
  processReplenishmentOrder,
} from '@/modules/Replenishment/controller'
import { IReplenishment } from '@/modules/Replenishment/types.ts'
import { getSuppliers } from '@/modules/UserController/controller'
import {
  ISuppliers,
  ITemplateProducts,
} from '@/modules/UserController/types.ts'
import { useMainStore } from '@/store'

const fullscreen = ref(false)
const { width } = useWindowSize()
const store = useMainStore()
const suppliersList: Ref<ISuppliers[] | undefined> = ref()
const locationsList: Ref<IOffice[] | undefined> = ref()
const products: Ref<IProduct[] | undefined> = ref()
const allReplenishments: Ref<IReplenishment[] | undefined> = ref()
const templateProducts: Ref<ITemplateProducts[]> = ref([])
const tempOrders: Ref<IReplenishment[] | undefined> = ref()
const completedOrders: Ref<IReplenishment[] | undefined> = ref()
const product: Ref<IProduct | undefined> = ref()
const currentOrder = ref(null)
const tempHeaders: Header[] = [
  { text: 'Id', value: 'productId', sortable: true },
  { text: 'Название', value: 'product.name', sortable: true },
  { text: 'Количество', value: 'quantity' },
  { text: 'Чистая цена', value: 'costPrice' },
  { text: 'Мин. цена продажи', value: 'minSalePrice' },
  { text: 'Управление', value: 'opera' },
]
const tempHeadersView: Header[] = [
  { text: 'Id', value: 'productId', sortable: true },
  { text: 'Название', value: 'product.name', sortable: true },
  { text: 'Количество', value: 'quantity' },
  { text: 'Чистая цена', value: 'costPrice' },
  { text: 'Мин. цена продажи', value: 'minSalePrice' },
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
  { text: 'Управление', value: 'opera' },
]
const dialogCreate = ref(false)
const dialogUpdate = ref(false)
const dialogView = ref(false)
const searchValue = ref('')
const innerVisibleCreate = ref(false)
const innerVisibleUpdate = ref(false)
const quantity = ref(null)
const costPrice = ref(null)
const minSalePrice = ref(null)
const salePrice = ref(0)
const scanDialog = ref(false)
const order = reactive({
  sourceId: null,
  destinationId: null,
  paymentType: null,
  items: [],
})
const rules = {
  sourceId: { required },
  destinationId: { required },
  paymentType: { required },
}
const v$ = useVuelidate(rules, order)

const onDecode = (result: any) => {
  searchValue.value = result
  scanDialog.value = false
}
function stopVideo() {
  if (window.localStream) {
    window.localStream.getTracks().forEach((track) => {
      track.stop()
    })
  }
}
const scanDialogOpen = async () => {
  try {
    await navigator.mediaDevices.getUserMedia({ video: true })
    scanDialog.value = true
  } catch (err) {
    alert(err)
  }
}
const openCreateModal = () => {
  v$.value.$touch()
  if (v$.value.$invalid) return
  templateProducts.value = []
  dialogCreate.value = true
}
const openDialogUpdate = (item) => {
  dialogUpdate.value = true
  templateProducts.value = item.items
  currentOrder.value = item
}
const innerDialogCreate = (item: IProduct) => {
  innerVisibleCreate.value = true
  quantity.value = null
  costPrice.value = null
  minSalePrice.value = null
  salePrice.value = 0
  product.value = item
}
const innerDialogUpdate = (item: IProduct) => {
  innerVisibleUpdate.value = true
  quantity.value = null
  costPrice.value = null
  minSalePrice.value = null
  salePrice.value = 0
  product.value = item
}
const addProduct = async (status: string) => {
  if (quantity.value && costPrice.value && minSalePrice.value) {
    store.loading = true
    if (status === 'update') {
      await addOrderItem({
        productId: product.value.id,
        orderId: currentOrder.value.id,
        quantity: quantity.value,
        costPrice: costPrice.value,
        minSalePrice: minSalePrice.value,
        salePrice: salePrice.value,
      })
    }
    templateProducts.value.push({
      productId: product.value.id,
      product: {
        name: product.value.name,
      },
      image: product.value.image,
      quantity: quantity.value,
      costPrice: costPrice.value,
      minSalePrice: minSalePrice.value,
      salePrice: salePrice.value,
    })
    innerVisibleCreate.value = false
    innerVisibleUpdate.value = false
    store.loading = false
  }
}
const removeItemCreate = (item) => {
  const fIndex = (element) => element.productId == item.productId
  const index = templateProducts.value.findIndex(fIndex)
  templateProducts.value.splice(index, 1)
}
const removeItemUpdate = async (item) => {
  await deleteOrderItem(item.id, currentOrder.value.id).then(() => {
    const fIndex = (element) => element.id == item.id
    const index = templateProducts.value.findIndex(fIndex)
    templateProducts.value.splice(index, 1)
  })
}

const deleteTempOrder = async (item: IReplenishment) => {
  await deleteTemOrder(item.id)
  allReplenishments.value = await getReplenishmentOrders()
  tempOrders.value = allReplenishments.value.filter((el) => {
    if (el.status === 'Template') return el
  })
  completedOrders.value = allReplenishments.value.filter((el) => {
    if (el.status === 'Completed') return el
  })
}

const saveCreateProducts = async () => {
  store.loading = true
  order.items = templateProducts.value.map((el) => {
    return {
      productId: el.productId,
      quantity: el.quantity,
      costPrice: el.costPrice,
      minSalePrice: el.minSalePrice,
      salePrice: el.salePrice,
    }
  })
  await addProductItem(order)
  templateProducts.value = []
  allReplenishments.value = await getReplenishmentOrders()
  tempOrders.value = allReplenishments.value.filter((el) => {
    if (el.status === 'Template') return el
  })
  completedOrders.value = allReplenishments.value.filter((el) => {
    if (el.status === 'Completed') return el
  })
  dialogCreate.value = false
  store.loading = false
}
const saveUpdateProducts = () => {
  dialogUpdate.value = false
}
const processReplenishment = async (item: IReplenishment) => {
  ElMessageBox.confirm('Продолжить?', 'Внимание!', {
    confirmButtonText: 'Да',
    cancelButtonText: 'Нет',
    type: 'warning',
  })
    .then(async () => {
      store.loading = true
      ElMessage({
        type: 'success',
        message: 'Завершен',
      })
      await processReplenishmentOrder(item.id)
      allReplenishments.value = await getReplenishmentOrders()
      tempOrders.value = allReplenishments.value.filter((el) => {
        if (el.status === 'Template') return el
      })
      completedOrders.value = allReplenishments.value.filter((el) => {
        if (el.status === 'Completed') return el
      })
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: 'Отменен',
      })
    })
    .finally(() => {
      store.loading = false
    })
}
const viewOrders = (item: IReplenishment) => {
  dialogView.value = true
  templateProducts.value = item.items
}

onMounted(async () => {
  suppliersList.value = await getSuppliers()
  locationsList.value = await getOffices()
  products.value = await getProducts()
  allReplenishments.value = await getReplenishmentOrders()
  tempOrders.value = allReplenishments.value.filter((el) => {
    if (el.status === 'Template') return el
  })
  completedOrders.value = allReplenishments.value.filter((el) => {
    if (el.status === 'Completed') return el
  })
  fullscreen.value = width.value <= 768
})
</script>
<style scoped></style>
