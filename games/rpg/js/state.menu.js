// menu
var stateMenu = function() {
	this.startType = 0; // new: 0, old: 1
	this.btn1 = null;
	this.btn2 = null;
	this.tip = null;
};
stateMenu.prototype = {
	create: function() {
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
	},
	update: function() {
		if (Util.gameControl.up.isDown) {
			this.startType = 0;
			this.btn1.fill = '#f00';
			this.btn2.fill = '#fff';
			this.tip.y = 250;
		} else if (Util.gameControl.down.isDown) {
			this.startType = 1;
			this.btn1.fill = '#fff';
			this.btn2.fill = '#f00';
			this.tip.y = 300;
		} else if (Util.gameControl.start.isDown) {
			game.state.start('play', true, false, this.startType);
		}
	}
};