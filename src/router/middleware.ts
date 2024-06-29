import { computed } from 'vue'

// import { useLayoutStore } from '@/layouts/store.ts'
import { useAuthStore } from '@/modules/Auth/store'

export async function checkRouteIsExist(to) {
  const token = localStorage.getItem('token')
  const authStore = useAuthStore()
  // const layoutStore = useLayoutStore()
  const authRoutes = ['Login']
  const loggedIn = computed(() => authStore.loggedIn)
  if (['404', '403', '500'].includes((to.name || '').toString())) {
    return true
  }
  if (!authRoutes.includes(to.name) && !token) {
    return { name: 'Login' }
  } else if (token && !loggedIn.value) {
    try {
      await authStore.fetchUser()
      if (loggedIn.value && authRoutes.includes(to.name)) {
        return { name: 'Dashboard' }
      }
    } catch (e) {
      localStorage.removeItem('token')
      return { name: 'Login' }
    }
  } else {
    return true
  }

  return true
}
