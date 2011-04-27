var jazz = jazz || {};

jazz.Parser = function (lexer, runtime) {
  var exprParser = new jazz.ExpressionParser(lexer, runtime);
  
  this.start = function () {
    do {
      var evaluator = exprParser.parseExpressionEvaluator();
      if (!lexer.metEndOfExpression()) {
        jazz.util.error("'" + jazz.symbol.EOE + "' or end of line expected");
      }
      evaluator();
    } while (!lexer.eoi());
  }
}
