var jazz = jazz || {};

jazz.symbol = {
  ASSIGN: "=",
  LEFT_CUR: "{",
  RIGHT_CUR: "}",
  ADD: "+",
  SUBTRACT: "-",
  MULTIPLY: "*",
  DIVIDE: "/",
  REMAINDER: "%",
  DOT: ".",

  ALERT: "alert",
  AND: "and",
  CLASS: "class",
  DEF: "def",
  END: "end",
  IMPORT: "import",
  OR: "or",
  VAR: "var"
};

(function () {
  jazz.symbol.allSymbols = [];
  for (var s in jazz.symbol) {
    jazz.symbol.allSymbols.push(jazz.symbol[s]);
  }
})();
