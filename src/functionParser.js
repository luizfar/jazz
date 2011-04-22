var jazz = jazz || {};

jazz.FunctionParser = function (lexer, symbolTable, expressionParser) {
  var util = jazz.util;
  var symbol = jazz.symbol;
  
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
    
    lexer.checkAndConsumeToken(symbol.LEFT_CUR);
    _function.expressions = [];
    while (lexer.token !== symbol.RIGHT_CUR) {
      _function.expressions.push(expressionParser.parseExpressionEvaluator());
    }
    lexer.next();
    _function.invoke = function (receiver, args) {
      symbolTable.addScope();
      util.each(_function.params, function (param, index) {
        symbolTable.add({
          name: param,
          value: typeof args[index] !== "undefined" ? args[index] : jazz.lang.Null.init()
        });
      });
      var lastValue = jazz.lang.Null.init();
      util.each(this.expressions, function (expression) {
        lastValue = expression();
      });
      symbolTable.removeScope();
      return lastValue;
    }
    return _function;
  }
  
  function parseParameter(_function) {
    lexer.expectIdentifier();
    _function.params.push(lexer.token);
    lexer.next();
  }
    
};
