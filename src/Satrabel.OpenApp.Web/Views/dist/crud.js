/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "dist/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = vendor_0e98fe12f6ccbfa6d995;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(0))(2);

/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["a"] = ({
    props: ['title']
});

/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_element_ui__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_element_ui___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_element_ui__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_element_ui_lib_theme_chalk_index_css__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_element_ui_lib_theme_chalk_index_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_element_ui_lib_theme_chalk_index_css__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_element_ui_lib_locale_lang_en__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_element_ui_lib_locale_lang_en___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_element_ui_lib_locale_lang_en__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_vuecrud__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_vuecrud___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_vuecrud__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__layout_vue__ = __webpack_require__(8);





__WEBPACK_IMPORTED_MODULE_0_vue__["default"].use(__WEBPACK_IMPORTED_MODULE_1_element_ui___default.a, { locale: __WEBPACK_IMPORTED_MODULE_3_element_ui_lib_locale_lang_en___default.a });




__WEBPACK_IMPORTED_MODULE_4_vuecrud___default.a.createApp('#app', __WEBPACK_IMPORTED_MODULE_5__layout_vue__["a" /* default */]);

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(0))(67);

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(0))(151);

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.default = {
  el: {
    colorpicker: {
      confirm: 'OK',
      clear: 'Clear'
    },
    datepicker: {
      now: 'Now',
      today: 'Today',
      cancel: 'Cancel',
      clear: 'Clear',
      confirm: 'OK',
      selectDate: 'Select date',
      selectTime: 'Select time',
      startDate: 'Start Date',
      startTime: 'Start Time',
      endDate: 'End Date',
      endTime: 'End Time',
      prevYear: 'Previous Year',
      nextYear: 'Next Year',
      prevMonth: 'Previous Month',
      nextMonth: 'Next Month',
      year: '',
      month1: 'January',
      month2: 'February',
      month3: 'March',
      month4: 'April',
      month5: 'May',
      month6: 'June',
      month7: 'July',
      month8: 'August',
      month9: 'September',
      month10: 'October',
      month11: 'November',
      month12: 'December',
      // week: 'week',
      weeks: {
        sun: 'Sun',
        mon: 'Mon',
        tue: 'Tue',
        wed: 'Wed',
        thu: 'Thu',
        fri: 'Fri',
        sat: 'Sat'
      },
      months: {
        jan: 'Jan',
        feb: 'Feb',
        mar: 'Mar',
        apr: 'Apr',
        may: 'May',
        jun: 'Jun',
        jul: 'Jul',
        aug: 'Aug',
        sep: 'Sep',
        oct: 'Oct',
        nov: 'Nov',
        dec: 'Dec'
      }
    },
    select: {
      loading: 'Loading',
      noMatch: 'No matching data',
      noData: 'No data',
      placeholder: 'Select'
    },
    cascader: {
      noMatch: 'No matching data',
      loading: 'Loading',
      placeholder: 'Select'
    },
    pagination: {
      goto: 'Go to',
      pagesize: '/page',
      total: 'Total {total}',
      pageClassifier: ''
    },
    messagebox: {
      title: 'Message',
      confirm: 'OK',
      cancel: 'Cancel',
      error: 'Illegal input'
    },
    upload: {
      deleteTip: 'press delete to remove',
      delete: 'Delete',
      preview: 'Preview',
      continue: 'Continue'
    },
    table: {
      emptyText: 'No Data',
      confirmFilter: 'Confirm',
      resetFilter: 'Reset',
      clearFilter: 'All',
      sumText: 'Sum'
    },
    tree: {
      emptyText: 'No Data'
    },
    transfer: {
      noMatch: 'No matching data',
      noData: 'No data',
      titles: ['List 1', 'List 2'], // to be translated
      filterPlaceholder: 'Enter keyword', // to be translated
      noCheckedFormat: '{total} items', // to be translated
      hasCheckedFormat: '{checked}/{total} checked' // to be translated
    }
  }
};

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

(function webpackUniversalModuleDefinition(root, factory) {
	if(true)
		module.exports = factory(__webpack_require__(1));
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["vuecrud"] = factory(require("vue"));
	else
		root["vuecrud"] = factory(root["Vue"]);
})((typeof self !== 'undefined' ? self : this), function(__WEBPACK_EXTERNAL_MODULE__8bbf__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "fb15");
/******/ })
/************************************************************************/
/******/ ({

/***/ "01f9":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var LIBRARY = __webpack_require__("2d00");
var $export = __webpack_require__("5ca1");
var redefine = __webpack_require__("2aba");
var hide = __webpack_require__("32e9");
var Iterators = __webpack_require__("84f2");
var $iterCreate = __webpack_require__("41a0");
var setToStringTag = __webpack_require__("7f20");
var getPrototypeOf = __webpack_require__("38fd");
var ITERATOR = __webpack_require__("2b4c")('iterator');
var BUGGY = !([].keys && 'next' in [].keys()); // Safari has buggy iterators w/o `next`
var FF_ITERATOR = '@@iterator';
var KEYS = 'keys';
var VALUES = 'values';

var returnThis = function () { return this; };

module.exports = function (Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED) {
  $iterCreate(Constructor, NAME, next);
  var getMethod = function (kind) {
    if (!BUGGY && kind in proto) return proto[kind];
    switch (kind) {
      case KEYS: return function keys() { return new Constructor(this, kind); };
      case VALUES: return function values() { return new Constructor(this, kind); };
    } return function entries() { return new Constructor(this, kind); };
  };
  var TAG = NAME + ' Iterator';
  var DEF_VALUES = DEFAULT == VALUES;
  var VALUES_BUG = false;
  var proto = Base.prototype;
  var $native = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT];
  var $default = $native || getMethod(DEFAULT);
  var $entries = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined;
  var $anyNative = NAME == 'Array' ? proto.entries || $native : $native;
  var methods, key, IteratorPrototype;
  // Fix native
  if ($anyNative) {
    IteratorPrototype = getPrototypeOf($anyNative.call(new Base()));
    if (IteratorPrototype !== Object.prototype && IteratorPrototype.next) {
      // Set @@toStringTag to native iterators
      setToStringTag(IteratorPrototype, TAG, true);
      // fix for some old engines
      if (!LIBRARY && typeof IteratorPrototype[ITERATOR] != 'function') hide(IteratorPrototype, ITERATOR, returnThis);
    }
  }
  // fix Array#{values, @@iterator}.name in V8 / FF
  if (DEF_VALUES && $native && $native.name !== VALUES) {
    VALUES_BUG = true;
    $default = function values() { return $native.call(this); };
  }
  // Define iterator
  if ((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])) {
    hide(proto, ITERATOR, $default);
  }
  // Plug for library
  Iterators[NAME] = $default;
  Iterators[TAG] = returnThis;
  if (DEFAULT) {
    methods = {
      values: DEF_VALUES ? $default : getMethod(VALUES),
      keys: IS_SET ? $default : getMethod(KEYS),
      entries: $entries
    };
    if (FORCED) for (key in methods) {
      if (!(key in proto)) redefine(proto, key, methods[key]);
    } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
  }
  return methods;
};


/***/ }),

/***/ "0a49":
/***/ (function(module, exports, __webpack_require__) {

// 0 -> Array#forEach
// 1 -> Array#map
// 2 -> Array#filter
// 3 -> Array#some
// 4 -> Array#every
// 5 -> Array#find
// 6 -> Array#findIndex
var ctx = __webpack_require__("9b43");
var IObject = __webpack_require__("626a");
var toObject = __webpack_require__("4bf8");
var toLength = __webpack_require__("9def");
var asc = __webpack_require__("cd1c");
module.exports = function (TYPE, $create) {
  var IS_MAP = TYPE == 1;
  var IS_FILTER = TYPE == 2;
  var IS_SOME = TYPE == 3;
  var IS_EVERY = TYPE == 4;
  var IS_FIND_INDEX = TYPE == 6;
  var NO_HOLES = TYPE == 5 || IS_FIND_INDEX;
  var create = $create || asc;
  return function ($this, callbackfn, that) {
    var O = toObject($this);
    var self = IObject(O);
    var f = ctx(callbackfn, that, 3);
    var length = toLength(self.length);
    var index = 0;
    var result = IS_MAP ? create($this, length) : IS_FILTER ? create($this, 0) : undefined;
    var val, res;
    for (;length > index; index++) if (NO_HOLES || index in self) {
      val = self[index];
      res = f(val, index, O);
      if (TYPE) {
        if (IS_MAP) result[index] = res;   // map
        else if (res) switch (TYPE) {
          case 3: return true;             // some
          case 5: return val;              // find
          case 6: return index;            // findIndex
          case 2: result.push(val);        // filter
        } else if (IS_EVERY) return false; // every
      }
    }
    return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : result;
  };
};


/***/ }),

/***/ "0d58":
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.14 / 15.2.3.14 Object.keys(O)
var $keys = __webpack_require__("ce10");
var enumBugKeys = __webpack_require__("e11e");

module.exports = Object.keys || function keys(O) {
  return $keys(O, enumBugKeys);
};


/***/ }),

/***/ "1169":
/***/ (function(module, exports, __webpack_require__) {

// 7.2.2 IsArray(argument)
var cof = __webpack_require__("2d95");
module.exports = Array.isArray || function isArray(arg) {
  return cof(arg) == 'Array';
};


/***/ }),

/***/ "11e9":
/***/ (function(module, exports, __webpack_require__) {

var pIE = __webpack_require__("52a7");
var createDesc = __webpack_require__("4630");
var toIObject = __webpack_require__("6821");
var toPrimitive = __webpack_require__("6a99");
var has = __webpack_require__("69a8");
var IE8_DOM_DEFINE = __webpack_require__("c69a");
var gOPD = Object.getOwnPropertyDescriptor;

exports.f = __webpack_require__("9e1e") ? gOPD : function getOwnPropertyDescriptor(O, P) {
  O = toIObject(O);
  P = toPrimitive(P, true);
  if (IE8_DOM_DEFINE) try {
    return gOPD(O, P);
  } catch (e) { /* empty */ }
  if (has(O, P)) return createDesc(!pIE.f.call(O, P), O[P]);
};


/***/ }),

/***/ "1495":
/***/ (function(module, exports, __webpack_require__) {

var dP = __webpack_require__("86cc");
var anObject = __webpack_require__("cb7c");
var getKeys = __webpack_require__("0d58");

module.exports = __webpack_require__("9e1e") ? Object.defineProperties : function defineProperties(O, Properties) {
  anObject(O);
  var keys = getKeys(Properties);
  var length = keys.length;
  var i = 0;
  var P;
  while (length > i) dP.f(O, P = keys[i++], Properties[P]);
  return O;
};


/***/ }),

/***/ "1eb2":
/***/ (function(module, exports, __webpack_require__) {

// This file is imported into lib/wc client bundles.

if (typeof window !== 'undefined') {
  var i
  if ((i = window.document.currentScript) && (i = i.src.match(/(.+\/)[^/]+\.js$/))) {
    __webpack_require__.p = i[1] // eslint-disable-line
  }
}


/***/ }),

/***/ "20d6":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// 22.1.3.9 Array.prototype.findIndex(predicate, thisArg = undefined)
var $export = __webpack_require__("5ca1");
var $find = __webpack_require__("0a49")(6);
var KEY = 'findIndex';
var forced = true;
// Shouldn't skip holes
if (KEY in []) Array(1)[KEY](function () { forced = false; });
$export($export.P + $export.F * forced, 'Array', {
  findIndex: function findIndex(callbackfn /* , that = undefined */) {
    return $find(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});
__webpack_require__("9c6c")(KEY);


/***/ }),

/***/ "230e":
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__("d3f4");
var document = __webpack_require__("7726").document;
// typeof document.createElement is 'object' in old IE
var is = isObject(document) && isObject(document.createElement);
module.exports = function (it) {
  return is ? document.createElement(it) : {};
};


/***/ }),

/***/ "2aba":
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__("7726");
var hide = __webpack_require__("32e9");
var has = __webpack_require__("69a8");
var SRC = __webpack_require__("ca5a")('src');
var TO_STRING = 'toString';
var $toString = Function[TO_STRING];
var TPL = ('' + $toString).split(TO_STRING);

__webpack_require__("8378").inspectSource = function (it) {
  return $toString.call(it);
};

(module.exports = function (O, key, val, safe) {
  var isFunction = typeof val == 'function';
  if (isFunction) has(val, 'name') || hide(val, 'name', key);
  if (O[key] === val) return;
  if (isFunction) has(val, SRC) || hide(val, SRC, O[key] ? '' + O[key] : TPL.join(String(key)));
  if (O === global) {
    O[key] = val;
  } else if (!safe) {
    delete O[key];
    hide(O, key, val);
  } else if (O[key]) {
    O[key] = val;
  } else {
    hide(O, key, val);
  }
// add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
})(Function.prototype, TO_STRING, function toString() {
  return typeof this == 'function' && this[SRC] || $toString.call(this);
});


/***/ }),

/***/ "2aeb":
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
var anObject = __webpack_require__("cb7c");
var dPs = __webpack_require__("1495");
var enumBugKeys = __webpack_require__("e11e");
var IE_PROTO = __webpack_require__("613b")('IE_PROTO');
var Empty = function () { /* empty */ };
var PROTOTYPE = 'prototype';

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var createDict = function () {
  // Thrash, waste and sodomy: IE GC bug
  var iframe = __webpack_require__("230e")('iframe');
  var i = enumBugKeys.length;
  var lt = '<';
  var gt = '>';
  var iframeDocument;
  iframe.style.display = 'none';
  __webpack_require__("fab2").appendChild(iframe);
  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
  // createDict = iframe.contentWindow.Object;
  // html.removeChild(iframe);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
  iframeDocument.close();
  createDict = iframeDocument.F;
  while (i--) delete createDict[PROTOTYPE][enumBugKeys[i]];
  return createDict();
};

module.exports = Object.create || function create(O, Properties) {
  var result;
  if (O !== null) {
    Empty[PROTOTYPE] = anObject(O);
    result = new Empty();
    Empty[PROTOTYPE] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO] = O;
  } else result = createDict();
  return Properties === undefined ? result : dPs(result, Properties);
};


/***/ }),

/***/ "2b4c":
/***/ (function(module, exports, __webpack_require__) {

var store = __webpack_require__("5537")('wks');
var uid = __webpack_require__("ca5a");
var Symbol = __webpack_require__("7726").Symbol;
var USE_SYMBOL = typeof Symbol == 'function';

var $exports = module.exports = function (name) {
  return store[name] || (store[name] =
    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
};

$exports.store = store;


/***/ }),

/***/ "2d00":
/***/ (function(module, exports) {

module.exports = false;


/***/ }),

/***/ "2d95":
/***/ (function(module, exports) {

var toString = {}.toString;

module.exports = function (it) {
  return toString.call(it).slice(8, -1);
};


/***/ }),

/***/ "32e9":
/***/ (function(module, exports, __webpack_require__) {

var dP = __webpack_require__("86cc");
var createDesc = __webpack_require__("4630");
module.exports = __webpack_require__("9e1e") ? function (object, key, value) {
  return dP.f(object, key, createDesc(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};


/***/ }),

/***/ "38fd":
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
var has = __webpack_require__("69a8");
var toObject = __webpack_require__("4bf8");
var IE_PROTO = __webpack_require__("613b")('IE_PROTO');
var ObjectProto = Object.prototype;

module.exports = Object.getPrototypeOf || function (O) {
  O = toObject(O);
  if (has(O, IE_PROTO)) return O[IE_PROTO];
  if (typeof O.constructor == 'function' && O instanceof O.constructor) {
    return O.constructor.prototype;
  } return O instanceof Object ? ObjectProto : null;
};


/***/ }),

/***/ "41a0":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var create = __webpack_require__("2aeb");
var descriptor = __webpack_require__("4630");
var setToStringTag = __webpack_require__("7f20");
var IteratorPrototype = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
__webpack_require__("32e9")(IteratorPrototype, __webpack_require__("2b4c")('iterator'), function () { return this; });

module.exports = function (Constructor, NAME, next) {
  Constructor.prototype = create(IteratorPrototype, { next: descriptor(1, next) });
  setToStringTag(Constructor, NAME + ' Iterator');
};


/***/ }),

/***/ "456d":
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.14 Object.keys(O)
var toObject = __webpack_require__("4bf8");
var $keys = __webpack_require__("0d58");

__webpack_require__("5eda")('keys', function () {
  return function keys(it) {
    return $keys(toObject(it));
  };
});


/***/ }),

/***/ "4588":
/***/ (function(module, exports) {

// 7.1.4 ToInteger
var ceil = Math.ceil;
var floor = Math.floor;
module.exports = function (it) {
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};


/***/ }),

/***/ "4630":
/***/ (function(module, exports) {

module.exports = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};


/***/ }),

/***/ "4bf8":
/***/ (function(module, exports, __webpack_require__) {

// 7.1.13 ToObject(argument)
var defined = __webpack_require__("be13");
module.exports = function (it) {
  return Object(defined(it));
};


/***/ }),

/***/ "52a7":
/***/ (function(module, exports) {

exports.f = {}.propertyIsEnumerable;


/***/ }),

/***/ "5537":
/***/ (function(module, exports, __webpack_require__) {

var core = __webpack_require__("8378");
var global = __webpack_require__("7726");
var SHARED = '__core-js_shared__';
var store = global[SHARED] || (global[SHARED] = {});

(module.exports = function (key, value) {
  return store[key] || (store[key] = value !== undefined ? value : {});
})('versions', []).push({
  version: core.version,
  mode: __webpack_require__("2d00") ? 'pure' : 'global',
  copyright: '© 2018 Denis Pushkarev (zloirock.ru)'
});


/***/ }),

/***/ "5ca1":
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__("7726");
var core = __webpack_require__("8378");
var hide = __webpack_require__("32e9");
var redefine = __webpack_require__("2aba");
var ctx = __webpack_require__("9b43");
var PROTOTYPE = 'prototype';

var $export = function (type, name, source) {
  var IS_FORCED = type & $export.F;
  var IS_GLOBAL = type & $export.G;
  var IS_STATIC = type & $export.S;
  var IS_PROTO = type & $export.P;
  var IS_BIND = type & $export.B;
  var target = IS_GLOBAL ? global : IS_STATIC ? global[name] || (global[name] = {}) : (global[name] || {})[PROTOTYPE];
  var exports = IS_GLOBAL ? core : core[name] || (core[name] = {});
  var expProto = exports[PROTOTYPE] || (exports[PROTOTYPE] = {});
  var key, own, out, exp;
  if (IS_GLOBAL) source = name;
  for (key in source) {
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    // export native or passed
    out = (own ? target : source)[key];
    // bind timers to global for call from export context
    exp = IS_BIND && own ? ctx(out, global) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
    // extend global
    if (target) redefine(target, key, out, type & $export.U);
    // export
    if (exports[key] != out) hide(exports, key, exp);
    if (IS_PROTO && expProto[key] != out) expProto[key] = out;
  }
};
global.core = core;
// type bitmap
$export.F = 1;   // forced
$export.G = 2;   // global
$export.S = 4;   // static
$export.P = 8;   // proto
$export.B = 16;  // bind
$export.W = 32;  // wrap
$export.U = 64;  // safe
$export.R = 128; // real proto method for `library`
module.exports = $export;


/***/ }),

/***/ "5dbc":
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__("d3f4");
var setPrototypeOf = __webpack_require__("8b97").set;
module.exports = function (that, target, C) {
  var S = target.constructor;
  var P;
  if (S !== C && typeof S == 'function' && (P = S.prototype) !== C.prototype && isObject(P) && setPrototypeOf) {
    setPrototypeOf(that, P);
  } return that;
};


/***/ }),

/***/ "5eda":
/***/ (function(module, exports, __webpack_require__) {

// most Object methods by ES6 should accept primitives
var $export = __webpack_require__("5ca1");
var core = __webpack_require__("8378");
var fails = __webpack_require__("79e5");
module.exports = function (KEY, exec) {
  var fn = (core.Object || {})[KEY] || Object[KEY];
  var exp = {};
  exp[KEY] = exec(fn);
  $export($export.S + $export.F * fails(function () { fn(1); }), 'Object', exp);
};


/***/ }),

/***/ "613b":
/***/ (function(module, exports, __webpack_require__) {

var shared = __webpack_require__("5537")('keys');
var uid = __webpack_require__("ca5a");
module.exports = function (key) {
  return shared[key] || (shared[key] = uid(key));
};


/***/ }),

/***/ "626a":
/***/ (function(module, exports, __webpack_require__) {

// fallback for non-array-like ES3 and non-enumerable old V8 strings
var cof = __webpack_require__("2d95");
// eslint-disable-next-line no-prototype-builtins
module.exports = Object('z').propertyIsEnumerable(0) ? Object : function (it) {
  return cof(it) == 'String' ? it.split('') : Object(it);
};


/***/ }),

/***/ "6821":
/***/ (function(module, exports, __webpack_require__) {

// to indexed object, toObject with fallback for non-array-like ES3 strings
var IObject = __webpack_require__("626a");
var defined = __webpack_require__("be13");
module.exports = function (it) {
  return IObject(defined(it));
};


/***/ }),

/***/ "69a8":
/***/ (function(module, exports) {

var hasOwnProperty = {}.hasOwnProperty;
module.exports = function (it, key) {
  return hasOwnProperty.call(it, key);
};


/***/ }),

/***/ "6a99":
/***/ (function(module, exports, __webpack_require__) {

// 7.1.1 ToPrimitive(input [, PreferredType])
var isObject = __webpack_require__("d3f4");
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
module.exports = function (it, S) {
  if (!isObject(it)) return it;
  var fn, val;
  if (S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  if (typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it))) return val;
  if (!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  throw TypeError("Can't convert object to primitive value");
};


/***/ }),

/***/ "7726":
/***/ (function(module, exports) {

// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self
  // eslint-disable-next-line no-new-func
  : Function('return this')();
if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef


/***/ }),

/***/ "77f1":
/***/ (function(module, exports, __webpack_require__) {

var toInteger = __webpack_require__("4588");
var max = Math.max;
var min = Math.min;
module.exports = function (index, length) {
  index = toInteger(index);
  return index < 0 ? max(index + length, 0) : min(index, length);
};


/***/ }),

/***/ "79e5":
/***/ (function(module, exports) {

module.exports = function (exec) {
  try {
    return !!exec();
  } catch (e) {
    return true;
  }
};


/***/ }),

/***/ "7f20":
/***/ (function(module, exports, __webpack_require__) {

var def = __webpack_require__("86cc").f;
var has = __webpack_require__("69a8");
var TAG = __webpack_require__("2b4c")('toStringTag');

module.exports = function (it, tag, stat) {
  if (it && !has(it = stat ? it : it.prototype, TAG)) def(it, TAG, { configurable: true, value: tag });
};


/***/ }),

/***/ "7f7f":
/***/ (function(module, exports, __webpack_require__) {

var dP = __webpack_require__("86cc").f;
var FProto = Function.prototype;
var nameRE = /^\s*function ([^ (]*)/;
var NAME = 'name';

// 19.2.4.2 name
NAME in FProto || __webpack_require__("9e1e") && dP(FProto, NAME, {
  configurable: true,
  get: function () {
    try {
      return ('' + this).match(nameRE)[1];
    } catch (e) {
      return '';
    }
  }
});


/***/ }),

/***/ "8378":
/***/ (function(module, exports) {

var core = module.exports = { version: '2.5.7' };
if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef


/***/ }),

/***/ "84f2":
/***/ (function(module, exports) {

module.exports = {};


/***/ }),

/***/ "86cc":
/***/ (function(module, exports, __webpack_require__) {

var anObject = __webpack_require__("cb7c");
var IE8_DOM_DEFINE = __webpack_require__("c69a");
var toPrimitive = __webpack_require__("6a99");
var dP = Object.defineProperty;

exports.f = __webpack_require__("9e1e") ? Object.defineProperty : function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPrimitive(P, true);
  anObject(Attributes);
  if (IE8_DOM_DEFINE) try {
    return dP(O, P, Attributes);
  } catch (e) { /* empty */ }
  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};


/***/ }),

/***/ "8b97":
/***/ (function(module, exports, __webpack_require__) {

// Works with __proto__ only. Old v8 can't work with null proto objects.
/* eslint-disable no-proto */
var isObject = __webpack_require__("d3f4");
var anObject = __webpack_require__("cb7c");
var check = function (O, proto) {
  anObject(O);
  if (!isObject(proto) && proto !== null) throw TypeError(proto + ": can't set as prototype!");
};
module.exports = {
  set: Object.setPrototypeOf || ('__proto__' in {} ? // eslint-disable-line
    function (test, buggy, set) {
      try {
        set = __webpack_require__("9b43")(Function.call, __webpack_require__("11e9").f(Object.prototype, '__proto__').set, 2);
        set(test, []);
        buggy = !(test instanceof Array);
      } catch (e) { buggy = true; }
      return function setPrototypeOf(O, proto) {
        check(O, proto);
        if (buggy) O.__proto__ = proto;
        else set(O, proto);
        return O;
      };
    }({}, false) : undefined),
  check: check
};


/***/ }),

