<template>
  <view class="product-card" @click="handleClick">
    <!-- 商品图片容器 -->
    <view class="image-container">
      <image 
        :src="product.mainImage" 
        class="product-image"
        mode="aspectFill"
      />
      
      <!-- 渐变遮罩 -->
      <view class="image-overlay"></view>
      
      <!-- 标签组 -->
      <view class="badge-group">
        <!-- 已兑完标签 -->
        <view v-if="product.totalStock === 0" class="badge sold-out-badge">
          <text class="badge-text">已兑完</text>
        </view>
        <!-- 热门标签 -->
        <view v-else-if="product.isHot" class="badge hot-badge">
          <text class="badge-text">🔥 热门</text>
        </view>
      </view>
    </view>
    
    <!-- 商品信息 -->
    <view class="product-info">
      <view class="product-name">{{ product.spuName }}</view>
      
      <!-- 价格和库存 -->
      <view class="bottom-row">
        <view class="price-section">
          <view class="price-main">
            <text class="points-value">{{ product.minPointsRequired }}</text>
            <text class="points-unit">积分</text>
          </view>
          <text v-if="product.minCashRequired > 0" class="cash-price">
            +¥{{ product.minCashRequired }}
          </text>
        </view>
        
        <!-- 库存提示 -->
        <view v-if="product.totalStock > 0 && product.totalStock < 10" class="stock-tip">
          <text class="stock-text">仅剩{{ product.totalStock }}</text>
        </view>
      </view>
    </view>
    
    <!-- 装饰性元素 -->
    <view class="card-decoration"></view>
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
  position: relative;
  background: #FFFFFF;
  border-radius: 20rpx;
  overflow: hidden;
  box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.product-card:active {
  transform: scale(0.98);
}

/* 图片容器 */
.image-container {
  position: relative;
  width: 100%;
  height: 340rpx;
  overflow: hidden;
  background: linear-gradient(135deg, #F5F5F5 0%, #EEEEEE 100%);
}

.product-image {
  width: 100%;
  height: 100%;
  transition: transform 0.3s ease;
}

.product-card:active .product-image {
  transform: scale(1.05);
}

/* 渐变遮罩 */
.image-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 120rpx;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.15) 0%, transparent 100%);
  pointer-events: none;
}

/* 标签组 */
.badge-group {
  position: absolute;
  top: 16rpx;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  padding: 0 16rpx;
  pointer-events: none;
}

.badge {
  padding: 8rpx 20rpx;
  border-radius: 0 20rpx 20rpx 0;
  backdrop-filter: blur(10rpx);
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.15);
}

.sold-out-badge {
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.6) 100%);
}

.hot-badge {
  background: linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%);
}

.badge-text {
  font-size: 22rpx;
  color: #FFFFFF;
  font-weight: 600;
  letter-spacing: 1rpx;
}

/* 商品信息 */
.product-info {
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

.bottom-row {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
}

.price-section {
  flex: 1;
}

.price-main {
  display: flex;
  align-items: baseline;
  margin-bottom: 4rpx;
}

.points-value {
  font-size: 40rpx;
  color: #FF7043;
  font-weight: bold;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif;
  line-height: 1;
}

.points-unit {
  font-size: 22rpx;
  color: #FF7043;
  margin-left: 4rpx;
}

.cash-price {
  font-size: 24rpx;
  color: #FF7043;
  margin-left: 8rpx;
}

.stock-tip {
  padding: 6rpx 16rpx;
  background: linear-gradient(135deg, #FFF4F0 0%, #FFE8E0 100%);
  border-radius: 12rpx;
  border: 1rpx solid rgba(255, 112, 67, 0.2);
}

.stock-text {
  font-size: 20rpx;
  color: #FF7043;
  font-weight: 500;
}

/* 装饰性元素 */
.card-decoration {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 120rpx;
  height: 120rpx;
  background: radial-gradient(circle at bottom right, rgba(255, 112, 67, 0.05) 0%, transparent 70%);
  pointer-events: none;
}
</style>
