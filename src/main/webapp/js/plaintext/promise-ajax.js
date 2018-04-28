goog.provide('plaintext.net.PromiseAjax');
goog.provide('plaintext.net.PromiseAjax.ApplicationParameter');
goog.provide('plaintext.net.PromiseAjax.Request');
goog.provide('plaintext.net.PromiseAjax.SendingTypes');

goog.require('goog.Disposable');
goog.require('goog.Promise');
goog.require('goog.Uri');
goog.require('goog.array');
goog.require('goog.net.HttpStatus');
goog.require('goog.net.XhrManager');
goog.require('goog.object');
goog.require('goog.string');
goog.require('plaintext');
goog.require('plaintext.events.Event');
goog.require('plaintext.events.GlobalErrorHandler');
goog.require('plaintext.events.GlobalErrorHandler.EventType');
goog.require('plaintext.net.Response');
goog.require('plaintext.util.object');

/**
 * @constructor
 * @extends {goog.Disposable}
 * @param {Object=} opt_scope scope (this pointer inside callback function)
 * @param {Object=} opt_header Default headers to add to every
 * @param {string=} opt_contextPath
 * @param {goog.net.XhrManager=} opt_xhrManager Optional XhrManager. Use this parameter to mock HTTP response in unit
 *          test.
 */
plaintext.net.PromiseAjax = function(opt_scope, opt_header, opt_contextPath, opt_xhrManager) {
  goog.Disposable.call(this);

  /**
   * @private
   * @type {?Object}
   */
  this.scope_ = opt_scope || null;

  /**
   * @private
   * @type {Object.<string, *>}
   */
  this.headers_ = opt_header || {};

  /**
   * @private
   * @type {goog.net.XhrManager}
   */
  this.xhrManager_ = opt_xhrManager || new goog.net.XhrManager(1);

  /**
   * @private
   * @type {Object.<string, plaintext.net.PromiseAjax.Request>}
   */
  this.pendingMap_ = {};

  /**
   * @private
   * @type {string}
   */
  this.contextPath_ = opt_contextPath ? opt_contextPath : plaintext.common;
};
goog.inherits(plaintext.net.PromiseAjax, goog.Disposable);

/**
 * @enum {string}
 */
plaintext.net.PromiseAjax.SendingTypes = {
  JSON: 'application/json',
  FORM: 'application/x-www-form-urlencoded;charset=UTF-8'
};

/**
 * represent that this is a ajax request.
 * @private
 * @type {string}
 */
plaintext.net.PromiseAjax.ajaxRequestTypeValue_ = 'XMLHttpRequest';

/**
 * 
 * @type {string}
 * @private
 */
plaintext.net.PromiseAjax.ajaxRequestTypeHeader_ = 'X-Requested-With';

/**
 * @private
 * @type {number}
 */
plaintext.net.PromiseAjax.xhrId_ = 0;

/**
 * Send GET http request with query parameters.
 * @param {string} url should not be contained context path.
 * @param {Object=} opt_queryParam
 * @param {Object=} opt_headers Additional headers for this request.
 * @param {plaintext.net.PromiseAjax.ApplicationParameter=} opt_appParam Additional application query parameter
 *          information for this request.
 * @return {plaintext.net.PromiseAjax.Request}
 */
plaintext.net.PromiseAjax.prototype.get = function(url, opt_queryParam, opt_headers, opt_appParam) {
  return this.send('GET', url, opt_queryParam, null, null, opt_headers, opt_appParam);
};

/**
 * Send POST http request with json object.
 * @param {string} url should not be contained context path.
 * @param {Object=} opt_queryParam
 * @param {Object=} opt_jsonObject
 * @param {Object=} opt_headers Additional headers for this request.
 * @return {plaintext.net.PromiseAjax.Request}
 */
plaintext.net.PromiseAjax.prototype.post = function(url, opt_queryParam, opt_jsonObject, opt_headers) {
  return this.send('POST', url, opt_queryParam, null, opt_jsonObject, opt_headers);
};

/**
 * Send POST http request with form data.
 * @param {string} url should not be contained context path.
 * @param {Object=} opt_queryParam
 * @param {Object=} opt_formParam
 * @param {Object=} opt_headers Additional headers for this request.
 * @return {plaintext.net.PromiseAjax.Request}
 */
plaintext.net.PromiseAjax.prototype.postFormData = function(url, opt_queryParam, opt_formParam, opt_headers) {
  return this.send('POST', url, opt_queryParam, opt_formParam, null, opt_headers);
};

/**
 * Send http request.
 * @param {string} method
 * @param {string} url should not be contained context path.
 * @param {Object} queryParam
 * @param {Object} formParam
 * @param {Object} sendingObject
 * @param {Object=} opt_headers Additional headers for this request.
 * @param {plaintext.net.PromiseAjax.ApplicationParameter=} opt_appParam Additional application query parameter
 *          information for this request.
 * @return {plaintext.net.PromiseAjax.Request}
 */
