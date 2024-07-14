<template>
  <div
    class="grid grid-cols-1 gap-3 bg-white rounded-lg shadow p-3"
    v-if="reports"
  >
    <h3 class="text-[24px] font-bold mb-3">Отчетность</h3>
    <div class="flex flex-wrap gap-3">
      <el-input
        placeholder="Поиск"
        class="mb-3 w-full md:!w-[300px]"
        size="large"
        v-model="searchValue"
      />
      <el-button size="large" @click="dailyReport" class="!ms-0" type="primary"
        >Дневной отчет</el-button
      >
      <el-button size="large" @click="weeklyReport" class="!ms-0" type="primary"
        >Недельный отчет</el-button
      >
      <el-button
        size="large"
        @click="monthlyReport"
        class="!ms-0"
        type="primary"
        >Месячный отчет</el-button
      >
    </div>
    <Vue3EasyDataTable
      buttons-pagination
      :headers="headers"
      class="overflow-y-auto"
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
    </Vue3EasyDataTable>
    <el-button type="primary" class="w-full !ms-0"
      ><ClipboardMinus />
      <span class="ms-2 text-wrap !leading-4"
        >Экспортровать дневную прибль</span
      ></el-button
    >
  </div>
</template>
<script setup lang="ts">
import { ClipboardMinus } from 'lucide-vue-next'
import { computed, onMounted, ref } from 'vue'
import Vue3EasyDataTable, { type Header, Item } from 'vue3-easy-data-table'

import {
  getDailyReport,
  getMonthlyReport,
  getWeeklyReport,
} from '@/modules/Charts/controller'

const reports = ref(null)
const searchValue = ref('')
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
  { text: 'Прибль', value: 'totalProfit', sortable: true },
]
const items: Item[] = computed(() => {
  return reports.value.items.map((item) => {
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

const totalProfitPrice = computed(() =>
  items.value?.reduce((total, el) => total + el?.totalProfit, 0),
)

const dailyReport = async () => {
  reports.value = await getDailyReport()
}

const weeklyReport = async () => {
  reports.value = await getWeeklyReport()
}
const monthlyReport = async () => {
  reports.value = await getMonthlyReport()
}

onMounted(async () => {
  reports.value = await getDailyReport()
  console.log(reports.value.items)
})
</script>
<style scoped></style>
