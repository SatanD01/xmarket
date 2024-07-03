import { RouteRecordRaw } from 'vue-router'

const routes: Readonly<RouteRecordRaw[]> = [
  {
    path: '/create-order',
    name: 'PCreateOrder',
    component: () => import('@/modules/Order/pages/PCreateOrder.vue'),
    meta: {
      layout: 'empty',
      roles: ['Admin', 'Manager', 'Salesman'],
    },
  },
]

export default routes
