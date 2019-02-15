const http = require('http');
const cluster = require('cluster');

function createServer() {
	// 工作进程可以共享任何 TCP 连接。
	// 在本例子中，共享的是 HTTP 服务器。
	http.createServer((req, res) => {
		console.log('worker' + cluster.worker.id);
        // res.end('worker' + cluster.worker.id + ',PID:' + process.pid);
        if (req.url === '/disconnect') {
            console.log('disconnect');
        	process.disconnect();
        }
        if (req.url === '/error') {
            throw new Error('主动报错')
        }
    }).listen(8000);

	console.log(`工作进程 ${process.pid} 已启动`);
}

module.exports = createServer