const cluster = require('cluster');
const process = require('process');
const numCPUs = require('os').cpus().length;
const http = require('http');

const masterMsgHandler = function(msg) {
	console.log(`Master ${process.pid} Received: ${msg}`);
}

const workerMsgHandler = function(msg) {
	console.log(`Worker ${process.pid} Received: ${msg}`);
}

/**
 * @desc Worker
 */
if (cluster.isWorker) {
    http.createServer((req, res) => {
        process.send(`😂`);
    	res.writeHead(200);
    	res.end(`Hello ${process.pid}`);
    }).listen(8000);
	console.log(`工作进程 ${process.pid} 已启动`);
	process.on('message', workerMsgHandler);
}

/**
 * @desc Master
 */
if (cluster.isMaster) {
	console.log(`主进程 ${process.pid} 正在运行`);

    let workers = [];
	// 工作进程。
	for (let i = 0; i < numCPUs; i++) {
        const worker = cluster.fork();
        worker.on('message', masterMsgHandler);
        workers[i] = worker;
	}

	cluster.on('exit', (worker, code, signal) => {
        workers = workers.filter(item => item.process.pid !== worker.process.pid)
        console.log(`工作进程 ${worker.process.pid} 已退出`);
        const newWorker = cluster.fork();
        newWorker.on('message', masterMsgHandler);
        workers.push(newWorker);
        console.log(workers.map(item => item.process.pid));
    });

    setInterval(() => {
        const index = Math.floor(Math.random() * workers.length)
        const worker = workers[index];
        // 随机向子进程发消息
        if (worker) {
        	worker.send(`🤙`);
        }
    }, 3000)
}