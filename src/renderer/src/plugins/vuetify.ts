import Vue from "vue";
// import VuetifyTransitions from 'vuetify/lib/components/transitions'
// import VApp from '@vuetify/components/VApp'
import Vuetify from "vuetify/lib/framework";
// import VuetifyDirectives from 'vuetify/es5/directives'
import colors from 'vuetify/lib/util/colors'

Vue.use(Vuetify);
const vuetify = new Vuetify({
    icons: {
        iconfont: 'mdi'
    },

    components: {

        Vuetify
    },
    // directives: VuetifyDirectives,
    theme: {

        themes: {
            light: {
                accent: colors.pink.base,
                primary: colors.blue.darken2
            },
            dark:{

                accent: colors.pink.base,
                primary: colors.blue.darken2
            }
        }
    },
    // transitions: VuetifyTransitions
});
export {
    vuetify
}

