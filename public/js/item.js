;(function($, MPL){
	var Item = MPL.Item = MPL.Base.extend({
		constructor: function Item(name){
			// make this call an initailize, so you don't have to redo this every tijme?
			MPL.Base.apply(this, arguments);

			// move this to prototype?
			MPL.Value.install({
				obj: this,
				name: 'name'
			});
			this.name = name;
			this.$parent = $('body');
			this.$render();
		},
		$render: function(append){
			if (typeof append === 'undefined')
				append = true;

			if (!this.$el){
				this.$el = $('<div></div>').addClass('item');
				this.$el.$name = $('<div>').html(this.name).appendTo(this.$el);
				this.$name.bindTo(this.$el.$name);

				var $newProp = this.$el.$newProp = $('<div>').addClass('new-prop');

				var hoverIn = function(){
					$(this).attr('contenteditable', true).focus().selection('setPos', {start:0, end: 3});
				};		
				var hoverOut = function(){
					$(this).removeAttr('contenteditable');
				};
				$newProp.$name = $('<input>')
					//.addClass('propNameInput')
					//.on('mouseenter', hoverIn)
					//.on('mouseleave', hoverOut)
					.appendTo($newProp)
					//.on('mousedown', function(){
					//	$(this).off('mouseenter', hoverIn).off('mouseleave', hoverOut);
					//});

				$newProp.append(': ');

				var self = this;
				$newProp.$value = $('<input>').appendTo($newProp).keypress(function(e){
					if (e.which === 13){
						var newPropName = $newProp.$name.val();
						self.$prop(newPropName);
						self[newPropName] = $newProp.$value.val();
						$newProp.$name.val('');
						$newProp.$value.val('');
						self.$renderProperties();
					}
				});

				// container for existing properties
				this.$el.$props = $('<div>').appendTo(this.$el);
				this.$el.$newProp.appendTo(this.$el);
			}

			this.$renderProperties();

			if (append)
				this.$el.appendTo(this.$parent);

			return this.$el;
		},
		$renderProperties: function(){
			this.$el.$props.empty();
			for (var i in this.$_properties){
				this.$_properties[i].$render();
			}
			//this.$log();
		},
		$log: function(){
			console.log('+++++++++++');
			console.log(this.$name + " Properties:");
			var prop;
			for (var i in this.$_properties){
				prop = this.$_properties[i];
				console.log(prop.name + ": " + prop.value);
			}
			console.log('+++++++++++');
		}
	});


	Item.test1 = function(){
		window.item = new Item('item');
		item.$prop('$name').change(function(){
			console.log('changed $name to: ' + item.$name);
		});
		item.$name = 'anotherName';
	};

	Item.multipleItems = function(){
		window.item1 = new Item('FirstItem');
		window.item2 = new Item('SecondItem');
		item1.$render();
		item2.$render();
		item1.$el.click(function(){
			item1.$name = 'One';
		});
		item1.$prop('$name').bindTo($('#txt'));
		item1.$prop('$name').bindTo($('#txt2'));
	};

	Item.renderManager = function(){
		var $mgr = this.$mgr = $('<div></div>').appendTo($('body')),
			$title = $mgr.$title = $('<div>Item Manager</div>').appendTo($mgr),
			$btns = $mgr.$btns = $('<div></div>').appendTo($mgr),
			$add = $btns.$add = $('<div>Add</div>').appendTo($btns),
			$addInput = $add.$input = $('<input>').appendTo($add),
			$addBtn = $add.$addBtn = $('<div>>></div>').css({ display: 'inline-block', cursor: 'pointer' }).appendTo($add);
			$items = this.$mgr.$items = $('<div></div>').appendTo($mgr);

		var items = [];
		var addItem = function(){
			var item = new Item($addInput.getValue());
			window[item.$name] = item;
			$addInput.setValue('');
		};

		$addInput.keypress(function(e){
			if (e.which === 13)
				addItem();
		})
	}

	$(document).ready(function(){
		//Item.multipleItems();
		//Item.renderManager();
		//new Item('Test');
	});

})(jQuery, MPL);