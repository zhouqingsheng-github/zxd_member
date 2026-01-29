<template>
  <view class="product-card" @click="handleClick">
    <!-- 商品图片 -->
    <view class="image-wrapper">
      <image 
        :src="product.mainImage" 
        class="product-image"
        mode="aspectFill"
      />
      <!-- 库存标签 -->
      <view v-if="product.totalStock === 0" class="sold-out-badge">
        <text class="badge-text">已兑完</text>
      </view>
      <!-- 热门标签 -->
      <view v-else-if="product.isHot" class="hot-badge">
        <text class="badge-text">🔥 热门</text>
      </view>
    </view>
    
    <!-- 商品信息 -->
    <view class="product-content">
      <view class="product-name">{{ product.spuName }}</view>
      
      <!-- 价格区域 -->
      <view class="price-section">
        <view class="price-row">
          <view class="points-price">
            <text class="points-value">{{ product.minPointsRequired }}</text>
            <text class="points-unit">积分</text>
          </view>
          <text v-if="product.minCashRequired > 0" class="cash-price">
            +¥{{ product.minCashRequired }}
          </text>
        </view>
        <view v-if="product.totalStock > 0 && product.totalStock < 10" class="stock-tip">
          仅剩{{ product.totalStock }}件
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'ProductCard',
  props: {
    product: {
      type: Object,
      required: true,
      default: () => ({})
    }
  },
  methods: {
    handleClick() {
      this.$emit('click', this.product);
    }
  }
};
</script>

<style scoped>
.product-card {
  background: #FFFFFF;
  border-radius: 20rpx;
  overflow: hidden;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
}

.image-wrapper {
  position: relative;
  width: 100%;
  height: 340rpx;
  overflow: hidden;
  background: #F5F5F5;
}

.product-image {
  width: 100%;
  height: 100%;
}

.sold-out-badge {
  position: absolute;
  top: 16rpx;
  right: 16rpx;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(10rpx);
  padding: 8rpx 20rpx;
  border-radius: 24rpx;
}

.hot-badge {
  position: absolute;
  top: 16rpx;
  left: 16rpx;
  background: linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%);
  padding: 8rpx 20rpx;
  border-radius: 24rpx;
  box-shadow: 0 4rpx 12rpx rgba(255, 107, 107, 0.3);
}

.badge-text {
  font-size: 22rpx;
  color: #FFFFFF;
  font-weight: 500;
}

.product-content {
  padding: 24rpx;
}

.product-name {
  font-size: 28rpx;
  color: #1A1A1A;
  font-weight: 500;
  line-height: 40rpx;
  margin-bottom: 16rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  min-height: 80rpx;
}

.price-section {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
}

.price-row {
  display: flex;
  align-items: baseline;
}

.points-price {
  display: flex;
  align-items: baseline;
}

.points-value {
  font-size: 36rpx;
  color: #FF6B35;
  font-weight: bold;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif;
}

.points-unit {
  font-size: 22rpx;
  color: #FF6B35;
  margin-left: 4rpx;
}

.cash-price {
  font-size: 24rpx;
  color: #FF6B35;
  margin-left: 8rpx;
}

.stock-tip {
  font-size: 20rpx;
  color: #FF6B35;
  background: #FFF4F0;
  padding: 4rpx 12rpx;
  border-radius: 12rpx;
}
</style>
