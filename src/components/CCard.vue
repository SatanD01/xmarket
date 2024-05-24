<template>
  <div class="grid grid-cols-1 shadow border rounded hover:shadow-lg transition-all hover:transition-all cursor-pointer">
    <CLazyImage
        default-img="/images/byd-default.webp"
        original-img="https://frankfurt.apollo.olxcdn.com/v1/files/tl85guso90o22-UZ/image;s=1000x750"
        alt="https://frankfurt.apollo.olxcdn.com/v1/files/tl85guso90o22-UZ/image;s=1000x750"
        img-class=""
    />
    <div class="p-2 flex flex-col gap-1">
      <p class="font-bold text-[14px]">Передний бампер BYD SONG PLUS</p>
      <p class="text-[12px] text-gray-500"><b>Категория:</b> Габариды</p>
      <p class="text-[12px] text-gray-500"><b>Количество:</b> 10 шт.</p>
      <el-button class="w-full" type="primary"><b class="me-2">Цена:</b> 200$</el-button>
    </div>
  </div>
</template>
<script setup lang="ts">

import CLazyImage from "@/components/CLazyImage.vue";
</script>
<style scoped>

</style>