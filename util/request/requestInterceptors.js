import {
    getToken
} from '@/store/index.js'

/**
 * 请求拦截
 * @param {Object} http
 */
module.exports = (vm) => {
    uni.$u.http.interceptors.request.use((config) => {
        config.data = config.data || {}
        const token = getToken();
        config.header = {
            ...config.header,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
        if (token) {
            config.header['Authorization'] = `Bearer ${token}`
        }
        return config
    }, (config) => {
        return Promise.reject(config)
    })
}