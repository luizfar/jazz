var jazz = jazz || {};

jazz.Parser = function (lexer, symbolTable) {
  var ast = jazz.ast;
  var symbol = jazz.symbol;
  var exprEval = new jazz.ExpressionEvaluator(lexer, symbolTable);
  
  this.start = function () {
    do {
      switch (lexer.token) {
        case symbol.ALERT:
          parseAlert();
          break;
        
        case symbol.CLASS:
          parseClass();
          break;
        
        case symbol.VAR:
          parseVarDeclaration();
          break;
        
        default:
          parseIdentifierExpression();
      }
    } while (!lexer.eoi());
  }
  
  function parseAlert() {
    lexer.next();
    alert(exprEval.evaluateExpression().value);
  }
    
  function parseClass() {
    lexer.expectIdentifier();
    var clazz = ast.clazz(lexer.token);
    lexer.next();
    if (lexer.token === symbol.DEF) {
      var method = parseMethod();
      clazz.methods[method.name] = method;
    }
    lexer.checkToken(symbol.END);
    lexer.next();
    symbolTable.addClass(clazz);
  }
  
  function parseMethod() {
    lexer.expectIdentifier();
    var method = ast.method(lexer.token);
    while (lexer.token !== symbol.END) {
      // TODO
      lexer.next();
    }
    lexer.next();
    return method;
  }
  
  function parseVarDeclaration() {
    lexer.next();
    var variable = {
      "name": lexer.token,
      type: null,
      value: null
    };
    lexer.next();
    if (lexer.token === symbol.ASSIGN) {
      lexer.next();
      var expression = exprEval.evaluateExpression();
      variable.value = expression.value;
      variable.type = expression.type;
    }
    symbolTable.add(variable);
  }
  
  function parseIdentifierExpression() {
    exprEval.evaluateExpression();
  }
}
