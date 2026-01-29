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
        <text class="nav-title">免责声明</text>
      </template>
    </uni-nav-bar>
    
    <view class="disclaimer">
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
          <h2 style="text-align: center; margin-bottom: 20px; font-size: 18px; font-weight: bold;">免责声明 - 住小叮</h2>

          <h3 style="font-size: 16px; font-weight: bold; margin: 20px 0 10px;">重要提示：</h3>
          
          <p style="margin-bottom: 15px;">在使用住小叮平台（下称"本平台"，由住小叮（北京）酒店管理有限公司运营）提供的各项服务前，请您务必仔细阅读并充分理解本《免责声明》（下称"本声明"）的全部内容。<strong>您访问、浏览、注册、登录、预订、支付或以其他任何方式使用本平台服务的行为，均将被视为您已完全阅读、充分理解并无条件同意接受本声明所有条款的约束。</strong>如果您不同意本声明的任何内容，请立即停止使用本平台。</p>

          <p style="margin-bottom: 15px;">本声明是《住小叮用户服务协议》及本平台其他相关协议、规则（如《隐私政策》、《预订须知》等）的重要组成部分和补充。若本声明与前述文件就免责事项的约定存在不一致之处，在本声明明确列出的事项范围内，优先适用本声明的条款，除非其他协议中明确约定排除了本声明的适用或作出了对用户更有利的规定。</p>

          <h3 style="font-size: 16px; font-weight: bold; margin: 20px 0 10px;">一、 关于信息准确性、完整性与及时性</h3>
          
          <ol style="padding-left: 20px; margin-bottom: 15px;">
            <li>本平台展示的酒店信息（包括但不限于酒店名称、品牌、星级、地址、联系方式、图片、视频、设施描述、房型介绍、床型、面积、价格、可预订数量/库存、取消政策、住客评价等）主要来源于各合作酒店服务提供方（下称"酒店方"）的提供，或从其酒店物业管理系统（PMS）及其他授权渠道同步获取。部分内容（如用户评价、问答）则由其他用户自行上传和发布。</li>
            <li>住小叮公司力求对上述信息的真实性、准确性、完整性、合法性和及时性进行合理的、形式上的审核，但鉴于信息量巨大且可能实时变动（如酒店价格、房态调整、政策更新等），<strong>我们无法也并未对所有信息的绝对准确无误、完全无遗漏或始终保持最新状态作出任何明示或暗示的承诺或保证。</strong> 本平台展示的信息仅供您作为预订决策的参考。</li>
            <li>您理解并同意，最终的预订结果、具体服务内容、价格及条件等，均以您成功提交订单并收到本平台发出的预订成功确认信息为准，并在实际入住时以酒店方的确认为准。</li>
            <li>任何通过本平台发布的第三方内容，包括但不限于广告信息、推广链接、指向第三方网站或应用的内容与服务，其真实性、合法性、安全性均由相应的内容提供方独立负责。住小叮公司对此不作任何审查、背书或担保，也不承担任何直接或间接的法律责任。您应自行判断并审慎使用。</li>
          </ol>

          <h3 style="font-size: 16px; font-weight: bold; margin: 20px 0 10px;">二、 关于平台服务的稳定性与安全性</h3>
          
          <ol style="padding-left: 20px; margin-bottom: 15px;">
            <li>住小叮公司将尽商业上的合理努力，采用符合行业标准的技术和管理措施，保障本平台服务的持续、稳定、安全运行。但您充分理解并同意，互联网服务的复杂性和特殊性决定了我们无法保证服务100%不间断或无瑕疵。</li>
            <li>由于以下不可抗力或非住小叮公司可合理控制的因素，可能导致本平台服务暂时中断、延迟、受限、出现故障或数据丢失等风险，包括但不限于：
              <ul style="padding-left: 20px; margin: 10px 0;">
                <li>地震、洪水、台风、火灾、战争、恐怖袭击、瘟疫、骚乱、罢工等不可抗力事件；</li>
                <li>政府行为、法律法规变更、行政命令、司法裁判等；</li>
                <li>电力供应故障、基础电信运营商的通讯网络故障（如骨干网中断）、计算机病毒、木马程序、黑客攻击、系统（包括微信小程序平台本身）不稳定或崩溃、第三方服务（如支付网关、地图服务、云服务提供商）的故障、延迟或安全漏洞；</li>
                <li>本平台为保障服务质量而进行的必要系统维护、升级、改造（我们会尽可能提前通知）。</li>
              </ul>
            </li>
            <li>对于因上述原因造成的服务中断、功能异常、数据丢失、交易错误或您可能遭受的任何其他损失，在法律允许的最大范围内，<strong>住小叮公司不承担任何性质的赔偿责任，除非该等损失是由于住小叮公司的故意或重大过失直接造成的。</strong> 我们将努力在事后采取合理措施，减少因此给您造成的影响，并协助尽快恢复服务。</li>
          </ol>

          <h3 style="font-size: 16px; font-weight: bold; margin: 20px 0 10px;">三、 关于酒店服务本身</h3>
          
          <ol style="padding-left: 20px; margin-bottom: 15px;">
            <li>住小叮平台作为酒店预订信息技术服务平台，其核心角色是提供酒店信息展示、搜索、比较、预订撮合及相关技术支持。您通过本平台成功预订酒店，实际上是与您所选择的酒店方之间直接建立了住宿服务合同关系。</li>
            <li><strong>酒店的实际运营、管理、服务质量（例如客房卫生状况、设施完好与安全、员工服务态度、餐饮质量、安保措施等）、是否能完全按照订单约定提供服务（例如因酒店超售、突发事件、内部管理问题等导致无法安排入住或提供的服务与描述不符），以及您在酒店内的人身财产安全等，均由相应的酒店方独立负责并承担全部法律责任。</strong> 住小叮公司不对酒店方的服务质量、履约能力或安全性作任何承诺、保证或承担连带责任。</li>
            <li>如您在入住期间与酒店方就服务质量、费用结算（如押金、额外消费）、物品损坏/丢失、人身伤害、隐私泄露等事宜发生任何争议或纠纷，应首先直接与酒店方协商解决。住小叮公司可基于您的请求，在力所能及的范围内提供必要的、合理的协助和调解，但这并不意味着我们介入或成为争议的一方，我们亦不因此承担任何义务或责任。</li>
          </ol>

          <h3 style="font-size: 16px; font-weight: bold; margin: 20px 0 10px;">四、 关于用户自身行为与责任</h3>
          
          <ol style="padding-left: 20px; margin-bottom: 15px;">
            <li>您应对您在本平台注册信息的真实性、准确性、完整性负责，并妥善保管您的账户凭证（如登录密码、支付密码、验证码等），对所有使用您账户进行的操作行为（包括但不限于信息发布、预订、支付等）承担全部法律责任。</li>
            <li>因您自身原因（如泄露密码、与他人共享账户、误操作、设备感染病毒或被恶意软件控制、在不安全网络环境下操作等）导致的任何信息泄露、资金损失、订单被篡改或法律纠纷，均由您自行承担。</li>
            <li>您在使用本平台及入住酒店期间，如因违反国家法律法规、地方规定、平台规则或酒店管理规定，或因您的行为侵犯任何第三方合法权益（如知识产权、名誉权、隐私权等）而导致的任何法律责任和经济损失，均由您自行独立承担。若因此给住小叮公司造成损失，我们保留向您追偿的权利。</li>
          </ol>

          <h3 style="font-size: 16px; font-weight: bold; margin: 20px 0 10px;">五、 责任限制总则</h3>
          
          <ol style="padding-left: 20px; margin-bottom: 15px;">
            <li>除非中国法律法规另有强制性规定，或《住小叮用户服务协议》等本平台其他相关协议中明确约定应由住小叮公司承担的特定责任外，在任何情况下，<strong>住小叮公司对您因使用或无法使用本平台服务（无论原因为何）所产生的任何直接的、间接的、偶然的、特殊的、惩罚性的或后果性的损害（包括但不限于利润损失、数据丢失、商誉损失、业务中断、替代服务成本等），均不承担任何赔偿责任，即便我们已被告知该等损害发生的可能性。</strong></li>
            <li>若根据适用的强制性法律规定，住小叮公司应对您的某些损失承担不可推卸的赔偿责任，则住小叮公司向您承担的累计赔偿责任总额，在任何情况下均不应超过您在导致索赔的特定交易发生前十二（12）个月内，就该特定交易向住小叮公司实际支付的平台服务费用金额（如有，且不包括代酒店方收取的房费等款项）。若相关交易为免费服务，则我们的赔偿上限为人民币壹佰元（¥100）。</li>
          </ol>

          <h3 style="font-size: 16px; font-weight: bold; margin: 20px 0 10px;">六、 声明的更新与解释权</h3>
          
          <p style="margin-bottom: 15px;">住小叮公司有权根据法律法规的变化及平台运营管理的需要，不时修订和更新本声明。更新后的声明将通过平台公示或其他合理方式（如系统通知）通知您，并自公示之日或通知中载明的特定日期起生效，取代此前版本。<strong>您在声明更新后继续使用本平台服务的，即视为您已接受并同意更新后的声明内容。</strong> 本声明的最终解释权在法律允许的范围内归住小叮（北京）酒店管理有限公司所有。</p>

          <h3 style="font-size: 16px; font-weight: bold; margin: 20px 0 10px;">七、 其他</h3>
          
          <p style="margin-bottom: 15px;">本声明未尽事宜，请参照《住小叮用户服务协议》及其他平台规则。本声明中的标题仅为阅读方便而设，不影响任何条款的含义或解释。如果您对本声明的任何条款有疑问，请通过平台客服渠道联系我们。</p>

          <p style="margin: 20px 0; text-align: center;">住小叮（北京）酒店管理有限公司</p>
          <p style="margin: 10px 0; text-align: center;">首次发布日期：2025年6月6日</p>
          <p style="margin: 10px 0; text-align: center;">最近更新日期：2025年6月6日</p>
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

.disclaimer {
  padding: 20px;
}
</style> 