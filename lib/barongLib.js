"use strict"

var captureScript = 'capture.js';
var spawn = require('child_process').spawn;
var fs = require('fs');
var path = require('path');
var Util = require('./util.js');

var CONFIG_TMP_FILE = '.barong-config.json';
var CAPTURE_FILE = 'capture.js';
var NOT_FOUND = "Config file not found."

var BarongLib = {
  saveConfigTmp: function(cwd, configJSON){
    var tmpPath = path.join(cwd, CONFIG_TMP_FILE);
    return Util.saveFile(tmpPath, configJSON);
  },

  capture: function(cwd, configParams, done){
    var files = Util.getConfigFiles(cwd, configParams.configFile);
    if(!files){
      throw new Error(NOT_FOUND);
      return false;
    }
    var configJSON = Util.readConfig(cwd, files, configParams.targetFolder);
    this.saveConfigTmp(cwd, configJSON);
    this.run(done);
  },

  run: function(done) {
    var captureFile = path.join(__dirname, CAPTURE_FILE);
    var casperArgs = [
        captureFile,
        '--engine=slimerjs'
    ];
    var casperChild = spawn('casperjs', casperArgs);

    casperChild.on('close', function (code) {
      if(done) done();
    });
  }
};

module.exports = BarongLib;