/***/ "8bbf":
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE__8bbf__;

/***/ }),

/***/ "9093":
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)
var $keys = __webpack_require__("ce10");
var hiddenKeys = __webpack_require__("e11e").concat('length', 'prototype');

exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
  return $keys(O, hiddenKeys);
};


/***/ }),

/***/ "9b43":
/***/ (function(module, exports, __webpack_require__) {

// optional / simple context binding
var aFunction = __webpack_require__("d8e8");
module.exports = function (fn, that, length) {
  aFunction(fn);
  if (that === undefined) return fn;
  switch (length) {
    case 1: return function (a) {
      return fn.call(that, a);
    };
    case 2: return function (a, b) {
      return fn.call(that, a, b);
    };
    case 3: return function (a, b, c) {
      return fn.call(that, a, b, c);
    };
  }
  return function (/* ...args */) {
    return fn.apply(that, arguments);
  };
};


/***/ }),

/***/ "9c6c":
/***/ (function(module, exports, __webpack_require__) {

// 22.1.3.31 Array.prototype[@@unscopables]
var UNSCOPABLES = __webpack_require__("2b4c")('unscopables');
var ArrayProto = Array.prototype;
if (ArrayProto[UNSCOPABLES] == undefined) __webpack_require__("32e9")(ArrayProto, UNSCOPABLES, {});
module.exports = function (key) {
  ArrayProto[UNSCOPABLES][key] = true;
};


/***/ }),

/***/ "9def":
/***/ (function(module, exports, __webpack_require__) {

// 7.1.15 ToLength
var toInteger = __webpack_require__("4588");
var min = Math.min;
module.exports = function (it) {
  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};


/***/ }),

/***/ "9e1e":
/***/ (function(module, exports, __webpack_require__) {

// Thank's IE8 for his funny defineProperty
module.exports = !__webpack_require__("79e5")(function () {
  return Object.defineProperty({}, 'a', { get: function () { return 7; } }).a != 7;
});


/***/ }),

/***/ "aa77":
/***/ (function(module, exports, __webpack_require__) {

var $export = __webpack_require__("5ca1");
var defined = __webpack_require__("be13");
var fails = __webpack_require__("79e5");
var spaces = __webpack_require__("fdef");
var space = '[' + spaces + ']';
var non = '\u200b\u0085';
var ltrim = RegExp('^' + space + space + '*');
var rtrim = RegExp(space + space + '*$');

var exporter = function (KEY, exec, ALIAS) {
  var exp = {};
  var FORCE = fails(function () {
    return !!spaces[KEY]() || non[KEY]() != non;
  });
  var fn = exp[KEY] = FORCE ? exec(trim) : spaces[KEY];
  if (ALIAS) exp[ALIAS] = fn;
  $export($export.P + $export.F * FORCE, 'String', exp);
};

// 1 -> String#trimLeft
// 2 -> String#trimRight
// 3 -> String#trim
var trim = exporter.trim = function (string, TYPE) {
  string = String(defined(string));
  if (TYPE & 1) string = string.replace(ltrim, '');
  if (TYPE & 2) string = string.replace(rtrim, '');
  return string;
};

module.exports = exporter;


/***/ }),

/***/ "ac6a":
/***/ (function(module, exports, __webpack_require__) {

var $iterators = __webpack_require__("cadf");
var getKeys = __webpack_require__("0d58");
var redefine = __webpack_require__("2aba");
var global = __webpack_require__("7726");
var hide = __webpack_require__("32e9");
var Iterators = __webpack_require__("84f2");
var wks = __webpack_require__("2b4c");
var ITERATOR = wks('iterator');
var TO_STRING_TAG = wks('toStringTag');
var ArrayValues = Iterators.Array;

var DOMIterables = {
  CSSRuleList: true, // TODO: Not spec compliant, should be false.
  CSSStyleDeclaration: false,
  CSSValueList: false,
  ClientRectList: false,
  DOMRectList: false,
  DOMStringList: false,
  DOMTokenList: true,
  DataTransferItemList: false,
  FileList: false,
  HTMLAllCollection: false,
  HTMLCollection: false,
  HTMLFormElement: false,
  HTMLSelectElement: false,
  MediaList: true, // TODO: Not spec compliant, should be false.
  MimeTypeArray: false,
  NamedNodeMap: false,
  NodeList: true,
  PaintRequestList: false,
  Plugin: false,
  PluginArray: false,
  SVGLengthList: false,
  SVGNumberList: false,
  SVGPathSegList: false,
  SVGPointList: false,
  SVGStringList: false,
  SVGTransformList: false,
  SourceBufferList: false,
  StyleSheetList: true, // TODO: Not spec compliant, should be false.
  TextTrackCueList: false,
  TextTrackList: false,
  TouchList: false
};

for (var collections = getKeys(DOMIterables), i = 0; i < collections.length; i++) {
  var NAME = collections[i];
  var explicit = DOMIterables[NAME];
  var Collection = global[NAME];
  var proto = Collection && Collection.prototype;
  var key;
  if (proto) {
    if (!proto[ITERATOR]) hide(proto, ITERATOR, ArrayValues);
    if (!proto[TO_STRING_TAG]) hide(proto, TO_STRING_TAG, NAME);
    Iterators[NAME] = ArrayValues;
    if (explicit) for (key in $iterators) if (!proto[key]) redefine(proto, key, $iterators[key], true);
  }
}


/***/ }),

/***/ "be13":
/***/ (function(module, exports) {

// 7.2.1 RequireObjectCoercible(argument)
module.exports = function (it) {
  if (it == undefined) throw TypeError("Can't call method on  " + it);
  return it;
};


/***/ }),

/***/ "c366":
/***/ (function(module, exports, __webpack_require__) {

// false -> Array#indexOf
// true  -> Array#includes
var toIObject = __webpack_require__("6821");
var toLength = __webpack_require__("9def");
var toAbsoluteIndex = __webpack_require__("77f1");
module.exports = function (IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = toIObject($this);
    var length = toLength(O.length);
    var index = toAbsoluteIndex(fromIndex, length);
    var value;
    // Array#includes uses SameValueZero equality algorithm
    // eslint-disable-next-line no-self-compare
    if (IS_INCLUDES && el != el) while (length > index) {
      value = O[index++];
      // eslint-disable-next-line no-self-compare
      if (value != value) return true;
    // Array#indexOf ignores holes, Array#includes - not
    } else for (;length > index; index++) if (IS_INCLUDES || index in O) {
      if (O[index] === el) return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};


/***/ }),

/***/ "c5f6":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var global = __webpack_require__("7726");
var has = __webpack_require__("69a8");
var cof = __webpack_require__("2d95");
var inheritIfRequired = __webpack_require__("5dbc");
var toPrimitive = __webpack_require__("6a99");
var fails = __webpack_require__("79e5");
var gOPN = __webpack_require__("9093").f;
var gOPD = __webpack_require__("11e9").f;
var dP = __webpack_require__("86cc").f;
var $trim = __webpack_require__("aa77").trim;
var NUMBER = 'Number';
var $Number = global[NUMBER];
var Base = $Number;
var proto = $Number.prototype;
// Opera ~12 has broken Object#toString
var BROKEN_COF = cof(__webpack_require__("2aeb")(proto)) == NUMBER;
var TRIM = 'trim' in String.prototype;

// 7.1.3 ToNumber(argument)
var toNumber = function (argument) {
  var it = toPrimitive(argument, false);
  if (typeof it == 'string' && it.length > 2) {
    it = TRIM ? it.trim() : $trim(it, 3);
    var first = it.charCodeAt(0);
    var third, radix, maxCode;
    if (first === 43 || first === 45) {
      third = it.charCodeAt(2);
      if (third === 88 || third === 120) return NaN; // Number('+0x1') should be NaN, old V8 fix
    } else if (first === 48) {
      switch (it.charCodeAt(1)) {
        case 66: case 98: radix = 2; maxCode = 49; break; // fast equal /^0b[01]+$/i
        case 79: case 111: radix = 8; maxCode = 55; break; // fast equal /^0o[0-7]+$/i
        default: return +it;
      }
      for (var digits = it.slice(2), i = 0, l = digits.length, code; i < l; i++) {
        code = digits.charCodeAt(i);
        // parseInt parses a string to a first unavailable symbol
        // but ToNumber should return NaN if a string contains unavailable symbols
        if (code < 48 || code > maxCode) return NaN;
      } return parseInt(digits, radix);
    }
  } return +it;
};

if (!$Number(' 0o1') || !$Number('0b1') || $Number('+0x1')) {
  $Number = function Number(value) {
    var it = arguments.length < 1 ? 0 : value;
    var that = this;
    return that instanceof $Number
      // check on 1..constructor(foo) case
      && (BROKEN_COF ? fails(function () { proto.valueOf.call(that); }) : cof(that) != NUMBER)
        ? inheritIfRequired(new Base(toNumber(it)), that, $Number) : toNumber(it);
  };
  for (var keys = __webpack_require__("9e1e") ? gOPN(Base) : (
    // ES3:
    'MAX_VALUE,MIN_VALUE,NaN,NEGATIVE_INFINITY,POSITIVE_INFINITY,' +
    // ES6 (in case, if modules with ES6 Number statics required before):
    'EPSILON,isFinite,isInteger,isNaN,isSafeInteger,MAX_SAFE_INTEGER,' +
    'MIN_SAFE_INTEGER,parseFloat,parseInt,isInteger'
  ).split(','), j = 0, key; keys.length > j; j++) {
    if (has(Base, key = keys[j]) && !has($Number, key)) {
      dP($Number, key, gOPD(Base, key));
    }
  }
  $Number.prototype = proto;
  proto.constructor = $Number;
  __webpack_require__("2aba")(global, NUMBER, $Number);
}


/***/ }),

/***/ "c69a":
/***/ (function(module, exports, __webpack_require__) {

module.exports = !__webpack_require__("9e1e") && !__webpack_require__("79e5")(function () {
  return Object.defineProperty(__webpack_require__("230e")('div'), 'a', { get: function () { return 7; } }).a != 7;
});


/***/ }),

/***/ "ca5a":
/***/ (function(module, exports) {

var id = 0;
var px = Math.random();
module.exports = function (key) {
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};


/***/ }),

/***/ "cadf":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var addToUnscopables = __webpack_require__("9c6c");
var step = __webpack_require__("d53b");
var Iterators = __webpack_require__("84f2");
var toIObject = __webpack_require__("6821");

// 22.1.3.4 Array.prototype.entries()
// 22.1.3.13 Array.prototype.keys()
// 22.1.3.29 Array.prototype.values()
// 22.1.3.30 Array.prototype[@@iterator]()
module.exports = __webpack_require__("01f9")(Array, 'Array', function (iterated, kind) {
  this._t = toIObject(iterated); // target
  this._i = 0;                   // next index
  this._k = kind;                // kind
// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
}, function () {
  var O = this._t;
  var kind = this._k;
  var index = this._i++;
  if (!O || index >= O.length) {
    this._t = undefined;
    return step(1);
  }
  if (kind == 'keys') return step(0, index);
  if (kind == 'values') return step(0, O[index]);
  return step(0, [index, O[index]]);
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
Iterators.Arguments = Iterators.Array;

addToUnscopables('keys');
addToUnscopables('values');
addToUnscopables('entries');


/***/ }),

/***/ "cb7c":
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__("d3f4");
module.exports = function (it) {
  if (!isObject(it)) throw TypeError(it + ' is not an object!');
  return it;
};


/***/ }),

/***/ "cd1c":
/***/ (function(module, exports, __webpack_require__) {

// 9.4.2.3 ArraySpeciesCreate(originalArray, length)
var speciesConstructor = __webpack_require__("e853");

module.exports = function (original, length) {
  return new (speciesConstructor(original))(length);
};


/***/ }),

/***/ "ce10":
/***/ (function(module, exports, __webpack_require__) {

var has = __webpack_require__("69a8");
var toIObject = __webpack_require__("6821");
var arrayIndexOf = __webpack_require__("c366")(false);
var IE_PROTO = __webpack_require__("613b")('IE_PROTO');

module.exports = function (object, names) {
  var O = toIObject(object);
  var i = 0;
  var result = [];
  var key;
  for (key in O) if (key != IE_PROTO) has(O, key) && result.push(key);
  // Don't enum bug & hidden keys
  while (names.length > i) if (has(O, key = names[i++])) {
    ~arrayIndexOf(result, key) || result.push(key);
  }
  return result;
};


/***/ }),

/***/ "d3f4":
/***/ (function(module, exports) {

module.exports = function (it) {
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};


/***/ }),

/***/ "d53b":
/***/ (function(module, exports) {

module.exports = function (done, value) {
  return { value: value, done: !!done };
};


/***/ }),

/***/ "d8e8":
/***/ (function(module, exports) {

module.exports = function (it) {
  if (typeof it != 'function') throw TypeError(it + ' is not a function!');
  return it;
};


/***/ }),

/***/ "e11e":
/***/ (function(module, exports) {

// IE 8- don't enum bug keys
module.exports = (
  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
).split(',');


/***/ }),

/***/ "e853":
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__("d3f4");
var isArray = __webpack_require__("1169");
var SPECIES = __webpack_require__("2b4c")('species');

module.exports = function (original) {
  var C;
  if (isArray(original)) {
    C = original.constructor;
    // cross-realm fallback
    if (typeof C == 'function' && (C === Array || isArray(C.prototype))) C = undefined;
    if (isObject(C)) {
      C = C[SPECIES];
      if (C === null) C = undefined;
    }
  } return C === undefined ? Array : C;
};


/***/ }),

/***/ "fab2":
/***/ (function(module, exports, __webpack_require__) {

var document = __webpack_require__("7726").document;
module.exports = document && document.documentElement;


/***/ }),

/***/ "fb15":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// EXTERNAL MODULE: ./node_modules/@vue/cli-service/lib/commands/build/setPublicPath.js
var setPublicPath = __webpack_require__("1eb2");

// EXTERNAL MODULE: ./node_modules/core-js/modules/es6.array.iterator.js
var es6_array_iterator = __webpack_require__("cadf");

// EXTERNAL MODULE: ./node_modules/core-js/modules/es6.object.keys.js
var es6_object_keys = __webpack_require__("456d");

// EXTERNAL MODULE: ./node_modules/core-js/modules/web.dom.iterable.js
var web_dom_iterable = __webpack_require__("ac6a");

// EXTERNAL MODULE: ./node_modules/core-js/modules/es6.function.name.js
var es6_function_name = __webpack_require__("7f7f");

// EXTERNAL MODULE: external {"commonjs":"vue","commonjs2":"vue","root":"Vue"}
var external_commonjs_vue_commonjs2_vue_root_Vue_ = __webpack_require__("8bbf");
var external_commonjs_vue_commonjs2_vue_root_Vue_default = /*#__PURE__*/__webpack_require__.n(external_commonjs_vue_commonjs2_vue_root_Vue_);

// CONCATENATED MODULE: ./node_modules/vue-router/dist/vue-router.esm.js
/**
  * vue-router v3.0.1
  * (c) 2017 Evan You
  * @license MIT
  */
/*  */

function assert (condition, message) {
  if (!condition) {
    throw new Error(("[vue-router] " + message))
  }
}

function warn (condition, message) {
  if (false) {}
}

function isError (err) {
  return Object.prototype.toString.call(err).indexOf('Error') > -1
}

var View = {
  name: 'router-view',
  functional: true,
  props: {
    name: {
      type: String,
      default: 'default'
    }
  },
  render: function render (_, ref) {
    var props = ref.props;
    var children = ref.children;
    var parent = ref.parent;
    var data = ref.data;

    data.routerView = true;

    // directly use parent context's createElement() function
    // so that components rendered by router-view can resolve named slots
    var h = parent.$createElement;
    var name = props.name;
    var route = parent.$route;
    var cache = parent._routerViewCache || (parent._routerViewCache = {});

    // determine current view depth, also check to see if the tree
    // has been toggled inactive but kept-alive.
    var depth = 0;
    var inactive = false;
    while (parent && parent._routerRoot !== parent) {
      if (parent.$vnode && parent.$vnode.data.routerView) {
        depth++;
      }
      if (parent._inactive) {
        inactive = true;
      }
      parent = parent.$parent;
    }
    data.routerViewDepth = depth;

    // render previous view if the tree is inactive and kept-alive
    if (inactive) {
      return h(cache[name], data, children)
    }

    var matched = route.matched[depth];
    // render empty node if no matched route
    if (!matched) {
      cache[name] = null;
      return h()
    }

    var component = cache[name] = matched.components[name];

    // attach instance registration hook
    // this will be called in the instance's injected lifecycle hooks
    data.registerRouteInstance = function (vm, val) {
      // val could be undefined for unregistration
      var current = matched.instances[name];
      if (
        (val && current !== vm) ||
        (!val && current === vm)
      ) {
        matched.instances[name] = val;
      }
    }

    // also register instance in prepatch hook
    // in case the same component instance is reused across different routes
    ;(data.hook || (data.hook = {})).prepatch = function (_, vnode) {
      matched.instances[name] = vnode.componentInstance;
    };

    // resolve props
    var propsToPass = data.props = resolveProps(route, matched.props && matched.props[name]);
    if (propsToPass) {
      // clone to prevent mutation
      propsToPass = data.props = extend({}, propsToPass);
      // pass non-declared props as attrs
      var attrs = data.attrs = data.attrs || {};
      for (var key in propsToPass) {
        if (!component.props || !(key in component.props)) {
          attrs[key] = propsToPass[key];
          delete propsToPass[key];
        }
      }
    }

    return h(component, data, children)
  }
};

function resolveProps (route, config) {
  switch (typeof config) {
    case 'undefined':
      return
    case 'object':
      return config
    case 'function':
      return config(route)
    case 'boolean':
      return config ? route.params : undefined
    default:
      if (false) {}
  }
}

function extend (to, from) {
  for (var key in from) {
    to[key] = from[key];
  }
  return to
}

/*  */

