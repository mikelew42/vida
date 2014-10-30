;(function($, MPL){

	var Obj = MPL.Obj,
		objs = [];
	
	Obj.on('new', function(o){
		objs.push(o);
	});

})(jQuery, MPL);