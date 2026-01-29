<template>
  <view class="container">
    <uni-nav-bar
      :shadow="false"
      :border="false"
      left-icon="left"
      status-bar
      fixed
      @clickLeft="goBack">
      <template #default>
        <text class="nav-title">关于我们</text>
      </template>
    </uni-nav-bar>
    
    <view class="about-us">
      <rich-text :nodes="content"></rich-text>
    </view>
  </view>
</template>

<script>
import {pageBack} from "../../../common/redirect";
export default {
  data() {
    return {
      content: `
        <div style="padding: 20px; font-size: 14px; line-height: 1.6; color: #333;">
          <h2 style="text-align: center; margin-bottom: 20px; font-size: 18px; font-weight: bold;">关于我们 - 住小叮</h2>
          
          <p style="margin-bottom: 15px;">欢迎来到住小叮！</p>

          <h3 style="font-size: 16px; font-weight: bold; margin: 20px 0 10px;">一、我们的品牌：住小叮</h3>
          
          <p style="margin-bottom: 15px;">"住小叮"，一个致力于为您旅途中提供简约、经济、舒适港湾的连锁酒店品牌。我们的品牌名称传递着小巧、便捷、温馨且可靠的住宿理念，旨在成为您出行住宿的贴心选择。</p>

          <h3 style="font-size: 16px; font-weight: bold; margin: 20px 0 10px;">二、我们的公司：住小叮（北京）酒店管理有限公司</h3>
          
          <p style="margin-bottom: 15px;">住小叮（北京）酒店管理有限公司是"住小叮"品牌的持有者，以及"住小叮极简会员小程序"（下称"本小程序"）的开发和运营方。我们是一家专注于打造极致性价比连锁酒店品牌的创新型企业，总部位于北京。</p>

          <h3 style="font-size: 16px; font-weight: bold; margin: 20px 0 10px;">三、我们的使命与愿景</h3>
          
          <ul style="padding-left: 20px; margin-bottom: 15px;">
            <li><strong>使命</strong>：住小叮酒店以"降低旅居成本"为己任，始终秉持"说到做到，务实高效"的核心价值观，致力于为广大消费者打造一家真正做到极简超级经济、始终确保干净舒适、提供极致性价比的连锁酒店品牌。</li>
            <li><strong>愿景</strong>：我们的愿景是成为全球极简酒店品牌的领导者，让高品质、经济型的住宿体验遍布世界各地。</li>
          </ul>

          <h3 style="font-size: 16px; font-weight: bold; margin: 20px 0 10px;">四、我们的核心理念："极简"与"超经济"</h3>
          
          <p style="margin-bottom: 15px;">我们深刻洞察现代旅客对住宿的核心需求，并以此为出发点，重新定义经济型酒店：</p>
          
          <ul style="padding-left: 20px; margin-bottom: 15px;">
            <li><strong>如何"极简"？</strong> 我们倡导并实践酒店行业的"断舍离"生活美学。这意味着我们坚决去除一切不必要的铺张浪费和多余装饰，将所有资源和精力都聚焦于提升与睡眠（休息）本质最相关的核心住宿需求——一张舒适的床、一个洁净的空间、一份安心的保障。我们为您回归住宿的本质，拒绝一切干扰，让您的每一次入住都轻松无负担。</li>
            <li><strong>如何"超经济"？</strong> 我们认为，"经济"不应是低质的代名词。住小叮致力于实现真正的"超经济"：
              <ol style="padding-left: 20px; margin: 10px 0;">
                <li><strong>节省地住酒店</strong>：我们通过高效运营和成本控制，努力让您以更节省的费用享受到高品质的住宿体验。</li>
                <li><strong>没必要让住酒店成为一种负担</strong>：我们希望住宿是旅程中的轻松驿站，而非一项沉重的经济开销。</li>
                <li><strong>大众需要一家极致性价比的酒店</strong>：当前市场上的许多所谓"经济型"酒店其实并不真正经济，而价格过低的酒店又往往在安全感和品质感上有所欠缺。住小叮正是为了填补这一市场空白，以"超经济"以及"超乎想象的实惠与品质"为核心定位，向您诠释什么才是"真正的经济型酒店"。</li>
              </ol>
            </li>
          </ul>

          <h3 style="font-size: 16px; font-weight: bold; margin: 20px 0 10px;">五、我们的承诺："不用比，住小叮！"</h3>
          
          <p style="margin-bottom: 15px;">这不仅仅是我们的品牌口号，更是我们对每一位客人的郑重承诺。我们用心打磨产品和服务的每一个细节，从便捷易用的微信小程序预订流程，到专为会员设计的优惠福利体系，再到每一家住小叮酒店始终如一的干净整洁环境和友好服务，我们都力求为您提供超越期待的价值和体验。</p>

          <h3 style="font-size: 16px; font-weight: bold; margin: 20px 0 10px;">六、我们的发展历程与展望</h3>
          
          <p style="margin-bottom: 15px;">自2024年10月第一家住小叮酒店成功开业以来，凭借精准的市场定位、独特的产品理念和卓越的运营效率，我们获得了市场的积极响应。截至2025年4月，住小叮在营及已签约的酒店数量已达到10余家。</p>
          
          <p style="margin-bottom: 15px;">目前，我们正积极拓展全国市场，上海、杭州等一线及新一线城市的住小叮酒店也已在陆续筹建中。未来，我们将继续稳步扩张，让更多城市的旅客都能享受到住小叮带来的"极简"与"超经济"住宿新体验。</p>

          <h3 style="font-size: 16px; font-weight: bold; margin: 20px 0 10px;">七、联系我们</h3>
          
          <p style="margin-bottom: 15px;">如果您对住小叮有任何疑问、建议，或有业务合作意向，欢迎通过以下方式联系我们：</p>
          
          <ul style="padding-left: 20px; margin-bottom: 15px;">
            <li><strong>公司全称</strong>：住小叮（北京）酒店管理有限公司</li>
            <li><strong>客服邮箱</strong>：zhuxiaoding@zxd-hotel.com</li>
            <li><strong>官方网站</strong>：www.zxd-hotel.com</li>
            <li><strong>公司地址</strong>：北京市朝阳区望京街9号商业楼3层3286</li>
          </ul>

          <p style="margin-bottom: 15px;">感谢您选择住小叮，我们期待在未来的旅程中与您相伴，为您提供舒心、便捷、高性价比的住宿服务！</p>

          <p style="margin: 20px 0; text-align: center;">住小叮（北京）酒店管理有限公司</p>
          <p style="margin: 10px 0; text-align: center;">发布日期：2025年6月6日</p>
        </div>
      `
    }
  },
  methods: {
    goBack() {
      pageBack()
    }
  }
}
</script>

<style>
.container {
  min-height: 100vh;
  background-color: #fff;
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
  height: 88rpx;
}
</style> 