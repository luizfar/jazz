var jazz = jazz || {};

jazz.execute = function (code) {
  var interpreter = new jazz.Interpreter(code);
  interpreter.start();
};

jazz.run = function () {
  $(document).ready(function() {
    $("script[type='jazz']").each(function() {
      jazz.execute($(this).text());
    });
  });
}
