<template>
  <view class="confirm-page">
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
        <text class="nav-title">确认订单</text>
      </template>
    </uni-nav-bar>
    
    <scroll-view v-if="!loading" class="scroll-container" scroll-y>
      <!-- 门店选择 -->
      <view class="section-card" @click="selectStore">
        <view class="section-header">
          <view class="header-left">
            <text class="section-title">自提门店</text>
            <text class="required-mark">*</text>
          </view>
          <u-icon name="arrow-right" color="#999999" size="32" />
        </view>
        <view v-if="selectedStore.storeId" class="store-content">
          <view class="store-name">{{ selectedStore.storeName }}</view>
          <view class="store-address">{{ selectedStore.storeAddress }}</view>
          <view class="store-phone">📞 {{ selectedStore.storePhone }}</view>
        </view>
        <view v-else class="placeholder-text">
          请选择自提门店
        </view>
      </view>
      
      <!-- 商品信息 -->
      <view class="section-card">
        <view class="section-header">
          <view class="header-left">
            <text class="section-title">商品信息</text>
          </view>
        </view>
        <view class="product-item">
          <image 
            :src="skuInfo.imageUrl || skuInfo.mainImage" 
            class="product-image"
            mode="aspectFill"
          />
          <view class="product-info">
            <view class="product-name">{{ skuInfo.spuName }}</view>
            <view class="product-spec">{{ skuInfo.specValue }}</view>
            <view class="product-quantity">x{{ quantity }}</view>
          </view>
        </view>
      </view>
      
      <!-- 用户信息 -->
      <view class="section-card">
        <view class="section-header">
          <view class="header-left">
            <text class="section-title">联系信息</text>
          </view>
        </view>
        <view class="form-list">
          <view class="form-item">
            <view class="form-label">
              <text>姓名</text>
              <text class="required-mark">*</text>
            </view>
            <input 
              v-model="form.userName" 
              class="form-input"
              placeholder="请输入姓名"
              placeholder-class="input-placeholder"
            />
          </view>
          <view class="form-item">
            <view class="form-label">
              <text>手机号</text>
              <text class="required-mark">*</text>
            </view>
            <input 
              v-model="form.userPhone" 
              class="form-input"
              type="number"
              maxlength="11"
              placeholder="请输入手机号"
              placeholder-class="input-placeholder"
            />
          </view>
        </view>
      </view>
      
      <!-- 费用明细 -->
      <view class="section-card">
        <view class="section-header">
          <view class="header-left">
            <text class="section-title">费用明细</text>
          </view>
        </view>
        <view class="cost-list">
          <view class="cost-item">
            <text class="cost-label">所需积分</text>
            <text class="cost-value points-value">{{ totalPoints }}</text>
          </view>
          <view v-if="totalCash > 0" class="cost-item">
            <text class="cost-label">所需现金</text>
            <text class="cost-value cash-value">¥{{ totalCash }}</text>
          </view>
          <view class="cost-item">
            <text class="cost-label">当前积分</text>
            <text class="cost-value">{{ userPoints }}</text>
          </view>
        </view>
        <view v-if="userPoints < totalPoints" class="insufficient-tip">
          <u-icon name="info-circle-fill" color="#FF6B6B" size="32" />
          <text class="tip-text">积分不足，无法兑换</text>
        </view>
      </view>
    </scroll-view>

    <!-- 加载状态 -->
    <view v-if="loading" class="loading-state">
      <u-loading-icon mode="circle" color="#FF6B35" size="60" />
      <text class="loading-text">加载中...</text>
    </view>
    
    <!-- 底部操作栏 -->
    <view v-if="!loading" class="footer-bar">
      <view class="total-section">
        <text class="total-label">合计：</text>
        <text class="total-points">{{ totalPoints }}</text>
        <text class="total-unit">积分</text>
        <text v-if="totalCash > 0" class="total-cash">+¥{{ totalCash }}</text>
      </view>
      <button 
        class="submit-btn"
        :class="{ 'btn-disabled': !canSubmit || submitting }"
        :disabled="!canSubmit || submitting"
        @click="handleSubmit"
      >
        <text class="btn-text">{{ submitting ? '提交中...' : '提交订单' }}</text>
      </button>
    </view>
  </view>
