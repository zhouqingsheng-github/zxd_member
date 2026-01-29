<template>
  <view class="member-right-page">
    <!-- 顶部导航栏 -->
    <uni-nav-bar
        backgroundColor="#FF8047"
        color="#fff"
        :fixed="false"
        :shadow="false"
        :border="false"
        status-bar
        left-icon="left"
        @clickLeft="back"
    >
      <template #default>
        <text class="nav-title">会员权益</text>
      </template>
      <template #right>
      </template>
    </uni-nav-bar>
    <!-- 会员卡片 -->
    <view class="member-card">
      <image class="member-card-bj" src="https://zxd-hotel.xin/zxdhotel/2025/06/03/member_bj_20250603230246A008.png"
             mode="widthFix"/>
      <view class="vip-card">
        <image class="vip-card-bg" src="@/static/my/vipcard.png" mode="widthFix"></image>
        <view class="vip-card-content">
          <view class="vip-card-left">
            <view class="vip-card-title">住小叮年度会员</view>
            <view class="validityPeriod" v-if="userInfo.vip===1">{{ mobilePhoneNumberEncryption(userInfo.phoneNumber) }}
              | {{
                formatDate(userInfo.validityPeriod)
              }}
            </view>
            <view class="validityPeriod" v-else>尊享会员特权，品质入住体验</view>
            <view class="vip-card-score-label">会员积分</view>
            <view class="vip-card-score">{{ userInfo.points || 0 }}</view>
          </view>
        </view>
      </view>
    </view>

    <!-- 年度会员权益 -->
    <view class="rights-title">
      <image class="member-card-bj" src="/static/base/equityTitle@2x.png" mode="widthFix"/>
    </view>

    <scroll-view class="rights-list-wrapper" scroll-y>
      <view class="rights-list">
        <view class="right-item" v-for="(item, index) in rightsList" :key="index">
          <image class="right-icon" :src="item.icon" mode="aspectFit"/>
          <view class="title-content">
            <view class="title">{{ item.title }}</view>
            <view class="description">{{ item.description }}</view>
          </view>
        </view>
        <view class="right-item right-item-1">
        </view>
      </view>
    </scroll-view>

    <!-- 底部说明和续费按钮 -->
    <view class="bottom-info">
      <view class="rights-tip">
        <text>购买前请仔细阅读
          <text class="agreement-link" @click="goAgreement">《会员服务协议》</text>
        </text>
        <br/>
        <text>本公司保留对会员权益的最终解释权</text>
      </view>
      <view class="renew-box">
        <view class="price">{{ memberPriceConfig.price }}
          <text class="unit">元/年</text>
          <text class="origin">￥{{ memberPriceConfig.originalPrice }}</text>
        </view>
        <view class="renew-btn" v-if="userInfo.vip===1" @click="renew">
          <text style="margin-left:25rpx">立即续费</text>
        </view>
        <view class="renew-btn" v-else @click="renew">
          <text style="margin-left:25rpx">开通会员</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import {
  getUserInfo
} from "@/store";
import {rightsList, getMemberPriceConfig} from "@/common/api";
import {pageBack} from "../../../common/redirect";

