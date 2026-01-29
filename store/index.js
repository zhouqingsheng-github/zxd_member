// 全局状态管理
const state = {
    // 用户信息
    userInfo: null,
    // token
    token: null
}

// 初始化状态
const initState = () => {
    const token = uni.getStorageSync('token')
    const userInfo = uni.getStorageSync('userInfo')
    // 确保 token 和 userInfo 同时存在或同时不存在
    if (token && userInfo) {
        state.token = token
        state.userInfo = userInfo
    } else {
        state.token = null
        state.userInfo = null
        // 清理可能存在的单个数据
        uni.removeStorageSync('token')
        uni.removeStorageSync('userInfo')
    }
}

// 初始化
initState()

// 获取token
export const getToken = () => {
    // 如果内存中没有，尝试从 Storage 获取
    if (!state.token) {
        const token = uni.getStorageSync('token')
        const userInfo = uni.getStorageSync('userInfo')
        // 确保 token 和 userInfo 同时存在
        if (token && userInfo) {
            state.token = token
            state.userInfo = userInfo
        } else {
            // 如果不同步，清理所有数据
            state.token = null
            state.userInfo = null
            uni.removeStorageSync('token')
            uni.removeStorageSync('userInfo')
        }
    }
    return state.token
}

// 获取用户信息
export const getUserInfo = () => {
    // 如果内存中没有，尝试从 Storage 获取
    if (!state.userInfo) {
        const token = uni.getStorageSync('token')
        const userInfo = uni.getStorageSync('userInfo')
        // 确保 token 和 userInfo 同时存在
        if (token && userInfo) {
            state.token = token
            state.userInfo = userInfo
        } else {
            // 如果不同步，清理所有数据
            state.token = null
            state.userInfo = null
            uni.removeStorageSync('token')
            uni.removeStorageSync('userInfo')
        }
    }
    return state.userInfo
}

// 设置token
export const setToken = (token) => {
    // 如果设置 token 为 null，同时清除 userInfo
    if (!token) {
        clearUserInfo()
        return
    }
    state.token = token
    uni.setStorageSync('token', token)
}

// 设置用户信息
export const setUserInfo = (userInfo) => {
    // 如果设置 userInfo 为 null，同时清除 token
    if (!userInfo) {
        clearUserInfo()
        return
    }
    state.userInfo = userInfo
    uni.setStorageSync('userInfo', userInfo)
}

// 清除用户信息
export const clearUserInfo = () => {
    state.userInfo = null
    state.token = null
    uni.removeStorageSync('token')
    uni.removeStorageSync('userInfo')
}

// 检查登录状态
export const checkLogin = () => {
    const token = getToken()
    const userInfo = getUserInfo()
    return !!(token && userInfo)
}

// 自动登录
export const autoLogin = async () => {
    const token = getToken()
    if (!token) return false

    try {
        // 验证token有效性并获取用户信息
        const userInfo = await uni.$u.http.get('/hotel-member/member/getInfo')
        if (userInfo) {
            setUserInfo(userInfo)
            return true
        }
        console.warn('自动登录时未能获取到用户信息，但未发生网络错误。')
        return false
    } catch (error) {
        console.error('自动登录请求失败:', error)
        return false
    }
}

export default state