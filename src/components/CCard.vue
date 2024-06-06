<template>
  <!--  <el-image
      style="width: 50px; height: 50px; z-index: 1"
      :src="scope.row.img"
      :zoom-rate="1.2"
      :max-scale="7"
      :min-scale="0.2"
      :initial-index="4"
      :preview-src-list="scope.row.img_list"
      fit="cover"
  />-->

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
        <!--        <img :src="header.img" alt="" />-->
      </div>
    </template>
  </Vue3EasyDataTable>
  <pre>{{ data }}</pre>
  <!--  <el-table :data="data" style="width: 100%" max-height="450">-->
  <!--    <el-table-column prop="id" label="ID" />-->
  <!--    <el-table-column prop="img" label="Фото" width="120">-->
  <!--      &lt;!&ndash;      Бу клик буганда тепадиги el-image босилиши кере. Бумасам таблицани оркасида коб кетвотти расим&ndash;&gt;-->
  <!--      <template #default="scope">-->
  <!--        <img-->
  <!--          :src="scope.row.img"-->
  <!--          :alt="scope.row.img"-->
  <!--          class="w-[50] h-[50] object-cover"-->
  <!--        />-->
  <!--      </template>-->
  <!--    </el-table-column>-->
  <!--    <el-table-column prop="name" label="Название товара" width="300px" />-->
  <!--    <el-table-column prop="category" label="Категория" />-->
  <!--    <el-table-column prop="col" label="Количество" />-->
  <!--    <el-table-column label="Цена">-->
  <!--      <template #default="scope">-->
  <!--        <span>{{ scope.row.price }} {{ scope.row.currency }}</span>-->
  <!--      </template>-->
  <!--    </el-table-column>-->
  <!--    <el-table-column label="Действие" width="220">-->
  <!--      <template #default="scope">-->
  <!--        <el-button-->
  <!--          type="primary"-->
  <!--          size="small"-->
  <!--          @click="cardBtn"-->
  <!--          v-if="!card && !inCard"-->
  <!--        >-->
  <!--          Добавить-->
  <!--        </el-button>-->
  <!--        <el-button-->
  <!--          type="danger"-->
  <!--          size="small"-->
  <!--          @click.prevent="onDelete(scope.row.id)"-->
  <!--          v-if="!card && !inCard"-->
  <!--        >-->
  <!--          <Trash2 :stroke-width="1" size="20" /> Удалить-->
  <!--        </el-button>-->
  <!--        <div class="flex gap-1" v-if="inCard || card">-->
  <!--          <el-button-->
  <!--            class="w-[39px] h-[32px]"-->
  <!--            :class="-->
  <!--              goods_count <= 0 ? '!border-[#409eef30]' : '!border-[#409eef]'-->
  <!--            "-->
  <!--            :disabled="goods_count <= 0"-->
  <!--            @click="goods_count -= 1"-->
  <!--            >-</el-button-->
  <!--          >-->
  <!--          <el-input class="!text-center min-w-[40px]" v-model="goods_count" />-->
  <!--          <el-button-->
  <!--            class="w-[39px] h-[32px] !border-[#409eef]"-->
  <!--            @click="goods_count += 1"-->
  <!--            >+</el-button-->
  <!--          >-->
  <!--        </div>-->
  <!--      </template>-->
  <!--    </el-table-column>-->
  <!--  </el-table>-->
  <!--  <div
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
  </div>-->
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
