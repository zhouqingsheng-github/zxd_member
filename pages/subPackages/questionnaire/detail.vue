<template>
  <view class="questionnaire-container">
    <uni-nav-bar
        :shadow="false"
        :border="false"
        :fixed="true"
        left-icon="left"
        status-bar
        @clickLeft="goBack">
      <template #default>
        <text class="nav-title">试睡官报名</text>
      </template>
    </uni-nav-bar>

    <scroll-view class="scroll-container" scroll-y>
      <view class="form-wrapper">
        <!-- 姓名 -->
        <view class="form-item">
          <text class="form-label">姓名
            <text class="required">*</text>
          </text>
          <input
              class="form-input"
              v-model="formData.name"
              placeholder="请输入您的姓名"
              @blur="saveFormData"
          />
        </view>
        <view class="form-line"></view>

        <!-- 联系方式提示 -->
        <view class="form-item-vertical">
          <text class="form-label">联系方式
            <text class="required">*</text>
          </text>
        </view>
        <view class="form-line"></view>


        <!-- 联系电话 -->
        <view class="form-item">
          <text class="form-label">联系电话</text>
          <input
              class="form-input"
              v-model="formData.phone"
              type="number"
              maxlength="11"
              placeholder="请输入您的联系电话"
              @blur="saveFormData"
          />
          <button
              class="get-phone-btn"
              open-type="getPhoneNumber"
              @getphonenumber="getPhoneNumber"
          >
            获取
          </button>
        </view>
        <view class="form-line"></view>

        <!-- 微信号 -->
        <view class="form-item">
          <text class="form-label">微信号</text>
          <input
              class="form-input"
              v-model="formData.wechatId"
              placeholder="请输入您的微信号"
              @blur="saveFormData"
          />
        </view>
        <view class="form-line"></view>

        <!-- 创作平台 -->
        <view class="form-item-vertical">
          <text class="form-label">创作平台
            <text class="required">*</text>
          </text>
          <checkbox-group @change="handlePlatformChange" class="checkbox-group">
            <label class="checkbox-item" v-for="item in platformOptions" :key="item.value">
              <checkbox
                  :value="item.value"
                  :checked="formData.platforms.includes(item.value)"
                  color="#EE781F"
              />
              <text class="checkbox-text">{{ item.text }}</text>
            </label>
          </checkbox-group>
        </view>
        <view class="form-line"></view>

        <!-- 账号ID -->
        <view class="form-item-vertical">
          <text class="form-label">账号ID
            <text class="required">*</text>
          </text>
          <textarea
              class="form-textarea"
              v-model="formData.accountId"
              placeholder="请注明平台，如：小红书12345678"
              maxlength="500"
              @blur="saveFormData"
          />
        </view>
        <view class="form-line"></view>

        <!-- 主页截图 -->
        <view class="form-item-vertical">
          <text class="form-label">主页截图
            <text class="required">*</text>
          </text>
          <view class="upload-tip">需能清晰可见粉丝量与总获赞</view>
          <view class="image-list">
            <view class="image-item" v-for="(img, index) in imageList" :key="index">
              <image :src="img" mode="aspectFill" class="preview-image" @click="previewImage(index)"/>
              <view class="delete-btn" @click="deleteImage(index)">×</view>
            </view>
            <view class="upload-btn" @click="chooseImage" v-if="imageList.length < 3">
              <text class="upload-icon">+</text>
              <text class="upload-text">上传图片</text>
            </view>
          </view>
        </view>
        <view class="form-line"></view>

        <!-- 关联订单号 -->
        <view class="form-item">
          <text class="form-label">关联订单号</text>
          <input
              class="form-input"
              v-model="formData.orderNo"
              placeholder="选填，如有订单可填写"
              @blur="validateOrderNo"
          />
        </view>
        <view class="form-line"></view>

        <!-- 活动来源 -->
        <view class="form-item-vertical">
          <text class="form-label">您是如何得知本次活动的
            <text class="required">*</text>
          </text>
          <radio-group @change="handleActivitySourceChange" class="radio-group-two-columns">
            <label class="radio-item-column" v-for="item in activitySourceOptions" :key="item.value">
              <radio
                  :value="item.value"
                  :checked="formData.activitySource === item.value"
                  color="#EE781F"
              />
              <text class="radio-text">{{ item.text }}</text>
            </label>
          </radio-group>
        </view>
        <view class="form-line"></view>

        <!-- 活动规则确认 -->
        <view class="form-item-vertical">
          <text class="form-label">活动细则
            <text class="required">*</text>
          </text>
          <view class="rules-wrapper">
            <view class="rules-label-custom" @click="handleRulesClick">
              <image
                  :src="formData.rulesConfirmed === 1 ? '/static/base/radio_checked_da.png' : '/static/base/radio_unchecked_da.png'"
                  class="custom-checkbox"
                  mode="aspectFit"
              />
              <view class="rules-text">
                <text>我已充分了解活动规则与奖励</text>
                <text class="rules-link" @click.stop="viewAgreement">《住小叮试睡官指南》</text>
              </view>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>

    <!-- 底部提交按钮 -->
    <view class="submit-bottom-fixed">
      <view
          class="submit-btn"
          :class="{ disabled: submitting }"
          @click="handleSubmit"
      >
        {{ submitting ? '提交中...' : '提交报名' }}
      </view>
    </view>

    <!-- 企业微信二维码弹窗 -->
    <view v-if="showQrcodeModal" class="qrcode-modal">
      <view class="qrcode-content" @click.stop>
        <view class="qrcode-header warning-header">
          <text class="qrcode-title">报名成功！</text>
          <text class="close-icon" @click="handleCloseAttempt">×</text>
        </view>
        <view class="qrcode-body">
          <image
              src="https://www.zxd-hotel.xin/zxdhotel/icon/qy33.jpg"
              class="qrcode-image pulse-animation"
              mode="aspectFit"
              show-menu-by-longpress
          />
          <view class="qrcode-hint">
            <text class="hint-text">👆 长按上方二维码识别入群</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import {submitQuestionnaire, uploadFiles} from '@/common/api';
