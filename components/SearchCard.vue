<!--suppress JSUnresolvedReference -->
<template>
  <view class="search-card" :class="{'rounded': rounded, 'full-width': fullWidth}">
    <view class="search-row">
      <view class="city-arrow-wrap">
        <view class="map-city">
          <view class="city" @click="$emit('cityClick')">{{ displayLocation }}</view>
          <image class="city-arrow" src="/static/base/shape.png" mode="widthFix"/>
        </view>
        <view class="lbs-group" @click="handleLocationClick">
          <view class="location">我的位置</view>
          <image class="location-lbs" src="/static/base/lbs.png" mode="widthFix"/>
        </view>
      </view>
      <view class="close-btn" @click="handleClose" v-if="showClose">
        <image class="close-icon" src="/static/base/close.png" mode="aspectFit"/>
      </view>
    </view>
    <view class="search-info">
      <view class="date-picker-area" @click="onDateClick">
        <view class="search-info-item checkin">
          <view class="label">{{ getWeekDayIn(checkInDate) }}</view>
          <view class="value">{{ formatDateByIn(checkInDate) }}</view>
        </view>
        <view class="search-info-item search-info-item3">
          <view class="label"></view>
          <view class="">-</view>
        </view>
        <view class="search-info-item checkout">
          <view class="label">{{ getWeekDay(checkOutDate) }}</view>
          <view class="value">{{ formatDate(checkOutDate) }}</view>
        </view>
        <view class="search-info-item search-info-item3">
          <view class="label"></view>
          <view class="night-count-wrapper">
            <view class="night-count">共{{ nightCount }}晚</view>
            <view class="night-count-icon"></view>
          </view>
        </view>
      </view>
      <view class="search-info-item search-info-item2">
        <view class="label"></view>
        <view class="divider"></view>
      </view>
      <view class="search-info-item" @click="onBedClick">
        <view class="label">床位数</view>
        <view class="bed-count-wrapper">
          <view class="value">{{ bedCount }}</view>
          <view class="bed-count-icon"></view>
        </view>
      </view>
    </view>
    <view v-if="showZeroToSixPrompt" class="early-morning-background">
      <image class="early-morning-background-img" src="https://www.zxd-hotel.xin/zxdhotel/icon/yuel.png"
             mode="widthFix"/>
      <text v-if="iChoseEarlyMorning" class="early-morning-background-text">当前已过0点，你已选择凌晨{{
          hour
        }}点前入住
      </text>
      <text v-else class="early-morning-background-text">当前已过0点，如需今天凌晨{{
          hour
        }}点前入住，请选择“今天凌晨”
      </text>
    </view>
    <view class="search-btn" @click="handleSearch">{{ buttonText }}</view>
    <view v-if="filterOptions.length > 0" class="tags-wrapper">
      <scroll-view class="tags-scroll" scroll-x :show-scrollbar="false" enhanced :bounces="true" :scroll-with-animation="true">
        <view class="tags">
          <view class="tag-info" v-for="tag in filterOptions" @click="jumpPage(tag)">
            <image v-if="tag.searchIcon" :src="tag.searchIcon" class="tag-info-img" searchIcon/>
            <text class="tag-info-text">{{ tag.name }}</text>
          </view>
        </view>
      </scroll-view>
      <view class="tags-mask"></view>
    </view>
  </view>
</template>

