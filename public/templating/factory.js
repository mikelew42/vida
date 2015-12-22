;(function(){

	Object.defineProperty(Function.prototype, 'clone', {
		enumerable: false,
		value: function() {
		    var newBaseObj = this;
		    if(this.__isnewBase) {
		      newBaseObj = this.__newBasedFrom;
		    }

		    var temp = function() { return newBaseObj.apply(this, arguments); };
		    for(var key in this) {
		        temp[key] = this[key];
		    }

		    Object.defineProperties(temp, {
		    	__isnewBase: {
			    	enumerable: false,
			    	value: true		    		
		    	},
		    	__newBasedFrom: {
		    		enumerable: false,
		    		value: newBaseObj
		    	}
		    });
		    
		    return temp;
		}
	});
	// Function.prototype.newBase = function() {
	//     var newBaseObj = this;
	//     if(this.__isnewBase) {
	//       newBaseObj = this.__newBasedFrom;
	//     }

	//     var temp = function() { return newBaseObj.apply(this, arguments); };
	//     for(var key in this) {
	//         temp[key] = this[key];
	//     }

	//     temp.__isnewBase = true;
	//     temp.__newBasedFrom = newBaseObj;

	//     return temp;
	// };

	// extend(baseObj, extObj1, extObj2, ...);
	var extend = jQuery.extend = function() {
	  var extObj, propName, baseValue, extValue, extValueIsArray, newBase,
	    baseObj = arguments[0] || {},
	    i = 1,
	    length = arguments.length,
	    deep = false;

	  // Handle a deep copy situation
	  if ( typeof baseObj === "boolean" ) {
	    deep = baseObj;

	    // skip the boolean and the target
	    baseObj = arguments[ i ] || {};
	    i++;
	  }

	  // Handle case when target is a string or something (possible in deep copy)
	  if ( typeof baseObj !== "object" && !$.isFunction(baseObj) ) {
	    baseObj = {};
	  }

	  for ( ; i < length; i++ ) {
	    // Only deal with non-null/undefined values
	    if ( (extObj = arguments[ i ]) != null ) {
	      // Extend the base object
	      for ( propName in extObj ) {
	        baseValue = baseObj[ propName ];
	        extValue = extObj[ propName ];

	        // Prevent never-ending loop
	        if ( baseObj === extValue ) {
	          continue;
	        }

	        // allow custom extend fn support
	        if (baseValue && baseValue.extend){
	        	baseValue.extend(extValue);
	        }
	        // if this extValue is object or array, and deep flag is set, don't simply overwrite the baseObj
	        else if ( deep && extValue && ( jQuery.isPlainObject(extValue) || (extValueIsArray = jQuery.isArray(extValue)) ) ) {
	          if ( extValueIsArray ) {
	            extValueIsArray = false;

	            // newBase is the base obj that gets assigned to the target[propName], and can be the existing array/obj,
	            // or a blank array

	            // in this case, if you extend an object property with an array property, it will overwrite the object with a blank array + items
	            newBase = baseValue && jQuery.isArray(baseValue) ? baseValue : [];

	          } else {
	          	// if extValue is object or array
	          	if (baseValue && jQuery.isFunction(baseValue)){
	          		newBase = baseValue.clone();
	          	} else {
	            	newBase = baseValue && jQuery.isPlainObject(baseValue) ? baseValue : {};
	          	}
	          }

	          // Never move original objects, newBase them
	          // it seems the original object is used as the "newBase", and new properties are moved onto it
	          // maintaining the original object seems preferred in many cases
	          // for extending sub functions, however, we'll want to newBase the fn first.

	          // this is what allows recursion
	          baseObj[ propName ] = extend( deep, newBase, extValue );

	        // Don't bring in undefined values
	        } else if ( extValue !== undefined ) {
	          baseObj[ propName ] = extValue;
	        }
	      }
	    }
	  }

	  // Return the modified object
	  return baseObj;
	};

      var makeConstructor = function(type){
      	eval("var ret = function " + type + "(args){\n" +
      	"	// Constructor for: " + type + "\n" +
		"	if (this instanceof arguments.callee){\n" +
		"		if (typeof this.initialize === 'function')\n" +
		"			this.initialize.apply(this, args && args.callee ? args : arguments);\n" +
		"	} else return new arguments.callee(arguments);\n" +
      	"};");
      	return ret;
      };

      var fork = function(proto){
		  var 	proto = proto || {},
		  		type = proto && proto.type ? proto.type : this.prototype.type ? this.prototype.type + "Child" : "UnnamedChild",
		  		factory = makeConstructor(type);

		  delete proto.type;

		  factory.prototype = extend(true, Object.create(this.prototype), proto);
		  Object.defineProperties(factory.prototype, {
		  	constructor: {
			  	value: factory,
			  	enumerable: false
		  	},
		  	type: {
		  		value: type,
		  		enumerable: false
		  	}
		  });
		  factory.parent = this;
		  factory.fork = fork;
		  return factory;
		};

	var makeBaseConstWithForking = function(type){
		var base = makeConstructor(type);
		base.fork = fork;
		  Object.defineProperties(base.prototype, {
		  	constructor: {
			  	value: base,
			  	enumerable: false
		  	},
		  	type: {
		  		value: type,
		  		enumerable: false
		  	}
		  	// ,
		  	// initialize: {
		  	// 	value: function(){
			  // 		console.log('Base.initialize', arguments);
			  // 	}
		  	// }
		  });
		base.prototype.constructor = base;
		base.prototype.type = type;
		// base.prototype.initialize = function BaseProtoInit(){
		// 	  	};
		return base;
	};

	window.Base = makeBaseConstWithForking('Base');
	Base.extend = extend;
})();