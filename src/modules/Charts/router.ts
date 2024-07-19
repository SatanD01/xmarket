import { RouteRecordRaw } from 'vue-router'

const routes: Readonly<RouteRecordRaw[]> = [
  {
    path: '/chart',
    name: 'Chart',
    component: () => import('@/modules/Charts/pages/PChartsView.vue'),
    meta: {
      layout: 'empty',
      roles: ['Admin'],
    },
  },
]

export default routes
