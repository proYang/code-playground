var type=0;//标记运算类型

//输入数字
function num(data) {
	var str=String(document.getElementById('output').value);
	if (document.getElementById('output').value=="0"
		||document.getElementById('output').value=="+"
		||document.getElementById('output').value=="-"
		||document.getElementById('output').value=="×"
		||document.getElementById('output').value=="÷"
		||document.getElementById('output').value=="%")
		{  str=str.substr(0,str.length-1);  };
	str=str+String(data);
	document.getElementById('output').value=str;
}
//求余
document.getElementById('mod').addEventListener("click",mod);
function mod () {
	var temp=document.getElementById('output').value;
	document.getElementById('input').value=temp;
	document.getElementById('output').value="%";
	type=5;
}
//加法
document.getElementById('plus').addEventListener("click",plus);
function plus () {
	var temp=document.getElementById('output').value;
	document.getElementById('input').value=temp;
	document.getElementById('output').value="+";
	type=4;
}
//减法
document.getElementById('minus').addEventListener("click",minus);
function minus () {
	var temp=document.getElementById('output').value;
	document.getElementById('input').value=temp;
	document.getElementById('output').value="-";
	type=3;
}
//乘法
document.getElementById('mult').addEventListener("click",mult);
function mult () {
	var temp=document.getElementById('output').value;
	document.getElementById('input').value=temp;
	document.getElementById('output').value="×";
	type=2;
}
//除法
document.getElementById('division').addEventListener("click",division);
function division () {
	var temp=document.getElementById('output').value;
	document.getElementById('input').value=temp;
	document.getElementById('output').value="÷";
	type=1;
}



//计算
document.getElementById('equal').addEventListener("click",equal);
function equal () {
	var temp=Number(document.getElementById('input').value);
	var temp1=Number(document.getElementById('output').value);
	//求余
	if (type==5) {
	document.getElementById('input').value=document.getElementById('input').value+"%"+document.getElementById('output').value;
	document.getElementById('output').value=temp%temp1;
	};
	//加法
	if (type==4) {
	document.getElementById('input').value=document.getElementById('input').value+"+"+document.getElementById('output').value;
	document.getElementById('output').value=temp+temp1;
	};
	//减法
	if (type==3) {
	document.getElementById('input').value=document.getElementById('input').value+"-"+document.getElementById('output').value;
	document.getElementById('output').value=temp-temp1;
	};
	//乘法
	if (type==2) {
	document.getElementById('input').value=document.getElementById('input').value+"×"+document.getElementById('output').value;
	document.getElementById('output').value=temp*temp1;
	};
	//除法
	if (type==1) {
	document.getElementById('input').value=document.getElementById('input').value+"÷"+document.getElementById('output').value;
	document.getElementById('output').value=temp / temp1;
	};
}


//清零
document.getElementById('clear').addEventListener("click",function ()
	{document.getElementById('output').value="0"; });
document.getElementById('clear').addEventListener("click",function ()
	{document.getElementById('input').value=""; });
//退格
document.getElementById('delete').addEventListener("click",delet);
function delet()
	{           var str=document.getElementById('output').value;
			if (str==0) {} 
			else{
				str=str.substr(0,str.length-1);
				if (str.length==0){ str=0;}
			};
				document.getElementById('output').value=str;}
//小数点
document.getElementById('dot').addEventListener("click",dot);
function  dot() 
	{			var str=document.getElementById('output').value;
	for (var i = 0; i < str.length; i++) 
		{if(str.substr(i,1)==".") return false;};
	str=str+".";
	document.getElementById('output').value=str;}

//正负号
document.getElementById('pam').addEventListener("click",function  ()
	{var str=document.getElementById('output').value;
	str=0-str;
	document.getElementById('output').value=str;});



//键盘操作事件绑定
  document.onkeydown=function(){
             var e = event || window.event;
             // console.log(e);
             // alert(e.keyCode);
             if(e.keyCode==48 || e.keyCode==96 ){  num (0);    }
             else if(e.keyCode==49 || e.keyCode==97 ){  num (1);    }
             else if(e.keyCode==50 || e.keyCode==98 ){  num (2);    }
             else if(e.keyCode==51 || e.keyCode==99 ){  num (3);    }
             else if(e.keyCode==52 || e.keyCode==100 ){  num (4);    }
             else if(e.keyCode==53 || e.keyCode==101 ){  num (5);    }
             else if(e.keyCode==54 || e.keyCode==102 ){  num (6);    }
             else if(e.keyCode==55 || e.keyCode==103 ){  num (7);    }
             else if(e.keyCode==56 || e.keyCode==104 ){  num (8);    }
             else if(e.keyCode==57 || e.keyCode==105 ){  num (9);    }
             else if(e.keyCode==46 || e.keyCode==8 ){  delet();    }
             else if(e.keyCode==190 || e.keyCode==110 ){  dot();    }
             else if(e.keyCode==111 || e.keyCode==191 ){  division();    }
             else if(e.keyCode==106 ){  mult();    }
             else if(e.keyCode==109 ){  minus();    }
             else if(e.keyCode==107 ){  plus();    }
             else if(e.keyCode==187 ){  equal();    }
            
         }; 