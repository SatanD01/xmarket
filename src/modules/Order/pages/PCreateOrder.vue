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
          filterable
          :class="v$.destinationId.$error ? 'error' : ''"
          placeholder="Клиент"
        >
          <el-option
            v-for="(item, index) in suppliersList"
            :value="item?.id"
            :label="item?.name"
            :key="index"
          >
            <span>{{ item.name }}</span>
            <span class="float-end">{{ item.phone }}</span>
          </el-option>
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
            <template #item-summ="item">
              <p>{{ item.quantity * item.salePrice }}</p>
            </template>
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
              title="Добавить товар"
              append-to-body
            >
              <div class="grid grid-cols-1 gap-3">
                <div>
                  <p>Макс: {{ product?.quantity }}</p>
                  <el-input
                    placeholder="Количество"
                    v-model="quantity"
                    :max="product?.quantity"
                    :min="0"
                    type="number"
                  />
                </div>
                <div>
                  <span
                    >Мин. цена продажи опт.: {{ product?.minSalePrice }} ||
                  </span>
                  <span>
                    Мин. цена продажи роз.: {{ product?.minSalePriceRetail }}
                  </span>
                  <el-input
                    placeholder="Цена продажи"
                    v-model="salePrice"
                    :min="0"
                    type="number"
                  />
                </div>
              </div>

              <template #footer>
                <el-button
                  :disabled="quantity > product.quantity"
                  type="primary"
                  @click="addProduct('create')"
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
            <template #item-summ="item">
              <p>{{ item.quantity * item.salePrice }}</p>
            </template>
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
            <RouterLink
              :to="{
                name: 'PPdf',
                query: {
                  id: currentOrder?.id,
                },
              }"
              class="py-2"
            >
              <el-button type="primary" class="w-[100px] me-2">
                <Printer :size="15" class="me-2" /> Печать</el-button
              >
            </RouterLink>
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
              <div class="grid md:grid-cols-2 grid-cols-1 gap-3">
                <div>
                  <p>Макс: {{ product?.quantity }}</p>
                  <el-input
                    placeholder="Количество"
                    v-model="quantity"
                    :max="product?.quantity"
                    :min="0"
                    type="number"
                  />
                </div>
                <div>
                  <p>Мин. цена продажи опт.: {{ product?.minSalePrice }}</p>
                  <el-input
                    placeholder="Цена продажи опт."
                    v-model="salePrice"
                    :min="0"
                    type="number"
                  />
                </div>
                <div>
                  <p>
                    Мин. цена продажи роз.: {{ product?.minSalePriceRetail }}
                  </p>
                  <el-input
                    placeholder="Цена продажи роз."
                    v-model="salePrice"
                    :min="0"
                    type="number"
                  />
                </div>
              </div>

              <template #footer>
                <el-button
                  type="primary"
                  :disabled="quantity > product.quantity"
                  @click="addProduct('update')"
                  >Сохранить</el-button
                >
              </template>
            </el-dialog>
          </div>
        </el-dialog>
      </div>
    </div>
    <div v-if="tempOrders && completedOrders">
      <div v-if="tempOrders.length" class="bg-white p-3 mt-5 rounded-lg shadow">
        <h3 class="text-[24px] font-bold">Заготовки заказов</h3>
        <Vue3EasyDataTable
          hover:shadow-xl
          transition
          buttons-pagination
          duration-200
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
      <div
        v-if="completedOrders.length"
        class="bg-white p-3 mt-5 rounded-lg shadow"
      >
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
    <CTableSceleton v-else />
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
      <RouterLink
        :to="{
          name: 'PPdf',
          query: {
            id: currentOrder?.id,
          },
        }"
        class="py-2 float-end"
      >
        <el-button type="primary" class="w-[100px] mt-3">
          <Printer :size="15" class="me-2" /> Печать</el-button
        >
      </RouterLink>
    </el-dialog>
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
import { Check, Printer, QrCode, ShoppingCart, Trash2 } from 'lucide-vue-next'
import { computed, onMounted, reactive, Ref, ref, watch } from 'vue'
import { StreamBarcodeReader } from 'vue-barcode-reader'
import Vue3EasyDataTable, { type Header, Item } from 'vue3-easy-data-table'

