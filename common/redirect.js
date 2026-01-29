// 重定向管理工具

// 存储重定向信息
import {checkLogin} from "../store";

const REDIRECT_KEY = 'redirectInfo';

// tabbar页面列表
const TABBAR_PAGES = [
    '/pages/home/index',
    '/pages/order/index',
    '/pages/user/index',
    '/pages/coupon/index'
];

/**
 * 设置重定向信息
 * @param {Object} options 重定向选项
 * @param {string} options.url 重定向的URL
 * @param {Object} options.params 重定向的参数
 * @param {string} options.type 重定向类型（'page' | 'coupon'）
 * @param {string} options.registerChannel 注册渠道（探探糖、WIFI二维码等）
 * @param {number} options.hotelId 酒店ID
 */
export const setRedirectInfo = (options) => {
    const redirectInfo = {
        url: options.url,
        params: options.params || {},
        type: options.type || 'page',
        registerChannel: options.registerChannel || null,
        hotelId: options.hotelId || null,
        timestamp: Date.now()
    };
    uni.setStorageSync(REDIRECT_KEY, redirectInfo);
};

/**
 * 获取重定向信息
 * @returns {Object|null} 重定向信息
 */
export const getRedirectInfo = () => {
    try {
        const redirectInfo = uni.getStorageSync(REDIRECT_KEY);
        if (!redirectInfo) {
            return null;
        }
        
        // 检查是否过期（10分钟有效期）
        const now = Date.now();
        const expireTime = 10 * 60 * 1000; // 10分钟
        if (now - redirectInfo.timestamp > expireTime) {
            // 已过期，清除并返回null
            clearRedirectInfo();
            return null;
        }
        
        return redirectInfo;
    } catch (e) {
        return null;
    }
};

/**
 * 清除重定向信息
 */
export const clearRedirectInfo = () => {
    try {
        uni.removeStorageSync(REDIRECT_KEY);
    } catch (e) {
        console.error('清除重定向信息失败:', e);
    }
};

/**
 * 处理重定向
 * @returns {boolean} 是否进行了重定向
 */
export const handleRedirect = async () => {
    const redirectInfo = getRedirectInfo();
    if (!redirectInfo) {
        // 如果没有重定向，则跳转到首页
        await uni.switchTab({url: "/pages/home/index"});
        return true;
    }
    clearRedirectInfo();
    // 根据类型处理不同的重定向
    if (redirectInfo.type === 'coupon') {
        // 处理优惠券重定向
        if (redirectInfo.params.spread) {
            uni.setStorageSync('autoReceiveCoupon', true);
            await uni.redirectTo({
                url: `/pages/subPackages/coupon/receive?spread=${redirectInfo.params.spread}`
            });
        }
    } else {
        // 处理普通页面重定向
        const queryString = Object.entries(redirectInfo.params)
            .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
            .join('&');
        const url = queryString ? `${redirectInfo.url}?${queryString}` : redirectInfo.url;
        // 检查是否是tabbar页面
        const isTabbarPage = ['/pages/home/index', '/pages/order/index', '/pages/coupon/index', '/pages/user/index'].some(page => url.startsWith(page));
        if (isTabbarPage) {
            // 如果是tabbar页面，使用reLaunch跳转以避免过渡效果
            await uni.switchTab({
                url: url
            });
            return
        } else {
            // 非tabbar页面使用redirectTo跳转
            await uni.redirectTo({url: url});
            return
        }
    }
    return true;
};

const frontPage = '/pages/home/index';

const isLoginPage = (route) => {
    if (!route) return false;
    const loginPagePatterns = [
        'pages/subPackages/user/login',
        'pages/subPackages/user/phone-login',
    ];
    return loginPagePatterns.some(pattern => route.includes(pattern));
}

export const pageBack = async () => {
    const pages = getCurrentPages();
    if (!pages || !Array.isArray(pages) || pages.length === 0) {
        await uni.reLaunch({url: frontPage});
        return;
    }
    if (pages.length < 2) {
        await uni.reLaunch({url: frontPage});
        return;
    }
    
    // 对页面栈进行去重，移除相同路径的重复页面，只保留最新的一个
    const uniquePages = [];
    const routeMap = new Map();
    
    // 从后往前遍历，保证保留的是最新的页面
    for (let i = pages.length - 1; i >= 0; i--) {
        const page = pages[i];
        const route = page.route || '';
        
        // 如果该路径还没有记录，则添加到uniquePages中
        if (!routeMap.has(route)) {
            routeMap.set(route, true);
            uniquePages.unshift(page); // 添加到数组开头以保持正确顺序
        }
    }
    
    // 如果去重后页面数量小于2，则回到首页
    if (uniquePages.length < 2) {
        await uni.reLaunch({url: frontPage});
        return;
    }
    
    const prevPage = uniquePages[uniquePages.length - 2];
    if (!prevPage) {
        await uni.reLaunch({url: frontPage});
        return;
    }
    const prevPageRoute = prevPage.route || '';
    // 判断上一页是否是登录页
    const isPrevPageLogin = isLoginPage(prevPageRoute);
    // 获取登录状态
    const isLoggedIn = checkLogin();
    if (isPrevPageLogin && isLoggedIn) {
        await uni.reLaunch({
            url: frontPage
        });
    } else {
        // 计算需要返回的步数
        const prevPageIndex = pages.findIndex((page, index) => index < pages.length - 1 && page.route === prevPageRoute);
        const delta = pages.length - 1 - prevPageIndex;
        
        // 否则正常返回
        uni.navigateBack({delta});
    }
}