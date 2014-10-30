;(function($, MPL){
	var Obj = MPL.Obj = MPL.Base.factory({
		initialize: function(opts){
			this.$prop('name');
			$.extend(this, opts);
			this.trigger('initialized');
		},
		$render: function($appendTo){
			this.$el = BuildTemplate(itemTemplate); //.appendTo($appendTo);
			this.$el.appendTo($appendTo);
			if (this.name) this.$el.$preview.$name.html(this.name);
			this.$prop('name').bindTo(this.$el.$preview.$name);
			this.$el.$view.$test.click(function(){
				var divs = [];
				for (var i = 0; i < 100000; i++ )
					divs.push($('<div>'));

				console.log('done');
			});
		},
		$render2: function($appendTo){
			if (!this.$el)
				this.$el = $('<div>').addClass('item expandable');

			if (!this.$el.$preview)
				this.$el.$preview = 
					$('<div>').addClass('preview').appendTo(this.$el);

			var self = this;
			this.$el.$preview.click(function(){
				console.log('clicked');
				self.$el.$view.slideToggle();
			});

			if (!this.$el.$preview.$icon)
				this.$el.$preview.$icon = 
					$('<i>').addClass('fa fa-cubes').appendTo(this.$el.$preview);

			if (!this.$el.$preview.$name)
				this.$el.$preview.$name =
					$('<span>').addClass('name').appendTo(this.$el.$preview);

			if (this.name) this.$el.$preview.$name.html(this.name);
			this.$prop('name').bindTo(this.$el.$preview.$name);

			if (!this.$el.$preview.$gear)
				this.$el.$preview.$gear =
					$('<i>').addClass('fa fa-gear fr btn').appendTo(this.$el.$preview);

			if (!this.$el.$preview.$type)
				this.$el.$preview.$type =
					$('<span>').addClass('type fr').html('object').appendTo(this.$el.$preview);

			if (!this.$el.$view)
				this.$el.$view = 
					$('<div>').addClass('view').appendTo(this.$el);

			if (typeof $appendTo !== "undefined")
				this.$el.appendTo($appendTo);
		}
	});

	var seeBelowForPrototypeRendering = function(){
		// this is an old rendering fn that shows how to create templates
		// with raw jquery
	};

	var potentialPrototypicalRendering = function(){
		var renderEl = function(){};
		var renderPreview = function(){
			renderIcon();
			renderName();
			renderGear();
			renderType();
		};

		// override the root fn, or any other fn, to adjust the template.
		// not as easily stored...
		renderEl();
		renderPreview();
	}

/*
fork itemTemplate (forkTemplate = Object.create(itemTemplate)), and alter it
to create a hierarchical template.

I might have to fork each sub-template in order to accomplish a deep fork.

A potential issue:  if you rename a property, or reorganize a property's depth,
the forked item will not inherit these changes.

This is especially important with html templates, because its likely their structure
will be reorganized.

!! Write templates in html, and automatically (live) convert to this form, and
achieve the inheritance desired?  Diffing the changes, and creating the proper
base/ext from this diff wouldn't be easy, but not impossible:
	- compare before/after
	- iterate through each element to find changes
	- particular cases:
		- wrapping an element (would have to drill down to try and find matches)
		- moving an element (would have to search around to find matches)
*/
	var itemTemplate = {
		classes: "item expandable",
		$preview: {
			classes: "preview",
			$icon: {
				tag: "i",
				classes: "fa fa-cubes"
			},
			$name: {
				tag: "span",
				classes: "name"
			},
			$gear: {
				tag: "i",
				classes: "fa fa-gear fr btn"
			},
			$type: {
				tag: "span",
				classes: "type fr",
				text: "object"
			}
		},
		$view: {
			classes: 'view',
			$test: { text:"Yo"}
		}
	};

	var BuildTemplate = function(tpl, $el){
		var stdProps = ['tag', 'classes', 'text'],
			nest = !!$el,
			$el = $el || buildEl(tpl),
			newtpl;
		
		for (var i in tpl){
			//console.log(i, tpl[i]);
			if (stdProps.indexOf(i) === -1){		
				$el[i] = BuildTemplate(tpl[i]);
				$el[i].appendTo($el);
			}
		}

		return $el;
	};

	var buildEl = function(el){
		var tag = el.tag || "div",
			classes = el.classes || "",
			text = el.text || "";

		return $('<' + tag + '>').addClass(classes).html(text); 
	};
})(jQuery, MPL);