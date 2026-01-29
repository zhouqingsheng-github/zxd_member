const path = require('path')

module.exports = {
	devServer: {
		port: 8081,
		host: '0.0.0.0',
		// proxy: {
		// 	'/api': {
		// 		target: 'http：//39.105.55.212:8080',
		// 		changeOrigin: true,
		// 		pathRewrite: {
		// 			'^/api': ''  // 去掉 /api 前缀
		// 		},
		// 		secure: false,
		// 		ws: true,
		// 		headers: {
		// 			'Access-Control-Allow-Origin': '*'
		// 		}
		// 	}
		// }
	},
	// 配置路径别名
	configureWebpack: {
		devServer: {
			disableHostCheck: true
		},
		resolve: {
			alias: {
				'@': path.resolve(__dirname, './'),
				'@components': path.resolve(__dirname, './components'),
				'@pages': path.resolve(__dirname, './pages'),
				'@store': path.resolve(__dirname, './store')
			}
		}
	}
}