/* loader.js */

;(function(){

	//this function will work cross-browser for loading scripts asynchronously
	function loadScript(src, callback){
	  var s=document.createElement('script'),
	      r=false,
	      t;
	  s.type = 'text/javascript';
	  s.src = src;
	  s.onload = s.onreadystatechange = function() {
	    //console.log( this.readyState ); //uncomment this line to see which ready states are called.
	    if ( !r && (!this.readyState || this.readyState == 'complete') )
	    {
	      r = true;
	      callback();
	    }
	  };
	  t = document.getElementsByTagName('script')[0];
	  t.parentNode.insertBefore(s, t);
	}

/*
	TODO:
	1)  registerScript
	loader.scripts = {
		id: { id: id, deps: [id, id, id], ... }
		...
	}
	load scripts:  check deps
	might need an async system first
*/
	var loader = {
		scripts: [
			{
				id: 0,
				src: "js/jquery.js",
				name: "jQuery",
				cb: function(){
					console.log('jQuery loaded');
					jQuery(document).ready(function(){
						console.log('Document Ready');
					});
				}
			},
			{
				id: 1,
				src: "js/underscore.js",
				name: "Underscore"
			},			
			{
				id: 2,
				src: "js/events.module.js",
				name: "Events"
			},			
			{
				id: 3,
				src: "js/value.js",
				name: "Value"
			},			
			{
				id: 4,
				src: "js/valueObject.js",
				name: "ValueObject"
			},
			{
				id: 5,
				src: "js/supermethod.js",
				name: "SuperMethod"
			},
			{
				id: 6,
				src: "//cdnjs.cloudflare.com/ajax/libs/ace/1.1.3/ace.js",
				name: "Ace",
				cb: function(){
					var editor = ace.edit("editor");
				    editor.setTheme("ace/theme/monokai");
				    editor.getSession().setMode("ace/mode/javascript");
				}
			}
		],
		loadScripts: function(){
			this.scripts.forEach(function(script){
				loadScript(script.src, script.cb || function(){});
			});  
		}
	};

	loader.loadScripts();
})();