<template>
  <div class="w-full h-full relative">
    <img
      :src="originalImg"
      v-bind="{ alt }"
      :class="imgClass"
      @load="loading = false"
      loading="lazy"
      class="w-full h-full"
    />
    <img
      v-if="loading"
      :src="defaultImg"
      v-bind="{ alt }"
      :class="imgClass"
      class="w-full h-full absolute top-0 left-0 object-cover"
    />
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'

interface Props {
  originalImg: string
  defaultImg: string
  alt: string
  imgClass?: string
}
defineProps<Props>()

const loading = ref(true)
</script>
