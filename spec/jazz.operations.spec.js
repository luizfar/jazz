describe("Jazz interpreter for math operations", function () {
  
  beforeEach(function () {
    console.clear();
  });

  it("should interpret simple math operations", function () {
    jazz.execute("log 1 + 1");
    jazz.execute("log 2 * 3");
    jazz.execute("log 10 / 2");
    jazz.execute("log 5 / 2");
    expect(console.content).toEqual("2\n6\n5\n2.5");
  });
  
  it("should interpret complex math operations with parenthesis", function () {
    jazz.execute("log 3 * (5 - 2) / (11 - 4 * 2)");
    expect(console.content).toEqual("3");
  });
  
  it("should interpret math operations that use the operators as method calls", function () {
    jazz.execute("log 3.*(5.-(2))./(11.-(4.*(2)))");
    expect(console.content).toEqual("3");
  });
  
  it("should interpret boolean 'and' operations", function () {
    jazz.execute("log true and true");
    jazz.execute("log true and false");
    jazz.execute("log false and true");
    jazz.execute("log false and false");
    expect(console.content).toEqual("true\nfalse\nfalse\nfalse");
  });
  
  it("should interpret boolean 'or' operations", function () {
    jazz.execute("log true or true");
    jazz.execute("log true or false");
    jazz.execute("log false or true");
    jazz.execute("log false or false");
    expect(console.content).toEqual("true\ntrue\ntrue\nfalse");
  });
});
