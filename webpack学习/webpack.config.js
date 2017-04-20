const path 		= require('path');
const webpack = require('webpack');

module.exports = {
	context: path.resolve(__dirname, "./src"),
	entry: './main.js',
	output: {
		path: path.resolve(__dirname, './dist'),
		filename: 'bundle.js'
	}
}