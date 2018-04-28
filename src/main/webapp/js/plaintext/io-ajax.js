goog.provide('plaintext.net.io.Ajax');

goog.require('goog.object');

/**
 * @param {string=} contextPath
 * @constructor
 */
plaintext.net.io.Ajax = function(contextPath) {
  /**
   * @private
   * @type {!wap.core.net.PromiseAjax}
   */
  this.promiseAjax_ = new wap.core.net.PromiseAjax(this, undefined, contextPath);
};

/**
 * Root url of Application Ajax
 * 
 * @const
 */
plaintext.net.io.Ajax.ROOT = '/plaintext';

/**
 * @const
 */
plaintext.net.io.Ajax.TYPE_ERROR = 'Illegle AJAX request type!';

/**
 * @enum {string}
 */
plaintext.net.io.Ajax.TYPE = {
  LOAD_COMPONENT: '/load/component'
};

/**
 * @param {*} error
 */
plaintext.net.io.Ajax.commonAjaxErrorHandler = function(error) {

};

/**
 * Get the url
 * 
 * @param {plaintext.net.io.Ajax.TYPE} type
 * @return {string}
 */
plaintext.net.io.Ajax.prototype.getUrl = function(type) {
  if (!goog.object.contains(plaintext.net.io.Ajax.TYPE, type)) {
    throw Error(plaintext.net.io.Ajax.TYPE_ERROR);
  }
  return plaintext.net.io.Ajax.ROOT + type;
};

/**
 * @param {string} url
 * @param {Object=} opt_queryParam
 * @param {Object} data
 * @param {Function} resultHandler
 * @param {Function=} opt_errorHandler
 * @param {Object=} opt_obj
 */
plaintext.net.io.Ajax.prototype.sendPost = function(url, opt_queryParam, data, resultHandler, opt_errorHandler, opt_obj) {
  var self = opt_obj || window;
  var queryParam = goog.isDefAndNotNull(opt_queryParam) ? opt_queryParam : null;
  this.promiseAjax_.post(url, queryParam, data).getResult().then(function(response) {
    var result = response.getResponseJson() || response.getResponseText();
    if (goog.isFunction(resultHandler)) {
      resultHandler.call(self, result);
    }
  }, null, self).thenCatch(function(error) {
    if (goog.isFunction(opt_errorHandler)) {
      opt_errorHandler.call(self, error);
    } else {
      plaintext.net.io.Ajax.commonAjaxErrorHandler(error);
    }
  }, self);
};

/**
 * @param {string} url
 * @param {Object=} opt_queryParam
 * @param {Function} resultHandler
 * @param {Function=} opt_errorHandler
 * @param {Object=} opt_obj
 */
plaintext.net.io.Ajax.prototype.sendGet = function(url, opt_queryParam, resultHandler, opt_errorHandler, opt_obj) {
  var self = opt_obj || window;
  opt_queryParam = opt_queryParam || {};

  this.promiseAjax_.get(url, opt_queryParam).getResult().then(function(response) {
    var result = response.getResponseJson() || response.getResponseText();
    if (goog.isFunction(resultHandler)) {
      resultHandler.call(self, result);
    }
  }, function(error) {
    plaintext.net.io.Ajax.logger.error(error);
    if (goog.isFunction(opt_errorHandler)) {
      opt_errorHandler.call(self, error);
    } else {
      plaintext.net.io.Ajax.commonAjaxErrorHandler(error);
    }
  }, self);
};
