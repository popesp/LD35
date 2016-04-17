"use strict";


window.onload = function()
{
	const GAME_WIDTH = 800;
	const GAME_HEIGHT = 600;

	let game = new Phaser.Game(GAME_WIDTH, GAME_HEIGHT, Phaser.AUTO, "", null, false, false);

	game.state.add("startup", startup);
	game.state.add("preload", preload);
	game.state.add("playing", playing);

	game.state.start("startup");
};