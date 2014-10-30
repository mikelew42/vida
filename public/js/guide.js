;(function($, MPL){

	var Guide = MPL.Guide = MPL.Base.extend({
		initialize: function(opts){
			$.extend(this, opts);
			this.$render();
		},
		$render: function(){
			// Creates canvas 320 × 200 at 10, 50
			this.paper = Raphael(0, 0, 100, 100);
			$(this.paper.canvas).appendTo(this.$el).attr('height', this.$el.marginBox().height)
			.attr('width', this.$el.marginBox().width).css('left', this.$el.marginBox().left - this.$el.paddingBox().left)
			.css('top', this.$el.marginBox().top - this.$el.paddingBox().top);

			this.paper.bg = this.paper.rect(0,0,100,100).attr('width', '100%')
				.attr('height', '100%').attr('fill', 'rgba(100,0,0,0.25)').attr('stroke', false);

			this.paper.content = this.paper.rect(this.$el.contentBox().left - this.$el.marginBox().left,
				this.$el.contentBox().top - this.$el.marginBox().top, this.$el.contentBox().width, this.$el.contentBox().height)
				.attr('fill', 'rgba(0,0,0,0.25)').attr('stroke', false);

			$(this.paper.content[0]).hover(function(){
				$(this).attr('class', 'test');
			}, function(){
				$(this).attr('class', null);
			});

			var draggie = new Draggabilly(this.paper.content[0]);
		}
	});

	$.fn.guide = function(){
		return this.each(function(){
			var $this = $(this);
			$this.data('guide', new Guide({$el: $this}));
		});
	};

	$(document).ready(function(){
		$('<div>').css({
			width: '50%',
			margin: '50px auto',
			padding: '50px',
			background: '#ddd',
			border: '15px solid green',
			boxSizing: 'border-box'
		}).html('This is just a test')
		.appendTo('body').guide();
	});

})(jQuery, MPL);