"use strict"

var fs = require('fs');
var path = require('path');
var glob = require('glob');
var extend = require('util')._extend;
var slug = require('slug');

var defaults = {
  "engine": "slimerjs",
  "viewports": {
    "width":  1400,
    "height": 2000
  },
  "test_folder": "spec",
  "capture_target": "bitmaps_test",
  "scenarios": []
};

var Util = {

  readJSON: function(configFile){
    var config = fs.readFileSync(configFile, "utf8");
    var configJSON = JSON.parse(config);
    return configJSON;
  },

  readBaseConfig: function(){
    var file = path.normalize(__dirname + '/../config.json');
    var config = this.readJSON(file);
    return extend(defaults, config);
  },

  testFolder: function(){
    var config = this.readBaseConfig();
    return path.normalize(__dirname + '/../' + config.test_folder);
  },

  slugify: function(string) {
    return slug(string, {lower: true});
  },

  generateFilename: function(scenarioLabel, captureLabel){
    return this.slugify(scenarioLabel) + '__' + this.slugify(captureLabel);
  },

  readConfig: function(){
    var config = this.readBaseConfig();
    var test_folder = this.testFolder();

    var files = glob.sync(test_folder + '/*.js');

    files.forEach(function(file){
      var scenario_config = Util.readJSON(file);
      config.scenarios.push(scenario_config);
    });
    return config;
  }

};

module.exports = Util;
