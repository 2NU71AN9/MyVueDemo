import axios from 'axios'
import api from './api'
import NProgress from 'nprogress'
// import 'nprogress/nprogress.css'

const instance = axios.create({
    baseURL: api.baseURL,
    withCredentials: false,
    headers: {
        'content-type': 'application/json;charset=UTF-8'
    }
})

// 添加请求拦截器
instance.interceptors.request.use(config => {
    NProgress.start()
    config.headers.Authorization = window.sessionStorage.getItem('token')
    return config
}, error => {
    // 请求错误处理
    return Promise.reject(error)
})

// 添加响应拦截器
instance.interceptors.response.use(response => {
    NProgress.done()
    const { data } = response
    return response
}, error => {
    NProgress.done()
    let info = {}
    const { status, statusText, data } = error.response
    if (!error.response) {
        info = {
            code: 5000,
            msg: 'Network Error'
        }
    } else {
        // 此处整理错误信息格式
        info = {
            code: status,
            data: data,
            msg: statusText
        }
    }
    return Promise.reject(info)
})

export default instance