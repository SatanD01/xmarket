<template>
  <div class="p-3 shadow rounded-lg bg-white">
    <h3 class="text-[24px] font-bold mb-3">Создать товар</h3>
    <div class="gap-3 grid grid-cols-1 md:grid-cols-12">
      <div class="col-span-1 md:col-span-3">
        <p class="text-[18px] mb-2">Фотография товара (.jpeg)</p>
        <el-upload
            class="photo-uploader"
            action="#"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
        >
          <img v-if="imageUrl" :src="imageUrl" class="photo" />
          <Image class="icon" :size="40"/>
        </el-upload>
      </div>
      <div class="col-span-1 md:col-span-9">
        <p class="text-[18px] mb-2">Информационные поля</p>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-3">
          <el-select
              v-model="template"
              placeholder="Шаблоны"
          >
            <el-option
                v-for="item in templates"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            />
          </el-select>
          <el-input type="text" placeholder="Название товара"></el-input>
          <el-input type="text" placeholder="В каком офисе товар"></el-input>
          <el-input type="text" placeholder="количество"></el-input>
          <el-input type="text" placeholder="Своя цена"></el-input>
          <el-input type="text" placeholder="Цена с наценкой"></el-input>
          <el-select
              v-model="providers"
              placeholder="Поставщик"
          >
            <el-option
                v-for="item in providers_list"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            />
          </el-select>
          <el-input type="text" placeholder="Разер товара"></el-input>
          <el-input type="text" placeholder="Категория товара"></el-input>
          <el-input type="text" placeholder="Вес товара"></el-input>
          <el-button type="primary">Создать</el-button>
          <el-button type="primary" class="!ms-0">Сохрать шаблон</el-button>
        </div>
      </div>
    </div>

  </div>
</template>
<script setup lang="ts">
import { Image } from 'lucide-vue-next'
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { UploadProps } from 'element-plus'

const imageUrl = ref('')
const providers = ref('')
const template = ref('')

const providers_list = [
  {
    value: 'BYD',
    label: 'BYD',
  },
  {
    value: 'CHAZOR',
    label: 'CHAZOR',
  }
]
const templates = [
  {
    value: 'Шаблон1',
    label: 'Шаблон1',
  },
  {
    value: 'Шаблон2',
    label: 'Шаблон2',
  }
]
const handleAvatarSuccess: UploadProps['onSuccess'] = (
    uploadFile
) => {
  imageUrl.value = URL.createObjectURL(uploadFile.raw!)
}

const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
  if (rawFile.type !== 'image/jpeg') {
    ElMessage.error('Картинка должан быть jpeg формата')
    return false
  }
  return true
}
</script>
<style scoped>
.photo-uploader .photo {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

<style>
.photo-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
  width: 100%;
  height: 120px;
}

.photo-uploader .icon {
  transition: 0.2s all;
}

.photo-uploader .el-upload:hover, .photo-uploader:hover .icon {
  border-color: var(--el-color-primary);
  color: var(--el-color-primary);
  transition: 0.2s all;
}

.el-icon.photo-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>