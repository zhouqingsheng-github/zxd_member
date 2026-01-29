<template>
  <view class="hotel-detail" :class="{ 'no-scroll': showCalendar }">
    <!-- 顶部图片轮播 -->
    <view class="nav-bar-float" :style="{ paddingTop: (statusBarHeight + 8) + 'px' }">
      <view class="custom-back-btn" @click="back">
        <image src="/static/base/back.png" mode="aspectFill" class="back-icon"/>
      </view>
      <button class="custom-back-right" open-type="share">
        <image src="https://zxd-hotel.xin/zxdhotel/icon/share.png" mode="aspectFill" class="share-icon"/>
      </button>
    </view>
    <view class="swiper-wrap">
      <!-- 自定义胶囊指示点 -->
      <view class="photoAlbum" @click="openPhotoAlbum">
        <view class="album-icon"></view>
        <view class="album-text">相册</view>
      </view>
      <u-swiper
          class="hotel-swiper"
          :list="swiperImages"
          :circular="true"
          @change="e => swiperCurrent = e.current"
          :autoplay="true"
          :height="600"
      >
        <view slot="indicator" class="custom-indicator">
          <view class="indicator-capsule">
            <view
                v-for="(img, idx) in hotel.imgUrls"
                :key="idx"
                :class="['indicator-dot', swiperCurrent === idx ? 'active' : '']"
            ></view>
          </view>
        </view>
      </u-swiper>
    </view>

    <!-- 酒店基本信息 -->
    <view class="hotel-info">
      <!-- 酒店名称和评分 -->
      <view class="hotel-title-row">
        <text class="hotel-title">{{ hotel.name }}</text>
      </view>
      <!-- 标签和评分同一行 -->
      <view class="hotel-tags-row">
        <view class="hotel-tags">
          <!--          <view class="hotel-tag-bj" v-if="hotel.liveContinuously">-->
          <!--            <image class="hotel-tag-icon-bj" src="https://www.zxd-hotel.xin/zxdhotel/icon/lzbq4.png" mode="aspectFit" />-->
          <!--          </view>-->
          <view class="hotel-tag-bj pack" v-if="hotel.liveContinuously">
            <view class="pack_1"><text>套餐</text></view>
            <view class="pack_2"><text>连住套餐</text></view>
          </view>
          <view v-for="(tag, idx) in hotel.hotelTags" :key="idx" class="hotel-tag"
                v-if="tag.type === 3 && tag.cshow ===0">
            <image v-if="tag.iconUrl" :src="tag.iconUrl" class="hotel-tag-icon" mode="aspectFill"/>
            <text>{{ tag.name }}</text>
          </view>
          <view class="hotel-score" v-if="hotel.rating">
            <view class="rate-icon"></view>
            <view class="rate-num">{{ hotel.rating }}</view>
          </view>
        </view>
      </view>
      <!-- 距离和地铁信息+右侧按钮 -->
      <view class="hotel-desc-row">
        <view class="hotel-desc-left" @click="onNav">
          <view class="map-icon"></view>
          <text class="hotel-desc">{{ hotel.address }}</text>
        </view>
        <view class="hotel-desc-right">
