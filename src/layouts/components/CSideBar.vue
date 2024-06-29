<template>
  <div>
    <el-menu
      default-active="2"
      class="el-menu-vertical-demo !absolute md:!fixed top-0 left-0"
      :collapse="isCollapse"
      router
    >
      <router-link v-if="!isCollapse" to="/" class="block px-5 py-4">
        <img src="/logo_black.png" alt="logo" />
        <span class="text-center block font-bold"
          ><span class="text-orange-600">ENERGY</span> AUTO PARTS</span
        >
      </router-link>
      <router-link v-else to="/" class="block px-5 py-4">
        <X class="bg-black text-white rounded" />
      </router-link>

      <el-menu-item index="2" route="/">
        <Box />
        <template #title>
          <span class="ms-2 font-semibold"> Товары </span>
        </template>
      </el-menu-item>
      <el-menu-item index="1" route="/chart">
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
          <span class="ms-2 font-semibold"> Пополнение склада </span>
        </template>
      </el-menu-item>
      <el-menu-item index="5" route="/suppliers-list">
        <UserRoundCog />
        <template #title>
          <span class="ms-2 font-semibold"> Поставщики </span>
        </template>
      </el-menu-item>
      <el-menu-item index="6" route="/client-list">
        <Users />
        <template #title>
          <span class="ms-2 font-semibold"> Клиенты </span>
        </template>
      </el-menu-item>
      <!--      <el-menu-item index="5" route="/create-office">
        <Home />
        <template #title>
          <span class="ms-2 font-semibold"> Создать офис </span>
        </template>
      </el-menu-item>-->
      <el-menu-item index="7" route="/offices">
        <Blinds />
        <template #title>
          <span class="ms-2 font-semibold"> Список Офисов </span>
        </template>
      </el-menu-item>
      <el-menu-item index="8" route="/create-user">
        <UserRoundPlus />
        <template #title>
          <span class="ms-2 font-semibold"> Создать пользователя </span>
        </template>
      </el-menu-item>
      <el-menu-item index="9" route="/admin-settings">
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
  PackageOpen,
  Settings,
  ShoppingCart,
  UserRoundCog,
  UserRoundPlus,
  Users,
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
