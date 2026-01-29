<template>
  <view class="container">
    <uni-nav-bar
        :shadow="false"
        :border="false"
        :left-icon="canGoBack?'left':''"
        status-bar
        fixed
        @clickLeft="goBack">
      <template #default>
        <text class="nav-title">试睡官服务协议</text>
      </template>
    </uni-nav-bar>

    <view class="sleep-tester-guide" @scroll="handleScroll">
      <rich-text :nodes="content"></rich-text>
    </view>

    <!-- 底部确认按钮 -->
    <view class="confirm-bottom-fixed">
      <view
          class="confirm-btn"
          :class="{ disabled: !canConfirm }"
          @click="handleConfirm"
      >
        {{ confirmBtnText }}
      </view>
    </view>
  </view>
</template>

<script>
import {pageBack} from "../../../common/redirect";

export default {
  data() {
    return {
      readTime: 15, // 强制阅读时间（秒）
      countdown: 15, // 倒计时
      canConfirm: true, // 是否可以确认
      canGoBack: true, // 是否可以返回
      timer: null,
      fromQuestionnaire: false, // 是否从问卷页面跳转过来
      content: `
        <div style="padding: 20px; font-size: 14px; line-height: 1.6; color: #333;">
          <p style="margin-bottom: 15px; text-align: center; font-weight: bold;">亲爱的试睡官，感谢您参与本次活动。</p>
          <p style="margin-bottom: 15px;">为确保您的体验和内容创作顺利进行，请仔细阅读以下协议条款：</p>
          <h3 style="font-size: 16px; font-weight: bold; margin: 20px 0 10px;">一、活动流程</h3>
          <div style="margin-bottom: 15px; padding: 15px; background: #F5F5F5; border-radius: 12px;">
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;">
              <div style="display: flex; align-items: flex-start; padding: 12px 10px; background: #fff; border-radius: 8px;">
                <div style="width: 28px; height: 28px; background: #EE781F; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #fff; font-weight: bold; font-size: 13px; flex-shrink: 0; margin-top: 2px;">1</div>
                <div style="flex: 1; margin-left: 8px;">
                  <div style="font-size: 14px; color: #333; font-weight: 600; margin-bottom: 3px;">扫码报名</div>
                  <div style="font-size: 11px; color: #999; line-height: 1.4;">填写表单提交资料</div>
                </div>
              </div>
              
              <div style="display: flex; align-items: flex-start; padding: 12px 10px; background: #fff; border-radius: 8px;">
                <div style="width: 28px; height: 28px; background: #EE781F; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #fff; font-weight: bold; font-size: 13px; flex-shrink: 0; margin-top: 2px;">2</div>
                <div style="flex: 1; margin-left: 8px;">
                  <div style="font-size: 14px; color: #333; font-weight: 600; margin-bottom: 3px;">扫码入群</div>
                  <div style="font-size: 11px; color: #999; line-height: 1.4;">加入试睡官交流群</div>
                </div>
              </div>
              
              <div style="display: flex; align-items: flex-start; padding: 12px 10px; background: #fff; border-radius: 8px;">
                <div style="width: 28px; height: 28px; background: #EE781F; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #fff; font-weight: bold; font-size: 13px; flex-shrink: 0; margin-top: 2px;">3</div>
                <div style="flex: 1; margin-left: 8px;">
                  <div style="font-size: 14px; color: #333; font-weight: 600; margin-bottom: 3px;">下单预约</div>
                  <div style="font-size: 11px; color: #999; line-height: 1.4;">联系门店小程序下单</div>
                </div>
              </div>
              
              <div style="display: flex; align-items: flex-start; padding: 12px 10px; background: #fff; border-radius: 8px;">
                <div style="width: 28px; height: 28px; background: #EE781F; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #fff; font-weight: bold; font-size: 13px; flex-shrink: 0; margin-top: 2px;">4</div>
                <div style="flex: 1; margin-left: 8px;">
                  <div style="font-size: 14px; color: #333; font-weight: 600; margin-bottom: 3px;">到店体验</div>
                  <div style="font-size: 11px; color: #999; line-height: 1.4;">凭证件办理入住体验</div>
                </div>
              </div>
              
              <div style="display: flex; align-items: flex-start; padding: 12px 10px; background: #fff; border-radius: 8px;">
                <div style="width: 28px; height: 28px; background: #EE781F; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #fff; font-weight: bold; font-size: 13px; flex-shrink: 0; margin-top: 2px;">5</div>
                <div style="flex: 1; margin-left: 8px;">
                  <div style="font-size: 14px; color: #333; font-weight: 600; margin-bottom: 3px;">发布内容</div>
                  <div style="font-size: 11px; color: #999; line-height: 1.4;">3天内发布原创内容</div>
                </div>
              </div>
              
              <div style="display: flex; align-items: flex-start; padding: 12px 10px; background: #fff; border-radius: 8px;">
                <div style="width: 28px; height: 28px; background: #EE781F; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #fff; font-weight: bold; font-size: 13px; flex-shrink: 0; margin-top: 2px;">6</div>
                <div style="flex: 1; margin-left: 8px;">
                  <div style="font-size: 14px; color: #333; font-weight: 600; margin-bottom: 3px;">审核退款</div>
                  <div style="font-size: 11px; color: #999; line-height: 1.4;">通过后两周内退款</div>
                </div>
              </div>
              
              <div style="grid-column: 1 / -1; display: flex; align-items: flex-start; padding: 12px 10px; background: #EE781F; border-radius: 8px;">
                <div style="width: 28px; height: 28px; background: #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #EE781F; font-weight: bold; font-size: 13px; flex-shrink: 0; margin-top: 2px;">7</div>
                <div style="flex: 1; margin-left: 8px;">
                  <div style="font-size: 14px; color: #fff; font-weight: 600; margin-bottom: 3px;">参与流量挑战赛</div>
                  <div style="font-size: 11px; color: rgba(255,255,255,0.85); line-height: 1.4;">自动参与，赢取最高1万元现金大奖</div>
                </div>
              </div>
            </div>
          </div>

          <h3 style="font-size: 16px; font-weight: bold; margin: 20px 0 10px;">二、报名门槛</h3>
          
          <p style="margin-bottom: 10px; font-weight: bold;">满足以下任意一项即可：</p>
          <ol style="padding-left: 20px; margin-bottom: 15px;">
            <li style="margin: 8px 0;">小红书账号粉丝 ≥ 500</li>
            <li style="margin: 8px 0;">抖音账号粉丝 ≥ 1000</li>
            <li style="margin: 8px 0;">小红书账号获赞与收藏 ≥ 1000</li>
          </ol>

          <h3 style="font-size: 16px; font-weight: bold; margin: 20px 0 10px;">三、活动须知</h3>
          
          <ul style="padding-left: 20px; margin-bottom: 15px;">
            <li style="margin: 10px 0;"><strong>体验门店：</strong>本次体验仅限于北京团结湖店和北京鸟巢店。</li>
            <li style="margin: 10px 0; padding: 12px; background: #fff1f0; border-left: 4px solid #ff4d4f; border-radius: 4px;"><strong style="color: #ff4d4f; font-size: 15px;">⚠️ 预约方式：</strong><span style="color: #333;">
            报名成功后，请您至少<strong style="color: #ff4d4f;">提前一天</strong>与所选门店联系，确定具体的入住时间（周末及法定节假日不可预约）。预约确认后，您需要通过<strong style="color: #ff4d4f;">官方小程序</strong>自行下单。待您完成后续内容发布并通过审核后，我们将为您办理退款。</span></li>
            <li style="margin: 10px 0;"><strong>到店办理：</strong>凭身份证及下单成功的订单信息至前台正常办理入住。</li>
            <li style="margin: 10px 0;"><strong>信息登记：</strong>为方便我们为您协调入住及后续服务，请您在入群24小时内，务必完成群公告内《住小叮试睡官信息登记表》的填写。</li>
            <li style="margin: 10px 0;"><strong>退款机制：</strong>在您发布内容后的48小时内，我们的运营团队将进行审核。只要您发布的内容符合本指南要求（非敷衍、无恶意诋毁），我们将在审核通过后两周内将您支付的订单费用原路全额退回。</li>
            <li style="margin: 10px 0;"><strong>体验时长：</strong>免费体验为期一晚，房型任选。</li>
          </ul>

          <h3 style="font-size: 16px; font-weight: bold; margin: 20px 0 10px;">四、内容创作要求（核心）</h3>
          
          <ul style="padding-left: 20px; margin-bottom: 15px;">
            <li style="margin: 10px 0;"><strong>发布平台：</strong>小红书 或 抖音（任选其一或全部）</li>
            <li style="margin: 10px 0;"><strong>发布时限：</strong>入住后 72小时（3天）内必须发布</li>
            <li style="margin: 10px 0;">
              <strong>必须添加的话题：</strong>
              <ul style="padding-left: 20px; margin-top: 5px;">
                <li>主话题：#住小叮 #住小叮试睡官</li>
                <li>辅助话题（至少选1-2个）：#北京平价酒店 #北京住宿 #穷游攻略 #北京旅行</li>
              </ul>
            </li>
            <li style="margin: 10px 0;">
              <strong>内容方向建议（供参考）：</strong>
              <ul style="padding-left: 20px; margin-top: 5px;">
                <li style="margin: 5px 0;"><strong>【性价比攻略】</strong>"邪修省钱版 | 在北京花100+住进地铁口酒店"</li>
                <li style="margin: 5px 0;"><strong>【位置展示】</strong>"步行XX分钟到鸟巢！这家酒店位置也太绝了！"</li>
                <li style="margin: 5px 0;"><strong>【细节测评】</strong>重点拍摄隐私性展示、床品舒适度、卫生间干净程度、自助服务等</li>
                <li style="margin: 5px 0;"><strong>【场景Vlog】</strong>"不到100元，看我北京求职/旅游第一天住了家怎样的酒店"</li>
              </ul>
            </li>
            <li style="margin: 10px 0;">
              <strong>内容底线：</strong>
              <ul style="padding-left: 20px; margin-top: 5px;">
                <li>内容必须为<strong>原创、真实、客观</strong></li>
                <li>图文内容不少于<strong>3图300字</strong>，视频时长不低于<strong>30秒</strong></li>
                <li>可以提出改进建议，但请勿恶意诋毁</li>
                <li><strong style="color: #ff4d4f;">敷衍了事的内容将无法通过审核与获得退款</strong></li>
              </ul>
            </li>
          </ul>

          <h3 style="font-size: 16px; font-weight: bold; margin: 20px 0 10px;">五、流量挑战赛规则</h3>
          
          <ul style="padding-left: 20px; margin-bottom: 15px;">
            <li style="margin: 10px 0;"><strong>参与资格：</strong>所有按规定发布内容并通过退款审核的试睡官自动参与。</li>
            <li style="margin: 10px 0;"><strong>评选标准：</strong>综合考量内容质量（点赞、收藏、评论、转发数据）及内容的真诚度。</li>
            <li style="margin: 10px 0;">
              <strong>奖励设置：</strong>
              <ul style="padding-left: 20px; margin-top: 5px;">
                <li style="margin: 8px 0; padding: 10px; background: #fff7e6; border-left: 3px solid #faad14;">
                  <strong>周度锦鲤奖：</strong>每周从新发布内容的用户中选取1名内容质量最高者，奖励<strong>20元现金红包</strong>或价值<strong>50元住小叮订房优惠券</strong>
                </li>
                <li style="margin: 8px 0; padding: 10px; background: #e6f7ff; border-left: 3px solid #1890ff;">
                  <strong>潜力奖：</strong>活动结束后，抖音单条播放量<strong>1w以上</strong>/小红书单条浏览量<strong>3000以上</strong>即可获得价值<strong>50元住小叮酒店优惠券</strong>和<strong>免费入住一晚</strong>（仅限团结湖店和鸟巢店）
                </li>
                <li style="margin: 8px 0; padding: 10px; background: #fff1f0; border-left: 3px solid #ff4d4f;">
                  <strong>终极大奖：</strong>活动结束后，满足抖音单条播放量<strong>50w以上</strong>或小红书单条浏览量<strong>15w以上</strong>，经评选后内容质量最高者即可获得现金奖励<strong style="font-size: 16px; color: #ff4d4f;">1万元</strong>
                </li>
              </ul>
            </li>
            <li style="margin: 10px 0;"><strong>活动时间：</strong>2025.11.24 - 2026.1.31</li>
            <li style="margin: 10px 0;"><strong>数据登记：</strong>发布内容后，请将内容链接登记至试睡官群内的《住小叮试睡官信息登记表》，以便工作人员统计，<strong style="color: #ff4d4f;">这是您参与挑战赛和获得退款的重要凭证</strong>。</li>
          </ul>

          <h3 style="font-size: 16px; font-weight: bold; margin: 20px 0 10px;">六、社群守则</h3>
          
          <ul style="padding-left: 20px; margin-bottom: 15px;">
            <li style="margin: 8px 0;">入群后请修改昵称：<strong>平台+昵称</strong>（如：小红书张三）</li>
            <li style="margin: 8px 0;">入群后请立即完成《试睡官信息收集表》，这是您顺利入住和退款的基础</li>
            <li style="margin: 8px 0;">群内可交流创作心得，互相鼓励</li>
            <li style="margin: 8px 0;">如有任何问题，请随时@群内工作人员</li>
          </ul>

          <h3 style="font-size: 16px; font-weight: bold; margin: 20px 0 10px;">七、其他条款</h3>
          
          <ol style="padding-left: 20px; margin-bottom: 15px;">
            <li style="margin: 10px 0;">本协议自您确认参与试睡官活动之日起生效。</li>
            <li style="margin: 10px 0;">住小叮（北京）酒店管理有限公司保留对本活动的最终解释权。</li>
            <li style="margin: 10px 0;">如因不可抗力或其他特殊情况需要调整活动规则，我们将提前在群内通知。</li>
            <li style="margin: 10px 0;">参与本活动即表示您同意住小叮使用您发布的内容进行品牌宣传（会注明作者）。</li>
          </ol>

          <div style="margin: 30px 0; padding: 20px; background: #f0f9ff; border-radius: 8px; text-align: center;">
            <p style="margin: 10px 0; font-size: 16px; font-weight: bold; color: #1890ff;">再次感谢您的参与</p>
            <p style="margin: 10px 0; font-size: 16px; font-weight: bold; color: #1890ff;">期待您的精彩分享！</p>
          </div>

          <p style="margin: 20px 0; text-align: center;">住小叮（北京）酒店管理有限公司</p>
          <p style="margin: 10px 0; text-align: center;">发布日期：2025年11月24日</p>
        </div>
      `
    }
  },
  computed: {
    confirmBtnText() {
      if (!this.canConfirm) {
        return `请仔细阅读 (${this.countdown}s)`;
      }
      return '我已阅读并同意';
    }
  },
  onLoad(options) {
    // 判断是否从问卷页面跳转过来
    if (options.from === 'questionnaire') {
      this.fromQuestionnaire = true;
      this.startCountdown();
    } else {
      // 如果不是从问卷页面来的，可以直接返回
      this.canGoBack = true;
      this.canConfirm = true;
      this.countdown = 0;
    }
  },
  onUnload() {
    // 清除定时器
    if (this.timer) {
      clearInterval(this.timer);
    }
  },
  methods: {
    // 开始倒计时
    startCountdown() {
      this.timer = setInterval(() => {
        if (this.countdown > 0) {
          this.countdown--;
        } else {
          this.canConfirm = true;
          this.canGoBack = true;
          clearInterval(this.timer);
        }
      }, 1000);
    },

    // 处理滚动事件（可选：滚动到底部才能确认）
    handleScroll(e) {
      // 可以在这里添加滚动到底部的逻辑
    },

    // 确认按钮
    handleConfirm() {
      if (!this.canConfirm) {
        uni.showToast({
          title: '请仔细阅读协议内容',
          icon: 'none'
        });
        return;
      }

      if (this.fromQuestionnaire) {
        // 用户点击了"我已阅读并同意"，设置确认标记
        uni.setStorageSync('sleep_tester_agreement_confirmed', true);
        // 返回问卷页面
        uni.navigateBack();
      } else {
        // 直接返回
        pageBack();
      }
    },

    goBack() {
      if (!this.canGoBack && this.fromQuestionnaire) {
        uni.showToast({
          title: '请先阅读完协议',
          icon: 'none'
        });
        return;
      }

      // 如果是从问卷页面来的，直接返回不设置任何标记
      if (this.fromQuestionnaire) {
        uni.navigateBack();
      } else {
        pageBack();
      }
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

.sleep-tester-guide {
  padding-bottom: 140rpx;
}

.confirm-bottom-fixed {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20rpx;
  padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
  background-color: #fff;
  z-index: 100;
}

.confirm-btn {
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
  transition: opacity 0.3s;
}

.confirm-btn.disabled {
  opacity: 0.5;
  background: #999;
}
</style>