<!--          <view class="icon-btn" @click="onNav">
            <view class="navigation-icon"></view>
          </view>-->
          <view class="icon-btn" @click="onCall">
            <view class="phone-icon"></view>
          </view>
        </view>
      </view>
      <!-- 设施图标横滑 + 政策设施 -->
      <view class="hotel-icons-bar">
        <scroll-view
            class="hotel-icons-scroll"
            scroll-x
            :show-scrollbar="false"
            enhanced
            :bounces="true"
            :scroll-with-animation="true"
        >
          <view class="hotel-icons">
            <view v-for="(tag, idx) in hotel.hotelTags" :key="idx" class="hotel-icon" v-if="tag.type === 5">
              <image :src="tag.iconUrl" class="icon-img" mode="aspectFill"></image>
              <view class="hotel-text">{{ tag.name }}</view>
            </view>
            <view class="hotel-icon">
              <view class="hotel-text"></view>
            </view>
            <view class="hotel-icon" style="width:200rpx;height: 10rpx;"></view>
          </view>
        </scroll-view>
        <view class="hotel-policy-float" @click="jumpFacilities">
          <view class="more-row">
            <view class="more-text">
              <text>政策</text>
              <text>设施</text>
            </view>
            <view class="more-icon"></view>
          </view>
        </view>
      </view>

    </view>
    <!-- 预订信息 -->
    <view class="booking-info">
      <view class="booking-row-labels">
        <view class="booking-label">入住</view>
        <view class="booking-label">离店</view>
        <view class="booking-label">床位数</view>
      </view>
      <view class="booking-row-values">
        <view class="booking-date">{{ booking.checkIn }}</view>
        <view class="booking-nights">共{{ booking.nights }}晚</view>
        <view class="booking-date">{{ booking.checkOut }}</view>
        <view class="booking-divider"></view>
        <view class="booking-date booking-people">{{ booking.bedCount }}</view>
      </view>
      <!-- 添加遮挡层 -->
      <view class="booking-mask">
        <view class="mask-left" @click="onSelectDate('checkIn')"></view>
        <view class="mask-right" @click="onSelectDate('checkOut')"></view>
        <view class="mask-bed" @click="onSelectBed"></view>
      </view>
    </view>

    <!-- 房型列表 -->
    <view class="room-list">
      <view class="room-item" v-for="(room, idx) in rooms" :key="idx">
        <view class="room-img-wrap">
          <image
              mode="aspectFill"
              class="room-img"
              :src="getMainImg(room.imageList)"
          />
          <view class="room-photo-album" @click="openRoomPhotoAlbum(room)">
            <view class="album-icon"></view>
            <view class="album-text">相册</view>
          </view>
        </view>
        <view class="room-info">
          <view class="room-title">{{ room.name }}</view>
          <view class="room-desc" v-if="room.description">{{ room.description || '' }}</view>
          <view class="room-sales" v-if="room.stock > 0 && room.stock < 10">仅剩{{ room.stock }}张床位</view>
          <view v-if="room.tips" class="room-tips">{{ room.tips }}</view>
          <view class="room-bottom">
            <view class="room-price-block">
              <view class="room-price-wrap">
              </view>
            </view>
            <view v-if="room.stock > 0" class="book-btn" @click="onBook(room)">预定</view>
            <view v-else class="full-btn">满房</view>
          </view>
        </view>
      </view>
    </view>

    <template v-if="false">
      <!-- 住客评价 -->
      <view class="review-score-label">住客评分</view>
      <view class="hotel-review">
        <view class="review-header-row">
          <view class="review-score-main">
            <text class="review-score-big">{{ review.score }}</text>
          </view>
          <view class="review-score-detail">
            <view class="score-detail-row" v-for="(row, rowIdx) in reviewSubScoresGroup" :key="rowIdx">
              <view class="score-detail-item" v-for="(item, idx) in row" :key="idx">
                <text class="score-label">{{ item.label }} {{ item.value }}</text>
                <view class="score-bar">
                  <view
                      class="score-bar-inner"
                      :class="{ full: item.value === 5 }"
                      :style="{width: (item.value/5*100)+'%'}"
                  ></view>
                </view>
              </view>
            </view>
          </view>
          <view class="review-more" @click="onReviewMore">查看全部</view>
          <view class="review-more-icon"></view>
        </view>
        <view class="line"></view>
        <view class="review-list">
          <view v-for="(item, idx) in review.list" :key="idx">
            <view class="review-item">
              <image :src="item.avatar" class="review-avatar" mode="aspectFill"/>
              <view class="review-content-wrap">
                <view class="review-user-row">
                  <text class="review-user">{{ item.user }}</text>
                </view>
                <view class="review-date">{{ item.date }}</view>
                <view class="review-tags">
                  <view class="review-tag" v-for="(tag, tIdx) in item.tags" :key="tIdx">{{ tag }}</view>
                </view>
                <view class="review-content">{{ item.content }}</view>
              </view>
            </view>
            <view class="line2"></view>
          </view>
        </view>
        <view class="review-more-bottom" @click="onReviewMore">查看更多评价({{ review.total }})</view>
      </view>

      <!-- 酒店设施 -->
      <view class="review-score-label">酒店设施</view>
      <view class="hotel-facilities-box">
        <view class="hotel-facilities-list">
          <view class="facility-item2" v-for="(f, idx) in facilities" :key="idx">
            <view class="facility-icon-bg">
              <image :src="f.img" class="facility-img2" mode="aspectFill"></image>
            </view>
            <view class="facility-info">
              <view class="facility-title">{{ f.text }}</view>
              <view class="facility-desc">{{ f.desc }}</view>
            </view>
          </view>
        </view>
        <view class="facility-divider"></view>
        <view class="facility-more">查看全部{{ facilities.length }}项设施</view>
      </view>
      <view class="review-score-label">位置及周边</view>
      <!-- 地图位置 -->
      <view class="hotel-location">
        <map :latitude="location.lat" :longitude="location.lng" :markers="markers" class="hotel-map"></map>
        <text class="location-address">{{ location.address }}</text>
        <view class="location-route-btn" @click="onNav">
          <view class="location-route-icon"></view>
          <text class="location-route-text">查看前往酒店的路线</text>
        </view>
      </view>
    </template>
    <!-- 添加日历组件 -->
    <HotelCalendar
        v-if="showCalendar"
        @change="onCalendarConfirm"
        @close="showCalendar = false"
        :isItOptionalToday=!type
        :calendarPrice="calendarPrice"
        :value="[formatDateForCalendar(booking.checkIn), formatDateForCalendar(booking.checkOut)]"
        :class="['calendar-page', showCalendar ? 'show' : '']"
        :cutoffTime="cutoffTime"
    />

    <!-- 添加床位选择器组件 -->
    <bed-count-picker
        v-if="showBedPicker"
        :value="tempBedCount"
        :canItBeModified=!type
        @input="tempBedCount = $event"
        @confirm="onBedPickerConfirm"
        @close="handleBedPickerClose"
    />
  </view>
</template>

<script>
import {fetchHotelDetail, lowestPriceCalendar} from "@/common/api.js";
import BedCountPicker from '@/components/BedCountPicker.vue';
import HotelCalendar from '@/components/HotelCalendar.vue';
import USwiper from "../../../uni_modules/uview-ui/components/u-swiper/u-swiper.vue";
import {pageBack} from "../../../common/redirect";

