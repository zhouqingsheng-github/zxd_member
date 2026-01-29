<script>
import {
  autoLogin,
} from './store/index.js'
import {
  setupRouteInterceptor,
  whiteList
} from '@/util/permission.js'

export default {
  onLaunch: async function () {
    // 设置路由拦截器
    setupRouteInterceptor()
    // 尝试自动登录
    let loginResult = await autoLogin()
    // 获取当前页面栈
    const pages = getCurrentPages()
    const currentPage = pages[pages.length - 1]
    const currentRoute = currentPage ? currentPage.route : ''
    // 在开发者工具中直接打开页面时，不进行跳转
    if (process.env.NODE_ENV === 'development' && !currentRoute) {
      return
    }
    
    // 使用统一的白名单，注意路径格式匹配（whiteList中的路径以/开头）
    const currentPagePath = '/' + currentRoute
    const shouldStayOnCurrentPage = whiteList.includes(currentPagePath) || 
                                   (loginResult && currentRoute !== '')
    // 只有在需要跳转的情况下才执行跳转
    if (!shouldStayOnCurrentPage) {
      // 首次访问或需要跳转时才进入首页
      await uni.reLaunch({
        url: '/pages/home/index'
      })
    }
  },
  onShow: function () {
    // 每次显示时也设置背景色和文字样式
    if (process.env.UNI_PLATFORM === 'mp-weixin') {
      wx.setBackgroundColor({
        backgroundColor: '#F3F4F6',
        backgroundColorTop: '#F3F4F6',
        backgroundColorBottom: '#F3F4F6'
      })
      wx.setBackgroundTextStyle({
        textStyle: 'dark'
      })
    }
  },
  onHide: function () {
  }
}
</script>

<style lang="scss">
/*每个页面公共css */
@import "@/uni_modules/uview-ui/index.scss";
@import "common/demo.scss";

/* 强制使用浅色主题 */
page {
  background-color: #F3F4F6 !important;
  color: #19191A !important;
  /* 跨平台字体设置 - 解决 Android 字体显示问题 */
  font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", 
               "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", 
               "微软雅黑", Arial, sans-serif;
}

/* 覆盖微信小程序的夜间模式 */
::v-deep .wx-root {
  background-color: #F3F4F6 !important;
  color: #19191A !important;
}

/* 输入框样式覆盖 */
::v-deep input {
  background-color: transparent !important;
  color: #19191A !important;
}

::v-deep input::placeholder {
  color: #A2A2A8 !important;
}

/* 搜索框样式覆盖 */
::v-deep .search-content {
  background-color: #F3F7FA !important;
}

::v-deep .search-input {
  color: #19191A !important;
}

::v-deep .search-input::placeholder {
  color: #A2A2A8 !important;
}
</style>