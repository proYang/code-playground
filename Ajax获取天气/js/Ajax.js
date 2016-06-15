document.querySelector("#getData").addEventListener("click",getMessage);

function getMessage() {
	var xhr = new XMLHttpRequest();
	xhr.open("GET","http://openweathermap.org/data/2.5/forecast/daily?id=1814906&appid=b1b15e88fa797225412429c1c50c122a");
	xhr.send();
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4) {
			if (xhr.status == 200) {

				var data = JSON.parse(xhr.responseText);
				showMessage(data);
				player();
			} else {
				alert("error" + xhr.status);
			}
		}
	}
}

function getChildren(node) {
	var childList = [];
	for (var i = 0; i <node.childNodes.length; i++) {
		if (node.childNodes[i].tagName == "DIV") {
			childList.push( node.childNodes[i] );
		}
	}
	return childList;
}

function showMessage(data) {
	document.querySelector("#address").innerHTML = data.city.name;

	var container = document.querySelector("#weather");
	var wChildList = getChildren(container);

	for (var i = 0; i < wChildList.length; i++) {
		var nowdata = getData(data,i);
		var content = getChildren(wChildList[i]);		
		content[0].innerHTML = nowdata.weather;
		content[1].innerHTML = nowdata.temp;
		content[2].innerHTML = nowdata.time;
		// console.log(nowdata);
	}
}

function getData(data,num) {
	// var d = new Date(data.list[num].dt * 1000).toLocaleDateString().split("/");
	// var time = d[0] + "年" + d[1] + "月" + d[2] + "日";
	var time = new Date(data.list[num].dt * 1000).toDateString();
	var temp = data.list[num].temp.min + "℃" + "~" + data.list[num].temp.max + "℃";
	var weather = data.list[0].weather[0].main;
	return { time, temp, weather };
}


//轮播效果
function player() {
	var container = document.querySelector("#weather");
	var speed = 200;
	var location = 0;
	setInterval(function(){ move() },3000);
	function move() {
		location = location - speed;
		container.style.marginLeft = location + "px";
		if (location == -1200 ) {
			location = 200;
		}
	}
}