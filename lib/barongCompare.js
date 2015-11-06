"use strict"

var handlebars = require('node-handlebars');
var Util       = require('./util.js');
var path       = require('path');
var fs         = require('fs');
var http       = require('http-server');

var BarongCompare = {

  compare: function(cwd, configFile, folderA, folderB) {

    var files = Util.getConfigFiles(cwd, configFile);
    if(!files) {
      throw new Error("Config file not found.");
      return false;
    }
    var configA = Util.readConfig(cwd, files, folderA);
    var configB = Util.readConfig(cwd, files, folderB);
    var imageList = [];

    var n_scenarios = configA.scenarios.length;
    var captureTarget = configA.capture_target;

    for(var i=0; i<n_scenarios; i++) {
      var n_captures = configA.scenarios[i].captures.length;
      for(var j=0; j<n_captures; j++) {
        var fileA = configA.scenarios[i].captures[j].output_file;
        var fileB = configB.scenarios[i].captures[j].output_file;

        if (!fs.existsSync(fileA) || !fs.existsSync(fileB)) {
          throw new Error("Can't compare non existing file");
        }

        fileA = fileA.split(captureTarget)[1];
        fileB = fileB.split(captureTarget)[1];

        imageList.push({
          fileA: fileA,
          fileB: fileB
        });
      }
    }

    var templateLocation = path.join(__dirname, '..', 'templates', 'template.html');
    var indexLocation = path.join(cwd, captureTarget, 'index.html');

    var options = {
      root: path.join(cwd, captureTarget)
    };

    this.buildHtml(templateLocation, indexLocation, imageList, folderA, folderB);
    http.createServer(options).listen(8080);
    console.log('Running on localhost:8080');
  },

  buildHtml: function(templateLocation, indexLocation, imageList, folderA, folderB) {
    var hbs = handlebars.create();
    hbs.engine(templateLocation, {imageList: imageList, folderA: folderA, folderB: folderB}, function(err, html) {
      if (err) {
        throw err;
      }
      fs.writeFileSync(indexLocation, html, "utf8");
    });
  }
};


module.exports = BarongCompare;

