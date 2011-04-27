var jazz = jazz || {};

jazz.Lexer = function (_input) {
  var util = jazz.util;
  var input = trim(_input) + "\0";
  var pos = 0;
  var symbol = jazz.symbol;
  var tokenIsString = false;
  var metEndOfExpression = false;
  
  var SIMPLE_TOKENS = [ symbol.ASSIGN, symbol.LEFT_CUR, symbol.RIGHT_CUR,
                        symbol.LEFT_PAR, symbol.RIGHT_PAR, symbol.ADD,
                        symbol.SUBTRACT, symbol.MULTIPLY, symbol.DIVIDE,
                        symbol.REMAINDER, symbol.COMMA, symbol.DOT,
                        symbol.NOT, symbol.LEFT_SQR, symbol.RIGHT_SQR];

  this.token = '';
  
  function trim(str) {
	  return str.replace(/^\s+|\s+$/g,"");
  }
  
  function isBlank(ch) {
    if (ch === ' ') {
      return true;
    }
    if (ch === symbol.EOL || ch === symbol.EOE) {
      metEndOfExpression = true;
      return true;
    }
    return false;
  }
  
  function isValidChar(ch) {
    return ch && ch.match("[A-Za-z\"_]");
  }
  
  function isNumber(ch) {
    return ch && ch.match("[0-9]");
  }

  function increaseWhileBlank(position) {
    while (!eoi(position) && isBlank(input[position])) position++;
    return position;
  }

  function skipBlank() {
    pos = increaseWhileBlank(pos);
  };
  
  function eoi(position) {
    return position > input.length || input[position] === "\0";
  };
  
  this.eoi = function () {
    return eoi(pos);
  }
  
  this.next = function () {
    metEndOfExpression = false;
    skipBlank();
    var eoi = this.eoi();
    metEndOfExpression = metEndOfExpression || eoi;
    this.token = "";
    tokenIsString = false;

    if (util.contains(SIMPLE_TOKENS, input[pos])) {
        this.token = input[pos++];
        return;
    }
    
    if (isNumber(input[pos])) {
      do {
        this.token += input[pos++];
      } while (!this.eoi() && (isNumber(input[pos]) || (input[pos] === symbol.DOT && pos < input.length - 1 && isNumber(input[pos + 1]))));
      return;
    }
    
    if (input[pos] === "\"") {
      tokenIsString = true;
      pos++;
      do {
        this.token += input[pos++];
      } while (!this.eoi() && input[pos] != '\n' && input[pos] != "\"");
      if (input[pos] !== "\"") {
        util.error("String end expected.");
      }
      pos++;
      return;
    }
    
    if (!eoi && isValidChar(input[pos])) {
      this.token += input[pos++];
      while (!this.eoi() && (isValidChar(input[pos]) || isNumber(input[pos]))) {
        this.token += input[pos++];
      }
    }
  };
  
  this.checkAndConsumeToken = function (expectedToken) {
    tokenIsString = false;
    if (this.token !== expectedToken) {
      util.error("'" + expectedToken + "' expected.");
    }
    this.next();
  };
  
  this.expectIdentifier = function () {
    if (!this.tokenIsIdentifier()) {
      util.error("Identifier expected.");
    }
    return this.token;
  };
  
  this.tokenIsNumber = function () {
    return util.isNumber(this.token) && !tokenIsString;
  };
  
  this.tokenIsString = function () {
    return tokenIsString;
  };
  
  this.tokenIsIdentifier = function () {
    return !this.tokenIsNumber() && !this.tokenIsString() && !util.contains(jazz.symbol.allSymbols, this.token) && !tokenIsString;
  };
  
  this.isLeftCurAfterNextMatchingRightPar = function () {
    var tempPos = pos;
    var leftParCount = 1;
    while (!eoi(tempPos) && leftParCount != 0) {
      if (input[tempPos] === symbol.LEFT_PAR) leftParCount++;
      if (input[tempPos] === symbol.RIGHT_PAR) leftParCount--;
      tempPos++;
    }
    tempPos = increaseWhileBlank(tempPos);
    metEndOfExpression = false;
    return input[tempPos] === symbol.LEFT_CUR;
  };
  
  this.metEndOfExpression = function () {
    return metEndOfExpression;
  };
  
  this.position = function () {
    return pos;
  };
}
