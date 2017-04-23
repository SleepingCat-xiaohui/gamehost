var game = new Phaser.Game(0, 0, Phaser.CANVAS);
// boot init
var stateBoot = function() {};
stateBoot.prototype = {
	preload: function() {
		game.scale.pageAlignHorizontally = true;
		game.stage.disableVisibilityChange = true;

		// init controlKey
		Util.gameControl(game);

		game.load.image('loading_gif', 'assets/preloader.gif');
	},
	create: function() {
		game.state.start('loading');
	}
};