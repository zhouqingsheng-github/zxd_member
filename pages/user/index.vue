<template>
  <view class="user-page">
    <!-- 状态栏背景 -->
    <view class="status-bar-bg">
      <image v-if="userInfo.vip === 1" class="bg-image" src="@/static/my/my_bj.png" mode="aspectFill"/>
      <image v-else class="bg-image" src="@/static/my/my-bj2.png" mode="aspectFill"/>
    </view>

    <!-- 头部区域 -->
    <view class="header">
      <uni-nav-bar backgroundColor="transparent" :fixed="true" :shadow="false" :border="false" status-bar
                   left-icon=" " left-text=" " title=" " class="custom-nav-bar" :isTransparent="true"/>
      <!-- 用户信息 -->
      <view class="user-info">
        <view class="avatar-container">
          <image class="user-avatar" :src="userInfo.avatar" mode="aspectFill"></image>
        </view>
        <view class="user-detail">
          <view class="user-name-row">
            <view class="user-name">{{ userInfo.nickname }}</view>
            <view class="user-vip" v-if="userInfo.vip === 1">
              <image class="user-vip-icon" src="/static/base/annual_member.png" mode="widthFix"></image>
            </view>
          </view>
          <view class="user-phone">{{ userInfo.phone }}</view>
        </view>
      </view>
    </view>

    <!-- 会员卡片 -->
    <view class="vip-card">
      <image class="vip-card-bg" src="@/static/my/vipcard.png" mode="widthFix"></image>
      <view class="vip-card-content">
        <view class="vip-card-left">
          <view class="vip-card-title">住小叮年度会员</view>
          <view class="validityPeriod" v-if="userInfo.vip===1">{{ formatDate(userInfo.validityPeriod) }}</view>
          <view class="vip-card-score-label">会员积分</view>
          <view class="vip-card-score">{{ userInfo.points || 0 }}</view>
        </view>
        <view class="vip-card-right" v-if="userInfo.vip !== 1" @click="activateVip">立即开通</view>
        <view class="vip-card-right" v-else @click="rightsAndInterests">查看权益</view>
      </view>
    </view>

    <!-- 功能导航区 -->
    <view class="function-nav">
      <view class="nav-item" v-for="(item, index) in navItems" :key="index" @click="navigateTo(item)">
        <image class="nav-icon" :src="item.icon" mode="aspectFit"></image>
        <view class="nav-text">{{ item.text }}</view>
      </view>
    </view>

    <u-popup :show="showGzhModal"
             :closeable="true"
             mode="bottom"
             @close="closeGzhModal" border-radius="20">
      <view style="padding: 40rpx; text-align: center;">
        <image
            src="https://www.zxd-hotel.xin/zxdhotel/icon/gzh_qrcode.png"
            style="width: 300rpx; height: 300rpx; display: block; margin: 0 auto;"
            mode="aspectFit"
            show-menu-by-longpress="true"
        />
        <view style="margin-top: 20rpx; font-size: 32rpx; color: #19191A;">长按识别关注公众号</view>
        <view style="margin-top: 10rpx; color: #888;">住小叮酒店</view>
      </view>
    </u-popup>

    <!-- 海报分享弹窗 -->
    <u-popup :show="showSharePoster" bg-color="transparent" mode="center" @close="closeSharePoster"
             :mask-close-able="false">
      <view class="poster-popup">
        <view class="poster-content">
          <button
              plain="true"
              class="poster-image share-button"
              open-type="share"></button>
        </view>
        <view class="poster-close" @click="closeSharePoster">
          <image class="close-icon" src="https://www.zxd-hotel.xin/zxdhotel/icon/popup_icon_close@2x.png"
                 mode="aspectFit"></image>
        </view>
      </view>
    </u-popup>

    <CustomTabbar :current="'account'"/>
  </view>
</template>

<script>
import CustomTabbar from "@/components/CustomTabbar.vue";
import uPopup from 'uview-ui/components/u-popup/u-popup.vue'
import uButton from 'uview-ui/components/u-button/u-button.vue'
import {activeItem, canUserShare, createShareRecord} from "../../common/api";
import {pageBack} from "../../common/redirect";

const tabBarPages = [
  '/pages/home/index',
  '/pages/order/index',
  '/pages/coupon/index',
  '/pages/user/index'
];

