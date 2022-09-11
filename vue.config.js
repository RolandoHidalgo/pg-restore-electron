module.exports = {
  lintOnSave: false,

  transpileDependencies: [
    'vuetify'
  ],
  pluginOptions: {
    electronBuilder: {
      preload: 'src/preload.js'
    },
  },
};



