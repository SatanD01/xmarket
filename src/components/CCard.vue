<template>
  <div
    class="grid grid-cols-1 card shadow border rounded-lg hover:shadow-lg transition-all hover:transition-all cursor-pointer"
  >
    <CLazyImage
      default-img="./images/byd-default.webp"
      original-img="https://www.topgear.com/sites/default/files/2023/03/12-BYD-Atto-3.jpg"
      alt="https://www.topgear.com/sites/default/files/2023/03/12-BYD-Atto-3.jpg"
      img-class="min-h-[236px] rounded-t-lg"
    />

    <div class="p-2 flex flex-col gap-1 bg-white rounded-b-lg">
      <p class="font-bold text-[14px]">Монитор для салона BYD SONG PLUS</p>
      <p class="text-[12px] text-gray-500"><b>Категория:</b> Салон</p>
      <p class="text-[12px] text-gray-500"><b>Количество:</b> 10 шт.</p>
      <el-button class="w-full" type="primary"
        ><b class="me-2">Цена:</b> 200$</el-button
      >
      <div class="mt-2">
        <el-button
          @click="cardBtn"
          v-if="!card && !inCard"
          class="w-full !ms-0"
          type="primary"
          plain
          >В корзину</el-button
        >
        <div class="flex gap-1" v-if="inCard || card">
          <el-button
            class="w-[39px] h-[32px]"
            :class="
              goods_count <= 0 ? '!border-[#409eef30]' : '!border-[#409eef]'
            "
            :disabled="goods_count <= 0"
            @click="goods_count -= 1"
            >-</el-button
          >
          <el-input class="!text-center min-w-[40px]" v-model="goods_count" />
          <el-button
            class="w-[39px] h-[32px] !border-[#409eef]"
            @click="goods_count += 1"
            >+</el-button
          >
        </div>
        <el-button
          v-if="card"
          class="w-full mt-2"
          type="danger"
          plain
          @click="$emit('on-delete')"
          ><Trash2 :stroke-width="1" size="20" />
          <span class="ms-2">Удалить</span></el-button
        >
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { Trash2 } from 'lucide-vue-next'
import { onMounted, ref, watch } from 'vue'

import CLazyImage from '@/components/CLazyImage.vue'
import { useBasketStore } from '@/store/basket'

interface Props {
  card: boolean
  data: {
    id: number
    count: number
  }
}
const props = defineProps<Props>()
const $emit = defineEmits<{
  (e: 'on-delete'): void
}>()
const store = useBasketStore()

let goods_count = ref(0)
const inCard = ref(false)

const cardBtn = () => {
  inCard.value = true
  goods_count.value += 1
  if (goods_count.value === 0) {
    inCard.value = false
  }
}
watch(
  () => goods_count.value,
  () => {
    const item = store.basketItems.find((el) => el.id === props.data.id)
    if (!item) store.basketItems.push(props.data)
    if (item) item.count = goods_count.value
  },
)
onMounted(() => {
  if (props.data.count) {
    goods_count.value = props.data.count
  }
})
</script>
<style>
.card .el-input__inner {
  text-align: center;
}
</style>
