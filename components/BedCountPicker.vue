<template>
  <view class="bed-picker-mask" @click.stop="handleMaskClick">
    <view class="bed-picker-content" @click.stop>
      <view class="bed-picker-header">
        <text class="title">选择床位数</text>
        <text class="close-icon" @click="onClose"/>
      </view>
      <view class="line"></view>
      <view class="bed-picker-body">
        <view class="bed-count-row">
          <text class="label">床位数</text>
          <view class="counter">
            <view :class="['minus', value <= 1 || !canItBeModified ? 'disabled' : '']" @click="handleMinus"/>
            <text class="count">{{ value }}</text>
            <view :class="['plus', value >= 20 || !canItBeModified ? 'disabled' : '']" @click="handlePlus"/>
          </view>
        </view>
      </view>
      <view class="bed-picker-footer" @click="handleConfirm">
        <view class="confirm-btn">完成</view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'BedCountPicker',
  props: {
    value: {
      type: Number,
      default: 1
    },
    canItBeModified: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      agreeChecked: false
    }
  },
  methods: {
    handleMaskClick() {
      this.$emit('close');
    },
    onClose() {
      this.$emit('close');
    },
    handleMinus() {
      if (this.canItBeModified && this.value > 1) {
        this.$emit('input', this.value - 1);
      }
    },
    handlePlus() {
      if (this.canItBeModified && this.value < 20) {
        this.$emit('input', this.value + 1);
      }
    },
    handleConfirm() {
      this.$emit('confirm', this.value);
      this.$emit('close');
    },
    toggleAgree() {
      this.agreeChecked = !this.agreeChecked;
    },
    goToBookingNotice() {
      this.$emit('goToBookingNotice');
    },
    goToPaymentAgreement() {
      this.$emit('goToPaymentAgreement');
    }
  }
};
</script>

<style scoped>
.bed-picker-mask {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: rgba(25, 25, 26, 0.6);
  z-index: 99999;
}

.bed-picker-content {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  transform: translateY(0);
  background: #FFFFFF;
  box-shadow: 0 0 20rpx 0 rgba(0, 0, 0, 0.2);
  border-radius: 28rpx 28rpx 0 0;
  height: auto;
  padding-bottom: constant(safe-area-inset-bottom); /* iOS 11.2+ */
  padding-bottom: env(safe-area-inset-bottom); /* iOS 11.2+ */
}

.bed-picker-header {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 42rpx 0 38rpx 0;
  position: relative;
}

.line {
  width: 100%;
  height: 1rpx;
  background: #E8E9EB;
  margin-bottom: 36rpx;
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

.bed-count-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 64rpx;
  padding: 0 54rpx 0 56rpx;
  margin-bottom: 58rpx;
}

.label {
  height: 32rpx;
  font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;
  font-weight: 400;
  font-size: 32rpx;
  color: #19191A;
  line-height: 32rpx;
  text-align: left;
  font-style: normal;
}

.counter {
  display: flex;
  align-items: center;
  gap: 18rpx;
}

.minus, .plus {
  width: 56rpx;
  height: 56rpx;
  background-size: cover;
  background-position: center;
}

.minus {
  background-image: url('@/static/base/popup_icon_minus.png');
}

.minus.disabled {
  background-image: url('@/static/base/popup_icon_minus_disabled.png');
}

.plus {
  background-image: url('@/static/base/popup_icon_plus.png');
}

.plus.disabled {
  background-image: url('@/static/base/popup_icon_plus_disabled.png');
}

.count {
  font-size: 32rpx;
  color: #19191A;
  min-width: 60rpx;
  text-align: center;
  font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;
  font-weight: 500;
  line-height: 32rpx;
}

.bed-picker-body {
  padding: 0 32rpx;
}

.bed-picker-footer {
  margin: auto;
  width: 640rpx;
  height: 92rpx;
  background: #EE781F;
  border-radius: 50rpx;
  margin-bottom: calc(80rpx + constant(safe-area-inset-bottom)); /* iOS 11.2+ */
  margin-bottom: calc(80rpx + env(safe-area-inset-bottom)); /* iOS 11.2+ */
  display: flex;
  align-items: center;
  justify-content: center;
}

@supports not (constant(safe-area-inset-bottom)) {
  .bed-picker-footer {
    margin-bottom: 80rpx;
  }

  .bed-picker-content {
    padding-bottom: 0;
  }
}

.confirm-btn {
  width: auto;
  height: 32rpx;
  font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;
  font-weight: 500;
  font-size: 32rpx;
  color: #FFFFFF;
  line-height: 32rpx;
  text-align: center;
  font-style: normal;
}
</style> 