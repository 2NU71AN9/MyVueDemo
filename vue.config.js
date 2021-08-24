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
                    // config.plugins['html'].tap(args => {
                    //     args[0].isProd = true
                    //     return args
                    // })
            })
            // 为开发环境配置打包入口
        config.when(process.env.NODE_ENV === 'development', config => {
            config.entry('app').clear().add('./src/main.js')
                // config.plugins['html'].tap(args => {
                //     args[0].isProd = false
                //     return args
                // })
        })
    }
}