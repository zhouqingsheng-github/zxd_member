<template>
  <view class="mall-page">
    <!-- 头部区域 -->
    <view class="header-section">
      <!-- 状态栏占位 -->
      <view class="status-bar" :style="{ height: statusBarHeight + 'px' }"></view>
      
      <!-- 导航栏 -->
      <view class="nav-bar">
        <view class="nav-left" @click="goBack">
          <view class="back-btn">
            <u-icon name="arrow-left" color="#FFFFFF" size="40" />
          </view>
        </view>
        <text class="nav-title">积分商城</text>
        <view class="nav-right" @click="goToOrderList">
          <view class="history-btn">
            <u-icon name="list" color="#FFFFFF" size="40" />
          </view>
        </view>
      </view>
      
      <!-- 装饰性背景 -->
      <view class="header-decoration">
        <view class="decoration-circle circle-1"></view>
        <view class="decoration-circle circle-2"></view>
        <view class="decoration-circle circle-3"></view>
      </view>
      
      <!-- 积分卡片 -->
      <view class="points-card-wrapper">
        <view class="points-card">
          <view class="card-bg"></view>
          <view class="card-content">
            <view class="points-main">
              <view class="points-info">
                <text class="points-label">我的积分</text>
                <view class="points-value-row">
                  <text class="points-value">{{ userPoints }}</text>
                  <text class="points-unit">分</text>
                </view>
              </view>
              <view class="points-icon-wrapper">
                <image 
                  src="/static/images/points-icon.png" 
                  class="points-icon"
                  mode="aspectFit"
                />
              </view>
            </view>
            <view class="card-footer">
              <view class="record-btn" @click="goToOrderList">
                <text class="record-text">兑换记录</text>
                <u-icon name="arrow-right" color="#FF7043" size="24" />
              </view>
            </view>
          </view>
        </view>
      </view>
      
      <!-- 搜索框 -->
      <view class="search-section">
        <view class="search-box">
          <u-icon name="search" color="#999999" size="36" />
          <input 
            class="search-input" 
            v-model="searchKeyword"
            placeholder="搜索你想要的商品"
            placeholder-class="search-placeholder-class"
            confirm-type="search"
            @confirm="handleSearch"
          />
          <view v-if="searchKeyword" class="clear-btn" @click="clearSearch">
            <u-icon name="close-circle-fill" color="#CCCCCC" size="32" />
          </view>
        </view>
      </view>
    </view>

    <!-- 分类Tab -->
    <view class="category-section">
      <scroll-view class="category-scroll" scroll-x :show-scrollbar="false">
        <view class="category-list">
          <view 
            v-for="(cat, index) in categoryList" 
            :key="index"
            class="category-item"
            @click="handleCategoryChange(index)"
          >
            <text 
              class="category-text" 
              :class="{ 'category-text-active': currentCategory === index }"
            >
              {{ cat.name }}
            </text>
            <view 
              class="category-indicator" 
              :class="{ 'indicator-active': currentCategory === index }"
            ></view>
          </view>
        </view>
      </scroll-view>
    </view>

    <scroll-view 
      class="content-scroll"
      scroll-y
      @scrolltolower="loadMore"
      refresher-enabled
      :refresher-triggered="refreshing"
      @refresherrefresh="onRefresh"
    >
      <!-- 商品网格 -->
      <view class="product-section">
        <view class="product-grid">
          <ProductCard
            v-for="item in productList"
            :key="item.id"
            :product="item"
            @click="goToDetail"
          />
        </view>
      </view>

      <!-- 加载状态 -->
      <view v-if="loading && productList.length === 0" class="loading-state">
        <u-loading-icon mode="circle" color="#FF7043" size="60" />
        <text class="loading-text">加载中...</text>
      </view>

      <!-- 空状态 -->
      <view v-if="!loading && productList.length === 0" class="empty-state">
        <image 
          src="/static/images/empty-product.png" 
          class="empty-image"
          mode="aspectFit"
        />
        <text class="empty-text">暂无商品</text>
        <text class="empty-tip">换个分类看看吧~</text>
      </view>

      <!-- 加载更多 -->
      <view v-if="productList.length > 0" class="loadmore-state">
        <view v-if="loadingMore" class="loadmore-loading">
          <u-loading-icon mode="circle" color="#FF7043" size="40" />
          <text class="loadmore-text">加载中...</text>
        </view>
        <text v-else-if="noMore" class="loadmore-end">— 已经到底了 —</text>
      </view>
    </scroll-view>
  </view>
</template>

<script>
import ProductCard from '../components/ProductCard.vue';
import { getProductList, getCategoryTree } from '@/common/api';
import { getUserInfo } from '@/store/index';

