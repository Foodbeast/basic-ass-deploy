var chai = require('chai');
var expect = chai.expect;
var should = chai.should();
var jsonfile = require('jsonfile');

var sampleConfig = {
  "ssh": {
    "host": "api.yourhost.com",
    "username": "ubuntu",
    "privateKey": "~/yoursshkey.pem"
  },
  "stack": {
    "process_manager": "pm2",
    "app_name": "my-api",
    "directory": "/srv/my-api"
  },
  "code": {
    "repo": "",
    "branch": "master"
  }
};

describe('test', function() {

  it('Start', function() {
    jsonfile.writeFile('bad.json', sampleConfig, function (err) {
      console.log('writing sample config...');
      if (err) throw err;

      var bad = require('../dist/basic-ass-deploy');
      done();
    });
  });

});