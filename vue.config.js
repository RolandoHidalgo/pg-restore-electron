module.exports = {
  lintOnSave: false,

  transpileDependencies: [
    'vuetify'
  ],
  pluginOptions: {
    electronBuilder: {
      preload: 'src/preload.js',
      builderOptions: {
        extraResources: ['src', 'src/res/'],
      }
    },
  },
};



