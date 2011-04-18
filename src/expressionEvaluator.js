var jazz = jazz || {};

jazz.ExpressionEvaluator = function (lexer, symbolTable) {
  var symbol = jazz.symbol;
  var operations = jazz.operations;
  var util = jazz.util;
  var lang = jazz.lang;

  var SUM_OPERATORS = [symbol.ADD, symbol.SUBTRACT];
  var SUM_OPERATIONS = [operations.add, operations.subtract];
  var MULTIPLY_OPERATORS = [symbol.MULTIPLY, symbol.DIVIDE, symbol.REMAINDER];
  var MULTIPLY_OPERATIONS = [operations.multiply, operations.divide, operations.remainder];
  
  this.evaluateExpression = function () {
    return evalSumExpression();
  }
  
  function expression(_type, _value) {
    return {
      type: _type,
      value: _value
    };
  }
  
  function binaryExpression(primaryExpression, operators, operations, resultingType) {
    var expr = primaryExpression();
    var index = util.indexOf(operators, lexer.token);
    while (index != -1) {
      lexer.next();
      var otherExpr = primaryExpression();
      expr = expression(resultingType, operations[index](expr, otherExpr));
      index = util.indexOf(operators, lexer.token);
    }
    return expr;
  }
  
  function next() {
    lexer.next();
  }
  
  function evalSumExpression() {
    return binaryExpression(evalMultiplyExpression, SUM_OPERATORS, SUM_OPERATIONS, lang.Number);
  }
  
  function evalMultiplyExpression() {
    return binaryExpression(evalUnaryExpression, MULTIPLY_OPERATORS, MULTIPLY_OPERATIONS, lang.Number);
  }
  
  function evalUnaryExpression() {
    var expression = parsePrimaryExpression();
    
    while (lexer.token === symbol.DOT) {
      lexer.next();
      var method = expression.type.methods[lexer.token];
      if (!method) {
        util.error("Undefined method '" + lexer.token + "' for object of type '" + expression.type.name + "'.");
      }
      expression = method.invoke(expression.value);
      lexer.next();
    }
    
    return expression;
  }
  
  function parsePrimaryExpression() {
    var value = lexer.token;
    
    if (lexer.tokenIsNumber()) {
      next();
      return expression(lang.Number, util.toNumber(value));
    }
    if (lexer.tokenIsString()) {
      next();
      return expression(lang.String, value);
    }
    if (lexer.tokenIsIdentifier()) {
      var variable = symbolTable.get(lexer.token);
      lexer.next()
      return expression(variable.type, variable.value);
    }
  }
}
