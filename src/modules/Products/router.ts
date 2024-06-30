import { RouteRecordRaw } from 'vue-router'

const routes: Readonly<RouteRecordRaw[]> = [
  {
    path: '/products',
    name: 'Products',
    component: () => import('@/modules/Products/pages/PProducts.vue'),
    meta: {
      layout: 'empty',
    },
  },
  {
    path: '/create-product',
    name: 'CreateProduct',
    component: () => import('@/modules/Products/pages/PCreateProducts.vue'),
    meta: {
      layout: 'empty',
    },
  },
]

export default routes
