<template>
  <CSearch/>
  <div>
    <h1 class="mb-4 font-bold text-[32px]">Топ товары</h1>
    <div class="grid md:grid-cols-5 grid-cols-2 gap-3">
        <CCard v-for="item in 10" :key="item"/>
    </div>
  </div>
</template>

<script lang="ts" setup>
import CCard from "@/components/CCard.vue";
import CSearch from "@/components/CSearch.vue";


</script>
