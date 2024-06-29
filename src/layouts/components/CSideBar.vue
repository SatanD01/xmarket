<template>
  <div>
    <el-menu
      default-active="2"
      class="el-menu-vertical-demo !fixed top-0 left-0"
      :collapse="isCollapse"
      router
    >
      <router-link v-if="!isCollapse" to="/" class="block px-5 py-4">
        <img src="/logo_black.png" alt="logo" />
      </router-link>
      <router-link v-else to="/" class="block px-5 py-4">
        <X class="bg-black text-white rounded" />
      </router-link>
      <el-menu-item index="1" route="/">
        <Box />
        <template #title>
          <span class="ms-2 font-semibold"> ТОП Товары </span>
        </template>
      </el-menu-item>
      <el-menu-item index="2" route="/chart">
        <AreaChart />
        <template #title>
          <span class="ms-2 font-semibold"> График </span>
        </template>
      </el-menu-item>
      <el-menu-item index="3" route="/create-order">
        <ShoppingCart />
        <template #title>
          <span class="ms-2 font-semibold"> Создать заказ </span>
        </template>
      </el-menu-item>
      <el-menu-item index="4" route="/create-goods">
        <PackageOpen />
        <template #title>
          <span class="ms-2 font-semibold"> Создать товар </span>
        </template>
      </el-menu-item>
      <el-menu-item index="5" route="/create-office">
        <Home />
        <template #title>
          <span class="ms-2 font-semibold"> Создать офис </span>
        </template>
      </el-menu-item>
      <el-menu-item index="6" route="/offices">
        <Blinds />
        <template #title>
          <span class="ms-2 font-semibold"> Список Офисов </span>
        </template>
      </el-menu-item>
      <el-menu-item index="7" route="/create-user">
        <UserRoundPlus />
        <template #title>
          <span class="ms-2 font-semibold"> Создать пользователя </span>
        </template>
      </el-menu-item>
      <el-menu-item index="8" route="/admin-settings">
        <Settings />
        <template #title>
          <span class="ms-2 font-semibold"> Настройки профиля </span>
        </template>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script lang="ts" setup>
import {
  AreaChart,
  Blinds,
  Box,
  Home,
  PackageOpen,
  QrCode,
  Settings,
  ShoppingCart,
  UserRoundPlus,
  X,
} from 'lucide-vue-next'

interface Props {
  isCollapse?: boolean
}
defineProps<Props>()
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