</template>

<script>
import { getProductDetail, createPointsOrder } from '../api/index.js';
import { getUserInfo } from '@/store/index';

export default {
  data() {
    return {
      skuId: 0,
      quantity: 1,
      skuInfo: {},
      userPoints: 0,
      form: {
        userName: '',
        userPhone: ''
      },
      selectedStore: {},
      loading: false,
      submitting: false
    }
  },
  
  computed: {
    totalPoints() {
      return (this.skuInfo.pointsRequired || 0) * this.quantity;
    },
    
    totalCash() {
      return ((this.skuInfo.cashRequired || 0) * this.quantity).toFixed(2);
    },
    
    canSubmit() {
      return this.selectedStore.storeId &&
             this.form.userName &&
             this.form.userPhone &&
             this.form.userPhone.length === 11 &&
             this.userPoints >= this.totalPoints;
    }
  },
  
  onLoad(options) {
    if (options.skuId) {
      this.skuId = options.skuId;
    }
    if (options.quantity) {
      this.quantity = parseInt(options.quantity);
    }
    
    this.init();
  },

  onShow() {
    const pages = getCurrentPages();
    const currentPage = pages[pages.length - 1];
    if (currentPage.$vm && currentPage.$vm.selectedStoreData) {
      this.selectedStore = currentPage.$vm.selectedStoreData;
      delete currentPage.$vm.selectedStoreData;
    }
  },
  
  methods: {
    async init() {
      await this.loadUserInfo();
      await this.loadSkuInfo();
    },

    async loadUserInfo() {
      try {
        const userInfo = getUserInfo();
        if (userInfo) {
          this.userPoints = userInfo.points || 0;
          this.form.userName = userInfo.name || '';
          this.form.userPhone = userInfo.phone || '';
        }
      } catch (error) {
        console.error('加载用户信息失败:', error);
      }
    },

    async loadSkuInfo() {
      if (!this.skuId) return;
      
      try {
        this.loading = true;
        const result = await getProductDetail(this.skuId);
        
        if (result && result.skuList) {
          this.skuInfo = result.skuList.find(sku => sku.id == this.skuId) || {};
          this.skuInfo.spuName = result.spuName;
        }
      } catch (error) {
        console.error('加载SKU信息失败:', error);
        uni.showToast({
          title: '加载失败',
          icon: 'none'
        });
      } finally {
        this.loading = false;
      }
    },
    
    selectStore() {
      if (!this.skuId) {
        uni.showToast({
          title: 'SKU信息异常',
          icon: 'none'
        });
        return;
      }
      uni.navigateTo({
        url: `/pages/subPackages/points/store-select/store-select?skuId=${this.skuId}`
      });
    },
    
    async handleSubmit() {
      if (!this.selectedStore.storeId) {
        uni.showToast({
          title: '请选择自提门店',
          icon: 'none'
        });
        return;
      }
      
      if (!this.form.userName) {
        uni.showToast({
          title: '请输入姓名',
          icon: 'none'
        });
        return;
      }
      
      if (!this.form.userPhone || this.form.userPhone.length !== 11) {
        uni.showToast({
          title: '请输入正确的手机号',
          icon: 'none'
        });
        return;
      }
      
      if (this.userPoints < this.totalPoints) {
        uni.showToast({
          title: '积分不足',
          icon: 'none'
        });
        return;
      }
      
      try {
        this.submitting = true;
        
        const params = {
          skuId: this.skuId,
          quantity: this.quantity,
          storeId: this.selectedStore.storeId,
          userName: this.form.userName,
          userPhone: this.form.userPhone
        };
        
        const result = await createPointsOrder(params);
        
        uni.showToast({
          title: '订单创建成功',
          icon: 'success'
        });
        
        setTimeout(() => {
          uni.redirectTo({
            url: `/pages/subPackages/points/order-detail/order-detail?id=${result.id}`
          });
        }, 1500);
        
      } catch (error) {
        console.error('提交订单失败:', error);
        uni.showToast({
          title: error.message || '提交失败',
          icon: 'none'
        });
      } finally {
        this.submitting = false;
      }
    },
    
    goBack() {
      uni.navigateBack();
    }
  }
}
</script>

