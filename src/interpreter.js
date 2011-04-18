var jazz = jazz || {};

jazz.Interpreter = function (input) {

  var lexer = new jazz.Lexer(input);
  var symbolTable = new jazz.SymbolTable();
  var parser = new jazz.Parser(lexer, symbolTable);
  
  symbolTable.addClass(jazz.ast.classClass);
  
  this.start = function () {
    lexer.next();
    parser.start();
  };
}
