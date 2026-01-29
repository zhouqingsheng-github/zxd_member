<template>
  <view class="order-card" @click="handleClick">
    <!-- 订单头部 -->
    <view class="order-header">
      <text class="order-no">订单号: {{ order.orderNo }}</text>
      <text :class="['order-status', 'status-' + order.status]">{{ statusText }}</text>
    </view>

    <!-- 商品信息 -->
    <view class="order-content">
      <image 
        class="product-image" 
        :src="order.productImage" 
        mode="aspectFill"
      />
      <view class="product-info">
        <view class="product-name">{{ order.productName }}</view>
        <view class="product-spec">{{ order.skuSpecValue }}</view>
        <view class="product-quantity">x{{ order.quantity }}</view>
      </view>
    </view>

    <!-- 门店信息 -->
    <view class="order-store">
      <text class="store-label">兑换门店:</text>
      <text class="store-name">{{ order.storeName }}</text>
    </view>

    <!-- 订单金额 -->
    <view class="order-amount">
      <view class="amount-item">
        <text class="amount-label">积分:</text>
        <text class="amount-value points">{{ order.totalPoints }}</text>
      </view>
      <view v-if="order.totalCash > 0" class="amount-item">
        <text class="amount-label">现金:</text>
        <text class="amount-value cash">¥{{ order.totalCash }}</text>
      </view>
    </view>

    <!-- 订单时间 -->
    <view class="order-time">{{ formatTime(order.createTime) }}</view>

    <!-- 操作按钮 -->
    <view v-if="showActions" class="order-actions">
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
</template>

<script>
export default {
  name: 'OrderCard',
  props: {
    order: {
      type: Object,
      required: true,
      default: () => ({})
    },
    showActions: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    statusText() {
      const statusMap = {
        'PENDING': '待支付',
        'PAID': '已支付',
        'COMPLETED': '已完成',
        'CANCELLED': '已取消'
      };
      return statusMap[this.order.status] || this.order.status;
    }
  },
  methods: {
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
    handleClick() {
      this.$emit('click', this.order);
    },
    handleCancel() {
      this.$emit('cancel', this.order);
    },
    handlePay() {
      this.$emit('pay', this.order);
    }
  }
}
</script>

<style scoped>
.order-card {
  background: #FFFFFF;
  border-radius: 16rpx;
  padding: 32rpx;
  margin-bottom: 20rpx;
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24rpx;
  padding-bottom: 24rpx;
  border-bottom: 1rpx solid #F3F4F6;
}

.order-no {
  font-size: 26rpx;
  color: #666666;
}

.order-status {
  font-size: 28rpx;
  font-weight: 500;
}

.status-PENDING {
  color: #EE781F;
}

.status-PAID {
  color: #07C160;
}

.status-COMPLETED {
  color: #A2A2A8;
}

.status-CANCELLED {
  color: #D1D1D6;
}

.order-content {
  display: flex;
  margin-bottom: 24rpx;
}

.product-image {
  width: 160rpx;
  height: 160rpx;
  border-radius: 12rpx;
  flex-shrink: 0;
}

.product-info {
  flex: 1;
  margin-left: 20rpx;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.product-name {
  font-size: 28rpx;
  color: #19191A;
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.product-spec {
  font-size: 24rpx;
  color: #A2A2A8;
  margin-top: 8rpx;
}

.product-quantity {
  font-size: 24rpx;
  color: #A2A2A8;
  margin-top: 8rpx;
}

.order-store {
  display: flex;
  align-items: center;
  margin-bottom: 16rpx;
  font-size: 26rpx;
}

.store-label {
  color: #666666;
}

.store-name {
  color: #19191A;
  margin-left: 8rpx;
}

.order-amount {
  display: flex;
  align-items: center;
  margin-bottom: 16rpx;
}

.amount-item {
  display: flex;
  align-items: center;
  margin-right: 32rpx;
  font-size: 26rpx;
}

.amount-label {
  color: #666666;
}

.amount-value {
  margin-left: 8rpx;
  font-weight: 500;
}

.amount-value.points {
  color: #EE781F;
}

.amount-value.cash {
  color: #19191A;
}

.order-time {
  font-size: 24rpx;
  color: #A2A2A8;
  margin-bottom: 24rpx;
}

.order-actions {
  display: flex;
  justify-content: flex-end;
  gap: 20rpx;
  padding-top: 24rpx;
  border-top: 1rpx solid #F3F4F6;
}

.action-btn {
  padding: 12rpx 32rpx;
  border-radius: 44rpx;
  font-size: 28rpx;
  border: none;
  line-height: 1.5;
}

.cancel-btn {
  background: #F3F4F6;
  color: #666666;
}

.pay-btn {
  background: #EE781F;
  color: #FFFFFF;
}
</style>
