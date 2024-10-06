import { createApp } from 'vue'
import App from './App.vue'
//import '@fontsource/geist-sans/100.css';
//import '@fontsource/geist-sans/400.css';
import '././assets/global.css'
import '././assets/index.css'

import {electronPluggin} from './plugins/electronPluggin'


const app = createApp(App)
app.use(electronPluggin)
app.mount('#app')

