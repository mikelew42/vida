var enableLogger = true;

;(function($){
	var isReady = false;

	$(document).ready(function(){
		isReady = true;
	});

	window.docReady = function(){
		return isReady;
	};

	$(document).ready(function(){
		wpxDebugInit();
	});

	var wpxDebugInit = window.wpxDebugInit = function ($context){
		if (!$context)
			$context = $(document);

		// this should work, but on reinitialization, it will create a new closure, and resave all of these variables...?
		// i'm not 100% sure it does, its an anonymous function.  BUT, because the call back refers to the private var, it probably saves the closure.
		$('.wpx-item', $context).each(function(){
			if ($(this).data('wpxDebugInit'))
				return true;

			var $item = $(this),
				$preview = $item.children('.wpx-item-preview'),
				$content = $item.children('.wpx-item-content'),
				clickHandler = function(){
					$content.slideToggle();
					console.log($item);
					$item.toggleClass('expanded');
					return false;
				};

			$preview.off('click', clickHandler).on('click', clickHandler);

			$item.data('wpxDebugInit', true);
		});
	}
})(jQuery);

;(function($){
	// admin bar stuff
	$(document).ready(function(){
		var $btn = $('#wp-admin-bar-wpx-debug-bar');
		var $debugPanel = $('#wpx-debug-panel'); // doesn't work with fixed position... .resizable({ handles: "w"});

		$btn.click(function(){
			$debugPanel.toggle();
		});
	});
})(jQuery);

(function($) {
	$.fn.closestDescendent = function(filter) {
		var $found = $(),
			$currentSet = this; // Current place
		while ($currentSet.length) {
			$found = $currentSet.filter(filter);
			if ($found.length) break;  // At least one match: break loop
			// Get all children of the current set
			$currentSet = $currentSet.children();
		}
		return $found.first(); // Return first match of the collection
	}
})(jQuery);

;(function($){

	$(document).ready(function(){



		$('[data-target]').each(function(){
			var $self = $(this),
				sel = $self.data('target'),
				$target = $self.closestDescendent(sel),
				$current = $self;

			while (!$target.length){
				$current = $current.parent();
				$target = $current.closestDescendent(sel);
			}

			$self.click(function(){
				$target.slideToggle();
			});
		});


		$('.item.auto-init').each(function(){
			var $self = $(this),
				$trigger = $self.closestDescendent('.preview'),
				$target = $self.closestDescendent('.view');

			$trigger.click(function(){
				$target.slideToggle();
				$self.toggleClass('expanded');
				if (!$self.hasClass('active')){
					$('.item.active').removeClass('active');
					$self.addClass('active');
				} else {
					$('.item.active').removeClass('active');
				}
			});
		});

	});

})(jQuery);


