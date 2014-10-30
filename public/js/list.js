;(function(MPL, $, _){

	if (typeof MPL !== "object")
		MPL = {};

	var List = MPL.List = function List(opts){
		$.extend(this, opts);
	};

	List.prototype = $.extend(Object.create(MPL.Events.prototype), {
		constructor: List
	});

})(MPL, $, _);