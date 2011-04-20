var jazz = jazz || {};

jazz.ExpressionParser = function (lexer, symbolTable) {
  var classParser = new jazz.ClassParser(lexer, symbolTable, this);
  
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
      var method = receiver.getMethod(methodName);
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
      case symbol.CLASS:
        return classParser.parseClass();
      
      case symbol.ALERT:
        return parseAlert();
      
      case symbol.LOG:
        return parseLog();
    }
    
    return parseOrExpression();
  }
  
  function parseAlert() {
    lexer.next();
    var expression = parseOrExpression();
    return function () {
      var value = expression();
      alert(value.getMethod("toString").invoke(value).value);
    };
  }
  
  function parseLog() {
    lexer.next();
    var expression = parseOrExpression();
    return function () {
      var value = expression();
      console.log(value.getMethod("toString").invoke(value).value);
    }
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
      expression = parseAccessToProperty(expression);
    }
    
    return expression;
  }
  
  function parseAccessToProperty(expression) {  
    lexer.next();
    var propertyName = lexer.token;
    lexer.next();
    if (lexer.token === symbol.LEFT_PAR) {
      return parseMessageSend(expression, propertyName);
    }
    return function () {
      var object = expression();
      var property = object.properties[propertyName];
      if (!property) {
        util.error("Object of class '" + object.clazz.name + "' has no property named '" + propertyName + "'");
      }
      return property;
    };
  }
  
  function parseMessageSend(receiverExpression, methodName) {
    lexer.next();
    var params = [];
    if (lexer.token !== symbol.RIGHT_PAR) {
      params = [parseExpression()];
      while (lexer.token === symbol.COMMA) {
        lexer.next();
        params.push(parseExpression());
      }
    }
    lexer.checkAndConsumeToken(symbol.RIGHT_PAR);
    return createMessageSend(receiverExpression, methodName, params);
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
      return parseVariableExpression();
    }
    if (lexer.token === symbol.LEFT_CUR) {
      return parseObjectDefinition();
    }
    if (lexer.token === symbol.LEFT_PAR) {
      return parseAnonymousFunction();
    }
  }
  
  function parseVariableExpression() {
    var variableName = lexer.token;
    lexer.next();
    if (lexer.token === symbol.ASSIGN) {
      lexer.next();
      var expression = parseExpression();
      return function () {
        var variable = symbolTable.getOrCreate(variableName);
        variable.value = expression();
      };
    }
    return function () {
      var variable = symbolTable.get(variableName);
      return variable.value;
    };
  }
  
  function parseObjectDefinition() {
    lexer.next();
    var properties = {};
    while (lexer.token !== symbol.RIGHT_CUR) {
      lexer.expectIdentifier();
      var propertyName = lexer.token;
      lexer.next();
      lexer.checkAndConsumeToken(symbol.ASSIGN);
      properties[propertyName] = parseExpression();
    }
    lexer.next();
    return function () {
      var object = jazz.lang.Object.init(jazz.lang.Object);
      object.properties = properties;
      for (property in properties) {
        object.properties[property] = object.properties[property]();
      }
      return object;
    };
  }
  
  function parseAnonymousFunction() {
    lexer.next();
    lexer.checkAndConsumeToken(symbol.RIGHT_PAR);
    var _function = jazz.lang.Function.init("Object[Function]", []);
    var expressions = [];
    lexer.checkAndConsumeToken(symbol.LEFT_CUR);
    while (lexer.token !== symbol.RIGHT_CUR) {
      expressions.push(parseExpression());
    }
    lexer.next();
    _function.invoke = function (receiver, args) {
      symbolTable.addScope();
      var lastValue = jazz.lang.Null.init();
      util.each(expressions, function (expression) {
        lastValue = expression();
      });
      symbolTable.removeScope();
      return lastValue;
    }
    return function () {
      return _function;
    };
  }
}
