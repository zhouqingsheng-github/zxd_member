(global["webpackJsonp"] = global["webpackJsonp"] || []).push([["pages/subPackages/order/index"],{

/***/ 268:
/*!***********************************************************************************************!*\
  !*** /Users/zqs/workSpace/zxd_member2/main.js?{"page":"pages%2FsubPackages%2Forder%2Findex"} ***!
  \***********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(wx, createPage) {

var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ 4);
__webpack_require__(/*! uni-pages */ 26);
var _vue = _interopRequireDefault(__webpack_require__(/*! vue */ 25));
var _index = _interopRequireDefault(__webpack_require__(/*! ./pages/subPackages/order/index.vue */ 269));
// @ts-ignore
wx.__webpack_require_UNI_MP_PLUGIN__ = __webpack_require__;
createPage(_index.default);
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/wx.js */ 1)["default"], __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/index.js */ 2)["createPage"]))

/***/ }),

/***/ 269:
/*!**************************************************************************!*\
  !*** /Users/zqs/workSpace/zxd_member2/pages/subPackages/order/index.vue ***!
  \**************************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _index_vue_vue_type_template_id_a06635b4_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./index.vue?vue&type=template&id=a06635b4&scoped=true& */ 270);
/* harmony import */ var _index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./index.vue?vue&type=script&lang=js& */ 272);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__[key]; }) }(__WEBPACK_IMPORT_KEY__));
/* harmony import */ var _index_vue_vue_type_style_index_0_id_a06635b4_scoped_true_lang_scss___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./index.vue?vue&type=style&index=0&id=a06635b4&scoped=true&lang=scss& */ 274);
/* harmony import */ var _Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../../../../Applications/HBuilderX.app/Contents/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/runtime/componentNormalizer.js */ 38);

var renderjs





/* normalize component */

var component = Object(_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _index_vue_vue_type_template_id_a06635b4_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"],
  _index_vue_vue_type_template_id_a06635b4_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  "a06635b4",
  null,
  false,
  _index_vue_vue_type_template_id_a06635b4_scoped_true___WEBPACK_IMPORTED_MODULE_0__["components"],
  renderjs
)

component.options.__file = "pages/subPackages/order/index.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ 270:
/*!*********************************************************************************************************************!*\
  !*** /Users/zqs/workSpace/zxd_member2/pages/subPackages/order/index.vue?vue&type=template&id=a06635b4&scoped=true& ***!
  \*********************************************************************************************************************/
/*! exports provided: render, staticRenderFns, recyclableRender, components */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_17_0_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_index_vue_vue_type_template_id_a06635b4_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../../Applications/HBuilderX.app/Contents/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../../../../Applications/HBuilderX.app/Contents/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--17-0!../../../../../../../Applications/HBuilderX.app/Contents/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/webpack-uni-mp-loader/lib/template.js!../../../../../../../Applications/HBuilderX.app/Contents/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-uni-app-loader/page-meta.js!../../../../../../../Applications/HBuilderX.app/Contents/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!../../../../../../../Applications/HBuilderX.app/Contents/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!./index.vue?vue&type=template&id=a06635b4&scoped=true& */ 271);
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_17_0_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_index_vue_vue_type_template_id_a06635b4_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_17_0_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_index_vue_vue_type_template_id_a06635b4_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "recyclableRender", function() { return _Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_17_0_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_index_vue_vue_type_template_id_a06635b4_scoped_true___WEBPACK_IMPORTED_MODULE_0__["recyclableRender"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "components", function() { return _Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_17_0_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_index_vue_vue_type_template_id_a06635b4_scoped_true___WEBPACK_IMPORTED_MODULE_0__["components"]; });



/***/ }),

/***/ 271:
/*!*********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--17-0!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/template.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-uni-app-loader/page-meta.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!/Users/zqs/workSpace/zxd_member2/pages/subPackages/order/index.vue?vue&type=template&id=a06635b4&scoped=true& ***!
  \*********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns, recyclableRender, components */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return staticRenderFns; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "recyclableRender", function() { return recyclableRender; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "components", function() { return components; });
