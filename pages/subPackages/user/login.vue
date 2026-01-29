<template>
  <view class="content">
    <uni-nav-bar
        :shadow="false"
        :border="false"
        :fixed="true"
        left-icon="left"
        status-bar
        @clickLeft="back">
      <template #default>
        <text class="nav-title">登录/注册</text>
      </template>
    </uni-nav-bar>
    <view class="login-body">
      <!-- Logo -->
      <image class="logo" src="/static/base/logo@2x.png" mode="aspectFit"></image>
      <!-- 标题 -->
      <text class="title">极简超经济酒店会员系统</text>
      <!-- 微信登录按钮 -->
      <button plain="true" class="wx-login-btn"  type="success" :open-type="agree ? 'getPhoneNumber' : ''"
              @getphonenumber="onGetPhone" shape="circle" @click="onWeChatLogin">
        <!--        <u-icon class="weixin-icon" name="weixin-fill" size="32" color="#ffffff"></u-icon>-->
        <view class="btn-text">手机号一键登录</view>
      </button>
      <!-- 协议勾选 -->
      <view class="agreement" @click="toAgree">
        <image
            :src="agree ? '/static/base/radio_checked.png' : '/static/base/radio_unchecked.png'"
            class="custom-radio"
            mode="aspectFit"
        />
        <text class="agreement-text">我已阅读并同意</text>
        <text class="link" @click.stop="openAgreement">《用户服务协议》</text>
        <text class="agreement-text">和</text>
        <text class="link" @click.stop="openPrivacy">《隐私政策》</text>
      </view>
      <view class="divider"></view>
      <!-- 遮挡层 -->
      <view class="mask-layer" @click="goPhoneLogin"></view>
      <!-- 手机号登录 -->
      <text class="phone-login" @click="goPhoneLogin">手机号验证码登录</text>
    </view>
  </view>
</template>

<script>
import {
  setToken,
  setUserInfo,
} from '@/store/index.js'
import {handleRedirect, getRedirectInfo, clearRedirectInfo} from "../../../common/redirect";

export default {
  data() {
    return {
      agree: false,
      sessionKey: '',
      code: '',
      shouldTriggerPhoneLogin: false
    }
  },
  mounted() {
    // 检查是否有重定向信息（getRedirectInfo会自动检查过期）
    const redirectInfo = getRedirectInfo();
    if (redirectInfo) {
      this.shouldTriggerPhoneLogin = true;
    }
  },
  onUnload() {
    // 页面卸载时（包括右滑返回、系统返回等），如果用户没有完成登录，清除重定向信息
    // 注意：登录成功后会调用 handleRedirect() 清除信息，所以这里只会清除未完成登录的情况
    const redirectInfo = getRedirectInfo();
    if (redirectInfo) {
      clearRedirectInfo();
    }
  },
  methods: {
    back() {
      // 如果有重定向信息，清除它并返回首页
      if (getRedirectInfo()) {
        clearRedirectInfo();
        uni.switchTab({url: '/pages/home/index'});
        return;
      }
      // 用户不登录直接返回时，直接跳转到首页
      uni.switchTab({url: '/pages/home/index'});
    },
    toAgree() {
      this.agree = !this.agree;
    },
    onWeChatLogin() {
      if (!this.agree) {
        uni.showToast({
          title: '请先同意协议',
          icon: 'none'
        });
        return false;
      }
      uni.showLoading({
        title: '登录中...'
      });
      return true;
    },
    async onGetPhone(e) {
      if (!this.agree) {
        uni.showToast({
          title: '请先同意协议',
          icon: 'none'
        });
        return false;
      }
      try {
        const loginWithWeChat = () => {
          return new Promise((resolve, reject) => {
            uni.login({
              provider: 'weixin',
              success: (res) => {
                if (res.code) {
                  resolve(res);
                } else {
                  reject(new Error('登录失败，没有获取到 code'));
                }
              },
              fail: (err) => {
                reject(err);
              }
            });
          });
        };
        const userInfoWithWeChat = () => {
          return new Promise((resolve, reject) => {
            uni.getUserInfo({
              provider: 'weixin',
              success: (res) => {
                resolve(res);
              },
              fail: (err) => {
                reject(new Error('登录失败，没有获取到用户信息'));
              }
            });
          });
        };
        const loginRes = await loginWithWeChat();
        const infoRes = await userInfoWithWeChat();
        const phoneEncryptedData = e.detail.encryptedData;
        const phoneIv = e.detail.iv;
        
        // 获取重定向信息中的注册渠道和酒店ID
        const redirectInfo = getRedirectInfo();
        const registerChannel = redirectInfo?.registerChannel || null;
        const hotelId = redirectInfo?.hotelId || null;
        
        const res = await uni.$u.http.post('/hotel-auth/wx/login', {
          code: loginRes.code,
          encryptedData: infoRes.encryptedData, // 用户信息
          iv: infoRes.iv,
          encryptedPhone: phoneEncryptedData, // 手机号
          phoneIv: phoneIv,
          registerChannel: registerChannel, // 注册渠道
          hotelId: hotelId // 酒店ID
        });
        setToken(res.access_token);
        const userInfo = await uni.$u.http.get('/hotel-member/member/getInfo');
        setUserInfo(userInfo);
        uni.hideLoading();
        // 登录时删除标识，以便再次显示弹窗广告
        uni.removeStorageSync('popupAdLastShown');
        // 处理重定向
        handleRedirect()
      } catch (err) {
        uni.showToast({
          title: '登录失败',
          icon: 'none'
        });
      } finally {
        uni.hideLoading();
      }
    },
    openAgreement() {
      uni.navigateTo({
        url: '/pages/subPackages/agreement/userAgreement'
      });
    },
    openPrivacy() {
      uni.navigateTo({
        url: '/pages/subPackages/agreement/privacyPolicy'
      });
    },
    goPhoneLogin() {
      uni.navigateTo({
        url: '/pages/subPackages/user/phone-login'
      });
    }
  }
}
</script>

