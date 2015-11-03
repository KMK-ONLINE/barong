"use strict"

var fs = require('fs');

var casper = require("casper").create();

var CONFIG_TMP_FILE = '.barong-config.json';
var configJSON = fs.read(CONFIG_TMP_FILE);
var config = JSON.parse(configJSON);

var Util = {
  getViewport: function(scenario){
    if(typeof scenario.viewport !== 'undefined'){
      return scenario.viewport;
    }else{
      return config.viewport;
    }
  }
};

var BarongCapture = {
  doAction: function(action, selector){
    if(action == "hover"){
      casper.mouse.move(selector);
    }else if(action == "click"){
      casper.click(selector);
    }
  },

  doBeforeCapture: function(capture){
    if(capture.before_capture){
      casper.then(function(){
        var beforeCapture = capture.before_capture;
        BarongCapture.doAction(beforeCapture.action, beforeCapture.selector);
      });
    }
  },

  doCapture: function(outputFile, selector){
    if (typeof selector === "string"){
      casper.captureSelector(outputFile, selector);
    } else {
      casper.capture(outputFile, selector);
    }
  },

  capture: function(casper, capture, capture_index){
    BarongCapture.doBeforeCapture(capture);

    casper.then(function(){
      BarongCapture.doCapture(capture.output_file, capture.selector);
    });
  },

  captureScenario: function(casper, scenario, scenario_index){
    var viewport = Util.getViewport(scenario);
      casper.then(function(){
        this.viewport(viewport.width, viewport.height);
      });
      casper.thenOpen(scenario.url);

      casper.then(function(){
        casper.evaluate(function() {
            var style = document.createElement('style');
            var styleContent = [
            '* { ',
            '    transition: none !important;',
            '    -moz-transition: none !important;',
            '    -webkit-transition: none !important;',
            '    animation: none !important;',
            '    -moz-animation: none !important;',
            '    -webkit-animation: none !important;',
            '}'].join("");

            style.innerHTML = styleContent;
            document.body.appendChild(style);
            if($) $.fx.off = true;
        });

        casper.each(scenario.captures, BarongCapture.capture);
      });
  }
};

casper.start();
casper.each(config.scenarios, BarongCapture.captureScenario);
casper.run();
