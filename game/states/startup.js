"use strict";


function startup()
{
}

startup.prototype =
{
	preload: function()
	{
		this.game.load.image("loading", "assets/sprites/loading.png");
	},

	create: function()
	{
		this.game.state.start("preload");
	}
};