<template>
  <view class="share-receive-page">
    <!-- 顶部导航栏 -->
    <uni-nav-bar
        backgroundColor="#fff"
        :fixed="true"
        :shadow="false"
        :border="false"
        status-bar
        left-icon="left"
        left-text=" "
        class="custom-nav-bar"
        @clickLeft="goToHome">
      <template #default>
        <text :style="{color: navBarTitleColor}" class="custom-navbar-title">邀约体验会员
        </text>
      </template>
    </uni-nav-bar>
    <view class="sticky-header">
      <view class="header-section"
            style="background-image: url('https://www.zxd-hotel.xin/zxdhotel/icon/qyld@2x.png'); background-size: cover; background-position: center;">
      </view>

      <view class="header-section-2">
        <image class="member-card-bj" src="/static/base/equityTitle@2x.png" mode="widthFix"/>
      </view>
    </view>

    <scroll-view class="main-content" scroll-y :style="{height: scrollViewHeight + 'px'}">
      <view class="rights-list">
        <view class="right-item" v-for="(item, index) in rightsList" :key="index">
            <image class="right-icon" :src="item.icon" mode="aspectFit"/>
            <view class="title-content">
              <view class="title">{{ item.title }}</view>
              <view class="description">{{ item.description }}</view>
            </view>
        </view>
        <view class="right-item right-item-1">
        </view>
      </view>
    </scroll-view>

    <!-- 固定在底部的领取按钮 -->
    <view class="cta-section fixed-bottom">
      <view class="receive-btn disabled-btn" v-if="isItAvailable">立即领取会员</view>
      <view class="receive-btn" v-else @click="receiveMembership">立即领取会员</view>
    </view>

    <!-- 登录弹窗 -->
    <u-popup :show="showLoginPopup" mode="bottom" @close="closeLoginPopup" border-radius="20" height="auto">
      <view class="login-popup">
        <view class="popup-title">领取会员权益</view>
        <view class="popup-subtitle">请先登录/注册账户</view>
        <view class="login-options">
          <button class="login-btn phone-login" @click="goToLogin">
            去登录
          </button>
        </view>
        <view class="popup-cancel" @click="closeLoginPopup">取消</view>
      </view>
    </u-popup>
  </view>
</template>

<script>
import {getUserInfo, setUserInfo} from "@/store";
import {rightsList, getShareDetail, claimShare, memberOrder} from "@/common/api";
import UniNavBar from "../../../uni_modules/uni-nav-bar/components/uni-nav-bar/uni-nav-bar.vue";
import UPopup from "../../../uni_modules/uview-ui/components/u-popup/u-popup.vue"; // 导入获取会员权益的API

