		var obj = {
			render: $.extend(function(){
				console.log(this);
				this.render.a();
				this.render.b();
			}, {
				a: function(){
					console.log('a');
				},
				b: function(){
					console.log('b');
				}
			}),
			another: 'prop'
		};

		obj.render();

		var obj2 = {
			render: obj.render
		};

		obj2.render.b = function(){ console.log('b replace'); }

		obj2.render();

		obj.render();


		var extProc = function(){
			proc.a();
			proc.b();
		};
		var subReplace = function(){
			var proc = function(){
				proc.a();
				proc.b();
			};

			proc.a = function(){console.log('a');}
			proc.b = function(){ console.log('b');}

			proc();

			$.extend(proc, { a: function(){ this.b(); },
				b: function(){ console.log('b replace'); }});

			proc();

			// extProc(); // proc not defined
		};

		// subReplace();