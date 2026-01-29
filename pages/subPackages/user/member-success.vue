<template>
  <view class="member-success-page">
    <uni-nav-bar
        backgroundColor="#FFFFFF"
        :fixed="false"
        :shadow="false"
        :border="false"
        status-bar
        left-icon="left"
        @clickLeft="back"
    >
      <template #default>
        <text class="nav-title">开通会员</text>
      </template>
    </uni-nav-bar>
    <view class="success-icon-body">
      <image class="success-icon" src="https://zxd-hotel.xin/zxdhotel/2025/06/03/vip-success_20250603230059A007.png"
             mode="aspectFit"/>
    </view>
    <view class="success-title">会员开通成功！</view>
    <view class="success-desc">恭喜您成为住小叮会员</view>
    <view class="info-card">
      <view class="row">
        <view class="label">会员类型</view>
        <view class="value">{{ description }}</view>
      </view>
      <view class="row">
        <view class="label">会员ID</view>
        <view class="value">{{ memberId }}</view>
      </view>
      <view class="row">
        <view class="label">开通时间</view>
        <view class="value">{{ openingTime }}</view>
      </view>
      <view class="row">
        <view class="label">有效期至</view>
        <view class="value">{{ validityPeriod }}</view>
      </view>
    </view>
    <view class="gift-tips">
      <image class="gift-icon" src="/static/base/gift.png" mode="widthFix"/>
      <view class="gift-text">{{ remark }}</view>
    </view>
    <view class="pay-btn-footer">
      <view class="btn-outline" @click="goCoupon">查看优惠券</view>
      <view class="btn-solid" @click="goHotel">浏览酒店</view>
    </view>
  </view>
</template>

<script>
import {getUserInfo, setUserInfo} from '@/store/index'
import {pageBack} from "../../../common/redirect";

export default {
  data() {
    return {
      openingTime: "",
      validityPeriod: "",
      memberId: "",
      remark: '',
      description: '住小叮年度会员'
    }
  },
  onLoad(options) {
    this.openingTime = options.openingTime;
    this.validityPeriod = options.validityPeriod;
    this.remark = decodeURIComponent(options.remark || '');
    this.description = decodeURIComponent(options.description || '住小叮年度会员');
    const userInfo = getUserInfo();
    this.memberId = userInfo.id;
    // 更新本地缓存 userInfo.vip = 1
    userInfo.vip = 1;
    setUserInfo(userInfo);
  },
  methods: {
    back() {
      pageBack()
    },
    goCoupon() {
      uni.switchTab({url: '/pages/coupon/index'});
    },
    goHotel() {
      uni.switchTab({url: '/pages/home/index'});
    }
  }
}
</script>

<style scoped lang="scss">
.member-success-page {
  min-height: 100vh;
  background: #FFF;
}

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

.success-title {
  margin-top: 28rpx;
  font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;
  font-weight: 500;
  font-size: 40rpx;
  color: #19191A;
  line-height: 40rpx;
  text-align: center;
  font-style: normal;
}

.success-desc {
  margin-top: 20rpx;
  height: 28rpx;
  font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;
  font-weight: 400;
  font-size: 28rpx;
  color: #19191A;
  line-height: 28rpx;
  text-align: center;
  font-style: normal;
}

.success-icon-body {
  display: flex;
  justify-content: center;
  margin-top: 32rpx;

  .success-icon {
    width: 242rpx;
    height: 200rpx;
  }
}

.info-card {
  background: #F3F4F6;
  border-radius: 28rpx;
  margin: 66rpx 28rpx 0 28rpx;
  padding: 38rpx 28rpx 10rpx 28rpx;

  .row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 28rpx;
    font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;
    font-weight: 400;
    font-size: 28rpx;
    color: #19191A;
    line-height: 28rpx;
    text-align: right;
    font-style: normal;
    margin-bottom: 30rpx;

    .label {
      color: #19191A;
    }

    .value {
      color: #19191A;
    }
  }
}

.gift-tips {
  display: flex;
  align-items: center;
  margin: 460rpx 28rpx 38rpx 28rpx;
  height: 120rpx;
  background: #FFF0E5;
  border-radius: 28rpx 28rpx 28rpx 0;
  padding: 20rpx 94rpx 0rpx 32rpx;

  .gift-icon {
    width: 96rpx;
    height: 100rpx;
    margin-right: 38rpx;
  }

  .gift-text {
    font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;
    font-weight: 400;
    font-size: 24rpx;
    color: #B7560C;
    line-height: 34rpx;
    text-align: left;
    font-style: normal;
    flex: 1;
  }
}

.pay-btn-footer {
  background: transparent;
  margin: 0 28rpx;
  z-index: 99;
  padding-bottom: calc(32rpx + constant(safe-area-inset-bottom));
  padding-bottom: calc(32rpx + env(safe-area-inset-bottom));
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 26rpx;

  .btn-outline {
    flex: 1;
    height: 92rpx;
    background: #FFFFFF;
    border-radius: 50rpx;
    border: 1rpx solid #EE781F;
    font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;
    font-weight: 500;
    font-size: 32rpx;
    color: #EE781F;
    line-height: 92rpx;
    text-align: center;
    font-style: normal;
  }

  .btn-solid {
    flex: 1;
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
  }
}
</style> 