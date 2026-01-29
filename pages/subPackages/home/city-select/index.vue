<template>
  <view class="city-select-page">
    <uni-nav-bar
        backgroundColor="#FFFFFF"
        :fixed="false"
        :shadow="false"
        :border="false"
        status-bar
        left-icon="left"
        @clickLeft="back"
    >
      <template #default>
        <text class="nav-title">选择城市</text>
      </template>
      <template #right>
      </template>
    </uni-nav-bar>
    <view class="search-bar">
      <view class="search-bar-input">
        <uni-icons type="search" size="18" color="#A2A2A8"/>
        <input class="search-input" placeholder="请输入城市名称"
               @input="onSearchInput"
               @confirm="onSearchConfirm"/>
      </view>
      <text class="search-cancel" @click="clearSearch">搜索</text>
    </view>

    <!-- 当前定位 -->
    <view class="location-title-row-add">
      <text class="section-title">当前定位</text>
      <text class="location-refresh" @click="refreshLocation">刷新</text>
    </view>
    <view class="location-section" @click="useCurrentLocation">
      <view class="location-left-vertical">
        <view class="location-left-row">
          <view class="map-icon"></view>
          <view class="location-city">{{ currentCity || '定位中...' }}</view>
        </view>
      </view>
      <view class="location-right-vertical">
        <view class="location-title">{{ companyName || '' }}</view>
        <view class="location-detail">{{ detailAddress || '' }}</view>
      </view>
    </view>
    <CityPicker :show="true" :search="searchCity" @select="onSelectCity" @close="onClose" class="city-picker-flex"/>
  </view>
</template>

<script>
import CityPicker from '@/components/CityPicker.vue';
import UniIcons from "../../../../uni_modules/uni-icons/components/uni-icons/uni-icons.vue";
import {getLocation} from '@/utils/location.js';
import {pageBack} from "../../../../common/redirect";

export default {
  components: {UniIcons, CityPicker},
  data() {
    return {
      deductOrderId: '',
      currentCity: '定位中...',
      currentDistrict: '',
      companyName: '',
      detailAddress: '',
      fromPage: '',
      isTabbarPage: false,
      searchCity: ''
    }
  },
  onLoad(options) {
    this.getLocation();
    this.deductOrderId = options.deductOrderId;
    const pages = getCurrentPages();
    if (pages.length > 1) {
      const prevPage = pages[pages.length - 2];
      this.fromPage = prevPage.route;
      const tabbarPages = ['/pages/home/index', '/pages/order/index', '/pages/coupon/index', '/pages/user/index'];
      this.isTabbarPage = tabbarPages.includes(`/${this.fromPage}`);
    }
  },
  methods: {
    back() {
      pageBack()
    },
    onSelectCity(city) {
      const eventChannel = this.getOpenerEventChannel && this.getOpenerEventChannel();
      if (eventChannel) {
        eventChannel.emit('citySelected', city);
      }
      uni.$emit('cityUpdated', city);
      // 只在选择城市时返回，避免重复触发
      pageBack()
    },
    onClose() {
      // 关闭时不再返回，避免重复触发
      // pageBack()
    },
    async getLocation() {
      this.currentCity = '定位中...';
      this.currentDistrict = '';
      this.companyName = '';
      this.detailAddress = '';

      try {
        const locationInfo = await getLocation();
        this.currentCity = locationInfo.city;
        this.currentDistrict = locationInfo.district;
        const pois = locationInfo.pois;
        this.companyName = pois && pois.length > 0 ? pois[0].name : '';
        this.detailAddress = locationInfo.address;
      } catch (err) {
        console.error('获取位置失败：', err);
        this.currentCity = '定位失败';
        this.currentDistrict = '';
        this.companyName = '';
        this.detailAddress = '';
      }
    },
    useCurrentLocation() {
      if (
          this.currentCity &&
          this.currentCity !== '定位中...' &&
          this.currentCity !== '定位失败'
      ) {
        this.onSelectCity({
          name: this.currentCity,
          district: this.currentDistrict,
          displayName: this.currentCity
        });
      }
    },
    onSearchInput(e) {
      this.searchCity = e.detail.value;
    },
  }
}
</script>

<style scoped>
.location-title-row-add {
  margin: 0 24rpx 0 24rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
}

.section-title {
  font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;
  font-weight: 500;
  font-size: 32rpx;
  color: #19191A;
  line-height: 32rpx;
}

.location-refresh {
  color: #EE781F;
  font-size: 28rpx;
}


.location-section {
  background: #F3F7FA;
  border-radius: 8rpx;
  margin: 20rpx 28rpx 16rpx 28rpx;
  padding: 20rpx 30rpx 22rpx;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10rpx;
}

.location-left-vertical {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: auto;
  min-width: 90rpx;
  flex-shrink: 0;
  height: 100%;
  margin-right: 50rpx;
}

.location-left-row {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}

.map-icon {
  width: 38rpx;
  height: 38rpx;
  background: url('/static/base/map.png') no-repeat center;
  background-size: 38rpx 38rpx;
  border-radius: 50%;
  background-color: #fff;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.04);
  margin-bottom: 0;
}

.location-city {
  color: #EE781F;
  font-size: 28rpx;
  font-weight: 500;
  text-align: center;
  margin-left: 10rpx;
  white-space: normal;
  overflow: visible;
  text-overflow: unset;
}

.location-right-vertical {
  display: flex;
  flex-direction: column;
  flex: 1 1 0%;
  min-width: 0;
  max-width: 70%;
}

.location-title {
  font-size: 30rpx;
  color: #19191A;
  font-weight: 500;
  line-height: 1.2;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.location-detail {
  color: #A2A2A8;
  font-size: 26rpx;
  margin-top: 4rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.location-title-row-add {
  margin: 44rpx 24rpx 0 24rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
}

.section-title {
  font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;
  font-weight: 500;
  font-size: 32rpx;
  color: #19191A;
  line-height: 32rpx;
}

.location-refresh {
  color: #EE781F;
  font-size: 28rpx;
}


.city-select-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #fff;
}

.city-picker-flex {
  flex: 1;
  min-height: 0;
}

.search-bar {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin: 24rpx 24rpx 0 24rpx;
  gap: 28rpx;
}

.search-bar-input {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 580rpx;
  height: 32rpx;
  background: #F3F7FA;
  border-radius: 46rpx;
  padding: 30rpx 0 30rpx 30rpx;
}

.search-input {
  flex: 1;
  border: none;
  background: transparent;
  font-size: 28rpx;
  margin-left: 12rpx;
  color: #19191A;
}

.search-cancel {
  height: 28rpx;
  font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;
  font-weight: 400;
  font-size: 28rpx;
  color: #19191A;
  line-height: 28rpx;
  text-align: left;
  font-style: normal;
}

.map-icon {
  width: 38rpx;
  height: 38rpx;
  min-width: 20rpx;
  min-height: 20rpx;
  display: inline-block;
  background: url('/static/base/map.png') no-repeat center center;
  background-size: contain;
  margin-bottom: 0;
  margin-right: 12rpx;
}

.nav-title {
  width: 100%;
  font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;
  font-weight: 500;
  font-size: 32rpx;
  color: #19191A;
  text-align: center;
  font-style: normal;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 88rpx;
}

.section-title {
  font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;
  font-weight: 500;
  font-size: 32rpx;
  color: #19191A;
  line-height: 32rpx;
  margin-bottom: 12rpx;
}
</style>