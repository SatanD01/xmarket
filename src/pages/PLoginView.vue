<template>
  <div class="container">
    <div class="flex items-center justify-center w-full h-screen">
    <div class="w-1/2 m-auto grid grid-cols-2 bg-white rounded-2xl p-3 shadow-md">
      <div class="h-full flex flex-col gap-3 items-center justify-center border-r border-dashed">
        <img class="w-[200px]" src="/logo_white.png" alt="logo">
        <div>
          <p class="text-center font-bold text-gray-500 border-b-2">BYD</p>
          <p class="roboto-light text-gray-500">Build your dream</p>
        </div>
      </div>
      <div class="grid grid-cols-1 gap-3 pl-3">
        <h4 class="h4 font-bold roboto-bold text-center">Войти в систему</h4>
        <el-form
            label-position="top"
            label-width="auto"
        >
          <el-form-item label="Логин" required>
            <el-input v-model="login" />
          </el-form-item>
          <el-form-item label="Пароль" required>
            <el-input v-model="password" />
          </el-form-item>
          <el-button type="primary">Войти</el-button>
        </el-form>
      </div>
    </div>
  </div>
  </div>
</template>
<script setup lang="ts">
import {ref} from 'vue'

const login = ref('')
const password = ref('')


</script>
<style scoped>

</style>