;(function($, MPL){
	
	var Method = MPL.Method = MPL.Base.factory({
		factory: "Method"
	});

	var makeSM = function(baseFn){
		var sm = function(cb){
			if (typeof cb === 'function'){
				return sm.on('after', cb); // this needs to be a new event chain...
			}

			sm.trigger('before', arguments); // instead of triggering before, sm.before could be a sm, and we just sm.before.apply(this, arguments);
			sm.fn.apply(this, arguments);
			sm.trigger('after', arguments);
		};

		$.extend(sm, MPL.Events.prototype);

		sm.fn = baseFn;
		sm.before = function(cb){
			sm.on('before', cb);
		};
		sm.after = function(cb){
			sm.on('after', cb);
		};

		return sm;
	};

	Method.tests = {
		beforeAfter: function(){
			var sm = makeSM(function(){
				console.log('sm.fn', arguments);
			});

			sm.before(function(){
				console.log('sm.before', arguments);
			});

			sm(function(){
				console.log('pass cb to sm fn', arguments);
			});


			sm.after(function(){
				console.log('sm.after', arguments);
			});

			sm(function(){
				console.log('pass cb to sm fn, after sm.after event added', arguments);
			});

			sm(true, 'two', 3);
		}
	};

	$(function(){
		// Method.tests.beforeAfter();
	});

})(jQuery, MPL);