<style lang="scss" scoped>
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

.content {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f5f6fa;
}

.login-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #fff;
  border-top: 1rpx solid #f0f0f0;
  height: auto;
  box-sizing: border-box;
  position: relative;
}

.logo {
  width: 328rpx;
  height: 100rpx;
  position: absolute;
  top: 142rpx;
  left: 212rpx;
}

.title {
  width: auto;
  height: 34rpx;
  font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;
  font-weight: 400;
  font-size: 24rpx;
  color: #19191A;
  line-height: 34rpx;
  letter-spacing: 3px;
  text-align: left;
  font-style: normal;
  position: absolute;
  top: 272rpx;
  left: 212rpx;
}

.wx-login-btn {
  width: 670rpx;
  height: 92rpx;
  line-height: 92rpx;
  background: #1AAD19;
  border-radius: 50rpx;
  position: absolute;
  top: 426rpx;
  left: 40rpx;
  border: none;
}

.weixin-icon {
  position: absolute;
  left: 202rpx;
  height: 92rpx;
  line-height: 92rpx;
}

.btn-text {
  width: auto;
  height: 32rpx;
  font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;
  font-weight: 400;
  font-size: 32rpx;
  color: #FFFFFF;
  line-height: 32rpx;
  text-align: center;
  font-style: normal;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.agreement {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  top: 564rpx;
  white-space: nowrap;
  font-size: 0;
}

.agreement-checkbox {
  transform: scale(0.7);
  margin-right: 4rpx;
}

.agreement-text,
.link {
  font-size: 24rpx;
  line-height: 24rpx;
  white-space: nowrap;
  display: inline;
  position: static;
  color: #969799;
}

.link {
  color: #EE781F;
  margin: 0 2rpx;
}

.phone-login {
  width: 192rpx;
  height: 24rpx;
  font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;
  font-weight: 400;
  font-size: 24rpx;
  color: #6D7278;
  line-height: 24rpx;
  text-align: center;
  font-style: normal;
  position: absolute;
  bottom: calc(60rpx + env(safe-area-inset-bottom));
  left: 50%;
  transform: translateX(-50%);
  z-index: 2;
}

.mask-layer {
  position: absolute;
  bottom: calc(env(safe-area-inset-bottom));
  left: 0;
  width: 100%;
  height: 200rpx;
  background: rgba(255, 255, 255, 0.8);
  z-index: 1;
}

.custom-radio {
  width: 24rpx;
  height: 24rpx;
  margin-right: 12rpx;
  vertical-align: middle;
}

/* 其他样式保持不变 */
</style>