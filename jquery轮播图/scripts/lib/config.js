require.config({
    // 默认从scripts/lib目录加载
    baseUrl: 'scripts/lib',
    // 如果模块ID以app开头，则从scripts/app目录加载
    // paths相对于baseUrl设定
    // 不要指定".js"后缀，因为paths可以是一个目录
    paths: {
        'jquery': 'jquery',
    }
});

require(['jquery'],function(){
    $(function () {
        var conatiner = $(".container");
        var imageWrap = $("#image-list");
        var imageNum = 4;
        var imageWidth = 960;
        var circleList = $("#image-list + ul");
        var pre = $("#pre");
        var next = $("#next");
        var index = 0;
        var interval = 2000;
        var timer;

        conatiner.hover(stop, play);

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
           timer = setTimeout(function () {
               next.trigger('click');
               play();
           }, interval);
       }
       function stop () {
           clearTimeout(timer);
       }
    });
});