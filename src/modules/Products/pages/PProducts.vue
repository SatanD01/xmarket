<template>
  <div v-if="products">
    <div>
      <div
        class="bg-white gap-3 shadow rounded-lg mb-3 p-3 flex items-center justify-between"
      >
        <h1 class="font-bold text-[32px]">Товары</h1>
        <el-button
          type="primary"
          @click="$router.push({ name: 'CreateProduct' })"
          v-if="[Roles.ADMIN, Roles.MANAGER].includes(authStore.user?.role)"
          >Создать товар</el-button
        >
      </div>
      <div class="bg-white p-3 rounded-lg shadow">
        <div class="flex items-center gap-3">
          <el-input
            placeholder="Поиск"
            class="mb-3 md:!w-[300px]"
            size="large"
            v-model="searchValue"
          />
          <el-button
            size="large"
            @click="scanDialogOpen"
            type="primary"
            class="!ms-0 mb-3 !p-2"
            ><QrCode
          /></el-button>
        </div>
        <Vue3EasyDataTable
          buttons-pagination
          :headers="headers"
          :items="items"
          :search-field="[
            'id',
            'name',
            'description',
            'manufacturer',
            'origin',
            'carModel',
            'carYear',
            'group',
            'partNumber',
            'manualCode',
            'weight',
          ]"
          :search-value="searchValue"
        >
          <template #item-image="item">
            <div class="py-3">
              <el-image
                style="width: 80px; height: 60px"
                :src="`data:image/jpeg;base64,${item.image}`"
                :zoom-rate="1.0"
                :max-scale="5"
                :min-scale="0.2"
                :preview-src-list="[`data:image/jpeg;base64,${item.image}`]"
                :initial-index="4"
                fit="cover"
              >
                <template #viewer>
                  <div
                    class="custom-viewer flex flex-row absolute top-[50px] left-[30px]"
                  >
                    <el-button
                      @click="copyImage(`data:image/jpeg;base64,${item.image}`)"
                      >Копировать</el-button
                    >
                    <el-button
                      @click="
                        downloadImage(`data:image/jpeg;base64,${item.image}`)
                      "
                      >Скачать</el-button
                    >
                  </div>
                </template>
              </el-image>
            </div>
          </template>
          <template #item-origin="item">
            <span>{{
              item.origin === 'Original' ? 'Оригинал' : 'Дубликат'
            }}</span>
          </template>
          <template
            v-if="[Roles.ADMIN, Roles.MANAGER].includes(authStore.user?.role)"
            #item-opera="data"
          >
            <div class="flex items-center">
              <el-button
                @click="openDialog(data)"
                size="small"
                class="!py-2 !px-1"
                type="primary"
                plain
              >
                <Pencil class="w-[15px] h-[15px]" />
              </el-button>
              <el-button
                @click="deleteBtn(data.id)"
                size="small"
                class="!py-2 !px-1 !ml-[8px]"
                type="danger"
                plain
              >
                <Trash class="w-[15px] h-[15px]" />
              </el-button>
            </div>
          </template>
        </Vue3EasyDataTable>
      </div>
      <el-dialog
        v-model="dialog"
        width="70%"
        :title="`Изменить`"
        :fullscreen="width < 768"
      >
        <div class="grid gap-3 grid-cols-1 md:grid-cols-2">
          <div>
            <!--            {{ state.imageString }}-->
            <img
              class="w-full h-[240px]"
              :src="`data:image/jpeg;base64,${state.imageString}`"
              alt=""
            />
            <input type="file" @change="onFileChange" />
          </div>

          <div class="grid md:grid-cols-2 gap-3">
            <el-input
              v-model="state.name"
              size="large"
              type="text"
              placeholder="Название"
              :class="v$.name.$error ? 'error' : ''"
            ></el-input>
            <el-input
              size="large"
              v-model="state.description"
              type="text"
              placeholder="Описание"
            ></el-input>
            <el-input
              size="large"
              v-model="state.carModel"
              type="text"
              placeholder="Модель машины"
            ></el-input>
            <el-input
              size="large"
              v-model="state.carYear"
              type="text"
              placeholder="Год машины"
            ></el-input>
            <el-select
              size="large"
              v-model="state.origin"
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
              v-model="state.manufacturer"
              placeholder="Производитель"
            />
            <el-input
              size="large"
              v-model="state.manualCode"
              type="text"
              placeholder="Код продукта"
            ></el-input>
            <el-select
              size="large"
              v-model="state.group"
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
              v-model="state.partNumber"
              type="text"
              placeholder="Баркод"
            ></el-input>
            <el-input
              size="large"
              v-model="state.weight"
              type="number"
              placeholder="Вес"
            ></el-input>
          </div>
        </div>
        <el-button
          :loading="loading"
          type="primary"
          class="text-end mt-3"
          @click="updateCustomer"
          >Обновить</el-button
        >
      </el-dialog>
      <el-dialog
        v-model="scanDialog"
        title="Сканер бар кода"
        :align-center="width < 768"
        :width="width > 768 ? 500 : 300"
      >
        <div>
          <StreamBarcodeReader @decode="onDecode" @load="onLoaded" />
        </div>
      </el-dialog>
    </div>
  </div>
  <CTableSceleton v-else />
</template>

