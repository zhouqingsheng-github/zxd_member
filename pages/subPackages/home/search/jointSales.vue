<template>
  <view
      class="container"
  >
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
        <text class="nav-title">{{ currentCity }}</text>
      </template>
      <template #right>
      </template>
    </uni-nav-bar>
    <view class="search-header">
      <view class="search-content">
        <view class="city-section" @click="goToCitySelect">
          <text class="city-text">{{ currentCity }}</text>
          <text class="city-arrow" :class="{ 'arrow-up': showSearchCard }"></text>
        </view>
        <view class="date-section" @click="showSearchCard = true">
          <view class="date-group">
            <text class="date-label">入住</text>
            <text class="date">{{ checkInDate }}</text>
          </view>
          <view class="date-group">
            <text class="date-label">离店</text>
            <text class="date">{{ checkOutDate }}</text>
          </view>
        </view>
        <view class="divider"></view>
        <view class="search-section">
          <view class="search-bar" @click="handleSearchClick">
            <image class="search-icon" src="/static/base/search.png" mode="aspectFit"/>
            <input
                class="search-input"
                placeholder="搜索位置/酒店"
                placeholder-class="placeholder"
                v-model="searchKeyword"
                disabled
            />
          </view>
        </view>
      </view>

      <!-- 搜索卡片组件 -->
      <SearchCard
          v-if="showSearchCard"
          :currentCity="currentCity"
          :currentDistrict="currentDistrict"
          :currentAddress="currentAddress"
          :showDetailAddress="showDetailAddress"
          :checkInDate="tempCheckInDate"
          :checkOutDate="tempCheckOutDate"
          :nightCount="tempNightCount"
          :bedCount="tempBedCount"
          :showClose="true"
          :fullWidth="true"
          buttonText="确认"
          @locationClick="handleLocationClick"
          @dateClick="showCalendar = true"
          @bedClick="showBedPicker = true"
          @search="handleCardSearch"
          @close="showSearchCard = false"
          @cityClick="goToCitySelect"
          class="search-card-popup"
          ref="searchCard"
      />
    </view>
    <view class="filter-tabs">
      <text class="sort-text">排序</text>
      <view
          v-for="(item, index) in sortOptions"
          :key="index"
          class="sort-option"
          @click="handleSort(item)"
      >
        <text>{{ item.name }}</text>
        <image
            v-show='currentSort === item.field+"-"+item.sort'
            class="check-icon"
            src="https://zxd-hotel.xin/zxdhotel/2025/06/03/sortSelection_20250603225956A006.png"
            mode="aspectFit"
        />
      </view>
    </view>

    <scroll-view
        class="content-wrapper"
        :class="{'enable-scroll': !showSearchCard}"
        @scroll="onContentScroll"
        @scrolltolower="onScrollToLower"
        scroll-y="true"
        ref="hotelListContainer"
    >
      <!-- 遮罩层 -->
      <view v-if="showSearchCard" class="mask" @click="showSearchCard = false"></view>

      <EmptyState
          v-if="!hotels.length"
          text="未找到符合条件的酒店"
          image="/static/base/placeholderMap.png"
      />
      <HotelList
          v-else
          :type="type"
          :otherParameters="params"
          :hotels="hotels"
          :loading="loading"
          :noMoreData="noMoreData"
      />
    </scroll-view>

    <!-- 日期选择器 -->
    <HotelCalendar
        v-if="showCalendar"
        @change="onDateChange"
        @close="showCalendar = false"
        :value="[tempCheckInDate, tempCheckOutDate]"
        :isItOptionalToday=!type
        :class="['calendar-page', showCalendar ? 'show' : '']"
    />

    <!-- 床位数选择器 -->
    <BedCountPicker
        v-if="showBedPicker"
        :value="tempBedCount_"
        :canItBeModified=!type
        @input="tempBedCount_ = $event"
        @close="handleBedPickerClose"
        @confirm="onBedCountConfirm"
    />
  </view>
</template>

