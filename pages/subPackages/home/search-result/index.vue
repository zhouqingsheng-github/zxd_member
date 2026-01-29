<template>
  <view class="city-container">
    <!-- 固定区域 -->
    <view class="fixed-header">
      <!-- 顶部导航栏 -->
      <uni-nav-bar
          backgroundColor="#FFFFFF"
          :fixed="false"
          :shadow="false"
          :border="false"
          status-bar
          left-icon="left"
          @clickLeft="goBack"
      >
        <template #default>
          <text class="nav-title">{{ currentCity }}</text>
        </template>
        <template #right>
        </template>
      </uni-nav-bar>

      <!-- 搜索栏 -->
      <view class="search-bar">
        <view class="search-bar-input">
          <uni-icons type="search" size="18" color="#A2A2A8"/>
          <input class="search-input" placeholder="搜索位置/酒店" v-model="searchKeyword"/>
        </view>
        <text class="search-cancel" @click="clearSearch">取消</text>
      </view>
    </view>

    <!-- 可滚动区域 -->
    <scroll-view
        scroll-y
        class="scroll-content"
        id="scrollView"
        :scroll-into-view="scrollIntoView"
        :scroll-with-animation="true"
        @scroll="onScroll"
    >
      <!-- 联想结果展示 -->
      <view v-if="searchKeyword">
        <view v-if="suggestList.length" class="suggest-list">
          <view v-for="item in suggestList" :key="item.key" class="suggest-item" @click="selectSuggest(item)">
            <view class="suggest-icon" v-if="item.type === 'HOTEL'">
              <image src="/static/tabbar/home_selected.png" class="home-selected-icon" mode="aspectFit"/>
            </view>
            <view class="suggest-info">
              <view class="suggest-title">{{ item.name }}</view>
              <view class="suggest-address" v-if="item.address && item.address !='[]'">{{ item.address }}</view>
            </view>
            <view class="suggest-distance" v-if="item.location && item.location!='' && currentLocation">
              {{ formatDistance(calcDistance(currentLocation, item.location)) }}
            </view>
          </view>
        </view>
        <EmptyState v-else text="未找到符合条件的数据" image="/static/base/placeholderMap.png"/>
      </view>

      <!-- 未搜索时显示的内容 -->
      <template v-if="!searchKeyword">
        <!-- 当前定位 -->
        <view class="location-title-row-add">
          <text class="section-title">当前定位</text>
          <text class="location-refresh" @click="refreshLocation">刷新</text>
        </view>
        <view class="location-section" @click="useCurrentLocation">
          <view class="location-left-vertical">
            <view class="location-left-row">
              <view class="map-icon"></view>
              <view class="location-city">{{ currentCity }}</view>
            </view>
          </view>
          <view class="location-right-vertical">
            <view class="location-title">{{ currentTitle }}</view>
            <view class="location-detail">{{ currentAddress }}</view>
          </view>
        </view>

        <!-- 热门城市 -->
        <view class="location-title-row">
          <view class="section-title">热门城市</view>
        </view>
        <view class="hot-city-list">
          <view
              v-for="city in hotCities"
              :key="city"
              class="hot-city-item"
              :class="{ active: city === currentCity }"
              @click="selectCity(city)"
          >
            {{ city }}
          </view>
        </view>

        <!-- 城市列表 -->
        <view class="location-title-row">
          <view class="section-title">城市列表</view>
        </view>
        <view class="city-list">
          <view v-for="(group, letter) in cityGroups" :key="letter" :id="'city-group-' + letter">
            <view class="city-group-title">{{ letter }}</view>
            <view v-for="city in group" :key="city" class="city-item" @click="selectCity(city)">
              <text :class="{ active: city === currentCity }">{{ city }}</text>
            </view>
          </view>
        </view>
      </template>
    </scroll-view>

    <!-- 右侧字母索引 -->
    <view class="letter-index">
      <view
          v-for="letter in letterList"
          :key="letter"
          class="letter-item"
          :class="currentLetter === letter ? 'active' : ''"
          @click="scrollToLetter(letter)"
      >
        {{ letter }}
      </view>
    </view>
  </view>
</template>

