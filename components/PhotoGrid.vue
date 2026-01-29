<template>
  <view class="photo-grid">
    <!-- 第一张主图 -->
    <view v-if="imageList.length > 0" class="main-image-wrap" @click="previewImage(0)">
      <image
        :src="imageList[0].imageUrl"
        mode="aspectFill"
        class="main-image"
        :lazy-load="true"
      />
    </view>
    <!-- 2~7号图片，两列布局 -->
    <view class="grid-container grid-2col" v-if="imageList.length > 1">
      <view
        class="grid-item-2col"
        v-for="(img, idx) in imageList.slice(1, 7)"
        :key="'2col-' + (idx + 1)"
        @click="previewImage(idx + 1)"
      >
        <image
          :src="img.imageUrl"
          mode="aspectFill"
          class="grid-image"
          :lazy-load="true"
        />
       </view>
    </view>
    <!-- 8号及以后，四列布局 -->
    <view class="grid-container grid-4col" v-if="imageList.length > 7">
      <view
        class="grid-item-4col"
        v-for="(img, idx) in imageList.slice(7)"
        :key="'4col-' + (idx + 7 + 1)"
        @click="previewImage(idx + 7 + 1)"
      >
        <image
          :src="img.imageUrl"
          mode="aspectFill"
          class="grid-image"
          :lazy-load="true"
        />
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'PhotoGrid',
  props: {
    imageList: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    previewImage(index) {
      const urls = this.imageList.map(img => img.imageUrl);
      uni.previewImage({
        current: index,
        urls: urls,
        indicator: 'number',
        loop: true
      });
    }
  }
};
</script>

<style scoped>
.photo-grid {
  width: 100%;
  padding-bottom: 28rpx;
}

.main-image-wrap {
  margin: 28rpx;
  overflow: hidden;
  border-radius: 8rpx;
}

.main-image {
  width: 100%;
  display: block;
  aspect-ratio: 16/9;
  object-fit: cover;
}

.grid-container {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  gap: 28rpx;
  box-sizing: border-box;
  margin-bottom: 0;
}

.grid-2col {
  padding: 0 28rpx 0 28rpx;
  margin-bottom: 28rpx;
}
.grid-item-2col {
  width: calc((100% - 28rpx) / 2);
  height: 0;
  padding-bottom: calc((100% - 28rpx) / 2);
  position: relative;
  border-radius: 8rpx;
  overflow: hidden;
}

.grid-4col {
  padding: 0 28rpx 28rpx 28rpx;
  margin-top: 28rpx;
}
.grid-item-4col {
  width: calc((100% - 28rpx * 3) / 4);
  height: 0;
  padding-bottom: calc((100% - 28rpx * 3) / 4);
  position: relative;
  border-radius: 8rpx;
  overflow: hidden;
}

.grid-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style> 