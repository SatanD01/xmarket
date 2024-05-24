import { RouteRecordRaw } from 'vue-router'

export default [
  {
    path: '/',
    component: () => import('@/layouts/LDefault.vue'),
    children: [
      {
        path: '/',
        name: 'Dashboard',
        component: () => import('@/pages/PIndex.vue'),
      },
      {
        path: '/cart',
        name: 'PCart',
        component: () => import('@/pages/PCartView.vue'),
      },
    ],
  },
] as RouteRecordRaw[]
