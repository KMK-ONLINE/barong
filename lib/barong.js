"use strict"

var spawn           = require('child_process').spawn;
var fs              = require('fs');
var path            = require('path');
var handlebars      = require('node-handlebars');
var http            = require('http-server');
var Util            = require('./util.js');
var captureScript   = 'capture.js';

var CONFIG_TMP_FILE = '.barong-config.json';
var CAPTURE_FILE    = 'capture.js';
var NOT_FOUND       = "Config file not found."

var Barong = {
  saveConfigTmp: function(cwd, configJSON){
    var tmpPath = path.join(cwd, CONFIG_TMP_FILE);
    return Util.saveFile(tmpPath, configJSON);
  },

  getConfigJSON: function(cwd, configParams){
    var files = Util.getConfigFiles(cwd, configParams.configFile);
    if(!files){
      throw new Error(NOT_FOUND);
      return false;
    }
    return Util.readConfig(cwd, files, configParams.targetFolder);
  },

  capture: function(cwd, configParams, done){
    var configJSON = this.getConfigJSON(cwd, configParams);
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
  },

  compareDir: function(cwd, dirA, dirB){
    var testDir = path.join(cwd, dirA);
    if(!fs.existsSync(testDir)){
      throw new TypeError("Test directory not found");
    }
    var referenceDir = path.join(cwd, dirB);
    if(!fs.existsSync(referenceDir)){
      throw new Error("Reference directory not found");
    }
    var testImages = Util.scanImages(testDir);
    if(!testImages.length){
      throw new Error("No images found in test directory");
    }
    var referenceImages = Util.scanImages(referenceDir);
    var result = [];

    testImages.forEach(function(image, index){
      var searchImage = path.join(referenceDir, path.basename(image));
      var targetImageIndex = referenceImages.indexOf(searchImage)
      var b = false;
      if(targetImageIndex > -1){
        b = referenceImages[targetImageIndex];
        b = path.relative(cwd, b);
      }
      result.push({
        a: path.relative(cwd, image),
        b: b
      });
    });

    return result;
  },

  comparisonOutput: function(cwd, JSON){
    var indexLocation = path.join(cwd, 'index.html');
    var templateLocation = path.join(__dirname, '..', 'templates', 'template.html');
    var hbs = handlebars.create();
    hbs.engine(templateLocation, {imageList: JSON}, function(err, html) {
      if (err) {
        throw err;
      }
      fs.writeFileSync(indexLocation, html, "utf8");
    });
  },

  compare: function(cwd, testDir, referenceDir){
    var comparisonJSON = this.compareDir(cwd, testDir, referenceDir);
    var output = this.comparisonOutput(cwd, comparisonJSON);
    var options = {
      root: path.join(cwd)
    };
    http.createServer(options).listen(8080);
    console.log('Running on localhost:8080');
  },

  test: function(cwd, captureOptions, reference){
    var configJSON = this.getConfigJSON(cwd, captureOptions);
    var captureTarget = configJSON.capture_target;
    var callback = function(){
      var testDir = path.join(captureTarget, captureOptions.targetFolder);
      var referenceDir = path.join(captureTarget, reference);
      Barong.compare(cwd, testDir, referenceDir);
    };
    Barong.capture(cwd, captureOptions, callback);
  }
};

module.exports = Barong;
