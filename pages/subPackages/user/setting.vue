<template>
  <view class="container">
    <uni-nav-bar
        backgroundColor="#FFFFFF"
        color="#19191A"
        :fixed="true"
        :shadow="false"
        :border="false"
        status-bar
        left-icon="left"
        @clickLeft="back"
    >
      <template #default>
        <text class="nav-title">设置</text>
      </template>
    </uni-nav-bar>

    <view class="setting-list">
      <view class="setting-item" v-for="item in items" :key="item.text" @click="onItemClick(item)">
        <text>{{ item.text }}</text>
        <view class="arrow"></view>
      </view>
    </view>
    <view class="logout-btn" @click="onLogout">退出登录</view>

    <!-- 底部弹出列表 -->
    <uni-popup ref="servicePopup" type="bottom" v-if="popupVisible">
      <view class="service-popup">
        <view class="popup-header">
          <text class="popup-title">联系客服</text>
          <text class="popup-close" @click="closeServicePopup">×</text>
        </view>
        <view class="service-list">
          <view class="service-item" v-for="(item, index) in serviceList" :key="index"
                @click="makePhoneCall(item.contactPhone)">
            <text class="store-name">{{ item.name }}</text>
            <text class="phone-number">{{ item.contactPhone }}</text>
          </view>
        </view>
      </view>
      <transition name="fade-bottom">
        <view class="popup-safe-area"></view>
      </transition>
    </uni-popup>
  </view>
</template>

<script>
import {clearUserInfo} from '@/store/index.js';
import UniPopup from "../../../uni_modules/uni-popup/components/uni-popup/uni-popup.vue";
import {logOutOfAccount} from "../../../common/api";
import {pageBack} from "../../../common/redirect";

const {http} = uni.$u

export default {
  components: {UniPopup},
  data() {
    return {
      items: [
        {text: '用户协议', key: 'agreement'},
        {text: '隐私政策', key: 'privacy'},
        {text: '联系客服', key: 'service'},
        {text: '关于我们', key: 'about'},
        {text: '注销账号', key: 'deleteAccount'},
      ],
      serviceList: [],
      popupVisible: false,
    }
  },
  methods: {
    // 获取联系电话
    async getContactPhone() {
      try {
        const res = await http.get("/hotel-stores/hotels/getServicePhone");
        this.serviceList = res;
      } catch (err) {
      }
    },
    onItemClick(item) {
      switch (item.key) {
        case 'agreement':
          uni.navigateTo({
            url: '/pages/subPackages/agreement/userAgreement'
          });
          break;
        case 'privacy':
          uni.navigateTo({
            url: '/pages/subPackages/agreement/privacyPolicy'
          });
          break;
        case 'service':
          this.popupVisible = true;
          this.getContactPhone();
          this.$nextTick(() => {
            this.$refs.servicePopup.open();
          });
          break;
        case 'about':
          uni.navigateTo({
            url: '/pages/subPackages/agreement/aboutUs'
          });
          break;
        case 'deleteAccount':
          this.onDeleteAccount();
          break;
        default:
          uni.showToast({
            title: '暂未设计，敬请期待！',
            icon: 'none'
          });
      }
    },
    closeServicePopup() {
      setTimeout(() => {
        this.$refs.servicePopup.close();
        this.popupVisible = false;
      }, 300);
    },
    makePhoneCall(phone) {
      uni.makePhoneCall({
        phoneNumber: phone,
        success: () => {
          this.closeServicePopup();
        }
      });
    },
    onLogout() {
      uni.showModal({
        title: '提示',
        content: '确定要退出登录吗？',
        confirmText: '退出',
        cancelText: '取消',
        success: (res) => {
          if (res.confirm) {
            uni.$u.http.post('/hotel-auth/logout')
                .then(() => {
                  if (typeof clearUserInfo === 'function') {
                    clearUserInfo();
                  }
                  uni.reLaunch({url: '/pages/subPackages/user/login'});
                })
                .catch(() => {
                  uni.showToast({title: '退出失败，请重试', icon: 'none'});
                });
          }
        }
      });
    },
    onDeleteAccount() {
      uni.showModal({
        title: '注销账号',
        content: '注销账号后将无法恢复，是否确认注销？',
        confirmText: '确认注销',
        cancelText: '取消',
        success: (res) => {
          if (res.confirm) {
            logOutOfAccount().then(() => {
              if (typeof clearUserInfo === 'function') {
                clearUserInfo();
              }
              let hasJumped = false;
              uni.showModal({
                title: '提示',
                content: '您的账号已注销，感谢您的使用！',
                showCancel: false,
                success: () => {
                  if (!hasJumped) {
                    hasJumped = true;
                    uni.reLaunch({url: '/pages/home/index'});
                  }
                }
              });
              // 2秒后自动跳转
              setTimeout(() => {
                if (!hasJumped) {
                  hasJumped = true;
                  uni.reLaunch({url: '/pages/home/index'});
                }
              }, 2000);
            }).catch(() => {
              uni.showToast({title: '注销失败，请重试', icon: 'none'});
            });
          }
        }
      });
    },
    back() {
      pageBack()
    }
  },
  onLoad() {
    uni.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#FFFFFF'
    });
  }
}
</script>

