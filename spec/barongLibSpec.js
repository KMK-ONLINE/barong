"use strict"

var fs = require('fs');
var path = require('path');
var sizeOf = require('image-size');
var BarongLib = require('../lib/barongLib.js');
var Util = require('../lib/util.js');

describe("BarongLib", function(){
  jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;

  describe("capture", function(){
    var dirname = path.join(__dirname, '..', 'bitmaps_test');
    var outputFile = Util.generateFilename('Test Base', 'Test Page');

    var configJSON = {
      "label": "Test Base",
      "viewports": {
        "width":  1400,
        "height": 2000
      },
      "capture_target": "bitmaps_test",
      "scenarios": [
      ]
    };

    beforeAll(function(){
      spyOn(Util, "getConfigFiles").and.returnValue({
        "base": "/path/to/base.json",
        "tests": [
          "/path/to/test-folder/page.json"
        ]
      });
    });

    afterAll(function(){
      var targetFile = configJSON.scenarios[0].output_file;
      var dirname = path.dirname(targetFile);
      fs.unlink(targetFile);
      fs.rmdir(dirname);
    });

    describe("with css selector", function(){
      beforeAll(function(done){
        configJSON.scenarios[0] = {
          "label": "Test Page",
          "url": "http://www.liputan6.dev:8000",
          "selector": ".navbar--top__logo",
          "output_file": path.join(dirname, outputFile + '.png')
        };
        spyOn(Util, "readConfig").and.returnValue(configJSON);
        BarongLib.capture(done);
      });

      it("can capture the selector", function(){
        var targetFile = configJSON.scenarios[0].output_file;
        var result = fs.existsSync(targetFile);
        expect(result).toBe(true);
      });
    });

    describe("with region selector", function(){
      var targetFile;
      beforeAll(function(done){
        configJSON.scenarios[0] = {
          "label": "Test Page",
          "url": "http://www.liputan6.dev:8000",
          "selector": {
            "top": 0,
            "left": 0,
            "width": 200,
            "height": 400
          },
          "output_file": path.join(dirname, outputFile + '.png')
        };
        targetFile = configJSON.scenarios[0].output_file;
        spyOn(Util, "readConfig").and.returnValue(configJSON);
        BarongLib.capture(done);
      });

      it("can capture a region in a page", function(){
        var result = fs.existsSync(targetFile);
        expect(result).toBe(true);
      });

      it("capture the correct size", function(){
        var dimension = sizeOf(targetFile);
        expect(dimension.width).toEqual(200);
        expect(dimension.height).toEqual(400);
      });
    });

  });

});
