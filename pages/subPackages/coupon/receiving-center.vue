<template>
  <view class="collection-center-page">
    <view class="fixed-header">
      <uni-nav-bar
          backgroundColor="transparent"
          :shadow="false"
          :border="false"
          status-bar
          left-icon="left"
          @clickLeft="back"
      >
        <template #default>
          <text class="nav-title">领取中心</text>
        </template>
      </uni-nav-bar>
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
      <view class="coupon-item-null"></view>
      <view
          v-for="coupon in coupons"
          :key="coupon.id">
        <!-- 按照红包页面的样式调整 -->
        <view class="coupon-item-container">
          <view class="coupon-item">
            <view class="coupon-info">
              <view class="coupon-info-l">
                <view class="coupon-info-l-title">
                  {{ coupon.name }}
                </view>
                <view class="coupon-info-l-time" v-if="coupon.startTime && !coupon.duration">
                  有效期{{ formatDate(coupon.startTime) }}-{{ formatDate(coupon.endTime) }}
                </view>
                <view class="coupon-info-l-time" v-else>
                  领取后{{ coupon.duration }}天内有效
                </view>
                <view class="coupon-info-l-tag">
                  <text v-if="coupon.minSpend > 0" class="tag">满{{ coupon.minSpend }}元可用</text>
                  <text v-else class="tag">无门槛立减</text>
                  <text v-if="coupon.scopeType === 1" class="tag">适用于全部门店</text>
                  <text v-else class="tag">适用于指定门店</text>
                  <text v-if="coupon.redPacketRule && coupon.redPacketRule.stayDays > 0" class="tag">
                    适用于连续{{ coupon.redPacketRule.stayDays }}晚及以上订单
                  </text>
                </view>
              </view>
              <view class="coupon-info-r">
                <view class="coupon-info-r-amount-box-t">
                  <view class="coupon-info-r-amount-box">
                    <view class="coupon-info-r-amount">{{ coupon.amount }}</view>
                    <view class="coupon-info-r-unit">元</view>
                  </view>
                </view>
                <view class="coupon-info-r-amount-box-b" @click="goToBusiness(coupon.id)">领取</view>
              </view>
            </view>
          </view>
          <view v-if="coupon.redPacketRule && coupon.redPacketRule.rule" class="coupon-item-rule-desc">
            {{ coupon.redPacketRule.rule }}
          </view>
        </view>
      </view>

      <!-- 加载状态提示 -->
      <view v-if="!tabLoading && !refreshing" class="load-more-status">
        <view v-if="loading && currentPage > 1" class="loading">
          <view class="loading-icon"></view>
          <text class="loading-text">加载中...</text>
        </view>
        <view v-else-if="!hasMore && coupons.length > 0" class="no-more">
          <text class="no-more-text">已经到底啦</text>
        </view>
        <EmptyState
            v-else-if="!loading && !coupons.length"
            text="暂无红包"
        />
      </view>
    </scroll-view>
  </view>
</template>

<script>
import EmptyState from "../../../components/EmptyState.vue";
import {receivingCenter, receiveRedEnvelope} from "../../../common/api";
import {checkLogin} from "../../../store";
import coupon from "../../coupon/index.vue";
import {pageBack} from "../../../common/redirect";

export default {
  name: "receivingCenter",
  computed: {
    coupon() {
      return coupon
    }
  },
  components: {EmptyState},
  data() {
    return {
      coupons: [],
      // 分页相关
      currentPage: 1,
      pageSize: 5,
      total: 0,
      hasMore: true,
      loading: false,
      tabLoading: false, // 专门用于tab切换时的加载状态
      refreshing: false, // 专门用于下拉刷新的状态
      scrollViewHeight: 300 // 添加scroll-view高度变量
    }
  },
  onPullDownRefresh() {
    uni.stopPullDownRefresh();
    return false;
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
      // 查询底部导航栏高度（如果有）
      query.select('.bottom-nav').boundingClientRect();

      query.exec((res) => {
        const headerHeight = res[0] ? res[0].height : 0;
        const bottomNavHeight = res[1] ? res[1].height : 0;
        // 获取屏幕可用高度
        const systemInfo = uni.getSystemInfoSync();
        const screenHeight = systemInfo.windowHeight;
        // 计算scroll-view高度 = 屏幕高度 - 各固定区域高度
        const scrollViewHeight = screenHeight - headerHeight - bottomNavHeight;
        this.scrollViewHeight = scrollViewHeight > 100 ? scrollViewHeight : screenHeight - 100;
      });
    },
    async goToBusiness(id) {
      if (!checkLogin()) {
        await uni.navigateTo({
          url: '/pages/subPackages/user/login',
          redirectUrl: '/pages/subPackages/coupon/receiving-center'
        });
        return;
      }
      try {
        const result = await receiveRedEnvelope(id)
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
    },
    back() {
      pageBack()
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
          status: 1
        }
        const res = await receivingCenter(params);
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
  },
  onLoad() {
    uni.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#FFFFFF'
    });
  },
  onShow() {
    this.listData();
  }
}
</script>

<style scoped lang="scss">

.coupon-item-null {
  flex: 1;
  display: flex;
  align-items: center;
  height: 170rpx;
  margin: 0 15rpx 20rpx 15rpx;
  background-size: 100% 100%;
  background-position: center;
  background-repeat: no-repeat;
  position: relative;
  border-radius: 28rpx;
}

.collection-center-page {

  .fixed-header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 999;
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

  .coupon-list {
    padding: 0 15rpx calc(env(safe-area-inset-bottom)) 15rpx;
    box-sizing: border-box;
    width: 100%;
    overflow-y: auto;

    .coupon-item-container {
      margin-bottom: 20rpx;
      position: relative;
    }

    .coupon-item {
      display: flex;
      align-items: center;
      height: 209rpx;
      background-image: url('https://www.zxd-hotel.xin/zxdhotel/icon/list_red_pack@2x.png');
      background-size: 100% 100%;
      background-position: center;
      background-repeat: no-repeat;
      position: relative;
      border-radius: 28rpx;
    }

    .coupon-item-rule-desc {
      margin: -30rpx 0 20rpx 0;
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

    .coupon-info {
      width: 630rpx;
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
        }
      }

      .coupon-info-r {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

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
              line-height: 1;
              margin-left: 4rpx;
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
        }
      }
    }

    .receive-btn {
      position: absolute;
      right: 30rpx;
      bottom: 30rpx;
      width: 140rpx;
      height: 64rpx;
      background: linear-gradient(90deg, #FFB053 0%, #FFF6DF 100%);
      border-radius: 36rpx;
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
}
</style>