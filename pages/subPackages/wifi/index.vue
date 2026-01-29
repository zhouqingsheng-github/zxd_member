<template>
  <view class="wifi-container">
    <!-- 导航栏 -->
    <uni-nav-bar
        backgroundColor="transparent"
        color="#FFFFFF"
        :fixed="true"
        :shadow="false"
        :border="false"
        status-bar
        left-icon="left"
        @clickLeft="goBack"
    >
      <template #default>
        <text class="nav-title">WiFi连接</text>
      </template>
    </uni-nav-bar>

    <!-- 内容区域 -->
    <view class="content">
      <!-- 加载中 -->
      <view v-if="loading" class="loading-container">
        <view class="loading-spinner">
          <view class="spinner-ring"></view>
          <view class="spinner-ring"></view>
          <view class="spinner-ring"></view>
        </view>
        <text class="loading-text">加载中...</text>
      </view>

      <!-- WiFi信息卡片 -->
      <view v-else-if="wifiInfo.ssid" class="cards-container">
        <view class="wifi-card">
          <!-- WiFi图标 -->
          <view class="wifi-icon">
            <view class="icon-bg">
              <u-icon name="wifi" size="64" color="#ffffff"></u-icon>
            </view>
            <view class="pulse-ring"></view>
          </view>

          <!-- 酒店名称 -->
          <view v-if="hotelName" class="hotel-name">
            <text class="main-name">{{ hotelMainName }}</text>
            <text v-if="hotelSubName" class="sub-name">{{ hotelSubName }}</text>
            <text class="welcome-text">欢迎您连接</text>
          </view>

          <!-- 连接按钮 -->
          <view class="connect-section">
            <view
                class="connect-btn"
                :class="{ 
                  'connecting': connecting,
                  'connected': isWifiConnected && currentWifiSSID === wifiInfo.ssid
                }"
                @click="handleConnectClick"
            >
              <view v-if="connecting" class="btn-loading">
                <view class="btn-spinner"></view>
              </view>
              <view v-else-if="isWifiConnected && currentWifiSSID === wifiInfo.ssid" class="connected-icon">
                ✓
              </view>
              <text>{{ buttonText }}</text>
            </view>
          </view>
        </view>

        <!-- 红包列表 -->
        <view v-for="(item, index) in couponList" :key="item.id" class="coupon-card">
          <view class="coupon-header">
            <view class="coupon-icon">🎁</view>
            <view class="coupon-title">
              <text class="title-text">{{ item.name }}</text>
              <text class="subtitle-text">{{ getValidityText(item) }}</text>
            </view>
          </view>
          <view class="coupon-content">
            <view class="coupon-amount">
              <template v-if="item.type === 1">
                <text class="amount-symbol">¥</text>
                <text class="amount-value">{{ item.amount }}</text>
              </template>
              <template v-else>
                <text class="amount-value">{{ item.amount }}</text>
                <text class="amount-symbol">折</text>
              </template>
            </view>
            <view class="coupon-desc">
              <text v-if="item.minSpend > 0" class="desc-tag">
                满{{ item.minSpend }}元可用
              </text>
              <text v-else class="desc-tag">无门槛立减</text>
            </view>
          </view>
          <view class="coupon-tags">
            <text v-if="item.scopeType === 1" class="tag">全部门店可用</text>
            <text v-else class="tag">指定门店可用</text>
            <text v-if="item.redPacketRule && item.redPacketRule.stayDays > 0" class="tag">
              连续{{ item.redPacketRule.stayDays }}晚及以上
            </text>
          </view>
          <view class="coupon-btn" :class="{ 'btn-disabled': !item.canReceive }" @click="receiveCoupon(item)">
            <text>{{ item.canReceive ? '立即领取' : '已领取' }}</text>
          </view>
        </view>
      </view>

      <!-- 无数据 -->
      <view v-else class="empty-container">
        <u-empty mode="data" text="暂无WiFi配置信息"></u-empty>
      </view>
    </view>
  </view>
</template>

<script>
import {pageBack} from "../../../common/redirect";
import {getWifiCoupons, receiveRedEnvelope} from "../../../common/api";
import {handleLoginRequired, isLoggedIn} from "../../../common/auth";

