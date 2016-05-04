# jQuery学习 #

----------
###jQuery选择器###
	基本选择器   
				#id        $("#test")
                .class     $(".test")
                element    $("p")
                *          $("*")
                selector1,selector2,selector3
						   $("div,span,p.myClass")
	层次选择器   
				所有后代    $("div span")
				子代	       $("div >span")
			    下一个同辈  $(".one + div")
				之后所有同辈$("#two ~ div")
	过滤选择器
			
			基本过滤选择器
				:first			选取第一个元素
				:last			选取最后一个元素
				:not(selector)	去除所有与给定选择器匹配的元素
				:even			选取索引是偶数的所有元素
				:odd			选取索引是奇数的所有元素
				:eq(index)		选取索引为index的元素
				:gt(index)		选取索引大于index的元素
				:lt(index)		选取索引小于index的元素
				:header			选取所有标题元素，如h1 h2 h3
				:animated		选取当前正在执行动画的元素
				:focus			选取当前获取焦点的元素
			
			内容过滤选择器
				:contains(text) 选取含有文本内容为“text”的元素
				:empty			选取不包含子元素或者文本的空元素
				:parent			选取含有子元素或者文本的元素
				:has(selector)	选取含有选择器所匹配的元素 的元素
			
			可见性过滤选择器
				:hidden			选取所有不可见的元素
				:visible		选取所有可见的元素
			
			属性选择器
				[attribute]
				[attribute=value]
				[attribute!=value]
				[attribute^=value]
				[attribute$=value]
				[attribute*=value]
				[attribute1][attribute2]
					... ...见《锋利的jQuery》 p41
			
			子元素过滤选择器
				:nth-child()
				:first-child
				:last-child
				:only-child  	如果某个元素是它父元素的惟一子元素，则匹配

			表单对象属性过滤选择器
				:enable 		选取所有可用元素
				:disabled		选取所有不可用元素
				:checked		选取所有被选中元素（单、复选框）
				:selected		选取所有被选中的选项元素（下拉列表）

	表单选择器
			:input 		选取所有的<input><textarea><select><button>元素
			:text		选取所有的单行文本框
			:password	选取所有的密码框
			:radio		选取所有的单选框
			:checkbox  	选取所有的多选框
			:submit		选取所有的提交按钮
			:image		选取所有的图像按钮
			:reset		选取所有的重置按钮
			:button		选取所有的按钮
			:file		选取所有的上传域
			:hidden		选取所有不可见的元素