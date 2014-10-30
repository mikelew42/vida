/*

;(function($, MPL){
	
})(jQuery, MPL);

*/

;(function($, MPL){
	var App = MPL.App = MPL.Base.factory({
		factory: "App",
		initialize: function(opts){
			//console.log('App initialized');
			this.$prop('name');
			$.extend(this, opts);
			this.trigger('initialized');
		}
	});
})(jQuery, MPL);