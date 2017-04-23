var game = new Phaser.Game(0, 0, Physic.CANVAS);
// transition 过场动画
// start
statePlay.prototype.transition1 = function() {
	this.canUpdate = false;

	var _this = this;
	var texts = ['我在哪...', '我是谁...', '三个月后...'];
	var text = game.add.text(game.width / 2, game.height / 2, texts[0], {
		font: 'bold 30px microsoft yahei',
		fill: '#fff'
	});
	text.anchor.setTo(0.5);
	text.alpha = 0;

	var transGroup = game.add.group();
	transGroup.alpha = 0;
	Util.enterLayer('WhiteAiliceHome', this);
	if (!this.heroAimee) {
		this.heroAimee = Util.addHero(game, GameData.heros.Aimee, 17 * 32, 3 * 32 + 16);
	}
	transGroup.add(GameData.mapData.currentLayer.layerGroup);
	transGroup.add(GameData.mapData.currentLayer.doorLayer);
	transGroup.add(this.heroAimee);
	var heroAilice = GameData.mapData.currentLayer.npcs.getTop();
	heroAilice.reset(32 * 10 - 2, 32 * 15);
	heroAilice.alpha = 0;
	transGroup.add(heroAilice);

	// first flash
	var tween = game.add.tween(text);
	tween.to({
		alpha: 1
	}, this.tweenSpeed, null, true, 300, 0, true);
	tween.onComplete.addOnce(function(text) {
		text.text = texts[1];
		// second flash
		tween = game.add.tween(text);
		tween.to({
			alpha: 1
		}, this.tweenSpeed, null, true, 300, 0, true);
		tween.onComplete.addOnce(function() {
			// map flash
			tween = game.add.tween(transGroup);
			tween.to({
				alpha: 1
			}, this.tweenSpeed, null, true, 300, 0, false);
			tween.onComplete.addOnce(function() {
				this.talkBoard.setWord(['无名：呀！头好疼！']);
				this.talkBoard.toggleBoard();
				setTimeout(function() {
					_this.talkBoard.toggleBoard();
					heroAilice.play('up');
					heroAilice.alpha = 1;
					tween = game.add.tween(heroAilice);
					tween.to({
						y: 32 * 3
					}, 2000, null, true, 0, 0, false);
					tween.onComplete.addOnce(function() {
						heroAilice.play('right');
						tween = game.add.tween(heroAilice);
						tween.to({
							x: 32 * 16
						}, 1000, null, true, 0, 0, false);
						tween.onComplete.addOnce(function() {
							this.talkBoard.setWord(['爱丽丝：你醒了，感觉怎么样？']);
							this.talkBoard.toggleBoard();
							setTimeout(function() {
								_this.talkBoard.setWord(['无名：我这是在哪？']);
								setTimeout(function() {
									_this.talkBoard.setWord(['爱丽丝：这里是怀特村，村民在魔鬼森林外', '围发现的你，当时你伤的很重。不过你回复']);
									setTimeout(function() {
										_this.talkBoard.setWord(['的很快，我想再过几天你就能活蹦乱跳了。']);
										setTimeout(function() {
											_this.talkBoard.setWord(['无名：谢谢你。']);
											setTimeout(function() {
												_this.talkBoard.setWord(['爱丽丝：不用谢，你叫什么名字？']);
												setTimeout(function() {
													_this.talkBoard.setWord(['无名：我不记得了。。。']);
													setTimeout(function() {
														_this.talkBoard.setWord(['爱丽丝：那我就叫你艾米吧，呵呵。']);
														setTimeout(function() {
															_this.talkBoard.setWord(['艾米：艾米。。。']);
															setTimeout(function() {
																_this.talkBoard.toggleBoard();
																tween = game.add.tween(transGroup);
																tween.to({
																	alpha: 0
																}, _this.tweenSpeed, null, true, 0, 0, false);
																tween.onComplete.addOnce(function() {
																	text.text = texts[2];
																	tween = game.add.tween(text);
																	tween.to({
																		alpha: 1
																	}, _this.tweenSpeed, null, true, 0, 0, true);
																	tween.onComplete.addOnce(function() {
																		_this.heroAimee.reset(15 * 32 - 2, 8 * 32 - 12);
																		_this.heroAimee.play('right');
																		heroAilice.reset(16 * 32 - 2, 8 * 32 - 12);
																		heroAilice.play('left');
																		tween = game.add.tween(transGroup);
																		tween.to({
																			alpha: 1
																		}, _this.tweenSpeed / 2, null, true, 0, 0, false);
																		tween.onComplete.addOnce(function() {
																			game.world.add(this.heroAimee);
																			this.heroDirection = 'right';
																			_this.talkBoard.setWord(['爱丽丝：去村子里逛逛吧。']);
																			_this.talkBoard.toggleBoard();
																			setTimeout(function() {
																				_this.talkBoard.toggleBoard();
																				text.destroy();
																				game.world.add(GameData.mapData.currentLayer.layerGroup);
																				game.world.add(GameData.mapData.currentLayer.doorLayer);
																				GameData.mapData.currentLayer.npcs.add(heroAilice);
																				game.world.add(_this.heroAimee);
																				game.world.bringToTop(GameData.mapData.currentLayer.npcs);
																				game.world.bringToTop(_this.heroAimee);
																				game.world.bringToTop(_this.talkBoard);
																				transGroup.destroy();
																				_this.canUpdate = true;
																			}, _this.wordSpeed);
																		}, _this);
																	}, _this);
																}, _this);
															}, _this.wordSpeed);
														}, _this.wordSpeed);
													}, _this.wordSpeed);
												}, _this.wordSpeed);
											}, _this.wordSpeed);
										}, _this.wordSpeed);
									}, _this.wordSpeed * 2);
								}, _this.wordSpeed);
							}, _this.wordSpeed);
						}, _this);
					}, _this);
				}, _this.wordSpeed);
			}, this);
		}, this);
	}, this);
};