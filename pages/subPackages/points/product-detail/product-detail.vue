<template>
  <view class="detail-container">
    <!-- 自定义导航栏 -->
    <uni-nav-bar 
      :fixed="true" 
      :shadow="false" 
      :border="false" 
      status-bar
      background-color="#FFFFFF"
      title="商品详情"
      left-icon="left"
      @clickLeft="goBack"
    />
    
    <!-- 商品轮播图 -->
    <view class="swiper-container">
      <u-swiper 
        :list="carouselList" 
        :height="750"
        indicator
        indicator-mode="dot"
      />
    </view>
    
    <!-- 商品信息 -->
    <view class="product-info-card">
      <view class="product-name">{{ productDetail.spuName }}</view>
      <view class="product-price">
        <text class="points">{{ selectedSku.pointsRequired || 0 }}</text>
        <text class="points-unit">积分</text>
        <text v-if="selectedSku.cashRequired > 0" class="cash">+¥{{ selectedSku.cashRequired }}</text>
      </view>
      <view class="selected-sku">已选：{{ selectedSku.skuName || '请选择规格' }}</view>
    </view>
    
    <!-- SKU选择区域 -->
    <view class="sku-section">
      <view class="sku-title">选择规格</view>
      <view class="sku-options">
        <view 
          v-for="sku in skuList" 
          :key="sku.id"
          class="sku-option"
          :class="{ active: selectedSku.id === sku.id }"
          @click="selectSku(sku)"
        >
          <view class="sku-option-name">{{ sku.skuName }}</view>
          <view class="sku-option-price">
            {{ sku.pointsRequired }}积分
            <text v-if="sku.cashRequired > 0">+¥{{ sku.cashRequired }}</text>
          </view>
        </view>
      </view>
    </view>
    
    <!-- 商品详情 -->
    <view class="product-detail">
      <view class="detail-title">商品详情</view>
      <rich-text :nodes="productDetail.detailContent" />
    </view>
    
    <!-- 底部操作栏 -->
    <view class="bottom-bar">
      <view class="bottom-btn" @click="handleExchange">
        立即兑换
      </view>
    </view>
    
    <!-- SKU选择弹窗 -->
    <u-popup 
      v-model="showSkuPopup" 
      mode="bottom" 
      border-radius="32"
      :closeable="true"
    >
      <view class="sku-popup">
        <view class="sku-header">
          <image 
            :src="selectedSku.mainImage || productDetail.mainImage" 
            class="sku-image"
            mode="aspectFill"
          />
          <view class="sku-info">
            <view class="sku-price">
              <text class="points">{{ selectedSku.pointsRequired || 0 }}</text>
              <text class="points-unit">积分</text>
              <text v-if="selectedSku.cashRequired > 0" class="cash">+¥{{ selectedSku.cashRequired }}</text>
            </view>
            <view class="sku-name">{{ selectedSku.skuName || '请选择规格' }}</view>
          </view>
        </view>
        
        <view class="sku-list">
          <view class="sku-list-title">选择规格</view>
          <view class="sku-items">
            <view 
              v-for="sku in skuList" 
              :key="sku.id"
              class="sku-item"
              :class="{ active: selectedSku.id === sku.id }"
              @click="selectSku(sku)"
            >
              {{ sku.skuName }}
            </view>
          </view>
        </view>
        
        <view class="sku-quantity">
          <view class="quantity-label">数量</view>
          <u-number-box 
            v-model="quantity" 
            :min="1" 
            :max="99"
          />
        </view>
        
        <view class="sku-confirm-btn" @click="confirmSku">
          确定
        </view>
      </view>
    </u-popup>
    
    <!-- 加载状态 -->
    <u-loading-page :loading="loading" />
  </view>
</template>

<script>
import { getProductDetail } from '@/common/api/points'

export default {
  data() {
    return {
      productId: 0,
      productDetail: {},
      carouselList: [],
      skuList: [],
      selectedSku: {},
      quantity: 1,
      loading: false,
      showSkuPopup: false
    }
  },
  
  onLoad(options) {
    this.productId = options.id || 0
    
    if (this.productId) {
      this.loadProductDetail()
    }
  },
  
  methods: {
    // 加载商品详情
    async loadProductDetail() {
      this.loading = true
      
      try {
        const res = await getProductDetail(this.productId)
        console.log('商品详情接口返回:', res)
        
        this.productDetail = res
        
        // 处理轮播图
        if (res.carouselImages && res.carouselImages.length > 0) {
          this.carouselList = res.carouselImages
        } else if (res.mainImage) {
          this.carouselList = [res.mainImage]
        }
        
        // 处理SKU列表
        this.skuList = res.skuList || []
        
        // 默认选中第一个SKU（因为stock字段为null，暂时不判断库存）
        if (this.skuList.length > 0) {
          this.selectedSku = this.skuList[0]
        }
        
        console.log('处理后的SKU列表:', this.skuList)
        console.log('默认选中的SKU:', this.selectedSku)
      } catch (error) {
        console.error('加载商品详情失败:', error)
        uni.showToast({
          title: '加载失败',
          icon: 'none'
        })
      } finally {
        this.loading = false
      }
    },
    
    // 选择SKU
    selectSku(sku) {
      // 直接选择SKU，更新显示
      this.selectedSku = sku
      this.quantity = 1
      console.log('选中SKU:', sku)
    },
    
    // 确认SKU选择
    confirmSku() {
      if (!this.selectedSku.id) {
        uni.showToast({
          title: '请选择规格',
          icon: 'none'
        })
        return
      }
      this.showSkuPopup = false
    },
    
    // 立即兑换
    handleExchange() {
      if (!this.selectedSku.id) {
        uni.showToast({
          title: '请先选择规格',
          icon: 'none'
        })
        this.showSkuPopup = true
        return
      }
      
      // 跳转到确认订单页
      uni.navigateTo({
        url: `/pages/subPackages/points/order-confirm/order-confirm?skuId=${this.selectedSku.id}&quantity=${this.quantity}`
      })
    },
    
    // 返回
    goBack() {
      uni.navigateBack()
    }
  }
}
</script>

