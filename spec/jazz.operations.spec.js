describe("Jazz interpreter for basic operations", function () {
  
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
  
  it("should interpret math operations that use the operations names", function () {
    jazz.execute("log 3.multiply(5.subtract(2)).divide(11.subtract(4.multiply(2)))");
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
  
  it("should interpret string concatenation", function () {
    jazz.execute('log "str" + "ing"');
    expect(console.content).toEqual("string");
  });
  
  it("should convert elements to string when concatenating them to string", function () {
    jazz.execute('log "this string has " + 25 + " characters"');
    jazz.execute('log "is this a string? " + true');
    expect(console.content).toEqual("this string has 25 characters\nis this a string? true");
  });
});
