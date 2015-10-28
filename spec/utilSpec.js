"use strict"

var Util = require('../lib/util.js');
var path = require('path');
var fs = require('fs');
var assign = require('object-assign');
var stringify = require('json-stable-stringify');

describe("Util", function() {
  
  var testSaveTarget = path.join(__dirname, ".test-config.json");
  var testCustomConfig = path.join(__dirname, ".custom-config.json");
  
  var config = {
    "label": "Barong Default",
    "engine" : "slimerjs",
    "viewports": {
      "width":  1400,
      "height": 2000
    },
    "test_folder": "test",
    "capture_target": "bitmaps_test",
    "scenarios": []
  };
  
  afterAll(function(){
    fs.unlinkSync(testSaveTarget);
    fs.unlinkSync(testCustomConfig);
  });

  it('can read JSON file', function(){
    var configFile = path.normalize(__dirname + '/../config.json');
    var result = Util.readJSON(configFile);
    var expected = {
      "label": "Barong Default",
      "test_folder": "test"
    };

    expect(result).toEqual(expected);
  });

  it("can read the config file and extend from default params", function() {
    var result = Util.readBaseConfig();
    var expected = config;

    expect(result).toEqual(expected);
  });

  it("can read the custom config file and extend from default params", function() {
    var customConfigJSON = {
      "label": "Barong Custom",
      "test_folder": "spec"
    };
    Util.saveFile(testCustomConfig, customConfigJSON);

    var result = stringify(Util.readBaseConfig(testCustomConfig));
    var expected = {};
    
    assign(expected, config, customConfigJSON);
    expected = stringify(expected);

    expect(result).toEqual(expected);
  });

  it("can get test folder", function(){
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

  it("can append scenarios[] with specific *.js file inside the test folder", function(){
    // TODO: need to be able to do something like the following:
    // > barong config.json/liputan6-logo.json
    // meaning, it read the test_folder inside the config.json first, to locate
    // the liputan6-logo.json. The it put the liputan6-logo.json inside the 
    // config.json scenario
    //
    // var result = Util.readSpecificConfig('config.json/liputan6-logo.json');
    
    var result = Util.readSpecificConfig('liputan6-logo.json');
    var expected =  Util.readBaseConfig();
    expected.scenarios = expected.scenarios.concat([{
      "label": "Liputan6",
      "url": "http://www.liputan6.dev:8000",
      "captures": [
        {
          "label": "Logo",
          "selectors": [".navbar--top__logo"]
        }
      ]
    }]);

    expect(result).toEqual(expected);
  });

  it("can append scenarios[] with all *.js file inside the test folder", function(){
    var result = Util.readConfig();
    var expected = config;

    expected.scenarios = expected.scenarios.concat([{
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
    }]);

    expected.scenarios = expected.scenarios.concat([{
      "label": "Liputan6",
      "url": "http://www.liputan6.dev:8000",
      "captures": [
        {
          "label": "Logo",
          "selectors": [".navbar--top__logo"]
        }
      ]
    }]);

    expect(result).toEqual(expected);
  });


  it("can save json config to file", function(){
    var source = {"test": 1};
    
    Util.saveFile(testSaveTarget, source);
    var readResult = Util.readJSON(testSaveTarget);

    expect(readResult).toEqual(source);
  })


});
