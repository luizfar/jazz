var jazz = jazz || {};

jazz.symbol = {
  ASSIGN: "=",
  LEFT_PAR: "(",
  RIGHT_PAR: ")",
  LEFT_CUR: "{",
  RIGHT_CUR: "}",
  ADD: "+",
  SUBTRACT: "-",
  MULTIPLY: "*",
  DIVIDE: "/",
  REMAINDER: "%",
  DOT: ".",
  COMMA: ",",

  ALERT: "alert",
  AND: "and",
  CLASS: "class",
  DEF: "def",
  END: "end",
  EQUAL: "is",
  IMPORT: "import",
  LOG: "log",
  OR: "or",
  TRUE: "true",
  FALSE: "false"
};

(function () {
  jazz.symbol.allSymbols = [];
  for (var s in jazz.symbol) {
    jazz.symbol.allSymbols.push(jazz.symbol[s]);
  }
})();
