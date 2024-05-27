<template>
  <div class="grid md:grid-cols-3 grid-cols-1 gap-3">
    <div>
      <h3 class="text-[24px] font-bold mb-3">Дневная прибль</h3>
      <el-table :data="tableData" class="rounded-lg shadow mb-3" height="300">
        <el-table-column prop="id" label="ID" />
        <el-table-column prop="date" label="Дата" />
        <el-table-column prop="income" label="Приход" />
        <el-table-column prop="outcome" label="Расход" />
        <el-table-column prop="profit" label="Прибль" />
      </el-table>
      <el-pagination class="mb-3 p-2 bg-white rounded-lg shadow flex items-center justify-center" background layout="prev, pager, next" :page-count="table_col" :total="table_col" />
      <el-button type="primary" class="w-full !ms-0"><ClipboardMinus /> <span class="ms-2 text-wrap !leading-4">Экспортровать дневную прибль</span></el-button>
    </div>
    <div>
      <h3 class="text-[24px] font-bold mb-3">Недельная прибль</h3>
      <el-table :data="tableData" class="rounded-lg shadow mb-3" height="300">
        <el-table-column prop="id" label="ID" />
        <el-table-column prop="date" label="Дата" />
        <el-table-column prop="income" label="Приход" />
        <el-table-column prop="outcome" label="Расход" />
        <el-table-column prop="profit" label="Прибль" />
      </el-table>
      <el-pagination class="mb-3 p-2 bg-white rounded-lg shadow flex items-center justify-center" background layout="prev, pager, next" :page-count="table_col" :total="table_col" />
      <el-button type="primary" class="w-full !ms-0"><ClipboardMinus /> <span class="ms-2 text-wrap !leading-4">Экспортровать недельную прибль</span></el-button>
    </div>
    <div>
      <h3 class="text-[24px] font-bold mb-3">Месячная прибль</h3>
      <el-table :data="tableData" class="rounded-lg shadow mb-3" height="300">
        <el-table-column prop="id" label="ID" />
        <el-table-column prop="date" label="Дата" />
        <el-table-column prop="income" label="Приход" />
        <el-table-column prop="outcome" label="Расход" />
        <el-table-column prop="profit" label="Прибль" />
      </el-table>
      <el-pagination class="mb-3 p-2 bg-white rounded-lg shadow flex items-center justify-center" background layout="prev, pager, next" :page-count="table_col" :total="table_col" />
      <el-button type="primary" class="w-full !ms-0"><ClipboardMinus /> <span class="ms-2 text-wrap !leading-4">Экспортровать месячную прибль</span></el-button>
    </div>
    <div>
      <h3 class="text-[24px] font-bold mb-3">Общаяя прибль</h3>
      <el-table :data="tableData" class="rounded-lg shadow mb-3" height="300">
        <el-table-column prop="id" label="ID" />
        <el-table-column prop="date" label="Дата" />
        <el-table-column prop="income" label="Приход" />
        <el-table-column prop="outcome" label="Расход" />
        <el-table-column prop="profit" label="Прибль" />
      </el-table>
      <el-pagination class="mb-3 p-2 bg-white rounded-lg shadow flex items-center justify-center" background layout="prev, pager, next" :page-count="table_col" :total="table_col" />
      <el-button type="primary" class="w-full !ms-0"><ClipboardMinus /> <span class="ms-2 text-wrap !leading-4">Экспортровать общую прибль</span></el-button>
    </div>
  </div>
</template>
<script setup lang="ts">
import {ClipboardMinus} from 'lucide-vue-next'
import {useWindowSize} from "@vueuse/core";
import {onMounted, ref} from "vue";

const { width } = useWindowSize()
const table_col = ref(0);

onMounted(() => {
  table_col.value = width.value <= 768 ? 5 : 10
})

const tableData = [
  {
    id: '1',
    date: '2016-05-03',
    income: '200$',
    outcome: '100$',
    profit: '100$',
  },
  {
    id: '2',
    date: '2016-05-03',
    income: '200$',
    outcome: '100$',
    profit: '100$',
  },
  {
    id: '2',
    date: '2016-05-03',
    income: '200$',
    outcome: '100$',
    profit: '100$',
  },{
    id: '2',
    date: '2016-05-03',
    income: '200$',
    outcome: '100$',
    profit: '100$',
  },{
    id: '2',
    date: '2016-05-03',
    income: '200$',
    outcome: '100$',
    profit: '100$',
  },{
    id: '2',
    date: '2016-05-03',
    income: '200$',
    outcome: '100$',
    profit: '100$',
  },{
    id: '2',
    date: '2016-05-03',
    income: '200$',
    outcome: '100$',
    profit: '100$',
  },{
    id: '2',
    date: '2016-05-03',
    income: '200$',
    outcome: '100$',
    profit: '100$',
  },
  {
    id: '3',
    date: '2016-05-03',
    income: '200$',
    outcome: '100$',
    profit: '100$',
  },
  {
    id: '4',
    date: '2016-05-03',
    income: '200$',
    outcome: '100$',
    profit: '100$',
  }
]
</script>
<style scoped>

</style>