<script>
import EmptyState from '@/components/EmptyState.vue';
import {fetchHotelDetailByPoiId, searchHotels, gaodeKey} from "../../../../common/api";
import {getLocation} from '@/utils/location.js';
import {pageBack} from "../../../../common/redirect";

export default {
  components: {EmptyState},
  data() {
    return {
      deductOrderId: null,
      scrollIntoView: '',
      currentLetter: '',
      currentCity: '',
      currentProvince: '',
      currentAddress: '定位中...',
      currentTitle: '',
      searchKeyword: '',
      suggestList: [],
      hotCities: [
        '北京', '上海', '深圳', '广州',
        '杭州', '成都', '南京', '香港',
        '重庆', '西安', '三亚', '青岛',
        '长沙', '苏州', '武汉', '天津',
        '厦门', '珠海', '济南', '大连'
      ],
      letterList: [
        'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
      ],
      cityGroups: {},
      cityList: [],
      scrollToView: '',
      currentLocation: null,
      scrollTop: 0,
      scrollTimer: null,
      isScrolling: false,
      currentDistrict: ''
    }
  },
  watch: {
    searchKeyword(newVal) {
      if (!newVal) {
        this.suggestList = [];
        // 当关键词被清空时，通知搜索列表页面
        uni.$emit('searchKeyword', '');
        return;
      }
      // 实时同步搜索关键词
      uni.$emit('searchKeyword', newVal);
      this.fetchSuggest(newVal);
    }
  },
  methods: {
    async getLocation() {
      try {
        const locationInfo = await getLocation();
        this.currentCity = locationInfo.city;
        this.currentProvince = locationInfo.province;
        this.currentDistrict = locationInfo.district;
        let pois = locationInfo.pois;
        if (pois && pois.length > 0) {
          this.currentTitle = pois[0].name.replace(this.currentCity, "");
          this.currentAddress = pois[0].address;
        } else {
          this.currentTitle = locationInfo.city;
          this.currentAddress = locationInfo.address;
        }
        if (this.showDetailAddress) {
          uni.showToast({
            title: '位置已更新',
            icon: 'success'
          });
        }
        this.currentLocation = {
          lng: locationInfo.longitude,
          lat: locationInfo.latitude
        };
      } catch (err) {
        console.error('获取位置失败：', err);
        uni.showToast({
          title: '获取位置失败',
          icon: 'none'
        });
      }
    },
    goBack() {
      this.clearSearch();
      pageBack()
    },
    clearSearch() {
      this.searchKeyword = '';
      this.suggestList = [];
      // 发送空的关键词事件，通知搜索列表页面清空搜索框
      uni.$emit('searchKeyword', '');
    },
    refreshLocation() {
      this.getLocation();
    },
    selectCity(city) {
      this.searchKeyword = city;
    },
    async fetchCityData() {
      const key = await gaodeKey()
      try {
        const res = await uni.request({
          url: `https://restapi.amap.com/v3/config/district?key=${key}&keywords=中国&subdistrict=2&extensions=base`
        });
        if (res[1].statusCode === 200 && res[1].data.status === '1') {
          const provinces = res[1].data.districts[0].districts;
          // 处理城市分组
          const cityGroups = {};
          // 初始化所有字母分组
          this.letterList.forEach(letter => {
            cityGroups[letter] = [];
          });
          // 遍历省份和城市
          provinces.forEach(province => {
            if (province.districts) {
              province.districts.forEach(city => {
                const firstLetter = this.getFirstLetter(city.name);
                if (cityGroups[firstLetter]) {
                  cityGroups[firstLetter].push(city.name);
                }
              });
            }
          });
          // 过滤掉空的分组并排序
          const sortedGroups = {};
          Object.keys(cityGroups)
              .filter(letter => cityGroups[letter].length > 0)
              .sort()
              .forEach(letter => {
                sortedGroups[letter] = cityGroups[letter].sort();
              });
          this.cityGroups = sortedGroups;
        } else {
          uni.showToast({
            title: '获取城市数据失败',
            icon: 'none'
          });
        }
      } catch (error) {
        console.error('获取城市数据失败：', error);
        uni.showToast({
          title: '获取城市数据失败',
          icon: 'none'
        });
      }
    },
    getFirstLetter(str) {
      // 获取城市名称的首字母
      const first = str.charAt(0);
      // 使用简单的字母映射
      const letterMap = {
        '北': 'B', '上': 'S', '广': 'G', '深': 'S', '杭': 'H', '成': 'C', '重': 'C', '西': 'X',
        '天': 'T', '南': 'N', '武': 'W', '长': 'C', '沈': 'S', '大': 'D', '青': 'Q', '厦': 'X',
        '福': 'F', '济': 'J', '郑': 'Z', '石': 'S', '太': 'T', '呼': 'H', '哈': 'H', '长': 'C',
        '吉': 'J', '南': 'N', '南': 'N', '济': 'J', '合': 'H', '福': 'F', '南': 'N', '昌': 'C',
        '长': 'C', '沙': 'S', '贵': 'G', '昆': 'K', '南': 'N', '海': 'H', '三': 'S', '亚': 'Y',
        '重': 'C', '庆': 'Q', '成': 'C', '都': 'D', '贵': 'G', '阳': 'Y', '昆': 'K', '明': 'M',
        '拉': 'L', '萨': 'S', '西': 'X', '安': 'A', '兰': 'L', '州': 'Z', '西': 'X', '宁': 'N',
        '银': 'Y', '川': 'C', '乌': 'W', '鲁': 'L', '木': 'M', '齐': 'Q', '香': 'X', '港': 'G',
        '澳': 'A', '门': 'M', '台': 'T', '湾': 'W'
      };
      const letter = letterMap[first] || '#';
      return this.letterList.includes(letter) ? letter : '#';
    },
    async fetchSuggest(keyword) {
      try {
        const res = await searchHotels({keyword: keyword, deductOrderId: this.deductOrderId, radius: 2000})
        if (res && res.pois && res.pois.length > 0) {
          this.suggestList = res.pois.map((item, index) => {
            return {
              ...item,
              key: item.id || `${item.hotelId}`
            };
          });

        } else {
          this.suggestList = [];
        }
      } catch (e) {
        this.suggestList = [];
      }
    },
    async selectSuggest(item) {
      if (item.type === 'HOTEL' && item.hotelId) {
        if (this.deductOrderId) {
          uni.navigateTo({
            url: `/pages/subPackages/home/jointSalesDetail?id=${item.hotelId || ''}&dataId=${this.deductOrderId}`,
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
            url: `/pages/subPackages/home/detail?id=${item.hotelId || ''}`,
            fail: (err) => {
              console.error('跳转失败：', err);
              uni.showToast({
                title: '页面跳转失败',
                icon: 'none'
              });
            }
          });
        }
        return;
      }
      const pages = getCurrentPages();
      const prevPage = pages[pages.length - 2];
      if (!prevPage) {
        uni.navigateBack();
        return;
      }
      // 优先用 item.location
      let longitude = '', latitude = '';
      if (item.location && item.location !== '[]') {
        [longitude, latitude] = item.location.split(',');
      }
      // 如果没有经纬度，则查一次
      if (!longitude || !latitude) {
        // 用 item.name 查地理编码
        const key = await gaodeKey()
        try {
          const res = await uni.request({
            url: 'https://restapi.amap.com/v3/geocode/geo',
            data: {key, address: item.name}
          });
          if (res[1].data.status === '1' && res[1].data.geocodes.length > 0) {
            const location = res[1].data.geocodes[0].location;
            if (location) {
              [longitude, latitude] = location.split(',');
            }
          }
        } catch (e) {
          uni.showToast({title: '获取经纬度失败', icon: 'none'});
        }
      }
      // 根据经纬度获取城市信息
      let cityName = item.name;
      let provinceName = this.currentProvince;
      let districtName = this.currentDistrict;

      if (longitude && latitude) {
        // 使用逆地理编码获取城市信息
        const key = await gaodeKey()
        try {
          const res = await uni.request({
            url: 'https://restapi.amap.com/v3/geocode/regeo',
            data: {
              key,
              location: `${longitude},${latitude}`,
              extensions: 'base'
            }
          });
          if (res[1].data.status === '1' && res[1].data.regeocode) {
            const addressComponent = res[1].data.regeocode.addressComponent;
            if (addressComponent.city && addressComponent.city.length > 0) {
              cityName = addressComponent.city
            } else {
              cityName = addressComponent.province
            }
            provinceName = addressComponent.province;
            districtName = addressComponent.district;
          }
        } catch (e) {
          console.error('逆地理编码失败：', e);
        }
      }
      // 传递给上一页
      prevPage.$vm.currentCity = cityName;
      prevPage.$vm.currentProvince = provinceName;
      prevPage.$vm.currentDistrict = districtName;
      prevPage.$vm.currentLongitude = longitude;
      prevPage.$vm.currentLatitude = latitude;
      // 更新本地存储
      const searchParams = uni.getStorageSync('searchParams') || {};
      searchParams.city = cityName;
      searchParams.province = provinceName;
      searchParams.district = districtName;
      searchParams.longitude = longitude;
      searchParams.latitude = latitude;
      uni.setStorageSync('searchParams', searchParams);
      // 返回到上一页并传递搜索关键词
      uni.navigateBack({
        delta: 1,
        success: () => {
          uni.$emit('searchKeyword', item.name);
        }
      });
    },
    scrollToLetter(letter) {
      if (this.cityGroups[letter]) {
        this.currentLetter = letter;
        this.scrollIntoView = `city-group-${letter}`;
        setTimeout(() => {
          this.currentLetter = '';
        }, 1500);
        uni.vibrateShort();
      }
    },
    onScroll(e) {

    },
    calcDistance(loc1, loc2Str) {
      if (!loc1 || !loc2Str) return '';
      const [lng2, lat2] = loc2Str.split(',').map(Number);
      const radLat1 = loc1.lat * Math.PI / 180.0;
      const radLat2 = lat2 * Math.PI / 180.0;
      const a = radLat1 - radLat2;
      const b = (loc1.lng - lng2) * Math.PI / 180.0;
      const s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
      const earthRadius = 6378137;
      return Math.round(s * earthRadius);
    },
    formatDistance(meters) {
      if (!meters) return '';
      if (meters < 1000) {
        return `${Math.round(meters)}米`;
      } else {
        return `${(meters / 1000).toFixed(1)}公里`;
      }
    },
    useCurrentLocation() {
      if (this.currentCity && this.currentCity !== '定位中...' && this.currentCity !== '定位失败') {
        // 获取页面栈
        const pages = getCurrentPages();
        const prevPage = pages[pages.length - 2];
        if (prevPage) {
          // 直接更新上一个页面的城市信息
          prevPage.$vm.currentCity = this.currentCity;
          prevPage.$vm.currentProvince = this.currentProvince;
          prevPage.$vm.currentDistrict = this.currentDistrict;
          // 更新搜索参数
          const searchParams = uni.getStorageSync('searchParams') || {};
          searchParams.city = this.currentCity;
          searchParams.province = this.currentProvince;
          searchParams.district = this.currentDistrict;
          uni.setStorageSync('searchParams', searchParams);
          // 重新加载酒店列表
          if (prevPage.$vm.loadHotelList) {
            prevPage.$vm.loadHotelList(searchParams);
          }
        }
        uni.navigateBack();
      }
    },
  },
  mounted() {
    this.fetchCityData();
  },
  onShow() {
    this.getLocation();
  },
  onLoad(options) {
    if (options.deductOrderId) {
      this.deductOrderId = options.deductOrderId;
    } else {
      this.deductOrderId = null
    }
    // 从本地存储获取搜索参数
    const searchParams = uni.getStorageSync('searchParams') || {};
    if (searchParams.city) {
      this.currentCity = searchParams.city;
    }
    if (searchParams.province) {
      this.currentProvince = searchParams.province;
    }
    if (searchParams.district) {
      this.currentDistrict = searchParams.district;
    }
    if (options.keyword) {
      this.searchKeyword = decodeURIComponent(options.keyword);
      // 如果有关键词，立即触发搜索
      this.fetchSuggest(this.searchKeyword);
    }
    this.fetchCityData();
  }
}
</script>

