<template>
  <view class="product-detail-page">
    <!-- 自定义导航栏 -->
    <view class="nav-bar" :class="{ 'nav-bar-white': navBarWhite }" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="nav-content">
        <view class="nav-btn" @click="goBack">
          <u-icon name="arrow-left" :color="navBarWhite ? '#1A1A1A' : '#FFFFFF'" size="40" />
        </view>
        <view class="nav-title">商品详情</view>
        <view class="nav-placeholder"></view>
      </view>
    </view>

    <scroll-view scroll-y class="content-scroll" :style="{ paddingBottom: bottomBarHeight + 'px' }" @scroll="handleScroll">
      <!-- 轮播图 -->
      <view class="swiper-section" :style="{ paddingTop: navBarHeight + 'px' }">
        <swiper 
          class="product-swiper" 
          :indicator-dots="true" 
          :autoplay="true" 
          :interval="3000"
          :duration="500"
          indicator-color="rgba(255,255,255,0.5)"
          indicator-active-color="#FF7043"
        >
          <swiper-item v-for="(image, index) in carouselImages" :key="index">
            <image :src="image" class="swiper-image" mode="aspectFill" />
          </swiper-item>
        </swiper>
      </view>

      <!-- 商品信息卡片 -->
      <view class="product-info-card">
        <view class="price-section">
          <view class="price-row">
            <text class="points-price">{{ selectedSku.pointsRequired || minPoints }}</text>
            <text class="points-unit">积分</text>
            <text v-if="selectedSku.cashRequired > 0" class="cash-price">+¥{{ selectedSku.cashRequired }}</text>
          </view>
          <view v-if="productInfo.purchaseLimit > 0" class="limit-tag">
            限购{{ productInfo.purchaseLimit }}件
          </view>
        </view>
        
        <view class="product-name">{{ productInfo.spuName }}</view>
        <view class="product-desc">{{ productInfo.description }}</view>
        
        <!-- 已选规格 -->
        <view class="spec-selector" @click="showSkuPopup">
          <view class="spec-label">已选</view>
          <view class="spec-value">{{ selectedSku.skuName || '请选择规格' }}</view>
          <u-icon name="arrow-right" color="#999999" size="28" />
        </view>
      </view>

      <!-- Tab切换 -->
      <view class="tabs-section">
        <view 
          v-for="(tab, index) in tabs" 
          :key="index"
          class="tab-item"
          :class="{ active: currentTab === index }"
          @click="switchTab(index)"
        >
          <text class="tab-text">{{ tab }}</text>
          <view v-if="currentTab === index" class="tab-indicator"></view>
        </view>
      </view>

      <!-- Tab内容 -->
      <view class="tab-content">
        <!-- 商品详情 -->
        <view v-if="currentTab === 0" class="detail-content">
          <view v-if="productInfo.detailContent" class="rich-text">
            <rich-text :nodes="productInfo.detailContent"></rich-text>
          </view>
          <view v-else class="empty-detail">
            <text class="empty-text">暂无详细介绍</text>
          </view>
        </view>

        <!-- 规格参数 -->
        <view v-if="currentTab === 1" class="spec-content">
          <view class="spec-item">
            <text class="spec-item-label">商品编号</text>
            <text class="spec-item-value">{{ productInfo.spuNo }}</text>
          </view>
          <view class="spec-item">
            <text class="spec-item-label">商品分类</text>
            <text class="spec-item-value">{{ productInfo.categoryName }}</text>
          </view>
          <view class="spec-item">
            <text class="spec-item-label">兑换方式</text>
            <text class="spec-item-value">{{ selectedSku.exchangeType === 'POINTS' ? '纯积分' : '积分+现金' }}</text>
          </view>
          <view v-if="productInfo.purchaseLimit > 0" class="spec-item">
            <text class="spec-item-label">限购数量</text>
            <text class="spec-item-value">{{ productInfo.purchaseLimit }}件</text>
          </view>
        </view>
      </view>
    </scroll-view>

    <!-- 底部操作栏 -->
    <view class="bottom-bar" :style="{ paddingBottom: safeAreaBottom + 'px' }">
      <view class="bar-content">
        <button class="exchange-btn" @click="handleExchange">
          <text class="btn-text">立即兑换</text>
        </button>
      </view>
    </view>

    <!-- SKU选择弹窗 -->
    <u-popup v-model="skuPopupShow" mode="bottom" border-radius="32" :safe-area-inset-bottom="true">
      <view class="sku-popup">
        <view class="popup-header">
          <view class="popup-close" @click="skuPopupShow = false">
            <u-icon name="close" color="#666666" size="40" />
          </view>
        </view>
        
        <view class="popup-product">
          <image :src="productInfo.mainImage" class="popup-image" mode="aspectFill" />
          <view class="popup-info">
            <view class="popup-price">
              <text class="popup-points">{{ selectedSku.pointsRequired || minPoints }}</text>
              <text class="popup-unit">积分</text>
            </view>
            <view class="popup-name">{{ productInfo.spuName }}</view>
            <view v-if="selectedSku.skuName" class="popup-spec">已选：{{ selectedSku.skuName }}</view>
          </view>
        </view>

        <view class="popup-divider"></view>

        <view class="sku-section">
          <view class="sku-title">选择规格</view>
          <view class="sku-list">
            <view 
              v-for="sku in skuList" 
              :key="sku.id"
              class="sku-item"
              :class="{ active: selectedSku.id === sku.id, disabled: sku.stock === 0 }"
              @click="selectSku(sku)"
            >
              <text class="sku-name">{{ sku.skuName }}</text>
              <text class="sku-points">{{ sku.pointsRequired }}积分</text>
              <view v-if="sku.stock === 0" class="sku-sold-out">已售罄</view>
              <u-icon v-if="selectedSku.id === sku.id" name="checkbox-mark" color="#FF7043" size="32" class="sku-check" />
            </view>
          </view>
        </view>

        <view class="quantity-section">
          <view class="quantity-title">购买数量</view>
          <view class="quantity-control">
            <view 
              class="quantity-btn" 
              :class="{ disabled: quantity <= 1 }"
              @click="decreaseQuantity"
            >
              <u-icon name="minus" color="#666666" size="28" />
            </view>
            <input 
              class="quantity-input" 
              type="number" 
              v-model="quantity" 
              @blur="checkQuantity"
            />
            <view 
              class="quantity-btn"
              :class="{ disabled: quantity >= maxQuantity }"
              @click="increaseQuantity"
            >
              <u-icon name="plus" color="#666666" size="28" />
            </view>
          </view>
        </view>

        <view class="popup-footer">
          <button class="confirm-btn" @click="confirmSku">
            <text class="confirm-text">确定</text>
          </button>
        </view>
      </view>
    </u-popup>
  </view>
