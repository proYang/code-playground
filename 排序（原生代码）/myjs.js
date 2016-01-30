	
document.getElementById('buttonUp').addEventListener("click",demonUp);
document.getElementById('buttonDown').addEventListener("click",demonDown);

function demonUp() {
		var arr=new Array();
		arr=document.getElementById('input').value.split("");
		//升序
		for (var i = arr.length - 1; i > 0; i--) 
		for (var j = i-1; j >=0  ; j--) 
		{
			if (arr[i]<arr[j]) {
				var temp = arr[i];
				arr[i]=arr[j];
				arr[j]=temp;
			};
		};
		document.getElementById('output').value=arr.join("");
	}
function demonDown() {
		var arr=new Array();
		arr=document.getElementById('input').value.split("");
		//降序
		for (var i = arr.length - 1; i > 0; i--) 
		for (var j = i-1; j >=0  ; j--) 
		{
			if (arr[i]>arr[j]) {
				var temp = arr[i];
				arr[i]=arr[j];
				arr[j]=temp;
			};
		};
		document.getElementById('output').value=arr.join("");	
	}