import {pageBack} from '@/common/redirect';
import {handleLoginRequired} from '@/common/auth';

export default {
  data() {
    return {
      formData: {
        name: '',
        phone: '',
        wechatId: '',
        platforms: [],
        accountId: '',
        screenshotUrl: '',
        activitySource: '',
        rulesConfirmed: 0,
        orderNo: ''
      },
      imageList: [],
      platformOptions: [
        {value: 'douyin', text: '抖音'},
        {value: 'xiaohongshu', text: '小红书'}
      ],
      activitySourceOptions: [
        {value: '1', text: '微信朋友圈'},
        {value: '2', text: '微信公众号'},
        {value: '3', text: '他人推荐'},
        {value: '4', text: '社交媒体（小红书/抖音等）'},
        {value: '5', text: '线下门店（海报/前台推荐）'}
      ],
      submitting: false,
      showQrcodeModal: false // 控制二维码弹窗显示
    };
  },

  onLoad(options) {
    // 设置状态栏为黑色
    uni.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#FFFFFF'
    });

    if (options.orderNo) {
      this.formData.orderNo = options.orderNo;
    }

    // 恢复之前保存的表单数据
    this.restoreFormData();
  },
  onShow() {
    // 页面显示时也尝试恢复数据（从登录页返回时）
    this.restoreFormData();
    // 检查是否已确认阅读协议，如果已确认则自动勾选
    const hasConfirmed = uni.getStorageSync('sleep_tester_agreement_confirmed');
    this.formData.rulesConfirmed = hasConfirmed ? 1 : 0;
  },
  onUnload() {
    // 页面卸载时清除缓存的表单数据
    this.clearFormCache();
  },
  methods: {
    goBack() {
      pageBack();
    },

    // 选择平台
    handlePlatformChange(e) {
      this.formData.platforms = e.detail.value;
      // 选择平台后立即保存表单数据
      this.saveFormData();
    },

    // 选择活动来源
    handleActivitySourceChange(e) {
      this.formData.activitySource = e.detail.value;
      // 选择活动来源后立即保存表单数据
      this.saveFormData();
    },

    // 规则确认
    // 尝试关闭二维码弹窗（添加二次确认）
    handleCloseAttempt() {
      uni.showModal({
        title: '⚠️ 重要提醒',
        content: '确定已扫码入群了吗？\n未入群将无法接收退款通知！',
        confirmText: '已入群',
        cancelText: '再看看',
        confirmColor: '#EE781F',
        success: (res) => {
          if (res.confirm) {
            this.closeQrcodeModal();
          }
        }
      });
    },

    // 关闭二维码弹窗
    closeQrcodeModal() {
      this.showQrcodeModal = false;
      // 关闭弹窗后跳转到首页
      setTimeout(() => {
        uni.reLaunch({
          url: '/pages/home/index'
        });
      }, 300);
    },


    // 处理自定义复选框点击
    handleRulesClick() {
      // 如果当前是未勾选状态，用户想要勾选
      if (this.formData.rulesConfirmed === 0) {
        // 检查是否已阅读协议
        const hasConfirmed = uni.getStorageSync('sleep_tester_agreement_confirmed');
        if (!hasConfirmed) {
          // 未阅读，直接跳转到协议页面，不改变状态
          this.viewAgreement();
          return;
        }
        // 已阅读，允许勾选
        this.formData.rulesConfirmed = 1;
      } else {
        // 如果当前是勾选状态，允许取消勾选
        this.formData.rulesConfirmed = 0;
      }
      // 状态改变后立即保存表单数据
      this.saveFormData();
    },

    // 查看协议
    viewAgreement() {
      uni.navigateTo({
        url: '/pages/subPackages/agreement/sleepTesterGuide?from=questionnaire',
      });
    },

    // 获取手机号
    async getPhoneNumber(e) {
      if (e.detail.errMsg === 'getPhoneNumber:ok') {
        try {
          // 先通过uni.login获取code
          const loginRes = await uni.login();
          // 调用后端解密接口
          const params = {
            code: loginRes[1].code,
            encryptedPhone: e.detail.encryptedData,
            phoneIv: e.detail.iv
          };
          const res = await uni.$u.http.post('/hotel-auth/decryptPhone', params);
          this.formData.phone = res;
          // 获取手机号后立即保存表单数据
          this.saveFormData();
        } catch (error) {
          console.error('解密手机号失败', error);
          uni.showToast({
            title: '获取失败，请手动输入',
            icon: 'none'
          });
        }
      } else {
        uni.showToast({
          title: '您取消了授权',
          icon: 'none'
        });
      }
    },

    // 选择图片
    chooseImage() {
      uni.chooseImage({
        count: 3 - this.imageList.length,
        sizeType: ['compressed'], // 压缩图片
        sourceType: ['album', 'camera'],
        success: (res) => {
          console.log('选择图片成功:', res.tempFilePaths);
          this.imageList = this.imageList.concat(res.tempFilePaths);
          // 选择图片后立即保存表单数据
          this.saveFormData();
        },
        fail: (err) => {
          console.error('选择图片失败:', err);
          uni.showToast({
            title: '选择图片失败',
            icon: 'none'
          });
        }
      });
    },

    // 预览图片
    previewImage(index) {
      uni.previewImage({
        urls: this.imageList,
        current: index
      });
    },

    // 删除图片
    deleteImage(index) {
      this.imageList.splice(index, 1);
      // 删除图片后立即保存表单数据
      this.saveFormData();
    },

    // 验证订单号
    validateOrderNo() {
      // 如果订单号为空，不进行校验（因为是选填）
      if (!this.formData.orderNo || this.formData.orderNo.trim() === '') {
        this.saveFormData();
        return;
      }

      // 去除首尾空格
      this.formData.orderNo = this.formData.orderNo.trim();

      // 校验订单号必须以 ZXD 开头
      if (!this.formData.orderNo.startsWith('ZXD')) {
        uni.showToast({
          title: '订单号必须以ZXD开头，请在官方小程序下单',
          icon: 'none',
          duration: 2500
        });
        // 清空不符合规则的订单号
        this.formData.orderNo = '';
        return;
      }

      // 校验通过，保存表单数据
      this.saveFormData();
    },

    // 验证表单
    validateForm() {
      if (!this.formData.name) {
        uni.showToast({title: '请输入姓名', icon: 'none'});
        return false;
      }
      // 联系电话和微信号至少填一个
      if (!this.formData.phone && !this.formData.wechatId) {
        uni.showToast({title: '请至少填写联系电话或微信号其中一项', icon: 'none'});
        return false;
      }
      // 如果填写了手机号，验证格式
      if (this.formData.phone && !/^1[3-9]\d{9}$/.test(this.formData.phone)) {
        uni.showToast({title: '请输入正确的手机号', icon: 'none'});
        return false;
      }
      if (this.formData.platforms.length === 0) {
        uni.showToast({title: '请选择创作平台', icon: 'none'});
        return false;
      }
      if (!this.formData.accountId) {
        uni.showToast({title: '请输入账号ID', icon: 'none'});
        return false;
      }
      if (this.imageList.length === 0) {
        uni.showToast({title: '请上传主页截图', icon: 'none'});
        return false;
      }
      if (!this.formData.activitySource) {
        uni.showToast({title: '请选择您是如何得知本次活动的', icon: 'none'});
        return false;
      }
      if (this.formData.rulesConfirmed !== 1) {
        uni.showToast({title: '请阅读并同意《住小叮试睡官指南》', icon: 'none'});
        return false;
      }
      // 检查是否真的阅读过协议
      const hasRead = uni.getStorageSync('sleep_tester_agreement_confirmed');
      if (!hasRead) {
        uni.showToast({title: '请先完整阅读《住小叮试睡官指南》', icon: 'none'});
        setTimeout(() => {
          this.viewAgreement();
        }, 1500);
        return false;
      }
      // 如果填写了订单号，验证格式
      if (this.formData.orderNo && this.formData.orderNo.trim() !== '') {
        const orderNo = this.formData.orderNo.trim();
        if (!orderNo.startsWith('ZXD')) {
          uni.showToast({
            title: '订单号必须以ZXD开头，请在官方小程序下单',
            icon: 'none',
            duration: 2500
          });
          return false;
        }
        // 更新为去除空格后的订单号
        this.formData.orderNo = orderNo;
      }
      return true;
    },

    // 上传图片
    async uploadImages() {
      try {
        console.log('开始上传图片，共', this.imageList.length, '张');

        // uploadFiles 返回的是对象数组 [{name, url}, {name, url}, ...]
        const results = await uploadFiles(this.imageList);
        console.log('上传成功，结果:', results);

        // 提取 url 组成数组
        const urls = results.map(item => item.url);
        console.log('提取的 URLs:', urls);

        // JSON 字符串化存储
        return JSON.stringify(urls);
      } catch (error) {
        console.error('上传图片失败:', error);
        // 提供更详细的错误信息
        let errorMsg = '图片上传失败';
        if (error.message) {
          if (error.message.includes('状态码')) {
            errorMsg = '服务器响应异常，请稍后重试';
          } else if (error.message.includes('网络')) {
            errorMsg = '网络连接失败，请检查网络';
          } else {
            errorMsg = error.message;
          }
        }
        throw new Error(errorMsg);
      }
    },

    // 保存表单数据到缓存
    saveFormData() {
      const formCache = {
        formData: this.formData,
        imageList: this.imageList,
        timestamp: Date.now()
      };
      uni.setStorageSync('questionnaire_form_cache', formCache);
    },

    // 恢复表单数据
    restoreFormData() {
      try {
        const formCache = uni.getStorageSync('questionnaire_form_cache');
        if (formCache) {
          // 检查缓存是否过期（24小时）
          const isExpired = Date.now() - formCache.timestamp > 24 * 60 * 60 * 1000;
          if (!isExpired) {
            // 恢复表单数据
            this.formData = {...this.formData, ...formCache.formData};
            this.imageList = formCache.imageList || [];
          } else {
            // 缓存过期，清除
            this.clearFormCache();
          }
        }
      } catch (error) {
        console.error('恢复表单数据失败:', error);
      }
    },

    // 清除表单缓存
    clearFormCache() {
      uni.removeStorageSync('questionnaire_form_cache');
      uni.removeStorageSync('sleep_tester_agreement_confirmed');
    },

    // 提交表单
    async handleSubmit() {
      if (!this.validateForm()) {
        return;
      }

      // 保存当前表单数据
      this.saveFormData();

      // 使用统一的登录处理，传递注册渠道
      await handleLoginRequired({
        url: '/pages/subPackages/questionnaire/detail',
        params: {},
        registerChannel: '试睡官活动',
        hotelId: null,
        success: async () => {
          await this.doSubmit();
        }
      });
    },

    // 执行实际的提交操作
    async doSubmit() {
      if (this.submitting) {
        return;
      }

      this.submitting = true;

      try {
        // 显示加载提示
        uni.showLoading({
          title: '提交中...',
          mask: true
        });
        // 上传图片
        this.formData.screenshotUrl = await this.uploadImages();
        // 处理平台数据
        const submitData = {
          ...this.formData,
          platforms: this.formData.platforms.join(',')
        };
        // 提交表单
        const res = await submitQuestionnaire(submitData);
        uni.hideLoading();

        // 提交成功，清除缓存的表单数据和协议确认标记
        this.clearFormCache();
        uni.removeStorageSync('sleep_tester_agreement_confirmed');

        // 显示企业微信二维码弹窗
        this.showQrcodeModal = true;
      } catch (error) {
        uni.hideLoading();
        console.error('提交失败', error);
        uni.showToast({
          title: error.message || '提交失败，请重试',
          icon: 'none'
        });
      } finally {
        this.submitting = false;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.questionnaire-container {
  height: 100vh;
  background-color: #F3F4F6;
  position: relative;
}

.scroll-container {
  position: absolute;
  top: 160rpx;
  bottom: calc(148rpx + env(safe-area-inset-bottom));
  left: 0;
  right: 0;
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
}

.nav-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #000;
}

.form-wrapper {
  margin: 20rpx;
  background-color: #fff;
  border-radius: 16rpx;
  padding: 30rpx;
}

.form-title-main {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
  text-align: center;
  margin-bottom: 40rpx;
}

.form-item {
  display: flex;
  align-items: center;
  padding: 24rpx 0;

  .form-label {
    font-size: 28rpx;
    color: #333;
    font-weight: 500;
    min-width: 160rpx;

    .required {
      color: #ff4d4f;
      margin-left: 4rpx;
    }
  }

  .form-input {
    flex: 1;
    font-size: 28rpx;
    color: #333;
    text-align: right;
  }

  .get-phone-btn {
    font-size: 28rpx;
    color: #EE781F;
    margin-left: 20rpx;
    flex-shrink: 0;
    padding: 0;
    line-height: 1;
    background: none;
    border: none;

    &::after {
      border: none;
    }
  }
}

.form-item-vertical {
  padding: 24rpx 0;

  .form-label {
    font-size: 28rpx;
    color: #333;
    font-weight: 500;
    margin-bottom: 20rpx;
    display: block;

    .required {
      color: #ff4d4f;
      margin-left: 4rpx;
    }
  }

  .form-tip {
    font-size: 24rpx;
    color: #999;
    line-height: 1.5;
  }

  .form-textarea {
    width: 100%;
    min-height: 120rpx;
    padding: 16rpx;
    background-color: #F5F5F5;
    border-radius: 8rpx;
    font-size: 28rpx;
    color: #333;
    box-sizing: border-box;
  }
}

.form-line {
  height: 1rpx;
  background-color: #F0F0F0;
}

.checkbox-group {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.checkbox-item {
  display: flex;
  align-items: center;

  checkbox {
    margin-right: 12rpx;
    transform: scale(0.9);
  }

  .checkbox-text {
    font-size: 28rpx;
    color: #666;
  }
}

.radio-group {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.radio-item {
  display: flex;
  align-items: center;

  radio {
    margin-right: 12rpx;
    transform: scale(0.9);
  }

  .radio-text {
    font-size: 28rpx;
    color: #666;
  }
}

.radio-group-two-columns {
  display: flex;
  flex-wrap: wrap;
  gap: 24rpx 0;
}

.radio-item-column {
  display: flex;
  align-items: center;
  width: 50%;
  padding-right: 20rpx;
  box-sizing: border-box;

  radio {
    margin-right: 12rpx;
    transform: scale(0.9);
    flex-shrink: 0;
  }

  .radio-text {
    font-size: 28rpx;
    color: #666;
    line-height: 1.4;
    flex: 1;
  }
}

.upload-tip {
  font-size: 24rpx;
  color: #999;
  margin-bottom: 20rpx;
}

.image-list {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;

  .image-item {
    position: relative;
    width: 200rpx;
    height: 200rpx;

    .preview-image {
      width: 100%;
      height: 100%;
      border-radius: 8rpx;
    }

    .delete-btn {
      position: absolute;
      top: -10rpx;
      right: -10rpx;
      width: 40rpx;
      height: 40rpx;
      background-color: #ff4d4f;
      color: #fff;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 32rpx;
      line-height: 1;
    }
  }

  .upload-btn {
    width: 200rpx;
    height: 200rpx;
    background-color: #F5F5F5;
    border-radius: 8rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .upload-icon {
      font-size: 60rpx;
      color: #999;
      line-height: 1;
    }

    .upload-text {
      font-size: 24rpx;
      color: #999;
      margin-top: 8rpx;
    }
  }
}

.rules-wrapper {
  .rules-label {
    display: flex;
    align-items: center;

    checkbox {
      margin-right: 12rpx;
      transform: scale(0.9);
      flex-shrink: 0;
    }

    .rules-text {
      flex: 1;
      font-size: 26rpx;
      color: #666;
      line-height: 1.6;

      .rules-link {
        color: #EE781F;
      }
    }
  }

  .rules-label-custom {
    display: flex;
    align-items: center;

    .custom-checkbox {
      width: 32rpx;
      height: 32rpx;
      margin-right: 12rpx;
      flex-shrink: 0;
    }

    .rules-text {
      flex: 1;
      font-size: 26rpx;
      color: #666;
      line-height: 1.6;

      .rules-link {
        color: #EE781F;
      }
    }
  }
}

.submit-bottom-fixed {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20rpx;
  padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
  background-color: #fff;
  z-index: 100;
}

.submit-btn {
  width: 100%;
  height: 88rpx;
  background: #EE781F;
  border-radius: 50rpx;
  font-size: 32rpx;
  color: #FFFFFF;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;

  &.disabled {
    opacity: 0.3;
  }
}

// 企业微信二维码弹窗
.qrcode-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.75);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;

  .qrcode-content {
    width: 620rpx;
    background-color: #fff;
    border-radius: 24rpx;
    overflow: hidden;
    box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.3);
  }

  .qrcode-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 32rpx 32rpx 20rpx;
    border-bottom: 2rpx solid #ffe7ba;

    &.warning-header {
      background: linear-gradient(135deg, #fff7e6 0%, #ffe7ba 100%);
    }

    .qrcode-title {
      font-size: 36rpx;
      font-weight: bold;
      color: #EE781F;
    }

    .close-icon {
      font-size: 60rpx;
      color: #999;
      line-height: 1;
      padding: 0 10rpx;
    }
  }

  .qrcode-body {
    padding: 40rpx 32rpx;
    display: flex;
    flex-direction: column;
    align-items: center;

    .qrcode-tip {
      width: 100%;
      background: linear-gradient(135deg, #fff7e6 0%, #ffe7ba 100%);
      border: 2rpx solid #ffa940;
      border-radius: 12rpx;
      padding: 20rpx 24rpx;
      margin-bottom: 32rpx;
      text-align: center;

      .tip-text {
        font-size: 30rpx;
        font-weight: bold;
        color: #EE781F;
      }
    }

    .qrcode-image {
      width: 420rpx;
      height: 420rpx;
      border-radius: 16rpx;
      border: 3rpx solid #EE781F;
      margin-bottom: 24rpx;
      box-shadow: 0 4rpx 16rpx rgba(238, 120, 31, 0.3);
    }

    .pulse-animation {
      animation: pulse 2s infinite;
    }

    .qrcode-hint {
      width: 100%;
      text-align: center;
      padding: 16rpx 24rpx;
      background: #f5f5f5;
      border-radius: 8rpx;

      .hint-text {
        font-size: 26rpx;
        color: #666;
        font-weight: 500;
      }
    }
  }

}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.02);
  }
}
</style>
