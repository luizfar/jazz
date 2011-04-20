var jazz = jazz || {};

jazz.Parser = function (lexer, symbolTable) {
  var exprParser = new jazz.ExpressionParser(lexer, symbolTable);
  
  this.start = function () {
    do {
      exprParser.parseExpressionEvaluator()();
    } while (!lexer.eoi());
  }
}
