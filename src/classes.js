var jazz = jazz || {};

jazz.lang = (function () {
  var self = {};
  
  self.Class = {
    name: "Class",
    methods: {}
  };
  self.Class.clazz = self.Class;
  self.Class.methods["new"] = {
    params: [],
    invoke: function (_clazz, _params) {
      return _clazz.init(_params);
    }
  };
  
  var NULL_OBJECT = {};
  
  self.Null = {
    name: "Null",
    clazz: self.Class,
    init: function () {
      return NULL_OBJECT;
    },
    methods: {
      toString: {
        invoke: function (receiver) {
          return jazz.lang.String.init("null");
        }
      }
    }
  };
  
  self.Number = {
    name: "Number",
    clazz: self.Class,
    methods: {},
    init: function (_param) {
      return {
        clazz: self.Number,
        value: _param
      };
    }
  };
  self.Number.methods.toString = {
    invoke: function (receiver) {
      return jazz.lang.String.init(receiver.value);
    }
  };
  self.Number.methods.add = {
    params: [self.Number],
    invoke: function (_number, _params) {
      return self.Number.init(_number.value + _params[0].value);
    }
  };
  self.Number.methods.subtract = {
    params: [self.Number],
    invoke: function (_number, _params) {
      return self.Number.init(_number.value - _params[0].value);
    }
  };
  self.Number.methods.multiply = {
    params: [self.Number],
    invoke: function (_number, _params) {
      return self.Number.init(_number.value * _params[0].value);
    }
  };
  self.Number.methods.divide = {
    params: [self.Number],
    invoke: function (_number, _params) {
      return self.Number.init(_number.value / _params[0].value);
    }
  };
  self.Number.methods.remainder = {
    params: [self.Number],
    invoke: function (_number, _params) {
      return self.Number.init(_number.value % _params[0].value);
    }
  };
  self.Number.methods.equals = {
    params: [self.Number],
    invoke: function (_number, _params) {
      return self.Boolean.init(_number.value === _params[0].value);
    }
  };

  self.Boolean = {
    name: "Boolean",
    methods: {},
    init: function (_params) {
      return {
        clazz: self.Boolean,
        value: _params
      };
    }
  };
  self.Boolean.methods.toString = {
    invoke: function (receiver) {
      return jazz.lang.String.init(receiver.value);
    }
  };
  self.Boolean.methods.or = {
    params: [self.Boolean],
    invoke: function (_boolean, _params) {
      return self.Boolean.init(_boolean.value || _params[0].value);
    }
  };
  self.Boolean.methods.and = {
    params: [self.Boolean],
    invoke: function (_boolean, _params) {
      return self.Boolean.init(_boolean.value && _params[0].value);
    }
  };
  
  self.String = {
    name: "String",
    clazz: self.Class,
    methods: {},
    init: function (_params) {
      return {
        clazz: self.String,
        value: _params
      }
    }
  };
  self.String.methods.toString = {
    invoke: function (receiver) {
      return receiver;
    }
  };
  
  return self;
})();
