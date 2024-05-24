import { App } from 'vue'
import { pinia } from './pinia.ts'
import router from '../router'
import ElementPlus from 'element-plus'

import 'element-plus/dist/index.css'

export function registerPlugins(app: App): void {
  app.use(router).use(pinia)
  app.use(ElementPlus)
}
