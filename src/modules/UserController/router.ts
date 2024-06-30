import { RouteRecordRaw } from 'vue-router'

const routes: Readonly<RouteRecordRaw[]> = [
  {
    path: '/users',
    name: 'Users',
    component: () => import('@/modules/UserController/pages/PIndex.vue'),
    meta: {
      layout: 'empty',
      roles: ['Admin'],
    },
  },
  {
    path: '/create-user',
    name: 'CreateUser',
    component: () => import('@/modules/UserController/pages/PCreateUser.vue'),
    meta: {
      layout: 'empty',
      roles: ['Admin'],
    },
  },
  {
    path: '/admin-settings',
    name: 'PSettings',
    component: () => import('@/modules/UserController/pages/PSettingsView.vue'),
    meta: {
      layout: 'empty',
      roles: ['Admin'],
    },
  },
]

export default routes
