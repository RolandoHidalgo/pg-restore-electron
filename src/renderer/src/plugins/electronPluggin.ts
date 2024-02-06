export const electronPluggin = {
    install: (app, options) => {
        //@ts-ignore
        app.config.globalProperties.$electron = window.electron;
    }
};
