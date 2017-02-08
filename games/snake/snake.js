/*
 * snake2.js
 * score height: 41px
 * snake map 20x29;
 */

var game = new Phaser.Game(320, 505, Phaser.AUTO);
game.States = {};
game.States.main = function() {
	this.preload = function() {
		if (!game.device.desktop) {
			game.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;
			game.scale.forcePortrait = true;
			game.scale.refresh();
		}
		game.load.image('snake', 'assets/snake/snake.png');
	}
	this.create = function() {
		// init score
		this.hScore = localStorage.getItem('hScore') ? localStorage.getItem('hScore') : 0;
		this.nScore = 0;
		this.hScoreArea = game.add.text(5, 5, 'HI:' + this.threeNum(this.hScore), {
			fill: '#f00'
		});
		this.nScoreArea = game.add.text(game.width - 50, 5, '000', {
			fill: '#fff'
		});
		// init snake [y, x]
		this.worldMap = [];
		this.snake = [
			[2, 0],
			[1, 0],
			[0, 0]
		];
		for (var i = 0; i < 29; i++) {
			this.worldMap[i] = [];
			for (var j = 0; j < 20; j++) {
				this.worldMap[i][j] = 0;
			}
		}
		this.worldMap[2][0] = 1;
		this.worldMap[1][0] = 1;
		this.worldMap[0][0] = 1;
		this.snakeMap = game.add.group();
		this.snakeMap.x = 0;
		this.snakeMap.y = 41;
		for (var i = 0; i < this.worldMap.length; i++) {
			for (var j = 0; j < this.worldMap[0].length; j++) {
				if (this.worldMap[i][j] == 1) {
					this.snakeMap.create(j * 16, i * 16, 'snake');
				}
			}
		}
		// init foot
		this.initFoot();
		// derection t-r-b-l 1234
		// check derection t-b:1 l-r:0 
		this.derection = 3;
		this.derectionNow = 1;
		this.speed = 400;
		this.time.events.loop(this.speed, this.snakeMove, this);
		this.time.events.start();
		// init opration
		this.cursor = game.input.keyboard.createCursorKeys();
		game.input.touch.touchStartCallback = this.touchHandler;
		game.input.touch.touchEndCallback = this.touchHandler;
	}

	this.update = function() {
		if (this.cursor.up.isDown) {
			if (!this.derectionNow) {
				this.derection = 1;
			}
		} else if (this.cursor.down.isDown) {
			if (!this.derectionNow) {
				this.derection = 3;
			}
		} else if (this.cursor.left.isDown) {
			if (this.derectionNow) {
				this.derection = 4;
			}
		} else if (this.cursor.right.isDown) {
			if (this.derectionNow) {
				this.derection = 2;
			}
		}
	}
	this.touchHandler = function(event) {
		_this = this.state.getCurrentState();
		switch (event.type) {
			case 'touchstart':
				_this.touchFirstPointX = event.touches[0].clientX;
				_this.touchFirstPointY = event.touches[0].clientY;
				break;
			case 'touchend':
				var diffX = event.changedTouches[0].clientX - _this.touchFirstPointX;
				var diffY = event.changedTouches[0].clientY - _this.touchFirstPointY;
				if (Math.abs(diffX) < 20 && Math.abs(diffY) < 20) {
					return false;
				}
				console.log(Math.abs(diffX) + '.' + Math.abs(diffY) + '.' + _this.derectionNow);
				if (Math.abs(diffX) > Math.abs(diffY) && _this.derectionNow) {
					if (diffX > 20) {
						_this.derection = 2;
					} else if (diffX < -20) {
						_this.derection = 4;
					}
				} else if (Math.abs(diffX) < Math.abs(diffY) && !_this.derectionNow) {
					if (diffY > 20) {
						_this.derection = 3;
					} else if (diffY < -20) {
						_this.derection = 1;
					}
				}
				break;
		}
	}
	this.snakeMove = function() {
		var snakePositionX = this.snake[0][1],
			snakePositionY = this.snake[0][0];
		if (this.derection == 1) {
			if (this.snake[0][0] - 1 < 0) {
				this.snake[0][0] = 28;
			} else {
				this.snake[0][0] -= 1;
			}
		} else if (this.derection == 3) {
			if (this.snake[0][0] + 1 >= 29) {
				this.snake[0][0] = 0;
			} else {
				this.snake[0][0] += 1;
			}
		} else if (this.derection == 2) {
			if (this.snake[0][1] + 1 >= 20) {
				this.snake[0][1] = 0;
			} else {
				this.snake[0][1] += 1;
			}
		} else if (this.derection == 4) {
			if (this.snake[0][1] - 1 < 0) {
				this.snake[0][1] = 19;
			} else {
				this.snake[0][1] -= 1;
			}
		}
		if (this.worldMap[this.snake[0][0]][this.snake[0][1]] == 1) {
			this.snake[0][1] = snakePositionX;
			this.snake[0][0] = snakePositionY;
			this.gameOver();
		} else if (this.worldMap[this.snake[0][0]][this.snake[0][1]] == 2) {
			this.snake[0][1] = snakePositionX;
			this.snake[0][0] = snakePositionY;
			this.eatFoot();
		} else {
			this.worldMap[this.snake[this.snake.length - 1][0]][this.snake[this.snake.length - 1][1]] = 0;
			this.worldMap[this.snake[0][0]][this.snake[0][1]] = 1;
			for (var i = 1, length = this.snake.length; i < length; i++) {
				var tempX = this.snake[i][1],
					tempY = this.snake[i][0];
				this.snake[i][1] = snakePositionX;
				this.snake[i][0] = snakePositionY;
				snakePositionX = tempX;
				snakePositionY = tempY;
			}
		}
		this.snakeRender();
	}
	this.initFoot = function() {
		var y = Math.floor(Math.random() * 29),
			x = Math.floor(Math.random() * 20);
		if (this.worldMap[y][x] == 1) {
			return this.initFoot();
		}
		this.foot = game.add.image(x * 16, y * 16 + 41, 'snake');
		this.worldMap[y][x] = 2;
	}
	this.eatFoot = function() {
		this.snake.unshift([(this.foot.y - 41) / 16, this.foot.x / 16]);
		this.worldMap[this.snake[0][0]][this.snake[0][1]] = 1;
		this.foot.destroy();
		this.initFoot();
		this.getScore();
	}
	this.snakeRender = function() {
		this.snakeMap.removeAll();
		var i = this.snake.length;
		while (i--) {
			this.snakeMap.create(this.snake[i][1] * 16, this.snake[i][0] * 16, 'snake');
		}
		// check derection
		if (this.snake[0][1] == this.snake[1][1]) {
			this.derectionNow = 1;
		} else {
			this.derectionNow = 0;
		}
	}
	this.threeNum = function(num) {
		switch ((num + '').length) {
			case 1:
				return '00' + num;
			case 2:
				return '0' + num;
			case 3:
				return num;
		}
	}
	this.getScore = function() {
		this.nScoreArea.text = this.threeNum(this.nScore + 1);
		this.nScore += 1;
		if (this.nScore > this.hScore) {
			this.hScoreArea.text = 'HI:' + this.threeNum(this.nScore);
			localStorage.setItem('hScore', this.nScore);
		}
	}
	this.gameOver = function() {
		this.time.events.stop(false);
		game.add.text(game.width / 2, game.height / 2, 'GameOver', {
			fill: '#345678',
			fontSize: '36px'
		}).anchor.setTo(0.5);
		game.add.text(game.width / 2, game.height / 2 + 30, 'tap to replay', {
			fill: '#345678',
			fontSize: '26px'
		}).anchor.setTo(0.5);
		this.input.onDown.addOnce(function() {
			game.state.start('main');
		}, this);
	}
}
game.state.add('main', game.States.main, true);