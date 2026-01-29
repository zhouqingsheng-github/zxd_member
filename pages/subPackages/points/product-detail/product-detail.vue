<template>
  <view class="detail-page">
    <!-- 自定义导航栏 -->
    <view class="nav-bar" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="nav-content">
        <view class="nav-left" @click="goBack">
          <view class="back-btn">
            <u-icon name="arrow-left" color="#1A1A1A" size="40" />
          </view>
        </view>
        <text class="nav-title">商品详情</text>
        <view class="nav-right"></view>
      </view>
    </view>

    <scroll-view v-if="!loading" class="scroll-container" scroll-y>
      <!-- 商品轮播图 -->
      <view class="swiper-section">
        <swiper 
          class="swiper" 
          :indicator-dots="true"
          :autoplay="true"
          :circular="true"
          indicator-color="rgba(255, 255, 255, 0.5)"
          indicator-active-color="#FF7043"
        >
          <swiper-item v-for="(img, index) in swiperImages" :key="index">
            <image :src="img" class="swiper-image" mode="aspectFill" />
          </swiper-item>
        </swiper>
      </view>

      <!-- 商品信息卡片 -->
      <view class="info-card">
        <view class="card-header">
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
        <view class="product-name">{{ product.spuName }}</view>
      </view>

      <!-- 商品详情 -->
      <view class="detail-card">
        <view class="detail-header">
          <view class="header-line"></view>
          <text class="header-text">商品详情</text>
          <view class="header-line"></view>
        </view>
        <view class="detail-content">
          <rich-text :nodes="product.detailContent"></rich-text>
        </view>
      </view>
      
      <!-- 底部占位 -->
      <view class="bottom-placeholder"></view>
    </scroll-view>

    <!-- 加载状态 -->
    <view v-if="loading" class="loading-state">
      <u-loading-icon mode="circle" color="#FF7043" size="60" />
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
        <view class="btn-content">
          <text class="btn-text">{{ product.totalStock === 0 ? '已兑完' : '立即兑换' }}</text>
          <u-icon v-if="product.totalStock > 0" name="arrow-right" color="#FFFFFF" size="36" />
        </view>
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
      statusBarHeight: 0,
      productId: null,
      product: {},
      skuList: [],
      swiperImages: [],
      loading: false,
      showSkuSelector: false
    };
  },
  onLoad(options) {
    const systemInfo = uni.getSystemInfoSync();
    this.statusBarHeight = systemInfo.statusBarHeight || 0;
    
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
  background: #F5F7FA;
}

/* 导航栏 */
.nav-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20rpx);
  z-index: 100;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
}

.nav-content {
  height: 88rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 32rpx;
}

.nav-left,
.nav-right {
  width: 80rpx;
}

.back-btn {
  width: 64rpx;
  height: 64rpx;
  background: #F7F8FA;
  border-radius: 32rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-title {
  font-size: 32rpx;
  color: #1A1A1A;
  font-weight: 500;
}

.scroll-container {
  padding-top: 88rpx;
}

/* 轮播图 */
.swiper-section {
  width: 100%;
  background: #FFFFFF;
}

.swiper {
  width: 100%;
  height: 750rpx;
}

.swiper-image {
  width: 100%;
  height: 100%;
}

/* 信息卡片 */
.info-card {
  background: #FFFFFF;
  padding: 32rpx;
  margin-top: 20rpx;
  border-radius: 24rpx 24rpx 0 0;
  position: relative;
  z-index: 2;
  margin-top: -40rpx;
  box-shadow: 0 -8rpx 32rpx rgba(0, 0, 0, 0.06);
}

.card-header {
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
  font-size: 60rpx;
  color: #FF7043;
  font-weight: bold;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif;
  line-height: 1;
}

.points-unit {
  font-size: 28rpx;
  color: #FF7043;
  margin-left: 8rpx;
}

.cash {
  font-size: 32rpx;
  color: #FF7043;
  margin-left: 16rpx;
}

.stock-badge {
  padding: 8rpx 24rpx;
  background: linear-gradient(135deg, #4CAF50 0%, #66BB6A 100%);
  border-radius: 24rpx;
  box-shadow: 0 4rpx 12rpx rgba(76, 175, 80, 0.3);
}

.stock-badge.no-stock {
  background: linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%);
  box-shadow: 0 4rpx 12rpx rgba(255, 107, 107, 0.3);
}

.stock-text {
  font-size: 24rpx;
  color: #FFFFFF;
  font-weight: 600;
}

.product-name {
  font-size: 36rpx;
  color: #1A1A1A;
  font-weight: 600;
  line-height: 52rpx;
}

/* 详情卡片 */
.detail-card {
  background: #FFFFFF;
  padding: 40rpx 32rpx;
  margin-top: 20rpx;
  border-radius: 24rpx;
}

.detail-header {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 32rpx;
}

.header-line {
  flex: 1;
  height: 2rpx;
  background: linear-gradient(90deg, transparent 0%, #E0E0E0 50%, transparent 100%);
}

.header-text {
  font-size: 32rpx;
  color: #1A1A1A;
  font-weight: 600;
  margin: 0 32rpx;
  position: relative;
}

.header-text::before {
  content: '';
  position: absolute;
  bottom: -8rpx;
  left: 50%;
  transform: translateX(-50%);
  width: 60rpx;
  height: 6rpx;
  background: linear-gradient(90deg, #FF7043 0%, #FF5722 100%);
  border-radius: 3rpx;
}

.detail-content {
  font-size: 28rpx;
  color: #666666;
  line-height: 48rpx;
}

.bottom-placeholder {
  height: 140rpx;
}

/* 加载状态 */
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

/* 底部操作栏 */
.footer-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20rpx);
  padding: 20rpx 32rpx;
  padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
  box-shadow: 0 -4rpx 20rpx rgba(0, 0, 0, 0.06);
  z-index: 100;
}

.exchange-btn {
  width: 100%;
  height: 96rpx;
  background: linear-gradient(135deg, #FF7043 0%, #FF5722 100%);
  border-radius: 48rpx;
  border: none;
  box-shadow: 0 8rpx 24rpx rgba(255, 112, 67, 0.35);
}

.btn-disabled {
  background: #D1D1D6;
  box-shadow: none;
}

.btn-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12rpx;
}

.btn-text {
  color: #FFFFFF;
  font-size: 32rpx;
  font-weight: 600;
}
</style>
