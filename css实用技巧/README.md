## 图片宽度的自适应                                      

     img {
     max-width: 100%
    }
## 3D按钮      
 要使按钮具有3D效果，只要将它的左上部边框设为浅色，右下部边框设为深色即可。    

    div#button {
    background: #888;　　　　
    border: 1px solid;　　　　
    border-color: #999 #777 #777 #999;　　
    }
## CSS三角形 ##

    .triangle { 　　　　
    border-color: transparent transparent green transparent; 　　　　
    border-style: solid; 　　　　
    border-width: 0px 300px 300px 300px; 　　　　
    height: 0px; 　　　　
    width: 0px; 　　
    }
## 容器的水平垂直居中 ##
    
    //方法1
    div {
    			position: absolute;
    			top: 0;
    			right: 0;
    			bottom: 0;
    			left: 0;
    			margin: auto;
    			width: 100px;
    			height: 100px;
    			background-color: #acf;
		}
    //方法2
    		div {
    			position: absolute;
    			left: 50%;
    			top: 50%;
    			margin-left: -50px;
    			margin-top: -50px;
    			width: 100px;
    			height: 100px;
    			background-color: #acf;
    		}
##  css3背景颜色渐变属性 ##

线性渐变（Linear Gradients）- 向下/向上/向左/向右/对角方向

    background: linear-gradient(direction, color-stop1, color-stop2, ...);
径向渐变（Radial Gradients）- 由它们的中心定义

    background: radial-gradient(center, shape size, start-color, ..., last-color);
