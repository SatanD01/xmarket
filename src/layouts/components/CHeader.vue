<template>
  <header
    class="bg-white px-4 w-full flex justify-between items-center border-b p-1 sticky top-0 z-[3]"
  >
    <div class="burger-container" @click="$emit('on-toggle')">
      <div
        :class="[
          'burger',
          {
            'burger-active':
              width > 768
                ? layoutStore.isSidebarOpen
                : !layoutStore.isSidebarOpen,
          },
        ]"
      >
        <div class="line line1"></div>
        <div class="line line2"></div>
        <div class="line line3"></div>
      </div>
    </div>
    <div class="flex items-center me-1 gap-5 cursor-pointer">
      <el-dropdown>
        <el-avatar
          shape="square"
          class="mb-0"
          src="https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png"
        />
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>
              <div>
                <p>Имя: {{ auth.user.name }}</p>
                <p>Телефон: {{ auth.user.phone }}</p>
                <p>
                  Роль:
                  {{
                    auth.user.role === 'Admin'
                      ? 'Админ'
                      : auth.user.role === 'Manager'
                        ? 'Менеджер'
                        : 'Продавец'
                  }}
                </p>
              </div>
            </el-dropdown-item>
            <el-dropdown-item @click="logout">
              <LogOut /> <span class="ms-2">Выйти</span></el-dropdown-item
            >
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </header>
</template>
<script setup lang="ts">
import { useWindowSize } from '@vueuse/core'
import { LogOut, Settings, ShoppingCart } from 'lucide-vue-next'

import { useLayoutStore } from '@/layouts/store.ts'
import { useAuthStore } from '@/modules/Auth/store.ts'
import { useBasketStore } from '@/store/basket.ts'

const { width } = useWindowSize()
const layoutStore = useLayoutStore()
const $emit = defineEmits<{
  (e: 'on-toggle'): void
}>()
const store = useBasketStore()
const auth = useAuthStore()
const logout = () => {
  auth.logout()
  window.location.replace('/login')
}
</script>
<style scoped>
.burger-container {
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  width: 50px;
  height: 50px;
}

.burger {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 30px;
  height: 20px;
  transition: transform 0.3s ease;
}

.line {
  background-color: black;
  height: 3px;
  border-radius: 2px;
  transition:
    transform 0.3s ease,
    opacity 0.3s ease;
}

.burger-active .line1 {
  transform: rotate(-45deg) translate(-4px, 2px);
  width: 14px;
}

.burger-active .line3 {
  transform: rotate(49deg) translate(-4px, -1.3px);
  width: 14px;
}
</style>
