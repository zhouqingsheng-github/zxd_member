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
              <view class="order-status" @click="onStatusClick">{{ orderStatusInfo.title }}</view>
              <view class="review-more-icon" v-if="orderStatusInfo.showArrow" @click="onStatusClick">
                <uni-icons type="arrowright" size="16" color="#FFF"></uni-icons>
              </view>
              <view v-if="orderStatusInfo.showCountdown" class="countdown">
                <view class="countdown-block">{{ minute }}</view>
                <view class="countdown-colon">:</view>
                <view class="countdown-block">{{ second }}</view>
              </view>
            </view>
            <view class="order-status-desc">{{ orderStatusInfo.desc }}</view>
          </view>
        </view>

        <!-- 酒店信息卡片 -->
        <view class="card hotel-card">
          <view class="hotel-info-name">
            酒店信息
          </view>
          <view class="hotel-img-wrap">
            <image class="hotel-img" :src="order.mainPicture" mode="aspectFill"/>
          </view>
          <view class="hotel-info-base" @click="goToHotelDetail">
            <view class="hotel-info">
              <view class="hotel-title">{{ order.hotelName }}</view>
              <view class="hotel-room">{{ order.roomTypeName }} | {{ order.saleMode === 1 ? '房间数' : '床位数' }}：{{ order.roomCount }}</view>
              <view class="hotel-date">{{ order.checkInDate }}-{{ order.checkInDate }}（共{{ order.stayDays }}晚）</view>
            </view>
            <view class="hotel-info-l">
            </view>
          </view>
          <view class="line"></view>
          <view class="hotel-contact-row">
            <view class="map-icon"></view>
            <text class="hotel-desc">{{ order.hotel.address }}</text>
            <view class="icon-btn" @click="onNav">
              <view class="navigation-icon"></view>
            </view>
            <view class="icon-btn" @click="onCall">
              <view class="phone-icon"></view>
            </view>
          </view>
        </view>

        <!-- 预订信息 -->
        <view class="card info-card">
          <view class="hotel-info-name">
            预订信息
          </view>
          <view class="info-row">
            <view class="info-label">入住人</view>
            <view class="info-value">{{
                order.guestList ? order.guestList.map(guest => guest.guestName).join('、') : ''
              }}
            </view>
          </view>
          <view class="info-row">
            <view class="info-label">联系电话</view>
            <view class="info-value">{{ order.contactPhone }}</view>
          </view>
          <view class="info-row">
            <view class="info-label">入住时间</view>
            <view class="info-value">{{ order.checkInDate }}</view>
          </view>
          <view class="info-row">
            <view class="info-label">退房时间</view>
            <view class="info-value">{{ order.checkOutDate }}</view>
          </view>
          <view class="info-row">
            <view class="info-label">订单编号</view>
            <view class="info-value">{{ order.orderNo }}</view>
          </view>
          <view class="info-row last-row">
            <view class="info-label">下单时间</view>
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
              <view class="info-value">{{ order.paymentTime || '' }}</view>
            </view>
            <view class="info-row">
              <view class="info-label">支付方式</view>
              <view class="info-value">{{ order.paymentMethodName }}</view>
            </view>
            <view class="line-fee"></view>
          </template>
          <template v-else>
            <view class="hotel-info-name-else">
            </view>
          </template>
          <view class="hotel-info-name-fee">
            费用明细
          </view>
          <view class="info-row">
            <view class="info-label">房费</view>
            <view class="info-value">￥{{ order.roomFee }}</view>
          </view>
          <view class="info-row">
            <view class="info-label">服务费</view>
            <view class="info-value">￥{{ order.serviceFee || 0 }}</view>
          </view>
          <view class="info-row">
            <view class="info-label">会员优惠</view>
            <view class="info-value">-￥{{ order.memberDiscount }}</view>
          </view>
          <view class="info-row">
            <view class="info-label">红包抵扣</view>
            <view class="info-value">-￥{{ order.redPacketDiscount }}</view>
          </view>
          <view class="info-row" v-if="order.roomFee-order.redPacketDiscount-order.memberDiscount-order.totalAmount > 0">
            <view class="info-label">第三方抵扣</view>
            <view class="info-value">-￥{{ order.roomFee-order.redPacketDiscount-order.memberDiscount-order.totalAmount }}</view>
          </view>
          <view class="line-fee-1"></view>
          <view class="info-row total-row">
            <view class="info-label">实付总额</view>
            <view class="info-value total">
              <text class="currency">￥</text>
              <text class="amount-v">{{ order.totalAmount }}</text>
            </view>
          </view>
        </view>
        <view style="height: 66rpx;width: 100%"></view>
        <!-- 底部操作栏 -->
        <view class="footer-bar">
          <view
              v-for="btn in footerButtons"
              :key="btn.type"
              class="footer-btn"
              :class="btn.type === 'cancel' || btn.type === 'refund' || btn.type === 'delete' ? 'cancel' : 'primary'"
              @click="onFooterBtnClick(btn.type)"
          >
            {{ btn.text }}
          </view>
        </view>
      </view>
    </scroll-view>
    <!-- 订单状态弹窗 -->
    <u-popup :show="showStatusPopup" :round="20" @close="showStatusPopup = false">
      <view class="status-popup" @click.stop @touchmove.stop>
        <view class="bed-picker-header">
          <text class="popup-title">订单状态</text>
          <text class="close-icon" @click="showStatusPopup = false"/>
        </view>
        <view class="line-status"></view>
        <scroll-view class="status-timeline-wrapper" @touchmove.stop scroll-y style="max-height: 700rpx;">
          <view class="status-timeline">
            <view class="timeline-item" :class="{current: idx === 0}" v-for="(item, idx) in timelineList" :key="idx">
              <view class="timeline-axis">
                <view
                    class="axis-line"
                    :style="idx === 0
                  ? 'top: 20rpx; height: 100%;'
                  : idx === timelineList.length - 1
                  ? 'top: 0; height: 0rpx;'
                  : 'top: 0; height: 100%;'"
                ></view>
                <view v-if="idx === 0" class="dot-outer">
                  <view class="dot-inner"></view>
                </view>
                <view v-else class="dot"></view>
              </view>
              <view class="content">
                <view class="main">{{ item.eventDescription }}</view>
                <view class="time">{{ item.eventTime }}</view>
              </view>
            </view>
          </view>
        </scroll-view>
      </view>
    </u-popup>
  </view>
