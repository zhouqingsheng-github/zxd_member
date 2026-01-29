<template>
  <view 
    class="store-card" 
    :class="{ 'store-card-disabled': store.stock === 0, 'store-card-selected': selected }"
    @click="handleSelect"
  >
    <view class="store-header">
      <view class="store-name-row">
        <text class="store-name">{{ store.storeName }}</text>
        <view class="stock-badge" :class="{ 'no-stock': store.stock === 0 }">
          <text class="stock-text">{{ store.stock > 0 ? `库存${store.stock}` : '无货' }}</text>
        </view>
      </view>
      <view v-if="selected" class="selected-icon">
        <u-icon name="checkbox-mark" color="#FF6B35" size="40" />
      </view>
    </view>
    
    <view class="store-info">
      <view class="info-row">
        <u-icon name="map-pin-fill" color="#FF6B35" size="32" />
        <text class="info-text">{{ store.storeAddress }}</text>
      </view>
      <view class="info-row">
        <u-icon name="phone-fill" color="#4CAF50" size="32" />
        <text class="info-text">{{ store.storePhone }}</text>
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
    handleSelect() {
      if (this.store.stock === 0) {
        uni.showToast({
          title: '该门店暂无库存',
          icon: 'none'
        });
        return;
      }
      this.$emit('select', this.store);
    }
  }
};
</script>

<style scoped>
.store-card {
  background: #FFFFFF;
  border-radius: 20rpx;
  padding: 32rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
  border: 2rpx solid transparent;
}

.store-card-selected {
  border-color: #FF6B35;
  background: linear-gradient(135deg, #FFF9F6 0%, #FFFFFF 100%);
}

.store-card-disabled {
  opacity: 0.5;
}

.store-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 24rpx;
}

.store-name-row {
  flex: 1;
  display: flex;
  align-items: center;
}

.store-name {
  font-size: 32rpx;
  color: #1A1A1A;
  font-weight: 600;
  margin-right: 16rpx;
}

.stock-badge {
  background: linear-gradient(135deg, #4CAF50 0%, #66BB6A 100%);
  padding: 4rpx 16rpx;
  border-radius: 12rpx;
}

.stock-badge.no-stock {
  background: linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%);
}

.stock-text {
  font-size: 22rpx;
  color: #FFFFFF;
  font-weight: 500;
}

.selected-icon {
  margin-left: 20rpx;
}

.store-info {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.info-row {
  display: flex;
  align-items: center;
}

.info-text {
  font-size: 26rpx;
  color: #666666;
  margin-left: 12rpx;
  flex: 1;
}
</style>
