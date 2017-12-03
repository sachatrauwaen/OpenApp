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

!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t(require("vue")):"function"==typeof define&&define.amd?define("ELEMENT",["vue"],t):"object"==typeof exports?exports.ELEMENT=t(require("vue")):e.ELEMENT=t(e.Vue)}(this,function(e){return function(e){function t(n){if(i[n])return i[n].exports;var s=i[n]={exports:{},id:n,loaded:!1};return e[n].call(s.exports,s,s.exports,t),s.loaded=!0,s.exports}var i={};return t.m=e,t.c=i,t.p="/dist/",t(0)}([function(e,t,i){e.exports=i(1)},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}var s=i(2),o=n(s),a=i(52),r=n(a),l=i(56),u=n(l),c=i(63),d=n(c),h=i(74),f=n(h),p=i(78),m=n(p),v=i(82),g=n(v),y=i(86),b=n(y),_=i(92),C=n(_),x=i(96),w=n(x),M=i(19),k=n(M),S=i(100),D=n(S),I=i(104),T=n(I),N=i(108),E=n(N),$=i(112),O=n($),A=i(116),P=n(A),L=i(120),j=n(L),z=i(124),F=n(z),V=i(128),B=n(V),R=i(8),W=n(R),H=i(51),Y=n(H),q=i(132),U=n(q),G=i(66),Z=n(G),Q=i(70),K=n(Q),X=i(136),J=n(X),ee=i(153),te=n(ee),ie=i(155),ne=n(ie),se=i(183),oe=n(se),ae=i(188),re=n(ae),le=i(193),ue=n(le),ce=i(143),de=n(ce),he=i(198),fe=n(he),pe=i(203),me=n(pe),ve=i(207),ge=n(ve),ye=i(211),be=n(ye),_e=i(215),Ce=n(_e),xe=i(244),we=n(xe),Me=i(252),ke=n(Me),Se=i(37),De=n(Se),Ie=i(256),Te=n(Ie),Ne=i(266),Ee=n(Ne),$e=i(270),Oe=n($e),Ae=i(275),Pe=n(Ae),Le=i(282),je=n(Le),ze=i(288),Fe=n(ze),Ve=i(292),Be=n(Ve),Re=i(294),We=n(Re),He=i(296),Ye=n(He),qe=i(301),Ue=n(qe),Ge=i(315),Ze=n(Ge),Qe=i(319),Ke=n(Qe),Xe=i(329),Je=n(Xe),et=i(333),tt=n(et),it=i(337),nt=n(it),st=i(341),ot=n(st),at=i(345),rt=n(at),lt=i(349),ut=n(lt),ct=i(41),dt=n(ct),ht=i(353),ft=n(ht),pt=i(357),mt=n(pt),vt=i(361),gt=n(vt),yt=i(365),bt=n(yt),_t=i(373),Ct=n(_t),xt=i(391),wt=n(xt),Mt=i(13),kt=n(Mt),St=i(89),Dt=n(St),It=[o.default,r.default,u.default,d.default,f.default,m.default,g.default,b.default,C.default,w.default,k.default,D.default,T.default,E.default,O.default,P.default,j.default,F.default,B.default,W.default,Y.default,U.default,Z.default,K.default,J.default,te.default,ne.default,oe.default,re.default,ue.default,de.default,me.default,ge.default,be.default,Ce.default,we.default,ke.default,De.default,Te.default,Ee.default,Pe.default,Fe.default,Be.default,We.default,Ye.default,Ue.default,Ze.default,Je.default,tt.default,nt.default,ot.default,rt.default,ut.default,dt.default,ft.default,mt.default,gt.default,bt.default,Ct.default,wt.default,Dt.default],Tt=function e(t){var i=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};e.installed||(kt.default.use(i.locale),kt.default.i18n(i.i18n),It.map(function(e){t.component(e.name,e)}),t.use(je.default.directive),t.prototype.$loading=je.default.service,t.prototype.$msgbox=fe.default,t.prototype.$alert=fe.default.alert,t.prototype.$confirm=fe.default.confirm,t.prototype.$prompt=fe.default.prompt,t.prototype.$notify=Oe.default,t.prototype.$message=Ke.default)};"undefined"!=typeof window&&window.Vue&&Tt(window.Vue),e.exports={version:"1.4.4",locale:kt.default.use,i18n:kt.default.i18n,install:Tt,CollapseTransition:Dt.default,Loading:je.default,Pagination:o.default,Dialog:r.default,Autocomplete:u.default,Dropdown:d.default,DropdownMenu:f.default,DropdownItem:m.default,Menu:g.default,Submenu:b.default,MenuItem:C.default,MenuItemGroup:w.default,Input:k.default,InputNumber:D.default,Radio:T.default,RadioGroup:E.default,RadioButton:O.default,Checkbox:P.default,CheckboxButton:j.default,CheckboxGroup:F.default,Switch:B.default,Select:W.default,Option:Y.default,OptionGroup:U.default,Button:Z.default,ButtonGroup:K.default,Table:J.default,TableColumn:te.default,DatePicker:ne.default,TimeSelect:oe.default,TimePicker:re.default,Popover:ue.default,Tooltip:de.default,MessageBox:fe.default,Breadcrumb:me.default,BreadcrumbItem:ge.default,Form:be.default,FormItem:Ce.default,Tabs:we.default,TabPane:ke.default,Tag:De.default,Tree:Te.default,Alert:Ee.default,Notification:Oe.default,Slider:Pe.default,Icon:Fe.default,Row:Be.default,Col:We.default,Upload:Ye.default,Progress:Ue.default,Spinner:Ze.default,Message:Ke.default,Badge:Je.default,Card:tt.default,Rate:nt.default,Steps:ot.default,Step:rt.default,Carousel:ut.default,Scrollbar:dt.default,CarouselItem:ft.default,Collapse:mt.default,CollapseItem:gt.default,Cascader:bt.default,ColorPicker:Ct.default,Transfer:wt.default}},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0;var s=i(3),o=n(s);o.default.install=function(e){e.component(o.default.name,o.default)},t.default=o.default},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0;var s=i(4),o=n(s),a=i(8),r=n(a),l=i(51),u=n(l),c=i(12),d=n(c);t.default={name:"ElPagination",props:{pageSize:{type:Number,default:10},small:Boolean,total:Number,pageCount:Number,currentPage:{type:Number,default:1},layout:{default:"prev, pager, next, jumper, ->, total"},pageSizes:{type:Array,default:function(){return[10,20,30,40,50,100]}}},data:function(){return{internalCurrentPage:1,internalPageSize:0}},render:function(e){var t=e("div",{class:"el-pagination"},[]),i=this.layout||"";if(i){var n={prev:e("prev",null,[]),jumper:e("jumper",null,[]),pager:e("pager",{attrs:{currentPage:this.internalCurrentPage,pageCount:this.internalPageCount},on:{change:this.handleCurrentChange}},[]),next:e("next",null,[]),sizes:e("sizes",{attrs:{pageSizes:this.pageSizes}},[]),slot:e("my-slot",null,[]),total:e("total",null,[])},s=i.split(",").map(function(e){return e.trim()}),o=e("div",{class:"el-pagination__rightwrapper"},[]),a=!1;return this.small&&(t.data.class+=" el-pagination--small"),s.forEach(function(e){return"->"===e?void(a=!0):void(a?o.children.push(n[e]):t.children.push(n[e]))}),a&&t.children.unshift(o),t}},components:{MySlot:{render:function(e){return this.$parent.$slots.default?this.$parent.$slots.default[0]:""}},Prev:{render:function(e){return e("button",{attrs:{type:"button"},class:["btn-prev",{disabled:this.$parent.internalCurrentPage<=1}],on:{click:this.$parent.prev}},[e("i",{class:"el-icon el-icon-arrow-left"},[])])}},Next:{render:function(e){return e("button",{attrs:{type:"button"},class:["btn-next",{disabled:this.$parent.internalCurrentPage===this.$parent.internalPageCount||0===this.$parent.internalPageCount}],on:{click:this.$parent.next}},[e("i",{class:"el-icon el-icon-arrow-right"},[])])}},Sizes:{mixins:[d.default],props:{pageSizes:Array},watch:{pageSizes:{immediate:!0,handler:function(e){Array.isArray(e)&&(this.$parent.internalPageSize=e.indexOf(this.$parent.pageSize)>-1?this.$parent.pageSize:this.pageSizes[0])}}},render:function(e){var t=this;return e("span",{class:"el-pagination__sizes"},[e("el-select",{attrs:{value:this.$parent.internalPageSize},on:{input:this.handleChange}},[this.pageSizes.map(function(i){return e("el-option",{attrs:{value:i,label:i+" "+t.t("el.pagination.pagesize")}},[])})])])},components:{ElSelect:r.default,ElOption:u.default},methods:{handleChange:function(e){e!==this.$parent.internalPageSize&&(this.$parent.internalPageSize=e=parseInt(e,10),this.$parent.$emit("size-change",e))}}},Jumper:{mixins:[d.default],data:function(){return{oldValue:null}},methods:{handleFocus:function(e){this.oldValue=e.target.value},handleBlur:function(e){var t=e.target;this.reassignMaxValue(t)},handleKeyUp:function(e){var t=e.key||"",i=e.keyCode||"";(t&&"Enter"===t||i&&13===i)&&(this.reassignMaxValue(e.target),this.handleChange({target:e.target}))},handleChange:function(e){var t=e.target;this.$parent.internalCurrentPage=this.$parent.getValidCurrentPage(t.value),this.oldValue=null},reassignMaxValue:function(e){+e.value>this.$parent.internalPageCount&&(e.value=this.$parent.internalPageCount)}},render:function(e){return e("span",{class:"el-pagination__jump"},[this.t("el.pagination.goto"),e("input",{class:"el-pagination__editor",attrs:{type:"number",min:1,max:this.$parent.internalPageCount,value:this.$parent.internalCurrentPage,number:!0},domProps:{value:this.$parent.internalCurrentPage},on:{change:this.handleChange,focus:this.handleFocus,blur:this.handleBlur,keyup:this.handleKeyUp}},[]),this.t("el.pagination.pageClassifier")])}},Total:{mixins:[d.default],render:function(e){return"number"==typeof this.$parent.total?e("span",{class:"el-pagination__total"},[this.t("el.pagination.total",{total:this.$parent.total})]):""}},Pager:o.default},methods:{handleCurrentChange:function(e){this.internalCurrentPage=this.getValidCurrentPage(e)},prev:function(){var e=this.internalCurrentPage-1;this.internalCurrentPage=this.getValidCurrentPage(e)},next:function(){var e=this.internalCurrentPage+1;this.internalCurrentPage=this.getValidCurrentPage(e)},getValidCurrentPage:function(e){e=parseInt(e,10);var t="number"==typeof this.internalPageCount,i=void 0;return t?e<1?i=1:e>this.internalPageCount&&(i=this.internalPageCount):(isNaN(e)||e<1)&&(i=1),void 0===i&&isNaN(e)?i=1:0===i&&(i=1),void 0===i?e:i}},computed:{internalPageCount:function(){return"number"==typeof this.total?Math.ceil(this.total/this.internalPageSize):"number"==typeof this.pageCount?this.pageCount:null}},watch:{currentPage:{immediate:!0,handler:function(e){this.internalCurrentPage=e}},pageSize:{immediate:!0,handler:function(e){this.internalPageSize=e}},internalCurrentPage:function(e,t){var i=this;e=parseInt(e,10),e=isNaN(e)?t||1:this.getValidCurrentPage(e),void 0!==e?this.$nextTick(function(){i.internalCurrentPage=e,t!==e&&(i.$emit("update:currentPage",e),i.$emit("current-change",i.internalCurrentPage))}):(this.$emit("update:currentPage",e),this.$emit("current-change",this.internalCurrentPage))},internalPageCount:function(e){var t=this.internalCurrentPage;e>0&&0===t?this.internalCurrentPage=1:t>e&&(this.internalCurrentPage=0===e?1:e)}}}},function(e,t,i){var n=i(5)(i(6),i(7),null,null,null);e.exports=n.exports},function(e,t){e.exports=function(e,t,i,n,s){var o,a=e=e||{},r=typeof e.default;"object"!==r&&"function"!==r||(o=e,a=e.default);var l="function"==typeof a?a.options:a;t&&(l.render=t.render,l.staticRenderFns=t.staticRenderFns),n&&(l._scopeId=n);var u;if(s?(u=function(e){e=e||this.$vnode&&this.$vnode.ssrContext,e||"undefined"==typeof __VUE_SSR_CONTEXT__||(e=__VUE_SSR_CONTEXT__),i&&i.call(this,e),e&&e._registeredComponents&&e._registeredComponents.add(s)},l._ssrRegister=u):i&&(u=i),u){var c=l.beforeCreate;l.beforeCreate=c?[].concat(c,u):[u]}return{esModule:o,exports:a,options:l}}},function(e,t){"use strict";t.__esModule=!0,t.default={name:"ElPager",props:{currentPage:Number,pageCount:Number},watch:{showPrevMore:function(e){e||(this.quickprevIconClass="el-icon-more")},showNextMore:function(e){e||(this.quicknextIconClass="el-icon-more")}},methods:{onPagerClick:function(e){var t=e.target;if("UL"!==t.tagName){var i=Number(e.target.textContent),n=this.pageCount,s=this.currentPage;t.className.indexOf("more")!==-1&&(t.className.indexOf("quickprev")!==-1?i=s-5:t.className.indexOf("quicknext")!==-1&&(i=s+5)),isNaN(i)||(i<1&&(i=1),i>n&&(i=n)),i!==s&&this.$emit("change",i)}}},computed:{pagers:function(){var e=7,t=Number(this.currentPage),i=Number(this.pageCount),n=!1,s=!1;i>e&&(t>e-3&&(n=!0),t<i-3&&(s=!0));var o=[];if(n&&!s)for(var a=i-(e-2),r=a;r<i;r++)o.push(r);else if(!n&&s)for(var l=2;l<e;l++)o.push(l);else if(n&&s)for(var u=Math.floor(e/2)-1,c=t-u;c<=t+u;c++)o.push(c);else for(var d=2;d<i;d++)o.push(d);return this.showPrevMore=n,this.showNextMore=s,o}},data:function(){return{current:null,showPrevMore:!1,showNextMore:!1,quicknextIconClass:"el-icon-more",quickprevIconClass:"el-icon-more"}}}},function(e,t){e.exports={render:function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("ul",{staticClass:"el-pager",on:{click:e.onPagerClick}},[e.pageCount>0?i("li",{staticClass:"number",class:{active:1===e.currentPage}},[e._v("1")]):e._e(),e.showPrevMore?i("li",{staticClass:"el-icon more btn-quickprev",class:[e.quickprevIconClass],on:{mouseenter:function(t){e.quickprevIconClass="el-icon-d-arrow-left"},mouseleave:function(t){e.quickprevIconClass="el-icon-more"}}}):e._e(),e._l(e.pagers,function(t){return i("li",{staticClass:"number",class:{active:e.currentPage===t}},[e._v(e._s(t))])}),e.showNextMore?i("li",{staticClass:"el-icon more btn-quicknext",class:[e.quicknextIconClass],on:{mouseenter:function(t){e.quicknextIconClass="el-icon-d-arrow-right"},mouseleave:function(t){e.quicknextIconClass="el-icon-more"}}}):e._e(),e.pageCount>1?i("li",{staticClass:"number",class:{active:e.currentPage===e.pageCount}},[e._v(e._s(e.pageCount))]):e._e()],2)},staticRenderFns:[]}},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0;var s=i(9),o=n(s);o.default.install=function(e){e.component(o.default.name,o.default)},t.default=o.default},function(e,t,i){var n=i(5)(i(10),i(50),null,null,null);e.exports=n.exports},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0;var s="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},o=i(11),a=n(o),r=i(12),l=n(r),u=i(19),c=n(u),d=i(25),h=n(d),f=i(34),p=n(f),m=i(37),v=n(m),g=i(41),y=n(g),b=i(46),_=n(b),C=i(48),x=n(C),w=i(30),M=i(43),k=i(13),S=i(49),D=n(S),I=i(18),T={large:42,small:30,mini:22};t.default={mixins:[a.default,l.default],name:"ElSelect",componentName:"ElSelect",computed:{iconClass:function(){var e=this.clearable&&!this.disabled&&this.inputHovering&&!this.multiple&&void 0!==this.value&&""!==this.value;return e?"circle-close is-show-close":this.remote&&this.filterable?"":"caret-top"},debounce:function(){return this.remote?300:0},emptyText:function(){return this.loading?this.loadingText||this.t("el.select.loading"):(!this.remote||""!==this.query||0!==this.options.length)&&(this.filterable&&this.options.length>0&&0===this.filteredOptionsCount?this.noMatchText||this.t("el.select.noMatch"):0===this.options.length?this.noDataText||this.t("el.select.noData"):null)},showNewOption:function(){var e=this,t=this.options.filter(function(e){return!e.created}).some(function(t){return t.currentLabel===e.query});return this.filterable&&this.allowCreate&&""!==this.query&&!t}},components:{ElInput:c.default,ElSelectMenu:h.default,ElOption:p.default,ElTag:v.default,ElScrollbar:y.default},directives:{Clickoutside:x.default},props:{name:String,value:{required:!0},size:String,disabled:Boolean,clearable:Boolean,filterable:Boolean,allowCreate:Boolean,loading:Boolean,popperClass:String,remote:Boolean,loadingText:String,noMatchText:String,noDataText:String,remoteMethod:Function,filterMethod:Function,multiple:Boolean,multipleLimit:{type:Number,default:0},placeholder:{type:String,default:function(){return(0,k.t)("el.select.placeholder")}},defaultFirstOption:Boolean,valueKey:{type:String,default:"value"}},data:function(){return{options:[],cachedOptions:[],createdLabel:null,createdSelected:!1,selected:this.multiple?[]:{},isSelect:!0,inputLength:20,inputWidth:0,cachedPlaceHolder:"",optionsCount:0,filteredOptionsCount:0,visible:!1,selectedLabel:"",hoverIndex:-1,query:"",optionsAllDisabled:!1,inputHovering:!1,currentPlaceholder:""}},watch:{placeholder:function(e){this.cachedPlaceHolder=this.currentPlaceholder=e},value:function(e){this.multiple&&(this.resetInputHeight(),e.length>0||this.$refs.input&&""!==this.query?this.currentPlaceholder="":this.currentPlaceholder=this.cachedPlaceHolder),this.setSelected(),this.filterable&&!this.multiple&&(this.inputLength=20),this.$emit("change",e),this.dispatch("ElFormItem","el.form.change",e)},query:function(e){var t=this;this.$nextTick(function(){t.visible&&t.broadcast("ElSelectDropdown","updatePopper")}),this.hoverIndex=-1,this.multiple&&this.filterable&&(this.inputLength=15*this.$refs.input.value.length+20,this.managePlaceholder(),this.resetInputHeight()),this.remote&&"function"==typeof this.remoteMethod?(this.hoverIndex=-1,this.remoteMethod(e),this.broadcast("ElOption","resetIndex")):"function"==typeof this.filterMethod?(this.filterMethod(e),this.broadcast("ElOptionGroup","queryChange")):(this.filteredOptionsCount=this.optionsCount,this.broadcast("ElOption","queryChange",e),this.broadcast("ElOptionGroup","queryChange")),this.defaultFirstOption&&(this.filterable||this.remote)&&this.filteredOptionsCount&&this.checkDefaultFirstOption()},visible:function(e){var t=this;e?(this.handleIconShow(),this.broadcast("ElSelectDropdown","updatePopper"),this.filterable&&(this.query=this.selectedLabel,this.multiple?this.$refs.input.focus():(this.remote||(this.broadcast("ElOption","queryChange",""),this.broadcast("ElOptionGroup","queryChange")),this.broadcast("ElInput","inputSelect")))):(this.$refs.reference.$el.querySelector("input").blur(),this.handleIconHide(),this.broadcast("ElSelectDropdown","destroyPopper"),this.$refs.input&&this.$refs.input.blur(),this.query="",this.selectedLabel="",this.inputLength=20,this.resetHoverIndex(),this.$nextTick(function(){t.$refs.input&&""===t.$refs.input.value&&0===t.selected.length&&(t.currentPlaceholder=t.cachedPlaceHolder)}),this.multiple||this.selected&&(this.filterable&&this.allowCreate&&this.createdSelected&&this.createdOption?this.selectedLabel=this.createdLabel:this.selectedLabel=this.selected.currentLabel,this.filterable&&(this.query=this.selectedLabel))),this.$emit("visible-change",e)},options:function(e){if(!this.$isServer){this.optionsAllDisabled=e.length===e.filter(function(e){return e.disabled===!0}).length,this.multiple&&this.resetInputHeight();var t=this.$el.querySelectorAll("input");[].indexOf.call(t,document.activeElement)===-1&&this.setSelected(),this.defaultFirstOption&&(this.filterable||this.remote)&&this.filteredOptionsCount&&this.checkDefaultFirstOption()}}},methods:{handleIconHide:function(){var e=this.$el.querySelector(".el-input__icon");e&&(0,w.removeClass)(e,"is-reverse")},handleIconShow:function(){var e=this.$el.querySelector(".el-input__icon");e&&!(0,w.hasClass)(e,"el-icon-circle-close")&&(0,w.addClass)(e,"is-reverse")},scrollToOption:function(e){var t=Array.isArray(e)&&e[0]?e[0].$el:e.$el;if(this.$refs.popper&&t){var i=this.$refs.popper.$el.querySelector(".el-select-dropdown__wrap");(0,D.default)(i,t)}},handleMenuEnter:function(){var e=this;this.$nextTick(function(){return e.scrollToOption(e.selected)})},getOption:function(e){for(var t=void 0,i="[object object]"===Object.prototype.toString.call(e).toLowerCase(),n=this.cachedOptions.length-1;n>=0;n--){var s=this.cachedOptions[n],o=i?(0,I.getValueByPath)(s.value,this.valueKey)===(0,I.getValueByPath)(e,this.valueKey):s.value===e;if(o){t=s;break}}if(t)return t;var a=i?"":e,r={value:e,currentLabel:a};return this.multiple&&(r.hitState=!1),r},setSelected:function(){var e=this;if(!this.multiple){var t=this.getOption(this.value);return t.created?(this.createdLabel=t.currentLabel,this.createdSelected=!0):this.createdSelected=!1,this.selectedLabel=t.currentLabel,this.selected=t,void(this.filterable&&(this.query=this.selectedLabel))}var i=[];Array.isArray(this.value)&&this.value.forEach(function(t){i.push(e.getOption(t))}),this.selected=i,this.$nextTick(function(){e.resetInputHeight()})},handleFocus:function(){this.visible=!0},handleIconClick:function(e){this.iconClass.indexOf("circle-close")>-1?this.deleteSelected(e):this.toggleMenu()},handleMouseDown:function(e){"INPUT"===e.target.tagName&&this.visible&&(this.handleClose(),e.preventDefault())},doDestroy:function(){this.$refs.popper&&this.$refs.popper.doDestroy(),this.dropdownUl=null},handleClose:function(){this.visible=!1},toggleLastOptionHitState:function(e){if(Array.isArray(this.selected)){var t=this.selected[this.selected.length-1];if(t)return e===!0||e===!1?(t.hitState=e,e):(t.hitState=!t.hitState,t.hitState)}},deletePrevTag:function(e){if(e.target.value.length<=0&&!this.toggleLastOptionHitState()){var t=this.value.slice();t.pop(),this.$emit("input",t)}},managePlaceholder:function(){""!==this.currentPlaceholder&&(this.currentPlaceholder=this.$refs.input.value?"":this.cachedPlaceHolder)},resetInputState:function(e){8!==e.keyCode&&this.toggleLastOptionHitState(!1),this.inputLength=15*this.$refs.input.value.length+20,this.resetInputHeight()},resetInputHeight:function(){var e=this;this.$nextTick(function(){if(e.$refs.reference){var t=e.$refs.reference.$el.childNodes,i=[].filter.call(t,function(e){return"INPUT"===e.tagName})[0];i.style.height=Math.max(e.$refs.tags.clientHeight+6,T[e.size]||36)+"px",e.visible&&e.emptyText!==!1&&e.broadcast("ElSelectDropdown","updatePopper")}})},resetHoverIndex:function(){var e=this;setTimeout(function(){e.multiple?e.selected.length>0?e.hoverIndex=Math.min.apply(null,e.selected.map(function(t){return e.options.indexOf(t)})):e.hoverIndex=-1:e.hoverIndex=e.options.indexOf(e.selected)},300)},handleOptionSelect:function(e){var t=this;if(this.multiple){var i=this.value.slice(),n=this.getValueIndex(i,e.value);n>-1?i.splice(n,1):(this.multipleLimit<=0||i.length<this.multipleLimit)&&i.push(e.value),this.$emit("input",i),e.created&&(this.query="",this.inputLength=20),this.filterable&&this.$refs.input.focus()}else this.$emit("input",e.value),this.visible=!1;this.$nextTick(function(){return t.scrollToOption(e)})},getValueIndex:function(){var e=this,t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[],i=arguments[1],n="[object object]"===Object.prototype.toString.call(i).toLowerCase();if(!n)return t.indexOf(i);var o=function(){var n=e.valueKey,s=-1;return t.some(function(e,t){return(0,I.getValueByPath)(e,n)===(0,I.getValueByPath)(i,n)&&(s=t,!0)}),{v:s}}();return"object"===("undefined"==typeof o?"undefined":s(o))?o.v:void 0},toggleMenu:function(){this.filterable&&""===this.query&&this.visible||this.disabled||(this.visible=!this.visible)},navigateOptions:function(e){var t=this;return this.visible?void(0!==this.options.length&&0!==this.filteredOptionsCount&&(this.optionsAllDisabled=this.options.length===this.options.filter(function(e){return e.disabled===!0}).length,this.optionsAllDisabled||("next"===e&&(this.hoverIndex++,this.hoverIndex===this.options.length&&(this.hoverIndex=0),this.options[this.hoverIndex].disabled!==!0&&this.options[this.hoverIndex].groupDisabled!==!0&&this.options[this.hoverIndex].visible||this.navigateOptions("next")),"prev"===e&&(this.hoverIndex--,this.hoverIndex<0&&(this.hoverIndex=this.options.length-1),this.options[this.hoverIndex].disabled!==!0&&this.options[this.hoverIndex].groupDisabled!==!0&&this.options[this.hoverIndex].visible||this.navigateOptions("prev"))),this.$nextTick(function(){return t.scrollToOption(t.options[t.hoverIndex])}))):void(this.visible=!0)},selectOption:function(){this.options[this.hoverIndex]&&this.handleOptionSelect(this.options[this.hoverIndex])},deleteSelected:function(e){e.stopPropagation(),this.$emit("input",""),this.visible=!1,this.$emit("clear")},deleteTag:function(e,t){var i=this.selected.indexOf(t);if(i>-1&&!this.disabled){var n=this.value.slice();n.splice(i,1),this.$emit("input",n),this.$emit("remove-tag",t)}e.stopPropagation()},onInputChange:function(){this.filterable&&(this.query=this.selectedLabel)},onOptionDestroy:function(e){this.optionsCount--,this.filteredOptionsCount--;var t=this.options.indexOf(e);t>-1&&this.options.splice(t,1),this.broadcast("ElOption","resetIndex")},resetInputWidth:function(){this.inputWidth=this.$refs.reference.$el.getBoundingClientRect().width},handleResize:function(){this.resetInputWidth(),this.multiple&&this.resetInputHeight()},checkDefaultFirstOption:function(){this.hoverIndex=-1;for(var e=0;e!==this.options.length;++e){var t=this.options[e];if(this.query){if(!t.disabled&&!t.groupDisabled&&t.visible){this.hoverIndex=e;break}}else if(t.itemSelected){this.hoverIndex=e;break}}},getValueKey:function(e){var t=s(e.value);return"number"===t||"string"===t?e.value:(0,I.getValueByPath)(e.value,this.valueKey)}},created:function(){var e=this;this.cachedPlaceHolder=this.currentPlaceholder=this.placeholder,this.multiple&&!Array.isArray(this.value)&&this.$emit("input",[]),!this.multiple&&Array.isArray(this.value)&&this.$emit("input",""),this.setSelected(),this.debouncedOnInputChange=(0,_.default)(this.debounce,function(){e.onInputChange()}),this.$on("handleOptionClick",this.handleOptionSelect),this.$on("onOptionDestroy",this.onOptionDestroy),this.$on("setSelected",this.setSelected)},mounted:function(){var e=this;this.multiple&&Array.isArray(this.value)&&this.value.length>0&&(this.currentPlaceholder=""),(0,M.addResizeListener)(this.$el,this.handleResize),this.remote&&this.multiple&&this.resetInputHeight(),this.$nextTick(function(){e.$refs.reference&&e.$refs.reference.$el&&(e.inputWidth=e.$refs.reference.$el.getBoundingClientRect().width)})},beforeDestroy:function(){this.$el&&this.handleResize&&(0,M.removeResizeListener)(this.$el,this.handleResize)}}},function(e,t){"use strict";function i(e,t,n){this.$children.forEach(function(s){var o=s.$options.componentName;o===e?s.$emit.apply(s,[t].concat(n)):i.apply(s,[e,t].concat([n]))})}t.__esModule=!0,t.default={methods:{dispatch:function(e,t,i){for(var n=this.$parent||this.$root,s=n.$options.componentName;n&&(!s||s!==e);)n=n.$parent,n&&(s=n.$options.componentName);n&&n.$emit.apply(n,[t].concat(i))},broadcast:function(e,t,n){i.call(this,e,t,n)}}}},function(e,t,i){"use strict";t.__esModule=!0;var n=i(13);t.default={methods:{t:function(){for(var e=arguments.length,t=Array(e),i=0;i<e;i++)t[i]=arguments[i];return n.t.apply(this,t)}}}},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0,t.i18n=t.use=t.t=void 0;var s=i(14),o=n(s),a=i(15),r=n(a),l=i(16),u=n(l),c=i(17),d=n(c),h=(0,d.default)(r.default),f=o.default,p=!1,m=function(){var e=Object.getPrototypeOf(this||r.default).$t;if("function"==typeof e&&r.default.locale)return p||(p=!0,r.default.locale(r.default.config.lang,(0,u.default)(f,r.default.locale(r.default.config.lang)||{},{clone:!0}))),e.apply(this,arguments)},v=t.t=function(e,t){var i=m.apply(this,arguments);if(null!==i&&void 0!==i)return i;for(var n=e.split("."),s=f,o=0,a=n.length;o<a;o++){var r=n[o];if(i=s[r],o===a-1)return h(i,t);if(!i)return"";s=i}return""},g=t.use=function(e){f=e||f},y=t.i18n=function(e){m=e||m};t.default={use:g,t:v,i18n:y}},function(e,t){"use strict";t.__esModule=!0,t.default={el:{colorpicker:{confirm:"确定",clear:"清空"},datepicker:{now:"此刻",today:"今天",cancel:"取消",clear:"清空",confirm:"确定",selectDate:"选择日期",selectTime:"选择时间",startDate:"开始日期",startTime:"开始时间",endDate:"结束日期",endTime:"结束时间",year:"年",month1:"1 月",month2:"2 月",month3:"3 月",month4:"4 月",month5:"5 月",month6:"6 月",month7:"7 月",month8:"8 月",month9:"9 月",month10:"10 月",month11:"11 月",month12:"12 月",weeks:{sun:"日",mon:"一",tue:"二",wed:"三",thu:"四",fri:"五",sat:"六"},months:{jan:"一月",feb:"二月",mar:"三月",apr:"四月",may:"五月",jun:"六月",jul:"七月",aug:"八月",sep:"九月",oct:"十月",nov:"十一月",dec:"十二月"}},select:{loading:"加载中",noMatch:"无匹配数据",noData:"无数据",placeholder:"请选择"},cascader:{noMatch:"无匹配数据",loading:"加载中",placeholder:"请选择"},pagination:{goto:"前往",pagesize:"条/页",total:"共 {total} 条",pageClassifier:"页"},messagebox:{title:"提示",confirm:"确定",cancel:"取消",error:"输入的数据不合法!"},upload:{delete:"删除",preview:"查看图片",continue:"继续上传"},table:{emptyText:"暂无数据",confirmFilter:"筛选",resetFilter:"重置",clearFilter:"全部",sumText:"合计"},tree:{emptyText:"暂无数据"},transfer:{noMatch:"无匹配数据",noData:"无数据",titles:["列表 1","列表 2"],filterPlaceholder:"请输入搜索内容",noCheckedFormat:"共 {total} 项",hasCheckedFormat:"已选 {checked}/{total} 项"}}}},function(t,i){t.exports=e},function(e,t,i){var n,s;!function(o,a){n=a,s="function"==typeof n?n.call(t,i,t,e):n,!(void 0!==s&&(e.exports=s))}(this,function(){function e(e){var t=e&&"object"==typeof e;return t&&"[object RegExp]"!==Object.prototype.toString.call(e)&&"[object Date]"!==Object.prototype.toString.call(e)}function t(e){return Array.isArray(e)?[]:{}}function i(i,n){var s=n&&n.clone===!0;return s&&e(i)?o(t(i),i,n):i}function n(t,n,s){var a=t.slice();return n.forEach(function(n,r){"undefined"==typeof a[r]?a[r]=i(n,s):e(n)?a[r]=o(t[r],n,s):t.indexOf(n)===-1&&a.push(i(n,s))}),a}function s(t,n,s){var a={};return e(t)&&Object.keys(t).forEach(function(e){a[e]=i(t[e],s)}),Object.keys(n).forEach(function(r){e(n[r])&&t[r]?a[r]=o(t[r],n[r],s):a[r]=i(n[r],s)}),a}function o(e,t,o){var a=Array.isArray(t),r=o||{arrayMerge:n},l=r.arrayMerge||n;return a?Array.isArray(e)?l(e,t,o):i(t,o):s(e,t,o)}return o.all=function(e,t){if(!Array.isArray(e)||e.length<2)throw new Error("first argument should be an array with at least two elements");return e.reduce(function(e,i){return o(e,i,t)})},o})},function(e,t,i){"use strict";t.__esModule=!0;var n="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e};t.default=function(e){function t(e){for(var t=arguments.length,i=Array(t>1?t-1:0),a=1;a<t;a++)i[a-1]=arguments[a];return 1===i.length&&"object"===n(i[0])&&(i=i[0]),i&&i.hasOwnProperty||(i={}),e.replace(o,function(t,n,o,a){var r=void 0;return"{"===e[a-1]&&"}"===e[a+t.length]?o:(r=(0,s.hasOwn)(i,o)?i[o]:null,null===r||void 0===r?"":r)})}return t};var s=i(18),o=/(%|)\{([0-9a-zA-Z_]+)\}/g},function(e,t){"use strict";function i(e,t){return o.call(e,t)}function n(e,t){for(var i in t)e[i]=t[i];return e}function s(e){for(var t={},i=0;i<e.length;i++)e[i]&&n(t,e[i]);return t}t.__esModule=!0,t.hasOwn=i,t.toObject=s;var o=Object.prototype.hasOwnProperty;t.getValueByPath=function(e,t){t=t||"";for(var i=t.split("."),n=e,s=null,o=0,a=i.length;o<a;o++){var r=i[o];if(!n)break;if(o===a-1){s=n[r];break}n=n[r]}return s}},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0;var s=i(20),o=n(s);o.default.install=function(e){e.component(o.default.name,o.default)},t.default=o.default},function(e,t,i){var n=i(5)(i(21),i(24),null,null,null);e.exports=n.exports},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0;var s=i(11),o=n(s),a=i(22),r=n(a),l=i(23),u=n(l);t.default={name:"ElInput",componentName:"ElInput",mixins:[o.default],data:function(){return{currentValue:this.value,textareaCalcStyle:{}}},props:{value:[String,Number],placeholder:String,size:String,resize:String,readonly:Boolean,autofocus:Boolean,icon:String,disabled:Boolean,type:{type:String,default:"text"},name:String,autosize:{type:[Boolean,Object],default:!1},rows:{type:Number,default:2},autoComplete:{type:String,default:"off"},form:String,maxlength:Number,minlength:Number,max:{},min:{},step:{},validateEvent:{type:Boolean,default:!0},onIconClick:Function},computed:{validating:function(){return"validating"===this.$parent.validateState},textareaStyle:function(){return(0,u.default)({},this.textareaCalcStyle,{resize:this.resize})}},watch:{value:function(e,t){this.setCurrentValue(e)}},methods:{handleBlur:function(e){this.$emit("blur",e),this.validateEvent&&this.dispatch("ElFormItem","el.form.blur",[this.currentValue])},inputSelect:function(){this.$refs.input.select()},resizeTextarea:function(){if(!this.$isServer){var e=this.autosize,t=this.type;if(e&&"textarea"===t){var i=e.minRows,n=e.maxRows;this.textareaCalcStyle=(0,r.default)(this.$refs.textarea,i,n)}}},handleFocus:function(e){this.$emit("focus",e)},handleInput:function(e){var t=e.target.value;this.$emit("input",t),this.setCurrentValue(t),this.$emit("change",t)},handleIconClick:function(e){this.onIconClick&&this.onIconClick(e),this.$emit("click",e)},setCurrentValue:function(e){var t=this;e!==this.currentValue&&(this.$nextTick(function(e){t.resizeTextarea()}),this.currentValue=e,this.validateEvent&&this.dispatch("ElFormItem","el.form.change",[e]))}},created:function(){this.$on("inputSelect",this.inputSelect)},mounted:function(){this.resizeTextarea()}}},function(e,t){"use strict";function i(e){var t=window.getComputedStyle(e),i=t.getPropertyValue("box-sizing"),n=parseFloat(t.getPropertyValue("padding-bottom"))+parseFloat(t.getPropertyValue("padding-top")),s=parseFloat(t.getPropertyValue("border-bottom-width"))+parseFloat(t.getPropertyValue("border-top-width")),o=a.map(function(e){return e+":"+t.getPropertyValue(e)}).join(";");return{contextStyle:o,
paddingSize:n,borderSize:s,boxSizing:i}}function n(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:null,n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:null;s||(s=document.createElement("textarea"),document.body.appendChild(s));var a=i(e),r=a.paddingSize,l=a.borderSize,u=a.boxSizing,c=a.contextStyle;s.setAttribute("style",c+";"+o),s.value=e.value||e.placeholder||"";var d=s.scrollHeight;"border-box"===u?d+=l:"content-box"===u&&(d-=r),s.value="";var h=s.scrollHeight-r;if(null!==t){var f=h*t;"border-box"===u&&(f=f+r+l),d=Math.max(f,d)}if(null!==n){var p=h*n;"border-box"===u&&(p=p+r+l),d=Math.min(p,d)}return{height:d+"px"}}t.__esModule=!0,t.default=n;var s=void 0,o="\n  height:0 !important;\n  visibility:hidden !important;\n  overflow:hidden !important;\n  position:absolute !important;\n  z-index:-1000 !important;\n  top:0 !important;\n  right:0 !important\n",a=["letter-spacing","line-height","padding-top","padding-bottom","font-family","font-weight","font-size","text-rendering","text-transform","width","text-indent","padding-left","padding-right","border-width","box-sizing"]},function(e,t){"use strict";t.__esModule=!0,t.default=function(e){for(var t=1,i=arguments.length;t<i;t++){var n=arguments[t]||{};for(var s in n)if(n.hasOwnProperty(s)){var o=n[s];void 0!==o&&(e[s]=o)}}return e}},function(e,t){e.exports={render:function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("div",{class:["textarea"===e.type?"el-textarea":"el-input",e.size?"el-input--"+e.size:"",{"is-disabled":e.disabled,"el-input-group":e.$slots.prepend||e.$slots.append,"el-input-group--append":e.$slots.append,"el-input-group--prepend":e.$slots.prepend}]},["textarea"!==e.type?[e.$slots.prepend?i("div",{staticClass:"el-input-group__prepend"},[e._t("prepend")],2):e._e(),e._t("icon",[e.icon?i("i",{staticClass:"el-input__icon",class:["el-icon-"+e.icon,e.onIconClick?"is-clickable":""],on:{click:e.handleIconClick}}):e._e()]),"textarea"!==e.type?i("input",e._b({ref:"input",staticClass:"el-input__inner",attrs:{autocomplete:e.autoComplete},domProps:{value:e.currentValue},on:{input:e.handleInput,focus:e.handleFocus,blur:e.handleBlur}},"input",e.$props)):e._e(),e.validating?i("i",{staticClass:"el-input__icon el-icon-loading"}):e._e(),e.$slots.append?i("div",{staticClass:"el-input-group__append"},[e._t("append")],2):e._e()]:i("textarea",e._b({ref:"textarea",staticClass:"el-textarea__inner",style:e.textareaStyle,domProps:{value:e.currentValue},on:{input:e.handleInput,focus:e.handleFocus,blur:e.handleBlur}},"textarea",e.$props))],2)},staticRenderFns:[]}},function(e,t,i){var n=i(5)(i(26),i(33),null,null,null);e.exports=n.exports},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0;var s=i(27),o=n(s);t.default={name:"ElSelectDropdown",componentName:"ElSelectDropdown",mixins:[o.default],props:{placement:{default:"bottom-start"},boundariesPadding:{default:0},popperOptions:{default:function(){return{forceAbsolute:!0,gpuAcceleration:!1}}}},data:function(){return{minWidth:""}},computed:{popperClass:function(){return this.$parent.popperClass}},watch:{"$parent.inputWidth":function(){this.minWidth=this.$parent.$el.getBoundingClientRect().width+"px"}},mounted:function(){var e=this;this.referenceElm=this.$parent.$refs.reference.$el,this.$parent.popperElm=this.popperElm=this.$el,this.$on("updatePopper",function(){e.$parent.visible&&e.updatePopper()}),this.$on("destroyPopper",this.destroyPopper)}}},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0;var s=i(15),o=n(s),a=i(28),r=o.default.prototype.$isServer?function(){}:i(32),l=function(e){return e.stopPropagation()};t.default={props:{placement:{type:String,default:"bottom"},boundariesPadding:{type:Number,default:5},reference:{},popper:{},offset:{default:0},value:Boolean,visibleArrow:Boolean,transition:String,appendToBody:{type:Boolean,default:!0},popperOptions:{type:Object,default:function(){return{gpuAcceleration:!1}}}},data:function(){return{showPopper:!1,currentPlacement:""}},watch:{value:{immediate:!0,handler:function(e){this.showPopper=e,this.$emit("input",e)}},showPopper:function(e){e?this.updatePopper():this.destroyPopper(),this.$emit("input",e)}},methods:{createPopper:function(){var e=this;if(!this.$isServer&&(this.currentPlacement=this.currentPlacement||this.placement,/^(top|bottom|left|right)(-start|-end)?$/g.test(this.currentPlacement))){var t=this.popperOptions,i=this.popperElm=this.popperElm||this.popper||this.$refs.popper,n=this.referenceElm=this.referenceElm||this.reference||this.$refs.reference;!n&&this.$slots.reference&&this.$slots.reference[0]&&(n=this.referenceElm=this.$slots.reference[0].elm),i&&n&&(this.visibleArrow&&this.appendArrow(i),this.appendToBody&&document.body.appendChild(this.popperElm),this.popperJS&&this.popperJS.destroy&&this.popperJS.destroy(),t.placement=this.currentPlacement,t.offset=this.offset,this.popperJS=new r(n,i,t),this.popperJS.onCreate(function(t){e.$emit("created",e),e.resetTransformOrigin(),e.$nextTick(e.updatePopper)}),"function"==typeof t.onUpdate&&this.popperJS.onUpdate(t.onUpdate),this.popperJS._popper.style.zIndex=a.PopupManager.nextZIndex(),this.popperElm.addEventListener("click",l))}},updatePopper:function(){this.popperJS?this.popperJS.update():this.createPopper()},doDestroy:function(){!this.showPopper&&this.popperJS&&(this.popperJS.destroy(),this.popperJS=null)},destroyPopper:function(){this.popperJS&&this.resetTransformOrigin()},resetTransformOrigin:function(){var e={top:"bottom",bottom:"top",left:"right",right:"left"},t=this.popperJS._popper.getAttribute("x-placement").split("-")[0],i=e[t];this.popperJS._popper.style.transformOrigin=["top","bottom"].indexOf(t)>-1?"center "+i:i+" center"},appendArrow:function(e){var t=void 0;if(!this.appended){this.appended=!0;for(var i in e.attributes)if(/^_v-/.test(e.attributes[i].name)){t=e.attributes[i].name;break}var n=document.createElement("div");t&&n.setAttribute(t,""),n.setAttribute("x-arrow",""),n.className="popper__arrow",e.appendChild(n)}}},beforeDestroy:function(){this.doDestroy(),this.popperElm&&this.popperElm.parentNode===document.body&&(this.popperElm.removeEventListener("click",l),document.body.removeChild(this.popperElm))},deactivated:function(){this.$options.beforeDestroy[0].call(this)}}},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0,t.PopupManager=void 0;var s=i(15),o=n(s),a=i(23),r=n(a),l=i(29),u=n(l),c=i(31),d=n(c),h=i(30),f=1,p=[],m=function(e){if(p.indexOf(e)===-1){var t=function(e){var t=e.__vue__;if(!t){var i=e.previousSibling;i.__vue__&&(t=i.__vue__)}return t};o.default.transition(e,{afterEnter:function(e){var i=t(e);i&&i.doAfterOpen&&i.doAfterOpen()},afterLeave:function(e){var i=t(e);i&&i.doAfterClose&&i.doAfterClose()}})}},v=void 0,g=function e(t){return 3===t.nodeType&&(t=t.nextElementSibling||t.nextSibling,e(t)),t};t.default={model:{prop:"visible",event:"visible-change"},props:{visible:{type:Boolean,default:!1},transition:{type:String,default:""},openDelay:{},closeDelay:{},zIndex:{},modal:{type:Boolean,default:!1},modalFade:{type:Boolean,default:!0},modalClass:{},modalAppendToBody:{type:Boolean,default:!1},lockScroll:{type:Boolean,default:!0},closeOnPressEscape:{type:Boolean,default:!1},closeOnClickModal:{type:Boolean,default:!1}},created:function(){this.transition&&m(this.transition)},beforeMount:function(){this._popupId="popup-"+f++,u.default.register(this._popupId,this)},beforeDestroy:function(){u.default.deregister(this._popupId),u.default.closeModal(this._popupId),this.modal&&null!==this.bodyOverflow&&"hidden"!==this.bodyOverflow&&(document.body.style.overflow=this.bodyOverflow,document.body.style.paddingRight=this.bodyPaddingRight),this.bodyOverflow=null,this.bodyPaddingRight=null},data:function(){return{opened:!1,bodyOverflow:null,bodyPaddingRight:null,rendered:!1}},watch:{visible:function(e){var t=this;if(e){if(this._opening)return;this.rendered?this.open():(this.rendered=!0,o.default.nextTick(function(){t.open()}))}else this.close()}},methods:{open:function(e){var t=this;this.rendered||(this.rendered=!0,this.$emit("visible-change",!0));var i=(0,r.default)({},this.$props||this,e);this._closeTimer&&(clearTimeout(this._closeTimer),this._closeTimer=null),clearTimeout(this._openTimer);var n=Number(i.openDelay);n>0?this._openTimer=setTimeout(function(){t._openTimer=null,t.doOpen(i)},n):this.doOpen(i)},doOpen:function(e){if(!this.$isServer&&(!this.willOpen||this.willOpen())&&!this.opened){this._opening=!0,this.$emit("visible-change",!0);var t=g(this.$el),i=e.modal,n=e.zIndex;if(n&&(u.default.zIndex=n),i&&(this._closing&&(u.default.closeModal(this._popupId),this._closing=!1),u.default.openModal(this._popupId,u.default.nextZIndex(),this.modalAppendToBody?void 0:t,e.modalClass,e.modalFade),e.lockScroll)){this.bodyOverflow||(this.bodyPaddingRight=document.body.style.paddingRight,this.bodyOverflow=document.body.style.overflow),v=(0,d.default)();var s=document.documentElement.clientHeight<document.body.scrollHeight,o=(0,h.getStyle)(document.body,"overflowY");v>0&&(s||"scroll"===o)&&(document.body.style.paddingRight=v+"px"),document.body.style.overflow="hidden"}"static"===getComputedStyle(t).position&&(t.style.position="absolute"),t.style.zIndex=u.default.nextZIndex(),this.opened=!0,this.onOpen&&this.onOpen(),this.transition||this.doAfterOpen()}},doAfterOpen:function(){this._opening=!1},close:function(){var e=this;if(!this.willClose||this.willClose()){null!==this._openTimer&&(clearTimeout(this._openTimer),this._openTimer=null),clearTimeout(this._closeTimer);var t=Number(this.closeDelay);t>0?this._closeTimer=setTimeout(function(){e._closeTimer=null,e.doClose()},t):this.doClose()}},doClose:function(){var e=this;this.$emit("visible-change",!1),this._closing=!0,this.onClose&&this.onClose(),this.lockScroll&&setTimeout(function(){e.modal&&"hidden"!==e.bodyOverflow&&(document.body.style.overflow=e.bodyOverflow,document.body.style.paddingRight=e.bodyPaddingRight),e.bodyOverflow=null,e.bodyPaddingRight=null},200),this.opened=!1,this.transition||this.doAfterClose()},doAfterClose:function(){u.default.closeModal(this._popupId),this._closing=!1}}},t.PopupManager=u.default},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0;var s=i(15),o=n(s),a=i(30),r=!1,l=function(){if(!o.default.prototype.$isServer){var e=c.modalDom;return e?r=!0:(r=!1,e=document.createElement("div"),c.modalDom=e,e.addEventListener("touchmove",function(e){e.preventDefault(),e.stopPropagation()}),e.addEventListener("click",function(){c.doOnModalClick&&c.doOnModalClick()})),e}},u={},c={zIndex:2e3,modalFade:!0,getInstance:function(e){return u[e]},register:function(e,t){e&&t&&(u[e]=t)},deregister:function(e){e&&(u[e]=null,delete u[e])},nextZIndex:function(){return c.zIndex++},modalStack:[],doOnModalClick:function(){var e=c.modalStack[c.modalStack.length-1];if(e){var t=c.getInstance(e.id);t&&t.closeOnClickModal&&t.close()}},openModal:function(e,t,i,n,s){if(!o.default.prototype.$isServer&&e&&void 0!==t){this.modalFade=s;for(var u=this.modalStack,c=0,d=u.length;c<d;c++){var h=u[c];if(h.id===e)return}var f=l();if((0,a.addClass)(f,"v-modal"),this.modalFade&&!r&&(0,a.addClass)(f,"v-modal-enter"),n){var p=n.trim().split(/\s+/);p.forEach(function(e){return(0,a.addClass)(f,e)})}setTimeout(function(){(0,a.removeClass)(f,"v-modal-enter")},200),i&&i.parentNode&&11!==i.parentNode.nodeType?i.parentNode.appendChild(f):document.body.appendChild(f),t&&(f.style.zIndex=t),f.style.display="",this.modalStack.push({id:e,zIndex:t,modalClass:n})}},closeModal:function(e){var t=this.modalStack,i=l();if(t.length>0){var n=t[t.length-1];if(n.id===e){if(n.modalClass){var s=n.modalClass.trim().split(/\s+/);s.forEach(function(e){return(0,a.removeClass)(i,e)})}t.pop(),t.length>0&&(i.style.zIndex=t[t.length-1].zIndex)}else for(var o=t.length-1;o>=0;o--)if(t[o].id===e){t.splice(o,1);break}}0===t.length&&(this.modalFade&&(0,a.addClass)(i,"v-modal-leave"),setTimeout(function(){0===t.length&&(i.parentNode&&i.parentNode.removeChild(i),i.style.display="none",c.modalDom=void 0),(0,a.removeClass)(i,"v-modal-leave")},200))}},d=function(){if(!o.default.prototype.$isServer&&c.modalStack.length>0){var e=c.modalStack[c.modalStack.length-1];if(!e)return;var t=c.getInstance(e.id);return t}};o.default.prototype.$isServer||window.addEventListener("keydown",function(e){if(27===e.keyCode){var t=d();t&&t.closeOnPressEscape&&(t.handleClose?t.handleClose():t.handleAction?t.handleAction("cancel"):t.close())}}),t.default=c},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}function s(e,t){if(!e||!t)return!1;if(t.indexOf(" ")!==-1)throw new Error("className should not contain space.");return e.classList?e.classList.contains(t):(" "+e.className+" ").indexOf(" "+t+" ")>-1}function o(e,t){if(e){for(var i=e.className,n=(t||"").split(" "),o=0,a=n.length;o<a;o++){var r=n[o];r&&(e.classList?e.classList.add(r):s(e,r)||(i+=" "+r))}e.classList||(e.className=i)}}function a(e,t){if(e&&t){for(var i=t.split(" "),n=" "+e.className+" ",o=0,a=i.length;o<a;o++){var r=i[o];r&&(e.classList?e.classList.remove(r):s(e,r)&&(n=n.replace(" "+r+" "," ")))}e.classList||(e.className=m(n))}}function r(e,t,i){if(e&&t)if("object"===("undefined"==typeof t?"undefined":l(t)))for(var n in t)t.hasOwnProperty(n)&&r(e,n,t[n]);else t=v(t),"opacity"===t&&p<9?e.style.filter=isNaN(i)?"":"alpha(opacity="+100*i+")":e.style[t]=i}t.__esModule=!0,t.getStyle=t.once=t.off=t.on=void 0;var l="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e};t.hasClass=s,t.addClass=o,t.removeClass=a,t.setStyle=r;var u=i(15),c=n(u),d=c.default.prototype.$isServer,h=/([\:\-\_]+(.))/g,f=/^moz([A-Z])/,p=d?0:Number(document.documentMode),m=function(e){return(e||"").replace(/^[\s\uFEFF]+|[\s\uFEFF]+$/g,"")},v=function(e){return e.replace(h,function(e,t,i,n){return n?i.toUpperCase():i}).replace(f,"Moz$1")},g=t.on=function(){return!d&&document.addEventListener?function(e,t,i){e&&t&&i&&e.addEventListener(t,i,!1)}:function(e,t,i){e&&t&&i&&e.attachEvent("on"+t,i)}}(),y=t.off=function(){return!d&&document.removeEventListener?function(e,t,i){e&&t&&e.removeEventListener(t,i,!1)}:function(e,t,i){e&&t&&e.detachEvent("on"+t,i)}}();t.once=function(e,t,i){var n=function n(){i&&i.apply(this,arguments),y(e,t,n)};g(e,t,n)},t.getStyle=p<9?function(e,t){if(!d){if(!e||!t)return null;t=v(t),"float"===t&&(t="styleFloat");try{switch(t){case"opacity":try{return e.filters.item("alpha").opacity/100}catch(e){return 1}default:return e.style[t]||e.currentStyle?e.currentStyle[t]:null}}catch(i){return e.style[t]}}}:function(e,t){if(!d){if(!e||!t)return null;t=v(t),"float"===t&&(t="cssFloat");try{var i=document.defaultView.getComputedStyle(e,"");return e.style[t]||i?i[t]:null}catch(i){return e.style[t]}}}},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0,t.default=function(){if(o.default.prototype.$isServer)return 0;if(void 0!==a)return a;var e=document.createElement("div");e.className="el-scrollbar__wrap",e.style.visibility="hidden",e.style.width="100px",e.style.position="absolute",e.style.top="-9999px",document.body.appendChild(e);var t=e.offsetWidth;e.style.overflow="scroll";var i=document.createElement("div");i.style.width="100%",e.appendChild(i);var n=i.offsetWidth;return e.parentNode.removeChild(e),a=t-n};var s=i(15),o=n(s),a=void 0},function(e,t,i){var n,s;!function(o,a){n=a,s="function"==typeof n?n.call(t,i,t,e):n,!(void 0!==s&&(e.exports=s))}(this,function(){"use strict";function e(e,t,i){this._reference=e.jquery?e[0]:e,this.state={};var n="undefined"==typeof t||null===t,s=t&&"[object Object]"===Object.prototype.toString.call(t);return n||s?this._popper=this.parse(s?t:{}):this._popper=t.jquery?t[0]:t,this._options=Object.assign({},v,i),this._options.modifiers=this._options.modifiers.map(function(e){if(this._options.modifiersIgnored.indexOf(e)===-1)return"applyStyle"===e&&this._popper.setAttribute("x-placement",this._options.placement),this.modifiers[e]||e}.bind(this)),this.state.position=this._getPosition(this._popper,this._reference),u(this._popper,{position:this.state.position,top:0}),this.update(),this._setupEventListeners(),this}function t(e){var t=e.style.display,i=e.style.visibility;e.style.display="block",e.style.visibility="hidden";var n=(e.offsetWidth,m.getComputedStyle(e)),s=parseFloat(n.marginTop)+parseFloat(n.marginBottom),o=parseFloat(n.marginLeft)+parseFloat(n.marginRight),a={width:e.offsetWidth+o,height:e.offsetHeight+s};return e.style.display=t,e.style.visibility=i,a}function i(e){var t={left:"right",right:"left",bottom:"top",top:"bottom"};return e.replace(/left|right|bottom|top/g,function(e){return t[e]})}function n(e){var t=Object.assign({},e);return t.right=t.left+t.width,t.bottom=t.top+t.height,t}function s(e,t){var i,n=0;for(i in e){if(e[i]===t)return n;n++}return null}function o(e,t){var i=m.getComputedStyle(e,null);return i[t]}function a(e){var t=e.offsetParent;return t!==m.document.body&&t?t:m.document.documentElement}function r(e){var t=e.parentNode;return t?t===m.document?m.document.body.scrollTop?m.document.body:m.document.documentElement:["scroll","auto"].indexOf(o(t,"overflow"))!==-1||["scroll","auto"].indexOf(o(t,"overflow-x"))!==-1||["scroll","auto"].indexOf(o(t,"overflow-y"))!==-1?t:r(e.parentNode):e}function l(e){return e!==m.document.body&&("fixed"===o(e,"position")||(e.parentNode?l(e.parentNode):e))}function u(e,t){function i(e){return""!==e&&!isNaN(parseFloat(e))&&isFinite(e)}Object.keys(t).forEach(function(n){var s="";["width","height","top","right","bottom","left"].indexOf(n)!==-1&&i(t[n])&&(s="px"),e.style[n]=t[n]+s})}function c(e){var t={};return e&&"[object Function]"===t.toString.call(e)}function d(e){var t={width:e.offsetWidth,height:e.offsetHeight,left:e.offsetLeft,top:e.offsetTop};return t.right=t.left+t.width,t.bottom=t.top+t.height,t}function h(e){var t=e.getBoundingClientRect(),i=navigator.userAgent.indexOf("MSIE")!=-1,n=i&&"HTML"===e.tagName?-e.scrollTop:t.top;return{left:t.left,top:n,right:t.right,bottom:t.bottom,width:t.right-t.left,height:t.bottom-n}}function f(e,t,i){var n=h(e),s=h(t);if(i){var o=r(t);s.top+=o.scrollTop,s.bottom+=o.scrollTop,s.left+=o.scrollLeft,s.right+=o.scrollLeft}var a={top:n.top-s.top,left:n.left-s.left,bottom:n.top-s.top+n.height,right:n.left-s.left+n.width,width:n.width,height:n.height};return a}function p(e){for(var t=["","ms","webkit","moz","o"],i=0;i<t.length;i++){var n=t[i]?t[i]+e.charAt(0).toUpperCase()+e.slice(1):e;if("undefined"!=typeof m.document.body.style[n])return n}return null}var m=window,v={placement:"bottom",gpuAcceleration:!0,offset:0,boundariesElement:"viewport",boundariesPadding:5,preventOverflowOrder:["left","right","top","bottom"],flipBehavior:"flip",arrowElement:"[x-arrow]",modifiers:["shift","offset","preventOverflow","keepTogether","arrow","flip","applyStyle"],modifiersIgnored:[],forceAbsolute:!1};return e.prototype.destroy=function(){return this._popper.removeAttribute("x-placement"),this._popper.style.left="",this._popper.style.position="",this._popper.style.top="",this._popper.style[p("transform")]="",this._removeEventListeners(),this._options.removeOnDestroy&&this._popper.remove(),this},e.prototype.update=function(){var e={instance:this,styles:{}};e.placement=this._options.placement,e._originalPlacement=this._options.placement,e.offsets=this._getOffsets(this._popper,this._reference,e.placement),e.boundaries=this._getBoundaries(e,this._options.boundariesPadding,this._options.boundariesElement),e=this.runModifiers(e,this._options.modifiers),"function"==typeof this.state.updateCallback&&this.state.updateCallback(e)},e.prototype.onCreate=function(e){return e(this),this},e.prototype.onUpdate=function(e){return this.state.updateCallback=e,this},e.prototype.parse=function(e){function t(e,t){t.forEach(function(t){e.classList.add(t)})}function i(e,t){t.forEach(function(t){e.setAttribute(t.split(":")[0],t.split(":")[1]||"")})}var n={tagName:"div",classNames:["popper"],attributes:[],parent:m.document.body,content:"",contentType:"text",arrowTagName:"div",arrowClassNames:["popper__arrow"],arrowAttributes:["x-arrow"]};e=Object.assign({},n,e);var s=m.document,o=s.createElement(e.tagName);if(t(o,e.classNames),i(o,e.attributes),"node"===e.contentType?o.appendChild(e.content.jquery?e.content[0]:e.content):"html"===e.contentType?o.innerHTML=e.content:o.textContent=e.content,e.arrowTagName){var a=s.createElement(e.arrowTagName);t(a,e.arrowClassNames),i(a,e.arrowAttributes),o.appendChild(a)}var r=e.parent.jquery?e.parent[0]:e.parent;if("string"==typeof r){if(r=s.querySelectorAll(e.parent),r.length>1&&console.warn("WARNING: the given `parent` query("+e.parent+") matched more than one element, the first one will be used"),0===r.length)throw"ERROR: the given `parent` doesn't exists!";r=r[0]}return r.length>1&&r instanceof Element==!1&&(console.warn("WARNING: you have passed as parent a list of elements, the first one will be used"),r=r[0]),r.appendChild(o),o},e.prototype._getPosition=function(e,t){var i=a(t);if(this._options.forceAbsolute)return"absolute";var n=l(t,i);return n?"fixed":"absolute"},e.prototype._getOffsets=function(e,i,n){n=n.split("-")[0];var s={};s.position=this.state.position;var o="fixed"===s.position,r=f(i,a(e),o),l=t(e);return["right","left"].indexOf(n)!==-1?(s.top=r.top+r.height/2-l.height/2,"left"===n?s.left=r.left-l.width:s.left=r.right):(s.left=r.left+r.width/2-l.width/2,"top"===n?s.top=r.top-l.height:s.top=r.bottom),s.width=l.width,s.height=l.height,{popper:s,reference:r}},e.prototype._setupEventListeners=function(){if(this.state.updateBound=this.update.bind(this),m.addEventListener("resize",this.state.updateBound),"window"!==this._options.boundariesElement){var e=r(this._reference);e!==m.document.body&&e!==m.document.documentElement||(e=m),e.addEventListener("scroll",this.state.updateBound)}},e.prototype._removeEventListeners=function(){if(m.removeEventListener("resize",this.state.updateBound),"window"!==this._options.boundariesElement){var e=r(this._reference);e!==m.document.body&&e!==m.document.documentElement||(e=m),e.removeEventListener("scroll",this.state.updateBound)}this.state.updateBound=null},e.prototype._getBoundaries=function(e,t,i){var n,s,o={};if("window"===i){var l=m.document.body,u=m.document.documentElement;s=Math.max(l.scrollHeight,l.offsetHeight,u.clientHeight,u.scrollHeight,u.offsetHeight),n=Math.max(l.scrollWidth,l.offsetWidth,u.clientWidth,u.scrollWidth,u.offsetWidth),o={top:0,right:n,bottom:s,left:0}}else if("viewport"===i){var c=a(this._popper),h=r(this._popper),f=d(c),p=function(e){return e==document.body?Math.max(document.documentElement.scrollTop,document.body.scrollTop):e.scrollTop},v=function(e){return e==document.body?Math.max(document.documentElement.scrollLeft,document.body.scrollLeft):e.scrollLeft},g="fixed"===e.offsets.popper.position?0:p(h),y="fixed"===e.offsets.popper.position?0:v(h);o={top:0-(f.top-g),right:m.document.documentElement.clientWidth-(f.left-y),bottom:m.document.documentElement.clientHeight-(f.top-g),left:0-(f.left-y)}}else o=a(this._popper)===i?{top:0,left:0,right:i.clientWidth,bottom:i.clientHeight}:d(i);return o.left+=t,o.right-=t,o.top=o.top+t,o.bottom=o.bottom-t,o},e.prototype.runModifiers=function(e,t,i){var n=t.slice();return void 0!==i&&(n=this._options.modifiers.slice(0,s(this._options.modifiers,i))),n.forEach(function(t){c(t)&&(e=t.call(this,e))}.bind(this)),e},e.prototype.isModifierRequired=function(e,t){var i=s(this._options.modifiers,e);return!!this._options.modifiers.slice(0,i).filter(function(e){return e===t}).length},e.prototype.modifiers={},e.prototype.modifiers.applyStyle=function(e){var t,i={position:e.offsets.popper.position},n=Math.round(e.offsets.popper.left),s=Math.round(e.offsets.popper.top);return this._options.gpuAcceleration&&(t=p("transform"))?(i[t]="translate3d("+n+"px, "+s+"px, 0)",i.top=0,i.left=0):(i.left=n,i.top=s),Object.assign(i,e.styles),u(this._popper,i),this._popper.setAttribute("x-placement",e.placement),this.isModifierRequired(this.modifiers.applyStyle,this.modifiers.arrow)&&e.offsets.arrow&&u(e.arrowElement,e.offsets.arrow),e},e.prototype.modifiers.shift=function(e){var t=e.placement,i=t.split("-")[0],s=t.split("-")[1];if(s){var o=e.offsets.reference,a=n(e.offsets.popper),r={y:{start:{top:o.top},end:{top:o.top+o.height-a.height}},x:{start:{left:o.left},end:{left:o.left+o.width-a.width}}},l=["bottom","top"].indexOf(i)!==-1?"x":"y";e.offsets.popper=Object.assign(a,r[l][s])}return e},e.prototype.modifiers.preventOverflow=function(e){var t=this._options.preventOverflowOrder,i=n(e.offsets.popper),s={left:function(){var t=i.left;return i.left<e.boundaries.left&&(t=Math.max(i.left,e.boundaries.left)),{left:t}},right:function(){var t=i.left;return i.right>e.boundaries.right&&(t=Math.min(i.left,e.boundaries.right-i.width)),{left:t}},top:function(){var t=i.top;return i.top<e.boundaries.top&&(t=Math.max(i.top,e.boundaries.top)),{top:t}},bottom:function(){var t=i.top;return i.bottom>e.boundaries.bottom&&(t=Math.min(i.top,e.boundaries.bottom-i.height)),{top:t}}};return t.forEach(function(t){e.offsets.popper=Object.assign(i,s[t]())}),e},e.prototype.modifiers.keepTogether=function(e){var t=n(e.offsets.popper),i=e.offsets.reference,s=Math.floor;return t.right<s(i.left)&&(e.offsets.popper.left=s(i.left)-t.width),t.left>s(i.right)&&(e.offsets.popper.left=s(i.right)),t.bottom<s(i.top)&&(e.offsets.popper.top=s(i.top)-t.height),t.top>s(i.bottom)&&(e.offsets.popper.top=s(i.bottom)),e},e.prototype.modifiers.flip=function(e){if(!this.isModifierRequired(this.modifiers.flip,this.modifiers.preventOverflow))return console.warn("WARNING: preventOverflow modifier is required by flip modifier in order to work, be sure to include it before flip!"),e;if(e.flipped&&e.placement===e._originalPlacement)return e;var t=e.placement.split("-")[0],s=i(t),o=e.placement.split("-")[1]||"",a=[];return a="flip"===this._options.flipBehavior?[t,s]:this._options.flipBehavior,a.forEach(function(r,l){if(t===r&&a.length!==l+1){t=e.placement.split("-")[0],s=i(t);var u=n(e.offsets.popper),c=["right","bottom"].indexOf(t)!==-1;(c&&Math.floor(e.offsets.reference[t])>Math.floor(u[s])||!c&&Math.floor(e.offsets.reference[t])<Math.floor(u[s]))&&(e.flipped=!0,e.placement=a[l+1],o&&(e.placement+="-"+o),e.offsets.popper=this._getOffsets(this._popper,this._reference,e.placement).popper,e=this.runModifiers(e,this._options.modifiers,this._flip))}}.bind(this)),e},e.prototype.modifiers.offset=function(e){var t=this._options.offset,i=e.offsets.popper;return e.placement.indexOf("left")!==-1?i.top-=t:e.placement.indexOf("right")!==-1?i.top+=t:e.placement.indexOf("top")!==-1?i.left-=t:e.placement.indexOf("bottom")!==-1&&(i.left+=t),e},e.prototype.modifiers.arrow=function(e){var i=this._options.arrowElement;if("string"==typeof i&&(i=this._popper.querySelector(i)),!i)return e;if(!this._popper.contains(i))return console.warn("WARNING: `arrowElement` must be child of its popper element!"),e;if(!this.isModifierRequired(this.modifiers.arrow,this.modifiers.keepTogether))return console.warn("WARNING: keepTogether modifier is required by arrow modifier in order to work, be sure to include it before arrow!"),e;var s={},o=e.placement.split("-")[0],a=n(e.offsets.popper),r=e.offsets.reference,l=["left","right"].indexOf(o)!==-1,u=l?"height":"width",c=l?"top":"left",d=l?"left":"top",h=l?"bottom":"right",f=t(i)[u];r[h]-f<a[c]&&(e.offsets.popper[c]-=a[c]-(r[h]-f)),r[c]+f>a[h]&&(e.offsets.popper[c]+=r[c]+f-a[h]);var p=r[c]+r[u]/2-f/2,m=p-a[c];return m=Math.max(Math.min(a[u]-f-3,m),3),s[c]=m,s[d]="",e.offsets.arrow=s,e.arrowElement=i,e},Object.assign||Object.defineProperty(Object,"assign",{enumerable:!1,configurable:!0,writable:!0,value:function(e){if(void 0===e||null===e)throw new TypeError("Cannot convert first argument to object");for(var t=Object(e),i=1;i<arguments.length;i++){var n=arguments[i];if(void 0!==n&&null!==n){n=Object(n);for(var s=Object.keys(n),o=0,a=s.length;o<a;o++){var r=s[o],l=Object.getOwnPropertyDescriptor(n,r);void 0!==l&&l.enumerable&&(t[r]=n[r])}}}return t}}),e})},function(e,t){e.exports={render:function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("div",{staticClass:"el-select-dropdown",class:[{"is-multiple":e.$parent.multiple},e.popperClass],style:{minWidth:e.minWidth}},[e._t("default")],2)},staticRenderFns:[]}},function(e,t,i){var n=i(5)(i(35),i(36),null,null,null);e.exports=n.exports},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0;var s="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},o=i(11),a=n(o),r=i(18);t.default={mixins:[a.default],name:"ElOption",componentName:"ElOption",props:{value:{required:!0},label:[String,Number],created:Boolean,disabled:{type:Boolean,default:!1}},data:function(){return{index:-1,groupDisabled:!1,visible:!0,hitState:!1}},computed:{isObject:function(){return"[object object]"===Object.prototype.toString.call(this.value).toLowerCase()},currentLabel:function(){return this.label||(this.isObject?"":this.value)},currentValue:function(){return this.value||this.label||""},parent:function(){for(var e=this.$parent;!e.isSelect;)e=e.$parent;return e},itemSelected:function(){return this.parent.multiple?this.contains(this.parent.value,this.value):this.isEqual(this.value,this.parent.value)},limitReached:function(){return!!this.parent.multiple&&(!this.itemSelected&&this.parent.value.length>=this.parent.multipleLimit&&this.parent.multipleLimit>0)}},watch:{currentLabel:function(){this.created||this.parent.remote||this.dispatch("ElSelect","setSelected")},value:function(){this.created||this.parent.remote||this.dispatch("ElSelect","setSelected")}},methods:{isEqual:function(e,t){if(this.isObject){var i=this.parent.valueKey;return(0,r.getValueByPath)(e,i)===(0,r.getValueByPath)(t,i)}return e===t},contains:function(){var e=this,t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[],i=arguments[1];if(!this.isObject)return t.indexOf(i)>-1;var n=function(){var n=e.parent.valueKey;return{v:t.some(function(e){return(0,r.getValueByPath)(e,n)===(0,r.getValueByPath)(i,n)})}}();return"object"===("undefined"==typeof n?"undefined":s(n))?n.v:void 0},handleGroupDisabled:function(e){this.groupDisabled=e},hoverItem:function(){this.disabled||this.groupDisabled||(this.parent.hoverIndex=this.parent.options.indexOf(this))},selectOptionClick:function(){this.disabled!==!0&&this.groupDisabled!==!0&&this.dispatch("ElSelect","handleOptionClick",this)},queryChange:function(e){var t=String(e).replace(/(\^|\(|\)|\[|\]|\$|\*|\+|\.|\?|\\|\{|\}|\|)/g,"\\$1");this.visible=new RegExp(t,"i").test(this.currentLabel)||this.created,this.visible||this.parent.filteredOptionsCount--},resetIndex:function(){var e=this;this.$nextTick(function(){e.index=e.parent.options.indexOf(e)})}},created:function(){this.parent.options.push(this),this.parent.cachedOptions.push(this),this.parent.optionsCount++,this.parent.filteredOptionsCount++,this.index=this.parent.options.indexOf(this),this.$on("queryChange",this.queryChange),this.$on("handleGroupDisabled",this.handleGroupDisabled),this.$on("resetIndex",this.resetIndex)},beforeDestroy:function(){this.dispatch("ElSelect","onOptionDestroy",this)}}},function(e,t){e.exports={render:function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("li",{directives:[{name:"show",rawName:"v-show",value:e.visible,expression:"visible"}],staticClass:"el-select-dropdown__item",class:{selected:e.itemSelected,"is-disabled":e.disabled||e.groupDisabled||e.limitReached,hover:e.parent.hoverIndex===e.index},on:{mouseenter:e.hoverItem,click:function(t){t.stopPropagation(),e.selectOptionClick(t)}}},[e._t("default",[i("span",[e._v(e._s(e.currentLabel))])])],2);
},staticRenderFns:[]}},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0;var s=i(38),o=n(s);o.default.install=function(e){e.component(o.default.name,o.default)},t.default=o.default},function(e,t,i){var n=i(5)(i(39),i(40),null,null,null);e.exports=n.exports},function(e,t){"use strict";t.__esModule=!0,t.default={name:"ElTag",props:{text:String,closable:Boolean,type:String,hit:Boolean,closeTransition:Boolean,color:String},methods:{handleClose:function(e){this.$emit("close",e)}}}},function(e,t){e.exports={render:function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("transition",{attrs:{name:e.closeTransition?"":"el-zoom-in-center"}},[i("span",{staticClass:"el-tag",class:[e.type?"el-tag--"+e.type:"",{"is-hit":e.hit}],style:{backgroundColor:e.color}},[e._t("default"),e.closable?i("i",{staticClass:"el-tag__close el-icon-close",on:{click:e.handleClose}}):e._e()],2)])},staticRenderFns:[]}},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0;var s=i(42),o=n(s);o.default.install=function(e){e.component(o.default.name,o.default)},t.default=o.default},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0;var s=i(43),o=i(31),a=n(o),r=i(18),l=i(44),u=n(l);t.default={name:"ElScrollbar",components:{Bar:u.default},props:{native:Boolean,wrapStyle:{},wrapClass:{},viewClass:{},viewStyle:{},noresize:Boolean,tag:{type:String,default:"div"}},data:function(){return{sizeWidth:"0",sizeHeight:"0",moveX:0,moveY:0}},computed:{wrap:function(){return this.$refs.wrap}},render:function(e){var t=(0,a.default)(),i=this.wrapStyle;if(t){var n="-"+t+"px",s="margin-bottom: "+n+"; margin-right: "+n+";";Array.isArray(this.wrapStyle)?(i=(0,r.toObject)(this.wrapStyle),i.marginRight=i.marginBottom=n):"string"==typeof this.wrapStyle?i+=s:i=s}var o=e(this.tag,{class:["el-scrollbar__view",this.viewClass],style:this.viewStyle,ref:"resize"},this.$slots.default),l=e("div",{ref:"wrap",style:i,on:{scroll:this.handleScroll},class:[this.wrapClass,"el-scrollbar__wrap",t?"":"el-scrollbar__wrap--hidden-default"]},[[o]]),c=void 0;return c=this.native?[e("div",{ref:"wrap",class:[this.wrapClass,"el-scrollbar__wrap"],style:i},[[o]])]:[l,e(u.default,{attrs:{move:this.moveX,size:this.sizeWidth}},[]),e(u.default,{attrs:{vertical:!0,move:this.moveY,size:this.sizeHeight}},[])],e("div",{class:"el-scrollbar"},c)},methods:{handleScroll:function(){var e=this.wrap;this.moveY=100*e.scrollTop/e.clientHeight,this.moveX=100*e.scrollLeft/e.clientWidth},update:function(){var e=void 0,t=void 0,i=this.wrap;i&&(e=100*i.clientHeight/i.scrollHeight,t=100*i.clientWidth/i.scrollWidth,this.sizeHeight=e<100?e+"%":"",this.sizeWidth=t<100?t+"%":"")}},mounted:function(){this.native||(this.$nextTick(this.update),!this.noresize&&(0,s.addResizeListener)(this.$refs.resize,this.update))},beforeDestroy:function(){this.native||!this.noresize&&(0,s.removeResizeListener)(this.$refs.resize,this.update)}}},function(e,t){"use strict";t.__esModule=!0;var i="undefined"==typeof window,n=function(){if(!i){var e=window.requestAnimationFrame||window.mozRequestAnimationFrame||window.webkitRequestAnimationFrame||function(e){return window.setTimeout(e,20)};return function(t){return e(t)}}}(),s=function(){if(!i){var e=window.cancelAnimationFrame||window.mozCancelAnimationFrame||window.webkitCancelAnimationFrame||window.clearTimeout;return function(t){return e(t)}}}(),o=function(e){var t=e.__resizeTrigger__,i=t.firstElementChild,n=t.lastElementChild,s=i.firstElementChild;n.scrollLeft=n.scrollWidth,n.scrollTop=n.scrollHeight,s.style.width=i.offsetWidth+1+"px",s.style.height=i.offsetHeight+1+"px",i.scrollLeft=i.scrollWidth,i.scrollTop=i.scrollHeight},a=function(e){return e.offsetWidth!==e.__resizeLast__.width||e.offsetHeight!==e.__resizeLast__.height},r=function(e){var t=this;o(this),this.__resizeRAF__&&s(this.__resizeRAF__),this.__resizeRAF__=n(function(){a(t)&&(t.__resizeLast__.width=t.offsetWidth,t.__resizeLast__.height=t.offsetHeight,t.__resizeListeners__.forEach(function(i){i.call(t,e)}))})},l=i?{}:document.attachEvent,u="Webkit Moz O ms".split(" "),c="webkitAnimationStart animationstart oAnimationStart MSAnimationStart".split(" "),d="resizeanim",h=!1,f="",p="animationstart";if(!l&&!i){var m=document.createElement("fakeelement");if(void 0!==m.style.animationName&&(h=!0),h===!1)for(var v="",g=0;g<u.length;g++)if(void 0!==m.style[u[g]+"AnimationName"]){v=u[g],f="-"+v.toLowerCase()+"-",p=c[g],h=!0;break}}var y=!1,b=function(){if(!y&&!i){var e="@"+f+"keyframes "+d+" { from { opacity: 0; } to { opacity: 0; } } ",t=f+"animation: 1ms "+d+";",n=e+"\n      .resize-triggers { "+t+' visibility: hidden; opacity: 0; }\n      .resize-triggers, .resize-triggers > div, .contract-trigger:before { content: " "; display: block; position: absolute; top: 0; left: 0; height: 100%; width: 100%; overflow: hidden; z-index: -1 }\n      .resize-triggers > div { background: #eee; overflow: auto; }\n      .contract-trigger:before { width: 200%; height: 200%; }',s=document.head||document.getElementsByTagName("head")[0],o=document.createElement("style");o.type="text/css",o.styleSheet?o.styleSheet.cssText=n:o.appendChild(document.createTextNode(n)),s.appendChild(o),y=!0}};t.addResizeListener=function(e,t){if(!i)if(l)e.attachEvent("onresize",t);else{if(!e.__resizeTrigger__){"static"===getComputedStyle(e).position&&(e.style.position="relative"),b(),e.__resizeLast__={},e.__resizeListeners__=[];var n=e.__resizeTrigger__=document.createElement("div");n.className="resize-triggers",n.innerHTML='<div class="expand-trigger"><div></div></div><div class="contract-trigger"></div>',e.appendChild(n),o(e),e.addEventListener("scroll",r,!0),p&&n.addEventListener(p,function(t){t.animationName===d&&o(e)})}e.__resizeListeners__.push(t)}},t.removeResizeListener=function(e,t){l?e.detachEvent("onresize",t):(e.__resizeListeners__.splice(e.__resizeListeners__.indexOf(t),1),e.__resizeListeners__.length||(e.removeEventListener("scroll",r),e.__resizeTrigger__=!e.removeChild(e.__resizeTrigger__)))}},function(e,t,i){"use strict";t.__esModule=!0;var n=i(30),s=i(45);t.default={name:"Bar",props:{vertical:Boolean,size:String,move:Number},computed:{bar:function(){return s.BAR_MAP[this.vertical?"vertical":"horizontal"]},wrap:function(){return this.$parent.wrap}},render:function(e){var t=this.size,i=this.move,n=this.bar;return e("div",{class:["el-scrollbar__bar","is-"+n.key],on:{mousedown:this.clickTrackHandler}},[e("div",{ref:"thumb",class:"el-scrollbar__thumb",on:{mousedown:this.clickThumbHandler},style:(0,s.renderThumbStyle)({size:t,move:i,bar:n})},[])])},methods:{clickThumbHandler:function(e){this.startDrag(e),this[this.bar.axis]=e.currentTarget[this.bar.offset]-(e[this.bar.client]-e.currentTarget.getBoundingClientRect()[this.bar.direction])},clickTrackHandler:function(e){var t=Math.abs(e.target.getBoundingClientRect()[this.bar.direction]-e[this.bar.client]),i=this.$refs.thumb[this.bar.offset]/2,n=100*(t-i)/this.$el[this.bar.offset];this.wrap[this.bar.scroll]=n*this.wrap[this.bar.scrollSize]/100},startDrag:function(e){e.stopImmediatePropagation(),this.cursorDown=!0,(0,n.on)(document,"mousemove",this.mouseMoveDocumentHandler),(0,n.on)(document,"mouseup",this.mouseUpDocumentHandler),document.onselectstart=function(){return!1}},mouseMoveDocumentHandler:function(e){if(this.cursorDown!==!1){var t=this[this.bar.axis];if(t){var i=(this.$el.getBoundingClientRect()[this.bar.direction]-e[this.bar.client])*-1,n=this.$refs.thumb[this.bar.offset]-t,s=100*(i-n)/this.$el[this.bar.offset];this.wrap[this.bar.scroll]=s*this.wrap[this.bar.scrollSize]/100}}},mouseUpDocumentHandler:function(e){this.cursorDown=!1,this[this.bar.axis]=0,(0,n.off)(document,"mousemove",this.mouseMoveDocumentHandler),document.onselectstart=null}},destroyed:function(){(0,n.off)(document,"mouseup",this.mouseUpDocumentHandler)}}},function(e,t){"use strict";function i(e){var t=e.move,i=e.size,n=e.bar,s={},o="translate"+n.axis+"("+t+"%)";return s[n.size]=i,s.transform=o,s.msTransform=o,s.webkitTransform=o,s}t.__esModule=!0,t.renderThumbStyle=i;t.BAR_MAP={vertical:{offset:"offsetHeight",scroll:"scrollTop",scrollSize:"scrollHeight",size:"height",key:"vertical",axis:"Y",client:"clientY",direction:"top"},horizontal:{offset:"offsetWidth",scroll:"scrollLeft",scrollSize:"scrollWidth",size:"width",key:"horizontal",axis:"X",client:"clientX",direction:"left"}}},function(e,t,i){var n=i(47);e.exports=function(e,t,i){return void 0===i?n(e,t,!1):n(e,i,t!==!1)}},function(e,t){e.exports=function(e,t,i,n){function s(){function s(){a=Number(new Date),i.apply(l,c)}function r(){o=void 0}var l=this,u=Number(new Date)-a,c=arguments;n&&!o&&s(),o&&clearTimeout(o),void 0===n&&u>e?s():t!==!0&&(o=setTimeout(n?r:s,void 0===n?e-u:e))}var o,a=0;return"boolean"!=typeof t&&(n=i,i=t,t=void 0),s}},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0;var s=i(15),o=n(s),a=i(30),r=[],l="@@clickoutsideContext",u=void 0;!o.default.prototype.$isServer&&(0,a.on)(document,"mousedown",function(e){return u=e}),!o.default.prototype.$isServer&&(0,a.on)(document,"mouseup",function(e){r.forEach(function(t){return t[l].documentHandler(e,u)})}),t.default={bind:function(e,t,i){var n=r.push(e)-1,s=function(){var n=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},s=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};!(i.context&&n.target&&s.target)||e.contains(n.target)||e.contains(s.target)||e===n.target||i.context.popperElm&&(i.context.popperElm.contains(n.target)||i.context.popperElm.contains(s.target))||(t.expression&&e[l].methodName&&i.context[e[l].methodName]?i.context[e[l].methodName]():e[l].bindingFn&&e[l].bindingFn())};e[l]={id:n,documentHandler:s,methodName:t.expression,bindingFn:t.value}},update:function(e,t){e[l].methodName=t.expression,e[l].bindingFn=t.value},unbind:function(e){for(var t=r.length,i=0;i<t;i++)if(r[i][l].id===e[l].id){r.splice(i,1);break}}}},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}function s(e,t){if(!a.default.prototype.$isServer){if(!t)return void(e.scrollTop=0);var i=t.offsetTop,n=t.offsetTop+t.offsetHeight,s=e.scrollTop,o=s+e.clientHeight;i<s?e.scrollTop=i:n>o&&(e.scrollTop=n-e.clientHeight)}}t.__esModule=!0,t.default=s;var o=i(15),a=n(o)},function(e,t){e.exports={render:function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("div",{directives:[{name:"clickoutside",rawName:"v-clickoutside",value:e.handleClose,expression:"handleClose"}],staticClass:"el-select"},[e.multiple?i("div",{ref:"tags",staticClass:"el-select__tags",style:{"max-width":e.inputWidth-32+"px"},on:{click:function(t){t.stopPropagation(),e.toggleMenu(t)}}},[i("transition-group",{on:{"after-leave":e.resetInputHeight}},e._l(e.selected,function(t){return i("el-tag",{key:e.getValueKey(t),attrs:{closable:!e.disabled,hit:t.hitState,type:"primary","close-transition":""},on:{close:function(i){e.deleteTag(i,t)}}},[i("span",{staticClass:"el-select__tags-text"},[e._v(e._s(t.currentLabel))])])})),e.filterable?i("input",{directives:[{name:"model",rawName:"v-model",value:e.query,expression:"query"}],ref:"input",staticClass:"el-select__input",class:"is-"+e.size,style:{width:e.inputLength+"px","max-width":e.inputWidth-42+"px"},attrs:{type:"text",disabled:e.disabled,debounce:e.remote?300:0},domProps:{value:e.query},on:{focus:function(t){e.visible=!0},keyup:e.managePlaceholder,keydown:[e.resetInputState,function(t){return"button"in t||!e._k(t.keyCode,"down",40)?(t.preventDefault(),void e.navigateOptions("next")):null},function(t){return"button"in t||!e._k(t.keyCode,"up",38)?(t.preventDefault(),void e.navigateOptions("prev")):null},function(t){return"button"in t||!e._k(t.keyCode,"enter",13)?(t.preventDefault(),void e.selectOption(t)):null},function(t){return"button"in t||!e._k(t.keyCode,"esc",27)?(t.stopPropagation(),t.preventDefault(),void(e.visible=!1)):null},function(t){return"button"in t||!e._k(t.keyCode,"delete",[8,46])?void e.deletePrevTag(t):null}],input:function(t){t.target.composing||(e.query=t.target.value)}}}):e._e()],1):e._e(),i("el-input",{ref:"reference",attrs:{type:"text",placeholder:e.currentPlaceholder,name:e.name,size:e.size,disabled:e.disabled,readonly:!e.filterable||e.multiple,"validate-event":!1,icon:e.iconClass},on:{focus:e.handleFocus,click:e.handleIconClick},nativeOn:{mousedown:function(t){e.handleMouseDown(t)},keyup:function(t){e.debouncedOnInputChange(t)},keydown:[function(t){return"button"in t||!e._k(t.keyCode,"down",40)?(t.preventDefault(),void e.navigateOptions("next")):null},function(t){return"button"in t||!e._k(t.keyCode,"up",38)?(t.preventDefault(),void e.navigateOptions("prev")):null},function(t){return"button"in t||!e._k(t.keyCode,"enter",13)?(t.preventDefault(),void e.selectOption(t)):null},function(t){return"button"in t||!e._k(t.keyCode,"esc",27)?(t.stopPropagation(),t.preventDefault(),void(e.visible=!1)):null},function(t){return"button"in t||!e._k(t.keyCode,"tab",9)?void(e.visible=!1):null}],paste:function(t){e.debouncedOnInputChange(t)},mouseenter:function(t){e.inputHovering=!0},mouseleave:function(t){e.inputHovering=!1}},model:{value:e.selectedLabel,callback:function(t){e.selectedLabel=t},expression:"selectedLabel"}}),i("transition",{attrs:{name:"el-zoom-in-top"},on:{"before-enter":e.handleMenuEnter,"after-leave":e.doDestroy}},[i("el-select-menu",{directives:[{name:"show",rawName:"v-show",value:e.visible&&e.emptyText!==!1,expression:"visible && emptyText !== false"}],ref:"popper"},[i("el-scrollbar",{directives:[{name:"show",rawName:"v-show",value:e.options.length>0&&!e.loading,expression:"options.length > 0 && !loading"}],class:{"is-empty":!e.allowCreate&&0===e.filteredOptionsCount},attrs:{tag:"ul","wrap-class":"el-select-dropdown__wrap","view-class":"el-select-dropdown__list"}},[e.showNewOption?i("el-option",{attrs:{value:e.query,created:""}}):e._e(),e._t("default")],2),e.emptyText&&(e.allowCreate&&0===e.options.length||!e.allowCreate)?i("p",{staticClass:"el-select-dropdown__empty"},[e._v(e._s(e.emptyText))]):e._e()],1)],1)],1)},staticRenderFns:[]}},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0;var s=i(34),o=n(s);o.default.install=function(e){e.component(o.default.name,o.default)},t.default=o.default},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0;var s=i(53),o=n(s);o.default.install=function(e){e.component(o.default.name,o.default)},t.default=o.default},function(e,t,i){var n=i(5)(i(54),i(55),null,null,null);e.exports=n.exports},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0;var s=i(28),o=n(s),a=i(11),r=n(a);t.default={name:"ElDialog",mixins:[o.default,r.default],props:{title:{type:String,default:""},modal:{type:Boolean,default:!0},modalAppendToBody:{type:Boolean,default:!0},lockScroll:{type:Boolean,default:!0},closeOnClickModal:{type:Boolean,default:!0},closeOnPressEscape:{type:Boolean,default:!0},showClose:{type:Boolean,default:!0},size:{type:String,default:"small"},customClass:{type:String,default:""},top:{type:String,default:"15%"},beforeClose:Function},watch:{visible:function(e){var t=this;this.$emit("update:visible",e),e?(this.$emit("open"),this.$el.addEventListener("scroll",this.updatePopper),this.$nextTick(function(){t.$refs.dialog.scrollTop=0})):(this.$el.removeEventListener("scroll",this.updatePopper),this.$emit("close"))}},computed:{sizeClass:function(){return"el-dialog--"+this.size},style:function(){return"full"===this.size?{}:{top:this.top}}},methods:{handleWrapperClick:function(){this.closeOnClickModal&&this.handleClose()},handleClose:function(){"function"==typeof this.beforeClose?this.beforeClose(this.hide):this.hide()},hide:function(e){e!==!1&&(this.$emit("update:visible",!1),this.$emit("visible-change",!1))},updatePopper:function(){this.broadcast("ElSelectDropdown","updatePopper"),this.broadcast("ElDropdownMenu","updatePopper")}},mounted:function(){this.visible&&(this.rendered=!0,this.open())}}},function(e,t){e.exports={render:function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("transition",{attrs:{name:"dialog-fade"}},[i("div",{directives:[{name:"show",rawName:"v-show",value:e.visible,expression:"visible"}],staticClass:"el-dialog__wrapper",on:{click:function(t){return t.target!==t.currentTarget?null:void e.handleWrapperClick(t)}}},[i("div",{ref:"dialog",staticClass:"el-dialog",class:[e.sizeClass,e.customClass],style:e.style},[i("div",{staticClass:"el-dialog__header"},[e._t("title",[i("span",{staticClass:"el-dialog__title"},[e._v(e._s(e.title))])]),e.showClose?i("button",{staticClass:"el-dialog__headerbtn",attrs:{type:"button","aria-label":"Close"},on:{click:e.handleClose}},[i("i",{staticClass:"el-dialog__close el-icon el-icon-close"})]):e._e()],2),e.rendered?i("div",{staticClass:"el-dialog__body"},[e._t("default")],2):e._e(),e.$slots.footer?i("div",{staticClass:"el-dialog__footer"},[e._t("footer")],2):e._e()])])])},staticRenderFns:[]}},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0;var s=i(57),o=n(s);o.default.install=function(e){e.component(o.default.name,o.default)},t.default=o.default},function(e,t,i){var n=i(5)(i(58),i(62),null,null,null);e.exports=n.exports},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0;var s=i(19),o=n(s),a=i(48),r=n(a),l=i(59),u=n(l),c=i(11),d=n(c);t.default={name:"ElAutocomplete",mixins:[d.default],componentName:"ElAutocomplete",components:{ElInput:o.default,ElAutocompleteSuggestions:u.default},directives:{Clickoutside:r.default},props:{props:{type:Object,default:function(){return{label:"value",value:"value"}}},popperClass:String,placeholder:String,disabled:Boolean,name:String,size:String,value:String,autofocus:Boolean,fetchSuggestions:Function,triggerOnFocus:{type:Boolean,default:!0},customItem:String,icon:String,onIconClick:Function},data:function(){return{activated:!1,isOnComposition:!1,suggestions:[],loading:!1,highlightedIndex:-1}},computed:{suggestionVisible:function(){var e=this.suggestions,t=Array.isArray(e)&&e.length>0;return(t||this.loading)&&this.activated}},watch:{suggestionVisible:function(e){this.broadcast("ElAutocompleteSuggestions","visible",[e,this.$refs.input.$refs.input.offsetWidth])}},methods:{getData:function(e){var t=this;this.loading=!0,this.fetchSuggestions(e,function(e){t.loading=!1,Array.isArray(e)?t.suggestions=e:console.error("autocomplete suggestions must be an array")})},handleComposition:function(e){"compositionend"===e.type?(this.isOnComposition=!1,this.handleChange(this.value)):this.isOnComposition=!0},handleChange:function(e){return this.$emit("input",e),this.isOnComposition||!this.triggerOnFocus&&!e?void(this.suggestions=[]):void this.getData(e)},handleFocus:function(){this.activated=!0,this.triggerOnFocus&&this.getData(this.value)},close:function(e){this.activated=!1},handleKeyEnter:function(e){this.suggestionVisible&&this.highlightedIndex>=0&&this.highlightedIndex<this.suggestions.length&&(e.preventDefault(),this.select(this.suggestions[this.highlightedIndex]))},select:function(e){var t=this;this.$emit("input",e[this.props.value]),this.$emit("select",e),this.$nextTick(function(e){t.suggestions=[]})},highlight:function(e){if(this.suggestionVisible&&!this.loading){e<0&&(e=0),e>=this.suggestions.length&&(e=this.suggestions.length-1);var t=this.$refs.suggestions.$el.querySelector(".el-autocomplete-suggestion__wrap"),i=t.querySelectorAll(".el-autocomplete-suggestion__list li"),n=i[e],s=t.scrollTop,o=n.offsetTop;o+n.scrollHeight>s+t.clientHeight&&(t.scrollTop+=n.scrollHeight),o<s&&(t.scrollTop-=n.scrollHeight),this.highlightedIndex=e}}},mounted:function(){var e=this;this.$on("item-click",function(t){e.select(t)})},beforeDestroy:function(){this.$refs.suggestions.$destroy()}}},function(e,t,i){var n=i(5)(i(60),i(61),null,null,null);e.exports=n.exports},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0;var s=i(27),o=n(s),a=i(11),r=n(a),l=i(41),u=n(l);t.default={components:{ElScrollbar:u.default},mixins:[o.default,r.default],componentName:"ElAutocompleteSuggestions",data:function(){return{parent:this.$parent,dropdownWidth:""}},props:{props:Object,suggestions:Array,options:{default:function(){return{forceAbsolute:!0,gpuAcceleration:!1}}}},methods:{select:function(e){this.dispatch("ElAutocomplete","item-click",e)}},updated:function(){var e=this;this.$nextTick(function(t){e.updatePopper()})},mounted:function(){this.$parent.popperElm=this.popperElm=this.$el,this.referenceElm=this.$parent.$refs.input.$refs.input},created:function(){var e=this;this.$on("visible",function(t,i){e.dropdownWidth=i+"px",e.showPopper=t})}}},function(e,t){e.exports={render:function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("transition",{attrs:{name:"el-zoom-in-top"},on:{"after-leave":e.doDestroy}},[i("div",{directives:[{name:"show",rawName:"v-show",value:e.showPopper,expression:"showPopper"}],staticClass:"el-autocomplete-suggestion",class:{"is-loading":e.parent.loading},style:{width:e.dropdownWidth}},[i("el-scrollbar",{attrs:{tag:"ul","wrap-class":"el-autocomplete-suggestion__wrap","view-class":"el-autocomplete-suggestion__list"}},[e.parent.loading?i("li",[i("i",{staticClass:"el-icon-loading"})]):e._l(e.suggestions,function(t,n){return[e.parent.customItem?i(e.parent.customItem,{tag:"component",class:{highlighted:e.parent.highlightedIndex===n},attrs:{item:t,index:n},on:{click:function(i){e.select(t)}}}):i("li",{class:{highlighted:e.parent.highlightedIndex===n},on:{click:function(i){e.select(t)}}},[e._v("\n          "+e._s(t[e.props.label])+"\n        ")])]})],2)],1)])},staticRenderFns:[]}},function(e,t){e.exports={render:function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("div",{directives:[{name:"clickoutside",rawName:"v-clickoutside",value:e.close,expression:"close"}],staticClass:"el-autocomplete"},[i("el-input",e._b({ref:"input",on:{change:e.handleChange,focus:e.handleFocus},nativeOn:{compositionstart:function(t){e.handleComposition(t)},compositionupdate:function(t){e.handleComposition(t)},compositionend:function(t){e.handleComposition(t)},keydown:[function(t){return"button"in t||!e._k(t.keyCode,"up",38)?(t.preventDefault(),void e.highlight(e.highlightedIndex-1)):null},function(t){return"button"in t||!e._k(t.keyCode,"down",40)?(t.preventDefault(),void e.highlight(e.highlightedIndex+1)):null},function(t){return"button"in t||!e._k(t.keyCode,"enter",13)?void e.handleKeyEnter(t):null},function(t){return"button"in t||!e._k(t.keyCode,"tab",9)?void e.close(t):null}]}},"el-input",e.$props),[e.$slots.prepend?i("template",{slot:"prepend"},[e._t("prepend")],2):e._e(),e.$slots.append?i("template",{slot:"append"},[e._t("append")],2):e._e()],2),i("el-autocomplete-suggestions",{ref:"suggestions",class:[e.popperClass?e.popperClass:""],attrs:{props:e.props,suggestions:e.suggestions}})],1)},staticRenderFns:[]}},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0;var s=i(64),o=n(s);o.default.install=function(e){e.component(o.default.name,o.default)},t.default=o.default},function(e,t,i){var n=i(5)(i(65),null,null,null,null);e.exports=n.exports},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0;var s=i(48),o=n(s),a=i(11),r=n(a),l=i(66),u=n(l),c=i(70),d=n(c);t.default={name:"ElDropdown",componentName:"ElDropdown",mixins:[r.default],directives:{Clickoutside:o.default},components:{ElButton:u.default,ElButtonGroup:d.default},props:{trigger:{type:String,default:"hover"},menuAlign:{type:String,default:"end"},type:String,size:String,splitButton:Boolean,hideOnClick:{type:Boolean,default:!0}},data:function(){return{timeout:null,visible:!1}},mounted:function(){this.$on("menu-item-click",this.handleMenuItemClick),this.initEvent()},watch:{visible:function(e){this.broadcast("ElDropdownMenu","visible",e),this.$emit("visible-change",e)}},methods:{show:function(){var e=this;clearTimeout(this.timeout),this.timeout=setTimeout(function(){e.visible=!0},250)},hide:function(){var e=this;clearTimeout(this.timeout),this.timeout=setTimeout(function(){e.visible=!1},150)},handleClick:function(){this.visible=!this.visible},initEvent:function(){var e=this.trigger,t=this.show,i=this.hide,n=this.handleClick,s=this.splitButton,o=s?this.$refs.trigger.$el:this.$slots.default[0].elm;if(!o.disabled)if("hover"===e){o.addEventListener("mouseenter",t),o.addEventListener("mouseleave",i);var a=this.$slots.dropdown[0].elm;a.addEventListener("mouseenter",t),a.addEventListener("mouseleave",i)}else"click"===e&&o.addEventListener("click",n)},handleMenuItemClick:function(e,t){this.hideOnClick&&(this.visible=!1),this.$emit("command",e,t)}},render:function(e){var t=this,i=this.hide,n=this.splitButton,s=this.type,o=this.size,a=function(e){t.$emit("click")},r=n?e("el-button-group",null,[e("el-button",{attrs:{type:s,size:o},nativeOn:{click:a}},[this.$slots.default]),e("el-button",{ref:"trigger",attrs:{type:s,size:o},class:"el-dropdown__caret-button"},[e("i",{class:"el-dropdown__icon el-icon-caret-bottom"},[])])]):this.$slots.default;return e("div",{class:"el-dropdown",directives:[{name:"clickoutside",value:i}]},[r,this.$slots.dropdown])}}},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0;var s=i(67),o=n(s);o.default.install=function(e){e.component(o.default.name,o.default)},t.default=o.default},function(e,t,i){var n=i(5)(i(68),i(69),null,null,null);e.exports=n.exports},function(e,t){"use strict";t.__esModule=!0,t.default={name:"ElButton",props:{type:{type:String,default:"default"},size:String,icon:{type:String,default:""},nativeType:{type:String,default:"button"},loading:Boolean,disabled:Boolean,plain:Boolean,autofocus:Boolean},methods:{handleClick:function(e){this.$emit("click",e)},handleInnerClick:function(e){this.disabled&&e.stopPropagation()}}}},function(e,t){e.exports={render:function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("button",{staticClass:"el-button",class:[e.type?"el-button--"+e.type:"",e.size?"el-button--"+e.size:"",{"is-disabled":e.disabled,"is-loading":e.loading,"is-plain":e.plain}],attrs:{disabled:e.disabled,autofocus:e.autofocus,type:e.nativeType},on:{click:e.handleClick}},[e.loading?i("i",{staticClass:"el-icon-loading",on:{click:e.handleInnerClick}}):e._e(),e.icon&&!e.loading?i("i",{class:"el-icon-"+e.icon,on:{click:e.handleInnerClick}}):e._e(),e.$slots.default?i("span",{on:{click:e.handleInnerClick}},[e._t("default")],2):e._e()])},staticRenderFns:[]}},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0;var s=i(71),o=n(s);o.default.install=function(e){e.component(o.default.name,o.default)},t.default=o.default},function(e,t,i){var n=i(5)(i(72),i(73),null,null,null);e.exports=n.exports},function(e,t){"use strict";t.__esModule=!0,t.default={name:"ElButtonGroup"}},function(e,t){e.exports={render:function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("div",{staticClass:"el-button-group"},[e._t("default")],2)},staticRenderFns:[]}},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0;var s=i(75),o=n(s);o.default.install=function(e){e.component(o.default.name,o.default)},t.default=o.default},function(e,t,i){var n=i(5)(i(76),i(77),null,null,null);e.exports=n.exports},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0;var s=i(27),o=n(s);t.default={name:"ElDropdownMenu",componentName:"ElDropdownMenu",mixins:[o.default],created:function(){var e=this;this.$on("updatePopper",function(){e.showPopper&&e.updatePopper()}),this.$on("visible",function(t){e.showPopper=t})},mounted:function(){this.$parent.popperElm=this.popperElm=this.$el,this.referenceElm=this.$parent.$el},watch:{"$parent.menuAlign":{immediate:!0,handler:function(e){this.currentPlacement="bottom-"+e}}}}},function(e,t){e.exports={render:function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("transition",{attrs:{name:"el-zoom-in-top"},on:{"after-leave":e.doDestroy}},[i("ul",{directives:[{name:"show",rawName:"v-show",value:e.showPopper,expression:"showPopper"}],staticClass:"el-dropdown-menu"},[e._t("default")],2)])},staticRenderFns:[]}},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0;var s=i(79),o=n(s);o.default.install=function(e){e.component(o.default.name,o.default)},t.default=o.default},function(e,t,i){var n=i(5)(i(80),i(81),null,null,null);e.exports=n.exports},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0;var s=i(11),o=n(s);t.default={name:"ElDropdownItem",mixins:[o.default],props:{command:{},disabled:Boolean,divided:Boolean},methods:{handleClick:function(e){this.dispatch("ElDropdown","menu-item-click",[this.command,this])}}}},function(e,t){e.exports={render:function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("li",{staticClass:"el-dropdown-menu__item",class:{"is-disabled":e.disabled,"el-dropdown-menu__item--divided":e.divided},on:{click:e.handleClick}},[e._t("default")],2)},staticRenderFns:[]}},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0;var s=i(83),o=n(s);o.default.install=function(e){e.component(o.default.name,o.default)},t.default=o.default},function(e,t,i){var n=i(5)(i(84),i(85),null,null,null);e.exports=n.exports},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0;var s=i(11),o=n(s),a=i(30);t.default={name:"ElMenu",componentName:"ElMenu",mixins:[o.default],provide:function(){return{rootMenu:this}},components:{"el-menu-collapse-transition":{functional:!0,render:function(e,t){var i={props:{mode:"out-in"},on:{beforeEnter:function(e){e.style.opacity=.2},enter:function(e){(0,a.addClass)(e,"el-opacity-transition"),e.style.opacity=1},afterEnter:function(e){(0,a.removeClass)(e,"el-opacity-transition"),e.style.opacity=""},beforeLeave:function(e){e.dataset||(e.dataset={}),(0,a.hasClass)(e,"el-menu--collapse")&&((0,a.removeClass)(e,"el-menu--collapse"),e.dataset.oldOverflow=e.style.overflow,e.dataset.scrollWidth=e.scrollWidth,(0,a.addClass)(e,"el-menu--collapse")),e.style.width=e.scrollWidth+"px",e.style.overflow="hidden"},leave:function(e){(0,a.hasClass)(e,"el-menu--collapse")?((0,a.addClass)(e,"horizontal-collapse-transition"),e.style.width=e.dataset.scrollWidth+"px"):((0,a.addClass)(e,"horizontal-collapse-transition"),e.style.width="64px")},afterLeave:function(e){(0,a.removeClass)(e,"horizontal-collapse-transition"),(0,a.hasClass)(e,"el-menu--collapse")?e.style.width=e.dataset.scrollWidth+"px":e.style.width="64px",e.style.overflow=e.dataset.oldOverflow}}};return e("transition",i,t.children)}}},props:{mode:{type:String,default:"vertical"},defaultActive:{type:String,default:""},defaultOpeneds:Array,theme:{type:String,default:"light"},uniqueOpened:Boolean,router:Boolean,menuTrigger:{type:String,default:"hover"},collapse:Boolean},data:function(){return{activeIndex:this.defaultActive,openedMenus:this.defaultOpeneds?this.defaultOpeneds.slice(0):[],items:{},submenus:{}}},watch:{defaultActive:function(e){var t=this.items[e];t?(this.activeIndex=t.index,this.initOpenedMenu()):this.activeIndex=""},defaultOpeneds:function(e){this.openedMenus=e},collapse:function(e){e&&(this.openedMenus=[])}},methods:{addItem:function(e){this.$set(this.items,e.index,e)},removeItem:function(e){delete this.items[e.index]},addSubmenu:function(e){this.$set(this.submenus,e.index,e)},removeSubmenu:function(e){delete this.submenus[e.index]},openMenu:function(e,t){var i=this.openedMenus;i.indexOf(e)===-1&&(this.uniqueOpened&&(this.openedMenus=i.filter(function(e){return t.indexOf(e)!==-1})),this.openedMenus.push(e))},closeMenu:function(e){this.openedMenus.splice(this.openedMenus.indexOf(e),1)},handleSubmenuClick:function(e){var t=e.index,i=e.indexPath,n=this.openedMenus.indexOf(t)!==-1;
n?(this.closeMenu(t),this.$emit("close",t,i)):(this.openMenu(t,i),this.$emit("open",t,i))},handleItemClick:function(e){var t=e.index,i=e.indexPath;this.activeIndex=e.index,this.$emit("select",t,i,e),("horizontal"===this.mode||this.collapse)&&(this.openedMenus=[]),this.router&&this.routeToItem(e)},initOpenedMenu:function(){var e=this,t=this.activeIndex,i=this.items[t];if(i&&"horizontal"!==this.mode&&!this.collapse){var n=i.indexPath;n.forEach(function(t){var i=e.submenus[t];i&&e.openMenu(t,i.indexPath)})}},routeToItem:function(e){var t=e.route||e.index;try{this.$router.push(t)}catch(e){console.error(e)}}},mounted:function(){this.initOpenedMenu(),this.$on("item-click",this.handleItemClick),this.$on("submenu-click",this.handleSubmenuClick)}}},function(e,t){e.exports={render:function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("el-menu-collapse-transition",[i("ul",{key:+e.collapse,staticClass:"el-menu",class:{"el-menu--horizontal":"horizontal"===e.mode,"el-menu--dark":"dark"===e.theme,"el-menu--collapse":e.collapse}},[e._t("default")],2)])},staticRenderFns:[]}},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0;var s=i(87),o=n(s);o.default.install=function(e){e.component(o.default.name,o.default)},t.default=o.default},function(e,t,i){var n=i(5)(i(88),i(91),null,null,null);e.exports=n.exports},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0;var s=i(89),o=n(s),a=i(90),r=n(a),l=i(11),u=n(l);t.default={name:"ElSubmenu",componentName:"ElSubmenu",mixins:[r.default,u.default],components:{ElCollapseTransition:o.default},props:{index:{type:String,required:!0}},data:function(){return{timeout:null,items:{},submenus:{}}},computed:{menuTransitionName:function(){return this.rootMenu.collapse?"el-zoom-in-left":"el-zoom-in-top"},opened:function(){return this.rootMenu.openedMenus.indexOf(this.index)>-1},active:{cache:!1,get:function(){var e=!1,t=this.submenus,i=this.items;return Object.keys(i).forEach(function(t){i[t].active&&(e=!0)}),Object.keys(t).forEach(function(i){t[i].active&&(e=!0)}),e}}},methods:{addItem:function(e){this.$set(this.items,e.index,e)},removeItem:function(e){delete this.items[e.index]},addSubmenu:function(e){this.$set(this.submenus,e.index,e)},removeSubmenu:function(e){delete this.submenus[e.index]},handleClick:function(){var e=this.rootMenu;"hover"===e.menuTrigger&&"horizontal"===e.mode||e.collapse&&"vertical"===e.mode||this.dispatch("ElMenu","submenu-click",this)},handleMouseenter:function(){var e=this,t=this.rootMenu;"click"===t.menuTrigger&&"horizontal"===t.mode||!t.collapse&&"vertical"===t.mode||(clearTimeout(this.timeout),this.timeout=setTimeout(function(){e.rootMenu.openMenu(e.index,e.indexPath)},300))},handleMouseleave:function(){var e=this,t=this.rootMenu;"click"===t.menuTrigger&&"horizontal"===t.mode||!t.collapse&&"vertical"===t.mode||(clearTimeout(this.timeout),this.timeout=setTimeout(function(){e.rootMenu.closeMenu(e.index)},300))}},created:function(){this.parentMenu.addSubmenu(this),this.rootMenu.addSubmenu(this)},beforeDestroy:function(){this.parentMenu.removeSubmenu(this),this.rootMenu.removeSubmenu(this)}}},function(e,t,i){"use strict";function n(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}t.__esModule=!0;var s=i(30),o=function(){function e(){n(this,e)}return e.prototype.beforeEnter=function(e){(0,s.addClass)(e,"collapse-transition"),e.dataset||(e.dataset={}),e.dataset.oldPaddingTop=e.style.paddingTop,e.dataset.oldPaddingBottom=e.style.paddingBottom,e.style.height="0",e.style.paddingTop=0,e.style.paddingBottom=0},e.prototype.enter=function(e){e.dataset.oldOverflow=e.style.overflow,0!==e.scrollHeight?(e.style.height=e.scrollHeight+"px",e.style.paddingTop=e.dataset.oldPaddingTop,e.style.paddingBottom=e.dataset.oldPaddingBottom):(e.style.height="",e.style.paddingTop=e.dataset.oldPaddingTop,e.style.paddingBottom=e.dataset.oldPaddingBottom),e.style.overflow="hidden"},e.prototype.afterEnter=function(e){(0,s.removeClass)(e,"collapse-transition"),e.style.height="",e.style.overflow=e.dataset.oldOverflow},e.prototype.beforeLeave=function(e){e.dataset||(e.dataset={}),e.dataset.oldPaddingTop=e.style.paddingTop,e.dataset.oldPaddingBottom=e.style.paddingBottom,e.dataset.oldOverflow=e.style.overflow,e.style.height=e.scrollHeight+"px",e.style.overflow="hidden"},e.prototype.leave=function(e){0!==e.scrollHeight&&((0,s.addClass)(e,"collapse-transition"),e.style.height=0,e.style.paddingTop=0,e.style.paddingBottom=0)},e.prototype.afterLeave=function(e){(0,s.removeClass)(e,"collapse-transition"),e.style.height="",e.style.overflow=e.dataset.oldOverflow,e.style.paddingTop=e.dataset.oldPaddingTop,e.style.paddingBottom=e.dataset.oldPaddingBottom},e}();t.default={name:"ElCollapseTransition",functional:!0,render:function(e,t){var i=t.children,n={on:new o};return e("transition",n,i)}}},function(e,t){"use strict";t.__esModule=!0,t.default={computed:{indexPath:function(){for(var e=[this.index],t=this.$parent;"ElMenu"!==t.$options.componentName;)t.index&&e.unshift(t.index),t=t.$parent;return e},rootMenu:function(){for(var e=this.$parent;e&&"ElMenu"!==e.$options.componentName;)e=e.$parent;return e},parentMenu:function(){for(var e=this.$parent;e&&["ElMenu","ElSubmenu"].indexOf(e.$options.componentName)===-1;)e=e.$parent;return e},paddingStyle:function(){if("vertical"!==this.rootMenu.mode)return{};var e=20,t=this.$parent;if(this.rootMenu.collapse)e=20;else for(;t&&"ElMenu"!==t.$options.componentName;)"ElSubmenu"===t.$options.componentName&&(e+=20),t=t.$parent;return{paddingLeft:e+"px"}}}}},function(e,t){e.exports={render:function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("li",{class:{"el-submenu":!0,"is-active":e.active,"is-opened":e.opened},on:{mouseenter:e.handleMouseenter,mouseleave:e.handleMouseleave}},[i("div",{ref:"submenu-title",staticClass:"el-submenu__title",style:e.paddingStyle,on:{click:e.handleClick}},[e._t("title"),i("i",{class:{"el-submenu__icon-arrow":!0,"el-icon-caret-bottom":"horizontal"===e.rootMenu.mode,"el-icon-arrow-down":"vertical"===e.rootMenu.mode&&!e.rootMenu.collapse,"el-icon-caret-right":"vertical"===e.rootMenu.mode&&e.rootMenu.collapse}})],2),"horizontal"===e.rootMenu.mode||"vertical"===e.rootMenu.mode&&e.rootMenu.collapse?[i("transition",{attrs:{name:e.menuTransitionName}},[i("ul",{directives:[{name:"show",rawName:"v-show",value:e.opened,expression:"opened"}],staticClass:"el-menu"},[e._t("default")],2)])]:i("el-collapse-transition",[i("ul",{directives:[{name:"show",rawName:"v-show",value:e.opened,expression:"opened"}],staticClass:"el-menu"},[e._t("default")],2)])],2)},staticRenderFns:[]}},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0;var s=i(93),o=n(s);o.default.install=function(e){e.component(o.default.name,o.default)},t.default=o.default},function(e,t,i){var n=i(5)(i(94),i(95),null,null,null);e.exports=n.exports},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0;var s=i(90),o=n(s),a=i(11),r=n(a);t.default={name:"ElMenuItem",componentName:"ElMenuItem",mixins:[o.default,r.default],props:{index:{type:String,required:!0},route:{type:Object,required:!1},disabled:{type:Boolean,required:!1}},computed:{active:function(){return this.index===this.rootMenu.activeIndex}},methods:{handleClick:function(){this.dispatch("ElMenu","item-click",this),this.$emit("click",this)}},created:function(){this.parentMenu.addItem(this),this.rootMenu.addItem(this)},beforeDestroy:function(){this.parentMenu.removeItem(this),this.rootMenu.removeItem(this)}}},function(e,t){e.exports={render:function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("li",{staticClass:"el-menu-item",class:{"is-active":e.active,"is-disabled":e.disabled},style:e.paddingStyle,on:{click:e.handleClick}},[e.$parent===e.rootMenu&&e.rootMenu.collapse?i("el-tooltip",{attrs:{effect:"dark",placement:"right"}},[i("div",{slot:"content"},[e._t("title")],2),i("div",{staticStyle:{position:"absolute",left:"0",top:"0",height:"100%",width:"100%",display:"inline-block","box-sizing":"border-box",padding:"0 20px"}},[e._t("default")],2)]):[e._t("default"),e._t("title")]],2)},staticRenderFns:[]}},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0;var s=i(97),o=n(s);o.default.install=function(e){e.component(o.default.name,o.default)},t.default=o.default},function(e,t,i){var n=i(5)(i(98),i(99),null,null,null);e.exports=n.exports},function(e,t){"use strict";t.__esModule=!0,t.default={name:"ElMenuItemGroup",componentName:"ElMenuItemGroup",inject:["rootMenu"],props:{title:{type:String}},data:function(){return{paddingLeft:20}},computed:{levelPadding:function(){var e=10,t=this.$parent;if(this.rootMenu.collapse)return 20;for(;t&&"ElMenu"!==t.$options.componentName;)"ElSubmenu"===t.$options.componentName&&(e+=20),t=t.$parent;return 10===e&&(e=20),e}}}},function(e,t){e.exports={render:function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("li",{staticClass:"el-menu-item-group"},[i("div",{staticClass:"el-menu-item-group__title",style:{paddingLeft:e.levelPadding+"px"}},[e.$slots.title?e._t("title"):[e._v(e._s(e.title))]],2),i("ul",[e._t("default")],2)])},staticRenderFns:[]}},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0;var s=i(101),o=n(s);o.default.install=function(e){e.component(o.default.name,o.default)},t.default=o.default},function(e,t,i){var n=i(5)(i(102),i(103),null,null,null);e.exports=n.exports},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0;var s=i(19),o=n(s),a=i(30),r=i(46),l=n(r);t.default={name:"ElInputNumber",directives:{repeatClick:{bind:function(e,t,i){var n=null,s=void 0,o=function(){return i.context[t.expression].apply()},r=function(){new Date-s<100&&o(),clearInterval(n),n=null};(0,a.on)(e,"mousedown",function(){s=new Date,(0,a.once)(document,"mouseup",r),clearInterval(n),n=setInterval(o,100)})}}},components:{ElInput:o.default},props:{step:{type:Number,default:1},max:{type:Number,default:1/0},min:{type:Number,default:-(1/0)},value:{default:0},disabled:Boolean,size:String,controls:{type:Boolean,default:!0},debounce:{type:Number,default:300}},data:function(){return{currentValue:0}},watch:{value:{immediate:!0,handler:function(e){var t=Number(e);isNaN(t)||(t>=this.max&&(t=this.max),t<=this.min&&(t=this.min),this.currentValue=t,this.$emit("input",t))}}},computed:{minDisabled:function(){return this._decrease(this.value,this.step)<this.min},maxDisabled:function(){return this._increase(this.value,this.step)>this.max},precision:function(){var e=this.value,t=this.step,i=this.getPrecision;return Math.max(i(e),i(t))}},methods:{toPrecision:function(e,t){return void 0===t&&(t=this.precision),parseFloat(parseFloat(Number(e).toFixed(t)))},getPrecision:function(e){var t=e.toString(),i=t.indexOf("."),n=0;return i!==-1&&(n=t.length-i-1),n},_increase:function(e,t){if("number"!=typeof e)return this.currentValue;var i=Math.pow(10,this.precision);return this.toPrecision((i*e+i*t)/i)},_decrease:function(e,t){if("number"!=typeof e)return this.currentValue;var i=Math.pow(10,this.precision);return this.toPrecision((i*e-i*t)/i)},increase:function(){if(!this.disabled&&!this.maxDisabled){var e=this.value||0,t=this._increase(e,this.step);t>this.max||this.setCurrentValue(t)}},decrease:function(){if(!this.disabled&&!this.minDisabled){var e=this.value||0,t=this._decrease(e,this.step);t<this.min||this.setCurrentValue(t)}},handleBlur:function(){this.$refs.input.setCurrentValue(this.currentValue)},setCurrentValue:function(e){var t=this.currentValue;return e>=this.max&&(e=this.max),e<=this.min&&(e=this.min),t===e?void this.$refs.input.setCurrentValue(this.currentValue):(this.$emit("change",e,t),this.$emit("input",e),void(this.currentValue=e))},handleInput:function(e){if(""!==e){var t=Number(e);isNaN(t)?this.$refs.input.setCurrentValue(this.currentValue):this.setCurrentValue(t)}}},created:function(){var e=this;this.debounceHandleInput=(0,l.default)(this.debounce,function(t){e.handleInput(t)})}}},function(e,t){e.exports={render:function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("div",{staticClass:"el-input-number",class:[e.size?"el-input-number--"+e.size:"",{"is-disabled":e.disabled},{"is-without-controls":!e.controls}]},[e.controls?i("span",{directives:[{name:"repeat-click",rawName:"v-repeat-click",value:e.decrease,expression:"decrease"}],staticClass:"el-input-number__decrease",class:{"is-disabled":e.minDisabled}},[i("i",{staticClass:"el-icon-minus"})]):e._e(),e.controls?i("span",{directives:[{name:"repeat-click",rawName:"v-repeat-click",value:e.increase,expression:"increase"}],staticClass:"el-input-number__increase",class:{"is-disabled":e.maxDisabled}},[i("i",{staticClass:"el-icon-plus"})]):e._e(),i("el-input",{ref:"input",attrs:{value:e.currentValue,disabled:e.disabled,size:e.size,max:e.max,min:e.min},on:{blur:e.handleBlur,input:e.debounceHandleInput},nativeOn:{keydown:[function(t){return"button"in t||!e._k(t.keyCode,"up",38)?(t.preventDefault(),void e.increase(t)):null},function(t){return"button"in t||!e._k(t.keyCode,"down",40)?(t.preventDefault(),void e.decrease(t)):null}]}},[e.$slots.prepend?i("template",{slot:"prepend"},[e._t("prepend")],2):e._e(),e.$slots.append?i("template",{slot:"append"},[e._t("append")],2):e._e()],2)],1)},staticRenderFns:[]}},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0;var s=i(105),o=n(s);o.default.install=function(e){e.component("el-radio",o.default)},t.default=o.default},function(e,t,i){var n=i(5)(i(106),i(107),null,null,null);e.exports=n.exports},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0;var s=i(11),o=n(s);t.default={name:"ElRadio",mixins:[o.default],componentName:"ElRadio",props:{value:{},label:{},disabled:Boolean,name:String},data:function(){return{focus:!1}},computed:{isGroup:function(){for(var e=this.$parent;e;){if("ElRadioGroup"===e.$options.componentName)return this._radioGroup=e,!0;e=e.$parent}return!1},model:{get:function(){return this.isGroup?this._radioGroup.value:this.value},set:function(e){this.isGroup?this.dispatch("ElRadioGroup","input",[e]):this.$emit("input",e)}},isDisabled:function(){return this.isGroup?this._radioGroup.disabled||this.disabled:this.disabled}}}},function(e,t){e.exports={render:function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("label",{staticClass:"el-radio"},[i("span",{staticClass:"el-radio__input",class:{"is-disabled":e.isDisabled,"is-checked":e.model===e.label,"is-focus":e.focus}},[i("span",{staticClass:"el-radio__inner"}),i("input",{directives:[{name:"model",rawName:"v-model",value:e.model,expression:"model"}],staticClass:"el-radio__original",attrs:{type:"radio",name:e.name,disabled:e.isDisabled},domProps:{value:e.label,checked:e._q(e.model,e.label)},on:{focus:function(t){e.focus=!0},blur:function(t){e.focus=!1},__c:function(t){e.model=e.label}}})]),i("span",{staticClass:"el-radio__label"},[e._t("default"),e.$slots.default?e._e():[e._v(e._s(e.label))]],2)])},staticRenderFns:[]}},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0;var s=i(109),o=n(s);o.default.install=function(e){e.component(o.default.name,o.default)},t.default=o.default},function(e,t,i){var n=i(5)(i(110),i(111),null,null,null);e.exports=n.exports},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0;var s=i(11),o=n(s);t.default={name:"ElRadioGroup",componentName:"ElRadioGroup",mixins:[o.default],props:{value:{},size:String,fill:String,textColor:String,disabled:Boolean},watch:{value:function(e){this.$emit("change",e),this.dispatch("ElFormItem","el.form.change",[this.value])}}}},function(e,t){e.exports={render:function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("div",{staticClass:"el-radio-group"},[e._t("default")],2)},staticRenderFns:[]}},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0;var s=i(113),o=n(s);o.default.install=function(e){e.component(o.default.name,o.default)},t.default=o.default},function(e,t,i){var n=i(5)(i(114),i(115),null,null,null);e.exports=n.exports},function(e,t){"use strict";t.__esModule=!0,t.default={name:"ElRadioButton",props:{label:{},disabled:Boolean,name:String},computed:{value:{get:function(){return this._radioGroup.value},set:function(e){this._radioGroup.$emit("input",e)}},_radioGroup:function(){for(var e=this.$parent;e;){if("ElRadioGroup"===e.$options.componentName)return e;e=e.$parent}return!1},activeStyle:function(){return{backgroundColor:this._radioGroup.fill||"",borderColor:this._radioGroup.fill||"",boxShadow:this._radioGroup.fill?"-1px 0 0 0 "+this._radioGroup.fill:"",color:this._radioGroup.textColor||""}},size:function(){return this._radioGroup.size},isDisabled:function(){return this.disabled||this._radioGroup.disabled}}}},function(e,t){e.exports={render:function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("label",{staticClass:"el-radio-button",class:[e.size?"el-radio-button--"+e.size:"",{"is-active":e.value===e.label},{"is-disabled":e.isDisabled}]},[i("input",{directives:[{name:"model",rawName:"v-model",value:e.value,expression:"value"}],staticClass:"el-radio-button__orig-radio",attrs:{type:"radio",name:e.name,disabled:e.isDisabled},domProps:{value:e.label,checked:e._q(e.value,e.label)},on:{__c:function(t){e.value=e.label}}}),i("span",{staticClass:"el-radio-button__inner",style:e.value===e.label?e.activeStyle:null},[e._t("default"),e.$slots.default?e._e():[e._v(e._s(e.label))]],2)])},staticRenderFns:[]}},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0;var s=i(117),o=n(s);o.default.install=function(e){e.component(o.default.name,o.default)},t.default=o.default},function(e,t,i){var n=i(5)(i(118),i(119),null,null,null);e.exports=n.exports},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0;var s=i(11),o=n(s);t.default={name:"ElCheckbox",mixins:[o.default],componentName:"ElCheckbox",data:function(){return{selfModel:!1,focus:!1}},computed:{model:{get:function(){return this.isGroup?this.store:void 0!==this.value?this.value:this.selfModel},set:function(e){if(this.isGroup){var t=!1;void 0!==this._checkboxGroup.min&&e.length<this._checkboxGroup.min&&(t=!0),void 0!==this._checkboxGroup.max&&e.length>this._checkboxGroup.max&&(t=!0),t===!1&&this.dispatch("ElCheckboxGroup","input",[e])}else this.$emit("input",e),this.selfModel=e}},isChecked:function(){return"[object Boolean]"==={}.toString.call(this.model)?this.model:Array.isArray(this.model)?this.model.indexOf(this.label)>-1:null!==this.model&&void 0!==this.model?this.model===this.trueLabel:void 0},isGroup:function(){for(var e=this.$parent;e;){if("ElCheckboxGroup"===e.$options.componentName)return this._checkboxGroup=e,!0;e=e.$parent}return!1},store:function(){return this._checkboxGroup?this._checkboxGroup.value:this.value}},props:{value:{},label:{},indeterminate:Boolean,disabled:Boolean,checked:Boolean,name:String,trueLabel:[String,Number],falseLabel:[String,Number]},methods:{addToStore:function(){Array.isArray(this.model)&&this.model.indexOf(this.label)===-1?this.model.push(this.label):this.model=this.trueLabel||!0},handleChange:function(e){var t=this;this.$emit("change",e),this.isGroup&&this.$nextTick(function(e){t.dispatch("ElCheckboxGroup","change",[t._checkboxGroup.value])})}},created:function(){this.checked&&this.addToStore()}}},function(e,t){e.exports={render:function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("label",{staticClass:"el-checkbox"},[i("span",{staticClass:"el-checkbox__input",class:{"is-disabled":e.disabled,"is-checked":e.isChecked,"is-indeterminate":e.indeterminate,"is-focus":e.focus}},[i("span",{staticClass:"el-checkbox__inner"}),e.trueLabel||e.falseLabel?i("input",{directives:[{name:"model",rawName:"v-model",value:e.model,expression:"model"}],staticClass:"el-checkbox__original",attrs:{type:"checkbox",name:e.name,disabled:e.disabled,"true-value":e.trueLabel,"false-value":e.falseLabel},domProps:{checked:Array.isArray(e.model)?e._i(e.model,null)>-1:e._q(e.model,e.trueLabel)},on:{change:e.handleChange,focus:function(t){e.focus=!0},blur:function(t){e.focus=!1},__c:function(t){var i=e.model,n=t.target,s=n.checked?e.trueLabel:e.falseLabel;if(Array.isArray(i)){var o=null,a=e._i(i,o);s?a<0&&(e.model=i.concat(o)):a>-1&&(e.model=i.slice(0,a).concat(i.slice(a+1)))}else e.model=s}}}):i("input",{directives:[{name:"model",rawName:"v-model",value:e.model,expression:"model"}],staticClass:"el-checkbox__original",attrs:{type:"checkbox",disabled:e.disabled,name:e.name},domProps:{value:e.label,checked:Array.isArray(e.model)?e._i(e.model,e.label)>-1:e.model},on:{change:e.handleChange,focus:function(t){e.focus=!0},blur:function(t){e.focus=!1},__c:function(t){var i=e.model,n=t.target,s=!!n.checked;if(Array.isArray(i)){var o=e.label,a=e._i(i,o);s?a<0&&(e.model=i.concat(o)):a>-1&&(e.model=i.slice(0,a).concat(i.slice(a+1)))}else e.model=s}}})]),e.$slots.default||e.label?i("span",{staticClass:"el-checkbox__label"},[e._t("default"),e.$slots.default?e._e():[e._v(e._s(e.label))]],2):e._e()])},staticRenderFns:[]}},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0;var s=i(121),o=n(s);o.default.install=function(e){e.component(o.default.name,o.default)},t.default=o.default},function(e,t,i){var n=i(5)(i(122),i(123),null,null,null);e.exports=n.exports},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0;var s=i(11),o=n(s);t.default={name:"ElCheckboxButton",mixins:[o.default],data:function(){return{selfModel:!1,focus:!1}},props:{value:{},label:{},disabled:Boolean,checked:Boolean,name:String,trueLabel:[String,Number],falseLabel:[String,Number]},computed:{model:{get:function(){return this._checkboxGroup?this.store:void 0!==this.value?this.value:this.selfModel},set:function(e){if(this._checkboxGroup){var t=!1;void 0!==this._checkboxGroup.min&&e.length<this._checkboxGroup.min&&(t=!0),void 0!==this._checkboxGroup.max&&e.length>this._checkboxGroup.max&&(t=!0),t===!1&&this.dispatch("ElCheckboxGroup","input",[e])}else void 0!==this.value?this.$emit("input",e):this.selfModel=e}},isChecked:function(){return"[object Boolean]"==={}.toString.call(this.model)?this.model:Array.isArray(this.model)?this.model.indexOf(this.label)>-1:null!==this.model&&void 0!==this.model?this.model===this.trueLabel:void 0},_checkboxGroup:function(){for(var e=this.$parent;e;){if("ElCheckboxGroup"===e.$options.componentName)return e;e=e.$parent}return!1},store:function(){return this._checkboxGroup?this._checkboxGroup.value:this.value},activeStyle:function(){return{backgroundColor:this._checkboxGroup.fill||"",borderColor:this._checkboxGroup.fill||"",color:this._checkboxGroup.textColor||"","box-shadow":"-1px 0 0 0 "+this._checkboxGroup.fill}},size:function(){return this._checkboxGroup.size}},methods:{addToStore:function(){Array.isArray(this.model)&&this.model.indexOf(this.label)===-1?this.model.push(this.label):this.model=this.trueLabel||!0},handleChange:function(e){var t=this;this.$emit("change",e),this._checkboxGroup&&this.$nextTick(function(e){t.dispatch("ElCheckboxGroup","change",[t._checkboxGroup.value])})}},created:function(){this.checked&&this.addToStore()}}},function(e,t){e.exports={render:function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("label",{staticClass:"el-checkbox-button",class:[e.size?"el-checkbox-button--"+e.size:"",{"is-disabled":e.disabled},{"is-checked":e.isChecked},{"is-focus":e.focus}]},[e.trueLabel||e.falseLabel?i("input",{directives:[{name:"model",rawName:"v-model",value:e.model,expression:"model"}],staticClass:"el-checkbox-button__original",attrs:{type:"checkbox",name:e.name,disabled:e.disabled,"true-value":e.trueLabel,"false-value":e.falseLabel},domProps:{checked:Array.isArray(e.model)?e._i(e.model,null)>-1:e._q(e.model,e.trueLabel)},on:{change:e.handleChange,focus:function(t){e.focus=!0},blur:function(t){e.focus=!1},__c:function(t){var i=e.model,n=t.target,s=n.checked?e.trueLabel:e.falseLabel;if(Array.isArray(i)){var o=null,a=e._i(i,o);s?a<0&&(e.model=i.concat(o)):a>-1&&(e.model=i.slice(0,a).concat(i.slice(a+1)))}else e.model=s}}}):i("input",{directives:[{name:"model",rawName:"v-model",value:e.model,expression:"model"}],staticClass:"el-checkbox-button__original",attrs:{type:"checkbox",name:e.name,disabled:e.disabled},domProps:{value:e.label,checked:Array.isArray(e.model)?e._i(e.model,e.label)>-1:e.model},on:{change:e.handleChange,focus:function(t){e.focus=!0},blur:function(t){e.focus=!1},__c:function(t){var i=e.model,n=t.target,s=!!n.checked;if(Array.isArray(i)){var o=e.label,a=e._i(i,o);s?a<0&&(e.model=i.concat(o)):a>-1&&(e.model=i.slice(0,a).concat(i.slice(a+1)))}else e.model=s}}}),e.$slots.default||e.label?i("span",{staticClass:"el-checkbox-button__inner",style:e.isChecked?e.activeStyle:null},[e._t("default",[e._v(e._s(e.label))])],2):e._e()])},staticRenderFns:[]}},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0;var s=i(125),o=n(s);o.default.install=function(e){e.component(o.default.name,o.default)},t.default=o.default},function(e,t,i){var n=i(5)(i(126),i(127),null,null,null);e.exports=n.exports},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0;var s=i(11),o=n(s);t.default={name:"ElCheckboxGroup",componentName:"ElCheckboxGroup",mixins:[o.default],props:{value:{},min:Number,max:Number,size:String,fill:String,textColor:String},watch:{value:function(e){this.dispatch("ElFormItem","el.form.change",[e])}}}},function(e,t){e.exports={render:function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("div",{staticClass:"el-checkbox-group"},[e._t("default")],2)},staticRenderFns:[]}},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0;var s=i(129),o=n(s);o.default.install=function(e){e.component(o.default.name,o.default)},t.default=o.default},function(e,t,i){var n=i(5)(i(130),i(131),null,null,null);e.exports=n.exports},function(e,t){"use strict";t.__esModule=!0,t.default={name:"ElSwitch",props:{value:{type:[Boolean,String,Number],default:!1},disabled:{type:Boolean,default:!1},width:{type:Number,default:0},onIconClass:{type:String,default:""},offIconClass:{type:String,default:""},onText:{type:String,default:"ON"},offText:{type:String,default:"OFF"},onColor:{type:String,default:""},offColor:{type:String,default:""},onValue:{type:[Boolean,String,Number],default:!0},offValue:{type:[Boolean,String,Number],default:!1},name:{type:String,default:""}},data:function(){return{coreWidth:this.width}},created:function(){~[this.onValue,this.offValue].indexOf(this.value)||this.$emit("input",this.offValue)},computed:{checked:function(){return this.value===this.onValue},hasText:function(){return this.onText||this.offText},transform:function(){return this.checked?"translate("+(this.coreWidth-20)+"px, 2px)":"translate(2px, 2px)"}},watch:{checked:function(){this.$refs.input.checked=this.checked,(this.onColor||this.offColor)&&this.setBackgroundColor()}},methods:{handleChange:function(e){var t=this;this.$emit("input",this.checked?this.offValue:this.onValue),this.$emit("change",this.checked?this.offValue:this.onValue),this.$nextTick(function(){t.$refs.input.checked=t.checked})},setBackgroundColor:function(){var e=this.checked?this.onColor:this.offColor;this.$refs.core.style.borderColor=e,this.$refs.core.style.backgroundColor=e}},mounted:function(){0===this.width&&(this.coreWidth=this.hasText?58:46),(this.onColor||this.offColor)&&this.setBackgroundColor(),this.$refs.input.checked=this.checked}}},function(e,t){e.exports={render:function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("label",{staticClass:"el-switch",class:{"is-disabled":e.disabled,"el-switch--wide":e.hasText,"is-checked":e.checked}},[i("div",{directives:[{name:"show",rawName:"v-show",value:e.disabled,expression:"disabled"}],staticClass:"el-switch__mask"}),i("input",{ref:"input",staticClass:"el-switch__input",attrs:{type:"checkbox",name:e.name,"true-value":e.onValue,"false-value":e.offValue,disabled:e.disabled},on:{change:e.handleChange}}),i("span",{ref:"core",staticClass:"el-switch__core",style:{width:e.coreWidth+"px"}},[i("span",{staticClass:"el-switch__button",style:{transform:e.transform}})]),i("transition",{attrs:{name:"label-fade"}},[i("div",{directives:[{name:"show",rawName:"v-show",value:e.checked,expression:"checked"}],staticClass:"el-switch__label el-switch__label--left",style:{width:e.coreWidth+"px"}},[e.onIconClass?i("i",{class:[e.onIconClass]}):e._e(),!e.onIconClass&&e.onText?i("span",[e._v(e._s(e.onText))]):e._e()])]),i("transition",{attrs:{name:"label-fade"}},[i("div",{directives:[{name:"show",rawName:"v-show",value:!e.checked,expression:"!checked"}],staticClass:"el-switch__label el-switch__label--right",style:{width:e.coreWidth+"px"}},[e.offIconClass?i("i",{class:[e.offIconClass]}):e._e(),!e.offIconClass&&e.offText?i("span",[e._v(e._s(e.offText))]):e._e()])])],1)},staticRenderFns:[]}},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0;var s=i(133),o=n(s);o.default.install=function(e){e.component(o.default.name,o.default)},t.default=o.default},function(e,t,i){var n=i(5)(i(134),i(135),null,null,null);e.exports=n.exports},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0;var s=i(11),o=n(s);t.default={mixins:[o.default],name:"ElOptionGroup",componentName:"ElOptionGroup",props:{label:String,disabled:{type:Boolean,default:!1}},data:function(){return{visible:!0}},watch:{disabled:function(e){this.broadcast("ElOption","handleGroupDisabled",e)}},methods:{queryChange:function(){this.visible=this.$children&&Array.isArray(this.$children)&&this.$children.some(function(e){return e.visible===!0})}},created:function(){this.$on("queryChange",this.queryChange)},mounted:function(){this.disabled&&this.broadcast("ElOption","handleGroupDisabled",this.disabled)}}},function(e,t){e.exports={render:function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("ul",{staticClass:"el-select-group__wrap"},[i("li",{directives:[{name:"show",rawName:"v-show",value:e.visible,expression:"visible"}],staticClass:"el-select-group__title"},[e._v(e._s(e.label))]),i("li",[i("ul",{staticClass:"el-select-group"},[e._t("default")],2)])])},staticRenderFns:[]}},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0;var s=i(137),o=n(s);o.default.install=function(e){e.component(o.default.name,o.default)},t.default=o.default},function(e,t,i){var n=i(5)(i(138),i(152),null,null,null);e.exports=n.exports},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0;var s=i(116),o=n(s),a=i(47),r=n(a),l=i(46),u=n(l),c=i(43),d=i(12),h=n(d),f=i(139),p=n(f),m=i(141),v=n(m),g=i(142),y=n(g),b=i(146),_=n(b),C=i(151),x=n(C),w=i(140),M=1;t.default={name:"ElTable",mixins:[h.default],props:{data:{type:Array,default:function(){return[]}},width:[String,Number],height:[String,Number],maxHeight:[String,Number],fit:{type:Boolean,default:!0},stripe:Boolean,border:Boolean,rowKey:[String,Function],context:{},showHeader:{type:Boolean,default:!0},showSummary:Boolean,sumText:String,summaryMethod:Function,rowClassName:[String,Function],rowStyle:[Object,Function],highlightCurrentRow:Boolean,currentRowKey:[String,Number],emptyText:String,expandRowKeys:Array,defaultExpandAll:Boolean,defaultSort:Object,tooltipEffect:String},components:{TableHeader:_.default,TableFooter:x.default,TableBody:y.default,ElCheckbox:o.default},methods:{setCurrentRow:function(e){this.store.commit("setCurrentRow",e)},toggleRowSelection:function(e,t){this.store.toggleRowSelection(e,t),this.store.updateAllSelected()},clearSelection:function(){
this.store.clearSelection()},handleMouseLeave:function(){this.store.commit("setHoverRow",null),this.hoverState&&(this.hoverState=null)},updateScrollY:function(){this.layout.updateScrollY()},bindEvents:function(){var e=this,t=this.$refs,i=t.headerWrapper,n=t.footerWrapper,s=this.$refs;this.bodyWrapper.addEventListener("scroll",function(){i&&(i.scrollLeft=this.scrollLeft),n&&(n.scrollLeft=this.scrollLeft),s.fixedBodyWrapper&&(s.fixedBodyWrapper.scrollTop=this.scrollTop),s.rightFixedBodyWrapper&&(s.rightFixedBodyWrapper.scrollTop=this.scrollTop)});var o=function(t){var i=t.deltaX,n=t.deltaY;Math.abs(i)<Math.abs(n)||(i>0?e.bodyWrapper.scrollLeft+=10:i<0&&(e.bodyWrapper.scrollLeft-=10))};i&&(0,w.mousewheel)(i,(0,r.default)(16,o)),n&&(0,w.mousewheel)(n,(0,r.default)(16,o)),this.fit&&(this.windowResizeListener=(0,r.default)(50,function(){e.$ready&&e.doLayout()}),(0,c.addResizeListener)(this.$el,this.windowResizeListener))},doLayout:function(){var e=this;this.store.updateColumns(),this.layout.update(),this.updateScrollY(),this.$nextTick(function(){e.height?e.layout.setHeight(e.height):e.maxHeight?e.layout.setMaxHeight(e.maxHeight):e.shouldUpdateHeight&&e.layout.updateHeight(),e.$el&&(e.isHidden=0===e.$el.clientWidth)})}},created:function(){var e=this;this.tableId="el-table_"+M+"_",this.debouncedLayout=(0,u.default)(50,function(){return e.doLayout()})},computed:{bodyWrapper:function(){return this.$refs.bodyWrapper},shouldUpdateHeight:function(){return"number"==typeof this.height||this.fixedColumns.length>0||this.rightFixedColumns.length>0},selection:function(){return this.store.states.selection},columns:function(){return this.store.states.columns},tableData:function(){return this.store.states.data},fixedColumns:function(){return this.store.states.fixedColumns},rightFixedColumns:function(){return this.store.states.rightFixedColumns},bodyHeight:function(){var e={};return this.height?e={height:this.layout.bodyHeight?this.layout.bodyHeight+"px":""}:this.maxHeight&&(e={"max-height":(this.showHeader?this.maxHeight-this.layout.headerHeight-this.layout.footerHeight:this.maxHeight-this.layout.footerHeight)+"px"}),e},bodyWidth:function e(){var t=this.layout,e=t.bodyWidth,i=t.scrollY,n=t.gutterWidth;return e?e-(i?n:0)+"px":""},fixedBodyHeight:function(){var e={};if(this.height)e={height:this.layout.fixedBodyHeight?this.layout.fixedBodyHeight+"px":""};else if(this.maxHeight){var t=this.layout.scrollX?this.maxHeight-this.layout.gutterWidth:this.maxHeight;this.showHeader&&(t-=this.layout.headerHeight),e={"max-height":t+"px"}}return e},fixedHeight:function(){var e={};return e=this.maxHeight?{bottom:this.layout.scrollX&&this.data.length?this.layout.gutterWidth+"px":""}:{height:this.layout.viewportHeight?this.layout.viewportHeight+"px":""}}},watch:{height:function(e){this.layout.setHeight(e)},currentRowKey:function(e){this.store.setCurrentRowKey(e)},data:{immediate:!0,handler:function(e){this.store.commit("setData",e),this.$ready&&this.doLayout()}},expandRowKeys:function(e){this.store.setExpandRowKeys(e)}},destroyed:function(){this.windowResizeListener&&(0,c.removeResizeListener)(this.$el,this.windowResizeListener)},mounted:function(){var e=this;this.bindEvents(),this.doLayout(),this.store.states.columns.forEach(function(t){t.filteredValue&&t.filteredValue.length&&e.store.commit("filterChange",{column:t,values:t.filteredValue,silent:!0})}),this.$ready=!0},data:function(){var e=new p.default(this,{rowKey:this.rowKey,defaultExpandAll:this.defaultExpandAll}),t=new v.default({store:e,table:this,fit:this.fit,showHeader:this.showHeader});return{store:e,layout:t,isHidden:!1,renderExpanded:null,resizeProxyVisible:!1}}}},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0;var s=i(15),o=n(s),a=i(46),r=n(a),l=i(140),u=function(e,t){var i=t.sortingColumn;return i&&"string"!=typeof i.sortable?(0,l.orderBy)(e,t.sortProp,t.sortOrder,i.sortMethod):e},c=function(e,t){var i={};return(e||[]).forEach(function(e,n){i[(0,l.getRowIdentity)(e,t)]={row:e,index:n}}),i},d=function(e,t,i){var n=!1,s=e.selection,o=s.indexOf(t);return"undefined"==typeof i?o===-1?(s.push(t),n=!0):(s.splice(o,1),n=!0):i&&o===-1?(s.push(t),n=!0):!i&&o>-1&&(s.splice(o,1),n=!0),n},h=function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};if(!e)throw new Error("Table is required.");this.table=e,this.states={rowKey:null,_columns:[],originColumns:[],columns:[],fixedColumns:[],rightFixedColumns:[],isComplex:!1,_data:null,filteredData:null,data:null,sortingColumn:null,sortProp:null,sortOrder:null,isAllSelected:!1,selection:[],reserveSelection:!1,selectable:null,currentRow:null,hoverRow:null,filters:{},expandRows:[],defaultExpandAll:!1};for(var i in t)t.hasOwnProperty(i)&&this.states.hasOwnProperty(i)&&(this.states[i]=t[i])};h.prototype.mutations={setData:function(e,t){var i=this,n=e._data!==t;e._data=t,e.data=u(t||[],e),this.updateCurrentRow(),e.reserveSelection?!function(){var t=e.rowKey;t?!function(){var n=e.selection,s=c(n,t);e.data.forEach(function(e){var i=(0,l.getRowIdentity)(e,t),o=s[i];o&&(n[o.index]=e)}),i.updateAllSelected()}():console.warn("WARN: rowKey is required when reserve-selection is enabled.")}():(n?this.clearSelection():this.cleanSelection(),this.updateAllSelected());var s=e.defaultExpandAll;s&&(this.states.expandRows=(e.data||[]).slice(0)),o.default.nextTick(function(){return i.table.updateScrollY()})},changeSortCondition:function(e){var t=this;e.data=u(e.filteredData||e._data||[],e),this.table.$emit("sort-change",{column:this.states.sortingColumn,prop:this.states.sortProp,order:this.states.sortOrder}),o.default.nextTick(function(){return t.table.updateScrollY()})},filterChange:function(e,t){var i=this,n=t.column,s=t.values,a=t.silent;s&&!Array.isArray(s)&&(s=[s]);var r=n.property,c={};r&&(e.filters[n.id]=s,c[n.columnKey||n.id]=s);var d=e._data;Object.keys(e.filters).forEach(function(t){var n=e.filters[t];if(n&&0!==n.length){var s=(0,l.getColumnById)(i.states,t);s&&s.filterMethod&&(d=d.filter(function(e){return n.some(function(t){return s.filterMethod.call(null,t,e)})}))}}),e.filteredData=d,e.data=u(d,e),a||this.table.$emit("filter-change",c),o.default.nextTick(function(){return i.table.updateScrollY()})},insertColumn:function(e,t,i,n){var s=e._columns;n&&(s=n.children,s||(s=n.children=[])),"undefined"!=typeof i?s.splice(i,0,t):s.push(t),"selection"===t.type&&(e.selectable=t.selectable,e.reserveSelection=t.reserveSelection),this.updateColumns(),this.scheduleLayout()},removeColumn:function(e,t){var i=e._columns;i&&i.splice(i.indexOf(t),1),this.updateColumns(),this.scheduleLayout()},setHoverRow:function(e,t){e.hoverRow=t},setCurrentRow:function(e,t){var i=e.currentRow;e.currentRow=t,i!==t&&this.table.$emit("current-change",t,i)},rowSelectedChanged:function(e,t){var i=d(e,t),n=e.selection;if(i){var s=this.table;s.$emit("selection-change",n),s.$emit("select",n,t)}this.updateAllSelected()},toggleRowExpanded:function(e,t,i){var n=e.expandRows;if("undefined"!=typeof i){var s=n.indexOf(t);i?s===-1&&n.push(t):s!==-1&&n.splice(s,1)}else{var o=n.indexOf(t);o===-1?n.push(t):n.splice(o,1)}this.table.$emit("expand",t,n.indexOf(t)!==-1)},toggleAllSelection:(0,r.default)(10,function(e){var t=e.data||[],i=!e.isAllSelected,n=this.states.selection,s=!1;t.forEach(function(t,n){e.selectable?e.selectable.call(null,t,n)&&d(e,t,i)&&(s=!0):d(e,t,i)&&(s=!0)});var o=this.table;s&&o.$emit("selection-change",n),o.$emit("select-all",n),e.isAllSelected=i})};var f=function e(t){var i=[];return t.forEach(function(t){t.children?i.push.apply(i,e(t.children)):i.push(t)}),i};h.prototype.updateColumns=function(){var e=this.states,t=e._columns||[];e.fixedColumns=t.filter(function(e){return e.fixed===!0||"left"===e.fixed}),e.rightFixedColumns=t.filter(function(e){return"right"===e.fixed}),e.fixedColumns.length>0&&t[0]&&"selection"===t[0].type&&!t[0].fixed&&(t[0].fixed=!0,e.fixedColumns.unshift(t[0])),e.originColumns=[].concat(e.fixedColumns).concat(t.filter(function(e){return!e.fixed})).concat(e.rightFixedColumns),e.columns=f(e.originColumns),e.isComplex=e.fixedColumns.length>0||e.rightFixedColumns.length>0},h.prototype.isSelected=function(e){return(this.states.selection||[]).indexOf(e)>-1},h.prototype.clearSelection=function(){var e=this.states;e.isAllSelected=!1;var t=e.selection;e.selection=[],t.length>0&&this.table.$emit("selection-change",e.selection)},h.prototype.setExpandRowKeys=function(e){var t=[],i=this.states.data,n=this.states.rowKey;if(!n)throw new Error("[Table] prop row-key should not be empty.");var s=c(i,n);e.forEach(function(e){var i=s[e];i&&t.push(i.row)}),this.states.expandRows=t},h.prototype.toggleRowSelection=function(e,t){var i=d(this.states,e,t);i&&this.table.$emit("selection-change",this.states.selection)},h.prototype.cleanSelection=function(){var e=this.states.selection||[],t=this.states.data,i=this.states.rowKey,n=void 0;if(i){n=[];var s=c(e,i),o=c(t,i);for(var a in s)s.hasOwnProperty(a)&&!o[a]&&n.push(s[a].row)}else n=e.filter(function(e){return t.indexOf(e)===-1});n.forEach(function(t){e.splice(e.indexOf(t),1)}),n.length&&this.table.$emit("selection-change",e)},h.prototype.updateAllSelected=function(){var e=this.states,t=e.selection,i=e.rowKey,n=e.selectable,s=e.data;if(!s||0===s.length)return void(e.isAllSelected=!1);var o=void 0;i&&(o=c(e.selection,i));for(var a=function(e){return o?!!o[(0,l.getRowIdentity)(e,i)]:t.indexOf(e)!==-1},r=!0,u=0,d=0,h=s.length;d<h;d++){var f=s[d];if(n){var p=n.call(null,f,d);if(p){if(!a(f)){r=!1;break}u++}}else{if(!a(f)){r=!1;break}u++}}0===u&&(r=!1),e.isAllSelected=r},h.prototype.scheduleLayout=function(){this.table.debouncedLayout()},h.prototype.setCurrentRowKey=function(e){var t=this.states,i=t.rowKey;if(!i)throw new Error("[Table] row-key should not be empty.");var n=t.data||[],s=c(n,i),o=s[e];o&&(t.currentRow=o.row)},h.prototype.updateCurrentRow=function(){var e=this.states,t=this.table,i=e.data||[],n=e.currentRow;i.indexOf(n)===-1&&(e.currentRow=null,e.currentRow!==n&&t.$emit("current-change",null,n))},h.prototype.commit=function(e){var t=this.mutations;if(!t[e])throw new Error("Action not found: "+e);for(var i=arguments.length,n=Array(i>1?i-1:0),s=1;s<i;s++)n[s-1]=arguments[s];t[e].apply(this,[this.states].concat(n))},t.default=h},function(e,t,i){"use strict";t.__esModule=!0,t.getRowIdentity=t.mousewheel=t.getColumnByCell=t.getColumnById=t.orderBy=t.getCell=void 0;var n="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},s=i(18),o=(t.getCell=function(e){for(var t=e.target;t&&"HTML"!==t.tagName.toUpperCase();){if("TD"===t.tagName.toUpperCase())return t;t=t.parentNode}return null},function(e){return null!==e&&"object"===("undefined"==typeof e?"undefined":n(e))}),a=(t.orderBy=function(e,t,i,n){if("string"==typeof i&&(i="descending"===i?-1:1),!t&&!n)return e;var a=i&&i<0?-1:1;return e.slice().sort(n?function(e,t){return n(e,t)?a:-a}:function(e,i){return"$key"!==t&&(o(e)&&"$value"in e&&(e=e.$value),o(i)&&"$value"in i&&(i=i.$value)),e=o(e)?(0,s.getValueByPath)(e,t):e,i=o(i)?(0,s.getValueByPath)(i,t):i,e===i?0:e>i?a:-a})},t.getColumnById=function(e,t){var i=null;return e.columns.forEach(function(e){e.id===t&&(i=e)}),i}),r=(t.getColumnByCell=function(e,t){var i=(t.className||"").match(/el-table_[^\s]+/gm);return i?a(e,i[0]):null},"undefined"!=typeof navigator&&navigator.userAgent.toLowerCase().indexOf("firefox")>-1);t.mousewheel=function(e,t){e&&e.addEventListener&&e.addEventListener(r?"DOMMouseScroll":"mousewheel",t)},t.getRowIdentity=function(e,t){if(!e)throw new Error("row is required when get row identity");if("string"==typeof t){if(t.indexOf(".")<0)return e[t];for(var i=t.split("."),n=e,s=0;s<i.length;s++)n=n[i[s]];return n}if("function"==typeof t)return t.call(null,e)}},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}function s(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}t.__esModule=!0;var o=i(31),a=n(o),r=function(){function e(t){s(this,e),this.table=null,this.store=null,this.columns=null,this.fit=!0,this.showHeader=!0,this.height=null,this.scrollX=!1,this.scrollY=!1,this.bodyWidth=null,this.fixedWidth=null,this.rightFixedWidth=null,this.tableHeight=null,this.headerHeight=44,this.footerHeight=44,this.viewportHeight=null,this.bodyHeight=null,this.fixedBodyHeight=null,this.gutterWidth=(0,a.default)();for(var i in t)t.hasOwnProperty(i)&&(this[i]=t[i]);if(!this.table)throw new Error("table is required for Table Layout");if(!this.store)throw new Error("store is required for Table Layout")}return e.prototype.updateScrollY=function(){var e=this.height;if("string"==typeof e||"number"==typeof e){var t=this.table.bodyWrapper;if(this.table.$el&&t){var i=t.querySelector(".el-table__body");this.scrollY=i.offsetHeight>t.offsetHeight}}},e.prototype.setHeight=function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"height",i=this.table.$el;"string"==typeof e&&/^\d+$/.test(e)&&(e=Number(e)),this.height=e,i&&("number"==typeof e?(i.style[t]=e+"px",this.updateHeight()):"string"==typeof e&&(""===e&&(i.style[t]=""),this.updateHeight()))},e.prototype.setMaxHeight=function(e){return this.setHeight(e,"max-height")},e.prototype.updateHeight=function(){var e=this.tableHeight=this.table.$el.clientHeight,t=!this.table.data||0===this.table.data.length,i=this.table.$refs,n=i.headerWrapper,s=i.footerWrapper,o=this.footerHeight=s?s.offsetHeight:0;if(!this.showHeader||n){if(this.showHeader){var a=this.headerHeight=n.offsetHeight,r=e-a-o+(s?1:0);null===this.height||isNaN(this.height)&&"string"!=typeof this.height||(this.bodyHeight=r),this.fixedBodyHeight=this.scrollX?r-this.gutterWidth:r}else this.headerHeight=0,null===this.height||isNaN(this.height)&&"string"!=typeof this.height||(this.bodyHeight=e-o+(s?1:0)),this.fixedBodyHeight=this.scrollX?e-this.gutterWidth:e;this.viewportHeight=this.scrollX?e-(t?0:this.gutterWidth):e}},e.prototype.update=function(){var e=this.fit,t=this.table.columns,i=this.table.$el.clientWidth,n=0,s=[];t.forEach(function(e){e.isColumnGroup?s.push.apply(s,e.columns):s.push(e)});var o=s.filter(function(e){return"number"!=typeof e.width});if(o.length>0&&e){if(s.forEach(function(e){n+=e.width||e.minWidth||80}),n<i-this.gutterWidth){this.scrollX=!1;var a=i-this.gutterWidth-n;1===o.length?o[0].realWidth=(o[0].minWidth||80)+a:!function(){var e=o.reduce(function(e,t){return e+(t.minWidth||80)},0),t=a/e,i=0;o.forEach(function(e,n){if(0!==n){var s=Math.floor((e.minWidth||80)*t);i+=s,e.realWidth=(e.minWidth||80)+s}}),o[0].realWidth=(o[0].minWidth||80)+a-i}()}else this.scrollX=!0,o.forEach(function(e){e.realWidth=e.minWidth});this.bodyWidth=Math.max(n,i)}else s.forEach(function(e){e.width||e.minWidth?e.realWidth=e.width||e.minWidth:e.realWidth=80,n+=e.realWidth}),this.scrollX=n>i,this.bodyWidth=n;var r=this.store.states.fixedColumns;if(r.length>0){var l=0;r.forEach(function(e){l+=e.realWidth}),this.fixedWidth=l}var u=this.store.states.rightFixedColumns;if(u.length>0){var c=0;u.forEach(function(e){c+=e.realWidth}),this.rightFixedWidth=c}},e}();t.default=r},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0;var s=i(140),o=i(30),a=i(116),r=n(a),l=i(143),u=n(l),c=i(46),d=n(c);t.default={components:{ElCheckbox:r.default,ElTooltip:u.default},props:{store:{required:!0},stripe:Boolean,context:{},layout:{required:!0},rowClassName:[String,Function],rowStyle:[Object,Function],fixed:String,highlight:Boolean},render:function(e){var t=this,i=this.columns.map(function(e,i){return t.isColumnHidden(i)});return e("table",{class:"el-table__body",attrs:{cellspacing:"0",cellpadding:"0",border:"0"}},[e("colgroup",null,[this._l(this.columns,function(t){return e("col",{attrs:{name:t.id,width:t.realWidth||t.width}},[])})]),e("tbody",null,[this._l(this.data,function(n,s){return[e("tr",{style:t.rowStyle?t.getRowStyle(n,s):null,key:t.table.rowKey?t.getKeyOfRow(n,s):s,on:{dblclick:function(e){return t.handleDoubleClick(e,n)},click:function(e){return t.handleClick(e,n)},contextmenu:function(e){return t.handleContextMenu(e,n)},mouseenter:function(e){return t.handleMouseEnter(s)},mouseleave:function(e){return t.handleMouseLeave()}},class:[t.getRowClass(n,s)]},[t._l(t.columns,function(o,a){return e("td",{class:[o.id,o.align,o.className||"",i[a]?"is-hidden":""],on:{mouseenter:function(e){return t.handleCellMouseEnter(e,n)},mouseleave:t.handleCellMouseLeave}},[o.renderCell.call(t._renderProxy,e,{row:n,column:o,$index:s,store:t.store,_self:t.context||t.table.$vnode.context},i[a])])}),!t.fixed&&t.layout.scrollY&&t.layout.gutterWidth?e("td",{class:"gutter"},[]):""]),t.store.states.expandRows.indexOf(n)>-1?e("tr",null,[e("td",{attrs:{colspan:t.columns.length},class:"el-table__expanded-cell"},[t.table.renderExpanded?t.table.renderExpanded(e,{row:n,$index:s,store:t.store}):""])]):""]}).concat(this._self.$parent.$slots.append).concat(e("el-tooltip",{attrs:{effect:this.table.tooltipEffect,placement:"top",content:this.tooltipContent},ref:"tooltip"},[]))])])},watch:{"store.states.hoverRow":function(e,t){if(this.store.states.isComplex){var i=this.$el;if(i){var n=i.querySelectorAll("tbody > tr.el-table__row"),s=n[t],a=n[e];s&&(0,o.removeClass)(s,"hover-row"),a&&(0,o.addClass)(a,"hover-row")}}},"store.states.currentRow":function(e,t){if(this.highlight){var i=this.$el;if(i){var n=this.store.states.data,s=i.querySelectorAll("tbody > tr.el-table__row"),a=s[n.indexOf(t)],r=s[n.indexOf(e)];a?(0,o.removeClass)(a,"current-row"):s&&[].forEach.call(s,function(e){return(0,o.removeClass)(e,"current-row")}),r&&(0,o.addClass)(r,"current-row")}}}},computed:{table:function(){return this.$parent},data:function(){return this.store.states.data},columnsCount:function(){return this.store.states.columns.length},leftFixedCount:function(){return this.store.states.fixedColumns.length},rightFixedCount:function(){return this.store.states.rightFixedColumns.length},columns:function(){return this.store.states.columns}},data:function(){return{tooltipContent:""}},created:function(){this.activateTooltip=(0,d.default)(50,function(e){return e.handleShowPopper()})},methods:{getKeyOfRow:function(e,t){var i=this.table.rowKey;return i?(0,s.getRowIdentity)(e,i):t},isColumnHidden:function(e){return this.fixed===!0||"left"===this.fixed?e>=this.leftFixedCount:"right"===this.fixed?e<this.columnsCount-this.rightFixedCount:e<this.leftFixedCount||e>=this.columnsCount-this.rightFixedCount},getRowStyle:function(e,t){var i=this.rowStyle;return"function"==typeof i?i.call(null,e,t):i},getRowClass:function(e,t){var i=["el-table__row"];this.stripe&&t%2===1&&i.push("el-table__row--striped");var n=this.rowClassName;return"string"==typeof n?i.push(n):"function"==typeof n&&i.push(n.call(null,e,t)||""),i.join(" ")},handleCellMouseEnter:function(e,t){var i=this.table,n=(0,s.getCell)(e);if(n){var a=(0,s.getColumnByCell)(i,n),r=i.hoverState={cell:n,column:a,row:t};i.$emit("cell-mouse-enter",r.row,r.column,r.cell,e)}var l=e.target.querySelector(".cell");if((0,o.hasClass)(l,"el-tooltip")&&l.scrollWidth>l.offsetWidth){var u=this.$refs.tooltip;this.tooltipContent=n.innerText,u.referenceElm=n,u.$refs.popper&&(u.$refs.popper.style.display="none"),u.doDestroy(),u.setExpectedState(!0),this.activateTooltip(u)}},handleCellMouseLeave:function(e){var t=this.$refs.tooltip;t&&(t.setExpectedState(!1),t.handleClosePopper());var i=(0,s.getCell)(e);if(i){var n=this.table.hoverState;this.table.$emit("cell-mouse-leave",n.row,n.column,n.cell,e)}},handleMouseEnter:function(e){this.store.commit("setHoverRow",e)},handleMouseLeave:function(){this.store.commit("setHoverRow",null)},handleContextMenu:function(e,t){this.handleEvent(e,t,"contextmenu")},handleDoubleClick:function(e,t){this.handleEvent(e,t,"dblclick")},handleClick:function(e,t){this.store.commit("setCurrentRow",t),this.handleEvent(e,t,"click")},handleEvent:function(e,t,i){var n=this.table,o=(0,s.getCell)(e),a=void 0;o&&(a=(0,s.getColumnByCell)(n,o),a&&n.$emit("cell-"+i,t,a,o,e)),n.$emit("row-"+i,t,e,a)},handleExpandClick:function(e){this.store.commit("toggleRowExpanded",e)}}}},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0;var s=i(144),o=n(s);o.default.install=function(e){e.component(o.default.name,o.default)},t.default=o.default},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0;var s=i(27),o=n(s),a=i(46),r=n(a),l=i(145),u=i(15),c=n(u);t.default={name:"ElTooltip",mixins:[o.default],props:{openDelay:{type:Number,default:0},disabled:Boolean,manual:Boolean,effect:{type:String,default:"dark"},popperClass:String,content:String,visibleArrow:{default:!0},transition:{type:String,default:"el-fade-in-linear"},popperOptions:{default:function(){return{boundariesPadding:10,gpuAcceleration:!1}}},enterable:{type:Boolean,default:!0}},beforeCreate:function(){var e=this;this.$isServer||(this.popperVM=new c.default({data:{node:""},render:function(e){return this.node}}).$mount(),this.debounceClose=(0,r.default)(200,function(){return e.handleClosePopper()}))},render:function(e){var t=this;if(this.popperVM&&(this.popperVM.node=e("transition",{attrs:{name:this.transition},on:{afterLeave:this.doDestroy}},[e("div",{on:{mouseleave:function(){t.setExpectedState(!1),t.debounceClose()},mouseenter:function(){t.setExpectedState(!0)}},ref:"popper",directives:[{name:"show",value:!this.disabled&&this.showPopper}],class:["el-tooltip__popper","is-"+this.effect,this.popperClass]},[this.$slots.content||this.content])])),!this.$slots.default||!this.$slots.default.length)return this.$slots.default;var i=(0,l.getFirstComponentChild)(this.$slots.default);if(!i)return i;var n=i.data=i.data||{},s=i.data.on=i.data.on||{},o=i.data.nativeOn=i.data.nativeOn||{};return s.mouseenter=this.addEventHandle(s.mouseenter,function(){t.setExpectedState(!0),t.handleShowPopper()}),s.mouseleave=this.addEventHandle(s.mouseleave,function(){t.setExpectedState(!1),t.debounceClose()}),o.mouseenter=this.addEventHandle(o.mouseenter,function(){t.setExpectedState(!0),t.handleShowPopper()}),o.mouseleave=this.addEventHandle(o.mouseleave,function(){t.setExpectedState(!1),t.debounceClose()}),n.staticClass=this.concatClass(n.staticClass,"el-tooltip"),i},mounted:function(){this.referenceElm=this.$el},methods:{addEventHandle:function(e,t){return e?Array.isArray(e)?e.concat(t):[e,t]:t},concatClass:function(e,t){return e&&e.indexOf(t)>-1?e:e?t?e+" "+t:e:t||""},handleShowPopper:function(){var e=this;this.expectedState&&!this.manual&&(clearTimeout(this.timeout),this.timeout=setTimeout(function(){e.showPopper=!0},this.openDelay))},handleClosePopper:function(){this.enterable&&this.expectedState||this.manual||(clearTimeout(this.timeout),this.showPopper=!1)},setExpectedState:function(e){this.expectedState=e}}}},function(e,t,i){"use strict";function n(e){return"object"===("undefined"==typeof e?"undefined":o(e))&&(0,a.hasOwn)(e,"componentOptions")}function s(e){return e&&e.filter(function(e){return e&&e.tag})[0]}t.__esModule=!0;var o="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e};t.isVNode=n,t.getFirstComponentChild=s;var a=i(18)},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0;var s=i(30),o=i(116),a=n(o),r=i(37),l=n(r),u=i(15),c=n(u),d=i(147),h=n(d),f=function e(t){var i=[];return t.forEach(function(t){t.children?(i.push(t),i.push.apply(i,e(t.children))):i.push(t)}),i},p=function(e){var t=1,i=function e(i,n){if(n&&(i.level=n.level+1,t<i.level&&(t=i.level)),i.children){var s=0;i.children.forEach(function(t){e(t,i),s+=t.colSpan}),i.colSpan=s}else i.colSpan=1};e.forEach(function(e){e.level=1,i(e)});for(var n=[],s=0;s<t;s++)n.push([]);var o=f(e);return o.forEach(function(e){e.children?e.rowSpan=1:e.rowSpan=t-e.level+1,n[e.level-1].push(e)}),n};t.default={name:"ElTableHeader",render:function(e){var t=this,i=this.store.states.originColumns,n=p(i,this.columns);return e("table",{class:"el-table__header",attrs:{cellspacing:"0",cellpadding:"0",border:"0"}},[e("colgroup",null,[this._l(this.columns,function(t){return e("col",{attrs:{name:t.id,width:t.realWidth||t.width}},[])}),!this.fixed&&this.layout.gutterWidth?e("col",{attrs:{name:"gutter",width:this.layout.scrollY?this.layout.gutterWidth:""}},[]):""]),e("thead",null,[this._l(n,function(i,n){return e("tr",null,[t._l(i,function(s,o){return e("th",{attrs:{colspan:s.colSpan,rowspan:s.rowSpan},on:{mousemove:function(e){return t.handleMouseMove(e,s)},mouseout:t.handleMouseOut,mousedown:function(e){return t.handleMouseDown(e,s)},click:function(e){return t.handleHeaderClick(e,s)}},class:[s.id,s.order,s.headerAlign,s.className||"",0===n&&t.isCellHidden(o,i)?"is-hidden":"",s.children?"":"is-leaf",s.labelClassName]},[e("div",{class:["cell",s.filteredValue&&s.filteredValue.length>0?"highlight":"",s.labelClassName]},[s.renderHeader?s.renderHeader.call(t._renderProxy,e,{column:s,$index:o,store:t.store,_self:t.$parent.$vnode.context}):s.label,s.sortable?e("span",{class:"caret-wrapper",on:{click:function(e){return t.handleSortClick(e,s)}}},[e("i",{class:"sort-caret ascending",on:{click:function(e){return t.handleSortClick(e,s,"ascending")}}},[]),e("i",{class:"sort-caret descending",on:{click:function(e){return t.handleSortClick(e,s,"descending")}}},[])]):"",s.filterable?e("span",{class:"el-table__column-filter-trigger",on:{click:function(e){return t.handleFilterClick(e,s)}}},[e("i",{class:["el-icon-arrow-down",s.filterOpened?"el-icon-arrow-up":""]},[])]):""])])}),!t.fixed&&t.layout.gutterWidth?e("th",{class:"gutter",style:{width:t.layout.scrollY?t.layout.gutterWidth+"px":"0"}},[]):""])})])])},props:{fixed:String,store:{required:!0},layout:{required:!0},border:Boolean,defaultSort:{type:Object,default:function(){return{prop:"",order:""}}}},components:{ElCheckbox:a.default,ElTag:l.default},computed:{isAllSelected:function(){return this.store.states.isAllSelected},columnsCount:function(){return this.store.states.columns.length},leftFixedCount:function(){return this.store.states.fixedColumns.length},rightFixedCount:function(){return this.store.states.rightFixedColumns.length},columns:function(){return this.store.states.columns}},created:function(){this.filterPanels={}},mounted:function(){var e=this;this.defaultSort.prop&&!function(){var t=e.store.states;t.sortProp=e.defaultSort.prop,t.sortOrder=e.defaultSort.order||"ascending",e.$nextTick(function(i){for(var n=0,s=e.columns.length;n<s;n++){var o=e.columns[n];if(o.property===t.sortProp){o.order=t.sortOrder,t.sortingColumn=o;break}}t.sortingColumn&&e.store.commit("changeSortCondition")})}()},beforeDestroy:function(){var e=this.filterPanels;for(var t in e)e.hasOwnProperty(t)&&e[t]&&e[t].$destroy(!0)},methods:{isCellHidden:function(e,t){if(this.fixed===!0||"left"===this.fixed)return e>=this.leftFixedCount;if("right"===this.fixed){for(var i=0,n=0;n<e;n++)i+=t[n].colSpan;return i<this.columnsCount-this.rightFixedCount}return e<this.leftFixedCount||e>=this.columnsCount-this.rightFixedCount},toggleAllSelection:function(){this.store.commit("toggleAllSelection")},handleFilterClick:function(e,t){e.stopPropagation();var i=e.target,n=i.parentNode,s=this.$parent,o=this.filterPanels[t.id];return o&&t.filterOpened?void(o.showPopper=!1):(o||(o=new c.default(h.default),this.filterPanels[t.id]=o,t.filterPlacement&&(o.placement=t.filterPlacement),o.table=s,o.cell=n,o.column=t,!this.$isServer&&o.$mount(document.createElement("div"))),void setTimeout(function(){o.showPopper=!0},16))},handleHeaderClick:function(e,t){!t.filters&&t.sortable?this.handleSortClick(e,t):t.filters&&!t.sortable&&this.handleFilterClick(e,t),this.$parent.$emit("header-click",t,e)},handleMouseDown:function(e,t){var i=this;this.$isServer||t.children&&t.children.length>0||this.draggingColumn&&this.border&&!function(){i.dragging=!0,i.$parent.resizeProxyVisible=!0;var n=i.$parent,o=n.$el,a=o.getBoundingClientRect().left,r=i.$el.querySelector("th."+t.id),l=r.getBoundingClientRect(),u=l.left-a+30;(0,s.addClass)(r,"noclick"),i.dragState={startMouseLeft:e.clientX,startLeft:l.right-a,startColumnLeft:l.left-a,tableLeft:a};var c=n.$refs.resizeProxy;c.style.left=i.dragState.startLeft+"px",document.onselectstart=function(){return!1},document.ondragstart=function(){return!1};var d=function(e){var t=e.clientX-i.dragState.startMouseLeft,n=i.dragState.startLeft+t;c.style.left=Math.max(u,n)+"px"},h=function o(){if(i.dragging){var a=i.dragState,l=a.startColumnLeft,u=a.startLeft,h=parseInt(c.style.left,10),f=h-l;t.width=t.realWidth=f,n.$emit("header-dragend",t.width,u-l,t,e),i.store.scheduleLayout(),document.body.style.cursor="",i.dragging=!1,i.draggingColumn=null,i.dragState={},n.resizeProxyVisible=!1}document.removeEventListener("mousemove",d),document.removeEventListener("mouseup",o),document.onselectstart=null,document.ondragstart=null,setTimeout(function(){(0,s.removeClass)(r,"noclick")},0)};document.addEventListener("mousemove",d),document.addEventListener("mouseup",h)}()},handleMouseMove:function(e,t){if(!(t.children&&t.children.length>0)){for(var i=e.target;i&&"TH"!==i.tagName;)i=i.parentNode;if(t&&t.resizable&&!this.dragging&&this.border){var n=i.getBoundingClientRect(),s=document.body.style;n.width>12&&n.right-e.pageX<8?(s.cursor="col-resize",this.draggingColumn=t):this.dragging||(s.cursor="",this.draggingColumn=null)}}},handleMouseOut:function(){this.$isServer||(document.body.style.cursor="")},toggleOrder:function(e){return e?"ascending"===e?"descending":null:"ascending"},handleSortClick:function(e,t,i){e.stopPropagation();for(var n=i||this.toggleOrder(t.order),o=e.target;o&&"TH"!==o.tagName;)o=o.parentNode;if(o&&"TH"===o.tagName&&(0,s.hasClass)(o,"noclick"))return void(0,s.removeClass)(o,"noclick");if(t.sortable){var a=this.store.states,r=a.sortProp,l=void 0,u=a.sortingColumn;u!==t&&(u&&(u.order=null),a.sortingColumn=t,r=t.property),n?l=t.order=n:(l=t.order=null,a.sortingColumn=null,r=null),a.sortProp=r,a.sortOrder=l,this.store.commit("changeSortCondition")}}},data:function(){return{draggingColumn:null,dragging:!1,dragState:{}}}}},function(e,t,i){var n=i(5)(i(148),i(150),null,null,null);e.exports=n.exports},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0;var s=i(27),o=n(s),a=i(28),r=i(12),l=n(r),u=i(48),c=n(u),d=i(149),h=n(d),f=i(116),p=n(f),m=i(124),v=n(m);t.default={name:"ElTableFilterPanel",mixins:[o.default,l.default],directives:{Clickoutside:c.default},components:{ElCheckbox:p.default,ElCheckboxGroup:v.default},props:{placement:{type:String,default:"bottom-end"}},customRender:function(e){return e("div",{class:"el-table-filter"},[e("div",{class:"el-table-filter__content"},[]),e("div",{class:"el-table-filter__bottom"},[e("button",{on:{click:this.handleConfirm}},[this.t("el.table.confirmFilter")]),e("button",{on:{click:this.handleReset}},[this.t("el.table.resetFilter")])])])},methods:{isActive:function(e){return e.value===this.filterValue},handleOutsideClick:function(){this.showPopper=!1},handleConfirm:function(){this.confirmFilter(this.filteredValue),this.handleOutsideClick()},handleReset:function(){this.filteredValue=[],this.confirmFilter(this.filteredValue),this.handleOutsideClick()},handleSelect:function(e){this.filterValue=e,"undefined"!=typeof e&&null!==e?this.confirmFilter(this.filteredValue):this.confirmFilter([]),this.handleOutsideClick()},confirmFilter:function(e){this.table.store.commit("filterChange",{column:this.column,values:e})}},data:function(){return{table:null,cell:null,column:null}},computed:{filters:function(){return this.column&&this.column.filters},filterValue:{get:function(){return(this.column.filteredValue||[])[0]},set:function(e){this.filteredValue&&("undefined"!=typeof e&&null!==e?this.filteredValue.splice(0,1,e):this.filteredValue.splice(0,1))}},filteredValue:{get:function(){
return this.column?this.column.filteredValue||[]:[]},set:function(e){this.column&&(this.column.filteredValue=e)}},multiple:function(){return!this.column||this.column.filterMultiple}},mounted:function(){var e=this;this.popperElm=this.$el,this.referenceElm=this.cell,this.table.bodyWrapper.addEventListener("scroll",function(){e.updatePopper()}),this.$watch("showPopper",function(t){e.column&&(e.column.filterOpened=t),t?h.default.open(e):h.default.close(e)})},watch:{showPopper:function(e){e===!0&&parseInt(this.popperJS._popper.style.zIndex,10)<a.PopupManager.zIndex&&(this.popperJS._popper.style.zIndex=a.PopupManager.nextZIndex())}}}},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0;var s=i(15),o=n(s),a=[];!o.default.prototype.$isServer&&document.addEventListener("click",function(e){a.forEach(function(t){var i=e.target;t&&t.$el&&(i===t.$el||t.$el.contains(i)||t.handleOutsideClick&&t.handleOutsideClick(e))})}),t.default={open:function(e){e&&a.push(e)},close:function(e){var t=a.indexOf(e);t!==-1&&a.splice(e,1)}}},function(e,t){e.exports={render:function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("transition",{attrs:{name:"el-zoom-in-top"}},[e.multiple?i("div",{directives:[{name:"show",rawName:"v-show",value:e.showPopper,expression:"showPopper"}],staticClass:"el-table-filter"},[i("div",{staticClass:"el-table-filter__content"},[i("el-checkbox-group",{staticClass:"el-table-filter__checkbox-group",model:{value:e.filteredValue,callback:function(t){e.filteredValue=t},expression:"filteredValue"}},e._l(e.filters,function(t){return i("el-checkbox",{key:t.value,attrs:{label:t.value}},[e._v(e._s(t.text))])}))],1),i("div",{staticClass:"el-table-filter__bottom"},[i("button",{class:{"is-disabled":0===e.filteredValue.length},attrs:{disabled:0===e.filteredValue.length},on:{click:e.handleConfirm}},[e._v(e._s(e.t("el.table.confirmFilter")))]),i("button",{on:{click:e.handleReset}},[e._v(e._s(e.t("el.table.resetFilter")))])])]):i("div",{directives:[{name:"show",rawName:"v-show",value:e.showPopper,expression:"showPopper"}],staticClass:"el-table-filter"},[i("ul",{staticClass:"el-table-filter__list"},[i("li",{staticClass:"el-table-filter__list-item",class:{"is-active":!e.filterValue},on:{click:function(t){e.handleSelect(null)}}},[e._v(e._s(e.t("el.table.clearFilter")))]),e._l(e.filters,function(t){return i("li",{key:t.value,staticClass:"el-table-filter__list-item",class:{"is-active":e.isActive(t)},attrs:{label:t.value},on:{click:function(i){e.handleSelect(t.value)}}},[e._v(e._s(t.text))])})],2)])])},staticRenderFns:[]}},function(e,t){"use strict";t.__esModule=!0,t.default={name:"ElTableFooter",render:function(e){var t=this,i=[];return this.columns.forEach(function(e,n){if(0===n)return void(i[n]=t.sumText);var s=t.store.states.data.map(function(t){return Number(t[e.property])}),o=[],a=!0;s.forEach(function(e){if(!isNaN(e)){a=!1;var t=(""+e).split(".")[1];o.push(t?t.length:0)}});var r=Math.max.apply(null,o);a?i[n]="":i[n]=s.reduce(function(e,t){var i=Number(t);return isNaN(i)?e:parseFloat((e+t).toFixed(Math.min(r,20)))},0)}),e("table",{class:"el-table__footer",attrs:{cellspacing:"0",cellpadding:"0",border:"0"}},[e("colgroup",null,[this._l(this.columns,function(t){return e("col",{attrs:{name:t.id,width:t.realWidth||t.width}},[])}),!this.fixed&&this.layout.gutterWidth?e("col",{attrs:{name:"gutter",width:this.layout.scrollY?this.layout.gutterWidth:""}},[]):""]),e("tbody",null,[e("tr",null,[this._l(this.columns,function(n,s){return e("td",{attrs:{colspan:n.colSpan,rowspan:n.rowSpan},class:[n.id,n.headerAlign,n.className||"",t.isCellHidden(s,t.columns)?"is-hidden":"",n.children?"":"is-leaf",n.labelClassName]},[e("div",{class:["cell",n.labelClassName]},[t.summaryMethod?t.summaryMethod({columns:t.columns,data:t.store.states.data})[s]:i[s]])])}),!this.fixed&&this.layout.gutterWidth?e("td",{class:"gutter",style:{width:this.layout.scrollY?this.layout.gutterWidth+"px":"0"}},[]):""])])])},props:{fixed:String,store:{required:!0},layout:{required:!0},summaryMethod:Function,sumText:String,border:Boolean,defaultSort:{type:Object,default:function(){return{prop:"",order:""}}}},computed:{isAllSelected:function(){return this.store.states.isAllSelected},columnsCount:function(){return this.store.states.columns.length},leftFixedCount:function(){return this.store.states.fixedColumns.length},rightFixedCount:function(){return this.store.states.rightFixedColumns.length},columns:function(){return this.store.states.columns}},methods:{isCellHidden:function(e,t){if(this.fixed===!0||"left"===this.fixed)return e>=this.leftFixedCount;if("right"===this.fixed){for(var i=0,n=0;n<e;n++)i+=t[n].colSpan;return i<this.columnsCount-this.rightFixedCount}return e<this.leftFixedCount||e>=this.columnsCount-this.rightFixedCount}}}},function(e,t){e.exports={render:function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("div",{staticClass:"el-table",class:{"el-table--fit":e.fit,"el-table--striped":e.stripe,"el-table--border":e.border,"el-table--hidden":e.isHidden,"el-table--fluid-height":e.maxHeight,"el-table--enable-row-hover":!e.store.states.isComplex,"el-table--enable-row-transition":0!==(e.store.states.data||[]).length&&(e.store.states.data||[]).length<100},on:{mouseleave:function(t){e.handleMouseLeave(t)}}},[i("div",{ref:"hiddenColumns",staticClass:"hidden-columns"},[e._t("default")],2),e.showHeader?i("div",{ref:"headerWrapper",staticClass:"el-table__header-wrapper"},[i("table-header",{style:{width:e.layout.bodyWidth?e.layout.bodyWidth+"px":""},attrs:{store:e.store,layout:e.layout,border:e.border,"default-sort":e.defaultSort}})],1):e._e(),i("div",{ref:"bodyWrapper",staticClass:"el-table__body-wrapper",style:[e.bodyHeight]},[i("table-body",{style:{width:e.bodyWidth},attrs:{context:e.context,store:e.store,stripe:e.stripe,layout:e.layout,"row-class-name":e.rowClassName,"row-style":e.rowStyle,highlight:e.highlightCurrentRow}}),e.data&&0!==e.data.length?e._e():i("div",{staticClass:"el-table__empty-block",style:{width:e.bodyWidth}},[i("span",{staticClass:"el-table__empty-text"},[e._t("empty",[e._v(e._s(e.emptyText||e.t("el.table.emptyText")))])],2)])],1),e.showSummary?i("div",{directives:[{name:"show",rawName:"v-show",value:e.data&&e.data.length>0,expression:"data && data.length > 0"}],ref:"footerWrapper",staticClass:"el-table__footer-wrapper"},[i("table-footer",{style:{width:e.layout.bodyWidth?e.layout.bodyWidth+"px":""},attrs:{store:e.store,layout:e.layout,border:e.border,"sum-text":e.sumText||e.t("el.table.sumText"),"summary-method":e.summaryMethod,"default-sort":e.defaultSort}})],1):e._e(),e.fixedColumns.length>0?i("div",{ref:"fixedWrapper",staticClass:"el-table__fixed",style:[{width:e.layout.fixedWidth?e.layout.fixedWidth+"px":""},e.fixedHeight]},[e.showHeader?i("div",{ref:"fixedHeaderWrapper",staticClass:"el-table__fixed-header-wrapper"},[i("table-header",{style:{width:e.layout.fixedWidth?e.layout.fixedWidth+"px":""},attrs:{fixed:"left",border:e.border,store:e.store,layout:e.layout}})],1):e._e(),i("div",{ref:"fixedBodyWrapper",staticClass:"el-table__fixed-body-wrapper",style:[{top:e.layout.headerHeight+"px"},e.fixedBodyHeight]},[i("table-body",{style:{width:e.layout.fixedWidth?e.layout.fixedWidth+"px":""},attrs:{fixed:"left",store:e.store,stripe:e.stripe,layout:e.layout,highlight:e.highlightCurrentRow,"row-class-name":e.rowClassName,"row-style":e.rowStyle}})],1),e.showSummary?i("div",{directives:[{name:"show",rawName:"v-show",value:e.data&&e.data.length>0,expression:"data && data.length > 0"}],ref:"fixedFooterWrapper",staticClass:"el-table__fixed-footer-wrapper"},[i("table-footer",{style:{width:e.layout.fixedWidth?e.layout.fixedWidth+"px":""},attrs:{fixed:"left",border:e.border,"sum-text":e.sumText||e.t("el.table.sumText"),"summary-method":e.summaryMethod,store:e.store,layout:e.layout}})],1):e._e()]):e._e(),e.rightFixedColumns.length>0?i("div",{ref:"rightFixedWrapper",staticClass:"el-table__fixed-right",style:[{width:e.layout.rightFixedWidth?e.layout.rightFixedWidth+"px":""},{right:e.layout.scrollY?(e.border?e.layout.gutterWidth:e.layout.gutterWidth||1)+"px":""},e.fixedHeight]},[e.showHeader?i("div",{ref:"rightFixedHeaderWrapper",staticClass:"el-table__fixed-header-wrapper"},[i("table-header",{style:{width:e.layout.rightFixedWidth?e.layout.rightFixedWidth+"px":""},attrs:{fixed:"right",border:e.border,store:e.store,layout:e.layout}})],1):e._e(),i("div",{ref:"rightFixedBodyWrapper",staticClass:"el-table__fixed-body-wrapper",style:[{top:e.layout.headerHeight+"px"},e.fixedBodyHeight]},[i("table-body",{style:{width:e.layout.rightFixedWidth?e.layout.rightFixedWidth+"px":""},attrs:{fixed:"right",store:e.store,stripe:e.stripe,layout:e.layout,"row-class-name":e.rowClassName,"row-style":e.rowStyle,highlight:e.highlightCurrentRow}})],1),e.showSummary?i("div",{directives:[{name:"show",rawName:"v-show",value:e.data&&e.data.length>0,expression:"data && data.length > 0"}],ref:"rightFixedFooterWrapper",staticClass:"el-table__fixed-footer-wrapper"},[i("table-footer",{style:{width:e.layout.rightFixedWidth?e.layout.rightFixedWidth+"px":""},attrs:{fixed:"right",border:e.border,"sum-text":e.sumText||e.t("el.table.sumText"),"summary-method":e.summaryMethod,store:e.store,layout:e.layout}})],1):e._e()]):e._e(),e.rightFixedColumns.length>0?i("div",{staticClass:"el-table__fixed-right-patch",style:{width:e.layout.scrollY?e.layout.gutterWidth+"px":"0",height:e.layout.headerHeight+"px"}}):e._e(),i("div",{directives:[{name:"show",rawName:"v-show",value:e.resizeProxyVisible,expression:"resizeProxyVisible"}],ref:"resizeProxy",staticClass:"el-table__column-resize-proxy"})])},staticRenderFns:[]}},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0;var s=i(154),o=n(s);o.default.install=function(e){e.component(o.default.name,o.default)},t.default=o.default},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}function s(e){if(null==e)throw new TypeError("Cannot destructure undefined")}t.__esModule=!0;var o=i(116),a=n(o),r=i(37),l=n(r),u=i(23),c=n(u),d=i(18),h=1,f={default:{order:""},selection:{width:48,minWidth:48,realWidth:48,order:"",className:"el-table-column--selection"},expand:{width:48,minWidth:48,realWidth:48,order:""},index:{width:48,minWidth:48,realWidth:48,order:""}},p={selection:{renderHeader:function(e){return e("el-checkbox",{nativeOn:{click:this.toggleAllSelection},attrs:{value:this.isAllSelected}},[])},renderCell:function(e,t){var i=t.row,n=t.column,s=t.store,o=t.$index;return e("el-checkbox",{attrs:{value:s.isSelected(i),disabled:!!n.selectable&&!n.selectable.call(null,i,o)},on:{input:function(){s.commit("rowSelectedChanged",i)}}},[])},sortable:!1,resizable:!1},index:{renderHeader:function(e,t){var i=t.column;return i.label||"#"},renderCell:function(e,t){var i=t.$index;return e("div",null,[i+1])},sortable:!1},expand:{renderHeader:function(e,t){return s(t),""},renderCell:function(e,t,i){var n=t.row,s=t.store,o=s.states.expandRows.indexOf(n)>-1;return e("div",{class:"el-table__expand-icon "+(o?"el-table__expand-icon--expanded":""),on:{click:function(){return i.handleExpandClick(n)}}},[e("i",{class:"el-icon el-icon-arrow-right"},[])])},sortable:!1,resizable:!1,className:"el-table__expand-column"}},m=function(e,t){var i={};(0,c.default)(i,f[e||"default"]);for(var n in t)if(t.hasOwnProperty(n)){var s=t[n];"undefined"!=typeof s&&(i[n]=s)}return i.minWidth||(i.minWidth=80),i.realWidth=i.width||i.minWidth,i},v=function(e,t){var i=t.row,n=t.column,s=n.property,o=s&&s.indexOf(".")===-1?i[s]:(0,d.getValueByPath)(i,s);return n&&n.formatter?n.formatter(i,n,o):o};t.default={name:"ElTableColumn",props:{type:{type:String,default:"default"},label:String,className:String,labelClassName:String,property:String,prop:String,width:{},minWidth:{},renderHeader:Function,sortable:{type:[String,Boolean],default:!1},sortMethod:Function,resizable:{type:Boolean,default:!0},context:{},columnKey:String,align:String,headerAlign:String,showTooltipWhenOverflow:Boolean,showOverflowTooltip:Boolean,fixed:[Boolean,String],formatter:Function,selectable:Function,reserveSelection:Boolean,filterMethod:Function,filteredValue:Array,filters:Array,filterPlacement:String,filterMultiple:{type:Boolean,default:!0}},data:function(){return{isSubColumn:!1,columns:[]}},beforeCreate:function(){this.row={},this.column={},this.$index=0},components:{ElCheckbox:a.default,ElTag:l.default},computed:{owner:function(){for(var e=this.$parent;e&&!e.tableId;)e=e.$parent;return e}},created:function(){var e=this;this.customRender=this.$options.render,this.$options.render=function(t){return t("div",e.$slots.default)},this.columnId=(this.$parent.tableId||this.$parent.columnId+"_")+"column_"+h++;var t=this.$parent,i=this.owner;this.isSubColumn=i!==t;var n=this.type,s=this.width;void 0!==s&&(s=parseInt(s,10),isNaN(s)&&(s=null));var o=this.minWidth;void 0!==o&&(o=parseInt(o,10),isNaN(o)&&(o=80));var a=!1,r=m(n,{id:this.columnId,columnKey:this.columnKey,label:this.label,className:this.className,labelClassName:this.labelClassName,property:this.prop||this.property,type:n,renderCell:null,renderHeader:this.renderHeader,minWidth:o,width:s,isColumnGroup:a,context:this.context,align:this.align?"is-"+this.align:null,headerAlign:this.headerAlign?"is-"+this.headerAlign:this.align?"is-"+this.align:null,sortable:""===this.sortable||this.sortable,sortMethod:this.sortMethod,resizable:this.resizable,showOverflowTooltip:this.showOverflowTooltip||this.showTooltipWhenOverflow,formatter:this.formatter,selectable:this.selectable,reserveSelection:this.reserveSelection,fixed:""===this.fixed||this.fixed,filterMethod:this.filterMethod,filters:this.filters,filterable:this.filters||this.filterMethod,filterMultiple:this.filterMultiple,filterOpened:!1,filteredValue:this.filteredValue||[],filterPlacement:this.filterPlacement||""});(0,c.default)(r,p[n]||{}),this.columnConfig=r;var l=r.renderCell,u=this;return"expand"===n?(i.renderExpanded=function(e,t){return u.$scopedSlots.default?u.$scopedSlots.default(t):u.$slots.default},void(r.renderCell=function(e,t){return e("div",{class:"cell"},[l(e,t,this._renderProxy)])})):void(r.renderCell=function(e,t){return u.$vnode.data.inlineTemplate?l=function(){if(t._self=u.context||t._self,"[object Object]"===Object.prototype.toString.call(t._self))for(var e in t._self)t.hasOwnProperty(e)||(t[e]=t._self[e]);return t._staticTrees=u._staticTrees,t.$options.staticRenderFns=u.$options.staticRenderFns,u.customRender.call(t)}:u.$scopedSlots.default&&(l=function(){return u.$scopedSlots.default(t)}),l||(l=v),u.showOverflowTooltip||u.showTooltipWhenOverflow?e("div",{class:"cell el-tooltip",style:"width:"+(t.column.realWidth||t.column.width)+"px"},[l(e,t)]):e("div",{class:"cell"},[l(e,t)])})},destroyed:function(){this.$parent&&this.owner.store.commit("removeColumn",this.columnConfig)},watch:{label:function(e){this.columnConfig&&(this.columnConfig.label=e)},prop:function(e){this.columnConfig&&(this.columnConfig.property=e)},property:function(e){this.columnConfig&&(this.columnConfig.property=e)},filters:function(e){this.columnConfig&&(this.columnConfig.filters=e)},filterMultiple:function(e){this.columnConfig&&(this.columnConfig.filterMultiple=e)},align:function(e){this.columnConfig&&(this.columnConfig.align=e?"is-"+e:null,this.headerAlign||(this.columnConfig.headerAlign=e?"is-"+e:null))},headerAlign:function(e){this.columnConfig&&(this.columnConfig.headerAlign="is-"+(e?e:this.align))},width:function(e){this.columnConfig&&(this.columnConfig.width=e,this.owner.store.scheduleLayout())},minWidth:function(e){this.columnConfig&&(this.columnConfig.minWidth=e,this.owner.store.scheduleLayout())},fixed:function(e){this.columnConfig&&(this.columnConfig.fixed=e,this.owner.store.scheduleLayout())},sortable:function(e){this.columnConfig&&(this.columnConfig.sortable=e)}},mounted:function(){var e=this.owner,t=this.$parent,i=void 0;i=this.isSubColumn?[].indexOf.call(t.$el.children,this.$el):[].indexOf.call(t.$refs.hiddenColumns.children,this.$el),e.store.commit("insertColumn",this.columnConfig,i,this.isSubColumn?t.columnConfig:null)}}},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0;var s=i(156),o=n(s);o.default.install=function(e){e.component(o.default.name,o.default)},t.default=o.default},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0;var s=i(157),o=n(s),a=i(162),r=n(a),l=i(180),u=n(l),c=function(e){return"daterange"===e||"datetimerange"===e?u.default:r.default};t.default={mixins:[o.default],name:"ElDatePicker",props:{type:{type:String,default:"date"}},watch:{type:function(e){this.picker?(this.unmountPicker(),this.panel=c(e),this.mountPicker()):this.panel=c(e)}},created:function(){this.panel=c(this.type)}}},function(e,t,i){var n=i(5)(i(158),i(161),null,null,null);e.exports=n.exports},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0;var s=i(15),o=n(s),a=i(48),r=n(a),l=i(159),u=i(27),c=n(u),d=i(11),h=n(d),f=i(19),p=n(f),m={props:{appendToBody:c.default.props.appendToBody,offset:c.default.props.offset,boundariesPadding:c.default.props.boundariesPadding},methods:c.default.methods,data:c.default.data,beforeDestroy:c.default.beforeDestroy},v={date:"yyyy-MM-dd",month:"yyyy-MM",datetime:"yyyy-MM-dd HH:mm:ss",time:"HH:mm:ss",week:"yyyywWW",timerange:"HH:mm:ss",daterange:"yyyy-MM-dd",datetimerange:"yyyy-MM-dd HH:mm:ss",year:"yyyy"},g=["date","datetime","time","time-select","week","month","year","daterange","timerange","datetimerange"],y=function(e,t){return(0,l.formatDate)(e,t)},b=function(e,t){return(0,l.parseDate)(e,t)},_=function(e,t,i){if(Array.isArray(e)&&2===e.length){var n=e[0],s=e[1];if(n&&s)return(0,l.formatDate)(n,t)+i+(0,l.formatDate)(s,t)}return""},C=function(e,t,i){var n=e.split(i);if(2===n.length){var s=n[0],o=n[1];return[(0,l.parseDate)(s,t),(0,l.parseDate)(o,t)]}return[]},x={default:{formatter:function(e){return e?""+e:""},parser:function(e){return void 0===e||""===e?null:e}},week:{formatter:function(e,t){var i=(0,l.formatDate)(e,t),n=(0,l.getWeekNumber)(e);return i=/WW/.test(i)?i.replace(/WW/,n<10?"0"+n:n):i.replace(/W/,n)},parser:function(e){var t=(e||"").split("w");if(2===t.length){var i=Number(t[0]),n=Number(t[1]);if(!isNaN(i)&&!isNaN(n)&&n<54)return e}return null}},date:{formatter:y,parser:b},datetime:{formatter:y,parser:b},daterange:{formatter:_,parser:C},datetimerange:{formatter:_,parser:C},timerange:{formatter:_,parser:C},time:{formatter:y,parser:b},month:{formatter:y,parser:b},year:{formatter:y,parser:b},number:{formatter:function(e){return e?""+e:""},parser:function(e){var t=Number(e);return isNaN(e)?null:t}}},w={left:"bottom-start",center:"bottom",right:"bottom-end"},M=function(e,t){var i=e instanceof Array,n=t instanceof Array;return i&&n?new Date(e[0]).getTime()===new Date(t[0]).getTime()&&new Date(e[1]).getTime()===new Date(t[1]).getTime():!i&&!n&&new Date(e).getTime()===new Date(t).getTime()};t.default={mixins:[h.default,m],props:{size:String,format:String,readonly:Boolean,placeholder:String,disabled:Boolean,clearable:{type:Boolean,default:!0},popperClass:String,editable:{type:Boolean,default:!0},align:{type:String,default:"left"},value:{},defaultValue:{},rangeSeparator:{default:" - "},pickerOptions:{}},components:{ElInput:p.default},directives:{Clickoutside:r.default},data:function(){return{pickerVisible:!1,showClose:!1,currentValue:"",unwatchPickerOptions:null}},watch:{pickerVisible:function(e){e||this.dispatch("ElFormItem","el.form.blur"),this.readonly||this.disabled||(e?this.showPicker():this.hidePicker())},currentValue:function(e){e||(this.picker&&"function"==typeof this.picker.handleClear?this.picker.handleClear():this.$emit("input"))},value:{immediate:!0,handler:function(e){this.currentValue=(0,l.isDate)(e)?new Date(e):e}},displayValue:function(e){this.$emit("change",e),this.dispatch("ElFormItem","el.form.change")}},computed:{reference:function(){return this.$refs.reference.$el},refInput:function(){return this.reference?this.reference.querySelector("input"):{}},valueIsEmpty:function(){var e=this.currentValue;if(Array.isArray(e)){for(var t=0,i=e.length;t<i;t++)if(e[t])return!1}else if(e)return!1;return!0},triggerClass:function(){return this.type.indexOf("time")!==-1?"el-icon-time":"el-icon-date"},selectionMode:function(){return"week"===this.type?"week":"month"===this.type?"month":"year"===this.type?"year":"day"},haveTrigger:function(){return"undefined"!=typeof this.showTrigger?this.showTrigger:g.indexOf(this.type)!==-1},displayValue:{get:function(){var e=this.currentValue;if(e){var t=(x[this.type]||x.default).formatter,i=v[this.type];return t(e,this.format||i,this.rangeSeparator)}},set:function(e){if(e){var t=this.type,i=(x[t]||x.default).parser,n=i(e,this.format||v[t],this.rangeSeparator);n&&this.picker&&(this.picker.value=n)}else this.$emit("input",e),this.picker.value=e;this.$forceUpdate()}}},created:function(){this.popperOptions={boundariesPadding:0,gpuAcceleration:!1},this.placement=w[this.align]||w.left},methods:{handleMouseEnterIcon:function(){this.readonly||this.disabled||!this.valueIsEmpty&&this.clearable&&(this.showClose=!0)},handleClickIcon:function(){this.readonly||this.disabled||(this.showClose?(this.currentValue=this.$options.defaultValue||"",this.showClose=!1):this.pickerVisible=!this.pickerVisible)},dateChanged:function(e,t){if(Array.isArray(e)){var i=e.length;if(!t)return!0;for(;i--;)if(!(0,l.equalDate)(e[i],t[i]))return!0}else if(!(0,l.equalDate)(e,t))return!0;return!1},handleClose:function(){this.pickerVisible=!1},handleFocus:function(){var e=this.type;g.indexOf(e)===-1||this.pickerVisible||(this.pickerVisible=!0),this.$emit("focus",this)},handleBlur:function(){this.$emit("blur",this)},handleKeydown:function(e){var t=e.keyCode;9!==t&&27!==t||(this.pickerVisible=!1,e.stopPropagation())},hidePicker:function(){this.picker&&(this.picker.resetView&&this.picker.resetView(),this.pickerVisible=this.picker.visible=!1,this.destroyPopper())},showPicker:function(){var e=this;this.$isServer||(this.picker||this.mountPicker(),this.pickerVisible=this.picker.visible=!0,this.updatePopper(),this.currentValue instanceof Date?this.picker.date=new Date(this.currentValue.getTime()):this.picker.value=this.currentValue,this.picker.resetView&&this.picker.resetView(),this.$nextTick(function(){e.picker.ajustScrollTop&&e.picker.ajustScrollTop()}))},mountPicker:function(){var e=this;this.panel.defaultValue=this.defaultValue||this.currentValue,this.picker=new o.default(this.panel).$mount(),this.picker.popperClass=this.popperClass,this.popperElm=this.picker.$el,this.picker.width=this.reference.getBoundingClientRect().width,this.picker.showTime="datetime"===this.type||"datetimerange"===this.type,this.picker.selectionMode=this.selectionMode,this.format&&(this.picker.format=this.format);var t=function(){var t=e.pickerOptions;t&&t.selectableRange&&!function(){var i=t.selectableRange,n=x.datetimerange.parser,s=v.timerange;i=Array.isArray(i)?i:[i],e.picker.selectableRange=i.map(function(t){return n(t,s,e.rangeSeparator)})}();for(var i in t)t.hasOwnProperty(i)&&"selectableRange"!==i&&(e.picker[i]=t[i])};t(),this.unwatchPickerOptions=this.$watch("pickerOptions",function(){return t()},{deep:!0}),this.$el.appendChild(this.picker.$el),this.picker.resetView&&this.picker.resetView(),this.picker.$on("dodestroy",this.doDestroy),this.picker.$on("pick",function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"",i=arguments.length>1&&void 0!==arguments[1]&&arguments[1];M(e.value,t)||e.$emit("input",t),e.pickerVisible=e.picker.visible=i,e.picker.resetView&&e.picker.resetView()}),this.picker.$on("select-range",function(t,i){e.refInput.setSelectionRange(t,i),e.refInput.focus()})},unmountPicker:function(){this.picker&&(this.picker.$destroy(),this.picker.$off(),"function"==typeof this.unwatchPickerOptions&&this.unwatchPickerOptions(),this.picker.$el.parentNode.removeChild(this.picker.$el))}}}},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0,t.limitRange=t.getRangeHours=t.nextMonth=t.prevMonth=t.getWeekNumber=t.getStartDateOfMonth=t.DAY_DURATION=t.getFirstDayOfMonth=t.getDayCountOfMonth=t.parseDate=t.formatDate=t.isDate=t.toDate=t.equalDate=void 0;var s=i(160),o=n(s),a=i(13),r=["sun","mon","tue","wed","thu","fri","sat"],l=["jan","feb","mar","apr","may","jun","jul","aug","sep","oct","nov","dec"],u=function(){return{dayNamesShort:r.map(function(e){return(0,a.t)("el.datepicker.weeks."+e)}),dayNames:r.map(function(e){return(0,a.t)("el.datepicker.weeks."+e)}),monthNamesShort:l.map(function(e){return(0,a.t)("el.datepicker.months."+e)}),monthNames:l.map(function(e,t){return(0,a.t)("el.datepicker.month"+(t+1))}),amPm:["am","pm"]}},c=function(e,t){for(var i=[],n=e;n<=t;n++)i.push(n);return i},d=(t.equalDate=function(e,t){return e===t||new Date(e).getTime()===new Date(t).getTime()},t.toDate=function(e){return h(e)?new Date(e):null}),h=t.isDate=function(e){return null!==e&&void 0!==e&&!isNaN(new Date(e).getTime())},f=(t.formatDate=function(e,t){return e=d(e),e?o.default.format(e,t||"yyyy-MM-dd",u()):""},t.parseDate=function(e,t){return o.default.parse(e,t||"yyyy-MM-dd",u())},t.getDayCountOfMonth=function(e,t){return 3===t||5===t||8===t||10===t?30:1===t?e%4===0&&e%100!==0||e%400===0?29:28:31}),p=(t.getFirstDayOfMonth=function(e){var t=new Date(e.getTime());return t.setDate(1),t.getDay()},t.DAY_DURATION=864e5);t.getStartDateOfMonth=function(e,t){var i=new Date(e,t,1),n=i.getDay();return 0===n?i.setTime(i.getTime()-7*p):i.setTime(i.getTime()-p*n),i},t.getWeekNumber=function(e){var t=new Date(e.getTime());t.setHours(0,0,0,0),t.setDate(t.getDate()+3-(t.getDay()+6)%7);var i=new Date(t.getFullYear(),0,4);return 1+Math.round(((t.getTime()-i.getTime())/864e5-3+(i.getDay()+6)%7)/7)},t.prevMonth=function(e){var t=e.getFullYear(),i=e.getMonth(),n=e.getDate(),s=0===i?t-1:t,o=0===i?11:i-1,a=f(s,o);return a<n&&e.setDate(a),e.setMonth(o),e.setFullYear(s),new Date(e.getTime())},t.nextMonth=function(e){var t=e.getFullYear(),i=e.getMonth(),n=e.getDate(),s=11===i?t+1:t,o=11===i?0:i+1,a=f(s,o);return a<n&&e.setDate(a),e.setMonth(o),e.setFullYear(s),new Date(e.getTime())},t.getRangeHours=function(e){var t=[],i=[];if((e||[]).forEach(function(e){var t=e.map(function(e){return e.getHours()});i=i.concat(c(t[0],t[1]))}),i.length)for(var n=0;n<24;n++)t[n]=i.indexOf(n)===-1;else for(var s=0;s<24;s++)t[s]=!1;return t},t.limitRange=function(e,t){var i=arguments.length>2&&void 0!==arguments[2]?arguments[2]:"yyyy-MM-dd HH:mm:ss";if(!t||!t.length)return e;var n=t.length;e=o.default.parse(o.default.format(e,i),i);for(var s=0;s<n;s++){var a=t[s];if(e>=a[0]&&e<=a[1])return e}var r=t[0][0],l=t[0][0];return t.forEach(function(e){l=new Date(Math.min(e[0],l)),r=new Date(Math.max(e[1],r))}),e<l?l:r}},function(e,t,i){var n;!function(s){"use strict";function o(e,t){for(var i=[],n=0,s=e.length;n<s;n++)i.push(e[n].substr(0,t));return i}function a(e){return function(t,i,n){var s=n[e].indexOf(i.charAt(0).toUpperCase()+i.substr(1).toLowerCase());~s&&(t.month=s)}}function r(e,t){for(e=String(e),t=t||2;e.length<t;)e="0"+e;return e}var l={},u=/d{1,4}|M{1,4}|yy(?:yy)?|S{1,3}|Do|ZZ|([HhMsDm])\1?|[aA]|"[^"]*"|'[^']*'/g,c=/\d\d?/,d=/\d{3}/,h=/\d{4}/,f=/[0-9]*['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+|[\u0600-\u06FF\/]+(\s*?[\u0600-\u06FF]+){1,2}/i,p=function(){},m=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],v=["January","February","March","April","May","June","July","August","September","October","November","December"],g=o(v,3),y=o(m,3);l.i18n={dayNamesShort:y,dayNames:m,monthNamesShort:g,monthNames:v,amPm:["am","pm"],DoFn:function(e){return e+["th","st","nd","rd"][e%10>3?0:(e-e%10!==10)*e%10]}};var b={D:function(e){return e.getDay()},DD:function(e){return r(e.getDay())},Do:function(e,t){return t.DoFn(e.getDate())},d:function(e){return e.getDate()},dd:function(e){return r(e.getDate())},ddd:function(e,t){return t.dayNamesShort[e.getDay()]},dddd:function(e,t){return t.dayNames[e.getDay()]},M:function(e){return e.getMonth()+1},MM:function(e){return r(e.getMonth()+1)},MMM:function(e,t){return t.monthNamesShort[e.getMonth()]},MMMM:function(e,t){return t.monthNames[e.getMonth()]},yy:function(e){return String(e.getFullYear()).substr(2)},yyyy:function(e){return e.getFullYear()},h:function(e){return e.getHours()%12||12},hh:function(e){return r(e.getHours()%12||12)},H:function(e){return e.getHours()},HH:function(e){return r(e.getHours())},m:function(e){return e.getMinutes()},mm:function(e){return r(e.getMinutes())},s:function(e){return e.getSeconds()},ss:function(e){return r(e.getSeconds())},S:function(e){return Math.round(e.getMilliseconds()/100)},SS:function(e){return r(Math.round(e.getMilliseconds()/10),2)},SSS:function(e){return r(e.getMilliseconds(),3)},a:function(e,t){return e.getHours()<12?t.amPm[0]:t.amPm[1]},A:function(e,t){return e.getHours()<12?t.amPm[0].toUpperCase():t.amPm[1].toUpperCase()},ZZ:function(e){var t=e.getTimezoneOffset();return(t>0?"-":"+")+r(100*Math.floor(Math.abs(t)/60)+Math.abs(t)%60,4)}},_={d:[c,function(e,t){e.day=t}],M:[c,function(e,t){e.month=t-1}],yy:[c,function(e,t){var i=new Date,n=+(""+i.getFullYear()).substr(0,2);e.year=""+(t>68?n-1:n)+t}],h:[c,function(e,t){e.hour=t}],m:[c,function(e,t){e.minute=t}],s:[c,function(e,t){e.second=t}],yyyy:[h,function(e,t){e.year=t}],S:[/\d/,function(e,t){e.millisecond=100*t}],SS:[/\d{2}/,function(e,t){e.millisecond=10*t}],SSS:[d,function(e,t){e.millisecond=t}],D:[c,p],ddd:[f,p],MMM:[f,a("monthNamesShort")],MMMM:[f,a("monthNames")],a:[f,function(e,t,i){var n=t.toLowerCase();n===i.amPm[0]?e.isPm=!1:n===i.amPm[1]&&(e.isPm=!0)}],ZZ:[/[\+\-]\d\d:?\d\d/,function(e,t){var i,n=(t+"").match(/([\+\-]|\d\d)/gi);n&&(i=+(60*n[1])+parseInt(n[2],10),e.timezoneOffset="+"===n[0]?i:-i)}]};_.DD=_.D,_.dddd=_.ddd,_.Do=_.dd=_.d,_.mm=_.m,_.hh=_.H=_.HH=_.h,_.MM=_.M,_.ss=_.s,_.A=_.a,l.masks={default:"ddd MMM dd yyyy HH:mm:ss",shortDate:"M/D/yy",mediumDate:"MMM d, yyyy",longDate:"MMMM d, yyyy",fullDate:"dddd, MMMM d, yyyy",shortTime:"HH:mm",mediumTime:"HH:mm:ss",longTime:"HH:mm:ss.SSS"},l.format=function(e,t,i){var n=i||l.i18n;if("number"==typeof e&&(e=new Date(e)),"[object Date]"!==Object.prototype.toString.call(e)||isNaN(e.getTime()))throw new Error("Invalid Date in fecha.format");return t=l.masks[t]||t||l.masks.default,t.replace(u,function(t){return t in b?b[t](e,n):t.slice(1,t.length-1)})},l.parse=function(e,t,i){var n=i||l.i18n;if("string"!=typeof t)throw new Error("Invalid format in fecha.parse");if(t=l.masks[t]||t,e.length>1e3)return!1;var s=!0,o={};if(t.replace(u,function(t){if(_[t]){var i=_[t],a=e.search(i[0]);~a?e.replace(i[0],function(t){return i[1](o,t,n),e=e.substr(a+t.length),t}):s=!1}return _[t]?"":t.slice(1,t.length-1)}),!s)return!1;var a=new Date;o.isPm===!0&&null!=o.hour&&12!==+o.hour?o.hour=+o.hour+12:o.isPm===!1&&12===+o.hour&&(o.hour=0);var r;return null!=o.timezoneOffset?(o.minute=+(o.minute||0)-+o.timezoneOffset,r=new Date(Date.UTC(o.year||a.getFullYear(),o.month||0,o.day||1,o.hour||0,o.minute||0,o.second||0,o.millisecond||0))):r=new Date(o.year||a.getFullYear(),o.month||0,o.day||1,o.hour||0,o.minute||0,o.second||0,o.millisecond||0),r},"undefined"!=typeof e&&e.exports?e.exports=l:(n=function(){return l}.call(t,i,t,e),!(void 0!==n&&(e.exports=n)))}(this)},function(e,t){e.exports={render:function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("el-input",{directives:[{name:"clickoutside",rawName:"v-clickoutside",value:e.handleClose,expression:"handleClose"}],ref:"reference",staticClass:"el-date-editor",class:"el-date-editor--"+e.type,attrs:{readonly:!e.editable||e.readonly,disabled:e.disabled,size:e.size,placeholder:e.placeholder,value:e.displayValue,validateEvent:!1},on:{focus:e.handleFocus,blur:e.handleBlur},nativeOn:{keydown:function(t){e.handleKeydown(t)},change:function(t){e.displayValue=t.target.value}}},[e.haveTrigger?i("i",{staticClass:"el-input__icon",class:[e.showClose?"el-icon-close":e.triggerClass],
on:{click:e.handleClickIcon,mouseenter:e.handleMouseEnterIcon,mouseleave:function(t){e.showClose=!1}},slot:"icon"}):e._e()])},staticRenderFns:[]}},function(e,t,i){var n=i(5)(i(163),i(179),null,null,null);e.exports=n.exports},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0;var s=i(159),o=i(12),a=n(o),r=i(19),l=n(r),u=i(164),c=n(u),d=i(170),h=n(d),f=i(173),p=n(f),m=i(176),v=n(m);t.default={mixins:[a.default],watch:{showTime:function(e){var t=this;e&&this.$nextTick(function(e){var i=t.$refs.input.$el;i&&(t.pickerWidth=i.getBoundingClientRect().width+10)})},value:function(e){if(e&&(e=new Date(e),!isNaN(e))){if("function"==typeof this.disabledDate&&this.disabledDate(new Date(e)))return;this.date=e,this.year=e.getFullYear(),this.month=e.getMonth(),this.$emit("pick",e,!1)}},timePickerVisible:function(e){var t=this;e&&this.$nextTick(function(){return t.$refs.timepicker.ajustScrollTop()})},selectionMode:function(e){"month"===e?"year"===this.currentView&&"month"===this.currentView||(this.currentView="month"):"week"===e&&(this.week=(0,s.getWeekNumber)(this.date))},date:function(e){this.year=e.getFullYear(),this.month=e.getMonth(),"week"===this.selectionMode&&(this.week=(0,s.getWeekNumber)(e))}},methods:{handleClear:function(){this.date=this.$options.defaultValue?new Date(this.$options.defaultValue):new Date,this.$emit("pick")},resetDate:function(){this.date=new Date(this.date)},showMonthPicker:function(){this.currentView="month"},showYearPicker:function(){this.currentView="year"},prevMonth:function(){this.month--,this.month<0&&(this.month=11,this.year--)},nextMonth:function(){this.month++,this.month>11&&(this.month=0,this.year++)},nextYear:function(){"year"===this.currentView?this.$refs.yearTable.nextTenYear():(this.year++,this.date.setFullYear(this.year),this.resetDate())},prevYear:function(){"year"===this.currentView?this.$refs.yearTable.prevTenYear():(this.year--,this.date.setFullYear(this.year),this.resetDate())},handleShortcutClick:function(e){e.onClick&&e.onClick(this)},handleTimePick:function(e,t,i){if(e){var n=new Date(this.date.getTime()),s=e.getHours(),o=e.getMinutes(),a=e.getSeconds();n.setHours(s),n.setMinutes(o),n.setSeconds(a),this.date=new Date(n.getTime())}i||(this.timePickerVisible=t)},handleMonthPick:function(e){this.month=e;var t=this.selectionMode;if("month"!==t)this.date.setMonth(e),this.currentView="date",this.resetDate();else{this.date.setMonth(e),this.year&&this.date.setFullYear(this.year),this.resetDate();var i=new Date(this.date.getFullYear(),e,1);this.$emit("pick",i)}},handleDatePick:function(e){"day"===this.selectionMode?(this.showTime||this.$emit("pick",new Date(e.getTime())),this.date.setFullYear(e.getFullYear()),this.date.setMonth(e.getMonth(),e.getDate())):"week"===this.selectionMode&&(this.week=e.week,this.$emit("pick",e.date)),this.resetDate()},handleYearPick:function(e){var t=!(arguments.length>1&&void 0!==arguments[1])||arguments[1];this.year=e,t&&(this.date.setFullYear(e),"year"===this.selectionMode?this.$emit("pick",new Date(e,0,1)):this.currentView="month",this.resetDate())},changeToNow:function(){this.date.setTime(+new Date),this.$emit("pick",new Date(this.date.getTime())),this.resetDate()},confirm:function(){this.date.setMilliseconds(0),this.$emit("pick",this.date)},resetView:function(){"month"===this.selectionMode?this.currentView="month":"year"===this.selectionMode?this.currentView="year":this.currentView="date","week"!==this.selectionMode&&(this.year=this.date.getFullYear(),this.month=this.date.getMonth())}},components:{TimePicker:c.default,YearTable:h.default,MonthTable:p.default,DateTable:v.default,ElInput:l.default},mounted:function(){this.date&&!this.year&&(this.year=this.date.getFullYear(),this.month=this.date.getMonth())},data:function(){return{popperClass:"",pickerWidth:0,date:this.$options.defaultValue?new Date(this.$options.defaultValue):new Date,value:"",showTime:!1,selectionMode:"day",shortcuts:"",visible:!1,currentView:"date",disabledDate:"",firstDayOfWeek:7,year:null,month:null,week:null,showWeekNumber:!1,timePickerVisible:!1,width:0,format:""}},computed:{footerVisible:function(){return this.showTime},visibleTime:{get:function(){return(0,s.formatDate)(this.date,this.timeFormat)},set:function(e){if(e){var t=(0,s.parseDate)(e,this.timeFormat);t&&(t.setFullYear(this.date.getFullYear()),t.setMonth(this.date.getMonth()),t.setDate(this.date.getDate()),this.date=t,this.$refs.timepicker.value=t,this.timePickerVisible=!1)}}},visibleDate:{get:function(){return(0,s.formatDate)(this.date,this.dateFormat)},set:function(e){var t=(0,s.parseDate)(e,this.dateFormat);t&&("function"==typeof this.disabledDate&&this.disabledDate(t)||(t.setHours(this.date.getHours()),t.setMinutes(this.date.getMinutes()),t.setSeconds(this.date.getSeconds()),this.date=t,this.resetView()))}},yearLabel:function(){var e=this.year;if(!e)return"";var t=this.t("el.datepicker.year");if("year"===this.currentView){var i=10*Math.floor(e/10);return t?i+" "+t+" - "+(i+9)+" "+t:i+" - "+(i+9)}return this.year+" "+t},timeFormat:function(){return this.format&&this.format.indexOf("ss")===-1?"HH:mm":"HH:mm:ss"},dateFormat:function(){return this.format?this.format.replace("HH:mm","").replace(":ss","").trim():"yyyy-MM-dd"}}}},function(e,t,i){var n=i(5)(i(165),i(169),null,null,null);e.exports=n.exports},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0;var s=i(159),o=i(12),a=n(o);t.default={mixins:[a.default],components:{TimeSpinner:i(166)},props:{pickerWidth:{},date:{default:function(){return new Date}},visible:Boolean},watch:{visible:function(e){this.currentVisible=e},pickerWidth:function(e){this.width=e},value:function(e){var t=this,i=void 0;e instanceof Date?i=(0,s.limitRange)(e,this.selectableRange):e||(i=new Date),this.handleChange({hours:i.getHours(),minutes:i.getMinutes(),seconds:i.getSeconds()}),this.$nextTick(function(e){return t.ajustScrollTop()})},selectableRange:function(e){this.$refs.spinner.selectableRange=e}},data:function(){return{popperClass:"",format:"HH:mm:ss",value:"",hours:0,minutes:0,seconds:0,selectableRange:[],currentDate:this.$options.defaultValue||this.date||new Date,currentVisible:this.visible||!1,width:this.pickerWidth||0}},computed:{showSeconds:function(){return(this.format||"").indexOf("ss")!==-1}},methods:{handleClear:function(){this.$emit("pick")},handleCancel:function(){this.$emit("pick")},handleChange:function(e){void 0!==e.hours&&(this.currentDate.setHours(e.hours),this.hours=this.currentDate.getHours()),void 0!==e.minutes&&(this.currentDate.setMinutes(e.minutes),this.minutes=this.currentDate.getMinutes()),void 0!==e.seconds&&(this.currentDate.setSeconds(e.seconds),this.seconds=this.currentDate.getSeconds()),this.handleConfirm(!0)},setSelectionRange:function(e,t){this.$emit("select-range",e,t)},handleConfirm:function(){var e=arguments.length>0&&void 0!==arguments[0]&&arguments[0],t=arguments[1];if(!t){var i=new Date((0,s.limitRange)(this.currentDate,this.selectableRange,"HH:mm:ss"));this.$emit("pick",i,e,t)}},ajustScrollTop:function(){return this.$refs.spinner.ajustScrollTop()}},created:function(){this.hours=this.currentDate.getHours(),this.minutes=this.currentDate.getMinutes(),this.seconds=this.currentDate.getSeconds()},mounted:function(){var e=this;this.$nextTick(function(){return e.handleConfirm(!0,!0)}),this.$emit("mounted")}}},function(e,t,i){var n=i(5)(i(167),i(168),null,null,null);e.exports=n.exports},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0;var s=i(159),o=i(41),a=n(o),r=i(46),l=n(r);t.default={components:{ElScrollbar:a.default},props:{hours:{type:Number,default:0},minutes:{type:Number,default:0},seconds:{type:Number,default:0},showSeconds:{type:Boolean,default:!0}},watch:{hoursPrivate:function(e,t){e>=0&&e<=23||(this.hoursPrivate=t),this.ajustElTop("hour",e),this.$emit("change",{hours:e})},minutesPrivate:function(e,t){e>=0&&e<=59||(this.minutesPrivate=t),this.ajustElTop("minute",e),this.$emit("change",{minutes:e})},secondsPrivate:function(e,t){e>=0&&e<=59||(this.secondsPrivate=t),this.ajustElTop("second",e),this.$emit("change",{seconds:e})}},computed:{hoursList:function(){return(0,s.getRangeHours)(this.selectableRange)},hourEl:function(){return this.$refs.hour.wrap},minuteEl:function(){return this.$refs.minute.wrap},secondEl:function(){return this.$refs.second.wrap}},data:function(){return{hoursPrivate:0,minutesPrivate:0,secondsPrivate:0,selectableRange:[]}},created:function(){var e=this;this.debounceAjustElTop=(0,l.default)(100,function(t){return e.ajustElTop(t,e[t+"s"])})},mounted:function(){var e=this;this.$nextTick(function(){e.bindScrollEvent()})},methods:{handleClick:function(e,t,i){t.disabled||(this[e+"Private"]=t.value>=0?t.value:t,this.emitSelectRange(e))},emitSelectRange:function(e){"hours"===e?this.$emit("select-range",0,2):"minutes"===e?this.$emit("select-range",3,5):"seconds"===e&&this.$emit("select-range",6,8)},bindScrollEvent:function(){var e=this,t=function(t){e[t+"El"].onscroll=function(i){return e.handleScroll(t,i)}};t("hour"),t("minute"),t("second")},handleScroll:function(e){var t={};t[e+"s"]=Math.min(Math.floor((this[e+"El"].scrollTop-80)/32+3),""+e=="hour"?23:59),this.debounceAjustElTop(e),this.$emit("change",t)},ajustScrollTop:function(){this.ajustElTop("hour",this.hours),this.ajustElTop("minute",this.minutes),this.ajustElTop("second",this.seconds)},ajustElTop:function(e,t){this[e+"El"].scrollTop=Math.max(0,32*(t-2.5)+80)}}}},function(e,t){e.exports={render:function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("div",{staticClass:"el-time-spinner",class:{"has-seconds":e.showSeconds}},[i("el-scrollbar",{ref:"hour",staticClass:"el-time-spinner__wrapper",attrs:{"wrap-style":"max-height: inherit;","view-class":"el-time-spinner__list",noresize:"",tag:"ul"},nativeOn:{mouseenter:function(t){e.emitSelectRange("hours")}}},e._l(e.hoursList,function(t,n){return i("li",{staticClass:"el-time-spinner__item",class:{active:n===e.hours,disabled:t},attrs:{"track-by":"hour"},domProps:{textContent:e._s(n)},on:{click:function(i){e.handleClick("hours",{value:n,disabled:t},!0)}}})})),i("el-scrollbar",{ref:"minute",staticClass:"el-time-spinner__wrapper",attrs:{"wrap-style":"max-height: inherit;","view-class":"el-time-spinner__list",noresize:"",tag:"ul"},nativeOn:{mouseenter:function(t){e.emitSelectRange("minutes")}}},e._l(60,function(t,n){return i("li",{staticClass:"el-time-spinner__item",class:{active:n===e.minutes},domProps:{textContent:e._s(n)},on:{click:function(t){e.handleClick("minutes",n,!0)}}})})),i("el-scrollbar",{directives:[{name:"show",rawName:"v-show",value:e.showSeconds,expression:"showSeconds"}],ref:"second",staticClass:"el-time-spinner__wrapper",attrs:{"wrap-style":"max-height: inherit;","view-class":"el-time-spinner__list",noresize:"",tag:"ul"},nativeOn:{mouseenter:function(t){e.emitSelectRange("seconds")}}},e._l(60,function(t,n){return i("li",{staticClass:"el-time-spinner__item",class:{active:n===e.seconds},domProps:{textContent:e._s(n)},on:{click:function(t){e.handleClick("seconds",n,!0)}}})}))],1)},staticRenderFns:[]}},function(e,t){e.exports={render:function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("transition",{attrs:{name:"el-zoom-in-top"},on:{"after-leave":function(t){e.$emit("dodestroy")}}},[i("div",{directives:[{name:"show",rawName:"v-show",value:e.currentVisible,expression:"currentVisible"}],staticClass:"el-time-panel",class:e.popperClass,style:{width:e.width+"px"}},[i("div",{staticClass:"el-time-panel__content",class:{"has-seconds":e.showSeconds}},[i("time-spinner",{ref:"spinner",attrs:{"show-seconds":e.showSeconds,hours:e.hours,minutes:e.minutes,seconds:e.seconds},on:{change:e.handleChange,"select-range":e.setSelectionRange}})],1),i("div",{staticClass:"el-time-panel__footer"},[i("button",{staticClass:"el-time-panel__btn cancel",attrs:{type:"button"},on:{click:e.handleCancel}},[e._v(e._s(e.t("el.datepicker.cancel")))]),i("button",{staticClass:"el-time-panel__btn confirm",attrs:{type:"button"},on:{click:function(t){e.handleConfirm()}}},[e._v(e._s(e.t("el.datepicker.confirm")))])])])])},staticRenderFns:[]}},function(e,t,i){var n=i(5)(i(171),i(172),null,null,null);e.exports=n.exports},function(e,t,i){"use strict";t.__esModule=!0;var n=i(30);t.default={props:{disabledDate:{},date:{},year:{}},computed:{startYear:function(){return 10*Math.floor(this.year/10)}},methods:{getCellStyle:function(e){var t={},i=new Date(0);i.setFullYear(e),i.setHours(0);var n=new Date(i);n.setFullYear(e+1);var s=!1;if("function"==typeof this.disabledDate){for(;i<n&&this.disabledDate(i);)i=new Date(i.getTime()+864e5);i-n===0&&(s=!0)}return t.disabled=s,t.current=Number(this.year)===e,t},nextTenYear:function(){this.$emit("pick",Number(this.year)+10,!1)},prevTenYear:function(){this.$emit("pick",Number(this.year)-10,!1)},handleYearTableClick:function(e){var t=e.target;if("A"===t.tagName){if((0,n.hasClass)(t.parentNode,"disabled"))return;var i=t.textContent||t.innerText;this.$emit("pick",Number(i))}}}}},function(e,t){e.exports={render:function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("table",{staticClass:"el-year-table",on:{click:e.handleYearTableClick}},[i("tbody",[i("tr",[i("td",{staticClass:"available",class:e.getCellStyle(e.startYear+0)},[i("a",{staticClass:"cell"},[e._v(e._s(e.startYear))])]),i("td",{staticClass:"available",class:e.getCellStyle(e.startYear+1)},[i("a",{staticClass:"cell"},[e._v(e._s(e.startYear+1))])]),i("td",{staticClass:"available",class:e.getCellStyle(e.startYear+2)},[i("a",{staticClass:"cell"},[e._v(e._s(e.startYear+2))])]),i("td",{staticClass:"available",class:e.getCellStyle(e.startYear+3)},[i("a",{staticClass:"cell"},[e._v(e._s(e.startYear+3))])])]),i("tr",[i("td",{staticClass:"available",class:e.getCellStyle(e.startYear+4)},[i("a",{staticClass:"cell"},[e._v(e._s(e.startYear+4))])]),i("td",{staticClass:"available",class:e.getCellStyle(e.startYear+5)},[i("a",{staticClass:"cell"},[e._v(e._s(e.startYear+5))])]),i("td",{staticClass:"available",class:e.getCellStyle(e.startYear+6)},[i("a",{staticClass:"cell"},[e._v(e._s(e.startYear+6))])]),i("td",{staticClass:"available",class:e.getCellStyle(e.startYear+7)},[i("a",{staticClass:"cell"},[e._v(e._s(e.startYear+7))])])]),i("tr",[i("td",{staticClass:"available",class:e.getCellStyle(e.startYear+8)},[i("a",{staticClass:"cell"},[e._v(e._s(e.startYear+8))])]),i("td",{staticClass:"available",class:e.getCellStyle(e.startYear+9)},[i("a",{staticClass:"cell"},[e._v(e._s(e.startYear+9))])]),i("td"),i("td")])])])},staticRenderFns:[]}},function(e,t,i){var n=i(5)(i(174),i(175),null,null,null);e.exports=n.exports},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0;var s=i(12),o=n(s),a=i(30);t.default={props:{disabledDate:{},date:{},month:{type:Number}},mixins:[o.default],methods:{getCellStyle:function(e){var t={},i=this.date.getFullYear(),n=new Date(0);n.setFullYear(i),n.setMonth(e),n.setHours(0);var s=new Date(n);s.setMonth(e+1);var o=!1;if("function"==typeof this.disabledDate)for(;n<s;){if(!this.disabledDate(n)){o=!1;break}n=new Date(n.getTime()+864e5),o=!0}return t.disabled=o,t.current=this.month===e,t},handleMonthTableClick:function(e){var t=e.target;if("A"===t.tagName&&!(0,a.hasClass)(t.parentNode,"disabled")){var i=t.parentNode.cellIndex,n=t.parentNode.parentNode.rowIndex,s=4*n+i;this.$emit("pick",s)}}}}},function(e,t){e.exports={render:function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("table",{staticClass:"el-month-table",on:{click:e.handleMonthTableClick}},[i("tbody",[i("tr",[i("td",{class:e.getCellStyle(0)},[i("a",{staticClass:"cell"},[e._v(e._s(e.t("el.datepicker.months.jan")))])]),i("td",{class:e.getCellStyle(1)},[i("a",{staticClass:"cell"},[e._v(e._s(e.t("el.datepicker.months.feb")))])]),i("td",{class:e.getCellStyle(2)},[i("a",{staticClass:"cell"},[e._v(e._s(e.t("el.datepicker.months.mar")))])]),i("td",{class:e.getCellStyle(3)},[i("a",{staticClass:"cell"},[e._v(e._s(e.t("el.datepicker.months.apr")))])])]),i("tr",[i("td",{class:e.getCellStyle(4)},[i("a",{staticClass:"cell"},[e._v(e._s(e.t("el.datepicker.months.may")))])]),i("td",{class:e.getCellStyle(5)},[i("a",{staticClass:"cell"},[e._v(e._s(e.t("el.datepicker.months.jun")))])]),i("td",{class:e.getCellStyle(6)},[i("a",{staticClass:"cell"},[e._v(e._s(e.t("el.datepicker.months.jul")))])]),i("td",{class:e.getCellStyle(7)},[i("a",{staticClass:"cell"},[e._v(e._s(e.t("el.datepicker.months.aug")))])])]),i("tr",[i("td",{class:e.getCellStyle(8)},[i("a",{staticClass:"cell"},[e._v(e._s(e.t("el.datepicker.months.sep")))])]),i("td",{class:e.getCellStyle(9)},[i("a",{staticClass:"cell"},[e._v(e._s(e.t("el.datepicker.months.oct")))])]),i("td",{class:e.getCellStyle(10)},[i("a",{staticClass:"cell"},[e._v(e._s(e.t("el.datepicker.months.nov")))])]),i("td",{class:e.getCellStyle(11)},[i("a",{staticClass:"cell"},[e._v(e._s(e.t("el.datepicker.months.dec")))])])])])])},staticRenderFns:[]}},function(e,t,i){var n=i(5)(i(177),i(178),null,null,null);e.exports=n.exports},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0;var s=i(159),o=i(30),a=i(12),r=n(a),l=["sun","mon","tue","wed","thu","fri","sat"],u=function(e){var t=new Date(e);return t.setHours(0,0,0,0),t.getTime()};t.default={mixins:[r.default],props:{firstDayOfWeek:{default:7,type:Number,validator:function(e){return e>=1&&e<=7}},date:{},year:{},month:{},week:{},selectionMode:{default:"day"},showWeekNumber:{type:Boolean,default:!1},disabledDate:{},minDate:{},maxDate:{},rangeState:{default:function(){return{endDate:null,selecting:!1,row:null,column:null}}}},computed:{offsetDay:function(){var e=this.firstDayOfWeek;return e>3?7-e:-e},WEEKS:function(){var e=this.firstDayOfWeek;return l.concat(l).slice(e,e+7)},monthDate:function(){return this.date.getDate()},startDate:function(){return(0,s.getStartDateOfMonth)(this.year,this.month)},rows:function e(){var t=new Date(this.year,this.month,1),i=(0,s.getFirstDayOfMonth)(t),n=(0,s.getDayCountOfMonth)(t.getFullYear(),t.getMonth()),o=(0,s.getDayCountOfMonth)(t.getFullYear(),0===t.getMonth()?11:t.getMonth()-1);i=0===i?7:i;for(var a=this.offsetDay,e=this.tableRows,r=1,l=void 0,c=this.startDate,d=this.disabledDate,h=u(new Date),f=0;f<6;f++){var p=e[f];this.showWeekNumber&&(p[0]||(p[0]={type:"week",text:(0,s.getWeekNumber)(new Date(c.getTime()+s.DAY_DURATION*(7*f+1)))}));for(var m=0;m<7;m++){var v=p[this.showWeekNumber?m+1:m];v||(v={row:f,column:m,type:"normal",inRange:!1,start:!1,end:!1}),v.type="normal";var g=7*f+m,y=c.getTime()+s.DAY_DURATION*(g-a);v.inRange=y>=u(this.minDate)&&y<=u(this.maxDate),v.start=this.minDate&&y===u(this.minDate),v.end=this.maxDate&&y===u(this.maxDate);var b=y===h;b&&(v.type="today"),f>=0&&f<=1?m+7*f>=i+a?(v.text=r++,2===r&&(l=7*f+m)):(v.text=o-(i+a-m%7)+1+7*f,v.type="prev-month"):r<=n?(v.text=r++,2===r&&(l=7*f+m)):(v.text=r++-n,v.type="next-month"),v.disabled="function"==typeof d&&d(new Date(y)),this.$set(p,this.showWeekNumber?m+1:m,v)}if("week"===this.selectionMode){var _=this.showWeekNumber?1:0,C=this.showWeekNumber?7:6,x=this.isWeekActive(p[_+1]);p[_].inRange=x,p[_].start=x,p[C].inRange=x,p[C].end=x}}return e.firstDayPosition=l,e}},watch:{"rangeState.endDate":function(e){this.markRange(e)},minDate:function(e,t){e&&!t?(this.rangeState.selecting=!0,this.markRange(e)):e?this.markRange():(this.rangeState.selecting=!1,this.markRange(e))},maxDate:function(e,t){e&&!t&&(this.rangeState.selecting=!1,this.markRange(e),this.$emit("pick",{minDate:this.minDate,maxDate:this.maxDate}))}},data:function(){return{tableRows:[[],[],[],[],[],[]]}},methods:{getCellClasses:function(e){var t=this.selectionMode,i=this.monthDate,n=[];return"normal"!==e.type&&"today"!==e.type||e.disabled?n.push(e.type):(n.push("available"),"today"===e.type&&n.push("today")),"day"!==t||"normal"!==e.type&&"today"!==e.type||Number(this.year)!==this.date.getFullYear()||this.month!==this.date.getMonth()||i!==Number(e.text)||n.push("current"),!e.inRange||"normal"!==e.type&&"today"!==e.type&&"week"!==this.selectionMode||(n.push("in-range"),e.start&&n.push("start-date"),e.end&&n.push("end-date")),e.disabled&&n.push("disabled"),n.join(" ")},getDateOfCell:function(e,t){var i=this.startDate;return new Date(i.getTime()+(7*e+(t-(this.showWeekNumber?1:0))-this.offsetDay)*s.DAY_DURATION)},getCellByDate:function(e){var t=this.startDate,i=this.rows,n=(e-t)/s.DAY_DURATION,o=i[Math.floor(n/7)];return this.showWeekNumber?o[n%7+1]:o[n%7]},isWeekActive:function(e){if("week"!==this.selectionMode)return!1;var t=new Date(this.year,this.month,1),i=t.getFullYear(),n=t.getMonth();return"prev-month"===e.type&&(t.setMonth(0===n?11:n-1),t.setFullYear(0===n?i-1:i)),"next-month"===e.type&&(t.setMonth(11===n?0:n+1),t.setFullYear(11===n?i+1:i)),t.setDate(parseInt(e.text,10)),(0,s.getWeekNumber)(t)===this.week},markRange:function(e){var t=this.startDate;e||(e=this.maxDate);for(var i=this.rows,n=this.minDate,o=0,a=i.length;o<a;o++)for(var r=i[o],l=0,c=r.length;l<c;l++)if(!this.showWeekNumber||0!==l){var d=r[l],h=7*o+l+(this.showWeekNumber?-1:0),f=t.getTime()+s.DAY_DURATION*(h-this.offsetDay);d.inRange=n&&f>=u(n)&&f<=u(e),d.start=n&&f===u(n.getTime()),d.end=e&&f===u(e.getTime())}},handleMouseMove:function(e){if(this.rangeState.selecting){this.$emit("changerange",{minDate:this.minDate,maxDate:this.maxDate,rangeState:this.rangeState});var t=e.target;if("TD"===t.tagName){var i=t.cellIndex,n=t.parentNode.rowIndex-1,s=this.rangeState,o=s.row,a=s.column;o===n&&a===i||(this.rangeState.row=n,this.rangeState.column=i,this.rangeState.endDate=this.getDateOfCell(n,i))}}},handleClick:function(e){var t=e.target;if("TD"===t.tagName&&!(0,o.hasClass)(t,"disabled")&&!(0,o.hasClass)(t,"week")){var i=this.selectionMode;"week"===i&&(t=t.parentNode.cells[1]);var n=Number(this.year),a=Number(this.month),r=t.cellIndex,l=t.parentNode.rowIndex,u=this.rows[l-1][r],c=u.text,d=t.className,h=new Date(n,a,1);if(d.indexOf("prev")!==-1?(0===a?(n-=1,a=11):a-=1,h.setFullYear(n),h.setMonth(a)):d.indexOf("next")!==-1&&(11===a?(n+=1,a=0):a+=1,h.setFullYear(n),h.setMonth(a)),h.setDate(parseInt(c,10)),"range"===this.selectionMode){if(this.minDate&&this.maxDate){var f=new Date(h.getTime()),p=null;this.$emit("pick",{minDate:f,maxDate:p},!1),this.rangeState.selecting=!0,this.markRange(this.minDate)}else if(this.minDate&&!this.maxDate)if(h>=this.minDate){var m=new Date(h.getTime());this.rangeState.selecting=!1,this.$emit("pick",{minDate:this.minDate,maxDate:m})}else{var v=new Date(h.getTime());this.$emit("pick",{minDate:v,maxDate:this.maxDate},!1)}else if(!this.minDate){var g=new Date(h.getTime());this.$emit("pick",{minDate:g,maxDate:this.maxDate},!1),this.rangeState.selecting=!0,this.markRange(this.minDate)}}else if("day"===i)this.$emit("pick",h);else if("week"===i){var y=(0,s.getWeekNumber)(h),b=h.getFullYear()+"w"+y;this.$emit("pick",{year:h.getFullYear(),week:y,value:b,date:h})}}}}}},function(e,t){e.exports={render:function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("table",{staticClass:"el-date-table",class:{"is-week-mode":"week"===e.selectionMode},attrs:{cellspacing:"0",cellpadding:"0"},on:{click:e.handleClick,mousemove:e.handleMouseMove}},[i("tbody",[i("tr",[e.showWeekNumber?i("th",[e._v(e._s(e.t("el.datepicker.week")))]):e._e(),e._l(e.WEEKS,function(t){return i("th",[e._v(e._s(e.t("el.datepicker.weeks."+t)))])})],2),e._l(e.rows,function(t){return i("tr",{staticClass:"el-date-table__row",class:{current:e.isWeekActive(t[1])}},e._l(t,function(t){return i("td",{class:e.getCellClasses(t),domProps:{textContent:e._s("today"===t.type?e.t("el.datepicker.today"):t.text)}})}))})],2)])},staticRenderFns:[]}},function(e,t){e.exports={render:function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("transition",{attrs:{name:"el-zoom-in-top"},on:{"after-leave":function(t){e.$emit("dodestroy")}}},[i("div",{directives:[{name:"show",rawName:"v-show",value:e.visible,expression:"visible"}],staticClass:"el-picker-panel el-date-picker",class:[{"has-sidebar":e.$slots.sidebar||e.shortcuts,"has-time":e.showTime},e.popperClass],style:{width:e.width+"px"}},[i("div",{staticClass:"el-picker-panel__body-wrapper"},[e._t("sidebar"),e.shortcuts?i("div",{staticClass:"el-picker-panel__sidebar"},e._l(e.shortcuts,function(t){return i("button",{staticClass:"el-picker-panel__shortcut",attrs:{type:"button"},on:{click:function(i){e.handleShortcutClick(t)}}},[e._v(e._s(t.text))])})):e._e(),i("div",{staticClass:"el-picker-panel__body"},[e.showTime?i("div",{staticClass:"el-date-picker__time-header"},[i("span",{staticClass:"el-date-picker__editor-wrap"},[i("el-input",{attrs:{placeholder:e.t("el.datepicker.selectDate"),value:e.visibleDate,size:"small"},nativeOn:{change:function(t){e.visibleDate=t.target.value}}})],1),i("span",{staticClass:"el-date-picker__editor-wrap"},[i("el-input",{ref:"input",attrs:{placeholder:e.t("el.datepicker.selectTime"),value:e.visibleTime,size:"small"},on:{focus:function(t){e.timePickerVisible=!e.timePickerVisible}},nativeOn:{change:function(t){e.visibleTime=t.target.value}}}),i("time-picker",{ref:"timepicker",attrs:{date:e.date,"picker-width":e.pickerWidth,visible:e.timePickerVisible},on:{pick:e.handleTimePick,mounted:function(t){e.$refs.timepicker.format=e.timeFormat}}})],1)]):e._e(),i("div",{directives:[{name:"show",rawName:"v-show",value:"time"!==e.currentView,expression:"currentView !== 'time'"}],staticClass:"el-date-picker__header"},[i("button",{staticClass:"el-picker-panel__icon-btn el-date-picker__prev-btn el-icon-d-arrow-left",attrs:{type:"button"},on:{click:e.prevYear}}),i("button",{directives:[{name:"show",rawName:"v-show",value:"date"===e.currentView,expression:"currentView === 'date'"}],staticClass:"el-picker-panel__icon-btn el-date-picker__prev-btn el-icon-arrow-left",attrs:{type:"button"},on:{click:e.prevMonth}}),i("span",{staticClass:"el-date-picker__header-label",on:{click:e.showYearPicker}},[e._v(e._s(e.yearLabel))]),i("span",{directives:[{name:"show",rawName:"v-show",value:"date"===e.currentView,expression:"currentView === 'date'"}],staticClass:"el-date-picker__header-label",class:{active:"month"===e.currentView},on:{click:e.showMonthPicker}},[e._v(e._s(e.t("el.datepicker.month"+(e.month+1))))]),i("button",{staticClass:"el-picker-panel__icon-btn el-date-picker__next-btn el-icon-d-arrow-right",attrs:{type:"button"},on:{click:e.nextYear}}),i("button",{directives:[{name:"show",rawName:"v-show",value:"date"===e.currentView,expression:"currentView === 'date'"}],staticClass:"el-picker-panel__icon-btn el-date-picker__next-btn el-icon-arrow-right",attrs:{type:"button"},on:{click:e.nextMonth}})]),i("div",{staticClass:"el-picker-panel__content"},[i("date-table",{directives:[{name:"show",rawName:"v-show",value:"date"===e.currentView,expression:"currentView === 'date'"}],attrs:{year:e.year,month:e.month,date:e.date,week:e.week,"selection-mode":e.selectionMode,"first-day-of-week":e.firstDayOfWeek,"disabled-date":e.disabledDate},on:{pick:e.handleDatePick}}),i("year-table",{directives:[{name:"show",rawName:"v-show",value:"year"===e.currentView,expression:"currentView === 'year'"}],ref:"yearTable",attrs:{year:e.year,date:e.date,"disabled-date":e.disabledDate},on:{pick:e.handleYearPick}}),i("month-table",{directives:[{name:"show",rawName:"v-show",value:"month"===e.currentView,expression:"currentView === 'month'"}],attrs:{month:e.month,date:e.date,"disabled-date":e.disabledDate},on:{pick:e.handleMonthPick}})],1)])],2),i("div",{directives:[{name:"show",rawName:"v-show",value:e.footerVisible&&"date"===e.currentView,expression:"footerVisible && currentView === 'date'"}],staticClass:"el-picker-panel__footer"},[i("a",{staticClass:"el-picker-panel__link-btn",attrs:{href:"JavaScript:"},on:{click:e.changeToNow}},[e._v(e._s(e.t("el.datepicker.now")))]),i("button",{staticClass:"el-picker-panel__btn",attrs:{type:"button"},on:{click:e.confirm}},[e._v(e._s(e.t("el.datepicker.confirm")))])])])])},staticRenderFns:[]}},function(e,t,i){var n=i(5)(i(181),i(182),null,null,null);e.exports=n.exports},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0;var s=i(159),o=i(12),a=n(o),r=i(164),l=n(r),u=i(176),c=n(u),d=i(19),h=n(d);t.default={mixins:[a.default],computed:{btnDisabled:function(){return!(this.minDate&&this.maxDate&&!this.selecting)},leftLabel:function(){return this.date.getFullYear()+" "+this.t("el.datepicker.year")+" "+this.t("el.datepicker.month"+(this.date.getMonth()+1))},rightLabel:function(){return this.rightDate.getFullYear()+" "+this.t("el.datepicker.year")+" "+this.t("el.datepicker.month"+(this.rightDate.getMonth()+1))},leftYear:function(){return this.date.getFullYear()},leftMonth:function(){return this.date.getMonth()},rightYear:function(){return this.rightDate.getFullYear()},rightMonth:function(){return this.rightDate.getMonth()},minVisibleDate:function(){return this.minDate?(0,s.formatDate)(this.minDate):""},maxVisibleDate:function(){return this.maxDate||this.minDate?(0,s.formatDate)(this.maxDate||this.minDate):""},minVisibleTime:function(){return this.minDate?(0,s.formatDate)(this.minDate,"HH:mm:ss"):""},maxVisibleTime:function(){return this.maxDate||this.minDate?(0,s.formatDate)(this.maxDate||this.minDate,"HH:mm:ss"):""},rightDate:function(){var e=new Date(this.date),t=e.getMonth();return e.setDate(1),11===t?(e.setFullYear(e.getFullYear()+1),e.setMonth(0)):e.setMonth(t+1),e}},data:function(){return{popperClass:"",minPickerWidth:0,maxPickerWidth:0,date:new Date,minDate:"",maxDate:"",rangeState:{endDate:null,selecting:!1,row:null,column:null},showTime:!1,shortcuts:"",value:"",visible:"",disabledDate:"",firstDayOfWeek:7,minTimePickerVisible:!1,maxTimePickerVisible:!1,width:0}},watch:{showTime:function(e){var t=this;e&&this.$nextTick(function(e){var i=t.$refs.minInput.$el,n=t.$refs.maxInput.$el;i&&(t.minPickerWidth=i.getBoundingClientRect().width+10),n&&(t.maxPickerWidth=n.getBoundingClientRect().width+10)})},minDate:function(){var e=this;this.$nextTick(function(){if(e.maxDate&&e.maxDate<e.minDate){var t="HH:mm:ss";e.$refs.maxTimePicker.selectableRange=[[(0,s.parseDate)((0,s.formatDate)(e.minDate,t),t),(0,s.parseDate)("23:59:59",t)]]}})},minTimePickerVisible:function(e){var t=this;e&&this.$nextTick(function(){return t.$refs.minTimePicker.ajustScrollTop()})},maxTimePickerVisible:function(e){var t=this;e&&this.$nextTick(function(){return t.$refs.maxTimePicker.ajustScrollTop()})},value:function(e){e?Array.isArray(e)&&(this.minDate=e[0]?(0,s.toDate)(e[0]):null,this.maxDate=e[1]?(0,s.toDate)(e[1]):null,this.minDate&&(this.date=new Date(this.minDate)),this.handleConfirm(!0)):(this.minDate=null,this.maxDate=null)}},methods:{handleClear:function(){this.minDate=null,this.maxDate=null,this.handleConfirm(!1)},handleDateInput:function(e,t){var i=e.target.value,n=(0,s.parseDate)(i,"yyyy-MM-dd");if(n){if("function"==typeof this.disabledDate&&this.disabledDate(new Date(n)))return;var o=new Date("min"===t?this.minDate:this.maxDate);o&&(o.setFullYear(n.getFullYear()),o.setMonth(n.getMonth(),n.getDate()))}},handleChangeRange:function(e){this.minDate=e.minDate,this.maxDate=e.maxDate,this.rangeState=e.rangeState},handleDateChange:function(e,t){var i=e.target.value,n=(0,s.parseDate)(i,"yyyy-MM-dd");if(n){var o=new Date("min"===t?this.minDate:this.maxDate);o&&(o.setFullYear(n.getFullYear()),o.setMonth(n.getMonth(),n.getDate())),"min"===t?o<this.maxDate&&(this.minDate=new Date(o.getTime())):o>this.minDate&&(this.maxDate=new Date(o.getTime()),this.minDate&&this.minDate>this.maxDate&&(this.minDate=null))}},handleTimeChange:function(e,t){var i=e.target.value,n=(0,s.parseDate)(i,"HH:mm:ss");if(n){var o=new Date("min"===t?this.minDate:this.maxDate);o&&(o.setHours(n.getHours()),o.setMinutes(n.getMinutes()),o.setSeconds(n.getSeconds())),"min"===t?o<this.maxDate&&(this.minDate=new Date(o.getTime())):o>this.minDate&&(this.maxDate=new Date(o.getTime())),this.$refs[t+"TimePicker"].value=o,this[t+"TimePickerVisible"]=!1}},handleRangePick:function(e){var t=!(arguments.length>1&&void 0!==arguments[1])||arguments[1];
this.maxDate===e.maxDate&&this.minDate===e.minDate||(this.onPick&&this.onPick(e),this.maxDate=e.maxDate,this.minDate=e.minDate,t&&!this.showTime&&this.handleConfirm())},changeToToday:function(){this.date=new Date},handleShortcutClick:function(e){e.onClick&&e.onClick(this)},resetView:function(){this.minTimePickerVisible=!1,this.maxTimePickerVisible=!1},setTime:function(e,t){var i=new Date(e.getTime()),n=t.getHours(),s=t.getMinutes(),o=t.getSeconds();return i.setHours(n),i.setMinutes(s),i.setSeconds(o),new Date(i.getTime())},handleMinTimePick:function(e,t,i){this.minDate=this.minDate||new Date,e&&(this.minDate=this.setTime(this.minDate,e)),i||(this.minTimePickerVisible=t)},handleMaxTimePick:function(e,t,i){if(!this.maxDate){var n=new Date;n>=this.minDate&&(this.maxDate=new Date)}this.maxDate&&e&&(this.maxDate=this.setTime(this.maxDate,e)),i||(this.maxTimePickerVisible=t)},prevMonth:function(){this.date=(0,s.prevMonth)(this.date)},nextMonth:function(){this.date=(0,s.nextMonth)(this.date)},nextYear:function(){var e=this.date;e.setFullYear(e.getFullYear()+1),this.resetDate()},prevYear:function(){var e=this.date;e.setFullYear(e.getFullYear()-1),this.resetDate()},handleConfirm:function(){var e=arguments.length>0&&void 0!==arguments[0]&&arguments[0];this.$emit("pick",[this.minDate,this.maxDate],e)},resetDate:function(){this.date=new Date(this.date)}},components:{TimePicker:l.default,DateTable:c.default,ElInput:h.default}}},function(e,t){e.exports={render:function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("transition",{attrs:{name:"el-zoom-in-top"},on:{"after-leave":function(t){e.$emit("dodestroy")}}},[i("div",{directives:[{name:"show",rawName:"v-show",value:e.visible,expression:"visible"}],staticClass:"el-picker-panel el-date-range-picker",class:[{"has-sidebar":e.$slots.sidebar||e.shortcuts,"has-time":e.showTime},e.popperClass],style:{width:e.width+"px"}},[i("div",{staticClass:"el-picker-panel__body-wrapper"},[e._t("sidebar"),e.shortcuts?i("div",{staticClass:"el-picker-panel__sidebar"},e._l(e.shortcuts,function(t){return i("button",{staticClass:"el-picker-panel__shortcut",attrs:{type:"button"},on:{click:function(i){e.handleShortcutClick(t)}}},[e._v(e._s(t.text))])})):e._e(),i("div",{staticClass:"el-picker-panel__body"},[e.showTime?i("div",{staticClass:"el-date-range-picker__time-header"},[i("span",{staticClass:"el-date-range-picker__editors-wrap"},[i("span",{staticClass:"el-date-range-picker__time-picker-wrap"},[i("el-input",{ref:"minInput",staticClass:"el-date-range-picker__editor",attrs:{size:"small",placeholder:e.t("el.datepicker.startDate"),value:e.minVisibleDate},nativeOn:{input:function(t){e.handleDateInput(t,"min")},change:function(t){e.handleDateChange(t,"min")}}})],1),i("span",{staticClass:"el-date-range-picker__time-picker-wrap"},[i("el-input",{staticClass:"el-date-range-picker__editor",attrs:{size:"small",placeholder:e.t("el.datepicker.startTime"),value:e.minVisibleTime},on:{focus:function(t){e.minTimePickerVisible=!e.minTimePickerVisible}},nativeOn:{change:function(t){e.handleTimeChange(t,"min")}}}),i("time-picker",{ref:"minTimePicker",attrs:{"picker-width":e.minPickerWidth,date:e.minDate,visible:e.minTimePickerVisible},on:{pick:e.handleMinTimePick}})],1)]),i("span",{staticClass:"el-icon-arrow-right"}),i("span",{staticClass:"el-date-range-picker__editors-wrap is-right"},[i("span",{staticClass:"el-date-range-picker__time-picker-wrap"},[i("el-input",{staticClass:"el-date-range-picker__editor",attrs:{size:"small",placeholder:e.t("el.datepicker.endDate"),value:e.maxVisibleDate,readonly:!e.minDate},nativeOn:{input:function(t){e.handleDateInput(t,"max")},change:function(t){e.handleDateChange(t,"max")}}})],1),i("span",{staticClass:"el-date-range-picker__time-picker-wrap"},[i("el-input",{ref:"maxInput",staticClass:"el-date-range-picker__editor",attrs:{size:"small",placeholder:e.t("el.datepicker.endTime"),value:e.maxVisibleTime,readonly:!e.minDate},on:{focus:function(t){e.minDate&&(e.maxTimePickerVisible=!e.maxTimePickerVisible)}},nativeOn:{change:function(t){e.handleTimeChange(t,"max")}}}),i("time-picker",{ref:"maxTimePicker",attrs:{"picker-width":e.maxPickerWidth,date:e.maxDate,visible:e.maxTimePickerVisible},on:{pick:e.handleMaxTimePick}})],1)])]):e._e(),i("div",{staticClass:"el-picker-panel__content el-date-range-picker__content is-left"},[i("div",{staticClass:"el-date-range-picker__header"},[i("button",{staticClass:"el-picker-panel__icon-btn el-icon-d-arrow-left",attrs:{type:"button"},on:{click:e.prevYear}}),i("button",{staticClass:"el-picker-panel__icon-btn el-icon-arrow-left",attrs:{type:"button"},on:{click:e.prevMonth}}),i("div",[e._v(e._s(e.leftLabel))])]),i("date-table",{attrs:{"selection-mode":"range",date:e.date,year:e.leftYear,month:e.leftMonth,"min-date":e.minDate,"max-date":e.maxDate,"range-state":e.rangeState,"disabled-date":e.disabledDate,"first-day-of-week":e.firstDayOfWeek},on:{changerange:e.handleChangeRange,pick:e.handleRangePick}})],1),i("div",{staticClass:"el-picker-panel__content el-date-range-picker__content is-right"},[i("div",{staticClass:"el-date-range-picker__header"},[i("button",{staticClass:"el-picker-panel__icon-btn el-icon-d-arrow-right",attrs:{type:"button"},on:{click:e.nextYear}}),i("button",{staticClass:"el-picker-panel__icon-btn el-icon-arrow-right",attrs:{type:"button"},on:{click:e.nextMonth}}),i("div",[e._v(e._s(e.rightLabel))])]),i("date-table",{attrs:{"selection-mode":"range",date:e.rightDate,year:e.rightYear,month:e.rightMonth,"min-date":e.minDate,"max-date":e.maxDate,"range-state":e.rangeState,"disabled-date":e.disabledDate,"first-day-of-week":e.firstDayOfWeek},on:{changerange:e.handleChangeRange,pick:e.handleRangePick}})],1)])],2),e.showTime?i("div",{staticClass:"el-picker-panel__footer"},[i("a",{staticClass:"el-picker-panel__link-btn",on:{click:e.handleClear}},[e._v(e._s(e.t("el.datepicker.clear")))]),i("button",{staticClass:"el-picker-panel__btn",attrs:{type:"button",disabled:e.btnDisabled},on:{click:function(t){e.handleConfirm()}}},[e._v(e._s(e.t("el.datepicker.confirm")))])]):e._e()])])},staticRenderFns:[]}},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0;var s=i(184),o=n(s);o.default.install=function(e){e.component(o.default.name,o.default)},t.default=o.default},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0;var s=i(157),o=n(s),a=i(185),r=n(a);t.default={mixins:[o.default],name:"ElTimeSelect",beforeCreate:function(){this.type="time-select",this.panel=r.default}}},function(e,t,i){var n=i(5)(i(186),i(187),null,null,null);e.exports=n.exports},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0;var s=i(41),o=n(s),a=i(49),r=n(a),l=function(e){var t=(e||"").split(":");if(t.length>=2){var i=parseInt(t[0],10),n=parseInt(t[1],10);return{hours:i,minutes:n}}return null},u=function(e,t){var i=l(e),n=l(t),s=i.minutes+60*i.hours,o=n.minutes+60*n.hours;return s===o?0:s>o?1:-1},c=function(e){return(e.hours<10?"0"+e.hours:e.hours)+":"+(e.minutes<10?"0"+e.minutes:e.minutes)},d=function(e,t){var i=l(e),n=l(t),s={hours:i.hours,minutes:i.minutes};return s.minutes+=n.minutes,s.hours+=n.hours,s.hours+=Math.floor(s.minutes/60),s.minutes=s.minutes%60,c(s)};t.default={components:{ElScrollbar:o.default},watch:{value:function(e){var t=this;e&&(this.minTime&&u(e,this.minTime)<0?this.$emit("pick"):this.maxTime&&u(e,this.maxTime)>0&&this.$emit("pick"),this.$nextTick(function(){return t.scrollToOption()}))}},methods:{handleClick:function(e){e.disabled||this.$emit("pick",e.value)},handleClear:function(){this.$emit("pick")},scrollToOption:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"selected",t=this.$refs.popper.querySelector(".el-picker-panel__content");(0,r.default)(t,t.getElementsByClassName(e)[0])},handleMenuEnter:function(){var e=this;this.$nextTick(function(){return e.scrollToOption()})}},data:function(){return{popperClass:"",start:"09:00",end:"18:00",step:"00:30",value:"",visible:!1,minTime:"",maxTime:"",width:0}},computed:{items:function(){var e=this.start,t=this.end,i=this.step,n=[];if(e&&t&&i)for(var s=e;u(s,t)<=0;)n.push({value:s,disabled:u(s,this.minTime||"-1:-1")<=0||u(s,this.maxTime||"100:100")>=0}),s=d(s,i);return n}}}},function(e,t){e.exports={render:function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("transition",{attrs:{name:"el-zoom-in-top"},on:{"before-enter":e.handleMenuEnter,"after-leave":function(t){e.$emit("dodestroy")}}},[i("div",{directives:[{name:"show",rawName:"v-show",value:e.visible,expression:"visible"}],ref:"popper",staticClass:"el-picker-panel time-select",class:e.popperClass,style:{width:e.width+"px"}},[i("el-scrollbar",{attrs:{noresize:"","wrap-class":"el-picker-panel__content"}},e._l(e.items,function(t){return i("div",{staticClass:"time-select-item",class:{selected:e.value===t.value,disabled:t.disabled},attrs:{disabled:t.disabled},on:{click:function(i){e.handleClick(t)}}},[e._v(e._s(t.value))])}))],1)])},staticRenderFns:[]}},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0;var s=i(189),o=n(s);o.default.install=function(e){e.component(o.default.name,o.default)},t.default=o.default},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0;var s=i(157),o=n(s),a=i(164),r=n(a),l=i(190),u=n(l);t.default={mixins:[o.default],name:"ElTimePicker",props:{isRange:Boolean},data:function(){return{type:""}},watch:{isRange:function(e){this.picker?(this.unmountPicker(),this.type=e?"timerange":"time",this.panel=e?u.default:r.default,this.mountPicker()):(this.type=e?"timerange":"time",this.panel=e?u.default:r.default)}},created:function(){this.type=this.isRange?"timerange":"time",this.panel=this.isRange?u.default:r.default}}},function(e,t,i){var n=i(5)(i(191),i(192),null,null,null);e.exports=n.exports},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0;var s=i(159),o=i(12),a=n(o),r=i(166),l=n(r),u=(0,s.parseDate)("00:00:00","HH:mm:ss"),c=(0,s.parseDate)("23:59:59","HH:mm:ss"),d=function(e,t){var i=3600*e.getHours()+60*e.getMinutes()+e.getSeconds(),n=3600*t.getHours()+60*t.getMinutes()+t.getSeconds();return i>n},h=function e(t){t=Array.isArray(t)?t:[t];var i=t[0]||new Date,n=new Date;n.setHours(n.getHours()+1);var s=t[1]||n;return i>s?e():{minTime:i,maxTime:s}};t.default={mixins:[a.default],components:{TimeSpinner:l.default},computed:{showSeconds:function(){return(this.format||"").indexOf("ss")!==-1}},props:["value"],data:function(){var e=h(this.$options.defaultValue);return{popperClass:"",minTime:e.minTime,maxTime:e.maxTime,btnDisabled:d(e.minTime,e.maxTime),maxHours:e.maxTime.getHours(),maxMinutes:e.maxTime.getMinutes(),maxSeconds:e.maxTime.getSeconds(),minHours:e.minTime.getHours(),minMinutes:e.minTime.getMinutes(),minSeconds:e.minTime.getSeconds(),format:"HH:mm:ss",visible:!1,width:0}},watch:{value:function(e){var t=this;this.panelCreated(),this.$nextTick(function(e){return t.ajustScrollTop()})}},methods:{panelCreated:function(){var e=h(this.value);e.minTime===this.minTime&&e.maxTime===this.maxTime||(this.handleMinChange({hours:e.minTime.getHours(),minutes:e.minTime.getMinutes(),seconds:e.minTime.getSeconds()}),this.handleMaxChange({hours:e.maxTime.getHours(),minutes:e.maxTime.getMinutes(),seconds:e.maxTime.getSeconds()}))},handleClear:function(){this.handleCancel()},handleCancel:function(){this.$emit("pick")},handleChange:function(){this.minTime>this.maxTime||(u.setFullYear(this.minTime.getFullYear()),u.setMonth(this.minTime.getMonth(),this.minTime.getDate()),c.setFullYear(this.maxTime.getFullYear()),c.setMonth(this.maxTime.getMonth(),this.maxTime.getDate()),this.$refs.minSpinner.selectableRange=[[u,this.maxTime]],this.$refs.maxSpinner.selectableRange=[[this.minTime,c]],this.handleConfirm(!0))},handleMaxChange:function(e){void 0!==e.hours&&(this.maxTime.setHours(e.hours),this.maxHours=this.maxTime.getHours()),void 0!==e.minutes&&(this.maxTime.setMinutes(e.minutes),this.maxMinutes=this.maxTime.getMinutes()),void 0!==e.seconds&&(this.maxTime.setSeconds(e.seconds),this.maxSeconds=this.maxTime.getSeconds()),this.handleChange()},handleMinChange:function(e){void 0!==e.hours&&(this.minTime.setHours(e.hours),this.minHours=this.minTime.getHours()),void 0!==e.minutes&&(this.minTime.setMinutes(e.minutes),this.minMinutes=this.minTime.getMinutes()),void 0!==e.seconds&&(this.minTime.setSeconds(e.seconds),this.minSeconds=this.minTime.getSeconds()),this.handleChange()},setMinSelectionRange:function(e,t){this.$emit("select-range",e,t)},setMaxSelectionRange:function(e,t){this.$emit("select-range",e+11,t+11)},handleConfirm:function(){var e=arguments.length>0&&void 0!==arguments[0]&&arguments[0],t=arguments.length>1&&void 0!==arguments[1]&&arguments[1],i=this.$refs.minSpinner.selectableRange,n=this.$refs.maxSpinner.selectableRange;this.minTime=(0,s.limitRange)(this.minTime,i),this.maxTime=(0,s.limitRange)(this.maxTime,n),t||this.$emit("pick",[this.minTime,this.maxTime],e,t)},ajustScrollTop:function(){this.$refs.minSpinner.ajustScrollTop(),this.$refs.maxSpinner.ajustScrollTop()}},mounted:function(){var e=this;this.$nextTick(function(){return e.handleConfirm(!0,!0)})}}},function(e,t){e.exports={render:function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("transition",{attrs:{name:"el-zoom-in-top"},on:{"before-enter":e.panelCreated,"after-leave":function(t){e.$emit("dodestroy")}}},[i("div",{directives:[{name:"show",rawName:"v-show",value:e.visible,expression:"visible"}],staticClass:"el-time-range-picker el-picker-panel",class:e.popperClass,style:{width:e.width+"px"}},[i("div",{staticClass:"el-time-range-picker__content"},[i("div",{staticClass:"el-time-range-picker__cell"},[i("div",{staticClass:"el-time-range-picker__header"},[e._v(e._s(e.t("el.datepicker.startTime")))]),i("div",{staticClass:"el-time-range-picker__body el-time-panel__content",class:{"has-seconds":e.showSeconds}},[i("time-spinner",{ref:"minSpinner",attrs:{"show-seconds":e.showSeconds,hours:e.minHours,minutes:e.minMinutes,seconds:e.minSeconds},on:{change:e.handleMinChange,"select-range":e.setMinSelectionRange}})],1)]),i("div",{staticClass:"el-time-range-picker__cell"},[i("div",{staticClass:"el-time-range-picker__header"},[e._v(e._s(e.t("el.datepicker.endTime")))]),i("div",{staticClass:"el-time-range-picker__body el-time-panel__content",class:{"has-seconds":e.showSeconds}},[i("time-spinner",{ref:"maxSpinner",attrs:{"show-seconds":e.showSeconds,hours:e.maxHours,minutes:e.maxMinutes,seconds:e.maxSeconds},on:{change:e.handleMaxChange,"select-range":e.setMaxSelectionRange}})],1)])]),i("div",{staticClass:"el-time-panel__footer"},[i("button",{staticClass:"el-time-panel__btn cancel",attrs:{type:"button"},on:{click:function(t){e.handleCancel()}}},[e._v(e._s(e.t("el.datepicker.cancel")))]),i("button",{staticClass:"el-time-panel__btn confirm",attrs:{type:"button",disabled:e.btnDisabled},on:{click:function(t){e.handleConfirm()}}},[e._v(e._s(e.t("el.datepicker.confirm")))])])])])},staticRenderFns:[]}},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0;var s=i(194),o=n(s),a=i(197),r=n(a),l=i(15),u=n(l);u.default.directive("popover",r.default),o.default.install=function(e){e.directive("popover",r.default),e.component(o.default.name,o.default)},o.default.directive=r.default,t.default=o.default},function(e,t,i){var n=i(5)(i(195),i(196),null,null,null);e.exports=n.exports},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0;var s=i(27),o=n(s),a=i(30);t.default={name:"ElPopover",mixins:[o.default],props:{trigger:{type:String,default:"click",validator:function(e){return["click","focus","hover","manual"].indexOf(e)>-1}},openDelay:{type:Number,default:0},title:String,disabled:Boolean,content:String,reference:{},popperClass:String,width:{},visibleArrow:{default:!0},transition:{type:String,default:"fade-in-linear"}},watch:{showPopper:function(e,t){e?this.$emit("show"):this.$emit("hide")}},mounted:function(){var e=this.reference||this.$refs.reference,t=this.popper||this.$refs.popper;if(!e&&this.$slots.reference&&this.$slots.reference[0]&&(e=this.referenceElm=this.$slots.reference[0].elm),"click"===this.trigger)(0,a.on)(e,"click",this.doToggle),(0,a.on)(document,"click",this.handleDocumentClick);else if("hover"===this.trigger)(0,a.on)(e,"mouseenter",this.handleMouseEnter),(0,a.on)(t,"mouseenter",this.handleMouseEnter),(0,a.on)(e,"mouseleave",this.handleMouseLeave),(0,a.on)(t,"mouseleave",this.handleMouseLeave);else if("focus"===this.trigger){var i=!1;if([].slice.call(e.children).length)for(var n=e.childNodes,s=n.length,o=0;o<s;o++)if("INPUT"===n[o].nodeName||"TEXTAREA"===n[o].nodeName){(0,a.on)(n[o],"focus",this.doShow),(0,a.on)(n[o],"blur",this.doClose),i=!0;break}if(i)return;"INPUT"===e.nodeName||"TEXTAREA"===e.nodeName?((0,a.on)(e,"focus",this.doShow),(0,a.on)(e,"blur",this.doClose)):((0,a.on)(e,"mousedown",this.doShow),(0,a.on)(e,"mouseup",this.doClose))}},methods:{doToggle:function(){this.showPopper=!this.showPopper},doShow:function(){this.showPopper=!0},doClose:function(){this.showPopper=!1},handleMouseEnter:function(){var e=this;clearTimeout(this._timer),this.openDelay?this._timer=setTimeout(function(){e.showPopper=!0},this.openDelay):this.showPopper=!0},handleMouseLeave:function(){var e=this;clearTimeout(this._timer),this._timer=setTimeout(function(){e.showPopper=!1},200)},handleDocumentClick:function(e){var t=this.reference||this.$refs.reference,i=this.popper||this.$refs.popper;!t&&this.$slots.reference&&this.$slots.reference[0]&&(t=this.referenceElm=this.$slots.reference[0].elm),this.$el&&t&&!this.$el.contains(e.target)&&!t.contains(e.target)&&i&&!i.contains(e.target)&&(this.showPopper=!1)}},destroyed:function(){var e=this.reference;(0,a.off)(e,"click",this.doToggle),(0,a.off)(e,"mouseup",this.doClose),(0,a.off)(e,"mousedown",this.doShow),(0,a.off)(e,"focus",this.doShow),(0,a.off)(e,"blur",this.doClose),(0,a.off)(e,"mouseleave",this.handleMouseLeave),(0,a.off)(e,"mouseenter",this.handleMouseEnter),(0,a.off)(document,"click",this.handleDocumentClick)}}},function(e,t){e.exports={render:function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("span",[i("transition",{attrs:{name:e.transition},on:{"after-leave":e.doDestroy}},[i("div",{directives:[{name:"show",rawName:"v-show",value:!e.disabled&&e.showPopper,expression:"!disabled && showPopper"}],ref:"popper",staticClass:"el-popover",class:[e.popperClass],style:{width:e.width+"px"}},[e.title?i("div",{staticClass:"el-popover__title",domProps:{textContent:e._s(e.title)}}):e._e(),e._t("default",[e._v(e._s(e.content))])],2)]),e._t("reference")],2)},staticRenderFns:[]}},function(e,t){"use strict";t.__esModule=!0,t.default={bind:function(e,t,i){i.context.$refs[t.arg].$refs.reference=e}}},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0;var s=i(199),o=n(s);t.default=o.default},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0,t.MessageBox=void 0;var s="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},o=i(15),a=n(o),r=i(200),l=n(r),u=i(23),c=n(u),d=i(145),h={title:void 0,message:"",type:"",showInput:!1,showClose:!0,modalFade:!0,lockScroll:!0,closeOnClickModal:!0,closeOnPressEscape:!0,inputValue:null,inputPlaceholder:"",inputPattern:null,inputValidator:null,inputErrorMessage:"",showConfirmButton:!0,showCancelButton:!1,confirmButtonPosition:"right",confirmButtonHighlight:!1,cancelButtonHighlight:!1,confirmButtonText:"",cancelButtonText:"",confirmButtonClass:"",cancelButtonClass:"",customClass:"",beforeClose:null},f=a.default.extend(l.default),p=void 0,m=void 0,v=[],g=function(e){if(p){var t=p.callback;"function"==typeof t&&(m.showInput?t(m.inputValue,e):t(e)),p.resolve&&("confirm"===e?m.showInput?p.resolve({value:m.inputValue,action:e}):p.resolve(e):"cancel"===e&&p.reject&&p.reject(e))}},y=function(){m=new f({el:document.createElement("div")}),m.callback=g},b=function e(){m||y(),m.action="",m.visible&&!m.closeTimer||v.length>0&&!function(){p=v.shift();var t=p.options;for(var i in t)t.hasOwnProperty(i)&&(m[i]=t[i]);void 0===t.callback&&(m.callback=g);var n=m.callback;m.callback=function(t,i){n(t,i),e()},(0,d.isVNode)(m.message)?(m.$slots.default=[m.message],m.message=null):delete m.$slots.default,["modal","showClose","closeOnClickModal","closeOnPressEscape"].forEach(function(e){void 0===m[e]&&(m[e]=!0)}),document.body.appendChild(m.$el),a.default.nextTick(function(){m.visible=!0})}()},_=function e(t,i){if(!a.default.prototype.$isServer)return"string"==typeof t?(t={message:t},arguments[1]&&(t.title=arguments[1]),arguments[2]&&(t.type=arguments[2])):t.callback&&!i&&(i=t.callback),"undefined"!=typeof Promise?new Promise(function(n,s){v.push({options:(0,c.default)({},h,e.defaults,t),callback:i,resolve:n,reject:s}),b()}):(v.push({options:(0,c.default)({},h,e.defaults,t),callback:i}),void b())};_.setDefaults=function(e){_.defaults=e},_.alert=function(e,t,i){return"object"===("undefined"==typeof t?"undefined":s(t))?(i=t,t=""):void 0===t&&(t=""),_((0,c.default)({title:t,message:e,$type:"alert",closeOnPressEscape:!1,closeOnClickModal:!1},i))},_.confirm=function(e,t,i){return"object"===("undefined"==typeof t?"undefined":s(t))?(i=t,t=""):void 0===t&&(t=""),_((0,c.default)({title:t,message:e,$type:"confirm",showCancelButton:!0},i))},_.prompt=function(e,t,i){return"object"===("undefined"==typeof t?"undefined":s(t))?(i=t,t=""):void 0===t&&(t=""),_((0,c.default)({title:t,message:e,showCancelButton:!0,showInput:!0,$type:"prompt"},i))},_.close=function(){m.visible=!1,v=[],p=null},t.default=_,t.MessageBox=_},function(e,t,i){var n=i(5)(i(201),i(202),null,null,null);e.exports=n.exports},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0;var s=i(28),o=n(s),a=i(12),r=n(a),l=i(19),u=n(l),c=i(66),d=n(c),h=i(30),f=i(13),p={success:"circle-check",info:"information",warning:"warning",error:"circle-cross"};t.default={mixins:[o.default,r.default],props:{modal:{default:!0},lockScroll:{default:!0},showClose:{type:Boolean,default:!0},closeOnClickModal:{default:!0},closeOnPressEscape:{default:!0}},components:{ElInput:u.default,ElButton:d.default},computed:{typeClass:function(){return this.type&&p[this.type]?"el-icon-"+p[this.type]:""},confirmButtonClasses:function(){return"el-button--primary "+this.confirmButtonClass},cancelButtonClasses:function(){return""+this.cancelButtonClass}},methods:{getSafeClose:function(){var e=this,t=this.uid;return function(){e.$nextTick(function(){t===e.uid&&e.doClose()})}},doClose:function(){var e=this;this.visible&&(this.visible=!1,this._closing=!0,this.onClose&&this.onClose(),this.lockScroll&&setTimeout(function(){e.modal&&"hidden"!==e.bodyOverflow&&(document.body.style.overflow=e.bodyOverflow,document.body.style.paddingRight=e.bodyPaddingRight),e.bodyOverflow=null,e.bodyPaddingRight=null},200),this.opened=!1,this.transition||this.doAfterClose(),this.action&&this.callback(this.action,this))},handleWrapperClick:function(){this.closeOnClickModal&&this.handleAction("cancel")},handleAction:function(e){("prompt"!==this.$type||"confirm"!==e||this.validate())&&(this.action=e,"function"==typeof this.beforeClose?(this.close=this.getSafeClose(),this.beforeClose(e,this,this.close)):this.doClose())},validate:function(){if("prompt"===this.$type){var e=this.inputPattern;if(e&&!e.test(this.inputValue||""))return this.editorErrorMessage=this.inputErrorMessage||(0,f.t)("el.messagebox.error"),(0,h.addClass)(this.$refs.input.$el.querySelector("input"),"invalid"),!1;var t=this.inputValidator;if("function"==typeof t){var i=t(this.inputValue);if(i===!1)return this.editorErrorMessage=this.inputErrorMessage||(0,f.t)("el.messagebox.error"),(0,h.addClass)(this.$refs.input.$el.querySelector("input"),"invalid"),!1;if("string"==typeof i)return this.editorErrorMessage=i,!1}}return this.editorErrorMessage="",(0,h.removeClass)(this.$refs.input.$el.querySelector("input"),"invalid"),!0}},watch:{inputValue:{immediate:!0,handler:function(e){var t=this;this.$nextTick(function(i){"prompt"===t.$type&&null!==e&&t.validate()})}},visible:function(e){var t=this;e&&this.uid++,"alert"!==this.$type&&"confirm"!==this.$type||this.$nextTick(function(){t.$refs.confirm.$el.focus()}),"prompt"===this.$type&&(e?setTimeout(function(){t.$refs.input&&t.$refs.input.$el&&t.$refs.input.$el.querySelector("input").focus()},500):(this.editorErrorMessage="",(0,h.removeClass)(this.$refs.input.$el.querySelector("input"),"invalid")))}},data:function(){return{uid:1,title:void 0,message:"",type:"",customClass:"",showInput:!1,inputValue:null,inputPlaceholder:"",inputPattern:null,inputValidator:null,inputErrorMessage:"",showConfirmButton:!0,showCancelButton:!1,action:"",confirmButtonText:"",cancelButtonText:"",confirmButtonLoading:!1,cancelButtonLoading:!1,confirmButtonClass:"",confirmButtonDisabled:!1,cancelButtonClass:"",editorErrorMessage:null,callback:null}}}},function(e,t){e.exports={render:function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("transition",{attrs:{name:"msgbox-fade"}},[i("div",{directives:[{name:"show",rawName:"v-show",value:e.visible,expression:"visible"}],staticClass:"el-message-box__wrapper",attrs:{tabindex:"-1"},on:{click:function(t){return t.target!==t.currentTarget?null:void e.handleWrapperClick(t)}}},[i("div",{staticClass:"el-message-box",class:e.customClass},[void 0!==e.title?i("div",{staticClass:"el-message-box__header"},[i("div",{staticClass:"el-message-box__title"},[e._v(e._s(e.title))]),e.showClose?i("button",{staticClass:"el-message-box__headerbtn",attrs:{type:"button","aria-label":"Close"},on:{click:function(t){e.handleAction("cancel")}}},[i("i",{staticClass:"el-message-box__close el-icon-close"})]):e._e()]):e._e(),""!==e.message?i("div",{staticClass:"el-message-box__content"},[i("div",{staticClass:"el-message-box__status",class:[e.typeClass]}),i("div",{staticClass:"el-message-box__message",style:{"margin-left":e.typeClass?"50px":"0"}},[e._t("default",[i("p",[e._v(e._s(e.message))])])],2),i("div",{directives:[{name:"show",rawName:"v-show",value:e.showInput,expression:"showInput"}],staticClass:"el-message-box__input"},[i("el-input",{ref:"input",attrs:{placeholder:e.inputPlaceholder},nativeOn:{keyup:function(t){return"button"in t||!e._k(t.keyCode,"enter",13)?void e.handleAction("confirm"):null}},model:{value:e.inputValue,callback:function(t){e.inputValue=t},expression:"inputValue"}}),i("div",{staticClass:"el-message-box__errormsg",style:{visibility:e.editorErrorMessage?"visible":"hidden"}},[e._v(e._s(e.editorErrorMessage))])],1)]):e._e(),i("div",{staticClass:"el-message-box__btns"},[i("el-button",{directives:[{name:"show",rawName:"v-show",value:e.showCancelButton,expression:"showCancelButton"}],class:[e.cancelButtonClasses],attrs:{loading:e.cancelButtonLoading},nativeOn:{click:function(t){e.handleAction("cancel")}}},[e._v("\n          "+e._s(e.cancelButtonText||e.t("el.messagebox.cancel"))+"\n        ")]),i("el-button",{directives:[{name:"show",rawName:"v-show",value:e.showConfirmButton,expression:"showConfirmButton"}],ref:"confirm",class:[e.confirmButtonClasses],attrs:{loading:e.confirmButtonLoading},nativeOn:{click:function(t){e.handleAction("confirm")}}},[e._v("\n          "+e._s(e.confirmButtonText||e.t("el.messagebox.confirm"))+"\n        ")])],1)])])])},staticRenderFns:[]}},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0;var s=i(204),o=n(s);o.default.install=function(e){e.component(o.default.name,o.default)},t.default=o.default},function(e,t,i){var n=i(5)(i(205),i(206),null,null,null);e.exports=n.exports},function(e,t){"use strict";t.__esModule=!0,t.default={name:"ElBreadcrumb",props:{separator:{type:String,default:"/"}}}},function(e,t){e.exports={render:function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("div",{staticClass:"el-breadcrumb"},[e._t("default")],2)},staticRenderFns:[]}},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0;var s=i(208),o=n(s);o.default.install=function(e){e.component(o.default.name,o.default)},t.default=o.default},function(e,t,i){var n=i(5)(i(209),i(210),null,null,null);e.exports=n.exports},function(e,t){"use strict";t.__esModule=!0,t.default={name:"ElBreadcrumbItem",props:{to:{},replace:Boolean},data:function(){return{separator:""}},mounted:function(){var e=this;this.separator=this.$parent.separator;var t=this;if(this.to){var i=this.$refs.link;i.addEventListener("click",function(i){var n=e.to;t.replace?t.$router.replace(n):t.$router.push(n)})}}}},function(e,t){e.exports={render:function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("span",{staticClass:"el-breadcrumb__item"},[i("span",{ref:"link",staticClass:"el-breadcrumb__item__inner"},[e._t("default")],2),i("span",{staticClass:"el-breadcrumb__separator"},[e._v(e._s(e.separator))])])},staticRenderFns:[]}},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0;var s=i(212),o=n(s);o.default.install=function(e){e.component(o.default.name,o.default)},t.default=o.default},function(e,t,i){var n=i(5)(i(213),i(214),null,null,null);e.exports=n.exports},function(e,t,i){"use strict";t.__esModule=!0,t.default={name:"ElForm",componentName:"ElForm",props:{model:Object,rules:Object,labelPosition:String,labelWidth:String,labelSuffix:{type:String,default:""},inline:Boolean,showMessage:{type:Boolean,default:!0}},watch:{rules:function(){this.validate()}},data:function(){return{fields:[]}},created:function(){var e=this;this.$on("el.form.addField",function(t){t&&e.fields.push(t)}),this.$on("el.form.removeField",function(t){t.prop&&e.fields.splice(e.fields.indexOf(t),1)})},methods:{resetFields:function(){this.model&&this.fields.forEach(function(e){e.resetField()})},validate:function(e){var t=this;if(!this.model)return void console.warn("[Element Warn][Form]model is required for validate to work!");var i=!0,n=0;0===this.fields.length&&e&&e(!0),this.fields.forEach(function(s,o){s.validate("",function(s){s&&(i=!1),"function"==typeof e&&++n===t.fields.length&&e(i)})})},validateField:function(e,t){var i=this.fields.filter(function(t){return t.prop===e})[0];if(!i)throw new Error("must call validateField with valid prop string!");i.validate("",t)}}}},function(e,t){e.exports={render:function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("form",{staticClass:"el-form",class:[e.labelPosition?"el-form--label-"+e.labelPosition:"",{"el-form--inline":e.inline}]},[e._t("default")],2)},staticRenderFns:[]}},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0;var s=i(216),o=n(s);o.default.install=function(e){e.component(o.default.name,o.default)},t.default=o.default},function(e,t,i){var n=i(5)(i(217),i(243),null,null,null);e.exports=n.exports},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}function s(){}function o(e,t){var i=e;t=t.replace(/\[(\w+)\]/g,".$1"),t=t.replace(/^\./,"");for(var n=t.split("."),s=0,o=n.length;s<o-1;++s){var a=n[s];if(!(a in i))throw new Error("please transfer a valid prop path to form item!");i=i[a]}return{o:i,k:n[s],v:i[n[s]]}}t.__esModule=!0;var a=i(218),r=n(a),l=i(11),u=n(l);t.default={name:"ElFormItem",componentName:"ElFormItem",mixins:[u.default],props:{label:String,labelWidth:String,prop:String,required:Boolean,rules:[Object,Array],error:String,validateStatus:String,showMessage:{type:Boolean,default:!0}},watch:{error:function(e){this.validateMessage=e,this.validateState=e?"error":""},validateStatus:function(e){this.validateState=e}},computed:{labelStyle:function(){var e={};if("top"===this.form.labelPosition)return e;var t=this.labelWidth||this.form.labelWidth;return t&&(e.width=t),e},
contentStyle:function(){var e={},t=this.label;if("top"===this.form.labelPosition||this.form.inline)return e;if(!t&&!this.labelWidth&&this.isNested)return e;var i=this.labelWidth||this.form.labelWidth;return i&&(e.marginLeft=i),e},form:function(){for(var e=this.$parent,t=e.$options.componentName;"ElForm"!==t;)"ElFormItem"===t&&(this.isNested=!0),e=e.$parent,t=e.$options.componentName;return e},fieldValue:{cache:!1,get:function(){var e=this.form.model;if(e&&this.prop){var t=this.prop;return t.indexOf(":")!==-1&&(t=t.replace(/:/,".")),o(e,t).v}}},isRequired:function e(){var t=this.getRules(),e=!1;return t&&t.length&&t.every(function(t){return!t.required||(e=!0,!1)}),e}},data:function(){return{validateState:"",validateMessage:"",validateDisabled:!1,validator:{},isNested:!1}},methods:{validate:function(e){var t=this,i=arguments.length>1&&void 0!==arguments[1]?arguments[1]:s,n=this.getFilteredRule(e);if(!n||0===n.length)return i(),!0;this.validateState="validating";var o={};o[this.prop]=n;var a=new r.default(o),l={};l[this.prop]=this.fieldValue,a.validate(l,{firstFields:!0},function(e,n){t.validateState=e?"error":"success",t.validateMessage=e?e[0].message:"",i(t.validateMessage)})},resetField:function(){this.validateState="",this.validateMessage="";var e=this.form.model,t=this.fieldValue,i=this.prop;i.indexOf(":")!==-1&&(i=i.replace(/:/,"."));var n=o(e,i);Array.isArray(t)?(this.validateDisabled=!0,n.o[n.k]=[].concat(this.initialValue)):(this.validateDisabled=!0,n.o[n.k]=this.initialValue)},getRules:function(){var e=this.form.rules,t=this.rules;return e=e?e[this.prop]:[],[].concat(t||e||[])},getFilteredRule:function(e){var t=this.getRules();return t.filter(function(t){return!t.trigger||t.trigger.indexOf(e)!==-1})},onFieldBlur:function(){this.validate("blur")},onFieldChange:function(){return this.validateDisabled?void(this.validateDisabled=!1):void this.validate("change")}},mounted:function(){if(this.prop){this.dispatch("ElForm","el.form.addField",[this]);var e=this.fieldValue;Array.isArray(e)&&(e=[].concat(e)),Object.defineProperty(this,"initialValue",{value:e});var t=this.getRules();t.length&&(this.$on("el.form.blur",this.onFieldBlur),this.$on("el.form.change",this.onFieldChange))}},beforeDestroy:function(){this.dispatch("ElForm","el.form.removeField",[this])}}},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}function s(e){this.rules=null,this._messages=c.messages,this.define(e)}Object.defineProperty(t,"__esModule",{value:!0});var o=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var i=arguments[t];for(var n in i)Object.prototype.hasOwnProperty.call(i,n)&&(e[n]=i[n])}return e},a="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},r=i(219),l=i(220),u=n(l),c=i(242),d=i(222);s.prototype={messages:function(e){return e&&(this._messages=(0,r.deepMerge)((0,c.newMessages)(),e)),this._messages},define:function(e){if(!e)throw new Error("Cannot configure a schema with no rules");if("object"!==("undefined"==typeof e?"undefined":a(e))||Array.isArray(e))throw new Error("Rules must be an object");this.rules={};var t=void 0,i=void 0;for(t in e)e.hasOwnProperty(t)&&(i=e[t],this.rules[t]=Array.isArray(i)?i:[i])},validate:function(e){function t(e){function t(e){Array.isArray(e)?s=s.concat.apply(s,e):s.push(e)}var i=void 0,n=void 0,s=[],o={};for(i=0;i<e.length;i++)t(e[i]);if(s.length)for(i=0;i<s.length;i++)n=s[i].field,o[n]=o[n]||[],o[n].push(s[i]);else s=null,o=null;f(s,o)}var i=this,n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},l=arguments[2],u=e,h=n,f=l;if("function"==typeof h&&(f=h,h={}),!this.rules||0===Object.keys(this.rules).length)return void(f&&f());if(h.messages){var p=this.messages();p===c.messages&&(p=(0,c.newMessages)()),(0,r.deepMerge)(p,h.messages),h.messages=p}else h.messages=this.messages();h.error=d.error;var m=void 0,v=void 0,g={},y=h.keys||Object.keys(this.rules);y.forEach(function(t){m=i.rules[t],v=u[t],m.forEach(function(n){var s=n;"function"==typeof s.transform&&(u===e&&(u=o({},u)),v=u[t]=s.transform(v)),s="function"==typeof s?{validator:s}:o({},s),s.validator=i.getValidationMethod(s),s.field=t,s.fullField=s.fullField||t,s.type=i.getType(s),s.validator&&(g[t]=g[t]||[],g[t].push({rule:s,value:v,source:u,field:t}))})});var b={};(0,r.asyncMap)(g,h,function(e,t){function i(e,t){return o({},t,{fullField:l.fullField+"."+e})}function n(){var n=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[],a=n;if(Array.isArray(a)||(a=[a]),a.length&&(0,r.warning)("async-validator:",a),a.length&&l.message&&(a=[].concat(l.message)),a=a.map((0,r.complementError)(l)),(h.first||h.fieldFirst)&&a.length)return b[l.field]=1,t(a);if(u){if(l.required&&!e.value)return a=l.message?[].concat(l.message).map((0,r.complementError)(l)):[h.error(l,(0,r.format)(h.messages.required,l.field))],t(a);var c={};if(l.defaultField)for(var d in e.value)e.value.hasOwnProperty(d)&&(c[d]=l.defaultField);c=o({},c,e.rule.fields);for(var f in c)if(c.hasOwnProperty(f)){var p=Array.isArray(c[f])?c[f]:[c[f]];c[f]=p.map(i.bind(null,f))}var m=new s(c);m.messages(h.messages),e.rule.options&&(e.rule.options.messages=h.messages,e.rule.options.error=h.error),m.validate(e.value,e.rule.options||h,function(e){t(e&&e.length?a.concat(e):e)})}else t(a)}var l=e.rule,u=!("object"!==l.type&&"array"!==l.type||"object"!==a(l.fields)&&"object"!==a(l.defaultField));u=u&&(l.required||!l.required&&e.value),l.field=e.field,l.validator(l,e.value,n,e.source,h)},function(e){t(e)})},getType:function(e){if(void 0===e.type&&e.pattern instanceof RegExp&&(e.type="pattern"),"function"!=typeof e.validator&&e.type&&!u.default.hasOwnProperty(e.type))throw new Error((0,r.format)("Unknown rule type %s",e.type));return e.type||"string"},getValidationMethod:function(e){if("function"==typeof e.validator)return e.validator;var t=Object.keys(e),i=t.indexOf("message");return i!==-1&&t.splice(i,1),1===t.length&&"required"===t[0]?u.default.required:u.default[this.getType(e)]||!1}},s.register=function(e,t){if("function"!=typeof t)throw new Error("Cannot register a validator by type, validator is not a function");u.default[e]=t},s.messages=c.messages,t.default=s,e.exports=t.default},function(e,t,i){"use strict";function n(){for(var e=arguments.length,t=Array(e),i=0;i<e;i++)t[i]=arguments[i];var n=1,s=t[0],o=t.length;if("function"==typeof s)return s.apply(null,t.slice(1));if("string"==typeof s){for(var a=String(s).replace(m,function(e){if("%%"===e)return"%";if(n>=o)return e;switch(e){case"%s":return String(t[n++]);case"%d":return Number(t[n++]);case"%j":try{return JSON.stringify(t[n++])}catch(e){return"[Circular]"}break;default:return e}}),r=t[n];n<o;r=t[++n])a+=" "+r;return a}return s}function s(e){return"string"===e||"url"===e||"hex"===e||"email"===e||"pattern"===e}function o(e,t){return void 0===e||null===e||(!("array"!==t||!Array.isArray(e)||e.length)||!(!s(t)||"string"!=typeof e||e))}function a(e){return 0===Object.keys(e).length}function r(e,t,i){function n(e){s.push.apply(s,e),o++,o===a&&i(s)}var s=[],o=0,a=e.length;e.forEach(function(e){t(e,n)})}function l(e,t,i){function n(a){if(a&&a.length)return void i(a);var r=s;s+=1,r<o?t(e[r],n):i([])}var s=0,o=e.length;n([])}function u(e){var t=[];return Object.keys(e).forEach(function(i){t.push.apply(t,e[i])}),t}function c(e,t,i,n){if(t.first){var s=u(e);return l(s,i,n)}var o=t.firstFields||[];o===!0&&(o=Object.keys(e));var a=Object.keys(e),c=a.length,d=0,h=[],f=function(e){h.push.apply(h,e),d++,d===c&&n(h)};a.forEach(function(t){var n=e[t];o.indexOf(t)!==-1?l(n,i,f):r(n,i,f)})}function d(e){return function(t){return t&&t.message?(t.field=t.field||e.fullField,t):{message:t,field:t.field||e.fullField}}}function h(e,t){if(t)for(var i in t)if(t.hasOwnProperty(i)){var n=t[i];"object"===("undefined"==typeof n?"undefined":p(n))&&"object"===p(e[i])?e[i]=f({},e[i],n):e[i]=n}return e}Object.defineProperty(t,"__esModule",{value:!0});var f=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var i=arguments[t];for(var n in i)Object.prototype.hasOwnProperty.call(i,n)&&(e[n]=i[n])}return e},p="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e};t.format=n,t.isEmptyValue=o,t.isEmptyObject=a,t.asyncMap=c,t.complementError=d,t.deepMerge=h;var m=/%[sdj%]/g;t.warning=function(){}},function(e,t,i){"use strict";e.exports={string:i(221),method:i(229),number:i(230),boolean:i(231),regexp:i(232),integer:i(233),float:i(234),array:i(235),object:i(236),enum:i(237),pattern:i(238),email:i(239),url:i(239),date:i(240),hex:i(239),required:i(241)}},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}function s(e,t,i,n,s){var o=[],l=e.required||!e.required&&n.hasOwnProperty(e.field);if(l){if((0,r.isEmptyValue)(t,"string")&&!e.required)return i();a.default.required(e,t,n,o,s,"string"),(0,r.isEmptyValue)(t,"string")||(a.default.type(e,t,n,o,s),a.default.range(e,t,n,o,s),a.default.pattern(e,t,n,o,s),e.whitespace===!0&&a.default.whitespace(e,t,n,o,s))}i(o)}Object.defineProperty(t,"__esModule",{value:!0});var o=i(222),a=n(o),r=i(219);t.default=s,e.exports=t.default},function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default={required:i(223),whitespace:i(224),type:i(225),range:i(226),enum:i(227),pattern:i(228)},e.exports=t.default},function(e,t,i){"use strict";function n(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var i in e)Object.prototype.hasOwnProperty.call(e,i)&&(t[i]=e[i]);return t.default=e,t}function s(e,t,i,n,s,o){!e.required||i.hasOwnProperty(e.field)&&!a.isEmptyValue(t,o||e.type)||n.push(a.format(s.messages.required,e.fullField))}Object.defineProperty(t,"__esModule",{value:!0});var o=i(219),a=n(o);t.default=s,e.exports=t.default},function(e,t,i){"use strict";function n(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var i in e)Object.prototype.hasOwnProperty.call(e,i)&&(t[i]=e[i]);return t.default=e,t}function s(e,t,i,n,s){(/^\s+$/.test(t)||""===t)&&n.push(a.format(s.messages.whitespace,e.fullField))}Object.defineProperty(t,"__esModule",{value:!0});var o=i(219),a=n(o);t.default=s,e.exports=t.default},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}function s(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var i in e)Object.prototype.hasOwnProperty.call(e,i)&&(t[i]=e[i]);return t.default=e,t}function o(e,t,i,n,s){if(e.required&&void 0===t)return void(0,c.default)(e,t,i,n,s);var o=["integer","float","array","regexp","object","method","email","number","date","url","hex"],r=e.type;o.indexOf(r)>-1?h[r](t)||n.push(l.format(s.messages.types[r],e.fullField,e.type)):r&&("undefined"==typeof t?"undefined":a(t))!==e.type&&n.push(l.format(s.messages.types[r],e.fullField,e.type))}Object.defineProperty(t,"__esModule",{value:!0});var a="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},r=i(219),l=s(r),u=i(223),c=n(u),d={email:/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,url:new RegExp("^(?!mailto:)(?:(?:http|https|ftp)://|//)(?:\\S+(?::\\S*)?@)?(?:(?:(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[0-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))|localhost)(?::\\d{2,5})?(?:(/|\\?|#)[^\\s]*)?$","i"),hex:/^#?([a-f0-9]{6}|[a-f0-9]{3})$/i},h={integer:function(e){return h.number(e)&&parseInt(e,10)===e},float:function(e){return h.number(e)&&!h.integer(e)},array:function(e){return Array.isArray(e)},regexp:function(e){if(e instanceof RegExp)return!0;try{return!!new RegExp(e)}catch(e){return!1}},date:function(e){return"function"==typeof e.getTime&&"function"==typeof e.getMonth&&"function"==typeof e.getYear},number:function(e){return!isNaN(e)&&"number"==typeof e},object:function(e){return"object"===("undefined"==typeof e?"undefined":a(e))&&!h.array(e)},method:function(e){return"function"==typeof e},email:function(e){return"string"==typeof e&&!!e.match(d.email)},url:function(e){return"string"==typeof e&&!!e.match(d.url)},hex:function(e){return"string"==typeof e&&!!e.match(d.hex)}};t.default=o,e.exports=t.default},function(e,t,i){"use strict";function n(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var i in e)Object.prototype.hasOwnProperty.call(e,i)&&(t[i]=e[i]);return t.default=e,t}function s(e,t,i,n,s){var o="number"==typeof e.len,r="number"==typeof e.min,l="number"==typeof e.max,u=t,c=null,d="number"==typeof t,h="string"==typeof t,f=Array.isArray(t);return d?c="number":h?c="string":f&&(c="array"),!!c&&((h||f)&&(u=t.length),void(o?u!==e.len&&n.push(a.format(s.messages[c].len,e.fullField,e.len)):r&&!l&&u<e.min?n.push(a.format(s.messages[c].min,e.fullField,e.min)):l&&!r&&u>e.max?n.push(a.format(s.messages[c].max,e.fullField,e.max)):r&&l&&(u<e.min||u>e.max)&&n.push(a.format(s.messages[c].range,e.fullField,e.min,e.max))))}Object.defineProperty(t,"__esModule",{value:!0});var o=i(219),a=n(o);t.default=s,e.exports=t.default},function(e,t,i){"use strict";function n(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var i in e)Object.prototype.hasOwnProperty.call(e,i)&&(t[i]=e[i]);return t.default=e,t}function s(e,t,i,n,s){e[r]=Array.isArray(e[r])?e[r]:[],e[r].indexOf(t)===-1&&n.push(a.format(s.messages[r],e.fullField,e[r].join(", ")))}Object.defineProperty(t,"__esModule",{value:!0});var o=i(219),a=n(o),r="enum";t.default=s,e.exports=t.default},function(e,t,i){"use strict";function n(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var i in e)Object.prototype.hasOwnProperty.call(e,i)&&(t[i]=e[i]);return t.default=e,t}function s(e,t,i,n,s){e.pattern instanceof RegExp&&(console.log(t,e.pattern,e.pattern.test(t)),e.pattern.test(t)||n.push(a.format(s.messages.pattern.mismatch,e.fullField,t,e.pattern)))}Object.defineProperty(t,"__esModule",{value:!0});var o=i(219),a=n(o);t.default=s,e.exports=t.default},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}function s(e,t,i,n,s){var o=[],l=e.required||!e.required&&n.hasOwnProperty(e.field);if(l){if((0,r.isEmptyValue)(t)&&!e.required)return i();a.default.required(e,t,n,o,s),void 0!==t&&a.default.type(e,t,n,o,s)}i(o)}Object.defineProperty(t,"__esModule",{value:!0});var o=i(222),a=n(o),r=i(219);t.default=s,e.exports=t.default},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}function s(e,t,i,n,s){var o=[],l=e.required||!e.required&&n.hasOwnProperty(e.field);if(l){if((0,r.isEmptyValue)(t)&&!e.required)return i();a.default.required(e,t,n,o,s),void 0!==t&&(a.default.type(e,t,n,o,s),a.default.range(e,t,n,o,s))}i(o)}Object.defineProperty(t,"__esModule",{value:!0});var o=i(222),a=n(o),r=i(219);t.default=s,e.exports=t.default},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}function s(e,t,i,n,s){var a=[],l=e.required||!e.required&&n.hasOwnProperty(e.field);if(l){if((0,o.isEmptyValue)(t)&&!e.required)return i();r.default.required(e,t,n,a,s),void 0!==t&&r.default.type(e,t,n,a,s)}i(a)}Object.defineProperty(t,"__esModule",{value:!0});var o=i(219),a=i(222),r=n(a);t.default=s,e.exports=t.default},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}function s(e,t,i,n,s){var o=[],l=e.required||!e.required&&n.hasOwnProperty(e.field);if(l){if((0,r.isEmptyValue)(t)&&!e.required)return i();a.default.required(e,t,n,o,s),(0,r.isEmptyValue)(t)||a.default.type(e,t,n,o,s)}i(o)}Object.defineProperty(t,"__esModule",{value:!0});var o=i(222),a=n(o),r=i(219);t.default=s,e.exports=t.default},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}function s(e,t,i,n,s){var o=[],l=e.required||!e.required&&n.hasOwnProperty(e.field);if(l){if((0,r.isEmptyValue)(t)&&!e.required)return i();a.default.required(e,t,n,o,s),void 0!==t&&(a.default.type(e,t,n,o,s),a.default.range(e,t,n,o,s))}i(o)}Object.defineProperty(t,"__esModule",{value:!0});var o=i(222),a=n(o),r=i(219);t.default=s,e.exports=t.default},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}function s(e,t,i,n,s){var o=[],l=e.required||!e.required&&n.hasOwnProperty(e.field);if(l){if((0,r.isEmptyValue)(t)&&!e.required)return i();a.default.required(e,t,n,o,s),void 0!==t&&(a.default.type(e,t,n,o,s),a.default.range(e,t,n,o,s))}i(o)}Object.defineProperty(t,"__esModule",{value:!0});var o=i(222),a=n(o),r=i(219);t.default=s,e.exports=t.default},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}function s(e,t,i,n,s){var o=[],l=e.required||!e.required&&n.hasOwnProperty(e.field);if(l){if((0,r.isEmptyValue)(t,"array")&&!e.required)return i();a.default.required(e,t,n,o,s,"array"),(0,r.isEmptyValue)(t,"array")||(a.default.type(e,t,n,o,s),a.default.range(e,t,n,o,s))}i(o)}Object.defineProperty(t,"__esModule",{value:!0});var o=i(222),a=n(o),r=i(219);t.default=s,e.exports=t.default},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}function s(e,t,i,n,s){var o=[],l=e.required||!e.required&&n.hasOwnProperty(e.field);if(l){if((0,r.isEmptyValue)(t)&&!e.required)return i();a.default.required(e,t,n,o,s),void 0!==t&&a.default.type(e,t,n,o,s)}i(o)}Object.defineProperty(t,"__esModule",{value:!0});var o=i(222),a=n(o),r=i(219);t.default=s,e.exports=t.default},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}function s(e,t,i,n,s){var o=[],u=e.required||!e.required&&n.hasOwnProperty(e.field);if(u){if((0,r.isEmptyValue)(t)&&!e.required)return i();a.default.required(e,t,n,o,s),t&&a.default[l](e,t,n,o,s)}i(o)}Object.defineProperty(t,"__esModule",{value:!0});var o=i(222),a=n(o),r=i(219),l="enum";t.default=s,e.exports=t.default},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}function s(e,t,i,n,s){var o=[],l=e.required||!e.required&&n.hasOwnProperty(e.field);if(l){if((0,r.isEmptyValue)(t,"string")&&!e.required)return i();a.default.required(e,t,n,o,s),(0,r.isEmptyValue)(t,"string")||a.default.pattern(e,t,n,o,s)}i(o)}Object.defineProperty(t,"__esModule",{value:!0});var o=i(222),a=n(o),r=i(219);t.default=s,e.exports=t.default},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}function s(e,t,i,n,s){var o=e.type,l=[],u=e.required||!e.required&&n.hasOwnProperty(e.field);if(u){if((0,r.isEmptyValue)(t,o)&&!e.required)return i();a.default.required(e,t,n,l,s,o),(0,r.isEmptyValue)(t,o)||a.default.type(e,t,n,l,s)}i(l)}Object.defineProperty(t,"__esModule",{value:!0});var o=i(222),a=n(o),r=i(219);t.default=s,e.exports=t.default},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}function s(e,t,i,n,s){var o=[],l=e.required||!e.required&&n.hasOwnProperty(e.field);if(l){if((0,r.isEmptyValue)(t)&&!e.required)return i();a.default.required(e,t,n,o,s),(0,r.isEmptyValue)(t)||(a.default.type(e,t,n,o,s),t&&a.default.range(e,t.getTime(),n,o,s))}i(o)}Object.defineProperty(t,"__esModule",{value:!0});var o=i(222),a=n(o),r=i(219);t.default=s,e.exports=t.default},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}function s(e,t,i,n,s){var a=[],l=Array.isArray(t)?"array":"undefined"==typeof t?"undefined":o(t);r.default.required(e,t,n,a,s,l),i(a)}Object.defineProperty(t,"__esModule",{value:!0});var o="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},a=i(222),r=n(a);t.default=s,e.exports=t.default},function(e,t){"use strict";function i(){return{default:"Validation error on field %s",required:"%s is required",enum:"%s must be one of %s",whitespace:"%s cannot be empty",date:{format:"%s date %s is invalid for format %s",parse:"%s date could not be parsed, %s is invalid ",invalid:"%s date %s is invalid"},types:{string:"%s is not a %s",method:"%s is not a %s (function)",array:"%s is not an %s",object:"%s is not an %s",number:"%s is not a %s",date:"%s is not a %s",boolean:"%s is not a %s",integer:"%s is not an %s",float:"%s is not a %s",regexp:"%s is not a valid %s",email:"%s is not a valid %s",url:"%s is not a valid %s",hex:"%s is not a valid %s"},string:{len:"%s must be exactly %s characters",min:"%s must be at least %s characters",max:"%s cannot be longer than %s characters",range:"%s must be between %s and %s characters"},number:{len:"%s must equal %s",min:"%s cannot be less than %s",max:"%s cannot be greater than %s",range:"%s must be between %s and %s"},array:{len:"%s must be exactly %s in length",min:"%s cannot be less than %s in length",max:"%s cannot be greater than %s in length",range:"%s must be between %s and %s in length"},pattern:{mismatch:"%s value %s does not match pattern %s"},clone:function(){var e=JSON.parse(JSON.stringify(this));return e.clone=this.clone,e}}}Object.defineProperty(t,"__esModule",{value:!0}),t.newMessages=i;t.messages=i()},function(e,t){e.exports={render:function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("div",{staticClass:"el-form-item",class:{"is-error":"error"===e.validateState,"is-validating":"validating"===e.validateState,"is-required":e.isRequired||e.required}},[e.label||e.$slots.label?i("label",{staticClass:"el-form-item__label",style:e.labelStyle,attrs:{for:e.prop}},[e._t("label",[e._v(e._s(e.label+e.form.labelSuffix))])],2):e._e(),i("div",{staticClass:"el-form-item__content",style:e.contentStyle},[e._t("default"),i("transition",{attrs:{name:"el-zoom-in-top"}},["error"===e.validateState&&e.showMessage&&e.form.showMessage?i("div",{staticClass:"el-form-item__error"},[e._v(e._s(e.validateMessage))]):e._e()])],2)])},staticRenderFns:[]}},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0;var s=i(245),o=n(s);o.default.install=function(e){e.component(o.default.name,o.default)},t.default=o.default},function(e,t,i){var n=i(5)(i(246),null,null,null,null);e.exports=n.exports},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0;var s=i(247),o=n(s);t.default={name:"ElTabs",components:{TabNav:o.default},props:{type:String,activeName:String,closable:Boolean,addable:Boolean,value:{},editable:Boolean},data:function(){return{currentName:this.value||this.activeName,panes:[]}},watch:{activeName:function(e){this.setCurrentName(e)},value:function(e){this.setCurrentName(e)},currentName:function(e){var t=this;this.$refs.nav&&this.$nextTick(function(e){t.$refs.nav.scrollToActiveTab()})}},methods:{handleTabClick:function(e,t,i){e.disabled||(this.setCurrentName(t),this.$emit("tab-click",e,i))},handleTabRemove:function(e,t){e.disabled||(t.stopPropagation(),this.$emit("edit",e.name,"remove"),this.$emit("tab-remove",e.name))},handleTabAdd:function(){this.$emit("edit",null,"add"),this.$emit("tab-add")},setCurrentName:function(e){this.currentName=e,this.$emit("input",e)},addPanes:function(e){var t=this.$slots.default.filter(function(e){return 1===e.elm.nodeType&&/\bel-tab-pane\b/.test(e.elm.className)}).indexOf(e.$vnode);this.panes.splice(t,0,e)},removePanes:function(e){var t=this.panes,i=t.indexOf(e);i>-1&&t.splice(i,1)}},render:function(e){var t=this.type,i=this.handleTabClick,n=this.handleTabRemove,s=this.handleTabAdd,o=this.currentName,a=this.panes,r=this.editable,l=this.addable,u=r||l?e("span",{class:"el-tabs__new-tab",on:{click:s}},[e("i",{class:"el-icon-plus"},[])]):null,c={props:{currentName:o,onTabClick:i,onTabRemove:n,editable:r,type:t,panes:a},ref:"nav"};return e("div",{class:{"el-tabs":!0,"el-tabs--card":"card"===t,"el-tabs--border-card":"border-card"===t}},[e("div",{class:"el-tabs__header"},[u,e("tab-nav",c,[])]),e("div",{class:"el-tabs__content"},[this.$slots.default])])},created:function(){this.currentName||this.setCurrentName("0")}}},function(e,t,i){var n=i(5)(i(248),null,null,null,null);e.exports=n.exports},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}function s(){}t.__esModule=!0;var o=i(249),a=n(o),r=i(43);t.default={name:"TabNav",components:{TabBar:a.default},props:{panes:Array,currentName:String,editable:Boolean,onTabClick:{type:Function,default:s},onTabRemove:{type:Function,default:s},type:String},data:function(){return{scrollable:!1,navStyle:{transform:""}}},methods:{scrollPrev:function(){var e=this.$refs.navScroll.offsetWidth,t=this.getCurrentScrollOffset();if(t){var i=t>e?t-e:0;this.setOffset(i)}},scrollNext:function(){var e=this.$refs.nav.offsetWidth,t=this.$refs.navScroll.offsetWidth,i=this.getCurrentScrollOffset();if(!(e-i<=t)){var n=e-i>2*t?i+t:e-t;this.setOffset(n)}},scrollToActiveTab:function(){if(this.scrollable){var e=this.$refs.nav,t=this.$el.querySelector(".is-active"),i=this.$refs.navScroll,n=t.getBoundingClientRect(),s=i.getBoundingClientRect(),o=e.getBoundingClientRect(),a=this.getCurrentScrollOffset(),r=a;n.left<s.left&&(r=a-(s.left-n.left)),n.right>s.right&&(r=a+n.right-s.right),o.right<s.right&&(r=e.offsetWidth-s.width),this.setOffset(Math.max(r,0))}},getCurrentScrollOffset:function(){var e=this.navStyle;return e.transform?Number(e.transform.match(/translateX\(-(\d+(\.\d+)*)px\)/)[1]):0},setOffset:function(e){this.navStyle.transform="translateX(-"+e+"px)"},update:function(){var e=this.$refs.nav.offsetWidth,t=this.$refs.navScroll.offsetWidth,i=this.getCurrentScrollOffset();if(t<e){var n=this.getCurrentScrollOffset();this.scrollable=this.scrollable||{},this.scrollable.prev=n,this.scrollable.next=n+t<e,e-n<t&&this.setOffset(e-t)}else this.scrollable=!1,i>0&&this.setOffset(0)}},updated:function(){this.update()},render:function(e){var t=this.type,i=this.panes,n=this.editable,s=this.onTabClick,o=this.onTabRemove,a=this.navStyle,r=this.scrollable,l=this.scrollNext,u=this.scrollPrev,c=r?[e("span",{class:["el-tabs__nav-prev",r.prev?"":"is-disabled"],on:{click:u}},[e("i",{class:"el-icon-arrow-left"},[])]),e("span",{class:["el-tabs__nav-next",r.next?"":"is-disabled"],on:{click:l}},[e("i",{class:"el-icon-arrow-right"},[])])]:null,d=this._l(i,function(t,i){var a=t.name||t.index||i,r=t.isClosable||n;t.index=""+i;var l=r?e("span",{class:"el-icon-close",on:{click:function(e){o(t,e)}}},[]):null,u=t.$slots.label||t.label;return e("div",{class:{"el-tabs__item":!0,"is-active":t.active,"is-disabled":t.disabled,"is-closable":r},ref:"tabs",refInFor:!0,on:{click:function(e){s(t,a,e)}}},[u,l])});return e("div",{class:["el-tabs__nav-wrap",r?"is-scrollable":""]},[c,e("div",{class:["el-tabs__nav-scroll"],ref:"navScroll"},[e("div",{class:"el-tabs__nav",ref:"nav",style:a},[t?null:e("tab-bar",{attrs:{tabs:i}},[]),d])])])},mounted:function(){(0,r.addResizeListener)(this.$el,this.update)},beforeDestroy:function(){this.$el&&this.update&&(0,r.removeResizeListener)(this.$el,this.update)}}},function(e,t,i){var n=i(5)(i(250),i(251),null,null,null);e.exports=n.exports},function(e,t){"use strict";t.__esModule=!0,t.default={name:"TabBar",props:{tabs:Array},computed:{barStyle:{cache:!1,get:function(){var e=this;if(!this.$parent.$refs.tabs)return{};var t={},i=0,n=0;this.tabs.every(function(t,s){var o=e.$parent.$refs.tabs[s];return!!o&&(t.active?(n=o.clientWidth,!1):(i+=o.clientWidth,!0))});var s="translateX("+i+"px)";return t.width=n+"px",t.transform=s,t.msTransform=s,t.webkitTransform=s,t}}}}},function(e,t){e.exports={render:function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("div",{staticClass:"el-tabs__active-bar",style:e.barStyle})},staticRenderFns:[]}},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0;var s=i(253),o=n(s);o.default.install=function(e){e.component(o.default.name,o.default)},t.default=o.default},function(e,t,i){var n=i(5)(i(254),i(255),null,null,null);e.exports=n.exports},function(e,t){"use strict";t.__esModule=!0,t.default={name:"ElTabPane",componentName:"ElTabPane",props:{label:String,labelContent:Function,name:String,closable:Boolean,disabled:Boolean},data:function(){return{index:null}},computed:{isClosable:function(){return this.closable||this.$parent.closable},active:function(){return this.$parent.currentName===(this.name||this.index)}},mounted:function(){this.$parent.addPanes(this)},destroyed:function(){this.$el&&this.$el.parentNode&&this.$el.parentNode.removeChild(this.$el),this.$parent.removePanes(this)},watch:{label:function(){this.$parent.$forceUpdate()}}}},function(e,t){e.exports={render:function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("div",{directives:[{name:"show",rawName:"v-show",value:e.active,expression:"active"}],staticClass:"el-tab-pane"},[e._t("default")],2)},staticRenderFns:[]}},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0;var s=i(257),o=n(s);o.default.install=function(e){e.component(o.default.name,o.default)},t.default=o.default},function(e,t,i){var n=i(5)(i(258),i(265),null,null,null);e.exports=n.exports},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0;var s=i(259),o=n(s),a=i(13),r=i(11),l=n(r);t.default={name:"ElTree",mixins:[l.default],components:{ElTreeNode:i(262)},data:function(){return{store:null,root:null,currentNode:null}},props:{data:{type:Array},emptyText:{type:String,default:function(){return(0,a.t)("el.tree.emptyText")}},nodeKey:String,checkStrictly:Boolean,defaultExpandAll:Boolean,expandOnClickNode:{type:Boolean,default:!0},autoExpandParent:{type:Boolean,default:!0},defaultCheckedKeys:Array,defaultExpandedKeys:Array,renderContent:Function,showCheckbox:{type:Boolean,default:!1},props:{default:function(){return{children:"children",label:"label",icon:"icon",disabled:"disabled"}}},lazy:{type:Boolean,default:!1},highlightCurrent:Boolean,currentNodeKey:[String,Number],load:Function,filterNodeMethod:Function,accordion:Boolean,indent:{type:Number,default:16}},computed:{children:{set:function(e){this.data=e},get:function(){return this.data}}},watch:{defaultCheckedKeys:function(e){this.store.defaultCheckedKeys=e,this.store.setDefaultCheckedKey(e)},defaultExpandedKeys:function(e){this.store.defaultExpandedKeys=e,this.store.setDefaultExpandedKeys(e)},currentNodeKey:function(e){this.store.setCurrentNodeKey(e),this.store.currentNodeKey=e},data:function(e){this.store.setData(e)}},methods:{filter:function(e){if(!this.filterNodeMethod)throw new Error("[Tree] filterNodeMethod is required when filter");this.store.filter(e)},getNodeKey:function(e,t){var i=this.nodeKey;return i&&e?e.data[i]:t},getCheckedNodes:function(e){return this.store.getCheckedNodes(e)},getCheckedKeys:function(e){return this.store.getCheckedKeys(e)},setCheckedNodes:function(e,t){if(!this.nodeKey)throw new Error("[Tree] nodeKey is required in setCheckedNodes");this.store.setCheckedNodes(e,t)},setCheckedKeys:function(e,t){if(!this.nodeKey)throw new Error("[Tree] nodeKey is required in setCheckedNodes");this.store.setCheckedKeys(e,t)},setChecked:function(e,t,i){this.store.setChecked(e,t,i)},handleNodeExpand:function(e,t,i){this.broadcast("ElTreeNode","tree-node-expand",t),this.$emit("node-expand",e,t,i)}},created:function(){this.isTree=!0,this.store=new o.default({key:this.nodeKey,data:this.data,lazy:this.lazy,props:this.props,load:this.load,currentNodeKey:this.currentNodeKey,checkStrictly:this.checkStrictly,defaultCheckedKeys:this.defaultCheckedKeys,defaultExpandedKeys:this.defaultExpandedKeys,autoExpandParent:this.autoExpandParent,defaultExpandAll:this.defaultExpandAll,filterNodeMethod:this.filterNodeMethod}),this.root=this.store.root}}},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}function s(e,t){
if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}t.__esModule=!0;var o="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},a=i(260),r=n(a),l=i(261),u=function(){function e(t){var i=this;s(this,e),this.currentNode=null,this.currentNodeKey=null;for(var n in t)t.hasOwnProperty(n)&&(this[n]=t[n]);if(this.nodesMap={},this.root=new r.default({data:this.data,store:this}),this.lazy&&this.load){var o=this.load;o(this.root,function(e){i.root.doCreateChildren(e),i._initDefaultCheckedNodes()})}else this._initDefaultCheckedNodes()}return e.prototype.filter=function(e){var t=this.filterNodeMethod,i=function i(n){var s=n.root?n.root.childNodes:n.childNodes;if(s.forEach(function(n){n.visible=t.call(n,e,n.data,n),i(n)}),!n.visible&&s.length){var o=!0;s.forEach(function(e){e.visible&&(o=!1)}),n.root?n.root.visible=o===!1:n.visible=o===!1}n.visible&&!n.isLeaf&&n.expand()};i(this)},e.prototype.setData=function(e){var t=e!==this.root.data;this.root.setData(e),t&&this._initDefaultCheckedNodes()},e.prototype.getNode=function(e){var t="object"!==("undefined"==typeof e?"undefined":o(e))?e:(0,l.getNodeKey)(this.key,e);return this.nodesMap[t]},e.prototype.insertBefore=function(e,t){var i=this.getNode(t);i.parent.insertBefore({data:e},i)},e.prototype.insertAfter=function(e,t){var i=this.getNode(t);i.parent.insertAfter({data:e},i)},e.prototype.remove=function(e){var t=this.getNode(e);t&&t.parent.removeChild(t)},e.prototype.append=function(e,t){var i=t?this.getNode(t):this.root;i&&i.insertChild({data:e})},e.prototype._initDefaultCheckedNodes=function(){var e=this,t=this.defaultCheckedKeys||[],i=this.nodesMap;t.forEach(function(t){var n=i[t];n&&n.setChecked(!0,!e.checkStrictly)})},e.prototype._initDefaultCheckedNode=function(e){var t=this.defaultCheckedKeys||[];t.indexOf(e.key)!==-1&&e.setChecked(!0,!this.checkStrictly)},e.prototype.setDefaultCheckedKey=function(e){e!==this.defaultCheckedKeys&&(this.defaultCheckedKeys=e,this._initDefaultCheckedNodes())},e.prototype.registerNode=function(e){var t=this.key;if(t&&e&&e.data){var i=e.key;void 0!==i&&(this.nodesMap[e.key]=e)}},e.prototype.deregisterNode=function(e){var t=this.key;t&&e&&e.data&&delete this.nodesMap[e.key]},e.prototype.getCheckedNodes=function(){var e=arguments.length>0&&void 0!==arguments[0]&&arguments[0],t=[],i=function i(n){var s=n.root?n.root.childNodes:n.childNodes;s.forEach(function(n){(!e&&n.checked||e&&n.isLeaf&&n.checked)&&t.push(n.data),i(n)})};return i(this),t},e.prototype.getCheckedKeys=function(){var e=arguments.length>0&&void 0!==arguments[0]&&arguments[0],t=this.key,i=this._getAllNodes(),n=[];return i.forEach(function(i){(!e||e&&i.isLeaf)&&i.checked&&n.push((i.data||{})[t])}),n},e.prototype._getAllNodes=function(){var e=[],t=this.nodesMap;for(var i in t)t.hasOwnProperty(i)&&e.push(t[i]);return e},e.prototype._setCheckedKeys=function(e){var t=arguments.length>1&&void 0!==arguments[1]&&arguments[1],i=arguments[2],n=this._getAllNodes().sort(function(e,t){return t.level-e.level}),s=Object.create(null),o=Object.keys(i);n.forEach(function(e){return e.setChecked(!1,!1)});for(var a=0,r=n.length;a<r;a++){var l=n[a],u=l.data[e].toString(),c=o.indexOf(u)>-1;if(c){for(var d=l.parent;d&&d.level>0;)s[d.data[e]]=!0,d=d.parent;l.isLeaf||this.checkStrictly?l.setChecked(!0,!1):(l.setChecked(!0,!0),t&&!function(){l.setChecked(!1,!1);var e=function e(t){var i=t.childNodes;i.forEach(function(t){t.isLeaf||t.setChecked(!1,!1),e(t)})};e(l)}())}else l.checked&&!s[u]&&l.setChecked(!1,!1)}},e.prototype.setCheckedNodes=function(e){var t=arguments.length>1&&void 0!==arguments[1]&&arguments[1],i=this.key,n={};e.forEach(function(e){n[(e||{})[i]]=!0}),this._setCheckedKeys(i,t,n)},e.prototype.setCheckedKeys=function(e){var t=arguments.length>1&&void 0!==arguments[1]&&arguments[1];this.defaultCheckedKeys=e;var i=this.key,n={};e.forEach(function(e){n[e]=!0}),this._setCheckedKeys(i,t,n)},e.prototype.setDefaultExpandedKeys=function(e){var t=this;e=e||[],this.defaultExpandedKeys=e,e.forEach(function(e){var i=t.getNode(e);i&&i.expand(null,t.autoExpandParent)})},e.prototype.setChecked=function(e,t,i){var n=this.getNode(e);n&&n.setChecked(!!t,i)},e.prototype.getCurrentNode=function(){return this.currentNode},e.prototype.setCurrentNode=function(e){this.currentNode=e},e.prototype.setCurrentNodeKey=function(e){var t=this.getNode(e);t&&(this.currentNode=t)},e}();t.default=u},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}function s(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}t.__esModule=!0,t.getChildState=void 0;var o=function(){function e(e,t){for(var i=0;i<t.length;i++){var n=t[i];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(t,i,n){return i&&e(t.prototype,i),n&&e(t,n),t}}(),a=i(23),r=n(a),l=i(261),u=t.getChildState=function(e){for(var t=!0,i=!0,n=!0,s=0,o=e.length;s<o;s++){var a=e[s];(a.checked!==!0||a.indeterminate)&&(t=!1,a.disabled||(n=!1)),(a.checked!==!1||a.indeterminate)&&(i=!1)}return{all:t,none:i,allWithoutDisable:n,half:!t&&!i}},c=function e(t){var i=u(t.childNodes),n=i.all,s=i.none,o=i.half;n?(t.checked=!0,t.indeterminate=!1):o?(t.checked=!1,t.indeterminate=!0):s&&(t.checked=!1,t.indeterminate=!1);var a=t.parent;a&&0!==a.level&&(t.store.checkStrictly||e(a))},d=function(e){var t=e.childNodes;if(e.checked)for(var i=0,n=t.length;i<n;i++){var s=t[i];s.disabled||(s.checked=!0)}var o=e.parent;o&&0!==o.level&&c(o)},h=function(e,t){var i=e.store.props,n=e.data||{},s=i[t];return"function"==typeof s?s(n,e):"string"==typeof s?n[s]:"undefined"==typeof s?"":void 0},f=0,p=function(){function e(t){s(this,e),this.id=f++,this.text=null,this.checked=!1,this.indeterminate=!1,this.data=null,this.expanded=!1,this.parent=null,this.visible=!0;for(var i in t)t.hasOwnProperty(i)&&(this[i]=t[i]);this.level=0,this.loaded=!1,this.childNodes=[],this.loading=!1,this.parent&&(this.level=this.parent.level+1);var n=this.store;if(!n)throw new Error("[Node]store is required!");n.registerNode(this);var o=n.props;if(o&&"undefined"!=typeof o.isLeaf){var a=h(this,"isLeaf");"boolean"==typeof a&&(this.isLeafByUser=a)}if(n.lazy!==!0&&this.data?(this.setData(this.data),n.defaultExpandAll&&(this.expanded=!0)):this.level>0&&n.lazy&&n.defaultExpandAll&&this.expand(),this.data){var r=n.defaultExpandedKeys,l=n.key;l&&r&&r.indexOf(this.key)!==-1&&this.expand(null,n.autoExpandParent),l&&n.currentNodeKey&&this.key===n.currentNodeKey&&(n.currentNode=this),n.lazy&&n._initDefaultCheckedNode(this),this.updateLeafState()}}return e.prototype.setData=function(e){Array.isArray(e)||(0,l.markNodeData)(this,e),this.data=e,this.childNodes=[];var t=void 0;t=0===this.level&&this.data instanceof Array?this.data:h(this,"children")||[];for(var i=0,n=t.length;i<n;i++)this.insertChild({data:t[i]})},e.prototype.insertChild=function(t,i){if(!t)throw new Error("insertChild error: child is required.");t instanceof e||((0,r.default)(t,{parent:this,store:this.store}),t=new e(t)),t.level=this.level+1,"undefined"==typeof i||i<0?this.childNodes.push(t):this.childNodes.splice(i,0,t),this.updateLeafState()},e.prototype.insertBefore=function(e,t){var i=void 0;t&&(i=this.childNodes.indexOf(t)),this.insertChild(e,i)},e.prototype.insertAfter=function(e,t){var i=void 0;t&&(i=this.childNodes.indexOf(t),i!==-1&&(i+=1)),this.insertChild(e,i)},e.prototype.removeChild=function(e){var t=this.childNodes.indexOf(e);t>-1&&(this.store&&this.store.deregisterNode(e),e.parent=null,this.childNodes.splice(t,1)),this.updateLeafState()},e.prototype.removeChildByData=function(e){var t=null;this.childNodes.forEach(function(i){i.data===e&&(t=i)}),t&&this.removeChild(t)},e.prototype.expand=function(e,t){var i=this,n=function(){if(t)for(var n=i.parent;n.level>0;)n.expanded=!0,n=n.parent;i.expanded=!0,e&&e()};this.shouldLoadData()?this.loadData(function(e){e instanceof Array&&(d(i),n())}):n()},e.prototype.doCreateChildren=function(e){var t=this,i=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};e.forEach(function(e){t.insertChild((0,r.default)({data:e},i))})},e.prototype.collapse=function(){this.expanded=!1},e.prototype.shouldLoadData=function(){return this.store.lazy===!0&&this.store.load&&!this.loaded},e.prototype.updateLeafState=function(){if(this.store.lazy===!0&&this.loaded!==!0&&"undefined"!=typeof this.isLeafByUser)return void(this.isLeaf=this.isLeafByUser);var e=this.childNodes;return!this.store.lazy||this.store.lazy===!0&&this.loaded===!0?void(this.isLeaf=!e||0===e.length):void(this.isLeaf=!1)},e.prototype.setChecked=function(e,t,i,n){var s=this;this.indeterminate="half"===e,this.checked=e===!0;var o=u(this.childNodes),a=o.all,r=o.allWithoutDisable;this.childNodes.length&&!a&&r&&(this.checked=!1,e=!1);var l=function(i){if(t&&!i){for(var o=s.childNodes,a=0,r=o.length;a<r;a++){var l=o[a];n=n||e!==!1;var c=l.disabled?l.checked:n;l.setChecked(c,t,!0,n)}var d=u(o),h=d.half,f=d.all;f||(s.checked=f,s.indeterminate=h)}};!this.store.checkStrictly&&this.shouldLoadData()?this.loadData(function(){l(!0)},{checked:e!==!1}):l();var d=this.parent;d&&0!==d.level&&(this.store.checkStrictly||i||c(d))},e.prototype.getChildren=function(){var e=this.data;if(!e)return null;var t=this.store.props,i="children";return t&&(i=t.children||"children"),void 0===e[i]&&(e[i]=null),e[i]},e.prototype.updateChildren=function(){var e=this,t=this.getChildren()||[],i=this.childNodes.map(function(e){return e.data}),n={},s=[];t.forEach(function(e,t){e[l.NODE_KEY]?n[e[l.NODE_KEY]]={index:t,data:e}:s.push({index:t,data:e})}),i.forEach(function(t){n[t[l.NODE_KEY]]||e.removeChildByData(t)}),s.forEach(function(t){var i=t.index,n=t.data;e.insertChild({data:n},i)}),this.updateLeafState()},e.prototype.loadData=function(e){var t=this,i=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};if(this.store.lazy!==!0||!this.store.load||this.loaded||this.loading&&!Object.keys(i).length)e&&e.call(this);else{this.loading=!0;var n=function(n){t.loaded=!0,t.loading=!1,t.childNodes=[],t.doCreateChildren(n,i),t.updateLeafState(),e&&e.call(t,n)};this.store.load(this,n)}},o(e,[{key:"label",get:function(){return h(this,"label")}},{key:"icon",get:function(){return h(this,"icon")}},{key:"key",get:function(){var e=this.store.key;return this.data?this.data[e]:null}},{key:"disabled",get:function(){return h(this,"disabled")}}]),e}();t.default=p},function(e,t){"use strict";t.__esModule=!0;var i=t.NODE_KEY="$treeNodeId";t.markNodeData=function(e,t){t[i]||Object.defineProperty(t,i,{value:e.id,enumerable:!1,configurable:!1,writable:!1})},t.getNodeKey=function(e,t){return e?t[e]:t[i]}},function(e,t,i){var n=i(5)(i(263),i(264),null,null,null);e.exports=n.exports},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0;var s=i(89),o=n(s),a=i(116),r=n(a),l=i(11),u=n(l);t.default={name:"ElTreeNode",componentName:"ElTreeNode",mixins:[u.default],props:{node:{default:function(){return{}}},props:{},renderContent:Function},components:{ElCollapseTransition:o.default,ElCheckbox:r.default,NodeContent:{props:{node:{required:!0}},render:function(e){var t=this.$parent,i=this.node,n=i.data,s=i.store;return t.renderContent?t.renderContent.call(t._renderProxy,e,{_self:t.tree.$vnode.context,node:i,data:n,store:s}):e("span",{class:"el-tree-node__label"},[this.node.label])}}},data:function(){return{tree:null,expanded:!1,childNodeRendered:!1,showCheckbox:!1,oldChecked:null,oldIndeterminate:null}},watch:{"node.indeterminate":function(e){this.handleSelectChange(this.node.checked,e)},"node.checked":function(e){this.handleSelectChange(e,this.node.indeterminate)},"node.expanded":function(e){this.expanded=e,e&&(this.childNodeRendered=!0)}},methods:{getNodeKey:function(e,t){var i=this.tree.nodeKey;return i&&e?e.data[i]:t},handleSelectChange:function(e,t){this.oldChecked!==e&&this.oldIndeterminate!==t&&this.tree.$emit("check-change",this.node.data,e,t),this.oldChecked=e,this.indeterminate=t},handleClick:function(){var e=this.tree.store;e.setCurrentNode(this.node),this.tree.$emit("current-change",e.currentNode?e.currentNode.data:null,e.currentNode),this.tree.currentNode=this,this.tree.expandOnClickNode&&this.handleExpandIconClick(),this.tree.$emit("node-click",this.node.data,this.node,this)},handleExpandIconClick:function(){this.node.isLeaf||(this.expanded?(this.tree.$emit("node-collapse",this.node.data,this.node,this),this.node.collapse()):(this.node.expand(),this.$emit("node-expand",this.node.data,this.node,this)))},handleCheckChange:function(e){this.node.setChecked(e.target.checked,!this.tree.checkStrictly)},handleChildNodeExpand:function(e,t,i){this.broadcast("ElTreeNode","tree-node-expand",t),this.tree.$emit("node-expand",e,t,i)}},created:function(){var e=this,t=this.$parent;t.isTree?this.tree=t:this.tree=t.tree;var i=this.tree;i||console.warn("Can not find node's tree.");var n=i.props||{},s=n.children||"children";this.$watch("node.data."+s,function(){e.node.updateChildren()}),this.showCheckbox=i.showCheckbox,this.node.expanded&&(this.expanded=!0,this.childNodeRendered=!0),this.tree.accordion&&this.$on("tree-node-expand",function(t){e.node!==t&&e.node.collapse()})}}},function(e,t){e.exports={render:function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("div",{directives:[{name:"show",rawName:"v-show",value:e.node.visible,expression:"node.visible"}],staticClass:"el-tree-node",class:{"is-expanded":e.childNodeRendered&&e.expanded,"is-current":e.tree.store.currentNode===e.node,"is-hidden":!e.node.visible},on:{click:function(t){t.stopPropagation(),e.handleClick(t)}}},[i("div",{staticClass:"el-tree-node__content",style:{"padding-left":(e.node.level-1)*e.tree.indent+"px"}},[i("span",{staticClass:"el-tree-node__expand-icon",class:{"is-leaf":e.node.isLeaf,expanded:!e.node.isLeaf&&e.expanded},on:{click:function(t){t.stopPropagation(),e.handleExpandIconClick(t)}}}),e.showCheckbox?i("el-checkbox",{attrs:{indeterminate:e.node.indeterminate,disabled:!!e.node.disabled},on:{change:e.handleCheckChange},nativeOn:{click:function(e){e.stopPropagation()}},model:{value:e.node.checked,callback:function(t){e.node.checked=t},expression:"node.checked"}}):e._e(),e.node.loading?i("span",{staticClass:"el-tree-node__loading-icon el-icon-loading"}):e._e(),i("node-content",{attrs:{node:e.node}})],1),i("el-collapse-transition",[i("div",{directives:[{name:"show",rawName:"v-show",value:e.expanded,expression:"expanded"}],staticClass:"el-tree-node__children"},e._l(e.node.childNodes,function(t){return i("el-tree-node",{key:e.getNodeKey(t),attrs:{"render-content":e.renderContent,node:t},on:{"node-expand":e.handleChildNodeExpand}})}))])],1)},staticRenderFns:[]}},function(e,t){e.exports={render:function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("div",{staticClass:"el-tree",class:{"el-tree--highlight-current":e.highlightCurrent}},[e._l(e.root.childNodes,function(t){return i("el-tree-node",{key:e.getNodeKey(t),attrs:{node:t,props:e.props,"render-content":e.renderContent},on:{"node-expand":e.handleNodeExpand}})}),e.root.childNodes&&0!==e.root.childNodes.length?e._e():i("div",{staticClass:"el-tree__empty-block"},[i("span",{staticClass:"el-tree__empty-text"},[e._v(e._s(e.emptyText))])])],2)},staticRenderFns:[]}},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0;var s=i(267),o=n(s);o.default.install=function(e){e.component(o.default.name,o.default)},t.default=o.default},function(e,t,i){var n=i(5)(i(268),i(269),null,null,null);e.exports=n.exports},function(e,t){"use strict";t.__esModule=!0;var i={success:"el-icon-circle-check",warning:"el-icon-warning",error:"el-icon-circle-cross"};t.default={name:"ElAlert",props:{title:{type:String,default:"",required:!0},description:{type:String,default:""},type:{type:String,default:"info"},closable:{type:Boolean,default:!0},closeText:{type:String,default:""},showIcon:{type:Boolean,default:!1}},data:function(){return{visible:!0}},methods:{close:function(){this.visible=!1,this.$emit("close")}},computed:{typeClass:function(){return"el-alert--"+this.type},iconClass:function(){return i[this.type]||"el-icon-information"},isBigIcon:function(){return this.description||this.$slots.default?"is-big":""},isBoldTitle:function(){return this.description||this.$slots.default?"is-bold":""}}}},function(e,t){e.exports={render:function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("transition",{attrs:{name:"el-alert-fade"}},[i("div",{directives:[{name:"show",rawName:"v-show",value:e.visible,expression:"visible"}],staticClass:"el-alert",class:[e.typeClass]},[e.showIcon?i("i",{staticClass:"el-alert__icon",class:[e.iconClass,e.isBigIcon]}):e._e(),i("div",{staticClass:"el-alert__content"},[e.title?i("span",{staticClass:"el-alert__title",class:[e.isBoldTitle]},[e._v(e._s(e.title))]):e._e(),e._t("default",[e.description?i("p",{staticClass:"el-alert__description"},[e._v(e._s(e.description))]):e._e()]),i("i",{directives:[{name:"show",rawName:"v-show",value:e.closable,expression:"closable"}],staticClass:"el-alert__closebtn",class:{"is-customed":""!==e.closeText,"el-icon-close":""===e.closeText},on:{click:function(t){e.close()}}},[e._v(e._s(e.closeText))])],2)])])},staticRenderFns:[]}},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0;var s=i(271),o=n(s);t.default=o.default},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0;var s=i(15),o=n(s),a=i(28),r=i(145),l=o.default.extend(i(272)),u=void 0,c=[],d=1,h=function e(t){if(!o.default.prototype.$isServer){t=t||{};var i=t.onClose,n="notification_"+d++;t.onClose=function(){e.close(n,i)},u=new l({data:t}),(0,r.isVNode)(t.message)&&(u.$slots.default=[t.message],t.message=""),u.id=n,u.vm=u.$mount(),document.body.appendChild(u.vm.$el),u.vm.visible=!0,u.dom=u.vm.$el,u.dom.style.zIndex=a.PopupManager.nextZIndex();for(var s=t.offset||0,h=s,f=0,p=c.length;f<p;f++)h+=c[f].$el.offsetHeight+16;return h+=16,u.top=h,c.push(u),u.vm}};["success","warning","info","error"].forEach(function(e){h[e]=function(t){return("string"==typeof t||(0,r.isVNode)(t))&&(t={message:t}),t.type=e,h(t)}}),h.close=function(e,t){for(var i=void 0,n=void 0,s=0,o=c.length;s<o;s++)if(e===c[s].id){"function"==typeof t&&t(c[s]),i=s,n=c[s].dom.offsetHeight,c.splice(s,1);break}if(o>1)for(s=i;s<o-1;s++)c[s].dom.style.top=parseInt(c[s].dom.style.top,10)-n-16+"px"},t.default=h},function(e,t,i){var n=i(5)(i(273),i(274),null,null,null);e.exports=n.exports},function(e,t){"use strict";t.__esModule=!0;var i={success:"circle-check",info:"information",warning:"warning",error:"circle-cross"};t.default={data:function(){return{visible:!1,title:"",message:"",duration:4500,type:"",customClass:"",iconClass:"",onClose:null,onClick:null,closed:!1,top:null,timer:null}},computed:{typeClass:function(){return this.type&&i[this.type]?"el-icon-"+i[this.type]:""}},watch:{closed:function(e){e&&(this.visible=!1,this.$el.addEventListener("transitionend",this.destroyElement))}},methods:{destroyElement:function(){this.$el.removeEventListener("transitionend",this.destroyElement),this.$destroy(!0),this.$el.parentNode.removeChild(this.$el)},click:function(){"function"==typeof this.onClick&&this.onClick()},close:function(){this.closed=!0,"function"==typeof this.onClose&&this.onClose()},clearTimer:function(){clearTimeout(this.timer)},startTimer:function(){var e=this;this.duration>0&&(this.timer=setTimeout(function(){e.closed||e.close()},this.duration))}},mounted:function(){var e=this;this.duration>0&&(this.timer=setTimeout(function(){e.closed||e.close()},this.duration))}}},function(e,t){e.exports={render:function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("transition",{attrs:{name:"el-notification-fade"}},[i("div",{directives:[{name:"show",rawName:"v-show",value:e.visible,expression:"visible"}],staticClass:"el-notification",class:e.customClass,style:{top:e.top?e.top+"px":"auto"},on:{mouseenter:function(t){e.clearTimer()},mouseleave:function(t){e.startTimer()},click:e.click}},[e.type||e.iconClass?i("i",{staticClass:"el-notification__icon",class:[e.typeClass,e.iconClass]}):e._e(),i("div",{staticClass:"el-notification__group",class:{"is-with-icon":e.typeClass||e.iconClass}},[i("h2",{staticClass:"el-notification__title",domProps:{textContent:e._s(e.title)}}),i("div",{staticClass:"el-notification__content"},[e._t("default",[e._v(e._s(e.message))])],2),i("div",{staticClass:"el-notification__closeBtn el-icon-close",on:{click:function(t){t.stopPropagation(),e.close(t)}}})])])])},staticRenderFns:[]}},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0;var s=i(276),o=n(s);o.default.install=function(e){e.component(o.default.name,o.default)},t.default=o.default},function(e,t,i){var n=i(5)(i(277),i(281),null,null,null);e.exports=n.exports},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0;var s=i(100),o=n(s),a=i(278),r=n(a),l=i(11),u=n(l);t.default={name:"ElSlider",mixins:[u.default],props:{min:{type:Number,default:0},max:{type:Number,default:100},step:{type:Number,default:1},value:{type:[Number,Array],default:0},showInput:{type:Boolean,default:!1},showInputControls:{type:Boolean,default:!0},showStops:{type:Boolean,default:!1},showTooltip:{type:Boolean,default:!0},formatTooltip:Function,disabled:{type:Boolean,default:!1},range:{type:Boolean,default:!1},vertical:{type:Boolean,default:!1},height:{type:String},debounce:{type:Number,default:300}},components:{ElInputNumber:o.default,SliderButton:r.default},data:function(){return{firstValue:null,secondValue:null,oldValue:null,dragging:!1,sliderSize:1}},watch:{value:function(e,t){this.dragging||Array.isArray(e)&&Array.isArray(t)&&e.every(function(e,i){return e===t[i]})||this.setValues()},dragging:function(e){e||this.setValues()},firstValue:function(e){this.range?this.$emit("input",[this.minValue,this.maxValue]):this.$emit("input",e)},secondValue:function(){this.range&&this.$emit("input",[this.minValue,this.maxValue])},min:function(){this.setValues()},max:function(){this.setValues()}},methods:{valueChanged:function(){var e=this;return this.range?![this.minValue,this.maxValue].every(function(t,i){return t===e.oldValue[i]}):this.value!==this.oldValue},setValues:function(){var e=this.value;this.range&&Array.isArray(e)?e[1]<this.min?this.$emit("input",[this.min,this.min]):e[0]>this.max?this.$emit("input",[this.max,this.max]):e[0]<this.min?this.$emit("input",[this.min,e[1]]):e[1]>this.max?this.$emit("input",[e[0],this.max]):(this.firstValue=e[0],this.secondValue=e[1],this.valueChanged()&&(this.$emit("change",[this.minValue,this.maxValue]),this.dispatch("ElFormItem","el.form.change",[this.minValue,this.maxValue]),this.oldValue=e.slice())):this.range||"number"!=typeof e||isNaN(e)||(e<this.min?this.$emit("input",this.min):e>this.max?this.$emit("input",this.max):(this.firstValue=e,this.valueChanged()&&(this.$emit("change",e),this.dispatch("ElFormItem","el.form.change",e),this.oldValue=e)))},setPosition:function(e){var t=this.min+e*(this.max-this.min)/100;if(!this.range)return void this.$refs.button1.setPosition(e);var i=void 0;i=Math.abs(this.minValue-t)<Math.abs(this.maxValue-t)?this.firstValue<this.secondValue?"button1":"button2":this.firstValue>this.secondValue?"button1":"button2",this.$refs[i].setPosition(e)},onSliderClick:function(e){if(!this.disabled&&!this.dragging)if(this.resetSize(),this.vertical){var t=this.$refs.slider.getBoundingClientRect().bottom;this.setPosition((t-e.clientY)/this.sliderSize*100)}else{var i=this.$refs.slider.getBoundingClientRect().left;this.setPosition((e.clientX-i)/this.sliderSize*100)}},resetSize:function(){this.$refs.slider&&(this.sliderSize=this.$refs.slider["client"+(this.vertical?"Height":"Width")])}},computed:{stops:function(){var e=this;if(0===this.step)return[];for(var t=(this.max-this.min)/this.step,i=100*this.step/(this.max-this.min),n=[],s=1;s<t;s++)n.push(s*i);return this.range?n.filter(function(t){return t<100*(e.minValue-e.min)/(e.max-e.min)||t>100*(e.maxValue-e.min)/(e.max-e.min)}):n.filter(function(t){return t>100*(e.firstValue-e.min)/(e.max-e.min)})},minValue:function(){return Math.min(this.firstValue,this.secondValue)},maxValue:function(){return Math.max(this.firstValue,this.secondValue)},barSize:function(){return this.range?100*(this.maxValue-this.minValue)/(this.max-this.min)+"%":100*(this.firstValue-this.min)/(this.max-this.min)+"%"},barStart:function(){return this.range?100*(this.minValue-this.min)/(this.max-this.min)+"%":"0%"},precision:function(){var e=[this.min,this.max,this.step].map(function(e){var t=(""+e).split(".")[1];return t?t.length:0});return Math.max.apply(null,e)},runwayStyle:function(){return this.vertical?{height:this.height}:{}},barStyle:function(){return this.vertical?{height:this.barSize,bottom:this.barStart}:{width:this.barSize,left:this.barStart}}},mounted:function(){this.range?(Array.isArray(this.value)?(this.firstValue=Math.max(this.min,this.value[0]),this.secondValue=Math.min(this.max,this.value[1])):(this.firstValue=this.min,this.secondValue=this.max),this.oldValue=[this.firstValue,this.secondValue]):("number"!=typeof this.value||isNaN(this.value)?this.firstValue=this.min:this.firstValue=Math.min(this.max,Math.max(this.min,this.value)),this.oldValue=this.firstValue),this.resetSize(),window.addEventListener("resize",this.resetSize)},beforeDestroy:function(){window.removeEventListener("resize",this.resetSize)}}},function(e,t,i){var n=i(5)(i(279),i(280),null,null,null);e.exports=n.exports},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0;var s=i(143),o=n(s);t.default={name:"ElSliderButton",components:{ElTooltip:o.default},props:{value:{type:Number,default:0},vertical:{type:Boolean,default:!1}},data:function(){return{hovering:!1,dragging:!1,startX:0,currentX:0,startY:0,currentY:0,startPosition:0,newPosition:null,oldValue:this.value}},computed:{disabled:function(){return this.$parent.disabled},max:function(){return this.$parent.max},min:function(){return this.$parent.min},step:function(){return this.$parent.step},showTooltip:function(){return this.$parent.showTooltip},precision:function(){return this.$parent.precision},currentPosition:function(){return(this.value-this.min)/(this.max-this.min)*100+"%"},enableFormat:function(){return this.$parent.formatTooltip instanceof Function},formatValue:function(){return this.enableFormat&&this.$parent.formatTooltip(this.value)||this.value},wrapperStyle:function(){return this.vertical?{bottom:this.currentPosition}:{left:this.currentPosition}}},watch:{dragging:function(e){this.$parent.dragging=e}},methods:{displayTooltip:function(){this.$refs.tooltip&&(this.$refs.tooltip.showPopper=!0)},hideTooltip:function(){this.$refs.tooltip&&(this.$refs.tooltip.showPopper=!1)},handleMouseEnter:function(){this.hovering=!0,this.displayTooltip()},handleMouseLeave:function(){this.hovering=!1,this.hideTooltip()},onButtonDown:function(e){this.disabled||(e.preventDefault(),this.onDragStart(e),window.addEventListener("mousemove",this.onDragging),window.addEventListener("mouseup",this.onDragEnd),window.addEventListener("contextmenu",this.onDragEnd))},onDragStart:function(e){this.dragging=!0,this.vertical?this.startY=e.clientY:this.startX=e.clientX,this.startPosition=parseFloat(this.currentPosition)},onDragging:function(e){if(this.dragging){this.displayTooltip(),this.$parent.resetSize();var t=0;this.vertical?(this.currentY=e.clientY,t=(this.startY-this.currentY)/this.$parent.sliderSize*100):(this.currentX=e.clientX,t=(this.currentX-this.startX)/this.$parent.sliderSize*100),this.newPosition=this.startPosition+t,this.setPosition(this.newPosition)}},onDragEnd:function(){var e=this;this.dragging&&(setTimeout(function(){e.dragging=!1,e.hideTooltip(),e.setPosition(e.newPosition)},0),window.removeEventListener("mousemove",this.onDragging),window.removeEventListener("mouseup",this.onDragEnd),window.removeEventListener("contextmenu",this.onDragEnd))},setPosition:function(e){if(null!==e){e<0?e=0:e>100&&(e=100);var t=100/((this.max-this.min)/this.step),i=Math.round(e/t),n=i*t*(this.max-this.min)*.01+this.min;n=parseFloat(n.toFixed(this.precision)),this.$emit("input",n),this.$refs.tooltip&&this.$refs.tooltip.updatePopper(),this.dragging||this.value===this.oldValue||(this.oldValue=this.value)}}}}},function(e,t){e.exports={render:function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("div",{ref:"button",staticClass:"el-slider__button-wrapper",class:{hover:e.hovering,dragging:e.dragging},style:e.wrapperStyle,on:{mouseenter:e.handleMouseEnter,mouseleave:e.handleMouseLeave,mousedown:e.onButtonDown}},[i("el-tooltip",{ref:"tooltip",attrs:{placement:"top",disabled:!e.showTooltip}},[i("span",{slot:"content"},[e._v(e._s(e.formatValue))]),i("div",{staticClass:"el-slider__button",class:{hover:e.hovering,dragging:e.dragging}})])],1)},staticRenderFns:[]}},function(e,t){e.exports={render:function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("div",{staticClass:"el-slider",class:{"is-vertical":e.vertical,"el-slider--with-input":e.showInput}},[e.showInput&&!e.range?i("el-input-number",{ref:"input",staticClass:"el-slider__input",attrs:{step:e.step,disabled:e.disabled,controls:e.showInputControls,min:e.min,max:e.max,debounce:e.debounce,size:"small"},model:{value:e.firstValue,callback:function(t){e.firstValue=t},expression:"firstValue"}}):e._e(),i("div",{ref:"slider",staticClass:"el-slider__runway",class:{"show-input":e.showInput,disabled:e.disabled},style:e.runwayStyle,on:{click:e.onSliderClick}},[i("div",{staticClass:"el-slider__bar",style:e.barStyle}),i("slider-button",{ref:"button1",attrs:{vertical:e.vertical},model:{value:e.firstValue,callback:function(t){e.firstValue=t},expression:"firstValue"}}),e.range?i("slider-button",{ref:"button2",attrs:{vertical:e.vertical},model:{value:e.secondValue,callback:function(t){e.secondValue=t},expression:"secondValue"}}):e._e(),e._l(e.stops,function(t){return e.showStops?i("div",{staticClass:"el-slider__stop",style:e.vertical?{bottom:t+"%"}:{left:t+"%"}}):e._e()})],2)],1)},staticRenderFns:[]}},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0;var s=i(283),o=n(s),a=i(287),r=n(a);t.default={install:function(e){e.use(o.default),e.prototype.$loading=r.default},directive:o.default,service:r.default}},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}var s=i(15),o=n(s),a=i(30),r=o.default.extend(i(284));t.install=function(e){if(!e.prototype.$isServer){var t=function(t,n){n.value?e.nextTick(function(){n.modifiers.fullscreen?(t.originalPosition=(0,a.getStyle)(document.body,"position"),t.originalOverflow=(0,a.getStyle)(document.body,"overflow"),(0,a.addClass)(t.mask,"is-fullscreen"),i(document.body,t,n)):((0,a.removeClass)(t.mask,"is-fullscreen"),n.modifiers.body?(t.originalPosition=(0,a.getStyle)(document.body,"position"),["top","left"].forEach(function(e){var i="top"===e?"scrollTop":"scrollLeft";t.maskStyle[e]=t.getBoundingClientRect()[e]+document.body[i]+document.documentElement[i]+"px"}),["height","width"].forEach(function(e){t.maskStyle[e]=t.getBoundingClientRect()[e]+"px"}),i(document.body,t,n)):(t.originalPosition=(0,a.getStyle)(t,"position"),i(t,t,n)))}):t.domVisible&&(t.instance.$on("after-leave",function(e){t.domVisible=!1,n.modifiers.fullscreen&&"hidden"!==t.originalOverflow&&(document.body.style.overflow=t.originalOverflow),n.modifiers.fullscreen||n.modifiers.body?document.body.style.position=t.originalPosition:t.style.position=t.originalPosition}),t.instance.visible=!1)},i=function(t,i,n){i.domVisible||"none"===(0,a.getStyle)(i,"display")||"hidden"===(0,a.getStyle)(i,"visibility")||(Object.keys(i.maskStyle).forEach(function(e){i.mask.style[e]=i.maskStyle[e]}),"absolute"!==i.originalPosition&&"fixed"!==i.originalPosition&&(t.style.position="relative"),
n.modifiers.fullscreen&&n.modifiers.lock&&(t.style.overflow="hidden"),i.domVisible=!0,t.appendChild(i.mask),e.nextTick(function(){i.instance.visible=!0}),i.domInserted=!0)};e.directive("loading",{bind:function(e,i){var n=new r({el:document.createElement("div"),data:{text:e.getAttribute("element-loading-text"),fullscreen:!!i.modifiers.fullscreen}});e.instance=n,e.mask=n.$el,e.maskStyle={},t(e,i)},update:function(e,i){e.instance.setText(e.getAttribute("element-loading-text")),i.oldValue!==i.value&&t(e,i)},unbind:function(e,t){e.domInserted&&(t.modifiers.fullscreen||t.modifiers.body?document.body.removeChild(e.mask):e.mask&&e.mask.parentNode&&e.mask.parentNode.removeChild(e.mask))}})}}},function(e,t,i){var n=i(5)(i(285),i(286),null,null,null);e.exports=n.exports},function(e,t){"use strict";t.__esModule=!0,t.default={data:function(){return{text:null,fullscreen:!0,visible:!1,customClass:""}},methods:{handleAfterLeave:function(){this.$emit("after-leave")},setText:function(e){this.text=e}}}},function(e,t){e.exports={render:function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("transition",{attrs:{name:"el-loading-fade"},on:{"after-leave":e.handleAfterLeave}},[i("div",{directives:[{name:"show",rawName:"v-show",value:e.visible,expression:"visible"}],staticClass:"el-loading-mask",class:[e.customClass,{"is-fullscreen":e.fullscreen}]},[i("div",{staticClass:"el-loading-spinner"},[i("svg",{staticClass:"circular",attrs:{viewBox:"25 25 50 50"}},[i("circle",{staticClass:"path",attrs:{cx:"50",cy:"50",r:"20",fill:"none"}})]),e.text?i("p",{staticClass:"el-loading-text"},[e._v(e._s(e.text))]):e._e()])])])},staticRenderFns:[]}},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0;var s=i(15),o=n(s),a=i(284),r=n(a),l=i(30),u=i(23),c=n(u),d=o.default.extend(r.default),h={text:null,fullscreen:!0,body:!1,lock:!1,customClass:""},f=void 0;d.prototype.originalPosition="",d.prototype.originalOverflow="",d.prototype.close=function(){var e=this;this.fullscreen&&"hidden"!==this.originalOverflow&&(document.body.style.overflow=this.originalOverflow),this.fullscreen||this.body?document.body.style.position=this.originalPosition:this.target.style.position=this.originalPosition,this.fullscreen&&(f=void 0),this.$on("after-leave",function(t){e.$el&&e.$el.parentNode&&e.$el.parentNode.removeChild(e.$el),e.$destroy()}),this.visible=!1};var p=function(e,t,i){var n={};e.fullscreen?(i.originalPosition=(0,l.getStyle)(document.body,"position"),i.originalOverflow=(0,l.getStyle)(document.body,"overflow")):e.body?(i.originalPosition=(0,l.getStyle)(document.body,"position"),["top","left"].forEach(function(t){var i="top"===t?"scrollTop":"scrollLeft";n[t]=e.target.getBoundingClientRect()[t]+document.body[i]+document.documentElement[i]+"px"}),["height","width"].forEach(function(t){n[t]=e.target.getBoundingClientRect()[t]+"px"})):i.originalPosition=(0,l.getStyle)(t,"position"),Object.keys(n).forEach(function(e){i.$el.style[e]=n[e]})},m=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};if(!o.default.prototype.$isServer){if(e=(0,c.default)({},h,e),"string"==typeof e.target&&(e.target=document.querySelector(e.target)),e.target=e.target||document.body,e.target!==document.body?e.fullscreen=!1:e.body=!0,e.fullscreen&&f)return f;var t=e.body?document.body:e.target,i=new d({el:document.createElement("div"),data:e});return p(e,t,i),"absolute"!==i.originalPosition&&"fixed"!==i.originalPosition&&(t.style.position="relative"),e.fullscreen&&e.lock&&(t.style.overflow="hidden"),t.appendChild(i.$el),o.default.nextTick(function(){i.visible=!0}),e.fullscreen&&(f=i),i}};t.default=m},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0;var s=i(289),o=n(s);o.default.install=function(e){e.component(o.default.name,o.default)},t.default=o.default},function(e,t,i){var n=i(5)(i(290),i(291),null,null,null);e.exports=n.exports},function(e,t){"use strict";t.__esModule=!0,t.default={name:"ElIcon",props:{name:String}}},function(e,t){e.exports={render:function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("i",{class:"el-icon-"+e.name})},staticRenderFns:[]}},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0;var s=i(293),o=n(s);o.default.install=function(e){e.component(o.default.name,o.default)},t.default=o.default},function(e,t){"use strict";t.__esModule=!0,t.default={name:"ElRow",componentName:"ElRow",props:{tag:{type:String,default:"div"},gutter:Number,type:String,justify:{type:String,default:"start"},align:{type:String,default:"top"}},computed:{style:function(){var e={};return this.gutter&&(e.marginLeft="-"+this.gutter/2+"px",e.marginRight=e.marginLeft),e}},render:function(e){return e(this.tag,{class:["el-row","start"!==this.justify?"is-justify-"+this.justify:"","top"!==this.align?"is-align-"+this.align:"",{"el-row--flex":"flex"===this.type}],style:this.style},this.$slots.default)}}},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0;var s=i(295),o=n(s);o.default.install=function(e){e.component(o.default.name,o.default)},t.default=o.default},function(e,t){"use strict";t.__esModule=!0;var i="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e};t.default={name:"ElCol",props:{span:{type:Number,default:24},tag:{type:String,default:"div"},offset:Number,pull:Number,push:Number,xs:[Number,Object],sm:[Number,Object],md:[Number,Object],lg:[Number,Object]},computed:{gutter:function(){for(var e=this.$parent;e&&"ElRow"!==e.$options.componentName;)e=e.$parent;return e?e.gutter:0}},render:function(e){var t=this,n=[],s={};return this.gutter&&(s.paddingLeft=this.gutter/2+"px",s.paddingRight=s.paddingLeft),["span","offset","pull","push"].forEach(function(e){t[e]&&n.push("span"!==e?"el-col-"+e+"-"+t[e]:"el-col-"+t[e])}),["xs","sm","md","lg"].forEach(function(e){"number"==typeof t[e]?n.push("el-col-"+e+"-"+t[e]):"object"===i(t[e])&&!function(){var i=t[e];Object.keys(i).forEach(function(t){n.push("span"!==t?"el-col-"+e+"-"+t+"-"+i[t]:"el-col-"+e+"-"+i[t])})}()}),e(this.tag,{class:["el-col",n],style:s},this.$slots.default)}}},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0;var s=i(297),o=n(s);o.default.install=function(e){e.component(o.default.name,o.default)},t.default=o.default},function(e,t,i){var n=i(5)(i(298),null,null,null,null);e.exports=n.exports},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}function s(){}t.__esModule=!0;var o=i(299),a=n(o),r=i(306),l=n(r),u=i(312),c=n(u),d=i(301),h=n(d),f=i(314),p=n(f);t.default={name:"ElUpload",mixins:[p.default],components:{ElProgress:h.default,UploadList:a.default,Upload:l.default,IframeUpload:c.default},provide:{uploader:void 0},props:{action:{type:String,required:!0},headers:{type:Object,default:function(){return{}}},data:Object,multiple:Boolean,name:{type:String,default:"file"},drag:Boolean,dragger:Boolean,withCredentials:Boolean,showFileList:{type:Boolean,default:!0},accept:String,type:{type:String,default:"select"},beforeUpload:Function,onRemove:{type:Function,default:s},onChange:{type:Function,default:s},onPreview:{type:Function},onSuccess:{type:Function,default:s},onProgress:{type:Function,default:s},onError:{type:Function,default:s},fileList:{type:Array,default:function(){return[]}},autoUpload:{type:Boolean,default:!0},listType:{type:String,default:"text"},httpRequest:Function,disabled:Boolean},data:function(){return{uploadFiles:[],dragOver:!1,draging:!1,tempIndex:1}},watch:{fileList:{immediate:!0,handler:function(e){var t=this;this.uploadFiles=e.map(function(e){return e.uid=e.uid||Date.now()+t.tempIndex++,e.status="success",e})}}},methods:{handleStart:function(e){e.uid=Date.now()+this.tempIndex++;var t={status:"ready",name:e.name,size:e.size,percentage:0,uid:e.uid,raw:e};try{t.url=URL.createObjectURL(e)}catch(e){return void console.error(e)}this.uploadFiles.push(t),this.onChange(t,this.uploadFiles)},handleProgress:function(e,t){var i=this.getFile(t);this.onProgress(e,i,this.uploadFiles),i.status="uploading",i.percentage=e.percent||0},handleSuccess:function(e,t){var i=this.getFile(t);i&&(i.status="success",i.response=e,this.onSuccess(e,i,this.uploadFiles),this.onChange(i,this.uploadFiles))},handleError:function(e,t){var i=this.getFile(t),n=this.uploadFiles;i.status="fail",n.splice(n.indexOf(i),1),this.onError(e,i,this.uploadFiles),this.onChange(i,this.uploadFiles)},handleRemove:function(e,t){t&&(e=this.getFile(t)),this.abort(e);var i=this.uploadFiles;i.splice(i.indexOf(e),1),this.onRemove(e,i)},getFile:function(e){var t,i=this.uploadFiles;return i.every(function(i){return t=e.uid===i.uid?i:null,!t}),t},abort:function(e){this.$refs["upload-inner"].abort(e)},clearFiles:function(){this.uploadFiles=[]},submit:function(){var e=this;this.uploadFiles.filter(function(e){return"ready"===e.status}).forEach(function(t){e.$refs["upload-inner"].upload(t.raw)})},getMigratingConfig:function(){return{props:{"default-file-list":"default-file-list is renamed to file-list.","show-upload-list":"show-upload-list is renamed to show-file-list.","thumbnail-mode":"thumbnail-mode has been deprecated, you can implement the same effect according to this case: http://element.eleme.io/#/zh-CN/component/upload#yong-hu-tou-xiang-shang-chuan"}}}},render:function(e){var t;this.showFileList&&(t=e(a.default,{attrs:{disabled:this.disabled,listType:this.listType,files:this.uploadFiles,handlePreview:this.onPreview},on:{remove:this.handleRemove}},[]));var i={props:{type:this.type,drag:this.drag,action:this.action,multiple:this.multiple,"before-upload":this.beforeUpload,"with-credentials":this.withCredentials,headers:this.headers,name:this.name,data:this.data,accept:this.accept,fileList:this.uploadFiles,autoUpload:this.autoUpload,listType:this.listType,disabled:this.disabled,"on-start":this.handleStart,"on-progress":this.handleProgress,"on-success":this.handleSuccess,"on-error":this.handleError,"on-preview":this.onPreview,"on-remove":this.handleRemove,"http-request":this.httpRequest},ref:"upload-inner"},n=this.$slots.trigger||this.$slots.default,s="undefined"!=typeof FormData||this.$isServer?e("upload",i,[n]):e("iframeUpload",i,[n]);return e("div",null,["picture-card"===this.listType?t:"",this.$slots.trigger?[s,this.$slots.default]:s,this.$slots.tip,"picture-card"!==this.listType?t:""])}}},function(e,t,i){var n=i(5)(i(300),i(305),null,null,null);e.exports=n.exports},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0;var s=i(12),o=n(s),a=i(301),r=n(a);t.default={mixins:[o.default],components:{ElProgress:r.default},props:{files:{type:Array,default:function(){return[]}},disabled:{type:Boolean,default:!1},handlePreview:Function,listType:String},methods:{parsePercentage:function(e){return parseInt(e,10)},handleClick:function(e){this.handlePreview&&this.handlePreview(e)}}}},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0;var s=i(302),o=n(s);o.default.install=function(e){e.component(o.default.name,o.default)},t.default=o.default},function(e,t,i){var n=i(5)(i(303),i(304),null,null,null);e.exports=n.exports},function(e,t){"use strict";t.__esModule=!0,t.default={name:"ElProgress",props:{type:{type:String,default:"line",validator:function(e){return["line","circle"].indexOf(e)>-1}},percentage:{type:Number,default:0,required:!0,validator:function(e){return e>=0&&e<=100}},status:{type:String},strokeWidth:{type:Number,default:6},textInside:{type:Boolean,default:!1},width:{type:Number,default:126},showText:{type:Boolean,default:!0}},computed:{barStyle:function(){var e={};return e.width=this.percentage+"%",e},relativeStrokeWidth:function(){return(this.strokeWidth/this.width*100).toFixed(1)},trackPath:function(){var e=parseInt(50-parseFloat(this.relativeStrokeWidth)/2,10);return"M 50 50 m 0 -"+e+" a "+e+" "+e+" 0 1 1 0 "+2*e+" a "+e+" "+e+" 0 1 1 0 -"+2*e},perimeter:function(){var e=50-parseFloat(this.relativeStrokeWidth)/2;return 2*Math.PI*e},circlePathStyle:function(){var e=this.perimeter;return{strokeDasharray:e+"px,"+e+"px",strokeDashoffset:(1-this.percentage/100)*e+"px",transition:"stroke-dashoffset 0.6s ease 0s, stroke 0.6s ease"}},stroke:function(){var e;switch(this.status){case"success":e="#13ce66";break;case"exception":e="#ff4949";break;default:e="#20a0ff"}return e},iconClass:function(){return"line"===this.type?"success"===this.status?"el-icon-circle-check":"el-icon-circle-cross":"success"===this.status?"el-icon-check":"el-icon-close"},progressTextSize:function(){return"line"===this.type?12+.4*this.strokeWidth:.111111*this.width+2}}}},function(e,t){e.exports={render:function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("div",{staticClass:"el-progress",class:["el-progress--"+e.type,e.status?"is-"+e.status:"",{"el-progress--without-text":!e.showText,"el-progress--text-inside":e.textInside}]},["line"===e.type?i("div",{staticClass:"el-progress-bar"},[i("div",{staticClass:"el-progress-bar__outer",style:{height:e.strokeWidth+"px"}},[i("div",{staticClass:"el-progress-bar__inner",style:e.barStyle},[e.showText&&e.textInside?i("div",{staticClass:"el-progress-bar__innerText"},[e._v(e._s(e.percentage)+"%")]):e._e()])])]):i("div",{staticClass:"el-progress-circle",style:{height:e.width+"px",width:e.width+"px"}},[i("svg",{attrs:{viewBox:"0 0 100 100"}},[i("path",{staticClass:"el-progress-circle__track",attrs:{d:e.trackPath,stroke:"#e5e9f2","stroke-width":e.relativeStrokeWidth,fill:"none"}}),i("path",{staticClass:"el-progress-circle__path",style:e.circlePathStyle,attrs:{d:e.trackPath,"stroke-linecap":"round",stroke:e.stroke,"stroke-width":e.relativeStrokeWidth,fill:"none"}})])]),e.showText&&!e.textInside?i("div",{staticClass:"el-progress__text",style:{fontSize:e.progressTextSize+"px"}},[e.status?i("i",{class:e.iconClass}):[e._v(e._s(e.percentage)+"%")]],2):e._e()])},staticRenderFns:[]}},function(e,t){e.exports={render:function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("transition-group",{class:["el-upload-list","el-upload-list--"+e.listType,{"is-disabled":e.disabled}],attrs:{tag:"ul",name:"el-list"}},e._l(e.files,function(t,n){return i("li",{key:n,class:["el-upload-list__item","is-"+t.status]},["uploading"!==t.status&&["picture-card","picture"].indexOf(e.listType)>-1?i("img",{staticClass:"el-upload-list__item-thumbnail",attrs:{src:t.url,alt:""}}):e._e(),i("a",{staticClass:"el-upload-list__item-name",on:{click:function(i){e.handleClick(t)}}},[i("i",{staticClass:"el-icon-document"}),e._v(e._s(t.name)+"\n    ")]),i("label",{staticClass:"el-upload-list__item-status-label"},[i("i",{class:{"el-icon-upload-success":!0,"el-icon-circle-check":"text"===e.listType,"el-icon-check":["picture-card","picture"].indexOf(e.listType)>-1}})]),e.disabled?e._e():i("i",{staticClass:"el-icon-close",on:{click:function(i){e.$emit("remove",t)}}}),"uploading"===t.status?i("el-progress",{attrs:{type:"picture-card"===e.listType?"circle":"line","stroke-width":"picture-card"===e.listType?6:2,percentage:e.parsePercentage(t.percentage)}}):e._e(),"picture-card"===e.listType?i("span",{staticClass:"el-upload-list__item-actions"},[e.handlePreview&&"picture-card"===e.listType?i("span",{staticClass:"el-upload-list__item-preview",on:{click:function(i){e.handlePreview(t)}}},[i("i",{staticClass:"el-icon-view"})]):e._e(),e.disabled?e._e():i("span",{staticClass:"el-upload-list__item-delete",on:{click:function(i){e.$emit("remove",t)}}},[i("i",{staticClass:"el-icon-delete2"})])]):e._e()],1)}))},staticRenderFns:[]}},function(e,t,i){var n=i(5)(i(307),null,null,null,null);e.exports=n.exports},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0;var s=i(308),o=n(s),a=i(309),r=n(a);t.default={inject:["uploader"],components:{UploadDragger:r.default},props:{type:String,action:{type:String,required:!0},name:{type:String,default:"file"},data:Object,headers:Object,withCredentials:Boolean,multiple:Boolean,accept:String,onStart:Function,onProgress:Function,onSuccess:Function,onError:Function,beforeUpload:Function,drag:Boolean,onPreview:{type:Function,default:function(){}},onRemove:{type:Function,default:function(){}},fileList:Array,autoUpload:Boolean,listType:String,httpRequest:{type:Function,default:o.default},disabled:Boolean},data:function(){return{mouseover:!1,reqs:{}}},methods:{isImage:function(e){return e.indexOf("image")!==-1},handleChange:function(e){var t=e.target.files;t&&this.uploadFiles(t)},uploadFiles:function(e){var t=this,i=Array.prototype.slice.call(e);this.multiple||(i=i.slice(0,1)),0!==i.length&&i.forEach(function(e){t.onStart(e),t.autoUpload&&t.upload(e)})},upload:function(e,t){var i=this;if(this.$refs.input.value=null,!this.beforeUpload)return this.post(e);var n=this.beforeUpload(e);n&&n.then?n.then(function(t){"[object File]"===Object.prototype.toString.call(t)?i.post(t):i.post(e)},function(){i.onRemove(e,!0)}):n!==!1?this.post(e):this.onRemove(e,!0)},abort:function(e){var t=this.reqs;if(e){var i=e;e.uid&&(i=e.uid),t[i]&&t[i].abort()}else Object.keys(t).forEach(function(e){t[e]&&t[e].abort(),delete t[e]})},post:function(e){var t=this,i=e.uid,n={headers:this.headers,withCredentials:this.withCredentials,file:e,data:this.data,filename:this.name,action:this.action,onProgress:function(i){t.onProgress(i,e)},onSuccess:function(n){t.onSuccess(n,e),delete t.reqs[i]},onError:function(n){t.onError(n,e),delete t.reqs[i]}},s=this.httpRequest(n);this.reqs[i]=s,s&&s.then&&s.then(n.onSuccess,n.onError)},handleClick:function(){this.disabled||(this.$refs.input.value=null,this.$refs.input.click())}},render:function(e){var t=this.handleClick,i=this.drag,n=this.name,s=this.handleChange,o=this.multiple,a=this.accept,r=this.listType,l=this.uploadFiles,u=this.disabled,c={class:{"el-upload":!0},on:{click:t}};return c.class["el-upload--"+r]=!0,e("div",c,[i?e("upload-dragger",{attrs:{disabled:u},on:{file:l}},[this.$slots.default]):this.$slots.default,e("input",{class:"el-upload__input",attrs:{type:"file",name:n,multiple:o,accept:a},ref:"input",on:{change:s}},[])])}}},function(e,t){"use strict";function i(e,t,i){var n=void 0;n=i.response?i.status+" "+(i.response.error||i.response):i.responseText?i.status+" "+i.responseText:"fail to post "+e+" "+i.status;var s=new Error(n);return s.status=i.status,s.method="post",s.url=e,s}function n(e){var t=e.responseText||e.response;if(!t)return t;try{return JSON.parse(t)}catch(e){return t}}function s(e){if("undefined"!=typeof XMLHttpRequest){var t=new XMLHttpRequest,s=e.action;t.upload&&(t.upload.onprogress=function(t){t.total>0&&(t.percent=t.loaded/t.total*100),e.onProgress(t)});var o=new FormData;e.data&&Object.keys(e.data).map(function(t){o.append(t,e.data[t])}),o.append(e.filename,e.file),t.onerror=function(t){e.onError(t)},t.onload=function(){return t.status<200||t.status>=300?e.onError(i(s,e,t)):void e.onSuccess(n(t))},t.open("post",s,!0),e.withCredentials&&"withCredentials"in t&&(t.withCredentials=!0);var a=e.headers||{};for(var r in a)a.hasOwnProperty(r)&&null!==a[r]&&t.setRequestHeader(r,a[r]);return t.send(o),t}}t.__esModule=!0,t.default=s},function(e,t,i){var n=i(5)(i(310),i(311),null,null,null);e.exports=n.exports},function(e,t){"use strict";t.__esModule=!0,t.default={name:"ElUploadDrag",props:{disabled:Boolean},data:function(){return{dragover:!1}},methods:{onDragover:function(){this.disabled||(this.dragover=!0)},onDrop:function(e){this.disabled||(this.dragover=!1,this.$emit("file",e.dataTransfer.files))}}}},function(e,t){e.exports={render:function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("div",{staticClass:"el-upload-dragger",class:{"is-dragover":e.dragover},on:{drop:function(t){t.preventDefault(),e.onDrop(t)},dragover:function(t){t.preventDefault(),e.onDragover(t)},dragleave:function(t){t.preventDefault(),e.dragover=!1}}},[e._t("default")],2)},staticRenderFns:[]}},function(e,t,i){var n=i(5)(i(313),null,null,null,null);e.exports=n.exports},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0;var s=i(309),o=n(s);t.default={components:{UploadDragger:o.default},props:{type:String,data:{},action:{type:String,required:!0},name:{type:String,default:"file"},withCredentials:Boolean,accept:String,onStart:Function,onProgress:Function,onSuccess:Function,onError:Function,beforeUpload:Function,onPreview:{type:Function,default:function(){}},onRemove:{type:Function,default:function(){}},drag:Boolean,listType:String,disabled:Boolean},data:function(){return{mouseover:!1,domain:"",file:null,submitting:!1}},methods:{isImage:function(e){return e.indexOf("image")!==-1},handleClick:function(){this.disabled||this.$refs.input.click()},handleChange:function(e){var t=e.target.value;t&&this.uploadFiles(t)},uploadFiles:function(e){if(!this.submitting){this.submitting=!0,this.file=e,this.onStart(e);var t=this.getFormNode(),i=this.getFormDataNode(),n=this.data;"function"==typeof n&&(n=n(e));var s=[];for(var o in n)n.hasOwnProperty(o)&&s.push('<input name="'+o+'" value="'+n[o]+'"/>');i.innerHTML=s.join(""),t.submit(),i.innerHTML=""}},getFormNode:function(){return this.$refs.form},getFormDataNode:function(){return this.$refs.data}},created:function(){this.frameName="frame-"+Date.now()},mounted:function(){var e=this;!this.$isServer&&window.addEventListener("message",function(t){if(e.file){var i=new URL(e.action).origin;if(t.origin===i){var n=t.data;"success"===n.result?e.onSuccess(n,e.file):"failed"===n.result&&e.onError(n,e.file),e.submitting=!1,e.file=null}}},!1)},render:function(e){var t=this.drag,i=this.uploadFiles,n=this.listType,s=this.frameName,o=this.disabled,a={"el-upload":!0};return a["el-upload--"+n]=!0,e("div",{class:a,on:{click:this.handleClick},nativeOn:{drop:this.onDrop,dragover:this.handleDragover,dragleave:this.handleDragleave}},[e("iframe",{on:{load:this.onload},ref:"iframe",attrs:{name:s}},[]),e("form",{ref:"form",attrs:{action:this.action,target:s,enctype:"multipart/form-data",method:"POST"}},[e("input",{class:"el-upload__input",attrs:{type:"file",name:"file",accept:this.accept},ref:"input",on:{change:this.handleChange}},[]),e("input",{attrs:{type:"hidden",name:"documentDomain",value:this.$isServer?"":document.domain}},[]),e("span",{ref:"data"},[])]),t?e("upload-dragger",{on:{file:i},attrs:{disabled:o}},[this.$slots.default]):this.$slots.default])}}},function(e,t,i){"use strict";t.__esModule=!0,t.default={mounted:function(){return},methods:{getMigratingConfig:function(){return{props:{},events:{}}}}}},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0;var s=i(316),o=n(s);o.default.install=function(e){e.component(o.default.name,o.default)},t.default=o.default},function(e,t,i){var n=i(5)(i(317),i(318),null,null,null);e.exports=n.exports},function(e,t){"use strict";t.__esModule=!0,t.default={name:"ElSpinner",props:{type:String,radius:{type:Number,default:100},strokeWidth:{type:Number,default:5},strokeColor:{type:String,default:"#efefef"}}}},function(e,t){e.exports={render:function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("span",{staticClass:"el-spinner"},[i("svg",{staticClass:"el-spinner-inner",style:{width:e.radius/2+"px",height:e.radius/2+"px"},attrs:{viewBox:"0 0 50 50"}},[i("circle",{staticClass:"path",attrs:{cx:"25",cy:"25",r:"20",fill:"none",stroke:e.strokeColor,"stroke-width":e.strokeWidth}})])])},staticRenderFns:[]}},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0;var s=i(320),o=n(s);t.default=o.default},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0;var s=i(15),o=n(s),a=i(28),r=i(145),l=o.default.extend(i(321)),u=void 0,c=[],d=1,h=function e(t){if(!o.default.prototype.$isServer){t=t||{},"string"==typeof t&&(t={message:t});var i=t.onClose,n="message_"+d++;return t.onClose=function(){e.close(n,i)},u=new l({data:t}),u.id=n,(0,r.isVNode)(u.message)&&(u.$slots.default=[u.message],u.message=null),u.vm=u.$mount(),document.body.appendChild(u.vm.$el),u.vm.visible=!0,u.dom=u.vm.$el,u.dom.style.zIndex=a.PopupManager.nextZIndex(),c.push(u),u.vm}};["success","warning","info","error"].forEach(function(e){h[e]=function(t){return"string"==typeof t&&(t={message:t}),t.type=e,h(t)}}),h.close=function(e,t){for(var i=0,n=c.length;i<n;i++)if(e===c[i].id){"function"==typeof t&&t(c[i]),c.splice(i,1);break}},h.closeAll=function(){for(var e=c.length-1;e>=0;e--)c[e].close()},t.default=h},function(e,t,i){var n=i(5)(i(322),i(328),null,null,null);e.exports=n.exports},function(e,t,i){"use strict";t.__esModule=!0,t.default={data:function(){return{visible:!1,message:"",duration:3e3,type:"info",iconClass:"",customClass:"",onClose:null,showClose:!1,closed:!1,timer:null}},computed:{typeImg:function(){return i(323)("./"+this.type+".svg")}},watch:{closed:function(e){e&&(this.visible=!1,this.$el.addEventListener("transitionend",this.destroyElement))}},methods:{destroyElement:function(){this.$el.removeEventListener("transitionend",this.destroyElement),this.$destroy(!0),this.$el.parentNode.removeChild(this.$el)},close:function(){this.closed=!0,"function"==typeof this.onClose&&this.onClose(this)},clearTimer:function(){clearTimeout(this.timer)},startTimer:function(){var e=this;this.duration>0&&(this.timer=setTimeout(function(){e.closed||e.close()},this.duration))}},mounted:function(){this.startTimer()}}},function(e,t,i){function n(e){return i(s(e))}function s(e){return o[e]||function(){throw new Error("Cannot find module '"+e+"'.")}()}var o={"./error.svg":324,"./info.svg":325,"./success.svg":326,"./warning.svg":327};n.keys=function(){return Object.keys(o)},n.resolve=s,e.exports=n,n.id=323},function(e,t){e.exports="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+Cjxzdmcgd2lkdGg9IjQwcHgiIGhlaWdodD0iNDBweCIgdmlld0JveD0iMCAwIDQwIDQwIiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPgogICAgPCEtLSBHZW5lcmF0b3I6IFNrZXRjaCAzOS4xICgzMTcyMCkgLSBodHRwOi8vd3d3LmJvaGVtaWFuY29kaW5nLmNvbS9za2V0Y2ggLS0+CiAgICA8dGl0bGU+aWNvbl9kYW5nZXI8L3RpdGxlPgogICAgPGRlc2M+Q3JlYXRlZCB3aXRoIFNrZXRjaC48L2Rlc2M+CiAgICA8ZGVmcz48L2RlZnM+CiAgICA8ZyBpZD0iRWxlbWVudC1ndWlkZWxpbmUtdjAuMi40IiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgICAgICA8ZyBpZD0iTWVzc2FnZSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTYwLjAwMDAwMCwgLTMzMi4wMDAwMDApIj4KICAgICAgICAgICAgPGcgaWQ9IuW4puWAvuWQkV/kv6Hmga8iIHRyYW5zZm9ybT0idHJhbnNsYXRlKDYwLjAwMDAwMCwgMzMyLjAwMDAwMCkiPgogICAgICAgICAgICAgICAgPGcgaWQ9IlJlY3RhbmdsZS0yIj4KICAgICAgICAgICAgICAgICAgICA8ZyBpZD0iaWNvbl9kYW5nZXIiPgogICAgICAgICAgICAgICAgICAgICAgICA8cmVjdCBpZD0iUmVjdGFuZ2xlLTIiIGZpbGw9IiNGRjQ5NDkiIHg9IjAiIHk9IjAiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PC9yZWN0PgogICAgICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSJNMjUuODE3MjYyNywxNi4zNDUxNzk2IEMyNS45MzkwOTAyLDE2LjIyMzM0ODMgMjYsMTYuMDc2MTQxOCAyNiwxNS45MDM1NTIzIEMyNiwxNS43MzA5NjI4IDI1LjkzOTA5MDIsMTUuNTgzNzU2MyAyNS44MTcyNjI3LDE1LjQ2MTkyODkgTDI0LjUwNzYxNTcsMTQuMTgyNzQxMSBDMjQuMzg1Nzg4MiwxNC4wNjA5MTM3IDI0LjI0MzY1NzUsMTQgMjQuMDgxMjE5NiwxNCBDMjMuOTE4NzgxNywxNCAyMy43NzY2NTEsMTQuMDYwOTEzNyAyMy42NTQ4MjM1LDE0LjE4Mjc0MTEgTDIwLDE3LjgzNzU2MzUgTDE2LjMxNDcyMTYsMTQuMTgyNzQxMSBDMTYuMTkyODkwMiwxNC4wNjA5MTM3IDE2LjA1MDc1OTUsMTQgMTUuODg4MzIxNiwxNCBDMTUuNzI1ODg3NiwxNCAxNS41ODM3NTY5LDE0LjA2MDkxMzcgMTUuNDYxOTI5NCwxNC4xODI3NDExIEwxNC4xNTIyODI0LDE1LjQ2MTkyODkgQzE0LjA1MDc1ODIsMTUuNTgzNzU2MyAxNCwxNS43MzA5NjI4IDE0LDE1LjkwMzU1MjMgQzE0LDE2LjA3NjE0MTggMTQuMDUwNzU4MiwxNi4yMjMzNDgzIDE0LjE1MjI4MjQsMTYuMzQ1MTc5NiBMMTcuODM3NTYwOCwyMC4wMDAwMDE5IEwxNC4xNTIyODI0LDIzLjY1NDgyNDMgQzE0LjA1MDc1ODIsMjMuNzc2NjUxNyAxNCwyMy45MjM4NTgyIDE0LDI0LjA5NjQ0NzcgQzE0LDI0LjI2OTAzNzIgMTQuMDUwNzU4MiwyNC40MTYyNDM3IDE0LjE1MjI4MjQsMjQuNTM4MDcxMSBMMTUuNDYxOTI5NCwyNS44MTcyNTg5IEMxNS41ODM3NTY5LDI1LjkzOTA4NjMgMTUuNzI1ODg3NiwyNiAxNS44ODgzMjE2LDI2IEMxNi4wNTA3NTk1LDI2IDE2LjE5Mjg5MDIsMjUuOTM5MDg2MyAxNi4zMTQ3MjE2LDI1LjgxNzI1ODkgTDIwLDIyLjE2MjQzNjUgTDIzLjY1NDgyMzUsMjUuODE3MjU4OSBDMjMuNzc2NjUxLDI1LjkzOTA4NjMgMjMuOTE4NzgxNywyNiAyNC4wODEyMTk2LDI2IEMyNC4yNDM2NTc1LDI2IDI0LjM4NTc4ODIsMjUuOTM5MDg2MyAyNC41MDc2MTU3LDI1LjgxNzI1ODkgTDI1LjgxNzI2MjcsMjQuNTM4MDcxMSBDMjUuOTM5MDkwMiwyNC40MTYyNDM3IDI2LDI0LjI2OTAzNzIgMjYsMjQuMDk2NDQ3NyBDMjYsMjMuOTIzODU4MiAyNS45MzkwOTAyLDIzLjc3NjY1MTcgMjUuODE3MjYyNywyMy42NTQ4MjQzIEwyMi4xMzE5ODA0LDIwLjAwMDAwMTkgTDI1LjgxNzI2MjcsMTYuMzQ1MTc5NiBaIiBpZD0iUGF0aCIgZmlsbD0iI0ZGRkZGRiI+PC9wYXRoPgogICAgICAgICAgICAgICAgICAgIDwvZz4KICAgICAgICAgICAgICAgIDwvZz4KICAgICAgICAgICAgPC9nPgogICAgICAgIDwvZz4KICAgIDwvZz4KPC9zdmc+"},function(e,t){e.exports="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+Cjxzdmcgd2lkdGg9IjQwcHgiIGhlaWdodD0iNDBweCIgdmlld0JveD0iMCAwIDQwIDQwIiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPgogICAgPCEtLSBHZW5lcmF0b3I6IFNrZXRjaCAzOS4xICgzMTcyMCkgLSBodHRwOi8vd3d3LmJvaGVtaWFuY29kaW5nLmNvbS9za2V0Y2ggLS0+CiAgICA8dGl0bGU+aWNvbl9pbmZvPC90aXRsZT4KICAgIDxkZXNjPkNyZWF0ZWQgd2l0aCBTa2V0Y2guPC9kZXNjPgogICAgPGRlZnM+PC9kZWZzPgogICAgPGcgaWQ9IkVsZW1lbnQtZ3VpZGVsaW5lLXYwLjIuNCIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICAgICAgPGcgaWQ9Ik1lc3NhZ2UiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC02MC4wMDAwMDAsIC0xNTIuMDAwMDAwKSI+CiAgICAgICAgICAgIDxnIGlkPSLluKblgL7lkJFf5L+h5oGvIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSg2MC4wMDAwMDAsIDE1Mi4wMDAwMDApIj4KICAgICAgICAgICAgICAgIDxnIGlkPSJSZWN0YW5nbGUtMiI+CiAgICAgICAgICAgICAgICAgICAgPGcgaWQ9Imljb25faW5mbyI+CiAgICAgICAgICAgICAgICAgICAgICAgIDxyZWN0IGlkPSJSZWN0YW5nbGUtMiIgZmlsbD0iIzUwQkZGRiIgeD0iMCIgeT0iMCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIj48L3JlY3Q+CiAgICAgICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik0yMS42MTUzODQ2LDI2LjU0MzIwOTkgQzIxLjYxNTM4NDYsMjYuOTQ3ODc1MSAyMS40NTgzMzQ4LDI3LjI5MTgzNjggMjEuMTQ0MjMwOCwyNy41NzUxMDI5IEMyMC44MzAxMjY4LDI3Ljg1ODM2ODkgMjAuNDQ4NzE5NCwyOCAyMCwyOCBDMTkuNTUxMjgwNiwyOCAxOS4xNjk4NzMyLDI3Ljg1ODM2ODkgMTguODU1NzY5MiwyNy41NzUxMDI5IEMxOC41NDE2NjUyLDI3LjI5MTgzNjggMTguMzg0NjE1NCwyNi45NDc4NzUxIDE4LjM4NDYxNTQsMjYuNTQzMjA5OSBMMTguMzg0NjE1NCwxOS43NDQ4NTYgQzE4LjM4NDYxNTQsMTkuMzQwMTkwNyAxOC41NDE2NjUyLDE4Ljk5NjIyOSAxOC44NTU3NjkyLDE4LjcxMjk2MyBDMTkuMTY5ODczMiwxOC40Mjk2OTY5IDE5LjU1MTI4MDYsMTguMjg4MDY1OCAyMCwxOC4yODgwNjU4IEMyMC40NDg3MTk0LDE4LjI4ODA2NTggMjAuODMwMTI2OCwxOC40Mjk2OTY5IDIxLjE0NDIzMDgsMTguNzEyOTYzIEMyMS40NTgzMzQ4LDE4Ljk5NjIyOSAyMS42MTUzODQ2LDE5LjM0MDE5MDcgMjEuNjE1Mzg0NiwxOS43NDQ4NTYgTDIxLjYxNTM4NDYsMjYuNTQzMjA5OSBaIE0yMCwxNS44MDQyOTgxIEMxOS40NDQ0NDI3LDE1LjgwNDI5ODEgMTguOTcyMjI0LDE1LjYxOTM2ODcgMTguNTgzMzMzMywxNS4yNDk1MDQ2IEMxOC4xOTQ0NDI3LDE0Ljg3OTY0MDYgMTgsMTQuNDMwNTI1NSAxOCwxMy45MDIxNDkxIEMxOCwxMy4zNzM3NzI2IDE4LjE5NDQ0MjcsMTIuOTI0NjU3NSAxOC41ODMzMzMzLDEyLjU1NDc5MzUgQzE4Ljk3MjIyNCwxMi4xODQ5Mjk1IDE5LjQ0NDQ0MjcsMTIgMjAsMTIgQzIwLjU1NTU1NzMsMTIgMjEuMDI3Nzc2LDEyLjE4NDkyOTUgMjEuNDE2NjY2NywxMi41NTQ3OTM1IEMyMS44MDU1NTczLDEyLjkyNDY1NzUgMjIsMTMuMzczNzcyNiAyMiwxMy45MDIxNDkxIEMyMiwxNC40MzA1MjU1IDIxLjgwNTU1NzMsMTQuODc5NjQwNiAyMS40MTY2NjY3LDE1LjI0OTUwNDYgQzIxLjAyNzc3NiwxNS42MTkzNjg3IDIwLjU1NTU1NzMsMTUuODA0Mjk4MSAyMCwxNS44MDQyOTgxIFoiIGlkPSJDb21iaW5lZC1TaGFwZSIgZmlsbD0iI0ZGRkZGRiI+PC9wYXRoPgogICAgICAgICAgICAgICAgICAgIDwvZz4KICAgICAgICAgICAgICAgIDwvZz4KICAgICAgICAgICAgPC9nPgogICAgICAgIDwvZz4KICAgIDwvZz4KPC9zdmc+"},function(e,t){e.exports="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+Cjxzdmcgd2lkdGg9IjQwcHgiIGhlaWdodD0iNDBweCIgdmlld0JveD0iMCAwIDQwIDQwIiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPgogICAgPCEtLSBHZW5lcmF0b3I6IFNrZXRjaCAzOS4xICgzMTcyMCkgLSBodHRwOi8vd3d3LmJvaGVtaWFuY29kaW5nLmNvbS9za2V0Y2ggLS0+CiAgICA8dGl0bGU+aWNvbl9zdWNjZXNzPC90aXRsZT4KICAgIDxkZXNjPkNyZWF0ZWQgd2l0aCBTa2V0Y2guPC9kZXNjPgogICAgPGRlZnM+PC9kZWZzPgogICAgPGcgaWQ9IkVsZW1lbnQtZ3VpZGVsaW5lLXYwLjIuNCIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICAgICAgPGcgaWQ9Ik1lc3NhZ2UiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC02MC4wMDAwMDAsIC0yMTIuMDAwMDAwKSI+CiAgICAgICAgICAgIDxnIGlkPSLluKblgL7lkJFf5L+h5oGvIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSg2MC4wMDAwMDAsIDIxMi4wMDAwMDApIj4KICAgICAgICAgICAgICAgIDxnIGlkPSJSZWN0YW5nbGUtMiI+CiAgICAgICAgICAgICAgICAgICAgPGcgaWQ9Imljb25fc3VjY2VzcyI+CiAgICAgICAgICAgICAgICAgICAgICAgIDxyZWN0IGlkPSJSZWN0YW5nbGUtMiIgZmlsbD0iIzEzQ0U2NiIgeD0iMCIgeT0iMCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIj48L3JlY3Q+CiAgICAgICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik0yNy44MjU1ODE0LDE3LjE0ODQzNTcgTDE5LjAxNzQ0LDI1LjgyODEyMTMgQzE4LjkwMTE2MDksMjUuOTQyNzA4MyAxOC43NjU1MDMzLDI2IDE4LjYxMDQ2NywyNiBDMTguNDU1NDI3LDI2IDE4LjMxOTc2OTMsMjUuOTQyNzA4MyAxOC4yMDM0ODY1LDI1LjgyODEyMTMgTDE4LjAyOTA3MTYsMjUuNjU2MjUgTDEzLjE3NDQxODYsMjAuODQzNzUgQzEzLjA1ODEzOTUsMjAuNzI5MTYzIDEzLDIwLjU5NTQ4MzcgMTMsMjAuNDQyNzA0NyBDMTMsMjAuMjg5OTI5MyAxMy4wNTgxMzk1LDIwLjE1NjI1IDEzLjE3NDQxODYsMjAuMDQxNjY2NyBMMTQuMzY2Mjc3MiwxOC44NjcxODU3IEMxNC40ODI1NiwxOC43NTI2MDIzIDE0LjYxODIxNzcsMTguNjk1MzEwNyAxNC43NzMyNTc3LDE4LjY5NTMxMDcgQzE0LjkyODI5NCwxOC42OTUzMTA3IDE1LjA2Mzk1MTYsMTguNzUyNjAyMyAxNS4xODAyMzA3LDE4Ljg2NzE4NTcgTDE4LjYxMDQ2NywyMi4yNzYwMzggTDI1LjgxOTc2OTMsMTUuMTcxODcxMyBDMjUuOTM2MDQ4NCwxNS4wNTcyODggMjYuMDcxNzA2LDE1IDI2LjIyNjc0MjMsMTUgQzI2LjM4MTc4MjMsMTUgMjYuNTE3NDQsMTUuMDU3Mjg4IDI2LjYzMzcyMjgsMTUuMTcxODcxMyBMMjcuODI1NTgxNCwxNi4zNDYzNTIzIEMyNy45NDE4NjA1LDE2LjQ2MDkzNTcgMjgsMTYuNTk0NjE1IDI4LDE2Ljc0NzM5NCBDMjgsMTYuOTAwMTczIDI3Ljk0MTg2MDUsMTcuMDMzODUyMyAyNy44MjU1ODE0LDE3LjE0ODQzNTcgTDI3LjgyNTU4MTQsMTcuMTQ4NDM1NyBaIiBpZD0iUGF0aCIgZmlsbD0iI0ZGRkZGRiI+PC9wYXRoPgogICAgICAgICAgICAgICAgICAgIDwvZz4KICAgICAgICAgICAgICAgIDwvZz4KICAgICAgICAgICAgPC9nPgogICAgICAgIDwvZz4KICAgIDwvZz4KPC9zdmc+";
},function(e,t){e.exports="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+Cjxzdmcgd2lkdGg9IjQwcHgiIGhlaWdodD0iNDBweCIgdmlld0JveD0iMCAwIDQwIDQwIiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPgogICAgPCEtLSBHZW5lcmF0b3I6IFNrZXRjaCAzOS4xICgzMTcyMCkgLSBodHRwOi8vd3d3LmJvaGVtaWFuY29kaW5nLmNvbS9za2V0Y2ggLS0+CiAgICA8dGl0bGU+aWNvbl93YXJuaW5nPC90aXRsZT4KICAgIDxkZXNjPkNyZWF0ZWQgd2l0aCBTa2V0Y2guPC9kZXNjPgogICAgPGRlZnM+PC9kZWZzPgogICAgPGcgaWQ9IlBhZ2UtMSIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICAgICAgPGcgaWQ9Ik1lc3NhZ2UiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC02MC4wMDAwMDAsIC0yNzIuMDAwMDAwKSI+CiAgICAgICAgICAgIDxnIGlkPSLluKblgL7lkJFf5L+h5oGvLWNvcHkiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDYwLjAwMDAwMCwgMjcyLjAwMDAwMCkiPgogICAgICAgICAgICAgICAgPGcgaWQ9IlJlY3RhbmdsZS0yIj4KICAgICAgICAgICAgICAgICAgICA8ZyBpZD0iaWNvbl93YXJuaW5nIj4KICAgICAgICAgICAgICAgICAgICAgICAgPHJlY3QgaWQ9IlJlY3RhbmdsZS0yIiBmaWxsPSIjRjdCQTJBIiB4PSIwIiB5PSIwIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiPjwvcmVjdD4KICAgICAgICAgICAgICAgICAgICAgICAgPHBhdGggZD0iTTIxLjYxNTM4NDYsMjYuNTQzMjA5OSBDMjEuNjE1Mzg0NiwyNi45NDc4NzUxIDIxLjQ1ODMzNDgsMjcuMjkxODM2OCAyMS4xNDQyMzA4LDI3LjU3NTEwMjkgQzIwLjgzMDEyNjgsMjcuODU4MzY4OSAyMC40NDg3MTk0LDI4IDIwLDI4IEMxOS41NTEyODA2LDI4IDE5LjE2OTg3MzIsMjcuODU4MzY4OSAxOC44NTU3NjkyLDI3LjU3NTEwMjkgQzE4LjU0MTY2NTIsMjcuMjkxODM2OCAxOC4zODQ2MTU0LDI2Ljk0Nzg3NTEgMTguMzg0NjE1NCwyNi41NDMyMDk5IEwxOC4zODQ2MTU0LDE5Ljc0NDg1NiBDMTguMzg0NjE1NCwxOS4zNDAxOTA3IDE4LjU0MTY2NTIsMTguOTk2MjI5IDE4Ljg1NTc2OTIsMTguNzEyOTYzIEMxOS4xNjk4NzMyLDE4LjQyOTY5NjkgMTkuNTUxMjgwNiwxOC4yODgwNjU4IDIwLDE4LjI4ODA2NTggQzIwLjQ0ODcxOTQsMTguMjg4MDY1OCAyMC44MzAxMjY4LDE4LjQyOTY5NjkgMjEuMTQ0MjMwOCwxOC43MTI5NjMgQzIxLjQ1ODMzNDgsMTguOTk2MjI5IDIxLjYxNTM4NDYsMTkuMzQwMTkwNyAyMS42MTUzODQ2LDE5Ljc0NDg1NiBMMjEuNjE1Mzg0NiwyNi41NDMyMDk5IFogTTIwLDE1LjgwNDI5ODEgQzE5LjQ0NDQ0MjcsMTUuODA0Mjk4MSAxOC45NzIyMjQsMTUuNjE5MzY4NyAxOC41ODMzMzMzLDE1LjI0OTUwNDYgQzE4LjE5NDQ0MjcsMTQuODc5NjQwNiAxOCwxNC40MzA1MjU1IDE4LDEzLjkwMjE0OTEgQzE4LDEzLjM3Mzc3MjYgMTguMTk0NDQyNywxMi45MjQ2NTc1IDE4LjU4MzMzMzMsMTIuNTU0NzkzNSBDMTguOTcyMjI0LDEyLjE4NDkyOTUgMTkuNDQ0NDQyNywxMiAyMCwxMiBDMjAuNTU1NTU3MywxMiAyMS4wMjc3NzYsMTIuMTg0OTI5NSAyMS40MTY2NjY3LDEyLjU1NDc5MzUgQzIxLjgwNTU1NzMsMTIuOTI0NjU3NSAyMiwxMy4zNzM3NzI2IDIyLDEzLjkwMjE0OTEgQzIyLDE0LjQzMDUyNTUgMjEuODA1NTU3MywxNC44Nzk2NDA2IDIxLjQxNjY2NjcsMTUuMjQ5NTA0NiBDMjEuMDI3Nzc2LDE1LjYxOTM2ODcgMjAuNTU1NTU3MywxNS44MDQyOTgxIDIwLDE1LjgwNDI5ODEgWiIgaWQ9IkNvbWJpbmVkLVNoYXBlIiBmaWxsPSIjRkZGRkZGIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgyMC4wMDAwMDAsIDIwLjAwMDAwMCkgc2NhbGUoMSwgLTEpIHRyYW5zbGF0ZSgtMjAuMDAwMDAwLCAtMjAuMDAwMDAwKSAiPjwvcGF0aD4KICAgICAgICAgICAgICAgICAgICA8L2c+CiAgICAgICAgICAgICAgICA8L2c+CiAgICAgICAgICAgIDwvZz4KICAgICAgICA8L2c+CiAgICA8L2c+Cjwvc3ZnPg=="},function(e,t){e.exports={render:function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("transition",{attrs:{name:"el-message-fade"}},[i("div",{directives:[{name:"show",rawName:"v-show",value:e.visible,expression:"visible"}],staticClass:"el-message",class:e.customClass,on:{mouseenter:e.clearTimer,mouseleave:e.startTimer}},[e.iconClass?e._e():i("img",{staticClass:"el-message__img",attrs:{src:e.typeImg,alt:""}}),i("div",{staticClass:"el-message__group",class:{"is-with-icon":e.iconClass}},[e._t("default",[i("p",[e.iconClass?i("i",{staticClass:"el-message__icon",class:e.iconClass}):e._e(),e._v(e._s(e.message))])]),e.showClose?i("div",{staticClass:"el-message__closeBtn el-icon-close",on:{click:e.close}}):e._e()],2)])])},staticRenderFns:[]}},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0;var s=i(330),o=n(s);o.default.install=function(e){e.component(o.default.name,o.default)},t.default=o.default},function(e,t,i){var n=i(5)(i(331),i(332),null,null,null);e.exports=n.exports},function(e,t){"use strict";t.__esModule=!0,t.default={name:"ElBadge",props:{value:{},max:Number,isDot:Boolean,hidden:Boolean},computed:{content:function(){if(!this.isDot){var e=this.value,t=this.max;return"number"==typeof e&&"number"==typeof t&&t<e?t+"+":e}}}}},function(e,t){e.exports={render:function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("div",{staticClass:"el-badge"},[e._t("default"),i("transition",{attrs:{name:"el-zoom-in-center"}},[i("sup",{directives:[{name:"show",rawName:"v-show",value:!e.hidden&&(e.content||e.isDot),expression:"!hidden && ( content || isDot )"}],staticClass:"el-badge__content",class:{"is-fixed":e.$slots.default,"is-dot":e.isDot},domProps:{textContent:e._s(e.content)}})])],2)},staticRenderFns:[]}},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0;var s=i(334),o=n(s);o.default.install=function(e){e.component(o.default.name,o.default)},t.default=o.default},function(e,t,i){var n=i(5)(i(335),i(336),null,null,null);e.exports=n.exports},function(e,t){"use strict";t.__esModule=!0,t.default={name:"ElCard",props:["header","bodyStyle"]}},function(e,t){e.exports={render:function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("div",{staticClass:"el-card"},[e.$slots.header||e.header?i("div",{staticClass:"el-card__header"},[e._t("header",[e._v(e._s(e.header))])],2):e._e(),i("div",{staticClass:"el-card__body",style:e.bodyStyle},[e._t("default")],2)])},staticRenderFns:[]}},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0;var s=i(338),o=n(s);o.default.install=function(e){e.component(o.default.name,o.default)},t.default=o.default},function(e,t,i){var n=i(5)(i(339),i(340),null,null,null);e.exports=n.exports},function(e,t,i){"use strict";t.__esModule=!0;var n=i(30);t.default={name:"ElRate",data:function(){return{classMap:{},colorMap:{},pointerAtLeftHalf:!0,currentValue:this.value,hoverIndex:-1}},props:{value:{type:Number,default:0},lowThreshold:{type:Number,default:2},highThreshold:{type:Number,default:4},max:{type:Number,default:5},colors:{type:Array,default:function(){return["#F7BA2A","#F7BA2A","#F7BA2A"]}},voidColor:{type:String,default:"#C6D1DE"},disabledVoidColor:{type:String,default:"#EFF2F7"},iconClasses:{type:Array,default:function(){return["el-icon-star-on","el-icon-star-on","el-icon-star-on"]}},voidIconClass:{type:String,default:"el-icon-star-off"},disabledVoidIconClass:{type:String,default:"el-icon-star-on"},disabled:{type:Boolean,default:!1},allowHalf:{type:Boolean,default:!1},showText:{type:Boolean,default:!1},textColor:{type:String,default:"#1f2d3d"},texts:{type:Array,default:function(){return["极差","失望","一般","满意","惊喜"]}},textTemplate:{type:String,default:"{value}"}},computed:{text:function(){var e="";return e=this.disabled?this.textTemplate.replace(/\{\s*value\s*\}/,this.value):this.texts[Math.ceil(this.currentValue)-1]},decimalStyle:function(){var e="";return this.disabled&&(e=(this.valueDecimal<50?0:50)+"%"),this.allowHalf&&(e="50%"),{color:this.activeColor,width:e}},valueDecimal:function(){return 100*this.value-100*Math.floor(this.value)},decimalIconClass:function(){return this.getValueFromMap(this.value,this.classMap)},voidClass:function(){return this.disabled?this.classMap.disabledVoidClass:this.classMap.voidClass},activeClass:function(){return this.getValueFromMap(this.currentValue,this.classMap)},activeColor:function(){return this.getValueFromMap(this.currentValue,this.colorMap)},classes:function(){var e=[],t=0,i=this.currentValue;for(this.allowHalf&&this.currentValue!==Math.floor(this.currentValue)&&i--;t<i;t++)e.push(this.activeClass);for(;t<this.max;t++)e.push(this.voidClass);return e}},watch:{value:function(e){this.$emit("change",e),this.currentValue=e,this.pointerAtLeftHalf=this.value!==Math.floor(this.value)}},methods:{getValueFromMap:function(e,t){var i="";return i=e<=this.lowThreshold?t.lowColor||t.lowClass:e>=this.highThreshold?t.highColor||t.highClass:t.mediumColor||t.mediumClass},showDecimalIcon:function(e){var t=this.disabled&&this.valueDecimal>0&&e-1<this.value&&e>this.value,i=this.allowHalf&&this.pointerAtLeftHalf&&e-.5<=this.currentValue&&e>this.currentValue;return t||i},getIconStyle:function(e){var t=this.disabled?this.colorMap.disabledVoidColor:this.colorMap.voidColor;return{color:e<=this.currentValue?this.activeColor:t}},selectValue:function(e){this.disabled||(this.allowHalf&&this.pointerAtLeftHalf?this.$emit("input",this.currentValue):this.$emit("input",e))},setCurrentValue:function(e,t){if(!this.disabled){if(this.allowHalf){var i=t.target;(0,n.hasClass)(i,"el-rate__item")&&(i=i.querySelector(".el-rate__icon")),(0,n.hasClass)(i,"el-rate__decimal")&&(i=i.parentNode),this.pointerAtLeftHalf=2*t.offsetX<=i.clientWidth,this.currentValue=this.pointerAtLeftHalf?e-.5:e}else this.currentValue=e;this.hoverIndex=e}},resetCurrentValue:function(){this.disabled||(this.allowHalf&&(this.pointerAtLeftHalf=this.value!==Math.floor(this.value)),this.currentValue=this.value,this.hoverIndex=-1)}},created:function(){this.value||this.$emit("input",0),this.classMap={lowClass:this.iconClasses[0],mediumClass:this.iconClasses[1],highClass:this.iconClasses[2],voidClass:this.voidIconClass,disabledVoidClass:this.disabledVoidIconClass},this.colorMap={lowColor:this.colors[0],mediumColor:this.colors[1],highColor:this.colors[2],voidColor:this.voidColor,disabledVoidColor:this.disabledVoidColor}}}},function(e,t){e.exports={render:function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("div",{staticClass:"el-rate"},[e._l(e.max,function(t){return i("span",{staticClass:"el-rate__item",style:{cursor:e.disabled?"auto":"pointer"},on:{mousemove:function(i){e.setCurrentValue(t,i)},mouseleave:e.resetCurrentValue,click:function(i){e.selectValue(t)}}},[i("i",{staticClass:"el-rate__icon",class:[e.classes[t-1],{hover:e.hoverIndex===t}],style:e.getIconStyle(t)},[e.showDecimalIcon(t)?i("i",{staticClass:"el-rate__decimal",class:e.decimalIconClass,style:e.decimalStyle}):e._e()])])}),e.showText?i("span",{staticClass:"el-rate__text",style:{color:e.textColor}},[e._v(e._s(e.text))]):e._e()],2)},staticRenderFns:[]}},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0;var s=i(342),o=n(s);o.default.install=function(e){e.component(o.default.name,o.default)},t.default=o.default},function(e,t,i){var n=i(5)(i(343),i(344),null,null,null);e.exports=n.exports},function(e,t){"use strict";t.__esModule=!0,t.default={name:"ElSteps",props:{space:[Number,String],active:Number,direction:{type:String,default:"horizontal"},alignCenter:Boolean,center:Boolean,finishStatus:{type:String,default:"finish"},processStatus:{type:String,default:"process"}},data:function(){return{steps:[],stepOffset:0}},watch:{active:function(e,t){this.$emit("change",e,t)},steps:function(e){var t=this;e.forEach(function(e,t){e.index=t}),this.center&&!function(){var i=e.length;t.$nextTick(function(){t.stepOffset=e[i-1].$el.getBoundingClientRect().width/(i-1)})}()}}}},function(e,t){e.exports={render:function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("div",{staticClass:"el-steps",class:["is-"+e.direction,e.center?"is-center":""]},[e._t("default")],2)},staticRenderFns:[]}},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0;var s=i(346),o=n(s);o.default.install=function(e){e.component(o.default.name,o.default)},t.default=o.default},function(e,t,i){var n=i(5)(i(347),i(348),null,null,null);e.exports=n.exports},function(e,t){"use strict";t.__esModule=!0,t.default={name:"ElStep",props:{title:String,icon:String,description:String,status:String},data:function(){return{index:-1,lineStyle:{},mainOffset:0,internalStatus:""}},beforeCreate:function(){this.$parent.steps.push(this)},beforeDestroy:function(){var e=this.$parent.steps,t=e.indexOf(this);t>=0&&e.splice(t,1)},computed:{currentStatus:function(){return this.status||this.internalStatus},prevStatus:function(){var e=this.$parent.steps[this.index-1];return e?e.currentStatus:"wait"},isLast:function(){var e=this.$parent;return e.steps[e.steps.length-1]===this},style:function(){var e=this.$parent,t=e.center,i=e.steps.length;if(t&&this.isLast)return{};var n="number"==typeof e.space?e.space+"px":e.space?e.space:100/(t?i-1:i)+"%";return"horizontal"===e.direction?{width:n}:this.isLast?void 0:{height:n}}},methods:{updateStatus:function(e){var t=this.$parent.$children[this.index-1];e>this.index?this.internalStatus=this.$parent.finishStatus:e===this.index&&"error"!==this.prevStatus?this.internalStatus=this.$parent.processStatus:this.internalStatus="wait",t&&t.calcProgress(this.internalStatus)},calcProgress:function(e){var t=100,i={};i.transitionDelay=150*this.index+"ms",e===this.$parent.processStatus?t="error"!==this.currentStatus?50:0:"wait"===e&&(t=0,i.transitionDelay=-150*this.index+"ms"),i.borderWidth=t?"1px":0,"vertical"===this.$parent.direction?i.height=t+"%":i.width=t+"%",this.lineStyle=i}},mounted:function(){var e=this,t=this.$parent;"horizontal"===t.direction&&t.alignCenter&&(this.mainOffset=-this.$refs.title.getBoundingClientRect().width/2+16+"px");var i=this.$watch("index",function(t){e.$watch("$parent.active",e.updateStatus,{immediate:!0}),i()})}}},function(e,t){e.exports={render:function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("div",{staticClass:"el-step",class:["is-"+e.$parent.direction],style:[e.style,e.isLast?"":{marginRight:-e.$parent.stepOffset+"px"}]},[i("div",{staticClass:"el-step__head",class:["is-"+e.currentStatus,{"is-text":!e.icon}]},[i("div",{staticClass:"el-step__line",class:["is-"+e.$parent.direction,{"is-icon":e.icon}],style:e.isLast?"":{marginRight:e.$parent.stepOffset+"px"}},[i("i",{staticClass:"el-step__line-inner",style:e.lineStyle})]),i("span",{staticClass:"el-step__icon"},["success"!==e.currentStatus&&"error"!==e.currentStatus?e._t("icon",[e.icon?i("i",{class:["el-icon-"+e.icon]}):i("div",[e._v(e._s(e.index+1))])]):i("i",{class:["el-icon-"+("success"===e.currentStatus?"check":"close")]})],2)]),i("div",{staticClass:"el-step__main",style:{marginLeft:e.mainOffset}},[i("div",{ref:"title",staticClass:"el-step__title",class:["is-"+e.currentStatus]},[e._t("title",[e._v(e._s(e.title))])],2),i("div",{staticClass:"el-step__description",class:["is-"+e.currentStatus]},[e._t("description",[e._v(e._s(e.description))])],2)])])},staticRenderFns:[]}},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0;var s=i(350),o=n(s);o.default.install=function(e){e.component(o.default.name,o.default)},t.default=o.default},function(e,t,i){var n=i(5)(i(351),i(352),null,null,null);e.exports=n.exports},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0;var s=i(47),o=n(s),a=i(43);t.default={name:"ElCarousel",props:{initialIndex:{type:Number,default:0},height:String,trigger:{type:String,default:"hover"},autoplay:{type:Boolean,default:!0},interval:{type:Number,default:3e3},indicatorPosition:String,indicator:{type:Boolean,default:!0},arrow:{type:String,default:"hover"},type:String},data:function(){return{items:[],activeIndex:-1,containerWidth:0,timer:null,hover:!1}},computed:{hasLabel:function(){return this.items.some(function(e){return e.label.toString().length>0})}},watch:{items:function(e){e.length>0&&this.setActiveItem(this.initialIndex)},activeIndex:function(e,t){this.resetItemPosition(t),this.$emit("change",e,t)},autoplay:function(e){e?this.startTimer():this.pauseTimer()}},methods:{handleMouseEnter:function(){this.hover=!0,this.pauseTimer()},handleMouseLeave:function(){this.hover=!1,this.startTimer()},itemInStage:function(e,t){var i=this.items.length;return t===i-1&&e.inStage&&this.items[0].active||e.inStage&&this.items[t+1]&&this.items[t+1].active?"left":!!(0===t&&e.inStage&&this.items[i-1].active||e.inStage&&this.items[t-1]&&this.items[t-1].active)&&"right"},handleButtonEnter:function(e){var t=this;this.items.forEach(function(i,n){e===t.itemInStage(i,n)&&(i.hover=!0)})},handleButtonLeave:function(){this.items.forEach(function(e){e.hover=!1})},updateItems:function(){this.items=this.$children.filter(function(e){return"ElCarouselItem"===e.$options.name})},resetItemPosition:function(e){var t=this;this.items.forEach(function(i,n){i.translateItem(n,t.activeIndex,e)})},playSlides:function(){this.activeIndex<this.items.length-1?this.activeIndex++:this.activeIndex=0},pauseTimer:function(){clearInterval(this.timer)},startTimer:function(){this.interval<=0||!this.autoplay||(this.timer=setInterval(this.playSlides,this.interval))},setActiveItem:function(e){if("string"==typeof e){var t=this.items.filter(function(t){return t.name===e});t.length>0&&(e=this.items.indexOf(t[0]))}if(e=Number(e),!isNaN(e)&&e===Math.floor(e)){var i=this.items.length;e<0?this.activeIndex=i-1:e>=i?this.activeIndex=0:this.activeIndex=e}},prev:function(){this.setActiveItem(this.activeIndex-1)},next:function(){this.setActiveItem(this.activeIndex+1)},handleIndicatorClick:function(e){this.activeIndex=e},handleIndicatorHover:function(e){"hover"===this.trigger&&e!==this.activeIndex&&(this.activeIndex=e)}},created:function(){var e=this;this.throttledArrowClick=(0,o.default)(300,!0,function(t){e.setActiveItem(t)}),this.throttledIndicatorHover=(0,o.default)(300,function(t){e.handleIndicatorHover(t)})},mounted:function(){var e=this;this.updateItems(),this.$nextTick(function(){(0,a.addResizeListener)(e.$el,e.resetItemPosition),e.initialIndex<e.items.length&&e.initialIndex>=0&&(e.activeIndex=e.initialIndex),e.startTimer()})},beforeDestroy:function(){this.$el&&(0,a.removeResizeListener)(this.$el,this.resetItemPosition)}}},function(e,t){e.exports={render:function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("div",{staticClass:"el-carousel",class:{"el-carousel--card":"card"===e.type},on:{mouseenter:function(t){t.stopPropagation(),e.handleMouseEnter(t)},mouseleave:function(t){t.stopPropagation(),e.handleMouseLeave(t)}}},[i("div",{staticClass:"el-carousel__container",style:{height:e.height}},[i("transition",{attrs:{name:"carousel-arrow-left"}},["never"!==e.arrow?i("button",{directives:[{name:"show",rawName:"v-show",value:"always"===e.arrow||e.hover,expression:"arrow === 'always' || hover"}],staticClass:"el-carousel__arrow el-carousel__arrow--left",on:{mouseenter:function(t){e.handleButtonEnter("left")},mouseleave:e.handleButtonLeave,click:function(t){t.stopPropagation(),e.throttledArrowClick(e.activeIndex-1)}}},[i("i",{staticClass:"el-icon-arrow-left"})]):e._e()]),i("transition",{attrs:{name:"carousel-arrow-right"}},["never"!==e.arrow?i("button",{directives:[{name:"show",rawName:"v-show",value:"always"===e.arrow||e.hover,expression:"arrow === 'always' || hover"}],staticClass:"el-carousel__arrow el-carousel__arrow--right",on:{mouseenter:function(t){e.handleButtonEnter("right")},mouseleave:e.handleButtonLeave,click:function(t){t.stopPropagation(),e.throttledArrowClick(e.activeIndex+1)}}},[i("i",{staticClass:"el-icon-arrow-right"})]):e._e()]),e._t("default")],2),"none"!==e.indicatorPosition?i("ul",{staticClass:"el-carousel__indicators",class:{"el-carousel__indicators--labels":e.hasLabel,"el-carousel__indicators--outside":"outside"===e.indicatorPosition||"card"===e.type}},e._l(e.items,function(t,n){return i("li",{staticClass:"el-carousel__indicator",class:{"is-active":n===e.activeIndex},on:{mouseenter:function(t){e.throttledIndicatorHover(n)},click:function(t){t.stopPropagation(),e.handleIndicatorClick(n)}}},[i("button",{staticClass:"el-carousel__button"},[e.hasLabel?i("span",[e._v(e._s(t.label))]):e._e()])])})):e._e()])},staticRenderFns:[]}},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0;var s=i(354),o=n(s);o.default.install=function(e){e.component(o.default.name,o.default)},t.default=o.default},function(e,t,i){var n=i(5)(i(355),i(356),null,null,null);e.exports=n.exports},function(e,t){"use strict";t.__esModule=!0;var i=.83;t.default={name:"ElCarouselItem",props:{name:String,label:{type:[String,Number],default:""}},data:function(){return{hover:!1,translate:0,scale:1,active:!1,ready:!1,inStage:!1,animating:!1}},methods:{processIndex:function(e,t,i){return 0===t&&e===i-1?-1:t===i-1&&0===e?i:e<t-1&&t-e>=i/2?i+1:e>t+1&&e-t>=i/2?-2:e},calculateTranslate:function(e,t,n){return this.inStage?n*((2-i)*(e-t)+1)/4:e<t?-(1+i)*n/4:(3+i)*n/4},translateItem:function(e,t,n){var s=this.$parent.$el.offsetWidth,o=this.$parent.items.length;"card"!==this.$parent.type&&void 0!==n&&(this.animating=e===t||e===n),e!==t&&o>2&&(e=this.processIndex(e,t,o)),"card"===this.$parent.type?(this.inStage=Math.round(Math.abs(e-t))<=1,this.active=e===t,this.translate=this.calculateTranslate(e,t,s),this.scale=this.active?1:i):(this.active=e===t,this.translate=s*(e-t)),this.ready=!0},handleItemClick:function(){var e=this.$parent;if(e&&"card"===e.type){var t=e.items.indexOf(this);e.setActiveItem(t)}}},created:function(){this.$parent&&this.$parent.updateItems()},destroyed:function(){this.$parent&&this.$parent.updateItems()}}},function(e,t){e.exports={render:function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("div",{directives:[{name:"show",rawName:"v-show",value:e.ready,expression:"ready"}],staticClass:"el-carousel__item",class:{"is-active":e.active,"el-carousel__item--card":"card"===e.$parent.type,"is-in-stage":e.inStage,"is-hover":e.hover,"is-animating":e.animating},style:{msTransform:"translateX("+e.translate+"px) scale("+e.scale+")",webkitTransform:"translateX("+e.translate+"px) scale("+e.scale+")",transform:"translateX("+e.translate+"px) scale("+e.scale+")"},on:{click:e.handleItemClick}},["card"===e.$parent.type?i("div",{directives:[{name:"show",rawName:"v-show",value:!e.active,expression:"!active"}],staticClass:"el-carousel__mask"}):e._e(),e._t("default")],2)},staticRenderFns:[]}},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0;var s=i(358),o=n(s);o.default.install=function(e){e.component(o.default.name,o.default)},t.default=o.default},function(e,t,i){var n=i(5)(i(359),i(360),null,null,null);e.exports=n.exports},function(e,t){"use strict";t.__esModule=!0,t.default={name:"ElCollapse",componentName:"ElCollapse",props:{accordion:Boolean,value:{type:[Array,String,Number],default:function(){return[]}}},data:function(){return{activeNames:[].concat(this.value)}},watch:{value:function(e){this.activeNames=[].concat(e)}},methods:{setActiveNames:function(e){e=[].concat(e);var t=this.accordion?e[0]:e;this.activeNames=e,this.$emit("input",t),this.$emit("change",t)},handleItemClick:function(e){if(this.accordion)this.setActiveNames(!this.activeNames[0]&&0!==this.activeNames[0]||this.activeNames[0]!==e.name?e.name:"");else{var t=this.activeNames.slice(0),i=t.indexOf(e.name);i>-1?t.splice(i,1):t.push(e.name),this.setActiveNames(t)}}},created:function(){this.$on("item-click",this.handleItemClick)}}},function(e,t){e.exports={render:function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("div",{staticClass:"el-collapse"},[e._t("default")],2)},staticRenderFns:[]}},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0;var s=i(362),o=n(s);o.default.install=function(e){e.component(o.default.name,o.default)},t.default=o.default},function(e,t,i){var n=i(5)(i(363),i(364),null,null,null);e.exports=n.exports},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0;var s=i(89),o=n(s),a=i(11),r=n(a);t.default={name:"ElCollapseItem",componentName:"ElCollapseItem",mixins:[r.default],components:{ElCollapseTransition:o.default},data:function(){return{contentWrapStyle:{height:"auto",display:"block"},contentHeight:0}},props:{title:String,name:{type:[String,Number],default:function(){return this._uid}}},computed:{isActive:function(){return this.$parent.activeNames.indexOf(this.name)>-1}},watch:{isActive:function(e){}},methods:{handleHeaderClick:function(){this.dispatch("ElCollapse","item-click",this)}},mounted:function(){}}},function(e,t){e.exports={render:function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("div",{staticClass:"el-collapse-item",class:{"is-active":e.isActive}},[i("div",{staticClass:"el-collapse-item__header",on:{click:e.handleHeaderClick}},[i("i",{staticClass:"el-collapse-item__header__arrow el-icon-arrow-right"}),e._t("title",[e._v(e._s(e.title))])],2),i("el-collapse-transition",[i("div",{directives:[{name:"show",rawName:"v-show",value:e.isActive,expression:"isActive"}],staticClass:"el-collapse-item__wrap"},[i("div",{staticClass:"el-collapse-item__content"},[e._t("default")],2)])])],1)},staticRenderFns:[]}},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0;var s=i(366),o=n(s);o.default.install=function(e){e.component(o.default.name,o.default)},t.default=o.default},function(e,t,i){var n=i(5)(i(367),i(372),null,null,null);e.exports=n.exports},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0;var s=i(15),o=n(s),a=i(368),r=n(a),l=i(19),u=n(l),c=i(27),d=n(c),h=i(48),f=n(h),p=i(11),m=n(p),v=i(12),g=n(v),y=i(13),b=i(46),_=n(b),C={props:{placement:{type:String,default:"bottom-start"},appendToBody:d.default.props.appendToBody,offset:d.default.props.offset,boundariesPadding:d.default.props.boundariesPadding,popperOptions:d.default.props.popperOptions},methods:d.default.methods,data:d.default.data,beforeDestroy:d.default.beforeDestroy};t.default={name:"ElCascader",directives:{Clickoutside:f.default},mixins:[C,m.default,g.default],components:{ElInput:u.default},props:{options:{type:Array,required:!0},props:{type:Object,default:function(){return{children:"children",label:"label",value:"value",disabled:"disabled"}}},value:{type:Array,default:function(){return[]}},placeholder:{type:String,default:function(){return(0,y.t)("el.cascader.placeholder")}},disabled:Boolean,clearable:{type:Boolean,default:!1},changeOnSelect:Boolean,popperClass:String,expandTrigger:{type:String,default:"click"},filterable:Boolean,size:String,showAllLevels:{type:Boolean,default:!0},debounce:{type:Number,default:300},beforeFilter:{type:Function,default:function(){return function(){}}}},data:function(){return{currentValue:this.value||[],menu:null,debouncedInputChange:function(){},menuVisible:!1,inputHover:!1,inputValue:"",flatOptions:null}},computed:{labelKey:function(){return this.props.label||"label"},valueKey:function(){return this.props.value||"value"},childrenKey:function(){return this.props.children||"children"},currentLabels:function(){var e=this,t=this.options,i=[];return this.currentValue.forEach(function(n){var s=t&&t.filter(function(t){return t[e.valueKey]===n})[0];s&&(i.push(s[e.labelKey]),t=s[e.childrenKey])}),i}},watch:{menuVisible:function(e){e?this.showMenu():this.hideMenu()},value:function(e){this.currentValue=e},currentValue:function(e){this.dispatch("ElFormItem","el.form.change",[e])},options:{deep:!0,handler:function(e){this.menu||this.initMenu(),this.flatOptions=this.flattenOptions(this.options),this.menu.options=e}}},methods:{initMenu:function(){this.menu=new o.default(r.default).$mount(),this.menu.options=this.options,this.menu.props=this.props,this.menu.expandTrigger=this.expandTrigger,this.menu.changeOnSelect=this.changeOnSelect,this.menu.popperClass=this.popperClass,this.popperElm=this.menu.$el,this.menu.$on("pick",this.handlePick),this.menu.$on("activeItemChange",this.handleActiveItemChange),this.menu.$on("menuLeave",this.doDestroy)},showMenu:function(){var e=this;this.menu||this.initMenu(),this.menu.value=this.currentValue.slice(0),this.menu.visible=!0,this.menu.options=this.options,this.$nextTick(function(t){e.updatePopper(),e.menu.inputWidth=e.$refs.input.$el.offsetWidth-2})},hideMenu:function(){this.inputValue="",this.menu.visible=!1},handleActiveItemChange:function(e){var t=this;this.$nextTick(function(e){t.updatePopper()}),this.$emit("active-item-change",e)},handlePick:function(e){var t=!(arguments.length>1&&void 0!==arguments[1])||arguments[1];this.currentValue=e,this.$emit("input",e),this.$emit("change",e),t?this.menuVisible=!1:this.$nextTick(this.updatePopper)},handleInputChange:function(e){var t=this;if(this.menuVisible){var i=this.flatOptions;if(!e)return this.menu.options=this.options,void this.$nextTick(this.updatePopper);var n=i.filter(function(i){return i.some(function(i){return new RegExp(e,"i").test(i[t.labelKey])})});n=n.length>0?n.map(function(i){return{__IS__FLAT__OPTIONS:!0,value:i.map(function(e){return e[t.valueKey]}),label:t.renderFilteredOptionLabel(e,i)}}):[{__IS__FLAT__OPTIONS:!0,label:this.t("el.cascader.noMatch"),value:"",disabled:!0}],this.menu.options=n,this.$nextTick(this.updatePopper)}},renderFilteredOptionLabel:function(e,t){var i=this;return t.map(function(t,n){var s=t[i.labelKey],o=s.toLowerCase().indexOf(e.toLowerCase()),a=s.slice(o,e.length+o),r=o>-1?i.highlightKeyword(s,a):s;return 0===n?r:[" / ",r]})},highlightKeyword:function(e,t){var i=this,n=this._c;return e.split(t).map(function(e,s){return 0===s?e:[n("span",{class:{"el-cascader-menu__item__keyword":!0}},[i._v(t)]),e]})},flattenOptions:function(e){var t=this,i=arguments.length>1&&void 0!==arguments[1]?arguments[1]:[],n=[];return e.forEach(function(e){var s=i.concat(e);e[t.childrenKey]?(t.changeOnSelect&&n.push(s),n=n.concat(t.flattenOptions(e[t.childrenKey],s))):n.push(s)}),n},clearValue:function(e){e.stopPropagation(),this.handlePick([],!0)},handleClickoutside:function(){this.menuVisible=!1},handleClick:function(){if(!this.disabled)return this.filterable?(this.menuVisible=!0,void this.$refs.input.$refs.input.focus()):void(this.menuVisible=!this.menuVisible)}},created:function(){var e=this;this.debouncedInputChange=(0,_.default)(this.debounce,function(t){var i=e.beforeFilter(t);i&&i.then?(e.menu.options=[{__IS__FLAT__OPTIONS:!0,label:e.t("el.cascader.loading"),value:"",disabled:!0}],i.then(function(){e.$nextTick(function(){e.handleInputChange(t)})})):i!==!1&&e.$nextTick(function(){e.handleInputChange(t)})})},mounted:function(){this.flatOptions=this.flattenOptions(this.options)}}},function(e,t,i){var n=i(5)(i(369),null,null,null,null);e.exports=n.exports},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0;var s=i(370),o=n(s),a=i(371),r=i(49),l=n(r),u=function e(t,i){if(!t||!Array.isArray(t)||!i)return t;var n=[],s=["__IS__FLAT__OPTIONS","label","value","disabled"],o=i.children||"children";return t.forEach(function(t){var a={};s.forEach(function(e){var n=i[e]||e,s=t[n];void 0!==s&&(a[n]=s)}),Array.isArray(t[o])&&(a[o]=e(t[o],i)),n.push(a)}),n};t.default={name:"ElCascaderMenu",data:function(){return{inputWidth:0,options:[],props:{},visible:!1,activeValue:[],value:[],expandTrigger:"click",changeOnSelect:!1,popperClass:""}},watch:{visible:function(e){e&&(this.activeValue=this.value)},value:{immediate:!0,handler:function(e){this.activeValue=e}}},computed:{activeOptions:{cache:!1,get:function(){var e=this,t=this.activeValue,i=["label","value","children","disabled"],n=function t(n){n.forEach(function(n){n.__IS__FLAT__OPTIONS||(i.forEach(function(t){var i=n[e.props[t]||t];void 0!==i&&(n[t]=i)}),Array.isArray(n.children)&&t(n.children))})},s=function e(i){var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:[],s=n.length;n[s]=i;var o=t[s];return(0,a.isDef)(o)&&(i=i.filter(function(e){return e.value===o})[0],i&&i.children&&e(i.children,n)),n},o=u(this.options,this.props);return n(o),s(o)}}},methods:{select:function(e,t){e.__IS__FLAT__OPTIONS?this.activeValue=e.value:t?this.activeValue.splice(t,this.activeValue.length-1,e.value):this.activeValue=[e.value],this.$emit("pick",this.activeValue.slice())},handleMenuLeave:function(){this.$emit("menuLeave")},activeItem:function(e,t){var i=this.activeOptions.length;this.activeValue.splice(t,i,e.value),this.activeOptions.splice(t+1,i,e.children),this.changeOnSelect?this.$emit("pick",this.activeValue.slice(),!1):this.$emit("activeItemChange",this.activeValue)},scrollMenu:function(e){(0,l.default)(e,e.getElementsByClassName("is-active")[0])},handleMenuEnter:function(){var e=this;this.$nextTick(function(){return e.$refs.menus.forEach(function(t){
return e.scrollMenu(t)})})}},render:function(e){var t=this,i=this.activeValue,n=this.activeOptions,s=this.visible,a=this.expandTrigger,r=this.popperClass,l=this._l(n,function(n,s){var r=!1,l=t._l(n,function(n){var l={on:{}};if(n.__IS__FLAT__OPTIONS&&(r=!0),!n.disabled)if(n.children){var u={click:"click",hover:"mouseenter"}[a];l.on[u]=function(){t.activeItem(n,s),t.$nextTick(function(){t.scrollMenu(t.$refs.menus[s]),t.scrollMenu(t.$refs.menus[s+1])})}}else l.on.click=function(){t.select(n,s),t.$nextTick(function(){return t.scrollMenu(t.$refs.menus[s])})};return e("li",(0,o.default)([{class:{"el-cascader-menu__item":!0,"el-cascader-menu__item--extensible":n.children,"is-active":n.value===i[s],"is-disabled":n.disabled}},l]),[n.label])}),u={};return r&&(u.minWidth=t.inputWidth+"px"),e("ul",{class:{"el-cascader-menu":!0,"el-cascader-menu--flexible":r},style:u,refInFor:!0,ref:"menus"},[l])});return e("transition",{attrs:{name:"el-zoom-in-top"},on:{"before-enter":this.handleMenuEnter,"after-leave":this.handleMenuLeave}},[e("div",{directives:[{name:"show",value:s}],class:["el-cascader-menus",r],ref:"wrapper"},[l])])}}},function(e,t){function i(e,t){return function(){e.apply(this,arguments),t.apply(this,arguments)}}var n=/^(attrs|props|on|nativeOn|class|style|hook)$/;e.exports=function(e){return e.reduce(function(e,t){var s,o,a,r,l;for(a in t)if(s=e[a],o=t[a],s&&n.test(a))if("class"===a&&("string"==typeof s&&(l=s,e[a]=s={},s[l]=!0),"string"==typeof o&&(l=o,t[a]=o={},o[l]=!0)),"on"===a||"nativeOn"===a||"hook"===a)for(r in o)s[r]=i(s[r],o[r]);else if(Array.isArray(s))e[a]=s.concat(o);else if(Array.isArray(o))e[a]=[s].concat(o);else for(r in o)s[r]=o[r];else e[a]=t[a];return e},{})}},function(e,t){"use strict";function i(e){return void 0!==e&&null!==e}t.__esModule=!0,t.isDef=i},function(e,t){e.exports={render:function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("span",{directives:[{name:"clickoutside",rawName:"v-clickoutside",value:e.handleClickoutside,expression:"handleClickoutside"}],ref:"reference",staticClass:"el-cascader",class:[{"is-opened":e.menuVisible,"is-disabled":e.disabled},e.size?"el-cascader--"+e.size:""],on:{click:e.handleClick,mouseenter:function(t){e.inputHover=!0},mouseleave:function(t){e.inputHover=!1}}},[i("el-input",{ref:"input",attrs:{readonly:!e.filterable,placeholder:e.currentLabels.length?void 0:e.placeholder,"validate-event":!1,size:e.size,disabled:e.disabled},on:{change:e.debouncedInputChange},model:{value:e.inputValue,callback:function(t){e.inputValue=t},expression:"inputValue"}},[i("template",{slot:"icon"},[e.clearable&&e.inputHover&&e.currentLabels.length?i("i",{key:"1",staticClass:"el-input__icon el-icon-circle-close el-cascader__clearIcon",on:{click:e.clearValue}}):i("i",{key:"2",staticClass:"el-input__icon el-icon-caret-bottom",class:{"is-reverse":e.menuVisible}})])],2),i("span",{directives:[{name:"show",rawName:"v-show",value:""===e.inputValue,expression:"inputValue === ''"}],staticClass:"el-cascader__label"},[e.showAllLevels?[e._l(e.currentLabels,function(t,n){return[e._v("\n        "+e._s(t)+"\n        "),n<e.currentLabels.length-1?i("span",[e._v(" / ")]):e._e()]})]:[e._v("\n      "+e._s(e.currentLabels[e.currentLabels.length-1])+"\n    ")]],2)],1)},staticRenderFns:[]}},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0;var s=i(374),o=n(s);o.default.install=function(e){e.component(o.default.name,o.default)},t.default=o.default},function(e,t,i){var n=i(5)(i(375),i(390),null,null,null);e.exports=n.exports},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0;var s=i(376),o=n(s),a=i(377),r=n(a),l=i(48),u=n(l);t.default={name:"ElColorPicker",props:{value:{type:String},showAlpha:{type:Boolean},colorFormat:{type:String}},directives:{Clickoutside:u.default},computed:{displayedColor:function(){if(this.value||this.showPanelColor){var e=this.color.toRgb(),t=e.r,i=e.g,n=e.b;return this.showAlpha?"rgba("+t+", "+i+", "+n+", "+this.color.get("alpha")/100+")":"rgb("+t+", "+i+", "+n+")"}return"transparent"}},watch:{value:function(e){e?e&&e!==this.color.value&&this.color.fromString(e):this.showPanelColor=!1},color:{deep:!0,handler:function(){this.showPanelColor=!0}},displayedColor:function(e){this.$emit("active-change",e)}},methods:{confirmValue:function(e){this.$emit("input",this.color.value),this.$emit("change",this.color.value),this.showPicker=!1},clearValue:function(){this.$emit("input",null),this.$emit("change",null),this.showPanelColor=!1,this.showPicker=!1,this.resetColor()},hide:function(){this.showPicker=!1,this.resetColor()},resetColor:function(){var e=this;this.$nextTick(function(t){e.value?e.color.fromString(e.value):e.showPanelColor=!1})}},mounted:function(){var e=this.value;e&&this.color.fromString(e),this.popperElm=this.$refs.dropdown.$el},data:function(){var e=new o.default({enableAlpha:this.showAlpha,format:this.colorFormat});return{color:e,showPicker:!1,showPanelColor:!1}},components:{PickerDropdown:r.default}}},function(e,t){"use strict";function i(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}t.__esModule=!0;var n="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},s=function(e,t,i){return[e,t*i/((e=(2-t)*i)<1?e:2-e)||0,e/2]},o=function(e){return"string"==typeof e&&e.indexOf(".")!==-1&&1===parseFloat(e)},a=function(e){return"string"==typeof e&&e.indexOf("%")!==-1},r=function(e,t){o(e)&&(e="100%");var i=a(e);return e=Math.min(t,Math.max(0,parseFloat(e))),i&&(e=parseInt(e*t,10)/100),Math.abs(e-t)<1e-6?1:e%t/parseFloat(t)},l={10:"A",11:"B",12:"C",13:"D",14:"E",15:"F"},u=function(e){var t=e.r,i=e.g,n=e.b,s=function(e){e=Math.min(Math.round(e),255);var t=Math.floor(e/16),i=e%16;return""+(l[t]||t)+(l[i]||i)};return isNaN(t)||isNaN(i)||isNaN(n)?"":"#"+s(t)+s(i)+s(n)},c={A:10,B:11,C:12,D:13,E:14,F:15},d=function(e){return 2===e.length?16*(c[e[0].toUpperCase()]||+e[0])+(c[e[1].toUpperCase()]||+e[1]):c[e[1].toUpperCase()]||+e[1]},h=function(e,t,i){t/=100,i/=100;var n=t,s=Math.max(i,.01),o=void 0,a=void 0;return i*=2,t*=i<=1?i:2-i,n*=s<=1?s:2-s,a=(i+t)/2,o=0===i?2*n/(s+n):2*t/(i+t),{h:e,s:100*o,v:100*a}},f=function(e,t,i){e=r(e,255),t=r(t,255),i=r(i,255);var n=Math.max(e,t,i),s=Math.min(e,t,i),o=void 0,a=void 0,l=n,u=n-s;if(a=0===n?0:u/n,n===s)o=0;else{switch(n){case e:o=(t-i)/u+(t<i?6:0);break;case t:o=(i-e)/u+2;break;case i:o=(e-t)/u+4}o/=6}return{h:360*o,s:100*a,v:100*l}},p=function(e,t,i){e=6*r(e,360),t=r(t,100),i=r(i,100);var n=Math.floor(e),s=e-n,o=i*(1-t),a=i*(1-s*t),l=i*(1-(1-s)*t),u=n%6,c=[i,a,o,o,l,i][u],d=[l,i,i,a,o,o][u],h=[o,o,l,i,i,a][u];return{r:Math.round(255*c),g:Math.round(255*d),b:Math.round(255*h)}},m=function(){function e(t){i(this,e),this._hue=0,this._saturation=100,this._value=100,this._alpha=100,this.enableAlpha=!1,this.format="hex",this.value="",t=t||{};for(var n in t)t.hasOwnProperty(n)&&(this[n]=t[n]);this.doOnChange()}return e.prototype.set=function(e,t){if(1!==arguments.length||"object"!==("undefined"==typeof e?"undefined":n(e)))this["_"+e]=t,this.doOnChange();else for(var i in e)e.hasOwnProperty(i)&&this.set(i,e[i])},e.prototype.get=function(e){return this["_"+e]},e.prototype.toRgb=function(){return p(this._hue,this._saturation,this._value)},e.prototype.fromString=function(e){var t=this;if(!e)return this._hue=0,this._saturation=100,this._value=100,void this.doOnChange();var i=function(e,i,n){t._hue=e,t._saturation=i,t._value=n,t.doOnChange()};if(e.indexOf("hsl")!==-1){var n=e.replace(/hsla|hsl|\(|\)/gm,"").split(/\s|,/g).filter(function(e){return""!==e}).map(function(e,t){return t>2?parseFloat(e):parseInt(e,10)});if(4===n.length&&(this._alpha=Math.floor(100*parseFloat(n[3]))),n.length>=3){var s=h(n[0],n[1],n[2]),o=s.h,a=s.s,r=s.v;i(o,a,r)}}else if(e.indexOf("hsv")!==-1){var l=e.replace(/hsva|hsv|\(|\)/gm,"").split(/\s|,/g).filter(function(e){return""!==e}).map(function(e,t){return t>2?parseFloat(e):parseInt(e,10)});4===l.length&&(this._alpha=Math.floor(100*parseFloat(l[3]))),l.length>=3&&i(l[0],l[1],l[2])}else if(e.indexOf("rgb")!==-1){var u=e.replace(/rgba|rgb|\(|\)/gm,"").split(/\s|,/g).filter(function(e){return""!==e}).map(function(e,t){return t>2?parseFloat(e):parseInt(e,10)});if(4===u.length&&(this._alpha=Math.floor(100*parseFloat(u[3]))),u.length>=3){var c=f(u[0],u[1],u[2]),p=c.h,m=c.s,v=c.v;i(p,m,v)}}else if(e.indexOf("#")!==-1){var g=e.replace("#","").trim(),y=void 0,b=void 0,_=void 0;3===g.length?(y=d(g[0]+g[0]),b=d(g[1]+g[1]),_=d(g[2]+g[2])):6===g.length&&(y=d(g.substring(0,2)),b=d(g.substring(2,4)),_=d(g.substring(4)));var C=f(y,b,_),x=C.h,w=C.s,M=C.v;i(x,w,M)}},e.prototype.doOnChange=function(){var e=this._hue,t=this._saturation,i=this._value,n=this._alpha,o=this.format;if(this.enableAlpha)switch(o){case"hsl":var a=s(e,t/100,i/100);this.value="hsla("+e+", "+Math.round(100*a[1])+"%, "+Math.round(100*a[2])+"%, "+n/100+")";break;case"hsv":this.value="hsva("+e+", "+Math.round(t)+"%, "+Math.round(i)+"%, "+n/100+")";break;default:var r=p(e,t,i),l=r.r,c=r.g,d=r.b;this.value="rgba("+l+", "+c+", "+d+", "+n/100+")"}else switch(o){case"hsl":var h=s(e,t/100,i/100);this.value="hsl("+e+", "+Math.round(100*h[1])+"%, "+Math.round(100*h[2])+"%)";break;case"hsv":this.value="hsv("+e+", "+Math.round(t)+"%, "+Math.round(i)+"%)";break;case"rgb":var f=p(e,t,i),m=f.r,v=f.g,g=f.b;this.value="rgb("+m+", "+v+", "+g+")";break;default:this.value=u(p(e,t,i))}},e}();t.default=m},function(e,t,i){var n=i(5)(i(378),i(389),null,null,null);e.exports=n.exports},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0;var s=i(379),o=n(s),a=i(383),r=n(a),l=i(386),u=n(l),c=i(27),d=n(c),h=i(12),f=n(h);t.default={name:"el-color-picker-dropdown",mixins:[d.default,f.default],components:{SvPanel:o.default,HueSlider:r.default,AlphaSlider:u.default},props:{color:{required:!0},showAlpha:Boolean},computed:{currentColor:function(){var e=this.$parent;return e.value||e.showPanelColor?e.color.value:""}},methods:{confirmValue:function(){this.$emit("pick")}},mounted:function(){this.$parent.popperElm=this.popperElm=this.$el,this.referenceElm=this.$parent.$el},watch:{showPopper:function(e){var t=this;e===!0&&this.$nextTick(function(){var e=t.$refs,i=e.sl,n=e.hue,s=e.alpha;i&&i.update(),n&&n.update(),s&&s.update()})}}}},function(e,t,i){var n=i(5)(i(380),i(382),null,null,null);e.exports=n.exports},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0;var s=i(381),o=n(s);t.default={name:"el-sl-panel",props:{color:{required:!0}},computed:{colorValue:function(){var e=this.color.get("hue"),t=this.color.get("value");return{hue:e,value:t}}},watch:{colorValue:function(){this.update()}},methods:{update:function(){var e=this.color.get("saturation"),t=this.color.get("value"),i=this.$el,n=i.getBoundingClientRect(),s=n.width,o=n.height;o||(o=3*s/4),this.cursorLeft=e*s/100,this.cursorTop=(100-t)*o/100,this.background="hsl("+this.color.get("hue")+", 100%, 50%)"},handleDrag:function(e){var t=this.$el,i=t.getBoundingClientRect(),n=e.clientX-i.left,s=e.clientY-i.top;n=Math.max(0,n),n=Math.min(n,i.width),s=Math.max(0,s),s=Math.min(s,i.height),this.cursorLeft=n,this.cursorTop=s,this.color.set({saturation:n/i.width*100,value:100-s/i.height*100})}},mounted:function(){var e=this;(0,o.default)(this.$el,{drag:function(t){e.handleDrag(t)},end:function(t){e.handleDrag(t)}}),this.update()},data:function(){return{cursorTop:0,cursorLeft:0,background:"hsl(0, 100%, 50%)"}}}},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0,t.default=function(e,t){if(!o.default.prototype.$isServer){var i=function(e){t.drag&&t.drag(e)},n=function e(n){document.removeEventListener("mousemove",i),document.removeEventListener("mouseup",e),document.onselectstart=null,document.ondragstart=null,a=!1,t.end&&t.end(n)};e.addEventListener("mousedown",function(e){a||(document.onselectstart=function(){return!1},document.ondragstart=function(){return!1},document.addEventListener("mousemove",i),document.addEventListener("mouseup",n),a=!0,t.start&&t.start(e))})}};var s=i(15),o=n(s),a=!1},function(e,t){e.exports={render:function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("div",{staticClass:"el-color-svpanel",style:{backgroundColor:e.background}},[i("div",{staticClass:"el-color-svpanel__white"}),i("div",{staticClass:"el-color-svpanel__black"}),i("div",{staticClass:"el-color-svpanel__cursor",style:{top:e.cursorTop+"px",left:e.cursorLeft+"px"}},[i("div")])])},staticRenderFns:[]}},function(e,t,i){var n=i(5)(i(384),i(385),null,null,null);e.exports=n.exports},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0;var s=i(381),o=n(s);t.default={name:"el-color-hue-slider",props:{color:{required:!0},vertical:Boolean},data:function(){return{thumbLeft:0,thumbTop:0}},computed:{hueValue:function(){var e=this.color.get("hue");return e}},watch:{hueValue:function(){this.update()}},methods:{handleClick:function(e){var t=this.$refs.thumb,i=e.target;i!==t&&this.handleDrag(e)},handleDrag:function(e){var t=this.$el.getBoundingClientRect(),i=this.$refs.thumb,n=void 0;if(this.vertical){var s=e.clientY-t.top;s=Math.min(s,t.height-i.offsetHeight/2),s=Math.max(i.offsetHeight/2,s),n=Math.round((s-i.offsetHeight/2)/(t.height-i.offsetHeight)*360)}else{var o=e.clientX-t.left;o=Math.min(o,t.width-i.offsetWidth/2),o=Math.max(i.offsetWidth/2,o),n=Math.round((o-i.offsetWidth/2)/(t.width-i.offsetWidth)*360)}this.color.set("hue",n)},getThumbLeft:function(){if(this.vertical)return 0;var e=this.$el,t=this.color.get("hue");if(!e)return 0;var i=this.$refs.thumb;return Math.round(t*(e.offsetWidth-i.offsetWidth/2)/360)},getThumbTop:function(){if(!this.vertical)return 0;var e=this.$el,t=this.color.get("hue");if(!e)return 0;var i=this.$refs.thumb;return Math.round(t*(e.offsetHeight-i.offsetHeight/2)/360)},update:function(){this.thumbLeft=this.getThumbLeft(),this.thumbTop=this.getThumbTop()}},mounted:function(){var e=this,t=this.$refs,i=t.bar,n=t.thumb,s={drag:function(t){e.handleDrag(t)},end:function(t){e.handleDrag(t)}};(0,o.default)(i,s),(0,o.default)(n,s),this.update()}}},function(e,t){e.exports={render:function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("div",{staticClass:"el-color-hue-slider",class:{"is-vertical":e.vertical}},[i("div",{ref:"bar",staticClass:"el-color-hue-slider__bar",on:{click:e.handleClick}}),i("div",{ref:"thumb",staticClass:"el-color-hue-slider__thumb",style:{left:e.thumbLeft+"px",top:e.thumbTop+"px"}})])},staticRenderFns:[]}},function(e,t,i){var n=i(5)(i(387),i(388),null,null,null);e.exports=n.exports},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0;var s=i(381),o=n(s);t.default={name:"el-color-alpha-slider",props:{color:{required:!0},vertical:Boolean},watch:{"color._alpha":function(){this.update()},"color.value":function(){this.update()}},methods:{handleClick:function(e){var t=this.$refs.thumb,i=e.target;i!==t&&this.handleDrag(e)},handleDrag:function(e){var t=this.$el.getBoundingClientRect(),i=this.$refs.thumb;if(this.vertical){var n=e.clientY-t.top;n=Math.max(i.offsetHeight/2,n),n=Math.min(n,t.height-i.offsetHeight/2),this.color.set("alpha",Math.round((n-i.offsetHeight/2)/(t.height-i.offsetHeight)*100))}else{var s=e.clientX-t.left;s=Math.max(i.offsetWidth/2,s),s=Math.min(s,t.width-i.offsetWidth/2),this.color.set("alpha",Math.round((s-i.offsetWidth/2)/(t.width-i.offsetWidth)*100))}},getThumbLeft:function(){if(this.vertical)return 0;var e=this.$el,t=this.color._alpha;if(!e)return 0;var i=this.$refs.thumb;return Math.round(t*(e.offsetWidth-i.offsetWidth/2)/100)},getThumbTop:function(){if(!this.vertical)return 0;var e=this.$el,t=this.color._alpha;if(!e)return 0;var i=this.$refs.thumb;return Math.round(t*(e.offsetHeight-i.offsetHeight/2)/100)},getBackground:function(){if(this.color&&this.color.value){var e=this.color.toRgb(),t=e.r,i=e.g,n=e.b;return"linear-gradient(to right, rgba("+t+", "+i+", "+n+", 0) 0%, rgba("+t+", "+i+", "+n+", 1) 100%)"}return null},update:function(){this.thumbLeft=this.getThumbLeft(),this.thumbTop=this.getThumbTop(),this.background=this.getBackground()}},data:function(){return{thumbLeft:0,thumbTop:0,background:null}},mounted:function(){var e=this,t=this.$refs,i=t.bar,n=t.thumb,s={drag:function(t){e.handleDrag(t)},end:function(t){e.handleDrag(t)}};(0,o.default)(i,s),(0,o.default)(n,s),this.update()}}},function(e,t){e.exports={render:function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("div",{staticClass:"el-color-alpha-slider",class:{"is-vertical":e.vertical}},[i("div",{ref:"bar",staticClass:"el-color-alpha-slider__bar",style:{background:e.background},on:{click:e.handleClick}}),i("div",{ref:"thumb",staticClass:"el-color-alpha-slider__thumb",style:{left:e.thumbLeft+"px",top:e.thumbTop+"px"}})])},staticRenderFns:[]}},function(e,t){e.exports={render:function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("transition",{attrs:{name:"el-zoom-in-top"},on:{"after-leave":e.doDestroy}},[i("div",{directives:[{name:"show",rawName:"v-show",value:e.showPopper,expression:"showPopper"}],staticClass:"el-color-dropdown"},[i("div",{staticClass:"el-color-dropdown__main-wrapper"},[i("hue-slider",{ref:"hue",staticStyle:{float:"right"},attrs:{color:e.color,vertical:""}}),i("sv-panel",{ref:"sl",attrs:{color:e.color}})],1),e.showAlpha?i("alpha-slider",{ref:"alpha",attrs:{color:e.color}}):e._e(),i("div",{staticClass:"el-color-dropdown__btns"},[i("span",{staticClass:"el-color-dropdown__value"},[e._v(e._s(e.currentColor))]),i("a",{staticClass:"el-color-dropdown__link-btn",attrs:{href:"JavaScript:"},on:{click:function(t){e.$emit("clear")}}},[e._v(e._s(e.t("el.colorpicker.clear")))]),i("button",{staticClass:"el-color-dropdown__btn",on:{click:e.confirmValue}},[e._v(e._s(e.t("el.colorpicker.confirm")))])])],1)])},staticRenderFns:[]}},function(e,t){e.exports={render:function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("div",{directives:[{name:"clickoutside",rawName:"v-clickoutside",value:e.hide,expression:"hide"}],staticClass:"el-color-picker"},[i("div",{staticClass:"el-color-picker__trigger",on:{click:function(t){e.showPicker=!e.showPicker}}},[i("span",{staticClass:"el-color-picker__color",class:{"is-alpha":e.showAlpha}},[i("span",{staticClass:"el-color-picker__color-inner",style:{backgroundColor:e.displayedColor}}),e.value||e.showPanelColor?e._e():i("span",{staticClass:"el-color-picker__empty el-icon-close"})]),i("span",{staticClass:"el-color-picker__icon el-icon-caret-bottom"})]),i("picker-dropdown",{ref:"dropdown",staticClass:"el-color-picker__panel",attrs:{color:e.color,"show-alpha":e.showAlpha},on:{pick:e.confirmValue,clear:e.clearValue},model:{value:e.showPicker,callback:function(t){e.showPicker=t},expression:"showPicker"}})],1)},staticRenderFns:[]}},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0;var s=i(392),o=n(s);o.default.install=function(e){e.component(o.default.name,o.default)},t.default=o.default},function(e,t,i){var n=i(5)(i(393),i(397),null,null,null);e.exports=n.exports},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0;var s=i(66),o=n(s),a=i(11),r=n(a),l=i(12),u=n(l),c=i(394),d=n(c);t.default={name:"ElTransfer",mixins:[r.default,u.default],components:{TransferPanel:d.default,ElButton:o.default},props:{data:{type:Array,default:function(){return[]}},titles:{type:Array,default:function(){return[]}},buttonTexts:{type:Array,default:function(){return[]}},filterPlaceholder:{type:String,default:""},filterMethod:Function,leftDefaultChecked:{type:Array,default:function(){return[]}},rightDefaultChecked:{type:Array,default:function(){return[]}},renderContent:Function,value:{type:Array,default:function(){return[]}},footerFormat:{type:Object,default:function(){return{}}},filterable:Boolean,props:{type:Object,default:function(){return{label:"label",key:"key",disabled:"disabled"}}}},data:function(){return{leftChecked:[],rightChecked:[]}},computed:{sourceData:function(){var e=this;return this.data.filter(function(t){return e.value.indexOf(t[e.props.key])===-1})},targetData:function(){var e=this;return this.data.filter(function(t){return e.value.indexOf(t[e.props.key])>-1})}},watch:{value:function(e){this.dispatch("ElFormItem","el.form.change",e)}},methods:{onSourceCheckedChange:function(e){this.leftChecked=e},onTargetCheckedChange:function(e){this.rightChecked=e},addToLeft:function(){var e=this.value.slice();this.rightChecked.forEach(function(t){var i=e.indexOf(t);i>-1&&e.splice(i,1)}),this.$emit("input",e),this.$emit("change",e,"left",this.rightChecked)},addToRight:function(){var e=this,t=this.value.slice();this.leftChecked.forEach(function(i){e.value.indexOf(i)===-1&&(t=t.concat(i))}),this.$emit("input",t),this.$emit("change",t,"right",this.leftChecked)}}}},function(e,t,i){var n=i(5)(i(395),i(396),null,null,null);e.exports=n.exports},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0;var s=i(124),o=n(s),a=i(116),r=n(a),l=i(19),u=n(l),c=i(12),d=n(c);t.default={mixins:[d.default],name:"ElTransferPanel",componentName:"ElTransferPanel",components:{ElCheckboxGroup:o.default,ElCheckbox:r.default,ElInput:u.default,OptionContent:{props:{option:Object},render:function(e){var t=function e(t){return"ElTransferPanel"===t.$options.componentName?t:t.$parent?e(t.$parent):t},i=t(this);return i.renderContent?i.renderContent(e,this.option):e("span",null,[this.option[i.labelProp]||this.option[i.keyProp]])}}},props:{data:{type:Array,default:function(){return[]}},renderContent:Function,placeholder:String,title:String,filterable:Boolean,footerFormat:Object,filterMethod:Function,defaultChecked:Array,props:Object},data:function(){return{checked:[],allChecked:!1,query:"",inputHover:!1}},watch:{checked:function(e){this.updateAllChecked(),this.$emit("checked-change",e)},data:function(){var e=this,t=[],i=this.filteredData.map(function(t){return t[e.keyProp]});this.checked.forEach(function(e){i.indexOf(e)>-1&&t.push(e)}),this.checked=t},checkableData:function(){this.updateAllChecked()},defaultChecked:{immediate:!0,handler:function(e,t){var i=this;if(!t||e.length!==t.length||!e.every(function(e){return t.indexOf(e)>-1})){var n=[],s=this.checkableData.map(function(e){return e[i.keyProp]});e.forEach(function(e){s.indexOf(e)>-1&&n.push(e)}),this.checked=n}}}},computed:{filteredData:function(){var e=this;return this.data.filter(function(t){if("function"==typeof e.filterMethod)return e.filterMethod(e.query,t);var i=t[e.labelProp]||t[e.keyProp].toString();return i.toLowerCase().indexOf(e.query.toLowerCase())>-1})},checkableData:function(){var e=this;return this.filteredData.filter(function(t){return!t[e.disabledProp]})},checkedSummary:function(){var e=this.checked.length,t=this.data.length,i=this.footerFormat,n=i.noChecked,s=i.hasChecked;return n&&s?e>0?s.replace(/\${checked}/g,e).replace(/\${total}/g,t):n.replace(/\${total}/g,t):e>0?this.t("el.transfer.hasCheckedFormat",{total:t,checked:e}):this.t("el.transfer.noCheckedFormat",{total:t})},isIndeterminate:function(){var e=this.checked.length;return e>0&&e<this.checkableData.length},hasNoMatch:function(){return this.query.length>0&&0===this.filteredData.length},inputIcon:function(){return this.query.length>0&&this.inputHover?"circle-close":"search"},labelProp:function(){return this.props.label||"label"},keyProp:function(){return this.props.key||"key"},disabledProp:function(){return this.props.disabled||"disabled"}},methods:{updateAllChecked:function(){var e=this,t=this.checkableData.map(function(t){return t[e.keyProp]});this.allChecked=t.length>0&&t.every(function(t){return e.checked.indexOf(t)>-1})},handleAllCheckedChange:function(e){var t=this;this.checked=e.target.checked?this.checkableData.map(function(e){return e[t.keyProp]}):[]},clearQuery:function(){"circle-close"===this.inputIcon&&(this.query="")}}}},function(e,t){e.exports={render:function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("div",{staticClass:"el-transfer-panel"},[i("p",{staticClass:"el-transfer-panel__header"},[e._v(e._s(e.title))]),i("div",{staticClass:"el-transfer-panel__body"},[e.filterable?i("el-input",{staticClass:"el-transfer-panel__filter",attrs:{size:"small",placeholder:e.placeholder,icon:e.inputIcon},on:{click:e.clearQuery},nativeOn:{mouseenter:function(t){e.inputHover=!0},mouseleave:function(t){e.inputHover=!1}},model:{value:e.query,callback:function(t){e.query=t},expression:"query"}}):e._e(),i("el-checkbox-group",{directives:[{name:"show",rawName:"v-show",value:!e.hasNoMatch&&e.data.length>0,expression:"!hasNoMatch && data.length > 0"}],staticClass:"el-transfer-panel__list",class:{"is-filterable":e.filterable},model:{value:e.checked,callback:function(t){e.checked=t},expression:"checked"}},e._l(e.filteredData,function(t){return i("el-checkbox",{key:t[e.keyProp],staticClass:"el-transfer-panel__item",attrs:{label:t[e.keyProp],disabled:t[e.disabledProp]}},[i("option-content",{attrs:{option:t}})],1)})),i("p",{directives:[{name:"show",rawName:"v-show",value:e.hasNoMatch,expression:"hasNoMatch"}],staticClass:"el-transfer-panel__empty"},[e._v(e._s(e.t("el.transfer.noMatch")))]),i("p",{directives:[{name:"show",rawName:"v-show",value:0===e.data.length&&!e.hasNoMatch,expression:"data.length === 0 && !hasNoMatch"}],staticClass:"el-transfer-panel__empty"},[e._v(e._s(e.t("el.transfer.noData")))])],1),i("p",{staticClass:"el-transfer-panel__footer"},[i("el-checkbox",{attrs:{indeterminate:e.isIndeterminate},on:{change:e.handleAllCheckedChange},model:{value:e.allChecked,callback:function(t){e.allChecked=t},expression:"allChecked"}},[e._v(e._s(e.checkedSummary))]),e._t("default")],2)])},staticRenderFns:[]}},function(e,t){e.exports={render:function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("div",{staticClass:"el-transfer"},[i("transfer-panel",e._b({attrs:{data:e.sourceData,title:e.titles[0]||e.t("el.transfer.titles.0"),"default-checked":e.leftDefaultChecked,placeholder:e.filterPlaceholder||e.t("el.transfer.filterPlaceholder")},on:{"checked-change":e.onSourceCheckedChange}},"transfer-panel",e.$props),[e._t("left-footer")],2),i("div",{staticClass:"el-transfer__buttons"},[i("el-button",{attrs:{type:"primary",size:"small",disabled:0===e.rightChecked.length},nativeOn:{click:function(t){e.addToLeft(t)}}},[i("i",{staticClass:"el-icon-arrow-left"}),void 0!==e.buttonTexts[0]?i("span",[e._v(e._s(e.buttonTexts[0]))]):e._e()]),i("el-button",{attrs:{type:"primary",size:"small",disabled:0===e.leftChecked.length},nativeOn:{click:function(t){e.addToRight(t)}}},[void 0!==e.buttonTexts[1]?i("span",[e._v(e._s(e.buttonTexts[1]))]):e._e(),i("i",{staticClass:"el-icon-arrow-right"})])],1),i("transfer-panel",e._b({attrs:{data:e.targetData,title:e.titles[1]||e.t("el.transfer.titles.1"),"default-checked":e.rightDefaultChecked,placeholder:e.filterPlaceholder||e.t("el.transfer.filterPlaceholder")},on:{"checked-change":e.onTargetCheckedChange}},"transfer-panel",e.$props),[e._t("right-footer")],2)],1)},staticRenderFns:[]}}])});
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