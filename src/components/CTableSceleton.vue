<template>
  <el-skeleton animated>
    <template #template>
      <div
        class="bg-white p-3 shadow rounded-lg mb-3 flex justify-between items-center gap-3"
      >
        <el-skeleton-item variant="h1" class="!w-1/4" />
        <el-skeleton-item variant="button" class="!h-[30px]" />
      </div>
      <div class="bg-white p-3 shadow rounded-lg mb-3">
        <div class="flex mb-3 items-center gap-3">
          <el-skeleton-item variant="rect" class="!h-[30px] !w-1/4" />
          <el-skeleton-item variant="rect" class="!h-[30px] !w-[30px]" />
        </div>
        <div class="border">
          <div class="flex gap-3 border-b p-3">
            <el-skeleton-item v-for="item in 12" :key="item" variant="text" />
          </div>
          <div class="grid grid-cols-1">
            <div
              v-for="item in 5"
              :key="item"
              class="grid grid-cols-12 border-b items-center"
            >
              <div class="border-r p-2 h-full flex items-center">
                <el-skeleton-item variant="text" />
              </div>
              <div class="border-r p-2 h-full flex items-center">
                <el-skeleton-item
                  variant="p"
                  class="!min-w-[20px] !min-h-[60px]"
                />
              </div>
              <div class="border-r p-2 h-full flex items-center">
                <el-skeleton-item variant="text" />
              </div>
              <div class="border-r p-2 h-full flex items-center">
                <el-skeleton-item variant="text" />
              </div>
              <div class="border-r p-2 h-full flex items-center">
                <el-skeleton-item variant="text" />
              </div>
              <div class="border-r p-2 h-full flex items-center">
                <el-skeleton-item variant="text" />
              </div>
              <div class="border-r p-2 h-full flex items-center">
                <el-skeleton-item variant="text" />
              </div>
              <div class="border-r p-2 h-full flex items-center">
                <el-skeleton-item variant="text" />
              </div>
              <div class="border-r p-2 h-full flex items-center">
                <el-skeleton-item variant="text" />
              </div>
              <div class="border-r p-2 h-full flex items-center">
                <el-skeleton-item variant="text" />
              </div>
              <div class="border-r p-2 h-full flex items-center">
                <el-skeleton-item
                  variant="p"
                  class="!min-w-[10px] !min-h-[30px]"
                />
              </div>
              <div class="p-2 h-full flex items-center">
                <el-skeleton-item
                  variant="p"
                  class="!min-w-[10px] !min-h-[30px]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </el-skeleton>
</template>

<script setup lang="ts"></script>
<style scoped></style>
