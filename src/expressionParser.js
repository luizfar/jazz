var jazz = jazz || {};

jazz.ExpressionParser = function (lexer, runtime) {
  var functionParser = new jazz.FunctionParser(lexer, runtime, this);
  var classParser = new jazz.ClassParser(lexer, runtime, functionParser, this);
  var objectParser = new jazz.ObjectParser(lexer, runtime, this);
  
  var symbol = jazz.symbol;
  var operations = jazz.operations;
  var util = jazz.util;
  var lang = jazz.lang;
  
  var NULL_EXPRESSION = function () {
    return jazz.lang.Null.NULL_OBJECT;
  };
  
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
  
  function createMessageSend(receiverExpression, methodName, args) {
    return function () {
      var receiver = receiverExpression();
      var method = receiver.getMethod(methodName);
      return method.invoke(receiver, evaluateArguments(args));
    }
  }
  
  function next() {
    lexer.next();
  }
  
  function parseExpression() {
    switch (lexer.token) {
      case symbol.IF:
        return parseIf();
      
      case symbol.RETURN:
        return parseReturn();
      
      case symbol.CLASS:
        return classParser.parseClass();
      
      case symbol.ALERT:
        return parseAlert();
      
      case symbol.LOG:
        return parseLog();
    }
    
    return parseOrExpression();
  }
  
  function parseIf () {
    lexer.next();
    var boolExpression = parseExpression();
    var ifExpression = parseExpression();
    var elseExpression = undefined;
    if (lexer.token === symbol.ELSE) {
      lexer.next();
      elseExpression = parseExpression();
    }
    return function () {
      if (jazz.lang.Boolean.TRUE === boolExpression()) {
        return ifExpression();
      }
      return elseExpression ? elseExpression() : jazz.lang.Null.init();
    };
  }
  
  function parseReturn () {
    lexer.next();
    var expression = parseExpression();
    return function () {
      var returnValue = expression();
      runtime.currentContext.clearExpressions();
      return returnValue;
    };
  }
  
  function parseAlert() {
    lexer.next();
    var expression = parseOrExpression();
    return function () {
      var value = expression();
      alert(value.getMethod("asString").invoke(value).value);
    };
  }
  
  function parseLog() {
    lexer.next();
    var expression = parseOrExpression();
    return function () {
      var value = expression();
      console.log(value.getMethod("asString").invoke(value).value);
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
      
      case symbol.NOT:
        lexer.next();
        var primaryExpression = parsePrimaryExpression();
        expression = function () {
          return jazz.lang.Boolean.init(!primaryExpression().value);
        };
        break;

      default:
        expression = parsePrimaryExpression();
    }
    
    if (!lexer.metEndOfExpression()) {
      var checkForCallOrAccessor = true;
      while (checkForCallOrAccessor) {
        switch (lexer.token) {
          case symbol.DOT:
            expression = parseAccessToProperty(expression);
            break;
          
          case symbol.LEFT_PAR:
            expression = parseFunctionCall(expression);
            break;
          
          case symbol.LEFT_SQR:
            expression = parseListAccess(expression);
            break;
          
          default:
            checkForCallOrAccessor = false;
        }
      }
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
    if (lexer.token === symbol.ASSIGN) {
      lexer.next();
      var rexpression = parseExpression();
      return function () {
        var object = expression();
        var rvalue = rexpression();
        object.properties[propertyName] = rvalue;
        return rvalue;
      };
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
  
  function parseFunctionCall(expression) {
    lexer.next();
    var args = [];
    if (lexer.token !== symbol.RIGHT_PAR) {
      args.push(parseExpression());
      while (lexer.token === symbol.COMMA) {
        lexer.next();
        args.push(parseExpression());
      }
    }
    lexer.checkAndConsumeToken(symbol.RIGHT_PAR);
    return function () {
      var _function = expression();
      return _function.invoke(jazz.lang.Null.init(), evaluateArguments(args));
    };
  }
  
  function parseListAccess(expression) {
    lexer.next();
    var positionExpression = parseExpression();
    lexer.checkAndConsumeToken(symbol.RIGHT_SQR);
    if (lexer.token === symbol.ASSIGN) {
      lexer.next();
      var rexpression = parseExpression();
      return function () {
        var list = expression();
        var position = positionExpression();
        var rvalue = rexpression();
        list.value[position.value] = rvalue;
        return rvalue;
      };
    }
    return function () {
      var list = expression();
      var position = positionExpression();
      return list.value[position.value];
    };
  }
  
  function parseMessageSend(receiverExpression, methodName) {
    lexer.next();
    var args = [];
    if (lexer.token !== symbol.RIGHT_PAR) {
      args = [parseExpression()];
      while (lexer.token === symbol.COMMA) {
        lexer.next();
        args.push(parseExpression());
      }
    }
    lexer.checkAndConsumeToken(symbol.RIGHT_PAR);
    return createMessageSend(receiverExpression, methodName, args);
  }
  
  function parsePrimaryExpression() {
    var value = lexer.token;
    
    if (lexer.tokenIsIdentifier()) {
      return parseVariableExpression();
    }
    if (lexer.tokenIsNumber()) {
      next();
      return functionExpression(jazz.lang.Number.init, util.toNumber(value));
    }
    if (lexer.tokenIsString()) {
      next();
      return functionExpression(jazz.lang.String.init, value);
    }
    if (value === symbol.TRUE || value === symbol.FALSE) {
      next();
      return functionExpression(jazz.lang.Boolean.init, value === symbol.TRUE);
    }
    if (lexer.token === symbol.LEFT_CUR) {
      return objectParser.parseLiteralObject();
    }
    if (lexer.token === symbol.LEFT_SQR) {
      return parseLiteralList();
    }
    if (lexer.token === symbol.LEFT_PAR) {
      if (lexer.isLeftCurAfterNextMatchingRightPar()) {
        return functionParser.parseAnonymousFunction();
      }
      return parseParenthesisExpression();
    }
    if (lexer.token === symbol.NULL) {
      lexer.next();
      return NULL_EXPRESSION;
    }
  }
  
  function parseVariableExpression() {
    var variableName = lexer.token;
    lexer.next();
    if (lexer.token === symbol.ASSIGN) {
      lexer.next();
      var expression = parseExpression();
      return function () {
        var variable = runtime.currentContext.getOrCreate(variableName);
        variable.value = expression();
        return variable.value;
      };
    }
    return function () {
      var variable = runtime.currentContext.get(variableName);
      return variable.value;
    };
  }
  
  function parseLiteralList() {
    lexer.next();
    var listValues = [];
    if (lexer.token !== symbol.RIGHT_SQR) {
      listValues.push(parseExpression());
      while (lexer.token === symbol.COMMA) {
        lexer.next();
        listValues.push(parseExpression());
      }
    }
    lexer.checkAndConsumeToken(symbol.RIGHT_SQR);
    return function () {
      var list = [];
      for (var i = 0; i < listValues.length; ++i) {
        list.push(listValues[i]());
      }
      return jazz.lang.List.init(list);
    };
  }
  
  function parseParenthesisExpression() {
    lexer.next();
    var expression = parseExpression();
    lexer.checkAndConsumeToken(symbol.RIGHT_PAR);
    return function () {
      return expression();
    };
  }
  
  function evaluateArguments(arguments) {
    var argumentsValues = [];
    util.each(arguments, function (argument) {
      argumentsValues.push(argument());
    });
    return argumentsValues;
  }
  
}
