var jazz = jazz || {};

jazz.SymbolTable = function () {
  var scopes = [];
  var scopeIndex = 0;
  scopes[scopeIndex] = emptyScope();
  
  function emptyScope() {
    return {
      classes: {},
      variables: {}
    };
  }
  
  function currentScope() {
    return scopes[scopeIndex];
  }
  
  this.addClass = function(clazz) {
    currentScope().classes[clazz.name] = {
      type: jazz.lang.Class,
      value: clazz
    };
  };
  
  this.add = function (variable) {
    if (currentScope().variables[variable.name]) {
      jazz.util.error("Identifier '" + variable.name + "' already in use.");
    } else {
      currentScope().variables[variable.name] = variable;
    }
  };
  
  this.getOrCreate = function (variableName) {
    var scope = currentScope();
    var variable = scope.variables[variableName];
    if (!variable) {
      variable = { name: variableName, value: jazz.lang.Null.init() };
      scope.variables[variableName] = variable;
    }
    return variable;
  }
  
  this.get = function (identifier) {
    for (var i = scopeIndex; i >= 0; --i) {
      var variable = scopes[i].variables[identifier];
      if (variable) {
        return variable;
      }
    }
    for (var i = scopeIndex; i >= 0; --i) {
      var clazz = scopes[i].classes[identifier];
      if (clazz) {
        return clazz;
      }
    }
    jazz.util.error("Unknown identifier: " + identifier);
  };
  
  this.addScope = function () {
    scopes[++scopeIndex] = emptyScope();
  };
  
  this.removeScope = function () {
    delete(scopes[scopeIndex]);
    scopeIndex--;
  };
}
