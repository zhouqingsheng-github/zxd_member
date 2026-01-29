<template>
  <view class="order-list-page">
    <!-- 自定义导航栏 -->
    <uni-nav-bar 
      :fixed="true" 
      :shadow="false" 
      :border="false" 
      status-bar
      background-color="#FFFFFF"
      left-icon="left"
      @clickLeft="goBack"
    >
      <template #default>
        <text class="nav-title">我的订单</text>
      </template>
    </uni-nav-bar>

    <!-- 分类Tab -->
    <view class="tabs-section">
      <scroll-view class="tabs-scroll" scroll-x :show-scrollbar="false">
        <view class="tabs-list">
          <view 
            v-for="(tab, index) in tabList" 
            :key="index"
            class="tab-item"
            :class="{ 'tab-item-active': currentTab === index }"
            @click="handleTabChange(index)"
          >
            <text class="tab-text">{{ tab.name }}</text>
          </view>
        </view>
      </scroll-view>
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
      <view class="order-list">
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
        <u-loading-icon mode="circle" color="#FF6B35" size="60" />
        <text class="loading-text">加载中...</text>
      </view>

      <!-- 空状态 -->
      <view v-if="!loading && orderList.length === 0" class="empty-state">
        <text class="empty-icon">📦</text>
        <text class="empty-text">暂无订单</text>
        <text class="empty-tip">快去兑换心仪的商品吧</text>
      </view>

      <!-- 加载更多 -->
      <view v-if="orderList.length > 0" class="loadmore-state">
        <text v-if="loadingMore" class="loadmore-text">加载中...</text>
        <text v-else-if="noMore" class="loadmore-text">— 已经到底了 —</text>
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
      tabList: [
        { name: '全部', value: '' },
        { name: '待支付', value: 'PENDING' },
        { name: '待核销', value: 'PAID' },
        { name: '已完成', value: 'COMPLETED' },
        { name: '已取消', value: 'CANCELLED' }
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
  onLoad(options) {
    if (options.tab) {
      const tabIndex = this.tabList.findIndex(t => t.value === options.tab);
      if (tabIndex >= 0) {
        this.currentTab = tabIndex;
      }
    }
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
        
        const status = this.tabList[this.currentTab].value;
        if (status) {
          params.status = status;
        }
        
        const result = await getPointsOrderList(params);
        const list = result.records || result.list || [];
        
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
      uni.showModal({
        title: '提示',
        content: '确定要取消该订单吗?',
        success: async (res) => {
          if (res.confirm) {
            try {
              uni.showLoading({
                title: '取消中...'
              });
              
              await cancelPointsOrder(order.id);
              
              uni.hideLoading();
              uni.showToast({
                title: '取消成功',
                icon: 'success'
              });
              
              this.loadOrders(true);
            } catch (error) {
              uni.hideLoading();
              console.error('取消订单失败:', error);
              uni.showToast({
                title: error.message || '取消失败',
                icon: 'none'
              });
            }
          }
        }
      });
    },
    
    async handlePayOrder(order) {
      try {
        uni.showLoading({
          title: '支付中...'
        });
        
        const result = await payPointsOrder(order.id);
        
        uni.hideLoading();
        
        if (result && result.payParams) {
          uni.showToast({
            title: '请完成支付',
            icon: 'none'
          });
        } else {
          uni.showToast({
            title: '支付成功',
            icon: 'success'
          });
          
          this.loadOrders(true);
        }
      } catch (error) {
        uni.hideLoading();
        console.error('支付订单失败:', error);
        uni.showToast({
          title: error.message || '支付失败',
          icon: 'none'
        });
      }
    },
    
    goBack() {
      uni.navigateBack();
    }
  }
};
</script>

<style scoped>
.order-list-page {
  width: 100%;
  min-height: 100vh;
  background: #F7F8FA;
}

.nav-title {
  font-size: 32rpx;
  color: #1A1A1A;
  font-weight: 500;
}

.tabs-section {
  background: #FFFFFF;
  padding: 20rpx 0;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
}

.tabs-scroll {
  white-space: nowrap;
}

.tabs-list {
  display: inline-flex;
  padding: 0 32rpx;
  gap: 32rpx;
}

.tab-item {
  display: inline-block;
  padding: 12rpx 0;
  position: relative;
  transition: all 0.3s ease;
}

.tab-item::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%) scaleX(0);
  width: 40rpx;
  height: 6rpx;
  background: linear-gradient(135deg, #FF6B35 0%, #FF8E53 100%);
  border-radius: 3rpx;
  transition: transform 0.3s ease;
}

.tab-item-active::after {
  transform: translateX(-50%) scaleX(1);
}

.tab-text {
  font-size: 28rpx;
  color: #666666;
  white-space: nowrap;
  transition: all 0.3s ease;
}

.tab-item-active .tab-text {
  color: #FF6B35;
  font-weight: 600;
  font-size: 30rpx;
}

.scroll-container {
  padding: 20rpx 32rpx;
}

.order-list {
  /* 列表样式由OrderCard组件控制 */
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
