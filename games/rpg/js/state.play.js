var game = new Phaser.Game(0, 0, Phaser.CANVAS);
// play
var statePlay = function() {
	// 过场动画属性
	this.canUpdate = false;
	this.layerChanging = false;
	this.startType = -1;
	// this.tweenSpeed = 800;
	// this.wordSpeed = 3000;
	this.tweenSpeed = 300;
	this.wordSpeed = 300;
	// talkBoard group
	this.talkBoard = null;
	// hero 属性
	this.heroDirection = '';
	this.heroAimee = null;
	this.heroAilice = null;
	// 当前场景类型 {0: moving, 1: talking, 2: menu, 3: fighting}
	this.stateType = 0;
	// controls
	this.btnUpIsDowned = false;
	this.btnDownIsDowned = false;
	this.btnLeftIsDowned = false;
	this.btnRightIsDowned = false;
	this.btnAIsDowned = false;
	this.btnBIsDowned = false;
	this.btnStartIsDowned = false;
};
statePlay.prototype = {
	init: function(startType) {
		this.talkBoard = Util.addTalkBoard();
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
		// map collide
		var currentLayer = GameData.mapData.currentLayer;
		currentLayer.layerGroup.forEach(function(layer) {
			game.physics.arcade.collide(this.heroAimee, layer);
			game.physics.arcade.collide(currentLayer.npcs, layer);
		}, this);
		game.physics.arcade.collide(this.heroAimee, currentLayer.npcs);
		game.physics.arcade.overlap(this.heroAimee, currentLayer.doorLayer, function(hero, tile) {
			if (tile.index !== -1 && !this.layerChanging) {
				this.canUpdate = false;
				this.layerChanging = true;
				Util.changeLayer(hero, tile, this);
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
				game.world.bringToTop(this.talkBoard);
				break;
			}
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
			this.btnUpIsDowned = false;
		}
		if (!Util.gameControl.down.isDown) {
			this.btnDownIsDowned = false;
		}
		if (!Util.gameControl.left.isDown) {
			this.btnLeftIsDowned = false;
		}
		if (!Util.gameControl.right.isDown) {
			this.btnRightIsDowned = false;
		}
		if (!Util.gameControl.A.isDown) {
			this.btnAIsDowned = false;
		}
		if (!Util.gameControl.B.isDown) {
			this.btnBIsDowned = false;
		}
		if (!Util.gameControl.start.isDown) {
			this.btnStartIsDowned = false;
		}
	},
	updateStateMoving: function(currentLayer) {
		this.heroAimee.body.velocity.setTo(0);
		if (Util.gameControl.up.isDown && (this.heroAimee.x + 2) % 32 === 0) {
			this.heroAimee.body.velocity.y = -180;
			this.heroDirection = 'up';
			this.heroAimee.animations.play('up');
		} else if (Util.gameControl.left.isDown && (this.heroAimee.y + 12) % 32 === 0) {
			this.heroAimee.body.velocity.x = -180;
			this.heroDirection = 'left';
			this.heroAimee.animations.play('left');
		} else if (Util.gameControl.right.isDown && (this.heroAimee.y + 12) % 32 === 0) {
			this.heroAimee.body.velocity.x = 180;
			this.heroDirection = 'right';
			this.heroAimee.animations.play('right');
		} else if (Util.gameControl.down.isDown && (this.heroAimee.x + 2) % 32 === 0) {
			this.heroAimee.body.velocity.y = 180;
			this.heroDirection = 'down';
			this.heroAimee.animations.play('down');
		} else if ((this.heroAimee.x + 2) % 32 || (this.heroAimee.y + 12) % 32) {
			this.canUpdate = false;
			var x = this.heroAimee.x + 2;
			var y = this.heroAimee.y + 12;
			var properties = {
				x: x,
				y: y
			};
			var duration = 1000;
			if (this.heroDirection === 'up') {
				properties.y = Math.floor(y / 32) * 32;
				duration *= (y - properties.y) / 180;
			} else if (this.heroDirection === 'down') {
				properties.y = Math.ceil(y / 32) * 32;
				duration *= (properties.y - y) / 180;
			} else if (this.heroDirection === 'left') {
				properties.x = Math.floor(x / 32) * 32;
				duration *= (x - properties.x) / 180;
			} else if (this.heroDirection === 'right') {
				properties.x = Math.ceil(x / 32) * 32;
				duration *= (properties.x - x) / 180;
			}
			properties.x -= 2;
			properties.y -= 12;
			var tween = game.add.tween(this.heroAimee);
			tween.to(properties, duration, null, true, 0, 0, false);
			tween.onComplete.add(function() {
				this.canUpdate = true;
			}, this);
		} else if (Util.gameControl.A.isDown && !this.btnAIsDowned) {
			// talk
			this.btnAIsDowned = true;
			// 当前为移动状态 判断 有没有 满足对话条件 的npc
			var thisCanTalk = false;
			for (var key in currentLayer.npcs.children) {
				var npc = currentLayer.npcs.children[key];
				if (game.physics.arcade.distanceBetween(npc, this.heroAimee) === 32) {
					if (this.heroDirection === 'up' && npc.y < this.heroAimee.y) {
						npc.play('down');
						this.enterTlak(currentLayer, npc);
						thisCanTalk = true;
						break;
					} else if (this.heroDirection === 'down' && npc.y > this.heroAimee.y) {
						npc.play('up');
						this.enterTlak(currentLayer, npc);
						thisCanTalk = true;
						break;
					} else if (this.heroDirection === 'left' && npc.x < this.heroAimee.x) {
						npc.play('right');
						this.enterTlak(currentLayer, npc);
						thisCanTalk = true;
						break;
					} else if (this.heroDirection === 'right' && npc.x > this.heroAimee.x) {
						npc.play('left');
						this.enterTlak(currentLayer, npc);
						thisCanTalk = true;
						break;
					}
				}
			}
		} else if (Util.gameControl.start.isDown && !this.btnStartIsDowned) {
			this.btnStartIsDowned = true;
			this.stateType = 2;
		}
	},
	enterTlak: function(currentLayer, npc) {
		this.stateType = 1;
		var npcIndex = currentLayer.npcs.getChildIndex(npc);
		var npcWord = currentLayer.npcsDatas[npcIndex].words;
		this.talkBoard.setWord(npcWord);
		this.talkBoard.toggleBoard();
	},
	updateStateTalking: function(currentLayer) {
		if (Util.gameControl.A.isDown && !this.btnAIsDowned) {
			this.btnAIsDowned = true;
			if (!this.talkBoard.nextWord()) {
				this.stateType = 0;
			}
		} else if (Util.gameControl.B.isDown && !this.btnBIsDowned) {
			this.btnBIsDowned = true;
			this.talkBoard.toggleBoard();
			this.stateType = 0;
		}
	},
	updateStateMenu: function(currentLayer) {
		if (Util.gameControl.up.isDown && !this.btnUpIsDowned) {
			this.btnUpIsDowned = true;
			console.log('up');
		} else if (Util.gameControl.down.isDown && !this.btnDownIsDowned) {
			this.btnDownIsDowned = true;
			console.log('down');
		} else if (Util.gameControl.left.isDown && !this.btnLeftIsDowned) {
			this.btnLeftIsDowned = true;
			console.log('left');
		} else if (Util.gameControl.right.isDown && !this.btnRightIsDowned) {
			this.btnRightIsDowned = true;
			console.log('right');
		} else if (Util.gameControl.A.isDown && !this.btnAIsDowned) {
			this.btnAIsDowned = true;
			console.log('A');
		} else if (Util.gameControl.B.isDown && !this.btnBIsDowned) {
			this.btnBIsDowned = true;
			console.log('B');
			this.stateType = 0;
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