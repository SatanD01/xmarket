import { RouteRecordRaw } from 'vue-router'

const routes: Readonly<RouteRecordRaw[]> = [
  {
    path: '/auth',
    name: 'Login',
    component: () => import('@/modules/Auth/pages/PLogin.vue'),
    meta: {
      layout: 'empty',
    },
  },
]

export default routes
