;(function($, MPL){
	
	MPL = MPL || {};

	var Process = MPL.Process = MPL.Factory({
		factory: "Process",
		constructor: function CreateProcess(){
			var process = function(fn){
				if (typeof fn === 'function'){
					return process.append(fn);
				}

				process.run();
			};

			process._fn = [];

			process.append = function(fn){
				process._fn.push(fn);
				return process;
			};

			process.prepend = function(fn){
				process._fn.unshift(fn);
				return process;
			};

			process.run = function(){
				for (var i = 0; i < process._fn.length; i++){
					/*
					normal fn will run and pass control back normally, and are either blocking
					or non-blocking and sync/async by their nature (nothing i can do);

					processes, however, are able to pass control back even though they're still in process.
					that doesn't mean we should continue with this process.  it might mean we need to return control
					to the app, and resume when a sub process has finished.

					the question is, how is this communication handled?

					what are the async options?
					[ first ] [ req - - - - - - - - res ] [ next ]
					vs
					[ first ] [ req ] [n1] [n2] [n3] = = = = = = res ] [a1] [a2]

					both are async, one is blocking and the other is not.

					technically, you could have 2 async processes happening at once, and they could cross
					reference each other, so that a response from one request is a condition of another request
					in another process chain?

					although, I would think that any process condition like this (process chain) should be a 
					process chain, so that you have a tangible reference to any of these relationships.

					As far as each process is concerned, it just needs to know when to run its next step.

					Some 'prerequisite' / 'require' patterns:

					proc.delayStart(a)
					proc.delayStart(b)
					||
					proc.delayStart(a.and(b));

					These delays are encapsulated/contained by the process, and wouldn't be visible to the parent
					process chain.

					If you had a process chain: 
					[a, b, c, d], and wanted to delay b, you could try to delay it at this level:

					[a, delayB, b, c, d]


					TO CLONE OR NOT TO CLONE
					If you delay a certain process within another:

					parentProc.someChild.delay(..)

					process.fork()...

					are you delaying someChild only here, or everywhere?  This is the question of whether to fork, and 
					might be a little challenging.  Sometimes, you might want to always manipulate the base process,
					but sometimes you might want to only affect this, and this gets even trickier once you add more levels...



					*/
				}
			};

			return process;
		}
	});

	var makeSM = function(baseFn){
		var sm = function(cb){
			if (typeof cb === 'function'){
				return sm.on('after', cb); // this needs to be a new event chain...
			}

			sm.trigger('before', arguments); // instead of triggering before, sm.before could be a sm, and we just sm.before.apply(this, arguments);
			sm.fn.apply(this, arguments);
			sm.trigger('after', arguments);
		};

		$.extend(sm, MPL.Events.prototype);

		sm.fn = baseFn;
		sm.before = function(cb){
			sm.on('before', cb);
		};
		sm.after = function(cb){
			sm.on('after', cb);
		};

		return sm;
	};

	Process.tests = {
		construct: function(){
			var proc = Process();
			console.log(proc);
		},
		subReplace: function(){

		}
	};

	$(function(){
		// Process.tests.construct();
		Process.tests.subReplace();

	});


	var testSyntax = function(){
		var proc = Process(function(){
			this.a();
			this.b();
			this.c();
		}).sub('a', function(){
			// do a
		}).sub('b', function(){
			this === proc;
			this.a();
			this.b();
			this.c();
		});

		// or

		// i think this would work, because existingProc, which targets itself.sub, should override these subs.
		// but.. you couldn't create a new proc this way...
		var proc = $.extend(Process(function(){}) || existingProc, { })


		obj.method = function(){
			this === obj;
			this.method.sub();
		};

		// vs

		obj.process = function(){
			this === process;
			this.sub();
			this.parent || this.target === obj;
		};
	};

})(jQuery);