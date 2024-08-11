import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import "element-plus/theme-chalk/el-loading.css";
import "element-plus/theme-chalk/el-message.css";
import "element-plus/theme-chalk/el-notification.css";
import "element-plus/theme-chalk/el-message-box.css";

import App from './App.vue'
import router from './router'
import '@/assets/main.scss'
import "@/utils/tailwindcss.css"
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
const app = createApp(App)

app.use(createPinia())
app.use(router)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.mount('#app')
