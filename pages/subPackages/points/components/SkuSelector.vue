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
          <image :src="selectedSku.imageUrl || product.mainImage" class="sku-image" mode="aspectFill" />
          <view class="sku-info">
            <view class="sku-price">
              <text class="points">{{ selectedSku.pointsRequired || 0 }}</text>
              <text class="points-unit">积分</text>
              <text v-if="selectedSku.cashRequired > 0" class="cash">+¥{{ selectedSku.cashRequired }}</text>
            </view>
            <view class="sku-stock">库存：{{ selectedSku.stock || 0 }}</view>
          </view>
        </view>
        <view class="close-btn" @click="handleClose">
          <u-icon name="close" size="40" color="#666666" />
        </view>
      </view>

      <!-- 规格选择 -->
      <view class="spec-section">
        <view class="section-title">选择规格</view>
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
          </view>
        </view>
      </view>

      <!-- 数量选择 -->
      <view class="quantity-section">
        <view class="section-title">数量</view>
        <u-number-box 
          v-model="quantity" 
          :min="1" 
          :max="selectedSku.stock || 1"
          button-size="60"
          input-width="100"
        />
      </view>

      <!-- 底部按钮 -->
      <view class="footer">
        <view class="total-price">
          <text class="total-label">合计：</text>
          <text class="total-points">{{ totalPoints }}</text>
          <text class="total-unit">积分</text>
          <text v-if="totalCash > 0" class="total-cash">+¥{{ totalCash }}</text>
        </view>
        <button 
          class="confirm-btn" 
          :disabled="!selectedSku.id || selectedSku.stock === 0"
          @click="handleConfirm"
        >
          立即兑换
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
        // 默认选中第一个有库存的SKU
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

.sku-image {
  width: 160rpx;
  height: 160rpx;
  border-radius: 16rpx;
  background: #F5F5F5;
  flex-shrink: 0;
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
  font-size: 48rpx;
  color: #FF6B35;
  font-weight: bold;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif;
}

.points-unit {
  font-size: 24rpx;
  color: #FF6B35;
  margin-left: 4rpx;
}

.cash {
  font-size: 28rpx;
  color: #FF6B35;
  margin-left: 12rpx;
}

.sku-stock {
  font-size: 24rpx;
  color: #999999;
}

.close-btn {
  padding: 8rpx;
  margin-left: 20rpx;
}

.spec-section,
.quantity-section {
  padding: 32rpx;
}

.section-title {
  font-size: 28rpx;
  color: #1A1A1A;
  font-weight: 500;
  margin-bottom: 24rpx;
}

.spec-list {
  display: flex;
  flex-wrap: wrap;
  gap: 20rpx;
}

.spec-item {
  position: relative;
  padding: 16rpx 32rpx;
  background: #F7F8FA;
  border-radius: 12rpx;
  border: 2rpx solid transparent;
  transition: all 0.3s ease;
}

.spec-item-active {
  background: #FFF4F0;
  border-color: #FF6B35;
}

.spec-item-disabled {
  opacity: 0.5;
}

.spec-text {
  font-size: 26rpx;
  color: #1A1A1A;
}

.spec-item-active .spec-text {
  color: #FF6B35;
  font-weight: 500;
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
  font-size: 20rpx;
  color: #999999;
}

.footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24rpx 32rpx;
  border-top: 1rpx solid #F0F0F0;
}

.total-price {
  display: flex;
  align-items: baseline;
}

.total-label {
  font-size: 26rpx;
  color: #666666;
}

.total-points {
  font-size: 40rpx;
  color: #FF6B35;
  font-weight: bold;
  margin-left: 8rpx;
}

.total-unit {
  font-size: 22rpx;
  color: #FF6B35;
  margin-left: 4rpx;
}

.total-cash {
  font-size: 24rpx;
  color: #FF6B35;
  margin-left: 8rpx;
}

.confirm-btn {
  width: 280rpx;
  height: 80rpx;
  background: linear-gradient(135deg, #FF6B35 0%, #FF8E53 100%);
  border-radius: 40rpx;
  color: #FFFFFF;
  font-size: 28rpx;
  font-weight: 500;
  border: none;
  box-shadow: 0 8rpx 24rpx rgba(255, 107, 53, 0.3);
}

.confirm-btn[disabled] {
  background: #D1D1D6;
  box-shadow: none;
}
</style>
