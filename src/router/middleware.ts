import { computed } from 'vue'

// import { useLayoutStore } from '@/layouts/store.ts'
import { useAuthStore } from '@/modules/Auth/store'

export async function checkRouteIsExist(to) {
  const store = useAuthStore()
  const token = store.getTokens()
  const user = computed(() => store.user)
  if (['404', '403', '500'].includes((to.name || '').toString())) {
    return true
  }
  if (!token && to.name !== 'Login') return { name: 'Login' }
  if (token && !user.value) {
    await store.fetchUser()
  }
  return true
}
