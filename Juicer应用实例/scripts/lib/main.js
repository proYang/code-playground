require.config({
	baseUrl: 'scripts/lib',
	paths: {
		'app': '../modules/app',
	}
});
require(['app'], function (app) {
});