var components
try {
  components = {
    uniNavBar: function () {
      return __webpack_require__.e(/*! import() | uni_modules/uni-nav-bar/components/uni-nav-bar/uni-nav-bar */ "uni_modules/uni-nav-bar/components/uni-nav-bar/uni-nav-bar").then(__webpack_require__.bind(null, /*! @/uni_modules/uni-nav-bar/components/uni-nav-bar/uni-nav-bar.vue */ 550))
    },
    uniIcons: function () {
      return Promise.all(/*! import() | uni_modules/uni-icons/components/uni-icons/uni-icons */[__webpack_require__.e("common/vendor"), __webpack_require__.e("uni_modules/uni-icons/components/uni-icons/uni-icons")]).then(__webpack_require__.bind(null, /*! @/uni_modules/uni-icons/components/uni-icons/uni-icons.vue */ 680))
    },
  }
} catch (e) {
  if (
    e.message.indexOf("Cannot find module") !== -1 &&
    e.message.indexOf(".vue") !== -1
  ) {
    console.error(e.message)
    console.error("1. 排查组件名称拼写是否正确")
    console.error(
      "2. 排查组件是否符合 easycom 规范，文档：https://uniapp.dcloud.net.cn/collocation/pages?id=easycom"
    )
    console.error(
      "3. 若组件不符合 easycom 规范，需手动引入，并在 components 中注册该组件"
    )
  } else {
    throw e
  }
}
var render = function () {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  var m0 = !_vm.loading ? _vm.formatDateIn(_vm.orderData.checkInDate) : null
  var m1 = !_vm.loading ? _vm.getWeekDay(_vm.orderData.checkInDate) : null
  var m2 = !_vm.loading ? _vm.calculateNights() : null
  var m3 = !_vm.loading ? _vm.formatDate(_vm.orderData.checkOutDate) : null
  var m4 = !_vm.loading ? _vm.getWeekDay(_vm.orderData.checkOutDate) : null
  var m5 = !_vm.loading && !_vm.type ? _vm.calculateNights() : null
  var g0 =
    !_vm.loading && !_vm.type
      ? _vm.feeDetailExpand &&
        _vm.orderData.roomFeeDetails &&
        _vm.orderData.roomFeeDetails.length
      : null
  var l0 =
    !_vm.loading && !_vm.type && g0
      ? _vm.__map(_vm.groupedFeeDetailsByDate, function (item, __i0__) {
          var $orig = _vm.__get_orig(item)
          var g1 = item.actualPrice.toFixed(2)
          var g2 =
            item.discountSharing > 0 ||
            item.originalPrice - item.discountPrice > 0
              ? item.discountDescription.toFixed(2)
              : null
          return {
            $orig: $orig,
            g1: g1,
            g2: g2,
          }
        })
      : null
  var g3 =
    !_vm.loading && !_vm.type
      ? _vm.couponList.length > 0 && _vm.orderData.redPacketDiscount >= 0
      : null
  var g4 = !_vm.loading && !_vm.type && !g3 ? _vm.couponList.length : null
  var g5 = !_vm.loading && !_vm.type && !g3 ? _vm.couponList.length : null
  var g6 = !_vm.loading && !_vm.type && !g3 ? _vm.couponList.length : null
  var g7 = !_vm.loading ? _vm.orderData.totalAmount.toFixed(2) : null
  var l1 =
    _vm.showCouponPopup && !_vm.loading
      ? _vm.__map(_vm.couponList, function (coupon, __i1__) {
          var $orig = _vm.__get_orig(coupon)
          var m6 = _vm.formatDateRed(coupon.redPacket.startTime)
          var m7 = _vm.formatDateRed(coupon.redPacket.endTime)
          return {
            $orig: $orig,
            m6: m6,
            m7: m7,
          }
        })
      : null
  if (!_vm._isMounted) {
    _vm.e0 = function ($event) {
      _vm.feeDetailExpand = !_vm.feeDetailExpand
    }
    _vm.e1 = function ($event) {
      _vm.couponList.length > 0 ? _vm.onCouponClick : null
    }
    _vm.e2 = function ($event) {
      _vm.agreeChecked && _vm.submitOrder()
    }
    _vm.e3 = function ($event) {
      _vm.showCalendar = false
    }
  }
  _vm.$mp.data = Object.assign(
    {},
    {
      $root: {
        m0: m0,
        m1: m1,
        m2: m2,
        m3: m3,
        m4: m4,
        m5: m5,
        g0: g0,
        l0: l0,
        g3: g3,
        g4: g4,
        g5: g5,
        g6: g6,
        g7: g7,
        l1: l1,
      },
    }
  )
}
var recyclableRender = false
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ 272:
/*!***************************************************************************************************!*\
  !*** /Users/zqs/workSpace/zxd_member2/pages/subPackages/order/index.vue?vue&type=script&lang=js& ***!
  \***************************************************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../../Applications/HBuilderX.app/Contents/HBuilderX/plugins/uniapp-cli/node_modules/babel-loader/lib!../../../../../../../Applications/HBuilderX.app/Contents/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--13-1!../../../../../../../Applications/HBuilderX.app/Contents/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/webpack-uni-mp-loader/lib/script.js!../../../../../../../Applications/HBuilderX.app/Contents/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!../../../../../../../Applications/HBuilderX.app/Contents/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!./index.vue?vue&type=script&lang=js& */ 273);
