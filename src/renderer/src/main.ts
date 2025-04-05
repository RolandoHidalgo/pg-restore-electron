import { createApp } from 'vue'
import App from './App.vue'
import '././assets/index.css'
import { createPinia } from 'pinia'
import {electronPluggin} from './plugins/electronPluggin'

const pinia = createPinia()
const app = createApp(App)
app.use(electronPluggin)
app.use(pinia)
app.mount('#app')

