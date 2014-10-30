;(function($, MPL){

	var TM, 
		TemplateManager;


	
	var Template = MPL.Template = MPL.Base.factory({
		factory: "Template",
		initialize: function(tpl){
			$.extend(this, tpl);
			this.trigger('initialized');
			console.log('Template.created');
		},
		parse: function(tpl){
			var stdProps = ['tag', 'classes', 'text'],
			nest = !!$el,
			$el = $el || buildEl(tpl),
			newtpl;
		
		/* a) how are they stored (as properties on the View) and
		   b) how are they nested?  if you want different nesting, it might get tricky... 
		   AND, this nesting disappears if you reselect the elements with a new jQuery selector... 
		   You couldn't access this.$one.$two inside a $one handler using this.$two... for example. */
			for (var i in tpl){
				//console.log(i, tpl[i]);
				if (stdProps.indexOf(i) === -1){		
					$el[i] = BuildTemplate(tpl[i]);
					$el[i].appendTo($el);
				}
			}

			return $el;
		}
	});


	TM = TemplateManager = {
		types: {},
		register: function(type, factory){
			this.types[type] = factory;
		},
		create: function(tpl){
			if (tpl.type && this.types[tpl.type])
				return this.types[tpl.type](tpl);
			else
				return Template(tpl);
		}
	};

})(jQuery, MPL);