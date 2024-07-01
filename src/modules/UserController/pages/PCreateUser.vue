<template>
  <div class="bg-white p-3 shadow rounded-lg">
    <h3 class="text-[24px] font-bold mb-3">Создать пользователя</h3>
    <div class="grid md:grid-cols-4 grid-cols-1 gap-3">
      <el-input
        placeholder="Login"
        v-model="form.login"
        :class="{ error: v$.login.$error }"
      />
      <el-input
        type="password"
        show-password
        placeholder="Password"
        v-model="form.password"
        :class="{ error: v$.password.$error }"
      />
      <el-input
        placeholder="Телефон номер"
        v-model="form.phone"
        :class="{ error: v$.phone.$error }"
      />
      <el-input
        placeholder="Имя"
        v-model="form.name"
        :class="{ error: v$.name.$error }"
      />
      <el-select
        v-model="form.role"
        placeholder="Роль"
        :class="{ error: v$.role.$error }"
      >
        <el-option
          v-for="item in roles"
          :key="item.value"
          :label="
            item.label === 'Admin'
              ? 'Админ'
              : item.label === 'Manager'
                ? 'Менеджер'
                : 'Продавец'
          "
          :value="item.value"
        />
      </el-select>
      <el-button type="primary" :loading="loading" @click="onSubmit"
        >Добавить</el-button
      >
    </div>
  </div>
</template>
<script setup lang="ts">
import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from 'vue3-toastify'

import { useApi } from '@/composables/useApi.ts'
import { roles } from '@/data/user.ts'

const router = useRouter()
const form = ref({
  login: '',
  password: '',
  role: '',
  name: '',
  phone: '',
})
const rules = reactive({
  login: { required },
  password: { required },
  role: { required },
  name: { required },
  phone: { required },
})
const loading = ref(false)
const v$ = useVuelidate(rules, form.value)

const onSubmit = async () => {
  v$.value.$touch()
  if (v$.value.$invalid) return

  loading.value = true
  try {
    const res = await useApi().$post('/Users/RegisterUser', form.value)
    toast.success('User was created successfully!')
    await router.push({ name: 'Users' })
    console.log(res)
  } catch (err) {
    console.log(err)
  } finally {
    loading.value = false
  }
}
</script>
<style scoped></style>
