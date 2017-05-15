var game = new Phaser.Game(0, 0, Phaser.CANVAS);
// play
var statePlay = function() {
	// 过场动画属性
	this.canUpdate = false;
	this.layerChanging = false;
	this.startType = -1;
	this.tweenSpeed = 800;
	this.wordSpeed = 3000;
	// this.tweenSpeed = 300;
	// this.wordSpeed = 300;
	// talkBoard group
	this.talkBoard = null;
	// menuBoard group
	this.menuBoard = null;
	// hero 属性
	this.heroDirection = '';
	this.heroAimee = null;
	this.heroAilice = null;
	this.isMoving = false;
	// 当前场景类型 {0: moving, 1: talking, 2: menu, 3: fighting}
	this.stateType = 0;
	// controls
	this.btnUpIsDowned = 0;
	this.btnDownIsDowned = 0;
	this.btnLeftIsDowned = 0;
	this.btnRightIsDowned = 0;
	this.btnAIsDowned = 0;
	this.btnBIsDowned = 0;
	this.btnBetween = 200;
	this.btnStartIsDowned = false;
	// fighting time
	this.fightTime = 0;
	this.fightTimeBetween = 6000;
	this.fightPosition = null;
	this.step = 0;
	this.monsterStep = 8;
	this.canStep = true;
};
statePlay.prototype = {
	init: function(startType) {
		this.talkBoard = Util.addTalkBoard();
		this.menuBoard = Util.addMenuBoard();
		this.startType = startType;
	},
	create: function() {
		// 判断模式
		if (this.startType === 0) {
			this.transition1();
		} else if (this.startType === 1) {
			this.continueGame();
		}
		console.log(GameData.mapData.currentLayer);
	},
	update: function() {
		// collide
		var currentLayer = GameData.mapData.currentLayer;
		currentLayer.layerGroup.forEach(function(layer) {
			game.physics.arcade.collide(this.heroAimee, layer);
			game.physics.arcade.collide(currentLayer.npcs, layer);
		}, this);
		if (currentLayer.hasOwnProperty('npcs')) {
			game.physics.arcade.collide(this.heroAimee, currentLayer.npcs);
		}
		game.physics.arcade.overlap(this.heroAimee, currentLayer.doorLayer, function(hero, tile) {
			if (tile.index !== -1 && !this.layerChanging) {
				this.canUpdate = false;
				this.layerChanging = true;
				if (Util.changeLayer(hero, tile, this) === false) {
					this.canUpdate = true;
					this.layerChanging = false;
				}
			}
		}, null, this);
		// change hero z-index
		for (var key in currentLayer.npcs.children) {
			var npc = currentLayer.npcs.children[key];
			if (game.physics.arcade.distanceBetween(npc, this.heroAimee) < 46) {
				if (npc.y > this.heroAimee.y) {
					game.world.bringToTop(currentLayer.npcs);
				} else {
					game.world.bringToTop(this.heroAimee);
				}
				game.world.bringToTop(this.talkBoard.group);
				game.world.bringToTop(this.menuBoard.group);
				break;
			}
		}

		// if monster
		if (currentLayer.monster && this.canStep) {
			// this.addStep();
		}

		if (!this.canUpdate) {
			return false;
		}
		// 根据场景类型 -> 特定场景update()
		if (this.stateType === 0) { //moving
			this.updateStateMoving(currentLayer);
			Util.npcAutoMove(currentLayer, this.heroAimee); // npc auto move
		} else if (this.stateType === 1) { // talking
			this.updateStateTalking(currentLayer);
		} else if (this.stateType === 2) { // menu
			this.updateStateMenu(currentLayer);
		} else if (this.stateType === 3) { // fighting
			this.updateStateFighting(currentLayer);
		}

		// 禁止连按
		if (!Util.gameControl.up.isDown) {
			this.btnUpIsDowned = 0;
		}
		if (!Util.gameControl.down.isDown) {
			this.btnDownIsDowned = 0;
		}
		if (!Util.gameControl.left.isDown) {
			this.btnLeftIsDowned = 0;
		}
		if (!Util.gameControl.right.isDown) {
			this.btnRightIsDowned = 0;
		}
		if (!Util.gameControl.A.isDown) {
			this.btnAIsDowned = 0;
		}
		if (!Util.gameControl.B.isDown) {
			this.btnBIsDowned = 0;
		}
		if (!Util.gameControl.start.isDown) {
			this.btnStartIsDowned = false;
		}
	},
	updateStateMoving: function(currentLayer) {
		if (Util.gameControl.up.isDown && !this.isMoving) {
			this.isMoving = true;
			this.heroDirection = 'up';
			this.heroAimee.animations.play('up');
		} else if (Util.gameControl.left.isDown && !this.isMoving) {
			this.isMoving = true;
			this.heroDirection = 'left';
			this.heroAimee.animations.play('left');
		} else if (Util.gameControl.right.isDown && !this.isMoving) {
			this.isMoving = true;
			this.heroDirection = 'right';
			this.heroAimee.animations.play('right');
		} else if (Util.gameControl.down.isDown && !this.isMoving) {
			this.isMoving = true;
			this.heroDirection = 'down';
			this.heroAimee.animations.play('down');
		}
		if (this.isMoving) {
			switch (this.heroDirection) {
				case 'up':
					this.heroAimee.y -= 4;
					if ((this.heroAimee.y + 12) % 32 === 0) {
						this.isMoving = false;
						this.heroDirection = '';
						console.log(++this.step);
					}
					break;
				case 'down':
					this.heroAimee.y += 4;
					if ((this.heroAimee.y + 12) % 32 === 0) {
						this.isMoving = false;
						this.heroDirection = '';
						console.log(++this.step);
					}
					break;
				case 'left':
					this.heroAimee.x -= 4;
					if ((this.heroAimee.x + 2) % 32 === 0) {
						this.isMoving = false;
						this.heroDirection = '';
						console.log(++this.step);
					}
					break;
				case 'right':
					console.log(this.heroAimee.x + 2);
					this.heroAimee.x = Number((this.heroAimee.x + 3.2).toFixed(1));
					console.log(this.heroAimee.x + 2);
					if ((this.heroAimee.x + 2) % 32 === 0) {
						this.isMoving = false;
						this.heroDirection = '';
						if (++this.step === this.monsterStep) {
							// this.isMoving = true;
							this.step = 0;
							console.log('monster!!!');
						}
					}
					break;
			}
		}


		if (Util.gameControl.A.isDown && game.time.now > this.btnAIsDowned + this.btnBetween) {
			// talk
			this.btnAIsDowned = game.time.now;
			// 当前为移动状态 判断 有没有 满足对话条件 的npc
			if (currentLayer.hasOwnProperty('npcs')) {
				for (var key in currentLayer.npcs.children) {
					var npc = currentLayer.npcs.children[key];
					if (game.physics.arcade.distanceBetween(npc, this.heroAimee) === 32) {
						if (this.heroDirection === 'up' && npc.y < this.heroAimee.y) {
							npc.play('down');
						} else if (this.heroDirection === 'down' && npc.y > this.heroAimee.y) {
							npc.play('up');
						} else if (this.heroDirection === 'left' && npc.x < this.heroAimee.x) {
							npc.play('right');
						} else if (this.heroDirection === 'right' && npc.x > this.heroAimee.x) {
							npc.play('left');
						} else {
							continue;
						}
						this.stateType = 1;
						var npcIndex = currentLayer.npcs.getChildIndex(npc);
						var npcWord = currentLayer.npcsDatas[npcIndex].words;
						this.talkBoard.setWord(npcWord);
						this.talkBoard.toggleBoard();
						break;
					}
				}
			}
		} else if (Util.gameControl.start.isDown && !this.btnStartIsDowned) {
			// this.btnStartIsDowned = true;
			// this.stateType = 2;
			// this.menuBoard.toggleBoard();
		}
	},
	updateStateTalking: function(currentLayer) {
		if (Util.gameControl.A.isDown && game.time.now > this.btnAIsDowned + this.btnBetween) {
			this.btnAIsDowned = game.time.now;
			if (!this.talkBoard.nextWord()) {
				this.stateType = 0;
			}
		} else if (Util.gameControl.B.isDown && game.time.now > this.btnBIsDowned + this.btnBetween) {
			this.btnBIsDowned = game.time.now;
			this.talkBoard.toggleBoard();
			this.stateType = 0;
		}
	},
	updateStateMenu: function(currentLayer) {
		if (Util.gameControl.up.isDown && game.time.now > this.btnUpIsDowned + this.btnBetween) {
			this.btnUpIsDowned = game.time.now;
			this.menuBoard.receiveControl('Up');
		} else if (Util.gameControl.down.isDown && game.time.now > this.btnDownIsDowned + this.btnBetween) {
			this.btnDownIsDowned = game.time.now;
			this.menuBoard.receiveControl('Down');
		} else if (Util.gameControl.left.isDown && game.time.now > this.btnLeftIsDowned + this.btnBetween) {
			this.btnLeftIsDowned = game.time.now;
			this.menuBoard.receiveControl('Left');
		} else if (Util.gameControl.right.isDown && game.time.now > this.btnRightIsDowned + this.btnBetween) {
			this.btnRightIsDowned = game.time.now;
			this.menuBoard.receiveControl('Right');
		} else if (Util.gameControl.A.isDown && game.time.now > this.btnAIsDowned + this.btnBetween) {
			this.btnAIsDowned = game.time.now;
			this.menuBoard.receiveControl('A');
		} else if (Util.gameControl.B.isDown && game.time.now > this.btnBIsDowned + this.btnBetween) {
			this.btnBIsDowned = game.time.now;
			if (this.menuBoard.receiveControl('B')) {
				this.stateType = 0;
			}
		}
	},
	updateStateFighting: function(currentLayer) {
		if (Util.gameControl.up.isDown) {
			console.log('up');
		} else if (Util.gameControl.down.isDown) {
			console.log('down');
		} else if (Util.gameControl.left.isDown) {
			console.log('left');
		} else if (Util.gameControl.right.isDown) {
			console.log('right');
		} else if (Util.gameControl.A.isDown) {
			console.log('A');
		} else if (Util.gameControl.B.isDown) {
			console.log('B');
		}
	},
	continueGame: function() {
		Util.enterLayer('White', this);
		this.heroAimee = Util.addHero(GameData.heros.Aimee, 10 * 32, 28 * 32);
		game.camera.follow(this.heroAimee);
		this.canUpdate = true;
	},
	render: function() {
		// game.debug.body(this.heroAimee);
		// game.debug.bodyInfo(this.heroAimee, 0, 10);
		// game.debug.body(GameData.mapData.currentLayer.npcs.getBottom());
		// game.debug.bodyInfo(GameData.mapData.currentLayer.npcs.getBottom(), 0, 10);
	}
};