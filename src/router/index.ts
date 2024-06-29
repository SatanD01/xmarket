import { createRouter, createWebHistory } from 'vue-router'

import AuthRoutes from '@/modules/Auth/router'
import OfficeRoutes from '@/modules/Offices/router'
import { checkRouteIsExist } from '@/router/middleware'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Dashboard',
      component: () => import('@/layouts/LDefault.vue'),
      meta: {
        layout: 'default',
      },
      children: [...OfficeRoutes],
    },
    ...AuthRoutes,
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('@/pages/PError.vue'),
    },
  ],
})

router.beforeEach(checkRouteIsExist)

export default router
