define(["../lib/jquery"], function() {
			var conatiner = $(".container");
	        var imageWrap = $("#image-list");
	        var imageNum = $("#image-list").children().size();
	        var imageWidth = $("#image-list img").width();
	        var circleList = $("#image-list + ul");
	        var pre = $("#pre");
	        var next = $("#next");
	        var index = 0;
	        var interval = 2000;
	        var timer;

	        conatiner.hover(stop, play);
	        play();
	        pre.bind("click", function () {
	            if (!imageWrap.is(":animated")) {
	                index--;
	                animate (imageWidth);
	            }
	        });

	        next.bind("click", function () {
	            if (!imageWrap.is(":animated")) {
	                index++;
	                animate (-imageWidth);
	            }
	        });

	        circleList.children().bind('click', function () {
	            var thisIndex = $(this).index();
	            var offset = -imageWidth * (thisIndex - index);
	            if (!imageWrap.is(":animated")) {
	                animate(offset);
	                index = thisIndex;
	                showButton();
	            }
	       });

	        function animate (offset) {
	            if (index == imageNum) {
	                index = 0;
	                offset = imageWidth * (imageNum-1);
	            } else if (index == -1) {
	                index = 3;
	                offset = -imageWidth * (imageNum-1);
	            }
	            imageWrap.animate({left: "+=" + offset}, 1000);
	            showButton();
	        }
	        function showButton () {
	            $(circleList.children().eq(index)).addClass("circle-selected")
	                .siblings().removeClass("circle-selected");
	        }
	        function play () {
	           timer = setInterval(function () {
	               next.trigger('click');
	           }, interval);
	       }
	       function stop () {
	           clearInterval(timer);
	       }
	}
);