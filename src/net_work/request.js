import axios from "axios"
import api from './api'

let instance = axios.create({
    headers: {
        "content-type": "application/json;charset=UTF-8"
    }
})
instance.defaults.baseURL = api.baseURL
instance.defaults.withCredentials = true

export default instance