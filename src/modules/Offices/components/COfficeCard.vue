<template>
  <div
    class="grid grid-cols-1 card shadow border rounded-lg hover:shadow-lg transition-all hover:transition-all cursor-pointer"
  >
    <div class="w-full h-full">
      <iframe
        src="https://yandex.com/map-widget/v1/?ll=69.283814%2C41.301488&mode=whatshere&whatshere%5Bpoint%5D=69.283814%2C41.301488&whatshere%5Bzoom%5D=17&z=17"
        width="100%"
        height="200"
        frameborder="1"
        allowfullscreen="false"
      ></iframe>
    </div>
    <div class="p-2 flex flex-col gap-1 bg-white rounded-b-lg">
      <p class="font-bold text-[14px]">Ташкент, Амир Темур 24 (Главный офис)</p>
      <p class="text-[12px] text-gray-500"><b>Управляющий:</b> Ахматов Ахмат</p>
      <p class="text-[12px] text-gray-500">
        <b>Тел:</b>
        <el-link class="!text-[12px] text-gray-500" href="tel:998999999999"
          >+998(99)-999-99-99</el-link
        >
      </p>
      <p class="text-[12px] text-gray-500"><b>Индекс:</b> 100197</p>
      <div class="grid grid-cols-2 gap-3 mt-2">
        <el-button
          class="w-full"
          type="success"
          plain
          @click="dialogVisible = true"
          ><Pencil :offset-size="1" />
          <span class="ms-2">Изменить</span></el-button
        >
        <el-button class="w-full !ms-0" type="danger" plain
          ><Trash2 :offset-size="1" />
          <span class="ms-2">Удалить</span></el-button
        >
      </div>
    </div>
    <el-dialog
      v-model="dialogVisible"
      title="Изменить офис"
      width="800"
      :fullscreen="fullscreen"
    >
      <div class="grid md:grid-cols-3 grid-cols-1 gap-3">
        <el-input placeholder="Название офиса" />
        <el-input placeholder="Расположение" />
        <el-input placeholder="Управляющий" />
        <el-input placeholder="Телеофн номер" />
        <el-input placeholder="Индекс" />
        <el-input placeholder="Ссылка на карту" />
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">Отменить</el-button>
          <el-button type="primary" @click="dialogVisible = false">
            Сохранить
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
import { useWindowSize } from '@vueuse/core'
import { Pencil, Trash2 } from 'lucide-vue-next'
import { onMounted, ref } from 'vue'

const dialogVisible = ref(false)
const fullscreen = ref(false)
const { width } = useWindowSize()

onMounted(() => {
  fullscreen.value = width.value <= 768
})
</script>
<style>
.el-input__inner {
  text-align: left !important;
}
</style>