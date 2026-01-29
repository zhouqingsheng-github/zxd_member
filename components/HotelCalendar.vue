<template>
  <view class="calendar-wrapper">
    <!-- 顶部导航栏 -->
    <uni-nav-bar backgroundColor="#FFFFFF" :fixed="true" :shadow="false" :border="false" status-bar left-icon="left"
                 left-text=" " @clickLeft="back">
      <template #default>
        <text class="custom-navbar-title">选择日期
          <text style="font-size: 20rpx">(低价日历）</text>
        </text>
      </template>
      <template v-slot:right>
        <!-- 右侧什么都不放 -->
      </template>
    </uni-nav-bar>

    <!-- 加载中显示 -->
    <view v-if="loading" class="loading-container">
      <view class="loading-spinner"></view>
    </view>
    <!-- 多个月份循环 -->
    <template v-else>
      <view class="calendar-content-wrapper">
        <view class="calendar-week">
          <text v-for="(day, idx) in weekDays" :key="idx"
                :class="['week-text', idx === 0 || idx === 6 ? 'weekend' : '']"
                :style="[idx === 0 || idx === 6 ? 'color: ' + weekendColor : '']">
            {{ day }}
          </text>
        </view>
        <!--凌晨定房提示-->
        <view v-if="showZeroToSixPrompt" class="fixed-room-prompt">
          当前已过0点，如需今天凌晨{{ hour }}点前入住，请选择"今天凌晨"
        </view>
        <scroll-view class="calendar-scroll-area" scroll-y="true">
          <view v-for="(m, mIdx) in months" :key="mIdx">
            <view class="calendar-month-title">
              {{ m.year }}年{{ m.month + 1 }}月
            </view>
            <view class="calendar-days">
              <view v-for="(item, idx) in generateDays(m.year, m.month)" :key="idx"
                    :class="[getDayClass({...item, year: m.year, month: m.month}, idx), item.disabled?'disabled' : '']"
                    @click="selectDate({...item, year: m.year, month: m.month}, m.year, m.month)"
                    :style="item.day ? getRangeBgStyle(item, m.year, m.month) : ''">
                <view class="calendar-cell-content">
                  <view class="calendar-cell-top">
                    <template v-if="item.day">
                      <text v-if="item.isToday"
                            :class="[
                              isInRange({...item, year: m.year, month: m.month}) ? 'in-range-back-label' : 
                              isInRangeLabel(item, m.year, m.month) ? 'in-range-label' : ''
                            ]">
                        今天
                      </text>
                      <text v-if="item.isTomorrow"
                            :class="[
                              isInRange({...item, year: m.year, month: m.month}) ? 'in-range-back-label' : 
                              isInRangeLabel(item, m.year, m.month) ? 'in-range-label' : ''
                            ]">
                        明天
                      </text>
                      <text v-if="isYesterday(item.time) && showZeroToSixPrompt"
                            :class="[
                              isInRange({...item, year: m.year, month: m.month}) ? 'in-range-back-label' : 
                              isInRangeLabel(item, m.year, m.month) ? 'in-range-label' : ''
                            ]">
                        今天凌晨
                      </text>
                      <text v-if="item.festival"
                            :class="[
                              'festival-label', 
                              isInRange({...item, year: m.year, month: m.month}) ? 'in-range-back-label' : 
                              isInRangeLabel(item, m.year, m.month) ? 'in-range-label' : ''
                            ]"
                            :style="[
                          'margin-left: 4rpx',
                          'color: ' + (item.disabled ? '#A2A2A8' : festivalColor)
                        ]">
                        {{ item.festival }}
                      </text>
                    </template>
                  </view>
                  <text class="day-num" :style="['color: ' + getDayNumColor(item)]">
                    {{ getDisplayDay(item) }}
                  </text>
                  <text v-if="!getDayClassPrice({...item, year: m.year, month: m.month}, idx)"
                        style="height:26rpx;font-weight: 400;font-size: 20rpx;">
                    {{ getLowPrice(item) }}
                  </text>
                  <view class="calendar-cell-bottom">
                    <text v-if="isCheckInWithDate(item, m.year, m.month)">入住</text>
                    <text v-if="isCheckOutWithDate(item, m.year, m.month)">离店</text>
                  </view>
                </view>
              </view>
            </view>
          </view>
          <view class="calendar-month-t"></view>
        </scroll-view>
      </view>
    </template>
  </view>
