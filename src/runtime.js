var jazz = jazz || {};

jazz.Runtime = function () {
  var contexts = [];
  var contextIndex = 0;
  var currentContext = emptyContext();
  
  contexts[contextIndex] = currentContext;
  
  function emptyContext() {
    return {
      variables: {},
      expressions: [],
      exprIndex: undefined
    };
  }
  
  this.addClass = function(clazz) {
    this.add({
      type: jazz.lang.Class,
      value: clazz,
      name: clazz.name
    });
  };
  
  this.add = function (variable) {
    if (currentContext.variables[variable.name]) {
      jazz.util.error("Identifier '" + variable.name + "' already in use.");
    } else {
      currentContext.variables[variable.name] = variable;
    }
  };
  
  this.getOrCreate = function (variableName) {
    var variable = currentContext.variables[variableName];
    if (!variable) {
      variable = { name: variableName, value: jazz.lang.Null.init() };
      currentContext.variables[variableName] = variable;
    }
    return variable;
  }
  
  this.get = function (identifier) {
    for (var i = contextIndex; i >= 0; --i) {
      var variable = contexts[i].variables[identifier];
      if (variable) {
        return variable;
      }
    }
    jazz.util.error("Unknown identifier: " + identifier);
  };
  
  this.setExpressions = function (expressions) {
    currentContext.expressions = expressions;
    currentContext.exprIndex = 0;
  };
  
  this.removeExpression = function () {
    return currentContext.expressions[currentContext.exprIndex++];
  };
  
  this.clearExpressions = function () {
    currentContext.exprIndex = currentContext.expressions.length;
  }
  
  this.addContext = function () {
    currentContext = emptyContext();
    contexts[++contextIndex] = currentContext;
  };
  
  this.removeContext = function () {
    currentContext = contexts[--contextIndex];
    delete contexts[contextIndex + 1];
  };
}
