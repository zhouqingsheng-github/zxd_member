/**
 * 响应拦截
 * @param {Object} http
 */
module.exports = (vm) => {
    uni.$u.http.interceptors.response.use((response) => {
        uni.hideLoading()
        const custom = response.config?.custom
        if (response.data.code == "401") {
            uni.removeStorageSync('token')
            uni.showToast({
                title: '请先登录',
                icon: 'none',
                duration: 2000,
                complete: () => {
                    uni.showToast({
                        title: '未授权，请重新登录',
                        icon: 'none',
                        duration: 2000
                    })
                    uni.navigateTo({
                        url: '/pages/subPackages/user/login'
                    })
                }
            })
        }
        if (response.data.code == "403") {
            uni.showToast({
                title: '没有权限访问',
                icon: 'none',
                duration: 2000
            })
            return Promise.reject(new Error('没有权限访问'))
        }
        if (response.data.code != "200") {
            if (custom.toast && custom.toast !== false) {
                uni.showToast({
                    type: false,
                    title: response.data.error || response.data.msg,
                    icon: 'none',
                    duration: 3000
                })
            }
            if (custom?.catch) {
                return Promise.reject(response.data)
            } else {
                return Promise.reject(response.data);
            }
        }
        return response.data.data !== false ? response.data.data || {} : false
    }, (response) => {
        /*  对响应错误做点什么 （statusCode !== 200）*/
        return Promise.reject(response)
    })
}