/**
 * plugins/vuetifyPlugin.ts
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import '@mdi/font/css/materialdesignicons.css'
//import 'material-symbols/outlined.css';
//import {aliases, matSymb} from "@/core/iconset/materialSymbols";
import 'vuetify/styles'

// Composables
import {createVuetify} from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import {md3} from 'vuetify/blueprints'
import {es} from 'vuetify/locale'



md3.theme.themes.light.colors = {
    background: '#f6f8fc',
    surface: '#fff',
    primary: '#0856cf',
    tertiary: "#735471",
    'secondary-container': '#c2e7ff',
    //'primary-darken-1': '#3700B3',
    secondary: '#00639b',
    //'secondary-darken-1': '#018786',
    error: '#ba1a1a'

}

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({

    // icons: {
    //     defaultSet: 'matSymb',
    //     aliases,
    //     sets: { matSymb
    //     },
    // },
    defaults: {
        global: {
            ripple: false
        }
    },
    locale: {
        locale: 'es',
        fallback: 'es',
        messages: {es},
    },
    components,
    directives,
    blueprint: md3,

})
