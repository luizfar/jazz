describe("Jazz interpreter for null values", function () {

  beforeEach(function () {
    console.clear();
  });
  
  it("should interpret the 'null' keyword", function () {
    jazz.execute('x = null\nlog x');
    expect(console.content).toEqual("null");
  });
  
  it("should allow all objects to know if they are null", function() {
    jazz.execute(
      'x = null\n' +
      'y = "hey!"\n' + 
      'log x.isNull()\n' +
      'log y.isNull()\n' +
      'log 1.isNull()');
    expect(console.content).toEqual("true\nfalse\nfalse");
  });
});
