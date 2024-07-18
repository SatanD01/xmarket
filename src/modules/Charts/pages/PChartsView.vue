<template>
  <div
    class="grid grid-cols-1 gap-3 bg-white rounded-lg shadow p-3"
    v-if="reports"
  >
    <h3 class="text-[24px] font-bold mb-3">Отчетность</h3>
    <div class="grid gap-3 grid-cols-12">
      <el-select
        v-model="reportsExportType"
        size="large"
        class="col-span-12 md:col-span-2"
      >
        <el-option
          v-for="(item, index) in exportTypes"
          :label="item.label"
          :value="item.value"
          :key="index"
        />
      </el-select>
      <el-date-picker
        v-model="datePicker"
        type="date"
        class="col-span-12 md:col-span-2 !w-full"
        placeholder="Выберите дату"
        format="DD/MM/YYYY"
        :clearable="false"
        :editable="false"
        value-format="YYYY-MM-DD"
        size="large"
      />
      <el-button
        @click="getReports(datePicker)"
        size="large"
        type="primary"
        class="md:col-span-2 col-span-12 w-full"
        >Поиск</el-button
      >
    </div>
    <div class="flex flex-wrap gap-3">
      <el-input
        placeholder="Поиск"
        class="mb-3 !w-[80%] md:!w-[300px]"
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
      title="Сканер бар кода"
      :align-center="width < 768"
      :width="width > 768 ? 500 : 300"
    >
      <div>
        <StreamBarcodeReader @decode="onDecode" @load="onLoaded" />
      </div>
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
import { ClipboardMinus, QrCode } from 'lucide-vue-next'
import { MaskInput } from 'maska'
import { computed, nextTick, onMounted, ref } from 'vue'
import { StreamBarcodeReader } from 'vue-barcode-reader'
import Vue3EasyDataTable, { type Header, Item } from 'vue3-easy-data-table'
import { toast } from 'vue3-toastify'

import {
  getDailyReport,
  getMonthlyReport,
  getWeeklyReport,
} from '@/modules/Charts/controller'

const reports = ref(null)
const searchValue = ref('')
const datePicker = ref('')
const reportsExportType = ref('daily')
const exportTypes = ref([
  {
    label: 'Дневной',
    value: 'daily',
  },
  {
    label: 'Недельный',
    value: 'weekly',
  },
  {
    label: 'Месячный',
    value: 'monthly',
  },
])
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

const getReports = async (time) => {
  if (datePicker.value) {
    if (reportsExportType.value === 'daily') {
      reports.value = await getDailyReport(time)
    }
    if (reportsExportType.value === 'weekly') {
      reports.value = await getWeeklyReport(time)
    }
    if (reportsExportType.value === 'monthly') {
      reports.value = await getMonthlyReport(time)
    }
  } else {
    toast.error('Выберите дату')
  }
}
const getStartOfMonth = () => {
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0') // Месяцы начинаются с 0

  return `${year}-${month}-01`
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
  const currentDate = getStartOfMonth()
  reports.value = await getMonthlyReport(currentDate)
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
