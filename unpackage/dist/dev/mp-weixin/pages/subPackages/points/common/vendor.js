(global["webpackJsonp"] = global["webpackJsonp"] || []).push([["pages/subPackages/points/common/vendor"],{

/***/ 721:
/*!******************************************************************************!*\
  !*** /Users/zqs/workSpace/zxd_member2/pages/subPackages/points/api/index.js ***!
  \******************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ 4);
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.payPointsOrder = exports.getStoreStockBySkuId = exports.getProductList = exports.getProductDetail = exports.getPointsOrderList = exports.getPointsOrderDetail = exports.getMemberPoints = exports.getMemberInfo = exports.getCategoryTree = exports.createPointsOrder = exports.cancelPointsOrder = void 0;
var _defineProperty2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/defineProperty */ 11));
var _index = _interopRequireDefault(__webpack_require__(/*! @/util/request/index.js */ 163));
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
// ==================== 商品相关 ====================

/**
 * 查询商品列表
 * @param {Object} params - 查询参数
 * @param {string} params.keyword - 搜索关键词
 * @param {number} params.categoryId - 分类ID
 * @param {number} params.pageNum - 页码
 * @param {number} params.pageSize - 每页数量
 */
var getProductList = function getProductList(params) {
  var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return _index.default.get('/hotel-points/app/products/list', _objectSpread({
    params: params
  }, config));
};

/**
 * 查询商品详情
 * @param {number} id - 商品ID
 */
exports.getProductList = getProductList;
var getProductDetail = function getProductDetail(id) {
  var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return _index.default.get("/hotel-points/app/products/".concat(id), _objectSpread({}, config));
};

/**
 * 查询分类树
 */
exports.getProductDetail = getProductDetail;
var getCategoryTree = function getCategoryTree() {
  var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return _index.default.get('/hotel-points/app/products/categories/tree', _objectSpread({}, config));
};

// ==================== 库存相关 ====================

/**
 * 查询SKU在各门店的库存情况
 * @param {number} skuId - SKU ID
 */
exports.getCategoryTree = getCategoryTree;
var getStoreStockBySkuId = function getStoreStockBySkuId(skuId) {
  var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return _index.default.get("/hotel-points/app/stock/stores/".concat(skuId), _objectSpread({}, config));
};

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
exports.getStoreStockBySkuId = getStoreStockBySkuId;
var createPointsOrder = function createPointsOrder(params) {
  var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return _index.default.post('/hotel-points/app/orders/create', _objectSpread(_objectSpread({}, params), config));
};

/**
 * 支付订单
 * @param {number} id - 订单ID
 */
exports.createPointsOrder = createPointsOrder;
var payPointsOrder = function payPointsOrder(id) {
  var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return _index.default.post("/hotel-points/app/orders/".concat(id, "/pay"), {}, _objectSpread({}, config));
};

/**
 * 取消订单
 * @param {number} id - 订单ID
 */
exports.payPointsOrder = payPointsOrder;
var cancelPointsOrder = function cancelPointsOrder(id) {
  var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return _index.default.post("/hotel-points/app/orders/".concat(id, "/cancel"), {}, _objectSpread({}, config));
};

/**
 * 查询订单列表
 * @param {Object} params - 查询参数
 * @param {string} params.status - 订单状态
 * @param {number} params.pageNum - 页码
 * @param {number} params.pageSize - 每页数量
 */
exports.cancelPointsOrder = cancelPointsOrder;
var getPointsOrderList = function getPointsOrderList(params) {
  var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return _index.default.get('/hotel-points/app/orders/list', _objectSpread({
    params: params
  }, config));
};

/**
 * 查询订单详情
 * @param {number} id - 订单ID
 */
exports.getPointsOrderList = getPointsOrderList;
var getPointsOrderDetail = function getPointsOrderDetail(id) {
  var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return _index.default.get("/hotel-points/app/orders/".concat(id), _objectSpread({}, config));
};

// ==================== 会员积分相关 ====================

/**
 * 查询会员积分余额
 */
exports.getPointsOrderDetail = getPointsOrderDetail;
var getMemberPoints = function getMemberPoints() {
  var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return _index.default.get('/hotel-member/member/points', _objectSpread({}, config));
};

/**
 * 查询会员信息
 */
exports.getMemberPoints = getMemberPoints;
var getMemberInfo = function getMemberInfo() {
  var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return _index.default.get('/hotel-member/member/getInfo', _objectSpread({}, config));
};
exports.getMemberInfo = getMemberInfo;

/***/ })

}]);
//# sourceMappingURL=../../../../../.sourcemap/mp-weixin/pages/subPackages/points/common/vendor.js.map