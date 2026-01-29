<template>
  <view class="product-card" @click="handleClick">
    <view class="product-image-wrapper">
      <image 
        class="product-image" 
        :src="product.mainImage" 
        mode="aspectFill"
        :lazy-load="true"
      />
      <view v-if="product.totalStock === 0" class="sold-out-mask">
        <text class="sold-out-text">已兑完</text>
      </view>
    </view>
    <view class="product-info">
      <view class="product-name">{{ product.spuName }}</view>
      <view class="product-price">
        <view class="price-main">
          <text class="points">{{ product.minPointsRequired }}</text>
          <text class="points-unit">积分</text>
          <text v-if="product.minCashRequired > 0" class="cash">+¥{{ product.minCashRequired }}</text>
        </view>
        <view v-if="product.totalStock > 0" class="stock-text">库存{{ product.totalStock }}</view>
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
      if (this.product.totalStock === 0) {
        uni.showToast({
          title: '商品已兑完',
          icon: 'none'
        });
        return;
      }
      this.$emit('click', this.product);
    }
  }
}
</script>

<style scoped>
.product-card {
  background: #FFFFFF;
  border-radius: 16rpx;
  overflow: hidden;
  margin-bottom: 20rpx;
}

.product-image-wrapper {
  position: relative;
  width: 100%;
  height: 340rpx;
}

.product-image {
  width: 100%;
  height: 100%;
}

.sold-out-mask {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.sold-out-text {
  color: #FFFFFF;
  font-size: 32rpx;
  font-weight: bold;
}

.product-info {
  padding: 20rpx;
}

.product-name {
  font-size: 28rpx;
  color: #19191A;
  font-weight: 500;
  margin-bottom: 16rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  line-height: 40rpx;
  height: 80rpx;
}

.product-price {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
}

.price-main {
  display: flex;
  align-items: baseline;
}

.points {
  font-size: 36rpx;
  color: #EE781F;
  font-weight: bold;
}

.points-unit {
  font-size: 24rpx;
  color: #EE781F;
  margin-left: 4rpx;
}

.cash {
  font-size: 24rpx;
  color: #EE781F;
  margin-left: 8rpx;
}

.stock-text {
  font-size: 24rpx;
  color: #A2A2A8;
}
</style>
