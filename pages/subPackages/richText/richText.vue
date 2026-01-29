<template>
  <view class="rich_text_page">
    <!-- 顶部导航栏 -->
    <uni-nav-bar
        :shadow="false"
        :border="false"
        :fixed="true"
        left-icon="left"
        status-bar
        @clickLeft="back">
      <template #default>
        <text class="nav-title">{{ title }}</text>
      </template>
    </uni-nav-bar>
    <u-parse class="rich-text-container" :content="nodes"></u-parse>
  </view>
</template>

<script>
import {pageBack} from "../../../common/redirect";

const {http} = uni.$u
export default {
  components: {},
  data() {
    return {
      title: '详情内容',
      nodes: '',
      id: ''
    };
  },
  onLoad(options) {
    this.id = options.id
    this.title = options.title
    uni.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#FFFFFF'
    });
  },
  onShow() {
    this.getDetail()
  },
  methods: {
    back() {
      pageBack()
    },
    async getDetail() {
      const res = await http.get(`/hotel-system/adcolumn/${this.id}`, {})
      this.nodes = res.detailContent
    }
  }
};
</script>

<style scoped lang="scss">
.rich_text_page {
  min-height: 100vh;
  background: white;

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

  .rich-text-container {
    width: 100%;
    height: auto;
    overflow: hidden;
    padding: 0 20rpx;
    box-sizing: border-box;
    display: block;
  }
}
</style>