export default {
  components: {
    CustomTabbar,
    uPopup,
    uButton
  },
  async onPullDownRefresh() {
    this.refreshing = true;
    await this.initUserInfo();
    this.refreshing = false;
    uni.stopPullDownRefresh();
  },
  async onShareAppMessage(res) {
    try {
      const shareRes = await createShareRecord();
      const sharePath = `/pages/subPackages/user/share-receive?spread=${shareRes}`;
      return {
        title: '好友邀请您加入住小叮会员享受专属优惠和',
        path: sharePath,
        imageUrl: 'https://www.zxd-hotel.xin/zxdhotel/icon/yq@2x.png'
      };
    } catch (err) {
      console.error('分享记录创建失败', err);
    }
  },

  onShareTimeline() {
    return {
      title: '好友邀请您加入住小叮会员享受专属优惠和',
      query: '',
      imageUrl: 'https://www.zxd-hotel.xin/zxdhotel/icon/yq@2x.png'
    };
  },
  data() {
    return {
      showSharePoster: false,
      statusBarHeight: 20,
      userInfo: {
        avatar: '/static/my/default-avatar.png',
        nickname: '',
        phone: '',
        points: 0
      },
      unreadCount: 2,
      navItems: [], // 初始化为空数组
      showGzhModal: false,
      refreshing: false // 添加刷新状态
    }
  },
  onLoad() {
    uni.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#FFFFFF'
    });
    this.initNavItems();
  },
  onShow() {
    this.initUserInfo();
  },
  mounted() {
    this.getStatusBarHeight();
  },
  methods: {
    async initNavItems() {
      this.navItems = await activeItem();
      // 添加积分商城入口(如果后端菜单配置中没有)
      const hasPointsMall = this.navItems.some(item => item.action === 'pointsMall');
      if (!hasPointsMall) {
        this.navItems.unshift({
          icon: '/static/base/points_mall_icon_black.png',
          text: '积分商城',
          action: 'pointsMall',
          url: '/pages/subPackages/points/mall-index/mall-index'
        });
      }
    },
    formatDate(dateStr) {
      if (!dateStr) return '';
      const date = new Date(dateStr);
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      const year = date.getFullYear().toString();
      return `${year}.${month}.${day}到期`;
    },
    getStatusBarHeight() {
      // #ifdef APP-PLUS || MP-WEIXIN
      const systemInfo = uni.getSystemInfoSync();
      this.statusBarHeight = systemInfo.statusBarHeight;
      // #endif
    },
    async initUserInfo() {
      const userInfo = await uni.$u.http.get('/hotel-member/member/getInfo');
      if (userInfo) {
        this.userInfo = {
          ...this.userInfo,
          // avatar: userInfo.avatarUrl || this.userInfo.avatar,
          nickname: userInfo.nickname || this.userInfo.nickname,
          phone: userInfo.phoneNumber || this.userInfo.phoneNumber,
          vip: userInfo.vip || this.userInfo.vip,
          validityPeriod: userInfo.validityPeriod || this.userInfo.validityPeriod
        };
      }
    },
    back() {
      pageBack()
    },
    navigateTo(item) {
      if (item.action === 'gzh') {
        this.showGzhModal = true;
        return;
      }
      // 处理分享会员操作
      if (item.action === 'shareMember') {
        this.shareMember()
        return;
      }
      // 处理积分商城操作
      if (item.action === 'pointsMall') {
        uni.navigateTo({
          url: '/pages/subPackages/points/mall-index/mall-index'
        });
        return;
      }
      if (!item.url) return;
      if (item.externalLink === 1) {
        // #ifdef H5
        window.open(item.url, '_blank');
        // #endif
        // #ifdef MP-WEIXIN
        wx.navigateTo({
          url: `/pages/webview/webview?url=${encodeURIComponent(item.url)}`
        });
        // #endif
        return;
      }
      if (tabBarPages.includes(item.url)) {
        uni.switchTab({url: item.url});
      } else {
        uni.navigateTo({url: item.url});
      }
    },
    closeGzhModal() {
      this.showGzhModal = false;
    },
    activateVip() {
      uni.navigateTo({
        url: '/pages/subPackages/user/member-activate'
      });
    },
    rightsAndInterests() {
      uni.navigateTo({
        url: '/pages/subPackages/user/member-right'
      });
    },
    async shareMember() {
      try {
        const share = await canUserShare();
        if (share) {
          // 用户可以分享
          // #ifdef MP-WEIXIN
          // 微信小程序中显示分享海报弹窗
          this.showSharePoster = true;
          // #endif
        } else {
          // 用户不可分享，显示提示信息
          uni.showToast({
            title: '已达到最大分享次数限制',
            icon: 'none',
            duration: 2000
          });
        }
      } catch (e) {
        uni.showToast({
          title: `${e.error}`,
          icon: 'none',
          duration: 2000
        });
      }

      // #ifndef MP-WEIXIN
      uni.showToast({
        title: '请在微信小程序中使用分享功能',
        icon: 'none',
        duration: 2000
      });
      // #endif
    },
    closeSharePoster() {
      this.showSharePoster = false;
    }
  }
}
</script>

