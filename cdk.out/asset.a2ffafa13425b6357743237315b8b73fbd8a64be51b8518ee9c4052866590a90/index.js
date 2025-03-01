"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// asset-input/node_modules/lodash.merge/index.js
var require_lodash = __commonJS({
  "asset-input/node_modules/lodash.merge/index.js"(exports2, module2) {
    var LARGE_ARRAY_SIZE = 200;
    var HASH_UNDEFINED = "__lodash_hash_undefined__";
    var HOT_COUNT = 800;
    var HOT_SPAN = 16;
    var MAX_SAFE_INTEGER = 9007199254740991;
    var argsTag = "[object Arguments]";
    var arrayTag = "[object Array]";
    var asyncTag = "[object AsyncFunction]";
    var boolTag = "[object Boolean]";
    var dateTag = "[object Date]";
    var errorTag = "[object Error]";
    var funcTag = "[object Function]";
    var genTag = "[object GeneratorFunction]";
    var mapTag = "[object Map]";
    var numberTag = "[object Number]";
    var nullTag = "[object Null]";
    var objectTag = "[object Object]";
    var proxyTag = "[object Proxy]";
    var regexpTag = "[object RegExp]";
    var setTag = "[object Set]";
    var stringTag = "[object String]";
    var undefinedTag = "[object Undefined]";
    var weakMapTag = "[object WeakMap]";
    var arrayBufferTag = "[object ArrayBuffer]";
    var dataViewTag = "[object DataView]";
    var float32Tag = "[object Float32Array]";
    var float64Tag = "[object Float64Array]";
    var int8Tag = "[object Int8Array]";
    var int16Tag = "[object Int16Array]";
    var int32Tag = "[object Int32Array]";
    var uint8Tag = "[object Uint8Array]";
    var uint8ClampedTag = "[object Uint8ClampedArray]";
    var uint16Tag = "[object Uint16Array]";
    var uint32Tag = "[object Uint32Array]";
    var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;
    var reIsHostCtor = /^\[object .+?Constructor\]$/;
    var reIsUint = /^(?:0|[1-9]\d*)$/;
    var typedArrayTags = {};
    typedArrayTags[float32Tag] = typedArrayTags[float64Tag] = typedArrayTags[int8Tag] = typedArrayTags[int16Tag] = typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] = typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] = typedArrayTags[uint32Tag] = true;
    typedArrayTags[argsTag] = typedArrayTags[arrayTag] = typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] = typedArrayTags[dataViewTag] = typedArrayTags[dateTag] = typedArrayTags[errorTag] = typedArrayTags[funcTag] = typedArrayTags[mapTag] = typedArrayTags[numberTag] = typedArrayTags[objectTag] = typedArrayTags[regexpTag] = typedArrayTags[setTag] = typedArrayTags[stringTag] = typedArrayTags[weakMapTag] = false;
    var freeGlobal = typeof global == "object" && global && global.Object === Object && global;
    var freeSelf = typeof self == "object" && self && self.Object === Object && self;
    var root = freeGlobal || freeSelf || Function("return this")();
    var freeExports = typeof exports2 == "object" && exports2 && !exports2.nodeType && exports2;
    var freeModule = freeExports && typeof module2 == "object" && module2 && !module2.nodeType && module2;
    var moduleExports = freeModule && freeModule.exports === freeExports;
    var freeProcess = moduleExports && freeGlobal.process;
    var nodeUtil = function() {
      try {
        var types = freeModule && freeModule.require && freeModule.require("util").types;
        if (types) {
          return types;
        }
        return freeProcess && freeProcess.binding && freeProcess.binding("util");
      } catch (e) {
      }
    }();
    var nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;
    function apply(func, thisArg, args) {
      switch (args.length) {
        case 0:
          return func.call(thisArg);
        case 1:
          return func.call(thisArg, args[0]);
        case 2:
          return func.call(thisArg, args[0], args[1]);
        case 3:
          return func.call(thisArg, args[0], args[1], args[2]);
      }
      return func.apply(thisArg, args);
    }
    function baseTimes(n, iteratee) {
      var index = -1, result = Array(n);
      while (++index < n) {
        result[index] = iteratee(index);
      }
      return result;
    }
    function baseUnary(func) {
      return function(value) {
        return func(value);
      };
    }
    function getValue(object, key) {
      return object == null ? void 0 : object[key];
    }
    function overArg(func, transform) {
      return function(arg) {
        return func(transform(arg));
      };
    }
    var arrayProto = Array.prototype;
    var funcProto = Function.prototype;
    var objectProto = Object.prototype;
    var coreJsData = root["__core-js_shared__"];
    var funcToString = funcProto.toString;
    var hasOwnProperty = objectProto.hasOwnProperty;
    var maskSrcKey = function() {
      var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || "");
      return uid ? "Symbol(src)_1." + uid : "";
    }();
    var nativeObjectToString = objectProto.toString;
    var objectCtorString = funcToString.call(Object);
    var reIsNative = RegExp(
      "^" + funcToString.call(hasOwnProperty).replace(reRegExpChar, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
    );
    var Buffer2 = moduleExports ? root.Buffer : void 0;
    var Symbol2 = root.Symbol;
    var Uint8Array2 = root.Uint8Array;
    var allocUnsafe = Buffer2 ? Buffer2.allocUnsafe : void 0;
    var getPrototype = overArg(Object.getPrototypeOf, Object);
    var objectCreate = Object.create;
    var propertyIsEnumerable = objectProto.propertyIsEnumerable;
    var splice = arrayProto.splice;
    var symToStringTag = Symbol2 ? Symbol2.toStringTag : void 0;
    var defineProperty = function() {
      try {
        var func = getNative(Object, "defineProperty");
        func({}, "", {});
        return func;
      } catch (e) {
      }
    }();
    var nativeIsBuffer = Buffer2 ? Buffer2.isBuffer : void 0;
    var nativeMax = Math.max;
    var nativeNow = Date.now;
    var Map2 = getNative(root, "Map");
    var nativeCreate = getNative(Object, "create");
    var baseCreate = /* @__PURE__ */ function() {
      function object() {
      }
      return function(proto) {
        if (!isObject(proto)) {
          return {};
        }
        if (objectCreate) {
          return objectCreate(proto);
        }
        object.prototype = proto;
        var result = new object();
        object.prototype = void 0;
        return result;
      };
    }();
    function Hash(entries) {
      var index = -1, length = entries == null ? 0 : entries.length;
      this.clear();
      while (++index < length) {
        var entry = entries[index];
        this.set(entry[0], entry[1]);
      }
    }
    function hashClear() {
      this.__data__ = nativeCreate ? nativeCreate(null) : {};
      this.size = 0;
    }
    function hashDelete(key) {
      var result = this.has(key) && delete this.__data__[key];
      this.size -= result ? 1 : 0;
      return result;
    }
    function hashGet(key) {
      var data = this.__data__;
      if (nativeCreate) {
        var result = data[key];
        return result === HASH_UNDEFINED ? void 0 : result;
      }
      return hasOwnProperty.call(data, key) ? data[key] : void 0;
    }
    function hashHas(key) {
      var data = this.__data__;
      return nativeCreate ? data[key] !== void 0 : hasOwnProperty.call(data, key);
    }
    function hashSet(key, value) {
      var data = this.__data__;
      this.size += this.has(key) ? 0 : 1;
      data[key] = nativeCreate && value === void 0 ? HASH_UNDEFINED : value;
      return this;
    }
    Hash.prototype.clear = hashClear;
    Hash.prototype["delete"] = hashDelete;
    Hash.prototype.get = hashGet;
    Hash.prototype.has = hashHas;
    Hash.prototype.set = hashSet;
    function ListCache(entries) {
      var index = -1, length = entries == null ? 0 : entries.length;
      this.clear();
      while (++index < length) {
        var entry = entries[index];
        this.set(entry[0], entry[1]);
      }
    }
    function listCacheClear() {
      this.__data__ = [];
      this.size = 0;
    }
    function listCacheDelete(key) {
      var data = this.__data__, index = assocIndexOf(data, key);
      if (index < 0) {
        return false;
      }
      var lastIndex = data.length - 1;
      if (index == lastIndex) {
        data.pop();
      } else {
        splice.call(data, index, 1);
      }
      --this.size;
      return true;
    }
    function listCacheGet(key) {
      var data = this.__data__, index = assocIndexOf(data, key);
      return index < 0 ? void 0 : data[index][1];
    }
    function listCacheHas(key) {
      return assocIndexOf(this.__data__, key) > -1;
    }
    function listCacheSet(key, value) {
      var data = this.__data__, index = assocIndexOf(data, key);
      if (index < 0) {
        ++this.size;
        data.push([key, value]);
      } else {
        data[index][1] = value;
      }
      return this;
    }
    ListCache.prototype.clear = listCacheClear;
    ListCache.prototype["delete"] = listCacheDelete;
    ListCache.prototype.get = listCacheGet;
    ListCache.prototype.has = listCacheHas;
    ListCache.prototype.set = listCacheSet;
    function MapCache(entries) {
      var index = -1, length = entries == null ? 0 : entries.length;
      this.clear();
      while (++index < length) {
        var entry = entries[index];
        this.set(entry[0], entry[1]);
      }
    }
    function mapCacheClear() {
      this.size = 0;
      this.__data__ = {
        "hash": new Hash(),
        "map": new (Map2 || ListCache)(),
        "string": new Hash()
      };
    }
    function mapCacheDelete(key) {
      var result = getMapData(this, key)["delete"](key);
      this.size -= result ? 1 : 0;
      return result;
    }
    function mapCacheGet(key) {
      return getMapData(this, key).get(key);
    }
    function mapCacheHas(key) {
      return getMapData(this, key).has(key);
    }
    function mapCacheSet(key, value) {
      var data = getMapData(this, key), size = data.size;
      data.set(key, value);
      this.size += data.size == size ? 0 : 1;
      return this;
    }
    MapCache.prototype.clear = mapCacheClear;
    MapCache.prototype["delete"] = mapCacheDelete;
    MapCache.prototype.get = mapCacheGet;
    MapCache.prototype.has = mapCacheHas;
    MapCache.prototype.set = mapCacheSet;
    function Stack(entries) {
      var data = this.__data__ = new ListCache(entries);
      this.size = data.size;
    }
    function stackClear() {
      this.__data__ = new ListCache();
      this.size = 0;
    }
    function stackDelete(key) {
      var data = this.__data__, result = data["delete"](key);
      this.size = data.size;
      return result;
    }
    function stackGet(key) {
      return this.__data__.get(key);
    }
    function stackHas(key) {
      return this.__data__.has(key);
    }
    function stackSet(key, value) {
      var data = this.__data__;
      if (data instanceof ListCache) {
        var pairs = data.__data__;
        if (!Map2 || pairs.length < LARGE_ARRAY_SIZE - 1) {
          pairs.push([key, value]);
          this.size = ++data.size;
          return this;
        }
        data = this.__data__ = new MapCache(pairs);
      }
      data.set(key, value);
      this.size = data.size;
      return this;
    }
    Stack.prototype.clear = stackClear;
    Stack.prototype["delete"] = stackDelete;
    Stack.prototype.get = stackGet;
    Stack.prototype.has = stackHas;
    Stack.prototype.set = stackSet;
    function arrayLikeKeys(value, inherited) {
      var isArr = isArray(value), isArg = !isArr && isArguments(value), isBuff = !isArr && !isArg && isBuffer(value), isType = !isArr && !isArg && !isBuff && isTypedArray(value), skipIndexes = isArr || isArg || isBuff || isType, result = skipIndexes ? baseTimes(value.length, String) : [], length = result.length;
      for (var key in value) {
        if ((inherited || hasOwnProperty.call(value, key)) && !(skipIndexes && // Safari 9 has enumerable `arguments.length` in strict mode.
        (key == "length" || // Node.js 0.10 has enumerable non-index properties on buffers.
        isBuff && (key == "offset" || key == "parent") || // PhantomJS 2 has enumerable non-index properties on typed arrays.
        isType && (key == "buffer" || key == "byteLength" || key == "byteOffset") || // Skip index properties.
        isIndex(key, length)))) {
          result.push(key);
        }
      }
      return result;
    }
    function assignMergeValue(object, key, value) {
      if (value !== void 0 && !eq(object[key], value) || value === void 0 && !(key in object)) {
        baseAssignValue(object, key, value);
      }
    }
    function assignValue(object, key, value) {
      var objValue = object[key];
      if (!(hasOwnProperty.call(object, key) && eq(objValue, value)) || value === void 0 && !(key in object)) {
        baseAssignValue(object, key, value);
      }
    }
    function assocIndexOf(array, key) {
      var length = array.length;
      while (length--) {
        if (eq(array[length][0], key)) {
          return length;
        }
      }
      return -1;
    }
    function baseAssignValue(object, key, value) {
      if (key == "__proto__" && defineProperty) {
        defineProperty(object, key, {
          "configurable": true,
          "enumerable": true,
          "value": value,
          "writable": true
        });
      } else {
        object[key] = value;
      }
    }
    var baseFor = createBaseFor();
    function baseGetTag(value) {
      if (value == null) {
        return value === void 0 ? undefinedTag : nullTag;
      }
      return symToStringTag && symToStringTag in Object(value) ? getRawTag(value) : objectToString(value);
    }
    function baseIsArguments(value) {
      return isObjectLike(value) && baseGetTag(value) == argsTag;
    }
    function baseIsNative(value) {
      if (!isObject(value) || isMasked(value)) {
        return false;
      }
      var pattern = isFunction(value) ? reIsNative : reIsHostCtor;
      return pattern.test(toSource(value));
    }
    function baseIsTypedArray(value) {
      return isObjectLike(value) && isLength(value.length) && !!typedArrayTags[baseGetTag(value)];
    }
    function baseKeysIn(object) {
      if (!isObject(object)) {
        return nativeKeysIn(object);
      }
      var isProto = isPrototype(object), result = [];
      for (var key in object) {
        if (!(key == "constructor" && (isProto || !hasOwnProperty.call(object, key)))) {
          result.push(key);
        }
      }
      return result;
    }
    function baseMerge(object, source, srcIndex, customizer, stack) {
      if (object === source) {
        return;
      }
      baseFor(source, function(srcValue, key) {
        stack || (stack = new Stack());
        if (isObject(srcValue)) {
          baseMergeDeep(object, source, key, srcIndex, baseMerge, customizer, stack);
        } else {
          var newValue = customizer ? customizer(safeGet(object, key), srcValue, key + "", object, source, stack) : void 0;
          if (newValue === void 0) {
            newValue = srcValue;
          }
          assignMergeValue(object, key, newValue);
        }
      }, keysIn);
    }
    function baseMergeDeep(object, source, key, srcIndex, mergeFunc, customizer, stack) {
      var objValue = safeGet(object, key), srcValue = safeGet(source, key), stacked = stack.get(srcValue);
      if (stacked) {
        assignMergeValue(object, key, stacked);
        return;
      }
      var newValue = customizer ? customizer(objValue, srcValue, key + "", object, source, stack) : void 0;
      var isCommon = newValue === void 0;
      if (isCommon) {
        var isArr = isArray(srcValue), isBuff = !isArr && isBuffer(srcValue), isTyped = !isArr && !isBuff && isTypedArray(srcValue);
        newValue = srcValue;
        if (isArr || isBuff || isTyped) {
          if (isArray(objValue)) {
            newValue = objValue;
          } else if (isArrayLikeObject(objValue)) {
            newValue = copyArray(objValue);
          } else if (isBuff) {
            isCommon = false;
            newValue = cloneBuffer(srcValue, true);
          } else if (isTyped) {
            isCommon = false;
            newValue = cloneTypedArray(srcValue, true);
          } else {
            newValue = [];
          }
        } else if (isPlainObject(srcValue) || isArguments(srcValue)) {
          newValue = objValue;
          if (isArguments(objValue)) {
            newValue = toPlainObject(objValue);
          } else if (!isObject(objValue) || isFunction(objValue)) {
            newValue = initCloneObject(srcValue);
          }
        } else {
          isCommon = false;
        }
      }
      if (isCommon) {
        stack.set(srcValue, newValue);
        mergeFunc(newValue, srcValue, srcIndex, customizer, stack);
        stack["delete"](srcValue);
      }
      assignMergeValue(object, key, newValue);
    }
    function baseRest(func, start) {
      return setToString(overRest(func, start, identity), func + "");
    }
    var baseSetToString = !defineProperty ? identity : function(func, string) {
      return defineProperty(func, "toString", {
        "configurable": true,
        "enumerable": false,
        "value": constant(string),
        "writable": true
      });
    };
    function cloneBuffer(buffer, isDeep) {
      if (isDeep) {
        return buffer.slice();
      }
      var length = buffer.length, result = allocUnsafe ? allocUnsafe(length) : new buffer.constructor(length);
      buffer.copy(result);
      return result;
    }
    function cloneArrayBuffer(arrayBuffer) {
      var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
      new Uint8Array2(result).set(new Uint8Array2(arrayBuffer));
      return result;
    }
    function cloneTypedArray(typedArray, isDeep) {
      var buffer = isDeep ? cloneArrayBuffer(typedArray.buffer) : typedArray.buffer;
      return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
    }
    function copyArray(source, array) {
      var index = -1, length = source.length;
      array || (array = Array(length));
      while (++index < length) {
        array[index] = source[index];
      }
      return array;
    }
    function copyObject(source, props, object, customizer) {
      var isNew = !object;
      object || (object = {});
      var index = -1, length = props.length;
      while (++index < length) {
        var key = props[index];
        var newValue = customizer ? customizer(object[key], source[key], key, object, source) : void 0;
        if (newValue === void 0) {
          newValue = source[key];
        }
        if (isNew) {
          baseAssignValue(object, key, newValue);
        } else {
          assignValue(object, key, newValue);
        }
      }
      return object;
    }
    function createAssigner(assigner) {
      return baseRest(function(object, sources) {
        var index = -1, length = sources.length, customizer = length > 1 ? sources[length - 1] : void 0, guard = length > 2 ? sources[2] : void 0;
        customizer = assigner.length > 3 && typeof customizer == "function" ? (length--, customizer) : void 0;
        if (guard && isIterateeCall(sources[0], sources[1], guard)) {
          customizer = length < 3 ? void 0 : customizer;
          length = 1;
        }
        object = Object(object);
        while (++index < length) {
          var source = sources[index];
          if (source) {
            assigner(object, source, index, customizer);
          }
        }
        return object;
      });
    }
    function createBaseFor(fromRight) {
      return function(object, iteratee, keysFunc) {
        var index = -1, iterable = Object(object), props = keysFunc(object), length = props.length;
        while (length--) {
          var key = props[fromRight ? length : ++index];
          if (iteratee(iterable[key], key, iterable) === false) {
            break;
          }
        }
        return object;
      };
    }
    function getMapData(map, key) {
      var data = map.__data__;
      return isKeyable(key) ? data[typeof key == "string" ? "string" : "hash"] : data.map;
    }
    function getNative(object, key) {
      var value = getValue(object, key);
      return baseIsNative(value) ? value : void 0;
    }
    function getRawTag(value) {
      var isOwn = hasOwnProperty.call(value, symToStringTag), tag = value[symToStringTag];
      try {
        value[symToStringTag] = void 0;
        var unmasked = true;
      } catch (e) {
      }
      var result = nativeObjectToString.call(value);
      if (unmasked) {
        if (isOwn) {
          value[symToStringTag] = tag;
        } else {
          delete value[symToStringTag];
        }
      }
      return result;
    }
    function initCloneObject(object) {
      return typeof object.constructor == "function" && !isPrototype(object) ? baseCreate(getPrototype(object)) : {};
    }
    function isIndex(value, length) {
      var type = typeof value;
      length = length == null ? MAX_SAFE_INTEGER : length;
      return !!length && (type == "number" || type != "symbol" && reIsUint.test(value)) && (value > -1 && value % 1 == 0 && value < length);
    }
    function isIterateeCall(value, index, object) {
      if (!isObject(object)) {
        return false;
      }
      var type = typeof index;
      if (type == "number" ? isArrayLike(object) && isIndex(index, object.length) : type == "string" && index in object) {
        return eq(object[index], value);
      }
      return false;
    }
    function isKeyable(value) {
      var type = typeof value;
      return type == "string" || type == "number" || type == "symbol" || type == "boolean" ? value !== "__proto__" : value === null;
    }
    function isMasked(func) {
      return !!maskSrcKey && maskSrcKey in func;
    }
    function isPrototype(value) {
      var Ctor = value && value.constructor, proto = typeof Ctor == "function" && Ctor.prototype || objectProto;
      return value === proto;
    }
    function nativeKeysIn(object) {
      var result = [];
      if (object != null) {
        for (var key in Object(object)) {
          result.push(key);
        }
      }
      return result;
    }
    function objectToString(value) {
      return nativeObjectToString.call(value);
    }
    function overRest(func, start, transform) {
      start = nativeMax(start === void 0 ? func.length - 1 : start, 0);
      return function() {
        var args = arguments, index = -1, length = nativeMax(args.length - start, 0), array = Array(length);
        while (++index < length) {
          array[index] = args[start + index];
        }
        index = -1;
        var otherArgs = Array(start + 1);
        while (++index < start) {
          otherArgs[index] = args[index];
        }
        otherArgs[start] = transform(array);
        return apply(func, this, otherArgs);
      };
    }
    function safeGet(object, key) {
      if (key === "constructor" && typeof object[key] === "function") {
        return;
      }
      if (key == "__proto__") {
        return;
      }
      return object[key];
    }
    var setToString = shortOut(baseSetToString);
    function shortOut(func) {
      var count = 0, lastCalled = 0;
      return function() {
        var stamp = nativeNow(), remaining = HOT_SPAN - (stamp - lastCalled);
        lastCalled = stamp;
        if (remaining > 0) {
          if (++count >= HOT_COUNT) {
            return arguments[0];
          }
        } else {
          count = 0;
        }
        return func.apply(void 0, arguments);
      };
    }
    function toSource(func) {
      if (func != null) {
        try {
          return funcToString.call(func);
        } catch (e) {
        }
        try {
          return func + "";
        } catch (e) {
        }
      }
      return "";
    }
    function eq(value, other) {
      return value === other || value !== value && other !== other;
    }
    var isArguments = baseIsArguments(/* @__PURE__ */ function() {
      return arguments;
    }()) ? baseIsArguments : function(value) {
      return isObjectLike(value) && hasOwnProperty.call(value, "callee") && !propertyIsEnumerable.call(value, "callee");
    };
    var isArray = Array.isArray;
    function isArrayLike(value) {
      return value != null && isLength(value.length) && !isFunction(value);
    }
    function isArrayLikeObject(value) {
      return isObjectLike(value) && isArrayLike(value);
    }
    var isBuffer = nativeIsBuffer || stubFalse;
    function isFunction(value) {
      if (!isObject(value)) {
        return false;
      }
      var tag = baseGetTag(value);
      return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
    }
    function isLength(value) {
      return typeof value == "number" && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
    }
    function isObject(value) {
      var type = typeof value;
      return value != null && (type == "object" || type == "function");
    }
    function isObjectLike(value) {
      return value != null && typeof value == "object";
    }
    function isPlainObject(value) {
      if (!isObjectLike(value) || baseGetTag(value) != objectTag) {
        return false;
      }
      var proto = getPrototype(value);
      if (proto === null) {
        return true;
      }
      var Ctor = hasOwnProperty.call(proto, "constructor") && proto.constructor;
      return typeof Ctor == "function" && Ctor instanceof Ctor && funcToString.call(Ctor) == objectCtorString;
    }
    var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;
    function toPlainObject(value) {
      return copyObject(value, keysIn(value));
    }
    function keysIn(object) {
      return isArrayLike(object) ? arrayLikeKeys(object, true) : baseKeysIn(object);
    }
    var merge3 = createAssigner(function(object, source, srcIndex) {
      baseMerge(object, source, srcIndex);
    });
    function constant(value) {
      return function() {
        return value;
      };
    }
    function identity(value) {
      return value;
    }
    function stubFalse() {
      return false;
    }
    module2.exports = merge3;
  }
});

