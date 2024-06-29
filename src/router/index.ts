import { createRouter, createWebHistory } from 'vue-router'

import AuthRoutes from '@/modules/Auth/router'
import Charts from '@/modules/Charts/router'
import OfficeRoutes from '@/modules/Offices/router'
import Products from '@/modules/Products/router'
import UserController from '@/modules/UserController/router'
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
      children: [...OfficeRoutes, ...UserController, ...Products, ...Charts],
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
