<template>
  <view class="webview-page">
    <web-view v-if="pageUrl" :src="pageUrl" class="webview-content"/>
    <view v-else class="empty">无效链接</view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      pageUrl: ''
    }
  },
  onLoad(options) {
    if (options && options.url) {
      this.pageUrl = decodeURIComponent(options.url)
    }
  },
  methods: {}
}
</script>

<style scoped>
.webview-page {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.back-btn {
  width: 48rpx;
  height: 48rpx;
  background: url('/static/base/back.png') no-repeat center;
  background-size: 60%;
  margin-right: 20rpx;
}

.navbar-title {
  color: #fff;
  font-size: 32rpx;
  font-weight: 500;
}

.webview-content {
  flex: 1;
  width: 100vw;
  height: calc(100vh - 88rpx);
}

.empty {
  text-align: center;
  color: #999;
  margin-top: 100rpx;
}
</style> 