<script>
export default {
  name: "SearchCard",
  props: {
    filterOptions: {
      type: Array,
      default: () => []
    },
    currentCity: {
      type: String,
      default: ''
    },
    currentDistrict: {
      type: String,
      default: ''
    },
    currentAddress: {
      type: String,
      default: ''
    },
    showDetailAddress: {
      type: Boolean,
      default: false
    },
    checkInDate: {
      type: String,
      default: ''
    },
    checkOutDate: {
      type: String,
      default: ''
    },
    nightCount: {
      type: Number,
      default: 1
    },
    bedCount: {
      type: Number,
      default: 1
    },
    showClose: {
      type: Boolean,
      default: false
    },
    rounded: {
      type: Boolean,
      default: false
    },
    fullWidth: {
      type: Boolean,
      default: false
    },
    buttonText: {
      type: String,
      default: '搜索酒店'
    },
    showZeroToSixPrompt: { // 决定着是否提示凌晨了
      type: Boolean,
      default: false
    },
    iChoseEarlyMorning: {// 决定了 用户是否选择了凌晨 如果选择了则需要在显示上 进行加1
      type: Boolean,
      default: false
    },
    cutoffTime: {
      type: String,
      default: '06:00'
    },
  },
  computed: {
    displayLocation() {
      if (this.showDetailAddress) {
        return this.currentAddress;
      }
      if (this.currentCity) {
        return `${this.currentCity}`;
      }
      return this.currentCity;
    }
  },
  data() {
    return {
      hour: 6
    }
  },
  async created() {
    // 获取节假日数据
    const [hours] = this.cutoffTime.split(':').map(Number);
    this.hour = Number(hours);
  },
  methods: {
    jumpPage(tag) {
      this.$emit('jumpPage', tag);
    },
    formatDateByIn(dateStr) {
      if (!dateStr) return '';
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
      if (!dateStr) return '';
      const date = new Date(dateStr);
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      return `${month}月${day}日`;
    },
    getWeekDayIn(dateStr) {
      if (!dateStr) return '';
      const date = new Date(dateStr);
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      // 重置时间部分以便比较日期
      today.setHours(0, 0, 0, 0);
      tomorrow.setHours(0, 0, 0, 0);
      date.setHours(0, 0, 0, 0);

      if (this.iChoseEarlyMorning) {
        return '今天凌晨';
      } else if (date.getTime() === today.getTime()) {
        return '今天';
      } else if (date.getTime() === tomorrow.getTime()) {
        return '明天';
      } else {
        const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
        return days[date.getDay()];
      }
    },
    getWeekDay(dateStr) {
      if (!dateStr) return '';
      const date = new Date(dateStr);
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      // 重置时间部分以便比较日期
      today.setHours(0, 0, 0, 0);
      tomorrow.setHours(0, 0, 0, 0);
      date.setHours(0, 0, 0, 0);

      if (date.getTime() === today.getTime()) {
        return '今天';
      } else if (date.getTime() === tomorrow.getTime()) {
        return '明天';
      } else {
        const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
        return days[date.getDay()];
      }
    },
    handleLocationClick() {
      this.$emit('locationClick');
    },
    onDateClick() {
      this.$emit('dateClick');
    },
    onBedClick() {
      this.$emit('bedClick');
    },
    handleSearch() {
      this.$emit('search');
    },
    handleClose() {
      this.$emit('close');
    }
  }
}
</script>

<style lang="scss" scoped>
.tags-wrapper {
  position: relative;
  margin-top: 30rpx;
  overflow: hidden;
}

.tags-scroll {
  white-space: nowrap;
}

.tags {
  display: inline-flex;
  gap: 10rpx;
  padding-right: 56rpx;

  .tag-info {
    display: inline-flex;
    align-items: center;
    justify-content: start;
    background: #F3F7FA;
    padding: 16rpx 22rpx;
    border-radius: 8rpx;
    flex-shrink: 0;
    white-space: nowrap;

    .tag-info-img {
      width: 26rpx;
      height: 28rpx;
      margin-right: 12rpx;
    }

    .tag-info-text {
      font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;
      font-weight: 400;
      font-size: 24rpx;
      color: #19191A;
      line-height: 24rpx;
      text-align: center;
      font-style: normal;
    }
  }
}

