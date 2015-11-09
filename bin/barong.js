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
      console.log(e.stack);
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
      console.log(e.stack);
    }
  });

program
  .command('compare <testDir> <referenceDir>')
  .description('compare <testDir> with <referenceDir>')
  .action(function(testDir, referenceDir, options){
    try {
      Barong.compare(cwd, testDir, referenceDir);
    } catch (e) {
      console.error(e.stack);
    }
  });

program.parse(process.argv);
if (!program.args.length) program.help();
