<template>
  <div class="bg-white p-3 shadow rounded-lg">
    <h3 class="text-[24px] font-bold mb-3">Создать пользователя</h3>
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
      <el-select v-model="role" placeholder="Роль">
        <el-option
            v-for="item in roles"
            :key="item.value"
            :label="item.label"
            :value="item.value"
        />
      </el-select>
      <el-button type="primary">Добавить</el-button>
    </div>
  </div>
</template>
<script setup lang="ts">
import {ref} from "vue";

const birthday = ref('')
const role = ref('')

const roles = [
  {
    value: 'manager',
    label: 'Менеджер',
  },
  {
    value: 'admin',
    label: 'Админ',
  },
]
</script>
<style scoped>

</style>