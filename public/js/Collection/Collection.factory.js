;(function($, MPL){
	/* Collection items can be stored in an array, or indexed by auto increment id, 
	or indexed by an arbitrary property name.  

	Collection items should also be object oriented, so if you want to remove the last item, you could
	col.last().remove(cb);  */
	var Collection = MPL.Collection = MPL.Base.factory({
		factory: "Collection",
		initialize: function(o){
			// $.extend(this, o);
			this.items = []; 
			this.do(o);
			this.trigger('initialized');
			//console.log('Collection.created');
		},
		prepend: function(item){
			this.items.unshift(item);
			this.trigger('prepend', item);
			return this;
		},
		append: function(item){
			this.items.push(item);
			this.trigger('append', item);
			return this;
		}
	});

})(jQuery, MPL);