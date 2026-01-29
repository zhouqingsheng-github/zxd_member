<template>
  <view class="product-detail">
    <!-- 自定义导航栏 -->
    <uni-nav-bar 
      :fixed="true" 
      :shadow="false" 
      :border="false" 
      status-bar
      background-color="#FFFFFF"
      left-icon="left"
      @clickLeft="goBack"
      title="商品详情"
    />

    <scroll-view v-if="!loading" class="scroll-container" scroll-y>
      <!-- 商品轮播图 -->
      <view class="swiper-container">
        <u-swiper 
          :list="swiperImages" 
          :autoplay="true"
          :circular="true"
          :height="750"
          indicator-mode="dot"
        />
      </view>

      <!-- 商品基本信息 -->
      <view class="product-info">
        <view class="product-name">{{ product.spuName }}</view>
        <view class="product-price">
          <view class="price-main">
            <text class="points">{{ product.minPointsRequired }}</text>
            <text class="points-unit">积分</text>
            <text v-if="product.minCashRequired > 0" class="cash">+¥{{ product.minCashRequired }}</text>
          </view>
          <view class="stock-info">库存 {{ product.totalStock }}</view>
        </view>
      </view>

      <!-- 商品详情 -->
      <view class="product-detail-content">
        <view class="detail-title">商品详情</view>
        <view class="detail-html">
          <rich-text :nodes="product.detailContent"></rich-text>
        </view>
      </view>
    </scroll-view>

    <!-- 加载状态 -->
    <view v-if="loading" class="loading-state">
      <u-loading-icon mode="circle" />
      <text class="loading-text">加载中...</text>
    </view>

    <!-- 底部操作栏 -->
    <view v-if="!loading" class="footer-bar">
      <button 
        class="exchange-btn" 
        :disabled="product.totalStock === 0"
        @click="showSkuSelector = true"
      >
        {{ product.totalStock === 0 ? '已兑完' : '立即兑换' }}
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
import SkuSelector from '@/components/points/SkuSelector.vue';
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
      // 跳转到确认订单页
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
.product-detail {
  width: 100%;
  height: 100vh;
  background: #F3F4F6;
  display: flex;
  flex-direction: column;
}

.scroll-container {
  flex: 1;
  padding-bottom: 120rpx;
}

.swiper-container {
  width: 100%;
  background: #FFFFFF;
}

.product-info {
  background: #FFFFFF;
  padding: 32rpx;
  margin-bottom: 20rpx;
}

.product-name {
  font-size: 36rpx;
  color: #19191A;
  font-weight: 500;
  line-height: 50rpx;
  margin-bottom: 24rpx;
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
  font-size: 48rpx;
  color: #EE781F;
  font-weight: bold;
}

.points-unit {
  font-size: 28rpx;
  color: #EE781F;
  margin-left: 4rpx;
}

.cash {
  font-size: 32rpx;
  color: #EE781F;
  margin-left: 12rpx;
}

.stock-info {
  font-size: 28rpx;
  color: #A2A2A8;
}

.product-detail-content {
  background: #FFFFFF;
  padding: 32rpx;
}

.detail-title {
  font-size: 32rpx;
  color: #19191A;
  font-weight: 500;
  margin-bottom: 24rpx;
}

.detail-html {
  font-size: 28rpx;
  color: #666666;
  line-height: 44rpx;
}

.loading-state {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.loading-text {
  font-size: 28rpx;
  color: #A2A2A8;
  margin-top: 20rpx;
}

.footer-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #FFFFFF;
  padding: 20rpx 32rpx;
  padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
  box-shadow: 0 -4rpx 20rpx rgba(0, 0, 0, 0.05);
}

.exchange-btn {
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

.exchange-btn[disabled] {
  background: #D1D1D6;
}
</style>
