import { getToken, autoLogin, clearUserInfo } from '@/store/index.js'
import { setRedirectInfo } from './redirect.js'

/**
 * 检查用户是否已登录
 * @returns {boolean} 是否已登录
 */
export const isLoggedIn = () => {
    return !!getToken();
};

/**
 * 处理需要登录的操作
 * @param {Object} options 选项
 * @param {string} options.url 当前页面URL
 * @param {Object} options.params 当前页面参数
 * @param {string} options.registerChannel 注册渠道（探探糖、WIFI二维码等）
 * @param {number} options.hotelId 酒店ID
 * @param {Function} options.success 登录成功后的回调
 * @param {Function} options.fail 登录失败的回调
 */
export const handleLoginRequired = async (options) => {
    if (isLoggedIn()) {
        // 如果本地有token，进一步验证token有效性
        const isValid = await autoLogin();
        if (isValid) {
            // Token有效，执行成功回调
            options.success && options.success();
            return;
        }
        // Token无效，清除用户信息，继续执行登录流程
        clearUserInfo();
    }

    // 保存当前页面信息，包括注册渠道和酒店ID
    setRedirectInfo({
        url: options.url,
        params: options.params,
        type: 'page',
        registerChannel: options.registerChannel,
        hotelId: options.hotelId
    });
    // 跳转到登录页面
    await uni.navigateTo({
        url: '/pages/subPackages/user/login'
    });
}; 