plaintext.net.PromiseAjax.prototype.send = function(method, url, queryParam, formParam, sendingObject, opt_headers,
  opt_appParam) {
  if (plaintext.net.PromiseAjax.disabled_) {
    console.warn('PromiseAjax was disabled.');
    return null;
  }
  var uri;
  if (goog.string.startsWith(url, 'http://') || goog.string.startsWith(url, 'https://') ||
    !goog.string.startsWith(url, '/')) {
    uri = goog.Uri.parse(url);
  } else {
    uri = goog.Uri.parse(this.contextPath_ + url);
  }

  // query parameter
  goog.object.forEach(queryParam || {}, function(value, key) {
    if (goog.isDefAndNotNull(value) && (value !== '')) {
      if (goog.isArray(value)) {
        uri.setParameterValues(key, value);
      } else {
        uri.setParameterValue(key, value);
      }
    }
  });

  // append default headers and custom headers
  var header = plaintext.util.object.extend({}, this.headers_, opt_headers || {});
  header[plaintext.net.PromiseAjax.ajaxRequestTypeHeader_] = plaintext.net.PromiseAjax.ajaxRequestTypeValue_;
  var body = null;

  // request body and header
  if (method === 'POST' || method === 'PUT') {
    if (sendingObject) {
      body = JSON.stringify(sendingObject);
      header['Content-Type'] = plaintext.net.PromiseAjax.SendingTypes.JSON;
    } else {
      body = plaintext.net.objectToFormString_(formParam);
      header['Content-Type'] = plaintext.net.PromiseAjax.SendingTypes.FORM;
    }
  }

  var xhrId = '' + (++plaintext.net.PromiseAjax.xhrId_);
  // sending
  var request = new plaintext.net.PromiseAjax.Request(this, xhrId);
  // opt_maxRetries should be 0
  this.xhrManager_
    .send(xhrId, uri.toString(), method, body, header, 0, goog.bind(request.processResponse_, request), 0);

  this.pendingMap_[xhrId] = request;

  return request;
};

/**
 * @private
 * @param {Object|string} object
 * @return {string}
 */
plaintext.net.objectToFormString_ = function(object) {
  if (goog.isString(object)) {
    return object;
  }
  var sb = [];
  for (var i in object) {
    if (typeof(object[i]) !== 'function') {
      sb.push(encodeURIComponent(i) + '=' + encodeURIComponent(object[i]));
    }
  }
  return sb.join('&');
};

/**
 * abort all ajax requests.
 */
plaintext.net.PromiseAjax.prototype.abortAll = function() {
  // only pending ajax request will be aborted.
  // pendingMap_ will be cleared automatically.
  var ajaxRequests = goog.object.getValues(this.pendingMap_);
  goog.array.forEach(ajaxRequests, function(ajaxRequest) {
    ajaxRequest.abort();
  }, this);
};

/**
 * @override
 */
plaintext.net.PromiseAjax.prototype.disposeInternal = function() {
  this.abortAll();
  this.xhrManager_.dispose();
  this.xhrManager_ = null;
  this.scope_ = null;

  plaintext.net.PromiseAjax.superClass_.disposeInternal.call(this);
};

/**
 * @private
 * @type {boolean}
 */
plaintext.net.PromiseAjax.disabled_ = false;

/**
 * disable all ajax request.
 */
plaintext.net.PromiseAjax.disableAll = function() {
  plaintext.net.PromiseAjax.disabled_ = true;
};

/**
 * @constructor
 * @param {plaintext.net.PromiseAjax} ajax
 * @param {string} xhrId
 */
plaintext.net.PromiseAjax.Request = function(ajax, xhrId) {
  /**
   * @private
   * @type {plaintext.net.PromiseAjax}
   */
  this.ajax_ = ajax;

  /**
   * @private
   * @type {string}
   */
  this.xhrId_ = xhrId;

  /**
   * @private
   * @type {boolean}
   */
  this.isAborted_ = false;

  /**
   * @private
   * @type {boolean}
   */
  this.isPending_ = true;

  /**
   * @private
   * @type {boolean}
   */
  this.noError_ = false;

  /**
   * @private
   * @type {string|plaintext.net.Response}
   */
  this.response_ = null;

  /**
   * @private
   * @type {Array.<Function>}
   */
  this.callbacks_ = [];
};

/**
 * @private
 * @param {goog.events.Event} e
 */
