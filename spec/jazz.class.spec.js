describe("Jazz interpreter for classes", function () {
  
  beforeEach(function () {
    console.clear();
  });
  
  it("should allow class definitions", function () {
    jazz.execute("class Person {}\nlog Person.name()");
    expect(console.content).toEqual("Person");
  });
  
  it("should create objects from classes", function () {
    jazz.execute(
      "class Person {}\n" +
      "p = Person.new()\n" +
      "log p.asString()");
    expect(console.content).toEqual("Object[Person]");
  });
});
