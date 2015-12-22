	var TestProc1 = View.fork({
		testProc: $.extend(true, function(){
				this.testProc.a();
				this.testProc.b();
				this.testProc.c();
			}, {
				a: function(){
					console.log('testProc.a()');
					this.a.a1();			},
				b: function(){
					console.log('testProc.b()');
				},
				c: $.extend(
					function(){
						console.log('testProc.c()');
						this.c.c1();
						this.c.c2();
					}, {
						c1: function(){
							console.log('testProc.c.c1()')
						},
						c2: function(){
							console.log('testProc.c.c2()');
						}
					}
				)
			}, {
				a: {
					a1: function(){
						console.log('testProc.a.a1()');
					}
				}
			}
		)
	});

	var TestProcExt = TestProc1.fork({
		testProc: {
			b: function(){
				console.log('testProc.b() EXT');
			},
			c: {
				c2: function(){
					console.log('testProc.c.c2() EXT');
				}
			}
		}
	});