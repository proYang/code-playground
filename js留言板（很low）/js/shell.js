// id计数器
i=0;
textColor =['white','#ef5350','#4caf50','#03a9f4'];
nowColor="white";

window.onload = function(){
	document.querySelector('#btn').addEventListener('click',upload);
	document.querySelector('#red').addEventListener('click',function(){ colors(1)});
	document.querySelector('#green').addEventListener('click',function(){ colors(2)});
	document.querySelector('#blue').addEventListener('click',function(){ colors(3)});
	document.querySelector('#random').addEventListener('click',function(){ changeBg() });
}
// 主函数
function upload() {
	// 获取用户名及内容
	var talk = document.querySelector('#text').value;
	var user = document.querySelector('#username').value;
	if (user) {
		if (talk) {
			// 创建标签
			user=user+"说:";
			var addP = document.createElement('p');
			var addSpan = document.createElement('span');
			// 添加标签id
			var pid=idName(0);
			var sid=idName(1);
			addP.id=pid;
			addSpan.id=sid;
			// 添加标签class
			addP.className="content";
			addSpan.className="user";
			// 添加节点
			var node1 = document.createTextNode(talk);
			var node2 = document.createTextNode(user);
			addP.appendChild(node1);
			addSpan.appendChild(node2);
			// 添加标签
			var add = document.querySelector('#container');
			add.appendChild(addSpan);
			add.appendChild(addP);
			document.getElementById(pid).style.backgroundColor=nowColor;
			// document.querySelector('#text').style.backgroundColor="white";
			i++;
			document.querySelector('#text').value="";
		} else{	alert("内容不能为空"); }
	} else{ alert("请输入您的昵称"); };
}
// 可选背景色
function colors (argument) {
	document.querySelector('#text').style.backgroundColor=textColor[argument];
	nowColor=textColor[argument];
}
// id命名
function idName (argument) {
	if (!argument) {
		var temp="content"+i;
	} else if (argument) {
		var temp="user"+i;
	};
	return temp;
}

// 随机颜色
function changeBg(){
	var rand=Math.round(Math.random()*1000000);
	document.querySelector('#text').style.backgroundColor="#"+rand;
	nowColor=document.querySelector('#text').style.backgroundColor;
}