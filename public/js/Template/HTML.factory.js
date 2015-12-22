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
		},
		copy: function(){
			// create new html obj, copy classes, attr, and contents
			// to copy contents, make copies of each html obj (which is this fn)
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
		},
		without: function(){
			var one = HTML.copy();
			one.classes.append('something');

			HTML( 
				Class('something'), 
				Attr('name', 'value'), 
				div( 	p('yo'), 
						p('two') ),
				div('yep')
			);

			// or

			HTML().class('something').attr('');

			// view options

			data.$el;
			data.view.$el;
			// or neither:  view and $el stay separate.  but, to have view logic, you'll want to have an object:

			data.on('init', function(){
				// create view object, but doesn't need to be composed...
			});

/*

The greatest advantage to a view system like this, is being able to save versions, and possibly compare those versions,
and choose which version to keep, or which styles from both to merge into a new version:

- both css and html
- use a version number, and add a .v1-.v2348 class to the root
  - or, give the version a name:  .v-version-name
  - also, use options:  .o1-.o2358, or give the option a name:  .o-option-name
  	options can be stacked, where versions should be mutually exclusive (you must change the version, you can't
  	have multiple versions active at the same time)

Versions and Options

Versions can contain rules for adding/removing sub-versions/options:
 - Create a series of options for children of a widget
 	- These options can be composed (apply none, one, or multiples) to find the right 'recipe'
 	- Easily add new option (from scratch, or copy an existing option)
 		- an option is just a class with css rules
 		- what about HTML structure?
 			html structure is probably best for a higher level, rebuild the entire widget type of operation: aka
 			the version change.  

 			it might be possible to rebuild only a sub-element, but this would mean readding certain UI event
 			handlers, and that could get complicated (you'd need to track dependencies on that el, and rebuild them);

Functional Templating:
The changes made to a template shouldn't be external.  And, in the case where you want to track your versions, changes
should be stored in an intelligent manner.

Objects could be created using 2 strategies (or a combination of the two):
Functionally:  1) Create a blank object 2) Use a function to set its properties
Datally: 1) Create an object from data

For templates, if we use a functional approach, the entire template might just be a series of steps.
Composing these steps (adding, removing, reordering) could be used to manipulate the resulting HTML.

It might make sense to show:
  ->  Base Template
  +   Modifier/initializer fn
  +   Modifier/initializer(s) fn

Then, create a UI to add/remove classes/attr, and even create new el, or add new template as a child to any 
existing el, and wala- no need for function-based

If everything are just copies, couldn't you just use actual html, instead of the prototype system?
I think this would essentially accomplish the same thing, and would be way simpler.

HTML (stored in strings/files) -> jQuery -> copied -> back to str?

A big loss:  the ability to take one template, and add a class to it, and have another template.  Or, remove a particluar
element, or add an element.  These are all things that could be done by simply copying the html and editing it,
however its destructive - any changes to the original are not included.

And so the lesson here is, there are 3 different types of inheritance:
 - Dumb copy (no inheritance):  Any changes to either don't affect anything else
 - Runtime copy (only inherits at runtime):  This is much better than a dumb copy, but you'll need to reinitialize
 	the object to reinherit.  I don't see this as a huge problem.
 - Live inheritance:  Where everything happens in realtime.  This feature isn't necessary, yet having some inheritance
 	definitely is worth it.

*/
		}
	};
	$(function(){
		// HTML.tests.div();
		// HTML.tests.parent();
		HTML.tests.oneTwo();
		
	})
})(jQuery, MPL);