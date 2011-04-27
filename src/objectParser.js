var jazz = jazz || {};

jazz.ObjectParser = function (lexer, runtime, expressionParser) {
  var util = jazz.util;
  var symbol = jazz.symbol;
  
  this.parseLiteralObject = function () {
    lexer.checkAndConsumeToken(symbol.LEFT_CUR);
    var objectProperties = {};
    while (!lexer.eoi() && lexer.token !== symbol.RIGHT_CUR) {
      lexer.expectIdentifier();
      var propertyName = lexer.token;
      lexer.next();
      lexer.checkAndConsumeToken(symbol.ASSIGN);
      objectProperties[propertyName] = expressionParser.parseExpressionEvaluator();
      if (lexer.token !== symbol.RIGHT_CUR && !lexer.metEndOfExpression()) {
        jazz.util.error("'" + jazz.symbol.EOE + "' or end of line expected");
      }
    }
    lexer.checkAndConsumeToken(symbol.RIGHT_CUR);
    return function () {
      var object = jazz.lang.Object.init(jazz.lang.Object);
      object.properties = objectProperties;
      for (property in objectProperties) {
        object.properties[property] = objectProperties[property]();
      }
      return object;
    };
  };
};
