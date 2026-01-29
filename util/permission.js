import {
    checkLogin
} from '@/store/index.js'
import {setRedirectInfo} from '@/common/redirect.js'
import {getUserInfo, setUserInfo} from "../store";

export const whiteList = [
    '/pages/subPackages/user/login',
    '/pages/home/index',
    '/pages/subPackages/user/phone-login',
    '/pages/subPackages/home/search/index',
    '/pages/subPackages/home/detail',
    '/pages/subPackages/home/search-result/index',
    '/pages/subPackages/coupon/receive',
    '/pages/subPackages/coupon/receive-success',
    '/pages/subPackages/home/city-select/index',
    '/pages/subPackages/user/member-activate',
    '/pages/subPackages/agreement/*',
    '/pages/subPackages/home/photoAlbum',
    '/pages/subPackages/user/member-right',
    '/pages/subPackages/coupon/receiving-center',
    'pages/subPackages/order/three_detail',
    '/pages/subPackages/richText/richText',
    '/pages/subPackages/richText/richText',
    '/pages/subPackages/questionnaire/submit',
    '/pages/subPackages/questionnaire/detail',
    '/pages/subPackages/wifi/index'
]

export const routeInterceptor = async (options) => {
    const url = options.url.split('?')[0]
    const isInWhiteList = whiteList.some(whitePath => {
        if (whitePath.includes('*')) {
            const pattern = whitePath.replace('*', '.*')
            return new RegExp(`^${pattern}$`).test(url)
        }
        return whitePath === url
    })
    if (isInWhiteList) {
        return true
    }
    if (!checkLogin()) {
        return false;
    } else {
        const userInfo = getUserInfo();
        if (userInfo) {
            const userInfo = await uni.$u.http.get('/hotel-member/member/getInfo');
            setUserInfo(userInfo);
        }
        return true
    }
}

export const setupRouteInterceptor = () => {
    const originalNavigateTo = uni.navigateTo
    uni.navigateTo = async (options) => {
        if (await routeInterceptor(options) && !options.redirectUrl) {
            await originalNavigateTo(options)
        } else {
            await handleLoginExpiration(options);
        }
    }
    const originalRedirectTo = uni.redirectTo
    uni.redirectTo = async (options) => {
        if (await routeInterceptor(options) && !options.redirectUrl) {
            await originalRedirectTo(options)
        } else {
            await handleLoginExpiration(options);
        }
    }
    const originalReLaunch = uni.reLaunch
    uni.reLaunch = async (options) => {
        if (await routeInterceptor(options) && !options.redirectUrl) {
            await originalReLaunch(options)
        } else {
            await handleLoginExpiration(options);
        }
    }
    const originalSwitchTab = uni.switchTab
    uni.switchTab = async (options) => {
        if (await routeInterceptor(options) && !options.redirectUrl) {
            await originalSwitchTab(options)
        } else {
            await handleLoginExpiration(options);
        }
    }
    const handleLoginExpiration = async (options) => {
        if (!checkLogin()) {
            const [error, res] = await uni.showModal({
                title: '提示',
                content: '为了保障您的账号安全，请先登录再继续操作',
                showCancel: true,
                confirmText: '确定',
                cancelText: '取消'
            });
            if (!error && res.confirm) {
                const oldUrl = (options.redirectUrl ? options.redirectUrl : options.url)
                const url = oldUrl.split('?')[0]
                const params = options.params || {}
                if (oldUrl.includes('?')) {
                    const queryString = oldUrl.split('?')[1]
                    const queryParams = queryString.split('&')
                    queryParams.forEach(param => {
                        const [key, value] = param.split('=')
                        params[key] = decodeURIComponent(value)
                    })
                }
                await setRedirectInfo({
                    url: url,
                    params: params,
                    type: 'page'
                })
                await uni.navigateTo({
                    url: '/pages/subPackages/user/login'
                });
            }
        } else {
            const oldUrl = (options.redirectUrl ? options.redirectUrl : options.url)
            const url = oldUrl.split('?')[0]
            const params = options.params || {}
            if (oldUrl.includes('?')) {
                const queryString = oldUrl.split('?')[1]
                const queryParams = queryString.split('&')
                queryParams.forEach(param => {
                    const [key, value] = param.split('=')
                    params[key] = decodeURIComponent(value)
                })
            }
            await setRedirectInfo({
                url: url,
                params: params,
                type: 'page'
            })
            await uni.navigateTo({
                url: '/pages/subPackages/user/login'
            });
        }

    }

}