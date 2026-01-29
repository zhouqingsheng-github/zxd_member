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
    
    <!-- 门店选择 -->
    <view class="store-section" @click="selectStore">
      <view class="section-title">自提门店</view>
      <view v-if="selectedStore.storeId" class="store-info">
        <view class="store-name">{{ selectedStore.storeName }}</view>
        <view class="store-address">{{ selectedStore.address }}</view>
        <view class="store-phone">{{ selectedStore.phone }}</view>
      </view>
      <view v-else class="store-placeholder">
        请选择自提门店
      </view>
      <u-icon name="arrow-right" color="#999999" size="28" />
    </view>
    
    <!-- 商品信息 -->
    <view class="product-section">
      <view class="section-title">商品信息</view>
      <view class="product-item">
        <image 
          :src="skuInfo.mainImage" 
          class="product-image"
          mode="aspectFill"
        />
        <view class="product-info">
          <view class="product-name">{{ skuInfo.spuName }}</view>
          <view class="product-spec">{{ skuInfo.skuName }}</view>
          <view class="product-quantity">x{{ quantity }}</view>
        </view>
      </view>
    </view>
    
    <!-- 用户信息 -->
    <view class="user-section">
      <view class="section-title">联系信息</view>
      <view class="form-item">
        <view class="form-label">姓名</view>
        <input 
          v-model="form.contactName" 
          class="form-input"
          placeholder="请输入姓名"
        />
      </view>
      <view class="form-item">
        <view class="form-label">手机号</view>
        <input 
          v-model="form.contactPhone" 
          class="form-input"
          type="number"
          maxlength="11"
          placeholder="请输入手机号"
        />
      </view>
    </view>
    
    <!-- 费用明细 -->
    <view class="cost-section">
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
    </view>
    
    <!-- 底部操作栏 -->
    <view class="bottom-bar">
      <view class="total-info">
        <text class="total-label">合计:</text>
        <text class="total-points">{{ totalPoints }}</text>
        <text class="total-unit">积分</text>
        <text v-if="totalCash > 0" class="total-cash">+¥{{ totalCash }}</text>
      </view>
      <view 
        class="submit-btn"
        :class="{ disabled: !canSubmit }"
        @click="handleSubmit"
      >
        {{ submitting ? '提交中...' : '提交订单' }}
      </view>
    </view>
    
    <!-- 加载状态 -->
    <u-loading-page :loading="loading" />
  </view>
</template>

<script>
import { getProductDetail, createExchangeOrder, getMemberInfo, getMemberPoints } from '@/common/api/points'

