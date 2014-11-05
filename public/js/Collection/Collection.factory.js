;(function($, MPL){
	/* Collection items can be stored in an array, or indexed by auto increment id, 
	or indexed by an arbitrary property name.  

	Collection items should also be object oriented, so if you want to remove the last item, you could
	col.last().remove(cb);  */
	var Collection = MPL.Collection = MPL.Base.factory({
		factory: "Collection",
		initialize: function(o){
			// $.extend(this, o);
			this.init_o = o;


			// potentially copy items from constructor, so that you can add items to a prototype:
			// Factory.create.prototype.coll.append(item);
			// or
			// Factory({ coll: { append: item }} );
			//           -> this should extend the coll prototype, but that would mean invasive action in the 
			//              sextend fn
			// either way, the prototype has to have a collection instance, and whether we copy the items or the collection, doesn't matter

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
		},
		copy: function(){
			var copy = this.constructor.factory(this.init_o);
			// this only accoutns for prepend/appended items...
			$.each(this.items, function(i, item){
				if (typeof item === 'object'){
					if (item.copy)
						copy.append(item.copy());
					else
						copy.append($.extend({}, item));
				} else {
					copy.append(item);
				}
			});
			return copy;
		}
	});

	Collection.tests = {
		test: function(){
			console.log('Collection.tests reporting.');
		},
		copy: function(){
			var coll = Collection();
			coll.append(true);
			coll.append(2);
			coll.append('three');
			console.log(coll);
			var copy = coll.copy();
			copy.append(4);
			copy.append('five');
			console.log(copy);
		}
	};
	$(function(){
		// Collection.tests.test();
		// Collection.tests.copy();
		
	})

})(jQuery, MPL);