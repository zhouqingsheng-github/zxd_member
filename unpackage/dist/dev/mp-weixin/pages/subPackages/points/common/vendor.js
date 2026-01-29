(global["webpackJsonp"] = global["webpackJsonp"] || []).push([["pages/subPackages/points/common/vendor"],{

/***/ 499:
/*!****************************************************************!*\
  !*** /Users/zqs/workSpace/zxd/zxd_member/common/api/points.js ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(uni) {

var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ 4);
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.payExchangeOrder = exports.getStoreStockBySkuId = exports.getProductList = exports.getProductDetail = exports.getMemberPoints = exports.getMemberInfo = exports.getExchangeOrderList = exports.getExchangeOrderDetail = exports.getCategoryTree = exports.createExchangeOrder = exports.cancelExchangeOrder = void 0;
var _defineProperty2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/defineProperty */ 11));
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
var http = uni.$u.http;

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
var getProductList = function getProductList(params) {
  var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return http.get('/hotel-points/app/products/list', _objectSpread({
    params: params
  }, config));
};

/**
 * 查询商品详情
 * @param {Number} id - 商品ID
 */
exports.getProductList = getProductList;
var getProductDetail = function getProductDetail(id) {
  var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return http.get("/hotel-points/app/products/".concat(id), _objectSpread({}, config));
};

/**
 * 查询分类树
 */
exports.getProductDetail = getProductDetail;
var getCategoryTree = function getCategoryTree() {
  var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return http.get('/hotel-points/app/products/categories/tree', _objectSpread({}, config));
};

// ==================== 库存相关 ====================

/**
 * 查询SKU在各门店的库存情况
 * @param {Number} skuId - SKU ID
 */
exports.getCategoryTree = getCategoryTree;
var getStoreStockBySkuId = function getStoreStockBySkuId(skuId) {
  var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return http.get("/hotel-points/app/stock/stores/".concat(skuId), _objectSpread({}, config));
};

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
exports.getStoreStockBySkuId = getStoreStockBySkuId;
var createExchangeOrder = function createExchangeOrder(data) {
  var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return http.post('/hotel-points/app/orders/create', data, _objectSpread({}, config));
};

/**
 * 支付订单
 * @param {Number} orderId - 订单ID
 */
exports.createExchangeOrder = createExchangeOrder;
var payExchangeOrder = function payExchangeOrder(orderId) {
  var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return http.post("/hotel-points/app/orders/".concat(orderId, "/pay"), {}, _objectSpread({}, config));
};

/**
 * 取消订单
 * @param {Number} orderId - 订单ID
 */
exports.payExchangeOrder = payExchangeOrder;
var cancelExchangeOrder = function cancelExchangeOrder(orderId) {
  var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return http.post("/hotel-points/app/orders/".concat(orderId, "/cancel"), {}, _objectSpread({}, config));
};

/**
 * 查询订单列表
 * @param {Object} params - 查询参数
 * @param {String} params.status - 订单状态(可选)
 * @param {Number} params.pageNum - 页码
 * @param {Number} params.pageSize - 每页数量
 */
exports.cancelExchangeOrder = cancelExchangeOrder;
var getExchangeOrderList = function getExchangeOrderList(params) {
  var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return http.get('/hotel-points/app/orders/list', _objectSpread({
    params: params
  }, config));
};

/**
 * 查询订单详情
 * @param {Number} orderId - 订单ID
 */
exports.getExchangeOrderList = getExchangeOrderList;
var getExchangeOrderDetail = function getExchangeOrderDetail(orderId) {
  var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return http.get("/hotel-points/app/orders/".concat(orderId), _objectSpread({}, config));
};

// ==================== 会员积分相关 ====================

/**
 * 查询会员积分余额
 */
exports.getExchangeOrderDetail = getExchangeOrderDetail;
var getMemberPoints = function getMemberPoints() {
  var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return http.get('/hotel-member/member/points', _objectSpread({}, config));
};

/**
 * 查询会员信息
 */
exports.getMemberPoints = getMemberPoints;
var getMemberInfo = function getMemberInfo() {
  var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return http.get('/hotel-member/member/getInfo', _objectSpread({}, config));
};
exports.getMemberInfo = getMemberInfo;
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/index.js */ 2)["default"]))

/***/ })

}]);
//# sourceMappingURL=../../../../../.sourcemap/mp-weixin/pages/subPackages/points/common/vendor.js.map