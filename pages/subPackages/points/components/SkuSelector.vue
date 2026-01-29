<template>
  <u-popup 
    :show="show" 
    mode="bottom" 
    :round="40"
    @close="handleClose"
  >
    <view class="sku-selector">
      <!-- 头部 -->
      <view class="header">
        <view class="header-content">
          <view class="sku-image-wrapper">
            <image 
              :src="selectedSku.imageUrl || product.mainImage" 
              class="sku-image" 
              mode="aspectFill" 
            />
            <view class="image-border"></view>
          </view>
          <view class="sku-info">
            <view class="sku-price">
              <text class="points">{{ selectedSku.pointsRequired || 0 }}</text>
              <text class="points-unit">积分</text>
              <text v-if="selectedSku.cashRequired > 0" class="cash">+¥{{ selectedSku.cashRequired }}</text>
            </view>
            <view class="sku-stock">
              <text class="stock-label">库存：</text>
              <text class="stock-value">{{ selectedSku.stock || 0 }}</text>
            </view>
          </view>
        </view>
        <view class="close-btn" @click="handleClose">
          <view class="close-icon">
            <u-icon name="close" size="36" color="#666666" />
          </view>
        </view>
      </view>

      <!-- 规格选择 -->
      <view class="spec-section">
        <view class="section-title">
          <text class="title-text">选择规格</text>
          <view class="title-decoration"></view>
        </view>
        <view class="spec-list">
          <view 
            v-for="sku in skuList" 
            :key="sku.id"
            class="spec-item"
            :class="{ 
              'spec-item-active': selectedSku.id === sku.id,
              'spec-item-disabled': sku.stock === 0
            }"
            @click="handleSelectSku(sku)"
          >
            <text class="spec-text">{{ sku.specValue }}</text>
            <view v-if="sku.stock === 0" class="spec-disabled-mask">
              <text class="disabled-text">无货</text>
            </view>
            <view v-if="selectedSku.id === sku.id" class="spec-check">
              <u-icon name="checkbox-mark" color="#FFFFFF" size="24" />
            </view>
          </view>
        </view>
      </view>

      <!-- 数量选择 -->
      <view class="quantity-section">
        <view class="section-title">
          <text class="title-text">数量</text>
          <view class="title-decoration"></view>
        </view>
        <u-number-box 
          v-model="quantity" 
          :min="1" 
          :max="selectedSku.stock || 1"
          button-size="64"
          input-width="120"
          bg-color="#F7F8FA"
          button-color="#FF7043"
        />
      </view>

      <!-- 底部按钮 -->
      <view class="footer">
        <view class="total-section">
          <text class="total-label">合计</text>
          <view class="total-price">
            <text class="total-points">{{ totalPoints }}</text>
            <text class="total-unit">积分</text>
            <text v-if="totalCash > 0" class="total-cash">+¥{{ totalCash }}</text>
          </view>
        </view>
        <button 
          class="confirm-btn" 
          :class="{ 'btn-disabled': !selectedSku.id || selectedSku.stock === 0 }"
          :disabled="!selectedSku.id || selectedSku.stock === 0"
          @click="handleConfirm"
        >
          <text class="btn-text">立即兑换</text>
        </button>
      </view>
    </view>
  </u-popup>
</template>

<script>
export default {
  name: 'SkuSelector',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    product: {
      type: Object,
      default: () => ({})
    },
    skuList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      selectedSku: {},
      quantity: 1
    };
  },
  computed: {
    totalPoints() {
      return (this.selectedSku.pointsRequired || 0) * this.quantity;
    },
    totalCash() {
      return ((this.selectedSku.cashRequired || 0) * this.quantity).toFixed(2);
    }
  },
  watch: {
    show(val) {
      if (val && this.skuList.length > 0) {
        const availableSku = this.skuList.find(sku => sku.stock > 0);
        if (availableSku) {
          this.selectedSku = availableSku;
        } else {
          this.selectedSku = this.skuList[0];
        }
        this.quantity = 1;
      }
    }
  },
  methods: {
    handleSelectSku(sku) {
      if (sku.stock === 0) return;
      this.selectedSku = sku;
      this.quantity = 1;
    },
    handleClose() {
      this.$emit('close');
    },
    handleConfirm() {
      if (!this.selectedSku.id || this.selectedSku.stock === 0) {
        uni.showToast({
          title: '请选择有库存的规格',
          icon: 'none'
        });
        return;
      }
      this.$emit('confirm', {
        skuId: this.selectedSku.id,
        quantity: this.quantity
      });
    }
  }
};
</script>

