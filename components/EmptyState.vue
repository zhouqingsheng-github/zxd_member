<template>
  <view class="empty-container">
    <view class="empty-state">
      <image 
        class="empty-icon" 
        :src="image" 
        mode="aspectFit"
      />
    </view>
    <view class="empty-text">{{ text }}</view>
  </view>
</template>

<script>
export default {
  name: 'EmptyState',
  props: {
    // 空状态显示的文本
    text: {
      type: String,
      default: '暂无数据'
    },
    // 空状态显示的图片路径
    image: {
      type: String,
      default: '/static/base/placeholderMap.png'
    }
  }
}
</script>

<style scoped>
.empty-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400rpx;
}

.empty-state {
  width: 370rpx;
  height: 200rpx;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 200rpx;
  margin-bottom: 40rpx;
}

.empty-icon {
  width: 100%;
  height: 100%;
}

.empty-text {
  margin: auto;
  width: auto;
  height: 24rpx;
  font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;
  font-weight: 400;
  font-size: 24rpx;
  color: #A2A2A8;
  line-height: 24rpx;
  text-align: center;
  font-style: normal;
}
</style> 