// asset-input/lambda/getProductsList/index.ts
var getProductsList_exports = {};
__export(getProductsList_exports, {
  handler: () => handler
});
module.exports = __toCommonJS(getProductsList_exports);

// asset-input/node_modules/@aws-lambda-powertools/logger/lib/esm/Logger.js
var import_node_console = require("node:console");
var import_node_crypto = require("node:crypto");

// asset-input/node_modules/@aws-lambda-powertools/commons/lib/esm/version.js
var PT_VERSION = "2.15.0";

// asset-input/node_modules/@aws-lambda-powertools/commons/lib/esm/typeUtils.js
var isString = (value) => {
  return typeof value === "string";
};
var isNumber = (value) => {
  return typeof value === "number";
};
var isIntegerNumber = (value) => {
  return isNumber(value) && Number.isInteger(value);
};
var isNull = (value) => {
  return Object.is(value, null);
};
var isNullOrUndefined = (value) => {
  return isNull(value) || Object.is(value, void 0);
};

// asset-input/node_modules/@aws-lambda-powertools/commons/lib/esm/Utility.js
var Utility = class {
  coldStart = true;
  defaultServiceName = "service_undefined";
  /**
   * Get the cold start status of the current execution environment.
   *
   * @example
   * ```typescript
   * import { Utility } from '@aws-lambda-powertools/commons';
   *
   * const utility = new Utility();
   * utility.isColdStart(); // true
   * utility.isColdStart(); // false
   * ```
   *
   * The method also flips the cold start status to `false` after the first invocation.
   */
  getColdStart() {
    if (this.coldStart) {
      this.coldStart = false;
      return true;
    }
    return false;
  }
  /**
   * Get the cold start status of the current execution environment.
   *
   * @example
   * ```typescript
   * import { Utility } from '@aws-lambda-powertools/commons';
   *
   * const utility = new Utility();
   * utility.isColdStart(); // true
   * utility.isColdStart(); // false
   * ```
   *
   * @see {@link getColdStart}
   */
  isColdStart() {
    return this.getColdStart();
  }
  /**
   * Get the default service name.
   */
  getDefaultServiceName() {
    return this.defaultServiceName;
  }
  /**
   * Validate that the service name provided is valid.
   * Used internally during initialization.
   *
   * @param serviceName Service name to validate
   */
  isValidServiceName(serviceName) {
    return typeof serviceName === "string" && serviceName.trim().length > 0;
  }
};

