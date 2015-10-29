"use strict"

var fs = require('fs');
var path = require('path');
var glob = require('glob');
var slug = require('slug');
var assign = require('object-assign');

var _defaults = {
  "viewports": {
    "width":  1400,
    "height": 2000
  },
  "test_folder": "spec",
  "capture_target": "bitmaps_test",
  "scenarios": []
};

var DEFAULT_CONFIG_FILENAME = 'config.json';

var Util = {

  readJSON: function(configFile){
    var config = fs.readFileSync(configFile, "utf8");
    var configJSON = JSON.parse(config);
    return configJSON;
  },

  defaults: function(){
    return _defaults;
  },

  readBaseConfig: function(configFile){
    var config = this.readJSON(configFile);
    var result = {};

    assign(result, this.defaults(), config);
    return result;
  },

  slugify: function(string) {
    return slug(string, {lower: true});
  },

  generateFilename: function(scenarioLabel, captureLabel){
    return this.slugify(scenarioLabel) + '__' + this.slugify(captureLabel);
  },

  testFolder: function(configFile){
    var configJson = this.readJSON(configFile);
    return configJson.test_folder;
  },

  readDir: function(testFolderPath){
    return glob.sync(path.join(testFolderPath, '*.json'));
  },

  getConfigFiles: function(configParam, baseDir){
    if (!configParam) {
      var configFile = path.join(__dirname, '..', DEFAULT_CONFIG_FILENAME);
      var testFolder = this.testFolder(configFile);
      var baseDir = path.dirname(configFile);
      var files = this.readDir(path.join(baseDir, testFolder));
      return {
        'base': configFile,
        'tests': files
      }
    }

    if (configParam.indexOf(':') > 0) {
      var params = configParam.split(':');
      var configFile = path.join(baseDir, params[0] + '.json');
      var testFolder = this.testFolder(configFile);
      var files = [path.join(baseDir, testFolder, params[1] + '.json')];
      return {
        'base': configFile,
        'tests': files
      }
    }

    var configFile = path.join(baseDir, configParam + '.json');
    var testFolder = this.testFolder(configFile);
    var files = this.readDir(path.join(baseDir, testFolder));
    return {
      'base': configFile,
      'tests': files
    }
  },

  readConfig: function(files) {
    var config = this.readBaseConfig(files.base);
    var scenarioJSON;
    var outputFile;
    var baseDir = path.dirname(files.base);
    var bitmapFile = config.capture_target;

    files.tests.forEach(function(file){
      scenarioJSON = Util.readJSON(file);
      outputFile = Util.generateFilename(config.label, scenarioJSON.label);
      scenarioJSON.output_file = path.join(baseDir, bitmapFile, outputFile + '.png');
      config.scenarios = config.scenarios.concat([scenarioJSON]);
    });

    return config;
  },

  saveFile: function(targetFile, source) {
    var json = JSON.stringify(source);
    fs.writeFileSync(targetFile, json, "utf8");
  }

};

module.exports = Util;
