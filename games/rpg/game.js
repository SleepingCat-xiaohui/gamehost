var game = new Phaser.Game(640, 480, Phaser.CANVAS);
// boot
var stateBoot = function() {};
stateBoot.prototype = {
	preload: function() {
		game.scale.pageAlignHorizontally = true;
		game.stage.disableVisibilityChange = true;
		game.load.image('loading', Util.assetPath + '/preloader.gif');
	},
	create: function() {
		game.state.start('loading');
	}
};

// loading
var stateLoading = function() {};
stateLoading.prototype = {
	preload: function() {
		var loadingSprite = game.add.image(game.width / 2 - 110, game.height / 2, 'loading');
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
}

// menu
var stateMenu = function() {
	this.gameType = 0; // new: 0, old: 1
	this.btn1 = null;
	this.btn2 = null;
	this.tip = null;
	this.cursor = null;
};
stateMenu.prototype = {
	create: function() {
		var audio_bg = game.add.audio('audio_bg').play('', 0, 1, true);
		var text = game.add.text(game.width / 2, 100, '名字还在起..', {
			font: 'bold 50px Microsoft Yahei',
			fill: '#fff'
		});
		text.anchor.setTo(0.5);

		this.btn1 = game.add.text(game.width / 2, 250, '新的开始', {
			font: 'bold 20px Microsoft Yahei',
			fill: '#f00'
		});
		this.btn1.anchor.setTo(0.5);
		this.btn2 = game.add.text(game.width / 2, 300, '继续征程', {
			font: 'bold 20px Microsoft Yahei',
			fill: '#fff'
		});
		this.btn2.anchor.setTo(0.5);

		this.tip = game.add.text(game.width / 2 - 70, 250, '->', {
			font: 'bold 20px Microsoft Yahei',
			fill: '#f00'
		});
		this.tip.anchor.setTo(0.5);

		this.cursor = game.input.keyboard.addKeys(Util.controlKeys);
	},
	update: function() {
		if (this.cursor.up.isDown) {
			this.gameType = 0;
			this.btn1.fill = '#f00';
			this.btn2.fill = '#fff';
			this.tip.y = 250;
		} else if (this.cursor.down.isDown) {
			this.gameType = 1;
			this.btn1.fill = '#fff';
			this.btn2.fill = '#f00';
			this.tip.y = 300;
		} else if (this.cursor.start.isDown) {
			game.state.start('play', true, false, this.gameType);
		}
	}
}

// play
var statePlay = function() {
	this.gameType = 0;
	this.map = null;
};
statePlay.prototype = {
	init: function(gameType) {
		this.gameType = gameType;
	},
	create: function() {
		this.map = game.add.tilemap('homeMap');
		this.map.addTilesetImage('Inside_A4', 'Inside_A4');
		this.map.addTilesetImage('Inside_B', 'Inside_B');
		this.layerBg = this.map.createLayer('bg');
		this.layerUp = this.map.createLayer('top');
		this.layerBg.resizeWorld();
		this.map.setCollision([35, 51], true, this.layerBg);
		this.map.setCollision([393, 401, 417], true, this.layerUp);

		this.hero1 = game.add.sprite(32 * 17 + 16, 32 * 3 + 32, 'CP001AB');
		this.hero1.scale.setTo(0.71);
		this.hero1.anchor.setTo(0.5);
		game.physics.enable(this.hero1);
		this.hero1.body.setSize(45, 45, 0, 10);
		this.hero1.animations.add('left', [4, 5, 6, 7], 6, true);
		this.hero1.animations.add('up', [8, 9, 10, 11], 6, true);
		this.hero1.animations.add('right', [12, 13, 14, 15], 6, true);
		this.hero1.animations.add('down', [0, 1, 2, 3], 6, true);

		this.cuesor = game.input.keyboard.addKeys(Util.controlKeys);
	},
	update: function() {
		game.physics.arcade.collide(this.hero1, this.layerBg);
		game.physics.arcade.collide(this.hero1, this.layerUp);
		this.hero1.body.velocity.setTo(0);
		if (this.cuesor.up.isDown) {
			this.hero1.body.velocity.y = -180;
			this.hero1.animations.play('up');
		} else if (this.cuesor.left.isDown) {
			this.hero1.body.velocity.x = -180;
			this.hero1.animations.play('left');
		} else if (this.cuesor.right.isDown) {
			this.hero1.body.velocity.x = 180;
			this.hero1.animations.play('right');
		} else if (this.cuesor.down.isDown) {
			this.hero1.body.velocity.y = 180;
			this.hero1.animations.play('down');
		} else {
			this.hero1.animations.stop(null, true);
		}
	},
	render: function() {
		// game.debug.body(this.hero1);
	}
};

game.state.add('boot', stateBoot, true);
game.state.add('loading', stateLoading);
game.state.add('menu', stateMenu);
game.state.add('play', statePlay);

// util
var Util = {
	assetPath: './assets/',
	controlKeys: {
		up: Phaser.KeyCode.W,
		down: Phaser.KeyCode.S,
		left: Phaser.KeyCode.A,
		right: Phaser.KeyCode.D,
		start: Phaser.KeyCode.SPACEBAR,
		A: Phaser.KeyCode.K,
		B: Phaser.KeyCode.L
	}
}