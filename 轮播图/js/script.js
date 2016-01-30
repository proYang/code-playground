window.onload=function () {
	var container = document.querySelector("#container");
	var List = document.querySelector("#imageList");
	var circles = document.querySelector(".circle");
	var pre = document.querySelector("#pre");
	var next = document.querySelector("#next");
	pre.addEventListener('click',function(){ change(960)});
	next.addEventListener('click',function(){ change(-960)});

	function change (argument) {
		var temp = parseInt(List.style.left);
		if (temp==0&&argument==960)
			// 当处于第一张图片&&向前移一张，将当前位置变为最后一张图片的后一个位置
			{ temp=-3840 };
		if (temp==-2880&&argument==-960)
			// 当处于最后一张图片&&向后移一张，将当前位置变为第一张图片的前一个位置
		 { temp=960 };
		// console.log('oldleft'+temp);
		List.style.left = String(temp+argument+'px');
		// console.log('argument'+argument);
		// console.log('newleft'+List.style.left);

	}
}