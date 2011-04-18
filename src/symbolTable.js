var jazz = jazz || {};

jazz.SymbolTable = function () {
  var classes = {};
  var variables = {};
  
  this.addClass = function(clazz) {
    classes[clazz.name] = {
      type: jazz.ast.classClass,
      value: clazz
    };
  }
  
  this.add = function (variable) {
    variables[variable.name] = variable;
  }
  
  this.get = function (identifier) {
    var variable = variables[identifier];
    if (variable === undefined) {
      variable = classes[identifier];
      if (variable === undefined) {
        jazz.util.error("Variable '" + identifier + "' undefined.");
      }
    }
    return variable;
  }
}