<style lang="scss" scoped>
/* 海报分享弹窗样式 */
.poster-popup {
  width: 562rpx;
  height: 752rpx;
  padding: 0;
  background-color: transparent;
  border-radius: 20rpx;
  text-align: center;
  position: relative;
  top: 60rpx;
}

.poster-content {
  position: relative;
  width: 100%;
  height: 694rpx;
  display: flex;
  justify-content: center;
  top: 0rpx;
}

.poster-image {
  width: 100%;
  height: 347rpx;
  background: transparent;
  background-image: url("https://www.zxd-hotel.xin/zxdhotel/icon/pop.png");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  border: none;
  outline: none;
  -webkit-appearance: none;
}

.poster-close {
  width: 50rpx;
  height: 50rpx;
  margin: 58rpx auto 0;
}

.close-icon {
  width: 100%;
  height: 100%;
}

.share-button {
  position: absolute;
  width: 562rpx;
  height: 694rpx;
  margin: auto;
  outline: none;
  background-color:transparent;
  color: transparent;
  cursor: pointer;
  display: block;
  font-size: 0;
  line-height: 0;
  overflow: hidden;
  padding: 0;
  text-align: center;
  text-decoration: none;
  z-index: 1;
}

wx-button {
  -webkit-tap-highlight-color: transparent;
  background-color: #f8f8f8;
  border-radius: 5px;
  box-sizing: border-box;
  color: #000;
  cursor: pointer;
  display: block;
  font-size: 18px;
  line-height: 2.55555556;
  margin-left: auto;
  margin-right: auto;
  overflow: hidden;
  padding-left: 14px;
  padding-right: 14px;
  position: relative;
  text-align: center;
  text-decoration: none;
}

.user-page {
  min-height: 100vh;
  background-color: #f5f5f5;
  position: relative;
}

.status-bar-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 460rpx;
  z-index: 1;
  overflow: hidden;
}

.bg-image {
  width: 100%;
  height: 100%;
}

/* 头部区域 */
.header {
  width: 100%;
  background-color: transparent;
  position: relative;
  z-index: 2;
}

/* 自定义导航栏样式 */
:deep(.custom-nav-bar) {
  background-color: transparent !important;
  background: transparent !important;

  .uni-nav-bar {
    background-color: transparent !important;
    background: transparent !important;
  }

  .uni-nav-bar__content {
    background-color: transparent !important;
    background: transparent !important;
  }

  .uni-nav-bar__content-title {
    background-color: transparent !important;
    background: transparent !important;
  }

  .uni-nav-bar__content-view {
    background-color: transparent !important;
    background: transparent !important;
  }

  .uni-nav-bar-text {
    color: #333 !important;
  }

  .uni-nav-bar-btn {
    color: #333 !important;
  }
}

/* 覆盖uni-app默认样式 */
:deep(.uni-navbar) {
  background-color: transparent !important;
  background: transparent !important;
}

:deep(.uni-navbar__content) {
  background-color: transparent !important;
  background: transparent !important;
}

:deep(.uni-navbar__content-title) {
  background-color: transparent !important;
  background: transparent !important;
}

:deep(.uni-navbar__content-view) {
  background-color: transparent !important;
  background: transparent !important;
}

/* 添加全局样式覆盖 */
:deep(.uni-navbar--fixed) {
  background-color: transparent !important;
  background: transparent !important;
}

:deep(.uni-navbar--shadow) {
  background-color: transparent !important;
  background: transparent !important;
}

/* 用户信息 */
.user-info {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  height: 120rpx;
  margin-top: 48rpx;
}

.avatar-container {
  margin-left: 28rpx;
  width: 120rpx;
  height: 120rpx;
  border-radius: 95rpx;
  overflow: hidden;
}

.user-avatar {
  width: 100%;
  height: 100%;
}