export default {
  components: {
    USwiper,
    BedCountPicker,
    HotelCalendar
  },
  data() {
    return {
      cutoffTime: '00:00',
      thirdOrderId: null,
      type: true,
      calendarPrice: {},
      statusBarHeight: 0,
      current: 0,
      mode: 'round',
      dotsStyles: {
        backgroundColor: 'rgba(0, 0, 0, .3)',
        border: '1px rgba(0, 0, 0, .3) solid',
        color: '#fff',
        selectedBackgroundColor: 'rgba(0, 0, 0, .9)',
        selectedBorder: '1px rgba(0, 0, 0, .9) solid'
      },
      swiperCurrent: 0,
      swiperShow: true,
      swiperKey: 0,
      showCalendar: false,
      showBedPicker: false,
      hotel: {},
      booking: {
        checkIn: '',
        checkOut: '',
        nights: 0,
        people: 0,
      },
      rooms: [],
      review: {
        score: 4.8,
        subScores: [
          {label: '卫生', value: 4.2},
          {label: '环境', value: 4.9},
          {label: '服务', value: 4.8},
          {label: '设施', value: 4.8},
        ],
        total: 179,
        list: [
          {
            avatar: '/static/base/avatar1.png',
            user: 'ZXD02984',
            date: '2025年05月20日 11:45:09',
            tags: ['性价比', '设施齐全'],
            content: '酒店位置非常便利，挨着地铁不远，走路三五分钟的样子。房间干净整洁，价格又很实惠，性价比太棒了！推荐。'
          },
          {
            avatar: '/static/base/avatar2.png',
            user: 'ZXD02984',
            date: '2025年05月20日 11:45:09',
            tags: ['性价比', '设施齐全'],
            content: '酒店位置非常便利，挨着地铁不远，走路三五分钟的样子。房间干净整洁，价格又很实惠，性价比太棒了！推荐。'
          }
        ]
      },
      facilities: [
        {img: '/static/icon_wifi.png', text: '上网服务', desc: '全部区域WiFi覆盖，免费提供'},
        {img: '/static/icon_parking.png', text: '餐饮服务', desc: '提供简易早餐，每份￥20，需提前预定'},
        {img: '/static/base/car_park.png', text: '停车服务', desc: "提供简易早餐，每份￥20，需提前预定"},
      ],
      location: {
        lat: 39.9042,
        lng: 116.4074,
        address: '北京市朝阳区某某路',
      },
      markers: [
        {
          id: 1,
          latitude: 39.9042,
          longitude: 116.4074,
          title: '住小町酒店',
        },
      ],
      tempBedCount: 1,
    };
  },
  computed: {
    reviewSubScoresGroup() {
      const arr = [];
      for (let i = 0; i < this.review.subScores.length; i += 2) {
        arr.push(this.review.subScores.slice(i, i + 2));
      }
      return arr;
    },
    swiperImages() {
      return (this.hotel.imgUrls || []).map(it => it?.imageUrl || '');
    }
  },
  onPullDownRefresh() {
    this.fetchHotelDetail(this.hotel.id).then(() => {
      uni.stopPullDownRefresh();
    }).catch(() => {
      uni.stopPullDownRefresh();
    });
  },
  onLoad(options) {
    this.thirdOrderId = options.dataId;
    // #ifdef MP-WEIXIN
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    });
    // #endif
    uni.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#FFFFFF'
    });
    // 新增：初始化预订信息（如果没有缓存）
    this.initBookingInfoIfNeeded();
    // 获取本地存储的入住信息
    this.loadBookingInfo();
    const hotelId = options.id;
    this.fetchHotelDetail(hotelId);
    this.getLowestPriceCalendar(hotelId);
  },
  onShow() {
    // 每次页面显示时重新加载预订信息，确保床位数等信息同步
    this.swiperShow = false;
    this.swiperKey++;
    this.$nextTick(() => {
      this.swiperShow = true;
    });
    this.loadBookingInfo();
  },
  onReady() {
    const sys = uni.getSystemInfoSync();
    this.statusBarHeight = sys.statusBarHeight || 0;
  },
  onShareAppMessage() {
    return {
      title: this.hotel.name || '住小叮酒店',
      path: `/pages/subPackages/home/detail?id=${this.hotel.id}`,
      imageUrl: this.hotel.imgUrls && this.hotel.imgUrls.length > 0 ? this.hotel.imgUrls[0].imageUrl : '',
      desc: this.hotel.address || '欢迎入住住小叮酒店',
      success: function () {
        uni.showToast({
          title: '分享成功',
          icon: 'success'
        });
      },
      fail: function () {
        uni.showToast({
          title: '分享失败',
          icon: 'none'
        });
      }
    };
  },
  methods: {
    // 加载预订信息
    loadBookingInfo() {
      const bookingInfo = uni.getStorageSync('searchParams');
      if (bookingInfo) {
        this.booking = bookingInfo;
        this.booking.checkIn = this.formatDate2(bookingInfo.checkIn);
        this.booking.checkOut = this.formatDate2(bookingInfo.checkOut);
        // 确保床位数同步
        this.booking.bedCount = bookingInfo.bedCount;
      }
    },
    getMainImg(imgUrls) {
      if (!imgUrls || !imgUrls.length) return '';
      const main = imgUrls.find(function (img) {
        return img.isMain === 1;
      });
      return main ? main.imageUrl : '';
    },
    jumpFacilities() {
      // 筛选出 type === 5 的设施数据
      const facilities = (this.hotel.hotelTags || [])
        .filter(tag => tag.type === 5)
        .map(tag => ({
          icon: tag.iconUrl,
          title: tag.name,
          desc: tag.remark || ''
        }));
      
      // 将数据存储到本地
      uni.setStorageSync('hotelFacilities', facilities);
      
      uni.navigateTo({
        url: '/pages/subPackages/agreement/facilities',
      });
    },
    async getLowestPriceCalendar(hotelId) {
      const res = await lowestPriceCalendar({hotelId});
      this.$set(this, 'calendarPrice', res);
    },
    async fetchHotelDetail(hotelId) {
      try {
        const bookingInfo = uni.getStorageSync('searchParams') || {};
        const params = {
          id: hotelId,
          deductOrderId: this.thirdOrderId,
          checkInDate: bookingInfo.checkIn,
          checkOutDate: bookingInfo.checkOut
        };
        const res = await fetchHotelDetail(params);
        this.hotel = res || {};
        this.rooms = res.hotelRooms || [];
      } catch (e) {
        uni.showToast({title: '获取酒店详细失败', icon: 'none'});
      }
    },
    // 新增：初始化预订信息（如果没有缓存）
    initBookingInfoIfNeeded() {
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
      // 更新搜索参数
      const searchParams = {
        checkIn: checkInDate,
        checkOut: checkOutDate,
        nights: storedParams?.nights || 1,
        bedCount: storedParams?.bedCount || 1
      };
      // 保存到本地存储
      uni.setStorageSync('searchParams', searchParams);
    },
    formatYMD(date) {
      if (!date) return '';
      if (typeof date === 'string') return date;
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      return `${year}-${month}-${day}`;
    },
    formatDate2(dateStr) {
      if (!dateStr) return '';
      const date = new Date(dateStr);
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      return `${month}月${day}日`;
    },
    formatDateForCalendar(dateStr) {
      if (!dateStr) return '';
      // 如果是已经格式化过的日期（包含"月"字），需要转换回标准格式
      if (dateStr.includes('月')) {
        const [month, day] = dateStr.replace('日', '').split('月');
        const year = new Date().getFullYear();
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
      }
      // 如果已经是标准格式，直接返回
      return dateStr;
    },
    // 格式化设施信息
    formatFacilities(facilitiesStr) {
      if (!facilitiesStr) return '';
      try {
        // 如果是字符串，先解析为数组
        let facilities = facilitiesStr;
        if (typeof facilitiesStr === 'string') {
          facilities = JSON.parse(facilitiesStr);
        }

        // 提取设施名称并拼接
        if (Array.isArray(facilities) && facilities.length > 0) {
          const names = facilities.map(item => item.name).filter(name => name);
          return names.length > 0 ? `[${names.join('+')}]` : '';
        }
        return '';
      } catch (e) {
        console.error('解析设施数据失败:', e);
        return '';
      }
    },
    onSwiperChange(e) {
      this.swiperCurrent = e.detail.current;
    },
    onNav() {
      if (!this.hotel.latitude || !this.hotel.longitude) {
        uni.showToast({
          title: '暂无位置信息',
          icon: 'none'
        });
        return;
      }

      uni.openLocation({
        latitude: Number(this.hotel.latitude),
        longitude: Number(this.hotel.longitude),
        name: this.hotel.name,
        address: this.hotel.address,
        scale: 18
      });
    },
    onCall() {
      // TODO: 实现拨打电话功能
      uni.makePhoneCall({phoneNumber: this.hotel.contactPhone});
    },
    back() {
      pageBack()
    },
    onReviewMore() {
      uni.showToast({title: '查看更多评价功能待接入', icon: 'none'});
    },
    onBook(room) {
      // 跳转到订单填写页面，传递必要参数
      const query = `?id=${room.id}&thirdOrderId=${this.thirdOrderId}&thirdRoomName=${room.name}`;
      uni.navigateTo({
        url: '/pages/subPackages/order/index' + query
      });
    },
    onSelectDate(type) {
      this.showCalendar = true;
    },
    onSelectBed() {
      this.tempBedCount = this.booking.bedCount;
      this.showBedPicker = true;
    },
    handleBedPickerClose() {
      this.tempBedCount = this.booking.bedCount;
      this.showBedPicker = false;
    },
    onBedPickerConfirm(value) {
      const bookingInfo = uni.getStorageSync('searchParams') || {};
      bookingInfo.bedCount = value;
      uni.setStorageSync('searchParams', bookingInfo);
      this.loadBookingInfo();
      this.showBedPicker = false;
    },
    onCalendarConfirm(dates) {
      if (dates && dates.detail && dates.detail.length === 3) {
        const [checkIn, checkOut, nights] = dates.detail;
        const bookingInfo = uni.getStorageSync('searchParams') || {};
        bookingInfo.checkIn = checkIn;
        bookingInfo.checkOut = checkOut;
        bookingInfo.nights = nights;
        uni.setStorageSync('searchParams', bookingInfo);
        this.loadBookingInfo();
        // 重新加载酒店详情
        this.fetchHotelDetail(this.hotel.id);
      }
    },
    calculateNights(checkIn, checkOut) {
      const start = new Date(checkIn);
      const end = new Date(checkOut);
      const diffTime = Math.abs(end - start);
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    },
    openPhotoAlbum() {
      uni.navigateTo({
        url: '/pages/subPackages/home/photoAlbum?id=' + this.hotel.id + '&type=hotel'
      });
    },
    openRoomPhotoAlbum(room) {
      uni.navigateTo({
        url: '/pages/subPackages/home/photoAlbum?id=' + room.id + '&type=room'
      });
    },
  }
};
</script>

