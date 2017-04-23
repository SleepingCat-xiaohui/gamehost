var game = new Phaser.Game(640, 480, Phaser.CANVAS);

game.state.add('boot', stateBoot, true);
game.state.add('loading', stateLoading);
game.state.add('menu', stateMenu);
game.state.add('play', statePlay);