<template>
  <div v-if="products">
    <div class="grid grid-cols-1 gap-3 bg-white p-3 shadow rounded-lg mb-3">
      <div class="flex items-center justify-between">
        <h3 class="text-[24px] font-bold">Пополнение склада</h3>
        <el-button @click="openCreateModal()" type="primary">
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

      <el-dialog align-center v-model="dialogCreate" width="80%">
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
              <el-button type="primary" @click="addProduct('create')"
                >Save</el-button
              >
            </template>
          </el-dialog>
        </div>
      </el-dialog>
      <el-dialog align-center v-model="dialogUpdate" width="80%">
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
              <el-button type="primary" @click="addProduct('update')"
                >Save</el-button
              >
            </template>
          </el-dialog>
        </div>
      </el-dialog>
      <el-dialog align-center v-model="dialogView" width="80%">
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

    <div class="bg-white p-3 mt-5 rounded-lg shadow">
      <h3 class="text-[24px] font-bold">Template orders</h3>
      <div class="grid grid-cols-6 gap-3 mt-4">
        <div
          v-for="(elem, index) in tempOrders"
          :key="index"
          class="cursor-pointer"
        >
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
            @click="viewOrders(elem)"
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
  <CTableSkeleton v-else />
</template>

<script setup lang="ts">
import { Delete, FolderOpened } from '@element-plus/icons-vue'
import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import dayjs from 'dayjs'
import { ElMessage, ElMessageBox } from 'element-plus'
import { onMounted, reactive, Ref, ref } from 'vue'
import Vue3EasyDataTable, { type Header } from 'vue3-easy-data-table'

import CTableSkeleton from '@/components/CTableSceleton.vue'
import { paymentType } from '@/data'
import { getOffices } from '@/modules/Offices/controller'
import { IOffice } from '@/modules/Offices/types.ts'
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
import { getCustomers } from '@/modules/UserController/controller'
import {
  ISuppliers,
  ITemplateProducts,
} from '@/modules/UserController/types.ts'

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
  { text: 'Quantity', value: 'quantity' },
  { text: 'Cost price', value: 'costPrice' },
  { text: 'Sale price', value: 'salePrice' },
  { text: 'Operations', value: 'opera' },
]
const tempHeadersView: Header[] = [
  { text: 'Id', value: 'productId', sortable: true },
  { text: 'Название', value: 'product.name', sortable: true },
  { text: 'Quantity', value: 'quantity' },
  { text: 'Cost price', value: 'costPrice' },
  { text: 'Sale price', value: 'salePrice' },
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
  { text: 'Operations', value: 'opera' },
]
const dialogCreate = ref(false)
const dialogUpdate = ref(false)
const dialogView = ref(false)
const searchValue = ref('')
const innerVisibleCreate = ref(false)
const innerVisibleUpdate = ref(false)
const quantity = ref(null)
const costPrice = ref(null)
const salePrice = ref(null)
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

const openCreateModal = () => {
  v$.value.$touch()
  if (v$.value.$invalid) return
  dialogCreate.value = true
}
const openDialogUpdate = (item) => {
  dialogUpdate.value = true
  templateProducts.value = item.items
  currentOrder.value = item
  console.log(item)
}
const innerDialogCreate = (item: IProduct) => {
  innerVisibleCreate.value = true
  quantity.value = null
  costPrice.value = null
  salePrice.value = null
  product.value = item
}
const innerDialogUpdate = (item: IProduct) => {
  innerVisibleUpdate.value = true
  quantity.value = null
  costPrice.value = null
  salePrice.value = null
  product.value = item
}
const addProduct = async (status: string) => {
  if (quantity.value && costPrice.value && salePrice.value) {
    if (status === 'update') {
      await addOrderItem({
        productId: product.value.id,
        orderId: currentOrder.value.id,
        quantity: quantity.value,
        costPrice: costPrice.value,
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
      salePrice: salePrice.value,
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
const saveCreateProducts = async () => {
  order.items = templateProducts.value.map((el) => {
    return {
      productId: el.productId,
      quantity: el.quantity,
      costPrice: el.costPrice,
      salePrice: el.salePrice,
    }
  })
  await addProductItem(order)
  allReplenishments.value = await getReplenishmentOrders()
  tempOrders.value = allReplenishments.value.filter((el) => {
    if (el.status === 'Template') return el
  })
  completedOrders.value = allReplenishments.value.filter((el) => {
    if (el.status === 'Completed') return el
  })
  dialogCreate.value = false
}
const saveUpdateProducts = () => {
  dialogUpdate.value = false
}
const processReplenishment = async (item: IReplenishment) => {
  ElMessageBox.confirm('Continue?', 'Warning', {
    confirmButtonText: 'OK',
    cancelButtonText: 'Cancel',
    type: 'warning',
  })
    .then(async () => {
      ElMessage({
        type: 'success',
        message: 'Delete completed',
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
        message: 'Delete canceled',
      })
    })
}
const viewOrders = (item: IReplenishment) => {
  dialogView.value = true
  templateProducts.value = item.items
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
