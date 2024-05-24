<template>
  <el-menu
    default-active="2"
    class="el-menu-vertical-demo"
    :collapse="isCollapse"
  >
    <el-radio-group v-model="isCollapse" style="margin-bottom: 20px">
      <el-radio-button :value="false">expand</el-radio-button>
      <el-radio-button :value="true">collapse</el-radio-button>
    </el-radio-group>
    <router-link v-if="!isCollapse" to="/" class="block px-5 py-4">
      <img src="/logo_black.png" alt="logo" />
    </router-link>
    <router-link v-else to="/" class="block px-5 py-4">
      <X class="bg-black text-white rounded" />
    </router-link>
    <el-menu-item index="1">
      <Box />
      <template #title>
        <router-link to="/">
          <span class="ms-2 font-semibold"> ТОП Товары </span>
        </router-link>
      </template>
    </el-menu-item>
    <el-menu-item index="2">
      <AreaChart />
      <template #title>
        <span class="ms-2 font-semibold"> График </span>
      </template>
    </el-menu-item>
    <el-menu-item index="3">
      <ShoppingCart />
      <template #title>
        <span class="ms-2 font-semibold"> Создать заказ </span>
      </template>
    </el-menu-item>
    <el-menu-item index="4">
      <QrCode />
      <template #title>
        <span class="ms-2 font-semibold"> Сканировать QR-Код </span>
      </template>
    </el-menu-item>
    <el-menu-item index="5">
      <PackageOpen />
      <template #title>
        <span class="ms-2 font-semibold"> Создать товар </span>
      </template>
    </el-menu-item>
    <el-menu-item index="6">
      <Home />
      <template #title>
        <span class="ms-2 font-semibold"> Создать офис </span>
      </template>
    </el-menu-item>
    <el-menu-item index="7">
      <UserRoundPlus />
      <template #title>
        <span class="ms-2 font-semibold"> Создать пользователя </span>
      </template>
    </el-menu-item>
    <el-menu-item index="8">
      <Settings />
      <template #title>
        <span class="ms-2 font-semibold"> Админ настройки </span>
      </template>
    </el-menu-item>
  </el-menu>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import {
  QrCode,
  X,
  Box,
  ShoppingCart,
  AreaChart,
  Settings,
  Home,
  PackageOpen,
  UserRoundPlus,
} from 'lucide-vue-next'

const isCollapse = ref(false)
</script>

<style>
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 230px;
  min-height: 100vh;
}

.el-menu {
  min-height: 100vh;
}
</style>
