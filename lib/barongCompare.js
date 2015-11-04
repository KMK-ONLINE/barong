"use strict"

// var resemble = require('node-resemble-js');
var Util     = require('./util.js');
var path     = require('path');
var fs       = require('fs');
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
          throw new Error("Can't compare not existing file");
        }

        fileA = fileA.split(captureTarget)[1];
        fileB = fileB.split(captureTarget)[1];

        imageList.push([fileA, fileB]);

        // resemble(fileA).compareTo(fileB).ignoreColors().onComplete(function(data){
        //   // console.log(data);
        //   console.log(data);
        // })
      }
    }

    this.buildHtml(cwd, captureTarget, imageList);
    var options = {
      root: path.join(cwd, captureTarget)
    };
    http.createServer(options).listen(8080);
    console.log('Running on localhost:8080');
  },

  buildHtml: function(cwd, captureTarget, imageList) {
    var html = '<html>';
    html += '<head>';
    html += '<script src="https://cdn.rawgit.com/Huddle/Resemble.js/master/resemble.js"></script>';
    html += '<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.4/jquery.min.js"></script>';
    html += '</head>';
    html += '<body>';
    html += '<table>';
    imageList.forEach(function(image, index){
      html += '<tr id="row_' + index + '">';
        html += '<td>';
        html += '<img src="'+image[0]+'" />';
        html += '</td>';
        html += '<td>';
        html += '<img src="'+image[1]+'" />';
        html += '</td>';
        html += '<td id="col_diff_' + index + '">';
        html += '</td>';
      html += '</tr>';
    });
    html += '</table>';
    html += '</body>';
    html += '<script> \
      $("tr").each(function(index, item){  \
  var imageA = $(item).find("img")[0].src; \
  var imageB = $(item).find("img")[1].src; \
  resemble(imageA).compareTo(imageB).onComplete(function(data) { \
    var image = new Image(); \
    image.src = data.getImageDataUrl(); \
    $("#col_diff_" + index).append(image); \
  }); \
}); \
    </script>';
    html += '</html>';
    fs.writeFileSync(path.join(cwd, captureTarget, 'index.html'), html, "utf8");
  }
};


module.exports = BarongCompare;