<style scoped>
.confirm-page {
  width: 100%;
  min-height: 100vh;
  background: #F7F8FA;
}

.nav-title {
  font-size: 32rpx;
  color: #1A1A1A;
  font-weight: 500;
}

.scroll-container {
  width: 100%;
  height: 100vh;
  box-sizing: border-box;
  padding: 20rpx 32rpx 160rpx;
}

.section-card {
  background: #FFFFFF;
  border-radius: 24rpx;
  padding: 32rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.04);
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24rpx;
}

.header-left {
  display: flex;
  align-items: center;
}



.section-title {
  font-size: 30rpx;
  color: #1A1A1A;
  font-weight: 600;
}

.required-mark {
  color: #FF6B6B;
  font-size: 28rpx;
  margin-left: 4rpx;
}

.store-content {
  padding: 20rpx;
  background: #F7F8FA;
  border-radius: 16rpx;
}

.store-name {
  font-size: 30rpx;
  color: #1A1A1A;
  font-weight: 500;
  margin-bottom: 12rpx;
}

.store-address {
  font-size: 26rpx;
  color: #666666;
  line-height: 40rpx;
  margin-bottom: 8rpx;
}

.store-phone {
  font-size: 26rpx;
  color: #666666;
}

.placeholder-text {
  font-size: 28rpx;
  color: #999999;
  padding: 20rpx 0;
}

.product-item {
  display: flex;
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
  color: #1A1A1A;
  font-weight: 500;
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

.form-list {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.form-item {
  display: flex;
  align-items: center;
  padding: 24rpx;
  background: #F7F8FA;
  border-radius: 16rpx;
}

.form-label {
  width: 140rpx;
  font-size: 28rpx;
  color: #1A1A1A;
  flex-shrink: 0;
}

.form-input {
  flex: 1;
  font-size: 28rpx;
  color: #1A1A1A;
  text-align: right;
}

.input-placeholder {
  color: #CCCCCC;
}

.cost-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.cost-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16rpx 0;
}

.cost-label {
  font-size: 28rpx;
  color: #666666;
}

.cost-value {
  font-size: 30rpx;
  color: #1A1A1A;
  font-weight: 600;
}

.points-value {
  color: #FF6B35;
}

.cash-value {
  color: #FF6B35;
}

.insufficient-tip {
  display: flex;
  align-items: center;
  margin-top: 20rpx;
  padding: 16rpx 20rpx;
  background: #FFF4F0;
  border-radius: 12rpx;
}

.tip-text {
  font-size: 26rpx;
  color: #FF6B6B;
  margin-left: 12rpx;
}

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

.footer-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #FFFFFF;
  padding: 20rpx 32rpx;
  padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
  box-shadow: 0 -4rpx 20rpx rgba(0, 0, 0, 0.06);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.total-section {
  display: flex;
  align-items: baseline;
}

.total-label {
  font-size: 26rpx;
  color: #666666;
}

.total-points {
  font-size: 40rpx;
  color: #FF6B35;
  font-weight: bold;
  margin-left: 8rpx;
}

.total-unit {
  font-size: 22rpx;
  color: #FF6B35;
  margin-left: 4rpx;
}

.total-cash {
  font-size: 28rpx;
  color: #FF6B35;
  margin-left: 8rpx;
}

.submit-btn {
  width: 280rpx;
  height: 80rpx;
  background: linear-gradient(135deg, #FF6B35 0%, #FF8E53 100%);
  border-radius: 40rpx;
  border: none;
  box-shadow: 0 8rpx 24rpx rgba(255, 107, 53, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-disabled {
  background: #D1D1D6;
  box-shadow: none;
}

.btn-text {
  color: #FFFFFF;
  font-size: 28rpx;
  font-weight: 600;
}
</style>
