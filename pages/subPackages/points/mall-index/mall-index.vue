<template>
  <view class="mall-container">
    <!-- 自定义导航栏 -->
    <uni-nav-bar 
      :fixed="true" 
      :shadow="false" 
      :border="false" 
      status-bar
      background-color="#FFFFFF"
      title="积分商城"
    />
    
    <scroll-view 
      class="scroll-container"
      scroll-y
      @scrolltolower="loadMore"
      refresher-enabled
      :refresher-triggered="refreshing"
      @refresherrefresh="onRefresh"
    >
      <!-- 积分余额卡片 -->
      <view class="points-card">
        <view class="points-label">我的积分</view>
        <view class="points-value">{{ userPoints }}</view>
      </view>
      
      <!-- 搜索栏 -->
      <view class="search-bar">
        <u-search 
          v-model="searchKeyword" 
          placeholder="搜索商品"
          :show-action="false"
          @search="handleSearch"
          @clear="handleSearchClear"
        />
      </view>
      
      <!-- 分类Tab -->
      <view class="category-tabs">
        <u-tabs 
          :list="categoryList" 
          :current="currentCategory"
          @change="handleCategoryChange"
          :scrollable="true"
        />
      </view>
      
      <!-- 商品列表 -->
      <view class="product-list">
        <ProductCard
          v-for="item in productList"
          :key="item.id"
          :product="item"
          @click="goToDetail"
        />
      </view>

      <!-- 加载状态 -->
      <view v-if="loading && productList.length === 0" class="loading-state">
        <u-loading mode="circle" />
        <text class="loading-text">加载中...</text>
      </view>

      <!-- 空状态 -->
      <view v-if="!loading && productList.length === 0" class="empty-state">
        <image class="empty-image" src="/static/base/placeholderMap.png" mode="aspectFit" />
        <text class="empty-text">暂无商品</text>
      </view>

      <!-- 加载更多 -->
      <view v-if="productList.length > 0" class="loadmore-state">
        <text v-if="loadingMore" class="loadmore-text">加载中...</text>
        <text v-else-if="noMore" class="loadmore-text">没有更多了</text>
      </view>
    </scroll-view>
  </view>
</template>

<script>
import ProductCard from '@/components/points/ProductCard.vue';
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
    
    // 加载用户积分
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
    
    // 加载分类
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
    
    // 加载商品列表
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
    
    // 搜索
    handleSearch() {
      this.loadProducts(true);
    },
    
    // 清空搜索
    handleSearchClear() {
      this.searchKeyword = '';
      this.loadProducts(true);
    },
    
    // 切换分类
    handleCategoryChange(index) {
      this.currentCategory = index;
      this.loadProducts(true);
    },
    
    // 下拉刷新
    onRefresh() {
      this.refreshing = true;
      this.loadProducts(true);
    },
    
    // 加载更多
    loadMore() {
      if (!this.noMore && !this.loadingMore) {
        this.loadProducts(false);
      }
    },
    
    // 跳转商品详情
    goToDetail(product) {
      uni.navigateTo({
        url: `/pages/subPackages/points/product-detail/product-detail?id=${product.id}`
      });
    }
  }
};
</script>

<style scoped>
.mall-container {
  width: 100%;
  height: 100vh;
  background: #F3F4F6;
  display: flex;
  flex-direction: column;
}

.scroll-container {
  flex: 1;
  padding: 20rpx;
}

.points-card {
  background: linear-gradient(135deg, #EE781F 0%, #FF9A4D 100%);
  border-radius: 16rpx;
  padding: 40rpx;
  margin-bottom: 20rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.points-label {
  font-size: 28rpx;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 12rpx;
}

.points-value {
  font-size: 64rpx;
  color: #FFFFFF;
  font-weight: bold;
}

.search-bar {
  margin-bottom: 20rpx;
}

.category-tabs {
  margin-bottom: 20rpx;
  background: #FFFFFF;
  border-radius: 16rpx;
  padding: 20rpx 0;
}

.product-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20rpx;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80rpx 0;
}

.loading-text {
  font-size: 28rpx;
  color: #A2A2A8;
  margin-top: 20rpx;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 120rpx 0;
}

.empty-image {
  width: 400rpx;
  height: 300rpx;
  margin-bottom: 40rpx;
}

.empty-text {
  font-size: 28rpx;
  color: #A2A2A8;
}

.loadmore-state {
  padding: 40rpx 0;
  text-align: center;
}

.loadmore-text {
  font-size: 24rpx;
  color: #A2A2A8;
}
</style>