<script>
import HotelList from '@/components/HotelList.vue'
import SearchCard from '@/components/SearchCard.vue'
import HotelCalendar from '@/components/HotelCalendar.vue'
import BedCountPicker from '@/components/BedCountPicker.vue'
import EmptyState from '@/components/EmptyState.vue'
import {fetchHotelList, gaodeKey} from "@/common/api.js";
import {pageBack} from "../../../../common/redirect";
import {fetchHotelListByPage} from "../../../../common/api";

export default {
  components: {HotelList, SearchCard, HotelCalendar, BedCountPicker, EmptyState},
  onPullDownRefresh() {
    uni.stopPullDownRefresh(); // 立即停止下拉刷新
  },
  onReachBottom() {
    return false;
  },
  async onLoad(options) {
    if (!options.id) {
      await uni.switchTab({url: "/pages/home/index"});
      return true;
    }
    this.params.dataId = options.id;
    uni.$on('searchKeyword', (keyword) => {
      this.searchKeyword = keyword;
      this.loadHotelList({
        keyword: keyword,
        deductOrderId: this.params.dataId,
        checkIn: this.originCheckInDate,
        checkOut: this.originCheckOutDate,
        nights: this.nightCount,
        bedCount: this.bedCount
      });
    });
    this.initSearchParams()
  },
  onUnload() {
    uni.$off('searchKeyword');
  },
  onShow: function () {
    uni.stopPullDownRefresh();
    try {
      uni.setEnableScroll({
        enable: false
      });
    } catch (e) {
    }
    if (uni.setBackgroundTextStyle) {
      uni.setBackgroundTextStyle({
        textStyle: 'dark'
      });
    }
  },
  watch: {
    showSearchCard(val) {
      if (val) {
        uni.setEnableScroll({
          enable: false
        });
      } else {
        uni.setEnableScroll({
          enable: true
        });
      }
    }
  },
  data() {
    return {
      scrollTimer: null, // 添加滚动防抖定时器
      params: {
        dataId: '',
      },
      type: true,
      longitude: '',
      latitude: '',
      currentCity: '',
      locationMain: '',
      locationSub: '',
      checkInDate: '',
      checkOutDate: '',
      originCheckInDate: '',
      originCheckOutDate: '',
      nightCount: 1,
      bedCount: 1,
      tempCheckInDate: '',
      tempCheckOutDate: '',
      tempNightCount: 0,
      tempBedCount: 0,
      tempBedCount_: 0,
      searchKeyword: '',
      showSearchCard: false,
      showCalendar: false,
      showBedPicker: false,
      showDetailAddress: false,
      currentAddress: '',
      hotels: [],
      sortOptions: [
        {
          name: '低价优先',
          field: "price",
          sort: "ASC"
        },
        {
          name: '高价优先',
          field: "price",
          sort: "DESC"
        },
        {
          name: '距离优先',
          field: "distance",
          sort: "ASC"
        }
      ],
      currentSort: '',
      currentDistrict: '',
      // 分页相关数据
      page: 1,
      pageSize: 5,
      total: 0,
      loading: false,
      noMoreData: false,
      isRequesting: false
    }
  },
  methods: {
    // 内容区域滚动事件处理
    onContentScroll(e) {
      // 防抖处理
      clearTimeout(this.scrollTimer);
      this.scrollTimer = setTimeout(() => {
        this.handleScroll(e.detail);
      }, 100);
    },

    // 处理滚动逻辑
    handleScroll(scrollData) {
      // 不再需要手动处理滚动逻辑，使用 scroll-view 的 scrolltolower 事件
    },

    // 滚动到底部事件处理
    onScrollToLower() {
      if (!this.noMoreData && !this.loading && !this.isRequesting) {
        this.loadMoreHotels();
      }
    },

    formatYMD(date) {
      if (!date) return '';
      if (typeof date === 'string') return date;
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      return `${year}-${month}-${day}`;
    },
    getLocation() {
      uni.getSetting({
        success: (res) => {
          if (!res.authSetting['scope.userLocation']) {
            uni.authorize({
              scope: 'scope.userLocation',
              success: () => {
                this.doGetLocation();
              },
              fail: (err) => {
                console.error('授权失败：', err);
                uni.showModal({
                  title: '提示',
                  content: '需要获取您的位置权限，是否去设置？',
                  success: (modalRes) => {
                    if (modalRes.confirm) {
                      uni.openSetting();
                    }
                  }
                });
              }
            });
          } else {
            this.doGetLocation();
          }
        },
        fail: (err) => {
          console.error('获取设置失败：', err);
        }
      });
    },
    doGetLocation() {
      uni.getLocation({
        type: 'gcj02',
        isHighAccuracy: true,
        success: async (res) => {
          // 使用高德地图逆地理编码服务
          const key = await gaodeKey()
          uni.request({
            url: 'https://restapi.amap.com/v3/geocode/regeo',
            data: {
              key: key,
              location: `${res.longitude},${res.latitude}`,
              extensions: 'all',
              output: 'json'
            },
            success: (result) => {
              if (result.data.status === '1') {
                const addressComponent = result.data.regeocode.addressComponent;
                // 更新城市名称和地址
                this.currentCity = addressComponent.province;
                this.currentDistrict = addressComponent.district || '';
                this.currentAddress = result.data.regeocode.formatted_address;
                // 如果是点击触发的定位，则显示详细地址
                if (this.showDetailAddress) {
                  uni.showToast({
                    title: '位置已更新',
                    icon: 'success'
                  });
                }
              } else {
                uni.showToast({
                  title: '获取地址信息失败',
                  icon: 'none'
                });
              }
            },
            fail: (err) => {
              console.error('逆地理编码失败：', err);
              uni.showToast({
                title: '获取地址信息失败',
                icon: 'none'
              });
            }
          });
        },
        fail: (err) => {
          console.error('获取位置失败：', err);
          uni.showToast({
            title: '获取位置失败：' + err.errMsg,
            icon: 'none'
          });
        }
      });
    },
    async loadHotelList(params) {
      try {
        // 从缓存中取 searchParams
        const storedParams = uni.getStorageSync('searchParams') || {};
        const longitude = storedParams.longitude || '';
        const latitude = storedParams.latitude || '';
        const searchParams = {
          ...params,
          deductOrderId: this.params.dataId,
          city: this.currentCity,
          checkInDate: this.originCheckInDate,
          checkOutDate: this.originCheckOutDate,
          nights: this.nightCount,
          bedCount: this.bedCount,
          longitude,
          latitude,
          page: 1,
          pageSize: this.pageSize
        };
        const res = await fetchHotelListByPage(searchParams);
        this.hotels = res.records || [];
        this.page = res.current || 1;
        this.total = res.total || 0;
        this.noMoreData = this.hotels.length >= this.total;
        // 去掉18点免费标签
        if (this.hotels && Array.isArray(this.hotels)) {
          // 过滤掉"18点前可免费取消"标签
          this.hotels = this.hotels.map(hotel => {
            if (hotel.hotelTags && Array.isArray(hotel.hotelTags)) {
              hotel.hotelTags = hotel.hotelTags.filter(tag => tag.name !== '18点前可免费取消');
            }
            return hotel;
          });
        } else {
          this.hotels = res.records || [];
        }
      } catch (e) {
        uni.showToast({title: '获取酒店列表失败', icon: 'none'});
      }
    },
    async loadMoreHotels() {
      if (this.isRequesting || this.noMoreData) return;
      this.isRequesting = true;
      this.loading = true;
      try {
        const nextPage = this.page + 1;
        const storedParams = uni.getStorageSync('searchParams') || {};
        const longitude = storedParams.longitude || '';
        const latitude = storedParams.latitude || '';

        const searchParams = {
          deductOrderId: this.params.dataId,
          city: this.currentCity,
          checkInDate: this.originCheckInDate,
          checkOutDate: this.originCheckOutDate,
          nights: this.nightCount,
          bedCount: this.bedCount,
          longitude,
          latitude,
          page: nextPage,
          pageSize: this.pageSize
        };

        if (this.currentSort) {
          const [field, sort] = this.currentSort.split('-');
          searchParams.field = field;
          searchParams.sort = sort;
        }
        const res = await fetchHotelListByPage(searchParams);
        if (res && res.records) {
          this.hotels = [...this.hotels, ...res.records];
          this.page = res.current || nextPage;
          this.total = res.total || this.total;
          this.noMoreData = this.hotels.length >= this.total;
        }
      } catch (e) {
        uni.showToast({title: '加载更多失败', icon: 'none'});
      } finally {
        this.loading = false;
        this.isRequesting = false;
      }
    },

    back() {
      pageBack()
    },
    handleSort(item) {
      // 如果点击的是当前已选中的选项，则取消选择
      if (this.currentSort === item.field + "-" + item.sort) {
        this.currentSort = null;
      } else {
        this.currentSort = item.field + "-" + item.sort;
      }
      // 如果是距离优先排序，使用搜索地址的位置信息
      this.loadHotelList({
        "field": this.currentSort ? this.currentSort.split('-')[0] : "",
        "sort": this.currentSort ? this.currentSort.split('-')[1] : "",
      });
    },
    formatDate(dateStr) {
      const date = new Date(dateStr);
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      return `${month}月${day}日`;
    },
    handleLocationClick() {
      // 处理位置点击
      if (!this.currentAddress) {
        this.getLocation();
      }
      this.showDetailAddress = true;
    },
    handleCardSearch() {
      // 更新显示的值
      this.checkInDate = this.formatDate(this.tempCheckInDate);
      this.checkOutDate = this.formatDate(this.tempCheckOutDate);
      this.originCheckInDate = this.tempCheckInDate;
      this.originCheckOutDate = this.tempCheckOutDate;
      this.nightCount = this.tempNightCount;
      this.bedCount = this.tempBedCount;
      // 保存到本地存储
      const searchParams = {
        city: this.currentCity,
        checkIn: this.originCheckInDate,
        checkOut: this.originCheckOutDate,
        nights: this.nightCount,
        bedCount: this.bedCount
      };
      // 保存到本地存储
      uni.setStorageSync('searchParams', searchParams);
      // 关闭搜索卡片
      this.showSearchCard = false;
    },
    // 日期选择改变
    onDateChange(dates) {
      if (dates && dates.detail.length === 3) {
        this.tempCheckInDate = dates.detail[0];
        this.tempCheckOutDate = dates.detail[1];
        this.tempNightCount = dates.detail[2];
      }
    },

    // 床位数选择关闭
    handleBedPickerClose() {
      // 关闭时恢复原值
      this.tempBedCount = this.bedCount;
      this.showBedPicker = false;
    },

    // 床位数确认
    onBedCountConfirm(value) {
      // 只更新临时值，实际值等点击确认按钮时再更新
      this.tempBedCount = value;
      this.tempBedCount_ = value;
      this.bedCount = value;
      this.showBedPicker = false;
    },
    handleSearchClick() {
      uni.navigateTo({
        url: `/pages/subPackages/home/search-result/index?city=${encodeURIComponent(this.currentCity)}&keyword=${encodeURIComponent(this.searchKeyword)}&deductOrderId=${this.params.dataId}`
      });
    },
    refreshLocation() {
      uni.showToast({title: '刷新定位', icon: 'none'});
    },
    initSearchParams() {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);

      // 获取存储的搜索参数
      const storedParams = uni.getStorageSync('searchParams');
      let checkInDate = this.formatYMD(today);
      let checkOutDate = this.formatYMD(tomorrow);

      if (storedParams) {
        let storedCheckIn = new Date(storedParams.checkIn);
        let storedCheckOut = new Date(storedParams.checkOut);
        storedCheckIn.setHours(0, 0, 0, 0);
        storedCheckOut.setHours(0, 0, 0, 0);
        // 如果存储的入住日期在今天之后，则使用存储的入住日期，离店日期为入住日期的后一天
        if (storedCheckIn > today) {
          checkInDate = storedParams.checkIn;
          // 离店日期设置为入住日期的后一天
          const nextDay = new Date(storedCheckIn);
          nextDay.setDate(nextDay.getDate() + 1);
          checkOutDate = this.formatYMD(nextDay);
        } else {
          // 如果存储的入住日期在今天或之前，则使用今天的日期作为入住日期
          checkInDate = this.formatYMD(today);
          checkOutDate = this.formatYMD(tomorrow);
        }
      }
      // 如果有特定参数表示从代金券跳转过来
      if (this.type) {
        // 确保入住日期至少是明天
        const checkIn = new Date(checkInDate);
        checkIn.setHours(0, 0, 0, 0);
        if (checkIn.getTime() <= today.getTime()) {
          checkInDate = this.formatYMD(tomorrow);
          const dayAfterTomorrow = new Date(tomorrow);
          dayAfterTomorrow.setDate(tomorrow.getDate() + 1);
          checkOutDate = this.formatYMD(dayAfterTomorrow);
        }
      }

      // 更新搜索参数
      const searchParams = {
        city: storedParams?.city || this.currentCity,
        district: storedParams?.district || this.currentDistrict,
        longitude: storedParams?.longitude || this.longitude,
        latitude: storedParams?.latitude || this.latitude,
        checkIn: checkInDate,
        checkOut: checkOutDate,
        nights: 1,
        bedCount: 1
      };
      // 更新组件数据
      this.currentCity = searchParams.city;
      this.currentDistrict = searchParams.district;
      this.checkInDate = searchParams.checkIn;
      this.checkOutDate = searchParams.checkOut;
      this.nightCount = 1;
      this.bedCount = searchParams.bedCount;
      this.longitude = searchParams.longitude || '';
      this.latitude = searchParams.latitude || '';
      // 保存到本地存储
      uni.setStorageSync('searchParams', searchParams);
      try {
        if (searchParams) {
          if (searchParams.city) {
            this.currentCity = searchParams.city;
          }
          if (searchParams.district) {
            this.currentDistrict = searchParams.district;
          }
          if (searchParams.checkIn) {
            this.originCheckInDate = searchParams.checkIn;
            this.tempCheckInDate = searchParams.checkIn;
            this.checkInDate = this.formatDate(searchParams.checkIn);
          }
          if (searchParams.checkOut) {
            this.originCheckOutDate = searchParams.checkOut;
            this.tempCheckOutDate = searchParams.checkOut;
            this.checkOutDate = this.formatDate(searchParams.checkOut);
          }
          if (searchParams.nights) {
            this.nightCount = parseInt(searchParams.nights);
            this.tempNightCount = parseInt(searchParams.nights);
          }
          if (searchParams.bedCount) {
            this.bedCount = parseInt(searchParams.bedCount);
            this.tempBedCount = parseInt(searchParams.bedCount);
            this.tempBedCount_ = this.tempBedCount;
          }
        }
        console.log('初始化搜索参数：')
        this.loadHotelList({
          city: this.currentCity
        });
      } catch (e) {
        console.error('读取搜索参数失败：', e);
      }
      // 如果没有城市信息，说明是首次加载，需要获取位置
      if (!this.currentCity) {
        this.getLocation();
      }
      // 移除重复调用 loadHotelList 的逻辑
    },
    goToCitySelect() {
      uni.navigateTo({
        url: `/pages/subPackages/home/city-select/index?deductOrderId=${this.params.dataId}`,
        events: {
          citySelected: (city) => {
            this.currentCity = city.displayName || city.name;
            this.currentDistrict = city.district || '';
            this.longitude = city.longitude || '';
            this.latitude = city.latitude || '';
            // 更新搜索参数
            const searchParams = uni.getStorageSync('searchParams') || {};
            searchParams.city = city.displayName || city.name;
            searchParams.district = city.district || '';
            searchParams.longitude = city.longitude || '';
            searchParams.latitude = city.latitude || '';
            uni.setStorageSync('searchParams', searchParams);
            this.loadHotelList({
              city: searchParams.city
            });
          }
        }
      });
    }
  }
}
</script>

