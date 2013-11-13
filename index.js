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

function GoogleAnalytics(config){
  this.config = config || {};
  if(!this.config.urchin){
    throw new Error('You must supply an urchin ID to track');
  }
  if(this.config.serverConfig){
    serverConfig = xtend(serverConfig, this.config.serverConfig);
  }
}

GoogleAnalytics.prototype._buildQS = function(event){
  var qsObj = {};
  event = xtend(event, clientConfig, this.config);

  Object.keys(event).forEach(function(key){
    var param = lookups.all[key];
    qsObj[param] = event[key];
  });

  return querystring.stringify(qsObj);
};


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

GoogleAnalytics.prototype.pageview = function(e, cb){
  var pageview = xtend(e, {hitType: 'pageview'});
  this._send(pageview, cb);
};

GoogleAnalytics.prototype.event = function(e, cb){
  var event = xtend(e, {hitType: 'event'});
  this._send(event, cb);
};

GoogleAnalytics.prototype.appview = function(e, cb){
  var appview = xtend(e, {hitType: 'appview'});
  this._send(appview, cb);
};

GoogleAnalytics.prototype.transactional = function(e, cb){
  var transactional = xtend(e, {hitType: 'transactional'});
  this._send(transactional, cb);
};

GoogleAnalytics.prototype.item = function(e, cb){
  var item = xtend(e, {hitType: 'item'});
  this._send(item, cb);
};

GoogleAnalytics.prototype.social = function(e, cb){
  var social = xtend(e, {hitType: 'social'});
  if(!social.socialNetwork || !social.socialAction || !social.socialTarget){
    cb(new Error('Social events must have socialNetwork, socialAction and socialTarget set'));
  }
  this._send(social, cb);
};

GoogleAnalytics.prototype.exception = function(e, cb){
  var exception = xtend(e, {hitType: 'exception'});
  this._send(exception, cb);
};

GoogleAnalytics.prototype.timing = function(e, cb){
  var timing = xtend(e, {hitType: 'timing'});
  this._send(timing, cb);
};

module.exports = GoogleAnalytics;