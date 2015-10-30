#! /usr/bin/env node

"use strict";

var BarongLib = require('../lib/barongLib.js');

var command = process.argv[2];

if(command === "capture"){
  BarongLib.capture();
}
console.log("Wraaarrrhh!!");
