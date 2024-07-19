<template>
  <div
    class="grid grid-cols-1 card shadow border rounded-lg hover:shadow-lg transition-all hover:transition-all cursor-pointer"
  >
    <div class="w-full h-full">
      <iframe
        v-if="office.addressUrl"
        :src="office.addressUrl"
        width="100%"
        height="200"
        frameborder="1"
        allowfullscreen="false"
      ></iframe>
      <div
        v-else
        class="bg-gray-200 w-full h-[200px] flex items-center justify-center"
      >
        <span>Локация не указана</span>
      </div>
    </div>
    <div class="p-2 flex flex-col gap-1 bg-white rounded-b-lg">
      <p class="font-bold text-[14px]">Название: {{ office.name }}</p>
      <p class="text-[12px] text-gray-500">Адрес: {{ office.address }}</p>
      <p class="text-[12px] text-gray-500">
        Описание:
        {{ office.description }}
      </p>
      <p class="text-[12px] text-gray-500">
        Тип: {{ office.type === 'Warehouse' ? 'Склад' : 'Магазин' }}
      </p>
      <div class="grid grid-cols-1 gap-3 mt-2">
        <el-button
          v-if="[Roles.ADMIN, Roles.MANAGER].includes(authStore.user?.role)"
          class="w-full"
          type="primary"
          plain
          @click="editBtn"
          ><Pencil :offset-size="1" />
          <span class="ms-2">Изменить</span></el-button
        >
      </div>
    </div>

    <el-dialog
      v-model="dialogVisible"
      title="Изменить локацию"
      width="800"
      :fullscreen="fullscreen"
    >
      <div class="grid md:grid-cols-2 grid-cols-1 gap-3">
        <el-input
          :class="v$.name.$error ? 'error' : ''"
          size="large"
          v-model="officeData.name"
          placeholder="Название"
        />
        <el-input
          size="large"
          v-model="officeData.description"
          placeholder="Описание"
        />
        <el-input
          size="large"
          v-model="officeData.address"
          placeholder="Адрес"
        />
        <el-select
          :class="v$.type.$error ? 'error' : ''"
          size="large"
          v-model="officeData.type"
          placeholder="Тип"
        >
          <el-option
            v-for="item in officeTypes"
            :key="item"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
      <div class="w-full mt-3">
        <iframe
          :src="office.addressUrl"
          width="100%"
          height="200"
          frameborder="1"
          allowfullscreen="false"
        ></iframe>
        <el-input
          size="large"
          v-model="officeData.addressUrl"
          placeholder="Ссылка на Яндекс карты"
          class="mt-3"
        />
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">Отменить</el-button>
          <el-button type="primary" @click="updateOffice">
            Сохранить
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import { useWindowSize } from '@vueuse/core'
import { Pencil } from 'lucide-vue-next'
import { onMounted, reactive, ref } from 'vue'

import { useApi } from '@/composables/useApi.ts'
import { useAuthStore } from '@/modules/Auth/store.ts'
import { IOffice } from '@/modules/Offices/types.ts'
import { Roles } from '@/types'

interface Props {
  office: IOffice
}
const props = defineProps<Props>()
const dialogVisible = ref(false)
const fullscreen = ref(false)
const { width } = useWindowSize()
const authStore = useAuthStore()
const officeData = reactive<IOffice>({
  address: '',
  addressUrl: '',
  description: '',
  name: '',
  type: '',
  id: '',
})
const rules = {
  name: { required },
  type: { required },
}
const officeTypes = ref([
  {
    label: 'Склад',
    value: 'Warehouse',
  },
  {
    label: 'Магазин',
    value: 'Store',
  },
])
const v$ = useVuelidate(rules, officeData)
const editBtn = () => {
  dialogVisible.value = true
  officeData.name = props.office.name
  officeData.description = props.office.description
  officeData.address = props.office.address
  officeData.addressUrl = props.office.addressUrl
  officeData.type = props.office.type
  officeData.id = props.office.id
}
const updateOffice = async () => {
  v$.value.$touch()
  if (v$.value.$invalid) return
  await useApi()
    .$post('/locations/updateLocation', officeData)
    .then((res) => {
      dialogVisible.value = false
    })
    .catch((err) => {
      console.log(err)
    })
}
onMounted(() => {
  fullscreen.value = width.value <= 768
})
</script>
<style>
.el-input__inner {
  text-align: left !important;
}
</style>
