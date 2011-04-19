var jazz = jazz || {};

jazz.Parser = function (lexer, symbolTable) {
  var ast = jazz.ast;
  var symbol = jazz.symbol;
  var util = jazz.util;
  var exprParser = new jazz.ExpressionParser(lexer, symbolTable);
  
  this.start = function () {
    do {
      exprParser.parseExpressionEvaluator()();
    } while (!lexer.eoi());
  }
}