;(function($){

	$(document).ready(function(){
		MPL.Logger.logger({ doc: "ready" });
	});

	if (typeof MPL === "undefined")
		window.MPL = {};


	/***********************************************************************
	 ****   MPL.Logger
	 **********************************************************************/
	MPL.Logger = {
		initialize: function(){
			if (!enableLogger)
				return false;

			this.log = this.currentItem = (new MPL.ExpandableItem()).init();
			this.log.$preview.off('click').html('LLLLOOOGGGGERRRR<span class="close">CLOSE</span>');

			var logger = this;
			this.log.$preview.children('.close').click(function(){
				logger.log.$el.hide();
			});

			var logger = this;

			$(document).ready(function(){
				logger.render();
			});
		},
		render: function(){
			this.log.$el.addClass('logger').prependTo('body').draggable().resizable();
			this.log.expand();
		},
		getBacktrace: function(){
			var stack =
				((new Error).stack + '\n')
					.replace(/^\s+(at eval )?at\s+/gm, '') // remove 'at' and indentation
					.replace(/^([^\(]+?)([\n$])/gm, '{anonymous}() ($1)$2')
					.replace(/^Object.<anonymous>\s*\(([^\)]+)\)/gm, '{anonymous}() ($1)')
					.replace(/^(.+) \((.+)\)$/gm, '$1```$2')
					.split('\n')
					.slice(1, -1);

			var backtrace = [];

			for (var i in stack){
				stack[i] = stack[i].split('```');
				var bt = {
					func: stack[i][0],
					fullPathAndLine: stack[i][1]

				};

				var pathBreakdown = stack[i][1].split(':');
				bt.file = pathBreakdown[1].replace(/^.*[\\\/]/, '');
				bt.line = pathBreakdown[2];
				bt.linePos = pathBreakdown[3];

				backtrace.push(bt);
			}

			return backtrace.slice(2);
		},
		logger: function(values){
			if (!enableLogger)
				return false;

			var backtrace = this.getBacktrace();

			var file = new MPL.File();
			file.init().$preview.html(backtrace[0].file);

			var line = new MPL.Line();
			line.init().line(backtrace[0].line);

			if (typeof values === "string"){
				var newItem = new MPL.Item();
				newItem.init().content(values);
				if (newItem){
					line.addItem(newItem);
					file.addItem(line);
					if (backtrace[0].file)
						this.currentItem.addItem(file);
					else
						this.currentItem.addItem(newItem);
				}

			} else if (typeof values === "object"){
values.backtrace = this.getBacktrace();
				for (var i in values){
					var newItem = MPL.ItemFactory.createItem({
						name: i,
						value: values[i],
						parent: this.currentItem,
						backtrace: this.getBacktrace()
					});
					if (newItem){
						line.addItem(newItem);
						file.addItem(line);
						if (backtrace[0].file)
							this.currentItem.addItem(file);
						else
							this.currentItem.addItem(newItem);
					}
				}
			}

			return this;
		},
		group: function(options){
			// options.name === "Group Name"
			if (typeof options === "string"){
				options = { name: options };
			}
			options.parent = this.currentItem;
			options.backtrace = this.getBacktrace();
			var group = new MPL.GroupItem(options);
			this.currentItem = group;
			return this;
		},
		end: function(){
			if (this.currentItem.get('parent'))
				this.currentItem = this.currentItem.get('parent');

			this.scrollToBottom()

			return this;
		},
		ready: function(){
			return this.get('ready');
		},
		scrollToBottom: function(){
			if(this.ready() && true)
				this.view.$content.scrollTop(this.view.$content[0].scrollHeight);
			return this;
		}
	};

	/***********************************************************************
	 ****   MPL.ItemFactory
	 **********************************************************************/
	MPL.ItemFactory = {
		rules: [],
		registerItemConstructorOld: function(ItemConstructor){
			if (!this.rules[ItemConstructor.priority])
				this.rules[ItemConstructor.priority] = [];

			this.rules[ItemConstructor.priority].push(ItemConstructor);
		},
		createItemOld: function(options){
			for (var priority in this.rules){
				for (var i in this.rules[priority]){
					if ( this.rules[priority][i].validate(options) ){
						return new this.rules[priority][i](options);
					}
				}
			}
			return false;
		},
		createItem: function(options){
			// options: {
			// 		name: 'varName',
			// 		value: varName,
			//		parent?,
			// 		backtrace: {}[]
			// }

			if (!options.name){
				options.name = "";
			}
			if (typeof options.value === "object"){
				if ($.isArray(options.value)){
					var newArray = new MPL.Array();
					newArray.init(options);
					return newArray;
				} else {
					// add jQuery functionality back

					// default object

					if (!options.exhaust || !(options.value instanceof jQuery)){
						var newObject = new MPL.Object();
						newObject.init(options);
					} else {
						var newObject = new MPL.Item();
						newObject.init().$el.addClass('object');
						if (options.name)
							newObject.content(options.name + '[object]');
						else if (options.value instanceof jQuery)
							newObject.content('[jQuery]');
						else
							newObject.content('[object]');

						newObject.$el.click(function(){
							console.log(options.value);
							return false;
						});
					}
					return newObject;
				}
			} else {
				var newItem = new MPL.Item();
				newItem.init();
				if (typeof options.value === "undefined")
					options.value = "undefined";
				var newName = options.name + ": " + options.value;
				if (!options.name) newName = options.value;
				newItem.content(newName);
				return newItem;
			}
		}
	};

	/***********************************************************************
	 ****   MPL.Item
	 **********************************************************************/
	(MPL.Item = function(){}).prototype = {
		constructor: MPL.Item,
		init: function(){
			this.$el = $('<div></div>').addClass('item');
			return this;
		},
		content: function(){
			if (arguments[0]){
				this.$el.html(arguments[0]);
				return this;
			}
			return this.$el.html();
		},
		addItem: function(item){
			this.$el.append(item.$el);
			return this;
		}
	};

	/***********************************************************************
	 ****   MPL.ExpandableItem
	 **********************************************************************/
	$.extend((MPL.ExpandableItem = function(){}).prototype, new MPL.Item(), {
		init: function(){
			MPL.Item.prototype.init.call(this);
			this.$el.addClass('expandable collapsed');
			this.$preview = $('<div></div>').addClass('preview').appendTo(this.$el);
			this.$view = $('<div></div>').addClass('view').hide().appendTo(this.$el);
			this.initHandlers();
			return this;
		},
		initHandlers: function(){
			this.$preview.on('click', $.proxy(this.toggle, this));
			return this;
		},
		toggle: function(){
			if (this.$el.hasClass('collapsed'))
				this.expand();
			else if (this.$el.hasClass('expanded'))
				this.collapse();

			// will this affect the event bubbling?  don't think so, not sure what it'll do thou
			return false; // I think this is best
			return this;
		},
		expand: function(){
			this.$el.removeClass('collapsed');
			this.$view.slideDown($.proxy(function(){
				this.$el.addClass('expanded');
			}, this));

			return this;
		},
		collapse: function(){
			this.$el.removeClass('expanded');
			this.$view.slideUp($.proxy(function(){
				this.$el.addClass('collapsed');
			}, this));

			return this;
		},
		initChildren: function(){
			if (!this.$children)
				this.$children = $('<div></div>').addClass('children').appendTo(this.$view);
		},
		addItem: function(item){
			this.initChildren();
			this.$children.append(item.$el);
			return this;
		}
	});

	/***********************************************************************
	 ****   MPL.Table
	 **********************************************************************/
	$.extend((MPL.Table = function(){}).prototype, new MPL.ExpandableItem(), {
		init: function(){
			MPL.ExpandableItem.prototype.init.call(this);
			this.$table = $('<div></div>').addClass('table').prependTo(this.$view);
			return this;
		},
		addItem: function(item){
			this.$table.append(item.$el);
			return this;
		}
	});

	/***********************************************************************
	 ****   MPL.TableRow
	 **********************************************************************/
	$.extend((MPL.TableRow = function(){}).prototype, new MPL.Item(), {
		init: function(){
			MPL.Item.prototype.init.call(this);
			this.$el.addClass('tr');
			this.$name = $('<div></div>').addClass('table-row-name td').prependTo(this.$el);
			this.$value = $('<div></div>').addClass('table-row-value td').appendTo(this.$el);
			return this;
		},
		addItem: function(item){
			this.$value.append(item.$el);
			return this;
		}
	});

	/***********************************************************************
	 ****   MPL.File
	 **********************************************************************/
	$.extend((MPL.File = function(){}).prototype, new MPL.Table(), {
		init: function(){
			MPL.Table.prototype.init.call(this);
			this.$el.addClass('file dark');
			this.$preview.addClass('file-name');
			return this;
		}
	});

	/***********************************************************************
	 ****   MPL.Line
	 **********************************************************************/
	$.extend((MPL.Line = function(){}).prototype, new MPL.TableRow(), {
		init: function(){
			MPL.TableRow.prototype.init.call(this);
			this.$el.addClass('line');
			this.$line = this.$name.addClass('line-number-col');
			this.$content = this.$value.addClass('line-content');
			return this;
		},
		line: function(){
			if (arguments[0]){
				this.$line.html(arguments[0]);
				return this;
			}
			return this.$line.html();
		}
	});

	/***********************************************************************
	 ****   MPL.Object
	 **********************************************************************/
	$.extend((MPL.Object = function(){}).prototype, new MPL.Table(), {
		init: function(options){
			MPL.Table.prototype.init.call(this);
			this.$el.addClass('object');

			if (!options.name)
				options.name = "";

			this.$preview.html(options.name + '[object]');

			var newObject = this;
			_(options.value).each(function(v, i){
				var newProp = new MPL.Property();
				newProp.init({ name: i, value: v });
				newObject.addItem(newProp);
			});
			return this;
		}
	});

	/***********************************************************************
	 ****   MPL.Property
	 **********************************************************************/
	$.extend((MPL.Property = function(){}).prototype, new MPL.TableRow(), {
		init: function(options){
			MPL.TableRow.prototype.init.call(this);
			this.$el.addClass('property');
			this.$name.html(options.name);
			this.addItem(MPL.ItemFactory.createItem({ value: options.value, exhaust: true }));
			return this;
		}
	});

	/***********************************************************************
	 ****   MPL.Array
	 **********************************************************************/
	$.extend((MPL.Array = function(){}).prototype, new MPL.Table(), {
		init: function(options){
			MPL.Table.prototype.init.call(this);
			this.$el.addClass('array');

			if (!options.name)
				options.name = "";

			this.$preview.html(options.name + '[array]');

			var newArray = this;
			_(options.value).each(function(v, i){
				var newIndex = new MPL.Index();
				newIndex.init({ value: v, index: i });
				newArray.addItem(newIndex);
			});

			return this;
		}
	});

	/***********************************************************************
	 ****   MPL.Index
	 **********************************************************************/
	$.extend((MPL.Index = function(){}).prototype, new MPL.TableRow(), {
		init: function(options){
			MPL.TableRow.prototype.init.call(this);
			this.$el.addClass('index');
			this.$name.html("[" + options.index + "]");
			this.addItem(MPL.ItemFactory.createItem({ value: options.value }));
			return this;
		}
	});

	$(function(){
		
	MPL.Logger.initialize();
	MPL.Logger.logger({ undefined: undefined, myarray: [1, 2, 'three', ['four', {5: 'five', 6: 'six'}, 'seven'], 'eight', 9],
	myobj: (new MPL.ExpandableItem()).init() });
	})
})(jQuery);