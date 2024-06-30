import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  CreateAxiosDefaults,
} from 'axios'

import { useAuthStore } from '@/modules/Auth/store.ts'
import router from '@/router'

export const useApi = (apiUrl?: string) => {
  const baseURL = apiUrl || import.meta.env.VITE_APP_SERVER_URL

  const $service = (config?: CreateAxiosDefaults): AxiosInstance => {
    const store = useAuthStore()
    const token = store.getTokens()
    const headers = {
      ...config?.headers,
      // Default headers
    }
    if (token) {
      Object.assign(headers, {
        Authorization: `Bearer ${token}`,
      })
    }

    const _axios = axios.create({
      ...config,
      baseURL,
      headers,
    })
    // Use interceptors here
    _axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response.status === 401) {
          store.removeToken()
          await router.push({ name: 'Login' })
        }
        throw error
      },
    )

    return _axios
  }

  function $get<R = unknown>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<R>> {
    return new Promise((resolve, reject) => {
      $service()
        .get<R>(url, config)
        .then((response) => resolve(response))
        .catch((error) => reject(error))
    })
  }

  function $delete<R = unknown>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<R>> {
    return new Promise((resolve, reject) => {
      $service()
        .delete<R>(url, config)
        .then((response) => resolve(response))
        .catch((error) => reject(error))
    })
  }

  function $post<R = unknown, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<R>> {
    return new Promise((resolve, reject) => {
      $service()
        .post<R>(url, data, config)
        .then((response) => resolve(response))
        .catch((error) => reject(error))
    })
  }

  function $put<R = unknown, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<R>> {
    return new Promise((resolve, reject) => {
      $service()
        .put<R>(url, data, config)
        .then((response) => resolve(response))
        .catch((error) => reject(error))
    })
  }

  function $patch<R = unknown, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<R>> {
    return new Promise((resolve, reject) => {
      $service()
        .patch<R>(url, data, config)
        .then((response) => resolve(response))
        .catch((error) => reject(error))
    })
  }

  return { $get, $delete, $post, $patch, $put }
}
