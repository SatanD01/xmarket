<template>
  <div
    class="grid transition duration-700 ease"
  >
    <CSideBar
      @click.prevent="layoutStore.isSidebarOpen = true"
    />
    <div class="w-full">
      <CHeader
        @on-toggle="layoutStore.isSidebarOpen = !layoutStore.isSidebarOpen"
      />
      <div class="p-5">
        <RouterView />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">

import CHeader from '@/layouts/components/CHeader.vue'
import CSideBar from '@/layouts/components/CSideBar.vue'
import { useLayoutStore } from '@/layouts/store.ts'
import { useWindowSize } from '@vueuse/core'

const {width} = useWindowSize()
const layoutStore = useLayoutStore()
</script>
