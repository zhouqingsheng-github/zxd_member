<template>
  <view class="order-detail-container">
    <!-- 自定义导航栏 -->
    <uni-nav-bar 
      :fixed="true" 
      :shadow="false" 
      :border="false" 
      status-bar
      background-color="#FFFFFF"
      title="订单详情"
      left-icon="left"
      @clickLeft="goBack"
    />
    
    <!-- 订单状态 -->
    <view class="status-section" :class="[
      orderDetail.status === 'PENDING' ? 'pending' : '',
      orderDetail.status === 'PAID' ? 'paid' : '',
      orderDetail.status === 'COMPLETED' ? 'completed' : '',
      orderDetail.status === 'CANCELLED' ? 'cancelled' : ''
    ]">
      <view class="status-icon">{{ getStatusIcon(orderDetail.status) }}</view>
      <view class="status-text">{{ orderDetail.statusDesc }}</view>
    </view>
    
    <!-- 核销码(待核销状态显示) -->
    <view v-if="orderDetail.status === 'PAID'" class="verification-section">
      <view class="verification-title">核销码</view>
      <view class="verification-code">{{ orderDetail.verificationCode }}</view>
      <view class="verification-tip">请向门店工作人员出示此核销码</view>
    </view>
    
    <!-- 商品信息 -->
    <view class="section-card">
      <view class="section-title">商品信息</view>
      <view class="product-item">
        <image 
          :src="orderDetail.mainImage" 
          class="product-image"
          mode="aspectFill"
        />
        <view class="product-info">
          <view class="product-name">{{ orderDetail.spuName }}</view>
          <view class="product-spec">{{ orderDetail.skuName }}</view>
          <view class="product-quantity">x{{ orderDetail.quantity }}</view>
        </view>
      </view>
    </view>
    
    <!-- 门店信息 -->
    <view class="section-card">
      <view class="section-title">自提门店</view>
      <view class="store-info">
        <view class="info-row">
          <view class="info-label">门店名称</view>
          <view class="info-value">{{ orderDetail.storeName }}</view>
        </view>
        <view class="info-row">
          <view class="info-label">门店地址</view>
          <view class="info-value">{{ orderDetail.storeAddress }}</view>
        </view>
        <view v-if="orderDetail.storePhone" class="info-row">
          <view class="info-label">联系电话</view>
          <view class="info-value phone" @click="callPhone">
            {{ orderDetail.storePhone }}
            <text class="phone-icon">📞</text>
          </view>
        </view>
      </view>
    </view>
    
    <!-- 用户信息 -->
    <view class="section-card">
      <view class="section-title">联系信息</view>
      <view class="user-info">
        <view class="info-row">
          <view class="info-label">姓名</view>
          <view class="info-value">{{ orderDetail.contactName }}</view>
        </view>
        <view class="info-row">
          <view class="info-label">手机号</view>
          <view class="info-value">{{ orderDetail.contactPhone }}</view>
        </view>
      </view>
    </view>
    
    <!-- 订单信息 -->
    <view class="section-card">
      <view class="section-title">订单信息</view>
      <view class="order-info">
        <view class="info-row">
          <view class="info-label">订单编号</view>
          <view class="info-value">{{ orderDetail.orderNo }}</view>
        </view>
        <view class="info-row">
          <view class="info-label">创建时间</view>
          <view class="info-value">{{ formatTime(orderDetail.createTime) }}</view>
        </view>
        <view v-if="orderDetail.payTime" class="info-row">
          <view class="info-label">支付时间</view>
          <view class="info-value">{{ formatTime(orderDetail.payTime) }}</view>
        </view>
        <view v-if="orderDetail.verificationTime" class="info-row">
          <view class="info-label">核销时间</view>
          <view class="info-value">{{ formatTime(orderDetail.verificationTime) }}</view>
        </view>
      </view>
    </view>
    
    <!-- 费用明细 -->
    <view class="section-card">
      <view class="section-title">费用明细</view>
      <view class="cost-info">
        <view class="cost-row">
          <view class="cost-label">所需积分</view>
          <view class="cost-value points">{{ orderDetail.pointsAmount }}</view>
        </view>
        <view v-if="orderDetail.cashAmount > 0" class="cost-row">
          <view class="cost-label">所需现金</view>
          <view class="cost-value cash">¥{{ orderDetail.cashAmount }}</view>
        </view>
      </view>
    </view>
    
    <!-- 底部操作栏 -->
    <view v-if="orderDetail.status === 'PENDING'" class="bottom-bar">
      <view class="cancel-btn" @click="handleCancel">
        取消订单
      </view>
    </view>
    
    <!-- 加载状态 -->
    <view v-if="loading" class="loading-overlay">
      <view class="loading-spinner"></view>
    </view>
  </view>
</template>

<script>
import { getExchangeOrderDetail, cancelExchangeOrder } from '@/common/api/points';

