var jazz = jazz || {};

jazz.Interpreter = function (input) {

  var lexer = new jazz.Lexer(input);
  var runtime = new jazz.Runtime();
  var parser = new jazz.Parser(lexer, runtime);
  
  runtime.currentContext.addClass(jazz.lang.Class);
  
  this.start = function () {
    lexer.next();
    parser.start();
  };
}