.tags-mask {
  position: absolute;
  top: 0;
  right: 0;
  width: 56rpx;
  height: 100%;
  background: linear-gradient(to left, #FFFFFF 0%, rgba(255, 255, 255, 0) 100%);
  pointer-events: none;
  z-index: 1;
}


.early-morning-background {
  height: 46rpx;
  background-image: url('https://www.zxd-hotel.xin/zxdhotel/icon/ht@2x.png');
  background-size: 100% 100%;
  background-position: center;
  background-repeat: no-repeat;
  margin: -50rpx 20rpx 24rpx 0;
  display: flex;
  align-items: center;

  .early-morning-background-img {
    width: 20rpx;
    height: 20rpx;
    margin: 0 10rpx 0 20rpx;
    padding-top: 8rpx;
  }

  .early-morning-background-text {
    font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;
    font-weight: 400;
    font-size: 20rpx;
    color: #FFFFFF;
    line-height: 20rpx;
    text-align: justify;
    font-style: normal;
    padding: 8rpx 24rpx 0 0;
  }
}

.search-card {
  background: #fff;
  margin: auto;
  box-shadow: 0 4rpx 24rpx rgba(0, 0, 0, 0.04);
  padding: 34rpx 28rpx 38rpx 28rpx;
  width: 640rpx;
  position: relative;
}

.search-card.rounded {
  border-radius: 28rpx;
  overflow: hidden;
}

.search-card.full-width {
  width: 90%;
}

.search-row {
  display: flex;
  justify-content: space-between;
  height: 66rpx;
  border-bottom: 1rpx solid #E8E9EB;
  margin-bottom: 26rpx;
  position: relative;
}

.close-btn {
  position: absolute;
  right: 0;
  top: 0;
  width: 40rpx;
  height: 40rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.close-icon {
  width: 32rpx;
  height: 32rpx;
}

.city-arrow-wrap {
  width: 100%;
  display: flex;
}

.map-city {
  width: 444rpx;
  position: relative;
}

.city {
  font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;
  font-weight: 500;
  font-size: 32rpx;
  color: #19191A;
  text-align: left;
  font-style: normal;
  width: auto;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;

}

.city-arrow {
  width: 12rpx;
  height: 20rpx;
  display: inline-block;
  position: absolute;
  right: 0;
  top: 14rpx;
}

.lbs-group {
  width: 182rpx;
  margin-left: 20rpx;
  position: relative;
}

.location {
  height: 24rpx;
  font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;
  font-weight: 500;
  font-size: 24rpx;
  color: #EE781F;
  text-align: left;
  font-style: normal;
  position: absolute;
  top: 6rpx;
}

.location-lbs {
  width: 32rpx;
  height: 32rpx;
  margin-right: 0;
  vertical-align: middle;
  position: absolute;
  top: 6rpx;
  right: 0;
}

.search-info {
  display: flex;
  align-items: center;
  background: #fff;
  border-radius: 12rpx;
  padding: 0 0 0 0;
  position: relative;
  margin-bottom: 50rpx;
}

.search-info-item {
  flex: none;
  text-align: left;
  min-width: 140rpx;
  margin: 0 8rpx;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}

.search-info-item:active {
  background-color: transparent !important; /* 或者你想要的任何颜色 */
}

.search-info-item2 {
  min-width: 0 !important;
}

.search-info-item3 {
  min-width: auto !important;
}

.search-info-item .label {
  width: auto;
  height: 24rpx;
  font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;
  font-weight: 400;
  font-size: 24rpx;
  color: #6D7278;
  line-height: 24rpx;
  text-align: left;
  font-style: normal;
  margin-bottom: 20rpx;
}

.search-info-item .value {
  font-size: 32rpx;
  font-weight: bold;
  color: #19191A;
}

.night-count-wrapper {
  display: inline-flex;
  align-items: center;
  gap: 8rpx;
}

.night-count {
  font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;
  font-weight: 400;
  font-size: 20rpx;
  color: #6D7278;
  line-height: 1;
  text-align: right;
  font-style: normal;
  white-space: nowrap;
}

.night-count-icon {
  width: 11rpx;
  height: 18rpx;
  background: url('/static/base/right.png');
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  flex-shrink: 0;
}

.bed-count-wrapper {
  display: inline-flex;
  align-items: center;
  gap: 8rpx;
}

.bed-count-icon {
  width: 11rpx;
  height: 18rpx;
  background: url('/static/base/right.png');
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  flex-shrink: 0;
  margin-left: 90rpx;
}

.divider {
  width: 2rpx;
  height: 32rpx;
  background: #E8E9EB;
  margin-left: 12rpx;
  margin-right: 12rpx;
}

.search-btn {
  width: 640rpx;
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
  margin: 0 auto;
  display: block;
}

.date-picker-area {
  display: flex;
  align-items: center;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}

.date-picker-area:active {
  background-color: transparent !important; /* 或者你想要的任何颜色 */
}

/* 弹窗样式 */
.search-card-popup {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000;
  box-shadow: 0 4rpx 24rpx rgba(0, 0, 0, 0.1);
}
</style> 