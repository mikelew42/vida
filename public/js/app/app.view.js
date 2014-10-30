/*
App.View.add(Another.View)
	--> this.$el.append(view.$el);
*/

;(function($, MPL){
	var App = MPL.App;
		
	App.View = MPL.View.factory({
		initialize: function(opts){
			// console.log('App.View initilaized');
			$.extend(this, opts);
			this.trigger('initialized');
			// console.log(this.app);
		}
	});

	App.on('new', function(app){
		App.View({ app: app });
		//console.log(app);
		app.on('prop', function(prop){
			//console.log(prop)
		});
	});

	App.on('add', function(){});

	App.on('prop', function(){
		//console.log('app.prop');
	});

})(jQuery, MPL);