<template>
  <view class="order-list-page">
    <!-- 自定义导航栏 -->
    <view class="nav-bar" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="nav-content">
        <view class="nav-left" @click="goBack">
          <view class="back-btn">
            <u-icon name="arrow-left" color="#1A1A1A" size="40" />
          </view>
        </view>
        <text class="nav-title">我的订单</text>
        <view class="nav-right"></view>
      </view>
    </view>

    <!-- 分类Tab -->
    <view class="tabs-section">
      <view class="tabs-list">
          <view 
            v-for="(tab, index) in tabList" 
            :key="index"
            class="tab-item"
            @click="handleTabChange(index)"
          >
            <text 
              class="tab-text" 
              :class="{ 'tab-text-active': currentTab === index }"
            >
              {{ tab.name }}
            </text>
            <view 
              class="tab-indicator" 
              :class="{ 'indicator-active': currentTab === index }"
            ></view>
          </view>
        </view>
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
      <!-- 订单列表 -->
      <view v-if="orderList.length > 0" class="order-list">
        <OrderCard
          v-for="order in orderList"
          :key="order.id"
          :order="order"
          @click="goToDetail"
          @cancel="handleCancelOrder"
          @pay="handlePayOrder"
        />
      </view>

      <!-- 加载状态 -->
      <view v-if="loading && orderList.length === 0" class="loading-state">
        <u-loading-icon mode="circle" color="#FF7043" size="60" />
        <text class="loading-text">加载中...</text>
      </view>

      <!-- 空状态 -->
      <view v-if="!loading && orderList.length === 0" class="empty-state">
        <view class="empty-content">
          <view class="empty-icon-wrapper">
            <text class="empty-icon">📦</text>
          </view>
          <text class="empty-text">暂无订单</text>
          <text class="empty-tip">快去兑换心仪的商品吧</text>
          <button class="go-shopping-btn" @click="goToMall">
            <text class="btn-text">去逛逛</text>
          </button>
        </view>
      </view>

      <!-- 加载更多 -->
      <view v-if="orderList.length > 0" class="loadmore-state">
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
import OrderCard from '../components/OrderCard.vue';
import { getPointsOrderList, cancelPointsOrder, payPointsOrder } from '@/common/api';

export default {
  components: {
    OrderCard
  },
  data() {
    return {
      statusBarHeight: 0,
      tabList: [
        { name: '全部', status: null },
        { name: '待支付', status: 'PENDING_PAYMENT' },
        { name: '待核销', status: 'PENDING_VERIFICATION' },
        { name: '已完成', status: 'COMPLETED' },
        { name: '已取消', status: 'CANCELLED' }
      ],
      currentTab: 0,
      orderList: [],
      loading: false,
      loadingMore: false,
      refreshing: false,
      noMore: false,
      page: 1,
      pageSize: 10
    };
  },
  onLoad() {
    const systemInfo = uni.getSystemInfoSync();
    this.statusBarHeight = systemInfo.statusBarHeight || 0;
    
    this.loadOrders(true);
  },
  methods: {
    async loadOrders(reset = false) {
      if (reset) {
        this.page = 1;
        this.noMore = false;
        this.orderList = [];
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
        
        const currentStatus = this.tabList[this.currentTab].status;
        if (currentStatus) {
          params.status = currentStatus;
        }
        
        const result = await getPointsOrderList(params);
        const list = result.records || [];
        
        if (reset) {
          this.orderList = list;
        } else {
          this.orderList = [...this.orderList, ...list];
        }
        
        if (list.length < this.pageSize) {
          this.noMore = true;
        } else {
          this.page++;
        }
      } catch (error) {
        console.error('加载订单列表失败:', error);
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
    
    handleTabChange(index) {
      this.currentTab = index;
      this.loadOrders(true);
    },
    
    onRefresh() {
      this.refreshing = true;
      this.loadOrders(true);
    },
    
    loadMore() {
      if (!this.noMore && !this.loadingMore) {
        this.loadOrders(false);
      }
    },
    
    goToDetail(order) {
      uni.navigateTo({
        url: `/pages/subPackages/points/order-detail/order-detail?id=${order.id}`
      });
    },
    
    async handleCancelOrder(order) {
      try {
        const res = await uni.showModal({
          title: '提示',
          content: '确定要取消该订单吗？'
        });
        
        if (res.confirm) {
          await cancelPointsOrder(order.id);
          uni.showToast({
            title: '取消成功',
            icon: 'success'
          });
          this.loadOrders(true);
        }
      } catch (error) {
        console.error('取消订单失败:', error);
        uni.showToast({
          title: '取消失败',
          icon: 'none'
        });
      }
    },
    
    async handlePayOrder(order) {
      // TODO: 实现支付逻辑
      uni.showToast({
        title: '支付功能开发中',
        icon: 'none'
      });
    },
    
    goBack() {
      uni.navigateBack();
    },
    
    goToMall() {
      uni.navigateBack();
    }
  }
};
</script>

<style scoped>
.order-list-page {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #F5F7FA;
}

/* 导航栏 */
.nav-bar {
  background: #FFFFFF;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
  flex-shrink: 0;
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
  font-weight: 600;
}

/* 分类Tab */
.tabs-section {
  background: #FFFFFF;
  padding: 24rpx 0;
  border-bottom: 1rpx solid #F0F0F0;
  flex-shrink: 0;
}

.tabs-list {
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 0 32rpx;
}

.tab-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.tab-text {
  font-size: 28rpx;
  color: #666666;
  white-space: nowrap;
  transition: all 0.3s ease;
  padding-bottom: 12rpx;
}

.tab-text-active {
  font-size: 32rpx;
  color: #FF7043;
  font-weight: 600;
}

.tab-indicator {
  width: 0;
  height: 6rpx;
  background: linear-gradient(90deg, #FF7043 0%, #FF5722 100%);
  border-radius: 3rpx;
  transition: width 0.3s ease;
}

.indicator-active {
  width: 40rpx;
}

/* 滚动容器 */
.scroll-container {
  flex: 1;
  overflow-y: scroll;
}

.order-list {
  padding: 24rpx 32rpx 32rpx;
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

/* 空状态 */
.empty-state {
  width: 100%;
  min-height: 600rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 120rpx 32rpx;
}

.empty-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.empty-icon-wrapper {
  width: 200rpx;
  height: 200rpx;
  background: linear-gradient(135deg, #FFF4F0 0%, #FFE8E0 100%);
  border-radius: 100rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 40rpx;
}

.empty-icon {
  font-size: 120rpx;
  line-height: 1;
}

.empty-text {
  font-size: 32rpx;
  color: #666666;
  margin-bottom: 16rpx;
  font-weight: 500;
}

.empty-tip {
  font-size: 26rpx;
  color: #999999;
  margin-bottom: 48rpx;
}

.go-shopping-btn {
  width: 280rpx;
  height: 88rpx;
  background: linear-gradient(135deg, #FF7043 0%, #FF5722 100%);
  border-radius: 44rpx;
  border: none;
  box-shadow: 0 8rpx 24rpx rgba(255, 112, 67, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-text {
  color: #FFFFFF;
  font-size: 30rpx;
  font-weight: 600;
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
