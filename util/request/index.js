import config from '@/common/config'
uni.$u.http.setConfig((defaultConfig) => {
    defaultConfig.baseURL = config.baseUrl
    return defaultConfig
})

module.exports = (vm) => {
    require('./requestInterceptors')(vm)
    require('./responseInterceptors')(vm)
}
