"use strict"

var fs = require('fs');

var casper = require("casper").create();
var mouse = require("mouse").create(casper);

var CONFIG_TMP_FILE = '.barong-config.json';
var configJSON = fs.read(CONFIG_TMP_FILE);
var config = JSON.parse(configJSON);

var Util = {
  getViewport: function(scenario){
    if(typeof scenario.viewports !== 'undefined'){
      return scenario.viewports;
    }else{
      return config.viewports;
    }
  }
};

var BarongCapture = {
  capture: function(casper, capture, capture_index){
    if (typeof capture.selector === "string"){
      casper.captureSelector(capture.output_file, capture.selector);
    } else {
      casper.capture(capture.output_file, capture.selector);
    }
  },

  captureScenario: function(casper, scenario, scenario_index){
    var viewport = Util.getViewport(scenario);
    casper.viewport(viewport.width, viewport.height, function(){
      casper.thenOpen(scenario.url);
      casper.then(function(){
        casper.each(scenario.captures, BarongCapture.capture);
      });
    });
  }
};

casper.start();
casper.each(config.scenarios, BarongCapture.captureScenario);
casper.run();
