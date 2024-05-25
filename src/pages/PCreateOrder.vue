<template>
  <h3 class="text-[24px] font-bold mb-3">Создать заказ</h3>
  <CSearch/>
  <div class="grid grid-cols-2 md:grid-cols-5 gap-3">
    <CCard :card="false" v-for="item in 10" :key="item"/>
  </div>
</template>
<script setup lang="ts">

import CSearch from "@/components/CSearch.vue";
import CCard from "@/components/CCard.vue";
</script>
<style scoped>

</style>