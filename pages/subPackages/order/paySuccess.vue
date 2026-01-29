<template>
  <view class="pay-success-container">
    <view class="header">
      <view class="nav-bar">
        <uni-nav-bar
            backgroundColor="#EE781F"
            :shadow="false"
            :border="false"
            color="#FFF"
            left-icon="left"
            status-bar
            @clickLeft="goBack">
          <template #default>
            <text class="nav-title">支付详情</text>
          </template>
        </uni-nav-bar>
      </view>
      <view class="success-icon-box">
        <view class="success-icon">
          <image src="https://zxd-hotel.xin/zxdhotel/2025/06/03/pay_success_20250603225149A002.png" mode="aspectFit"/>
        </view>
        <view class="success-text-group">
          <view class="success-text">支付完成</view>
          <view class="success-desc">恭喜您预订成功</view>
        </view>
      </view>
      <view class="printPort"/>
    </view>
    <view class="ticket-box" v-if="!loading && order.orderNo">
      <view class="amount">
        <text class="amount-Y">￥</text>
        <text class="amount-num">{{ order.totalAmount }}</text>
      </view>
      <view class="line"/>
      <view class="info-row">
        <text class="label">订单编号：</text>
        <text class="content">{{ order.orderNo }}</text>
      </view>
      <view class="info-row">
        <text class="label">下单时间：</text>
        <text class="content">{{ formatDateTime(order.createTime) }}</text>
      </view>
      <view class="info-row">
        <text class="label">支付方式：</text>
        <text class="content">{{ order.paymentMethodName }}</text>
      </view>
      <view class="info-row">
        <text class="label">预订酒店：</text>
        <text class="content">{{ order.hotelName }}</text>
      </view>
      <view class="info-row">
        <text class="label">入离日期：</text>
        <text class="content">{{ formatDate(order.checkInDate) }}至{{ formatDate(order.checkOutDate) }}</text>
      </view>
    </view>
    <view class="btn-group" v-if="!loading && order.orderNo">
      <view class="main-btn" @click="goOrderList">查看订单</view>
      <view class="sub-btn" @click="goHome">返回首页</view>
    </view>
  </view>
</template>

<script>
import {getOrderDetail} from 'common/api'
import {pageBack} from "../../../common/redirect";

export default {
  data() {
    return {
      order: {},
      loading: true
    }
  },
  onLoad(options) {
    this.initData(options.id)
  },
  methods: {
    async initData(id) {
      try {
        uni.showLoading({
          title: '加载中...',
          mask: true
        });
        this.loading = true;
        const orderData = await getOrderDetail(id);
        if (!orderData) {
          throw new Error('获取订单信息失败');
        }
        this.order = orderData;
      } catch (error) {
        uni.showModal({
          title: '提示',
          content: '获取订单信息失败，是否重试？',
          success: (res) => {
            if (res.confirm) {
              this.initData(id);
            } else {
              uni.navigateBack();
            }
          }
        });
      } finally {
        this.loading = false;
        uni.hideLoading();
      }
    },
    goOrderList() {
      uni.switchTab({url: '/pages/order/index'});
    },
    goHome() {
      uni.switchTab({url: '/pages/home/index'});
    },
    goBack() {
      pageBack()
    },
    formatDate(dateStr) {
      if (!dateStr) return '';
      const date = new Date(dateStr);
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      return `${month}月${day}日`;
    },
    formatDateTime(dateStr) {
      if (!dateStr) return '';
      const date = new Date(dateStr);
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      const seconds = date.getSeconds().toString().padStart(2, '0');
      return `${year}年${month}月${day}日 ${hours}:${minutes}:${seconds}`;
    },
    formatDistance(meters) {
      if (!meters) return '';
      if (meters < 1000) {
        return `${Math.round(meters)}`;
      } else {
        return `${(meters / 1000).toFixed(1)}`;
      }
    },
    calcDistance(currentLocation, itemLocation) {
      // Implementation of calcDistance method
    }
  }
}
</script>

<style scoped lang="scss">
.nav-title {
  width: 100%;
  font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;
  font-weight: 500;
  font-size: 32rpx;
  color: #FFF;
  text-align: center;
  height: 88rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pay-success-container {
  min-height: 100vh;
  background: #f3f4f6;
  display: flex;
  flex-direction: column;
  align-items: center;

  .header {
    width: 100vw;
    background: #EE781F;
    padding-bottom: 64rpx;

    .nav-bar {
      width: 100vw;
    }

    .success-icon-box {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      margin-top: 40rpx;
      margin-bottom: 40rpx;

      .success-icon {
        width: 80rpx;
        height: 80rpx;
        background: #fff;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 32rpx;
      }

      .success-text-group {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: center;

        .success-text {
          font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;
          font-weight: 500;
          font-size: 44rpx;
          color: #FFFFFF;
          text-align: left;
          font-style: normal;
        }

        .success-desc {
          font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;
          font-weight: 400;
          font-size: 24rpx;
          color: #FFFFFF;
          text-align: left;
          font-style: normal;
        }
      }
    }

    .printPort {
      height: 20rpx;
      background: #B95103;
      border-radius: 14rpx;
      margin: 84rpx 28rpx 0;

    }
  }

  .ticket-box {
    min-height: 638rpx;
    margin: 0 50rpx;
    margin-top: -64rpx;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    background-image: url("https://zxd-hotel.xin/zxdhotel/2025/06/03/paper_20250603224821A001.png");
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
    position: relative;
    padding: 0 28rpx;

    .amount {
      width: 100%;
      text-align: center;
      margin-top: 66rpx;

      .amount-Y {
        font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;
        font-weight: 400;
        font-size: 36rpx;
        color: #19191A;
        text-align: left;
        font-style: normal;
      }

      .amount-num {
        font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;
        font-weight: 600;
        font-size: 56rpx;
        color: #19191A;
        line-height: 56rpx;
        text-align: right;
        font-style: normal;
      }
    }

    .line {
      width: 100%;
      margin: 50rpx 0 26rpx 0;
      height: 1rpx;
      background: #E8E9EB;
    }

    .info-row {
      font-size: 28rpx;
      color: #19191A;
      margin-bottom: 40rpx;
      display: flex;
      align-items: flex-start;

      .label {
        margin-right: 30rpx;
        flex-shrink: 0;
        min-width: 140rpx;
      }

      .content {
        flex: 1;
        word-break: break-all;
      }
    }

    .info-row:last-child {
      margin-bottom: 0;
    }
  }

  .btn-group {
    width: 90vw;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 60rpx;

    .main-btn {
      width: 100%;
      height: 92rpx;
      line-height: 92rpx;
      background: #ee781f;
      color: #fff;
      font-size: 32rpx;
      font-weight: 500;
      border-radius: 50rpx;
      margin-bottom: 32rpx;
      text-align: center;
    }

    .sub-btn {
      width: 100%;
      height: 92rpx;
      line-height: 92rpx;
      background: #fff;
      color: #ee781f;
      font-size: 32rpx;
      font-weight: 500;
      border-radius: 50rpx;
      border: 1rpx solid #ee781f;
      text-align: center;
      position: relative;
    }

    /* 高分辨率适配 */
    @media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 2dppx) {
      .sub-btn {
        border: 0.5px solid #ee781f;
      }
    }
  }
}
</style> 