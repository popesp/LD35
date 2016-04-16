"use strict";


window.onload = function()
{
	const TILE_ATLAS_SIZE = 8;
	const TILE_SIZE = 48;
	const TILE_SCALE = TILE_SIZE/TILE_ATLAS_SIZE;

	const PLAYER_SPRITESHEET_SIZE = 16;
	const PLAYER_SIZE = 32;
	const PLAYER_SCALE = PLAYER_SIZE/PLAYER_SPRITESHEET_SIZE;

	const PLAYER_GRAVITY = 1000;
	const PLAYER_MOVE_SPEED = 150;
	const PLAYER_JUMP_STRENGTH = 500;
	const PLAYER_DJUMP_STRENGTH = 400;
	const PLAYER_ANIMATION_FRAMERATE = 10;

	const PLAYER_KEY_LEFT = Phaser.KeyCode.A;
	const PLAYER_KEY_RIGHT = Phaser.KeyCode.D;
	const PLAYER_KEY_ACTION = Phaser.KeyCode.SPACEBAR;
	const PLAYER_KEY_DJUMP = Phaser.KeyCode.I;
	const PLAYER_KEY_DASH = Phaser.KeyCode.O;
	const PLAYER_KEY_CLIMB = Phaser.KeyCode.P;

	const PLAYER_MODE_DJUMP_FRAME_IDLE = 0;
	const PLAYER_MODE_DJUMP_FRAME_AIRUP = 1;
	const PLAYER_MODE_DJUMP_FRAME_AIRDOWN = 2;
	const PLAYER_MODE_DJUMP_ANIMATION_RUN = [0, 1, 2];

	const PLAYER_MODE_DJUMP = 0;
	const PLAYER_MODE_DASH = 1;
	const PLAYER_MODE_CLIMB = 2;

	const TILE_COLLISION = [false, true, true, false, false, false];

	const LEVEL0_TILES =
	[
		[2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
		[2, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
		[2, 0, 0, 2, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
		[2, 0, 0, 3, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
		[2, 0, 0, 5, 0, 2, 1, 0, 0, 1, 1, 1, 1, 0, 0, 2],
		[2, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 3, 5, 0, 0, 2],
		[2, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 4, 0, 0, 0, 2],
		[2, 0, 0, 0, 0, 0, 0, 0, 1, 2, 0, 0, 0, 0, 0, 2],
		[2, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 1, 2],
		[2, 0, 1, 1, 0, 4, 2, 0, 0, 0, 0, 0, 4, 0, 2, 2],
		[2, 0, 0, 0, 0, 0, 2, 1, 0, 1, 1, 0, 0, 1, 2, 2],
		[2, 1, 1, 1, 1, 1, 2, 2, 1, 2, 2, 1, 1, 2, 2, 2]
	];
	const LEVEL0_WIDTH = 16;
	const LEVEL0_HEIGHT = 12;

	const PLAYER_SPAWN_X = 2;
	const PLAYER_SPAWN_Y = 2;

	let game;
	let callbacks = {};
	let player, platforms, cursors;

	callbacks.preload = function()
	{
		game.load.image("background", "assets/sprites/background.png");
		game.load.spritesheet("player", "assets/sprites/character.png", PLAYER_SPRITESHEET_SIZE, PLAYER_SPRITESHEET_SIZE);
		game.load.spritesheet("platforms", "assets/sprites/platforms.png", TILE_ATLAS_SIZE, TILE_ATLAS_SIZE);
	};

	callbacks.create = function()
	{
		// start physics subsytem
		game.physics.startSystem(Phaser.Physics.ARCADE);

		// add background
		let bg = game.add.image(0, 0, "background");
		bg.scale.set(15, 12);

		/* --- INIT WORLD --- */
		game.world.setBounds(0, 0, LEVEL0_WIDTH*TILE_SIZE, LEVEL0_HEIGHT*TILE_SIZE);

		/* --- INIT PLATFORMS --- */
		platforms = game.add.group();
		platforms.enableBody = true;

		for (let i in LEVEL0_TILES)
		{
			let row = LEVEL0_TILES[i];

			for (let j in row)
			{
				let platform = platforms.create(j*TILE_SIZE, i*TILE_SIZE, "platforms");
				platform.frame = row[j];
				platform.scale.set(TILE_SCALE, TILE_SCALE);
				platform.body.immovable = true;
			}
		}

		/* --- INIT PLAYER --- */
		player = game.add.sprite(PLAYER_SPAWN_X*TILE_SIZE, PLAYER_SPAWN_Y*TILE_SIZE, 'player');
		game.physics.arcade.enable(player);
		player.body.gravity.y = PLAYER_GRAVITY;
		player.anchor.set(0.5);
		player.scale.set(PLAYER_SCALE, PLAYER_SCALE);

		// player animations
		player.animations.add("run", PLAYER_MODE_DJUMP_ANIMATION_RUN, PLAYER_ANIMATION_FRAMERATE, true);

		// player attributes
		player.mode = PLAYER_MODE_DJUMP;
		player.djumped = false;
		player.dashed = false;

		/* --- INIT INPUT --- */
		cursors = game.input.keyboard.addKeys({left: PLAYER_KEY_LEFT, right: PLAYER_KEY_RIGHT, action: PLAYER_KEY_ACTION, mode_djump: PLAYER_KEY_DJUMP, mode_dash: PLAYER_KEY_DASH, mode_climb: PLAYER_KEY_CLIMB});
		cursors.action.onDown.add(function()
		{
			if (player.body.touching.down)
				player.body.velocity.y = -PLAYER_JUMP_STRENGTH;
			else
			{
				switch(player.mode)
				{
					case PLAYER_MODE_DJUMP:
						if (!player.djumped)
						{
							player.body.velocity.y = -PLAYER_DJUMP_STRENGTH;
							player.djumped = true;
						}
						break;

					case PLAYER_MODE_DASH:
						// dash
						break;

					default:
						// nothing
						break;
				}
			}
		});

		cursors.mode_djump.onDown.add(function()
		{
			if (player.mode !== PLAYER_MODE_DJUMP)
			{
				player.mode = PLAYER_MODE_DJUMP;
				player.djumped = false;
				// decrement transformation count
			}
		});

		cursors.mode_dash.onDown.add(function()
		{
			if (player.mode !== PLAYER_MODE_DASH)
			{
				player.mode = PLAYER_MODE_DASH;
				player.dashed = false;
				// decrement transformation count
			}
		});

		cursors.mode_climb.onDown.add(function()
		{
			if (player.mode !== PLAYER_MODE_CLIMB)
			{
				player.mode = PLAYER_MODE_CLIMB;
				// decrement transformation count
			}
		});

		/* --- INIT CAMERA --- */
		game.camera.follow(player);
	};

	let tile_collision = function(player, tile)
	{
		return TILE_COLLISION[tile.frame];
	};

	callbacks.update = function()
	{
		game.physics.arcade.collide(player, platforms, null, tile_collision);

		player.body.velocity.x = 0;

		if (cursors.left.isDown)
		{
			if (!cursors.right.isDown)
			{
				player.body.velocity.x = -PLAYER_MOVE_SPEED;
				player.animations.play("run");
				player.scale.x = -PLAYER_SCALE;

				player.timer_particle--;
			}
			else
				player.frame = PLAYER_MODE_DJUMP_FRAME_IDLE;
		}
		else if (cursors.right.isDown)
		{
			if (!cursors.left.isDown)
			{
				player.body.velocity.x = PLAYER_MOVE_SPEED;
				player.animations.play("run");
				player.scale.x = PLAYER_SCALE;

				player.timer_particle--;
			}
			else
				player.frame = PLAYER_MODE_DJUMP_FRAME_IDLE;
		}
		else
			player.frame = PLAYER_MODE_DJUMP_FRAME_IDLE;

		if (player.body.touching.down)
		{
			player.djumped = false;
			player.dashed = false;
		}
		else
		{
			if (player.body.velocity.y < 0)
				player.frame = PLAYER_MODE_DJUMP_FRAME_AIRUP;
			else
				player.frame = PLAYER_MODE_DJUMP_FRAME_AIRDOWN;
		}
	};

	callbacks.render = function()
	{
		game.debug.cameraInfo(game.camera, 32, 32);
		game.debug.spriteCoords(player, 32, 128);
	};

	game = new Phaser.Game(800, 600, Phaser.AUTO, '', callbacks, false, false);
};