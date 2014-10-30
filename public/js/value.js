;(function($){

	if (typeof MPL !== "object")
		MPL = {};

	var Value = MPL.Value = function Value(opts){
		$.extend(this, opts);
	};

	Value.prototype = $.extend(Object.create(MPL.Events.prototype), {
		constructor: Value,
		_value: undefined,
		bindTo: function(bindTo){
			var self = this;
			if (bindTo instanceof jQuery){
				// self --> bindTo
				self.change(function(){
					bindTo.setValue(self.value);
				});
				// bindTo --> self
				bindTo.on('keyup', function(){
					self.value = bindTo.getValue();
				});
				// start synced? but which way? shouldn't matter, you're likely to set this value after binding
			} else if (bindTo instanceof Value) {
				// self --> bindTo
				self.change(function(){
					bindTo.value = self.value;
				});
				// bindTo --> self
				bindTo.change(function(){
					self.value = bindTo.value;
				});
			}
		},
		valueOf: function(){
			return this.value;
		},
		toString: function(){
			return '' + this.value;
		},
		fork: function(){
			return Object.create(this);
		},
		del: function(){
			delete this.value;
		}
	});

	Object.defineProperty(Value.prototype, 'value', {
		get: function(){ 
			return this._value; 
		},
		set: function(val){ 
			this._value = val; 
			this.change(); 
		}
	});

	var aliasEvent = function(eventName){
		return function(cb){
			if (typeof cb === 'function') this.on(eventName, cb);
			else this.trigger(eventName);
		};
	};
	/* Maybe this should be 'set'.  We shouldn't need to use these getters/setters for functions... those would be super methods.
	If you're calling obj.set(3), it would set the value.  IF you call obj.set(fn), it adds as a cb.  */

	['change'].forEach(function(v, i){
		Value.prototype[v] = aliasEvent(v);
	});

	/*
	config: {
		obj: someObj,
		pname: '$propName', // valueObj
		name: 'propName', // get/setters
		value: 'prop value'
	}
	*/
	Value.install = function(config){
		if (!config.pname)
			config.pname = '$' + config.name;

		config.obj[config.pname] = new Value({name: config.name, value: config.value});
		Object.defineProperty(config.obj, config.name, {
			get: function(){
				return this[config.pname].value;
			},
			set: function(newValue){
				this[config.pname].value = newValue;
			}
		});

	};


	var Property = MPL.Property = function Property(opts){
		Value.install({
			obj: this,
			name: 'name'
		});
		/* this.$name = new Value({name: 'name', value: opts && opts.name})
		Object.defineProperty(this, 'name', {
			get: function(){
				return this.$name.value;
			},
			set: function(newName){
				this.$name.value = newName;
			}
		});*/
		$.extend(this, opts);
	};

	Property.prototype = $.extend(Object.create(MPL.Value.prototype), {
		constructor: Property,
		$render: function(){
			var $target = this.parent.$el.$props;
			if (!this.$el){
				this.$el = $('<div>').addClass('property');
				this.$el.$name = $('<div>').css('display', 'inline-block').html(this.name).appendTo(this.$el);
				this.$el.append(': ');
				this.$name.bindTo(this.$el.$name);
				this.$el.$value = $('<input>').val(this.value).appendTo(this.$el);
				this.bindTo(this.$el.$value);
			}
			this.$el.appendTo($target);
		}
	});


	Object.defineProperty(Property.prototype, 'name', {
		get: function(){ 
			return this._name; 
		},
		set: function(n){ 
			this._name = n; 
			this.rename(); 
		}
	});

	['rename'].forEach(function(v){
		Property.prototype[v] = aliasEvent(v);
	});

	$.fn.getValue = function(){
		var $first = this.first();
		return $first.val() || $first.html();
	};

	$.fn.setValue = function(value){
		return this.each(function(){
			var $self = $(this);
			$self.html(value);
			if ($self.html() != value || value === ''){
				$self.val(value);
				if ($self.val() != value){
					console.log('Could not $().setValue()');
				}
			}
		});
	};

	$.fn.bind = function($el){
		return this.each(function(){
			var $self = $(this),
				oldValue = $self.getValue();

			$self.on('keydown', function(){
				$el.setValue($self.getValue());
			});
			$el.on('keydown', function(){
				$self.setValue($el.getValue());
			});
			$el.setValue($self.getValue());
		});
	};
	
})(jQuery);