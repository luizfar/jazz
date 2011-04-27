describe("Jazz interpreter for literal expressions", function () {
  
  beforeEach(function () {
    console.clear();
  });

  it("should interpret number expressions", function () {
    jazz.execute("log 1");
    expect(console.content).toEqual("1");
  });
  
  it("should interpret negative numbers expressions", function () {
    jazz.execute("log -2");
    expect(console.content).toEqual("-2");
  });
  
  it("should interpret positive numbers with '+' expressions", function () {
    jazz.execute("log +3");
    expect(console.content).toEqual("3");
  });
  
  it("should interpret decimal number expressions", function () {
    jazz.execute("log 0.924");
    expect(console.content).toEqual("0.924");
  });
  
  it("should interpret string expressions", function () {
    jazz.execute('log "Jazz!"');
    expect(console.content).toEqual("Jazz!");
  });
  
  it("should interpret boolean expressions", function () {
    jazz.execute("log true");
    jazz.execute("log false");
    expect(console.content).toEqual("true\nfalse");
  });
  
  it("should interpret boolean expressions with negative operator", function () {
    jazz.execute("log !true");
    jazz.execute("log !(1.equals(2))");
    expect(console.content).toEqual("false\ntrue");
  });
  
  it("should interpret literal object definition", function () {
    jazz.execute(
      'p = { name = "john"; age = 30; greet = () { log "hi!" }}\n' + 
      'log p.name\n' + 
      'log p.age\n' + 
      'p.greet()');
    expect(console.content).toEqual("john\n30\nhi!");
  });
});
