<template>
  <view class="member-activate-page">
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
      <template #right>
      </template>
    </uni-nav-bar>
    <view class="header-top">
      <!-- 标题 -->
      <view class="title">{{ memberPriceConfig.description }}开通</view>
      <!-- 价格 -->
      <view class="price-section">
        <view class="y">￥</view>
        <view class="price">{{ memberPriceConfig.price ? memberPriceConfig.price.toFixed(2) : '99.00' }}</view>
      </view>
      <view class="desc">{{ memberPriceConfig.legend || '开通后立即生效，有效期一年' }}</view>
      <!-- 会员信息卡片 -->
      <view class="info-card">
        <view class="row">
          <view class="label">会员套餐</view>
          <view class="value">{{ memberPriceConfig.description }}</view>
        </view>
        <view class="row">
          <view class="label">会员期限</view>
          <view class="value">{{ memberPriceConfig.validityPeriod }}天</view>
        </view>
        <view class="row">
          <view class="label">原价</view>
          <view class="value">
            ￥{{ memberPriceConfig.originalPrice ? memberPriceConfig.originalPrice.toFixed(2) : '199.00' }}
          </view>
        </view>
        <view class="row">
          <view class="label">限时优惠</view>
          <view class="value discount">-￥{{
              (memberPriceConfig.originalPrice - memberPriceConfig.price).toFixed(2)
            }}
          </view>
        </view>
        <view class="line"></view>
        <view class="row total">
          <view class="label">实付金额</view>
          <view class="value pay">￥{{ memberPriceConfig.price ? memberPriceConfig.price.toFixed(2) : '99.00' }}</view>
        </view>
      </view>
    </view>
    <!--  邀请码输入  -->
    <view class="pay-title">邀请码</view>
    <view class="invite-code">
      <input class="input" placeholder="请输入邀请码" v-model="inviteCode"/>
    </view>
    <!-- 支付方式 -->
    <view class="pay-title">选择支付方式</view>
    <view class="pay-method-section">
      <view class="pay-method" @click="payType = 'wechat'">
        <image class="icon" src="/static/base/weixin.png" mode="aspectFill"/>
        <view class="text">微信支付</view>
        <image
            :src="payType === 'wechat' ? '/static/base/radio_checked_da.png' : '/static/base/radio_unchecked_da.png'"
            class="custom-radio"
            mode="aspectFit"
            @click.stop="payType = 'wechat'"
        />
      </view>
      <!--      <view class="line"></view>-->
      <!--      <view class="pay-method" @click="payType = 'alipay'">-->
      <!--        <image class="icon" src="/static/base/alipay.png"/>-->
      <!--        <view class="text">支付宝支付</view>-->
      <!--        <radio name="payMethod" :checked="payType === 'alipay'" color="#EE781F" iconSize="10"-->
      <!--               @change="payType = 'alipay'"/>-->
      <!--      </view>-->
    </view>
    <!-- 确认支付按钮 -->
    <view class="pay-btn-footer">
      <view class="pay-btn" @click="onPay">确认支付</view>
    </view>
  </view>
</template>

<script>
import {getMemberPriceConfig, memberOrder, openAMembership} from '@/common/api.js'
import {checkLogin} from "../../../store";
import {pageBack} from "../../../common/redirect";

