<template>
  <view class="page-container">
    <uni-nav-bar
        :shadow="false"
        :border="false"
        :fixed="true"
        left-icon="left"
        status-bar
        @clickLeft="goBack">
      <template #default>
        <text class="nav-title">试睡官招募</text>
      </template>
    </uni-nav-bar>

    <view class="image-wrapper">
      <image
          :src="bannerUrl"
          mode="widthFix"
          class="fullscreen-image"
      />
    </view>

    <!-- 底部按钮 -->
    <view class="bottom-fixed">
      <view
          class="bottom-btn"
          :class="{ 'disabled': countdown > 0 }"
          @click="goToSubmit">
        {{ countdown > 0 ? `${countdown}秒后可报名` : '点击报名' }}
      </view>
    </view>
  </view>
</template>

<script>
import {pageBack} from '@/common/redirect';

export default {
  data() {
    return {
      bannerUrl: `https://www.zxd-hotel.xin/zxdhotel/icon/shui2.png`,
      countdown: 5,
      timer: null
    };
  },

  onLoad() {
    // 设置状态栏为黑色
    uni.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#FFFFFF'
    });

    // 启动倒计时
    this.startCountdown();
  },

  onUnload() {
    // 清除定时器
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  },

  methods: {
    goBack() {
      pageBack();
    },

    // 启动倒计时
    startCountdown() {
      this.timer = setInterval(() => {
        if (this.countdown > 0) {
          this.countdown--;
        } else {
          clearInterval(this.timer);
          this.timer = null;
        }
      }, 1000);
    },

    // 跳转到报名页面
    goToSubmit() {
      // 倒计时未结束时不允许点击
      if (this.countdown > 0) {
        return;
      }

      const url = '/pages/subPackages/questionnaire/detail';
      uni.navigateTo({
        url: url
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.page-container {
  height: 100vh;
  background: #FFAD52;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.nav-title {
  width: 100%;
  font-weight: 500;
  font-size: 32rpx;
  color: #19191A;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
}

.image-wrapper {
  width: 100%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.fullscreen-image {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
}

.bottom-fixed {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  padding: 40rpx 0;
  padding-bottom: calc(40rpx + env(safe-area-inset-bottom));
  background: transparent;
  z-index: 100;
}

.bottom-btn {
  width: 420rpx;
  height: 100rpx;
  background: linear-gradient(135deg, #C8FF00 0%, #9FE600 100%);
  border-radius: 50rpx;
  font-size: 44rpx;
  color: #000000;
  font-weight: 900;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 12rpx 32rpx rgba(159, 230, 0, 0.5);
  transition: all 0.3s ease;
  letter-spacing: 4rpx;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    inset: 6rpx;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0) 100%);
    border-radius: 44rpx;
    pointer-events: none;
  }

  &.disabled {
    background: linear-gradient(135deg, #D9D9D9 0%, #BFBFBF 100%);
    box-shadow: 0 8rpx 20rpx rgba(0, 0, 0, 0.15);
    color: #666666;

    &::before {
      display: none;
    }
  }

  &:active:not(.disabled) {
    transform: scale(0.95);
    box-shadow: 0 8rpx 24rpx rgba(159, 230, 0, 0.4);
  }
}
</style>
