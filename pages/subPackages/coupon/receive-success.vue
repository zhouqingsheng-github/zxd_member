<template>
  <view class="receive-page">
    <uni-nav-bar
        backgroundColor="transparent"
        :shadow="false"
        :border="false"
        status-bar
        left-icon="left"
        @clickLeft="back"
    >
      <template #default>
        <text class="nav-title">来自好友的分享</text>
      </template>
    </uni-nav-bar>
    <view class="content">
      <image class="bg-image" src="https://zxd-hotel.xin/zxdhotel/2025/06/03/red_success_20250603225319A003.png"
             mode="aspectFit"/>
      <view class="title">恭喜您领取成功</view>
      <view class="tips">可前往「我的红包」查看</view>
      <view class="receive-btn" @click="toHome">浏览酒店</view>
      <view class="share-btn" @click="myRed">我的红包</view>
    </view>
  </view>
</template>

<script>
import {pageBack} from "../../../common/redirect";

export default {
  data() {
    return {}
  },
  onLoad(options) {
    uni.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#FFFFFF'
    });
  },
  methods: {
    back() {
      pageBack()
    },
    toHome() {
      uni.switchTab({
        url: "/pages/home/index"
      })
    },
    myRed() {
      uni.switchTab({
        url: "/pages/coupon/index"
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.receive-page {
  background: #FFF;
  min-height: 100vh;
  position: relative;
  overflow: hidden;

  .nav-title {
    width: 100%;
    font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;
    font-weight: 500;
    font-size: 32rpx;
    color: #19191A;
    text-align: center;
    font-style: normal;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 88rpx;
  }

  .content {
    text-align: center;

    .bg-image {
      width: 264rpx;
      height: 200rpx;
      margin-top: 32rpx;
    }

    .title {
      height: 40rpx;
      font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;
      font-weight: 500;
      font-size: 40rpx;
      color: #19191A;
      line-height: 40rpx;
      text-align: center;
      font-style: normal;
      margin-top: 28rpx;
    }

    .tips {
      height: 28rpx;
      font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;
      font-weight: 400;
      font-size: 28rpx;
      color: #19191A;
      line-height: 28rpx;
      text-align: center;
      font-style: normal;
      margin-top: 20rpx;
    }

    .receive-btn {
      margin: 80rpx 58rpx 0 58rpx;
      height: 92rpx;
      background: #EE781F;
      border-radius: 50rpx;
      font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;
      font-weight: 500;
      font-size: 32rpx;
      color: #FFFFFF;
      line-height: 92rpx;
      text-align: center;
      font-style: normal;
      position: relative;
      overflow: visible;
    }

    .share-btn {
      margin: 28rpx 58rpx 0 58rpx;
      height: 92rpx;
      background: #FFFFFF;
      border-radius: 50rpx;
      font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;
      font-weight: 500;
      font-size: 32rpx;
      color: #EE781F;
      line-height: 92rpx;
      text-align: center;
      font-style: normal;
      position: relative;
      overflow: visible;
    }

    .share-btn::after {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      border-radius: 50rpx;
      border: 1rpx solid #EE781F;
      pointer-events: none;
      box-sizing: border-box;
    }

    @media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 2dppx) {
      .share-btn::after {
        border-width: 0.5px;
      }
    }

  }
}
</style> 