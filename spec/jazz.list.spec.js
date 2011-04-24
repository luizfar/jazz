describe("Jazz interpreter for lists usage", function () {

  beforeEach(function () {
    console.clear();
  });
  
  it("should allow literal lists definition", function () {
    jazz.execute('list = [1, 2, 3, "hey", { name = "john" }, () { return 1 }]\nlog list');
    expect(console.content).toEqual("[1, 2, 3, hey, Object[Object], Object[Function]]");
  });
  
  it("should allow accessing a list's size", function () {
    jazz.execute('log ([1, 2, 3].size())');
    expect(console.content).toEqual("3");
  });
  
  it("should iterate through a list's elements with the 'each' method", function () {
    jazz.execute('[1, 2, "hey!"].each((element, index) { log index + ": " + element })');
    expect(console.content).toEqual("0: 1\n1: 2\n2: hey!");
  });
  
  it("should allow accessing a specific position of a list", function () {
    jazz.execute(
      'l = [1, 2, 3]\n' +
      'log l[2 - 1]');
    expect(console.content).toEqual("2");
  });
  
  it("should allow assigning a value to a list element", function () {
    jazz.execute(
      'l = [1, 2, 3]\n' +
      'l[-1 - -2 * 1] = 5\n' +
      'log l');
    expect(console.content).toEqual("[1, 5, 3]");
  });
  
  it("should allow lists of lists", function () {
    jazz.execute(
      'l = [[1, 2, 3], ["4", "5", "6"], [{ answer = 42}]]\n' +
      'log l\n' +
      'l[1][1] = "x"\n' +
      'log l[1]\n' +
      'log l[0][2]');
    expect(console.content).toEqual(
      '[[1, 2, 3], [4, 5, 6], [Object[Object]]]\n' +
      '[4, x, 6]\n' +
      '3');
  });
});
