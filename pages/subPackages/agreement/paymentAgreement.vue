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
        <text class="nav-title">支付服务协议</text>
      </template>
    </uni-nav-bar>
    
    <view class="payment-agreement">
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
          <h2 style="text-align: center; margin-bottom: 20px; font-size: 18px; font-weight: bold;">支付服务协议 - 住小叮</h2>
          
          <p style="margin-bottom: 15px;"><strong>重要提示：</strong></p>
          <p style="margin-bottom: 15px;">本《支付服务协议》（下称"本协议"）是住小叮（北京）酒店管理有限公司（下称"我们"或"住小叮公司"）就用户（下称"您"）通过住小叮平台（下称"本平台"）进行在线支付的相关事宜所订立的有效合约。<strong>请您在进行支付操作前，仔细阅读并充分理解本协议的全部内容。当您使用本平台的支付功能时，即表示您已阅读、理解并同意遵守本协议的全部约定。</strong></p>

          <p style="margin-bottom: 15px;">本协议是《住小叮用户服务协议》的补充协议，是其不可分割的组成部分。本协议未尽事宜，适用《住小叮用户服务协议》及《预订须知》、《会员服务协议》的相关约定。若本协议与前述协议就支付服务相关条款存在不一致之处，在本协议明确约定的支付服务事项范围内，以本协议为准。</p>

          <h3 style="font-size: 16px; font-weight: bold; margin: 20px 0 10px;">一、支付服务概述</h3>
          
          <ol style="padding-left: 20px; margin-bottom: 15px;">
            <li>本平台为您在本平台预订酒店住宿产品、购买会员服务等场景提供在线支付功能。目前主要通过接入第三方支付机构（如微信支付，下称"支付机构"）的服务来实现。</li>
            <li><strong>住小叮公司并非银行或金融机构，不直接向您提供支付结算服务，也不存储您的支付账户敏感信息（如支付密码）。</strong> 您的支付指令将通过本平台加密传递给您所选择的支付机构，由该支付机构依据其规则处理您的付款请求。</li>
            <li>您理解并同意，使用特定支付机构的服务需要遵守该支付机构的服务协议、隐私政策及相关业务规则。因支付机构系统故障、规则变动、风控措施或您自身操作不当等原因导致的任何支付错误、延迟、限额、安全问题或纠纷，应由您与相关支付机构协商解决，住小叮公司可基于您的请求提供必要的、合理的协助。</li>
          </ol>

          <h3 style="font-size: 16px; font-weight: bold; margin: 20px 0 10px;">二、支付流程与确认</h3>
          
          <ol style="padding-left: 20px; margin-bottom: 15px;">
            <li>当您在本平台提交订单（包括酒店预订订单、会员开通订单等）并进入支付环节时，您将被引导至支付机构的支付页面或调起支付机构的SDK/API来完成支付操作。</li>
            <li>您需要按照支付机构页面的提示输入正确的支付信息（如账户详情、密码、短信验证码等，具体以支付机构要求为准）并确认支付。请确保您使用的是本人合法有效的支付账户。</li>
            <li>支付成功后，支付机构会将其处理结果（成功或失败）通知本平台。本平台在收到支付机构发出的支付成功的通知后，将为您确认订单状态并进行后续处理（如《预订须知》所述的酒店订单生效流程，《会员服务协议》所述的会员资格开通流程）。支付状态的最终确认以本平台系统记录为准。</li>
            <li>对于会员费用的支付（包括按照平台策略配置的 ¥0 开通会员资格的情况），也同样适用本支付流程，以确保交易记录的完整性和平台统一管理。</li>
          </ol>

          <h3 style="font-size: 16px; font-weight: bold; margin: 20px 0 10px;">三、费用与币种</h3>
          
          <ol style="padding-left: 20px; margin-bottom: 15px;">
            <li>本平台展示的酒店产品或会员服务的价格均以人民币（CNY）计价和结算。</li>
            <li>您使用支付服务时，支付机构可能会根据其业务规则向您或商户（即住小叮公司）收取相应的手续费。该等费用由支付机构直接收取或结算，具体请参考支付机构的官方规定。本平台通常不针对支付行为本身另行向您收取额外的支付服务费，除非在特定场景下有明确事前公示并获得您的同意。</li>
          </ol>

          <h3 style="font-size: 16px; font-weight: bold; margin: 20px 0 10px;">四、支付安全与用户责任</h3>
          
          <ol style="padding-left: 20px; margin-bottom: 15px;">
            <li>住小叮公司重视您的交易安全。本平台会采取符合行业标准的技术措施（如数据加密传输）及必要的风险控制手段，保障支付过程中的数据传输安全和平台侧的交易安全。</li>
            <li><strong>您有责任妥善保管您的个人支付账户信息（如微信支付账户名、登录密码、支付密码、绑定的银行卡信息、手机短信验证码等），不得向任何第三方泄露或允许他人使用您的账户进行支付。</strong> 因您自身原因（如账户信息保管不善被盗用、设备感染病毒木马、在不安全环境下操作、误操作、将支付凭证泄露给他人等）导致的资金损失或纠纷，由您自行承担全部责任。</li>
            <li>如您发现任何未经授权使用您账户进行支付的行为，或任何其他账户安全漏洞，请立即通知相关支付机构冻结账户，并同时通知住小叮公司客服，以便我们配合调查和处理。</li>
            <li>请勿相信任何非官方渠道发布的支付链接或要求，警惕网络钓鱼和电信诈骗。</li>
          </ol>

          <h3 style="font-size: 16px; font-weight: bold; margin: 20px 0 10px;">五、退款处理</h3>
          
          <ol style="padding-left: 20px; margin-bottom: 15px;">
            <li><strong>退款适用条件与政策</strong>：订单是否可以退款、退款的具体条件、可退金额及退款处理时效，均严格以您预订时所选产品/服务对应的《预订须知》中的具体取消政策、《会员服务协议》中的相关约定或平台其他公示的退款规则为准。</li>
            <li><strong>退款路径与时效</strong>：对于符合退款条件的订单，退款将通常按照您原订单的支付路径原路退回至您的原支付账户（例如，微信支付的订单将退回至原微信支付账户）。退款到账时间取决于支付机构和相关银行的处理速度，一般情况下为1至15个工作日不等，特殊情况下可能有所延迟。本平台会在确认退款操作后及时将退款请求提交给支付机构。</li>
            <li><strong>¥0 支付的特殊说明</strong>：对于通过 ¥0 支付流程完成的交易（例如 ¥0 开通会员资格），因实际上未发生资金转移，故不涉及金钱上的退款问题。</li>
            <li>住小叮公司有权根据相关法律法规及平台风险控制策略，对可疑交易、高风险交易或涉嫌欺诈的交易进行审查。在审查期间，相关款项（包括可能的退款）可能会被暂时冻结，我们并可能要求您提供额外信息进行身份验证或交易核实。请您配合。</li>
          </ol>

          <h3 style="font-size: 16px; font-weight: bold; margin: 20px 0 10px;">六、责任范围与限制</h3>
          
          <ol style="padding-left: 20px; margin-bottom: 15px;">
            <li>住小叮公司仅在本协议及《住小叮用户服务协议》约定的范围内，就通过本平台使用第三方支付机构服务过程中的平台侧技术服务承担相应责任。</li>
            <li>因不可抗力（如自然灾害、战争、政府管制）、支付机构系统故障或升级、银行系统问题、通讯网络中断、大规模黑客攻击、电力故障等非住小叮公司可合理控制的因素导致的支付失败、延迟、错误或信息泄露，住小叮公司不承担直接或间接的赔偿责任，但会在事后尽力协助您与相关方沟通解决，并采取合理的补救措施。</li>
            <li>支付过程的最终成功与否，以及资金的划转，均由支付机构和银行负责处理。本平台对支付机构或银行的服务质量、效率及安全性不作任何明示或暗示的保证。</li>
          </ol>

          <h3 style="font-size: 16px; font-weight: bold; margin: 20px 0 10px;">七、协议的变更与生效</h3>
          
          <ol style="padding-left: 20px; margin-bottom: 15px;">
            <li>住小叮公司有权根据业务发展需要、法律法规更新或支付机构规则调整等原因，不时修订本协议条款。修订后的协议将通过平台公示（例如在支付页面、用户协议中心或公告区发布）等方式通知您。</li>
            <li><strong>修订后的协议一经公示即刻生效，并取代此前相关内容。您在协议修订后继续使用本平台的支付服务，即表示您已充分阅读、理解并接受修订后的全部内容。</strong> 如果您不同意修订后的协议，请立即停止使用本平台的支付服务。</li>
          </ol>

          <h3 style="font-size: 16px; font-weight: bold; margin: 20px 0 10px;">八、联系我们</h3>
          
          <p style="margin-bottom: 15px;">如您对本协议内容或在本平台进行支付过程中遇到任何疑问或问题，请通过《住小叮用户服务协议》中公示的联系方式或平台内客服渠道与我们联系。</p>

          <p style="margin: 20px 0; text-align: center;">住小叮（北京）酒店管理有限公司</p>
          <p style="margin: 10px 0; text-align: center;">生效日期：2025年6月6日</p>
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
