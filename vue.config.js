module.exports = {
    lintOnSave: false,
    chainWebpack: config => {
        // 为生产环境配置打包入口
        config.when(process.env.NODE_ENV === 'production', config => {
                config.entry('app').clear().add('./src/main.js')
                config.set('externals', {
                    vue: 'Vue',
                    'vue-router': 'VueRouter',
                    axios: 'axios',
                    lodash: '_',
                    echarts: 'echarts',
                    nprogress: 'NProgress',
                    'vue-quill-editor': VueQuillEditor,
                })
            })
            // 为开发环境配置打包入口
        config.when(process.env.NODE_ENV === 'development', config => {
            config.entry('app').clear().add('./src/main.js')
        })
    }
}