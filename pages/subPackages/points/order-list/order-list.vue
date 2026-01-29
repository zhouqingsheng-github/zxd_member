<template>
  <view class="order-list-page">
    <!-- 导航栏 -->
    <uni-nav-bar 
      title="我的订单" 
      :fixed="true" 
      :border="false"
      left-icon="left"
      @clickLeft="back"
    />
    
    <!-- Tab切换 -->
    <view class="tabs-container">
      <u-tabs 
        :list="tabs" 
        :current="activeTab"
        @change="onTabChange"
        :active-color="'#EE781F'"
        :inactive-color="'#666'"
        :line-color="'#EE781F'"
        :line-width="60"
        :line-height="6"
      ></u-tabs>
    </view>
    
    <!-- 订单列表 -->
    <view class="order-list-container">
      <!-- 加载状态 -->
      <view v-if="loading && orders.length === 0" class="loading-container">
        <view class="loading-spinner"></view>
        <view class="loading-text">加载中...</view>
      </view>
      
      <!-- 订单列表 -->
      <view v-else-if="orders.length > 0" class="order-list">
        <view 
          v-for="order in orders" 
          :key="order.id"
          class="order-item"
          @click="goToDetail(order.id)"
        >
          <!-- 订单头部 -->
          <view class="order-header">
            <view class="order-no">订单号: {{ order.orderNo }}</view>
            <view 
              class="order-status" 
              :class="{
                'status-pending': order.status === 'PENDING',
                'status-paid': order.status === 'PAID',
                'status-completed': order.status === 'COMPLETED',
                'status-cancelled': order.status === 'CANCELLED'
              }"
            >
              {{ getStatusText(order.status) }}
            </view>
          </view>
          
          <!-- 商品信息 -->
          <view class="order-content">
            <image class="product-image" :src="order.productImage" mode="aspectFill"></image>
            <view class="product-info">
              <view class="product-name">{{ order.productName }}</view>
              <view class="product-spec">{{ order.specName }}</view>
              <view class="product-quantity">x{{ order.quantity }}</view>
            </view>
          </view>
          
          <!-- 门店信息 -->
          <view class="store-info">
            <text class="store-icon">📍</text>
            <text class="store-name">{{ order.storeName }}</text>
          </view>
          
          <!-- 订单底部 -->
          <view class="order-footer">
            <view class="order-amount">
              <text class="points-label">{{ order.pointsAmount }}积分</text>
              <text v-if="order.cashAmount > 0" class="cash-label">
                +¥{{ order.cashAmount }}
              </text>
            </view>
            <view class="order-actions">
              <view 
                v-if="order.status === 'PENDING'" 
                class="action-btn cancel-btn"
                @click.stop="cancelOrder(order.id)"
              >
                取消订单
              </view>
            </view>
          </view>
          
          <!-- 创建时间 -->
          <view class="order-time">{{ formatTime(order.createTime) }}</view>
        </view>
        
        <!-- 加载更多 -->
        <view v-if="!finished" class="load-more">
          <view v-if="loadingMore" class="loading-spinner-small"></view>
          <text v-else>上拉加载更多</text>
        </view>
        <view v-else class="no-more">没有更多了</view>
      </view>
      
      <!-- 空状态 -->
      <view v-else class="empty-container">
        <image class="empty-image" src="/static/base/empty.png" mode="aspectFit"></image>
        <view class="empty-text">暂无订单</view>
      </view>
    </view>
  </view>
</template>

<script>
import { getPointsOrderList, cancelPointsOrder } from '@/common/api';

