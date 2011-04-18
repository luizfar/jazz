var jazz = jazz || {};

jazz.operations = (function () {
  var self = {};
  
  self.add = function (expression1, expression2) {
    return expression1.value + expression2.value;
  };

  self.subtract = function (expression1, expression2) {
    return expression1.value - expression2.value;
  };

  self.multiply = function (expression1, expression2) {
    return expression1.value * expression2.value;
  };
  
  self.divide = function (expression1, expression2) {
    return expression1.value / expression2.value;
  };
  
  self.remainder = function (expression1, expression2) {
    return expression1.value % expression2.value;
  };
  
  return self;
})();
