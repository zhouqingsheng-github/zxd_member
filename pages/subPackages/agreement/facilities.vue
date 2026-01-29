<script>
import {pageBack} from "../../../common/redirect";
import UniNavBar from "../../../uni_modules/uni-nav-bar/components/uni-nav-bar/uni-nav-bar.vue";

export default {
  components: {UniNavBar},
  data() {
    return {
      currentTab: 'services',

      // 设施服务
      serviceItems: [],

      // 酒店政策
      hotelPolicies: [
        {
          title: '入离时间',
          child: [
            {
              title: '',
              desc: '入住时间：14:00后'
            },
            {
              title: '',
              desc: '退房时间：12:00前'
            }
          ]
        },
        {
          title: '接待提示',
          child: [
            {
              title: '年龄限制',
              desc: '入住办理人需年满18岁'
            },
            {
              title: '可接待人群',
              desc: '接待来自任何国家/地区的客人'
            }
          ]
        },
        {
          title: '入住提示',
          child: [
            {
              title: '入住方式',
              desc: '房东或员工会迎接住客以办理入住'
            },
            {
              title: '前台服务',
              desc: '前台营业时间:24小时营业'
            }
          ]
        },
        {
          title: '宠物',
          child: [
            {
              title: '',
              desc: '不可携带宠物'
            }
          ]
        }
      ]
    }
  },
  onLoad() {
    // 设置状态栏为黑色
    uni.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#FFFFFF'
    });
    
    // 从本地存储获取设施数据
    const facilities = uni.getStorageSync('hotelFacilities');
    if (facilities && facilities.length > 0) {
      this.serviceItems = facilities;
    } else {
      // 如果没有数据，使用默认数据
      this.serviceItems = [
        {
          icon: 'https://zxd-hotel.xin/zxdhotel/2025/07/08/wifi@2x_20250708112505A004.png',
          title: '上网服务',
          desc: '全部区域WIFI覆盖，免费提供'
        }
      ];
    }
  },
  methods: {
    goBack() {
      pageBack()
    },
    switchTab(tab) {
      this.currentTab = tab;
    }
  }
};
</script>

<template>
  <view class="facilities">

    <uni-nav-bar
        :shadow="false"
        :border="false"
        left-icon="left"
        status-bar
        fixed
        @clickLeft="goBack">
      <template #default>
        <text class="nav-title">政策设施</text>
      </template>
    </uni-nav-bar>

    <!-- 标签页 -->
    <view class="tabs">
      <view class="tab-item" :class="{ active:currentTab === 'services' }" @click="switchTab('services')">设施服务
      </view>
      <view class="tab-item" :class="{ active: currentTab=== 'policies' }" @click="switchTab('policies')">酒店政策
      </view>
    </view>
    <view class="content-line"></view>
    <!-- 设施服务 -->
    <view v-if="currentTab ==='services'" class="content">
      <!-- 服务项目 -->
      <view class="section">
        <text class="section-title">服务项目</text>
        <view class="service-item" v-for="(item, index) in serviceItems" :key="index">
          <image :src="item.icon" class="icon-wrapper"></image>
          <view>
            <view class="info">{{ item.title }}</view>
            <view class="desc">{{ item.desc }}</view>
          </view>
        </view>
      </view>
    </view>

    <!-- 酒店政策  -->
    <view v-if="currentTab === 'policies'" class="content">
      <view class="section" v-for="(item, index) in hotelPolicies" :key="index">
        <text class="section-title">{{ item.title }}</text>
        <view class="policy-item" v-for="(child, childIndex) in item.child" :key="childIndex">
          <view class="info">
            <text v-if="child.title" class="title">{{ child.title }}</text>
          </view>
          <text class="desc">{{ child.desc }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<style scoped lang="scss">

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

.facilities {
  height: 100vh;
  background-color: #FFF;
}

.tabs {
  background: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 30rpx;
  position: relative;

  .tab-item {
    flex: 1;
    text-align: center;
    font-size: 32rpx;
    transition: all 0.3s;
    position: relative;

    &.active {
      font-weight: 500;
    }
  }

  // 选中标签的下划线，固定在容器底部
  .tab-item.active::after {
    content: "";
    display: block;
    width: 40rpx;
    height: 4rpx;
    background: #ee781f;
    border-radius: 2rpx;
    position: absolute;
    top: 70rpx;
    left: 50%;
    transform: translateX(-50%);
  }
}

.content-line {
  width: 100%;
  height: 20rpx;
  background: #F3F4F6;
}

.content {
  background-color: #fff;
  border-radius: 10rpx;
  padding: 20rpx;
  height: auto;
}

.section {
  margin-bottom: 30rpx;
}

.section-title {
  font-size: 36rpx;
  color: #333;
  margin-bottom: 20rpx;
  font-weight: bold;
}

.service-item {
  display: flex;
  align-items: center;
  padding: 20rpx 0;

  .info {
    font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;
    font-weight: 500 !important;;
    font-size: 28rpx !important;;
    color: #19191A !important;;
    line-height: 28rpx !important;;
    text-align: left !important;;
    font-style: normal !important;;
  }

  .desc {
    font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;
    font-weight: 400 !important;;
    font-size: 24rpx !important;;
    color: #6D7278 !important;
    line-height: 24rpx !important;;
    text-align: left !important;;
    font-style: normal !important;
    margin-top: 12rpx;
  }
}


.icon-wrapper {
  width: 72rpx;
  height: 72rpx;
  margin-right: 20rpx;
}

.icon {
  width: 100%;
  height: 100%;
}

.info {
  flex: 1;
}

.title {
  font-size: 32rpx;
  margin-bottom: 10rpx;
}

.desc {
  font-size: 26rpx;
}
</style>