<style scoped>
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

.container {
  min-height: 100vh;
  background: #f5f6f8;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.nav-bar {
  width: 100%;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
  position: relative;
  box-sizing: border-box;
  padding: 0 16px;
  font-size: 18px;
  font-weight: bold;
}

.back {
  font-size: 22px;
  color: #333;
}

.title {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  color: #222;
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.dot {
  font-size: 18px;
  color: #888;
}

.circle {
  width: 20px;
  height: 20px;
  border: 2px solid #222;
  border-radius: 50%;
}

.setting-list {
  width: 694rpx;
  height: auto;
  background: #FFFFFF;
  border-radius: 28rpx;
  position: relative;
  top: 30rpx;
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 32rpx 40rpx 32rpx 40rpx;
  font-size: 18px;
  color: #222;
  border-bottom: 1px solid #f0f0f0;
}

.setting-item text {
  width: auto;
  height: 32rpx;
  font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;
  font-weight: 400;
  font-size: 32rpx;
  color: #19191A;
  line-height: 32rpx;
  text-align: left;
  font-style: normal;
}

.setting-item:last-child {
  border-bottom: none;
}

.arrow {
  width: 22rpx;
  height: 38rpx;
  background: url('/static/base/right.png') no-repeat center;
  margin-right: 0;
}

.logout-btn {
  margin-top: auto;
  margin-bottom: 40px;
  width: 640rpx;
  height: 92rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50rpx;
  background: #fff;
  border: none;
  font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;
  font-weight: 400;
  font-size: 32rpx;
  text-align: center;
  font-style: normal;
  position: relative;
}

.logout-btn::after {
  content: " ";
  position: absolute;
  top: 0;
  left: 0;
  width: 200%;
  height: 200%;
  transform: scale(0.5);
  transform-origin: 0 0;
  border-radius: 100rpx;
  border: 2rpx solid #A2A2A8;
  box-sizing: border-box;
  pointer-events: none;
}

/* 底部弹出列表样式 */
.service-popup {
  background-color: #FFFFFF;
  border-radius: 24rpx 24rpx 0 0;
  width: 100%;
  max-height: 60vh;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  padding-bottom: env(safe-area-inset-bottom);
}

.service-list {
  flex: 1;
  overflow-y: auto;
  min-height: 0;
}

.popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 32rpx;
  border-bottom: 1rpx solid #f0f0f0;
  background-color: #FFFFFF;
  position: sticky;
  top: 0;
  z-index: 1;
}

.popup-title {
  font-size: 32rpx;
  font-weight: 500;
  color: #19191A;
}

.popup-close {
  font-size: 40rpx;
  color: #A2A2A8;
  padding: 0 20rpx;
}

.service-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 32rpx;
  border-bottom: 1rpx solid #f0f0f0;
  background-color: #FFFFFF;
}

.service-item:active {
  background-color: #f5f5f5;
}

.store-name {
  font-size: 28rpx;
  color: #19191A;
}

.phone-number {
  font-size: 28rpx;
  color: #6D7278;
}

.popup-safe-area {
  width: 100vw;
  height: env(safe-area-inset-bottom, 34rpx);
  background: #fff;
  position: relative;
  z-index: 99999;
}
</style>