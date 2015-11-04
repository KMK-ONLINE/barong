"use strict"

var fs = require('fs');
var path = require('path');
var sizeOf = require('image-size');
var BarongLib = require('../lib/barongLib.js');
var Util = require('../lib/util.js');

var CONFIG_TMP_FILE = '.barong-config.json';

describe("BarongLib", function(){
  jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;

  describe("saveConfigTmp", function(){
    var tmpPath = path.join(__dirname, CONFIG_TMP_FILE);

    beforeAll(function(){
      if(fs.existsSync(tmpPath)){
        fs.unlink(tmpPath);
      }
    });

    afterAll(function(){
      fs.unlink(tmpPath);
    });

    it("save the config json file to tmp file", function(){
      BarongLib.saveConfigTmp(__dirname, {"base": "/path/base.json"});

      var expected = fs.existsSync(tmpPath);
      expect(expected).toBe(true);
    });
  });

  describe("capture", function(){
    var cwd          = path.join(__dirname, '..');
    var dirname      = path.join(cwd, 'bitmaps_test');
    var outputFile   = Util.generateFilename('Test Page', 'Test Capture');
    var configParams = {
      configFile: 'barong',
      targetFolder: 'reference'
    };

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

    var files = {
      "base": "/path/to/base.json",
      "tests": [
        "/path/to/test-folder/page.json"
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
      var targetFile = configJSON.scenarios[0].captures[0].output_file;
      var targetFolder = path.dirname(targetFile);
      var outputFolder = path.join(targetFolder, '..');

      fs.unlink(targetFile);
      fs.rmdir(targetFolder);
      fs.rmdir(outputFolder);
    });

    describe("with css selector", function(){
      beforeAll(function(done){
        configJSON.scenarios[0] = {
          "label"    : "Test Page",
          "url"      : "http://www.liputan6.dev:8000",
          "captures" : [
            {
              "label": "Test Capture",
              "selector"    : ".navbar--top__logo",
              "output_file" : path.join(dirname, configParams.targetFolder, outputFile + '.png')
            }
          ]
        };

        spyOn(Util, "readConfig").and.returnValue(configJSON);
        BarongLib.capture(cwd, configParams, done);
      });

      it("called Util.readConfig with the correct params", function(){
        expect(Util.readConfig).toHaveBeenCalledWith(cwd, files, configParams.targetFolder);
      });

      it("can capture the selector", function(){
        var targetFile = configJSON.scenarios[0].captures[0].output_file;
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
          "captures": [
            {
              "label": "Test Capture",
              "selector": {
                "top": 0,
                "left": 0,
                "width": 200,
                "height": 400
              },
              "output_file" : path.join(dirname, configParams.targetFolder, outputFile + '.png')
            }
          ]
        };

        targetFile = configJSON.scenarios[0].captures[0].output_file;
        spyOn(Util, "readConfig").and.returnValue(configJSON);
        BarongLib.capture('', configParams, done);
      });

      it("can capture a region in a page", function(){
        var result = fs.existsSync(targetFile);
        expect(result).toBe(true);
        expect(Util.readConfig).toHaveBeenCalledWith('', files, configParams.targetFolder);
      });

      it("capture the correct size", function(){
        var dimension = sizeOf(targetFile);
        expect(dimension.width).toEqual(200);
        expect(dimension.height).toEqual(400);
      });
    });

  });

});