</template>

<script>
import {getHolidays} from '@/common/api.js';
import UText from "../uni_modules/uview-ui/components/u-text/u-text.vue";

function toDateYMD(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export default {
  name: 'HotelCalendar',
  components: {UText},
  props: {
    festivalColor: {
      type: String,
      default: '#ff9800'
    },
    weekendColor: {
      type: String,
      default: '#ff9800'
    },
    dayColor: {
      type: String,
      default: '#171C3F'
    },
    rangeStartBg: {
      type: String,
      default: '#EE781F'
    },
    rangeEndBg: {
      type: String,
      default: '#EE781F'
    },
    rangeInBg: {
      type: String,
      default: '#FFEBDC'
    },
    rangeTextColor: {
      type: String,
      default: '#fff'
    },
    inRangeTextColor: {
      type: String,
      default: '#222'
    },
    value: {
      type: Array,
      default: () => []
    },
    //今天是否可选
    isItOptionalToday: {
      type: Boolean,
      default: true
    },
    calendarPrice: {
      type: Object,
      default: () => {
      }
    },
    // 添加新的属性
    cutoffTime: {
      type: String,
      default: '06:00'
    },
    automaticDerivation: {
      type: Number,
      default: 0
    },
  },
  data() {
    const today = toDateYMD(new Date());
    const maxDate = toDateYMD(new Date(today));
    maxDate.setDate(today.getDate() + 180); // 设置为180天后

    // 检查是否在凌晨时段且是1号
    const now = new Date();
    const [hours] = this.cutoffTime.split(':').map(Number);
    const isEarlyMorning = now.getHours() >= 0 && now.getHours() < hours;
    const isFirstDayOfMonth = now.getDate() === 1;

    // 生成月份
    const months = [];
    let y = today.getFullYear();
    let m = today.getMonth();

    // 如果是凌晨且是1号，添加上个月
    if (isEarlyMorning && isFirstDayOfMonth) {
      const prevMonth = m - 1;
      const prevYear = prevMonth < 0 ? y - 1 : y;
      const prevMonthValue = prevMonth < 0 ? 11 : prevMonth;
      months.push({year: prevYear, month: prevMonthValue});
    }

    const endDate = new Date(today);
    endDate.setDate(today.getDate() + 180);
    const endYear = endDate.getFullYear();
    const endMonth = endDate.getMonth();

    while (y < endYear || (y === endYear && m <= endMonth)) {
      months.push({year: y, month: m});
      m++;
      if (m > 11) {
        m = 0;
        y++;
      }
    }
    return {
      months,
      minDate: today,
      maxDate: maxDate,
      checkInDate: this.value[0] || '',
      checkOutDate: this.value[1] || '',
      weekDays: ['日', '一', '二', '三', '四', '五', '六'],
      holidays: {},// 存储节假日数据
      loading: true,// 添加loading状态,
      showZeroToSixPrompt: false, // 显示0-6点提示
      currentHour: new Date().getHours(), // 当前小时
      timeInterval: null, // 定时器
      hour: 6,
      iChoseEarlyMorning: false,
    };
  },
  async created() {
    // 获取节假日数据
    const [hours] = this.cutoffTime.split(':').map(Number);
    this.hour = Number(hours);
    await this.fetchHolidays();
    // 初始化时间判断
    this.checkTimeForPrompt();
    // 设置定时器，每分钟检查一次时间
    this.timeInterval = setInterval(() => {
      this.checkTimeForPrompt();
    }, 60000); // 每分钟检查一次
  },
  watch: {
    value: {
      handler(val) {
        if (Array.isArray(val) && val.length === 2) {
          if (this.checkInDate !== val[0]) {
            this.checkInDate = val[0];
          }
          if (this.checkOutDate !== val[1]) {
            this.checkOutDate = val[1];
          }
        }
      },
      immediate: true,
      deep: true
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
    // 检查时间显示提示
    checkTimeForPrompt() {
      const now = new Date();
      this.currentHour = now.getHours();
      this.showZeroToSixPrompt = this.currentHour >= 0 && this.currentHour < this.hour;
    },
    back() {
      this.$emit('close');
    },
    // 获取节假日数据
    async fetchHolidays() {
      try {
        // 获取所有需要查询的年月
        const yearMonths = this.months.map(m => `${m.year}-${String(m.month + 1).padStart(2, '0')}`);
        const res = await getHolidays(yearMonths);
        if (res) {
          this.holidays = res;
        }
      } catch (e) {
        console.error('获取节假日数据失败:', e);
      } finally {
        this.loading = false; // 无论成功失败都关闭loading
      }
    },
    generateDays(year, month) {
      const days = [];
      const date = new Date(year, month, 1);
      const today = this.minDate;
      const maxDate = this.maxDate;

      // 判断是否在允许预订前一天的时间范围内
      const now = new Date();
      const cutoff = new Date();
      const [hours, minutes] = this.cutoffTime.split(':').map(Number);
      cutoff.setHours(hours, minutes, 0, 0);

      // 如果当前时间在截止时间之前且允许选择今天，允许选择前一天
      let actualToday = today;
      if (this.isItOptionalToday && now < cutoff) {
        actualToday = new Date(today);
        actualToday.setDate(today.getDate() - 1);
      }

      // "今天"和"明天"的标识应该基于真实的日期，而不是可选范围
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);

      const firstDay = date.getDay();
      const lastDate = new Date(year, month + 1, 0).getDate();

      // 用于记录已经显示过的节日
      const shownFestivals = new Set();

      for (let i = 0; i < firstDay; i++) {
        days.push({
          day: '',
          festival: '',
          time: '',
          isToday: false,
          isTomorrow: false,
          disabled: true,
        });
      }
      for (let d = 1; d <= lastDate; d++) {
        const curDate = toDateYMD(new Date(year, month, d));
        // 修改这里，使用 actualToday 而不是 today
        const disabled = (!this.isItOptionalToday && curDate.getTime() === actualToday.getTime()) ||
            curDate < actualToday || curDate > maxDate;
        const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
        const festival = this.holidays[dateKey] || '';

        // 如果是节日，检查是否已经显示过
        let displayFestival = festival;
        if (festival && !festival.endsWith('休')) {
          const baseFestival = festival.replace('节', '');
          if (shownFestivals.has(baseFestival)) {
            displayFestival = '休';
          } else {
            shownFestivals.add(baseFestival);
          }
        }

        days.push({
          day: d,
          festival: displayFestival,
          time: `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`,
          isToday:
              year === today.getFullYear() &&
              month === today.getMonth() &&
              d === today.getDate(),
          isTomorrow:
              year === tomorrow.getFullYear() &&
              month === tomorrow.getMonth() &&
              d === tomorrow.getDate(),
          disabled,
        });
      }
      while (days.length % 7 !== 0) {
        days.push({
          day: '',
          festival: '',
          isToday: false,
          isTomorrow: false,
          disabled: true,
        });
      }
      return days;
    },
    selectDate(item, year, month) {
      if (!item.day || item.disabled) return;

      // 格式化日期字符串，确保月份和日期都是两位数
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(item.day).padStart(2, '0')}`;

      if (!this.checkInDate || (this.checkInDate && this.checkOutDate)) {
        // 选择入住日期
        this.checkInDate = dateStr;
        // 如果今天不可选，则自动选择次日作为离店日期
        if (!this.isItOptionalToday) {
          const selectedDate = new Date(year, month, item.day);
          const nextDate = new Date(selectedDate);
          nextDate.setDate(selectedDate.getDate() + 1);

          const nextYear = nextDate.getFullYear();
          const nextMonth = nextDate.getMonth();
          const nextDay = nextDate.getDate();

          const nextDateStr = `${nextYear}-${String(nextMonth + 1).padStart(2, '0')}-${String(nextDay).padStart(2, '0')}`;
          this.checkOutDate = nextDateStr;
        } else {
          this.checkOutDate = '';
        }
        if (this.automaticDerivation > 0) {
          // 说明采取自动推导离店时间
          const selectedDate = new Date(year, month, item.day);
          const nextDate = new Date(selectedDate);
          nextDate.setDate(selectedDate.getDate() + this.automaticDerivation);
          const nextYear = nextDate.getFullYear();
          const nextMonth = nextDate.getMonth();
          const nextDay = nextDate.getDate();
          const nextDateStr = `${nextYear}-${String(nextMonth + 1).padStart(2, '0')}-${String(nextDay).padStart(2, '0')}`;
          this.checkOutDate = nextDateStr;
        }
      } else if (!this.checkOutDate) {
        // 选择离店日期
        const inDate = new Date(this.checkInDate.replace(/-/g, '/'));
        const outDate = new Date(dateStr.replace(/-/g, '/'));

        if (outDate.getTime() > inDate.getTime()) {
          //计算入住天数
          const nights = this.getNights(this.checkInDate, dateStr);
          if (nights > 30) {
            uni.showToast({
              title: '最多只能选择30天',
              icon: 'none'
            });
            return;
          }
          this.checkOutDate = dateStr;
        } else {
          this.checkInDate = dateStr;
          // 如果今天不可选，则自动选择次日作为离店日期
          if (!this.isItOptionalToday) {
            const selectedDate = new Date(year, month, item.day);
            const nextDate = newDate(selectedDate);
            nextDate.setDate(selectedDate.getDate() + 1);

            const nextYear = nextDate.getFullYear();
            const nextMonth = nextDate.getMonth();
            const nextDay = nextDate.getDate();

            const nextDateStr = `${nextYear}-${String(nextMonth + 1).padStart(2, '0')}-${String(nextDay).padStart(2, '0')}`;
            this.checkOutDate = nextDateStr;
          }
        }
      }

      // 只在区间完整时触发事件并自动关闭
      if (this.checkInDate && this.checkOutDate) {
        const nights = this.getNights(this.checkInDate, this.checkOutDate);
        const iChoseEarlyMorning = this.showZeroToSixPrompt && this.isYesterday(this.checkInDate);
        this.$emit('change', {
          detail: [this.checkInDate, this.checkOutDate, nights],
          iChoseEarlyMorning: iChoseEarlyMorning,
          showZeroToSixPrompt: this.showZeroToSixPrompt
        });
        // 添加延迟关闭
        setTimeout(() => {
          this.$emit('close');
        }, 800);
      }
    },
    isYesterday(dateStr) {
      if (!dateStr) return false;
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const checkDate = new Date(dateStr.replace(/-/g, '/'));
      return checkDate.getFullYear() === yesterday.getFullYear() &&
          checkDate.getMonth() === yesterday.getMonth() &&
          checkDate.getDate() === yesterday.getDate();
    },
    getNights(checkIn, checkOut) {
      const inDate = new Date(checkIn.replace(/-/g, '/'));
      const outDate = new Date(checkOut.replace(/-/g, '/'));
      return Math.round((outDate.getTime() - inDate.getTime()) / (1000 * 60 * 60 * 24));
    },
    getDayClass(item, idx) {
      let cls = 'calendar-day';
      if (!item.day) cls += ' empty';
      if (this.isCheckIn(item)) cls += ' range-start';
      if (this.isCheckOut(item)) cls += ' range-end';
      if (this.isInRange(item)) cls += ' in-range';
      if (item.disabled) cls += ' disabled';
      return cls;
    },
    getDayClassPrice(item, idx) {
      if (!item.day) {
        return true;
      } else {
        return false;
      }
    },
    getLowPrice(item) {
      if (this.calendarPrice) {
        return this.calendarPrice[item.time] ? '￥' + this.calendarPrice[item.time] : '';
      }
      return ''
    },
    formatDateStr(dateStr) {
      if (!dateStr) return '';
      const parts = dateStr.split('-');
      return `${parts[0]}-${parts[1].padStart(2, '0')}-${parts[2].padStart(2, '0')}`;
    },
    isCheckIn(item) {
      if (!item.day) return false;
      const itemDate = `${item.year}-${String(item.month + 1).padStart(2, '0')}-${String(item.day).padStart(2, '0')}`;
      return this.formatDateStr(this.checkInDate) === itemDate;
    },
    isCheckOut(item) {
      if (!item.day) return false;
      const itemDate = `${item.year}-${String(item.month + 1).padStart(2, '0')}-${String(item.day).padStart(2, '0')}`;
      return this.formatDateStr(this.checkOutDate) === itemDate;
    },
    isInRange(item) {
      if (!item.day || !this.checkInDate || !this.checkOutDate) return false;
      const itemDate = new Date(`${item.year}/${String(item.month + 1).padStart(2, '0')}/${String(item.day).padStart(2, '0')}`);
      const inDate = new Date(this.formatDateStr(this.checkInDate).replace(/-/g, '/'));
      const outDate = new Date(this.formatDateStr(this.checkOutDate).replace(/-/g, '/'));
      return itemDate.getTime() > inDate.getTime() && itemDate.getTime() < outDate.getTime();
    },
    formatDate(date) {
      const y = date.getFullYear();
      const m = date.getMonth() + 1;
      const d = date.getDate();
      return `${y}-${m}-${d}`;
    },
    getRangeLabelClass(item, year, month) {
      if (
          this.isCheckIn({...item, year, month}) ||
          this.isCheckOut({...item, year, month}) ||
          this.isInRange({...item, year, month})
      ) {
        return 'in-range-label';
      }
      return '';
    },
    getRangeBgStyle(item, year, month) {
      const fullItem = {
        day: item.day,
        year: year,
        month: month
      };
      if (this.isCheckIn(fullItem)) {
        return 'background: ' + this.rangeStartBg;
      }
      if (this.isCheckOut(fullItem)) {
        return 'background: ' + this.rangeEndBg;
      }
      if (this.isInRange(fullItem)) {
        return 'background: ' + this.rangeInBg;
      }
      return '';
    },
    getDayNumColor(item) {
      if (this.isCheckIn(item) || this.isCheckOut(item)) {
        return this.rangeTextColor;
      }
      if (this.isInRange(item)) {
        return this.inRangeTextColor;
      }
      if (item.disabled) {
        return '#A2A2A8';
      }
      return this.dayColor;
    },
    isInRangeLabel(item, year, month) {
      const fullItem = {
        day: item.day,
        year: year,
        month: month
      };
      return this.isCheckIn(fullItem) || this.isCheckOut(fullItem) || this.isInRange(fullItem);
    },

    getDisplayDay(item) {
      if (this.showZeroToSixPrompt && this.isYesterday(item.time)) {
        //处理今天凌晨的显示，考虑跨月和跨年的情况
        const today = new Date();
        return today.getDate();
      }
      return item.day;
    },

    isCheckInWithDate(item, year, month) {
      return this.isCheckIn({...item, year, month});
    },

    isCheckOutWithDate(item, year, month) {
      return this.isCheckOut({...item, year, month});
    },

  },
};
</script>

<style lang="scss" scoped>
.calendar-month-t {
  height: 200rpx;
  width: 100%;
}

.fixed-room-prompt {
  text-align: center;
  height: 48rpx;
  background: #FFF5D8;
  line-height: 48rpx;
  font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;
  font-weight: 400;
  font-size: 20rpx;
  color: #171C3F;
  text-align: center;
  font-style: normal;
}

.custom-navbar-title {
  width: 100%;
  height: 100rpx;
  font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;
  font-weight: 500;
  font-size: 32rpx;
  color: #19191A;
  line-height: 100rpx;
  text-align: center;
  font-style: normal;
}

.calendar-wrapper {
  background: #fff;
  margin: 0 0 12px 0;
  overflow: hidden;
}

.calendar-content-wrapper {
  position: fixed;
  top: 188rpx;
  left: 0;
  right: 0;
  bottom: 0;
  background: #fff;
  z-index: 997;
  /*略低于导航栏的z-index */
}

.calendar-scroll-area {
  height: calc(100vh - var(--window-top) - 80rpx);
  /* 减去顶部区域高度 */
}

.calendar-week {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #b0b0b0;
  font-size: 13px;
  font-weight: 400;
  background: #fff;
}

.week-text {
  flex: 1;
  text-align: center;
  color: #b0b0b0;
  font-size: 13px;
  font-weight: 400;
  letter-spacing: 1px;
}

.weekend {
  color: #ff9800;
  font-weight: 500;
}

.calendar-month-title {
  text-align: center;
  font-size: 20px;
  font-weight: 600;
  color: #222;
  /*margin: 12px 0 46rpx 0;*/
}

.calendar-days {
  display: flex;
  flex-wrap: wrap;
  background: #fff;
  /*padding-bottom: 8px;*/
}

.calendar-day {
  width: 14.2%;
  height: 130rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 4px;
  border-radius: 0;
  position: relative;
  background: #fff;
  transition: background 0.2s, color 0.2s;
}

.calendar-day.empty {
  background: #fff;
}

.calendar-cell-content {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.calendar-cell-top,
.calendar-cell-bottom {
  height: 20rpx;
  font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;
  font-weight: 400;
  font-size: 20rpx;
  color: #FFFFFF;
  line-height: 20rpx;
  text-align: center;
  font-style: normal;
}

.day-num {
  font-size: 18px;
  font-weight: 500;
  height: 24px;
  line-height: 24px;
  text-align: center;
  color: #171C3F;
}

.calendar-day.range-start,
.calendar-day.range-end {
  background: #EE781F;
  color: #fff;
  border-radius: 0;
}

.calendar-day.range-start .day-num,
.calendar-day.range-end .day-num {
  color: #fff;
}

.calendar-day.in-range {
  background: #FFEBDC;
  color: #222;
  border-radius: 0;
}

.calendar-cell-top {
  height: 20rpx;
  font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;
  font-weight: 400;
  font-size: 20rpx;
  color: #19191A;
  line-height: 20rpx;
  text-align: center;
  font-style: normal;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}

.festival-label {
  color: #ff9800;
  font-size: 20rpx;
  font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;
  font-weight: 400;
  line-height: 20rpx;
  font-style: normal;
}

.in-range-label {
  color: #fff !important;
}

.in-range-back-label {
  color: #000 !important;
}

.disabled {
  color: #A2A2A8 !important;
  background: none !important;
  pointer-events: none;
  cursor: not-allowed;
  opacity: 1;
}

.calendar-day.disabled,
.calendar-day.disabled .day-num,
.calendar-day.disabled .calendar-cell-top,
.calendar-day.disabled .calendar-cell-bottom,
.calendar-day.disabled .festival-label {
  color: #A2A2A8 !important;
}

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 400rpx;
}

.loading-spinner {
  width: 40rpx;
  height: 40rpx;
  border: 4rpx solid #f3f3f3;
  border-top: 4rpx solid #EE781F;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.calendar-header-placeholder {
  height: 100rpx;
  /* 等于导航栏高度 */
}
</style>