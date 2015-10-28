"use strict"

var fs = require('fs');
var path = require('path');
var glob = require('glob');
var slug = require('slug');
var assign = require('object-assign');

var _defaults = {
  "engine": "slimerjs",
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

  readBaseConfig: function(customConfigJSON){
    var file = path.join(__dirname, '..', DEFAULT_CONFIG_FILENAME);
    if(customConfigJSON){
      file = customConfigJSON;
    }

    var config = this.readJSON(file);
    var defaults = _defaults;
    var result = {};

    assign(result, defaults, config);
    return result;
  },

  testFolder: function(){
    var config = this.readBaseConfig();
    return path.join( __dirname.toString(), '..', config.test_folder);
  },

  slugify: function(string) {
    return slug(string, {lower: true});
  },

  generateFilename: function(scenarioLabel, captureLabel){
    return this.slugify(scenarioLabel) + '__' + this.slugify(captureLabel);
  },

  readSpecificConfig: function(fileName){
    var config = this.readBaseConfig();
    var test_folder = this.testFolder();
    var scenario_config = this.readJSON(path.join(test_folder, fileName));

    config.scenarios = config.scenarios.concat(scenario_config);
    return config;
  },

  readConfig: function(){
    var config = this.readBaseConfig();
    var test_folder = this.testFolder();

    var files = glob.sync(path.join(test_folder, '*.json'));

    files.forEach(function(file){
      var scenario_config = Util.readJSON(file);
      config.scenarios = config.scenarios.concat([scenario_config]);
    });
    return config;
  },

  saveFile: function(targetFile, source) {
    var json = JSON.stringify(source);
    fs.writeFileSync(targetFile, json, "utf8");
  }

};

module.exports = Util;
