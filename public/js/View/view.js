;(function($, MPL){
	
	var View = MPL.View = MPL.Base.factory({
		factory: "View",
		initialize: function(opts){
			this.$prop('name');
			$.extend(this, opts);
			this.trigger('initialized');
			console.log('View.created');
		}
	});

	/*var View = MPL.View = function(opts){
		return new View.create(opts);
	};

	View.create = MPL.Base.extend({
		initialize: function(opts){
			this.$prop('name');
			$.extend(this, opts);
			this.trigger('initialized');
			console.log('View.created');
		}
	});

	View.extend = function(args){
		var constructor = View.create.extend(args);
		var factory = function(o){
			return new constructor(o);
		};
		factory.create = constructor;
		return factory;
	};*/


})(jQuery, MPL);