/* harmony import */ var _Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));
 /* harmony default export */ __webpack_exports__["default"] = (_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ 273:
/*!**********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--13-1!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/script.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!/Users/zqs/workSpace/zxd_member2/pages/subPackages/order/index.vue?vue&type=script&lang=js& ***!
  \**********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(uni) {

var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ 4);
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _regenerator = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/regenerator */ 30));
var _slicedToArray2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/slicedToArray */ 5));
var _asyncToGenerator2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/asyncToGenerator */ 32));
var _defineProperty2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/defineProperty */ 11));
var _api = __webpack_require__(/*! ../../../common/api */ 173);
var _redirect = __webpack_require__(/*! ../../../common/redirect */ 35);
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
var HotelCalendar = function HotelCalendar() {
  __webpack_require__.e(/*! require.ensure | components/HotelCalendar */ "components/HotelCalendar").then((function () {
    return resolve(__webpack_require__(/*! @/components/HotelCalendar.vue */ 572));
  }).bind(null, __webpack_require__)).catch(__webpack_require__.oe);
};
var _default = {
  components: {
    HotelCalendar: HotelCalendar
  },
  data: function data() {
    var _orderData;
    return {
      showZeroToSixPrompt: false,
      // 决定着是否提示凌晨了
      iChoseEarlyMorning: false,
      //决定了用户是否选择了凌晨如果选择了 则需要在显示上进行加1
      type_order: 0,
      cutoffTime: '06:00',
      thirdOrderId: null,
      thirdRoomName: null,
      type: false,
      loading: true,
      // 添加加载状态
      // 订单数据
      orderData: (_orderData = {
        hotelId: 1,
        hotelName: "",
        hotelAddress: "",
        roomTypeId: 1,
        roomTypeName: "",
        roomCount: 2,
        checkInDate: "",
        checkOutDate: "",
        contactName: "",
        contactPhone: "",
        arrivalTime: "",
        guestList: [],
        roomFee: 0,
        memberDiscount: 0,
        redPacketDiscount: 0,
        redPacketId: null,
        totalAmount: 0,
        paymentMethod: 1,
        avgNightPrice: '0.00',
        deductOrderId: null,
        limitTimeDiscount: 0,
        threePartyDeduction: 0
      }, (0, _defineProperty2.default)(_orderData, "threePartyDeduction", 0), (0, _defineProperty2.default)(_orderData, "totalOriginalPrice", 0), (0, _defineProperty2.default)(_orderData, "saleMode", 0), _orderData),
      dailyPrices: [],
      // 添加存储每天价格的数组
      // UI控制数据
      arriveTimes: ['14:00-16:00', '16:00-18:00', '18:00-20:00', '20:00-22:00', '次日00:00-06:00'],
      arriveIndex: 0,
      chineseNumbers: ['①', '②', '③', '④', '⑤', '⑥', '⑦', '⑧', '⑨', '⑩'],
      lateArriveChecked: false,
      agreeChecked: false,
      showCouponPopup: false,
      // 控制优惠券弹窗显示
      selectedCouponId: null,
      // 临时选中的优惠券id
      couponList: [],
      first: false,
      showCalendar: false,
      feeDetailExpand: false // 新增：控制费用明细展开/收起
    };
  },

  computed: {
    // 到店时间行数组
    arriveTimesRows: function arriveTimesRows() {
      var rowLength = 3;
      var rows = [];
      for (var i = 0; i < this.arriveTimes.length; i += rowLength) {
        rows.push(this.arriveTimes.slice(i, i + rowLength));
      }
      return rows;
    },
    groupedFeeDetailsByDate: function groupedFeeDetailsByDate() {
      if (!Array.isArray(this.orderData.roomFeeDetails)) return [];
      var map = {};
      this.orderData.roomFeeDetails.forEach(function (item) {
        var key = item.date;
        if (!map[key]) {
          map[key] = {
            date: item.date,
            actualPrice: 0,
            discountSharing: 0,
            discountPrice: 0,
            originalPrice: 0,
            discountDescription: 0,
            count: 0
          };
        }
        map[key].actualPrice += Number(item.actualPrice || 0);
        map[key].discountSharing += Number(item.discountSharing || 0);
        map[key].discountPrice += Number(item.discountPrice || 0);
        map[key].originalPrice += Number(item.originalPrice || 0);
        map[key].discountDescription += Number(item.discountSharing || 0) + (item.originalPrice - item.discountPrice);
        map[key].count += 1;
      });
      return Object.values(map);
    }
  },
  onLoad: function onLoad(options) {
    var _this = this;
    return (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee() {
      return _regenerator.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              // 设置状态栏为黑色
              uni.setNavigationBarColor({
                frontColor: '#000000',
                backgroundColor: '#FFFFFF'
              });
              _context.next = 3;
              return (0, _api.getCutoffTime)();
            case 3:
              _this.cutoffTime = _context.sent;
              _this.first = true;
              // 记录第三方订单ID
              _this.type_order = options.type;
              _this.thirdOrderId = options.thirdOrderId;
              _this.thirdRoomName = options.thirdRoomName;
              _this.type = Boolean(_this.thirdOrderId);
              _context.next = 11;
              return _this.loadOrderDataFromParams(options);
            case 11:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }))();
  },
  methods: {
    formatDateIn: function formatDateIn(dateStr) {
      if (!dateStr) return '';
      var date = new Date(dateStr);
      if (this.iChoseEarlyMorning) {
        date.setDate(date.getDate() + 1);
      }
      var month = (date.getMonth() + 1).toString().padStart(2, '0');
      var day = date.getDate().toString().padStart(2, '0');
      return "".concat(month, "\u6708").concat(day, "\u65E5");
    },
    formatDate: function formatDate(dateStr) {
      if (!dateStr) return '';
      var date = new Date(dateStr);
      var month = (date.getMonth() + 1).toString().padStart(2, '0');
      var day = date.getDate().toString().padStart(2, '0');
      return "".concat(month, "\u6708").concat(day, "\u65E5");
    },
    formatDateRed: function formatDateRed(dateStr) {
      if (!dateStr) return '';
      var date = new Date(dateStr);
      var month = (date.getMonth() + 1).toString().padStart(2, '0');
      var day = date.getDate().toString().padStart(2, '0');
      var year = date.getFullYear().toString();
      return "".concat(year, ".").concat(month, ".").concat(day);
    },
    // 从页面参数和缓存中加载订单数据
    loadOrderDataFromParams: function loadOrderDataFromParams(options) {
      var _this2 = this;
      return (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee2() {
        var searchParams, hotelRoomDetailData, orderId, historyCheckInPerson;
        return _regenerator.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.prev = 0;
                // 从缓存中获取搜索参数（首页选择的时间和床位数）
                searchParams = uni.getStorageSync('searchParams');
                _this2.showZeroToSixPrompt = searchParams.showZeroToSixPrompt;
                _this2.iChoseEarlyMorning = searchParams.iChoseEarlyMorning;
                _context2.next = 6;
                return (0, _api.getRoomInfo)(options.id);
              case 6:
                hotelRoomDetailData = _context2.sent;
                // 根据订单信息获取历史入住用户信息
                orderId = options.orderId;
                _context2.next = 10;
                return (0, _api.getHistoryCheckInPerson)(orderId);
              case 10:
                historyCheckInPerson = _context2.sent;
                if (searchParams) {
                  _this2.orderData.checkInDate = searchParams.checkIn;
                  _this2.orderData.checkOutDate = searchParams.checkOut;
                  _this2.orderData.roomCount = searchParams.bedCount || 1;
                }
                if (orderId) {
                  _this2.orderData.roomCount = historyCheckInPerson.length;
                }
                _this2.orderData.guestList = historyCheckInPerson;
                _this2.orderData.contactPhone = historyCheckInPerson[0].phone;
                if (hotelRoomDetailData) {
                  _this2.orderData.hotelId = hotelRoomDetailData.hotelId;
                  _this2.orderData.hotelName = hotelRoomDetailData.hotelName;
                  _this2.orderData.hotelAddress = hotelRoomDetailData.hotelAddress;
                  _this2.orderData.roomTypeId = hotelRoomDetailData.id;
                  _this2.orderData.roomTypeName = _this2.type ? _this2.thirdRoomName : hotelRoomDetailData.name;
                  _this2.orderData.roomFee = hotelRoomDetailData.currentPrice;
                  _this2.orderData.saleMode = hotelRoomDetailData.saleMode;
                }
                // 重新计算总金额
                _context2.next = 18;
                return _this2.recalculateTotal();
              case 18:
                // 确保入住人列表与床位数量同步
                _this2.syncGuestList();
                _context2.next = 21;
                return _this2.fetchCouponList();
              case 21:
                _context2.next = 26;
                break;
              case 23:
                _context2.prev = 23;
                _context2.t0 = _context2["catch"](0);
                console.error('获取订单数据失败:', _context2.t0);
              case 26:
                _context2.prev = 26;
                // 数据加载完成后，隐藏加载状态
                _this2.loading = false;
                return _context2.finish(26);
              case 29:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, null, [[0, 23, 26, 29]]);
      }))();
    },
    // 同步入住人列表与床位数量
    syncGuestList: function syncGuestList() {
      var roomCount = this.orderData.roomCount;
      var currentGuestCount = this.orderData.guestList.length;
      if (currentGuestCount < roomCount) {
        // 如果入住人数少于床位数，补充空的入住人
        for (var i = currentGuestCount; i < roomCount; i++) {
          this.orderData.guestList.push({
            guestName: ''
          });
        }
      } else if (currentGuestCount > roomCount) {
        // 如果入住人数多于床位数，删除多余的入住人
        this.orderData.guestList = this.orderData.guestList.slice(0, roomCount);
      }
    },
    goBack: function goBack() {
      (0, _redirect.pageBack)();
    },
    changeBed: function changeBed(val) {
      var _this3 = this;
      return (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee3() {
        var next;
        return _regenerator.default.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                next = _this3.orderData.roomCount + val;
                if (!(_this3.type || next < 1 || next > 10)) {
                  _context3.next = 3;
                  break;
                }
                return _context3.abrupt("return");
              case 3:
                _this3.orderData.roomCount = next;
                // 重新计算价格
                _context3.next = 6;
                return _this3.recalculateTotal();
              case 6:
                // 联动更新入住人列表
                _this3.syncGuestList();
                // 同步更新searchParams缓存，保证返回首页时床位数一致
                _this3.updateSearchParams();
              case 8:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3);
      }))();
    },
    // 同步更新searchParams缓存
    updateSearchParams: function updateSearchParams() {
      try {
        var searchParams = uni.getStorageSync('searchParams');
        if (searchParams) {
          searchParams.bedCount = this.orderData.roomCount;
          searchParams.checkIn = this.orderData.checkInDate;
          searchParams.checkOut = this.orderData.checkOutDate;
          searchParams.nights = this.calculateNights();
          uni.setStorageSync('searchParams', searchParams);
        }
      } catch (e) {
        console.error('更新searchParams失败:', e);
      }
    },
    // 选择支付方式
    selectPayMethod: function selectPayMethod(method) {
      this.orderData.paymentMethod = method;
    },
    // 获取星期几
    getWeekDay: function getWeekDay(dateStr) {
      if (!dateStr) return '';
      var date = new Date(dateStr);
      var weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
      return weekDays[date.getDay()];
    },
    // 计算住宿天数
    calculateNights: function calculateNights() {
      if (!this.orderData.checkInDate || !this.orderData.checkOutDate) return 0;
      var checkIn = new Date(this.orderData.checkInDate);
      var checkOut = new Date(this.orderData.checkOutDate);
      return Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    },
    // 重新计算总金额
    recalculateTotal: function recalculateTotal() {
      var _this4 = this;
      return (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee4() {
        var params, result, sum;
        return _regenerator.default.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.prev = 0;
                params = {
                  type: _this4.type_order,
                  hotelId: _this4.orderData.hotelId,
                  roomTypeId: _this4.orderData.roomTypeId,
                  roomCount: _this4.orderData.roomCount,
                  checkInDate: _this4.orderData.checkInDate,
                  checkOutDate: _this4.orderData.checkOutDate,
                  redPacketId: _this4.orderData.redPacketId
                };
                if (_this4.type) {
                  delete params.redPacketId;
                }
                _context4.next = 5;
                return (0, _api.calculateThePrice)(params);
              case 5:
                result = _context4.sent;
                if (result) {
                  _this4.orderData.roomFee = result.totalAmount;
                  _this4.orderData.totalOriginalPrice = result.totalOriginalPrice;
                  _this4.orderData.limitTimeDiscount = result.limitTimeDiscount || 0;
                  _this4.orderData.totalAmount = result.payableAmount;
                  if (_this4.type) {
                    _this4.orderData.totalAmount = 0;
                    _this4.orderData.deductOrderId = _this4.thirdOrderId;
                  }
                  _this4.orderData.threePartyDeduction = result.totalOriginalPrice;
                  _this4.orderData.memberDiscount = result.memberDiscount;
                  _this4.orderData.redPacketDiscount = result.redPacketDiscount;
                  _this4.$set(_this4.orderData, 'roomFeeDetails', result.roomFeeDetails || []);
                  // 直接计算平均每晚
                  if (Array.isArray(result.roomFeeDetails) && result.roomFeeDetails.length) {
                    sum = result.roomFeeDetails.reduce(function (acc, cur) {
                      return acc + Number(cur.actualPrice || 0);
                    }, 0);
                    _this4.orderData.avgNightPrice = (sum / result.roomFeeDetails.length).toFixed(2);
                  } else {
                    _this4.orderData.avgNightPrice = '0.00';
                  }
                }
                _context4.next = 13;
                break;
              case 9:
                _context4.prev = 9;
                _context4.t0 = _context4["catch"](0);
                console.error('计算价格失败:', _context4.t0);
                uni.showToast({
                  title: '计算价格失败',
                  icon: 'none'
                });
              case 13:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, null, [[0, 9]]);
      }))();
    },
    fetchCouponList: function fetchCouponList() {
      var _this5 = this;
      return (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee5() {
        var params, list, firstCoupon;
        return _regenerator.default.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                _context5.prev = 0;
                params = {
                  hotelId: _this5.orderData.hotelId,
                  roomId: _this5.orderData.roomTypeId,
                  amount: _this5.orderData.roomFee,
                  days: _this5.calculateNights(),
                  checkInDate: _this5.orderData.checkInDate,
                  type: _this5.type_order
                };
                _context5.next = 4;
                return (0, _api.getAvailableRedEnvelopeList)(params);
              case 4:
                list = _context5.sent;
                // 不再过滤红包金额
                _this5.couponList = Array.isArray(list) ? list : [];
                // 如果第一次加载且未选中红包，自动选中第一个
                if (!(_this5.couponList.length > 0 && _this5.first)) {
                  _context5.next = 15;
                  break;
                }
                _this5.first = false;
                firstCoupon = _this5.couponList[0];
                _this5.orderData.redPacketId = firstCoupon.id;
                _this5.selectedCouponId = firstCoupon.id;
                // 重新计算价格
                _context5.next = 13;
                return _this5.recalculateTotal();
              case 13:
                _context5.next = 20;
                break;
              case 15:
                if (!(_this5.couponList.length === 0)) {
                  _context5.next = 20;
                  break;
                }
                // 如果没有可用红包，清除红包信息
                _this5.orderData.redPacketId = null;
                _this5.selectedCouponId = null;
                // 重新计算价格
                _context5.next = 20;
                return _this5.recalculateTotal();
              case 20:
                _context5.next = 29;
                break;
              case 22:
                _context5.prev = 22;
                _context5.t0 = _context5["catch"](0);
                _this5.couponList = [];
                // 发生错误时清除红包信息
                _this5.orderData.redPacketId = null;
                _this5.selectedCouponId = null;
                _context5.next = 29;
                return _this5.recalculateTotal();
              case 29:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5, null, [[0, 22]]);
      }))();
    },
    // 修改红包确认方法
    onCouponConfirm: function onCouponConfirm() {
      var _this6 = this;
      return (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee6() {
        var selected;
        return _regenerator.default.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                // 只有点击确定才真正应用
                selected = _this6.couponList.find(function (c) {
                  return c.id === _this6.selectedCouponId;
                });
                if (selected) {
                  _this6.orderData.redPacketId = selected.id;
                } else {
                  _this6.orderData.redPacketId = null;
                }
                // 重新计算价格
                _context6.next = 4;
                return _this6.recalculateTotal();
              case 4:
                _this6.showCouponPopup = false;
              case 5:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6);
      }))();
    },
    // 修改日期选择确认方法
    onCalendarConfirm: function onCalendarConfirm(dates) {
      var _this7 = this;
      return (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee7() {
        var _dates$detail, checkIn, checkOut, nights;
        return _regenerator.default.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                if (!(dates && dates.detail && dates.detail.length === 3)) {
                  _context7.next = 10;
                  break;
                }
                _dates$detail = (0, _slicedToArray2.default)(dates.detail, 3), checkIn = _dates$detail[0], checkOut = _dates$detail[1], nights = _dates$detail[2];
                _this7.orderData.checkInDate = checkIn;
                _this7.orderData.checkOutDate = checkOut;
                // 重新计算价格
                _context7.next = 6;
                return _this7.recalculateTotal();
              case 6:
                _context7.next = 8;
                return _this7.fetchCouponList();
              case 8:
                _this7.showCalendar = false;
                // 同步更新searchParams缓存，保证返回首页时床位数一致
                _this7.updateSearchParams();
              case 10:
              case "end":
                return _context7.stop();
            }
          }
        }, _callee7);
      }))();
    },
    validatePhone: function validatePhone() {
      var phoneRegex = /^1[3-9]\d{9}$/;
      if (!this.orderData.contactPhone) {
        uni.showToast({
          title: '请输入手机号',
          icon: 'none'
        });
        return false;
      }
      if (!phoneRegex.test(this.orderData.contactPhone)) {
        uni.showToast({
          title: '请输入正确的手机号',
          icon: 'none'
        });
        return false;
      }
      return true;
    },
    onSelectDate: function onSelectDate() {
      this.showCalendar = true;
    },
    onCouponClick: function onCouponClick() {
      // 打开弹窗时，临时选中当前已用红包
      this.selectedCouponId = this.orderData.redPacketId;
      this.showCouponPopup = true;
    },
    // 选择优惠券
    onCouponSelect: function onCouponSelect(id) {
      this.selectedCouponId = id;
    },
    // 取消选择优惠券
    onCouponCancel: function onCouponCancel() {
      // 恢复之前的选择
      this.selectedCouponId = this.orderData.redPacketId;
      this.showCouponPopup = false;
    },
    submitOrder: function submitOrder() {
      var _this8 = this;
      return (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee8() {
        var orderParams, orderResult, payResult;
        return _regenerator.default.wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                _context8.prev = 0;
                if (!(_this8.orderData.guestList.some(function (guest) {
                  return !guest.guestName;
                }) || !_this8.orderData.contactPhone)) {
                  _context8.next = 4;
                  break;
                }
                uni.showToast({
                  title: '请填写完整入住人信息',
                  icon: 'none'
                });
                return _context8.abrupt("return");
              case 4:
                // 显示加载提示
                uni.showLoading({
                  title: '正在创建订单...',
                  mask: true
                });

                // 准备订单数据
                orderParams = _objectSpread(_objectSpread({}, _this8.orderData), {}, {
                  type: _this8.type_order,
                  arrivalTime: _this8.arriveTimes[_this8.arriveIndex],
                  lateArrival: _this8.lateArriveChecked ? 1 : 0
                }); // 创建订单
                _context8.next = 8;
                return (0, _api.createOrder)(orderParams).catch(function (error) {
                  throw new Error(error.error || error.msg || '创建订单失败');
                });
              case 8:
                orderResult = _context8.sent;
                if (!(orderResult.totalAmount === 0)) {
                  _context8.next = 13;
                  break;
                }
                uni.hideLoading();
                uni.redirectTo({
                  url: "/pages/subPackages/order/paySuccess?id=".concat(orderResult.id)
                });
                return _context8.abrupt("return");
              case 13:
                _context8.next = 15;
                return (0, _api.placeAnOrder)(orderResult.id, orderParams.paymentMethod).catch(function (error) {
                  throw new Error(error.error || error.msg || '支付失败');
                });
              case 15:
                payResult = _context8.sent;
                // 隐藏加载提示
                uni.hideLoading();
                // 根据支付方式拉起对应的支付
                if (orderParams.paymentMethod === 1) {
                  // 微信支付
                  uni.requestPayment(_objectSpread(_objectSpread({
                    provider: 'wxpay'
                  }, payResult.payParams), {}, {
                    success: function success(res) {
                      uni.redirectTo({
                        url: "/pages/subPackages/order/paySuccess?id=".concat(orderResult.id)
                      });
                    },
                    fail: function fail(err) {
                      uni.showLoading({
                        title: '正在跳转...'
                      });
                      uni.switchTab({
                        url: '/pages/order/index'
                      });
                    }
                  }));
                } else {
                  // 支付宝支付
                  uni.showToast({
                    title: '该支付方式暂不支持！',
                    icon: 'none'
                  });
                }
                _context8.next = 24;
                break;
              case 20:
                _context8.prev = 20;
                _context8.t0 = _context8["catch"](0);
                uni.hideLoading();
                uni.showToast({
                  title: _context8.t0.message || '订单创建失败',
                  icon: 'none'
                });
              case 24:
              case "end":
                return _context8.stop();
            }
          }
        }, _callee8, null, [[0, 20]]);
      }))();
    },
    toggleAgree: function toggleAgree() {
      this.agreeChecked = !this.agreeChecked;
    },
    goToBookingNotice: function goToBookingNotice() {
      uni.navigateTo({
        url: '/pages/subPackages/agreement/bookingNotice'
      });
    },
    goToPaymentAgreement: function goToPaymentAgreement() {
      uni.navigateTo({
        url: '/pages/subPackages/agreement/paymentAgreement'
      });
    }
  }
};
exports.default = _default;
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/index.js */ 2)["default"]))

