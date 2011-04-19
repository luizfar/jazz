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
  
  function parseMethod() {
    lexer.expectIdentifier();
    var method = ast.method(lexer.token);
    lexer.next();
    lexer.checkAndConsumeToken(symbol.LEFT_CUR);
    method.expressions = [];
    while (lexer.token !== symbol.RIGHT_CUR) {
      method.expressions.push(exprParser.parseExpressionEvaluator());
    }
    lexer.next();
    method.invoke = function () {
      symbolTable.addScope();
      var lastValue = jazz.lang.Void;
      util.each(this.expressions, function (index, expression) {
        lastValue = expression();
      });
      symbolTable.removeScope();
      return lastValue;
    }
    return method;
  }
}
