module.exports = {
    lintOnSave: false,

    transpileDependencies: [
        'vuetify'
    ],
    pluginOptions: {
        electronBuilder: {
            preload: 'src/preload.js',
            customFileProtocol: './',
            builderOptions: {
                // options placed here will be merged with default configuration and passed to electron-builder

                appId: "pg-restore",
                icon:"icon.ico",
                win: {
                    icon:"icon.ico",
                    target: [
                        "nsis"
                    ]
                },
                nsis: {
                    oneClick: true,
                    installerIcon: "icon.ico",
                    uninstallerIcon: "icon.ico",
                    license: "license.md",
                    uninstallDisplayName: "pg-restore"
                }

            }
        },
    },
};



