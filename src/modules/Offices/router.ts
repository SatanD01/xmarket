import { RouteRecordRaw } from 'vue-router'

const routes: Readonly<RouteRecordRaw[]> = [
  {
    path: '/offices',
    name: 'Offices',
    component: () => import('@/modules/Offices/pages/PListOffice.vue'),
    meta: {
      layout: 'empty',
    },
  },
]

export default routes