export default {
  data() {
    return {
      hotelId: null,
      hotelName: '',
      wifiInfo: {
        ssid: '',
        password: '',
        encryption: 'WPA'
      },
      isIOS: false,
      isAndroid: false,
      androidVersion: 0,
      loading: true,
      connecting: false,
      showPassword: false, // 控制密码显示/隐藏
      couponList: [], // 红包列表
      isWifiConnected: false, // WiFi连接状态
      currentWifiSSID: '', // 当前连接的WiFi名称
      wifiStatusTimer: null, // WiFi状态检查定时器
    }
  },
  computed: {
    buttonText() {
      if (this.connecting) {
        return '连接中...'
      }
      if (this.isWifiConnected && this.currentWifiSSID === this.wifiInfo.ssid) {
        return '已连接'
      }
      return '一键连接WiFi'
    },
    
    // 按钮是否可点击
    isButtonDisabled() {
      return this.connecting || (this.isWifiConnected && this.currentWifiSSID === this.wifiInfo.ssid)
    },
    // 酒店主名称（不包含括号内容）
    hotelMainName() {
      if (!this.hotelName) return ''
      // 匹配（ 或 ( 前面的内容
      const match = this.hotelName.match(/^(.*?)[（(]/)
      return match ? match[1] : this.hotelName
    },
    // 酒店分店名称（括号内容）
    hotelSubName() {
      if (!this.hotelName) return ''
      // 匹配（ 或 ( 开始的内容
      const match = this.hotelName.match(/[（(].*/)
      return match ? match[0] : ''
    }
  },
  onLoad(options) {
    // 设置状态栏为白色
    uni.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#EE781F'
    });

    // 检测平台
    this.checkPlatform()

    // 获取酒店ID
    if (options.hotelId) {
      this.hotelId = options.hotelId
    } else if (options.scene) {
      // 从小程序码scene参数中解析
      const scene = decodeURIComponent(options.scene)
      const match = scene.match(/hotelId=(\d+)/)
      if (match) {
        this.hotelId = match[1]
      }
    }

    if (this.hotelId) {
      this.loadWifiInfo()
      this.loadCouponList()
      // 添加WiFi状态监听
      this.setupWifiStatusListeners()
    } else {
      this.loading = false
      uni.showToast({
        title: '参数错误',
        icon: 'none'
      })
    }
  },
  methods: {
    // 返回
    goBack() {
      pageBack()
    },

    // 检测平台
    checkPlatform() {
      const systemInfo = uni.getSystemInfoSync()
      this.isIOS = systemInfo.platform === 'ios'
      this.isAndroid = systemInfo.platform === 'android'

      // 获取Android版本号
      if (this.isAndroid) {
        const version = systemInfo.system.match(/Android (\d+)/)
        this.androidVersion = version ? parseInt(version[1]) : 0
        console.log('Android版本:', this.androidVersion)
      }

      console.log('平台信息:', {
        platform: systemInfo.platform,
        system: systemInfo.system,
        isAndroid: this.isAndroid,
        androidVersion: this.androidVersion
      })
    },

    // 加载WiFi信息
    async loadWifiInfo() {
      this.loading = true
      try {
        this.wifiInfo = await uni.$u.http.get(`/hotel-adapter/hotel-wifi/hotel/${this.hotelId}`)
        await this.getHotelName()
        // 加载WiFi信息后检查连接状态
        await this.checkCurrentWifiStatus()
      } catch (error) {
        uni.showToast({
          title: '未配置WiFi信息',
          icon: 'none'
        })
      } finally {
        this.loading = false
      }
    },

    // 设置WiFi状态监听
    setupWifiStatusListeners() {
      // 监听WiFi连接断开事件（如果有的话）
      // 注意：UniApp可能没有直接的WiFi断开监听API
      // 我们可以定期检查WiFi状态
      this.startWifiStatusPolling()
    },

    // 开始WiFi状态轮询
    startWifiStatusPolling() {
      // 每10秒检查一次WiFi状态
      this.wifiStatusTimer = setInterval(() => {
        this.checkWifiStatusUpdate()
      }, 10000)
    },

    // 停止WiFi状态轮询
    stopWifiStatusPolling() {
      if (this.wifiStatusTimer) {
        clearInterval(this.wifiStatusTimer)
        this.wifiStatusTimer = null
      }
    },

    // 检查WiFi状态更新
    async checkWifiStatusUpdate() {
      // 只有在WiFi信息加载完成后才检查
      if (!this.wifiInfo.ssid) {
        return
      }

      try {
        const res = await new Promise((resolve, reject) => {
          uni.getConnectedWifi({
            success: resolve,
            fail: reject
          })
        })

        const newSSID = res.wifi ? res.wifi.SSID : ''
        const wasConnectedToTarget = this.isWifiConnected && this.currentWifiSSID === this.wifiInfo.ssid
        const isNowConnectedToTarget = newSSID === this.wifiInfo.ssid

        // 更新状态
        this.currentWifiSSID = newSSID
        this.isWifiConnected = !!newSSID

        // 如果之前连接到目标WiFi，现在断开了，显示提示
        if (wasConnectedToTarget && !isNowConnectedToTarget) {
          console.log('WiFi连接已断开')
          uni.showToast({
            title: 'WiFi连接已断开',
            icon: 'none',
            duration: 2000
          })
        }
        // 如果重新连接到目标WiFi，显示提示
        else if (!wasConnectedToTarget && isNowConnectedToTarget) {
          console.log('WiFi已重新连接')
          uni.showToast({
            title: 'WiFi已连接',
            icon: 'success',
            duration: 2000
          })
        }

      } catch (error) {
        // WiFi获取失败，可能是断开了
        if (this.isWifiConnected) {
          console.log('WiFi状态检查失败，可能已断开')
          this.isWifiConnected = false
          this.currentWifiSSID = ''
        }
      }
    },

    // 检查当前WiFi连接状态
    async checkCurrentWifiStatus() {
      try {
        // 先初始化WiFi模块
        await new Promise((resolve, reject) => {
          uni.startWifi({
            success: resolve,
            fail: reject
          })
        })

        // 获取当前连接的WiFi信息
        const res = await new Promise((resolve, reject) => {
          uni.getConnectedWifi({
            success: resolve,
            fail: reject
          })
        })

        if (res.wifi && res.wifi.SSID) {
          this.currentWifiSSID = res.wifi.SSID
          this.isWifiConnected = true
          console.log('当前连接的WiFi:', res.wifi.SSID)
          console.log('目标WiFi:', this.wifiInfo.ssid)
        }
      } catch (error) {
        console.log('获取WiFi状态失败:', error)
        this.isWifiConnected = false
        this.currentWifiSSID = ''
      }
    },

    // 获取酒店名称(可选)
    async getHotelName() {
      try {
        const res = await uni.$u.http.get(`/hotel-stores/hotels/${this.hotelId}`)
        this.hotelName = res.name
      } catch (error) {
        console.error('获取酒店名称失败', error)
      }
    },

    // 切换密码显示/隐藏
    togglePassword() {
      this.showPassword = !this.showPassword
    },

    // 加载红包列表
    async loadCouponList() {
      try {
        const res = await getWifiCoupons({
          page: 1,
          pageSize: 10
        })
        if (res && res.records && res.records.length > 0) {
          this.couponList = res.records
        }
      } catch (error) {
        console.error('加载红包列表失败', error)
      }
    },

    getValidityText(item) {
      if (item.validityPeriodType === 1) {
        return `领取后${item.duration}天有效`
      }
      return `有效期${this.formatDate(item.startTime)}-${this.formatDate(item.endTime)}`
    },

    // 领取红包
    async receiveCoupon(item) {
      if (!item.canReceive) {
        return
      }

      await handleLoginRequired({
        url: '/pages/subPackages/wifi/index',
        params: {hotelId: this.hotelId},
        registerChannel: 'WIFI二维码',
        hotelId: this.hotelId,
        success: async () => {
          uni.showLoading({
            title: '领取中...'
          })

          try {
            await receiveRedEnvelope(item.id)
            uni.hideLoading()
            uni.showToast({
              title: '领取成功',
              icon: 'success'
            })

            // 领取成功后，更新状态
            item.canReceive = false
          } catch (error) {
            uni.hideLoading()
            uni.showToast({
              title: error.message || '领取失败',
              icon: 'none'
            })
          }
        }
      })
    },

    // 格式化日期
    formatDate(dateStr) {
      if (!dateStr) return ''
      const date = new Date(dateStr)
      const month = date.getMonth() + 1
      const day = date.getDate()
      return `${month}.${day}`
    },

    // 复制文本
    copyText(text) {
      uni.setClipboardData({
        data: text,
        success: () => {
          uni.showToast({
            title: '复制成功',
            icon: 'success'
          })
        }
      })
    },

    // 处理连接按钮点击
    handleConnectClick() {
      // 如果已经连接到目标WiFi，不执行任何操作
      if (this.isWifiConnected && this.currentWifiSSID === this.wifiInfo.ssid) {
        return
      }
      // 否则执行连接
      this.connectWifi()
    },

    // 连接WiFi
    connectWifi() {
      handleLoginRequired({
        url: '/pages/subPackages/wifi/index',
        params: {hotelId: this.hotelId},
        registerChannel: 'WIFI二维码',
        hotelId: this.hotelId,
        success: () => {
          this.connecting = true
          // 优先尝试直连，如果失败再考虑手动连接
          this.initWifiAndConnect()
        }
      })
    },

    // 初始化WiFi并连接
    initWifiAndConnect() {
      // 1. 初始化WiFi模块
      uni.startWifi({
        success: () => {
          console.log('WiFi模块初始化成功')
          this.doConnectWifi()
        },
        fail: (err) => {
          console.error('WiFi模块初始化失败', err)
          this.connecting = false

          let errorMsg = '初始化失败'
          switch (err.errCode) {
            case 12001:
              errorMsg = '当前系统不支持WiFi功能'
              break
            case 12005:
              errorMsg = '请先开启手机WiFi功能'
              break
            default:
              errorMsg = `WiFi模块初始化失败 (错误码: ${err.errCode})`
          }

          uni.showToast({
            title: errorMsg,
            icon: 'none',
            duration: 3000
          })
        }
      })
    },

    // 手动连接WiFi (Android 10+)
    connectWifiManual() {
      const {ssid, password} = this.wifiInfo

      if (!ssid || !password) {
        this.connecting = false
        uni.showToast({
          title: 'WiFi配置信息不完整',
          icon: 'none',
          duration: 3000
        })
        return
      }

      // 先初始化WiFi模块
      uni.startWifi({
        success: () => {
          console.log('WiFi模块初始化成功，开始手动连接')
          uni.connectWifi({
            SSID: ssid,
            password: password,
            maunal: true, // 跳转到系统设置页进行连接
            success: () => {
              console.log('跳转到系统WiFi设置成功')
              this.connecting = false
              uni.showToast({
                title: '请在系统设置中完成WiFi连接',
                icon: 'none',
                duration: 3000
              })
            },
            fail: (err) => {
              console.error('跳转WiFi设置失败', err)
              this.connecting = false

              let errorMsg = '无法跳转到WiFi设置'
              switch (err.errCode) {
                case 12000:
                  errorMsg = '未先调用startWifi接口'
                  break
                case 12001:
                  errorMsg = '当前系统不支持WiFi功能'
                  break
                case 12002:
                  errorMsg = 'WiFi密码错误'
                  break
                case 12005:
                  errorMsg = '请先开启手机WiFi功能'
                  break
                default:
                  errorMsg = `跳转失败 (错误码: ${err.errCode})`
              }

              uni.showToast({
                title: errorMsg,
                icon: 'none',
                duration: 3000
              })
            }
          })
        },
        fail: (err) => {
          console.error('WiFi模块初始化失败', err)
          this.connecting = false

          let errorMsg = '初始化失败'
          switch (err.errCode) {
            case 12001:
              errorMsg = '当前系统不支持WiFi功能'
              break
            case 12005:
              errorMsg = '请先开启手机WiFi功能'
              break
            default:
              errorMsg = `WiFi模块初始化失败 (错误码: ${err.errCode})`
          }

          uni.showToast({
            title: errorMsg,
            icon: 'none',
            duration: 3000
          })
        }
      })
    },

    // 执行连接WiFi (直连模式)
    doConnectWifi() {
      const {ssid, password} = this.wifiInfo

      // 先检查WiFi信息是否有效
      if (!ssid || !password) {
        this.connecting = false
        uni.showToast({
          title: 'WiFi配置信息不完整',
          icon: 'none',
          duration: 3000
        })
        return
      }

      let timeoutId = null
      let isConnected = false

      // 添加WiFi连接监听
      const onWifiConnectedHandler = (res) => {
        console.log('WiFi连接成功监听:', res)
        if (res.wifi && res.wifi.SSID === ssid && !isConnected) {
          isConnected = true
          this.connecting = false

          // 清除超时定时器
          if (timeoutId) {
            clearTimeout(timeoutId)
            timeoutId = null
          }

          // 更新连接状态
          this.isWifiConnected = true
          this.currentWifiSSID = res.wifi.SSID

          uni.showToast({
            title: '连接成功',
            icon: 'success'
          })
          
          // 移除监听
          uni.offWifiConnected(onWifiConnectedHandler)
        }
      }

      uni.onWifiConnected(onWifiConnectedHandler)

      uni.connectWifi({
        SSID: ssid,
        password: password,
        partialInfo: this.isAndroid, // Android平台返回部分信息
        // 尝试添加一些参数来提高连接稳定性
        success: () => {
          console.log('WiFi连接请求发送成功')
          // 设置超时，如果5秒内没有连接成功回调，则认为连接失败
          timeoutId = setTimeout(() => {
            if (this.connecting && !isConnected) {
              console.log('WiFi连接超时')
              this.connecting = false
              uni.offWifiConnected(onWifiConnectedHandler)
              uni.showToast({
                title: '连接超时，请重试',
                icon: 'none',
                duration: 3000
              })
            }
          }, 5000)
        },
        fail: (err) => {
          console.error('WiFi连接失败', err)
          this.connecting = false
          isConnected = true // 防止超时提示

          // 清除超时定时器
          if (timeoutId) {
            clearTimeout(timeoutId)
            timeoutId = null
          }

          // 移除监听
          uni.offWifiConnected(onWifiConnectedHandler)

          let errorMsg = '连接失败'
          let showManualOption = false

          switch (err.errCode) {
            case 0:
              // 正常情况，不应该进入fail回调
              errorMsg = '操作正常'
              break
            case 12000:
              errorMsg = '未先调用startWifi接口'
              break
            case 12001:
              errorMsg = '当前系统不支持WiFi功能'
              break
            case 12002:
              errorMsg = 'WiFi密码错误，请联系酒店前台'
              break
            case 12005:
              errorMsg = '请先开启手机WiFi功能'
              break
            case 12013:
              errorMsg = 'WiFi配置已过期，请重新连接'
              // Android设备可以尝试手动连接
              showManualOption = this.isAndroid
              break
            default:
              errorMsg = `连接失败 (错误码: ${err.errCode})`
              // 对于未知错误，Android设备可以尝试手动连接
              showManualOption = this.isAndroid
          }

          if (showManualOption) {
            // 显示手动连接选项
            uni.showModal({
              title: '连接失败',
              content: errorMsg + '，是否尝试跳转到系统WiFi设置手动连接？',
              confirmText: '手动连接',
              cancelText: '取消',
              success: (res) => {
                if (res.confirm) {
                  this.connectWifiManual()
                }
              }
            })
          } else {
            uni.showToast({
              title: errorMsg,
              icon: 'none',
              duration: 3000
            })
          }
        }
      })
    },

  },
  onUnload() {
    // 页面卸载时停止WiFi模块和移除监听
    uni.stopWifi()
    uni.offWifiConnected()
    // 停止WiFi状态轮询
    this.stopWifiStatusPolling()
  },
  
  onShow() {
    // 页面显示时重新开始WiFi状态检查
    if (this.wifiInfo.ssid && !this.wifiStatusTimer) {
      this.startWifiStatusPolling()
      // 立即检查一次状态
      this.checkWifiStatusUpdate()
    }
  },
  
  onHide() {
    // 页面隐藏时停止轮询以节省资源
    this.stopWifiStatusPolling()
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
  height: 88rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.wifi-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #FF9A56 0%, #EE781F 100%);
}

.content {
  padding: 32rpx 24rpx;
}

.cards-container {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 200rpx 0;

  .loading-spinner {
    display: flex;
    gap: 8rpx;
    margin-bottom: 20rpx;

    .spinner-ring {
      width: 12rpx;
      height: 12rpx;
      background: #ffffff;
      border-radius: 50%;
      animation: bounce 1.4s infinite ease-in-out both;

      &:nth-child(1) {
        animation-delay: -0.32s;
      }

      &:nth-child(2) {
        animation-delay: -0.16s;
      }
    }
  }

  .loading-text {
    font-size: 28rpx;
    color: #ffffff;
  }
}

@keyframes bounce {
  0%, 80%, 100% {
    transform: scale(0);
    opacity: 0.5;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
}

.wifi-card {
  background: #ffffff;
  border-radius: 24rpx;
  padding: 60rpx 40rpx;
  box-shadow: 0 8rpx 24rpx rgba(238, 120, 31, 0.15);
  margin-bottom: 24rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.wifi-icon {
  position: relative;
  width: 120rpx;
  height: 120rpx;
  margin-bottom: 40rpx;
  display: flex;
  justify-content: center;
  align-items: center;

  .icon-bg {
    width: 100%;
    height: 100%;
    background: #EE781F;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 2;
    box-shadow: 0 8rpx 16rpx rgba(238, 120, 31, 0.3);
  }

  .pulse-ring {
    position: absolute;
    top: -10rpx;
    left: -10rpx;
    right: -10rpx;
    bottom: -10rpx;
    border: 4rpx solid #EE781F;
    border-radius: 50%;
    opacity: 0;
    animation: pulse 2s infinite;
    z-index: 1;
  }
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 0.5;
  }
  100% {
    transform: scale(1.5);
    opacity: 0;
  }
}

.hotel-name {
  text-align: center;
  margin-bottom: 48rpx;
  padding: 0 20rpx;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;

  .main-name {
    font-size: 36rpx;
    font-weight: bold;
    color: #333;
    margin-bottom: 8rpx;
    line-height: 1.4;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    overflow: hidden;
    word-break: break-all;
  }

  .sub-name {
    font-size: 28rpx;
    color: #666;
    margin-bottom: 12rpx;
    font-weight: normal;
  }

  .welcome-text {
    font-size: 26rpx;
    color: #999;
    font-weight: normal;
    margin-top: 4rpx;
  }
}

.connect-section {
  width: 100%;
  margin-top: 0;
}

.connect-btn {
  width: 100%;
  height: 88rpx;
  background: linear-gradient(135deg, #FF9A56 0%, #EE781F 100%);
  border-radius: 44rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32rpx;
  color: #ffffff;
  font-weight: 500;
  box-shadow: 0 8rpx 20rpx rgba(238, 120, 31, 0.25);
  transition: all 0.3s;

  &.connecting {
    opacity: 0.8;
  }

  &.connected {
    background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
    box-shadow: 0 8rpx 20rpx rgba(76, 175, 80, 0.25);
    cursor: default;
  }

  .btn-loading {
    margin-right: 16rpx;

    .btn-spinner {
      width: 36rpx;
      height: 36rpx;
      border: 3rpx solid rgba(255, 255, 255, 0.3);
      border-top-color: #ffffff;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }
  }

  .connected-icon {
    margin-right: 12rpx;
    font-size: 36rpx;
    font-weight: bold;
  }

  &:active:not(.connected) {
    transform: scale(0.98);
    box-shadow: 0 4rpx 10rpx rgba(238, 120, 31, 0.25);
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* 红包卡片样式 */
.coupon-card {
  background: linear-gradient(135deg, #FFE8D6 0%, #FFD4B3 100%);
  border-radius: 24rpx;
  padding: 32rpx;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -50rpx;
    right: -50rpx;
    width: 200rpx;
    height: 200rpx;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 50%;
  }

  .coupon-header {
    display: flex;
    align-items: center;
    margin-bottom: 24rpx;

    .coupon-icon {
      font-size: 48rpx;
      margin-right: 16rpx;
    }

    .coupon-title {
      flex: 1;

      .title-text {
        display: block;
        font-size: 30rpx;
        font-weight: 600;
        color: #333;
        margin-bottom: 8rpx;
      }

      .subtitle-text {
        display: block;
        font-size: 22rpx;
        color: #666;
      }
    }
  }

  .coupon-content {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    margin-bottom: 20rpx;

    .coupon-amount {
      display: flex;
      align-items: baseline;

      .amount-symbol {
        font-size: 32rpx;
        font-weight: 600;
        color: #EE781F;
        margin-right: 4rpx;
      }

      .amount-value {
        font-size: 64rpx;
        font-weight: 700;
        color: #EE781F;
        line-height: 1;
      }
    }

    .coupon-desc {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      padding-bottom: 8rpx;

      .desc-tag {
        font-size: 22rpx;
        color: #EE781F;
        background: rgba(238, 120, 31, 0.1);
        padding: 4rpx 12rpx;
        border-radius: 8rpx;
        margin-bottom: 8rpx;
      }
    }
  }

  .coupon-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 12rpx;
    margin-bottom: 24rpx;

    .tag {
      font-size: 20rpx;
      color: #666;
      background: rgba(0, 0, 0, 0.05);
      padding: 6rpx 16rpx;
      border-radius: 8rpx;
    }
  }

  .coupon-btn {
    width: 100%;
    height: 72rpx;
    background: #EE781F;
    border-radius: 36rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28rpx;
    color: #ffffff;
    font-weight: 500;
    box-shadow: 0 8rpx 16rpx rgba(238, 120, 31, 0.3);
    transition: all 0.3s;

    &:active {
      transform: scale(0.98);
      box-shadow: 0 4rpx 8rpx rgba(238, 120, 31, 0.3);
    }
  }
}

.empty-container {
  padding: 200rpx 0;
}
</style>

<style lang="scss" scoped>
.btn-disabled {
  background: #ccc !important;
  box-shadow: none !important;
}
</style>
