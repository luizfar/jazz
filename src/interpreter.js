var jazz = jazz || {};

jazz.Interpreter = function (input) {

  var lexer = new jazz.Lexer(input);
  var symbolTable = new jazz.SymbolTable();
  var parser = new jazz.Parser(lexer, symbolTable);
  
  symbolTable.addClass(jazz.lang.Class);
  
  this.start = function () {
    lexer.next();
    parser.start();
  };
}