</template>

<script>
import { getProductDetail } from '../api/index.js'

export default {
  data() {
    return {
      statusBarHeight: 0,
      safeAreaBottom: 0,
      navBarHeight: 0,
      bottomBarHeight: 0,
      navBarWhite: false,
      productId: '',
      productInfo: {},
      carouselImages: [],
      skuList: [],
      selectedSku: {},
      quantity: 1,
      maxQuantity: 99,
      skuPopupShow: false,
      currentTab: 0,
      tabs: ['商品详情', '规格参数']
    }
  },
  computed: {
    // 计算最低积分价格
    minPoints() {
      if (this.skuList.length === 0) return 0
      return Math.min(...this.skuList.map(sku => sku.pointsRequired))
    }
  },
  onLoad(options) {
    this.productId = options.id
    this.initPage()
    this.getProductDetail()
  },
  methods: {
    initPage() {
      const systemInfo = uni.getSystemInfoSync()
      this.statusBarHeight = systemInfo.statusBarHeight || 0
      this.safeAreaBottom = systemInfo.safeAreaInsets?.bottom || 0
      
      // 计算导航栏和底部栏的高度，用于padding
      this.navBarHeight = this.statusBarHeight + 44 // 状态栏 + 导航栏(44px)
      this.bottomBarHeight = 60 + this.safeAreaBottom // 底部按钮区域(60px) + 安全区
    },
    
    async getProductDetail() {
      try {
        uni.showLoading({ title: '加载中...' })
        const data = await getProductDetail(this.productId)
        
        this.productInfo = data
        this.carouselImages = data.carouselImages || [data.mainImage]
        this.skuList = data.skuList || []
        
        // 默认选中第一个SKU
        if (this.skuList.length > 0) {
          this.selectedSku = this.skuList[0]
        }
        
        // 计算最大购买数量
        if (this.productInfo.purchaseLimit > 0) {
          this.maxQuantity = this.productInfo.purchaseLimit
        }
      } catch (error) {
        console.error('获取商品详情失败:', error)
        uni.showToast({ title: '加载失败', icon: 'none' })
      } finally {
        uni.hideLoading()
      }
    },
    
    switchTab(index) {
      this.currentTab = index
    },
    
    showSkuPopup() {
      this.skuPopupShow = true
    },
    
    selectSku(sku) {
      if (sku.stock === 0) {
        uni.showToast({ title: '该规格已售罄', icon: 'none' })
        return
      }
      this.selectedSku = sku
    },
    
    decreaseQuantity() {
      if (this.quantity > 1) {
        this.quantity--
      }
    },
    
    increaseQuantity() {
      if (this.quantity < this.maxQuantity) {
        this.quantity++
      } else {
        uni.showToast({ 
          title: `最多购买${this.maxQuantity}件`, 
          icon: 'none' 
        })
      }
    },
    
    checkQuantity() {
      if (this.quantity < 1) {
        this.quantity = 1
      } else if (this.quantity > this.maxQuantity) {
        this.quantity = this.maxQuantity
      }
    },
    
    confirmSku() {
      if (!this.selectedSku.id) {
        uni.showToast({ title: '请选择规格', icon: 'none' })
        return
      }
      this.skuPopupShow = false
    },
    
    handleExchange() {
      if (!this.selectedSku.id) {
        uni.showToast({ title: '请先选择规格', icon: 'none' })
        this.showSkuPopup()
        return
      }
      
      // 跳转到确认订单页
      uni.navigateTo({
        url: `/pages/subPackages/points/order-confirm/order-confirm?skuId=${this.selectedSku.id}&quantity=${this.quantity}`
      })
    },
    
    handleScroll(e) {
      const scrollTop = e.detail.scrollTop
      // 当滚动超过导航栏高度时，导航栏变白
      this.navBarWhite = scrollTop > this.navBarHeight
    },
    
    goBack() {
      uni.navigateBack()
    },
    

  }
}
</script>

