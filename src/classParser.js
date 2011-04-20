var jazz = jazz || {};

jazz.ClassParser = function (lexer, symbolTable, exprParser) {  
  var util = jazz.util;
  var symbol = jazz.symbol;
  
  this.parseClass = function () {
    lexer.next();
    lexer.expectIdentifier();
    var clazz = jazz.lang.Class.init(lexer.token);
    lexer.next();
    lexer.checkAndConsumeToken(symbol.LEFT_CUR);
    while (lexer.token === symbol.DEF) {
      var method = parseMethod();
      clazz.methods[method.name] = method;
    }
    lexer.checkAndConsumeToken(symbol.RIGHT_CUR);
    return function () {
      symbolTable.addClass(clazz);
    }
  }
  
  function parseMethod() {
    lexer.next();
    lexer.expectIdentifier();
    var method = jazz.lang.Function.init(lexer.token);
    lexer.next();
    
    method.params = [];
    if (lexer.token === symbol.LEFT_PAR) {
      lexer.next();
      if (lexer.token !== symbol.RIGHT_PAR) {
        parseParameter(method);
        while (lexer.token === symbol.COMMA) {
          lexer.next();
          parseParameter(method);
        }
      }
      lexer.checkAndConsumeToken(symbol.RIGHT_PAR);
    }
    
    lexer.checkAndConsumeToken(symbol.LEFT_CUR);
    method.expressions = [];
    while (lexer.token !== symbol.RIGHT_CUR) {
      method.expressions.push(exprParser.parseExpressionEvaluator());
    }
    lexer.next();
    method.invoke = function (receiver, args) {
      symbolTable.addScope();
      util.each(method.params, function (param, index) {
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
    return method;
  }
  
  function parseParameter(method) {
    lexer.expectIdentifier();
    method.params.push(lexer.token);
    lexer.next();
  }
}
