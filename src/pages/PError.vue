<template>
  <div class="bg-white/50 h-screen flex justify-center items-center">
    <div class="container flex justify-center items-center flex-col gap-3">
      <h2 class="text-3xl font-bold text-center">
        Страница не найдена <br />
        Или ошибка на сервере
      </h2>
      <el-button @click="$router.push('/')" size="large">
        На главную
      </el-button>
    </div>
  </div>
</template>
<script setup lang="ts"></script>
