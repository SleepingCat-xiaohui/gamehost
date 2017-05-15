var game = new Phaser.Game(0, 0, Phaser.CANVAS);
// loading
var stateLoading = function() {};
stateLoading.prototype = {
	preload: function() {
		var loadingSprite = game.add.image(game.width / 2 - 110, game.height / 2, 'loading_gif');
		loadingSprite.anchor.setTo(0, 0.5);
		game.load.setPreloadSprite(loadingSprite);

		// tilemaps
		game.load.tilemap('mapData', 'assets/map/map.json', null, Phaser.Tilemap.TILED_JSON);
		game.load.image('mapSet', 'assets/map/map.png');

		// heros
		game.load.spritesheet('CP001AB', 'assets/hero/CP001AB.png', 45, 60);
		game.load.spritesheet('CP002AB', 'assets/hero/CP002AB.png', 45, 60);
		game.load.spritesheet('CP005AB', 'assets/hero/CP005AB.png', 45, 60);
		game.load.spritesheet('CP006AB', 'assets/hero/CP006AB.png', 45, 60);

		// monsters
		game.load.spritesheet('CP707AA', 'assets/hero/CP707AA.png', 110, 110);

		// talkboard
		game.load.image('talkboard', 'assets/talkboard.png');
		// audio
		game.load.audio('audio_bg', 'assets/audio/bg.mp3');
		game.load.audio('audio_bg2', 'assets/audio/bg2.mp3');
		game.load.audio('audio_bg3', 'assets/audio/bg3.mp3');
		game.load.audio('audio_bg4', 'assets/audio/bg4.mp3');
		game.load.audio('audio_fight', 'assets/audio/fight.mp3');
	},
	create: function() {
		// init audio
		GameData.audios.push(game.add.audio('audio_bg', 1, true));
		GameData.audios.push(game.add.audio('audio_bg2', 1, true));
		GameData.audios.push(game.add.audio('audio_bg3', 1, true));
		GameData.audios.push(game.add.audio('audio_bg4', 1, true));
		GameData.audios.push(game.add.audio('audio_fight', 1, true));
		// init mapset
		GameData.mapData.map = game.add.tilemap('mapData');
		GameData.mapData.map.addTilesetImage('map', 'mapSet');

		// game.state.start('menu');
		game.state.start('play', true, false, 1);
	}
};