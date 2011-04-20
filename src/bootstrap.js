var jazz = jazz || {};
jazz.lang = jazz.lang || {};

jazz.lang.Object = {
  name: "Object",
  properties: {},
  members: {
    properties: [],
    methods: {
      toString: {
        invoke: function (receiver) {
          return jazz.lang.String.init("Object[" + receiver.clazz.name + "]");
        }
      }
    }
  },
  getMemberMethod: function (identifier) {
    return jazz.lang.Object.members.methods[identifier];
  },
  init: function (clazz, params) {
    var newObject = {
      clazz: clazz,
      properties: {},
      getProperty: function (identifier) {
        return properties[identifier];
      },
      getMethod: function (identifier) {
        var method = newObject.properties[identifier];
        if (!method || !method.invoke) {
          method = newObject.clazz.getMemberMethod(identifier);
          if (!method || !method.invoke) {
            jazz.util.error("Object of class '" + clazz.name + "' has no method named '" + identifier + "'.");
          }
        }
        return method;
      }
    };
    for (var index = 0; index < clazz.members.properties.length; ++index) {
      var property = clazz.members.properties[index];
      newObject.properties[property] = jazz.Null.init();
    }
    return newObject;
  }
};

jazz.lang.Class = {
  name: "Class",
  superClass: jazz.lang.Object,
  properties: {
    name: {
      invoke: function (clazz) {
        return jazz.lang.String.init("Class");
      }
    }
  },
  members: {
    properties: [],
    methods: {
      "new": {
        invoke: function (clazz, params) {
          return jazz.lang.Object.init(clazz, params);
        }
      },
      "name": {
        invoke: function (clazz) {
          return jazz.lang.String.init(clazz.name);
        }
      },
      toString: {
        invoke: function (clazz) {
          return jazz.lang.String.init("Class " + clazz.name);
        }
      }
    }
  },
  getMemberMethod: function (identifier) {
    var method = jazz.lang.Class.members.methods[identifier];
    if (!method || !method.invoke) {
      method = jazz.lang.Object.getMemberMethod(identifier);
    }
    return method;
  },
  init: function (name) {
    var newClass = jazz.lang.Object.init(jazz.lang.Class);
    newClass.name = name;
    newClass.superClass = jazz.lang.Object;
    newClass.members = {
      properties: [],
      methods: {}
    };
    newClass.getMemberMethod = function (identifier) {
      var method = newClass.members.methods[identifier];
      if (!method || !method.invoke) {
        method = newClass.superClass ? newClass.superClass.getMemberMethod(identifier) : undefined;
      }
      return method;
    }
    newClass.init = function () {
      return jazz.lang.Object.init(newClass);
    }
    return newClass;
  }
};

jazz.lang.Function = jazz.lang.Class.init("Function");
jazz.lang.Function.members.methods = {
  "name": {
    invoke: function (_function) {
      return jazz.lang.String.init(_function.name);
    }
  }
};
jazz.lang.Function.init = function (name, invoke) {
  var newFunction = jazz.lang.Object.init(jazz.lang.Function);
  newFunction.name = name;
  newFunction.invoke = invoke;
  
  return newFunction;
}

jazz.lang.Null = jazz.lang.Class.init("Null");
jazz.lang.Null.NULL_OBJECT = jazz.lang.Object.init(jazz.lang.Null);
jazz.lang.Null.NULL_OBJECT.properties.toString = jazz.lang.Function.init("toString", function () {
  return jazz.lang.String.init("null");
});
jazz.lang.Null.init = function () {
  return jazz.lang.NULL_OBJECT;
}
  
jazz.lang.Number = jazz.lang.Class.init("Number");
jazz.lang.Number.init = function (params) {
  var number = jazz.lang.Object.init(jazz.lang.Number);
  number.value = params;
  return number;
};
jazz.lang.Number.members.methods.toString = {
  invoke: function (receiver) {
    return jazz.lang.String.init(receiver.value);
  }
};
jazz.lang.Number.members.methods.add = {
  invoke: function (number, params) {
    return jazz.lang.Number.init(number.value + params[0].value);
  }
};
jazz.lang.Number.members.methods.subtract = {
  invoke: function (number, params) {
    return jazz.lang.Number.init(number.value - params[0].value);
  }
};
jazz.lang.Number.members.methods.multiply = {
  invoke: function (number, params) {
    return jazz.lang.Number.init(number.value * params[0].value);
  }
};
jazz.lang.Number.members.methods.divide = {
  invoke: function (number, params) {
    return jazz.lang.Number.init(number.value / params[0].value);
  }
};
jazz.lang.Number.members.methods.remainder = {
  invoke: function (number, params) {
    return jazz.lang.Number.init(number.value % params[0].value);
  }
};
jazz.lang.Number.members.methods.equals = {
  invoke: function (number, params) {
    return jazz.lang.Boolean.init(number.value === params[0].value);
  }
};

jazz.lang.Boolean = jazz.lang.Class.init("Boolean");
jazz.lang.Boolean.TRUE = jazz.lang.Object.init(jazz.lang.Boolean);
jazz.lang.Boolean.TRUE.value = true;
jazz.lang.Boolean.FALSE = jazz.lang.Object.init(jazz.lang.Boolean);
jazz.lang.Boolean.FALSE.value = false;
jazz.lang.Boolean.init = function (params) {
  return params ? jazz.lang.Boolean.TRUE : jazz.lang.Boolean.FALSE;
};
jazz.lang.Boolean.members.methods.toString = {
  invoke: function (receiver) {
    return jazz.lang.String.init(receiver.value);
  }
};
jazz.lang.Boolean.members.methods.or = {
  params: [jazz.lang.Boolean],
  invoke: function (booleanObject, params) {
    return jazz.lang.Boolean.init(booleanObject.value || params[0].value);
  }
};
jazz.lang.Boolean.members.methods.and = {
  params: [jazz.lang.Boolean],
  invoke: function (booleanObject, params) {
    return jazz.lang.Boolean.init(booleanObject.value && params[0].value);
  }
};

jazz.lang.String = jazz.lang.Class.init("String");
jazz.lang.String.init = function (params) {
  var str = jazz.lang.Object.init(jazz.lang.String);
  str.value = params;
  return str;
};
jazz.lang.String.members.methods.toString = {
  invoke: function (receiver) {
    return receiver;
  }
};
jazz.lang.String.members.methods.add = {
  invoke: function (receiver, params) {
    return jazz.lang.String.init(receiver.value + params[0].value);
  }
};
