<template>
  <view class="order-container">
    <uni-nav-bar
        :shadow="false"
        :border="false"
        :fixed="true"
        left-icon="left"
        status-bar
        @clickLeft="goBack">
      <template #default>
        <text class="nav-title">填写订单</text>
      </template>
    </uni-nav-bar>

    <!-- 添加加载状态 -->
    <view v-if="loading" class="loading-container">
      <view class="loading-content">
        <view class="loading-spinner"></view>
        <text class="loading-text">加载中...</text>
      </view>
    </view>

    <!-- 酒店与房型信息 -->
    <view v-else class="order-hotel-box">
      <view class="hotel-title">{{ orderData.hotelName }}</view>
      <view class="hotel-desc">
        <view class="map-icon"></view>
        <text class="hotel-desc-text">{{ orderData.hotelAddress }}</text>
      </view>
      <view class="line"></view>
      <view class="order-date-row" @click="onSelectDate">
        <view class="date-left">
          <text class="date-main">{{ formatDateIn(orderData.checkInDate) }}</text>
          <text class="date-week">{{ getWeekDay(orderData.checkInDate) }}</text>
        </view>
        <view class="nights-tag">共{{ calculateNights() }}晚</view>
        <view class="date-right">
          <text class="date-main">{{ formatDate(orderData.checkOutDate) }}</text>
          <text class="date-week">{{ getWeekDay(orderData.checkOutDate) }}</text>
        </view>
      </view>
      <view class="order-room-row">
        <text class="room-type">{{ orderData.roomTypeName }}</text>
        <view class="room-divider"></view>
        <text class="bed-count">{{ orderData.saleMode === 1 ? '房间数' : '床位数' }}：{{ orderData.roomCount }}</text>
      </view>
    </view>
    <view v-if="type_order==='1'" class="early-morning-tip">
      <image src="https://www.zxd-hotel.xin/zxdhotel/icon/txicon@2x.png" mode="widthFix"
             class="early-morning-tip-icon"/>
      <view class="early-morning-tip-text">
        <text>您预定的是连住套餐，不可提前取消，详情请咨询前台工作人员</text>
      </view>
    </view>

    <!-- 订房信息 -->
    <view v-if="!loading" class="form-title">订房信息</view>
    <view v-if="!loading" class="order-form-box">
      <view class="form-row">
        <text class="form-label">所需{{ orderData.saleMode === 1 ? '房间数' : '床位数' }}
          <text class="required">*</text>
        </text>
        <view class="bed-count-ctrl">
          <view
              :class="['bed-btn-img', orderData.roomCount <= 1 || type ? 'disabled' : '']"
              @click="changeBed(-1)"
          ></view>
          <text class="bed-num">{{ orderData.roomCount }}</text>
          <view
              :class="['bed-btn-img plus', orderData.roomCount >= 20 || type ? 'disabled' : '']"
              @click="changeBed(1)"
          ></view>
        </view>
      </view>
      <view class="order-row-line"></view>
      <view class="line-group" v-for="(guest, idx) in orderData.guestList" :key="idx">
        <view class="form-row">
          <text class="form-label">入住人{{ chineseNumbers[idx] }}
            <text class="required">*</text>
          </text>
          <input class="form-input" v-model="orderData.guestList[idx].guestName" :placeholder="`请输入入住人姓名`"/>
        </view>
        <view class="order-row-line"></view>
      </view>
      <view class="form-row">
        <text class="form-label">手机号
          <text class="required">*</text>
        </text>
        <input class="form-input" v-model="orderData.contactPhone" placeholder="请输入手机号"
               @blur="validatePhone" type="number" maxlength="11"/>
      </view>
      <!--      <view class="order-row-line"></view>
            <view class="form-row form-row-vertical">
              <view class="form-label-row">
                <text class="form-label">
                  <text class="info-text">预计到店时间</text>
                  <text class="info-icon"></text>
                </text>
              </view>
              <view class="arrive-time-group">
                <view class="arrive-time-row" v-for="(row, rowIdx) in arriveTimesRows" :key="rowIdx">
                  <view
                      v-for="(item, idx) in row"
                      :key="item"
                      :class="['arrive-time-btn', { 'active': arriveIndex === (rowIdx * 3 + idx) }]"
                      @click="arriveIndex = rowIdx * 3 + idx"
                  >{{ item }}
                  </view>
                </view>
                <view class="late-arrive-row" @click="lateArriveChecked = !lateArriveChecked">
                  <radio :checked="lateArriveChecked" color="#EE781F" style="transform:scale(0.8);margin-right:10rpx;"/>
                  <text class="late-arrive-text">到店时间可能晚于22:00，请酒店留房</text>
                </view>
              </view>
            </view>-->
    </view>

    <!-- 费用明细 -->
    <view v-if="!loading" class="form-title">费用明细</view>
    <view v-if="!loading" class="order-fee-box">
      <!-- 房费总览，可点击展开/收起 -->
      <template v-if="!type">
        <view class="fee-row fee-room-toggle" @click="feeDetailExpand = !feeDetailExpand">
          <text>房费（{{ calculateNights() }}晚）</text>
          <view class="fee-room-right">
            <text class="price">￥{{ orderData.totalOriginalPrice }}</text>
            <image
                src="/static/base/right.png"
                class="arrow-icon"
                :style="{ transform: feeDetailExpand ? 'rotate(-90deg)' : 'rotate(90deg)' }"
                mode="aspectFit"
                width="32rpx"
                height="32rpx"
            />
          </view>
        </view>
        <view v-if="feeDetailExpand && orderData.roomFeeDetails && orderData.roomFeeDetails.length"
              class="fee-detail-list-simple">
          <!-- 新增：平均每晚 -->
          <view class="fee-detail-avg-row">
            平均每晚￥{{ orderData.avgNightPrice }}
          </view>
          <view class="fee-detail-item-simple" v-for="item in groupedFeeDetailsByDate" :key="item.date">
            <text class="fee-detail-date-simple">{{ item.date }}</text>
            <text class="fee-detail-count-simple" v-if="item.count > 1">×{{ item.count }}</text>
            <text class="fee-detail-amount-simple">
              ￥{{ item.actualPrice.toFixed(2) }}
              <text v-if="item.discountSharing > 0 || (item.originalPrice-item.discountPrice)>0">
                (￥{{ item.discountDescription.toFixed(2) }})
              </text>
            </text>
          </view>
        </view>
      </template>
      <template v-else>
        <view class="fee-row">
          <text>房费</text>
          <text class="fee-discount">￥{{ orderData.totalOriginalPrice }}</text>
        </view>
      </template>

      <!-- 会员优惠、红包抵扣、应付总额等保留 -->
      <view class="fee-row" v-if="!type && orderData.limitTimeDiscount > 0">
        <text>限时优惠</text>
        <text class="fee-discount">减￥{{ orderData.limitTimeDiscount }}</text>
      </view>
      <view v-if="type" class="fee-row">
        <text>第三方抵扣</text>
        <text class="fee-discount">减￥{{ orderData.threePartyDeduction }}</text>
      </view>
      <!--      <view v-if="!type" class="fee-row">-->
      <!--        <text>会员优惠</text>-->
      <!--        <text class="fee-discount">减￥{{ orderData.memberDiscount }}</text>-->
      <!--      </view>-->
      <view v-if="!type" class="fee-row">
        <view>红包抵扣</view>
        <view class="free-coupon" v-if="couponList.length > 0 && orderData.redPacketDiscount >= 0"
              @click="onCouponClick">
          <text class="fee-discount">减￥{{ orderData.redPacketDiscount }}</text>
          <view class="hotel-info-l">
            <uni-icons type="arrowright" size="14" color="#A2A2A8"></uni-icons>
          </view>
        </view>
        <view class="free-coupon" v-else @click="couponList.length > 0 ? onCouponClick : null"
              :class="{'disabled': couponList.length === 0}">
          <text class="fee-discount" v-if="couponList.length > 0">减￥{{ couponList[0].redPacket.amount }}</text>
          <text class="fee-disable" v-else>暂无可用红包</text>
          <view class="hotel-info-l" v-if="couponList.length > 0">
            <uni-icons type="arrowright" size="14" color="#A2A2A8"></uni-icons>
          </view>
        </view>
      </view>
      <view class="fee-row fee-total">
        <text>应付总额</text>
        <text class="fee-total-num">
          <text class="currency">￥</text>
          {{ orderData.totalAmount }}
        </text>
      </view>
    </view>

    <!-- 支付方式 -->
    <template v-if="!type && !loading">
      <view class="pay-title">选择支付方式</view>
      <view class="pay-method-section">
        <view class="pay-method" @click="selectPayMethod(1)">
          <image class="icon" src="/static/base/weixin.png" mode="aspectFill"/>
          <view class="text">微信支付</view>
          <image
              :src="orderData.paymentMethod === 1 ? '/static/base/radio_checked_da.png' : '/static/base/radio_unchecked_da.png'"
              class="custom-radio"
              mode="aspectFit"
              @click.stop="selectPayMethod(1)"
          />
        </view>
        <!--      <view class="line"></view>
              <view class="pay-method" @click="selectPayMethod(2)">
                <image class="icon" src="/static/base/alipay.png"/>
                <view class="text">支付宝支付</view>
                <image
                  :src="orderData.paymentMethod === 2 ? '/static/base/radio_checked.png' : '/static/base/radio_unchecked.png'"
                  class="custom-radio"
                  @click.stop="selectPayMethod(2)"
                />
              </view>-->
      </view>
      <view class="notice">
        预订须知：</br>
        预订成功后，入住当日18点前可免费取消。18-21点取消需支付当天房费30%违约金，21点后不可取消，建议您提前做好出行规划。办理入住时需出示有效证件。
      </view>
    </template>
    <template v-else-if="type && !loading">
      <view class="notice">
        预订须知：</br>
        为保障您的预订权益，第三方平台订单自入住当天 零点起即不可取消或调整，敬请谅解
      </view>
    </template>

    <!-- 新增底部固定区域 -->
    <view v-if="!loading" class="order-bottom-fixed">
      <view class="order-agree-bar">
        <image
            :src="agreeChecked ? '/static/base/radio_checked.png' : '/static/base/radio_unchecked.png'"
            class="custom-radio custom-radio-min"
            mode="aspectFit"
            @click="toggleAgree"
        />
        <view class="agree-text" @click="toggleAgree">
          我已阅读并同意
          <text class="agree-link" @click.stop="goToBookingNotice">《预订须知》</text>
          和
          <text class="agree-link" @click.stop="goToPaymentAgreement">《支付服务协议》</text>
        </view>
      </view>
      <view class="order-bottom-bar-new">
        <view class="order-bottom-left">
          <text class="bottom-label">应付总额</text>
          <view class="bottom-amount">
            <text class="bottom-currency">￥</text>
            <text class="bottom-num">{{ orderData.totalAmount.toFixed(2) }}</text>
          </view>
        </view>
        <view
            class="order-bottom-btn"
            :class="{ disabled: !agreeChecked }"
            @click="agreeChecked && submitOrder()"
        >提交订单并支付{{ orderData.totalAmount }}元
        </view>
      </view>
    </view>

    <!-- 优惠券选择弹窗 -->
    <view v-if="showCouponPopup && !loading" class="coupon-popup-mask">
      <view class="coupon-popup">
        <view class="bed-picker-header">
          <text class="coupon-popup-title">选择红包</text>
          <text class="close-icon" @click="onCouponCancel"/>
        </view>
        <view class="coupon-list">
          <view class="coupon-card" v-for="coupon in couponList" :key="coupon.id">
            <view class="coupon-item"
                  @click.stop="onCouponSelect(coupon.id)">
              <view class="coupon-info">
                <view class="coupon-info-l">
                  <view class="coupon-info-l-title">
                    {{ coupon.redPacket.name }}
                  </view>
                  <view class="coupon-info-l-time">
                    有效期{{ formatDateRed(coupon.redPacket.startTime) }}-{{ formatDateRed(coupon.redPacket.endTime) }}
                  </view>
                  <view class="coupon-info-l-tag">
                    <text v-if="coupon.redPacket.minSpend > 0" class="tag">满{{
                        coupon.redPacket.minSpend
                      }}元可用
                    </text>
                    <text v-else class="tag">无门槛立减</text>
                    <text v-if="coupon.redPacket.scopeType === 1"
                          class="tag">适用于全部门店
                    </text>
                    <text v-else class="tag">适用于指定门店</text>
                    <text v-if="coupon.redPacketRule.stayDays > 0" class="tag">
                      适用于连续{{ coupon.redPacketRule.stayDays }}晚及以上订单
                    </text>
                  </view>
                </view>
                <view class="coupon-info-r">
                  <view class="coupon-info-r-amount-box">
                    <view class="coupon-info-r-amount">{{ coupon.redPacket.amount }}</view>
                    <view class="coupon-info-r-unit">元</view>
                  </view>
                </view>
              </view>
              <view v-if="coupon.soonExpire" class="coupon-tag-expired"></view>
              <view v-if="coupon.soonExpire" class="coupon-tag-expired-text">即将到期</view>
            </view>
            <view class="coupon-radio">
              <image
                  :src="selectedCouponId === coupon.id ? '/static/base/radio_checked_da.png' : '/static/base/radio_unchecked_da.png'"
                  class="custom-radio"
                  mode="aspectFit"
                  @click.stop="onCouponSelect(coupon.id)"
              />
            </view>
          </view>
        </view>
        <view class="coupon-popup-actions-new">
          <view class="no-coupon-row" @click.stop>
            <radio :checked="selectedCouponId === null" color="#EE781F" style="transform:scale(0.8);margin-right:12rpx;"
                   @click.stop="onCouponSelect(null)"/>
            <text class="no-coupon-text">不使用红包</text>
          </view>
          <view class="coupon-btn-main" @click="onCouponConfirm">确定</view>
        </view>
      </view>
    </view>

    <!-- 添加日历组件 -->
    <HotelCalendar
        v-if="showCalendar && !loading"
        @change="onCalendarConfirm"
        @close="showCalendar = false"
        :value="[orderData.checkInDate, orderData.checkOutDate]"
        :isItOptionalToday=!type
        :class="['calendar-page', showCalendar ? 'show' : '']"
        :cutoffTime="cutoffTime"
    />
  </view>
