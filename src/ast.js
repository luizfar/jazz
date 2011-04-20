var jazz = jazz || {};

jazz.ast = {

  clazz: function (name) {
    var newClazz = {
      name: name,
      methods: {},
      properties: [],
      clazz: jazz.lang.Class
    };
    newClazz.init = function (params) {
      var object = {
        clazz: newClazz,
        attributes: {}
      };
      jazz.util.each(newClazz.properties, function (property, index) {
        object.attributes[property] = typeof params[index] !== "undefined" ? params[index] : jazz.lang.Null.init();
      });
      return object;
    };
    newClazz.methods.toString = jazz.ast.method("toString", undefined, function (receiver) {
      return jazz.lang.String.init("Object[" + newClazz.name + "]");
    });
    
    return newClazz;
  },
  
  variable: function (name, clazz) {
    return {
      name: name,
      clazz: clazz
    };
  },
  
  method: function (name, params, invoke) {
    return {
      name: name,
      params: params,
      invoke: invoke
    };
  }
  
};