// asset-input/node_modules/@aws-lambda-powertools/commons/lib/esm/config/EnvironmentVariablesService.js
var EnvironmentVariablesService = class {
  /**
   * Increase JSON indentation for Logger to ease debugging when running functions locally or in a non-production environment
   */
  devModeVariable = "POWERTOOLS_DEV";
  /**
   * Set service name used for tracing namespace, metrics dimension and structured logging
   */
  serviceNameVariable = "POWERTOOLS_SERVICE_NAME";
  /**
   * AWS X-Ray Trace ID environment variable
   * @private
   */
  xRayTraceIdVariable = "_X_AMZN_TRACE_ID";
  /**
   * Get the value of an environment variable by name.
   *
   * @param {string} name The name of the environment variable to fetch.
   */
  get(name) {
    return process.env[name]?.trim() || "";
  }
  /**
   * Get the value of the `POWERTOOLS_SERVICE_NAME` environment variable.
   */
  getServiceName() {
    return this.get(this.serviceNameVariable);
  }
  /**
   * Get the value of the `_X_AMZN_TRACE_ID` environment variable.
   *
   * The AWS X-Ray Trace data available in the environment variable has this format:
   * `Root=1-5759e988-bd862e3fe1be46a994272793;Parent=557abcec3ee5a047;Sampled=1`,
   *
   * The actual Trace ID is: `1-5759e988-bd862e3fe1be46a994272793`.
   */
  getXrayTraceId() {
    const xRayTraceData = this.getXrayTraceData();
    return xRayTraceData?.Root;
  }
  /**
   * Determine if the current invocation is part of a sampled X-Ray trace.
   *
   * The AWS X-Ray Trace data available in the environment variable has this format:
   * `Root=1-5759e988-bd862e3fe1be46a994272793;Parent=557abcec3ee5a047;Sampled=1`,
   */
  getXrayTraceSampled() {
    const xRayTraceData = this.getXrayTraceData();
    return xRayTraceData?.Sampled === "1";
  }
  /**
   * Determine if the current invocation is running in a development environment.
   */
  isDevMode() {
    return this.isValueTrue(this.get(this.devModeVariable));
  }
  /**
   * Helper function to determine if a value is considered thruthy.
   *
   * @param value The value to check for truthiness.
   */
  isValueTrue(value) {
    const truthyValues = ["1", "y", "yes", "t", "true", "on"];
    return truthyValues.includes(value.toLowerCase());
  }
  /**
   * Helper function to determine if a value is considered falsy.
   *
   * @param value The value to check for falsiness.
   */
  isValueFalse(value) {
    const falsyValues = ["0", "n", "no", "f", "false", "off"];
    return falsyValues.includes(value.toLowerCase());
  }
  /**
   * Get the AWS X-Ray Trace data from the environment variable.
   *
   * The method parses the environment variable `_X_AMZN_TRACE_ID` and returns an object with the key-value pairs.
   */
  getXrayTraceData() {
    const xRayTraceEnv = this.get(this.xRayTraceIdVariable);
    if (xRayTraceEnv === "")
      return void 0;
    if (!xRayTraceEnv.includes("="))
      return { Root: xRayTraceEnv };
    const xRayTraceData = {};
    for (const field of xRayTraceEnv.split(";")) {
      const [key, value] = field.split("=");
      xRayTraceData[key] = value;
    }
    return xRayTraceData;
  }
};

// asset-input/node_modules/@aws-lambda-powertools/commons/lib/esm/awsSdkUtils.js
var EXEC_ENV = process.env.AWS_EXECUTION_ENV || "NA";

// asset-input/node_modules/@aws-lambda-powertools/commons/lib/esm/middleware/constants.js
var PREFIX = "powertools-for-aws";
var TRACER_KEY = `${PREFIX}.tracer`;
var METRICS_KEY = `${PREFIX}.metrics`;
var LOGGER_KEY = `${PREFIX}.logger`;
var IDEMPOTENCY_KEY = `${PREFIX}.idempotency`;

// asset-input/node_modules/@aws-lambda-powertools/commons/lib/esm/index.js
if (!process.env.AWS_SDK_UA_APP_ID) {
  process.env.AWS_SDK_UA_APP_ID = `PT/NO-OP/${PT_VERSION}`;
}

// asset-input/node_modules/@aws-lambda-powertools/logger/lib/esm/Logger.js
var import_lodash2 = __toESM(require_lodash(), 1);

// asset-input/node_modules/@aws-lambda-powertools/logger/lib/esm/config/EnvironmentVariablesService.js
var EnvironmentVariablesService2 = class extends EnvironmentVariablesService {
  // Reserved environment variables
  awsLogLevelVariable = "AWS_LAMBDA_LOG_LEVEL";
  awsRegionVariable = "AWS_REGION";
  currentEnvironmentVariable = "ENVIRONMENT";
  functionNameVariable = "AWS_LAMBDA_FUNCTION_NAME";
  functionVersionVariable = "AWS_LAMBDA_FUNCTION_VERSION";
  logEventVariable = "POWERTOOLS_LOGGER_LOG_EVENT";
  logLevelVariable = "POWERTOOLS_LOG_LEVEL";
  logLevelVariableLegacy = "LOG_LEVEL";
  memoryLimitInMBVariable = "AWS_LAMBDA_FUNCTION_MEMORY_SIZE";
  sampleRateValueVariable = "POWERTOOLS_LOGGER_SAMPLE_RATE";
  tzVariable = "TZ";
  /**
   * Return the value of the `AWS_LAMBDA_LOG_LEVEL` environment variable.
   *
   * The `AWS_LAMBDA_LOG_LEVEL` environment variable is set by AWS Lambda when configuring
   * the function's log level using the Advanced Logging Controls feature. This value always
   * takes precedence over other means of configuring the log level.
   *
   * We need to map the `FATAL` log level to `CRITICAL`, see {@link https://docs.aws.amazon.com/lambda/latest/dg/configuration-logging.html#configuration-logging-log-levels AWS Lambda Log Levels}.
   */
  getAwsLogLevel() {
    const awsLogLevelVariable = this.get(this.awsLogLevelVariable);
    return awsLogLevelVariable === "FATAL" ? "CRITICAL" : awsLogLevelVariable;
  }
  /**
   * Return the value of the AWS_REGION environment variable.
   */
  getAwsRegion() {
    return this.get(this.awsRegionVariable);
  }
  /**
   * Return the value of the ENVIRONMENT environment variable.
   */
  getCurrentEnvironment() {
    return this.get(this.currentEnvironmentVariable);
  }
  /**
   * Return the value of the AWS_LAMBDA_FUNCTION_MEMORY_SIZE environment variable.
   */
  getFunctionMemory() {
    const value = this.get(this.memoryLimitInMBVariable);
    return Number(value);
  }
  /**
   * Return the value of the AWS_LAMBDA_FUNCTION_NAME environment variable.
   */
  getFunctionName() {
    return this.get(this.functionNameVariable);
  }
  /**
   * Return the value of the AWS_LAMBDA_FUNCTION_VERSION environment variable.
   */
  getFunctionVersion() {
    return this.get(this.functionVersionVariable);
  }
  /**
   * Return the value of the POWERTOOLS_LOGGER_LOG_EVENT environment variable.
   */
  getLogEvent() {
    const value = this.get(this.logEventVariable);
    return this.isValueTrue(value);
  }
  /**
   * Return the value of the `POWERTOOLS_LOG_LEVEL` or `LOG_LEVEL` (legacy) environment variables
   * when the first one is not set.
   *
   * The `LOG_LEVEL` environment variable is considered legacy and will be removed in a future release.
   * The `AWS_LAMBDA_LOG_LEVEL` environment variable always takes precedence over the ones above.
   */
  getLogLevel() {
    const logLevelVariable = this.get(this.logLevelVariable);
    const logLevelVariableAlias = this.get(this.logLevelVariableLegacy);
    return logLevelVariable !== "" ? logLevelVariable : logLevelVariableAlias;
  }
  /**
   * Return the value of the POWERTOOLS_LOGGER_SAMPLE_RATE environment variable.
   */
  getSampleRateValue() {
    const value = this.get(this.sampleRateValueVariable);
    return value && value.length > 0 ? Number(value) : void 0;
  }
  /**
   * Return the value of the `TZ` environment variable or `UTC` if it is not set.
   */
  getTimezone() {
    const value = this.get(this.tzVariable);
    return value.length > 0 ? value : "UTC";
  }
};

// asset-input/node_modules/@aws-lambda-powertools/logger/lib/esm/constants.js
var LogJsonIndent = {
  PRETTY: 4,
  COMPACT: 0
};
var LogLevelThreshold = {
  TRACE: 6,
  DEBUG: 8,
  INFO: 12,
  WARN: 16,
  ERROR: 20,
  CRITICAL: 24,
  SILENT: 28
};
var ReservedKeys = [
  "level",
  "message",
  "sampling_rate",
  "service",
  "timestamp"
];

// asset-input/node_modules/@aws-lambda-powertools/logger/lib/esm/formatter/LogFormatter.js
var LogFormatter = class {
  /**
   * Instance of the {@link EnvironmentVariablesService} to use for configuration.
   */
  envVarsService;
  constructor(options) {
    this.envVarsService = options?.envVarsService;
  }
  /**
   * Format an error into a loggable object.
   *
   * @example
   * ```json
   * {
   *   "name": "Error",
   *   "location": "file.js:1",
   *   "message": "An error occurred",
   *   "stack": "Error: An error occurred\n    at file.js:1\n    at file.js:2\n    at file.js:3",
   *   "cause": {
   *     "name": "OtherError",
   *     "location": "file.js:2",
   *     "message": "Another error occurred",
   *     "stack": "Error: Another error occurred\n    at file.js:2\n    at file.js:3\n    at file.js:4"
   *   }
   * }
   * ```
   *
   * @param error - Error to format
   */
  formatError(error) {
    const { name, message, stack, cause, ...errorAttributes } = error;
    const formattedError = {
      name,
      location: this.getCodeLocation(error.stack),
      message,
      stack,
      cause: error.cause instanceof Error ? this.formatError(error.cause) : error.cause
    };
    for (const key in error) {
      if (typeof key === "string" && !["name", "message", "stack", "cause"].includes(key)) {
        formattedError[key] = errorAttributes[key];
      }
    }
    return formattedError;
  }
  /**
   * Format a date into an ISO 8601 string with the configured timezone.
   *
   * If the log formatter is passed an {@link EnvironmentVariablesService} instance
   * during construction, the timezone is read from the `TZ` environment variable, if present.
   *
   * Otherwise, the timezone defaults to ':UTC'.
   *
   * @param now - The date to format
   */
  formatTimestamp(now) {
    const defaultTimezone = "UTC";
    const configuredTimezone = this.envVarsService?.getTimezone();
    if (configuredTimezone && !configuredTimezone.includes(defaultTimezone))
      return this.#generateISOTimestampWithOffset(now, configuredTimezone);
    return now.toISOString();
  }
  /**
   * Get the location of an error from a stack trace.
   *
   * @param stack - stack trace to parse
   */
  getCodeLocation(stack) {
    if (!stack) {
      return "";
    }
    const stackLines = stack.split("\n");
    const regex = /\(([^)]*?):(\d+?):(\d+?)\)\\?$/;
    for (const item of stackLines) {
      const match = regex.exec(item);
      if (Array.isArray(match)) {
        return `${match[1]}:${Number(match[2])}`;
      }
    }
    return "";
  }
  /**
   * Create a new Intl.DateTimeFormat object configured with the specified time zone
   * and formatting options.
   *
   * The time is displayed in 24-hour format (hour12: false).
   *
   * @param timezone - IANA time zone identifier (e.g., "Asia/Dhaka").
   */
  #getDateFormatter = (timezone) => {
    const twoDigitFormatOption = "2-digit";
    const validTimeZone = Intl.supportedValuesOf("timeZone").includes(timezone) ? timezone : "UTC";
    return new Intl.DateTimeFormat("en", {
      year: "numeric",
      month: twoDigitFormatOption,
      day: twoDigitFormatOption,
      hour: twoDigitFormatOption,
      minute: twoDigitFormatOption,
      second: twoDigitFormatOption,
      hour12: false,
      timeZone: validTimeZone
    });
  };
  /**
   * Generate an ISO 8601 timestamp string with the specified time zone and the local time zone offset.
   *
   * @param date - date to format
   * @param timezone - IANA time zone identifier (e.g., "Asia/Dhaka").
   */
  #generateISOTimestampWithOffset(date, timezone) {
    const { year, month, day, hour, minute, second } = this.#getDateFormatter(timezone).formatToParts(date).reduce((acc, item) => {
      acc[item.type] = item.value;
      return acc;
    }, {});
    const datePart = `${year}-${month}-${day}T${hour}:${minute}:${second}`;
    const offset = -date.getTimezoneOffset();
    const offsetSign = offset >= 0 ? "+" : "-";
    const offsetHours = Math.abs(Math.floor(offset / 60)).toString().padStart(2, "0");
    const offsetMinutes = Math.abs(offset % 60).toString().padStart(2, "0");
    const millisecondPart = date.getMilliseconds().toString().padStart(3, "0");
    const offsetPart = `${offsetSign}${offsetHours}:${offsetMinutes}`;
    return `${datePart}.${millisecondPart}${offsetPart}`;
  }
};

// asset-input/node_modules/@aws-lambda-powertools/logger/lib/esm/formatter/LogItem.js
var import_lodash = __toESM(require_lodash(), 1);
var LogItem = class {
  /**
   * The attributes of the log item.
   */
  attributes = {};
  /**
   * Constructor for LogItem.
   *
   * Attributes are added in the following order:
   * - Standard keys provided by the logger (e.g. `message`, `level`, `timestamp`)
   * - Persistent attributes provided by developer, not formatted (done later)
   * - Ephemeral attributes provided as parameters for a single log item (done later)
   *
   * @param params - The parameters for the LogItem.
   */
  constructor(params) {
    this.setAttributes(params.attributes);
  }
  /**
   * Add attributes to the log item.
   *
   * @param attributes - The attributes to add to the log item.
   */
  addAttributes(attributes) {
    (0, import_lodash.default)(this.attributes, attributes);
    return this;
  }
  /**
   * Get the attributes of the log item.
   */
  getAttributes() {
    return this.attributes;
  }
  /**
   * Prepare the log item for printing.
   *
   * This operation removes empty keys from the log item, see {@link removeEmptyKeys | removeEmptyKeys()} for more information.
   */
  prepareForPrint() {
    this.attributes = this.removeEmptyKeys(this.getAttributes());
  }
  /**
   * Remove empty keys from the log item, where empty keys are defined as keys with
   * values of `undefined`, empty strings (`''`), or `null`.
   *
   * @param attributes - The attributes to remove empty keys from.
   */
  removeEmptyKeys(attributes) {
    const newAttributes = {};
    for (const key in attributes) {
      if (attributes[key] !== void 0 && attributes[key] !== "" && attributes[key] !== null) {
        newAttributes[key] = attributes[key];
      }
    }
    return newAttributes;
  }
  /**
   * Replace the attributes of the log item.
   *
   * @param attributes - The attributes to set for the log item.
   */
  setAttributes(attributes) {
    this.attributes = attributes;
  }
};

