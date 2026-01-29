<template>
  <view class="photo-album">
    <!-- 顶部导航栏 -->
    <uni-nav-bar
        :shadow="false"
        :border="false"
        :fixed="true"
        left-icon="left"
        status-bar
        @clickLeft="back">
      <template #default>
        <text class="nav-title">相册</text>
      </template>
    </uni-nav-bar>
    <!-- 图片网格 -->
    <scroll-view
        class="photo-grid"
        scroll-y
        @scrolltolower="loadMore"
        :style="{height: `calc(100vh - ${statusBarHeight + 44}px)`}"
    >
      <PhotoGrid :imageList="hotelImages"/>
    </scroll-view>
  </view>
</template>

<script>
import {getHotelImages,getRoomImages} from "@/common/api.js";
import PhotoGrid from '@/components/PhotoGrid.vue';
import {pageBack} from "../../../common/redirect";

export default {
  components: {
    PhotoGrid
  },
  data() {
    return {
      statusBarHeight: 0,
      hotelId: '',
      hotelImages: [],
      currentPage: 1,
      pageSize: 20,
      hasMore: true
    };
  },
  onLoad(options) {
    const sys = uni.getSystemInfoSync();
    this.statusBarHeight = sys.statusBarHeight || 0;
    this.hotelId = options.id;
    this.loadImages(options.type);
    // 设置胶囊按钮为黑色主题
    uni.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#FFFFFF'
    });
  },
  methods: {
    back() {
      pageBack()
    },
    async loadImages(type) {
      try {
        let res = [];
        if(type ==='hotel'){
          res = await getHotelImages(this.hotelId);
        }
        if(type ==='room'){
          res = await getRoomImages(this.hotelId);
        }
        if (res) {
          this.hotelImages = res;
        }
      } catch (e) {
        uni.showToast({
          title: '获取图片失败',
          icon: 'none'
        });
      }
    },
    previewImage(index) {
      const urls = this.hotelImages.map(img => img.imageUrl);
      uni.previewImage({
        current: index,
        urls: urls,
        indicator: 'number',
        loop: true
      });
    },
    loadMore() {
      // 这里可以实现加载更多图片的逻辑
      // 目前API只返回所有图片，所以暂时不需要分页
    }
  }
};
</script>

<style scoped>
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

.photo-album {
  width: 100%;
  height: 100vh;
  background: #fff;
  overflow: hidden;
}

.photo-grid {
  width: 100%;
  box-sizing: border-box;
}
</style> 