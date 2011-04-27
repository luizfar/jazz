describe("Jazz interpreter for Object's methods", function () {

  beforeEach(function () {
    console.clear();
  });
  
  it("should allow creating an empty object", function () {
    jazz.execute("log {}");
    expect(console.content).toEqual("Object[Object]");
  });

  it("should have asString", function () {
    jazz.execute(
      "o = {}\n" +
      "log o.asString()\n" + 
      "log 1.asString()\n" +
      "log true.asString()");
    expect(console.content).toEqual("Object[Object]\n1\ntrue");
  });
  
  it("should have equals", function () {
    jazz.execute(
      'log 1.equals(1)\n' +
      'log 1.equals(2)\n' + 
      'log "x".equals("x")\n' +
      'log "str".equals("s" + "tr")\n' +
      'log -1.equals(2 * -1 + 1);' +
      'log true.equals(1.equals(1));' +
      'log true.equals(1.equals(-1))');
    expect(console.content).toEqual("true\nfalse\ntrue\ntrue\ntrue\ntrue\nfalse");
  });
  
  it("should use object reference to compare equality when equals is not defined", function () {
    jazz.execute(
      "o = {}\n" +
      "p = {}\n" +
      "log o.equals(o)\n" +
      "log o.equals(p)\n" +
      "log p.equals(p)\n" +
      "log p.equals(o)\n");
    expect(console.content).toEqual("true\nfalse\ntrue\nfalse");
  });
  
  it("should use asString as default to print objects", function () {
    jazz.execute(
      'o = {}\n' + 
      'p = {\n' +
      '  asString = () {\n' +
      '    "p object :o)"\n' +
      '  }\n' +
      '}\n' +
      'log o\n' +
      'log p');
    expect(console.content).toEqual("Object[Object]\np object :o)");
  });
  
  it("should call an object's methods", function () {
    jazz.execute(
      'o = {\n' +
      '  play = () {\n' +
      '    log "playing something"\n' +
      '  }\n' +
      '}\n' +
      'o.play()\n');
    expect(console.content).toEqual("playing something");
  });
  
  it("should call an object's methods with parameters", function () {
    jazz.execute(
      'o = {\n' +
      '  play = (instrument) {\n' +
      '    log "playing the " + instrument\n' +
      '  }\n' +
      '}\n' +
      'i = {\n' +
      '  asString = () {\n' +
      '    "harmonica"\n' +
      '  }\n' +
      '}\n' +
      'o.play(i)');
    expect(console.content).toEqual("playing the harmonica");
  });
  
  it("should allow assignment to objects' properties", function () {
    jazz.execute(
      'o = {\n' +
       '  property = 1\n' +
       '}\n' +
       'o.property = 2\n' +
       'log o.property');
     expect(console.content).toEqual("2");
  });
  
  it("should allow assignment to an object's new property", function () {
    jazz.execute(
      'o = {\n' +
       '  property = 1\n' +
       '}\n' +
       'o.anotherProperty = 2\n' +
       'log o.anotherProperty');
     expect(console.content).toEqual("2");
  });
  
  it("should not allow accessing an objet's property if it is undefined", function () {
    var code =
      'o = {\n' +
       '  property = 1\n' +
       '}\n' +
       'log o.anotherProperty';
     expect(function () { jazz.execute(code); }).toThrow("Object of class 'Object' has no property named 'anotherProperty'");
  });
});
