;(function($, MPL){
	
	var HTML = MPL.HTML = MPL.Base.factory({
		factory: "HTML",
		tag: "div",
		initialize: function(o){
			//$.extend(this, o);
			this.classes = Classes();
			//this.classes.on('all', function(){
			//	console.log('classes.all', arguments);
			//});
			this.attributes = Attributes();
			this.contents = Contents();
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
			console.log('one', One({ classes: { append: 'instance-one' } } ));
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