<style scoped>

.letter-index .active {
  color: #EE781F;
  font-weight: bold;
  transform: scale(1.2);
  transition: all 0.3s;
}

.city-container {
  background: #fff;
  min-height: 100vh;
  position: relative;
  display: flex;
  flex-direction: column;
}

.fixed-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: #fff;
}

.scroll-content {
  flex: 1;
  box-sizing: border-box;
  margin-top: 316rpx;
  height: calc(100vh - 316rpx);
  position: relative;
}

.nav-bar {
  display: flex;
  align-items: center;
  height: 88rpx;
  padding: 0 24rpx;
  border-bottom: 1px solid #f3f4f6;
  background: #fff;
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

.nav-actions {
  width: 44rpx;
  display: flex;
  justify-content: flex-end;
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

.location-title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 44rpx 24rpx 0 24rpx;
  position: relative;
}

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

.hot-city-list {
  display: flex;
  flex-wrap: wrap;
  padding: 0 24rpx;
  margin-top: 16rpx;
  gap: 28rpx;
}

.hot-city-item {
  width: 140rpx;
  height: 56rpx;
  background: #f3f7fa;
  border-radius: 8rpx;
  font-size: 28rpx;
  color: #19191A;
  text-align: center;
  line-height: 56rpx;
}

.hot-city-item.active {
  background: #EE781F;
  color: #fff;
}

.city-list {
  margin: 24rpx 0 0 0;
  background: #fff;
  padding-bottom: 40rpx;
  padding-right: 60rpx; /* 为字母索引留出空间 */
}

.city-group-title {
  font-size: 24rpx;
  color: #A2A2A8;
  padding: 10rpx 24rpx;
  font-weight: 500;
  background: #F3F4F6;
}

.city-item {
  padding: 34rpx 24rpx;
  border-bottom: 1px solid #f3f4f6;
  font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;
  font-weight: 400;
  font-size: 28rpx;
  color: #19191A;
  line-height: 28rpx;
  text-align: left;
  font-style: normal;
}

.city-item text.active {
  color: #EE781F;
}

.letter-index {
  position: fixed;
  right: 12rpx;
  top: 50%;
  transform: translateY(-29%);
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: rgba(255, 255, 255, 0.9);
  padding: 10rpx;
  border-radius: 20rpx;
}

.letter-item {
  font-size: 20rpx;
  color: #A2A2A8;
  padding: 4rpx 0;
  transform: translateZ(0);
  -webkit-transform: translateZ(0);
}

.letter-item.active {
  color: #EE781F;
  font-weight: bold;
  transform: scale(1.2) translateZ(0);
  -webkit-transform: scale(1.2) translateZ(0);
  transition: all 0.3s;
}

.suggest-list {
  background: #fff;
  border-radius: 16rpx;
  box-shadow: 0 4rpx 24rpx rgba(238, 120, 31, 0.08);
  z-index: 20;
  position: relative;
  top: -20rpx;
}

.suggest-item {
  display: flex;
  align-items: center;
  padding: 24rpx 20rpx 24rpx 40rpx;
  border-bottom: 1px solid #f3f4f6;
  cursor: pointer;
  transition: background 0.2s;
}

.suggest-item:last-child {
  border-bottom: none;
}

.suggest-item:active {
  background: #f7f7f7;
}

.suggest-icon {
  margin-right: 18rpx;
  flex-shrink: 0;
}

.suggest-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.suggest-title {
  font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;
  font-weight: 400;
  font-size: 28rpx;
  color: #19191A;
  line-height: 28rpx;
  text-align: left;
  font-style: normal;
}

.suggest-address {
  font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;
  font-weight: 400;
  font-size: 24rpx;
  color: #969799;
  line-height: 24rpx;
  text-align: left;
  font-style: normal;
  margin-top: 16rpx;
}

.suggest-distance {
  font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;
  font-weight: 400;
  font-size: 24rpx;
  color: #969799;
  line-height: 24rpx;
  text-align: left;
  font-style: normal;
  margin-left: 16rpx;
  flex-shrink: 0;
}

.home-selected-icon {
  width: 32rpx;
  height: 32rpx;
  margin-right: 8rpx;
  vertical-align: middle;
}
</style> 