var jazz = jazz || {};

jazz.Lexer = function (_input) {
  var util = jazz.util;
  var input = trim(_input) + "\0";
  var pos = 0;
  var symbol = jazz.symbol;
  
  var SIMPLE_TOKENS = [ symbol.ASSIGN, symbol.LEFT_CUR, symbol.RIGHT_CUR,
                        symbol.LEFT_PAR, symbol.RIGHT_PAR, symbol.ADD,
                        symbol.SUBTRACT, symbol.MULTIPLY, symbol.DIVIDE,
                        symbol.REMAINDER, symbol.COMMA, symbol.DOT];

  this.token = '';
  
  function trim(str) {
	  return str.replace(/^\s+|\s+$/g,"");
  }
  
  function isBlank(ch) {
    return ch === ' ' || ch === '\n';
  }
  
  function isValidChar(ch) {
    return ch && ch.match("[A-Za-z\"]");
  }

  this.skipBlank = function () {
    while (!this.eoi() && isBlank(input[pos])) pos++;
  };
  
  this.eoi = function () {
    return pos > input.length || input[pos] === "\0";
  };
  
  this.next = function () {
    this.skipBlank();
    this.token = "";

    if (util.contains(SIMPLE_TOKENS, input[pos])) {
        this.token = input[pos++];
        return;
    }
    
    if (util.isNumber(input[pos])) {
      do {
        this.token += input[pos++];
      } while (!this.eoi() && (util.isNumber(input[pos]) || (input[pos] === symbol.DOT && pos < input.length - 1 && util.isNumber(input[pos + 1]))));
      return;
    }
    
    if (input[pos] === "\"") {
      do {
        this.token += input[pos++];
      } while (!this.eoi() && input[pos] != '\n' && input[pos] != "\"");
      if (input[pos] === "\"") {
        this.token += input[pos++];
      } else {
        util.error("String end expected.");
      }
      return;
    }
    
    while (!this.eoi() && isValidChar(input[pos])) {
      this.token += input[pos++];
    }
  };
  
  this.checkAndConsumeToken = function (expectedToken) {
    if (this.token !== expectedToken) {
      util.error("'" + expectedToken + "' expected.");
    }
    this.next();
  };
  
  this.expectIdentifier = function () {
    this.next();
    if (!this.tokenIsIdentifier()) {
      util.error("Identifier expected.");
    }
  };
  
  this.tokenIsNumber = function () {
    return util.isNumber(this.token)
  };
  
  this.tokenIsString = function () {
    return this.token[0] === this.token[this.token.length - 1] && this.token[0] === '"';
  };
  
  this.tokenIsIdentifier = function () {
    return !this.tokenIsNumber() && !this.tokenIsString() && !util.contains(jazz.symbol.allSymbols, this.token);
  }
  
  this.position = function () {
    return pos;
  };
}
