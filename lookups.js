/* jshint unused: false */
'use strict';

var xtend = require('xtend');

var configHash = exports.configHash = {
  anonymizeIp: 'aip',
  sessionControl: 'sc',
  referrer: 'dr',
  cliendId: 'cid',
  urchin: 'tid',
  v: 'v',
  '_v': '_v'
};

var trafficSourcesHash = exports.trafficSourcesHash = {
  campaignName: 'cn',
  campaignSource: 'cs',
  campaignMedium: 'cm',
  campaignKeyword: 'ck',
  campaignContent: 'cc',
  campaignId: 'ci'
};

var systemInfoHash = exports.systemInfoHash = {
  screenResolution: 'sr',
  viewportSize: 'vp',
  encoding: 'de',
  screenColors: 'sd',
  language: 'ul',
  javaEnabled: 'je',
  flashVersion: 'fl'
};

var hitHash = exports.hitHash = {
  hitType: 't',
  nonInteraction: 'ni'
};

var contentInformationHash = exports.contentInformationHash = {
  location: 'dl',
  hostname: 'dh',
  page: 'dp',
  title: 'dt'
};

var appTrackingHash = exports.appTrackingHash = {
  appName: 'an',
  appVersion: 'av'
};

var eventTrackingHash = exports.eventTrackingHash = {
  eventCategory: 'ec',
  eventAction: 'ea',
  eventLabel: 'el',
  eventValue: 'ev'
};

var socialInteractionsHash = exports.socialInteractionsHash = {
  socialNetwork: 'sn',
  socialAction: 'sa',
  socialActionTarget: 'st'
};

var timingHash = exports.timingHash = {
  timingCategory: 'utc',
  timingVar: 'utv',
  timingValue: 'utt',
  timingLabel: 'utl'
};

var exceptionDescription = exports.exceptionDescription = {
  exDescription: 'exd',
  exFatal: 'exf'
};

var all = exports.all = xtend(configHash,
                              trafficSourcesHash,
                              systemInfoHash,
                              hitHash,
                              contentInformationHash,
                              appTrackingHash,
                              eventTrackingHash,
                              socialInteractionsHash,
                              timingHash,
                              exceptionDescription);