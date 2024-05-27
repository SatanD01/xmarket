<template>
  <div class="bg-white rounded-lg p-3 shadow">
    <h2 class="text-[24px] font-bold mb-3">Настройки</h2>
    <div class="grid md:grid-cols-4 grid-cols-1 gap-3">
      <el-input placeholder="Ф.И.О"/>
      <el-input placeholder="Серия и номер паспорта"/>
      <el-input placeholder="Телефон номер"/>
      <el-date-picker
          v-model="birthday"
          type="date"
          placeholder="Дата рождения"
          class="!w-full"
      />
      <el-input placeholder="Email"/>
      <el-input placeholder="Офис работы"/>
      <el-button type="primary">Изменить</el-button>

    </div>
  </div>
</template>
<script setup lang="ts">
import {ref} from "vue";

const birthday = ref('')
</script>
<style scoped>

</style>