</template>

<script>
import {
  calculateThePrice,
  createOrder,
  getAvailableRedEnvelopeList,
  getHistoryCheckInPerson,
  getRoomInfo,
  placeAnOrder,
  getCutoffTime
} from "../../../common/api";
import HotelCalendar from '@/components/HotelCalendar.vue';
import {pageBack} from "../../../common/redirect";

export default {
  components: {
    HotelCalendar
  },
  data() {
    return {
      showZeroToSixPrompt: false, // 决定着是否提示凌晨了
      iChoseEarlyMorning: false,//决定了用户是否选择了凌晨如果选择了 则需要在显示上进行加1
      type_order: 0,
      cutoffTime: '06:00',
      thirdOrderId: null,
      thirdRoomName: null,
      type: false,
      loading: true, // 添加加载状态
      // 订单数据
      orderData: {
        hotelId: 1,
        hotelName: "",
        hotelAddress: "",
        roomTypeId: 1,
        roomTypeName: "",
        roomCount: 2,
        checkInDate: "",
        checkOutDate: "",
        contactName: "",
        contactPhone: "",
        arrivalTime: "",
        guestList: [],
        roomFee: 0,
        memberDiscount: 0,
        redPacketDiscount: 0,
        redPacketId: null,
        totalAmount: 0,
        paymentMethod: 1,
        avgNightPrice: '0.00',
        deductOrderId: null,
        limitTimeDiscount: 0,
        threePartyDeduction: 0,
        threePartyDeduction: 0,
        totalOriginalPrice: 0,
        saleMode: 0,
      },
      dailyPrices: [], // 添加存储每天价格的数组
      // UI控制数据
      arriveTimes: ['14:00-16:00', '16:00-18:00', '18:00-20:00', '20:00-22:00', '次日00:00-06:00'],
      arriveIndex: 0,
      chineseNumbers: ['①', '②', '③', '④', '⑤', '⑥', '⑦', '⑧', '⑨', '⑩'],
      lateArriveChecked: false,
      agreeChecked: false,
      showCouponPopup: false, // 控制优惠券弹窗显示
      selectedCouponId: null, // 临时选中的优惠券id
      couponList: [],
      first: false,
      showCalendar: false,
      feeDetailExpand: false, // 新增：控制费用明细展开/收起
    }
  },
  computed: {
    // 到店时间行数组
    arriveTimesRows() {
      const rowLength = 3;
      const rows = [];
      for (let i = 0; i < this.arriveTimes.length; i += rowLength) {
        rows.push(this.arriveTimes.slice(i, i + rowLength));
      }
      return rows;
    },
    groupedFeeDetailsByDate() {
      if (!Array.isArray(this.orderData.roomFeeDetails)) return [];
      const map = {};
      this.orderData.roomFeeDetails.forEach(item => {
        const key = item.date;
        if (!map[key]) {
          map[key] = {
            date: item.date,
            actualPrice: 0,
            discountSharing: 0,
            discountPrice: 0,
            originalPrice: 0,
            discountDescription: 0,
            count: 0
          };
        }
        map[key].actualPrice += Number(item.actualPrice || 0);
        map[key].discountSharing += Number(item.discountSharing || 0);
        map[key].discountPrice += Number(item.discountPrice || 0);
        map[key].originalPrice += Number(item.originalPrice || 0);
        map[key].discountDescription += (Number(item.discountSharing || 0) + (item.originalPrice - item.discountPrice));
        map[key].count += 1;
      });
      return Object.values(map);
    },
  },
  async onLoad(options) {
    // 设置状态栏为黑色
    uni.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#FFFFFF'
    });
    this.cutoffTime = await getCutoffTime();
    this.first = true;
    // 记录第三方订单ID
    this.type_order = options.type;
    this.thirdOrderId = options.thirdOrderId;
    this.thirdRoomName = options.thirdRoomName;
    this.type = Boolean(this.thirdOrderId);
    await this.loadOrderDataFromParams(options);
  },
  methods: {
    formatDateIn(dateStr) {
      if (!dateStr) return '';
      const date = new Date(dateStr);
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
    formatDateRed(dateStr) {
      if (!dateStr) return '';
      const date = new Date(dateStr);
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      const year = date.getFullYear().toString();
      return `${year}.${month}.${day}`;
    },
    // 从页面参数和缓存中加载订单数据
    async loadOrderDataFromParams(options) {
      try {
        // 从缓存中获取搜索参数（首页选择的时间和床位数）
        const searchParams = uni.getStorageSync('searchParams');
        this.showZeroToSixPrompt = searchParams.showZeroToSixPrompt
        this.iChoseEarlyMorning = searchParams.iChoseEarlyMorning
        const hotelRoomDetailData = await getRoomInfo(options.id);
        // 根据订单信息获取历史入住用户信息
        const orderId = options.orderId;
        const historyCheckInPerson = await getHistoryCheckInPerson(orderId);
        if (searchParams) {
          this.orderData.checkInDate = searchParams.checkIn;
          this.orderData.checkOutDate = searchParams.checkOut;
          this.orderData.roomCount = searchParams.bedCount || 1;
        }
        if (orderId) {
          this.orderData.roomCount = historyCheckInPerson.length;
        }
        this.orderData.guestList = historyCheckInPerson;
        this.orderData.contactPhone = historyCheckInPerson[0].phone;
        if (hotelRoomDetailData) {
          this.orderData.hotelId = hotelRoomDetailData.hotelId;
          this.orderData.hotelName = hotelRoomDetailData.hotelName;
          this.orderData.hotelAddress = hotelRoomDetailData.hotelAddress;
          this.orderData.roomTypeId = hotelRoomDetailData.id;
          this.orderData.roomTypeName = this.type ? this.thirdRoomName : hotelRoomDetailData.name;
          this.orderData.roomFee = hotelRoomDetailData.currentPrice;
          this.orderData.saleMode = hotelRoomDetailData.saleMode;
        }
        // 重新计算总金额
        await this.recalculateTotal();
        // 确保入住人列表与床位数量同步
        this.syncGuestList();
        await this.fetchCouponList();
      } catch (e) {
        console.error('获取订单数据失败:', e);
      } finally {
        // 数据加载完成后，隐藏加载状态
        this.loading = false;
      }
    },
    // 同步入住人列表与床位数量
    syncGuestList() {
      const roomCount = this.orderData.roomCount;
      const currentGuestCount = this.orderData.guestList.length;
      if (currentGuestCount < roomCount) {
        // 如果入住人数少于床位数，补充空的入住人
        for (let i = currentGuestCount; i < roomCount; i++) {
          this.orderData.guestList.push({guestName: ''});
        }
      } else if (currentGuestCount > roomCount) {
        // 如果入住人数多于床位数，删除多余的入住人
        this.orderData.guestList = this.orderData.guestList.slice(0, roomCount);
      }
    },

    goBack() {
      pageBack()
    },
    async changeBed(val) {
      let next = this.orderData.roomCount + val;
      if (this.type || (next < 1 || next > 10)) return;
      this.orderData.roomCount = next;
      // 重新计算价格
      await this.recalculateTotal();
      // 联动更新入住人列表
      this.syncGuestList();
      // 同步更新searchParams缓存，保证返回首页时床位数一致
      this.updateSearchParams();
    },
    // 同步更新searchParams缓存
    updateSearchParams() {
      try {
        const searchParams = uni.getStorageSync('searchParams');
        if (searchParams) {
          searchParams.bedCount = this.orderData.roomCount;
          searchParams.checkIn = this.orderData.checkInDate;
          searchParams.checkOut = this.orderData.checkOutDate;
          searchParams.nights = this.calculateNights();
          uni.setStorageSync('searchParams', searchParams);
        }
      } catch (e) {
        console.error('更新searchParams失败:', e);
      }
    },

    // 选择支付方式
    selectPayMethod(method) {
      this.orderData.paymentMethod = method;
    },

    // 获取星期几
    getWeekDay(dateStr) {
      if (!dateStr) return '';
      const date = new Date(dateStr);
      const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
      return weekDays[date.getDay()];
    },


    // 计算住宿天数
    calculateNights() {
      if (!this.orderData.checkInDate || !this.orderData.checkOutDate) return 0;
      const checkIn = new Date(this.orderData.checkInDate);
      const checkOut = new Date(this.orderData.checkOutDate);
      return Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    },

    // 重新计算总金额
    async recalculateTotal() {
      try {
        const params = {
          type: this.type_order,
          hotelId: this.orderData.hotelId,
          roomTypeId: this.orderData.roomTypeId,
          roomCount: this.orderData.roomCount,
          checkInDate: this.orderData.checkInDate,
          checkOutDate: this.orderData.checkOutDate,
          redPacketId: this.orderData.redPacketId
        };
        if (this.type) {
          delete params.redPacketId;
        }
        const result = await calculateThePrice(params);
        if (result) {
          this.orderData.roomFee = result.totalAmount;
          this.orderData.totalOriginalPrice = result.totalOriginalPrice;
          this.orderData.limitTimeDiscount = result.limitTimeDiscount || 0;
          this.orderData.totalAmount = result.payableAmount;
          if (this.type) {
            this.orderData.totalAmount = 0;
            this.orderData.deductOrderId = this.thirdOrderId;
          }
          this.orderData.threePartyDeduction = result.totalOriginalPrice;
          this.orderData.memberDiscount = result.memberDiscount;
          this.orderData.redPacketDiscount = result.redPacketDiscount;
          this.$set(this.orderData, 'roomFeeDetails', result.roomFeeDetails || []);
          // 直接计算平均每晚
          if (Array.isArray(result.roomFeeDetails) && result.roomFeeDetails.length) {
            const sum = result.roomFeeDetails.reduce((acc, cur) => acc + Number(cur.actualPrice || 0), 0);
            this.orderData.avgNightPrice = (sum / result.roomFeeDetails.length).toFixed(2);
          } else {
            this.orderData.avgNightPrice = '0.00';
          }
        }
      } catch (e) {
        console.error('计算价格失败:', e);
        uni.showToast({
          title: '计算价格失败',
          icon: 'none'
        });
      }
    },
    async fetchCouponList() {
      try {
        const params = {
          hotelId: this.orderData.hotelId,
          roomId: this.orderData.roomTypeId,
          amount: this.orderData.roomFee,
          days: this.calculateNights(),
          checkInDate: this.orderData.checkInDate,
          type: this.type_order
        };
        const list = await getAvailableRedEnvelopeList(params);
        // 不再过滤红包金额
        this.couponList = Array.isArray(list) ? list : [];
        // 如果第一次加载且未选中红包，自动选中第一个
        if (this.couponList.length > 0 && this.first) {
          this.first = false;
          const firstCoupon = this.couponList[0];
          this.orderData.redPacketId = firstCoupon.id;
          this.selectedCouponId = firstCoupon.id;
          // 重新计算价格
          await this.recalculateTotal();
        } else if (this.couponList.length === 0) {
          // 如果没有可用红包，清除红包信息
          this.orderData.redPacketId = null;
          this.selectedCouponId = null;
          // 重新计算价格
          await this.recalculateTotal();
        }
      } catch (e) {
        this.couponList = [];
        // 发生错误时清除红包信息
        this.orderData.redPacketId = null;
        this.selectedCouponId = null;
        await this.recalculateTotal();
      }
    },

    // 修改红包确认方法
    async onCouponConfirm() {
      // 只有点击确定才真正应用
      const selected = this.couponList.find(c => c.id === this.selectedCouponId);
      if (selected) {
        this.orderData.redPacketId = selected.id;
      } else {
        this.orderData.redPacketId = null;
      }
      // 重新计算价格
      await this.recalculateTotal();
      this.showCouponPopup = false;
    },

    // 修改日期选择确认方法
    async onCalendarConfirm(dates) {
      if (dates && dates.detail && dates.detail.length === 3) {
        const [checkIn, checkOut, nights] = dates.detail;
        this.orderData.checkInDate = checkIn;
        this.orderData.checkOutDate = checkOut;
        // 重新计算价格
        await this.recalculateTotal();
        // 重新获取可用红包
        await this.fetchCouponList();
        this.showCalendar = false;
        // 同步更新searchParams缓存，保证返回首页时床位数一致
        this.updateSearchParams();
      }
    },

    validatePhone() {
      const phoneRegex = /^1[3-9]\d{9}$/;
      if (!this.orderData.contactPhone) {
        uni.showToast({
          title: '请输入手机号',
          icon: 'none'
        });
        return false;
      }
      if (!phoneRegex.test(this.orderData.contactPhone)) {
        uni.showToast({
          title: '请输入正确的手机号',
          icon: 'none'
        });
        return false;
      }
      return true;
    },
    onSelectDate() {
      this.showCalendar = true;
    },
    onCouponClick() {
      // 打开弹窗时，临时选中当前已用红包
      this.selectedCouponId = this.orderData.redPacketId;
      this.showCouponPopup = true;
    },
    // 选择优惠券
    onCouponSelect(id) {
      this.selectedCouponId = id;
    },
    // 取消选择优惠券
    onCouponCancel() {
      // 恢复之前的选择
      this.selectedCouponId = this.orderData.redPacketId;
      this.showCouponPopup = false;
    },
    async submitOrder() {
      try {
        // 校验
        if (this.orderData.guestList.some(guest => !guest.guestName) || !this.orderData.contactPhone) {
          uni.showToast({title: '请填写完整入住人信息', icon: 'none'});
          return;
        }

        // 显示加载提示
        uni.showLoading({
          title: '正在创建订单...',
          mask: true
        });

        // 准备订单数据
        const orderParams = {
          ...this.orderData,
          type: this.type_order,
          arrivalTime: this.arriveTimes[this.arriveIndex],
          lateArrival: this.lateArriveChecked ? 1 : 0
        };

        // 创建订单
        const orderResult = await createOrder(orderParams)
            .catch((error) => {
              throw new Error(error.error || error.msg || '创建订单失败');
            });

        // 如果是零元订单，直接跳转到支付成功页面
        if (orderResult.totalAmount === 0) {
          uni.hideLoading();
          uni.redirectTo({
            url: `/pages/subPackages/order/paySuccess?id=${orderResult.id}`
          });
          return;
        }

        // 调用支付接口
        const payResult = await placeAnOrder(orderResult.id, orderParams.paymentMethod)
            .catch((error) => {
              throw new Error(error.error || error.msg || '支付失败');
            });
        // 隐藏加载提示
        uni.hideLoading();
        // 根据支付方式拉起对应的支付
        if (orderParams.paymentMethod === 1) {
          // 微信支付
          uni.requestPayment({
            provider: 'wxpay',
            ...(payResult.payParams),
            success: (res) => {
              uni.redirectTo({
                url: `/pages/subPackages/order/paySuccess?id=${orderResult.id}`
              });
            },
            fail: (err) => {
              uni.showLoading({title: '正在跳转...'});
              uni.switchTab({url: '/pages/order/index'});
            }
          });
        } else {
          // 支付宝支付
          uni.showToast({
            title: '该支付方式暂不支持！',
            icon: 'none'
          });
        }

      } catch (error) {
        uni.hideLoading();
        uni.showToast({
          title: error.message || '订单创建失败',
          icon: 'none'
        });
      }
    },
    toggleAgree() {
      this.agreeChecked = !this.agreeChecked;
    },
    goToBookingNotice() {
      uni.navigateTo({
        url: '/pages/subPackages/agreement/bookingNotice'
      });
    },
    goToPaymentAgreement() {
      uni.navigateTo({
        url: '/pages/subPackages/agreement/paymentAgreement'
      });
    },
  }
}
</script>

