#! /usr/bin/env node

"use strict";

var BarongLib = require('../lib/barongLib.js');
var dashdash = require('dashdash');

var cwd = process.cwd();
var command = process.argv[2];

var options = [
  {
    names: ['save', 's'],
    type: 'string',
    save: 'Save to target folder.',
    default: 'reference'
  }
];

try {
  var opts = dashdash.parse({options: options});
} catch (e) {
  console.error('Barong error: %s', e.message);
  process.exit(1);
}

var configParams = {
  configFile: process.argv[3] || 'barong',
  targetFolder: opts.save
}

if(command === "capture"){
  try {
    BarongLib.capture(cwd, configParams);
  } catch (e) {
    console.log(e.stack);
  }
}
