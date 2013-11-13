#analytics.js

##Installation
`npm install google-analytics`

##Usage
```javascript
var GA = require('google-analytics');
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
'ga.pageview'
'ga.appview'
'ga.event'
'ga.transaction'
'ga.item'
'ga.social'
'ga.exception'
'ga.timing'



##Development
```bash
git clone https://github.com/toddself/google-analytics
cd google-analytics
npm install
```