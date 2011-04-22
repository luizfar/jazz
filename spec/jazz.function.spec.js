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

});
