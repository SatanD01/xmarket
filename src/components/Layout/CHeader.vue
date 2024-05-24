<template>
  <header class="bg-white w-full flex justify-between items-center border-b p-1 sticky top-0 z-[100]">
    <div class="burger-container" @click="toggleBurger">
      <div :class="['burger', { 'burger-active': isActive }]">
        <div class="line line1"></div>
        <div class="line line2"></div>
        <div class="line line3"></div>
      </div>
    </div>
    <el-dropdown>
      <el-avatar shape="square" class="mb-0" src="https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png" />
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item> <Settings /> <span class="ms-2">Настройки профиля</span></el-dropdown-item>
          <el-dropdown-item> <LogOut /> <span class="ms-2">Выйти</span></el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </header>
</template>
<script setup lang="ts">
import { Settings, LogOut } from 'lucide-vue-next';
import { ref } from 'vue';

const isActive = ref(false);

const toggleBurger = () => {
  isActive.value = !isActive.value;
};
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
  transition: transform 0.3s ease, opacity 0.3s ease;
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
