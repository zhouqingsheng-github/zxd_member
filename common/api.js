const { http } = uni.$u
import upload from './upload'

// 文件上传
export const uploadFile = (filePath, options) => upload.uploadFile(filePath, options)
export const uploadFiles = (filePaths, options) => upload.uploadFiles(filePaths, options)
export const chooseAndUploadImage = (options) => upload.chooseAndUploadImage(options)

// 首页酒店列表 只查询上架的
export const fetchHotelList = (params, status = 1, config = {}) => http.get('/hotel-stores/hotels/list', {
    params: {
        ...params,
        status
    }, ...config
});

// 首页酒店列表分页查询 只查询上架的
export const fetchHotelListByPage = (params, status = 1, config = {}) => http.get('/hotel-stores/hotels/list/page', {
    params: {
        ...params,
        status
    }, ...config
});

// 酒店详细
export const fetchHotelDetail = (params, config = {}) => http.get(`/hotel-stores/hotels/all/${params.id}`, { params: { ...params }, ...config });

// 酒店详细根据POIID
export const fetchHotelDetailByPoiId = (id, config = {}) => http.get(`/hotel-stores/hotels/poiId/${id}`, { ...config });

// 购买会员
export const openAMembership = (params, config = {}) => http.get('/hotel-member/order/placeAnOrder', { params: { ...params }, ...config });

// 查询会员订单支付情况
export const memberOrder = (orderNo, config = {}) => http.get(`/hotel-member/order/info/${orderNo}`, { ...config });

// 我的红包
export const myRedEnvelope = (params, config = {}) => http.get('/hotel-promotion/promotion/red-packet/record/myRedEnvelope', { params, ...config });

// 我的红包
export const receivingCenter = (params, config = {}) => http.get('/hotel-promotion/promotion/red-packet/receiving-center', { params, ...config });

// WiFi优惠券列表(业务场景为扫码连接Wi-Fi的红包)
export const getWifiCoupons = (params, config = {}) => http.get('/hotel-promotion/promotion/red-packet/wifi/coupons', { params, ...config });

// 查询领取券的基本信息
export const exampleCouponInfo = (id, config = {}) => http.get(`/hotel-promotion/promotion/red-packet/record/${id}`, { ...config });

// 领取好友赠送的红包
export const receive = (id, config = {}) => http.get(`/hotel-promotion/promotion/red-packet/record/gift/receive/${id}`, { ...config });

// 领取红包
export const receiveRedEnvelope = (id, config = {}) => http.get(`/hotel-promotion/promotion/red-packet/record/receive/${id}`, { ...config });

// 订单列表
export const getOrderList = (params, config = {}) => http.post('/hotel-order/hotel/order/user', { ...params, ...config });

export const notWrittenOff = (params, config = {}) => http.post('/hotel-order/hotel/order/user/notWrittenOff', { ...params, ...config });

// 订单详情
export const getOrderDetail = (id, config = {}) => http.get(`/hotel-order/hotel/order/detail/${id}`, { ...config });

// 取消订单
export const cancelOrder = (id, config = {}) => http.get(`/hotel-order/hotel/order/cancel/${id}`, {}, { ...config });

// 退款
export const refundOrder = (id, config = {}) => http.post(`/hotel-order/refund/customer/refund/${id}`, {}, { ...config });

// 删除订单
export const deleteOrder = (id, config = {}) => http.get(`/hotel-order/hotel/order/userDelete/${id}`, { ...config });

// 创建订单
export const createOrder = (params, config = {}) => http.post('/hotel-order/hotel/order/create', { ...params, ...config });

// 费用计算
export const calculateThePrice = (params, config = {}) => http.post('/hotel-order/hotel/order/calculateThePrice', { ...params, ...config });

// 房型预定下单
export const placeAnOrder = (orderId, paymentMethod, config = {}) => http.get(`/hotel-order/hotel/order/pay/${orderId}?paymentMethod=${paymentMethod}`, { ...config });
// 再次支付
export const payRetry = (orderNo, config = {}) => http.get(`/hotel-order/hotel/order/pay/retry?orderNo=${orderNo}`, { ...config });
// 获取房型
export const getRoomInfo = (id, config = {}) => http.get(`/hotel-stores/hotel-rooms/${id}`, { ...config });

// 可用红包列表
export const getAvailableRedEnvelopeList = (params, config = {}) => http.post('/hotel-order/hotel/order/redPackets/available', { ...params, ...config });

// 酒店图片列表
export const getHotelImages = (id, config = {}) => http.get(`/hotel-stores/hotel-images/hotel/${id}`, { ...config });

// 酒店房型图片列表
export const getRoomImages = (id, config = {}) => http.get(`/hotel-stores/hotel-room-images/room/${id}`, { ...config });

// 酒店地址搜索
export const searchHotels = (params, config = {}) => http.get('/hotel-stores/hotels/search/location', { params, ...config });

