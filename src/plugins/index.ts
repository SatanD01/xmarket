import 'element-plus/dist/index.css'

import ElementPlus from 'element-plus'
import ru from 'element-plus/es/locale/lang/ru'
import { App } from 'vue'

import router from '../router'
import { pinia } from './pinia.ts'

export function registerPlugins(app: App): void {
  app.use(router).use(pinia)
  app.use(ElementPlus, {
    locale: ru,
  })
}
