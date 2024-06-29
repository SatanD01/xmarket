import 'element-plus/dist/index.css'

import ElementPlus from 'element-plus'
import { App } from 'vue'

import router from '../router'
import { pinia } from './pinia.ts'

export function registerPlugins(app: App): void {
  app.use(router).use(pinia)
  app.use(ElementPlus)
}
