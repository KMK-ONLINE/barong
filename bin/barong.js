#! /usr/bin/env node

"use strict";

var BarongLib = require('../lib/barongLib.js');

var command = process.argv[2];
var cwd = process.cwd();
var configParams = process.argv[3];

if(command === "capture"){
  try {
    BarongLib.capture(cwd, configParams);
  } catch (e) {
    console.log(e);
  }
}
