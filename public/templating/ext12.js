;(function($){

	$(function(){

		var Ext = Base.fork({
			name: "Ext",
			initialize: function ExtInit(){
				console.groupCollapsed('Ext.initialize', arguments);
				Base.prototype.initialize.apply(this, arguments);
				this.extFnHasRun = true;
				console.dir(this);
				console.groupEnd();
			}
		});

		ext = Ext(true, 'two', 3, { four: 5, six: 7, eight: 9, ten: { eleven: 132948 }});

		Ext2 = Ext.fork({
			name: 'Ext2',
			initialize: function Ext2Init(){
				console.groupCollapsed('Ext2.initialize', arguments);
				Ext.prototype.initialize.apply(this, arguments);
				this.ext2FnHasRun = true;
				console.dir(this);
				console.groupEnd();

			}
		});

		ext2 = Ext2();

		
		One = Base.fork({
			name: 'One',
			initialize: function(){
				this.render(); // note:  doesn't have to auto render
				this.append(); // multiple permutations of append, append fn, and using the raw 1 line this.$el.append..., using comments, etc.
			},
			render: function(){
				this.$el = $('<div>').addClass('item').html('Hello world');
			},
			// use another name... append/prepend should be aliased from view to $el.
			append: function(){
				this.appendToItemsContainer();
				// this.appendToBody();
			},
			appendToItemsContainer: function(){
				this.$el.appendTo('.items');
			},
			appendToBody: function(){
				this.$el.appendTo('body');
			}
		});

		one = One();

		Section = Base.fork({
			name: "Section",
			initialize: function(parent){
				this.setParent(parent);
				this.render(); // title fn is dependent on this.$el
			},
			append: function(){
				this.$el.append.apply(this.$el, arguments);
			},
			setParent: function(parent){
				if (parent){
					if (parent instanceof jQuery){
						this.$parent = parent;
					} else if (parent.$el){
						this.parent = parent;
						this.$parent = parent.$el;
					}
				}
			},
			render: function(){
				this.$el = $('<section>');
				if (this.$parent) this.$el.appendTo(this.$parent);
				return this;
			},
			title: function(title){
				if (!this.$title)
					this.$title = $('<h3>').prependTo(this.$el);

				this.$title.html(title);
				return this;
			},
			p: function(p, returnIt){
				// use append rather than html, so incoming p can be any $jQuery content
				var $p = $('<p>').append(p).appendTo(this.$el);
				(this.$paragraphs || (this.$paragraphs = [])).push($p);
				(this.children || (this.children = [])).push($p);
				return returnIt ? $p : this;
			},
			section: function(){
				// can't apply to this, or constructor logic will fail
				var section = Section(this);
				(this.sections || (this.sections = [])).push(section);
				return section;
			}
		});

		section1 = Section($('body'));
		section1.title('Append to body');
		section1.p($('<h1>').append('H1 in a P')).p('second p').p('third p and return', 1).css('color', 'red');
		section1.append('one', 2, 'three');
		section1.section().append('yo yo yo, subsection what');

		
		Test = Base.fork({
			initialize: function(o){
				// this could allow any variable number/type of args
				for (var i in arguments)
					this.processArg(arguments[i]);

				// or extend/sextend
				for (var i in o)
					this.extend(o) || this.do(o);
			}
		});
		
	});

})(jQuery);