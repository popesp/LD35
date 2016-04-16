"use strict";


window.onload = function()
{
	let game;
	let callbacks = {};

	callbacks.preload = function()
	{
	};

	callbacks.create = function()
	{
	};

	callbacks.update = function()
	{
	};

	callbacks.render = function()
	{
	};

	game = new Phaser.Game(800, 600, Phaser.AUTO, '', callbacks, false, false);
};