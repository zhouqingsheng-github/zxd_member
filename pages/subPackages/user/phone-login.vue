<template>
  <view class="phone-login-content">
    <uni-nav-bar :fixed="true" :shadow="false" color="#19191A" :border="false" status-bar
                 left-icon="left" left-text=" " title="登录" @clickLeft="back"/>
    <view class="login-body">
      <text class="login-title">登录</text>
      <text class="login-desc">极简超经济酒店会员系统</text>
      <view class="input-wrapper">
        <input
            class="custom-input"
            type="number"
            maxlength="11"
            v-model="phone"
            placeholder="请输入手机号"
        />
        <view class="input-underline"></view>
      </view>
      <view class="input-wrapper code-input-wrapper" style="margin-top:0;">
        <input
            class="custom-input"
            type="number"
            maxlength="6"
            v-model="code"
            placeholder="请输入验证码"
        />
        <view class="code-btn" :disabled="countdown > 0 || gettingCode" @click="getCode">
          <text v-if="countdown === 0">获取验证码</text>
          <text v-else>{{ countdown }}s后重新获取</text>
        </view>
        <view class="input-underline"></view>
      </view>
      <button class="login-btn" :class="{active: phone && code}" @click="login">登 录</button>
    </view>
  </view>
</template>

<script>
import {
  setToken,
  setUserInfo,
  clearUserInfo
} from '@/store/index.js'
import {handleRedirect, getRedirectInfo} from '@/common/redirect.js'
import {pageBack} from "../../../common/redirect";

