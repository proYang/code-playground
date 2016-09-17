const   request 	= require('request'),
		cheerio 	= require('cheerio'),
		path    	= require('path'),
		fs      	= require('fs');


let 	pageUrls 	= [], //存放收集页面  
		index 		= 0,
		startDate   = new Date(), //开始时间
		endDate     = false;  //结束时间


//储存需要爬取的页面
// for(let i = 2058000 ; i<= 2058100; i++){
		pageUrls.push('https://isux.tencent.com/phonegraphy.html');
	// pageUrls.push('https://ideras.me/blog/pure-css-columns-waterfall.html');
	// pageUrls.push('http://48cb.com/pic/11/' + i + '.html');
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


function originRequest(requrl) {
	 request(requrl, function (error, response, body) {
	 	if (!error && response.statusCode == 200) {
	    	// console.log(body);    //返回请求页面的HTML
	    	console.log("loaded HTML");
			praseData(body);
		}
	});
}

function praseData(data) {
	let $ = cheerio.load(data);
	let images = $('img').toArray();
	let imgLength = images.length;
	console.log('共' + imgLength + '图片');
	for (let i=0; i<imgLength; i++) {
		let imgsrc = images[i].attribs.src;
		let filename = parseUrlForFileName(imgsrc);
		downloadImg(imgsrc, filename).then(function () {
			console.log('第' + i +'张');
            console.log(filename + '下载完成\n');
		});
	}
}
 
function parseUrlForFileName(address) {
    var filename = path.basename(address);
    return filename;
}
 
const downloadImg = function (url, filename) {
	return new Promise(function (resolve, reject) {
		request.head(url, function (err, res, body) {
			if (err) {
				reject(err);
			} else {
				fs.readdir('images/', function (err) {
					if (err){
						//若目录不存在则创建
						console.log('创建目录 images/');
						fs.mkdir('images/', function (err) {
							if (err) {
								return console.error(err);
							}
							console.log("目录创建成功。");
						})
					}
					request(url)
						.pipe(fs.createWriteStream('images/' + filename))
						.on('finish', function() {
							resolve(filename);
						})
						.on('error', function(err){
							console.log("下载失败" + err);
						});
				})
			}
		})
	});
}