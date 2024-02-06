import { createApp } from 'vue'
import App from './App.vue'
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/dist/vuetify.min.css'
import '././assets/css/roboto-font-face.css'
//import {vuetify} from './plugins/vuetify'
import vuetifyPlugin from './plugins/vuetifyPlugin'
import {electronPluggin} from './plugins/electronPluggin'

const app = createApp(App)
app.use(vuetifyPlugin)
app.use(electronPluggin)
//app.use(createPinia())
//app.use(router)
//app.use(VueQueryPlugin)
app.mount('#app')

