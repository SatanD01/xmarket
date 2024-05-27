<template>
  <header
    class="bg-white w-full flex justify-between items-center border-b p-1 sticky top-0 z-[100]"
  >
    <div class="burger-container" @click="$emit('on-toggle')">
      <div :class="['burger', { 'burger-active': isSidebarOpen }]">
        <div class="line line1"></div>
        <div class="line line2"></div>
        <div class="line line3"></div>
      </div>
    </div>
    <div class="flex items-center gap-5 cursor-pointer">
      <router-link to="/cart">
        <el-badge :value="12" type="primary">
          <div
            class="border group w-[40px] h-[40px] rounded flex items-center justify-center hover:transition-all transition-all hover:border-[#409eef] hover:text-[409eef]"
          >
            <ShoppingCart
              class="group-hover:text-[#409eef] group-hover:transition-all transition-all"
            />
          </div>
        </el-badge>
      </router-link>

      <el-dropdown>
        <el-avatar
          shape="square"
          class="mb-0"
          src="https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png"
        />
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>
              <Settings />
              <span class="ms-2">Настройки профиля</span></el-dropdown-item
            >
            <el-dropdown-item @click="$router.push('/login')">
              <LogOut /> <span class="ms-2">Выйти</span></el-dropdown-item
            >
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </header>
</template>
<script setup lang="ts">
import { LogOut, Settings, ShoppingCart } from 'lucide-vue-next'

interface Props {
  isSidebarOpen: boolean
}
defineProps<Props>()
const $emit = defineEmits<{
  (e: 'on-toggle'): void
}>()
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
