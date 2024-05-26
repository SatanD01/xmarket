<template>
  <div class="p-3 bg-white shadow rounded-lg">
    <h3 class="text-[24px] font-bold mb-3">Офисы</h3>
    <div class="grid md:grid-cols-5 grid-cols-2 gap-3">
      <COfficeCard card/>
    </div>
  </div>
</template>
<script setup lang="ts">

import COfficeCard from "@/components/COfficeCard.vue";
</script>
<style scoped>

</style>