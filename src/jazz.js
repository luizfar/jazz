var jazz = jazz || {};

if (!window.console) {
  window.console = {
    log: function (text) {
      return false;
    },
    error: function (text) {
      return false;
    }
  };
}

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
