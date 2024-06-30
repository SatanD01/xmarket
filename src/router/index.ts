import { createRouter, createWebHistory } from 'vue-router'

import AuthRoutes from '@/modules/Auth/router'
import ChartRoutes from '@/modules/Charts/router'
import OfficeRoutes from '@/modules/Offices/router'
import ProductsRoutes from '@/modules/Products/router'
import UserController from '@/modules/UserController/router'
import { checkRouteIsExist } from '@/router/middleware'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/index',
      name: 'Dashboard',
      component: () => import('@/layouts/LDefault.vue'),
      meta: {
        layout: 'default',
      },
      children: [
        ...OfficeRoutes,
        ...UserController,
        ...ProductsRoutes,
        ...ChartRoutes,
      ],
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
