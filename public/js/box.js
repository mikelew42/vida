(function($){
	$.fn.contentBox = function(){
		return {
			width: this.width(),
			height: this.height(),
			left: contentLeft(this),
			right: contentRight(this),
			top: contentTop(this),
			bottom: contentBottom(this)
		};
	};

	$.fn.paddingBox = function(){
		return {
			width: this.width() + pxToInt(this.css('padding-left')) + pxToInt(this.css('padding-right')),
			height: this.height() + pxToInt(this.css('padding-top')) + pxToInt(this.css('padding-bottom')),
			left: contentLeft(this) - pxToInt(this.css('padding-left')),
			right: contentRight(this) + pxToInt(this.css('padding-right')),
			top: contentTop(this) - pxToInt(this.css('padding-top')),
			bottom: contentBottom(this) + pxToInt(this.css('padding-bottom'))
		};
	};

	$.fn.borderBox = function(){
		return {
			width: this.outerWidth(),
			height: this.outerHeight(),
			left: this.offset().left,
			right: this.offset().left + this.outerWidth(),
			top: this.offset().top,
			bottom: this.offset().top + this.outerHeight()
		};
	};

	$.fn.marginBox = function(){
		return {
			width: this.outerWidth(true),
			height: this.outerHeight(true),
			left: this.offset().left - pxToInt(this.css('margin-left')),
			right: this.offset().left - pxToInt(this.css('margin-left')) + this.outerWidth(true),
			top: this.offset().top - pxToInt(this.css('margin-top')),
			bottom: this.offset().top - pxToInt(this.css('margin-top')) + this.outerHeight(true)
		};
	};


	function contentLeft($el){
		return $el.offset().left + pxToInt($el.css('border-left')) + pxToInt($el.css('padding-left'))
	}

	function contentRight($el){
		return contentLeft($el) + $el.width();
	}

	function contentTop($el){
		return $el.offset().top + pxToInt($el.css('border-top')) + pxToInt($el.css('padding-top'))
	}

	function contentBottom($el){
		return contentTop($el) + $el.height();
	}

	function pxToInt(string){
		return parseInt(string.replace('px', ''));
	}
})(jQuery);