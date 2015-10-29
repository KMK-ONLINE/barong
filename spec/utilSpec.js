"use strict"

var Util = require("../lib/util.js");
var path = require("path");
var fs = require("fs");
var glob = require("glob");
var assign = require("object-assign");

describe("Util", function() {


  describe("readJSON", function(){

    var testConfig = path.join(__dirname, ".custom-config.json");

    beforeAll(function(){
      var json = {
        "label": "Barong Custom",
        "test_folder": "spec"
      };

      Util.saveFile(testConfig, json);
    });

    afterAll(function(){
      fs.unlinkSync(testConfig);
    });

    it("can read JSON file", function(){
      var result = Util.readJSON(testConfig);
      var expected = {
        "label": "Barong Custom",
        "test_folder": "spec"
      };

      expect(result).toEqual(expected);
    });
  });

  describe("readBaseConfig", function(){
    var configJSON = {
      "label": "Barong Custom",
      "test_folder": "spec"
    };
    var defaultJSON = {
      "test_folder": "spec",
      "scenarios": []
    };

    beforeAll(function(){
      spyOn(Util, "readJSON").and.returnValue(configJSON);
      spyOn(Util, "defaults").and.returnValue(defaultJSON);
    });

    it("can read config file and extend from default params", function() {
      var result = Util.readBaseConfig("/path/to/file.json");
      var expected = {
      "label": "Barong Custom",
        "test_folder": "spec",
        "scenarios": []
      };

      expect(result).toEqual(expected);
    });
  });

  describe("slugify", function(){
    it("can convert given string to url-save characters", function(){
      var string = "unicode ♥ is ☢";
      var result = Util.slugify(string);
      var expected = "unicode-love-is-radioactive";

      expect(result).toEqual(expected);
    });
  });

  describe("generateFilename", function(){
    it("can generate the filename output based on scenario and captures label", function(){
      var scenarioLabel = "Home";
      var captureLabel = "hover on News nav";
      var result = Util.generateFilename(scenarioLabel, captureLabel);
      var expected = "home__hover-on-news-nav";

      expect(result).toEqual(expected);
    });
  });

  describe("testFolder", function(){
    var fakeConfig = {"test_folder": "fake-config-liputan6"};

    beforeAll(function(){
      spyOn(Util, "readJSON").and.returnValue(fakeConfig);
    });

    it("return the test folder of given json file", function(){
      var result = Util.testFolder("/fake.config.json");
      var expected = fakeConfig.test_folder;

      expect(result).toEqual(expected);
    });
  });

  describe("readDir", function(){
    var files = [
      "/path/home.json",
      "/path/category.json"
    ];

    beforeAll(function(){
      spyOn(glob, "sync").and.returnValue(files);
    });

    it("return list of test files in the given path", function(){
      var test_folder = "/liputan6";
      var result = Util.readDir(test_folder);
      var expected = files;

      expect(result).toEqual(expected);
    });
  });

  describe("getConfigFiles", function(){
    var testFolder = "test-folder";

    beforeAll(function(){
      spyOn(Util, "testFolder").and.returnValue(testFolder);
    });

    it("return default config with its test files when the param is empty", function(){
      var configFile = path.join(__dirname, "../config.json");
      var baseDir = path.dirname(configFile);
      var files = [
        path.join(baseDir, testFolder, "page1.json"),
        path.join(baseDir, testFolder, "page2.json")
      ];
      var expected = {
        "base": configFile,
        "tests": files
      };

      spyOn(Util, "readDir").and.returnValue(files);
      var result = Util.getConfigFiles();

      expect(result).toEqual(expected);
    });

    it("return specified config with its tests of the given config param", function(){
      var baseDir = "/test";
      var configParam = "liputan6";
      var configFile = path.join(baseDir, configParam + ".json");
      var files = [
        path.join(baseDir, testFolder, "page1.json"),
        path.join(baseDir, testFolder, "page2.json")
      ];
      var expected = {
        "base": configFile,
        "tests": files
      };

      spyOn(Util, "readDir").and.returnValue(files);
      var result = Util.getConfigFiles(configParam, baseDir);

      expect(result).toEqual(expected);
    });

    it("return full path of specific test file from the given config param", function(){
      var baseDir = "/test";
      var configParam = "liputan6:home";
      var configFile = path.join(baseDir, "liputan6.json");
      var expected = {
        "base": configFile,
        "tests": [
          path.join(baseDir, testFolder, "home.json")
        ]
      };
      var result = Util.getConfigFiles(configParam, baseDir);

      expect(result).toEqual(expected);
    });
  });

  describe("readConfig", function(){
    beforeAll(function(){
      spyOn(Util, "readBaseConfig").and.returnValue({
        "label": "Barong",
        "capture_target": "bitmaps_test",
        "scenarios": []
      });

      spyOn(Util, "readJSON").and.returnValue({
        "label": "Some Page"
      });

    });

    it("can read array of config files", function(){
      var baseDir = "/path/";
      var files = {
        "base": path.join(baseDir, "base.json"),
        "tests": [
          path.join(baseDir, "/test-folder/page.json")
        ]
      };

      var result = Util.readConfig(files);
      var outputFile = Util.generateFilename("Barong", "Some Page");
      var outputPath = path.join(baseDir, "bitmaps_test", outputFile + '.png');

      var expected = {
        "label": "Barong",
        "capture_target": "bitmaps_test",
        "scenarios": [
          {
            "label": "Some Page",
            "outputFile": outputPath
          }
        ]
      };

      expect(result).toEqual(expected);
    });
  });

  describe("saveFile", function(){
    var testSaveTarget = path.join(__dirname, ".test-config.json");

    afterAll(function(){
      fs.unlinkSync(testSaveTarget);
    });

    it("can save json config to file", function(){
      var source = {"test": 1};

      Util.saveFile(testSaveTarget, source);
      var readResult = Util.readJSON(testSaveTarget);

      expect(readResult).toEqual(source);
    });
  });

});
