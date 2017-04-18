// boot
var stateBoot = function() {};
stateBoot.prototype = {
	preload: function() {
		game.scale.pageAlignHorizontally = true;
		game.stage.disableVisibilityChange = true;
		game.load.image('loading', 'assets/preloader.gif');
	},
	create: function() {
		game.state.start('loading');
	}
};