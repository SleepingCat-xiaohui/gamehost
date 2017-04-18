// play
var statePlay = function() {
	this.gameType = 0;
	this.map = null;
	this.audio_bg = null;
};
statePlay.prototype = {
	init: function(gameType) {
		this.gameType = gameType;
	},
	create: function() {
		// this.audio_bg = game.add.audio('audio_bg3').play('', 0, 1, true);

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
	}
};