export default {
  data() {
    return {
      tabs: [
        { name: '全部' },
        { name: '待核销' },
        { name: '已完成' },
        { name: '已取消' }
      ],
      activeTab: 0,
      orders: [],
      loading: false,
      loadingMore: false,
      finished: false,
      page: 1,
      pageSize: 10
    };
  },
  
  onLoad(options) {
    if (options.status) {
      const statusMap = {
        'PENDING': 0,
        'PAID': 1,
        'COMPLETED': 2,
        'CANCELLED': 3
      };
      this.activeTab = statusMap[options.status] || 0;
    }
    this.loadOrders();
  },
  
  onPullDownRefresh() {
    this.onRefresh();
  },
  
  onReachBottom() {
    this.onLoadMore();
  },
  
  methods: {
    back() {
      uni.navigateBack();
    },
    
    onTabChange(index) {
      this.activeTab = index;
      this.onRefresh();
    },
    
    async onRefresh() {
      this.page = 1;
      this.finished = false;
      this.orders = [];
      await this.loadOrders();
      uni.stopPullDownRefresh();
    },
    
    async onLoadMore() {
      if (this.loadingMore || this.finished) return;
      this.page++;
      await this.loadOrders();
    },
    
    async loadOrders() {
      if (this.page === 1) {
        this.loading = true;
      } else {
        this.loadingMore = true;
      }
      
      try {
        const statusMap = ['', 'PAID', 'COMPLETED', 'CANCELLED'];
        const status = statusMap[this.activeTab] || '';
        
        const res = await getPointsOrderList({
          status,
          page: this.page,
          pageSize: this.pageSize
        });
        
        if (res && res.list) {
          if (this.page === 1) {
            this.orders = res.list;
          } else {
            this.orders = [...this.orders, ...res.list];
          }
          
          if (res.list.length < this.pageSize) {
            this.finished = true;
          }
        } else {
          this.finished = true;
        }
      } catch (error) {
        console.error('加载订单列表失败:', error);
        uni.showToast({
          title: error.message || '加载失败',
          icon: 'none'
        });
      } finally {
        this.loading = false;
        this.loadingMore = false;
      }
    },
    
    async cancelOrder(orderId) {
      const res = await uni.showModal({
        title: '提示',
        content: '确定要取消该订单吗?',
        confirmText: '确定',
        cancelText: '取消'
      });
      
      if (!res.confirm) return;
      
      uni.showLoading({ title: '取消中...' });
      
      try {
        await cancelPointsOrder(orderId);
        uni.showToast({
          title: '订单已取消',
          icon: 'success'
        });
        this.onRefresh();
      } catch (error) {
        console.error('取消订单失败:', error);
        uni.showToast({
          title: error.message || '取消失败',
          icon: 'none'
        });
      } finally {
        uni.hideLoading();
      }
    },
    
    goToDetail(orderId) {
      uni.navigateTo({
        url: `/pages/subPackages/points/order-detail/order-detail?id=${orderId}`
      });
    },
    
    getStatusText(status) {
      const statusMap = {
        'PENDING': '待支付',
        'PAID': '待核销',
        'COMPLETED': '已完成',
        'CANCELLED': '已取消'
      };
      return statusMap[status] || '未知';
    },
    
    formatTime(time) {
      if (!time) return '';
      const date = new Date(time);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hour = String(date.getHours()).padStart(2, '0');
      const minute = String(date.getMinutes()).padStart(2, '0');
      return `${year}-${month}-${day} ${hour}:${minute}`;
    }
  }
};
</script>

<style lang="scss" scoped>
.order-list-page {
  min-height: 100vh;
  background-color: #F3F4F6;
}

.tabs-container {
  background: #FFFFFF;
  padding: 0 20rpx;
}

.order-list-container {
  padding: 20rpx;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-top: 200rpx;
}

.loading-spinner {
  width: 60rpx;
  height: 60rpx;
  border: 4rpx solid #f3f3f3;
  border-top: 4rpx solid #EE781F;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-text {
  margin-top: 20rpx;
  font-size: 28rpx;
  color: #999;
}

.order-list {
  padding-bottom: 20rpx;
}

.order-item {
  background: #FFFFFF;
  border-radius: 16rpx;
  padding: 24rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 20rpx;
  border-bottom: 1rpx solid #F0F0F0;
}

.order-no {
  font-size: 26rpx;
  color: #999;
}

.order-status {
  font-size: 28rpx;
  font-weight: 600;
  
  &.status-pending {
    color: #FF9800;
  }
  
  &.status-paid {
    color: #EE781F;
  }
  
  &.status-completed {
    color: #4CAF50;
  }
  
  &.status-cancelled {
    color: #999;
  }
}

.order-content {
  display: flex;
  padding: 20rpx 0;
}

.product-image {
  width: 160rpx;
  height: 160rpx;
  border-radius: 12rpx;
  margin-right: 20rpx;
}

.product-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.product-name {
  font-size: 30rpx;
  font-weight: 600;
  color: #19191A;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
}

.product-spec {
  font-size: 26rpx;
  color: #999;
  margin-top: 8rpx;
}

.product-quantity {
  font-size: 26rpx;
  color: #666;
  margin-top: 8rpx;
}

.store-info {
  display: flex;
  align-items: center;
  padding: 16rpx 0;
  border-top: 1rpx solid #F0F0F0;
}

.store-icon {
  font-size: 28rpx;
  margin-right: 8rpx;
}

.store-name {
  margin-left: 8rpx;
  font-size: 28rpx;
  color: #666;
}

.order-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 16rpx;
  border-top: 1rpx solid #F0F0F0;
}

.order-amount {
  display: flex;
  align-items: baseline;
}

.points-label {
  font-size: 32rpx;
  font-weight: 600;
  color: #EE781F;
}

.cash-label {
  font-size: 28rpx;
  color: #EE781F;
  margin-left: 8rpx;
}

.order-actions {
  display: flex;
  gap: 16rpx;
}

.action-btn {
  padding: 12rpx 32rpx;
  border-radius: 40rpx;
  font-size: 26rpx;
  border: 1rpx solid #E0E0E0;
  color: #666;
}

.cancel-btn {
  border-color: #EE781F;
  color: #EE781F;
}

.order-time {
  font-size: 24rpx;
  color: #999;
  margin-top: 16rpx;
  text-align: right;
}

.load-more,
.no-more {
  text-align: center;
  padding: 40rpx 0;
  font-size: 28rpx;
  color: #999;
}

.loading-spinner-small {
  width: 40rpx;
  height: 40rpx;
  border: 3rpx solid #f3f3f3;
  border-top: 3rpx solid #EE781F;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto;
}

.empty-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-top: 200rpx;
}

.empty-image {
  width: 300rpx;
  height: 300rpx;
  margin-bottom: 40rpx;
}

.empty-text {
  font-size: 32rpx;
  color: #666;
}
</style>
