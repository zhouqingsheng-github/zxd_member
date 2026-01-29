<template>
  <view 
    :class="['store-card', { 'disabled': store.stock === 0 }]" 
    @click="handleClick"
  >
    <view class="store-info">
      <view class="store-name">{{ store.storeName }}</view>
      <view class="store-address">{{ store.storeAddress }}</view>
      <view class="store-phone">电话: {{ store.storePhone }}</view>
    </view>
    <view class="store-right">
      <view v-if="store.stock > 0" class="store-stock">
        <text class="stock-label">库存</text>
        <text class="stock-value">{{ store.stock }}</text>
      </view>
      <view v-else class="no-stock">无库存</view>
      <view v-if="selected" class="selected-icon">
        <u-icon name="checkbox-mark" color="#EE781F" size="20"></u-icon>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'StoreCard',
  props: {
    store: {
      type: Object,
      required: true,
      default: () => ({})
    },
    selected: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    handleClick() {
      if (this.store.stock === 0) {
        uni.showToast({
          title: '该门店无库存',
          icon: 'none'
        });
        return;
      }
      this.$emit('select', this.store);
    }
  }
}
</script>

<style scoped>
.store-card {
  background: #FFFFFF;
  border-radius: 16rpx;
  padding: 32rpx;
  margin-bottom: 20rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.store-card.disabled {
  opacity: 0.5;
}

.store-info {
  flex: 1;
  margin-right: 20rpx;
}

.store-name {
  font-size: 32rpx;
  color: #19191A;
  font-weight: 500;
  margin-bottom: 12rpx;
}

.store-address {
  font-size: 26rpx;
  color: #666666;
  margin-bottom: 8rpx;
  line-height: 36rpx;
}

.store-phone {
  font-size: 26rpx;
  color: #666666;
}

.store-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.store-stock {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stock-label {
  font-size: 24rpx;
  color: #A2A2A8;
  margin-bottom: 4rpx;
}

.stock-value {
  font-size: 32rpx;
  color: #EE781F;
  font-weight: bold;
}

.no-stock {
  font-size: 28rpx;
  color: #D1D1D6;
}

.selected-icon {
  margin-top: 12rpx;
}
</style>
