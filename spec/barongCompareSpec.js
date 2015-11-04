"use strict"

var fs            = require('fs');
var path          = require('path');
var Util          = require('../lib/util.js');
var resemble      = require('node-resemble-js');
var barongCompare = require('../lib/barongCompare.js');

describe("barongCompare", function() {
  describe("parameter", function() {
    xit("has no parameter", function() {});
    xit("only have one parameter", function() {});
    xit("only have two parameter", function() {});
    xit("only have three parameter", function() {});
  });

  xdescribe("compare", function() {
    var cwd         = "/some/path";
    var configFile  = "liputan6";
    var folderA     = "reference";
    var folderB     = "test";
    var configJSON = {
      "label": "Test Base",
      "viewport": {
        "width":  1400,
        "height": 2000
      },
      "capture_target": "bitmaps_test",
      "scenarios": [
      ]
    };
    var outputFile   = Util.generateFilename('Test Page', 'Test Capture');
    var resemble;

    beforeAll(function(done){
      configJSON.scenarios[0] = {
        "label"    : "Test Page",
        "url"      : "http://www.liputan6.dev:8000",
        "captures" : [
          {
            "label": "Test Capture",
            "selector"    : ".navbar--top__logo",
            "output_file" : path.join(cwd, folderA, outputFile + '.png')
          }
        ]
      };

      var configFiles    = {
        "base"  : "/some/path/liputan6.json",
        "tests" : [
          "/some/path/test-folder/page1.json"
        ]
      };

      spyOn(Util, "getConfigFiles").and.returnValue(configFiles);
      spyOn(Util, "readConfig").and.returnValue(configJSON);
      spyOn(fs, "existsSync").and.returnValue(true);

      resemble = jasmine.createSpy('resemble');

      spyOn(resemble, "compareTo").and.callThrough();
      spyOn(resemble, "onComplete").and.callThrough();
      barongCompare.compare(cwd, configFile, folderA, folderB);
    });

    it("have been called", function(){
      expect(Util.readConfig).toHaveBeenCalled();
    });
  });

  describe("compare", function() {

    xit("must throw can't compare files", function(){
      barongCompare.compare(cwd, configFile, folderA, folderB);

      expect(barongCompare).toThrow();
    });
  });

});
