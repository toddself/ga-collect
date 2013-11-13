[![build status](https://secure.travis-ci.org/toddself/ga-collect.png)](http://travis-ci.org/toddself/ga-collect)

#ga-collect
A backend interface for the new version of Google Analytics, analytics.js, allowing you to proxy your events from your server rather than load the analytics code directly into the browser.

##Installation
`npm install ga-collect`

##Usage
```javascript
var GA = require('ga-collect');
var ga = new GA({urchin: 'UA-XXXXX-X'});
ga.pageview(
  {
    location: 'http://foobar.baz/a?b#c',
    hostname: 'foobar.baz',
    page: '/a',
    title: 'Baz the Foo in the Bar!'
  }, function(err){
    if(err){
      console.log(err);
    }
  });
```

##Methods
The keys for the event object passed into each function are the `Field Name` parameters from the [Analytics.js Field Reference](https://developers.google.com/analytics/devguides/collection/analyticsjs/field-reference).

The following methods are supported, the callback is entirely optional. No success or failure message will be passed to it unless the server responds with a non 2XX status code:

`#pageview(event, cb)`

`#appview(event, cb)`

`#event(event, cb)`

`#transaction(event, cb)`

`#item(event, cb)`

`#social(event, cb)`

**Note:** Social events *MUST* contain all three [social interaction](https://developers.google.com/analytics/devguides/collection/analyticsjs/field-reference#socialNetwork) parameters. If they are not provided, an error will be thrown.

`#exception(event, cb)`

`#timing(event, cb)`

##Development
```bash
git clone https://github.com/toddself/ga-collect
cd ga-collect
npm install
```

##License & Copyright
Copyright (c) 2013 Todd Kennedy, licensed under the [MIT License](/LICENSE)
