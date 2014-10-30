
/*
Rewrite the base class to use this factory pattern, and also the installer pattern?

1. Make the recipes modular!
2. Allow for prototype use or standalone installation
3. Don't worry about making JSON(store) compatible data definitions (allow
functional definitions that can install get/set and perform custom logic).

*/


;(function($){
	var Value = MPL.Value,
      Property = MPL.Property,
      Factories = MPL.Factories = {};

var makeConstructor = function(name, parent){
  eval("var ret = function " + name + "(){ parent.apply(this, arguments); };");
  return ret;
};

var extend = function(proto){
  var child, parent = this, name = proto && proto.factory ? proto.factory : "Child";
  child = proto && proto.hasOwnProperty('constructor') && proto.constructor || makeConstructor(name, parent);
  child.prototype = $.extend(Object.create(parent.prototype), proto);
  child.prototype.constructor = child;
  child.parent = parent;
  child.extend = extend;
  return child;
};

var def = function(o){
  return typeof o !== "undefined";
};

var undef = function(o){
  return !def(o);
};

/* Rewrite this function making it non-object oriented (like $.extend(one, two, three)), and
then wrap it in an oo wrapper:  this.do = fn(){ do.apply(this, arguments); }

- allow multiple objects for default+override pattern, or just stringing a series of functions
- try to encapsulate each conditional block + step into separate fn as much as possible for readability
- */
  var doit = function(o){
    // assume o is an object, later add support for an array of objects
    for (var i in o){
      if (typeof this[i] !== 'undefined'){
        if (typeof this[i] === 'function'){
          if (typeof o[i] === 'function')
            this[i] = o[i];
          else if ($.isArray(o[i]))
            /*
            Either fun: [1,2,3] --> fun.apply(this, [1,2,3]) and
                   fun: [[1,2,3]] --> fun([1,2,3])
            Or     fun: { apply: [1, 2, 3] } and
                   fun: [1,2,3] --> fun([1,2,3])
            */
            this[i].apply(this, o[i]);
          else
            this[i].call(this, o[i]);
        } else if (typeof this[i] === 'object' && typeof o[i] === 'object' && !$.isArray(o[i]) ){
          if (this[i].do)
            this[i].do(o[i]);
          else
            $.extend(true, this[i], o[i]);
          // deep extend?
          // handling of arrays
          // handling of deep obj paths, and paths that don't exist?
          // example:  prototype has a propObj that has a settings:
          //    obj.propObj.settings.setting = 5;
          //  in this case, if you've stored this setting: 5 on a propObj, you can't
          // just set the whole propObj, or it will override the prototype.  This actuall might
          // be the desired end result though...  You'd want to deep fork the whole chain though...
        } else {
          this[i] = o[i];
        }
      } else {
        if (typeof o[i] === 'object' && 
            o[i].factory && 
            Factories[o[i].factory] && 
            (!o[i] instanceof Factories[o[i].factory].create) ){
                this[i] = Factories[o[i].factory](o[i]);
        } else {
          this[i] = o[i];
        }

      }
    }
  };

  var Factory = MPL.Factory = function(proto){
    var constructor = this.create && this.create.extend(proto) || proto.constructor || function(){};
    
    // constructor inheritance
    constructor.extend = extend;

    // back reference
    constructor.factory = factory;

    var factory = function(o){
      var obj = new factory.create(o);
      factory.trigger('new', obj);
      return obj;
    };

    factory.factory = Factory;

    // constructor
    factory.create = constructor;
    
    // prototype
    if (!this.create){
      constructor.prototype = $.extend(
        Object.create(MPL.Events.prototype), 
        proto,
        { constructor: constructor }
      );
    }

    // this allows the Factory to have events
    $.extend(factory, MPL.Events.prototype);

    // register factories to be used when initializing stored objects
    if (proto.factory)
      Factories[proto.factory] = factory;


    return factory;
    // if constructor has a factory, its prototype already has events, and doens't need that again
    // 
  };


  var Base = MPL.Base = Factory({
    factory: "Base",
    do: doit,
    constructor: function Base(opts){
      this.$_properties = {};
      if (this.initialize) this.initialize(opts);
    },
    $_properties: {},
    $prop: function(name){
      var $prop = this.$_properties[name] || this.$_upgradeProperty(name);
      this.trigger('prop', $prop);
      return $prop;
    },
    $_upgradeProperty: function(name, propObj){
      var propObj = propObj || new Property({name: name, value: this[name], parent: this});
      this.$_properties[propObj.name] = propObj;
      Object.defineProperty(this, propObj.name, {
        get: function(){ return propObj.value; },
        set: function(val){ propObj.value = val; },
        enumerable: true
      });
      return propObj;
    },
    fork: function(){
      var fork = Object.create(this);
      this.$_properties.forEach(function(v, i){
        fork.addValue(v.fork());
      });
      return fork;
    }
  });


/*  // factory inheritance
  Base.extend = function(args){
    var constructor = this.create.extend(args),
        factory = function(o){
          return new constructor(o);
        };

    constructor.factory = factory;
    factory.create = constructor;
    factory.extend = Base.extend;
    $.extend(factory, MPL.Events.prototype);
    return factory;
  };
*/
})(jQuery);