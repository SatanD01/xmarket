<template>
  <div class="grid grid-cols-[230px_1fr]">
    <CSideBar />
    <div>
      <CHeader />
      <div class="p-5">
        <RouterView />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import CHeader from '@/components/Layout/CHeader.vue'
import CSideBar from '@/components/Layout/CSideBar.vue'
</script>
