var http = require('http'),
    dns = require('dns');


http.createServer(function (req, res) {
    getDns('www.slane.cn', function (hostname, addresses) {
        console.log(hostname+'\nip:'+addresses);
        var message = hostname + '\nip:' + addresses;
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end(message);
    });
}).listen(3000, "127.0.0.1");
console.log('server is run 127.0.0.1:3000');

function getDns(hostname, callback) {
    dns.resolve4(hostname, function (err, addresses) {
        if(!addresses){
            addresses = "无法解析";
        }
        callback(hostname, addresses);
    })
}