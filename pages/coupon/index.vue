<template>
  <view class="page">
    <view class="fixed-header">
      <uni-nav-bar
          backgroundColor="#FFFFFF"
          :shadow="false"
          :border="false"
          status-bar
          left-icon="left"
          @clickLeft="goBack"
      >
        <template #default>
          <text class="nav-title">我的红包</text>
        </template>
      </uni-nav-bar>
      <view class="tabs">
        <text
            v-for="(tab, idx) in tabs"
            :key="tab.value"
            :class="['tab', {active: currentTab === tab.value}]"
            @click="currentTab = tab.value"
        >{{ tab.label }}
        </text>
      </view>
    </view>
    <!-- 红包列表 begin -->
    <!-- Tab切换时的加载遮罩 -->
    <view v-if="tabLoading" class="tab-loading-overlay">
      <view class="tab-loading-content">
        <view class="tab-loading-spinner">
          <view class="spinner-ring"></view>
          <view class="spinner-ring"></view>
          <view class="spinner-ring"></view>
        </view>
        <text class="tab-loading-text">正在切换...</text>
      </view>
    </view>
    <view class="receive" v-if="true">
      <view class="receive-banner" @click="goToReceiveCenter">
        <view class="banner-content">
          <view class="banner-content-l">
            <view class="banner-icon"/>
            <text class="banner-text">红包领取中心，下单更优惠</text>
          </view>
          <view class="banner-content-r">
            <view class="banner-arrow">前去领取</view>
            <view class="banner-arrow-icon"/>
          </view>
        </view>
      </view>
      <view class="receive-banner-bottom"/>
    </view>
    <scroll-view
        class="coupon-list"
        scroll-y
        @scrolltolower="loadMore"
        enable-back-to-top
        refresher-enabled
        :refresher-triggered="refreshing"
        @refresherrefresh="onRefresh"
        :style="{ height: scrollViewHeight + 'px' }"
    >
      <view class="coupon-base-card" v-for="coupon in coupons" :key="coupon.id">
        <view class="coupon-card">
          <view class="coupon-item" :class="{'lb-item': coupon.businessType === 1}"
                @click.stop="onCouponSelect(coupon.id)">
            <view class="coupon-info" v-if="coupon.businessType === 0">
              <view class="coupon-info-l" v-if="coupon.status ===2 || coupon.status ===3">
                <view class="coupon-info-l-title used-text">
                  {{ coupon.redPacket.name }}
                </view>
                <view class="coupon-info-l-time used-text">
                  有效期{{ formatDate(coupon.redPacket.startTime) }}-{{ formatDate(coupon.redPacket.endTime) }}
                </view>
                <view class="coupon-info-l-tag">
                  <text v-if="coupon.redPacket.minSpend > 0" class="tag used-tag used-text used-tag">满{{
                      coupon.redPacket.minSpend
                    }}元可用
                  </text>
                  <text v-else class="tag used-tag used-text">无门槛立减</text>
                  <text v-if="coupon.redPacket.scopeType === 1"
                        class="tag used-tag used-text">适用于全部门店
                  </text>
                  <text v-else class="tag used-tag used-text">适用于指定门店</text>
                  <text v-if="coupon.redPacketRule.stayDays > 0" class="tag">
                    适用于连续{{ coupon.redPacketRule.stayDays }}晚及以上订单
                  </text>
                </view>
              </view>
              <view class="coupon-info-l" v-else>
                <view class="coupon-info-l-title">
                  {{ coupon.redPacket.name }}
                </view>
                <view class="coupon-info-l-time">
                  有效期{{ formatDate(coupon.redPacket.startTime) }}-{{ formatDate(coupon.redPacket.endTime) }}
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
                <view class="coupon-info-r-amount-box-t">
                  <view class="coupon-info-r-amount-box">
                    <view class="coupon-info-r-amount">{{ coupon.redPacket.amount }}</view>
                    <view class="coupon-info-r-unit">元</view>
                  </view>
                </view>
                <button v-if="coupon.status === 1" plain="true" class="coupon-info-r-amount-box-b" open-type="share"
                        :data-coupon-index="coupons.indexOf(coupon)">赠送
                </button>
              </view>
            </view>
            <view class="coupon-info" v-if="coupon.businessType === 1">
              <view class="coupon-info-l" v-if="coupon.status ===1 || coupon.status ===2">
                <view class="coupon-info-l-l">
                  <image class="coupon-info-l-icon" src="https://www.zxd-hotel.xin/zxdhotel/icon/lb2.png"/>
                </view>
                <view class="coupon-info-l-r">
                  <view class="coupon-info-l-title used-text" style="top: 60rpx">
                    {{ coupon.redPacket.name }}
                  </view>
                  <view class="coupon-info-l-time used-text" style="top: 108rpx">
                    有效期{{ formatDate(coupon.redPacket.startTime) }}-{{ formatDate(coupon.redPacket.endTime) }}
                  </view>
                </view>
              </view>
              <view class="coupon-info-l" v-else>
                <view class="coupon-info-l-l">
                  <image class="coupon-info-l-icon" src="https://www.zxd-hotel.xin/zxdhotel/icon/lb2.png"/>
                </view>
                <view class="coupon-info-l-r">
                  <view class="coupon-info-l-title" style="top: 60rpx">
                    {{ coupon.redPacket.name }}
                  </view>
                  <view class="coupon-info-l-time" style="top: 108rpx">
                    有效期{{ formatDate(coupon.redPacket.startTime) }}-{{ formatDate(coupon.redPacket.endTime) }}
                  </view>
                </view>
              </view>
            </view>
            <template v-if="coupon.businessType === 0">
              <view v-if="coupon.soonExpire" class="coupon-tag-expired"></view>
              <view v-if="coupon.soonExpire" class="coupon-tag-expired-text">即将到期</view>
            </template>
            <template v-if="coupon.businessType === 1 && coupon.status ===0 ">
              <template v-if="coupon.soonExpire">
                <view class="coupon-tag-expired"></view>
                <view class="coupon-tag-expired-text">即将到期</view>
              </template>
              <template v-else>
                <view class="coupon-tag-expired toBeUsed"></view>
                <view class="coupon-tag-expired-text">待使用</view>
              </template>
            </template>
            <view v-if="coupon.businessType === 0">
              <view v-if="coupon.status ===2" class="coupon-tag-expired used"/>
              <view v-if="coupon.status ===3" class="coupon-tag-expired expired"/>
            </view>
            <view v-if="coupon.businessType === 1">
              <view v-if="coupon.status ===1" class="coupon-tag-expired lb-used"/>
              <view v-if="coupon.status ===2" class="coupon-tag-expired lb-expired"/>
            </view>
          </view>
        </view>
        <view v-if="coupon.redPacketRule.rule" class="coupon-item-rule-desc">
          {{ coupon.redPacketRule.rule }}
        </view>
        <view v-if="coupon.businessType === 1 && coupon.status === 0" class="coupon-item-rule-desc">
          在酒店前台进行兑换
        </view>
      </view>
      <!-- 加载状态提示 -->
      <view v-if="!tabLoading && !refreshing" class="load-more-status">
        <view v-if="loading && currentPage > 1" class="loading">
          <view class="loading-icon"></view>
          <text class="loading-text">加载中...</text>
        </view>
        <view v-else-if="!hasMore && coupons.length > 0" class="no-more">
          <!--          <view class="no-more-line"></view>-->
          <text class="no-more-text">已经到底啦</text>
          <!--          <view class="no-more-line"></view>-->
        </view>
        <EmptyState
            v-else-if="!loading && !coupons.length"
            text="暂无红包"
        />
      </view>
      <view class="coupon-item-null">
      </view>
    </scroll-view>
    <!-- 红包列表 end -->

    <CustomTabbar :current="'coupon'"/>
    <!-- 添加隐藏的canvas -->
    <canvas canvas-id="shareCanvas" class="share-canvas"></canvas>
  </view>
