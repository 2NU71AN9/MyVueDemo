import Vue from 'vue'
import Moment from 'moment'
import App from './App.vue'
import router from './router'
import store from './store'
import request from './net_work/request'
import './plugins/element.js'
import './assets/css/global.css'
import TreeTable from 'vue-table-with-tree-grid'

Vue.config.productionTip = false

Vue.prototype.$http = request

Vue.component('tree-table', TreeTable)
Vue.filter('formatDate', function(value) {
    return Moment(value).format('YYYY-MM-DD HH:mm:ss')
})

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')