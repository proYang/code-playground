var request = require('request');
var cheerio = require('cheerio');
var path = require('path');
var fs = require('fs');
// var async = require('async');
var pageUrls = [];
var index = 0;
// for(var i=130480 ; i<= 136699; i++){
	pageUrls.push('https://isux.tencent.com/phonegraphy.html');
	// pageUrls.push('https://ideras.me/blog/pure-css-columns-waterfall.html');
	// pageUrls.push('http://64ce.com/pic/11/' + i + '.html');
// }
// for (var i = 119600; i < 119627; i++) {
// 	requrl='http://74ct.com/pic/11/'+i+'.html';
// 	originRequest(requrl);
// 	console.log("正在加载下一页！");
// }
// for (var i = 119500; i < 119627; i++) {
	
// }
console.log("共"+pageUrls.length+"页");
var timer = setInterval(function () {
	var nowUrl = pageUrls[index];
	originRequest(nowUrl);
	console.log("正在下载第"+index+"页面", nowUrl);
	index++;
	if(index == pageUrls.length){
		clearInterval(timer);
		console.log("have finished");
	}
}, 5000);
// 并发连接数的计数器
// var concurrencyCount = 0;
// var fetchUrl = function (url, callback) {
// // delay 的值在 2000 以内，是个随机的整数
// 		// var delay = parseInt((Math.random() * 10000000) % 2000, 10);
// 		var delay = 2000;
// 		concurrencyCount++;
// 		originRequest(url);
// 		console.log('现在的并发数是', concurrencyCount, '，正在抓取的是', url, '，耗时' + delay + '毫秒');
// 		setTimeout(function () {
// 		concurrencyCount--;
// 		callback(null, url + ' html content');
// 	}, delay);
// };
// async.mapLimit(pageUrls, 5, function (url, callback) {
//   		fetchUrl(url, callback);
// 	}, function (err, result) {
//   		console.log('final:');
//   		console.log(result);
// });
function originRequest(requrl) {
	 request(requrl, function (error, response, body) {
	 	if (!error && response.statusCode == 200) {
	    	// console.log(body);    //返回请求页面的HTML
	    	console.log("loaded HTML");
	    	acquireData(body);
		}
	});
}
// request(requrl, function (error, response, body) {
//  	if (!error && response.statusCode == 200) {
//     	// console.log(body);    //返回请求页面的HTML
//     	console.log("loaded HTML");
//     	acquireData(body);
// 	}
// })


function acquireData(data) {
    var $ = cheerio.load(data);
 
    var images = $('img').toArray();
    console.log(images.length);
    var len = images.length;
    for (var i=0; i<len; i++) {
        var imgsrc = images[i].attribs.src;
        console.log(imgsrc);
        var filename = parseUrlForFileName(imgsrc);  //生成文件名
        downloadImg(imgsrc,filename,function() {
            console.log(filename + ' done');
        });
    }
}
 
function parseUrlForFileName(address) {
    var filename = path.basename(address);
    return filename;
}
 
var downloadImg = function(uri, filename, callback){
    request.head(uri, function(err, res, body){
	    // console.log('content-type:', res.headers['content-type']);  //这里返回图片的类型
	    // console.log('content-length:', res.headers['content-length']);  //图片大小
	    if (err) {
	        console.log('err: '+ err);
	        return false;
	    }
	    console.log('res: '+ res);
	    request(uri).pipe(fs.createWriteStream('images/'+filename)).on('close', callback);  //调用request的管道来下载到 images文件夹下
    });
};
 