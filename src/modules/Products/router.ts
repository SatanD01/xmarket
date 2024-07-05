import { RouteRecordRaw } from 'vue-router'

const routes: Readonly<RouteRecordRaw[]> = [
  {
    path: '/index',
    name: 'Products',
    component: () => import('@/modules/Products/pages/PProducts.vue'),
    meta: {
      layout: 'empty',
      roles: ['Admin', 'Manager', 'Salesman'],
    },
  },
  {
    path: '/create-product',
    name: 'CreateProduct',
    component: () => import('@/modules/Products/pages/PCreateProducts.vue'),
    meta: {
      layout: 'empty',
      roles: ['Admin', 'Manager', 'Salesman'],
    },
  },
  {
    path: '/check-product',
    name: 'CheckProduct',
    component: () => import('@/modules/Products/pages/PCheckProduct.vue'),
    meta: {
      layout: 'empty',
      roles: ['Admin', 'Manager', 'Salesman'],
    },
  },
]

export default routes
