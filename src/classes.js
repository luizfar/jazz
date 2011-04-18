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
  
  self.Void = {
    name: "Void",
    clazz: self.Class
  };
  
  self.Number = {
    name: "Number",
    clazz: self.Class,
    methods: {},
    init: function (_param) {
      return {
        clazz: self.Number,
        value: _param,
        asString: function () {
          return this.value;
        }
      };
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
  
  self.String = {
    name: "String",
    clazz: self.Class,
    methods: {},
    init: function (_params) {
      return {
        clazz: self.String,
        value: _params,
        asString: function() {
          return this.value;
        }
      }
    }
  };
  
  return self;
})();