<style scoped>
.hotel-detail {
  background: #F3F4F6;
}

.hotel-detail.no-scroll {
  overflow: hidden;
  height: 100vh;
}

.swiper-wrap {
  background: #FFF;
  position: relative;
  width: 100%;
  height: 600rpx;
}

.hotel-swiper {
  width: 100%;
  height: 100%;
  background: #FFF;
  border-radius: 0 0 60rpx 60rpx;
  overflow: hidden;
}

.hotel-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.hotel-info {
  background: #FFF;
  padding: 40rpx 28rpx 62rpx 28rpx;
}

.hotel-title-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 28rpx;
}

.hotel-title {
  font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;
  font-weight: 500;
  font-size: 36rpx;
  line-height: 45rpx;
  color: #19191A;
  text-align: left;
  font-style: normal;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  word-break: break-all;
}

.hotel-score {
  display: flex;
  align-items: center;
  margin-left: 10rpx;
  height: 40rpx;
  line-height: 40rpx;
}

.rate-icon {
  width: 24rpx;
  height: 24rpx;
  background: url('/static/base/score.png') no-repeat;
  background-size: 100% 100%;
  margin-right: 10rpx;
  flex-shrink: 0;
}

.rate-num {
  font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;
  font-weight: 400;
  font-size: 24rpx;
  color: #36363B;
  line-height: 24rpx;
  letter-spacing: 1px;
  text-align: left;
  font-style: normal;
}

