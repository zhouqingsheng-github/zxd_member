<template>
  <view class="store-select-page">
    <!-- 导航栏 -->
    <uni-nav-bar 
      :fixed="true" 
      :shadow="false" 
      :border="false" 
      status-bar
      background-color="#FFFFFF"
      color="#000000"
      left-icon="left"
      @clickLeft="back"
    >
      <template #default>
        <view class="nav-title-wrapper">
          <text class="nav-title">选择门店</text>
        </view>
      </template>
    </uni-nav-bar>
    
    <!-- 加载状态 -->
    <view v-if="loading" class="loading-container">
      <view class="loading-spinner"></view>
      <view class="loading-text">加载中...</view>
    </view>
    
    <!-- 门店列表 -->
    <view v-else-if="stores.length > 0" class="store-list">
      <view 
        v-for="store in stores" 
        :key="store.id"
        class="store-item"
        :class="{ 'disabled': !store.hasStock }"
        @click="selectStore(store)"
      >
        <view class="store-info">
          <view class="store-name-row">
            <view class="store-name">{{ store.name }}</view>
            <view v-if="store.hasStock" class="stock-badge">有货</view>
            <view v-else class="stock-badge no-stock">无货</view>
          </view>
          <view class="store-address">
            <u-icon name="map-fill" color="#FF7043" size="28" />
            <text class="address-text">{{ store.address }}</text>
          </view>
          <view class="store-phone">
            <u-icon name="phone-fill" color="#FF7043" size="28" />
            <text class="phone-text">{{ store.phone }}</text>
          </view>
          <view class="store-stock">
            <text class="stock-label">库存:</text>
            <text class="stock-value" :class="{ 'no-stock-text': !store.hasStock }">
              {{ store.stock }}
            </text>
          </view>
        </view>
        <view v-if="store.hasStock" class="select-icon">
          <text class="arrow">›</text>
        </view>
      </view>
    </view>
    
    <!-- 空状态 -->
    <view v-else class="empty-container">
      <image class="empty-image" src="/static/base/empty.png" mode="aspectFit"></image>
      <view class="empty-text">暂无可用门店</view>
      <view class="empty-tip">所有门店该商品均已售罄</view>
    </view>
  </view>
</template>

<script>
import { getStoreStockBySkuId } from '../api/index.js';

export default {
  data() {
    return {
      skuId: null,
      stores: [],
      loading: false
    };
  },
  
  onLoad(options) {
    if (options.skuId) {
      this.skuId = parseInt(options.skuId);
      this.loadStores();
    }
  },
  
  methods: {
    back() {
      uni.navigateBack();
    },
    
    async loadStores() {
      if (!this.skuId) {
        uni.showToast({
          title: '参数错误',
          icon: 'none'
        });
        return;
      }
      
      this.loading = true;
      
      try {
        const res = await getStoreStockBySkuId(this.skuId);
        
        if (res && res.length > 0) {
          this.stores = res.map(item => ({
            id: item.storeId,
            name: item.storeName,
            address: item.storeAddress || '暂无地址',
            phone: item.storePhone || '暂无电话',
            stock: item.stock || 0,
            hasStock: item.stock > 0
          }));
        } else {
          this.stores = [];
        }
      } catch (error) {
        console.error('加载门店列表失败:', error);
        uni.showToast({
          title: error.message || '加载失败',
          icon: 'none'
        });
      } finally {
        this.loading = false;
      }
    },
    
    selectStore(store) {
      if (!store.hasStock) {
        uni.showToast({
          title: '该门店暂无库存',
          icon: 'none'
        });
        return;
      }
      
      // 通过事件通道传递选中的门店信息
      const pages = getCurrentPages();
      const prevPage = pages[pages.length - 2];
      
      if (prevPage) {
        prevPage.$vm.selectedStore = store;
      }
      
      uni.navigateBack();
    }
  }
};
</script>

<style lang="scss" scoped>
.store-select-page {
  min-height: 100vh;
  background-color: #F3F4F6;
}

.nav-title-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.nav-title {
  font-size: 36rpx;
  font-weight: 600;
  color: #000000;
  text-align: center;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-top: 200rpx;
}

.loading-spinner {
  width: 60rpx;
  height: 60rpx;
  border: 4rpx solid #f3f3f3;
  border-top: 4rpx solid #EE781F;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-text {
  margin-top: 20rpx;
  font-size: 28rpx;
  color: #999;
}

.store-list {
  padding: 20rpx;
}

.store-item {
  background: #FFFFFF;
  border-radius: 16rpx;
  padding: 32rpx;
  margin-bottom: 20rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
  
  &.disabled {
    opacity: 0.5;
  }
}

.store-info {
  flex: 1;
}

.store-name-row {
  display: flex;
  align-items: center;
  margin-bottom: 16rpx;
}

.store-name {
  font-size: 32rpx;
  font-weight: 600;
  color: #19191A;
  margin-right: 16rpx;
}

.stock-badge {
  padding: 4rpx 16rpx;
  border-radius: 8rpx;
  font-size: 24rpx;
  background: #E8F5E9;
  color: #4CAF50;
  white-space: nowrap;
  flex-shrink: 0;
  
  &.no-stock {
    background: #FFEBEE;
    color: #F44336;
  }
}

.store-address,
.store-phone {
  display: flex;
  align-items: center;
  margin-bottom: 12rpx;
}

.address-text,
.phone-text {
  margin-left: 12rpx;
  font-size: 28rpx;
  color: #666;
}

.store-stock {
  margin-top: 16rpx;
  padding-top: 16rpx;
  border-top: 1rpx solid #F0F0F0;
}

.stock-label {
  font-size: 28rpx;
  color: #999;
  margin-right: 8rpx;
}

.stock-value {
  font-size: 32rpx;
  font-weight: 600;
  color: #EE781F;
  
  &.no-stock-text {
    color: #F44336;
  }
}

.select-icon {
  margin-left: 20rpx;
}

.arrow {
  font-size: 48rpx;
  color: #999;
  font-weight: 300;
}

.empty-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-top: 200rpx;
}

.empty-image {
  width: 300rpx;
  height: 300rpx;
  margin-bottom: 40rpx;
}

.empty-text {
  font-size: 32rpx;
  color: #666;
  margin-bottom: 16rpx;
}

.empty-tip {
  font-size: 28rpx;
  color: #999;
}
</style>
