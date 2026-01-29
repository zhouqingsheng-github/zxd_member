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
      <view 
        v-for="item in productList" 
        :key="item.id"
        class="product-item"
        @click="goToDetail(item.id)"
      >
        <image 
          :src="item.mainImage" 
          class="product-image"
          mode="aspectFill"
        />
        <view class="product-info">
          <view class="product-name">{{ item.spuName }}</view>
          <view class="product-price">
            <text class="points">{{ item.minPointsRequired }}</text>
            <text class="points-unit">积分</text>
            <text v-if="item.minCashRequired > 0" class="cash">+¥{{ item.minCashRequired }}</text>
          </view>
        </view>
      </view>
    </view>
    
    <!-- 空状态 -->
    <u-empty 
      v-if="!loading && productList.length === 0"
      text="暂无商品"
      mode="list"
    />
    
    <!-- 加载状态 -->
    <u-loading-page :loading="loading" />
  </view>
</template>

<script>
import { getProductList, getCategoryTree, getMemberPoints } from '@/common/api/points'

export default {
  data() {
    return {
      userPoints: 0,
      searchKeyword: '',
      categoryList: [
        { name: '全部', id: null }
      ],
      currentCategory: 0,
      productList: [],
      loading: false,
      pageNum: 1,
      pageSize: 10,
      hasMore: true
    }
  },
  
  onLoad() {
    this.loadUserPoints()
    this.loadCategories()
    this.loadProducts(true)
  },
  
  onPullDownRefresh() {
    this.loadProducts(true).then(() => {
      uni.stopPullDownRefresh()
    })
  },
  
  onReachBottom() {
    this.loadProducts()
  },
  
  methods: {
    // 加载用户积分
    async loadUserPoints() {
      try {
        const res = await getMemberPoints()
        console.log('积分接口返回:', res)
        this.userPoints = res.availablePoints || 0
      } catch (error) {
        console.error('加载积分失败:', error)
      }
    },
    
    // 加载分类列表
    async loadCategories() {
      try {
        const res = await getCategoryTree()
        console.log('分类接口返回:', res)
        // 扁平化分类树，保留层级关系
        const flatCategories = []
        res.forEach(parent => {
          // 添加父分类
          flatCategories.push({
            name: parent.categoryName,
            id: parent.id
          })
          // 添加子分类（带缩进标识）
          if (parent.children && parent.children.length > 0) {
            parent.children.forEach(child => {
              flatCategories.push({
                name: `　${child.categoryName}`, // 使用全角空格作为缩进
                id: child.id
              })
            })
          }
        })
        this.categoryList = [{ name: '全部', id: null }, ...flatCategories]
        console.log('处理后的分类列表:', this.categoryList)
      } catch (error) {
        console.error('加载分类失败:', error)
      }
    },
    
    // 加载商品列表
    async loadProducts(refresh = false) {
      if (this.loading) return
      if (!refresh && !this.hasMore) return
      
      this.loading = true
      
      try {
        if (refresh) {
          this.pageNum = 1
          this.productList = []
        }
        
        const categoryId = this.categoryList[this.currentCategory]?.id
        const params = {
          pageNum: this.pageNum,
          pageSize: this.pageSize
        }
        
        // 只有当 categoryId 存在时才添加到参数中
        if (categoryId) {
          params.categoryId = categoryId
        }
        
        // 只有当 searchKeyword 不为空时才添加到参数中
        if (this.searchKeyword) {
          params.keyword = this.searchKeyword
        }
        
        console.log('商品列表请求参数:', params)
        const res = await getProductList(params)
        console.log('商品列表接口返回:', res)
        
        const newList = res.records || []
        console.log('商品列表数据:', newList)
        
        if (refresh) {
          this.productList = newList
        } else {
          this.productList = [...this.productList, ...newList]
        }
        
        this.hasMore = this.productList.length < res.total
        this.pageNum++
        
        console.log('当前商品列表:', this.productList)
      } catch (error) {
        console.error('加载商品失败:', error)
        uni.showToast({
          title: '加载失败',
          icon: 'none'
        })
      } finally {
        this.loading = false
      }
    },
    
    // 搜索
    handleSearch() {
      this.loadProducts(true)
    },
    
    // 分类切换
    handleCategoryChange(index) {
      this.currentCategory = index
      this.loadProducts(true)
    },
    
    // 跳转到商品详情
    goToDetail(id) {
      uni.navigateTo({
        url: `/pages/subPackages/points/product-detail/product-detail?id=${id}`
      })
    }
  }
}
</script>

<style scoped lang="scss">
.mall-container {
  min-height: 100vh;
  background-color: #F3F4F6;
  padding-bottom: 20rpx;
}

.points-card {
  margin: 20rpx 24rpx;
  padding: 32rpx;
  background: linear-gradient(135deg, #FF9A56 0%, #EE781F 100%);
  border-radius: 16rpx;
  box-shadow: 0 8rpx 24rpx rgba(238, 120, 31, 0.2);
  
  .points-label {
    font-size: 28rpx;
    color: rgba(255, 255, 255, 0.9);
    margin-bottom: 12rpx;
  }
  
  .points-value {
    font-size: 56rpx;
    font-weight: bold;
    color: #FFFFFF;
  }
}

.search-bar {
  margin: 0 24rpx 20rpx;
}

.category-tabs {
  background-color: #FFFFFF;
  padding: 0 24rpx;
  margin-bottom: 20rpx;
}

.product-list {
  padding: 0 24rpx;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.product-item {
  width: 340rpx;
  background-color: #FFFFFF;
  border-radius: 16rpx;
  overflow: hidden;
  margin-bottom: 20rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
  
  .product-image {
    width: 340rpx;
    height: 340rpx;
  }
  
  .product-info {
    padding: 20rpx;
    position: relative;
    
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
    }
    
    .product-price {
      display: flex;
      align-items: baseline;
      
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
        color: #666666;
        margin-left: 8rpx;
      }
    }
    
    .sold-out-tag {
      position: absolute;
      top: 20rpx;
      right: 20rpx;
      padding: 8rpx 16rpx;
      background-color: rgba(0, 0, 0, 0.5);
      color: #FFFFFF;
      font-size: 22rpx;
      border-radius: 8rpx;
    }
  }
}
</style>
