<template>
  <div>
    <Transition>
      <div
        v-if="
          width > 768 ? layoutStore.isSidebarOpen : !layoutStore.isSidebarOpen
        "
        class="sidebar"
      >
        <div class="flex gap-3">
          <div
            v-if="width < 768"
            @click="layoutStore.isSidebarOpen = !layoutStore.isSidebarOpen"
            class="close cursor-pointer"
          >
            <ArrowLeft />
          </div>
          <router-link
            to="/index"
            class="block p-4"
            :class="width < 768 ? 'w-[80%]' : 'w-full'"
          >
            <div class="flex items-center justify-center flex-col md:mt-2">
              <span class="text-center block font-bold"
                ><span class="text-orange-600">ENERGY</span> AUTO PARTS</span
              >
            </div>
          </router-link>
        </div>
        <hr />
        <div class="menu-wrap flex flex-col justify-between">
          <ul class="menu grow">
            <li
              v-if="
                [Roles.ADMIN, Roles.MANAGER, Roles.SALESMAN].includes(
                  authStore.user?.role,
                )
              "
            >
              <router-link
                exact-active-class="active-route"
                class="hover:bg-[#409eff30] rounded-lg p-3 ease-in mb-4 flex gap-3 items-center"
                to="/index"
              >
                <Box />
                <span class="ms-2 font-semibold"> Список товаров </span>
              </router-link>
            </li>
            <li
              v-if="
                [Roles.ADMIN, Roles.MANAGER, Roles.SALESMAN].includes(
                  authStore.user?.role,
                )
              "
            >
              <router-link
                exact-active-class="active-route"
                class="hover:bg-[#409eff30] rounded-lg p-3 ease-in my-4 flex gap-3 items-center"
                to="/check-product"
              >
                <ListChecks />
                <span class="ms-2 font-semibold"> Доступные товары </span>
              </router-link>
            </li>
            <li
              v-if="[Roles.ADMIN, Roles.MANAGER].includes(authStore.user?.role)"
            >
              <router-link
                exact-active-class="active-route"
                class="hover:bg-[#409eff30] rounded-lg p-3 ease-in my-2 flex gap-3 items-center"
                to="/replenishment"
              >
                <PackageOpen />
                <span class="ms-2 font-semibold"> Пополнение склада </span>
              </router-link>
            </li>
            <li
              v-if="[Roles.ADMIN, Roles.MANAGER].includes(authStore.user?.role)"
            >
              <router-link
                exact-active-class="active-route"
                class="hover:bg-[#409eff30] rounded-lg p-3 ease-in my-4 flex gap-3 items-center"
                to="/transfer-goods"
              >
                <GitCompareArrows />
                <span class="ms-2 font-semibold"> Перенос товара </span>
              </router-link>
            </li>
            <li
              v-if="
                [Roles.ADMIN, Roles.MANAGER, Roles.SALESMAN].includes(
                  authStore.user?.role,
                )
              "
            >
              <router-link
                exact-active-class="active-route"
                class="hover:bg-[#409eff30] rounded-lg p-3 ease-in my-4 flex gap-3 items-center"
                to="/create-order"
              >
                <ShoppingCart />
                <span class="ms-2 font-semibold"> Создать заказ </span>
              </router-link>
            </li>
            <li
              v-if="
                [Roles.ADMIN, Roles.MANAGER, Roles.SALESMAN].includes(
                  authStore.user?.role,
                )
              "
            >
              <router-link
                exact-active-class="active-route"
                class="hover:bg-[#409eff30] rounded-lg p-3 ease-in my-4 flex gap-3 items-center"
                to="/return-transaction"
              >
                <ArchiveRestore />
                <span class="ms-2 font-semibold"> Возврат товара </span>
              </router-link>
            </li>
            <li
              v-if="[Roles.ADMIN, Roles.MANAGER].includes(authStore.user?.role)"
            >
              <router-link
                exact-active-class="active-route"
                class="hover:bg-[#409eff30] rounded-lg p-3 ease-in my-4 flex gap-3 items-center"
                to="/suppliers-list"
              >
                <UserRoundCog />
                <span class="ms-2 font-semibold"> Поставщики </span>
              </router-link>
            </li>
            <li
              v-if="
                [Roles.ADMIN, Roles.MANAGER, Roles.SALESMAN].includes(
                  authStore.user?.role,
                )
              "
            >
              <router-link
                exact-active-class="active-route"
                class="hover:bg-[#409eff30] rounded-lg p-3 ease-in my-4 flex gap-3 items-center"
                to="/customers-list"
              >
                <Users />
                <span class="ms-2 font-semibold"> Клиенты </span>
              </router-link>
            </li>
            <!--      <el-menu-item index="5" route="/create-office">
          <Home />

           <span class="ms-2 font-semibold"> Создать офис </span>

        </el-menu-item>-->
            <li
              v-if="
                [Roles.ADMIN, Roles.MANAGER, Roles.SALESMAN].includes(
                  authStore.user?.role,
                )
              "
            >
              <router-link
                exact-active-class="active-route"
                class="hover:bg-[#409eff30] rounded-lg p-3 ease-in my-4 flex gap-3 items-center"
                to="/offices"
              >
                <Blinds />
                <span class="ms-2 font-semibold">
                  Список магазинов и складов
                </span>
              </router-link>
            </li>
            <li v-if="[Roles.ADMIN].includes(authStore.user?.role)">
              <router-link
                exact-active-class="active-route"
                class="hover:bg-[#409eff30] rounded-lg p-3 ease-in my-4 flex gap-3 items-center"
                to="/users"
              >
                <UserRoundPlus />
                <span class="ms-2 font-semibold"> Пользователи </span>
              </router-link>
            </li>
            <li v-if="[Roles.ADMIN].includes(authStore.user?.role)">
              <router-link
                exact-active-class="active-route"
                class="hover:bg-[#409eff30] rounded-lg p-3 ease-in my-4 flex gap-3 items-center"
                to="/chart"
              >
                <AreaChart />
                <span class="ms-2 font-semibold"> Отчетность </span>
              </router-link>
            </li>
          </ul>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script lang="ts" setup>
