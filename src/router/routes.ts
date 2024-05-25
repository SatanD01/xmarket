import { RouteRecordRaw } from 'vue-router'

export default [
  {
    path: '/',
    component: () => import('@/layouts/LDefault.vue'),
    children: [
      {
        path: '/',
        name: 'Dashboard',
        component: () => import('@/pages/PIndex.vue'),
      },
      {
        path: '/cart',
        name: 'PCart',
        component: () => import('@/pages/PCartView.vue'),
      },
      {
        path: '/create-office',
        name: 'PCreateOffice',
        component: () => import('@/pages/PCreateOffice.vue'),
      },
      {
        path: '/chart',
        name: 'PCharts',
        component: () => import('@/pages/PChartsView.vue'),
      },
      {
        path: '/create-order',
        name: 'PCreateOrder',
        component: () => import('@/pages/PCreateOrder.vue'),
      },
      {
        path: '/create-goods',
        name: 'PCreateGoods',
        component: () => import('@/pages/PCreateGoods.vue'),
      },
      {
        path: '/office-list',
        name: 'POfficesView',
        component: () => import('@/pages/POfficesView.vue'),
      },
    ],
  },
] as RouteRecordRaw[]
