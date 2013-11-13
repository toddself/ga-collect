'use strict';

var querystring = require('querystring');
var url = require('url');

var xtend = require('xtend');
var request = require('request');

var lookups = require('./lookups');

var serverConfig = {
  protocol : 'http:',
  host: 'www.google-analytics.com',
  pathname: 'collect'
};

var clientConfig = {
  v: 1, //analytics.js server version
  _v: 1, //analytics.js client version
};

/**
 * Constructor function for the objects
 * @method GoogleAnalytics
 * @constructor
 * @param  {Object} config Object containing at least `urchin`. Can be used to
 *                         override the `serverConfig` if wanted
 */
function GoogleAnalytics(config){
  this.config = config || {};
  if(!this.config.urchin){
    throw new Error('You must supply an urchin ID to track');
  }
  if(this.config.serverConfig){
    serverConfig = xtend(serverConfig, this.config.serverConfig);
  }
}

/**
 * Builds a query string with all the necessary variables based on the lookups
 * and returns a string
 * @namespace GoogleAnalytics
 * @private
 * @method  _buildQS
 * @param   {[type]} event [description]
 * @returns {[type]} [description]
 */
GoogleAnalytics.prototype._buildQS = function(event){
  var qsObj = {};
  event = xtend(event, clientConfig, this.config);

  Object.keys(event).forEach(function(key){
    var param = lookups.all[key];
    qsObj[param] = event[key];
  });

  return querystring.stringify(qsObj);
};

/**
 * Sends the data to the Google servers
 * @namespace GoogleAnalytics
 * @method  _send
 * @private
 * @async
 * @param   {Object} event Event hash (see Google Docs)
 * @param   {Function} [cb] Callback to invoke when complete
 * @returns {Object} undefined
 */
GoogleAnalytics.prototype._send = function(event, cb){
  if(typeof cb !== 'function'){
    cb = function(){};
  }

  if(typeof event === 'undefined' || !event.clientID){
    var qs = this._buildQS(event);
    var uri = xtend(serverConfig, {search: qs});

    var opts = {
      uri: url.format(uri),
      method: 'GET'
    };

    if(event.userAgent){
      opts['User-Agent'] = event.userAgent;
    }

    if(event.ip){
      opts['X-Forwarded-For'] = event.ip;
    }

    request(opts, function(err, resp, body){
      var errorMsg;

      if(err){
        return cb(err);
      }

      if(resp.statusCode !== 200){
        errorMsg = ['Error', resp.statusCode, body].join(' ');
        return cb(new Error(errorMsg));
      }

      return cb(null);
    });

  } else {
    return cb(new Error('clientID must be set on event object'));
  }

};

/**
 * Sends a pageview event
 * @method  pageview
 * @param   {Object} e Event hash for a pageview
 * @param   {Function} [cb] Optional callback
 * @returns {Object} undefined
 */
GoogleAnalytics.prototype.pageview = function(e, cb){
  var pageview = xtend(e, {hitType: 'pageview'});
  this._send(pageview, cb);
};

/**
 * Sends a event event
 * @method  event
 * @param   {Object} e Event hash for a event
 * @param   {Function} [cb] Optional callback
 * @returns {Object} undefined
 */
GoogleAnalytics.prototype.event = function(e, cb){
  var event = xtend(e, {hitType: 'event'});
  this._send(event, cb);
};

/**
 * Sends a appview event
 * @method  appview
 * @param   {Object} e Event hash for a appview
 * @param   {Function} [cb] Optional callback
 * @returns {Object} undefined
 */
GoogleAnalytics.prototype.appview = function(e, cb){
  var appview = xtend(e, {hitType: 'appview'});
  this._send(appview, cb);
};

/**
 * Sends a transactional event
 * @method  transactional
 * @param   {Object} e Event hash for a transactional
 * @param   {Function} [cb] Optional callback
 * @returns {Object} undefined
 */
GoogleAnalytics.prototype.transactional = function(e, cb){
  var transactional = xtend(e, {hitType: 'transactional'});
  this._send(transactional, cb);
};

/**
 * Sends a item event
 * @method  item
 * @param   {Object} e Event hash for a item
 * @param   {Function} [cb] Optional callback
 * @returns {Object} undefined
 */
GoogleAnalytics.prototype.item = function(e, cb){
  var item = xtend(e, {hitType: 'item'});
  this._send(item, cb);
};

/**
 * Sends a social event
 * @method  social
 * @param   {Object} e Event hash for a social event. Must contain at least
 *                     `socialNetwork`, `socialAction` and `socialTarget`
 * @param   {Function} [cb] Optional callback
 * @returns {Object} undefined
 */
GoogleAnalytics.prototype.social = function(e, cb){
  var social = xtend(e, {hitType: 'social'});
  if(!social.socialNetwork || !social.socialAction || !social.socialTarget){
    cb(new Error('Social events must have socialNetwork, socialAction and socialTarget set'));
  }
  this._send(social, cb);
};

/**
 * Sends a exception event
 * @method  exception
 * @param   {Object} e Event hash for a exception
 * @param   {Function} [cb] Optional callback
 * @returns {Object} undefined
 */
GoogleAnalytics.prototype.exception = function(e, cb){
  var exception = xtend(e, {hitType: 'exception'});
  this._send(exception, cb);
};

/**
 * Sends a timing event
 * @method  timing
 * @param   {Object} e Event hash for a timing
 * @param   {Function} [cb] Optional callback
 * @returns {Object} undefined
 */
GoogleAnalytics.prototype.timing = function(e, cb){
  var timing = xtend(e, {hitType: 'timing'});
  this._send(timing, cb);
};

module.exports = GoogleAnalytics;