export default {
  data() {
    return {
      inviteCode: '',
      hotelId: '',
      payType: 'wechat',
      memberPriceConfig: {
        price: 99.00,
        originalPrice: 199.00,
        description: '住小叮年度会员',
        validityPeriod: 365,
        legend: '',
        remark: ''
      }
    }
  },
  onShow() {
    this.getMemberPriceConfig();
  },
  onLoad(options) {
    if (options.scene) {
      this.inviteCode = decodeURIComponent(options.scene)
      this.hotelId = ''
    } else {
      this.inviteCode = options.inviteCode || ''
      this.hotelId = options.hotelId || ''
    }
  },
  methods: {
    async getMemberPriceConfig() {
      try {
        const res = await getMemberPriceConfig();
        const data = res?.arg || res?.data || res || {};
        this.memberPriceConfig = {
          price: data.price || 99.00,
          originalPrice: data.originalPrice || 199.00,
          description: data.description || '住小叮年度会员',
          validityPeriod: data.validityPeriod || 365,
          legend: data.legend || '',
          remark: data.remark || ''
        };
      } catch (e) {
        uni.showToast({title: '获取会员配置失败', icon: 'none'});
      }
    },
    back() {
      pageBack()
    },
    onPay() {
      if (!checkLogin()) {
        uni.navigateTo({
          url: '/pages/subPackages/user/login',
          redirectUrl: '/pages/subPackages/user/member-activate',
          params: {
            inviteCode: this.inviteCode,
            hotelId: this.hotelId,
            business: 'member-activate'
          }
        });
      } else {
        uni.showLoading({
          title: '正在创建订单'
        });
        // 调用开通会员接口
        openAMembership({invitationCode: this.inviteCode, hotelId: this.hotelId}).then(res => {
          uni.hideLoading();
          // 根据支付方式调用不同的支付
          const orderNo = res.orderNo;
          if (this.payType === 'wechat') {
            // 微信支付
            uni.requestPayment({
              provider: 'wxpay',
              ...(res.payParams),
              success: async () => {
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
                        url: `/pages/subPackages/user/member-success?openingTime=${res2.openingTime}&validityPeriod=${res2.validityPeriod}&remark=${encodeURIComponent(this.memberPriceConfig.remark)}&description=${encodeURIComponent(this.memberPriceConfig.description)}`
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
                      // 可以选择跳转到会员详情页或保持在当前页面
                      // uni.redirectTo({ url: '/pages/subPackages/user/member-detail' });
                      return false;
                    }
                  } catch (error) {
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
                await checkOrderStatus();
              },
              fail: (err) => {
              }
            });
          } else {
            // 支付宝支付
            uni.showToast({
              title: '该支付方式暂不支持！',
              icon: 'none'
            });
          }
        }).catch(err => {
          uni.hideLoading();
          uni.showToast({
            title: '创建订单失败',
            icon: 'none'
          });
        });
      }
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
  color: #19191A;
  text-align: center;
  font-style: normal;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 88rpx;
}

.member-activate-page {
  background: #F3F4F6;
  min-height: 100vh;
}

.header-top {
  background: #FFF;
  padding-bottom: 40rpx;
}

.title {
  padding-top: 60rpx;
  height: 40rpx;
  font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;
  font-weight: 500;
  font-size: 40rpx;
  color: #19191A;
  line-height: 40rpx;
  text-align: center;
  font-style: normal;
}

.price-section {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  height: 56rpx;
  margin-top: 60rpx;

  .y {
    height: 36rpx;
    font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;
    font-weight: 400;
    font-size: 36rpx;
    color: #19191A;
    line-height: 36rpx;
    text-align: left;
    font-style: normal;
  }

  .price {
    height: 56rpx;
    font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;
    font-weight: 600;
    font-size: 56rpx;
    color: #19191A;
    line-height: 56rpx;
    text-align: right;
    font-style: normal;
  }
}

.desc {
  width: 364rpx;
  height: 28rpx;
  font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;
  font-weight: 400;
  font-size: 28rpx;
  color: #EE781F;
  line-height: 28rpx;
  text-align: center;
  font-style: normal;
  margin: 26rpx auto auto;
}

.info-card {
  background: #F3F4F6;
  border-radius: 28rpx;
  margin: 66rpx 28rpx 0 28rpx;
  padding: 38rpx 28rpx 40rpx 28rpx;

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

    &.total {
      margin: 0;

      .pay {
        color: #EE781F;
      }
    }

    .discount {
      color: #EE781F;
    }
  }

  .line {
    width: 100%;
    height: 1rpx;
    background: #E8E9EB;
    margin-top: 10rpx;
    margin-bottom: 28rpx;
  }
}

.pay-title {
  width: 192rpx;
  height: 32rpx;
  font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;
  font-weight: 500;
  font-size: 32rpx;
  color: #19191A;
  line-height: 32rpx;
  text-align: left;
  font-style: normal;
  margin: 40rpx 28rpx 0 28rpx;
}

.pay-method-section {
  background: #FFFFFF;
  border-radius: 28rpx;
  margin: 28rpx;
  padding: 34rpx 28rpx 32rpx 28rpx;

  .pay-method {
    display: flex;
    align-items: center;

    &:last-child {
      border-bottom: none;
    }

    .icon {
      width: 40rpx;
      height: 40rpx;
      margin-right: 20rpx;
    }

    .text {
      flex: 1;
      height: 28rpx;
      font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;
      font-weight: 500;
      font-size: 28rpx;
      color: #19191A;
      line-height: 28rpx;
      text-align: left;
      font-style: normal;
    }
  }

  .line {
    height: 1rpx;
    background: #E8E9EB;
    margin-top: 30rpx;
    margin-bottom: 26rpx;
  }
}

.invite-code {
  background: #FFFFFF;
  border-radius: 28rpx;
  margin: 28rpx;
  padding: 34rpx 28rpx 32rpx 28rpx;
}

.pay-btn-footer {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  background: transparent;
  margin: 0 58rpx;
  z-index: 99;
  padding-bottom: calc(32rpx + constant(safe-area-inset-bottom));
  padding-bottom: calc(32rpx + env(safe-area-inset-bottom));

  .pay-btn {
    width: 100%;
    height: 92rpx;
    line-height: 92rpx;
    background: #EE781F;
    border-radius: 44rpx;
    margin-bottom: 0;
    font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;
    font-weight: 500;
    font-size: 32rpx;
    color: #FFFFFF;
    text-align: center;
  }
}

.custom-radio {
  width: 36rpx;
  height: 36rpx;
}


</style> 