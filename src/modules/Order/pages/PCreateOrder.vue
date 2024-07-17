<template>
  <div>
    <div class="grid grid-cols-1 gap-3 bg-white p-3 shadow rounded-lg mb-3">
      <div class="flex items-center justify-between">
        <h3 class="text-[24px] font-bold">Создать заказ</h3>
        <el-button @click="openCreateModal()" type="primary">
          <p class="text-center">Создать заказ</p>
        </el-button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
        <el-select
          size="large"
          v-model="order.sourceId"
          :class="v$.sourceId.$error ? 'error' : ''"
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
          v-model="order.destinationId"
          :class="v$.destinationId.$error ? 'error' : ''"
          placeholder="Клиент"
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
      <div v-if="products">
        <el-dialog
          v-model="scanDialog"
          title="Сканер бар кода"
          :align-center="width < 768"
          :width="width > 768 ? 500 : 300"
        >
          <div>
            <StreamBarcodeReader @decode="onDecode" @load="onLoaded" />
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
              title="Добаить товар"
              append-to-body
            >
              <div class="flex items-center gap-2">
                <el-input
                  class="!w-[150px]"
                  placeholder="Количество"
                  v-model="quantity"
                />
              </div>

              <template #footer>
                <el-button type="primary" @click="addProduct('create')"
                  >Создать</el-button
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
              <div class="flex items-center gap-2">
                <el-input
                  class="!w-[150px]"
                  placeholder="Количество"
                  v-model="quantity"
                />
              </div>

              <template #footer>
                <el-button type="primary" @click="addProduct('update')"
                  >Сохранить</el-button
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
    </div>

    <div
      v-show="order.destinationId && templateProducts"
      class="bg-white p-3 mt-5 rounded-lg shadow"
    >
      <h3 class="text-[24px] font-bold">Загатовки заказов</h3>
      <div class="grid grid-cols-2 md:grid-cols-6 gap-3 mt-4">
        <div
          v-for="(elem, index) in tempOrders"
          :key="index"
          class="cursor-pointer relative"
        >
          <div
            @click="openDialogUpdate(elem)"
            class="shadow p-3 bg-[#409eef] rounded-lg w-full flex flex-col gap-1 justify-center items-center hover:shadow-xl transition duration-200 ease-in-out"
          >
            <el-icon size="22" color="white"><FolderOpened /></el-icon>
            <p class="text-center text-white">
              {{ dayjs(elem.createdAt).format('DD.MM.YYYY HH:mm') }}
            </p>
            <p class="text-white">ID: {{ elem.id }}</p>
          </div>

          <el-button
            @click="processReplenishment(elem)"
            type="primary"
            plain
            class="mt-1 w-full"
            :loading="store.loading"
            >Oбработка</el-button
          >
          <el-button
            type="danger"
            :icon="Delete"
            size="small"
            circle
            @click="deleteTempOrder(elem)"
            class="absolute top-[-2px] right-[-2px]"
          />
        </div>
      </div>
    </div>
    <div
      v-show="order.destinationId && templateProducts"
      class="bg-white p-3 mt-5 rounded-lg shadow"
    >
      <h3 class="text-[24px] font-bold">Завершенные заказы</h3>
      <div class="grid grid-cols-2 md:grid-cols-6 gap-3 mt-4">
        <div
          v-for="(elem, index) in completedOrders"
          :key="index"
          class="cursor-pointer"
        >
          <div
            @click="viewOrders(elem)"
            class="shadow text-[14px] leading-5 p-3 bg-[#2EB959] rounded-lg w-full flex flex-col gap-1 justify-center items-center hover:shadow-xl transition duration-200 ease-in-out"
          >
            <el-icon size="22" color="white"><FolderOpened /></el-icon>
            <p class="text-white">
              {{ elem.source.name }} - {{ elem.destination.name }}
            </p>
            <p class="text-center text-white">
              {{ dayjs(elem.createdAt).format('DD.MM.YYYY HH:mm') }}
            </p>
            <p class="text-white">ID: {{ elem.id }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!--  <CTableSkeleton v-else />-->
</template>

<script setup lang="ts">
import { Delete, FolderOpened } from '@element-plus/icons-vue'
import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import { useWindowSize } from '@vueuse/core'
import dayjs from 'dayjs'
import { ElMessage, ElMessageBox } from 'element-plus'
import { QrCode } from 'lucide-vue-next'
import { computed, onMounted, reactive, Ref, ref, watch } from 'vue'
import { StreamBarcodeReader } from 'vue-barcode-reader'
import Vue3EasyDataTable, { type Header, Item } from 'vue3-easy-data-table'

import { paymentType } from '@/data'
import { getOffices } from '@/modules/Offices/controller'
import { IOffice } from '@/modules/Offices/types.ts'
import {
  addProductItem,
  deleteTemOrder,
  getAllProducts,
  getSaleOrders,
  processSaleOrder,
} from '@/modules/Order/controller'
import { IProduct } from '@/modules/Products/types.ts'
import {
  addOrderItem,
  deleteOrderItem,
} from '@/modules/Replenishment/controller'
import { IReplenishment } from '@/modules/Replenishment/types.ts'
import { getCustomers } from '@/modules/UserController/controller'
import {
  ISuppliers,
  ITemplateProducts,
} from '@/modules/UserController/types.ts'
import { useMainStore } from '@/store'

const store = useMainStore()
const fullscreen = ref(false)
const { width } = useWindowSize()
const suppliersList: Ref<ISuppliers[] | undefined> = ref()
const locationsList: Ref<IOffice[] | undefined> = ref()
const products: Ref<IProduct[] | undefined> = ref()
const allReplenishments: Ref<IReplenishment[] | undefined> = ref()
const templateProducts: Ref<ITemplateProducts[]> = ref([])
const tempOrders: Ref<IReplenishment[] | undefined> = ref()
const completedOrders: Ref<IReplenishment[] | undefined> = ref()
const product: Ref<IProduct | undefined> = ref()
const scanDialog = ref(false)

const currentOrder = ref(null)
const tempHeaders: Header[] = [
  { text: 'Id', value: 'productId', sortable: true },
  { text: 'Название', value: 'product.name', sortable: true },
  { text: 'Количество', value: 'quantity' },
  { text: 'Цена', value: 'salePrice' },
  { text: 'Управление', value: 'opera' },
]
const tempHeadersView: Header[] = [
  { text: 'Id', value: 'productId', sortable: true },
  { text: 'Название', value: 'product.name', sortable: true },
  { text: 'Количество', value: 'quantity' },
  { text: 'Цена', value: 'salePrice' },
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
  { text: 'Количество', value: 'quantity', sortable: true },
  { text: 'Цена', value: 'salePrice', sortable: true },
  { text: 'Управление', value: 'opera' },
]
const items: Item[] = computed(() => {
  return products.value.map((item) => {
    return {
      id: item.product.id,
      image: item.product.image,
      name: item.product.name,
      description: item.product.description,
      manufacturer: item.product.manufacturer,
      origin: item.product.origin,
      carModel: item.product.carModel,
      carYear: item.product.carYear,
      group: item.product.group,
      partNumber: item.product.partNumber,
      manualCode: item.product.manualCode,
      weight: item.product.weight,
      quantity: item.quantity,
      salePrice: item.salePrice,
      costPrice: item.costPrice,
    }
  })
})
const dialogCreate = ref(false)
const dialogUpdate = ref(false)
const dialogView = ref(false)
const searchValue = ref('')
const innerVisibleCreate = ref(false)
const innerVisibleUpdate = ref(false)
const quantity = ref(null)
// const costPrice = ref(null)
// const salePrice = ref(null)
const loader = ref(false)
const onDecode = (result: any) => {
  searchValue.value = result
  if (product.value.product.partNumber) scanDialog.value = false
}
const scanDialogOpen = async () => {
  try {
    await navigator.mediaDevices.getUserMedia({ video: true })
    scanDialog.value = true
  } catch (err) {
    alert(err)
  }
}
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

const openCreateModal = async () => {
  v$.value.$touch()
  if (v$.value.$invalid) return
  templateProducts.value = []
  loader.value = true
  console.log(order)
  products.value = await getAllProducts(order.sourceId)
  dialogCreate.value = true
  loader.value = false
}
const openDialogUpdate = async (item) => {
  dialogUpdate.value = true
  templateProducts.value = item.items
  currentOrder.value = item
  console.log(item)
  products.value = await getAllProducts(item.sourceId)
  console.log(item)
}
const innerDialogCreate = (item: IProduct) => {
  innerVisibleCreate.value = true
  quantity.value = null
  product.value = item
}
const innerDialogUpdate = (item: IProduct) => {
  innerVisibleUpdate.value = true
  quantity.value = null
  product.value = item
}
const addProduct = async (status: string) => {
  if (quantity.value) {
    if (status === 'update') {
      await addOrderItem({
        productId: product.value.id,
        orderId: currentOrder.value.id,
        quantity: quantity.value,
        costPrice: product.value.costPrice,
        salePrice: product.value.salePrice,
      })
    }
    templateProducts.value.push({
      productId: product.value.id,
      product: {
        name: product.value.name,
      },
      image: product.value.image,
      quantity: quantity.value,
      costPrice: product.value.costPrice,
      salePrice: product.value.salePrice,
    })
    innerVisibleCreate.value = false
    innerVisibleUpdate.value = false
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
  allReplenishments.value = await getSaleOrders()
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
      salePrice: el.salePrice,
    }
  })
  await addProductItem(order)
  templateProducts.value = []
  allReplenishments.value = await getSaleOrders()
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
    cancelButtonText: 'Отменить',
    type: 'warning',
  })
    .then(async () => {
      store.loading = true
      ElMessage({
        type: 'success',
        message: 'Успешно обработан',
      })
      await processSaleOrder(item.id)
      allReplenishments.value = await getSaleOrders()
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
        message: 'Обработка отменено',
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
watch(
  () => order.destinationId,
  async () => {
    allReplenishments.value = await getSaleOrders()
    tempOrders.value = allReplenishments.value.filter((el) => {
      if (el.status === 'Template') return el
    })
    completedOrders.value = allReplenishments.value.filter((el) => {
      if (el.status === 'Completed') return el
    })
  },
)
onMounted(async () => {
  suppliersList.value = await getCustomers()
  locationsList.value = await getOffices()
  if (order.sourceId) {
    products.value = await getAllProducts(order.sourceId)
  }
  fullscreen.value = width.value <= 768
})
</script>
<style scoped></style>
