;(function($){
	var Value = MPL.Value,
      Property = MPL.Property;

	var Base = MPL.Base = function Base(opts){
    // smart extend "this" with opts

    this.constructor.trigger('new', this);
		
    this.$_properties = {};
    
    if (this.initialize) this.initialize(opts);
	};

  $.extend(Base, MPL.Events.prototype); // allow Base to have events

	Base.prototype = $.extend(Object.create(MPL.Events.prototype), {
		constructor: Base,
		$_properties: {},
		$prop: function(name){
			return this.$_properties[name] || this.$_upgradeProperty(name);
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

	  // Helpers
  // -------

  // Helper function to correctly set up the prototype chain, for subclasses.
  // Similar to `goog.inherits`, but uses a hash of prototype properties and
  // class properties to be extended.
  var extend = function(protoProps, staticProps) {
    var parent = this;
    var child;

    // The constructor function for the new subclass is either defined by you
    // (the "constructor" property in your `extend` definition), or defaulted
    // by us to simply call the parent's constructor.
    if (protoProps && _.has(protoProps, 'constructor')) {
      child = protoProps.constructor;
    } else {
      child = function(){ return parent.apply(this, arguments); };
    }

    // Add static properties to the constructor function, if supplied.
    _.extend(child, parent, staticProps);

    // Set the prototype chain to inherit from `parent`, without calling
    // `parent`'s constructor function.
    var Surrogate = function(){ this.constructor = child; };
    Surrogate.prototype = parent.prototype;
    child.prototype = new Surrogate;

    // Add prototype properties (instance properties) to the subclass,
    // if supplied.
    if (protoProps) _.extend(child.prototype, protoProps);

    // Set a convenience property in case the parent's prototype is needed
    // later.
    child.__super__ = parent.prototype;

    child.extend = extend; // allow extension of child classes

    $.extend(child, MPL.Events.prototype); // allow constructor to have its own events
    
    return child;
  };

  // Set up inheritance for the model, collection, router, view and history.
  Base.extend = extend;
})(jQuery);