import { computed } from 'vue'

// import { useLayoutStore } from '@/layouts/store.ts'
import { useAuthStore } from '@/modules/Auth/store'

export async function checkRouteIsExist(to) {
  const token = localStorage.getItem('token')
  const authStore = useAuthStore()
  // const layoutStore = useLayoutStore()
  const loggedIn = computed(() => authStore.loggedIn)
  if (['404', '403', '500'].includes((to.name || '').toString())) {
    return true
  }
  try {
    if (token && !loggedIn.value) {
      await authStore.fetchUser().catch((e) => console.log(e))
    }
  } catch (e) {
    console.log(e)
  }

  return true
}
