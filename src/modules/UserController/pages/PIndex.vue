<template>
  <div>
    <div class="bg-white rounded-lg p-4 w-full flex justify-between">
      <h1 class="text-2xl font-semibold capitalize">пользователя</h1>
      <RouterLink :to="{ name: 'CreateUser' }">
        <el-button type="primary"> Создать пользователя </el-button>
      </RouterLink>
    </div>
    <div class="bg-white rounded-lg p-4 w-full mt-6">
      <el-table :data="tableData" stripe style="width: 100%">
        <el-table-column prop="date" label="Date" width="180" />
        <el-table-column prop="name" label="Name" width="180" />
        <el-table-column prop="address" label="Address" />
      </el-table>
    </div>
  </div>
</template>
<script setup lang="ts">
const tableData = [
  {
    date: '2016-05-03',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-02',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-04',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-01',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
]
</script>
