import Vue from 'vue'
import App from './App.vue'
//import router from './router'
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/dist/vuetify.min.css'
import './core/bootstrapping/roboto-font-face.css'
import {vuetify} from './plugins/vuetify'
import {electronPluggin} from "@/electronPluggin";

Vue.config.productionTip = false;
Vue.use(electronPluggin);
new Vue({
    vuetify,
    render: h => h(App)
}).$mount('#app')