export default {
  components: {
    ProductCard
  },
  data() {
    return {
      statusBarHeight: 0,
      userPoints: 0,
      searchKeyword: '',
      categoryList: [],
      currentCategory: 0,
      productList: [],
      loading: false,
      loadingMore: false,
      refreshing: false,
      noMore: false,
      page: 1,
      pageSize: 10
    };
  },
  onLoad() {
    // 获取状态栏高度
    const systemInfo = uni.getSystemInfoSync();
    this.statusBarHeight = systemInfo.statusBarHeight || 0;
    
    this.init();
  },
  onShow() {
    this.loadUserPoints();
  },
  methods: {
    async init() {
      await this.loadCategories();
      await this.loadUserPoints();
      await this.loadProducts(true);
    },
    
    async loadUserPoints() {
      try {
        const userInfo = getUserInfo();
        if (userInfo && userInfo.points !== undefined) {
          this.userPoints = userInfo.points;
        }
      } catch (error) {
        console.error('加载用户积分失败:', error);
      }
    },
    
    async loadCategories() {
      try {
        const categories = await getCategoryTree();
        this.categoryList = [
          { name: '全部', value: 0 },
          ...(categories || []).map(cat => ({
            name: cat.categoryName,
            value: cat.id
          }))
        ];
      } catch (error) {
        console.error('加载分类失败:', error);
      }
    },
    
    async loadProducts(reset = false) {
      if (reset) {
        this.page = 1;
        this.noMore = false;
        this.productList = [];
      }
      
      if (this.loading || this.loadingMore) return;
      if (this.noMore && !reset) return;
      
      try {
        if (reset) {
          this.loading = true;
        } else {
          this.loadingMore = true;
        }
        
        const params = {
          page: this.page,
          pageSize: this.pageSize
        };
        
        if (this.searchKeyword) {
          params.keyword = this.searchKeyword;
        }
        
        if (this.currentCategory > 0) {
          params.categoryId = this.categoryList[this.currentCategory].value;
        }
        
        const result = await getProductList(params);
        const list = result.records || [];
        
        if (reset) {
          this.productList = list;
        } else {
          this.productList = [...this.productList, ...list];
        }
        
        if (list.length < this.pageSize) {
          this.noMore = true;
        } else {
          this.page++;
        }
      } catch (error) {
        console.error('加载商品列表失败:', error);
        uni.showToast({
          title: '加载失败',
          icon: 'none'
        });
      } finally {
        this.loading = false;
        this.loadingMore = false;
        this.refreshing = false;
      }
    },
    
    handleSearch() {
      this.loadProducts(true);
    },
    
    clearSearch() {
      this.searchKeyword = '';
      this.loadProducts(true);
    },
    
    handleCategoryChange(index) {
      this.currentCategory = index;
      this.loadProducts(true);
    },
    
    onRefresh() {
      this.refreshing = true;
      this.loadProducts(true);
    },
    
    loadMore() {
      if (!this.noMore && !this.loadingMore) {
        this.loadProducts(false);
      }
    },
    
    goToDetail(product) {
      uni.navigateTo({
        url: `/pages/subPackages/points/product-detail/product-detail?id=${product.id}`
      });
    },
    
    goBack() {
      uni.navigateBack();
    },
    
    goToOrderList() {
      uni.navigateTo({
        url: '/pages/subPackages/points/order-list/order-list'
      });
    }
  }
};
</script>

<style scoped>
.mall-page {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #F5F7FA;
}

/* 头部区域 */
.header-section {
  position: relative;
  background: linear-gradient(135deg, #FF7043 0%, #FF5722 50%, #F4511E 100%);
  padding-bottom: 40rpx;
  overflow: hidden;
  flex-shrink: 0;
}

.status-bar {
  width: 100%;
}

.nav-bar {
  height: 88rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 32rpx;
  position: relative;
  z-index: 10;
}

.nav-left,
.nav-right {
  width: 80rpx;
  display: flex;
  align-items: center;
}

.nav-right {
  justify-content: flex-end;
}

.back-btn,
.history-btn {
  width: 64rpx;
  height: 64rpx;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10rpx);
  border-radius: 32rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.back-btn:active,
.history-btn:active {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(0.95);
}

.nav-title {
  font-size: 36rpx;
  color: #FFFFFF;
  font-weight: 600;
  letter-spacing: 2rpx;
}

/* 装饰性背景 */
.header-decoration {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  pointer-events: none;
}

.decoration-circle {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
}

.circle-1 {
  width: 400rpx;
  height: 400rpx;
  top: -200rpx;
  right: -100rpx;
}

.circle-2 {
  width: 300rpx;
  height: 300rpx;
  top: 100rpx;
  left: -150rpx;
}

.circle-3 {
  width: 200rpx;
  height: 200rpx;
  bottom: -50rpx;
  right: 50rpx;
}

/* 积分卡片 */
.points-card-wrapper {
  padding: 0 32rpx 24rpx;
  position: relative;
  z-index: 10;
}

.points-card {
  position: relative;
  height: 180rpx;
  border-radius: 24rpx;
  overflow: hidden;
  box-shadow: 0 12rpx 40rpx rgba(0, 0, 0, 0.15);
}

.card-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.85) 100%);
  backdrop-filter: blur(20rpx);
}

