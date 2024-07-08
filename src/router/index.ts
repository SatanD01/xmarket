import { createRouter, createWebHistory } from 'vue-router'

import AuthRoutes from '@/modules/Auth/router'
import ChartRoutes from '@/modules/Charts/router'
import OfficeRoutes from '@/modules/Offices/router'
import Order from '@/modules/Order/router'
import ProductsRoutes from '@/modules/Products/router'
import ReplenishmentRoutes from '@/modules/Replenishment/router'
import TransferRoutes from '@/modules/Transfer/router'
import UserRoutes from '@/modules/UserController/router'
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
        ...UserRoutes,
        ...ProductsRoutes,
        ...ChartRoutes,
        ...ReplenishmentRoutes,
        ...Order,
        ...TransferRoutes,
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
