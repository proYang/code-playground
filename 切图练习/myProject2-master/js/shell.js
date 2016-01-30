var img = document.querySelector('#bgimage');
var circle1 = document.querySelector('#circle1');
	circle1.style.backgroundColor='#FFF';
var circle2 = document.querySelector('#circle2');
var circle3 = document.querySelector('#circle3');
	i=1;
	setInterval(function  () {	turn(1);	},4000);
function bg (arguement) {
	if (arguement==1) {
		img.style.backgroundImage='url(images/01.jpg)';
		circle1.style.backgroundColor='#FFF';
		circle2.style.backgroundColor='';
		circle3.style.backgroundColor='';
	} else if (arguement==2){
		img.style.backgroundImage='url(images/02.jpg)';
		circle1.style.backgroundColor='';
		circle2.style.backgroundColor='#FFF';
		circle3.style.backgroundColor='';
	} else if (arguement==3) {
		img.style.backgroundImage='url(images/03.jpg)';
		circle1.style.backgroundColor='';
		circle2.style.backgroundColor='';
		circle3.style.backgroundColor='#FFF';
	}
	i=arguement;
}
function turn(arguement){
		if (arguement==-1) {
			i--;
			if (i<1) {i=3;}
			bg(i);
		}else if (arguement==1) {
			i++;
			if (i>3) {i=1;}
			bg(i);
		};
}