.hotel-tags-row {
  display: flex;
  align-items: center;
  height: auto;
  line-height: 40rpx;
  margin-bottom: 20rpx;
}

.hotel-tags {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10rpx;
}

.hotel-tag {
  display: flex;
  width: auto;
  height: 28rpx;
  background: #FFFFFF;
  border-radius: 4rpx;
  align-items: center;
  padding-right: 10rpx;
  padding-left: 12rpx;
  font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;
  font-weight: 400;
  font-size: 20rpx;
  color: #EE781F;
  line-height: 20rpx;
  text-align: left;
  font-style: normal;
  position: relative;
  /* 关键：用阴影模拟四边框 */
  border: 1rpx solid #F9D6BB;
  border-bottom: none;
}

.hotel-tag-bj {
  display: flex;
  width: auto;
  height: 28rpx;
  background: #FFFFFF;
  align-items: center;
  font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;
  font-weight: 400;
  font-size: 20rpx;
  color: #EE781F;
  line-height: 20rpx;
  text-align: left;
  font-style: normal;
  position: relative;
  border-bottom: none;
  border-radius: 0 !important;
  border: none !important;
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

.hotel-tag-icon-bj {
  width: 162rpx;
  height: 28rpx;
}

.hotel-tag::after {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  border-bottom: 1rpx solid #F9D6BB;
  transform: scaleY(1);
  /* 整体缩放 */
  transform-origin: 0 0;
  pointer-events: none;
}


.hotel-tag-icon {
  width: 24rpx;
  height: 24rpx;
  margin-right: 8rpx;
  vertical-align: middle;
}

.hotel-desc-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10rpx;
}

.hotel-desc-left {
  display: flex;
  align-items: center;
  color: #222;
  font-size: 26rpx;
  flex: 1;
  margin-right: 44rpx;
  background-image: url("https://www.zxd-hotel.xin/zxdhotel/icon/@2x.png");
  background-size: cover;
  background-position: 0 0;
  background-repeat: no-repeat;
  padding: 26rpx 0 26rpx 20rpx;
}

.map-icon {
  width: 36rpx;
  height: 36rpx;
  background: url('/static/base/map.png') no-repeat center;
  background-size: 100% 100%;
  margin-right: 12rpx;
  flex-shrink: 0;
}

.hotel-desc {
  font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;
  font-weight: 400;
  font-size: 24rpx;
  color: #19191A;
  line-height: 34rpx;
  text-align: left;
  font-style: normal;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  word-break: break-all;
  padding-right: 40rpx;
}

.hotel-desc-right {
  display: flex;
  align-items: center;
  height: 64rpx;
}

.navigation-icon {
  width: 100%;
  height: 100%;
  background: url('/static/base/navigation.png') no-repeat center;
  background-size: 64rpx 64rpx;
}

.phone-icon {
  width: 100%;
  height: 100%;
  background: url('/static/base/phone.png') no-repeat center;
  background-size: 64rpx 64rpx;
}

.icon-btn {
  background: #f8f8f8;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 16rpx;
  padding: 0;
  width: 64rpx;
  height: 64rpx;
  border-radius: 64rpx;
  overflow: hidden;
}

.hotel-icons-bar {
  position: relative;
  width: 100%;
  height: 156rpx;
  display: flex;
  align-items: center;
}

.hotel-icons-scroll {
  height: 156rpx;
  flex: 1;
  margin-right: 0;
  padding-right: 240rpx;
  white-space: nowrap;
}

