#### 使用手淘[H5页面的终端适配方案](https://github.com/amfe/article/issues/17)  
#### 移动端字体用px

	**Sass混合宏**
	`@mixin font-dpr($font-size){
    	font-size: $font-size;

	    [data-dpr="2"] & {
	        font-size: $font-size * 2;
	    }
	
	    [data-dpr="3"] & {
	        font-size: $font-size * 3;
	    }
	}
	**调用：**
	@include font-dpr(16px);
	**Less混合宏**
	`
	.font-dpr(@font-size){
	    font-size: @font-size;
	
	    [data-dpr="2"] & {
	        font-size: @font-size * 2;
	    }
	
	    [data-dpr="3"] & {
	        font-size: @font-size * 3;
	    }
	}
	**调用：**
	.font-dpr(16px);
	`