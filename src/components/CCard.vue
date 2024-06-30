<template>
  <Vue3EasyDataTable :headers="headers" :items="items">
    <template #item-img="item">
      <div class="w-[100px] py-3">
        <el-image
          style="width: 100px; height: 100px"
          :src="item.img"
          :zoom-rate="1.0"
          :max-scale="6"
          :min-scale="0.2"
          :preview-src-list="item.img_list"
          :initial-index="4"
          fit="cover"
        />
      </div>
    </template>
  </Vue3EasyDataTable>
  <pre>{{ data }}</pre>
</template>
<script setup lang="ts">
import 'vue3-easy-data-table/dist/style.css'

import { computed, onMounted, ref, watch } from 'vue'
import type { Header, Item } from 'vue3-easy-data-table'
import Vue3EasyDataTable from 'vue3-easy-data-table'

import { useBasketStore } from '@/store/basket'

interface Props {
  card: boolean
  data: {
    id: number
    count: number
    name: string
    category: string
    price: string | number
    img: string
    img_list: string[]
  }
}

const props = defineProps<Props>()
const headers: Header[] = [
  { text: 'Id', value: 'id' },
  { text: 'Фото', value: 'img' },
  { text: 'Название товара', value: 'name', sortable: true },
  { text: 'Категория', value: 'category', sortable: true },
  { text: 'Количество', value: 'count', sortable: true },
  { text: 'Цена', value: 'price', sortable: true },
]
const items = computed(
  ():
    | {
        id: number | undefined
        img: string | undefined
        name: string | undefined
        price: number | string
        count: number | string
        category: string | null | undefined
      }[]
    | undefined => {
    return props.data?.map((item) => {
      return {
        id: item.id,
        img: item?.img,
        img_list: item?.img_list,
        name: item?.name,
        category: item.category,
        count: item?.count,
        price: item?.price,
      }
    })
  },
)
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

const onDelete = (index: number) => {
  console.log('index:', index)
  store.basketItems.splice(
    store.basketItems.findIndex((el) => el.id === index),
    1,
  )
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

.image-slot {
  font-size: 30px;
}
.image-slot .el-icon {
  font-size: 30px;
}
.el-image {
  width: 100%;
  height: 200px;
}
</style>
