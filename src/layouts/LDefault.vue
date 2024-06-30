<template>
  <div class="relative">
    <CSideBar
      class="!fixed !top-0 !left-0 z-[44]"
    />
    <div
      :class="{
        'pl-[250px]': layoutStore.isSidebarOpen,
        '!pl-[0]': width < 768,
      }"
      class="w-full relative"
    >
      <CHeader
        class="z-30"
        @on-toggle="layoutStore.isSidebarOpen = !layoutStore.isSidebarOpen"
      />
      <div class="p-5">
        <RouterView />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useWindowSize } from '@vueuse/core'

import CHeader from '@/layouts/components/CHeader.vue'
import CSideBar from '@/layouts/components/CSideBar.vue'
import { useLayoutStore } from '@/layouts/store.ts'

const { width } = useWindowSize()
const layoutStore = useLayoutStore()
</script>
