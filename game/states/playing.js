"use strict";


const TILE_SIZE = 48;
const TILE_VARIATIONS = 3;
const TILE_TYPES = 9;
const TILE_IMAGE_SIZE = 8;
const TILE_SCALE = TILE_SIZE/TILE_IMAGE_SIZE;
const TILE_COLLISION = [false, true, true, false, false, false];

const TILE_TYPE_EXIT = 5;
const TILE_TYPE_VINES = [7, 8];
const TILE_TYPE_SPIKE = 6;

const PLAYER_GRAVITY = 1000;
const PLAYER_SIZE = 48;
const PLAYER_IMAGE_SIZE = 16;
const PLAYER_SCALE = PLAYER_SIZE/PLAYER_IMAGE_SIZE;
const PLAYER_ANIMATION_FRAMERATE = 10;
const PLAYER_ANIMATION_FRAMESPERFORM = 4;
const PLAYER_JUMP_STRENGTH = 500;
const PLAYER_DJUMP_STRENGTH = 400;
const PLAYER_MOVE_SPEED = 20;
const PLAYER_MAX_SPEED = 300;
const PLAYER_TRANSFORM_COST = 10;
const PLAYER_CLIMB_SPEED = 150;
const PLAYER_CLIMBJUMP_UP = 500;
const PLAYER_CLIMBJUMP_BACK = 400;
const PLAYER_AIR_THRESHHOLD = 100;

const PLAYER_FORM_DJUMP = 0;
const PLAYER_FORM_CLIMB = 1;
const PLAYER_FORM_BOUNCE = 2;

const PLAYER_KEY_LEFT = Phaser.KeyCode.A;
const PLAYER_KEY_RIGHT = Phaser.KeyCode.D;
const PLAYER_KEY_ACTION = Phaser.KeyCode.SPACEBAR;
const PLAYER_KEY_INTERACT = Phaser.KeyCode.W;
const PLAYER_KEY_DOWN = Phaser.KeyCode.S;
const PLAYER_KEY_DJUMP = Phaser.KeyCode.I;
const PLAYER_KEY_CLIMB = Phaser.KeyCode.O;
const PLAYER_KEY_BOUNCE = Phaser.KeyCode.P;
const PLAYER_KEY_RESET = Phaser.KeyCode.R;

const PLAYER_FRAME_IDLE = 0;
const PLAYER_FRAME_RISE = 1;
const PLAYER_FRAME_AIR = 2;
const PLAYER_FRAME_FALL = 3;
const PLAYER_FRAME_HANGING = 0;


function playing()
{
}

