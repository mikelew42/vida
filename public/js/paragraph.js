;(function(MPL, $, _){

	if (typeof MPL !== "object")
		MPL = {};

	var Paragraph = MPL.Paragraph = MPL.Base.extend({
		constructor: function Paragraph(opts){
			MPL.Base.apply(this, arguments);
			this.$el = $("<p>").addClass('editable');

			// these need to be on the instance.  if they're on the prototype, 
			// then all instances reference the same Value object
			MPL.Value.install({
				obj: this,
				name: 'name'
			});

			MPL.Value.install({
				obj: this,
				name: 'content'
			});

			this.$content.bindTo(this.$el);

			var self = this;
			var returnHandler = function(e){
				console.log('return handler');
				if (e.which === 13){
					e.preventDefault();
					self.removeBackspaceHandler();
					self.next = new Paragraph();
					self.next.$el.insertAfter(self.$el);
					self.next.$el.attr('contenteditable', 'true');
					self.next.$el.focus();
					self.next.setBackspaceHandler(self);
					self.off('keydown', returnHandler);
				}
			};

			this.$el.click(function(){
				$(this).attr('contenteditable', 'true');
			}).clickOff(function(){
				$(this).removeAttr('contenteditable');
				self.$el.off('keypress', returnHandler);
			}).keydown(returnHandler);
		},
		setBackspaceHandler: function(para){
			this.$el.keypress(this.backspaceHandler);
		},
		backspaceHandler: function(e){
			console.log('backspaceHandler');
			console.log(e);
		},
		removeBackspaceHandler: function(){
			this.$el.off('keypress', this.backspaceHandler);
		}
	});

	$(document).ready(function(){
		var p = new Paragraph();
		p.content = "Hello world";
		p.$el.appendTo('body');

		var p2 = new Paragraph();
		p2.$el.appendTo('body');
	});

	$.fn.toggleClick = function(){

	    var functions = arguments ;

	    return this.click(function(){
	            var iteration = $(this).data('iteration') || 0;
	            functions[iteration].apply(this, arguments);
	            iteration = (iteration + 1) % functions.length ;
	            $(this).data('iteration', iteration);
	    });
	};

	$(document).click(function(e){
		documentClicked(e);
	});

	var clickOffTargets = [];

	var documentClicked = function(e){
		clickOffTargets.forEach(function(t){
			if (!$(event.target).closest(t[0]).length){
				t[1].call(t[0][0]);
			}
		});
	};

	$.fn.clickOff = function(cb){

		return this.each(function(){
			clickOffTargets.push([$(this),cb]);
		});
	};

})(MPL, $, _);