var encodeReserveRE = /[!'()*]/g;
var encodeReserveReplacer = function (c) { return '%' + c.charCodeAt(0).toString(16); };
var commaRE = /%2C/g;

// fixed encodeURIComponent which is more conformant to RFC3986:
// - escapes [!'()*]
// - preserve commas
var encode = function (str) { return encodeURIComponent(str)
  .replace(encodeReserveRE, encodeReserveReplacer)
  .replace(commaRE, ','); };

var decode = decodeURIComponent;

function resolveQuery (
  query,
  extraQuery,
  _parseQuery
) {
  if ( extraQuery === void 0 ) extraQuery = {};

  var parse = _parseQuery || parseQuery;
  var parsedQuery;
  try {
    parsedQuery = parse(query || '');
  } catch (e) {
    "production" !== 'production' && warn(false, e.message);
    parsedQuery = {};
  }
  for (var key in extraQuery) {
    parsedQuery[key] = extraQuery[key];
  }
  return parsedQuery
}

function parseQuery (query) {
  var res = {};

  query = query.trim().replace(/^(\?|#|&)/, '');

  if (!query) {
    return res
  }

  query.split('&').forEach(function (param) {
    var parts = param.replace(/\+/g, ' ').split('=');
    var key = decode(parts.shift());
    var val = parts.length > 0
      ? decode(parts.join('='))
      : null;

    if (res[key] === undefined) {
      res[key] = val;
    } else if (Array.isArray(res[key])) {
      res[key].push(val);
    } else {
      res[key] = [res[key], val];
    }
  });

  return res
}

function stringifyQuery (obj) {
  var res = obj ? Object.keys(obj).map(function (key) {
    var val = obj[key];

    if (val === undefined) {
      return ''
    }

    if (val === null) {
      return encode(key)
    }

    if (Array.isArray(val)) {
      var result = [];
      val.forEach(function (val2) {
        if (val2 === undefined) {
          return
        }
        if (val2 === null) {
          result.push(encode(key));
        } else {
          result.push(encode(key) + '=' + encode(val2));
        }
      });
      return result.join('&')
    }

    return encode(key) + '=' + encode(val)
  }).filter(function (x) { return x.length > 0; }).join('&') : null;
  return res ? ("?" + res) : ''
}

/*  */


var trailingSlashRE = /\/?$/;

function createRoute (
  record,
  location,
  redirectedFrom,
  router
) {
  var stringifyQuery$$1 = router && router.options.stringifyQuery;

  var query = location.query || {};
  try {
    query = clone(query);
  } catch (e) {}

  var route = {
    name: location.name || (record && record.name),
    meta: (record && record.meta) || {},
    path: location.path || '/',
    hash: location.hash || '',
    query: query,
    params: location.params || {},
    fullPath: getFullPath(location, stringifyQuery$$1),
    matched: record ? formatMatch(record) : []
  };
  if (redirectedFrom) {
    route.redirectedFrom = getFullPath(redirectedFrom, stringifyQuery$$1);
  }
  return Object.freeze(route)
}

function clone (value) {
  if (Array.isArray(value)) {
    return value.map(clone)
  } else if (value && typeof value === 'object') {
    var res = {};
    for (var key in value) {
      res[key] = clone(value[key]);
    }
    return res
  } else {
    return value
  }
}

// the starting route that represents the initial state
var START = createRoute(null, {
  path: '/'
});

function formatMatch (record) {
  var res = [];
  while (record) {
    res.unshift(record);
    record = record.parent;
  }
  return res
}

function getFullPath (
  ref,
  _stringifyQuery
) {
  var path = ref.path;
  var query = ref.query; if ( query === void 0 ) query = {};
  var hash = ref.hash; if ( hash === void 0 ) hash = '';

  var stringify = _stringifyQuery || stringifyQuery;
  return (path || '/') + stringify(query) + hash
}

function isSameRoute (a, b) {
  if (b === START) {
    return a === b
  } else if (!b) {
    return false
  } else if (a.path && b.path) {
    return (
      a.path.replace(trailingSlashRE, '') === b.path.replace(trailingSlashRE, '') &&
      a.hash === b.hash &&
      isObjectEqual(a.query, b.query)
    )
  } else if (a.name && b.name) {
    return (
      a.name === b.name &&
      a.hash === b.hash &&
      isObjectEqual(a.query, b.query) &&
      isObjectEqual(a.params, b.params)
    )
  } else {
    return false
  }
}

function isObjectEqual (a, b) {
  if ( a === void 0 ) a = {};
  if ( b === void 0 ) b = {};

  // handle null value #1566
  if (!a || !b) { return a === b }
  var aKeys = Object.keys(a);
  var bKeys = Object.keys(b);
  if (aKeys.length !== bKeys.length) {
    return false
  }
  return aKeys.every(function (key) {
    var aVal = a[key];
    var bVal = b[key];
    // check nested equality
    if (typeof aVal === 'object' && typeof bVal === 'object') {
      return isObjectEqual(aVal, bVal)
    }
    return String(aVal) === String(bVal)
  })
}

function isIncludedRoute (current, target) {
  return (
    current.path.replace(trailingSlashRE, '/').indexOf(
      target.path.replace(trailingSlashRE, '/')
    ) === 0 &&
    (!target.hash || current.hash === target.hash) &&
    queryIncludes(current.query, target.query)
  )
}

function queryIncludes (current, target) {
  for (var key in target) {
    if (!(key in current)) {
      return false
    }
  }
  return true
}

/*  */

// work around weird flow bug
var toTypes = [String, Object];
var eventTypes = [String, Array];

var Link = {
  name: 'router-link',
  props: {
    to: {
      type: toTypes,
      required: true
    },
    tag: {
      type: String,
      default: 'a'
    },
    exact: Boolean,
    append: Boolean,
    replace: Boolean,
    activeClass: String,
    exactActiveClass: String,
    event: {
      type: eventTypes,
      default: 'click'
    }
  },
  render: function render (h) {
    var this$1 = this;

    var router = this.$router;
    var current = this.$route;
    var ref = router.resolve(this.to, current, this.append);
    var location = ref.location;
    var route = ref.route;
    var href = ref.href;

    var classes = {};
    var globalActiveClass = router.options.linkActiveClass;
    var globalExactActiveClass = router.options.linkExactActiveClass;
    // Support global empty active class
    var activeClassFallback = globalActiveClass == null
            ? 'router-link-active'
            : globalActiveClass;
    var exactActiveClassFallback = globalExactActiveClass == null
            ? 'router-link-exact-active'
            : globalExactActiveClass;
    var activeClass = this.activeClass == null
            ? activeClassFallback
            : this.activeClass;
    var exactActiveClass = this.exactActiveClass == null
            ? exactActiveClassFallback
            : this.exactActiveClass;
    var compareTarget = location.path
      ? createRoute(null, location, null, router)
      : route;

    classes[exactActiveClass] = isSameRoute(current, compareTarget);
    classes[activeClass] = this.exact
      ? classes[exactActiveClass]
      : isIncludedRoute(current, compareTarget);

    var handler = function (e) {
      if (guardEvent(e)) {
        if (this$1.replace) {
          router.replace(location);
        } else {
          router.push(location);
        }
      }
    };

    var on = { click: guardEvent };
    if (Array.isArray(this.event)) {
      this.event.forEach(function (e) { on[e] = handler; });
    } else {
      on[this.event] = handler;
    }

    var data = {
      class: classes
    };

    if (this.tag === 'a') {
      data.on = on;
      data.attrs = { href: href };
    } else {
      // find the first <a> child and apply listener and href
      var a = findAnchor(this.$slots.default);
      if (a) {
        // in case the <a> is a static node
        a.isStatic = false;
        var extend = _Vue.util.extend;
        var aData = a.data = extend({}, a.data);
        aData.on = on;
        var aAttrs = a.data.attrs = extend({}, a.data.attrs);
        aAttrs.href = href;
      } else {
        // doesn't have <a> child, apply listener to self
        data.on = on;
      }
    }

    return h(this.tag, data, this.$slots.default)
  }
};

function guardEvent (e) {
  // don't redirect with control keys
  if (e.metaKey || e.altKey || e.ctrlKey || e.shiftKey) { return }
  // don't redirect when preventDefault called
  if (e.defaultPrevented) { return }
  // don't redirect on right click
  if (e.button !== undefined && e.button !== 0) { return }
  // don't redirect if `target="_blank"`
  if (e.currentTarget && e.currentTarget.getAttribute) {
    var target = e.currentTarget.getAttribute('target');
    if (/\b_blank\b/i.test(target)) { return }
  }
  // this may be a Weex event which doesn't have this method
  if (e.preventDefault) {
    e.preventDefault();
  }
  return true
}

function findAnchor (children) {
  if (children) {
    var child;
    for (var i = 0; i < children.length; i++) {
      child = children[i];
      if (child.tag === 'a') {
        return child
      }
      if (child.children && (child = findAnchor(child.children))) {
        return child
      }
    }
  }
}

var _Vue;

function install (Vue) {
  if (install.installed && _Vue === Vue) { return }
  install.installed = true;

  _Vue = Vue;

  var isDef = function (v) { return v !== undefined; };

  var registerInstance = function (vm, callVal) {
    var i = vm.$options._parentVnode;
    if (isDef(i) && isDef(i = i.data) && isDef(i = i.registerRouteInstance)) {
      i(vm, callVal);
    }
  };

  Vue.mixin({
    beforeCreate: function beforeCreate () {
      if (isDef(this.$options.router)) {
        this._routerRoot = this;
        this._router = this.$options.router;
        this._router.init(this);
        Vue.util.defineReactive(this, '_route', this._router.history.current);
      } else {
        this._routerRoot = (this.$parent && this.$parent._routerRoot) || this;
      }
      registerInstance(this, this);
    },
    destroyed: function destroyed () {
      registerInstance(this);
    }
  });

  Object.defineProperty(Vue.prototype, '$router', {
    get: function get () { return this._routerRoot._router }
  });

  Object.defineProperty(Vue.prototype, '$route', {
    get: function get () { return this._routerRoot._route }
  });

  Vue.component('router-view', View);
  Vue.component('router-link', Link);

  var strats = Vue.config.optionMergeStrategies;
  // use the same hook merging strategy for route hooks
  strats.beforeRouteEnter = strats.beforeRouteLeave = strats.beforeRouteUpdate = strats.created;
}

/*  */

var inBrowser = typeof window !== 'undefined';

/*  */

function resolvePath (
  relative,
  base,
  append
) {
  var firstChar = relative.charAt(0);
  if (firstChar === '/') {
    return relative
  }

  if (firstChar === '?' || firstChar === '#') {
    return base + relative
  }

  var stack = base.split('/');

  // remove trailing segment if:
  // - not appending
  // - appending to trailing slash (last segment is empty)
  if (!append || !stack[stack.length - 1]) {
    stack.pop();
  }

  // resolve relative path
  var segments = relative.replace(/^\//, '').split('/');
  for (var i = 0; i < segments.length; i++) {
    var segment = segments[i];
    if (segment === '..') {
      stack.pop();
    } else if (segment !== '.') {
      stack.push(segment);
    }
  }

  // ensure leading slash
  if (stack[0] !== '') {
    stack.unshift('');
  }

  return stack.join('/')
}

function parsePath (path) {
  var hash = '';
  var query = '';

  var hashIndex = path.indexOf('#');
  if (hashIndex >= 0) {
    hash = path.slice(hashIndex);
    path = path.slice(0, hashIndex);
  }

  var queryIndex = path.indexOf('?');
  if (queryIndex >= 0) {
    query = path.slice(queryIndex + 1);
    path = path.slice(0, queryIndex);
  }

  return {
    path: path,
    query: query,
    hash: hash
  }
}

function cleanPath (path) {
  return path.replace(/\/\//g, '/')
}

var isarray = Array.isArray || function (arr) {
  return Object.prototype.toString.call(arr) == '[object Array]';
};

/**
 * Expose `pathToRegexp`.
 */
var pathToRegexp_1 = pathToRegexp;
var parse_1 = parse;
var compile_1 = compile;
var tokensToFunction_1 = tokensToFunction;
var tokensToRegExp_1 = tokensToRegExp;

/**
 * The main path matching regexp utility.
 *
 * @type {RegExp}
 */
var PATH_REGEXP = new RegExp([
  // Match escaped characters that would otherwise appear in future matches.
  // This allows the user to escape special characters that won't transform.
  '(\\\\.)',
  // Match Express-style parameters and un-named parameters with a prefix
  // and optional suffixes. Matches appear as:
  //
  // "/:test(\\d+)?" => ["/", "test", "\d+", undefined, "?", undefined]
  // "/route(\\d+)"  => [undefined, undefined, undefined, "\d+", undefined, undefined]
  // "/*"            => ["/", undefined, undefined, undefined, undefined, "*"]
  '([\\/.])?(?:(?:\\:(\\w+)(?:\\(((?:\\\\.|[^\\\\()])+)\\))?|\\(((?:\\\\.|[^\\\\()])+)\\))([+*?])?|(\\*))'
].join('|'), 'g');

/**
 * Parse a string for the raw tokens.
 *
 * @param  {string}  str
 * @param  {Object=} options
 * @return {!Array}
 */
function parse (str, options) {
  var tokens = [];
  var key = 0;
  var index = 0;
  var path = '';
  var defaultDelimiter = options && options.delimiter || '/';
  var res;

  while ((res = PATH_REGEXP.exec(str)) != null) {
    var m = res[0];
    var escaped = res[1];
    var offset = res.index;
    path += str.slice(index, offset);
    index = offset + m.length;

    // Ignore already escaped sequences.
    if (escaped) {
      path += escaped[1];
      continue
    }

    var next = str[index];
    var prefix = res[2];
    var name = res[3];
    var capture = res[4];
    var group = res[5];
    var modifier = res[6];
    var asterisk = res[7];

    // Push the current path onto the tokens.
    if (path) {
      tokens.push(path);
      path = '';
    }

    var partial = prefix != null && next != null && next !== prefix;
    var repeat = modifier === '+' || modifier === '*';
    var optional = modifier === '?' || modifier === '*';
    var delimiter = res[2] || defaultDelimiter;
    var pattern = capture || group;

    tokens.push({
      name: name || key++,
      prefix: prefix || '',
      delimiter: delimiter,
      optional: optional,
      repeat: repeat,
      partial: partial,
      asterisk: !!asterisk,
      pattern: pattern ? escapeGroup(pattern) : (asterisk ? '.*' : '[^' + escapeString(delimiter) + ']+?')
    });
  }

  // Match any characters still remaining.
  if (index < str.length) {
    path += str.substr(index);
  }

  // If the path exists, push it onto the end.
  if (path) {
    tokens.push(path);
  }

  return tokens
}

/**
 * Compile a string to a template function for the path.
 *
 * @param  {string}             str
 * @param  {Object=}            options
 * @return {!function(Object=, Object=)}
 */
function compile (str, options) {
  return tokensToFunction(parse(str, options))
}

/**
 * Prettier encoding of URI path segments.
 *
 * @param  {string}
 * @return {string}
 */
function encodeURIComponentPretty (str) {
  return encodeURI(str).replace(/[\/?#]/g, function (c) {
    return '%' + c.charCodeAt(0).toString(16).toUpperCase()
  })
}

/**
 * Encode the asterisk parameter. Similar to `pretty`, but allows slashes.
 *
 * @param  {string}
 * @return {string}
 */
function encodeAsterisk (str) {
  return encodeURI(str).replace(/[?#]/g, function (c) {
    return '%' + c.charCodeAt(0).toString(16).toUpperCase()
  })
}

/**
 * Expose a method for transforming tokens into the path function.
 */
function tokensToFunction (tokens) {
  // Compile all the tokens into regexps.
  var matches = new Array(tokens.length);

  // Compile all the patterns before compilation.
  for (var i = 0; i < tokens.length; i++) {
    if (typeof tokens[i] === 'object') {
      matches[i] = new RegExp('^(?:' + tokens[i].pattern + ')$');
    }
  }

  return function (obj, opts) {
    var path = '';
    var data = obj || {};
    var options = opts || {};
    var encode = options.pretty ? encodeURIComponentPretty : encodeURIComponent;

    for (var i = 0; i < tokens.length; i++) {
      var token = tokens[i];

      if (typeof token === 'string') {
        path += token;

        continue
      }

      var value = data[token.name];
      var segment;

      if (value == null) {
        if (token.optional) {
          // Prepend partial segment prefixes.
          if (token.partial) {
            path += token.prefix;
          }

          continue
        } else {
          throw new TypeError('Expected "' + token.name + '" to be defined')
        }
      }

      if (isarray(value)) {
        if (!token.repeat) {
          throw new TypeError('Expected "' + token.name + '" to not repeat, but received `' + JSON.stringify(value) + '`')
        }

        if (value.length === 0) {
          if (token.optional) {
            continue
          } else {
            throw new TypeError('Expected "' + token.name + '" to not be empty')
          }
        }

        for (var j = 0; j < value.length; j++) {
          segment = encode(value[j]);

          if (!matches[i].test(segment)) {
            throw new TypeError('Expected all "' + token.name + '" to match "' + token.pattern + '", but received `' + JSON.stringify(segment) + '`')
          }

          path += (j === 0 ? token.prefix : token.delimiter) + segment;
        }

        continue
      }

      segment = token.asterisk ? encodeAsterisk(value) : encode(value);

      if (!matches[i].test(segment)) {
        throw new TypeError('Expected "' + token.name + '" to match "' + token.pattern + '", but received "' + segment + '"')
      }

      path += token.prefix + segment;
    }

    return path
  }
}

/**
 * Escape a regular expression string.
 *
 * @param  {string} str
 * @return {string}
 */
function escapeString (str) {
  return str.replace(/([.+*?=^!:${}()[\]|\/\\])/g, '\\$1')
}

/**
 * Escape the capturing group by escaping special characters and meaning.
 *
 * @param  {string} group
 * @return {string}
 */
function escapeGroup (group) {
  return group.replace(/([=!:$\/()])/g, '\\$1')
}

/**
 * Attach the keys as a property of the regexp.
 *
 * @param  {!RegExp} re
 * @param  {Array}   keys
 * @return {!RegExp}
 */
function attachKeys (re, keys) {
  re.keys = keys;
  return re
}

/**
 * Get the flags for a regexp from the options.
 *
 * @param  {Object} options
 * @return {string}
 */
function flags (options) {
  return options.sensitive ? '' : 'i'
}

/**
 * Pull out keys from a regexp.
 *
 * @param  {!RegExp} path
 * @param  {!Array}  keys
 * @return {!RegExp}
 */
function regexpToRegexp (path, keys) {
  // Use a negative lookahead to match only capturing groups.
  var groups = path.source.match(/\((?!\?)/g);

  if (groups) {
    for (var i = 0; i < groups.length; i++) {
      keys.push({
        name: i,
        prefix: null,
        delimiter: null,
        optional: false,
        repeat: false,
        partial: false,
        asterisk: false,
        pattern: null
      });
    }
  }

  return attachKeys(path, keys)
}

/**
 * Transform an array into a regexp.
 *
 * @param  {!Array}  path
 * @param  {Array}   keys
 * @param  {!Object} options
 * @return {!RegExp}
 */
function arrayToRegexp (path, keys, options) {
  var parts = [];

  for (var i = 0; i < path.length; i++) {
    parts.push(pathToRegexp(path[i], keys, options).source);
  }

  var regexp = new RegExp('(?:' + parts.join('|') + ')', flags(options));

  return attachKeys(regexp, keys)
}

/**
 * Create a path regexp from string input.
 *
 * @param  {string}  path
 * @param  {!Array}  keys
 * @param  {!Object} options
 * @return {!RegExp}
 */
function stringToRegexp (path, keys, options) {
  return tokensToRegExp(parse(path, options), keys, options)
}

/**
 * Expose a function for taking tokens and returning a RegExp.
 *
 * @param  {!Array}          tokens
 * @param  {(Array|Object)=} keys
 * @param  {Object=}         options
 * @return {!RegExp}
 */
function tokensToRegExp (tokens, keys, options) {
  if (!isarray(keys)) {
    options = /** @type {!Object} */ (keys || options);
    keys = [];
  }

  options = options || {};

  var strict = options.strict;
  var end = options.end !== false;
  var route = '';

  // Iterate over the tokens and create our regexp string.
  for (var i = 0; i < tokens.length; i++) {
    var token = tokens[i];

    if (typeof token === 'string') {
      route += escapeString(token);
    } else {
      var prefix = escapeString(token.prefix);
      var capture = '(?:' + token.pattern + ')';

      keys.push(token);

      if (token.repeat) {
        capture += '(?:' + prefix + capture + ')*';
      }

      if (token.optional) {
        if (!token.partial) {
          capture = '(?:' + prefix + '(' + capture + '))?';
        } else {
          capture = prefix + '(' + capture + ')?';
        }
      } else {
        capture = prefix + '(' + capture + ')';
      }

      route += capture;
    }
  }

  var delimiter = escapeString(options.delimiter || '/');
  var endsWithDelimiter = route.slice(-delimiter.length) === delimiter;

  // In non-strict mode we allow a slash at the end of match. If the path to
  // match already ends with a slash, we remove it for consistency. The slash
  // is valid at the end of a path match, not in the middle. This is important
  // in non-ending mode, where "/test/" shouldn't match "/test//route".
  if (!strict) {
    route = (endsWithDelimiter ? route.slice(0, -delimiter.length) : route) + '(?:' + delimiter + '(?=$))?';
  }

  if (end) {
    route += '$';
  } else {
    // In non-ending mode, we need the capturing groups to match as much as
    // possible by using a positive lookahead to the end or next path segment.
    route += strict && endsWithDelimiter ? '' : '(?=' + delimiter + '|$)';
  }

  return attachKeys(new RegExp('^' + route, flags(options)), keys)
}

/**
 * Normalize the given path string, returning a regular expression.
 *
 * An empty array can be passed in for the keys, which will hold the
 * placeholder key descriptions. For example, using `/user/:id`, `keys` will
 * contain `[{ name: 'id', delimiter: '/', optional: false, repeat: false }]`.
 *
 * @param  {(string|RegExp|Array)} path
 * @param  {(Array|Object)=}       keys
 * @param  {Object=}               options
 * @return {!RegExp}
 */
function pathToRegexp (path, keys, options) {
  if (!isarray(keys)) {
    options = /** @type {!Object} */ (keys || options);
    keys = [];
  }

  options = options || {};

  if (path instanceof RegExp) {
    return regexpToRegexp(path, /** @type {!Array} */ (keys))
  }

  if (isarray(path)) {
    return arrayToRegexp(/** @type {!Array} */ (path), /** @type {!Array} */ (keys), options)
  }

  return stringToRegexp(/** @type {string} */ (path), /** @type {!Array} */ (keys), options)
}

pathToRegexp_1.parse = parse_1;
pathToRegexp_1.compile = compile_1;
pathToRegexp_1.tokensToFunction = tokensToFunction_1;
pathToRegexp_1.tokensToRegExp = tokensToRegExp_1;

/*  */

// $flow-disable-line
var regexpCompileCache = Object.create(null);

function fillParams (
  path,
  params,
  routeMsg
) {
  try {
    var filler =
      regexpCompileCache[path] ||
      (regexpCompileCache[path] = pathToRegexp_1.compile(path));
    return filler(params || {}, { pretty: true })
  } catch (e) {
    if (false) {}
    return ''
  }
}

/*  */

function createRouteMap (
  routes,
  oldPathList,
  oldPathMap,
  oldNameMap
) {
  // the path list is used to control path matching priority
  var pathList = oldPathList || [];
  // $flow-disable-line
  var pathMap = oldPathMap || Object.create(null);
  // $flow-disable-line
  var nameMap = oldNameMap || Object.create(null);

  routes.forEach(function (route) {
    addRouteRecord(pathList, pathMap, nameMap, route);
  });

  // ensure wildcard routes are always at the end
  for (var i = 0, l = pathList.length; i < l; i++) {
    if (pathList[i] === '*') {
      pathList.push(pathList.splice(i, 1)[0]);
      l--;
      i--;
    }
  }

  return {
    pathList: pathList,
    pathMap: pathMap,
    nameMap: nameMap
  }
}

function addRouteRecord (
  pathList,
  pathMap,
  nameMap,
  route,
  parent,
  matchAs
) {
  var path = route.path;
  var name = route.name;
  if (false) {}

  var pathToRegexpOptions = route.pathToRegexpOptions || {};
  var normalizedPath = normalizePath(
    path,
    parent,
    pathToRegexpOptions.strict
  );

  if (typeof route.caseSensitive === 'boolean') {
    pathToRegexpOptions.sensitive = route.caseSensitive;
  }

  var record = {
    path: normalizedPath,
    regex: compileRouteRegex(normalizedPath, pathToRegexpOptions),
    components: route.components || { default: route.component },
    instances: {},
    name: name,
    parent: parent,
    matchAs: matchAs,
    redirect: route.redirect,
    beforeEnter: route.beforeEnter,
    meta: route.meta || {},
    props: route.props == null
      ? {}
      : route.components
        ? route.props
        : { default: route.props }
  };

  if (route.children) {
    // Warn if route is named, does not redirect and has a default child route.
    // If users navigate to this route by name, the default child will
    // not be rendered (GH Issue #629)
    if (false) {}
    route.children.forEach(function (child) {
      var childMatchAs = matchAs
        ? cleanPath((matchAs + "/" + (child.path)))
        : undefined;
      addRouteRecord(pathList, pathMap, nameMap, child, record, childMatchAs);
    });
  }

  if (route.alias !== undefined) {
    var aliases = Array.isArray(route.alias)
      ? route.alias
      : [route.alias];

    aliases.forEach(function (alias) {
      var aliasRoute = {
        path: alias,
        children: route.children
      };
      addRouteRecord(
        pathList,
        pathMap,
        nameMap,
        aliasRoute,
        parent,
        record.path || '/' // matchAs
      );
    });
  }

  if (!pathMap[record.path]) {
    pathList.push(record.path);
    pathMap[record.path] = record;
  }

  if (name) {
    if (!nameMap[name]) {
      nameMap[name] = record;
    } else if (false) {}
  }
}

function compileRouteRegex (path, pathToRegexpOptions) {
  var regex = pathToRegexp_1(path, [], pathToRegexpOptions);
  if (false) { var keys; }
  return regex
}

function normalizePath (path, parent, strict) {
  if (!strict) { path = path.replace(/\/$/, ''); }
  if (path[0] === '/') { return path }
  if (parent == null) { return path }
  return cleanPath(((parent.path) + "/" + path))
}

/*  */


function normalizeLocation (
  raw,
  current,
  append,
  router
) {
  var next = typeof raw === 'string' ? { path: raw } : raw;
  // named target
  if (next.name || next._normalized) {
    return next
  }

  // relative params
  if (!next.path && next.params && current) {
    next = vue_router_esm_assign({}, next);
    next._normalized = true;
    var params = vue_router_esm_assign(vue_router_esm_assign({}, current.params), next.params);
    if (current.name) {
      next.name = current.name;
      next.params = params;
    } else if (current.matched.length) {
      var rawPath = current.matched[current.matched.length - 1].path;
      next.path = fillParams(rawPath, params, ("path " + (current.path)));
    } else if (false) {}
    return next
  }

  var parsedPath = parsePath(next.path || '');
  var basePath = (current && current.path) || '/';
  var path = parsedPath.path
    ? resolvePath(parsedPath.path, basePath, append || next.append)
    : basePath;

  var query = resolveQuery(
    parsedPath.query,
    next.query,
    router && router.options.parseQuery
  );

  var hash = next.hash || parsedPath.hash;
  if (hash && hash.charAt(0) !== '#') {
    hash = "#" + hash;
  }

  return {
    _normalized: true,
    path: path,
    query: query,
    hash: hash
  }
}

function vue_router_esm_assign (a, b) {
  for (var key in b) {
    a[key] = b[key];
  }
  return a
}

/*  */


function createMatcher (
  routes,
  router
) {
  var ref = createRouteMap(routes);
  var pathList = ref.pathList;
  var pathMap = ref.pathMap;
  var nameMap = ref.nameMap;

  function addRoutes (routes) {
    createRouteMap(routes, pathList, pathMap, nameMap);
  }

  function match (
    raw,
    currentRoute,
    redirectedFrom
  ) {
    var location = normalizeLocation(raw, currentRoute, false, router);
    var name = location.name;

    if (name) {
      var record = nameMap[name];
      if (false) {}
      if (!record) { return _createRoute(null, location) }
      var paramNames = record.regex.keys
        .filter(function (key) { return !key.optional; })
        .map(function (key) { return key.name; });

      if (typeof location.params !== 'object') {
        location.params = {};
      }

      if (currentRoute && typeof currentRoute.params === 'object') {
        for (var key in currentRoute.params) {
          if (!(key in location.params) && paramNames.indexOf(key) > -1) {
            location.params[key] = currentRoute.params[key];
          }
        }
      }

      if (record) {
        location.path = fillParams(record.path, location.params, ("named route \"" + name + "\""));
        return _createRoute(record, location, redirectedFrom)
      }
    } else if (location.path) {
      location.params = {};
      for (var i = 0; i < pathList.length; i++) {
        var path = pathList[i];
        var record$1 = pathMap[path];
        if (matchRoute(record$1.regex, location.path, location.params)) {
          return _createRoute(record$1, location, redirectedFrom)
        }
      }
    }
    // no match
    return _createRoute(null, location)
  }

  function redirect (
    record,
    location
  ) {
    var originalRedirect = record.redirect;
    var redirect = typeof originalRedirect === 'function'
        ? originalRedirect(createRoute(record, location, null, router))
        : originalRedirect;

    if (typeof redirect === 'string') {
      redirect = { path: redirect };
    }

    if (!redirect || typeof redirect !== 'object') {
      if (false) {}
      return _createRoute(null, location)
    }

    var re = redirect;
    var name = re.name;
    var path = re.path;
    var query = location.query;
    var hash = location.hash;
    var params = location.params;
    query = re.hasOwnProperty('query') ? re.query : query;
    hash = re.hasOwnProperty('hash') ? re.hash : hash;
    params = re.hasOwnProperty('params') ? re.params : params;

    if (name) {
      // resolved named direct
      var targetRecord = nameMap[name];
      if (false) {}
      return match({
        _normalized: true,
        name: name,
        query: query,
        hash: hash,
        params: params
      }, undefined, location)
    } else if (path) {
      // 1. resolve relative redirect
      var rawPath = resolveRecordPath(path, record);
      // 2. resolve params
      var resolvedPath = fillParams(rawPath, params, ("redirect route with path \"" + rawPath + "\""));
      // 3. rematch with existing query and hash
      return match({
        _normalized: true,
        path: resolvedPath,
        query: query,
        hash: hash
      }, undefined, location)
    } else {
      if (false) {}
      return _createRoute(null, location)
    }
  }

  function alias (
    record,
    location,
    matchAs
  ) {
    var aliasedPath = fillParams(matchAs, location.params, ("aliased route with path \"" + matchAs + "\""));
    var aliasedMatch = match({
      _normalized: true,
      path: aliasedPath
    });
    if (aliasedMatch) {
      var matched = aliasedMatch.matched;
      var aliasedRecord = matched[matched.length - 1];
      location.params = aliasedMatch.params;
      return _createRoute(aliasedRecord, location)
    }
    return _createRoute(null, location)
  }

  function _createRoute (
    record,
    location,
    redirectedFrom
  ) {
    if (record && record.redirect) {
      return redirect(record, redirectedFrom || location)
    }
    if (record && record.matchAs) {
      return alias(record, location, record.matchAs)
    }
    return createRoute(record, location, redirectedFrom, router)
  }

  return {
    match: match,
    addRoutes: addRoutes
  }
}

function matchRoute (
  regex,
  path,
  params
) {
  var m = path.match(regex);

  if (!m) {
    return false
  } else if (!params) {
    return true
  }

  for (var i = 1, len = m.length; i < len; ++i) {
    var key = regex.keys[i - 1];
    var val = typeof m[i] === 'string' ? decodeURIComponent(m[i]) : m[i];
    if (key) {
      params[key.name] = val;
    }
  }

  return true
}

function resolveRecordPath (path, record) {
  return resolvePath(path, record.parent ? record.parent.path : '/', true)
}

/*  */


var positionStore = Object.create(null);

function setupScroll () {
  // Fix for #1585 for Firefox
  window.history.replaceState({ key: getStateKey() }, '');
  window.addEventListener('popstate', function (e) {
    saveScrollPosition();
    if (e.state && e.state.key) {
      setStateKey(e.state.key);
    }
  });
}

function handleScroll (
  router,
  to,
  from,
  isPop
) {
  if (!router.app) {
    return
  }

  var behavior = router.options.scrollBehavior;
  if (!behavior) {
    return
  }

  if (false) {}

  // wait until re-render finishes before scrolling
  router.app.$nextTick(function () {
    var position = getScrollPosition();
    var shouldScroll = behavior(to, from, isPop ? position : null);

    if (!shouldScroll) {
      return
    }

    if (typeof shouldScroll.then === 'function') {
      shouldScroll.then(function (shouldScroll) {
        scrollToPosition((shouldScroll), position);
      }).catch(function (err) {
        if (false) {}
      });
    } else {
      scrollToPosition(shouldScroll, position);
    }
  });
}

function saveScrollPosition () {
  var key = getStateKey();
  if (key) {
    positionStore[key] = {
      x: window.pageXOffset,
      y: window.pageYOffset
    };
  }
}

function getScrollPosition () {
  var key = getStateKey();
  if (key) {
    return positionStore[key]
  }
}

function getElementPosition (el, offset) {
  var docEl = document.documentElement;
  var docRect = docEl.getBoundingClientRect();
  var elRect = el.getBoundingClientRect();
  return {
    x: elRect.left - docRect.left - offset.x,
    y: elRect.top - docRect.top - offset.y
  }
}

function isValidPosition (obj) {
  return isNumber(obj.x) || isNumber(obj.y)
}

function normalizePosition (obj) {
  return {
    x: isNumber(obj.x) ? obj.x : window.pageXOffset,
    y: isNumber(obj.y) ? obj.y : window.pageYOffset
  }
}

function normalizeOffset (obj) {
  return {
    x: isNumber(obj.x) ? obj.x : 0,
    y: isNumber(obj.y) ? obj.y : 0
  }
}

function isNumber (v) {
  return typeof v === 'number'
}

function scrollToPosition (shouldScroll, position) {
  var isObject = typeof shouldScroll === 'object';
  if (isObject && typeof shouldScroll.selector === 'string') {
    var el = document.querySelector(shouldScroll.selector);
    if (el) {
      var offset = shouldScroll.offset && typeof shouldScroll.offset === 'object' ? shouldScroll.offset : {};
      offset = normalizeOffset(offset);
      position = getElementPosition(el, offset);
    } else if (isValidPosition(shouldScroll)) {
      position = normalizePosition(shouldScroll);
    }
  } else if (isObject && isValidPosition(shouldScroll)) {
    position = normalizePosition(shouldScroll);
  }

  if (position) {
    window.scrollTo(position.x, position.y);
  }
}

/*  */

var supportsPushState = inBrowser && (function () {
  var ua = window.navigator.userAgent;

  if (
    (ua.indexOf('Android 2.') !== -1 || ua.indexOf('Android 4.0') !== -1) &&
    ua.indexOf('Mobile Safari') !== -1 &&
    ua.indexOf('Chrome') === -1 &&
    ua.indexOf('Windows Phone') === -1
  ) {
    return false
  }

  return window.history && 'pushState' in window.history
})();

// use User Timing api (if present) for more accurate key precision
var Time = inBrowser && window.performance && window.performance.now
  ? window.performance
  : Date;

var _key = genKey();

function genKey () {
  return Time.now().toFixed(3)
}

function getStateKey () {
  return _key
}

function setStateKey (key) {
  _key = key;
}

function pushState (url, replace) {
  saveScrollPosition();
  // try...catch the pushState call to get around Safari
  // DOM Exception 18 where it limits to 100 pushState calls
  var history = window.history;
  try {
    if (replace) {
      history.replaceState({ key: _key }, '', url);
    } else {
      _key = genKey();
      history.pushState({ key: _key }, '', url);
    }
  } catch (e) {
    window.location[replace ? 'replace' : 'assign'](url);
  }
}

function replaceState (url) {
  pushState(url, true);
}

/*  */

function runQueue (queue, fn, cb) {
  var step = function (index) {
    if (index >= queue.length) {
      cb();
    } else {
      if (queue[index]) {
        fn(queue[index], function () {
          step(index + 1);
        });
      } else {
        step(index + 1);
      }
    }
  };
  step(0);
}

/*  */

function resolveAsyncComponents (matched) {
  return function (to, from, next) {
    var hasAsync = false;
    var pending = 0;
    var error = null;

    flatMapComponents(matched, function (def, _, match, key) {
      // if it's a function and doesn't have cid attached,
      // assume it's an async component resolve function.
      // we are not using Vue's default async resolving mechanism because
      // we want to halt the navigation until the incoming component has been
      // resolved.
      if (typeof def === 'function' && def.cid === undefined) {
        hasAsync = true;
        pending++;

        var resolve = once(function (resolvedDef) {
          if (isESModule(resolvedDef)) {
            resolvedDef = resolvedDef.default;
          }
          // save resolved on async factory in case it's used elsewhere
          def.resolved = typeof resolvedDef === 'function'
            ? resolvedDef
            : _Vue.extend(resolvedDef);
          match.components[key] = resolvedDef;
          pending--;
          if (pending <= 0) {
            next();
          }
        });

        var reject = once(function (reason) {
          var msg = "Failed to resolve async component " + key + ": " + reason;
          "production" !== 'production' && warn(false, msg);
          if (!error) {
            error = isError(reason)
              ? reason
              : new Error(msg);
            next(error);
          }
        });

        var res;
        try {
          res = def(resolve, reject);
        } catch (e) {
          reject(e);
        }
        if (res) {
          if (typeof res.then === 'function') {
            res.then(resolve, reject);
          } else {
            // new syntax in Vue 2.3
            var comp = res.component;
            if (comp && typeof comp.then === 'function') {
              comp.then(resolve, reject);
            }
          }
        }
      }
    });

    if (!hasAsync) { next(); }
  }
}

function flatMapComponents (
  matched,
  fn
) {
  return flatten(matched.map(function (m) {
    return Object.keys(m.components).map(function (key) { return fn(
      m.components[key],
      m.instances[key],
      m, key
    ); })
  }))
}

function flatten (arr) {
  return Array.prototype.concat.apply([], arr)
}

var hasSymbol =
  typeof Symbol === 'function' &&
  typeof Symbol.toStringTag === 'symbol';

function isESModule (obj) {
  return obj.__esModule || (hasSymbol && obj[Symbol.toStringTag] === 'Module')
}

// in Webpack 2, require.ensure now also returns a Promise
// so the resolve/reject functions may get called an extra time
// if the user uses an arrow function shorthand that happens to
// return that Promise.
function once (fn) {
  var called = false;
  return function () {
    var args = [], len = arguments.length;
    while ( len-- ) args[ len ] = arguments[ len ];

    if (called) { return }
    called = true;
    return fn.apply(this, args)
  }
}

/*  */

var History = function History (router, base) {
  this.router = router;
  this.base = normalizeBase(base);
  // start with a route object that stands for "nowhere"
  this.current = START;
  this.pending = null;
  this.ready = false;
  this.readyCbs = [];
  this.readyErrorCbs = [];
  this.errorCbs = [];
};

History.prototype.listen = function listen (cb) {
  this.cb = cb;
};

History.prototype.onReady = function onReady (cb, errorCb) {
  if (this.ready) {
    cb();
  } else {
    this.readyCbs.push(cb);
    if (errorCb) {
      this.readyErrorCbs.push(errorCb);
    }
  }
};

History.prototype.onError = function onError (errorCb) {
  this.errorCbs.push(errorCb);
};

History.prototype.transitionTo = function transitionTo (location, onComplete, onAbort) {
    var this$1 = this;

  var route = this.router.match(location, this.current);
  this.confirmTransition(route, function () {
    this$1.updateRoute(route);
    onComplete && onComplete(route);
    this$1.ensureURL();

    // fire ready cbs once
    if (!this$1.ready) {
      this$1.ready = true;
      this$1.readyCbs.forEach(function (cb) { cb(route); });
    }
  }, function (err) {
    if (onAbort) {
      onAbort(err);
    }
    if (err && !this$1.ready) {
      this$1.ready = true;
      this$1.readyErrorCbs.forEach(function (cb) { cb(err); });
    }
  });
};

History.prototype.confirmTransition = function confirmTransition (route, onComplete, onAbort) {
    var this$1 = this;

  var current = this.current;
  var abort = function (err) {
    if (isError(err)) {
      if (this$1.errorCbs.length) {
        this$1.errorCbs.forEach(function (cb) { cb(err); });
      } else {
        warn(false, 'uncaught error during route navigation:');
        console.error(err);
      }
    }
    onAbort && onAbort(err);
  };
  if (
    isSameRoute(route, current) &&
    // in the case the route map has been dynamically appended to
    route.matched.length === current.matched.length
  ) {
    this.ensureURL();
    return abort()
  }

  var ref = resolveQueue(this.current.matched, route.matched);
    var updated = ref.updated;
    var deactivated = ref.deactivated;
    var activated = ref.activated;

  var queue = [].concat(
    // in-component leave guards
    extractLeaveGuards(deactivated),
    // global before hooks
    this.router.beforeHooks,
    // in-component update hooks
    extractUpdateHooks(updated),
    // in-config enter guards
    activated.map(function (m) { return m.beforeEnter; }),
    // async components
    resolveAsyncComponents(activated)
  );

  this.pending = route;
  var iterator = function (hook, next) {
    if (this$1.pending !== route) {
      return abort()
    }
    try {
      hook(route, current, function (to) {
        if (to === false || isError(to)) {
          // next(false) -> abort navigation, ensure current URL
          this$1.ensureURL(true);
          abort(to);
        } else if (
          typeof to === 'string' ||
          (typeof to === 'object' && (
            typeof to.path === 'string' ||
            typeof to.name === 'string'
          ))
        ) {
          // next('/') or next({ path: '/' }) -> redirect
          abort();
          if (typeof to === 'object' && to.replace) {
            this$1.replace(to);
          } else {
            this$1.push(to);
          }
        } else {
          // confirm transition and pass on the value
          next(to);
        }
      });
    } catch (e) {
      abort(e);
    }
  };

  runQueue(queue, iterator, function () {
    var postEnterCbs = [];
    var isValid = function () { return this$1.current === route; };
    // wait until async components are resolved before
    // extracting in-component enter guards
    var enterGuards = extractEnterGuards(activated, postEnterCbs, isValid);
    var queue = enterGuards.concat(this$1.router.resolveHooks);
    runQueue(queue, iterator, function () {
      if (this$1.pending !== route) {
        return abort()
      }
      this$1.pending = null;
      onComplete(route);
      if (this$1.router.app) {
        this$1.router.app.$nextTick(function () {
          postEnterCbs.forEach(function (cb) { cb(); });
        });
      }
    });
  });
};

History.prototype.updateRoute = function updateRoute (route) {
  var prev = this.current;
  this.current = route;
  this.cb && this.cb(route);
  this.router.afterHooks.forEach(function (hook) {
    hook && hook(route, prev);
  });
};

function normalizeBase (base) {
  if (!base) {
    if (inBrowser) {
      // respect <base> tag
      var baseEl = document.querySelector('base');
      base = (baseEl && baseEl.getAttribute('href')) || '/';
      // strip full URL origin
      base = base.replace(/^https?:\/\/[^\/]+/, '');
    } else {
      base = '/';
    }
  }
  // make sure there's the starting slash
  if (base.charAt(0) !== '/') {
    base = '/' + base;
  }
  // remove trailing slash
  return base.replace(/\/$/, '')
}

function resolveQueue (
  current,
  next
) {
  var i;
  var max = Math.max(current.length, next.length);
  for (i = 0; i < max; i++) {
    if (current[i] !== next[i]) {
      break
    }
  }
  return {
    updated: next.slice(0, i),
    activated: next.slice(i),
    deactivated: current.slice(i)
  }
}

function extractGuards (
  records,
  name,
  bind,
  reverse
) {
  var guards = flatMapComponents(records, function (def, instance, match, key) {
    var guard = extractGuard(def, name);
    if (guard) {
      return Array.isArray(guard)
        ? guard.map(function (guard) { return bind(guard, instance, match, key); })
        : bind(guard, instance, match, key)
    }
  });
  return flatten(reverse ? guards.reverse() : guards)
}

function extractGuard (
  def,
  key
) {
  if (typeof def !== 'function') {
    // extend now so that global mixins are applied.
    def = _Vue.extend(def);
  }
  return def.options[key]
}

function extractLeaveGuards (deactivated) {
  return extractGuards(deactivated, 'beforeRouteLeave', bindGuard, true)
}

function extractUpdateHooks (updated) {
  return extractGuards(updated, 'beforeRouteUpdate', bindGuard)
}

function bindGuard (guard, instance) {
  if (instance) {
    return function boundRouteGuard () {
      return guard.apply(instance, arguments)
    }
  }
}

function extractEnterGuards (
  activated,
  cbs,
  isValid
) {
  return extractGuards(activated, 'beforeRouteEnter', function (guard, _, match, key) {
    return bindEnterGuard(guard, match, key, cbs, isValid)
  })
}

function bindEnterGuard (
  guard,
  match,
  key,
  cbs,
  isValid
) {
  return function routeEnterGuard (to, from, next) {
    return guard(to, from, function (cb) {
      next(cb);
      if (typeof cb === 'function') {
        cbs.push(function () {
          // #750
          // if a router-view is wrapped with an out-in transition,
          // the instance may not have been registered at this time.
          // we will need to poll for registration until current route
          // is no longer valid.
          poll(cb, match.instances, key, isValid);
        });
      }
    })
  }
}

function poll (
  cb, // somehow flow cannot infer this is a function
  instances,
  key,
  isValid
) {
  if (instances[key]) {
    cb(instances[key]);
  } else if (isValid()) {
    setTimeout(function () {
      poll(cb, instances, key, isValid);
    }, 16);
  }
}

/*  */


var HTML5History = (function (History$$1) {
  function HTML5History (router, base) {
    var this$1 = this;

    History$$1.call(this, router, base);

    var expectScroll = router.options.scrollBehavior;

    if (expectScroll) {
      setupScroll();
    }

    var initLocation = getLocation(this.base);
    window.addEventListener('popstate', function (e) {
      var current = this$1.current;

      // Avoiding first `popstate` event dispatched in some browsers but first
      // history route not updated since async guard at the same time.
      var location = getLocation(this$1.base);
      if (this$1.current === START && location === initLocation) {
        return
      }

      this$1.transitionTo(location, function (route) {
        if (expectScroll) {
          handleScroll(router, route, current, true);
        }
      });
    });
  }

  if ( History$$1 ) HTML5History.__proto__ = History$$1;
  HTML5History.prototype = Object.create( History$$1 && History$$1.prototype );
  HTML5History.prototype.constructor = HTML5History;

  HTML5History.prototype.go = function go (n) {
    window.history.go(n);
  };

  HTML5History.prototype.push = function push (location, onComplete, onAbort) {
    var this$1 = this;

    var ref = this;
    var fromRoute = ref.current;
    this.transitionTo(location, function (route) {
      pushState(cleanPath(this$1.base + route.fullPath));
      handleScroll(this$1.router, route, fromRoute, false);
      onComplete && onComplete(route);
    }, onAbort);
  };

  HTML5History.prototype.replace = function replace (location, onComplete, onAbort) {
    var this$1 = this;

    var ref = this;
    var fromRoute = ref.current;
    this.transitionTo(location, function (route) {
      replaceState(cleanPath(this$1.base + route.fullPath));
      handleScroll(this$1.router, route, fromRoute, false);
      onComplete && onComplete(route);
    }, onAbort);
  };

  HTML5History.prototype.ensureURL = function ensureURL (push) {
    if (getLocation(this.base) !== this.current.fullPath) {
      var current = cleanPath(this.base + this.current.fullPath);
      push ? pushState(current) : replaceState(current);
    }
  };

  HTML5History.prototype.getCurrentLocation = function getCurrentLocation () {
    return getLocation(this.base)
  };

  return HTML5History;
}(History));

function getLocation (base) {
  var path = window.location.pathname;
  if (base && path.indexOf(base) === 0) {
    path = path.slice(base.length);
  }
  return (path || '/') + window.location.search + window.location.hash
}

/*  */


var HashHistory = (function (History$$1) {
  function HashHistory (router, base, fallback) {
    History$$1.call(this, router, base);
    // check history fallback deeplinking
    if (fallback && checkFallback(this.base)) {
      return
    }
    ensureSlash();
  }

  if ( History$$1 ) HashHistory.__proto__ = History$$1;
  HashHistory.prototype = Object.create( History$$1 && History$$1.prototype );
  HashHistory.prototype.constructor = HashHistory;

  // this is delayed until the app mounts
  // to avoid the hashchange listener being fired too early
  HashHistory.prototype.setupListeners = function setupListeners () {
    var this$1 = this;

    var router = this.router;
    var expectScroll = router.options.scrollBehavior;
    var supportsScroll = supportsPushState && expectScroll;

    if (supportsScroll) {
      setupScroll();
    }

    window.addEventListener(supportsPushState ? 'popstate' : 'hashchange', function () {
      var current = this$1.current;
      if (!ensureSlash()) {
        return
      }
      this$1.transitionTo(getHash(), function (route) {
        if (supportsScroll) {
          handleScroll(this$1.router, route, current, true);
        }
        if (!supportsPushState) {
          replaceHash(route.fullPath);
        }
      });
    });
  };

  HashHistory.prototype.push = function push (location, onComplete, onAbort) {
    var this$1 = this;

    var ref = this;
    var fromRoute = ref.current;
    this.transitionTo(location, function (route) {
      pushHash(route.fullPath);
      handleScroll(this$1.router, route, fromRoute, false);
      onComplete && onComplete(route);
    }, onAbort);
  };

  HashHistory.prototype.replace = function replace (location, onComplete, onAbort) {
    var this$1 = this;

    var ref = this;
    var fromRoute = ref.current;
    this.transitionTo(location, function (route) {
      replaceHash(route.fullPath);
      handleScroll(this$1.router, route, fromRoute, false);
      onComplete && onComplete(route);
    }, onAbort);
  };

  HashHistory.prototype.go = function go (n) {
    window.history.go(n);
  };

  HashHistory.prototype.ensureURL = function ensureURL (push) {
    var current = this.current.fullPath;
    if (getHash() !== current) {
      push ? pushHash(current) : replaceHash(current);
    }
  };

  HashHistory.prototype.getCurrentLocation = function getCurrentLocation () {
    return getHash()
  };

  return HashHistory;
}(History));

function checkFallback (base) {
  var location = getLocation(base);
  if (!/^\/#/.test(location)) {
    window.location.replace(
      cleanPath(base + '/#' + location)
    );
    return true
  }
}

function ensureSlash () {
  var path = getHash();
  if (path.charAt(0) === '/') {
    return true
  }
  replaceHash('/' + path);
  return false
}

function getHash () {
  // We can't use window.location.hash here because it's not
  // consistent across browsers - Firefox will pre-decode it!
  var href = window.location.href;
  var index = href.indexOf('#');
  return index === -1 ? '' : href.slice(index + 1)
}

function getUrl (path) {
  var href = window.location.href;
  var i = href.indexOf('#');
  var base = i >= 0 ? href.slice(0, i) : href;
  return (base + "#" + path)
}

function pushHash (path) {
  if (supportsPushState) {
    pushState(getUrl(path));
  } else {
    window.location.hash = path;
  }
}

function replaceHash (path) {
  if (supportsPushState) {
    replaceState(getUrl(path));
  } else {
    window.location.replace(getUrl(path));
  }
}

/*  */


var AbstractHistory = (function (History$$1) {
  function AbstractHistory (router, base) {
    History$$1.call(this, router, base);
    this.stack = [];
    this.index = -1;
  }

  if ( History$$1 ) AbstractHistory.__proto__ = History$$1;
  AbstractHistory.prototype = Object.create( History$$1 && History$$1.prototype );
  AbstractHistory.prototype.constructor = AbstractHistory;

  AbstractHistory.prototype.push = function push (location, onComplete, onAbort) {
    var this$1 = this;

    this.transitionTo(location, function (route) {
      this$1.stack = this$1.stack.slice(0, this$1.index + 1).concat(route);
      this$1.index++;
      onComplete && onComplete(route);
    }, onAbort);
  };

  AbstractHistory.prototype.replace = function replace (location, onComplete, onAbort) {
    var this$1 = this;

    this.transitionTo(location, function (route) {
      this$1.stack = this$1.stack.slice(0, this$1.index).concat(route);
      onComplete && onComplete(route);
    }, onAbort);
  };

  AbstractHistory.prototype.go = function go (n) {
    var this$1 = this;

    var targetIndex = this.index + n;
    if (targetIndex < 0 || targetIndex >= this.stack.length) {
      return
    }
    var route = this.stack[targetIndex];
    this.confirmTransition(route, function () {
      this$1.index = targetIndex;
      this$1.updateRoute(route);
    });
  };

  AbstractHistory.prototype.getCurrentLocation = function getCurrentLocation () {
    var current = this.stack[this.stack.length - 1];
    return current ? current.fullPath : '/'
  };

  AbstractHistory.prototype.ensureURL = function ensureURL () {
    // noop
  };

  return AbstractHistory;
}(History));

/*  */

var VueRouter = function VueRouter (options) {
  if ( options === void 0 ) options = {};

  this.app = null;
  this.apps = [];
  this.options = options;
  this.beforeHooks = [];
  this.resolveHooks = [];
  this.afterHooks = [];
  this.matcher = createMatcher(options.routes || [], this);

  var mode = options.mode || 'hash';
  this.fallback = mode === 'history' && !supportsPushState && options.fallback !== false;
  if (this.fallback) {
    mode = 'hash';
  }
  if (!inBrowser) {
    mode = 'abstract';
  }
  this.mode = mode;

  switch (mode) {
    case 'history':
      this.history = new HTML5History(this, options.base);
      break
    case 'hash':
      this.history = new HashHistory(this, options.base, this.fallback);
      break
    case 'abstract':
      this.history = new AbstractHistory(this, options.base);
      break
    default:
      if (false) {}
  }
};

var prototypeAccessors = { currentRoute: { configurable: true } };

VueRouter.prototype.match = function match (
  raw,
  current,
  redirectedFrom
) {
  return this.matcher.match(raw, current, redirectedFrom)
};

prototypeAccessors.currentRoute.get = function () {
  return this.history && this.history.current
};

VueRouter.prototype.init = function init (app /* Vue component instance */) {
    var this$1 = this;

  "production" !== 'production' && assert(
    install.installed,
    "not installed. Make sure to call `Vue.use(VueRouter)` " +
    "before creating root instance."
  );

  this.apps.push(app);

  // main app already initialized.
  if (this.app) {
    return
  }

  this.app = app;

  var history = this.history;

  if (history instanceof HTML5History) {
    history.transitionTo(history.getCurrentLocation());
  } else if (history instanceof HashHistory) {
    var setupHashListener = function () {
      history.setupListeners();
    };
    history.transitionTo(
      history.getCurrentLocation(),
      setupHashListener,
      setupHashListener
    );
  }

  history.listen(function (route) {
    this$1.apps.forEach(function (app) {
      app._route = route;
    });
  });
};

VueRouter.prototype.beforeEach = function beforeEach (fn) {
  return registerHook(this.beforeHooks, fn)
};

VueRouter.prototype.beforeResolve = function beforeResolve (fn) {
  return registerHook(this.resolveHooks, fn)
};

VueRouter.prototype.afterEach = function afterEach (fn) {
  return registerHook(this.afterHooks, fn)
};

VueRouter.prototype.onReady = function onReady (cb, errorCb) {
  this.history.onReady(cb, errorCb);
};

VueRouter.prototype.onError = function onError (errorCb) {
  this.history.onError(errorCb);
};

VueRouter.prototype.push = function push (location, onComplete, onAbort) {
  this.history.push(location, onComplete, onAbort);
};

VueRouter.prototype.replace = function replace (location, onComplete, onAbort) {
  this.history.replace(location, onComplete, onAbort);
};

VueRouter.prototype.go = function go (n) {
  this.history.go(n);
};

VueRouter.prototype.back = function back () {
  this.go(-1);
};

VueRouter.prototype.forward = function forward () {
  this.go(1);
};

VueRouter.prototype.getMatchedComponents = function getMatchedComponents (to) {
  var route = to
    ? to.matched
      ? to
      : this.resolve(to).route
    : this.currentRoute;
  if (!route) {
    return []
  }
  return [].concat.apply([], route.matched.map(function (m) {
    return Object.keys(m.components).map(function (key) {
      return m.components[key]
    })
  }))
};

VueRouter.prototype.resolve = function resolve (
  to,
  current,
  append
) {
  var location = normalizeLocation(
    to,
    current || this.history.current,
    append,
    this
  );
  var route = this.match(location, current);
  var fullPath = route.redirectedFrom || route.fullPath;
  var base = this.history.base;
  var href = createHref(base, fullPath, this.mode);
  return {
    location: location,
    route: route,
    href: href,
    // for backwards compat
    normalizedTo: location,
    resolved: route
  }
};

VueRouter.prototype.addRoutes = function addRoutes (routes) {
  this.matcher.addRoutes(routes);
  if (this.history.current !== START) {
    this.history.transitionTo(this.history.getCurrentLocation());
  }
};

Object.defineProperties( VueRouter.prototype, prototypeAccessors );

function registerHook (list, fn) {
  list.push(fn);
  return function () {
    var i = list.indexOf(fn);
    if (i > -1) { list.splice(i, 1); }
  }
}

function createHref (base, fullPath, mode) {
  var path = mode === 'hash' ? '#' + fullPath : fullPath;
  return base ? cleanPath(base + '/' + path) : path
}

VueRouter.install = install;
VueRouter.version = '3.0.1';

if (inBrowser && window.Vue) {
  window.Vue.use(VueRouter);
}

/* harmony default export */ var vue_router_esm = (VueRouter);

// CONCATENATED MODULE: ./src/connectors/OaConnector.js


/* harmony default export */ var OaConnector = ({
  /**
       * Loads JSON schema.
       *
       * @param {String} resource Resource to be loaded
       * @param {String} action create | update | get | filter
       
       */
  schema: function schema(resource, action) {
    // eslint-disable-next-line
    var base = abp.schemas.app[resource];
    var data = null;
    if (action == 'create') data = base.create.parameters.input;else if (action == 'update') data = base.update.parameters.input;else if (action == 'get') data = base.get.returnValue;else if (action == 'filter') data = base.getAll.parameters.input;
    return data;
  },

  /**
       * Loads JSON data.
       *
       * @param {String} resource Resource to be loaded
       * @param {String} action create | update | getAll | get | enumAction         
       * @param {Function} onSuccess onSuccess callback
       * @param {Function} onError onError callback
       */
  service: function service(resource, action, data, successCallback, errorCallback, alwaysCallback) {
    // eslint-disable-next-line
    abp.services.app[resource][action](data).done(function (data) {
      if (successCallback) successCallback(data);
    }).fail(function (error) {
      if (errorCallback) errorCallback(error);
    }).always(function () {
      if (alwaysCallback) alwaysCallback();
    });
  },
  messages: function messages(module) {
    // eslint-disable-next-line
    var data = abp.localization.values[module];
    return data;
  },
  componentsPath: function componentsPath() {
    // eslint-disable-next-line
    return abp.appPath + 'lib/vueforms/';
  }
});
// CONCATENATED MODULE: ./src/CrudApp.js




/* harmony default export */ var CrudApp = ({
  create: function create(id, layout) {
    external_commonjs_vue_commonjs2_vue_root_Vue_default.a.use(vue_router_esm);
    external_commonjs_vue_commonjs2_vue_root_Vue_default.a.use(src);
    var crudGrid = external_commonjs_vue_commonjs2_vue_root_Vue_default.a.component('oa-crud-grid');
    var crudForm = external_commonjs_vue_commonjs2_vue_root_Vue_default.a.component('oa-crud-form'); // const crudGrid = Vue.component('OaCrudGrid');
    // const crudForm = Vue.component('OaCrudForm');

    var router = new vue_router_esm({
      //scrollBehavior: () => ({ y: 0 }),
      routes: [{
        path: '/:module/:resource',
        component: crudGrid,
        name: 'grid'
      }, {
        path: '/:module/:resource/edit/:id',
        component: crudForm,
        name: 'edit'
      }, {
        path: '/:module/:resource/add',
        component: crudForm,
        name: 'add'
      }]
    });
    new external_commonjs_vue_commonjs2_vue_root_Vue_default.a({
      router: router,
      connector: OaConnector,
      //render: h => h('router-view')
      //render: h => h(layout, [h('router-view')]),
      render: function render(h) {
        return h(layout, {
          scopedSlots: {
            default: function _default() {
              return h('router-view');
            }
          },
          props: {
            title: this.pageTitle
          }
        });
      },
      computed: {
        messages: function messages() {
          return OaConnector.messages(this.$route.params.module);
        },
        pageTitle: function pageTitle() {
          if (this.$route.params.resource) {
            var key = this.$route.params.resource.capitalize() + 's';
            var title = this.messages[[this.$route.params.resource.capitalize() + 's']];
            return title ? title : key;
          } else {
            return 'Crud app';
          }
        }
      }
    }).$mount(id);
  }
});
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"C://sacha//vue//vuecrud//node_modules//.cache//vue-loader","cacheIdentifier":"2c4efe34-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/address.vue?vue&type=template&id=3950c2fd&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"el-input"},[_c('input',{directives:[{name:"model",rawName:"v-model",value:(_vm.autocompleteText),expression:"autocompleteText"}],ref:"autocompvare",staticClass:"el-input__inner",staticStyle:{"width":"500px"},attrs:{"type":"text","id":_vm.id,"placeholder":_vm.placeholder},domProps:{"value":(_vm.autocompleteText)},on:{"focus":function($event){_vm.onFocus()},"blur":function($event){_vm.onBlur()},"change":_vm.onChange,"keypress":_vm.onKeyPress,"input":function($event){if($event.target.composing){ return; }_vm.autocompleteText=$event.target.value}}})])}
var staticRenderFns = []


// CONCATENATED MODULE: ./src/components/address.vue?vue&type=template&id=3950c2fd&

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/vue-loader/lib??vue-loader-options!./src/components/address.vue?vue&type=script&lang=js&
//
//
//
//
//
//

/* harmony default export */ var addressvue_type_script_lang_js_ = ({
  name: 'oa-address',
  props: {
    value: Object,
    prop: String,
    schema: {},
    options: {},
    messages: {},
    id: {
      type: String,
      // required: true,
      default: function _default() {
        return 'address' + Math.floor(Math.random() * 1000 + 1);
      }
    },
    placeholder: {
      type: String,
      default: 'Start typing'
    },
    types: {
      type: String,
      default: 'address'
    },
    country: {
      type: [String, Array],
      default: null
    },
    enableGeolocation: {
      type: Boolean,
      default: false
    }
  },
  data: function data() {
    return {
      /**
       * The Autocomplete object.
       *
       * @type {Autocomplete}
       * @link https://developers.google.com/maps/documentation/javascript/reference#Autocomplete
       */
      autocomplete: null,

      /**
       * Autocomplete input text
       * @type {String}
       */
      autocompleteText: ''
    };
  },
  watch: {
    autocompleteText: function autocompleteText(newVal, oldVal) {
      this.$emit('inputChange', {
        newVal: newVal,
        oldVal: oldVal
      });
    }
  },
  mounted: function mounted() {
    var self = this;
    ensureGoogleMaps({
      libraries: ['places'],
      key: 'AIzaSyCe1exctmeJjIb4guyT6newSpyJ7kA3aLc',
      client: '',
      version: '3',
      loadGoogleApi: true
    }, function (xgoogle) {
      var options = {};

      if (self.types) {
        options.types = [self.types];
      }

      if (self.country) {
        options.componentRestrictions = {
          country: self.country
        };
      }

      self.autocomplete = new google.maps.places.Autocomplete(document.getElementById(self.id), options);
      self.autocomplete.addListener('place_changed', function () {
        var place = self.autocomplete.getPlace();

        if (!place.geometry) {
          // User entered the name of a Place that was not suggested and
          // pressed the Enter key, or the Place Details request failed.
          self.$emit('no-results-found', place);
          return;
        }

        var addressComponents = {
          street_number: 'short_name',
          route: 'long_name',
          locality: 'long_name',
          administrative_area_level_1: 'short_name',
          country: 'long_name',
          postal_code: 'short_name'
        };
        var returnData = {};

        if (place.address_components !== undefined) {
          // Get each component of the address from the place details
          for (var i = 0; i < place.address_components.length; i++) {
            var addressType = place.address_components[i].types[0];

            if (addressComponents[addressType]) {
              var val = place.address_components[i][addressComponents[addressType]];
              returnData[addressType] = val;
            }
          }

          returnData['latitude'] = place.geometry.location.lat();
          returnData['longitude'] = place.geometry.location.lng(); // return returnData object and PlaceResult object
          // this.$emit('placechanged', returnData, place, this.id);
          // update autocompleteText then emit change event

          self.autocompleteText = document.getElementById(self.id).value;
          self.onChange();
          self.$emit('propChange', 'street', returnData.route + (returnData.street_number ? ' ' + returnData.street_number : ''));
          self.$emit('propChange', 'postalCode', returnData.postal_code);
          self.$emit('propChange', 'city', returnData.locality);
          self.$emit('propChange', 'country', returnData.country);
        }
      });
    });
  },
  methods: {
    /**
     * When the input gets focus
     */
    onFocus: function onFocus() {
      this.geolocate();
      this.$emit('focus');
    },

    /**
     * When the input loses focus
     */
    onBlur: function onBlur() {
      this.$emit('blur');
    },

    /**
     * When the input got changed
     */
    onChange: function onChange() {
      this.$emit('change', this.autocompleteText);
    },

    /**
     * When a key gets pressed
     * @param  {Event} event A keypress event
     */
    onKeyPress: function onKeyPress(event) {
      this.$emit('keypress', event);
    },

    /**
     * Clear the input
     */
    clear: function clear() {
      this.autocompleteText = '';
    },

    /**
     * Focus the input
     */
    focus: function focus() {
      this.$refs.autocomplete.focus();
    },

    /**
     * Blur the input
     */
    blur: function blur() {
      this.$refs.autocomplete.blur();
    },
    // Bias the autocomplete object to the user's geographical location,
    // as supplied by the browser's 'navigator.geolocation' object.
    geolocate: function geolocate() {
      if (this.enableGeolocation) {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function (position) {
            var geolocation = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
            var circle = new google.maps.Circle({
              center: geolocation,
              radius: position.coords.accuracy
            });
            this.autocomplete.setBounds(circle.getBounds());
          });
        }
      }
    }
  },
  computed: {
    model: {
      get: function get() {
        return this.value;
      },
      set: function set(val) {
        this.$emit('input', val);
      }
    },
    properties: function properties() {
      return this.schema.properties;
    },
    fields: function fields() {
      var fields = {};

      for (var key in this.schema.properties) {
        if (this.columns) {
          if (this.columns.indexOf(key) > 0) {
            fields[key] = this.schema.properties[key];
          }
        } else {
          if (key != 'id' && !this.schema.properties[key].readonly && !this.schema.properties[key]['x-rel-app']) {
            fields[key] = this.schema.properties[key];
          }
        }
      }

      return fields;
    }
  }
});

function ensureGoogleMaps(options, fn) {
  if (!options.loadGoogleApi) {
    fn(window.google.maps ? window.google.maps : window.google);
  } else if (external_commonjs_vue_commonjs2_vue_root_Vue_default.a.google) {
    fn(external_commonjs_vue_commonjs2_vue_root_Vue_default.a.google);
  } else {
    window.loadGoogleMapsAPI({
      key: options.key,
      client: options.client,
      libraries: options.libraries,
      v: options.version
    }, function (google) {
      external_commonjs_vue_commonjs2_vue_root_Vue_default.a.google = google;
      external_commonjs_vue_commonjs2_vue_root_Vue_default.a.prototype.$google = google;
      fn(google);
    });
  }
}

var CALLBACK_NAME = '__googleMapsApiOnLoadCallback';
var OPTIONS_KEYS = ['client', 'key', 'language', 'region', 'v'];

window.loadGoogleMapsAPI = function (options, callback) {
  options = options || {}; // Exit if not running inside a browser.

  if (typeof window === 'undefined') {
    alert('Can only load the Google Maps API in the browser');
  }

  if (window[CALLBACK_NAME]) {
    oldCallBack = window[CALLBACK_NAME];

    window[CALLBACK_NAME] = function () {
      oldCallBack();
      if (callback) callback(window.google.maps);
    };

    return;
  }

  var timeoutId = setTimeout(function () {
    window[CALLBACK_NAME] = function () {}; // Set the on load callback to a no-op.


    alert('Could not load the Google Maps API');
  }, options.timeout || 10000); // Hook up the on load callback.

  window[CALLBACK_NAME] = function () {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }

    if (callback) callback(window.google.maps);
    delete window[CALLBACK_NAME];
  }; // Prepare the `script` tag to be inserted into the page.


  var scriptElement = document.createElement('script');
  var params = ['callback=' + CALLBACK_NAME];
  OPTIONS_KEYS.forEach(function (key) {
    if (options[key]) {
      params.push(key + '=' + options[key]);
    }
  });

  if (options.libraries && options.libraries.length) {
    params.push('libraries=' + options.libraries.join(','));
  }

  scriptElement.src = 'https://maps.googleapis.com/maps/api/js?' + params.join('&'); // Insert the `script` tag.

  document.body.appendChild(scriptElement);
};
// CONCATENATED MODULE: ./src/components/address.vue?vue&type=script&lang=js&
 /* harmony default export */ var components_addressvue_type_script_lang_js_ = (addressvue_type_script_lang_js_); 
// CONCATENATED MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
/* globals __VUE_SSR_CONTEXT__ */

// IMPORTANT: Do NOT use ES2015 features in this file (except for modules).
// This module is a runtime utility for cleaner component module output and will
// be included in the final webpack user bundle.

function normalizeComponent (
  scriptExports,
  render,
  staticRenderFns,
  functionalTemplate,
  injectStyles,
  scopeId,
  moduleIdentifier, /* server only */
  shadowMode /* vue-cli only */
) {
  // Vue.extend constructor export interop
  var options = typeof scriptExports === 'function'
    ? scriptExports.options
    : scriptExports

  // render functions
  if (render) {
    options.render = render
    options.staticRenderFns = staticRenderFns
    options._compiled = true
  }

  // functional template
  if (functionalTemplate) {
    options.functional = true
  }

  // scopedId
  if (scopeId) {
    options._scopeId = 'data-v-' + scopeId
  }

  var hook
  if (moduleIdentifier) { // server build
    hook = function (context) {
      // 2.3 injection
      context =
        context || // cached call
        (this.$vnode && this.$vnode.ssrContext) || // stateful
        (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext) // functional
      // 2.2 with runInNewContext: true
      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__
      }
      // inject component styles
      if (injectStyles) {
        injectStyles.call(this, context)
      }
      // register component module identifier for async chunk inferrence
      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier)
      }
    }
    // used by ssr in case component is cached and beforeCreate
    // never gets called
    options._ssrRegister = hook
  } else if (injectStyles) {
    hook = shadowMode
      ? function () { injectStyles.call(this, this.$root.$options.shadowRoot) }
      : injectStyles
  }

  if (hook) {
    if (options.functional) {
      // for template-only hot-reload because in that case the render fn doesn't
      // go through the normalizer
      options._injectStyles = hook
      // register for functioal component in vue file
      var originalRender = options.render
      options.render = function renderWithStyleInjection (h, context) {
        hook.call(context)
        return originalRender(h, context)
      }
    } else {
      // inject component registration as beforeCreate hook
      var existing = options.beforeCreate
      options.beforeCreate = existing
        ? [].concat(existing, hook)
        : [hook]
    }
  }

  return {
    exports: scriptExports,
    options: options
  }
}

