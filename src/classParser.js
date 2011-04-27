var jazz = jazz || {};

jazz.ClassParser = function (lexer, runtime, functionParser, exprParser) {  
  var util = jazz.util;
  var symbol = jazz.symbol;
  
  this.parseClass = function () {
    lexer.next();
    lexer.expectIdentifier();
    var clazz = jazz.lang.Class.init(lexer.token);
    lexer.next();
    lexer.checkAndConsumeToken(symbol.LEFT_CUR);
    while (lexer.token === symbol.DEF) {
      var method = functionParser.parseMethod();
      clazz.members.methods[method.name] = method;
    }
    lexer.checkAndConsumeToken(symbol.RIGHT_CUR);
    return function () {
      runtime.currentContext.addClass(clazz);
    }
  };
}