<style scoped lang="scss">
.nav-title {
  width: 100%;
  font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;
  font-weight: 500;
  font-size: 32rpx;
  text-align: center;
  height: 88rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.order-container {
  background: #f3f4f6;
  min-height: 100vh;
  padding-bottom: calc(240rpx + env(safe-area-inset-bottom));

  .loading-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 60vh;

    .loading-content {
      display: flex;
      flex-direction: column;
      align-items: center;

      .loading-spinner {
        width: 40rpx;
        height: 40rpx;
        border: 3rpx solid #f3f4f6;
        border-top: 3rpx solid #EE781F;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin-bottom: 20rpx;
      }

      @keyframes spin {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(360deg);
        }
      }

      .loading-text {
        font-size: 28rpx;
        color: #6D7278;
      }
    }
  }

  .notice {
    margin-top: 66rpx;
    padding: 0 24rpx 126rpx;
    font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;
    font-weight: 400;
    font-size: 24rpx;
    color: #6D7278;
    line-height: 34rpx;
    text-align: left;
    font-style: normal;
  }

  .order-hotel-box {
    background: #FFFFFF;
    border-radius: 28rpx;
    margin: 28rpx 28rpx 0;
    padding-bottom: 42rpx;
    position: relative;
    z-index: 2;

    .hotel-title {
      font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;
      font-weight: 500;
      font-size: 32rpx;
      line-height: 1.5; /* 相对单位更安全，避免文字裁切 */
      color: #19191A;
      text-align: left;
      font-style: normal;
      padding: 34rpx 28rpx 22rpx 28rpx;

      display: -webkit-box;
      -webkit-line-clamp: 2; /* 限制两行 */
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;

      word-break: break-word; /* 避免中文字被硬拆 */
      white-space: normal; /* 保证多行换行生效 */
    }


    .hotel-desc {
      font-size: 24rpx;
      color: #aeb2b8;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      margin-left: 28rpx;

      .map-icon {
        width: 36rpx;
        height: 36rpx;
        background: url('/static/base/map.png') no-repeat center;
        background-size: 100% 100%;
        margin-right: 10rpx;
        flex-shrink: 0;
      }

      .hotel-desc-text {
        font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;
        font-weight: 400;
        font-size: 28rpx;
        color: #6D7278;
        line-height: 28rpx;
        text-align: left;
        font-style: normal;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        flex: 1;
        padding-right: 20rpx;
      }
    }

    .line {
      height: 1rpx;
      background: #E8E9EB;
      margin: 38rpx 28rpx;
    }

    .order-date-row {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      padding: 0 28rpx;

      .date-left, .date-right {
        display: flex;
        flex-direction: row;
        align-items: baseline;

        .date-main {
          font-size: 32rpx;
          color: #19191A;
          font-weight: 600;
        }

        .date-week {
          font-size: 22rpx;
          color: #6D7278;
          margin-left: 8rpx;
          font-weight: 400;
        }
      }

      .nights-tag {
        position: relative;
        border-radius: 28rpx;
        font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;
        font-weight: 400;
        font-size: 20rpx;
        text-align: center;
        font-style: normal;
        color: #6D7278;
        padding: 6rpx 10rpx;
        margin: 0 40rpx;
        box-sizing: border-box;
      }

      .nights-tag::after {
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        border-radius: 28rpx;
        border: 1rpx solid #A2A2A8;
        pointer-events: none;
        box-sizing: border-box;
        transform: scale(1);
        transform-origin: center;
      }

      @media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 2dppx) {
        .nights-tag::after {
          border-width: 0.5px;
        }
      }
    }

    .order-room-row {
      display: flex;
      align-items: center;
      margin-top: 24rpx;
      padding: 0 28rpx;

      .room-type {
        font-size: 28rpx;
        color: #19191A;
        font-weight: 500;
      }

      .room-divider {
        width: 2rpx;
        height: 28rpx;
        background: #E8E9EB;
        margin: 0 18rpx;
      }

      .bed-count {
        font-size: 28rpx;
        color: #19191A;
        font-weight: 500;
      }
    }
  }

  .early-morning-tip {
    margin-top: -20rpx;
    margin-left: 28rpx;
    margin-right: 28rpx;
    padding: 42rpx 18rpx 16rpx 20rpx;
    border-radius: 0 0 28rpx 28rpx;
    border: 1rpx solid #F7DFC1;
    background: linear-gradient(180deg, #FFEBD7 0%, #FDF6ED 100%);
    position: relative;
    z-index: 1;
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    position: relative;
    z-index: 1;

    .early-morning-tip-icon {
      width: 24rpx;
      height: 24rpx;
      margin-right: 10rpx;
      position: relative;
      top: 6rpx;
    }

    .early-morning-tip-text {
      font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;
      font-weight: 400;
      font-size: 24rpx;
      color: #B7560C;
      line-height: 34rpx;
      text-align: left;
      font-style: normal;
    }

  }

  .form-title {
    font-size: 32rpx;
    color: #19191a;
    font-weight: 600;
    margin: 32rpx 24rpx 0 24rpx;
    text-align: left;
  }

  .order-form-box {
    background: #fff;
    border-radius: 24rpx;
    margin: 24rpx 24rpx 0 24rpx;
    padding: 32rpx 24rpx;

    .form-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      min-height: 56rpx;
      position: relative;
    }

    .line-group {
      .form-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        min-height: 56rpx;
        position: relative;
      }

      .order-row-line {
        height: 1rpx;
        background: #E8E9EB;
        margin: 36rpx 0 32rpx 0;
      }
    }

    .order-row-line {
      height: 1rpx;
      background: #E8E9EB;
      margin: 36rpx 0 32rpx 0;
    }

    .form-label {
      display: flex;
      align-items: center;
      font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;
      font-weight: 400;
      font-size: 28rpx;
      color: #19191A;
      text-align: left;
      font-style: normal;

      .required {
        color: #ee781f;
        margin-left: 4rpx;
        font-size: 24rpx;
      }

      .info-text {
        font-size: 28rpx;
        color: #19191A;
        font-weight: 400;
      }

      .info-icon {
        width: 28rpx;
        height: 28rpx;
        margin-left: 8rpx;
        background: url('/static/base/info_gray.png') no-repeat center;
        background-size: 100% 100%;
        display: inline-block;
        position: relative;
        top: 4rpx;
      }
    }

    .form-input {
      flex: 1;
      text-align: right;
      border: none;
      background: transparent;
      font-size: 28rpx;
      color: #19191a;

      &::placeholder {
        color: #aeb2b8;
        font-size: 28rpx;
      }
    }

    .bed-count-ctrl {
      display: flex;
      align-items: center;

      .bed-btn-img {
        width: 48rpx;
        height: 48rpx;
        background-image: url('/static/base/popup_icon_minus.png');
        background-size: cover;
        background-position: center;
        margin: 0 12rpx;

        &.plus {
          background-image: url('/static/base/popup_icon_plus.png');
        }

        &.disabled {
          background-image: url('/static/base/popup_icon_minus_disabled.png');
          pointer-events: none;
          opacity: 0.5;
        }

        &.plus.disabled {
          background-image: url('/static/base/popup_icon_plus_disabled.png');
        }
      }

      .bed-num {
        font-size: 28rpx;
        color: #19191a;
        width: 48rpx;
        text-align: center;
      }
    }

    .arrive-time-group {
      display: flex;
      flex-direction: column;
      gap: 28rpx;
      margin-left: 0;
      margin-top: 40rpx;

      .arrive-time-row {
        display: flex;
        gap: 24rpx;
        margin-bottom: 0;
      }

      .arrive-time-btn {
        border-radius: 8rpx;
        font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;
        font-weight: 400;
        font-size: 24rpx;
        color: #19191A;
        line-height: 24rpx;
        text-align: left;
        font-style: normal;
        border: none;
        transition: background 0.2s, color 0.2s;
        background: #F3F7FA;
        padding: 16rpx 22rpx;

        &.active {
          background: #EE781F;
          color: #fff;
        }
      }
    }

    .form-row-vertical {
      flex-direction: column;
      align-items: flex-start;

      .form-label-row {
        width: 100%;
        display: flex;
        align-items: center;
      }
    }
  }

  .order-fee-box {
    background: #fff;
    border-radius: 24rpx;
    margin: 28rpx 24rpx 0;
    padding: 34rpx 24rpx 38rpx;


    .fee-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 28rpx;
      margin-bottom: 40rpx;

      .free-coupon {
        display: flex;
        align-items: center;
        gap: 16rpx;
      }

      text {
        font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;
        font-weight: 400;
        font-size: 28rpx;
        color: #19191A;
        line-height: 28rpx;
        text-align: left;
        font-style: normal;
      }

      .price {
        font-weight: 500;
        font-size: 28rpx;
        color: #19191A;
        line-height: 28rpx;
        text-align: right;
        font-style: normal;
      }

      .fee-discount {
        font-weight: 500;
        font-size: 28rpx;
        color: #EE781F;
        line-height: 28rpx;
        text-align: right;
        font-style: normal;
      }

      .fee-disable {
        font-weight: 500;
        font-size: 28rpx;
        color: #A2A2A8;
        line-height: 28rpx;
        text-align: right;
        font-style: normal;
      }

      &.fee-total {
        font-weight: 600;
        font-size: 32rpx;

        text {
          font-weight: 500;
          font-size: 28rpx;
          color: #19191A;
          text-align: left;
          font-style: normal;
        }

        .currency {
          font-size: 24rpx;
        }

        .fee-total-num {
          color: #19191A;
          font-size: 40rpx;
        }
      }
    }

    .fee-row:last-child {
      margin-bottom: 0;
    }

    /* 新增每日明细表格样式 */
    .fee-detail-table {
      margin-bottom: 40rpx;
      background: #F3F4F6;
      border-radius: 24rpx;
      padding: 24rpx 28rpx;

      .fee-detail-header {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
        gap: 20rpx;
        font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;
        font-weight: 500;
        font-size: 28rpx;
        color: #19191A;
        line-height: 28rpx;
        text-align: left;
        font-style: normal;
        padding-bottom: 24rpx;
        border-bottom: 1rpx solid #E8E9EB;
      }

      .fee-detail-row {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
        gap: 20rpx;
        font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;
        font-weight: 400;
        font-size: 28rpx;
        color: #19191A;
        line-height: 28rpx;
        text-align: left;
        font-style: normal;
        padding: 16rpx 0;
        border-bottom: 1rpx solid #E8E9EB;

        &:last-child {
          border-bottom: none;
        }
      }
    }
  }

  .pay-title {
    width: 192rpx;
    height: 32rpx;
    font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;
    font-weight: 500;
    font-size: 32rpx;
    color: #19191A;
    line-height: 32rpx;
    text-align: left;
    font-style: normal;
    margin: 40rpx 28rpx 0 28rpx;
  }

  .pay-method-section {
    background: #FFFFFF;
    border-radius: 28rpx;
    margin: 28rpx 24rpx 0;
    padding: 28rpx 28rpx 32rpx 28rpx;

    .pay-method {
      display: flex;
      align-items: center;

      &:last-child {
        border-bottom: none;
      }

      .icon {
        width: 40rpx;
        height: 40rpx;
        margin-right: 20rpx;
      }

      .text {
        flex: 1;
        height: 28rpx;
        font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;
        font-weight: 500;
        font-size: 28rpx;
        color: #19191A;
        line-height: 28rpx;
        text-align: left;
        font-style: normal;
      }
    }

    .line {
      height: 1rpx;
      background: #E8E9EB;
      margin-top: 30rpx;
      margin-bottom: 26rpx;
    }
  }

  .order-bottom-fixed {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 999;
    width: 100vw;
    padding-bottom: 66rpx;
    background: #fff;

    .order-agree-bar {
      display: flex;
      align-items: center;
      background: linear-gradient(266deg, #FFFFFF 0%, #FFFFFF 20%, #FBE9DD 100%);
      padding: 20rpx 42rpx;

      .agree-text {
        flex: 1;
        font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;
        font-weight: 400;
        font-size: 24rpx;
        color: #969799;
        text-align: left;
        font-style: normal;
        line-height: 40rpx;
        white-space: normal;
        word-break: break-all;

        .agree-link {
          color: #EE781F;
        }
      }
    }

    .order-bottom-bar-new {
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: #fff;
      border-radius: 0 0 16rpx 16rpx;
      padding: 40rpx 32rpx 48rpx 32rpx;

      .order-bottom-left {
        display: flex;
        flex-direction: column;

        .bottom-label {
          font-size: 26rpx;
          color: #19191A;
          margin-bottom: 8rpx;
        }

        .bottom-amount {
          display: flex;
          align-items: flex-end;

          .bottom-currency {
            font-size: 24rpx;
            color: #EE781F;
            margin-right: 2rpx;
          }

          .bottom-num {
            font-size: 40rpx;
            color: #EE781F;
            font-weight: 600;
            line-height: 1;
          }
        }
      }

      .order-bottom-btn {
        font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;
        font-weight: 500;
        font-size: 32rpx;
        color: #FFFFFF;
        line-height: 32rpx;
        text-align: center;
        font-style: normal;
        background: #EE781F;
        border: none;
        border-radius: 50rpx;
        padding: 30rpx 46rpx;

        &.disabled {
          background: #EE781F;
          opacity: 0.3;
          color: #fff;
        }
      }
    }
  }
}

