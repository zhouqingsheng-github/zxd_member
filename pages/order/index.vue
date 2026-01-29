<template>
  <view class="page">
    <!-- 顶部自定义导航栏 -->
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
          <text class="nav-title">我的订单</text>
        </template>
      </uni-nav-bar>

      <!-- 订单状态 Tab -->
      <view class="tabs-wrapper">
        <scroll-view 
            class="tabs-scroll" 
            scroll-x 
            show-scrollbar="false"
            :scroll-left="scrollLeft"
        >
          <view class="tabs-container">
            <view
                v-for="(tab, idx) in tabs"
                :key="tab.value"
                :class="['tab', { active: currentTab === tab.value }]"
                @click="switchTab(tab.value)"
                v-if="!(tab.value === 6 && !showExchangeTab)">
              {{ tab.label }}
              <view v-if="tab.value === 6 && showExchangeTab" class="red-dot"></view>
            </view>
          </view>
        </scroll-view>
        <!-- 右侧白色遮挡 -->
        <view class="tabs-mask-left"></view>
        <view class="tabs-mask"></view>
      </view>
    </view>

    <!-- 列表区域 -->
    <scroll-view
        class="order-list"
        scroll-y
        @scrolltolower="loadMore"
        enable-back-to-top
        refresher-enabled
        :refresher-triggered="refreshing"
        @refresherrefresh="onRefresh"
    >
      <!-- 切换 Tab 遮罩 -->
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

      <!-- 订单卡片 -->
      <view
          v-for="order in orders"
          :key="order.id"
          class="order-card"
          :class="{ 'loading-blur': tabLoading }"
      >
        <!-- 订单号和状态 -->
        <template v-if="order.type === 0">
        <view class="order-header">
          <text class="order-number">订单号：{{
              order.orderNo
            }}
          </text>
          <view class="status-section">
            <text class="order-status" :class="'status-' + order.orderStatus">
              {{ statusText(order.orderStatus) }}
            </text>
            <view v-if="order.orderStatus === 4 || order.orderStatus === 5" class="verticalLine"></view>
            <image
                v-if="order.orderStatus === 4 || order.orderStatus === 5"
                class="delete-icon"
                @click.stop="deleteOrder(order)"
                src="/static/base/delete.png" mode="aspectFill"></image>
          </view>
        </view>
        </template>
        <template v-else-if="order.type === 1">
          <view class="order-header order-bg">
            <text class="order-number">订单号：{{
                order.orderNo
              }}
            </text>
            <view class="status-section">
              <text class="order-status" :class="'status-' + order.orderStatus">
                {{ statusText(order.orderStatus) }}
              </text>
              <view v-if="order.orderStatus === 4 || order.orderStatus === 5" class="verticalLine"></view>
              <image
                  v-if="order.orderStatus === 4 || order.orderStatus === 5"
                  class="delete-icon"
                  @click.stop="deleteOrder(order)"
                  src="/static/base/delete.png" mode="aspectFill"></image>
            </view>
          </view>
        </template>
        <!-- 酒店信息 -->
        <view class="hotel-info" @click="goDetail(order)">
          <image class="hotel-image" :src="order.mainPicture || defaultCover" mode="aspectFill"/>
          <view class="hotel-details" v-if="order.type === 0">
            <text class="hotel-name">{{ order.hotelName }}</text>
            <text class="room-info">{{ order.roomTypeName }} | {{ order.saleMode === 1 ? '房间数' : '床位数' }}：{{ order.roomCount }}</text>
            <text class="date-info">{{ formatDateRange(order.checkInDate, order.checkOutDate) }}</text>
          </view>
          <view class="hotel-details" v-if="order.type === 1">
            <text class="hotel-name">{{ order.hotelName }}</text>
            <text class="room-info"> 购买日期：{{ order.createTime }}</text>
            <text class="date-info">{{ formatDateRange2(order.checkInDate, order.checkOutDate) }}</text>
          </view>
        </view>
        <view class="line"></view>
        <!-- 价格和操作按钮 -->
        <view class="bottom-section">
          <!-- 价格信息 -->
          <template v-if="order.type === 0">
          <view class="price-info">
              <text class="price-label">{{ getPriceLabel(order.orderStatus) }}</text>
              <text class="price-amount">
                <text class="currency">￥</text>
                {{ order.totalAmount }}
              </text>
          </view>
          </template>
          <template v-else-if="order.type === 1">
          <view class="order_source">
              订单来源：探探糖
          </view>
          </template>

          <!-- 操作按钮 -->
          <view class="action-buttons">
            <!-- 待支付状态：取消订单 + 立即支付 -->
            <template v-if="order.orderStatus === 1">
              <view class="btn btn-cancel" @click.stop="cancelOrder(order)">
                取消订单
              </view>
              <view class="btn btn-pay" @click.stop="payOrder(order)">
                立即支付
              </view>
            </template>

            <!-- 已支付状态：取消订单 + 查看详情 -->
            <template v-else-if="order.orderStatus === 2">
              <view class="btn btn-cancel" @click.stop="refund(order)">
                取消订单
              </view>
              <view class="btn btn-detail" @click.stop="goDetail(order)">
                查看详情
              </view>
            </template>

            <!-- 已完成状态：去评价 + 再次预订 -->
            <template v-else-if="order.orderStatus === 3 && order.type !=1">
              <!--              <view class="btn btn-review" @click.stop="reviewOrder(order)">
                              去评价
                            </view>-->
              <view class="btn btn-rebook" @click.stop="rebookOrder(order)">
                再次预订
              </view>
            </template>

            <!-- 已取消状态：再次预订 -->
            <template v-else-if="order.orderStatus === 5 && order.type !=1">
              <view class="btn btn-rebook" @click.stop="rebookOrder(order)">
                再次预订
              </view>
            </template>
            <!-- 默认状态：查看详情 -->
            <template v-else-if="order.orderStatus === 6 && order.type === 1">
              <view class="btn btn-detail" @click.stop="gotoUse(order)">
                去兑换
              </view>
            </template>
          </view>
        </view>
      </view>

      <!-- 加载/空状态 -->
      <view v-if="!tabLoading && !refreshing" class="load-more-status">
        <view v-if="loading && currentPage > 1" class="loading">
          <view class="loading-icon"></view>
          <text class="loading-text">加载中...</text>
        </view>
        <view v-else-if="!hasMore && orders.length > 0" class="no-more">
          <text class="no-more-text">已经到底啦</text>
        </view>
        <EmptyState
            v-else-if="!loading && !orders.length"
            text="暂无订单"
        />
      </view>
    </scroll-view>

    <CustomTabbar :current="'order'"/>
  </view>
