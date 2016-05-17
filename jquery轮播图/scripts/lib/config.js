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
        var interval = 3000;
        var timer;

        play();
        conatiner.hover(stop, play);

        pre.bind("click", function () {
            index--;
            animate (imageWidth);
        });

        next.bind("click", function () {
            index++;
            animate (-imageWidth);
        });

        circleList.children().bind('click', function () {
                var thisIndex = $(this).index();
                var offset = -imageWidth * (thisIndex - index);
                animate(offset);
                index = thisIndex;
                showButton();
       });

        function animate (offset) {
            var newLeft = parseInt(imageWrap.css("left")) + offset;
            if (index == imageNum) {
                index = 0;
                newLeft = 0;
            } else if (index == -1) {
                index = 3;
                newLeft = -imageWidth * (imageNum-1) + "px";
            }
            imageWrap.css("left",newLeft);
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