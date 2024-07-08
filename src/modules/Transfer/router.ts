import { RouteRecordRaw } from 'vue-router'

const routes: Readonly<RouteRecordRaw[]> = [
  {
    path: '/transfer-goods',
    name: 'TransferGoods',
    component: () => import('@/modules/Transfer/pages/PIndex.vue'),
    meta: {
      layout: 'empty',
      roles: ['Admin', 'Manager', 'Salesman'],
    },
  },
]

export default routes
