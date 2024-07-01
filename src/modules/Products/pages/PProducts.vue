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
        <el-input
          placeholder="Search"
          class="mb-3 md:!w-[300px]"
          size="large"
          v-model="searchValue"
        />
        <Vue3EasyDataTable
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
              />
            </div>
          </template>
          <template
            v-if="[Roles.ADMIN, Roles.MANAGER].includes(authStore.user?.role)"
            #item-opera="data"
          >
            <el-button
              @click="openDialog(data)"
              size="small"
              class="!p-2"
              type="primary"
              plain
            >
              <Pencil class="w-[15px] h-[15px]" />
            </el-button>
            <el-button
              @click="deleteBtn(data.id)"
              size="small"
              class="!p-2"
              type="danger"
              plain
            >
              <Trash class="w-[15px] h-[15px]" />
            </el-button>
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
              placeholder="Name"
              :class="v$.name.$error ? 'error' : ''"
            ></el-input>
            <el-input
              size="large"
              v-model="state.description"
              type="text"
              placeholder="Description"
              :class="v$.description.$error ? 'error' : ''"
            ></el-input>
            <el-input
              size="large"
              v-model="state.carModel"
              type="text"
              placeholder="Car model"
              :class="v$.carModel.$error ? 'error' : ''"
            ></el-input>
            <el-input
              size="large"
              v-model="state.carYear"
              type="text"
              placeholder="Car year"
              :class="v$.carYear.$error ? 'error' : ''"
            ></el-input>
            <el-select
              size="large"
              v-model="state.origin"
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
              v-model="state.manufacturer"
              placeholder="Поставщик"
              :class="v$.manufacturer.$error ? 'error' : ''"
            >
              <el-option
                v-for="item in providersList"
                :key="item"
                :label="item"
                :value="item"
              />
            </el-select>
            <el-input
              size="large"
              v-model="state.manualCode"
              type="text"
              placeholder="Product Code"
              :class="v$.manualCode.$error ? 'error' : ''"
            ></el-input>
            <el-select
              size="large"
              v-model="state.group"
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
              v-model="state.partNumber"
              type="text"
              placeholder="Part number"
              :class="v$.partNumber.$error ? 'error' : ''"
            ></el-input>
            <el-input
              size="large"
              v-model="state.weight"
              type="number"
              placeholder="Weight"
              :class="v$.weight.$error ? 'error' : ''"
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
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import { useWindowSize } from '@vueuse/core'
import Compressor from 'compressorjs'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Pencil, Trash } from 'lucide-vue-next'
import { computed, onMounted, reactive, Ref, ref } from 'vue'
import type { Header, Item } from 'vue3-easy-data-table'
import Vue3EasyDataTable from 'vue3-easy-data-table'

import { groupTypes, isOriginal } from '@/data'
import { useAuthStore } from '@/modules/Auth/store.ts'
import {
  deleteProduct,
  getProducts,
  updateProduct,
} from '@/modules/Products/controller'
import { IProduct } from '@/modules/Products/types.ts'
import { Roles } from '@/types'

const authStore = useAuthStore()
const { width } = useWindowSize()
const searchValue = ref('')
const loading = ref(false)
const dialog = ref(false)
const products: Ref<IProduct[] | undefined> = ref()
const providersList = ['BYD']
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
  carModel: { required },
  carYear: { required },
  group: { required },
  manualCode: { required },
  manufacturer: { required },
  origin: { required },
  partNumber: { required },
  weight: { required },
  name: { required },
  description: { required },
}
const v$ = useVuelidate(rules, state)
const headers: Header[] = [
  { text: 'Id', value: 'id', sortable: true },
  { text: 'Фото', value: 'image' },
  { text: 'Название', value: 'name', sortable: true },
  { text: 'Описание', value: 'description', sortable: true },
  { text: 'Поставщик', value: 'manufacturer', sortable: true },
  { text: 'Тип', value: 'origin', sortable: true },
  { text: 'Модель', value: 'carModel', sortable: true },
  { text: 'Год выпуска', value: 'carYear', sortable: true },
  { text: 'Группа', value: 'group', sortable: true },
  { text: 'Баркод', value: 'partNumber', sortable: true },
  { text: 'Код', value: 'manualCode', sortable: true },
  { text: 'Вес', value: 'weight', sortable: true },
  { text: 'Operations', value: 'opera' },
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
  ElMessageBox.confirm('Delete product. Continue?', 'Warning', {
    confirmButtonText: 'OK',
    cancelButtonText: 'Cancel',
    type: 'warning',
  })
    .then(async () => {
      await deleteProduct(id)
      products.value = await getProducts()
      ElMessage({
        type: 'success',
        message: 'Delete completed',
      })
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: 'Delete canceled',
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