// asset-input/node_modules/@aws-lambda-powertools/logger/lib/esm/formatter/PowertoolsLogFormatter.js
var PowertoolsLogFormatter = class extends LogFormatter {
  /**
   * List of keys to order log attributes by.
   *
   * This can be a set of keys or an array of keys.
   */
  #logRecordOrder;
  constructor(options) {
    super(options);
    this.#logRecordOrder = options?.logRecordOrder;
  }
  /**
   * It formats key-value pairs of log attributes.
   *
   * @param {UnformattedAttributes} attributes - unformatted attributes
   * @param {LogAttributes} additionalLogAttributes - additional log attributes
   */
  formatAttributes(attributes, additionalLogAttributes) {
    const baseAttributes = {
      level: attributes.logLevel,
      message: attributes.message,
      timestamp: this.formatTimestamp(attributes.timestamp),
      service: attributes.serviceName,
      cold_start: attributes.lambdaContext?.coldStart,
      function_arn: attributes.lambdaContext?.invokedFunctionArn,
      function_memory_size: attributes.lambdaContext?.memoryLimitInMB,
      function_name: attributes.lambdaContext?.functionName,
      function_request_id: attributes.lambdaContext?.awsRequestId,
      sampling_rate: attributes.sampleRateValue,
      xray_trace_id: attributes.xRayTraceId
    };
    if (this.#logRecordOrder === void 0) {
      return new LogItem({ attributes: baseAttributes }).addAttributes(additionalLogAttributes);
    }
    const orderedAttributes = {};
    for (const key of this.#logRecordOrder) {
      if (key in baseAttributes && !(key in orderedAttributes)) {
        orderedAttributes[key] = baseAttributes[key];
      } else if (key in additionalLogAttributes && !(key in orderedAttributes)) {
        orderedAttributes[key] = additionalLogAttributes[key];
      }
    }
    for (const key in baseAttributes) {
      if (!(key in orderedAttributes)) {
        orderedAttributes[key] = baseAttributes[key];
      }
    }
    for (const key in additionalLogAttributes) {
      if (!(key in orderedAttributes)) {
        orderedAttributes[key] = additionalLogAttributes[key];
      }
    }
    const powertoolsLogItem = new LogItem({
      attributes: orderedAttributes
    });
    return powertoolsLogItem;
  }
};

// asset-input/node_modules/@aws-lambda-powertools/logger/lib/esm/logBuffer.js
var SizedItem = class {
  value;
  logLevel;
  byteSize;
  constructor(value, logLevel) {
    if (!isString(value)) {
      throw new Error("Value should be a string");
    }
    this.value = value;
    this.logLevel = logLevel;
    this.byteSize = Buffer.byteLength(value);
  }
};
var SizedSet = class extends Set {
  currentBytesSize = 0;
  hasEvictedLog = false;
  add(item) {
    this.currentBytesSize += item.byteSize;
    super.add(item);
    return this;
  }
  delete(item) {
    const wasDeleted = super.delete(item);
    if (wasDeleted) {
      this.currentBytesSize -= item.byteSize;
    }
    return wasDeleted;
  }
  clear() {
    super.clear();
    this.currentBytesSize = 0;
  }
  shift() {
    const firstElement = this.values().next().value;
    if (firstElement) {
      this.delete(firstElement);
    }
    return firstElement;
  }
};
var CircularMap = class extends Map {
  #maxBytesSize;
  #onBufferOverflow;
  constructor({ maxBytesSize, onBufferOverflow }) {
    super();
    this.#maxBytesSize = maxBytesSize;
    this.#onBufferOverflow = onBufferOverflow;
  }
  setItem(key, value, logLevel) {
    const item = new SizedItem(value, logLevel);
    if (item.byteSize > this.#maxBytesSize) {
      throw new Error("Item too big");
    }
    const buffer = this.get(key) || new SizedSet();
    if (buffer.currentBytesSize + item.byteSize >= this.#maxBytesSize) {
      this.#deleteFromBufferUntilSizeIsLessThanMax(buffer, item);
      if (this.#onBufferOverflow) {
        this.#onBufferOverflow();
      }
    }
    buffer.add(item);
    super.set(key, buffer);
    return this;
  }
  #deleteFromBufferUntilSizeIsLessThanMax = (buffer, item) => {
    while (buffer.currentBytesSize + item.byteSize >= this.#maxBytesSize) {
      buffer.shift();
      buffer.hasEvictedLog = true;
    }
  };
};

