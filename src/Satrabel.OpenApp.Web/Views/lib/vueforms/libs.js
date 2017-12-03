/*!
 * Vue.js v2.5.9
 * (c) 2014-2017 Evan You
 * Released under the MIT License.
 */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.Vue = factory());
}(this, (function () { 'use strict';

/*  */

var emptyObject = Object.freeze({});

// these helpers produces better vm code in JS engines due to their
// explicitness and function inlining
function isUndef (v) {
  return v === undefined || v === null
}

function isDef (v) {
  return v !== undefined && v !== null
}

function isTrue (v) {
  return v === true
}

function isFalse (v) {
  return v === false
}

/**
 * Check if value is primitive
 */
function isPrimitive (value) {
  return (
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean'
  )
}

/**
 * Quick object check - this is primarily used to tell
 * Objects from primitive values when we know the value
 * is a JSON-compliant type.
 */
function isObject (obj) {
  return obj !== null && typeof obj === 'object'
}

/**
 * Get the raw type string of a value e.g. [object Object]
 */
var _toString = Object.prototype.toString;

function toRawType (value) {
  return _toString.call(value).slice(8, -1)
}

/**
 * Strict object type check. Only returns true
 * for plain JavaScript objects.
 */
function isPlainObject (obj) {
  return _toString.call(obj) === '[object Object]'
}

function isRegExp (v) {
  return _toString.call(v) === '[object RegExp]'
}

/**
 * Check if val is a valid array index.
 */
function isValidArrayIndex (val) {
  var n = parseFloat(String(val));
  return n >= 0 && Math.floor(n) === n && isFinite(val)
}

/**
 * Convert a value to a string that is actually rendered.
 */
function toString (val) {
  return val == null
    ? ''
    : typeof val === 'object'
      ? JSON.stringify(val, null, 2)
      : String(val)
}

/**
 * Convert a input value to a number for persistence.
 * If the conversion fails, return original string.
 */
function toNumber (val) {
  var n = parseFloat(val);
  return isNaN(n) ? val : n
}

/**
 * Make a map and return a function for checking if a key
 * is in that map.
 */
function makeMap (
  str,
  expectsLowerCase
) {
  var map = Object.create(null);
  var list = str.split(',');
  for (var i = 0; i < list.length; i++) {
    map[list[i]] = true;
  }
  return expectsLowerCase
    ? function (val) { return map[val.toLowerCase()]; }
    : function (val) { return map[val]; }
}

/**
 * Check if a tag is a built-in tag.
 */
var isBuiltInTag = makeMap('slot,component', true);

/**
 * Check if a attribute is a reserved attribute.
 */
var isReservedAttribute = makeMap('key,ref,slot,slot-scope,is');

/**
 * Remove an item from an array
 */
function remove (arr, item) {
  if (arr.length) {
    var index = arr.indexOf(item);
    if (index > -1) {
      return arr.splice(index, 1)
    }
  }
}

/**
 * Check whether the object has the property.
 */
var hasOwnProperty = Object.prototype.hasOwnProperty;
function hasOwn (obj, key) {
  return hasOwnProperty.call(obj, key)
}

/**
 * Create a cached version of a pure function.
 */
function cached (fn) {
  var cache = Object.create(null);
  return (function cachedFn (str) {
    var hit = cache[str];
    return hit || (cache[str] = fn(str))
  })
}

/**
 * Camelize a hyphen-delimited string.
 */
var camelizeRE = /-(\w)/g;
var camelize = cached(function (str) {
  return str.replace(camelizeRE, function (_, c) { return c ? c.toUpperCase() : ''; })
});

/**
 * Capitalize a string.
 */
var capitalize = cached(function (str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
});

/**
 * Hyphenate a camelCase string.
 */
var hyphenateRE = /\B([A-Z])/g;
var hyphenate = cached(function (str) {
  return str.replace(hyphenateRE, '-$1').toLowerCase()
});

/**
 * Simple bind, faster than native
 */
function bind (fn, ctx) {
  function boundFn (a) {
    var l = arguments.length;
    return l
      ? l > 1
        ? fn.apply(ctx, arguments)
        : fn.call(ctx, a)
      : fn.call(ctx)
  }
  // record original fn length
  boundFn._length = fn.length;
  return boundFn
}

/**
 * Convert an Array-like object to a real Array.
 */
function toArray (list, start) {
  start = start || 0;
  var i = list.length - start;
  var ret = new Array(i);
  while (i--) {
    ret[i] = list[i + start];
  }
  return ret
}

/**
 * Mix properties into target object.
 */
function extend (to, _from) {
  for (var key in _from) {
    to[key] = _from[key];
  }
  return to
}

/**
 * Merge an Array of Objects into a single Object.
 */
function toObject (arr) {
  var res = {};
  for (var i = 0; i < arr.length; i++) {
    if (arr[i]) {
      extend(res, arr[i]);
    }
  }
  return res
}

/**
 * Perform no operation.
 * Stubbing args to make Flow happy without leaving useless transpiled code
 * with ...rest (https://flow.org/blog/2017/05/07/Strict-Function-Call-Arity/)
 */
function noop (a, b, c) {}

/**
 * Always return false.
 */
var no = function (a, b, c) { return false; };

/**
 * Return same value
 */
var identity = function (_) { return _; };

/**
 * Generate a static keys string from compiler modules.
 */
function genStaticKeys (modules) {
  return modules.reduce(function (keys, m) {
    return keys.concat(m.staticKeys || [])
  }, []).join(',')
}

/**
 * Check if two values are loosely equal - that is,
 * if they are plain objects, do they have the same shape?
 */
function looseEqual (a, b) {
  if (a === b) { return true }
  var isObjectA = isObject(a);
  var isObjectB = isObject(b);
  if (isObjectA && isObjectB) {
    try {
      var isArrayA = Array.isArray(a);
      var isArrayB = Array.isArray(b);
      if (isArrayA && isArrayB) {
        return a.length === b.length && a.every(function (e, i) {
          return looseEqual(e, b[i])
        })
      } else if (!isArrayA && !isArrayB) {
        var keysA = Object.keys(a);
        var keysB = Object.keys(b);
        return keysA.length === keysB.length && keysA.every(function (key) {
          return looseEqual(a[key], b[key])
        })
      } else {
        /* istanbul ignore next */
        return false
      }
    } catch (e) {
      /* istanbul ignore next */
      return false
    }
  } else if (!isObjectA && !isObjectB) {
    return String(a) === String(b)
  } else {
    return false
  }
}

function looseIndexOf (arr, val) {
  for (var i = 0; i < arr.length; i++) {
    if (looseEqual(arr[i], val)) { return i }
  }
  return -1
}

/**
 * Ensure a function is called only once.
 */
function once (fn) {
  var called = false;
  return function () {
    if (!called) {
      called = true;
      fn.apply(this, arguments);
    }
  }
}

var SSR_ATTR = 'data-server-rendered';

var ASSET_TYPES = [
  'component',
  'directive',
  'filter'
];

var LIFECYCLE_HOOKS = [
  'beforeCreate',
  'created',
  'beforeMount',
  'mounted',
  'beforeUpdate',
  'updated',
  'beforeDestroy',
  'destroyed',
  'activated',
  'deactivated',
  'errorCaptured'
];

/*  */

var config = ({
  /**
   * Option merge strategies (used in core/util/options)
   */
  optionMergeStrategies: Object.create(null),

  /**
   * Whether to suppress warnings.
   */
  silent: false,

  /**
   * Show production mode tip message on boot?
   */
  productionTip: "development" !== 'production',

  /**
   * Whether to enable devtools
   */
  devtools: "development" !== 'production',

  /**
   * Whether to record perf
   */
  performance: false,

  /**
   * Error handler for watcher errors
   */
  errorHandler: null,

  /**
   * Warn handler for watcher warns
   */
  warnHandler: null,

  /**
   * Ignore certain custom elements
   */
  ignoredElements: [],

  /**
   * Custom user key aliases for v-on
   */
  keyCodes: Object.create(null),

  /**
   * Check if a tag is reserved so that it cannot be registered as a
   * component. This is platform-dependent and may be overwritten.
   */
  isReservedTag: no,

  /**
   * Check if an attribute is reserved so that it cannot be used as a component
   * prop. This is platform-dependent and may be overwritten.
   */
  isReservedAttr: no,

  /**
   * Check if a tag is an unknown element.
   * Platform-dependent.
   */
  isUnknownElement: no,

  /**
   * Get the namespace of an element
   */
  getTagNamespace: noop,

  /**
   * Parse the real tag name for the specific platform.
   */
  parsePlatformTagName: identity,

  /**
   * Check if an attribute must be bound using property, e.g. value
   * Platform-dependent.
   */
  mustUseProp: no,

  /**
   * Exposed for legacy reasons
   */
  _lifecycleHooks: LIFECYCLE_HOOKS
});

/*  */

/**
 * Check if a string starts with $ or _
 */
function isReserved (str) {
  var c = (str + '').charCodeAt(0);
  return c === 0x24 || c === 0x5F
}

/**
 * Define a property.
 */
function def (obj, key, val, enumerable) {
  Object.defineProperty(obj, key, {
    value: val,
    enumerable: !!enumerable,
    writable: true,
    configurable: true
  });
}

/**
 * Parse simple path.
 */
var bailRE = /[^\w.$]/;
function parsePath (path) {
  if (bailRE.test(path)) {
    return
  }
  var segments = path.split('.');
  return function (obj) {
    for (var i = 0; i < segments.length; i++) {
      if (!obj) { return }
      obj = obj[segments[i]];
    }
    return obj
  }
}

/*  */


// can we use __proto__?
var hasProto = '__proto__' in {};

// Browser environment sniffing
var inBrowser = typeof window !== 'undefined';
var inWeex = typeof WXEnvironment !== 'undefined' && !!WXEnvironment.platform;
var weexPlatform = inWeex && WXEnvironment.platform.toLowerCase();
var UA = inBrowser && window.navigator.userAgent.toLowerCase();
var isIE = UA && /msie|trident/.test(UA);
var isIE9 = UA && UA.indexOf('msie 9.0') > 0;
var isEdge = UA && UA.indexOf('edge/') > 0;
var isAndroid = (UA && UA.indexOf('android') > 0) || (weexPlatform === 'android');
var isIOS = (UA && /iphone|ipad|ipod|ios/.test(UA)) || (weexPlatform === 'ios');
var isChrome = UA && /chrome\/\d+/.test(UA) && !isEdge;

// Firefox has a "watch" function on Object.prototype...
var nativeWatch = ({}).watch;

var supportsPassive = false;
if (inBrowser) {
  try {
    var opts = {};
    Object.defineProperty(opts, 'passive', ({
      get: function get () {
        /* istanbul ignore next */
        supportsPassive = true;
      }
    })); // https://github.com/facebook/flow/issues/285
    window.addEventListener('test-passive', null, opts);
  } catch (e) {}
}

// this needs to be lazy-evaled because vue may be required before
// vue-server-renderer can set VUE_ENV
var _isServer;
var isServerRendering = function () {
  if (_isServer === undefined) {
    /* istanbul ignore if */
    if (!inBrowser && typeof global !== 'undefined') {
      // detect presence of vue-server-renderer and avoid
      // Webpack shimming the process
      _isServer = global['process'].env.VUE_ENV === 'server';
    } else {
      _isServer = false;
    }
  }
  return _isServer
};

// detect devtools
var devtools = inBrowser && window.__VUE_DEVTOOLS_GLOBAL_HOOK__;

/* istanbul ignore next */
function isNative (Ctor) {
  return typeof Ctor === 'function' && /native code/.test(Ctor.toString())
}

var hasSymbol =
  typeof Symbol !== 'undefined' && isNative(Symbol) &&
  typeof Reflect !== 'undefined' && isNative(Reflect.ownKeys);

var _Set;
/* istanbul ignore if */ // $flow-disable-line
if (typeof Set !== 'undefined' && isNative(Set)) {
  // use native Set when available.
  _Set = Set;
} else {
  // a non-standard Set polyfill that only works with primitive keys.
  _Set = (function () {
    function Set () {
      this.set = Object.create(null);
    }
    Set.prototype.has = function has (key) {
      return this.set[key] === true
    };
    Set.prototype.add = function add (key) {
      this.set[key] = true;
    };
    Set.prototype.clear = function clear () {
      this.set = Object.create(null);
    };

    return Set;
  }());
}

/*  */

var warn = noop;
var tip = noop;
var generateComponentTrace = (noop); // work around flow check
var formatComponentName = (noop);

{
  var hasConsole = typeof console !== 'undefined';
  var classifyRE = /(?:^|[-_])(\w)/g;
  var classify = function (str) { return str
    .replace(classifyRE, function (c) { return c.toUpperCase(); })
    .replace(/[-_]/g, ''); };

  warn = function (msg, vm) {
    var trace = vm ? generateComponentTrace(vm) : '';

    if (config.warnHandler) {
      config.warnHandler.call(null, msg, vm, trace);
    } else if (hasConsole && (!config.silent)) {
      console.error(("[Vue warn]: " + msg + trace));
    }
  };

  tip = function (msg, vm) {
    if (hasConsole && (!config.silent)) {
      console.warn("[Vue tip]: " + msg + (
        vm ? generateComponentTrace(vm) : ''
      ));
    }
  };

  formatComponentName = function (vm, includeFile) {
    if (vm.$root === vm) {
      return '<Root>'
    }
    var options = typeof vm === 'function' && vm.cid != null
      ? vm.options
      : vm._isVue
        ? vm.$options || vm.constructor.options
        : vm || {};
    var name = options.name || options._componentTag;
    var file = options.__file;
    if (!name && file) {
      var match = file.match(/([^/\\]+)\.vue$/);
      name = match && match[1];
    }

    return (
      (name ? ("<" + (classify(name)) + ">") : "<Anonymous>") +
      (file && includeFile !== false ? (" at " + file) : '')
    )
  };

  var repeat = function (str, n) {
    var res = '';
    while (n) {
      if (n % 2 === 1) { res += str; }
      if (n > 1) { str += str; }
      n >>= 1;
    }
    return res
  };

  generateComponentTrace = function (vm) {
    if (vm._isVue && vm.$parent) {
      var tree = [];
      var currentRecursiveSequence = 0;
      while (vm) {
        if (tree.length > 0) {
          var last = tree[tree.length - 1];
          if (last.constructor === vm.constructor) {
            currentRecursiveSequence++;
            vm = vm.$parent;
            continue
          } else if (currentRecursiveSequence > 0) {
            tree[tree.length - 1] = [last, currentRecursiveSequence];
            currentRecursiveSequence = 0;
          }
        }
        tree.push(vm);
        vm = vm.$parent;
      }
      return '\n\nfound in\n\n' + tree
        .map(function (vm, i) { return ("" + (i === 0 ? '---> ' : repeat(' ', 5 + i * 2)) + (Array.isArray(vm)
            ? ((formatComponentName(vm[0])) + "... (" + (vm[1]) + " recursive calls)")
            : formatComponentName(vm))); })
        .join('\n')
    } else {
      return ("\n\n(found in " + (formatComponentName(vm)) + ")")
    }
  };
}

/*  */


var uid = 0;

/**
 * A dep is an observable that can have multiple
 * directives subscribing to it.
 */
var Dep = function Dep () {
  this.id = uid++;
  this.subs = [];
};

Dep.prototype.addSub = function addSub (sub) {
  this.subs.push(sub);
};

Dep.prototype.removeSub = function removeSub (sub) {
  remove(this.subs, sub);
};

Dep.prototype.depend = function depend () {
  if (Dep.target) {
    Dep.target.addDep(this);
  }
};

Dep.prototype.notify = function notify () {
  // stabilize the subscriber list first
  var subs = this.subs.slice();
  for (var i = 0, l = subs.length; i < l; i++) {
    subs[i].update();
  }
};

// the current target watcher being evaluated.
// this is globally unique because there could be only one
// watcher being evaluated at any time.
Dep.target = null;
var targetStack = [];

function pushTarget (_target) {
  if (Dep.target) { targetStack.push(Dep.target); }
  Dep.target = _target;
}

function popTarget () {
  Dep.target = targetStack.pop();
}

/*  */

var VNode = function VNode (
  tag,
  data,
  children,
  text,
  elm,
  context,
  componentOptions,
  asyncFactory
) {
  this.tag = tag;
  this.data = data;
  this.children = children;
  this.text = text;
  this.elm = elm;
  this.ns = undefined;
  this.context = context;
  this.fnContext = undefined;
  this.fnOptions = undefined;
  this.fnScopeId = undefined;
  this.key = data && data.key;
  this.componentOptions = componentOptions;
  this.componentInstance = undefined;
  this.parent = undefined;
  this.raw = false;
  this.isStatic = false;
  this.isRootInsert = true;
  this.isComment = false;
  this.isCloned = false;
  this.isOnce = false;
  this.asyncFactory = asyncFactory;
  this.asyncMeta = undefined;
  this.isAsyncPlaceholder = false;
};

var prototypeAccessors = { child: { configurable: true } };

// DEPRECATED: alias for componentInstance for backwards compat.
/* istanbul ignore next */
prototypeAccessors.child.get = function () {
  return this.componentInstance
};

Object.defineProperties( VNode.prototype, prototypeAccessors );

var createEmptyVNode = function (text) {
  if ( text === void 0 ) text = '';

  var node = new VNode();
  node.text = text;
  node.isComment = true;
  return node
};

function createTextVNode (val) {
  return new VNode(undefined, undefined, undefined, String(val))
}

// optimized shallow clone
// used for static nodes and slot nodes because they may be reused across
// multiple renders, cloning them avoids errors when DOM manipulations rely
// on their elm reference.
function cloneVNode (vnode, deep) {
  var componentOptions = vnode.componentOptions;
  var cloned = new VNode(
    vnode.tag,
    vnode.data,
    vnode.children,
    vnode.text,
    vnode.elm,
    vnode.context,
    componentOptions,
    vnode.asyncFactory
  );
  cloned.ns = vnode.ns;
  cloned.isStatic = vnode.isStatic;
  cloned.key = vnode.key;
  cloned.isComment = vnode.isComment;
  cloned.fnContext = vnode.fnContext;
  cloned.fnOptions = vnode.fnOptions;
  cloned.fnScopeId = vnode.fnScopeId;
  cloned.isCloned = true;
  if (deep) {
    if (vnode.children) {
      cloned.children = cloneVNodes(vnode.children, true);
    }
    if (componentOptions && componentOptions.children) {
      componentOptions.children = cloneVNodes(componentOptions.children, true);
    }
  }
  return cloned
}

function cloneVNodes (vnodes, deep) {
  var len = vnodes.length;
  var res = new Array(len);
  for (var i = 0; i < len; i++) {
    res[i] = cloneVNode(vnodes[i], deep);
  }
  return res
}

/*
 * not type checking this file because flow doesn't play well with
 * dynamically accessing methods on Array prototype
 */

var arrayProto = Array.prototype;
var arrayMethods = Object.create(arrayProto);[
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse'
]
.forEach(function (method) {
  // cache original method
  var original = arrayProto[method];
  def(arrayMethods, method, function mutator () {
    var args = [], len = arguments.length;
    while ( len-- ) args[ len ] = arguments[ len ];

    var result = original.apply(this, args);
    var ob = this.__ob__;
    var inserted;
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args;
        break
      case 'splice':
        inserted = args.slice(2);
        break
    }
    if (inserted) { ob.observeArray(inserted); }
    // notify change
    ob.dep.notify();
    return result
  });
});

/*  */

var arrayKeys = Object.getOwnPropertyNames(arrayMethods);

/**
 * By default, when a reactive property is set, the new value is
 * also converted to become reactive. However when passing down props,
 * we don't want to force conversion because the value may be a nested value
 * under a frozen data structure. Converting it would defeat the optimization.
 */
var observerState = {
  shouldConvert: true
};

/**
 * Observer class that are attached to each observed
 * object. Once attached, the observer converts target
 * object's property keys into getter/setters that
 * collect dependencies and dispatches updates.
 */
var Observer = function Observer (value) {
  this.value = value;
  this.dep = new Dep();
  this.vmCount = 0;
  def(value, '__ob__', this);
  if (Array.isArray(value)) {
    var augment = hasProto
      ? protoAugment
      : copyAugment;
    augment(value, arrayMethods, arrayKeys);
    this.observeArray(value);
  } else {
    this.walk(value);
  }
};

/**
 * Walk through each property and convert them into
 * getter/setters. This method should only be called when
 * value type is Object.
 */
Observer.prototype.walk = function walk (obj) {
  var keys = Object.keys(obj);
  for (var i = 0; i < keys.length; i++) {
    defineReactive(obj, keys[i], obj[keys[i]]);
  }
};

/**
 * Observe a list of Array items.
 */
Observer.prototype.observeArray = function observeArray (items) {
  for (var i = 0, l = items.length; i < l; i++) {
    observe(items[i]);
  }
};

// helpers

/**
 * Augment an target Object or Array by intercepting
 * the prototype chain using __proto__
 */
function protoAugment (target, src, keys) {
  /* eslint-disable no-proto */
  target.__proto__ = src;
  /* eslint-enable no-proto */
}

/**
 * Augment an target Object or Array by defining
 * hidden properties.
 */
/* istanbul ignore next */
function copyAugment (target, src, keys) {
  for (var i = 0, l = keys.length; i < l; i++) {
    var key = keys[i];
    def(target, key, src[key]);
  }
}

/**
 * Attempt to create an observer instance for a value,
 * returns the new observer if successfully observed,
 * or the existing observer if the value already has one.
 */
function observe (value, asRootData) {
  if (!isObject(value) || value instanceof VNode) {
    return
  }
  var ob;
  if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
    ob = value.__ob__;
  } else if (
    observerState.shouldConvert &&
    !isServerRendering() &&
    (Array.isArray(value) || isPlainObject(value)) &&
    Object.isExtensible(value) &&
    !value._isVue
  ) {
    ob = new Observer(value);
  }
  if (asRootData && ob) {
    ob.vmCount++;
  }
  return ob
}

/**
 * Define a reactive property on an Object.
 */
function defineReactive (
  obj,
  key,
  val,
  customSetter,
  shallow
) {
  var dep = new Dep();

  var property = Object.getOwnPropertyDescriptor(obj, key);
  if (property && property.configurable === false) {
    return
  }

  // cater for pre-defined getter/setters
  var getter = property && property.get;
  var setter = property && property.set;

  var childOb = !shallow && observe(val);
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter () {
      var value = getter ? getter.call(obj) : val;
      if (Dep.target) {
        dep.depend();
        if (childOb) {
          childOb.dep.depend();
          if (Array.isArray(value)) {
            dependArray(value);
          }
        }
      }
      return value
    },
    set: function reactiveSetter (newVal) {
      var value = getter ? getter.call(obj) : val;
      /* eslint-disable no-self-compare */
      if (newVal === value || (newVal !== newVal && value !== value)) {
        return
      }
      /* eslint-enable no-self-compare */
      if ("development" !== 'production' && customSetter) {
        customSetter();
      }
      if (setter) {
        setter.call(obj, newVal);
      } else {
        val = newVal;
      }
      childOb = !shallow && observe(newVal);
      dep.notify();
    }
  });
}

/**
 * Set a property on an object. Adds the new property and
 * triggers change notification if the property doesn't
 * already exist.
 */
function set (target, key, val) {
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.length = Math.max(target.length, key);
    target.splice(key, 1, val);
    return val
  }
  if (key in target && !(key in Object.prototype)) {
    target[key] = val;
    return val
  }
  var ob = (target).__ob__;
  if (target._isVue || (ob && ob.vmCount)) {
    "development" !== 'production' && warn(
      'Avoid adding reactive properties to a Vue instance or its root $data ' +
      'at runtime - declare it upfront in the data option.'
    );
    return val
  }
  if (!ob) {
    target[key] = val;
    return val
  }
  defineReactive(ob.value, key, val);
  ob.dep.notify();
  return val
}

/**
 * Delete a property and trigger change if necessary.
 */
function del (target, key) {
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.splice(key, 1);
    return
  }
  var ob = (target).__ob__;
  if (target._isVue || (ob && ob.vmCount)) {
    "development" !== 'production' && warn(
      'Avoid deleting properties on a Vue instance or its root $data ' +
      '- just set it to null.'
    );
    return
  }
  if (!hasOwn(target, key)) {
    return
  }
  delete target[key];
  if (!ob) {
    return
  }
  ob.dep.notify();
}

/**
 * Collect dependencies on array elements when the array is touched, since
 * we cannot intercept array element access like property getters.
 */
function dependArray (value) {
  for (var e = (void 0), i = 0, l = value.length; i < l; i++) {
    e = value[i];
    e && e.__ob__ && e.__ob__.dep.depend();
    if (Array.isArray(e)) {
      dependArray(e);
    }
  }
}

/*  */

/**
 * Option overwriting strategies are functions that handle
 * how to merge a parent option value and a child option
 * value into the final value.
 */
var strats = config.optionMergeStrategies;

/**
 * Options with restrictions
 */
{
  strats.el = strats.propsData = function (parent, child, vm, key) {
    if (!vm) {
      warn(
        "option \"" + key + "\" can only be used during instance " +
        'creation with the `new` keyword.'
      );
    }
    return defaultStrat(parent, child)
  };
}

/**
 * Helper that recursively merges two data objects together.
 */
function mergeData (to, from) {
  if (!from) { return to }
  var key, toVal, fromVal;
  var keys = Object.keys(from);
  for (var i = 0; i < keys.length; i++) {
    key = keys[i];
    toVal = to[key];
    fromVal = from[key];
    if (!hasOwn(to, key)) {
      set(to, key, fromVal);
    } else if (isPlainObject(toVal) && isPlainObject(fromVal)) {
      mergeData(toVal, fromVal);
    }
  }
  return to
}

/**
 * Data
 */
function mergeDataOrFn (
  parentVal,
  childVal,
  vm
) {
  if (!vm) {
    // in a Vue.extend merge, both should be functions
    if (!childVal) {
      return parentVal
    }
    if (!parentVal) {
      return childVal
    }
    // when parentVal & childVal are both present,
    // we need to return a function that returns the
    // merged result of both functions... no need to
    // check if parentVal is a function here because
    // it has to be a function to pass previous merges.
    return function mergedDataFn () {
      return mergeData(
        typeof childVal === 'function' ? childVal.call(this) : childVal,
        typeof parentVal === 'function' ? parentVal.call(this) : parentVal
      )
    }
  } else {
    return function mergedInstanceDataFn () {
      // instance merge
      var instanceData = typeof childVal === 'function'
        ? childVal.call(vm)
        : childVal;
      var defaultData = typeof parentVal === 'function'
        ? parentVal.call(vm)
        : parentVal;
      if (instanceData) {
        return mergeData(instanceData, defaultData)
      } else {
        return defaultData
      }
    }
  }
}

strats.data = function (
  parentVal,
  childVal,
  vm
) {
  if (!vm) {
    if (childVal && typeof childVal !== 'function') {
      "development" !== 'production' && warn(
        'The "data" option should be a function ' +
        'that returns a per-instance value in component ' +
        'definitions.',
        vm
      );

      return parentVal
    }
    return mergeDataOrFn(parentVal, childVal)
  }

  return mergeDataOrFn(parentVal, childVal, vm)
};

/**
 * Hooks and props are merged as arrays.
 */
function mergeHook (
  parentVal,
  childVal
) {
  return childVal
    ? parentVal
      ? parentVal.concat(childVal)
      : Array.isArray(childVal)
        ? childVal
        : [childVal]
    : parentVal
}

LIFECYCLE_HOOKS.forEach(function (hook) {
  strats[hook] = mergeHook;
});

/**
 * Assets
 *
 * When a vm is present (instance creation), we need to do
 * a three-way merge between constructor options, instance
 * options and parent options.
 */
function mergeAssets (
  parentVal,
  childVal,
  vm,
  key
) {
  var res = Object.create(parentVal || null);
  if (childVal) {
    "development" !== 'production' && assertObjectType(key, childVal, vm);
    return extend(res, childVal)
  } else {
    return res
  }
}

ASSET_TYPES.forEach(function (type) {
  strats[type + 's'] = mergeAssets;
});

/**
 * Watchers.
 *
 * Watchers hashes should not overwrite one
 * another, so we merge them as arrays.
 */
strats.watch = function (
  parentVal,
  childVal,
  vm,
  key
) {
  // work around Firefox's Object.prototype.watch...
  if (parentVal === nativeWatch) { parentVal = undefined; }
  if (childVal === nativeWatch) { childVal = undefined; }
  /* istanbul ignore if */
  if (!childVal) { return Object.create(parentVal || null) }
  {
    assertObjectType(key, childVal, vm);
  }
  if (!parentVal) { return childVal }
  var ret = {};
  extend(ret, parentVal);
  for (var key$1 in childVal) {
    var parent = ret[key$1];
    var child = childVal[key$1];
    if (parent && !Array.isArray(parent)) {
      parent = [parent];
    }
    ret[key$1] = parent
      ? parent.concat(child)
      : Array.isArray(child) ? child : [child];
  }
  return ret
};

/**
 * Other object hashes.
 */
strats.props =
strats.methods =
strats.inject =
strats.computed = function (
  parentVal,
  childVal,
  vm,
  key
) {
  if (childVal && "development" !== 'production') {
    assertObjectType(key, childVal, vm);
  }
  if (!parentVal) { return childVal }
  var ret = Object.create(null);
  extend(ret, parentVal);
  if (childVal) { extend(ret, childVal); }
  return ret
};
strats.provide = mergeDataOrFn;

/**
 * Default strategy.
 */
var defaultStrat = function (parentVal, childVal) {
  return childVal === undefined
    ? parentVal
    : childVal
};

/**
 * Validate component names
 */
function checkComponents (options) {
  for (var key in options.components) {
    var lower = key.toLowerCase();
    if (isBuiltInTag(lower) || config.isReservedTag(lower)) {
      warn(
        'Do not use built-in or reserved HTML elements as component ' +
        'id: ' + key
      );
    }
  }
}

/**
 * Ensure all props option syntax are normalized into the
 * Object-based format.
 */
function normalizeProps (options, vm) {
  var props = options.props;
  if (!props) { return }
  var res = {};
  var i, val, name;
  if (Array.isArray(props)) {
    i = props.length;
    while (i--) {
      val = props[i];
      if (typeof val === 'string') {
        name = camelize(val);
        res[name] = { type: null };
      } else {
        warn('props must be strings when using array syntax.');
      }
    }
  } else if (isPlainObject(props)) {
    for (var key in props) {
      val = props[key];
      name = camelize(key);
      res[name] = isPlainObject(val)
        ? val
        : { type: val };
    }
  } else {
    warn(
      "Invalid value for option \"props\": expected an Array or an Object, " +
      "but got " + (toRawType(props)) + ".",
      vm
    );
  }
  options.props = res;
}

/**
 * Normalize all injections into Object-based format
 */
function normalizeInject (options, vm) {
  var inject = options.inject;
  var normalized = options.inject = {};
  if (Array.isArray(inject)) {
    for (var i = 0; i < inject.length; i++) {
      normalized[inject[i]] = { from: inject[i] };
    }
  } else if (isPlainObject(inject)) {
    for (var key in inject) {
      var val = inject[key];
      normalized[key] = isPlainObject(val)
        ? extend({ from: key }, val)
        : { from: val };
    }
  } else if ("development" !== 'production' && inject) {
    warn(
      "Invalid value for option \"inject\": expected an Array or an Object, " +
      "but got " + (toRawType(inject)) + ".",
      vm
    );
  }
}

/**
 * Normalize raw function directives into object format.
 */
function normalizeDirectives (options) {
  var dirs = options.directives;
  if (dirs) {
    for (var key in dirs) {
      var def = dirs[key];
      if (typeof def === 'function') {
        dirs[key] = { bind: def, update: def };
      }
    }
  }
}

function assertObjectType (name, value, vm) {
  if (!isPlainObject(value)) {
    warn(
      "Invalid value for option \"" + name + "\": expected an Object, " +
      "but got " + (toRawType(value)) + ".",
      vm
    );
  }
}

/**
 * Merge two option objects into a new one.
 * Core utility used in both instantiation and inheritance.
 */
function mergeOptions (
  parent,
  child,
  vm
) {
  {
    checkComponents(child);
  }

  if (typeof child === 'function') {
    child = child.options;
  }

  normalizeProps(child, vm);
  normalizeInject(child, vm);
  normalizeDirectives(child);
  var extendsFrom = child.extends;
  if (extendsFrom) {
    parent = mergeOptions(parent, extendsFrom, vm);
  }
  if (child.mixins) {
    for (var i = 0, l = child.mixins.length; i < l; i++) {
      parent = mergeOptions(parent, child.mixins[i], vm);
    }
  }
  var options = {};
  var key;
  for (key in parent) {
    mergeField(key);
  }
  for (key in child) {
    if (!hasOwn(parent, key)) {
      mergeField(key);
    }
  }
  function mergeField (key) {
    var strat = strats[key] || defaultStrat;
    options[key] = strat(parent[key], child[key], vm, key);
  }
  return options
}

/**
 * Resolve an asset.
 * This function is used because child instances need access
 * to assets defined in its ancestor chain.
 */
function resolveAsset (
  options,
  type,
  id,
  warnMissing
) {
  /* istanbul ignore if */
  if (typeof id !== 'string') {
    return
  }
  var assets = options[type];
  // check local registration variations first
  if (hasOwn(assets, id)) { return assets[id] }
  var camelizedId = camelize(id);
  if (hasOwn(assets, camelizedId)) { return assets[camelizedId] }
  var PascalCaseId = capitalize(camelizedId);
  if (hasOwn(assets, PascalCaseId)) { return assets[PascalCaseId] }
  // fallback to prototype chain
  var res = assets[id] || assets[camelizedId] || assets[PascalCaseId];
  if ("development" !== 'production' && warnMissing && !res) {
    warn(
      'Failed to resolve ' + type.slice(0, -1) + ': ' + id,
      options
    );
  }
  return res
}

/*  */

function validateProp (
  key,
  propOptions,
  propsData,
  vm
) {
  var prop = propOptions[key];
  var absent = !hasOwn(propsData, key);
  var value = propsData[key];
  // handle boolean props
  if (isType(Boolean, prop.type)) {
    if (absent && !hasOwn(prop, 'default')) {
      value = false;
    } else if (!isType(String, prop.type) && (value === '' || value === hyphenate(key))) {
      value = true;
    }
  }
  // check default value
  if (value === undefined) {
    value = getPropDefaultValue(vm, prop, key);
    // since the default value is a fresh copy,
    // make sure to observe it.
    var prevShouldConvert = observerState.shouldConvert;
    observerState.shouldConvert = true;
    observe(value);
    observerState.shouldConvert = prevShouldConvert;
  }
  {
    assertProp(prop, key, value, vm, absent);
  }
  return value
}

/**
 * Get the default value of a prop.
 */
function getPropDefaultValue (vm, prop, key) {
  // no default, return undefined
  if (!hasOwn(prop, 'default')) {
    return undefined
  }
  var def = prop.default;
  // warn against non-factory defaults for Object & Array
  if ("development" !== 'production' && isObject(def)) {
    warn(
      'Invalid default value for prop "' + key + '": ' +
      'Props with type Object/Array must use a factory function ' +
      'to return the default value.',
      vm
    );
  }
  // the raw prop value was also undefined from previous render,
  // return previous default value to avoid unnecessary watcher trigger
  if (vm && vm.$options.propsData &&
    vm.$options.propsData[key] === undefined &&
    vm._props[key] !== undefined
  ) {
    return vm._props[key]
  }
  // call factory function for non-Function types
  // a value is Function if its prototype is function even across different execution context
  return typeof def === 'function' && getType(prop.type) !== 'Function'
    ? def.call(vm)
    : def
}

/**
 * Assert whether a prop is valid.
 */
function assertProp (
  prop,
  name,
  value,
  vm,
  absent
) {
  if (prop.required && absent) {
    warn(
      'Missing required prop: "' + name + '"',
      vm
    );
    return
  }
  if (value == null && !prop.required) {
    return
  }
  var type = prop.type;
  var valid = !type || type === true;
  var expectedTypes = [];
  if (type) {
    if (!Array.isArray(type)) {
      type = [type];
    }
    for (var i = 0; i < type.length && !valid; i++) {
      var assertedType = assertType(value, type[i]);
      expectedTypes.push(assertedType.expectedType || '');
      valid = assertedType.valid;
    }
  }
  if (!valid) {
    warn(
      "Invalid prop: type check failed for prop \"" + name + "\"." +
      " Expected " + (expectedTypes.map(capitalize).join(', ')) +
      ", got " + (toRawType(value)) + ".",
      vm
    );
    return
  }
  var validator = prop.validator;
  if (validator) {
    if (!validator(value)) {
      warn(
        'Invalid prop: custom validator check failed for prop "' + name + '".',
        vm
      );
    }
  }
}

var simpleCheckRE = /^(String|Number|Boolean|Function|Symbol)$/;

function assertType (value, type) {
  var valid;
  var expectedType = getType(type);
  if (simpleCheckRE.test(expectedType)) {
    var t = typeof value;
    valid = t === expectedType.toLowerCase();
    // for primitive wrapper objects
    if (!valid && t === 'object') {
      valid = value instanceof type;
    }
  } else if (expectedType === 'Object') {
    valid = isPlainObject(value);
  } else if (expectedType === 'Array') {
    valid = Array.isArray(value);
  } else {
    valid = value instanceof type;
  }
  return {
    valid: valid,
    expectedType: expectedType
  }
}

/**
 * Use function string name to check built-in types,
 * because a simple equality check will fail when running
 * across different vms / iframes.
 */
function getType (fn) {
  var match = fn && fn.toString().match(/^\s*function (\w+)/);
  return match ? match[1] : ''
}

function isType (type, fn) {
  if (!Array.isArray(fn)) {
    return getType(fn) === getType(type)
  }
  for (var i = 0, len = fn.length; i < len; i++) {
    if (getType(fn[i]) === getType(type)) {
      return true
    }
  }
  /* istanbul ignore next */
  return false
}

/*  */

function handleError (err, vm, info) {
  if (vm) {
    var cur = vm;
    while ((cur = cur.$parent)) {
      var hooks = cur.$options.errorCaptured;
      if (hooks) {
        for (var i = 0; i < hooks.length; i++) {
          try {
            var capture = hooks[i].call(cur, err, vm, info) === false;
            if (capture) { return }
          } catch (e) {
            globalHandleError(e, cur, 'errorCaptured hook');
          }
        }
      }
    }
  }
  globalHandleError(err, vm, info);
}

function globalHandleError (err, vm, info) {
  if (config.errorHandler) {
    try {
      return config.errorHandler.call(null, err, vm, info)
    } catch (e) {
      logError(e, null, 'config.errorHandler');
    }
  }
  logError(err, vm, info);
}

function logError (err, vm, info) {
  {
    warn(("Error in " + info + ": \"" + (err.toString()) + "\""), vm);
  }
  /* istanbul ignore else */
  if ((inBrowser || inWeex) && typeof console !== 'undefined') {
    console.error(err);
  } else {
    throw err
  }
}

/*  */
/* globals MessageChannel */

var callbacks = [];
var pending = false;

function flushCallbacks () {
  pending = false;
  var copies = callbacks.slice(0);
  callbacks.length = 0;
  for (var i = 0; i < copies.length; i++) {
    copies[i]();
  }
}

// Here we have async deferring wrappers using both micro and macro tasks.
// In < 2.4 we used micro tasks everywhere, but there are some scenarios where
// micro tasks have too high a priority and fires in between supposedly
// sequential events (e.g. #4521, #6690) or even between bubbling of the same
// event (#6566). However, using macro tasks everywhere also has subtle problems
// when state is changed right before repaint (e.g. #6813, out-in transitions).
// Here we use micro task by default, but expose a way to force macro task when
// needed (e.g. in event handlers attached by v-on).
var microTimerFunc;
var macroTimerFunc;
var useMacroTask = false;

// Determine (macro) Task defer implementation.
// Technically setImmediate should be the ideal choice, but it's only available
// in IE. The only polyfill that consistently queues the callback after all DOM
// events triggered in the same loop is by using MessageChannel.
/* istanbul ignore if */
if (typeof setImmediate !== 'undefined' && isNative(setImmediate)) {
  macroTimerFunc = function () {
    setImmediate(flushCallbacks);
  };
} else if (typeof MessageChannel !== 'undefined' && (
  isNative(MessageChannel) ||
  // PhantomJS
  MessageChannel.toString() === '[object MessageChannelConstructor]'
)) {
  var channel = new MessageChannel();
  var port = channel.port2;
  channel.port1.onmessage = flushCallbacks;
  macroTimerFunc = function () {
    port.postMessage(1);
  };
} else {
  /* istanbul ignore next */
  macroTimerFunc = function () {
    setTimeout(flushCallbacks, 0);
  };
}

// Determine MicroTask defer implementation.
/* istanbul ignore next, $flow-disable-line */
if (typeof Promise !== 'undefined' && isNative(Promise)) {
  var p = Promise.resolve();
  microTimerFunc = function () {
    p.then(flushCallbacks);
    // in problematic UIWebViews, Promise.then doesn't completely break, but
    // it can get stuck in a weird state where callbacks are pushed into the
    // microtask queue but the queue isn't being flushed, until the browser
    // needs to do some other work, e.g. handle a timer. Therefore we can
    // "force" the microtask queue to be flushed by adding an empty timer.
    if (isIOS) { setTimeout(noop); }
  };
} else {
  // fallback to macro
  microTimerFunc = macroTimerFunc;
}

/**
 * Wrap a function so that if any code inside triggers state change,
 * the changes are queued using a Task instead of a MicroTask.
 */
function withMacroTask (fn) {
  return fn._withTask || (fn._withTask = function () {
    useMacroTask = true;
    var res = fn.apply(null, arguments);
    useMacroTask = false;
    return res
  })
}

function nextTick (cb, ctx) {
  var _resolve;
  callbacks.push(function () {
    if (cb) {
      try {
        cb.call(ctx);
      } catch (e) {
        handleError(e, ctx, 'nextTick');
      }
    } else if (_resolve) {
      _resolve(ctx);
    }
  });
  if (!pending) {
    pending = true;
    if (useMacroTask) {
      macroTimerFunc();
    } else {
      microTimerFunc();
    }
  }
  // $flow-disable-line
  if (!cb && typeof Promise !== 'undefined') {
    return new Promise(function (resolve) {
      _resolve = resolve;
    })
  }
}

/*  */

var mark;
var measure;

{
  var perf = inBrowser && window.performance;
  /* istanbul ignore if */
  if (
    perf &&
    perf.mark &&
    perf.measure &&
    perf.clearMarks &&
    perf.clearMeasures
  ) {
    mark = function (tag) { return perf.mark(tag); };
    measure = function (name, startTag, endTag) {
      perf.measure(name, startTag, endTag);
      perf.clearMarks(startTag);
      perf.clearMarks(endTag);
      perf.clearMeasures(name);
    };
  }
}

/* not type checking this file because flow doesn't play well with Proxy */

var initProxy;

{
  var allowedGlobals = makeMap(
    'Infinity,undefined,NaN,isFinite,isNaN,' +
    'parseFloat,parseInt,decodeURI,decodeURIComponent,encodeURI,encodeURIComponent,' +
    'Math,Number,Date,Array,Object,Boolean,String,RegExp,Map,Set,JSON,Intl,' +
    'require' // for Webpack/Browserify
  );

  var warnNonPresent = function (target, key) {
    warn(
      "Property or method \"" + key + "\" is not defined on the instance but " +
      'referenced during render. Make sure that this property is reactive, ' +
      'either in the data option, or for class-based components, by ' +
      'initializing the property. ' +
      'See: https://vuejs.org/v2/guide/reactivity.html#Declaring-Reactive-Properties.',
      target
    );
  };

  var hasProxy =
    typeof Proxy !== 'undefined' &&
    Proxy.toString().match(/native code/);

  if (hasProxy) {
    var isBuiltInModifier = makeMap('stop,prevent,self,ctrl,shift,alt,meta,exact');
    config.keyCodes = new Proxy(config.keyCodes, {
      set: function set (target, key, value) {
        if (isBuiltInModifier(key)) {
          warn(("Avoid overwriting built-in modifier in config.keyCodes: ." + key));
          return false
        } else {
          target[key] = value;
          return true
        }
      }
    });
  }

  var hasHandler = {
    has: function has (target, key) {
      var has = key in target;
      var isAllowed = allowedGlobals(key) || key.charAt(0) === '_';
      if (!has && !isAllowed) {
        warnNonPresent(target, key);
      }
      return has || !isAllowed
    }
  };

  var getHandler = {
    get: function get (target, key) {
      if (typeof key === 'string' && !(key in target)) {
        warnNonPresent(target, key);
      }
      return target[key]
    }
  };

  initProxy = function initProxy (vm) {
    if (hasProxy) {
      // determine which proxy handler to use
      var options = vm.$options;
      var handlers = options.render && options.render._withStripped
        ? getHandler
        : hasHandler;
      vm._renderProxy = new Proxy(vm, handlers);
    } else {
      vm._renderProxy = vm;
    }
  };
}

/*  */

var seenObjects = new _Set();

/**
 * Recursively traverse an object to evoke all converted
 * getters, so that every nested property inside the object
 * is collected as a "deep" dependency.
 */
function traverse (val) {
  _traverse(val, seenObjects);
  seenObjects.clear();
}

function _traverse (val, seen) {
  var i, keys;
  var isA = Array.isArray(val);
  if ((!isA && !isObject(val)) || Object.isFrozen(val)) {
    return
  }
  if (val.__ob__) {
    var depId = val.__ob__.dep.id;
    if (seen.has(depId)) {
      return
    }
    seen.add(depId);
  }
  if (isA) {
    i = val.length;
    while (i--) { _traverse(val[i], seen); }
  } else {
    keys = Object.keys(val);
    i = keys.length;
    while (i--) { _traverse(val[keys[i]], seen); }
  }
}

/*  */

var normalizeEvent = cached(function (name) {
  var passive = name.charAt(0) === '&';
  name = passive ? name.slice(1) : name;
  var once$$1 = name.charAt(0) === '~'; // Prefixed last, checked first
  name = once$$1 ? name.slice(1) : name;
  var capture = name.charAt(0) === '!';
  name = capture ? name.slice(1) : name;
  return {
    name: name,
    once: once$$1,
    capture: capture,
    passive: passive
  }
});

function createFnInvoker (fns) {
  function invoker () {
    var arguments$1 = arguments;

    var fns = invoker.fns;
    if (Array.isArray(fns)) {
      var cloned = fns.slice();
      for (var i = 0; i < cloned.length; i++) {
        cloned[i].apply(null, arguments$1);
      }
    } else {
      // return handler return value for single handlers
      return fns.apply(null, arguments)
    }
  }
  invoker.fns = fns;
  return invoker
}

function updateListeners (
  on,
  oldOn,
  add,
  remove$$1,
  vm
) {
  var name, cur, old, event;
  for (name in on) {
    cur = on[name];
    old = oldOn[name];
    event = normalizeEvent(name);
    if (isUndef(cur)) {
      "development" !== 'production' && warn(
        "Invalid handler for event \"" + (event.name) + "\": got " + String(cur),
        vm
      );
    } else if (isUndef(old)) {
      if (isUndef(cur.fns)) {
        cur = on[name] = createFnInvoker(cur);
      }
      add(event.name, cur, event.once, event.capture, event.passive);
    } else if (cur !== old) {
      old.fns = cur;
      on[name] = old;
    }
  }
  for (name in oldOn) {
    if (isUndef(on[name])) {
      event = normalizeEvent(name);
      remove$$1(event.name, oldOn[name], event.capture);
    }
  }
}

/*  */

function mergeVNodeHook (def, hookKey, hook) {
  if (def instanceof VNode) {
    def = def.data.hook || (def.data.hook = {});
  }
  var invoker;
  var oldHook = def[hookKey];

  function wrappedHook () {
    hook.apply(this, arguments);
    // important: remove merged hook to ensure it's called only once
    // and prevent memory leak
    remove(invoker.fns, wrappedHook);
  }

  if (isUndef(oldHook)) {
    // no existing hook
    invoker = createFnInvoker([wrappedHook]);
  } else {
    /* istanbul ignore if */
    if (isDef(oldHook.fns) && isTrue(oldHook.merged)) {
      // already a merged invoker
      invoker = oldHook;
      invoker.fns.push(wrappedHook);
    } else {
      // existing plain hook
      invoker = createFnInvoker([oldHook, wrappedHook]);
    }
  }

  invoker.merged = true;
  def[hookKey] = invoker;
}

/*  */

function extractPropsFromVNodeData (
  data,
  Ctor,
  tag
) {
  // we are only extracting raw values here.
  // validation and default values are handled in the child
  // component itself.
  var propOptions = Ctor.options.props;
  if (isUndef(propOptions)) {
    return
  }
  var res = {};
  var attrs = data.attrs;
  var props = data.props;
  if (isDef(attrs) || isDef(props)) {
    for (var key in propOptions) {
      var altKey = hyphenate(key);
      {
        var keyInLowerCase = key.toLowerCase();
        if (
          key !== keyInLowerCase &&
          attrs && hasOwn(attrs, keyInLowerCase)
        ) {
          tip(
            "Prop \"" + keyInLowerCase + "\" is passed to component " +
            (formatComponentName(tag || Ctor)) + ", but the declared prop name is" +
            " \"" + key + "\". " +
            "Note that HTML attributes are case-insensitive and camelCased " +
            "props need to use their kebab-case equivalents when using in-DOM " +
            "templates. You should probably use \"" + altKey + "\" instead of \"" + key + "\"."
          );
        }
      }
      checkProp(res, props, key, altKey, true) ||
      checkProp(res, attrs, key, altKey, false);
    }
  }
  return res
}

function checkProp (
  res,
  hash,
  key,
  altKey,
  preserve
) {
  if (isDef(hash)) {
    if (hasOwn(hash, key)) {
      res[key] = hash[key];
      if (!preserve) {
        delete hash[key];
      }
      return true
    } else if (hasOwn(hash, altKey)) {
      res[key] = hash[altKey];
      if (!preserve) {
        delete hash[altKey];
      }
      return true
    }
  }
  return false
}

/*  */

// The template compiler attempts to minimize the need for normalization by
// statically analyzing the template at compile time.
//
// For plain HTML markup, normalization can be completely skipped because the
// generated render function is guaranteed to return Array<VNode>. There are
// two cases where extra normalization is needed:

// 1. When the children contains components - because a functional component
// may return an Array instead of a single root. In this case, just a simple
// normalization is needed - if any child is an Array, we flatten the whole
// thing with Array.prototype.concat. It is guaranteed to be only 1-level deep
// because functional components already normalize their own children.
function simpleNormalizeChildren (children) {
  for (var i = 0; i < children.length; i++) {
    if (Array.isArray(children[i])) {
      return Array.prototype.concat.apply([], children)
    }
  }
  return children
}

// 2. When the children contains constructs that always generated nested Arrays,
// e.g. <template>, <slot>, v-for, or when the children is provided by user
// with hand-written render functions / JSX. In such cases a full normalization
// is needed to cater to all possible types of children values.
function normalizeChildren (children) {
  return isPrimitive(children)
    ? [createTextVNode(children)]
    : Array.isArray(children)
      ? normalizeArrayChildren(children)
      : undefined
}

function isTextNode (node) {
  return isDef(node) && isDef(node.text) && isFalse(node.isComment)
}

function normalizeArrayChildren (children, nestedIndex) {
  var res = [];
  var i, c, lastIndex, last;
  for (i = 0; i < children.length; i++) {
    c = children[i];
    if (isUndef(c) || typeof c === 'boolean') { continue }
    lastIndex = res.length - 1;
    last = res[lastIndex];
    //  nested
    if (Array.isArray(c)) {
      if (c.length > 0) {
        c = normalizeArrayChildren(c, ((nestedIndex || '') + "_" + i));
        // merge adjacent text nodes
        if (isTextNode(c[0]) && isTextNode(last)) {
          res[lastIndex] = createTextVNode(last.text + (c[0]).text);
          c.shift();
        }
        res.push.apply(res, c);
      }
    } else if (isPrimitive(c)) {
      if (isTextNode(last)) {
        // merge adjacent text nodes
        // this is necessary for SSR hydration because text nodes are
        // essentially merged when rendered to HTML strings
        res[lastIndex] = createTextVNode(last.text + c);
      } else if (c !== '') {
        // convert primitive to vnode
        res.push(createTextVNode(c));
      }
    } else {
      if (isTextNode(c) && isTextNode(last)) {
        // merge adjacent text nodes
        res[lastIndex] = createTextVNode(last.text + c.text);
      } else {
        // default key for nested array children (likely generated by v-for)
        if (isTrue(children._isVList) &&
          isDef(c.tag) &&
          isUndef(c.key) &&
          isDef(nestedIndex)) {
          c.key = "__vlist" + nestedIndex + "_" + i + "__";
        }
        res.push(c);
      }
    }
  }
  return res
}

/*  */

function ensureCtor (comp, base) {
  if (
    comp.__esModule ||
    (hasSymbol && comp[Symbol.toStringTag] === 'Module')
  ) {
    comp = comp.default;
  }
  return isObject(comp)
    ? base.extend(comp)
    : comp
}

function createAsyncPlaceholder (
  factory,
  data,
  context,
  children,
  tag
) {
  var node = createEmptyVNode();
  node.asyncFactory = factory;
  node.asyncMeta = { data: data, context: context, children: children, tag: tag };
  return node
}

function resolveAsyncComponent (
  factory,
  baseCtor,
  context
) {
  if (isTrue(factory.error) && isDef(factory.errorComp)) {
    return factory.errorComp
  }

  if (isDef(factory.resolved)) {
    return factory.resolved
  }

  if (isTrue(factory.loading) && isDef(factory.loadingComp)) {
    return factory.loadingComp
  }

  if (isDef(factory.contexts)) {
    // already pending
    factory.contexts.push(context);
  } else {
    var contexts = factory.contexts = [context];
    var sync = true;

    var forceRender = function () {
      for (var i = 0, l = contexts.length; i < l; i++) {
        contexts[i].$forceUpdate();
      }
    };

    var resolve = once(function (res) {
      // cache resolved
      factory.resolved = ensureCtor(res, baseCtor);
      // invoke callbacks only if this is not a synchronous resolve
      // (async resolves are shimmed as synchronous during SSR)
      if (!sync) {
        forceRender();
      }
    });

    var reject = once(function (reason) {
      "development" !== 'production' && warn(
        "Failed to resolve async component: " + (String(factory)) +
        (reason ? ("\nReason: " + reason) : '')
      );
      if (isDef(factory.errorComp)) {
        factory.error = true;
        forceRender();
      }
    });

    var res = factory(resolve, reject);

    if (isObject(res)) {
      if (typeof res.then === 'function') {
        // () => Promise
        if (isUndef(factory.resolved)) {
          res.then(resolve, reject);
        }
      } else if (isDef(res.component) && typeof res.component.then === 'function') {
        res.component.then(resolve, reject);

        if (isDef(res.error)) {
          factory.errorComp = ensureCtor(res.error, baseCtor);
        }

        if (isDef(res.loading)) {
          factory.loadingComp = ensureCtor(res.loading, baseCtor);
          if (res.delay === 0) {
            factory.loading = true;
          } else {
            setTimeout(function () {
              if (isUndef(factory.resolved) && isUndef(factory.error)) {
                factory.loading = true;
                forceRender();
              }
            }, res.delay || 200);
          }
        }

        if (isDef(res.timeout)) {
          setTimeout(function () {
            if (isUndef(factory.resolved)) {
              reject(
                "timeout (" + (res.timeout) + "ms)"
              );
            }
          }, res.timeout);
        }
      }
    }

    sync = false;
    // return in case resolved synchronously
    return factory.loading
      ? factory.loadingComp
      : factory.resolved
  }
}

/*  */

function isAsyncPlaceholder (node) {
  return node.isComment && node.asyncFactory
}

/*  */

function getFirstComponentChild (children) {
  if (Array.isArray(children)) {
    for (var i = 0; i < children.length; i++) {
      var c = children[i];
      if (isDef(c) && (isDef(c.componentOptions) || isAsyncPlaceholder(c))) {
        return c
      }
    }
  }
}

/*  */

/*  */

function initEvents (vm) {
  vm._events = Object.create(null);
  vm._hasHookEvent = false;
  // init parent attached events
  var listeners = vm.$options._parentListeners;
  if (listeners) {
    updateComponentListeners(vm, listeners);
  }
}

var target;

function add (event, fn, once) {
  if (once) {
    target.$once(event, fn);
  } else {
    target.$on(event, fn);
  }
}

function remove$1 (event, fn) {
  target.$off(event, fn);
}

function updateComponentListeners (
  vm,
  listeners,
  oldListeners
) {
  target = vm;
  updateListeners(listeners, oldListeners || {}, add, remove$1, vm);
  target = undefined;
}

function eventsMixin (Vue) {
  var hookRE = /^hook:/;
  Vue.prototype.$on = function (event, fn) {
    var this$1 = this;

    var vm = this;
    if (Array.isArray(event)) {
      for (var i = 0, l = event.length; i < l; i++) {
        this$1.$on(event[i], fn);
      }
    } else {
      (vm._events[event] || (vm._events[event] = [])).push(fn);
      // optimize hook:event cost by using a boolean flag marked at registration
      // instead of a hash lookup
      if (hookRE.test(event)) {
        vm._hasHookEvent = true;
      }
    }
    return vm
  };

  Vue.prototype.$once = function (event, fn) {
    var vm = this;
    function on () {
      vm.$off(event, on);
      fn.apply(vm, arguments);
    }
    on.fn = fn;
    vm.$on(event, on);
    return vm
  };

  Vue.prototype.$off = function (event, fn) {
    var this$1 = this;

    var vm = this;
    // all
    if (!arguments.length) {
      vm._events = Object.create(null);
      return vm
    }
    // array of events
    if (Array.isArray(event)) {
      for (var i = 0, l = event.length; i < l; i++) {
        this$1.$off(event[i], fn);
      }
      return vm
    }
    // specific event
    var cbs = vm._events[event];
    if (!cbs) {
      return vm
    }
    if (!fn) {
      vm._events[event] = null;
      return vm
    }
    if (fn) {
      // specific handler
      var cb;
      var i$1 = cbs.length;
      while (i$1--) {
        cb = cbs[i$1];
        if (cb === fn || cb.fn === fn) {
          cbs.splice(i$1, 1);
          break
        }
      }
    }
    return vm
  };

  Vue.prototype.$emit = function (event) {
    var vm = this;
    {
      var lowerCaseEvent = event.toLowerCase();
      if (lowerCaseEvent !== event && vm._events[lowerCaseEvent]) {
        tip(
          "Event \"" + lowerCaseEvent + "\" is emitted in component " +
          (formatComponentName(vm)) + " but the handler is registered for \"" + event + "\". " +
          "Note that HTML attributes are case-insensitive and you cannot use " +
          "v-on to listen to camelCase events when using in-DOM templates. " +
          "You should probably use \"" + (hyphenate(event)) + "\" instead of \"" + event + "\"."
        );
      }
    }
    var cbs = vm._events[event];
    if (cbs) {
      cbs = cbs.length > 1 ? toArray(cbs) : cbs;
      var args = toArray(arguments, 1);
      for (var i = 0, l = cbs.length; i < l; i++) {
        try {
          cbs[i].apply(vm, args);
        } catch (e) {
          handleError(e, vm, ("event handler for \"" + event + "\""));
        }
      }
    }
    return vm
  };
}

/*  */

/**
 * Runtime helper for resolving raw children VNodes into a slot object.
 */
function resolveSlots (
  children,
  context
) {
  var slots = {};
  if (!children) {
    return slots
  }
  for (var i = 0, l = children.length; i < l; i++) {
    var child = children[i];
    var data = child.data;
    // remove slot attribute if the node is resolved as a Vue slot node
    if (data && data.attrs && data.attrs.slot) {
      delete data.attrs.slot;
    }
    // named slots should only be respected if the vnode was rendered in the
    // same context.
    if ((child.context === context || child.fnContext === context) &&
      data && data.slot != null
    ) {
      var name = child.data.slot;
      var slot = (slots[name] || (slots[name] = []));
      if (child.tag === 'template') {
        slot.push.apply(slot, child.children);
      } else {
        slot.push(child);
      }
    } else {
      (slots.default || (slots.default = [])).push(child);
    }
  }
  // ignore slots that contains only whitespace
  for (var name$1 in slots) {
    if (slots[name$1].every(isWhitespace)) {
      delete slots[name$1];
    }
  }
  return slots
}

function isWhitespace (node) {
  return (node.isComment && !node.asyncFactory) || node.text === ' '
}

function resolveScopedSlots (
  fns, // see flow/vnode
  res
) {
  res = res || {};
  for (var i = 0; i < fns.length; i++) {
    if (Array.isArray(fns[i])) {
      resolveScopedSlots(fns[i], res);
    } else {
      res[fns[i].key] = fns[i].fn;
    }
  }
  return res
}

/*  */

var activeInstance = null;
var isUpdatingChildComponent = false;

function initLifecycle (vm) {
  var options = vm.$options;

  // locate first non-abstract parent
  var parent = options.parent;
  if (parent && !options.abstract) {
    while (parent.$options.abstract && parent.$parent) {
      parent = parent.$parent;
    }
    parent.$children.push(vm);
  }

  vm.$parent = parent;
  vm.$root = parent ? parent.$root : vm;

  vm.$children = [];
  vm.$refs = {};

  vm._watcher = null;
  vm._inactive = null;
  vm._directInactive = false;
  vm._isMounted = false;
  vm._isDestroyed = false;
  vm._isBeingDestroyed = false;
}

function lifecycleMixin (Vue) {
  Vue.prototype._update = function (vnode, hydrating) {
    var vm = this;
    if (vm._isMounted) {
      callHook(vm, 'beforeUpdate');
    }
    var prevEl = vm.$el;
    var prevVnode = vm._vnode;
    var prevActiveInstance = activeInstance;
    activeInstance = vm;
    vm._vnode = vnode;
    // Vue.prototype.__patch__ is injected in entry points
    // based on the rendering backend used.
    if (!prevVnode) {
      // initial render
      vm.$el = vm.__patch__(
        vm.$el, vnode, hydrating, false /* removeOnly */,
        vm.$options._parentElm,
        vm.$options._refElm
      );
      // no need for the ref nodes after initial patch
      // this prevents keeping a detached DOM tree in memory (#5851)
      vm.$options._parentElm = vm.$options._refElm = null;
    } else {
      // updates
      vm.$el = vm.__patch__(prevVnode, vnode);
    }
    activeInstance = prevActiveInstance;
    // update __vue__ reference
    if (prevEl) {
      prevEl.__vue__ = null;
    }
    if (vm.$el) {
      vm.$el.__vue__ = vm;
    }
    // if parent is an HOC, update its $el as well
    if (vm.$vnode && vm.$parent && vm.$vnode === vm.$parent._vnode) {
      vm.$parent.$el = vm.$el;
    }
    // updated hook is called by the scheduler to ensure that children are
    // updated in a parent's updated hook.
  };

  Vue.prototype.$forceUpdate = function () {
    var vm = this;
    if (vm._watcher) {
      vm._watcher.update();
    }
  };

  Vue.prototype.$destroy = function () {
    var vm = this;
    if (vm._isBeingDestroyed) {
      return
    }
    callHook(vm, 'beforeDestroy');
    vm._isBeingDestroyed = true;
    // remove self from parent
    var parent = vm.$parent;
    if (parent && !parent._isBeingDestroyed && !vm.$options.abstract) {
      remove(parent.$children, vm);
    }
    // teardown watchers
    if (vm._watcher) {
      vm._watcher.teardown();
    }
    var i = vm._watchers.length;
    while (i--) {
      vm._watchers[i].teardown();
    }
    // remove reference from data ob
    // frozen object may not have observer.
    if (vm._data.__ob__) {
      vm._data.__ob__.vmCount--;
    }
    // call the last hook...
    vm._isDestroyed = true;
    // invoke destroy hooks on current rendered tree
    vm.__patch__(vm._vnode, null);
    // fire destroyed hook
    callHook(vm, 'destroyed');
    // turn off all instance listeners.
    vm.$off();
    // remove __vue__ reference
    if (vm.$el) {
      vm.$el.__vue__ = null;
    }
    // release circular reference (#6759)
    if (vm.$vnode) {
      vm.$vnode.parent = null;
    }
  };
}

function mountComponent (
  vm,
  el,
  hydrating
) {
  vm.$el = el;
  if (!vm.$options.render) {
    vm.$options.render = createEmptyVNode;
    {
      /* istanbul ignore if */
      if ((vm.$options.template && vm.$options.template.charAt(0) !== '#') ||
        vm.$options.el || el) {
        warn(
          'You are using the runtime-only build of Vue where the template ' +
          'compiler is not available. Either pre-compile the templates into ' +
          'render functions, or use the compiler-included build.',
          vm
        );
      } else {
        warn(
          'Failed to mount component: template or render function not defined.',
          vm
        );
      }
    }
  }
  callHook(vm, 'beforeMount');

  var updateComponent;
  /* istanbul ignore if */
  if ("development" !== 'production' && config.performance && mark) {
    updateComponent = function () {
      var name = vm._name;
      var id = vm._uid;
      var startTag = "vue-perf-start:" + id;
      var endTag = "vue-perf-end:" + id;

      mark(startTag);
      var vnode = vm._render();
      mark(endTag);
      measure(("vue " + name + " render"), startTag, endTag);

      mark(startTag);
      vm._update(vnode, hydrating);
      mark(endTag);
      measure(("vue " + name + " patch"), startTag, endTag);
    };
  } else {
    updateComponent = function () {
      vm._update(vm._render(), hydrating);
    };
  }

  // we set this to vm._watcher inside the watcher's constructor
  // since the watcher's initial patch may call $forceUpdate (e.g. inside child
  // component's mounted hook), which relies on vm._watcher being already defined
  new Watcher(vm, updateComponent, noop, null, true /* isRenderWatcher */);
  hydrating = false;

  // manually mounted instance, call mounted on self
  // mounted is called for render-created child components in its inserted hook
  if (vm.$vnode == null) {
    vm._isMounted = true;
    callHook(vm, 'mounted');
  }
  return vm
}

function updateChildComponent (
  vm,
  propsData,
  listeners,
  parentVnode,
  renderChildren
) {
  {
    isUpdatingChildComponent = true;
  }

  // determine whether component has slot children
  // we need to do this before overwriting $options._renderChildren
  var hasChildren = !!(
    renderChildren ||               // has new static slots
    vm.$options._renderChildren ||  // has old static slots
    parentVnode.data.scopedSlots || // has new scoped slots
    vm.$scopedSlots !== emptyObject // has old scoped slots
  );

  vm.$options._parentVnode = parentVnode;
  vm.$vnode = parentVnode; // update vm's placeholder node without re-render

  if (vm._vnode) { // update child tree's parent
    vm._vnode.parent = parentVnode;
  }
  vm.$options._renderChildren = renderChildren;

  // update $attrs and $listeners hash
  // these are also reactive so they may trigger child update if the child
  // used them during render
  vm.$attrs = (parentVnode.data && parentVnode.data.attrs) || emptyObject;
  vm.$listeners = listeners || emptyObject;

  // update props
  if (propsData && vm.$options.props) {
    observerState.shouldConvert = false;
    var props = vm._props;
    var propKeys = vm.$options._propKeys || [];
    for (var i = 0; i < propKeys.length; i++) {
      var key = propKeys[i];
      props[key] = validateProp(key, vm.$options.props, propsData, vm);
    }
    observerState.shouldConvert = true;
    // keep a copy of raw propsData
    vm.$options.propsData = propsData;
  }

  // update listeners
  if (listeners) {
    var oldListeners = vm.$options._parentListeners;
    vm.$options._parentListeners = listeners;
    updateComponentListeners(vm, listeners, oldListeners);
  }
  // resolve slots + force update if has children
  if (hasChildren) {
    vm.$slots = resolveSlots(renderChildren, parentVnode.context);
    vm.$forceUpdate();
  }

  {
    isUpdatingChildComponent = false;
  }
}

function isInInactiveTree (vm) {
  while (vm && (vm = vm.$parent)) {
    if (vm._inactive) { return true }
  }
  return false
}

function activateChildComponent (vm, direct) {
  if (direct) {
    vm._directInactive = false;
    if (isInInactiveTree(vm)) {
      return
    }
  } else if (vm._directInactive) {
    return
  }
  if (vm._inactive || vm._inactive === null) {
    vm._inactive = false;
    for (var i = 0; i < vm.$children.length; i++) {
      activateChildComponent(vm.$children[i]);
    }
    callHook(vm, 'activated');
  }
}

function deactivateChildComponent (vm, direct) {
  if (direct) {
    vm._directInactive = true;
    if (isInInactiveTree(vm)) {
      return
    }
  }
  if (!vm._inactive) {
    vm._inactive = true;
    for (var i = 0; i < vm.$children.length; i++) {
      deactivateChildComponent(vm.$children[i]);
    }
    callHook(vm, 'deactivated');
  }
}

function callHook (vm, hook) {
  var handlers = vm.$options[hook];
  if (handlers) {
    for (var i = 0, j = handlers.length; i < j; i++) {
      try {
        handlers[i].call(vm);
      } catch (e) {
        handleError(e, vm, (hook + " hook"));
      }
    }
  }
  if (vm._hasHookEvent) {
    vm.$emit('hook:' + hook);
  }
}

/*  */


var MAX_UPDATE_COUNT = 100;

var queue = [];
var activatedChildren = [];
var has = {};
var circular = {};
var waiting = false;
var flushing = false;
var index = 0;

/**
 * Reset the scheduler's state.
 */
function resetSchedulerState () {
  index = queue.length = activatedChildren.length = 0;
  has = {};
  {
    circular = {};
  }
  waiting = flushing = false;
}

/**
 * Flush both queues and run the watchers.
 */
function flushSchedulerQueue () {
  flushing = true;
  var watcher, id;

  // Sort queue before flush.
  // This ensures that:
  // 1. Components are updated from parent to child. (because parent is always
  //    created before the child)
  // 2. A component's user watchers are run before its render watcher (because
  //    user watchers are created before the render watcher)
  // 3. If a component is destroyed during a parent component's watcher run,
  //    its watchers can be skipped.
  queue.sort(function (a, b) { return a.id - b.id; });

  // do not cache length because more watchers might be pushed
  // as we run existing watchers
  for (index = 0; index < queue.length; index++) {
    watcher = queue[index];
    id = watcher.id;
    has[id] = null;
    watcher.run();
    // in dev build, check and stop circular updates.
    if ("development" !== 'production' && has[id] != null) {
      circular[id] = (circular[id] || 0) + 1;
      if (circular[id] > MAX_UPDATE_COUNT) {
        warn(
          'You may have an infinite update loop ' + (
            watcher.user
              ? ("in watcher with expression \"" + (watcher.expression) + "\"")
              : "in a component render function."
          ),
          watcher.vm
        );
        break
      }
    }
  }

  // keep copies of post queues before resetting state
  var activatedQueue = activatedChildren.slice();
  var updatedQueue = queue.slice();

  resetSchedulerState();

  // call component updated and activated hooks
  callActivatedHooks(activatedQueue);
  callUpdatedHooks(updatedQueue);

  // devtool hook
  /* istanbul ignore if */
  if (devtools && config.devtools) {
    devtools.emit('flush');
  }
}

function callUpdatedHooks (queue) {
  var i = queue.length;
  while (i--) {
    var watcher = queue[i];
    var vm = watcher.vm;
    if (vm._watcher === watcher && vm._isMounted) {
      callHook(vm, 'updated');
    }
  }
}

/**
 * Queue a kept-alive component that was activated during patch.
 * The queue will be processed after the entire tree has been patched.
 */
function queueActivatedComponent (vm) {
  // setting _inactive to false here so that a render function can
  // rely on checking whether it's in an inactive tree (e.g. router-view)
  vm._inactive = false;
  activatedChildren.push(vm);
}

function callActivatedHooks (queue) {
  for (var i = 0; i < queue.length; i++) {
    queue[i]._inactive = true;
    activateChildComponent(queue[i], true /* true */);
  }
}

/**
 * Push a watcher into the watcher queue.
 * Jobs with duplicate IDs will be skipped unless it's
 * pushed when the queue is being flushed.
 */
function queueWatcher (watcher) {
  var id = watcher.id;
  if (has[id] == null) {
    has[id] = true;
    if (!flushing) {
      queue.push(watcher);
    } else {
      // if already flushing, splice the watcher based on its id
      // if already past its id, it will be run next immediately.
      var i = queue.length - 1;
      while (i > index && queue[i].id > watcher.id) {
        i--;
      }
      queue.splice(i + 1, 0, watcher);
    }
    // queue the flush
    if (!waiting) {
      waiting = true;
      nextTick(flushSchedulerQueue);
    }
  }
}

/*  */

var uid$2 = 0;

/**
 * A watcher parses an expression, collects dependencies,
 * and fires callback when the expression value changes.
 * This is used for both the $watch() api and directives.
 */
var Watcher = function Watcher (
  vm,
  expOrFn,
  cb,
  options,
  isRenderWatcher
) {
  this.vm = vm;
  if (isRenderWatcher) {
    vm._watcher = this;
  }
  vm._watchers.push(this);
  // options
  if (options) {
    this.deep = !!options.deep;
    this.user = !!options.user;
    this.lazy = !!options.lazy;
    this.sync = !!options.sync;
  } else {
    this.deep = this.user = this.lazy = this.sync = false;
  }
  this.cb = cb;
  this.id = ++uid$2; // uid for batching
  this.active = true;
  this.dirty = this.lazy; // for lazy watchers
  this.deps = [];
  this.newDeps = [];
  this.depIds = new _Set();
  this.newDepIds = new _Set();
  this.expression = expOrFn.toString();
  // parse expression for getter
  if (typeof expOrFn === 'function') {
    this.getter = expOrFn;
  } else {
    this.getter = parsePath(expOrFn);
    if (!this.getter) {
      this.getter = function () {};
      "development" !== 'production' && warn(
        "Failed watching path: \"" + expOrFn + "\" " +
        'Watcher only accepts simple dot-delimited paths. ' +
        'For full control, use a function instead.',
        vm
      );
    }
  }
  this.value = this.lazy
    ? undefined
    : this.get();
};

/**
 * Evaluate the getter, and re-collect dependencies.
 */
Watcher.prototype.get = function get () {
  pushTarget(this);
  var value;
  var vm = this.vm;
  try {
    value = this.getter.call(vm, vm);
  } catch (e) {
    if (this.user) {
      handleError(e, vm, ("getter for watcher \"" + (this.expression) + "\""));
    } else {
      throw e
    }
  } finally {
    // "touch" every property so they are all tracked as
    // dependencies for deep watching
    if (this.deep) {
      traverse(value);
    }
    popTarget();
    this.cleanupDeps();
  }
  return value
};

/**
 * Add a dependency to this directive.
 */
Watcher.prototype.addDep = function addDep (dep) {
  var id = dep.id;
  if (!this.newDepIds.has(id)) {
    this.newDepIds.add(id);
    this.newDeps.push(dep);
    if (!this.depIds.has(id)) {
      dep.addSub(this);
    }
  }
};

/**
 * Clean up for dependency collection.
 */
Watcher.prototype.cleanupDeps = function cleanupDeps () {
    var this$1 = this;

  var i = this.deps.length;
  while (i--) {
    var dep = this$1.deps[i];
    if (!this$1.newDepIds.has(dep.id)) {
      dep.removeSub(this$1);
    }
  }
  var tmp = this.depIds;
  this.depIds = this.newDepIds;
  this.newDepIds = tmp;
  this.newDepIds.clear();
  tmp = this.deps;
  this.deps = this.newDeps;
  this.newDeps = tmp;
  this.newDeps.length = 0;
};

/**
 * Subscriber interface.
 * Will be called when a dependency changes.
 */
Watcher.prototype.update = function update () {
  /* istanbul ignore else */
  if (this.lazy) {
    this.dirty = true;
  } else if (this.sync) {
    this.run();
  } else {
    queueWatcher(this);
  }
};

/**
 * Scheduler job interface.
 * Will be called by the scheduler.
 */
Watcher.prototype.run = function run () {
  if (this.active) {
    var value = this.get();
    if (
      value !== this.value ||
      // Deep watchers and watchers on Object/Arrays should fire even
      // when the value is the same, because the value may
      // have mutated.
      isObject(value) ||
      this.deep
    ) {
      // set new value
      var oldValue = this.value;
      this.value = value;
      if (this.user) {
        try {
          this.cb.call(this.vm, value, oldValue);
        } catch (e) {
          handleError(e, this.vm, ("callback for watcher \"" + (this.expression) + "\""));
        }
      } else {
        this.cb.call(this.vm, value, oldValue);
      }
    }
  }
};

/**
 * Evaluate the value of the watcher.
 * This only gets called for lazy watchers.
 */
Watcher.prototype.evaluate = function evaluate () {
  this.value = this.get();
  this.dirty = false;
};

/**
 * Depend on all deps collected by this watcher.
 */
Watcher.prototype.depend = function depend () {
    var this$1 = this;

  var i = this.deps.length;
  while (i--) {
    this$1.deps[i].depend();
  }
};

/**
 * Remove self from all dependencies' subscriber list.
 */
Watcher.prototype.teardown = function teardown () {
    var this$1 = this;

  if (this.active) {
    // remove self from vm's watcher list
    // this is a somewhat expensive operation so we skip it
    // if the vm is being destroyed.
    if (!this.vm._isBeingDestroyed) {
      remove(this.vm._watchers, this);
    }
    var i = this.deps.length;
    while (i--) {
      this$1.deps[i].removeSub(this$1);
    }
    this.active = false;
  }
};

/*  */

var sharedPropertyDefinition = {
  enumerable: true,
  configurable: true,
  get: noop,
  set: noop
};

function proxy (target, sourceKey, key) {
  sharedPropertyDefinition.get = function proxyGetter () {
    return this[sourceKey][key]
  };
  sharedPropertyDefinition.set = function proxySetter (val) {
    this[sourceKey][key] = val;
  };
  Object.defineProperty(target, key, sharedPropertyDefinition);
}

function initState (vm) {
  vm._watchers = [];
  var opts = vm.$options;
  if (opts.props) { initProps(vm, opts.props); }
  if (opts.methods) { initMethods(vm, opts.methods); }
  if (opts.data) {
    initData(vm);
  } else {
    observe(vm._data = {}, true /* asRootData */);
  }
  if (opts.computed) { initComputed(vm, opts.computed); }
  if (opts.watch && opts.watch !== nativeWatch) {
    initWatch(vm, opts.watch);
  }
}

function initProps (vm, propsOptions) {
  var propsData = vm.$options.propsData || {};
  var props = vm._props = {};
  // cache prop keys so that future props updates can iterate using Array
  // instead of dynamic object key enumeration.
  var keys = vm.$options._propKeys = [];
  var isRoot = !vm.$parent;
  // root instance props should be converted
  observerState.shouldConvert = isRoot;
  var loop = function ( key ) {
    keys.push(key);
    var value = validateProp(key, propsOptions, propsData, vm);
    /* istanbul ignore else */
    {
      var hyphenatedKey = hyphenate(key);
      if (isReservedAttribute(hyphenatedKey) ||
          config.isReservedAttr(hyphenatedKey)) {
        warn(
          ("\"" + hyphenatedKey + "\" is a reserved attribute and cannot be used as component prop."),
          vm
        );
      }
      defineReactive(props, key, value, function () {
        if (vm.$parent && !isUpdatingChildComponent) {
          warn(
            "Avoid mutating a prop directly since the value will be " +
            "overwritten whenever the parent component re-renders. " +
            "Instead, use a data or computed property based on the prop's " +
            "value. Prop being mutated: \"" + key + "\"",
            vm
          );
        }
      });
    }
    // static props are already proxied on the component's prototype
    // during Vue.extend(). We only need to proxy props defined at
    // instantiation here.
    if (!(key in vm)) {
      proxy(vm, "_props", key);
    }
  };

  for (var key in propsOptions) loop( key );
  observerState.shouldConvert = true;
}

function initData (vm) {
  var data = vm.$options.data;
  data = vm._data = typeof data === 'function'
    ? getData(data, vm)
    : data || {};
  if (!isPlainObject(data)) {
    data = {};
    "development" !== 'production' && warn(
      'data functions should return an object:\n' +
      'https://vuejs.org/v2/guide/components.html#data-Must-Be-a-Function',
      vm
    );
  }
  // proxy data on instance
  var keys = Object.keys(data);
  var props = vm.$options.props;
  var methods = vm.$options.methods;
  var i = keys.length;
  while (i--) {
    var key = keys[i];
    {
      if (methods && hasOwn(methods, key)) {
        warn(
          ("Method \"" + key + "\" has already been defined as a data property."),
          vm
        );
      }
    }
    if (props && hasOwn(props, key)) {
      "development" !== 'production' && warn(
        "The data property \"" + key + "\" is already declared as a prop. " +
        "Use prop default value instead.",
        vm
      );
    } else if (!isReserved(key)) {
      proxy(vm, "_data", key);
    }
  }
  // observe data
  observe(data, true /* asRootData */);
}

function getData (data, vm) {
  try {
    return data.call(vm, vm)
  } catch (e) {
    handleError(e, vm, "data()");
    return {}
  }
}

var computedWatcherOptions = { lazy: true };

function initComputed (vm, computed) {
  var watchers = vm._computedWatchers = Object.create(null);
  // computed properties are just getters during SSR
  var isSSR = isServerRendering();

  for (var key in computed) {
    var userDef = computed[key];
    var getter = typeof userDef === 'function' ? userDef : userDef.get;
    if ("development" !== 'production' && getter == null) {
      warn(
        ("Getter is missing for computed property \"" + key + "\"."),
        vm
      );
    }

    if (!isSSR) {
      // create internal watcher for the computed property.
      watchers[key] = new Watcher(
        vm,
        getter || noop,
        noop,
        computedWatcherOptions
      );
    }

    // component-defined computed properties are already defined on the
    // component prototype. We only need to define computed properties defined
    // at instantiation here.
    if (!(key in vm)) {
      defineComputed(vm, key, userDef);
    } else {
      if (key in vm.$data) {
        warn(("The computed property \"" + key + "\" is already defined in data."), vm);
      } else if (vm.$options.props && key in vm.$options.props) {
        warn(("The computed property \"" + key + "\" is already defined as a prop."), vm);
      }
    }
  }
}

function defineComputed (
  target,
  key,
  userDef
) {
  var shouldCache = !isServerRendering();
  if (typeof userDef === 'function') {
    sharedPropertyDefinition.get = shouldCache
      ? createComputedGetter(key)
      : userDef;
    sharedPropertyDefinition.set = noop;
  } else {
    sharedPropertyDefinition.get = userDef.get
      ? shouldCache && userDef.cache !== false
        ? createComputedGetter(key)
        : userDef.get
      : noop;
    sharedPropertyDefinition.set = userDef.set
      ? userDef.set
      : noop;
  }
  if ("development" !== 'production' &&
      sharedPropertyDefinition.set === noop) {
    sharedPropertyDefinition.set = function () {
      warn(
        ("Computed property \"" + key + "\" was assigned to but it has no setter."),
        this
      );
    };
  }
  Object.defineProperty(target, key, sharedPropertyDefinition);
}

function createComputedGetter (key) {
  return function computedGetter () {
    var watcher = this._computedWatchers && this._computedWatchers[key];
    if (watcher) {
      if (watcher.dirty) {
        watcher.evaluate();
      }
      if (Dep.target) {
        watcher.depend();
      }
      return watcher.value
    }
  }
}

function initMethods (vm, methods) {
  var props = vm.$options.props;
  for (var key in methods) {
    {
      if (methods[key] == null) {
        warn(
          "Method \"" + key + "\" has an undefined value in the component definition. " +
          "Did you reference the function correctly?",
          vm
        );
      }
      if (props && hasOwn(props, key)) {
        warn(
          ("Method \"" + key + "\" has already been defined as a prop."),
          vm
        );
      }
      if ((key in vm) && isReserved(key)) {
        warn(
          "Method \"" + key + "\" conflicts with an existing Vue instance method. " +
          "Avoid defining component methods that start with _ or $."
        );
      }
    }
    vm[key] = methods[key] == null ? noop : bind(methods[key], vm);
  }
}

function initWatch (vm, watch) {
  for (var key in watch) {
    var handler = watch[key];
    if (Array.isArray(handler)) {
      for (var i = 0; i < handler.length; i++) {
        createWatcher(vm, key, handler[i]);
      }
    } else {
      createWatcher(vm, key, handler);
    }
  }
}

function createWatcher (
  vm,
  keyOrFn,
  handler,
  options
) {
  if (isPlainObject(handler)) {
    options = handler;
    handler = handler.handler;
  }
  if (typeof handler === 'string') {
    handler = vm[handler];
  }
  return vm.$watch(keyOrFn, handler, options)
}

function stateMixin (Vue) {
  // flow somehow has problems with directly declared definition object
  // when using Object.defineProperty, so we have to procedurally build up
  // the object here.
  var dataDef = {};
  dataDef.get = function () { return this._data };
  var propsDef = {};
  propsDef.get = function () { return this._props };
  {
    dataDef.set = function (newData) {
      warn(
        'Avoid replacing instance root $data. ' +
        'Use nested data properties instead.',
        this
      );
    };
    propsDef.set = function () {
      warn("$props is readonly.", this);
    };
  }
  Object.defineProperty(Vue.prototype, '$data', dataDef);
  Object.defineProperty(Vue.prototype, '$props', propsDef);

  Vue.prototype.$set = set;
  Vue.prototype.$delete = del;

  Vue.prototype.$watch = function (
    expOrFn,
    cb,
    options
  ) {
    var vm = this;
    if (isPlainObject(cb)) {
      return createWatcher(vm, expOrFn, cb, options)
    }
    options = options || {};
    options.user = true;
    var watcher = new Watcher(vm, expOrFn, cb, options);
    if (options.immediate) {
      cb.call(vm, watcher.value);
    }
    return function unwatchFn () {
      watcher.teardown();
    }
  };
}

/*  */

function initProvide (vm) {
  var provide = vm.$options.provide;
  if (provide) {
    vm._provided = typeof provide === 'function'
      ? provide.call(vm)
      : provide;
  }
}

function initInjections (vm) {
  var result = resolveInject(vm.$options.inject, vm);
  if (result) {
    observerState.shouldConvert = false;
    Object.keys(result).forEach(function (key) {
      /* istanbul ignore else */
      {
        defineReactive(vm, key, result[key], function () {
          warn(
            "Avoid mutating an injected value directly since the changes will be " +
            "overwritten whenever the provided component re-renders. " +
            "injection being mutated: \"" + key + "\"",
            vm
          );
        });
      }
    });
    observerState.shouldConvert = true;
  }
}

function resolveInject (inject, vm) {
  if (inject) {
    // inject is :any because flow is not smart enough to figure out cached
    var result = Object.create(null);
    var keys = hasSymbol
        ? Reflect.ownKeys(inject).filter(function (key) {
          /* istanbul ignore next */
          return Object.getOwnPropertyDescriptor(inject, key).enumerable
        })
        : Object.keys(inject);

    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      var provideKey = inject[key].from;
      var source = vm;
      while (source) {
        if (source._provided && provideKey in source._provided) {
          result[key] = source._provided[provideKey];
          break
        }
        source = source.$parent;
      }
      if (!source) {
        if ('default' in inject[key]) {
          var provideDefault = inject[key].default;
          result[key] = typeof provideDefault === 'function'
            ? provideDefault.call(vm)
            : provideDefault;
        } else {
          warn(("Injection \"" + key + "\" not found"), vm);
        }
      }
    }
    return result
  }
}

/*  */

/**
 * Runtime helper for rendering v-for lists.
 */
function renderList (
  val,
  render
) {
  var ret, i, l, keys, key;
  if (Array.isArray(val) || typeof val === 'string') {
    ret = new Array(val.length);
    for (i = 0, l = val.length; i < l; i++) {
      ret[i] = render(val[i], i);
    }
  } else if (typeof val === 'number') {
    ret = new Array(val);
    for (i = 0; i < val; i++) {
      ret[i] = render(i + 1, i);
    }
  } else if (isObject(val)) {
    keys = Object.keys(val);
    ret = new Array(keys.length);
    for (i = 0, l = keys.length; i < l; i++) {
      key = keys[i];
      ret[i] = render(val[key], key, i);
    }
  }
  if (isDef(ret)) {
    (ret)._isVList = true;
  }
  return ret
}

/*  */

/**
 * Runtime helper for rendering <slot>
 */
function renderSlot (
  name,
  fallback,
  props,
  bindObject
) {
  var scopedSlotFn = this.$scopedSlots[name];
  var nodes;
  if (scopedSlotFn) { // scoped slot
    props = props || {};
    if (bindObject) {
      if ("development" !== 'production' && !isObject(bindObject)) {
        warn(
          'slot v-bind without argument expects an Object',
          this
        );
      }
      props = extend(extend({}, bindObject), props);
    }
    nodes = scopedSlotFn(props) || fallback;
  } else {
    var slotNodes = this.$slots[name];
    // warn duplicate slot usage
    if (slotNodes) {
      if ("development" !== 'production' && slotNodes._rendered) {
        warn(
          "Duplicate presence of slot \"" + name + "\" found in the same render tree " +
          "- this will likely cause render errors.",
          this
        );
      }
      slotNodes._rendered = true;
    }
    nodes = slotNodes || fallback;
  }

  var target = props && props.slot;
  if (target) {
    return this.$createElement('template', { slot: target }, nodes)
  } else {
    return nodes
  }
}

/*  */

/**
 * Runtime helper for resolving filters
 */
function resolveFilter (id) {
  return resolveAsset(this.$options, 'filters', id, true) || identity
}

/*  */

/**
 * Runtime helper for checking keyCodes from config.
 * exposed as Vue.prototype._k
 * passing in eventKeyName as last argument separately for backwards compat
 */
function checkKeyCodes (
  eventKeyCode,
  key,
  builtInAlias,
  eventKeyName
) {
  var keyCodes = config.keyCodes[key] || builtInAlias;
  if (keyCodes) {
    if (Array.isArray(keyCodes)) {
      return keyCodes.indexOf(eventKeyCode) === -1
    } else {
      return keyCodes !== eventKeyCode
    }
  } else if (eventKeyName) {
    return hyphenate(eventKeyName) !== key
  }
}

/*  */

/**
 * Runtime helper for merging v-bind="object" into a VNode's data.
 */
function bindObjectProps (
  data,
  tag,
  value,
  asProp,
  isSync
) {
  if (value) {
    if (!isObject(value)) {
      "development" !== 'production' && warn(
        'v-bind without argument expects an Object or Array value',
        this
      );
    } else {
      if (Array.isArray(value)) {
        value = toObject(value);
      }
      var hash;
      var loop = function ( key ) {
        if (
          key === 'class' ||
          key === 'style' ||
          isReservedAttribute(key)
        ) {
          hash = data;
        } else {
          var type = data.attrs && data.attrs.type;
          hash = asProp || config.mustUseProp(tag, type, key)
            ? data.domProps || (data.domProps = {})
            : data.attrs || (data.attrs = {});
        }
        if (!(key in hash)) {
          hash[key] = value[key];

          if (isSync) {
            var on = data.on || (data.on = {});
            on[("update:" + key)] = function ($event) {
              value[key] = $event;
            };
          }
        }
      };

      for (var key in value) loop( key );
    }
  }
  return data
}

/*  */

/**
 * Runtime helper for rendering static trees.
 */
function renderStatic (
  index,
  isInFor,
  isOnce
) {
  // render fns generated by compiler < 2.5.4 does not provide v-once
  // information to runtime so be conservative
  var isOldVersion = arguments.length < 3;
  // if a static tree is generated by v-once, it is cached on the instance;
  // otherwise it is purely static and can be cached on the shared options
  // across all instances.
  var renderFns = this.$options.staticRenderFns;
  var cached = isOldVersion || isOnce
    ? (this._staticTrees || (this._staticTrees = []))
    : (renderFns.cached || (renderFns.cached = []));
  var tree = cached[index];
  // if has already-rendered static tree and not inside v-for,
  // we can reuse the same tree by doing a shallow clone.
  if (tree && !isInFor) {
    return Array.isArray(tree)
      ? cloneVNodes(tree)
      : cloneVNode(tree)
  }
  // otherwise, render a fresh tree.
  tree = cached[index] = renderFns[index].call(this._renderProxy, null, this);
  markStatic(tree, ("__static__" + index), false);
  return tree
}

/**
 * Runtime helper for v-once.
 * Effectively it means marking the node as static with a unique key.
 */
function markOnce (
  tree,
  index,
  key
) {
  markStatic(tree, ("__once__" + index + (key ? ("_" + key) : "")), true);
  return tree
}

function markStatic (
  tree,
  key,
  isOnce
) {
  if (Array.isArray(tree)) {
    for (var i = 0; i < tree.length; i++) {
      if (tree[i] && typeof tree[i] !== 'string') {
        markStaticNode(tree[i], (key + "_" + i), isOnce);
      }
    }
  } else {
    markStaticNode(tree, key, isOnce);
  }
}

function markStaticNode (node, key, isOnce) {
  node.isStatic = true;
  node.key = key;
  node.isOnce = isOnce;
}

/*  */

function bindObjectListeners (data, value) {
  if (value) {
    if (!isPlainObject(value)) {
      "development" !== 'production' && warn(
        'v-on without argument expects an Object value',
        this
      );
    } else {
      var on = data.on = data.on ? extend({}, data.on) : {};
      for (var key in value) {
        var existing = on[key];
        var ours = value[key];
        on[key] = existing ? [].concat(existing, ours) : ours;
      }
    }
  }
  return data
}

/*  */

function installRenderHelpers (target) {
  target._o = markOnce;
  target._n = toNumber;
  target._s = toString;
  target._l = renderList;
  target._t = renderSlot;
  target._q = looseEqual;
  target._i = looseIndexOf;
  target._m = renderStatic;
  target._f = resolveFilter;
  target._k = checkKeyCodes;
  target._b = bindObjectProps;
  target._v = createTextVNode;
  target._e = createEmptyVNode;
  target._u = resolveScopedSlots;
  target._g = bindObjectListeners;
}

/*  */

function FunctionalRenderContext (
  data,
  props,
  children,
  parent,
  Ctor
) {
  var options = Ctor.options;
  this.data = data;
  this.props = props;
  this.children = children;
  this.parent = parent;
  this.listeners = data.on || emptyObject;
  this.injections = resolveInject(options.inject, parent);
  this.slots = function () { return resolveSlots(children, parent); };

  // ensure the createElement function in functional components
  // gets a unique context - this is necessary for correct named slot check
  var contextVm = Object.create(parent);
  var isCompiled = isTrue(options._compiled);
  var needNormalization = !isCompiled;

  // support for compiled functional template
  if (isCompiled) {
    // exposing $options for renderStatic()
    this.$options = options;
    // pre-resolve slots for renderSlot()
    this.$slots = this.slots();
    this.$scopedSlots = data.scopedSlots || emptyObject;
  }

  if (options._scopeId) {
    this._c = function (a, b, c, d) {
      var vnode = createElement(contextVm, a, b, c, d, needNormalization);
      if (vnode) {
        vnode.fnScopeId = options._scopeId;
        vnode.fnContext = parent;
      }
      return vnode
    };
  } else {
    this._c = function (a, b, c, d) { return createElement(contextVm, a, b, c, d, needNormalization); };
  }
}

installRenderHelpers(FunctionalRenderContext.prototype);

function createFunctionalComponent (
  Ctor,
  propsData,
  data,
  contextVm,
  children
) {
  var options = Ctor.options;
  var props = {};
  var propOptions = options.props;
  if (isDef(propOptions)) {
    for (var key in propOptions) {
      props[key] = validateProp(key, propOptions, propsData || emptyObject);
    }
  } else {
    if (isDef(data.attrs)) { mergeProps(props, data.attrs); }
    if (isDef(data.props)) { mergeProps(props, data.props); }
  }

  var renderContext = new FunctionalRenderContext(
    data,
    props,
    children,
    contextVm,
    Ctor
  );

  var vnode = options.render.call(null, renderContext._c, renderContext);

  if (vnode instanceof VNode) {
    vnode.fnContext = contextVm;
    vnode.fnOptions = options;
    if (data.slot) {
      (vnode.data || (vnode.data = {})).slot = data.slot;
    }
  }

  return vnode
}

function mergeProps (to, from) {
  for (var key in from) {
    to[camelize(key)] = from[key];
  }
}

/*  */

// hooks to be invoked on component VNodes during patch
var componentVNodeHooks = {
  init: function init (
    vnode,
    hydrating,
    parentElm,
    refElm
  ) {
    if (!vnode.componentInstance || vnode.componentInstance._isDestroyed) {
      var child = vnode.componentInstance = createComponentInstanceForVnode(
        vnode,
        activeInstance,
        parentElm,
        refElm
      );
      child.$mount(hydrating ? vnode.elm : undefined, hydrating);
    } else if (vnode.data.keepAlive) {
      // kept-alive components, treat as a patch
      var mountedNode = vnode; // work around flow
      componentVNodeHooks.prepatch(mountedNode, mountedNode);
    }
  },

  prepatch: function prepatch (oldVnode, vnode) {
    var options = vnode.componentOptions;
    var child = vnode.componentInstance = oldVnode.componentInstance;
    updateChildComponent(
      child,
      options.propsData, // updated props
      options.listeners, // updated listeners
      vnode, // new parent vnode
      options.children // new children
    );
  },

  insert: function insert (vnode) {
    var context = vnode.context;
    var componentInstance = vnode.componentInstance;
    if (!componentInstance._isMounted) {
      componentInstance._isMounted = true;
      callHook(componentInstance, 'mounted');
    }
    if (vnode.data.keepAlive) {
      if (context._isMounted) {
        // vue-router#1212
        // During updates, a kept-alive component's child components may
        // change, so directly walking the tree here may call activated hooks
        // on incorrect children. Instead we push them into a queue which will
        // be processed after the whole patch process ended.
        queueActivatedComponent(componentInstance);
      } else {
        activateChildComponent(componentInstance, true /* direct */);
      }
    }
  },

  destroy: function destroy (vnode) {
    var componentInstance = vnode.componentInstance;
    if (!componentInstance._isDestroyed) {
      if (!vnode.data.keepAlive) {
        componentInstance.$destroy();
      } else {
        deactivateChildComponent(componentInstance, true /* direct */);
      }
    }
  }
};

var hooksToMerge = Object.keys(componentVNodeHooks);

function createComponent (
  Ctor,
  data,
  context,
  children,
  tag
) {
  if (isUndef(Ctor)) {
    return
  }

  var baseCtor = context.$options._base;

  // plain options object: turn it into a constructor
  if (isObject(Ctor)) {
    Ctor = baseCtor.extend(Ctor);
  }

  // if at this stage it's not a constructor or an async component factory,
  // reject.
  if (typeof Ctor !== 'function') {
    {
      warn(("Invalid Component definition: " + (String(Ctor))), context);
    }
    return
  }

  // async component
  var asyncFactory;
  if (isUndef(Ctor.cid)) {
    asyncFactory = Ctor;
    Ctor = resolveAsyncComponent(asyncFactory, baseCtor, context);
    if (Ctor === undefined) {
      // return a placeholder node for async component, which is rendered
      // as a comment node but preserves all the raw information for the node.
      // the information will be used for async server-rendering and hydration.
      return createAsyncPlaceholder(
        asyncFactory,
        data,
        context,
        children,
        tag
      )
    }
  }

  data = data || {};

  // resolve constructor options in case global mixins are applied after
  // component constructor creation
  resolveConstructorOptions(Ctor);

  // transform component v-model data into props & events
  if (isDef(data.model)) {
    transformModel(Ctor.options, data);
  }

  // extract props
  var propsData = extractPropsFromVNodeData(data, Ctor, tag);

  // functional component
  if (isTrue(Ctor.options.functional)) {
    return createFunctionalComponent(Ctor, propsData, data, context, children)
  }

  // extract listeners, since these needs to be treated as
  // child component listeners instead of DOM listeners
  var listeners = data.on;
  // replace with listeners with .native modifier
  // so it gets processed during parent component patch.
  data.on = data.nativeOn;

  if (isTrue(Ctor.options.abstract)) {
    // abstract components do not keep anything
    // other than props & listeners & slot

    // work around flow
    var slot = data.slot;
    data = {};
    if (slot) {
      data.slot = slot;
    }
  }

  // merge component management hooks onto the placeholder node
  mergeHooks(data);

  // return a placeholder vnode
  var name = Ctor.options.name || tag;
  var vnode = new VNode(
    ("vue-component-" + (Ctor.cid) + (name ? ("-" + name) : '')),
    data, undefined, undefined, undefined, context,
    { Ctor: Ctor, propsData: propsData, listeners: listeners, tag: tag, children: children },
    asyncFactory
  );
  return vnode
}

function createComponentInstanceForVnode (
  vnode, // we know it's MountedComponentVNode but flow doesn't
  parent, // activeInstance in lifecycle state
  parentElm,
  refElm
) {
  var vnodeComponentOptions = vnode.componentOptions;
  var options = {
    _isComponent: true,
    parent: parent,
    propsData: vnodeComponentOptions.propsData,
    _componentTag: vnodeComponentOptions.tag,
    _parentVnode: vnode,
    _parentListeners: vnodeComponentOptions.listeners,
    _renderChildren: vnodeComponentOptions.children,
    _parentElm: parentElm || null,
    _refElm: refElm || null
  };
  // check inline-template render functions
  var inlineTemplate = vnode.data.inlineTemplate;
  if (isDef(inlineTemplate)) {
    options.render = inlineTemplate.render;
    options.staticRenderFns = inlineTemplate.staticRenderFns;
  }
  return new vnodeComponentOptions.Ctor(options)
}

function mergeHooks (data) {
  if (!data.hook) {
    data.hook = {};
  }
  for (var i = 0; i < hooksToMerge.length; i++) {
    var key = hooksToMerge[i];
    var fromParent = data.hook[key];
    var ours = componentVNodeHooks[key];
    data.hook[key] = fromParent ? mergeHook$1(ours, fromParent) : ours;
  }
}

function mergeHook$1 (one, two) {
  return function (a, b, c, d) {
    one(a, b, c, d);
    two(a, b, c, d);
  }
}

// transform component v-model info (value and callback) into
// prop and event handler respectively.
function transformModel (options, data) {
  var prop = (options.model && options.model.prop) || 'value';
  var event = (options.model && options.model.event) || 'input';(data.props || (data.props = {}))[prop] = data.model.value;
  var on = data.on || (data.on = {});
  if (isDef(on[event])) {
    on[event] = [data.model.callback].concat(on[event]);
  } else {
    on[event] = data.model.callback;
  }
}

/*  */

var SIMPLE_NORMALIZE = 1;
var ALWAYS_NORMALIZE = 2;

// wrapper function for providing a more flexible interface
// without getting yelled at by flow
function createElement (
  context,
  tag,
  data,
  children,
  normalizationType,
  alwaysNormalize
) {
  if (Array.isArray(data) || isPrimitive(data)) {
    normalizationType = children;
    children = data;
    data = undefined;
  }
  if (isTrue(alwaysNormalize)) {
    normalizationType = ALWAYS_NORMALIZE;
  }
  return _createElement(context, tag, data, children, normalizationType)
}

function _createElement (
  context,
  tag,
  data,
  children,
  normalizationType
) {
  if (isDef(data) && isDef((data).__ob__)) {
    "development" !== 'production' && warn(
      "Avoid using observed data object as vnode data: " + (JSON.stringify(data)) + "\n" +
      'Always create fresh vnode data objects in each render!',
      context
    );
    return createEmptyVNode()
  }
  // object syntax in v-bind
  if (isDef(data) && isDef(data.is)) {
    tag = data.is;
  }
  if (!tag) {
    // in case of component :is set to falsy value
    return createEmptyVNode()
  }
  // warn against non-primitive key
  if ("development" !== 'production' &&
    isDef(data) && isDef(data.key) && !isPrimitive(data.key)
  ) {
    warn(
      'Avoid using non-primitive value as key, ' +
      'use string/number value instead.',
      context
    );
  }
  // support single function children as default scoped slot
  if (Array.isArray(children) &&
    typeof children[0] === 'function'
  ) {
    data = data || {};
    data.scopedSlots = { default: children[0] };
    children.length = 0;
  }
  if (normalizationType === ALWAYS_NORMALIZE) {
    children = normalizeChildren(children);
  } else if (normalizationType === SIMPLE_NORMALIZE) {
    children = simpleNormalizeChildren(children);
  }
  var vnode, ns;
  if (typeof tag === 'string') {
    var Ctor;
    ns = (context.$vnode && context.$vnode.ns) || config.getTagNamespace(tag);
    if (config.isReservedTag(tag)) {
      // platform built-in elements
      vnode = new VNode(
        config.parsePlatformTagName(tag), data, children,
        undefined, undefined, context
      );
    } else if (isDef(Ctor = resolveAsset(context.$options, 'components', tag))) {
      // component
      vnode = createComponent(Ctor, data, context, children, tag);
    } else {
      // unknown or unlisted namespaced elements
      // check at runtime because it may get assigned a namespace when its
      // parent normalizes children
      vnode = new VNode(
        tag, data, children,
        undefined, undefined, context
      );
    }
  } else {
    // direct component options / constructor
    vnode = createComponent(tag, data, context, children);
  }
  if (isDef(vnode)) {
    if (ns) { applyNS(vnode, ns); }
    return vnode
  } else {
    return createEmptyVNode()
  }
}

function applyNS (vnode, ns, force) {
  vnode.ns = ns;
  if (vnode.tag === 'foreignObject') {
    // use default namespace inside foreignObject
    ns = undefined;
    force = true;
  }
  if (isDef(vnode.children)) {
    for (var i = 0, l = vnode.children.length; i < l; i++) {
      var child = vnode.children[i];
      if (isDef(child.tag) && (isUndef(child.ns) || isTrue(force))) {
        applyNS(child, ns, force);
      }
    }
  }
}

/*  */

function initRender (vm) {
  vm._vnode = null; // the root of the child tree
  vm._staticTrees = null; // v-once cached trees
  var options = vm.$options;
  var parentVnode = vm.$vnode = options._parentVnode; // the placeholder node in parent tree
  var renderContext = parentVnode && parentVnode.context;
  vm.$slots = resolveSlots(options._renderChildren, renderContext);
  vm.$scopedSlots = emptyObject;
  // bind the createElement fn to this instance
  // so that we get proper render context inside it.
  // args order: tag, data, children, normalizationType, alwaysNormalize
  // internal version is used by render functions compiled from templates
  vm._c = function (a, b, c, d) { return createElement(vm, a, b, c, d, false); };
  // normalization is always applied for the public version, used in
  // user-written render functions.
  vm.$createElement = function (a, b, c, d) { return createElement(vm, a, b, c, d, true); };

  // $attrs & $listeners are exposed for easier HOC creation.
  // they need to be reactive so that HOCs using them are always updated
  var parentData = parentVnode && parentVnode.data;

  /* istanbul ignore else */
  {
    defineReactive(vm, '$attrs', parentData && parentData.attrs || emptyObject, function () {
      !isUpdatingChildComponent && warn("$attrs is readonly.", vm);
    }, true);
    defineReactive(vm, '$listeners', options._parentListeners || emptyObject, function () {
      !isUpdatingChildComponent && warn("$listeners is readonly.", vm);
    }, true);
  }
}

function renderMixin (Vue) {
  // install runtime convenience helpers
  installRenderHelpers(Vue.prototype);

  Vue.prototype.$nextTick = function (fn) {
    return nextTick(fn, this)
  };

  Vue.prototype._render = function () {
    var vm = this;
    var ref = vm.$options;
    var render = ref.render;
    var _parentVnode = ref._parentVnode;

    if (vm._isMounted) {
      // if the parent didn't update, the slot nodes will be the ones from
      // last render. They need to be cloned to ensure "freshness" for this render.
      for (var key in vm.$slots) {
        var slot = vm.$slots[key];
        // _rendered is a flag added by renderSlot, but may not be present
        // if the slot is passed from manually written render functions
        if (slot._rendered || (slot[0] && slot[0].elm)) {
          vm.$slots[key] = cloneVNodes(slot, true /* deep */);
        }
      }
    }

    vm.$scopedSlots = (_parentVnode && _parentVnode.data.scopedSlots) || emptyObject;

    // set parent vnode. this allows render functions to have access
    // to the data on the placeholder node.
    vm.$vnode = _parentVnode;
    // render self
    var vnode;
    try {
      vnode = render.call(vm._renderProxy, vm.$createElement);
    } catch (e) {
      handleError(e, vm, "render");
      // return error render result,
      // or previous vnode to prevent render error causing blank component
      /* istanbul ignore else */
      {
        if (vm.$options.renderError) {
          try {
            vnode = vm.$options.renderError.call(vm._renderProxy, vm.$createElement, e);
          } catch (e) {
            handleError(e, vm, "renderError");
            vnode = vm._vnode;
          }
        } else {
          vnode = vm._vnode;
        }
      }
    }
    // return empty vnode in case the render function errored out
    if (!(vnode instanceof VNode)) {
      if ("development" !== 'production' && Array.isArray(vnode)) {
        warn(
          'Multiple root nodes returned from render function. Render function ' +
          'should return a single root node.',
          vm
        );
      }
      vnode = createEmptyVNode();
    }
    // set parent
    vnode.parent = _parentVnode;
    return vnode
  };
}

/*  */

var uid$1 = 0;

function initMixin (Vue) {
  Vue.prototype._init = function (options) {
    var vm = this;
    // a uid
    vm._uid = uid$1++;

    var startTag, endTag;
    /* istanbul ignore if */
    if ("development" !== 'production' && config.performance && mark) {
      startTag = "vue-perf-start:" + (vm._uid);
      endTag = "vue-perf-end:" + (vm._uid);
      mark(startTag);
    }

    // a flag to avoid this being observed
    vm._isVue = true;
    // merge options
    if (options && options._isComponent) {
      // optimize internal component instantiation
      // since dynamic options merging is pretty slow, and none of the
      // internal component options needs special treatment.
      initInternalComponent(vm, options);
    } else {
      vm.$options = mergeOptions(
        resolveConstructorOptions(vm.constructor),
        options || {},
        vm
      );
    }
    /* istanbul ignore else */
    {
      initProxy(vm);
    }
    // expose real self
    vm._self = vm;
    initLifecycle(vm);
    initEvents(vm);
    initRender(vm);
    callHook(vm, 'beforeCreate');
    initInjections(vm); // resolve injections before data/props
    initState(vm);
    initProvide(vm); // resolve provide after data/props
    callHook(vm, 'created');

    /* istanbul ignore if */
    if ("development" !== 'production' && config.performance && mark) {
      vm._name = formatComponentName(vm, false);
      mark(endTag);
      measure(("vue " + (vm._name) + " init"), startTag, endTag);
    }

    if (vm.$options.el) {
      vm.$mount(vm.$options.el);
    }
  };
}

function initInternalComponent (vm, options) {
  var opts = vm.$options = Object.create(vm.constructor.options);
  // doing this because it's faster than dynamic enumeration.
  opts.parent = options.parent;
  opts.propsData = options.propsData;
  opts._parentVnode = options._parentVnode;
  opts._parentListeners = options._parentListeners;
  opts._renderChildren = options._renderChildren;
  opts._componentTag = options._componentTag;
  opts._parentElm = options._parentElm;
  opts._refElm = options._refElm;
  if (options.render) {
    opts.render = options.render;
    opts.staticRenderFns = options.staticRenderFns;
  }
}

function resolveConstructorOptions (Ctor) {
  var options = Ctor.options;
  if (Ctor.super) {
    var superOptions = resolveConstructorOptions(Ctor.super);
    var cachedSuperOptions = Ctor.superOptions;
    if (superOptions !== cachedSuperOptions) {
      // super option changed,
      // need to resolve new options.
      Ctor.superOptions = superOptions;
      // check if there are any late-modified/attached options (#4976)
      var modifiedOptions = resolveModifiedOptions(Ctor);
      // update base extend options
      if (modifiedOptions) {
        extend(Ctor.extendOptions, modifiedOptions);
      }
      options = Ctor.options = mergeOptions(superOptions, Ctor.extendOptions);
      if (options.name) {
        options.components[options.name] = Ctor;
      }
    }
  }
  return options
}

function resolveModifiedOptions (Ctor) {
  var modified;
  var latest = Ctor.options;
  var extended = Ctor.extendOptions;
  var sealed = Ctor.sealedOptions;
  for (var key in latest) {
    if (latest[key] !== sealed[key]) {
      if (!modified) { modified = {}; }
      modified[key] = dedupe(latest[key], extended[key], sealed[key]);
    }
  }
  return modified
}

function dedupe (latest, extended, sealed) {
  // compare latest and sealed to ensure lifecycle hooks won't be duplicated
  // between merges
  if (Array.isArray(latest)) {
    var res = [];
    sealed = Array.isArray(sealed) ? sealed : [sealed];
    extended = Array.isArray(extended) ? extended : [extended];
    for (var i = 0; i < latest.length; i++) {
      // push original options and not sealed options to exclude duplicated options
      if (extended.indexOf(latest[i]) >= 0 || sealed.indexOf(latest[i]) < 0) {
        res.push(latest[i]);
      }
    }
    return res
  } else {
    return latest
  }
}

function Vue$3 (options) {
  if ("development" !== 'production' &&
    !(this instanceof Vue$3)
  ) {
    warn('Vue is a constructor and should be called with the `new` keyword');
  }
  this._init(options);
}

initMixin(Vue$3);
stateMixin(Vue$3);
eventsMixin(Vue$3);
lifecycleMixin(Vue$3);
renderMixin(Vue$3);

/*  */

function initUse (Vue) {
  Vue.use = function (plugin) {
    var installedPlugins = (this._installedPlugins || (this._installedPlugins = []));
    if (installedPlugins.indexOf(plugin) > -1) {
      return this
    }

    // additional parameters
    var args = toArray(arguments, 1);
    args.unshift(this);
    if (typeof plugin.install === 'function') {
      plugin.install.apply(plugin, args);
    } else if (typeof plugin === 'function') {
      plugin.apply(null, args);
    }
    installedPlugins.push(plugin);
    return this
  };
}

/*  */

function initMixin$1 (Vue) {
  Vue.mixin = function (mixin) {
    this.options = mergeOptions(this.options, mixin);
    return this
  };
}

/*  */

function initExtend (Vue) {
  /**
   * Each instance constructor, including Vue, has a unique
   * cid. This enables us to create wrapped "child
   * constructors" for prototypal inheritance and cache them.
   */
  Vue.cid = 0;
  var cid = 1;

  /**
   * Class inheritance
   */
  Vue.extend = function (extendOptions) {
    extendOptions = extendOptions || {};
    var Super = this;
    var SuperId = Super.cid;
    var cachedCtors = extendOptions._Ctor || (extendOptions._Ctor = {});
    if (cachedCtors[SuperId]) {
      return cachedCtors[SuperId]
    }

    var name = extendOptions.name || Super.options.name;
    {
      if (!/^[a-zA-Z][\w-]*$/.test(name)) {
        warn(
          'Invalid component name: "' + name + '". Component names ' +
          'can only contain alphanumeric characters and the hyphen, ' +
          'and must start with a letter.'
        );
      }
    }

    var Sub = function VueComponent (options) {
      this._init(options);
    };
    Sub.prototype = Object.create(Super.prototype);
    Sub.prototype.constructor = Sub;
    Sub.cid = cid++;
    Sub.options = mergeOptions(
      Super.options,
      extendOptions
    );
    Sub['super'] = Super;

    // For props and computed properties, we define the proxy getters on
    // the Vue instances at extension time, on the extended prototype. This
    // avoids Object.defineProperty calls for each instance created.
    if (Sub.options.props) {
      initProps$1(Sub);
    }
    if (Sub.options.computed) {
      initComputed$1(Sub);
    }

    // allow further extension/mixin/plugin usage
    Sub.extend = Super.extend;
    Sub.mixin = Super.mixin;
    Sub.use = Super.use;

    // create asset registers, so extended classes
    // can have their private assets too.
    ASSET_TYPES.forEach(function (type) {
      Sub[type] = Super[type];
    });
    // enable recursive self-lookup
    if (name) {
      Sub.options.components[name] = Sub;
    }

    // keep a reference to the super options at extension time.
    // later at instantiation we can check if Super's options have
    // been updated.
    Sub.superOptions = Super.options;
    Sub.extendOptions = extendOptions;
    Sub.sealedOptions = extend({}, Sub.options);

    // cache constructor
    cachedCtors[SuperId] = Sub;
    return Sub
  };
}

function initProps$1 (Comp) {
  var props = Comp.options.props;
  for (var key in props) {
    proxy(Comp.prototype, "_props", key);
  }
}

function initComputed$1 (Comp) {
  var computed = Comp.options.computed;
  for (var key in computed) {
    defineComputed(Comp.prototype, key, computed[key]);
  }
}

/*  */

function initAssetRegisters (Vue) {
  /**
   * Create asset registration methods.
   */
  ASSET_TYPES.forEach(function (type) {
    Vue[type] = function (
      id,
      definition
    ) {
      if (!definition) {
        return this.options[type + 's'][id]
      } else {
        /* istanbul ignore if */
        {
          if (type === 'component' && config.isReservedTag(id)) {
            warn(
              'Do not use built-in or reserved HTML elements as component ' +
              'id: ' + id
            );
          }
        }
        if (type === 'component' && isPlainObject(definition)) {
          definition.name = definition.name || id;
          definition = this.options._base.extend(definition);
        }
        if (type === 'directive' && typeof definition === 'function') {
          definition = { bind: definition, update: definition };
        }
        this.options[type + 's'][id] = definition;
        return definition
      }
    };
  });
}

/*  */

function getComponentName (opts) {
  return opts && (opts.Ctor.options.name || opts.tag)
}

function matches (pattern, name) {
  if (Array.isArray(pattern)) {
    return pattern.indexOf(name) > -1
  } else if (typeof pattern === 'string') {
    return pattern.split(',').indexOf(name) > -1
  } else if (isRegExp(pattern)) {
    return pattern.test(name)
  }
  /* istanbul ignore next */
  return false
}

function pruneCache (keepAliveInstance, filter) {
  var cache = keepAliveInstance.cache;
  var keys = keepAliveInstance.keys;
  var _vnode = keepAliveInstance._vnode;
  for (var key in cache) {
    var cachedNode = cache[key];
    if (cachedNode) {
      var name = getComponentName(cachedNode.componentOptions);
      if (name && !filter(name)) {
        pruneCacheEntry(cache, key, keys, _vnode);
      }
    }
  }
}

function pruneCacheEntry (
  cache,
  key,
  keys,
  current
) {
  var cached$$1 = cache[key];
  if (cached$$1 && (!current || cached$$1.tag !== current.tag)) {
    cached$$1.componentInstance.$destroy();
  }
  cache[key] = null;
  remove(keys, key);
}

var patternTypes = [String, RegExp, Array];

var KeepAlive = {
  name: 'keep-alive',
  abstract: true,

  props: {
    include: patternTypes,
    exclude: patternTypes,
    max: [String, Number]
  },

  created: function created () {
    this.cache = Object.create(null);
    this.keys = [];
  },

  destroyed: function destroyed () {
    var this$1 = this;

    for (var key in this$1.cache) {
      pruneCacheEntry(this$1.cache, key, this$1.keys);
    }
  },

  watch: {
    include: function include (val) {
      pruneCache(this, function (name) { return matches(val, name); });
    },
    exclude: function exclude (val) {
      pruneCache(this, function (name) { return !matches(val, name); });
    }
  },

  render: function render () {
    var slot = this.$slots.default;
    var vnode = getFirstComponentChild(slot);
    var componentOptions = vnode && vnode.componentOptions;
    if (componentOptions) {
      // check pattern
      var name = getComponentName(componentOptions);
      var ref = this;
      var include = ref.include;
      var exclude = ref.exclude;
      if (
        // not included
        (include && (!name || !matches(include, name))) ||
        // excluded
        (exclude && name && matches(exclude, name))
      ) {
        return vnode
      }

      var ref$1 = this;
      var cache = ref$1.cache;
      var keys = ref$1.keys;
      var key = vnode.key == null
        // same constructor may get registered as different local components
        // so cid alone is not enough (#3269)
        ? componentOptions.Ctor.cid + (componentOptions.tag ? ("::" + (componentOptions.tag)) : '')
        : vnode.key;
      if (cache[key]) {
        vnode.componentInstance = cache[key].componentInstance;
        // make current key freshest
        remove(keys, key);
        keys.push(key);
      } else {
        cache[key] = vnode;
        keys.push(key);
        // prune oldest entry
        if (this.max && keys.length > parseInt(this.max)) {
          pruneCacheEntry(cache, keys[0], keys, this._vnode);
        }
      }

      vnode.data.keepAlive = true;
    }
    return vnode || (slot && slot[0])
  }
};

var builtInComponents = {
  KeepAlive: KeepAlive
};

/*  */

function initGlobalAPI (Vue) {
  // config
  var configDef = {};
  configDef.get = function () { return config; };
  {
    configDef.set = function () {
      warn(
        'Do not replace the Vue.config object, set individual fields instead.'
      );
    };
  }
  Object.defineProperty(Vue, 'config', configDef);

  // exposed util methods.
  // NOTE: these are not considered part of the public API - avoid relying on
  // them unless you are aware of the risk.
  Vue.util = {
    warn: warn,
    extend: extend,
    mergeOptions: mergeOptions,
    defineReactive: defineReactive
  };

  Vue.set = set;
  Vue.delete = del;
  Vue.nextTick = nextTick;

  Vue.options = Object.create(null);
  ASSET_TYPES.forEach(function (type) {
    Vue.options[type + 's'] = Object.create(null);
  });

  // this is used to identify the "base" constructor to extend all plain-object
  // components with in Weex's multi-instance scenarios.
  Vue.options._base = Vue;

  extend(Vue.options.components, builtInComponents);

  initUse(Vue);
  initMixin$1(Vue);
  initExtend(Vue);
  initAssetRegisters(Vue);
}

initGlobalAPI(Vue$3);

Object.defineProperty(Vue$3.prototype, '$isServer', {
  get: isServerRendering
});

Object.defineProperty(Vue$3.prototype, '$ssrContext', {
  get: function get () {
    /* istanbul ignore next */
    return this.$vnode && this.$vnode.ssrContext
  }
});

Vue$3.version = '2.5.9';

/*  */

// these are reserved for web because they are directly compiled away
// during template compilation
var isReservedAttr = makeMap('style,class');

// attributes that should be using props for binding
var acceptValue = makeMap('input,textarea,option,select,progress');
var mustUseProp = function (tag, type, attr) {
  return (
    (attr === 'value' && acceptValue(tag)) && type !== 'button' ||
    (attr === 'selected' && tag === 'option') ||
    (attr === 'checked' && tag === 'input') ||
    (attr === 'muted' && tag === 'video')
  )
};

var isEnumeratedAttr = makeMap('contenteditable,draggable,spellcheck');

var isBooleanAttr = makeMap(
  'allowfullscreen,async,autofocus,autoplay,checked,compact,controls,declare,' +
  'default,defaultchecked,defaultmuted,defaultselected,defer,disabled,' +
  'enabled,formnovalidate,hidden,indeterminate,inert,ismap,itemscope,loop,multiple,' +
  'muted,nohref,noresize,noshade,novalidate,nowrap,open,pauseonexit,readonly,' +
  'required,reversed,scoped,seamless,selected,sortable,translate,' +
  'truespeed,typemustmatch,visible'
);

var xlinkNS = 'http://www.w3.org/1999/xlink';

var isXlink = function (name) {
  return name.charAt(5) === ':' && name.slice(0, 5) === 'xlink'
};

var getXlinkProp = function (name) {
  return isXlink(name) ? name.slice(6, name.length) : ''
};

var isFalsyAttrValue = function (val) {
  return val == null || val === false
};

/*  */

function genClassForVnode (vnode) {
  var data = vnode.data;
  var parentNode = vnode;
  var childNode = vnode;
  while (isDef(childNode.componentInstance)) {
    childNode = childNode.componentInstance._vnode;
    if (childNode.data) {
      data = mergeClassData(childNode.data, data);
    }
  }
  while (isDef(parentNode = parentNode.parent)) {
    if (parentNode.data) {
      data = mergeClassData(data, parentNode.data);
    }
  }
  return renderClass(data.staticClass, data.class)
}

function mergeClassData (child, parent) {
  return {
    staticClass: concat(child.staticClass, parent.staticClass),
    class: isDef(child.class)
      ? [child.class, parent.class]
      : parent.class
  }
}

function renderClass (
  staticClass,
  dynamicClass
) {
  if (isDef(staticClass) || isDef(dynamicClass)) {
    return concat(staticClass, stringifyClass(dynamicClass))
  }
  /* istanbul ignore next */
  return ''
}

function concat (a, b) {
  return a ? b ? (a + ' ' + b) : a : (b || '')
}

function stringifyClass (value) {
  if (Array.isArray(value)) {
    return stringifyArray(value)
  }
  if (isObject(value)) {
    return stringifyObject(value)
  }
  if (typeof value === 'string') {
    return value
  }
  /* istanbul ignore next */
  return ''
}

function stringifyArray (value) {
  var res = '';
  var stringified;
  for (var i = 0, l = value.length; i < l; i++) {
    if (isDef(stringified = stringifyClass(value[i])) && stringified !== '') {
      if (res) { res += ' '; }
      res += stringified;
    }
  }
  return res
}

function stringifyObject (value) {
  var res = '';
  for (var key in value) {
    if (value[key]) {
      if (res) { res += ' '; }
      res += key;
    }
  }
  return res
}

/*  */

var namespaceMap = {
  svg: 'http://www.w3.org/2000/svg',
  math: 'http://www.w3.org/1998/Math/MathML'
};

var isHTMLTag = makeMap(
  'html,body,base,head,link,meta,style,title,' +
  'address,article,aside,footer,header,h1,h2,h3,h4,h5,h6,hgroup,nav,section,' +
  'div,dd,dl,dt,figcaption,figure,picture,hr,img,li,main,ol,p,pre,ul,' +
  'a,b,abbr,bdi,bdo,br,cite,code,data,dfn,em,i,kbd,mark,q,rp,rt,rtc,ruby,' +
  's,samp,small,span,strong,sub,sup,time,u,var,wbr,area,audio,map,track,video,' +
  'embed,object,param,source,canvas,script,noscript,del,ins,' +
  'caption,col,colgroup,table,thead,tbody,td,th,tr,' +
  'button,datalist,fieldset,form,input,label,legend,meter,optgroup,option,' +
  'output,progress,select,textarea,' +
  'details,dialog,menu,menuitem,summary,' +
  'content,element,shadow,template,blockquote,iframe,tfoot'
);

// this map is intentionally selective, only covering SVG elements that may
// contain child elements.
var isSVG = makeMap(
  'svg,animate,circle,clippath,cursor,defs,desc,ellipse,filter,font-face,' +
  'foreignObject,g,glyph,image,line,marker,mask,missing-glyph,path,pattern,' +
  'polygon,polyline,rect,switch,symbol,text,textpath,tspan,use,view',
  true
);

var isPreTag = function (tag) { return tag === 'pre'; };

var isReservedTag = function (tag) {
  return isHTMLTag(tag) || isSVG(tag)
};

function getTagNamespace (tag) {
  if (isSVG(tag)) {
    return 'svg'
  }
  // basic support for MathML
  // note it doesn't support other MathML elements being component roots
  if (tag === 'math') {
    return 'math'
  }
}

var unknownElementCache = Object.create(null);
function isUnknownElement (tag) {
  /* istanbul ignore if */
  if (!inBrowser) {
    return true
  }
  if (isReservedTag(tag)) {
    return false
  }
  tag = tag.toLowerCase();
  /* istanbul ignore if */
  if (unknownElementCache[tag] != null) {
    return unknownElementCache[tag]
  }
  var el = document.createElement(tag);
  if (tag.indexOf('-') > -1) {
    // http://stackoverflow.com/a/28210364/1070244
    return (unknownElementCache[tag] = (
      el.constructor === window.HTMLUnknownElement ||
      el.constructor === window.HTMLElement
    ))
  } else {
    return (unknownElementCache[tag] = /HTMLUnknownElement/.test(el.toString()))
  }
}

var isTextInputType = makeMap('text,number,password,search,email,tel,url');

/*  */

/**
 * Query an element selector if it's not an element already.
 */
function query (el) {
  if (typeof el === 'string') {
    var selected = document.querySelector(el);
    if (!selected) {
      "development" !== 'production' && warn(
        'Cannot find element: ' + el
      );
      return document.createElement('div')
    }
    return selected
  } else {
    return el
  }
}

/*  */

function createElement$1 (tagName, vnode) {
  var elm = document.createElement(tagName);
  if (tagName !== 'select') {
    return elm
  }
  // false or null will remove the attribute but undefined will not
  if (vnode.data && vnode.data.attrs && vnode.data.attrs.multiple !== undefined) {
    elm.setAttribute('multiple', 'multiple');
  }
  return elm
}

function createElementNS (namespace, tagName) {
  return document.createElementNS(namespaceMap[namespace], tagName)
}

function createTextNode (text) {
  return document.createTextNode(text)
}

function createComment (text) {
  return document.createComment(text)
}

function insertBefore (parentNode, newNode, referenceNode) {
  parentNode.insertBefore(newNode, referenceNode);
}

function removeChild (node, child) {
  node.removeChild(child);
}

function appendChild (node, child) {
  node.appendChild(child);
}

function parentNode (node) {
  return node.parentNode
}

function nextSibling (node) {
  return node.nextSibling
}

function tagName (node) {
  return node.tagName
}

function setTextContent (node, text) {
  node.textContent = text;
}

function setAttribute (node, key, val) {
  node.setAttribute(key, val);
}


var nodeOps = Object.freeze({
	createElement: createElement$1,
	createElementNS: createElementNS,
	createTextNode: createTextNode,
	createComment: createComment,
	insertBefore: insertBefore,
	removeChild: removeChild,
	appendChild: appendChild,
	parentNode: parentNode,
	nextSibling: nextSibling,
	tagName: tagName,
	setTextContent: setTextContent,
	setAttribute: setAttribute
});

/*  */

var ref = {
  create: function create (_, vnode) {
    registerRef(vnode);
  },
  update: function update (oldVnode, vnode) {
    if (oldVnode.data.ref !== vnode.data.ref) {
      registerRef(oldVnode, true);
      registerRef(vnode);
    }
  },
  destroy: function destroy (vnode) {
    registerRef(vnode, true);
  }
};

function registerRef (vnode, isRemoval) {
  var key = vnode.data.ref;
  if (!key) { return }

  var vm = vnode.context;
  var ref = vnode.componentInstance || vnode.elm;
  var refs = vm.$refs;
  if (isRemoval) {
    if (Array.isArray(refs[key])) {
      remove(refs[key], ref);
    } else if (refs[key] === ref) {
      refs[key] = undefined;
    }
  } else {
    if (vnode.data.refInFor) {
      if (!Array.isArray(refs[key])) {
        refs[key] = [ref];
      } else if (refs[key].indexOf(ref) < 0) {
        // $flow-disable-line
        refs[key].push(ref);
      }
    } else {
      refs[key] = ref;
    }
  }
}

/**
 * Virtual DOM patching algorithm based on Snabbdom by
 * Simon Friis Vindum (@paldepind)
 * Licensed under the MIT License
 * https://github.com/paldepind/snabbdom/blob/master/LICENSE
 *
 * modified by Evan You (@yyx990803)
 *
 * Not type-checking this because this file is perf-critical and the cost
 * of making flow understand it is not worth it.
 */

var emptyNode = new VNode('', {}, []);

var hooks = ['create', 'activate', 'update', 'remove', 'destroy'];

function sameVnode (a, b) {
  return (
    a.key === b.key && (
      (
        a.tag === b.tag &&
        a.isComment === b.isComment &&
        isDef(a.data) === isDef(b.data) &&
        sameInputType(a, b)
      ) || (
        isTrue(a.isAsyncPlaceholder) &&
        a.asyncFactory === b.asyncFactory &&
        isUndef(b.asyncFactory.error)
      )
    )
  )
}

function sameInputType (a, b) {
  if (a.tag !== 'input') { return true }
  var i;
  var typeA = isDef(i = a.data) && isDef(i = i.attrs) && i.type;
  var typeB = isDef(i = b.data) && isDef(i = i.attrs) && i.type;
  return typeA === typeB || isTextInputType(typeA) && isTextInputType(typeB)
}

function createKeyToOldIdx (children, beginIdx, endIdx) {
  var i, key;
  var map = {};
  for (i = beginIdx; i <= endIdx; ++i) {
    key = children[i].key;
    if (isDef(key)) { map[key] = i; }
  }
  return map
}

function createPatchFunction (backend) {
  var i, j;
  var cbs = {};

  var modules = backend.modules;
  var nodeOps = backend.nodeOps;

  for (i = 0; i < hooks.length; ++i) {
    cbs[hooks[i]] = [];
    for (j = 0; j < modules.length; ++j) {
      if (isDef(modules[j][hooks[i]])) {
        cbs[hooks[i]].push(modules[j][hooks[i]]);
      }
    }
  }

  function emptyNodeAt (elm) {
    return new VNode(nodeOps.tagName(elm).toLowerCase(), {}, [], undefined, elm)
  }

  function createRmCb (childElm, listeners) {
    function remove () {
      if (--remove.listeners === 0) {
        removeNode(childElm);
      }
    }
    remove.listeners = listeners;
    return remove
  }

  function removeNode (el) {
    var parent = nodeOps.parentNode(el);
    // element may have already been removed due to v-html / v-text
    if (isDef(parent)) {
      nodeOps.removeChild(parent, el);
    }
  }

  function isUnknownElement$$1 (vnode, inVPre) {
    return (
      !inVPre &&
      !vnode.ns &&
      !(
        config.ignoredElements.length &&
        config.ignoredElements.some(function (ignore) {
          return isRegExp(ignore)
            ? ignore.test(vnode.tag)
            : ignore === vnode.tag
        })
      ) &&
      config.isUnknownElement(vnode.tag)
    )
  }

  var creatingElmInVPre = 0;
  function createElm (vnode, insertedVnodeQueue, parentElm, refElm, nested) {
    vnode.isRootInsert = !nested; // for transition enter check
    if (createComponent(vnode, insertedVnodeQueue, parentElm, refElm)) {
      return
    }

    var data = vnode.data;
    var children = vnode.children;
    var tag = vnode.tag;
    if (isDef(tag)) {
      {
        if (data && data.pre) {
          creatingElmInVPre++;
        }
        if (isUnknownElement$$1(vnode, creatingElmInVPre)) {
          warn(
            'Unknown custom element: <' + tag + '> - did you ' +
            'register the component correctly? For recursive components, ' +
            'make sure to provide the "name" option.',
            vnode.context
          );
        }
      }
      vnode.elm = vnode.ns
        ? nodeOps.createElementNS(vnode.ns, tag)
        : nodeOps.createElement(tag, vnode);
      setScope(vnode);

      /* istanbul ignore if */
      {
        createChildren(vnode, children, insertedVnodeQueue);
        if (isDef(data)) {
          invokeCreateHooks(vnode, insertedVnodeQueue);
        }
        insert(parentElm, vnode.elm, refElm);
      }

      if ("development" !== 'production' && data && data.pre) {
        creatingElmInVPre--;
      }
    } else if (isTrue(vnode.isComment)) {
      vnode.elm = nodeOps.createComment(vnode.text);
      insert(parentElm, vnode.elm, refElm);
    } else {
      vnode.elm = nodeOps.createTextNode(vnode.text);
      insert(parentElm, vnode.elm, refElm);
    }
  }

  function createComponent (vnode, insertedVnodeQueue, parentElm, refElm) {
    var i = vnode.data;
    if (isDef(i)) {
      var isReactivated = isDef(vnode.componentInstance) && i.keepAlive;
      if (isDef(i = i.hook) && isDef(i = i.init)) {
        i(vnode, false /* hydrating */, parentElm, refElm);
      }
      // after calling the init hook, if the vnode is a child component
      // it should've created a child instance and mounted it. the child
      // component also has set the placeholder vnode's elm.
      // in that case we can just return the element and be done.
      if (isDef(vnode.componentInstance)) {
        initComponent(vnode, insertedVnodeQueue);
        if (isTrue(isReactivated)) {
          reactivateComponent(vnode, insertedVnodeQueue, parentElm, refElm);
        }
        return true
      }
    }
  }

  function initComponent (vnode, insertedVnodeQueue) {
    if (isDef(vnode.data.pendingInsert)) {
      insertedVnodeQueue.push.apply(insertedVnodeQueue, vnode.data.pendingInsert);
      vnode.data.pendingInsert = null;
    }
    vnode.elm = vnode.componentInstance.$el;
    if (isPatchable(vnode)) {
      invokeCreateHooks(vnode, insertedVnodeQueue);
      setScope(vnode);
    } else {
      // empty component root.
      // skip all element-related modules except for ref (#3455)
      registerRef(vnode);
      // make sure to invoke the insert hook
      insertedVnodeQueue.push(vnode);
    }
  }

  function reactivateComponent (vnode, insertedVnodeQueue, parentElm, refElm) {
    var i;
    // hack for #4339: a reactivated component with inner transition
    // does not trigger because the inner node's created hooks are not called
    // again. It's not ideal to involve module-specific logic in here but
    // there doesn't seem to be a better way to do it.
    var innerNode = vnode;
    while (innerNode.componentInstance) {
      innerNode = innerNode.componentInstance._vnode;
      if (isDef(i = innerNode.data) && isDef(i = i.transition)) {
        for (i = 0; i < cbs.activate.length; ++i) {
          cbs.activate[i](emptyNode, innerNode);
        }
        insertedVnodeQueue.push(innerNode);
        break
      }
    }
    // unlike a newly created component,
    // a reactivated keep-alive component doesn't insert itself
    insert(parentElm, vnode.elm, refElm);
  }

  function insert (parent, elm, ref$$1) {
    if (isDef(parent)) {
      if (isDef(ref$$1)) {
        if (ref$$1.parentNode === parent) {
          nodeOps.insertBefore(parent, elm, ref$$1);
        }
      } else {
        nodeOps.appendChild(parent, elm);
      }
    }
  }

  function createChildren (vnode, children, insertedVnodeQueue) {
    if (Array.isArray(children)) {
      for (var i = 0; i < children.length; ++i) {
        createElm(children[i], insertedVnodeQueue, vnode.elm, null, true);
      }
    } else if (isPrimitive(vnode.text)) {
      nodeOps.appendChild(vnode.elm, nodeOps.createTextNode(vnode.text));
    }
  }

  function isPatchable (vnode) {
    while (vnode.componentInstance) {
      vnode = vnode.componentInstance._vnode;
    }
    return isDef(vnode.tag)
  }

  function invokeCreateHooks (vnode, insertedVnodeQueue) {
    for (var i$1 = 0; i$1 < cbs.create.length; ++i$1) {
      cbs.create[i$1](emptyNode, vnode);
    }
    i = vnode.data.hook; // Reuse variable
    if (isDef(i)) {
      if (isDef(i.create)) { i.create(emptyNode, vnode); }
      if (isDef(i.insert)) { insertedVnodeQueue.push(vnode); }
    }
  }

  // set scope id attribute for scoped CSS.
  // this is implemented as a special case to avoid the overhead
  // of going through the normal attribute patching process.
  function setScope (vnode) {
    var i;
    if (isDef(i = vnode.fnScopeId)) {
      nodeOps.setAttribute(vnode.elm, i, '');
    } else {
      var ancestor = vnode;
      while (ancestor) {
        if (isDef(i = ancestor.context) && isDef(i = i.$options._scopeId)) {
          nodeOps.setAttribute(vnode.elm, i, '');
        }
        ancestor = ancestor.parent;
      }
    }
    // for slot content they should also get the scopeId from the host instance.
    if (isDef(i = activeInstance) &&
      i !== vnode.context &&
      i !== vnode.fnContext &&
      isDef(i = i.$options._scopeId)
    ) {
      nodeOps.setAttribute(vnode.elm, i, '');
    }
  }

  function addVnodes (parentElm, refElm, vnodes, startIdx, endIdx, insertedVnodeQueue) {
    for (; startIdx <= endIdx; ++startIdx) {
      createElm(vnodes[startIdx], insertedVnodeQueue, parentElm, refElm);
    }
  }

  function invokeDestroyHook (vnode) {
    var i, j;
    var data = vnode.data;
    if (isDef(data)) {
      if (isDef(i = data.hook) && isDef(i = i.destroy)) { i(vnode); }
      for (i = 0; i < cbs.destroy.length; ++i) { cbs.destroy[i](vnode); }
    }
    if (isDef(i = vnode.children)) {
      for (j = 0; j < vnode.children.length; ++j) {
        invokeDestroyHook(vnode.children[j]);
      }
    }
  }

  function removeVnodes (parentElm, vnodes, startIdx, endIdx) {
    for (; startIdx <= endIdx; ++startIdx) {
      var ch = vnodes[startIdx];
      if (isDef(ch)) {
        if (isDef(ch.tag)) {
          removeAndInvokeRemoveHook(ch);
          invokeDestroyHook(ch);
        } else { // Text node
          removeNode(ch.elm);
        }
      }
    }
  }

  function removeAndInvokeRemoveHook (vnode, rm) {
    if (isDef(rm) || isDef(vnode.data)) {
      var i;
      var listeners = cbs.remove.length + 1;
      if (isDef(rm)) {
        // we have a recursively passed down rm callback
        // increase the listeners count
        rm.listeners += listeners;
      } else {
        // directly removing
        rm = createRmCb(vnode.elm, listeners);
      }
      // recursively invoke hooks on child component root node
      if (isDef(i = vnode.componentInstance) && isDef(i = i._vnode) && isDef(i.data)) {
        removeAndInvokeRemoveHook(i, rm);
      }
      for (i = 0; i < cbs.remove.length; ++i) {
        cbs.remove[i](vnode, rm);
      }
      if (isDef(i = vnode.data.hook) && isDef(i = i.remove)) {
        i(vnode, rm);
      } else {
        rm();
      }
    } else {
      removeNode(vnode.elm);
    }
  }

  function updateChildren (parentElm, oldCh, newCh, insertedVnodeQueue, removeOnly) {
    var oldStartIdx = 0;
    var newStartIdx = 0;
    var oldEndIdx = oldCh.length - 1;
    var oldStartVnode = oldCh[0];
    var oldEndVnode = oldCh[oldEndIdx];
    var newEndIdx = newCh.length - 1;
    var newStartVnode = newCh[0];
    var newEndVnode = newCh[newEndIdx];
    var oldKeyToIdx, idxInOld, vnodeToMove, refElm;

    // removeOnly is a special flag used only by <transition-group>
    // to ensure removed elements stay in correct relative positions
    // during leaving transitions
    var canMove = !removeOnly;

    while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
      if (isUndef(oldStartVnode)) {
        oldStartVnode = oldCh[++oldStartIdx]; // Vnode has been moved left
      } else if (isUndef(oldEndVnode)) {
        oldEndVnode = oldCh[--oldEndIdx];
      } else if (sameVnode(oldStartVnode, newStartVnode)) {
        patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue);
        oldStartVnode = oldCh[++oldStartIdx];
        newStartVnode = newCh[++newStartIdx];
      } else if (sameVnode(oldEndVnode, newEndVnode)) {
        patchVnode(oldEndVnode, newEndVnode, insertedVnodeQueue);
        oldEndVnode = oldCh[--oldEndIdx];
        newEndVnode = newCh[--newEndIdx];
      } else if (sameVnode(oldStartVnode, newEndVnode)) { // Vnode moved right
        patchVnode(oldStartVnode, newEndVnode, insertedVnodeQueue);
        canMove && nodeOps.insertBefore(parentElm, oldStartVnode.elm, nodeOps.nextSibling(oldEndVnode.elm));
        oldStartVnode = oldCh[++oldStartIdx];
        newEndVnode = newCh[--newEndIdx];
      } else if (sameVnode(oldEndVnode, newStartVnode)) { // Vnode moved left
        patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue);
        canMove && nodeOps.insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm);
        oldEndVnode = oldCh[--oldEndIdx];
        newStartVnode = newCh[++newStartIdx];
      } else {
        if (isUndef(oldKeyToIdx)) { oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx); }
        idxInOld = isDef(newStartVnode.key)
          ? oldKeyToIdx[newStartVnode.key]
          : findIdxInOld(newStartVnode, oldCh, oldStartIdx, oldEndIdx);
        if (isUndef(idxInOld)) { // New element
          createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm);
        } else {
          vnodeToMove = oldCh[idxInOld];
          /* istanbul ignore if */
          if ("development" !== 'production' && !vnodeToMove) {
            warn(
              'It seems there are duplicate keys that is causing an update error. ' +
              'Make sure each v-for item has a unique key.'
            );
          }
          if (sameVnode(vnodeToMove, newStartVnode)) {
            patchVnode(vnodeToMove, newStartVnode, insertedVnodeQueue);
            oldCh[idxInOld] = undefined;
            canMove && nodeOps.insertBefore(parentElm, vnodeToMove.elm, oldStartVnode.elm);
          } else {
            // same key but different element. treat as new element
            createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm);
          }
        }
        newStartVnode = newCh[++newStartIdx];
      }
    }
    if (oldStartIdx > oldEndIdx) {
      refElm = isUndef(newCh[newEndIdx + 1]) ? null : newCh[newEndIdx + 1].elm;
      addVnodes(parentElm, refElm, newCh, newStartIdx, newEndIdx, insertedVnodeQueue);
    } else if (newStartIdx > newEndIdx) {
      removeVnodes(parentElm, oldCh, oldStartIdx, oldEndIdx);
    }
  }

  function findIdxInOld (node, oldCh, start, end) {
    for (var i = start; i < end; i++) {
      var c = oldCh[i];
      if (isDef(c) && sameVnode(node, c)) { return i }
    }
  }

  function patchVnode (oldVnode, vnode, insertedVnodeQueue, removeOnly) {
    if (oldVnode === vnode) {
      return
    }

    var elm = vnode.elm = oldVnode.elm;

    if (isTrue(oldVnode.isAsyncPlaceholder)) {
      if (isDef(vnode.asyncFactory.resolved)) {
        hydrate(oldVnode.elm, vnode, insertedVnodeQueue);
      } else {
        vnode.isAsyncPlaceholder = true;
      }
      return
    }

    // reuse element for static trees.
    // note we only do this if the vnode is cloned -
    // if the new node is not cloned it means the render functions have been
    // reset by the hot-reload-api and we need to do a proper re-render.
    if (isTrue(vnode.isStatic) &&
      isTrue(oldVnode.isStatic) &&
      vnode.key === oldVnode.key &&
      (isTrue(vnode.isCloned) || isTrue(vnode.isOnce))
    ) {
      vnode.componentInstance = oldVnode.componentInstance;
      return
    }

    var i;
    var data = vnode.data;
    if (isDef(data) && isDef(i = data.hook) && isDef(i = i.prepatch)) {
      i(oldVnode, vnode);
    }

    var oldCh = oldVnode.children;
    var ch = vnode.children;
    if (isDef(data) && isPatchable(vnode)) {
      for (i = 0; i < cbs.update.length; ++i) { cbs.update[i](oldVnode, vnode); }
      if (isDef(i = data.hook) && isDef(i = i.update)) { i(oldVnode, vnode); }
    }
    if (isUndef(vnode.text)) {
      if (isDef(oldCh) && isDef(ch)) {
        if (oldCh !== ch) { updateChildren(elm, oldCh, ch, insertedVnodeQueue, removeOnly); }
      } else if (isDef(ch)) {
        if (isDef(oldVnode.text)) { nodeOps.setTextContent(elm, ''); }
        addVnodes(elm, null, ch, 0, ch.length - 1, insertedVnodeQueue);
      } else if (isDef(oldCh)) {
        removeVnodes(elm, oldCh, 0, oldCh.length - 1);
      } else if (isDef(oldVnode.text)) {
        nodeOps.setTextContent(elm, '');
      }
    } else if (oldVnode.text !== vnode.text) {
      nodeOps.setTextContent(elm, vnode.text);
    }
    if (isDef(data)) {
      if (isDef(i = data.hook) && isDef(i = i.postpatch)) { i(oldVnode, vnode); }
    }
  }

  function invokeInsertHook (vnode, queue, initial) {
    // delay insert hooks for component root nodes, invoke them after the
    // element is really inserted
    if (isTrue(initial) && isDef(vnode.parent)) {
      vnode.parent.data.pendingInsert = queue;
    } else {
      for (var i = 0; i < queue.length; ++i) {
        queue[i].data.hook.insert(queue[i]);
      }
    }
  }

  var hydrationBailed = false;
  // list of modules that can skip create hook during hydration because they
  // are already rendered on the client or has no need for initialization
  // Note: style is excluded because it relies on initial clone for future
  // deep updates (#7063).
  var isRenderedModule = makeMap('attrs,class,staticClass,staticStyle,key');

  // Note: this is a browser-only function so we can assume elms are DOM nodes.
  function hydrate (elm, vnode, insertedVnodeQueue, inVPre) {
    var i;
    var tag = vnode.tag;
    var data = vnode.data;
    var children = vnode.children;
    inVPre = inVPre || (data && data.pre);
    vnode.elm = elm;

    if (isTrue(vnode.isComment) && isDef(vnode.asyncFactory)) {
      vnode.isAsyncPlaceholder = true;
      return true
    }
    // assert node match
    {
      if (!assertNodeMatch(elm, vnode, inVPre)) {
        return false
      }
    }
    if (isDef(data)) {
      if (isDef(i = data.hook) && isDef(i = i.init)) { i(vnode, true /* hydrating */); }
      if (isDef(i = vnode.componentInstance)) {
        // child component. it should have hydrated its own tree.
        initComponent(vnode, insertedVnodeQueue);
        return true
      }
    }
    if (isDef(tag)) {
      if (isDef(children)) {
        // empty element, allow client to pick up and populate children
        if (!elm.hasChildNodes()) {
          createChildren(vnode, children, insertedVnodeQueue);
        } else {
          // v-html and domProps: innerHTML
          if (isDef(i = data) && isDef(i = i.domProps) && isDef(i = i.innerHTML)) {
            if (i !== elm.innerHTML) {
              /* istanbul ignore if */
              if ("development" !== 'production' &&
                typeof console !== 'undefined' &&
                !hydrationBailed
              ) {
                hydrationBailed = true;
                console.warn('Parent: ', elm);
                console.warn('server innerHTML: ', i);
                console.warn('client innerHTML: ', elm.innerHTML);
              }
              return false
            }
          } else {
            // iterate and compare children lists
            var childrenMatch = true;
            var childNode = elm.firstChild;
            for (var i$1 = 0; i$1 < children.length; i$1++) {
              if (!childNode || !hydrate(childNode, children[i$1], insertedVnodeQueue, inVPre)) {
                childrenMatch = false;
                break
              }
              childNode = childNode.nextSibling;
            }
            // if childNode is not null, it means the actual childNodes list is
            // longer than the virtual children list.
            if (!childrenMatch || childNode) {
              /* istanbul ignore if */
              if ("development" !== 'production' &&
                typeof console !== 'undefined' &&
                !hydrationBailed
              ) {
                hydrationBailed = true;
                console.warn('Parent: ', elm);
                console.warn('Mismatching childNodes vs. VNodes: ', elm.childNodes, children);
              }
              return false
            }
          }
        }
      }
      if (isDef(data)) {
        var fullInvoke = false;
        for (var key in data) {
          if (!isRenderedModule(key)) {
            fullInvoke = true;
            invokeCreateHooks(vnode, insertedVnodeQueue);
            break
          }
        }
        if (!fullInvoke && data['class']) {
          // ensure collecting deps for deep class bindings for future updates
          traverse(data['class']);
        }
      }
    } else if (elm.data !== vnode.text) {
      elm.data = vnode.text;
    }
    return true
  }

  function assertNodeMatch (node, vnode, inVPre) {
    if (isDef(vnode.tag)) {
      return vnode.tag.indexOf('vue-component') === 0 || (
        !isUnknownElement$$1(vnode, inVPre) &&
        vnode.tag.toLowerCase() === (node.tagName && node.tagName.toLowerCase())
      )
    } else {
      return node.nodeType === (vnode.isComment ? 8 : 3)
    }
  }

  return function patch (oldVnode, vnode, hydrating, removeOnly, parentElm, refElm) {
    if (isUndef(vnode)) {
      if (isDef(oldVnode)) { invokeDestroyHook(oldVnode); }
      return
    }

    var isInitialPatch = false;
    var insertedVnodeQueue = [];

    if (isUndef(oldVnode)) {
      // empty mount (likely as component), create new root element
      isInitialPatch = true;
      createElm(vnode, insertedVnodeQueue, parentElm, refElm);
    } else {
      var isRealElement = isDef(oldVnode.nodeType);
      if (!isRealElement && sameVnode(oldVnode, vnode)) {
        // patch existing root node
        patchVnode(oldVnode, vnode, insertedVnodeQueue, removeOnly);
      } else {
        if (isRealElement) {
          // mounting to a real element
          // check if this is server-rendered content and if we can perform
          // a successful hydration.
          if (oldVnode.nodeType === 1 && oldVnode.hasAttribute(SSR_ATTR)) {
            oldVnode.removeAttribute(SSR_ATTR);
            hydrating = true;
          }
          if (isTrue(hydrating)) {
            if (hydrate(oldVnode, vnode, insertedVnodeQueue)) {
              invokeInsertHook(vnode, insertedVnodeQueue, true);
              return oldVnode
            } else {
              warn(
                'The client-side rendered virtual DOM tree is not matching ' +
                'server-rendered content. This is likely caused by incorrect ' +
                'HTML markup, for example nesting block-level elements inside ' +
                '<p>, or missing <tbody>. Bailing hydration and performing ' +
                'full client-side render.'
              );
            }
          }
          // either not server-rendered, or hydration failed.
          // create an empty node and replace it
          oldVnode = emptyNodeAt(oldVnode);
        }

        // replacing existing element
        var oldElm = oldVnode.elm;
        var parentElm$1 = nodeOps.parentNode(oldElm);

        // create new node
        createElm(
          vnode,
          insertedVnodeQueue,
          // extremely rare edge case: do not insert if old element is in a
          // leaving transition. Only happens when combining transition +
          // keep-alive + HOCs. (#4590)
          oldElm._leaveCb ? null : parentElm$1,
          nodeOps.nextSibling(oldElm)
        );

        // update parent placeholder node element, recursively
        if (isDef(vnode.parent)) {
          var ancestor = vnode.parent;
          var patchable = isPatchable(vnode);
          while (ancestor) {
            for (var i = 0; i < cbs.destroy.length; ++i) {
              cbs.destroy[i](ancestor);
            }
            ancestor.elm = vnode.elm;
            if (patchable) {
              for (var i$1 = 0; i$1 < cbs.create.length; ++i$1) {
                cbs.create[i$1](emptyNode, ancestor);
              }
              // #6513
              // invoke insert hooks that may have been merged by create hooks.
              // e.g. for directives that uses the "inserted" hook.
              var insert = ancestor.data.hook.insert;
              if (insert.merged) {
                // start at index 1 to avoid re-invoking component mounted hook
                for (var i$2 = 1; i$2 < insert.fns.length; i$2++) {
                  insert.fns[i$2]();
                }
              }
            } else {
              registerRef(ancestor);
            }
            ancestor = ancestor.parent;
          }
        }

        // destroy old node
        if (isDef(parentElm$1)) {
          removeVnodes(parentElm$1, [oldVnode], 0, 0);
        } else if (isDef(oldVnode.tag)) {
          invokeDestroyHook(oldVnode);
        }
      }
    }

    invokeInsertHook(vnode, insertedVnodeQueue, isInitialPatch);
    return vnode.elm
  }
}

/*  */

var directives = {
  create: updateDirectives,
  update: updateDirectives,
  destroy: function unbindDirectives (vnode) {
    updateDirectives(vnode, emptyNode);
  }
};

function updateDirectives (oldVnode, vnode) {
  if (oldVnode.data.directives || vnode.data.directives) {
    _update(oldVnode, vnode);
  }
}

function _update (oldVnode, vnode) {
  var isCreate = oldVnode === emptyNode;
  var isDestroy = vnode === emptyNode;
  var oldDirs = normalizeDirectives$1(oldVnode.data.directives, oldVnode.context);
  var newDirs = normalizeDirectives$1(vnode.data.directives, vnode.context);

  var dirsWithInsert = [];
  var dirsWithPostpatch = [];

  var key, oldDir, dir;
  for (key in newDirs) {
    oldDir = oldDirs[key];
    dir = newDirs[key];
    if (!oldDir) {
      // new directive, bind
      callHook$1(dir, 'bind', vnode, oldVnode);
      if (dir.def && dir.def.inserted) {
        dirsWithInsert.push(dir);
      }
    } else {
      // existing directive, update
      dir.oldValue = oldDir.value;
      callHook$1(dir, 'update', vnode, oldVnode);
      if (dir.def && dir.def.componentUpdated) {
        dirsWithPostpatch.push(dir);
      }
    }
  }

  if (dirsWithInsert.length) {
    var callInsert = function () {
      for (var i = 0; i < dirsWithInsert.length; i++) {
        callHook$1(dirsWithInsert[i], 'inserted', vnode, oldVnode);
      }
    };
    if (isCreate) {
      mergeVNodeHook(vnode, 'insert', callInsert);
    } else {
      callInsert();
    }
  }

  if (dirsWithPostpatch.length) {
    mergeVNodeHook(vnode, 'postpatch', function () {
      for (var i = 0; i < dirsWithPostpatch.length; i++) {
        callHook$1(dirsWithPostpatch[i], 'componentUpdated', vnode, oldVnode);
      }
    });
  }

  if (!isCreate) {
    for (key in oldDirs) {
      if (!newDirs[key]) {
        // no longer present, unbind
        callHook$1(oldDirs[key], 'unbind', oldVnode, oldVnode, isDestroy);
      }
    }
  }
}

var emptyModifiers = Object.create(null);

function normalizeDirectives$1 (
  dirs,
  vm
) {
  var res = Object.create(null);
  if (!dirs) {
    return res
  }
  var i, dir;
  for (i = 0; i < dirs.length; i++) {
    dir = dirs[i];
    if (!dir.modifiers) {
      dir.modifiers = emptyModifiers;
    }
    res[getRawDirName(dir)] = dir;
    dir.def = resolveAsset(vm.$options, 'directives', dir.name, true);
  }
  return res
}

function getRawDirName (dir) {
  return dir.rawName || ((dir.name) + "." + (Object.keys(dir.modifiers || {}).join('.')))
}

function callHook$1 (dir, hook, vnode, oldVnode, isDestroy) {
  var fn = dir.def && dir.def[hook];
  if (fn) {
    try {
      fn(vnode.elm, dir, vnode, oldVnode, isDestroy);
    } catch (e) {
      handleError(e, vnode.context, ("directive " + (dir.name) + " " + hook + " hook"));
    }
  }
}

var baseModules = [
  ref,
  directives
];

/*  */

function updateAttrs (oldVnode, vnode) {
  var opts = vnode.componentOptions;
  if (isDef(opts) && opts.Ctor.options.inheritAttrs === false) {
    return
  }
  if (isUndef(oldVnode.data.attrs) && isUndef(vnode.data.attrs)) {
    return
  }
  var key, cur, old;
  var elm = vnode.elm;
  var oldAttrs = oldVnode.data.attrs || {};
  var attrs = vnode.data.attrs || {};
  // clone observed objects, as the user probably wants to mutate it
  if (isDef(attrs.__ob__)) {
    attrs = vnode.data.attrs = extend({}, attrs);
  }

  for (key in attrs) {
    cur = attrs[key];
    old = oldAttrs[key];
    if (old !== cur) {
      setAttr(elm, key, cur);
    }
  }
  // #4391: in IE9, setting type can reset value for input[type=radio]
  // #6666: IE/Edge forces progress value down to 1 before setting a max
  /* istanbul ignore if */
  if ((isIE || isEdge) && attrs.value !== oldAttrs.value) {
    setAttr(elm, 'value', attrs.value);
  }
  for (key in oldAttrs) {
    if (isUndef(attrs[key])) {
      if (isXlink(key)) {
        elm.removeAttributeNS(xlinkNS, getXlinkProp(key));
      } else if (!isEnumeratedAttr(key)) {
        elm.removeAttribute(key);
      }
    }
  }
}

function setAttr (el, key, value) {
  if (isBooleanAttr(key)) {
    // set attribute for blank value
    // e.g. <option disabled>Select one</option>
    if (isFalsyAttrValue(value)) {
      el.removeAttribute(key);
    } else {
      // technically allowfullscreen is a boolean attribute for <iframe>,
      // but Flash expects a value of "true" when used on <embed> tag
      value = key === 'allowfullscreen' && el.tagName === 'EMBED'
        ? 'true'
        : key;
      el.setAttribute(key, value);
    }
  } else if (isEnumeratedAttr(key)) {
    el.setAttribute(key, isFalsyAttrValue(value) || value === 'false' ? 'false' : 'true');
  } else if (isXlink(key)) {
    if (isFalsyAttrValue(value)) {
      el.removeAttributeNS(xlinkNS, getXlinkProp(key));
    } else {
      el.setAttributeNS(xlinkNS, key, value);
    }
  } else {
    if (isFalsyAttrValue(value)) {
      el.removeAttribute(key);
    } else {
      // #7138: IE10 & 11 fires input event when setting placeholder on
      // <textarea>... block the first input event and remove the blocker
      // immediately.
      /* istanbul ignore if */
      if (
        isIE && !isIE9 &&
        el.tagName === 'TEXTAREA' &&
        key === 'placeholder' && !el.__ieph
      ) {
        var blocker = function (e) {
          e.stopImmediatePropagation();
          el.removeEventListener('input', blocker);
        };
        el.addEventListener('input', blocker);
        // $flow-disable-line
        el.__ieph = true; /* IE placeholder patched */
      }
      el.setAttribute(key, value);
    }
  }
}

var attrs = {
  create: updateAttrs,
  update: updateAttrs
};

/*  */

function updateClass (oldVnode, vnode) {
  var el = vnode.elm;
  var data = vnode.data;
  var oldData = oldVnode.data;
  if (
    isUndef(data.staticClass) &&
    isUndef(data.class) && (
      isUndef(oldData) || (
        isUndef(oldData.staticClass) &&
        isUndef(oldData.class)
      )
    )
  ) {
    return
  }

  var cls = genClassForVnode(vnode);

  // handle transition classes
  var transitionClass = el._transitionClasses;
  if (isDef(transitionClass)) {
    cls = concat(cls, stringifyClass(transitionClass));
  }

  // set the class
  if (cls !== el._prevClass) {
    el.setAttribute('class', cls);
    el._prevClass = cls;
  }
}

var klass = {
  create: updateClass,
  update: updateClass
};

/*  */

var validDivisionCharRE = /[\w).+\-_$\]]/;

function parseFilters (exp) {
  var inSingle = false;
  var inDouble = false;
  var inTemplateString = false;
  var inRegex = false;
  var curly = 0;
  var square = 0;
  var paren = 0;
  var lastFilterIndex = 0;
  var c, prev, i, expression, filters;

  for (i = 0; i < exp.length; i++) {
    prev = c;
    c = exp.charCodeAt(i);
    if (inSingle) {
      if (c === 0x27 && prev !== 0x5C) { inSingle = false; }
    } else if (inDouble) {
      if (c === 0x22 && prev !== 0x5C) { inDouble = false; }
    } else if (inTemplateString) {
      if (c === 0x60 && prev !== 0x5C) { inTemplateString = false; }
    } else if (inRegex) {
      if (c === 0x2f && prev !== 0x5C) { inRegex = false; }
    } else if (
      c === 0x7C && // pipe
      exp.charCodeAt(i + 1) !== 0x7C &&
      exp.charCodeAt(i - 1) !== 0x7C &&
      !curly && !square && !paren
    ) {
      if (expression === undefined) {
        // first filter, end of expression
        lastFilterIndex = i + 1;
        expression = exp.slice(0, i).trim();
      } else {
        pushFilter();
      }
    } else {
      switch (c) {
        case 0x22: inDouble = true; break         // "
        case 0x27: inSingle = true; break         // '
        case 0x60: inTemplateString = true; break // `
        case 0x28: paren++; break                 // (
        case 0x29: paren--; break                 // )
        case 0x5B: square++; break                // [
        case 0x5D: square--; break                // ]
        case 0x7B: curly++; break                 // {
        case 0x7D: curly--; break                 // }
      }
      if (c === 0x2f) { // /
        var j = i - 1;
        var p = (void 0);
        // find first non-whitespace prev char
        for (; j >= 0; j--) {
          p = exp.charAt(j);
          if (p !== ' ') { break }
        }
        if (!p || !validDivisionCharRE.test(p)) {
          inRegex = true;
        }
      }
    }
  }

  if (expression === undefined) {
    expression = exp.slice(0, i).trim();
  } else if (lastFilterIndex !== 0) {
    pushFilter();
  }

  function pushFilter () {
    (filters || (filters = [])).push(exp.slice(lastFilterIndex, i).trim());
    lastFilterIndex = i + 1;
  }

  if (filters) {
    for (i = 0; i < filters.length; i++) {
      expression = wrapFilter(expression, filters[i]);
    }
  }

  return expression
}

function wrapFilter (exp, filter) {
  var i = filter.indexOf('(');
  if (i < 0) {
    // _f: resolveFilter
    return ("_f(\"" + filter + "\")(" + exp + ")")
  } else {
    var name = filter.slice(0, i);
    var args = filter.slice(i + 1);
    return ("_f(\"" + name + "\")(" + exp + "," + args)
  }
}

/*  */

function baseWarn (msg) {
  console.error(("[Vue compiler]: " + msg));
}

function pluckModuleFunction (
  modules,
  key
) {
  return modules
    ? modules.map(function (m) { return m[key]; }).filter(function (_) { return _; })
    : []
}

function addProp (el, name, value) {
  (el.props || (el.props = [])).push({ name: name, value: value });
}

function addAttr (el, name, value) {
  (el.attrs || (el.attrs = [])).push({ name: name, value: value });
}

function addDirective (
  el,
  name,
  rawName,
  value,
  arg,
  modifiers
) {
  (el.directives || (el.directives = [])).push({ name: name, rawName: rawName, value: value, arg: arg, modifiers: modifiers });
}

function addHandler (
  el,
  name,
  value,
  modifiers,
  important,
  warn
) {
  modifiers = modifiers || emptyObject;
  // warn prevent and passive modifier
  /* istanbul ignore if */
  if (
    "development" !== 'production' && warn &&
    modifiers.prevent && modifiers.passive
  ) {
    warn(
      'passive and prevent can\'t be used together. ' +
      'Passive handler can\'t prevent default event.'
    );
  }

  // check capture modifier
  if (modifiers.capture) {
    delete modifiers.capture;
    name = '!' + name; // mark the event as captured
  }
  if (modifiers.once) {
    delete modifiers.once;
    name = '~' + name; // mark the event as once
  }
  /* istanbul ignore if */
  if (modifiers.passive) {
    delete modifiers.passive;
    name = '&' + name; // mark the event as passive
  }

  // normalize click.right and click.middle since they don't actually fire
  // this is technically browser-specific, but at least for now browsers are
  // the only target envs that have right/middle clicks.
  if (name === 'click') {
    if (modifiers.right) {
      name = 'contextmenu';
      delete modifiers.right;
    } else if (modifiers.middle) {
      name = 'mouseup';
    }
  }

  var events;
  if (modifiers.native) {
    delete modifiers.native;
    events = el.nativeEvents || (el.nativeEvents = {});
  } else {
    events = el.events || (el.events = {});
  }

  var newHandler = { value: value };
  if (modifiers !== emptyObject) {
    newHandler.modifiers = modifiers;
  }

  var handlers = events[name];
  /* istanbul ignore if */
  if (Array.isArray(handlers)) {
    important ? handlers.unshift(newHandler) : handlers.push(newHandler);
  } else if (handlers) {
    events[name] = important ? [newHandler, handlers] : [handlers, newHandler];
  } else {
    events[name] = newHandler;
  }
}

function getBindingAttr (
  el,
  name,
  getStatic
) {
  var dynamicValue =
    getAndRemoveAttr(el, ':' + name) ||
    getAndRemoveAttr(el, 'v-bind:' + name);
  if (dynamicValue != null) {
    return parseFilters(dynamicValue)
  } else if (getStatic !== false) {
    var staticValue = getAndRemoveAttr(el, name);
    if (staticValue != null) {
      return JSON.stringify(staticValue)
    }
  }
}

// note: this only removes the attr from the Array (attrsList) so that it
// doesn't get processed by processAttrs.
// By default it does NOT remove it from the map (attrsMap) because the map is
// needed during codegen.
function getAndRemoveAttr (
  el,
  name,
  removeFromMap
) {
  var val;
  if ((val = el.attrsMap[name]) != null) {
    var list = el.attrsList;
    for (var i = 0, l = list.length; i < l; i++) {
      if (list[i].name === name) {
        list.splice(i, 1);
        break
      }
    }
  }
  if (removeFromMap) {
    delete el.attrsMap[name];
  }
  return val
}

/*  */

/**
 * Cross-platform code generation for component v-model
 */
function genComponentModel (
  el,
  value,
  modifiers
) {
  var ref = modifiers || {};
  var number = ref.number;
  var trim = ref.trim;

  var baseValueExpression = '$$v';
  var valueExpression = baseValueExpression;
  if (trim) {
    valueExpression =
      "(typeof " + baseValueExpression + " === 'string'" +
        "? " + baseValueExpression + ".trim()" +
        ": " + baseValueExpression + ")";
  }
  if (number) {
    valueExpression = "_n(" + valueExpression + ")";
  }
  var assignment = genAssignmentCode(value, valueExpression);

  el.model = {
    value: ("(" + value + ")"),
    expression: ("\"" + value + "\""),
    callback: ("function (" + baseValueExpression + ") {" + assignment + "}")
  };
}

/**
 * Cross-platform codegen helper for generating v-model value assignment code.
 */
function genAssignmentCode (
  value,
  assignment
) {
  var res = parseModel(value);
  if (res.key === null) {
    return (value + "=" + assignment)
  } else {
    return ("$set(" + (res.exp) + ", " + (res.key) + ", " + assignment + ")")
  }
}

/**
 * Parse a v-model expression into a base path and a final key segment.
 * Handles both dot-path and possible square brackets.
 *
 * Possible cases:
 *
 * - test
 * - test[key]
 * - test[test1[key]]
 * - test["a"][key]
 * - xxx.test[a[a].test1[key]]
 * - test.xxx.a["asa"][test1[key]]
 *
 */

var len;
var str;
var chr;
var index$1;
var expressionPos;
var expressionEndPos;



function parseModel (val) {
  len = val.length;

  if (val.indexOf('[') < 0 || val.lastIndexOf(']') < len - 1) {
    index$1 = val.lastIndexOf('.');
    if (index$1 > -1) {
      return {
        exp: val.slice(0, index$1),
        key: '"' + val.slice(index$1 + 1) + '"'
      }
    } else {
      return {
        exp: val,
        key: null
      }
    }
  }

  str = val;
  index$1 = expressionPos = expressionEndPos = 0;

  while (!eof()) {
    chr = next();
    /* istanbul ignore if */
    if (isStringStart(chr)) {
      parseString(chr);
    } else if (chr === 0x5B) {
      parseBracket(chr);
    }
  }

  return {
    exp: val.slice(0, expressionPos),
    key: val.slice(expressionPos + 1, expressionEndPos)
  }
}

function next () {
  return str.charCodeAt(++index$1)
}

function eof () {
  return index$1 >= len
}

function isStringStart (chr) {
  return chr === 0x22 || chr === 0x27
}

function parseBracket (chr) {
  var inBracket = 1;
  expressionPos = index$1;
  while (!eof()) {
    chr = next();
    if (isStringStart(chr)) {
      parseString(chr);
      continue
    }
    if (chr === 0x5B) { inBracket++; }
    if (chr === 0x5D) { inBracket--; }
    if (inBracket === 0) {
      expressionEndPos = index$1;
      break
    }
  }
}

function parseString (chr) {
  var stringQuote = chr;
  while (!eof()) {
    chr = next();
    if (chr === stringQuote) {
      break
    }
  }
}

/*  */

var warn$1;

// in some cases, the event used has to be determined at runtime
// so we used some reserved tokens during compile.
var RANGE_TOKEN = '__r';
var CHECKBOX_RADIO_TOKEN = '__c';

function model (
  el,
  dir,
  _warn
) {
  warn$1 = _warn;
  var value = dir.value;
  var modifiers = dir.modifiers;
  var tag = el.tag;
  var type = el.attrsMap.type;

  {
    // inputs with type="file" are read only and setting the input's
    // value will throw an error.
    if (tag === 'input' && type === 'file') {
      warn$1(
        "<" + (el.tag) + " v-model=\"" + value + "\" type=\"file\">:\n" +
        "File inputs are read only. Use a v-on:change listener instead."
      );
    }
  }

  if (el.component) {
    genComponentModel(el, value, modifiers);
    // component v-model doesn't need extra runtime
    return false
  } else if (tag === 'select') {
    genSelect(el, value, modifiers);
  } else if (tag === 'input' && type === 'checkbox') {
    genCheckboxModel(el, value, modifiers);
  } else if (tag === 'input' && type === 'radio') {
    genRadioModel(el, value, modifiers);
  } else if (tag === 'input' || tag === 'textarea') {
    genDefaultModel(el, value, modifiers);
  } else if (!config.isReservedTag(tag)) {
    genComponentModel(el, value, modifiers);
    // component v-model doesn't need extra runtime
    return false
  } else {
    warn$1(
      "<" + (el.tag) + " v-model=\"" + value + "\">: " +
      "v-model is not supported on this element type. " +
      'If you are working with contenteditable, it\'s recommended to ' +
      'wrap a library dedicated for that purpose inside a custom component.'
    );
  }

  // ensure runtime directive metadata
  return true
}

function genCheckboxModel (
  el,
  value,
  modifiers
) {
  var number = modifiers && modifiers.number;
  var valueBinding = getBindingAttr(el, 'value') || 'null';
  var trueValueBinding = getBindingAttr(el, 'true-value') || 'true';
  var falseValueBinding = getBindingAttr(el, 'false-value') || 'false';
  addProp(el, 'checked',
    "Array.isArray(" + value + ")" +
      "?_i(" + value + "," + valueBinding + ")>-1" + (
        trueValueBinding === 'true'
          ? (":(" + value + ")")
          : (":_q(" + value + "," + trueValueBinding + ")")
      )
  );
  addHandler(el, 'change',
    "var $$a=" + value + "," +
        '$$el=$event.target,' +
        "$$c=$$el.checked?(" + trueValueBinding + "):(" + falseValueBinding + ");" +
    'if(Array.isArray($$a)){' +
      "var $$v=" + (number ? '_n(' + valueBinding + ')' : valueBinding) + "," +
          '$$i=_i($$a,$$v);' +
      "if($$el.checked){$$i<0&&(" + value + "=$$a.concat([$$v]))}" +
      "else{$$i>-1&&(" + value + "=$$a.slice(0,$$i).concat($$a.slice($$i+1)))}" +
    "}else{" + (genAssignmentCode(value, '$$c')) + "}",
    null, true
  );
}

function genRadioModel (
    el,
    value,
    modifiers
) {
  var number = modifiers && modifiers.number;
  var valueBinding = getBindingAttr(el, 'value') || 'null';
  valueBinding = number ? ("_n(" + valueBinding + ")") : valueBinding;
  addProp(el, 'checked', ("_q(" + value + "," + valueBinding + ")"));
  addHandler(el, 'change', genAssignmentCode(value, valueBinding), null, true);
}

function genSelect (
    el,
    value,
    modifiers
) {
  var number = modifiers && modifiers.number;
  var selectedVal = "Array.prototype.filter" +
    ".call($event.target.options,function(o){return o.selected})" +
    ".map(function(o){var val = \"_value\" in o ? o._value : o.value;" +
    "return " + (number ? '_n(val)' : 'val') + "})";

  var assignment = '$event.target.multiple ? $$selectedVal : $$selectedVal[0]';
  var code = "var $$selectedVal = " + selectedVal + ";";
  code = code + " " + (genAssignmentCode(value, assignment));
  addHandler(el, 'change', code, null, true);
}

function genDefaultModel (
  el,
  value,
  modifiers
) {
  var type = el.attrsMap.type;

  // warn if v-bind:value conflicts with v-model
  {
    var value$1 = el.attrsMap['v-bind:value'] || el.attrsMap[':value'];
    if (value$1) {
      var binding = el.attrsMap['v-bind:value'] ? 'v-bind:value' : ':value';
      warn$1(
        binding + "=\"" + value$1 + "\" conflicts with v-model on the same element " +
        'because the latter already expands to a value binding internally'
      );
    }
  }

  var ref = modifiers || {};
  var lazy = ref.lazy;
  var number = ref.number;
  var trim = ref.trim;
  var needCompositionGuard = !lazy && type !== 'range';
  var event = lazy
    ? 'change'
    : type === 'range'
      ? RANGE_TOKEN
      : 'input';

  var valueExpression = '$event.target.value';
  if (trim) {
    valueExpression = "$event.target.value.trim()";
  }
  if (number) {
    valueExpression = "_n(" + valueExpression + ")";
  }

  var code = genAssignmentCode(value, valueExpression);
  if (needCompositionGuard) {
    code = "if($event.target.composing)return;" + code;
  }

  addProp(el, 'value', ("(" + value + ")"));
  addHandler(el, event, code, null, true);
  if (trim || number) {
    addHandler(el, 'blur', '$forceUpdate()');
  }
}

/*  */

// normalize v-model event tokens that can only be determined at runtime.
// it's important to place the event as the first in the array because
// the whole point is ensuring the v-model callback gets called before
// user-attached handlers.
function normalizeEvents (on) {
  /* istanbul ignore if */
  if (isDef(on[RANGE_TOKEN])) {
    // IE input[type=range] only supports `change` event
    var event = isIE ? 'change' : 'input';
    on[event] = [].concat(on[RANGE_TOKEN], on[event] || []);
    delete on[RANGE_TOKEN];
  }
  // This was originally intended to fix #4521 but no longer necessary
  // after 2.5. Keeping it for backwards compat with generated code from < 2.4
  /* istanbul ignore if */
  if (isDef(on[CHECKBOX_RADIO_TOKEN])) {
    on.change = [].concat(on[CHECKBOX_RADIO_TOKEN], on.change || []);
    delete on[CHECKBOX_RADIO_TOKEN];
  }
}

var target$1;

function createOnceHandler (handler, event, capture) {
  var _target = target$1; // save current target element in closure
  return function onceHandler () {
    var res = handler.apply(null, arguments);
    if (res !== null) {
      remove$2(event, onceHandler, capture, _target);
    }
  }
}

function add$1 (
  event,
  handler,
  once$$1,
  capture,
  passive
) {
  handler = withMacroTask(handler);
  if (once$$1) { handler = createOnceHandler(handler, event, capture); }
  target$1.addEventListener(
    event,
    handler,
    supportsPassive
      ? { capture: capture, passive: passive }
      : capture
  );
}

function remove$2 (
  event,
  handler,
  capture,
  _target
) {
  (_target || target$1).removeEventListener(
    event,
    handler._withTask || handler,
    capture
  );
}

function updateDOMListeners (oldVnode, vnode) {
  if (isUndef(oldVnode.data.on) && isUndef(vnode.data.on)) {
    return
  }
  var on = vnode.data.on || {};
  var oldOn = oldVnode.data.on || {};
  target$1 = vnode.elm;
  normalizeEvents(on);
  updateListeners(on, oldOn, add$1, remove$2, vnode.context);
  target$1 = undefined;
}

var events = {
  create: updateDOMListeners,
  update: updateDOMListeners
};

/*  */

function updateDOMProps (oldVnode, vnode) {
  if (isUndef(oldVnode.data.domProps) && isUndef(vnode.data.domProps)) {
    return
  }
  var key, cur;
  var elm = vnode.elm;
  var oldProps = oldVnode.data.domProps || {};
  var props = vnode.data.domProps || {};
  // clone observed objects, as the user probably wants to mutate it
  if (isDef(props.__ob__)) {
    props = vnode.data.domProps = extend({}, props);
  }

  for (key in oldProps) {
    if (isUndef(props[key])) {
      elm[key] = '';
    }
  }
  for (key in props) {
    cur = props[key];
    // ignore children if the node has textContent or innerHTML,
    // as these will throw away existing DOM nodes and cause removal errors
    // on subsequent patches (#3360)
    if (key === 'textContent' || key === 'innerHTML') {
      if (vnode.children) { vnode.children.length = 0; }
      if (cur === oldProps[key]) { continue }
      // #6601 work around Chrome version <= 55 bug where single textNode
      // replaced by innerHTML/textContent retains its parentNode property
      if (elm.childNodes.length === 1) {
        elm.removeChild(elm.childNodes[0]);
      }
    }

    if (key === 'value') {
      // store value as _value as well since
      // non-string values will be stringified
      elm._value = cur;
      // avoid resetting cursor position when value is the same
      var strCur = isUndef(cur) ? '' : String(cur);
      if (shouldUpdateValue(elm, strCur)) {
        elm.value = strCur;
      }
    } else {
      elm[key] = cur;
    }
  }
}

// check platforms/web/util/attrs.js acceptValue


function shouldUpdateValue (elm, checkVal) {
  return (!elm.composing && (
    elm.tagName === 'OPTION' ||
    isDirty(elm, checkVal) ||
    isInputChanged(elm, checkVal)
  ))
}

function isDirty (elm, checkVal) {
  // return true when textbox (.number and .trim) loses focus and its value is
  // not equal to the updated value
  var notInFocus = true;
  // #6157
  // work around IE bug when accessing document.activeElement in an iframe
  try { notInFocus = document.activeElement !== elm; } catch (e) {}
  return notInFocus && elm.value !== checkVal
}

function isInputChanged (elm, newVal) {
  var value = elm.value;
  var modifiers = elm._vModifiers; // injected by v-model runtime
  if (isDef(modifiers) && modifiers.number) {
    return toNumber(value) !== toNumber(newVal)
  }
  if (isDef(modifiers) && modifiers.trim) {
    return value.trim() !== newVal.trim()
  }
  return value !== newVal
}

var domProps = {
  create: updateDOMProps,
  update: updateDOMProps
};

/*  */

var parseStyleText = cached(function (cssText) {
  var res = {};
  var listDelimiter = /;(?![^(]*\))/g;
  var propertyDelimiter = /:(.+)/;
  cssText.split(listDelimiter).forEach(function (item) {
    if (item) {
      var tmp = item.split(propertyDelimiter);
      tmp.length > 1 && (res[tmp[0].trim()] = tmp[1].trim());
    }
  });
  return res
});

// merge static and dynamic style data on the same vnode
function normalizeStyleData (data) {
  var style = normalizeStyleBinding(data.style);
  // static style is pre-processed into an object during compilation
  // and is always a fresh object, so it's safe to merge into it
  return data.staticStyle
    ? extend(data.staticStyle, style)
    : style
}

// normalize possible array / string values into Object
function normalizeStyleBinding (bindingStyle) {
  if (Array.isArray(bindingStyle)) {
    return toObject(bindingStyle)
  }
  if (typeof bindingStyle === 'string') {
    return parseStyleText(bindingStyle)
  }
  return bindingStyle
}

/**
 * parent component style should be after child's
 * so that parent component's style could override it
 */
function getStyle (vnode, checkChild) {
  var res = {};
  var styleData;

  if (checkChild) {
    var childNode = vnode;
    while (childNode.componentInstance) {
      childNode = childNode.componentInstance._vnode;
      if (childNode.data && (styleData = normalizeStyleData(childNode.data))) {
        extend(res, styleData);
      }
    }
  }

  if ((styleData = normalizeStyleData(vnode.data))) {
    extend(res, styleData);
  }

  var parentNode = vnode;
  while ((parentNode = parentNode.parent)) {
    if (parentNode.data && (styleData = normalizeStyleData(parentNode.data))) {
      extend(res, styleData);
    }
  }
  return res
}

/*  */

var cssVarRE = /^--/;
var importantRE = /\s*!important$/;
var setProp = function (el, name, val) {
  /* istanbul ignore if */
  if (cssVarRE.test(name)) {
    el.style.setProperty(name, val);
  } else if (importantRE.test(val)) {
    el.style.setProperty(name, val.replace(importantRE, ''), 'important');
  } else {
    var normalizedName = normalize(name);
    if (Array.isArray(val)) {
      // Support values array created by autoprefixer, e.g.
      // {display: ["-webkit-box", "-ms-flexbox", "flex"]}
      // Set them one by one, and the browser will only set those it can recognize
      for (var i = 0, len = val.length; i < len; i++) {
        el.style[normalizedName] = val[i];
      }
    } else {
      el.style[normalizedName] = val;
    }
  }
};

var vendorNames = ['Webkit', 'Moz', 'ms'];

var emptyStyle;
var normalize = cached(function (prop) {
  emptyStyle = emptyStyle || document.createElement('div').style;
  prop = camelize(prop);
  if (prop !== 'filter' && (prop in emptyStyle)) {
    return prop
  }
  var capName = prop.charAt(0).toUpperCase() + prop.slice(1);
  for (var i = 0; i < vendorNames.length; i++) {
    var name = vendorNames[i] + capName;
    if (name in emptyStyle) {
      return name
    }
  }
});

function updateStyle (oldVnode, vnode) {
  var data = vnode.data;
  var oldData = oldVnode.data;

  if (isUndef(data.staticStyle) && isUndef(data.style) &&
    isUndef(oldData.staticStyle) && isUndef(oldData.style)
  ) {
    return
  }

  var cur, name;
  var el = vnode.elm;
  var oldStaticStyle = oldData.staticStyle;
  var oldStyleBinding = oldData.normalizedStyle || oldData.style || {};

  // if static style exists, stylebinding already merged into it when doing normalizeStyleData
  var oldStyle = oldStaticStyle || oldStyleBinding;

  var style = normalizeStyleBinding(vnode.data.style) || {};

  // store normalized style under a different key for next diff
  // make sure to clone it if it's reactive, since the user likely wants
  // to mutate it.
  vnode.data.normalizedStyle = isDef(style.__ob__)
    ? extend({}, style)
    : style;

  var newStyle = getStyle(vnode, true);

  for (name in oldStyle) {
    if (isUndef(newStyle[name])) {
      setProp(el, name, '');
    }
  }
  for (name in newStyle) {
    cur = newStyle[name];
    if (cur !== oldStyle[name]) {
      // ie9 setting to null has no effect, must use empty string
      setProp(el, name, cur == null ? '' : cur);
    }
  }
}

var style = {
  create: updateStyle,
  update: updateStyle
};

/*  */

/**
 * Add class with compatibility for SVG since classList is not supported on
 * SVG elements in IE
 */
function addClass (el, cls) {
  /* istanbul ignore if */
  if (!cls || !(cls = cls.trim())) {
    return
  }

  /* istanbul ignore else */
  if (el.classList) {
    if (cls.indexOf(' ') > -1) {
      cls.split(/\s+/).forEach(function (c) { return el.classList.add(c); });
    } else {
      el.classList.add(cls);
    }
  } else {
    var cur = " " + (el.getAttribute('class') || '') + " ";
    if (cur.indexOf(' ' + cls + ' ') < 0) {
      el.setAttribute('class', (cur + cls).trim());
    }
  }
}

/**
 * Remove class with compatibility for SVG since classList is not supported on
 * SVG elements in IE
 */
function removeClass (el, cls) {
  /* istanbul ignore if */
  if (!cls || !(cls = cls.trim())) {
    return
  }

  /* istanbul ignore else */
  if (el.classList) {
    if (cls.indexOf(' ') > -1) {
      cls.split(/\s+/).forEach(function (c) { return el.classList.remove(c); });
    } else {
      el.classList.remove(cls);
    }
    if (!el.classList.length) {
      el.removeAttribute('class');
    }
  } else {
    var cur = " " + (el.getAttribute('class') || '') + " ";
    var tar = ' ' + cls + ' ';
    while (cur.indexOf(tar) >= 0) {
      cur = cur.replace(tar, ' ');
    }
    cur = cur.trim();
    if (cur) {
      el.setAttribute('class', cur);
    } else {
      el.removeAttribute('class');
    }
  }
}

/*  */

function resolveTransition (def) {
  if (!def) {
    return
  }
  /* istanbul ignore else */
  if (typeof def === 'object') {
    var res = {};
    if (def.css !== false) {
      extend(res, autoCssTransition(def.name || 'v'));
    }
    extend(res, def);
    return res
  } else if (typeof def === 'string') {
    return autoCssTransition(def)
  }
}

var autoCssTransition = cached(function (name) {
  return {
    enterClass: (name + "-enter"),
    enterToClass: (name + "-enter-to"),
    enterActiveClass: (name + "-enter-active"),
    leaveClass: (name + "-leave"),
    leaveToClass: (name + "-leave-to"),
    leaveActiveClass: (name + "-leave-active")
  }
});

var hasTransition = inBrowser && !isIE9;
var TRANSITION = 'transition';
var ANIMATION = 'animation';

// Transition property/event sniffing
var transitionProp = 'transition';
var transitionEndEvent = 'transitionend';
var animationProp = 'animation';
var animationEndEvent = 'animationend';
if (hasTransition) {
  /* istanbul ignore if */
  if (window.ontransitionend === undefined &&
    window.onwebkittransitionend !== undefined
  ) {
    transitionProp = 'WebkitTransition';
    transitionEndEvent = 'webkitTransitionEnd';
  }
  if (window.onanimationend === undefined &&
    window.onwebkitanimationend !== undefined
  ) {
    animationProp = 'WebkitAnimation';
    animationEndEvent = 'webkitAnimationEnd';
  }
}

// binding to window is necessary to make hot reload work in IE in strict mode
var raf = inBrowser
  ? window.requestAnimationFrame
    ? window.requestAnimationFrame.bind(window)
    : setTimeout
  : /* istanbul ignore next */ function (fn) { return fn(); };

function nextFrame (fn) {
  raf(function () {
    raf(fn);
  });
}

function addTransitionClass (el, cls) {
  var transitionClasses = el._transitionClasses || (el._transitionClasses = []);
  if (transitionClasses.indexOf(cls) < 0) {
    transitionClasses.push(cls);
    addClass(el, cls);
  }
}

function removeTransitionClass (el, cls) {
  if (el._transitionClasses) {
    remove(el._transitionClasses, cls);
  }
  removeClass(el, cls);
}

function whenTransitionEnds (
  el,
  expectedType,
  cb
) {
  var ref = getTransitionInfo(el, expectedType);
  var type = ref.type;
  var timeout = ref.timeout;
  var propCount = ref.propCount;
  if (!type) { return cb() }
  var event = type === TRANSITION ? transitionEndEvent : animationEndEvent;
  var ended = 0;
  var end = function () {
    el.removeEventListener(event, onEnd);
    cb();
  };
  var onEnd = function (e) {
    if (e.target === el) {
      if (++ended >= propCount) {
        end();
      }
    }
  };
  setTimeout(function () {
    if (ended < propCount) {
      end();
    }
  }, timeout + 1);
  el.addEventListener(event, onEnd);
}

var transformRE = /\b(transform|all)(,|$)/;

function getTransitionInfo (el, expectedType) {
  var styles = window.getComputedStyle(el);
  var transitionDelays = styles[transitionProp + 'Delay'].split(', ');
  var transitionDurations = styles[transitionProp + 'Duration'].split(', ');
  var transitionTimeout = getTimeout(transitionDelays, transitionDurations);
  var animationDelays = styles[animationProp + 'Delay'].split(', ');
  var animationDurations = styles[animationProp + 'Duration'].split(', ');
  var animationTimeout = getTimeout(animationDelays, animationDurations);

  var type;
  var timeout = 0;
  var propCount = 0;
  /* istanbul ignore if */
  if (expectedType === TRANSITION) {
    if (transitionTimeout > 0) {
      type = TRANSITION;
      timeout = transitionTimeout;
      propCount = transitionDurations.length;
    }
  } else if (expectedType === ANIMATION) {
    if (animationTimeout > 0) {
      type = ANIMATION;
      timeout = animationTimeout;
      propCount = animationDurations.length;
    }
  } else {
    timeout = Math.max(transitionTimeout, animationTimeout);
    type = timeout > 0
      ? transitionTimeout > animationTimeout
        ? TRANSITION
        : ANIMATION
      : null;
    propCount = type
      ? type === TRANSITION
        ? transitionDurations.length
        : animationDurations.length
      : 0;
  }
  var hasTransform =
    type === TRANSITION &&
    transformRE.test(styles[transitionProp + 'Property']);
  return {
    type: type,
    timeout: timeout,
    propCount: propCount,
    hasTransform: hasTransform
  }
}

function getTimeout (delays, durations) {
  /* istanbul ignore next */
  while (delays.length < durations.length) {
    delays = delays.concat(delays);
  }

  return Math.max.apply(null, durations.map(function (d, i) {
    return toMs(d) + toMs(delays[i])
  }))
}

function toMs (s) {
  return Number(s.slice(0, -1)) * 1000
}

/*  */

function enter (vnode, toggleDisplay) {
  var el = vnode.elm;

  // call leave callback now
  if (isDef(el._leaveCb)) {
    el._leaveCb.cancelled = true;
    el._leaveCb();
  }

  var data = resolveTransition(vnode.data.transition);
  if (isUndef(data)) {
    return
  }

  /* istanbul ignore if */
  if (isDef(el._enterCb) || el.nodeType !== 1) {
    return
  }

  var css = data.css;
  var type = data.type;
  var enterClass = data.enterClass;
  var enterToClass = data.enterToClass;
  var enterActiveClass = data.enterActiveClass;
  var appearClass = data.appearClass;
  var appearToClass = data.appearToClass;
  var appearActiveClass = data.appearActiveClass;
  var beforeEnter = data.beforeEnter;
  var enter = data.enter;
  var afterEnter = data.afterEnter;
  var enterCancelled = data.enterCancelled;
  var beforeAppear = data.beforeAppear;
  var appear = data.appear;
  var afterAppear = data.afterAppear;
  var appearCancelled = data.appearCancelled;
  var duration = data.duration;

  // activeInstance will always be the <transition> component managing this
  // transition. One edge case to check is when the <transition> is placed
  // as the root node of a child component. In that case we need to check
  // <transition>'s parent for appear check.
  var context = activeInstance;
  var transitionNode = activeInstance.$vnode;
  while (transitionNode && transitionNode.parent) {
    transitionNode = transitionNode.parent;
    context = transitionNode.context;
  }

  var isAppear = !context._isMounted || !vnode.isRootInsert;

  if (isAppear && !appear && appear !== '') {
    return
  }

  var startClass = isAppear && appearClass
    ? appearClass
    : enterClass;
  var activeClass = isAppear && appearActiveClass
    ? appearActiveClass
    : enterActiveClass;
  var toClass = isAppear && appearToClass
    ? appearToClass
    : enterToClass;

  var beforeEnterHook = isAppear
    ? (beforeAppear || beforeEnter)
    : beforeEnter;
  var enterHook = isAppear
    ? (typeof appear === 'function' ? appear : enter)
    : enter;
  var afterEnterHook = isAppear
    ? (afterAppear || afterEnter)
    : afterEnter;
  var enterCancelledHook = isAppear
    ? (appearCancelled || enterCancelled)
    : enterCancelled;

  var explicitEnterDuration = toNumber(
    isObject(duration)
      ? duration.enter
      : duration
  );

  if ("development" !== 'production' && explicitEnterDuration != null) {
    checkDuration(explicitEnterDuration, 'enter', vnode);
  }

  var expectsCSS = css !== false && !isIE9;
  var userWantsControl = getHookArgumentsLength(enterHook);

  var cb = el._enterCb = once(function () {
    if (expectsCSS) {
      removeTransitionClass(el, toClass);
      removeTransitionClass(el, activeClass);
    }
    if (cb.cancelled) {
      if (expectsCSS) {
        removeTransitionClass(el, startClass);
      }
      enterCancelledHook && enterCancelledHook(el);
    } else {
      afterEnterHook && afterEnterHook(el);
    }
    el._enterCb = null;
  });

  if (!vnode.data.show) {
    // remove pending leave element on enter by injecting an insert hook
    mergeVNodeHook(vnode, 'insert', function () {
      var parent = el.parentNode;
      var pendingNode = parent && parent._pending && parent._pending[vnode.key];
      if (pendingNode &&
        pendingNode.tag === vnode.tag &&
        pendingNode.elm._leaveCb
      ) {
        pendingNode.elm._leaveCb();
      }
      enterHook && enterHook(el, cb);
    });
  }

  // start enter transition
  beforeEnterHook && beforeEnterHook(el);
  if (expectsCSS) {
    addTransitionClass(el, startClass);
    addTransitionClass(el, activeClass);
    nextFrame(function () {
      addTransitionClass(el, toClass);
      removeTransitionClass(el, startClass);
      if (!cb.cancelled && !userWantsControl) {
        if (isValidDuration(explicitEnterDuration)) {
          setTimeout(cb, explicitEnterDuration);
        } else {
          whenTransitionEnds(el, type, cb);
        }
      }
    });
  }

  if (vnode.data.show) {
    toggleDisplay && toggleDisplay();
    enterHook && enterHook(el, cb);
  }

  if (!expectsCSS && !userWantsControl) {
    cb();
  }
}

function leave (vnode, rm) {
  var el = vnode.elm;

  // call enter callback now
  if (isDef(el._enterCb)) {
    el._enterCb.cancelled = true;
    el._enterCb();
  }

  var data = resolveTransition(vnode.data.transition);
  if (isUndef(data) || el.nodeType !== 1) {
    return rm()
  }

  /* istanbul ignore if */
  if (isDef(el._leaveCb)) {
    return
  }

  var css = data.css;
  var type = data.type;
  var leaveClass = data.leaveClass;
  var leaveToClass = data.leaveToClass;
  var leaveActiveClass = data.leaveActiveClass;
  var beforeLeave = data.beforeLeave;
  var leave = data.leave;
  var afterLeave = data.afterLeave;
  var leaveCancelled = data.leaveCancelled;
  var delayLeave = data.delayLeave;
  var duration = data.duration;

  var expectsCSS = css !== false && !isIE9;
  var userWantsControl = getHookArgumentsLength(leave);

  var explicitLeaveDuration = toNumber(
    isObject(duration)
      ? duration.leave
      : duration
  );

  if ("development" !== 'production' && isDef(explicitLeaveDuration)) {
    checkDuration(explicitLeaveDuration, 'leave', vnode);
  }

  var cb = el._leaveCb = once(function () {
    if (el.parentNode && el.parentNode._pending) {
      el.parentNode._pending[vnode.key] = null;
    }
    if (expectsCSS) {
      removeTransitionClass(el, leaveToClass);
      removeTransitionClass(el, leaveActiveClass);
    }
    if (cb.cancelled) {
      if (expectsCSS) {
        removeTransitionClass(el, leaveClass);
      }
      leaveCancelled && leaveCancelled(el);
    } else {
      rm();
      afterLeave && afterLeave(el);
    }
    el._leaveCb = null;
  });

  if (delayLeave) {
    delayLeave(performLeave);
  } else {
    performLeave();
  }

  function performLeave () {
    // the delayed leave may have already been cancelled
    if (cb.cancelled) {
      return
    }
    // record leaving element
    if (!vnode.data.show) {
      (el.parentNode._pending || (el.parentNode._pending = {}))[(vnode.key)] = vnode;
    }
    beforeLeave && beforeLeave(el);
    if (expectsCSS) {
      addTransitionClass(el, leaveClass);
      addTransitionClass(el, leaveActiveClass);
      nextFrame(function () {
        addTransitionClass(el, leaveToClass);
        removeTransitionClass(el, leaveClass);
        if (!cb.cancelled && !userWantsControl) {
          if (isValidDuration(explicitLeaveDuration)) {
            setTimeout(cb, explicitLeaveDuration);
          } else {
            whenTransitionEnds(el, type, cb);
          }
        }
      });
    }
    leave && leave(el, cb);
    if (!expectsCSS && !userWantsControl) {
      cb();
    }
  }
}

// only used in dev mode
function checkDuration (val, name, vnode) {
  if (typeof val !== 'number') {
    warn(
      "<transition> explicit " + name + " duration is not a valid number - " +
      "got " + (JSON.stringify(val)) + ".",
      vnode.context
    );
  } else if (isNaN(val)) {
    warn(
      "<transition> explicit " + name + " duration is NaN - " +
      'the duration expression might be incorrect.',
      vnode.context
    );
  }
}

function isValidDuration (val) {
  return typeof val === 'number' && !isNaN(val)
}

/**
 * Normalize a transition hook's argument length. The hook may be:
 * - a merged hook (invoker) with the original in .fns
 * - a wrapped component method (check ._length)
 * - a plain function (.length)
 */
function getHookArgumentsLength (fn) {
  if (isUndef(fn)) {
    return false
  }
  var invokerFns = fn.fns;
  if (isDef(invokerFns)) {
    // invoker
    return getHookArgumentsLength(
      Array.isArray(invokerFns)
        ? invokerFns[0]
        : invokerFns
    )
  } else {
    return (fn._length || fn.length) > 1
  }
}

function _enter (_, vnode) {
  if (vnode.data.show !== true) {
    enter(vnode);
  }
}

var transition = inBrowser ? {
  create: _enter,
  activate: _enter,
  remove: function remove$$1 (vnode, rm) {
    /* istanbul ignore else */
    if (vnode.data.show !== true) {
      leave(vnode, rm);
    } else {
      rm();
    }
  }
} : {};

var platformModules = [
  attrs,
  klass,
  events,
  domProps,
  style,
  transition
];

/*  */

// the directive module should be applied last, after all
// built-in modules have been applied.
var modules = platformModules.concat(baseModules);

var patch = createPatchFunction({ nodeOps: nodeOps, modules: modules });

/**
 * Not type checking this file because flow doesn't like attaching
 * properties to Elements.
 */

/* istanbul ignore if */
if (isIE9) {
  // http://www.matts411.com/post/internet-explorer-9-oninput/
  document.addEventListener('selectionchange', function () {
    var el = document.activeElement;
    if (el && el.vmodel) {
      trigger(el, 'input');
    }
  });
}

var directive = {
  inserted: function inserted (el, binding, vnode, oldVnode) {
    if (vnode.tag === 'select') {
      // #6903
      if (oldVnode.elm && !oldVnode.elm._vOptions) {
        mergeVNodeHook(vnode, 'postpatch', function () {
          directive.componentUpdated(el, binding, vnode);
        });
      } else {
        setSelected(el, binding, vnode.context);
      }
      el._vOptions = [].map.call(el.options, getValue);
    } else if (vnode.tag === 'textarea' || isTextInputType(el.type)) {
      el._vModifiers = binding.modifiers;
      if (!binding.modifiers.lazy) {
        // Safari < 10.2 & UIWebView doesn't fire compositionend when
        // switching focus before confirming composition choice
        // this also fixes the issue where some browsers e.g. iOS Chrome
        // fires "change" instead of "input" on autocomplete.
        el.addEventListener('change', onCompositionEnd);
        if (!isAndroid) {
          el.addEventListener('compositionstart', onCompositionStart);
          el.addEventListener('compositionend', onCompositionEnd);
        }
        /* istanbul ignore if */
        if (isIE9) {
          el.vmodel = true;
        }
      }
    }
  },

  componentUpdated: function componentUpdated (el, binding, vnode) {
    if (vnode.tag === 'select') {
      setSelected(el, binding, vnode.context);
      // in case the options rendered by v-for have changed,
      // it's possible that the value is out-of-sync with the rendered options.
      // detect such cases and filter out values that no longer has a matching
      // option in the DOM.
      var prevOptions = el._vOptions;
      var curOptions = el._vOptions = [].map.call(el.options, getValue);
      if (curOptions.some(function (o, i) { return !looseEqual(o, prevOptions[i]); })) {
        // trigger change event if
        // no matching option found for at least one value
        var needReset = el.multiple
          ? binding.value.some(function (v) { return hasNoMatchingOption(v, curOptions); })
          : binding.value !== binding.oldValue && hasNoMatchingOption(binding.value, curOptions);
        if (needReset) {
          trigger(el, 'change');
        }
      }
    }
  }
};

function setSelected (el, binding, vm) {
  actuallySetSelected(el, binding, vm);
  /* istanbul ignore if */
  if (isIE || isEdge) {
    setTimeout(function () {
      actuallySetSelected(el, binding, vm);
    }, 0);
  }
}

function actuallySetSelected (el, binding, vm) {
  var value = binding.value;
  var isMultiple = el.multiple;
  if (isMultiple && !Array.isArray(value)) {
    "development" !== 'production' && warn(
      "<select multiple v-model=\"" + (binding.expression) + "\"> " +
      "expects an Array value for its binding, but got " + (Object.prototype.toString.call(value).slice(8, -1)),
      vm
    );
    return
  }
  var selected, option;
  for (var i = 0, l = el.options.length; i < l; i++) {
    option = el.options[i];
    if (isMultiple) {
      selected = looseIndexOf(value, getValue(option)) > -1;
      if (option.selected !== selected) {
        option.selected = selected;
      }
    } else {
      if (looseEqual(getValue(option), value)) {
        if (el.selectedIndex !== i) {
          el.selectedIndex = i;
        }
        return
      }
    }
  }
  if (!isMultiple) {
    el.selectedIndex = -1;
  }
}

function hasNoMatchingOption (value, options) {
  return options.every(function (o) { return !looseEqual(o, value); })
}

function getValue (option) {
  return '_value' in option
    ? option._value
    : option.value
}

function onCompositionStart (e) {
  e.target.composing = true;
}

function onCompositionEnd (e) {
  // prevent triggering an input event for no reason
  if (!e.target.composing) { return }
  e.target.composing = false;
  trigger(e.target, 'input');
}

function trigger (el, type) {
  var e = document.createEvent('HTMLEvents');
  e.initEvent(type, true, true);
  el.dispatchEvent(e);
}

/*  */

// recursively search for possible transition defined inside the component root
function locateNode (vnode) {
  return vnode.componentInstance && (!vnode.data || !vnode.data.transition)
    ? locateNode(vnode.componentInstance._vnode)
    : vnode
}

var show = {
  bind: function bind (el, ref, vnode) {
    var value = ref.value;

    vnode = locateNode(vnode);
    var transition$$1 = vnode.data && vnode.data.transition;
    var originalDisplay = el.__vOriginalDisplay =
      el.style.display === 'none' ? '' : el.style.display;
    if (value && transition$$1) {
      vnode.data.show = true;
      enter(vnode, function () {
        el.style.display = originalDisplay;
      });
    } else {
      el.style.display = value ? originalDisplay : 'none';
    }
  },

  update: function update (el, ref, vnode) {
    var value = ref.value;
    var oldValue = ref.oldValue;

    /* istanbul ignore if */
    if (value === oldValue) { return }
    vnode = locateNode(vnode);
    var transition$$1 = vnode.data && vnode.data.transition;
    if (transition$$1) {
      vnode.data.show = true;
      if (value) {
        enter(vnode, function () {
          el.style.display = el.__vOriginalDisplay;
        });
      } else {
        leave(vnode, function () {
          el.style.display = 'none';
        });
      }
    } else {
      el.style.display = value ? el.__vOriginalDisplay : 'none';
    }
  },

  unbind: function unbind (
    el,
    binding,
    vnode,
    oldVnode,
    isDestroy
  ) {
    if (!isDestroy) {
      el.style.display = el.__vOriginalDisplay;
    }
  }
};

var platformDirectives = {
  model: directive,
  show: show
};

/*  */

// Provides transition support for a single element/component.
// supports transition mode (out-in / in-out)

var transitionProps = {
  name: String,
  appear: Boolean,
  css: Boolean,
  mode: String,
  type: String,
  enterClass: String,
  leaveClass: String,
  enterToClass: String,
  leaveToClass: String,
  enterActiveClass: String,
  leaveActiveClass: String,
  appearClass: String,
  appearActiveClass: String,
  appearToClass: String,
  duration: [Number, String, Object]
};

// in case the child is also an abstract component, e.g. <keep-alive>
// we want to recursively retrieve the real component to be rendered
function getRealChild (vnode) {
  var compOptions = vnode && vnode.componentOptions;
  if (compOptions && compOptions.Ctor.options.abstract) {
    return getRealChild(getFirstComponentChild(compOptions.children))
  } else {
    return vnode
  }
}

function extractTransitionData (comp) {
  var data = {};
  var options = comp.$options;
  // props
  for (var key in options.propsData) {
    data[key] = comp[key];
  }
  // events.
  // extract listeners and pass them directly to the transition methods
  var listeners = options._parentListeners;
  for (var key$1 in listeners) {
    data[camelize(key$1)] = listeners[key$1];
  }
  return data
}

function placeholder (h, rawChild) {
  if (/\d-keep-alive$/.test(rawChild.tag)) {
    return h('keep-alive', {
      props: rawChild.componentOptions.propsData
    })
  }
}

function hasParentTransition (vnode) {
  while ((vnode = vnode.parent)) {
    if (vnode.data.transition) {
      return true
    }
  }
}

function isSameChild (child, oldChild) {
  return oldChild.key === child.key && oldChild.tag === child.tag
}

var Transition = {
  name: 'transition',
  props: transitionProps,
  abstract: true,

  render: function render (h) {
    var this$1 = this;

    var children = this.$slots.default;
    if (!children) {
      return
    }

    // filter out text nodes (possible whitespaces)
    children = children.filter(function (c) { return c.tag || isAsyncPlaceholder(c); });
    /* istanbul ignore if */
    if (!children.length) {
      return
    }

    // warn multiple elements
    if ("development" !== 'production' && children.length > 1) {
      warn(
        '<transition> can only be used on a single element. Use ' +
        '<transition-group> for lists.',
        this.$parent
      );
    }

    var mode = this.mode;

    // warn invalid mode
    if ("development" !== 'production' &&
      mode && mode !== 'in-out' && mode !== 'out-in'
    ) {
      warn(
        'invalid <transition> mode: ' + mode,
        this.$parent
      );
    }

    var rawChild = children[0];

    // if this is a component root node and the component's
    // parent container node also has transition, skip.
    if (hasParentTransition(this.$vnode)) {
      return rawChild
    }

    // apply transition data to child
    // use getRealChild() to ignore abstract components e.g. keep-alive
    var child = getRealChild(rawChild);
    /* istanbul ignore if */
    if (!child) {
      return rawChild
    }

    if (this._leaving) {
      return placeholder(h, rawChild)
    }

    // ensure a key that is unique to the vnode type and to this transition
    // component instance. This key will be used to remove pending leaving nodes
    // during entering.
    var id = "__transition-" + (this._uid) + "-";
    child.key = child.key == null
      ? child.isComment
        ? id + 'comment'
        : id + child.tag
      : isPrimitive(child.key)
        ? (String(child.key).indexOf(id) === 0 ? child.key : id + child.key)
        : child.key;

    var data = (child.data || (child.data = {})).transition = extractTransitionData(this);
    var oldRawChild = this._vnode;
    var oldChild = getRealChild(oldRawChild);

    // mark v-show
    // so that the transition module can hand over the control to the directive
    if (child.data.directives && child.data.directives.some(function (d) { return d.name === 'show'; })) {
      child.data.show = true;
    }

    if (
      oldChild &&
      oldChild.data &&
      !isSameChild(child, oldChild) &&
      !isAsyncPlaceholder(oldChild) &&
      // #6687 component root is a comment node
      !(oldChild.componentInstance && oldChild.componentInstance._vnode.isComment)
    ) {
      // replace old child transition data with fresh one
      // important for dynamic transitions!
      var oldData = oldChild.data.transition = extend({}, data);
      // handle transition mode
      if (mode === 'out-in') {
        // return placeholder node and queue update when leave finishes
        this._leaving = true;
        mergeVNodeHook(oldData, 'afterLeave', function () {
          this$1._leaving = false;
          this$1.$forceUpdate();
        });
        return placeholder(h, rawChild)
      } else if (mode === 'in-out') {
        if (isAsyncPlaceholder(child)) {
          return oldRawChild
        }
        var delayedLeave;
        var performLeave = function () { delayedLeave(); };
        mergeVNodeHook(data, 'afterEnter', performLeave);
        mergeVNodeHook(data, 'enterCancelled', performLeave);
        mergeVNodeHook(oldData, 'delayLeave', function (leave) { delayedLeave = leave; });
      }
    }

    return rawChild
  }
};

/*  */

// Provides transition support for list items.
// supports move transitions using the FLIP technique.

// Because the vdom's children update algorithm is "unstable" - i.e.
// it doesn't guarantee the relative positioning of removed elements,
// we force transition-group to update its children into two passes:
// in the first pass, we remove all nodes that need to be removed,
// triggering their leaving transition; in the second pass, we insert/move
// into the final desired state. This way in the second pass removed
// nodes will remain where they should be.

var props = extend({
  tag: String,
  moveClass: String
}, transitionProps);

delete props.mode;

var TransitionGroup = {
  props: props,

  render: function render (h) {
    var tag = this.tag || this.$vnode.data.tag || 'span';
    var map = Object.create(null);
    var prevChildren = this.prevChildren = this.children;
    var rawChildren = this.$slots.default || [];
    var children = this.children = [];
    var transitionData = extractTransitionData(this);

    for (var i = 0; i < rawChildren.length; i++) {
      var c = rawChildren[i];
      if (c.tag) {
        if (c.key != null && String(c.key).indexOf('__vlist') !== 0) {
          children.push(c);
          map[c.key] = c
          ;(c.data || (c.data = {})).transition = transitionData;
        } else {
          var opts = c.componentOptions;
          var name = opts ? (opts.Ctor.options.name || opts.tag || '') : c.tag;
          warn(("<transition-group> children must be keyed: <" + name + ">"));
        }
      }
    }

    if (prevChildren) {
      var kept = [];
      var removed = [];
      for (var i$1 = 0; i$1 < prevChildren.length; i$1++) {
        var c$1 = prevChildren[i$1];
        c$1.data.transition = transitionData;
        c$1.data.pos = c$1.elm.getBoundingClientRect();
        if (map[c$1.key]) {
          kept.push(c$1);
        } else {
          removed.push(c$1);
        }
      }
      this.kept = h(tag, null, kept);
      this.removed = removed;
    }

    return h(tag, null, children)
  },

  beforeUpdate: function beforeUpdate () {
    // force removing pass
    this.__patch__(
      this._vnode,
      this.kept,
      false, // hydrating
      true // removeOnly (!important, avoids unnecessary moves)
    );
    this._vnode = this.kept;
  },

  updated: function updated () {
    var children = this.prevChildren;
    var moveClass = this.moveClass || ((this.name || 'v') + '-move');
    if (!children.length || !this.hasMove(children[0].elm, moveClass)) {
      return
    }

    // we divide the work into three loops to avoid mixing DOM reads and writes
    // in each iteration - which helps prevent layout thrashing.
    children.forEach(callPendingCbs);
    children.forEach(recordPosition);
    children.forEach(applyTranslation);

    // force reflow to put everything in position
    // assign to this to avoid being removed in tree-shaking
    // $flow-disable-line
    this._reflow = document.body.offsetHeight;

    children.forEach(function (c) {
      if (c.data.moved) {
        var el = c.elm;
        var s = el.style;
        addTransitionClass(el, moveClass);
        s.transform = s.WebkitTransform = s.transitionDuration = '';
        el.addEventListener(transitionEndEvent, el._moveCb = function cb (e) {
          if (!e || /transform$/.test(e.propertyName)) {
            el.removeEventListener(transitionEndEvent, cb);
            el._moveCb = null;
            removeTransitionClass(el, moveClass);
          }
        });
      }
    });
  },

  methods: {
    hasMove: function hasMove (el, moveClass) {
      /* istanbul ignore if */
      if (!hasTransition) {
        return false
      }
      /* istanbul ignore if */
      if (this._hasMove) {
        return this._hasMove
      }
      // Detect whether an element with the move class applied has
      // CSS transitions. Since the element may be inside an entering
      // transition at this very moment, we make a clone of it and remove
      // all other transition classes applied to ensure only the move class
      // is applied.
      var clone = el.cloneNode();
      if (el._transitionClasses) {
        el._transitionClasses.forEach(function (cls) { removeClass(clone, cls); });
      }
      addClass(clone, moveClass);
      clone.style.display = 'none';
      this.$el.appendChild(clone);
      var info = getTransitionInfo(clone);
      this.$el.removeChild(clone);
      return (this._hasMove = info.hasTransform)
    }
  }
};

function callPendingCbs (c) {
  /* istanbul ignore if */
  if (c.elm._moveCb) {
    c.elm._moveCb();
  }
  /* istanbul ignore if */
  if (c.elm._enterCb) {
    c.elm._enterCb();
  }
}

function recordPosition (c) {
  c.data.newPos = c.elm.getBoundingClientRect();
}

function applyTranslation (c) {
  var oldPos = c.data.pos;
  var newPos = c.data.newPos;
  var dx = oldPos.left - newPos.left;
  var dy = oldPos.top - newPos.top;
  if (dx || dy) {
    c.data.moved = true;
    var s = c.elm.style;
    s.transform = s.WebkitTransform = "translate(" + dx + "px," + dy + "px)";
    s.transitionDuration = '0s';
  }
}

var platformComponents = {
  Transition: Transition,
  TransitionGroup: TransitionGroup
};

/*  */

// install platform specific utils
Vue$3.config.mustUseProp = mustUseProp;
Vue$3.config.isReservedTag = isReservedTag;
Vue$3.config.isReservedAttr = isReservedAttr;
Vue$3.config.getTagNamespace = getTagNamespace;
Vue$3.config.isUnknownElement = isUnknownElement;

// install platform runtime directives & components
extend(Vue$3.options.directives, platformDirectives);
extend(Vue$3.options.components, platformComponents);

// install platform patch function
Vue$3.prototype.__patch__ = inBrowser ? patch : noop;

// public mount method
Vue$3.prototype.$mount = function (
  el,
  hydrating
) {
  el = el && inBrowser ? query(el) : undefined;
  return mountComponent(this, el, hydrating)
};

// devtools global hook
/* istanbul ignore next */
Vue$3.nextTick(function () {
  if (config.devtools) {
    if (devtools) {
      devtools.emit('init', Vue$3);
    } else if ("development" !== 'production' && isChrome) {
      console[console.info ? 'info' : 'log'](
        'Download the Vue Devtools extension for a better development experience:\n' +
        'https://github.com/vuejs/vue-devtools'
      );
    }
  }
  if ("development" !== 'production' &&
    config.productionTip !== false &&
    inBrowser && typeof console !== 'undefined'
  ) {
    console[console.info ? 'info' : 'log'](
      "You are running Vue in development mode.\n" +
      "Make sure to turn on production mode when deploying for production.\n" +
      "See more tips at https://vuejs.org/guide/deployment.html"
    );
  }
}, 0);

/*  */

var defaultTagRE = /\{\{((?:.|\n)+?)\}\}/g;
var regexEscapeRE = /[-.*+?^${}()|[\]\/\\]/g;

var buildRegex = cached(function (delimiters) {
  var open = delimiters[0].replace(regexEscapeRE, '\\$&');
  var close = delimiters[1].replace(regexEscapeRE, '\\$&');
  return new RegExp(open + '((?:.|\\n)+?)' + close, 'g')
});

function parseText (
  text,
  delimiters
) {
  var tagRE = delimiters ? buildRegex(delimiters) : defaultTagRE;
  if (!tagRE.test(text)) {
    return
  }
  var tokens = [];
  var lastIndex = tagRE.lastIndex = 0;
  var match, index;
  while ((match = tagRE.exec(text))) {
    index = match.index;
    // push text token
    if (index > lastIndex) {
      tokens.push(JSON.stringify(text.slice(lastIndex, index)));
    }
    // tag token
    var exp = parseFilters(match[1].trim());
    tokens.push(("_s(" + exp + ")"));
    lastIndex = index + match[0].length;
  }
  if (lastIndex < text.length) {
    tokens.push(JSON.stringify(text.slice(lastIndex)));
  }
  return tokens.join('+')
}

/*  */

function transformNode (el, options) {
  var warn = options.warn || baseWarn;
  var staticClass = getAndRemoveAttr(el, 'class');
  if ("development" !== 'production' && staticClass) {
    var expression = parseText(staticClass, options.delimiters);
    if (expression) {
      warn(
        "class=\"" + staticClass + "\": " +
        'Interpolation inside attributes has been removed. ' +
        'Use v-bind or the colon shorthand instead. For example, ' +
        'instead of <div class="{{ val }}">, use <div :class="val">.'
      );
    }
  }
  if (staticClass) {
    el.staticClass = JSON.stringify(staticClass);
  }
  var classBinding = getBindingAttr(el, 'class', false /* getStatic */);
  if (classBinding) {
    el.classBinding = classBinding;
  }
}

function genData (el) {
  var data = '';
  if (el.staticClass) {
    data += "staticClass:" + (el.staticClass) + ",";
  }
  if (el.classBinding) {
    data += "class:" + (el.classBinding) + ",";
  }
  return data
}

var klass$1 = {
  staticKeys: ['staticClass'],
  transformNode: transformNode,
  genData: genData
};

/*  */

function transformNode$1 (el, options) {
  var warn = options.warn || baseWarn;
  var staticStyle = getAndRemoveAttr(el, 'style');
  if (staticStyle) {
    /* istanbul ignore if */
    {
      var expression = parseText(staticStyle, options.delimiters);
      if (expression) {
        warn(
          "style=\"" + staticStyle + "\": " +
          'Interpolation inside attributes has been removed. ' +
          'Use v-bind or the colon shorthand instead. For example, ' +
          'instead of <div style="{{ val }}">, use <div :style="val">.'
        );
      }
    }
    el.staticStyle = JSON.stringify(parseStyleText(staticStyle));
  }

  var styleBinding = getBindingAttr(el, 'style', false /* getStatic */);
  if (styleBinding) {
    el.styleBinding = styleBinding;
  }
}

function genData$1 (el) {
  var data = '';
  if (el.staticStyle) {
    data += "staticStyle:" + (el.staticStyle) + ",";
  }
  if (el.styleBinding) {
    data += "style:(" + (el.styleBinding) + "),";
  }
  return data
}

var style$1 = {
  staticKeys: ['staticStyle'],
  transformNode: transformNode$1,
  genData: genData$1
};

/*  */

var decoder;

var he = {
  decode: function decode (html) {
    decoder = decoder || document.createElement('div');
    decoder.innerHTML = html;
    return decoder.textContent
  }
};

/*  */

var isUnaryTag = makeMap(
  'area,base,br,col,embed,frame,hr,img,input,isindex,keygen,' +
  'link,meta,param,source,track,wbr'
);

// Elements that you can, intentionally, leave open
// (and which close themselves)
var canBeLeftOpenTag = makeMap(
  'colgroup,dd,dt,li,options,p,td,tfoot,th,thead,tr,source'
);

// HTML5 tags https://html.spec.whatwg.org/multipage/indices.html#elements-3
// Phrasing Content https://html.spec.whatwg.org/multipage/dom.html#phrasing-content
var isNonPhrasingTag = makeMap(
  'address,article,aside,base,blockquote,body,caption,col,colgroup,dd,' +
  'details,dialog,div,dl,dt,fieldset,figcaption,figure,footer,form,' +
  'h1,h2,h3,h4,h5,h6,head,header,hgroup,hr,html,legend,li,menuitem,meta,' +
  'optgroup,option,param,rp,rt,source,style,summary,tbody,td,tfoot,th,thead,' +
  'title,tr,track'
);

/**
 * Not type-checking this file because it's mostly vendor code.
 */

/*!
 * HTML Parser By John Resig (ejohn.org)
 * Modified by Juriy "kangax" Zaytsev
 * Original code by Erik Arvidsson, Mozilla Public License
 * http://erik.eae.net/simplehtmlparser/simplehtmlparser.js
 */

// Regular Expressions for parsing tags and attributes
var attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/;
// could use https://www.w3.org/TR/1999/REC-xml-names-19990114/#NT-QName
// but for Vue templates we can enforce a simple charset
var ncname = '[a-zA-Z_][\\w\\-\\.]*';
var qnameCapture = "((?:" + ncname + "\\:)?" + ncname + ")";
var startTagOpen = new RegExp(("^<" + qnameCapture));
var startTagClose = /^\s*(\/?)>/;
var endTag = new RegExp(("^<\\/" + qnameCapture + "[^>]*>"));
var doctype = /^<!DOCTYPE [^>]+>/i;
var comment = /^<!--/;
var conditionalComment = /^<!\[/;

var IS_REGEX_CAPTURING_BROKEN = false;
'x'.replace(/x(.)?/g, function (m, g) {
  IS_REGEX_CAPTURING_BROKEN = g === '';
});

// Special Elements (can contain anything)
var isPlainTextElement = makeMap('script,style,textarea', true);
var reCache = {};

var decodingMap = {
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&amp;': '&',
  '&#10;': '\n',
  '&#9;': '\t'
};
var encodedAttr = /&(?:lt|gt|quot|amp);/g;
var encodedAttrWithNewLines = /&(?:lt|gt|quot|amp|#10|#9);/g;

// #5992
var isIgnoreNewlineTag = makeMap('pre,textarea', true);
var shouldIgnoreFirstNewline = function (tag, html) { return tag && isIgnoreNewlineTag(tag) && html[0] === '\n'; };

function decodeAttr (value, shouldDecodeNewlines) {
  var re = shouldDecodeNewlines ? encodedAttrWithNewLines : encodedAttr;
  return value.replace(re, function (match) { return decodingMap[match]; })
}

function parseHTML (html, options) {
  var stack = [];
  var expectHTML = options.expectHTML;
  var isUnaryTag$$1 = options.isUnaryTag || no;
  var canBeLeftOpenTag$$1 = options.canBeLeftOpenTag || no;
  var index = 0;
  var last, lastTag;
  while (html) {
    last = html;
    // Make sure we're not in a plaintext content element like script/style
    if (!lastTag || !isPlainTextElement(lastTag)) {
      var textEnd = html.indexOf('<');
      if (textEnd === 0) {
        // Comment:
        if (comment.test(html)) {
          var commentEnd = html.indexOf('-->');

          if (commentEnd >= 0) {
            if (options.shouldKeepComment) {
              options.comment(html.substring(4, commentEnd));
            }
            advance(commentEnd + 3);
            continue
          }
        }

        // http://en.wikipedia.org/wiki/Conditional_comment#Downlevel-revealed_conditional_comment
        if (conditionalComment.test(html)) {
          var conditionalEnd = html.indexOf(']>');

          if (conditionalEnd >= 0) {
            advance(conditionalEnd + 2);
            continue
          }
        }

        // Doctype:
        var doctypeMatch = html.match(doctype);
        if (doctypeMatch) {
          advance(doctypeMatch[0].length);
          continue
        }

        // End tag:
        var endTagMatch = html.match(endTag);
        if (endTagMatch) {
          var curIndex = index;
          advance(endTagMatch[0].length);
          parseEndTag(endTagMatch[1], curIndex, index);
          continue
        }

        // Start tag:
        var startTagMatch = parseStartTag();
        if (startTagMatch) {
          handleStartTag(startTagMatch);
          if (shouldIgnoreFirstNewline(lastTag, html)) {
            advance(1);
          }
          continue
        }
      }

      var text = (void 0), rest = (void 0), next = (void 0);
      if (textEnd >= 0) {
        rest = html.slice(textEnd);
        while (
          !endTag.test(rest) &&
          !startTagOpen.test(rest) &&
          !comment.test(rest) &&
          !conditionalComment.test(rest)
        ) {
          // < in plain text, be forgiving and treat it as text
          next = rest.indexOf('<', 1);
          if (next < 0) { break }
          textEnd += next;
          rest = html.slice(textEnd);
        }
        text = html.substring(0, textEnd);
        advance(textEnd);
      }

      if (textEnd < 0) {
        text = html;
        html = '';
      }

      if (options.chars && text) {
        options.chars(text);
      }
    } else {
      var endTagLength = 0;
      var stackedTag = lastTag.toLowerCase();
      var reStackedTag = reCache[stackedTag] || (reCache[stackedTag] = new RegExp('([\\s\\S]*?)(</' + stackedTag + '[^>]*>)', 'i'));
      var rest$1 = html.replace(reStackedTag, function (all, text, endTag) {
        endTagLength = endTag.length;
        if (!isPlainTextElement(stackedTag) && stackedTag !== 'noscript') {
          text = text
            .replace(/<!--([\s\S]*?)-->/g, '$1')
            .replace(/<!\[CDATA\[([\s\S]*?)]]>/g, '$1');
        }
        if (shouldIgnoreFirstNewline(stackedTag, text)) {
          text = text.slice(1);
        }
        if (options.chars) {
          options.chars(text);
        }
        return ''
      });
      index += html.length - rest$1.length;
      html = rest$1;
      parseEndTag(stackedTag, index - endTagLength, index);
    }

    if (html === last) {
      options.chars && options.chars(html);
      if ("development" !== 'production' && !stack.length && options.warn) {
        options.warn(("Mal-formatted tag at end of template: \"" + html + "\""));
      }
      break
    }
  }

  // Clean up any remaining tags
  parseEndTag();

  function advance (n) {
    index += n;
    html = html.substring(n);
  }

  function parseStartTag () {
    var start = html.match(startTagOpen);
    if (start) {
      var match = {
        tagName: start[1],
        attrs: [],
        start: index
      };
      advance(start[0].length);
      var end, attr;
      while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
        advance(attr[0].length);
        match.attrs.push(attr);
      }
      if (end) {
        match.unarySlash = end[1];
        advance(end[0].length);
        match.end = index;
        return match
      }
    }
  }

  function handleStartTag (match) {
    var tagName = match.tagName;
    var unarySlash = match.unarySlash;

    if (expectHTML) {
      if (lastTag === 'p' && isNonPhrasingTag(tagName)) {
        parseEndTag(lastTag);
      }
      if (canBeLeftOpenTag$$1(tagName) && lastTag === tagName) {
        parseEndTag(tagName);
      }
    }

    var unary = isUnaryTag$$1(tagName) || !!unarySlash;

    var l = match.attrs.length;
    var attrs = new Array(l);
    for (var i = 0; i < l; i++) {
      var args = match.attrs[i];
      // hackish work around FF bug https://bugzilla.mozilla.org/show_bug.cgi?id=369778
      if (IS_REGEX_CAPTURING_BROKEN && args[0].indexOf('""') === -1) {
        if (args[3] === '') { delete args[3]; }
        if (args[4] === '') { delete args[4]; }
        if (args[5] === '') { delete args[5]; }
      }
      var value = args[3] || args[4] || args[5] || '';
      var shouldDecodeNewlines = tagName === 'a' && args[1] === 'href'
        ? options.shouldDecodeNewlinesForHref
        : options.shouldDecodeNewlines;
      attrs[i] = {
        name: args[1],
        value: decodeAttr(value, shouldDecodeNewlines)
      };
    }

    if (!unary) {
      stack.push({ tag: tagName, lowerCasedTag: tagName.toLowerCase(), attrs: attrs });
      lastTag = tagName;
    }

    if (options.start) {
      options.start(tagName, attrs, unary, match.start, match.end);
    }
  }

  function parseEndTag (tagName, start, end) {
    var pos, lowerCasedTagName;
    if (start == null) { start = index; }
    if (end == null) { end = index; }

    if (tagName) {
      lowerCasedTagName = tagName.toLowerCase();
    }

    // Find the closest opened tag of the same type
    if (tagName) {
      for (pos = stack.length - 1; pos >= 0; pos--) {
        if (stack[pos].lowerCasedTag === lowerCasedTagName) {
          break
        }
      }
    } else {
      // If no tag name is provided, clean shop
      pos = 0;
    }

    if (pos >= 0) {
      // Close all the open elements, up the stack
      for (var i = stack.length - 1; i >= pos; i--) {
        if ("development" !== 'production' &&
          (i > pos || !tagName) &&
          options.warn
        ) {
          options.warn(
            ("tag <" + (stack[i].tag) + "> has no matching end tag.")
          );
        }
        if (options.end) {
          options.end(stack[i].tag, start, end);
        }
      }

      // Remove the open elements from the stack
      stack.length = pos;
      lastTag = pos && stack[pos - 1].tag;
    } else if (lowerCasedTagName === 'br') {
      if (options.start) {
        options.start(tagName, [], true, start, end);
      }
    } else if (lowerCasedTagName === 'p') {
      if (options.start) {
        options.start(tagName, [], false, start, end);
      }
      if (options.end) {
        options.end(tagName, start, end);
      }
    }
  }
}

/*  */

var onRE = /^@|^v-on:/;
var dirRE = /^v-|^@|^:/;
var forAliasRE = /(.*?)\s+(?:in|of)\s+(.*)/;
var forIteratorRE = /\((\{[^}]*\}|[^,{]*),([^,]*)(?:,([^,]*))?\)/;
var stripParensRE = /^\(|\)$/g;

var argRE = /:(.*)$/;
var bindRE = /^:|^v-bind:/;
var modifierRE = /\.[^.]+/g;

var decodeHTMLCached = cached(he.decode);

// configurable state
var warn$2;
var delimiters;
var transforms;
var preTransforms;
var postTransforms;
var platformIsPreTag;
var platformMustUseProp;
var platformGetTagNamespace;



function createASTElement (
  tag,
  attrs,
  parent
) {
  return {
    type: 1,
    tag: tag,
    attrsList: attrs,
    attrsMap: makeAttrsMap(attrs),
    parent: parent,
    children: []
  }
}

/**
 * Convert HTML string to AST.
 */
function parse (
  template,
  options
) {
  warn$2 = options.warn || baseWarn;

  platformIsPreTag = options.isPreTag || no;
  platformMustUseProp = options.mustUseProp || no;
  platformGetTagNamespace = options.getTagNamespace || no;

  transforms = pluckModuleFunction(options.modules, 'transformNode');
  preTransforms = pluckModuleFunction(options.modules, 'preTransformNode');
  postTransforms = pluckModuleFunction(options.modules, 'postTransformNode');

  delimiters = options.delimiters;

  var stack = [];
  var preserveWhitespace = options.preserveWhitespace !== false;
  var root;
  var currentParent;
  var inVPre = false;
  var inPre = false;
  var warned = false;

  function warnOnce (msg) {
    if (!warned) {
      warned = true;
      warn$2(msg);
    }
  }

  function endPre (element) {
    // check pre state
    if (element.pre) {
      inVPre = false;
    }
    if (platformIsPreTag(element.tag)) {
      inPre = false;
    }
  }

  parseHTML(template, {
    warn: warn$2,
    expectHTML: options.expectHTML,
    isUnaryTag: options.isUnaryTag,
    canBeLeftOpenTag: options.canBeLeftOpenTag,
    shouldDecodeNewlines: options.shouldDecodeNewlines,
    shouldDecodeNewlinesForHref: options.shouldDecodeNewlinesForHref,
    shouldKeepComment: options.comments,
    start: function start (tag, attrs, unary) {
      // check namespace.
      // inherit parent ns if there is one
      var ns = (currentParent && currentParent.ns) || platformGetTagNamespace(tag);

      // handle IE svg bug
      /* istanbul ignore if */
      if (isIE && ns === 'svg') {
        attrs = guardIESVGBug(attrs);
      }

      var element = createASTElement(tag, attrs, currentParent);
      if (ns) {
        element.ns = ns;
      }

      if (isForbiddenTag(element) && !isServerRendering()) {
        element.forbidden = true;
        "development" !== 'production' && warn$2(
          'Templates should only be responsible for mapping the state to the ' +
          'UI. Avoid placing tags with side-effects in your templates, such as ' +
          "<" + tag + ">" + ', as they will not be parsed.'
        );
      }

      // apply pre-transforms
      for (var i = 0; i < preTransforms.length; i++) {
        element = preTransforms[i](element, options) || element;
      }

      if (!inVPre) {
        processPre(element);
        if (element.pre) {
          inVPre = true;
        }
      }
      if (platformIsPreTag(element.tag)) {
        inPre = true;
      }
      if (inVPre) {
        processRawAttrs(element);
      } else if (!element.processed) {
        // structural directives
        processFor(element);
        processIf(element);
        processOnce(element);
        // element-scope stuff
        processElement(element, options);
      }

      function checkRootConstraints (el) {
        {
          if (el.tag === 'slot' || el.tag === 'template') {
            warnOnce(
              "Cannot use <" + (el.tag) + "> as component root element because it may " +
              'contain multiple nodes.'
            );
          }
          if (el.attrsMap.hasOwnProperty('v-for')) {
            warnOnce(
              'Cannot use v-for on stateful component root element because ' +
              'it renders multiple elements.'
            );
          }
        }
      }

      // tree management
      if (!root) {
        root = element;
        checkRootConstraints(root);
      } else if (!stack.length) {
        // allow root elements with v-if, v-else-if and v-else
        if (root.if && (element.elseif || element.else)) {
          checkRootConstraints(element);
          addIfCondition(root, {
            exp: element.elseif,
            block: element
          });
        } else {
          warnOnce(
            "Component template should contain exactly one root element. " +
            "If you are using v-if on multiple elements, " +
            "use v-else-if to chain them instead."
          );
        }
      }
      if (currentParent && !element.forbidden) {
        if (element.elseif || element.else) {
          processIfConditions(element, currentParent);
        } else if (element.slotScope) { // scoped slot
          currentParent.plain = false;
          var name = element.slotTarget || '"default"';(currentParent.scopedSlots || (currentParent.scopedSlots = {}))[name] = element;
        } else {
          currentParent.children.push(element);
          element.parent = currentParent;
        }
      }
      if (!unary) {
        currentParent = element;
        stack.push(element);
      } else {
        endPre(element);
      }
      // apply post-transforms
      for (var i$1 = 0; i$1 < postTransforms.length; i$1++) {
        postTransforms[i$1](element, options);
      }
    },

    end: function end () {
      // remove trailing whitespace
      var element = stack[stack.length - 1];
      var lastNode = element.children[element.children.length - 1];
      if (lastNode && lastNode.type === 3 && lastNode.text === ' ' && !inPre) {
        element.children.pop();
      }
      // pop stack
      stack.length -= 1;
      currentParent = stack[stack.length - 1];
      endPre(element);
    },

    chars: function chars (text) {
      if (!currentParent) {
        {
          if (text === template) {
            warnOnce(
              'Component template requires a root element, rather than just text.'
            );
          } else if ((text = text.trim())) {
            warnOnce(
              ("text \"" + text + "\" outside root element will be ignored.")
            );
          }
        }
        return
      }
      // IE textarea placeholder bug
      /* istanbul ignore if */
      if (isIE &&
        currentParent.tag === 'textarea' &&
        currentParent.attrsMap.placeholder === text
      ) {
        return
      }
      var children = currentParent.children;
      text = inPre || text.trim()
        ? isTextTag(currentParent) ? text : decodeHTMLCached(text)
        // only preserve whitespace if its not right after a starting tag
        : preserveWhitespace && children.length ? ' ' : '';
      if (text) {
        var expression;
        if (!inVPre && text !== ' ' && (expression = parseText(text, delimiters))) {
          children.push({
            type: 2,
            expression: expression,
            text: text
          });
        } else if (text !== ' ' || !children.length || children[children.length - 1].text !== ' ') {
          children.push({
            type: 3,
            text: text
          });
        }
      }
    },
    comment: function comment (text) {
      currentParent.children.push({
        type: 3,
        text: text,
        isComment: true
      });
    }
  });
  return root
}

function processPre (el) {
  if (getAndRemoveAttr(el, 'v-pre') != null) {
    el.pre = true;
  }
}

function processRawAttrs (el) {
  var l = el.attrsList.length;
  if (l) {
    var attrs = el.attrs = new Array(l);
    for (var i = 0; i < l; i++) {
      attrs[i] = {
        name: el.attrsList[i].name,
        value: JSON.stringify(el.attrsList[i].value)
      };
    }
  } else if (!el.pre) {
    // non root node in pre blocks with no attributes
    el.plain = true;
  }
}

function processElement (element, options) {
  processKey(element);

  // determine whether this is a plain element after
  // removing structural attributes
  element.plain = !element.key && !element.attrsList.length;

  processRef(element);
  processSlot(element);
  processComponent(element);
  for (var i = 0; i < transforms.length; i++) {
    element = transforms[i](element, options) || element;
  }
  processAttrs(element);
}

function processKey (el) {
  var exp = getBindingAttr(el, 'key');
  if (exp) {
    if ("development" !== 'production' && el.tag === 'template') {
      warn$2("<template> cannot be keyed. Place the key on real elements instead.");
    }
    el.key = exp;
  }
}

function processRef (el) {
  var ref = getBindingAttr(el, 'ref');
  if (ref) {
    el.ref = ref;
    el.refInFor = checkInFor(el);
  }
}

function processFor (el) {
  var exp;
  if ((exp = getAndRemoveAttr(el, 'v-for'))) {
    var inMatch = exp.match(forAliasRE);
    if (!inMatch) {
      "development" !== 'production' && warn$2(
        ("Invalid v-for expression: " + exp)
      );
      return
    }
    el.for = inMatch[2].trim();
    var alias = inMatch[1].trim();
    var iteratorMatch = alias.match(forIteratorRE);
    if (iteratorMatch) {
      el.alias = iteratorMatch[1].trim();
      el.iterator1 = iteratorMatch[2].trim();
      if (iteratorMatch[3]) {
        el.iterator2 = iteratorMatch[3].trim();
      }
    } else {
      el.alias = alias.replace(stripParensRE, '');
    }
  }
}

function processIf (el) {
  var exp = getAndRemoveAttr(el, 'v-if');
  if (exp) {
    el.if = exp;
    addIfCondition(el, {
      exp: exp,
      block: el
    });
  } else {
    if (getAndRemoveAttr(el, 'v-else') != null) {
      el.else = true;
    }
    var elseif = getAndRemoveAttr(el, 'v-else-if');
    if (elseif) {
      el.elseif = elseif;
    }
  }
}

function processIfConditions (el, parent) {
  var prev = findPrevElement(parent.children);
  if (prev && prev.if) {
    addIfCondition(prev, {
      exp: el.elseif,
      block: el
    });
  } else {
    warn$2(
      "v-" + (el.elseif ? ('else-if="' + el.elseif + '"') : 'else') + " " +
      "used on element <" + (el.tag) + "> without corresponding v-if."
    );
  }
}

function findPrevElement (children) {
  var i = children.length;
  while (i--) {
    if (children[i].type === 1) {
      return children[i]
    } else {
      if ("development" !== 'production' && children[i].text !== ' ') {
        warn$2(
          "text \"" + (children[i].text.trim()) + "\" between v-if and v-else(-if) " +
          "will be ignored."
        );
      }
      children.pop();
    }
  }
}

function addIfCondition (el, condition) {
  if (!el.ifConditions) {
    el.ifConditions = [];
  }
  el.ifConditions.push(condition);
}

function processOnce (el) {
  var once$$1 = getAndRemoveAttr(el, 'v-once');
  if (once$$1 != null) {
    el.once = true;
  }
}

function processSlot (el) {
  if (el.tag === 'slot') {
    el.slotName = getBindingAttr(el, 'name');
    if ("development" !== 'production' && el.key) {
      warn$2(
        "`key` does not work on <slot> because slots are abstract outlets " +
        "and can possibly expand into multiple elements. " +
        "Use the key on a wrapping element instead."
      );
    }
  } else {
    var slotScope;
    if (el.tag === 'template') {
      slotScope = getAndRemoveAttr(el, 'scope');
      /* istanbul ignore if */
      if ("development" !== 'production' && slotScope) {
        warn$2(
          "the \"scope\" attribute for scoped slots have been deprecated and " +
          "replaced by \"slot-scope\" since 2.5. The new \"slot-scope\" attribute " +
          "can also be used on plain elements in addition to <template> to " +
          "denote scoped slots.",
          true
        );
      }
      el.slotScope = slotScope || getAndRemoveAttr(el, 'slot-scope');
    } else if ((slotScope = getAndRemoveAttr(el, 'slot-scope'))) {
      /* istanbul ignore if */
      if ("development" !== 'production' && el.attrsMap['v-for']) {
        warn$2(
          "Ambiguous combined usage of slot-scope and v-for on <" + (el.tag) + "> " +
          "(v-for takes higher priority). Use a wrapper <template> for the " +
          "scoped slot to make it clearer.",
          true
        );
      }
      el.slotScope = slotScope;
    }
    var slotTarget = getBindingAttr(el, 'slot');
    if (slotTarget) {
      el.slotTarget = slotTarget === '""' ? '"default"' : slotTarget;
      // preserve slot as an attribute for native shadow DOM compat
      // only for non-scoped slots.
      if (el.tag !== 'template' && !el.slotScope) {
        addAttr(el, 'slot', slotTarget);
      }
    }
  }
}

function processComponent (el) {
  var binding;
  if ((binding = getBindingAttr(el, 'is'))) {
    el.component = binding;
  }
  if (getAndRemoveAttr(el, 'inline-template') != null) {
    el.inlineTemplate = true;
  }
}

function processAttrs (el) {
  var list = el.attrsList;
  var i, l, name, rawName, value, modifiers, isProp;
  for (i = 0, l = list.length; i < l; i++) {
    name = rawName = list[i].name;
    value = list[i].value;
    if (dirRE.test(name)) {
      // mark element as dynamic
      el.hasBindings = true;
      // modifiers
      modifiers = parseModifiers(name);
      if (modifiers) {
        name = name.replace(modifierRE, '');
      }
      if (bindRE.test(name)) { // v-bind
        name = name.replace(bindRE, '');
        value = parseFilters(value);
        isProp = false;
        if (modifiers) {
          if (modifiers.prop) {
            isProp = true;
            name = camelize(name);
            if (name === 'innerHtml') { name = 'innerHTML'; }
          }
          if (modifiers.camel) {
            name = camelize(name);
          }
          if (modifiers.sync) {
            addHandler(
              el,
              ("update:" + (camelize(name))),
              genAssignmentCode(value, "$event")
            );
          }
        }
        if (isProp || (
          !el.component && platformMustUseProp(el.tag, el.attrsMap.type, name)
        )) {
          addProp(el, name, value);
        } else {
          addAttr(el, name, value);
        }
      } else if (onRE.test(name)) { // v-on
        name = name.replace(onRE, '');
        addHandler(el, name, value, modifiers, false, warn$2);
      } else { // normal directives
        name = name.replace(dirRE, '');
        // parse arg
        var argMatch = name.match(argRE);
        var arg = argMatch && argMatch[1];
        if (arg) {
          name = name.slice(0, -(arg.length + 1));
        }
        addDirective(el, name, rawName, value, arg, modifiers);
        if ("development" !== 'production' && name === 'model') {
          checkForAliasModel(el, value);
        }
      }
    } else {
      // literal attribute
      {
        var expression = parseText(value, delimiters);
        if (expression) {
          warn$2(
            name + "=\"" + value + "\": " +
            'Interpolation inside attributes has been removed. ' +
            'Use v-bind or the colon shorthand instead. For example, ' +
            'instead of <div id="{{ val }}">, use <div :id="val">.'
          );
        }
      }
      addAttr(el, name, JSON.stringify(value));
      // #6887 firefox doesn't update muted state if set via attribute
      // even immediately after element creation
      if (!el.component &&
          name === 'muted' &&
          platformMustUseProp(el.tag, el.attrsMap.type, name)) {
        addProp(el, name, 'true');
      }
    }
  }
}

function checkInFor (el) {
  var parent = el;
  while (parent) {
    if (parent.for !== undefined) {
      return true
    }
    parent = parent.parent;
  }
  return false
}

function parseModifiers (name) {
  var match = name.match(modifierRE);
  if (match) {
    var ret = {};
    match.forEach(function (m) { ret[m.slice(1)] = true; });
    return ret
  }
}

function makeAttrsMap (attrs) {
  var map = {};
  for (var i = 0, l = attrs.length; i < l; i++) {
    if (
      "development" !== 'production' &&
      map[attrs[i].name] && !isIE && !isEdge
    ) {
      warn$2('duplicate attribute: ' + attrs[i].name);
    }
    map[attrs[i].name] = attrs[i].value;
  }
  return map
}

// for script (e.g. type="x/template") or style, do not decode content
function isTextTag (el) {
  return el.tag === 'script' || el.tag === 'style'
}

function isForbiddenTag (el) {
  return (
    el.tag === 'style' ||
    (el.tag === 'script' && (
      !el.attrsMap.type ||
      el.attrsMap.type === 'text/javascript'
    ))
  )
}

var ieNSBug = /^xmlns:NS\d+/;
var ieNSPrefix = /^NS\d+:/;

/* istanbul ignore next */
function guardIESVGBug (attrs) {
  var res = [];
  for (var i = 0; i < attrs.length; i++) {
    var attr = attrs[i];
    if (!ieNSBug.test(attr.name)) {
      attr.name = attr.name.replace(ieNSPrefix, '');
      res.push(attr);
    }
  }
  return res
}

function checkForAliasModel (el, value) {
  var _el = el;
  while (_el) {
    if (_el.for && _el.alias === value) {
      warn$2(
        "<" + (el.tag) + " v-model=\"" + value + "\">: " +
        "You are binding v-model directly to a v-for iteration alias. " +
        "This will not be able to modify the v-for source array because " +
        "writing to the alias is like modifying a function local variable. " +
        "Consider using an array of objects and use v-model on an object property instead."
      );
    }
    _el = _el.parent;
  }
}

/*  */

/**
 * Expand input[v-model] with dyanmic type bindings into v-if-else chains
 * Turn this:
 *   <input v-model="data[type]" :type="type">
 * into this:
 *   <input v-if="type === 'checkbox'" type="checkbox" v-model="data[type]">
 *   <input v-else-if="type === 'radio'" type="radio" v-model="data[type]">
 *   <input v-else :type="type" v-model="data[type]">
 */

function preTransformNode (el, options) {
  if (el.tag === 'input') {
    var map = el.attrsMap;
    if (map['v-model'] && (map['v-bind:type'] || map[':type'])) {
      var typeBinding = getBindingAttr(el, 'type');
      var ifCondition = getAndRemoveAttr(el, 'v-if', true);
      var ifConditionExtra = ifCondition ? ("&&(" + ifCondition + ")") : "";
      var hasElse = getAndRemoveAttr(el, 'v-else', true) != null;
      var elseIfCondition = getAndRemoveAttr(el, 'v-else-if', true);
      // 1. checkbox
      var branch0 = cloneASTElement(el);
      // process for on the main node
      processFor(branch0);
      addRawAttr(branch0, 'type', 'checkbox');
      processElement(branch0, options);
      branch0.processed = true; // prevent it from double-processed
      branch0.if = "(" + typeBinding + ")==='checkbox'" + ifConditionExtra;
      addIfCondition(branch0, {
        exp: branch0.if,
        block: branch0
      });
      // 2. add radio else-if condition
      var branch1 = cloneASTElement(el);
      getAndRemoveAttr(branch1, 'v-for', true);
      addRawAttr(branch1, 'type', 'radio');
      processElement(branch1, options);
      addIfCondition(branch0, {
        exp: "(" + typeBinding + ")==='radio'" + ifConditionExtra,
        block: branch1
      });
      // 3. other
      var branch2 = cloneASTElement(el);
      getAndRemoveAttr(branch2, 'v-for', true);
      addRawAttr(branch2, ':type', typeBinding);
      processElement(branch2, options);
      addIfCondition(branch0, {
        exp: ifCondition,
        block: branch2
      });

      if (hasElse) {
        branch0.else = true;
      } else if (elseIfCondition) {
        branch0.elseif = elseIfCondition;
      }

      return branch0
    }
  }
}

function cloneASTElement (el) {
  return createASTElement(el.tag, el.attrsList.slice(), el.parent)
}

function addRawAttr (el, name, value) {
  el.attrsMap[name] = value;
  el.attrsList.push({ name: name, value: value });
}

var model$2 = {
  preTransformNode: preTransformNode
};

var modules$1 = [
  klass$1,
  style$1,
  model$2
];

/*  */

function text (el, dir) {
  if (dir.value) {
    addProp(el, 'textContent', ("_s(" + (dir.value) + ")"));
  }
}

/*  */

function html (el, dir) {
  if (dir.value) {
    addProp(el, 'innerHTML', ("_s(" + (dir.value) + ")"));
  }
}

var directives$1 = {
  model: model,
  text: text,
  html: html
};

/*  */

var baseOptions = {
  expectHTML: true,
  modules: modules$1,
  directives: directives$1,
  isPreTag: isPreTag,
  isUnaryTag: isUnaryTag,
  mustUseProp: mustUseProp,
  canBeLeftOpenTag: canBeLeftOpenTag,
  isReservedTag: isReservedTag,
  getTagNamespace: getTagNamespace,
  staticKeys: genStaticKeys(modules$1)
};

/*  */

var isStaticKey;
var isPlatformReservedTag;

var genStaticKeysCached = cached(genStaticKeys$1);

/**
 * Goal of the optimizer: walk the generated template AST tree
 * and detect sub-trees that are purely static, i.e. parts of
 * the DOM that never needs to change.
 *
 * Once we detect these sub-trees, we can:
 *
 * 1. Hoist them into constants, so that we no longer need to
 *    create fresh nodes for them on each re-render;
 * 2. Completely skip them in the patching process.
 */
function optimize (root, options) {
  if (!root) { return }
  isStaticKey = genStaticKeysCached(options.staticKeys || '');
  isPlatformReservedTag = options.isReservedTag || no;
  // first pass: mark all non-static nodes.
  markStatic$1(root);
  // second pass: mark static roots.
  markStaticRoots(root, false);
}

function genStaticKeys$1 (keys) {
  return makeMap(
    'type,tag,attrsList,attrsMap,plain,parent,children,attrs' +
    (keys ? ',' + keys : '')
  )
}

function markStatic$1 (node) {
  node.static = isStatic(node);
  if (node.type === 1) {
    // do not make component slot content static. this avoids
    // 1. components not able to mutate slot nodes
    // 2. static slot content fails for hot-reloading
    if (
      !isPlatformReservedTag(node.tag) &&
      node.tag !== 'slot' &&
      node.attrsMap['inline-template'] == null
    ) {
      return
    }
    for (var i = 0, l = node.children.length; i < l; i++) {
      var child = node.children[i];
      markStatic$1(child);
      if (!child.static) {
        node.static = false;
      }
    }
    if (node.ifConditions) {
      for (var i$1 = 1, l$1 = node.ifConditions.length; i$1 < l$1; i$1++) {
        var block = node.ifConditions[i$1].block;
        markStatic$1(block);
        if (!block.static) {
          node.static = false;
        }
      }
    }
  }
}

function markStaticRoots (node, isInFor) {
  if (node.type === 1) {
    if (node.static || node.once) {
      node.staticInFor = isInFor;
    }
    // For a node to qualify as a static root, it should have children that
    // are not just static text. Otherwise the cost of hoisting out will
    // outweigh the benefits and it's better off to just always render it fresh.
    if (node.static && node.children.length && !(
      node.children.length === 1 &&
      node.children[0].type === 3
    )) {
      node.staticRoot = true;
      return
    } else {
      node.staticRoot = false;
    }
    if (node.children) {
      for (var i = 0, l = node.children.length; i < l; i++) {
        markStaticRoots(node.children[i], isInFor || !!node.for);
      }
    }
    if (node.ifConditions) {
      for (var i$1 = 1, l$1 = node.ifConditions.length; i$1 < l$1; i$1++) {
        markStaticRoots(node.ifConditions[i$1].block, isInFor);
      }
    }
  }
}

function isStatic (node) {
  if (node.type === 2) { // expression
    return false
  }
  if (node.type === 3) { // text
    return true
  }
  return !!(node.pre || (
    !node.hasBindings && // no dynamic bindings
    !node.if && !node.for && // not v-if or v-for or v-else
    !isBuiltInTag(node.tag) && // not a built-in
    isPlatformReservedTag(node.tag) && // not a component
    !isDirectChildOfTemplateFor(node) &&
    Object.keys(node).every(isStaticKey)
  ))
}

function isDirectChildOfTemplateFor (node) {
  while (node.parent) {
    node = node.parent;
    if (node.tag !== 'template') {
      return false
    }
    if (node.for) {
      return true
    }
  }
  return false
}

/*  */

var fnExpRE = /^\s*([\w$_]+|\([^)]*?\))\s*=>|^function\s*\(/;
var simplePathRE = /^\s*[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*|\['.*?']|\[".*?"]|\[\d+]|\[[A-Za-z_$][\w$]*])*\s*$/;

// keyCode aliases
var keyCodes = {
  esc: 27,
  tab: 9,
  enter: 13,
  space: 32,
  up: 38,
  left: 37,
  right: 39,
  down: 40,
  'delete': [8, 46]
};

// #4868: modifiers that prevent the execution of the listener
// need to explicitly return null so that we can determine whether to remove
// the listener for .once
var genGuard = function (condition) { return ("if(" + condition + ")return null;"); };

var modifierCode = {
  stop: '$event.stopPropagation();',
  prevent: '$event.preventDefault();',
  self: genGuard("$event.target !== $event.currentTarget"),
  ctrl: genGuard("!$event.ctrlKey"),
  shift: genGuard("!$event.shiftKey"),
  alt: genGuard("!$event.altKey"),
  meta: genGuard("!$event.metaKey"),
  left: genGuard("'button' in $event && $event.button !== 0"),
  middle: genGuard("'button' in $event && $event.button !== 1"),
  right: genGuard("'button' in $event && $event.button !== 2")
};

function genHandlers (
  events,
  isNative,
  warn
) {
  var res = isNative ? 'nativeOn:{' : 'on:{';
  for (var name in events) {
    res += "\"" + name + "\":" + (genHandler(name, events[name])) + ",";
  }
  return res.slice(0, -1) + '}'
}

function genHandler (
  name,
  handler
) {
  if (!handler) {
    return 'function(){}'
  }

  if (Array.isArray(handler)) {
    return ("[" + (handler.map(function (handler) { return genHandler(name, handler); }).join(',')) + "]")
  }

  var isMethodPath = simplePathRE.test(handler.value);
  var isFunctionExpression = fnExpRE.test(handler.value);

  if (!handler.modifiers) {
    return isMethodPath || isFunctionExpression
      ? handler.value
      : ("function($event){" + (handler.value) + "}") // inline statement
  } else {
    var code = '';
    var genModifierCode = '';
    var keys = [];
    for (var key in handler.modifiers) {
      if (modifierCode[key]) {
        genModifierCode += modifierCode[key];
        // left/right
        if (keyCodes[key]) {
          keys.push(key);
        }
      } else if (key === 'exact') {
        var modifiers = (handler.modifiers);
        genModifierCode += genGuard(
          ['ctrl', 'shift', 'alt', 'meta']
            .filter(function (keyModifier) { return !modifiers[keyModifier]; })
            .map(function (keyModifier) { return ("$event." + keyModifier + "Key"); })
            .join('||')
        );
      } else {
        keys.push(key);
      }
    }
    if (keys.length) {
      code += genKeyFilter(keys);
    }
    // Make sure modifiers like prevent and stop get executed after key filtering
    if (genModifierCode) {
      code += genModifierCode;
    }
    var handlerCode = isMethodPath
      ? handler.value + '($event)'
      : isFunctionExpression
        ? ("(" + (handler.value) + ")($event)")
        : handler.value;
    return ("function($event){" + code + handlerCode + "}")
  }
}

function genKeyFilter (keys) {
  return ("if(!('button' in $event)&&" + (keys.map(genFilterCode).join('&&')) + ")return null;")
}

function genFilterCode (key) {
  var keyVal = parseInt(key, 10);
  if (keyVal) {
    return ("$event.keyCode!==" + keyVal)
  }
  var code = keyCodes[key];
  return (
    "_k($event.keyCode," +
    (JSON.stringify(key)) + "," +
    (JSON.stringify(code)) + "," +
    "$event.key)"
  )
}

/*  */

function on (el, dir) {
  if ("development" !== 'production' && dir.modifiers) {
    warn("v-on without argument does not support modifiers.");
  }
  el.wrapListeners = function (code) { return ("_g(" + code + "," + (dir.value) + ")"); };
}

/*  */

function bind$1 (el, dir) {
  el.wrapData = function (code) {
    return ("_b(" + code + ",'" + (el.tag) + "'," + (dir.value) + "," + (dir.modifiers && dir.modifiers.prop ? 'true' : 'false') + (dir.modifiers && dir.modifiers.sync ? ',true' : '') + ")")
  };
}

/*  */

var baseDirectives = {
  on: on,
  bind: bind$1,
  cloak: noop
};

/*  */

var CodegenState = function CodegenState (options) {
  this.options = options;
  this.warn = options.warn || baseWarn;
  this.transforms = pluckModuleFunction(options.modules, 'transformCode');
  this.dataGenFns = pluckModuleFunction(options.modules, 'genData');
  this.directives = extend(extend({}, baseDirectives), options.directives);
  var isReservedTag = options.isReservedTag || no;
  this.maybeComponent = function (el) { return !isReservedTag(el.tag); };
  this.onceId = 0;
  this.staticRenderFns = [];
};



function generate (
  ast,
  options
) {
  var state = new CodegenState(options);
  var code = ast ? genElement(ast, state) : '_c("div")';
  return {
    render: ("with(this){return " + code + "}"),
    staticRenderFns: state.staticRenderFns
  }
}

function genElement (el, state) {
  if (el.staticRoot && !el.staticProcessed) {
    return genStatic(el, state)
  } else if (el.once && !el.onceProcessed) {
    return genOnce(el, state)
  } else if (el.for && !el.forProcessed) {
    return genFor(el, state)
  } else if (el.if && !el.ifProcessed) {
    return genIf(el, state)
  } else if (el.tag === 'template' && !el.slotTarget) {
    return genChildren(el, state) || 'void 0'
  } else if (el.tag === 'slot') {
    return genSlot(el, state)
  } else {
    // component or element
    var code;
    if (el.component) {
      code = genComponent(el.component, el, state);
    } else {
      var data = el.plain ? undefined : genData$2(el, state);

      var children = el.inlineTemplate ? null : genChildren(el, state, true);
      code = "_c('" + (el.tag) + "'" + (data ? ("," + data) : '') + (children ? ("," + children) : '') + ")";
    }
    // module transforms
    for (var i = 0; i < state.transforms.length; i++) {
      code = state.transforms[i](el, code);
    }
    return code
  }
}

// hoist static sub-trees out
function genStatic (el, state, once$$1) {
  el.staticProcessed = true;
  state.staticRenderFns.push(("with(this){return " + (genElement(el, state)) + "}"));
  return ("_m(" + (state.staticRenderFns.length - 1) + "," + (el.staticInFor ? 'true' : 'false') + "," + (once$$1 ? 'true' : 'false') + ")")
}

// v-once
function genOnce (el, state) {
  el.onceProcessed = true;
  if (el.if && !el.ifProcessed) {
    return genIf(el, state)
  } else if (el.staticInFor) {
    var key = '';
    var parent = el.parent;
    while (parent) {
      if (parent.for) {
        key = parent.key;
        break
      }
      parent = parent.parent;
    }
    if (!key) {
      "development" !== 'production' && state.warn(
        "v-once can only be used inside v-for that is keyed. "
      );
      return genElement(el, state)
    }
    return ("_o(" + (genElement(el, state)) + "," + (state.onceId++) + "," + key + ")")
  } else {
    return genStatic(el, state, true)
  }
}

function genIf (
  el,
  state,
  altGen,
  altEmpty
) {
  el.ifProcessed = true; // avoid recursion
  return genIfConditions(el.ifConditions.slice(), state, altGen, altEmpty)
}

function genIfConditions (
  conditions,
  state,
  altGen,
  altEmpty
) {
  if (!conditions.length) {
    return altEmpty || '_e()'
  }

  var condition = conditions.shift();
  if (condition.exp) {
    return ("(" + (condition.exp) + ")?" + (genTernaryExp(condition.block)) + ":" + (genIfConditions(conditions, state, altGen, altEmpty)))
  } else {
    return ("" + (genTernaryExp(condition.block)))
  }

  // v-if with v-once should generate code like (a)?_m(0):_m(1)
  function genTernaryExp (el) {
    return altGen
      ? altGen(el, state)
      : el.once
        ? genOnce(el, state)
        : genElement(el, state)
  }
}

function genFor (
  el,
  state,
  altGen,
  altHelper
) {
  var exp = el.for;
  var alias = el.alias;
  var iterator1 = el.iterator1 ? ("," + (el.iterator1)) : '';
  var iterator2 = el.iterator2 ? ("," + (el.iterator2)) : '';

  if ("development" !== 'production' &&
    state.maybeComponent(el) &&
    el.tag !== 'slot' &&
    el.tag !== 'template' &&
    !el.key
  ) {
    state.warn(
      "<" + (el.tag) + " v-for=\"" + alias + " in " + exp + "\">: component lists rendered with " +
      "v-for should have explicit keys. " +
      "See https://vuejs.org/guide/list.html#key for more info.",
      true /* tip */
    );
  }

  el.forProcessed = true; // avoid recursion
  return (altHelper || '_l') + "((" + exp + ")," +
    "function(" + alias + iterator1 + iterator2 + "){" +
      "return " + ((altGen || genElement)(el, state)) +
    '})'
}

function genData$2 (el, state) {
  var data = '{';

  // directives first.
  // directives may mutate the el's other properties before they are generated.
  var dirs = genDirectives(el, state);
  if (dirs) { data += dirs + ','; }

  // key
  if (el.key) {
    data += "key:" + (el.key) + ",";
  }
  // ref
  if (el.ref) {
    data += "ref:" + (el.ref) + ",";
  }
  if (el.refInFor) {
    data += "refInFor:true,";
  }
  // pre
  if (el.pre) {
    data += "pre:true,";
  }
  // record original tag name for components using "is" attribute
  if (el.component) {
    data += "tag:\"" + (el.tag) + "\",";
  }
  // module data generation functions
  for (var i = 0; i < state.dataGenFns.length; i++) {
    data += state.dataGenFns[i](el);
  }
  // attributes
  if (el.attrs) {
    data += "attrs:{" + (genProps(el.attrs)) + "},";
  }
  // DOM props
  if (el.props) {
    data += "domProps:{" + (genProps(el.props)) + "},";
  }
  // event handlers
  if (el.events) {
    data += (genHandlers(el.events, false, state.warn)) + ",";
  }
  if (el.nativeEvents) {
    data += (genHandlers(el.nativeEvents, true, state.warn)) + ",";
  }
  // slot target
  // only for non-scoped slots
  if (el.slotTarget && !el.slotScope) {
    data += "slot:" + (el.slotTarget) + ",";
  }
  // scoped slots
  if (el.scopedSlots) {
    data += (genScopedSlots(el.scopedSlots, state)) + ",";
  }
  // component v-model
  if (el.model) {
    data += "model:{value:" + (el.model.value) + ",callback:" + (el.model.callback) + ",expression:" + (el.model.expression) + "},";
  }
  // inline-template
  if (el.inlineTemplate) {
    var inlineTemplate = genInlineTemplate(el, state);
    if (inlineTemplate) {
      data += inlineTemplate + ",";
    }
  }
  data = data.replace(/,$/, '') + '}';
  // v-bind data wrap
  if (el.wrapData) {
    data = el.wrapData(data);
  }
  // v-on data wrap
  if (el.wrapListeners) {
    data = el.wrapListeners(data);
  }
  return data
}

function genDirectives (el, state) {
  var dirs = el.directives;
  if (!dirs) { return }
  var res = 'directives:[';
  var hasRuntime = false;
  var i, l, dir, needRuntime;
  for (i = 0, l = dirs.length; i < l; i++) {
    dir = dirs[i];
    needRuntime = true;
    var gen = state.directives[dir.name];
    if (gen) {
      // compile-time directive that manipulates AST.
      // returns true if it also needs a runtime counterpart.
      needRuntime = !!gen(el, dir, state.warn);
    }
    if (needRuntime) {
      hasRuntime = true;
      res += "{name:\"" + (dir.name) + "\",rawName:\"" + (dir.rawName) + "\"" + (dir.value ? (",value:(" + (dir.value) + "),expression:" + (JSON.stringify(dir.value))) : '') + (dir.arg ? (",arg:\"" + (dir.arg) + "\"") : '') + (dir.modifiers ? (",modifiers:" + (JSON.stringify(dir.modifiers))) : '') + "},";
    }
  }
  if (hasRuntime) {
    return res.slice(0, -1) + ']'
  }
}

function genInlineTemplate (el, state) {
  var ast = el.children[0];
  if ("development" !== 'production' && (
    el.children.length !== 1 || ast.type !== 1
  )) {
    state.warn('Inline-template components must have exactly one child element.');
  }
  if (ast.type === 1) {
    var inlineRenderFns = generate(ast, state.options);
    return ("inlineTemplate:{render:function(){" + (inlineRenderFns.render) + "},staticRenderFns:[" + (inlineRenderFns.staticRenderFns.map(function (code) { return ("function(){" + code + "}"); }).join(',')) + "]}")
  }
}

function genScopedSlots (
  slots,
  state
) {
  return ("scopedSlots:_u([" + (Object.keys(slots).map(function (key) {
      return genScopedSlot(key, slots[key], state)
    }).join(',')) + "])")
}

function genScopedSlot (
  key,
  el,
  state
) {
  if (el.for && !el.forProcessed) {
    return genForScopedSlot(key, el, state)
  }
  var fn = "function(" + (String(el.slotScope)) + "){" +
    "return " + (el.tag === 'template'
      ? el.if
        ? ((el.if) + "?" + (genChildren(el, state) || 'undefined') + ":undefined")
        : genChildren(el, state) || 'undefined'
      : genElement(el, state)) + "}";
  return ("{key:" + key + ",fn:" + fn + "}")
}

function genForScopedSlot (
  key,
  el,
  state
) {
  var exp = el.for;
  var alias = el.alias;
  var iterator1 = el.iterator1 ? ("," + (el.iterator1)) : '';
  var iterator2 = el.iterator2 ? ("," + (el.iterator2)) : '';
  el.forProcessed = true; // avoid recursion
  return "_l((" + exp + ")," +
    "function(" + alias + iterator1 + iterator2 + "){" +
      "return " + (genScopedSlot(key, el, state)) +
    '})'
}

function genChildren (
  el,
  state,
  checkSkip,
  altGenElement,
  altGenNode
) {
  var children = el.children;
  if (children.length) {
    var el$1 = children[0];
    // optimize single v-for
    if (children.length === 1 &&
      el$1.for &&
      el$1.tag !== 'template' &&
      el$1.tag !== 'slot'
    ) {
      return (altGenElement || genElement)(el$1, state)
    }
    var normalizationType = checkSkip
      ? getNormalizationType(children, state.maybeComponent)
      : 0;
    var gen = altGenNode || genNode;
    return ("[" + (children.map(function (c) { return gen(c, state); }).join(',')) + "]" + (normalizationType ? ("," + normalizationType) : ''))
  }
}

// determine the normalization needed for the children array.
// 0: no normalization needed
// 1: simple normalization needed (possible 1-level deep nested array)
// 2: full normalization needed
function getNormalizationType (
  children,
  maybeComponent
) {
  var res = 0;
  for (var i = 0; i < children.length; i++) {
    var el = children[i];
    if (el.type !== 1) {
      continue
    }
    if (needsNormalization(el) ||
        (el.ifConditions && el.ifConditions.some(function (c) { return needsNormalization(c.block); }))) {
      res = 2;
      break
    }
    if (maybeComponent(el) ||
        (el.ifConditions && el.ifConditions.some(function (c) { return maybeComponent(c.block); }))) {
      res = 1;
    }
  }
  return res
}

function needsNormalization (el) {
  return el.for !== undefined || el.tag === 'template' || el.tag === 'slot'
}

function genNode (node, state) {
  if (node.type === 1) {
    return genElement(node, state)
  } if (node.type === 3 && node.isComment) {
    return genComment(node)
  } else {
    return genText(node)
  }
}

function genText (text) {
  return ("_v(" + (text.type === 2
    ? text.expression // no need for () because already wrapped in _s()
    : transformSpecialNewlines(JSON.stringify(text.text))) + ")")
}

function genComment (comment) {
  return ("_e(" + (JSON.stringify(comment.text)) + ")")
}

function genSlot (el, state) {
  var slotName = el.slotName || '"default"';
  var children = genChildren(el, state);
  var res = "_t(" + slotName + (children ? ("," + children) : '');
  var attrs = el.attrs && ("{" + (el.attrs.map(function (a) { return ((camelize(a.name)) + ":" + (a.value)); }).join(',')) + "}");
  var bind$$1 = el.attrsMap['v-bind'];
  if ((attrs || bind$$1) && !children) {
    res += ",null";
  }
  if (attrs) {
    res += "," + attrs;
  }
  if (bind$$1) {
    res += (attrs ? '' : ',null') + "," + bind$$1;
  }
  return res + ')'
}

// componentName is el.component, take it as argument to shun flow's pessimistic refinement
function genComponent (
  componentName,
  el,
  state
) {
  var children = el.inlineTemplate ? null : genChildren(el, state, true);
  return ("_c(" + componentName + "," + (genData$2(el, state)) + (children ? ("," + children) : '') + ")")
}

function genProps (props) {
  var res = '';
  for (var i = 0; i < props.length; i++) {
    var prop = props[i];
    res += "\"" + (prop.name) + "\":" + (transformSpecialNewlines(prop.value)) + ",";
  }
  return res.slice(0, -1)
}

// #3895, #4268
function transformSpecialNewlines (text) {
  return text
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029')
}

/*  */

// these keywords should not appear inside expressions, but operators like
// typeof, instanceof and in are allowed
var prohibitedKeywordRE = new RegExp('\\b' + (
  'do,if,for,let,new,try,var,case,else,with,await,break,catch,class,const,' +
  'super,throw,while,yield,delete,export,import,return,switch,default,' +
  'extends,finally,continue,debugger,function,arguments'
).split(',').join('\\b|\\b') + '\\b');

// these unary operators should not be used as property/method names
var unaryOperatorsRE = new RegExp('\\b' + (
  'delete,typeof,void'
).split(',').join('\\s*\\([^\\)]*\\)|\\b') + '\\s*\\([^\\)]*\\)');

// strip strings in expressions
var stripStringRE = /'(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|`(?:[^`\\]|\\.)*\$\{|\}(?:[^`\\]|\\.)*`|`(?:[^`\\]|\\.)*`/g;

// detect problematic expressions in a template
function detectErrors (ast) {
  var errors = [];
  if (ast) {
    checkNode(ast, errors);
  }
  return errors
}

function checkNode (node, errors) {
  if (node.type === 1) {
    for (var name in node.attrsMap) {
      if (dirRE.test(name)) {
        var value = node.attrsMap[name];
        if (value) {
          if (name === 'v-for') {
            checkFor(node, ("v-for=\"" + value + "\""), errors);
          } else if (onRE.test(name)) {
            checkEvent(value, (name + "=\"" + value + "\""), errors);
          } else {
            checkExpression(value, (name + "=\"" + value + "\""), errors);
          }
        }
      }
    }
    if (node.children) {
      for (var i = 0; i < node.children.length; i++) {
        checkNode(node.children[i], errors);
      }
    }
  } else if (node.type === 2) {
    checkExpression(node.expression, node.text, errors);
  }
}

function checkEvent (exp, text, errors) {
  var stipped = exp.replace(stripStringRE, '');
  var keywordMatch = stipped.match(unaryOperatorsRE);
  if (keywordMatch && stipped.charAt(keywordMatch.index - 1) !== '$') {
    errors.push(
      "avoid using JavaScript unary operator as property name: " +
      "\"" + (keywordMatch[0]) + "\" in expression " + (text.trim())
    );
  }
  checkExpression(exp, text, errors);
}

function checkFor (node, text, errors) {
  checkExpression(node.for || '', text, errors);
  checkIdentifier(node.alias, 'v-for alias', text, errors);
  checkIdentifier(node.iterator1, 'v-for iterator', text, errors);
  checkIdentifier(node.iterator2, 'v-for iterator', text, errors);
}

function checkIdentifier (
  ident,
  type,
  text,
  errors
) {
  if (typeof ident === 'string') {
    try {
      new Function(("var " + ident + "=_"));
    } catch (e) {
      errors.push(("invalid " + type + " \"" + ident + "\" in expression: " + (text.trim())));
    }
  }
}

function checkExpression (exp, text, errors) {
  try {
    new Function(("return " + exp));
  } catch (e) {
    var keywordMatch = exp.replace(stripStringRE, '').match(prohibitedKeywordRE);
    if (keywordMatch) {
      errors.push(
        "avoid using JavaScript keyword as property name: " +
        "\"" + (keywordMatch[0]) + "\"\n  Raw expression: " + (text.trim())
      );
    } else {
      errors.push(
        "invalid expression: " + (e.message) + " in\n\n" +
        "    " + exp + "\n\n" +
        "  Raw expression: " + (text.trim()) + "\n"
      );
    }
  }
}

/*  */

function createFunction (code, errors) {
  try {
    return new Function(code)
  } catch (err) {
    errors.push({ err: err, code: code });
    return noop
  }
}

function createCompileToFunctionFn (compile) {
  var cache = Object.create(null);

  return function compileToFunctions (
    template,
    options,
    vm
  ) {
    options = extend({}, options);
    var warn$$1 = options.warn || warn;
    delete options.warn;

    /* istanbul ignore if */
    {
      // detect possible CSP restriction
      try {
        new Function('return 1');
      } catch (e) {
        if (e.toString().match(/unsafe-eval|CSP/)) {
          warn$$1(
            'It seems you are using the standalone build of Vue.js in an ' +
            'environment with Content Security Policy that prohibits unsafe-eval. ' +
            'The template compiler cannot work in this environment. Consider ' +
            'relaxing the policy to allow unsafe-eval or pre-compiling your ' +
            'templates into render functions.'
          );
        }
      }
    }

    // check cache
    var key = options.delimiters
      ? String(options.delimiters) + template
      : template;
    if (cache[key]) {
      return cache[key]
    }

    // compile
    var compiled = compile(template, options);

    // check compilation errors/tips
    {
      if (compiled.errors && compiled.errors.length) {
        warn$$1(
          "Error compiling template:\n\n" + template + "\n\n" +
          compiled.errors.map(function (e) { return ("- " + e); }).join('\n') + '\n',
          vm
        );
      }
      if (compiled.tips && compiled.tips.length) {
        compiled.tips.forEach(function (msg) { return tip(msg, vm); });
      }
    }

    // turn code into functions
    var res = {};
    var fnGenErrors = [];
    res.render = createFunction(compiled.render, fnGenErrors);
    res.staticRenderFns = compiled.staticRenderFns.map(function (code) {
      return createFunction(code, fnGenErrors)
    });

    // check function generation errors.
    // this should only happen if there is a bug in the compiler itself.
    // mostly for codegen development use
    /* istanbul ignore if */
    {
      if ((!compiled.errors || !compiled.errors.length) && fnGenErrors.length) {
        warn$$1(
          "Failed to generate render function:\n\n" +
          fnGenErrors.map(function (ref) {
            var err = ref.err;
            var code = ref.code;

            return ((err.toString()) + " in\n\n" + code + "\n");
        }).join('\n'),
          vm
        );
      }
    }

    return (cache[key] = res)
  }
}

/*  */

function createCompilerCreator (baseCompile) {
  return function createCompiler (baseOptions) {
    function compile (
      template,
      options
    ) {
      var finalOptions = Object.create(baseOptions);
      var errors = [];
      var tips = [];
      finalOptions.warn = function (msg, tip) {
        (tip ? tips : errors).push(msg);
      };

      if (options) {
        // merge custom modules
        if (options.modules) {
          finalOptions.modules =
            (baseOptions.modules || []).concat(options.modules);
        }
        // merge custom directives
        if (options.directives) {
          finalOptions.directives = extend(
            Object.create(baseOptions.directives),
            options.directives
          );
        }
        // copy other options
        for (var key in options) {
          if (key !== 'modules' && key !== 'directives') {
            finalOptions[key] = options[key];
          }
        }
      }

      var compiled = baseCompile(template, finalOptions);
      {
        errors.push.apply(errors, detectErrors(compiled.ast));
      }
      compiled.errors = errors;
      compiled.tips = tips;
      return compiled
    }

    return {
      compile: compile,
      compileToFunctions: createCompileToFunctionFn(compile)
    }
  }
}

/*  */

// `createCompilerCreator` allows creating compilers that use alternative
// parser/optimizer/codegen, e.g the SSR optimizing compiler.
// Here we just export a default compiler using the default parts.
var createCompiler = createCompilerCreator(function baseCompile (
  template,
  options
) {
  var ast = parse(template.trim(), options);
  optimize(ast, options);
  var code = generate(ast, options);
  return {
    ast: ast,
    render: code.render,
    staticRenderFns: code.staticRenderFns
  }
});

/*  */

var ref$1 = createCompiler(baseOptions);
var compileToFunctions = ref$1.compileToFunctions;

/*  */

// check whether current browser encodes a char inside attribute values
var div;
function getShouldDecode (href) {
  div = div || document.createElement('div');
  div.innerHTML = href ? "<a href=\"\n\"/>" : "<div a=\"\n\"/>";
  return div.innerHTML.indexOf('&#10;') > 0
}

// #3663: IE encodes newlines inside attribute values while other browsers don't
var shouldDecodeNewlines = inBrowser ? getShouldDecode(false) : false;
// #6828: chrome encodes content in a[href]
var shouldDecodeNewlinesForHref = inBrowser ? getShouldDecode(true) : false;

/*  */

var idToTemplate = cached(function (id) {
  var el = query(id);
  return el && el.innerHTML
});

var mount = Vue$3.prototype.$mount;
Vue$3.prototype.$mount = function (
  el,
  hydrating
) {
  el = el && query(el);

  /* istanbul ignore if */
  if (el === document.body || el === document.documentElement) {
    "development" !== 'production' && warn(
      "Do not mount Vue to <html> or <body> - mount to normal elements instead."
    );
    return this
  }

  var options = this.$options;
  // resolve template/el and convert to render function
  if (!options.render) {
    var template = options.template;
    if (template) {
      if (typeof template === 'string') {
        if (template.charAt(0) === '#') {
          template = idToTemplate(template);
          /* istanbul ignore if */
          if ("development" !== 'production' && !template) {
            warn(
              ("Template element not found or is empty: " + (options.template)),
              this
            );
          }
        }
      } else if (template.nodeType) {
        template = template.innerHTML;
      } else {
        {
          warn('invalid template option:' + template, this);
        }
        return this
      }
    } else if (el) {
      template = getOuterHTML(el);
    }
    if (template) {
      /* istanbul ignore if */
      if ("development" !== 'production' && config.performance && mark) {
        mark('compile');
      }

      var ref = compileToFunctions(template, {
        shouldDecodeNewlines: shouldDecodeNewlines,
        shouldDecodeNewlinesForHref: shouldDecodeNewlinesForHref,
        delimiters: options.delimiters,
        comments: options.comments
      }, this);
      var render = ref.render;
      var staticRenderFns = ref.staticRenderFns;
      options.render = render;
      options.staticRenderFns = staticRenderFns;

      /* istanbul ignore if */
      if ("development" !== 'production' && config.performance && mark) {
        mark('compile end');
        measure(("vue " + (this._name) + " compile"), 'compile', 'compile end');
      }
    }
  }
  return mount.call(this, el, hydrating)
};

/**
 * Get outerHTML of elements, taking care
 * of SVG elements in IE as well.
 */
function getOuterHTML (el) {
  if (el.outerHTML) {
    return el.outerHTML
  } else {
    var container = document.createElement('div');
    container.appendChild(el.cloneNode(true));
    return container.innerHTML
  }
}

Vue$3.compile = compileToFunctions;

return Vue$3;

})));

/**
  * vue-router v3.0.1
  * (c) 2017 Evan You
  * @license MIT
  */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.VueRouter = factory());
}(this, (function () { 'use strict';

/*  */

function assert (condition, message) {
  if (!condition) {
    throw new Error(("[vue-router] " + message))
  }
}

function warn (condition, message) {
  if ("development" !== 'production' && !condition) {
    typeof console !== 'undefined' && console.warn(("[vue-router] " + message));
  }
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
      {
        warn(
          false,
          "props in \"" + (route.path) + "\" is a " + (typeof config) + ", " +
          "expecting an object, function or boolean."
        );
      }
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
    "development" !== 'production' && warn(false, e.message);
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
    {
      warn(false, ("missing param for " + routeMsg + ": " + (e.message)));
    }
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
  {
    assert(path != null, "\"path\" is required in a route configuration.");
    assert(
      typeof route.component !== 'string',
      "route config \"component\" for path: " + (String(path || name)) + " cannot be a " +
      "string id. Use an actual component instead."
    );
  }

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
    {
      if (route.name && !route.redirect && route.children.some(function (child) { return /^\/?$/.test(child.path); })) {
        warn(
          false,
          "Named Route '" + (route.name) + "' has a default child route. " +
          "When navigating to this named route (:to=\"{name: '" + (route.name) + "'\"), " +
          "the default child route will not be rendered. Remove the name from " +
          "this route and use the name of the default child route for named " +
          "links instead."
        );
      }
    }
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
    } else if ("development" !== 'production' && !matchAs) {
      warn(
        false,
        "Duplicate named routes definition: " +
        "{ name: \"" + name + "\", path: \"" + (record.path) + "\" }"
      );
    }
  }
}

function compileRouteRegex (path, pathToRegexpOptions) {
  var regex = pathToRegexp_1(path, [], pathToRegexpOptions);
  {
    var keys = Object.create(null);
    regex.keys.forEach(function (key) {
      warn(!keys[key.name], ("Duplicate param keys in route with path: \"" + path + "\""));
      keys[key.name] = true;
    });
  }
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
    next = assign({}, next);
    next._normalized = true;
    var params = assign(assign({}, current.params), next.params);
    if (current.name) {
      next.name = current.name;
      next.params = params;
    } else if (current.matched.length) {
      var rawPath = current.matched[current.matched.length - 1].path;
      next.path = fillParams(rawPath, params, ("path " + (current.path)));
    } else {
      warn(false, "relative params navigation requires a current route.");
    }
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

function assign (a, b) {
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
      {
        warn(record, ("Route with name '" + name + "' does not exist"));
      }
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
      {
        warn(
          false, ("invalid redirect option: " + (JSON.stringify(redirect)))
        );
      }
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
      {
        assert(targetRecord, ("redirect failed: named route \"" + name + "\" not found."));
      }
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
      {
        warn(false, ("invalid redirect option: " + (JSON.stringify(redirect))));
      }
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

  {
    assert(typeof behavior === 'function', "scrollBehavior must be a function");
  }

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
        {
          assert(false, err.toString());
        }
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
          "development" !== 'production' && warn(false, msg);
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
      {
        assert(false, ("invalid mode: " + mode));
      }
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

  "development" !== 'production' && assert(
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

return VueRouter;

})));

!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t(require("vue")):"function"==typeof define&&define.amd?define("ELEMENT",["vue"],t):"object"==typeof exports?exports.ELEMENT=t(require("vue")):e.ELEMENT=t(e.Vue)}(this,function(e){return function(e){function t(n){if(i[n])return i[n].exports;var s=i[n]={i:n,l:!1,exports:{}};return e[n].call(s.exports,s,s.exports,t),s.l=!0,s.exports}var i={};return t.m=e,t.c=i,t.d=function(e,i,n){t.o(e,i)||Object.defineProperty(e,i,{configurable:!1,enumerable:!0,get:n})},t.n=function(e){var i=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(i,"a",i),i},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p="/dist/",t(t.s=90)}([function(e,t){e.exports=function(e,t,i,n,s,r){var a,o=e=e||{},l=typeof e.default;"object"!==l&&"function"!==l||(a=e,o=e.default);var u="function"==typeof o?o.options:o;t&&(u.render=t.render,u.staticRenderFns=t.staticRenderFns,u._compiled=!0),i&&(u.functional=!0),s&&(u._scopeId=s);var c;if(r?(c=function(e){e=e||this.$vnode&&this.$vnode.ssrContext||this.parent&&this.parent.$vnode&&this.parent.$vnode.ssrContext,e||"undefined"==typeof __VUE_SSR_CONTEXT__||(e=__VUE_SSR_CONTEXT__),n&&n.call(this,e),e&&e._registeredComponents&&e._registeredComponents.add(r)},u._ssrRegister=c):n&&(c=n),c){var d=u.functional,h=d?u.render:u.beforeCreate;d?(u._injectStyles=c,u.render=function(e,t){return c.call(t),h(e,t)}):u.beforeCreate=h?[].concat(h,c):[c]}return{esModule:a,exports:o,options:u}}},function(e,t,i){"use strict";function n(e,t,i){this.$children.forEach(function(s){s.$options.componentName===e?s.$emit.apply(s,[t].concat(i)):n.apply(s,[e,t].concat([i]))})}t.__esModule=!0,t.default={methods:{dispatch:function(e,t,i){for(var n=this.$parent||this.$root,s=n.$options.componentName;n&&(!s||s!==e);)(n=n.$parent)&&(s=n.$options.componentName);n&&n.$emit.apply(n,[t].concat(i))},broadcast:function(e,t,i){n.call(this,e,t,i)}}}},function(t,i){t.exports=e},function(e,t,i){"use strict";function n(){for(var e=arguments.length,t=Array(e),i=0;i<e;i++)t[i]=arguments[i];var n=1,s=t[0],r=t.length;if("function"==typeof s)return s.apply(null,t.slice(1));if("string"==typeof s){for(var a=String(s).replace(v,function(e){if("%%"===e)return"%";if(n>=r)return e;switch(e){case"%s":return String(t[n++]);case"%d":return Number(t[n++]);case"%j":try{return JSON.stringify(t[n++])}catch(e){return"[Circular]"}break;default:return e}}),o=t[n];n<r;o=t[++n])a+=" "+o;return a}return s}function s(e){return"string"===e||"url"===e||"hex"===e||"email"===e||"pattern"===e}function r(e,t){return void 0===e||null===e||(!("array"!==t||!Array.isArray(e)||e.length)||!(!s(t)||"string"!=typeof e||e))}function a(e,t,i){function n(e){s.push.apply(s,e),++r===a&&i(s)}var s=[],r=0,a=e.length;e.forEach(function(e){t(e,n)})}function o(e,t,i){function n(a){if(a&&a.length)return void i(a);var o=s;s+=1,o<r?t(e[o],n):i([])}var s=0,r=e.length;n([])}function l(e){var t=[];return Object.keys(e).forEach(function(i){t.push.apply(t,e[i])}),t}function u(e,t,i,n){if(t.first){return o(l(e),i,n)}var s=t.firstFields||[];!0===s&&(s=Object.keys(e));var r=Object.keys(e),u=r.length,c=0,d=[],h=function(e){d.push.apply(d,e),++c===u&&n(d)};r.forEach(function(t){var n=e[t];-1!==s.indexOf(t)?o(n,i,h):a(n,i,h)})}function c(e){return function(t){return t&&t.message?(t.field=t.field||e.fullField,t):{message:t,field:t.field||e.fullField}}}function d(e,t){if(t)for(var i in t)if(t.hasOwnProperty(i)){var n=t[i];"object"===(void 0===n?"undefined":m()(n))&&"object"===m()(e[i])?e[i]=f()({},e[i],n):e[i]=n}return e}i.d(t,"f",function(){return g}),t.d=n,t.e=r,t.a=u,t.b=c,t.c=d;var h=i(74),f=i.n(h),p=i(41),m=i.n(p),v=/%[sdj%]/g,g=function(){}},function(e,t,i){"use strict";function n(e,t){if(!e||!t)return!1;if(-1!==t.indexOf(" "))throw new Error("className should not contain space.");return e.classList?e.classList.contains(t):(" "+e.className+" ").indexOf(" "+t+" ")>-1}function s(e,t){if(e){for(var i=e.className,s=(t||"").split(" "),r=0,a=s.length;r<a;r++){var o=s[r];o&&(e.classList?e.classList.add(o):n(e,o)&&(i+=" "+o))}e.classList||(e.className=i)}}function r(e,t){if(e&&t){for(var i=t.split(" "),s=" "+e.className+" ",r=0,a=i.length;r<a;r++){var o=i[r];o&&(e.classList?e.classList.remove(o):n(e,o)&&(s=s.replace(" "+o+" "," ")))}e.classList||(e.className=p(s))}}function a(e,t,i){if(e&&t)if("object"===(void 0===t?"undefined":o(t)))for(var n in t)t.hasOwnProperty(n)&&a(e,n,t[n]);else t=m(t),"opacity"===t&&f<9?e.style.filter=isNaN(i)?"":"alpha(opacity="+100*i+")":e.style[t]=i}t.__esModule=!0,t.getStyle=t.once=t.off=t.on=void 0;var o="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e};t.hasClass=n,t.addClass=s,t.removeClass=r,t.setStyle=a;var l=i(2),u=function(e){return e&&e.__esModule?e:{default:e}}(l),c=u.default.prototype.$isServer,d=/([\:\-\_]+(.))/g,h=/^moz([A-Z])/,f=c?0:Number(document.documentMode),p=function(e){return(e||"").replace(/^[\s\uFEFF]+|[\s\uFEFF]+$/g,"")},m=function(e){return e.replace(d,function(e,t,i,n){return n?i.toUpperCase():i}).replace(h,"Moz$1")},v=t.on=function(){return!c&&document.addEventListener?function(e,t,i){e&&t&&i&&e.addEventListener(t,i,!1)}:function(e,t,i){e&&t&&i&&e.attachEvent("on"+t,i)}}(),g=t.off=function(){return!c&&document.removeEventListener?function(e,t,i){e&&t&&e.removeEventListener(t,i,!1)}:function(e,t,i){e&&t&&e.detachEvent("on"+t,i)}}();t.once=function(e,t,i){v(e,t,function n(){i&&i.apply(this,arguments),g(e,t,n)})},t.getStyle=f<9?function(e,t){if(!c){if(!e||!t)return null;t=m(t),"float"===t&&(t="styleFloat");try{switch(t){case"opacity":try{return e.filters.item("alpha").opacity/100}catch(e){return 1}default:return e.style[t]||e.currentStyle?e.currentStyle[t]:null}}catch(i){return e.style[t]}}}:function(e,t){if(!c){if(!e||!t)return null;t=m(t),"float"===t&&(t="cssFloat");try{var i=document.defaultView.getComputedStyle(e,"");return e.style[t]||i?i[t]:null}catch(i){return e.style[t]}}}},function(e,t,i){"use strict";t.__esModule=!0;var n=i(16);t.default={methods:{t:function(){for(var e=arguments.length,t=Array(e),i=0;i<e;i++)t[i]=arguments[i];return n.t.apply(this,t)}}}},function(e,t,i){"use strict";function n(){}function s(e,t){return l.call(e,t)}function r(e,t){for(var i in t)e[i]=t[i];return e}function a(e){for(var t={},i=0;i<e.length;i++)e[i]&&r(t,e[i]);return t}function o(e,t,i){var n=e;t=t.replace(/\[(\w+)\]/g,".$1"),t=t.replace(/^\./,"");for(var s=t.split("."),r=0,a=s.length;r<a-1&&(n||i);++r){var o=s[r];if(!(o in n)){if(i)throw new Error("please transfer a valid prop path to form item!");break}n=n[o]}return{o:n,k:s[r],v:n?n[s[r]]:null}}t.__esModule=!0,t.noop=n,t.hasOwn=s,t.toObject=a,t.getPropByPath=o;var l=Object.prototype.hasOwnProperty;t.getValueByPath=function(e,t){t=t||"";for(var i=t.split("."),n=e,s=null,r=0,a=i.length;r<a;r++){var o=i[r];if(!n)break;if(r===a-1){s=n[o];break}n=n[o]}return s},t.generateId=function(){return Math.floor(1e4*Math.random())},t.valueEquals=function(e,t){if(e===t)return!0;if(!(e instanceof Array))return!1;if(!(t instanceof Array))return!1;if(e.length!==t.length)return!1;for(var i=0;i!==e.length;++i)if(e[i]!==t[i])return!1;return!0}},function(e,t,i){"use strict";var n=i(85),s=i(312),r=i(313),a=i(314),o=i(315),l=i(316);t.a={required:n.a,whitespace:s.a,type:r.a,range:a.a,enum:o.a,pattern:l.a}},function(e,t,i){"use strict";t.__esModule=!0;var n=i(102),s=function(e){return e&&e.__esModule?e:{default:e}}(n);s.default.install=function(e){e.component(s.default.name,s.default)},t.default=s.default},function(e,t,i){"use strict";t.__esModule=!0,t.default={mounted:function(){return},methods:{getMigratingConfig:function(){return{props:{},events:{}}}}}},function(e,t,i){"use strict";t.__esModule=!0;var n=i(2),s=function(e){return e&&e.__esModule?e:{default:e}}(n),r=i(21),a=s.default.prototype.$isServer?function(){}:i(109),o=function(e){return e.stopPropagation()};t.default={props:{placement:{type:String,default:"bottom"},boundariesPadding:{type:Number,default:5},reference:{},popper:{},offset:{default:0},value:Boolean,visibleArrow:Boolean,transition:String,appendToBody:{type:Boolean,default:!0},popperOptions:{type:Object,default:function(){return{gpuAcceleration:!1}}}},data:function(){return{showPopper:!1,currentPlacement:""}},watch:{value:{immediate:!0,handler:function(e){this.showPopper=e,this.$emit("input",e)}},showPopper:function(e){e?this.updatePopper():this.destroyPopper(),this.$emit("input",e)}},methods:{createPopper:function(){var e=this;if(!this.$isServer&&(this.currentPlacement=this.currentPlacement||this.placement,/^(top|bottom|left|right)(-start|-end)?$/g.test(this.currentPlacement))){var t=this.popperOptions,i=this.popperElm=this.popperElm||this.popper||this.$refs.popper,n=this.referenceElm=this.referenceElm||this.reference||this.$refs.reference;!n&&this.$slots.reference&&this.$slots.reference[0]&&(n=this.referenceElm=this.$slots.reference[0].elm),i&&n&&(this.visibleArrow&&this.appendArrow(i),this.appendToBody&&document.body.appendChild(this.popperElm),this.popperJS&&this.popperJS.destroy&&this.popperJS.destroy(),t.placement=this.currentPlacement,t.offset=this.offset,this.popperJS=new a(n,i,t),this.popperJS.onCreate(function(t){e.$emit("created",e),e.resetTransformOrigin(),e.$nextTick(e.updatePopper)}),"function"==typeof t.onUpdate&&this.popperJS.onUpdate(t.onUpdate),this.popperJS._popper.style.zIndex=r.PopupManager.nextZIndex(),this.popperElm.addEventListener("click",o))}},updatePopper:function(){this.popperJS?this.popperJS.update():this.createPopper()},doDestroy:function(){!this.showPopper&&this.popperJS&&(this.popperJS.destroy(),this.popperJS=null)},destroyPopper:function(){this.popperJS&&this.resetTransformOrigin()},resetTransformOrigin:function(){var e={top:"bottom",bottom:"top",left:"right",right:"left"},t=this.popperJS._popper.getAttribute("x-placement").split("-")[0],i=e[t];this.popperJS._popper.style.transformOrigin=["top","bottom"].indexOf(t)>-1?"center "+i:i+" center"},appendArrow:function(e){var t=void 0;if(!this.appended){this.appended=!0;for(var i in e.attributes)if(/^_v-/.test(e.attributes[i].name)){t=e.attributes[i].name;break}var n=document.createElement("div");t&&n.setAttribute(t,""),n.setAttribute("x-arrow",""),n.className="popper__arrow",e.appendChild(n)}}},beforeDestroy:function(){this.doDestroy(),this.popperElm&&this.popperElm.parentNode===document.body&&(this.popperElm.removeEventListener("click",o),document.body.removeChild(this.popperElm))},deactivated:function(){this.$options.beforeDestroy[0].call(this)}}},function(e,t,i){"use strict";t.__esModule=!0,t.nextYear=t.prevYear=t.nextMonth=t.prevMonth=t.timeWithinRange=t.limitTimeRange=t.clearMilliseconds=t.clearTime=t.modifyTime=t.modifyDate=t.range=t.getRangeHours=t.getWeekNumber=t.getStartDateOfMonth=t.nextDate=t.prevDate=t.getFirstDayOfMonth=t.getDayCountOfYear=t.getDayCountOfMonth=t.parseDate=t.formatDate=t.isDateObject=t.isDate=t.toDate=void 0;var n=i(220),s=function(e){return e&&e.__esModule?e:{default:e}}(n),r=i(16),a=["sun","mon","tue","wed","thu","fri","sat"],o=["jan","feb","mar","apr","may","jun","jul","aug","sep","oct","nov","dec"],l=function(){return{dayNamesShort:a.map(function(e){return(0,r.t)("el.datepicker.weeks."+e)}),dayNames:a.map(function(e){return(0,r.t)("el.datepicker.weeks."+e)}),monthNamesShort:o.map(function(e){return(0,r.t)("el.datepicker.months."+e)}),monthNames:o.map(function(e,t){return(0,r.t)("el.datepicker.month"+(t+1))}),amPm:["am","pm"]}},u=function(e,t){for(var i=[],n=e;n<=t;n++)i.push(n);return i},c=t.toDate=function(e){return d(e)?new Date(e):null},d=t.isDate=function(e){return null!==e&&void 0!==e&&!isNaN(new Date(e).getTime())},h=(t.isDateObject=function(e){return e instanceof Date},t.formatDate=function(e,t){return e=c(e),e?s.default.format(e,t||"yyyy-MM-dd",l()):""},t.parseDate=function(e,t){return s.default.parse(e,t||"yyyy-MM-dd",l())},t.getDayCountOfMonth=function(e,t){return 3===t||5===t||8===t||10===t?30:1===t?e%4==0&&e%100!=0||e%400==0?29:28:31}),f=(t.getDayCountOfYear=function(e){return e%400==0||e%100!=0&&e%4==0?366:365},t.getFirstDayOfMonth=function(e){var t=new Date(e.getTime());return t.setDate(1),t.getDay()},t.prevDate=function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:1;return new Date(e.getFullYear(),e.getMonth(),e.getDate()-t)}),p=(t.nextDate=function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:1;return new Date(e.getFullYear(),e.getMonth(),e.getDate()+t)},t.getStartDateOfMonth=function(e,t){var i=new Date(e,t,1),n=i.getDay();return 0===n?f(i,7):f(i,n)},t.getWeekNumber=function(e){var t=new Date(e.getTime());t.setHours(0,0,0,0),t.setDate(t.getDate()+3-(t.getDay()+6)%7);var i=new Date(t.getFullYear(),0,4);return 1+Math.round(((t.getTime()-i.getTime())/864e5-3+(i.getDay()+6)%7)/7)},t.getRangeHours=function(e){var t=[],i=[];if((e||[]).forEach(function(e){var t=e.map(function(e){return e.getHours()});i=i.concat(u(t[0],t[1]))}),i.length)for(var n=0;n<24;n++)t[n]=-1===i.indexOf(n);else for(var s=0;s<24;s++)t[s]=!1;return t},t.range=function(e){return Array.apply(null,{length:e}).map(function(e,t){return t})},t.modifyDate=function(e,t,i,n){return new Date(t,i,n,e.getHours(),e.getMinutes(),e.getSeconds(),e.getMilliseconds())}),m=(t.modifyTime=function(e,t,i,n){return new Date(e.getFullYear(),e.getMonth(),e.getDate(),t,i,n,e.getMilliseconds())},t.clearTime=function(e){return new Date(e.getFullYear(),e.getMonth(),e.getDate())},t.clearMilliseconds=function(e){return new Date(e.getFullYear(),e.getMonth(),e.getDate(),e.getHours(),e.getMinutes(),e.getSeconds(),0)},t.limitTimeRange=function(e,t){var i=arguments.length>2&&void 0!==arguments[2]?arguments[2]:"HH:mm:ss";if(0===t.length)return e;var n=function(e){return s.default.parse(s.default.format(e,i),i)},r=n(e),a=t.map(function(e){return e.map(n)});if(a.some(function(e){return r>=e[0]&&r<=e[1]}))return e;var o=a[0][0],l=a[0][0];return a.forEach(function(e){o=new Date(Math.min(e[0],o)),l=new Date(Math.max(e[1],o))}),p(r<o?o:l,e.getFullYear(),e.getMonth(),e.getDate())});t.timeWithinRange=function(e,t,i){return m(e,t,i).getTime()===e.getTime()},t.prevMonth=function(e){var t=e.getFullYear(),i=e.getMonth();0===i?(t-=1,i=11):i-=1;var n=Math.min(e.getDate(),h(t,i));return p(e,t,i,n)},t.nextMonth=function(e){var t=e.getFullYear(),i=e.getMonth();11===i?(t+=1,i=0):i+=1;var n=Math.min(e.getDate(),h(t,i));return p(e,t,i,n)},t.prevYear=function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:1,i=e.getFullYear()-t,n=e.getMonth(),s=Math.min(e.getDate(),h(i,n));return p(e,i,n,s)},t.nextYear=function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:1,i=e.getFullYear()+t,n=e.getMonth(),s=Math.min(e.getDate(),h(i,n));return p(e,i,n,s)}},function(e,t,i){"use strict";t.__esModule=!0,t.default=function(e){for(var t=1,i=arguments.length;t<i;t++){var n=arguments[t]||{};for(var s in n)if(n.hasOwnProperty(s)){var r=n[s];void 0!==r&&(e[s]=r)}}return e}},function(e,t,i){var n=i(43);e.exports=function(e,t,i){return void 0===i?n(e,t,!1):n(e,i,!1!==t)}},function(e,t,i){"use strict";t.__esModule=!0;var n=i(184),s=function(e){return e&&e.__esModule?e:{default:e}}(n);s.default.install=function(e){e.component(s.default.name,s.default)},t.default=s.default},function(e,t){var i=e.exports="undefined"!=typeof window&&window.Math==Math?window:"undefined"!=typeof self&&self.Math==Math?self:Function("return this")();"number"==typeof __g&&(__g=i)},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0,t.i18n=t.use=t.t=void 0;var s=i(99),r=n(s),a=i(2),o=n(a),l=i(100),u=n(l),c=i(101),d=n(c),h=(0,d.default)(o.default),f=r.default,p=!1,m=function(){var e=Object.getPrototypeOf(this||o.default).$t;if("function"==typeof e&&o.default.locale)return p||(p=!0,o.default.locale(o.default.config.lang,(0,u.default)(f,o.default.locale(o.default.config.lang)||{},{clone:!0}))),e.apply(this,arguments)},v=t.t=function(e,t){var i=m.apply(this,arguments);if(null!==i&&void 0!==i)return i;for(var n=e.split("."),s=f,r=0,a=n.length;r<a;r++){if(i=s[n[r]],r===a-1)return h(i,t);if(!i)return"";s=i}return""},g=t.use=function(e){f=e||f},b=t.i18n=function(e){m=e||m};t.default={use:g,t:v,i18n:b}},function(e,t,i){"use strict";function n(e,t,i){return function(){var n=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},s=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};!(i&&i.context&&n.target&&s.target)||e.contains(n.target)||e.contains(s.target)||e===n.target||i.context.popperElm&&(i.context.popperElm.contains(n.target)||i.context.popperElm.contains(s.target))||(t.expression&&e[l].methodName&&i.context[e[l].methodName]?i.context[e[l].methodName]():e[l].bindingFn&&e[l].bindingFn())}}t.__esModule=!0;var s=i(2),r=function(e){return e&&e.__esModule?e:{default:e}}(s),a=i(4),o=[],l="@@clickoutsideContext",u=void 0,c=0;!r.default.prototype.$isServer&&(0,a.on)(document,"mousedown",function(e){return u=e}),!r.default.prototype.$isServer&&(0,a.on)(document,"mouseup",function(e){o.forEach(function(t){return t[l].documentHandler(e,u)})}),t.default={bind:function(e,t,i){o.push(e);var s=c++;e[l]={id:s,documentHandler:n(e,t,i),methodName:t.expression,bindingFn:t.value}},update:function(e,t,i){e[l].documentHandler=n(e,t,i),e[l].methodName=t.expression,e[l].bindingFn=t.value},unbind:function(e){for(var t=o.length,i=0;i<t;i++)if(o[i][l].id===e[l].id){o.splice(i,1);break}delete e[l]}}},function(e,t,i){"use strict";t.__esModule=!0;var n=i(135),s=function(e){return e&&e.__esModule?e:{default:e}}(n);s.default.install=function(e){e.component(s.default.name,s.default)},t.default=s.default},function(e,t){var i={}.hasOwnProperty;e.exports=function(e,t){return i.call(e,t)}},function(e,t,i){var n=i(78),s=i(52);e.exports=function(e){return n(s(e))}},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0,t.PopupManager=void 0;var s=i(2),r=n(s),a=i(12),o=n(a),l=i(108),u=n(l),c=i(42),d=n(c),h=i(4),f=1,p=[],m=function(e){if(-1===p.indexOf(e)){var t=function(e){var t=e.__vue__;if(!t){var i=e.previousSibling;i.__vue__&&(t=i.__vue__)}return t};r.default.transition(e,{afterEnter:function(e){var i=t(e);i&&i.doAfterOpen&&i.doAfterOpen()},afterLeave:function(e){var i=t(e);i&&i.doAfterClose&&i.doAfterClose()}})}},v=void 0,g=function e(t){return 3===t.nodeType&&(t=t.nextElementSibling||t.nextSibling,e(t)),t};t.default={props:{visible:{type:Boolean,default:!1},transition:{type:String,default:""},openDelay:{},closeDelay:{},zIndex:{},modal:{type:Boolean,default:!1},modalFade:{type:Boolean,default:!0},modalClass:{},modalAppendToBody:{type:Boolean,default:!1},lockScroll:{type:Boolean,default:!0},closeOnPressEscape:{type:Boolean,default:!1},closeOnClickModal:{type:Boolean,default:!1}},created:function(){this.transition&&m(this.transition)},beforeMount:function(){this._popupId="popup-"+f++,u.default.register(this._popupId,this)},beforeDestroy:function(){u.default.deregister(this._popupId),u.default.closeModal(this._popupId),this.modal&&null!==this.bodyOverflow&&"hidden"!==this.bodyOverflow&&(document.body.style.overflow=this.bodyOverflow,document.body.style.paddingRight=this.bodyPaddingRight),this.bodyOverflow=null,this.bodyPaddingRight=null},data:function(){return{opened:!1,bodyOverflow:null,bodyPaddingRight:null,rendered:!1}},watch:{visible:function(e){var t=this;if(e){if(this._opening)return;this.rendered?this.open():(this.rendered=!0,r.default.nextTick(function(){t.open()}))}else this.close()}},methods:{open:function(e){var t=this;this.rendered||(this.rendered=!0);var i=(0,o.default)({},this.$props||this,e);this._closeTimer&&(clearTimeout(this._closeTimer),this._closeTimer=null),clearTimeout(this._openTimer);var n=Number(i.openDelay);n>0?this._openTimer=setTimeout(function(){t._openTimer=null,t.doOpen(i)},n):this.doOpen(i)},doOpen:function(e){if(!this.$isServer&&(!this.willOpen||this.willOpen())&&!this.opened){this._opening=!0;var t=g(this.$el),i=e.modal,n=e.zIndex;if(n&&(u.default.zIndex=n),i&&(this._closing&&(u.default.closeModal(this._popupId),this._closing=!1),u.default.openModal(this._popupId,u.default.nextZIndex(),this.modalAppendToBody?void 0:t,e.modalClass,e.modalFade),e.lockScroll)){this.bodyOverflow||(this.bodyPaddingRight=document.body.style.paddingRight,this.bodyOverflow=document.body.style.overflow),v=(0,d.default)();var s=document.documentElement.clientHeight<document.body.scrollHeight,r=(0,h.getStyle)(document.body,"overflowY");v>0&&(s||"scroll"===r)&&(document.body.style.paddingRight=v+"px"),document.body.style.overflow="hidden"}"static"===getComputedStyle(t).position&&(t.style.position="absolute"),t.style.zIndex=u.default.nextZIndex(),this.opened=!0,this.onOpen&&this.onOpen(),this.transition||this.doAfterOpen()}},doAfterOpen:function(){this._opening=!1},close:function(){var e=this;if(!this.willClose||this.willClose()){null!==this._openTimer&&(clearTimeout(this._openTimer),this._openTimer=null),clearTimeout(this._closeTimer);var t=Number(this.closeDelay);t>0?this._closeTimer=setTimeout(function(){e._closeTimer=null,e.doClose()},t):this.doClose()}},doClose:function(){var e=this;this._closing=!0,this.onClose&&this.onClose(),this.lockScroll&&setTimeout(function(){e.modal&&"hidden"!==e.bodyOverflow&&(document.body.style.overflow=e.bodyOverflow,document.body.style.paddingRight=e.bodyPaddingRight),e.bodyOverflow=null,e.bodyPaddingRight=null},200),this.opened=!1,this.transition||this.doAfterClose()},doAfterClose:function(){u.default.closeModal(this._popupId),this._closing=!1}}},t.PopupManager=u.default},function(e,t,i){var n=i(23),s=i(38);e.exports=i(24)?function(e,t,i){return n.f(e,t,s(1,i))}:function(e,t,i){return e[t]=i,e}},function(e,t,i){var n=i(36),s=i(75),r=i(51),a=Object.defineProperty;t.f=i(24)?Object.defineProperty:function(e,t,i){if(n(e),t=r(t,!0),n(i),s)try{return a(e,t,i)}catch(e){}if("get"in i||"set"in i)throw TypeError("Accessors not supported!");return"value"in i&&(e[t]=i.value),e}},function(e,t,i){e.exports=!i(29)(function(){return 7!=Object.defineProperty({},"a",{get:function(){return 7}}).a})},function(e,t,i){var n=i(55)("wks"),s=i(39),r=i(15).Symbol,a="function"==typeof r;(e.exports=function(e){return n[e]||(n[e]=a&&r[e]||(a?r:s)("Symbol."+e))}).store=n},function(e,t,i){"use strict";t.__esModule=!0,t.default=function(e){return{methods:{focus:function(){this.$refs[e].focus()}}}}},function(e,t,i){"use strict";t.__esModule=!0;var n=i(116),s=function(e){return e&&e.__esModule?e:{default:e}}(n);s.default.install=function(e){e.component(s.default.name,s.default)},t.default=s.default},function(e,t,i){"use strict";t.__esModule=!0;var n="undefined"==typeof window,s=function(){if(!n){var e=window.requestAnimationFrame||window.mozRequestAnimationFrame||window.webkitRequestAnimationFrame||function(e){return window.setTimeout(e,20)};return function(t){return e(t)}}}(),r=function(){if(!n){var e=window.cancelAnimationFrame||window.mozCancelAnimationFrame||window.webkitCancelAnimationFrame||window.clearTimeout;return function(t){return e(t)}}}(),a=function(e){var t=e.__resizeTrigger__,i=t.firstElementChild,n=t.lastElementChild,s=i.firstElementChild;n.scrollLeft=n.scrollWidth,n.scrollTop=n.scrollHeight,s.style.width=i.offsetWidth+1+"px",s.style.height=i.offsetHeight+1+"px",i.scrollLeft=i.scrollWidth,i.scrollTop=i.scrollHeight},o=function(e){return e.offsetWidth!==e.__resizeLast__.width||e.offsetHeight!==e.__resizeLast__.height},l=function(e){var t=this;a(this),this.__resizeRAF__&&r(this.__resizeRAF__),this.__resizeRAF__=s(function(){o(t)&&(t.__resizeLast__.width=t.offsetWidth,t.__resizeLast__.height=t.offsetHeight,t.__resizeListeners__.forEach(function(i){i.call(t,e)}))})},u=n?{}:document.attachEvent,c="Webkit Moz O ms".split(" "),d="webkitAnimationStart animationstart oAnimationStart MSAnimationStart".split(" "),h=!1,f="",p="animationstart";if(!u&&!n){var m=document.createElement("fakeelement");if(void 0!==m.style.animationName&&(h=!0),!1===h)for(var v="",g=0;g<c.length;g++)if(void 0!==m.style[c[g]+"AnimationName"]){v=c[g],f="-"+v.toLowerCase()+"-",p=d[g],h=!0;break}}var b=!1,y=function(){if(!b&&!n){var e="@"+f+"keyframes resizeanim { from { opacity: 0; } to { opacity: 0; } } ",t=f+"animation: 1ms resizeanim;",i=e+"\n      .resize-triggers { "+t+' visibility: hidden; opacity: 0; }\n      .resize-triggers, .resize-triggers > div, .contract-trigger:before { content: " "; display: block; position: absolute; top: 0; left: 0; height: 100%; width: 100%; overflow: hidden; z-index: -1 }\n      .resize-triggers > div { background: #eee; overflow: auto; }\n      .contract-trigger:before { width: 200%; height: 200%; }',s=document.head||document.getElementsByTagName("head")[0],r=document.createElement("style");r.type="text/css",r.styleSheet?r.styleSheet.cssText=i:r.appendChild(document.createTextNode(i)),s.appendChild(r),b=!0}};t.addResizeListener=function(e,t){if(!n)if(u)e.attachEvent("onresize",t);else{if(!e.__resizeTrigger__){"static"===getComputedStyle(e).position&&(e.style.position="relative"),y(),e.__resizeLast__={},e.__resizeListeners__=[];var i=e.__resizeTrigger__=document.createElement("div");i.className="resize-triggers",i.innerHTML='<div class="expand-trigger"><div></div></div><div class="contract-trigger"></div>',e.appendChild(i),a(e),e.addEventListener("scroll",l,!0),p&&i.addEventListener(p,function(t){"resizeanim"===t.animationName&&a(e)})}e.__resizeListeners__.push(t)}},t.removeResizeListener=function(e,t){e&&e.__resizeListeners__&&(u?e.detachEvent("onresize",t):(e.__resizeListeners__.splice(e.__resizeListeners__.indexOf(t),1),e.__resizeListeners__.length||(e.removeEventListener("scroll",l),e.__resizeTrigger__=!e.removeChild(e.__resizeTrigger__))))}},function(e,t){e.exports=function(e){try{return!!e()}catch(e){return!0}}},function(e,t,i){var n=i(77),s=i(56);e.exports=Object.keys||function(e){return n(e,s)}},function(e,t,i){"use strict";t.__esModule=!0;var n=i(113),s=function(e){return e&&e.__esModule?e:{default:e}}(n);s.default.install=function(e){e.component(s.default.name,s.default)},t.default=s.default},function(e,t,i){"use strict";function n(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}t.__esModule=!0;var s=i(4),r=function(){function e(){n(this,e)}return e.prototype.beforeEnter=function(e){(0,s.addClass)(e,"collapse-transition"),e.dataset||(e.dataset={}),e.dataset.oldPaddingTop=e.style.paddingTop,e.dataset.oldPaddingBottom=e.style.paddingBottom,e.style.height="0",e.style.paddingTop=0,e.style.paddingBottom=0},e.prototype.enter=function(e){e.dataset.oldOverflow=e.style.overflow,0!==e.scrollHeight?(e.style.height=e.scrollHeight+"px",e.style.paddingTop=e.dataset.oldPaddingTop,e.style.paddingBottom=e.dataset.oldPaddingBottom):(e.style.height="",e.style.paddingTop=e.dataset.oldPaddingTop,e.style.paddingBottom=e.dataset.oldPaddingBottom),e.style.overflow="hidden"},e.prototype.afterEnter=function(e){(0,s.removeClass)(e,"collapse-transition"),e.style.height="",e.style.overflow=e.dataset.oldOverflow},e.prototype.beforeLeave=function(e){e.dataset||(e.dataset={}),e.dataset.oldPaddingTop=e.style.paddingTop,e.dataset.oldPaddingBottom=e.style.paddingBottom,e.dataset.oldOverflow=e.style.overflow,e.style.height=e.scrollHeight+"px",e.style.overflow="hidden"},e.prototype.leave=function(e){0!==e.scrollHeight&&((0,s.addClass)(e,"collapse-transition"),e.style.height=0,e.style.paddingTop=0,e.style.paddingBottom=0)},e.prototype.afterLeave=function(e){(0,s.removeClass)(e,"collapse-transition"),e.style.height="",e.style.overflow=e.dataset.oldOverflow,e.style.paddingTop=e.dataset.oldPaddingTop,e.style.paddingBottom=e.dataset.oldPaddingBottom},e}();t.default={name:"ElCollapseTransition",functional:!0,render:function(e,t){var i=t.children;return e("transition",{on:new r},i)}}},function(e,t,i){"use strict";t.__esModule=!0;var n=i(163),s=function(e){return e&&e.__esModule?e:{default:e}}(n);s.default.install=function(e){e.component(s.default.name,s.default)},t.default=s.default},function(e,t,i){"use strict";function n(e){return"object"===(void 0===e?"undefined":r(e))&&(0,a.hasOwn)(e,"componentOptions")}function s(e){return e&&e.filter(function(e){return e&&e.tag})[0]}t.__esModule=!0;var r="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e};t.isVNode=n,t.getFirstComponentChild=s;var a=i(6)},function(e,t){var i=e.exports={version:"2.4.0"};"number"==typeof __e&&(__e=i)},function(e,t,i){var n=i(37);e.exports=function(e){if(!n(e))throw TypeError(e+" is not an object!");return e}},function(e,t){e.exports=function(e){return"object"==typeof e?null!==e:"function"==typeof e}},function(e,t){e.exports=function(e,t){return{enumerable:!(1&e),configurable:!(2&e),writable:!(4&e),value:t}}},function(e,t){var i=0,n=Math.random();e.exports=function(e){return"Symbol(".concat(void 0===e?"":e,")_",(++i+n).toString(36))}},function(e,t){t.f={}.propertyIsEnumerable},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0;var s=i(286),r=n(s),a=i(298),o=n(a),l="function"==typeof o.default&&"symbol"==typeof r.default?function(e){return typeof e}:function(e){return e&&"function"==typeof o.default&&e.constructor===o.default&&e!==o.default.prototype?"symbol":typeof e};t.default="function"==typeof o.default&&"symbol"===l(r.default)?function(e){return void 0===e?"undefined":l(e)}:function(e){return e&&"function"==typeof o.default&&e.constructor===o.default&&e!==o.default.prototype?"symbol":void 0===e?"undefined":l(e)}},function(e,t,i){"use strict";t.__esModule=!0,t.default=function(){if(s.default.prototype.$isServer)return 0;if(void 0!==r)return r;var e=document.createElement("div");e.className="el-scrollbar__wrap",e.style.visibility="hidden",e.style.width="100px",e.style.position="absolute",e.style.top="-9999px",document.body.appendChild(e);var t=e.offsetWidth;e.style.overflow="scroll";var i=document.createElement("div");i.style.width="100%",e.appendChild(i);var n=i.offsetWidth;return e.parentNode.removeChild(e),r=t-n};var n=i(2),s=function(e){return e&&e.__esModule?e:{default:e}}(n),r=void 0},function(e,t){e.exports=function(e,t,i,n){function s(){function s(){a=Number(new Date),i.apply(l,c)}function o(){r=void 0}var l=this,u=Number(new Date)-a,c=arguments;n&&!r&&s(),r&&clearTimeout(r),void 0===n&&u>e?s():!0!==t&&(r=setTimeout(n?o:s,void 0===n?e-u:e))}var r,a=0;return"boolean"!=typeof t&&(n=i,i=t,t=void 0),s}},function(e,t,i){"use strict";function n(e,t){if(!r.default.prototype.$isServer){if(!t)return void(e.scrollTop=0);var i=t.offsetTop,n=t.offsetTop+t.offsetHeight,s=e.scrollTop,a=s+e.clientHeight;i<s?e.scrollTop=i:n>a&&(e.scrollTop=n-e.clientHeight)}}t.__esModule=!0,t.default=n;var s=i(2),r=function(e){return e&&e.__esModule?e:{default:e}}(s)},function(e,t,i){"use strict";t.__esModule=!0;var n=n||{};n.Utils=n.Utils||{},n.Utils.focusFirstDescendant=function(e){for(var t=0;t<e.childNodes.length;t++){var i=e.childNodes[t];if(n.Utils.attemptFocus(i)||n.Utils.focusFirstDescendant(i))return!0}return!1},n.Utils.focusLastDescendant=function(e){for(var t=e.childNodes.length-1;t>=0;t--){var i=e.childNodes[t];if(n.Utils.attemptFocus(i)||n.Utils.focusLastDescendant(i))return!0}return!1},n.Utils.attemptFocus=function(e){if(!n.Utils.isFocusable(e))return!1;n.Utils.IgnoreUtilFocusChanges=!0;try{e.focus()}catch(e){}return n.Utils.IgnoreUtilFocusChanges=!1,document.activeElement===e},n.Utils.isFocusable=function(e){if(e.tabIndex>0||0===e.tabIndex&&null!==e.getAttribute("tabIndex"))return!0;if(e.disabled)return!1;switch(e.nodeName){case"A":return!!e.href&&"ignore"!==e.rel;case"INPUT":return"hidden"!==e.type&&"file"!==e.type;case"BUTTON":case"SELECT":case"TEXTAREA":return!0;default:return!1}},n.Utils.triggerEvent=function(e,t){var i=void 0;i=/^mouse|click/.test(t)?"MouseEvents":/^key/.test(t)?"KeyboardEvent":"HTMLEvents";for(var n=document.createEvent(i),s=arguments.length,r=Array(s>2?s-2:0),a=2;a<s;a++)r[a-2]=arguments[a];return n.initEvent.apply(n,[t].concat(r)),e.dispatchEvent?e.dispatchEvent(n):e.fireEvent("on"+t,n),e},n.Utils.keys={tab:9,enter:13,space:32,left:37,up:38,right:39,down:40},t.default=n.Utils},function(e,t,i){"use strict";t.__esModule=!0;var n=i(191),s=function(e){return e&&e.__esModule?e:{default:e}}(n);s.default.install=function(e){e.component(s.default.name,s.default)},t.default=s.default},function(e,t,i){"use strict";t.__esModule=!0,t.getRowIdentity=t.mousewheel=t.getColumnByCell=t.getColumnById=t.orderBy=t.getCell=void 0;var n="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},s=i(6),r=(t.getCell=function(e){for(var t=e.target;t&&"HTML"!==t.tagName.toUpperCase();){if("TD"===t.tagName.toUpperCase())return t;t=t.parentNode}return null},function(e){return null!==e&&"object"===(void 0===e?"undefined":n(e))}),a=(t.orderBy=function(e,t,i,n,a){if(!t&&!n&&(!a||Array.isArray(a)&&!a.length))return e;i="string"==typeof i?"descending"===i?-1:1:i&&i<0?-1:1;var o=n?null:function(i,n){return a?(Array.isArray(a)||(a=[a]),a.map(function(t){return"string"==typeof t?(0,s.getValueByPath)(i,t):t(i,n,e)})):("$key"!==t&&r(i)&&"$value"in i&&(i=i.$value),[r(i)?(0,s.getValueByPath)(i,t):i])},l=function(e,t){if(n)return n(e.value,t.value);for(var i=0,s=e.key.length;i<s;i++){if(e.key[i]<t.key[i])return-1;if(e.key[i]>t.key[i])return 1}return 0};return e.map(function(e,t){return{value:e,index:t,key:o?o(e,t):null}}).sort(function(e,t){var n=l(e,t);return n||(n=e.index-t.index),n*i}).map(function(e){return e.value})},t.getColumnById=function(e,t){var i=null;return e.columns.forEach(function(e){e.id===t&&(i=e)}),i}),o=(t.getColumnByCell=function(e,t){var i=(t.className||"").match(/el-table_[^\s]+/gm);return i?a(e,i[0]):null},"undefined"!=typeof navigator&&navigator.userAgent.toLowerCase().indexOf("firefox")>-1);t.mousewheel=function(e,t){e&&e.addEventListener&&e.addEventListener(o?"DOMMouseScroll":"mousewheel",t)},t.getRowIdentity=function(e,t){if(!e)throw new Error("row is required when get row identity");if("string"==typeof t){if(t.indexOf(".")<0)return e[t];for(var i=t.split("."),n=e,s=0;s<i.length;s++)n=n[i[s]];return n}if("function"==typeof t)return t.call(null,e)}},function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=i(219),s=i.n(n),r=i(221),a=i(0),o=a(s.a,r.a,!1,null,null,null);t.default=o.exports},function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=i(224),s=i.n(n),r=i(227),a=i(0),o=a(s.a,r.a,!1,null,null,null);t.default=o.exports},function(e,t,i){var n=i(15),s=i(35),r=i(280),a=i(22),o=function(e,t,i){var l,u,c,d=e&o.F,h=e&o.G,f=e&o.S,p=e&o.P,m=e&o.B,v=e&o.W,g=h?s:s[t]||(s[t]={}),b=g.prototype,y=h?n:f?n[t]:(n[t]||{}).prototype;h&&(i=t);for(l in i)(u=!d&&y&&void 0!==y[l])&&l in g||(c=u?y[l]:i[l],g[l]=h&&"function"!=typeof y[l]?i[l]:m&&u?r(c,n):v&&y[l]==c?function(e){var t=function(t,i,n){if(this instanceof e){switch(arguments.length){case 0:return new e;case 1:return new e(t);case 2:return new e(t,i)}return new e(t,i,n)}return e.apply(this,arguments)};return t.prototype=e.prototype,t}(c):p&&"function"==typeof c?r(Function.call,c):c,p&&((g.virtual||(g.virtual={}))[l]=c,e&o.R&&b&&!b[l]&&a(b,l,c)))};o.F=1,o.G=2,o.S=4,o.P=8,o.B=16,o.W=32,o.U=64,o.R=128,e.exports=o},function(e,t,i){var n=i(37);e.exports=function(e,t){if(!n(e))return e;var i,s;if(t&&"function"==typeof(i=e.toString)&&!n(s=i.call(e)))return s;if("function"==typeof(i=e.valueOf)&&!n(s=i.call(e)))return s;if(!t&&"function"==typeof(i=e.toString)&&!n(s=i.call(e)))return s;throw TypeError("Can't convert object to primitive value")}},function(e,t){e.exports=function(e){if(void 0==e)throw TypeError("Can't call method on  "+e);return e}},function(e,t){var i=Math.ceil,n=Math.floor;e.exports=function(e){return isNaN(e=+e)?0:(e>0?n:i)(e)}},function(e,t,i){var n=i(55)("keys"),s=i(39);e.exports=function(e){return n[e]||(n[e]=s(e))}},function(e,t,i){var n=i(15),s=n["__core-js_shared__"]||(n["__core-js_shared__"]={});e.exports=function(e){return s[e]||(s[e]={})}},function(e,t){e.exports="constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf".split(",")},function(e,t){t.f=Object.getOwnPropertySymbols},function(e,t){e.exports=!0},function(e,t){e.exports={}},function(e,t,i){var n=i(23).f,s=i(19),r=i(25)("toStringTag");e.exports=function(e,t,i){e&&!s(e=i?e:e.prototype,r)&&n(e,r,{configurable:!0,value:t})}},function(e,t,i){t.f=i(25)},function(e,t,i){var n=i(15),s=i(35),r=i(58),a=i(61),o=i(23).f;e.exports=function(e){var t=s.Symbol||(s.Symbol=r?{}:n.Symbol||{});"_"==e.charAt(0)||e in t||o(t,e,{value:a.f(e)})}},function(e,t,i){"use strict";t.__esModule=!0;var n=i(387),s=function(e){return e&&e.__esModule?e:{default:e}}(n);s.default.install=function(e){e.component(s.default.name,s.default)},t.default=s.default},function(e,t,i){"use strict";t.__esModule=!0,t.default=function(e,t){if(!s.default.prototype.$isServer){var i=function(e){t.drag&&t.drag(e)},n=function e(n){document.removeEventListener("mousemove",i),document.removeEventListener("mouseup",e),document.onselectstart=null,document.ondragstart=null,r=!1,t.end&&t.end(n)};e.addEventListener("mousedown",function(e){r||(document.onselectstart=function(){return!1},document.ondragstart=function(){return!1},document.addEventListener("mousemove",i),document.addEventListener("mouseup",n),r=!0,t.start&&t.start(e))})}};var n=i(2),s=function(e){return e&&e.__esModule?e:{default:e}}(n),r=!1},function(e,t,i){"use strict";t.__esModule=!0;var n=i(97),s=function(e){return e&&e.__esModule?e:{default:e}}(n);s.default.install=function(e){e.component(s.default.name,s.default)},t.default=s.default},function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=i(111),s=i.n(n),r=i(112),a=i(0),o=a(s.a,r.a,!1,null,null,null);t.default=o.exports},function(e,t,i){"use strict";t.__esModule=!0;var n=i(66),s=function(e){return e&&e.__esModule?e:{default:e}}(n);s.default.install=function(e){e.component(s.default.name,s.default)},t.default=s.default},function(e,t,i){"use strict";t.__esModule=!0;var n=i(138),s=function(e){return e&&e.__esModule?e:{default:e}}(n);s.default.install=function(e){e.component(s.default.name,s.default)},t.default=s.default},function(e,t,i){"use strict";t.__esModule=!0,t.default={computed:{indexPath:function(){for(var e=[this.index],t=this.$parent;"ElMenu"!==t.$options.componentName;)t.index&&e.unshift(t.index),t=t.$parent;return e},rootMenu:function(){for(var e=this.$parent;e&&"ElMenu"!==e.$options.componentName;)e=e.$parent;return e},parentMenu:function(){for(var e=this.$parent;e&&-1===["ElMenu","ElSubmenu"].indexOf(e.$options.componentName);)e=e.$parent;return e},paddingStyle:function(){if("vertical"!==this.rootMenu.mode)return{};var e=20,t=this.$parent;if(this.rootMenu.collapse)e=20;else for(;t&&"ElMenu"!==t.$options.componentName;)"ElSubmenu"===t.$options.componentName&&(e+=20),t=t.$parent;return{paddingLeft:e+"px"}}}}},function(e,t,i){"use strict";t.__esModule=!0;var n=i(169),s=function(e){return e&&e.__esModule?e:{default:e}}(n);s.default.install=function(e){e.component(s.default.name,s.default)},t.default=s.default},function(e,t,i){"use strict";t.__esModule=!0;var n=i(4);t.default={bind:function(e,t,i){var s=null,r=void 0,a=function(){return i.context[t.expression].apply()},o=function(){new Date-r<100&&a(),clearInterval(s),s=null};(0,n.on)(e,"mousedown",function(e){0===e.button&&(r=new Date,(0,n.once)(document,"mouseup",o),clearInterval(s),s=setInterval(a,100))})}}},function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=i(225),s=i.n(n),r=i(226),a=i(0),o=a(s.a,r.a,!1,null,null,null);t.default=o.exports},function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=i(234),s=i.n(n),r=i(235),a=i(0),o=a(s.a,r.a,!1,null,null,null);t.default=o.exports},function(e,t,i){"use strict";t.__esModule=!0;var n=i(277),s=function(e){return e&&e.__esModule?e:{default:e}}(n);t.default=s.default||function(e){for(var t=1;t<arguments.length;t++){var i=arguments[t];for(var n in i)Object.prototype.hasOwnProperty.call(i,n)&&(e[n]=i[n])}return e}},function(e,t,i){e.exports=!i(24)&&!i(29)(function(){return 7!=Object.defineProperty(i(76)("div"),"a",{get:function(){return 7}}).a})},function(e,t,i){var n=i(37),s=i(15).document,r=n(s)&&n(s.createElement);e.exports=function(e){return r?s.createElement(e):{}}},function(e,t,i){var n=i(19),s=i(20),r=i(283)(!1),a=i(54)("IE_PROTO");e.exports=function(e,t){var i,o=s(e),l=0,u=[];for(i in o)i!=a&&n(o,i)&&u.push(i);for(;t.length>l;)n(o,i=t[l++])&&(~r(u,i)||u.push(i));return u}},function(e,t,i){var n=i(79);e.exports=Object("z").propertyIsEnumerable(0)?Object:function(e){return"String"==n(e)?e.split(""):Object(e)}},function(e,t){var i={}.toString;e.exports=function(e){return i.call(e).slice(8,-1)}},function(e,t,i){var n=i(52);e.exports=function(e){return Object(n(e))}},function(e,t,i){"use strict";var n=i(58),s=i(50),r=i(82),a=i(22),o=i(19),l=i(59),u=i(290),c=i(60),d=i(293),h=i(25)("iterator"),f=!([].keys&&"next"in[].keys()),p=function(){return this};e.exports=function(e,t,i,m,v,g,b){u(i,t,m);var y,_,x,C=function(e){if(!f&&e in M)return M[e];switch(e){case"keys":case"values":return function(){return new i(this,e)}}return function(){return new i(this,e)}},w=t+" Iterator",k="values"==v,S=!1,M=e.prototype,$=M[h]||M["@@iterator"]||v&&M[v],E=$||C(v),D=v?k?C("entries"):E:void 0,T="Array"==t?M.entries||$:$;if(T&&(x=d(T.call(new e)))!==Object.prototype&&(c(x,w,!0),n||o(x,h)||a(x,h,p)),k&&$&&"values"!==$.name&&(S=!0,E=function(){return $.call(this)}),n&&!b||!f&&!S&&M[h]||a(M,h,E),l[t]=E,l[w]=p,v)if(y={values:k?E:C("values"),keys:g?E:C("keys"),entries:D},b)for(_ in y)_ in M||r(M,_,y[_]);else s(s.P+s.F*(f||S),t,y);return y}},function(e,t,i){e.exports=i(22)},function(e,t,i){var n=i(36),s=i(291),r=i(56),a=i(54)("IE_PROTO"),o=function(){},l=function(){var e,t=i(76)("iframe"),n=r.length;for(t.style.display="none",i(292).appendChild(t),t.src="javascript:",e=t.contentWindow.document,e.open(),e.write("<script>document.F=Object<\/script>"),e.close(),l=e.F;n--;)delete l.prototype[r[n]];return l()};e.exports=Object.create||function(e,t){var i;return null!==e?(o.prototype=n(e),i=new o,o.prototype=null,i[a]=e):i=l(),void 0===t?i:s(i,t)}},function(e,t,i){var n=i(77),s=i(56).concat("length","prototype");t.f=Object.getOwnPropertyNames||function(e){return n(e,s)}},function(e,t,i){"use strict";function n(e,t,i,n,r,a){!e.required||i.hasOwnProperty(e.field)&&!s.e(t,a||e.type)||n.push(s.d(r.messages.required,e.fullField))}var s=i(3);t.a=n},function(e,t,i){"use strict";t.__esModule=!0;var n=t.NODE_KEY="$treeNodeId";t.markNodeData=function(e,t){t[n]||Object.defineProperty(t,n,{value:e.id,enumerable:!1,configurable:!1,writable:!1})},t.getNodeKey=function(e,t){return e?t[e]:t[n]}},function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=i(371),s=i.n(n),r=i(372),a=i(0),o=a(s.a,r.a,!1,null,null,null);t.default=o.exports},function(e,t){function i(e,t){return function(){e.apply(this,arguments),t.apply(this,arguments)}}var n=/^(attrs|props|on|nativeOn|class|style|hook)$/;e.exports=function(e){return e.reduce(function(e,t){var s,r,a,o,l;for(a in t)if(s=e[a],r=t[a],s&&n.test(a))if("class"===a&&("string"==typeof s&&(l=s,e[a]=s={},s[l]=!0),"string"==typeof r&&(l=r,t[a]=r={},r[l]=!0)),"on"===a||"nativeOn"===a||"hook"===a)for(o in r)s[o]=i(s[o],r[o]);else if(Array.isArray(s))e[a]=s.concat(r);else if(Array.isArray(r))e[a]=[s].concat(r);else for(o in r)s[o]=r[o];else e[a]=t[a];return e},{})}},function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=i(394),s=i.n(n),r=i(395),a=i(0),o=a(s.a,r.a,!1,null,null,null);t.default=o.exports},function(e,t,i){e.exports=i(91)},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}var s=i(92),r=n(s),a=i(121),o=n(a),l=i(125),u=n(l),c=i(132),d=n(c),h=i(141),f=n(h),p=i(145),m=n(p),v=i(149),g=n(v),b=i(156),y=n(b),_=i(160),x=n(_),C=i(165),w=n(C),k=i(8),S=n(k),M=i(70),$=n(M),E=i(172),D=n(E),T=i(176),P=n(T),O=i(180),N=n(O),F=i(14),I=n(F),A=i(187),V=n(A),L=i(46),B=n(L),z=i(194),R=n(z),j=i(65),H=n(j),W=i(67),q=n(W),K=i(198),Y=n(K),G=i(18),U=n(G),X=i(68),J=n(X),Z=i(202),Q=n(Z),ee=i(215),te=n(ee),ie=i(217),ne=n(ie),se=i(240),re=n(se),ae=i(245),oe=n(ae),le=i(250),ue=n(le),ce=i(33),de=n(ce),he=i(255),fe=n(he),pe=i(261),me=n(pe),ve=i(265),ge=n(ve),be=i(269),ye=n(be),_e=i(273),xe=n(_e),Ce=i(332),we=n(Ce),ke=i(340),Se=n(ke),Me=i(31),$e=n(Me),Ee=i(344),De=n(Ee),Te=i(353),Pe=n(Te),Oe=i(357),Ne=n(Oe),Fe=i(362),Ie=n(Fe),Ae=i(369),Ve=n(Ae),Le=i(374),Be=n(Le),ze=i(378),Re=n(ze),je=i(380),He=n(je),We=i(382),qe=n(We),Ke=i(63),Ye=n(Ke),Ge=i(398),Ue=n(Ge),Xe=i(402),Je=n(Xe),Ze=i(407),Qe=n(Ze),et=i(411),tt=n(et),it=i(415),nt=n(it),st=i(419),rt=n(st),at=i(423),ot=n(at),lt=i(427),ut=n(lt),ct=i(27),dt=n(ct),ht=i(431),ft=n(ht),pt=i(435),mt=n(pt),vt=i(439),gt=n(vt),bt=i(443),yt=n(bt),_t=i(450),xt=n(_t),Ct=i(467),wt=n(Ct),kt=i(474),St=n(kt),Mt=i(478),$t=n(Mt),Et=i(482),Dt=n(Et),Tt=i(486),Pt=n(Tt),Ot=i(490),Nt=n(Ot),Ft=i(16),It=n(Ft),At=i(32),Vt=n(At),Lt=[r.default,o.default,u.default,d.default,f.default,m.default,g.default,y.default,x.default,w.default,S.default,$.default,D.default,P.default,N.default,I.default,V.default,B.default,R.default,H.default,q.default,Y.default,U.default,J.default,Q.default,te.default,ne.default,re.default,oe.default,ue.default,de.default,me.default,ge.default,ye.default,xe.default,we.default,Se.default,$e.default,De.default,Pe.default,Ie.default,Be.default,Re.default,He.default,qe.default,Ye.default,Ue.default,Qe.default,tt.default,nt.default,rt.default,ot.default,ut.default,dt.default,ft.default,mt.default,gt.default,yt.default,xt.default,wt.default,St.default,$t.default,Dt.default,Pt.default,Nt.default,Vt.default],Bt=function e(t){var i=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};if(!e.installed){It.default.use(i.locale),It.default.i18n(i.i18n),Lt.map(function(e){t.component(e.name,e)}),t.use(Ve.default.directive);var n={};n.size=i.size||"",t.prototype.$loading=Ve.default.service,t.prototype.$msgbox=fe.default,t.prototype.$alert=fe.default.alert,t.prototype.$confirm=fe.default.confirm,t.prototype.$prompt=fe.default.prompt,t.prototype.$notify=Ne.default,t.prototype.$message=Je.default,t.prototype.$ELEMENT=n}};"undefined"!=typeof window&&window.Vue&&Bt(window.Vue),e.exports={version:"2.0.7",locale:It.default.use,i18n:It.default.i18n,install:Bt,CollapseTransition:Vt.default,Loading:Ve.default,Pagination:r.default,Dialog:o.default,Autocomplete:u.default,Dropdown:d.default,DropdownMenu:f.default,DropdownItem:m.default,Menu:g.default,Submenu:y.default,MenuItem:x.default,MenuItemGroup:w.default,Input:S.default,InputNumber:$.default,Radio:D.default,RadioGroup:P.default,RadioButton:N.default,Checkbox:I.default,CheckboxButton:V.default,CheckboxGroup:B.default,Switch:R.default,Select:H.default,Option:q.default,OptionGroup:Y.default,Button:U.default,ButtonGroup:J.default,Table:Q.default,TableColumn:te.default,DatePicker:ne.default,TimeSelect:re.default,TimePicker:oe.default,Popover:ue.default,Tooltip:de.default,MessageBox:fe.default,Breadcrumb:me.default,BreadcrumbItem:ge.default,Form:ye.default,FormItem:xe.default,Tabs:we.default,TabPane:Se.default,Tag:$e.default,Tree:De.default,Alert:Pe.default,Notification:Ne.default,Slider:Ie.default,Icon:Be.default,Row:Re.default,Col:He.default,Upload:qe.default,Progress:Ye.default,Spinner:Ue.default,Message:Je.default,Badge:Qe.default,Card:tt.default,Rate:nt.default,Steps:rt.default,Step:ot.default,Carousel:ut.default,Scrollbar:dt.default,CarouselItem:ft.default,Collapse:mt.default,CollapseItem:gt.default,Cascader:yt.default,ColorPicker:xt.default,Transfer:wt.default,Container:St.default,Header:$t.default,Aside:Dt.default,Main:Pt.default,Footer:Nt.default},e.exports.default=e.exports},function(e,t,i){"use strict";t.__esModule=!0;var n=i(93),s=function(e){return e&&e.__esModule?e:{default:e}}(n);s.default.install=function(e){e.component(s.default.name,s.default)},t.default=s.default},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0;var s=i(94),r=n(s),a=i(65),o=n(a),l=i(67),u=n(l),c=i(8),d=n(c),h=i(5),f=n(h),p=i(6);t.default={name:"ElPagination",props:{pageSize:{type:Number,default:10},small:Boolean,total:Number,pageCount:Number,currentPage:{type:Number,default:1},layout:{default:"prev, pager, next, jumper, ->, total"},pageSizes:{type:Array,default:function(){return[10,20,30,40,50,100]}},popperClass:String,prevText:String,nextText:String,background:Boolean},data:function(){return{internalCurrentPage:1,internalPageSize:0}},render:function(e){var t=e("div",{class:["el-pagination",{"is-background":this.background,"el-pagination--small":this.small}]},[]),i=this.layout||"";if(i){var n={prev:e("prev",null,[]),jumper:e("jumper",null,[]),pager:e("pager",{attrs:{currentPage:this.internalCurrentPage,pageCount:this.internalPageCount},on:{change:this.handleCurrentChange}},[]),next:e("next",null,[]),sizes:e("sizes",{attrs:{pageSizes:this.pageSizes}},[]),slot:e("my-slot",null,[]),total:e("total",null,[])},s=i.split(",").map(function(e){return e.trim()}),r=e("div",{class:"el-pagination__rightwrapper"},[]),a=!1;return s.forEach(function(e){if("->"===e)return void(a=!0);a?r.children.push(n[e]):t.children.push(n[e])}),a&&t.children.unshift(r),t}},components:{MySlot:{render:function(e){return this.$parent.$slots.default?this.$parent.$slots.default[0]:""}},Prev:{render:function(e){return e("button",{attrs:{type:"button"},class:["btn-prev",{disabled:this.$parent.internalCurrentPage<=1}],on:{click:this.$parent.prev}},[this.$parent.prevText?e("span",null,[this.$parent.prevText]):e("i",{class:"el-icon el-icon-arrow-left"},[])])}},Next:{render:function(e){return e("button",{attrs:{type:"button"},class:["btn-next",{disabled:this.$parent.internalCurrentPage===this.$parent.internalPageCount||0===this.$parent.internalPageCount}],on:{click:this.$parent.next}},[this.$parent.nextText?e("span",null,[this.$parent.nextText]):e("i",{class:"el-icon el-icon-arrow-right"},[])])}},Sizes:{mixins:[f.default],props:{pageSizes:Array},watch:{pageSizes:{immediate:!0,handler:function(e,t){(0,p.valueEquals)(e,t)||Array.isArray(e)&&(this.$parent.internalPageSize=e.indexOf(this.$parent.pageSize)>-1?this.$parent.pageSize:this.pageSizes[0])}}},render:function(e){var t=this;return e("span",{class:"el-pagination__sizes"},[e("el-select",{attrs:{value:this.$parent.internalPageSize,popperClass:(this.$parent.popperClass||"")+" is-arrow-fixed"},on:{input:this.handleChange}},[this.pageSizes.map(function(i){return e("el-option",{attrs:{value:i,label:i+t.t("el.pagination.pagesize")}},[])})])])},components:{ElSelect:o.default,ElOption:u.default},methods:{handleChange:function(e){e!==this.$parent.internalPageSize&&(this.$parent.internalPageSize=e=parseInt(e,10),this.$parent.$emit("size-change",e))}}},Jumper:{mixins:[f.default],data:function(){return{oldValue:null}},components:{ElInput:d.default},methods:{handleFocus:function(e){this.oldValue=e.target.value},handleBlur:function(e){var t=e.target;this.resetValueIfNeed(t.value),this.reassignMaxValue(t.value)},handleChange:function(e){this.$parent.internalCurrentPage=this.$parent.getValidCurrentPage(e),this.oldValue=null,this.resetValueIfNeed(e)},resetValueIfNeed:function(e){var t=parseInt(e,10);isNaN(t)||(t<1?this.$refs.input.$el.querySelector("input").value=1:this.reassignMaxValue(e))},reassignMaxValue:function(e){+e>this.$parent.internalPageCount&&(this.$refs.input.$el.querySelector("input").value=this.$parent.internalPageCount)}},render:function(e){return e("span",{class:"el-pagination__jump"},[this.t("el.pagination.goto"),e("el-input",{class:"el-pagination__editor is-in-pagination",attrs:{min:1,max:this.$parent.internalPageCount,value:this.$parent.internalCurrentPage,type:"number"},domProps:{value:this.$parent.internalCurrentPage},ref:"input",on:{change:this.handleChange,focus:this.handleFocus,blur:this.handleBlur}},[]),this.t("el.pagination.pageClassifier")])}},Total:{mixins:[f.default],render:function(e){return"number"==typeof this.$parent.total?e("span",{class:"el-pagination__total"},[this.t("el.pagination.total",{total:this.$parent.total})]):""}},Pager:r.default},methods:{handleCurrentChange:function(e){this.internalCurrentPage=this.getValidCurrentPage(e)},prev:function(){var e=this.internalCurrentPage-1;this.internalCurrentPage=this.getValidCurrentPage(e)},next:function(){var e=this.internalCurrentPage+1;this.internalCurrentPage=this.getValidCurrentPage(e)},getValidCurrentPage:function(e){e=parseInt(e,10);var t="number"==typeof this.internalPageCount,i=void 0;return t?e<1?i=1:e>this.internalPageCount&&(i=this.internalPageCount):(isNaN(e)||e<1)&&(i=1),void 0===i&&isNaN(e)?i=1:0===i&&(i=1),void 0===i?e:i}},computed:{internalPageCount:function(){return"number"==typeof this.total?Math.ceil(this.total/this.internalPageSize):"number"==typeof this.pageCount?this.pageCount:null}},watch:{currentPage:{immediate:!0,handler:function(e){this.internalCurrentPage=e}},pageSize:{immediate:!0,handler:function(e){this.internalPageSize=e}},internalCurrentPage:function(e,t){var i=this;e=parseInt(e,10),e=isNaN(e)?t||1:this.getValidCurrentPage(e),void 0!==e?this.$nextTick(function(){i.internalCurrentPage=e,t!==e&&(i.$emit("update:currentPage",e),i.$emit("current-change",i.internalCurrentPage))}):(this.$emit("update:currentPage",e),this.$emit("current-change",this.internalCurrentPage))},internalPageCount:function(e){var t=this.internalCurrentPage;e>0&&0===t?this.internalCurrentPage=1:t>e&&(this.internalCurrentPage=0===e?1:e)}}}},function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=i(95),s=i.n(n),r=i(96),a=i(0),o=a(s.a,r.a,!1,null,null,null);t.default=o.exports},function(e,t,i){"use strict";t.__esModule=!0,t.default={name:"ElPager",props:{currentPage:Number,pageCount:Number},watch:{showPrevMore:function(e){e||(this.quickprevIconClass="el-icon-more")},showNextMore:function(e){e||(this.quicknextIconClass="el-icon-more")}},methods:{onPagerClick:function(e){var t=e.target;if("UL"!==t.tagName){var i=Number(e.target.textContent),n=this.pageCount,s=this.currentPage;-1!==t.className.indexOf("more")&&(-1!==t.className.indexOf("quickprev")?i=s-5:-1!==t.className.indexOf("quicknext")&&(i=s+5)),isNaN(i)||(i<1&&(i=1),i>n&&(i=n)),i!==s&&this.$emit("change",i)}}},computed:{pagers:function(){var e=Number(this.currentPage),t=Number(this.pageCount),i=!1,n=!1;t>7&&(e>4&&(i=!0),e<t-3&&(n=!0));var s=[];if(i&&!n)for(var r=t-5,a=r;a<t;a++)s.push(a);else if(!i&&n)for(var o=2;o<7;o++)s.push(o);else if(i&&n)for(var l=Math.floor(3.5)-1,u=e-l;u<=e+l;u++)s.push(u);else for(var c=2;c<t;c++)s.push(c);return this.showPrevMore=i,this.showNextMore=n,s}},data:function(){return{current:null,showPrevMore:!1,showNextMore:!1,quicknextIconClass:"el-icon-more",quickprevIconClass:"el-icon-more"}}}},function(e,t,i){"use strict";var n=function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("ul",{staticClass:"el-pager",on:{click:e.onPagerClick}},[e.pageCount>0?i("li",{staticClass:"number",class:{active:1===e.currentPage}},[e._v("1")]):e._e(),e.showPrevMore?i("li",{staticClass:"el-icon more btn-quickprev",class:[e.quickprevIconClass],on:{mouseenter:function(t){e.quickprevIconClass="el-icon-d-arrow-left"},mouseleave:function(t){e.quickprevIconClass="el-icon-more"}}}):e._e(),e._l(e.pagers,function(t){return i("li",{staticClass:"number",class:{active:e.currentPage===t}},[e._v(e._s(t))])}),e.showNextMore?i("li",{staticClass:"el-icon more btn-quicknext",class:[e.quicknextIconClass],on:{mouseenter:function(t){e.quicknextIconClass="el-icon-d-arrow-right"},mouseleave:function(t){e.quicknextIconClass="el-icon-more"}}}):e._e(),e.pageCount>1?i("li",{staticClass:"number",class:{active:e.currentPage===e.pageCount}},[e._v(e._s(e.pageCount))]):e._e()],2)},s=[],r={render:n,staticRenderFns:s};t.a=r},function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=i(98),s=i.n(n),r=i(120),a=i(0),o=a(s.a,r.a,!1,null,null,null);t.default=o.exports},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0;var s="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},r=i(1),a=n(r),o=i(26),l=n(o),u=i(5),c=n(u),d=i(8),h=n(d),f=i(106),p=n(f),m=i(66),v=n(m),g=i(31),b=n(g),y=i(27),_=n(y),x=i(13),C=n(x),w=i(17),k=n(w),S=i(4),M=i(28),$=i(16),E=i(44),D=n(E),T=i(6),P=i(119),O=n(P),N={medium:36,small:32,mini:28};t.default={mixins:[a.default,c.default,(0,l.default)("reference"),O.default],name:"ElSelect",componentName:"ElSelect",inject:{elFormItem:{default:""}},provide:function(){return{select:this}},computed:{_elFormItemSize:function(){return(this.elFormItem||{}).elFormItemSize},iconClass:function(){return this.clearable&&!this.disabled&&this.inputHovering&&!this.multiple&&void 0!==this.value&&""!==this.value?"circle-close is-show-close":this.remote&&this.filterable?"":"arrow-up"},debounce:function(){return this.remote?300:0},emptyText:function(){return this.loading?this.loadingText||this.t("el.select.loading"):(!this.remote||""!==this.query||0!==this.options.length)&&(this.filterable&&this.query&&this.options.length>0&&0===this.filteredOptionsCount?this.noMatchText||this.t("el.select.noMatch"):0===this.options.length?this.noDataText||this.t("el.select.noData"):null)},showNewOption:function(){var e=this,t=this.options.filter(function(e){return!e.created}).some(function(t){return t.currentLabel===e.query});return this.filterable&&this.allowCreate&&""!==this.query&&!t},selectSize:function(){return this.size||this._elFormItemSize||(this.$ELEMENT||{}).size},multipleText:function(){var e=this.selected;if(!e||!e.length)return"";var t=e.length,i=t>1?"(+"+(e.length-1)+")":"";return e[0].currentLabel+" "+i}},components:{ElInput:h.default,ElSelectMenu:p.default,ElOption:v.default,ElTag:b.default,ElScrollbar:_.default},directives:{Clickoutside:k.default},props:{name:String,id:String,value:{required:!0},size:String,disabled:Boolean,clearable:Boolean,filterable:Boolean,allowCreate:Boolean,loading:Boolean,popperClass:String,remote:Boolean,loadingText:String,noMatchText:String,noDataText:String,remoteMethod:Function,filterMethod:Function,multiple:Boolean,multipleLimit:{type:Number,default:0},placeholder:{type:String,default:function(){return(0,$.t)("el.select.placeholder")}},defaultFirstOption:Boolean,reserveKeyword:Boolean,valueKey:{type:String,default:"value"},collapseTags:Boolean},data:function(){return{options:[],cachedOptions:[],createdLabel:null,createdSelected:!1,selected:this.multiple?[]:{},inputLength:20,inputWidth:0,cachedPlaceHolder:"",optionsCount:0,filteredOptionsCount:0,visible:!1,selectedLabel:"",hoverIndex:-1,query:"",previousQuery:"",inputHovering:!1,currentPlaceholder:""}},watch:{disabled:function(){var e=this;this.$nextTick(function(){e.resetInputHeight()})},placeholder:function(e){this.cachedPlaceHolder=this.currentPlaceholder=e},value:function(e){this.multiple&&(this.resetInputHeight(),e.length>0||this.$refs.input&&""!==this.query?this.currentPlaceholder="":this.currentPlaceholder=this.cachedPlaceHolder,this.filterable&&!this.reserveKeyword&&(this.query="",this.handleQueryChange(this.query))),this.setSelected(),this.filterable&&!this.multiple&&(this.inputLength=20)},visible:function(e){var t=this;e?(this.handleIconShow(),this.broadcast("ElSelectDropdown","updatePopper"),this.filterable&&(this.query=this.remote?"":this.selectedLabel,this.handleQueryChange(this.query),this.multiple?this.$refs.input.focus():(this.remote||(this.broadcast("ElOption","queryChange",""),this.broadcast("ElOptionGroup","queryChange")),this.broadcast("ElInput","inputSelect")))):(this.$refs.reference.$el.querySelector("input").blur(),this.handleIconHide(),this.broadcast("ElSelectDropdown","destroyPopper"),this.$refs.input&&this.$refs.input.blur(),this.query="",this.selectedLabel="",this.inputLength=20,this.resetHoverIndex(),this.$nextTick(function(){t.$refs.input&&""===t.$refs.input.value&&0===t.selected.length&&(t.currentPlaceholder=t.cachedPlaceHolder)}),this.multiple||this.selected&&(this.filterable&&this.allowCreate&&this.createdSelected&&this.createdOption?this.selectedLabel=this.createdLabel:this.selectedLabel=this.selected.currentLabel,this.filterable&&(this.query=this.selectedLabel))),this.$emit("visible-change",e)},options:function(){if(!this.$isServer){this.multiple&&this.resetInputHeight();var e=this.$el.querySelectorAll("input");-1===[].indexOf.call(e,document.activeElement)&&this.setSelected(),this.defaultFirstOption&&(this.filterable||this.remote)&&this.filteredOptionsCount&&this.checkDefaultFirstOption()}}},methods:{handleQueryChange:function(e){var t=this;if(this.previousQuery!==e){if(this.previousQuery=e,this.$nextTick(function(){t.visible&&t.broadcast("ElSelectDropdown","updatePopper")}),this.hoverIndex=-1,this.multiple&&this.filterable){var i=15*this.$refs.input.value.length+20;this.inputLength=this.collapseTags?Math.min(50,i):i,this.managePlaceholder(),this.resetInputHeight()}this.remote&&"function"==typeof this.remoteMethod?(this.hoverIndex=-1,this.remoteMethod(e)):"function"==typeof this.filterMethod?(this.filterMethod(e),this.broadcast("ElOptionGroup","queryChange")):(this.filteredOptionsCount=this.optionsCount,this.broadcast("ElOption","queryChange",e),this.broadcast("ElOptionGroup","queryChange")),this.defaultFirstOption&&(this.filterable||this.remote)&&this.filteredOptionsCount&&this.checkDefaultFirstOption()}},handleIconHide:function(){var e=this.$el.querySelector(".el-input__icon");e&&(0,S.removeClass)(e,"is-reverse")},handleIconShow:function(){var e=this.$el.querySelector(".el-input__icon");e&&!(0,S.hasClass)(e,"el-icon-circle-close")&&(0,S.addClass)(e,"is-reverse")},scrollToOption:function(e){var t=Array.isArray(e)&&e[0]?e[0].$el:e.$el;if(this.$refs.popper&&t){var i=this.$refs.popper.$el.querySelector(".el-select-dropdown__wrap");(0,D.default)(i,t)}this.$refs.scrollbar&&this.$refs.scrollbar.handleScroll()},handleMenuEnter:function(){var e=this;this.$nextTick(function(){return e.scrollToOption(e.selected)})},emitChange:function(e){(0,T.valueEquals)(this.value,e)||(this.$emit("change",e),this.dispatch("ElFormItem","el.form.change",e))},getOption:function(e){for(var t=void 0,i="[object object]"===Object.prototype.toString.call(e).toLowerCase(),n=this.cachedOptions.length-1;n>=0;n--){var s=this.cachedOptions[n];if(i?(0,T.getValueByPath)(s.value,this.valueKey)===(0,T.getValueByPath)(e,this.valueKey):s.value===e){t=s;break}}if(t)return t;var r=i?"":e,a={value:e,currentLabel:r};return this.multiple&&(a.hitState=!1),a},setSelected:function(){var e=this;if(!this.multiple){var t=this.getOption(this.value);return t.created?(this.createdLabel=t.currentLabel,this.createdSelected=!0):this.createdSelected=!1,this.selectedLabel=t.currentLabel,this.selected=t,void(this.filterable&&(this.query=this.selectedLabel))}var i=[];Array.isArray(this.value)&&this.value.forEach(function(t){i.push(e.getOption(t))}),this.selected=i,this.$nextTick(function(){e.resetInputHeight()})},handleFocus:function(e){this.visible=!0,this.$emit("focus",e)},handleBlur:function(e){this.$emit("blur",e)},handleIconClick:function(e){this.iconClass.indexOf("circle-close")>-1?this.deleteSelected(e):this.toggleMenu()},handleMouseDown:function(e){"INPUT"===e.target.tagName&&this.visible&&(this.handleClose(),e.preventDefault())},doDestroy:function(){this.$refs.popper&&this.$refs.popper.doDestroy()},handleClose:function(){this.visible=!1},toggleLastOptionHitState:function(e){if(Array.isArray(this.selected)){var t=this.selected[this.selected.length-1];if(t)return!0===e||!1===e?(t.hitState=e,e):(t.hitState=!t.hitState,t.hitState)}},deletePrevTag:function(e){if(e.target.value.length<=0&&!this.toggleLastOptionHitState()){var t=this.value.slice();t.pop(),this.$emit("input",t),this.emitChange(t)}},managePlaceholder:function(){""!==this.currentPlaceholder&&(this.currentPlaceholder=this.$refs.input.value?"":this.cachedPlaceHolder)},resetInputState:function(e){8!==e.keyCode&&this.toggleLastOptionHitState(!1),this.inputLength=15*this.$refs.input.value.length+20,this.resetInputHeight()},resetInputHeight:function(){var e=this;this.collapseTags||this.$nextTick(function(){if(e.$refs.reference){var t=e.$refs.reference.$el.childNodes,i=[].filter.call(t,function(e){return"INPUT"===e.tagName})[0],n=e.$refs.tags;i.style.height=0===e.selected.length?(N[e.selectSize]||40)+"px":Math.max(n?n.clientHeight+10:0,N[e.selectSize]||40)+"px",e.visible&&!1!==e.emptyText&&e.broadcast("ElSelectDropdown","updatePopper")}})},resetHoverIndex:function(){var e=this;setTimeout(function(){e.multiple?e.selected.length>0?e.hoverIndex=Math.min.apply(null,e.selected.map(function(t){return e.options.indexOf(t)})):e.hoverIndex=-1:e.hoverIndex=e.options.indexOf(e.selected)},300)},handleOptionSelect:function(e){var t=this;if(this.multiple){var i=this.value.slice(),n=this.getValueIndex(i,e.value);n>-1?i.splice(n,1):(this.multipleLimit<=0||i.length<this.multipleLimit)&&i.push(e.value),this.$emit("input",i),this.emitChange(i),e.created&&(this.query="",this.handleQueryChange(""),this.inputLength=20),this.filterable&&this.$refs.input.focus()}else this.$emit("input",e.value),this.emitChange(e.value),this.visible=!1;this.$nextTick(function(){return t.scrollToOption(e)})},getValueIndex:function(){var e=this,t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[],i=arguments[1];if("[object object]"!==Object.prototype.toString.call(i).toLowerCase())return t.indexOf(i);var n=function(){var n=e.valueKey,s=-1;return t.some(function(e,t){return(0,T.getValueByPath)(e,n)===(0,T.getValueByPath)(i,n)&&(s=t,!0)}),{v:s}}();return"object"===(void 0===n?"undefined":s(n))?n.v:void 0},toggleMenu:function(){this.disabled||(this.visible=!this.visible,this.visible&&(this.$refs.input||this.$refs.reference).focus())},selectOption:function(){this.options[this.hoverIndex]&&this.handleOptionSelect(this.options[this.hoverIndex])},deleteSelected:function(e){e.stopPropagation(),this.$emit("input",""),this.emitChange(""),this.visible=!1,this.$emit("clear")},deleteTag:function(e,t){var i=this.selected.indexOf(t);if(i>-1&&!this.disabled){var n=this.value.slice();n.splice(i,1),this.$emit("input",n),this.emitChange(n),this.$emit("remove-tag",t)}e.stopPropagation()},onInputChange:function(){this.filterable&&this.query!==this.selectedLabel&&(this.query=this.selectedLabel,this.handleQueryChange(this.query))},onOptionDestroy:function(e){e>-1&&(this.optionsCount--,this.filteredOptionsCount--,this.options.splice(e,1))},resetInputWidth:function(){this.inputWidth=this.$refs.reference.$el.getBoundingClientRect().width},handleResize:function(){this.resetInputWidth(),this.multiple&&this.resetInputHeight()},checkDefaultFirstOption:function(){this.hoverIndex=-1;for(var e=0;e!==this.options.length;++e){var t=this.options[e];if(this.query){if(!t.disabled&&!t.groupDisabled&&t.visible){this.hoverIndex=e;break}}else if(t.itemSelected){this.hoverIndex=e;break}}},getValueKey:function(e){return"[object object]"!==Object.prototype.toString.call(e.value).toLowerCase()?e.value:(0,T.getValueByPath)(e.value,this.valueKey)}},created:function(){var e=this;this.cachedPlaceHolder=this.currentPlaceholder=this.placeholder,this.multiple&&!Array.isArray(this.value)&&this.$emit("input",[]),!this.multiple&&Array.isArray(this.value)&&this.$emit("input",""),this.debouncedOnInputChange=(0,C.default)(this.debounce,function(){e.onInputChange()}),this.$on("handleOptionClick",this.handleOptionSelect),this.$on("setSelected",this.setSelected)},mounted:function(){var e=this;this.multiple&&Array.isArray(this.value)&&this.value.length>0&&(this.currentPlaceholder=""),(0,M.addResizeListener)(this.$el,this.handleResize),this.remote&&this.multiple&&this.resetInputHeight(),this.$nextTick(function(){e.$refs.reference&&e.$refs.reference.$el&&(e.inputWidth=e.$refs.reference.$el.getBoundingClientRect().width)}),this.setSelected()},beforeDestroy:function(){this.$el&&this.handleResize&&(0,M.removeResizeListener)(this.$el,this.handleResize)}}},function(e,t,i){"use strict";t.__esModule=!0,t.default={el:{colorpicker:{confirm:"确定",clear:"清空"},datepicker:{now:"此刻",today:"今天",cancel:"取消",clear:"清空",confirm:"确定",selectDate:"选择日期",selectTime:"选择时间",startDate:"开始日期",startTime:"开始时间",endDate:"结束日期",endTime:"结束时间",prevYear:"前一年",nextYear:"后一年",prevMonth:"上个月",nextMonth:"下个月",year:"年",month1:"1 月",month2:"2 月",month3:"3 月",month4:"4 月",month5:"5 月",month6:"6 月",month7:"7 月",month8:"8 月",month9:"9 月",month10:"10 月",month11:"11 月",month12:"12 月",weeks:{sun:"日",mon:"一",tue:"二",wed:"三",thu:"四",fri:"五",sat:"六"},months:{jan:"一月",feb:"二月",mar:"三月",apr:"四月",may:"五月",jun:"六月",jul:"七月",aug:"八月",sep:"九月",oct:"十月",nov:"十一月",dec:"十二月"}},select:{loading:"加载中",noMatch:"无匹配数据",noData:"无数据",placeholder:"请选择"},cascader:{noMatch:"无匹配数据",loading:"加载中",placeholder:"请选择"},pagination:{goto:"前往",pagesize:"条/页",total:"共 {total} 条",pageClassifier:"页"},messagebox:{title:"提示",confirm:"确定",cancel:"取消",error:"输入的数据不合法!"},upload:{deleteTip:"按 delete 键可删除",delete:"删除",preview:"查看图片",continue:"继续上传"},table:{emptyText:"暂无数据",confirmFilter:"筛选",resetFilter:"重置",clearFilter:"全部",sumText:"合计"},tree:{emptyText:"暂无数据"},transfer:{noMatch:"无匹配数据",noData:"无数据",titles:["列表 1","列表 2"],filterPlaceholder:"请输入搜索内容",noCheckedFormat:"共 {total} 项",hasCheckedFormat:"已选 {checked}/{total} 项"}}}},function(e,t,i){var n,s;!function(r,a){n=a,void 0!==(s="function"==typeof n?n.call(t,i,t,e):n)&&(e.exports=s)}(0,function(){function e(e){return e&&"object"==typeof e&&"[object RegExp]"!==Object.prototype.toString.call(e)&&"[object Date]"!==Object.prototype.toString.call(e)}function t(e){return Array.isArray(e)?[]:{}}function i(i,n){return n&&!0===n.clone&&e(i)?r(t(i),i,n):i}function n(t,n,s){var a=t.slice();return n.forEach(function(n,o){void 0===a[o]?a[o]=i(n,s):e(n)?a[o]=r(t[o],n,s):-1===t.indexOf(n)&&a.push(i(n,s))}),a}function s(t,n,s){var a={};return e(t)&&Object.keys(t).forEach(function(e){a[e]=i(t[e],s)}),Object.keys(n).forEach(function(o){e(n[o])&&t[o]?a[o]=r(t[o],n[o],s):a[o]=i(n[o],s)}),a}function r(e,t,r){var a=Array.isArray(t),o=r||{arrayMerge:n},l=o.arrayMerge||n;return a?Array.isArray(e)?l(e,t,r):i(t,r):s(e,t,r)}return r.all=function(e,t){if(!Array.isArray(e)||e.length<2)throw new Error("first argument should be an array with at least two elements");return e.reduce(function(e,i){return r(e,i,t)})},r})},function(e,t,i){"use strict";t.__esModule=!0;var n="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e};t.default=function(e){function t(e){for(var t=arguments.length,i=Array(t>1?t-1:0),a=1;a<t;a++)i[a-1]=arguments[a];return 1===i.length&&"object"===n(i[0])&&(i=i[0]),i&&i.hasOwnProperty||(i={}),e.replace(r,function(t,n,r,a){var o=void 0;return"{"===e[a-1]&&"}"===e[a+t.length]?r:(o=(0,s.hasOwn)(i,r)?i[r]:null,null===o||void 0===o?"":o)})}return t};var s=i(6),r=/(%|)\{([0-9a-zA-Z_]+)\}/g},function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=i(103),s=i.n(n),r=i(105),a=i(0),o=a(s.a,r.a,!1,null,null,null);t.default=o.exports},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0;var s=i(1),r=n(s),a=i(9),o=n(a),l=i(104),u=n(l),c=i(12),d=n(c);t.default={name:"ElInput",componentName:"ElInput",mixins:[r.default,o.default],inject:{elForm:{default:""},elFormItem:{default:""}},data:function(){return{currentValue:this.value,textareaCalcStyle:{},prefixOffset:null,suffixOffset:null,hovering:!1,focused:!1}},props:{value:[String,Number],placeholder:String,size:String,resize:String,name:String,form:String,id:String,maxlength:Number,minlength:Number,readonly:Boolean,autofocus:Boolean,disabled:Boolean,type:{type:String,default:"text"},autosize:{type:[Boolean,Object],default:!1},rows:{type:Number,default:2},autoComplete:{type:String,default:"off"},max:{},min:{},step:{},validateEvent:{type:Boolean,default:!0},suffixIcon:String,prefixIcon:String,label:String,clearable:{type:Boolean,default:!1}},computed:{_elFormItemSize:function(){return(this.elFormItem||{}).elFormItemSize},validateState:function(){return this.elFormItem?this.elFormItem.validateState:""},needStatusIcon:function(){return!!this.elForm&&this.elForm.statusIcon},validateIcon:function(){return{validating:"el-icon-loading",success:"el-icon-circle-check",error:"el-icon-circle-close"}[this.validateState]},textareaStyle:function(){return(0,d.default)({},this.textareaCalcStyle,{resize:this.resize})},inputSize:function(){return this.size||this._elFormItemSize||(this.$ELEMENT||{}).size},isGroup:function(){return this.$slots.prepend||this.$slots.append},showClear:function(){return this.clearable&&""!==this.currentValue&&(this.focused||this.hovering)}},watch:{value:function(e,t){this.setCurrentValue(e)}},methods:{focus:function(){(this.$refs.input||this.$refs.textarea).focus()},getMigratingConfig:function(){return{props:{icon:"icon is removed, use suffix-icon / prefix-icon instead.","on-icon-click":"on-icon-click is removed."},events:{click:"click is removed."}}},handleBlur:function(e){this.focused=!1,this.$emit("blur",e),this.validateEvent&&this.dispatch("ElFormItem","el.form.blur",[this.currentValue])},inputSelect:function(){(this.$refs.input||this.$refs.textarea).select()},resizeTextarea:function(){if(!this.$isServer){var e=this.autosize;if("textarea"===this.type){if(!e)return void(this.textareaCalcStyle={minHeight:(0,u.default)(this.$refs.textarea).minHeight});var t=e.minRows,i=e.maxRows;this.textareaCalcStyle=(0,u.default)(this.$refs.textarea,t,i)}}},handleFocus:function(e){this.focused=!0,this.$emit("focus",e)},handleInput:function(e){var t=e.target.value;this.$emit("input",t),this.setCurrentValue(t)},handleChange:function(e){this.$emit("change",e.target.value)},setCurrentValue:function(e){var t=this;e!==this.currentValue&&(this.$nextTick(function(e){t.resizeTextarea()}),this.currentValue=e,this.validateEvent&&this.dispatch("ElFormItem","el.form.change",[e]))},calcIconOffset:function(e){var t={suf:"append",pre:"prepend"},i=t[e];if(this.$slots[i])return{transform:"translateX("+("suf"===e?"-":"")+this.$el.querySelector(".el-input-group__"+i).offsetWidth+"px)"}},clear:function(){this.$emit("input",""),this.$emit("change",""),this.setCurrentValue(""),this.focus()}},created:function(){this.$on("inputSelect",this.inputSelect)},mounted:function(){this.resizeTextarea(),this.isGroup&&(this.prefixOffset=this.calcIconOffset("pre"),this.suffixOffset=this.calcIconOffset("suf"))}}},function(e,t,i){"use strict";function n(e){var t=window.getComputedStyle(e),i=t.getPropertyValue("box-sizing"),n=parseFloat(t.getPropertyValue("padding-bottom"))+parseFloat(t.getPropertyValue("padding-top")),s=parseFloat(t.getPropertyValue("border-bottom-width"))+parseFloat(t.getPropertyValue("border-top-width"));return{contextStyle:o.map(function(e){return e+":"+t.getPropertyValue(e)}).join(";"),paddingSize:n,borderSize:s,boxSizing:i}}function s(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:1,i=arguments.length>2&&void 0!==arguments[2]?arguments[2]:null;r||(r=document.createElement("textarea"),document.body.appendChild(r));var s=n(e),o=s.paddingSize,l=s.borderSize,u=s.boxSizing,c=s.contextStyle;r.setAttribute("style",c+";"+a),r.value=e.value||e.placeholder||"";var d=r.scrollHeight,h={};"border-box"===u?d+=l:"content-box"===u&&(d-=o),r.value="";var f=r.scrollHeight-o;if(null!==t){var p=f*t;"border-box"===u&&(p=p+o+l),d=Math.max(p,d),h.minHeight=p+"px"}if(null!==i){var m=f*i;"border-box"===u&&(m=m+o+l),d=Math.min(m,d)}return h.height=d+"px",r.parentNode&&r.parentNode.removeChild(r),r=null,h}t.__esModule=!0,t.default=s;var r=void 0,a="\n  height:0 !important;\n  visibility:hidden !important;\n  overflow:hidden !important;\n  position:absolute !important;\n  z-index:-1000 !important;\n  top:0 !important;\n  right:0 !important\n",o=["letter-spacing","line-height","padding-top","padding-bottom","font-family","font-weight","font-size","text-rendering","text-transform","width","text-indent","padding-left","padding-right","border-width","box-sizing"]},function(e,t,i){"use strict";var n=function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("div",{class:["textarea"===e.type?"el-textarea":"el-input",e.inputSize?"el-input--"+e.inputSize:"",{"is-disabled":e.disabled,"el-input-group":e.$slots.prepend||e.$slots.append,"el-input-group--append":e.$slots.append,"el-input-group--prepend":e.$slots.prepend,"el-input--prefix":e.$slots.prefix||e.prefixIcon,"el-input--suffix":e.$slots.suffix||e.suffixIcon}],on:{mouseenter:function(t){e.hovering=!0},mouseleave:function(t){e.hovering=!1}}},["textarea"!==e.type?[e.$slots.prepend?i("div",{staticClass:"el-input-group__prepend",attrs:{tabindex:"0"}},[e._t("prepend")],2):e._e(),"textarea"!==e.type?i("input",e._b({ref:"input",staticClass:"el-input__inner",attrs:{autocomplete:e.autoComplete,"aria-label":e.label},domProps:{value:e.currentValue},on:{input:e.handleInput,focus:e.handleFocus,blur:e.handleBlur,change:e.handleChange}},"input",e.$props,!1)):e._e(),e.$slots.prefix||e.prefixIcon?i("span",{staticClass:"el-input__prefix",style:e.prefixOffset},[e._t("prefix"),e.prefixIcon?i("i",{staticClass:"el-input__icon",class:e.prefixIcon}):e._e()],2):e._e(),e.$slots.suffix||e.suffixIcon||e.showClear||e.validateState&&e.needStatusIcon?i("span",{staticClass:"el-input__suffix",style:e.suffixOffset},[i("span",{staticClass:"el-input__suffix-inner"},[e.showClear?i("i",{staticClass:"el-input__icon el-icon-circle-close el-input__clear",on:{click:e.clear}}):[e._t("suffix"),e.suffixIcon?i("i",{staticClass:"el-input__icon",class:e.suffixIcon}):e._e()]],2),e.validateState?i("i",{staticClass:"el-input__icon",class:["el-input__validateIcon",e.validateIcon]}):e._e()]):e._e(),e.$slots.append?i("div",{staticClass:"el-input-group__append"},[e._t("append")],2):e._e()]:i("textarea",e._b({ref:"textarea",staticClass:"el-textarea__inner",style:e.textareaStyle,attrs:{"aria-label":e.label},domProps:{value:e.currentValue},on:{input:e.handleInput,focus:e.handleFocus,blur:e.handleBlur,change:e.handleChange}},"textarea",e.$props,!1))],2)},s=[],r={render:n,staticRenderFns:s};t.a=r},function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=i(107),s=i.n(n),r=i(110),a=i(0),o=a(s.a,r.a,!1,null,null,null);t.default=o.exports},function(e,t,i){"use strict";t.__esModule=!0;var n=i(10),s=function(e){return e&&e.__esModule?e:{default:e}}(n);t.default={name:"ElSelectDropdown",componentName:"ElSelectDropdown",mixins:[s.default],props:{placement:{default:"bottom-start"},boundariesPadding:{default:0},popperOptions:{default:function(){return{gpuAcceleration:!1}}},visibleArrow:{default:!0}},data:function(){return{minWidth:""}},computed:{popperClass:function(){return this.$parent.popperClass}},watch:{"$parent.inputWidth":function(){this.minWidth=this.$parent.$el.getBoundingClientRect().width+"px"}},mounted:function(){var e=this;this.referenceElm=this.$parent.$refs.reference.$el,this.$parent.popperElm=this.popperElm=this.$el,this.$on("updatePopper",function(){e.$parent.visible&&e.updatePopper()}),this.$on("destroyPopper",this.destroyPopper)}}},function(e,t,i){"use strict";t.__esModule=!0;var n=i(2),s=function(e){return e&&e.__esModule?e:{default:e}}(n),r=i(4),a=!1,o=function(){if(!s.default.prototype.$isServer){var e=u.modalDom;return e?a=!0:(a=!1,e=document.createElement("div"),u.modalDom=e,e.addEventListener("touchmove",function(e){e.preventDefault(),e.stopPropagation()}),e.addEventListener("click",function(){u.doOnModalClick&&u.doOnModalClick()})),e}},l={},u={zIndex:2e3,modalFade:!0,getInstance:function(e){return l[e]},register:function(e,t){e&&t&&(l[e]=t)},deregister:function(e){e&&(l[e]=null,delete l[e])},nextZIndex:function(){return u.zIndex++},modalStack:[],doOnModalClick:function(){var e=u.modalStack[u.modalStack.length-1];if(e){var t=u.getInstance(e.id);t&&t.closeOnClickModal&&t.close()}},openModal:function(e,t,i,n,l){if(!s.default.prototype.$isServer&&e&&void 0!==t){this.modalFade=l;for(var u=this.modalStack,c=0,d=u.length;c<d;c++){if(u[c].id===e)return}var h=o();if((0,r.addClass)(h,"v-modal"),this.modalFade&&!a&&(0,r.addClass)(h,"v-modal-enter"),n){n.trim().split(/\s+/).forEach(function(e){return(0,r.addClass)(h,e)})}setTimeout(function(){(0,r.removeClass)(h,"v-modal-enter")},200),i&&i.parentNode&&11!==i.parentNode.nodeType?i.parentNode.appendChild(h):document.body.appendChild(h),t&&(h.style.zIndex=t),h.tabIndex=0,h.style.display="",this.modalStack.push({id:e,zIndex:t,modalClass:n})}},closeModal:function(e){var t=this.modalStack,i=o();if(t.length>0){var n=t[t.length-1];if(n.id===e){if(n.modalClass){n.modalClass.trim().split(/\s+/).forEach(function(e){return(0,r.removeClass)(i,e)})}t.pop(),t.length>0&&(i.style.zIndex=t[t.length-1].zIndex)}else for(var s=t.length-1;s>=0;s--)if(t[s].id===e){t.splice(s,1);break}}0===t.length&&(this.modalFade&&(0,r.addClass)(i,"v-modal-leave"),setTimeout(function(){0===t.length&&(i.parentNode&&i.parentNode.removeChild(i),i.style.display="none",u.modalDom=void 0),(0,r.removeClass)(i,"v-modal-leave")},200))}},c=function(){if(!s.default.prototype.$isServer&&u.modalStack.length>0){var e=u.modalStack[u.modalStack.length-1];if(!e)return;return u.getInstance(e.id)}};s.default.prototype.$isServer||window.addEventListener("keydown",function(e){if(27===e.keyCode){var t=c();t&&t.closeOnPressEscape&&(t.handleClose?t.handleClose():t.handleAction?t.handleAction("cancel"):t.close())}}),t.default=u},function(e,t,i){var n,s;!function(r,a){n=a,void 0!==(s="function"==typeof n?n.call(t,i,t,e):n)&&(e.exports=s)}(0,function(){"use strict";function e(e,t,i){this._reference=e.jquery?e[0]:e,this.state={};var n=void 0===t||null===t,s=t&&"[object Object]"===Object.prototype.toString.call(t);return this._popper=n||s?this.parse(s?t:{}):t.jquery?t[0]:t,this._options=Object.assign({},v,i),this._options.modifiers=this._options.modifiers.map(function(e){if(-1===this._options.modifiersIgnored.indexOf(e))return"applyStyle"===e&&this._popper.setAttribute("x-placement",this._options.placement),this.modifiers[e]||e}.bind(this)),this.state.position=this._getPosition(this._popper,this._reference),u(this._popper,{position:this.state.position,top:0}),this.update(),this._setupEventListeners(),this}function t(e){var t=e.style.display,i=e.style.visibility;e.style.display="block",e.style.visibility="hidden";var n=(e.offsetWidth,m.getComputedStyle(e)),s=parseFloat(n.marginTop)+parseFloat(n.marginBottom),r=parseFloat(n.marginLeft)+parseFloat(n.marginRight),a={width:e.offsetWidth+r,height:e.offsetHeight+s};return e.style.display=t,e.style.visibility=i,a}function i(e){var t={left:"right",right:"left",bottom:"top",top:"bottom"};return e.replace(/left|right|bottom|top/g,function(e){return t[e]})}function n(e){var t=Object.assign({},e);return t.right=t.left+t.width,t.bottom=t.top+t.height,t}function s(e,t){var i,n=0;for(i in e){if(e[i]===t)return n;n++}return null}function r(e,t){return m.getComputedStyle(e,null)[t]}function a(e){var t=e.offsetParent;return t!==m.document.body&&t?t:m.document.documentElement}function o(e){var t=e.parentNode;return t?t===m.document?m.document.body.scrollTop?m.document.body:m.document.documentElement:-1!==["scroll","auto"].indexOf(r(t,"overflow"))||-1!==["scroll","auto"].indexOf(r(t,"overflow-x"))||-1!==["scroll","auto"].indexOf(r(t,"overflow-y"))?t:o(e.parentNode):e}function l(e){return e!==m.document.body&&("fixed"===r(e,"position")||(e.parentNode?l(e.parentNode):e))}function u(e,t){function i(e){return""!==e&&!isNaN(parseFloat(e))&&isFinite(e)}Object.keys(t).forEach(function(n){var s="";-1!==["width","height","top","right","bottom","left"].indexOf(n)&&i(t[n])&&(s="px"),e.style[n]=t[n]+s})}function c(e){var t={};return e&&"[object Function]"===t.toString.call(e)}function d(e){var t={width:e.offsetWidth,height:e.offsetHeight,left:e.offsetLeft,top:e.offsetTop};return t.right=t.left+t.width,t.bottom=t.top+t.height,t}function h(e){var t=e.getBoundingClientRect(),i=-1!=navigator.userAgent.indexOf("MSIE"),n=i&&"HTML"===e.tagName?-e.scrollTop:t.top;return{left:t.left,top:n,right:t.right,bottom:t.bottom,width:t.right-t.left,height:t.bottom-n}}function f(e,t,i){var n=h(e),s=h(t);if(i){var r=o(t);s.top+=r.scrollTop,s.bottom+=r.scrollTop,s.left+=r.scrollLeft,s.right+=r.scrollLeft}return{top:n.top-s.top,left:n.left-s.left,bottom:n.top-s.top+n.height,right:n.left-s.left+n.width,width:n.width,height:n.height}}function p(e){for(var t=["","ms","webkit","moz","o"],i=0;i<t.length;i++){var n=t[i]?t[i]+e.charAt(0).toUpperCase()+e.slice(1):e;if(void 0!==m.document.body.style[n])return n}return null}var m=window,v={placement:"bottom",gpuAcceleration:!0,offset:0,boundariesElement:"viewport",boundariesPadding:5,preventOverflowOrder:["left","right","top","bottom"],flipBehavior:"flip",arrowElement:"[x-arrow]",modifiers:["shift","offset","preventOverflow","keepTogether","arrow","flip","applyStyle"],modifiersIgnored:[],forceAbsolute:!1};return e.prototype.destroy=function(){return this._popper.removeAttribute("x-placement"),this._popper.style.left="",this._popper.style.position="",this._popper.style.top="",this._popper.style[p("transform")]="",this._removeEventListeners(),this._options.removeOnDestroy&&this._popper.remove(),this},e.prototype.update=function(){var e={instance:this,styles:{}};e.placement=this._options.placement,e._originalPlacement=this._options.placement,e.offsets=this._getOffsets(this._popper,this._reference,e.placement),e.boundaries=this._getBoundaries(e,this._options.boundariesPadding,this._options.boundariesElement),e=this.runModifiers(e,this._options.modifiers),"function"==typeof this.state.updateCallback&&this.state.updateCallback(e)},e.prototype.onCreate=function(e){return e(this),this},e.prototype.onUpdate=function(e){return this.state.updateCallback=e,this},e.prototype.parse=function(e){function t(e,t){t.forEach(function(t){e.classList.add(t)})}function i(e,t){t.forEach(function(t){e.setAttribute(t.split(":")[0],t.split(":")[1]||"")})}var n={tagName:"div",classNames:["popper"],attributes:[],parent:m.document.body,content:"",contentType:"text",arrowTagName:"div",arrowClassNames:["popper__arrow"],arrowAttributes:["x-arrow"]};e=Object.assign({},n,e);var s=m.document,r=s.createElement(e.tagName);if(t(r,e.classNames),i(r,e.attributes),"node"===e.contentType?r.appendChild(e.content.jquery?e.content[0]:e.content):"html"===e.contentType?r.innerHTML=e.content:r.textContent=e.content,e.arrowTagName){var a=s.createElement(e.arrowTagName);t(a,e.arrowClassNames),i(a,e.arrowAttributes),r.appendChild(a)}var o=e.parent.jquery?e.parent[0]:e.parent;if("string"==typeof o){if(o=s.querySelectorAll(e.parent),o.length>1&&console.warn("WARNING: the given `parent` query("+e.parent+") matched more than one element, the first one will be used"),0===o.length)throw"ERROR: the given `parent` doesn't exists!";o=o[0]}return o.length>1&&o instanceof Element==!1&&(console.warn("WARNING: you have passed as parent a list of elements, the first one will be used"),o=o[0]),o.appendChild(r),r},e.prototype._getPosition=function(e,t){var i=a(t);return this._options.forceAbsolute?"absolute":l(t,i)?"fixed":"absolute"},e.prototype._getOffsets=function(e,i,n){n=n.split("-")[0];var s={};s.position=this.state.position;var r="fixed"===s.position,o=f(i,a(e),r),l=t(e);return-1!==["right","left"].indexOf(n)?(s.top=o.top+o.height/2-l.height/2,s.left="left"===n?o.left-l.width:o.right):(s.left=o.left+o.width/2-l.width/2,s.top="top"===n?o.top-l.height:o.bottom),s.width=l.width,s.height=l.height,{popper:s,reference:o}},e.prototype._setupEventListeners=function(){if(this.state.updateBound=this.update.bind(this),m.addEventListener("resize",this.state.updateBound),"window"!==this._options.boundariesElement){var e=o(this._reference);e!==m.document.body&&e!==m.document.documentElement||(e=m),e.addEventListener("scroll",this.state.updateBound)}},e.prototype._removeEventListeners=function(){if(m.removeEventListener("resize",this.state.updateBound),"window"!==this._options.boundariesElement){var e=o(this._reference);e!==m.document.body&&e!==m.document.documentElement||(e=m),e.removeEventListener("scroll",this.state.updateBound)}this.state.updateBound=null},e.prototype._getBoundaries=function(e,t,i){var n,s,r={};if("window"===i){var l=m.document.body,u=m.document.documentElement;s=Math.max(l.scrollHeight,l.offsetHeight,u.clientHeight,u.scrollHeight,u.offsetHeight),n=Math.max(l.scrollWidth,l.offsetWidth,u.clientWidth,u.scrollWidth,u.offsetWidth),r={top:0,right:n,bottom:s,left:0}}else if("viewport"===i){var c=a(this._popper),h=o(this._popper),f=d(c),p="fixed"===e.offsets.popper.position?0:function(e){return e==document.body?Math.max(document.documentElement.scrollTop,document.body.scrollTop):e.scrollTop}(h),v="fixed"===e.offsets.popper.position?0:function(e){return e==document.body?Math.max(document.documentElement.scrollLeft,document.body.scrollLeft):e.scrollLeft}(h);r={top:0-(f.top-p),right:m.document.documentElement.clientWidth-(f.left-v),bottom:m.document.documentElement.clientHeight-(f.top-p),left:0-(f.left-v)}}else r=a(this._popper)===i?{top:0,left:0,right:i.clientWidth,bottom:i.clientHeight}:d(i);return r.left+=t,r.right-=t,r.top=r.top+t,r.bottom=r.bottom-t,r},e.prototype.runModifiers=function(e,t,i){var n=t.slice();return void 0!==i&&(n=this._options.modifiers.slice(0,s(this._options.modifiers,i))),n.forEach(function(t){c(t)&&(e=t.call(this,e))}.bind(this)),e},e.prototype.isModifierRequired=function(e,t){var i=s(this._options.modifiers,e);return!!this._options.modifiers.slice(0,i).filter(function(e){return e===t}).length},e.prototype.modifiers={},e.prototype.modifiers.applyStyle=function(e){var t,i={position:e.offsets.popper.position},n=Math.round(e.offsets.popper.left),s=Math.round(e.offsets.popper.top);return this._options.gpuAcceleration&&(t=p("transform"))?(i[t]="translate3d("+n+"px, "+s+"px, 0)",i.top=0,i.left=0):(i.left=n,i.top=s),Object.assign(i,e.styles),u(this._popper,i),this._popper.setAttribute("x-placement",e.placement),this.isModifierRequired(this.modifiers.applyStyle,this.modifiers.arrow)&&e.offsets.arrow&&u(e.arrowElement,e.offsets.arrow),e},e.prototype.modifiers.shift=function(e){var t=e.placement,i=t.split("-")[0],s=t.split("-")[1];if(s){var r=e.offsets.reference,a=n(e.offsets.popper),o={y:{start:{top:r.top},end:{top:r.top+r.height-a.height}},x:{start:{left:r.left},end:{left:r.left+r.width-a.width}}},l=-1!==["bottom","top"].indexOf(i)?"x":"y";e.offsets.popper=Object.assign(a,o[l][s])}return e},e.prototype.modifiers.preventOverflow=function(e){var t=this._options.preventOverflowOrder,i=n(e.offsets.popper),s={left:function(){var t=i.left;return i.left<e.boundaries.left&&(t=Math.max(i.left,e.boundaries.left)),{left:t}},right:function(){var t=i.left;return i.right>e.boundaries.right&&(t=Math.min(i.left,e.boundaries.right-i.width)),{left:t}},top:function(){var t=i.top;return i.top<e.boundaries.top&&(t=Math.max(i.top,e.boundaries.top)),{top:t}},bottom:function(){var t=i.top;return i.bottom>e.boundaries.bottom&&(t=Math.min(i.top,e.boundaries.bottom-i.height)),{top:t}}};return t.forEach(function(t){e.offsets.popper=Object.assign(i,s[t]())}),e},e.prototype.modifiers.keepTogether=function(e){var t=n(e.offsets.popper),i=e.offsets.reference,s=Math.floor;return t.right<s(i.left)&&(e.offsets.popper.left=s(i.left)-t.width),t.left>s(i.right)&&(e.offsets.popper.left=s(i.right)),t.bottom<s(i.top)&&(e.offsets.popper.top=s(i.top)-t.height),t.top>s(i.bottom)&&(e.offsets.popper.top=s(i.bottom)),e},e.prototype.modifiers.flip=function(e){if(!this.isModifierRequired(this.modifiers.flip,this.modifiers.preventOverflow))return console.warn("WARNING: preventOverflow modifier is required by flip modifier in order to work, be sure to include it before flip!"),e;if(e.flipped&&e.placement===e._originalPlacement)return e;var t=e.placement.split("-")[0],s=i(t),r=e.placement.split("-")[1]||"",a=[];return a="flip"===this._options.flipBehavior?[t,s]:this._options.flipBehavior,a.forEach(function(o,l){if(t===o&&a.length!==l+1){t=e.placement.split("-")[0],s=i(t);var u=n(e.offsets.popper),c=-1!==["right","bottom"].indexOf(t);(c&&Math.floor(e.offsets.reference[t])>Math.floor(u[s])||!c&&Math.floor(e.offsets.reference[t])<Math.floor(u[s]))&&(e.flipped=!0,e.placement=a[l+1],r&&(e.placement+="-"+r),e.offsets.popper=this._getOffsets(this._popper,this._reference,e.placement).popper,e=this.runModifiers(e,this._options.modifiers,this._flip))}}.bind(this)),e},e.prototype.modifiers.offset=function(e){var t=this._options.offset,i=e.offsets.popper;return-1!==e.placement.indexOf("left")?i.top-=t:-1!==e.placement.indexOf("right")?i.top+=t:-1!==e.placement.indexOf("top")?i.left-=t:-1!==e.placement.indexOf("bottom")&&(i.left+=t),e},e.prototype.modifiers.arrow=function(e){var i=this._options.arrowElement;if("string"==typeof i&&(i=this._popper.querySelector(i)),!i)return e;if(!this._popper.contains(i))return console.warn("WARNING: `arrowElement` must be child of its popper element!"),e;if(!this.isModifierRequired(this.modifiers.arrow,this.modifiers.keepTogether))return console.warn("WARNING: keepTogether modifier is required by arrow modifier in order to work, be sure to include it before arrow!"),e;var s={},r=e.placement.split("-")[0],a=n(e.offsets.popper),o=e.offsets.reference,l=-1!==["left","right"].indexOf(r),u=l?"height":"width",c=l?"top":"left",d=l?"left":"top",h=l?"bottom":"right",f=t(i)[u];o[h]-f<a[c]&&(e.offsets.popper[c]-=a[c]-(o[h]-f)),o[c]+f>a[h]&&(e.offsets.popper[c]+=o[c]+f-a[h]);var p=o[c]+o[u]/2-f/2,m=p-a[c];return m=Math.max(Math.min(a[u]-f-8,m),8),s[c]=m,s[d]="",e.offsets.arrow=s,e.arrowElement=i,e},Object.assign||Object.defineProperty(Object,"assign",{enumerable:!1,configurable:!0,writable:!0,value:function(e){if(void 0===e||null===e)throw new TypeError("Cannot convert first argument to object");for(var t=Object(e),i=1;i<arguments.length;i++){var n=arguments[i];if(void 0!==n&&null!==n){n=Object(n);for(var s=Object.keys(n),r=0,a=s.length;r<a;r++){var o=s[r],l=Object.getOwnPropertyDescriptor(n,o);void 0!==l&&l.enumerable&&(t[o]=n[o])}}}return t}}),e})},function(e,t,i){"use strict";var n=function(){var e=this,t=e.$createElement;return(e._self._c||t)("div",{staticClass:"el-select-dropdown el-popper",class:[{"is-multiple":e.$parent.multiple},e.popperClass],style:{minWidth:e.minWidth}},[e._t("default")],2)},s=[],r={render:n,staticRenderFns:s};t.a=r},function(e,t,i){"use strict";t.__esModule=!0;var n="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},s=i(1),r=function(e){return e&&e.__esModule?e:{default:e}}(s),a=i(6);t.default={mixins:[r.default],name:"ElOption",componentName:"ElOption",inject:["select"],props:{value:{required:!0},label:[String,Number],created:Boolean,disabled:{type:Boolean,default:!1}},data:function(){return{index:-1,groupDisabled:!1,visible:!0,hitState:!1,hover:!1}},computed:{isObject:function(){return"[object object]"===Object.prototype.toString.call(this.value).toLowerCase()},currentLabel:function(){return this.label||(this.isObject?"":this.value)},currentValue:function(){return this.value||this.label||""},itemSelected:function(){return this.select.multiple?this.contains(this.select.value,this.value):this.isEqual(this.value,this.select.value)},limitReached:function(){return!!this.select.multiple&&(!this.itemSelected&&this.select.value.length>=this.select.multipleLimit&&this.select.multipleLimit>0)}},watch:{currentLabel:function(){this.created||this.select.remote||this.dispatch("ElSelect","setSelected")},value:function(){this.created||this.select.remote||this.dispatch("ElSelect","setSelected")}},methods:{isEqual:function(e,t){if(this.isObject){var i=this.select.valueKey;return(0,a.getValueByPath)(e,i)===(0,a.getValueByPath)(t,i)}return e===t},contains:function(){var e=this,t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[],i=arguments[1];if(!this.isObject)return t.indexOf(i)>-1;var s=function(){var n=e.select.valueKey;return{v:t.some(function(e){return(0,a.getValueByPath)(e,n)===(0,a.getValueByPath)(i,n)})}}();return"object"===(void 0===s?"undefined":n(s))?s.v:void 0},handleGroupDisabled:function(e){this.groupDisabled=e},hoverItem:function(){this.disabled||this.groupDisabled||(this.select.hoverIndex=this.select.options.indexOf(this))},selectOptionClick:function(){!0!==this.disabled&&!0!==this.groupDisabled&&this.dispatch("ElSelect","handleOptionClick",this)},queryChange:function(e){var t=String(e).replace(/(\^|\(|\)|\[|\]|\$|\*|\+|\.|\?|\\|\{|\}|\|)/g,"\\$1");this.visible=new RegExp(t,"i").test(this.currentLabel)||this.created,this.visible||this.select.filteredOptionsCount--}},created:function(){this.select.options.push(this),this.select.cachedOptions.push(this),this.select.optionsCount++,this.select.filteredOptionsCount++,this.$on("queryChange",this.queryChange),this.$on("handleGroupDisabled",this.handleGroupDisabled)},beforeDestroy:function(){this.select.onOptionDestroy(this.select.options.indexOf(this))}}},function(e,t,i){"use strict";var n=function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("li",{directives:[{name:"show",rawName:"v-show",value:e.visible,expression:"visible"}],staticClass:"el-select-dropdown__item",class:{selected:e.itemSelected,"is-disabled":e.disabled||e.groupDisabled||e.limitReached,hover:e.hover},on:{mouseenter:e.hoverItem,click:function(t){t.stopPropagation(),e.selectOptionClick(t)}}},[e._t("default",[i("span",[e._v(e._s(e.currentLabel))])])],2)},s=[],r={render:n,staticRenderFns:s};t.a=r},function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=i(114),s=i.n(n),r=i(115),a=i(0),o=a(s.a,r.a,!1,null,null,null);t.default=o.exports},function(e,t,i){"use strict";t.__esModule=!0,t.default={name:"ElTag",props:{text:String,closable:Boolean,type:String,hit:Boolean,disableTransitions:Boolean,color:String,size:String},methods:{handleClose:function(e){this.$emit("close",e)}},computed:{tagSize:function(){return this.size||(this.$ELEMENT||{}).size}}}},function(e,t,i){"use strict";var n=function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("transition",{attrs:{name:e.disableTransitions?"":"el-zoom-in-center"}},[i("span",{staticClass:"el-tag",class:[e.type?"el-tag--"+e.type:"",e.tagSize&&"el-tag--"+e.tagSize,{"is-hit":e.hit}],style:{backgroundColor:e.color}},[e._t("default"),e.closable?i("i",{staticClass:"el-tag__close el-icon-close",on:{click:function(t){t.stopPropagation(),e.handleClose(t)}}}):e._e()],2)])},s=[],r={render:n,staticRenderFns:s};t.a=r},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0;var s=i(28),r=i(42),a=n(r),o=i(6),l=i(117),u=n(l);t.default={name:"ElScrollbar",components:{Bar:u.default},props:{native:Boolean,wrapStyle:{},wrapClass:{},viewClass:{},viewStyle:{},noresize:Boolean,tag:{type:String,default:"div"}},data:function(){return{sizeWidth:"0",sizeHeight:"0",moveX:0,moveY:0}},computed:{wrap:function(){return this.$refs.wrap}},render:function(e){var t=(0,a.default)(),i=this.wrapStyle;if(t){var n="-"+t+"px",s="margin-bottom: "+n+"; margin-right: "+n+";";Array.isArray(this.wrapStyle)?(i=(0,o.toObject)(this.wrapStyle),i.marginRight=i.marginBottom=n):"string"==typeof this.wrapStyle?i+=s:i=s}var r=e(this.tag,{class:["el-scrollbar__view",this.viewClass],style:this.viewStyle,ref:"resize"},this.$slots.default),l=e("div",{ref:"wrap",style:i,on:{scroll:this.handleScroll},class:[this.wrapClass,"el-scrollbar__wrap",t?"":"el-scrollbar__wrap--hidden-default"]},[[r]]),c=void 0;return c=this.native?[e("div",{ref:"wrap",class:[this.wrapClass,"el-scrollbar__wrap"],style:i},[[r]])]:[l,e(u.default,{attrs:{move:this.moveX,size:this.sizeWidth}},[]),e(u.default,{attrs:{vertical:!0,move:this.moveY,size:this.sizeHeight}},[])],e("div",{class:"el-scrollbar"},c)},methods:{handleScroll:function(){var e=this.wrap;this.moveY=100*e.scrollTop/e.clientHeight,this.moveX=100*e.scrollLeft/e.clientWidth},update:function(){var e=void 0,t=void 0,i=this.wrap;i&&(e=100*i.clientHeight/i.scrollHeight,t=100*i.clientWidth/i.scrollWidth,this.sizeHeight=e<100?e+"%":"",this.sizeWidth=t<100?t+"%":"")}},mounted:function(){this.native||(this.$nextTick(this.update),!this.noresize&&(0,s.addResizeListener)(this.$refs.resize,this.update))},beforeDestroy:function(){this.native||!this.noresize&&(0,s.removeResizeListener)(this.$refs.resize,this.update)}}},function(e,t,i){"use strict";t.__esModule=!0;var n=i(4),s=i(118);t.default={name:"Bar",props:{vertical:Boolean,size:String,move:Number},computed:{bar:function(){return s.BAR_MAP[this.vertical?"vertical":"horizontal"]},wrap:function(){return this.$parent.wrap}},render:function(e){var t=this.size,i=this.move,n=this.bar;return e("div",{class:["el-scrollbar__bar","is-"+n.key],on:{mousedown:this.clickTrackHandler}},[e("div",{ref:"thumb",class:"el-scrollbar__thumb",on:{mousedown:this.clickThumbHandler},style:(0,s.renderThumbStyle)({size:t,move:i,bar:n})},[])])},methods:{clickThumbHandler:function(e){this.startDrag(e),this[this.bar.axis]=e.currentTarget[this.bar.offset]-(e[this.bar.client]-e.currentTarget.getBoundingClientRect()[this.bar.direction])},clickTrackHandler:function(e){var t=Math.abs(e.target.getBoundingClientRect()[this.bar.direction]-e[this.bar.client]),i=this.$refs.thumb[this.bar.offset]/2,n=100*(t-i)/this.$el[this.bar.offset];this.wrap[this.bar.scroll]=n*this.wrap[this.bar.scrollSize]/100},startDrag:function(e){e.stopImmediatePropagation(),this.cursorDown=!0,(0,n.on)(document,"mousemove",this.mouseMoveDocumentHandler),(0,n.on)(document,"mouseup",this.mouseUpDocumentHandler),document.onselectstart=function(){return!1}},mouseMoveDocumentHandler:function(e){if(!1!==this.cursorDown){var t=this[this.bar.axis];if(t){var i=-1*(this.$el.getBoundingClientRect()[this.bar.direction]-e[this.bar.client]),n=this.$refs.thumb[this.bar.offset]-t,s=100*(i-n)/this.$el[this.bar.offset];this.wrap[this.bar.scroll]=s*this.wrap[this.bar.scrollSize]/100}}},mouseUpDocumentHandler:function(e){this.cursorDown=!1,this[this.bar.axis]=0,(0,n.off)(document,"mousemove",this.mouseMoveDocumentHandler),document.onselectstart=null}},destroyed:function(){(0,n.off)(document,"mouseup",this.mouseUpDocumentHandler)}}},function(e,t,i){"use strict";function n(e){var t=e.move,i=e.size,n=e.bar,s={},r="translate"+n.axis+"("+t+"%)";return s[n.size]=i,s.transform=r,s.msTransform=r,s.webkitTransform=r,s}t.__esModule=!0,t.renderThumbStyle=n;t.BAR_MAP={vertical:{offset:"offsetHeight",scroll:"scrollTop",scrollSize:"scrollHeight",size:"height",key:"vertical",axis:"Y",client:"clientY",direction:"top"},horizontal:{offset:"offsetWidth",scroll:"scrollLeft",scrollSize:"scrollWidth",size:"width",key:"horizontal",axis:"X",client:"clientX",direction:"left"}}},function(e,t,i){"use strict";t.__esModule=!0,t.default={data:function(){return{hoverOption:-1}},computed:{optionsAllDisabled:function(){return this.options.length===this.options.filter(function(e){return!0===e.disabled}).length}},watch:{hoverIndex:function(e){var t=this;"number"==typeof e&&e>-1&&(this.hoverOption=this.options[e]||{}),this.options.forEach(function(e){e.hover=t.hoverOption===e})}},methods:{navigateOptions:function(e){var t=this;if(!this.visible)return void(this.visible=!0);if(0!==this.options.length&&0!==this.filteredOptionsCount){if(!this.optionsAllDisabled){"next"===e?++this.hoverIndex===this.options.length&&(this.hoverIndex=0):"prev"===e&&--this.hoverIndex<0&&(this.hoverIndex=this.options.length-1);var i=this.options[this.hoverIndex];!0!==i.disabled&&!0!==i.groupDisabled&&i.visible||this.navigateOptions(e)}this.$nextTick(function(){return t.scrollToOption(t.hoverOption)})}}}}},function(e,t,i){"use strict";var n=function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("div",{directives:[{name:"clickoutside",rawName:"v-clickoutside",value:e.handleClose,expression:"handleClose"}],staticClass:"el-select",class:[e.selectSize?"el-select--"+e.selectSize:""]},[e.multiple?i("div",{ref:"tags",staticClass:"el-select__tags",style:{"max-width":e.inputWidth-32+"px"},on:{click:function(t){t.stopPropagation(),e.toggleMenu(t)}}},[e.collapseTags?i("span",{directives:[{name:"show",rawName:"v-show",value:e.multipleText,expression:"multipleText"}],staticClass:"el-select__multiple-text"},[e._v("\n      "+e._s(e.multipleText)+"\n    ")]):e._e(),e.collapseTags?e._e():i("transition-group",{on:{"after-leave":e.resetInputHeight}},e._l(e.selected,function(t){return i("el-tag",{key:e.getValueKey(t),attrs:{closable:!e.disabled,size:"small",hit:t.hitState,type:"info","disable-transitions":""},on:{close:function(i){e.deleteTag(i,t)}}},[i("span",{staticClass:"el-select__tags-text"},[e._v(e._s(t.currentLabel))])])})),e.filterable?i("input",{directives:[{name:"model",rawName:"v-model",value:e.query,expression:"query"}],ref:"input",staticClass:"el-select__input",class:[e.selectSize?"is-"+e.selectSize:""],style:{width:e.inputLength+"px","max-width":e.inputWidth-42+"px"},attrs:{type:"text",disabled:e.disabled,debounce:e.remote?300:0},domProps:{value:e.query},on:{focus:e.handleFocus,click:function(e){e.stopPropagation()},keyup:e.managePlaceholder,keydown:[e.resetInputState,function(t){if(!("button"in t)&&e._k(t.keyCode,"down",40,t.key))return null;t.preventDefault(),e.navigateOptions("next")},function(t){if(!("button"in t)&&e._k(t.keyCode,"up",38,t.key))return null;t.preventDefault(),e.navigateOptions("prev")},function(t){if(!("button"in t)&&e._k(t.keyCode,"enter",13,t.key))return null;t.preventDefault(),e.selectOption(t)},function(t){if(!("button"in t)&&e._k(t.keyCode,"esc",27,t.key))return null;t.stopPropagation(),t.preventDefault(),e.visible=!1},function(t){if(!("button"in t)&&e._k(t.keyCode,"delete",[8,46],t.key))return null;e.deletePrevTag(t)}],input:[function(t){t.target.composing||(e.query=t.target.value)},function(t){return e.handleQueryChange(t.target.value)}]}}):e._e()],1):e._e(),i("el-input",{ref:"reference",class:{"is-focus":e.visible},attrs:{type:"text",placeholder:e.currentPlaceholder,name:e.name,id:e.id,size:e.selectSize,disabled:e.disabled,readonly:!e.filterable||e.multiple,"validate-event":!1},on:{focus:e.handleFocus,blur:e.handleBlur},nativeOn:{mousedown:function(t){e.handleMouseDown(t)},keyup:function(t){e.debouncedOnInputChange(t)},keydown:[function(t){if(!("button"in t)&&e._k(t.keyCode,"down",40,t.key))return null;t.stopPropagation(),t.preventDefault(),e.navigateOptions("next")},function(t){if(!("button"in t)&&e._k(t.keyCode,"up",38,t.key))return null;t.stopPropagation(),t.preventDefault(),e.navigateOptions("prev")},function(t){if(!("button"in t)&&e._k(t.keyCode,"enter",13,t.key))return null;t.preventDefault(),e.selectOption(t)},function(t){if(!("button"in t)&&e._k(t.keyCode,"esc",27,t.key))return null;t.stopPropagation(),t.preventDefault(),e.visible=!1},function(t){if(!("button"in t)&&e._k(t.keyCode,"tab",9,t.key))return null;e.visible=!1}],paste:function(t){e.debouncedOnInputChange(t)},mouseenter:function(t){e.inputHovering=!0},mouseleave:function(t){e.inputHovering=!1}},model:{value:e.selectedLabel,callback:function(t){e.selectedLabel=t},expression:"selectedLabel"}},[i("i",{class:["el-select__caret","el-input__icon","el-icon-"+e.iconClass],attrs:{slot:"suffix"},on:{click:e.handleIconClick},slot:"suffix"})]),i("transition",{attrs:{name:"el-zoom-in-top"},on:{"before-enter":e.handleMenuEnter,"after-leave":e.doDestroy}},[i("el-select-menu",{directives:[{name:"show",rawName:"v-show",value:e.visible&&!1!==e.emptyText,expression:"visible && emptyText !== false"}],ref:"popper"},[i("el-scrollbar",{directives:[{name:"show",rawName:"v-show",value:e.options.length>0&&!e.loading,expression:"options.length > 0 && !loading"}],ref:"scrollbar",class:{"is-empty":!e.allowCreate&&e.query&&0===e.filteredOptionsCount},attrs:{tag:"ul","wrap-class":"el-select-dropdown__wrap","view-class":"el-select-dropdown__list"}},[e.showNewOption?i("el-option",{attrs:{value:e.query,created:""}}):e._e(),e._t("default")],2),e.emptyText&&(e.allowCreate&&0===e.options.length||!e.allowCreate)?i("p",{staticClass:"el-select-dropdown__empty"},[e._v(e._s(e.emptyText))]):e._e()],1)],1)],1)},s=[],r={render:n,staticRenderFns:s};t.a=r},function(e,t,i){"use strict";t.__esModule=!0;var n=i(122),s=function(e){return e&&e.__esModule?e:{default:e}}(n);s.default.install=function(e){e.component(s.default.name,s.default)},t.default=s.default},function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=i(123),s=i.n(n),r=i(124),a=i(0),o=a(s.a,r.a,!1,null,null,null);t.default=o.exports},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0;var s=i(21),r=n(s),a=i(9),o=n(a),l=i(1),u=n(l);t.default={name:"ElDialog",mixins:[r.default,u.default,o.default],props:{title:{type:String,default:""},modal:{type:Boolean,default:!0},modalAppendToBody:{type:Boolean,default:!0},appendToBody:{type:Boolean,default:!1},lockScroll:{type:Boolean,default:!0},closeOnClickModal:{type:Boolean,default:!0},closeOnPressEscape:{type:Boolean,default:!0},showClose:{type:Boolean,default:!0},width:String,fullscreen:Boolean,customClass:{type:String,default:""},top:{type:String,default:"15vh"},beforeClose:Function,center:{type:Boolean,default:!1}},data:function(){return{closed:!1}},watch:{visible:function(e){var t=this;e?(this.closed=!1,this.$emit("open"),this.$el.addEventListener("scroll",this.updatePopper),this.$nextTick(function(){t.$refs.dialog.scrollTop=0}),this.appendToBody&&document.body.appendChild(this.$el)):(this.$el.removeEventListener("scroll",this.updatePopper),this.closed||this.$emit("close"))}},computed:{style:function(){var e={};return this.width&&(e.width=this.width),this.fullscreen||(e.marginTop=this.top),e}},methods:{getMigratingConfig:function(){return{props:{size:"size is removed."}}},handleWrapperClick:function(){this.closeOnClickModal&&this.handleClose()},handleClose:function(){"function"==typeof this.beforeClose?this.beforeClose(this.hide):this.hide()},hide:function(e){!1!==e&&(this.$emit("update:visible",!1),this.$emit("close"),this.closed=!0)},updatePopper:function(){this.broadcast("ElSelectDropdown","updatePopper"),this.broadcast("ElDropdownMenu","updatePopper")}},mounted:function(){this.visible&&(this.rendered=!0,this.open(),this.appendToBody&&document.body.appendChild(this.$el))}}},function(e,t,i){"use strict";var n=function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("transition",{attrs:{name:"dialog-fade"}},[i("div",{directives:[{name:"show",rawName:"v-show",value:e.visible,expression:"visible"}],staticClass:"el-dialog__wrapper",on:{click:function(t){if(t.target!==t.currentTarget)return null;e.handleWrapperClick(t)}}},[i("div",{ref:"dialog",staticClass:"el-dialog",class:[{"is-fullscreen":e.fullscreen,"el-dialog--center":e.center},e.customClass],style:e.style},[i("div",{staticClass:"el-dialog__header"},[e._t("title",[i("span",{staticClass:"el-dialog__title"},[e._v(e._s(e.title))])]),e.showClose?i("button",{staticClass:"el-dialog__headerbtn",attrs:{type:"button","aria-label":"Close"},on:{click:e.handleClose}},[i("i",{staticClass:"el-dialog__close el-icon el-icon-close"})]):e._e()],2),e.rendered?i("div",{staticClass:"el-dialog__body"},[e._t("default")],2):e._e(),e.$slots.footer?i("div",{staticClass:"el-dialog__footer"},[e._t("footer")],2):e._e()])])])},s=[],r={render:n,staticRenderFns:s};t.a=r},function(e,t,i){"use strict";t.__esModule=!0;var n=i(126),s=function(e){return e&&e.__esModule?e:{default:e}}(n);s.default.install=function(e){e.component(s.default.name,s.default)},t.default=s.default},function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=i(127),s=i.n(n),r=i(131),a=i(0),o=a(s.a,r.a,!1,null,null,null);t.default=o.exports},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0;var s=i(13),r=n(s),a=i(8),o=n(a),l=i(17),u=n(l),c=i(128),d=n(c),h=i(1),f=n(h),p=i(9),m=n(p),v=i(6),g=i(26),b=n(g);t.default={name:"ElAutocomplete",mixins:[f.default,(0,b.default)("input"),m.default],componentName:"ElAutocomplete",components:{ElInput:o.default,ElAutocompleteSuggestions:d.default},directives:{Clickoutside:u.default},props:{valueKey:{type:String,default:"value"},popperClass:String,placeholder:String,disabled:Boolean,name:String,size:String,value:String,autofocus:Boolean,fetchSuggestions:Function,triggerOnFocus:{type:Boolean,default:!0},customItem:String,selectWhenUnmatched:{type:Boolean,default:!1},prefixIcon:String,suffixIcon:String,label:String,debounce:{type:Number,default:300}},data:function(){return{activated:!1,isOnComposition:!1,suggestions:[],loading:!1,highlightedIndex:-1}},computed:{suggestionVisible:function(){var e=this.suggestions;return(Array.isArray(e)&&e.length>0||this.loading)&&this.activated},id:function(){return"el-autocomplete-"+(0,v.generateId)()}},watch:{suggestionVisible:function(e){this.broadcast("ElAutocompleteSuggestions","visible",[e,this.$refs.input.$refs.input.offsetWidth])}},methods:{getMigratingConfig:function(){return{props:{"custom-item":"custom-item is removed, use scoped slot instead.",props:"props is removed, use value-key instead."}}},getData:function(e){var t=this;this.loading=!0,this.fetchSuggestions(e,function(e){t.loading=!1,Array.isArray(e)?t.suggestions=e:console.error("autocomplete suggestions must be an array")})},handleComposition:function(e){"compositionend"===e.type?(this.isOnComposition=!1,this.handleChange(e.target.value)):this.isOnComposition=!0},handleChange:function(e){if(this.$emit("input",e),this.isOnComposition||!this.triggerOnFocus&&!e)return void(this.suggestions=[]);this.debouncedGetData(e)},handleFocus:function(e){this.activated=!0,this.$emit("focus",e),this.triggerOnFocus&&this.debouncedGetData(this.value)},handleBlur:function(e){this.$emit("blur",e)},close:function(e){this.activated=!1},handleKeyEnter:function(e){var t=this;this.suggestionVisible&&this.highlightedIndex>=0&&this.highlightedIndex<this.suggestions.length?(e.preventDefault(),this.select(this.suggestions[this.highlightedIndex])):this.selectWhenUnmatched&&(this.$emit("select",{value:this.value}),this.$nextTick(function(e){t.suggestions=[],t.highlightedIndex=-1}))},select:function(e){var t=this;this.$emit("input",e[this.valueKey]),this.$emit("select",e),this.$nextTick(function(e){t.suggestions=[],t.highlightedIndex=-1})},highlight:function(e){if(this.suggestionVisible&&!this.loading){if(e<0)return void(this.highlightedIndex=-1);e>=this.suggestions.length&&(e=this.suggestions.length-1);var t=this.$refs.suggestions.$el.querySelector(".el-autocomplete-suggestion__wrap"),i=t.querySelectorAll(".el-autocomplete-suggestion__list li"),n=i[e],s=t.scrollTop,r=n.offsetTop;r+n.scrollHeight>s+t.clientHeight&&(t.scrollTop+=n.scrollHeight),r<s&&(t.scrollTop-=n.scrollHeight),this.highlightedIndex=e,this.$el.querySelector(".el-input__inner").setAttribute("aria-activedescendant",this.id+"-item-"+this.highlightedIndex)}}},mounted:function(){var e=this;this.debouncedGetData=(0,r.default)(this.debounce,function(t){e.getData(t)}),this.$on("item-click",function(t){e.select(t)});var t=this.$el.querySelector(".el-input__inner");t.setAttribute("role","textbox"),t.setAttribute("aria-autocomplete","list"),t.setAttribute("aria-controls","id"),t.setAttribute("aria-activedescendant",this.id+"-item-"+this.highlightedIndex)},beforeDestroy:function(){this.$refs.suggestions.$destroy()}}},function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=i(129),s=i.n(n),r=i(130),a=i(0),o=a(s.a,r.a,!1,null,null,null);t.default=o.exports},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0;var s=i(10),r=n(s),a=i(1),o=n(a),l=i(27),u=n(l);t.default={components:{ElScrollbar:u.default},mixins:[r.default,o.default],componentName:"ElAutocompleteSuggestions",data:function(){return{parent:this.$parent,dropdownWidth:""}},props:{options:{default:function(){return{gpuAcceleration:!1}}},id:String},methods:{select:function(e){this.dispatch("ElAutocomplete","item-click",e)}},updated:function(){var e=this;this.$nextTick(function(t){e.updatePopper()})},mounted:function(){this.$parent.popperElm=this.popperElm=this.$el,this.referenceElm=this.$parent.$refs.input.$refs.input,this.referenceList=this.$el.querySelector(".el-autocomplete-suggestion__list"),this.referenceList.setAttribute("role","listbox"),this.referenceList.setAttribute("id",this.id)},created:function(){var e=this;this.$on("visible",function(t,i){e.dropdownWidth=i+"px",e.showPopper=t})}}},function(e,t,i){"use strict";var n=function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("transition",{attrs:{name:"el-zoom-in-top"},on:{"after-leave":e.doDestroy}},[i("div",{directives:[{name:"show",rawName:"v-show",value:e.showPopper,expression:"showPopper"}],staticClass:"el-autocomplete-suggestion el-popper",class:{"is-loading":e.parent.loading},style:{width:e.dropdownWidth},attrs:{role:"region"}},[i("el-scrollbar",{attrs:{tag:"ul","wrap-class":"el-autocomplete-suggestion__wrap","view-class":"el-autocomplete-suggestion__list"}},[e.parent.loading?i("li",[i("i",{staticClass:"el-icon-loading"})]):e._t("default")],2)],1)])},s=[],r={render:n,staticRenderFns:s};t.a=r},function(e,t,i){"use strict";var n=function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("div",{directives:[{name:"clickoutside",rawName:"v-clickoutside",value:e.close,expression:"close"}],staticClass:"el-autocomplete",attrs:{"aria-haspopup":"listbox",role:"combobox","aria-expanded":e.suggestionVisible,"aria-owns":e.id}},[i("el-input",e._b({ref:"input",attrs:{label:e.label},on:{input:e.handleChange,focus:e.handleFocus,blur:e.handleBlur},nativeOn:{compositionstart:function(t){e.handleComposition(t)},compositionupdate:function(t){e.handleComposition(t)},compositionend:function(t){e.handleComposition(t)},keydown:[function(t){if(!("button"in t)&&e._k(t.keyCode,"up",38,t.key))return null;t.preventDefault(),e.highlight(e.highlightedIndex-1)},function(t){if(!("button"in t)&&e._k(t.keyCode,"down",40,t.key))return null;t.preventDefault(),e.highlight(e.highlightedIndex+1)},function(t){if(!("button"in t)&&e._k(t.keyCode,"enter",13,t.key))return null;e.handleKeyEnter(t)},function(t){if(!("button"in t)&&e._k(t.keyCode,"tab",9,t.key))return null;e.close(t)}]}},"el-input",e.$props,!1),[e.$slots.prepend?i("template",{attrs:{slot:"prepend"},slot:"prepend"},[e._t("prepend")],2):e._e(),e.$slots.append?i("template",{attrs:{slot:"append"},slot:"append"},[e._t("append")],2):e._e(),e.$slots.prefix?i("template",{attrs:{slot:"prefix"},slot:"prefix"},[e._t("prefix")],2):e._e(),e.$slots.suffix?i("template",{attrs:{slot:"suffix"},slot:"suffix"},[e._t("suffix")],2):e._e()],2),i("el-autocomplete-suggestions",{ref:"suggestions",class:[e.popperClass?e.popperClass:""],attrs:{"visible-arrow":"",placement:"bottom-start",id:e.id}},e._l(e.suggestions,function(t,n){return i("li",{key:n,class:{highlighted:e.highlightedIndex===n},attrs:{id:e.id+"-item-"+n,role:"option","aria-selected":e.highlightedIndex===n},on:{click:function(i){e.select(t)}}},[e._t("default",[e._v("\n        "+e._s(t[e.valueKey])+"\n      ")],{item:t})],2)}))],1)},s=[],r={render:n,staticRenderFns:s};t.a=r},function(e,t,i){"use strict";t.__esModule=!0;var n=i(133),s=function(e){return e&&e.__esModule?e:{default:e}}(n);s.default.install=function(e){e.component(s.default.name,s.default)},t.default=s.default},function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=i(134),s=i.n(n),r=i(0),a=r(s.a,null,!1,null,null,null);t.default=a.exports},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0;var s=i(17),r=n(s),a=i(1),o=n(a),l=i(9),u=n(l),c=i(18),d=n(c),h=i(68),f=n(h),p=i(6);t.default={name:"ElDropdown",componentName:"ElDropdown",mixins:[o.default,u.default],directives:{Clickoutside:r.default},components:{ElButton:d.default,ElButtonGroup:f.default},provide:function(){return{dropdown:this}},props:{trigger:{type:String,default:"hover"},type:String,size:{type:String,default:""},splitButton:Boolean,hideOnClick:{type:Boolean,default:!0},placement:{type:String,default:"bottom-end"},visibleArrow:{default:!0},showTimeout:{type:Number,default:250},hideTimeout:{type:Number,default:150}},data:function(){return{timeout:null,visible:!1,triggerElm:null,menuItems:null,menuItemsArray:null,dropdownElm:null,focusing:!1}},computed:{dropdownSize:function(){return this.size||(this.$ELEMENT||{}).size},listId:function(){return"dropdown-menu-"+(0,p.generateId)()}},mounted:function(){this.$on("menu-item-click",this.handleMenuItemClick),this.initEvent(),this.initAria()},watch:{visible:function(e){this.broadcast("ElDropdownMenu","visible",e),this.$emit("visible-change",e)},focusing:function(e){var t=this.$el.querySelector(".el-dropdown-selfdefine");t&&(e?t.className+=" focusing":t.className=t.className.replace("focusing",""))}},methods:{getMigratingConfig:function(){return{props:{"menu-align":"menu-align is renamed to placement."}}},show:function(){var e=this;this.triggerElm.disabled||(clearTimeout(this.timeout),this.timeout=setTimeout(function(){e.visible=!0},this.showTimeout))},hide:function(){var e=this;this.triggerElm.disabled||(this.removeTabindex(),this.resetTabindex(this.triggerElm),clearTimeout(this.timeout),this.timeout=setTimeout(function(){e.visible=!1},this.hideTimeout))},handleClick:function(){this.triggerElm.disabled||(this.visible=!this.visible)},handleTriggerKeyDown:function(e){var t=e.keyCode;[38,40].indexOf(t)>-1?(this.removeTabindex(),this.resetTabindex(this.menuItems[0]),this.menuItems[0].focus(),e.preventDefault(),e.stopPropagation()):13===t?this.handleClick():[9,27].indexOf(t)>-1&&this.hide()},handleItemKeyDown:function(e){var t=e.keyCode,i=e.target,n=this.menuItemsArray.indexOf(i),s=this.menuItemsArray.length-1,r=void 0;[38,40].indexOf(t)>-1?(r=38===t?0!==n?n-1:0:n<s?n+1:s,this.removeTabindex(),this.resetTabindex(this.menuItems[r]),this.menuItems[r].focus(),e.preventDefault(),e.stopPropagation()):13===t?(this.triggerElm.focus(),i.click(),this.hideOnClick||(this.visible=!1)):[9,27].indexOf(t)>-1&&(this.hide(),this.triggerElm.focus())},resetTabindex:function(e){this.removeTabindex(),e.setAttribute("tabindex","0")},removeTabindex:function(){this.triggerElm.setAttribute("tabindex","-1"),this.menuItemsArray.forEach(function(e){e.setAttribute("tabindex","-1")})},initAria:function(){this.dropdownElm.setAttribute("id",this.listId),this.triggerElm.setAttribute("aria-haspopup","list"),this.triggerElm.setAttribute("aria-controls",this.listId),this.menuItems=this.dropdownElm.querySelectorAll("[tabindex='-1']"),this.menuItemsArray=Array.prototype.slice.call(this.menuItems),this.splitButton||(this.triggerElm.setAttribute("role","button"),this.triggerElm.setAttribute("tabindex","0"),this.triggerElm.setAttribute("class",this.triggerElm.getAttribute("class")+" el-dropdown-selfdefine"))},initEvent:function(){var e=this,t=this.trigger,i=this.show,n=this.hide,s=this.handleClick,r=this.splitButton,a=this.handleTriggerKeyDown,o=this.handleItemKeyDown;this.triggerElm=r?this.$refs.trigger.$el:this.$slots.default[0].elm;var l=this.dropdownElm=this.$slots.dropdown[0].elm;this.triggerElm.addEventListener("keydown",a),l.addEventListener("keydown",o,!0),r||(this.triggerElm.addEventListener("focus",function(){e.focusing=!0}),this.triggerElm.addEventListener("blur",function(){e.focusing=!1}),this.triggerElm.addEventListener("click",function(){e.focusing=!1})),"hover"===t?(this.triggerElm.addEventListener("mouseenter",i),this.triggerElm.addEventListener("mouseleave",n),l.addEventListener("mouseenter",i),l.addEventListener("mouseleave",n)):"click"===t&&this.triggerElm.addEventListener("click",s)},handleMenuItemClick:function(e,t){this.hideOnClick&&(this.visible=!1),this.$emit("command",e,t)}},render:function(e){var t=this,i=this.hide,n=this.splitButton,s=this.type,r=this.dropdownSize,a=function(e){t.$emit("click",e),i()},o=n?e("el-button-group",null,[e("el-button",{attrs:{type:s,size:r},nativeOn:{click:a}},[this.$slots.default]),e("el-button",{ref:"trigger",attrs:{type:s,size:r},class:"el-dropdown__caret-button"},[e("i",{class:"el-dropdown__icon el-icon-arrow-down"},[])])]):this.$slots.default;return e("div",{class:"el-dropdown",directives:[{name:"clickoutside",value:i}]},[o,this.$slots.dropdown])}}},function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=i(136),s=i.n(n),r=i(137),a=i(0),o=a(s.a,r.a,!1,null,null,null);t.default=o.exports},function(e,t,i){"use strict";t.__esModule=!0,t.default={name:"ElButton",inject:{elFormItem:{default:""}},props:{type:{type:String,default:"default"},size:String,icon:{type:String,default:""},nativeType:{type:String,default:"button"},loading:Boolean,disabled:Boolean,plain:Boolean,autofocus:Boolean,round:Boolean},computed:{_elFormItemSize:function(){return(this.elFormItem||{}).elFormItemSize},buttonSize:function(){return this.size||this._elFormItemSize||(this.$ELEMENT||{}).size}},methods:{handleClick:function(e){this.$emit("click",e)},handleInnerClick:function(e){this.disabled&&e.stopPropagation()}}}},function(e,t,i){"use strict";var n=function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("button",{staticClass:"el-button",class:[e.type?"el-button--"+e.type:"",e.buttonSize?"el-button--"+e.buttonSize:"",{"is-disabled":e.disabled,"is-loading":e.loading,"is-plain":e.plain,"is-round":e.round}],attrs:{disabled:e.disabled,autofocus:e.autofocus,type:e.nativeType},on:{click:e.handleClick}},[e.loading?i("i",{staticClass:"el-icon-loading",on:{click:e.handleInnerClick}}):e._e(),e.icon&&!e.loading?i("i",{class:e.icon,on:{click:e.handleInnerClick}}):e._e(),e.$slots.default?i("span",{on:{click:e.handleInnerClick}},[e._t("default")],2):e._e()])},s=[],r={render:n,staticRenderFns:s};t.a=r},function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=i(139),s=i.n(n),r=i(140),a=i(0),o=a(s.a,r.a,!1,null,null,null);t.default=o.exports},function(e,t,i){"use strict";t.__esModule=!0,t.default={name:"ElButtonGroup"}},function(e,t,i){"use strict";var n=function(){var e=this,t=e.$createElement;return(e._self._c||t)("div",{staticClass:"el-button-group"},[e._t("default")],2)},s=[],r={render:n,staticRenderFns:s};t.a=r},function(e,t,i){"use strict";t.__esModule=!0;var n=i(142),s=function(e){return e&&e.__esModule?e:{default:e}}(n);s.default.install=function(e){e.component(s.default.name,s.default)},t.default=s.default},function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=i(143),s=i.n(n),r=i(144),a=i(0),o=a(s.a,r.a,!1,null,null,null);t.default=o.exports},function(e,t,i){"use strict";t.__esModule=!0;var n=i(10),s=function(e){return e&&e.__esModule?e:{default:e}}(n);t.default={name:"ElDropdownMenu",componentName:"ElDropdownMenu",mixins:[s.default],props:{visibleArrow:{type:Boolean,default:!0}},data:function(){return{size:this.dropdown.dropdownSize}},inject:["dropdown"],created:function(){var e=this;this.$on("updatePopper",function(){e.showPopper&&e.updatePopper()}),this.$on("visible",function(t){e.showPopper=t})},mounted:function(){this.$parent.popperElm=this.popperElm=this.$el,this.referenceElm=this.$parent.$el},watch:{"dropdown.placement":{immediate:!0,handler:function(e){this.currentPlacement=e}}}}},function(e,t,i){"use strict";var n=function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("transition",{attrs:{name:"el-zoom-in-top"},on:{"after-leave":e.doDestroy}},[i("ul",{directives:[{name:"show",rawName:"v-show",value:e.showPopper,expression:"showPopper"}],staticClass:"el-dropdown-menu el-popper",class:[e.size&&"el-dropdown-menu--"+e.size]},[e._t("default")],2)])},s=[],r={render:n,staticRenderFns:s};t.a=r},function(e,t,i){"use strict";t.__esModule=!0;var n=i(146),s=function(e){return e&&e.__esModule?e:{default:e}}(n);s.default.install=function(e){e.component(s.default.name,s.default)},t.default=s.default},function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=i(147),s=i.n(n),r=i(148),a=i(0),o=a(s.a,r.a,!1,null,null,null);t.default=o.exports},function(e,t,i){"use strict";t.__esModule=!0;var n=i(1),s=function(e){return e&&e.__esModule?e:{default:e}}(n);t.default={name:"ElDropdownItem",mixins:[s.default],props:{command:{},disabled:Boolean,divided:Boolean},methods:{handleClick:function(e){this.dispatch("ElDropdown","menu-item-click",[this.command,this])}}}},function(e,t,i){"use strict";var n=function(){var e=this,t=e.$createElement;return(e._self._c||t)("li",{staticClass:"el-dropdown-menu__item",class:{"is-disabled":e.disabled,"el-dropdown-menu__item--divided":e.divided},attrs:{"aria-disabled":e.disabled,tabindex:e.disabled?null:-1},on:{click:e.handleClick}},[e._t("default")],2)},s=[],r={render:n,staticRenderFns:s};t.a=r},function(e,t,i){"use strict";t.__esModule=!0;var n=i(150),s=function(e){return e&&e.__esModule?e:{default:e}}(n);s.default.install=function(e){e.component(s.default.name,s.default)},t.default=s.default},function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=i(151),s=i.n(n),r=i(155),a=i(0),o=a(s.a,r.a,!1,null,null,null);t.default=o.exports},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0;var s=i(1),r=n(s),a=i(9),o=n(a),l=i(152),u=n(l),c=i(4);t.default={name:"ElMenu",componentName:"ElMenu",mixins:[r.default,o.default],provide:function(){return{rootMenu:this}},components:{"el-menu-collapse-transition":{functional:!0,render:function(e,t){return e("transition",{props:{mode:"out-in"},on:{beforeEnter:function(e){e.style.opacity=.2},enter:function(e){(0,c.addClass)(e,"el-opacity-transition"),e.style.opacity=1},afterEnter:function(e){(0,c.removeClass)(e,"el-opacity-transition"),e.style.opacity=""},beforeLeave:function(e){e.dataset||(e.dataset={}),(0,c.hasClass)(e,"el-menu--collapse")&&((0,c.removeClass)(e,"el-menu--collapse"),e.dataset.oldOverflow=e.style.overflow,e.dataset.scrollWidth=e.scrollWidth,(0,c.addClass)(e,"el-menu--collapse")),e.style.width=e.scrollWidth+"px",e.style.overflow="hidden"},leave:function(e){(0,c.hasClass)(e,"el-menu--collapse")?((0,c.addClass)(e,"horizontal-collapse-transition"),e.style.width=e.dataset.scrollWidth+"px"):((0,c.addClass)(e,"horizontal-collapse-transition"),e.style.width="64px")},afterLeave:function(e){(0,c.removeClass)(e,"horizontal-collapse-transition"),(0,c.hasClass)(e,"el-menu--collapse")?e.style.width=e.dataset.scrollWidth+"px":e.style.width="64px",e.style.overflow=e.dataset.oldOverflow}}},t.children)}}},props:{mode:{type:String,default:"vertical"},defaultActive:{type:String,default:""},defaultOpeneds:Array,uniqueOpened:Boolean,router:Boolean,menuTrigger:{type:String,default:"hover"},collapse:Boolean,backgroundColor:String,textColor:String,activeTextColor:String},data:function(){return{activeIndex:this.defaultActive,openedMenus:this.defaultOpeneds&&!this.collapse?this.defaultOpeneds.slice(0):[],items:{},submenus:{}}},computed:{hoverBackground:function(){return this.backgroundColor?this.mixColor(this.backgroundColor,.2):""}},watch:{defaultActive:function(e){var t=this.items[e];t?(this.activeIndex=t.index,this.initOpenedMenu()):this.activeIndex=""},defaultOpeneds:function(e){this.collapse||(this.openedMenus=e)},collapse:function(e){e&&(this.openedMenus=[])}},methods:{getMigratingConfig:function(){return{props:{theme:"theme is removed."}}},getColorChannels:function(e){if(e=e.replace("#",""),/^[0-9a-fA-F]{3}$/.test(e)){e=e.split("");for(var t=2;t>=0;t--)e.splice(t,0,e[t]);e=e.join("")}return/^[0-9a-fA-F]{6}$/.test(e)?{red:parseInt(e.slice(0,2),16),green:parseInt(e.slice(2,4),16),blue:parseInt(e.slice(4,6),16)}:{red:255,green:255,blue:255}},mixColor:function(e,t){var i=this.getColorChannels(e),n=i.red,s=i.green,r=i.blue;return t>0?(n*=1-t,s*=1-t,r*=1-t):(n+=(255-n)*t,s+=(255-s)*t,r+=(255-r)*t),"rgb("+Math.round(n)+", "+Math.round(s)+", "+Math.round(r)+")"},addItem:function(e){this.$set(this.items,e.index,e)},removeItem:function(e){delete this.items[e.index]},addSubmenu:function(e){this.$set(this.submenus,e.index,e)},removeSubmenu:function(e){delete this.submenus[e.index]},openMenu:function(e,t){var i=this.openedMenus;-1===i.indexOf(e)&&(this.uniqueOpened&&(this.openedMenus=i.filter(function(e){return-1!==t.indexOf(e)})),this.openedMenus.push(e))},closeMenu:function(e){var t=this.openedMenus.indexOf(e);-1!==t&&this.openedMenus.splice(t,1)},handleSubmenuClick:function(e){var t=e.index,i=e.indexPath;-1!==this.openedMenus.indexOf(t)?(this.closeMenu(t),this.$emit("close",t,i)):(this.openMenu(t,i),this.$emit("open",t,i))},handleItemClick:function(e){var t=e.index,i=e.indexPath;this.activeIndex=e.index,this.$emit("select",t,i,e),("horizontal"===this.mode||this.collapse)&&(this.openedMenus=[]),this.router&&this.routeToItem(e)},initOpenedMenu:function(){var e=this,t=this.activeIndex,i=this.items[t];if(i&&"horizontal"!==this.mode&&!this.collapse){i.indexPath.forEach(function(t){var i=e.submenus[t];i&&e.openMenu(t,i.indexPath)})}},routeToItem:function(e){var t=e.route||e.index;try{this.$router.push(t)}catch(e){console.error(e)}},open:function(e){var t=this,i=this.submenus[e.toString()].indexPath;i.forEach(function(e){return t.openMenu(e,i)})},close:function(e){this.closeMenu(e)}},mounted:function(){this.initOpenedMenu(),this.$on("item-click",this.handleItemClick),this.$on("submenu-click",this.handleSubmenuClick),"horizontal"===this.mode&&new u.default(this.$el)}}},function(e,t,i){"use strict";t.__esModule=!0;var n=i(153),s=function(e){return e&&e.__esModule?e:{default:e}}(n),r=function(e){this.domNode=e,this.init()};r.prototype.init=function(){var e=this.domNode.childNodes;[].filter.call(e,function(e){return 1===e.nodeType}).forEach(function(e){new s.default(e)})},t.default=r},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0;var s=i(45),r=n(s),a=i(154),o=n(a),l=function(e){this.domNode=e,this.submenu=null,this.init()};l.prototype.init=function(){this.domNode.setAttribute("tabindex","0");var e=this.domNode.querySelector(".el-menu");e&&(this.submenu=new o.default(this,e)),this.addListeners()},l.prototype.addListeners=function(){var e=this,t=r.default.keys;this.domNode.addEventListener("keydown",function(i){var n=!1;switch(i.keyCode){case t.down:r.default.triggerEvent(i.currentTarget,"mouseenter"),e.submenu.gotoSubIndex(0),n=!0;break;case t.up:r.default.triggerEvent(i.currentTarget,"mouseenter"),e.submenu.gotoSubIndex(e.submenu.subMenuItems.length-1),n=!0;break;case t.tab:r.default.triggerEvent(i.currentTarget,"mouseleave");break;case t.enter:case t.space:n=!0,i.currentTarget.click()}n&&i.preventDefault()})},t.default=l},function(e,t,i){"use strict";t.__esModule=!0;var n=i(45),s=function(e){return e&&e.__esModule?e:{default:e}}(n),r=function(e,t){this.domNode=t,this.parent=e,this.subMenuItems=[],this.subIndex=0,this.init()};r.prototype.init=function(){this.subMenuItems=this.domNode.querySelectorAll("li"),this.addListeners()},r.prototype.gotoSubIndex=function(e){e===this.subMenuItems.length?e=0:e<0&&(e=this.subMenuItems.length-1),this.subMenuItems[e].focus(),this.subIndex=e},r.prototype.addListeners=function(){var e=this,t=s.default.keys,i=this.parent.domNode;Array.prototype.forEach.call(this.subMenuItems,function(n){n.addEventListener("keydown",function(n){var r=!1;switch(n.keyCode){case t.down:e.gotoSubIndex(e.subIndex+1),r=!0;break;case t.up:e.gotoSubIndex(e.subIndex-1),r=!0;break;case t.tab:s.default.triggerEvent(i,"mouseleave");break;case t.enter:case t.space:r=!0,n.currentTarget.click()}return r&&(n.preventDefault(),n.stopPropagation()),!1})})},t.default=r},function(e,t,i){"use strict";var n=function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("el-menu-collapse-transition",[i("ul",{key:+e.collapse,staticClass:"el-menu",class:{"el-menu--horizontal":"horizontal"===e.mode,"el-menu--collapse":e.collapse},style:{backgroundColor:e.backgroundColor||""},attrs:{role:"menubar"}},[e._t("default")],2)])},s=[],r={render:n,staticRenderFns:s};t.a=r},function(e,t,i){"use strict";t.__esModule=!0;var n=i(157),s=function(e){return e&&e.__esModule?e:{default:e}}(n);s.default.install=function(e){e.component(s.default.name,s.default)},t.default=s.default},function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=i(158),s=i.n(n),r=i(159),a=i(0),o=a(s.a,r.a,!1,null,null,null);t.default=o.exports},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0;var s=i(32),r=n(s),a=i(69),o=n(a),l=i(1),u=n(l);t.default={name:"ElSubmenu",componentName:"ElSubmenu",mixins:[o.default,u.default],components:{ElCollapseTransition:r.default},props:{index:{type:String,required:!0}},data:function(){return{timeout:null,items:{},submenus:{}}},computed:{menuTransitionName:function(){return this.rootMenu.collapse?"el-zoom-in-left":"el-zoom-in-top"},opened:function(){return this.rootMenu.openedMenus.indexOf(this.index)>-1},active:function(){var e=!1,t=this.submenus,i=this.items;return Object.keys(i).forEach(function(t){i[t].active&&(e=!0)}),Object.keys(t).forEach(function(i){t[i].active&&(e=!0)}),e},hoverBackground:function(){return this.rootMenu.hoverBackground},backgroundColor:function(){return this.rootMenu.backgroundColor||""},activeTextColor:function(){return this.rootMenu.activeTextColor||""},textColor:function(){return this.rootMenu.textColor||""},mode:function(){return this.rootMenu.mode},titleStyle:function(){return"horizontal"!==this.mode?{color:this.textColor}:{borderBottomColor:this.active?this.rootMenu.activeTextColor?this.activeTextColor:"":"transparent",color:this.active?this.activeTextColor:this.textColor}}},methods:{addItem:function(e){this.$set(this.items,e.index,e)},removeItem:function(e){delete this.items[e.index]},addSubmenu:function(e){this.$set(this.submenus,e.index,e)},removeSubmenu:function(e){delete this.submenus[e.index]},handleClick:function(){var e=this.rootMenu;"hover"===e.menuTrigger&&"horizontal"===e.mode||e.collapse&&"vertical"===e.mode||this.dispatch("ElMenu","submenu-click",this)},handleMouseenter:function(){var e=this,t=this.rootMenu;"click"===t.menuTrigger&&"horizontal"===t.mode||!t.collapse&&"vertical"===t.mode||(clearTimeout(this.timeout),this.timeout=setTimeout(function(){e.rootMenu.openMenu(e.index,e.indexPath)},300))},handleMouseleave:function(){var e=this,t=this.rootMenu;"click"===t.menuTrigger&&"horizontal"===t.mode||!t.collapse&&"vertical"===t.mode||(clearTimeout(this.timeout),this.timeout=setTimeout(function(){e.rootMenu.closeMenu(e.index)},300))},handleTitleMouseenter:function(){if("horizontal"!==this.mode||this.rootMenu.backgroundColor){var e=this.$refs["submenu-title"];e&&(e.style.backgroundColor=this.rootMenu.hoverBackground)}},handleTitleMouseleave:function(){if("horizontal"!==this.mode||this.rootMenu.backgroundColor){var e=this.$refs["submenu-title"];e&&(e.style.backgroundColor=this.rootMenu.backgroundColor||"")}}},created:function(){this.parentMenu.addSubmenu(this),this.rootMenu.addSubmenu(this)},beforeDestroy:function(){this.parentMenu.removeSubmenu(this),this.rootMenu.removeSubmenu(this)}}},function(e,t,i){"use strict";var n=function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("li",{class:{"el-submenu":!0,"is-active":e.active,"is-opened":e.opened},attrs:{role:"menuitem","aria-haspopup":"true","aria-expanded":e.opened},on:{mouseenter:e.handleMouseenter,mouseleave:e.handleMouseleave,focus:e.handleMouseenter}},[i("div",{ref:"submenu-title",staticClass:"el-submenu__title",style:[e.paddingStyle,e.titleStyle,{backgroundColor:e.backgroundColor}],on:{click:e.handleClick,mouseenter:e.handleTitleMouseenter,mouseleave:e.handleTitleMouseleave}},[e._t("title"),i("i",{class:{"el-submenu__icon-arrow":!0,"el-icon-arrow-down":"horizontal"===e.rootMenu.mode||"vertical"===e.rootMenu.mode&&!e.rootMenu.collapse,"el-icon-arrow-right":"vertical"===e.rootMenu.mode&&e.rootMenu.collapse}})],2),"horizontal"===e.rootMenu.mode||"vertical"===e.rootMenu.mode&&e.rootMenu.collapse?[i("transition",{attrs:{name:e.menuTransitionName}},[i("ul",{directives:[{name:"show",rawName:"v-show",value:e.opened,expression:"opened"}],staticClass:"el-menu",style:{backgroundColor:e.rootMenu.backgroundColor||""},attrs:{role:"menu"}},[e._t("default")],2)])]:i("el-collapse-transition",[i("ul",{directives:[{name:"show",rawName:"v-show",value:e.opened,expression:"opened"}],staticClass:"el-menu",style:{backgroundColor:e.rootMenu.backgroundColor||""},attrs:{role:"menu"}},[e._t("default")],2)])],2)},s=[],r={render:n,staticRenderFns:s};t.a=r},function(e,t,i){"use strict";t.__esModule=!0;var n=i(161),s=function(e){return e&&e.__esModule?e:{default:e}}(n);s.default.install=function(e){e.component(s.default.name,s.default)},t.default=s.default},function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=i(162),s=i.n(n),r=i(164),a=i(0),o=a(s.a,r.a,!1,null,null,null);t.default=o.exports},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0;var s=i(69),r=n(s),a=i(33),o=n(a),l=i(1),u=n(l);t.default={name:"ElMenuItem",componentName:"ElMenuItem",mixins:[r.default,u.default],components:{ElTooltip:o.default},props:{index:{type:String,required:!0},route:{type:[String,Object],required:!1},disabled:{type:Boolean,required:!1}},computed:{active:function(){return this.index===this.rootMenu.activeIndex},hoverBackground:function(){return this.rootMenu.hoverBackground},backgroundColor:function(){return this.rootMenu.backgroundColor||""},activeTextColor:function(){return this.rootMenu.activeTextColor||""},textColor:function(){return this.rootMenu.textColor||""},mode:function(){return this.rootMenu.mode},itemStyle:function(){var e={color:this.active?this.activeTextColor:this.textColor};return"horizontal"!==this.mode||this.isNested||(e.borderBottomColor=this.active?this.rootMenu.activeTextColor?this.activeTextColor:"":"transparent"),e},isNested:function(){return this.parentMenu!==this.rootMenu}},methods:{onMouseEnter:function(){("horizontal"!==this.mode||this.rootMenu.backgroundColor)&&(this.$el.style.backgroundColor=this.hoverBackground)},onMouseLeave:function(){("horizontal"!==this.mode||this.rootMenu.backgroundColor)&&(this.$el.style.backgroundColor=this.backgroundColor)},handleClick:function(){this.dispatch("ElMenu","item-click",this),this.$emit("click",this)}},created:function(){this.parentMenu.addItem(this),this.rootMenu.addItem(this)},beforeDestroy:function(){this.parentMenu.removeItem(this),this.rootMenu.removeItem(this)}}},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0;var s=i(10),r=n(s),a=i(13),o=n(a),l=i(34),u=i(6),c=i(2),d=n(c);t.default={name:"ElTooltip",mixins:[r.default],props:{openDelay:{type:Number,default:0},disabled:Boolean,manual:Boolean,effect:{type:String,default:"dark"},popperClass:String,content:String,visibleArrow:{default:!0},transition:{type:String,default:"el-fade-in-linear"},popperOptions:{default:function(){return{boundariesPadding:10,gpuAcceleration:!1}}},enterable:{type:Boolean,default:!0},hideAfter:{type:Number,default:0}},data:function(){return{timeoutPending:null,focusing:!1}},computed:{tooltipId:function(){return"el-tooltip-"+(0,u.generateId)()}},beforeCreate:function(){var e=this;this.$isServer||(this.popperVM=new d.default({data:{node:""},render:function(e){return this.node}}).$mount(),this.debounceClose=(0,o.default)(200,function(){return e.handleClosePopper()}))},render:function(e){var t=this;if(this.popperVM&&(this.popperVM.node=e("transition",{attrs:{name:this.transition},on:{afterLeave:this.doDestroy}},[e("div",{on:{mouseleave:function(){t.setExpectedState(!1),t.debounceClose()},mouseenter:function(){t.setExpectedState(!0)}},ref:"popper",attrs:{role:"tooltip",id:this.tooltipId,"aria-hidden":this.disabled||!this.showPopper?"true":"false"},directives:[{name:"show",value:!this.disabled&&this.showPopper}],class:["el-tooltip__popper","is-"+this.effect,this.popperClass]},[this.$slots.content||this.content])])),!this.$slots.default||!this.$slots.default.length)return this.$slots.default;var i=(0,l.getFirstComponentChild)(this.$slots.default);if(!i)return i;var n=i.data=i.data||{},s=i.data.on=i.data.on||{},r=i.data.nativeOn=i.data.nativeOn||{};return n.staticClass=this.concatClass(n.staticClass,"el-tooltip"),r.mouseenter=s.mouseenter=this.addEventHandle(s.mouseenter,this.show),r.mouseleave=s.mouseleave=this.addEventHandle(s.mouseleave,this.hide),r.focus=s.focus=this.addEventHandle(s.focus,this.handleFocus),r.blur=s.blur=this.addEventHandle(s.blur,this.handleBlur),r.click=s.click=this.addEventHandle(s.click,function(){t.focusing=!1}),i},mounted:function(){this.referenceElm=this.$el,1===this.$el.nodeType&&(this.$el.setAttribute("aria-describedby",this.tooltipId),this.$el.setAttribute("tabindex",0))},watch:{focusing:function(e){e?this.referenceElm.className+=" focusing":this.referenceElm.className=this.referenceElm.className.replace("focusing","")}},methods:{show:function(){this.setExpectedState(!0),this.handleShowPopper()},hide:function(){this.setExpectedState(!1),this.debounceClose()},handleFocus:function(){this.focusing=!0,this.show()},handleBlur:function(){this.focusing=!1,this.hide()},addEventHandle:function(e,t){return e?Array.isArray(e)?e.indexOf(t)>-1?e:e.concat(t):e===t?e:[e,t]:t},concatClass:function(e,t){return e&&e.indexOf(t)>-1?e:e?t?e+" "+t:e:t||""},handleShowPopper:function(){var e=this;this.expectedState&&!this.manual&&(clearTimeout(this.timeout),this.timeout=setTimeout(function(){e.showPopper=!0},this.openDelay),this.hideAfter>0&&(this.timeoutPending=setTimeout(function(){e.showPopper=!1},this.hideAfter)))},handleClosePopper:function(){this.enterable&&this.expectedState||this.manual||(clearTimeout(this.timeout),this.timeoutPending&&clearTimeout(this.timeoutPending),this.showPopper=!1)},setExpectedState:function(e){!1===e&&clearTimeout(this.timeoutPending),this.expectedState=e}}}},function(e,t,i){"use strict";var n=function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("li",{staticClass:"el-menu-item",class:{"is-active":e.active,"is-disabled":e.disabled},style:[e.paddingStyle,e.itemStyle,{backgroundColor:e.backgroundColor}],attrs:{role:"menuitem",tabindex:"-1"},on:{click:e.handleClick,mouseenter:e.onMouseEnter,focus:e.onMouseEnter,blur:e.onMouseLeave,mouseleave:e.onMouseLeave}},[e.$parent===e.rootMenu&&e.rootMenu.collapse?i("el-tooltip",{attrs:{effect:"dark",placement:"right"}},[i("div",{attrs:{slot:"content"},slot:"content"},[e._t("title")],2),i("div",{staticStyle:{position:"absolute",left:"0",top:"0",height:"100%",width:"100%",display:"inline-block","box-sizing":"border-box",padding:"0 20px"}},[e._t("default")],2)]):[e._t("default"),e._t("title")]],2)},s=[],r={render:n,staticRenderFns:s};t.a=r},function(e,t,i){"use strict";t.__esModule=!0;var n=i(166),s=function(e){return e&&e.__esModule?e:{default:e}}(n);s.default.install=function(e){e.component(s.default.name,s.default)},t.default=s.default},function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=i(167),s=i.n(n),r=i(168),a=i(0),o=a(s.a,r.a,!1,null,null,null);t.default=o.exports},function(e,t,i){"use strict";t.__esModule=!0,t.default={name:"ElMenuItemGroup",componentName:"ElMenuItemGroup",inject:["rootMenu"],props:{title:{type:String}},data:function(){return{paddingLeft:20}},computed:{levelPadding:function(){var e=20,t=this.$parent;if(this.rootMenu.collapse)return 20;for(;t&&"ElMenu"!==t.$options.componentName;)"ElSubmenu"===t.$options.componentName&&(e+=20),t=t.$parent;return e}}}},function(e,t,i){"use strict";var n=function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("li",{staticClass:"el-menu-item-group"},[i("div",{staticClass:"el-menu-item-group__title",style:{paddingLeft:e.levelPadding+"px"}},[e.$slots.title?e._t("title"):[e._v(e._s(e.title))]],2),i("ul",[e._t("default")],2)])},s=[],r={render:n,staticRenderFns:s};t.a=r},function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=i(170),s=i.n(n),r=i(171),a=i(0),o=a(s.a,r.a,!1,null,null,null);t.default=o.exports},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0;var s=i(8),r=n(s),a=i(13),o=n(a),l=i(26),u=n(l),c=i(71),d=n(c);t.default={name:"ElInputNumber",mixins:[(0,u.default)("input")],inject:{elFormItem:{default:""}},directives:{repeatClick:d.default},components:{ElInput:r.default},props:{step:{type:Number,default:1},max:{type:Number,default:1/0},min:{type:Number,default:-1/0},value:{default:0},disabled:Boolean,size:String,controls:{type:Boolean,default:!0},controlsPosition:{type:String,default:""},debounce:{type:Number,default:300},name:String,label:String},data:function(){return{currentValue:0}},watch:{value:{immediate:!0,handler:function(e){var t=Number(e);isNaN(t)||(t>=this.max&&(t=this.max),t<=this.min&&(t=this.min),this.currentValue=t,this.$emit("input",t))}}},computed:{minDisabled:function(){return this._decrease(this.value,this.step)<this.min},maxDisabled:function(){return this._increase(this.value,this.step)>this.max},precision:function(){var e=this.value,t=this.step,i=this.getPrecision;return Math.max(i(e),i(t))},controlsAtRight:function(){return"right"===this.controlsPosition},_elFormItemSize:function(){return(this.elFormItem||{}).elFormItemSize},inputNumberSize:function(){return this.size||this._elFormItemSize||(this.$ELEMENT||{}).size}},methods:{toPrecision:function(e,t){return void 0===t&&(t=this.precision),parseFloat(parseFloat(Number(e).toFixed(t)))},getPrecision:function(e){var t=e.toString(),i=t.indexOf("."),n=0;return-1!==i&&(n=t.length-i-1),n},_increase:function(e,t){if("number"!=typeof e)return this.currentValue;var i=Math.pow(10,this.precision);return this.toPrecision((i*e+i*t)/i)},_decrease:function(e,t){if("number"!=typeof e)return this.currentValue;var i=Math.pow(10,this.precision);return this.toPrecision((i*e-i*t)/i)},increase:function(){if(!this.disabled&&!this.maxDisabled){var e=this.value||0,t=this._increase(e,this.step);t>this.max||this.setCurrentValue(t)}},decrease:function(){if(!this.disabled&&!this.minDisabled){var e=this.value||0,t=this._decrease(e,this.step);t<this.min||this.setCurrentValue(t)}},handleBlur:function(e){this.$emit("blur",e),this.$refs.input.setCurrentValue(this.currentValue)},handleFocus:function(e){this.$emit("focus",e)},setCurrentValue:function(e){var t=this.currentValue;if(e>=this.max&&(e=this.max),e<=this.min&&(e=this.min),t===e)return void this.$refs.input.setCurrentValue(this.currentValue);this.$emit("change",e,t),this.$emit("input",e),this.currentValue=e},handleInput:function(e){if(""!==e&&e.indexOf(".")!==e.length-1&&e.indexOf("-")!==e.length-1){var t=Number(e);isNaN(t)?this.$refs.input.setCurrentValue(this.currentValue):this.setCurrentValue(t)}}},created:function(){var e=this;this.debounceHandleInput=(0,o.default)(this.debounce,function(t){e.handleInput(t)})},mounted:function(){var e=this.$refs.input.$refs.input;e.setAttribute("role","spinbutton"),e.setAttribute("aria-valuemax",this.max),e.setAttribute("aria-valuemin",this.min),e.setAttribute("aria-valuenow",this.currentValue),e.setAttribute("aria-disabled",this.disabled)},updated:function(){this.$refs.input.$refs.input.setAttribute("aria-valuenow",this.currentValue)}}},function(e,t,i){"use strict";var n=function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("div",{staticClass:"el-input-number",class:[e.inputNumberSize?"el-input-number--"+e.inputNumberSize:"",{"is-disabled":e.disabled},{"is-without-controls":!e.controls},{"is-controls-right":e.controlsAtRight}]},[e.controls?i("span",{directives:[{name:"repeat-click",rawName:"v-repeat-click",value:e.decrease,expression:"decrease"}],staticClass:"el-input-number__decrease",class:{"is-disabled":e.minDisabled},attrs:{role:"button"},on:{keydown:function(t){if(!("button"in t)&&e._k(t.keyCode,"enter",13,t.key))return null;e.decrease(t)}}},[i("i",{class:"el-icon-"+(e.controlsAtRight?"arrow-down":"minus")})]):e._e(),e.controls?i("span",{directives:[{name:"repeat-click",rawName:"v-repeat-click",value:e.increase,expression:"increase"}],staticClass:"el-input-number__increase",class:{"is-disabled":e.maxDisabled},attrs:{role:"button"},on:{keydown:function(t){if(!("button"in t)&&e._k(t.keyCode,"enter",13,t.key))return null;e.increase(t)}}},[i("i",{class:"el-icon-"+(e.controlsAtRight?"arrow-up":"plus")})]):e._e(),i("el-input",{ref:"input",attrs:{value:e.currentValue,disabled:e.disabled,size:e.inputNumberSize,max:e.max,min:e.min,name:e.name,label:e.label},on:{blur:e.handleBlur,focus:e.handleFocus,input:e.debounceHandleInput},nativeOn:{keydown:[function(t){if(!("button"in t)&&e._k(t.keyCode,"up",38,t.key))return null;t.preventDefault(),e.increase(t)},function(t){if(!("button"in t)&&e._k(t.keyCode,"down",40,t.key))return null;t.preventDefault(),e.decrease(t)}]}},[e.$slots.prepend?i("template",{attrs:{slot:"prepend"},slot:"prepend"},[e._t("prepend")],2):e._e(),e.$slots.append?i("template",{attrs:{slot:"append"},slot:"append"},[e._t("append")],2):e._e()],2)],1)},s=[],r={render:n,staticRenderFns:s};t.a=r},function(e,t,i){"use strict";t.__esModule=!0;var n=i(173),s=function(e){return e&&e.__esModule?e:{default:e}}(n);s.default.install=function(e){e.component("el-radio",s.default)},t.default=s.default},function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=i(174),s=i.n(n),r=i(175),a=i(0),o=a(s.a,r.a,!1,null,null,null);t.default=o.exports},function(e,t,i){"use strict";t.__esModule=!0;var n=i(1),s=function(e){return e&&e.__esModule?e:{default:e}}(n);t.default={name:"ElRadio",mixins:[s.default],inject:{elFormItem:{default:""}},componentName:"ElRadio",props:{value:{},label:{},disabled:Boolean,name:String,border:Boolean,size:String},data:function(){return{focus:!1}},computed:{isGroup:function(){for(var e=this.$parent;e;){if("ElRadioGroup"===e.$options.componentName)return this._radioGroup=e,!0;e=e.$parent}return!1},model:{get:function(){return this.isGroup?this._radioGroup.value:this.value},set:function(e){this.isGroup?this.dispatch("ElRadioGroup","input",[e]):this.$emit("input",e)}},_elFormItemSize:function(){return(this.elFormItem||{}).elFormItemSize},radioSize:function(){var e=this.size||this._elFormItemSize||(this.$ELEMENT||{}).size;return this.isGroup?this._radioGroup.radioGroupSize||e:e},isDisabled:function(){return this.isGroup?this._radioGroup.disabled||this.disabled:this.disabled},tabIndex:function(){return this.isDisabled?-1:this.isGroup?this.model===this.label?0:-1:0}},methods:{handleChange:function(){var e=this;this.$nextTick(function(){e.$emit("change",e.model),e.isGroup&&e.dispatch("ElRadioGroup","handleChange",e.model)})}}}},function(e,t,i){"use strict";var n=function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("label",{staticClass:"el-radio",class:[e.border&&e.radioSize?"el-radio--"+e.radioSize:"",{"is-disabled":e.isDisabled},{"is-focus":e.focus},{"is-bordered":e.border},{"is-checked":e.model===e.label}],attrs:{role:"radio","aria-checked":e.model===e.label,"aria-disabled":e.isDisabled,tabindex:e.tabIndex},on:{keydown:function(t){if(!("button"in t)&&e._k(t.keyCode,"space",32,t.key))return null;t.stopPropagation(),t.preventDefault(),e.model=e.label}}},[i("span",{staticClass:"el-radio__input",class:{"is-disabled":e.isDisabled,"is-checked":e.model===e.label}},[i("span",{staticClass:"el-radio__inner"}),i("input",{directives:[{name:"model",rawName:"v-model",value:e.model,expression:"model"}],staticClass:"el-radio__original",attrs:{type:"radio",name:e.name,disabled:e.isDisabled,tabindex:"-1"},domProps:{value:e.label,checked:e._q(e.model,e.label)},on:{focus:function(t){e.focus=!0},blur:function(t){e.focus=!1},change:[function(t){e.model=e.label},e.handleChange]}})]),i("span",{staticClass:"el-radio__label"},[e._t("default"),e.$slots.default?e._e():[e._v(e._s(e.label))]],2)])},s=[],r={render:n,staticRenderFns:s};t.a=r},function(e,t,i){"use strict";t.__esModule=!0;var n=i(177),s=function(e){return e&&e.__esModule?e:{default:e}}(n);s.default.install=function(e){e.component(s.default.name,s.default)},t.default=s.default},function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=i(178),s=i.n(n),r=i(179),a=i(0),o=a(s.a,r.a,!1,null,null,null);t.default=o.exports},function(e,t,i){"use strict";t.__esModule=!0;var n=i(1),s=function(e){return e&&e.__esModule?e:{default:e}}(n),r=Object.freeze({LEFT:37,UP:38,RIGHT:39,DOWN:40});t.default={name:"ElRadioGroup",componentName:"ElRadioGroup",inject:{elFormItem:{default:""}},mixins:[s.default],props:{value:{},size:String,fill:String,textColor:String,disabled:Boolean},computed:{_elFormItemSize:function(){return(this.elFormItem||{}).elFormItemSize},radioGroupSize:function(){return this.size||this._elFormItemSize||(this.$ELEMENT||{}).size}},created:function(){var e=this;this.$on("handleChange",function(t){e.$emit("change",t)})},mounted:function(){var e=this.$el.querySelectorAll("[type=radio]"),t=this.$el.querySelectorAll("[role=radio]")[0];![].some.call(e,function(e){return e.checked})&&t&&(t.tabIndex=0)},methods:{handleKeydown:function(e){var t=e.target,i="INPUT"===t.nodeName?"[type=radio]":"[role=radio]",n=this.$el.querySelectorAll(i),s=n.length,a=[].indexOf.call(n,t),o=this.$el.querySelectorAll("[role=radio]");switch(e.keyCode){case r.LEFT:case r.UP:e.stopPropagation(),e.preventDefault(),0===a?o[s-1].click():o[a-1].click();break;case r.RIGHT:case r.DOWN:a===s-1?(e.stopPropagation(),e.preventDefault(),o[0].click()):o[a+1].click()}}},watch:{value:function(e){this.dispatch("ElFormItem","el.form.change",[this.value])}}}},function(e,t,i){"use strict";var n=function(){var e=this,t=e.$createElement;return(e._self._c||t)("div",{staticClass:"el-radio-group",attrs:{role:"radiogroup"},on:{keydown:e.handleKeydown}},[e._t("default")],2)},s=[],r={render:n,staticRenderFns:s};t.a=r},function(e,t,i){"use strict";t.__esModule=!0;var n=i(181),s=function(e){return e&&e.__esModule?e:{default:e}}(n);s.default.install=function(e){e.component(s.default.name,s.default)},t.default=s.default},function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=i(182),s=i.n(n),r=i(183),a=i(0),o=a(s.a,r.a,!1,null,null,null);t.default=o.exports},function(e,t,i){"use strict";t.__esModule=!0;var n=i(1),s=function(e){return e&&e.__esModule?e:{default:e}}(n);t.default={name:"ElRadioButton",mixins:[s.default],inject:{elFormItem:{default:""}},props:{label:{},disabled:Boolean,name:String},data:function(){return{focus:!1}},computed:{value:{get:function(){return this._radioGroup.value},set:function(e){this._radioGroup.$emit("input",e)}},_radioGroup:function(){for(var e=this.$parent;e;){if("ElRadioGroup"===e.$options.componentName)return e;e=e.$parent}return!1},activeStyle:function(){return{backgroundColor:this._radioGroup.fill||"",borderColor:this._radioGroup.fill||"",boxShadow:this._radioGroup.fill?"-1px 0 0 0 "+this._radioGroup.fill:"",color:this._radioGroup.textColor||""}},_elFormItemSize:function(){return(this.elFormItem||{}).elFormItemSize},size:function(){return this._radioGroup.radioGroupSize||this._elFormItemSize||(this.$ELEMENT||{}).size},isDisabled:function(){return this.disabled||this._radioGroup.disabled},tabIndex:function(){return this.isDisabled?-1:this._radioGroup?this.value===this.label?0:-1:0}},methods:{handleChange:function(){var e=this;this.$nextTick(function(){e.dispatch("ElRadioGroup","handleChange",e.value)})}}}},function(e,t,i){"use strict";var n=function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("label",{staticClass:"el-radio-button",class:[e.size?"el-radio-button--"+e.size:"",{"is-active":e.value===e.label},{"is-disabled":e.isDisabled},{"is-focus":e.focus}],attrs:{role:"radio","aria-checked":e.value===e.label,"aria-disabled":e.isDisabled,tabindex:e.tabIndex},on:{keydown:function(t){if(!("button"in t)&&e._k(t.keyCode,"space",32,t.key))return null;t.stopPropagation(),t.preventDefault(),e.value=e.label}}},[i("input",{directives:[{name:"model",rawName:"v-model",value:e.value,expression:"value"}],staticClass:"el-radio-button__orig-radio",attrs:{type:"radio",name:e.name,disabled:e.isDisabled,tabindex:"-1"},domProps:{value:e.label,checked:e._q(e.value,e.label)},on:{change:[function(t){e.value=e.label},e.handleChange],focus:function(t){e.focus=!0},blur:function(t){e.focus=!1}}}),i("span",{staticClass:"el-radio-button__inner",style:e.value===e.label?e.activeStyle:null},[e._t("default"),e.$slots.default?e._e():[e._v(e._s(e.label))]],2)])},s=[],r={render:n,staticRenderFns:s};t.a=r},function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=i(185),s=i.n(n),r=i(186),a=i(0),o=a(s.a,r.a,!1,null,null,null);t.default=o.exports},function(e,t,i){"use strict";t.__esModule=!0;var n=i(1),s=function(e){return e&&e.__esModule?e:{default:e}}(n);t.default={name:"ElCheckbox",mixins:[s.default],inject:{elFormItem:{default:""}},componentName:"ElCheckbox",data:function(){return{selfModel:!1,focus:!1,isLimitExceeded:!1}},computed:{model:{get:function(){return this.isGroup?this.store:void 0!==this.value?this.value:this.selfModel},set:function(e){this.isGroup?(this.isLimitExceeded=!1,void 0!==this._checkboxGroup.min&&e.length<this._checkboxGroup.min&&(this.isLimitExceeded=!0),void 0!==this._checkboxGroup.max&&e.length>this._checkboxGroup.max&&(this.isLimitExceeded=!0),!1===this.isLimitExceeded&&this.dispatch("ElCheckboxGroup","input",[e])):(this.$emit("input",e),this.selfModel=e)}},isChecked:function(){return"[object Boolean]"==={}.toString.call(this.model)?this.model:Array.isArray(this.model)?this.model.indexOf(this.label)>-1:null!==this.model&&void 0!==this.model?this.model===this.trueLabel:void 0},isGroup:function(){for(var e=this.$parent;e;){if("ElCheckboxGroup"===e.$options.componentName)return this._checkboxGroup=e,!0;e=e.$parent}return!1},store:function(){return this._checkboxGroup?this._checkboxGroup.value:this.value},isDisabled:function(){return this.isGroup?this._checkboxGroup.disabled||this.disabled:this.disabled},_elFormItemSize:function(){return(this.elFormItem||{}).elFormItemSize},checkboxSize:function(){var e=this.size||this._elFormItemSize||(this.$ELEMENT||{}).size;return this.isGroup?this._checkboxGroup.checkboxGroupSize||e:e}},props:{value:{},label:{},indeterminate:Boolean,disabled:Boolean,checked:Boolean,name:String,trueLabel:[String,Number],falseLabel:[String,Number],id:String,controls:String,border:Boolean,size:String},methods:{addToStore:function(){Array.isArray(this.model)&&-1===this.model.indexOf(this.label)?this.model.push(this.label):this.model=this.trueLabel||!0},handleChange:function(e){var t=this;if(!this.isLimitExceeded){var i=void 0;i=e.target.checked?void 0===this.trueLabel||this.trueLabel:void 0!==this.falseLabel&&this.falseLabel,this.$emit("change",i,e),this.$nextTick(function(){t.isGroup&&t.dispatch("ElCheckboxGroup","change",[t._checkboxGroup.value])})}}},created:function(){this.checked&&this.addToStore()},mounted:function(){this.indeterminate&&this.$el.setAttribute("aria-controls",this.controls)}}},function(e,t,i){"use strict";var n=function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("label",{staticClass:"el-checkbox",class:[e.border&&e.checkboxSize?"el-checkbox--"+e.checkboxSize:"",{"is-disabled":e.isDisabled},{"is-bordered":e.border},{"is-checked":e.isChecked}],attrs:{role:"checkbox","aria-checked":e.indeterminate?"mixed":e.isChecked,"aria-disabled":e.isDisabled,id:e.id}},[i("span",{staticClass:"el-checkbox__input",class:{"is-disabled":e.isDisabled,"is-checked":e.isChecked,"is-indeterminate":e.indeterminate,"is-focus":e.focus},attrs:{"aria-checked":"mixed"}},[i("span",{staticClass:"el-checkbox__inner"}),e.trueLabel||e.falseLabel?i("input",{directives:[{name:"model",rawName:"v-model",value:e.model,expression:"model"}],staticClass:"el-checkbox__original",attrs:{type:"checkbox",name:e.name,disabled:e.isDisabled,"true-value":e.trueLabel,"false-value":e.falseLabel},domProps:{checked:Array.isArray(e.model)?e._i(e.model,null)>-1:e._q(e.model,e.trueLabel)},on:{change:[function(t){var i=e.model,n=t.target,s=n.checked?e.trueLabel:e.falseLabel;if(Array.isArray(i)){var r=e._i(i,null);n.checked?r<0&&(e.model=i.concat([null])):r>-1&&(e.model=i.slice(0,r).concat(i.slice(r+1)))}else e.model=s},e.handleChange],focus:function(t){e.focus=!0},blur:function(t){e.focus=!1}}}):i("input",{directives:[{name:"model",rawName:"v-model",value:e.model,expression:"model"}],staticClass:"el-checkbox__original",attrs:{type:"checkbox",disabled:e.isDisabled,name:e.name},domProps:{value:e.label,checked:Array.isArray(e.model)?e._i(e.model,e.label)>-1:e.model},on:{change:[function(t){var i=e.model,n=t.target,s=!!n.checked;if(Array.isArray(i)){var r=e.label,a=e._i(i,r);n.checked?a<0&&(e.model=i.concat([r])):a>-1&&(e.model=i.slice(0,a).concat(i.slice(a+1)))}else e.model=s},e.handleChange],focus:function(t){e.focus=!0},blur:function(t){e.focus=!1}}})]),e.$slots.default||e.label?i("span",{staticClass:"el-checkbox__label"},[e._t("default"),e.$slots.default?e._e():[e._v(e._s(e.label))]],2):e._e()])},s=[],r={render:n,staticRenderFns:s};t.a=r},function(e,t,i){"use strict";t.__esModule=!0;var n=i(188),s=function(e){return e&&e.__esModule?e:{default:e}}(n);s.default.install=function(e){e.component(s.default.name,s.default)},t.default=s.default},function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=i(189),s=i.n(n),r=i(190),a=i(0),o=a(s.a,r.a,!1,null,null,null);t.default=o.exports},function(e,t,i){"use strict";t.__esModule=!0;var n=i(1),s=function(e){return e&&e.__esModule?e:{default:e}}(n);t.default={name:"ElCheckboxButton",mixins:[s.default],inject:{elFormItem:{default:""}},data:function(){return{selfModel:!1,focus:!1,isLimitExceeded:!1}},props:{value:{},label:{},disabled:Boolean,checked:Boolean,name:String,trueLabel:[String,Number],falseLabel:[String,Number]},computed:{model:{get:function(){return this._checkboxGroup?this.store:void 0!==this.value?this.value:this.selfModel},set:function(e){this._checkboxGroup?(this.isLimitExceeded=!1,void 0!==this._checkboxGroup.min&&e.length<this._checkboxGroup.min&&(this.isLimitExceeded=!0),void 0!==this._checkboxGroup.max&&e.length>this._checkboxGroup.max&&(this.isLimitExceeded=!0),!1===this.isLimitExceeded&&this.dispatch("ElCheckboxGroup","input",[e])):void 0!==this.value?this.$emit("input",e):this.selfModel=e}},isChecked:function(){return"[object Boolean]"==={}.toString.call(this.model)?this.model:Array.isArray(this.model)?this.model.indexOf(this.label)>-1:null!==this.model&&void 0!==this.model?this.model===this.trueLabel:void 0},_checkboxGroup:function(){for(var e=this.$parent;e;){if("ElCheckboxGroup"===e.$options.componentName)return e;e=e.$parent}return!1},store:function(){return this._checkboxGroup?this._checkboxGroup.value:this.value},activeStyle:function(){return{backgroundColor:this._checkboxGroup.fill||"",borderColor:this._checkboxGroup.fill||"",color:this._checkboxGroup.textColor||"","box-shadow":"-1px 0 0 0 "+this._checkboxGroup.fill}},_elFormItemSize:function(){return(this.elFormItem||{}).elFormItemSize},size:function(){return this._checkboxGroup.checkboxGroupSize||this._elFormItemSize||(this.$ELEMENT||{}).size},isDisabled:function(){return this._checkboxGroup?this._checkboxGroup.disabled||this.disabled:this.disabled}},methods:{addToStore:function(){Array.isArray(this.model)&&-1===this.model.indexOf(this.label)?this.model.push(this.label):this.model=this.trueLabel||!0},handleChange:function(e){var t=this;if(!this.isLimitExceeded){var i=void 0;i=e.target.checked?void 0===this.trueLabel||this.trueLabel:void 0!==this.falseLabel&&this.falseLabel,this.$emit("change",i,e),this.$nextTick(function(){t._checkboxGroup&&t.dispatch("ElCheckboxGroup","change",[t._checkboxGroup.value])})}}},created:function(){this.checked&&this.addToStore()}}},function(e,t,i){"use strict";var n=function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("label",{staticClass:"el-checkbox-button",class:[e.size?"el-checkbox-button--"+e.size:"",{"is-disabled":e.isDisabled},{"is-checked":e.isChecked},{"is-focus":e.focus}],attrs:{role:"checkbox","aria-checked":e.isChecked,"aria-disabled":e.isDisabled}},[e.trueLabel||e.falseLabel?i("input",{directives:[{name:"model",rawName:"v-model",value:e.model,expression:"model"}],staticClass:"el-checkbox-button__original",attrs:{type:"checkbox",name:e.name,disabled:e.isDisabled,"true-value":e.trueLabel,"false-value":e.falseLabel},domProps:{checked:Array.isArray(e.model)?e._i(e.model,null)>-1:e._q(e.model,e.trueLabel)},on:{change:[function(t){var i=e.model,n=t.target,s=n.checked?e.trueLabel:e.falseLabel;if(Array.isArray(i)){var r=e._i(i,null);n.checked?r<0&&(e.model=i.concat([null])):r>-1&&(e.model=i.slice(0,r).concat(i.slice(r+1)))}else e.model=s},e.handleChange],focus:function(t){e.focus=!0},blur:function(t){e.focus=!1}}}):i("input",{directives:[{name:"model",rawName:"v-model",value:e.model,expression:"model"}],staticClass:"el-checkbox-button__original",attrs:{type:"checkbox",name:e.name,disabled:e.isDisabled},domProps:{value:e.label,checked:Array.isArray(e.model)?e._i(e.model,e.label)>-1:e.model},on:{change:[function(t){var i=e.model,n=t.target,s=!!n.checked;if(Array.isArray(i)){var r=e.label,a=e._i(i,r);n.checked?a<0&&(e.model=i.concat([r])):a>-1&&(e.model=i.slice(0,a).concat(i.slice(a+1)))}else e.model=s},e.handleChange],focus:function(t){e.focus=!0},blur:function(t){e.focus=!1}}}),e.$slots.default||e.label?i("span",{staticClass:"el-checkbox-button__inner",style:e.isChecked?e.activeStyle:null},[e._t("default",[e._v(e._s(e.label))])],2):e._e()])},s=[],r={render:n,staticRenderFns:s};t.a=r},function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=i(192),s=i.n(n),r=i(193),a=i(0),o=a(s.a,r.a,!1,null,null,null);t.default=o.exports},function(e,t,i){"use strict";t.__esModule=!0;var n=i(1),s=function(e){return e&&e.__esModule?e:{default:e}}(n);t.default={name:"ElCheckboxGroup",componentName:"ElCheckboxGroup",mixins:[s.default],inject:{elFormItem:{default:""}},props:{value:{},disabled:Boolean,min:Number,max:Number,size:String,fill:String,textColor:String},computed:{_elFormItemSize:function(){return(this.elFormItem||{}).elFormItemSize},checkboxGroupSize:function(){return this.size||this._elFormItemSize||(this.$ELEMENT||{}).size}},watch:{value:function(e){this.dispatch("ElFormItem","el.form.change",[e])}}}},function(e,t,i){"use strict";var n=function(){var e=this,t=e.$createElement;return(e._self._c||t)("div",{staticClass:"el-checkbox-group",attrs:{role:"group","aria-label":"checkbox-group"}},[e._t("default")],2)},s=[],r={render:n,staticRenderFns:s};t.a=r},function(e,t,i){"use strict";t.__esModule=!0;var n=i(195),s=function(e){return e&&e.__esModule?e:{default:e}}(n);s.default.install=function(e){e.component(s.default.name,s.default)},t.default=s.default},function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=i(196),s=i.n(n),r=i(197),a=i(0),o=a(s.a,r.a,!1,null,null,null);t.default=o.exports},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0;var s=i(26),r=n(s),a=i(9),o=n(a);t.default={name:"ElSwitch",mixins:[(0,r.default)("input"),o.default],props:{value:{type:[Boolean,String,Number],default:!1},disabled:{type:Boolean,default:!1},width:{type:Number,default:0},activeIconClass:{type:String,default:""},inactiveIconClass:{type:String,default:""},activeText:String,inactiveText:String,activeColor:{type:String,default:""},inactiveColor:{type:String,default:""},activeValue:{type:[Boolean,String,Number],default:!0},inactiveValue:{type:[Boolean,String,Number],default:!1},name:{type:String,default:""}},data:function(){return{coreWidth:this.width}},created:function(){~[this.activeValue,this.inactiveValue].indexOf(this.value)||this.$emit("input",this.inactiveValue)},computed:{checked:function(){return this.value===this.activeValue},transform:function(){return this.checked?"translate3d("+(this.coreWidth-20)+"px, 0, 0)":""}},watch:{checked:function(){this.$refs.input.checked=this.checked,(this.activeColor||this.inactiveColor)&&this.setBackgroundColor()}},methods:{handleChange:function(e){var t=this;this.$emit("input",this.checked?this.inactiveValue:this.activeValue),this.$emit("change",this.checked?this.inactiveValue:this.activeValue),this.$nextTick(function(){t.$refs.input.checked=t.checked})},setBackgroundColor:function(){var e=this.checked?this.activeColor:this.inactiveColor;this.$refs.core.style.borderColor=e,this.$refs.core.style.backgroundColor=e},switchValue:function(){this.$refs.input.click()},getMigratingConfig:function(){return{props:{"on-color":"on-color is renamed to active-color.","off-color":"off-color is renamed to inactive-color.","on-text":"on-text is renamed to active-text.","off-text":"off-text is renamed to inactive-text.","on-value":"on-value is renamed to active-value.","off-value":"off-value is renamed to inactive-value.","on-icon-class":"on-icon-class is renamed to active-icon-class.","off-icon-class":"off-icon-class is renamed to inactive-icon-class."}}}},mounted:function(){this.coreWidth=this.width||40,(this.activeColor||this.inactiveColor)&&this.setBackgroundColor(),this.$refs.input.checked=this.checked}}},function(e,t,i){"use strict";var n=function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("div",{staticClass:"el-switch",class:{"is-disabled":e.disabled,"is-checked":e.checked},attrs:{role:"switch","aria-checked":e.checked,"aria-disabled":e.disabled},on:{click:e.switchValue}},[i("input",{ref:"input",staticClass:"el-switch__input",attrs:{type:"checkbox",name:e.name,"true-value":e.activeValue,"false-value":e.inactiveValue,disabled:e.disabled},on:{change:e.handleChange,keydown:function(t){if(!("button"in t)&&e._k(t.keyCode,"enter",13,t.key))return null;e.switchValue(t)}}}),e.inactiveIconClass||e.inactiveText?i("span",{class:["el-switch__label","el-switch__label--left",e.checked?"":"is-active"]},[e.inactiveIconClass?i("i",{class:[e.inactiveIconClass]}):e._e(),!e.inactiveIconClass&&e.inactiveText?i("span",{attrs:{"aria-hidden":e.checked}},[e._v(e._s(e.inactiveText))]):e._e()]):e._e(),i("span",{ref:"core",staticClass:"el-switch__core",style:{width:e.coreWidth+"px"}},[i("span",{staticClass:"el-switch__button",style:{transform:e.transform}})]),e.activeIconClass||e.activeText?i("span",{class:["el-switch__label","el-switch__label--right",e.checked?"is-active":""]},[e.activeIconClass?i("i",{class:[e.activeIconClass]}):e._e(),!e.activeIconClass&&e.activeText?i("span",{attrs:{"aria-hidden":!e.checked}},[e._v(e._s(e.activeText))]):e._e()]):e._e()])},s=[],r={render:n,staticRenderFns:s};t.a=r},function(e,t,i){"use strict";t.__esModule=!0;var n=i(199),s=function(e){return e&&e.__esModule?e:{default:e}}(n);s.default.install=function(e){e.component(s.default.name,s.default)},t.default=s.default},function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=i(200),s=i.n(n),r=i(201),a=i(0),o=a(s.a,r.a,!1,null,null,null);t.default=o.exports},function(e,t,i){"use strict";t.__esModule=!0;var n=i(1),s=function(e){return e&&e.__esModule?e:{default:e}}(n);t.default={mixins:[s.default],name:"ElOptionGroup",componentName:"ElOptionGroup",props:{label:String,disabled:{type:Boolean,default:!1}},data:function(){return{visible:!0}},watch:{disabled:function(e){this.broadcast("ElOption","handleGroupDisabled",e)}},methods:{queryChange:function(){this.visible=this.$children&&Array.isArray(this.$children)&&this.$children.some(function(e){return!0===e.visible})}},created:function(){this.$on("queryChange",this.queryChange)},mounted:function(){this.disabled&&this.broadcast("ElOption","handleGroupDisabled",this.disabled)}}},function(e,t,i){"use strict";var n=function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("ul",{directives:[{name:"show",rawName:"v-show",value:e.visible,expression:"visible"}],staticClass:"el-select-group__wrap"},[i("li",{staticClass:"el-select-group__title"},[e._v(e._s(e.label))]),i("li",[i("ul",{staticClass:"el-select-group"},[e._t("default")],2)])])},s=[],r={render:n,staticRenderFns:s};t.a=r},function(e,t,i){"use strict";t.__esModule=!0;var n=i(203),s=function(e){return e&&e.__esModule?e:{default:e}}(n);s.default.install=function(e){e.component(s.default.name,s.default)},t.default=s.default},function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=i(204),s=i.n(n),r=i(214),a=i(0),o=a(s.a,r.a,!1,null,null,null);t.default=o.exports},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0;var s=i(14),r=n(s),a=i(43),o=n(a),l=i(13),u=n(l),c=i(28),d=i(5),h=n(d),f=i(9),p=n(f),m=i(205),v=n(m),g=i(206),b=n(g),y=i(207),_=n(y),x=i(208),C=n(x),w=i(213),k=n(w),S=i(47);t.default={name:"ElTable",mixins:[h.default,p.default],props:{data:{type:Array,default:function(){return[]}},size:String,width:[String,Number],height:[String,Number],maxHeight:[String,Number],fit:{type:Boolean,default:!0},stripe:Boolean,border:Boolean,rowKey:[String,Function],context:{},showHeader:{type:Boolean,default:!0},showSummary:Boolean,sumText:String,summaryMethod:Function,rowClassName:[String,Function],rowStyle:[Object,Function],cellClassName:[String,Function],cellStyle:[Object,Function],headerRowClassName:[String,Function],headerRowStyle:[Object,Function],headerCellClassName:[String,Function],headerCellStyle:[Object,Function],highlightCurrentRow:Boolean,currentRowKey:[String,Number],emptyText:String,expandRowKeys:Array,defaultExpandAll:Boolean,defaultSort:Object,tooltipEffect:String,spanMethod:Function},components:{TableHeader:C.default,TableFooter:k.default,TableBody:_.default,ElCheckbox:r.default},methods:{getMigratingConfig:function(){return{events:{expand:"expand is renamed to expand-change"}}},setCurrentRow:function(e){this.store.commit("setCurrentRow",e)},toggleRowSelection:function(e,t){this.store.toggleRowSelection(e,t),this.store.updateAllSelected()},toggleRowExpansion:function(e,t){this.store.toggleRowExpansion(e,t)},clearSelection:function(){this.store.clearSelection()},clearFilter:function(){this.store.clearFilter()},clearSort:function(){this.store.clearSort()},handleMouseLeave:function(){this.store.commit("setHoverRow",null),this.hoverState&&(this.hoverState=null)},updateScrollY:function(){this.layout.updateScrollY()},bindEvents:function(){var e=this,t=this.$refs,i=t.headerWrapper,n=t.footerWrapper,s=this.$refs,r=this;this.bodyWrapper.addEventListener("scroll",function(){i&&(i.scrollLeft=this.scrollLeft),n&&(n.scrollLeft=this.scrollLeft),s.fixedBodyWrapper&&(s.fixedBodyWrapper.scrollTop=this.scrollTop),s.rightFixedBodyWrapper&&(s.rightFixedBodyWrapper.scrollTop=this.scrollTop);var e=this.scrollWidth-this.offsetWidth-1,t=this.scrollLeft;r.scrollPosition=t>=e?"right":0===t?"left":"middle"});var a=function(t){var i=t.deltaX,n=t.deltaY;Math.abs(i)<Math.abs(n)||(i>0?e.bodyWrapper.scrollLeft+=10:i<0&&(e.bodyWrapper.scrollLeft-=10))};i&&(0,S.mousewheel)(i,(0,o.default)(16,a)),n&&(0,S.mousewheel)(n,(0,o.default)(16,a)),this.fit&&(this.windowResizeListener=(0,o.default)(50,function(){e.$ready&&e.doLayout()}),(0,c.addResizeListener)(this.$el,this.windowResizeListener))},doLayout:function(){var e=this;this.store.updateColumns(),this.updateScrollY(),this.layout.update(),this.$nextTick(function(){e.height?e.layout.setHeight(e.height):e.maxHeight?e.layout.setMaxHeight(e.maxHeight):e.shouldUpdateHeight&&e.layout.updateHeight()})}},created:function(){var e=this;this.tableId="el-table_1_",this.debouncedLayout=(0,u.default)(50,function(){return e.doLayout()})},computed:{tableSize:function(){return this.size||(this.$ELEMENT||{}).size},bodyWrapper:function(){return this.$refs.bodyWrapper},shouldUpdateHeight:function(){return"number"==typeof this.height||this.fixedColumns.length>0||this.rightFixedColumns.length>0},selection:function(){return this.store.states.selection},columns:function(){return this.store.states.columns},tableData:function(){return this.store.states.data},fixedColumns:function(){return this.store.states.fixedColumns},rightFixedColumns:function(){return this.store.states.rightFixedColumns},bodyHeight:function(){var e={};return this.height?e={height:this.layout.bodyHeight?this.layout.bodyHeight+"px":""}:this.maxHeight&&(e={"max-height":(this.showHeader?this.maxHeight-this.layout.headerHeight-this.layout.footerHeight:this.maxHeight-this.layout.footerHeight)+"px"}),e},bodyWidth:function(){var e=this.layout,t=e.bodyWidth,i=e.scrollY,n=e.gutterWidth;return t?t-(i?n:0)+"px":""},fixedBodyHeight:function(){var e={};if(this.height)e={height:this.layout.fixedBodyHeight?this.layout.fixedBodyHeight+"px":""};else if(this.maxHeight){var t=this.layout.scrollX?this.maxHeight-this.layout.gutterWidth:this.maxHeight;this.showHeader&&(t-=this.layout.headerHeight),e={"max-height":t+"px"}}return e},fixedHeight:function(){return this.maxHeight?{bottom:this.layout.scrollX&&this.data.length?this.layout.gutterWidth+"px":""}:{height:this.layout.viewportHeight?this.layout.viewportHeight+"px":""}}},watch:{height:function(e){this.layout.setHeight(e)},maxHeight:function(e){this.layout.setMaxHeight(e)},currentRowKey:function(e){this.store.setCurrentRowKey(e)},data:{immediate:!0,handler:function(e){var t=this;this.store.commit("setData",e),this.$ready&&this.$nextTick(function(){t.doLayout()})}},expandRowKeys:{immediate:!0,handler:function(e){e&&this.store.setExpandRowKeys(e)}}},destroyed:function(){this.windowResizeListener&&(0,c.removeResizeListener)(this.$el,this.windowResizeListener)},mounted:function(){var e=this;this.bindEvents(),this.doLayout(),this.store.states.columns.forEach(function(t){t.filteredValue&&t.filteredValue.length&&e.store.commit("filterChange",{column:t,values:t.filteredValue,silent:!0})}),this.$ready=!0},data:function(){var e=new v.default(this,{rowKey:this.rowKey,defaultExpandAll:this.defaultExpandAll});return{store:e,layout:new b.default({store:e,table:this,fit:this.fit,showHeader:this.showHeader}),isHidden:!1,renderExpanded:null,resizeProxyVisible:!1,isGroup:!1,scrollPosition:"left"}}}},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0;var s=i(2),r=n(s),a=i(13),o=n(a),l=i(12),u=n(l),c=i(47),d=function(e,t){var i=t.sortingColumn;return i&&"string"!=typeof i.sortable?(0,c.orderBy)(e,t.sortProp,t.sortOrder,i.sortMethod,i.sortBy):e},h=function(e,t){var i={};return(e||[]).forEach(function(e,n){i[(0,c.getRowIdentity)(e,t)]={row:e,index:n}}),i},f=function(e,t,i){var n=!1,s=e.selection,r=s.indexOf(t);return void 0===i?-1===r?(s.push(t),n=!0):(s.splice(r,1),n=!0):i&&-1===r?(s.push(t),n=!0):!i&&r>-1&&(s.splice(r,1),n=!0),n},p=function(e,t,i){var n=!1,s=e.expandRows;if(void 0!==i){var r=s.indexOf(t);i?-1===r&&(s.push(t),n=!0):-1!==r&&(s.splice(r,1),n=!0)}else{var a=s.indexOf(t);-1===a?(s.push(t),n=!0):(s.splice(a,1),n=!0)}return n},m=function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};if(!e)throw new Error("Table is required.");this.table=e,this.states={rowKey:null,_columns:[],originColumns:[],columns:[],fixedColumns:[],rightFixedColumns:[],leafColumns:[],fixedLeafColumns:[],rightFixedLeafColumns:[],isComplex:!1,_data:null,filteredData:null,data:null,sortingColumn:null,sortProp:null,sortOrder:null,isAllSelected:!1,selection:[],reserveSelection:!1,selectable:null,currentRow:null,hoverRow:null,filters:{},expandRows:[],defaultExpandAll:!1};for(var i in t)t.hasOwnProperty(i)&&this.states.hasOwnProperty(i)&&(this.states[i]=t[i])};m.prototype.mutations={setData:function(e,t){var i=this,n=e._data!==t;e._data=t,Object.keys(e.filters).forEach(function(n){var s=e.filters[n];if(s&&0!==s.length){var r=(0,c.getColumnById)(i.states,n);r&&r.filterMethod&&(t=t.filter(function(e){return s.some(function(t){return r.filterMethod.call(null,t,e)})}))}}),e.filteredData=t,e.data=d(t||[],e),this.updateCurrentRow(),e.reserveSelection?function(){var t=e.rowKey;t?function(){var n=e.selection,s=h(n,t);e.data.forEach(function(e){var i=(0,c.getRowIdentity)(e,t),r=s[i];r&&(n[r.index]=e)}),i.updateAllSelected()}():console.warn("WARN: rowKey is required when reserve-selection is enabled.")}():(n?this.clearSelection():this.cleanSelection(),this.updateAllSelected()),e.defaultExpandAll&&(this.states.expandRows=(e.data||[]).slice(0)),r.default.nextTick(function(){return i.table.updateScrollY()})},changeSortCondition:function(e,t){var i=this;e.data=d(e.filteredData||e._data||[],e),t&&t.silent||this.table.$emit("sort-change",{column:this.states.sortingColumn,prop:this.states.sortProp,order:this.states.sortOrder}),r.default.nextTick(function(){return i.table.updateScrollY()})},filterChange:function(e,t){var i=this,n=t.column,s=t.values,a=t.silent;s&&!Array.isArray(s)&&(s=[s]);var o=n.property,l={};o&&(e.filters[n.id]=s,l[n.columnKey||n.id]=s);var u=e._data;Object.keys(e.filters).forEach(function(t){var n=e.filters[t];if(n&&0!==n.length){var s=(0,c.getColumnById)(i.states,t);s&&s.filterMethod&&(u=u.filter(function(e){return n.some(function(t){return s.filterMethod.call(null,t,e)})}))}}),e.filteredData=u,e.data=d(u,e),a||this.table.$emit("filter-change",l),r.default.nextTick(function(){return i.table.updateScrollY()})},insertColumn:function(e,t,i,n){var s=e._columns;n&&((s=n.children)||(s=n.children=[])),void 0!==i?s.splice(i,0,t):s.push(t),"selection"===t.type&&(e.selectable=t.selectable,e.reserveSelection=t.reserveSelection),this.updateColumns(),this.scheduleLayout()},removeColumn:function(e,t){var i=e._columns;i&&i.splice(i.indexOf(t),1),this.updateColumns(),this.scheduleLayout()},setHoverRow:function(e,t){e.hoverRow=t},setCurrentRow:function(e,t){var i=e.currentRow;e.currentRow=t,i!==t&&this.table.$emit("current-change",t,i)},rowSelectedChanged:function(e,t){var i=f(e,t),n=e.selection;if(i){var s=this.table;s.$emit("selection-change",n),s.$emit("select",n,t)}this.updateAllSelected()},toggleAllSelection:(0,o.default)(10,function(e){var t=e.data||[],i=!e.isAllSelected,n=this.states.selection,s=!1;t.forEach(function(t,n){e.selectable?e.selectable.call(null,t,n)&&f(e,t,i)&&(s=!0):f(e,t,i)&&(s=!0)});var r=this.table;s&&r.$emit("selection-change",n),r.$emit("select-all",n),e.isAllSelected=i})};var v=function e(t){var i=[];return t.forEach(function(t){t.children?i.push.apply(i,e(t.children)):i.push(t)}),i};m.prototype.updateColumns=function(){var e=this.states,t=e._columns||[];e.fixedColumns=t.filter(function(e){return!0===e.fixed||"left"===e.fixed}),e.rightFixedColumns=t.filter(function(e){return"right"===e.fixed}),e.fixedColumns.length>0&&t[0]&&"selection"===t[0].type&&!t[0].fixed&&(t[0].fixed=!0,e.fixedColumns.unshift(t[0]));var i=t.filter(function(e){return!e.fixed});e.originColumns=[].concat(e.fixedColumns).concat(i).concat(e.rightFixedColumns);var n=v(i),s=v(e.fixedColumns),r=v(e.rightFixedColumns);e.leafColumnsLength=n.length,e.fixedLeafColumnsLength=s.length,e.rightFixedLeafColumnsLength=r.length,e.columns=[].concat(s).concat(n).concat(r),e.isComplex=e.fixedColumns.length>0||e.rightFixedColumns.length>0},m.prototype.isSelected=function(e){return(this.states.selection||[]).indexOf(e)>-1},m.prototype.clearSelection=function(){var e=this.states;e.isAllSelected=!1;var t=e.selection;e.selection=[],t.length>0&&this.table.$emit("selection-change",e.selection)},m.prototype.setExpandRowKeys=function(e){var t=[],i=this.states.data,n=this.states.rowKey;if(!n)throw new Error("[Table] prop row-key should not be empty.");var s=h(i,n);e.forEach(function(e){var i=s[e];i&&t.push(i.row)}),this.states.expandRows=t},m.prototype.toggleRowSelection=function(e,t){f(this.states,e,t)&&this.table.$emit("selection-change",this.states.selection)},m.prototype.toggleRowExpansion=function(e,t){p(this.states,e,t)&&this.table.$emit("expand-change",e,this.states.expandRows)},m.prototype.cleanSelection=function(){var e=this.states.selection||[],t=this.states.data,i=this.states.rowKey,n=void 0;if(i){n=[];var s=h(e,i),r=h(t,i);for(var a in s)s.hasOwnProperty(a)&&!r[a]&&n.push(s[a].row)}else n=e.filter(function(e){return-1===t.indexOf(e)});n.forEach(function(t){e.splice(e.indexOf(t),1)}),n.length&&this.table.$emit("selection-change",e)},m.prototype.clearFilter=function(){var e=this.states,t=this.table.$refs,i=t.tableHeader,n=t.fixedTableHeader,s=t.rightFixedTableHeader,r={};i&&(r=(0,u.default)(r,i.filterPanels)),n&&(r=(0,u.default)(r,n.filterPanels)),s&&(r=(0,u.default)(r,s.filterPanels));var a=Object.keys(r);a.length&&(a.forEach(function(e){r[e].filteredValue=[]}),e.filters={},this.commit("filterChange",{column:{},values:[],silent:!0}))},m.prototype.clearSort=function(){var e=this.states;e.sortingColumn&&(e.sortingColumn.order=null,e.sortProp=null,e.sortOrder=null,this.commit("changeSortCondition",{silent:!0}))},m.prototype.updateAllSelected=function(){var e=this.states,t=e.selection,i=e.rowKey,n=e.selectable,s=e.data;if(!s||0===s.length)return void(e.isAllSelected=!1);var r=void 0;i&&(r=h(e.selection,i));for(var a=function(e){return r?!!r[(0,c.getRowIdentity)(e,i)]:-1!==t.indexOf(e)},o=!0,l=0,u=0,d=s.length;u<d;u++){var f=s[u];if(n){if(n.call(null,f,u)){if(!a(f)){o=!1;break}l++}}else{if(!a(f)){o=!1;break}l++}}0===l&&(o=!1),e.isAllSelected=o},m.prototype.scheduleLayout=function(){this.table.debouncedLayout()},m.prototype.setCurrentRowKey=function(e){var t=this.states,i=t.rowKey;if(!i)throw new Error("[Table] row-key should not be empty.");var n=t.data||[],s=h(n,i),r=s[e];r&&(t.currentRow=r.row)},m.prototype.updateCurrentRow=function(){var e=this.states,t=this.table,i=e.data||[],n=e.currentRow;-1===i.indexOf(n)&&(e.currentRow=null,e.currentRow!==n&&t.$emit("current-change",null,n))},m.prototype.commit=function(e){var t=this.mutations;if(!t[e])throw new Error("Action not found: "+e);for(var i=arguments.length,n=Array(i>1?i-1:0),s=1;s<i;s++)n[s-1]=arguments[s];t[e].apply(this,[this.states].concat(n))},t.default=m},function(e,t,i){"use strict";function n(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}t.__esModule=!0;var s=i(42),r=function(e){return e&&e.__esModule?e:{default:e}}(s),a=function(){function e(t){n(this,e),this.table=null,this.store=null,this.columns=null,this.fit=!0,this.showHeader=!0,this.height=null,this.scrollX=!1,this.scrollY=!1,this.bodyWidth=null,this.fixedWidth=null,this.rightFixedWidth=null,this.tableHeight=null,this.headerHeight=44,this.appendHeight=0,this.footerHeight=44,this.viewportHeight=null,this.bodyHeight=null,this.fixedBodyHeight=null,this.gutterWidth=(0,r.default)();for(var i in t)t.hasOwnProperty(i)&&(this[i]=t[i]);if(!this.table)throw new Error("table is required for Table Layout");if(!this.store)throw new Error("store is required for Table Layout")}return e.prototype.updateScrollY=function(){var e=this.height;if("string"==typeof e||"number"==typeof e){var t=this.table.bodyWrapper;if(this.table.$el&&t){var i=t.querySelector(".el-table__body");this.scrollY=i.offsetHeight>t.offsetHeight}}},e.prototype.setHeight=function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"height",i=this.table.$el;"string"==typeof e&&/^\d+$/.test(e)&&(e=Number(e)),this.height=e,i&&("number"==typeof e?(i.style[t]=e+"px",this.updateHeight()):"string"==typeof e&&(""===e&&(i.style[t]=""),this.updateHeight()))},e.prototype.setMaxHeight=function(e){return this.setHeight(e,"max-height")},e.prototype.updateHeight=function(){var e=this.tableHeight=this.table.$el.clientHeight,t=!this.table.data||0===this.table.data.length,i=this.table.$refs,n=i.headerWrapper,s=i.appendWrapper,r=i.footerWrapper,a=this.footerHeight=r?r.offsetHeight:0;if(this.appendHeight=s?s.offsetHeight:0,!this.showHeader||n){if(this.showHeader){var o=this.headerHeight=n.offsetHeight,l=e-o-a+(r?1:0);null===this.height||isNaN(this.height)&&"string"!=typeof this.height||(this.bodyHeight=l),this.fixedBodyHeight=this.scrollX?l-this.gutterWidth:l}else this.headerHeight=0,null===this.height||isNaN(this.height)&&"string"!=typeof this.height||(this.bodyHeight=e-a+(r?1:0)),this.fixedBodyHeight=this.scrollX?e-this.gutterWidth:e;this.viewportHeight=this.scrollX?e-(t?0:this.gutterWidth):e}},e.prototype.update=function(){var e=this.fit,t=this.table.columns,i=this.table.$el.clientWidth,n=0,s=[];t.forEach(function(e){e.isColumnGroup?s.push.apply(s,e.columns):s.push(e)});var r=s.filter(function(e){return"number"!=typeof e.width});if(r.length>0&&e){s.forEach(function(e){n+=e.width||e.minWidth||80});var a=this.scrollY?this.gutterWidth:0;if(n<=i-a){this.scrollX=!1;var o=i-a-n;1===r.length?r[0].realWidth=(r[0].minWidth||80)+o:function(){var e=r.reduce(function(e,t){return e+(t.minWidth||80)},0),t=o/e,i=0;r.forEach(function(e,n){if(0!==n){var s=Math.floor((e.minWidth||80)*t);i+=s,e.realWidth=(e.minWidth||80)+s}}),r[0].realWidth=(r[0].minWidth||80)+o-i}()}else this.scrollX=!0,r.forEach(function(e){e.realWidth=e.minWidth});this.bodyWidth=Math.max(n,i)}else s.forEach(function(e){e.width||e.minWidth?e.realWidth=e.width||e.minWidth:e.realWidth=80,n+=e.realWidth}),this.scrollX=n>i,this.bodyWidth=n;var l=this.store.states.fixedColumns;if(l.length>0){var u=0;l.forEach(function(e){u+=e.realWidth}),this.fixedWidth=u}var c=this.store.states.rightFixedColumns;if(c.length>0){var d=0;c.forEach(function(e){d+=e.realWidth}),this.rightFixedWidth=d}},e}();t.default=a},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0;var s="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},r=i(47),a=i(4),o=i(14),l=n(o),u=i(33),c=n(u),d=i(13),h=n(d);t.default={components:{ElCheckbox:l.default,ElTooltip:c.default},props:{store:{required:!0},stripe:Boolean,context:{},layout:{required:!0},rowClassName:[String,Function],rowStyle:[Object,Function],fixed:String,highlight:Boolean},render:function(e){var t=this,i=this.columns.map(function(e,i){return t.isColumnHidden(i)});return e("table",{class:"el-table__body",attrs:{cellspacing:"0",cellpadding:"0",border:"0"}},[e("colgroup",null,[this._l(this.columns,function(t){return e("col",{attrs:{name:t.id,width:t.realWidth||t.width}},[])})]),e("tbody",null,[this._l(this.data,function(n,s){return[e("tr",{style:t.rowStyle?t.getRowStyle(n,s):null,key:t.table.rowKey?t.getKeyOfRow(n,s):s,on:{dblclick:function(e){return t.handleDoubleClick(e,n)},click:function(e){return t.handleClick(e,n)},contextmenu:function(e){return t.handleContextMenu(e,n)},mouseenter:function(e){return t.handleMouseEnter(s)},mouseleave:function(e){return t.handleMouseLeave()}},class:[t.getRowClass(n,s)]},[t._l(t.columns,function(r,a){var o=t.getSpan(n,r,s,a),l=o.rowspan,u=o.colspan;return l&&u?1===l&&1===u?e("td",{style:t.getCellStyle(s,a,n,r),class:t.getCellClass(s,a,n,r),on:{mouseenter:function(e){return t.handleCellMouseEnter(e,n)},mouseleave:t.handleCellMouseLeave}},[r.renderCell.call(t._renderProxy,e,{row:n,column:r,$index:s,store:t.store,_self:t.context||t.table.$vnode.context},i[a])]):e("td",{style:t.getCellStyle(s,a,n,r),class:t.getCellClass(s,a,n,r),attrs:{rowspan:l,colspan:u},on:{mouseenter:function(e){return t.handleCellMouseEnter(e,n)},mouseleave:t.handleCellMouseLeave}},[r.renderCell.call(t._renderProxy,e,{row:n,column:r,$index:s,store:t.store,_self:t.context||t.table.$vnode.context},i[a])]):""}),!t.fixed&&t.layout.scrollY&&t.layout.gutterWidth?e("td",{class:"gutter"},[]):""]),t.store.states.expandRows.indexOf(n)>-1?e("tr",null,[e("td",{attrs:{colspan:t.columns.length},class:"el-table__expanded-cell"},[t.table.renderExpanded?t.table.renderExpanded(e,{row:n,$index:s,store:t.store}):""])]):""]}).concat(e("el-tooltip",{attrs:{effect:this.table.tooltipEffect,placement:"top",content:this.tooltipContent},ref:"tooltip"},[]))])])},watch:{"store.states.hoverRow":function(e,t){if(this.store.states.isComplex){var i=this.$el;if(i){var n=i.querySelector("tbody").children,s=[].filter.call(n,function(e){return(0,a.hasClass)(e,"el-table__row")}),r=s[t],o=s[e];r&&(0,a.removeClass)(r,"hover-row"),o&&(0,a.addClass)(o,"hover-row")}}},"store.states.currentRow":function(e,t){if(this.highlight){var i=this.$el;if(i){var n=this.store.states.data,s=i.querySelector("tbody").children,r=[].filter.call(s,function(e){return(0,a.hasClass)(e,"el-table__row")}),o=r[n.indexOf(t)],l=r[n.indexOf(e)];o?(0,a.removeClass)(o,"current-row"):r&&[].forEach.call(r,function(e){return(0,a.removeClass)(e,"current-row")}),l&&(0,a.addClass)(l,"current-row")}}}},computed:{table:function(){return this.$parent},data:function(){return this.store.states.data},columnsCount:function(){return this.store.states.columns.length},leftFixedLeafCount:function(){return this.store.states.fixedLeafColumnsLength},rightFixedLeafCount:function(){return this.store.states.rightFixedLeafColumnsLength},leftFixedCount:function(){return this.store.states.fixedColumns.length},rightFixedCount:function(){return this.store.states.rightFixedColumns.length},columns:function(){return this.store.states.columns}},data:function(){return{tooltipContent:""}},created:function(){this.activateTooltip=(0,h.default)(50,function(e){return e.handleShowPopper()})},methods:{getKeyOfRow:function(e,t){var i=this.table.rowKey;return i?(0,r.getRowIdentity)(e,i):t},isColumnHidden:function(e){return!0===this.fixed||"left"===this.fixed?e>=this.leftFixedLeafCount:"right"===this.fixed?e<this.columnsCount-this.rightFixedLeafCount:e<this.leftFixedLeafCount||e>=this.columnsCount-this.rightFixedLeafCount},getSpan:function(e,t,i,n){var r=1,a=1,o=this.table.spanMethod;if("function"==typeof o){var l=o({row:e,column:t,rowIndex:i,columnIndex:n});Array.isArray(l)?(r=l[0],a=l[1]):"object"===(void 0===l?"undefined":s(l))&&(r=l.rowspan,a=l.colspan)}return{rowspan:r,colspan:a}},getRowStyle:function(e,t){var i=this.table.rowStyle;return"function"==typeof i?i.call(null,{row:e,rowIndex:t}):i},getRowClass:function(e,t){var i=["el-table__row"];this.stripe&&t%2==1&&i.push("el-table__row--striped");var n=this.table.rowClassName;return"string"==typeof n?i.push(n):"function"==typeof n&&i.push(n.call(null,{row:e,rowIndex:t})),this.store.states.expandRows.indexOf(e)>-1&&i.push("expanded"),i.join(" ")},getCellStyle:function(e,t,i,n){var s=this.table.cellStyle;return"function"==typeof s?s.call(null,{rowIndex:e,columnIndex:t,row:i,column:n}):s},getCellClass:function(e,t,i,n){var s=[n.id,n.align,n.className];this.isColumnHidden(t)&&s.push("is-hidden");var r=this.table.cellClassName;return"string"==typeof r?s.push(r):"function"==typeof r&&s.push(r.call(null,{rowIndex:e,columnIndex:t,row:i,column:n})),s.join(" ")},handleCellMouseEnter:function(e,t){var i=this.table,n=(0,r.getCell)(e);if(n){var s=(0,r.getColumnByCell)(i,n),o=i.hoverState={cell:n,column:s,row:t};i.$emit("cell-mouse-enter",o.row,o.column,o.cell,e)}var l=e.target.querySelector(".cell");if((0,a.hasClass)(l,"el-tooltip")&&l.scrollWidth>l.offsetWidth&&this.$refs.tooltip){var u=this.$refs.tooltip;this.tooltipContent=n.textContent||n.innerText,u.referenceElm=n,u.$refs.popper&&(u.$refs.popper.style.display="none"),u.doDestroy(),u.setExpectedState(!0),this.activateTooltip(u)}},handleCellMouseLeave:function(e){var t=this.$refs.tooltip;if(t&&(t.setExpectedState(!1),t.handleClosePopper()),(0,r.getCell)(e)){var i=this.table.hoverState;this.table.$emit("cell-mouse-leave",i.row,i.column,i.cell,e)}},handleMouseEnter:function(e){this.store.commit("setHoverRow",e)},handleMouseLeave:function(){this.store.commit("setHoverRow",null)},handleContextMenu:function(e,t){this.handleEvent(e,t,"contextmenu")},handleDoubleClick:function(e,t){this.handleEvent(e,t,"dblclick")},handleClick:function(e,t){this.store.commit("setCurrentRow",t),this.handleEvent(e,t,"click")},handleEvent:function(e,t,i){var n=this.table,s=(0,r.getCell)(e),a=void 0;s&&(a=(0,r.getColumnByCell)(n,s))&&n.$emit("cell-"+i,t,a,s,e),n.$emit("row-"+i,t,e,a)},handleExpandClick:function(e){this.store.toggleRowExpansion(e)}}}},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0;var s=i(4),r=i(14),a=n(r),o=i(31),l=n(o),u=i(2),c=n(u),d=i(209),h=n(d),f=function e(t){var i=[];return t.forEach(function(t){t.children?(i.push(t),i.push.apply(i,e(t.children))):i.push(t)}),i},p=function(e){var t=1,i=function e(i,n){if(n&&(i.level=n.level+1,t<i.level&&(t=i.level)),i.children){var s=0;i.children.forEach(function(t){e(t,i),s+=t.colSpan}),i.colSpan=s}else i.colSpan=1};e.forEach(function(e){e.level=1,i(e)});for(var n=[],s=0;s<t;s++)n.push([]);return f(e).forEach(function(e){e.children?e.rowSpan=1:e.rowSpan=t-e.level+1,n[e.level-1].push(e)}),n};t.default={name:"ElTableHeader",render:function(e){var t=this,i=this.store.states.originColumns,n=p(i,this.columns),s=n.length>1;return s&&(this.$parent.isGroup=!0),e("table",{class:"el-table__header",attrs:{cellspacing:"0",cellpadding:"0",border:"0"}},[e("colgroup",null,[this._l(this.columns,function(t){return e("col",{attrs:{name:t.id,width:t.realWidth||t.width}},[])}),!this.fixed&&this.layout.gutterWidth?e("col",{attrs:{name:"gutter",width:this.layout.scrollY?this.layout.gutterWidth:""}},[]):""]),e("thead",{class:[{"is-group":s,"has-gutter":this.hasGutter}]},[this._l(n,function(i,n){return e("tr",{style:t.getHeaderRowStyle(n),class:t.getHeaderRowClass(n)},[t._l(i,function(s,r){return e("th",{attrs:{colspan:s.colSpan,rowspan:s.rowSpan},on:{mousemove:function(e){return t.handleMouseMove(e,s)},mouseout:t.handleMouseOut,mousedown:function(e){return t.handleMouseDown(e,s)},click:function(e){return t.handleHeaderClick(e,s)}},style:t.getHeaderCellStyle(n,r,i,s),class:t.getHeaderCellClass(n,r,i,s)},[e("div",{class:["cell",s.filteredValue&&s.filteredValue.length>0?"highlight":"",s.labelClassName]},[s.renderHeader?s.renderHeader.call(t._renderProxy,e,{column:s,$index:r,store:t.store,_self:t.$parent.$vnode.context}):s.label,s.sortable?e("span",{class:"caret-wrapper",on:{click:function(e){return t.handleSortClick(e,s)}}},[e("i",{class:"sort-caret ascending el-icon-caret-top",on:{click:function(e){return t.handleSortClick(e,s,"ascending")}}},[]),e("i",{class:"sort-caret descending el-icon-caret-bottom",on:{click:function(e){return t.handleSortClick(e,s,"descending")}}},[])]):"",s.filterable?e("span",{class:"el-table__column-filter-trigger",on:{click:function(e){return t.handleFilterClick(e,s)}}},[e("i",{class:["el-icon-arrow-down",s.filterOpened?"el-icon-arrow-up":""]},[])]):""])])}),t.hasGutter?e("th",{class:"gutter",style:{width:t.layout.scrollY?t.layout.gutterWidth+"px":"0"}},[]):""])})])])},props:{fixed:String,store:{required:!0},layout:{required:!0},border:Boolean,defaultSort:{type:Object,default:function(){return{prop:"",order:""}}}},components:{ElCheckbox:a.default,ElTag:l.default},computed:{table:function(){return this.$parent},isAllSelected:function(){return this.store.states.isAllSelected},columnsCount:function(){return this.store.states.columns.length},leftFixedCount:function(){return this.store.states.fixedColumns.length},rightFixedCount:function(){return this.store.states.rightFixedColumns.length},leftFixedLeafCount:function(){return this.store.states.fixedLeafColumnsLength},rightFixedLeafCount:function(){return this.store.states.rightFixedLeafColumnsLength},columns:function(){return this.store.states.columns},hasGutter:function(){return!this.fixed&&this.layout.gutterWidth}},created:function(){this.filterPanels={}},mounted:function(){var e=this;this.defaultSort.prop&&function(){var t=e.store.states;t.sortProp=e.defaultSort.prop,t.sortOrder=e.defaultSort.order||"ascending",e.$nextTick(function(i){for(var n=0,s=e.columns.length;n<s;n++){var r=e.columns[n];if(r.property===t.sortProp){r.order=t.sortOrder,t.sortingColumn=r;break}}t.sortingColumn&&e.store.commit("changeSortCondition")})}()},beforeDestroy:function(){var e=this.filterPanels;for(var t in e)e.hasOwnProperty(t)&&e[t]&&e[t].$destroy(!0)},methods:{isCellHidden:function(e,t){for(var i=0,n=0;n<e;n++)i+=t[n].colSpan;var s=i+t[e].colSpan-1;return!0===this.fixed||"left"===this.fixed?s>=this.leftFixedLeafCount:"right"===this.fixed?i<this.columnsCount-this.rightFixedLeafCount:s<this.leftFixedLeafCount||i>=this.columnsCount-this.rightFixedLeafCount},getHeaderRowStyle:function(e){var t=this.table.headerRowStyle;return"function"==typeof t?t.call(null,{rowIndex:e}):t},getHeaderRowClass:function(e){var t=[],i=this.table.headerRowClassName;return"string"==typeof i?t.push(i):"function"==typeof i&&t.push(i.call(null,{rowIndex:e})),t.join(" ")},getHeaderCellStyle:function(e,t,i,n){var s=this.table.headerCellStyle;return"function"==typeof s?s.call(null,{rowIndex:e,columnIndex:t,row:i,column:n}):s},getHeaderCellClass:function(e,t,i,n){var s=[n.id,n.order,n.headerAlign,n.className,n.labelClassName];0===e&&this.isCellHidden(t,i)&&s.push("is-hidden"),n.children||s.push("is-leaf"),n.sortable&&s.push("is-sortable");var r=this.table.headerCellClassName;return"string"==typeof r?s.push(r):"function"==typeof r&&s.push(r.call(null,{rowIndex:e,columnIndex:t,row:i,column:n})),s.join(" ")},toggleAllSelection:function(){this.store.commit("toggleAllSelection")},handleFilterClick:function(e,t){e.stopPropagation();var i=e.target,n=i.parentNode,s=this.$parent,r=this.filterPanels[t.id];if(r&&t.filterOpened)return void(r.showPopper=!1);r||(r=new c.default(h.default),this.filterPanels[t.id]=r,t.filterPlacement&&(r.placement=t.filterPlacement),r.table=s,r.cell=n,r.column=t,!this.$isServer&&r.$mount(document.createElement("div"))),setTimeout(function(){r.showPopper=!0},16)},handleHeaderClick:function(e,t){!t.filters&&t.sortable?this.handleSortClick(e,t):t.filters&&!t.sortable&&this.handleFilterClick(e,t),this.$parent.$emit("header-click",t,e)},handleMouseDown:function(e,t){var i=this;this.$isServer||t.children&&t.children.length>0||this.draggingColumn&&this.border&&function(){i.dragging=!0,i.$parent.resizeProxyVisible=!0;var n=i.$parent,r=n.$el,a=r.getBoundingClientRect().left,o=i.$el.querySelector("th."+t.id),l=o.getBoundingClientRect(),u=l.left-a+30;(0,s.addClass)(o,"noclick"),i.dragState={startMouseLeft:e.clientX,startLeft:l.right-a,startColumnLeft:l.left-a,tableLeft:a};var c=n.$refs.resizeProxy;c.style.left=i.dragState.startLeft+"px",document.onselectstart=function(){return!1},document.ondragstart=function(){return!1};var d=function(e){var t=e.clientX-i.dragState.startMouseLeft,n=i.dragState.startLeft+t;c.style.left=Math.max(u,n)+"px"},h=function r(){if(i.dragging){var a=i.dragState,l=a.startColumnLeft,u=a.startLeft,h=parseInt(c.style.left,10),f=h-l;t.width=t.realWidth=f,n.$emit("header-dragend",t.width,u-l,t,e),i.store.scheduleLayout(),document.body.style.cursor="",i.dragging=!1,i.draggingColumn=null,i.dragState={},n.resizeProxyVisible=!1}document.removeEventListener("mousemove",d),document.removeEventListener("mouseup",r),document.onselectstart=null,document.ondragstart=null,setTimeout(function(){(0,s.removeClass)(o,"noclick")},0)};document.addEventListener("mousemove",d),document.addEventListener("mouseup",h)}()},handleMouseMove:function(e,t){if(!(t.children&&t.children.length>0)){for(var i=e.target;i&&"TH"!==i.tagName;)i=i.parentNode;if(t&&t.resizable&&!this.dragging&&this.border){var n=i.getBoundingClientRect(),r=document.body.style;n.width>12&&n.right-e.pageX<8?(r.cursor="col-resize",(0,s.hasClass)(i,"is-sortable")&&(i.style.cursor="col-resize"),this.draggingColumn=t):this.dragging||(r.cursor="",(0,s.hasClass)(i,"is-sortable")&&(i.style.cursor="pointer"),this.draggingColumn=null)}}},handleMouseOut:function(){this.$isServer||(document.body.style.cursor="")},toggleOrder:function(e){return e?"ascending"===e?"descending":null:"ascending"},handleSortClick:function(e,t,i){e.stopPropagation();for(var n=i||this.toggleOrder(t.order),r=e.target;r&&"TH"!==r.tagName;)r=r.parentNode;if(r&&"TH"===r.tagName&&(0,s.hasClass)(r,"noclick"))return void(0,s.removeClass)(r,"noclick");if(t.sortable){var a=this.store.states,o=a.sortProp,l=void 0,u=a.sortingColumn;u!==t&&(u&&(u.order=null),a.sortingColumn=t,o=t.property),n?l=t.order=n:(l=t.order=null,a.sortingColumn=null,o=null),a.sortProp=o,a.sortOrder=l,this.store.commit("changeSortCondition")}}},data:function(){return{draggingColumn:null,dragging:!1,dragState:{}}}}},function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=i(210),s=i.n(n),r=i(212),a=i(0),o=a(s.a,r.a,!1,null,null,null);t.default=o.exports},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0;var s=i(10),r=n(s),a=i(21),o=i(5),l=n(o),u=i(17),c=n(u),d=i(211),h=n(d),f=i(14),p=n(f),m=i(46),v=n(m);t.default={name:"ElTableFilterPanel",mixins:[r.default,l.default],directives:{Clickoutside:c.default},components:{ElCheckbox:p.default,ElCheckboxGroup:v.default},props:{placement:{type:String,default:"bottom-end"}},customRender:function(e){return e("div",{class:"el-table-filter"},[e("div",{class:"el-table-filter__content"},[]),e("div",{class:"el-table-filter__bottom"},[e("button",{on:{click:this.handleConfirm}},[this.t("el.table.confirmFilter")]),e("button",{on:{click:this.handleReset}},[this.t("el.table.resetFilter")])])])},methods:{isActive:function(e){return e.value===this.filterValue},handleOutsideClick:function(){this.showPopper=!1},handleConfirm:function(){this.confirmFilter(this.filteredValue),this.handleOutsideClick()},handleReset:function(){this.filteredValue=[],this.confirmFilter(this.filteredValue),this.handleOutsideClick()},handleSelect:function(e){this.filterValue=e,void 0!==e&&null!==e?this.confirmFilter(this.filteredValue):this.confirmFilter([]),this.handleOutsideClick()},confirmFilter:function(e){this.table.store.commit("filterChange",{column:this.column,values:e})}},data:function(){return{table:null,cell:null,column:null}},computed:{filters:function(){return this.column&&this.column.filters},filterValue:{get:function(){return(this.column.filteredValue||[])[0]},set:function(e){this.filteredValue&&(void 0!==e&&null!==e?this.filteredValue.splice(0,1,e):this.filteredValue.splice(0,1))}},filteredValue:{get:function(){return this.column?this.column.filteredValue||[]:[]},set:function(e){this.column&&(this.column.filteredValue=e)}},multiple:function(){return!this.column||this.column.filterMultiple}},mounted:function(){var e=this;this.popperElm=this.$el,this.referenceElm=this.cell,this.table.bodyWrapper.addEventListener("scroll",function(){e.updatePopper()}),this.$watch("showPopper",function(t){e.column&&(e.column.filterOpened=t),t?h.default.open(e):h.default.close(e)})},watch:{showPopper:function(e){!0===e&&parseInt(this.popperJS._popper.style.zIndex,10)<a.PopupManager.zIndex&&(this.popperJS._popper.style.zIndex=a.PopupManager.nextZIndex())}}}},function(e,t,i){"use strict";t.__esModule=!0;var n=i(2),s=function(e){return e&&e.__esModule?e:{default:e}}(n),r=[];!s.default.prototype.$isServer&&document.addEventListener("click",function(e){r.forEach(function(t){var i=e.target;t&&t.$el&&(i===t.$el||t.$el.contains(i)||t.handleOutsideClick&&t.handleOutsideClick(e))})}),t.default={open:function(e){e&&r.push(e)},close:function(e){-1!==r.indexOf(e)&&r.splice(e,1)}}},function(e,t,i){"use strict";var n=function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("transition",{attrs:{name:"el-zoom-in-top"}},[e.multiple?i("div",{directives:[{name:"show",rawName:"v-show",value:e.showPopper,expression:"showPopper"}],staticClass:"el-table-filter"},[i("div",{staticClass:"el-table-filter__content"},[i("el-checkbox-group",{staticClass:"el-table-filter__checkbox-group",model:{value:e.filteredValue,callback:function(t){e.filteredValue=t},expression:"filteredValue"}},e._l(e.filters,function(t){return i("el-checkbox",{key:t.value,attrs:{label:t.value}},[e._v(e._s(t.text))])}))],1),i("div",{staticClass:"el-table-filter__bottom"},[i("button",{class:{"is-disabled":0===e.filteredValue.length},attrs:{disabled:0===e.filteredValue.length},on:{click:e.handleConfirm}},[e._v(e._s(e.t("el.table.confirmFilter")))]),i("button",{on:{click:e.handleReset}},[e._v(e._s(e.t("el.table.resetFilter")))])])]):i("div",{directives:[{name:"show",rawName:"v-show",value:e.showPopper,expression:"showPopper"}],staticClass:"el-table-filter"},[i("ul",{staticClass:"el-table-filter__list"},[i("li",{staticClass:"el-table-filter__list-item",class:{"is-active":void 0===e.filterValue||null===e.filterValue},on:{click:function(t){e.handleSelect(null)}}},[e._v(e._s(e.t("el.table.clearFilter")))]),e._l(e.filters,function(t){return i("li",{key:t.value,staticClass:"el-table-filter__list-item",class:{"is-active":e.isActive(t)},attrs:{label:t.value},on:{click:function(i){e.handleSelect(t.value)}}},[e._v(e._s(t.text))])})],2)])])},s=[],r={render:n,staticRenderFns:s};t.a=r},function(e,t,i){"use strict";t.__esModule=!0,t.default={name:"ElTableFooter",render:function(e){var t=this,i=[];return this.columns.forEach(function(e,n){if(0===n)return void(i[n]=t.sumText);var s=t.store.states.data.map(function(t){return Number(t[e.property])}),r=[],a=!0;s.forEach(function(e){if(!isNaN(e)){a=!1;var t=(""+e).split(".")[1];r.push(t?t.length:0)}});var o=Math.max.apply(null,r);i[n]=a?"":s.reduce(function(e,t){var i=Number(t);return isNaN(i)?e:parseFloat((e+t).toFixed(Math.min(o,20)))},0)}),e("table",{class:"el-table__footer",attrs:{cellspacing:"0",cellpadding:"0",border:"0"}},[e("colgroup",null,[this._l(this.columns,function(t){return e("col",{attrs:{name:t.id,width:t.realWidth||t.width}},[])}),!this.fixed&&this.layout.gutterWidth?e("col",{attrs:{name:"gutter",width:this.layout.scrollY?this.layout.gutterWidth:""}},[]):""]),e("tbody",{class:[{"has-gutter":this.hasGutter}]},[e("tr",null,[this._l(this.columns,function(n,s){return e("td",{attrs:{colspan:n.colSpan,rowspan:n.rowSpan},class:[n.id,n.headerAlign,n.className||"",t.isCellHidden(s,t.columns)?"is-hidden":"",n.children?"":"is-leaf",n.labelClassName]},[e("div",{class:["cell",n.labelClassName]},[t.summaryMethod?t.summaryMethod({columns:t.columns,data:t.store.states.data})[s]:i[s]])])}),this.hasGutter?e("td",{class:"gutter",style:{width:this.layout.scrollY?this.layout.gutterWidth+"px":"0"}},[]):""])])])},props:{fixed:String,store:{required:!0},layout:{required:!0},summaryMethod:Function,sumText:String,border:Boolean,defaultSort:{type:Object,default:function(){return{prop:"",order:""}}}},computed:{isAllSelected:function(){return this.store.states.isAllSelected},columnsCount:function(){return this.store.states.columns.length},leftFixedCount:function(){return this.store.states.fixedColumns.length},rightFixedCount:function(){return this.store.states.rightFixedColumns.length},columns:function(){return this.store.states.columns},hasGutter:function(){return!this.fixed&&this.layout.gutterWidth}},methods:{isCellHidden:function(e,t){if(!0===this.fixed||"left"===this.fixed)return e>=this.leftFixedCount;if("right"===this.fixed){for(var i=0,n=0;n<e;n++)i+=t[n].colSpan;return i<this.columnsCount-this.rightFixedCount}return e<this.leftFixedCount||e>=this.columnsCount-this.rightFixedCount}}}},function(e,t,i){"use strict";var n=function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("div",{staticClass:"el-table",class:[{"el-table--fit":e.fit,"el-table--striped":e.stripe,"el-table--border":e.border||e.isGroup,"el-table--hidden":e.isHidden,"el-table--group":e.isGroup,"el-table--fluid-height":e.maxHeight,"el-table--enable-row-hover":!e.store.states.isComplex,"el-table--enable-row-transition":0!==(e.store.states.data||[]).length&&(e.store.states.data||[]).length<100},e.tableSize?"el-table--"+e.tableSize:""],on:{mouseleave:function(t){e.handleMouseLeave(t)}}},[i("div",{ref:"hiddenColumns",staticClass:"hidden-columns"},[e._t("default")],2),e.showHeader?i("div",{ref:"headerWrapper",staticClass:"el-table__header-wrapper"},[i("table-header",{ref:"tableHeader",style:{width:e.layout.bodyWidth?e.layout.bodyWidth+"px":""},attrs:{store:e.store,layout:e.layout,border:e.border,"default-sort":e.defaultSort}})],1):e._e(),i("div",{ref:"bodyWrapper",staticClass:"el-table__body-wrapper",class:["is-scroll-"+e.scrollPosition],style:[e.bodyHeight]},[i("table-body",{style:{width:e.bodyWidth},attrs:{context:e.context,store:e.store,stripe:e.stripe,layout:e.layout,"row-class-name":e.rowClassName,"row-style":e.rowStyle,highlight:e.highlightCurrentRow}}),e.data&&0!==e.data.length?e._e():i("div",{staticClass:"el-table__empty-block",style:{width:e.bodyWidth}},[i("span",{staticClass:"el-table__empty-text"},[e._t("empty",[e._v(e._s(e.emptyText||e.t("el.table.emptyText")))])],2)]),e.$slots.append?i("div",{ref:"appendWrapper",staticClass:"el-table__append-wrapper"},[e._t("append")],2):e._e()],1),e.showSummary?i("div",{directives:[{name:"show",rawName:"v-show",value:e.data&&e.data.length>0,expression:"data && data.length > 0"}],ref:"footerWrapper",staticClass:"el-table__footer-wrapper"},[i("table-footer",{style:{width:e.layout.bodyWidth?e.layout.bodyWidth+"px":""},attrs:{store:e.store,layout:e.layout,border:e.border,"sum-text":e.sumText||e.t("el.table.sumText"),"summary-method":e.summaryMethod,"default-sort":e.defaultSort}})],1):e._e(),e.fixedColumns.length>0?i("div",{ref:"fixedWrapper",staticClass:"el-table__fixed",style:[{width:e.layout.fixedWidth?e.layout.fixedWidth+"px":""},e.fixedHeight]},[e.showHeader?i("div",{ref:"fixedHeaderWrapper",staticClass:"el-table__fixed-header-wrapper"},[i("table-header",{ref:"fixedTableHeader",style:{width:e.layout.fixedWidth?e.layout.fixedWidth+"px":""},attrs:{fixed:"left",border:e.border,store:e.store,layout:e.layout}})],1):e._e(),i("div",{ref:"fixedBodyWrapper",staticClass:"el-table__fixed-body-wrapper",style:[{top:e.layout.headerHeight+"px"},e.fixedBodyHeight]},[i("table-body",{style:{width:e.layout.fixedWidth?e.layout.fixedWidth+"px":""},attrs:{fixed:"left",store:e.store,stripe:e.stripe,layout:e.layout,highlight:e.highlightCurrentRow,"row-class-name":e.rowClassName,"row-style":e.rowStyle}}),e.$slots.append?i("div",{staticClass:"el-table__append-gutter",style:{height:e.layout.appendHeight+"px"}}):e._e()],1),e.showSummary?i("div",{directives:[{name:"show",rawName:"v-show",value:e.data&&e.data.length>0,expression:"data && data.length > 0"}],ref:"fixedFooterWrapper",staticClass:"el-table__fixed-footer-wrapper"},[i("table-footer",{style:{width:e.layout.fixedWidth?e.layout.fixedWidth+"px":""},attrs:{fixed:"left",border:e.border,"sum-text":e.sumText||e.t("el.table.sumText"),"summary-method":e.summaryMethod,store:e.store,layout:e.layout}})],1):e._e()]):e._e(),e.rightFixedColumns.length>0?i("div",{ref:"rightFixedWrapper",staticClass:"el-table__fixed-right",style:[{width:e.layout.rightFixedWidth?e.layout.rightFixedWidth+"px":""},{right:e.layout.scrollY?(e.border?e.layout.gutterWidth:e.layout.gutterWidth||0)+"px":""},e.fixedHeight]},[e.showHeader?i("div",{ref:"rightFixedHeaderWrapper",staticClass:"el-table__fixed-header-wrapper"},[i("table-header",{ref:"rightFixedTableHeader",style:{width:e.layout.rightFixedWidth?e.layout.rightFixedWidth+"px":""},attrs:{fixed:"right",border:e.border,store:e.store,layout:e.layout}})],1):e._e(),i("div",{ref:"rightFixedBodyWrapper",staticClass:"el-table__fixed-body-wrapper",style:[{top:e.layout.headerHeight+"px"},e.fixedBodyHeight]},[i("table-body",{style:{width:e.layout.rightFixedWidth?e.layout.rightFixedWidth+"px":""},attrs:{fixed:"right",store:e.store,stripe:e.stripe,layout:e.layout,"row-class-name":e.rowClassName,"row-style":e.rowStyle,highlight:e.highlightCurrentRow}})],1),e.showSummary?i("div",{directives:[{name:"show",rawName:"v-show",value:e.data&&e.data.length>0,expression:"data && data.length > 0"}],ref:"rightFixedFooterWrapper",staticClass:"el-table__fixed-footer-wrapper"},[i("table-footer",{style:{width:e.layout.rightFixedWidth?e.layout.rightFixedWidth+"px":""},attrs:{fixed:"right",border:e.border,"sum-text":e.sumText||e.t("el.table.sumText"),"summary-method":e.summaryMethod,store:e.store,layout:e.layout}})],1):e._e()]):e._e(),e.rightFixedColumns.length>0?i("div",{staticClass:"el-table__fixed-right-patch",style:{width:e.layout.scrollY?e.layout.gutterWidth+"px":"0",height:e.layout.headerHeight+"px"}}):e._e(),i("div",{directives:[{name:"show",rawName:"v-show",value:e.resizeProxyVisible,expression:"resizeProxyVisible"}],ref:"resizeProxy",staticClass:"el-table__column-resize-proxy"})])},s=[],r={render:n,staticRenderFns:s};t.a=r},function(e,t,i){"use strict";t.__esModule=!0;var n=i(216),s=function(e){return e&&e.__esModule?e:{default:e}}(n);s.default.install=function(e){e.component(s.default.name,s.default)},t.default=s.default},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0;var s=i(14),r=n(s),a=i(31),o=n(a),l=i(12),u=n(l),c=i(6),d=1,h={default:{order:""},selection:{width:48,minWidth:48,realWidth:48,order:"",className:"el-table-column--selection"},expand:{width:48,minWidth:48,realWidth:48,order:""},index:{width:48,minWidth:48,realWidth:48,order:""}},f={selection:{renderHeader:function(e){return e("el-checkbox",{nativeOn:{click:this.toggleAllSelection},attrs:{value:this.isAllSelected}},[])},renderCell:function(e,t){var i=t.row,n=t.column,s=t.store,r=t.$index;return e("el-checkbox",{attrs:{value:s.isSelected(i),disabled:!!n.selectable&&!n.selectable.call(null,i,r)},on:{input:function(){s.commit("rowSelectedChanged",i)}}},[])},sortable:!1,resizable:!1},index:{renderHeader:function(e,t){return t.column.label||"#"},renderCell:function(e,t){var i=t.$index,n=t.column,s=i+1,r=n.index;return"number"==typeof r?s=i+r:"function"==typeof r&&(s=r(i)),e("div",null,[s])},sortable:!1},expand:{renderHeader:function(e,t){return t.column.label||""},renderCell:function(e,t,i){var n=t.row;return e("div",{class:"el-table__expand-icon "+(t.store.states.expandRows.indexOf(n)>-1?"el-table__expand-icon--expanded":""),on:{click:function(){return i.handleExpandClick(n)}}},[e("i",{class:"el-icon el-icon-arrow-right"},[])])},sortable:!1,resizable:!1,className:"el-table__expand-column"}},p=function(e,t){var i={};(0,u.default)(i,h[e||"default"]);for(var n in t)if(t.hasOwnProperty(n)){var s=t[n];void 0!==s&&(i[n]=s)}return i.minWidth||(i.minWidth=80),i.realWidth=i.width||i.minWidth,i},m=function(e,t){var i=t.row,n=t.column,s=n.property,r=s&&(0,c.getPropByPath)(i,s).v;return n&&n.formatter?n.formatter(i,n,r):r};t.default={name:"ElTableColumn",props:{type:{type:String,default:"default"},label:String,className:String,labelClassName:String,property:String,prop:String,width:{},minWidth:{},renderHeader:Function,sortable:{type:[String,Boolean],default:!1},sortMethod:Function,sortBy:[String,Function,Array],resizable:{type:Boolean,default:!0},context:{},columnKey:String,align:String,headerAlign:String,showTooltipWhenOverflow:Boolean,showOverflowTooltip:Boolean,fixed:[Boolean,String],formatter:Function,selectable:Function,reserveSelection:Boolean,filterMethod:Function,filteredValue:Array,filters:Array,filterPlacement:String,filterMultiple:{type:Boolean,default:!0},index:[Number,Function]},data:function(){return{isSubColumn:!1,columns:[]}},beforeCreate:function(){this.row={},this.column={},this.$index=0},components:{ElCheckbox:r.default,ElTag:o.default},computed:{owner:function(){for(var e=this.$parent;e&&!e.tableId;)e=e.$parent;return e}},created:function(){var e=this;this.customRender=this.$options.render,this.$options.render=function(t){return t("div",e.$slots.default)},this.columnId=(this.$parent.tableId||this.$parent.columnId+"_")+"column_"+d++;var t=this.$parent,i=this.owner;this.isSubColumn=i!==t;var n=this.type,s=this.width;void 0!==s&&(s=parseInt(s,10),isNaN(s)&&(s=null));var r=this.minWidth;void 0!==r&&(r=parseInt(r,10),isNaN(r)&&(r=80));var a=p(n,{id:this.columnId,columnKey:this.columnKey,label:this.label,className:this.className,labelClassName:this.labelClassName,property:this.prop||this.property,type:n,renderCell:null,renderHeader:this.renderHeader,minWidth:r,width:s,isColumnGroup:!1,context:this.context,align:this.align?"is-"+this.align:null,headerAlign:this.headerAlign?"is-"+this.headerAlign:this.align?"is-"+this.align:null,sortable:""===this.sortable||this.sortable,sortMethod:this.sortMethod,sortBy:this.sortBy,resizable:this.resizable,showOverflowTooltip:this.showOverflowTooltip||this.showTooltipWhenOverflow,formatter:this.formatter,selectable:this.selectable,reserveSelection:this.reserveSelection,fixed:""===this.fixed||this.fixed,filterMethod:this.filterMethod,filters:this.filters,filterable:this.filters||this.filterMethod,filterMultiple:this.filterMultiple,filterOpened:!1,filteredValue:this.filteredValue||[],filterPlacement:this.filterPlacement||"",index:this.index});(0,u.default)(a,f[n]||{}),this.columnConfig=a;var o=a.renderCell,l=this;if("expand"===n)return i.renderExpanded=function(e,t){return l.$scopedSlots.default?l.$scopedSlots.default(t):l.$slots.default},void(a.renderCell=function(e,t){return e("div",{class:"cell"},[o(e,t,this._renderProxy)])});a.renderCell=function(e,t){return l.$scopedSlots.default&&(o=function(){return l.$scopedSlots.default(t)}),o||(o=m),l.showOverflowTooltip||l.showTooltipWhenOverflow?e("div",{class:"cell el-tooltip",style:"width:"+(t.column.realWidth||t.column.width)+"px"},[o(e,t)]):e("div",{class:"cell"},[o(e,t)])}},destroyed:function(){this.$parent&&this.owner.store.commit("removeColumn",this.columnConfig)},watch:{label:function(e){this.columnConfig&&(this.columnConfig.label=e)},prop:function(e){this.columnConfig&&(this.columnConfig.property=e)},property:function(e){this.columnConfig&&(this.columnConfig.property=e)},filters:function(e){this.columnConfig&&(this.columnConfig.filters=e)},filterMultiple:function(e){this.columnConfig&&(this.columnConfig.filterMultiple=e)},align:function(e){this.columnConfig&&(this.columnConfig.align=e?"is-"+e:null,this.headerAlign||(this.columnConfig.headerAlign=e?"is-"+e:null))},headerAlign:function(e){this.columnConfig&&(this.columnConfig.headerAlign="is-"+(e||this.align))},width:function(e){this.columnConfig&&(this.columnConfig.width=e,this.owner.store.scheduleLayout())},minWidth:function(e){this.columnConfig&&(this.columnConfig.minWidth=e,this.owner.store.scheduleLayout())},fixed:function(e){this.columnConfig&&(this.columnConfig.fixed=e,this.owner.store.scheduleLayout())},sortable:function(e){this.columnConfig&&(this.columnConfig.sortable=e)},index:function(e){this.columnConfig&&(this.columnConfig.index=e)}},mounted:function(){var e=this.owner,t=this.$parent,i=void 0;i=this.isSubColumn?[].indexOf.call(t.$el.children,this.$el):[].indexOf.call(t.$refs.hiddenColumns.children,this.$el),e.store.commit("insertColumn",this.columnConfig,i,this.isSubColumn?t.columnConfig:null)}}},function(e,t,i){"use strict";t.__esModule=!0;var n=i(218),s=function(e){return e&&e.__esModule?e:{default:e}}(n);s.default.install=function(e){e.component(s.default.name,s.default)},t.default=s.default},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0;var s=i(48),r=n(s),a=i(222),o=n(a),l=i(237),u=n(l),c=function(e){return"daterange"===e||"datetimerange"===e?u.default:o.default};t.default={mixins:[r.default],name:"ElDatePicker",props:{type:{type:String,default:"date"},timeArrowControl:Boolean},watch:{type:function(e){this.picker?(this.unmountPicker(),this.panel=c(e),this.mountPicker()):this.panel=c(e)}},created:function(){this.panel=c(this.type)}}},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0;var s=i(2),r=n(s),a=i(17),o=n(a),l=i(11),u=i(10),c=n(u),d=i(1),h=n(d),f=i(26),p=n(f),m=i(8),v=n(m),g=i(12),b=n(g),y={props:{appendToBody:c.default.props.appendToBody,offset:c.default.props.offset,boundariesPadding:c.default.props.boundariesPadding},methods:c.default.methods,data:function(){return(0,b.default)({visibleArrow:!0},c.default.data)},beforeDestroy:c.default.beforeDestroy},_={date:"yyyy-MM-dd",month:"yyyy-MM",datetime:"yyyy-MM-dd HH:mm:ss",time:"HH:mm:ss",week:"yyyywWW",timerange:"HH:mm:ss",daterange:"yyyy-MM-dd",datetimerange:"yyyy-MM-dd HH:mm:ss",year:"yyyy"},x=["date","datetime","time","time-select","week","month","year","daterange","timerange","datetimerange"],C=function(e,t){return(0,l.formatDate)(e,t)},w=function(e,t){return(0,l.parseDate)(e,t)},k=function(e,t){if(Array.isArray(e)&&2===e.length){var i=e[0],n=e[1];if(i&&n)return[(0,l.formatDate)(i,t),(0,l.formatDate)(n,t)]}return""},S=function(e,t,i){if(Array.isArray(e)||(e=e.split(i)),2===e.length){var n=e[0],s=e[1];return[(0,l.parseDate)(n,t),(0,l.parseDate)(s,t)]}return[]},M={default:{formatter:function(e){return e?""+e:""},parser:function(e){return void 0===e||""===e?null:e}},week:{formatter:function(e,t){var i=(0,l.getWeekNumber)(e),n=e.getMonth(),s=new Date(e);1===i&&11===n&&(s.setHours(0,0,0,0),s.setDate(s.getDate()+3-(s.getDay()+6)%7));var r=(0,l.formatDate)(s,t);return r=/WW/.test(r)?r.replace(/WW/,i<10?"0"+i:i):r.replace(/W/,i)},parser:function(e){var t=(e||"").split("w");if(2===t.length){var i=Number(t[0]),n=Number(t[1]);if(!isNaN(i)&&!isNaN(n)&&n<54)return e}return null}},date:{formatter:C,parser:w},datetime:{formatter:C,parser:w},daterange:{formatter:k,parser:S},datetimerange:{formatter:k,parser:S},timerange:{formatter:k,parser:S},time:{formatter:C,parser:w},month:{formatter:C,parser:w},year:{formatter:C,parser:w},number:{formatter:function(e){return e?""+e:""},parser:function(e){var t=Number(e);return isNaN(e)?null:t}}},$={left:"bottom-start",center:"bottom",right:"bottom-end"},E=function(e,t,i){var n=arguments.length>3&&void 0!==arguments[3]?arguments[3]:"-";return e?(0,(M[i]||M.default).parser)(e,t||_[i],n):null},D=function(e,t,i){return e?(0,(M[i]||M.default).formatter)(e,t||_[i]):null},T=function(e,t){var i=e instanceof Array,n=t instanceof Array;return i&&n?new Date(e[0]).getTime()===new Date(t[0]).getTime()&&new Date(e[1]).getTime()===new Date(t[1]).getTime():!i&&!n&&new Date(e).getTime()===new Date(t).getTime()},P=function(e){return"string"==typeof e||e instanceof String},O=function(e){return null===e||void 0===e||P(e)||Array.isArray(e)&&2===e.length&&e.every(P)};t.default={mixins:[h.default,y,(0,p.default)("reference")],inject:{elFormItem:{default:""}},props:{size:String,format:String,valueFormat:String,readonly:Boolean,placeholder:String,startPlaceholder:String,endPlaceholder:String,name:{default:"",validator:O},disabled:Boolean,clearable:{type:Boolean,default:!0},id:{default:"",validator:O},popperClass:String,editable:{type:Boolean,default:!0},align:{type:String,default:"left"},value:{},defaultValue:{},rangeSeparator:{default:"-"},pickerOptions:{},unlinkPanels:Boolean},components:{ElInput:v.default},directives:{Clickoutside:o.default},data:function(){return{pickerVisible:!1,showClose:!1,userInput:null,valueOnOpen:null,unwatchPickerOptions:null}},watch:{pickerVisible:function(e){if(!this.readonly&&!this.disabled)if(e)this.showPicker(),this.valueOnOpen=this.value;else{this.hidePicker(),this.emitChange(this.value);var t=this.parseString(this.displayValue);this.userInput&&t&&this.isValidValue(t)&&(this.userInput=null),this.dispatch("ElFormItem","el.form.blur"),this.blur()}},parsedValue:{immediate:!0,handler:function(e){this.picker&&(this.picker.value=e)}},defaultValue:function(e){this.picker&&(this.picker.defaultValue=e)}},computed:{ranged:function(){return this.type.indexOf("range")>-1},reference:function(){var e=this.$refs.reference;return e.$el||e},refInput:function(){return this.reference?[].slice.call(this.reference.querySelectorAll("input")):[]},valueIsEmpty:function(){var e=this.value;if(Array.isArray(e)){for(var t=0,i=e.length;t<i;t++)if(e[t])return!1}else if(e)return!1;return!0},triggerClass:function(){return-1!==this.type.indexOf("time")?"el-icon-time":"el-icon-date"},selectionMode:function(){return"week"===this.type?"week":"month"===this.type?"month":"year"===this.type?"year":"day"},haveTrigger:function(){return void 0!==this.showTrigger?this.showTrigger:-1!==x.indexOf(this.type)},displayValue:function(){var e=D(this.parsedValue,this.format,this.type,this.rangeSeparator);return Array.isArray(this.userInput)?[this.userInput[0]||e&&e[0]||"",this.userInput[1]||e&&e[1]||""]:null!==this.userInput?this.userInput:e||""},parsedValue:function(){var e=(0,l.isDateObject)(this.value)||Array.isArray(this.value)&&this.value.every(l.isDateObject);return this.valueFormat&&!e?E(this.value,this.valueFormat,this.type,this.rangeSeparator)||this.value:this.value},_elFormItemSize:function(){return(this.elFormItem||{}).elFormItemSize},pickerSize:function(){return this.size||this._elFormItemSize||(this.$ELEMENT||{}).size}},created:function(){this.popperOptions={boundariesPadding:0,gpuAcceleration:!1},this.placement=$[this.align]||$.left},methods:{blur:function(){this.refInput.forEach(function(e){return e.blur()})},parseValue:function(e){var t=(0,l.isDateObject)(e)||Array.isArray(e)&&e.every(l.isDateObject);return this.valueFormat&&!t?E(e,this.valueFormat,this.type,this.rangeSeparator)||e:e},formatToValue:function(e){var t=(0,l.isDateObject)(e)||Array.isArray(e)&&e.every(l.isDateObject);return this.valueFormat&&t?D(e,this.valueFormat,this.type,this.rangeSeparator):e},parseString:function(e){var t=Array.isArray(e)?this.type:this.type.replace("range","");return E(e,this.format,t)},formatToString:function(e){var t=Array.isArray(e)?this.type:this.type.replace("range","");return D(e,this.format,t)},handleMouseEnter:function(){this.readonly||this.disabled||!this.valueIsEmpty&&this.clearable&&(this.showClose=!0)},handleChange:function(){if(this.userInput){var e=this.parseString(this.displayValue);e&&(this.picker.value=e,this.isValidValue(e)&&(this.emitInput(e),this.userInput=null))}},handleStartInput:function(e){this.userInput?this.userInput=[e.target.value,this.userInput[1]]:this.userInput=[e.target.value,null]},handleEndInput:function(e){this.userInput?this.userInput=[this.userInput[0],e.target.value]:this.userInput=[null,e.target.value]},handleStartChange:function(e){var t=this.parseString(this.userInput&&this.userInput[0]);if(t){this.userInput=[this.formatToString(t),this.displayValue[1]];var i=[t,this.picker.value&&this.picker.value[1]];this.picker.value=i,this.isValidValue(i)&&(this.emitInput(i),this.userInput=null)}},handleEndChange:function(e){var t=this.parseString(this.userInput&&this.userInput[1]);if(t){this.userInput=[this.displayValue[0],this.formatToString(t)];var i=[this.picker.value&&this.picker.value[0],t];this.picker.value=i,this.isValidValue(i)&&(this.emitInput(i),this.userInput=null)}},handleClickIcon:function(e){this.readonly||this.disabled||(this.showClose?(e.stopPropagation(),this.emitInput(null),this.emitChange(null),this.showClose=!1,this.picker&&"function"==typeof this.picker.handleClear&&this.picker.handleClear()):this.pickerVisible=!this.pickerVisible)},handleClose:function(){this.pickerVisible=!1,this.ranged&&this.$emit("blur",this)},handleFocus:function(){var e=this.type;-1===x.indexOf(e)||this.pickerVisible||(this.pickerVisible=!0),this.$emit("focus",this)},handleBlur:function(){this.$emit("blur",this)},handleKeydown:function(e){var t=this,i=e.keyCode;if(27===i)return this.pickerVisible=!1,void e.stopPropagation();if(9===i)return void(this.ranged?setTimeout(function(){-1===t.refInput.indexOf(document.activeElement)&&(t.pickerVisible=!1,t.blur(),e.stopPropagation())},0):(this.handleChange(),this.pickerVisible=this.picker.visible=!1,this.blur(),e.stopPropagation()));if(13===i&&this.displayValue){var n=this.parseString(this.displayValue);return this.isValidValue(n)&&(this.handleChange(),this.pickerVisible=this.picker.visible=!1,this.blur()),void e.stopPropagation()}if(this.userInput)return void e.stopPropagation();this.picker&&this.picker.handleKeydown&&this.picker.handleKeydown(e)},handleRangeClick:function(){var e=this.type;-1===x.indexOf(e)||this.pickerVisible||(this.pickerVisible=!0),this.$emit("focus",this)},hidePicker:function(){this.picker&&(this.picker.resetView&&this.picker.resetView(),this.pickerVisible=this.picker.visible=!1,this.destroyPopper())},showPicker:function(){var e=this;this.$isServer||(this.picker||this.mountPicker(),this.pickerVisible=this.picker.visible=!0,this.updatePopper(),this.picker.value=this.parsedValue,this.picker.resetView&&this.picker.resetView(),this.$nextTick(function(){e.picker.adjustSpinners&&e.picker.adjustSpinners()}))},mountPicker:function(){var e=this;this.picker=new r.default(this.panel).$mount(),this.picker.defaultValue=this.defaultValue,this.picker.popperClass=this.popperClass,this.popperElm=this.picker.$el,this.picker.width=this.reference.getBoundingClientRect().width,this.picker.showTime="datetime"===this.type||"datetimerange"===this.type,this.picker.selectionMode=this.selectionMode,this.picker.unlinkPanels=this.unlinkPanels,this.picker.arrowControl=this.arrowControl||this.timeArrowControl||!1,this.format&&(this.picker.format=this.format);var t=function(){var t=e.pickerOptions;t&&t.selectableRange&&function(){var i=t.selectableRange,n=M.datetimerange.parser,s=_.timerange;i=Array.isArray(i)?i:[i],e.picker.selectableRange=i.map(function(t){return n(t,s,e.rangeSeparator)})}();for(var i in t)t.hasOwnProperty(i)&&"selectableRange"!==i&&(e.picker[i]=t[i])};t(),this.unwatchPickerOptions=this.$watch("pickerOptions",function(){return t()},{deep:!0}),this.$el.appendChild(this.picker.$el),this.picker.resetView&&this.picker.resetView(),this.picker.$on("dodestroy",this.doDestroy),this.picker.$on("pick",function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"",i=arguments.length>1&&void 0!==arguments[1]&&arguments[1];e.userInput=null,e.pickerVisible=e.picker.visible=i,e.emitInput(t),e.picker.resetView&&e.picker.resetView()}),this.picker.$on("select-range",function(t,i,n){0!==e.refInput.length&&(n&&"min"!==n?"max"===n&&(e.refInput[1].setSelectionRange(t,i),e.refInput[1].focus()):(e.refInput[0].setSelectionRange(t,i),e.refInput[0].focus()))})},unmountPicker:function(){this.picker&&(this.picker.$destroy(),this.picker.$off(),"function"==typeof this.unwatchPickerOptions&&this.unwatchPickerOptions(),this.picker.$el.parentNode.removeChild(this.picker.$el))},emitChange:function(e){this.$emit("change",e),this.dispatch("ElFormItem","el.form.change",e),this.valueOnOpen=e},emitInput:function(e){var t=this.formatToValue(e);T(this.value,t)||this.$emit("input",t)},isValidValue:function(e){return this.picker||this.mountPicker(),!this.picker.isValidValue||e&&this.picker.isValidValue(e)}}}},function(e,t,i){var n;!function(s){"use strict";function r(e,t){for(var i=[],n=0,s=e.length;n<s;n++)i.push(e[n].substr(0,t));return i}function a(e){return function(t,i,n){var s=n[e].indexOf(i.charAt(0).toUpperCase()+i.substr(1).toLowerCase());~s&&(t.month=s)}}function o(e,t){for(e=String(e),t=t||2;e.length<t;)e="0"+e;return e}var l={},u=/d{1,4}|M{1,4}|yy(?:yy)?|S{1,3}|Do|ZZ|([HhMsDm])\1?|[aA]|"[^"]*"|'[^']*'/g,c=/\d\d?/,d=/\d{3}/,h=/\d{4}/,f=/[0-9]*['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+|[\u0600-\u06FF\/]+(\s*?[\u0600-\u06FF]+){1,2}/i,p=function(){},m=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],v=["January","February","March","April","May","June","July","August","September","October","November","December"],g=r(v,3),b=r(m,3);l.i18n={dayNamesShort:b,dayNames:m,monthNamesShort:g,monthNames:v,amPm:["am","pm"],DoFn:function(e){return e+["th","st","nd","rd"][e%10>3?0:(e-e%10!=10)*e%10]}};var y={D:function(e){return e.getDay()},DD:function(e){return o(e.getDay())},Do:function(e,t){return t.DoFn(e.getDate())},d:function(e){return e.getDate()},dd:function(e){return o(e.getDate())},ddd:function(e,t){return t.dayNamesShort[e.getDay()]},dddd:function(e,t){return t.dayNames[e.getDay()]},M:function(e){return e.getMonth()+1},MM:function(e){return o(e.getMonth()+1)},MMM:function(e,t){return t.monthNamesShort[e.getMonth()]},MMMM:function(e,t){return t.monthNames[e.getMonth()]},yy:function(e){return String(e.getFullYear()).substr(2)},yyyy:function(e){return e.getFullYear()},h:function(e){return e.getHours()%12||12},hh:function(e){return o(e.getHours()%12||12)},H:function(e){return e.getHours()},HH:function(e){return o(e.getHours())},m:function(e){return e.getMinutes()},mm:function(e){return o(e.getMinutes())},s:function(e){return e.getSeconds()},ss:function(e){return o(e.getSeconds())},S:function(e){return Math.round(e.getMilliseconds()/100)},SS:function(e){return o(Math.round(e.getMilliseconds()/10),2)},SSS:function(e){return o(e.getMilliseconds(),3)},a:function(e,t){return e.getHours()<12?t.amPm[0]:t.amPm[1]},A:function(e,t){return e.getHours()<12?t.amPm[0].toUpperCase():t.amPm[1].toUpperCase()},ZZ:function(e){var t=e.getTimezoneOffset();return(t>0?"-":"+")+o(100*Math.floor(Math.abs(t)/60)+Math.abs(t)%60,4)}},_={d:[c,function(e,t){e.day=t}],M:[c,function(e,t){e.month=t-1}],yy:[c,function(e,t){var i=new Date,n=+(""+i.getFullYear()).substr(0,2);e.year=""+(t>68?n-1:n)+t}],h:[c,function(e,t){e.hour=t}],m:[c,function(e,t){e.minute=t}],s:[c,function(e,t){e.second=t}],yyyy:[h,function(e,t){e.year=t}],S:[/\d/,function(e,t){e.millisecond=100*t}],SS:[/\d{2}/,function(e,t){e.millisecond=10*t}],SSS:[d,function(e,t){e.millisecond=t}],D:[c,p],ddd:[f,p],MMM:[f,a("monthNamesShort")],MMMM:[f,a("monthNames")],a:[f,function(e,t,i){var n=t.toLowerCase();n===i.amPm[0]?e.isPm=!1:n===i.amPm[1]&&(e.isPm=!0)}],ZZ:[/[\+\-]\d\d:?\d\d/,function(e,t){var i,n=(t+"").match(/([\+\-]|\d\d)/gi);n&&(i=60*n[1]+parseInt(n[2],10),e.timezoneOffset="+"===n[0]?i:-i)}]};_.DD=_.D,_.dddd=_.ddd,_.Do=_.dd=_.d,_.mm=_.m,_.hh=_.H=_.HH=_.h,_.MM=_.M,_.ss=_.s,_.A=_.a,l.masks={default:"ddd MMM dd yyyy HH:mm:ss",shortDate:"M/D/yy",mediumDate:"MMM d, yyyy",longDate:"MMMM d, yyyy",fullDate:"dddd, MMMM d, yyyy",shortTime:"HH:mm",mediumTime:"HH:mm:ss",longTime:"HH:mm:ss.SSS"},l.format=function(e,t,i){var n=i||l.i18n;if("number"==typeof e&&(e=new Date(e)),"[object Date]"!==Object.prototype.toString.call(e)||isNaN(e.getTime()))throw new Error("Invalid Date in fecha.format");return t=l.masks[t]||t||l.masks.default,t.replace(u,function(t){return t in y?y[t](e,n):t.slice(1,t.length-1)})},l.parse=function(e,t,i){var n=i||l.i18n;if("string"!=typeof t)throw new Error("Invalid format in fecha.parse");if(t=l.masks[t]||t,e.length>1e3)return!1;var s=!0,r={};if(t.replace(u,function(t){if(_[t]){var i=_[t],a=e.search(i[0]);~a?e.replace(i[0],function(t){return i[1](r,t,n),e=e.substr(a+t.length),t}):s=!1}return _[t]?"":t.slice(1,t.length-1)}),!s)return!1;var a=new Date;!0===r.isPm&&null!=r.hour&&12!=+r.hour?r.hour=+r.hour+12:!1===r.isPm&&12==+r.hour&&(r.hour=0);var o;return null!=r.timezoneOffset?(r.minute=+(r.minute||0)-+r.timezoneOffset,o=new Date(Date.UTC(r.year||a.getFullYear(),r.month||0,r.day||1,r.hour||0,r.minute||0,r.second||0,r.millisecond||0))):o=new Date(r.year||a.getFullYear(),r.month||0,r.day||1,r.hour||0,r.minute||0,r.second||0,r.millisecond||0),o},void 0!==e&&e.exports?e.exports=l:void 0!==(n=function(){return l}.call(t,i,t,e))&&(e.exports=n)}()},function(e,t,i){"use strict";var n=function(){var e=this,t=e.$createElement,i=e._self._c||t;return e.ranged?i("div",{directives:[{name:"clickoutside",rawName:"v-clickoutside",value:e.handleClose,expression:"handleClose"}],ref:"reference",staticClass:"el-date-editor el-range-editor el-input__inner",class:["el-date-editor--"+e.type,e.pickerSize?"el-range-editor--"+e.pickerSize:"",e.disabled?"is-disabled":"",e.pickerVisible?"is-active":""],on:{click:e.handleRangeClick,mouseenter:e.handleMouseEnter,mouseleave:function(t){e.showClose=!1},keydown:e.handleKeydown}},[i("i",{class:["el-input__icon","el-range__icon",e.triggerClass]}),i("input",{staticClass:"el-range-input",attrs:{placeholder:e.startPlaceholder,disabled:e.disabled,id:e.id&&e.id[0],readonly:!e.editable||e.readonly,name:e.name&&e.name[0]},domProps:{value:e.displayValue&&e.displayValue[0]},on:{input:e.handleStartInput,change:e.handleStartChange,focus:e.handleFocus}}),i("span",{staticClass:"el-range-separator"},[e._v(e._s(e.rangeSeparator))]),i("input",{staticClass:"el-range-input",attrs:{placeholder:e.endPlaceholder,disabled:e.disabled,id:e.id&&e.id[1],readonly:!e.editable||e.readonly,name:e.name&&e.name[1]},domProps:{value:e.displayValue&&e.displayValue[1]},on:{input:e.handleEndInput,change:e.handleEndChange,focus:e.handleFocus}}),e.haveTrigger?i("i",{staticClass:"el-input__icon el-range__close-icon",class:{"el-icon-circle-close":e.showClose},on:{click:e.handleClickIcon}}):e._e()]):i("el-input",{directives:[{name:"clickoutside",rawName:"v-clickoutside",value:e.handleClose,expression:"handleClose"}],ref:"reference",staticClass:"el-date-editor",class:"el-date-editor--"+e.type,attrs:{readonly:!e.editable||e.readonly,disabled:e.disabled,size:e.pickerSize,id:e.id,name:e.name,placeholder:e.placeholder,value:e.displayValue,validateEvent:!1,"prefix-icon":e.triggerClass},on:{focus:e.handleFocus,blur:e.handleBlur,input:function(t){return e.userInput=t}},nativeOn:{keydown:function(t){e.handleKeydown(t)},mouseenter:function(t){e.handleMouseEnter(t)},mouseleave:function(t){e.showClose=!1},change:function(t){e.handleChange(t)}}},[e.haveTrigger?i("i",{staticClass:"el-input__icon",class:{"el-icon-circle-close":e.showClose},attrs:{slot:"suffix"},on:{click:e.handleClickIcon},slot:"suffix"}):e._e()])},s=[],r={render:n,staticRenderFns:s};t.a=r},function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=i(223),s=i.n(n),r=i(236),a=i(0),o=a(s.a,r.a,!1,null,null,null);t.default=o.exports},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0;var s=i(11),r=i(5),a=n(r),o=i(8),l=n(o),u=i(18),c=n(u),d=i(49),h=n(d),f=i(228),p=n(f),m=i(231),v=n(m),g=i(73),b=n(g);t.default={mixins:[a.default],watch:{showTime:function(e){var t=this;e&&this.$nextTick(function(e){var i=t.$refs.input.$el;i&&(t.pickerWidth=i.getBoundingClientRect().width+10)})},value:function(e){(0,s.isDate)(e)?this.date=new Date(e):this.date=this.defaultValue?new Date(this.defaultValue):new Date},defaultValue:function(e){(0,s.isDate)(this.value)||(this.date=e?new Date(e):new Date)},timePickerVisible:function(e){var t=this;e&&this.$nextTick(function(){return t.$refs.timepicker.adjustSpinners()})},selectionMode:function(e){"month"===e&&("year"===this.currentView&&"month"===this.currentView||(this.currentView="month"))}},methods:{proxyTimePickerDataProperties:function(){var e=this,t=function(t){e.$refs.timepicker.format=t},i=function(t){e.$refs.timepicker.value=t},n=function(t){e.$refs.timepicker.date=t};this.$watch("format",t),this.$watch("value",i),this.$watch("date",n),t(this.timeFormat),i(this.value),n(this.date)},handleClear:function(){this.date=this.defaultValue?new Date(this.defaultValue):new Date,this.$emit("pick",null)},emit:function(e){for(var t=arguments.length,i=Array(t>1?t-1:0),n=1;n<t;n++)i[n-1]=arguments[n];if(!e)return void this.$emit.apply(this,["pick",e].concat(i));this.showTime?this.$emit.apply(this,["pick",(0,s.clearMilliseconds)(e)].concat(i)):this.$emit.apply(this,["pick",(0,s.clearTime)(e)].concat(i))},showMonthPicker:function(){this.currentView="month"},showYearPicker:function(){this.currentView="year"},prevMonth:function(){this.date=(0,s.prevMonth)(this.date)},nextMonth:function(){this.date=(0,s.nextMonth)(this.date)},prevYear:function(){"year"===this.currentView?this.date=(0,s.prevYear)(this.date,10):this.date=(0,s.prevYear)(this.date)},nextYear:function(){"year"===this.currentView?this.date=(0,s.nextYear)(this.date,10):this.date=(0,s.nextYear)(this.date)},handleShortcutClick:function(e){e.onClick&&e.onClick(this)},handleTimePick:function(e,t,i){if((0,s.isDate)(e)){var n=(0,s.modifyTime)(this.date,e.getHours(),e.getMinutes(),e.getSeconds());this.date=n,this.emit(this.date,!0)}else this.emit(e,!0);i||(this.timePickerVisible=t)},handleMonthPick:function(e){"month"===this.selectionMode?(this.date=(0,s.modifyDate)(this.date,this.year,e,1),this.emit(this.date)):(this.date=(0,s.modifyDate)(this.date,this.year,e,this.monthDate),this.currentView="date")},handleDatePick:function(e){"day"===this.selectionMode?(this.date=(0,s.modifyDate)(this.date,e.getFullYear(),e.getMonth(),e.getDate()),this.emit(this.date,this.showTime)):"week"===this.selectionMode&&this.emit(e.date)},handleYearPick:function(e){"year"===this.selectionMode?(this.date=(0,s.modifyDate)(this.date,e,0,1),this.emit(this.date)):(this.date=(0,s.modifyDate)(this.date,e,this.month,this.monthDate),this.currentView="month")},changeToNow:function(){this.date=new Date,this.emit(this.date)},confirm:function(){this.emit(this.date)},resetView:function(){"month"===this.selectionMode?this.currentView="month":"year"===this.selectionMode?this.currentView="year":this.currentView="date"},handleEnter:function(){document.body.addEventListener("keydown",this.handleKeydown)},handleLeave:function(){this.$emit("dodestroy"),document.body.removeEventListener("keydown",this.handleKeydown)},handleKeydown:function(e){var t=e.keyCode,i=[38,40,37,39];this.visible&&!this.timePickerVisible&&(-1!==i.indexOf(t)&&(this.handleKeyControl(t),event.stopPropagation(),event.preventDefault()),13===t&&this.$emit("pick",this.date,!1))},handleKeyControl:function(e){for(var t={year:{38:-4,40:4,37:-1,39:1,offset:function(e,t){return e.setFullYear(e.getFullYear()+t)}},month:{38:-4,40:4,37:-1,39:1,offset:function(e,t){return e.setMonth(e.getMonth()+t)}},week:{38:-1,40:1,37:-1,39:1,offset:function(e,t){return e.setDate(e.getDate()+7*t)}},day:{38:-7,40:7,37:-1,39:1,offset:function(e,t){return e.setDate(e.getDate()+t)}}},i=this.selectionMode,n=this.date.getTime(),s=new Date(this.date.getTime());Math.abs(n-s.getTime())<=31536e6;){var r=t[i];if(r.offset(s,r[e]),"function"!=typeof this.disabledDate||!this.disabledDate(s)){this.date=s,this.$emit("pick",s,!0);break}}},handleVisibleTimeChange:function(e){var t=(0,s.parseDate)(e.target.value,this.timeFormat);t&&(this.date=(0,s.modifyDate)(t,this.year,this.month,this.monthDate),this.$refs.timepicker.value=this.date,this.timePickerVisible=!1,this.$emit("pick",this.date,!0))},handleVisibleDateChange:function(e){var t=(0,s.parseDate)(e.target.value,this.dateFormat);if(t){if("function"==typeof this.disabledDate&&this.disabledDate(t))return;this.date=(0,s.modifyTime)(t,this.date.getHours(),this.date.getMinutes(),this.date.getSeconds()),this.resetView(),this.$emit("pick",this.date,!0)}},isValidValue:function(e){return e&&!isNaN(e)&&("function"!=typeof this.disabledDate||!this.disabledDate(e))}},components:{TimePicker:h.default,YearTable:p.default,MonthTable:v.default,DateTable:b.default,ElInput:l.default,ElButton:c.default},data:function(){return{popperClass:"",date:new Date,value:"",defaultValue:null,showTime:!1,selectionMode:"day",shortcuts:"",visible:!1,currentView:"date",disabledDate:"",firstDayOfWeek:7,showWeekNumber:!1,timePickerVisible:!1,format:"",arrowControl:!1}},computed:{year:function(){return this.date.getFullYear()},month:function(){return this.date.getMonth()},week:function(){return(0,s.getWeekNumber)(this.date)},monthDate:function(){return this.date.getDate()},footerVisible:function(){return this.showTime},visibleTime:function(){var e=this.value||this.defaultValue;return e?(0,s.formatDate)(e,this.timeFormat):""},visibleDate:function(){var e=this.value||this.defaultValue;return e?(0,s.formatDate)(e,this.dateFormat):""},yearLabel:function(){var e=this.t("el.datepicker.year");if("year"===this.currentView){var t=10*Math.floor(this.year/10);return e?t+" "+e+" - "+(t+9)+" "+e:t+" - "+(t+9)}return this.year+" "+e},timeFormat:function(){return this.format&&-1===this.format.indexOf("ss")?"HH:mm":"HH:mm:ss"},dateFormat:function(){return this.format?this.format.replace("HH","").replace(/[^a-zA-Z]*mm/,"").replace(/[^a-zA-Z]*ss/,"").trim():"yyyy-MM-dd"}}}},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0;var s=i(11),r=i(5),a=n(r),o=i(72),l=n(o);t.default={mixins:[a.default],components:{TimeSpinner:l.default},props:{visible:Boolean,timeArrowControl:Boolean},watch:{visible:function(e){var t=this;e?(this.oldValue=this.value,this.$nextTick(function(){return t.$refs.spinner.emitSelectRange("hours")})):this.needInitAdjust=!0},value:function(e){var t=this,i=void 0;e instanceof Date?i=(0,s.limitTimeRange)(e,this.selectableRange,this.format):e||(i=this.defaultValue?new Date(this.defaultValue):new Date),this.date=i,this.visible&&this.needInitAdjust&&(this.$nextTick(function(e){return t.adjustSpinners()}),this.needInitAdjust=!1)},selectableRange:function(e){this.$refs.spinner.selectableRange=e},defaultValue:function(e){(0,s.isDate)(this.value)||(this.date=e?new Date(e):new Date)}},data:function(){return{popperClass:"",format:"HH:mm:ss",value:"",defaultValue:null,date:new Date,oldValue:new Date,selectableRange:[],selectionRange:[0,2],disabled:!1,arrowControl:!1,needInitAdjust:!0}},computed:{showSeconds:function(){return-1!==(this.format||"").indexOf("ss")},useArrow:function(){return this.arrowControl||this.timeArrowControl||!1}},methods:{handleCancel:function(){this.$emit("pick",this.oldValue,!1)},handleChange:function(e){this.visible&&(this.date=(0,s.clearMilliseconds)(e),this.isValidValue(this.date)&&this.$emit("pick",this.date,!0))},setSelectionRange:function(e,t){this.$emit("select-range",e,t),this.selectionRange=[e,t]},handleConfirm:function(){var e=arguments.length>0&&void 0!==arguments[0]&&arguments[0],t=arguments[1];if(!t){var i=(0,s.clearMilliseconds)((0,s.limitTimeRange)(this.date,this.selectableRange,this.format));this.$emit("pick",i,e,t)}},handleKeydown:function(e){var t=e.keyCode,i={38:-1,40:1,37:-1,39:1};if(37===t||39===t){var n=i[t];return this.changeSelectionRange(n),void e.preventDefault()}if(38===t||40===t){var s=i[t];return this.$refs.spinner.scrollDown(s),void e.preventDefault()}},isValidValue:function(e){return(0,s.timeWithinRange)(e,this.selectableRange,this.format)},adjustSpinners:function(){return this.$refs.spinner.adjustSpinners()},changeSelectionRange:function(e){var t=[0,3].concat(this.showSeconds?[6]:[]),i=["hours","minutes"].concat(this.showSeconds?["seconds"]:[]),n=t.indexOf(this.selectionRange[0]),s=(n+e+t.length)%t.length;this.$refs.spinner.emitSelectRange(i[s])}},mounted:function(){var e=this;this.$nextTick(function(){return e.handleConfirm(!0,!0)}),this.$emit("mounted")}}},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0;var s=i(11),r=i(27),a=n(r),o=i(71),l=n(o);t.default={components:{ElScrollbar:a.default},directives:{repeatClick:l.default},props:{date:{},defaultValue:{},showSeconds:{type:Boolean,default:!0},arrowControl:Boolean},computed:{hours:function(){return this.date.getHours()},minutes:function(){return this.date.getMinutes()},seconds:function(){return this.date.getSeconds()},hoursList:function(){return(0,s.getRangeHours)(this.selectableRange)},arrowHourList:function(){var e=this.hours;return[e>0?e-1:void 0,e,e<23?e+1:void 0]},arrowMinuteList:function(){var e=this.minutes;return[e>0?e-1:void 0,e,e<59?e+1:void 0]},arrowSecondList:function(){var e=this.seconds;return[e>0?e-1:void 0,e,e<59?e+1:void 0]}},data:function(){return{selectableRange:[],currentScrollbar:null}},mounted:function(){var e=this;this.$nextTick(function(){!e.arrowControl&&e.bindScrollEvent()})},methods:{increase:function(){this.scrollDown(1)},decrease:function(){this.scrollDown(-1)},modifyDateField:function(e,t){switch(e){case"hours":this.$emit("change",(0,s.modifyTime)(this.date,t,this.minutes,this.seconds));break;case"minutes":this.$emit("change",(0,s.modifyTime)(this.date,this.hours,t,this.seconds));break;case"seconds":this.$emit("change",(0,s.modifyTime)(this.date,this.hours,this.minutes,t))}},handleClick:function(e,t){var i=t.value;t.disabled||(this.modifyDateField(e,i),this.emitSelectRange(e),this.adjustSpinner(e,i))},emitSelectRange:function(e){"hours"===e?this.$emit("select-range",0,2):"minutes"===e?this.$emit("select-range",3,5):"seconds"===e&&this.$emit("select-range",6,8),this.currentScrollbar=e},bindScrollEvent:function(){var e=this,t=function(t){e.$refs[t].wrap.onscroll=function(i){e.handleScroll(t,i)}};t("hours"),t("minutes"),t("seconds")},handleScroll:function(e){var t=Math.min(Math.floor((this.$refs[e].wrap.scrollTop-80)/32+3),"hours"===e?23:59);this.modifyDateField(e,t)},adjustSpinners:function(){this.adjustSpinner("hours",this.hours),this.adjustSpinner("minutes",this.minutes),this.adjustSpinner("seconds",this.seconds)},adjustCurrentSpinner:function(e){this.adjustSpinner(e,this[e])},adjustSpinner:function(e,t){if(!this.arrowControl){var i=this.$refs[e].wrap;i&&(i.scrollTop=Math.max(0,32*(t-2.5)+80))}},scrollDown:function(e){this.currentScrollbar||this.emitSelectRange("hours");var t=this.currentScrollbar,i=this.hoursList,n=this[t];if("hours"===this.currentScrollbar){var s=Math.abs(e);e=e>0?1:-1;for(var r=i.length;r--&&s;)n=(n+e+i.length)%i.length,i[n]||s--;if(i[n])return}else n=(n+e+60)%60;this.modifyDateField(t,n),this.adjustSpinner(t,n)}}}},function(e,t,i){"use strict";var n=function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("div",{staticClass:"el-time-spinner",class:{"has-seconds":e.showSeconds}},[e.arrowControl?e._e():[i("el-scrollbar",{ref:"hours",staticClass:"el-time-spinner__wrapper",attrs:{"wrap-style":"max-height: inherit;","view-class":"el-time-spinner__list",noresize:"",tag:"ul"},nativeOn:{mouseenter:function(t){e.emitSelectRange("hours")},mousemove:function(t){e.adjustCurrentSpinner("hours")}}},e._l(e.hoursList,function(t,n){return i("li",{staticClass:"el-time-spinner__item",class:{active:n===e.hours,disabled:t},attrs:{"track-by":"hour"},on:{click:function(i){e.handleClick("hours",{value:n,disabled:t})}}},[e._v(e._s(("0"+n).slice(-2)))])})),i("el-scrollbar",{ref:"minutes",staticClass:"el-time-spinner__wrapper",attrs:{"wrap-style":"max-height: inherit;","view-class":"el-time-spinner__list",noresize:"",tag:"ul"},nativeOn:{mouseenter:function(t){e.emitSelectRange("minutes")},mousemove:function(t){e.adjustCurrentSpinner("minutes")}}},e._l(60,function(t,n){return i("li",{staticClass:"el-time-spinner__item",class:{active:n===e.minutes},on:{click:function(t){e.handleClick("minutes",{value:n,disabled:!1})}}},[e._v(e._s(("0"+n).slice(-2)))])})),i("el-scrollbar",{directives:[{name:"show",rawName:"v-show",value:e.showSeconds,expression:"showSeconds"}],ref:"seconds",staticClass:"el-time-spinner__wrapper",attrs:{"wrap-style":"max-height: inherit;","view-class":"el-time-spinner__list",noresize:"",tag:"ul"},nativeOn:{mouseenter:function(t){e.emitSelectRange("seconds")},mousemove:function(t){e.adjustCurrentSpinner("seconds")}}},e._l(60,function(t,n){return i("li",{staticClass:"el-time-spinner__item",class:{active:n===e.seconds},on:{click:function(t){e.handleClick("seconds",{value:n,disabled:!1})}}},[e._v(e._s(("0"+n).slice(-2)))])}))],e.arrowControl?[i("div",{staticClass:"el-time-spinner__wrapper is-arrow",on:{mouseenter:function(t){e.emitSelectRange("hours")}}},[i("i",{directives:[{name:"repeat-click",rawName:"v-repeat-click",value:e.decrease,expression:"decrease"}],staticClass:"el-time-spinner__arrow el-icon-arrow-up"}),i("i",{directives:[{name:"repeat-click",rawName:"v-repeat-click",value:e.increase,expression:"increase"}],staticClass:"el-time-spinner__arrow el-icon-arrow-down"}),i("ul",{ref:"hours",staticClass:"el-time-spinner__list"},e._l(e.arrowHourList,function(t){return i("li",{staticClass:"el-time-spinner__item",class:{active:t===e.hours,disabled:e.hoursList[t]}},[e._v("\n          "+e._s(void 0===t?"":("0"+t).slice(-2))+"\n        ")])}))]),i("div",{staticClass:"el-time-spinner__wrapper is-arrow",on:{mouseenter:function(t){e.emitSelectRange("minutes")}}},[i("i",{directives:[{name:"repeat-click",rawName:"v-repeat-click",value:e.decrease,expression:"decrease"}],staticClass:"el-time-spinner__arrow el-icon-arrow-up"}),i("i",{directives:[{name:"repeat-click",rawName:"v-repeat-click",value:e.increase,expression:"increase"}],staticClass:"el-time-spinner__arrow el-icon-arrow-down"}),i("ul",{ref:"minutes",staticClass:"el-time-spinner__list"},e._l(e.arrowMinuteList,function(t){return i("li",{staticClass:"el-time-spinner__item",class:{active:t===e.minutes}},[e._v("\n          "+e._s(void 0===t?"":("0"+t).slice(-2))+"\n        ")])}))]),e.showSeconds?i("div",{staticClass:"el-time-spinner__wrapper is-arrow",on:{mouseenter:function(t){e.emitSelectRange("seconds")}}},[i("i",{directives:[{name:"repeat-click",rawName:"v-repeat-click",value:e.decrease,expression:"decrease"}],staticClass:"el-time-spinner__arrow el-icon-arrow-up"}),i("i",{directives:[{name:"repeat-click",rawName:"v-repeat-click",value:e.increase,expression:"increase"}],staticClass:"el-time-spinner__arrow el-icon-arrow-down"}),i("ul",{ref:"seconds",staticClass:"el-time-spinner__list"},e._l(e.arrowSecondList,function(t){return i("li",{staticClass:"el-time-spinner__item",class:{active:t===e.seconds}},[e._v("\n          "+e._s(void 0===t?"":("0"+t).slice(-2))+"\n        ")])}))]):e._e()]:e._e()],2)},s=[],r={render:n,staticRenderFns:s};t.a=r},function(e,t,i){"use strict";var n=function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("transition",{attrs:{name:"el-zoom-in-top"},on:{"after-leave":function(t){e.$emit("dodestroy")}}},[i("div",{directives:[{name:"show",rawName:"v-show",value:e.visible,expression:"visible"}],staticClass:"el-time-panel el-popper",class:e.popperClass},[i("div",{staticClass:"el-time-panel__content",class:{"has-seconds":e.showSeconds}},[i("time-spinner",{ref:"spinner",attrs:{"arrow-control":e.useArrow,"show-seconds":e.showSeconds,date:e.date},on:{change:e.handleChange,"select-range":e.setSelectionRange}})],1),i("div",{staticClass:"el-time-panel__footer"},[i("button",{staticClass:"el-time-panel__btn cancel",attrs:{type:"button"},on:{click:e.handleCancel}},[e._v(e._s(e.t("el.datepicker.cancel")))]),i("button",{staticClass:"el-time-panel__btn",class:{confirm:!e.disabled},attrs:{type:"button"},on:{click:function(t){e.handleConfirm()}}},[e._v(e._s(e.t("el.datepicker.confirm")))])])])])},s=[],r={render:n,staticRenderFns:s};t.a=r},function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=i(229),s=i.n(n),r=i(230),a=i(0),o=a(s.a,r.a,!1,null,null,null);t.default=o.exports},function(e,t,i){"use strict";t.__esModule=!0;var n=i(4),s=i(11),r=function(e){var t=(0,s.getDayCountOfYear)(e),i=new Date(e,0,1);return(0,s.range)(t).map(function(e){return(0,s.nextDate)(i,e)})};t.default={props:{disabledDate:{},value:{},defaultValue:{validator:function(e){return null===e||e instanceof Date&&(0,s.isDate)(e)}},date:{}},computed:{startYear:function(){return 10*Math.floor(this.date.getFullYear()/10)}},methods:{getCellStyle:function(e){var t={},i=new Date;return t.disabled="function"==typeof this.disabledDate&&r(e).every(this.disabledDate),t.current=this.value.getFullYear()===e,t.today=i.getFullYear()===e,t.default=this.defaultValue&&this.defaultValue.getFullYear()===e,t},handleYearTableClick:function(e){var t=e.target;if("A"===t.tagName){if((0,n.hasClass)(t.parentNode,"disabled"))return;var i=t.textContent||t.innerText;this.$emit("pick",Number(i))}}}}},function(e,t,i){"use strict";var n=function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("table",{staticClass:"el-year-table",on:{click:e.handleYearTableClick}},[i("tbody",[i("tr",[i("td",{staticClass:"available",class:e.getCellStyle(e.startYear+0)},[i("a",{staticClass:"cell"},[e._v(e._s(e.startYear))])]),i("td",{staticClass:"available",class:e.getCellStyle(e.startYear+1)},[i("a",{staticClass:"cell"},[e._v(e._s(e.startYear+1))])]),i("td",{staticClass:"available",class:e.getCellStyle(e.startYear+2)},[i("a",{staticClass:"cell"},[e._v(e._s(e.startYear+2))])]),i("td",{staticClass:"available",class:e.getCellStyle(e.startYear+3)},[i("a",{staticClass:"cell"},[e._v(e._s(e.startYear+3))])])]),i("tr",[i("td",{staticClass:"available",class:e.getCellStyle(e.startYear+4)},[i("a",{staticClass:"cell"},[e._v(e._s(e.startYear+4))])]),i("td",{staticClass:"available",class:e.getCellStyle(e.startYear+5)},[i("a",{staticClass:"cell"},[e._v(e._s(e.startYear+5))])]),i("td",{staticClass:"available",class:e.getCellStyle(e.startYear+6)},[i("a",{staticClass:"cell"},[e._v(e._s(e.startYear+6))])]),i("td",{staticClass:"available",class:e.getCellStyle(e.startYear+7)},[i("a",{staticClass:"cell"},[e._v(e._s(e.startYear+7))])])]),i("tr",[i("td",{staticClass:"available",class:e.getCellStyle(e.startYear+8)},[i("a",{staticClass:"cell"},[e._v(e._s(e.startYear+8))])]),i("td",{staticClass:"available",class:e.getCellStyle(e.startYear+9)},[i("a",{staticClass:"cell"},[e._v(e._s(e.startYear+9))])]),i("td"),i("td")])])])},s=[],r={render:n,staticRenderFns:s};t.a=r},function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=i(232),s=i.n(n),r=i(233),a=i(0),o=a(s.a,r.a,!1,null,null,null);t.default=o.exports},function(e,t,i){"use strict";t.__esModule=!0;var n=i(5),s=function(e){return e&&e.__esModule?e:{default:e}}(n),r=i(11),a=i(4),o=function(e,t){var i=(0,r.getDayCountOfMonth)(e,t),n=new Date(e,t,1);return(0,r.range)(i).map(function(e){return(0,r.nextDate)(n,e)})};t.default={props:{disabledDate:{},value:{},defaultValue:{validator:function(e){return null===e||e instanceof Date&&(0,r.isDate)(e)}},date:{}},mixins:[s.default],methods:{getCellStyle:function(e){var t={},i=this.date.getFullYear(),n=new Date;return t.disabled="function"==typeof this.disabledDate&&o(i,e).every(this.disabledDate),t.current=this.value.getFullYear()===i&&this.value.getMonth()===e,t.today=n.getFullYear()===i&&n.getMonth()===e,t.default=this.defaultValue&&this.defaultValue.getFullYear()===i&&this.defaultValue.getMonth()===e,t},handleMonthTableClick:function(e){var t=e.target;if("A"===t.tagName&&!(0,a.hasClass)(t.parentNode,"disabled")){var i=t.parentNode.cellIndex,n=t.parentNode.parentNode.rowIndex,s=4*n+i;this.$emit("pick",s)}}}}},function(e,t,i){"use strict";var n=function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("table",{staticClass:"el-month-table",on:{click:e.handleMonthTableClick}},[i("tbody",[i("tr",[i("td",{class:e.getCellStyle(0)},[i("a",{staticClass:"cell"},[e._v(e._s(e.t("el.datepicker.months.jan")))])]),i("td",{class:e.getCellStyle(1)},[i("a",{staticClass:"cell"},[e._v(e._s(e.t("el.datepicker.months.feb")))])]),i("td",{class:e.getCellStyle(2)},[i("a",{staticClass:"cell"},[e._v(e._s(e.t("el.datepicker.months.mar")))])]),i("td",{class:e.getCellStyle(3)},[i("a",{staticClass:"cell"},[e._v(e._s(e.t("el.datepicker.months.apr")))])])]),i("tr",[i("td",{class:e.getCellStyle(4)},[i("a",{staticClass:"cell"},[e._v(e._s(e.t("el.datepicker.months.may")))])]),i("td",{class:e.getCellStyle(5)},[i("a",{staticClass:"cell"},[e._v(e._s(e.t("el.datepicker.months.jun")))])]),i("td",{class:e.getCellStyle(6)},[i("a",{staticClass:"cell"},[e._v(e._s(e.t("el.datepicker.months.jul")))])]),i("td",{class:e.getCellStyle(7)},[i("a",{staticClass:"cell"},[e._v(e._s(e.t("el.datepicker.months.aug")))])])]),i("tr",[i("td",{class:e.getCellStyle(8)},[i("a",{staticClass:"cell"},[e._v(e._s(e.t("el.datepicker.months.sep")))])]),i("td",{class:e.getCellStyle(9)},[i("a",{staticClass:"cell"},[e._v(e._s(e.t("el.datepicker.months.oct")))])]),i("td",{class:e.getCellStyle(10)},[i("a",{staticClass:"cell"},[e._v(e._s(e.t("el.datepicker.months.nov")))])]),i("td",{class:e.getCellStyle(11)},[i("a",{staticClass:"cell"},[e._v(e._s(e.t("el.datepicker.months.dec")))])])])])])},s=[],r={render:n,staticRenderFns:s};t.a=r},function(e,t,i){"use strict";t.__esModule=!0;var n=i(11),s=i(4),r=i(5),a=function(e){return e&&e.__esModule?e:{default:e}}(r),o=["sun","mon","tue","wed","thu","fri","sat"],l=function(e){var t=new Date(e);return t.setHours(0,0,0,0),t.getTime()};t.default={mixins:[a.default],props:{firstDayOfWeek:{default:7,type:Number,validator:function(e){return e>=1&&e<=7}},value:{},defaultValue:{validator:function(e){return null===e||(0,n.isDate)(e)||Array.isArray(e)&&e.every(n.isDate)}},date:{},selectionMode:{default:"day"},showWeekNumber:{type:Boolean,default:!1},disabledDate:{},minDate:{},maxDate:{},rangeState:{default:function(){return{endDate:null,selecting:!1,row:null,column:null}}}},computed:{offsetDay:function(){var e=this.firstDayOfWeek;return e>3?7-e:-e},WEEKS:function(){var e=this.firstDayOfWeek;return o.concat(o).slice(e,e+7)},year:function(){return this.date.getFullYear()},month:function(){return this.date.getMonth()},startDate:function(){return(0,n.getStartDateOfMonth)(this.year,this.month)},rows:function(){var e=new Date(this.year,this.month,1),t=(0,n.getFirstDayOfMonth)(e),i=(0,n.getDayCountOfMonth)(e.getFullYear(),e.getMonth()),s=(0,n.getDayCountOfMonth)(e.getFullYear(),0===e.getMonth()?11:e.getMonth()-1);t=0===t?7:t;for(var r=this.offsetDay,a=this.tableRows,o=1,u=void 0,c=this.startDate,d=this.disabledDate,h=l(new Date),f=0;f<6;f++){var p=a[f];this.showWeekNumber&&(p[0]||(p[0]={type:"week",text:(0,n.getWeekNumber)((0,n.nextDate)(c,7*f+1))}));for(var m=0;m<7;m++){var v=p[this.showWeekNumber?m+1:m];v||(v={row:f,column:m,type:"normal",inRange:!1,start:!1,end:!1}),v.type="normal";var g=7*f+m,b=(0,n.nextDate)(c,g-r).getTime();v.inRange=b>=l(this.minDate)&&b<=l(this.maxDate),v.start=this.minDate&&b===l(this.minDate),v.end=this.maxDate&&b===l(this.maxDate);b===h&&(v.type="today"),f>=0&&f<=1?m+7*f>=t+r?(v.text=o++,2===o&&(u=7*f+m)):(v.text=s-(t+r-m%7)+1+7*f,v.type="prev-month"):o<=i?(v.text=o++,2===o&&(u=7*f+m)):(v.text=o++-i,v.type="next-month"),v.disabled="function"==typeof d&&d(new Date(b)),this.$set(p,this.showWeekNumber?m+1:m,v)}if("week"===this.selectionMode){var y=this.showWeekNumber?1:0,_=this.showWeekNumber?7:6,x=this.isWeekActive(p[y+1]);p[y].inRange=x,p[y].start=x,p[_].inRange=x,p[_].end=x}}return a.firstDayPosition=u,a}},watch:{"rangeState.endDate":function(e){this.markRange(e)},minDate:function(e,t){e&&!t?(this.rangeState.selecting=!0,this.markRange(e)):e?this.markRange():(this.rangeState.selecting=!1,this.markRange(e))},maxDate:function(e,t){e&&!t&&(this.rangeState.selecting=!1,this.markRange(e),this.$emit("pick",{minDate:this.minDate,maxDate:this.maxDate}))}},data:function(){return{tableRows:[[],[],[],[],[],[]]}},methods:{cellMatchesDate:function(e,t){var i=new Date(t);return this.year===i.getFullYear()&&this.month===i.getMonth()&&Number(e.text)===i.getDate()},getCellClasses:function(e){var t=this,i=this.selectionMode,n=this.defaultValue?Array.isArray(this.defaultValue)?this.defaultValue:[this.defaultValue]:[],s=[];return"normal"!==e.type&&"today"!==e.type||e.disabled?s.push(e.type):(s.push("available"),"today"===e.type&&s.push("today")),"normal"===e.type&&n.some(function(i){return t.cellMatchesDate(e,i)})&&s.push("default"),"day"!==i||"normal"!==e.type&&"today"!==e.type||!this.cellMatchesDate(e,this.value)||s.push("current"),!e.inRange||"normal"!==e.type&&"today"!==e.type&&"week"!==this.selectionMode||(s.push("in-range"),e.start&&s.push("start-date"),e.end&&s.push("end-date")),e.disabled&&s.push("disabled"),s.join(" ")},getDateOfCell:function(e,t){var i=7*e+(t-(this.showWeekNumber?1:0))-this.offsetDay;return(0,n.nextDate)(this.startDate,i)},isWeekActive:function(e){if("week"!==this.selectionMode)return!1;var t=new Date(this.year,this.month,1),i=t.getFullYear(),s=t.getMonth();return"prev-month"===e.type&&(t.setMonth(0===s?11:s-1),t.setFullYear(0===s?i-1:i)),"next-month"===e.type&&(t.setMonth(11===s?0:s+1),t.setFullYear(11===s?i+1:i)),t.setDate(parseInt(e.text,10)),(0,n.getWeekNumber)(t)===(0,n.getWeekNumber)(this.date)},markRange:function(e){var t=this.startDate;e||(e=this.maxDate);for(var i=this.rows,s=this.minDate,r=0,a=i.length;r<a;r++)for(var o=i[r],u=0,c=o.length;u<c;u++)if(!this.showWeekNumber||0!==u){var d=o[u],h=7*r+u+(this.showWeekNumber?-1:0),f=(0,n.nextDate)(t,h-this.offsetDay).getTime();d.inRange=s&&f>=l(s)&&f<=l(e),d.start=s&&f===l(s.getTime()),d.end=e&&f===l(e.getTime())}},handleMouseMove:function(e){if(this.rangeState.selecting){this.$emit("changerange",{minDate:this.minDate,maxDate:this.maxDate,rangeState:this.rangeState});var t=e.target;if("SPAN"===t.tagName&&(t=t.parentNode.parentNode),"DIV"===t.tagName&&(t=t.parentNode),"TD"===t.tagName){var i=t.cellIndex,n=t.parentNode.rowIndex-1,s=this.rangeState,r=s.row,a=s.column;r===n&&a===i||(this.rangeState.row=n,this.rangeState.column=i,this.rangeState.endDate=this.getDateOfCell(n,i))}}},handleClick:function(e){var t=this,i=e.target;if("SPAN"===i.tagName&&(i=i.parentNode.parentNode),"DIV"===i.tagName&&(i=i.parentNode),"TD"===i.tagName&&!(0,s.hasClass)(i,"disabled")&&!(0,s.hasClass)(i,"week")){var r=this.selectionMode;"week"===r&&(i=i.parentNode.cells[1]);var a=Number(this.year),o=Number(this.month),l=i.cellIndex,u=i.parentNode.rowIndex,c=this.rows[u-1][l],d=c.text,h=i.className,f=new Date(a,o,1);if(-1!==h.indexOf("prev")?(0===o?(a-=1,o=11):o-=1,f.setFullYear(a),f.setMonth(o)):-1!==h.indexOf("next")&&(11===o?(a+=1,o=0):o+=1,f.setFullYear(a),f.setMonth(o)),f.setDate(parseInt(d,10)),"range"===this.selectionMode){if(this.minDate&&this.maxDate){var p=new Date(f.getTime());this.$emit("pick",{minDate:p,maxDate:null},!1),this.rangeState.selecting=!0,this.markRange(this.minDate),this.$nextTick(function(){t.handleMouseMove(e)})}else if(this.minDate&&!this.maxDate)if(f>=this.minDate){var m=new Date(f.getTime());this.rangeState.selecting=!1,this.$emit("pick",{minDate:this.minDate,maxDate:m})}else{var v=new Date(f.getTime());this.$emit("pick",{minDate:v,maxDate:this.maxDate},!1)}else if(!this.minDate){var g=new Date(f.getTime());this.$emit("pick",{minDate:g,maxDate:this.maxDate},!1),this.rangeState.selecting=!0,this.markRange(this.minDate)}}else if("day"===r)this.$emit("pick",f);else if("week"===r){var b=(0,n.getWeekNumber)(f),y=f.getFullYear()+"w"+b;this.$emit("pick",{year:f.getFullYear(),week:b,value:y,date:f})}}}}}},function(e,t,i){"use strict";var n=function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("table",{staticClass:"el-date-table",class:{"is-week-mode":"week"===e.selectionMode},attrs:{cellspacing:"0",cellpadding:"0"},on:{click:e.handleClick,mousemove:e.handleMouseMove}},[i("tbody",[i("tr",[e.showWeekNumber?i("th",[e._v(e._s(e.t("el.datepicker.week")))]):e._e(),e._l(e.WEEKS,function(t){return i("th",[e._v(e._s(e.t("el.datepicker.weeks."+t)))])})],2),e._l(e.rows,function(t){return i("tr",{staticClass:"el-date-table__row",class:{current:e.isWeekActive(t[1])}},e._l(t,function(t){return i("td",{class:e.getCellClasses(t)},[i("div",[i("span",[e._v("\n          "+e._s(t.text)+"\n        ")])])])}))})],2)])},s=[],r={render:n,staticRenderFns:s};t.a=r},function(e,t,i){"use strict";var n=function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("transition",{attrs:{name:"el-zoom-in-top"},on:{"after-enter":e.handleEnter,"after-leave":e.handleLeave}},[i("div",{directives:[{name:"show",rawName:"v-show",value:e.visible,expression:"visible"}],staticClass:"el-picker-panel el-date-picker el-popper",class:[{"has-sidebar":e.$slots.sidebar||e.shortcuts,"has-time":e.showTime},e.popperClass]},[i("div",{staticClass:"el-picker-panel__body-wrapper"},[e._t("sidebar"),e.shortcuts?i("div",{staticClass:"el-picker-panel__sidebar"},e._l(e.shortcuts,function(t){return i("button",{staticClass:"el-picker-panel__shortcut",attrs:{type:"button"},on:{click:function(i){e.handleShortcutClick(t)}}},[e._v(e._s(t.text))])})):e._e(),i("div",{staticClass:"el-picker-panel__body"},[e.showTime?i("div",{staticClass:"el-date-picker__time-header"},[i("span",{staticClass:"el-date-picker__editor-wrap"},[i("el-input",{attrs:{placeholder:e.t("el.datepicker.selectDate"),value:e.visibleDate,size:"small"},nativeOn:{change:function(t){e.handleVisibleDateChange(t)}}})],1),i("span",{staticClass:"el-date-picker__editor-wrap"},[i("el-input",{ref:"input",attrs:{placeholder:e.t("el.datepicker.selectTime"),value:e.visibleTime,size:"small"},on:{focus:function(t){e.timePickerVisible=!e.timePickerVisible}},nativeOn:{change:function(t){e.handleVisibleTimeChange(t)}}}),i("time-picker",{ref:"timepicker",attrs:{"time-arrow-control":e.arrowControl,visible:e.timePickerVisible},on:{pick:e.handleTimePick,mounted:e.proxyTimePickerDataProperties}})],1)]):e._e(),i("div",{directives:[{name:"show",rawName:"v-show",value:"time"!==e.currentView,expression:"currentView !== 'time'"}],staticClass:"el-date-picker__header",class:{"el-date-picker__header--bordered":"year"===e.currentView||"month"===e.currentView}},[i("button",{staticClass:"el-picker-panel__icon-btn el-date-picker__prev-btn el-icon-d-arrow-left",attrs:{type:"button","aria-label":e.t("el.datepicker.prevYear")},on:{click:e.prevYear}}),i("button",{directives:[{name:"show",rawName:"v-show",value:"date"===e.currentView,expression:"currentView === 'date'"}],staticClass:"el-picker-panel__icon-btn el-date-picker__prev-btn el-icon-arrow-left",attrs:{type:"button","aria-label":e.t("el.datepicker.prevMonth")},on:{click:e.prevMonth}}),i("span",{staticClass:"el-date-picker__header-label",attrs:{role:"button"},on:{click:e.showYearPicker}},[e._v(e._s(e.yearLabel))]),i("span",{directives:[{name:"show",rawName:"v-show",value:"date"===e.currentView,expression:"currentView === 'date'"}],staticClass:"el-date-picker__header-label",class:{active:"month"===e.currentView},attrs:{role:"button"},on:{click:e.showMonthPicker}},[e._v(e._s(e.t("el.datepicker.month"+(e.month+1))))]),i("button",{staticClass:"el-picker-panel__icon-btn el-date-picker__next-btn el-icon-d-arrow-right",attrs:{type:"button","aria-label":e.t("el.datepicker.nextYear")},on:{click:e.nextYear}}),i("button",{directives:[{name:"show",rawName:"v-show",value:"date"===e.currentView,expression:"currentView === 'date'"}],staticClass:"el-picker-panel__icon-btn el-date-picker__next-btn el-icon-arrow-right",attrs:{type:"button","aria-label":e.t("el.datepicker.nextMonth")},on:{click:e.nextMonth}})]),i("div",{staticClass:"el-picker-panel__content"},[i("date-table",{directives:[{name:"show",rawName:"v-show",value:"date"===e.currentView,expression:"currentView === 'date'"}],attrs:{"selection-mode":e.selectionMode,"first-day-of-week":e.firstDayOfWeek,value:new Date(e.value),"default-value":e.defaultValue?new Date(e.defaultValue):null,date:e.date,"disabled-date":e.disabledDate},on:{pick:e.handleDatePick}}),i("year-table",{directives:[{name:"show",rawName:"v-show",value:"year"===e.currentView,expression:"currentView === 'year'"}],attrs:{value:new Date(e.value),"default-value":e.defaultValue?new Date(e.defaultValue):null,date:e.date,"disabled-date":e.disabledDate},on:{pick:e.handleYearPick}}),i("month-table",{directives:[{name:"show",rawName:"v-show",value:"month"===e.currentView,expression:"currentView === 'month'"}],attrs:{value:new Date(e.value),"default-value":e.defaultValue?new Date(e.defaultValue):null,date:e.date,"disabled-date":e.disabledDate},on:{pick:e.handleMonthPick}})],1)])],2),i("div",{directives:[{name:"show",rawName:"v-show",value:e.footerVisible&&"date"===e.currentView,expression:"footerVisible && currentView === 'date'"}],staticClass:"el-picker-panel__footer"},[i("el-button",{staticClass:"el-picker-panel__link-btn",attrs:{size:"mini",type:"text"},on:{click:e.changeToNow}},[e._v("\n        "+e._s(e.t("el.datepicker.now"))+"\n      ")]),i("el-button",{staticClass:"el-picker-panel__link-btn",attrs:{plain:"",size:"mini"},on:{click:e.confirm}},[e._v("\n        "+e._s(e.t("el.datepicker.confirm"))+"\n      ")])],1)])])},s=[],r={render:n,staticRenderFns:s};t.a=r},function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=i(238),s=i.n(n),r=i(239),a=i(0),o=a(s.a,r.a,!1,null,null,null);t.default=o.exports},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0;var s=i(11),r=i(5),a=n(r),o=i(49),l=n(o),u=i(73),c=n(u),d=i(8),h=n(d),f=i(18),p=n(f),m=function(e,t){return new Date(new Date(e).getTime()+t)},v=function(e){return Array.isArray(e)?[new Date(e[0]),new Date(e[1])]:e?[new Date(e),m(e,864e5)]:[new Date,m(Date.now(),864e5)]};t.default={mixins:[a.default],computed:{btnDisabled:function(){return!(this.minDate&&this.maxDate&&!this.selecting)},leftLabel:function(){return this.leftDate.getFullYear()+" "+this.t("el.datepicker.year")+" "+this.t("el.datepicker.month"+(this.leftDate.getMonth()+1))},rightLabel:function(){return this.rightDate.getFullYear()+" "+this.t("el.datepicker.year")+" "+this.t("el.datepicker.month"+(this.rightDate.getMonth()+1))},leftYear:function(){return this.leftDate.getFullYear()},leftMonth:function(){return this.leftDate.getMonth()},leftMonthDate:function(){return this.leftDate.getDate()},rightYear:function(){return this.rightDate.getFullYear()},rightMonth:function(){return this.rightDate.getMonth()},rightMonthDate:function(){return this.rightDate.getDate()},minVisibleDate:function(){return this.minDate?(0,s.formatDate)(this.minDate):""},maxVisibleDate:function(){return this.maxDate||this.minDate?(0,s.formatDate)(this.maxDate||this.minDate):""},minVisibleTime:function(){return this.minDate?(0,s.formatDate)(this.minDate,"HH:mm:ss"):""},maxVisibleTime:function(){return this.maxDate||this.minDate?(0,s.formatDate)(this.maxDate||this.minDate,"HH:mm:ss"):""},dateFormat:function(){return this.format?this.format.replace("HH:mm","").replace(":ss","").trim():"yyyy-MM-dd"},timeFormat:function(){return this.format&&-1===this.format.indexOf("ss")?"HH:mm":"HH:mm:ss"},enableMonthArrow:function(){var e=(this.leftMonth+1)%12,t=this.leftMonth+1>=12?1:0;return this.unlinkPanels&&new Date(this.leftYear+t+"-"+(e+1))<new Date(this.rightYear+"-"+(this.rightMonth+1))},enableYearArrow:function(){return this.unlinkPanels&&12*this.rightYear+this.rightMonth-(12*this.leftYear+this.leftMonth+1)>=12}},data:function(){return{popperClass:"",value:[],defaultValue:null,minDate:"",maxDate:"",leftDate:new Date,rightDate:(0,s.nextMonth)(new Date),rangeState:{endDate:null,selecting:!1,row:null,column:null},showTime:!1,shortcuts:"",visible:"",disabledDate:"",firstDayOfWeek:7,minTimePickerVisible:!1,maxTimePickerVisible:!1,format:"",arrowControl:!1,unlinkPanels:!1}},watch:{minDate:function(e){var t=this;this.$nextTick(function(){if(t.$refs.maxTimePicker&&t.maxDate&&t.maxDate<t.minDate){t.$refs.maxTimePicker.selectableRange=[[(0,s.parseDate)((0,s.formatDate)(t.minDate,"HH:mm:ss"),"HH:mm:ss"),(0,s.parseDate)("23:59:59","HH:mm:ss")]]}}),e&&this.$refs.minTimePicker&&(this.$refs.minTimePicker.date=e,this.$refs.minTimePicker.value=e)},maxDate:function(e){e&&this.$refs.maxTimePicker&&(this.$refs.maxTimePicker.date=e,this.$refs.maxTimePicker.value=e)},minTimePickerVisible:function(e){var t=this;e&&this.$nextTick(function(){t.$refs.minTimePicker.date=t.minDate,t.$refs.minTimePicker.value=t.minDate,t.$refs.minTimePicker.adjustSpinners()})},maxTimePickerVisible:function(e){var t=this;e&&this.$nextTick(function(){t.$refs.maxTimePicker.date=t.maxDate,t.$refs.maxTimePicker.value=t.maxDate,t.$refs.maxTimePicker.adjustSpinners()})},value:function(e){e?Array.isArray(e)&&(this.minDate=(0,s.isDate)(e[0])?new Date(e[0]):null,this.maxDate=(0,s.isDate)(e[1])?new Date(e[1]):null,this.minDate?(this.leftDate=this.minDate,this.rightDate=this.unlinkPanels&&this.maxDate?this.maxDate:(0,s.nextMonth)(this.leftDate)):(this.leftDate=v(this.defaultValue)[0],this.rightDate=(0,s.nextMonth)(this.leftDate))):(this.minDate=null,this.maxDate=null)},defaultValue:function(e){if(!Array.isArray(this.value)){var t=v(e),i=t[0],n=t[1];this.leftDate=i,this.rightDate=e&&e[1]&&this.unlinkPanels?n:(0,s.nextMonth)(this.leftDate)}}},methods:{handleClear:function(){this.minDate=null,this.maxDate=null,this.leftDate=v(this.defaultValue)[0],this.rightDate=(0,s.nextMonth)(this.leftDate),this.$emit("pick",null)},handleChangeRange:function(e){this.minDate=e.minDate,this.maxDate=e.maxDate,this.rangeState=e.rangeState},handleDateInput:function(e,t){var i=e.target.value;if(i.length===this.dateFormat.length){var n=(0,s.parseDate)(i,this.dateFormat);if(n){if("function"==typeof this.disabledDate&&this.disabledDate(new Date(n)))return;"min"===t?(this.minDate=new Date(n),this.leftDate=new Date(n),this.rightDate=(0,s.nextMonth)(this.leftDate)):(this.maxDate=new Date(n),this.leftDate=(0,s.prevMonth)(n),this.rightDate=new Date(n))}}},handleDateChange:function(e,t){var i=e.target.value,n=(0,s.parseDate)(i,this.dateFormat);n&&("min"===t?(this.minDate=(0,s.modifyDate)(this.minDate,n.getFullYear(),n.getMonth(),n.getDate()),this.minDate>this.maxDate&&(this.maxDate=this.minDate)):(this.maxDate=(0,s.modifyDate)(this.maxDate,n.getFullYear(),n.getMonth(),n.getDate()),this.maxDate<this.minDate&&(this.minDate=this.maxDate)))},handleTimeChange:function(e,t){var i=e.target.value,n=(0,s.parseDate)(i,this.timeFormat);n&&("min"===t?(this.minDate=(0,s.modifyTime)(this.minDate,n.getHours(),n.getMinutes(),n.getSeconds()),this.minDate>this.maxDate&&(this.maxDate=this.minDate),this.$refs.minTimePicker.value=this.minDate,this.minTimePickerVisible=!1):(this.maxDate=(0,s.modifyTime)(this.maxDate,n.getHours(),n.getMinutes(),n.getSeconds()),this.maxDate<this.minDate&&(this.minDate=this.maxDate),this.$refs.maxTimePicker.value=this.minDate,this.maxTimePickerVisible=!1))},handleRangePick:function(e){var t=this,i=!(arguments.length>1&&void 0!==arguments[1])||arguments[1];this.maxDate===e.maxDate&&this.minDate===e.minDate||(this.onPick&&this.onPick(e),this.maxDate=e.maxDate,this.minDate=e.minDate,setTimeout(function(){t.maxDate=e.maxDate,t.minDate=e.minDate},10),i&&!this.showTime&&this.handleConfirm())},handleShortcutClick:function(e){e.onClick&&e.onClick(this)},handleMinTimePick:function(e,t,i){this.minDate=this.minDate||new Date,e&&(this.minDate=(0,s.modifyTime)(this.minDate,e.getHours(),e.getMinutes(),e.getSeconds())),i||(this.minTimePickerVisible=t),(!this.maxDate||this.maxDate&&this.maxDate.getTime()<this.minDate.getTime())&&(this.maxDate=new Date(this.minDate))},handleMaxTimePick:function(e,t,i){this.maxDate&&e&&(this.maxDate=(0,s.modifyTime)(this.maxDate,e.getHours(),e.getMinutes(),e.getSeconds())),i||(this.maxTimePickerVisible=t),this.maxDate&&this.minDate&&this.minDate.getTime()>this.maxDate.getTime()&&(this.minDate=new Date(this.maxDate))},leftPrevYear:function(){this.leftDate=(0,s.modifyDate)(this.leftDate,this.leftYear-1,this.leftMonth,this.leftMonthDate),this.unlinkPanels||(this.rightDate=(0,s.nextMonth)(this.leftDate))},leftNextYear:function(){this.leftDate=(0,s.modifyDate)(this.leftDate,this.leftYear+1,this.leftMonth,this.leftMonthDate)},leftPrevMonth:function(){this.leftDate=(0,s.prevMonth)(this.leftDate),this.unlinkPanels||(this.rightDate=(0,s.nextMonth)(this.leftDate))},leftNextMonth:function(){this.leftDate=(0,s.nextMonth)(this.leftDate)},rightPrevYear:function(){this.rightDate=(0,s.modifyDate)(this.rightDate,this.rightYear-1,this.rightMonth,this.rightMonthDate)},rightNextYear:function(){this.unlinkPanels?this.rightDate=(0,s.modifyDate)(this.rightDate,this.rightYear+1,this.rightMonth,this.rightMonthDate):(this.leftDate=(0,s.modifyDate)(this.leftDate,this.leftYear+1,this.leftMonth,this.leftMonthDate),this.rightDate=(0,s.nextMonth)(this.leftDate))},rightPrevMonth:function(){this.rightDate=(0,s.prevMonth)(this.rightDate)},rightNextMonth:function(){this.unlinkPanels?this.rightDate=(0,s.nextMonth)(this.rightDate):(this.leftDate=(0,s.nextMonth)(this.leftDate),this.rightDate=(0,s.nextMonth)(this.leftDate))},handleConfirm:function(){var e=arguments.length>0&&void 0!==arguments[0]&&arguments[0];this.$emit("pick",[this.minDate,this.maxDate],e)},isValidValue:function(e){return Array.isArray(e)&&e&&e[0]&&e[1]&&(0,s.isDate)(e[0])&&(0,s.isDate)(e[1])&&e[0].getTime()<=e[1].getTime()&&("function"!=typeof this.disabledDate||!this.disabledDate(e[0])&&!this.disabledDate(e[1]))}},components:{TimePicker:l.default,DateTable:c.default,ElInput:h.default,ElButton:p.default}}},function(e,t,i){"use strict";var n=function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("transition",{attrs:{name:"el-zoom-in-top"},on:{"after-leave":function(t){e.$emit("dodestroy")}}},[i("div",{directives:[{name:"show",rawName:"v-show",value:e.visible,expression:"visible"}],staticClass:"el-picker-panel el-date-range-picker el-popper",class:[{"has-sidebar":e.$slots.sidebar||e.shortcuts,"has-time":e.showTime},e.popperClass]},[i("div",{staticClass:"el-picker-panel__body-wrapper"},[e._t("sidebar"),e.shortcuts?i("div",{staticClass:"el-picker-panel__sidebar"},e._l(e.shortcuts,function(t){return i("button",{staticClass:"el-picker-panel__shortcut",attrs:{type:"button"},on:{click:function(i){e.handleShortcutClick(t)}}},[e._v(e._s(t.text))])})):e._e(),i("div",{staticClass:"el-picker-panel__body"},[e.showTime?i("div",{staticClass:"el-date-range-picker__time-header"},[i("span",{staticClass:"el-date-range-picker__editors-wrap"},[i("span",{staticClass:"el-date-range-picker__time-picker-wrap"},[i("el-input",{ref:"minInput",staticClass:"el-date-range-picker__editor",attrs:{size:"small",disabled:e.rangeState.selecting,placeholder:e.t("el.datepicker.startDate"),value:e.minVisibleDate},nativeOn:{input:function(t){e.handleDateInput(t,"min")},change:function(t){e.handleDateChange(t,"min")}}})],1),i("span",{staticClass:"el-date-range-picker__time-picker-wrap"},[i("el-input",{staticClass:"el-date-range-picker__editor",attrs:{size:"small",disabled:e.rangeState.selecting,placeholder:e.t("el.datepicker.startTime"),value:e.minVisibleTime},on:{focus:function(t){e.minTimePickerVisible=!e.minTimePickerVisible}},nativeOn:{change:function(t){e.handleTimeChange(t,"min")}}}),i("time-picker",{ref:"minTimePicker",attrs:{"time-arrow-control":e.arrowControl,visible:e.minTimePickerVisible},on:{pick:e.handleMinTimePick,mounted:function(t){e.$refs.minTimePicker.format=e.timeFormat}}})],1)]),i("span",{staticClass:"el-icon-arrow-right"}),i("span",{staticClass:"el-date-range-picker__editors-wrap is-right"},[i("span",{staticClass:"el-date-range-picker__time-picker-wrap"},[i("el-input",{staticClass:"el-date-range-picker__editor",attrs:{size:"small",disabled:e.rangeState.selecting,placeholder:e.t("el.datepicker.endDate"),value:e.maxVisibleDate,readonly:!e.minDate},nativeOn:{input:function(t){e.handleDateInput(t,"max")},change:function(t){e.handleDateChange(t,"max")}}})],1),i("span",{staticClass:"el-date-range-picker__time-picker-wrap"},[i("el-input",{ref:"maxInput",staticClass:"el-date-range-picker__editor",attrs:{size:"small",disabled:e.rangeState.selecting,placeholder:e.t("el.datepicker.endTime"),value:e.maxVisibleTime,readonly:!e.minDate},on:{focus:function(t){e.minDate&&(e.maxTimePickerVisible=!e.maxTimePickerVisible)}},nativeOn:{change:function(t){e.handleTimeChange(t,"max")}}}),i("time-picker",{ref:"maxTimePicker",attrs:{"time-arrow-control":e.arrowControl,visible:e.maxTimePickerVisible},on:{pick:e.handleMaxTimePick,mounted:function(t){e.$refs.maxTimePicker.format=e.timeFormat}}})],1)])]):e._e(),i("div",{staticClass:"el-picker-panel__content el-date-range-picker__content is-left"},[i("div",{staticClass:"el-date-range-picker__header"},[i("button",{staticClass:"el-picker-panel__icon-btn el-icon-d-arrow-left",attrs:{type:"button"},on:{click:e.leftPrevYear}}),i("button",{staticClass:"el-picker-panel__icon-btn el-icon-arrow-left",attrs:{type:"button"},on:{click:e.leftPrevMonth}}),e.unlinkPanels?i("button",{staticClass:"el-picker-panel__icon-btn el-icon-d-arrow-right",class:{"is-disabled":!e.enableYearArrow},attrs:{type:"button",disabled:!e.enableYearArrow},on:{click:e.leftNextYear}}):e._e(),e.unlinkPanels?i("button",{staticClass:"el-picker-panel__icon-btn el-icon-arrow-right",class:{"is-disabled":!e.enableMonthArrow},attrs:{type:"button",disabled:!e.enableMonthArrow},on:{click:e.leftNextMonth}}):e._e(),i("div",[e._v(e._s(e.leftLabel))])]),i("date-table",{attrs:{"selection-mode":"range",date:e.leftDate,"default-value":e.defaultValue,"min-date":e.minDate,"max-date":e.maxDate,"range-state":e.rangeState,"disabled-date":e.disabledDate,"first-day-of-week":e.firstDayOfWeek},on:{changerange:e.handleChangeRange,pick:e.handleRangePick}})],1),i("div",{staticClass:"el-picker-panel__content el-date-range-picker__content is-right"},[i("div",{staticClass:"el-date-range-picker__header"},[e.unlinkPanels?i("button",{staticClass:"el-picker-panel__icon-btn el-icon-d-arrow-left",class:{"is-disabled":!e.enableYearArrow},attrs:{type:"button",disabled:!e.enableYearArrow},on:{click:e.rightPrevYear}}):e._e(),e.unlinkPanels?i("button",{staticClass:"el-picker-panel__icon-btn el-icon-arrow-left",class:{"is-disabled":!e.enableMonthArrow},attrs:{type:"button",disabled:!e.enableMonthArrow},on:{click:e.rightPrevMonth}}):e._e(),i("button",{staticClass:"el-picker-panel__icon-btn el-icon-d-arrow-right",attrs:{type:"button"},on:{click:e.rightNextYear}}),i("button",{staticClass:"el-picker-panel__icon-btn el-icon-arrow-right",attrs:{type:"button"},on:{click:e.rightNextMonth}}),i("div",[e._v(e._s(e.rightLabel))])]),i("date-table",{attrs:{"selection-mode":"range",date:e.rightDate,"default-value":e.defaultValue,"min-date":e.minDate,"max-date":e.maxDate,"range-state":e.rangeState,"disabled-date":e.disabledDate,"first-day-of-week":e.firstDayOfWeek},on:{changerange:e.handleChangeRange,pick:e.handleRangePick}})],1)])],2),e.showTime?i("div",{staticClass:"el-picker-panel__footer"},[i("el-button",{staticClass:"el-picker-panel__link-btn",attrs:{size:"mini",type:"text"},on:{click:e.handleClear}},[e._v("\n        "+e._s(e.t("el.datepicker.clear"))+"\n      ")]),i("el-button",{staticClass:"el-picker-panel__link-btn",attrs:{plain:"",size:"mini",disabled:e.btnDisabled},on:{click:function(t){e.handleConfirm()}}},[e._v("\n        "+e._s(e.t("el.datepicker.confirm"))+"\n      ")])],1):e._e()])])},s=[],r={render:n,staticRenderFns:s};t.a=r},function(e,t,i){"use strict";t.__esModule=!0;var n=i(241),s=function(e){return e&&e.__esModule?e:{default:e}}(n);s.default.install=function(e){e.component(s.default.name,s.default)},t.default=s.default},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0;var s=i(48),r=n(s),a=i(242),o=n(a);t.default={mixins:[r.default],name:"ElTimeSelect",beforeCreate:function(){this.type="time-select",this.panel=o.default}}},function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=i(243),s=i.n(n),r=i(244),a=i(0),o=a(s.a,r.a,!1,null,null,null);t.default=o.exports},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0;var s=i(27),r=n(s),a=i(44),o=n(a),l=function(e){var t=(e||"").split(":");if(t.length>=2){return{hours:parseInt(t[0],10),minutes:parseInt(t[1],10)}}return null},u=function(e,t){var i=l(e),n=l(t),s=i.minutes+60*i.hours,r=n.minutes+60*n.hours;return s===r?0:s>r?1:-1},c=function(e){return(e.hours<10?"0"+e.hours:e.hours)+":"+(e.minutes<10?"0"+e.minutes:e.minutes)},d=function(e,t){var i=l(e),n=l(t),s={hours:i.hours,minutes:i.minutes};return s.minutes+=n.minutes,s.hours+=n.hours,s.hours+=Math.floor(s.minutes/60),s.minutes=s.minutes%60,c(s)};t.default={components:{ElScrollbar:r.default},watch:{value:function(e){var t=this;e&&this.$nextTick(function(){return t.scrollToOption()})}},methods:{handleClick:function(e){e.disabled||this.$emit("pick",e.value)},handleClear:function(){this.$emit("pick",null)},scrollToOption:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:".selected",t=this.$refs.popper.querySelector(".el-picker-panel__content");(0,o.default)(t,t.querySelector(e))},handleMenuEnter:function(){var e=this,t=-1!==this.items.map(function(e){return e.value}).indexOf(this.value),i=-1!==this.items.map(function(e){return e.value}).indexOf(this.defaultValue),n=t&&".selected"||i&&".default"||".time-select-item:not(.disabled)";this.$nextTick(function(){return e.scrollToOption(n)})},scrollDown:function(e){for(var t=this.items,i=t.length,n=t.length,s=t.map(function(e){return e.value}).indexOf(this.value);n--;)if(s=(s+e+i)%i,!t[s].disabled)return void this.$emit("pick",t[s].value,!0)},isValidValue:function(e){return-1!==this.items.filter(function(e){return!e.disabled}).map(function(e){return e.value}).indexOf(e)},handleKeydown:function(e){var t=e.keyCode;if(38===t||40===t){var i={40:1,38:-1},n=i[t.toString()];return this.scrollDown(n),void e.stopPropagation()}}},data:function(){return{popperClass:"",start:"09:00",end:"18:00",step:"00:30",value:"",defaultValue:"",visible:!1,minTime:"",maxTime:"",width:0}},computed:{items:function(){var e=this.start,t=this.end,i=this.step,n=[];if(e&&t&&i)for(var s=e;u(s,t)<=0;)n.push({value:s,disabled:u(s,this.minTime||"-1:-1")<=0||u(s,this.maxTime||"100:100")>=0}),s=d(s,i);return n}}}},function(e,t,i){"use strict";var n=function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("transition",{attrs:{name:"el-zoom-in-top"},on:{"before-enter":e.handleMenuEnter,"after-leave":function(t){e.$emit("dodestroy")}}},[i("div",{directives:[{name:"show",rawName:"v-show",value:e.visible,expression:"visible"}],ref:"popper",staticClass:"el-picker-panel time-select el-popper",class:e.popperClass,style:{width:e.width+"px"}},[i("el-scrollbar",{attrs:{noresize:"","wrap-class":"el-picker-panel__content"}},e._l(e.items,function(t){return i("div",{staticClass:"time-select-item",class:{selected:e.value===t.value,disabled:t.disabled,default:t.value===e.defaultValue},attrs:{disabled:t.disabled},on:{click:function(i){e.handleClick(t)}}},[e._v(e._s(t.value))])}))],1)])},s=[],r={render:n,staticRenderFns:s};t.a=r},function(e,t,i){"use strict";t.__esModule=!0;var n=i(246),s=function(e){return e&&e.__esModule?e:{default:e}}(n);s.default.install=function(e){e.component(s.default.name,s.default)},t.default=s.default},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0;var s=i(48),r=n(s),a=i(49),o=n(a),l=i(247),u=n(l);t.default={mixins:[r.default],name:"ElTimePicker",props:{isRange:Boolean,arrowControl:Boolean},data:function(){return{type:""}},watch:{isRange:function(e){this.picker?(this.unmountPicker(),this.type=e?"timerange":"time",this.panel=e?u.default:o.default,this.mountPicker()):(this.type=e?"timerange":"time",this.panel=e?u.default:o.default)}},created:function(){this.type=this.isRange?"timerange":"time",this.panel=this.isRange?u.default:o.default}}},function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=i(248),s=i.n(n),r=i(249),a=i(0),o=a(s.a,r.a,!1,null,null,null);t.default=o.exports},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0;var s=i(11),r=i(5),a=n(r),o=i(72),l=n(o),u=(0,s.parseDate)("00:00:00","HH:mm:ss"),c=(0,s.parseDate)("23:59:59","HH:mm:ss"),d=function(e){return(0,s.modifyDate)(u,e.getFullYear(),e.getMonth(),e.getDate())},h=function(e){return(0,s.modifyDate)(c,e.getFullYear(),e.getMonth(),e.getDate())},f=function(e,t){return new Date(Math.min(e.getTime()+t,h(e).getTime()))};t.default={mixins:[a.default],components:{TimeSpinner:l.default},computed:{showSeconds:function(){return-1!==(this.format||"").indexOf("ss")},offset:function(){return this.showSeconds?11:8},spinner:function(){return this.selectionRange[0]<this.offset?this.$refs.minSpinner:this.$refs.maxSpinner},btnDisabled:function(){return this.minDate.getTime()>this.maxDate.getTime()}},data:function(){return{popperClass:"",minDate:new Date,maxDate:new Date,value:[],oldValue:[new Date,new Date],defaultValue:null,format:"HH:mm:ss",visible:!1,selectionRange:[0,2],arrowControl:!1}},watch:{value:function(e){Array.isArray(e)?(this.minDate=new Date(e[0]),this.maxDate=new Date(e[1])):Array.isArray(this.defaultValue)?(this.minDate=new Date(this.defaultValue[0]),this.maxDate=new Date(this.defaultValue[1])):this.defaultValue?(this.minDate=new Date(this.defaultValue),this.maxDate=f(new Date(this.defaultValue),36e5)):(this.minDate=new Date,this.maxDate=f(new Date,36e5))},visible:function(e){var t=this;e&&(this.oldValue=this.value,this.$nextTick(function(){return t.$refs.minSpinner.emitSelectRange("hours")}))}},methods:{handleClear:function(){this.$emit("pick",null)},handleCancel:function(){this.$emit("pick",this.oldValue)},handleMinChange:function(e){this.minDate=(0,s.clearMilliseconds)(e),this.handleChange()},handleMaxChange:function(e){this.maxDate=(0,s.clearMilliseconds)(e),this.handleChange()},handleChange:function(){this.isValidValue([this.minDate,this.maxDate])&&(this.$refs.minSpinner.selectableRange=[[d(this.minDate),this.maxDate]],this.$refs.maxSpinner.selectableRange=[[this.minDate,h(this.maxDate)]],this.$emit("pick",[this.minDate,this.maxDate],!0))},setMinSelectionRange:function(e,t){this.$emit("select-range",e,t,"min"),this.selectionRange=[e,t]},setMaxSelectionRange:function(e,t){this.$emit("select-range",e,t,"max"),this.selectionRange=[e+this.offset,t+this.offset]},handleConfirm:function(){var e=arguments.length>0&&void 0!==arguments[0]&&arguments[0],t=this.$refs.minSpinner.selectableRange,i=this.$refs.maxSpinner.selectableRange;this.minDate=(0,s.limitTimeRange)(this.minDate,t,this.format),this.maxDate=(0,s.limitTimeRange)(this.maxDate,i,this.format),this.$emit("pick",[this.minDate,this.maxDate],e)},adjustSpinners:function(){this.$refs.minSpinner.adjustSpinners(),this.$refs.maxSpinner.adjustSpinners()},changeSelectionRange:function(e){var t=this.showSeconds?[0,3,6,11,14,17]:[0,3,8,11],i=["hours","minutes"].concat(this.showSeconds?["seconds"]:[]),n=t.indexOf(this.selectionRange[0]),s=(n+e+t.length)%t.length,r=t.length/2;s<r?this.$refs.minSpinner.emitSelectRange(i[s]):this.$refs.maxSpinner.emitSelectRange(i[s-r])},isValidValue:function(e){return Array.isArray(e)&&(0,s.timeWithinRange)(this.minDate,this.$refs.minSpinner.selectableRange)&&(0,s.timeWithinRange)(this.maxDate,this.$refs.maxSpinner.selectableRange)},handleKeydown:function(e){var t=e.keyCode,i={38:-1,40:1,37:-1,39:1};if(37===t||39===t){var n=i[t];return this.changeSelectionRange(n),void e.preventDefault()}if(38===t||40===t){var s=i[t];return this.spinner.scrollDown(s),void e.preventDefault()}}}}},function(e,t,i){"use strict";var n=function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("transition",{attrs:{name:"el-zoom-in-top"},on:{"after-leave":function(t){e.$emit("dodestroy")}}},[i("div",{directives:[{name:"show",rawName:"v-show",value:e.visible,expression:"visible"}],staticClass:"el-time-range-picker el-picker-panel el-popper",class:e.popperClass},[i("div",{staticClass:"el-time-range-picker__content"},[i("div",{staticClass:"el-time-range-picker__cell"},[i("div",{staticClass:"el-time-range-picker__header"},[e._v(e._s(e.t("el.datepicker.startTime")))]),i("div",{staticClass:"el-time-range-picker__body el-time-panel__content",class:{"has-seconds":e.showSeconds,"is-arrow":e.arrowControl}},[i("time-spinner",{ref:"minSpinner",attrs:{"show-seconds":e.showSeconds,"arrow-control":e.arrowControl,date:e.minDate},on:{change:e.handleMinChange,"select-range":e.setMinSelectionRange}})],1)]),i("div",{staticClass:"el-time-range-picker__cell"},[i("div",{staticClass:"el-time-range-picker__header"},[e._v(e._s(e.t("el.datepicker.endTime")))]),i("div",{staticClass:"el-time-range-picker__body el-time-panel__content",class:{"has-seconds":e.showSeconds,"is-arrow":e.arrowControl}},[i("time-spinner",{ref:"maxSpinner",attrs:{"show-seconds":e.showSeconds,"arrow-control":e.arrowControl,date:e.maxDate},on:{change:e.handleMaxChange,"select-range":e.setMaxSelectionRange}})],1)])]),i("div",{staticClass:"el-time-panel__footer"},[i("button",{staticClass:"el-time-panel__btn cancel",attrs:{type:"button"},on:{click:function(t){e.handleCancel()}}},[e._v(e._s(e.t("el.datepicker.cancel")))]),i("button",{staticClass:"el-time-panel__btn confirm",attrs:{type:"button",disabled:e.btnDisabled},on:{click:function(t){e.handleConfirm()}}},[e._v(e._s(e.t("el.datepicker.confirm")))])])])])},s=[],r={render:n,staticRenderFns:s};t.a=r},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0;var s=i(251),r=n(s),a=i(254),o=n(a);n(i(2)).default.directive("popover",o.default),r.default.install=function(e){e.directive("popover",o.default),e.component(r.default.name,r.default)},r.default.directive=o.default,t.default=r.default},function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=i(252),s=i.n(n),r=i(253),a=i(0),o=a(s.a,r.a,!1,null,null,null);t.default=o.exports},function(e,t,i){"use strict";t.__esModule=!0;var n=i(10),s=function(e){return e&&e.__esModule?e:{default:e}}(n),r=i(4),a=i(6);t.default={name:"ElPopover",mixins:[s.default],props:{trigger:{type:String,default:"click",validator:function(e){return["click","focus","hover","manual"].indexOf(e)>-1}},openDelay:{type:Number,default:0},title:String,disabled:Boolean,content:String,reference:{},popperClass:String,width:{},visibleArrow:{default:!0},transition:{type:String,default:"fade-in-linear"}},computed:{tooltipId:function(){return"el-popover-"+(0,a.generateId)()}},watch:{showPopper:function(e){e?this.$emit("show"):this.$emit("hide")}},mounted:function(){var e=this.referenceElm=this.reference||this.$refs.reference,t=this.popper||this.$refs.popper;if(!e&&this.$slots.reference&&this.$slots.reference[0]&&(e=this.referenceElm=this.$slots.reference[0].elm),e&&((0,r.addClass)(e,"el-popover__reference"),e.setAttribute("aria-describedby",this.tooltipId),e.setAttribute("tabindex",0),"click"!==this.trigger&&(0,r.on)(e,"focus",this.handleFocus),"click"!==this.trigger&&(0,r.on)(e,"blur",this.handleBlur),(0,r.on)(e,"keydown",this.handleKeydown),(0,r.on)(e,"click",this.handleClick)),"click"===this.trigger)(0,r.on)(e,"click",this.doToggle),(0,r.on)(document,"click",this.handleDocumentClick);else if("hover"===this.trigger)(0,r.on)(e,"mouseenter",this.handleMouseEnter),(0,r.on)(t,"mouseenter",this.handleMouseEnter),(0,r.on)(e,"mouseleave",this.handleMouseLeave),(0,r.on)(t,"mouseleave",this.handleMouseLeave);else if("focus"===this.trigger){var i=!1;if([].slice.call(e.children).length)for(var n=e.childNodes,s=n.length,a=0;a<s;a++)if("INPUT"===n[a].nodeName||"TEXTAREA"===n[a].nodeName){(0,r.on)(n[a],"focus",this.doShow),(0,r.on)(n[a],"blur",this.doClose),i=!0;break}if(i)return;"INPUT"===e.nodeName||"TEXTAREA"===e.nodeName?((0,r.on)(e,"focus",this.doShow),(0,r.on)(e,"blur",this.doClose)):((0,r.on)(e,"mousedown",this.doShow),(0,r.on)(e,"mouseup",this.doClose))}},methods:{doToggle:function(){this.showPopper=!this.showPopper},doShow:function(){this.showPopper=!0},doClose:function(){this.showPopper=!1},handleFocus:function(){(0,r.addClass)(this.referenceElm,"focusing"),"manual"!==this.trigger&&(this.showPopper=!0)},handleClick:function(){(0,r.removeClass)(this.referenceElm,"focusing")},handleBlur:function(){(0,r.removeClass)(this.referenceElm,"focusing"),"manual"!==this.trigger&&(this.showPopper=!1)},handleMouseEnter:function(){var e=this;clearTimeout(this._timer),this.openDelay?this._timer=setTimeout(function(){e.showPopper=!0},this.openDelay):this.showPopper=!0},handleKeydown:function(e){27===e.keyCode&&"manual"!==this.trigger&&this.doClose()},handleMouseLeave:function(){var e=this;clearTimeout(this._timer),this._timer=setTimeout(function(){e.showPopper=!1},200)},handleDocumentClick:function(e){var t=this.reference||this.$refs.reference,i=this.popper||this.$refs.popper;!t&&this.$slots.reference&&this.$slots.reference[0]&&(t=this.referenceElm=this.$slots.reference[0].elm),this.$el&&t&&!this.$el.contains(e.target)&&!t.contains(e.target)&&i&&!i.contains(e.target)&&(this.showPopper=!1)}},destroyed:function(){var e=this.reference;(0,r.off)(e,"click",this.doToggle),(0,r.off)(e,"mouseup",this.doClose),(0,r.off)(e,"mousedown",this.doShow),(0,r.off)(e,"focus",this.doShow),(0,r.off)(e,"blur",this.doClose),(0,r.off)(e,"mouseleave",this.handleMouseLeave),(0,r.off)(e,"mouseenter",this.handleMouseEnter),(0,r.off)(document,"click",this.handleDocumentClick)}}},function(e,t,i){"use strict";var n=function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("span",[i("transition",{attrs:{name:e.transition},on:{"after-leave":e.doDestroy}},[i("div",{directives:[{name:"show",rawName:"v-show",value:!e.disabled&&e.showPopper,expression:"!disabled && showPopper"}],ref:"popper",staticClass:"el-popover el-popper",class:[e.popperClass,e.content&&"el-popover--plain"],style:{width:e.width+"px"},attrs:{role:"tooltip",id:e.tooltipId,"aria-hidden":e.disabled||!e.showPopper?"true":"false"}},[e.title?i("div",{staticClass:"el-popover__title",domProps:{textContent:e._s(e.title)}}):e._e(),e._t("default",[e._v(e._s(e.content))])],2)]),e._t("reference")],2)},s=[],r={render:n,staticRenderFns:s};t.a=r},function(e,t,i){"use strict";t.__esModule=!0,t.default={bind:function(e,t,i){i.context.$refs[t.arg].$refs.reference=e}}},function(e,t,i){"use strict";t.__esModule=!0;var n=i(256),s=function(e){return e&&e.__esModule?e:{default:e}}(n);t.default=s.default},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0,t.MessageBox=void 0;var s="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},r=i(2),a=n(r),o=i(257),l=n(o),u=i(12),c=n(u),d=i(34),h={title:void 0,message:"",type:"",showInput:!1,showClose:!0,modalFade:!0,lockScroll:!0,closeOnClickModal:!0,closeOnPressEscape:!0,closeOnHashChange:!0,inputValue:null,inputPlaceholder:"",inputType:"text",inputPattern:null,inputValidator:null,inputErrorMessage:"",showConfirmButton:!0,showCancelButton:!1,confirmButtonPosition:"right",confirmButtonHighlight:!1,cancelButtonHighlight:!1,confirmButtonText:"",cancelButtonText:"",confirmButtonClass:"",cancelButtonClass:"",customClass:"",beforeClose:null,dangerouslyUseHTMLString:!1,center:!1,roundButton:!1},f=a.default.extend(l.default),p=void 0,m=void 0,v=[],g=function(e){if(p){var t=p.callback;"function"==typeof t&&(m.showInput?t(m.inputValue,e):t(e)),p.resolve&&("confirm"===e?m.showInput?p.resolve({value:m.inputValue,action:e}):p.resolve(e):"cancel"===e&&p.reject&&p.reject(e))}},b=function(){m=new f({el:document.createElement("div")}),m.callback=g},y=function e(){m||b(),m.action="",m.visible&&!m.closeTimer||v.length>0&&function(){p=v.shift();var t=p.options;for(var i in t)t.hasOwnProperty(i)&&(m[i]=t[i]);void 0===t.callback&&(m.callback=g);var n=m.callback;m.callback=function(t,i){n(t,i),e()},(0,d.isVNode)(m.message)?(m.$slots.default=[m.message],m.message=null):delete m.$slots.default,["modal","showClose","closeOnClickModal","closeOnPressEscape","closeOnHashChange"].forEach(function(e){void 0===m[e]&&(m[e]=!0)}),document.body.appendChild(m.$el),a.default.nextTick(function(){m.visible=!0})}()},_=function e(t,i){if(!a.default.prototype.$isServer){if("string"==typeof t||(0,d.isVNode)(t)?(t={message:t},"string"==typeof arguments[1]&&(t.title=arguments[1])):t.callback&&!i&&(i=t.callback),"undefined"!=typeof Promise)return new Promise(function(n,s){v.push({options:(0,c.default)({},h,e.defaults,t),callback:i,resolve:n,reject:s}),y()});v.push({options:(0,c.default)({},h,e.defaults,t),callback:i}),y()}};_.setDefaults=function(e){_.defaults=e},_.alert=function(e,t,i){return"object"===(void 0===t?"undefined":s(t))?(i=t,t=""):void 0===t&&(t=""),_((0,c.default)({title:t,message:e,$type:"alert",closeOnPressEscape:!1,closeOnClickModal:!1},i))},_.confirm=function(e,t,i){return"object"===(void 0===t?"undefined":s(t))?(i=t,t=""):void 0===t&&(t=""),_((0,c.default)({title:t,message:e,$type:"confirm",showCancelButton:!0},i))},_.prompt=function(e,t,i){return"object"===(void 0===t?"undefined":s(t))?(i=t,t=""):void 0===t&&(t=""),_((0,c.default)({title:t,message:e,showCancelButton:!0,showInput:!0,$type:"prompt"},i))},_.close=function(){m.doClose(),m.visible=!1,v=[],p=null},t.default=_,t.MessageBox=_},function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=i(258),s=i.n(n),r=i(260),a=i(0),o=a(s.a,r.a,!1,null,null,null);t.default=o.exports},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0;var s=i(21),r=n(s),a=i(5),o=n(a),l=i(8),u=n(l),c=i(18),d=n(c),h=i(4),f=i(16),p=i(259),m=n(p),v=void 0,g={success:"success",info:"info",warning:"warning",error:"error"};t.default={mixins:[r.default,o.default],props:{modal:{default:!0},lockScroll:{default:!0},showClose:{type:Boolean,default:!0},closeOnClickModal:{default:!0},closeOnPressEscape:{default:!0},closeOnHashChange:{default:!0},center:{default:!1,type:Boolean},roundButton:{default:!1,type:Boolean}},components:{ElInput:u.default,ElButton:d.default},computed:{typeClass:function(){return this.type&&g[this.type]?"el-icon-"+g[this.type]:""},confirmButtonClasses:function(){return"el-button--primary "+this.confirmButtonClass},cancelButtonClasses:function(){return""+this.cancelButtonClass}},methods:{handleComposition:function(e){var t=this;"compositionend"===e.type?setTimeout(function(){t.isOnComposition=!1},100):this.isOnComposition=!0},handleKeyup:function(){!this.isOnComposition&&this.handleAction("confirm")},getSafeClose:function(){var e=this,t=this.uid;return function(){e.$nextTick(function(){t===e.uid&&e.doClose()})}},doClose:function(){var e=this;this.visible&&(this.visible=!1,this._closing=!0,this.onClose&&this.onClose(),v.closeDialog(),this.lockScroll&&setTimeout(function(){e.modal&&"hidden"!==e.bodyOverflow&&(document.body.style.overflow=e.bodyOverflow,document.body.style.paddingRight=e.bodyPaddingRight),e.bodyOverflow=null,e.bodyPaddingRight=null},200),this.opened=!1,this.transition||this.doAfterClose(),setTimeout(function(){e.action&&e.callback(e.action,e)}))},handleWrapperClick:function(){this.closeOnClickModal&&this.handleAction("cancel")},handleAction:function(e){("prompt"!==this.$type||"confirm"!==e||this.validate())&&(this.action=e,"function"==typeof this.beforeClose?(this.close=this.getSafeClose(),this.beforeClose(e,this,this.close)):this.doClose())},validate:function(){if("prompt"===this.$type){var e=this.inputPattern;if(e&&!e.test(this.inputValue||""))return this.editorErrorMessage=this.inputErrorMessage||(0,f.t)("el.messagebox.error"),(0,h.addClass)(this.getInputElement(),"invalid"),!1;var t=this.inputValidator;if("function"==typeof t){var i=t(this.inputValue);if(!1===i)return this.editorErrorMessage=this.inputErrorMessage||(0,f.t)("el.messagebox.error"),(0,h.addClass)(this.getInputElement(),"invalid"),!1;if("string"==typeof i)return this.editorErrorMessage=i,!1}}return this.editorErrorMessage="",(0,h.removeClass)(this.getInputElement(),"invalid"),!0},getFistFocus:function(){var e=this.$el.querySelector(".el-message-box__btns .el-button"),t=this.$el.querySelector(".el-message-box__btns .el-message-box__title");return e&&e[0]||t},getInputElement:function(){var e=this.$refs.input.$refs;return e.input||e.textarea}},watch:{inputValue:{immediate:!0,handler:function(e){var t=this;this.$nextTick(function(i){"prompt"===t.$type&&null!==e&&t.validate()})}},visible:function(e){var t=this;e&&(this.uid++,"alert"!==this.$type&&"confirm"!==this.$type||this.$nextTick(function(){t.$refs.confirm.$el.focus()}),this.focusAfterClosed=document.activeElement,v=new m.default(this.$el,this.focusAfterClosed,this.getFistFocus())),"prompt"===this.$type&&(e?setTimeout(function(){t.$refs.input&&t.$refs.input.$el&&t.getInputElement().focus()},500):(this.editorErrorMessage="",(0,h.removeClass)(this.getInputElement(),"invalid")))}},mounted:function(){this.closeOnHashChange&&window.addEventListener("hashchange",this.close)},beforeDestroy:function(){this.closeOnHashChange&&window.removeEventListener("hashchange",this.close),setTimeout(function(){v.closeDialog()})},data:function(){return{uid:1,title:void 0,message:"",type:"",customClass:"",showInput:!1,inputValue:null,inputPlaceholder:"",inputType:"text",inputPattern:null,inputValidator:null,inputErrorMessage:"",showConfirmButton:!0,showCancelButton:!1,action:"",confirmButtonText:"",cancelButtonText:"",confirmButtonLoading:!1,cancelButtonLoading:!1,confirmButtonClass:"",confirmButtonDisabled:!1,cancelButtonClass:"",editorErrorMessage:null,callback:null,dangerouslyUseHTMLString:!1,focusAfterClosed:null,isOnComposition:!1}}}},function(e,t,i){"use strict";t.__esModule=!0;var n,s="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},r=i(45),a=function(e){return e&&e.__esModule?e:{default:e}}(r),o=o||{};o.Dialog=function(e,t,i){var r=this;if(this.dialogNode=e,null===this.dialogNode||"dialog"!==this.dialogNode.getAttribute("role"))throw new Error("Dialog() requires a DOM element with ARIA role of dialog.");"string"==typeof t?this.focusAfterClosed=document.getElementById(t):"object"===(void 0===t?"undefined":s(t))?this.focusAfterClosed=t:this.focusAfterClosed=null,"string"==typeof i?this.focusFirst=document.getElementById(i):"object"===(void 0===i?"undefined":s(i))?this.focusFirst=i:this.focusFirst=null,this.focusFirst?this.focusFirst.focus():a.default.focusFirstDescendant(this.dialogNode),this.lastFocus=document.activeElement,n=function(e){r.trapFocus(e)},this.addListeners()},o.Dialog.prototype.addListeners=function(){document.addEventListener("focus",n,!0)},o.Dialog.prototype.removeListeners=function(){document.removeEventListener("focus",n,!0)},o.Dialog.prototype.closeDialog=function(){var e=this;this.removeListeners(),this.focusAfterClosed&&setTimeout(function(){e.focusAfterClosed.focus()})},o.Dialog.prototype.trapFocus=function(e){a.default.IgnoreUtilFocusChanges||(this.dialogNode.contains(e.target)?this.lastFocus=e.target:(a.default.focusFirstDescendant(this.dialogNode),this.lastFocus===document.activeElement&&a.default.focusLastDescendant(this.dialogNode),this.lastFocus=document.activeElement))},t.default=o.Dialog},function(e,t,i){"use strict";var n=function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("transition",{attrs:{name:"msgbox-fade"}},[i("div",{directives:[{name:"show",rawName:"v-show",value:e.visible,expression:"visible"}],staticClass:"el-message-box__wrapper",attrs:{tabindex:"-1",role:"dialog","aria-modal":"true","aria-label":e.title||"dialog"},on:{click:function(t){if(t.target!==t.currentTarget)return null;e.handleWrapperClick(t)}}},[i("div",{staticClass:"el-message-box",class:[e.customClass,e.center&&"el-message-box--center"]},[void 0!==e.title?i("div",{staticClass:"el-message-box__header"},[i("div",{staticClass:"el-message-box__title"},[e.typeClass&&e.center?i("div",{staticClass:"el-message-box__status",class:[e.typeClass]}):e._e(),i("span",[e._v(e._s(e.title))])]),e.showClose?i("button",{staticClass:"el-message-box__headerbtn",attrs:{type:"button","aria-label":"Close"},on:{click:function(t){e.handleAction("cancel")},keydown:function(t){if(!("button"in t)&&e._k(t.keyCode,"enter",13,t.key))return null;e.handleAction("cancel")}}},[i("i",{staticClass:"el-message-box__close el-icon-close"})]):e._e()]):e._e(),""!==e.message?i("div",{staticClass:"el-message-box__content"},[e.typeClass&&!e.center?i("div",{staticClass:"el-message-box__status",class:[e.typeClass]}):e._e(),i("div",{staticClass:"el-message-box__message"},[e._t("default",[e.dangerouslyUseHTMLString?i("p",{domProps:{innerHTML:e._s(e.message)}}):i("p",[e._v(e._s(e.message))])])],2),i("div",{directives:[{name:"show",rawName:"v-show",value:e.showInput,expression:"showInput"}],staticClass:"el-message-box__input"},[i("el-input",{ref:"input",attrs:{type:e.inputType,placeholder:e.inputPlaceholder},nativeOn:{compositionstart:function(t){e.handleComposition(t)},compositionupdate:function(t){e.handleComposition(t)},compositionend:function(t){e.handleComposition(t)},keyup:function(t){if(!("button"in t)&&e._k(t.keyCode,"enter",13,t.key))return null;e.handleKeyup(t)}},model:{value:e.inputValue,callback:function(t){e.inputValue=t},expression:"inputValue"}}),i("div",{staticClass:"el-message-box__errormsg",style:{visibility:e.editorErrorMessage?"visible":"hidden"}},[e._v(e._s(e.editorErrorMessage))])],1)]):e._e(),i("div",{staticClass:"el-message-box__btns"},[i("el-button",{directives:[{name:"show",rawName:"v-show",value:e.showCancelButton,expression:"showCancelButton"}],class:[e.cancelButtonClasses],attrs:{loading:e.cancelButtonLoading,round:e.roundButton,size:"small"},on:{keydown:function(t){if(!("button"in t)&&e._k(t.keyCode,"enter",13,t.key))return null;e.handleAction("cancel")}},nativeOn:{click:function(t){e.handleAction("cancel")}}},[e._v("\n          "+e._s(e.cancelButtonText||e.t("el.messagebox.cancel"))+"\n        ")]),i("el-button",{directives:[{name:"show",rawName:"v-show",value:e.showConfirmButton,expression:"showConfirmButton"}],ref:"confirm",class:[e.confirmButtonClasses],attrs:{loading:e.confirmButtonLoading,round:e.roundButton,size:"small"},on:{keydown:function(t){if(!("button"in t)&&e._k(t.keyCode,"enter",13,t.key))return null;e.handleAction("confirm")}},nativeOn:{click:function(t){e.handleAction("confirm")}}},[e._v("\n          "+e._s(e.confirmButtonText||e.t("el.messagebox.confirm"))+"\n        ")])],1)])])])},s=[],r={render:n,staticRenderFns:s};t.a=r},function(e,t,i){"use strict";t.__esModule=!0;var n=i(262),s=function(e){return e&&e.__esModule?e:{default:e}}(n);s.default.install=function(e){e.component(s.default.name,s.default)},t.default=s.default},function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=i(263),s=i.n(n),r=i(264),a=i(0),o=a(s.a,r.a,!1,null,null,null);t.default=o.exports},function(e,t,i){"use strict";t.__esModule=!0,t.default={name:"ElBreadcrumb",props:{separator:{type:String,default:"/"},separatorClass:{type:String,default:""}},provide:function(){return{elBreadcrumb:this}},mounted:function(){var e=this.$el.querySelectorAll(".el-breadcrumb__item");e.length&&e[e.length-1].setAttribute("aria-current","page")}}},function(e,t,i){"use strict";var n=function(){var e=this,t=e.$createElement;return(e._self._c||t)("div",{staticClass:"el-breadcrumb",attrs:{"aria-label":"Breadcrumb",role:"navigation"}},[e._t("default")],2)},s=[],r={render:n,staticRenderFns:s};t.a=r},function(e,t,i){"use strict";t.__esModule=!0;var n=i(266),s=function(e){return e&&e.__esModule?e:{default:e}}(n);s.default.install=function(e){e.component(s.default.name,s.default)},t.default=s.default},function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=i(267),s=i.n(n),r=i(268),a=i(0),o=a(s.a,r.a,!1,null,null,null);t.default=o.exports},function(e,t,i){"use strict";t.__esModule=!0,t.default={name:"ElBreadcrumbItem",props:{to:{},replace:Boolean},data:function(){return{separator:"",separatorClass:""}},inject:["elBreadcrumb"],mounted:function(){var e=this;this.separator=this.elBreadcrumb.separator,this.separatorClass=this.elBreadcrumb.separatorClass;var t=this;if(this.to){var i=this.$refs.link;i.setAttribute("role","link"),i.addEventListener("click",function(i){var n=e.to;t.replace?t.$router.replace(n):t.$router.push(n)})}}}},function(e,t,i){"use strict";var n=function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("span",{staticClass:"el-breadcrumb__item"},[i("span",{ref:"link",staticClass:"el-breadcrumb__inner",attrs:{role:"link"}},[e._t("default")],2),e.separatorClass?i("i",{staticClass:"el-breadcrumb__separator",class:e.separatorClass}):i("span",{staticClass:"el-breadcrumb__separator",attrs:{role:"presentation"}},[e._v(e._s(e.separator))])])},s=[],r={render:n,staticRenderFns:s};t.a=r},function(e,t,i){"use strict";t.__esModule=!0;var n=i(270),s=function(e){return e&&e.__esModule?e:{default:e}}(n);s.default.install=function(e){e.component(s.default.name,s.default)},t.default=s.default},function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=i(271),s=i.n(n),r=i(272),a=i(0),o=a(s.a,r.a,!1,null,null,null);t.default=o.exports},function(e,t,i){"use strict";t.__esModule=!0,t.default={name:"ElForm",componentName:"ElForm",provide:function(){return{elForm:this}},props:{model:Object,rules:Object,labelPosition:String,labelWidth:String,labelSuffix:{type:String,default:""},inline:Boolean,inlineMessage:Boolean,statusIcon:Boolean,showMessage:{type:Boolean,default:!0},size:String},watch:{rules:function(){this.validate()}},data:function(){return{fields:[]}},created:function(){var e=this;this.$on("el.form.addField",function(t){t&&e.fields.push(t)}),this.$on("el.form.removeField",function(t){t.prop&&e.fields.splice(e.fields.indexOf(t),1)})},methods:{resetFields:function(){this.model&&this.fields.forEach(function(e){e.resetField()})},clearValidate:function(){this.fields.forEach(function(e){e.clearValidate()})},validate:function(e){var t=this;if(!this.model)return void console.warn("[Element Warn][Form]model is required for validate to work!");var i=void 0;"function"!=typeof e&&window.Promise&&(i=new window.Promise(function(t,i){e=function(e){e?t(e):i(e)}}));var n=!0,s=0;return 0===this.fields.length&&e&&e(!0),this.fields.forEach(function(i,r){i.validate("",function(i){i&&(n=!1),"function"==typeof e&&++s===t.fields.length&&e(n)})}),i||void 0},validateField:function(e,t){var i=this.fields.filter(function(t){return t.prop===e})[0];if(!i)throw new Error("must call validateField with valid prop string!");i.validate("",t)}}}},function(e,t,i){"use strict";var n=function(){var e=this,t=e.$createElement;return(e._self._c||t)("form",{staticClass:"el-form",class:[e.labelPosition?"el-form--label-"+e.labelPosition:"",{"el-form--inline":e.inline}]},[e._t("default")],2)},s=[],r={render:n,staticRenderFns:s};t.a=r},function(e,t,i){"use strict";t.__esModule=!0;var n=i(274),s=function(e){return e&&e.__esModule?e:{default:e}}(n);s.default.install=function(e){e.component(s.default.name,s.default)},t.default=s.default},function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=i(275),s=i.n(n),r=i(331),a=i(0),o=a(s.a,r.a,!1,null,null,null);t.default=o.exports},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0;var s=i(276),r=n(s),a=i(1),o=n(a),l=i(6);t.default={name:"ElFormItem",componentName:"ElFormItem",mixins:[o.default],provide:function(){return{elFormItem:this}},inject:["elForm"],props:{label:String,labelWidth:String,prop:String,required:{type:Boolean,default:void 0},rules:[Object,Array],error:String,validateStatus:String,for:String,inlineMessage:{type:[String,Boolean],default:""},showMessage:{type:Boolean,default:!0},size:String},watch:{error:function(e){this.validateMessage=e,this.validateState=e?"error":""},validateStatus:function(e){this.validateState=e}},computed:{labelFor:function(){return this.for||this.prop},labelStyle:function(){var e={};if("top"===this.form.labelPosition)return e;var t=this.labelWidth||this.form.labelWidth;return t&&(e.width=t),e},contentStyle:function(){var e={},t=this.label;if("top"===this.form.labelPosition||this.form.inline)return e;if(!t&&!this.labelWidth&&this.isNested)return e;var i=this.labelWidth||this.form.labelWidth;return i&&(e.marginLeft=i),e},form:function(){for(var e=this.$parent,t=e.$options.componentName;"ElForm"!==t;)"ElFormItem"===t&&(this.isNested=!0),e=e.$parent,t=e.$options.componentName;return e},fieldValue:{cache:!1,get:function(){var e=this.form.model;if(e&&this.prop){var t=this.prop;return-1!==t.indexOf(":")&&(t=t.replace(/:/,".")),(0,l.getPropByPath)(e,t,!0).v}}},isRequired:function(){var e=this.getRules(),t=!1;return e&&e.length&&e.every(function(e){return!e.required||(t=!0,!1)}),t},_formSize:function(){return this.elForm.size},elFormItemSize:function(){return this.size||this._formSize},sizeClass:function(){return(this.$ELEMENT||{}).size||this.elFormItemSize}},data:function(){return{validateState:"",validateMessage:"",validateDisabled:!1,validator:{},isNested:!1}},methods:{validate:function(e){var t=this,i=arguments.length>1&&void 0!==arguments[1]?arguments[1]:l.noop;this.validateDisabled=!1;var n=this.getFilteredRule(e);if((!n||0===n.length)&&void 0===this.required)return i(),!0;this.validateState="validating";var s={};n&&n.length>0&&n.forEach(function(e){delete e.trigger}),s[this.prop]=n;var a=new r.default(s),o={};o[this.prop]=this.fieldValue,a.validate(o,{firstFields:!0},function(e,n){t.validateState=e?"error":"success",t.validateMessage=e?e[0].message:"",i(t.validateMessage)})},clearValidate:function(){this.validateState="",this.validateMessage="",this.validateDisabled=!1},resetField:function(){this.validateState="",this.validateMessage="";var e=this.form.model,t=this.fieldValue,i=this.prop;-1!==i.indexOf(":")&&(i=i.replace(/:/,"."));var n=(0,l.getPropByPath)(e,i,!0);Array.isArray(t)?(this.validateDisabled=!0,n.o[n.k]=[].concat(this.initialValue)):(this.validateDisabled=!0,n.o[n.k]=this.initialValue)},getRules:function(){var e=this.form.rules,t=this.rules,i=void 0!==this.required?{required:!!this.required}:[];return e=e?e[this.prop]:[],[].concat(t||e||[]).concat(i)},getFilteredRule:function(e){return this.getRules().filter(function(t){return!t.trigger||-1!==t.trigger.indexOf(e)})},onFieldBlur:function(){this.validate("blur")},onFieldChange:function(){if(this.validateDisabled)return void(this.validateDisabled=!1);this.validate("change")}},mounted:function(){if(this.prop){this.dispatch("ElForm","el.form.addField",[this]);var e=this.fieldValue;Array.isArray(e)&&(e=[].concat(e)),Object.defineProperty(this,"initialValue",{value:e});(this.getRules().length||void 0!==this.required)&&(this.$on("el.form.blur",this.onFieldBlur),this.$on("el.form.change",this.onFieldChange))}},beforeDestroy:function(){this.dispatch("ElForm","el.form.removeField",[this])}}},function(e,t,i){"use strict";function n(e){this.rules=null,this._messages=c.a,this.define(e)}Object.defineProperty(t,"__esModule",{value:!0});var s=i(74),r=i.n(s),a=i(41),o=i.n(a),l=i(3),u=i(310),c=i(330);n.prototype={messages:function(e){return e&&(this._messages=Object(l.c)(Object(c.b)(),e)),this._messages},define:function(e){if(!e)throw new Error("Cannot configure a schema with no rules");if("object"!==(void 0===e?"undefined":o()(e))||Array.isArray(e))throw new Error("Rules must be an object");this.rules={};var t=void 0,i=void 0;for(t in e)e.hasOwnProperty(t)&&(i=e[t],this.rules[t]=Array.isArray(i)?i:[i])},validate:function(e){function t(e){var t=void 0,i=void 0,n=[],s={};for(t=0;t<e.length;t++)!function(e){Array.isArray(e)?n=n.concat.apply(n,e):n.push(e)}(e[t]);if(n.length)for(t=0;t<n.length;t++)i=n[t].field,s[i]=s[i]||[],s[i].push(n[t]);else n=null,s=null;h(n,s)}var i=this,s=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},a=arguments[2],u=e,d=s,h=a;if("function"==typeof d&&(h=d,d={}),!this.rules||0===Object.keys(this.rules).length)return void(h&&h());if(d.messages){var f=this.messages();f===c.a&&(f=Object(c.b)()),Object(l.c)(f,d.messages),d.messages=f}else d.messages=this.messages();var p=void 0,m=void 0,v={};(d.keys||Object.keys(this.rules)).forEach(function(t){p=i.rules[t],m=u[t],p.forEach(function(n){var s=n;"function"==typeof s.transform&&(u===e&&(u=r()({},u)),m=u[t]=s.transform(m)),s="function"==typeof s?{validator:s}:r()({},s),s.validator=i.getValidationMethod(s),s.field=t,s.fullField=s.fullField||t,s.type=i.getType(s),s.validator&&(v[t]=v[t]||[],v[t].push({rule:s,value:m,source:u,field:t}))})});var g={};Object(l.a)(v,d,function(e,t){function i(e,t){return r()({},t,{fullField:a.fullField+"."+e})}function s(){var s=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[],o=s;if(Array.isArray(o)||(o=[o]),o.length&&Object(l.f)("async-validator:",o),o.length&&a.message&&(o=[].concat(a.message)),o=o.map(Object(l.b)(a)),d.first&&o.length)return g[a.field]=1,t(o);if(u){if(a.required&&!e.value)return o=a.message?[].concat(a.message).map(Object(l.b)(a)):d.error?[d.error(a,Object(l.d)(d.messages.required,a.field))]:[],t(o);var c={};if(a.defaultField)for(var h in e.value)e.value.hasOwnProperty(h)&&(c[h]=a.defaultField);c=r()({},c,e.rule.fields);for(var f in c)if(c.hasOwnProperty(f)){var p=Array.isArray(c[f])?c[f]:[c[f]];c[f]=p.map(i.bind(null,f))}var m=new n(c);m.messages(d.messages),e.rule.options&&(e.rule.options.messages=d.messages,e.rule.options.error=d.error),m.validate(e.value,e.rule.options||d,function(e){t(e&&e.length?o.concat(e):e)})}else t(o)}var a=e.rule,u=!("object"!==a.type&&"array"!==a.type||"object"!==o()(a.fields)&&"object"!==o()(a.defaultField));u=u&&(a.required||!a.required&&e.value),a.field=e.field;var c=a.validator(a,e.value,s,e.source,d);c&&c.then&&c.then(function(){return s()},function(e){return s(e)})},function(e){t(e)})},getType:function(e){if(void 0===e.type&&e.pattern instanceof RegExp&&(e.type="pattern"),"function"!=typeof e.validator&&e.type&&!u.a.hasOwnProperty(e.type))throw new Error(Object(l.d)("Unknown rule type %s",e.type));return e.type||"string"},getValidationMethod:function(e){if("function"==typeof e.validator)return e.validator;var t=Object.keys(e),i=t.indexOf("message");return-1!==i&&t.splice(i,1),1===t.length&&"required"===t[0]?u.a.required:u.a[this.getType(e)]||!1}},n.register=function(e,t){if("function"!=typeof t)throw new Error("Cannot register a validator by type, validator is not a function");u.a[e]=t},n.messages=c.a,t.default=n},function(e,t,i){e.exports={default:i(278),__esModule:!0}},function(e,t,i){i(279),e.exports=i(35).Object.assign},function(e,t,i){var n=i(50);n(n.S+n.F,"Object",{assign:i(282)})},function(e,t,i){var n=i(281);e.exports=function(e,t,i){if(n(e),void 0===t)return e;switch(i){case 1:return function(i){return e.call(t,i)};case 2:return function(i,n){return e.call(t,i,n)};case 3:return function(i,n,s){return e.call(t,i,n,s)}}return function(){return e.apply(t,arguments)}}},function(e,t){e.exports=function(e){if("function"!=typeof e)throw TypeError(e+" is not a function!");return e}},function(e,t,i){"use strict";var n=i(30),s=i(57),r=i(40),a=i(80),o=i(78),l=Object.assign;e.exports=!l||i(29)(function(){var e={},t={},i=Symbol(),n="abcdefghijklmnopqrst";return e[i]=7,n.split("").forEach(function(e){t[e]=e}),7!=l({},e)[i]||Object.keys(l({},t)).join("")!=n})?function(e,t){for(var i=a(e),l=arguments.length,u=1,c=s.f,d=r.f;l>u;)for(var h,f=o(arguments[u++]),p=c?n(f).concat(c(f)):n(f),m=p.length,v=0;m>v;)d.call(f,h=p[v++])&&(i[h]=f[h]);return i}:l},function(e,t,i){var n=i(20),s=i(284),r=i(285);e.exports=function(e){return function(t,i,a){var o,l=n(t),u=s(l.length),c=r(a,u);if(e&&i!=i){for(;u>c;)if((o=l[c++])!=o)return!0}else for(;u>c;c++)if((e||c in l)&&l[c]===i)return e||c||0;return!e&&-1}}},function(e,t,i){var n=i(53),s=Math.min;e.exports=function(e){return e>0?s(n(e),9007199254740991):0}},function(e,t,i){var n=i(53),s=Math.max,r=Math.min;e.exports=function(e,t){return e=n(e),e<0?s(e+t,0):r(e,t)}},function(e,t,i){e.exports={default:i(287),__esModule:!0}},function(e,t,i){i(288),i(294),e.exports=i(61).f("iterator")},function(e,t,i){"use strict";var n=i(289)(!0);i(81)(String,"String",function(e){this._t=String(e),this._i=0},function(){var e,t=this._t,i=this._i;return i>=t.length?{value:void 0,done:!0}:(e=n(t,i),this._i+=e.length,{value:e,done:!1})})},function(e,t,i){var n=i(53),s=i(52);e.exports=function(e){return function(t,i){var r,a,o=String(s(t)),l=n(i),u=o.length;return l<0||l>=u?e?"":void 0:(r=o.charCodeAt(l),r<55296||r>56319||l+1===u||(a=o.charCodeAt(l+1))<56320||a>57343?e?o.charAt(l):r:e?o.slice(l,l+2):a-56320+(r-55296<<10)+65536)}}},function(e,t,i){"use strict";var n=i(83),s=i(38),r=i(60),a={};i(22)(a,i(25)("iterator"),function(){return this}),e.exports=function(e,t,i){e.prototype=n(a,{next:s(1,i)}),r(e,t+" Iterator")}},function(e,t,i){var n=i(23),s=i(36),r=i(30);e.exports=i(24)?Object.defineProperties:function(e,t){s(e);for(var i,a=r(t),o=a.length,l=0;o>l;)n.f(e,i=a[l++],t[i]);return e}},function(e,t,i){e.exports=i(15).document&&document.documentElement},function(e,t,i){var n=i(19),s=i(80),r=i(54)("IE_PROTO"),a=Object.prototype;e.exports=Object.getPrototypeOf||function(e){return e=s(e),n(e,r)?e[r]:"function"==typeof e.constructor&&e instanceof e.constructor?e.constructor.prototype:e instanceof Object?a:null}},function(e,t,i){i(295);for(var n=i(15),s=i(22),r=i(59),a=i(25)("toStringTag"),o=["NodeList","DOMTokenList","MediaList","StyleSheetList","CSSRuleList"],l=0;l<5;l++){var u=o[l],c=n[u],d=c&&c.prototype;d&&!d[a]&&s(d,a,u),r[u]=r.Array}},function(e,t,i){"use strict";var n=i(296),s=i(297),r=i(59),a=i(20);e.exports=i(81)(Array,"Array",function(e,t){this._t=a(e),this._i=0,this._k=t},function(){var e=this._t,t=this._k,i=this._i++;return!e||i>=e.length?(this._t=void 0,s(1)):"keys"==t?s(0,i):"values"==t?s(0,e[i]):s(0,[i,e[i]])},"values"),r.Arguments=r.Array,n("keys"),n("values"),n("entries")},function(e,t){e.exports=function(){}},function(e,t){e.exports=function(e,t){return{value:t,done:!!e}}},function(e,t,i){e.exports={default:i(299),__esModule:!0}},function(e,t,i){i(300),i(307),i(308),i(309),e.exports=i(35).Symbol},function(e,t,i){"use strict";var n=i(15),s=i(19),r=i(24),a=i(50),o=i(82),l=i(301).KEY,u=i(29),c=i(55),d=i(60),h=i(39),f=i(25),p=i(61),m=i(62),v=i(302),g=i(303),b=i(304),y=i(36),_=i(20),x=i(51),C=i(38),w=i(83),k=i(305),S=i(306),M=i(23),$=i(30),E=S.f,D=M.f,T=k.f,P=n.Symbol,O=n.JSON,N=O&&O.stringify,F=f("_hidden"),I=f("toPrimitive"),A={}.propertyIsEnumerable,V=c("symbol-registry"),L=c("symbols"),B=c("op-symbols"),z=Object.prototype,R="function"==typeof P,j=n.QObject,H=!j||!j.prototype||!j.prototype.findChild,W=r&&u(function(){return 7!=w(D({},"a",{get:function(){return D(this,"a",{value:7}).a}})).a})?function(e,t,i){var n=E(z,t);n&&delete z[t],D(e,t,i),n&&e!==z&&D(z,t,n)}:D,q=function(e){var t=L[e]=w(P.prototype);return t._k=e,t},K=R&&"symbol"==typeof P.iterator?function(e){return"symbol"==typeof e}:function(e){return e instanceof P},Y=function(e,t,i){return e===z&&Y(B,t,i),y(e),t=x(t,!0),y(i),s(L,t)?(i.enumerable?(s(e,F)&&e[F][t]&&(e[F][t]=!1),i=w(i,{enumerable:C(0,!1)})):(s(e,F)||D(e,F,C(1,{})),e[F][t]=!0),W(e,t,i)):D(e,t,i)},G=function(e,t){y(e);for(var i,n=g(t=_(t)),s=0,r=n.length;r>s;)Y(e,i=n[s++],t[i]);return e},U=function(e,t){return void 0===t?w(e):G(w(e),t)},X=function(e){var t=A.call(this,e=x(e,!0));return!(this===z&&s(L,e)&&!s(B,e))&&(!(t||!s(this,e)||!s(L,e)||s(this,F)&&this[F][e])||t)},J=function(e,t){if(e=_(e),t=x(t,!0),e!==z||!s(L,t)||s(B,t)){var i=E(e,t);return!i||!s(L,t)||s(e,F)&&e[F][t]||(i.enumerable=!0),i}},Z=function(e){for(var t,i=T(_(e)),n=[],r=0;i.length>r;)s(L,t=i[r++])||t==F||t==l||n.push(t);return n},Q=function(e){for(var t,i=e===z,n=T(i?B:_(e)),r=[],a=0;n.length>a;)!s(L,t=n[a++])||i&&!s(z,t)||r.push(L[t]);return r};R||(P=function(){if(this instanceof P)throw TypeError("Symbol is not a constructor!");var e=h(arguments.length>0?arguments[0]:void 0),t=function(i){this===z&&t.call(B,i),s(this,F)&&s(this[F],e)&&(this[F][e]=!1),W(this,e,C(1,i))};return r&&H&&W(z,e,{configurable:!0,set:t}),q(e)},o(P.prototype,"toString",function(){return this._k}),S.f=J,M.f=Y,i(84).f=k.f=Z,i(40).f=X,i(57).f=Q,r&&!i(58)&&o(z,"propertyIsEnumerable",X,!0),p.f=function(e){return q(f(e))}),a(a.G+a.W+a.F*!R,{Symbol:P});for(var ee="hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables".split(","),te=0;ee.length>te;)f(ee[te++]);for(var ee=$(f.store),te=0;ee.length>te;)m(ee[te++]);a(a.S+a.F*!R,"Symbol",{for:function(e){return s(V,e+="")?V[e]:V[e]=P(e)},keyFor:function(e){if(K(e))return v(V,e);throw TypeError(e+" is not a symbol!")},useSetter:function(){H=!0},useSimple:function(){H=!1}}),a(a.S+a.F*!R,"Object",{create:U,defineProperty:Y,defineProperties:G,getOwnPropertyDescriptor:J,getOwnPropertyNames:Z,getOwnPropertySymbols:Q}),O&&a(a.S+a.F*(!R||u(function(){var e=P();return"[null]"!=N([e])||"{}"!=N({a:e})||"{}"!=N(Object(e))})),"JSON",{stringify:function(e){if(void 0!==e&&!K(e)){for(var t,i,n=[e],s=1;arguments.length>s;)n.push(arguments[s++]);return t=n[1],"function"==typeof t&&(i=t),!i&&b(t)||(t=function(e,t){if(i&&(t=i.call(this,e,t)),!K(t))return t}),n[1]=t,N.apply(O,n)}}}),P.prototype[I]||i(22)(P.prototype,I,P.prototype.valueOf),d(P,"Symbol"),d(Math,"Math",!0),d(n.JSON,"JSON",!0)},function(e,t,i){var n=i(39)("meta"),s=i(37),r=i(19),a=i(23).f,o=0,l=Object.isExtensible||function(){return!0},u=!i(29)(function(){return l(Object.preventExtensions({}))}),c=function(e){a(e,n,{value:{i:"O"+ ++o,w:{}}})},d=function(e,t){if(!s(e))return"symbol"==typeof e?e:("string"==typeof e?"S":"P")+e;if(!r(e,n)){if(!l(e))return"F";if(!t)return"E";c(e)}return e[n].i},h=function(e,t){if(!r(e,n)){if(!l(e))return!0;if(!t)return!1;c(e)}return e[n].w},f=function(e){return u&&p.NEED&&l(e)&&!r(e,n)&&c(e),e},p=e.exports={KEY:n,NEED:!1,fastKey:d,getWeak:h,onFreeze:f}},function(e,t,i){var n=i(30),s=i(20);e.exports=function(e,t){for(var i,r=s(e),a=n(r),o=a.length,l=0;o>l;)if(r[i=a[l++]]===t)return i}},function(e,t,i){var n=i(30),s=i(57),r=i(40);e.exports=function(e){var t=n(e),i=s.f;if(i)for(var a,o=i(e),l=r.f,u=0;o.length>u;)l.call(e,a=o[u++])&&t.push(a);return t}},function(e,t,i){var n=i(79);e.exports=Array.isArray||function(e){return"Array"==n(e)}},function(e,t,i){var n=i(20),s=i(84).f,r={}.toString,a="object"==typeof window&&window&&Object.getOwnPropertyNames?Object.getOwnPropertyNames(window):[],o=function(e){try{return s(e)}catch(e){return a.slice()}};e.exports.f=function(e){return a&&"[object Window]"==r.call(e)?o(e):s(n(e))}},function(e,t,i){var n=i(40),s=i(38),r=i(20),a=i(51),o=i(19),l=i(75),u=Object.getOwnPropertyDescriptor;t.f=i(24)?u:function(e,t){if(e=r(e),t=a(t,!0),l)try{return u(e,t)}catch(e){}if(o(e,t))return s(!n.f.call(e,t),e[t])}},function(e,t){},function(e,t,i){i(62)("asyncIterator")},function(e,t,i){i(62)("observable")},function(e,t,i){"use strict";var n=i(311),s=i(317),r=i(318),a=i(319),o=i(320),l=i(321),u=i(322),c=i(323),d=i(324),h=i(325),f=i(326),p=i(327),m=i(328),v=i(329);t.a={string:n.a,method:s.a,number:r.a,boolean:a.a,regexp:o.a,integer:l.a,float:u.a,array:c.a,object:d.a,enum:h.a,pattern:f.a,date:p.a,url:v.a,hex:v.a,email:v.a,required:m.a}},function(e,t,i){"use strict";function n(e,t,i,n,a){var o=[];if(e.required||!e.required&&n.hasOwnProperty(e.field)){if(Object(r.e)(t,"string")&&!e.required)return i();s.a.required(e,t,n,o,a,"string"),Object(r.e)(t,"string")||(s.a.type(e,t,n,o,a),s.a.range(e,t,n,o,a),s.a.pattern(e,t,n,o,a),!0===e.whitespace&&s.a.whitespace(e,t,n,o,a))}i(o)}var s=i(7),r=i(3);t.a=n},function(e,t,i){"use strict";function n(e,t,i,n,r){(/^\s+$/.test(t)||""===t)&&n.push(s.d(r.messages.whitespace,e.fullField))}var s=i(3);t.a=n},function(e,t,i){"use strict";function n(e,t,i,n,s){if(e.required&&void 0===t)return void Object(o.a)(e,t,i,n,s);var l=["integer","float","array","regexp","object","method","email","number","date","url","hex"],c=e.type;l.indexOf(c)>-1?u[c](t)||n.push(a.d(s.messages.types[c],e.fullField,e.type)):c&&(void 0===t?"undefined":r()(t))!==e.type&&n.push(a.d(s.messages.types[c],e.fullField,e.type))}var s=i(41),r=i.n(s),a=i(3),o=i(85),l={email:/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,url:new RegExp("^(?!mailto:)(?:(?:http|https|ftp)://|//)(?:\\S+(?::\\S*)?@)?(?:(?:(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[0-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))|localhost)(?::\\d{2,5})?(?:(/|\\?|#)[^\\s]*)?$","i"),hex:/^#?([a-f0-9]{6}|[a-f0-9]{3})$/i},u={integer:function(e){return u.number(e)&&parseInt(e,10)===e},float:function(e){return u.number(e)&&!u.integer(e)},array:function(e){return Array.isArray(e)},regexp:function(e){if(e instanceof RegExp)return!0;try{return!!new RegExp(e)}catch(e){return!1}},date:function(e){return"function"==typeof e.getTime&&"function"==typeof e.getMonth&&"function"==typeof e.getYear},number:function(e){return!isNaN(e)&&"number"==typeof e},object:function(e){return"object"===(void 0===e?"undefined":r()(e))&&!u.array(e)},method:function(e){return"function"==typeof e},email:function(e){return"string"==typeof e&&!!e.match(l.email)&&e.length<255},url:function(e){return"string"==typeof e&&!!e.match(l.url)},hex:function(e){return"string"==typeof e&&!!e.match(l.hex)}};t.a=n},function(e,t,i){"use strict";function n(e,t,i,n,r){var a="number"==typeof e.len,o="number"==typeof e.min,l="number"==typeof e.max,u=t,c=null,d="number"==typeof t,h="string"==typeof t,f=Array.isArray(t);if(d?c="number":h?c="string":f&&(c="array"),!c)return!1;(h||f)&&(u=t.length),a?u!==e.len&&n.push(s.d(r.messages[c].len,e.fullField,e.len)):o&&!l&&u<e.min?n.push(s.d(r.messages[c].min,e.fullField,e.min)):l&&!o&&u>e.max?n.push(s.d(r.messages[c].max,e.fullField,e.max)):o&&l&&(u<e.min||u>e.max)&&n.push(s.d(r.messages[c].range,e.fullField,e.min,e.max))}var s=i(3);t.a=n},function(e,t,i){"use strict";function n(e,t,i,n,a){e[r]=Array.isArray(e[r])?e[r]:[],-1===e[r].indexOf(t)&&n.push(s.d(a.messages[r],e.fullField,e[r].join(", ")))}var s=i(3),r="enum";t.a=n},function(e,t,i){"use strict";function n(e,t,i,n,r){if(e.pattern)if(e.pattern instanceof RegExp)e.pattern.test(t)||n.push(s.d(r.messages.pattern.mismatch,e.fullField,t,e.pattern));else if("string"==typeof e.pattern){var a=new RegExp(e.pattern);a.test(t)||n.push(s.d(r.messages.pattern.mismatch,e.fullField,t,e.pattern))}}var s=i(3);t.a=n},function(e,t,i){"use strict";function n(e,t,i,n,a){var o=[];if(e.required||!e.required&&n.hasOwnProperty(e.field)){if(Object(r.e)(t)&&!e.required)return i();s.a.required(e,t,n,o,a),void 0!==t&&s.a.type(e,t,n,o,a)}i(o)}var s=i(7),r=i(3);t.a=n},function(e,t,i){"use strict";function n(e,t,i,n,a){var o=[];if(e.required||!e.required&&n.hasOwnProperty(e.field)){if(Object(r.e)(t)&&!e.required)return i();s.a.required(e,t,n,o,a),void 0!==t&&(s.a.type(e,t,n,o,a),s.a.range(e,t,n,o,a))}i(o)}var s=i(7),r=i(3);t.a=n},function(e,t,i){"use strict";function n(e,t,i,n,a){var o=[];if(e.required||!e.required&&n.hasOwnProperty(e.field)){if(Object(s.e)(t)&&!e.required)return i();r.a.required(e,t,n,o,a),void 0!==t&&r.a.type(e,t,n,o,a)}i(o)}var s=i(3),r=i(7);t.a=n},function(e,t,i){"use strict";function n(e,t,i,n,a){var o=[];if(e.required||!e.required&&n.hasOwnProperty(e.field)){if(Object(r.e)(t)&&!e.required)return i();s.a.required(e,t,n,o,a),Object(r.e)(t)||s.a.type(e,t,n,o,a)}i(o)}var s=i(7),r=i(3);t.a=n},function(e,t,i){"use strict";function n(e,t,i,n,a){var o=[];if(e.required||!e.required&&n.hasOwnProperty(e.field)){if(Object(r.e)(t)&&!e.required)return i();s.a.required(e,t,n,o,a),void 0!==t&&(s.a.type(e,t,n,o,a),s.a.range(e,t,n,o,a))}i(o)}var s=i(7),r=i(3);t.a=n},function(e,t,i){"use strict";function n(e,t,i,n,a){var o=[];if(e.required||!e.required&&n.hasOwnProperty(e.field)){if(Object(r.e)(t)&&!e.required)return i();s.a.required(e,t,n,o,a),void 0!==t&&(s.a.type(e,t,n,o,a),s.a.range(e,t,n,o,a))}i(o)}var s=i(7),r=i(3);t.a=n},function(e,t,i){"use strict";function n(e,t,i,n,a){var o=[];if(e.required||!e.required&&n.hasOwnProperty(e.field)){if(Object(r.e)(t,"array")&&!e.required)return i();s.a.required(e,t,n,o,a,"array"),Object(r.e)(t,"array")||(s.a.type(e,t,n,o,a),s.a.range(e,t,n,o,a))}i(o)}var s=i(7),r=i(3);t.a=n},function(e,t,i){"use strict";function n(e,t,i,n,a){var o=[];if(e.required||!e.required&&n.hasOwnProperty(e.field)){if(Object(r.e)(t)&&!e.required)return i();s.a.required(e,t,n,o,a),void 0!==t&&s.a.type(e,t,n,o,a)}i(o)}var s=i(7),r=i(3);t.a=n},function(e,t,i){"use strict";function n(e,t,i,n,o){var l=[];if(e.required||!e.required&&n.hasOwnProperty(e.field)){if(Object(r.e)(t)&&!e.required)return i();s.a.required(e,t,n,l,o),t&&s.a[a](e,t,n,l,o)}i(l)}var s=i(7),r=i(3),a="enum";t.a=n},function(e,t,i){"use strict";function n(e,t,i,n,a){var o=[];if(e.required||!e.required&&n.hasOwnProperty(e.field)){if(Object(r.e)(t,"string")&&!e.required)return i();s.a.required(e,t,n,o,a),Object(r.e)(t,"string")||s.a.pattern(e,t,n,o,a)}i(o)}var s=i(7),r=i(3);t.a=n},function(e,t,i){"use strict";function n(e,t,i,n,a){var o=[];if(e.required||!e.required&&n.hasOwnProperty(e.field)){if(Object(r.e)(t)&&!e.required)return i();s.a.required(e,t,n,o,a),Object(r.e)(t)||(s.a.type(e,t,n,o,a),t&&s.a.range(e,t.getTime(),n,o,a))}i(o)}var s=i(7),r=i(3);t.a=n},function(e,t,i){"use strict";function n(e,t,i,n,s){var o=[],l=Array.isArray(t)?"array":void 0===t?"undefined":r()(t);a.a.required(e,t,n,o,s,l),i(o)}var s=i(41),r=i.n(s),a=i(7);t.a=n},function(e,t,i){"use strict";function n(e,t,i,n,a){var o=e.type,l=[];if(e.required||!e.required&&n.hasOwnProperty(e.field)){if(Object(r.e)(t,o)&&!e.required)return i();s.a.required(e,t,n,l,a,o),Object(r.e)(t,o)||s.a.type(e,t,n,l,a)}i(l)}var s=i(7),r=i(3);t.a=n},function(e,t,i){"use strict";function n(){return{default:"Validation error on field %s",required:"%s is required",enum:"%s must be one of %s",whitespace:"%s cannot be empty",date:{format:"%s date %s is invalid for format %s",parse:"%s date could not be parsed, %s is invalid ",invalid:"%s date %s is invalid"},types:{string:"%s is not a %s",method:"%s is not a %s (function)",array:"%s is not an %s",object:"%s is not an %s",number:"%s is not a %s",date:"%s is not a %s",boolean:"%s is not a %s",integer:"%s is not an %s",float:"%s is not a %s",regexp:"%s is not a valid %s",email:"%s is not a valid %s",url:"%s is not a valid %s",hex:"%s is not a valid %s"},string:{len:"%s must be exactly %s characters",min:"%s must be at least %s characters",max:"%s cannot be longer than %s characters",range:"%s must be between %s and %s characters"},number:{len:"%s must equal %s",min:"%s cannot be less than %s",max:"%s cannot be greater than %s",range:"%s must be between %s and %s"},array:{len:"%s must be exactly %s in length",min:"%s cannot be less than %s in length",max:"%s cannot be greater than %s in length",range:"%s must be between %s and %s in length"},pattern:{mismatch:"%s value %s does not match pattern %s"},clone:function(){var e=JSON.parse(JSON.stringify(this));return e.clone=this.clone,e}}}t.b=n,i.d(t,"a",function(){return s});var s=n()},function(e,t,i){"use strict";var n=function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("div",{staticClass:"el-form-item",class:[{"el-form-item--feedback":e.elForm&&e.elForm.statusIcon,"is-error":"error"===e.validateState,"is-validating":"validating"===e.validateState,"is-success":"success"===e.validateState,"is-required":e.isRequired||e.required},e.sizeClass?"el-form-item--"+e.sizeClass:""]},[e.label||e.$slots.label?i("label",{staticClass:"el-form-item__label",style:e.labelStyle,attrs:{for:e.labelFor}},[e._t("label",[e._v(e._s(e.label+e.form.labelSuffix))])],2):e._e(),i("div",{staticClass:"el-form-item__content",style:e.contentStyle},[e._t("default"),i("transition",{attrs:{name:"el-zoom-in-top"}},["error"===e.validateState&&e.showMessage&&e.form.showMessage?i("div",{staticClass:"el-form-item__error",class:{"el-form-item__error--inline":"boolean"==typeof e.inlineMessage?e.inlineMessage:e.elForm&&e.elForm.inlineMessage||!1}},[e._v("\n        "+e._s(e.validateMessage)+"\n      ")]):e._e()])],2)])},s=[],r={render:n,staticRenderFns:s};t.a=r},function(e,t,i){"use strict";t.__esModule=!0;var n=i(333),s=function(e){return e&&e.__esModule?e:{default:e}}(n);s.default.install=function(e){e.component(s.default.name,s.default)},t.default=s.default},function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=i(334),s=i.n(n),r=i(0),a=r(s.a,null,!1,null,null,null);t.default=a.exports},function(e,t,i){"use strict";t.__esModule=!0;var n=i(335),s=function(e){return e&&e.__esModule?e:{default:e}}(n);t.default={name:"ElTabs",components:{TabNav:s.default},props:{type:String,activeName:String,closable:Boolean,addable:Boolean,value:{},editable:Boolean,tabPosition:{type:String,default:"top"}},provide:function(){return{rootTabs:this}},data:function(){return{currentName:this.value||this.activeName,panes:[]}},watch:{activeName:function(e){this.setCurrentName(e)},value:function(e){this.setCurrentName(e)},currentName:function(e){var t=this;this.$refs.nav&&this.$nextTick(function(e){t.$refs.nav.scrollToActiveTab()})}},methods:{handleTabClick:function(e,t,i){e.disabled||(this.setCurrentName(t),this.$emit("tab-click",e,i))},handleTabRemove:function(e,t){e.disabled||(t.stopPropagation(),this.$emit("edit",e.name,"remove"),this.$emit("tab-remove",e.name))},handleTabAdd:function(){this.$emit("edit",null,"add"),this.$emit("tab-add")},setCurrentName:function(e){this.currentName=e,this.$emit("input",e)},addPanes:function(e){var t=this.$slots.default.filter(function(e){return 1===e.elm.nodeType&&/\bel-tab-pane\b/.test(e.elm.className)}).indexOf(e.$vnode);this.panes.splice(t,0,e)},removePanes:function(e){var t=this.panes,i=t.indexOf(e);i>-1&&t.splice(i,1)}},render:function(e){var t,i=this.type,n=this.handleTabClick,s=this.handleTabRemove,r=this.handleTabAdd,a=this.currentName,o=this.panes,l=this.editable,u=this.addable,c=this.tabPosition,d=l||u?e("span",{class:"el-tabs__new-tab",on:{click:r,keydown:function(e){13===e.keyCode&&r()}},attrs:{tabindex:"0"}},[e("i",{class:"el-icon-plus"},[])]):null,h={props:{currentName:a,onTabClick:n,onTabRemove:s,editable:l,type:i,panes:o},ref:"nav"},f=e("div",{class:"el-tabs__header"},[d,e("tab-nav",h,[])]),p=e("div",{class:"el-tabs__content"},[this.$slots.default]);return e("div",{class:(t={"el-tabs":!0,"el-tabs--card":"card"===i},t["el-tabs--"+c]=!0,t["el-tabs--border-card"]="border-card"===i,t)},["bottom"!==c?[f,p]:[p,f]])},created:function(){this.currentName||this.setCurrentName("0")}}},function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=i(336),s=i.n(n),r=i(0),a=r(s.a,null,!1,null,null,null);t.default=a.exports},function(e,t,i){"use strict";function n(){}t.__esModule=!0;var s=i(337),r=function(e){return e&&e.__esModule?e:{default:e}}(s),a=i(28),o=function(e){return e.toLowerCase().replace(/( |^)[a-z]/g,function(e){return e.toUpperCase()})};t.default={name:"TabNav",components:{TabBar:r.default},inject:["rootTabs"],props:{panes:Array,currentName:String,editable:Boolean,onTabClick:{type:Function,default:n},onTabRemove:{type:Function,default:n},type:String},data:function(){return{scrollable:!1,navOffset:0,isFocus:!1}},computed:{navStyle:function(){return{transform:"translate"+(-1!==["top","bottom"].indexOf(this.rootTabs.tabPosition)?"X":"Y")+"(-"+this.navOffset+"px)"}},sizeName:function(){return-1!==["top","bottom"].indexOf(this.rootTabs.tabPosition)?"width":"height"}},methods:{scrollPrev:function(){var e=this.$refs.navScroll["offset"+o(this.sizeName)],t=this.navOffset;if(t){var i=t>e?t-e:0;this.navOffset=i}},scrollNext:function(){var e=this.$refs.nav["offset"+o(this.sizeName)],t=this.$refs.navScroll["offset"+o(this.sizeName)],i=this.navOffset;if(!(e-i<=t)){var n=e-i>2*t?i+t:e-t;this.navOffset=n}},scrollToActiveTab:function(){if(this.scrollable){var e=this.$refs.nav,t=this.$el.querySelector(".is-active"),i=this.$refs.navScroll,n=t.getBoundingClientRect(),s=i.getBoundingClientRect(),r=e.getBoundingClientRect(),a=this.navOffset,o=a;n.left<s.left&&(o=a-(s.left-n.left)),n.right>s.right&&(o=a+n.right-s.right),r.right<s.right&&(o=e.offsetWidth-s.width),this.navOffset=Math.max(o,0)}},update:function(){if(this.$refs.nav){var e=this.sizeName,t=this.$refs.nav["offset"+o(e)],i=this.$refs.navScroll["offset"+o(e)],n=this.navOffset;if(i<t){var s=this.navOffset;this.scrollable=this.scrollable||{},this.scrollable.prev=s,this.scrollable.next=s+i<t,t-s<i&&(this.navOffset=t-i)}else this.scrollable=!1,n>0&&(this.navOffset=0)}},changeTab:function(e){var t=e.keyCode,i=void 0,n=void 0,s=void 0;-1!==[37,38,39,40].indexOf(t)&&(s=e.currentTarget.querySelectorAll("[role=tab]"),n=Array.prototype.indexOf.call(s,e.target),i=37===t||38===t?0===n?s.length-1:n-1:n<s.length-1?n+1:0,s[i].focus(),s[i].click())},setFocus:function(){this.isFocus=!0},removeFocus:function(){this.isFocus=!1}},updated:function(){this.update()},render:function(e){var t=this,i=this.type,n=this.panes,s=this.editable,r=this.onTabClick,a=this.onTabRemove,o=this.navStyle,l=this.scrollable,u=this.scrollNext,c=this.scrollPrev,d=this.changeTab,h=this.setFocus,f=this.removeFocus,p=l?[e("span",{class:["el-tabs__nav-prev",l.prev?"":"is-disabled"],on:{click:c}},[e("i",{class:"el-icon-arrow-left"},[])]),e("span",{class:["el-tabs__nav-next",l.next?"":"is-disabled"],on:{click:u}},[e("i",{class:"el-icon-arrow-right"},[])])]:null,m=this._l(n,function(i,n){var o=i.name||i.index||n,l=i.isClosable||s;i.index=""+n;var u=l?e("span",{class:"el-icon-close",on:{click:function(e){a(i,e)}}},[]):null,c=i.$slots.label||i.label,d=i.active?0:-1;return e("div",{class:{"el-tabs__item":!0,"is-active":i.active,"is-disabled":i.disabled,"is-closable":l,"is-focus":t.isFocus},attrs:{id:"tab-"+o,"aria-controls":"pane-"+o,role:"tab","aria-selected":i.active,tabindex:d},ref:"tabs",refInFor:!0,on:{focus:function(){h()},blur:function(){f()},click:function(e){f(),r(i,o,e)},keydown:function(e){!l||46!==e.keyCode&&8!==e.keyCode||a(i,e)}}},[c,u])});return e("div",{class:["el-tabs__nav-wrap",l?"is-scrollable":""]},[p,e("div",{class:["el-tabs__nav-scroll"],ref:"navScroll"},[e("div",{class:"el-tabs__nav",ref:"nav",style:o,attrs:{role:"tablist"},on:{keydown:d}},[i?null:e("tab-bar",{attrs:{tabs:n}},[]),m])])])},mounted:function(){(0,a.addResizeListener)(this.$el,this.update)},beforeDestroy:function(){this.$el&&this.update&&(0,a.removeResizeListener)(this.$el,this.update)}}},function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=i(338),s=i.n(n),r=i(339),a=i(0),o=a(s.a,r.a,!1,null,null,null);t.default=o.exports},function(e,t,i){"use strict";t.__esModule=!0,t.default={name:"TabBar",props:{tabs:Array},inject:["rootTabs"],computed:{barStyle:{cache:!1,get:function(){var e=this;if(!this.$parent.$refs.tabs)return{};var t={},i=0,n=0,s=-1!==["top","bottom"].indexOf(this.rootTabs.tabPosition)?"width":"height",r="width"===s?"x":"y",a=function(e){return e.toLowerCase().replace(/( |^)[a-z]/g,function(e){return e.toUpperCase()})};this.tabs.every(function(t,r){var o=e.$parent.$refs.tabs[r];return!!o&&(t.active?(n=o["client"+a(s)],"width"===s&&(n-=0===r?20:40),!1):(i+=o["client"+a(s)],!0))}),"width"===s&&0!==i&&(i+=20);var o="translate"+a(r)+"("+i+"px)";return t[s]=n+"px",t.transform=o,t.msTransform=o,t.webkitTransform=o,t}}}}},function(e,t,i){"use strict";var n=function(){var e=this,t=e.$createElement;return(e._self._c||t)("div",{staticClass:"el-tabs__active-bar",style:e.barStyle})},s=[],r={render:n,staticRenderFns:s};t.a=r},function(e,t,i){"use strict";t.__esModule=!0;var n=i(341),s=function(e){return e&&e.__esModule?e:{default:e}}(n);s.default.install=function(e){e.component(s.default.name,s.default)},t.default=s.default},function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=i(342),s=i.n(n),r=i(343),a=i(0),o=a(s.a,r.a,!1,null,null,null);t.default=o.exports},function(e,t,i){"use strict";t.__esModule=!0,t.default={name:"ElTabPane",componentName:"ElTabPane",props:{label:String,labelContent:Function,name:String,closable:Boolean,disabled:Boolean},data:function(){return{index:null}},computed:{isClosable:function(){return this.closable||this.$parent.closable},active:function(){return this.$parent.currentName===(this.name||this.index)},paneName:function(){return this.name||this.index}},mounted:function(){this.$parent.addPanes(this)},destroyed:function(){this.$el&&this.$el.parentNode&&this.$el.parentNode.removeChild(this.$el),this.$parent.removePanes(this)},watch:{label:function(){this.$parent.$forceUpdate()}}}},function(e,t,i){"use strict";var n=function(){var e=this,t=e.$createElement;return(e._self._c||t)("div",{directives:[{name:"show",rawName:"v-show",value:e.active,expression:"active"}],staticClass:"el-tab-pane",attrs:{role:"tabpanel","aria-hidden":!e.active,id:"pane-"+e.paneName,"aria-labelledby":"tab-"+e.paneName}},[e._t("default")],2)},s=[],r={render:n,staticRenderFns:s};t.a=r},function(e,t,i){"use strict";t.__esModule=!0;var n=i(345),s=function(e){return e&&e.__esModule?e:{default:e}}(n);s.default.install=function(e){e.component(s.default.name,s.default)},t.default=s.default},function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=i(346),s=i.n(n),r=i(352),a=i(0),o=a(s.a,r.a,!1,null,null,null);t.default=o.exports},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0;var s=i(347),r=n(s),a=i(349),o=n(a),l=i(16),u=i(1),c=n(u);t.default={name:"ElTree",mixins:[c.default],components:{ElTreeNode:o.default},data:function(){return{store:null,root:null,currentNode:null,treeItems:null,checkboxItems:[]}},props:{data:{type:Array},emptyText:{type:String,default:function(){return(0,l.t)("el.tree.emptyText")}},nodeKey:String,checkStrictly:Boolean,defaultExpandAll:Boolean,expandOnClickNode:{type:Boolean,default:!0},checkDescendants:{type:Boolean,default:!1},autoExpandParent:{type:Boolean,default:!0},defaultCheckedKeys:Array,defaultExpandedKeys:Array,renderContent:Function,showCheckbox:{type:Boolean,default:!1},props:{default:function(){return{children:"children",label:"label",icon:"icon",disabled:"disabled"}}},lazy:{type:Boolean,default:!1},highlightCurrent:Boolean,load:Function,filterNodeMethod:Function,accordion:Boolean,indent:{type:Number,default:18}},computed:{children:{set:function(e){this.data=e},get:function(){return this.data}},treeItemArray:function(){return Array.prototype.slice.call(this.treeItems)}},watch:{defaultCheckedKeys:function(e){this.store.defaultCheckedKeys=e,this.store.setDefaultCheckedKey(e)},defaultExpandedKeys:function(e){this.store.defaultExpandedKeys=e,this.store.setDefaultExpandedKeys(e)},data:function(e){this.store.setData(e)},checkboxItems:function(e){Array.prototype.forEach.call(e,function(e){e.setAttribute("tabindex",-1)})}},methods:{filter:function(e){if(!this.filterNodeMethod)throw new Error("[Tree] filterNodeMethod is required when filter");this.store.filter(e)},getNodeKey:function(e,t){var i=this.nodeKey;return i&&e?e.data[i]:t},getCheckedNodes:function(e){return this.store.getCheckedNodes(e)},getCheckedKeys:function(e){return this.store.getCheckedKeys(e)},getCurrentNode:function(){var e=this.store.getCurrentNode();return e?e.data:null},getCurrentKey:function(){if(!this.nodeKey)throw new Error("[Tree] nodeKey is required in getCurrentKey");var e=this.getCurrentNode();return e?e[this.nodeKey]:null},setCheckedNodes:function(e,t){if(!this.nodeKey)throw new Error("[Tree] nodeKey is required in setCheckedNodes");this.store.setCheckedNodes(e,t)},setCheckedKeys:function(e,t){if(!this.nodeKey)throw new Error("[Tree] nodeKey is required in setCheckedKeys");this.store.setCheckedKeys(e,t)},setChecked:function(e,t,i){this.store.setChecked(e,t,i)},setCurrentNode:function(e){if(!this.nodeKey)throw new Error("[Tree] nodeKey is required in setCurrentNode");this.store.setUserCurrentNode(e)},setCurrentKey:function(e){if(!this.nodeKey)throw new Error("[Tree] nodeKey is required in setCurrentKey");this.store.setCurrentNodeKey(e)},handleNodeExpand:function(e,t,i){this.broadcast("ElTreeNode","tree-node-expand",t),this.$emit("node-expand",e,t,i)},updateKeyChildren:function(e,t){if(!this.nodeKey)throw new Error("[Tree] nodeKey is required in updateKeyChild");this.store.updateChildren(e,t)},initTabindex:function(){this.treeItems=this.$el.querySelectorAll(".is-focusable[role=treeitem]"),this.checkboxItems=this.$el.querySelectorAll("input[type=checkbox]");var e=this.$el.querySelectorAll(".is-checked[role=treeitem]");if(e.length)return void e[0].setAttribute("tabindex",0);this.treeItems[0]&&this.treeItems[0].setAttribute("tabindex",0)},handelKeydown:function(e){var t=e.target;if(-1!==t.className.indexOf("el-tree-node")){e.preventDefault();var i=e.keyCode;this.treeItems=this.$el.querySelectorAll(".is-focusable[role=treeitem]");var n=this.treeItemArray.indexOf(t),s=void 0;[38,40].indexOf(i)>-1&&(s=38===i?0!==n?n-1:0:n<this.treeItemArray.length-1?n+1:0,this.treeItemArray[s].focus());var r=t.querySelector('[type="checkbox"]');[37,39].indexOf(i)>-1&&t.click(),[13,32].indexOf(i)>-1&&r&&r.click()}}},created:function(){this.isTree=!0,this.store=new r.default({key:this.nodeKey,data:this.data,lazy:this.lazy,props:this.props,load:this.load,currentNodeKey:this.currentNodeKey,checkStrictly:this.checkStrictly,checkDescendants:this.checkDescendants,defaultCheckedKeys:this.defaultCheckedKeys,defaultExpandedKeys:this.defaultExpandedKeys,autoExpandParent:this.autoExpandParent,defaultExpandAll:this.defaultExpandAll,filterNodeMethod:this.filterNodeMethod}),this.root=this.store.root},mounted:function(){this.initTabindex(),this.$el.addEventListener("keydown",this.handelKeydown)},updated:function(){this.treeItems=this.$el.querySelectorAll("[role=treeitem]"),this.checkboxItems=this.$el.querySelectorAll("input[type=checkbox]")}}},function(e,t,i){"use strict";function n(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}t.__esModule=!0;var s="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},r=i(348),a=function(e){return e&&e.__esModule?e:{default:e}}(r),o=i(86),l=function(){function e(t){var i=this;n(this,e),this.currentNode=null,this.currentNodeKey=null;for(var s in t)t.hasOwnProperty(s)&&(this[s]=t[s]);if(this.nodesMap={},this.root=new a.default({data:this.data,store:this}),this.lazy&&this.load){(0,this.load)(this.root,function(e){i.root.doCreateChildren(e),i._initDefaultCheckedNodes()})}else this._initDefaultCheckedNodes()}return e.prototype.filter=function(e){var t=this.filterNodeMethod;!function i(n){var s=n.root?n.root.childNodes:n.childNodes;if(s.forEach(function(n){n.visible=t.call(n,e,n.data,n),i(n)}),!n.visible&&s.length){var r=!0;s.forEach(function(e){e.visible&&(r=!1)}),n.root?n.root.visible=!1===r:n.visible=!1===r}e&&n.visible&&!n.isLeaf&&n.expand()}(this)},e.prototype.setData=function(e){var t=e!==this.root.data;this.root.setData(e),t&&this._initDefaultCheckedNodes()},e.prototype.getNode=function(e){var t="object"!==(void 0===e?"undefined":s(e))?e:(0,o.getNodeKey)(this.key,e);return this.nodesMap[t]},e.prototype.insertBefore=function(e,t){var i=this.getNode(t);i.parent.insertBefore({data:e},i)},e.prototype.insertAfter=function(e,t){var i=this.getNode(t);i.parent.insertAfter({data:e},i)},e.prototype.remove=function(e){var t=this.getNode(e);t&&t.parent.removeChild(t)},e.prototype.append=function(e,t){var i=t?this.getNode(t):this.root;i&&i.insertChild({data:e})},e.prototype._initDefaultCheckedNodes=function(){var e=this,t=this.defaultCheckedKeys||[],i=this.nodesMap;t.forEach(function(t){var n=i[t];n&&n.setChecked(!0,!e.checkStrictly)})},e.prototype._initDefaultCheckedNode=function(e){-1!==(this.defaultCheckedKeys||[]).indexOf(e.key)&&e.setChecked(!0,!this.checkStrictly)},e.prototype.setDefaultCheckedKey=function(e){e!==this.defaultCheckedKeys&&(this.defaultCheckedKeys=e,this._initDefaultCheckedNodes())},e.prototype.registerNode=function(e){this.key&&e&&e.data&&(void 0!==e.key&&(this.nodesMap[e.key]=e))},e.prototype.deregisterNode=function(e){if(this.key&&e&&e.data){for(var t=e.childNodes,i=0,n=t.length;i<n;i++){var s=t[i];this.deregisterNode(s)}delete this.nodesMap[e.key]}},e.prototype.getCheckedNodes=function(){var e=arguments.length>0&&void 0!==arguments[0]&&arguments[0],t=[];return function i(n){(n.root?n.root.childNodes:n.childNodes).forEach(function(n){(!e&&n.checked||e&&n.isLeaf&&n.checked)&&t.push(n.data),i(n)})}(this),t},e.prototype.getCheckedKeys=function(){var e=arguments.length>0&&void 0!==arguments[0]&&arguments[0],t=this.key,i=this._getAllNodes(),n=[];return i.forEach(function(i){(!e||e&&i.isLeaf)&&i.checked&&n.push((i.data||{})[t])}),n},e.prototype._getAllNodes=function(){var e=[],t=this.nodesMap;for(var i in t)t.hasOwnProperty(i)&&e.push(t[i]);return e},e.prototype.updateChildren=function(e,t){var i=this.nodesMap[e];if(i){for(var n=i.childNodes,s=n.length-1;s>=0;s--){var r=n[s];this.remove(r.data)}for(var a=0,o=t.length;a<o;a++){var l=t[a];this.append(l,i.data)}}},e.prototype._setCheckedKeys=function(e){var t=arguments.length>1&&void 0!==arguments[1]&&arguments[1],i=arguments[2],n=this._getAllNodes().sort(function(e,t){return t.level-e.level}),s=Object.create(null),r=Object.keys(i);n.forEach(function(e){return e.setChecked(!1,!1)});for(var a=0,o=n.length;a<o;a++){var l=n[a],u=l.data[e].toString();if(r.indexOf(u)>-1){for(var c=l.parent;c&&c.level>0;)s[c.data[e]]=!0,c=c.parent;l.isLeaf||this.checkStrictly?l.setChecked(!0,!1):(l.setChecked(!0,!0),t&&function(){l.setChecked(!1,!1);!function e(t){t.childNodes.forEach(function(t){t.isLeaf||t.setChecked(!1,!1),e(t)})}(l)}())}else l.checked&&!s[u]&&l.setChecked(!1,!1)}},e.prototype.setCheckedNodes=function(e){var t=arguments.length>1&&void 0!==arguments[1]&&arguments[1],i=this.key,n={};e.forEach(function(e){n[(e||{})[i]]=!0}),this._setCheckedKeys(i,t,n)},e.prototype.setCheckedKeys=function(e){var t=arguments.length>1&&void 0!==arguments[1]&&arguments[1];this.defaultCheckedKeys=e;var i=this.key,n={};e.forEach(function(e){n[e]=!0}),this._setCheckedKeys(i,t,n)},e.prototype.setDefaultExpandedKeys=function(e){var t=this;e=e||[],this.defaultExpandedKeys=e,e.forEach(function(e){var i=t.getNode(e);i&&i.expand(null,t.autoExpandParent)})},e.prototype.setChecked=function(e,t,i){var n=this.getNode(e);n&&n.setChecked(!!t,i)},e.prototype.getCurrentNode=function(){return this.currentNode},e.prototype.setCurrentNode=function(e){this.currentNode=e},e.prototype.setUserCurrentNode=function(e){var t=e[this.key],i=this.nodesMap[t];this.setCurrentNode(i)},e.prototype.setCurrentNodeKey=function(e){var t=this.getNode(e);t&&(this.currentNode=t)},e}();t.default=l},function(e,t,i){"use strict";function n(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}t.__esModule=!0,t.getChildState=void 0;var s="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},r=function(){function e(e,t){for(var i=0;i<t.length;i++){var n=t[i];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(t,i,n){return i&&e(t.prototype,i),n&&e(t,n),t}}(),a=i(12),o=function(e){return e&&e.__esModule?e:{default:e}}(a),l=i(86),u=t.getChildState=function(e){for(var t=!0,i=!0,n=!0,s=0,r=e.length;s<r;s++){var a=e[s];(!0!==a.checked||a.indeterminate)&&(t=!1,a.disabled||(n=!1)),(!1!==a.checked||a.indeterminate)&&(i=!1)}return{all:t,none:i,allWithoutDisable:n,half:!t&&!i}},c=function e(t){if(0!==t.childNodes.length){var i=u(t.childNodes),n=i.all,s=i.none,r=i.half;n?(t.checked=!0,t.indeterminate=!1):r?(t.checked=!1,t.indeterminate=!0):s&&(t.checked=!1,t.indeterminate=!1);var a=t.parent;a&&0!==a.level&&(t.store.checkStrictly||e(a))}},d=function(e,t){var i=e.store.props,n=e.data||{},s=i[t];if("function"==typeof s)return s(n,e);if("string"==typeof s)return n[s];if(void 0===s){var r=n[t];return void 0===r?"":r}},h=0,f=function(){function e(t){n(this,e),this.id=h++,this.text=null,this.checked=!1,this.indeterminate=!1,this.data=null,this.expanded=!1,this.parent=null,this.visible=!0;for(var i in t)t.hasOwnProperty(i)&&(this[i]=t[i]);this.level=0,this.loaded=!1,this.childNodes=[],this.loading=!1,this.parent&&(this.level=this.parent.level+1);var s=this.store;if(!s)throw new Error("[Node]store is required!");s.registerNode(this);var r=s.props;if(r&&void 0!==r.isLeaf){var a=d(this,"isLeaf");"boolean"==typeof a&&(this.isLeafByUser=a)}if(!0!==s.lazy&&this.data?(this.setData(this.data),s.defaultExpandAll&&(this.expanded=!0)):this.level>0&&s.lazy&&s.defaultExpandAll&&this.expand(),this.data){var o=s.defaultExpandedKeys,l=s.key;l&&o&&-1!==o.indexOf(this.key)&&this.expand(null,s.autoExpandParent),l&&void 0!==s.currentNodeKey&&this.key===s.currentNodeKey&&(s.currentNode=this),s.lazy&&s._initDefaultCheckedNode(this),this.updateLeafState()}}return e.prototype.setData=function(e){Array.isArray(e)||(0,l.markNodeData)(this,e),this.data=e,this.childNodes=[];var t=void 0;t=0===this.level&&this.data instanceof Array?this.data:d(this,"children")||[];for(var i=0,n=t.length;i<n;i++)this.insertChild({data:t[i]})},e.prototype.insertChild=function(t,i){if(!t)throw new Error("insertChild error: child is required.");t instanceof e||((0,o.default)(t,{parent:this,store:this.store}),t=new e(t)),t.level=this.level+1,void 0===i||i<0?this.childNodes.push(t):this.childNodes.splice(i,0,t),this.updateLeafState()},e.prototype.insertBefore=function(e,t){var i=void 0;t&&(i=this.childNodes.indexOf(t)),this.insertChild(e,i)},e.prototype.insertAfter=function(e,t){var i=void 0;t&&-1!==(i=this.childNodes.indexOf(t))&&(i+=1),this.insertChild(e,i)},e.prototype.removeChild=function(e){var t=this.childNodes.indexOf(e);t>-1&&(this.store&&this.store.deregisterNode(e),e.parent=null,this.childNodes.splice(t,1)),this.updateLeafState()},e.prototype.removeChildByData=function(e){var t=null;this.childNodes.forEach(function(i){i.data===e&&(t=i)}),t&&this.removeChild(t)},e.prototype.expand=function(e,t){var i=this,n=function(){if(t)for(var n=i.parent;n.level>0;)n.expanded=!0,n=n.parent;i.expanded=!0,e&&e()};this.shouldLoadData()?this.loadData(function(e){e instanceof Array&&(i.checked?i.setChecked(!0,!0):c(i),n())}):n()},e.prototype.doCreateChildren=function(e){var t=this,i=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};e.forEach(function(e){t.insertChild((0,o.default)({data:e},i))})},e.prototype.collapse=function(){this.expanded=!1},e.prototype.shouldLoadData=function(){return!0===this.store.lazy&&this.store.load&&!this.loaded},e.prototype.updateLeafState=function(){if(!0===this.store.lazy&&!0!==this.loaded&&void 0!==this.isLeafByUser)return void(this.isLeaf=this.isLeafByUser);var e=this.childNodes;if(!this.store.lazy||!0===this.store.lazy&&!0===this.loaded)return void(this.isLeaf=!e||0===e.length);this.isLeaf=!1},e.prototype.setChecked=function(e,t,i,n){var r=this;if(this.indeterminate="half"===e,this.checked=!0===e,!this.store.checkStrictly){if(!this.shouldLoadData()||this.store.checkDescendants){var a=function(){var i=u(r.childNodes),s=i.all,a=i.allWithoutDisable;r.isLeaf||s||!a||(r.checked=!1,e=!1);var o=function(){if(t){for(var i=r.childNodes,s=0,a=i.length;s<a;s++){var o=i[s];n=n||!1!==e;var l=o.disabled?o.checked:n;o.setChecked(l,t,!0,n)}var c=u(i),d=c.half,h=c.all;h||(r.checked=h,r.indeterminate=d)}};if(r.shouldLoadData())return r.loadData(function(){o(),c(r)},{checked:!1!==e}),{v:void 0};o()}();if("object"===(void 0===a?"undefined":s(a)))return a.v}var o=this.parent;o&&0!==o.level&&(i||c(o))}},e.prototype.getChildren=function(){var e=this.data;if(!e)return null;var t=this.store.props,i="children";return t&&(i=t.children||"children"),void 0===e[i]&&(e[i]=null),e[i]},e.prototype.updateChildren=function(){var e=this,t=this.getChildren()||[],i=this.childNodes.map(function(e){return e.data}),n={},s=[];t.forEach(function(e,t){e[l.NODE_KEY]?n[e[l.NODE_KEY]]={index:t,data:e}:s.push({index:t,data:e})}),i.forEach(function(t){n[t[l.NODE_KEY]]||e.removeChildByData(t)}),s.forEach(function(t){var i=t.index,n=t.data;e.insertChild({data:n},i)}),this.updateLeafState()},e.prototype.loadData=function(e){var t=this,i=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};if(!0!==this.store.lazy||!this.store.load||this.loaded||this.loading&&!Object.keys(i).length)e&&e.call(this);else{this.loading=!0;var n=function(n){t.loaded=!0,t.loading=!1,t.childNodes=[],t.doCreateChildren(n,i),t.updateLeafState(),e&&e.call(t,n)};this.store.load(this,n)}},r(e,[{key:"label",get:function(){return d(this,"label")}},{key:"icon",get:function(){return d(this,"icon")}},{key:"key",get:function(){var e=this.store.key;return this.data?this.data[e]:null}},{key:"disabled",get:function(){return d(this,"disabled")}}]),e}();t.default=f},function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=i(350),s=i.n(n),r=i(351),a=i(0),o=a(s.a,r.a,!1,null,null,null);t.default=o.exports},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0;var s=i(32),r=n(s),a=i(14),o=n(a),l=i(1),u=n(l);t.default={name:"ElTreeNode",componentName:"ElTreeNode",mixins:[u.default],props:{node:{default:function(){return{}}},props:{},renderContent:Function},components:{ElCollapseTransition:r.default,ElCheckbox:o.default,NodeContent:{props:{node:{required:!0}},render:function(e){var t=this.$parent,i=this.node,n=i.data,s=i.store;return t.renderContent?t.renderContent.call(t._renderProxy,e,{_self:t.tree.$vnode.context,node:i,data:n,store:s}):e("span",{class:"el-tree-node__label"},[this.node.label])}}},data:function(){return{tree:null,expanded:!1,childNodeRendered:!1,showCheckbox:!1,oldChecked:null,oldIndeterminate:null}},watch:{"node.indeterminate":function(e){this.handleSelectChange(this.node.checked,e)},"node.checked":function(e){this.handleSelectChange(e,this.node.indeterminate)},"node.expanded":function(e){var t=this;this.$nextTick(function(){return t.expanded=e}),e&&(this.childNodeRendered=!0)}},methods:{getNodeKey:function(e,t){var i=this.tree.nodeKey;return i&&e?e.data[i]:t},handleSelectChange:function(e,t){this.oldChecked!==e&&this.oldIndeterminate!==t&&this.tree.$emit("check-change",this.node.data,e,t),this.oldChecked=e,this.indeterminate=t},handleClick:function(){var e=this.tree.store;e.setCurrentNode(this.node),this.tree.$emit("current-change",e.currentNode?e.currentNode.data:null,e.currentNode),this.tree.currentNode=this,this.tree.expandOnClickNode&&this.handleExpandIconClick(),this.tree.$emit("node-click",this.node.data,this.node,this)},handleExpandIconClick:function(){this.node.isLeaf||(this.expanded?(this.tree.$emit("node-collapse",this.node.data,this.node,this),this.node.collapse()):(this.node.expand(),this.$emit("node-expand",this.node.data,this.node,this)))},handleCheckChange:function(e,t){this.node.setChecked(t.target.checked,!this.tree.checkStrictly)},handleChildNodeExpand:function(e,t,i){this.broadcast("ElTreeNode","tree-node-expand",t),this.tree.$emit("node-expand",e,t,i)}},created:function(){var e=this,t=this.$parent;t.isTree?this.tree=t:this.tree=t.tree;var i=this.tree;i||console.warn("Can not find node's tree.");var n=i.props||{},s=n.children||"children";this.$watch("node.data."+s,function(){e.node.updateChildren()}),this.showCheckbox=i.showCheckbox,this.node.expanded&&(this.expanded=!0,this.childNodeRendered=!0),this.tree.accordion&&this.$on("tree-node-expand",function(t){e.node!==t&&e.node.collapse()})}}},function(e,t,i){"use strict";var n=function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("div",{directives:[{name:"show",rawName:"v-show",value:e.node.visible,expression:"node.visible"}],staticClass:"el-tree-node",class:{"is-expanded":e.expanded,"is-current":e.tree.store.currentNode===e.node,"is-hidden":!e.node.visible,"is-focusable":!e.node.disabled,"is-checked":!e.node.disabled&&e.node.checked},attrs:{role:"treeitem",tabindex:"-1","aria-expanded":e.expanded,"aria-disabled":e.node.disabled,"aria-checked":e.node.checked},on:{click:function(t){t.stopPropagation(),e.handleClick(t)}}},[i("div",{staticClass:"el-tree-node__content",style:{"padding-left":(e.node.level-1)*e.tree.indent+"px"}},[i("span",{staticClass:"el-tree-node__expand-icon el-icon-caret-right",class:{"is-leaf":e.node.isLeaf,expanded:!e.node.isLeaf&&e.expanded},on:{click:function(t){t.stopPropagation(),e.handleExpandIconClick(t)}}}),e.showCheckbox?i("el-checkbox",{attrs:{indeterminate:e.node.indeterminate,disabled:!!e.node.disabled},on:{change:e.handleCheckChange},nativeOn:{click:function(e){e.stopPropagation()}},model:{value:e.node.checked,callback:function(t){e.$set(e.node,"checked",t)},expression:"node.checked"}}):e._e(),e.node.loading?i("span",{staticClass:"el-tree-node__loading-icon el-icon-loading"}):e._e(),i("node-content",{attrs:{node:e.node}})],1),i("el-collapse-transition",[e.childNodeRendered?i("div",{directives:[{name:"show",rawName:"v-show",value:e.expanded,expression:"expanded"}],staticClass:"el-tree-node__children",attrs:{role:"group","aria-expanded":e.expanded}},e._l(e.node.childNodes,function(t){return i("el-tree-node",{key:e.getNodeKey(t),attrs:{"render-content":e.renderContent,node:t},on:{"node-expand":e.handleChildNodeExpand}})})):e._e()])],1)},s=[],r={render:n,staticRenderFns:s};t.a=r},function(e,t,i){"use strict";var n=function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("div",{staticClass:"el-tree",class:{"el-tree--highlight-current":e.highlightCurrent},attrs:{role:"tree"}},[e._l(e.root.childNodes,function(t){return i("el-tree-node",{key:e.getNodeKey(t),attrs:{node:t,props:e.props,"render-content":e.renderContent},on:{"node-expand":e.handleNodeExpand}})}),e.root.childNodes&&0!==e.root.childNodes.length?e._e():i("div",{staticClass:"el-tree__empty-block"},[i("span",{staticClass:"el-tree__empty-text"},[e._v(e._s(e.emptyText))])])],2)},s=[],r={render:n,staticRenderFns:s};t.a=r},function(e,t,i){"use strict";t.__esModule=!0;var n=i(354),s=function(e){return e&&e.__esModule?e:{default:e}}(n);s.default.install=function(e){e.component(s.default.name,s.default)},t.default=s.default},function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=i(355),s=i.n(n),r=i(356),a=i(0),o=a(s.a,r.a,!1,null,null,null);t.default=o.exports},function(e,t,i){"use strict";t.__esModule=!0;var n={success:"el-icon-success",warning:"el-icon-warning",error:"el-icon-error"};t.default={name:"ElAlert",props:{title:{type:String,default:"",required:!0},description:{type:String,default:""},type:{type:String,default:"info"},closable:{type:Boolean,default:!0},closeText:{type:String,default:""},showIcon:Boolean,center:Boolean},data:function(){return{visible:!0}},methods:{close:function(){this.visible=!1,this.$emit("close")}},computed:{typeClass:function(){return"el-alert--"+this.type},iconClass:function(){return n[this.type]||"el-icon-info"},isBigIcon:function(){return this.description||this.$slots.default?"is-big":""},isBoldTitle:function(){return this.description||this.$slots.default?"is-bold":""}}}},function(e,t,i){"use strict";var n=function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("transition",{attrs:{name:"el-alert-fade"}},[i("div",{directives:[{name:"show",rawName:"v-show",value:e.visible,expression:"visible"}],staticClass:"el-alert",class:[e.typeClass,e.center?"is-center":""],attrs:{role:"alert"}},[e.showIcon?i("i",{staticClass:"el-alert__icon",class:[e.iconClass,e.isBigIcon]}):e._e(),i("div",{staticClass:"el-alert__content"},[e.title?i("span",{staticClass:"el-alert__title",class:[e.isBoldTitle]},[e._v(e._s(e.title))]):e._e(),e._t("default",[e.description?i("p",{staticClass:"el-alert__description"},[e._v(e._s(e.description))]):e._e()]),i("i",{directives:[{name:"show",rawName:"v-show",value:e.closable,expression:"closable"}],staticClass:"el-alert__closebtn",class:{"is-customed":""!==e.closeText,"el-icon-close":""===e.closeText},on:{click:function(t){e.close()}}},[e._v(e._s(e.closeText))])],2)])])},s=[],r={render:n,staticRenderFns:s};t.a=r},function(e,t,i){"use strict";t.__esModule=!0;var n=i(358),s=function(e){return e&&e.__esModule?e:{default:e}}(n);t.default=s.default},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0;var s=i(2),r=n(s),a=i(359),o=n(a),l=i(21),u=i(34),c=r.default.extend(o.default),d=void 0,h=[],f=1,p=function e(t){if(!r.default.prototype.$isServer){t=t||{};var i=t.onClose,n="notification_"+f++,s=t.position||"top-right";t.onClose=function(){e.close(n,i)},d=new c({data:t}),(0,u.isVNode)(t.message)&&(d.$slots.default=[t.message],t.message=""),d.id=n,d.vm=d.$mount(),document.body.appendChild(d.vm.$el),d.vm.visible=!0,d.dom=d.vm.$el,d.dom.style.zIndex=l.PopupManager.nextZIndex();var a=t.offset||0;return h.filter(function(e){return e.position===s}).forEach(function(e){a+=e.$el.offsetHeight+16}),a+=16,d.verticalOffset=a,h.push(d),d.vm}};["success","warning","info","error"].forEach(function(e){p[e]=function(t){return("string"==typeof t||(0,u.isVNode)(t))&&(t={message:t}),t.type=e,p(t)}}),p.close=function(e,t){var i=-1,n=h.length,s=h.filter(function(t,n){return t.id===e&&(i=n,!0)})[0];if(s&&("function"==typeof t&&t(s),h.splice(i,1),!(n<=1)))for(var r=s.position,a=s.dom.offsetHeight,o=i;o<n-1;o++)h[o].position===r&&(h[o].dom.style[s.verticalProperty]=parseInt(h[o].dom.style[s.verticalProperty],10)-a-16+"px")},t.default=p},function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=i(360),s=i.n(n),r=i(361),a=i(0),o=a(s.a,r.a,!1,null,null,null);t.default=o.exports},function(e,t,i){"use strict";t.__esModule=!0;var n={success:"success",info:"info",warning:"warning",error:"error"};t.default={data:function(){return{visible:!1,title:"",message:"",duration:4500,type:"",showClose:!0,customClass:"",iconClass:"",onClose:null,onClick:null,closed:!1,verticalOffset:0,timer:null,dangerouslyUseHTMLString:!1,position:"top-right"}},computed:{typeClass:function(){return this.type&&n[this.type]?"el-icon-"+n[this.type]:""},horizontalClass:function(){return this.position.indexOf("right")>-1?"right":"left"},verticalProperty:function(){return/^top-/.test(this.position)?"top":"bottom"},positionStyle:function(){var e;return e={},e[this.verticalProperty]=this.verticalOffset+"px",e}},watch:{closed:function(e){e&&(this.visible=!1,this.$el.addEventListener("transitionend",this.destroyElement))}},methods:{destroyElement:function(){this.$el.removeEventListener("transitionend",this.destroyElement),this.$destroy(!0),this.$el.parentNode.removeChild(this.$el)},click:function(){"function"==typeof this.onClick&&this.onClick()},close:function(){this.closed=!0,"function"==typeof this.onClose&&this.onClose()},clearTimer:function(){clearTimeout(this.timer)},startTimer:function(){var e=this;this.duration>0&&(this.timer=setTimeout(function(){e.closed||e.close()},this.duration))},keydown:function(e){46===e.keyCode||8===e.keyCode?this.clearTimer():27===e.keyCode?this.closed||this.close():this.startTimer()}},mounted:function(){var e=this;this.duration>0&&(this.timer=setTimeout(function(){e.closed||e.close()},this.duration)),document.addEventListener("keydown",this.keydown)},beforeDestroy:function(){document.removeEventListener("keydown",this.keydown)}}},function(e,t,i){"use strict";var n=function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("transition",{attrs:{name:"el-notification-fade"}},[i("div",{directives:[{name:"show",rawName:"v-show",value:e.visible,expression:"visible"}],class:["el-notification",e.customClass,e.horizontalClass],style:e.positionStyle,attrs:{role:"alert"},on:{mouseenter:function(t){e.clearTimer()},mouseleave:function(t){e.startTimer()},click:e.click}},[e.type||e.iconClass?i("i",{staticClass:"el-notification__icon",class:[e.typeClass,e.iconClass]}):e._e(),i("div",{staticClass:"el-notification__group",class:{"is-with-icon":e.typeClass||e.iconClass}},[i("h2",{staticClass:"el-notification__title",domProps:{textContent:e._s(e.title)}}),i("div",{staticClass:"el-notification__content"},[e._t("default",[e.dangerouslyUseHTMLString?i("p",{domProps:{innerHTML:e._s(e.message)}}):i("p",[e._v(e._s(e.message))])])],2),e.showClose?i("div",{staticClass:"el-notification__closeBtn el-icon-close",on:{click:function(t){t.stopPropagation(),e.close(t)}}}):e._e()])])])},s=[],r={render:n,staticRenderFns:s};t.a=r},function(e,t,i){"use strict";t.__esModule=!0;var n=i(363),s=function(e){return e&&e.__esModule?e:{default:e}}(n);s.default.install=function(e){e.component(s.default.name,s.default)},t.default=s.default},function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=i(364),s=i.n(n),r=i(368),a=i(0),o=a(s.a,r.a,!1,null,null,null);t.default=o.exports},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0;var s=i(70),r=n(s),a=i(365),o=n(a),l=i(1),u=n(l);t.default={name:"ElSlider",mixins:[u.default],props:{min:{type:Number,default:0},max:{type:Number,default:100},step:{type:Number,default:1},value:{type:[Number,Array],default:0},showInput:{type:Boolean,default:!1},showInputControls:{type:Boolean,default:!0},showStops:{type:Boolean,default:!1},showTooltip:{type:Boolean,default:!0},formatTooltip:Function,disabled:{type:Boolean,default:!1},range:{type:Boolean,default:!1},vertical:{type:Boolean,default:!1},height:{type:String},debounce:{type:Number,default:300},label:{type:String}},components:{ElInputNumber:r.default,SliderButton:o.default},data:function(){return{firstValue:null,secondValue:null,oldValue:null,dragging:!1,sliderSize:1}},watch:{value:function(e,t){this.dragging||Array.isArray(e)&&Array.isArray(t)&&e.every(function(e,i){return e===t[i]})||this.setValues()},dragging:function(e){e||this.setValues()},firstValue:function(e){this.range?this.$emit("input",[this.minValue,this.maxValue]):this.$emit("input",e)},secondValue:function(){this.range&&this.$emit("input",[this.minValue,this.maxValue])},min:function(){this.setValues()},max:function(){this.setValues()}},methods:{valueChanged:function(){var e=this;return this.range?![this.minValue,this.maxValue].every(function(t,i){return t===e.oldValue[i]}):this.value!==this.oldValue},setValues:function(){var e=this.value;this.range&&Array.isArray(e)?e[1]<this.min?this.$emit("input",[this.min,this.min]):e[0]>this.max?this.$emit("input",[this.max,this.max]):e[0]<this.min?this.$emit("input",[this.min,e[1]]):e[1]>this.max?this.$emit("input",[e[0],this.max]):(this.firstValue=e[0],this.secondValue=e[1],this.valueChanged()&&(this.dispatch("ElFormItem","el.form.change",[this.minValue,this.maxValue]),this.oldValue=e.slice())):this.range||"number"!=typeof e||isNaN(e)||(e<this.min?this.$emit("input",this.min):e>this.max?this.$emit("input",this.max):(this.firstValue=e,this.valueChanged()&&(this.dispatch("ElFormItem","el.form.change",e),this.oldValue=e)))},setPosition:function(e){var t=this.min+e*(this.max-this.min)/100;if(!this.range)return void this.$refs.button1.setPosition(e);var i=void 0;i=Math.abs(this.minValue-t)<Math.abs(this.maxValue-t)?this.firstValue<this.secondValue?"button1":"button2":this.firstValue>this.secondValue?"button1":"button2",this.$refs[i].setPosition(e)},onSliderClick:function(e){if(!this.disabled&&!this.dragging){if(this.resetSize(),this.vertical){var t=this.$refs.slider.getBoundingClientRect().bottom;this.setPosition((t-e.clientY)/this.sliderSize*100)}else{var i=this.$refs.slider.getBoundingClientRect().left;this.setPosition((e.clientX-i)/this.sliderSize*100)}this.emitChange()}},resetSize:function(){this.$refs.slider&&(this.sliderSize=this.$refs.slider["client"+(this.vertical?"Height":"Width")])},emitChange:function(){var e=this;this.$nextTick(function(){e.$emit("change",e.range?[e.minValue,e.maxValue]:e.value)})}},computed:{stops:function(){var e=this;if(0===this.step)return[];for(var t=(this.max-this.min)/this.step,i=100*this.step/(this.max-this.min),n=[],s=1;s<t;s++)n.push(s*i);return this.range?n.filter(function(t){return t<100*(e.minValue-e.min)/(e.max-e.min)||t>100*(e.maxValue-e.min)/(e.max-e.min)}):n.filter(function(t){return t>100*(e.firstValue-e.min)/(e.max-e.min)})},minValue:function(){return Math.min(this.firstValue,this.secondValue)},maxValue:function(){return Math.max(this.firstValue,this.secondValue)},barSize:function(){return this.range?100*(this.maxValue-this.minValue)/(this.max-this.min)+"%":100*(this.firstValue-this.min)/(this.max-this.min)+"%"},barStart:function(){return this.range?100*(this.minValue-this.min)/(this.max-this.min)+"%":"0%"},precision:function(){var e=[this.min,this.max,this.step].map(function(e){var t=(""+e).split(".")[1];return t?t.length:0});return Math.max.apply(null,e)},runwayStyle:function(){return this.vertical?{height:this.height}:{}},barStyle:function(){return this.vertical?{height:this.barSize,bottom:this.barStart}:{width:this.barSize,left:this.barStart}}},mounted:function(){var e=void 0;this.range?(Array.isArray(this.value)?(this.firstValue=Math.max(this.min,this.value[0]),this.secondValue=Math.min(this.max,this.value[1])):(this.firstValue=this.min,this.secondValue=this.max),this.oldValue=[this.firstValue,this.secondValue],e=this.firstValue+"-"+this.secondValue):("number"!=typeof this.value||isNaN(this.value)?this.firstValue=this.min:this.firstValue=Math.min(this.max,Math.max(this.min,this.value)),this.oldValue=this.firstValue,e=this.firstValue),this.$el.setAttribute("aria-valuetext",e),this.$el.setAttribute("aria-label",this.label?this.label:"slider between "+this.min+" and "+this.max),this.resetSize(),window.addEventListener("resize",this.resetSize)},beforeDestroy:function(){window.removeEventListener("resize",this.resetSize)}}},function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=i(366),s=i.n(n),r=i(367),a=i(0),o=a(s.a,r.a,!1,null,null,null);t.default=o.exports},function(e,t,i){"use strict";t.__esModule=!0;var n=i(33),s=function(e){return e&&e.__esModule?e:{default:e}}(n);t.default={name:"ElSliderButton",components:{ElTooltip:s.default},props:{value:{type:Number,default:0},vertical:{type:Boolean,default:!1}},data:function(){return{hovering:!1,dragging:!1,isClick:!1,startX:0,currentX:0,startY:0,currentY:0,startPosition:0,newPosition:null,oldValue:this.value}},computed:{disabled:function(){return this.$parent.disabled},max:function(){return this.$parent.max},min:function(){return this.$parent.min},step:function(){return this.$parent.step},showTooltip:function(){return this.$parent.showTooltip},precision:function(){return this.$parent.precision},currentPosition:function(){return(this.value-this.min)/(this.max-this.min)*100+"%"},enableFormat:function(){return this.$parent.formatTooltip instanceof Function},formatValue:function(){return this.enableFormat&&this.$parent.formatTooltip(this.value)||this.value},wrapperStyle:function(){return this.vertical?{bottom:this.currentPosition}:{left:this.currentPosition}}},watch:{dragging:function(e){this.$parent.dragging=e}},methods:{displayTooltip:function(){this.$refs.tooltip&&(this.$refs.tooltip.showPopper=!0)},hideTooltip:function(){this.$refs.tooltip&&(this.$refs.tooltip.showPopper=!1)},handleMouseEnter:function(){this.hovering=!0,this.displayTooltip()},handleMouseLeave:function(){this.hovering=!1,this.hideTooltip()},onButtonDown:function(e){this.disabled||(e.preventDefault(),this.onDragStart(e),window.addEventListener("mousemove",this.onDragging),window.addEventListener("mouseup",this.onDragEnd),window.addEventListener("contextmenu",this.onDragEnd))},onLeftKeyDown:function(){this.disabled||(this.newPosition=parseFloat(this.currentPosition)-this.step/(this.max-this.min)*100,this.setPosition(this.newPosition))},onRightKeyDown:function(){this.disabled||(this.newPosition=parseFloat(this.currentPosition)+this.step/(this.max-this.min)*100,this.setPosition(this.newPosition))},onDragStart:function(e){this.dragging=!0,this.isClick=!0,this.vertical?this.startY=e.clientY:this.startX=e.clientX,this.startPosition=parseFloat(this.currentPosition),this.newPosition=this.startPosition},onDragging:function(e){if(this.dragging){this.isClick=!1,this.displayTooltip(),this.$parent.resetSize();var t=0;this.vertical?(this.currentY=e.clientY,t=(this.startY-this.currentY)/this.$parent.sliderSize*100):(this.currentX=e.clientX,t=(this.currentX-this.startX)/this.$parent.sliderSize*100),this.newPosition=this.startPosition+t,this.setPosition(this.newPosition)}},onDragEnd:function(){var e=this;this.dragging&&(setTimeout(function(){e.dragging=!1,e.hideTooltip(),e.isClick||(e.setPosition(e.newPosition),e.$parent.emitChange())},0),window.removeEventListener("mousemove",this.onDragging),window.removeEventListener("mouseup",this.onDragEnd),window.removeEventListener("contextmenu",this.onDragEnd))},setPosition:function(e){var t=this;if(null!==e){e<0?e=0:e>100&&(e=100);var i=100/((this.max-this.min)/this.step),n=Math.round(e/i),s=n*i*(this.max-this.min)*.01+this.min;s=parseFloat(s.toFixed(this.precision)),this.$emit("input",s),this.$nextTick(function(){t.$refs.tooltip&&t.$refs.tooltip.updatePopper()}),this.dragging||this.value===this.oldValue||(this.oldValue=this.value)}}}}},function(e,t,i){"use strict";var n=function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("div",{ref:"button",staticClass:"el-slider__button-wrapper",class:{hover:e.hovering,dragging:e.dragging},style:e.wrapperStyle,attrs:{tabindex:"0"},on:{mouseenter:e.handleMouseEnter,mouseleave:e.handleMouseLeave,mousedown:e.onButtonDown,focus:e.handleMouseEnter,blur:e.handleMouseLeave,keydown:[function(t){return"button"in t||!e._k(t.keyCode,"left",37,t.key)?"button"in t&&0!==t.button?null:void e.onLeftKeyDown(t):null},function(t){return"button"in t||!e._k(t.keyCode,"right",39,t.key)?"button"in t&&2!==t.button?null:void e.onRightKeyDown(t):null},function(t){if(!("button"in t)&&e._k(t.keyCode,"down",40,t.key))return null;t.preventDefault(),e.onLeftKeyDown(t)},function(t){if(!("button"in t)&&e._k(t.keyCode,"up",38,t.key))return null;t.preventDefault(),e.onRightKeyDown(t)}]}},[i("el-tooltip",{ref:"tooltip",attrs:{placement:"top",disabled:!e.showTooltip}},[i("span",{attrs:{slot:"content"},slot:"content"},[e._v(e._s(e.formatValue))]),i("div",{staticClass:"el-slider__button",class:{hover:e.hovering,dragging:e.dragging}})])],1)},s=[],r={render:n,staticRenderFns:s};t.a=r},function(e,t,i){"use strict";var n=function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("div",{staticClass:"el-slider",class:{"is-vertical":e.vertical,"el-slider--with-input":e.showInput},attrs:{role:"slider","aria-valuemin":e.min,"aria-valuemax":e.max,"aria-orientation":e.vertical?"vertical":"horizontal","aria-disabled":e.disabled}},[e.showInput&&!e.range?i("el-input-number",{ref:"input",staticClass:"el-slider__input",attrs:{step:e.step,disabled:e.disabled,controls:e.showInputControls,min:e.min,max:e.max,debounce:e.debounce,size:"small"},on:{change:function(t){e.$nextTick(e.emitChange)}},model:{value:e.firstValue,callback:function(t){e.firstValue=t},expression:"firstValue"}}):e._e(),i("div",{ref:"slider",staticClass:"el-slider__runway",class:{"show-input":e.showInput,disabled:e.disabled},style:e.runwayStyle,on:{click:e.onSliderClick}},[i("div",{staticClass:"el-slider__bar",style:e.barStyle}),i("slider-button",{ref:"button1",attrs:{vertical:e.vertical},model:{value:e.firstValue,callback:function(t){e.firstValue=t},expression:"firstValue"}}),e.range?i("slider-button",{ref:"button2",attrs:{vertical:e.vertical},model:{value:e.secondValue,callback:function(t){e.secondValue=t},expression:"secondValue"}}):e._e(),e._l(e.stops,function(t){return e.showStops?i("div",{staticClass:"el-slider__stop",style:e.vertical?{bottom:t+"%"}:{left:t+"%"}}):e._e()})],2)],1)},s=[],r={render:n,staticRenderFns:s};t.a=r},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0;var s=i(370),r=n(s),a=i(373),o=n(a);t.default={install:function(e){e.use(r.default),e.prototype.$loading=o.default},directive:r.default,service:o.default}},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}var s=i(2),r=n(s),a=i(87),o=n(a),l=i(4),u=r.default.extend(o.default);t.install=function(e){if(!e.prototype.$isServer){var t=function(t,n){n.value?e.nextTick(function(){n.modifiers.fullscreen?(t.originalPosition=(0,l.getStyle)(document.body,"position"),t.originalOverflow=(0,l.getStyle)(document.body,"overflow"),(0,l.addClass)(t.mask,"is-fullscreen"),i(document.body,t,n)):((0,l.removeClass)(t.mask,"is-fullscreen"),n.modifiers.body?(t.originalPosition=(0,l.getStyle)(document.body,"position"),["top","left"].forEach(function(e){var i="top"===e?"scrollTop":"scrollLeft";t.maskStyle[e]=t.getBoundingClientRect()[e]+document.body[i]+document.documentElement[i]+"px"}),["height","width"].forEach(function(e){t.maskStyle[e]=t.getBoundingClientRect()[e]+"px"}),i(document.body,t,n)):(t.originalPosition=(0,l.getStyle)(t,"position"),i(t,t,n)))}):t.domVisible&&(t.instance.$on("after-leave",function(e){t.domVisible=!1;var i=n.modifiers.fullscreen||n.modifiers.body?document.body:t;(0,l.removeClass)(i,"el-loading-parent--relative"),(0,l.removeClass)(i,"el-loading-parent--hidden")}),t.instance.visible=!1)},i=function(t,i,n){i.domVisible||"none"===(0,l.getStyle)(i,"display")||"hidden"===(0,l.getStyle)(i,"visibility")||(Object.keys(i.maskStyle).forEach(function(e){i.mask.style[e]=i.maskStyle[e]}),"absolute"!==i.originalPosition&&"fixed"!==i.originalPosition&&(0,l.addClass)(t,"el-loading-parent--relative"),n.modifiers.fullscreen&&n.modifiers.lock&&(0,l.addClass)(t,"el-loading-parent--hidden"),i.domVisible=!0,t.appendChild(i.mask),e.nextTick(function(){i.instance.visible=!0}),i.domInserted=!0)};e.directive("loading",{bind:function(e,i,n){var s=e.getAttribute("element-loading-text"),r=e.getAttribute("element-loading-spinner"),a=e.getAttribute("element-loading-background"),o=n.context,l=new u({el:document.createElement("div"),data:{text:o&&o[s]||s,spinner:o&&o[r]||r,background:o&&o[a]||a,fullscreen:!!i.modifiers.fullscreen}});e.instance=l,e.mask=l.$el,e.maskStyle={},t(e,i)},update:function(e,i){e.instance.setText(e.getAttribute("element-loading-text")),i.oldValue!==i.value&&t(e,i)},unbind:function(e,t){e.domInserted&&e.mask&&e.mask.parentNode&&e.mask.parentNode.removeChild(e.mask)}})}}},function(e,t,i){"use strict";t.__esModule=!0,t.default={data:function(){return{text:null,spinner:null,background:null,fullscreen:!0,visible:!1,customClass:""}},methods:{handleAfterLeave:function(){this.$emit("after-leave")},setText:function(e){this.text=e}}}},function(e,t,i){"use strict";var n=function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("transition",{attrs:{name:"el-loading-fade"},on:{"after-leave":e.handleAfterLeave}},[i("div",{directives:[{name:"show",rawName:"v-show",value:e.visible,expression:"visible"}],staticClass:"el-loading-mask",class:[e.customClass,{"is-fullscreen":e.fullscreen}],style:{backgroundColor:e.background||""}},[i("div",{staticClass:"el-loading-spinner"},[e.spinner?i("i",{class:e.spinner}):i("svg",{staticClass:"circular",attrs:{viewBox:"25 25 50 50"}},[i("circle",{staticClass:"path",attrs:{cx:"50",cy:"50",r:"20",fill:"none"}})]),e.text?i("p",{staticClass:"el-loading-text"},[e._v(e._s(e.text))]):e._e()])])])},s=[],r={render:n,staticRenderFns:s};t.a=r},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0;var s=i(2),r=n(s),a=i(87),o=n(a),l=i(4),u=i(12),c=n(u),d=r.default.extend(o.default),h={text:null,fullscreen:!0,body:!1,lock:!1,customClass:""},f=void 0;d.prototype.originalPosition="",d.prototype.originalOverflow="",d.prototype.close=function(){var e=this;this.fullscreen&&(f=void 0),this.$on("after-leave",function(t){var i=e.fullscreen||e.body?document.body:e.target;(0,l.removeClass)(i,"el-loading-parent--relative"),(0,l.removeClass)(i,"el-loading-parent--hidden"),e.$el&&e.$el.parentNode&&e.$el.parentNode.removeChild(e.$el),e.$destroy()}),this.visible=!1};var p=function(e,t,i){var n={};e.fullscreen?(i.originalPosition=(0,l.getStyle)(document.body,"position"),i.originalOverflow=(0,l.getStyle)(document.body,"overflow")):e.body?(i.originalPosition=(0,l.getStyle)(document.body,"position"),["top","left"].forEach(function(t){var i="top"===t?"scrollTop":"scrollLeft";n[t]=e.target.getBoundingClientRect()[t]+document.body[i]+document.documentElement[i]+"px"}),["height","width"].forEach(function(t){n[t]=e.target.getBoundingClientRect()[t]+"px"})):i.originalPosition=(0,l.getStyle)(t,"position"),Object.keys(n).forEach(function(e){i.$el.style[e]=n[e]})},m=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};if(!r.default.prototype.$isServer){if(e=(0,c.default)({},h,e),"string"==typeof e.target&&(e.target=document.querySelector(e.target)),e.target=e.target||document.body,e.target!==document.body?e.fullscreen=!1:e.body=!0,e.fullscreen&&f)return f;var t=e.body?document.body:e.target,i=new d({el:document.createElement("div"),data:e});return p(e,t,i),"absolute"!==i.originalPosition&&"fixed"!==i.originalPosition&&(0,l.addClass)(t,"el-loading-parent--relative"),e.fullscreen&&e.lock&&(0,l.addClass)(t,"el-loading-parent--hidden"),t.appendChild(i.$el),r.default.nextTick(function(){i.visible=!0}),e.fullscreen&&(f=i),i}};t.default=m},function(e,t,i){"use strict";t.__esModule=!0;var n=i(375),s=function(e){return e&&e.__esModule?e:{default:e}}(n);s.default.install=function(e){e.component(s.default.name,s.default)},t.default=s.default},function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=i(376),s=i.n(n),r=i(377),a=i(0),o=a(s.a,r.a,!1,null,null,null);t.default=o.exports},function(e,t,i){"use strict";t.__esModule=!0,t.default={name:"ElIcon",props:{name:String}}},function(e,t,i){"use strict";var n=function(){var e=this,t=e.$createElement;return(e._self._c||t)("i",{class:"el-icon-"+e.name})},s=[],r={render:n,staticRenderFns:s};t.a=r},function(e,t,i){"use strict";t.__esModule=!0;var n=i(379),s=function(e){return e&&e.__esModule?e:{default:e}}(n);s.default.install=function(e){e.component(s.default.name,s.default)},t.default=s.default},function(e,t,i){"use strict";t.__esModule=!0,t.default={name:"ElRow",componentName:"ElRow",props:{tag:{type:String,default:"div"},gutter:Number,type:String,justify:{type:String,default:"start"},align:{type:String,default:"top"}},computed:{style:function(){var e={};return this.gutter&&(e.marginLeft="-"+this.gutter/2+"px",e.marginRight=e.marginLeft),e}},render:function(e){return e(this.tag,{class:["el-row","start"!==this.justify?"is-justify-"+this.justify:"","top"!==this.align?"is-align-"+this.align:"",{"el-row--flex":"flex"===this.type}],style:this.style},this.$slots.default)}}},function(e,t,i){"use strict";t.__esModule=!0;var n=i(381),s=function(e){return e&&e.__esModule?e:{default:e}}(n);s.default.install=function(e){e.component(s.default.name,s.default)},t.default=s.default},function(e,t,i){"use strict";t.__esModule=!0;var n="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e};t.default={name:"ElCol",props:{span:{type:Number,default:24},tag:{type:String,default:"div"},offset:Number,pull:Number,push:Number,xs:[Number,Object],sm:[Number,Object],md:[Number,Object],lg:[Number,Object],xl:[Number,Object]},computed:{gutter:function(){for(var e=this.$parent;e&&"ElRow"!==e.$options.componentName;)e=e.$parent;return e?e.gutter:0}},render:function(e){var t=this,i=[],s={};return this.gutter&&(s.paddingLeft=this.gutter/2+"px",s.paddingRight=s.paddingLeft),["span","offset","pull","push"].forEach(function(e){(t[e]||0===t[e])&&i.push("span"!==e?"el-col-"+e+"-"+t[e]:"el-col-"+t[e])}),["xs","sm","md","lg","xl"].forEach(function(e){"number"==typeof t[e]?i.push("el-col-"+e+"-"+t[e]):"object"===n(t[e])&&function(){var n=t[e];Object.keys(n).forEach(function(t){i.push("span"!==t?"el-col-"+e+"-"+t+"-"+n[t]:"el-col-"+e+"-"+n[t])})}()}),e(this.tag,{class:["el-col",i],style:s},this.$slots.default)}}},function(e,t,i){"use strict";t.__esModule=!0;var n=i(383),s=function(e){return e&&e.__esModule?e:{default:e}}(n);s.default.install=function(e){e.component(s.default.name,s.default)},t.default=s.default},function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=i(384),s=i.n(n),r=i(0),a=r(s.a,null,!1,null,null,null);t.default=a.exports},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}function s(){}t.__esModule=!0;var r=i(385),a=n(r),o=i(391),l=n(o),u=i(396),c=n(u),d=i(63),h=n(d),f=i(9),p=n(f);t.default={name:"ElUpload",mixins:[p.default],components:{ElProgress:h.default,UploadList:a.default,Upload:l.default,IframeUpload:c.default},provide:{uploader:void 0},props:{action:{type:String,required:!0},headers:{type:Object,default:function(){return{}}},data:Object,multiple:Boolean,name:{type:String,default:"file"},drag:Boolean,dragger:Boolean,withCredentials:Boolean,showFileList:{type:Boolean,default:!0},accept:String,type:{type:String,default:"select"},beforeUpload:Function,onRemove:{type:Function,default:s},onChange:{type:Function,default:s},onPreview:{type:Function},onSuccess:{type:Function,default:s},onProgress:{type:Function,default:s},onError:{type:Function,default:s},fileList:{type:Array,default:function(){return[]}},autoUpload:{type:Boolean,default:!0},listType:{type:String,default:"text"},httpRequest:Function,disabled:Boolean,limit:Number,onExceed:{type:Function,default:s}},data:function(){return{uploadFiles:[],dragOver:!1,draging:!1,tempIndex:1}},watch:{fileList:{immediate:!0,handler:function(e){var t=this;this.uploadFiles=e.map(function(e){return e.uid=e.uid||Date.now()+t.tempIndex++,e.status="success",e})}}},methods:{handleStart:function(e){e.uid=Date.now()+this.tempIndex++;var t={status:"ready",name:e.name,size:e.size,percentage:0,uid:e.uid,raw:e};try{t.url=URL.createObjectURL(e)}catch(e){return void console.error(e)}this.uploadFiles.push(t),this.onChange(t,this.uploadFiles)},handleProgress:function(e,t){var i=this.getFile(t);this.onProgress(e,i,this.uploadFiles),i.status="uploading",i.percentage=e.percent||0},handleSuccess:function(e,t){var i=this.getFile(t);i&&(i.status="success",i.response=e,this.onSuccess(e,i,this.uploadFiles),this.onChange(i,this.uploadFiles))},handleError:function(e,t){var i=this.getFile(t),n=this.uploadFiles;i.status="fail",n.splice(n.indexOf(i),1),this.onError(e,i,this.uploadFiles),this.onChange(i,this.uploadFiles)},handleRemove:function(e,t){t&&(e=this.getFile(t)),this.abort(e);var i=this.uploadFiles;i.splice(i.indexOf(e),1),this.onRemove(e,i)},getFile:function(e){var t=this.uploadFiles,i=void 0;return t.every(function(t){return!(i=e.uid===t.uid?t:null)}),i},abort:function(e){this.$refs["upload-inner"].abort(e)},clearFiles:function(){this.uploadFiles=[]},submit:function(){var e=this;this.uploadFiles.filter(function(e){return"ready"===e.status}).forEach(function(t){e.$refs["upload-inner"].upload(t.raw)})},getMigratingConfig:function(){return{props:{"default-file-list":"default-file-list is renamed to file-list.","show-upload-list":"show-upload-list is renamed to show-file-list.","thumbnail-mode":"thumbnail-mode has been deprecated, you can implement the same effect according to this case: http://element.eleme.io/#/zh-CN/component/upload#yong-hu-tou-xiang-shang-chuan"}}}},render:function(e){var t=void 0;this.showFileList&&(t=e(a.default,{attrs:{disabled:this.disabled,listType:this.listType,files:this.uploadFiles,handlePreview:this.onPreview},on:{remove:this.handleRemove}},[]));var i={props:{type:this.type,drag:this.drag,action:this.action,multiple:this.multiple,"before-upload":this.beforeUpload,"with-credentials":this.withCredentials,headers:this.headers,name:this.name,data:this.data,accept:this.accept,fileList:this.uploadFiles,autoUpload:this.autoUpload,listType:this.listType,disabled:this.disabled,limit:this.limit,"on-exceed":this.onExceed,"on-start":this.handleStart,"on-progress":this.handleProgress,"on-success":this.handleSuccess,"on-error":this.handleError,"on-preview":this.onPreview,"on-remove":this.handleRemove,"http-request":this.httpRequest},ref:"upload-inner"},n=this.$slots.trigger||this.$slots.default,s="undefined"!=typeof FormData||this.$isServer?e("upload",i,[n]):e("iframeUpload",i,[n]);return e("div",null,["picture-card"===this.listType?t:"",this.$slots.trigger?[s,this.$slots.default]:s,this.$slots.tip,"picture-card"!==this.listType?t:""])}}},function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=i(386),s=i.n(n),r=i(390),a=i(0),o=a(s.a,r.a,!1,null,null,null);t.default=o.exports},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0;var s=i(5),r=n(s),a=i(63),o=n(a);t.default={mixins:[r.default],data:function(){return{focusing:!1}},components:{ElProgress:o.default},props:{files:{type:Array,default:function(){return[]}},disabled:{type:Boolean,default:!1},handlePreview:Function,listType:String},methods:{parsePercentage:function(e){return parseInt(e,10)},handleClick:function(e){this.handlePreview&&this.handlePreview(e)}}}},function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=i(388),s=i.n(n),r=i(389),a=i(0),o=a(s.a,r.a,!1,null,null,null);t.default=o.exports},function(e,t,i){"use strict";t.__esModule=!0,t.default={name:"ElProgress",props:{type:{type:String,default:"line",validator:function(e){return["line","circle"].indexOf(e)>-1}},percentage:{type:Number,default:0,required:!0,validator:function(e){return e>=0&&e<=100}},status:{type:String},strokeWidth:{type:Number,default:6},textInside:{type:Boolean,default:!1},width:{type:Number,default:126},showText:{type:Boolean,default:!0}},computed:{barStyle:function(){var e={};return e.width=this.percentage+"%",e},relativeStrokeWidth:function(){return(this.strokeWidth/this.width*100).toFixed(1)},trackPath:function(){var e=parseInt(50-parseFloat(this.relativeStrokeWidth)/2,10);return"M 50 50 m 0 -"+e+" a "+e+" "+e+" 0 1 1 0 "+2*e+" a "+e+" "+e+" 0 1 1 0 -"+2*e},perimeter:function(){var e=50-parseFloat(this.relativeStrokeWidth)/2;return 2*Math.PI*e},circlePathStyle:function(){var e=this.perimeter;return{strokeDasharray:e+"px,"+e+"px",strokeDashoffset:(1-this.percentage/100)*e+"px",transition:"stroke-dashoffset 0.6s ease 0s, stroke 0.6s ease"}},stroke:function(){var e;switch(this.status){case"success":e="#13ce66";break;case"exception":e="#ff4949";break;default:e="#20a0ff"}return e},iconClass:function(){return"line"===this.type?"success"===this.status?"el-icon-circle-check":"el-icon-circle-cross":"success"===this.status?"el-icon-check":"el-icon-close"},progressTextSize:function(){return"line"===this.type?12+.4*this.strokeWidth:.111111*this.width+2}}}},function(e,t,i){"use strict";var n=function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("div",{staticClass:"el-progress",class:["el-progress--"+e.type,e.status?"is-"+e.status:"",{"el-progress--without-text":!e.showText,"el-progress--text-inside":e.textInside}],attrs:{role:"progressbar","aria-valuenow":e.percentage,"aria-valuemin":"0","aria-valuemax":"100"}},["line"===e.type?i("div",{staticClass:"el-progress-bar"},[i("div",{staticClass:"el-progress-bar__outer",style:{height:e.strokeWidth+"px"}},[i("div",{staticClass:"el-progress-bar__inner",style:e.barStyle},[e.showText&&e.textInside?i("div",{staticClass:"el-progress-bar__innerText"},[e._v(e._s(e.percentage)+"%")]):e._e()])])]):i("div",{staticClass:"el-progress-circle",style:{height:e.width+"px",width:e.width+"px"}},[i("svg",{attrs:{viewBox:"0 0 100 100"}},[i("path",{staticClass:"el-progress-circle__track",attrs:{d:e.trackPath,stroke:"#e5e9f2","stroke-width":e.relativeStrokeWidth,fill:"none"}}),i("path",{staticClass:"el-progress-circle__path",style:e.circlePathStyle,attrs:{d:e.trackPath,"stroke-linecap":"round",stroke:e.stroke,"stroke-width":e.relativeStrokeWidth,fill:"none"}})])]),e.showText&&!e.textInside?i("div",{staticClass:"el-progress__text",style:{fontSize:e.progressTextSize+"px"}},[e.status?i("i",{class:e.iconClass}):[e._v(e._s(e.percentage)+"%")]],2):e._e()])},s=[],r={render:n,staticRenderFns:s};t.a=r},function(e,t,i){"use strict";var n=function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("transition-group",{class:["el-upload-list","el-upload-list--"+e.listType,{"is-disabled":e.disabled}],attrs:{tag:"ul",name:"el-list"}},e._l(e.files,function(t,n){return i("li",{key:n,class:["el-upload-list__item","is-"+t.status,e.focusing?"focusing":""],attrs:{tabindex:"0"},on:{keydown:function(i){if(!("button"in i)&&e._k(i.keyCode,"delete",[8,46],i.key))return null;!e.disabled&&e.$emit("remove",t)},focus:function(t){e.focusing=!0},blur:function(t){e.focusing=!1},click:function(t){e.focusing=!1}}},["uploading"!==t.status&&["picture-card","picture"].indexOf(e.listType)>-1?i("img",{staticClass:"el-upload-list__item-thumbnail",attrs:{src:t.url,alt:""}}):e._e(),i("a",{staticClass:"el-upload-list__item-name",on:{click:function(i){e.handleClick(t)}}},[i("i",{staticClass:"el-icon-document"}),e._v(e._s(t.name)+"\n    ")]),i("label",{staticClass:"el-upload-list__item-status-label"},[i("i",{class:{"el-icon-upload-success":!0,"el-icon-circle-check":"text"===e.listType,"el-icon-check":["picture-card","picture"].indexOf(e.listType)>-1}})]),e.disabled?e._e():i("i",{staticClass:"el-icon-close",on:{click:function(i){e.$emit("remove",t)}}}),e.disabled?e._e():i("i",{staticClass:"el-icon-close-tip"},[e._v(e._s(e.t("el.upload.deleteTip")))]),"uploading"===t.status?i("el-progress",{attrs:{type:"picture-card"===e.listType?"circle":"line","stroke-width":"picture-card"===e.listType?6:2,percentage:e.parsePercentage(t.percentage)}}):e._e(),"picture-card"===e.listType?i("span",{staticClass:"el-upload-list__item-actions"},[e.handlePreview&&"picture-card"===e.listType?i("span",{staticClass:"el-upload-list__item-preview",on:{click:function(i){e.handlePreview(t)}}},[i("i",{staticClass:"el-icon-zoom-in"})]):e._e(),e.disabled?e._e():i("span",{staticClass:"el-upload-list__item-delete",on:{click:function(i){e.$emit("remove",t)}}},[i("i",{staticClass:"el-icon-delete"})])]):e._e()],1)}))},s=[],r={render:n,staticRenderFns:s};t.a=r},function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=i(392),s=i.n(n),r=i(0),a=r(s.a,null,!1,null,null,null);t.default=a.exports},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0;var s=i(88),r=n(s),a=i(393),o=n(a),l=i(89),u=n(l);t.default={inject:["uploader"],components:{UploadDragger:u.default},props:{type:String,action:{type:String,required:!0},name:{type:String,default:"file"},data:Object,headers:Object,withCredentials:Boolean,multiple:Boolean,accept:String,onStart:Function,onProgress:Function,onSuccess:Function,onError:Function,beforeUpload:Function,drag:Boolean,onPreview:{type:Function,default:function(){}},onRemove:{type:Function,default:function(){}},fileList:Array,autoUpload:Boolean,listType:String,httpRequest:{type:Function,default:o.default},disabled:Boolean,limit:Number,onExceed:Function},data:function(){return{mouseover:!1,reqs:{}}},methods:{isImage:function(e){return-1!==e.indexOf("image")},handleChange:function(e){var t=e.target.files;t&&this.uploadFiles(t)},uploadFiles:function(e){var t=this;if(this.limit&&this.fileList.length+e.length>this.limit)return void(this.onExceed&&this.onExceed(e,this.fileList));var i=Array.prototype.slice.call(e);this.multiple||(i=i.slice(0,1)),0!==i.length&&i.forEach(function(e){t.onStart(e),t.autoUpload&&t.upload(e)})},upload:function(e,t){var i=this;if(this.$refs.input.value=null,!this.beforeUpload)return this.post(e);var n=this.beforeUpload(e);n&&n.then?n.then(function(t){var n=Object.prototype.toString.call(t);"[object File]"===n||"[object Blob]"===n?i.post(t):i.post(e)},function(){i.onRemove(null,e)}):!1!==n?this.post(e):this.onRemove(null,e)},abort:function(e){var t=this.reqs;if(e){var i=e;e.uid&&(i=e.uid),t[i]&&t[i].abort()}else Object.keys(t).forEach(function(e){t[e]&&t[e].abort(),delete t[e]})},post:function(e){var t=this,i=e.uid,n={headers:this.headers,withCredentials:this.withCredentials,file:e,data:this.data,filename:this.name,action:this.action,onProgress:function(i){t.onProgress(i,e)},onSuccess:function(n){t.onSuccess(n,e),delete t.reqs[i]},onError:function(n){t.onError(n,e),delete t.reqs[i]}},s=this.httpRequest(n);this.reqs[i]=s,s&&s.then&&s.then(n.onSuccess,n.onError)},handleClick:function(){this.disabled||(this.$refs.input.value=null,this.$refs.input.click())},handleKeydown:function(e){13!==e.keyCode&&32!==e.keyCode||this.handleClick()}},render:function(e){var t=this.handleClick,i=this.drag,n=this.name,s=this.handleChange,a=this.multiple,o=this.accept,l=this.listType,u=this.uploadFiles,c=this.disabled,d=this.handleKeydown,h={class:{"el-upload":!0},on:{click:t,keydown:d}};return h.class["el-upload--"+l]=!0,e("div",(0,r.default)([h,{attrs:{tabindex:"0"}}]),[i?e("upload-dragger",{attrs:{disabled:c},on:{file:u}},[this.$slots.default]):this.$slots.default,e("input",{class:"el-upload__input",attrs:{type:"file",name:n,multiple:a,accept:o},ref:"input",on:{change:s}},[])])}}},function(e,t,i){"use strict";function n(e,t,i){var n=void 0;n=i.response?""+(i.response.error||i.response):i.responseText?""+i.responseText:"fail to post "+e+" "+i.status;var s=new Error(n);return s.status=i.status,s.method="post",s.url=e,s}function s(e){var t=e.responseText||e.response;if(!t)return t;try{return JSON.parse(t)}catch(e){return t}}function r(e){if("undefined"!=typeof XMLHttpRequest){var t=new XMLHttpRequest,i=e.action;t.upload&&(t.upload.onprogress=function(t){t.total>0&&(t.percent=t.loaded/t.total*100),e.onProgress(t)});var r=new FormData;e.data&&Object.keys(e.data).forEach(function(t){r.append(t,e.data[t])}),r.append(e.filename,e.file),t.onerror=function(t){e.onError(t)},t.onload=function(){if(t.status<200||t.status>=300)return e.onError(n(i,e,t));e.onSuccess(s(t))},t.open("post",i,!0),e.withCredentials&&"withCredentials"in t&&(t.withCredentials=!0);var a=e.headers||{};for(var o in a)a.hasOwnProperty(o)&&null!==a[o]&&t.setRequestHeader(o,a[o]);return t.send(r),t}}t.__esModule=!0,t.default=r},function(e,t,i){"use strict";t.__esModule=!0,t.default={name:"ElUploadDrag",props:{disabled:Boolean},data:function(){return{dragover:!1}},methods:{onDragover:function(){this.disabled||(this.dragover=!0)},onDrop:function(e){this.disabled||(this.dragover=!1,this.$emit("file",e.dataTransfer.files))}}}},function(e,t,i){"use strict";var n=function(){var e=this,t=e.$createElement;return(e._self._c||t)("div",{staticClass:"el-upload-dragger",class:{"is-dragover":e.dragover},on:{drop:function(t){t.preventDefault(),e.onDrop(t)},dragover:function(t){t.preventDefault(),e.onDragover(t)},dragleave:function(t){t.preventDefault(),e.dragover=!1}}},[e._t("default")],2)},s=[],r={render:n,staticRenderFns:s};t.a=r},function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=i(397),s=i.n(n),r=i(0),a=r(s.a,null,!1,null,null,null);t.default=a.exports},function(e,t,i){"use strict";t.__esModule=!0;var n=i(89),s=function(e){return e&&e.__esModule?e:{default:e}}(n);t.default={components:{UploadDragger:s.default},props:{type:String,data:{},action:{type:String,required:!0},name:{type:String,default:"file"},withCredentials:Boolean,accept:String,onStart:Function,onProgress:Function,onSuccess:Function,onError:Function,beforeUpload:Function,onPreview:{type:Function,default:function(){}},onRemove:{type:Function,default:function(){}},drag:Boolean,listType:String,disabled:Boolean,limit:Number,onExceed:Function},data:function(){return{mouseover:!1,domain:"",file:null,submitting:!1}},methods:{isImage:function(e){return-1!==e.indexOf("image")},handleClick:function(){this.disabled||this.$refs.input.click()},handleChange:function(e){var t=e.target.value;t&&this.uploadFiles(t)},uploadFiles:function(e){if(this.limit&&this.$parent.uploadFiles.length+e.length>this.limit)return void(this.onExceed&&this.onExceed(this.fileList));if(!this.submitting){this.submitting=!0,this.file=e,this.onStart(e);var t=this.getFormNode(),i=this.getFormDataNode(),n=this.data;"function"==typeof n&&(n=n(e));var s=[];for(var r in n)n.hasOwnProperty(r)&&s.push('<input name="'+r+'" value="'+n[r]+'"/>');i.innerHTML=s.join(""),t.submit(),i.innerHTML=""}},getFormNode:function(){return this.$refs.form},getFormDataNode:function(){return this.$refs.data}},created:function(){this.frameName="frame-"+Date.now()},mounted:function(){var e=this;!this.$isServer&&window.addEventListener("message",function(t){if(e.file){var i=new URL(e.action).origin;if(t.origin===i){var n=t.data;"success"===n.result?e.onSuccess(n,e.file):"failed"===n.result&&e.onError(n,e.file),e.submitting=!1,e.file=null}}},!1)},render:function(e){var t=this.drag,i=this.uploadFiles,n=this.listType,s=this.frameName,r=this.disabled,a={"el-upload":!0};return a["el-upload--"+n]=!0,e("div",{class:a,on:{click:this.handleClick},nativeOn:{drop:this.onDrop,dragover:this.handleDragover,dragleave:this.handleDragleave}},[e("iframe",{on:{load:this.onload},ref:"iframe",attrs:{name:s}},[]),e("form",{ref:"form",attrs:{action:this.action,target:s,enctype:"multipart/form-data",method:"POST"}},[e("input",{class:"el-upload__input",attrs:{type:"file",name:"file",accept:this.accept},ref:"input",on:{change:this.handleChange}},[]),e("input",{attrs:{type:"hidden",name:"documentDomain",value:this.$isServer?"":document.domain}},[]),e("span",{ref:"data"},[])]),t?e("upload-dragger",{on:{file:i},attrs:{disabled:r}},[this.$slots.default]):this.$slots.default])}}},function(e,t,i){"use strict";t.__esModule=!0;var n=i(399),s=function(e){return e&&e.__esModule?e:{default:e}}(n);s.default.install=function(e){e.component(s.default.name,s.default)},t.default=s.default},function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=i(400),s=i.n(n),r=i(401),a=i(0),o=a(s.a,r.a,!1,null,null,null);t.default=o.exports},function(e,t,i){"use strict";t.__esModule=!0,t.default={name:"ElSpinner",props:{type:String,radius:{type:Number,default:100},strokeWidth:{type:Number,default:5},strokeColor:{type:String,default:"#efefef"}}}},function(e,t,i){"use strict";var n=function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("span",{staticClass:"el-spinner"},[i("svg",{staticClass:"el-spinner-inner",style:{width:e.radius/2+"px",height:e.radius/2+"px"},attrs:{viewBox:"0 0 50 50"}},[i("circle",{staticClass:"path",attrs:{cx:"25",cy:"25",r:"20",fill:"none",stroke:e.strokeColor,"stroke-width":e.strokeWidth}})])])},s=[],r={render:n,staticRenderFns:s};t.a=r},function(e,t,i){"use strict";t.__esModule=!0;var n=i(403),s=function(e){return e&&e.__esModule?e:{default:e}}(n);t.default=s.default},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0;var s=i(2),r=n(s),a=i(404),o=n(a),l=i(21),u=i(34),c=r.default.extend(o.default),d=void 0,h=[],f=1,p=function e(t){if(!r.default.prototype.$isServer){t=t||{},"string"==typeof t&&(t={message:t});var i=t.onClose,n="message_"+f++;return t.onClose=function(){e.close(n,i)},d=new c({data:t}),d.id=n,(0,u.isVNode)(d.message)&&(d.$slots.default=[d.message],d.message=null),d.vm=d.$mount(),document.body.appendChild(d.vm.$el),d.vm.visible=!0,d.dom=d.vm.$el,d.dom.style.zIndex=l.PopupManager.nextZIndex(),h.push(d),d.vm}};["success","warning","info","error"].forEach(function(e){p[e]=function(t){return"string"==typeof t&&(t={message:t}),t.type=e,p(t)}}),p.close=function(e,t){for(var i=0,n=h.length;i<n;i++)if(e===h[i].id){"function"==typeof t&&t(h[i]),h.splice(i,1);break}},p.closeAll=function(){for(var e=h.length-1;e>=0;e--)h[e].close()},t.default=p},function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=i(405),s=i.n(n),r=i(406),a=i(0),o=a(s.a,r.a,!1,null,null,null);t.default=o.exports},function(e,t,i){"use strict";t.__esModule=!0;var n={success:"success",info:"info",warning:"warning",error:"error"};t.default={data:function(){return{visible:!1,message:"",duration:3e3,type:"info",iconClass:"",customClass:"",onClose:null,showClose:!1,closed:!1,timer:null,dangerouslyUseHTMLString:!1,center:!1}},computed:{iconWrapClass:function(){var e=["el-message__icon"];return this.type&&!this.iconClass&&e.push("el-message__icon--"+this.type),e},typeClass:function(){return this.type&&!this.iconClass?"el-message__icon el-icon-"+n[this.type]:""}},watch:{closed:function(e){e&&(this.visible=!1,this.$el.addEventListener("transitionend",this.destroyElement))}},methods:{destroyElement:function(){this.$el.removeEventListener("transitionend",this.destroyElement),this.$destroy(!0),this.$el.parentNode.removeChild(this.$el)},close:function(){this.closed=!0,"function"==typeof this.onClose&&this.onClose(this)},clearTimer:function(){clearTimeout(this.timer)},startTimer:function(){var e=this;this.duration>0&&(this.timer=setTimeout(function(){e.closed||e.close()},this.duration))},keydown:function(e){27===e.keyCode&&(this.closed||this.close())}},mounted:function(){this.startTimer(),document.addEventListener("keydown",this.keydown)},beforeDestroy:function(){document.removeEventListener("keydown",this.keydown)}}},function(e,t,i){"use strict";var n=function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("transition",{attrs:{name:"el-message-fade"}},[i("div",{directives:[{name:"show",rawName:"v-show",value:e.visible,expression:"visible"}],class:["el-message",e.type&&!e.iconClass?"el-message--"+e.type:"",e.center?"is-center":"",e.customClass],attrs:{role:"alert"},on:{mouseenter:e.clearTimer,mouseleave:e.startTimer}},[e.iconClass?i("i",{class:e.iconClass}):i("i",{class:e.typeClass}),e._t("default",[e.dangerouslyUseHTMLString?i("p",{staticClass:"el-message__content",domProps:{innerHTML:e._s(e.message)}}):i("p",{staticClass:"el-message__content"},[e._v(e._s(e.message))])]),e.showClose?i("i",{staticClass:"el-message__closeBtn el-icon-close",on:{click:e.close}}):e._e()],2)])},s=[],r={render:n,staticRenderFns:s};t.a=r},function(e,t,i){"use strict";t.__esModule=!0;var n=i(408),s=function(e){return e&&e.__esModule?e:{default:e}}(n);s.default.install=function(e){e.component(s.default.name,s.default)},t.default=s.default},function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=i(409),s=i.n(n),r=i(410),a=i(0),o=a(s.a,r.a,!1,null,null,null);t.default=o.exports},function(e,t,i){"use strict";t.__esModule=!0,t.default={name:"ElBadge",props:{value:{},max:Number,isDot:Boolean,hidden:Boolean},computed:{content:function(){if(!this.isDot){var e=this.value,t=this.max;return"number"==typeof e&&"number"==typeof t&&t<e?t+"+":e}}}}},function(e,t,i){"use strict";var n=function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("div",{staticClass:"el-badge"},[e._t("default"),i("transition",{attrs:{name:"el-zoom-in-center"}},[i("sup",{directives:[{name:"show",rawName:"v-show",value:!e.hidden&&(e.content||e.isDot),expression:"!hidden && ( content || isDot )"}],staticClass:"el-badge__content",class:{"is-fixed":e.$slots.default,"is-dot":e.isDot},domProps:{textContent:e._s(e.content)}})])],2)},s=[],r={render:n,staticRenderFns:s};t.a=r},function(e,t,i){"use strict";t.__esModule=!0;var n=i(412),s=function(e){return e&&e.__esModule?e:{default:e}}(n);s.default.install=function(e){e.component(s.default.name,s.default)},t.default=s.default},function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=i(413),s=i.n(n),r=i(414),a=i(0),o=a(s.a,r.a,!1,null,null,null);t.default=o.exports},function(e,t,i){"use strict";t.__esModule=!0,t.default={name:"ElCard",props:["header","bodyStyle"]}},function(e,t,i){"use strict";var n=function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("div",{staticClass:"el-card"},[e.$slots.header||e.header?i("div",{staticClass:"el-card__header"},[e._t("header",[e._v(e._s(e.header))])],2):e._e(),i("div",{staticClass:"el-card__body",style:e.bodyStyle},[e._t("default")],2)])},s=[],r={render:n,staticRenderFns:s};t.a=r},function(e,t,i){"use strict";t.__esModule=!0;var n=i(416),s=function(e){return e&&e.__esModule?e:{default:e}}(n);s.default.install=function(e){e.component(s.default.name,s.default)},t.default=s.default},function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=i(417),s=i.n(n),r=i(418),a=i(0),o=a(s.a,r.a,!1,null,null,null);t.default=o.exports},function(e,t,i){"use strict";t.__esModule=!0;var n=i(4),s=i(9),r=function(e){return e&&e.__esModule?e:{default:e}}(s);t.default={name:"ElRate",mixins:[r.default],data:function(){return{classMap:{},pointerAtLeftHalf:!0,currentValue:this.value,hoverIndex:-1}},props:{value:{type:Number,default:0},lowThreshold:{type:Number,default:2},highThreshold:{type:Number,default:4},max:{type:Number,default:5},colors:{type:Array,default:function(){return["#F7BA2A","#F7BA2A","#F7BA2A"]}},voidColor:{type:String,default:"#C6D1DE"},disabledVoidColor:{type:String,default:"#EFF2F7"},iconClasses:{type:Array,default:function(){return["el-icon-star-on","el-icon-star-on","el-icon-star-on"]}},voidIconClass:{type:String,default:"el-icon-star-off"},disabledVoidIconClass:{type:String,default:"el-icon-star-on"},disabled:{type:Boolean,default:!1},allowHalf:{type:Boolean,default:!1},showText:{type:Boolean,default:!1},showScore:{type:Boolean,default:!1},textColor:{type:String,default:"#1f2d3d"},texts:{type:Array,default:function(){return["极差","失望","一般","满意","惊喜"]}},scoreTemplate:{type:String,default:"{value}"}},computed:{text:function(){var e="";return this.showScore?e=this.scoreTemplate.replace(/\{\s*value\s*\}/,this.disabled?this.value:this.currentValue):this.showText&&(e=this.texts[Math.ceil(this.currentValue)-1]),e},decimalStyle:function(){var e="";return this.disabled&&(e=(this.valueDecimal<50?0:50)+"%"),this.allowHalf&&(e="50%"),{color:this.activeColor,width:e}},valueDecimal:function(){return 100*this.value-100*Math.floor(this.value)},decimalIconClass:function(){return this.getValueFromMap(this.value,this.classMap)},voidClass:function(){return this.disabled?this.classMap.disabledVoidClass:this.classMap.voidClass},activeClass:function(){return this.getValueFromMap(this.currentValue,this.classMap)},colorMap:function(){return{lowColor:this.colors[0],mediumColor:this.colors[1],highColor:this.colors[2],voidColor:this.voidColor,disabledVoidColor:this.disabledVoidColor}},activeColor:function(){return this.getValueFromMap(this.currentValue,this.colorMap)},classes:function(){var e=[],t=0,i=this.currentValue;for(this.allowHalf&&this.currentValue!==Math.floor(this.currentValue)&&i--;t<i;t++)e.push(this.activeClass);for(;t<this.max;t++)e.push(this.voidClass);return e}},watch:{value:function(e){this.currentValue=e,this.pointerAtLeftHalf=this.value!==Math.floor(this.value)}},methods:{getMigratingConfig:function(){return{props:{"text-template":"text-template is renamed to score-template."}}},getValueFromMap:function(e,t){return e<=this.lowThreshold?t.lowColor||t.lowClass:e>=this.highThreshold?t.highColor||t.highClass:t.mediumColor||t.mediumClass},showDecimalIcon:function(e){var t=this.disabled&&this.valueDecimal>0&&e-1<this.value&&e>this.value,i=this.allowHalf&&this.pointerAtLeftHalf&&e-.5<=this.currentValue&&e>this.currentValue;return t||i},getIconStyle:function(e){var t=this.disabled?this.colorMap.disabledVoidColor:this.colorMap.voidColor;return{color:e<=this.currentValue?this.activeColor:t}},selectValue:function(e){this.disabled||(this.allowHalf&&this.pointerAtLeftHalf?(this.$emit("input",this.currentValue),this.$emit("change",this.currentValue)):(this.$emit("input",e),this.$emit("change",e)))},handelKey:function(e){var t=this.currentValue,i=e.keyCode;38===i||39===i?(this.allowHalf?t+=.5:t+=1,e.stopPropagation(),e.preventDefault()):37!==i&&40!==i||(this.allowHalf?t-=.5:t-=1,e.stopPropagation(),e.preventDefault()),t=t<0?0:t,t=t>this.max?this.max:t,this.$emit("input",t),this.$emit("change",t)},setCurrentValue:function(e,t){if(!this.disabled){if(this.allowHalf){var i=t.target;(0,n.hasClass)(i,"el-rate__item")&&(i=i.querySelector(".el-rate__icon")),(0,n.hasClass)(i,"el-rate__decimal")&&(i=i.parentNode),this.pointerAtLeftHalf=2*t.offsetX<=i.clientWidth,this.currentValue=this.pointerAtLeftHalf?e-.5:e}else this.currentValue=e;this.hoverIndex=e}},resetCurrentValue:function(){this.disabled||(this.allowHalf&&(this.pointerAtLeftHalf=this.value!==Math.floor(this.value)),this.currentValue=this.value,this.hoverIndex=-1)}},created:function(){this.value||this.$emit("input",0),this.classMap={lowClass:this.iconClasses[0],mediumClass:this.iconClasses[1],highClass:this.iconClasses[2],voidClass:this.voidIconClass,disabledVoidClass:this.disabledVoidIconClass}}}},function(e,t,i){"use strict";var n=function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("div",{staticClass:"el-rate",attrs:{role:"slider","aria-valuenow":e.currentValue,"aria-valuetext":e.text,"aria-valuemin":"0","aria-valuemax":e.max,tabindex:"0"},on:{keydown:e.handelKey}},[e._l(e.max,function(t){return i("span",{staticClass:"el-rate__item",style:{cursor:e.disabled?"auto":"pointer"},on:{mousemove:function(i){e.setCurrentValue(t,i)},mouseleave:e.resetCurrentValue,click:function(i){e.selectValue(t)}}},[i("i",{staticClass:"el-rate__icon",class:[e.classes[t-1],{hover:e.hoverIndex===t}],style:e.getIconStyle(t)},[e.showDecimalIcon(t)?i("i",{staticClass:"el-rate__decimal",class:e.decimalIconClass,style:e.decimalStyle}):e._e()])])}),e.showText||e.showScore?i("span",{staticClass:"el-rate__text",style:{color:e.textColor}},[e._v(e._s(e.text))]):e._e()],2)},s=[],r={render:n,staticRenderFns:s};t.a=r},function(e,t,i){"use strict";t.__esModule=!0;var n=i(420),s=function(e){return e&&e.__esModule?e:{default:e}}(n);s.default.install=function(e){e.component(s.default.name,s.default)},t.default=s.default},function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=i(421),s=i.n(n),r=i(422),a=i(0),o=a(s.a,r.a,!1,null,null,null);t.default=o.exports},function(e,t,i){"use strict";t.__esModule=!0;var n=i(9),s=function(e){return e&&e.__esModule?e:{default:e}}(n);t.default={name:"ElSteps",mixins:[s.default],props:{space:[Number,String],active:Number,direction:{type:String,default:"horizontal"},alignCenter:Boolean,simple:Boolean,finishStatus:{type:String,default:"finish"},processStatus:{type:String,default:"process"}},data:function(){return{steps:[],stepOffset:0}},methods:{getMigratingConfig:function(){return{props:{center:"center is removed."}}}},watch:{active:function(e,t){this.$emit("change",e,t)},steps:function(e){e.forEach(function(e,t){e.index=t})}}}},function(e,t,i){"use strict";var n=function(){var e=this,t=e.$createElement;return(e._self._c||t)("div",{staticClass:"el-steps",class:[!e.simple&&"el-steps--"+e.direction,e.simple&&"el-steps--simple"]},[e._t("default")],2)},s=[],r={render:n,staticRenderFns:s};t.a=r},function(e,t,i){"use strict";t.__esModule=!0;var n=i(424),s=function(e){return e&&e.__esModule?e:{default:e}}(n);s.default.install=function(e){e.component(s.default.name,s.default)},t.default=s.default},function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=i(425),s=i.n(n),r=i(426),a=i(0),o=a(s.a,r.a,!1,null,null,null);t.default=o.exports},function(e,t,i){"use strict";t.__esModule=!0,t.default={name:"ElStep",props:{title:String,icon:String,description:String,status:String},data:function(){return{index:-1,lineStyle:{},internalStatus:""}},beforeCreate:function(){this.$parent.steps.push(this)},beforeDestroy:function(){var e=this.$parent.steps,t=e.indexOf(this);t>=0&&e.splice(t,1)},computed:{currentStatus:function(){return this.status||this.internalStatus},prevStatus:function(){var e=this.$parent.steps[this.index-1];return e?e.currentStatus:"wait"},isCenter:function(){return this.$parent.alignCenter},isVertical:function(){return"vertical"===this.$parent.direction},isSimple:function(){return this.$parent.simple},isLast:function(){var e=this.$parent;return e.steps[e.steps.length-1]===this},stepsCount:function(){return this.$parent.steps.length},space:function(){var e=this.isSimple,t=this.$parent.space;return e?"":t},style:function(){var e={},t=this.$parent,i=t.steps.length,n="number"==typeof this.space?this.space+"px":this.space?this.space:100/(i-1)+"%";return e.flexBasis=n,this.isVertical?e:(this.isLast?e.maxWidth=100/this.stepsCount+"%":e.marginRight=-this.$parent.stepOffset+"px",e)}},methods:{updateStatus:function(e){var t=this.$parent.$children[this.index-1];e>this.index?this.internalStatus=this.$parent.finishStatus:e===this.index&&"error"!==this.prevStatus?this.internalStatus=this.$parent.processStatus:this.internalStatus="wait",t&&t.calcProgress(this.internalStatus)},calcProgress:function(e){var t=100,i={};i.transitionDelay=150*this.index+"ms",e===this.$parent.processStatus?(this.currentStatus,t=0):"wait"===e&&(t=0,i.transitionDelay=-150*this.index+"ms"),i.borderWidth=t?"1px":0,"vertical"===this.$parent.direction?i.height=t+"%":i.width=t+"%",this.lineStyle=i}},mounted:function(){var e=this,t=this.$watch("index",function(i){e.$watch("$parent.active",e.updateStatus,{immediate:!0}),t()})}}},function(e,t,i){"use strict";var n=function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("div",{staticClass:"el-step",class:[!e.isSimple&&"is-"+e.$parent.direction,e.isSimple&&"is-simple",e.isLast&&!e.space&&!e.isCenter&&"is-flex",e.isCenter&&!e.isVertical&&!e.isSimple&&"is-center"],style:e.style},[i("div",{staticClass:"el-step__head",class:"is-"+e.currentStatus},[i("div",{staticClass:"el-step__line",style:e.isLast?"":{marginRight:e.$parent.stepOffset+"px"}},[i("i",{staticClass:"el-step__line-inner",style:e.lineStyle})]),i("div",{staticClass:"el-step__icon",class:"is-"+(e.icon?"icon":"text")},["success"!==e.currentStatus&&"error"!==e.currentStatus?e._t("icon",[e.icon?i("i",{staticClass:"el-step__icon-inner",class:[e.icon]}):e._e(),e.icon||e.isSimple?e._e():i("div",{staticClass:"el-step__icon-inner"},[e._v(e._s(e.index+1))])]):i("i",{staticClass:"el-step__icon-inner is-status",class:["el-icon-"+("success"===e.currentStatus?"check":"close")]})],2)]),i("div",{staticClass:"el-step__main"},[i("div",{ref:"title",staticClass:"el-step__title",class:["is-"+e.currentStatus]},[e._t("title",[e._v(e._s(e.title))])],2),e.isSimple?i("div",{staticClass:"el-step__arrow"}):i("div",{staticClass:"el-step__description",class:["is-"+e.currentStatus]},[e._t("description",[e._v(e._s(e.description))])],2)])])},s=[],r={render:n,staticRenderFns:s};t.a=r},function(e,t,i){"use strict";t.__esModule=!0;var n=i(428),s=function(e){return e&&e.__esModule?e:{default:e}}(n);s.default.install=function(e){e.component(s.default.name,s.default)},t.default=s.default},function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=i(429),s=i.n(n),r=i(430),a=i(0),o=a(s.a,r.a,!1,null,null,null);t.default=o.exports},function(e,t,i){"use strict";t.__esModule=!0;var n=i(43),s=function(e){return e&&e.__esModule?e:{default:e}}(n),r=i(28);t.default={name:"ElCarousel",props:{initialIndex:{type:Number,default:0},height:String,trigger:{type:String,default:"hover"},autoplay:{type:Boolean,default:!0},interval:{type:Number,default:3e3},indicatorPosition:String,indicator:{type:Boolean,default:!0},arrow:{type:String,default:"hover"},type:String},data:function(){return{items:[],activeIndex:-1,containerWidth:0,timer:null,hover:!1}},computed:{hasLabel:function(){return this.items.some(function(e){return e.label.toString().length>0})}},watch:{items:function(e){e.length>0&&this.setActiveItem(this.initialIndex)},activeIndex:function(e,t){this.resetItemPosition(t),this.$emit("change",e,t)},autoplay:function(e){e?this.startTimer():this.pauseTimer()}},methods:{handleMouseEnter:function(){this.hover=!0,this.pauseTimer()},handleMouseLeave:function(){this.hover=!1,this.startTimer()},itemInStage:function(e,t){var i=this.items.length;return t===i-1&&e.inStage&&this.items[0].active||e.inStage&&this.items[t+1]&&this.items[t+1].active?"left":!!(0===t&&e.inStage&&this.items[i-1].active||e.inStage&&this.items[t-1]&&this.items[t-1].active)&&"right"},handleButtonEnter:function(e){var t=this;this.items.forEach(function(i,n){e===t.itemInStage(i,n)&&(i.hover=!0)})},handleButtonLeave:function(){this.items.forEach(function(e){e.hover=!1})},updateItems:function(){this.items=this.$children.filter(function(e){return"ElCarouselItem"===e.$options.name})},resetItemPosition:function(e){var t=this;this.items.forEach(function(i,n){i.translateItem(n,t.activeIndex,e)})},playSlides:function(){this.activeIndex<this.items.length-1?this.activeIndex++:this.activeIndex=0},pauseTimer:function(){clearInterval(this.timer)},startTimer:function(){this.interval<=0||!this.autoplay||(this.timer=setInterval(this.playSlides,this.interval))},setActiveItem:function(e){if("string"==typeof e){var t=this.items.filter(function(t){return t.name===e});t.length>0&&(e=this.items.indexOf(t[0]))}if(e=Number(e),!isNaN(e)&&e===Math.floor(e)){var i=this.items.length;this.activeIndex=e<0?i-1:e>=i?0:e}},prev:function(){this.setActiveItem(this.activeIndex-1)},next:function(){this.setActiveItem(this.activeIndex+1)},handleIndicatorClick:function(e){this.activeIndex=e},handleIndicatorHover:function(e){"hover"===this.trigger&&e!==this.activeIndex&&(this.activeIndex=e)}},created:function(){var e=this;this.throttledArrowClick=(0,s.default)(300,!0,function(t){e.setActiveItem(t)}),this.throttledIndicatorHover=(0,s.default)(300,function(t){e.handleIndicatorHover(t)})},mounted:function(){var e=this;this.updateItems(),this.$nextTick(function(){(0,r.addResizeListener)(e.$el,e.resetItemPosition),e.initialIndex<e.items.length&&e.initialIndex>=0&&(e.activeIndex=e.initialIndex),e.startTimer()})},beforeDestroy:function(){this.$el&&(0,r.removeResizeListener)(this.$el,this.resetItemPosition)}}},function(e,t,i){"use strict";var n=function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("div",{staticClass:"el-carousel",class:{"el-carousel--card":"card"===e.type},on:{mouseenter:function(t){t.stopPropagation(),e.handleMouseEnter(t)},mouseleave:function(t){t.stopPropagation(),e.handleMouseLeave(t)}}},[i("div",{staticClass:"el-carousel__container",style:{height:e.height}},[i("transition",{attrs:{name:"carousel-arrow-left"}},["never"!==e.arrow?i("button",{directives:[{name:"show",rawName:"v-show",value:"always"===e.arrow||e.hover,expression:"arrow === 'always' || hover"}],staticClass:"el-carousel__arrow el-carousel__arrow--left",on:{mouseenter:function(t){e.handleButtonEnter("left")},mouseleave:e.handleButtonLeave,click:function(t){t.stopPropagation(),e.throttledArrowClick(e.activeIndex-1)}}},[i("i",{staticClass:"el-icon-arrow-left"})]):e._e()]),i("transition",{attrs:{name:"carousel-arrow-right"}},["never"!==e.arrow?i("button",{directives:[{name:"show",rawName:"v-show",value:"always"===e.arrow||e.hover,expression:"arrow === 'always' || hover"}],staticClass:"el-carousel__arrow el-carousel__arrow--right",on:{mouseenter:function(t){e.handleButtonEnter("right")},mouseleave:e.handleButtonLeave,click:function(t){t.stopPropagation(),e.throttledArrowClick(e.activeIndex+1)}}},[i("i",{staticClass:"el-icon-arrow-right"})]):e._e()]),e._t("default")],2),"none"!==e.indicatorPosition?i("ul",{staticClass:"el-carousel__indicators",class:{"el-carousel__indicators--labels":e.hasLabel,"el-carousel__indicators--outside":"outside"===e.indicatorPosition||"card"===e.type}},e._l(e.items,function(t,n){return i("li",{staticClass:"el-carousel__indicator",class:{"is-active":n===e.activeIndex},on:{mouseenter:function(t){e.throttledIndicatorHover(n)},click:function(t){t.stopPropagation(),e.handleIndicatorClick(n)}}},[i("button",{staticClass:"el-carousel__button"},[e.hasLabel?i("span",[e._v(e._s(t.label))]):e._e()])])})):e._e()])},s=[],r={render:n,staticRenderFns:s};t.a=r},function(e,t,i){"use strict";t.__esModule=!0;var n=i(432),s=function(e){return e&&e.__esModule?e:{default:e}}(n);s.default.install=function(e){e.component(s.default.name,s.default)},t.default=s.default},function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=i(433),s=i.n(n),r=i(434),a=i(0),o=a(s.a,r.a,!1,null,null,null);t.default=o.exports},function(e,t,i){"use strict";t.__esModule=!0;t.default={name:"ElCarouselItem",props:{name:String,label:{type:[String,Number],default:""}},data:function(){return{hover:!1,translate:0,scale:1,active:!1,ready:!1,inStage:!1,animating:!1}},methods:{processIndex:function(e,t,i){return 0===t&&e===i-1?-1:t===i-1&&0===e?i:e<t-1&&t-e>=i/2?i+1:e>t+1&&e-t>=i/2?-2:e},calculateTranslate:function(e,t,i){return this.inStage?i*(1.17*(e-t)+1)/4:e<t?-1.83*i/4:3.83*i/4},translateItem:function(e,t,i){var n=this.$parent.$el.offsetWidth,s=this.$parent.items.length;"card"!==this.$parent.type&&void 0!==i&&(this.animating=e===t||e===i),e!==t&&s>2&&(e=this.processIndex(e,t,s)),"card"===this.$parent.type?(this.inStage=Math.round(Math.abs(e-t))<=1,this.active=e===t,this.translate=this.calculateTranslate(e,t,n),this.scale=this.active?1:.83):(this.active=e===t,this.translate=n*(e-t)),this.ready=!0},handleItemClick:function(){var e=this.$parent;if(e&&"card"===e.type){var t=e.items.indexOf(this);e.setActiveItem(t)}}},created:function(){this.$parent&&this.$parent.updateItems()},destroyed:function(){this.$parent&&this.$parent.updateItems()}}},function(e,t,i){"use strict";var n=function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("div",{directives:[{name:"show",rawName:"v-show",value:e.ready,expression:"ready"}],staticClass:"el-carousel__item",class:{"is-active":e.active,"el-carousel__item--card":"card"===e.$parent.type,"is-in-stage":e.inStage,"is-hover":e.hover,"is-animating":e.animating},style:{msTransform:"translateX("+e.translate+"px) scale("+e.scale+")",webkitTransform:"translateX("+e.translate+"px) scale("+e.scale+")",transform:"translateX("+e.translate+"px) scale("+e.scale+")"},on:{click:e.handleItemClick}},["card"===e.$parent.type?i("div",{directives:[{name:"show",rawName:"v-show",value:!e.active,expression:"!active"}],staticClass:"el-carousel__mask"}):e._e(),e._t("default")],2)},s=[],r={render:n,staticRenderFns:s};t.a=r},function(e,t,i){"use strict";t.__esModule=!0;var n=i(436),s=function(e){return e&&e.__esModule?e:{default:e}}(n);s.default.install=function(e){e.component(s.default.name,s.default)},t.default=s.default},function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=i(437),s=i.n(n),r=i(438),a=i(0),o=a(s.a,r.a,!1,null,null,null);t.default=o.exports},function(e,t,i){"use strict";t.__esModule=!0,t.default={name:"ElCollapse",componentName:"ElCollapse",props:{accordion:Boolean,value:{type:[Array,String,Number],default:function(){return[]}}},data:function(){return{activeNames:[].concat(this.value)}},provide:function(){return{collapse:this}},watch:{value:function(e){this.activeNames=[].concat(e)}},methods:{setActiveNames:function(e){e=[].concat(e);var t=this.accordion?e[0]:e;this.activeNames=e,this.$emit("input",t),this.$emit("change",t)},handleItemClick:function(e){if(this.accordion)this.setActiveNames(!this.activeNames[0]&&0!==this.activeNames[0]||this.activeNames[0]!==e.name?e.name:"");else{var t=this.activeNames.slice(0),i=t.indexOf(e.name);i>-1?t.splice(i,1):t.push(e.name),this.setActiveNames(t)}}},created:function(){this.$on("item-click",this.handleItemClick)}}},function(e,t,i){"use strict";var n=function(){var e=this,t=e.$createElement;return(e._self._c||t)("div",{staticClass:"el-collapse",attrs:{role:"tablist","aria-multiselectable":"true"}},[e._t("default")],2)},s=[],r={render:n,staticRenderFns:s};t.a=r},function(e,t,i){"use strict";t.__esModule=!0;var n=i(440),s=function(e){return e&&e.__esModule?e:{default:e}}(n);s.default.install=function(e){e.component(s.default.name,s.default)},t.default=s.default},function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=i(441),s=i.n(n),r=i(442),a=i(0),o=a(s.a,r.a,!1,null,null,null);t.default=o.exports},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0;var s=i(32),r=n(s),a=i(1),o=n(a),l=i(6);t.default={name:"ElCollapseItem",componentName:"ElCollapseItem",mixins:[o.default],components:{ElCollapseTransition:r.default},data:function(){return{contentWrapStyle:{height:"auto",display:"block"},contentHeight:0,focusing:!1,isClick:!1}},inject:["collapse"],props:{title:String,name:{type:[String,Number],default:function(){return this._uid}}},computed:{isActive:function(){return this.collapse.activeNames.indexOf(this.name)>-1},id:function(){return(0,l.generateId)()}},methods:{handleFocus:function(){var e=this;setTimeout(function(){e.isClick?e.isClick=!1:e.focusing=!0},50)},handleHeaderClick:function(){this.dispatch("ElCollapse","item-click",this),this.focusing=!1,this.isClick=!0},handleEnterClick:function(){this.dispatch("ElCollapse","item-click",this)}}}},function(e,t,i){"use strict";var n=function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("div",{staticClass:"el-collapse-item",class:{"is-active":e.isActive}},[i("div",{attrs:{role:"tab","aria-expanded":e.isActive,"aria-controls":"el-collapse-content-"+e.id,"aria-describedby":"el-collapse-content-"+e.id}},[i("div",{staticClass:"el-collapse-item__header",class:{focusing:e.focusing},attrs:{role:"button",id:"el-collapse-head-"+e.id,tabindex:"0"},on:{click:e.handleHeaderClick,keyup:function(t){if(!("button"in t)&&e._k(t.keyCode,"space",32,t.key)&&e._k(t.keyCode,"enter",13,t.key))return null;t.stopPropagation(),e.handleEnterClick(t)},focus:e.handleFocus,blur:function(t){e.focusing=!1}}},[i("i",{staticClass:"el-collapse-item__arrow el-icon-arrow-right"}),e._t("title",[e._v(e._s(e.title))])],2)]),i("el-collapse-transition",[i("div",{directives:[{name:"show",rawName:"v-show",value:e.isActive,expression:"isActive"}],staticClass:"el-collapse-item__wrap",attrs:{role:"tabpanel","aria-hidden":!e.isActive,"aria-labelledby":"el-collapse-head-"+e.id,id:"el-collapse-content-"+e.id}},[i("div",{staticClass:"el-collapse-item__content"},[e._t("default")],2)])])],1)},s=[],r={render:n,staticRenderFns:s};t.a=r},function(e,t,i){"use strict";t.__esModule=!0;var n=i(444),s=function(e){return e&&e.__esModule?e:{default:e}}(n);s.default.install=function(e){e.component(s.default.name,s.default)},t.default=s.default},function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=i(445),s=i.n(n),r=i(449),a=i(0),o=a(s.a,r.a,!1,null,null,null);t.default=o.exports},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0;var s=i(2),r=n(s),a=i(446),o=n(a),l=i(8),u=n(l),c=i(10),d=n(c),h=i(17),f=n(h),p=i(1),m=n(p),v=i(5),g=n(v),b=i(16),y=i(13),_=n(y),x=i(6),C={props:{placement:{type:String,default:"bottom-start"},appendToBody:d.default.props.appendToBody,offset:d.default.props.offset,boundariesPadding:d.default.props.boundariesPadding,popperOptions:d.default.props.popperOptions},methods:d.default.methods,data:d.default.data,beforeDestroy:d.default.beforeDestroy};t.default={name:"ElCascader",directives:{Clickoutside:f.default},mixins:[C,m.default,g.default],inject:{elFormItem:{default:""}},components:{ElInput:u.default},props:{options:{type:Array,required:!0},props:{type:Object,default:function(){return{children:"children",label:"label",value:"value",disabled:"disabled"}}},value:{type:Array,default:function(){return[]}},separator:{type:String,default:"/"},placeholder:{type:String,default:function(){return(0,b.t)("el.cascader.placeholder")}},disabled:Boolean,clearable:{type:Boolean,default:!1},changeOnSelect:Boolean,popperClass:String,expandTrigger:{type:String,default:"click"},filterable:Boolean,size:String,showAllLevels:{type:Boolean,default:!0},debounce:{type:Number,default:300},beforeFilter:{type:Function,default:function(){return function(){}}},hoverThreshold:{type:Number,default:500}},data:function(){return{currentValue:this.value||[],menu:null,debouncedInputChange:function(){},menuVisible:!1,inputHover:!1,inputValue:"",flatOptions:null}},computed:{labelKey:function(){return this.props.label||"label"},valueKey:function(){return this.props.value||"value"},childrenKey:function(){return this.props.children||"children"},currentLabels:function(){var e=this,t=this.options,i=[];return this.currentValue.forEach(function(n){var s=t&&t.filter(function(t){return t[e.valueKey]===n})[0];s&&(i.push(s[e.labelKey]),t=s[e.childrenKey])}),i},_elFormItemSize:function(){return(this.elFormItem||{}).elFormItemSize},cascaderSize:function(){return this.size||this._elFormItemSize||(this.$ELEMENT||{}).size},id:function(){return(0,x.generateId)()}},watch:{menuVisible:function(e){this.$refs.input.$refs.input.setAttribute("aria-expanded",e),e?this.showMenu():this.hideMenu()},value:function(e){this.currentValue=e},currentValue:function(e){this.dispatch("ElFormItem","el.form.change",[e])},currentLabels:function(e){var t=this.showAllLevels?e.join("/"):e[e.length-1];this.$refs.input.$refs.input.setAttribute("value",t)},options:{deep:!0,handler:function(e){this.menu||this.initMenu(),this.flatOptions=this.flattenOptions(this.options),this.menu.options=e}}},methods:{initMenu:function(){this.menu=new r.default(o.default).$mount(),this.menu.options=this.options,this.menu.props=this.props,this.menu.expandTrigger=this.expandTrigger,this.menu.changeOnSelect=this.changeOnSelect,this.menu.popperClass=this.popperClass,this.menu.hoverThreshold=this.hoverThreshold,this.popperElm=this.menu.$el,this.menu.$refs.menus[0].setAttribute("id","cascader-menu-"+this.id),this.menu.$on("pick",this.handlePick),this.menu.$on("activeItemChange",this.handleActiveItemChange),this.menu.$on("menuLeave",this.doDestroy),this.menu.$on("closeInside",this.handleClickoutside)},showMenu:function(){var e=this;this.menu||this.initMenu(),this.menu.value=this.currentValue.slice(0),this.menu.visible=!0,this.menu.options=this.options,this.$nextTick(function(t){e.updatePopper(),e.menu.inputWidth=e.$refs.input.$el.offsetWidth-2})},hideMenu:function(){this.inputValue="",this.menu.visible=!1,this.$refs.input.focus()},handleActiveItemChange:function(e){var t=this;this.$nextTick(function(e){t.updatePopper()}),this.$emit("active-item-change",e)},handleKeydown:function(e){var t=this,i=e.keyCode;13===i?this.handleClick():40===i?(this.menuVisible=!0,setTimeout(function(){t.popperElm.querySelectorAll(".el-cascader-menu")[0].querySelectorAll("[tabindex='-1']")[0].focus()}),e.stopPropagation(),e.preventDefault()):27!==i&&9!==i||(this.inputValue="",this.menu&&(this.menu.visible=!1))},handlePick:function(e){var t=!(arguments.length>1&&void 0!==arguments[1])||arguments[1];this.currentValue=e,this.$emit("input",e),this.$emit("change",e),t?this.menuVisible=!1:this.$nextTick(this.updatePopper)},handleInputChange:function(e){var t=this;if(this.menuVisible){var i=this.flatOptions;if(!e)return this.menu.options=this.options,void this.$nextTick(this.updatePopper);var n=i.filter(function(i){return i.some(function(i){return new RegExp(e,"i").test(i[t.labelKey])})});n=n.length>0?n.map(function(i){return{__IS__FLAT__OPTIONS:!0,value:i.map(function(e){return e[t.valueKey]}),label:t.renderFilteredOptionLabel(e,i)}}):[{__IS__FLAT__OPTIONS:!0,label:this.t("el.cascader.noMatch"),value:"",disabled:!0}],this.menu.options=n,this.$nextTick(this.updatePopper)}},renderFilteredOptionLabel:function(e,t){var i=this;return t.map(function(t,n){var s=t[i.labelKey],r=s.toLowerCase().indexOf(e.toLowerCase()),a=s.slice(r,e.length+r),o=r>-1?i.highlightKeyword(s,a):s;return 0===n?o:[" / ",o]})},highlightKeyword:function(e,t){var i=this,n=this._c;return e.split(t).map(function(e,s){return 0===s?e:[n("span",{class:{"el-cascader-menu__item__keyword":!0}},[i._v(t)]),e]})},flattenOptions:function(e){var t=this,i=arguments.length>1&&void 0!==arguments[1]?arguments[1]:[],n=[];return e.forEach(function(e){var s=i.concat(e);e[t.childrenKey]?(t.changeOnSelect&&n.push(s),n=n.concat(t.flattenOptions(e[t.childrenKey],s))):n.push(s)}),n},clearValue:function(e){e.stopPropagation(),this.handlePick([],!0)},handleClickoutside:function(){this.menuVisible=!1},handleClick:function(){if(!this.disabled){if(this.$refs.input.focus(),this.filterable)return void(this.menuVisible=!0);this.menuVisible=!this.menuVisible}}},created:function(){var e=this;this.debouncedInputChange=(0,_.default)(this.debounce,function(t){var i=e.beforeFilter(t);i&&i.then?(e.menu.options=[{__IS__FLAT__OPTIONS:!0,label:e.t("el.cascader.loading"),value:"",disabled:!0}],i.then(function(){e.$nextTick(function(){e.handleInputChange(t)})})):!1!==i&&e.$nextTick(function(){e.handleInputChange(t)})})},mounted:function(){this.flatOptions=this.flattenOptions(this.options)}}},function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=i(447),s=i.n(n),r=i(0),a=r(s.a,null,!1,null,null,null);t.default=a.exports},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0;var s=i(88),r=n(s),a=i(448),o=i(44),l=n(o),u=i(6),c=function e(t,i){if(!t||!Array.isArray(t)||!i)return t;var n=[],s=["__IS__FLAT__OPTIONS","label","value","disabled"],r=i.children||"children";return t.forEach(function(t){var a={};s.forEach(function(e){var n=i[e],s=t[n];void 0===s&&(n=e,s=t[n]),void 0!==s&&(a[n]=s)}),Array.isArray(t[r])&&(a[r]=e(t[r],i)),n.push(a)}),n};t.default={name:"ElCascaderMenu",data:function(){return{inputWidth:0,options:[],props:{},visible:!1,activeValue:[],value:[],expandTrigger:"click",changeOnSelect:!1,popperClass:"",hoverTimer:0,clicking:!1}},watch:{visible:function(e){e&&(this.activeValue=this.value)},value:{immediate:!0,handler:function(e){this.activeValue=e}}},computed:{activeOptions:{cache:!1,get:function(){var e=this,t=this.activeValue,i=["label","value","children","disabled"],n=c(this.options,this.props);return function t(n){n.forEach(function(n){n.__IS__FLAT__OPTIONS||(i.forEach(function(t){var i=n[e.props[t]||t];void 0!==i&&(n[t]=i)}),Array.isArray(n.children)&&t(n.children))})}(n),function e(i){var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:[],s=n.length;n[s]=i;var r=t[s];return(0,a.isDef)(r)&&(i=i.filter(function(e){return e.value===r})[0])&&i.children&&e(i.children,n),n}(n)}},id:function(){return(0,u.generateId)()}},methods:{select:function(e,t){e.__IS__FLAT__OPTIONS?this.activeValue=e.value:t?this.activeValue.splice(t,this.activeValue.length-1,e.value):this.activeValue=[e.value],this.$emit("pick",this.activeValue.slice())},handleMenuLeave:function(){this.$emit("menuLeave")},activeItem:function(e,t){var i=this.activeOptions.length;this.activeValue.splice(t,i,e.value),this.activeOptions.splice(t+1,i,e.children),this.changeOnSelect?this.$emit("pick",this.activeValue.slice(),!1):this.$emit("activeItemChange",this.activeValue)},scrollMenu:function(e){(0,l.default)(e,e.getElementsByClassName("is-active")[0])},handleMenuEnter:function(){var e=this;this.$nextTick(function(){return e.$refs.menus.forEach(function(t){return e.scrollMenu(t)})})}},render:function(e){var t=this,i=this.activeValue,n=this.activeOptions,s=this.visible,a=this.expandTrigger,o=this.popperClass,l=this.hoverThreshold,u=null,c=0,d={},h=function(e){var i=d.activeMenu;if(i){var n=e.offsetX,s=i.offsetWidth,r=i.offsetHeight;if(e.target===d.activeItem){clearTimeout(t.hoverTimer);var a=d,o=a.activeItem,u=o.offsetTop,c=u+o.offsetHeight;d.hoverZone.innerHTML='\n          <path style="pointer-events: auto;" fill="transparent" d="M'+n+" "+u+" L"+s+" 0 V"+u+' Z" />\n          <path style="pointer-events: auto;" fill="transparent" d="M'+n+" "+c+" L"+s+" "+r+" V"+c+' Z" />\n        '}else t.hoverTimer||(t.hoverTimer=setTimeout(function(){d.hoverZone.innerHTML=""},l))}},f=this._l(n,function(n,s){var o=!1,l="menu-"+t.id+"-"+s,d="menu-"+t.id+"-"+(s+1),f=t._l(n,function(n){var h={on:{}};return n.__IS__FLAT__OPTIONS&&(o=!0),n.disabled||(h.on.keydown=function(e){var i=e.keyCode;if(!([37,38,39,40,13,9,27].indexOf(i)<0)){var r=e.target,a=t.$refs.menus[s],o=a.querySelectorAll("[tabindex='-1']"),l=Array.prototype.indexOf.call(o,r),u=void 0,c=void 0;if([38,40].indexOf(i)>-1)38===i?u=0!==l?l-1:l:40===i&&(u=l!==o.length-1?l+1:l),o[u].focus();else if(37===i){if(0!==s){var d=t.$refs.menus[s-1];d.querySelector("[aria-expanded=true]").focus()}}else if(39===i)n.children&&(c=t.$refs.menus[s+1],c.querySelectorAll("[tabindex='-1']")[0].focus());else if(13===i){if(!n.children){var h=r.getAttribute("id");a.setAttribute("aria-activedescendant",h),t.select(n,s),t.$nextTick(function(){return t.scrollMenu(t.$refs.menus[s])})}}else 9!==i&&27!==i||t.$emit("closeInside")}},n.children?function(){var e={click:"click",hover:"mouseenter"}[a],i=function(){t.activeItem(n,s),t.$nextTick(function(){t.scrollMenu(t.$refs.menus[s]),t.scrollMenu(t.$refs.menus[s+1])})};h.on[e]=i,h.on.mousedown=function(){t.clicking=!0},h.on.focus=function(){if(t.clicking)return void(t.clicking=!1);i()}}():h.on.click=function(){t.select(n,s),t.$nextTick(function(){return t.scrollMenu(t.$refs.menus[s])})}),n.disabled||n.children||(u=l+"-"+c,c++),e("li",(0,r.default)([{class:{"el-cascader-menu__item":!0,"el-cascader-menu__item--extensible":n.children,"is-active":n.value===i[s],"is-disabled":n.disabled},ref:n.value===i[s]?"activeItem":null},h,{attrs:{tabindex:n.disabled?null:-1,role:"menuitem","aria-haspopup":!!n.children,"aria-expanded":n.value===i[s],id:u,"aria-owns":n.children?d:null}}]),[n.label])}),p={};o&&(p.minWidth=t.inputWidth+"px");var m="hover"===a&&i.length-1===s,v={on:{}};return m&&(v.on.mousemove=h,p.position="relative"),e("ul",(0,r.default)([{class:{"el-cascader-menu":!0,"el-cascader-menu--flexible":o}},v,{style:p,refInFor:!0,ref:"menus",attrs:{role:"menu",id:l}}]),[f,m?e("svg",{ref:"hoverZone",style:{position:"absolute",top:0,height:"100%",width:"100%",left:0,pointerEvents:"none"}},[]):null])});return"hover"===a&&this.$nextTick(function(){var e=t.$refs.activeItem;if(e){var i=e.parentElement,n=t.$refs.hoverZone;d={activeMenu:i,activeItem:e,hoverZone:n}}else d={}}),e("transition",{attrs:{name:"el-zoom-in-top"},on:{"before-enter":this.handleMenuEnter,"after-leave":this.handleMenuLeave}},[e("div",{directives:[{name:"show",value:s}],class:["el-cascader-menus el-popper",o],ref:"wrapper"},[e("div",{attrs:{"x-arrow":!0},class:"popper__arrow"},[]),f])])}}},function(e,t,i){"use strict";function n(e){return void 0!==e&&null!==e}t.__esModule=!0,t.isDef=n},function(e,t,i){"use strict";var n=function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("span",{directives:[{name:"clickoutside",rawName:"v-clickoutside",value:e.handleClickoutside,expression:"handleClickoutside"}],ref:"reference",staticClass:"el-cascader",class:[{"is-opened":e.menuVisible,"is-disabled":e.disabled},e.cascaderSize?"el-cascader--"+e.cascaderSize:""],on:{click:e.handleClick,mouseenter:function(t){e.inputHover=!0},focus:function(t){e.inputHover=!0},mouseleave:function(t){e.inputHover=!1},blur:function(t){e.inputHover=!1},keydown:e.handleKeydown}},[i("el-input",{ref:"input",attrs:{readonly:!e.filterable,placeholder:e.currentLabels.length?void 0:e.placeholder,"validate-event":!1,size:e.size,disabled:e.disabled},on:{input:e.debouncedInputChange},model:{value:e.inputValue,callback:function(t){e.inputValue=t},expression:"inputValue"}},[i("template",{attrs:{slot:"suffix"},slot:"suffix"},[e.clearable&&e.inputHover&&e.currentLabels.length?i("i",{key:"1",staticClass:"el-input__icon el-icon-circle-close el-cascader__clearIcon",on:{click:e.clearValue}}):i("i",{key:"2",staticClass:"el-input__icon el-icon-arrow-down",class:{"is-reverse":e.menuVisible}})])],2),i("span",{directives:[{name:"show",rawName:"v-show",value:""===e.inputValue,expression:"inputValue === ''"}],staticClass:"el-cascader__label"},[e.showAllLevels?[e._l(e.currentLabels,function(t,n){return[e._v("\n        "+e._s(t)+"\n        "),n<e.currentLabels.length-1?i("span",[e._v(" "+e._s(e.separator)+" ")]):e._e()]})]:[e._v("\n      "+e._s(e.currentLabels[e.currentLabels.length-1])+"\n    ")]],2)],1)},s=[],r={render:n,staticRenderFns:s};t.a=r},function(e,t,i){"use strict";t.__esModule=!0;var n=i(451),s=function(e){return e&&e.__esModule?e:{default:e}}(n);s.default.install=function(e){e.component(s.default.name,s.default)},t.default=s.default},function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=i(452),s=i.n(n),r=i(466),a=i(0),o=a(s.a,r.a,!1,null,null,null);t.default=o.exports},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0;var s=i(453),r=n(s),a=i(454),o=n(a),l=i(17),u=n(l);t.default={name:"ElColorPicker",props:{value:String,showAlpha:Boolean,colorFormat:String,disabled:Boolean,size:String,popperClass:String},inject:{elFormItem:{default:""}},directives:{Clickoutside:u.default},computed:{displayedColor:function(){if(this.value||this.showPanelColor){var e=this.color.toRgb(),t=e.r,i=e.g,n=e.b;return this.showAlpha?"rgba("+t+", "+i+", "+n+", "+this.color.get("alpha")/100+")":"rgb("+t+", "+i+", "+n+")"}return"transparent"},_elFormItemSize:function(){return(this.elFormItem||{}).elFormItemSize},colorSize:function(){return this.size||this._elFormItemSize||(this.$ELEMENT||{}).size}},watch:{value:function(e){e?e&&e!==this.color.value&&this.color.fromString(e):this.showPanelColor=!1},color:{deep:!0,handler:function(){this.showPanelColor=!0}},displayedColor:function(e){this.$emit("active-change",e)}},methods:{handleTrigger:function(){this.disabled||(this.showPicker=!this.showPicker)},confirmValue:function(e){this.$emit("input",this.color.value),this.$emit("change",this.color.value),this.showPicker=!1},clearValue:function(){this.$emit("input",null),this.$emit("change",null),this.showPanelColor=!1,this.showPicker=!1,this.resetColor()},hide:function(){this.showPicker=!1,this.resetColor()},resetColor:function(){var e=this;this.$nextTick(function(t){e.value?e.color.fromString(e.value):e.showPanelColor=!1})}},mounted:function(){var e=this.value;e&&this.color.fromString(e),this.popperElm=this.$refs.dropdown.$el},data:function(){return{color:new r.default({enableAlpha:this.showAlpha,format:this.colorFormat}),showPicker:!1,showPanelColor:!1}},components:{PickerDropdown:o.default}}},function(e,t,i){"use strict";function n(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}t.__esModule=!0;var s="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},r=function(e,t,i){return[e,t*i/((e=(2-t)*i)<1?e:2-e)||0,e/2]},a=function(e){return"string"==typeof e&&-1!==e.indexOf(".")&&1===parseFloat(e)},o=function(e){return"string"==typeof e&&-1!==e.indexOf("%")},l=function(e,t){a(e)&&(e="100%");var i=o(e);return e=Math.min(t,Math.max(0,parseFloat(e))),i&&(e=parseInt(e*t,10)/100),Math.abs(e-t)<1e-6?1:e%t/parseFloat(t)},u={10:"A",11:"B",12:"C",13:"D",14:"E",15:"F"},c=function(e){var t=e.r,i=e.g,n=e.b,s=function(e){e=Math.min(Math.round(e),255);var t=Math.floor(e/16),i=e%16;return""+(u[t]||t)+(u[i]||i)};return isNaN(t)||isNaN(i)||isNaN(n)?"":"#"+s(t)+s(i)+s(n)},d={A:10,B:11,C:12,D:13,E:14,F:15},h=function(e){return 2===e.length?16*(d[e[0].toUpperCase()]||+e[0])+(d[e[1].toUpperCase()]||+e[1]):d[e[1].toUpperCase()]||+e[1]},f=function(e,t,i){t/=100,i/=100;var n=t,s=Math.max(i,.01),r=void 0,a=void 0;return i*=2,t*=i<=1?i:2-i,n*=s<=1?s:2-s,a=(i+t)/2,r=0===i?2*n/(s+n):2*t/(i+t),{h:e,s:100*r,v:100*a}},p=function(e,t,i){e=l(e,255),t=l(t,255),i=l(i,255);var n=Math.max(e,t,i),s=Math.min(e,t,i),r=void 0,a=void 0,o=n,u=n-s;if(a=0===n?0:u/n,n===s)r=0;else{switch(n){case e:r=(t-i)/u+(t<i?6:0);break;case t:r=(i-e)/u+2;break;case i:r=(e-t)/u+4}r/=6}return{h:360*r,s:100*a,v:100*o}},m=function(e,t,i){e=6*l(e,360),t=l(t,100),i=l(i,100);var n=Math.floor(e),s=e-n,r=i*(1-t),a=i*(1-s*t),o=i*(1-(1-s)*t),u=n%6,c=[i,a,r,r,o,i][u],d=[o,i,i,a,r,r][u],h=[r,r,o,i,i,a][u];return{r:Math.round(255*c),g:Math.round(255*d),b:Math.round(255*h)}},v=function(){function e(t){n(this,e),this._hue=0,this._saturation=100,this._value=100,this._alpha=100,this.enableAlpha=!1,this.format="hex",this.value="",t=t||{};for(var i in t)t.hasOwnProperty(i)&&(this[i]=t[i]);this.doOnChange()}return e.prototype.set=function(e,t){if(1!==arguments.length||"object"!==(void 0===e?"undefined":s(e)))this["_"+e]=t,this.doOnChange();else for(var i in e)e.hasOwnProperty(i)&&this.set(i,e[i])},e.prototype.get=function(e){return this["_"+e]},e.prototype.toRgb=function(){return m(this._hue,this._saturation,this._value)},e.prototype.fromString=function(e){var t=this;if(!e)return this._hue=0,this._saturation=100,this._value=100,void this.doOnChange();var i=function(e,i,n){t._hue=e,t._saturation=i,t._value=n,t.doOnChange()};if(-1!==e.indexOf("hsl")){var n=e.replace(/hsla|hsl|\(|\)/gm,"").split(/\s|,/g).filter(function(e){return""!==e}).map(function(e,t){return t>2?parseFloat(e):parseInt(e,10)});if(4===n.length&&(this._alpha=Math.floor(100*parseFloat(n[3]))),n.length>=3){var s=f(n[0],n[1],n[2]);i(s.h,s.s,s.v)}}else if(-1!==e.indexOf("hsv")){var r=e.replace(/hsva|hsv|\(|\)/gm,"").split(/\s|,/g).filter(function(e){return""!==e}).map(function(e,t){return t>2?parseFloat(e):parseInt(e,10)});4===r.length&&(this._alpha=Math.floor(100*parseFloat(r[3]))),r.length>=3&&i(r[0],r[1],r[2])}else if(-1!==e.indexOf("rgb")){var a=e.replace(/rgba|rgb|\(|\)/gm,"").split(/\s|,/g).filter(function(e){return""!==e}).map(function(e,t){return t>2?parseFloat(e):parseInt(e,10)});if(4===a.length&&(this._alpha=Math.floor(100*parseFloat(a[3]))),a.length>=3){var o=p(a[0],a[1],a[2]),l=o.h,u=o.s,c=o.v;i(l,u,c)}}else if(-1!==e.indexOf("#")){var d=e.replace("#","").trim(),m=void 0,v=void 0,g=void 0;3===d.length?(m=h(d[0]+d[0]),v=h(d[1]+d[1]),g=h(d[2]+d[2])):6===d.length&&(m=h(d.substring(0,2)),v=h(d.substring(2,4)),g=h(d.substring(4)));var b=p(m,v,g),y=b.h,_=b.s,x=b.v;i(y,_,x)}},e.prototype.doOnChange=function(){var e=this._hue,t=this._saturation,i=this._value,n=this._alpha,s=this.format;if(this.enableAlpha)switch(s){case"hsl":var a=r(e,t/100,i/100);this.value="hsla("+e+", "+Math.round(100*a[1])+"%, "+Math.round(100*a[2])+"%, "+n/100+")";break;case"hsv":this.value="hsva("+e+", "+Math.round(t)+"%, "+Math.round(i)+"%, "+n/100+")";break;default:var o=m(e,t,i),l=o.r,u=o.g,d=o.b;this.value="rgba("+l+", "+u+", "+d+", "+n/100+")"}else switch(s){case"hsl":var h=r(e,t/100,i/100);this.value="hsl("+e+", "+Math.round(100*h[1])+"%, "+Math.round(100*h[2])+"%)";break;case"hsv":this.value="hsv("+e+", "+Math.round(t)+"%, "+Math.round(i)+"%)";break;case"rgb":var f=m(e,t,i),p=f.r,v=f.g,g=f.b;this.value="rgb("+p+", "+v+", "+g+")";break;default:this.value=c(m(e,t,i))}},e}();t.default=v},function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=i(455),s=i.n(n),r=i(465),a=i(0),o=a(s.a,r.a,!1,null,null,null);t.default=o.exports},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0;var s=i(456),r=n(s),a=i(459),o=n(a),l=i(462),u=n(l),c=i(10),d=n(c),h=i(5),f=n(h),p=i(8),m=n(p),v=i(18),g=n(v);t.default={name:"el-color-picker-dropdown",mixins:[d.default,f.default],components:{SvPanel:r.default,HueSlider:o.default,AlphaSlider:u.default,ElInput:m.default,ElButton:g.default},props:{color:{required:!0},showAlpha:Boolean},data:function(){return{customInput:""}},computed:{currentColor:function(){var e=this.$parent;return e.value||e.showPanelColor?e.color.value:""}},methods:{confirmValue:function(){this.$emit("pick")},handleConfirm:function(){(this.showAlpha?this.validRGBA(this.customInput):this.validRGBHex(this.customInput))?this.color.fromString(this.customInput):this.customInput=this.currentColor},validRGBHex:function(e){return/^#[A-Fa-f0-9]{6}$/.test(e)},validRGBA:function(e){var t=e.match(/^rgba\((\d+), ?(\d+), ?(\d+), ?([.0-9]+)\)$/);if(!t)return!1;var i=t.map(function(e){return parseInt(e,10)}).slice(1);if(i.some(function(e){return isNaN(e)}))return!1;var n=i[0],s=i[1],r=i[2],a=i[3];return!([n,s,r].some(function(e){return e<0||e>255})||a<0||a>1)}},mounted:function(){this.$parent.popperElm=this.popperElm=this.$el,this.referenceElm=this.$parent.$el},watch:{showPopper:function(e){var t=this;!0===e&&this.$nextTick(function(){var e=t.$refs,i=e.sl,n=e.hue,s=e.alpha;i&&i.update(),n&&n.update(),s&&s.update()})},currentColor:function(e){this.customInput=e}}}},function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=i(457),s=i.n(n),r=i(458),a=i(0),o=a(s.a,r.a,!1,null,null,null);t.default=o.exports},function(e,t,i){"use strict";t.__esModule=!0;var n=i(64),s=function(e){return e&&e.__esModule?e:{default:e}}(n);t.default={name:"el-sl-panel",props:{color:{required:!0}},computed:{colorValue:function(){return{hue:this.color.get("hue"),value:this.color.get("value")}}},watch:{colorValue:function(){this.update()}},methods:{update:function(){var e=this.color.get("saturation"),t=this.color.get("value"),i=this.$el,n=i.getBoundingClientRect(),s=n.width,r=n.height;r||(r=3*s/4),this.cursorLeft=e*s/100,this.cursorTop=(100-t)*r/100,this.background="hsl("+this.color.get("hue")+", 100%, 50%)"},handleDrag:function(e){var t=this.$el,i=t.getBoundingClientRect(),n=e.clientX-i.left,s=e.clientY-i.top;n=Math.max(0,n),n=Math.min(n,i.width),s=Math.max(0,s),s=Math.min(s,i.height),this.cursorLeft=n,this.cursorTop=s,this.color.set({saturation:n/i.width*100,value:100-s/i.height*100})}},mounted:function(){var e=this;(0,s.default)(this.$el,{drag:function(t){e.handleDrag(t)},end:function(t){e.handleDrag(t)}}),this.update()},data:function(){return{cursorTop:0,cursorLeft:0,background:"hsl(0, 100%, 50%)"}}}},function(e,t,i){"use strict";var n=function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("div",{staticClass:"el-color-svpanel",style:{backgroundColor:e.background}},[i("div",{staticClass:"el-color-svpanel__white"}),i("div",{staticClass:"el-color-svpanel__black"}),i("div",{staticClass:"el-color-svpanel__cursor",style:{top:e.cursorTop+"px",left:e.cursorLeft+"px"}},[i("div")])])},s=[],r={render:n,staticRenderFns:s};t.a=r},function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=i(460),s=i.n(n),r=i(461),a=i(0),o=a(s.a,r.a,!1,null,null,null);t.default=o.exports},function(e,t,i){"use strict";t.__esModule=!0;var n=i(64),s=function(e){return e&&e.__esModule?e:{default:e}}(n);t.default={name:"el-color-hue-slider",props:{color:{required:!0},vertical:Boolean},data:function(){return{thumbLeft:0,thumbTop:0}},computed:{hueValue:function(){return this.color.get("hue")}},watch:{hueValue:function(){this.update()}},methods:{handleClick:function(e){var t=this.$refs.thumb;e.target!==t&&this.handleDrag(e)},handleDrag:function(e){var t=this.$el.getBoundingClientRect(),i=this.$refs.thumb,n=void 0;if(this.vertical){var s=e.clientY-t.top;s=Math.min(s,t.height-i.offsetHeight/2),s=Math.max(i.offsetHeight/2,s),n=Math.round((s-i.offsetHeight/2)/(t.height-i.offsetHeight)*360)}else{var r=e.clientX-t.left;r=Math.min(r,t.width-i.offsetWidth/2),r=Math.max(i.offsetWidth/2,r),n=Math.round((r-i.offsetWidth/2)/(t.width-i.offsetWidth)*360)}this.color.set("hue",n)},getThumbLeft:function(){if(this.vertical)return 0;var e=this.$el,t=this.color.get("hue");if(!e)return 0;var i=this.$refs.thumb;return Math.round(t*(e.offsetWidth-i.offsetWidth/2)/360)},getThumbTop:function(){if(!this.vertical)return 0;var e=this.$el,t=this.color.get("hue");if(!e)return 0;var i=this.$refs.thumb;return Math.round(t*(e.offsetHeight-i.offsetHeight/2)/360)},update:function(){this.thumbLeft=this.getThumbLeft(),this.thumbTop=this.getThumbTop()}},mounted:function(){var e=this,t=this.$refs,i=t.bar,n=t.thumb,r={drag:function(t){e.handleDrag(t)},end:function(t){e.handleDrag(t)}};(0,s.default)(i,r),(0,s.default)(n,r),this.update()}}},function(e,t,i){"use strict";var n=function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("div",{staticClass:"el-color-hue-slider",class:{"is-vertical":e.vertical}},[i("div",{ref:"bar",staticClass:"el-color-hue-slider__bar",on:{click:e.handleClick}}),i("div",{ref:"thumb",staticClass:"el-color-hue-slider__thumb",style:{left:e.thumbLeft+"px",top:e.thumbTop+"px"}})])},s=[],r={render:n,staticRenderFns:s};t.a=r},function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=i(463),s=i.n(n),r=i(464),a=i(0),o=a(s.a,r.a,!1,null,null,null);t.default=o.exports},function(e,t,i){"use strict";t.__esModule=!0;var n=i(64),s=function(e){return e&&e.__esModule?e:{default:e}}(n);t.default={name:"el-color-alpha-slider",props:{color:{required:!0},vertical:Boolean},watch:{"color._alpha":function(){this.update()},"color.value":function(){this.update()}},methods:{handleClick:function(e){var t=this.$refs.thumb;e.target!==t&&this.handleDrag(e)},handleDrag:function(e){var t=this.$el.getBoundingClientRect(),i=this.$refs.thumb;if(this.vertical){var n=e.clientY-t.top;n=Math.max(i.offsetHeight/2,n),n=Math.min(n,t.height-i.offsetHeight/2),this.color.set("alpha",Math.round((n-i.offsetHeight/2)/(t.height-i.offsetHeight)*100))}else{var s=e.clientX-t.left;s=Math.max(i.offsetWidth/2,s),s=Math.min(s,t.width-i.offsetWidth/2),this.color.set("alpha",Math.round((s-i.offsetWidth/2)/(t.width-i.offsetWidth)*100))}},getThumbLeft:function(){if(this.vertical)return 0;var e=this.$el,t=this.color._alpha;if(!e)return 0;var i=this.$refs.thumb;return Math.round(t*(e.offsetWidth-i.offsetWidth/2)/100)},getThumbTop:function(){if(!this.vertical)return 0;var e=this.$el,t=this.color._alpha;if(!e)return 0;var i=this.$refs.thumb;return Math.round(t*(e.offsetHeight-i.offsetHeight/2)/100)},getBackground:function(){if(this.color&&this.color.value){var e=this.color.toRgb(),t=e.r,i=e.g,n=e.b;return"linear-gradient(to right, rgba("+t+", "+i+", "+n+", 0) 0%, rgba("+t+", "+i+", "+n+", 1) 100%)"}return null},update:function(){this.thumbLeft=this.getThumbLeft(),this.thumbTop=this.getThumbTop(),this.background=this.getBackground()}},data:function(){return{thumbLeft:0,thumbTop:0,background:null}},mounted:function(){var e=this,t=this.$refs,i=t.bar,n=t.thumb,r={drag:function(t){e.handleDrag(t)},end:function(t){e.handleDrag(t)}};(0,s.default)(i,r),(0,s.default)(n,r),this.update()}}},function(e,t,i){"use strict";var n=function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("div",{staticClass:"el-color-alpha-slider",class:{"is-vertical":e.vertical}},[i("div",{ref:"bar",staticClass:"el-color-alpha-slider__bar",style:{background:e.background},on:{click:e.handleClick}}),i("div",{ref:"thumb",staticClass:"el-color-alpha-slider__thumb",style:{left:e.thumbLeft+"px",top:e.thumbTop+"px"}})])},s=[],r={render:n,staticRenderFns:s};t.a=r},function(e,t,i){"use strict";var n=function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("transition",{attrs:{name:"el-zoom-in-top"},on:{"after-leave":e.doDestroy}},[i("div",{directives:[{name:"show",rawName:"v-show",value:e.showPopper,expression:"showPopper"}],staticClass:"el-color-dropdown"},[i("div",{staticClass:"el-color-dropdown__main-wrapper"},[i("hue-slider",{ref:"hue",staticStyle:{float:"right"},attrs:{color:e.color,vertical:""}}),i("sv-panel",{ref:"sl",attrs:{color:e.color}})],1),e.showAlpha?i("alpha-slider",{ref:"alpha",attrs:{color:e.color}}):e._e(),i("div",{staticClass:"el-color-dropdown__btns"},[i("span",{staticClass:"el-color-dropdown__value"},[i("el-input",{attrs:{size:"mini"},on:{blur:e.handleConfirm},nativeOn:{keyup:function(t){if(!("button"in t)&&e._k(t.keyCode,"enter",13,t.key))return null;e.handleConfirm(t)}},model:{value:e.customInput,callback:function(t){e.customInput=t},expression:"customInput"}})],1),i("el-button",{staticClass:"el-color-dropdown__link-btn",attrs:{size:"mini",type:"text"},on:{click:function(t){e.$emit("clear")}}},[e._v("\n        "+e._s(e.t("el.colorpicker.clear"))+"\n      ")]),i("el-button",{staticClass:"el-color-dropdown__btn",attrs:{plain:"",size:"mini"},on:{click:e.confirmValue}},[e._v("\n        "+e._s(e.t("el.colorpicker.confirm"))+"\n      ")])],1)],1)])},s=[],r={render:n,staticRenderFns:s};t.a=r},function(e,t,i){"use strict";var n=function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("div",{directives:[{name:"clickoutside",rawName:"v-clickoutside",value:e.hide,expression:"hide"}],class:["el-color-picker",e.disabled?"is-disabled":"",e.colorSize?"el-color-picker--"+e.colorSize:""]},[e.disabled?i("div",{staticClass:"el-color-picker__mask"}):e._e(),i("div",{staticClass:"el-color-picker__trigger",on:{click:e.handleTrigger}},[i("span",{staticClass:"el-color-picker__color",class:{"is-alpha":e.showAlpha}},[i("span",{staticClass:"el-color-picker__color-inner",style:{backgroundColor:e.displayedColor}}),e.value||e.showPanelColor?e._e():i("span",{staticClass:"el-color-picker__empty el-icon-close"})]),i("span",{directives:[{name:"show",rawName:"v-show",value:e.value||e.showPanelColor,expression:"value || showPanelColor"}],staticClass:"el-color-picker__icon el-icon-arrow-down"})]),i("picker-dropdown",{ref:"dropdown",class:["el-color-picker__panel",e.popperClass||""],attrs:{color:e.color,"show-alpha":e.showAlpha},on:{pick:e.confirmValue,clear:e.clearValue},model:{value:e.showPicker,callback:function(t){e.showPicker=t},expression:"showPicker"}})],1)},s=[],r={render:n,staticRenderFns:s};t.a=r},function(e,t,i){"use strict";t.__esModule=!0;var n=i(468),s=function(e){return e&&e.__esModule?e:{default:e}}(n);s.default.install=function(e){e.component(s.default.name,s.default)},t.default=s.default},function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=i(469),s=i.n(n),r=i(473),a=i(0),o=a(s.a,r.a,!1,null,null,null);t.default=o.exports},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0;var s=i(18),r=n(s),a=i(1),o=n(a),l=i(5),u=n(l),c=i(470),d=n(c),h=i(9),f=n(h);t.default={name:"ElTransfer",mixins:[o.default,u.default,f.default],components:{TransferPanel:d.default,ElButton:r.default},props:{data:{type:Array,default:function(){return[]}},titles:{type:Array,default:function(){return[]}},buttonTexts:{type:Array,default:function(){return[]}},filterPlaceholder:{type:String,default:""},filterMethod:Function,leftDefaultChecked:{type:Array,default:function(){return[]}},rightDefaultChecked:{type:Array,default:function(){return[]}},renderContent:Function,value:{type:Array,default:function(){return[]}},format:{type:Object,default:function(){return{}}},filterable:Boolean,props:{type:Object,default:function(){return{label:"label",key:"key",disabled:"disabled"}}}},data:function(){return{leftChecked:[],rightChecked:[]}},computed:{sourceData:function(){var e=this;return this.data.filter(function(t){return-1===e.value.indexOf(t[e.props.key])})},targetData:function(){var e=this;return this.data.filter(function(t){return e.value.indexOf(t[e.props.key])>-1})},hasButtonTexts:function(){return 2===this.buttonTexts.length}},watch:{value:function(e){this.dispatch("ElFormItem","el.form.change",e)}},methods:{getMigratingConfig:function(){return{props:{"footer-format":"footer-format is renamed to format."}}},onSourceCheckedChange:function(e){this.leftChecked=e},onTargetCheckedChange:function(e){this.rightChecked=e},addToLeft:function(){var e=this.value.slice();this.rightChecked.forEach(function(t){var i=e.indexOf(t);i>-1&&e.splice(i,1)}),this.$emit("input",e),this.$emit("change",e,"left",this.rightChecked)},addToRight:function(){var e=this,t=this.value.slice();this.leftChecked.forEach(function(i){-1===e.value.indexOf(i)&&(t=t.concat(i))}),this.$emit("input",t),this.$emit("change",t,"right",this.leftChecked)}}}},function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=i(471),s=i.n(n),r=i(472),a=i(0),o=a(s.a,r.a,!1,null,null,null);t.default=o.exports},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0;var s=i(46),r=n(s),a=i(14),o=n(a),l=i(8),u=n(l),c=i(5),d=n(c);t.default={mixins:[d.default],name:"ElTransferPanel",componentName:"ElTransferPanel",components:{ElCheckboxGroup:r.default,ElCheckbox:o.default,ElInput:u.default,OptionContent:{props:{option:Object},render:function(e){var t=function e(t){return"ElTransferPanel"===t.$options.componentName?t:t.$parent?e(t.$parent):t}(this);return t.renderContent?t.renderContent(e,this.option):e("span",null,[this.option[t.labelProp]||this.option[t.keyProp]])}}},props:{data:{type:Array,default:function(){return[]}},renderContent:Function,placeholder:String,title:String,filterable:Boolean,format:Object,filterMethod:Function,defaultChecked:Array,props:Object},data:function(){return{checked:[],allChecked:!1,query:"",inputHover:!1}},watch:{checked:function(e){this.updateAllChecked(),this.$emit("checked-change",e)},data:function(){var e=this,t=[],i=this.filteredData.map(function(t){return t[e.keyProp]});this.checked.forEach(function(e){i.indexOf(e)>-1&&t.push(e)}),this.checked=t},checkableData:function(){this.updateAllChecked()},defaultChecked:{immediate:!0,handler:function(e,t){var i=this;if(!t||e.length!==t.length||!e.every(function(e){return t.indexOf(e)>-1})){var n=[],s=this.checkableData.map(function(e){return e[i.keyProp]});e.forEach(function(e){s.indexOf(e)>-1&&n.push(e)}),this.checked=n}}}},computed:{filteredData:function(){var e=this;return this.data.filter(function(t){return"function"==typeof e.filterMethod?e.filterMethod(e.query,t):(t[e.labelProp]||t[e.keyProp].toString()).toLowerCase().indexOf(e.query.toLowerCase())>-1})},checkableData:function(){var e=this;return this.filteredData.filter(function(t){return!t[e.disabledProp]})},checkedSummary:function(){var e=this.checked.length,t=this.data.length,i=this.format,n=i.noChecked,s=i.hasChecked;return n&&s?e>0?s.replace(/\${checked}/g,e).replace(/\${total}/g,t):n.replace(/\${total}/g,t):e+"/"+t},isIndeterminate:function(){var e=this.checked.length;return e>0&&e<this.checkableData.length},hasNoMatch:function(){return this.query.length>0&&0===this.filteredData.length},inputIcon:function(){return this.query.length>0&&this.inputHover?"circle-close":"search"},labelProp:function(){return this.props.label||"label"},keyProp:function(){return this.props.key||"key"},disabledProp:function(){return this.props.disabled||"disabled"},hasFooter:function(){return!!this.$slots.default}},methods:{updateAllChecked:function(){var e=this,t=this.checkableData.map(function(t){return t[e.keyProp]});this.allChecked=t.length>0&&t.every(function(t){return e.checked.indexOf(t)>-1})},handleAllCheckedChange:function(e){var t=this;this.checked=e?this.checkableData.map(function(e){return e[t.keyProp]}):[]},clearQuery:function(){"circle-close"===this.inputIcon&&(this.query="")}}}},function(e,t,i){"use strict";var n=function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("div",{staticClass:"el-transfer-panel"},[i("p",{staticClass:"el-transfer-panel__header"},[i("el-checkbox",{attrs:{indeterminate:e.isIndeterminate},on:{change:e.handleAllCheckedChange},model:{value:e.allChecked,callback:function(t){e.allChecked=t},expression:"allChecked"}},[e._v("\n      "+e._s(e.title)+"\n      "),i("span",[e._v(e._s(e.checkedSummary))])])],1),i("div",{class:["el-transfer-panel__body",e.hasFooter?"is-with-footer":""]},[e.filterable?i("el-input",{staticClass:"el-transfer-panel__filter",attrs:{size:"small",placeholder:e.placeholder},nativeOn:{mouseenter:function(t){e.inputHover=!0},mouseleave:function(t){e.inputHover=!1}},model:{value:e.query,callback:function(t){e.query=t},expression:"query"}},[i("i",{class:["el-input__icon","el-icon-"+e.inputIcon],attrs:{slot:"prefix"},on:{click:e.clearQuery},slot:"prefix"})]):e._e(),i("el-checkbox-group",{directives:[{name:"show",rawName:"v-show",value:!e.hasNoMatch&&e.data.length>0,expression:"!hasNoMatch && data.length > 0"}],staticClass:"el-transfer-panel__list",class:{"is-filterable":e.filterable},model:{value:e.checked,callback:function(t){e.checked=t},expression:"checked"}},e._l(e.filteredData,function(t){return i("el-checkbox",{key:t[e.keyProp],staticClass:"el-transfer-panel__item",attrs:{label:t[e.keyProp],disabled:t[e.disabledProp]}},[i("option-content",{attrs:{option:t}})],1)})),i("p",{directives:[{name:"show",rawName:"v-show",value:e.hasNoMatch,expression:"hasNoMatch"}],staticClass:"el-transfer-panel__empty"},[e._v(e._s(e.t("el.transfer.noMatch")))]),i("p",{directives:[{name:"show",rawName:"v-show",value:0===e.data.length&&!e.hasNoMatch,expression:"data.length === 0 && !hasNoMatch"}],staticClass:"el-transfer-panel__empty"},[e._v(e._s(e.t("el.transfer.noData")))])],1),e.hasFooter?i("p",{staticClass:"el-transfer-panel__footer"},[e._t("default")],2):e._e()])},s=[],r={render:n,staticRenderFns:s};t.a=r},function(e,t,i){"use strict";var n=function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("div",{staticClass:"el-transfer"},[i("transfer-panel",e._b({attrs:{data:e.sourceData,title:e.titles[0]||e.t("el.transfer.titles.0"),"default-checked":e.leftDefaultChecked,placeholder:e.filterPlaceholder||e.t("el.transfer.filterPlaceholder")},on:{"checked-change":e.onSourceCheckedChange}},"transfer-panel",e.$props,!1),[e._t("left-footer")],2),i("div",{staticClass:"el-transfer__buttons"},[i("el-button",{class:["el-transfer__button",e.hasButtonTexts?"is-with-texts":""],attrs:{type:"primary",disabled:0===e.rightChecked.length},nativeOn:{click:function(t){e.addToLeft(t)}}},[i("i",{staticClass:"el-icon-arrow-left"}),void 0!==e.buttonTexts[0]?i("span",[e._v(e._s(e.buttonTexts[0]))]):e._e()]),i("el-button",{class:["el-transfer__button",e.hasButtonTexts?"is-with-texts":""],attrs:{type:"primary",disabled:0===e.leftChecked.length},nativeOn:{click:function(t){e.addToRight(t)}}},[void 0!==e.buttonTexts[1]?i("span",[e._v(e._s(e.buttonTexts[1]))]):e._e(),i("i",{staticClass:"el-icon-arrow-right"})])],1),i("transfer-panel",e._b({attrs:{data:e.targetData,title:e.titles[1]||e.t("el.transfer.titles.1"),"default-checked":e.rightDefaultChecked,placeholder:e.filterPlaceholder||e.t("el.transfer.filterPlaceholder")},on:{"checked-change":e.onTargetCheckedChange}},"transfer-panel",e.$props,!1),[e._t("right-footer")],2)],1)},s=[],r={render:n,staticRenderFns:s};t.a=r},function(e,t,i){"use strict";t.__esModule=!0;var n=i(475),s=function(e){return e&&e.__esModule?e:{default:e}}(n);s.default.install=function(e){e.component(s.default.name,s.default)},t.default=s.default},function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=i(476),s=i.n(n),r=i(477),a=i(0),o=a(s.a,r.a,!1,null,null,null);t.default=o.exports},function(e,t,i){"use strict";t.__esModule=!0,t.default={name:"ElContainer",componentName:"ElContainer",props:{direction:String},computed:{isVertical:function(){return"vertical"===this.direction||"horizontal"!==this.direction&&(!(!this.$slots||!this.$slots.default)&&this.$slots.default.some(function(e){var t=e.componentOptions&&e.componentOptions.tag;return"el-header"===t||"el-footer"===t}))}}}},function(e,t,i){"use strict";var n=function(){var e=this,t=e.$createElement;return(e._self._c||t)("section",{staticClass:"el-container",class:{"is-vertical":e.isVertical}},[e._t("default")],2)},s=[],r={render:n,staticRenderFns:s};t.a=r},function(e,t,i){"use strict";t.__esModule=!0;var n=i(479),s=function(e){return e&&e.__esModule?e:{default:e}}(n);s.default.install=function(e){e.component(s.default.name,s.default)},t.default=s.default},function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=i(480),s=i.n(n),r=i(481),a=i(0),o=a(s.a,r.a,!1,null,null,null);t.default=o.exports},function(e,t,i){"use strict";t.__esModule=!0,t.default={name:"ElHeader",componentName:"ElHeader",props:{height:{type:String,default:"60px"}}}},function(e,t,i){"use strict";var n=function(){var e=this,t=e.$createElement;return(e._self._c||t)("header",{staticClass:"el-header",style:{height:e.height}},[e._t("default")],2)},s=[],r={render:n,staticRenderFns:s};t.a=r},function(e,t,i){"use strict";t.__esModule=!0;var n=i(483),s=function(e){return e&&e.__esModule?e:{default:e}}(n);s.default.install=function(e){e.component(s.default.name,s.default)},t.default=s.default},function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=i(484),s=i.n(n),r=i(485),a=i(0),o=a(s.a,r.a,!1,null,null,null);t.default=o.exports},function(e,t,i){"use strict";t.__esModule=!0,t.default={name:"ElAside",componentName:"ElAside",props:{width:{type:String,default:"300px"}}}},function(e,t,i){"use strict";var n=function(){var e=this,t=e.$createElement;return(e._self._c||t)("aside",{staticClass:"el-aside",style:{width:e.width}},[e._t("default")],2)},s=[],r={render:n,staticRenderFns:s};t.a=r},function(e,t,i){"use strict";t.__esModule=!0;var n=i(487),s=function(e){return e&&e.__esModule?e:{default:e}}(n);s.default.install=function(e){e.component(s.default.name,s.default)},t.default=s.default},function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=i(488),s=i.n(n),r=i(489),a=i(0),o=a(s.a,r.a,!1,null,null,null);t.default=o.exports},function(e,t,i){"use strict";t.__esModule=!0,t.default={name:"ElMain",componentName:"ElMain"}},function(e,t,i){"use strict";var n=function(){var e=this,t=e.$createElement;return(e._self._c||t)("main",{staticClass:"el-main"},[e._t("default")],2)},s=[],r={render:n,staticRenderFns:s};t.a=r},function(e,t,i){"use strict";t.__esModule=!0;var n=i(491),s=function(e){return e&&e.__esModule?e:{default:e}}(n);s.default.install=function(e){e.component(s.default.name,s.default)},t.default=s.default},function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=i(492),s=i.n(n),r=i(493),a=i(0),o=a(s.a,r.a,!1,null,null,null);t.default=o.exports},function(e,t,i){"use strict";t.__esModule=!0,t.default={name:"ElFooter",componentName:"ElFooter",props:{height:{type:String,default:"60px"}}}},function(e,t,i){"use strict";var n=function(){var e=this,t=e.$createElement;return(e._self._c||t)("footer",{staticClass:"el-footer",style:{height:e.height}},[e._t("default")],2)},s=[],r={render:n,staticRenderFns:s};t.a=r}])});
(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define('element/locale/fr', ['module', 'exports'], factory);
  } else if (typeof exports !== "undefined") {
    factory(module, exports);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod, mod.exports);
    global.ELEMENT.lang = global.ELEMENT.lang || {}; 
    global.ELEMENT.lang.fr = mod.exports;
  }
})(this, function (module, exports) {
  'use strict';

  exports.__esModule = true;
  exports.default = {
    el: {
      colorpicker: {
        confirm: 'OK',
        clear: 'Effacer'
      },
      datepicker: {
        now: 'Maintenant',
        today: 'Auj.',
        cancel: 'Annuler',
        clear: 'Effacer',
        confirm: 'OK',
        selectDate: 'Choisir date',
        selectTime: 'Choisir horaire',
        startDate: 'Date début',
        startTime: 'Horaire début',
        endDate: 'Date fin',
        endTime: 'Horaire fin',
        prevYear: 'Année précédente',
        nextYear: 'Année suivante',
        prevMonth: 'Mois précédent',
        nextMonth: 'Mois suivant',
        year: 'Année',
        month1: 'Janvier',
        month2: 'Février',
        month3: 'Mars',
        month4: 'Avril',
        month5: 'Mai',
        month6: 'Juin',
        month7: 'Juillet',
        month8: 'Août',
        month9: 'Septembre',
        month10: 'Octobre',
        month11: 'Novembre',
        month12: 'Décembre',
        // week: 'Semaine',
        weeks: {
          sun: 'Dim',
          mon: 'Lun',
          tue: 'Mar',
          wed: 'Mer',
          thu: 'Jeu',
          fri: 'Ven',
          sat: 'Sam'
        },
        months: {
          jan: 'Jan',
          feb: 'Fév',
          mar: 'Mar',
          apr: 'Avr',
          may: 'Mai',
          jun: 'Jun',
          jul: 'Jul',
          aug: 'Aoû',
          sep: 'Sep',
          oct: 'Oct',
          nov: 'Nov',
          dec: 'Déc'
        }
      },
      select: {
        loading: 'Chargement',
        noMatch: 'Aucune correspondance',
        noData: 'Aucune donnée',
        placeholder: 'Choisir'
      },
      cascader: {
        noMatch: 'Aucune correspondance',
        loading: 'Chargement',
        placeholder: 'Choisir'
      },
      pagination: {
        goto: 'Aller à',
        pagesize: '/page',
        total: 'Total {total}',
        pageClassifier: ''
      },
      messagebox: {
        confirm: 'Confirmer',
        cancel: 'Annuler',
        error: 'Erreur'
      },
      upload: {
        deleteTip: 'Cliquer sur supprimer pour retirer le fichier',
        delete: 'Supprimer',
        preview: 'Aperçu',
        continue: 'Continuer'
      },
      table: {
        emptyText: 'Aucune donnée',
        confirmFilter: 'Confirmer',
        resetFilter: 'Réinitialiser',
        clearFilter: 'Tous',
        sumText: 'Somme'
      },
      tree: {
        emptyText: 'Aucune donnée'
      },
      transfer: {
        noMatch: 'Aucune correspondance',
        noData: 'Aucune donnée',
        titles: ['Liste 1', 'Liste 2'],
        filterPlaceholder: 'Entrer un mot clef',
        noCheckedFormat: '{total} elements',
        hasCheckedFormat: '{checked}/{total} coché(s)'
      }
    }
  };
  module.exports = exports['default'];
});
require=function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s}({1:[function(require,module,exports){},{}],2:[function(require,module,exports){"use strict";var SPLIT_REGEX=/[^.^\]^[]+|(?=\[\]|\.\.)/g,DIGIT_REGEX=/^\d+$/;var setCache={},getCache={};module.exports={expr:expr,setter:function(path){return setCache[path]||(setCache[path]=new Function("data, value","return "+expr(path,"data")+" = value, data;"))},getter:function(path,safe){var k=path+"_"+safe;return getCache[k]||(getCache[k]=new Function("data","return "+expr(path,safe,"data")))},split:function(path){return path.match(SPLIT_REGEX)},join:function(segments){return segments.reduce(function(path,part){return path+(isQuoted(part)||DIGIT_REGEX.test(part)?"["+part+"]":(path?".":"")+part)},"")},forEach:function(path,cb,thisArg){forEach(path.match(SPLIT_REGEX),cb,thisArg)}};function expr(expression,safe,param){expression=expression||"";if(typeof safe==="string"){param=safe;safe=false}param=param||"data";if(expression&&expression.charAt(0)!=="[")expression="."+expression;return safe?makeSafe(expression,param):param+expression}function forEach(parts,iter,thisArg){var len=parts.length,part,idx,isArray,isBracket;for(idx=0;idx<len;idx++){part=parts[idx];if(part){isBracket=isQuoted(part);isArray=!isBracket&&/^\d+$/.test(part);iter.call(thisArg,part,isBracket,isArray,idx,parts)}}}function isQuoted(str){return typeof str==="string"&&str&&["'",'"'].indexOf(str.charAt(0))!==-1}function makeSafe(path,param){var result=param,parts=path.match(SPLIT_REGEX),isLast;forEach(parts,function(part,isBracket,isArray,idx,parts){isLast=idx===parts.length-1;part=isBracket||isArray?"["+part+"]":"."+part;result+=part+(!isLast?" || {})":")")});return new Array(parts.length+1).join("(")+result}},{}],"json-ref-lite":[function(require,module,exports){(function(__dirname){(function(){var expr,fs,request;fs=typeof window==="undefined"||window===null?require("fs"):false;request=fs&&fs.existsSync(__dirname+"/../sync-request")?require("sync-request"):false;expr=require("property-expr");module.exports=function(){this.cache={};this.extendtoken="$extend";this.reftoken="$ref";this.pathtoken="#";this.debug=false;this.clone=function(obj){var key,temp;if(obj===null||typeof obj!=="object"||typeof obj==="function"){return obj}temp=obj.constructor();for(key in obj){temp[key]=this.clone(obj[key])}return temp};this.findIds=function(json,ids){var id,k,obj,v;id=false;obj={};for(k in json){v=json[k];if(json.id!=null){id=json.id}if(id&&k!=="id"){obj[k]=v}if(typeof v==="object"){this.findIds(v,ids)}}if(id){return ids[id]=obj}};this.get_json_pointer=function(ref,root){var err,error,evalstr,result;evalstr=ref.replace(/\\\//,"#SLASH#").replace(/\//g,".").replace(/#SLASH#/,"/");evalstr=evalstr.replace(new RegExp("^"+this.pathtoken),"");if(evalstr[0]==="."){evalstr=evalstr.substr(1,evalstr.length-1)}try{if(this.debug){console.log("evaluating '"+evalstr+"'")}result=expr.getter(evalstr)(root)}catch(error){err=error;result=""}return result};this.replace=function(json,ids,root){var jsonpointer,k,ref,ref1,ref2,results,str,url,v;results=[];for(k in json){v=json[k];if(this.debug&&typeof ref==="string"){console.log("checking "+k)}if(v!=null&&v[reftoken]!=null){ref=v[reftoken];if(this.debug&&typeof ref==="string"){console.log("checking "+k+" -> "+ref)}if(Object.keys(v).length>1){console.error("json-ref-lite error: object '"+k+"' contains reference as well as other properties..ignoring properties")}if(Array.isArray(ref)){ref=this.replace(ref,ids,root)}else if(ids[ref]!=null){json[k]=ids[ref]}else if(request&&String(ref).match(/^https?:/)){url=ref.match(/^[^#]*/);if(!this.cache[url]){this.cache[url]=this.resolve(JSON.parse(request("GET",url).getBody().toString()))}json[k]=this.cache[url];if(ref.match(this.pathtoken)){jsonpointer=ref.replace(new RegExp(".*"+pathtoken),this.pathtoken);if(jsonpointer.length){json[k]=this.get_json_pointer(jsonpointer,json[k])}}}else if(fs&&fs.existsSync(ref)){str=fs.readFileSync(ref).toString();if(str.match(/module\.exports/)){json[k]=require(ref)}else{json[k]=JSON.parse(str)}}else if(String(ref).match(new RegExp("^"+this.pathtoken))){if(this.debug){console.log("checking "+ref+" pathtoken")}json[k]=this.get_json_pointer(ref,root)}if(((ref1=json[k])!=null?ref1.length:void 0)!=null&&((ref2=json[k])!=null?ref2.length:void 0)===0&&this.debug){results.push(console.log(ref+" reference not found"))}else{results.push(void 0)}}else{if(typeof v==="object"){results.push(this.replace(v,ids,root))}else{results.push(void 0)}}}return results};this.extend=function(json){var k,ref,results,rk,rv,v;if(typeof json==="object"){results=[];for(k in json){v=json[k];if(k===this.extendtoken&&v[this.reftoken]!=null){ref=this.get_json_pointer(v[this.reftoken],json);for(rk in v){rv=v[rk];if(rk!==this.reftoken){ref[rk]=rv}}delete json[k]}if(typeof v==="object"){results.push(v=this.extend(v))}else{results.push(void 0)}}return results}};this.resolve=function(json){var ids;ids={};this.findIds(json,ids);if(this.debug&&Object.keys(ids).length){console.dir(ids)}this.replace(json,ids,json);return json};this.evaluate=function(json,data,cb){var k,ref1,v;if(cb==null){cb=this.evaluateStr}ref1=this.clone(json);for(k in ref1){v=ref1[k];if(typeof v==="string"){json[k]=cb(v,data)}if(typeof v==="object"){json[k]=this.evaluate(v,data)}}return json};this.evaluateStr=function(k,data){var error,itemstr;if(typeof k!=="string"){return k}if(k[0]==="{"&&k[k.length-1]==="}"){try{return expr.getter(k.replace(/^{/,"").replace(/}$/,""))(data)}catch(error){return null}}else{itemstr=k.replace(/(\{)(.*?)(\})/g,function($0,$1,$2){var err,error1,result;result="";if(data==null||$2==null){return result}if(data[$2]!=null&&typeof data[$2]==="function"){result=data[$2]()}else{if(data[$2]!=null){result=data[$2]}else{try{$2=$2.replace(new RegExp("^"+this.pathtoken+"/"),"").replace(/\//g,".");result=expr.getter($2)(data)}catch(error1){err=error1;result=""}if(result==null){result=""}}}this.evaluateStr(result,data);return result});return itemstr}};return this}()}).call(this)}).call(this,"/")},{fs:1,"property-expr":2,"sync-request":1}]},{},[]);