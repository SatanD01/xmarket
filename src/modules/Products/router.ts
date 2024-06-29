import { RouteRecordRaw } from 'vue-router'

const routes: Readonly<RouteRecordRaw[]> = [
  {
    path: '/products',
    name: 'Products',
    component: () => import('@/modules/Products/pages/PCreateProducts.vue'),
    meta: {
      layout: 'empty',
    },
  },
]

export default routes
