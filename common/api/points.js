const { http } = uni.$u

/**
 * 积分商城API接口
 */

// ==================== 商品相关 ====================

/**
 * 查询商品列表
 * @param {Object} params - 查询参数
 * @param {Number} params.categoryId - 分类ID(可选)
 * @param {String} params.keyword - 搜索关键词(可选)
 * @param {Number} params.pageNum - 页码
 * @param {Number} params.pageSize - 每页数量
 */
export const getProductList = (params, config = {}) => {
    return http.get('/hotel-points/app/products/list', { params, ...config })
}

/**
 * 查询商品详情
 * @param {Number} id - 商品ID
 */
export const getProductDetail = (id, config = {}) => {
    return http.get(`/hotel-points/app/products/${id}`, { ...config })
}

/**
 * 查询分类树
 */
export const getCategoryTree = (config = {}) => {
    return http.get('/hotel-points/app/products/categories/tree', { ...config })
}

// ==================== 库存相关 ====================

/**
 * 查询SKU在各门店的库存情况
 * @param {Number} skuId - SKU ID
 */
export const getStoreStockBySkuId = (skuId, config = {}) => {
    return http.get(`/hotel-points/app/stock/stores/${skuId}`, { ...config })
}

// ==================== 订单相关 ====================

/**
 * 创建兑换订单
 * @param {Object} data - 订单数据
 * @param {Number} data.skuId - SKU ID
 * @param {Number} data.quantity - 兑换数量
 * @param {Number} data.storeId - 自提门店ID
 * @param {String} data.contactName - 联系人姓名
 * @param {String} data.contactPhone - 联系人手机号
 */
export const createExchangeOrder = (data, config = {}) => {
    return http.post('/hotel-points/app/orders/create', data, { ...config })
}

/**
 * 支付订单
 * @param {Number} orderId - 订单ID
 */
export const payExchangeOrder = (orderId, config = {}) => {
    return http.post(`/hotel-points/app/orders/${orderId}/pay`, {}, { ...config })
}

/**
 * 取消订单
 * @param {Number} orderId - 订单ID
 */
export const cancelExchangeOrder = (orderId, config = {}) => {
    return http.post(`/hotel-points/app/orders/${orderId}/cancel`, {}, { ...config })
}

/**
 * 查询订单列表
 * @param {Object} params - 查询参数
 * @param {String} params.status - 订单状态(可选)
 * @param {Number} params.pageNum - 页码
 * @param {Number} params.pageSize - 每页数量
 */
export const getExchangeOrderList = (params, config = {}) => {
    return http.get('/hotel-points/app/orders/list', { params, ...config })
}

/**
 * 查询订单详情
 * @param {Number} orderId - 订单ID
 */
export const getExchangeOrderDetail = (orderId, config = {}) => {
    return http.get(`/hotel-points/app/orders/${orderId}`, { ...config })
}

// ==================== 会员积分相关 ====================

/**
 * 查询会员积分余额
 */
export const getMemberPoints = (config = {}) => {
    return http.get('/hotel-member/member/points', { ...config })
}

/**
 * 查询会员信息
 */
export const getMemberInfo = (config = {}) => {
    return http.get('/hotel-member/member/getInfo', { ...config })
}