<style scoped lang="scss">
.detail-container {
  min-height: 100vh;
  background-color: #F3F4F6;
  padding-bottom: 120rpx;
}

.swiper-container {
  width: 100%;
  height: 750rpx;
  background-color: #FFFFFF;
}

.product-info-card {
  margin: 20rpx 24rpx;
  padding: 32rpx;
  background-color: #FFFFFF;
  border-radius: 16rpx;
  
  .product-name {
    font-size: 32rpx;
    font-weight: bold;
    color: #19191A;
    margin-bottom: 24rpx;
  }
  
  .product-price {
    display: flex;
    align-items: baseline;
    margin-bottom: 16rpx;
    
    .points {
      font-size: 48rpx;
      color: #EE781F;
      font-weight: bold;
    }
    
    .points-unit {
      font-size: 28rpx;
      color: #EE781F;
      margin-left: 8rpx;
    }
    
    .cash {
      font-size: 28rpx;
      color: #666666;
      margin-left: 16rpx;
    }
  }
  
  .selected-sku {
    font-size: 24rpx;
    color: #666666;
  }
}

.sku-section {
  margin: 0 24rpx 20rpx;
  padding: 32rpx;
  background-color: #FFFFFF;
  border-radius: 16rpx;
  
  .sku-title {
    font-size: 28rpx;
    font-weight: bold;
    color: #19191A;
    margin-bottom: 20rpx;
  }
  
  .sku-options {
    display: flex;
    flex-wrap: wrap;
    gap: 20rpx;
  }
  
  .sku-option {
    flex: 0 0 calc(50% - 10rpx);
    padding: 24rpx;
    background-color: #F3F4F6;
    border-radius: 12rpx;
    border: 2rpx solid transparent;
    transition: all 0.3s;
    
    &.active {
      background-color: #FFF3E8;
      border-color: #EE781F;
    }
    
    .sku-option-name {
      font-size: 28rpx;
      color: #19191A;
      font-weight: 500;
      margin-bottom: 8rpx;
    }
    
    .sku-option-price {
      font-size: 24rpx;
      color: #EE781F;
      font-weight: bold;
    }
  }
}

.sku-selector {
  margin: 0 24rpx 20rpx;
  padding: 32rpx;
  background-color: #FFFFFF;
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  
  .sku-label {
    font-size: 28rpx;
    color: #19191A;
  }
  
  .sku-value {
    flex: 1;
    text-align: right;
    font-size: 28rpx;
    color: #666666;
    margin: 0 16rpx;
  }
}

.product-detail {
  margin: 0 24rpx;
  padding: 32rpx;
  background-color: #FFFFFF;
  border-radius: 16rpx;
  
  .detail-title {
    font-size: 32rpx;
    font-weight: bold;
    color: #19191A;
    margin-bottom: 24rpx;
  }
}

.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20rpx 24rpx;
  padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
  background-color: #FFFFFF;
  box-shadow: 0 -4rpx 12rpx rgba(0, 0, 0, 0.05);
  
  .bottom-btn {
    height: 88rpx;
    background: linear-gradient(135deg, #FF9A56 0%, #EE781F 100%);
    border-radius: 44rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 32rpx;
    font-weight: bold;
    color: #FFFFFF;
  }
}

.sku-popup {
  padding: 32rpx;
  max-height: 80vh;
  
  .sku-header {
    display: flex;
    margin-bottom: 32rpx;
    
    .sku-image {
      width: 160rpx;
      height: 160rpx;
      border-radius: 12rpx;
      margin-right: 24rpx;
    }
    
    .sku-info {
      flex: 1;
      
      .sku-price {
        display: flex;
        align-items: baseline;
        margin-bottom: 12rpx;
        
        .points {
          font-size: 40rpx;
          color: #EE781F;
          font-weight: bold;
        }
        
        .points-unit {
          font-size: 24rpx;
          color: #EE781F;
          margin-left: 8rpx;
        }
        
        .cash {
          font-size: 24rpx;
          color: #666666;
          margin-left: 12rpx;
        }
      }
      
      .sku-name {
        font-size: 28rpx;
        color: #666666;
      }
    }
  }
  
  .sku-list {
    margin-bottom: 32rpx;
    
    .sku-list-title {
      font-size: 28rpx;
      color: #19191A;
      margin-bottom: 20rpx;
    }
    
    .sku-items {
      display: flex;
      flex-wrap: wrap;
      gap: 20rpx;
      
      .sku-item {
        padding: 16rpx 32rpx;
        background-color: #F3F4F6;
        border-radius: 8rpx;
        font-size: 28rpx;
        color: #19191A;
        border: 2rpx solid transparent;
        
        &.active {
          background-color: #FFF3E8;
          border-color: #EE781F;
          color: #EE781F;
        }
        
        &.disabled {
          opacity: 0.5;
          
          .stock-tip {
            font-size: 24rpx;
            color: #999999;
          }
        }
      }
    }
  }
  
  .sku-quantity {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 32rpx;
    
    .quantity-label {
      font-size: 28rpx;
      color: #19191A;
    }
  }
  
  .sku-confirm-btn {
    height: 88rpx;
    background: linear-gradient(135deg, #FF9A56 0%, #EE781F 100%);
    border-radius: 44rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 32rpx;
    font-weight: bold;
    color: #FFFFFF;
  }
}
</style>
