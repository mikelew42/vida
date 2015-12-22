
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

MPL.extend = function() {
  var srcObj, propName, targetValue, srcValue, copyIsArray, clone,
    targetObj = arguments[0] || {},
    i = 1,
    length = arguments.length,
    deep = false;

  // Handle a deep copy situation
  if ( typeof targetObj === "boolean" ) {
    deep = targetObj;

    // skip the boolean and the target
    targetObj = arguments[ i ] || {};
    i++;
  }

  // Handle case when target is a string or something (possible in deep copy)
  if ( typeof targetObj !== "object" && !$.isFunction(targetObj) ) {
    targetObj = {};
  }

  // extend jQuery itself if only one argument is passed
  if ( i === length ) {
    targetObj = this;
    i--;
  }

  for ( ; i < length; i++ ) {
    // Only deal with non-null/undefined values
    if ( (srcObj = arguments[ i ]) != null ) {
      // Extend the base object
      for ( propName in srcObj ) {
        targetValue = targetObj[ propName ];
        srcValue = srcObj[ propName ];

        // Prevent never-ending loop
        if ( targetObj === srcValue ) {
          continue;
        }

        // Recurse if we're merging plain objects or arrays
        if ( deep && srcValue && ( jQuery.isPlainObject(srcValue) || (copyIsArray = jQuery.isArray(srcValue)) ) ) {
          if ( copyIsArray ) {
            copyIsArray = false;
            clone = targetValue && jQuery.isArray(targetValue) ? targetValue : [];

          } else {
            clone = targetValue && jQuery.isPlainObject(targetValue) ? targetValue : {};
          }

          // Never move original objects, clone them
          targetObj[ propName ] = jQuery.extend( deep, clone, srcValue );

        // Don't bring in undefined values
        } else if ( srcValue !== undefined ) {
          targetObj[ propName ] = srcValue;
        }
      }
    }
  }

  // Return the modified object
  return targetObj;
};

var makeConstructor = function(name, parent){
  eval("var ret = function " + name + "(){ parent.apply(this, arguments); };");
  return ret;
};

var extend = function(proto){
  var child, parent = this, name = proto && proto.factory ? proto.factory : "Child";
  child = proto && proto.hasOwnProperty('constructor') && proto.constructor || makeConstructor(name, parent);
  child.prototype = sextend(Object.create(parent.prototype), proto);
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
    if (!o)
      return false;

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
            // if o[i].override, then just set it
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
    return this;
  };

  var sextend = function(base, ext){
    return doit.call(base, ext);
  };

  var makeNamedEmptyConstructor = function(name){

  };
  var getOwnConstructorOrMakeNewConstructorWithEvents = function(proto){
    var constructor = proto && proto.hasOwnProperty('constructor') && proto.constructor || function(){};
    
    // bleh:  this whole system fails w/o proto.events == true, b/c otherwise, proto never gets merged into constructor.prototype
    if (proto.events){ // note: this is rather destructive, in the case that you're passing ina  constructor that already has a prototype.
      constructor.prototype = $.extend(
        Object.create(MPL.Events.prototype), 
        proto,
        { constructor: constructor }
      );
    }

    return constructor;
  };

  var Factory = MPL.Factory = function(proto){
    var constructor = this.create && this.create.extend(proto) || getOwnConstructorOrMakeNewConstructorWithEvents(proto);
    
    // constructor inheritance
    constructor.extend = extend;

    var factory = function(o){
      var obj = new factory.create(o);
      factory.trigger('new', obj);
      return obj;
    };

    // back reference
    constructor.factory = factory;

    factory.factory = Factory;

    // constructor
    factory.create = constructor;

    // this allows the Factory to have events
    $.extend(factory, MPL.Events.prototype);

    // register factories to be used when initializing stored objects
    if (proto.factory)
      Factories[proto.factory] = factory;


    return factory;
    // if constructor has a factory, its prototype already has events, and doens't need that again
    // 
  };

  var Factory2 = MPL.Factory2 = function(o){
    
  };


  var Base = MPL.Base = Factory({
    factory: "Base",
    events: true,
    do: doit,
    constructor: function Base(opts){
      /*
      // makeClass - By John Resig (MIT Licensed)
      function makeClass(){
        return function(args){
          // if using new
          if ( this instanceof arguments.callee ) {
            // and init method exists
            if ( typeof this.init == "function" )
              // apply either the args or arguments, depending on whether the below was used
                  // if below was used, args will already be arguments, and have property .callee
              this.init.apply( this, args.callee ? args : arguments );
          } else
            // if not using new keyword, instantiate
            return new arguments.callee( arguments );
        };
      }
      */
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