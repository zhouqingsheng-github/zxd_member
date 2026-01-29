<template>
  <view class="order-card" @click="handleClick">
    <!-- 订单头部 -->
    <view class="order-header">
      <view class="order-no">订单号：{{ order.orderNo }}</view>
      <view class="order-status" :class="`status-${order.status.toLowerCase()}`">
        {{ getStatusText(order.status) }}
      </view>
    </view>

    <!-- 商品信息 -->
    <view class="order-content">
      <image :src="order.productImage" class="product-image" mode="aspectFill" />
      <view class="product-info">
        <view class="product-name">{{ order.productName }}</view>
        <view class="product-spec">{{ order.specName }}</view>
        <view class="product-quantity">x{{ order.quantity }}</view>
      </view>
    </view>

    <!-- 门店信息 -->
    <view class="store-info">
      <u-icon name="map-pin-fill" color="#FF6B35" size="28" />
      <text class="store-name">{{ order.storeName }}</text>
    </view>

    <!-- 订单底部 -->
    <view class="order-footer">
      <view class="order-amount">
        <text class="points-label">{{ order.pointsAmount }}积分</text>
        <text v-if="order.cashAmount > 0" class="cash-label">+¥{{ order.cashAmount }}</text>
      </view>
      <view class="order-actions">
        <button 
          v-if="order.status === 'PENDING'" 
          class="action-btn cancel-btn"
          @click.stop="handleCancel"
        >
          取消订单
        </button>
        <button 
          v-if="order.status === 'PENDING'" 
          class="action-btn pay-btn"
          @click.stop="handlePay"
        >
          立即支付
        </button>
      </view>
    </view>

    <!-- 创建时间 -->
    <view class="order-time">{{ formatTime(order.createTime) }}</view>
  </view>
</template>

<script>
export default {
  name: 'OrderCard',
  props: {
    order: {
      type: Object,
      required: true,
      default: () => ({})
    }
  },
  methods: {
    handleClick() {
      this.$emit('click', this.order);
    },
    handleCancel() {
      this.$emit('cancel', this.order);
    },
    handlePay() {
      this.$emit('pay', this.order);
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

<style scoped>
.order-card {
  background: #FFFFFF;
  border-radius: 20rpx;
  padding: 32rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.06);
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 24rpx;
  border-bottom: 1rpx solid #F0F0F0;
}

.order-no {
  font-size: 24rpx;
  color: #999999;
}

.order-status {
  font-size: 26rpx;
  font-weight: 600;
  padding: 6rpx 20rpx;
  border-radius: 20rpx;
}

.status-pending {
  color: #FF9800;
  background: #FFF4E6;
}

.status-paid {
  color: #FF6B35;
  background: #FFF4F0;
}

.status-completed {
  color: #4CAF50;
  background: #E8F5E9;
}

.status-cancelled {
  color: #999999;
  background: #F5F5F5;
}

.order-content {
  display: flex;
  padding: 24rpx 0;
}

.product-image {
  width: 160rpx;
  height: 160rpx;
  border-radius: 16rpx;
  background: #F5F5F5;
  flex-shrink: 0;
}

.product-info {
  flex: 1;
  margin-left: 24rpx;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.product-name {
  font-size: 28rpx;
  font-weight: 500;
  color: #1A1A1A;
  line-height: 40rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.product-spec {
  font-size: 24rpx;
  color: #999999;
  margin-top: 8rpx;
}

.product-quantity {
  font-size: 24rpx;
  color: #666666;
  margin-top: 8rpx;
}

.store-info {
  display: flex;
  align-items: center;
  padding: 20rpx 0;
  border-top: 1rpx solid #F0F0F0;
}

.store-name {
  font-size: 26rpx;
  color: #666666;
  margin-left: 8rpx;
}

.order-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 20rpx;
  border-top: 1rpx solid #F0F0F0;
}

.order-amount {
  display: flex;
  align-items: baseline;
}

.points-label {
  font-size: 32rpx;
  font-weight: 600;
  color: #FF6B35;
}

.cash-label {
  font-size: 26rpx;
  color: #FF6B35;
  margin-left: 8rpx;
}

.order-actions {
  display: flex;
  gap: 16rpx;
}

.action-btn {
  padding: 12rpx 32rpx;
  border-radius: 40rpx;
  font-size: 24rpx;
  border: none;
}

.cancel-btn {
  background: #F7F8FA;
  color: #666666;
}

.pay-btn {
  background: linear-gradient(135deg, #FF6B35 0%, #FF8E53 100%);
  color: #FFFFFF;
  box-shadow: 0 4rpx 12rpx rgba(255, 107, 53, 0.3);
}

.order-time {
  font-size: 22rpx;
  color: #999999;
  margin-top: 16rpx;
  text-align: right;
}
</style>
