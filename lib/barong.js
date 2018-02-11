"use strict"

var spawn           = require('child_process').spawn;
var fs              = require('fs-extra')
var path            = require('path');
var http            = require('http-server');
var open            = require('open');
var Util            = require('./util.js');
var ImageDiff       = require('image-diff');
var captureScript   = 'capture.js';

var CONFIG_TMP_FILE = '.barong-config.json';
var CAPTURE_FILE    = 'capture.js';
var NOT_FOUND       = "Config file not found";

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

  compareDir: function(cwd, testDir, refDir){
    var testDir = path.join(cwd, testDir);
    if(!fs.existsSync(testDir)){
      throw new Error("Test directory not found");
    }
    var referenceDir = path.join(cwd, refDir);
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
      var refPath = false;
      if(targetImageIndex > -1){
        refPath = referenceImages[targetImageIndex];
        refPath = path.relative(cwd, refPath);
      }
      result.push({
        test: path.relative(cwd, image),
        ref: refPath
      });
    });

    return result;
  },

  comparisonOutput: function(cwd, JSONObject){
    var indexLocation = path.join(cwd, 'index.html');
    var templateLocation = path.join(__dirname, '../templates/output/template.html');
    var template = fs.readFileSync(templateLocation, 'utf8');
    var result = template.replace(/\{data\}/, JSON.stringify(JSONObject));
    var resultLocation = cwd;
    fs.ensureDirSync(resultLocation);
    fs.copySync(path.join(__dirname, '../templates/output/.barong_assets'), path.join(resultLocation, '.barong_assets'));
    fs.writeFile(path.join(resultLocation, 'barong_result.html'), result);
  },

  output: function(err, data) {
    if (err) {
      console.error(err);
    }
    console.log(data);
  },

  imageDiff: function(cwd, testDir, referenceDir) {
    var comparisonJSON = this.compareDir(cwd, testDir, referenceDir);
    comparisonJSON.forEach(function(item){
      var params = {
        actualImage: item.ref,
        expectedImage: item.test
      };
      ImageDiff.getFullResult(params, this.output.bind(this));
    }.bind(this));
  },

  compare: function(cwd, testDir, referenceDir){
    var comparisonJSON = this.compareDir(cwd, testDir, referenceDir);
    this.comparisonOutput(cwd, comparisonJSON);
    var options = {
      root: path.join(cwd)
    };
    http.createServer(options).listen(4321);
    open('http://127.0.0.1:4321/barong_result.html');
    console.log('Running on http://127.0.0.1:4321');
    console.log('Press ctr+c to close');
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
  },

  init: function(cwd) {
    var configPath = path.join(__dirname, '..', "templates/config");
    var msg = [
      '\n  Config initilized. We\'ve included some sample config file for you to start with. \n',
      '  barong.json               your main config file',
      '  scenarios/',
      '    capture-selector.json   capture with css selector',
      '    capture-region.json     capture with custom region clip',
      '    custom-viewport.json    change viewport size',
      '    action-hover.json       do hover before capture',
      '    action-click.json       do click before capture'
    ].join('\n');

    fs.copy(configPath, cwd, function (err) {
      if (err) return console.error(err)
      console.log(msg)
    });

  }
};



module.exports = Barong;