// CONCATENATED MODULE: ./src/components/address.vue





/* normalize component */

var component = normalizeComponent(
  components_addressvue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ var address = (component.exports);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"C://sacha//vue//vuecrud//node_modules//.cache//vue-loader","cacheIdentifier":"2c4efe34-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/checkboxGroup.vue?vue&type=template&id=31d2508e&
var checkboxGroupvue_type_template_id_31d2508e_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('el-checkbox-group',{model:{value:(_vm.model),callback:function ($$v) {_vm.model=$$v},expression:"model"}},_vm._l((_vm.options),function(item){return _c('el-checkbox',{key:item.value,attrs:{"label":item.value}},[_vm._v(_vm._s(item.label))])}))}
var checkboxGroupvue_type_template_id_31d2508e_staticRenderFns = []


// CONCATENATED MODULE: ./src/components/checkboxGroup.vue?vue&type=template&id=31d2508e&

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/vue-loader/lib??vue-loader-options!./src/components/checkboxGroup.vue?vue&type=script&lang=js&
//
//
//
//
//
//
/* harmony default export */ var checkboxGroupvue_type_script_lang_js_ = ({
  name: 'oa-checkbox-group',
  props: {
    value: {
      type: Array,
      default: function _default() {
        return [];
      }
    },
    schema: {},
    prop: String
  },
  data: function data() {
    return {
      options: []
    };
  },
  computed: {
    model: {
      get: function get() {
        return this.value;
      },
      set: function set(val) {
        this.$emit('input', val);
      }
    },
    resource: function resource() {
      return this.$route.params.resource;
    }
  },
  created: function created() {
    var self = this;
    var enumAction = this.schema['x-enum-action'];

    if (enumAction) {
      var enumValueField = this.schema['x-enum-valuefield'];
      var enumTextField = this.schema['x-enum-textfield'] || this.schema['x-enum-valuefield'];
      var service = abp.services.app[self.resource][enumAction];
      service().done(function (data) {
        self.options = data.items.map(function (p) {
          return {
            value: p[enumValueField],
            label: p[enumTextField]
          };
        });
      }).always(function () {// abp.ui.clearBusy(_$app);
      });
    } else if (this.schema.enum) {
      this.options = this.schema.enum.map(function (val) {
        return {
          value: val,
          label: val
        };
      });
    } else {
      return [];
    }
  }
});
// CONCATENATED MODULE: ./src/components/checkboxGroup.vue?vue&type=script&lang=js&
 /* harmony default export */ var components_checkboxGroupvue_type_script_lang_js_ = (checkboxGroupvue_type_script_lang_js_); 
