import { RouteRecordRaw } from 'vue-router'

const routes: Readonly<RouteRecordRaw[]> = [
  {
    path: '/create-goods',
    name: 'Products',
    component: () => import('@/modules/Products/pages/PCreateProducts.vue'),
    meta: {
      layout: 'empty',
    },
  },
  {
    path: '/create-order',
    name: 'CreateOrder',
    component: () => import('@/modules/Products/pages/PCreateOrder.vue'),
    meta: {
      layout: 'empty',
    },
  },
]

export default routes
