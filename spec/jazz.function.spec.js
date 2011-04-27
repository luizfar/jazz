describe("Jazz interpreter for functions", function () {

  beforeEach(function () {
    console.clear();
  });
  
  it("should allow top-level anonymous functions", function () {
    jazz.execute(
      'f = () {\n' +
      '  log "inside function"\n' +
      '}\n' +
      'f()');
    expect(console.content).toEqual("inside function");
  });
  
  it("shoudl allow top-level anonymous functions with parameters", function () {
    jazz.execute(
      'f = (param) {\n' +
      '  log param\n' +
      '}\n' +
      'f("hi")');
    expect(console.content).toEqual("hi");
  });
  
  it("should allow functions that return functions", function () {
    jazz.execute(
      'f = (param) {\n' +
      '  log param\n' +
      '  (anotherParam) {\n' +
      '    log anotherParam\n' +
      '  }\n' +
      '}\n' +
      'f("hey")("you")');
    expect(console.content).toEqual("hey\nyou");
  });
  
  it("should return from a function when a return statement is executed", function () {
    jazz.execute(
      'f = (param) {\n' + 
      '  if param\n' +
      '    return "param is true"\n' +
      '  else\n' +
      '    return "param is false"\n' +
      '  log "not here"\n' +
      '}\n' +
      'log f(true)\n' +
      'log f(false)');
    expect(console.content).toEqual("param is true\nparam is false");
  });
  
  it("should allow the use of internal functions", function () {
    jazz.execute(
      'f = (param) {\n' + 
      '  g = (anotherParam) {\n' +
      '    log anotherParam + " inside of g"\n' +
      '  }\n' +
      '  log param + " inside of f"\n' +
      '  g("also " + param)\n' +
      '}\n' +
      'f("here")');
    expect(console.content).toEqual("here inside of f\nalso here inside of g");
  });
  
  it("should sign an error when outer function tries to access inner functions variables", function () {
    var code =
      'f = (param) {\n' +
      '  g = (anotherParam) {\n' +
      '    p = 1\n' +
      '    log anotherParam + " inside of g" + p\n' +
      '  }\n' +
      '  g(param)\n' +
      '  log param + " inside of f" + p\n' +
      '}\n' +
      'f("here")';
    expect(function () { jazz.execute(code); }).toThrow("Unknown identifier: p");
  });
  
  it("should allow inner functions to access outer functions' context", function () {
    jazz.execute(
      'f = (param) {\n' + 
      '  g = () {\n' +
      '    log param + " inside of g"\n' +
      '  }\n' +
      '  log param + " inside of f"\n' +
      '  g()\n' +
      '}\n' +
      'f("here")');
    expect(console.content).toEqual("here inside of f\nhere inside of g");
  });
  
  it("should allow inner functions to access outer functions' context when it is called externally", function () {
    jazz.execute(
      'f = () {\n' +
      '  x = 12\n' +
      '  g = () {\n' +
      '    log x\n' +
      '  }\n' +
      '}\n' +
      'k = f()\n' +
      'k()');
    expect(console.content).toEqual("12");
  });
  
  it("should allow inner functions to change an outer function's variable", function () {
    jazz.execute(
      'f = () {\n' +
      '  x = 1; log x\n' +
      '  g = () { x = 2 }\n' +
      '  g(); log x\n' +
      '}\n' +
      'f()');
    expect(console.content).toEqual("1\n2");
  });
  
  it("should return to the function's caller's context", function () {
    var code =
      'f = () {\n' +
      '  x = 1\n' +
      '  () {\n' +
      '    log x\n' +
      '  }\n' +
      '}\n' +
      'k = f()\n' +
      'log x';
    expect(function () { jazz.execute(code); }).toThrow("Unknown identifier: x");
  });
  
  it("should return to the function's caller's context - more levels", function () {
    jazz.execute(
      'f = () {\n' +
      '  g = () {\n' +
      '    log 2\n' +
      '  }\n' +
      '  h = () {\n' +
      '    g()\n' +
      '    log 3\n' +
      '  }\n' +
      '}\n' +
      'f()()\n' +
      'log 4');
    expect(console.content).toEqual("2\n3\n4");
  });

});
