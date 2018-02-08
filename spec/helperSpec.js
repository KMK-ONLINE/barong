"use strict"

var Helper = require("../lib/helper.js");

describe("Helper", function() {

  describe("precisionRound", function(){
    it('should return 212.22', function(){
      var result = Helper.precisionRound(212.2222, 2);
      var expected = 212.22;

      expect(expected).toEqual(result);
    });

    it('should return 0.003', function(){
      var result = Helper.precisionRound(0.0025989, 3);
      var expected = 0.003;

      expect(expected).toEqual(result);
    });
  });

});
