<template>
  <view class="receive-page">
    <uni-nav-bar
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
      <view class="title">住小叮红包</view>
      <view class="subtitle" v-if="coupon.redPacket.amount">您的好友分享了一个{{ coupon.redPacket.amount }}元红包</view>
      <view class="coupon-card">
        <image class="bg-image" src="/static/share/coupon_share.png" mode="aspectFit"/>
        <view class="site">
          <view class="amount">
            <text class="symbol" v-if="coupon.redPacket.amount">¥</text>
            <text class="number" v-if="coupon.redPacket.amount">{{ coupon.redPacket.amount }}</text>
          </view>
          <text v-if="coupon.redPacket.minSpend > 0" class="limit">满{{ coupon.redPacket.minSpend }}元可用</text>
          <text v-else class="limit">无门槛立减</text>
          <view class="name">{{ coupon.redPacket.name }}</view>
          <view class="expire" v-if="coupon">有效期至{{
              formatDate(coupon.endTime ? coupon.endTime : "")
            }}
          </view>
          <text v-if="coupon.redPacket.scopeType === 1"
                class="store">适用于全部门店
          </text>
          <text v-else class="store">适用于指定门店</text>

        </view>
      </view>
      <!-- 按钮区域放在图片下方 -->
      <view class="button-area">
        <view
            class="receive-btn"
            :class="{ 'receiving': receiving, 'disabled': isSelfShare || receiveStatus }"
            :disabled="receiving || isSelfShare || receiveStatus"
            @click="receiveCoupon"
        >
          {{
            receiving ? '领取中...' : (receiveStatus ? '已被领取' : (isSelfShare ? '不能领取自己的红包' : '立即领取'))
          }}
        </view>
        <button v-if="!receiveStatus"
                class="share-btn"
                plain="true"
                open-type="share"
                :data-coupon="coupon"
        >分享给好友
        </button>
      </view>
    </view>
    <!-- 添加隐藏的canvas -->
    <canvas canvas-id="shareCanvas" class="share-canvas"></canvas>
  </view>
</template>

<script>
import {exampleCouponInfo, receive} from "../../../common/api";
import {checkLogin, getUserInfo} from "../../../store";
import coupon from "../../coupon/index.vue";
import {pageBack} from "../../../common/redirect";