export default {
  name: "phoneLogin",
  data() {
    return {
      phone: '',
      code: '',
      countdown: 0,
      timer: null,
      gettingCode: false
    }
  },
  methods: {
    back() {
      pageBack()
    },
    getCode() {
      if (this.gettingCode || this.countdown > 0) return;
      if (!/^1\d{10}$/.test(this.phone)) {
        uni.showToast({title: '请输入正确的手机号', icon: 'none'});
        return;
      }
      this.gettingCode = true;
      uni.$u.http.post('/hotel-auth/phone/sendCode', {phoneNumber: this.phone})
          .then(() => {
            uni.showToast({title: '验证码已发送', icon: 'none'});
            const endTime = Date.now() + 60 * 1000;
            uni.setStorageSync('smsCountdownEnd', endTime);
            this.startCountdown();
          })
          .catch(() => {
            // 错误处理
          })
          .then(() => {
            this.gettingCode = false;
          });
    },
    startCountdown() {
      const endTime = uni.getStorageSync('smsCountdownEnd') || 0;
      let remain = Math.floor((endTime - Date.now()) / 1000);
      if (remain < 0) remain = 0;
      this.countdown = remain;
      if (this.timer) clearInterval(this.timer);
      if (this.countdown > 0) {
        this.timer = setInterval(() => {
          this.countdown--;
          if (this.countdown <= 0) {
            clearInterval(this.timer);
            this.timer = null;
            uni.removeStorageSync('smsCountdownEnd');
          }
        }, 1000);
      }
    },
    async login() {
      if (!(this.phone && this.code)) {
        return;
      }
      if (!/^1\d{10}$/.test(this.phone)) {
        uni.showToast({title: '请输入正确的手机号', icon: 'none'});
        return;
      }
      if (!this.code) {
        uni.showToast({title: '请输入验证码', icon: 'none'});
        return;
      }
      uni.showLoading({title: '登录中...'});

      // 先获取微信code
      uni.login({
        provider: 'weixin',
        success: (loginRes) => {
          const wxCode = loginRes.code;
          // 使用手机号和验证码登录
          this.handleLogin(wxCode);
        },
        fail: () => {
          uni.hideLoading();
          uni.showToast({title: '获取微信授权失败', icon: 'none'});
        }
      });
    },
    async handleLogin(wxCode) {
      try {
        // 获取重定向信息中的注册渠道和酒店ID
        const redirectInfo = getRedirectInfo();
        const registerChannel = redirectInfo?.registerChannel || null;
        const hotelId = redirectInfo?.hotelId || null;
        
        const res = await uni.$u.http.post('/hotel-auth/phone/login', {
          phoneNumber: this.phone,
          code: this.code,
          wxCode: wxCode,
          registerChannel: registerChannel, // 注册渠道
          hotelId: hotelId // 酒店ID
        })
        setToken(res.access_token);
        const userInfo = await uni.$u.http.get('/hotel-member/member/getInfo');
        setUserInfo(userInfo);
        uni.hideLoading();
        // 登录时删除标识，以便再次显示弹窗广告
        uni.removeStorageSync('popupAdLastShown');
        // 处理重定向
        handleRedirect()
      } catch (err) {
        uni.showToast({title: err.error || err.msg, icon: 'none'});
      } finally {
        uni.hideLoading();
      }
    }
  },
  onShow() {
  },
  mounted() {
    this.startCountdown();
    const lastPhone = uni.getStorageSync('lastPhone');
    if (lastPhone) {
      this.phone = lastPhone;
    }
    // 检查是否有重定向信息（getRedirectInfo会自动检查过期）
    const redirectInfo = getRedirectInfo();
    if (redirectInfo) {
      this.shouldTriggerPhoneLogin = true;
    }
  },
  watch: {
    phone(newVal) {
      uni.setStorageSync('lastPhone', newVal);
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
  beforeDestroy() {
    if (this.timer) clearInterval(this.timer);
  }
}
</script>

<style lang="scss" scoped>
.phone-login-content {
  min-height: 100vh;
  background: #fff;
}

.login-body {
  background: #fff;
  border-top: 1rpx solid #f0f0f0;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 80rpx 0 0 0;
}

.login-title {
  height: 56rpx;
  font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;
  font-weight: 500;
  font-size: 40rpx;
  color: #19191A;
  line-height: 56rpx;
  text-align: left;
  font-style: normal;
  align-self: flex-start;
  margin-left: 86rpx;
  margin-top: 80rpx;
}

.login-desc {
  height: 34rpx;
  font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;
  font-weight: 400;
  font-size: 24rpx;
  color: #19191A;
  line-height: 34rpx;
  text-align: left;
  font-style: normal;
  align-self: flex-start;
  margin-left: 86rpx;
  margin-top: 4rpx;
}

.input-wrapper {
  width: 580rpx;
  height: 80rpx;
  margin-top: 54rpx;
  position: relative;
}

.input-wrapper + .input-wrapper {
  margin-top: 0;
}

.custom-input {
  width: 100%;
  height: 40rpx;
  font-size: 28rpx;
  background: transparent;
  border: none;
  outline: none;
  box-sizing: border-box;
  font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;
  margin-top: 30rpx;
}

.custom-input::placeholder,
.custom-input::-webkit-input-placeholder,
.custom-input:-moz-placeholder,
.custom-input::-moz-placeholder,
.custom-input:-ms-input-placeholder {
  font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;
  font-weight: 400;
  font-size: 28rpx;
  color: #97989B;
  text-align: left;
  font-style: normal;
}

.input-underline {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 1rpx;
  background: #E8E9EB;
}

.code-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.code-input-wrapper .custom-input {
  flex: 1;
  padding-right: 200rpx;
}

.code-btn {
  position: absolute;
  right: 0;
  top: 30rpx;
  width: auto;
  height: 40rpx;
  font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;
  font-weight: 400;
  font-size: 28rpx;
  color: #97989B;
  line-height: 40rpx;
  text-align: right;
  font-style: normal;
  min-width: 180rpx;
  z-index: 10;
  padding: 0 10rpx;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.login-btn {
  width: 640rpx;
  height: 92rpx;
  background: #EE781F;
  border-radius: 46rpx;
  opacity: 0.3;
  margin-top: 80rpx;
  font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;
  font-weight: 500;
  font-size: 32rpx;
  color: #FFFFFF;
  text-align: center;
  line-height: 92rpx;
  font-style: normal;
  transition: opacity 0.2s;
}

.login-btn.active {
  opacity: 1;
}
</style>
