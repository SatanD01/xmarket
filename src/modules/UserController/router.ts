import { RouteRecordRaw } from 'vue-router'

const routes: Readonly<RouteRecordRaw[]> = [
  {
    path: '/create-user',
    name: 'PCreateUser',
    component: () => import('@/modules/UserController/pages/PCreateUser.vue'),
    meta: {
      layout: 'empty',
      roles: ['Admin', 'Manager', 'Salesman'],
    },
  },
  {
    path: '/admin-settings',
    name: 'PSettings',
    component: () => import('@/modules/UserController/pages/PSettingsView.vue'),
    meta: {
      layout: 'empty',
      roles: ['Admin', 'Manager', 'Salesman'],
    },
  },
  {
    path: '/suppliers-list',
    name: 'PSuppliers',
    component: () => import('@/modules/UserController/pages/PSuppliers.vue'),
    meta: {
      layout: 'empty',
      roles: ['Admin', 'Manager'],
    },
  },
]

export default routes
