;(function($, MPL){
	
	var HTML = MPL.HTML = MPL.Base.factory({
		factory: "HTML",
		tag: "div",
		initialize: function(o){
			//$.extend(this, o);
			console.log(this.constructor.prototype.classes.items);
			this.classes = this.constructor.prototype.classes.copy();
			//this.classes.on('all', function(){
			//	console.log('classes.all', arguments);
			//});
			this.attributes = Attributes({ el: this });
			this.contents = Contents({ el: this });
			this.do(o);
			this.trigger('initialized');
			// console.log('HTML.created');
			this.render();
		},
		render: function(){
			this.$el = $('<' + this.tag + '>').addClass(this.classes.items.join(' '));
			/*var self = this;
			if (this.contents.items.length){
				this.contents.items.forEach(function(v, i){
					self.$el.append(v);
				});
			}*/

			if (this.$parent){
				this.$el.appendTo(this.$parent);
			} else if (this.parent){
				this.$el.appendTo(this.parent.$el);
			}
		}
	});

	var Classes = MPL.HTML.Classes = MPL.Collection.factory({ factory: "Classes" });
	var Attributes = MPL.HTML.Attributes = MPL.Collection.factory({ factory: "Attributes" });
	var Contents = MPL.HTML.Contents = MPL.Collection.factory({ factory: "Contents" });

	HTML.create.prototype.classes = Classes({ el: HTML.create.prototype });
	HTML.create.prototype.attributes = Attributes({ el: HTML.create.prototype });
	HTML.create.prototype.contents = Contents({ el: HTML.create.prototype });


	window.HTML = HTML; // uncomment for testing

	HTML.tests = {
		div: function(o){
			o = o || {};
			$.extend(o, {classes: { append: "test-div" }, $parent: $("body")});
			console.log(o);
			var div = HTML(o);
			console.log(div);
			return div;
		},
		parent: function(){
			var parent = this.div();
			var div = HTML({ parent: parent });
		},
		oneTwo: function(){
			var One = HTML.factory({ classes: { append: 'factory-one' } } );

			/* 
			Using the .factory method extends the .create constructor, which 
			calls sextend on the prototype:
				child.prototype = sextend(Object.create(parent.prototype), proto);

			
			*/
			console.log('one', One({ classes: { append: 'instance-one' } } ));
			/* To solve this problem, I could run the initialize fn on the prototype, 
			so that when the .factory method sextends the prototype, the objects are available.  

			Then, in the constructor, you'd have to copy the collection from prototype to instance. */
			var Two = One.factory({ classes: { append: 'factory-two' } } );
			console.log('two', Two({ classes: { append: 'instance-two' } } ));
		}
	};
	$(function(){
		// HTML.tests.div();
		// HTML.tests.parent();
		HTML.tests.oneTwo();
		
	})
})(jQuery, MPL);