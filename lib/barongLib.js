"use strict"

var captureScript = 'capture.js';
var spawn = require('child_process').spawn;
var fs = require('fs');
var path = require('path');
var Util = require('./util.js');

var CONFIG_TMP_FILE = '../.barong-config.json';
var CAPTURE_FILE = 'capture.js';

var BarongLib = {

  capture: function(done, configParam, baseDir){
    var files = Util.getConfigFiles(configParam, baseDir);
    var configJSON = Util.readConfig(files);

    Util.saveFile(path.join(__dirname, CONFIG_TMP_FILE), configJSON);
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
