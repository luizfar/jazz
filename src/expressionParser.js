var jazz = jazz || {};

jazz.ExpressionParser = function (lexer, symbolTable) {
  var symbol = jazz.symbol;
  var operations = jazz.operations;
  var util = jazz.util;
  var lang = jazz.lang;

  var OR_OPERATOR = [symbol.OR];
  var OR_OPERATION = ["or"];
  var AND_OPERATOR = [symbol.AND];
  var AND_OPERATION = ["and"];
  var EQUAL_OPERATOR = [symbol.EQUAL];
  var EQUAL_OPERATION = ["equals"];
  var SUM_OPERATORS = [symbol.ADD, symbol.SUBTRACT];
  var SUM_OPERATIONS = ["add", "subtract"];
  var MULTIPLY_OPERATORS = [symbol.MULTIPLY, symbol.DIVIDE, symbol.REMAINDER];
  var MULTIPLY_OPERATIONS = ["multiply", "divide", "remainder"];
  
  this.parseExpressionEvaluator = function () {
    return parseExpression();
  }
  
  function functionExpression(_function, _param) {
    return function () {
      return _function(_param);
    };
  }
  
  function constantExpression(_value) {
    return function () {
      return _value;
    };
  }
  
  function binaryExpression(primaryExpression, operators, operations, resultingType) {
    var expr = primaryExpression();
    var index = util.indexOf(operators, lexer.token);
    while (index != -1) {
      lexer.next();
      var otherExpr = primaryExpression();
      var firstExpr = expr;
      expr = createMessageSend(firstExpr, operations[index], [otherExpr]);
      index = util.indexOf(operators, lexer.token);
    }
    return expr;
  }
  
  function createMessageSend(receiverExpression, methodName, params) {
    return function () {
      var receiver = receiverExpression();
      var method = receiver.clazz.methods[methodName];
      if (!method) {
        util.error("Undefined method '" + methodName + "' for object of type '" + receiver.clazz.name + "'.");
      }
      var paramsValues = [];
      util.each(params, function (paramExpr) {
        paramsValues.push(paramExpr());
      });
      return method.invoke(receiver, paramsValues);
    }
  }
  
  function next() {
    lexer.next();
  }
  
  function parseExpression() {
    switch (lexer.token) {
      case symbol.ALERT:
        return parseAlert();
      
      case symbol.LOG:
        return parseLog();
      
      case symbol.VAR:
        return parseVariableDeclaration();
      
      default:
        return parseOrExpression();
    }
  }
  
  function parseAlert() {
    lexer.next();
    var expression = parseOrExpression();
    return function () {
      var value = expression();
      alert(value.clazz.methods["toString"].invoke(value).value);
    };
  }
  
  function parseLog() {
    lexer.next();
    var expression = parseOrExpression();
    return function () {
      var value = expression();
      console.log(value.clazz.methods["toString"].invoke(value).value);
    }
  }
  
  function parseVariableDeclaration() {
    lexer.next();
    var variableName = lexer.token;
    lexer.next();
    var expression = null;
    if (lexer.token === symbol.ASSIGN) {
      lexer.next();
      expression = parseExpression();
    }
    return function () {
      var variable = {
        name: variableName
      }
      variable.value = expression != null ? expression() : null;
      variable.type = variable.value.clazz;
      symbolTable.add(variable);
      return variable.value;
    };
  }
  
  function parseOrExpression() {
    return binaryExpression(parseAndExpression, OR_OPERATOR, OR_OPERATION, lang.Boolean);
  }
  
  function parseAndExpression() {
    return binaryExpression(parseEqualExpression, AND_OPERATOR, AND_OPERATION, lang.Boolean);
  }
  
  function parseEqualExpression() {
    return binaryExpression(parseSumExpression, EQUAL_OPERATOR, EQUAL_OPERATION, lang.Boolean);
  }
  
  function parseSumExpression() {
    return binaryExpression(parseMultiplyExpression, SUM_OPERATORS, SUM_OPERATIONS, lang.Number);
  }
  
  function parseMultiplyExpression() {
    return binaryExpression(parseUnaryExpression, MULTIPLY_OPERATORS, MULTIPLY_OPERATIONS, lang.Number);
  }
  
  function parseUnaryExpression() {
    var expression;
    switch (lexer.token) {
      case symbol.ADD:
        lexer.next();
        expression = parsePrimaryExpression();
        break;

      case symbol.SUBTRACT:
        lexer.next();
        var primaryExpression = parsePrimaryExpression();
        expression = function () {
          return jazz.lang.Number.init(-primaryExpression().value);
        };
        break;

      default:
        expression = parsePrimaryExpression();
    }
      
    while (lexer.token === symbol.DOT) {
      expression = parseMessageSendTo(expression);
    }
    
    return expression;
  }
  
  function parseMessageSendTo(expression) {  
    lexer.next();
    var methodName = lexer.token;
    lexer.next();
    var params = [];
    if (lexer.token === symbol.LEFT_PAR) {
      lexer.next();
      if (lexer.token !== symbol.RIGHT_PAR) {
        params = [parseExpression()];
        while (lexer.token === symbol.COMMA) {
          lexer.next();
          params.push(parseExpression());
        }
      }
      lexer.checkAndConsumeToken(symbol.RIGHT_PAR);
    }
    return createMessageSend(expression, methodName, params);
  }
  
  function parsePrimaryExpression() {
    var value = lexer.token;
    
    if (lexer.tokenIsNumber()) {
      next();
      return functionExpression(jazz.lang.Number.init, util.toNumber(value));
    }
    if (value === symbol.TRUE || value === symbol.FALSE) {
      next();
      return functionExpression(jazz.lang.Boolean.init, value === symbol.TRUE);
    }
    if (lexer.tokenIsString()) {
      next();
      return functionExpression(jazz.lang.String.init, value);
    }
    if (lexer.tokenIsIdentifier()) {
      var variableName = lexer.token;
      lexer.next();
      return function () {
        var variable = symbolTable.get(variableName);
        return variable.value;
      };
    }
  }
}
