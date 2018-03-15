goog.provide('plaintext.Page');

goog.require('goog.Disposable');
goog.require('goog.Uri');
goog.require('goog.dom');
goog.require('goog.dom.classlist');
goog.require('goog.events');
goog.require('goog.events.EventHandler');
goog.require('goog.events.EventType');
goog.require('goog.log');
goog.require('goog.net.XhrIo');
goog.require('goog.net.cookies');
goog.require('goog.userAgent');
goog.require('goog.userAgent.product');
goog.require('goog.userAgent.product.isVersion');

/**
 * This class is the base class for all pages, used to initialize all
 * components.
 * 
 * @constructor
 * @extends {goog.Disposable}
 */
plaintext.Page = function() {

  /**
   * @private {!goog.events.EventHandler}
   */
  this.handler_ = new goog.events.EventHandler(this);

  /**
   * Indicate whether to defer the initializeExternal method
   * 
   * @type {boolean}
   */
  this.deferInitializeExternal = false;

  /**
   * The default deferred milliseconds
   * 
   * @type {number}
   */
  this.deferredMilliseconds = 100;

  this.registerDisposable(this.handler_);
};
goog.inherits(plaintext.Page, goog.Disposable);

goog.scope(function() {
  var Page = plaintext.Page;
  /**
   * @return {!goog.events.EventHandler}
   * @protected
   * @final
   */
  Page.prototype.getHandler = function() {
    return this.handler_;
  };

  /**
   * This method will be called by Forneus, to initialize target page. Please do
   * <em>NOT</em> call it directly.
   */
  Page.prototype.initializeExternal = function() {
    if (this.deferInitializeExternal === true) {
      window.setTimeout(this.initializeExternal_.bind(this), this.deferredMilliseconds);
    } else {
      this.initializeExternal_();
    }
  };

  /**
   * Do actual initializeExternal
   * 
   * @private
   */
  Page.prototype.initializeExternal_ = function() {
    plaintext.View.getInstance().initialize();
    this.initialize();
    this.bindEvents();

    var logger = goog.log.getLogger(this.constructor.name || 'plaintext.Page');
    goog.log.info(logger, 'application is initialized.');
  };

  /**
   * Initialize the areas in this application.
   * 
   * @protected
   */
  Page.prototype.initialize = function() {
  };

  /**
   * Initialize the deferred components.
   * 
   * @protected
   */
  Page.prototype.deferInitialize = function() {
  };

  /**
   * Listen all events to let each area communicate.
   * 
   * @protected
   */
  Page.prototype.bindEvents = function() {
  };
});