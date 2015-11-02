"use strict"

var fs     = require('fs');
var path   = require('path');
var glob   = require('glob');
var slug   = require('slug');
var assign = require('object-assign');

var _defaults = {
  "viewports" : {
    "width"  : 1400,
    "height" : 2000
  },
  "test_folder"    : "spec",
  "capture_target" : "bitmaps_test",
  "scenarios"      : []
};

var DEFAULT_CONFIG_FILENAME = 'config.json';

var Util = {

  readJSON: function(configFile){
    var config     = fs.readFileSync(configFile, "utf8");
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

  getBaseDir: function(configFile, cwd) {
    if(cwd) return cwd;
    return path.dirname(configFile);
  },

  getBaseConfigFile: function(cwd, configParam) {
    if (!configParam) {
      if (fs.existsSync(path.join(cwd, DEFAULT_CONFIG_FILENAME))) {
        return path.join(cwd, DEFAULT_CONFIG_FILENAME);
      }
      return false;
    }

    if (configParam.indexOf(':') > 0) {
      var params = configParam.split(':');
      return path.join(cwd, params[0] + '.json');
    }

    return path.join(cwd, configParam + '.json');
  },

  getTestsBaseFolder: function(configFile){
    var testFolder = this.testFolder(configFile);

    return path.join(path.dirname(configFile), testFolder);
  },

  getConfigFiles: function(cwd, configParam){
    var baseConfigFile = this.getBaseConfigFile(configParam);
    var testFolder     = this.getTestsBaseFolder(baseConfigFile);

    return {
      'base'  : baseConfigFile,
      'tests' : this.readDir(testFolder)
    };
  },

  readConfig: function(cwd, files) {
    var scenarioJSON;
    var outputFile;
    var config     = this.readBaseConfig(cwd, files.base);
    var bitmapFile = config.capture_target;

    files.tests.forEach(function(file){
      scenarioJSON             = Util.readJSON(file);
      outputFile               = Util.generateFilename(config.label, scenarioJSON.label);
      scenarioJSON.output_file = path.join(cwd, bitmapFile, outputFile + '.png');
      config.scenarios         = config.scenarios.concat([scenarioJSON]);
    });

    return config;
  },

  saveFile: function(targetFile, source) {
    var json = JSON.stringify(source);
    fs.writeFileSync(targetFile, json, "utf8");
  }

};

module.exports = Util;
