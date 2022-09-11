export const electronPluggin = {
    install: function (Vue: any) {
        //@ts-ignore
        Vue.prototype.$electron = window.versions;
    }
};
