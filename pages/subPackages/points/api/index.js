/**
 * 积分商城 API
 * 放在分包目录下，减小主包体积
 */

const { http } = uni.$u

// ==================== 商品相关 ====================

/**
 * 查询商品列表
 * @param {Object} params - 查询参数
 * @param {string} params.keyword - 搜索关键词
 * @param {number} params.categoryId - 分类ID
 * @param {number} params.pageNum - 页码
 * @param {number} params.pageSize - 每页数量
 */
export const getProductList = (params, config = {}) => {
  return http.get('/hotel-points/app/products/list', { params, ...config })
}

/**
 * 查询商品详情
 * @param {number} id - 商品ID
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
 * @param {number} skuId - SKU ID
 */
export const getStoreStockBySkuId = (skuId, config = {}) => {
  return http.get(`/hotel-points/app/stock/stores/${skuId}`, { ...config })
}

// ==================== 订单相关 ====================

/**
 * 创建兑换订单
 * @param {Object} params - 订单参数
 * @param {number} params.skuId - SKU ID
 * @param {number} params.quantity - 数量
 * @param {number} params.storeId - 门店ID
 * @param {string} params.recipientName - 收货人姓名
 * @param {string} params.recipientPhone - 收货人电话
 */
export const createPointsOrder = (params, config = {}) => {
  return http.post('/hotel-points/app/orders/create', params, config)
}

/**
 * 支付订单
 * @param {number} id - 订单ID
 */
export const payPointsOrder = (id, config = {}) => {
  return http.post(`/hotel-points/app/orders/${id}/pay`, {}, { ...config })
}

/**
 * 取消订单
 * @param {number} id - 订单ID
 */
export const cancelPointsOrder = (id, config = {}) => {
  return http.post(`/hotel-points/app/orders/${id}/cancel`, {}, { ...config })
}

/**
 * 查询订单列表
 * @param {Object} params - 查询参数
 * @param {string} params.status - 订单状态
 * @param {number} params.pageNum - 页码
 * @param {number} params.pageSize - 每页数量
 */
export const getPointsOrderList = (params, config = {}) => {
  return http.get('/hotel-points/app/orders/list', { params, ...config })
}

/**
 * 查询订单详情
 * @param {number} id - 订单ID
 */
export const getPointsOrderDetail = (id, config = {}) => {
  return http.get(`/hotel-points/app/orders/${id}`, { ...config })
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