// asset-input/node_modules/@aws-lambda-powertools/logger/lib/esm/Logger.js
var Logger = class _Logger extends Utility {
  /**
   * Console instance used to print logs.
   *
   * In AWS Lambda, we create a new instance of the Console class so that we can have
   * full control over the output of the logs. In testing environments, we use the
   * default console instance.
   *
   * This property is initialized in the constructor in setOptions().
   */
  console;
  /**
   * Custom config service instance used to configure the logger.
   */
  customConfigService;
  /**
   * Environment variables service instance used to fetch environment variables.
   */
  envVarsService = new EnvironmentVariablesService2();
  /**
   * Whether to print the Lambda invocation event in the logs.
   */
  logEvent = false;
  /**
   * Formatter used to format the log items.
   * @default new PowertoolsLogFormatter()
   */
  logFormatter;
  /**
   * JSON indentation used to format the logs.
   */
  logIndentation = LogJsonIndent.COMPACT;
  /**
   * Log level used internally by the current instance of Logger.
   */
  logLevel = LogLevelThreshold.INFO;
  /**
   * Persistent log attributes that will be logged in all log items.
   */
  persistentLogAttributes = {};
  /**
   * Standard attributes managed by Powertools that will be logged in all log items.
   */
  powertoolsLogData = {};
  /**
   * Temporary log attributes that can be appended with `appendKeys()` method.
   */
  temporaryLogAttributes = {};
  /**
   * Buffer used to store logs until the logger is initialized.
   *
   * Sometimes we need to log warnings before the logger is fully initialized, however we can't log them
   * immediately because the logger is not ready yet. This buffer stores those logs until the logger is ready.
   */
  #initBuffer = [];
  /**
   * Flag used to determine if the logger is initialized.
   */
  #isInitialized = false;
  /**
   * Map used to hold the list of keys and their type.
   *
   * Because keys of different types can be overwritten, we keep a list of keys that were added and their last
   * type. We then use this map at log preparation time to pick the last one.
   */
  #keys = /* @__PURE__ */ new Map();
  /**
   * This is the initial log leval as set during the initialization of the logger.
   *
   * We keep this value to be able to reset the log level to the initial value when the sample rate is refreshed.
   */
  #initialLogLevel = LogLevelThreshold.INFO;
  /**
   * Replacer function used to serialize the log items.
   */
  #jsonReplacerFn;
  /**
   * Represents whether the buffering functionality is enabled in the logger
   */
  isBufferEnabled = false;
  /**
   * Log level threshold for the buffer
   * Logs with a level lower than this threshold will be buffered
   */
  bufferLogThreshold = LogLevelThreshold.DEBUG;
  /**
   * Max size of the buffer. Additions to the buffer beyond this size will
   * cause older logs to be evicted from the buffer
   */
  #maxBufferBytesSize = 1024;
  /**
   * Contains buffered logs, grouped by _X_AMZN_TRACE_ID, each group with a max size of `maxBufferBytesSize`
   */
  #buffer = new CircularMap({
    maxBytesSize: this.#maxBufferBytesSize
  });
  /**
   * Log level used by the current instance of Logger.
   *
   * Returns the log level as a number. The higher the number, the less verbose the logs.
   * To get the log level name, use the {@link getLevelName()} method.
   */
  get level() {
    return this.logLevel;
  }
  constructor(options = {}) {
    super();
    const { customConfigService, ...rest } = options;
    this.setCustomConfigService(customConfigService);
    this.setOptions(rest);
    this.#isInitialized = true;
    for (const [level, log] of this.#initBuffer) {
      this.printLog(level, this.createAndPopulateLogItem(...log));
    }
    this.#initBuffer = [];
  }
  /**
   * Add the current Lambda function's invocation context data to the powertoolLogData property of the instance.
   * This context data will be part of all printed log items.
   *
   * @param context - The Lambda function's invocation context.
   */
  addContext(context) {
    this.addToPowertoolsLogData({
      lambdaContext: {
        invokedFunctionArn: context.invokedFunctionArn,
        coldStart: this.getColdStart(),
        awsRequestId: context.awsRequestId,
        memoryLimitInMB: context.memoryLimitInMB,
        functionName: context.functionName,
        functionVersion: context.functionVersion
      }
    });
  }
  /**
   * @deprecated This method is deprecated and will be removed in the future major versions, please use {@link appendPersistentKeys() `appendPersistentKeys()`} instead.
   */
  addPersistentLogAttributes(attributes) {
    this.appendPersistentKeys(attributes);
  }
  /**
   * Add the given temporary attributes (key-value pairs) to all log items generated by this Logger instance.
   *
   * If the key already exists in the attributes, it will be overwritten. If the key is one of `level`, `message`, `sampling_rate`,
   * `service`, or `timestamp` we will log a warning and drop the value.
   *
   * @param attributes - The attributes to add to all log items.
   */
  appendKeys(attributes) {
    this.#appendKeys(attributes, "temp");
  }
  /**
   * Add the given persistent attributes (key-value pairs) to all log items generated by this Logger instance.
   *
   * If the key already exists in the attributes, it will be overwritten. If the key is one of `level`, `message`, `sampling_rate`,
   * `service`, or `timestamp` we will log a warning and drop the value.
   *
   * @param attributes - The attributes to add to all log items.
   */
  appendPersistentKeys(attributes) {
    this.#appendKeys(attributes, "persistent");
  }
  /**
   * Create a separate Logger instance, identical to the current one.
   * It's possible to overwrite the new instance options by passing them.
   *
   * @param options - The options to initialize the child logger with.
   */
  createChild(options = {}) {
    const childLogger = this.createLogger(
      // Merge parent logger options with options passed to createChild,
      // the latter having precedence.
      (0, import_lodash2.default)({}, {
        logLevel: this.getLevelName(),
        serviceName: this.powertoolsLogData.serviceName,
        sampleRateValue: this.powertoolsLogData.sampleRateValue,
        logFormatter: this.getLogFormatter(),
        customConfigService: this.getCustomConfigService(),
        environment: this.powertoolsLogData.environment,
        persistentLogAttributes: this.persistentLogAttributes,
        temporaryLogAttributes: this.temporaryLogAttributes,
        jsonReplacerFn: this.#jsonReplacerFn
      }, options)
    );
    if (this.powertoolsLogData.lambdaContext)
      childLogger.addContext(this.powertoolsLogData.lambdaContext);
    return childLogger;
  }
  /**
   * Print a log item with level CRITICAL.
   *
   * @param input - The log message.
   * @param extraInput - The extra input to log.
   */
  critical(input, ...extraInput) {
    this.processLogItem(LogLevelThreshold.CRITICAL, input, extraInput);
  }
  /**
   * Print a log item with level DEBUG.
   *
   * @param input
   * @param extraInput - The extra input to log.
   */
  debug(input, ...extraInput) {
    this.processLogItem(LogLevelThreshold.DEBUG, input, extraInput);
  }
  /**
   * Print a log item with level ERROR.
   *
   * @param input - The log message.
   * @param extraInput - The extra input to log.
   */
  error(input, ...extraInput) {
    this.processLogItem(LogLevelThreshold.ERROR, input, extraInput);
  }
  /**
   * Get the log level name of the current instance of Logger.
   *
   * Returns the log level name, i.e. `INFO`, `DEBUG`, etc.
   * To get the log level as a number, use the {@link Logger.level} property.
   */
  getLevelName() {
    return this.getLogLevelNameFromNumber(this.logLevel);
  }
  /**
   * Return a boolean value. True means that the Lambda invocation events
   * are printed in the logs.
   */
  getLogEvent() {
    return this.logEvent;
  }
  /**
   * Return the persistent log attributes, which are the attributes
   * that will be logged in all log items.
   */
  getPersistentLogAttributes() {
    return this.persistentLogAttributes;
  }
  /**
   * Print a log item with level INFO.
   *
   * @param input - The log message.
   * @param extraInput - The extra input to log.
   */
  info(input, ...extraInput) {
    this.processLogItem(LogLevelThreshold.INFO, input, extraInput);
  }
  /**
   * Class method decorator that adds the current Lambda function context as extra
   * information in all log items.
   *
   * This decorator is useful when you want to add the Lambda context to all log items
   * and it works only when decorating a class method that is a Lambda function handler.
   *
   * @example
   * ```typescript
   * import { Logger } from '@aws-lambda-powertools/logger';
   * import type { LambdaInterface } from '@aws-lambda-powertools/commons/types';
   *
   * const logger = new Logger({ serviceName: 'serverlessAirline' });
   *
   * class Lambda implements LambdaInterface {
   *   // Decorate your handler class method
   *   ⁣@logger.injectLambdaContext()
   *   public async handler(_event: unknown, _context: unknown): Promise<void> {
   *     logger.info('This is an INFO log with some context');
   *   }
   * }
   *
   * const handlerClass = new Lambda();
   * export const handler = handlerClass.handler.bind(handlerClass);
   * ```
   *
   * @see https://www.typescriptlang.org/docs/handbook/decorators.html#method-decorators
   */
  injectLambdaContext(options) {
    return (_target, _propertyKey, descriptor) => {
      const originalMethod = descriptor.value;
      const loggerRef = this;
      descriptor.value = async function(event, context, callback) {
        _Logger.injectLambdaContextBefore(loggerRef, event, context, options);
        let result;
        try {
          result = await originalMethod.apply(this, [event, context, callback]);
        } finally {
          if (options?.clearState || options?.resetKeys)
            loggerRef.resetKeys();
        }
        return result;
      };
    };
  }
  /**
   * @deprecated This method is deprecated and will be removed in the future major versions. Use {@link resetKeys()} instead.
   */
  /* v8 ignore start */
  static injectLambdaContextAfterOrOnError(logger2, _persistentAttributes, options) {
    if (options && (options.clearState || options?.resetKeys)) {
      logger2.resetKeys();
    }
  }
  /* v8 ignore stop */
  /**
   * @deprecated - This method is deprecated and will be removed in the next major version.
   */
  static injectLambdaContextBefore(logger2, event, context, options) {
    logger2.addContext(context);
    let shouldLogEvent = void 0;
    if (options && Object.hasOwn(options, "logEvent")) {
      shouldLogEvent = options.logEvent;
    }
    logger2.logEventIfEnabled(event, shouldLogEvent);
  }
  /**
   * Log the AWS Lambda event payload for the current invocation if the environment variable `POWERTOOLS_LOGGER_LOG_EVENT` is set to `true`.
   *
   * @example
   * ```ts
   * process.env.POWERTOOLS_LOGGER_LOG_EVENT = 'true';
   *
   * import { Logger } from '@aws-lambda-powertools/logger';
   *
   * const logger = new Logger();
   *
   * export const handler = async (event) => {
   *   logger.logEventIfEnabled(event);
   *   // ... your handler code
   * }
   * ```
   *
   * @param event - The AWS Lambda event payload.
   * @param overwriteValue - Overwrite the environment variable value.
   */
  logEventIfEnabled(event, overwriteValue) {
    if (!this.shouldLogEvent(overwriteValue))
      return;
    this.info("Lambda invocation event", { event });
  }
  /**
   * This method allows recalculating the initial sampling decision for changing
   * the log level to DEBUG based on a sample rate value used during initialization,
   * potentially yielding a different outcome.
   */
  refreshSampleRateCalculation() {
    this.setInitialSampleRate(this.powertoolsLogData.sampleRateValue);
  }
  /**
   * Remove temporary attributes based on provided keys to all log items generated by this Logger instance.
   *
   * @param keys - The keys to remove.
   */
  removeKeys(keys) {
    for (const key of keys) {
      this.temporaryLogAttributes[key] = void 0;
      if (this.persistentLogAttributes[key]) {
        this.#keys.set(key, "persistent");
      } else {
        this.#keys.delete(key);
      }
    }
  }
  /**
   * Remove the given keys from the persistent keys.
   *
   * @example
   * ```typescript
   * import { Logger } from '@aws-lambda-powertools/logger';
   *
   * const logger = new Logger({
   *   persistentKeys: {
   *     environment: 'prod',
   *   },
   * });
   *
   * logger.removePersistentKeys(['environment']);
   * ```
   *
   * @param keys - The keys to remove from the persistent attributes.
   */
  removePersistentKeys(keys) {
    for (const key of keys) {
      this.persistentLogAttributes[key] = void 0;
      if (this.temporaryLogAttributes[key]) {
        this.#keys.set(key, "temp");
      } else {
        this.#keys.delete(key);
      }
    }
  }
  /**
   * @deprecated This method is deprecated and will be removed in the future major versions. Use {@link removePersistentKeys()} instead.
   */
  removePersistentLogAttributes(keys) {
    this.removePersistentKeys(keys);
  }
  /**
   * Remove all temporary log attributes added with {@link appendKeys() `appendKeys()`} method.
   */
  resetKeys() {
    for (const key of Object.keys(this.temporaryLogAttributes)) {
      if (this.persistentLogAttributes[key]) {
        this.#keys.set(key, "persistent");
      } else {
        this.#keys.delete(key);
      }
    }
    this.temporaryLogAttributes = {};
  }
  /**
   * Set the log level for this Logger instance.
   *
   * If the log level is set using AWS Lambda Advanced Logging Controls, it sets it
   * instead of the given log level to avoid data loss.
   *
   * @param logLevel The log level to set, i.e. `error`, `warn`, `info`, `debug`, etc.
   */
  setLogLevel(logLevel) {
    if (this.awsLogLevelShortCircuit(logLevel))
      return;
    if (this.isValidLogLevel(logLevel)) {
      this.logLevel = LogLevelThreshold[logLevel];
    } else {
      throw new Error(`Invalid log level: ${logLevel}`);
    }
  }
  /**
   * @deprecated This method is deprecated and will be removed in the future major versions, please use {@link appendPersistentKeys() `appendPersistentKeys()`} instead.
   */
  setPersistentLogAttributes(attributes) {
    this.persistentLogAttributes = attributes;
  }
  /**
   * Check whether the current Lambda invocation event should be printed in the logs or not.
   *
   * @param overwriteValue - Overwrite the environment variable value.
   */
  shouldLogEvent(overwriteValue) {
    if (typeof overwriteValue === "boolean") {
      return overwriteValue;
    }
    return this.getLogEvent();
  }
  /**
   * Print a log item with level TRACE.
   *
   * @param input - The log message.
   * @param extraInput - The extra input to log.
   */
  trace(input, ...extraInput) {
    this.processLogItem(LogLevelThreshold.TRACE, input, extraInput);
  }
  /**
   * Print a log item with level WARN.
   *
   * @param input - The log message.
   * @param extraInput - The extra input to log.
   */
  warn(input, ...extraInput) {
    this.processLogItem(LogLevelThreshold.WARN, input, extraInput);
  }
  /**
   * Factory method for instantiating logger instances. Used by `createChild` method.
   * Important for customization and subclassing. It allows subclasses, like `MyOwnLogger`,
   * to override its behavior while keeping the main business logic in `createChild` intact.
   *
   * @example
   * ```typescript
   * // MyOwnLogger subclass
   * class MyOwnLogger extends Logger {
   *   protected createLogger(options?: ConstructorOptions): MyOwnLogger {
   *     return new MyOwnLogger(options);
   *   }
   *   // No need to re-implement business logic from `createChild` and keep track on changes
   *   public createChild(options?: ConstructorOptions): MyOwnLogger {
   *     return super.createChild(options) as MyOwnLogger;
   *   }
   * }
   * ```
   *
   * @param options - Logger configuration options.
   */
  createLogger(options) {
    return new _Logger(options);
  }
  /**
   * A custom JSON replacer function that is used to serialize the log items.
   *
   * By default, we already extend the default serialization behavior to handle `BigInt` and `Error` objects, as well as remove circular references.
   * When a custom JSON replacer function is passed to the Logger constructor, it will be called **before** our custom rules for each key-value pair in the object being stringified.
   *
   * This allows you to customize the serialization while still benefiting from the default behavior.
   *
   * @see {@link ConstructorOptions.jsonReplacerFn}
   */
  getJsonReplacer() {
    const references = /* @__PURE__ */ new WeakSet();
    return (key, value) => {
      let replacedValue = value;
      if (this.#jsonReplacerFn)
        replacedValue = this.#jsonReplacerFn?.(key, replacedValue);
      if (replacedValue instanceof Error) {
        replacedValue = this.getLogFormatter().formatError(replacedValue);
      }
      if (typeof replacedValue === "bigint") {
        return replacedValue.toString();
      }
      if (typeof replacedValue === "object" && replacedValue !== null) {
        if (references.has(replacedValue)) {
          return;
        }
        references.add(replacedValue);
      }
      return replacedValue;
    };
  }
  /**
   * Store information that is printed in all log items.
   *
   * @param attributes - The attributes to add to all log items.
   */
  addToPowertoolsLogData(attributes) {
    (0, import_lodash2.default)(this.powertoolsLogData, attributes);
  }
  /**
   * Shared logic for adding keys to the logger instance.
   *
   * @param attributes - The attributes to add to the log item.
   * @param type - The type of the attributes to add.
   */
  #appendKeys(attributes, type) {
    for (const attributeKey of Object.keys(attributes)) {
      if (this.#checkReservedKeyAndWarn(attributeKey) === false) {
        this.#keys.set(attributeKey, type);
      }
    }
    if (type === "temp") {
      (0, import_lodash2.default)(this.temporaryLogAttributes, attributes);
    } else {
      (0, import_lodash2.default)(this.persistentLogAttributes, attributes);
    }
  }
  awsLogLevelShortCircuit(selectedLogLevel) {
    const awsLogLevel = this.getEnvVarsService().getAwsLogLevel();
    if (this.isValidLogLevel(awsLogLevel)) {
      this.logLevel = LogLevelThreshold[awsLogLevel];
      if (this.isValidLogLevel(selectedLogLevel) && this.logLevel > LogLevelThreshold[selectedLogLevel]) {
        this.warn(`Current log level (${selectedLogLevel}) does not match AWS Lambda Advanced Logging Controls minimum log level (${awsLogLevel}). This can lead to data loss, consider adjusting them.`);
      }
      return true;
    }
    return false;
  }
  /**
   * Create a log item and populate it with the given log level, input, and extra input.
   */
  createAndPopulateLogItem(logLevel, input, extraInput) {
    const unformattedBaseAttributes = {
      logLevel: this.getLogLevelNameFromNumber(logLevel),
      timestamp: /* @__PURE__ */ new Date(),
      xRayTraceId: this.envVarsService.getXrayTraceId(),
      ...this.getPowertoolsLogData(),
      message: ""
    };
    const additionalAttributes = this.#createAdditionalAttributes();
    this.#processMainInput(input, unformattedBaseAttributes, additionalAttributes);
    this.#processExtraInput(extraInput, additionalAttributes);
    return this.getLogFormatter().formatAttributes(unformattedBaseAttributes, additionalAttributes);
  }
  /**
   * Create additional attributes from persistent and temporary keys
   */
  #createAdditionalAttributes() {
    const attributes = {};
    for (const [key, type] of this.#keys) {
      if (!this.#checkReservedKeyAndWarn(key)) {
        attributes[key] = type === "persistent" ? this.persistentLogAttributes[key] : this.temporaryLogAttributes[key];
      }
    }
    return attributes;
  }
  /**
   * Process the main input message and add it to the attributes
   */
  #processMainInput(input, baseAttributes, additionalAttributes) {
    if (typeof input === "string") {
      baseAttributes.message = input;
      return;
    }
    const { message, ...rest } = input;
    baseAttributes.message = message;
    for (const [key, value] of Object.entries(rest)) {
      if (!this.#checkReservedKeyAndWarn(key)) {
        additionalAttributes[key] = value;
      }
    }
  }
  /**
   * Process extra input items and add them to additional attributes
   */
  #processExtraInput(extraInput, additionalAttributes) {
    for (const item of extraInput) {
      if (isNullOrUndefined(item)) {
        continue;
      }
      if (item instanceof Error) {
        additionalAttributes.error = item;
      } else if (typeof item === "string") {
        additionalAttributes.extra = item;
      } else {
        this.#processExtraObject(item, additionalAttributes);
      }
    }
  }
  /**
   * Process an extra input object and add its properties to additional attributes
   */
  #processExtraObject(item, additionalAttributes) {
    for (const [key, value] of Object.entries(item)) {
      if (!this.#checkReservedKeyAndWarn(key)) {
        additionalAttributes[key] = value;
      }
    }
  }
  /**
   * Check if a given key is reserved and warn the user if it is.
   *
   * @param key - The key to check
   */
  #checkReservedKeyAndWarn(key) {
    if (ReservedKeys.includes(key)) {
      this.warn(`The key "${key}" is a reserved key and will be dropped.`);
      return true;
    }
    return false;
  }
  /**
   * Get the custom config service, an abstraction used to fetch environment variables.
   */
  getCustomConfigService() {
    return this.customConfigService;
  }
  /**
   * Get the instance of a service that fetches environment variables.
   */
  getEnvVarsService() {
    return this.envVarsService;
  }
  /**
   * Get the instance of a service that formats the structure of a
   * log item's keys and values in the desired way.
   */
  getLogFormatter() {
    return this.logFormatter;
  }
  /**
   * Get the log level name from the log level number.
   *
   * For example, if the log level is 16, it will return 'WARN'.
   *
   * @param logLevel - The log level to get the name of
   */
  getLogLevelNameFromNumber(logLevel) {
    let found;
    for (const [key, value] of Object.entries(LogLevelThreshold)) {
      if (value === logLevel) {
        found = key;
        break;
      }
    }
    return found;
  }
  /**
   * Get information that will be added in all log item by
   * this Logger instance (different from user-provided persistent attributes).
   */
  getPowertoolsLogData() {
    return this.powertoolsLogData;
  }
  /**
   * Check if a given log level is valid.
   *
   * @param logLevel - The log level to check
   */
  isValidLogLevel(logLevel) {
    return typeof logLevel === "string" && logLevel in LogLevelThreshold;
  }
  /**
   * Check if a given sample rate value is valid.
   *
   * @param sampleRateValue - The sample rate value to check
   */
  isValidSampleRate(sampleRateValue) {
    return typeof sampleRateValue === "number" && 0 <= sampleRateValue && sampleRateValue <= 1;
  }
  /**
   * Print a given log with given log level.
   *
   * @param logLevel - The log level
   * @param log - The log item to print
   */
  printLog(logLevel, log) {
    log.prepareForPrint();
    const consoleMethod = logLevel === LogLevelThreshold.CRITICAL ? "error" : this.getLogLevelNameFromNumber(logLevel).toLowerCase();
    this.console[consoleMethod](JSON.stringify(log.getAttributes(), this.getJsonReplacer(), this.logIndentation));
  }
  /**
   * Print or buffer a given log with given log level.
   *
   * @param logLevel - The log level threshold
   * @param input - The log message
   * @param extraInput - The extra input to log
   */
  processLogItem(logLevel, input, extraInput) {
    if (logLevel >= this.logLevel) {
      if (this.#isInitialized) {
        this.printLog(logLevel, this.createAndPopulateLogItem(logLevel, input, extraInput));
      } else {
        this.#initBuffer.push([logLevel, [logLevel, input, extraInput]]);
      }
      return;
    }
    const traceId = this.envVarsService.getXrayTraceId();
    if (traceId !== void 0 && this.shouldBufferLog(traceId, logLevel)) {
      try {
        this.bufferLogItem(traceId, this.createAndPopulateLogItem(logLevel, input, extraInput), logLevel);
      } catch (error) {
        this.printLog(LogLevelThreshold.WARN, this.createAndPopulateLogItem(LogLevelThreshold.WARN, `Unable to buffer log: ${error.message}`, [error]));
        this.printLog(logLevel, this.createAndPopulateLogItem(logLevel, input, extraInput));
      }
    }
  }
  /**
   * Initialize the console property as an instance of the internal version of Console() class (PR #748)
   * or as the global node console if the `POWERTOOLS_DEV' env variable is set and has truthy value.
   */
  setConsole() {
    if (!this.getEnvVarsService().isDevMode()) {
      this.console = new import_node_console.Console({
        stdout: process.stdout,
        stderr: process.stderr
      });
    } else {
      this.console = console;
    }
    this.console.trace = (message, ...optionalParams) => {
      this.console.log(message, ...optionalParams);
    };
  }
  /**
   * Set the Logger's customer config service instance, which will be used
   * to fetch environment variables.
   *
   * @param customConfigService - The custom config service
   */
  setCustomConfigService(customConfigService) {
    this.customConfigService = customConfigService ? customConfigService : void 0;
  }
  /**
   * Set the initial Logger log level based on the following order:
   * 1. If a log level is set using AWS Lambda Advanced Logging Controls, it sets it.
   * 2. If a log level is passed to the constructor, it sets it.
   * 3. If a log level is set via custom config service, it sets it.
   * 4. If a log level is set via env variables, it sets it.
   *
   * If none of the above is true, the default log level applies (`INFO`).
   *
   * @param logLevel - Log level passed to the constructor
   */
  setInitialLogLevel(logLevel) {
    const constructorLogLevel = logLevel?.toUpperCase();
    if (this.awsLogLevelShortCircuit(constructorLogLevel))
      return;
    if (this.isValidLogLevel(constructorLogLevel)) {
      this.logLevel = LogLevelThreshold[constructorLogLevel];
      this.#initialLogLevel = this.logLevel;
      return;
    }
    const customConfigValue = this.getCustomConfigService()?.getLogLevel()?.toUpperCase();
    if (this.isValidLogLevel(customConfigValue)) {
      this.logLevel = LogLevelThreshold[customConfigValue];
      this.#initialLogLevel = this.logLevel;
      return;
    }
    const envVarsValue = this.getEnvVarsService()?.getLogLevel()?.toUpperCase();
    if (this.isValidLogLevel(envVarsValue)) {
      this.logLevel = LogLevelThreshold[envVarsValue];
      this.#initialLogLevel = this.logLevel;
      return;
    }
  }
  /**
   * Set the sample rate value with the following priority:
   * 1. Constructor value
   * 2. Custom config service value
   * 3. Environment variable value
   * 4. Default value (zero)
   *
   * @param sampleRateValue - The sample rate value
   */
  setInitialSampleRate(sampleRateValue) {
    this.powertoolsLogData.sampleRateValue = 0;
    const constructorValue = sampleRateValue;
    const customConfigValue = this.getCustomConfigService()?.getSampleRateValue();
    const envVarsValue = this.getEnvVarsService().getSampleRateValue();
    for (const value of [constructorValue, customConfigValue, envVarsValue]) {
      if (this.isValidSampleRate(value)) {
        this.powertoolsLogData.sampleRateValue = value;
        if (this.logLevel > LogLevelThreshold.DEBUG && value && (0, import_node_crypto.randomInt)(0, 100) / 100 <= value) {
          this.setLogLevel("DEBUG");
          this.debug("Setting log level to DEBUG due to sampling rate");
        } else {
          this.setLogLevel(this.getLogLevelNameFromNumber(this.#initialLogLevel));
        }
        return;
      }
    }
  }
  /**
   * If the log event feature is enabled via env variable, it sets a property that tracks whether
   * the event passed to the Lambda function handler should be logged or not.
   */
  setLogEvent() {
    if (this.getEnvVarsService().getLogEvent()) {
      this.logEvent = true;
    }
  }
  /**
   * Set the log formatter instance, in charge of giving a custom format
   * to the structured logs, and optionally the ordering for keys within logs.
   *
   * @param logFormatter - The log formatter
   * @param logRecordOrder - Optional list of keys to specify order in logs
   */
  setLogFormatter(logFormatter, logRecordOrder) {
    this.logFormatter = logFormatter ?? new PowertoolsLogFormatter({
      envVarsService: this.getEnvVarsService(),
      logRecordOrder
    });
  }
  /**
   * If the `POWERTOOLS_DEV` env variable is set,
   * add JSON indentation for pretty printing logs.
   */
  setLogIndentation() {
    if (this.getEnvVarsService().isDevMode()) {
      this.logIndentation = LogJsonIndent.PRETTY;
    }
  }
  /**
   * Configure the Logger instance settings that will affect the Logger's behaviour
   * and the content of all logs.
   *
   * @param options - Options to configure the Logger instance
   */
  setOptions(options) {
    const {
      logLevel,
      serviceName,
      sampleRateValue,
      logFormatter,
      persistentKeys,
      persistentLogAttributes,
      // deprecated in favor of persistentKeys
      environment,
      jsonReplacerFn,
      logRecordOrder
    } = options;
    if (persistentLogAttributes && persistentKeys) {
      this.warn("Both persistentLogAttributes and persistentKeys options were provided. Using persistentKeys as persistentLogAttributes is deprecated and will be removed in future releases");
    }
    this.setPowertoolsLogData(serviceName, environment, persistentKeys || persistentLogAttributes);
    this.setLogEvent();
    this.setInitialLogLevel(logLevel);
    this.setInitialSampleRate(sampleRateValue);
    this.setLogFormatter(logFormatter, logRecordOrder);
    this.setConsole();
    this.setLogIndentation();
    this.#jsonReplacerFn = jsonReplacerFn;
    return this;
  }
  /**
   * Add important data to the Logger instance that will affect the content of all logs.
   *
   * @param serviceName - The service name
   * @param environment - The environment
   * @param persistentKeys - The persistent log attributes
   */
  setPowertoolsLogData(serviceName, environment, persistentKeys) {
    this.addToPowertoolsLogData({
      awsRegion: this.getEnvVarsService().getAwsRegion(),
      environment: environment || this.getCustomConfigService()?.getCurrentEnvironment() || this.getEnvVarsService().getCurrentEnvironment(),
      serviceName: serviceName || this.getCustomConfigService()?.getServiceName() || this.getEnvVarsService().getServiceName() || this.getDefaultServiceName()
    });
    persistentKeys && this.appendPersistentKeys(persistentKeys);
  }
  /**
   * Add a log to the buffer
   * @param xrayTraceId - _X_AMZN_TRACE_ID of the request
   * @param log - Log to be buffered
   * @param logLevel - level of log to be buffered
   */
  bufferLogItem(xrayTraceId, log, logLevel) {
    log.prepareForPrint();
    const stringified = JSON.stringify(log.getAttributes(), this.getJsonReplacer(), this.logIndentation);
    this.#buffer.setItem(xrayTraceId, stringified, logLevel);
  }
  /**
   * Flushes all items of the respective _X_AMZN_TRACE_ID within
   * the buffer.
   */
  flushBuffer() {
    const traceId = this.envVarsService.getXrayTraceId();
    if (traceId === void 0) {
      return;
    }
    const buffer = this.#buffer.get(traceId);
    if (buffer === void 0) {
      return;
    }
    for (const item of buffer) {
      const consoleMethod = item.logLevel === LogLevelThreshold.CRITICAL ? "error" : this.getLogLevelNameFromNumber(item.logLevel).toLowerCase();
      this.console[consoleMethod](item.value);
    }
    if (buffer.hasEvictedLog) {
      this.printLog(LogLevelThreshold.WARN, this.createAndPopulateLogItem(LogLevelThreshold.WARN, "Some logs are not displayed because they were evicted from the buffer. Increase buffer size to store more logs in the buffer", []));
    }
    this.#buffer.delete(traceId);
  }
  /**
   * Tests if the log meets the criteria to be buffered
   * @param traceId - _X_AMZN_TRACE_ID of the request
   * @param logLevel - The  level of the log being considered
   */
  shouldBufferLog(traceId, logLevel) {
    return this.isBufferEnabled && traceId !== void 0 && logLevel <= this.bufferLogThreshold;
  }
};

// asset-input/node_modules/@aws-lambda-powertools/metrics/lib/esm/Metrics.js
var import_node_console2 = require("node:console");

// asset-input/node_modules/@aws-lambda-powertools/metrics/lib/esm/config/EnvironmentVariablesService.js
var EnvironmentVariablesService3 = class extends EnvironmentVariablesService {
  namespaceVariable = "POWERTOOLS_METRICS_NAMESPACE";
  disabledVariable = "POWERTOOLS_METRICS_DISABLED";
  /**
   * Get the value of the `POWERTOOLS_METRICS_NAMESPACE` environment variable.
   */
  getNamespace() {
    return this.get(this.namespaceVariable);
  }
  /**
   * Get the value of the `POWERTOOLS_METRICS_DISABLED` or `POWERTOOLS_DEV` environment variables.
   *
   * The `POWERTOOLS_METRICS_DISABLED` environment variable takes precedence over `POWERTOOLS_DEV`.
   */
  getMetricsDisabled() {
    const value = this.get(this.disabledVariable);
    if (this.isValueFalse(value))
      return false;
    if (this.isValueTrue(value))
      return true;
    if (this.isDevMode())
      return true;
    return false;
  }
};

// asset-input/node_modules/@aws-lambda-powertools/metrics/lib/esm/constants.js
var COLD_START_METRIC = "ColdStart";
var DEFAULT_NAMESPACE = "default_namespace";
var MAX_METRICS_SIZE = 100;
var MAX_METRIC_VALUES_SIZE = 100;
var MAX_DIMENSION_COUNT = 29;
var EMF_MAX_TIMESTAMP_PAST_AGE = 14 * 24 * 60 * 60 * 1e3;
var EMF_MAX_TIMESTAMP_FUTURE_AGE = 2 * 60 * 60 * 1e3;
var MetricUnit = {
  Seconds: "Seconds",
  Microseconds: "Microseconds",
  Milliseconds: "Milliseconds",
  Bytes: "Bytes",
  Kilobytes: "Kilobytes",
  Megabytes: "Megabytes",
  Gigabytes: "Gigabytes",
  Terabytes: "Terabytes",
  Bits: "Bits",
  Kilobits: "Kilobits",
  Megabits: "Megabits",
  Gigabits: "Gigabits",
  Terabits: "Terabits",
  Percent: "Percent",
  Count: "Count",
  BytesPerSecond: "Bytes/Second",
  KilobytesPerSecond: "Kilobytes/Second",
  MegabytesPerSecond: "Megabytes/Second",
  GigabytesPerSecond: "Gigabytes/Second",
  TerabytesPerSecond: "Terabytes/Second",
  BitsPerSecond: "Bits/Second",
  KilobitsPerSecond: "Kilobits/Second",
  MegabitsPerSecond: "Megabits/Second",
  GigabitsPerSecond: "Gigabits/Second",
  TerabitsPerSecond: "Terabits/Second",
  CountPerSecond: "Count/Second",
  NoUnit: "None"
};
var MetricResolution = {
  Standard: 60,
  High: 1
};

// asset-input/node_modules/@aws-lambda-powertools/metrics/lib/esm/Metrics.js
var Metrics = class _Metrics extends Utility {
  /**
   * Console instance used to print logs.
   *
   * In AWS Lambda, we create a new instance of the Console class so that we can have
   * full control over the output of the logs. In testing environments, we use the
   * default console instance.
   *
   * This property is initialized in the constructor in setOptions().
   *
   * @private
   */
  console;
  /**
   * Custom configuration service for metrics
   */
  customConfigService;
  /**
   * Default dimensions to be added to all metrics
   * @default {}
   */
  defaultDimensions = {};
  /**
   * Additional dimensions for the current metrics context
   * @default {}
   */
  dimensions = {};
  /**
   * Service for accessing environment variables
   */
  envVarsService;
  /**
   * Name of the Lambda function
   */
  functionName;
  /**
   * Custom logger object used for emitting debug, warning, and error messages.
   *
   * Note that this logger is not used for emitting metrics which are emitted to standard output using the `Console` object.
   */
  #logger;
  /**
   * Flag indicating if this is a single metric instance
   * @default false
   */
  isSingleMetric = false;
  /**
   * Additional metadata to be included with metrics
   * @default {}
   */
  metadata = {};
  /**
   * Namespace for the metrics
   */
  namespace;
  /**
   * Flag to determine if an error should be thrown when no metrics are recorded
   * @default false
   */
  shouldThrowOnEmptyMetrics = false;
  /**
   * Storage for metrics before they are published
   * @default {}
   */
  storedMetrics = {};
  /**
   * Whether to disable metrics
   */
  disabled = false;
  /**
   * Custom timestamp for the metrics
   */
  #timestamp;
  constructor(options = {}) {
    super();
    this.dimensions = {};
    this.setOptions(options);
    this.#logger = options.logger || this.console;
  }
  /**
   * Add a dimension to metrics.
   *
   * A dimension is a key-value pair that is used to group metrics, and it is included in all metrics emitted after it is added.
   * Invalid dimension values are skipped and a warning is logged.
   *
   * When calling the {@link Metrics.publishStoredMetrics | `publishStoredMetrics()`} method, the dimensions are cleared. This type of
   * dimension is useful when you want to add request-specific dimensions to your metrics. If you want to add dimensions that are
   * included in all metrics, use the {@link Metrics.setDefaultDimensions | `setDefaultDimensions()`} method.
   *
   * @param name - The name of the dimension
   * @param value - The value of the dimension
   */
  addDimension(name, value) {
    if (!value) {
      this.#logger.warn(`The dimension ${name} doesn't meet the requirements and won't be added. Ensure the dimension name and value are non empty strings`);
      return;
    }
    if (MAX_DIMENSION_COUNT <= this.getCurrentDimensionsCount()) {
      throw new RangeError(`The number of metric dimensions must be lower than ${MAX_DIMENSION_COUNT}`);
    }
    if (Object.hasOwn(this.dimensions, name) || Object.hasOwn(this.defaultDimensions, name)) {
      this.#logger.warn(`Dimension "${name}" has already been added. The previous value will be overwritten.`);
    }
    this.dimensions[name] = value;
  }
  /**
   * Add multiple dimensions to the metrics.
   *
   * This method is useful when you want to add multiple dimensions to the metrics at once.
   * Invalid dimension values are skipped and a warning is logged.
   *
   * When calling the {@link Metrics.publishStoredMetrics | `publishStoredMetrics()`} method, the dimensions are cleared. This type of
   * dimension is useful when you want to add request-specific dimensions to your metrics. If you want to add dimensions that are
   * included in all metrics, use the {@link Metrics.setDefaultDimensions | `setDefaultDimensions()`} method.
   *
   * @param dimensions - An object with key-value pairs of dimensions
   */
  addDimensions(dimensions) {
    for (const [name, value] of Object.entries(dimensions)) {
      this.addDimension(name, value);
    }
  }
  /**
   * A metadata key-value pair to be included with metrics.
   *
   * You can use this method to add high-cardinality data as part of your metrics.
   * This is useful when you want to search highly contextual information along with your metrics in your logs.
   *
   * Note that the metadata is not included in the Amazon CloudWatch UI, but it can be used to search and filter logs.
   *
   * @example
   * ```typescript
   * import { Metrics } from '@aws-lambda-powertools/metrics';
   *
   * const metrics = new Metrics({
   *   namespace: 'serverlessAirline',
   *   serviceName: 'orders'
   * });
   *
   * export const handler = async (event) => {
   *   metrics.addMetadata('request_id', event.requestId);
   *   metrics.addMetric('successfulBooking', MetricUnit.Count, 1);
   *   metrics.publishStoredMetrics();
   * };
   * ```
   *
   * @param key - The key of the metadata
   * @param value - The value of the metadata
   */
  addMetadata(key, value) {
    this.metadata[key] = value;
  }
  /**
   * Add a metric to the metrics buffer.
   *
   * By default, metrics are buffered and flushed when calling {@link Metrics.publishStoredMetrics | `publishStoredMetrics()`} method,
   * or at the end of the handler function when using the {@link Metrics.logMetrics | `logMetrics()`} decorator or the Middy.js middleware.
   *
   * Metrics are emitted to standard output in the Amazon CloudWatch EMF (Embedded Metric Format) schema.
   *
   * You can add a metric by specifying the metric name, unit, and value. For convenience,
   * we provide a set of constants for the most common units in the {@link MetricUnits | MetricUnit} dictionary object.
   *
   * Optionally, you can specify a {@link https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/cloudwatch_concepts.html#Resolution_definition | resolution}, which can be either `High` or `Standard`, using the {@link MetricResolutions | MetricResolution} dictionary object.
   * By default, metrics are published with a resolution of `Standard`.
   *
   * @example
   * ```typescript
   * import { Metrics, MetricUnit } from '@aws-lambda-powertools/metrics';
   *
   * const metrics = new Metrics({
   *   namespace: 'serverlessAirline',
   *   serviceName: 'orders'
   * });
   *
   * export const handler = async () => {
   *   metrics.addMetric('successfulBooking', MetricUnit.Count, 1);
   *   metrics.publishStoredMetrics();
   * };
   * ```
   *
   * @param name - The metric name
   * @param unit - The metric unit, see {@link MetricUnits | MetricUnit}
   * @param value - The metric value
   * @param resolution - The metric resolution, see {@link MetricResolutions | MetricResolution}
   */
  addMetric(name, unit, value, resolution = MetricResolution.Standard) {
    this.storeMetric(name, unit, value, resolution);
    if (this.isSingleMetric)
      this.publishStoredMetrics();
  }
  /**
   * Immediately emit a `ColdStart` metric if this is a cold start invocation.
   *
   * A cold start is when AWS Lambda initializes a new instance of your function. To take advantage of this feature,
   * you must instantiate the Metrics class outside of the handler function.
   *
   * By using this method, the metric will be emitted immediately without you having to call {@link Metrics.publishStoredMetrics | `publishStoredMetrics()`}.
   *
   * If you are using the {@link Metrics.logMetrics | `logMetrics()`} decorator, or the Middy.js middleware, you can enable this
   * feature by setting the `captureColdStartMetric` option to `true`.
   *
   * @example
   * ```typescript
   * import { Metrics } from '@aws-lambda-powertools/metrics';
   *
   * const metrics = new Metrics({
   *   namespace: 'serverlessAirline',
   *   serviceName: 'orders'
   * });
   *
   * export const handler = async () => {
   *   metrics.captureColdStartMetric();
   * };
   * ```
   */
  captureColdStartMetric() {
    if (!this.isColdStart())
      return;
    const singleMetric = this.singleMetric();
    if (this.defaultDimensions.service) {
      singleMetric.setDefaultDimensions({
        service: this.defaultDimensions.service
      });
    }
    if (this.functionName != null) {
      singleMetric.addDimension("function_name", this.functionName);
    }
    singleMetric.addMetric(COLD_START_METRIC, MetricUnit.Count, 1);
  }
  /**
   * Clear all previously set default dimensions.
   *
   * This will remove all default dimensions set by the {@link Metrics.setDefaultDimensions | `setDefaultDimensions()`} method
   * or via the `defaultDimensions` parameter in the constructor.
   *
   * @example
   * ```typescript
   * import { Metrics } from '@aws-lambda-powertools/metrics';
   *
   * const metrics = new Metrics({
   *   namespace: 'serverlessAirline',
   *   serviceName: 'orders',
   *   defaultDimensions: { environment: 'dev' },
   * });
   *
   * metrics.setDefaultDimensions({ region: 'us-west-2' });
   *
   * // both environment and region dimensions are removed
   * metrics.clearDefaultDimensions();
   * ```
   */
  clearDefaultDimensions() {
    this.defaultDimensions = {};
  }
  /**
   * Clear all the dimensions added to the Metrics instance via {@link Metrics.addDimension | `addDimension()`} or {@link Metrics.addDimensions | `addDimensions()`}.
   *
   * These dimensions are normally cleared when calling {@link Metrics.publishStoredMetrics | `publishStoredMetrics()`}, but
   * you can use this method to clear specific dimensions that you no longer need at runtime.
   *
   * This method does not clear the default dimensions set via {@link Metrics.setDefaultDimensions | `setDefaultDimensions()`} or via
   * the `defaultDimensions` parameter in the constructor.
   *
   * @example
   * ```typescript
   * import { Metrics } from '@aws-lambda-powertools/metrics';
   *
   * const metrics = new Metrics({
   *   namespace: 'serverlessAirline',
   *   serviceName: 'orders'
   * });
   *
   * export const handler = async () => {
   *   metrics.addDimension('region', 'us-west-2');
   *
   *   // ...
   *
   *   metrics.clearDimensions(); // olnly the region dimension is removed
   * };
   * ```
   *
   * The method is primarily intended for internal use, but it is exposed for advanced use cases.
   */
  clearDimensions() {
    this.dimensions = {};
  }
  /**
   * Clear all the metadata added to the Metrics instance.
   *
   * Metadata is normally cleared when calling {@link Metrics.publishStoredMetrics | `publishStoredMetrics()`}, but
   * you can use this method to clear specific metadata that you no longer need at runtime.
   *
   * The method is primarily intended for internal use, but it is exposed for advanced use cases.
   */
  clearMetadata() {
    this.metadata = {};
  }
  /**
   * Clear all the metrics stored in the buffer.
   *
   * This is useful when you want to clear the metrics stored in the buffer without publishing them.
   *
   * The method is primarily intended for internal use, but it is exposed for advanced use cases.
   */
  clearMetrics() {
    this.storedMetrics = {};
  }
  /**
   * Check if there are stored metrics in the buffer.
   */
  hasStoredMetrics() {
    return Object.keys(this.storedMetrics).length > 0;
  }
  /**
   * Whether metrics are disabled.
   */
  isDisabled() {
    return this.disabled;
  }
  /**
   * A class method decorator to automatically log metrics after the method returns or throws an error.
   *
   * The decorator can be used with TypeScript classes and can be configured to optionally capture a `ColdStart` metric (see {@link Metrics.captureColdStartMetric | `captureColdStartMetric()`}),
   * throw an error if no metrics are emitted (see {@link Metrics.setThrowOnEmptyMetrics | `setThrowOnEmptyMetrics()`}),
   * and set default dimensions for all metrics (see {@link Metrics.setDefaultDimensions | `setDefaultDimensions()`}).
   *
   * @example
   *
   * ```typescript
   * import type { Context } from 'aws-lambda';
   * import type { LambdaInterface } from '@aws-lambda-powertools/commons/types';
   * import { Metrics, MetricUnit } from '@aws-lambda-powertools/metrics';
   *
   * const metrics = new Metrics({
   *   namespace: 'serverlessAirline',
   *   serviceName: 'orders'
   * });
   *
   * class Lambda implements LambdaInterface {
   *   ⁣@metrics.logMetrics({ captureColdStartMetric: true })
   *   public async handler(_event: { requestId: string }, _: Context) {
   *     metrics.addMetadata('request_id', event.requestId);
   *     metrics.addMetric('successfulBooking', MetricUnit.Count, 1);
   *   }
   * }
   *
   * const handlerClass = new Lambda();
   * export const handler = handlerClass.handler.bind(handlerClass);
   * ```
   *
   * You can configure the decorator with the following options:
   * - `captureColdStartMetric` - Whether to capture a `ColdStart` metric
   * - `defaultDimensions` - Default dimensions to add to all metrics
   * - `throwOnEmptyMetrics` - Whether to throw an error if no metrics are emitted
   *
   * @param options - Options to configure the behavior of the decorator, see {@link ExtraOptions}
   */
  logMetrics(options = {}) {
    const { throwOnEmptyMetrics, defaultDimensions, captureColdStartMetric } = options;
    if (throwOnEmptyMetrics) {
      this.setThrowOnEmptyMetrics(throwOnEmptyMetrics);
    }
    if (defaultDimensions !== void 0) {
      this.setDefaultDimensions(defaultDimensions);
    }
    return (_target, _propertyKey, descriptor) => {
      const originalMethod = descriptor.value;
      const metricsRef = this;
      descriptor.value = async function(event, context, callback) {
        metricsRef.functionName = context.functionName;
        if (captureColdStartMetric)
          metricsRef.captureColdStartMetric();
        let result;
        try {
          result = await originalMethod.apply(this, [event, context, callback]);
        } finally {
          metricsRef.publishStoredMetrics();
        }
        return result;
      };
      return descriptor;
    };
  }
  /**
   * Flush the stored metrics to standard output.
   *
   * The method empties the metrics buffer and emits the metrics to standard output in the Amazon CloudWatch EMF (Embedded Metric Format) schema.
   *
   * When using the {@link Metrics.logMetrics | `logMetrics()`} decorator, or the Middy.js middleware, the metrics are automatically flushed after the handler function returns or throws an error.
   *
   * @example
   * ```typescript
   * import { Metrics, MetricUnit } from '@aws-lambda-powertools/metrics';
   *
   * const metrics = new Metrics({
   *   namespace: 'serverlessAirline',
   *   serviceName: 'orders'
   * });
   *
   * export const handler = async () => {
   *   metrics.addMetric('successfulBooking', MetricUnit.Count, 1);
   *   metrics.publishStoredMetrics();
   * };
   * ```
   */
  publishStoredMetrics() {
    const hasMetrics = this.hasStoredMetrics();
    if (!this.shouldThrowOnEmptyMetrics && !hasMetrics) {
      this.#logger.warn("No application metrics to publish. The cold-start metric may be published if enabled. If application metrics should never be empty, consider using `throwOnEmptyMetrics`");
    }
    if (!this.disabled) {
      const emfOutput = this.serializeMetrics();
      hasMetrics && this.console.log(JSON.stringify(emfOutput));
    }
    this.clearMetrics();
    this.clearDimensions();
    this.clearMetadata();
  }
  /**
   * Sets the timestamp for the metric.
   *
   * If an integer is provided, it is assumed to be the epoch time in milliseconds.
   * If a Date object is provided, it will be converted to epoch time in milliseconds.
   *
   * The timestamp must be a Date object or an integer representing an epoch time.
   * This should not exceed 14 days in the past or be more than 2 hours in the future.
   * Any metrics failing to meet this criteria will be skipped by Amazon CloudWatch.
   *
   * See: https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Embedded_Metric_Format_Specification.html
   * See: https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CloudWatch-Logs-Monitoring-CloudWatch-Metrics.html
   *
   * @example
   * ```typescript
   * import { MetricUnit, Metrics } from '@aws-lambda-powertools/metrics';
   *
   * const metrics = new Metrics({
   *   namespace: 'serverlessAirline',
   *   serviceName: 'orders',
   * });
   *
   * export const handler = async () => {
   *   const metricTimestamp = new Date(Date.now() - 24 * 60 * 60 * 1000); // 24 hours ago
   *   metrics.setTimestamp(metricTimestamp);
   *   metrics.addMetric('successfulBooking', MetricUnit.Count, 1);
   * };
   * ```
   * @param timestamp - The timestamp to set, which can be a number or a Date object.
   */
  setTimestamp(timestamp) {
    if (!this.#validateEmfTimestamp(timestamp)) {
      this.#logger.warn("This metric doesn't meet the requirements and will be skipped by Amazon CloudWatch. Ensure the timestamp is within 14 days in the past or up to 2 hours in the future and is also a valid number or Date object.");
    }
    this.#timestamp = this.#convertTimestampToEmfFormat(timestamp);
  }
  /**
   * Serialize the stored metrics into a JSON object compliant with the Amazon CloudWatch EMF (Embedded Metric Format) schema.
   *
   * The EMF schema is a JSON object that contains the following properties:
   * - `_aws`: An object containing the timestamp and the CloudWatch metrics.
   * - `CloudWatchMetrics`: An array of CloudWatch metrics objects.
   * - `Namespace`: The namespace of the metrics.
   * - `Dimensions`: An array of dimensions for the metrics.
   * - `Metrics`: An array of metric definitions.
   *
   * The object is then emitted to standard output, which in AWS Lambda is picked up by CloudWatch logs and processed asynchronously.
   */
  serializeMetrics() {
    const metricDefinitions = Object.values(this.storedMetrics).map((metricDefinition) => ({
      Name: metricDefinition.name,
      Unit: metricDefinition.unit,
      ...metricDefinition.resolution === MetricResolution.High ? { StorageResolution: metricDefinition.resolution } : {}
    }));
    if (metricDefinitions.length === 0 && this.shouldThrowOnEmptyMetrics) {
      throw new RangeError("The number of metrics recorded must be higher than zero");
    }
    if (!this.namespace)
      this.#logger.warn("Namespace should be defined, default used");
    const metricValues = Object.values(this.storedMetrics).reduce((result, { name, value }) => {
      result[name] = value;
      return result;
    }, {});
    const dimensionNames = [
      .../* @__PURE__ */ new Set([
        ...Object.keys(this.defaultDimensions),
        ...Object.keys(this.dimensions)
      ])
    ];
    return {
      _aws: {
        Timestamp: this.#timestamp ?? (/* @__PURE__ */ new Date()).getTime(),
        CloudWatchMetrics: [
          {
            Namespace: this.namespace || DEFAULT_NAMESPACE,
            Dimensions: [dimensionNames],
            Metrics: metricDefinitions
          }
        ]
      },
      ...this.defaultDimensions,
      ...this.dimensions,
      ...metricValues,
      ...this.metadata
    };
  }
  /**
   * Set default dimensions that will be added to all metrics.
   *
   * This method will merge the provided dimensions with the existing default dimensions.
   *
   * @example
   * ```typescript
   * import { Metrics } from '@aws-lambda-powertools/metrics';
   *
   * const metrics = new Metrics({
   *   namespace: 'serverlessAirline',
   *   serviceName: 'orders',
   *   defaultDimensions: { environment: 'dev' },
   * });
   *
   * // Default dimensions will contain both region and environment
   * metrics.setDefaultDimensions({
   *   region: 'us-west-2',
   *   environment: 'prod',
   * });
   * ```
   *
   * @param dimensions - The dimensions to be added to the default dimensions object
   */
  setDefaultDimensions(dimensions) {
    const targetDimensions = {
      ...this.defaultDimensions,
      ...dimensions
    };
    if (MAX_DIMENSION_COUNT <= Object.keys(targetDimensions).length) {
      throw new Error("Max dimension count hit");
    }
    this.defaultDimensions = targetDimensions;
  }
  /**
   * Set the function name to be added to each metric as a dimension.
   *
   * When using the {@link Metrics.logMetrics | `logMetrics()`} decorator, or the Middy.js middleware, the function
   * name is automatically inferred from the Lambda context.
   *
   * @example
   * ```typescript
   * import { Metrics } from '@aws-lambda-powertools/metrics';
   *
   * const metrics = new Metrics({
   *   namespace: 'serverlessAirline',
   *   serviceName: 'orders'
   * });
   *
   * metrics.setFunctionName('my-function-name');
   * ```
   *
   * @param name - The function name
   */
  setFunctionName(name) {
    this.functionName = name;
  }
  /**
   * Set the flag to throw an error if no metrics are emitted.
   *
   * You can use this method to enable or disable this opt-in feature. This is useful if you want to ensure
   * that at least one metric is emitted when flushing the metrics. This can be useful to catch bugs where
   * metrics are not being emitted as expected.
   *
   * @param enabled - Whether to throw an error if no metrics are emitted
   */
  setThrowOnEmptyMetrics(enabled) {
    this.shouldThrowOnEmptyMetrics = enabled;
  }
  /**
   * Create a new Metrics instance configured to immediately flush a single metric.
   *
   * CloudWatch EMF uses the same dimensions and timestamp across all your metrics, this is useful when you have a metric that should have different dimensions
   * or when you want to emit a single metric without buffering it.
   *
   * This method is used internally by the {@link Metrics.captureColdStartMetric | `captureColdStartMetric()`} method to emit the `ColdStart` metric immediately
   * after the handler function is called.
   *
   * @example
   * ```typescript
   * import { Metrics } from '@aws-lambda-powertools/metrics';
   *
   * const metrics = new Metrics({
   *   namespace: 'serverlessAirline',
   *   serviceName: 'orders'
   * });
   *
   * export const handler = async () => {
   *   const singleMetric = metrics.singleMetric();
   *   // The single metric will be emitted immediately
   *   singleMetric.addMetric('ColdStart', MetricUnit.Count, 1);
   *
   *   // These other metrics will be buffered and emitted when calling `publishStoredMetrics()`
   *   metrics.addMetric('successfulBooking', MetricUnit.Count, 1);
   *   metrics.publishStoredMetrics();
   * };
   */
  singleMetric() {
    return new _Metrics({
      namespace: this.namespace,
      serviceName: this.dimensions.service,
      defaultDimensions: this.defaultDimensions,
      singleMetric: true,
      logger: this.#logger
    });
  }
  /**
   * @deprecated Use {@link Metrics.setThrowOnEmptyMetrics | `setThrowOnEmptyMetrics()`} instead.
   */
  /* v8 ignore start */
  throwOnEmptyMetrics() {
    this.shouldThrowOnEmptyMetrics = true;
  }
  /* v8 ignore stop */
  /**
   * Gets the current number of dimensions count.
   */
  getCurrentDimensionsCount() {
    return Object.keys(this.dimensions).length + Object.keys(this.defaultDimensions).length;
  }
  /**
   * Get the custom config service if it exists.
   */
  getCustomConfigService() {
    return this.customConfigService;
  }
  /**
   * Get the environment variables service.
   */
  getEnvVarsService() {
    return this.envVarsService;
  }
  /**
   * Check if a metric is new or not.
   *
   * A metric is considered new if there is no metric with the same name already stored.
   *
   * When a metric is not new, we also check if the unit is consistent with the stored metric with
   * the same name. If the units are inconsistent, we throw an error as this is likely a bug or typo.
   * This can happen if a metric is added without using the `MetricUnit` helper in JavaScript codebases.
   *
   * @param name - The name of the metric
   * @param unit - The unit of the metric
   */
  isNewMetric(name, unit) {
    if (this.storedMetrics[name]) {
      if (this.storedMetrics[name].unit !== unit) {
        const currentUnit = this.storedMetrics[name].unit;
        throw new Error(`Metric "${name}" has already been added with unit "${currentUnit}", but we received unit "${unit}". Did you mean to use metric unit "${currentUnit}"?`);
      }
      return false;
    }
    return true;
  }
  /**
   * Initialize the console property as an instance of the internal version of `Console()` class (PR #748)
   * or as the global node console if the `POWERTOOLS_DEV' env variable is set and has truthy value.
   *
   * @private
   */
  setConsole() {
    if (!this.getEnvVarsService().isDevMode()) {
      this.console = new import_node_console2.Console({
        stdout: process.stdout,
        stderr: process.stderr
      });
    } else {
      this.console = console;
    }
  }
  /**
   * Set the custom config service to be used.
   *
   * @param customConfigService The custom config service to be used
   */
  setCustomConfigService(customConfigService) {
    this.customConfigService = customConfigService ? customConfigService : void 0;
  }
  /**
   * Set the environment variables service to be used.
   */
  setEnvVarsService() {
    this.envVarsService = new EnvironmentVariablesService3();
  }
  /**
   * Set the namespace to be used.
   *
   * @param namespace - The namespace to be used
   */
  setNamespace(namespace) {
    this.namespace = namespace || this.getCustomConfigService()?.getNamespace() || this.getEnvVarsService().getNamespace();
  }
  /**
   * Set the disbaled flag based on the environment variables `POWERTOOLS_METRICS_DISABLED` and `POWERTOOLS_DEV`.
   *
   * The `POWERTOOLS_METRICS_DISABLED` environment variable takes precedence over `POWERTOOLS_DEV`.
   */
  setDisabled() {
    this.disabled = this.getEnvVarsService().getMetricsDisabled();
  }
  /**
   * Set the options to be used by the Metrics instance.
   *
   * This method is used during the initialization of the Metrics instance.
   *
   * @param options - The options to be used
   */
  setOptions(options) {
    const { customConfigService, namespace, serviceName, singleMetric, defaultDimensions } = options;
    this.setEnvVarsService();
    this.setConsole();
    this.setCustomConfigService(customConfigService);
    this.setDisabled();
    this.setNamespace(namespace);
    this.setService(serviceName);
    this.setDefaultDimensions(defaultDimensions);
    this.isSingleMetric = singleMetric || false;
    return this;
  }
  /**
   * Set the service to be used.
   *
   * @param service - The service to be used
   */
  setService(service) {
    const targetService = service || this.getCustomConfigService()?.getServiceName() || this.getEnvVarsService().getServiceName() || this.getDefaultServiceName();
    if (targetService.length > 0) {
      this.setDefaultDimensions({ service: targetService });
    }
  }
  /**
   * Store a metric in the buffer.
   *
   * If the buffer is full, or the metric reaches the maximum number of values,
   * the metrics are flushed to stdout.
   *
   * @param name - The name of the metric to store
   * @param unit - The unit of the metric to store
   * @param value - The value of the metric to store
   * @param resolution - The resolution of the metric to store
   */
  storeMetric(name, unit, value, resolution) {
    if (Object.keys(this.storedMetrics).length >= MAX_METRICS_SIZE) {
      this.publishStoredMetrics();
    }
    if (this.isNewMetric(name, unit)) {
      this.storedMetrics[name] = {
        unit,
        value,
        name,
        resolution
      };
    } else {
      const storedMetric = this.storedMetrics[name];
      if (!Array.isArray(storedMetric.value)) {
        storedMetric.value = [storedMetric.value];
      }
      storedMetric.value.push(value);
      if (storedMetric.value.length === MAX_METRIC_VALUES_SIZE) {
        this.publishStoredMetrics();
      }
    }
  }
  /**
   * Validates a given timestamp based on CloudWatch Timestamp guidelines.
   *
   * Timestamp must meet CloudWatch requirements.
   * The time stamp can be up to two weeks in the past and up to two hours into the future.
   * See [Timestamps](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/cloudwatch_concepts.html#about_timestamp)
   * for valid values.
   *
   * @param timestamp - Date object or epoch time in milliseconds representing the timestamp to validate.
   */
  #validateEmfTimestamp(timestamp) {
    const isDate = timestamp instanceof Date;
    if (!isDate && !isIntegerNumber(timestamp)) {
      return false;
    }
    const timestampMs = isDate ? timestamp.getTime() : timestamp;
    const currentTime = (/* @__PURE__ */ new Date()).getTime();
    const minValidTimestamp = currentTime - EMF_MAX_TIMESTAMP_PAST_AGE;
    const maxValidTimestamp = currentTime + EMF_MAX_TIMESTAMP_FUTURE_AGE;
    return timestampMs >= minValidTimestamp && timestampMs <= maxValidTimestamp;
  }
  /**
   * Converts a given timestamp to EMF compatible format.
   *
   * @param timestamp - The timestamp to convert, which can be either a number (in milliseconds) or a Date object.
   * @returns The timestamp in milliseconds. If the input is invalid, returns 0.
   */
  #convertTimestampToEmfFormat(timestamp) {
    if (isIntegerNumber(timestamp)) {
      return timestamp;
    }
    if (timestamp instanceof Date) {
      return timestamp.getTime();
    }
    return 0;
  }
};

