<!--suppress JSUnresolvedReference -->
<template>
  <view class="container">
    <HotelCalendar
        v-if="showCalendar"
        @change="onDateChange"
        @close="showCalendar = false"
        :value="[checkInDate, checkOutDate]"
        :cutoffTime="cutoffTime"
        :class="['calendar-page', showCalendar ? 'show' : '']"
    />
    <BedCountPicker
        v-if="showBedPicker"
        :value="tempBedCount"
        @input="tempBedCount = $event"
        @close="handleBedPickerClose"
        @confirm="onBedCountConfirm"/>
    <!-- 添加弹窗广告 -->
    <view v-if="showPopupAd" class="popup-ad-mask" @touchmove.stop.prevent>
      <view class="popup-ad-container">
        <image
            class="popup-ad-image"
            :src="popupAdData.posterUrl"
            mode="aspectFit"
            @click="handlePopupAdClick"
        />
        <view class="popup-ad-close" @click="closePopupAd">
          <u-icon name="close" color="#fff" size="24"></u-icon>
        </view>
        <view v-if="popupAdData.buttonName" class="popup-ad-btn" @click="goToBusiness">{{
            popupAdData.buttonName
          }}
        </view>
      </view>
    </view>
    <view :class="{'page-hidden': showCalendar,'page-visible': !showCalendar}">
      <uni-nav-bar
          :backgroundColor="navBarBgColor"
          :fixed="true"
          :shadow="false"
          :border="false"
          status-bar
      >
        <template #default>
          <text :style="{color: navBarTitleColor}" class="custom-navbar-title">住小叮</text>
        </template>
      </uni-nav-bar>
      <view class="home-banner">
        <!-- 顶部背景图区域 -->
        <u-swiper
            v-if="advertisingCarousel.length > 0"
            class="banner-swiper"
            :list="advertisingCarousel"
            :autoplay="true"
            :showTitle="true"
            :circular="true"
            :interval="5000"
            :duration="500"
            :height="694"
            :radius="0"
            indicatorMode="dot"
            imgMode="widthFix"
            keyName="imageUrl"
            @click="handleSwiperClick"
        >
        </u-swiper>
      </view>
      <view class="main-content">
        <!-- 搜索卡片 -->
        <SearchCard
            v-if="showCard"
            :currentCity="currentCity"
            :currentDistrict="currentDistrict"
            :currentAddress="currentAddress"
            :showDetailAddress="showDetailAddress"
            :checkInDate="checkInDate"
            :checkOutDate="checkOutDate"
            :nightCount="nightCount"
            :bedCount="bedCount"
            :iChoseEarlyMorning="iChoseEarlyMorning"
            :showZeroToSixPrompt="showZeroToSixPrompt"
            :cutoffTime="cutoffTime"
            :rounded="true"
            :filterOptions="filterOptions"
            @locationClick="handleLocationClick"
            @dateClick="showCalendar = true"
            @bedClick="showBedPicker = true"
            @search="handleSearch"
            @jumpPage="jumpPage"
            @cityClick="goToCitySelect"
        />
        <!-- 城市选择器弹窗已移除 -->
        <view v-if="showNoHotelTip">
          <EmptyState
              v-if="showNoHotelTip"
              text="当前城市暂无酒店，试试搜索其他区域"
              image="/static/base/placeholderMap.png"
          />
          <view class="other-tinkerbells">
            <view class="other-tinkerbells-l"></view>
            <view class="other-tinkerbells-c">其他城市住小叮</view>
            <view class="other-tinkerbells-r"></view>
          </view>
        </view>
        <!-- 酒店列表 -->
        <view v-if="!hotels.length && !loading" class="empty-container">
          <view class="empty-state">
            <image class="empty-icon" src="/static/base/placeholderMap.png" mode="aspectFit"/>
          </view>
          <view class="empty-text">附近暂无酒店，试试搜索其他区域</view>
        </view>
        <HotelList
            v-else
            :hotels="hotels"
            :loading="loading"
            :noMoreData="noMoreData"
        />
      </view>
      <DraggableFloatingButton v-if="showRedEnvelope"
                               :buttonImage="'https://www.zxd-hotel.xin/zxdhotel/icon/levitate2.gif'"
                               :targetPage="'/pages/subPackages/coupon/receiving-center'"
      />
      <CustomTabbar
          :current="'home'"
          v-if="!showBedPicker"
          :showBackToTop="showBackToTop"
          @backToTop="scrollToTop"
      />
    </view>
  </view>
