<template>
  <div
    class="grid grid-cols-1 gap-3 bg-white rounded-lg shadow p-3"
    v-if="reports"
  >
    <h3 class="text-[24px] font-bold mb-3">Отчетность</h3>
    <div class="grid grid-cols-12 gap-3">
      <el-input
        placeholder="Поиск"
        class="col-span-12 md:col-span-4"
        size="large"
        v-model="searchValue"
      />
      <el-date-picker
        v-model="datePicker"
        type="daterange"
        class="col-span-12 md:col-span-4 !w-full"
        placeholder="Выберите дату"
        format="DD/MM/YYYY"
        :clearable="false"
        :editable="false"
        value-format="YYYY-MM-DD"
        range-separator="До"
        start-placeholder="Начало"
        end-placeholder="Конец"
        size="large"
      />
      <el-button
        @click="getReports(datePicker[0], datePicker[1])"
        size="large"
        type="primary"
        class="col-span-6 md:col-span-2"
        >Поиск</el-button
      >
      <el-button
        size="large"
        @click="scanDialogOpen"
        type="primary"
        class="!ms-0 !p-2 col-span-6 md:col-span-2"
        ><QrCode
      /></el-button>
    </div>
    <Vue3EasyDataTable
      id="my-spreadsheet"
      buttons-pagination
      :headers="headers"
      class="overflow-y-auto"
      :items="allItems"
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
        <div class="py-3" v-if="item.id">
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
    </Vue3EasyDataTable>
    <el-button type="primary" class="w-full !ms-0" @click="exportToCSV"
      ><ClipboardMinus />
      <span class="ms-2 text-wrap !leading-4"
        >Экспортровать отчет</span
      ></el-button
    >
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
  </div>
  <div v-else>
    <CTableSceleton />
  </div>
</template>
<script setup lang="ts">
import { useWindowSize } from '@vueuse/core'
import { ClipboardMinus, QrCode } from 'lucide-vue-next'
import { MaskInput } from 'maska'
import { computed, nextTick, onMounted, ref } from 'vue'
import { StreamBarcodeReader } from 'vue-barcode-reader'
import Vue3EasyDataTable, { type Header, Item } from 'vue3-easy-data-table'
import { toast } from 'vue3-toastify'

import CTableSceleton from '@/components/CTableSceleton.vue'
import { getSalesReports } from '@/modules/Charts/controller'

const reports = ref(null)
const searchValue = ref('')
const datePicker = ref('')
const { width } = useWindowSize()
function stopVideo() {
  if (window.localStream) {
    window.localStream.getTracks().forEach((track) => {
      track.stop()
    })
  }
}
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
  { text: 'Количество', value: 'quantitySold', sortable: true },
  { text: 'Цена чистая', value: 'totalCostPrice', sortable: true },
  { text: 'Цена продажи', value: 'totalSalePrice', sortable: true },
  { text: 'Прибыль', value: 'totalProfit', sortable: true },
]
const items: Item[] = computed(() => {
  return reports.value?.items.map((item) => {
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
      quantitySold: item.quantitySold,
      totalSalePrice: item.totalSalePrice,
      totalCostPrice: item.totalCostPrice,
      totalProfit: item.totalProfit,
    }
  })
})
const scanDialog = ref(false)
const totalProfitPrice = computed(() => {
  return {
    pure: items.value?.reduce((total, el) => total + el?.totalCostPrice, 0),
    sale: items.value?.reduce((total, el) => total + el?.totalSalePrice, 0),
    profit: items.value?.reduce((total, el) => total + el?.totalProfit, 0),
  }
})

const customRow = {
  id: '',
  image: '',
  name: '',
  description: '',
  manufacturer: '',
  origin: '',
  carModel: '',
  carYear: '',
  group: '',
  partNumber: '',
  manualCode: '',
  weight: '',
  quantitySold: 'Общая сумма:',
  totalSalePrice: totalProfitPrice.value.sale,
  totalCostPrice: totalProfitPrice.value.pure,
  totalProfit: totalProfitPrice.value.profit,
}

const allItems = computed(() => [
  ...items.value,
  {
    ...customRow,
    totalSalePrice: totalProfitPrice.value.sale,
    totalCostPrice: totalProfitPrice.value.pure,
    totalProfit: totalProfitPrice.value.profit,
  },
])
const onLoaded = (error: any) => {
  console.log(error)
}
const getReports = async (start, end) => {
  if (datePicker.value) {
    reports.value = await getSalesReports(start, end)
  } else {
    toast.error('Выберите дату')
  }
}
const getDateRange = () => {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')

  const startDate = `${year}-${month}-01`

  const nextWeek = new Date(today)
  nextWeek.setDate(today.getDate() + 7)
  const nextYear = nextWeek.getFullYear()
  const nextMonth = String(nextWeek.getMonth() + 1).padStart(2, '0')
  const endDate = `${nextYear}-${nextMonth}-01`

  return {
    startDate,
    endDate,
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
const exportToCSV = () => {
  const exportHeaders = headers
    .filter((header) => header.value !== 'image')
    .map((header) => header.text)
  const csvData = allItems.value.map((item) => {
    return [
      item.id,
      item.name,
      item.description,
      item.manufacturer,
      item.origin,
      item.carModel,
      item.carYear,
      item.group,
      item.partNumber,
      item.manualCode,
      item.weight,
      item.quantitySold,
      item.totalCostPrice,
      item.totalSalePrice,
      item.totalProfit,
    ]
  })

  const csvContent =
    'data:text/csv;charset=utf-8,' +
    exportHeaders.join(';') +
    '\n' +
    csvData.map((row) => row.join(';')).join('\n')

  const encodedUri = encodeURI(csvContent)
  const link = document.createElement('a')
  link.setAttribute('href', encodedUri)
  link.setAttribute('download', 'Отчетность.csv')
  document.body.appendChild(link)
  link.click()
}
onMounted(async () => {
  const currentDate = getDateRange()
  reports.value = await getSalesReports(
    currentDate.startDate,
    currentDate.endDate,
  )
  await nextTick(() => {
    const inputs = document.querySelectorAll('.el-date-editor .el-input__inner')
    for (const key of inputs) {
      if (key) {
        key?.setAttribute('data-maska', '##/##/####')
        new MaskInput(key, {
          mask: (value) => '##/##/####',
        })
      }
    }
  })
})
</script>
<style scoped></style>
