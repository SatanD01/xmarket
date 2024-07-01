<template>
  <div>
    <div class="bg-white rounded-lg p-4 w-full flex justify-between">
      <h1 class="text-2xl font-semibold capitalize">Пользователи</h1>
      <RouterLink :to="{ name: 'CreateUser' }">
        <el-button type="primary"> Создать пользователя </el-button>
      </RouterLink>
    </div>
    <div class="bg-white rounded-lg p-4 w-full mt-6">
      <Vue3EasyDataTable :headers="headers" :items="users">
        <template #item-createdAt="data">
          {{ dayjs(data?.createdAt).format('DD-MM-YYYY') }}
        </template>
        <template #item-updatedAt="data">
          {{
            data?.updatedAt ? dayjs(data?.updatedAt).format('DD-MM-YYYY') : '-'
          }}
        </template>
        <template #item-passwordSalt="data">
          <div class="flex items-center gap-4">
            <RouterLink
              :to="{ name: 'UsersEdit', params: { id: data?.login } }"
              class="py-2"
            >
              <FilePenIcon />
            </RouterLink>
            <div
              @click="openDelete(data?.id)"
              class="p-2 rounded-md bg-gray-200 cursor-pointer group hover:bg-red-400 transition-200"
            >
              <Trash
                :size="16"
                class="text-red-500 group-hover:text-white transition-200"
              />
            </div>
          </div>
        </template>
      </Vue3EasyDataTable>
    </div>
    <el-dialog v-model="dialog" class="!w-[300px]">
      <div>
        <p class="mb-10 text-lg text-center">
          Вы уверены, что хотите удалить пользователя ?
        </p>
        <div class="flex items-center gap-2">
          <el-button type="danger" @click="cancel" class="w-full"
            >Нет</el-button
          >
          <el-button
            type="primary"
            @click="deleteUser"
            :loading="loading"
            class="w-full"
            >Да</el-button
          >
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
import dayjs from 'dayjs'
import { FilePenIcon, Trash } from 'lucide-vue-next'
import { Ref, ref } from 'vue'
import Vue3EasyDataTable, { type Header } from 'vue3-easy-data-table'
import { toast } from 'vue3-toastify'

import { useApi } from '@/composables/useApi.ts'
import { IUsers } from '@/modules/UserController/types.ts'

const users: Ref<IUsers[]> = ref([])
const headers: Header[] = [
  { text: 'Имя', value: 'name', sortable: true },
  { text: 'Роль', value: 'role', sortable: true },
  { text: 'Id', value: 'id' },
  { text: 'Логин', value: 'login' },
  { text: 'Телефон', value: 'phone', sortable: true },
  { text: 'Создан', value: 'createdAt', sortable: true },
  { text: 'Дата обнавдения', value: 'updatedAt', sortable: true },
  { text: 'Управление', value: 'passwordSalt' },
]
const dialog = ref(false)
const loading = ref(false)
const deleteId = ref('')
const getUsers = async () => {
  try {
    const res = await useApi().$get<IUsers[]>('/Users/GetUsers')
    users.value = res.data
  } catch (err) {
    console.log(err)
  }
}
const openDelete = (id: string) => {
  deleteId.value = id
  dialog.value = true
}
const cancel = () => {
  deleteId.value = ''
  dialog.value = false
}
const deleteUser = async () => {
  loading.value = true
  try {
    await useApi().$post('/Users/DeleteUser', {
      id: deleteId.value,
    })
    await getUsers()
    toast.success('Пользователь успешно удален!')
    dialog.value = false
  } catch (err) {
    console.log(err)
  } finally {
    loading.value = false
  }
}
getUsers()
</script>