</template>

<script>
import {getOrderDetail} from '@/common/api.js';
import {cancelOrder, deleteOrder, getOrderEventTime, payRetry, refundOrder, validateRefund} from "../../../common/api";
import UPopup from "../../../uni_modules/uview-ui/components/u-popup/u-popup.vue";
import {pageBack} from "../../../common/redirect";

export default {
  components: {UPopup},
  data() {
    return {
      order: {},
      minute: 0,
      second: 0,
      timer: null,
      showStatusPopup: false,
      isCountdownEnded: false,
      timelineList: [],
      isPaying: false
    }
  },
  onLoad(options) {
    this.fetchOrderDetail(options.id);
  },
  onShow() {

  },
  computed: {
    orderStatusInfo() {
      // status: 1-待支付 2-待入住 3-待评价 4-已取消 5-已完成
      switch (this.order.orderStatus) {
        case 1:
          return {
            title: '待支付',
            desc: '请尽快支付，若超时未付，订单将为您自动取消',
            showArrow: true,
            showCountdown: true
          }
        case 2:
          return {
            title: '待入住',
            desc: '房间预订成功，您可凭订单号到前台办理入住',
            showArrow: true,
          }
          // case 3:
          //   return {
          //     title: '待评价',
          //     desc: '感谢入住，您的建议有助于我们提升更好的服',
          //     showArrow: true
          //   }
        case 3:
        case 4:
          return {
            title: '已完成',
            desc: '本单已完成，期待您下次入住',
            showArrow: true,
          };
        case 5:
          return {
            title: '已取消',
            desc: '本单未支付，已帮您自动取消/您已取消预订...',
            showArrow: true,
          }
        default:
          return {}
      }
    },
    footerButtons() {
      // status: 1-待支付 2-待入住 3-待评价 4-已取消 5-已完成
      switch (this.order.orderStatus) {
        case 1: // 待支付
          return [
            {text: '取消订单', type: 'cancel'},
            {text: '立即支付', type: 'pay', disabled: this.isCountdownEnded}
          ];
        case 2: // 待入住
          return [
            {text: '取消订单', type: 'refund'},
            {text: '联系酒店', type: 'contact'}
          ];
        case 3:
        case 4:
          // 待评价
          return true ? [
            {text: '删除订单', type: 'delete'},
            {text: '再次预定', type: 'rebook'}
          ] : [
            {text: '删除订单', type: 'delete'},
            {text: '去评价', type: 'review'}
          ];
        case 5: // 已取消
          return [
            {text: '再次预定', type: 'rebook'}
          ];
        default:
          return [];
      }
    }
  },
  methods: {
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
    async fetchOrderDetail(id) {
      this.order = await getOrderDetail(id)
          .catch((error) => {
            throw new Error(error.message || '加载失败');
          });
      if (this.order.orderStatus === 1) {
        // 计算剩余支付时间
        const expireTime = new Date(this.order.paymentExpireTime).getTime();
        const now = new Date().getTime();
        const remainingSeconds = Math.floor((expireTime - now) / 1000);
        if (remainingSeconds > 0) {
          this.startCountdown(remainingSeconds);
        }
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
      if (type === 'cancel') {
        uni.showModal({
          title: '提示',
          content: '订单确认取消后将无法恢复，是否确认取消？',
          confirmText: '确认取消',
          cancelText: '暂不取消',
          success: async (res) => {
            if (res.confirm) {
              uni.showLoading({
                title: '取消中...'
              });
              try {
                await cancelOrder(this.order.id)
                uni.hideLoading();
                uni.showToast({
                  title: '订单已取消',
                  icon: 'success'
                });
                // 刷新当前页详情
                this.fetchOrderDetail(this.order.id);
              } catch (error) {
                uni.hideLoading();
                uni.showToast({
                  title: error.message || '取消订单失败',
                  icon: 'none'
                });
              }
            }
          }
        });
      } else if (type === 'refund') {
        debugger
        validateRefund(this.order.id)
            .then((res) => {
              uni.showModal({
                title: '提示',
                content: '订单确认取消后将无法恢复，是否确认取消？',
                confirmText: '确认取消',
                cancelText: '暂不取消',
                success: async (res) => {
                  if (res.confirm) {
                    uni.showLoading({
                      title: '取消中...'
                    });
                    refundOrder(this.order.id)
                        .then((res) => {
                          debugger
                          uni.hideLoading();
                          uni.showToast({
                            title: '订单已取消',
                            icon: 'success'
                          });
                          // 刷新订单列表
                          this.resetAndLoadData();
                          return;
                        })
                        .catch((err) => {
                          debugger
                          uni.hideLoading();
                          uni.showModal({
                            title: '提示',
                            content: err.error || '取消订单失败',
                            showCancel: false,
                            confirmText: '我知道了'
                          });
                        });
                  }
                }
              });
              return;
            })
            .catch((err) => {
              uni.hideLoading();
              if (err.error.indexOf('违约金') !== -1) {
                uni.showModal({
                  title: '提示',
                  content: err.error,
                  confirmText: '确认取消',
                  cancelText: '暂不取消',
                  success: async (res) => {
                    if (res.confirm) {
                      uni.showLoading({
                        title: '取消中...'
                      });
                      refundOrder(this.order.id)
                          .then((res) => {
                            uni.hideLoading();
                            uni.showToast({
                              title: '订单已取消',
                              icon: 'success'
                            });
                            // 刷新订单列表
                            this.resetAndLoadData();
                          })
                          .catch((err) => {
                            uni.hideLoading();
                            uni.showModal({
                              title: '提示',
                              content: err.error || '取消订单失败',
                              showCancel: false,
                              confirmText: '我知道了'
                            });
                          });
                    }
                  }
                });
              } else {
                uni.showModal({
                  title: '提示',
                  content: err.error || '取消订单失败',
                  showCancel: false,
                  confirmText: '我知道了',
                  success: async (res) => {
                    if (res.confirm) {
                      refundOrder(this.order.id)
                          .then((res) => {
                            // 刷新订单列表
                            this.resetAndLoadData();
                          })
                          .catch((err) => {
                          });
                    }
                  }
                });
              }
            });
      } else if (type === 'delete') {
        uni.showModal({
          title: '提示',
          content: '订单删除后将无法恢复，是否确认删除？',
          confirmText: '确认删除',
          cancelText: '暂不删除',
          success: async (res) => {
            if (res.confirm) {
              // 这里应该调用删除订单的API
              try {
                await deleteOrder(this.order.id)
                uni.showToast({
                  title: '订单已删除',
                  icon: 'success'
                });
                // 删除成功后返回上一页
                setTimeout(() => {
                  this.goBack();
                }, 1500)
              } catch (error) {
                uni.showToast({
                  title: error.message || '删除失败',
                  icon: 'none'
                });
              }
            }
          }
        });
      } else if (type === 'contact') {
        this.onCall();
      } else if (type === 'pay') {
        // 防止重复点击
        if (this.isPaying) return;
        this.isPaying = true;

        try {
          uni.showLoading({
            title: '支付中...',
            mask: true
          });

          const payResult = await payRetry(this.order.orderNo)
              .catch((err) => {
                throw new Error(err.error || err.msg || '支付失败');
              });

          uni.hideLoading();

          uni.requestPayment({
            provider: 'wxpay',
            ...(payResult.payParams),
            success: (res) => {
              uni.showToast({
                title: '支付成功',
                icon: 'success'
              });
              // 支付成功后跳转到订单列表
              setTimeout(() => {
                uni.redirectTo({
                  url: '/pages/order/list'
                });
              }, 1500);
            },
            fail: (err) => {
            },
            complete: () => {
              // 重置支付状态
              setTimeout(() => {
                this.isPaying = false;
              }, 1000); // 1秒后才能再次点击
            }
          });
        } catch (error) {
          uni.hideLoading();
          uni.showToast({
            title: error.message || '支付失败',
            icon: 'none'
          });
          // 发生错误时也要重置支付状态
          setTimeout(() => {
            this.isPaying = false;
          }, 1000);
        }
      } else if (type === 'review') {
        uni.showToast({title: '去评价', icon: 'none'});
        // 跳转评价页逻辑
      } else if (type === 'rebook') {
        const query = `?id=${this.order.roomTypeId}&orderId=${this.order.id}`;
        uni.navigateTo({
          url: '/pages/subPackages/order/index' + query
        });
      }
    },
    startCountdown(totalSeconds) {
      this.updateCountdown(totalSeconds);
      this.timer = setInterval(() => {
        totalSeconds--;
        this.updateCountdown(totalSeconds);
        if (totalSeconds <= 0) {
          clearInterval(this.timer);
          this.isCountdownEnded = true;
          this.order.orderStatus = 6;
        }
      }, 1000);
    },
    updateCountdown(totalSeconds) {
      let m = Math.floor(totalSeconds / 60);
      let s = totalSeconds % 60;
      this.minute = m < 10 ? '0' + m : '' + m;
      this.second = s < 10 ? '0' + s : '' + s;
    },
    async onStatusClick() {
      // 请求后端数据
      const response = await getOrderEventTime(this.order.id)
      if (response.length > 0) {
        this.showStatusPopup = true;
        this.timelineList = response
      }
    },
    goToHotelDetail() {
      if (!this.order.hotel || !this.order.hotel.id) {
        uni.showToast({
          title: '酒店信息不存在',
          icon: 'none'
        });
        return;
      }

      uni.navigateTo({
        url: `/pages/subPackages/home/detail?id=${this.order.hotel.id}`,
        success: () => {
        },
        fail: (err) => {
          console.error('跳转失败：', err);
          uni.showToast({
            title: '跳转失败',
            icon: 'none'
          });
        }
      });
    },
  },
  beforeDestroy() {
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
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
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

.countdown {
  display: flex;
  align-items: center;
  gap: 8rpx;
  margin-left: 20rpx;
}

.countdown-block {
  width: 44rpx;
  height: 44rpx;
  background: #FFFFFF;
  border-radius: 8rpx;
  font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;
  font-weight: 500;
  font-size: 28rpx;
  color: #EE781F;
  line-height: 28rpx;
  text-align: left;
  font-style: normal;
  display: flex;
  align-items: center;
  justify-content: center;
}

.countdown-colon {
  color: #FFF;
  font-size: 28rpx;
  font-weight: 600;
  margin: 0 2rpx;
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

.hotel-info-l {
  width: 22rpx;
  height: 38rpx;
  background: url('/static/base/right.png') no-repeat center;
  margin-right: 0;
}
</style>