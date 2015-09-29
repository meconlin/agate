process.env.DEBUG = 'agate,urllib';

var Q = require('q');
var fs = require('fs');
var Agate = require('./agate');
var readFile = Q.denodeify(fs.readFile);
var key = require('./key');

var FILE = __dirname + '/454.jpg';

var ag = new Agate(key);

testFile();

function testBase64() {
	readFile(FILE, 'base64')
		.then(ag.recognizeBase64.bind(ag))
		.then(console.log)
		.done();
}

function testFile() {
	ag.recognizeFile(FILE)
		.then(console.log)
		.done();
}

function testBadCaptcha() {
	ag.recognizeFile(FILE)
		.then(function(results){
				console.log(results);
				ag.reportBadCaptcha(results.id)
					.then(console.log);
			}
		)
}
