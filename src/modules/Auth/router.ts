import { RouteRecordRaw } from 'vue-router'

const routes: Readonly<RouteRecordRaw[]> = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/modules/Auth/pages/PLogin.vue'),
    meta: {
      layout: 'empty',
      roles: ['Admin', 'Manager', 'Salesman'],
    },
  },
]

export default routes
