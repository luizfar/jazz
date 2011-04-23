describe("Jazz interpreter for Object's methods", function () {

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

});
