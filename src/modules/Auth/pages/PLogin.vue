<template>
  <div class="container">
    <div class="flex items-center justify-center w-full h-screen">
      <div
        class="md:w-1/2 m-auto grid grid-cols-1 gap-3 md:gap-0 md:grid-cols-2 bg-white rounded-2xl p-3 shadow-md"
      >
        <div
          class="h-full flex flex-col gap-3 items-center justify-center border-b pb-2 md:pb-0 md:border-r border-dashed"
        >
          <img class="w-[200px]" src="/logo_black.png" alt="logo" />
          <div>
            <p class="text-center font-bold text-orange-600 border-b-2">
              ENERGY
            </p>
            <p class="roboto-light text-gray-500">AUTO PARTS</p>
          </div>
        </div>

        <div class="grid grid-cols-1 gap-3 pl-3">
          <h4 class="h4 font-bold roboto-bold text-center">Войти в систему</h4>
          <form class="flex flex-col items-end">
            <div class="mb-2 w-full">
              <label class="text-[14px]" for="username">Логин</label>
              <el-input
                :class="v$.login.$error ? 'error' : ''"
                id="username"
                v-model="login.login"
              />
            </div>
            <div class="mb-3 text-[14px] w-full">
              <label for="password">Пароль</label>
              <el-input
                v-model="login.password"
                :class="v$.password.$error ? 'error' : ''"
                id="password"
                type="password"
                show-password
              />
            </div>
            <el-button
              @click="loginBtn"
              type="primary"
              :loading="loading"
              class="!flex !justify-center !items-center"
              >Войти</el-button
            >
          </form>
        </div>
      </div>
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
import { useAuthStore } from '@/modules/Auth/store.ts'

interface ILogin {
  login: string
  password: string
}
const authStore = useAuthStore()
const router = useRouter()

const loading = ref(false)
const rules = {
  login: { required },
  password: { required },
}
const login = reactive<ILogin>({
  login: '',
  password: '',
})
const v$ = useVuelidate(rules, login)

const loginBtn = async () => {
  v$.value.$touch()
  if (v$.value.$invalid) return
  try {
    const response = await useApi().$post<ILogin>('/users/authenticate', login)
    authStore.setToken(response.data.token)
    await router.push({ name: 'Dashboard' })
    toast.success('Login successfully')
    loading.value = true
  } catch (err) {
    console.log(err)
    toast.error('Username or password incorrect')
  } finally {
    loading.value = false
  }
}
</script>
<style scoped lang="scss"></style>
