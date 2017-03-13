var game = new Phaser.Game(640, 960, Phaser.AUTO);
game.States = {};
game.States.main = function() {
	this.preload = function() {
		game.load.image('ball', 'assets/ball.png');
		game.load.image('target', 'assets/target.png');
		game.load.image('arm', 'assets/arm.png');
		this.scale.pageAlignHorizontally = true;
		this.scale.pageAlignVertically = true;
		this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
	}
	this.create = function() {
		var bgColor = this.getRandomColor();
		this.stage.setBackgroundColor(bgColor);
		document.getElementsByTagName('body')[0].style.background = '#' + bgColor.toString(16);
		// init
		this.scoreMax = localStorage.getItem('climbUpScore') ? JSON.parse(localStorage.getItem('climbUpScore')) : {
			score: 0
		};
		this.score = 0;
		this.step = 0;
		this.rotateSpeed = 4;
		this.rotationDirection = Math.random() < 0.5 ? -1 : 1;
		this.isCheckPass = false;
		this.startGame = false;
		this.targetArray = [];
		// score board
		this.scoreBoard = game.add.text(10, game.height - 74, 'HI:' + this.scoreMax.score, {
			font: 'bold 64px Arial',
			fill: '#fff'
		});
		// three main group and an arr
		this.gameGroup = game.add.group();
		this.targetGroup = game.add.group(this.gameGroup);
		this.ballGroup = game.add.group(this.gameGroup);
		// init targetGroup
		var targetBall = this.targetGroup.create(game.width / 2, game.height * 2.7 / 4, 'target');
		targetBall.anchor.setTo(0.5);
		this.targetArray.push(targetBall);
		for (var i = 0; i < 7; i++) {
			this.addTarget();
		}
		// init ballGroup
		this.ballGroup.x = game.width / 2;
		this.ballGroup.y = game.height * 2.7 / 4;
		this.ballGroup.angle = 90;
		var arm = this.ballGroup.create(0, 0, 'arm');
		var ball1 = this.ballGroup.create(0, 0, 'ball');
		var ball2 = this.ballGroup.create(120, 0, 'ball');
		arm.anchor.setTo(0, 0.5);
		ball1.anchor.setTo(0.5);
		ball2.anchor.setTo(0.5);
		this.ballGroup.setAll('tint', Phaser.Color.getRandomColor(50, 250));

		this.input.onDown.addOnce(function() {
			this.startGame = true;
		}, this);
		this.input.onDown.add(this.changeBall, this);
	}
	this.update = function() {
		var distance = this.ballGroup.getTop().worldPosition.distance(this.targetArray[1].worldPosition);
		if (distance > 90 && this.isCheckPass && this.startGame) {
			this.isCheckPass = false;
			this.gameOver();
		}
		if (distance < 40 && !this.isCheckPass && this.startGame) {
			this.isCheckPass = true;
		}
		this.ballGroup.angle += this.rotateSpeed * this.rotationDirection;

		var distanceX = this.ballGroup.getChildAt(1).worldPosition.x - game.width / 2;
		var distanceY = this.ballGroup.getChildAt(1).worldPosition.y - game.height / 4 * 2.7;
		this.gameGroup.x = Phaser.Math.linearInterpolation([this.gameGroup.x, this.gameGroup.x - distanceX], 0.05);
		this.gameGroup.y = Phaser.Math.linearInterpolation([this.gameGroup.y, this.gameGroup.y - distanceY], 0.05);
	}
	this.changeBall = function() {
		this.isCheckPass = false;
		var distance = this.ballGroup.getTop().worldPosition.distance(this.targetArray[1].worldPosition);
		if (distance < 20) {
			var shiftTween = game.add.tween(this.targetArray.shift()).to({
				alpha: 0
			}, 1000, Phaser.Easing.Linear.In, true);
			shiftTween.onComplete.add(function(e) {
				e.destroy();
			}, this);
			this.ballGroup.position.x = this.ballGroup.getTop().worldPosition.x - this.gameGroup.x;
			this.ballGroup.position.y = this.ballGroup.getTop().worldPosition.y - this.gameGroup.y;
			this.ballGroup.angle += 180;
			this.rotationDirection = Math.random() < 0.5 ? 1 : -1;
			this.targetGroup.forEach(function(targetBall) {
				targetBall.alpha += 1 / 7;
			}, this);
			this.addTarget();
			this.getScore();
		} else {
			this.gameOver();
		}
	}
	this.addTarget = function() {
		this.step++;
		var randomAngle = Math.random() * 130 + 25;
		var targetX = this.targetGroup.getTop().x + 120 * Math.cos(Phaser.Math.degToRad(randomAngle));
		var targetY = this.targetGroup.getTop().y - 120 * Math.sin(Phaser.Math.degToRad(randomAngle));
		var targetBall = this.targetGroup.create(targetX, targetY, 'target');
		targetBall.anchor.setTo(0.5);
		targetBall.alpha = 1 - (this.targetGroup.countLiving() - 1) / 7;
		var text = game.add.text(0, 0, this.step + '', {
			font: 'bold 32px Arial'
		});
		text.anchor.setTo(0.5);
		targetBall.addChild(text);
		this.targetArray.push(targetBall);
	}
	this.getScore = function() {
		this.score++;
		if (this.score > this.scoreMax.score) {
			this.scoreBoard.text = 'HI:' + this.score;
			this.scoreMax.score = this.score;
			localStorage.setItem('climbUpScore', JSON.stringify(this.scoreMax));
		}
	}
	this.gameOver = function() {
		this.rotateSpeed = 0;
		var gameOverTween = game.add.tween(this.ballGroup).to({
			alpha: 0
		}, 1000, Phaser.Easing.Cubic.In, true);
		gameOverTween.onComplete.add(function() {
			game.state.start('main');
		}, this);
	}
	this.getRandomColor = function() {
		return (Math.floor(Math.random() * 200) << 16) |
			(Math.floor(Math.random() * 200) << 8) |
			(Math.floor(Math.random() * 200));
	}
}
game.state.add('main', game.States.main, true);