<template>
  <div class="p-3 shadow rounded-lg bg-white">
    <h3 class="text-[24px] font-bold mb-3">Пополнение склада</h3>
    <div class="gap-3 grid grid-cols-1 md:grid-cols-12">
      <div class="col-span-1 md:col-span-3">
        <p class="text-[14px] mb-2">
          Фотография товара (.jpeg, .png, .jpg, .webp)
        </p>
        <input
          type="file"
          :class="v$.imageString.$error ? 'error' : ''"
          @change="onFileChange"
        />
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
            placeholder="Name"
            :class="v$.name.$error ? 'error' : ''"
          ></el-input>
          <el-input
            size="large"
            v-model="product.description"
            type="text"
            placeholder="Description"
            :class="v$.description.$error ? 'error' : ''"
          ></el-input>
          <el-input
            size="large"
            v-model="product.carModel"
            type="text"
            placeholder="Car model"
            :class="v$.carModel.$error ? 'error' : ''"
          ></el-input>
          <el-input
            size="large"
            v-model="product.carYear"
            type="text"
            placeholder="Car year"
            :class="v$.carYear.$error ? 'error' : ''"
          ></el-input>
          <el-select
            size="large"
            v-model="product.origin"
            type="text"
            placeholder="Group"
            :class="v$.origin.$error ? 'error' : ''"
          >
            <el-option
              v-for="item in isOriginal"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
          <el-select
            size="large"
            v-model="product.manufacturer"
            placeholder="Поставщик"
            :class="v$.manufacturer.$error ? 'error' : ''"
          >
            <el-option
              v-for="item in suppliers"
              :key="item.name"
              :label="item.name"
              :value="item.name"
            />
          </el-select>
          <el-input
            size="large"
            v-model="product.manualCode"
            type="text"
            placeholder="Product Code"
            :class="v$.manualCode.$error ? 'error' : ''"
          ></el-input>
          <el-select
            size="large"
            v-model="product.group"
            type="text"
            placeholder="Origin"
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
            v-model="product.partNumber"
            type="text"
            placeholder="Part number"
            :class="v$.partNumber.$error ? 'error' : ''"
          ></el-input>
          <el-input
            size="large"
            v-model="product.weight"
            type="number"
            placeholder="Weight"
            :class="v$.weight.$error ? 'error' : ''"
          ></el-input>

          <!--          <el-button type="primary" class="!ms-0">Сохрать шаблон</el-button>-->
          <el-button
            size="large"
            @click="scanDialog = true"
            type="primary"
            class="!ms-0"
            >Сканировать QR-Код</el-button
          >
          <el-button size="large" @click="createProductBtn" type="primary"
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
    >
      <div>
        <StreamBarcodeReader @decode="onDecode" @load="onLoaded" />
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
const rules = {
  name: { required },
  description: { required },
  manufacturer: { required },
  origin: { required },
  carModel: { required },
  carYear: { required },
  group: { required },
  partNumber: { required },
  manualCode: { required },
  weight: { required },
  imageString: { required },
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
  if (product.partNumber) scanDialog.value = false
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