export default {
  data() {
    return {
      orderId: 0,
      orderDetail: {},
      loading: false
    };
  },
  
  onLoad(options) {
    if (options.id) {
      this.orderId = parseInt(options.id);
      this.loadOrderDetail();
    }
  },
  
  methods: {
    async loadOrderDetail() {
      this.loading = true;
      
      try {
        const res = await getExchangeOrderDetail(this.orderId);
        
        if (res && res.code === '200' && res.data) {
          this.orderDetail = res.data;
        }
      } catch (error) {
        console.error('加载订单详情失败:', error);
        uni.showToast({
          title: '加载失败',
          icon: 'none'
        });
      } finally {
        this.loading = false;
      }
    },
    
    handleCancel() {
      uni.showModal({
        title: '提示',
        content: '确定要取消该订单吗?',
        success: async (res) => {
          if (res.confirm) {
            try {
              const result = await cancelExchangeOrder(this.orderId);
              
              if (result && result.code === '200') {
                uni.showToast({
                  title: '取消成功',
                  icon: 'success'
                });
                // 重新加载订单详情
                setTimeout(() => {
                  this.loadOrderDetail();
                }, 1500);
              } else {
                uni.showToast({
                  title: result.msg || '取消失败',
                  icon: 'none'
                });
              }
            } catch (error) {
              console.error('取消订单失败:', error);
              uni.showToast({
                title: '取消失败',
                icon: 'none'
              });
            }
          }
        }
      });
    },
    
    callPhone() {
      if (this.orderDetail.storePhone) {
        uni.makePhoneCall({
          phoneNumber: this.orderDetail.storePhone
        });
      }
    },
    
    getStatusIcon(status) {
      const iconMap = {
        'PENDING': '⏰',
        'PAID': '✓',
        'COMPLETED': '✓',
        'CANCELLED': '✕'
      };
      return iconMap[status] || 'ℹ';
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
    },
    
    goBack() {
      uni.navigateBack();
    }
  }
};
</script>

<style scoped lang="scss">
.order-detail-container {
  min-height: 100vh;
  background-color: #F3F4F6;
  padding-bottom: 120rpx;
}

.status-section {
  margin: 20rpx 24rpx;
  padding: 48rpx 32rpx;
  background: linear-gradient(135deg, #FF9A56 0%, #EE781F 100%);
  border-radius: 16rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  
  &.pending {
    background: linear-gradient(135deg, #FFB74D 0%, #FF9800 100%);
  }
  
  &.paid {
    background: linear-gradient(135deg, #FF9A56 0%, #EE781F 100%);
  }
  
  &.completed {
    background: linear-gradient(135deg, #66BB6A 0%, #4CAF50 100%);
  }
  
  &.cancelled {
    background: linear-gradient(135deg, #BDBDBD 0%, #9E9E9E 100%);
  }
  
  .status-icon {
    font-size: 80rpx;
    color: #FFFFFF;
  }
  
  .status-text {
    margin-top: 16rpx;
    font-size: 32rpx;
    font-weight: bold;
    color: #FFFFFF;
  }
}

.verification-section {
  margin: 20rpx 24rpx;
  padding: 40rpx 32rpx;
  background-color: #FFFFFF;
  border-radius: 16rpx;
  text-align: center;
  
  .verification-title {
    font-size: 28rpx;
    color: #666666;
    margin-bottom: 20rpx;
  }
  
  .verification-code {
    font-size: 72rpx;
    font-weight: bold;
    color: #EE781F;
    letter-spacing: 8rpx;
    margin-bottom: 20rpx;
  }
  
  .verification-tip {
    font-size: 24rpx;
    color: #999999;
  }
}

.section-card {
  margin: 20rpx 24rpx;
  padding: 32rpx;
  background-color: #FFFFFF;
  border-radius: 16rpx;
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #19191A;
  margin-bottom: 24rpx;
}

.product-item {
  display: flex;
  
  .product-image {
    width: 160rpx;
    height: 160rpx;
    border-radius: 12rpx;
    margin-right: 24rpx;
  }
  
  .product-info {
    flex: 1;
    
    .product-name {
      font-size: 28rpx;
      color: #19191A;
      margin-bottom: 12rpx;
    }
    
    .product-spec {
      font-size: 24rpx;
      color: #666666;
      margin-bottom: 12rpx;
    }
    
    .product-quantity {
      font-size: 24rpx;
      color: #999999;
    }
  }
}

.store-info,
.user-info,
.order-info {
  .info-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20rpx 0;
    border-bottom: 1rpx solid #F3F4F6;
    
    &:last-child {
      border-bottom: none;
    }
    
    .info-label {
      font-size: 28rpx;
      color: #666666;
    }
    
    .info-value {
      font-size: 28rpx;
      color: #19191A;
      text-align: right;
      flex: 1;
      margin-left: 32rpx;
      
      &.phone {
        color: #EE781F;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        gap: 8rpx;
      }
    }
  }
}

.phone-icon {
  font-size: 28rpx;
  margin-left: 8rpx;
}

.cost-info {
  .cost-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20rpx 0;
    
    .cost-label {
      font-size: 28rpx;
      color: #666666;
    }
    
    .cost-value {
      font-size: 32rpx;
      font-weight: bold;
      
      &.points {
        color: #EE781F;
      }
      
      &.cash {
        color: #EE781F;
      }
    }
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
  
  .cancel-btn {
    height: 88rpx;
    background-color: #F3F4F6;
    border-radius: 44rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 32rpx;
    font-weight: bold;
    color: #666666;
  }
}

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
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
</style>
