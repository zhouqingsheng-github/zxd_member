<template>
  <view class="hotel-list">
    <view class="hotel-card" v-for="(hotel, idx) in hotels" :key="idx" @click="handleHotelClick(hotel)">
      <view class="hotel-img-wrap">
        <image class="hotel-img" :src="getMainImg(hotel.imgUrls)" mode="aspectFill"/>
        <view class="hotel-rate" v-if="hotel.rating">
          <view class="rate-icon"></view>
          <view class="rate-num">{{ hotel.rating }}</view>
        </view>
      </view>
      <view class="hotel-info">
        <view class="hotel-title-row">
          <view class="hotel-title">{{ hotel.name }}</view>
          <!--          <view class="hotel-distance" v-if="hotel.distance">{{ hotel.distance }}km</view>-->
        </view>
        <view class="hotel-desc">{{ hotel.address }}</view>
        <view class="hotel-bottom">
          <view class="hotel-tags">
            <!--            <view class="tag tag-bj" v-if="hotel.liveContinuously">
                          <image class="tag-icon-bj" src="https://www.zxd-hotel.xin/zxdhotel/icon/lzbq4.png" mode="aspectFit" />
                        </view>-->
            <view class="tag tag-bj pack" v-if="hotel.liveContinuously">
              <view class="pack_1">套餐</view>
              <view class="pack_2">连住套餐</view>
            </view>
            <view v-for="(tag, i) in hotel.hotelTags" :key="i" v-if="tag.cshow===0 && tag.type ===3" class="tag">
              <image v-if="tag.iconUrl" class="tag-icon" :src="tag.iconUrl" mode="aspectFit"/>
              <text class="tag-text">{{ tag.name }}</text>
            </view>
          </view>
          <view class="hotel-price-row">
            <view v-if="hotel.fullRoom === 1" class="full-btn">满房</view>
            <template v-else>
              <template v-if="!type">
                <view class="hotel-old-price" v-if="hotel.scribingPrice != hotel.price">￥{{
                    hotel.scribingPrice
                  }}
                </view>
                <view class="hotel-price">
                  <text class="price-symbol">¥</text>
                  <text class="price-number">{{ hotel.price }}</text>
                  <text class="price-unit">起</text>
                </view>
              </template>
            </template>
          </view>
        </view>
      </view>
    </view>
    <view v-if="loading" class="loading-more">
      <view class="loading-content">
        <view class="loading-dot"></view>
        <view class="loading-dot"></view>
        <view class="loading-dot"></view>
      </view>
    </view>
    <view v-if="noMoreData && hotels.length > 0" class="no-more-data">
      没有更多数据了
    </view>
  </view>
</template>

<script>
export default {
  name: 'HotelList',
  props: {
    hotels: {
      type: Array,
      required: true,
      default: () => []
    },
    type: {
      type: Boolean,
      default: false
    },
    otherParameters: {
      type: Object,
      default: () => {
      }
    },
    loading: {
      type: Boolean,
      default: false
    },
    noMoreData: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    handleHotelClick(hotel) {
      try {
        if (!this.type) {
          uni.navigateTo({
            url: `/pages/subPackages/home/detail?id=${hotel.id || ''}`,
            fail: (err) => {
              console.error('跳转失败：', err);
              uni.showToast({
                title: '页面跳转失败',
                icon: 'none'
              });
            }
          });
        } else {
          uni.navigateTo({
            url: `/pages/subPackages/home/jointSalesDetail?id=${hotel.id || ''}&dataId=${this.otherParameters.dataId}`,
            fail: (err) => {
              console.error('跳转失败：', err);
              uni.showToast({
                title: '页面跳转失败',
                icon: 'none'
              });
            }
          });
        }
      } catch (error) {
        console.error('跳转错误：', error);
        uni.showToast({
          title: '页面跳转失败',
          icon: 'none'
        });
      }
    },
    getMainImg(imgUrls) {
      if (!imgUrls || !imgUrls.length) return '';
      const main = imgUrls.find(function (img) {
        return img.isMain === 1;
      });
      return main ? main.imageUrl : '';
    }
  }
}
</script>

<style scoped>
.hotel-list {
  margin-top: 32rpx;
}

.hotel-card {
  background: #fff;
  height: auto;
  border-radius: 28rpx;
  margin-bottom: 28rpx;
  overflow: hidden;
}

.hotel-img-wrap {
  position: relative;
  width: 100%;
}

.hotel-img {
  width: 100%;
  height: 400rpx;
  margin-bottom: 22rpx;
  background: #E6DED9;
}

.hotel-info {
  padding: 0 28rpx;
}

.hotel-title-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8rpx;
}

.hotel-title {
  flex: 1;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-all;
  font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;
  font-weight: 500;
  font-size: 32rpx;
  color: #19191A;
}

.hotel-distance {
  font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;
  font-weight: 400;
  font-size: 24rpx;
  color: #6D7278;
  margin-left: 20rpx;
  flex-shrink: 0;
}

