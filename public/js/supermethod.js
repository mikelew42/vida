;(function(MPL,$, _){
	/*
	Requirements for superMethod:

	- maintain function call context (with this.method)

	this.method is likely on a prototype.  I'm thinking about replacing
	this.method with the supermethod, however, this kills any prototyping, unless...

	I could reassign this.method 

	What if this upgrade happens at the prototype level?
	We reassign prototype.method to prototype._method, so that it can still inherit properly,
	and the original function is still maintained at _method, and can use "this".

	The prototypes will still be authored using prototype.method, it will happen at runtime that
	prototype.method is upgrade to prototype._method, and we'll still call .method() when we use it.

	Now, this should also work with non-prototypes.  Its the same process?  You'll replace the method
	with an underscored version.  

	All of these could be options:
	- expose original as _underscored, otherwise just store locally and don't expose (would block inheritance)

	How would that work?  You upgrade a prototype method, and then extend that 'class'...
	Replacing the original method shouldn't be a problem, all instances should work properly (although, they'd
	have to use base events to store supermethod events), because accessing the obj.method will always access
	the prototype's .method.

	If you extend the class, you'll be doing an Object.create(prototype), and that should still work correctly.

	In conclusion, upgrading prototype methods shouldn't be a problem.  I'm not sure how this compares with 
	actual instance methods though. 
	- we cannot bind the context to the prototype...
	- we could, however, have a bound() method that returns a copy of the fn that is bound.

	Why do we need a function to reside on the prototype?  Its marginally less memory, however I don't think
	this is even of concern.  It might make more sense, and significantly improve readability if I just bind 
	all super methods in an object init:  this.bindAll(); would loop through all super methods and bind them.
	 -->  This should re-install the super method... Using a different method that takes a ctx rather than
	 just using 'this'; 

	Options:
	- expose _original
	- 

	OO EVENT Objects vs SuperMethods
	These are very similar, yet might have slightly different recipes.  SuperMethods are hard-coded, events
	are more dynamic, with their info being stored in an events object, rather than directly on the object.
	Also, superMethods can be called(), where events have to be .triggered(), although these are similar
	concepts.

	obj.$eventize('evnt');
	obj.evnt(cb);
	obj.evnt(); // trigger

	obj.$functionize('sm');
	obj.sm(); // call the underlying, with any .require's and follow with any then's
	obj.sm.require(a); // either instantaneous check (maybe obj.sm.check(a)) vs at least once, etc

	Speaking of this 'require' validation... 
	obj.sm.require(a.n(1)) vs obj.sm.require(a.now())

	There are 2 function here:
	1) When sm() is called, check certain conditions before continuing
	2) Wait until some condition is met, and then trigger sm();

	The queuing could be done from the trigger's perspective.  But, it probably should be done from either...?
	when(a).then(b)..
	then(b).when(a)?
	before(a).do(b);
	before(a).check(b);
	before(a).waitFor(b);
	if(a).then(b);
	do(b).if(a);
	===
	foo.a.then(bar.b);
	b.when(a);

	All of these patterns boil down to their underlying concepts based on the event system (yet sm have an optional fn)



	Return Values
	+++++++++++++
	I think the conditional progression should depend 


	Current Events api:

	obj.on('evnt', cb, ctx);
	obj.off('evnt', cb, ctx);
	obj.trigger('evnt');

	*/

	if (typeof MPL !== "object")
		MPL = {};

	var Functionize = MPL.Fn = function(obj, fnName){
		var originalFn = obj['_' + fnName] =  obj[fnName] || function(){},
			newFn = obj[fnName] = function(){
				newFn.trigger('require', arguments);
				obj['_'+fnName].apply(obj, arguments);
				newFn.trigger('then', arguments);
			};
		$.extend(newFn, MPL.Events.prototype, {
			then: function(fn){
				newFn.on('then', fn);
			},
			require: function(fn){
				newFn.on('require', fn);
			}
		});
	};

	$(document).ready(function(){
		/* obj = {
			one: function(){
				console.log('one');
			},
			two: function(){
				console.log('two');
			},
			a: function(){
				console.log('a');
			}
		};

		Functionize(obj, 'one');
		Functionize(obj, 'two');
		obj.one.then(obj.two);
		obj.two.require(obj.a);
		obj.one.require(obj.a);
		obj.one();*/
	});


	var DefineMethod = function(obj, method, fn){
		obj = obj || {};
		var cbs = [],
			superMethod;

		superMethod = function(){
			var retVal;
			superMethod.arguments = arguments;
			for (var i = 0; i < cbs.length; i++){
				retVal = cbs[i].exec();

				if (typeof retVal == 'object' && retVal.superMethod){
					retVal.after(cbs[i+1]);
					break;
				}
			}
			return superMethod;
		};

		cbs.push(superMethod);

		// 'instance' checking
		superMethod.superMethod = true;

		superMethod.fn = fn;
		superMethod.ctx = obj;

		superMethod.exec = function(){
			return superMethod.fn.apply(superMethod.ctx, superMethod.arguments);
		};

		superMethod.after = function(sm){
			cbs.push(sm);
			return superMethod;
		};

		superMethod.before = function(sm){
			cbs.unshift(sm);
			return superMethod;
		};

		obj[method] = superMethod;
		return superMethod;
	};

	$(document).ready(function(){
		/* var myObj = {};

		DefineMethod(myObj, 'testMethod', function(){
			console.log('testMethod()');
		});
		DefineMethod(myObj, 'testMethod2', function(){
			console.log('testMethod2()');
		});

		myObj.testMethod.before(myObj.testMethod2);
		myObj.testMethod(); */
	});

})(MPL, jQuery, _);