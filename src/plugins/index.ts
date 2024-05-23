import { App } from "vue"
import { pinia } from "./pinia.ts"
import router from "../router"

export function registerPlugins(app: App): void {
  app.use(router).use(pinia)
}
