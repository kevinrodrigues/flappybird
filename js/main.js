/*
@author : kevin rodrigues
built using phaser.js
*/

var buildGame = new Phaser.Game(600, 490, Phaser.AUTO, 'gamestage'),
	mainStage = {
		preload: function() {
			//function to run at the beginning..
			//load game assets here..

			buildGame.stage.backgroundColor = '#71c5cf';

			//load graphics..
			buildGame.load.image('bird', 'img/bird.png');
			buildGame.load.image('pipe', 'img/pipe.png');

			//load sound..
			buildGame.load.audio('jump', 'img/jump.wav');
		},
		create: function() {
			//create game after contents has preloaded..

			//create type of physics system..
			buildGame.physics.startSystem(Phaser.Physics.ARCADE);
			this.bird = this.game.add.sprite(100, 245, 'bird');

			//create a group for pipes to live in & allow phhysics..
			this.pipes = buildGame.add.group();
			this.pipes.enableBody = true;
			
			//add 20 pipes to the game..
			this.pipes.createMultiple(20, 'pipe');

			//add gravity to the bird..
			buildGame.physics.arcade.enable(this.bird);
			this.bird.body.gravity.y = 1000;

			//add the jump function to the space bar..
			var spacebar = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
			spacebar.onDown.add(this.jump, this);

			//add pipes to the game..
			this.timer = buildGame.time.events.loop(1500, this.addRowOfPipes, this);

			//scoring..
			this.score = 0;

			this.labelScore = buildGame.add.text(20, 20, '0', {font: '30px arial', fill: '#ffffff'});

			//update anchor point on the bird..
			this.bird.anchor.setTo(-0.2, 0.5);

			//create the sound..
			this.jumpSound = buildGame.add.audio('jump');
		},
		update: function() {
			//detect if the bird is out of the world..

			if (this.bird.inWorld === false) {
				this.restartGame();
			}

			//update everytime the bird collides with a pipe..
			buildGame.physics.arcade.overlap(this.bird, this.pipes, this.hitPipe, null, this);

			// add rotation to the bird while going up and down..
			if (this.bird.angle < 20) {
				this.bird.angle += 1;
			}
		},
		jump: function() {

			//set animation to change the angle of the bird to -20degrees in 100 milliseconds..
			buildGame.add.tween(this.bird).to({angle: -20}, 100).start();

			if (this.bird.alive === false) {
				return;
			}

			//add vertical velocity to the bird..
			this.bird.body.velocity.y = -350;

			//play jump sound..
			this.jumpSound.play();
		},
		//restart the game..
		restartGame: function() {
			buildGame.state.start('main');
		},
		//adding pipes..
		addOnePipe: function(x, y) {
			//get the first dead pipe of our group here..
			var pipe = this.pipes.getFirstDead();

			//set the new positions of the pipe..
			pipe.reset(x, y);

			//add velocity to the pipe to make it move left..
			pipe.body.velocity.x = -200;

			//hide the hide when its no longer visible..
			pipe.checkWorldBounds = true;
			pipe.outOfBoundsKill = true;
		},
		addRowOfPipes: function() {
			// create a hole..
			var hole = Math.floor(Math.random() * 5) + 1;

			//update score everytime a new pipe is created..
			this.score += 1;
			this.labelScore.text = this.score;

			//add the 6 pipes..
			for (var i = 0; i < 8; i++) {
				if (i != hole && i != hole +1) {
					this.addOnePipe(400, i * 60 + 10);
				}	
			}
		},
		hitPipe: function() {

			//if the bird has already hit a pipe we do nothing..
			if (this.bird.alive === false) {
				return;
			}

			//set the alive property of the bird to false..
			this.bird.alive = false;

			//prevent new pipes from appearing..
			buildGame.time.events.remove(this.timer);

			//stop other pipes from moving..
			this.pipes.forEachAlive(function(p){
				p.body.velocity.x = 0;
			}, this);


		}
	};


// excute game here..
buildGame.state.add('main', mainStage);
buildGame.state.start('main');