</template>

<script>
import CustomTabbar from "@/components/CustomTabbar.vue";
import HotelCalendar from "@/components/HotelCalendar.vue";
import BedCountPicker from "@/components/BedCountPicker.vue";
import HotelList from "@/components/HotelList.vue";
import SearchCard from "@/components/SearchCard.vue";
import DraggableFloatingButton from "@/components/DraggableFloatingButton.vue";
import {
  channelRecordVisit,
  fetchHotelListByPage,
  getAdvertisingDecoration,
  getCutoffTime,
  getPopupDecoration,
  receiveRedEnvelope,
  receivingCenter
} from '@/common/api.js';
import CityPicker from "../../components/CityPicker.vue";
import {getLocation} from '@/utils/location.js';
import UIcon from "../../uni_modules/uview-ui/components/u-icon/u-icon.vue";
import USwiper from "../../uni_modules/uview-ui/components/u-swiper/u-swiper.vue";
import UButton from "../../uni_modules/uview-ui/components/u-button/u-button.vue";
import {checkLogin} from "../../store";
import UniNavBar from "../../uni_modules/uni-nav-bar/components/uni-nav-bar/uni-nav-bar.vue";
import EmptyState from "../../components/EmptyState.vue";

const {http} = uni.$u
export default {
  components: {
    EmptyState,
    UniNavBar,
    UButton,
    USwiper,
    UIcon,
    CityPicker,
    CustomTabbar,
    HotelCalendar,
    BedCountPicker,
    HotelList,
    SearchCard,
    DraggableFloatingButton
  },
  data() {
    return {
      showCard: false,
      filterOptions: [],
      showZeroToSixPrompt: false, // 决定着是否提示凌晨了
      iChoseEarlyMorning: false,//决定了用户是否选择了凌晨如果选择了 则需要在显示上进行加1
      showRedEnvelope: false,
      cutoffTime: '06:00',
      navBarBgColor: 'transparent',
      navBarTitleColor: '#fff',
      currentCity: '',
      currentDistrict: '',
      currentAddress: '',
      showDetailAddress: false,
      hotels: [],
      showNoHotelTip: false,
      showCalendar: false,
      checkInDate: this.formatYMD(new Date()),
      checkOutDate: this.formatYMD(new Date(new Date().setDate(new Date().getDate() + 1))),
      nightCount: 1,
      showBedPicker: false,
      showCityPicker: false,
      bedCount: 1,
      tempBedCount: 1,
      isRefreshing: false,
      showBackToTop: false,
      longitude: '',
      latitude: '',
      advertisingCarousel: [],
      showPopupAd: false,
      popupAdData: {},
      // 分页相关数据
      page: 1,
      pageSize: 5,
      total: 0,
      loading: false,
      noMoreData: false,
      isRequesting: false,
      timeInterval: null, // 定时器
      hour: 6,
    }
  },
  computed: {},
  async onLoad(options) {
    this.cutoffTime = await getCutoffTime();
    this.showCard = true;
    if (options.scene) {
      this.recordVisit(options.scene);
    }
    try {
      await this.getLocation();
      uni.setNavigationBarColor({
        frontColor: '#ffffff',
        backgroundColor: 'transparent'
      });
    } catch (e) {
    }
    this.tempBedCount = this.bedCount;
    const [hours] = this.cutoffTime.split(':').map(Number);
    this.hour = Number(hours);
    this.fetchFilterTags()
    this.checkTimeForPrompt();
    this.timeInterval = setInterval(() => {
      this.checkTimeForPrompt();
    }, 60000); // 每分钟检查一次
  },
  onShow() {
    uni.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: 'transparent'
    });
    this.initSearchParams();
    this.loadAdsCarousel();
    this.checkPopupAd();
    this.haveYouReceivedAnyCoupons();
  },
  onPageScroll(e) {
    //滚动时切换导航栏背景色
    if (e.scrollTop > 0) {
      // 滚动时设为白色背景
      this.navBarBgColor = '#ffffff';
      this.navBarTitleColor = '#222222';
      uni.setNavigationBarColor({
        frontColor: '#000000',
        backgroundColor: '#ffffff'
      });
    } else {
      // 顶部时设为透明背景
      this.navBarBgColor = 'transparent';
      this.navBarTitleColor = '#ffffff';
      uni.setNavigationBarColor({
        frontColor: '#ffffff',
        backgroundColor: 'transparent'
      });
    }

    this.showBackToTop = e.scrollTop > 300;

    // 通知悬浮按钮组件页面滚动
    uni.$emit('pageScroll');
  },
  // 上拉触底加载更多
  onReachBottom() {
    if (!this.noMoreData && !this.loading) {
      this.loadMoreHotels();
    }
  },
  onPullDownRefresh() {
    // 设置刷新状态
    this.isRefreshing = true;
    // 重新加载酒店列表
    this.loadAdsCarousel();
    this.loadHotelList({
      city: this.currentCity,
      district: this.currentDistrict,
      checkIn: this.checkInDate,
      checkOut: this.checkOutDate,
      nights: this.nightCount,
      bedCount: this.bedCount
    }).finally(() => {
      // 停止下拉刷新动画
      uni.stopPullDownRefresh();
      this.isRefreshing = false;
    });
  },
  beforeDestroy() {
    // 清除定时器
    if (this.timeInterval) {
      clearInterval(this.timeInterval);
      this.timeInterval = null;
    }
  },
  methods: {
    async cutoffTimeFun() {
      return await getCutoffTime();
    },
    fetchFilterTags() {
      http.get('/hotel-stores/hotel-tags/used')
          .then(res => {
            this.filterOptions = res;
          })
          .catch(err => {
          })
    },
    checkTimeForPrompt() {
      const now = new Date();
      this.currentHour = now.getHours();
      this.showZeroToSixPrompt = (this.currentHour >= 0 && this.currentHour < this.hour);
      const storedParams = uni.getStorageSync('searchParams');
      storedParams.showZeroToSixPrompt = this.showZeroToSixPrompt;
      uni.setStorageSync('searchParams', storedParams);
    },
    recordVisit(channelId) {
      // 在 App.vue 或页面onLoad 调用
      uni.login({
        provider: 'weixin',
        success: async (loginRes) => {
          console.log('获取到的code:', loginRes.code);
          const res = await uni.$u.http.post('/hotel-auth/wx/openId', {
            code: loginRes.code
          });
          channelRecordVisit(channelId, {openId: res});
        },
        fail: (err) => {
          console.error('uni.login 失败:', err);
        }
      });
    },
    // 添加检查弹窗广告的方法（一天弹一次）
    async checkPopupAd() {
      const today = new Date().toDateString();
      const lastShownDate = uni.getStorageSync('popupAdLastShown');
      // 如果今天还没有显示过弹窗，则显示
      if (lastShownDate !== today) {
        const data = await getPopupDecoration();
        //实现连续弹窗逻辑：关闭当前弹窗后显示下一个
        if (data && data.length > 0) {
          // 存储所有弹窗数据
          this.popupAdData = data[0];
          this.showPopupAd = true;
          // 记录今天已显示
          uni.setStorageSync('popupAdLastShown', today);
          // 如果有多个弹窗，存储剩余的弹窗数据
          if (data.length > 1) {
            uni.setStorageSync('remainingPopupAds', data.slice(1));
          }
        }
      }
    },
    // 处理弹窗广告点击事件
    handlePopupAdClick() {
      this.goToBusiness();
    },
    // 关闭弹窗广告
    closePopupAd() {
      this.showPopupAd = false;
      // 检查是否还有其他弹窗需要显示
      const remainingAds = uni.getStorageSync('remainingPopupAds');
      if (remainingAds && remainingAds.length > 0) {
        // 取出下一个弹窗数据
        const nextAd = remainingAds[0];
        // 更新剩余弹窗数据
        const newRemainingAds = remainingAds.slice(1);
        // 延迟显示下一个弹窗
        setTimeout(() => {
          this.popupAdData = nextAd;
          this.showPopupAd = true;
          // 更新存储的剩余弹窗数据
          if (newRemainingAds.length > 0) {
            uni.setStorageSync('remainingPopupAds', newRemainingAds);
          } else {
            uni.removeStorageSync('remainingPopupAds');
          }
        }, 300);
      }
    },
    // 弹窗跳转
    async goToBusiness() {
      const parse = JSON.parse(this.popupAdData.renovationData);
      switch (parse.type) {
        case 1: // 红包领取
          if (!checkLogin()) {
            await uni.navigateTo({
              url: '/pages/subPackages/user/login'
            });
            return;
          }
          try {
            const result = await receiveRedEnvelope(parse.redPackId)
            uni.showToast({
              title: '领取成功',
              icon: 'success'
            });
            this.closePopupAd()
          } catch (error) {
            uni.showToast({
              title: error.error,
              icon: 'none',
              duration: 1500
            });
          } finally {
          }
          break;
        case 2: //跳转的红包领取中心页面
          const pageId = parse.pageId;
          await uni.navigateTo({
            url: pageId
          });
          this.closePopupAd();
          break;
      }
    },
    async loadAdsCarousel() {
      try {
        this.advertisingCarousel = await getAdvertisingDecoration()
      } catch (error) {
        console.error('获取广告轮播图失败:', error);
      }
    },
    // 添加轮播图点击事件处理函数
    handleSwiperClick(index) {
      // 使用计算属性中的数据
      const item = this.advertisingCarousel[index];
      // 根据 eventType 处理不同的点击事件
      if (item.eventType !== -1) {
        if (item.eventType === 0) {
          uni.navigateTo({
            url: '/pages/subPackages/richText/richText?id=' + item.id + '&title=' + item.columnName,
          });
        }
        // 可以根据 linkUrl 是否存在来判断是否需要跳转到链接页面
        if (item.eventType === 1) {
          // 跳转到酒店详细
          const adData = JSON.parse(item.adData)
          uni.navigateTo({
            url: '/pages/subPackages/home/detail?id=' + adData.id,
          });
        }
        if (item.eventType === 3) {
          uni.navigateTo({
            url: item.linkUrl
          });
        }
        if (item.eventType === 2 && item.linkUrl) {
          //外部链接
          // #ifdef H5
          window.open(item.url, '_blank');
          // #endif
          // #ifdef MP-WEIXIN
          wx.navigateTo({
            url: `/pages/webview/webview?url=${encodeURIComponent(item.linkUrl)}`
          });
          // #endif
        }
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
    formatDate(dateStr) {
      if (!dateStr) return '';
      const date = new Date(dateStr);
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      return `${month}月${day}日`;
    },
    onDateChange(dates) {
      if (dates && dates.detail && dates.detail.length === 3) {
        this.showZeroToSixPrompt = dates.showZeroToSixPrompt;
        this.iChoseEarlyMorning = dates.iChoseEarlyMorning;
        const [startDate, endDate, nights] = dates.detail;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const checkInDate = new Date(startDate);
        checkInDate.setHours(0, 0, 0, 0);
        //判断是否在凌晨1点前，允许选择前一天
        const now = new Date();
        const cutoff = new Date();
        const [cutoffHour, cutoffMinute] = this.cutoffTime.split(':').map(Number);
        cutoff.setHours(cutoffHour, cutoffMinute, 0, 0);
        //如果当前时间在截止时间前，允许选择前一天
        let actualToday = new Date(today);
        if (now < cutoff) {
          actualToday.setDate(today.getDate() - 1);
        }
        // 如果选择的入住日期在允许的最早日期之前，则使用允许的最早日期
        if (checkInDate < actualToday) {
          this.checkInDate = this.formatYMD(actualToday);
          const newEndDate = new Date(actualToday);
          newEndDate.setDate(actualToday.getDate() + nights);
          this.checkOutDate = this.formatYMD(newEndDate);
        } else {
          this.checkInDate = startDate;
          this.checkOutDate = endDate;
        }
        this.nightCount = nights;
        // 保存到本地存储
        const searchParams = {
          city: this.currentCity,
          district: this.currentDistrict,
          longitude: this.longitude,
          latitude: this.latitude,
          checkIn: this.checkInDate,
          checkOut: this.checkOutDate,
          nights: this.nightCount,
          bedCount: this.bedCount,
          showZeroToSixPrompt: this.showZeroToSixPrompt,
          iChoseEarlyMorning: this.iChoseEarlyMorning,
        };
        uni.setStorageSync('searchParams', searchParams);
        // 重新加载酒店列表
        this.loadHotelList(searchParams);
      }
    },
    async getLocation() {
      try {
        const locationInfo = await getLocation();
        this.currentCity = locationInfo.city;
        this.currentDistrict = locationInfo.district;
        this.currentAddress = locationInfo.address;
        this.longitude = locationInfo.longitude;
        this.latitude = locationInfo.latitude;
        const oldSearchParams = uni.getStorageSync('searchParams');

        // 验证凌晨时间是否仍然有效
        const now = new Date();
        const currentHour = now.getHours();
        const isCurrentlyEarlyMorning = currentHour >= 0 && currentHour < this.hour;
        if (oldSearchParams.iChoseEarlyMorning && !isCurrentlyEarlyMorning) {
          this.iChoseEarlyMorning = false;
        } else {
          this.iChoseEarlyMorning = oldSearchParams.iChoseEarlyMorning;
        }
        this.showZeroToSixPrompt = oldSearchParams.showZeroToSixPrompt;

        // 更新搜索参数并保存
        const searchParams = {
          city: this.currentCity,
          district: this.currentDistrict,
          longitude: this.longitude,
          latitude: this.latitude,
          checkIn: this.checkInDate,
          checkOut: this.checkOutDate,
          nights: this.nightCount,
          bedCount: this.bedCount,
          showZeroToSixPrompt: this.showZeroToSixPrompt,
          iChoseEarlyMorning: this.iChoseEarlyMorning,
        }
        uni.setStorageSync('searchParams', searchParams);
        //只在获取位置成功后加载酒店列表
        await this.loadHotelList(searchParams);
      } catch (err) {
        console.error('获取位置失败：', err);
        uni.showToast({
          title: '获取位置失败',
          icon: 'none'
        });
      }
    },
    // 处理点击"我的位置"
    handleLocationClick() {
      this.showDetailAddress = true; // 切换显示状态
      this.getLocation();
    },
    handleBedPickerClose() {
      this.tempBedCount = this.bedCount;
      this.showBedPicker = false;
    },
    onBedCountConfirm(value) {
      this.bedCount = value;
      this.tempBedCount = value;
      this.showBedPicker = false;
      const oldSearchParams = uni.getStorageSync('searchParams');

      // 验证凌晨时间是否仍然有效
      const now = new Date();
      const currentHour = now.getHours();
      const isCurrentlyEarlyMorning = currentHour >= 0 && currentHour < this.hour;
      if (oldSearchParams.iChoseEarlyMorning && !isCurrentlyEarlyMorning) {
        this.iChoseEarlyMorning = false;
      } else {
        this.iChoseEarlyMorning = oldSearchParams.iChoseEarlyMorning;
      }
      this.showZeroToSixPrompt = oldSearchParams.showZeroToSixPrompt;

      const searchParams = {
        city: this.currentCity,
        district: this.currentDistrict,
        longitude: this.longitude,
        latitude: this.latitude,
        checkIn: this.checkInDate,
        checkOut: this.checkOutDate,
        nights: this.nightCount,
        bedCount: this.bedCount,
        showZeroToSixPrompt: this.showZeroToSixPrompt,
        iChoseEarlyMorning: this.iChoseEarlyMorning,
      };
      // 保存到本地存储
      uni.setStorageSync('searchParams', searchParams);
    },
    jumpPage(tag) {
      uni.navigateTo({
        url: `/pages/subPackages/home/search/index?tagId=${tag.id}`
      });
    },
    handleSearch() {
      // 保存当前搜索参数到 storage
      const searchParams = {
        city: this.currentCity,
        district: this.currentDistrict,
        longitude: this.longitude,
        latitude: this.latitude,
        checkIn: this.checkInDate,
        checkOut: this.checkOutDate,
        nights: this.nightCount,
        bedCount: this.bedCount,
        showZeroToSixPrompt: this.showZeroToSixPrompt,
        iChoseEarlyMorning: this.iChoseEarlyMorning,
      };
      // 保存到本地存储
      uni.setStorageSync('searchParams', searchParams);
      // 直接跳转到搜索页面
      uni.navigateTo({
        url: '/pages/subPackages/home/search/index'
      });
    },
    async haveYouReceivedAnyCoupons() {
      let params = {
        page: 1,
        pageSize: 1,
        status: 1
      }
      const res = await receivingCenter(params);
      if (res.total > 0) {
        this.showRedEnvelope = true
      }
    },
    initSearchParams() {
      const now = new Date();
      const currentHour = now.getHours();
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);
      // 获取存储的搜索参数
      const storedParams = uni.getStorageSync('searchParams');
      this.showZeroToSixPrompt = storedParams.showZeroToSixPrompt
      this.iChoseEarlyMorning = storedParams.iChoseEarlyMorning
      let checkInDate = this.formatYMD(today);
      let checkOutDate = this.formatYMD(tomorrow);

      // 判断当前是否在凌晨时段
      const isCurrentlyEarlyMorning = currentHour >= 0 && currentHour < this.hour;

      if (storedParams) {
        let storedCheckIn = new Date(storedParams.checkIn);
        let storedCheckOut = new Date(storedParams.checkOut);
        storedCheckIn.setHours(0, 0, 0, 0);
        storedCheckOut.setHours(0, 0, 0, 0);
        if (storedParams.iChoseEarlyMorning) {
          const yesterday = new Date(today);
          yesterday.setDate(today.getDate() - 1);
          // 如果之前选择了凌晨，但现在已经不是凌晨时段了，需要重新初始化
          if (!isCurrentlyEarlyMorning || storedCheckIn.getTime() !== yesterday.getTime()) {
            // 选择了凌晨 但是时间校验不是凌晨 进行重新初始化
            if (storedCheckIn >= today) {
              checkInDate = storedParams.checkIn;
              checkOutDate = storedParams.checkOut;
            } else {
              // 如果存储的入住日期在今天之前，则使用今天的日期作为入住日期
              checkInDate = this.formatYMD(today);
              // 离店日期小于等于入住日期时，自动顺延一天
              if (storedCheckOut > today) {
                checkOutDate = storedParams.checkOut;
              } else {
                checkOutDate = this.formatYMD(tomorrow);
              }
            }
            // 离店日期小于等于入住日期时，自动顺延一天
            if (new Date(checkOutDate) <= new Date(checkInDate)) {
              const nextDay = new Date(checkInDate);
              nextDay.setDate(nextDay.getDate() + 1);
              checkOutDate = this.formatYMD(nextDay);
            }
            this.iChoseEarlyMorning = false;
          } else {
            checkInDate = storedParams.checkIn;
            checkOutDate = storedParams.checkOut;
          }
        } else {
          // 如果存储的入住日期在今天或之后，则使用存储的日期
          if (storedCheckIn >= today) {
            checkInDate = storedParams.checkIn;
            checkOutDate = storedParams.checkOut;
          } else {
            // 如果存储的入住日期在今天之前，则使用今天的日期作为入住日期
            checkInDate = this.formatYMD(today);
            // 离店日期小于等于入住日期时，自动顺延一天
            if (storedCheckOut > today) {
              checkOutDate = storedParams.checkOut;
            } else {
              checkOutDate = this.formatYMD(tomorrow);
            }
          }
          // 离店日期小于等于入住日期时，自动顺延一天
          if (new Date(checkOutDate) <= new Date(checkInDate)) {
            const nextDay = new Date(checkInDate);
            nextDay.setDate(nextDay.getDate() + 1);
            checkOutDate = this.formatYMD(nextDay);
          }
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
        nights: storedParams?.nights || 1,
        bedCount: storedParams?.bedCount || 1,
        showZeroToSixPrompt: this.showZeroToSixPrompt,
        iChoseEarlyMorning: this.iChoseEarlyMorning,
      };
      // 更新组件数据
      this.currentCity = searchParams.city;
      this.currentDistrict = searchParams.district;
      this.checkInDate = searchParams.checkIn;
      this.checkOutDate = searchParams.checkOut;
      this.nightCount = storedParams?.nights || 1;
      this.bedCount = searchParams.bedCount;
      this.longitude = searchParams.longitude || '';
      this.latitude = searchParams.latitude || '';
      // 保存到本地存储
      uni.setStorageSync('searchParams', searchParams);
      // 如果没有城市信息，说明是首次加载，需要获取位置
      if (!this.currentCity) {
        this.getLocation();
      } else {
        this.loadHotelList(searchParams);
      }
    },
    async loadHotelList(params) {
      if (this.isRequesting) return;
      this.isRequesting = true;
      this.loading = true;
      try {
        // 确保传入完整的搜索参数
        const searchParams = {
          ...params,
          city: this.currentCity,
          district: this.currentDistrict,
          longitude: this.longitude,
          latitude: this.latitude,
          checkInDate: this.checkInDate,
          checkOutDate: this.checkOutDate,
          nights: this.nightCount,
          bedCount: this.bedCount,
          page: 1,
          pageSize: this.pageSize
        };

        let res = await fetchHotelListByPage(searchParams);
        if (!res || !res.records || res.records.length < 1) {
          console.log("该地区没有酒店！")
          this.showNoHotelTip = true;
          delete searchParams.city;
          delete searchParams.district;
          res = await fetchHotelListByPage(searchParams);
        } else {
          this.showNoHotelTip = false;
        }

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
        let searchParams = {
          city: this.currentCity,
          district: this.currentDistrict,
          longitude: this.longitude,
          latitude: this.latitude,
          checkInDate: this.checkInDate,
          checkOutDate: this.checkOutDate,
          nights: this.nightCount,
          bedCount: this.bedCount,
          page: nextPage,
          pageSize: this.pageSize
        };

        let res = await fetchHotelListByPage(searchParams);
        // 如果没有数据，尝试删除城市和区域参数再次请求（与loadHotelList保持一致）
        if (!res || !res.records || res.records.length < 1) {
          delete searchParams.city;
          delete searchParams.district;
          res = await fetchHotelListByPage(searchParams);
        }

        if (res && res.records) {
          this.hotels = [...this.hotels, ...res.records];
          // 修复页码更新逻辑，确保使用服务器返回的当前页码
          this.page = res.current || nextPage;
          this.total = res.total || this.total;
          // 修复"没有更多数据"判断逻辑
          this.noMoreData = this.hotels.length >= this.total;
        }
      } catch (e) {
        uni.showToast({title: '加载更多失败', icon: 'none'});
      } finally {
        this.loading = false;
        this.isRequesting = false;
      }
    },
    goToMemberRights() {
      uni.navigateTo({
        url: '/pages/subPackages/user/member-right'
      });
    },
    goToCitySelect() {
      const that = this;
      uni.navigateTo({
        url: '/pages/subPackages/home/city-select/index',
        events: {
          citySelected: (city) => {
            if (city && city.name) {
              that.showDetailAddress = false;
              that.currentProvince = city.province || ''; // 省份
              that.currentCity = city.displayName || city.name;//城市
              that.currentDistrict = city.district || '';  // 区
              that.longitude = city.longitude || '';
              that.latitude = city.latitude || '';
              // 更新搜索参数
              const oldSearchParams = uni.getStorageSync('searchParams');

              // 验证凌晨时间是否仍然有效
              const now = new Date();
              const currentHour = now.getHours();
              const isCurrentlyEarlyMorning = currentHour >= 0 && currentHour < this.hour;
              if (oldSearchParams.iChoseEarlyMorning && !isCurrentlyEarlyMorning) {
                this.iChoseEarlyMorning = false;
              } else {
                this.iChoseEarlyMorning = oldSearchParams.iChoseEarlyMorning;
              }
              this.showZeroToSixPrompt = oldSearchParams.showZeroToSixPrompt;

              const searchParams = {
                province: that.currentProvince,
                city: that.currentCity,
                district: that.currentDistrict,
                longitude: that.longitude,
                latitude: that.latitude,
                checkIn: that.checkInDate,
                checkOut: that.checkOutDate,
                nights: that.nightCount,
                bedCount: that.bedCount,
                showZeroToSixPrompt: this.showZeroToSixPrompt,
                iChoseEarlyMorning: this.iChoseEarlyMorning,
              };
              // 保存到本地存储
              uni.setStorageSync('searchParams', searchParams);
              // 重新加载酒店列表
              // that.loadHotelList(searchParams);
            }
          }
        },
        success: (res) => {
          // 传递当前位置信息
          res.eventChannel.emit('getCurrentLocation', that.currentCity);
        }
      });
    },
    scrollToTop() {
      uni.pageScrollTo({
        scrollTop: 0,
        duration: 300
      });
    },
  }
}
</script>

<style lang="scss" scoped>
.other-tinkerbells {
  margin-top: 80rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 24rpx;

  .other-tinkerbells-l {
    width: 130rpx;
    height: 2rpx;
    border: 2rpx solid;
    border-image: linear-gradient(270deg, rgba(151, 151, 151, 1), rgba(243, 244, 246, 0)) 2 2;
  }

  .other-tinkerbells-r {
    width: 130rpx;
    height: 2rpx;
    border: 2rpx solid;
    border-image: linear-gradient(270deg, rgba(243, 244, 246, 0), rgba(151, 151, 151, 1)) 2 2;
  }

  .other-tinkerbells-c {
    font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;
    font-weight: 400;
    font-size: 28rpx;
    color: #6D7278;
    line-height: 28rpx;
    text-align: center;
    font-style: normal;
  }

  .other-tinkerbells-l {

  }
}

::v-deep .empty-state {
  margin-top: 50rpx !important;
}

.custom-title {
  position: absolute;
  background-color: rgba(0, 0, 0, 0);
  color: #FFF;
  width: auto;
  height: 190rpx;
  top: 202rpx;
  left: 56rpx;
  right: 0;

  .title-text {
    font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;
    font-weight: 600;
    font-size: 60rpx;
    color: #FFFFFF;
    line-height: 60rpx;
    text-align: left;
    font-style: normal;
  }

  .subtitle {
    margin-top: 20rpx;
    font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;
    font-weight: 500;
    font-size: 48rpx;
    color: #FFFFFF;
    line-height: 48rpx;
    text-align: left;
    font-style: normal;
  }

  .btn {
    width: 152rpx;
    height: 40rpx;
    background: #FFFFFF;
    border-radius: 20rpx;
    font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;
    font-weight: 500;
    font-size: 24rpx;
    color: #FF3F1A;
    line-height: 40rpx;
    text-align: center;
    font-style: normal;
    margin-top: 22rpx;
  }
}

.empty-state {
  width: 370rpx;
  height: 200rpx;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 100rpx;
  margin-bottom: 40rpx;
}

.empty-icon {
  width: 100%;
  height: 100vh;
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

.container {
  position: relative;
  min-height: 100vh;
  background: #F3F4F6;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

.home-banner {
  width: 100%;
  background: transparent;
  display: flex;
  flex-direction: column;
  align-items: center;
}

::v-deep .uni-navbar {
  background-color: transparent !important;
  position: absolute;
}

.banner-swiper {
  width: 100%;
  overflow: hidden;
}

.banner-img {
  width: 100%;
  display: block;
  border-bottom-left-radius: 32rpx;
  border-bottom-right-radius: 32rpx;
  overflow: hidden;
  background: transparent;
}

.main-content {
  position: relative;
  top: -254rpx;
  z-index: 1;
  padding: 0 24rpx 0 24rpx;
}

/*搜索卡片样式 */
::v-deep .search-card {
  border-radius: 28rpx;
  overflow: hidden;
}

.custom-navbar-title {
  width: 100%;
  height: 100rpx;
  font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;
  font-weight: 500;
  font-size: 32rpx;
  color: #FFFFFF;
  line-height: 100rpx;
  text-align: center;
  font-style: normal;
}

.calendar-page {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
  background-color: #fff;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch; /* iOS滚动优化 */
  transform: translateY(100%);
  transition: transform 0.3s ease-out;
}

.calendar-page.show {
  transform: translateY(0);
}

.page-hidden {
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease-out;
}

.page-visible {
  opacity: 1;
  pointer-events: auto;
}

.no-hotel-text {
  margin-left: 8rpx;
  font-size: 26rpx;
}

.no-hotel-tip::before,
.no-hotel-tip::after {
  content: '';
  flex: 1;
  height: 1px;
  background-color: #ddd;
}

.no-hotel-tip::before {
  margin-right: 10rpx;
}

.no-hotel-tip::after {
  margin-left: 10rpx;
}

/*弹窗广告样式 */
.popup-ad-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.popup-ad-container {
  position: relative;
  width: 90%;
  height: 40%;
}

.popup-ad-image {
  width: 100%;
  height: 100%;
  border-radius: 16rpx;
}

.popup-ad-close {
  position: absolute;
  bottom: -90rpx;
  left: 50%;
  transform: translateX(-50%);
  width: 60rpx;
  height: 60rpx;
  background-color: rgba(0, 0, 0, 0.6);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.popup-ad-btn {
  width: 40%;
  margin: auto;
  height: 92rpx;
  background: #EE781F;
  border-radius: 50rpx;
  font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;
  font-weight: 500;
  font-size: 32rpx;
  color: #FFFFFF;
  line-height: 92rpx;
  text-align: center;
  font-style: normal;
}
</style>