/***/ }),

/***/ 274:
/*!************************************************************************************************************************************!*\
  !*** /Users/zqs/workSpace/zxd_member2/pages/subPackages/order/index.vue?vue&type=style&index=0&id=a06635b4&scoped=true&lang=scss& ***!
  \************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_8_oneOf_1_0_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_8_oneOf_1_1_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_8_oneOf_1_2_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_3_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_sass_loader_dist_cjs_js_ref_8_oneOf_1_4_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_8_oneOf_1_5_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_index_vue_vue_type_style_index_0_id_a06635b4_scoped_true_lang_scss___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../../Applications/HBuilderX.app/Contents/HBuilderX/plugins/uniapp-cli/node_modules/mini-css-extract-plugin/dist/loader.js??ref--8-oneOf-1-0!../../../../../../../Applications/HBuilderX.app/Contents/HBuilderX/plugins/uniapp-cli/node_modules/css-loader/dist/cjs.js??ref--8-oneOf-1-1!../../../../../../../Applications/HBuilderX.app/Contents/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/loaders/stylePostLoader.js!../../../../../../../Applications/HBuilderX.app/Contents/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--8-oneOf-1-2!../../../../../../../Applications/HBuilderX.app/Contents/HBuilderX/plugins/uniapp-cli/node_modules/postcss-loader/src??ref--8-oneOf-1-3!../../../../../../../Applications/HBuilderX.app/Contents/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/sass-loader/dist/cjs.js??ref--8-oneOf-1-4!../../../../../../../Applications/HBuilderX.app/Contents/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--8-oneOf-1-5!../../../../../../../Applications/HBuilderX.app/Contents/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!../../../../../../../Applications/HBuilderX.app/Contents/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!./index.vue?vue&type=style&index=0&id=a06635b4&scoped=true&lang=scss& */ 275);