.hotel-policy-float {
  position: absolute;
  top: 0;
  right: 0;
  width: 190rpx;
  height: 156rpx;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: center;
  background: url('/static/base/maskLayer.png') no-repeat center;
  background-size: cover;
  z-index: 10;
}

.more-row {
  display: flex;
  align-items: center;
  justify-content: center;
}

.more-text {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #222;
  font-size: 26rpx;
  height: 48rpx;
  line-height: 24rpx;
  font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;
  font-weight: 400;
  text-align: center;
  user-select: none;
  margin-right: 26rpx;
}

.more-icon {
  width: 22rpx;
  height: 38rpx;
  background: url('/static/base/right.png') no-repeat center;
  margin-right: 0;
}

.hotel-icons {
  display: flex;
  align-items: center;
  gap: 52rpx;
  height: 100%;
  padding: 0 28rpx;
}

.hotel-icon {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 72rpx;
  max-width: 96rpx;
  width: auto;
}

.icon-img {
  width: 72rpx;
  height: 72rpx;
  margin-bottom: 14rpx;
}

.hotel-text {
  width: auto;
  height: 24rpx;
  font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;
  font-weight: 400;
  font-size: 24rpx;
  color: #19191A;
  line-height: 24rpx;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.booking-info {
  margin: auto;
  margin-top: 28rpx;
  width: 694rpx;
  height: 140rpx;
  background: #EE781F;
  border-radius: 28rpx;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  margin-bottom: 28rpx;
  position: relative; /* 添加相对定位 */
}

.booking-row-labels {
  display: flex;
  justify-content: space-between;
  height: 24rpx;
  margin: 28rpx 112rpx 0 28rpx;

}

.booking-label {
  height: 24rpx;
  font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;
  font-weight: 400;
  font-size: 24rpx;
  color: #FFFFFF;
  line-height: 24rpx;
  text-align: left;
  font-style: normal;
}

.booking-row-values {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 20rpx 142rpx 0 28rpx;
  flex-wrap: nowrap;
  white-space: nowrap;
}

.booking-date {
  width: auto;
  height: 32rpx;
  font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;
  font-weight: 500;
  font-size: 32rpx;
  color: #FFFFFF;
  line-height: 32rpx;
  text-align: left;
  font-style: normal;
}

.booking-nights {
  width: 72rpx;
  height: 32rpx;
  border-radius: 16rpx;
  line-height: 36rpx;
  padding: 6rpx 10rpx;
  color: #fff;
  font-size: 22rpx;
  font-weight: 400;
  background: rgba(255, 255, 255, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
}

.booking-nights::after {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  border-radius: 16rpx;
  border: 1rpx solid #fff;
  pointer-events: none;
  box-sizing: border-box;
}

@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 2dppx) {
  .booking-nights::after {
    border-width: 0.5px;
  }
}

.booking-divider {
  width: 2rpx;
  height: 36rpx;
  background: rgba(255, 255, 255, 0.5);
  margin: 0 24rpx;
  border-radius: 1rpx;
}

.booking-people {
  min-width: 40rpx;
  justify-content: flex-end;
}

.room-list {
  margin-left: 28rpx;
  margin-right: 28rpx;
  margin-bottom: 200rpx;
}

.room-item {
  background: #fff;
  border-radius: 24rpx;
  margin-bottom: 24rpx;
  overflow: hidden;
  box-shadow: 0 4rpx 24rpx 0 rgba(0, 0, 0, 0.04);
  display: flex;
  flex-direction: column;
}

.room-img-wrap {
  position: relative;
  width: 100%;
  height: 400rpx;
  background: #E6DED9;
}

.room-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  margin-bottom: 24rpx;
}

