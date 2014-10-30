;(function($, MPL){

	var MGR;

	var Template = MPL.Template = MPL.Base.extend({
		initialize: function(opts){
			$.extend(this, opts);
			this.$render();
		},
		$render: function(){
			this.$el = $('<' + this.tag + '>').addClass(this.class).css('position', 'relative').appendTo('body');
			this.$styles = $('<textarea>').appendTo(this.$el);
			this.$prop('styles').bindTo(this.$styles);
			var self = this;
			this.$prop('styles').change(function(){
				console.log('template.styles is now ', self.styles);
			});
			this.$label = $('<div>').html(this.tag + '.' + this.class).css({
				position: 'absolute',
				top: '-20px',
				background: '#fff'
			}).hide().appendTo(this.$el);
			this.$el.hover(function(){
				self.$label.toggle();
			});

			MGR.registerNewStyle(this);
		}
	});

	var TemplateMgr = MPL.TemplateMgr = MPL.Base.extend({
		initialize: function(){
			this.$dyn = $('<style>').appendTo('head');
			this.ss = this.$dyn[0].sheet;
			this.templates = [];

			var self = this;
			$(document).ready(function(){
				self.$render();
			});

		},
		$render: function(){
			var self = this;
			this.$el = $('<div>').addClass('template-mgr').appendTo('body');
			this.$newTemplate = $('<div>').addClass('new-template').appendTo(this.$el).append('Tag: ');
			this.$newTemplateTag = $('<input>').appendTo(this.$newTemplate);
			this.$prop('newTemplateTag').bindTo(this.$newTemplateTag);
			this.$newTemplate.append(' Class: ');
			this.$newTemplateClass = $('<input>').appendTo(this.$newTemplate);
			this.$prop('newTemplateClass').bindTo(this.$newTemplateClass);
			this.$addNewTemplateBtn = $('<button>Add New Template</button>').appendTo(this.$newTemplate)
				.click(function(){
					self.addNewTemplate();
				});

		},
		addNewTemplate: function(){
			var newTemplate = new Template({tag: this.newTemplateTag, class: this.newTemplateClass })
		},
		registerNewStyle: function(template){
			var index = this.ss.cssRules.length;
			this.ss.addRule('.' + template.class, template.styles, this.ss.cssRules.length);
			var self = this;
			template.$prop('styles').change(function(){
				self.updateStyle(template, index);
			});
		},
		updateStyle: function(template, index){
			this.ss.removeRule(index);
			this.ss.addRule('.' + template.class, template.styles, index);
		}
	});

	MGR = new TemplateMgr();

	$(document).ready(function(){
		MGR.newTemplateTag = 'div';
		MGR.newTemplateClass = 'yo';
		MGR.addNewTemplate();
	});

})(jQuery, MPL);