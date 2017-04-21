const path 		= require('path');
const webpack = require('webpack');

module.exports = {
	
	context: path.resolve(__dirname, "./src"), // 基础目录，绝对路径

	devtool: 'source-map',// 配置生成Source Maps，选择合适的选项
	
	entry: './main.js', // 入口文件
	
	
	output: {
		// 输出配置项
		// libraryTarget: "umd", // 配置如何暴露 library
		path: path.resolve(__dirname, './dist'), // output 目录对应一个绝对路径
		filename: './[hash].js'
	},
	
	
	resolve: {
		// 解析配置项
		alias: {
			// 别名
			"@src": './src/'
		},
		extensions: ['.js', '.vue', '.json'], // 使用户在引入模块时不带扩展  import File from '../path/to/file'
		modules: [path.resolve(__dirname, "src"), "node_modules"] // 添加一个目录到模块搜索目录，此目录优先于 node_modules/ 搜索
	},

	devServer: {
		// webpack服务器  webpack-dev-server使用
			port: 9911, // 端口号
			contentBase: "./", //	本地服务器所加载的页面所在的目录
			historyApiFallback: true, //	不跳转  依赖于HTML5 history API，如果设置为true，所有的跳转将指向index.html
			inline: true,	//	实时刷新
			proxy: {
				"/api": {
					target: "http://localhost:3000",
					pathRewrite: {"^/api" : ""}
				}
			}
	}
}