export default {
  data() {
    return {
      userInfo: {
        vip: 0
      },
      rightsList: [], // 会员权益列表
      defaultRightsList: [
        {
          icon: '/static/member/price.png',
          title: '会员专享价',
          description: '不定期会员专属折扣，享受优先抢购权利'
        },
        {
          icon: '/static/member/late.png',
          title: '延迟退房',
          description: '可免费延迟退房至14:00（视酒店房态情况而定）'
        },
        {
          icon: '/static/member/gift.png',
          title: '开卡礼包',
          description: '新会员立刻获赠两张50元无门槛优惠券红包'
        },
        {
          icon: '/static/member/birthday.png',
          title: '生日特权',
          description: '生日当月获赠一次免费房型升级'
        }
      ],
      memberPriceConfig: {
        price: 99,
        originalPrice: 199
      },
      hotelId: null
    }
  },
  onLoad(options) {
    if (options.scene) {
      this.hotelId = options.scene;
    } else {
      this.hotelId = null;
    }
    this.initUserInfo();
    this.getRightsList();
    this.getMemberPriceConfig();
  },
  methods: {
    initUserInfo() {
      const userInfo = getUserInfo();
      if (userInfo) {
        this.userInfo = {
          ...this.userInfo,
          avatar: userInfo.avatarUrl || this.userInfo.avatar,
          nickname: userInfo.nickname || this.userInfo.nickname,
          phone: userInfo.phoneNumber || this.userInfo.phoneNumber,
          vip: userInfo.vip || this.userInfo.vip,
          validityPeriod: userInfo.validityPeriod || this.userInfo.validityPeriod,
          phoneNumber: userInfo.phoneNumber || this.userInfo.phoneNumber
        };
      }
    },
    mobilePhoneNumberEncryption(phone) {
      if (!/^1\d{10}$/.test(phone)) return phone; // 非手机号格式则返回原值
      return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
    },
    formatDate(dateStr) {
      if (!dateStr) return '';
      const date = new Date(dateStr);
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      const year = date.getFullYear().toString();
      return `${year}.${month}.${day}到期`;
    },
    back() {
      pageBack()
    },
    renew() {
      // 跳转到会员续费页面
      uni.navigateTo({
        url: '/pages/subPackages/user/member-activate?hotelId=' + (this.hotelId || '')
      });
    },
    goAgreement() {
      uni.navigateTo({url: '/pages/subPackages/agreement/memberAgreement'});
    },
    async getRightsList() {
      try {
        const res = await rightsList();
        this.rightsList = res;
      } catch (error) {
        console.error('获取会员权益列表失败:', error);
        this.rightsList = this.defaultRightsList;
        uni.showToast({
          title: '获取会员权益失败',
          icon: 'none'
        });
      }
    },
    async getMemberPriceConfig() {
      try {
        const res = await getMemberPriceConfig();
        const data = res?.arg || res?.data || res || {};
        this.memberPriceConfig = {
          price: data.price || 99,
          originalPrice: data.originalPrice || 199
        };
      } catch (error) {
        console.error('获取会员价格配置失败:', error);
      }
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
  color: #FFFFFF;
  text-align: center;
  font-style: normal;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 88rpx;
}


.member-right-page {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: white;
  position: relative;
}

.custom-nav-bar {
  background: #FF8C4B !important;
}

.member-card {
  width: 100%;
  height: 518rpx;
  position: relative;
  overflow: hidden;
  flex-shrink: 0;

  .member-card-bj {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
    pointer-events: none;
    display: block;
  }
}

.card-content {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.card-left {
  display: flex;
  flex-direction: column;
}

.card-title {
  font-size: 36rpx;
  font-weight: bold;
  color: #8B5A2B;
  margin-bottom: 16rpx;
}

.card-phone {
  font-size: 24rpx;
  color: #8B5A2B;
  margin-bottom: 32rpx;
}

.points-label {
  font-size: 24rpx;
  color: #8B5A2B;
  margin-bottom: 8rpx;
}

.points-value {
  font-size: 48rpx;
  font-weight: bold;
  color: #8B5A2B;
}

.vip-icon {
  width: 120rpx;
  height: 120rpx;
}

.rights-title {
  margin: 48rpx 210rpx 30rpx 210rpx;
  flex-shrink: 0;

  image {
    width: 100%;
    height: 100%;
  }
}

.rights-list-wrapper {
  flex: 1;
  overflow: hidden;
}

.title-content {
  margin-left: 130rpx;
  margin-right: 38rpx;
  position: absolute;
  top: 26rpx;
}

.title-content .title {
  width: auto;
  height: 28rpx;
  font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;
  font-weight: 500;
  font-size: 28rpx;
  color: #19191A;
  line-height: 28rpx;
  text-align: left;
  font-style: normal;
}

.title-content .description {
  width: 472rpx;
  height: 64rpx;
  font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;
  font-weight: 400;
  font-size: 24rpx;
  color: #6D7278;
  line-height: 32rpx;
  text-align: left;
  font-style: normal;
  margin-top: 16rpx;
}

.rights-list {

  .right-item {
    height: 160rpx;
    background: #F6F6F6;
    border-radius: 28rpx;
    margin: 0 56rpx 20rpx 56rpx;
    position: relative;
  }

  .right-icon {
    width: 56rpx;
    height: 56rpx;
    margin-top: 52rpx;
    margin-left: 40rpx;
  }

  .right-item-1 {
    background: transparent !important;
    height: 80rpx;
  }

  .right-info {
    flex: 1;
  }

  .right-title {
    height: 28rpx;
    font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;
    font-weight: 500;
    color: #19191A;
    line-height: 28rpx;
    text-align: left;
    font-style: normal;
  }

  .right-desc {
    font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;
    font-weight: 400;
    font-size: 24rpx;
    color: #6D7278;
    line-height: 30rpx;
    text-align: left;
    font-style: normal;
    margin-top: 12rpx;
    white-space: normal;
    word-break: break-word;
  }
}


.bottom-info {
  flex-shrink: 0;
  background: white;
  padding: 20rpx 0 66rpx;
  text-align: center;
  z-index: 99;

  .rights-tip {
    font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;
    font-weight: 400;
    font-size: 24rpx;
    color: #6D7278;
    line-height: 34rpx;
    text-align: center;
    font-style: normal;
    margin-bottom: 20rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .agreement-link {
    color: #FF8047;
    cursor: pointer;
  }

  .renew-box {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 92rpx;
    border-radius: 50rpx;
    margin: 0 58rpx;
    background: linear-gradient(270deg, #596287 0%, #2E314C 100%);
    padding: 0 0 0 40rpx;
  }

  .price {
    flex: 1;
    height: 92rpx;
    font-family: Roboto, Roboto, serif;
    font-weight: 500;
    font-size: 52rpx;
    color: #FFE9C5;
    line-height: 92rpx;
    text-align: center;
    font-style: normal;
  }

  .unit {
    height: 28rpx;
    font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;
    font-weight: 500;
    font-size: 28rpx;
    color: #FFE9C5;
    line-height: 28rpx;
    text-align: left;
    font-style: normal;
    margin-left: 2rpx;
  }

  .origin {
    height: 28rpx;
    font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;
    font-weight: 400;
    font-size: 28rpx;
    color: #FFFFFF;
    line-height: 28rpx;
    text-align: left;
    font-style: normal;
    text-decoration-line: line-through;
    margin-left: 10rpx;
  }

  .renew-btn {
    width: 278rpx;
    height: 92rpx;
    line-height: 92rpx;
    background-image: url("/static/base/renewal.png");
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    text{
      color: #fff;
      font-size: 32rpx;
      font-weight: 500;
      text-align: center;
      border: none;
      flex-shrink: 0;
    }
  }

}


.vip-card {
  background: transparent;
  width: 721.15rpx;
  height: 365.27rpx;
  position: relative;
  left: 28rpx;
  top: 40rpx;
  border-radius: 28rpx;
  overflow: hidden;
  box-shadow: 0 8rpx 24rpx rgba(255, 186, 120, 0.15);
  z-index: 9;
}

.vip-card-bg {
  position: absolute;
  left: 0;
  width: 694rpx;
  height: 100%;
  z-index: 1;
}

.vip-card-content {
  position: relative;
  z-index: 2;
  display: flex;
  height: 100%;
  align-items: center;
  justify-content: space-between;
  padding: 0 40rpx;
}

.vip-card-left {
  width: 342rpx;
  height: 100%;
  position: absolute;
  top: 46rpx;
  left: 40rpx;
}

.vip-card-title {
  width: auto;
  height: 40rpx;
  font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;
  font-weight: 600;
  font-size: 40rpx;
  color: #9B421E;
  line-height: 40rpx;
  text-align: left;
  font-style: normal;
  position: absolute;
  top: 40rpx;
}

.validityPeriod {
  width: auto;
  height: 24rpx;
  font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;
  font-weight: 400;
  font-size: 24rpx;
  color: #9B421E;
  line-height: 24rpx;
  text-align: left;
  font-style: normal;
  position: absolute;
  top: 100rpx;
}

.vip-card-score-label {
  width: 96rpx;
  height: 24rpx;
  font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;
  font-weight: 400;
  font-size: 24rpx;
  color: #9B421E;
  line-height: 24rpx;
  text-align: left;
  font-style: normal;
  position: absolute;
  top: 178rpx;
}

.vip-card-score {
  height: 52rpx;
  font-family: Roboto, Roboto;
  font-weight: 500;
  font-size: 52rpx;
  color: #9B421E;
  line-height: 52rpx;
  text-align: left;
  font-style: normal;
  position: absolute;
  top: 214rpx;
  left: 2rpx
}

.vip-card-right {
  width: 160rpx;
  height: 72rpx;
  background: #FFEAB9;
  border-radius: 36rpx;
  position: absolute;
  bottom: 34rpx;
  right: 68rpx;
  font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;
  font-weight: 500;
  font-size: 28rpx;
  color: #9B421E;
  line-height: 72rpx;
  text-align: center;
  font-style: normal;
}

</style>