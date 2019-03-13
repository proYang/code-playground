const cluster = require('cluster');
const process = require('process');
const numCPUs = require('os').cpus().length;
const http = require('http');


const masterMsgHandler = function(chunk) {
    let data = chunk.toString();
	console.log(`Master ${process.pid} Received: ${data}`);
}
const workerMsgHandler = function(chunk) {
	let data = chunk.toString();
	console.log(`Worker ${process.pid} Received: ${data}`);
}

/**
 * @desc Worker
 */
if (cluster.isWorker) {
	http.createServer((req, res) => {
        // 子进程-发
        process.stdout.write(JSON.stringify({
        	type: 'message',
        	payload: `😂`
        }));
		res.writeHead(200);
		res.end(`Hello ${process.pid}`);
	}).listen(8000);
    console.log(`工作进程 ${process.pid} 已启动`);
    // 子进程-收
    process.stdin.on('data', workerMsgHandler);
}

/**
 * @desc Master
 */
if (cluster.isMaster) {
	console.log(`主进程 ${process.pid} 正在运行`);
    
    cluster.setupMaster({
    	silent: true
    });

	let workers = [];
	// 工作进程。
	for (let i = 0; i < numCPUs; i++) {
        const worker = cluster.fork();
        worker.process.stdout.setEncoding('utf8');
    	// 父进程-收
        worker.process.stdout.on('data', masterMsgHandler);
		workers[i] = worker;
	}

	cluster.on('exit', (worker, code, signal) => {
        console.log(`工作进程 ${worker.process.pid} 已退出`);
        const newWorker = cluster.fork();
        newWorker.process.stdout.setEncoding('utf8');
    	// 父进程-收
        newWorker.process.stdout.on('data', masterMsgHandler);
		workers.push(newWorker);
	});

	setInterval(() => {
        const index = Math.floor(Math.random() * workers.length)
        const worker = workers[index];
        // 随机向子进程可写流 写入消息
        if (worker) {
            worker.process.stdin.write(JSON.stringify({
            	type: 'handshake',
            	payload: '🤝'
            }));
        }
    }, 3000)

}