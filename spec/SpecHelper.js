console.content = null;
console.testAppend = function (text) {
  if (console.content === null) {
    console.content = text;
  } else {
    console.content += "\n" + text;
  }
};
console.log = function (text) {
  console.testAppend(text);
};
console.error = function (text) {
  console.testAppend(text);
};
console.clear = function () {
  console.content = null;
};