</template>

<script>
import CustomTabbar from "@/components/CustomTabbar.vue";
import {myRedEnvelope} from "../../common/api";
import EmptyState from "../../components/EmptyState.vue";
import UniNavBar from "../../uni_modules/uni-nav-bar/components/uni-nav-bar/uni-nav-bar.vue";
import {pageBack} from "../../common/redirect";

export default {
  name: 'CouponPage',
  components: {UniNavBar, EmptyState, CustomTabbar},
  onPullDownRefresh() {
    uni.stopPullDownRefresh();
    return false;
  },
  onLoad() {
    uni.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#FFFFFF'
    });
    uni.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    });
  },
  onShow() {
    this.listData();
  },
  // 页面配置
  pageConfig: {
    enablePullDownRefresh: false
  },
  data() {
    return {
      tabs: [
        {label: '可用', value: 1},
        {label: '已使用', value: 2},
        {label: '已过期', value: 3}
      ],
      currentTab: 1,
      coupons: [],
      // 分页相关
      currentPage: 1,
      pageSize: 10,
      total: 0,
      hasMore: true,
      loading: false,
      tabLoading: false, // 专门用于tab切换时的加载状态
      refreshing: false, // 专门用于下拉刷新的状态
      scrollViewHeight: 300 // 添加scroll-view高度变量
    }
  },
  computed: {},
  watch: {
    currentTab: {
      handler: async function () {
        // 当切换tab时重新获取数据
        this.tabLoading = true;
        // 添加一个小延迟，让切换动画更自然
        await this.$nextTick();
        this.resetAndLoadData();
      },
      immediate: true // 立即执行，处理初始化
    }
  },
  created() {
    // 不再需要监听 tabbarChanged 事件
  },
  beforeDestroy() {
    // 移除屏幕旋转监听
    uni.offWindowResize();
    // 不再需要移除事件监听
  },
  mounted() {
    this.calculateScrollViewHeight();
    // 监听屏幕旋转或窗口大小变化
    uni.onWindowResize(() => {
      setTimeout(() => {
        this.calculateScrollViewHeight();
      }, 100);
    });
  },
  methods: {
    // 计算scroll-view高度
    calculateScrollViewHeight() {
      const query = uni.createSelectorQuery().in(this);
      // 查询固定头部高度
      query.select('.fixed-header').boundingClientRect();
      // 查询横幅区域高度
      query.select('.receive').boundingClientRect();
      // 查询tabbar高度
      query.select('.tabbar').boundingClientRect();

      query.exec((res) => {
        const headerHeight = res[0] ? res[0].height : 0;
        const bannerHeight = res[1] ? res[1].height : 0;
        const tabbarHeight = res[2] ? res[2].height : 0;
        // 获取屏幕可用高度
        const systemInfo = uni.getSystemInfoSync();
        const screenHeight = systemInfo.windowHeight;
        // 计算scroll-view高度 = 屏幕高度 - 各固定区域高度
        const scrollViewHeight = screenHeight - headerHeight - bannerHeight - tabbarHeight;
        this.scrollViewHeight = scrollViewHeight > 100 ? scrollViewHeight : screenHeight - 100;
      });
    },
    goBack() {
      pageBack()
    },
    goToReceiveCenter() {
      uni.navigateTo({
        url: '/pages/subPackages/coupon/receiving-center'
      });
    },
    // 下拉刷新
    onRefresh() {
      this.refreshing = true;
      this.resetAndLoadData();
    },
    formatDate(dateStr) {
      if (!dateStr) return '';
      const date = new Date(dateStr);
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      const year = date.getFullYear().toString();
      return `${year}.${month}.${day}`;
    },
    // 重置分页数据并加载第一页
    resetAndLoadData() {
      this.currentPage = 1;
      this.hasMore = true;
      this.total = 0;
      // 不立即清空数据，等新数据到了再替换
      this.listData();
    },
    async listData() {
      if (this.loading) return; // 防止重复请求

      this.loading = true;

      try {
        let params = {
          page: this.currentPage,
          pageSize: this.pageSize,
          status: this.currentTab
        }

        const res = await myRedEnvelope(params);

        if (this.currentPage === 1) {
          // 第一页，直接赋值
          this.coupons = res.records || [];
        } else {
          // 追加数据
          this.coupons = [...this.coupons, ...(res.records || [])];
        }

        // 更新分页信息
        this.total = res.total || 0;
        this.hasMore = this.coupons.length < this.total;

      } catch (error) {
        console.error('加载数据失败:', error);
        uni.showToast({
          title: '加载失败，请重试',
          icon: 'none'
        });
      } finally {
        this.loading = false;
        this.tabLoading = false; // 结束tab切换加载状态
        this.refreshing = false; // 结束下拉刷新状态
      }
    },
    // 加载更多数据
    loadMore() {
      if (!this.hasMore || this.loading) {
        return;
      }

      this.currentPage++;
      this.listData();
    },
    toggleRule(coupon) {
      coupon.isRuleExpanded = !coupon.isRuleExpanded;
    },
    // 绘制分享图片
    async drawShareImage(coupon) {
      return new Promise((resolve, reject) => {
        const ctx = uni.createCanvasContext('shareCanvas', this);
        const canvasWidth = 500;
        const canvasHeight = 400;

        // 绘制背景图
        ctx.drawImage('/static/share/coupon_share.png', 0, 0, canvasWidth, canvasHeight);

        // 绘制金额
        ctx.setFillStyle('#E81B2D');
        ctx.setTextAlign('center');
        ctx.setTextBaseline('middle');

        // 绘制¥符号
        ctx.setFontSize(30);
        ctx.fillText('¥', canvasWidth / 2 - 40, 110);

        // 绘制金额数字
        ctx.setFontSize(52);
        ctx.fillText(coupon.redPacket.amount, canvasWidth / 2 + 5, 102);

        let amountText = ""
        if (coupon.redPacket.minSpend > 0) {
          amountText = "满" + coupon.redPacket.minSpend + "元可用";
        } else {
          amountText = "无门槛立减";
        }
        // 绘制使用条件
        ctx.setFillStyle('#19191A');
        ctx.setFontSize(24);
        ctx.fillText(amountText, canvasWidth / 2, 148);

        // 绘制标题
        ctx.setFillStyle('#FFFFFF');
        ctx.setFontSize(28);
        ctx.fillText(coupon.redPacket.name, canvasWidth / 2, 240);

        // 绘制有效期
        ctx.setFontSize(20);
        ctx.setFillStyle('#FFFFFF');
        const time = this.formatDate(coupon.endTime)
        ctx.fillText(`有效期至${time}`, canvasWidth / 2, 280);
        // 绘制适用范围
        const text = coupon.redPacket.scopeType === 1 ? '适用于全部门店' : '适用于指定门店';
        ctx.fillText(text, canvasWidth / 2, 310);
        // 执行绘制
        ctx.draw(false, () => {
          uni.canvasToTempFilePath({
            canvasId: 'shareCanvas',
            success: (res) => {
              resolve(res.tempFilePath);
            },
            fail: (err) => {
              reject(err);
            }
          }, this);
        });
      });
    },

    // 分享到朋友圈
    async onShareTimeline(res) {
      if (res.from === 'button') {
        const couponIndex = res.target.dataset.couponIndex;
        const coupon = this.coupons[couponIndex];
        try {
          // 生成分享图片
          const shareImagePath = await this.drawShareImage(coupon);
          return {
            title: '您有一份来自好友的红包分享，请查收！',
            desc: `您的好友分享了一个${coupon.redPacket.amount}元红包`,
            path: `/pages/subPackages/coupon/receive?spread=${coupon.id}`,
            imageUrl: shareImagePath
          }
        } catch (err) {
          console.error('生成分享图片失败:', err);
          // 使用默认图片
          return {
            title: '您有一份来自好友的红包分享，请查收！',
            desc: `您的好友分享了一个${coupon.redPacket.amount}元红包`,
            path: `/pages/subPackages/coupon/receive?spread=${coupon.id}`,
            imageUrl: '/static/share/coupon_share.png'
          }
        }
      }
      return {
        title: '您有一份来自好友的红包分享，请查收！',
        desc: '您的好友给您发了一个红包',
        path: '/pages/subPackages/coupon/receive',
        imageUrl: '/static/share/coupon_share.png'
      }
    },

    // 分享给好友
    async onShareAppMessage(res) {
      if (res.from === 'button') {
        const couponIndex = res.target.dataset.couponIndex;
        const coupon = this.coupons[couponIndex];
        try {
          // 生成分享图片
          const shareImagePath = await this.drawShareImage(coupon);
          return {
            title: '您有一份来自好友的红包分享，请查收！',
            desc: `您的好友分享了一个${coupon.redPacket.amount}元红包`,
            path: `/pages/subPackages/coupon/receive?spread=${coupon.id}`,
            imageUrl: shareImagePath
          }
        } catch (err) {
          console.error('生成分享图片失败:', err);
          // 使用默认图片
          return {
            title: '您有一份来自好友的红包分享，请查收！',
            desc: `您的好友分享了一个${coupon.redPacket.amount}元红包`,
            path: `/pages/subPackages/coupon/receive??spread=${coupon.id}`,
            imageUrl: '/static/share/coupon_share.png'
          }
        }
      }
      return {
        title: '您有一份来自好友的红包分享，请查收！',
        desc: '您的好友给您发了一个红包',
        path: '/pages/subPackages/coupon/receive',
        imageUrl: '/static/share/coupon_share.png'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.page {
  background: #F3F4F6;
  height: 100vh;
  overflow: hidden;

  .receive {
    position: relative;
    height: 136rpx;

    .receive-banner {
      height: 134rpx;
      margin: 40rpx 15rpx 0 15rpx;
      background-image: url('https://www.zxd-hotel.xin/zxdhotel/icon/lingqubej@2x.png');
      background-size: 100% 100%;
      background-position: center;
      background-repeat: no-repeat;

      .banner-content {
        position: relative;
        top: 30rpx;
        margin: 0 34rpx;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .banner-content-l {
          display: flex;
          align-items: center;
          justify-content: space-between;

          .banner-icon {
            width: 26rpx;
            height: 32rpx;
            background-image: url('https://zxd-hotel.xin/zxdhotel/2025/06/03/red_20250603225415A004.png');
            background-size: 100% 100%;
            background-position: center;
            background-repeat: no-repeat;
            margin-right: 20rpx;
          }

          .banner-text {
            font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;
            font-weight: 600;
            font-size: 28rpx;
            color: #FFE1B6;
            line-height: 28rpx;
            text-align: left;
            font-style: normal;
          }
        }

        .banner-content-r {
          display: flex;
          align-items: center;
          justify-content: space-between;

          .banner-arrow {
            font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;
            font-weight: 500;
            font-size: 24rpx;
            color: #FFFFFF;
            line-height: 28rpx;
            text-align: center;
            font-style: normal;
          }

          .banner-arrow-icon {
            width: 11rpx;
            height: 18rpx;
            background-image: url('https://www.zxd-hotel.xin/zxdhotel/icon/fjt2@2x.png');
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
            margin-left: 14rpx;
          }
        }
      }
    }

    .receive-banner-bottom {
      background-image: url('https://www.zxd-hotel.xin/zxdhotel/icon/lingqubd@2x.png');
      background-size: 100% 100%;
      background-position: center;
      background-repeat: no-repeat;
      position: absolute;
      bottom: 0;
      width: 100%;
      height: 54rpx;
    }
  }

  .fixed-header {
    background: #fff;
    margin-bottom: 20rpx;
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

  .tabs {
    display: flex;
    justify-content: space-around;
    background: #FFF;
    padding: 0 40rpx;
    width: 100%;
    box-sizing: border-box;

    .tab {
      padding: 20rpx 40rpx;
      font-size: 28rpx;
      color: #333;
      position: relative;

      &.active {
        &::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 40rpx;
          height: 4rpx;
          background: #ff9900;
          border-radius: 2rpx;
        }
      }
    }
  }

  .coupon-list {
    flex: 1;
    overflow: hidden;
    background: white;

    .coupon-card {
      display: flex;
      align-items: center; /* 垂直居中 */
      justify-content: space-between; /* 两边分布 */
      position: relative;
    }

    .coupon-base-card {
      display: revert;
    }

    .coupon-item-rule-desc {
      margin: -40rpx 15rpx 20rpx 15rpx;
      padding: 42rpx 32rpx 18rpx 32rpx;
      border-radius: 0 0 28rpx 28rpx;
      border: 1rpx solid #F7DFC1;
      font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;
      font-weight: 400;
      font-size: 24rpx;
      color: #B7560C;
      line-height: 32rpx;
      text-align: left;
      font-style: normal;
      background: linear-gradient(180deg, #FFEBD7 0%, #FDF6ED 100%);
    }

    .coupon-item {
      flex: 1; /* 占满剩余空间 */
      display: flex;
      align-items: center;
      height: 209rpx;
      margin: 0 15rpx 20rpx 15rpx;
      background-image: url('https://www.zxd-hotel.xin/zxdhotel/icon/list_red_pack@2x.png');
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

      .toBeUsed {
        background-image: url('https://www.zxd-hotel.xin/zxdhotel/icon/daishiyong.png');
      }

      .used {
        top: 20rpx;
        right: 20rpx;
        width: 80rpx;
        height: 80rpx;
        background-image: url('/static/base/used.png') !important;
      }

      .expired {
        top: 20rpx;
        right: 20rpx;
        width: 80rpx;
        height: 80rpx;
        background-image: url('/static/base/expired.png') !important;
      }

      .lb-used {
        top: 20rpx;
        right: 20rpx;
        width: 80rpx;
        height: 80rpx;
        background-image: url('https://www.zxd-hotel.xin/zxdhotel/icon/lb-used.png') !important;
      }

      .lb-expired {
        top: 20rpx;
        right: 20rpx;
        width: 80rpx;
        height: 80rpx;
        background-image: url('https://www.zxd-hotel.xin/zxdhotel/icon/lb-expired.png') !important;
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

    .lb-item {
      background-image: url('https://www.zxd-hotel.xin/zxdhotel/icon/lbbj@2x.png');
    }

    .coupon-item-null {
      flex: 1;
      display: flex;
      align-items: center;
      height: 200rpx;
      margin: 0 15rpx 20rpx 15rpx;
      background-size: 100% 100%;
      background-position: center;
      background-repeat: no-repeat;
      position: relative;
      border-radius: 28rpx;
    }

    .coupon-info {
      width: 630rpx;
      height: 180rpx;
      margin: 10rpx 20rpx;
      position: relative;
      display: flex;
      align-content: center;
      justify-content: space-between;

      .coupon-info-l {
        width: 500rpx;
        height: 100%;
        position: relative;
        left: 25rpx;
        display: flex;

        .coupon-info-l-icon {
          width: 74rpx;
          height: 80rpx;
        }

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

        .coupon-info-l-l {
          display: flex;
          align-items: center;
        }

        .coupon-info-l-r {
          margin-left: 36rpx;
        }

        .used-text {
          color: #A2A2A8 !important;
        }

        .coupon-info-l-time {
          position: absolute;
          top: 80rpx;
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
          top: 120rpx;

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

          .used-tag::before {
            border-color: #A2A2A8;
          }
        }
      }

      .coupon-info-r {
        display: flex;
        flex-direction: column; /* 垂直排列 */
        align-items: center; /* 水平居中 */
        justify-content: center; /* 垂直居中 */

        .coupon-info-r-amount-box-t {
          width: 168rpx;
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

        .coupon-info-r-amount-box-b {
          width: 140rpx;
          height: 64rpx;
          background: linear-gradient(90deg, #FFB053 0%, #FFF6DF 100%);
          border-radius: 36rpx;
          margin-top: 6rpx;
          font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;
          font-weight: 500;
          font-size: 28rpx;
          color: #920023;
          line-height: 64rpx;
          text-align: center;
          font-style: normal;
          border: none;
        }
      }
    }
  }
}

.share-canvas {
  position: fixed;
  left: -9999px;
  width: 500px;
  height: 400px;
  visibility: hidden;
}

.load-more-status {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 20rpx 60rpx 20rpx;

  .loading {
    display: flex;
    align-items: center;
    justify-content: center;

    .loading-icon {
      width: 32rpx;
      height: 32rpx;
      border: 3rpx solid #ddd;
      border-top: 3rpx solid #ff9900;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin-right: 16rpx;
    }

    .loading-text {
      font-size: 28rpx;
      color: #666;
    }
  }

  .no-more {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;

    .no-more-line {
      flex: 1;
      height: 1rpx;
      background: linear-gradient(to right, transparent, #e0e0e0, transparent);
    }

    .no-more-text {
      font-size: 24rpx;
      color: #999;
      padding: 0 30rpx;
      position: relative;
    }
  }

  .empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 60rpx 20rpx;

    .empty-icon {
      width: 120rpx;
      height: 120rpx;
      margin-bottom: 20rpx;
      opacity: 0.6;
    }

    .empty-text {
      font-size: 28rpx;
      color: #999;
    }
  }
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* Tab切换加载遮罩 */
.tab-loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(243, 244, 246, 0.9);
  backdrop-filter: blur(8rpx);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;

  .tab-loading-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.95);
    padding: 60rpx 80rpx;
    border-radius: 20rpx;
    box-shadow: 0 10rpx 40rpx rgba(0, 0, 0, 0.1);

    .tab-loading-spinner {
      display: flex;
      gap: 8rpx;
      margin-bottom: 24rpx;

      .spinner-ring {
        width: 12rpx;
        height: 12rpx;
        border-radius: 50%;
        background: linear-gradient(45deg, #ff9900, #ffcc00);
        animation: spinner-bounce 1.2s infinite ease-in-out;

        &:nth-child(1) {
          animation-delay: -0.24s;
        }

        &:nth-child(2) {
          animation-delay: -0.12s;
        }

        &:nth-child(3) {
          animation-delay: 0s;
        }
      }
    }

    .tab-loading-text {
      font-size: 28rpx;
      color: #666;
      font-weight: 500;
    }
  }
}

/* 加载时的模糊效果 */
.loading-blur {
  opacity: 0.6;
  filter: blur(2rpx);
  transition: all 0.3s ease;
}

/* 首次加载动画 */
.first-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80rpx 20rpx;

  .first-loading-spinner {
    display: flex;
    gap: 12rpx;
    margin-bottom: 32rpx;

    .bounce-dot {
      width: 16rpx;
      height: 16rpx;
      background: linear-gradient(45deg, #ff9900, #ffcc00);
      border-radius: 50%;
      animation: bounce-loading 1.4s infinite ease-in-out both;

      &:nth-child(1) {
        animation-delay: -0.32s;
      }

      &:nth-child(2) {
        animation-delay: -0.16s;
      }

      &:nth-child(3) {
        animation-delay: 0s;
      }
    }
  }

  .first-loading-text {
    font-size: 28rpx;
    color: #666;
    font-weight: 500;
  }
}

@keyframes spinner-bounce {
  0%, 80%, 100% {
    transform: scale(0.8);
    opacity: 0.5;
  }
  40% {
    transform: scale(1.2);
    opacity: 1;
  }
}

@keyframes bounce-loading {
  0%, 80%, 100% {
    transform: scale(0.8) translateY(0);
  }
  40% {
    transform: scale(1) translateY(-20rpx);
  }
}
</style>