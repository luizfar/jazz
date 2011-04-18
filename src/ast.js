var jazz = jazz || {};

jazz.ast = {

  classClass: {
    "name": "Class",
    methods: {
      "new": {
        params: [jazz.lang.String],
        invoke: function (_clazz, _params) {
          return _clazz.init(_params);
        }
      }
    }
  },

  clazz: function (_name) {
    return {
      "name": _name,
      methods: {},
      type: jazz.ast.classClass,
      init: function (_params) {
        return {
          type: this,
          value: jazz.ast.object(this)
        };
      }
    };
  },
  
  method: function (_name, _params, _invoke) {
    return {
      name: _name,
      params: _params,
      invoke: _invoke
    };
  },
  
  object: function (_type) {
    return {
      type: _type
    };
  }
  
};

jazz.ast.classClass.type = jazz.ast.classClass;
