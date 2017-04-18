// transition
var stateTransition = function() {
	this.type = -1;
	this.talkBoard = null;
	this.currentCreate = function() {};
	this.currentUpdate = function() {};
};
stateTransition.prototype = {
	init: function(type) {
		if (type === 1) {
			// 初始 场景
			this.talkBoard = Util.addTalkBoard(game);
			this.currentCreate = this.state1.create;
			this.currentUpdate = this.state1.update;
		}
	},
	create: function() {
		this.currentCreate();
	},
	update: function() {
		this.currentUpdate();
	},

};

// 初始 场景
stateTransition.prototype.state1 = {
	create: function() {
		var texts = ['我在哪...', '我是谁...'];
		var text = game.add.text(game.width / 2, game.height / 2, texts[0], {
			font: 'bold 30px microsoft yahei',
			fill: '#fff'
		});
		text.anchor.setTo(0.5);
		text.alpha = 0;

		var mapGroup = game.add.group();
		mapGroup.alpha = 0;
		this.map = game.add.tilemap('homeMap');
		this.map.addTilesetImage('Inside_A4', 'Inside_A4');
		this.map.addTilesetImage('Inside_B', 'Inside_B');
		this.layerBg = this.map.createLayer('bg');
		this.layerUp = this.map.createLayer('top');
		this.layerBg.resizeWorld();
		this.hero1 = Util.addHero(game, Util.heros[0], 32 * 17 + 16, 32 * 3 + 32);
		mapGroup.add(this.layerBg);
		mapGroup.add(this.layerUp);
		mapGroup.add(this.hero1);

		// first flash
		var tween = game.add.tween(text);
		tween.to({
			alpha: 1
		}, 300, null, true, 300, 0, true);
		tween.onComplete.addOnce(function(text) {
			text.text = texts[1];
			// second flash
			tween = game.add.tween(text);
			tween.to({
				alpha: 1
			}, 300, null, true, 300, 0, true);
			tween.onComplete.addOnce(function() {
				// map
				tween = game.add.tween(mapGroup);
				tween.to({
					alpha: 1
				}, 300, null, true, 300, 0, false);
				tween.onComplete.addOnce(function() {

				}, this);
			}, this);
		}, this);
	},
	update: function() {

	}
};