// asset-input/lambda/getProductsList/index.ts
var import_client_dynamodb = require("@aws-sdk/client-dynamodb");
var import_lib_dynamodb = require("@aws-sdk/lib-dynamodb");
var logger = new Logger({
  serviceName: "productService",
  logLevel: "INFO"
});
var metrics = new Metrics({
  namespace: "ProductsApp",
  serviceName: "productService",
  defaultDimensions: {
    environment: process.env.ENVIRONMENT || "development"
  }
});
var client = new import_client_dynamodb.DynamoDBClient({
  region: process.env.REGION
});
var docClient = import_lib_dynamodb.DynamoDBDocumentClient.from(client);
var createResponse = (statusCode, body) => ({
  statusCode,
  headers: {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Credentials": true
  },
  body: JSON.stringify(body)
});
var handler = async (event) => {
  logger.addContext(event);
  try {
    logger.info("Getting products list", {
      operation: "getProductsList"
    });
    metrics.addMetric("getProductsListInvocations", MetricUnit.Count, 1);
    const productsParams = {
      TableName: process.env.PRODUCTS_TABLE
    };
    const productsCommand = new import_lib_dynamodb.ScanCommand(productsParams);
    const productsResponse = await docClient.send(productsCommand);
    if (!productsResponse.Items || productsResponse.Items.length === 0) {
      logger.info("No products found");
      metrics.addMetric("emptyProductsList", MetricUnit.Count, 1);
      return createResponse(200, []);
    }
    const stocksParams = {
      TableName: process.env.STOCKS_TABLE
    };
    const stocksCommand = new import_lib_dynamodb.ScanCommand(stocksParams);
    const stocksResponse = await docClient.send(stocksCommand);
    const stocks = stocksResponse.Items;
    const products = productsResponse.Items;
    const productsWithStock = products.map((product) => {
      const stockItem = stocks.find((stock) => stock.product_id === product.id);
      return {
        ...product,
        count: stockItem ? stockItem.count : 0
      };
    });
    logger.info("Successfully retrieved products", {
      productCount: productsWithStock.length
    });
    metrics.addMetric("productsReturned", MetricUnit.Count, productsWithStock.length);
    return createResponse(200, productsWithStock);
  } catch (error) {
    logger.error("Error getting products list", {
      error: error.message,
      errorName: error.name,
      stackTrace: error.stack
    });
    metrics.addMetric("productsListErrors", MetricUnit.Count, 1);
    return createResponse(500, {
      message: "Internal server error while fetching products",
      error: process.env.IS_OFFLINE ? error.message : "Internal server error"
    });
  } finally {
    metrics.publishStoredMetrics();
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  handler
});