export default {
  components: {
    UPopup,
    UniNavBar
  },
  data() {
    return {
      hasLogin: false,
      showLoginPopup: false,
      inviter: null,
      rightsList: [], // 从后端获取的权益列表
      spread: '', // 保存传递的spread参数
      receiving: false, // 防止重复点击
      isItAvailable: false, // 是否可领取
      scrollViewHeight: 0, // 滚动区域高度
    };
  },
  onLoad(options) {
    uni.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#FFFFFF'
    });
    // 检查用户是否已登录
    const userInfo = getUserInfo();
    this.hasLogin = !!userInfo;
    // 获取邀请人信息（如果有）
    if (options.inviter) {
      this.inviter = options.inviter;
    }
    // 设置页面标题
    uni.setNavigationBarTitle({
      title: '会员领取'
    });
    if (options.spread) {
      this.spread = options.spread; // 保存spread参数
      // 获取分享数据
      this.shareDataInfo(userInfo?.id, this.spread);
    }
    // 获取会员权益数据
    this.fetchRightsList();
  },
  onReady() {
    // 页面渲染完成后计算滚动区域高度
    this.$nextTick(() => {
      this.calculateScrollViewHeight();
    });
  },
  methods: {
    goToHome() {
      uni.switchTab({url: '/pages/home/index'});
    },
    async shareDataInfo(userId, spread) {
      if (this.receiving) return;
      this.receiving = true;
      try {
        const res = await getShareDetail(spread);
        this.isItAvailable = userId === res.shareUserId;
        if (res.status === 3) {
          this.isItAvailable = true;
          uni.showToast({
            title: '该分享已失效',
            icon: 'none'
          });
          return;
        }
        if (res.status === 2) {
          this.isItAvailable = true;
          uni.showToast({
            title: '该分享已领取',
            icon: 'none'
          });
          return;
        }
        // 如果是自己的分享，可以做一些特殊处理
        if (this.isItAvailable) {
          uni.showToast({
            title: '这是您自己的分享链接',
            icon: 'none'
          });
          return;
        }
      } catch (error) {
        console.error('获取分享详情异常:', error);
      }
    },
    // 获取会员权益列表
    async fetchRightsList() {
      try {
        this.rightsList = await rightsList()
      } catch (error) {
        console.error('获取会员权益列表失败:', error);
        // 出错时使用默认数据
        this.useDefaultRightsList();
      }
    },
    // 领取会员
    async receiveMembership() {
      if (!this.hasLogin) {
        this.showLoginPopup = true;
        return;
      }
      // 显示加载提示
      uni.showLoading({
        title: '正在领取...'
      });
      try {
        const orderNo = await claimShare(this.spread);
        if (orderNo) {
          // 领取成功
          uni.showToast({
            title: '领取成功',
            icon: 'success'
          });
          uni.showLoading({
            title: '正在跳转'
          });
          // 轮询检查订单状态，因为微信支付成功回调可能有延迟
          let retryCount = 0;
          const maxRetries = 10;
          const checkOrderStatus = async () => {
            try {
              const res2 = await memberOrder(orderNo);
              if (res2.status === 1) {
                uni.hideLoading();
                uni.redirectTo({
                  url: `/pages/subPackages/user/member-success?openingTime=${res2.openingTime}&validityPeriod=${res2.validityPeriod}&remark=${encodeURIComponent(this.memberPriceConfig?.remark || '')}&description=${encodeURIComponent(this.memberPriceConfig?.description || '')}`
                });
                return true;
              } else if (retryCount < maxRetries) {
                retryCount++;
                // 等待1秒后再次尝试
                await new Promise(resolve => setTimeout(resolve, 1000));
                return await checkOrderStatus();
              } else {
                uni.hideLoading();
                uni.showToast({
                  title: '支付结果确认超时，请稍后查看会员状态',
                  icon: 'none',
                  duration: 3000
                });
                return false;
              }
            } catch (error) {
              console.error('查询订单状态异常:', error);
              if (retryCount < maxRetries) {
                retryCount++;
                await new Promise(resolve => setTimeout(resolve, 1000));
                return await checkOrderStatus();
              } else {
                uni.hideLoading();
                uni.showToast({
                  title: '查询支付结果失败，请稍后查看会员状态',
                  icon: 'none',
                  duration: 3000
                });
                return false;
              }
            }
          };
          // 开始检查订单状态
          const result = await checkOrderStatus();
          if (result) return; // 如果成功直接返回，不执行下面的代码
        }
        // 处理领取失败的情况
        uni.showToast({
          title: res.message || '领取失败',
          icon: 'none'
        });
      } catch (error) {
        uni.showToast({
          title: error.error,
          icon: 'none'
        });
      }
    },

    // 前往登录页面
    goToLogin() {
      uni.navigateTo({
        url: '/pages/subPackages/user/login',
        redirectUrl: `/pages/subPackages/user/share-receive?spread=${this.spread}`,
        params: {
          spread: this.spread,
          business: 'member'
        }
      });
    },
    // 关闭登录弹窗
    closeLoginPopup() {
      this.showLoginPopup = false;
    },
    // 计算滚动区域高度
    calculateScrollViewHeight() {
      const query = uni.createSelectorQuery().in(this);
      // 获取导航栏高度
      query.select('.custom-nav-bar').boundingClientRect();
      // 获取头部区域高度
      query.select('.sticky-header').boundingClientRect();
      // 获取底部按钮区域高度
      query.select('.fixed-bottom').boundingClientRect();
          
      query.exec((res) => {
        if (res && res.length === 3) {
          const navBarHeight = res[0].height || 0;
          const headerHeight = res[1].height || 0;
          const footerHeight = res[2].height || 0;
              
          // 计算滚动区域高度 = 视窗高度 - 导航栏高度 - 头部高度 - 底部高度
          const scrollViewHeight = uni.getSystemInfoSync().windowHeight - navBarHeight - headerHeight - footerHeight;
          this.scrollViewHeight = scrollViewHeight;
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.member-card-bj {
  width: 332rpx;
  height: 46rpx;
  margin: auto;
  padding-top: 52rpx;
  z-index: 1;
  pointer-events: none;
  display: block;
}
.custom-navbar-title {
  width: 100%;
  height: 100rpx;
  font-family: PingFangSC, PingFang SC,serif;
  font-weight: 500;
  font-size: 32rpx;
  color: #19191A;
  line-height: 100rpx;
  text-align: center;
  font-style: normal;
}
.share-receive-page {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: white;
  overflow: hidden;
}

.sticky-header {
  position: sticky;
  top: 0;
  z-index: 10;
  flex-shrink: 0;
}

.header-section {
  text-align: center;
  height: 442rpx;
  background-color: #f5f5f5;
}

.header-section-2{
  background: white;
  width: 100%;
  height: 108rpx;
}

.main-content {
  flex: 1;
  background: #FFFFFF;
  border-radius: 20rpx;
  margin-bottom: 30rpx;
}

.right-item {
  height: 160rpx;
  background: #F6F6F6;
  border-radius: 28rpx;
  margin: 20rpx 56rpx 0 56rpx;
  position: relative;
}
.right-item-1{
  height: 80rpx;
  background: transparent!important;
}

.right-icon {
  width: 56rpx;
  height: 56rpx;
  margin-top: 52rpx;
  margin-left: 40rpx;
}

.right-info {
  flex: 1;
}

.right-title {
  font-size: 32rpx;
  font-weight: 500;
  color: #333333;
  margin-bottom: 10rpx;
}

.right-desc {
  font-size: 24rpx;
  color: #999999;
}

.cta-section {
  text-align: center;
}

.fixed-bottom {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20rpx;
  padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
  background-color: #fff;
  z-index: 100;
  flex-shrink: 0;
}

.receive-btn {
  margin: auto;
  text-align: center;
  width: 80%;
  height: 88rpx;
  line-height: 88rpx;
  background-color: #FF6600;
  border-radius: 44rpx;
  color: white;
  font-size: 32rpx;
  font-weight: bold;
  border: none;
}

.disabled-btn {
  background-color: #cccccc;
}

.login-tip {
  margin-top: 30rpx;
  font-size: 28rpx;
  color: #999;
}

.login-link {
  color: #FF9A9E;
  font-weight: bold;
}

.login-popup {
  padding: 40rpx;
  text-align: center;
}

.popup-title {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 16rpx;
}

.popup-subtitle {
  font-size: 28rpx;
  color: #999;
  margin-bottom: 40rpx;
}

.login-options {
  margin-bottom: 30rpx;
}

.login-btn {
  width: 100%;
  height: 80rpx;
  border-radius: 40rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28rpx;
  margin-bottom: 20rpx;
  border: none;
  padding: 10rpx 20rpx;
}

.phone-login {
  background-color: #FF6600;
  color: #fff;
}

.wx-login {
  background-color: #07C160;
  color: #fff;
}

.login-icon {
  width: 40rpx;
  height: 40rpx;
  margin-right: 20rpx;
}

.popup-cancel {
  padding: 20rpx;
  color: #999;
  font-size: 28rpx;
}

.custom-nav-bar {
  background-color: #FF6600 !important;
}

.search-button {
  background-color: #FF6600;
  color: white;
}

.title-content{
  margin-left: 130rpx;
  margin-right: 38rpx;
  position: absolute;
  top: 26rpx;
}

.title-content .title{
  width: auto;
  height: 28rpx;
  font-family: PingFangSC, PingFang SC,serif;
  font-weight: 500;
  font-size: 28rpx;
  color: #19191A;
  line-height: 28rpx;
  text-align: left;
  font-style: normal;
}

.title-content .description{
  width: 472rpx;
  height: 64rpx;
  font-family: PingFangSC, PingFang SC,serif;
  font-weight: 400;
  font-size: 24rpx;
  color: #6D7278;
  line-height: 32rpx;
  text-align: left;
  font-style: normal;
  margin-top: 16rpx;
}
.orange-text {
  color: #FF6600;
}

.right-item:last-child {
  border: none;
}

.right-info {
  flex: 1;
}

.right-title {
  font-size: 32rpx;
  font-weight: 500;
  color: #333333;
  margin-bottom: 10rpx;
}

.right-desc {
  font-size: 24rpx;
  color: #999999;
}
</style>
