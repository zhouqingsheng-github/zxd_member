<template>
  <view class="container">
    <uni-nav-bar
        backgroundColor="#FFFFFF"
        :fixed="false"
        :shadow="false"
        :border="false"
        status-bar
        left-icon="left"
        @clickLeft="back"
        style="z-index: 100;"
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
        <view class="date-section" @click="()=>{showSearchCard = !showSearchCard;showPopup = false;}">
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
          :iChoseEarlyMorning="tempIChoseEarlyMorning"
          :showZeroToSixPrompt="tempShowZeroToSixPrompt"
          :cutoffTime="cutoffTime"
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
    <!-- 新的下拉菜单区域 -->
    <view class="filter-tabs-wrapper">
      <view class="filter-tabs">
        <view class="dropdown-group">
          <view class="dropdown-btn" @click="toggleSortPopup">
            <text class="dropdown-text" :class="{ 'select-text': showPopup && currentPopupType === 'sort'}">排序</text>
            <text class="arrow"
                  :class="{ 'up': showPopup && currentPopupType === 'sort','select-up': showPopup && currentPopupType === 'sort' }"/>
          </view>
        </view>
        <view class="dropdown-group">
          <view class="dropdown-btn" @click="toggleFilterPopup">
            <text class="dropdown-text" :class="{ 'select-text': showPopup && currentPopupType === 'filter'}">筛选
            </text>
            <text class="arrow"
                  :class="{ 'up': showPopup && currentPopupType === 'filter','select-up': showPopup && currentPopupType === 'filter' }"/>
          </view>
        </view>
      </view>

      <!-- 弹窗容器 -->
      <view class="popup-container" v-show="showPopup">
        <!-- 统一弹窗 -->
        <view class="custom-popup" @click="showPopup = false">
          <view class="popup-content" @click.stop>
            <!-- 排序内容 -->
            <block v-if="currentPopupType === 'sort'">
              <view v-for="(item, index) in sortOptions"
                    :key="index">
                <view class="popup-item">
                  <text class="popup-text">{{ item.name }}</text>
                  <view class="coupon-radio">
                    <image
                        @click="handleSortChange(item)"
                        :src="currentSort === (item.field + '-' + item.sort) ? '/static/base/radio_checked_da.png' : '/static/base/radio_unchecked_da.png'"
                        class="custom-radio"
                        mode="aspectFit"
                        @click.stop=""
                    />
                  </view>
                </view>
                <view class="popup-item-line" v-if="index !== (sortOptions.length-1)"/>
              </view>
            </block>

            <!-- 筛选内容 -->
            <block v-if="currentPopupType === 'filter'">
              <view
                  v-for="(item, index) in filterOptions"
                  :key="index"
              >
                <view class="popup-item">
                  <view class="popup-item-l">
                    <text class="popup-text">{{ item.name }}</text>
                    <image v-if="item.searchIcon" :src="item.searchIcon" class="popup-item-icon" mode="aspectFit"/>
                  </view>
                  <view class="coupon-radio">
                    <image
                        @click="handleFilterToggle(item)"
                        :src="currentFilter===item.id ? '/static/base/radio_checked_da.png' : '/static/base/radio_unchecked_da.png'"
                        class="custom-radio"
                        mode="aspectFit"
                        @click.stop=""
                    />
                  </view>
                </view>
                <view class="popup-item-line" v-if="index !== (filterOptions.length-1)"/>
              </view>
            </block>
          </view>
        </view>
      </view>
    </view>

    <scroll-view
        class="content-wrapper"
        :class="{'enable-scroll': !showSearchCard}"
        @scroll="onContentScroll"
        @scrolltolower="onScrollToLower"
        :scroll-y="!showPopup || !showSearchCard"
        ref="hotelListContainer"
    >
      <!-- 遮罩层 -->
      <view v-if="showPopup || showSearchCard" class="content-mask" @click="showPopup = false;showSearchCard=false">
        <view class="mask-overlay"></view>
      </view>
      <view style="padding: 0 28rpx 120rpx 28rpx">
        <EmptyState
            v-if="!hotels.length && !loading"
            text="未找到符合条件的酒店"
            image="/static/base/placeholderMap.png"
        />
        <HotelList
            v-else
            :hotels="hotels"
            :loading="loading"
            :noMoreData="noMoreData"
        />
      </view>
    </scroll-view>

    <!-- 日期选择器 -->
    <HotelCalendar
        v-if="showCalendar"
        @change="onDateChange"
        @close="showCalendar = false"
        :value="[tempCheckInDate, tempCheckOutDate]"
        :class="['calendar-page', showCalendar ? 'show' : '']"
        :cutoffTime="cutoffTime"
    />

    <!-- 床位数选择器 -->
    <BedCountPicker
        v-if="showBedPicker"
        :value="tempBedCount_"
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
import {fetchHotelListByPage, gaodeKey,getCutoffTime} from "@/common/api.js";
import {pageBack} from "../../../../common/redirect";
import UPopup from "../../../../uni_modules/uview-ui/components/u-popup/u-popup.vue";

