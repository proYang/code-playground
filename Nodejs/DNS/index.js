const  http 	= 	require('http'),
    	dns 	= 	require('dns');


http.createServer(function (req, res) {

    getDns('www.slane.cn').then(
    	function (hostname, addresses) {

	        console.log(hostname+'\nip:'+addresses);
	        var message = hostname + '\nip:' + addresses;
	        res.writeHead(200, {'Content-Type': 'text/plain'});
	        res.end(message);

	    }, function (err) {

	    	console.log("出错了！");
	    	console.log(err);
	    	
	    })

}).listen(3000, "127.0.0.1");

console.log('server is run 127.0.0.1:3000');

function getDns(hostname) {
	return new Promise(function (resolve, reject) {
	
	    dns.resolve4(hostname, function (err, addresses) {

	    	if (err) {
	    		reject(err);
	    	}

	        if(!addresses){
	            addresses = "无法解析";
	        }

	        resolve(hostname, addresses);
	    })
	
	});
}