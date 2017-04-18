// util
var Util = {
	// hero arr
	heros: ['CP001AB', 'CP002AB'],
	// maps
	maps: '',
	// const
	controlKeys: {
		up: Phaser.KeyCode.W,
		down: Phaser.KeyCode.S,
		left: Phaser.KeyCode.A,
		right: Phaser.KeyCode.D,
		start: Phaser.KeyCode.SPACEBAR,
		A: Phaser.KeyCode.K,
		B: Phaser.KeyCode.L
	},
	// fn
	gameControl: function(game, controlKeys) {
		if (typeof this.gameControl === 'function') {
			var cursor = game.input.keyboard.addKeys(controlKeys || this.controlKeys);
			this.gameControl = cursor;
			return cursor;
		}
	},
	addHero: function(game, key, x, y) {
		var hero = game.add.sprite(x, y, key);
		hero.scale.setTo(0.71);
		hero.anchor.setTo(0.5);
		hero.animations.add('left', [4, 5, 6, 7], 6, true);
		hero.animations.add('up', [8, 9, 10, 11], 6, true);
		hero.animations.add('right', [12, 13, 14, 15], 6, true);
		hero.animations.add('down', [0, 1, 2, 3], 6, true);
		return hero;
	},
	addTalkBoard: function(game, text) {
		var talkBoard = game.add.group();

	}
};