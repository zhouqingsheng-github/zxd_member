// 环境配置
const env = {
    development: {
        baseUrl: 'http://localhost:8080', // 开发环境
        // baseUrl: 'https://www.zxd-hotel.xin/api', // test环境
        // baseUrl: 'https://zxd-hotel.xin/api', // 生产环境
        env: 'development'
    },
    production: {
        baseUrl: 'https://zxd-hotel.xin/api', // 生产环境（修复：添加 /api 路径）
        env: 'production'
    }
}

// 导出配置
module.exports = {
    ...env[process.env.NODE_ENV]
}