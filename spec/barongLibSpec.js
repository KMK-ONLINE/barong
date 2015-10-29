"use strict"

var fs = require('fs');
var path = require('path');
var BarongLib = require('../lib/barongLib.js');
var Util = require('../lib/util.js');

describe("BarongLib", function(){
  jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000;

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
        {
          "label": "Test Page",
          "url": "http://liputan6.com",
          "selector": ".navbar--top__logo",
          "output_file": path.join(dirname, outputFile + '.png')
        }
      ]
    };

    beforeAll(function(){
      spyOn(Util, "getConfigFiles").and.returnValue({
        "base": "/path/to/base.json",
        "tests": [
          "/path/to/test-folder/page.json"
        ]
      });

      spyOn(Util, "readConfig").and.returnValue(configJSON);
    });

    afterAll(function(){
      var targetFile = configJSON.scenarios[0].output_file;
      var dirname = path.dirname(targetFile);
      fs.unlink(targetFile);
      fs.rmdir(dirname);
    });

    it("can capture a selector in a page", function(done){
      BarongLib.capture(done);

      var targetFile = configJSON.scenarios[0].output_file;
      var result = fs.existsSync(targetFile);
      expect(result).toBe(true);
    });
  });

});
