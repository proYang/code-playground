window.onload=function () {
	var container = document.querySelector("#container");
	var List = document.querySelector("#imageList");
	var circles = document.querySelectorAll(".circle");
	var pre = document.querySelector("#pre");
	var next = document.querySelector("#next");
	pre.addEventListener('click',function(){ change(1)});
	next.addEventListener('click',function(){ change(-1)});
	
	circles[0].addEventListener('click',function(){jump(0)});
	circles[1].addEventListener('click',function(){jump(1)});
	circles[2].addEventListener('click',function(){jump(2)});
	circles[3].addEventListener('click',function(){jump(3)});
	// 标记第一次访问时所处位置，并设置第一个circle的样式
	circleStyle('0px');
	
	// 前后移动
	function change (argument) {
		var longth=argument*960;
		// console.log(longth);
		var temp = parseInt(List.style.left);
		if (temp==0&&longth==960)
			// 当处于第一张图片&&向前移一张，将当前位置变为最后一张图片的后一个位置
			{ temp=-3840 };
		if (temp==-2880&&longth==-960)
		// 当处于最后一张图片&&向后移一张，将当前位置变为第一张图片的前一个位置
			{ temp=960 };
		// console.log('oldleft'+temp);
		List.style.left = String(temp+longth+'px');
		// console.log('argument'+argument);
		// console.log('newleft'+List.style.left);
		circleStyle (List.style.left);
	}
	// 通过circles跳转移动
	function jump (argument) {
		var temp = parseInt(List.style.left);
		switch(temp){
		case      0: temp=0; break;
		case   -960: temp=1; break;
		case  -1920: temp=2; break;
		case  -2880: temp=3; break;
		}
		change(temp-argument)
		
	}
	// 底部圆角样式
	function circleStyle (argument) {
		switch(argument){
		case '0px': bgStyle(0); break;
		case '-960px': bgStyle(1); break;
		case '-1920px': bgStyle(2); break;
		case '-2880px': bgStyle(3); break;
		}
		function bgStyle (argument) {
			for (var i = circles.length - 1; i >= 0; i--) {
				circles[i].style.backgroundColor="";
			};
			circles[argument].style.backgroundColor="#fff";
		}
	}
}