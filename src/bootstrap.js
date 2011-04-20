var jazz = jazz || {};
jazz.lang = jazz.lang || {};

jazz.lang.Object = {
  init: function (clazz, params) {
    var newObject = {
      clazz: clazz,
      properties: {},
      getProperty: function (identifier) {
        return properties[identifier];
      },
      getMethod: function (identifier) {
        return clazz.methods[identifier];
      }
    };
    for (var index = 0; index < clazz.members.length; ++index) {
      var property = clazz.members[index];
      newObject.properties[property] = typeof params[index] !== "undefined" ? params[index] : jazz.Null.init();
    }
    return newObject;
  }
};

jazz.lang.Class = jazz.lang.Object.init({ members: [] });
jazz.lang.Class.name = "Class";
jazz.lang.Class.clazz = jazz.lang.Class;
jazz.lang.Class.members = [];
jazz.lang.Class.methods = {
  "new": {
    invoke: function (clazz, params) {
      return jazz.lang.Object.init(clazz, params);
    }
  }
};
jazz.lang.Class.init = function (name) {
  var newClazz = jazz.lang.Object.init(jazz.lang.Class);
  newClazz.name = name;
  newClazz.methods = {
    toString: {
      invoke: function (receiver) {
        return jazz.lang.String.init("Object[" + newClazz.name + "]");
      }
    }
  };
  newClazz.members = [];
  newClazz.init = function () {
    return jazz.lang.Object.init(newClazz);
  };
  
  return newClazz;
};

jazz.lang.Function = jazz.lang.Class.init("Function");
jazz.lang.Function.init = function (name, params, invoke) {
  var newFunction = jazz.lang.Object.init(jazz.lang.Function);
  newFunction.name = name
  newFunction.params = params;
  newFunction.invoke = invoke;
  return newFunction;
}

jazz.lang.Null = jazz.lang.Class.init("Null");
jazz.lang.Null.NULL_OBJECT = jazz.lang.Object.init(jazz.lang.Null);
jazz.lang.Null.init = function () {
  return jazz.lang.NULL_OBJECT;
}
jazz.lang.Null.methods.toString = {
  invoke: function (receiver) {
    return jazz.lang.String.init("null");
  }
};
  
jazz.lang.Number = jazz.lang.Class.init("Number");
jazz.lang.Number.init = function (params) {
  var number = jazz.lang.Object.init(jazz.lang.Number);
  number.value = params;
  return number;
};
jazz.lang.Number.methods.toString = {
  invoke: function (receiver) {
    return jazz.lang.String.init(receiver.value);
  }
};
jazz.lang.Number.methods.add = {
  invoke: function (number, params) {
    return jazz.lang.Number.init(number.value + params[0].value);
  }
};
jazz.lang.Number.methods.subtract = {
  invoke: function (number, params) {
    return jazz.lang.Number.init(number.value - params[0].value);
  }
};
jazz.lang.Number.methods.multiply = {
  invoke: function (number, params) {
    return jazz.lang.Number.init(number.value * params[0].value);
  }
};
jazz.lang.Number.methods.divide = {
  invoke: function (number, params) {
    return jazz.lang.Number.init(number.value / params[0].value);
  }
};
jazz.lang.Number.methods.remainder = {
  invoke: function (number, params) {
    return jazz.lang.Number.init(number.value % params[0].value);
  }
};
jazz.lang.Number.methods.equals = {
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
jazz.lang.Boolean.methods.toString = {
  invoke: function (receiver) {
    return jazz.lang.String.init(receiver.value);
  }
};
jazz.lang.Boolean.methods.or = {
  params: [jazz.lang.Boolean],
  invoke: function (booleanObject, params) {
    return jazz.lang.Boolean.init(booleanObject.value || params[0].value);
  }
};
jazz.lang.Boolean.methods.and = {
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
jazz.lang.String.methods.toString = {
  invoke: function (receiver) {
    return receiver;
  }
};
