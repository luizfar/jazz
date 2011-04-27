describe("Jazz interpreter errors", function () {

  beforeEach(function () {
    console.clear();
  });
  
  function execute(code) {
    return function () {
      jazz.execute(code);
    }
  }
  
  it("should be raised when accessing undefined variables", function () {
    expect(execute("log variable")).toThrow("Unknown identifier: variable");
  });
  
  it("should be raised when calling methods that don't exist", function () {
    expect(execute("o = {}\no.doStuff()")).toThrow("Object of class 'Object' has no method named 'doStuff'");
  });
  
  it("should be raised on weird syntax samples", function () {
    expect(execute("a = {}\na b")).toThrow("';' or end of line expected");
  });
});
