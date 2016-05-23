define(['jquery'],function ($) {

	return {
		init:function () {
			console.log($(this));
			console.log(this);

			// 用法
			// $('div').each(function(index, el) {
			// 	console.log($(this).text());	
			// });
			// this === window;
			//javascript
			/*
			*
			*	1.函数调用模式的时候，this指向window
			*	2.方法调用模式的时候，this指向方法所在的对象
			*	3.使用构造函数调用函数。构造函数中 this 关键字没有任何的值,
			*			this 的值在函数调用时___
						实例化对象(new object)时___。
						function Person(name) {
							console.log(this);
							this.name = name;
						}
			*	4.apply/call调用模式的时候，this指向apply/call方法中的第一个参数
			*	5.作为方法的函数，this指向window
					var person = {
						name : "CC",
						getName : function() {
							return function(){ 
								return console.log(this) 
								}();
						}
					}
			*/
		}
	};
});