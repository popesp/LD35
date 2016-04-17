"use strict";


function preload()
{
}

preload.prototype =
{
	preload: function()
	{
		// create loading bar
		let loading = this.add.image(this.stage.width*0.5, this.stage.height*0.5, "loading");
		loading.anchor.set(0.5);
		this.load.setPreloadSprite(loading);

		// load assets
		this.game.load.spritesheet("tiles", "assets/sprites/tiles.png", 8, 8);
		this.game.load.spritesheet("player", "assets/sprites/character.png", 16, 16);
		this.game.load.spritesheet("particles", "assets/sprites/particles.png", 2, 2);
		this.game.load.image("background", "assets/sprites/background.png");
		this.game.load.image("mana_border", "assets/sprites/mana_border.png");
		this.game.load.image("mana", "assets/sprites/mana.png");

		// create levels object
		this.game.levels = new Levels();
	},

	create: function()
	{
		this.game.state.start("playing");
	}
};