goog.provide('plaintext.util.UidMap');
goog.require('goog.array');

/**
 * @constructor
 * @template K, V
 */
plaintext.util.UidMap = function() {
  this.keys_ = {};
  this.values_ = {};
};

/**
 * @param {!K} key
 * @return {!V}
 */
plaintext.util.UidMap.prototype.get = function(key) {
  return this.values_[goog.getUid(key)];
};

/**
 * @param {!K} key
 * @param {!V} value
 */
plaintext.util.UidMap.prototype.set = function(key, value) {
  var uid = goog.getUid(key);
  this.keys_[uid] = key;
  this.values_[uid] = value;
};

/**
 * @param {!K} key
 * @return boolean true if removed; false if no such key found.
 */
plaintext.util.UidMap.prototype.remove = function(key) {
  var ret = this.containsKey(key);
  var uid = goog.getUid(key);
  delete this.keys_[uid];
  delete this.values_[uid];
  return ret;
};

/**
 * @return {!Array.<!K>}
 */
plaintext.util.UidMap.prototype.getKeys = function() {
  return goog.array.map(Object.getOwnPropertyNames(this.keys_), function(uid) {
    return this.keys_[uid];
  }, this);
};

/**
 * @return {!Array.<!V>}
 */
plaintext.util.UidMap.prototype.getValues = function() {
  return goog.array.map(Object.getOwnPropertyNames(this.values_), function(uid) {
    return this.values_[uid];
  }, this);
};

/**
 * @param {?K} key
 * @return {boolean}
 */
plaintext.util.UidMap.prototype.containsKey = function(key) {
  if (!key) {
    return false;
  }
  return this.keys_.hasOwnProperty(goog.getUid(key));
};

/**
 * @param {?V} value
 * @return {boolean}
 */
plaintext.util.UidMap.prototype.containsValue = function(value) {
  if (!value) {
    return false;
  }
  return this.values_.hasOwnProperty(goog.getUid(value));
};

/**
 * @param {function(this:T, !V, !K): ?} f
 * @param {T=} opt_scope
 * @template T
 */
plaintext.util.UidMap.prototype.forEach = function(f, opt_scope) {
  if (!!opt_scope) {
    f = goog.bind(f, opt_scope);
  }

  goog.array.forEach(Object.getOwnPropertyNames(this.keys_), function(uid) {
    f(this.values_[uid], this.keys_[uid]);
  }, this);
};
