var game = new Phaser.Game(0, 0, Phaser.CANVAS);
// gameData
var GameData = {
	heros: {
		Aimee: 'CP001AB', //艾米
		Ailice: 'CP002AB', //爱丽丝

		Joy: 'CP005AB', // 乔伊
		Katherine: 'CP006AB' // 凯瑟琳
	},
	audios: [], // audios
	mapData: {
		map: null,
		currentLayer: {},
		layers: {},
		World: { // 世界地图

		},
		White: { // 怀特村
			width: 40 * 32,
			height: 40 * 32,
			layers: [
				['White_bg'],
				['White_bg2', 3633, 3634, 3649, 3650, 3726, 3727, 3728, 3590, 3606, 3758, 3759, 3760, 3441, 3571],
				['White_door', 2721, 2769, 2788, 3541],
			],
			doors: {
				2721: ['World', 0, 0],
				2769: ['World', 0, 0],
				2788: ['World', 0, 0],
				3541: {
					1027: ['WhiteAiliceHome', 11, 13]
				}
			},
			npcs: [{
					texture: 'Joy',
					x: 13 * 32,
					y: 30 * 32,
					canAuto: true,
					moveTime: 0,
					minX: 13 * 32,
					minY: 30 * 32,
					maxX: 17 * 32,
					maxY: 31 * 32,
					animation: ['left'],
					words: ['村民：天气不错~']
				}
				// , {
				// 	texture: 'Katherine',
				// 	x: 18 * 32,
				// 	y: 30 * 32,
				// 	canAuto: true,
				// 	autoArea: {

				// 	},
				// 	animation: ['down'],
				// 	words: ['村民：天气不错~']
				// }
			]
		},
		WhiteAiliceHome: { // 怀特村 爱丽丝 家
			width: 20 * 32,
			height: 15 * 32,
			layers: [
				['White_ailicehome_bg', 1763, 1779, 1780, 1795, 1796, 2177, 2193],
				['White_ailicehome_door', 1730]
			],
			doors: {
				1730: ['White', 10, 28]
			},
			npcs: [{
				texture: 'Ailice',
				x: 16 * 32,
				y: 8 * 32,
				canAuto: false,
				animation: ['left'],
				words: ['爱丽丝：天气不错~']
			}]
		}
	},
	controlKeys: {
		up: Phaser.KeyCode.W,
		down: Phaser.KeyCode.S,
		left: Phaser.KeyCode.A,
		right: Phaser.KeyCode.D,
		start: Phaser.KeyCode.SPACEBAR,
		A: Phaser.KeyCode.K,
		B: Phaser.KeyCode.L
	}
};
// util
var Util = {
	// map layers
	initLayer: function(targetLayer, context) {
		// 先不做缓存处理,每次新建layer
		// destory layer
		if (GameData.mapData.currentLayer.layerName) {
			GameData.mapData.currentLayer.layerGroup.destroy();
			GameData.mapData.currentLayer.doorLayer.destroy();
			GameData.mapData.currentLayer.npcs.destroy();
			GameData.mapData.currentLayer.npcsDatas = [];
		}
		// init layer
		var layerGroup = game.add.group();
		var doorLayer = null;
		var layerData = JSON.parse(JSON.stringify(GameData.mapData[targetLayer]));
		for (var i = 0; i < layerData.layers.length; i++) {
			var layerName = layerData.layers[i].shift();
			var layer = GameData.mapData.map.createLayer(layerName);
			GameData.mapData.map.setCollision(layerData.layers[i], true, layer);
			if (layerName.indexOf('door') === -1) {
				layerGroup.add(layer);
			} else {
				doorLayer = layer;
			}
		}
		game.world.resize(layerData.width, layerData.height);
		// init npc
		var npcsData = layerData.npcs;
		var npcs = game.add.group();
		for (var key in npcsData) {
			var hero = Util.addHero(game, GameData.heros[npcsData[key].texture], npcsData[key].x, npcsData[key].y, true);
			hero.play(npcsData[key].animation);
			npcs.add(hero);
		}
		GameData.mapData.currentLayer.layerGroup = layerGroup;
		GameData.mapData.currentLayer.doorLayer = doorLayer;
		GameData.mapData.currentLayer.npcs = npcs;
		GameData.mapData.currentLayer.npcsDatas = npcsData.slice(0);
		GameData.mapData.currentLayer.layerName = targetLayer;
	},
	enterLayer: function(targetLayer, context) {
		Util.initLayer(targetLayer, context);
	},
	changeLayer: function(hero, tile, context) {
		var doors = GameData.mapData[GameData.mapData.currentLayer.layerName].doors;
		var targetLayer = doors[tile.index];

		var tween = game.add.tween(game.world);
		tween.to({
			alpha: 0
		}, 300, null, true, 300, 0, false);
		tween.onComplete.addOnce(function() {
			if (!(targetLayer instanceof Array)) {
				var tileX = tile.worldX / 32;
				var tileY = tile.worldY / 32;
				targetLayer = targetLayer['' + tileX + tileY];
			}
			Util.enterLayer(targetLayer[0], context);
			hero.reset(targetLayer[1] * 32 - 2, targetLayer[2] * 32 - 12);
			game.world.bringToTop(hero);
			game.camera.follow(hero);
			tween = game.add.tween(game.world);
			tween.to({
				alpha: 1
			}, 300, null, true, 300, 0, false);
			tween.onComplete.addOnce(function() {
				context.canUpdate = true;
				context.layerChanging = false;
			}, context);
		}, context);
	},
	// heros
	addHero: function(game, key, x, y, isNPC) {
		var hero = game.add.sprite(x - 2, y - 12, key);
		hero.scale.setTo(0.8);
		game.physics.enable(hero);
		hero.body.setSize(40, 40, 2.5, 15);
		hero.body.collideWorldBounds = true;
		if (isNPC) {
			hero.body.immovable = true;
		}
		hero.animations.add('left', [4, 5, 6, 7], 6, true);
		hero.animations.add('up', [8, 9, 10, 11], 6, true);
		hero.animations.add('right', [12, 13, 14, 15], 6, true);
		hero.animations.add('down', [0, 1, 2, 3], 6, true);
		return hero;
	},
	npcAutoMove: function(currentLayer, hero) {
		for (var key in currentLayer.npcsDatas) {
			var npc = currentLayer.npcs.getChildAt(key);
			var npcData = currentLayer.npcsDatas[key];
			if (!npcData.canAuto) {
				continue;
			}
			if (game.time.now < npcData.moveTime + 3000) {
				continue;
			}
			var npcX = npc.x + 2;
			var npcY = npc.y + 12;
			var properties = {
				x: npc.x,
				y: npc.y
			}
			var direcArr = ['up', 'down', 'left', 'right'];
			if (npcX === npcData.minX) {
				direcArr.splice(direcArr.indexOf('left'), 1);
			}
			if (npcX === npcData.maxX) {
				direcArr.splice(direcArr.indexOf('right'), 1);
			}
			if (npcY === npcData.minY) {
				direcArr.splice(direcArr.indexOf('up'), 1);
			}
			if (npcY === npcData.maxY) {
				direcArr.splice(direcArr.indexOf('down'), 1);
			}
			if (game.physics.arcade.distanceBetween(npc, hero) === 32) {
				if (npc.y > hero.y) {
					direcArr.indexOf('up') !== -1 ? direcArr.splice(direcArr.indexOf('up'), 1) : '';
				} else if (npc.y < hero.y) {
					direcArr.indexOf('down') !== -1 ? direcArr.splice(direcArr.indexOf('down'), 1) : '';
				} else if (npc.x < hero.x) {
					direcArr.indexOf('right') !== -1 ? direcArr.splice(direcArr.indexOf('right'), 1) : '';
				} else if (npc.x > hero.x) {
					direcArr.indexOf('left') !== -1 ? direcArr.splice(direcArr.indexOf('left'), 1) : '';
				}
			}
			var direction = direcArr[Math.floor(Math.random() * direcArr.length)];
			if (direction === 'up') {
				properties.y -= 32;
			} else if (direction === 'down') {
				properties.y += 32;
			} else if (direction === 'left') {
				properties.x -= 32;
			} else if (direction === 'right') {
				properties.x += 32;
			}
			npc.play(direction);

			var tile1 = GameData.mapData.map.getTile(npcX / 32, npcY / 32, currentLayer.layerGroup.getBottom());
			tile1.setCollision(true, true, true, true);
			var tile2 = GameData.mapData.map.getTile((properties.x + 2) / 32, (properties.y + 12) / 32, currentLayer.layerGroup.getBottom());
			tile2.setCollision(true, true, true, true);

			var tween = game.add.tween(npc);
			tween.to(properties, 32000 * 4 / 180, null, true, 0, 0, false);
			tween.onComplete.addOnce(function() {
				tile1.setCollision(false, false, false, false);
				tile2.setCollision(false, false, false, false);
			}, this);
			npcData.moveTime = game.time.now;
		}
	},
	// talkBoard
	addTalkBoard: function(game, text) {
		var talkBoardGroup = game.add.group();
		talkBoardGroup.alpha = 0;
		talkBoardGroup.fixedToCamera = true;
		// board
		var board = game.add.image(32 * 2, 32 * 11, 'talkboard');
		board.scale.setTo(2, 1.5);
		board.alpha = 0.3;
		talkBoardGroup.add(board);
		// text 26px
		var word = game.add.text(32 * 2 + 10, 32 * 11 + 10, '', {
			font: 'bold 26px microsoft yahei',
			fill: '#fff'
		});
		var word2 = game.add.text(32 * 2 + 10, 32 * 12 + 16, '', {
			font: 'bold 26px microsoft yahei',
			fill: '#fff'
		});
		talkBoardGroup.add(word);
		talkBoardGroup.add(word2);
		// obj
		return {
			talkBoardGroup: talkBoardGroup,
			board: board,
			words: [word, word2],
			setWord: function(text) {
				this.words[0].text = text[0] || '';
				this.words[1].text = text[1] || '';
			},
			nextWord: function() {
				console.log('nextWord');
				this.toggleBoard();
				return false;
			},
			toggleBoard: function() {
				if (this.talkBoardGroup.alpha === 1) {
					this.talkBoardGroup.alpha = 0;
					this.setWord('', '');
				} else {
					game.world.bringToTop(this.talkBoardGroup);
					this.talkBoardGroup.alpha = 1;
				}
			}
		};
	},
	// gameControl
	gameControl: function(game, controlKeys) {
		if (typeof this.gameControl === 'function') {
			var cursor = game.input.keyboard.addKeys(controlKeys || GameData.controlKeys);
			this.gameControl = cursor;
			return cursor;
		}
	}
};