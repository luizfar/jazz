describe("Jazz interpreter for variables usage", function () {

  beforeEach(function () {
    console.clear();
  });
  
  it("should create a new variable when there's an assignment", function () {
    jazz.execute(
      "a = 2\n" +
      "log a");
    expect(console.content).toEqual("2");
  });
  
  it("should not create a variable when it's used for the first time in the right side of an assignment", function () {
    var code =
      "a = 1\n" +
      "b = a - c\n" +
      "log b";
    expect(function () { jazz.execute(code) }).toThrow("Unknown identifier: c");
  });
  
  it("should evaluate an assignment to the variable's value", function () {
    jazz.execute('a = (b = 2)\nlog a');
    expect(console.content).toEqual("2");
  });
});
