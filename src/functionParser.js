var jazz = jazz || {};

jazz.FunctionParser = function (lexer, runtime, expressionParser) {
  var util = jazz.util;
  var symbol = jazz.symbol;
  
  var functionParentContext = runtime.GLOBAL_CONTEXT;
  
  this.parseMethod = function () {
    lexer.checkAndConsumeToken(symbol.DEF);
    lexer.expectIdentifier();
    var method = jazz.lang.Function.init(lexer.token);
    lexer.next();
    
    return parseIt(method);
  };
  
  this.parseAnonymousFunction = function () {
    var _function = jazz.lang.Function.init("Object[Function]");
    parseIt(_function);
    
    return function() {
      return _function;
    };
  };
  
  function parseIt(_function) {
    _function.params = [];
    if (lexer.token === symbol.LEFT_PAR) {
      lexer.next();
      if (lexer.token !== symbol.RIGHT_PAR) {
        parseParameter(_function);
        while (lexer.token === symbol.COMMA) {
          lexer.next();
          parseParameter(_function);
        }
      }
      lexer.checkAndConsumeToken(symbol.RIGHT_PAR);
    }
    
    _function.context = runtime.newContext();
    _function.context.parent = functionParentContext;
    functionParentContext = _function.context;
    
    lexer.checkAndConsumeToken(symbol.LEFT_CUR);
    _function.expressions = [];
    while (lexer.token !== symbol.RIGHT_CUR) {
      _function.expressions.push(expressionParser.parseExpressionEvaluator());
    }
    lexer.next();
    
    functionParentContext = _function.context.parent;
    
    _function.invoke = function (receiver, args) {
      var callingContext = runtime.currentContext;
      runtime.currentContext = _function.context;
      util.each(_function.params, function (param, index) {
        runtime.currentContext.add({
          name: param,
          value: typeof args[index] !== "undefined" ? args[index] : jazz.lang.Null.NULL_OBJECT
        });
      });
      var returnValue = jazz.lang.Null.NULL_OBJECT;
      runtime.currentContext.setExpressions(_function.expressions);
      var expression = runtime.currentContext.removeExpression();
      while (expression) {
        returnValue = expression();
        expression = runtime.currentContext.removeExpression();
      }
      runtime.currentContext = callingContext;
      return returnValue;
    }
    return _function;
  }
  
  function parseParameter(_function) {
    lexer.expectIdentifier();
    _function.params.push(lexer.token);
    lexer.next();
  }
    
};
