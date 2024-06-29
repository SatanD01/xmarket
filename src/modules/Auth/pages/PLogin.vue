<template>
  <div class="container">
    <div class="flex items-center justify-center w-full h-screen">
      <div
        class="w-1/2 m-auto grid grid-cols-2 bg-white rounded-2xl p-3 shadow-md"
      >
        <div
          class="h-full flex flex-col gap-3 items-center justify-center border-r border-dashed"
        >
          <img class="w-[200px]" src="/logo_black.png" alt="logo" />
          <div>
            <p class="text-center font-bold text-gray-500 border-b-2">BYD</p>
            <p class="roboto-light text-gray-500">Build your dream</p>
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
import { ElNotification } from 'element-plus'
import { reactive } from 'vue'

import { useApi } from '@/composables/useApi.ts'
import router from '@/router'

interface ILogin {
  login: string
  password: string
}
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
  useApi()
    .$post('/Users/Authenticate', login)
    .then((res) => {
      console.log(res)
      router.push('/')
      ElNotification({
        title: 'Успешно',
        message: 'Выход прошел успешно',
        type: 'success',
        duration: 1200,
      })
    })
    .catch((err) => {
      console.log(err)
      ElNotification({
        title: 'Ошибка',
        message: 'Логин или пароль не верный',
        type: 'error',
        duration: 1200,
      })
    })
}
</script>
<style scoped lang="scss"></style>