.card-content {
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 32rpx 40rpx 24rpx;
}

.points-main {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.points-info {
  flex: 1;
}

.points-label {
  font-size: 26rpx;
  color: #666666;
  display: block;
  margin-bottom: 12rpx;
}

.points-value-row {
  display: flex;
  align-items: baseline;
}

.points-value {
  font-size: 72rpx;
  color: #FF7043;
  font-weight: bold;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif;
  line-height: 1;
}

.points-unit {
  font-size: 28rpx;
  color: #FF7043;
  margin-left: 8rpx;
}

.card-footer {
  display: flex;
  justify-content: flex-end;
}

.record-btn {
  display: flex;
  align-items: center;
  padding: 12rpx 24rpx;
  background: linear-gradient(135deg, #FFF4F0 0%, #FFE8E0 100%);
  border-radius: 24rpx;
  box-shadow: 0 4rpx 12rpx rgba(255, 112, 67, 0.15);
  transition: all 0.3s ease;
}

.record-btn:active {
  transform: scale(0.95);
  box-shadow: 0 2rpx 8rpx rgba(255, 112, 67, 0.2);
}

.record-text {
  font-size: 24rpx;
  color: #FF7043;
  font-weight: 500;
  margin-right: 4rpx;
}

.points-icon-wrapper {
  width: 120rpx;
  height: 120rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.points-icon {
  width: 100rpx;
  height: 100rpx;
}

/* 搜索框 */
.search-section {
  padding: 0 32rpx;
  position: relative;
  z-index: 10;
}

.search-box {
  height: 72rpx;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10rpx);
  border-radius: 36rpx;
  display: flex;
  align-items: center;
  padding: 0 32rpx;
  box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.08);
}

.search-input {
  flex: 1;
  height: 100%;
  font-size: 28rpx;
  color: #1A1A1A;
  margin-left: 16rpx;
}

.search-placeholder-class {
  color: #999999;
  font-size: 28rpx;
}

.clear-btn {
  width: 48rpx;
  height: 48rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 16rpx;
}

/* 分类Tab */
.category-section {
  background: #FFFFFF;
  padding: 32rpx 0 24rpx;
  margin-top: 20rpx;
  flex-shrink: 0;
}

.category-scroll {
  white-space: nowrap;
}

.category-list {
  display: inline-flex;
  padding: 0 32rpx;
  gap: 48rpx;
}

.category-item {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
}

.category-text {
  font-size: 28rpx;
  color: #666666;
  white-space: nowrap;
  transition: all 0.3s ease;
  padding-bottom: 12rpx;
}

.category-text-active {
  font-size: 32rpx;
  color: #FF7043;
  font-weight: 600;
}

.category-indicator {
  width: 0;
  height: 6rpx;
  background: linear-gradient(90deg, #FF7043 0%, #FF5722 100%);
  border-radius: 3rpx;
  transition: width 0.3s ease;
}

.indicator-active {
  width: 40rpx;
}

/* 内容区域 */
.content-scroll {
  flex: 1;
}

.product-section {
  padding: 24rpx 32rpx 32rpx;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24rpx;
}

/* 加载状态 */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 120rpx 0;
}

.loading-text {
  font-size: 26rpx;
  color: #999999;
  margin-top: 24rpx;
}

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 120rpx 0;
}

.empty-image {
  width: 320rpx;
  height: 320rpx;
  margin-bottom: 32rpx;
}

.empty-text {
  font-size: 32rpx;
  color: #666666;
  margin-bottom: 12rpx;
}

.empty-tip {
  font-size: 26rpx;
  color: #999999;
}

/* 加载更多 */
.loadmore-state {
  padding: 40rpx 0 60rpx;
  display: flex;
  justify-content: center;
}

.loadmore-loading {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.loadmore-text {
  font-size: 24rpx;
  color: #999999;
}

.loadmore-end {
  font-size: 24rpx;
  color: #CCCCCC;
}
</style>
