<template>
  <div>
    <div class="p-3 bg-white shadow rounded-lg">
      <h3 class="text-[24px] font-bold capitalize">Return Transaction</h3>
    </div>
    <div class="bg-white p-3 mt-5 rounded-lg shadow">
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
            @click="returnTransaction(item)"
            class="cursor-pointer"
            size="large"
            ><FileOutput
          /></el-icon>
        </div>
      </template>
    </Vue3EasyDataTable>
  </el-dialog>
</template>
<script setup lang="ts">
import { FolderOpened } from '@element-plus/icons-vue'
import { useWindowSize } from '@vueuse/core'
import dayjs from 'dayjs'
import { FileOutput } from 'lucide-vue-next'
import { onMounted, reactive, Ref, ref } from 'vue'
import Vue3EasyDataTable, { type Header } from 'vue3-easy-data-table'

import { useApi } from '@/composables/useApi.ts'
import { getSaleOrders } from '@/modules/Order/controller'
import { IProduct } from '@/modules/Products/types.ts'

const fullscreen = ref(false)
const { width } = useWindowSize()
const products: Ref<IProduct[] | undefined> = ref([])
const templateOrders = ref([])
const order = reactive({
  sourceId: null,
  destinationId: null,
  paymentType: null,
  items: [],
})

const dialogUpdate = ref(false)
const currentOrder = ref(null)
const tempUpdateHeaders: Header[] = [
  { text: 'Id', value: 'product.id', sortable: true },
  { text: 'Название', value: 'product.name', sortable: true },
  { text: 'Количество', value: 'quantity' },
  // { text: 'Enter quantity', value: 'input' },
  { text: 'Цена продажи', value: 'salePrice' },
  { text: 'Return', value: 'opera' },
]

const openDialogUpdate = (item) => {
  dialogUpdate.value = true
  currentOrder.value = item
  order.sourceId = item.sourceId
}
const returnTransaction = async (data) => {
  try {
    console.log(data, 'data')
    await useApi().$post('Inventory/AddSaleReturnTransaction', {
      productId: data?.productId,
      quantity: data?.quantity,
      costPrice: data?.costPrice,
      salePrice: data?.salePrice,
      sourceId: currentOrder.value?.sourceId,
      destinationId: currentOrder.value?.destinationId,
    })
    // console.log(res.data)
  } catch (err) {
    console.log(err)
  }
}
onMounted(async () => {
  try {
    templateOrders.value = await getSaleOrders()
  } catch (err) {
    console.log(err)
  }
  fullscreen.value = width.value <= 768
})
</script>
