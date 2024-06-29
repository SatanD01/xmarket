import { createRouter, createWebHistory } from 'vue-router'

import AuthRoutes from '@/modules/Auth/router'
import { checkRouteIsExist } from '@/router/middleware.ts'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import('@/layouts/LDefault.vue'),
      children: [],
    },
    ...AuthRoutes,
  ],
})

router.beforeEach(checkRouteIsExist)

export default router
