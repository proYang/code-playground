require.config({
    // 默认从scripts/lib目录加载
    baseUrl: 'scripts/lib',
    // 如果模块ID以app开头，则从scripts/app目录加载
    // paths相对于baseUrl设定
    // 不要指定".js"后缀，因为paths可以是一个目录
    paths: {
        'jquery': 'jquery',
        'banner': '../app/banner',
    }
});

require(['jquery','banner'],function(){
    console.log("Hello, I'm powered by jQuery " + $().jquery );
});