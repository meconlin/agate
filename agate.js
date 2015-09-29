var urllib = require('urllib');
var Q = require('q');
var parse = require('./parser');
var debug = require('debug')('agate');
var format = require('util').format;
var fs = require('fs');
var readFile = Q.denodeify(fs.readFile);


var U_IN = 'http://antigate.com/in.php';
var U_STATUS = 'http://antigate.com/res.php';
var U_REPORTBAD = 'http://antigate.com/res.php';

function Agate(key) {
  this.key = key;
}
module.exports = Agate;

Agate.prototype.recognizeFile = function(fileName) {
  return readFile(fileName, 'base64')
    .then(this.recognizeBase64.bind(this));
};

Agate.prototype.reportBadCaptcha = function(id) {
  return reportBad(this.key, id)
    .then(function(result) {
        return result;
    });
};

Agate.prototype.recognizeBase64 = function(base64Str) {
  return uploadBase64(this.key, base64Str)
    .then(sleep(5000))
    .then(checkLoop.bind(null, this.key));
};


var request = Q.denodeify(function(url, options, next) {
  urllib.request(url, options, function(err, data, res) {
    if (res) {
      res.data = data;
    }
    next(err, res);
  });
});

function checkLoop(key, id) {
  debug(format('checkLoop(%s,%s)', key, id));
  var i = 0;

  function iterate() {
    return sleep(5000)()
      .then(checkStatus.bind(null, key, id))
      .then(function(result) {
        if (result === false) {
          i++;
          return iterate(key, id);
        } else {
          return {answer: result, id: id};
        }
      });
  }
  return iterate();

}

function parseResponse(res) {
  return parse(res.data);
}

function uploadBase64(key, base64Str) {
  debug(format('uploadBase64(%s,%s...)', key, base64Str.substr(0, 25)));
  return request(U_IN, {
    method: 'POST',
    data: {
      method: 'base64',
      key: key,
      body: base64Str
    }
  }).then(parseResponse);
}

function reportBad(key, id) {
  debug(format('reportBad(%s,%s)', key, id));
  return request(U_REPORTBAD, {
    method: 'GET',
    data: {
      action: 'reportbad',
      key: key,
      id: id
    }
  }).then(parseResponse);
}

function checkStatus(key, id) {
  debug(format('checkStatus(%s,%s)', key, id));
  return request(U_STATUS, {
    method: 'GET',
    data: {
      action: 'get',
      key: key,
      id: id
    }
  }).then(parseResponse);
}

function uploadStream() {}

function sleep(ms) {
  return function(data) {
    debug(format('sleep(%d)', ms));

    var def = Q.defer();
    setTimeout(function() {
      def.resolve(data);
    }, ms);
    return def.promise;
  };
}
