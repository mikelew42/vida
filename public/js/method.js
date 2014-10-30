;(function(MPL){
	if (typeof MPL !== "object")
		MPL = {};

	var Method = MPL.Method = function Method(opts){
		$.extend(this, opts);
	};

	Method.prototype = $.extend(Object.create(MPL.Events.prototype), {
		
	});
	
})(MPL);