// 房型每天的价格
export const getRoomPrices = (params, roomId, config = {}) => http.get(`/hotel-stores/hotel-room-prices//room/${roomId}`, { params, ...config });

// 用户账号注销
export const logOutOfAccount = (config = {}) => http.delete('/hotel-member/member/logout', { ...config });

// 会员权益
export const rightsList = (config = {}) => http.get('/hotel-member/member/rights/list', { ...config });

// 获取节假日
export const getHolidays = (yearMonths, config = {}) => http.get('/hotel-stores/hotels/holidays', {
    params: {
        yearMonths: yearMonths.join(',')
    },
    ...config
});

// 获取会员价格配置
export const getMemberPriceConfig = (config = {}) => http.get('/hotel-member/member/price/config', { ...config });

// 创建分享记录
export const createShareRecord = (config = {}) => http.post('/hotel-member/share/create', { ...config });

// 领取分享
export const claimShare = (recordId, config = {}) => http.post(`/hotel-member/share/claim/${recordId}`, { ...config });

// 查询用户分享记录列表
export const getShareRecordList = (config = {}) => http.get('/hotel-member/share/list', { ...config });

// 查询用户是否还能分享
export const canUserShare = (config = {}) => http.get('/hotel-member/share/canShare', { ...config });

// 统计用户成功分享次数
export const countSuccessShares = (config = {}) => http.get('/hotel-member/share/count', { ...config });

// 获取分享明细
export const getShareDetail = (recordId, config = {}) => http.get(`/hotel-member/share/detail/${recordId}`, { ...config });

// C端我的页面菜单项
export const activeItem = (recordId, config = {}) => http.get('/hotel-system/system/menuitem/active', { ...config });

// 获取订单事件时间信息
export const getOrderEventTime = (orderId, config = {}) => http.get(`/hotel-order/order/events/order/${orderId}`, { ...config });

// 退款申请前校验
export const validateRefund = (orderId, config = {}) => http.post(`/hotel-order/refund/customer/refund/validate/${orderId}`, { ...config });

// 获取酒店价格日历
export const lowestPriceCalendar = (params, config = {}) => http.get('/hotel-stores/hotels/getLowestPriceCalendar', { params: { ...params }, ...config });

// 广告装修
export const getAdvertisingDecoration = (config = {}) => http.get('/hotel-system/adcolumn/list', {
    ...config, params: {
        status: 0
    }
});

// 弹窗装修
export const getPopupDecoration = (config = {}) => http.get('/hotel-system/popup-ad/active-list', {})

// 高德key
export const gaodeKey = (config = {}) => http.get('/hotel-system/config/amap/get')

// 获取历史入住人信息
export const getHistoryCheckInPerson = (orderId, config = {}) => http.get('/hotel-order/hotel/order/getUserInfo', {
    ...config, params: {
        orderId
    }
});

// 记录访问量
export const channelRecordVisit = (id, params, config = {}) => http.get(`/hotel-member/channel/visit/${id}`, {
    ...config,
    params: { ...params }
});

// 获取第三方订单详细
export const getThirdOrderDetail = (orderNo, config = {}) => http.get(`/hotel-order/thirdPartyOrder/detail?orderNo=${orderNo}`, { ...config });

// 获取凌晨时间
export const getCutoffTime = (orderNo, config = {}) => http.get('/hotel-stores/hotels/cutoffTime');

// 提交问卷
export const submitQuestionnaire = (params, config = {}) => http.post('/hotel-system/questionnaire/submit', { ...params, ...config });

// ==================== 积分商城相关接口 ====================

// 查询商品列表
export const getProductList = (params, config = {}) => http.get('/hotel-points/app/products/list', { params, ...config });

// 查询商品详情
export const getProductDetail = (id, config = {}) => http.get(`/hotel-points/app/products/${id}`, { ...config });

// 查询分类树
export const getCategoryTree = (config = {}) => http.get('/hotel-points/app/products/categories/tree', { ...config });

// 查询SKU在各门店的库存情况
export const getStoreStockBySkuId = (skuId, config = {}) => http.get(`/hotel-points/app/stock/stores/${skuId}`, { ...config });

// 创建兑换订单
export const createPointsOrder = (params, config = {}) => http.post('/hotel-points/app/orders/create', { ...params, ...config });

// 支付订单
export const payPointsOrder = (id, config = {}) => http.post(`/hotel-points/app/orders/${id}/pay`, {}, { ...config });

// 取消订单
export const cancelPointsOrder = (id, config = {}) => http.post(`/hotel-points/app/orders/${id}/cancel`, {}, { ...config });

// 查询订单列表
export const getPointsOrderList = (params, config = {}) => http.get('/hotel-points/app/orders/list', { params, ...config });

// 查询订单详情
export const getPointsOrderDetail = (id, config = {}) => http.get(`/hotel-points/app/orders/${id}`, { ...config });
