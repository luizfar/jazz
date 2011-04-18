var jazz = jazz || {};

jazz.ExpressionEvaluator = function (lexer, symbolTable) {
  var symbol = jazz.symbol;
  var operations = jazz.operations;
  var util = jazz.util;
  var lang = jazz.lang;

  var SUM_OPERATORS = [symbol.ADD, symbol.SUBTRACT];
  var SUM_OPERATIONS = ["add", "subtract"];
  var MULTIPLY_OPERATORS = [symbol.MULTIPLY, symbol.DIVIDE, symbol.REMAINDER];
  var MULTIPLY_OPERATIONS = ["multiply", "divide", "remainder"];
  
  this.evaluateExpression = function () {
    return evaluateExpression();
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
      expr = expr.clazz.methods[operations[index]].invoke(expr, [otherExpr]);
      index = util.indexOf(operators, lexer.token);
    }
    return expr;
  }
  
  function next() {
    lexer.next();
  }
  
  function evaluateExpression() {
    return evalSumExpression();
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
      var method = expression.clazz.methods[lexer.token];
      if (!method) {
        util.error("Undefined method '" + lexer.token + "' for object of type '" + expression.type.name + "'.");
      }
      lexer.next();
      var params;
      if (lexer.token === symbol.LEFT_PAR) {
        lexer.next();
        params = [evaluateExpression()];
        while (lexer.token === symbol.COMMA) {
          lexer.next();
          params.push(evaluateExpression());
        }
        lexer.checkToken(symbol.RIGHT_PAR);
        lexer.next();
      }
      expression = method.invoke(expression, params);
    }
    
    return expression;
  }
  
  function parsePrimaryExpression() {
    var value = lexer.token;
    
    if (lexer.tokenIsNumber()) {
      next();
      return jazz.lang.Number.init(util.toNumber(value));
    }
    if (lexer.tokenIsString()) {
      next();
      return jazz.lang.String.init(value);
    }
    if (lexer.tokenIsIdentifier()) {
      var variable = symbolTable.get(lexer.token);
      lexer.next()
      return variable.value;
    }
  }
}
