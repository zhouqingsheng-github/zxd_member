<template>
  <view class="detail-page">
    <!-- 自定义导航栏 -->
    <uni-nav-bar 
      :fixed="true" 
      :shadow="false" 
      :border="false" 
      status-bar
      background-color="rgba(255, 255, 255, 0.95)"
      left-icon="left"
      @clickLeft="goBack"
    >
      <template #default>
        <text class="nav-title">商品详情</text>
      </template>
    </uni-nav-bar>

    <scroll-view v-if="!loading" class="scroll-container" scroll-y>
      <!-- 商品轮播图 -->
      <view class="swiper-section">
        <u-swiper 
          :list="swiperImages" 
          :autoplay="true"
          :circular="true"
          :height="750"
          indicator-mode="dot"
          indicator-active-color="#FF6B35"
          indicator-inactive-color="rgba(255, 255, 255, 0.5)"
        />
      </view>

      <!-- 商品信息卡片 -->
      <view class="info-card">
        <view class="product-name">{{ product.spuName }}</view>
        <view class="price-row">
          <view class="price-main">
            <text class="points">{{ product.minPointsRequired }}</text>
            <text class="points-unit">积分</text>
            <text v-if="product.minCashRequired > 0" class="cash">+¥{{ product.minCashRequired }}</text>
          </view>
          <view class="stock-badge" :class="{ 'no-stock': product.totalStock === 0 }">
            <text class="stock-text">{{ product.totalStock === 0 ? '已兑完' : `库存${product.totalStock}` }}</text>
          </view>
        </view>
      </view>

      <!-- 商品详情 -->
      <view class="detail-card">
        <view class="detail-title">
          <view class="title-line"></view>
          <text class="title-text">商品详情</text>
          <view class="title-line"></view>
        </view>
        <view class="detail-content">
          <rich-text :nodes="product.detailContent"></rich-text>
        </view>
      </view>
    </scroll-view>

    <!-- 加载状态 -->
    <view v-if="loading" class="loading-state">
      <u-loading-icon mode="circle" color="#FF6B35" size="60" />
      <text class="loading-text">加载中...</text>
    </view>

    <!-- 底部操作栏 -->
    <view v-if="!loading" class="footer-bar">
      <button 
        class="exchange-btn" 
        :class="{ 'btn-disabled': product.totalStock === 0 }"
        :disabled="product.totalStock === 0"
        @click="showSkuSelector = true"
      >
        <text class="btn-text">{{ product.totalStock === 0 ? '已兑完' : '立即兑换' }}</text>
      </button>
    </view>

    <!-- SKU选择器 -->
    <SkuSelector
      :show="showSkuSelector"
      :product="product"
      :skuList="skuList"
      @close="showSkuSelector = false"
      @confirm="handleSkuConfirm"
    />
  </view>
</template>

<script>
import SkuSelector from '../components/SkuSelector.vue';
import { getProductDetail } from '@/common/api';

export default {
  components: {
    SkuSelector
  },
  data() {
    return {
      productId: null,
      product: {},
      skuList: [],
      swiperImages: [],
      loading: false,
      showSkuSelector: false
    };
  },
  onLoad(options) {
    if (options.id) {
      this.productId = options.id;
      this.loadProductDetail();
    }
  },
  methods: {
    async loadProductDetail() {
      if (!this.productId) return;
      
      try {
        this.loading = true;
        const result = await getProductDetail(this.productId);
        
        this.product = result;
        this.skuList = result.skuList || [];
        
        // 处理轮播图
        if (result.carouselImages && result.carouselImages.length > 0) {
          this.swiperImages = result.carouselImages.map(img => img.imageUrl);
        } else if (result.mainImage) {
          this.swiperImages = [result.mainImage];
        }
      } catch (error) {
        console.error('加载商品详情失败:', error);
        uni.showToast({
          title: '加载失败',
          icon: 'none'
        });
      } finally {
        this.loading = false;
      }
    },
    
    handleSkuConfirm(data) {
      this.showSkuSelector = false;
      uni.navigateTo({
        url: `/pages/subPackages/points/order-confirm/order-confirm?skuId=${data.skuId}&quantity=${data.quantity}`
      });
    },
    
    goBack() {
      uni.navigateBack();
    }
  }
};
</script>

<style scoped>
.detail-page {
  width: 100%;
  min-height: 100vh;
  background: #F7F8FA;
}

.nav-title {
  font-size: 32rpx;
  color: #1A1A1A;
  font-weight: 500;
}

.scroll-container {
  padding-bottom: 140rpx;
}

.swiper-section {
  width: 100%;
  background: #FFFFFF;
}

.info-card {
  background: #FFFFFF;
  padding: 32rpx;
  margin-top: 20rpx;
  border-radius: 24rpx 24rpx 0 0;
  position: relative;
  z-index: 2;
  margin-top: -40rpx;
}

.product-name {
  font-size: 36rpx;
  color: #1A1A1A;
  font-weight: 600;
  line-height: 52rpx;
  margin-bottom: 24rpx;
}

.price-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.price-main {
  display: flex;
  align-items: baseline;
}

.points {
  font-size: 56rpx;
  color: #FF6B35;
  font-weight: bold;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif;
}

.points-unit {
  font-size: 28rpx;
  color: #FF6B35;
  margin-left: 8rpx;
}

.cash {
  font-size: 32rpx;
  color: #FF6B35;
  margin-left: 16rpx;
}

.stock-badge {
  background: linear-gradient(135deg, #4CAF50 0%, #66BB6A 100%);
  padding: 8rpx 24rpx;
  border-radius: 24rpx;
}

.stock-badge.no-stock {
  background: linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%);
}

.stock-text {
  font-size: 24rpx;
  color: #FFFFFF;
  font-weight: 500;
}

.detail-card {
  background: #FFFFFF;
  padding: 40rpx 32rpx;
  margin-top: 20rpx;
  border-radius: 24rpx;
}

.detail-title {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 32rpx;
}

.title-line {
  width: 60rpx;
  height: 4rpx;
  background: linear-gradient(90deg, transparent 0%, #FF6B35 100%);
}

.title-text {
  font-size: 32rpx;
  color: #1A1A1A;
  font-weight: 600;
  margin: 0 24rpx;
}

.title-line:last-child {
  background: linear-gradient(90deg, #FF6B35 0%, transparent 100%);
}

.detail-content {
  font-size: 28rpx;
  color: #666666;
  line-height: 48rpx;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 200rpx 0;
}

.loading-text {
  font-size: 26rpx;
  color: #999999;
  margin-top: 24rpx;
}

.footer-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #FFFFFF;
  padding: 20rpx 32rpx;
  padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
  box-shadow: 0 -4rpx 20rpx rgba(0, 0, 0, 0.06);
}

.exchange-btn {
  width: 100%;
  height: 96rpx;
  background: linear-gradient(135deg, #FF6B35 0%, #FF8E53 100%);
  border-radius: 48rpx;
  border: none;
  box-shadow: 0 8rpx 24rpx rgba(255, 107, 53, 0.3);
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
  font-size: 32rpx;
  font-weight: 600;
}
</style>
