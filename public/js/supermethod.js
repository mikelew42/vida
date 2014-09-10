;(function(MPL,$, _){

	if (typeof MPL !== "object")
		MPL = {};

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