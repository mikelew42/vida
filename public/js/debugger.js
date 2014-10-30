;(function(MPL, $, _){

	if (typeof MPL !== "object")
		MPL = {};

	var DebugValue = function(val){
		
	};

	var Debugger = MPL.Debugger = MPL.Base.extend({
		initialize: function(){
			this.contents = [];
		},
		log: function(val){
			this.contents.push(new DebugValue(val));
		}
	});

	$(function(){
		var dbg = new Debugger();
	});

})(MPL, jQuery, _);