</template>

<script>
import CustomTabbar from "@/components/CustomTabbar.vue";
import EmptyState from "@/components/EmptyState.vue";
import UImage from "../../uni_modules/uview-ui/components/u--image/u--image.vue";
import {cancelOrder, deleteOrder, getOrderList, notWrittenOff, refundOrder} from "@/common/api.js";
import {payRetry, validateRefund} from "../../common/api";
import {pageBack} from "../../common/redirect";

export default {
  name: "OrderPage",
  components: {UImage, CustomTabbar, EmptyState},
  onPullDownRefresh() {
    uni.stopPullDownRefresh();
    return false;
  },
  onLoad() {
    uni.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#FFFFFF'
    });
  },
  onShow() {
    uni.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#FFFFFF'
    });
    uni.pageScrollTo({
      scrollTop: 0,
      duration: 0
    });
    this.listData();
    this.showExchangeTabFun()
  },
  data() {
    return {
      tabs: [
        {label: "全部", value: 0},
        {label: "待兑换", value: 6},
        {label: "待支付", value: 1},
        {label: "待入住", value: 2},
        {label: "已完成", value: 3},
        {label: "已取消", value: 5}
      ],
      currentTab: 0,
      scrollLeft: 0,
      orders: [],
      currentPage: 1,
      pageSize: 5,
      total: 0,
      hasMore: true,
      loading: false,
      tabLoading: false,
      refreshing: false,
      defaultCover: "",
      bottomPaddingRpx: 0,
      isPaying: false,
      showExchangeTab:false
    };
  },
  mounted() {
    this.calcTabbarHeight();
  },
  watch: {
    currentTab: {
      immediate: true,
      handler: async function () {
        this.tabLoading = true;
        await this.$nextTick();
        this.resetAndLoadData();
      }
    }
  },
  methods: {
    goBack() {
      pageBack()
    },
    async showExchangeTabFun() {
      // 在获取订单列表前先判断是否显示"待兑换"标签
      this.showExchangeTab = await notWrittenOff({})
          .catch((error) => {
            throw new Error(error.message || '加载失败');
          });
    },
    switchTab(value) {
      if (this.currentTab === value) return;
      this.currentTab = value;
      // 计算需要滚动的距离，使当前选中的标签居中显示
      const index = this.tabs.findIndex(tab => tab.value === value);
      if (index !== -1) {
        // 每个tab大约80rpx宽，计算居中位置
        this.scrollLeft = index * 80 - 150; // 150约为屏幕中心偏移
      }
    },
    onRefresh() {
      this.refreshing = true;
      this.resetAndLoadData();
    },
    formatDate(dateStr) {
      if (!dateStr) return "";
      const date = new Date(dateStr);
      const m = (date.getMonth() + 1).toString().padStart(2, "0");
      const d = date.getDate().toString().padStart(2, "0");
      return `${m}.${d}`;
    },
    formatDateRange(checkIn, checkOut) {
      if (!checkIn || !checkOut) return "";
      const startDate = new Date(checkIn);
      const endDate = new Date(checkOut);
      const diffTime = Math.abs(endDate - startDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      const formatDate = (date) => {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${year}.${month}.${day}`;
      };

      return `${formatDate(startDate)}至${formatDate(endDate)}（共${diffDays}晚）`;
    },
    formatDateRange2(checkIn, checkOut) {
      if (!checkIn || !checkOut) return "";
      const startDate = new Date(checkIn);
      const endDate = new Date(checkOut);
      const formatDate = (date) => {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${year}.${month}.${day}`;
      };
      const formatDate2 = (date) => {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');
        return `${year}.${month}.${day}(${hours}:${minutes}:${seconds})`;
      };
      return `有效期：${formatDate(startDate)}至${formatDate(endDate)}`;
    },
    statusText(status) {
      const map = {
        '-2': "已过期",
        '-1': "已锁定",
        '1': "待支付",
        '2': "待入住",
        // 3: "待评价",
        '3': "已完成",
        '4': "已完成",
        '5': "已取消",
        '6': "待兑换",
      };
      return map[status] || "全部";
    },
    getPriceLabel(status) {
      const map = {
        1: "应付总额",
        2: "实付总额",
        3: "实付总额",
        4: "实付总额",
        5: "已退款",
        6: "订单来源"
      };
      return map[status] || "实付总额";
    },
    resetAndLoadData() {
      this.currentPage = 1;
      this.hasMore = true;
      this.total = 0;
      this.listData();
    },
    async listData() {
      if (this.loading) return;
      this.loading = true;
      try {
        // 先判断是否需要显示"待兑换"标签
        const params = {
          page: this.currentPage,
          pageSize: this.pageSize
        };
        if (this.currentTab !== 0) params.orderStatus = this.currentTab;
        const res = await getOrderList(params)
            .catch((error) => {
              throw new Error(error.message || '加载失败');
            });
        if (!res || !res.records) {
          throw new Error('数据格式错误');
        }
        if (this.currentPage === 1) {
          this.orders = res.records;
        } else {
          const newRecords = res.records.filter(newOrder =>
              !this.orders.some(existingOrder => existingOrder.id === newOrder.id)
          );
          this.orders = [...this.orders, ...newRecords];
        }
        this.total = res.total || 0;
        this.hasMore = this.currentPage < (res.pages || 0);

        if (res.records.length === 0 && this.currentPage > 1) {
          this.currentPage--;
        }
      } catch (e) {
        console.error('加载数据失败:', e);
        uni.showToast({
          title: e.message || "加载失败，请重试",
          icon: "none"
        });
      } finally {
        this.loading = false;
        this.tabLoading = false;
        this.refreshing = false;
      }
    },
    loadMore() {
      if (!this.hasMore || this.loading || this.tabLoading || this.refreshing) return;
      this.currentPage++;
      this.listData();
    },
    goDetail(order) {
      if (order.type === 0) {
        uni.navigateTo({
          url: `/pages/subPackages/order/detail?id=${order.id}`
        });
      }
      if (order.type === 1) {
        uni.navigateTo({
          url: `/pages/subPackages/order/three_detail?orderNo=${order.orderNo}`
        });
      }
    },
    gotoUse(order) {
      uni.showModal({
        title: '提示',
        content: '由于此订单为探探糖订单，如需发票请联系探探糖平台进行开具。感谢您的理解与支持！',
        confirmText: '继续使用',
        cancelText: '取消',
        success: async (res) => {
          if (res.confirm) {
            await uni.navigateTo({
              url: `/pages/subPackages/home/search/jointSales?id=${order.id}&business=threeOrder`,
            });
          }
        }
      });
    },
    cancelOrder(order) {
      uni.showModal({
        title: '提示',
        content: '订单确认取消后将无法恢复，是否确认取消？',
        confirmText: '确认取消',
        cancelText: '暂不取消',
        success: async (res) => {
          if (res.confirm) {
            uni.showLoading({
              title: '取消中...'
            });
            await cancelOrder(order.id)
                .catch((err) => {
                  uni.hideLoading();
                  uni.showToast({
                    title: err.error || '取消订单失败',
                    icon: 'none'
                  });
                });
            uni.hideLoading();
            uni.showToast({
              title: '订单已取消',
              icon: 'success'
            });
            // 刷新订单列表
            this.resetAndLoadData();
          }
        }
      });
    },
    refund(order) {
      validateRefund(order.id)
          .then((res) => {
            uni.showModal({
              title: '提示',
              content: '订单确认取消后将无法恢复，是否确认取消？',
              confirmText: '确认取消',
              cancelText: '暂不取消',
              success: async (res) => {
                if (res.confirm) {
                  uni.showLoading({
                    title: '取消中...'
                  });
                  await refundOrder(order.id)
                      .then((res) => {
                        uni.hideLoading();
                        uni.showToast({
                          title: '订单已取消',
                          icon: 'success'
                        });
                        // 刷新订单列表
                        this.resetAndLoadData();
                      })
                      .catch((err) => {
                        uni.hideLoading();
                        uni.showModal({
                          title: '提示',
                          content: err.error || '取消订单失败',
                          showCancel: false,
                          confirmText: '我知道了'
                        });
                      });
                }
              }
            });
          })
          .catch((err) => {
            uni.hideLoading();
            if (err.error.indexOf('违约金') !== -1) {
              uni.showModal({
                title: '提示',
                content: err.error,
                confirmText: '确认取消',
                cancelText: '暂不取消',
                success: async (res) => {
                  if (res.confirm) {
                    uni.showLoading({
                      title: '取消中...'
                    });
                    await refundOrder(order.id)
                        .then((res) => {
                          uni.hideLoading();
                          uni.showToast({
                            title: '订单已取消',
                            icon: 'success'
                          });
                          // 刷新订单列表
                          this.resetAndLoadData();
                        })
                        .catch((err) => {
                          uni.hideLoading();
                          uni.showModal({
                            title: '提示',
                            content: err.error || '取消订单失败',
                            showCancel: false,
                            confirmText: '我知道了'
                          });
                        });
                  }
                }
              });
            } else {
              uni.showModal({
                title: '提示',
                content: err.error || '取消订单失败',
                showCancel: false,
                confirmText: '我知道了',
                success: async (res) => {
                  if (res.confirm) {
                    await refundOrder(order.id)
                        .then((res) => {
                          // 刷新订单列表
                          this.resetAndLoadData();
                        })
                        .catch((err) => {
                        });
                  }
                }
              });
            }
          });
    },
    async payOrder(order) {
      // 防止重复点击
      if (this.isPaying) return;
      this.isPaying = true;

      try {
        uni.showLoading({
          title: '支付中...',
          mask: true
        });

        const payResult = await payRetry(order.orderNo)
            .catch((err) => {
              throw new Error(err.error || err.msg || '支付失败');
            });

        uni.hideLoading();

        uni.requestPayment({
          provider: 'wxpay',
          ...(payResult.payParams),
          success: (res) => {
            uni.showToast({
              title: '支付成功',
              icon: 'success'
            });
            // 支付成功后跳转到订单列表
            setTimeout(() => {
              uni.redirectTo({
                url: '/pages/order/list'
              });
            }, 1500);
          },
          fail: (err) => {
          },
          complete: () => {
            // 重置支付状态
            setTimeout(() => {
              this.isPaying = false;
            }, 1000); // 1秒后才能再次点击
          }
        });
      } catch (error) {
        uni.hideLoading();
        uni.showToast({
          title: error.message || '支付失败',
          icon: 'none'
        });
        // 发生错误时也要重置支付状态
        setTimeout(() => {
          this.isPaying = false;
        }, 1000);
      }
    },
    reviewOrder(order) {
      // 跳转到评价页面
      uni.navigateTo({
        url: `/pages/subPackages/order/review?id=${order.id}`
      });
    },
    rebookOrder(order) {
      // 重新预订，跳转到酒店详情页
      const query = `?id=${order.roomTypeId}&orderId=${order.id}`;
      uni.navigateTo({
        url: '/pages/subPackages/order/index' + query
      });
    },
    deleteOrder(order) {
      uni.showModal({
        title: '提示',
        content: '订单删除后将无法恢复，是否确认删除？',
        confirmText: '确认删除',
        cancelText: '暂不删除',
        success: async (res) => {
          if (res.confirm) {
            // 这里应该调用删除订单的API
            await deleteOrder(order.id)
            uni.showToast({
              title: '订单已删除',
              icon: 'success'
            });
            // 刷新订单列表
            this.resetAndLoadData();
          }
        }
      });
    },
    /* ===== 计算 Tabbar 高度并转换为 rpx ===== */
    calcTabbarHeight() {
      // 1. 屏幕宽度（px）
      const screenW = uni.getSystemInfoSync().windowWidth;
      // 2. 查询 .tabbar 元素实际高度（px）
      uni.createSelectorQuery()
          .in(this)
          .select('.tabbar')
          .boundingClientRect(rect => {
            if (!rect) return;
            // 3. px → rpx：1 rpx = 屏宽/750 px  ⇒  px*750/屏宽
            const rpx = Math.ceil(rect.height * 750 / screenW);
            this.bottomPaddingRpx = rpx;
          })
          .exec();
    }
  }
};
</script>

