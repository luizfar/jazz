describe("Jazz interpreter for control structures", function () {
  
  beforeEach(function () {
    console.clear();
  });
  
  it("should interpret if commands", function () {
    jazz.execute(
      'x = 1\n' + 
      'if x is 1\n' +
      '  log "inside one if"\n' +
      'if x is 2\n' + 
      '  log "inside another if"\n' +
      'log "done"');
    expect(console.content).toEqual("inside one if\ndone");
  });
  
  it("should interpret if commands with else clause", function () {
    jazz.execute(
      'x = 1\n' + 
      'if x is 1\n' +
      '  log "inside if"\n' +
      'else\n' + 
      '  log "inside else"\n' +
      'log "done"');
    expect(console.content).toEqual("inside if\ndone");
  });
  
  it("should interpret if commands and execute else clause if boolean expression is false", function () {
    jazz.execute(
      'x = 1\n' + 
      'if x is 2\n' +
      '  log "inside if"\n' +
      'else\n' + 
      '  log "inside else"\n' +
      'log "done"');
    expect(console.content).toEqual("inside else\ndone");
  });
});
