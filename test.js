/* global before, beforeEach, after, afterEach, describe, it, xdescribe, xit */
/* jshint unused: false */
'use strict';

var assert = require('assert');
var GoogleAnalytics = require('./index');
var nock = require('nock');
var querystring = require('querystring');

function Mock(cb, done){
  var _this = this;
  var boundCB = cb.bind(this);
  var n = nock('http://www.google-analytics.com')
    .filteringPath(function(path){
      _this.qs = querystring.parse(path.split('?')[1]);
      return '/collect';
    })
    .get('/collect')
    .reply(200, boundCB);
  return this;
}

describe('GoogleAnalytics', function(){
  describe('pageview', function(){
    it('Should track pageviews', function(done){
      var ga = new GoogleAnalytics({urchin: 'UA-111231-1'});
      var eventParams = {page: '/test'};
      var validator = function(){
        assert.equal(eventParams.page, this.qs.dp, 'Does not match');
        done();
      };
      var m = new Mock(validator, done);
      ga.pageview(eventParams);
    });
  });

  describe('Configuration', function(){
    it('Should handle all default configuration parameters', function(done){
      var ga = new GoogleAnalytics({urchin: 'UA-111231-1'});
      var eventParams = {
        anonymizeIp: 'false',
        sessionControl: 'start',
        referrer: 'http://foobar.com',
        campaignName: 'foo',
        campaignSource: 'bar',
        campaignMedium: 'synthetic',
        campaignKeyword: 'baz bash',
        campaignContent: 'fugazi',
        campaignId: 'abc123',
        screenResolution: '800x600',
        viewportSize: '800x600',
        encoding: 'utf-8',
        screenColors: '24-bit',
        language: 'en-us',
        javaEnabled: 'true',
        flashVersion: '10 1 r103',
        nonInteraction: 'true',
        hitType: 'pageview'
      };

      var lookups = {
        anonymizeIp: 'aip',
        sessionControl: 'sc',
        referrer: 'dr',
        campaignName: 'cn',
        campaignSource: 'cs',
        campaignMedium: 'cm',
        campaignKeyword: 'ck',
        campaignContent: 'cc',
        campaignId: 'ci',
        screenResolution: 'sr',
        viewportSize: 'vp',
        encoding: 'de',
        screenColors: 'sd',
        language: 'ul',
        javaEnabled: 'je',
        flashVersion: 'fl',
        hitType: 't',
        nonInteraction: 'ni'
      };

      var validator = function(){
        var qs = this.qs;
        Object.keys(lookups).forEach(function(key){
          var qsKey = lookups[key];
          var eParam = eventParams[key];
          var qParam = qs[qsKey];
          var errStr = ['Item missing from URL:', key, eParam, qsKey, qParam].join(' ');
          assert.equal(eParam, qParam, errStr);
        });
        done();
      };
      var m = new Mock(validator, done);
      ga.pageview(eventParams);
    });
  // if(!social.socialNetwork || !social.socialAction || !social.socialTarget)

    it('Should fail on social calls with missing socialNetwork', function(){
      var ga = new GoogleAnalytics({urchin: 'UA-111231-1'});
      var eventParams = {
        socialAction: 'like',
        socialTarget: 'http://foo.bar'
      };

      assert.throws(function(){
        ga.social(eventParams);
      }, 'Should return an error');
    });

    it('Should fail on social calls with missing socialAction', function(){
      var ga = new GoogleAnalytics({urchin: 'UA-111231-1'});
      var eventParams = {
        socialNetwork: 'Facebook',
        socialTarget: 'http://foo.bar'
      };

      assert.throws(function(){
        ga.social(eventParams);
      }, 'Should return an error');
    });

    it('Should fail on social calls with missing socialTarget', function(){
      var ga = new GoogleAnalytics({urchin: 'UA-111231-1'});
      var eventParams = {
        socialNetwork: 'Facebook',
        socialAction: 'like'
      };

      assert.throws(function(){
        ga.social(eventParams);
      }, 'Should return an error');
    });

    it('Should throw if not given an urchin', function(){
      assert.throws(function(){
        var ga = new GoogleAnalytics({});
      });
    });

  });

});