.late-arrive-row {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.late-arrive-radio {
  width: 32rpx;
  height: 32rpx;
  border-radius: 50%;
  border: 2rpx solid #ee781f;
  margin-right: 12rpx;
  background: #fff;
  position: relative;

  &.checked {
    background: #ee781f;
    border-color: #ee781f;

    &:after {
      content: '';
      display: block;
      width: 16rpx;
      height: 16rpx;
      border-radius: 50%;
      background: #fff;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
    }
  }
}

.late-arrive-text {
  font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;
  font-weight: 400;
  font-size: 24rpx;
  color: #19191A;
  text-align: left;
  font-style: normal;
}

.coupon-popup-mask {
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(25, 25, 26, 0.6);
  z-index: 2000;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.coupon-popup {
  width: 100vw;
  background: #F3F4F6;
  border-radius: 28rpx 28rpx 0 0;
}

.bed-picker-header {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  position: relative;
  padding: 42rpx 22rpx 40rpx;
}

.coupon-popup-title {
  flex: 1;
  text-align: center;
  font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;
  font-weight: 500;
  font-size: 40rpx;
  color: #19191A;
  line-height: 40rpx;
  font-style: normal;
}

.close-icon {
  position: absolute;
  right: 22rpx;
  top: 50%;
  transform: translateY(-50%);
  width: 34rpx;
  height: 32rpx;
  background-image: url('@/static/base/popup_icon_close.png');
  background-size: cover;
  background-position: center;
  align-items: flex-end;
  cursor: pointer;
}

.coupon-list {
  max-height: 750rpx;
  overflow-y: auto;
}

.coupon-card {
  display: flex;
  align-items: center; /* 垂直居中 */
  justify-content: space-between; /* 两边分布 */
  position: relative;
  margin: 0 24rpx 20rpx 24rpx;
}

.coupon-item {
  flex: 1; /* 占满剩余空间 */
  display: flex;
  align-items: center;
  height: 200rpx;
  margin: 0 12rpx 0 12rpx;
  background-image: url('https://www.zxd-hotel.xin/zxdhotel/icon/select-pack@2x.png');
  background-size: 100% 100%;
  background-position: center;
  background-repeat: no-repeat;
  position: relative;
  border-radius: 28rpx;

  .coupon-tag-expired {
    position: absolute;
    right: 0;
    top: 0;
    width: 124rpx;
    height: 124rpx;
    background-image: url('https://www.zxd-hotel.xin/zxdhotel/icon/dq@2x.png');
    background-size: cover;
    background-position: center;
  }

  .coupon-tag-expired-text {
    position: absolute;
    right: 5rpx;
    top: 35rpx;
    width: 124rpx;
    height: 124rpx;
    font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;
    font-weight: 400;
    font-size: 24rpx;
    color: #000000;
    line-height: 17px;
    text-align: left;
    font-style: normal;
    transform: rotate(45deg);
  }
}

.coupon-radio {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.custom-radio {
  width: 36rpx;
  height: 36rpx;
}

.custom-radio-min {
  width: 24rpx !important;
  height: 24rpx !important;
}

.coupon-amount-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-width: 120rpx;
  position: absolute;
  left: 38rpx;
}

.coupon-amount {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  height: 60rpx;
  margin-bottom: 8rpx;
}

.rmb {
  font-size: 28rpx;
  color: #F57C1F;
  font-weight: 500;
  margin-right: 2rpx;
  line-height: 1;
}

.amount-num {
  font-size: 56rpx;
  color: #F57C1F;
  font-weight: 700;
  line-height: 1;
}

.desc_b {
  margin-bottom: 18rpx;
}

.desc_l {
  margin-bottom: 16rpx;
}

.coupon-limit, .coupon-expire {
  height: 24rpx;
  font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;
  font-weight: 400;
  font-size: 24rpx;
  color: #6D7278;
  line-height: 24rpx;
  text-align: left;
  font-style: normal;
}

.coupon-info {
  width: 580rpx;
  height: 180rpx;
  margin: 10rpx 20rpx;
  position: relative;
  display: flex;
  align-content: center;
  justify-content: space-between;

  .coupon-info-l {
    width: 360rpx;
    height: 100%;
    position: relative;
    left: 25rpx;

    .coupon-info-l-title {
      position: absolute;
      top: 30rpx;
      height: 32rpx;
      font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;
      font-weight: 500;
      font-size: 32rpx;
      color: #19191A;
      line-height: 32rpx;
      text-align: left;
      font-style: normal;
    }

    .coupon-info-l-time {
      position: absolute;
      top: 70rpx;
      height: 24rpx;
      font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;
      font-weight: 400;
      font-size: 24rpx;
      color: #19191A;
      line-height: 24rpx;
      text-align: left;
      font-style: normal;
    }

    .coupon-info-l-tag {
      position: absolute;
      top: 104rpx;

      .tag {
        position: relative;
        height: 32rpx;
        border-radius: 4rpx;
        font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;
        font-weight: 400;
        font-size: 20rpx;
        color: #EE781F;
        text-align: left;
        font-style: normal;
        padding: 0 8rpx;
        margin-right: 16rpx;
        box-sizing: border-box;
      }

      .tag::before {
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        width: 200%;
        height: 200%;
        border: 1px solid rgba(255, 183, 161, 0.5);
        border-radius: 8rpx;
        transform: scale(0.5);
        transform-origin: 0 0;
        pointer-events: none;
        box-sizing: border-box;
      }
    }
  }

  .coupon-info-r {
    width: 168rpx;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;

    .coupon-info-r-amount-box {
      width: auto;
      height: 68rpx;
      display: flex;
      align-items: baseline;
      justify-content: center;

      .coupon-info-r-amount {
        height: 68rpx;
        font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;
        font-weight: 600;
        font-size: 68rpx;
        color: #FFFFFF;
        text-align: center;
        font-style: normal;
        line-height: 1;
      }

      .coupon-info-r-unit {
        font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;
        font-weight: 500;
        font-size: 28rpx;
        color: #FFFFFF;
        text-align: left;
        font-style: normal;
        line-height: 1; /* 避免多余间距 */
        margin-left: 4rpx; /* 与数字略微分隔 */
      }
    }
  }

}

.coupon-desc {
  font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;
  font-weight: 500;
  font-size: 32rpx;
  color: #19191A;
  line-height: 32rpx;
  text-align: left;
  font-style: normal;
}

.coupon-popup-actions {
  display: none;
}

.coupon-popup-actions-new {
  background: #F3F4F6;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 0 0 32rpx 32rpx;
}

.no-coupon-row {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 38rpx 0;
}

.no-coupon-text {
  font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;
  font-weight: 400;
  font-size: 24rpx;
  color: #19191A;
  line-height: 24rpx;
  text-align: left;
  font-style: normal;
}

.coupon-btn-main {
  width: calc(100% - 112rpx);
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
  margin: 0 56rpx calc(env(safe-area-inset-bottom) + 32rpx);
}

.custom-radio {
  width: 36rpx;
  height: 36rpx;
  margin-right: 12rpx;
  vertical-align: middle;
}

.free-coupon {
  display: flex;
  align-items: center;
  gap: 16rpx;

  &.disabled {
    pointer-events: none;
  }
}

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

.fee-room-toggle {
  cursor: pointer;

  .fee-room-right {
    display: flex;
    align-items: center;

    .price {
      margin-right: 8rpx;
    }

    .arrow-icon {
      width: 36rpx;
      height: 22rpx;
      transition: transform 0.2s;
      margin-left: 4rpx;
    }
  }
}

.fee-detail-list {
  background: #f8f8f8;
  border-radius: 12rpx;
  margin: 16rpx 0 8rpx 0;
  padding: 12rpx 16rpx;

  .fee-detail-item {
    margin-bottom: 10rpx;

    &:last-child {
      margin-bottom: 0;
    }

    .fee-detail-date {
      font-size: 24rpx;
      color: #6D7278;
      margin-bottom: 2rpx;
    }

    .fee-detail-info {
      display: flex;
      flex-wrap: wrap;
      gap: 18rpx;
      font-size: 24rpx;
      color: #19191A;
    }
  }
}

.fee-detail-list-simple {
  margin: 8rpx 0 0 0;
  padding: 0 0 0 0;
  max-height: 400rpx;
  overflow-y: auto;

  .fee-detail-item-simple {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;
    font-weight: 400;
    font-size: 24rpx;
    color: #6D7278;
    line-height: 24rpx;
    text-align: right;
    font-style: normal;
    margin-bottom: 18rpx;

    &:last-child {
      border-bottom: none;
      margin-bottom: 40rpx;
    }

    .fee-detail-date-simple {
      flex: 1;
      text-align: left;
    }

    .fee-detail-count-simple {
      flex: 0 0 60rpx;
      text-align: center;
    }

    .fee-detail-amount-simple {
      flex: 1;
      font-weight: 500;
      text-align: right;
      white-space: nowrap;
    }
  }
}

.fee-detail-avg-row {
  font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;
  font-weight: 400;
  font-size: 24rpx;
  color: #6D7278;
  line-height: 24rpx;
  text-align: right;
  font-style: normal;
  margin-bottom: 18rpx;
}
</style>