playing.prototype =
{
	create: function()
	{
		// start physics subsytem
		this.game.physics.startSystem(Phaser.Physics.ARCADE);

		// add background image
		this.game.add.image(0, 0, "background").fixedToCamera = true;

		this.game.tiles = this.game.add.group();
		this.game.tiles.enableBody = true;

		/* --- INIT PARTICLES --- */
		this.game.death_emitter = this.game.add.emitter(0, 0, 20);
		this.game.death_emitter.makeParticles("particles", 1);
		this.game.death_emitter.gravity = 200;

		/* --- INIT PLAYER --- */
		this.game.player = this.game.add.sprite(0, 0, "player");
		this.game.physics.arcade.enable(this.game.player);
		this.game.player.body.gravity.y = PLAYER_GRAVITY;
		this.game.player.anchor.set(0.5, 1);
		this.game.player.scale.set(PLAYER_SCALE);

		// player animations
		this.game.player.animations.add("run0", [0, 1, 2, 3], PLAYER_ANIMATION_FRAMERATE, true);
		this.game.player.animations.add("run1", [4, 5, 6, 7], PLAYER_ANIMATION_FRAMERATE, true);
		this.game.player.animations.add("run2", [8, 9, 10, 11], PLAYER_ANIMATION_FRAMERATE, true);

		this.game.player.frame_form = function(frame)
		{
			this.frame = this.form*PLAYER_ANIMATION_FRAMESPERFORM + frame;
		};

		this.game.player.die = function()
		{
			this.game.enterlevel(this.game.level_index);
		};

		/* --- INIT INPUT --- */
		this.game.cursors = this.game.input.keyboard.addKeys
		({
			left: PLAYER_KEY_LEFT,
			right: PLAYER_KEY_RIGHT,
			action: PLAYER_KEY_ACTION,
			interact: PLAYER_KEY_INTERACT,
			down: PLAYER_KEY_DOWN,
			form_djump: PLAYER_KEY_DJUMP,
			form_climb: PLAYER_KEY_CLIMB,
			form_bounce: PLAYER_KEY_BOUNCE,
			reset: PLAYER_KEY_RESET
		});

		this.game.cursors.action.onDown.add(function()
		{
			if (this.body.touching.down && (this.form !== PLAYER_FORM_BOUNCE))
				this.body.velocity.y = -PLAYER_JUMP_STRENGTH;
			else
			{
				switch(this.form)
				{
					case PLAYER_FORM_DJUMP:
						if (!this.djumped)
						{
							this.body.velocity.y = -PLAYER_DJUMP_STRENGTH;
							this.djumped = true;
						}
						break;

					case PLAYER_FORM_CLIMB:
						if (this.onvine)
						{
							if (this.body.touching.left)
							{
								this.body.velocity.x = PLAYER_CLIMBJUMP_BACK;
								this.body.velocity.y = -PLAYER_CLIMBJUMP_UP;
							}
							else if (this.body.touching.right)
							{
								this.body.velocity.x = -PLAYER_CLIMBJUMP_BACK;
								this.body.velocity.y = -PLAYER_CLIMBJUMP_UP;
							}
						}
						break;

					default:
						// nothing
						break;
				}
			}
		}, this.game.player);

		this.game.cursors.reset.onDown.add(function()
		{
			this.enterlevel(this.level_index);
		}, this.game);

		this.game.cursors.interact.onDown.add(function()
		{
			if (this.player.onexit)
				this.enterlevel(this.level_index + 1);
		}, this.game);

		this.game.cursors.form_djump.onDown.add(function()
		{
			if (this.form !== PLAYER_FORM_DJUMP)
			{
				if (this.mana >= PLAYER_TRANSFORM_COST)
				{
					this.form = PLAYER_FORM_DJUMP;
					this.djumped = false;
					this.body.bounce.y = 0;
					this.mana -= PLAYER_TRANSFORM_COST;
				}
			}
		}, this.game.player);

		this.game.cursors.form_climb.onDown.add(function()
		{
			if (this.form !== PLAYER_FORM_CLIMB)
			{
				if (this.mana >= PLAYER_TRANSFORM_COST)
				{
					this.form = PLAYER_FORM_CLIMB;
					this.body.bounce.y = 0;
					this.mana -= PLAYER_TRANSFORM_COST;
				}
			}
		}, this.game.player);

		this.game.cursors.form_bounce.onDown.add(function()
		{
			if (this.form !== PLAYER_FORM_BOUNCE)
			{
				if (this.mana >= PLAYER_TRANSFORM_COST)
				{
					this.form = PLAYER_FORM_BOUNCE;
					this.body.bounce.y = 1;
					this.mana -= PLAYER_TRANSFORM_COST;
				}
			}
		}, this.game.player);

		// set up level procedure
		this.game.enterlevel = function(index)
		{
			let level = this.levels[index];

			this.level_index = index;
			this.world.setBounds(0, 0, level.dim.x*TILE_SIZE, level.dim.y*TILE_SIZE);

			this.tiles.removeAll(true);

			if (this.manabar)
				this.manabar.destroy();

			for (let i in level.tiles)
			{
				let row = level.tiles[i];

				for (let j in row)
				{
					let tile = this.tiles.create(j*TILE_SIZE, i*TILE_SIZE, "tiles");
					tile.frame = row[j] + Math.floor(Math.random()*TILE_VARIATIONS)*TILE_TYPES;
					tile.scale.set(TILE_SCALE);
					tile.body.immovable = true;
				}
			}

			this.player.x = level.spawn.x*TILE_SIZE + TILE_SIZE/2;
			this.player.y = level.spawn.y*TILE_SIZE + TILE_SIZE;

			this.player.form = PLAYER_FORM_DJUMP;
			this.player.djumped = false;
			this.player.onexit = false;
			this.player.onvine = false;
			this.player.mana = this.player.max_mana = 100;

			let border = this.add.image(32, 32, "mana_border");
			this.manabar = this.add.image(32, 32, "mana");
			border.scale.set(2);
			border.fixedToCamera = true;
			this.manabar.scale.set(2);
			this.manabar.fixedToCamera = true;
		};

		/* --- INIT CAMERA --- */ 
		this.game.camera.follow(this.game.player);

		// enter first level
		this.game.enterlevel(0);
	},

	update: function()
	{
		this.game.player.onexit = false;
		this.game.player.onvine = false;
		this.game.physics.arcade.collide(this.game.player, this.game.tiles, null, this.tile_overlap);

		this.handle_input(this.game.player, this.game.cursors);

		if (this.game.player.body.touching.down)
			this.game.player.djumped = false;
		else if (!this.game.player.onvine)
		{
			if (this.game.player.body.velocity.y < -PLAYER_AIR_THRESHHOLD)
				this.game.player.frame_form(PLAYER_FRAME_RISE);
			else if (this.game.player.body.velocity.y < PLAYER_AIR_THRESHHOLD)
				this.game.player.frame_form(PLAYER_FRAME_AIR);
			else
				this.game.player.frame_form(PLAYER_FRAME_FALL);
		}

		this.game.manabar.scale.x = 2*this.game.player.mana/this.game.player.max_mana;
	},

	handle_input: function(player, cursors)
	{
		// vine controls
		player.onvine = player.onvine && !player.body.touching.down && player.form === PLAYER_FORM_CLIMB;
		if (player.onvine)
		{
			player.body.velocity.y = 0;
			player.body.gravity.y = 0;

			if (cursors.interact.isDown)
			{
				if (!cursors.down.isDown)
				{
					console.log('going up');
					player.body.velocity.y = -PLAYER_CLIMB_SPEED;
					player.animations.play("climb_up");
				}
				else
					player.frame = PLAYER_FRAME_HANGING;
			}
			else if (cursors.down.isDown)
			{
				if (!cursors.interact.isDown)
				{
					player.body.velocity.y = PLAYER_CLIMB_SPEED;
					player.animations.play("climb_down");
				}
				else
					player.frame = PLAYER_FRAME_HANGING;
			}
			else
				player.frame = PLAYER_FRAME_HANGING;
		}
		else
			player.body.gravity.y = PLAYER_GRAVITY;

		let idle = function()
		{
			player.frame_form(PLAYER_FRAME_IDLE);
			player.body.velocity.x *= 0.6;
		};

		// left and right controls
		if (cursors.left.isDown)
		{
			if (!cursors.right.isDown)
			{
				player.body.velocity.x -= PLAYER_MOVE_SPEED;
				if (player.body.velocity.x < -PLAYER_MAX_SPEED)
					player.body.velocity.x = -PLAYER_MAX_SPEED;

				player.animations.play("run" + player.form);
				player.scale.x = -PLAYER_SCALE;
			}
			else
				idle();
		}
		else if (cursors.right.isDown)
		{
			if (!cursors.left.isDown)
			{
				player.body.velocity.x += PLAYER_MOVE_SPEED;
				if (player.body.velocity.x > PLAYER_MAX_SPEED)
					player.body.velocity.x = PLAYER_MAX_SPEED;

				player.animations.play("run" + player.form);
				player.scale.x = PLAYER_SCALE;
			}
			else
				idle();
		}
		else
			idle();
	},

	tile_overlap: function(player, tile)
	{
		let type = tile.frame%TILE_TYPES;

		if (type === TILE_TYPE_SPIKE)
			player.die();
		else if (type === TILE_TYPE_EXIT)
			player.onexit = true;
		else if (TILE_TYPE_VINES.indexOf(type) !== -1)
			player.onvine = true;

		return TILE_COLLISION[type];
	},

	render: function()
	{
		//this.game.debug.cameraInfo(this.game.camera, 32, 32);
		//this.game.debug.spriteCoords(this.game.player, 32, 128);
	}
};