<template>
<div class="grid grid-cols-12 gap-3">
  <div class="md:col-span-8 col-span-12 gap-3 grid md:grid-cols-3">
    <CCard card v-for="item in 10" :key="item"/>
  </div>
  <div class="md:col-span-4 col-span-12">
    <CBuyDetailCard/>
  </div>
</div>
</template>
<script setup lang="ts">

import CBuyDetailCard from "@/components/CBuyDetailCard.vue";
import CCard from "@/components/CCard.vue";
</script>
<style scoped>

</style>