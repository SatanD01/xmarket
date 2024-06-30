<template>
  <div class="p-3 shadow rounded-lg bg-white">
    <h3 class="text-[24px] font-bold mb-3">Пополнение склада</h3>
    <div class="gap-3 grid grid-cols-1 md:grid-cols-12">
      <div class="col-span-1 md:col-span-3">
        <p class="text-[18px] mb-2">Фотография товара (.jpeg)</p>
        <input type="file" @change="onFileChange" />

        <el-upload
          class="photo-uploader"
          action="#"
          :show-file-list="false"
          :auto-upload="false"
          :on-change="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
        >
          <img
            v-if="imageUrl"
            :src="imageUrl"
            class="photo !object-cover !w-full"
            alt="uploaded_image"
          />
          <Image v-else class="icon" :size="40" />
        </el-upload>
        {{ imageUrl }}
      </div>
      <div class="col-span-1 md:col-span-9">
        <p class="text-[18px] mb-2">Информационные поля</p>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-3">
          <!--          <el-select v-model="template" placeholder="Шаблоны">-->
          <!--            <el-option-->
          <!--              v-for="item in templates"-->
          <!--              :key="item.value"-->
          <!--              :label="item.label"-->
          <!--              :value="item.value"-->
          <!--            />-->
          <!--          </el-select>-->
          <el-input
            v-model="barCode"
            type="text"
            placeholder="Название товара"
          ></el-input>
          <el-input type="text" placeholder="В каком офисе товар"></el-input>
          <el-input type="text" placeholder="количество"></el-input>
          <el-input type="text" placeholder="Своя цена"></el-input>
          <el-input type="text" placeholder="Цена с наценкой"></el-input>
          <el-select v-model="providers" placeholder="Поставщик">
            <el-option
              v-for="item in providers_list"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <el-input type="text" placeholder="Разер товара"></el-input>
          <el-input type="text" placeholder="Категория товара"></el-input>
          <el-button type="primary">Создать</el-button>
          <el-button type="primary" class="!ms-0">Сохрать шаблон</el-button>
          <el-button @click="scanDialog = true" type="primary" class="!ms-0"
            >Сканировать QR-Код</el-button
          >
        </div>
      </div>
    </div>
    <el-dialog v-model="scanDialog" title="Tips" width="500">
      <div>
        <StreamBarcodeReader @decode="onDecode" @load="onLoaded" />
        {{ onDecode }}
      </div>
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
import Compressor from 'compressorjs'
import type { UploadProps } from 'element-plus'
import { ElMessage } from 'element-plus'
import { Image } from 'lucide-vue-next'
import { reactive, ref } from 'vue'
import { StreamBarcodeReader } from 'vue-barcode-reader'

import { IProduct } from '@/modules/Products/types.ts'

const imageUrl = ref('')
const providers = ref('')
// const template = ref('')
const scanDialog = ref(false)
const providers_list = [
  {
    value: 'BYD',
    label: 'BYD',
  },
  {
    value: 'CHAZOR',
    label: 'CHAZOR',
  },
]
// const templates = [
//   {
//     value: 'Шаблон1',
//     label: 'Шаблон1',
//   },
//   {
//     value: 'Шаблон2',
//     label: 'Шаблон2',
//   },
// ]
const product = reactive<IProduct>({
  name: '',
  description: '',
  manufacturer: '',
  origin: '',
  carModel: '',
  carYear: '',
  group: '',
  partNumber: '',
  manualCode: '',
  weight: 0,
  imageString: '',
})
const onFileChange = (e) => {
  const file = e.target.files[0]
  console.log(e.target.files[0])

  // Compress the image
  new Compressor(file, {
    quality: 0.6, // Set the compression quality, adjust this value as needed
    maxWidth: 1024, // Set a max width, optional
    maxHeight: 1024, // Set a max height, optional
    success: (compressedResult) => {
      const reader = new FileReader()

      reader.onload = (e) => {
        this.good.photoBase64 = e.target.files.split(',')[0] // Get the Base64 string without the prefix
      }

      reader.readAsDataURL(compressedResult)
    },
    error(err) {
      console.error(err.message)
    },
  })
}

const barCode = ref(null)
const onDecode = (result: any) => {
  barCode.value = result
  if (barCode.value) scanDialog.value = false
}
const onLoaded = (error: any) => {
  console.log(error)
}
const handleAvatarSuccess = (response) => {
  imageUrl.value = URL.createObjectURL(response.raw)
}

const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
  if (['image/jpeg', 'png', 'jpg', 'webp', 'jpg'].includes(rawFile.type)) {
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

.photo-uploader .el-upload:hover,
.photo-uploader:hover .icon {
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