// CONCATENATED MODULE: ./src/components/checkboxGroup.vue





/* normalize component */

var checkboxGroup_component = normalizeComponent(
  components_checkboxGroupvue_type_script_lang_js_,
  checkboxGroupvue_type_template_id_31d2508e_render,
  checkboxGroupvue_type_template_id_31d2508e_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ var checkboxGroup = (checkboxGroup_component.exports);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"C://sacha//vue//vuecrud//node_modules//.cache//vue-loader","cacheIdentifier":"2c4efe34-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/crudform.vue?vue&type=template&id=e675ce80&
var crudformvue_type_template_id_e675ce80_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('oa-form',{ref:"form",attrs:{"model":_vm.model,"schema":_vm.schema,"actions":_vm.actions,"connector":_vm.connector,"resource":_vm.resource,"messages":_vm.messages}})}
var crudformvue_type_template_id_e675ce80_staticRenderFns = []


// CONCATENATED MODULE: ./src/components/crudform.vue?vue&type=template&id=e675ce80&

// CONCATENATED MODULE: ./src/vueforms.js
//import jref from 'json-ref-lite'
var vueforms_VueForms = {};
vueforms_VueForms.jsonSchema = {};

vueforms_VueForms.jsonSchema.getNotNull = function (schema) {
  if (schema.oneOf) {
    var lst = schema.oneOf.filter(function (s) {
      s.type != "null";
    });

    if (lst.length > 0) {
      return lst[0];
    } else {
      return schema;
    }
  } else {
    return schema;
  }
};

vueforms_VueForms.isMobile = function () {
  return window.matchMedia("only screen and (max-width: 760px)").matches;
}; // override .resolve function to prevent stack-overflow issue
//  var _originalResolvefn = jref.resolve;
//  VueForms.jsonSchema.resolve = function (json) {
//      var clone = JSON.parse(JSON.stringify(json)); // create clone because jref.resolve changes the input value; which results (sometimes) in an stack-overflow error if presented a second time 
//      return _originalResolvefn(clone);
//  };


vueforms_VueForms.jsonSchema.resolve = function (json) {
  return json;
};

/* harmony default export */ var vueforms = (vueforms_VueForms);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/vue-loader/lib??vue-loader-options!./src/components/crudform.vue?vue&type=script&lang=js&
//
//
//
//

/* harmony default export */ var crudformvue_type_script_lang_js_ = ({
  name: 'oa-crud-form',
  props: {},
  data: function data() {
    var self = this;
    return {
      model: {},
      actions: [{
        name: 'Save',
        type: 'primary',
        execute: function execute() {
          self.$refs.form.validate(function (valid) {
            if (valid) {
              self.saveData(self.model, function () {
                self.$message({
                  type: 'success',
                  message: 'Save completed'
                });
                self.$router.push({
                  name: 'grid',
                  params: {
                    resource: self.resource
                  }
                });
              });
            } else {
              return false;
            }
          });
        }
      }, {
        name: 'Cancel',
        execute: function execute() {
          self.$router.push({
            name: 'grid',
            params: {
              resource: self.resource
            }
          });
        }
      }]
    };
  },
  computed: {
    module: function module() {
      return this.$route.params.module;
    },
    resource: function resource() {
      return this.$route.params.resource;
    },
    messages: function messages() {
      return this.connector.messages(this.$route.params.module);
    },
    id: function id() {
      return this.$route.params.id;
    },
    isnew: function isnew() {
      return !this.id;
    },
    schema: function schema() {
      if (this.isnew) {
        return vueforms.jsonSchema.resolve(this.connector.schema(this.resource, 'create'));
      } else {
        return vueforms.jsonSchema.resolve(this.connector.schema(this.resource, 'update'));
      }
    },
    options: function options() {
      /*
                if (abp.forms.app[this.resource] && abp.forms.app[this.resource].options)
                    return abp.forms.app[this.resource].options;
                else
                */
      return null;
    },
    connector: function connector() {
      return this.$root.$options.connector;
    }
  },
  methods: {
    fetchData: function fetchData() {
      var self = this;

      if (!this.isnew) {
        self.connector.service(this.resource, 'get', {
          id: self.id
        }, function (data) {
          self.model = data; // this.pagination.totalItems = data.total;
        }, function () {// abp.ui.clearBusy(_$app);
        });
      }
    },
    saveData: function saveData(data, callback) {
      var self = this;

      if (self.isnew) {
        // add
        self.connector.service(this.resource, 'create', data, function () {
          if (callback) callback(); // this.pagination.totalItems = data.total;
        }, function () {// abp.ui.clearBusy(_$app);
        });
      } else {
        // update
        data.id = self.id;
        self.connector.service(this.resource, 'update', data, function () {
          if (callback) callback(); // this.pagination.totalItems = data.total;
        }, function () {// abp.ui.clearBusy(_$app);
        });
      }
    }
  },
  created: function created() {
    // this.$store.commit('setPageTitle', global.helper.i.titleize(global.helper.i.pluralize(this.resource)))
    // this.fetchGrid().then(() => { })
    this.fetchData();
  },
  watch: {
    // call again the method if the route changes
    $route: function $route() {
      this.fetchData();
    }
  }
});
// CONCATENATED MODULE: ./src/components/crudform.vue?vue&type=script&lang=js&
 /* harmony default export */ var components_crudformvue_type_script_lang_js_ = (crudformvue_type_script_lang_js_); 
// CONCATENATED MODULE: ./src/components/crudform.vue





/* normalize component */

