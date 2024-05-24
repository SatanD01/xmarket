<template>
  <div class="grid grid-cols-1 card shadow border rounded-lg hover:shadow-lg transition-all hover:transition-all cursor-pointer">
    <CLazyImage
        default-img="/images/byd-default.webp"
        original-img="https://www.topgear.com/sites/default/files/2023/03/12-BYD-Atto-3.jpg"
        alt="https://www.topgear.com/sites/default/files/2023/03/12-BYD-Atto-3.jpg"
        img-class="min-h-[236px] rounded-t-lg"
    />
    <div class="p-2 flex flex-col gap-1 bg-white rounded-b-lg">
      <p class="font-bold text-[14px]">Монитор для салона BYD SONG PLUS</p>
      <p class="text-[12px] text-gray-500"><b>Категория:</b> Салон</p>
      <p class="text-[12px] text-gray-500"><b>Количество:</b> 10 шт.</p>
      <div class="grid grid-cols-2 gap-3">
        <el-button v-if="!card" class="w-full" type="primary"><b class="me-2">Цена:</b> 200$</el-button>
        <el-button @click="cardBtn" v-if="!card && !inCard" class="w-full !ms-0" type="primary" plain>В корзину</el-button>
        <div class="flex gap-1" v-if="inCard || card">
          <el-button class="w-[39px] h-[32px]" :class="goods_count <= 0 ? '!border-[#409eef30]' : '!border-[#409eef]'" :disabled="goods_count <= 0" @click="goods_count -= 1">-</el-button>
          <el-input class="!text-center" v-model="goods_count"/>
          <el-button class="w-[39px] h-[32px] !border-[#409eef]" @click="goods_count += 1">+</el-button>
        </div>
        <el-button v-if="card" class="w-full" type="danger" plain><Trash2 /> <span class="ms-2">Удалить</span></el-button>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import {Trash2} from 'lucide-vue-next'
import CLazyImage from "@/components/CLazyImage.vue";
import {ref} from "vue";

interface Props {
  card: boolean
}
defineProps<Props>()

let goods_count = ref(0)
const inCard = ref(false)

const cardBtn = () => {
  inCard.value = true
  goods_count.value += 1
  if (goods_count.value === 0) {
    inCard.value = false
  }
}
</script>
<style>
.card .el-input__inner{
    text-align: center;
}

</style>