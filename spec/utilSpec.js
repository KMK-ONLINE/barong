"use strict"

var Util = require('../lib/util.js');
var path = require('path');

describe("Util", function() {
  var config = {
    "engine" : "slimerjs",
    "viewports": {
      "width":  1400,
      "height": 2000
    },
    "test_folder": "test",
    "capture_target": "bitmaps_test",
    "scenarios": []
  };

  it('can read JSON file', function(){
    var configFile = path.normalize(__dirname + '/../config.json');
    var result = Util.readJSON(configFile);
    var expected = {
      "test_folder": "test"
    };

    expect(result).toEqual(expected);
  });

  it("can read the config file and extend from default params", function() {
    var result = Util.readBaseConfig();
    var expected = config;

    expect(result).toEqual(expected);
  });

  it("can get the default test folder", function(){
    var result = Util.testFolder();
    var expected = path.normalize(__dirname + '/../test');

    expect(result).toEqual(expected);
  });

  it("can convert given string to url-save characters", function(){
    var string = 'unicode ♥ is ☢';
    var result = Util.slugify(string);
    var expected = 'unicode-love-is-radioactive';

    expect(result).toEqual(expected);
  });

  it("can generate the filename output based on scenario and captures label", function(){
    var scenarioLabel = 'Home';
    var captureLabel = 'hover on News nav';
    var result = Util.generateFilename(scenarioLabel, captureLabel);
    var expected = 'home__hover-on-news-nav';

    expect(result).toEqual(expected);
  });

  it("can append scenarios[] with all *.js file inside the test folder", function(){
    var result = Util.readConfig();
    var expected = config;
    expected.scenarios.push({
      "label": "Home",
      "url": "http://www.liputan6.dev:8000",
      "captures": [
        {
          "label": "hover on News nav",
          "before_capture": {
            "action": "hover",
            "selector": "#category-2"
          },
          "selectors": [{
            "left": 200,
            "top": 0,
            "height": 300,
            "width": 300
          }]
        }
      ],
      "misMatchThreshold" : 1.0
    });

    expect(result).toEqual(expected);
  });

});
