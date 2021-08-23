import Vue from 'vue'
import Moment from 'moment'
import App from './App.vue'
import router from './router'
import store from './store'
import request from './net_work/request'
import './plugins/element.js'
import './assets/css/global.css'
import TreeTable from 'vue-table-with-tree-grid'

import VueQuillEditor from 'vue-quill-editor'
// import 'quill/dist/quill.core.css' // import styles
// import 'quill/dist/quill.snow.css' // for snow theme
// import 'quill/dist/quill.bubble.css' // for bubble theme

Vue.config.productionTip = false
Vue.prototype.$http = request
Vue.use(VueQuillEditor)
Vue.component('tree-table', TreeTable)
Vue.filter('formatDate', function(value) {
    return Moment(value).format('YYYY-MM-DD HH:mm:ss')
})

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')