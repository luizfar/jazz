var jazz = jazz || {};

jazz.Parser = function (lexer, symbolTable) {
  var ast = jazz.ast;
  var symbol = jazz.symbol;
  var util = jazz.util;
  var exprParser = new jazz.ExpressionParser(lexer, symbolTable);
  
  this.start = function () {
    do {
      switch (lexer.token) {
        case symbol.CLASS:
          parseClass();
          break;
        
        default:
          exprParser.parseExpressionEvaluator()();
      }
    } while (!lexer.eoi());
  }
  
  function parseClass() {
    lexer.next();
    lexer.expectIdentifier();
    var clazz = ast.clazz(lexer.token);
    lexer.next();
    lexer.checkAndConsumeToken(symbol.LEFT_CUR);
    while (lexer.token === symbol.DEF) {
      var method = parseMethod();
      clazz.methods[method.name] = method;
    }
    lexer.checkAndConsumeToken(symbol.RIGHT_CUR);
    symbolTable.addClass(clazz);
  }
  
  function parseParameter(method) {
    lexer.expectIdentifier();
    method.params.push(lexer.token);
    lexer.next();
  }
  
  function parseMethod() {
    lexer.next();
    lexer.expectIdentifier();
    var method = ast.method(lexer.token);
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
          value: args[index] ? args[index] : jazz.lang.Null.init()
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
}
