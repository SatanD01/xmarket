import { RouteRecordRaw } from 'vue-router'

const routes: Readonly<RouteRecordRaw[]> = [
  {
    path: '/replenishment',
    name: 'Replenishment',
    component: () => import('@/modules/Replenishment/pages/PReplenishment.vue'),
    meta: {
      layout: 'empty',
      roles: ['Admin', 'Manager'],
    },
  },
]

export default routes
