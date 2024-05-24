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
    ],
  },
] as RouteRecordRaw[]
