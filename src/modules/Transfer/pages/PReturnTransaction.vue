<template>
  <div>
    <div class="p-3 bg-white shadow rounded-lg mb-5">
      <h3 class="text-[24px] font-bold capitalize">Возврат товара</h3>
    </div>
    <CTableSceleton v-if="loading" />
    <div v-else class="bg-white p-3 rounded-lg shadow">
      <el-dialog
        v-model="scanDialog"
        title="Сканер бар кода"
        :align-center="width < 768"
        @closed="stopVideo"
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
            >
              <template #viewer>
                <div
                  class="custom-viewer flex flex-row absolute top-[50px] left-[30px]"
                >
                  <el-button
                    @click="copyImage(`data:image/jpeg;base64,${item.image}`)"
                    >Копировать</el-button
                  >
                  <el-button
                    @click="
                      downloadImage(`data:image/jpeg;base64,${item.image}`)
                    "
                    >Скачать</el-button
                  >
                </div>
              </template>
            </el-image>
          </div>
        </template>
        <template #item-origin="item">
          <span>{{
            item.origin === 'Original' ? 'Оригинал' : 'Дубликат'
          }}</span>
        </template>
        <template
          v-if="[Roles.ADMIN, Roles.MANAGER].includes(authStore.user?.role)"
          #item-opera="data"
        >
          <div class="flex items-center">
            <el-button
              @click="onOpenDialog(data)"
              size="small"
              class="!py-2 !px-1 !ml-[8px]"
              type="danger"
              plain
            >
              Возврат
            </el-button>
          </div>
        </template>
      </Vue3EasyDataTable>
    </div>

    <el-dialog title="Возврат товара" :fullscreen="fullscreen" v-model="dialog">
      <div class="py-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <el-select
          v-model="order.sourceId"
          placeholder="Клиент"
          filterable
          :class="{ error: v$.sourceId.$error }"
        >
          <el-option
            v-for="(item, index) in customers"
            :key="index"
            :value="item.id"
            :label="item.name"
          >
            <span>{{ item.name }}</span>
            <span class="float-end">{{ item.phone }}</span>
          </el-option>
        </el-select>
        <el-select
          v-model="order.destinationId"
          placeholder="Магазин"
          filterable
          :class="{ error: v$.destinationId.$error }"
        >
          <el-option
            v-for="(item, index) in locations"
            v-show="item.type == 'Store'"
            :key="index"
            :value="item.id"
            :label="item.name"
          >
            {{ item.name }}
          </el-option>
        </el-select>
        <el-input
          v-model="order.quantity"
          type="number"
          placeholder="Количество"
          :class="{ error: v$.quantity.$error }"
        />
        <el-input
          v-model="order.costPrice"
          type="number"
          placeholder="Чистая цена"
          :class="{ error: v$.costPrice.$error }"
        />
        <el-input
          v-model="order.salePrice"
          type="number"
          placeholder="Цена продажи"
          :class="{ error: v$.salePrice.$error }"
        />
        <el-input
          v-model="order.minSalePrice"
          type="number"
          placeholder="Мин. цена продажи"
          :class="{ error: v$.minSalePrice.$error }"
        />
        <el-button
          type="primary"
          @click="returnTransaction"
          :loading="submitLoading"
        >
          Сделать возврат
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import { useWindowSize } from '@vueuse/core'
import { ElMessage } from 'element-plus'
import { QrCode } from 'lucide-vue-next'
import { onMounted, reactive, Ref, ref } from 'vue'
import { StreamBarcodeReader } from 'vue-barcode-reader'
import Vue3EasyDataTable, { type Header } from 'vue3-easy-data-table'

import CTableSceleton from '@/components/CTableSceleton.vue'
import { useApi } from '@/composables/useApi.ts'
import { useAuthStore } from '@/modules/Auth/store.ts'
import { getOffices } from '@/modules/Offices/controller'
import { getProducts } from '@/modules/Products/controller'
import { IProduct } from '@/modules/Products/types.ts'
import { getCustomers } from '@/modules/UserController/controller'
import { Roles } from '@/types'

const fullscreen = ref(false)
const { width } = useWindowSize()
const authStore = useAuthStore()
const dialog = ref(false)
const products: Ref<IProduct[] | undefined> = ref([])
const searchValue = ref('')
const customers = ref([])
const locations = ref([])
const scanDialog = ref(false)
const submitLoading = ref(false)

const order = reactive({
  sourceId: null,
  destinationId: null,
  quantity: '',
  costPrice: '',
  salePrice: '',
  minSalePrice: '',
})
function stopVideo() {
  if (window.localStream) {
    window.localStream.getTracks().forEach((track) => {
      track.stop()
    })
  }
}
const rules = {
  sourceId: { required },
  destinationId: { required },
  quantity: { required },
  costPrice: { required },
  salePrice: { required },
  minSalePrice: { required },
}
const v$ = useVuelidate(rules, order)
const loading = ref(false)
const currentOrder = ref(null)
const headers: Header[] = [
  { text: 'Id', value: 'id', sortable: true },
  { text: 'Фото', value: 'image' },
  { text: 'Название', value: 'name', sortable: true },
  { text: 'Описание', value: 'description', sortable: true },
  { text: 'Производитель', value: 'manufacturer', sortable: true },
  { text: 'Тип', value: 'origin', sortable: true },
  { text: 'Модель', value: 'carModel', sortable: true },
  { text: 'Год выпуска', value: 'carYear', sortable: true },
  { text: 'Категория', value: 'group', sortable: true },
  { text: 'Баркод', value: 'partNumber', sortable: true },
  { text: 'Код', value: 'manualCode', sortable: true },
  { text: 'Вес', value: 'weight', sortable: true },
  { text: 'Управление', value: 'opera' },
]
const copyImage = async (base64String) => {
  try {
    const img = new Image()
    img.src = base64String

    img.onload = async () => {
      const canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0)

      canvas.toBlob(async (blob) => {
        try {
          const item = new ClipboardItem({ 'image/png': blob })
          await navigator.clipboard.write([item])
          ElMessage.success('Изображение скопировано в буфер обмена')
        } catch (err) {
          console.error(err)
          ElMessage.error('Не удалось скопировать изображение')
        }
      }, 'image/png')
    }
  } catch (err) {
    console.error(err)
    ElMessage.error('Не удалось скопировать изображение')
  }
}

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

const downloadImage = (img) => {
  const link = document.createElement('a')
  link.href = img
  link.download = 'image.jpeg'
  link.click()
}
const returnTransaction = async () => {
  v$.value.$touch()
  if (v$.value.$invalid) return
  submitLoading.value = true
  try {
    await useApi().$post('Inventory/AddSaleReturnTransaction', {
      productId: currentOrder.value?.id,
      quantity: order?.quantity,
      costPrice: order?.costPrice,
      salePrice: order?.salePrice,
      minSalePrice: order?.minSalePrice,
      sourceId: order.sourceId,
      destinationId: order.destinationId,
    })
    dialog.value = false
    for (let key in order) {
      order[key] = ''
    }
    v$.value.$reset()
  } catch (err) {
    console.log(err)
  } finally {
    submitLoading.value = false
  }
}

const onOpenDialog = async (data) => {
  currentOrder.value = data
  dialog.value = true
}
onMounted(async () => {
  try {
    loading.value = true
    products.value = await getProducts()
    customers.value = await getCustomers()
    locations.value = await getOffices()
  } catch (err) {
    console.log(err)
  } finally {
    loading.value = false
  }
  fullscreen.value = width.value <= 768
})
</script>