<style scoped lang="scss">
.page {
  background: #f3f4f6;
  height: 100vh;
  overflow: hidden;

  .fixed-header {
    background: #fff;
  }

  .nav-title {
    width: 100%;
    font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;
    font-weight: 500;
    font-size: 32rpx;
    color: #19191A;
    text-align: center;
    height: 88rpx;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .tabs-wrapper {
    height: 70rpx;
    margin-top: 34rpx;
    position: relative;

    .tabs-scroll {
      white-space: nowrap;
      width: 100%;
      height: 70rpx;
      position: relative;

      .tabs-container {
        display: flex;
        padding: 0 44rpx;
        width: max-content;
        height: 70rpx;
        align-items: center;
        justify-content: space-around;
        position: relative;

        .tab {
          margin: 0 30rpx;
          font-size: 26rpx;
          color: #333;
          flex-shrink: 0;
          position: relative;
          
          &.active {
            font-weight: 500;
          }

          /* 红点样式 */
          .red-dot {
            position: absolute;
            top: -10rpx;
            right: -10rpx;
            width: 14rpx;
            height: 14rpx;
            background: url('https://www.zxd-hotel.xin/zxdhotel/icon/tag_dot.png') no-repeat;
            background-size: cover;
            border-radius: 50%;
            border: 2rpx solid #fff; /* 加白边更精致 */
          }
        }
        
        // 选中标签的下划线，固定在容器底部
        .tab.active::after {
          content: "";
          display: block;
          width: 40rpx;
          height: 4rpx;
          background: #ee781f;
          border-radius: 2rpx;
          position: absolute;
          bottom: -15rpx;
          left: 50%;
          transform: translateX(-50%);
        }
      }
    }
    
    // 右侧白色遮挡
    .tabs-mask-left {
      position: absolute;
      top: 0;
      left: 0;
      width: 60rpx;
      height: 70rpx;
      background: #FFFFFF;
      z-index: 999;
      pointer-events: none;
    }
    // 右侧白色遮挡
    .tabs-mask {
      position: absolute;
      top: 0;
      right: 0;
      width: 60rpx;
      height: 70rpx;
      background: #FFFFFF;
      z-index: 999;
      pointer-events: none;
    }
  }

  .order-list {
    /* 左右上 padding 依旧写死；底部由行内 style 动态控制 */
    height: calc(100vh - var(--status-bar-height) - 88rpx - 68rpx - 100rpx);
    overflow-y: auto;
    padding-bottom: 40rpx;

    .order-card {
      background: #FFFFFF;
      border-radius: 28rpx;
      margin: 28rpx;
      overflow: hidden;

      &.loading-blur {
        filter: blur(2rpx);
        opacity: 0.6;
      }

      .order-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 40rpx 28rpx 38rpx 28rpx;
        .order-number {
          font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;
          font-weight: 400;
          font-size: 24rpx;
          color: #6D7278;
          line-height: 24rpx;
          text-align: left;
          font-style: normal;
        }

        .status-section {
          display: flex;
          align-items: center;
          gap: 16rpx;

          .order-status {
            font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;
            font-weight: 400;
            font-size: 24rpx;
            color: #19191A;
            line-height: 24rpx;
            text-align: right;
            font-style: normal;

            &.status-1 {
              color: #EE781F;
            }

            &.status-2 {
              color: #19191A;
            }

            &.status-3 {
              color: #19191A;
            }

            &.status-4 {
              color: #A2A2A8;
            }

            &.status-5 {
              color: #A2A2A8;
            }
          }

          .delete-icon {
            //transition: all 0.3s ease;
            width: 24rpx;
            height: 24rpx;

            &:active {
              background: #f0f0f0;
              transform: scale(0.9);
            }
          }

          .verticalLine {
            width: 2rpx;
            height: 31rpx;
            background: #E8E9EB;
          }
        }
      }

      .order-bg{
        background: linear-gradient( 180deg, #FCE8D8 0%, rgba(255,255,255,0.5) 100%), #FFFFFF;

      }
      .line {
        height: 1rpx;
        background: #E8E9EB;
        margin: 40rpx 28rpx 28rpx;
      }

      .hotel-info {
        display: flex;
        align-items: stretch;
        padding: 0 24rpx 0;

        .hotel-image {
          width: 120rpx;
          height: 120rpx;
          border-radius: 8rpx;
          margin-right: 20rpx;
          flex-shrink: 0;
        }

        .hotel-details {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          min-height: 120rpx;

          .hotel-name {
            font-size: 28rpx;
            font-weight: 500;
            color: #333;
            margin-bottom: 8rpx;
          }

          .room-info {
            font-size: 24rpx;
            color: #666;
            margin-bottom: 8rpx;
          }

          .date-info {
            font-size: 24rpx;
            color: #666;
          }
        }
      }

      .bottom-section {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 24rpx 20rpx;

        .price-info {
          display: flex;
          flex-direction: column;
          align-items: flex-start;

          .price-label {
            font-size: 24rpx;
            color: #666;
            margin-bottom: 4rpx;
          }

          .price-amount {
            font-size: 40rpx;
            font-weight: 600;
            color: #ee781f;

            .currency {
              font-size: 24rpx;
              font-weight: 400;
            }
          }
        }
        .order_source{
          font-family: PingFangSC, PingFang SC,serif;
          font-weight: 400;
          font-size: 24rpx;
          color: #6D7278;
          line-height: 24rpx;
          text-align: left;
          font-style: normal;
        }
        .action-buttons {
          display: flex;
          align-items: center;
          gap: 16rpx;

          .btn {
            box-sizing: border-box;
            transition: all 0.3s ease;
            background: #EE781F;
            border-radius: 36rpx;
            font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;
            font-weight: 400;
            font-size: 28rpx;
            color: #FFFFFF;
            text-align: center;
            font-style: normal;
            height: 72rpx;
            line-height: 72rpx;
            padding: 0 34rpx;

            &.btn-cancel {
              position: relative;
              background: #FFFFFF;
              color: #19191A;
              border: none;

              &::after {
                content: " ";
                position: absolute;
                top: 0;
                left: 0;
                width: 200%;
                height: 200%;
                transform: scale(0.5);
                transform-origin: 0 0;
                pointer-events: none;
                box-sizing: border-box;
                border: 1px solid #CBCBD5;
                border-radius: 72rpx;
              }
            }

            &.btn-detail {
              background: #ee781f;
              color: #fff;
              border: 1rpx solid #ee781f;
            }

            &.btn-pay {
              background: #ee781f;
              color: #fff;
              border: 1rpx solid #ee781f;
            }

            &.btn-review {
              background: #ee781f;
              color: #fff;
              border: 1rpx solid #ee781f;
            }

            &.btn-rebook {
              background: #ee781f;
              color: #fff;
              border: 1rpx solid #ee781f;
            }

            /* 按钮点击效果 */
            &:active {
              transform: scale(0.95);
              opacity: 0.8;
            }
          }
        }
      }
    }
  }

  /* ---------------- 加载/空状态样式 ---------------- */
  .load-more-status {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0 20rpx 120rpx 20rpx;

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
  }

  /* ---------------- Tab 切换加载遮罩 ---------------- */
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
}

/* 旋转动画 */
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>