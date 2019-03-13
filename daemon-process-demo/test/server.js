const http = require('http');

/**
 * @desc 正常服务
 */
module.exports = function () {
  http.createServer((req, res) => {
  	res.writeHead(200);
  	res.end(`Hello ${process.pid}`);
  }).listen(8000);
}

/**
 * @desc 连接永远不会结束
 */
// module.exports = function () {
//   http.createServer((req, res) => {
  	
//   }).listen(8000);
// }