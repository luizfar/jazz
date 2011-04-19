var jazz = jazz || {};

jazz.ast = {

  clazz: function (_name) {
    var newClazz = {
      name: _name,
      methods: {},
      clazz: jazz.lang.Class,
      init: function (_params) {
        return jazz.ast.object(this);
      }
    };
    newClazz.methods.toString = jazz.ast.method("toString", undefined, function (receiver) {
      return jazz.lang.String.init("Object[" + newClazz.name + "]");
    });
    
    return newClazz;
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
      clazz: _type
    };
  }
  
};
