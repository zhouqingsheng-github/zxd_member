<template>
  <view>
    <scroll-view :scroll-y="!showStatusPopup" style="height: 100vh;">
      <view class="order-detail-page">
        <uni-nav-bar
            backgroundColor="#EE781F"
            :shadow="false"
            :border="false"
            color="#FFF"
            left-icon="left"
            status-bar
            @clickLeft="goBack">
          <template #default>
            <text class="nav-title">订单详情</text>
          </template>
        </uni-nav-bar>
        <!-- 顶部栏 -->
        <view class="header-bg">
          <view class="order-status-block">
            <view class="order-status-row">
              <view class="order-status">{{ orderStatusInfo.title }}</view>
              <view class="review-more-icon" v-if="orderStatusInfo.showArrow">
                <uni-icons type="arrowright" size="16" color="#FFF"></uni-icons>
              </view>
              <view v-if="orderStatusInfo.showCountdown" class="countdown">
                <template v-if="days > 0">
                  <view class="countdown-item">
                    <view class="countdown-value">{{ days }}</view>
                    <text class="countdown-unit">天</text>
                  </view>
                </template>
                <view class="countdown-item">
                  <view class="countdown-value">{{ hours }}</view>
                  <text class="countdown-unit">时</text>
                </view>
                <view class="countdown-item">
                  <view class="countdown-value">{{ minutes }}</view>
                  <text class="countdown-unit">分</text>
                </view>
                <view class="countdown-item">
                  <view class="countdown-value">{{ seconds }}</view>
                  <text class="countdown-unit">秒</text>
                </view>
              </view>
            </view>
            <view class="order-status-desc">{{ orderStatusInfo.desc }}</view>
          </view>
        </view>

        <!-- 酒店信息卡片 -->
        <view class="card hotel-card">
          <view class="hotel-info-name">
            商品信息
          </view>
          <view class="hotel-img-wrap">
            <image class="hotel-img" :src="order.mainPicture" mode="aspectFill"/>
          </view>
          <view class="hotel-info-base" @click="goToHotelDetail">
            <view class="hotel-info">
              <view class="hotel-title">{{ order.commodityName }}</view>
              <view class="hotel-date">{{ formatDateRange2(order.effectiveTime, order.expireTime) }}</view>
            </view>
          </view>
        </view>

        <!-- 预订信息 -->
        <view class="card info-card">
          <view class="hotel-info-name">
            订单信息
          </view>
          <view class="info-row">
            <view class="info-label">订单来源</view>
            <view class="info-value">{{ order.channel }}</view>
          </view>
          <view class="info-row">
            <view class="info-label">订单编号</view>
            <view class="info-value">{{ order.orderNo }}</view>
          </view>
          <view class="info-row">
            <view class="info-label">联系人</view>
            <view class="info-value">{{ order.consumerNickName || '' }}
            </view>
          </view>
          <view class="info-row">
            <view class="info-label">联系电话</view>
            <view class="info-value">{{ order.consumerPhone }}</view>
          </view>
          <view class="info-row last-row">
            <view class="info-label">创建时间</view>
            <view class="info-value">{{ order.createTime }}</view>
          </view>
        </view>

        <!-- 支付信息 -->
        <view class="card info-card">
          <template v-if="order.orderStatus !== 1">
            <view class="hotel-info-name">
              支付信息
            </view>
            <view class="info-row">
              <view class="info-label">支付时间</view>
              <view class="info-value">{{ order.payTime || '' }}</view>
            </view>
            <!--            <view class="line-fee"></view>-->
            <view class="line-fee-none"></view>
          </template>
          <template v-else>
            <view class="hotel-info-name-else">
            </view>
          </template>
          <!--          <view class="hotel-info-name-fee">-->
          <!--            费用明细-->
          <!--          </view>-->
          <!--          <view class="info-row">-->
          <!--            <view class="info-label">原价</view>-->
          <!--            <view class="info-value">￥{{ order.commodityPrice||'' }}</view>-->
          <!--          </view>-->
          <!--          <view class="info-row">-->
          <!--            <view class="info-label">优惠价格</view>-->
          <!--            <view class="info-value">-￥{{ order.commodityPrice && order.paymentAmount ? (order.commodityPrice - order.paymentAmount).toFixed(2) : '' }}</view>-->
          <!--          </view>-->
          <!--          <view class="line-fee-1"></view>-->
          <!--          <view class="info-row total-row">-->
          <!--            <view class="info-label">实付总额</view>-->
          <!--            <view class="info-value total">-->
          <!--              <text class="currency">￥</text>-->
          <!--              <text class="amount-v">{{ order.paymentAmount||"" }}</text>-->
          <!--            </view>-->
          <!--          </view>-->
        </view>
        <view style="height: 66rpx;width: 100%"></view>
        <!-- 底部操作栏 -->
        <view class="footer-bar" v-if="!hideToPay">
          <view
              v-for="btn in footerButtons"
              :key="btn.type"
              class="footer-btn primary"
              @click="onFooterBtnClick(btn.type)"
          >
            {{ btn.text }}
          </view>
        </view>
      </view>
    </scroll-view>

    <!-- 用户不匹配提示弹窗 -->
    <uni-popup ref="userMismatchPopup" type="center">
      <view class="popup-content">
        <view class="popup-title">提示</view>
        <view class="popup-message">订单不属于当前登录账号，无法使用</view>
        <view class="popup-buttons">
          <button class="popup-button confirm" @click="closeUserMismatchPopup">切换登录</button>
        </view>
      </view>
    </uni-popup>
  </view>
