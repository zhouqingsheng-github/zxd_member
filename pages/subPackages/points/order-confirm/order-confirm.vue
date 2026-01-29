<template>
  <view class="confirm-container">
    <!-- 自定义导航栏 -->
    <uni-nav-bar 
      :fixed="true" 
      :shadow="false" 
      :border="false" 
      status-bar
      background-color="#FFFFFF"
      title="确认订单"
      left-icon="left"
      @clickLeft="goBack"
    />
    
    <scroll-view v-if="!loading" class="scroll-container" scroll-y>
      <!-- 门店选择 -->
      <view class="section-card store-section" @click="selectStore">
        <view class="section-title">
          <text>自提门店</text>
          <text class="required">*</text>
        </view>
        <view v-if="selectedStore.storeId" class="store-info">
          <view class="store-name">{{ selectedStore.storeName }}</view>
          <view class="store-address">{{ selectedStore.storeAddress }}</view>
          <view class="store-phone">电话: {{ selectedStore.storePhone }}</view>
        </view>
        <view v-else class="store-placeholder">
          请选择自提门店
        </view>
        <u-icon name="arrow-right" color="#999999" size="28" />
      </view>
      
      <!-- 商品信息 -->
      <view class="section-card product-section">
        <view class="section-title">商品信息</view>
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
      <view class="section-card user-section">
        <view class="section-title">联系信息</view>
        <view class="form-item">
          <view class="form-label">
            <text>姓名</text>
            <text class="required">*</text>
          </view>
          <input 
            v-model="form.userName" 
            class="form-input"
            placeholder="请输入姓名"
          />
        </view>
        <view class="form-item">
          <view class="form-label">
            <text>手机号</text>
            <text class="required">*</text>
          </view>
          <input 
            v-model="form.userPhone" 
            class="form-input"
            type="number"
            maxlength="11"
            placeholder="请输入手机号"
          />
        </view>
      </view>
      
      <!-- 费用明细 -->
      <view class="section-card cost-section">
        <view class="section-title">费用明细</view>
        <view class="cost-item">
          <view class="cost-label">所需积分</view>
          <view class="cost-value points">{{ totalPoints }}</view>
        </view>
        <view v-if="totalCash > 0" class="cost-item">
          <view class="cost-label">所需现金</view>
          <view class="cost-value cash">¥{{ totalCash }}</view>
        </view>
        <view class="cost-item">
          <view class="cost-label">当前积分</view>
          <view class="cost-value">{{ userPoints }}</view>
        </view>
        <view v-if="userPoints < totalPoints" class="cost-tip">
          <u-icon name="info-circle" color="#FF6B6B" size="28" />
          <text class="tip-text">积分不足</text>
        </view>
      </view>
    </scroll-view>

    <!-- 加载状态 -->
    <view v-if="loading" class="loading-state">
      <u-loading mode="circle" />
      <text class="loading-text">加载中...</text>
    </view>
    
    <!-- 底部操作栏 -->
    <view v-if="!loading" class="bottom-bar">
      <view class="total-info">
        <text class="total-label">合计:</text>
        <text class="total-points">{{ totalPoints }}</text>
        <text class="total-unit">积分</text>
        <text v-if="totalCash > 0" class="total-cash">+¥{{ totalCash }}</text>
      </view>
      <button 
        class="submit-btn"
        :disabled="!canSubmit || submitting"
        @click="handleSubmit"
      >
        {{ submitting ? '提交中...' : '提交订单' }}
      </button>
    </view>
  </view>
</template>

<script>
import { getProductDetail, createPointsOrder } from '@/common/api';
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
    // 计算总积分
    totalPoints() {
      return (this.skuInfo.pointsRequired || 0) * this.quantity;
    },
    
    // 计算总现金
    totalCash() {
      return ((this.skuInfo.cashRequired || 0) * this.quantity).toFixed(2);
    },
    
    // 是否可以提交
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
    // 从门店选择页返回时，获取选中的门店
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

    // 加载用户信息
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

    // 加载SKU信息
    async loadSkuInfo() {
      if (!this.skuId) return;
      
      try {
        this.loading = true;
        // 通过商品详情接口获取SKU信息
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
    
    // 选择门店
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
    
    // 提交订单
    async handleSubmit() {
      // 验证表单
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
        
        // 跳转到订单详情页
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
    
    // 返回
    goBack() {
      uni.navigateBack();
    }
  }
}
</script>

<style scoped>
.confirm-container {
  width: 100%;
  height: 100vh;
  background: #F3F4F6;
  display: flex;
  flex-direction: column;
}

.scroll-container {
  flex: 1;
  padding: 20rpx;
  padding-bottom: 140rpx;
}

.section-card {
  background: #FFFFFF;
  border-radius: 16rpx;
  padding: 32rpx;
  margin-bottom: 20rpx;
}

.section-title {
  font-size: 32rpx;
  color: #19191A;
  font-weight: 500;
  margin-bottom: 24rpx;
}

.required {
  color: #FF6B6B;
  margin-left: 4rpx;
}

.store-section {
  display: flex;
  align-items: center;
  position: relative;
}

.store-info {
  flex: 1;
}

.store-name {
  font-size: 28rpx;
  color: #19191A;
  font-weight: 500;
  margin-bottom: 8rpx;
}

.store-address {
  font-size: 24rpx;
  color: #666666;
  margin-bottom: 8rpx;
  line-height: 36rpx;
}

.store-phone {
  font-size: 24rpx;
  color: #666666;
}

.store-placeholder {
  flex: 1;
  font-size: 28rpx;
  color: #A2A2A8;
}

.product-item {
  display: flex;
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

.form-item {
  display: flex;
  align-items: center;
  padding: 24rpx 0;
  border-bottom: 1rpx solid #F3F4F6;
}

.form-item:last-child {
  border-bottom: none;
}

.form-label {
  width: 140rpx;
  font-size: 28rpx;
  color: #19191A;
  flex-shrink: 0;
}

.form-input {
  flex: 1;
  font-size: 28rpx;
  color: #19191A;
  text-align: right;
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
  font-size: 28rpx;
  color: #19191A;
  font-weight: 500;
}

.cost-value.points {
  color: #EE781F;
}

.cost-value.cash {
  color: #19191A;
}

.cost-tip {
  display: flex;
  align-items: center;
  margin-top: 16rpx;
  padding-top: 16rpx;
  border-top: 1rpx solid #F3F4F6;
}

.tip-text {
  font-size: 24rpx;
  color: #FF6B6B;
  margin-left: 8rpx;
}

.loading-state {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.loading-text {
  font-size: 28rpx;
  color: #A2A2A8;
  margin-top: 20rpx;
}

.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #FFFFFF;
  padding: 20rpx 32rpx;
  padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
  box-shadow: 0 -4rpx 20rpx rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.total-info {
  display: flex;
  align-items: baseline;
}

.total-label {
  font-size: 28rpx;
  color: #19191A;
  margin-right: 8rpx;
}

.total-points {
  font-size: 40rpx;
  color: #EE781F;
  font-weight: bold;
}

.total-unit {
  font-size: 24rpx;
  color: #EE781F;
  margin-left: 4rpx;
}

.total-cash {
  font-size: 28rpx;
  color: #EE781F;
  margin-left: 8rpx;
}

.submit-btn {
  width: 240rpx;
  height: 72rpx;
  background: #EE781F;
  border-radius: 36rpx;
  color: #FFFFFF;
  font-size: 28rpx;
  font-weight: 500;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
}

.submit-btn[disabled] {
  background: #D1D1D6;
}
</style>