<style scoped>
.container {
  min-height: 100vh;
  height: 100vh;
  background: #F3F4F6;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  position: relative;
}

/* 遮罩层样式 */
.mask {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(25, 25, 26, 0.6);
  backdrop-filter: blur(0px);
  z-index: 999;
}

/* 搜索卡片弹窗样式 */
.search-card-popup {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  z-index: 1001;
  overflow: hidden;
  background-color: #FFF;
}

.filter-tabs {
  display: flex;
  padding: 20rpx 32rpx;
  background: #FFFFFF;
  border-bottom: 2rpx solid #E8E9EB;
  gap: 10rpx;
  align-items: center;
  margin-top: 0;
}

.content-wrapper {
  width: auto;
  flex: 1;
  height: calc(100vh - var(--status-bar-height) - 88rpx - 120rpx - 96rpx - 30rpx);
  padding: 0 28rpx 120rpx 28rpx;
  position: relative;
  margin-top: 0;
}

.content-wrapper.enable-scroll {
  overflow-y: auto !important;
  -webkit-overflow-scrolling: touch;
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

.nav-more {
  font-size: 36rpx;
  color: #19191A;
  padding: 0 20rpx;
}

.search-header {
  background: #FFFFFF;
  padding: 24rpx 28rpx;
  position: relative;
  z-index: 1000;
  margin-bottom: 0;
}

.search-content {
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 64rpx;
  background: #F3F7FA !important;
  border-radius: 46rpx;
  padding: 14rpx 0;
}

.city-section {
  display: flex;
  align-items: center;
  gap: 8rpx;
  padding-left: 32rpx;
  padding-right: 20rpx;
  height: 100%;
  min-width: 56rpx;
  max-width: 112rpx;
}

.city-text {
  font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;
  font-size: 24rpx;
  color: #19191A;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
}

.city-arrow {
  width: 14rpx;
  height: 9rpx;
  background-image: url("https://www.zxd-hotel.xin/zxdhotel/icon/down.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background-position: center;
  flex-shrink: 0;
  margin-left: 4rpx;
  transition: transform 0.3s ease;
}

.city-arrow.arrow-up {
  transform: rotate(180deg);
}

.date-section {
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
  flex: 1;
  padding-left: 20rpx;
  gap: 8rpx;
  position: relative;
}

.date-group {
  display: flex;
  align-items: center;
  line-height: 1;
}

.date-label {
  font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;
  font-weight: 400;
  font-size: 24rpx;
  color: #19191A;
  text-align: left;
  font-style: normal;
}

.date {
  font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;
  font-weight: 500;
  font-size: 24rpx;
  color: #19191A;
  line-height: 1;
  text-align: left;
  font-style: normal;
  margin-left: 12rpx;
  margin-right: 20rpx;
}

.divider {
  width: 2rpx;
  height: 54rpx;
  background: #E8E9EB;
  margin-right: 20rpx;
}

.search-section {
  flex: 1.5;
  height: 100%;
  display: flex;
  align-items: center;
}

.search-bar {
  display: flex;
  align-items: center;
  width: 100%;
  opacity: 0.6;
}

.search-icon {
  width: 34rpx;
  height: 34rpx;
  margin-right: 12rpx;
}

.search-input {
  flex: 1;
  font-size: 28rpx;
  color: #19191A !important;
  background: transparent !important;
  white-space: nowrap;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  margin-right: 12rpx;
}

.sort-text {
  width: auto;
  font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;
  font-size: 28rpx;
  color: #19191A;
  font-weight: 400;
  margin-right: 24rpx;
}

.sort-option {
  width: auto;
  height: 56rpx;
  background: #F3F7FA;
  border-radius: 8rpx;
  padding: 0 22rpx;
  font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;
  font-weight: 400;
  font-size: 24rpx;
  color: #19191A;
  line-height: 56rpx;
  text-align: center;
  font-style: normal;
  position: relative;
}

.check-icon {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 24rpx;
  height: 24rpx;
  z-index: 2;
}


/* 添加日历页面样式 */
.calendar-page {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1002;
  background-color: #fff;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  transform: translateY(100%);
  transition: transform 0.3s ease-out;
}

.calendar-page.show {
  transform: translateY(0);
}
</style> 