<template>
  <view
      class="floating-button"
      :style="{
      right: right + 'px',
      bottom: bottom + 'px',
      backgroundImage: `url(${buttonImage})`,
      opacity: opacity,
      transition: isMoving ? 'none' : 'all 0.3s ease',
      transform: `translateX(${translateX}px)`
    }"
      @touchstart="onTouchStart"
      @touchmove.stop.prevent="onTouchMove"
      @touchend="onTouchEnd"
      @click="handleClick"
  >
  </view>
</template>

<script>
export default {
  name: "DraggableFloatingButton",
  props: {
    buttonImage: {
      type: String,
      required: true
    },
    targetPage: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      right: 20,
      bottom: 100,
      translateX: 0,
      screenWidth: 0,
      screenHeight: 0,
      buttonSize: 0,
      startPoint: null,
      isMoving: false,
      opacity: 1,
      scrollTimer: null,
      isAtRightEdge: true // 默认在右边
    };
  },
  mounted() {
    // 获取屏幕尺寸
    const systemInfo = uni.getSystemInfoSync();
    this.screenWidth = systemInfo.windowWidth;
    this.screenHeight = systemInfo.windowHeight;

    // 计算按钮实际尺寸（rpx转px）
    this.buttonSize = uni.upx2px(132);

    // 监听页面滚动事件
    this.addScrollListener();
  },
  beforeDestroy() {
    // 移除滚动监听
    this.removeScrollListener();
  },
  methods: {
    addScrollListener() {
      // 监听页面滚动
      uni.$on('pageScroll', this.handlePageScroll);
    },

    removeScrollListener() {
      // 移除滚动监听
      uni.$off('pageScroll', this.handlePageScroll);
    },

    handlePageScroll() {
      // 页面滚动时部分隐藏按钮（靠边消失但不完全消失）
      // 根据吸附边决定隐藏方向
      if (this.isAtRightEdge) {
        // 如果在右边，向右偏移隐藏
        this.translateX = this.buttonSize * 0.99;
      } else {
        // 如果在左边，向左偏移隐藏
        this.translateX = -this.buttonSize * 0.99;
      }

      // 清除之前的定时器
      if (this.scrollTimer) {
        clearTimeout(this.scrollTimer);
      }

      // 滚动停止后显示按钮
      this.scrollTimer = setTimeout(() => {
        this.translateX = 0; // 回到原位
      }, 150);
    },

    onTouchStart(e) {
      const touch = e.touches[0];
      this.startPoint = {
        x: touch.clientX,
        y: touch.clientY,
        right: this.right,
        bottom: this.bottom
      };
      this.isMoving = true;

      // 触摸时立即显示按钮
      this.translateX = 0;
    },

    onTouchMove(e) {
      if (!this.startPoint) return;

      const touch = e.touches[0];
      const deltaX = touch.clientX - this.startPoint.x;
      const deltaY = touch.clientY - this.startPoint.y;

      // 计算新位置
      let newRight = this.startPoint.right - deltaX;
      let newBottom = this.startPoint.bottom - deltaY;

      // 边界检测
      const margin = 10;
      if (newRight < margin) newRight = margin;
      if (newRight > this.screenWidth - this.buttonSize - margin) newRight = this.screenWidth - this.buttonSize - margin;
      if (newBottom < margin) newBottom = margin;
      if (newBottom > this.screenHeight - this.buttonSize - margin) newBottom = this.screenHeight - this.buttonSize - margin;

      this.right = newRight;
      this.bottom = newBottom;

      // 阻止默认行为和事件冒泡
      e.preventDefault();
      e.stopPropagation();
    },

    onTouchEnd() {
      this.startPoint = null;
      this.isMoving = false;
      // 吸附到边缘
      this.snapToEdge();
    },

    snapToEdge() {
      const midpointX = this.screenWidth / 2;
      const margin = 10;

      // 水平方向吸附到左或右边缘
      // 注意：由于使用right定位，判断逻辑需要相应调整
      // right值越小表示越靠近屏幕右侧
      if (this.right < (this.screenWidth - this.buttonSize) / 2) {
        //吸附到右边缘（right值较小）
        this.right = margin;
        this.isAtRightEdge = true;
      } else {
        // 吸附到左边缘（right值较大）
        this.right = this.screenWidth - this.buttonSize - margin;
        this.isAtRightEdge = false;
      }
    },

    handleClick() {
      // 触发点击事件
      if (this.targetPage) {
        uni.navigateTo({
          url: this.targetPage
        });
      }
      this.$emit('click');
    }
  }
};
</script>

<style scoped>
.floating-button {
  position: fixed;
  width: 132rpx;
  height: 132rpx;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  z-index: 9999;
  /* 添加硬件加速优化性能 */
  transform: translateZ(0);
  will-change: right, bottom, transform;
}
</style>