<style scoped>
.product-detail-page {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #F5F7FA;
}

/* 导航栏 */
.nav-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 999;
  background: linear-gradient(180deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0) 100%);
  transition: all 0.3s ease;
}

.nav-bar-white {
  background: #FFFFFF !important;
  box-shadow: 0 2rpx 16rpx rgba(0,0,0,0.08);
}

.nav-content {
  height: 88rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 32rpx;
}

.nav-btn {
  width: 64rpx;
  height: 64rpx;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10rpx);
  border-radius: 32rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.nav-bar-white .nav-btn {
  background: rgba(0, 0, 0, 0.05);
}

.nav-placeholder {
  width: 64rpx;
  height: 64rpx;
}

.nav-btn:active {
  transform: scale(0.95);
  background: rgba(0, 0, 0, 0.5);
}

.nav-title {
  flex: 1;
  text-align: center;
  font-size: 32rpx;
  color: #FFFFFF;
  font-weight: 600;
  text-shadow: 0 2rpx 8rpx rgba(0,0,0,0.3);
  transition: all 0.3s ease;
}

.nav-bar-white .nav-title {
  color: #1A1A1A;
  text-shadow: none;
}

/* 滚动容器 */
.content-scroll {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  height: 100vh;
}

/* 轮播图 */
.swiper-section {
  width: 100%;
  height: 750rpx;
  background: #FFFFFF;
}