/* harmony import */ var _Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_8_oneOf_1_0_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_8_oneOf_1_1_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_8_oneOf_1_2_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_3_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_sass_loader_dist_cjs_js_ref_8_oneOf_1_4_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_8_oneOf_1_5_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_index_vue_vue_type_style_index_0_id_a06635b4_scoped_true_lang_scss___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_8_oneOf_1_0_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_8_oneOf_1_1_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_8_oneOf_1_2_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_3_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_sass_loader_dist_cjs_js_ref_8_oneOf_1_4_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_8_oneOf_1_5_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_index_vue_vue_type_style_index_0_id_a06635b4_scoped_true_lang_scss___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_8_oneOf_1_0_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_8_oneOf_1_1_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_8_oneOf_1_2_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_3_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_sass_loader_dist_cjs_js_ref_8_oneOf_1_4_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_8_oneOf_1_5_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_index_vue_vue_type_style_index_0_id_a06635b4_scoped_true_lang_scss___WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_8_oneOf_1_0_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_8_oneOf_1_1_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_8_oneOf_1_2_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_3_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_sass_loader_dist_cjs_js_ref_8_oneOf_1_4_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_8_oneOf_1_5_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_index_vue_vue_type_style_index_0_id_a06635b4_scoped_true_lang_scss___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));
 /* harmony default export */ __webpack_exports__["default"] = (_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_8_oneOf_1_0_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_8_oneOf_1_1_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_8_oneOf_1_2_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_3_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_sass_loader_dist_cjs_js_ref_8_oneOf_1_4_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_8_oneOf_1_5_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_index_vue_vue_type_style_index_0_id_a06635b4_scoped_true_lang_scss___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ 275:
/*!****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/mini-css-extract-plugin/dist/loader.js??ref--8-oneOf-1-0!./node_modules/css-loader/dist/cjs.js??ref--8-oneOf-1-1!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--8-oneOf-1-2!./node_modules/postcss-loader/src??ref--8-oneOf-1-3!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/sass-loader/dist/cjs.js??ref--8-oneOf-1-4!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--8-oneOf-1-5!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!/Users/zqs/workSpace/zxd_member2/pages/subPackages/order/index.vue?vue&type=style&index=0&id=a06635b4&scoped=true&lang=scss& ***!
  \****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin
    if(false) { var cssReload; }
  

/***/ })

},[[268,"common/runtime","common/vendor"]]]);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/subPackages/order/index.js.map