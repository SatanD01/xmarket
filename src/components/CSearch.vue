<template>
  <div class="shadow p-3 ищквук rounded bg-white flex gap-3 mb-3">
    <el-autocomplete
        v-model="search"
        class="h-[30px]"
        placeholder="Напишите название товара"
    />
    <el-button type="primary" size="large">
      Поиск
    </el-button>
  </div>
</template>
<script setup lang="ts">
import {ref} from "vue";

const search = ref('')

</script>
<style>
.el-input {
  height: 42px !important;
}
</style>