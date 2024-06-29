<template>
  <div
    class="grid transition duration-700 ease"
    :class="isSidebarOpen ? 'grid-cols-[63px_1fr]' : 'grid-cols-[230px_1fr]'"
  >
    <CSideBar :is-collapse="isSidebarOpen" />
    <div>
      <CHeader
        :is-sidebar-open="isSidebarOpen"
        @on-toggle="isSidebarOpen = !isSidebarOpen"
      />
      <div class="p-5">
        <RouterView />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useWindowSize } from '@vueuse/core'
import { onMounted, ref } from 'vue'

import CHeader from '@/layouts/components/CHeader.vue'
import CSideBar from '@/layouts/components/CSideBar.vue'

const { width } = useWindowSize()
const isSidebarOpen = ref(false)

onMounted(() => {
  isSidebarOpen.value = width.value <= 768
})
</script>
