const cluster = require('cluster');
const numCPUs = require('os').cpus().length;

const createServer = require('../test/server');

if (cluster.isMaster) {
	console.log(`主进程 ${process.pid} 正在运行`);

	// 生成工作进程。
	for (let i = 0; i < numCPUs; i++) {
		cluster.fork();
	}

	cluster.on('exit', (worker, code, signal) => {
        console.log(`工作进程 ${worker.process.pid} 已退出 (${signal || code}). 重启中...`);
        // 工作进程退出后，启用新的工作进程
        cluster.fork();
	});

	cluster.on('disconnect', function(worker) {
        console.log(`The worker ${worker.process.pid} has disconnected`);
	});
} else {
	// Worker
    createServer();
}