import { useWindowSize } from '@vueuse/core'
import {
  ArchiveRestore,
  AreaChart,
  ArrowLeft,
  Blinds,
  Box,
  GitCompareArrows,
  ListChecks,
  PackageOpen,
  ShoppingCart,
  UserRoundCog,
  UserRoundPlus,
  Users,
} from 'lucide-vue-next'

import { useLayoutStore } from '@/layouts/store.ts'
import { useAuthStore } from '@/modules/Auth/store.ts'
import { Roles } from '@/types'

const layoutStore = useLayoutStore()
const authStore = useAuthStore()
const { width } = useWindowSize()
</script>

<style>
.v-enter-active,
.v-leave-active {
  transition: transform 0.25s ease;
}
.v-enter-from,
.v-leave-to {
  transform: translateX(-100%);
}

.sidebar {
  background: #fff;
  z-index: 5;
  box-shadow: 20px 20px 40px rgba(0, 0, 0, 0.05);
  min-height: 100vh;
  width: 250px;
  position: relative;
  .close {
    position: absolute;
    top: 20px;
    right: 12px;
  }
  .menu-wrap {
    padding: 20px 10px 20px;
    height: calc(100vh - 15vh);
    .menu {
      .active-route {
        span,
        i,
        svg {
          color: #0074ff;
        }
      }
      .menu-item:not(.submenu-item):hover {
        color: #3392ff;
        svg {
          path {
            fill: #3392ff;
          }
        }
      }
    }
    .menu:first-child {
      height: calc(100vh - 320px);
      overflow: auto;
    }
    .menu::-webkit-scrollbar {
      width: 5px;
      height: 2px;
      border-radius: 5px;
    }
    .menu::-webkit-scrollbar-track {
      border-radius: 10px;
    }
    .menu::-webkit-scrollbar-thumb {
      background-color: rgba(169, 169, 169, 0.822);
      border-radius: 10px;
    }
  }
}
</style>
