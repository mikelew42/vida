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
		scripts: {
			0: {
				id: 0,
				src: "js/jquery.js",
				name: "jQuery",
				cbs: [
					function(){
						console.log('jQuery loaded');
						jQuery(document).ready(function(){
							console.log('Document Ready');
						});
					}
				],
				deps: []
			},
			1: {
				id: 1,
				src: "js/underscore.js",
				name: "Underscore",
				deps: []
			},			
			2: {
				id: 2,
				src: "js/events.module.js",
				name: "Events",
				deps: [1]
			},			
			3: {
				id: 3,
				src: "js/value.js",
				name: "Value",
				deps: [0, 2]
			},			
			4: {
				id: 4,
				src: "js/valueObject.js",
				name: "ValueObject",

			},
			5: {
				id: 5,
				src: "js/supermethod.js",
				name: "SuperMethod"
			},
			6: {
				id: 6,
				src: "//cdnjs.cloudflare.com/ajax/libs/ace/1.1.3/ace.js",
				name: "Ace",
				cbs: [
					function(){
						var editor = ace.edit("editor");
					    editor.setTheme("ace/theme/monokai");
					    editor.getSession().setMode("ace/mode/javascript");
					}
				]
			}
		},
		enqueueDeps: function(){
			var loader = this;
			this.scripts.forEach(function(script){
				if (script.deps && script.deps.length){
					var depsFinished = {
						total: script.deps.length,
						finished: 0,
						check: function(){
							if (finished === total)
								this.done();
						},
						done: function(){

						}
					};
					script.deps.forEach(function(id){
						loader.scripts[id].cbs = loader.scripts[id].cbs || [];
						loader.scripts[id].cbs.push(function(){
							depsFinished.finished++;
							depsFinished.check();
						})
					})
				}
			})
		},
		loadScripts: function(){
			this.scripts.forEach(function(script){
				loadScript(script.src, script.cbs || function(){});
			});  
		}
	};

	loader.loadScripts();
})();