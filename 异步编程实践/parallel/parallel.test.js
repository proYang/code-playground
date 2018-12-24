const parallel = require('./parallel')
parallel([
	function(done) {
		setTimeout(function() {
			done('1');
			done('3');
		}, 500)
	},
	function(done) {
		setTimeout(function() {
			done('2');
		}, 300)
	}
], function(res) {
	console.log(res); // 1 2
})


class Page {
	constructor({ onLoad, onShow, onUnload }) {
		this.onLoad = onLoad;
		this.onShow = onShow;
		this.onUnload = onUnload;
		this.init()
	}
	init() {
		this.onLoad();
		this.onShow();
	}
}

new Page({
	onLoad() {
			console.log('[start onLoad]')
			parallel([
				this.onUnload.bind(this)
			], (res) => console.log(`[end:]${res}`))
	},
	onShow() {
		console.log('[start onShow]')
	},
	onUnload(done) {
		console.log(this)
		console.log('[start onUnload]')
		setTimeout(function() {
			done('2');
		}, 300)
	}
})
