;(function($){

	var View = Base.fork({
		type: "View",
		tag: 'div',
		initialize: function(){
			// this initialize process could be broken down into finer grained pieces, like
			// _view_init.  Or, init is a process that can have dynamically added events?
			// that might require some inner workings in the Base.fork functionality, to 
			// add initializer call backs on init...
			/*
			As a rule, don't add any initializers that can't be 'undone' or removed/readded (delayed).
			For example, all properties could be deeply merged down onto the object BEFORE init cbs fire,
			and each init cb checks its own on/off switch.  This would allow anyone to turn off this functionality
			if they were having a problem with it.  They should be able to add it back later...
			*/
			this.render();
			arguments.length && this.set.apply(this, arguments);
			this.ready && this.ready();
		},
		render: function(tag){
			tag = tag || this.tag || 'div';
			this.$el = $('<' + tag + '>');
			return this;
		},
		append: function(){
			if (arguments.length){
				for (var i = 0; i < arguments.length; i++){
					this.smartAppend(arguments[i]);
				}
			}
			return this;
		},
		smartAppend: function(o){
			// switch for .$el object vs jQuery object
			if (o && o.$el)
				this.appendView(o);
			else
				this.$el.append.call(this.$el, o);

			return this;
		},
		appendView: function(view){
			var typeUncapitalized = view.type[0].toLowerCase() + view.type.slice(1);
			if (view.type){
				if (!this[typeUncapitalized])
					this[typeUncapitalized] = view;

				(this[typeUncapitalized + 's'] || (this[typeUncapitalized + 's'] = [])).push(view);
			}

			if (view.$el)
				this.$el.append.call(this.$el, view.$el);

			return this;
		},
		/* it would be nice to make views return a fn obj that IS the getset fn, that also has 
		all these methods added to it.  this means no prototypes, but might be a nice alternative. 
		for now, just stick with the getset for more flexibility.  all these recipes should be 
			OPTIONS. */
		getset: function(){
			var subview = this;
			return function(){
				if (arguments.length){
					subview.set.apply(subview, arguments);
					return this;
				} else {
					return subview;
				}
			};
		},
		set: function(html){
			this.$el.html.apply(this.$el, arguments);
			return this;
		},
		click: function(cb){
			// this is nice, but makes it harder to remove this event in the future
			// a potential solution is to loop through these and bind them so that the
			// actual view.click fn is already the proxy, so it could be used directly 
			// with this.$el.off('click', this.click);
			this.$el.click.call(this.$el, $.proxy(cb, this));
			return this;
		}
	});

	var aliasFnToEl = function(fn){
		return function(){
			this.$el[fn].apply(this.$el, arguments);
			return this;
		};
	};

	[	'appendTo', 'prependTo', 'addClass', 'removeClass', 
		'css', 'attr', 'remove', 'empty', 'hasClass'].forEach(function(v){
			View.prototype[v] = aliasFnToEl(v);
	});

	var Container = View.fork({
		set: function(){
			this.append.apply(this, arguments);
			return this;
		}
	});

	var Icon = View.fork({
		type: "Icon",
		icon: "info",
		render: function(name){
			this.$el = $('<i>').addClass('fa');
			this.icon && this.set(this.icon);
			return this;
		},
		set: function(name){
			if (name){
				// remove old class
				if (this._name)
					this.$el.removeClass('fa-' + this._name);

				// add this one
				this.$el.addClass('fa-' + name);

				// store name for later removal
				this._name = name;
			}
			return this;
		}
	});

	var Item = Container.fork({
		type: "Item",
		render: function(){
			this.$el = $('<div>').addClass('item');
		}
	});

	var Item2 = Item.fork({
		type: "Item2",
		icon: "beer",
		render: function(){
			this.renderEl();
			this.renderIcon(this.icon || "beer");
		},
		renderEl: function(){
			Item.prototype.render.apply(this, arguments);
			this.$el.addClass('no-pad');
		},
		// if this were render.icon, it would be easier to track dependencies (any obj with 'render' could add render.icon)...?
		renderIcon: function(icon){
			// this.append(Icon('beer'));
			this.icon = 
				Icon(icon)
					.prependTo(this.$el)
					.addClass('icon')
					.getset();
		},
		renderTitle: function(){
			this.$title = $('<span>').addClass('title').appendTo(this.$el);
		},
		title: function(title){
			// this is an example of an optional element
			// these won't be used as much as mandatory elements
			if (!this.$title)
				this.renderTitle();

			this.$title.html(title);
			return this;
		}
	});

	var LazyView = View.fork({
		initialize: function(){
			// do not auto-render, or maybe just no auto-append...?
			arguments.length && this.set.apply(this, arguments);
			this.ready && this.ready();
		},
		set: function(){
			if (!this.$el)
				this.render();
			return View.prototype.set.apply(this, arguments);
		}
	});

	var Title = View.fork({
		render: function(){
			this.$el = $('<span>').addClass('title');
			return this;
		}
	});	

	var Subtitle = View.fork({
		render: function(){
			this.$el = $('<span>').addClass('subtitle');
			return this;
		}
	});

	var Item3 = Item2.fork({
		type: "Item3",
		icon: "plane",
		render: function(){
			Item2.prototype.render.apply(this, arguments);
			this.renderRight();
			this.subtitle = Subtitle(this.type).appendTo(this.$right).getset();
			// if necessary:
			this.$subtitle = this.subtitle().$el; // just as easy to use the second version...
		},
		renderRight: function(){
			this.$right = $('<div>').addClass('right-side fr').appendTo(this.$preview || this.$el);
		}
	});

	var Item4 = Item3.fork({
		type: "Item4",
		icon: "space-shuttle",
		render: function(){
			Item3.prototype.render.apply(this, arguments);
			var item = this;
			this.gears = Icon('gears').appendTo(this.$right)
				.click(function(){
					console.log(item);
				})
				.addClass('btn')
				.getset();
		}
	});

	var extend = Base.extend;
	// RootedMethod means all sub fn will be applied with this === host obj.
	var RMethod = function(fn, ext1, ext2){
		var method = function(){
			return method.fn.apply(this, arguments);
		};
		Object.defineProperties(method, {
			fn: {
				enumerable: false,
				value: function(){
					console.log('RMethod fn()', this);
					for (var i in method) 
						typeof method[i] === 'function' && method[i].apply(method, arguments);
				}
			},
			extend: {
				enumerable: false,
				value: function(v){
					console.log('extending RMethod', this);
					if (typeof v === 'function')
						this.fn = v;
					else
						extend(this, v);
				}
			}
		});
		if (fn)
			method.fn = fn;
		
		if (arguments.length > 1)
			for (var i = 1; i < arguments.length; i++)
				method.extend(arguments[i]);

		return method;
	}

	var ExpandableItem = Item.fork({
		icon: 'university',
		expanded: false,
		render: function(){
			Item.prototype.render.apply(this, arguments);
			this.$el.addClass('no-pad expandable');

			var self = this,
				origIcon = this.icon;
			this.$preview = $('<div>').addClass('preview').prependTo(this.$el).click(function(){
				if (self.expanded)
					self.collapse();
				else
					self.expand();
			}).hover(function(){
				if (self.expanded)
					self.icon('minus');
				else
					self.icon('plus');
			}, function(){
				self.icon(origIcon);
			});

			this.$view = $('<div>').addClass('view').appendTo(this.$el).html('Yo');

			if (!this.expanded){
				this.$view.hide();
				this.addClass('collapsed');
			}

			this.icon = 
				Icon(this.icon)
					.prependTo(this.$preview)
					.addClass('icon')
					.getset();

			this.title =
				Title()
					.appendTo(this.$preview)
					.getset();
		},
		expand: function(){
			var self = this;
			if (self.$preview.is(':hover')) self.icon('minus');
			this.$view.slideDown(function(){
				self.addClass('expanded').removeClass('collapsed');
				self.expanded = true;
			});
			return this;
		},
		collapse: function(){
			var self = this;
			if (self.$preview.is(':hover')) self.icon('plus');
			this.$view.slideUp(function(){
				self.removeClass('expanded').addClass('collapsed')
				self.expanded = false;
			});
			return this;
		}
	});

	var InitializerTest = Base.fork({
		initialize: function(){
			for (var i in this.initialize)
				this.initialize[i].apply(this, arguments);
		}
	});

	var InitializerTest2 = InitializerTest.fork({
		initialize: {
			c: function(){
				console.log('initialize.c', this);
			},
			a: function(){
				console.log('initialize.a', this);
			}
		}
	});	

	var InitializerTestA = Base.fork({
		initialize: RMethod()
	});

	var InitializerTestA2 = InitializerTestA.fork({
		initialize: {
			fn: function(){
				this.initialize.a();
				this.initialize.c();
			},
			c: function(){
				console.log('initializeA.c', this);
			},
			a: function(){
				console.log('initializeA.a', this);
			}
		}
	});

	$(function(){
		item = Item( 
			Icon('gears'), 
			Icon('plane'), 
			Icon('cubes'),
			Icon(),
			'Item'
		).appendTo('.items');
		beer = Item2().title('Have some beer').appendTo('.items');
		// beer.icon.name('plane');
		typed = Item3().title('Have a plane').appendTo('.items');
		geared = Item4().title('Lets go to the moon').appendTo('.items');
		expando = ExpandableItem().title('Test Expando').appendTo('.items');
		expando2 = ExpandableItem().title($('<h3>').html('Test HTML')).appendTo('.items');

		/* .title( 'str' ) .title( jQuery ) .title(View w/ view.$el) 
		and .append/appendTo('str content' or '.sel', jQuery, view with view.$el) */

		init2 = InitializerTestA2();
	});

})(jQuery);