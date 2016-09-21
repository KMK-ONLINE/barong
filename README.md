# barong
  
   
<img src="./docs/barong.png" alt="crappy barong vector" width="250" />

**It help us see things that cannot be seen with our mortal eyes.**

## Requirement
You will need to have [Node.js](https://nodejs.org/en/) installed.

## Installation
Install using `npm`
```
$ npm install -g barong
$ npm install -g casperjs
$ npm install -g slimerjs
```
This will install `barong`, `casperjs` and `slimerjs` globally.

## Usage
### Create a config file
First thing to do is, you need to create the configuration files. You can use `barong init` to create a sample configuration file.
```
$ barong init

  Config initilized. We've included some sample config file for you to start with.

  barong.json               your main config file
  scenarios/
    capture-selector.json   capture with css selector
    capture-region.json     capture with custom region clip
    custom-viewport.json    change viewport size
    action-hover.json       do hover before capture
    action-click.json       do click before capture
```
This will create the main config file (`barong.json`) and some sample scenarios (`scenarios/*`).

### Do the captures
After you adjust the config file, you can start creating the reference files, by doing:
```
$ barong capture [config]
```
This will run through all your scenarios configuration and do the captures.
