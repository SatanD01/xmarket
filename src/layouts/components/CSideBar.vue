<template>
  <div>
    <el-drawer
      v-model="layoutStore.isSidebarOpen"
      :collapse="layoutStore.isSidebarOpen"
      direction="ltr"
      :size="width < 768 ? '100%' : '15%'"
    >
      <template #title>
        <router-link to="/" class="block px-5 py-4">
          <img src="/logo_black.png" alt="logo" />
          <span class="text-center block font-bold"
          ><span class="text-orange-600">ENERGY</span> AUTO PARTS</span
          >
        </router-link>
      </template>
      <router-link class="flex gap-3 items-center"  to="/">
        <Box />
          <span class="ms-2 font-semibold"> Товары </span>
      </router-link>
      <router-link class="flex gap-3 items-center"  to="/chart">
        <AreaChart />
          <span class="ms-2 font-semibold"> График </span>
      </router-link>
      <router-link class="flex gap-3 items-center"  to="/create-order">
        <ShoppingCart />
          <span class="ms-2 font-semibold"> Создать заказ </span>
      </router-link>
      <router-link class="flex gap-3 items-center"  to="/create-goods">
        <PackageOpen />
          <span class="ms-2 font-semibold"> Пополнение склада </span>
      </router-link>
      <router-link class="flex gap-3 items-center"  to="/suppliers-list">
        <UserRoundCog />
          <span class="ms-2 font-semibold"> Поставщики </span>
      </router-link>
      <router-link class="flex gap-3 items-center"  to="/client-list">
        <Users />
          <span class="ms-2 font-semibold"> Клиенты </span>
      </router-link>
      <!--      <el-menu-item index="5" route="/create-office">
        <Home />

         <span class="ms-2 font-semibold"> Создать офис </span>

      </el-menu-item>-->
      <router-link class="flex gap-3 items-center"  to="/offices">
        <Blinds />
          <span class="ms-2 font-semibold"> Список Офисов </span>
      </router-link>
      <router-link class="flex gap-3 items-center"  to="/create-user">
        <UserRoundPlus />
          <span class="ms-2 font-semibold"> Создать пользователя </span>
      </router-link>
      <router-link class="flex gap-3 items-center"  to="/admin-settings">
        <Settings />
          <span class="ms-2 font-semibold"> Настройки профиля </span>
      </router-link>
    </el-drawer>
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
import { useWindowSize } from '@vueuse/core'
import { useLayoutStore } from '@/layouts/store.ts'

const layoutStore = useLayoutStore()
const {width} = useWindowSize()
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
