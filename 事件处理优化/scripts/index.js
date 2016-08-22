/*
 * 编写可维护事件
 *   - 将事件处理程序与应用逻辑隔离，当有同样的应用逻辑是直接复用代码
 *   - 避免事件分发，在事件处理程序中，只需要传递应用层需要的数据，
 *     并在事件处理程序中，进行组织默认事件的操作等
 * 
 */



let Action = {
	//事件处理程序
	handleClick: function(event){
		
		//阻止默认事件
		event.preventDefault();

		this.showPop(event.clientX, event.clientY);
	},
	//应用逻辑
	showPop: function(){
		console.log(arguments);
	}
}

document.querySelector("#J_button").addEventListener("click", function(event){
	Action.handleClick(event);
});
document.querySelector("#J_button2").addEventListener("click", function(event){
	Action.handleClick(event);
});