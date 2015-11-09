"use strict"

var fs       = require('fs');
var path     = require('path');
var glob     = require('glob');
var slug     = require('slug');
var beautify = require('js-beautify');
var assign   = require('object-assign');

var _defaults = {
  "viewport" : {
    "width"  : 1400,
    "height" : 2000
  },
  "test_folder"    : "spec",
  "capture_target" : "bitmaps_test",
  "scenarios"      : []
};

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

  testFolder: function(baseConfigFile){
    var configJson = this.readJSON(baseConfigFile);
    return configJson.test_folder;
  },

  readDir: function(testFolderPath){
    return glob.sync(testFolderPath);
  },

  parseConfigParams: function(configParam){
    if (configParam) {
      return configParam.split(':');
    }
    return null;
  },

  getBaseConfigFile: function(cwd, configFile) {
    var baseConfigFile;
    var params = this.parseConfigParams(configFile);

    baseConfigFile = path.join(cwd, params[0] + '.json');

    if (!fs.existsSync(baseConfigFile)) {
      return false;
    }

    return baseConfigFile;
  },

  getTestsBaseFolder: function(baseConfigFile){
    var testFolder = this.testFolder(baseConfigFile);

    return path.join(path.dirname(baseConfigFile), testFolder);
  },

  getTestGlob: function(configParam){
    var params = this.parseConfigParams(configParam);
    var globPattern = "*.json";

    if (params[1]) {
      globPattern = params[1] + '.json';
    }
    return globPattern;
  },

  getConfigFiles: function(cwd, configFile){
    var baseConfigFile = this.getBaseConfigFile(cwd, configFile);
    if (!baseConfigFile) {
      return false;
    }

    var testFolder = this.getTestsBaseFolder(baseConfigFile);
    var testGlob   = path.join(testFolder, this.getTestGlob(configFile));
    var testFiles  = this.readDir(testGlob);

    return {
      'base'  : baseConfigFile,
      'tests' : testFiles
    };
  },

  readConfig: function(cwd, files, targetFolder) {
    var scenarioJSON;
    var outputFile;
    var config        = this.readBaseConfig(files.base);
    var captureTarget = config.capture_target + '/' + targetFolder;
    var outputFiles   = [];
    var hasDuplicate  = false;

    files.tests.forEach(function(file){
      scenarioJSON = Util.readJSON(file);
      scenarioJSON.captures.forEach(function(capture){
        outputFile = Util.generateFilename(scenarioJSON.label, capture.label);
        capture.output_file = path.join(cwd, captureTarget, outputFile + '.png');
        if(outputFiles.indexOf(capture.output_file) > -1){
          hasDuplicate = true;
        }
        outputFiles.push(capture.output_file);
      });
      config.scenarios = config.scenarios.concat([scenarioJSON]);
    });

    if(hasDuplicate){
      throw new Error("Duplicate capture label");
    }

    return config;
  },

  saveFile: function(targetFile, source) {
    var json = JSON.stringify(source);
    json = beautify(json);
    fs.writeFileSync(targetFile, json, "utf8");
  },

  scanImages: function(dir){
    return glob.sync(dir + '/*.png');
  }

};

module.exports = Util;