.room-photo-album {
  position: absolute;
  left: 28rpx;
  bottom: 28rpx;
  z-index: 12;
  width: 96rpx;
  height: 40rpx;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.room-info {
  padding: 0 28rpx 0 28rpx;
  display: flex;
  flex-direction: column;
  margin-top: 24rpx;
  margin-bottom: 20rpx;
}

.room-title {
  font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;
  font-weight: 500;
  font-size: 32rpx;
  color: #19191A;
  line-height: 40rpx;
  text-align: left;
  font-style: normal;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  word-break: break-all;
}

.room-desc {
  margin-top: 16rpx;
  height: 24rpx;
  font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;
  font-weight: 400;
  font-size: 24rpx;
  color: #6D7278;
  line-height: 24rpx;
  text-align: left;
  font-style: normal;
}

.room-sales {
  margin-top: 16rpx;
  height: 24rpx;
  font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;
  font-weight: 400;
  font-size: 24rpx;
  color: #EE781F;
  line-height: 24rpx;
  text-align: left;
  font-style: normal;
}

.room-tips {
  color: #EE781F;
  font-size: 22rpx;
  margin-bottom: 8rpx;
}

.room-bottom {
  margin-top: 4rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 28rpx;
  position: relative;
}

.room-price-block {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  flex: 1;
}

.room-price-wrap {
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.room-origin-price {
  width: auto;
  height: 24rpx;
  font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;
  font-weight: 400;
  font-size: 24rpx;
  color: #6D7278;
  line-height: 24rpx;
  text-align: left;
  font-style: normal;
  text-decoration-line: line-through;
  margin-right: 2rpx;
}

.room-price-y {
  font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;
  font-weight: 400;
  font-size: 24rpx;
  color: #EE781F;
  line-height: 24rpx;
  text-align: left;
  font-style: normal;
}

.room-price {
  height: 40rpx;
  font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;
  font-weight: 600;
  font-size: 40rpx;
  color: #EE781F;
  line-height: 40rpx;
  text-align: right;
  font-style: normal;
}

.room-coupon {
  margin-top: 4rpx;
  width: auto;
  height: 32rpx;
  background: #FFF0E5;
  border-radius: 200rpx 0 200rpx 200rpx;
  font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;
  font-weight: 400;
  font-size: 20rpx;
  color: #B7560C;
  line-height: 32rpx;
  text-align: center;
  font-style: normal;
  padding: 6rpx 6rpx 6rpx 14rpx;
}

.book-btn {
  min-width: 120rpx;
  height: 72rpx;
  border-radius: 36rpx;
  background: linear-gradient(270deg, #F8B042 0%, #EE781F 100%);

  font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;
  font-weight: 500;
  font-size: 32rpx;
  color: #FFFFFF;
  line-height: 72rpx;
  text-align: center;
  font-style: normal;
  border: none;
  margin-left: 24rpx;
  position: absolute;
  right: 0;
  transform: translateY(-10rpx); /* 额外上移调整 */
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
  position: absolute;
  right: 0;
  transform: translateY(-10rpx); /* 额外上移调整 */
}

.hotel-review {
  background: #FFFFFF;
  border-radius: 28rpx;
  margin: 0 28rpx 50rpx 28rpx;
  padding: 38rpx 20rpx 38rpx 36rpx;
}

.review-header-row {
  display: flex;
  align-items: flex-start;
  position: relative;
}

.review-score-main {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 20rpx;
  width: 90rpx;
  height: 40rpx;
  font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;
  font-weight: 600;
  font-size: 60rpx;
  color: #EE781F;
  line-height: 40rpx;
  text-align: left;
  font-style: normal;
}

.review-score-label {
  margin-top: 50rpx;
  margin-bottom: 28rpx;
  width: auto;
  height: 32rpx;
  font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;
  font-weight: 500;
  font-size: 32rpx;
  color: #19191A;
  line-height: 32rpx;
  text-align: left;
  font-style: normal;
  margin-left: 28rpx;
}

.review-score-detail {
  display: flex;
  flex-direction: column;
  gap: 4rpx;
}

.score-detail-row {
  display: flex;
  justify-content: space-between;
  gap: 18rpx;
}

.score-detail-item {
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 10rpx;
}

.score-label {
  width: auto;
  height: 20rpx;
  font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;
  font-weight: 400;
  font-size: 20rpx;
  color: #19191A;
  line-height: 20rpx;
  text-align: left;
  font-style: normal;
}

.score-bar {
  width: 60rpx;
  height: 8rpx;
  background: #E9EBFF;
  border-radius: 4rpx;
  position: relative;
}

.score-bar-inner {
  height: 100%;
  background: #ff9900;
  border-radius: 8rpx 0 0 8rpx;
  transition: width 0.3s;
}

.score-bar-inner.full {
  border-radius: 8rpx;
}

.review-more {
  width: 96rpx;
  font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;
  font-weight: 500;
  font-size: 24rpx;
  color: #EE781F;
  line-height: 24rpx;
  text-align: right;
  font-style: normal;
  position: absolute;
  right: 21rpx;
  top: 8rpx;
}

.review-more-icon {
  position: absolute;
  right: 0;
  top: 8rpx;
  width: 11rpx;
  height: 18rpx;
  background-image: url("@/static/base/shape.png");
  background-size: cover;
  background-position: center;
}

.line {
  height: 1rpx;
  background: #E8E9EB;
  margin: 26rpx 0 26rpx 0;
}

.line2 {
  height: 1rpx;
  background: #E8E9EB;
  margin: 38rpx 0 28rpx 0;
}

.review-item {
  display: flex;
  align-items: flex-start;
  position: relative;
}

.review-avatar {
  width: 64rpx;
  height: 64rpx;
  border-radius: 50%;
  margin-right: 16rpx;
  background: #f3f3f3;
}

.review-content-wrap {
  flex: 1;
}

.review-user-row {
  display: flex;
  align-items: center;
  margin-bottom: 10rpx;
}

.review-user {
  color: #222;
  font-size: 26rpx;
  font-weight: 500;
}

.review-date {
  color: #aaa;
  font-size: 20rpx;
  margin-bottom: 10rpx;
}

.review-tags {
  display: flex;
  gap: 8rpx;
  margin-bottom: 6rpx;
}

.review-tag {
  background: #fff0e5;
  color: #ee781f;
  font-size: 20rpx;
  border-radius: 6rpx;
  padding: 2rpx 10rpx;
}

.review-content {
  width: auto;
  font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;
  font-weight: 400;
  font-size: 24rpx;
  color: #19191A;
  line-height: 34rpx;
  text-align: left;
  font-style: normal;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}

.review-more-bottom {
  height: 24rpx;
  font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;
  font-weight: 400;
  font-size: 24rpx;
  color: #6D7278;
  line-height: 24rpx;
  text-align: center;
  font-style: normal;
}

.hotel-facilities-box {
  background: #fff;
  border-radius: 28rpx;
  margin: 0 28rpx 0 28rpx;
  padding: 38rpx 20rpx 0 36rpx;
}

.hotel-facilities-list {
  display: flex;
  flex-direction: column;
  gap: 38rpx;
}

.facility-item2 {
  display: flex;
  align-items: flex-start;
  margin-bottom: 0;
}

.facility-icon-bg {
  width: 72rpx;
  height: 72rpx;
  background: #F5F6FA;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 28rpx;
  flex-shrink: 0;
}

.facility-img2 {
  width: 44rpx;
  height: 44rpx;
}

.facility-info {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.facility-title {
  font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;
  font-weight: 600;
  font-size: 32rpx;
  color: #19191A;
  line-height: 40rpx;
}

.facility-desc {
  font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;
  font-weight: 400;
  font-size: 26rpx;
  color: #AEB2B8;
  line-height: 36rpx;
  margin-top: 2rpx;
}

.facility-divider {
  height: 2rpx;
  background: #F0F1F3;
  margin: 38rpx 0 0 0;
}

.facility-more {
  height: 60rpx;
  font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;
  font-weight: 400;
  font-size: 28rpx;
  color: #6D7278;
  line-height: 60rpx;
  text-align: center;
  font-style: normal;
}

.hotel-location {
  background: #FFFFFF;
  border-radius: 28rpx;
  margin: 0 28rpx 0 28rpx;
}

.hotel-map {
  width: 100%;
  height: 200rpx;
  border-radius: 8rpx;
}

.location-address {
  margin-top: 10rpx;
  color: #888;
  font-size: 24rpx;
}

.location-route-btn {
  margin: 32rpx 0 0 0;
  background: #fff;
  border-radius: 0 0 28rpx 28rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100rpx;
  box-shadow: 0 -2rpx 8rpx 0 rgba(0, 0, 0, 0.02);
  cursor: pointer;
}

.location-route-icon {
  width: 36rpx;
  height: 36rpx;
  background: url('/static/base/navigation2.png') no-repeat center;
  background-size: contain;
  margin-right: 16rpx;
}

.location-route-text {
  color: #EE781F;
  font-size: 32rpx;
  font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;
  font-weight: 500;
}

.nav-bar-float {
  position: absolute;
  left: 0;
  top: -12rpx;
  width: 100%;
  min-height: 88rpx;
  z-index: 10;
  display: flex;
  align-items: center;
  padding-left: 16rpx;
  box-sizing: border-box;
}

.custom-back-btn {
  width: 72rpx;
  height: 72rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 50%;
}

.custom-back-right {
  width: 72rpx;
  height: 72rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 50%;
  margin-left: 378rpx;
  padding: 0;
  border: none;
  line-height: 1;
}

.custom-back-right::after {
  border: none;
}

.share-icon {
  width: 72rpx;
  height: 72rpx;
  display: block;
}

.back-icon {
  width: 72rpx;
  height: 72rpx;
}

.custom-indicator {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 32rpx;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 11;
}

.photoAlbum {
  position: absolute;
  left: 28rpx;
  bottom: 32rpx;
  transform: translateY(-50%);
  z-index: 12;
  width: 96rpx;
  height: 40rpx;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.indicator-capsule {
  display: flex;
  align-items: center;
  padding: 0 10rpx;
  height: 32rpx;
  background: #000;
  border-radius: 16rpx;
  opacity: 0.3;
  box-sizing: border-box;
  margin: 0 auto;
}

.indicator-dot {
  border-radius: 50%;
  width: 10rpx;
  height: 10rpx;
  background: #FFFFFF;
  opacity: 0.5;
  margin: 0 8rpx;
  transition: opacity 0.2s, background 0.2s;
}

.indicator-dot.active {
  opacity: 1;
  background: #fff;
}

.album-icon {
  width: 22rpx;
  height: 20rpx;
  background-image: url("https://zxd-hotel.xin/zxdhotel/2025/06/03/photoAlbum_20250603225504A005.png");
  background-position: center;
  background-size: cover;
  margin-right: 9rpx;
}

.album-text {
  width: 40rpx;
  height: 20rpx;
  font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;
  font-weight: 400;
  font-size: 20rpx;
  color: #FFFFFF;
  line-height: 20rpx;
  text-align: center;
  font-style: normal;
}

/* 添加遮挡层样式 */
.booking-mask {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  z-index: 1;
}

.mask-left {
  flex: 1;
  height: 100%;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}

.mask-left:active {
  background-color: transparent !important; /* 或者你想要的任何颜色 */
}

.mask-right {
  flex: 1;
  height: 100%;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}

.mask-right:active {
  background-color: transparent !important; /* 或者你想要的任何颜色 */
}

.mask-bed {
  width: 240rpx;
  height: 100%;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}

.mask-bed:active {
  background-color: transparent !important; /* 或者你想要的任何颜色 */
}

html, body, .hotel-detail {
  width: 100vw !important;
  max-width: 100vw !important;
  overflow-x: hidden !important;
}

/* 添加日历组件样式 */
.calendar-page {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
  background: #fff;
  transform: translateY(100%);
  transition: transform 0.3s ease-out;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

.calendar-page.show {
  transform: translateY(0);
}
</style>