const {http} = uni.$u

export default {
  components: {UPopup, HotelList, SearchCard, HotelCalendar, BedCountPicker, EmptyState},
  onPullDownRefresh() {
    uni.stopPullDownRefresh(); // 立即停止下拉刷新
  },
  onReachBottom() {
    if (!this.noMoreData && !this.loading) {
      this.loadMoreHotels();
    }
  },
  async onLoad(options) {
    uni.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#FFFFFF'
    });
    this.cutoffTime = await getCutoffTime();
    if (options.tagId) {
      this.currentFilter = Number(options.tagId);
    }
    const [hours] = this.cutoffTime.split(':').map(Number);
    this.hour = Number(hours);
    this.checkTimeForPrompt();
    this.timeInterval = setInterval(() => {
      this.checkTimeForPrompt();
    }, 60000); // 每分钟检查一次
    try {
      const searchParams = uni.getStorageSync('searchParams');
      if (searchParams) {
        // 判断当前是否在凌晨时段
        const now = new Date();
        const currentHour = now.getHours();
        const isCurrentlyEarlyMorning = currentHour >= 0 && currentHour < this.hour;
        
        // 如果之前选择了凌晨，但现在已经不是凌晨时段了，需要重置
        if (searchParams.iChoseEarlyMorning && !isCurrentlyEarlyMorning) {
          // 检查日期是否过期
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const storedCheckIn = new Date(searchParams.checkIn);
          storedCheckIn.setHours(0, 0, 0, 0);
          const yesterday = new Date(today);
          yesterday.setDate(today.getDate() - 1);
          
          // 如果入住日期不是昨天，说明已经过期，需要重置
          if (storedCheckIn.getTime() !== yesterday.getTime()) {
            this.iChoseEarlyMorning = false;
            this.tempIChoseEarlyMorning = false;
            searchParams.iChoseEarlyMorning = false;
            uni.setStorageSync('searchParams', searchParams);
          } else {
            this.iChoseEarlyMorning = searchParams.iChoseEarlyMorning;
            this.tempIChoseEarlyMorning = searchParams.iChoseEarlyMorning;
          }
        } else {
          this.iChoseEarlyMorning = searchParams.iChoseEarlyMorning;
          this.tempIChoseEarlyMorning = searchParams.iChoseEarlyMorning;
        }
        
        this.showZeroToSixPrompt = searchParams.showZeroToSixPrompt;
        this.tempShowZeroToSixPrompt = searchParams.showZeroToSixPrompt;
        
        if (searchParams.city) {
          this.currentCity = searchParams.city;
        }
        if (searchParams.district) {
          this.currentDistrict = searchParams.district;
        }
        if (searchParams.checkIn) {
          this.originCheckInDate = searchParams.checkIn;
          this.tempCheckInDate = searchParams.checkIn;
          this.checkInDate = this.formatDateIn(searchParams.checkIn);
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
      this.loadHotelList({
        city: this.currentCity,
        field: this.currentSort ? this.currentSort.split('-')[0] : "",
        sort: this.currentSort ? this.currentSort.split('-')[1] : "",
        tagId: this.currentFilter
      });
      // 查询过滤标签
      this.fetchFilterTags();
    } catch (e) {
      console.error('读取搜索参数失败：', e);
    }
    uni.$on('searchKeyword', (keyword) => {
      this.searchKeyword = keyword;
      this.loadHotelList({
        keyword: keyword,
        checkIn: this.originCheckInDate,
        checkOut: this.originCheckOutDate,
        nights: this.nightCount,
        bedCount: this.bedCount
      });
    });
  },
  onUnload() {
    uni.$off('searchKeyword');
  },
  onShow() {
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
      timeInterval: null,
      hour: 6,
      cutoffTime: '06:00',
      showPopup: false,
      currentPopupType: 'sort', // 'sort' 或 'filter'
      scrollTimer: null, // 添加滚动防抖定时器
      longitude: '',
      latitude: '',
      currentCity: '北京',
      locationMain: '合生汇购物中心',
      locationSub: '朝阳区九龙山西路合生汇购物中心平乐园地铁站...',
      checkInDate: '',
      checkOutDate: '',
      originCheckInDate: '',
      originCheckOutDate: '',
      nightCount: 0,
      bedCount: 0,
      tempCheckInDate: '',
      tempCheckOutDate: '',
      tempNightCount: 0,
      tempBedCount: 0,
      tempBedCount_: 0,
      tempShowZeroToSixPrompt: false, // 决定着是否提示凌晨了
      tempIChoseEarlyMorning: false,//决定了用户是否选择了凌晨如果选择了 则需要在显示上进行加1
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
      filterOptions: [],
      currentSort: '',
      currentFilter: '',
      currentDistrict: '',
      // 分页相关数据
      page: 1,
      pageSize: 5,
      total: 0,
      loading: false,
      noMoreData: false,
      isRequesting: false,
      showZeroToSixPrompt: false, // 决定着是否提示凌晨了
      iChoseEarlyMorning: false,//决定了用户是否选择了凌晨如果选择了 则需要在显示上进行加1
    }
  },
  beforeDestroy() {
    // 清除定时器
    if (this.timeInterval) {
      clearInterval(this.timeInterval);
      this.timeInterval = null;
    }
  },
  methods: {
    checkTimeForPrompt() {
      const now = new Date();
      this.currentHour = now.getHours();
      this.showZeroToSixPrompt = (this.currentHour >= 0 && this.currentHour < this.hour);
      const storedParams = uni.getStorageSync('searchParams');
      storedParams.showZeroToSixPrompt = this.showZeroToSixPrompt;
      uni.setStorageSync('searchParams', storedParams);
    },
    // 切换排序弹窗
    toggleSortPopup() {
      if (this.showPopup && this.currentPopupType === 'sort') {
        this.showPopup = false;
      } else {
        this.currentPopupType = 'sort';
        this.showPopup = true;
      }
    },

    // 切换筛选弹窗
    toggleFilterPopup() {
      if (this.showPopup && this.currentPopupType === 'filter') {
        this.showPopup = false;
      } else {
        this.currentPopupType = 'filter';
        this.showPopup = true;
      }
    },

    // 处理排序选择
    handleSortChange(item) {
      if (this.currentSort === item.field + '-' + item.sort) {
        this.currentSort = null; // 取消选择
      } else {
        this.currentSort = item.field + '-' + item.sort;
      }

      // 执行排序
      this.loadHotelList({
        field: this.currentSort ? this.currentSort.split('-')[0] : "",
        sort: this.currentSort ? this.currentSort.split('-')[1] : "",
        tagId: this.currentFilter
      });

      // 关闭弹窗
      this.showPopup = false;
    },

    // 处理筛选项切换
    handleFilterToggle(item) {
      if (this.currentFilter === item.id) {
        this.currentFilter = null; // 取消选择
      } else {
        this.currentFilter = item.id;
      }
      // 可以在这里添加筛选逻辑
      console.log('筛选项切换:', item);
      this.loadHotelList({
        field: this.currentSort ? this.currentSort.split('-')[0] : "",
        sort: this.currentSort ? this.currentSort.split('-')[1] : "",
        tagId: this.currentFilter
      });
      // 关闭弹窗
      this.showPopup = false;
    },

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
    fetchFilterTags() {
      http.get('/hotel-stores/hotel-tags/used')
          .then(res => {
            this.filterOptions = res;
          })
          .catch(err => {
          })
    },
    async loadHotelList(params) {
      if (this.isRequesting) return;
      this.isRequesting = true;
      this.loading = true;
      try {
        // 从缓存中取 searchParams
        const storedParams = uni.getStorageSync('searchParams') || {};
        const longitude = storedParams.longitude || '';
        const latitude = storedParams.latitude || '';
        const searchParams = {
          ...params,
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

        if (this.currentSort) {
          const [field, sort] = this.currentSort.split('-');
          searchParams.field = field;
          searchParams.sort = sort;
        }

        const res = await fetchHotelListByPage(searchParams);
        this.hotels = res.records || [];
        this.page = res.current || 1;
        this.total = res.total || 0;
        this.noMoreData = this.hotels.length >= this.total;
      } catch (e) {
        uni.showToast({title: '获取酒店列表失败', icon: 'none'});
      } finally {
        this.loading = false;
        this.isRequesting = false;
      }
    },
    // 加载更多酒店数据
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
          city: this.currentCity,
          checkInDate: this.originCheckInDate,
          checkOutDate: this.originCheckOutDate,
          nights: this.nightCount,
          bedCount: this.bedCount,
          longitude,
          latitude,
          page: nextPage,
          pageSize: this.pageSize,
          tagId: this.currentFilter
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
    formatDateIn(dateStr) {
      const date = new Date(dateStr);
      // 如果用户选择了凌晨时段，我们需要正确地增加一天
      if (this.iChoseEarlyMorning) {
        date.setDate(date.getDate() + 1);
      }
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      return `${month}月${day}日`;
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
      this.showZeroToSixPrompt = this.tempShowZeroToSixPrompt;
      this.iChoseEarlyMorning = this.tempIChoseEarlyMorning;
      this.checkInDate = this.formatDateIn(this.tempCheckInDate);
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
        bedCount: this.bedCount,
        showZeroToSixPrompt: this.tempShowZeroToSixPrompt,
        iChoseEarlyMorning: this.tempIChoseEarlyMorning
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
        this.tempShowZeroToSixPrompt = dates.showZeroToSixPrompt
        this.tempIChoseEarlyMorning = dates.iChoseEarlyMorning
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
      this.showPopup = false;
      uni.navigateTo({
        url: `/pages/subPackages/home/search-result/index?city=${encodeURIComponent(this.currentCity)}&keyword=${encodeURIComponent(this.searchKeyword)}`
      });
    },
    refreshLocation() {
      uni.showToast({title: '刷新定位', icon: 'none'});
    },
    goToCitySelect() {
      this.showPopup = false;
      uni.navigateTo({
        url: '/pages/subPackages/home/city-select/index',
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

.filter-tabs-wrapper {
  width: 100%;
  position: relative;
  background: white;
  z-index: 100;
}

.filter-tabs {
  display: flex;
  padding: 28rpx 160rpx 28rpx 160rpx;
  gap: 50%;
  align-items: center;
  margin-top: 0;
  background: white;
}

.popup-container {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  height: 400rpx;
  overflow: hidden;
  z-index: 100;
}

.custom-popup {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  background: white;
  z-index: 101;
  animation: slideDown 0.2s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10rpx);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.content-wrapper {
  width: auto;
  flex: 1;
  height: calc(100vh - var(--status-bar-height) - 88rpx - 120rpx - 96rpx - 30rpx);
  padding: 0;
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

.select-text {
  color: #EE781F !important;
}

.select-up {
  background-image: url("https://www.zxd-hotel.xin/zxdhotel/icon/select-down.png") !important;
}

.arrow {
  width: 14rpx;
  height: 9rpx;
  background-image: url("https://www.zxd-hotel.xin/zxdhotel/icon/down.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background-position: center;
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

.date-arrow {
  width: 14rpx;
  height: 9rpx;
  background-image: url("https://www.zxd-hotel.xin/zxdhotel/icon/down.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background-position: center;
  position: absolute;
  right: 20rpx;
  top: 50%;
  transform: translateY(-50%);
  transition: transform 0.3s ease;
}

.date-arrow.arrow-up {
  transform: translateY(-50%) rotate(180deg);
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

.dropdown-btn {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 56rpx;
  font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;
  font-weight: 400;
  font-size: 28rpx;
  color: #19191A;
  line-height: 28rpx;
  text-align: center;
  font-style: normal;
}

.arrow {
  margin-left: 10rpx;
  font-size: 24rpx;
  transition: transform 0.3s ease;
}

.arrow.up {
  transform: rotate(180deg);
}

.content-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 99;
}

.mask-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(25, 25, 26, 0.7);
}

.popup-content {
  max-height: 400rpx;
  overflow-y: auto;
  z-index: 102;
  background: white;
  margin-top: 20rpx;
}

.popup-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  height: 100rpx;
  margin: 0 28rpx;
}

.popup-item-l {
  display: flex;
}

.popup-item-icon {
  width: 26rpx;
  height: 28rpx;
  margin-left: 10rpx;
}

.popup-item-line {
  width: 100%;
  height: 2rpx;
  background: #E8E9EB;
}

.popup-text {
  font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;
  font-size: 28rpx;
  color: #19191A;
  line-height: 1;
}

.coupon-radio {
  margin-right: 18rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.custom-radio {
  width: 36rpx;
  height: 36rpx;
}
</style>