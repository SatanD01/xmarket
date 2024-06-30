<template>
  <div
    class="grid grid-cols-1 card shadow border rounded-lg hover:shadow-lg transition-all hover:transition-all cursor-pointer"
  >
    <div class="w-full h-full">
      <iframe
        :src="office.addressUrl"
        width="100%"
        height="200"
        frameborder="1"
        allowfullscreen="false"
      ></iframe>
    </div>
    <div class="p-2 flex flex-col gap-1 bg-white rounded-b-lg">
      <p class="font-bold text-[14px]">{{ office.name }}</p>
      <p class="text-[12px] text-gray-500">{{ office.address }}</p>
      <p class="text-[12px] text-gray-500">
        <el-link class="!text-[12px] text-gray-500" href="tel:998999999999">{{
          office.description
        }}</el-link>
      </p>
      <p class="text-[12px] text-gray-500">{{ office.type }}</p>
      <div class="grid grid-cols-1 gap-3 mt-2">
        <el-button class="w-full" type="success" plain @click="editBtn"
          ><Pencil :offset-size="1" />
          <span class="ms-2">Изменить</span></el-button
        >
      </div>
    </div>

    <el-dialog
      v-model="dialogVisible"
      title="Изменить офис"
      width="800"
      :fullscreen="fullscreen"
    >
      <div class="grid md:grid-cols-2 grid-cols-1 gap-3">
        <el-input
          :class="v$.name.$error ? 'error' : ''"
          size="large"
          v-model="officeData.name"
          placeholder="Name"
        />
        <el-input
          size="large"
          :class="v$.description.$error ? 'error' : ''"
          v-model="officeData.description"
          placeholder="Description"
        />
        <el-input
          size="large"
          v-model="officeData.address"
          placeholder="Address"
          :class="v$.address.$error ? 'error' : ''"
        />
        <el-select
          :class="v$.type.$error ? 'error' : ''"
          size="large"
          v-model="officeData.type"
          placeholder="Type"
        >
          <el-option
            v-for="item in officeTypes"
            :key="item"
            :label="item"
            :value="item"
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
          :class="v$.addressUrl.$error ? 'error' : ''"
          placeholder="Link"
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
import { IOffice } from '@/modules/Offices/types.ts'

interface Props {
  office: IOffice
}
const props = defineProps<Props>()
const dialogVisible = ref(false)
const fullscreen = ref(false)
const { width } = useWindowSize()
const officeData = reactive<IOffice>({
  address: '',
  addressUrl: '',
  description: '',
  name: '',
  type: '',
  id: '',
})
const rules = {
  address: { required },
  addressUrl: { required },
  description: { required },
  name: { required },
  type: { required },
}
const officeTypes = ref(['Warehouse'])
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
      console.log(res)
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