var crudform_component = normalizeComponent(
  components_crudformvue_type_script_lang_js_,
  crudformvue_type_template_id_e675ce80_render,
  crudformvue_type_template_id_e675ce80_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ var crudform = (crudform_component.exports);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"C://sacha//vue//vuecrud//node_modules//.cache//vue-loader","cacheIdentifier":"2c4efe34-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/crudgrid.vue?vue&type=template&id=6b6fdb83&
var crudgridvue_type_template_id_6b6fdb83_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',[_c('el-row',{attrs:{"gutter":10}},[_c('el-col',{staticStyle:{"padding-bottom":"20px"},attrs:{"xs":24,"sm":2,"md":2,"lg":2,"xl":2}},_vm._l((_vm.actions),function(action){return _c('el-button',{key:action.name,attrs:{"icon":action.icon,"size":"small","type":action.type},on:{"click":function($event){action.execute()}}},[_vm._v(_vm._s(action.name))])})),_c('el-col',{attrs:{"xs":24,"sm":22,"md":22,"lg":22,"xl":22}},[(_vm.hasFilter)?_c('oa-filter-form',{ref:"filterform",attrs:{"model":_vm.filterModel,"schema":_vm.filterSchema,"connector":_vm.connector,"actions":_vm.filterActions,"messages":_vm.messages}}):_vm._e()],1)],1),_c('oa-grid',{attrs:{"model":_vm.model,"schema":_vm.schema,"messages":_vm.messages,"options":_vm.options,"actions":_vm.gridActions,"default-action":_vm.gridActions[0]}}),_c('br'),_c('div',{staticStyle:{"float":"right","margin-bottom":"10px"}},[_c('el-pagination',{attrs:{"current-page":_vm.currentPage,"page-size":_vm.pageSize,"layout":"total, prev, pager, next","total":_vm.totalCount},on:{"current-change":_vm.currentPageChange,"update:currentPage":function($event){_vm.currentPage=$event}}})],1)],1)}
var crudgridvue_type_template_id_6b6fdb83_staticRenderFns = []


// CONCATENATED MODULE: ./src/components/crudgrid.vue?vue&type=template&id=6b6fdb83&

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/vue-loader/lib??vue-loader-options!./src/components/crudgrid.vue?vue&type=script&lang=js&



//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ var crudgridvue_type_script_lang_js_ = ({
  name: "oa-crud-grid",
  data: function data() {
    return {
      model: [],
      filterModel: {},
      totalCount: 0,
      currentPage: 1,
      pageSize: 10
    };
  },
  computed: {
    module: function module() {
      return this.$route.params.module;
    },
    resource: function resource() {
      return this.$route.params.resource;
    },
    connector: function connector() {
      return this.$root.$options.connector;
    },
    schema: function schema() {
      return vueforms.jsonSchema.resolve(this.connector.schema(this.resource, "get"));
    },
    messages: function messages() {
      return this.connector.messages(this.$route.params.module);
    },
    gridActions: function gridActions() {
      var self = this;
      return [{
        name: self.translate("Edit"),
        icon: "el-icon-edit",
        execute: function execute(row) {
          self.$router.push({
            name: "edit",
            params: {
              resource: self.resource,
              id: row.id
            }
          });
        }
      }, {
        name: self.translate("Delete"),
        icon: "el-icon-delete",
        execute: function execute(row) {
          // eslint-disable-next-line
          self.$confirm("Confirm delete ?", self.translate("Delete"), {
            confirmButtonText: "OK",
            cancelButtonText: "Cancel",
            type: "warning"
          }).then(function () {
            self.deleteData(row, function () {
              self.$message({
                type: "success",
                message: self.translate("Delete completed")
              });
            });
          }).catch(function () {});
        },
        visible: function visible(row) {
          if (typeof row.canDelete !== "undefined") {
            return row.canDelete;
          } else {
            return true;
          }
        }
      }];
    },
    defaultAction: function defaultAction() {
      return this.gridActions[0];
    },
    actions: function actions() {
      var self = this;
      return [{
        // name: self.translate('Add'),
        icon: "el-icon-plus",
        type: "primary",
        execute: function execute() {
          self.$router.push({
            name: "add",
            params: {
              resource: self.resource
            }
          });
        }
      }];
    },
    filterSchema: function filterSchema() {
      var schema = {
        properties: {}
      };
      var action = this.connector.schema(this.resource, "filter").properties;

      for (var key in action) {
        if (key != "skipCount" && key != "maxResultCount") {
          schema.properties[key] = action[key];
        }
      }

      return schema;
    },
    hasFilter: function hasFilter() {
      return Object.keys(this.filterSchema.properties).length > 0;
    },
    filterActions: function filterActions() {
      var self = this;
      return [{
        // name: self.translate('Search'),
        icon: "el-icon-search",
        type: "primary",
        execute: function execute() {
          self.fetchData();
        }
      }, {
        // name: self.translate('Reset'),
        icon: "el-icon-close",
        execute: function execute() {
          self.$refs.filterform.resetForm();
          self.fetchData();
        }
      }];
    },
    options: function options() {
      /*
                      if (abp.grids.app[this.resource] && abp.grids.app[this.resource].options)
                          return abp.grids.app[this.resource].options;
                      else
                          return null;
                        var cols = [];
                      for (var key in this.schema.properties) {
                          cols.push(key);
                      }
                      */
      return null;
    },
    totalPages: function totalPages() {
      return Math.ceil(this.pagination.totalItems / this.pagination.rowsPerPage);
    }
  },
  methods: {
    currentPageChange: function currentPageChange() {
      this.fetchData();
    },
    fetchData: function fetchData(callback) {
      var self = this;
      self.filterModel.skipCount = (this.currentPage - 1) * this.pageSize;
      self.filterModel.maxResultCount = this.pageSize; // { skipCount: 0, maxResultCount: 999 }

      self.connector.service(this.resource, "getAll", self.filterModel, function (data) {
        self.model = data.items;
        self.totalCount = data.totalCount;
        if (callback) callback(); // this.pagination.totalItems = data.total;
      }, function () {// abp.ui.clearBusy(_$app);
      });
    },
    deleteData: function deleteData(data, callback) {
      var self = this;
      self.connector.service(this.resource, "delete", {
        id: data.id
      }, function () {
        self.fetchData(callback);
      }, function () {// abp.ui.clearBusy(_$app);
      });
    },
    translate: function translate(text) {
      if (this.messages && this.messages[text]) return this.messages[text];else return text;
    }
  },
  created: function created() {
    // this.$store.commit('setPageTitle', global.helper.i.titleize(global.helper.i.pluralize(this.resource)))
    // this.fetchGrid().then(() => { })
    this.fetchData();
  },
  watch: {
    // call again the method if the route changes
    $route: function $route() {
      this.fetchData();
    }
  }
});
// CONCATENATED MODULE: ./src/components/crudgrid.vue?vue&type=script&lang=js&
 /* harmony default export */ var components_crudgridvue_type_script_lang_js_ = (crudgridvue_type_script_lang_js_); 
// CONCATENATED MODULE: ./src/components/crudgrid.vue





/* normalize component */

var crudgrid_component = normalizeComponent(
  components_crudgridvue_type_script_lang_js_,
  crudgridvue_type_template_id_6b6fdb83_render,
  crudgridvue_type_template_id_6b6fdb83_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ var crudgrid = (crudgrid_component.exports);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"C://sacha//vue//vuecrud//node_modules//.cache//vue-loader","cacheIdentifier":"2c4efe34-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/date.vue?vue&type=template&id=5577feee&
var datevue_type_template_id_5577feee_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('el-date-picker',{attrs:{"type":"date","format":"dd/MM/yyyy"},model:{value:(_vm.model),callback:function ($$v) {_vm.model=$$v},expression:"model"}})}
var datevue_type_template_id_5577feee_staticRenderFns = []


// CONCATENATED MODULE: ./src/components/date.vue?vue&type=template&id=5577feee&

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/vue-loader/lib??vue-loader-options!./src/components/date.vue?vue&type=script&lang=js&
//
//
//
/* harmony default export */ var datevue_type_script_lang_js_ = ({
  name: "oa-date",
  props: {
    value: {},
    schema: {},
    prop: String,
    options: {}
  },
  computed: {
    model: {
      get: function get() {
        return this.value;
      },
      set: function set(val) {
        this.$emit("input", val);
      }
    }
  }
});
// CONCATENATED MODULE: ./src/components/date.vue?vue&type=script&lang=js&
 /* harmony default export */ var components_datevue_type_script_lang_js_ = (datevue_type_script_lang_js_); 
// CONCATENATED MODULE: ./src/components/date.vue





/* normalize component */

var date_component = normalizeComponent(
  components_datevue_type_script_lang_js_,
  datevue_type_template_id_5577feee_render,
  datevue_type_template_id_5577feee_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ var date = (date_component.exports);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"C://sacha//vue//vuecrud//node_modules//.cache//vue-loader","cacheIdentifier":"2c4efe34-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/datetime.vue?vue&type=template&id=61f2142e&
var datetimevue_type_template_id_61f2142e_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('el-date-picker',{attrs:{"type":"datetime","format":"dd/MM/yyyy HH:mm"},model:{value:(_vm.model),callback:function ($$v) {_vm.model=$$v},expression:"model"}})}
var datetimevue_type_template_id_61f2142e_staticRenderFns = []


// CONCATENATED MODULE: ./src/components/datetime.vue?vue&type=template&id=61f2142e&

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/vue-loader/lib??vue-loader-options!./src/components/datetime.vue?vue&type=script&lang=js&
//
//
//
//

/* harmony default export */ var datetimevue_type_script_lang_js_ = ({
  name: 'oa-datetime',
  props: {
    value: {},
    schema: {},
    prop: String,
    options: {}
  },
  computed: {
    model: {
      get: function get() {
        return this.value;
      },
      set: function set(val) {
        this.$emit('input', val);
      }
    }
  }
});
// CONCATENATED MODULE: ./src/components/datetime.vue?vue&type=script&lang=js&
 /* harmony default export */ var components_datetimevue_type_script_lang_js_ = (datetimevue_type_script_lang_js_); 
// CONCATENATED MODULE: ./src/components/datetime.vue





/* normalize component */

