import { RouteRecordRaw } from 'vue-router'

const routes: Readonly<RouteRecordRaw[]> = [
  {
    path: '/offices',
    name: 'Offices',
    component: () => import('@/modules/Offices/pages/PListOffice.vue'),
    meta: {
      layout: 'empty',
      roles: ['Admin', 'Manager', 'Salesman'],
    },
  },
  {
    path: '/create-office',
    name: 'CreateOffice',
    component: () => import('@/modules/Offices/pages/PCreateOffice.vue'),
    meta: {
      layout: 'empty',
      roles: ['Admin', 'Manager', 'Salesman'],
    },
  },
]

export default routes
