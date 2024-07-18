<template>
  <div class="p-3 shadow rounded-lg bg-white">
    <h3 class="text-[24px] font-bold mb-3">Создание товара</h3>
    <div class="gap-3 grid grid-cols-1 md:grid-cols-12">
      <div class="col-span-1 md:col-span-3">
        <p class="text-[14px] mb-2">
          Фотография товара (.jpeg, .png, .jpg, .webp)
        </p>
        <input type="file" @change="onFileChange" />
        <p v-if="file">
          Size: {{ (file?.size / (1024 * 1024)).toFixed(2) }} Mb
        </p>
      </div>
      <div class="col-span-1 md:col-span-9">
        <p class="text-[18px] mb-2">Информационные поля</p>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-3">
          <el-input
            v-model="product.name"
            size="large"
            type="text"
            placeholder="Название товара"
            :class="v$.name.$error ? 'error' : ''"
          ></el-input>
          <el-input
            size="large"
            v-model="product.description"
            type="text"
            placeholder="Описание"
          ></el-input>
          <el-input
            size="large"
            v-model="product.carModel"
            type="text"
            placeholder="Модель машины"
          ></el-input>
          <el-input
            size="large"
            v-model="product.carYear"
            type="text"
            placeholder="Год машины"
          ></el-input>
          <el-select
            size="large"
            v-model="product.group"
            type="text"
            placeholder="Категория"
            :class="v$.group.$error ? 'error' : ''"
          >
            <el-option
              v-for="item in groupTypes"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
          <el-input
            size="large"
            v-model="product.manufacturer"
            placeholder="Производитель"
          />
          <el-input
            size="large"
            v-model="product.manualCode"
            type="text"
            placeholder="Номер продукта"
          ></el-input>
          <el-select
            size="large"
            v-model="product.origin"
            type="text"
            placeholder="Тип товара"
            :class="v$.origin.$error ? 'error' : ''"
          >
            <el-option
              v-for="item in isOriginal"
              :key="item"
              :label="item === 'Original' ? 'Оригинал' : 'Дубликат'"
              :value="item"
            />
          </el-select>
          <el-input
            size="large"
            v-model="product.partNumber"
            type="text"
            placeholder="Баркод"
          ></el-input>
          <el-input
            size="large"
            v-model="product.weight"
            type="number"
            placeholder="Вес"
          ></el-input>

          <!--          <el-button type="primary" class="!ms-0">Сохрать шаблон</el-button>-->
          <el-button
            size="large"
            @click="scanDialog = true"
            type="primary"
            class="!ms-0"
            >Сканировать QR-Код</el-button
          >
          <el-button
            size="large"
            @click="createProductBtn"
            class="!ms-0"
            type="primary"
            >Создать</el-button
          >
        </div>
      </div>
    </div>
    <el-dialog
      v-model="scanDialog"
      title="Сканер бар кода"
      width="500"
      :fullscreen="width < 768"
      @closed="stopVideo"
    >
      <div>
        <StreamBarcodeReader
          v-if="scanDialog"
          @decode="onDecode"
          @load="onLoaded"
        />
      </div>
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import { useWindowSize } from '@vueuse/core'
import Compressor from 'compressorjs'
import { onMounted, reactive, Ref, ref } from 'vue'
import { StreamBarcodeReader } from 'vue-barcode-reader'
import { useRouter } from 'vue-router'

import { groupTypes, isOriginal } from '@/data'
import { createProduct } from '@/modules/Products/controller'
import { IProduct } from '@/modules/Products/types.ts'
import { getSuppliers } from '@/modules/UserController/controller'
import { ISuppliers } from '@/modules/UserController/types.ts'

const { width } = useWindowSize()
const router = useRouter()
const scanDialog = ref(false)
const suppliers: Ref<ISuppliers[] | undefined> = ref()
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
  weight: '',
  imageString: '',
})
function stopVideo() {
  if (window.localStream) {
    window.localStream.getTracks().forEach((track) => {
      track.stop()
    })
  }
}
const rules = {
  name: { required },
  origin: { required },
  group: { required },
}
const file = ref('')
const onFileChange = (e) => {
  file.value = e.target.files[0]
  console.log(e.target.files[0])

  new Compressor(file.value, {
    quality: 0.6,

    success: (compressedFile) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        product.imageString = e.target.result
      }
      reader.readAsDataURL(compressedFile)
    },
    error: (error) => {
      console.log(error)
    },
  })
}
const v$ = useVuelidate(rules, product)
const createProductBtn = async () => {
  try {
    v$.value.$touch()
    if (v$.value.$invalid) return
    product.imageString = product.imageString.split(',')[1]
    const res = await createProduct(product)
    await router.push({ name: 'Products' })
    console.log(res)
  } catch (error) {
    console.log(error)
  }
}

const onDecode = (result: any) => {
  product.partNumber = result
  scanDialog.value = false
}
const onLoaded = (error: any) => {
  console.log(error)
}
onMounted(async () => {
  suppliers.value = await getSuppliers()
})
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
