<template>
  <u-popup 
    :show="show" 
    mode="bottom" 
    :round="20"
    @close="handleClose"
    :closeable="true"
  >
    <view class="sku-selector">
      <!-- 商品信息 -->
      <view class="sku-header">
        <image 
          class="sku-image" 
          :src="currentSku.imageUrl || product.mainImage" 
          mode="aspectFill"
        />
        <view class="sku-info">
          <view class="sku-price">
            <text class="points">{{ currentSku.pointsRequired || 0 }}</text>
            <text class="points-unit">积分</text>
            <text v-if="currentSku.cashRequired > 0" class="cash">+¥{{ currentSku.cashRequired }}</text>
          </view>
          <view class="sku-stock">库存: {{ currentSku.totalStock || 0 }}</view>
          <view v-if="selectedSpec" class="sku-spec">已选: {{ selectedSpec }}</view>
        </view>
      </view>

      <!-- 规格选择 -->
      <view class="sku-specs">
        <view class="spec-title">规格</view>
        <view class="spec-options">
          <view 
            v-for="sku in skuList" 
            :key="sku.id"
            :class="['spec-option', { 
              'active': selectedSkuId === sku.id,
              'disabled': sku.totalStock === 0
            }]"
            @click="selectSku(sku)"
          >
            {{ sku.specValue }}
          </view>
        </view>
      </view>

      <!-- 数量选择 -->
      <view class="sku-quantity">
        <view class="quantity-title">数量</view>
        <u-number-box 
          v-model="quantity" 
          :min="1" 
          :max="currentSku.totalStock || 1"
          @change="handleQuantityChange"
        />
      </view>

      <!-- 总计 -->
      <view class="sku-total">
        <view class="total-label">合计:</view>
        <view class="total-price">
          <text class="points">{{ totalPoints }}</text>
          <text class="points-unit">积分</text>
          <text v-if="totalCash > 0" class="cash">+¥{{ totalCash }}</text>
        </view>
      </view>

      <!-- 确认按钮 -->
      <view class="sku-footer">
        <button 
          class="confirm-btn" 
          :disabled="!selectedSkuId || currentSku.totalStock === 0"
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
      selectedSkuId: null,
      quantity: 1
    }
  },
  computed: {
    currentSku() {
      if (!this.selectedSkuId) {
        return this.skuList[0] || {};
      }
      return this.skuList.find(sku => sku.id === this.selectedSkuId) || {};
    },
    selectedSpec() {
      return this.currentSku.specValue || '';
    },
    totalPoints() {
      return (this.currentSku.pointsRequired || 0) * this.quantity;
    },
    totalCash() {
      return (this.currentSku.cashRequired || 0) * this.quantity;
    }
  },
  watch: {
    show(val) {
      if (val && this.skuList.length > 0) {
        // 默认选中第一个有库存的SKU
        const availableSku = this.skuList.find(sku => sku.totalStock > 0);
        if (availableSku) {
          this.selectedSkuId = availableSku.id;
        }
        this.quantity = 1;
      }
    }
  },
  methods: {
    selectSku(sku) {
      if (sku.totalStock === 0) {
        uni.showToast({
          title: '该规格已售罄',
          icon: 'none'
        });
        return;
      }
      this.selectedSkuId = sku.id;
      // 重置数量
      if (this.quantity > sku.totalStock) {
        this.quantity = sku.totalStock;
      }
    },
    handleQuantityChange(value) {
      this.quantity = value;
    },
    handleConfirm() {
      if (!this.selectedSkuId) {
        uni.showToast({
          title: '请选择规格',
          icon: 'none'
        });
        return;
      }
      if (this.currentSku.totalStock === 0) {
        uni.showToast({
          title: '该商品已售罄',
          icon: 'none'
        });
        return;
      }
      this.$emit('confirm', {
        skuId: this.selectedSkuId,
        sku: this.currentSku,
        quantity: this.quantity,
        totalPoints: this.totalPoints,
        totalCash: this.totalCash
      });
    },
    handleClose() {
      this.$emit('close');
    }
  }
}
</script>

<style scoped>
.sku-selector {
  padding: 40rpx;
  background: #FFFFFF;
  max-height: 80vh;
  overflow-y: auto;
}

.sku-header {
  display: flex;
  margin-bottom: 40rpx;
}

.sku-image {
  width: 160rpx;
  height: 160rpx;
  border-radius: 12rpx;
  flex-shrink: 0;
}

.sku-info {
  flex: 1;
  margin-left: 20rpx;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.sku-price {
  display: flex;
  align-items: baseline;
}

.points {
  font-size: 40rpx;
  color: #EE781F;
  font-weight: bold;
}

.points-unit {
  font-size: 24rpx;
  color: #EE781F;
  margin-left: 4rpx;
}

.cash {
  font-size: 28rpx;
  color: #EE781F;
  margin-left: 8rpx;
}

.sku-stock {
  font-size: 24rpx;
  color: #A2A2A8;
  margin-top: 8rpx;
}

.sku-spec {
  font-size: 24rpx;
  color: #19191A;
  margin-top: 8rpx;
}

.sku-specs {
  margin-bottom: 40rpx;
}

.spec-title {
  font-size: 28rpx;
  color: #19191A;
  font-weight: 500;
  margin-bottom: 20rpx;
}

.spec-options {
  display: flex;
  flex-wrap: wrap;
  gap: 20rpx;
}

.spec-option {
  padding: 16rpx 32rpx;
  background: #F3F4F6;
  border-radius: 8rpx;
  font-size: 28rpx;
  color: #19191A;
  border: 2rpx solid transparent;
}

.spec-option.active {
  background: #FFF5ED;
  border-color: #EE781F;
  color: #EE781F;
}

.spec-option.disabled {
  background: #F3F4F6;
  color: #D1D1D6;
}

.sku-quantity {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 40rpx;
}

.quantity-title {
  font-size: 28rpx;
  color: #19191A;
  font-weight: 500;
}

.sku-total {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20rpx 0;
  border-top: 1rpx solid #F3F4F6;
  margin-bottom: 40rpx;
}

.total-label {
  font-size: 28rpx;
  color: #19191A;
  font-weight: 500;
}

.total-price {
  display: flex;
  align-items: baseline;
}

.sku-footer {
  padding-bottom: env(safe-area-inset-bottom);
}

.confirm-btn {
  width: 100%;
  height: 88rpx;
  background: #EE781F;
  border-radius: 44rpx;
  color: #FFFFFF;
  font-size: 32rpx;
  font-weight: 500;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
}

.confirm-btn[disabled] {
  background: #D1D1D6;
}
</style>
