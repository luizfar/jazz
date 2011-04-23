var jazz = jazz || {};

jazz.Parser = function (lexer, runtime) {
  var exprParser = new jazz.ExpressionParser(lexer, runtime);
  
  this.start = function () {
    do {
      exprParser.parseExpressionEvaluator()();
    } while (!lexer.eoi());
  }
}