import CTableSceleton from '@/components/CTableSceleton.vue'
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
  { text: 'Цена продажи', value: 'salePrice' },
  { text: 'Общая цена', value: 'summ' },
  { text: 'Управление', value: 'opera' },
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
function stopVideo() {
  if (window.localStream) {
    window.localStream.getTracks().forEach((track) => {
      track.stop()
    })
  }
}
const tempHeadersView: Header[] = [
  { text: 'Id', value: 'productId', sortable: true },
  { text: 'Название', value: 'product.name', sortable: true },
  { text: 'Количество', value: 'quantity' },
  { text: 'Мин. цена продажи опт.', value: 'minSalePrice' },
  { text: 'Мин. цена продажи роз.', value: 'minSalePriceRetail' },
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
  { text: 'Мин. цена продажи опт.', value: 'minSalePrice', sortable: true },
  {
    text: 'Мин. цена продажи роз.',
    value: 'minSalePriceRetail',
    sortable: true,
  },
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
      minSalePrice: item.minSalePrice,
      minSalePriceRetail: item.minSalePriceRetail,
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
const salePrice = ref(null)
// const costPrice = ref(null)
// const salePrice = ref(null)
const loader = ref(false)
const onDecode = (result: any) => {
  searchValue.value = result
  scanDialog.value = false
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
  products.value = await getAllProducts(order.sourceId)
  dialogCreate.value = true
  loader.value = false
}
const openDialogUpdate = async (item) => {
  dialogUpdate.value = true
  templateProducts.value = item.items
  currentOrder.value = item
  products.value = await getAllProducts(item.sourceId)
}
const innerDialogCreate = (item: IProduct) => {
  innerVisibleCreate.value = true
  quantity.value = null
  salePrice.value = null
  product.value = item
}
const innerDialogUpdate = (item: IProduct) => {
  innerVisibleUpdate.value = true
  quantity.value = null
  salePrice.value = null
  product.value = item
}
const addProduct = async (status: string) => {
  if (quantity.value && salePrice.value) {
    if (status === 'update') {
      await addOrderItem({
        productId: product.value.id,
        orderId: currentOrder.value.id,
        quantity: Number(quantity.value),
        costPrice: product.value.costPrice,
        minSalePrice: product.value.minSalePrice,
        minSalePriceRetail: product.value.minSalePriceRetail,
        salePrice: Number(salePrice.value),
      })
    }
    templateProducts.value.push({
      productId: product.value.id,
      product: {
        name: product.value.name,
      },
      image: product.value.image,
      quantity: Number(quantity.value),
      costPrice: product.value.costPrice,
      minSalePrice: product.value.minSalePrice,
      minSalePriceRetail: product.value.minSalePriceRetail,
      salePrice: Number(salePrice.value),
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
      minSalePrice: el.minSalePrice,
      minSalePriceRetail: el.minSalePriceRetail,
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
const viewOrders = (item) => {
  dialogView.value = true
  templateProducts.value = item.items
  currentOrder.value = item
}
watch(
  () => order.sourceId,
  async () => {},
)
onMounted(async () => {
  allReplenishments.value = await getSaleOrders()
  tempOrders.value = allReplenishments.value.filter((el) => {
    if (el.status === 'Template') return el
  })
  completedOrders.value = allReplenishments.value.filter((el) => {
    if (el.status === 'Completed') return el
  })
  suppliersList.value = await getCustomers()
  locationsList.value = await getOffices()
  if (order.sourceId) {
    products.value = await getAllProducts(order.sourceId)
  }
  fullscreen.value = width.value <= 768
})
</script>
<style scoped></style>
