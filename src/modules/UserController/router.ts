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
    path: '/users-edit/:id',
    name: 'UsersEdit',
    component: () => import('@/modules/UserController/pages/PSettingsView.vue'),
    meta: {
      layout: 'empty',
      roles: ['Admin'],
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
  {
    path: '/customers-list',
    name: 'PCustomers',
    component: () => import('@/modules/UserController/pages/PCustomers.vue'),
    meta: {
      layout: 'empty',
      roles: ['Admin', 'Manager', 'Salesman'],
    },
  },
]

export default routes