plaintext.net.PromiseAjax.Request.prototype.processResponse_ = function(e) {
  this.isAborted_ = false;
  this.isPending_ = false;
  // remove from pending map
  delete this.ajax_.pendingMap_[this.xhrId_];

  var xhr = /** @type {goog.net.XhrIo} */
    (e.target);
  if (xhr.isSuccess()) {
    this.noError_ = true;
    this.response_ = new plaintext.net.Response(xhr.getResponseText(), xhr.getAllResponseHeaders(), xhr.getStatus(),
      xhr.getStatusText(), xhr.getLastUri());
  } else {
    this.noError_ = false;

    var errorHandler = plaintext.events.GlobalErrorHandler.getInstance();
    errorHandler.dispatchEvent(new plaintext.events.Event(plaintext.events.GlobalErrorHandler.EventType.AJAX_ERROR,
      errorHandler, {
        'xhr': xhr,
        'ajax': this.ajax_
      }, e));

    var message = null;
    switch (xhr.getStatus()) {
      case -1:
        message = 'The ajax request is aborted.'; // should never happen
        break;
      case 0:
        message = 'The ajax request is timeout.';
        break;
      case goog.net.HttpStatus.UNAUTHORIZED:
        message = 'unauthorized';
        if (window.navigator.userAgent.toLowerCase().indexOf('webview') >= 0) {
          message = xhr.getResponseText();
        } else {
          plaintext.net.PromiseAjax.disableAll();
        }
        break;
      default:
        message = xhr.getResponseText();
        break;
    }
    this.response_ = new plaintext.net.Response(message, xhr.getAllResponseHeaders(), xhr.getStatus(), xhr
      .getStatusText(), xhr.getLastUri());
  }

  // call the callback functions
  goog.array.forEach(this.callbacks_, function(callback) {
    callback['func'].call(callback['scope'], this.noError_, this.response_);
  }, this);

  // clear callback
  this.callbacks_.length = 0;
};

/**
 * Add callback function. When the ajax request is finished, the callback functions will be carried out.
 * @param {Function} func func will accept two parameter, the first one is a flag, which is to mark the ajax request is
 *          successful or not. the second one is response object or an error message.
 * @param {Object} opt_scope
 * @param {boolean} opt_callOnAbort
 */
plaintext.net.PromiseAjax.Request.prototype.addCallback = function(func, opt_scope, opt_callOnAbort) {
  func = goog.isFunction(func) ? func : goog.nullFunction;
  var scope = opt_scope || this.ajax_.scope_;
  if (this.isPending_) {
    this.callbacks_.push({
      'scope': scope,
      'func': func,
      'callOnAbort': !!opt_callOnAbort
    });
  } else {
    // ajax is finished. run directly.
    func.call(scope, this.noError_, this.response_);
  }
};

/**
 * Abort the ajax request.
 */
plaintext.net.PromiseAjax.Request.prototype.abort = function() {
  if (this.isAborted_ || !this.isPending_) {
    return;
  }

  this.isAborted_ = true;
  this.isPending_ = false;
  this.noError_ = false;
  this.response_ = 'The ajax request has been aborted.';

  // remove from pending map
  delete this.ajax_.pendingMap_[this.xhrId_];
  this.ajax_.xhrManager_.abort(this.xhrId_, true);

  // call the callback funtion with callOnAbort mark
  var callbacks = goog.array.filter(this.callbacks_, function(val) {
    return val['callOnAbort'];
  }, this);
  goog.array.forEach(callbacks, function(callback) {
    callback['func'].call(callback['scope'], this.noError_, this.response_);
  }, this);
  // clear all callbacks
  this.callbacks_.length = 0;
};

/**
 * Get a Promise style result.
 * @return {goog.Promise}
 */
plaintext.net.PromiseAjax.Request.prototype.getResult = function() {
  if (this.isAborted_) {
    return goog.Promise.reject('Ajax request has been aborted.');
  }

  return new goog.Promise(function(resolve, reject) {
    this.addCallback(function(noError, response) {
      if (noError) {
        resolve(response);
      } else {
        reject(response);
      }
    }, null, true);
  }, this);
};

/**
 * @private
 * @param {goog.net.XhrIo} xhr
 * @return {Object|string|undefined}
 * @deprecated Use the api of Response directly: response.getResponseJson('while(1)') .
 */
plaintext.net.PromiseAjax.Request.prototype.extractResponseValue_ = function(xhr) {
  throw 'Use the api of Response directly: response.getResponseJson(\'while(1)\') .';
};

/**
 * Parameter for PromiseAjax method to switch using application information
 * @constructor
 * @param {boolean} useSid send request with currentUrl sid
 * @param {boolean} useAppId send request with currentUrl appId
 */
plaintext.net.PromiseAjax.ApplicationParameter = function(useSid, useAppId) {
  this.useSid_ = useSid;
  this.useAppId_ = useAppId;
};

/**
 * @return {boolean}
 */
plaintext.net.PromiseAjax.ApplicationParameter.prototype.useSid = function() {
  return this.useSid_;
};
/**
 * @return {boolean}
 */
plaintext.net.PromiseAjax.ApplicationParameter.prototype.useAppId = function() {
  return this.useAppId_;
};
