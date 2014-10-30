;(function(MPL){
	if (typeof MPL !== "object")
		MPL = {};

	var Item = MPL.Item;

	var Collection = MPL.Collection = function Collection(opts){
		$.extend(this, opts);
		this.$_order = [];
		this.$_items = {};
		this.$_nextID = 1;
		this.$_init();
		this.$parent = $('body');
	};

	Collection.prototype = $.extend(Object.create(MPL.Events.prototype), {
		$add: function(item){ // upgrade these to super methods for before/after events
			this.$_items[this.$_nextID++] = item;
			this.$_order.push(item);
			this.trigger('add', item);
		},
		$_init: function(){
			this.$render(false);
		},
		$render: function(append){
			if (typeof append === 'undefined')
				append = true;

			var self = this;
			
			if (!this.$el)
				this.$el = $('<div></div>').addClass('collection');
			
			this.$_order.forEach(function(v){
				v.$render();
			});
			
			if (append)
				this.$el.appendTo(this.$parent)
			
			return this.$el;
		},
		addItem: function(name){
			var item = new Item(name);
			this.$add(item);
			item.$parent = this.$el;
			return item;
		}
	});

	Collection.test1 = function(){	
		window.col = new Collection();
		col.one = col.addItem('One');
		col.two = col.addItem('Two');
		col.$render();
		col.one.$name = 'yeee haw';
	};
	
	$(document).ready(function(){
		//Collection.test1(); 
	});
})(MPL);