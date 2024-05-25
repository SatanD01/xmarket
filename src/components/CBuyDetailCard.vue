<template>
  <div class="bg-white shadow p-3 rounded-lg">
    <el-descriptions
        title="Купленные товары"
        :column="1"
        direction="horizontal"
    >
      <el-descriptions-item label="Монитор"><span>x10</span> <b class="text-right me-auto float-end text-[16px]">1500$</b></el-descriptions-item>
      <el-descriptions-item label="Бампер"><span>х3</span> <b class="text-right me-auto float-end text-[16px]">1500$</b></el-descriptions-item>
      <el-descriptions-item>
        <template #label>
          <b class="text-[18px]">Общая сумма:</b>
        </template>
        <span class="text-[18px]">
          3000$
        </span>
      </el-descriptions-item>
    </el-descriptions>
    <el-button type="primary" class="w-full">Продать</el-button>
  </div>
</template>
<script setup lang="ts">

</script>
<style scoped>

</style>