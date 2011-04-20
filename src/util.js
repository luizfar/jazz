var jazz = jazz || {};
jazz.util = (function () {
  var self = {};
  
  self.error = function (errorMessage) {
    console.error(errorMessage);
    throw errorMessage;
  };
  
  self.each = function (array, callback) {
    for (var i = 0; i < array.length; ++i) {
      callback(array[i], i);
    }
  };
  
  self.isNumber = function (value) {
    return !isNaN(value);
  };
  
  self.toNumber = function (value) {
    return parseFloat(value);
  };
  
  self.indexOf = function (array, value) {
    for (var i = 0; i < array.length; ++i) {
      if (array[i] === value) {
        return i;
      }
    }
    return -1;
  };
  
  self.contains = function (array, value) {
    return self.indexOf(array, value) !== -1;
  };
  
  return self;
})();