var datetime_component = normalizeComponent(
  components_datetimevue_type_script_lang_js_,
  datetimevue_type_template_id_61f2142e_render,
  datetimevue_type_template_id_61f2142e_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ var datetime = (datetime_component.exports);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"C://sacha//vue//vuecrud//node_modules//.cache//vue-loader","cacheIdentifier":"2c4efe34-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/daterange.vue?vue&type=template&id=5a825d29&
var daterangevue_type_template_id_5a825d29_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',[(!_vm.isMobile)?_c('el-date-picker',{attrs:{"type":"daterange","format":"dd/MM/yyyy"},model:{value:(_vm.model),callback:function ($$v) {_vm.model=$$v},expression:"model"}}):_vm._e(),(_vm.isMobile)?_c('el-date-picker',{attrs:{"type":"date","format":"dd/MM/yyyy","placeholder":"Begin"},model:{value:(_vm.model1),callback:function ($$v) {_vm.model1=$$v},expression:"model1"}}):_vm._e(),(_vm.isMobile)?_c('el-date-picker',{attrs:{"type":"date","format":"dd/MM/yyyy","placeholder":"End"},model:{value:(_vm.model2),callback:function ($$v) {_vm.model2=$$v},expression:"model2"}}):_vm._e()],1)}
var daterangevue_type_template_id_5a825d29_staticRenderFns = []


// CONCATENATED MODULE: ./src/components/daterange.vue?vue&type=template&id=5a825d29&

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/vue-loader/lib??vue-loader-options!./src/components/daterange.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
/* harmony default export */ var daterangevue_type_script_lang_js_ = ({
  name: "oa-daterange",
  data: function data() {
    return {
      pickerOptions: {
        shortcuts: [{
          text: "Last week",
          onClick: function onClick(picker) {
            var end = new Date();
            var start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit("pick", [start, end]);
          }
        }, {
          text: "Last month",
          onClick: function onClick(picker) {
            var end = new Date();
            var start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit("pick", [start, end]);
          }
        }, {
          text: "Last 3 months",
          onClick: function onClick(picker) {
            var end = new Date();
            var start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit("pick", [start, end]);
          }
        }]
      }
    };
  },
  props: {
    value: Array,
    schema: {},
    prop: String,
    options: {}
  },
  computed: {
    model: {
      get: function get() {
        return this.value;
      },
      set: function set(val) {
        this.$emit("input", val);
      }
    },
    model1: {
      get: function get() {
        return this.value && this.value.length > 0 ? this.value[0] : null;
      },
      set: function set(val) {
        if (this.value && this.value[1].getTime() > val.getTime()) this.model = [val, this.value[1]];else this.model = [val, val];
      }
    },
    model2: {
      get: function get() {
        return this.value && this.value.length > 1 ? this.value[1] : null;
      },
      set: function set(val) {
        if (this.value && this.value[0].getTime() < val.getTime()) this.model = [this.value[0], val];else this.model = [val, val];
      }
    },
    isMobile: function isMobile() {
      return VueForms.isMobile();
    }
  }
});
// CONCATENATED MODULE: ./src/components/daterange.vue?vue&type=script&lang=js&
 /* harmony default export */ var components_daterangevue_type_script_lang_js_ = (daterangevue_type_script_lang_js_); 
// CONCATENATED MODULE: ./src/components/daterange.vue





/* normalize component */

var daterange_component = normalizeComponent(
  components_daterangevue_type_script_lang_js_,
  daterangevue_type_template_id_5a825d29_render,
  daterangevue_type_template_id_5a825d29_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ var daterange = (daterange_component.exports);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"C://sacha//vue//vuecrud//node_modules//.cache//vue-loader","cacheIdentifier":"2c4efe34-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/dialogform.vue?vue&type=template&id=7c19cee1&
var dialogformvue_type_template_id_7c19cee1_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('oa-form',{ref:"form",attrs:{"model":_vm.model,"schema":_vm.schema,"actions":_vm.actions,"messages":_vm.messages,"connector":_vm.connector,"resource":_vm.resource}})}
var dialogformvue_type_template_id_7c19cee1_staticRenderFns = []


// CONCATENATED MODULE: ./src/components/dialogform.vue?vue&type=template&id=7c19cee1&

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/vue-loader/lib??vue-loader-options!./src/components/dialogform.vue?vue&type=script&lang=js&
//
//
//
//
//

/* harmony default export */ var dialogformvue_type_script_lang_js_ = ({
  name: "oa-dialog-form",
  props: {
    resource: {},
    value: {},
    connector: Object
  },
  data: function data() {
    var self = this;
    return {
      model: {},
      actions: [{
        name: "Save",
        type: "primary",
        execute: function execute() {
          self.$refs.form.validate(function (valid) {
            if (valid) {
              self.saveData(self.model, function () {
                self.$message({
                  type: "success",
                  message: "Save completed"
                });
                self.$emit("close", self.model);
              });
            } else {
              return false;
            }
          });
        }
      }, {
        name: "Cancel",
        execute: function execute() {
          self.$emit("close");
        }
      }]
    };
  },
  computed: {
    id: function id() {
      return this.value ? this.value[this.relationValueField] : null;
    },
    isnew: function isnew() {
      return !this.value;
    },
    relationValueField: function relationValueField() {
      return this.schema["x-rel-valuefield"] || "id";
    },
    schema: function schema() {
      if (this.isnew) {
        return src.jsonSchema.resolve(this.connector.schemas(this.resource, "create"));
      } else {
        return src.jsonSchema.resolve(this.connector.schemas(this.resource, "update"));
      }
    },
    messages: function messages() {
      return this.connector.messages();
    }
  },
  methods: {
    fetchData: function fetchData() {
      var self = this;
      self.$refs.form.resetForm();

      if (!this.isnew) {
        self.connector(self.resource, "get", {
          id: self.id
        }, function (data) {
          self.model = data; // this.pagination.totalItems = data.total;
        }, function () {// abp.ui.clearBusy(_$app);
        });
      } else {
        self.model = {};
      }
    },
    saveData: function saveData(data, callback) {
      var self = this;

      if (self.isnew) {
        // add
        self.connector(self.resource, "create", data, function (newdata) {
          self.model = newdata;
          self.$emit("input", newdata[this.relationValueField]);
          if (callback) callback();
        }, function () {// abp.ui.clearBusy(_$app);
        });
      } else {
        // update
        data.id = self.id;
        self.connector(self.resource, "update", data, function (newdata) {
          self.model = newdata;
          self.$emit("input", newdata.id);
          if (callback) callback();
        }, function () {// abp.ui.clearBusy(_$app);
        });
      }
    }
  },
  mounted: function mounted() {
    this.fetchData();
  }
});
// CONCATENATED MODULE: ./src/components/dialogform.vue?vue&type=script&lang=js&
 /* harmony default export */ var components_dialogformvue_type_script_lang_js_ = (dialogformvue_type_script_lang_js_); 
// CONCATENATED MODULE: ./src/components/dialogform.vue





/* normalize component */

var dialogform_component = normalizeComponent(
  components_dialogformvue_type_script_lang_js_,
  dialogformvue_type_template_id_7c19cee1_render,
  dialogformvue_type_template_id_7c19cee1_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ var dialogform = (dialogform_component.exports);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"C://sacha//vue//vuecrud//node_modules//.cache//vue-loader","cacheIdentifier":"2c4efe34-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/field.vue?vue&type=template&id=1ec9fa92&
var fieldvue_type_template_id_1ec9fa92_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('el-form-item',{attrs:{"label":_vm.label,"prop":_vm.prop,"label-width":_vm.labelWidth}},[_c(_vm.currentView,_vm._b({tag:"component",on:{"propChange":_vm.propChange},model:{value:(_vm.model),callback:function ($$v) {_vm.model=$$v},expression:"model"}},'component',_vm.$props,false))],1)}
var fieldvue_type_template_id_1ec9fa92_staticRenderFns = []


// CONCATENATED MODULE: ./src/components/field.vue?vue&type=template&id=1ec9fa92&

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/vue-loader/lib??vue-loader-options!./src/components/field.vue?vue&type=script&lang=js&

//
//
//
//
//
//


/* harmony default export */ var fieldvue_type_script_lang_js_ = ({
  name: "oa-field",
  template: " ",
  props: {
    value: {},
    schema: {},
    prop: {
      type: String,
      default: function _default() {
        return "";
      }
    },
    messages: {
      type: Object,
      default: function _default() {
        return {};
      }
    },
    connector: {},
    resource: {}
  },
  computed: {
    currentView: function currentView() {
      var sch = vueforms.jsonSchema.getNotNull(this.schema);
      var type = Array.isArray(sch.type) ? sch.type[0] == "null" ? sch.type[1] : sch.type[0] : sch.type;

      if (sch["x-type"]) {
        type = sch["x-type"];
      } else if (sch["x-rel-action"]) {
        type = "relation";
      } else if (sch["x-rel-to-many-action"]) {
        type = "relation-to-many";
      } else if (sch.enum || sch["x-enum-action"]) {
        if (type == "array") {
          type = "checkbox-group";
        } else {
          type = "select";
        }
      } else if (type == "boolean") {
        type = "switch";
      } else if (type == "integer" || type == "number") {
        type = "inputnumber";
      } else if (type == "array" && this.schema.items.format == "date-time") {
        type = "daterange";
      } else if (sch.format == "date-time") {
        type = "datetime";
      } else if (sch["x-ui-multiline"]) {
        type = "textarea";
      } else if (type == "address") {
        type = "address";
      } else if (type == "array") {
        type = "list";
      } else {
        type = "input";
      }

      var compName = "oa-" + type;
      var comp = external_commonjs_vue_commonjs2_vue_root_Vue_default.a.component(compName); //var comp = VueCrud.components[compName];

      if (!comp) {
        comp = function comp(resolve, reject) {
          external_commonjs_vue_commonjs2_vue_root_Vue_default.a.$loadComponent({
            name: compName,
            path: this.connector.componentsPath + type + ".js",
            onLoad: resolve,
            onError: reject
          });
        };
      }

      return comp;
    },
    model: {
      get: function get() {
        return this.value;
      },
      set: function set(val) {
        this.$emit("input", val);
      }
    },
    label: function label() {
      if (this.hideLabel) return "";
      var name = this.schema.title ? this.schema.title : this.prop.capitalize();
      if (this.messages && this.messages[name]) return this.messages[name];else return this.schema.title ? this.schema.title : name;
    },
    hideLabel: function hideLabel() {
      return this.schema["x-ui-hideLabel"];
    },
    labelWidth: function labelWidth() {
      return this.hideLabel ? "0px" : "120px";
    }
  },
  methods: {
    propChange: function propChange(key, value) {
      this.$emit("propChange", key, value);
    }
  }
});
// CONCATENATED MODULE: ./src/components/field.vue?vue&type=script&lang=js&
 /* harmony default export */ var components_fieldvue_type_script_lang_js_ = (fieldvue_type_script_lang_js_); 
// CONCATENATED MODULE: ./src/components/field.vue





/* normalize component */

var field_component = normalizeComponent(
  components_fieldvue_type_script_lang_js_,
  fieldvue_type_template_id_1ec9fa92_render,
  fieldvue_type_template_id_1ec9fa92_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ var field = (field_component.exports);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"C://sacha//vue//vuecrud//node_modules//.cache//vue-loader","cacheIdentifier":"2c4efe34-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/fields.vue?vue&type=template&id=7b985450&
var fieldsvue_type_template_id_7b985450_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',[(Object.keys(_vm.tabs).length > 1)?_c('el-tabs',{attrs:{"value":Object.keys(_vm.tabs)[0]}},_vm._l((_vm.tabs),function(gvalue,gkey){return _c('el-tab-pane',{key:gkey,attrs:{"label":_vm.label(gkey),"name":gkey}},[_c('el-row',{attrs:{"gutter":10}},_vm._l((gvalue.columns),function(cvalue,ckey){return _c('el-col',{key:ckey,attrs:{"xs":24/Object.keys(gvalue.columns).length,"sm":24/Object.keys(gvalue.columns).length,"md":24/Object.keys(gvalue.columns).length,"lg":24/Object.keys(gvalue.columns).length,"xl":24/Object.keys(gvalue.columns).length}},_vm._l((cvalue),function(value,key){return _c('oa-field',{key:key,attrs:{"prop":key,"schema":_vm.properties[key],"messages":_vm.messages,"connector":_vm.connector,"resource":_vm.resource},on:{"propChange":_vm.propChange},model:{value:(_vm.model[key]),callback:function ($$v) {_vm.$set(_vm.model, key, $$v)},expression:"model[key]"}})}))}))],1)})):_c('el-row',{attrs:{"gutter":10}},_vm._l((_vm.columns),function(cvalue,ckey){return _c('el-col',{key:ckey,attrs:{"xs":24/Object.keys(_vm.columns).length,"sm":24/Object.keys(_vm.columns).length,"md":24/Object.keys(_vm.columns).length,"lg":24/Object.keys(_vm.columns).length,"xl":24/Object.keys(_vm.columns).length}},_vm._l((cvalue),function(value,key){return _c('oa-field',{key:key,attrs:{"prop":key,"schema":_vm.properties[key],"messages":_vm.messages,"connector":_vm.connector,"resource":_vm.resource},on:{"propChange":_vm.propChange},model:{value:(_vm.model[key]),callback:function ($$v) {_vm.$set(_vm.model, key, $$v)},expression:"model[key]"}})}))})),_c('el-form-item',_vm._l((_vm.actions),function(action){return _c('el-button',{key:action.name,attrs:{"size":"small","type":action.type},on:{"click":function($event){action.execute()}}},[_vm._v(_vm._s(action.name))])}))],1)}
var fieldsvue_type_template_id_7b985450_staticRenderFns = []


// CONCATENATED MODULE: ./src/components/fields.vue?vue&type=template&id=7b985450&

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/vue-loader/lib??vue-loader-options!./src/components/fields.vue?vue&type=script&lang=js&

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
/* harmony default export */ var fieldsvue_type_script_lang_js_ = ({
  name: "oa-fields",
  props: {
    model: {},
    schema: {},
    options: {},
    messages: {},
    actions: {},
    connector: {},
    resource: {}
  },
  data: function data() {
    return {};
  },
  computed: {
    properties: function properties() {
      return this.schema.properties;
    },
    fields: function fields() {
      if (this.options) {
        return this.options.fields;
      } else {
        var fields = {};

        for (var key in this.schema.properties) {
          if (key != "id" && !this.schema.properties[key].readonly && !this.schema.properties[key]["x-rel-app"] && !this.schema.properties[key]["x-rel-to-many-app"]) {
            fields[key] = this.schema.properties[key];
          }
        }

        return fields;
      }
    },
    tabs: function tabs() {
      var groups = {};

      for (var key in this.fields) {
        var el = this.fields[key];
        var group = el["x-ui-group"];

        if (group in groups == false) {
          groups[group] = {};
        }

        groups[group][key] = el;
      }

      for (var _key in groups) {
        var _el = groups[_key];
        _el.columns = this.generateColumns(_el);
      }

      return groups;
    },
    columns: function columns() {
      return this.generateColumns(this.fields);
    },
    isMobile: function isMobile() {
      return window.matchMedia("only screen and (max-width: 760px)").matches;
    },
    labelPosition: function labelPosition() {
      return this.isMobile ? "top" : "right";
    }
  },
  methods: {
    label: function label(name) {
      //var name = this.schema.properties[prop].title ? this.schema.properties[prop].title : prop.capitalize();
      if (this.messages && this.messages[name]) return this.messages[name];else return name;
    },
    propChange: function propChange(key, value) {
      this.$set(this.model, key, value);
    },
    generateColumns: function generateColumns(fields) {
      var columns = {};

      for (var key in fields) {
        var el = this.fields[key];
        var column = el["x-ui-column"];

        if (column in columns == false) {
          columns[column] = {};
        }

        columns[column][key] = el;
      }

      return columns;
    }
  }
});
// CONCATENATED MODULE: ./src/components/fields.vue?vue&type=script&lang=js&
 /* harmony default export */ var components_fieldsvue_type_script_lang_js_ = (fieldsvue_type_script_lang_js_); 
// CONCATENATED MODULE: ./src/components/fields.vue





/* normalize component */

var fields_component = normalizeComponent(
  components_fieldsvue_type_script_lang_js_,
  fieldsvue_type_template_id_7b985450_render,
  fieldsvue_type_template_id_7b985450_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ var fields = (fields_component.exports);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"C://sacha//vue//vuecrud//node_modules//.cache//vue-loader","cacheIdentifier":"2c4efe34-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/filterform.vue?vue&type=template&id=1728d4ae&
var filterformvue_type_template_id_1728d4ae_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('el-form',{ref:"form",attrs:{"model":_vm.model,"rules":_vm.rules,"label-width":_vm.labelwidth,"inline":!_vm.isMobile,"label-position":_vm.labelPosition}},[_vm._l((_vm.fields),function(value,key){return _c('oa-field',{key:key,attrs:{"prop":key,"schema":_vm.properties[key],"messages":_vm.messages,"connector":_vm.connector,"resource":_vm.resource},on:{"propChange":_vm.propChange},model:{value:(_vm.model[key]),callback:function ($$v) {_vm.$set(_vm.model, key, $$v)},expression:"model[key]"}})}),_c('el-form-item',_vm._l((_vm.actions),function(action){return _c('el-button',{key:action.name,attrs:{"size":"small","icon":action.icon,"type":action.type},on:{"click":function($event){action.execute()}}},[_vm._v(_vm._s(action.name))])}))],2)}
var filterformvue_type_template_id_1728d4ae_staticRenderFns = []


// CONCATENATED MODULE: ./src/components/filterform.vue?vue&type=template&id=1728d4ae&

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/vue-loader/lib??vue-loader-options!./src/components/filterform.vue?vue&type=script&lang=js&

//
//
//
//
//
//
//
//
//
/* harmony default export */ var filterformvue_type_script_lang_js_ = ({
  name: 'oa-filter-form',
  props: {
    model: {},
    schema: {},
    connector: {},
    resource: {},
    options: {},
    messages: {},
    actions: {},
    columns: {}
  },
  data: function data() {
    return {};
  },
  computed: {
    properties: function properties() {
      return this.schema.properties;
    },
    fields: function fields() {
      if (this.options) {
        return this.options.fields;
      } else {
        var fields = {};

        for (var key in this.schema.properties) {
          if (key != 'id' && !this.schema.properties[key].readonly && !this.schema.properties[key]['x-rel-app'] && !this.schema.properties[key]['x-rel-to-many-app']) {
            fields[key] = this.schema.properties[key];
          }
        }

        return fields;
      }
    },
    rules: function rules() {
      var rules = {};

      for (var key in this.schema.properties) {
        //var prop = this.schema.properties[key]
        var itemRules = [];
        rules[key] = itemRules;
      }

      return rules;
    },
    isMobile: function isMobile() {
      return window.matchMedia('only screen and (max-width: 760px)').matches;
    },
    labelPosition: function labelPosition() {
      return this.isMobile ? 'top' : 'right';
    },
    labelwidth: function labelwidth() {
      return this.isMobile ? '100px' : '';
    }
  },
  methods: {
    validate: function validate(callback) {
      this.$refs.form.validate(function (valid) {
        if (callback) callback(valid);
      });
    },
    submitForm: function submitForm() {
      this.$refs.form.validate(function (valid) {
        if (valid) {
          alert('submit!');
        } else {
          return false;
        }
      });
    },
    resetForm: function resetForm() {
      this.$refs.form.resetFields();
    },
    label: function label(name) {
      // var name = this.schema.properties[prop].title ? this.schema.properties[prop].title : prop.capitalize();
      if (this.messages && this.messages[name]) return this.messages[name];else return name;
    },
    propChange: function propChange(key, value) {
      this.$set(this.model, key, value);
    }
    /*
            created: function(){
                  for (key in this.fields) {
                    if (this.fields[key].type == "string"){
                        Vue.set(this.model, key, "");
                    } else if (this.fields[key].type == "int") {
                        Vue.set(this.model, key, 0);
                    }
                }
              }
            */

  }
});
// CONCATENATED MODULE: ./src/components/filterform.vue?vue&type=script&lang=js&
 /* harmony default export */ var components_filterformvue_type_script_lang_js_ = (filterformvue_type_script_lang_js_); 
// CONCATENATED MODULE: ./src/components/filterform.vue





/* normalize component */

var filterform_component = normalizeComponent(
  components_filterformvue_type_script_lang_js_,
  filterformvue_type_template_id_1728d4ae_render,
  filterformvue_type_template_id_1728d4ae_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ var filterform = (filterform_component.exports);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"C://sacha//vue//vuecrud//node_modules//.cache//vue-loader","cacheIdentifier":"2c4efe34-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/form.vue?vue&type=template&id=3a587891&
var formvue_type_template_id_3a587891_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('el-form',{ref:"form",attrs:{"model":_vm.model,"rules":_vm.rules,"label-width":"120px","label-position":_vm.labelPosition}},[_c('oa-fields',{attrs:{"model":_vm.model,"schema":_vm.schema,"connector":_vm.connector,"resource":_vm.resource,"messages":_vm.messages}}),_c('el-form-item',_vm._l((_vm.actions),function(action){return _c('el-button',{key:action.name,attrs:{"size":"small","type":action.type},on:{"click":function($event){action.execute()}}},[_vm._v(_vm._s(action.name))])}))],1)}
var formvue_type_template_id_3a587891_staticRenderFns = []


// CONCATENATED MODULE: ./src/components/form.vue?vue&type=template&id=3a587891&

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/vue-loader/lib??vue-loader-options!./src/components/form.vue?vue&type=script&lang=js&

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
/* harmony default export */ var formvue_type_script_lang_js_ = ({
  name: 'oa-form',
  props: {
    model: {},
    schema: {},
    options: {},
    messages: {},
    actions: {},
    columns: {},
    connector: {},
    resource: {}
  },
  data: function data() {
    return {};
  },
  computed: {
    properties: function properties() {
      return this.schema.properties;
    },
    fields: function fields() {
      if (this.options) {
        return this.options.fields;
      } else {
        var fields = {};

        for (var key in this.schema.properties) {
          if (this.columns) {
            if (this.columns.indexOf(key) > 0) {
              fields[key] = this.schema.properties[key];
            }
          } else {
            if (key != 'id' && !this.schema.properties[key].readonly && !this.schema.properties[key]['x-rel-app'] && !this.schema.properties[key]['x-rel-to-many-app']) {
              fields[key] = this.schema.properties[key];
            }
          }
        }

        return fields;
      }
    },
    rules: function rules() {
      var rules = {};

      for (var key in this.schema.properties) {
        var prop = this.schema.properties[key];
        var itemRules = [];

        if (prop.required && prop.type != 'object') {
          itemRules.push({
            required: true,
            message: 'Please input a value'
          });
          rules[key] = itemRules;
        }
      }

      if (this.schema.required) {
        for (var i = 0; i < this.schema.required.length; i++) {
          var _prop = this.schema.required[i];
          var _itemRules = rules[_prop];

          if (!_itemRules) {
            _itemRules = [];
            rules[_prop] = _itemRules;
          }

          if (!_itemRules) {
            _itemRules = [];
            rules[key] = _itemRules;
          }

          _itemRules.push({
            required: true,
            message: 'Please input a value'
          });
        }
      }

      return rules;
    },
    tabs: function tabs() {
      var groups = {};

      for (var key in this.fields) {
        var el = this.fields[key];
        var group = el['x-ui-group'];

        if (group in groups == false) {
          groups[group] = {};
        }

        groups[group][key] = el;
      }

      return groups;
    },
    isMobile: function isMobile() {
      return window.matchMedia('only screen and (max-width: 760px)').matches;
    },
    labelPosition: function labelPosition() {
      return this.isMobile ? 'top' : 'right';
    }
  },
  methods: {
    validate: function validate(callback) {
      this.$refs.form.validate(function (valid) {
        if (callback) callback(valid);
      });
    },
    resetForm: function resetForm() {
      this.$refs.form.resetFields();
    },
    label: function label(name) {
      // var name = this.schema.properties[prop].title ? this.schema.properties[prop].title : prop.capitalize();
      if (this.messages && this.messages[name]) {
        return this.messages[name];
      } else {
        return name;
      }
    },
    propChange: function propChange(key, value) {
      this.$set(this.model, key, value);
    }
  }
});
// CONCATENATED MODULE: ./src/components/form.vue?vue&type=script&lang=js&
 /* harmony default export */ var components_formvue_type_script_lang_js_ = (formvue_type_script_lang_js_); 
// CONCATENATED MODULE: ./src/components/form.vue





/* normalize component */

var form_component = normalizeComponent(
  components_formvue_type_script_lang_js_,
  formvue_type_template_id_3a587891_render,
  formvue_type_template_id_3a587891_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ var components_form = (form_component.exports);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"C://sacha//vue//vuecrud//node_modules//.cache//vue-loader","cacheIdentifier":"2c4efe34-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/formitem.vue?vue&type=template&id=61aad5c4&
var formitemvue_type_template_id_61aad5c4_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('el-form-item',{attrs:{"label":_vm.label,"prop":_vm.prop}},[_vm._t("default"),_vm._t("footer")],2)}
var formitemvue_type_template_id_61aad5c4_staticRenderFns = []


// CONCATENATED MODULE: ./src/components/formitem.vue?vue&type=template&id=61aad5c4&

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/vue-loader/lib??vue-loader-options!./src/components/formitem.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
/* harmony default export */ var formitemvue_type_script_lang_js_ = ({
  name: 'oa-form-item',
  props: {
    label: {},
    prop: String,
    messages: Object
  },
  components: {},
  computed: {},
  methods: {}
});
// CONCATENATED MODULE: ./src/components/formitem.vue?vue&type=script&lang=js&
 /* harmony default export */ var components_formitemvue_type_script_lang_js_ = (formitemvue_type_script_lang_js_); 
// CONCATENATED MODULE: ./src/components/formitem.vue





/* normalize component */

var formitem_component = normalizeComponent(
  components_formitemvue_type_script_lang_js_,
  formitemvue_type_template_id_61aad5c4_render,
  formitemvue_type_template_id_61aad5c4_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ var formitem = (formitem_component.exports);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"C://sacha//vue//vuecrud//node_modules//.cache//vue-loader","cacheIdentifier":"2c4efe34-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/grid.vue?vue&type=template&id=6908669e&
var gridvue_type_template_id_6908669e_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',[(!_vm.isMobile)?_c('el-table',{staticStyle:{"width":"100%"},attrs:{"data":_vm.model,"row-style":{cursor: 'pointer'}},on:{"row-click":_vm.rowClick}},[_vm._l((_vm.columns),function(value,key){return _c('el-table-column',{key:key,attrs:{"prop":key,"label":_vm.label(key),"formatter":_vm.formatter,"class-name":"crudcell"}})}),_c('el-table-column',{attrs:{"align":"right","min-width":"120px"},scopedSlots:_vm._u([{key:"default",fn:function(scope){return _vm._l((_vm.actions),function(action){return _c('el-button',{directives:[{name:"show",rawName:"v-show",value:(_vm.actionVisible(action, scope.row, scope.$index)),expression:"actionVisible(action, scope.row, scope.$index)"}],key:action.name,attrs:{"icon":action.icon,"size":"small"},on:{"click":function($event){action.execute(scope.row, scope.$index)}}})})}}])})],2):_vm._l((_vm.model),function(row){return _c('el-card',{key:row.id,staticStyle:{"margin-bottom":"10px"}},[_vm._l((_vm.columns),function(value,key){return _c('el-row',{key:key,attrs:{"gutter":10}},[_c('el-col',{attrs:{"span":12}},[_vm._v(_vm._s(_vm.label(key)))]),_c('el-col',{attrs:{"span":12}},[_vm._v(_vm._s(_vm.format(key, row[key])))])],1)}),_c('div',{staticStyle:{"padding-top":"10px"}},_vm._l((_vm.actions),function(action){return _c('el-button',{directives:[{name:"show",rawName:"v-show",value:(_vm.actionVisible(action, row)),expression:"actionVisible(action, row)"}],key:action.name,attrs:{"icon":action.icon,"size":"small"},on:{"click":function($event){action.execute(row)}}})}))],2)})],2)}
var gridvue_type_template_id_6908669e_staticRenderFns = []


// CONCATENATED MODULE: ./src/components/grid.vue?vue&type=template&id=6908669e&

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/vue-loader/lib??vue-loader-options!./src/components/grid.vue?vue&type=script&lang=js&

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ var gridvue_type_script_lang_js_ = ({
  name: 'oa-grid',
  props: {
    model: {},
    schema: {},
    messages: {},
    actions: {},
    defaultAction: {}
  },
  computed: {
    columns: function columns() {
      var fields = {};

      for (var key in this.schema.properties) {
        if (key != 'id' && this.schema.properties[key].type != 'array' && (!this.schema.properties[key].hasOwnProperty('x-ui-grid') || this.schema.properties[key]['x-ui-grid'])) {
          fields[key] = this.schema.properties[key];
        }
      }

      return fields;
    },
    isMobile: function isMobile() {
      return vueforms.isMobile();
    }
  },
  methods: {
    label: function label(prop) {
      var name = this.schema.properties[prop].title ? this.schema.properties[prop].title : prop.capitalize();

      if (this.messages && this.messages[name]) {
        return this.messages[name];
      } else {
        return name;
      }
    },
    formatter: function formatter(row, column, cellValue) {
      return this.format(column.property, cellValue);
    },
    format: function format(property, cellValue) {
      var schema = vueforms.jsonSchema.getNotNull(this.schema.properties[property]);

      if (schema.type == 'boolean') {
        return cellValue ? this.messages['Yes'] : this.messages['No'];
      } else if (schema.format == 'date-time') {
        if (!cellValue) return '';
        return moment(cellValue).locale('fr').format('lll');
      } else if (schema.enum) {
        var i = schema.enum.indexOf(cellValue);
        return this.messages[schema['x-enumNames'][i]] ? this.messages[schema['x-enumNames'][i]] : schema['x-enumNames'][i];
      }

      return cellValue;
    },
    rowClick: function rowClick(row, event, column) {
      if (column.label) {
        this.defaultAction.execute(row, event, column);
      }
    },
    actionVisible: function actionVisible(action, row, index) {
      if (action.visible) {
        return action.visible(row, index);
      } else {
        return true;
      }
    }
  }
});
// CONCATENATED MODULE: ./src/components/grid.vue?vue&type=script&lang=js&
 /* harmony default export */ var components_gridvue_type_script_lang_js_ = (gridvue_type_script_lang_js_); 
// CONCATENATED MODULE: ./src/components/grid.vue





/* normalize component */

var grid_component = normalizeComponent(
  components_gridvue_type_script_lang_js_,
  gridvue_type_template_id_6908669e_render,
  gridvue_type_template_id_6908669e_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ var grid = (grid_component.exports);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"C://sacha//vue//vuecrud//node_modules//.cache//vue-loader","cacheIdentifier":"2c4efe34-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/list.vue?vue&type=template&id=a2024dd0&
var listvue_type_template_id_a2024dd0_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',[(!_vm.isMobile)?_c('el-table',{ref:"table",staticStyle:{"width":"100%"},attrs:{"data":_vm.model,"row-style":{cursor: 'pointer'}},on:{"row-click":_vm.rowClick}},[_c('el-table-column',{attrs:{"type":"expand"},scopedSlots:_vm._u([{key:"default",fn:function(props){return [_c('oa-fields',{attrs:{"model":props.row,"schema":_vm.rowSchema,"connector":_vm.connector,"messages":_vm.messages}})]}}])}),_vm._l((_vm.columns),function(value,key){return _c('el-table-column',{key:key,attrs:{"prop":key,"label":_vm.label(key),"formatter":_vm.formatter,"class-name":"crudcell"}})}),_c('el-table-column',{attrs:{"align":"right","min-width":"120px"},scopedSlots:_vm._u([{key:"default",fn:function(scope){return _vm._l((_vm.actions),function(action){return _c('el-button',{key:action.name,attrs:{"icon":action.icon,"size":"small"},on:{"click":function($event){action.execute(scope.row, scope.$index)}}})})}}])}),_c('template',{slot:"append"},[_c('el-button',{staticStyle:{"margin":"10px auto","display":"block"},attrs:{"icon":"el-icon-plus","size":"small"},on:{"click":function($event){_vm.addRow()}}})],1)],2):[_vm._l((_vm.model),function(row){return _c('el-card',{key:row.id,staticStyle:{"margin-bottom":"10px"}},[_c('oa-fields',{attrs:{"model":row,"schema":_vm.rowSchema,"connector":_vm.connector,"messages":_vm.messages}}),_c('div',{staticStyle:{"padding-top":"10px"}},_vm._l((_vm.actions),function(action){return _c('el-button',{key:action.name,attrs:{"icon":action.icon,"size":"small"},on:{"click":function($event){action.execute(row)}}})}))],1)}),_c('div',{staticStyle:{"padding-top":"10px"}},[_c('el-button',{staticStyle:{"margin":"10px auto","display":"block"},attrs:{"icon":"el-icon-plus","size":"small"},on:{"click":function($event){_vm.addRow()}}})],1)]],2)}
var listvue_type_template_id_a2024dd0_staticRenderFns = []


// CONCATENATED MODULE: ./src/components/list.vue?vue&type=template&id=a2024dd0&

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/vue-loader/lib??vue-loader-options!./src/components/list.vue?vue&type=script&lang=js&

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ var listvue_type_script_lang_js_ = ({
  name: "oa-list",
  props: {
    value: {},
    schema: {},
    messages: Object,
    prop: String,
    connector: {}
  },
  data: function data() {
    var self = this;
    return {
      actions: [{
        name: self.translate("Delete"),
        icon: "el-icon-delete",
        execute: function execute(row) {
          var index = self.model.indexOf(row);

          if (index > -1) {
            self.model.splice(index, 1);
          }
        }
      }, {
        name: self.translate("Duplicate"),
        icon: "el-icon-plus",
        execute: function execute(row) {
          var clone = JSON.parse(JSON.stringify(row));

          if (clone.hasOwnProperty('id')) {
            delete clone.id;
          }

          self.model.push(clone);
        }
      }]
    };
  },
  computed: {
    model: {
      get: function get() {
        return this.value;
      },
      set: function set(val) {
        this.$emit("input", val);
      }
    },
    rowSchema: function rowSchema() {
      return this.schema.items;
    },
    columns: function columns() {
      var fields = {};
      var sch = this.schema.items;

      for (var key in sch.properties) {
        if (key != "id" && sch.properties[key].type != "array" && (!sch.properties[key].hasOwnProperty("x-ui-grid") || sch.properties[key]["x-ui-grid"])) {
          fields[key] = sch.properties[key];
        }
      }

      return fields;
    },
    isMobile: function isMobile() {
      return vueforms.isMobile();
    }
  },
  created: function created() {},
  methods: {
    translate: function translate(text) {
      if (this.messages && this.messages[text]) return this.messages[text];else return text;
    },
    label: function label(prop) {
      var sch = this.schema.items;
      var name = sch.properties[prop].title ? sch.properties[prop].title : prop.capitalize();
      if (this.messages && this.messages[name]) return this.messages[name];else return name;
    },
    formatter: function formatter(row, column, cellValue) {
      var schema = vueforms.jsonSchema.getNotNull(this.schema.items.properties[column.property]);

      if (schema.type == "boolean") {
        return cellValue ? this.messages["Yes"] : this.messages["No"];
      } else if (schema.format == "date-time") {
        if (!cellValue) return ""; // eslint-disable-next-line

        return moment(cellValue).locale("fr").format("lll");
      } else if (schema.enum) {
        var i = schema.enum.indexOf(cellValue);
        return this.messages[schema["x-enumNames"][i]] ? this.messages[schema["x-enumNames"][i]] : schema["x-enumNames"][i];
      }

      return cellValue;
    },
    rowClick: function rowClick(row, event, column) {
      if (column.label) {
        //this.defaultAction.execute(row, event, column);
        this.$refs.table.toggleRowExpansion(row, true);
      }
    },
    addRow: function addRow() {
      var row = {};
      var sch = this.schema.items;

      for (var key in sch.properties) {
        row[key] = sch.default;
      }

      var model = this.model;

      if (model === undefined) {
        model = [];
      }

      model.push(row);
      this.model = model;
      this.$refs.table.toggleRowExpansion(row, true);
    }
  }
});
// CONCATENATED MODULE: ./src/components/list.vue?vue&type=script&lang=js&
 /* harmony default export */ var components_listvue_type_script_lang_js_ = (listvue_type_script_lang_js_); 
// CONCATENATED MODULE: ./src/components/list.vue





/* normalize component */

var list_component = normalizeComponent(
  components_listvue_type_script_lang_js_,
  listvue_type_template_id_a2024dd0_render,
  listvue_type_template_id_a2024dd0_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ var list = (list_component.exports);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"C://sacha//vue//vuecrud//node_modules//.cache//vue-loader","cacheIdentifier":"2c4efe34-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/input.vue?vue&type=template&id=21cb54c6&
var inputvue_type_template_id_21cb54c6_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('el-input',{model:{value:(_vm.model),callback:function ($$v) {_vm.model=$$v},expression:"model"}})}
var inputvue_type_template_id_21cb54c6_staticRenderFns = []


// CONCATENATED MODULE: ./src/components/input.vue?vue&type=template&id=21cb54c6&

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/vue-loader/lib??vue-loader-options!./src/components/input.vue?vue&type=script&lang=js&
//
//
//
//
/* harmony default export */ var inputvue_type_script_lang_js_ = ({
  name: 'oa-input',
  props: {
    value: String,
    schema: {},
    prop: String,
    options: {}
  },
  computed: {
    model: {
      get: function get() {
        return this.value;
      },
      set: function set(val) {
        this.$emit('input', val);
      }
    }
  }
});
// CONCATENATED MODULE: ./src/components/input.vue?vue&type=script&lang=js&
 /* harmony default export */ var components_inputvue_type_script_lang_js_ = (inputvue_type_script_lang_js_); 
// CONCATENATED MODULE: ./src/components/input.vue





/* normalize component */

var input_component = normalizeComponent(
  components_inputvue_type_script_lang_js_,
  inputvue_type_template_id_21cb54c6_render,
  inputvue_type_template_id_21cb54c6_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ var input = (input_component.exports);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"C://sacha//vue//vuecrud//node_modules//.cache//vue-loader","cacheIdentifier":"2c4efe34-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/inputnumber.vue?vue&type=template&id=35cafac8&
var inputnumbervue_type_template_id_35cafac8_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('el-input-number',{model:{value:(_vm.model),callback:function ($$v) {_vm.model=$$v},expression:"model"}})}
var inputnumbervue_type_template_id_35cafac8_staticRenderFns = []


// CONCATENATED MODULE: ./src/components/inputnumber.vue?vue&type=template&id=35cafac8&

// EXTERNAL MODULE: ./node_modules/core-js/modules/es6.number.constructor.js
var es6_number_constructor = __webpack_require__("c5f6");

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/vue-loader/lib??vue-loader-options!./src/components/inputnumber.vue?vue&type=script&lang=js&

//
//
//
//

/* harmony default export */ var inputnumbervue_type_script_lang_js_ = ({
  name: 'oa-inputnumber',
  props: {
    value: Number,
    schema: {},
    prop: String,
    options: {}
  },
  computed: {
    model: {
      get: function get() {
        return this.value;
      },
      set: function set(val) {
        this.$emit('input', val);
      }
    }
  }
});
// CONCATENATED MODULE: ./src/components/inputnumber.vue?vue&type=script&lang=js&
 /* harmony default export */ var components_inputnumbervue_type_script_lang_js_ = (inputnumbervue_type_script_lang_js_); 
// CONCATENATED MODULE: ./src/components/inputnumber.vue





/* normalize component */

var inputnumber_component = normalizeComponent(
  components_inputnumbervue_type_script_lang_js_,
  inputnumbervue_type_template_id_35cafac8_render,
  inputnumbervue_type_template_id_35cafac8_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ var inputnumber = (inputnumber_component.exports);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"C://sacha//vue//vuecrud//node_modules//.cache//vue-loader","cacheIdentifier":"2c4efe34-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/relationtomany.vue?vue&type=template&id=2024060b&
var relationtomanyvue_type_template_id_2024060b_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',[_c('el-select',{attrs:{"multiple":"","value":_vm.model,"value-key":_vm.relationValueField,"filterable":"","clearable":"","remote":"","remote-method":_vm.remoteMethod,"loading":_vm.loading},on:{"input":_vm.updateModel,"clear":_vm.clear}},_vm._l((_vm.computedOptions),function(item){return _c('el-option',{key:item.value.id,attrs:{"label":item.label,"value":item.value}})})),(_vm.relationResource)?_c('el-button',{attrs:{"icon":_vm.buttonIcon},on:{"click":_vm.edit}}):_vm._e(),_vm._t("footer"),(_vm.relationResource)?_c('el-dialog',{ref:"customerDialog",attrs:{"title":"Client","visible":_vm.dialogVisible,"fullscreen":_vm.fullscreen,"before-close":_vm.handleClose,"append-to-body":true},on:{"update:visible":function($event){_vm.dialogVisible=$event},"open":_vm.openDialog,"close":_vm.closeDialog}},[_c('oa-dialog-form',{ref:"form",attrs:{"resource":_vm.relationResource},on:{"close":_vm.close},model:{value:(_vm.model),callback:function ($$v) {_vm.model=$$v},expression:"model"}})],1):_vm._e()],2)}
var relationtomanyvue_type_template_id_2024060b_staticRenderFns = []


// CONCATENATED MODULE: ./src/components/relationtomany.vue?vue&type=template&id=2024060b&

// EXTERNAL MODULE: ./node_modules/core-js/modules/es6.array.find-index.js
var es6_array_find_index = __webpack_require__("20d6");

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/vue-loader/lib??vue-loader-options!./src/components/relationtomany.vue?vue&type=script&lang=js&

//
//
//
//
//
//
//
//
//
//
//
//
//
/* harmony default export */ var relationtomanyvue_type_script_lang_js_ = ({
  name: "oa-relation-to-many",
  props: {
    value: {},
    schema: {},
    messages: Object,
    connector: {},
    prop: String,
    label: String
  },
  data: function data() {
    //var self = this
    return {
      form: {},
      loading: false,
      dialogVisible: false,
      options: null
    };
  },
  computed: {
    relationResource: function relationResource() {
      return this.schema["x-rel-to-many-app"];
    },
    relationAction: function relationAction() {
      return this.schema["x-rel-to-many-action"] || "get" + this.prop.capitalize() + "s";
    },
    relationValueField: function relationValueField() {
      return this.schema["x-rel-to-many-valuefield"] || "id";
    },
    relationTextField: function relationTextField() {
      return this.schema["x-rel-to-many-textfield"] || "fullName";
    },
    id: function id() {
      return this.value ? this.value[this.relationValueField] : null;
    },
    isnew: function isnew() {
      return !this.value;
    },
    // schema: function() {
    //    if (this.isnew)
    //        return jref.resolve(abp.schemas.app[this.resource].create.input).properties[this.prop];
    //    else
    //        return jref.resolve(abp.schemas.app[this.resource].update.input).properties[this.prop];
    // },
    model: {
      get: function get() {
        return this.value;
      },
      set: function set(val) {
        this.$emit("input", val);
      }
    },
    isMobile: function isMobile() {
      return window.matchMedia("only screen and (max-width: 760px)").matches;
    },
    fullscreen: function fullscreen() {
      return this.isMobile;
    },
    buttonIcon: function buttonIcon() {
      return this.isnew ? "el-icon-plus" : "el-icon-edit";
    },
    computedOptions: function computedOptions() {
      var baseOptions = [];

      if (this.value) {
        baseOptions = this.value.map(function (t) {
          return {
            label: t[this.relationTextField],
            value: t
          };
        }.bind(this));
      }

      if (this.options) {
        var retval = baseOptions.concat(this.options); // Remove duplicates

        retval = retval.filter(function (item, index, arr) {
          var firstIndex = arr.findIndex(function (element) {
            return element.value[this.relationValueField] == item.value[this.relationValueField];
          }.bind(this));
          if (firstIndex == index) return item;
        }.bind(this));
        return retval;
      }

      if (baseOptions.length <= 0) return null;
      return baseOptions;
    }
  },
  // watch: {
  //    value: function (val, oldVal) {
  //        var self = this;
  //        if (val) {
  //            this.options= [{ label: self.value[self.relationTextField], value: val }];
  //        }
  //    }
  // },
  methods: {
    remoteMethod: function remoteMethod(query) {
      var self = this;

      if (!query && self.value) {
        // this.options.push({ label: self.value[self.relationTextField], value: this.value });
        this.options = null;
      } else if (query && query !== "" && (!self.value || query != self.value[self.relationTextField])) {
        self.loading = true;
        self.service(self.relationResource ? self.relationResource : self.resource, self.relationAction, query, function (data) {
          self.options = data.items.map(function (t) {
            // return { label: t.firstname + " " + t.lastname, value: t.id };
            return {
              label: t[self.relationTextField],
              value: t
            };
          });
          self.loading = false;
        }, function () {// abp.ui.clearBusy(_$app);
        });
      } else if (query == "") {
        this.options = null;
      }
    },
    clear: function clear() {
      // this.form.customerId = null;
      this.model = null;
    },
    edit: function edit() {
      this.dialogVisible = true;
      if (this.$refs.form) this.$refs.form.fetchData();
    },
    handleClose: function handleClose(done) {
      done();
    },
    close: function close(model) {
      this.dialogVisible = false;

      if (model) {
        this.model = model; // this.options = [{ label: model[self.relationTextField], value: model }];

        this.options = null;
      }
    },
    updateModel: function updateModel(value) {
      this.model = value; // this.$emit('input', value);
    },
    openDialog: function openDialog() {
      if (this.fullscreen) {
        // document.body.style.position = 'fixed'; // for ios cursor bug
        document.body.classList.add("dialog-open");
      }
    },
    closeDialog: function closeDialog() {
      if (this.fullscreen) {
        // document.body.style.position = ''; // for ios cursor bug
        document.body.classList.remove("dialog-open");
      }
    } // },
    // created: function () {
    //    var self = this;
    //    if (this.value) {
    //        this.options = [{ label: self.value[self.relationTextField], value: this.value }];
    //    }

  }
});
// CONCATENATED MODULE: ./src/components/relationtomany.vue?vue&type=script&lang=js&
 /* harmony default export */ var components_relationtomanyvue_type_script_lang_js_ = (relationtomanyvue_type_script_lang_js_); 
// CONCATENATED MODULE: ./src/components/relationtomany.vue





/* normalize component */

var relationtomany_component = normalizeComponent(
  components_relationtomanyvue_type_script_lang_js_,
  relationtomanyvue_type_template_id_2024060b_render,
  relationtomanyvue_type_template_id_2024060b_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ var relationtomany = (relationtomany_component.exports);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"C://sacha//vue//vuecrud//node_modules//.cache//vue-loader","cacheIdentifier":"2c4efe34-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/relation.vue?vue&type=template&id=48a7f26c&
var relationvue_type_template_id_48a7f26c_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',[_c('el-select',{attrs:{"value-key":_vm.relationValueField,"filterable":"","clearable":"","remote":"","remote-method":_vm.remoteMethod,"loading":_vm.loading},on:{"clear":_vm.clear},model:{value:(_vm.model),callback:function ($$v) {_vm.model=$$v},expression:"model"}},_vm._l((_vm.options),function(item){return _c('el-option',{key:item.value.id,attrs:{"label":item.label,"value":item.value}})})),(_vm.relationResource)?_c('el-button',{attrs:{"icon":_vm.buttonIcon},on:{"click":_vm.edit}}):_vm._e(),_vm._t("footer"),(_vm.relationResource)?_c('el-dialog',{ref:"customerDialog",attrs:{"title":"Client","visible":_vm.dialogVisible,"fullscreen":_vm.fullscreen,"before-close":_vm.handleClose,"append-to-body":true},on:{"update:visible":function($event){_vm.dialogVisible=$event},"open":_vm.openDialog,"close":_vm.closeDialog}},[_c('oa-dialog-form',{ref:"form",attrs:{"resource":_vm.relationResource},on:{"close":_vm.close},model:{value:(_vm.model),callback:function ($$v) {_vm.model=$$v},expression:"model"}})],1):_vm._e()],2)}
var relationvue_type_template_id_48a7f26c_staticRenderFns = []


// CONCATENATED MODULE: ./src/components/relation.vue?vue&type=template&id=48a7f26c&

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/vue-loader/lib??vue-loader-options!./src/components/relation.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//
//
//
//
/* harmony default export */ var relationvue_type_script_lang_js_ = ({
  name: 'oa-relation',
  props: {
    value: {},
    schema: {},
    messages: Object,
    connector: {},
    resource: {},
    prop: String,
    label: String
  },
  data: function data() {
    //var self = this
    return {
      form: {},
      loading: false,
      dialogVisible: false,
      options: []
    };
  },
  computed: {
    sch: function sch() {
      return this.schema.oneOf && this.schema.oneOf[0] ? this.schema.oneOf[0] : this.schema;
    },
    relationResource: function relationResource() {
      return this.sch['x-rel-app'];
    },
    relationAction: function relationAction() {
      return this.sch['x-rel-action'] || 'get' + this.prop.capitalize() + 's';
    },
    relationValueField: function relationValueField() {
      return this.sch['x-rel-valuefield'] || 'id';
    },
    relationTextField: function relationTextField() {
      return this.sch['x-rel-textfield'] || 'fullName';
    },
    id: function id() {
      return this.value ? this.value[this.relationValueField] : null;
    },
    isnew: function isnew() {
      return !this.value;
    },
    // schema: function() {
    //    if (this.isnew)
    //        return jref.resolve(abp.schemas.app[this.resource].create.input).properties[this.prop];
    //    else
    //        return jref.resolve(abp.schemas.app[this.resource].update.input).properties[this.prop];
    // },
    model: {
      get: function get() {
        return this.value;
      },
      set: function set(val) {
        this.$emit('input', val);
      }
    },
    isMobile: function isMobile() {
      return window.matchMedia('only screen and (max-width: 760px)').matches;
    },
    fullscreen: function fullscreen() {
      return this.isMobile;
    },
    buttonIcon: function buttonIcon() {
      return this.isnew ? 'el-icon-plus' : 'el-icon-edit';
    }
  },
  watch: {
    value: function value(val) {
      var self = this;

      if (val) {
        this.options = [{
          label: self.value[self.relationTextField],
          value: val
        }];
      }
    }
  },
  methods: {
    remoteMethod: function remoteMethod(query) {
      var self = this;

      if (!query && self.value) {
        this.options.push({
          label: self.value[self.relationTextField],
          value: this.value
        });
      } else if (query && query !== '' && (!self.value || query != self.value[self.relationTextField])) {
        self.loading = true;
        self.connector.service(self.resource, self.relationAction, query, function (data) {
          self.options = data.items.map(function (t) {
            // return { label: t.firstname + " " + t.lastname, value: t.id };
            return {
              label: t[self.relationTextField],
              value: t
            };
          });
          self.loading = false;
        }, function () {// abp.ui.clearBusy(_$app);
        });
      } else if (query == '') {
        this.options = [];
      }
    },
    clear: function clear() {
      // this.form.customerId = null;
      this.model = null;
    },
    edit: function edit() {
      this.dialogVisible = true;
      if (this.$refs.form) this.$refs.form.fetchData();
    },
    handleClose: function handleClose(done) {
      done();
    },
    close: function close(model) {
      var self = this;
      this.dialogVisible = false;

      if (model) {
        this.model = model;
        this.options = [{
          label: model[self.relationTextField],
          value: model
        }];
      }
    },
    openDialog: function openDialog() {
      if (this.fullscreen) {
        // document.body.style.position = 'fixed'; // for ios cursor bug
        document.body.classList.add('dialog-open');
      }
    },
    closeDialog: function closeDialog() {
      if (this.fullscreen) {
        // document.body.style.position = ''; // for ios cursor bug
        document.body.classList.remove('dialog-open');
      }
    }
  },
  created: function created() {
    var self = this;

    if (this.value) {
      this.options = [{
        label: self.value[self.relationTextField],
        value: this.value
      }];
    }
  }
});
// CONCATENATED MODULE: ./src/components/relation.vue?vue&type=script&lang=js&
 /* harmony default export */ var components_relationvue_type_script_lang_js_ = (relationvue_type_script_lang_js_); 
// CONCATENATED MODULE: ./src/components/relation.vue





/* normalize component */

var relation_component = normalizeComponent(
  components_relationvue_type_script_lang_js_,
  relationvue_type_template_id_48a7f26c_render,
  relationvue_type_template_id_48a7f26c_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ var relation = (relation_component.exports);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"C://sacha//vue//vuecrud//node_modules//.cache//vue-loader","cacheIdentifier":"2c4efe34-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/select.vue?vue&type=template&id=1c33b6c4&
var selectvue_type_template_id_1c33b6c4_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('el-select',{attrs:{"placeholder":"Select"},model:{value:(_vm.model),callback:function ($$v) {_vm.model=$$v},expression:"model"}},[(!_vm.hideNone)?_c('el-option',{attrs:{"label":_vm.noneLabel,"value":_vm.noneValue}}):_vm._e(),_vm._l((_vm.options),function(item){return _c('el-option',{key:item.value,attrs:{"label":item.label,"value":item.value}})})],2)}
var selectvue_type_template_id_1c33b6c4_staticRenderFns = []


// CONCATENATED MODULE: ./src/components/select.vue?vue&type=template&id=1c33b6c4&

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/vue-loader/lib??vue-loader-options!./src/components/select.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
/* harmony default export */ var selectvue_type_script_lang_js_ = ({
  name: "oa-select",
  props: {
    value: {},
    schema: {},
    messages: Object,
    resource: String,
    prop: String,
    connector: {}
  },
  data: function data() {
    return {
      options: [],
      hideNone: false,
      noneLabel: "None",
      noneValue: undefined
    };
  },
  computed: {
    model: {
      get: function get() {
        return this.value;
      },
      set: function set(val) {
        this.$emit("input", val);
      }
    }
  },
  created: function created() {
    var self = this;
    var sch = this.schema.oneOf && this.schema.oneOf[0] ? this.schema.oneOf[0] : this.schema;

    if (sch.enum) {
      for (var i = 0; i < sch.enum.length; i++) {
        var label = sch["x-enumNames"] ? sch["x-enumNames"][i] : this.prop + "_" + sch.enum[i];

        if (this.messages && this.messages[label]) {
          label = this.messages[label];
        }

        this.options.push({
          value: sch.enum[i],
          label: label
        });
      }
    } else if (sch["x-enum-action"]) {
      var enumAction = this.schema["x-enum-action"];
      var enumValueField = this.schema["x-enum-valuefield"] || "id";
      var enumTextField = this.schema["x-enum-textfield"] || "fullName";
      self.connector.service(this.resource, enumAction, {}, function (data) {
        self.options = data.map(function (p) {
          return {
            value: p[enumValueField],
            label: p[enumTextField]
          };
        });
      }, function () {});
    }

    if (sch["x-enum-nonelabel"]) {
      this.noneLabel = sch["x-enum-nonelabel"];

      if (this.messages && this.messages[this.noneLabel]) {
        this.noneLabel = this.messages[this.noneLabel];
      }
    }

    if (sch["x-enum-hideNone"]) {
      this.hideNone = sch["x-enum-hideNone"];
    }

    if (sch["default"]) {
      this.model = sch["default"];
    }
  }
});
// CONCATENATED MODULE: ./src/components/select.vue?vue&type=script&lang=js&
 /* harmony default export */ var components_selectvue_type_script_lang_js_ = (selectvue_type_script_lang_js_); 
// CONCATENATED MODULE: ./src/components/select.vue





/* normalize component */

var select_component = normalizeComponent(
  components_selectvue_type_script_lang_js_,
  selectvue_type_template_id_1c33b6c4_render,
  selectvue_type_template_id_1c33b6c4_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ var components_select = (select_component.exports);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"C://sacha//vue//vuecrud//node_modules//.cache//vue-loader","cacheIdentifier":"2c4efe34-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/switch.vue?vue&type=template&id=78795dce&
var switchvue_type_template_id_78795dce_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('el-switch',{attrs:{"on-text":"","off-text":""},model:{value:(_vm.model),callback:function ($$v) {_vm.model=$$v},expression:"model"}})}
var switchvue_type_template_id_78795dce_staticRenderFns = []


// CONCATENATED MODULE: ./src/components/switch.vue?vue&type=template&id=78795dce&

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/vue-loader/lib??vue-loader-options!./src/components/switch.vue?vue&type=script&lang=js&
//
//
//
//

/* harmony default export */ var switchvue_type_script_lang_js_ = ({
  name: 'oa-switch',
  props: {
    value: Boolean,
    schema: {},
    prop: String,
    options: {}
  },
  computed: {
    model: {
      get: function get() {
        return this.value;
      },
      set: function set(val) {
        this.$emit('input', val);
      }
    }
  }
});
// CONCATENATED MODULE: ./src/components/switch.vue?vue&type=script&lang=js&
 /* harmony default export */ var components_switchvue_type_script_lang_js_ = (switchvue_type_script_lang_js_); 
// CONCATENATED MODULE: ./src/components/switch.vue





/* normalize component */

var switch_component = normalizeComponent(
  components_switchvue_type_script_lang_js_,
  switchvue_type_template_id_78795dce_render,
  switchvue_type_template_id_78795dce_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ var components_switch = (switch_component.exports);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"C://sacha//vue//vuecrud//node_modules//.cache//vue-loader","cacheIdentifier":"2c4efe34-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/textarea.vue?vue&type=template&id=ba62e152&
var textareavue_type_template_id_ba62e152_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('el-input',{attrs:{"type":"textarea","autosize":""},model:{value:(_vm.model),callback:function ($$v) {_vm.model=$$v},expression:"model"}})}
var textareavue_type_template_id_ba62e152_staticRenderFns = []


// CONCATENATED MODULE: ./src/components/textarea.vue?vue&type=template&id=ba62e152&

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/vue-loader/lib??vue-loader-options!./src/components/textarea.vue?vue&type=script&lang=js&
//
//
//
//

/* harmony default export */ var textareavue_type_script_lang_js_ = ({
  name: 'oa-textarea',
  props: {
    value: String,
    schema: {},
    prop: String,
    options: {}
  },
  computed: {
    model: {
      get: function get() {
        return this.value;
      },
      set: function set(val) {
        this.$emit('input', val);
      }
    }
  }
});
// CONCATENATED MODULE: ./src/components/textarea.vue?vue&type=script&lang=js&
 /* harmony default export */ var components_textareavue_type_script_lang_js_ = (textareavue_type_script_lang_js_); 
// CONCATENATED MODULE: ./src/components/textarea.vue





/* normalize component */

var textarea_component = normalizeComponent(
  components_textareavue_type_script_lang_js_,
  textareavue_type_template_id_ba62e152_render,
  textareavue_type_template_id_ba62e152_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ var components_textarea = (textarea_component.exports);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"C://sacha//vue//vuecrud//node_modules//.cache//vue-loader","cacheIdentifier":"2c4efe34-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/time.vue?vue&type=template&id=66da3953&
var timevue_type_template_id_66da3953_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('el-time-select',{attrs:{"picker-options":{start: _vm.start, step: _vm.step, end: _vm.end }},model:{value:(_vm.model),callback:function ($$v) {_vm.model=$$v},expression:"model"}})}
var timevue_type_template_id_66da3953_staticRenderFns = []


// CONCATENATED MODULE: ./src/components/time.vue?vue&type=template&id=66da3953&

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/vue-loader/lib??vue-loader-options!./src/components/time.vue?vue&type=script&lang=js&
//
//
//
//
//
/* harmony default export */ var timevue_type_script_lang_js_ = ({
  name: 'oa-time',
  props: {
    value: {},
    schema: {},
    prop: String,
    options: {}
  },
  computed: {
    model: {
      get: function get() {
        return this.value;
      },
      set: function set(val) {
        this.$emit('input', val);
      }
    },
    start: function start() {
      return this.schema['x-ui-start'] ? this.schema['x-ui-start'] : '00:00';
    },
    step: function step() {
      return this.schema['x-ui-step'] ? this.schema['x-ui-step'] : '00:30';
    },
    end: function end() {
      return this.schema['x-ui-end'] ? this.schema['x-ui-end'] : '23:30';
    }
  }
});
// CONCATENATED MODULE: ./src/components/time.vue?vue&type=script&lang=js&
 /* harmony default export */ var components_timevue_type_script_lang_js_ = (timevue_type_script_lang_js_); 
// CONCATENATED MODULE: ./src/components/time.vue





/* normalize component */

var time_component = normalizeComponent(
  components_timevue_type_script_lang_js_,
  timevue_type_template_id_66da3953_render,
  timevue_type_template_id_66da3953_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ var time = (time_component.exports);
// CONCATENATED MODULE: ./src/index.js





























var components = [address, checkboxGroup, crudform, crudgrid, date, datetime, daterange, dialogform, field, fields, filterform, components_form, formitem, grid, list, input, inputnumber, relationtomany, relation, components_select, components_switch, components_textarea, time];

var src_install = function install(Vue) {
  components.map(function (component) {
    Vue.component(component.name, component);
  });

  Vue.$loadComponent = function (opts) {
    var script = document.createElement('script');

    opts.onLoad = opts.onLoad || function () {};

    opts.onError = opts.onError || function () {};

    script.src = opts.path;
    script.async = true;

    script.onload = function () {
      var component = Vue.component(opts.name);

      if (component) {
        opts.onLoad(component);
      } else {
        opts.onError();
      }
    };

    script.onerror = opts.onError;
    document.body.appendChild(script);
  };
};
/* istanbul ignore if */
// if (typeof window !== 'undefined' && window.Vue) {
//   install(window.Vue)
// }


String.prototype.capitalize = function () {
  return this.charAt(0).toUpperCase() + this.slice(1);
};

Array.prototype.groupBy = function (keyFunction) {
  var groups = {};
  this.forEach(function (el) {
    var key = keyFunction(el);

    if (key in groups == false) {
      groups[key] = [];
    }

    groups[key].push(el);
  });
  return Object.keys(groups).map(function (key) {
    return {
      key: key,
      values: groups[key]
    };
  });
};

var comps = {};
components.forEach(function (val) {
  comps[val.name] = val;
});
/* harmony default export */ var src = ({
  version: '2.0.0',
  install: src_install,
  //components:comps,
  OaConnector: OaConnector,
  createApp: CrudApp.create
}); //const _default = module.exports;
//export { _default as default };
// CONCATENATED MODULE: ./node_modules/@vue/cli-service/lib/commands/build/entry-lib.js


/* harmony default export */ var entry_lib = __webpack_exports__["default"] = (src);



/***/ }),

/***/ "fdef":
/***/ (function(module, exports) {

module.exports = '\x09\x0A\x0B\x0C\x0D\x20\xA0\u1680\u180E\u2000\u2001\u2002\u2003' +
  '\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF';


/***/ })

/******/ });
});
//# sourceMappingURL=vuecrud.umd.js.map

/***/ }),
/* 8 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_layout_vue__ = __webpack_require__(2);
/* unused harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_c68ad978_hasScoped_false_optionsId_0_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_layout_vue__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__node_modules_vue_loader_lib_runtime_component_normalizer__ = __webpack_require__(10);
var disposed = false
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = null
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null

var Component = Object(__WEBPACK_IMPORTED_MODULE_2__node_modules_vue_loader_lib_runtime_component_normalizer__["a" /* default */])(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_layout_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_c68ad978_hasScoped_false_optionsId_0_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_layout_vue__["a" /* render */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_c68ad978_hasScoped_false_optionsId_0_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_layout_vue__["b" /* staticRenderFns */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "ClientApp\\crud\\layout.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-c68ad978", Component.options)
  } else {
    hotAPI.reload("data-v-c68ad978", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 9 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return staticRenderFns; });
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", [
    _c("ol", { staticClass: "breadcrumb" }, [
      _vm._m(0),
      _vm._v(" "),
      _c("li", { staticClass: "breadcrumb-item active" }, [
        _vm._v(_vm._s(_vm.title))
      ]),
      _vm._v(" "),
      _vm._m(1)
    ]),
    _vm._v(" "),
    _c("div", { staticClass: "container-fluid" }, [_vm._t("default")], 2)
  ])
}
var staticRenderFns = [
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("li", { staticClass: "breadcrumb-item" }, [
      _c("a", { attrs: { href: "#" } }, [_vm._v("Admin")])
    ])
  },
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("li", { staticClass: "breadcrumb-menu d-md-down-none" }, [
      _c("div", {
        staticClass: "btn-group",
        attrs: { role: "group", "aria-label": "Button group" }
      })
    ])
  }
]
render._withStripped = true

