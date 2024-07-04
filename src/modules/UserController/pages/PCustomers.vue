<template>
  <div v-if="customer">
    <div
      class="flex items-center justify-between bg-white gap-3 p-3 mb-3 shadow rounded-lg"
    >
      <h3 class="text-[24px] font-bold">Клиенты</h3>
      <el-button type="primary" @click="createDialog = true"
        >Добавить клиента</el-button
      >
    </div>
    <div class="bg-white p-3 shadow rounded-lg">
      <div class="flex gap-3 justify-between items-center mb-3">
        <el-input
          v-model="searchValue"
          placeholder="Поиск"
          class="!w-[300px]"
          size="large"
        />
      </div>
      <Vue3EasyDataTable
        buttons-pagination
        class="w-full"
        :headers="headers"
        :items="customer"
        :search-field="['id', 'name', 'phone']"
        :search-value="searchValue"
      >
        <template #item-type="data">
          <span>{{ data.type === 'Customer' ? 'Клиент' : data.type }}</span>
        </template>
        <template #item-createdAt="data">
          <span>{{ dayjs(data.createdAt).format('DD.MM.YYYY') }}</span>
        </template>
        <template #item-updatedAt="data">
          <span>{{
            data.updatedAt
              ? dayjs(data.updatedAt).format('DD.MM.YYYY HH:MM')
              : 'Не обнавлен'
          }}</span>
        </template>
        <template #item-buttons="data">
          <el-button
            @click="openDialog(data)"
            size="small"
            class="!p-2"
            type="primary"
            plain
          >
            <Pencil class="w-[15px] h-[15px]" />
          </el-button>
        </template>
      </Vue3EasyDataTable>
    </div>
    <el-dialog
      v-model="dialog"
      width="30%"
      :title="`Изменить ${customerName}`"
      :fullscreen="width < 768"
    >
      <div class="grid gap-3 grid-cols-1 md:grid-cols-2">
        <el-input
          :class="v$.name.$error ? 'error' : ''"
          placeholder="Название поставщика"
          v-model="state.name"
        />
        <el-input
          :class="v$.description.$error ? 'error' : ''"
          placeholder="Описание"
          v-model="state.description"
        />
        <el-input
          :class="v$.phone.$error ? 'error' : ''"
          placeholder="Телефон: 998998787676"
          v-model="state.phone"
        />
        <el-button type="primary" @click="updateCustomer">Обновить</el-button>
      </div>
    </el-dialog>
    <el-dialog
      v-model="createDialog"
      width="30%"
      title="Создать поставщика"
      :fullscreen="width < 768"
    >
      <div class="grid gap-3 grid-cols-1 md:grid-cols-2">
        <el-input
          :class="v2$.name.$error ? 'error' : ''"
          placeholder="Название поставщика"
          v-model="createState.name"
        />
        <el-input
          :class="v2$.description.$error ? 'error' : ''"
          placeholder="Описание"
          v-model="createState.description"
        />
        <el-input
          :class="v2$.phone.$error ? 'error' : ''"
          placeholder="Телефон: 998990897867"
          v-model="createState.phone"
        />
        <el-button type="primary" @click="createCustomer">Создать</el-button>
      </div>
    </el-dialog>
  </div>
  <CTableSceleton v-else />
</template>
<script setup lang="ts">
import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import { useWindowSize } from '@vueuse/core'
import dayjs from 'dayjs'
import { Pencil } from 'lucide-vue-next'
import { onMounted, reactive, Ref, ref } from 'vue'
import type { Header } from 'vue3-easy-data-table'
import Vue3EasyDataTable from 'vue3-easy-data-table'

import CTableSceleton from '@/components/CTableSceleton.vue'
import {
  createCustomers,
  getCustomers,
  updateCustomers,
} from '@/modules/UserController/controller'
import { ISuppliers } from '@/modules/UserController/types'

let customer: Ref<ISuppliers | undefined> = ref()
const { width } = useWindowSize()
const searchValue = ref('')
const dialog = ref(false)
const createDialog = ref(false)
const customerName = ref('')
const state = reactive<ISuppliers>({
  id: 0,
  name: '',
  description: '',
  phone: '',
})
const createState = reactive<ISuppliers>({
  name: '',
  description: '',
  phone: '',
})

const rules = {
  name: { required },
  description: { required },
  phone: { required },
}
const v$ = useVuelidate(rules, state)
const v2$ = useVuelidate(rules, createState)
const openDialog = (data) => {
  customerName.value = data.name
  state.id = data.id
  state.name = data.name
  state.description = data.description
  state.phone = data.phone
  dialog.value = true
}
const headers: Header[] = [
  { text: 'Id', value: 'id' },
  { text: 'Имя клиента', value: 'name', sortable: true },
  { text: 'Описание', value: 'description', sortable: true },
  { text: 'Телефон', value: 'phone', sortable: true },
  { text: 'Создан', value: 'createdAt', sortable: true },
  { text: 'Изменен', value: 'updatedAt', sortable: true },
  { text: 'Управление', value: 'buttons' },
]

const updateCustomer = async () => {
  v$.value.$touch()
  if (v$.value.$invalid) return
  await updateCustomers(state)
  customer.value = await getCustomers()
  dialog.value = false
}

const createCustomer = async () => {
  v2$.value.$touch()
  if (v2$.value.$invalid) return
  await createCustomers(createState)
  customer.value = await getCustomers()
  createState.phone = ''
  createState.name = ''
  createState.description = ''
  createDialog.value = false
}
onMounted(async () => {
  customer.value = await getCustomers()
})
</script>
<style scoped></style>
