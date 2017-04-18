// loading
var stateLoading = function() {};
stateLoading.prototype = {
	preload: function() {
		var loadingSprite = game.add.image(game.width / 2 - 110, game.height / 2, 'loading_gif');
		loadingSprite.anchor.setTo(0, 0.5);
		game.load.setPreloadSprite(loadingSprite);

		// tilemaps
		game.load.tilemap('homeMap', 'assets/map/home.json', null, Phaser.Tilemap.TILED_JSON);
		game.load.image('Inside_A4', 'assets/mapset/Inside_A4.png');
		game.load.image('Inside_B', 'assets/mapset/Inside_B.png');

		// heros
		game.load.spritesheet('CP001AB', 'assets/hero/CP001AB.png', 45, 60);
		game.load.spritesheet('CP002AB', 'assets/hero/CP002AB.png', 45, 60);

		// audio
		game.load.audio('audio_bg', 'assets/audio/bg.mp3');
		game.load.audio('audio_bg2', 'assets/audio/bg2.mp3');
		game.load.audio('audio_bg3', 'assets/audio/bg3.mp3');
		game.load.audio('audio_bg4', 'assets/audio/bg4.mp3');
		game.load.audio('audio_fight', 'assets/audio/fight.mp3');
	},
	create: function() {
		game.state.start('menu');
		// game.state.start('play');
	}
};