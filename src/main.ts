import './style.css'
import 'vue3-toastify/dist/index.css'
import 'vue3-easy-data-table/dist/style.css'

import { createApp } from 'vue'
import Vue3EasyDataTable from 'vue3-easy-data-table'
import Vue3Toastify from 'vue3-toastify'

import App from './App.vue'
import { registerPlugins } from './plugins'

const app = createApp(App)
registerPlugins(app)
app.use(Vue3Toastify, {
  autoClose: 3000,
})
app.use('EasyDataTable', Vue3EasyDataTable)
app.mount('#app')