<style scoped>
.sku-selector {
  background: #FFFFFF;
  padding-bottom: env(safe-area-inset-bottom);
}

/* 头部 */
.header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 32rpx;
  border-bottom: 1rpx solid #F0F0F0;
}

.header-content {
  flex: 1;
  display: flex;
}

.sku-image-wrapper {
  position: relative;
  width: 160rpx;
  height: 160rpx;
  flex-shrink: 0;
}

.sku-image {
  width: 100%;
  height: 100%;
  border-radius: 20rpx;
  background: #F5F5F5;
}

.image-border {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border: 2rpx solid rgba(255, 112, 67, 0.2);
  border-radius: 20rpx;
  pointer-events: none;
}

.sku-info {
  flex: 1;
  margin-left: 24rpx;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.sku-price {
  display: flex;
  align-items: baseline;
}

.points {
  font-size: 52rpx;
  color: #FF7043;
  font-weight: bold;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif;
  line-height: 1;
}

.points-unit {
  font-size: 24rpx;
  color: #FF7043;
  margin-left: 6rpx;
}

.cash {
  font-size: 28rpx;
  color: #FF7043;
  margin-left: 12rpx;
}

.sku-stock {
  display: flex;
  align-items: baseline;
  margin-top: 16rpx;
}

.stock-label {
  font-size: 24rpx;
  color: #999999;
}

.stock-value {
  font-size: 28rpx;
  color: #1A1A1A;
  font-weight: 500;
}

.close-btn {
  padding: 8rpx;
  margin-left: 20rpx;
}

.close-icon {
  width: 56rpx;
  height: 56rpx;
  background: #F7F8FA;
  border-radius: 28rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 规格选择 */
.spec-section,
.quantity-section {
  padding: 32rpx;
}

.section-title {
  display: flex;
  align-items: center;
  margin-bottom: 24rpx;
}

.title-text {
  font-size: 30rpx;
  color: #1A1A1A;
  font-weight: 600;
}

.title-decoration {
  width: 40rpx;
  height: 6rpx;
  background: linear-gradient(90deg, #FF7043 0%, transparent 100%);
  border-radius: 3rpx;
  margin-left: 16rpx;
}

.spec-list {
  display: flex;
  flex-wrap: wrap;
  gap: 20rpx;
}

.spec-item {
  position: relative;
  min-width: 160rpx;
  padding: 20rpx 32rpx;
  background: #F7F8FA;
  border-radius: 16rpx;
  border: 2rpx solid transparent;
  transition: all 0.3s ease;
}

.spec-item-active {
  background: linear-gradient(135deg, #FFF4F0 0%, #FFE8E0 100%);
  border-color: #FF7043;
}

.spec-item-disabled {
  opacity: 0.4;
}

.spec-text {
  font-size: 26rpx;
  color: #1A1A1A;
}

.spec-item-active .spec-text {
  color: #FF7043;
  font-weight: 600;
}

.spec-disabled-mask {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.disabled-text {
  font-size: 22rpx;
  color: #999999;
}

.spec-check {
  position: absolute;
  top: -4rpx;
  right: -4rpx;
  width: 36rpx;
  height: 36rpx;
  background: linear-gradient(135deg, #FF7043 0%, #FF5722 100%);
  border-radius: 18rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4rpx 12rpx rgba(255, 112, 67, 0.3);
}

/* 底部按钮 */
.footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24rpx 32rpx;
  border-top: 1rpx solid #F0F0F0;
  background: #FAFAFA;
}

.total-section {
  flex: 1;
}

.total-label {
  font-size: 24rpx;
  color: #999999;
  display: block;
  margin-bottom: 8rpx;
}

.total-price {
  display: flex;
  align-items: baseline;
}

.total-points {
  font-size: 44rpx;
  color: #FF7043;
  font-weight: bold;
  line-height: 1;
}

.total-unit {
  font-size: 22rpx;
  color: #FF7043;
  margin-left: 4rpx;
}

.total-cash {
  font-size: 26rpx;
  color: #FF7043;
  margin-left: 8rpx;
}

.confirm-btn {
  width: 280rpx;
  height: 88rpx;
  background: linear-gradient(135deg, #FF7043 0%, #FF5722 100%);
  border-radius: 44rpx;
  border: none;
  box-shadow: 0 8rpx 24rpx rgba(255, 112, 67, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-disabled {
  background: #D1D1D6;
  box-shadow: none;
}

.btn-text {
  color: #FFFFFF;
  font-size: 30rpx;
  font-weight: 600;
}
</style>
