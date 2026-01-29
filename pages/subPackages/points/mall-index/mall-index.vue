<template>
  <view class="mall-page">
    <!-- 自定义导航栏 -->
    <uni-nav-bar 
      :fixed="true" 
      :shadow="false" 
      :border="false" 
      status-bar
      background-color="linear-gradient(135deg, #FF6B35 0%, #FF8E53 100%)"
    >
      <template #default>
        <text class="nav-title">积分商城</text>
      </template>
    </uni-nav-bar>
    
    <!-- 头部渐变背景 -->
    <view class="header-gradient">
      <!-- 积分卡片 -->
      <view class="points-card">
        <view class="points-content">
          <view class="points-label">我的积分</view>
          <view class="points-value">{{ userPoints }}</view>
        </view>
        <view class="points-icon">💎</view>
      </view>
      
      <!-- 搜索栏 -->
      <view class="search-wrapper">
        <u-search 
          v-model="searchKeyword" 
          placeholder="搜索你想要的商品"
          :show-action="false"
          shape="round"
          bg-color="#FFFFFF"
          @search="handleSearch"
          @clear="handleSearchClear"
        />
      </view>
    </view>

    <scroll-view 
      class="scroll-container"
      scroll-y
      @scrolltolower="loadMore"
      refresher-enabled
      :refresher-triggered="refreshing"
      @refresherrefresh="onRefresh"
    >
      <!-- 分类Tab -->
      <view class="category-section">
        <scroll-view class="category-scroll" scroll-x :show-scrollbar="false">
          <view class="category-list">
            <view 
              v-for="(cat, index) in categoryList" 
              :key="index"
              class="category-item"
              :class="{ 'category-item-active': currentCategory === index }"
              @click="handleCategoryChange(index)"
            >
              <text class="category-text">{{ cat.name }}</text>
            </view>
          </view>
        </scroll-view>
      </view>
      
      <!-- 商品网格 -->
      <view class="product-grid">
        <ProductCard
          v-for="item in productList"
          :key="item.id"
          :product="item"
          @click="goToDetail"
        />
      </view>

      <!-- 加载状态 -->
      <view v-if="loading && productList.length === 0" class="loading-state">
        <u-loading-icon mode="circle" color="#FF6B35" size="60" />
        <text class="loading-text">加载中...</text>
      </view>

      <!-- 空状态 -->
      <view v-if="!loading && productList.length === 0" class="empty-state">
        <text class="empty-icon">🛍️</text>
        <text class="empty-text">暂无商品</text>
        <text class="empty-tip">换个分类看看吧</text>
      </view>

      <!-- 加载更多 -->
      <view v-if="productList.length > 0" class="loadmore-state">
        <text v-if="loadingMore" class="loadmore-text">加载中...</text>
        <text v-else-if="noMore" class="loadmore-text">— 已经到底了 —</text>
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
        uni.showToast({
          title: '加载分类失败',
          icon: 'none'
        });
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
    
    handleSearchClear() {
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
    }
  }
};
</script>

<style scoped>
.mall-page {
  width: 100%;
  min-height: 100vh;
  background: #F7F8FA;
}

.nav-title {
  font-size: 36rpx;
  color: #FFFFFF;
  font-weight: 600;
}

.header-gradient {
  background: linear-gradient(180deg, #FF6B35 0%, #FF8E53 50%, #F7F8FA 100%);
  padding: 20rpx 32rpx 40rpx;
}

.points-card {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.85) 100%);
  backdrop-filter: blur(20rpx);
  border-radius: 24rpx;
  padding: 32rpx;
  margin-bottom: 24rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 8rpx 32rpx rgba(255, 107, 53, 0.2);
}

.points-content {
  flex: 1;
}

.points-label {
  font-size: 26rpx;
  color: #666666;
  margin-bottom: 8rpx;
}

.points-value {
  font-size: 64rpx;
  color: #FF6B35;
  font-weight: bold;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif;
}

.points-icon {
  font-size: 80rpx;
}

.search-wrapper {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 48rpx;
  overflow: hidden;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.08);
}

.scroll-container {
  flex: 1;
}

.category-section {
  background: #FFFFFF;
  padding: 24rpx 0;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
}

.category-scroll {
  white-space: nowrap;
}

.category-list {
  display: inline-flex;
  padding: 0 32rpx;
  gap: 16rpx;
}

.category-item {
  display: inline-block;
  padding: 12rpx 32rpx;
  background: #F7F8FA;
  border-radius: 48rpx;
  transition: all 0.3s ease;
}

.category-item-active {
  background: linear-gradient(135deg, #FF6B35 0%, #FF8E53 100%);
  box-shadow: 0 4rpx 16rpx rgba(255, 107, 53, 0.3);
}

.category-text {
  font-size: 26rpx;
  color: #666666;
  white-space: nowrap;
}

.category-item-active .category-text {
  color: #FFFFFF;
  font-weight: 500;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20rpx;
  padding: 0 32rpx 32rpx;
}

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

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 120rpx 0;
}

.empty-icon {
  font-size: 120rpx;
  margin-bottom: 24rpx;
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

.loadmore-state {
  padding: 40rpx 0;
  text-align: center;
}

.loadmore-text {
  font-size: 24rpx;
  color: #999999;
}
</style>
