var webpack = require('webpack');
module.exports = {
	extry: './entry.js',
	output: {
		path: __dirname,
		filename: 'bundle.js'
	},
	module: {
		loaders: [
			{test: /\.css$/, loader: 'style!css'}
		]
	},
	plugins: [
    	new webpack.BannerPlugin('This file is created by slaneYang')
  	]
}