.hotel-rate {
  position: absolute;
  top: 20rpx;
  right: 20rpx;
  width: 114rpx;
  height: 52rpx;
  background: #FFFFFF;
  border-radius: 41rpx;
  opacity: 0.7;
  display: flex;
  align-items: center;
}

.rate-icon {
  width: 24rpx;
  height: 24rpx;
  background: url('/static/base/score.png') no-repeat;
  background-size: 100% 100%;
  margin: 14rpx 10rpx 14rpx 20rpx;
  flex-shrink: 0;
}

.rate-num {
  font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;
  font-weight: 400;
  font-size: 24rpx;
  color: #36363B;
  line-height: 24rpx;
  letter-spacing: 1px;
}

.hotel-desc {
  width: 638rpx;
  height: 24rpx;
  font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;
  font-weight: 400;
  font-size: 24rpx;
  color: #6D7278;
  line-height: 24rpx;
  text-align: left;
  font-style: normal;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 10rpx;
}

.hotel-bottom {
  display: flex;
  justify-content: space-between;
  margin-bottom: 38rpx;
  align-items: center;
}

.hotel-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
  padding-top: 8rpx;
}

.tag {
  position: relative;
  border-radius: 4rpx;
  padding: 4rpx 10rpx;
  display: flex;
  align-items: center;
  gap: 6rpx;
  box-sizing: border-box;
}

.tag::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  width: 200%;
  height: 200%;
  border: 1px solid rgba(238, 120, 31, 0.3);
  border-radius: 8rpx;
  transform: scale(0.5);
  transform-origin: 0 0;
  pointer-events: none;
  box-sizing: border-box;
}

.tag-bj {
  border-radius: 0 !important;
  padding: 0 !important;
}

.pack {
  background: #FFEEE1;
}

.pack_1 {
  background: #EE781F;
  border-radius: 4rpx 0 0 4rpx;
  width: 65rpx;
  height: 28rpx;
  line-height: 28rpx;
  text-align: center;

  font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;
  font-weight: 400;
  font-size: 20rpx;
  color: #FFFFFF;
  font-style: normal;
}

.pack_2 {
  background: #FFEEE1;
  border-radius: 0 4rpx 4rpx 0;
  width: 100rpx;
  height: 28rpx;
  font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;
  font-weight: 400;
  font-size: 20rpx;
  color: #EE781F;
  line-height: 28rpx;
  text-align: center;
  font-style: normal;
}

.tag-bj::before {
  display: none;
}

.tag-icon {
  width: 20rpx;
  height: 20rpx;
  flex-shrink: 0;
}

.tag-icon-bj {
  width: 162rpx;
  height: 28rpx;
}

.tag-text {
  height: 20rpx;
  font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;
  font-weight: 400;
  font-size: 20rpx;
  color: #EE781F;
  line-height: 20rpx;
  text-align: left;
  font-style: normal;
}

.hotel-price-row {
  display: flex;
  align-items: baseline;
  gap: 12rpx;
}

.hotel-old-price {
  width: 64rpx;
  height: 24rpx;
  font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;
  font-weight: 400;
  font-size: 24rpx;
  color: #6D7278;
  line-height: 24rpx;
  text-align: left;
  font-style: normal;
  text-decoration-line: line-through;
}

.hotel-price {
  display: flex;
  align-items: baseline;
  font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;
  font-style: normal;
  color: #EE781F;
  text-align: left;
}

.price-symbol {
  font-size: 24rpx;
  font-weight: 400;
  line-height: 24rpx;
}

.price-number {
  font-size: 40rpx;
  font-weight: 600;
  line-height: 40rpx;
}

.price-unit {
  font-size: 24rpx;
  font-weight: 400;
  line-height: 24rpx;
  margin-left: 2rpx;
}

.hotel-full-room {
  width: 80rpx;
  height: 48rpx;
  background: #CBCBD5;
  border-radius: 24rpx;
  font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;
  font-weight: 500;
  font-size: 24rpx;
  color: #FFFFFF;
  line-height: 48rpx;
  text-align: center;
  font-style: normal;
}

.full-btn {
  width: 120rpx;
  height: 72rpx;
  background: #CBCBD5;
  border-radius: 36rpx;
  font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;
  font-weight: 500;
  font-size: 32rpx;
  color: #FFFFFF;
  line-height: 72rpx;
  text-align: center;
  font-style: normal;
  border: none;
  margin-left: 24rpx;
}

.loading-more {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20rpx 0;
}

.loading-content {
  display: flex;
  align-items: center;
}

.loading-dot {
  width: 16rpx;
  height: 16rpx;
  border-radius: 50%;
  background: #FF8047;
  margin: 0 8rpx;
  animation: loading 1.5s infinite ease-in-out;
}

.loading-dot:nth-child(1) {
  animation-delay: -0.32s;
}

.loading-dot:nth-child(2) {
  animation-delay: -0.16s;
}

@keyframes loading {

  0%,
  80%,
  100% {
    transform: scale(0);
    opacity: 0.5;
  }

  40% {
    transform: scale(1);
    opacity: 1;
  }
}

.no-more-data {
  text-align: center;
  color: #999;
  font-size: 28rpx;
}
</style>