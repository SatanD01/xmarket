<template>
  <div>
    <div v-if="skeleton">
      <div
        class="bg-white shadow rounded-lg p-4 w-full flex flex-wrap gap-3 justify-between"
      >
        <h1 class="text-2xl font-semibold capitalize">Пользователи</h1>
        <RouterLink :to="{ name: 'CreateUser' }">
          <el-button type="primary"> Создать пользователя </el-button>
        </RouterLink>
      </div>
      <div class="bg-white shadow rounded-lg p-4 w-full mt-6">
        <Vue3EasyDataTable :headers="headers" :items="users" buttons-pagination>
          <template #item-role="data">
            {{
              data.role === 'Admin'
                ? 'Админ'
                : data.role === 'Manager'
                  ? 'Менеджер'
                  : 'Продавец'
            }}
          </template>
          <template #item-createdAt="data">
            {{ dayjs(data?.createdAt).format('DD-MM-YYYY') }}
          </template>
          <template #item-updatedAt="data">
            {{
              data?.updatedAt
                ? dayjs(data?.updatedAt).format('DD-MM-YYYY')
                : '-'
            }}
          </template>
          <template #item-passwordSalt="data">
            <div class="flex items-center gap-4">
              <RouterLink
                :to="{
                  name: 'UsersEdit',
                  params: {
                    id: data?.id,
                  },
                  query: {
                    id: data?.id,
                    login: data?.login,
                    password: data?.password,
                    role: data?.role,
                    name: data?.name,
                    phone: data?.phone,
                  },
                }"
                class="py-2"
              >
                <el-button plain type="primary" size="small" class="!p-2">
                  <Pencil class="w-[15px] h-[15px]" />
                </el-button>
              </RouterLink>
              <el-button
                @click="openDelete(data?.id)"
                size="small"
                type="danger"
                class="!p-2"
                plain
              >
                <Trash
                  :size="16"
                  class="text-red-500 group-hover:text-white transition-200"
                />
              </el-button>
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
    <CTableSceleton v-else />
  </div>
</template>
<script setup lang="ts">
import dayjs from 'dayjs'
import { FilePenIcon, Pencil, Trash } from 'lucide-vue-next'
import { onMounted, Ref, ref } from 'vue'
import { useRoute } from 'vue-router'
import Vue3EasyDataTable, { type Header } from 'vue3-easy-data-table'
import { toast } from 'vue3-toastify'

import CTableSceleton from '@/components/CTableSceleton.vue'
import { useApi } from '@/composables/useApi.ts'
import { IUsers } from '@/modules/UserController/types.ts'

const users: Ref<IUsers[]> = ref([])
const headers: Header[] = [
  { text: 'Id', value: 'id' },
  { text: 'Имя', value: 'name', sortable: true },
  { text: 'Роль', value: 'role', sortable: true },
  { text: 'Логин', value: 'login' },
  { text: 'Телефон', value: 'phone', sortable: true },
  { text: 'Создан', value: 'createdAt', sortable: true },
  { text: 'Дата обнавдения', value: 'updatedAt', sortable: true },
  { text: 'Управление', value: 'passwordSalt' },
]
const dialog = ref(false)
const loading = ref(false)
const skeleton = ref(true)
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
onMounted(() => {
  skeleton.value = false
  getUsers()
  skeleton.value = true
})
</script>