.product-swiper {
  width: 100%;
  height: 100%;
}

.swiper-image {
  width: 100%;
  height: 100%;
}

/* 商品信息卡片 */
.product-info-card {
  background: #FFFFFF;
  padding: 32rpx;
  margin-bottom: 16rpx;
}

.price-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24rpx;
}

.price-row {
  display: flex;
  align-items: baseline;
}

.points-price {
  font-size: 64rpx;
  color: #FF7043;
  font-weight: bold;
  line-height: 1;
}

.points-unit {
  font-size: 28rpx;
  color: #FF7043;
  margin-left: 8rpx;
}

.cash-price {
  font-size: 32rpx;
  color: #FF7043;
  margin-left: 16rpx;
}

.limit-tag {
  padding: 8rpx 16rpx;
  background: linear-gradient(135deg, #FFF4F0 0%, #FFE8E0 100%);
  border-radius: 8rpx;
  font-size: 22rpx;
  color: #FF7043;
}

.product-name {
  font-size: 36rpx;
  color: #1A1A1A;
  font-weight: 600;
  line-height: 1.4;
  margin-bottom: 16rpx;
}

.product-desc {
  font-size: 26rpx;
  color: #999999;
  line-height: 1.6;
  margin-bottom: 32rpx;
}

.spec-selector {
  display: flex;
  align-items: center;
  padding: 24rpx;
  background: #F7F8FA;
  border-radius: 16rpx;
}

.spec-label {
  font-size: 28rpx;
  color: #666666;
  margin-right: 16rpx;
}

.spec-value {
  flex: 1;
  font-size: 28rpx;
  color: #1A1A1A;
}

/* Tab切换 */
.tabs-section {
  display: flex;
  background: #FFFFFF;
  padding: 0 32rpx;
  margin-bottom: 16rpx;
}

.tab-item {
  position: relative;
  flex: 1;
  height: 88rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.tab-text {
  font-size: 28rpx;
  color: #666666;
  transition: all 0.3s ease;
}

.tab-item.active .tab-text {
  font-size: 32rpx;
  color: #FF7043;
  font-weight: 600;
}

.tab-indicator {
  position: absolute;
  bottom: 0;
  width: 48rpx;
  height: 6rpx;
  background: linear-gradient(90deg, #FF7043 0%, #FF5722 100%);
  border-radius: 3rpx;
}

/* Tab内容 */
.tab-content {
  background: #FFFFFF;
  padding: 32rpx;
}

.detail-content {
  line-height: 1.8;
}

.rich-text {
  font-size: 28rpx;
  color: #333333;
}

.empty-detail {
  padding: 60rpx 0;
  text-align: center;
}

.empty-text {
  font-size: 28rpx;
  color: #999999;
}

.spec-content {
  
}

.spec-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24rpx 0;
  border-bottom: 1rpx solid #F0F0F0;
}

.spec-item:last-child {
  border-bottom: none;
}

.spec-item-label {
  font-size: 28rpx;
  color: #666666;
}

.spec-item-value {
  font-size: 28rpx;
  color: #1A1A1A;
}

/* 底部操作栏 */
.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #FFFFFF;
  border-top: 1rpx solid #F0F0F0;
  box-shadow: 0 -4rpx 16rpx rgba(0,0,0,0.05);
}

.bar-content {
  padding: 16rpx 32rpx;
}

.exchange-btn {
  width: 100%;
  height: 88rpx;
  background: linear-gradient(135deg, #FF7043 0%, #FF5722 100%);
  border-radius: 44rpx;
  border: none;
  box-shadow: 0 8rpx 24rpx rgba(255, 112, 67, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.exchange-btn:active {
  transform: scale(0.98);
  box-shadow: 0 4rpx 16rpx rgba(255, 112, 67, 0.4);
}

.btn-text {
  color: #FFFFFF;
  font-size: 32rpx;
  font-weight: 600;
}

/* SKU弹窗 */
.sku-popup {
  background: #FFFFFF;
  border-radius: 32rpx 32rpx 0 0;
  max-height: 80vh;
  overflow-y: scroll;
}

.popup-header {
  position: relative;
  height: 88rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1rpx solid #F0F0F0;
}

.popup-close {
  position: absolute;
  right: 32rpx;
  width: 56rpx;
  height: 56rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.popup-product {
  display: flex;
  padding: 32rpx;
}

.popup-image {
  width: 160rpx;
  height: 160rpx;
  border-radius: 16rpx;
  margin-right: 24rpx;
  flex-shrink: 0;
}

.popup-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.popup-price {
  display: flex;
  align-items: baseline;
  margin-bottom: 12rpx;
}

.popup-points {
  font-size: 48rpx;
  color: #FF7043;
  font-weight: bold;
  line-height: 1;
}

.popup-unit {
  font-size: 24rpx;
  color: #FF7043;
  margin-left: 8rpx;
}

.popup-name {
  font-size: 28rpx;
  color: #1A1A1A;
  margin-bottom: 8rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.popup-spec {
  font-size: 24rpx;
  color: #999999;
}

.popup-divider {
  height: 16rpx;
  background: #F7F8FA;
}

.sku-section {
  padding: 32rpx;
}

.sku-title {
  font-size: 28rpx;
  color: #1A1A1A;
  font-weight: 600;
  margin-bottom: 24rpx;
}

.sku-list {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
}

.sku-item {
  position: relative;
  min-width: 200rpx;
  padding: 20rpx 24rpx;
  background: #F7F8FA;
  border: 2rpx solid #F7F8FA;
  border-radius: 12rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: all 0.3s ease;
}

.sku-item.active {
  background: #FFF4F0;
  border-color: #FF7043;
}

.sku-item.disabled {
  opacity: 0.5;
}

.sku-name {
  font-size: 26rpx;
  color: #1A1A1A;
  margin-bottom: 8rpx;
}

.sku-points {
  font-size: 22rpx;
  color: #FF7043;
}

.sku-sold-out {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 22rpx;
  color: #999999;
}

.sku-check {
  position: absolute;
  right: 8rpx;
  bottom: 8rpx;
}

.quantity-section {
  padding: 32rpx;
  border-top: 1rpx solid #F0F0F0;
}

.quantity-title {
  font-size: 28rpx;
  color: #1A1A1A;
  font-weight: 600;
  margin-bottom: 24rpx;
}

.quantity-control {
  display: flex;
  align-items: center;
}

.quantity-btn {
  width: 64rpx;
  height: 64rpx;
  background: #F7F8FA;
  border-radius: 32rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.quantity-btn:active {
  transform: scale(0.95);
}

.quantity-btn.disabled {
  opacity: 0.5;
}

.quantity-input {
  flex: 1;
  height: 64rpx;
  text-align: center;
  font-size: 32rpx;
  color: #1A1A1A;
  font-weight: 600;
}

.popup-footer {
  padding: 16rpx 32rpx 32rpx;
}

.confirm-btn {
  width: 100%;
  height: 88rpx;
  background: linear-gradient(135deg, #FF7043 0%, #FF5722 100%);
  border-radius: 44rpx;
  border: none;
  box-shadow: 0 8rpx 24rpx rgba(255, 112, 67, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
}

.confirm-text {
  color: #FFFFFF;
  font-size: 32rpx;
  font-weight: 600;
}
</style>
