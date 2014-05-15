# Agate

**Antigate.com** client that does not suck.

Promise powered, based on `Q` and `urllib`.

## Install

    npm install agate

## Use

If your captcha is a file, use the following code:

```javascript
var Agate = require('agate');
var ag = new Agate('your-32-byte-key');
ag.recognizeFile('./captcha.jpg')
    .then(function (text) {
        console.log('CPTCHA is recognized:', text);
    })
    .catch(function (error) {
        console.error('Error:', error);
    });
```

If your captcha is base64 string, use the following code:

```javascript
var Agate = require('agate');
var ag = new Agate('your-32-byte-key');
ag.recognizeBase64('R0lGODlhAAAAAAAP///yH5BAEAAAA...SHORTENED FOR READABILITY')
    .then(function (text) {
        console.log('CPTCHA is recognized:', text);
    })
    .catch(function (error) {
        console.error('Error:', error);
    });
```
