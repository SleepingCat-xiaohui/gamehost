// boot init
var stateBoot = function() {};
stateBoot.prototype = {
	preload: function() {
		game.scale.pageAlignHorizontally = true;
		game.stage.disableVisibilityChange = true;

		Util.gameControl(game);

		game.load.image('loading_gif', 'assets/preloader.gif');
	},
	create: function() {
		game.state.start('loading');
	}
};