export default {
  data() {
    return {
      skuId: 0,
      quantity: 1,
      skuInfo: {},
      userPoints: 0,
      form: {
        contactName: '',
        contactPhone: ''
      },
      selectedStore: {},
      loading: false,
      submitting: false
    }
  },
  
  computed: {
    // 计算总积分
    totalPoints() {
      return (this.skuInfo.pointsRequired || 0) * this.quantity
    },
    
    // 计算总现金
    totalCash() {
      return ((this.skuInfo.cashRequired || 0) * this.quantity).toFixed(2)
    },
    
    // 是否可以提交
    canSubmit() {
      return !this.submitting &&
             this.selectedStore.storeId &&
             this.form.contactName &&
             this.form.contactPhone &&
             this.form.contactPhone.length === 11 &&
             this.userPoints >= this.totalPoints
    }
  },
  
  onLoad(options) {
    this.skuId = options.skuId || 0
    this.quantity = parseInt(options.quantity || 1)
    
    if (this.skuId) {
      this.loadSkuInfo()
      this.loadUserInfo()
    }
  },
  
  onShow() {
    // 从缓存中获取选中的门店
    const store = uni.getStorageSync('selectedStore')
    if (store) {
      this.selectedStore = store
      uni.removeStorageSync('selectedStore')
    }
  },
  
  methods: {
    // 加载SKU信息
    async loadSkuInfo() {
      this.loading = true
      
      try {
        // 这里需要通过spuId获取详情,然后找到对应的SKU
        // 简化处理:假设已经有SKU信息
        // 实际应该调用getProductDetail获取完整信息
        
        // TODO: 实现SKU信息加载
        this.skuInfo = {
          spuName: '商品名称',
          skuName: '规格名称',
          mainImage: '',
          pointsRequired: 100,
          cashRequired: 0
        }
      } catch (error) {
        console.error('加载SKU信息失败:', error)
      } finally {
        this.loading = false
      }
    },
    
    // 加载用户信息
    async loadUserInfo() {
      try {
        // 加载用户积分
        const pointsRes = await getMemberPoints()
        this.userPoints = pointsRes.availablePoints || 0
        
        // 加载用户信息并自动填充
        const infoRes = await getMemberInfo()
        this.form.contactPhone = infoRes.phoneNumber || ''
        this.form.contactName = infoRes.nickname || ''
      } catch (error) {
        console.error('加载用户信息失败:', error)
      }
    },
    
    // 选择门店
    selectStore() {
      uni.navigateTo({
        url: `/pages/subPackages/points/store-select/store-select?skuId=${this.skuId}`
      })
    },
    
    // 提交订单
    async handleSubmit() {
      if (!this.canSubmit) {
        if (!this.selectedStore.storeId) {
          uni.showToast({ title: '请选择自提门店', icon: 'none' })
        } else if (!this.form.contactName) {
          uni.showToast({ title: '请输入姓名', icon: 'none' })
        } else if (!this.form.contactPhone) {
          uni.showToast({ title: '请输入手机号', icon: 'none' })
        } else if (this.form.contactPhone.length !== 11) {
          uni.showToast({ title: '手机号格式不正确', icon: 'none' })
        } else if (this.userPoints < this.totalPoints) {
          uni.showToast({ title: '积分不足', icon: 'none' })
        }
        return
      }
      
      this.submitting = true
      
      try {
        const data = {
          skuId: this.skuId,
          quantity: this.quantity,
          storeId: this.selectedStore.storeId,
          contactName: this.form.contactName,
          contactPhone: this.form.contactPhone
        }
        
        const res = await createExchangeOrder(data)
        
        uni.showToast({
          title: '订单创建成功',
          icon: 'success'
        })
        
        // 跳转到订单详情或订单列表
        setTimeout(() => {
          uni.redirectTo({
            url: `/pages/subPackages/points/order-detail/order-detail?id=${res}`
          })
        }, 1500)
      } catch (error) {
        console.error('提交订单失败:', error)
        uni.showToast({
          title: '提交失败',
          icon: 'none'
        })
      } finally {
        this.submitting = false
      }
    },
    
    // 返回
    goBack() {
      uni.navigateBack()
    }
  }
}
</script>

<style scoped lang="scss">
.confirm-container {
  min-height: 100vh;
  background-color: #F3F4F6;
  padding-bottom: 160rpx;
}

.store-section,
.product-section,
.user-section,
.cost-section {
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

.store-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  
  .store-info {
    flex: 1;
    margin-right: 16rpx;
    
    .store-name {
      font-size: 28rpx;
      color: #19191A;
      margin-bottom: 8rpx;
    }
    
    .store-address {
      font-size: 24rpx;
      color: #666666;
      margin-bottom: 8rpx;
    }
    
    .store-phone {
      font-size: 24rpx;
      color: #666666;
    }
  }
  
  .store-placeholder {
    flex: 1;
    font-size: 28rpx;
    color: #999999;
    margin-right: 16rpx;
  }
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

.form-item {
  display: flex;
  align-items: center;
  padding: 24rpx 0;
  border-bottom: 1rpx solid #F3F4F6;
  
  &:last-child {
    border-bottom: none;
  }
  
  .form-label {
    width: 140rpx;
    font-size: 28rpx;
    color: #19191A;
  }
  
  .form-input {
    flex: 1;
    font-size: 28rpx;
    color: #19191A;
  }
}

.cost-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 0;
  
  .cost-label {
    font-size: 28rpx;
    color: #666666;
  }
  
  .cost-value {
    font-size: 28rpx;
    color: #19191A;
    
    &.points {
      color: #EE781F;
      font-weight: bold;
    }
    
    &.cash {
      color: #EE781F;
      font-weight: bold;
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
  display: flex;
  align-items: center;
  justify-content: space-between;
  
  .total-info {
    flex: 1;
    
    .total-label {
      font-size: 28rpx;
      color: #666666;
    }
    
    .total-points {
      font-size: 40rpx;
      color: #EE781F;
      font-weight: bold;
      margin-left: 8rpx;
    }
    
    .total-unit {
      font-size: 24rpx;
      color: #EE781F;
      margin-left: 4rpx;
    }
    
    .total-cash {
      font-size: 28rpx;
      color: #666666;
      margin-left: 12rpx;
    }
  }
  
  .submit-btn {
    width: 240rpx;
    height: 72rpx;
    background: linear-gradient(135deg, #FF9A56 0%, #EE781F 100%);
    border-radius: 36rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28rpx;
    font-weight: bold;
    color: #FFFFFF;
    
    &.disabled {
      opacity: 0.5;
    }
  }
}
</style>
