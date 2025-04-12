<template>
  <div>
    <div>
      <div
        class="bg-white gap-3 shadow rounded-lg mb-3 p-3 flex items-center justify-between"
      >
        <h1 class="font-bold text-[32px]">Доступные товары</h1>
        <div class="flex gap-3 items-center">
          <label for="location"></label>
          <el-select
            v-model="office"
            class="min-w-[120px]"
            @change="getAvailableProduct"
          >
            <el-option
              v-for="(item, index) in officesList"
              v-show="item.type === 'Store'"
              :label="item.name"
              :value="item.id"
              :key="index"
            />
          </el-select>
        </div>
      </div>
      <div v-if="products" class="bg-white p-3 rounded-lg shadow">
        <div class="flex items-center gap-3">
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
            class="!ms-0 mb-3 !p-2"
            ><QrCode
          /></el-button>
        </div>
        <Vue3EasyDataTable
          buttons-pagination
          :headers="headers"
          :items="items"
          :search-field="[
            'product.id',
            'product.name',
            'product.description',
            'product.manufacturer',
            'product.origin',
            'product.carModel',
            'product.carYear',
            'product.group',
            'product.partNumber',
            'product.manualCode',
            'product.weight',
            'product.quantity',
            'product.salePrice',
            'product.minSalePrice',
            'product.minSalePriceRetail',
          ]"
          :search-value="searchValue"
        >
          <template #item-image="item">
            <div class="py-3">
              <el-image
                style="width: 80px; height: 60px"
                :src="`data:image/jpeg;base64,${item.product.image}`"
                :zoom-rate="1.0"
                :max-scale="5"
                :min-scale="0.2"
                :preview-src-list="[
                  `data:image/jpeg;base64,${item.product.image}`,
                ]"
                :initial-index="4"
                fit="cover"
              >
                <template #viewer>
                  <div
                    class="custom-viewer flex flex-row absolute top-[50px] left-[30px]"
                  >
                    <el-button
                      @click="
                        copyImage(
                          `data:image/jpeg;base64,${item.product.image}`,
                        )
                      "
                      >Копировать</el-button
                    >
                    <el-button
                      @click="
                        downloadImage(
                          `data:image/jpeg;base64,${item.product.image}`,
                        )
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
              item.product.origin === 'Original' ? 'Оригинал' : 'Дубликат'
            }}</span>
          </template>
        </Vue3EasyDataTable>
      </div>
      <CTableSceleton v-else />
      <el-dialog
        v-model="scanDialog"
        title="Сканер бар кода"
        :align-center="width < 768"
        :width="width > 768 ? 500 : 300"
        @closed="stopVideo"
      >
        <div>
          <StreamBarcodeReader
            v-if="scanDialog"
            @decode="onDecode"
            @load="onLoaded"
          />
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useWindowSize } from '@vueuse/core'
import { ElMessage } from 'element-plus'
import { QrCode } from 'lucide-vue-next'
import { computed, onMounted, Ref, ref } from 'vue'
import { StreamBarcodeReader } from 'vue-barcode-reader'
import type { Header, Item } from 'vue3-easy-data-table'
import Vue3EasyDataTable from 'vue3-easy-data-table'

import CTableSceleton from '@/components/CTableSceleton.vue'
import { getOffices } from '@/modules/Offices/controller'
import { getAvailableProducts } from '@/modules/Products/controller'
import { IProduct } from '@/modules/Products/types.ts'

const scanDialog = ref(false)
const { width } = useWindowSize()
const searchValue = ref('')
const officesList = ref([])
const office = ref()
const products: Ref<IProduct[] | undefined> = ref()
function stopVideo() {
  if (window.localStream) {
    window.localStream.getTracks().forEach((track) => {
      track.stop()
    })
  }
}
const getAvailableProduct = async () => {
  products.value = await getAvailableProducts(office.value)
}
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

const downloadImage = (img) => {
  const link = document.createElement('a')
  link.href = img
  link.download = 'image.jpeg'
  link.click()
}

const onDecode = (result: any) => {
  searchValue.value = result
  scanDialog.value = false
}
const onLoaded = (error: any) => {
  console.log(error)
}
const scanDialogOpen = async () => {
  try {
    await navigator.mediaDevices.getUserMedia({ video: true })
    scanDialog.value = true
  } catch (err) {
    alert(err)
  }
}
const headers: Header[] = [
  { text: 'Id', value: 'product.id', sortable: true },
  { text: 'Фото', value: 'image' },
  { text: 'Название', value: 'product.name', sortable: true },
  { text: 'Описание', value: 'product.description', sortable: true },
  { text: 'Производитель', value: 'product.manufacturer', sortable: true },
  { text: 'Тип', value: 'origin', sortable: true },
  { text: 'Модель', value: 'product.carModel', sortable: true },
  { text: 'Год выпуска', value: 'product.carYear', sortable: true },
  { text: 'Категория', value: 'product.group', sortable: true },
  { text: 'Баркод', value: 'product.partNumber', sortable: true },
  { text: 'Код', value: 'product.manualCode', sortable: true },
  { text: 'Вес', value: 'product.weight', sortable: true },
  { text: 'Количество', value: 'quantity', sortable: true },
  { text: 'Мин. цена продажи опт.', value: 'minSalePrice', sortable: true },
  {
    text: 'Мин. цена продажи роз.',
    value: 'minSalePriceRetail',
    sortable: true,
  },
]

const items = computed((): Item[] | undefined => {
  return products.value
})

onMounted(async () => {
  officesList.value = await getOffices()
  office.value = officesList.value.find((el) => el.type === 'Store')?.id
  products.value = await getAvailableProducts(office.value)
})
</script>

<style>
.custom-viewer el-button {
  margin: 5px;
}
</style>
