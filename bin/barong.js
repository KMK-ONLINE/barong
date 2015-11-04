#! /usr/bin/env node

"use strict";

var BarongLib = require('../lib/barongLib.js');
var dashdash = require('dashdash');

var options = [
  {
    names: ['help', 'h'],        // first name is opts key
    type: 'bool',
    help: 'Print this help and exit.'
  },
  {
    names: ['save', 's'],
    type: 'string',
    help: 'Save to target folder.',
  default: 'reference'
  }
];
var parser = dashdash.createParser({options: options});

try {
  var opts = parser.parse(process.argv);
} catch (e) {
  console.error('Barong error: %s', e.message);
  process.exit(1);
}

var cwd = process.cwd();
var command = opts._args[0] || 'capture';

var configParams = {
  configFile: opts._args[1] || 'barong',
  targetFolder: opts.save
}

if (opts.help) {
  var help = parser.help({includeEnv: true}).trimRight();
  console.log(
    'usage: \n    barong (capture|test) [CONFIG_NAME] [OPTIONS]\n'
    + 'default: \n    barong capture barong \n'
    + 'options:\n'
    + help);
  process.exit(0);
}

if(command === "capture"){
  try {
    BarongLib.capture(cwd, configParams);
  } catch (e) {
    console.log(e.stack);
  }
}