</template>

<script>
import {getThirdOrderDetail} from '@/common/api.js';
import UPopup from "../../../uni_modules/uview-ui/components/u-popup/u-popup.vue";
import {pageBack} from "../../../common/redirect";
import {checkLogin, getUserInfo,clearUserInfo} from "../../../store";

export default {
  components: {UPopup},
  data() {
    return {
      order: {},
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      timer: null,
      showStatusPopup: false,
      isCountdownEnded: false,
      timelineList: [],
      isPaying: false,
      // 用户信息检查相关
      orderUserInfo: null,
      hideToPay: false
    }
  },
  onLoad(options) {
    if (!checkLogin()) {
      uni.navigateTo({
        url: '/pages/subPackages/user/login',
        redirectUrl: `/pages/subPackages/order/three_detail?orderNo=${options.orderNo}`,
      });
    } else {
      this.fetchOrderDetail(options.orderNo);
    }
  },
  onShow() {

  },
  computed: {
    orderStatusInfo() {
      // 根据新的状态定义：1-未使用 2-已使用 3-已过期 4-已取消
      switch (this.order.status) {
        case 1:
          return {
            title: '未使用',
            desc: '订单尚未使用',
            showArrow: true,
            showCountdown: true
          }
        case 2:
          return {
            title: '已使用',
            desc: '订单已使用',
            showArrow: true,
          }
        case 3:
          return {
            title: '已过期',
            desc: '订单已过期',
            showArrow: true,
          };
        case 4:
          return {
            title: '已取消',
            desc: '订单已取消',
            showArrow: true,
          }
        default:
          return {}
      }
    },
    footerButtons() {
      switch (this.order.status) {
        case 1:
          return [
            {text: '去使用', type: 'goToUse'}
          ];
        default:
          return [];
      }
    }
  },
  methods: {
    // 显示用户不匹配提示弹窗
    showUserMismatchPopup() {
      this.hideToPay = true;
      this.$refs.userMismatchPopup.open();
    },
    // 关闭用户不匹配提示弹窗
    closeUserMismatchPopup() {
      // 需要跳转到 去登录页面
      uni.navigateTo({
        url: '/pages/subPackages/user/login',
        redirectUrl: `/pages/subPackages/order/three_detail?orderNo=${this.order.orderNo}`,
      });
      this.$refs.userMismatchPopup.close();
    },
    formatDateRange2(effectiveTime, expireTime) {
      if (!effectiveTime || !expireTime) return "";
      const startDate = new Date(effectiveTime);
      const endDate = new Date(expireTime);
      const formatDate = (date) => {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${year}.${month}.${day}`;
      };
      return `有效期：${formatDate(startDate)}至${formatDate(endDate)}`;
    },
    formatDate(time) {
      if (!time) return '';
      const date = new Date(time);
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      const hour = date.getHours().toString().padStart(2, '0');
      const minute = date.getMinutes().toString().padStart(2, '0');
      return `${year}年${month}月${day}日 ${hour}:${minute}`;
    },
    async fetchOrderDetail(orderNo) {
      this.order = await getThirdOrderDetail(orderNo)
          .catch((error) => {
            throw new Error(error.message || '加载失败');
          });
      // 对于状态1(未使用)的订单，启动倒计时
      if (this.order.status === 1 && this.order.expireTime) {
        this.startCountdown();
      }
      // 如果为空则返回到订单列表
      if (!this.order) {
        await uni.switchTab({url: '/pages/order/index'});
      }
      const userInfo = getUserInfo('userInfo')
      if (userInfo && this.order.memberId !== userInfo.id) {
        this.showUserMismatchPopup()
      }
    },
    goBack() {
      pageBack()
    },
    onNav() {
      if (!this.order.hotel || !this.order.hotel.latitude || !this.order.hotel.longitude) {
        uni.showToast({
          title: '酒店位置信息不存在',
          icon: 'none'
        });
        return;
      }
      // 打开地图导航
      uni.openLocation({
        latitude: Number(this.order.hotel.latitude),
        longitude: Number(this.order.hotel.longitude),
        name: this.order.hotelName,
        address: this.order.hotel.address,
        success: () => {
        },
        fail: (err) => {
          console.error('打开地图失败：', err);
          uni.showToast({
            title: '打开地图失败',
            icon: 'none'
          });
        }
      });
    },
    onCall() {
      uni.makePhoneCall({phoneNumber: this.order.hotel.contactPhone});
    },
    async onFooterBtnClick(type) {
      if (type === 'goToUse') {
        if (!checkLogin()) {
          await uni.navigateTo({
            url: '/pages/subPackages/user/login',
            redirectUrl: '/pages/subPackages/home/search/jointSales',
            params: {
              id: this.order.id,
              business: 'threeOrder'
            }
          });
        } else {
          uni.showModal({
            title: '提示',
            content: '由于此订单为探探糖订单，如需发票请联系探探糖平台进行开具。感谢您的理解与支持！',
            confirmText: '继续使用',
            cancelText: '取消',
            success: async (res) => {
              if (res.confirm) {
                await uni.navigateTo({
                  url: `/pages/subPackages/home/search/jointSales?id=${this.order.id}&business=threeOrder`,
                });
              }
            }
          });
        }
      }
    },
    startCountdown() {
      // 清除可能已存在的计时器
      if (this.timer) {
        clearInterval(this.timer);
      }

      // 启动新的计时器
      this.updateCountdown();
      this.timer = setInterval(() => {
        this.updateCountdown();
      }, 1000);
    },
    updateCountdown() {
      if (!this.order.expireTime) {
        return;
      }

      const now = new Date().getTime();
      const expireTime = new Date(this.order.expireTime).getTime();
      const remainingTime = expireTime - now;

      // 如果已过期，清除计时器
      if (remainingTime <= 0) {
        clearInterval(this.timer);
        this.days = 0;
        this.hours = '00';
        this.minutes = '00';
        this.seconds = '00';
        return;
      }

      // 计算天、时、分、秒
      const totalSeconds = Math.floor(remainingTime / 1000);
      this.days = Math.floor(totalSeconds / (24 * 60 * 60));
      const hoursLeft = Math.floor((totalSeconds % (24 * 60 * 60)) / (60 * 60));
      const minutesLeft = Math.floor((totalSeconds % (60 * 60)) / 60);
      const secondsLeft = totalSeconds % 60;

      this.hours = hoursLeft < 10 ? '0' + hoursLeft : '' + hoursLeft;
      this.minutes = minutesLeft < 10 ? '0' + minutesLeft : '' + minutesLeft;
      this.seconds = secondsLeft < 10 ? '0' + secondsLeft : '' + secondsLeft;
    },
  },
  beforeDestroy() {
    if (this.timer) clearInterval(this.timer);
  },

  // 添加页面隐藏时也清除计时器
  onHide() {
    if (this.timer) clearInterval(this.timer);
  }
}
</script>

<style scoped>
.order-detail-page {
  background: #f6f7fa;
  min-height: 100vh;
  padding-bottom: 120rpx;
}

.header-bg {
  background: #EE781F;
  padding-bottom: 32rpx;
}

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

.order-status-block {
  padding: 54rpx 0 130rpx 28rpx;
}

.order-status-row {
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.review-more-icon {
  margin-left: 20rpx;
}

.order-status {
  font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;
  font-weight: 500;
  font-size: 44rpx;
  color: #FFFFFF;
  text-align: left;
  font-style: normal;
}

.order-status-desc {
  font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;
  font-weight: 400;
  font-size: 24rpx;
  color: #FFFFFF;
  line-height: 24rpx;
  text-align: left;
  font-style: normal;
  margin-top: 16rpx;
}

.countdown {
  display: flex;
  align-items: center;
  margin-left: 20rpx;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 8rpx;
  padding: 10rpx 15rpx;
}

.countdown-item {
  display: flex;
  align-items: baseline;
}

.countdown-item:not(:last-child)::after {
  content: "";
  width: 1rpx;
  height: 20rpx;
  background: rgba(255, 255, 255, 0.5);
  margin: 0 10rpx;
}

.countdown-value {
  font-size: 24rpx;
  font-weight: 500;
  color: #FFFFFF;
  font-family: 'Helvetica Neue', Arial, sans-serif;
  min-width: 20rpx;
  text-align: center;
}

.countdown-unit {
  font-size: 20rpx;
  color: #FFFFFF;
  margin: 0 5rpx 0 2rpx;
  font-family: 'Helvetica Neue', Arial, sans-serif;
}

.countdown-unit:last-child {
  margin-right: 0;
}

.card {
  background: #FFFFFF;
  border-radius: 28rpx;
  margin: 28rpx;
  padding: 0 28rpx;
}

.hotel-card {
  margin-top: -98rpx;
}

.hotel-info-name {
  height: 32rpx;
  font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;
  font-weight: 500;
  font-size: 32rpx;
  color: #19191A;
  line-height: 32rpx;
  text-align: left;
  font-style: normal;
  padding: 40rpx 0 30rpx 0;
}

.hotel-info-name-else {
  padding-bottom: 30rpx;
}

.hotel-info-name-fee {
  height: 32rpx;
  font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;
  font-weight: 500;
  font-size: 32rpx;
  color: #19191A;
  line-height: 32rpx;
  text-align: left;
  font-style: normal;
  padding-bottom: 30rpx;
}

.hotel-img-wrap {
  width: 100%;
  height: 340rpx;
  display: flex;
  justify-content: center;
  border-radius: 28rpx;
  margin-bottom: 40rpx;
}

.hotel-img {
  width: 100%;
  height: 100%;
  border-radius: 12rpx;
  object-fit: cover;
}

.hotel-info-base {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.line {
  height: 1rpx;
  background: #E8E9EB;
  margin: 42rpx 0 24rpx 0;
}

.hotel-title {
  font-size: 30rpx;
  font-weight: 600;
  color: #222;
  margin-bottom: 8rpx;
}

.hotel-room, .hotel-date {
  font-size: 24rpx;
  color: #666;
  margin-bottom: 4rpx;
}

.hotel-contact-row {
  display: flex;
  align-items: center;
  padding-bottom: 58rpx;
}

.map-icon {
  width: 36rpx;
  height: 36rpx;
  background: url('/static/base/map.png') no-repeat center;
  background-size: 100% 100%;
  margin-right: 12rpx;
  flex-shrink: 0;
}

.hotel-desc {
  flex: 1;
  font-size: 28rpx;
  color: #19191A;
}

.icon-btn {
  background: #f8f8f8;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 16rpx;
  padding: 0;
  width: 64rpx;
  height: 64rpx;
  border-radius: 64rpx;
  overflow: hidden;
  flex-shrink: 0;
}

.navigation-icon {
  width: 100%;
  height: 100%;
  background: url('/static/base/navigation.png') no-repeat center;
  background-size: 64rpx 64rpx;
}

.phone-icon {
  width: 100%;
  height: 100%;
  background: url('/static/base/phone.png') no-repeat center;
  background-size: 64rpx 64rpx;
}

.card-title {
  font-size: 28rpx;
  font-weight: 600;
  color: #222;
  margin-bottom: 18rpx;
}

.info-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 24rpx;
  color: #444;
  margin-bottom: 30rpx;
}

.info-label {
  height: 28rpx;
  font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;
  font-weight: 400;
  font-size: 28rpx;
  color: #19191A;
  line-height: 28rpx;
  text-align: left;
  font-style: normal;
}

.info-value {
  height: 28rpx;
  font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;
  font-weight: 400;
  font-size: 28rpx;
  color: #19191A;
  line-height: 28rpx;
  text-align: right;
  font-style: normal;
}

.last-row {
  padding-bottom: 60rpx;
}

.line-fee {
  height: 1rpx;
  background: #E8E9EB;
  margin: 38rpx 0 40rpx 0;
}

.line-fee-none {
  height: 1rpx;
  background: none;
  margin: 38rpx 0 40rpx 0;
}

.line-fee-1 {
  height: 1rpx;
  background: #E8E9EB;
  margin: 38rpx 0 40rpx 0;
}

.line-status {
  height: 1rpx;
  background: #E8E9EB;
  margin: 38rpx 0 54rpx 0;
}

.total-row {
  height: 40rpx;
  padding-bottom: 56rpx;
  display: flex;
  align-items: center;
}

.total {
  font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;
  font-weight: 600;
  font-size: 40rpx;
  color: #EE781F;
  line-height: 40rpx;
  text-align: right;
  font-style: normal;
  display: flex;
  align-items: flex-end;
}

.currency {
  font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;
  font-weight: 400;
  font-size: 24rpx;
  color: #EE781F;
  line-height: 30rpx;
  text-align: left;
  font-style: normal;
  display: inline-block;
  vertical-align: bottom;
}

.amount-v {
  display: inline-block;
  vertical-align: bottom;
  font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;
  font-weight: 600;
  font-size: 40rpx;
  color: #EE781F;
  line-height: 40rpx;
}

.footer-bar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  background: #fff;
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 24rpx 0 66rpx 0;
  box-shadow: 0 -2rpx 8rpx rgba(0, 0, 0, 0.04);
  z-index: 99;
}

.footer-btn {
  flex: 1;
  margin: 0 24rpx;
  height: 80rpx;
  line-height: 80rpx;
  border-radius: 40rpx;
  font-size: 30rpx;
  font-weight: 500;
  border: none;
  text-align: center;
  box-sizing: border-box;
}

.footer-btn.cancel {
  background: #fff;
  color: #19191A;
  border: none;
  position: relative;
}

.footer-btn.cancel::after {
  content: " ";
  position: absolute;
  top: 0;
  left: 0;
  width: 200%;
  height: 200%;
  transform: scale(0.5);
  transform-origin: 0 0;
  pointer-events: none;
  box-sizing: border-box;
  border: 1px solid #CBCBD5;
  border-radius: 80rpx;
}

.footer-btn.primary {
  background: #ee781f;
  color: #fff;
}

.footer-btn.primary[disabled] {
  background: #ccc;
  color: #fff;
  opacity: 0.6;
}

.status-popup {
  width: 100%;
  background: #fff;
  border-radius: 32rpx 32rpx 0 0;
}

.bed-picker-header {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

.popup-title {
  font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;
  font-weight: 500;
  font-size: 40rpx;
  color: #19191A;
  line-height: 40rpx;
  text-align: center;
  font-style: normal;
  margin-top: 42rpx;
}

.close-icon {
  width: 34rpx;
  height: 32rpx;
  position: absolute;
  right: 34rpx;
  bottom: 8rpx;
  background-image: url('@/static/base/popup_icon_close.png');
  background-size: cover;
  background-position: center;
}

.status-timeline {
  margin-left: 56rpx;
}

.timeline-item {
  display: flex;
  align-items: flex-start;
  position: relative;
  min-height: 80rpx;
}

.timeline-axis {
  width: 40rpx;
  height: 112rpx;
  position: relative;
  display: flex;
  justify-content: center;
}

.axis-line {
  position: absolute;
  left: 50%;
  width: 2rpx;
  transform: translateX(-50%);
  background: #CBCBD5;
  z-index: 0;
}

.timeline-item:first-child .axis-line {
  top: 40rpx;
  height: calc(100% - 40rpx);
}

.timeline-item:not(:first-child):not(:last-child) .axis-line {
  top: 0;
  height: 100%;
}

.timeline-item:last-child .axis-line {
  top: 0;
  height: 20rpx;
}

.dot-outer {
  width: 38rpx;
  height: 38rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(238, 120, 31, 0.2);
  position: relative;
  z-index: 2;
}

.dot-inner {
  width: 16rpx;
  height: 16rpx;
  border-radius: 50%;
  background: rgb(238, 103, 31);
  position: absolute;
  z-index: 3;
}

.dot {
  width: 16rpx;
  height: 16rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #CBCBD5;
}

.dot::after {
  width: 20rpx;
  height: 20rpx;
  border-radius: 50%;
  background: #e0e0e8;
  border: 2rpx solid #d3d3dd;
  box-shadow: 0 2rpx 6rpx rgba(180, 180, 200, 0.10);
}

.content {
  margin-left: 17rpx;
}

.timeline-item .content {
  flex: 1;
  padding-bottom: 32rpx;
}

.timeline-item .main {
  height: 24rpx;
  font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;
  font-weight: 500;
  font-size: 24rpx;
  line-height: 24rpx;
  text-align: left;
  font-style: normal;
  color: #6D7278;
  margin-top: 8rpx;
}

.timeline-item.current .main {
  color: #ee781f;
}

.timeline-item.current .time {
  color: #000;
}


.timeline-item .time {
  color: #6D7278;
  font-size: 24rpx;
  margin-top: 8rpx;
}

.hotel-info {
  margin-bottom: 28rpx;
}


/* 用户不匹配弹窗样式 */
.popup-content {
  width: 540rpx;
  background: #fff;
  border-radius: 20rpx;
  padding: 40rpx;
  text-align: center;
}

.popup-title {
  font-size: 36rpx;
  font-weight: bold;
  margin-bottom: 20rpx;
  color: #333;
}

.popup-message {
  font-size: 28rpx;
  color: #666;
  margin-bottom: 40rpx;
  line-height: 1.5;
}

.popup-buttons {
  display: flex;
  justify-content: center;
}

.popup-button {
  width: 200rpx;
  height: 70rpx;
  line-height: 70rpx;
  border-radius: 35rpx;
  font-size: 28rpx;
  border: none;
}

.popup-button.confirm {
  background: #EE781F;
  color: white;
}
</style>