export default {
  data() {
    return {
      coupon: {},
      spread: '', // 保存传递的spread参数
      receiving: false, // 防止重复点击
      isItAvailable: false, // 是否是自己的分享
      receiveStatus: false // 是否是自己的分享
    }
  },
  onLoad(options) {
    uni.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#FFFFFF'
    });
    uni.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    });
    if (options.spread) {
      this.spread = options.spread; // 保存spread参数
      this.exampleCouponInfo(options.spread);
    }
  },
  onShow() {
    // 现在登录跳转逻辑已经改为：登录 → 首页 → 红包页面
    // 如果是从首页跳转过来的，检查是否需要自动领取
    const autoReceive = uni.getStorageSync('autoReceiveCoupon');
    if (autoReceive && checkLogin() && this.spread) {
      uni.removeStorageSync('autoReceiveCoupon');
      // 稍微延迟执行领取，确保页面已经完全显示
      setTimeout(() => {
        this.doReceive();
      }, 500);
    }
  },
  methods: {
    back() {
      pageBack()
    },
    formatDate(dateStr) {
      if (!dateStr) return '';
      const date = new Date(dateStr);
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      const year = date.getFullYear().toString();
      return `${year}.${month}.${day}`;
    },
    async exampleCouponInfo(spread) {
      this.coupon = await exampleCouponInfo(spread)
      // 判断是否是自己的分享
      const userInfo = getUserInfo('userInfo')
      if (userInfo && this.coupon.userId === userInfo.id) {
        this.isSelfShare = true
      }
      if (this.coupon.deleted === 1) {
        this.receiveStatus = true
      }
    },
    async receiveCoupon() {
      // 防止重复点击
      if (this.receiving) {
        return;
      }
      // 检查是否已登录
      if (!checkLogin()) {
        await uni.navigateTo({
          url: '/pages/subPackages/user/login',
          redirectUrl: `/pages/subPackages/coupon/receive?spread=${this.spread}`,
          params: {
            spread: this.spread,
            business: 'coupon'
          }
        });
        return;
      }
      // 已登录，直接领取
      await this.doReceive();
    },

    async doReceive() {
      if (this.receiving) {
        return;
      }

      if (!this.spread) {
        uni.showToast({
          title: '参数错误',
          icon: 'none'
        });
        return;
      }

      this.receiving = true;
      try {
        const result = await receive(this.spread);
        uni.showToast({
          title: '领取成功',
          icon: 'success',
          duration: 2000,
          success: () => {
            setTimeout(() => {
              uni.navigateTo({
                url: '/pages/subPackages/coupon/receive-success'
              });
            }, 2000);
          }
        });
      } catch (error) {
        uni.hideLoading();
        uni.showToast({
          title: error.error,
          icon: 'none'
        });
      } finally {
        this.receiving = false;
      }
    },
    // 绘制分享图片
    async drawShareImage(coupon) {
      return new Promise((resolve, reject) => {
        const ctx = uni.createCanvasContext('shareCanvas', this);
        const canvasWidth = 500;
        const canvasHeight = 400;

        // 绘制背景图
        ctx.drawImage('/static/share/coupon_share.png', 0, 0, canvasWidth, canvasHeight);

        // 绘制金额
        ctx.setFillStyle('#E81B2D');
        ctx.setTextAlign('center');
        ctx.setTextBaseline('middle');

        // 绘制¥符号
        ctx.setFontSize(30);
        ctx.fillText('¥', canvasWidth / 2 - 40, 110);

        // 绘制金额数字
        ctx.setFontSize(52);
        ctx.fillText(coupon.redPacket.amount, canvasWidth / 2 + 5, 102);

        let amountText = ""
        if (coupon.redPacket.minSpend > 0) {
          amountText = "满" + coupon.redPacket.minSpend + "元可用";
        } else {
          amountText = "无门槛立减";
        }
        // 绘制使用条件
        ctx.setFillStyle('#19191A');
        ctx.setFontSize(24);
        ctx.fillText(amountText, canvasWidth / 2, 148);

        // 绘制标题
        ctx.setFillStyle('#FFFFFF');
        ctx.setFontSize(28);
        ctx.fillText(coupon.redPacket.name, canvasWidth / 2, 240);

        // 绘制有效期
        ctx.setFontSize(20);
        ctx.setFillStyle('#FFFFFF');
        const time = this.formatDate(coupon.endTime)
        ctx.fillText(`有效期至${time}`, canvasWidth / 2, 280);
        // 绘制适用范围
        const text = coupon.redPacket.scopeType === 1 ? '适用于全部门店' : '适用于指定门店';
        ctx.fillText(text, canvasWidth / 2, 310);
        // 执行绘制
        ctx.draw(false, () => {
          uni.canvasToTempFilePath({
            canvasId: 'shareCanvas',
            success: (res) => {
              resolve(res.tempFilePath);
            },
            fail: (err) => {
              reject(err);
            }
          }, this);
        });
      });
    },

    // 分享到朋友圈
    async onShareTimeline(res) {
      if (res.from === 'button') {
        const coupon = res.target.dataset.coupon;
        try {
          // 生成分享图片
          const shareImagePath = await this.drawShareImage(coupon);
          return {
            title: '您有一份来自好友的红包分享，请查收！',
            desc: `您的好友分享了一个${coupon.redPacket.amount}元红包`,
            path: `/pages/subPackages/coupon/receive?id=${coupon.redPacket.id}&amount=${coupon.redPacket.amount}&spread=${coupon.id}`,
            imageUrl: shareImagePath
          }
        } catch (err) {
          console.error('生成分享图片失败:', err);
          // 使用默认图片
          return {
            title: '您有一份来自好友的红包分享，请查收！',
            desc: `您的好友分享了一个${coupon.redPacket.amount}元红包`,
            path: `/pages/subPackages/coupon/receive?id=${coupon.redPacket.id}&amount=${coupon.redPacket.amount}&spread=${coupon.id}`,
            imageUrl: '/static/share/coupon_share.png'
          }
        }
      }
      return {
        title: '您有一份来自好友的红包分享，请查收！',
        desc: '您的好友给您发了一个红包',
        path: '/pages/subPackages/coupon/receive',
        imageUrl: '/static/share/coupon_share.png'
      }
    },

    // 分享给好友
    async onShareAppMessage(res) {
      if (res.from === 'button') {
        const coupon = res.target.dataset.coupon;
        try {
          // 生成分享图片
          const shareImagePath = await this.drawShareImage(coupon);
          return {
            title: '您有一份来自好友的红包分享，请查收！',
            desc: `您的好友分享了一个${coupon.redPacket.amount}元红包`,
            path: `/pages/subPackages/coupon/receive?id=${coupon.redPacket.id}&amount=${coupon.redPacket.amount}&spread=${coupon.id}`,
            imageUrl: shareImagePath
          }
        } catch (err) {
          console.error('生成分享图片失败:', err);
          // 使用默认图片
          return {
            title: '您有一份来自好友的红包分享，请查收！',
            desc: `您的好友分享了一个${coupon.redPacket.amount}元红包`,
            path: `/pages/subPackages/coupon/receive?id=${coupon.redPacket.id}&amount=${coupon.redPacket.amount}&spread=${coupon.id}`,
            imageUrl: '/static/share/coupon_share.png'
          }
        }
      }
      return {
        title: '您有一份来自好友的红包分享，请查收！',
        desc: '您的好友给您发了一个红包',
        path: '/pages/subPackages/coupon/receive',
        imageUrl: '/static/share/coupon_share.png'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.receive-page {
  min-height: 100vh;
  background: linear-gradient(180deg, #FFF6E7 0%, #FFF9F0 100%);
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

    .title {
      margin-top: 66rpx;
      height: 64rpx;
      font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;
      font-weight: 600;
      font-size: 64rpx;
      color: #EE781F;
      line-height: 64rpx;
      text-align: center;
      font-style: normal;
    }

    .subtitle {
      margin-top: 28rpx;
      height: 28rpx;
      font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;
      font-weight: 500;
      font-size: 28rpx;
      color: #EE781F;
      line-height: 28rpx;
      text-align: center;
      font-style: normal;
    }

    .coupon-card {
      position: relative;
      margin-top: -40rpx;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: auto;

      .bg-image {
        position: absolute;
        top: 0;
        width: 100%;
        height: 682rpx;
        z-index: 0;
      }

      .site {
        width: 100%;
        height: 682rpx;
        z-index: 1;
      }

      .amount {
        z-index: 3;
        font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;
        font-weight: 600;
        font-size: 100rpx;
        color: #E81B2D;
        text-align: center;
        font-style: normal;
        margin: 100rpx 320rpx 0 320rpx;

        .symbol {
          font-size: 40rpx;
        }

        .number {
          font-size: 80rpx;
          font-weight: 600;
        }
      }

      .limit {
        z-index: 2;
        height: 32rpx;
        font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;
        font-weight: 500;
        font-size: 32rpx;
        color: #19191A;
        line-height: 32rpx;
        text-align: center;
        font-style: normal;
      }

      .name {
        z-index: 2;
        font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;
        font-weight: 500;
        font-size: 32rpx;
        color: #FFFFFF;
        line-height: 32rpx;
        text-align: center;
        font-style: normal;
        margin-top: 94rpx;
      }

      .expire {
        z-index: 2;
        height: 28rpx;
        font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;
        font-weight: 400;
        font-size: 28rpx;
        color: #FFFFFF;
        line-height: 28rpx;
        text-align: center;
        font-style: normal;
        margin-top: 48rpx;
      }

      .store {
        z-index: 2;
        height: 28rpx;
        font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;
        font-weight: 400;
        font-size: 28rpx;
        color: #FFFFFF;
        line-height: 28rpx;
        text-align: center;
        font-style: normal;
        margin-top: 14rpx;
      }
    }

    .button-area {
      margin-top: 0rpx;
      padding: 0 58rpx;

      .receive-btn {
        width: 100%;
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
        margin-bottom: 28rpx;
        transition: all 0.3s ease;
        position: relative;
        overflow: hidden;

        &.receiving {
          background: #CCCCCC;
          opacity: 0.7;

          &::after {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
            animation: loading 1.5s infinite;
          }
        }

        &.disabled {
          background: #CCCCCC;
          opacity: 0.7;
          cursor: not-allowed;
        }

        &:disabled {
          background: #CCCCCC;
          opacity: 0.7;
        }
      }

      @keyframes loading {
        0% {
          left: -100%;
        }
        100% {
          left: 100%;
        }
      }

      .share-btn {
        width: 100%;
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
        padding: 0;

        /* 移除按钮默认样式 */
        &::after {
          border: none;
        }
      }
    }
  }

  .coin-left {
    position: absolute;
    left: 0;
    bottom: 200rpx;
    width: 200rpx;
    height: 200rpx;
    opacity: 0.6;
  }

  .coin-right {
    position: absolute;
    right: 0;
    bottom: 400rpx;
    width: 200rpx;
    height: 200rpx;
    opacity: 0.6;
  }

  .share-canvas {
    position: fixed;
    left: -9999px;
    width: 500px;
    height: 400px;
    visibility: hidden;
  }
}
</style> 