var jazz = jazz || {};

jazz.symbol = {
  ASSIGN: "=",
  LEFT_PAR: "(",
  RIGHT_PAR: ")",
  LEFT_CUR: "{",
  RIGHT_CUR: "}",
  LEFT_SQR: "[",
  RIGHT_SQR: "]",
  ADD: "+",
  SUBTRACT: "-",
  MULTIPLY: "*",
  DIVIDE: "/",
  REMAINDER: "%",
  NOT: "!",
  DOT: ".",
  COMMA: ",",
  EOL: "\n",
  EOE: ";",

  ALERT: "alert",
  AND: "and",
  CLASS: "class",
  DEF: "def",
  END: "end",
  EQUAL: "is",
  IMPORT: "import",
  IF: "if",
  ELSE: "else",
  LOG: "log",
  OR: "or",
  TRUE: "true",
  FALSE: "false",
  RETURN: "return",
  NULL: "null"
};

(function () {
  jazz.symbol.allSymbols = [];
  for (var s in jazz.symbol) {
    jazz.symbol.allSymbols.push(jazz.symbol[s]);
  }
})();