.user-detail {
  width: auto;
  height: 120rpx;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.user-name-row {
  display: flex;
  align-items: center;
  margin-left: 20rpx;
}

.user-name {
  width: auto;
  height: 36rpx;
  font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;
  font-weight: 500;
  font-size: 36rpx;
  color: #19191A;
  line-height: 36rpx;
  text-align: left;
  font-style: normal;
}

.user-vip {
  width: 128rpx;
  height: 32rpx;
  margin-left: 12rpx;
}

.user-vip-icon {
  width: 100%;
  height: 100%;
}

.user-phone {
  width: auto;
  height: 28rpx;
  font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;
  font-weight: 400;
  font-size: 28rpx;
  color: #19191A;
  line-height: 28rpx;
  text-align: left;
  font-style: normal;
  margin-top: 14rpx;
  margin-left: 20rpx;
}

/* 会员卡片 */
.member-card {
  margin: 30rpx 20rpx;
  background: linear-gradient(to right, #FFE8D3, #FFD8B0);
  border-radius: 20rpx;
  padding: 30rpx;
  position: relative;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
}

.card-content {
  display: flex;
  justify-content: space-between;
}

.card-title {
  font-size: 36rpx;
  font-weight: bold;
  color: #8B5A2B;
  margin-bottom: 30rpx;
}

.card-points {
  display: flex;
  flex-direction: column;
}

.points-label {
  font-size: 26rpx;
  color: #8B5A2B;
  margin-bottom: 10rpx;
}

.points-value {
  font-size: 60rpx;
  font-weight: bold;
  color: #8B5A2B;
}

.card-right {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.vip-icon {
  width: 120rpx;
  height: 120rpx;
  margin-bottom: 20rpx;
}

.activate-btn {
  background-color: #FFFFFF;
  border-radius: 40rpx;
  padding: 12rpx 40rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.activate-btn text {
  font-size: 28rpx;
  color: #B26B28;
  font-weight: bold;
}

/* 功能导航 */
.function-nav {
  margin: 22rpx 24rpx 0 24rpx;
  background: #FFFFFF;
  border-radius: 28rpx;
  display: flex;
  flex-wrap: wrap;
  padding-bottom: 20rpx;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 25%;
  padding: 32rpx 0;
  box-sizing: border-box;
  position: relative;
}

.nav-icon {
  width: 48rpx;
  height: 48rpx;
  margin-bottom: 16rpx;
}

.nav-text {
  width: auto;
  height: 28rpx;
  font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;
  font-weight: 400;
  font-size: 28rpx;
  color: #19191A;
  line-height: 28rpx;
  text-align: center;
  font-style: normal;
}

.nav-icon, .nav-text {
  pointer-events: none;
}

.vip-card {
  background: transparent;
  width: 721.15rpx;
  height: 365.27rpx;
  position: relative;
  left: 28rpx;
  top: -10rpx;
  border-radius: 28rpx;
  overflow: hidden;
  box-shadow: 0 8rpx 24rpx rgba(255, 186, 120, 0.15);
  z-index: 9;
}

.vip-card-bg {
  position: absolute;
  left: 0;
  width: 694rpx;
  height: 100%;
  z-index: 1;
}

.vip-card-content {
  position: relative;
  z-index: 2;
  display: flex;
  height: 100%;
  align-items: center;
  justify-content: space-between;
  padding: 0 40rpx;
}

.vip-card-left {
  width: 342rpx;
  height: 100%;
  position: absolute;
  top: 46rpx;
  left: 40rpx;
}

.vip-card-title {
  width: auto;
  height: 40rpx;
  font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;
  font-weight: 600;
  font-size: 40rpx;
  color: #9B421E;
  line-height: 40rpx;
  text-align: left;
  font-style: normal;
  position: absolute;
  top: 40rpx;
}

.validityPeriod {
  width: auto;
  height: 24rpx;
  font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;
  font-weight: 400;
  font-size: 24rpx;
  color: #9B421E;
  line-height: 24rpx;
  text-align: left;
  font-style: normal;
  position: absolute;
  top: 100rpx;
}

.vip-card-score-label {
  width: 96rpx;
  height: 24rpx;
  font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;
  font-weight: 400;
  font-size: 24rpx;
  color: #9B421E;
  line-height: 24rpx;
  text-align: left;
  font-style: normal;
  position: absolute;
  top: 178rpx;
}

.vip-card-score {
  height: 52rpx;
  font-family: Roboto, Roboto;
  font-weight: 500;
  font-size: 52rpx;
  color: #9B421E;
  line-height: 52rpx;
  text-align: left;
  font-style: normal;
  position: absolute;
  top: 214rpx;
  left: 2rpx
}

.vip-card-right {
  width: 160rpx;
  height: 72rpx;
  background: #FFEAB9;
  border-radius: 36rpx;
  position: absolute;
  top: 236rpx;
  right: 68rpx;
  font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;
  font-weight: 500;
  font-size: 28rpx;
  color: #9B421E;
  line-height: 72rpx;
  text-align: center;
  font-style: normal;
}
</style>