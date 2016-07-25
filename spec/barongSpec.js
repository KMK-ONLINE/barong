"use strict"

var fs = require('fs');
var path = require('path');
var sizeOf = require('image-size');
var Barong = require('../lib/barong.js');
var Util = require('../lib/util.js');

var CONFIG_TMP_FILE = '.barong-config.json';

describe("Barong", function(){
  jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;

  describe("saveConfigTmp", function(){
    var tmpPath = path.join(__dirname, CONFIG_TMP_FILE);

    beforeAll(function(){
      if(fs.existsSync(tmpPath)){
        fs.unlinkSync(tmpPath);
      }
    });

    afterAll(function(){
      fs.unlinkSync(tmpPath);
    });

    it("save the config json file to tmp file", function(){
      Barong.saveConfigTmp(__dirname, {"base": "/path/base.json"});

      var expected = fs.existsSync(tmpPath);
      expect(expected).toBe(true);
    });
  });

  describe("getConfigJSON", function(){
    var cwd = __dirname;
    var configParams = '';

    it("throw error when file not found", function(){
      spyOn(Util, 'getConfigFiles').and.returnValue(false);

      var result = function() {
        Barong.getConfigJSON(cwd, configParams);
      };
      var expected = "Config file not found";

      expect(result).toThrowError(expected);
    });

    it("should have called when file exists", function(){
      spyOn(Util, 'getConfigFiles').and.returnValue(true);
      spyOn(Util, 'readConfig').and.returnValue(true);
      Barong.getConfigJSON(cwd, configParams);

      expect(Util.readConfig).toHaveBeenCalled();
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

      fs.unlinkSync(targetFile);
      fs.rmdirSync(targetFolder);
      fs.rmdirSync(outputFolder);
    });

    describe("with css selector", function(){
      beforeAll(function(done){
        configJSON.scenarios[0] = {
          "label"    : "Test Page",
          "url"      : "https://github.com/KMK-ONLINE/barong",
          "captures" : [
            {
              "label"       : "Test Capture",
              "selector"    : "article.markdown-body",
              "output_file" : path.join(dirname, configParams.targetFolder, outputFile + '.png')
            }
          ]
        };

        spyOn(Util, "readConfig").and.returnValue(configJSON);
        Barong.capture(cwd, configParams, done);
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
          "label"     : "Test Page",
          "url"       : "https://github.com/KMK-ONLINE/barong",
          "captures"  : [
            {
              "label" : "Test Capture",
              "selector": {
                "top"   : 0,
                "left"  : 0,
                "width" : 200,
                "height": 400
              },
              "output_file" : path.join(dirname, configParams.targetFolder, outputFile + '.png')
            }
          ]
        };

        targetFile = configJSON.scenarios[0].captures[0].output_file;
        spyOn(Util, "readConfig").and.returnValue(configJSON);
        Barong.capture('', configParams, done);
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

  describe("compareDir", function(){
    var cwd = __dirname;
    var refDir = path.join(__dirname, '.reference');
    var testDir = path.join(__dirname, '.test');
    var testDir2 = path.join(__dirname, '.test2');

    beforeAll(function(){
      var json = {};
      fs.mkdirSync(refDir);
      Util.saveFile(path.join(__dirname, '.reference', 'a.png'), json);
      Util.saveFile(path.join(__dirname, '.reference', 'b.png'), json);

      fs.mkdirSync(testDir);
      fs.mkdirSync(testDir2);
      Util.saveFile(path.join(__dirname, '.test', 'a.png'), json);
      Util.saveFile(path.join(__dirname, '.test', 'b.png'), json);
    });

    afterAll(function(){
      fs.unlinkSync(path.join(__dirname, '.test', 'a.png'));
      fs.unlinkSync(path.join(__dirname, '.test', 'b.png'));
      fs.unlinkSync(path.join(__dirname, '.reference', 'a.png'));
      fs.unlinkSync(path.join(__dirname, '.reference', 'b.png'));
      fs.rmdirSync(refDir);
      fs.rmdirSync(testDir);
      fs.rmdirSync(testDir2);
    });

    it("turn json comparison data", function(){
      var expected = [
        {
          test : '.test/a.png',
          ref : '.reference/a.png',
        },
        {
          test : '.test/b.png',
          ref : '.reference/b.png',
        }
      ];
      var result = Barong.compareDir(cwd, '.test', '.reference');
      expect(result).toEqual(expected);
    });

    it("throw error when test directory is not exists", function(){
      var result = function(){
        Barong.compareDir(cwd, '.fakedir', '.reference');
      };
      var expected = "Test directory not found";
      expect(result).toThrowError(Error, expected);
    });

    it("throw error when reference directory is not exists", function(){
      var result = function(){
        Barong.compareDir(cwd, '.test', '.fakedir');
      };
      var expected = "Reference directory not found";
      expect(result).toThrowError(expected);
    });

    it("throw error if no files inside test directory", function(){
      var result = function(){
        Barong.compareDir(cwd, '.test2', '.reference');
      };
      var expected = "No images found in test directory";
      expect(result).toThrowError(expected);
    });
  });

  describe("test", function(){
    var cwd = __dirname;
    var refDir = 'test/path';

    beforeEach(function(){
      spyOn(Barong, 'getConfigJSON').and.returnValue({
        "captureTarget": 'test'
      });
      spyOn(Barong, 'compare').and.returnValue(true);
      spyOn(Barong, 'capture').and.callFake(function() {
        Barong.compare(cwd, 'test/test', refDir);
      });
    });

    it("test should be call capture method", function(){
      var config = {configFile:"barong", targetFolder:"test"};
      var result = Barong.test(cwd, config, refDir);
      expect(Barong.getConfigJSON).toHaveBeenCalledWith(cwd, config);
      expect(Barong.compare).toHaveBeenCalledWith(cwd, 'test/test', refDir);
      expect(Barong.capture).toHaveBeenCalled();
    });
  });

});
