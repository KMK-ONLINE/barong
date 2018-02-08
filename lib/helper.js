"use strict"

var Helper = {
  precisionRound: function(number, precision){
    var factor = Math.pow(10, precision);
    return Math.round(number * factor) / factor;
  }
};

module.exports = Helper;