<script lang="ts" setup>
import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import { useWindowSize } from '@vueuse/core'
import Compressor from 'compressorjs'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Pencil, QrCode, Trash } from 'lucide-vue-next'
import { computed, onMounted, reactive, Ref, ref } from 'vue'
import { StreamBarcodeReader } from 'vue-barcode-reader'
import type { Header, Item } from 'vue3-easy-data-table'
import Vue3EasyDataTable from 'vue3-easy-data-table'

import CTableSceleton from '@/components/CTableSceleton.vue'
import { groupTypes, isOriginal } from '@/data'
import { useAuthStore } from '@/modules/Auth/store.ts'
import {
  deleteProduct,
  getProducts,
  updateProduct,
} from '@/modules/Products/controller'
import { IProduct } from '@/modules/Products/types.ts'
import { Roles } from '@/types'

const scanDialog = ref(false)
const authStore = useAuthStore()
const { width } = useWindowSize()
const searchValue = ref('')
const loading = ref(false)
const dialog = ref(false)
const products: Ref<IProduct[] | undefined> = ref()
const providersList = ['BYD']

const copyImage = async (base64String) => {
  try {
    const img = new Image()
    img.src = base64String

    img.onload = async () => {
      const canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0)

      canvas.toBlob(async (blob) => {
        try {
          const item = new ClipboardItem({ 'image/png': blob })
          await navigator.clipboard.write([item])
          ElMessage.success('Изображение скопировано в буфер обмена')
        } catch (err) {
          console.error(err)
          ElMessage.error('Не удалось скопировать изображение')
        }
      }, 'image/png')
    }
  } catch (err) {
    console.error(err)
    ElMessage.error('Не удалось скопировать изображение')
  }
}

const downloadImage = (img) => {
  const link = document.createElement('a')
  link.href = img
  link.download = 'image.jpeg'
  link.click()
}

const state = reactive<IProduct>({
  id: null,
  carModel: '',
  carYear: '',
  group: '',
  imageString: '',
  manualCode: '',
  manufacturer: '',
  origin: '',
  partNumber: '',
  weight: '',
  name: '',
  description: '',
})
const rules = {
  name: { required },
  origin: { required },
  group: { required },
}
const onDecode = (result: any) => {
  searchValue.value = result
  if (product.partNumber) scanDialog.value = false
}
const onLoaded = (error: any) => {
  console.log(error)
}
const scanDialogOpen = async () => {
  try {
    await navigator.mediaDevices.getUserMedia({ video: true })
    scanDialog.value = true
  } catch (err) {
    alert(err)
  }
}
const v$ = useVuelidate(rules, state)
const headers: Header[] = [
  { text: 'Id', value: 'id', sortable: true },
  { text: 'Фото', value: 'image' },
  { text: 'Название', value: 'name', sortable: true },
  { text: 'Описание', value: 'description', sortable: true },
  { text: 'Производитель', value: 'manufacturer', sortable: true },
  { text: 'Тип', value: 'origin', sortable: true },
  { text: 'Модель', value: 'carModel', sortable: true },
  { text: 'Год выпуска', value: 'carYear', sortable: true },
  { text: 'Категория', value: 'group', sortable: true },
  { text: 'Баркод', value: 'partNumber', sortable: true },
  { text: 'Код', value: 'manualCode', sortable: true },
  { text: 'Вес', value: 'weight', sortable: true },
  { text: 'Операции', value: 'opera' },
]

const items = computed((): Item[] | undefined => {
  return products.value
})

const openDialog = (data: IProduct) => {
  state.id = data.id
  if (data.image) {
    state.imageString = data.image
  }
  state.name = data.name
  state.description = data.description
  state.partNumber = data.partNumber
  state.weight = data.weight
  state.origin = data.origin
  state.manufacturer = data.manufacturer
  state.manualCode = data.manualCode
  state.group = data.group
  state.carYear = data.carYear
  state.carModel = data.carModel
  dialog.value = true
}
const updateCustomer = async () => {
  try {
    v$.value.$touch()
    if (v$.value.$invalid) return
    loading.value = true
    await updateProduct(state)
    products.value = await getProducts()
    dialog.value = false
  } catch (e) {
    console.log(e)
  } finally {
    loading.value = false
  }
}
const deleteBtn = (id: number) => {
  ElMessageBox.confirm('Вы уверены, что хотите удалить товар?', 'Внимание!', {
    confirmButtonText: 'Да',
    cancelButtonText: 'Нет',
    type: 'warning',
  })
    .then(async () => {
      await deleteProduct(id)
      products.value = await getProducts()
      ElMessage({
        type: 'success',
        message: 'Успешно удален',
      })
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: 'Товар не удален',
      })
    })
}
const onFileChange = (e) => {
  const file = e.target.files[0]
  console.log(e.target.files[0])

  new Compressor(file, {
    quality: 0.6,

    success: (compressedFile) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        state.imageString = e.target.result
        state.imageString = state.imageString.split(',')[1]
      }
      reader.readAsDataURL(compressedFile)
    },
    error: (error) => {
      console.log(error)
    },
  })
}

onMounted(async () => {
  products.value = await getProducts()
  console.log(products.value)
})
</script>

<style>
.custom-viewer el-button {
  margin: 5px;
}
</style>
