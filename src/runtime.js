var jazz = jazz || {};

jazz.Runtime = function () {
  function Context() {
    this.properties = {};
    this.expressions = [];
    this.exprIndex = 0;
    
    this.addClass = function(clazz) {
      this.add({
        type: jazz.lang.Class,
        value: clazz,
        name: clazz.name
      });
    };
    
    this.add = function (variable) {
      this.properties[variable.name] = variable;
    };
    
    this.tryToGet = function (identifier) {
      return this.properties[identifier] || (this.parent && this.parent.tryToGet(identifier));
    };
    
    this.getOrCreate = function (variableName) {
      var variable = this.tryToGet(variableName);
      if (!variable) {
        variable = { name: variableName, value: jazz.lang.Null.init() };
        this.properties[variableName] = variable;
      }
      return variable;
    };
    
    this.get = function (identifier) {
      var variable = this.tryToGet(identifier);
      if (!variable) {
        jazz.util.error("Unknown identifier: " + identifier);
      }
      return variable;
    };
    
    this.setExpressions = function (expressions) {
      this.expressions = expressions;
      this.exprIndex = 0;
    };
    
    this.removeExpression = function () {
      return this.expressions[this.exprIndex++];
    };
    
    this.clearExpressions = function () {
      this.exprIndex = this.expressions.length;
    };
  }
  
  this.GLOBAL_CONTEXT = new Context();
  this.currentContext = this.GLOBAL_CONTEXT;
  
  this.newContext = function () {
    return new Context();
  };
}
