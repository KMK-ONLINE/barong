#! /usr/bin/env node

"use strict";

var Barong  = require('../lib/barong.js');
var program = require('commander');
var cwd     = process.cwd();

program
  .version('0.1.0')
  .command('capture [config]')
  .option('-s, --save <dir>', 'save output to specified directory, the default value is `reference`', 'reference')
  .description('capture pages based on provided [config].json file, the default value is `barong`')
  .action(function(config, options){
    if(!config){
      config = 'barong';
    }

    try {
      Barong.capture(cwd, {
        configFile: config,
        targetFolder: options.save
      });
    } catch (e) {
      console.error(e);
    }
  });

program
  .command('test [config]')
  .option('-a, --against <dir>', 'test to specified directory, the default value is `reference`', 'reference')
  .option('-s, --save <dir>', 'save output to specified directory, the default value is `test`', 'test')
  .description('test pages and do comparison')
  .action(function(config, options){
    if(!config){
      config = 'barong';
    }

    try {
      Barong.test(cwd, {
        configFile: config,
        targetFolder: options.save
      }, options.against);
    } catch (e) {
      console.error(e);
    }
  });

program
  .command('compare')
  .option('-t, --test-dir [testDir]', 'Test directory')
  .option('-r, --ref-dir [refDir]', 'Reference directory')
  .description('compare --test-dir capture_results/test --ref-dir capture_results/reference')
  .action(function(options){
    try {
      var testDir = options.testDir || 'capture_results/test';
      var refDir = options.refDir || 'capture_results/reference';
      Barong.compare(cwd, testDir, refDir);
    } catch (e) {
      console.error(e);
    }
  });

program
  .command('init')
  .description('create sample config file')
  .action(function(){
    try {
      Barong.init(cwd);
    } catch (e) {
      console.error(e);
    }
  });

program.parse(process.argv);
if (!program.args.length) program.help();
