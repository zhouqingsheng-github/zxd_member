<template>
  <view
      class="tabbar"
      :style="{
      paddingBottom: safeAreaInsetBottomPx + 'rpx'
    }"
  >
    <view
        v-for="(item, index) in tabList"
        :key="item.name"
        :class="['tabbar-item', current === item.name ? 'active' : '', 
                 item.name === 'home' && current === 'home' && showBackToTop ? 'back-to-top' : '']"
        @click="handleTabClick(item.name, item.pagePath)"
    >
      <image
          class="tabbar-icon"
          :class="{'back-to-top-icon': item.name === 'home' && current === 'home' && showBackToTop}"
          :src="getIconPath(item)"
          mode="widthFix"
      />
      <text class="tabbar-text" v-if="!(item.name === 'home' && current === 'home' && showBackToTop)">{{ item.text }}</text>
    </view>
  </view>
</template>

<script>
export default {
  name: 'CustomTabbar',
  props: {
    current: {
      type: String,
      default: 'home'
    },
    showBackToTop: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      tabList: [
        {
          name: 'home',
          text: '首页',
          pagePath: '/pages/home/index',
          iconPath: '/static/tabbar/home.png',
          selectedIconPath: '/static/tabbar/home_selected.png',
          backToTopIconPath: 'https://zxd-hotel.xin/zxdhotel/2025/06/03/home_top.png',
          backToTopSelectedIconPath: 'https://zxd-hotel.xin/zxdhotel/2025/06/03/home_top_selected.png'
        },
        {
          name: 'order',
          text: '订单',
          pagePath: '/pages/order/index',
          iconPath: '/static/tabbar/order.png',
          selectedIconPath: '/static/tabbar/order_selected.png'
        },
        {
          name: 'coupon',
          text: '红包',
          pagePath: '/pages/coupon/index',
          iconPath: '/static/tabbar/coupon.png',
          selectedIconPath: '/static/tabbar/coupon_selected.png'
        },
        {
          name: 'account',
          text: '我的',
          pagePath: '/pages/user/index',
          iconPath: '/static/tabbar/mine.png',
          selectedIconPath: '/static/tabbar/mine_selected.png'
        }
      ],
      safeAreaInsetBottomPx: 0
    }
  },
  created() {
    // #ifdef MP-WEIXIN
    const sysInfo = uni.getSystemInfoSync();
    // safeAreaInsets 仅在微信小程序基础库2.10.0及以上支持
    if (sysInfo.safeAreaInsets && typeof sysInfo.safeAreaInsets.bottom === 'number') {
      // 换算成rpx（假设屏幕宽度750rpx）
      const px = sysInfo.safeAreaInsets.bottom;
      const screenWidth = sysInfo.screenWidth;
      this.safeAreaInsetBottomPx = Math.round(px * 750 / screenWidth);
    } else {
      this.safeAreaInsetBottomPx = 0;
    }
    // #endif
  },
  beforeDestroy() {
    // 移除事件监听
    uni.$off('tabbarChanged');
  },
  methods: {
    handleTabClick(name, path) {
      if (name === 'home' && this.current === 'home' && this.showBackToTop) {
        // 如果在首页且已经滚动，则触发回到顶部
        this.$emit('backToTop');
      } else if (this.current !== name) {
        // 使用 reLaunch 重新加载页面
        uni.reLaunch({
          url: path
        });
      }
    },
    getIconPath(item) {
      if (item.name === 'home' && this.current === 'home' && this.showBackToTop) {
        return item.backToTopSelectedIconPath;
      }
      return this.current === item.name ? item.selectedIconPath : item.iconPath;
    }
  }
}
</script>

<style scoped>
.tabbar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  height: 100rpx; /* 固定高度 */
  background: #fff;
  display: flex;
  justify-content: space-around;
  align-items: center;
  z-index: 999;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.03);
}

.tabbar-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #D1D1D1;
  font-size: 24rpx;
  flex: 1;
  justify-content: center;
  padding: 10rpx 0 0 0;
}

.tabbar-item.active {
  color: #ED781F;
}

.tabbar-item.back-to-top {
  padding: 0;
}

.tabbar-icon {
  width: 36rpx;
  height: 36rpx;
  margin-bottom: 6rpx;
}

.back-to-top-icon {
  width: 60rpx;
  height: 60rpx;
  margin-bottom: 0;
}

.tabbar-text {
  width: auto;
  height: 26rpx;
  font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;
  font-weight: 400;
  font-size: 26rpx;
  line-height: 26rpx;
  text-align: center;
  font-style: normal;
  margin-top: 10rpx;
}
</style>