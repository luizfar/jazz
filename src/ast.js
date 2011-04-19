var jazz = jazz || {};

jazz.ast = {

  clazz: function (_name) {
    return {
      "name": _name,
      methods: {},
      clazz: jazz.lang.Class,
      init: function (_params) {
        return jazz.ast.object(this);
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
      clazz: _type,
      asString: function () {
        return _type.asString() + " object";
      }
    };
  }
  
};
