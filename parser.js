var debug = require('debug')('agate');
var format = require('util').format;

var dict = {
  'ERROR_WRONG_USER_KEY': {
    message: 'User authorization key is invalid (its length is not 32 bytes as it should be)'
  },
  'ERROR_KEY_DOES_NOT_EXIST': {
    message: 'You have set wrong user authorization key in request'
  },
  'ERROR_ZERO_BALANCE': {
    message: 'Account has zero or negative balance'
  },
  'ERROR_NO_SLOT_AVAILABLE': {
    message: 'No idle captcha workers are available at the moment, please try a bit later or try increasing your bid here'
  },
  'ERROR_ZERO_CAPTCHA_FILESIZE': {
    message: 'The size of the captcha you are uploading is zero'
  },
  'ERROR_TOO_BIG_CAPTCHA_FILESIZE': {
    message: 'Your captcha size is exceeding 100kb limit'
  },
  'ERROR_WRONG_FILE_EXTENSION': {
    message: 'Your captcha file has wrong extension, the only allowed extensions are gif,jpg,jpeg,png'
  },
  'ERROR_IMAGE_TYPE_NOT_SUPPORTED': {
    message: 'Could not determine captcha file type, only allowed formats are JPG, GIF, PNG'
  },
  'ERROR_IP_NOT_ALLOWED': {
    message: 'Request with current account key is not allowed from your IP. Please refer to IP list section'
  },
  'ERROR_WRONG_ID_FORMAT': {
    message: 'The captcha ID you are sending is non-numeric'
  },
  'ERROR_CAPTCHA_UNSOLVABLE': {
    message: 'Captcha could not be solved by 5 different people'
  }
};

function parse(body) {
  debug(format('parse(%s)', body));
  body = ('' + body).trim();
  var m = body.match(/^OK\|(.+)$/);
  if (m) {
    return m[1];
  }
  if (body === 'CAPCHA_NOT_READY') {
    return false;
  }
  if (body === 'OK_REPORT_RECORDED') {
    return true;
  }
  if (body.match(/^ERROR_/)) {
    throw protocolError(body);
  }
  throw parseError(body);
}

module.exports = parse;

function parseError(body) {
  var e = new TypeError('E_PARSE: could not parse "' + body + '"');
  e.code = 'E_PARSE';
  return e;
}

function protocolError(code) {
  var edata = dict[code] || {
    message: code + ': unknown'
  };

  var e = new Error(code + ': ' + edata.message);
  e.code = code;
  return e;
}