if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-c68ad978", { render: render, staticRenderFns: staticRenderFns })
  }
}

/***/ }),
/* 10 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = normalizeComponent;
/* globals __VUE_SSR_CONTEXT__ */

// IMPORTANT: Do NOT use ES2015 features in this file (except for modules).
// This module is a runtime utility for cleaner component module output and will
// be included in the final webpack user bundle.

function normalizeComponent (
  scriptExports,
  render,
  staticRenderFns,
  functionalTemplate,
  injectStyles,
  scopeId,
  moduleIdentifier, /* server only */
  shadowMode /* vue-cli only */
) {
  scriptExports = scriptExports || {}

  // ES6 modules interop
  var type = typeof scriptExports.default
  if (type === 'object' || type === 'function') {
    scriptExports = scriptExports.default
  }

  // Vue.extend constructor export interop
  var options = typeof scriptExports === 'function'
    ? scriptExports.options
    : scriptExports

  // render functions
  if (render) {
    options.render = render
    options.staticRenderFns = staticRenderFns
    options._compiled = true
  }

  // functional template
  if (functionalTemplate) {
    options.functional = true
  }

  // scopedId
  if (scopeId) {
    options._scopeId = scopeId
  }

  var hook
  if (moduleIdentifier) { // server build
    hook = function (context) {
      // 2.3 injection
      context =
        context || // cached call
        (this.$vnode && this.$vnode.ssrContext) || // stateful
        (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext) // functional
      // 2.2 with runInNewContext: true
      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__
      }
      // inject component styles
      if (injectStyles) {
        injectStyles.call(this, context)
      }
      // register component module identifier for async chunk inferrence
      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier)
      }
    }
    // used by ssr in case component is cached and beforeCreate
    // never gets called
    options._ssrRegister = hook
  } else if (injectStyles) {
    hook = shadowMode
      ? function () { injectStyles.call(this, this.$root.$options.shadowRoot) }
      : injectStyles
  }

  if (hook) {
    if (options.functional) {
      // for template-only hot-reload because in that case the render fn doesn't
      // go through the normalizer
      options._injectStyles = hook
      // register for functioal component in vue file
      var originalRender = options.render
      options.render = function renderWithStyleInjection (h, context) {
        hook.call(context)
        return originalRender(h, context)
      }
    } else {
      // inject component registration as beforeCreate hook
      var existing = options.beforeCreate
      options.beforeCreate = existing
        ? [].concat(existing, hook)
        : [hook]
    }
  }

  return {
    exports: scriptExports,
    options: options
  }
}


/***/ })
/******/ ]);
//# sourceMappingURL=crud.js.map