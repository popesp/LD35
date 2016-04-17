"use strict";


function Levels()
{
	this[0] =
	{
		dim:
		{
			x: 20,
			y: 14
		},

		spawn:
		{
			x: 5,
			y: 7
		},

		exit:
		{
			x: 13,
			y: 9
		},

		tiles:
		[
			[2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2],
			[2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2],
			[2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2],
			[2, 2, 2, 2, 2, 2, 2, 4, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2],
			[2, 2, 2, 2, 2, 8, 0, 0, 0, 0, 0, 0, 0, 7, 2, 2, 2, 2, 2, 2],
			[2, 2, 2, 8, 4, 3, 0, 0, 0, 0, 0, 0, 0, 3, 7, 2, 2, 2, 2, 2],
			[2, 2, 2, 2, 0, 4, 0, 0, 0, 0, 0, 0, 0, 4, 0, 2, 2, 2, 2, 2],
			[2, 2, 2, 8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2],
			[2, 2, 2, 8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2],
			[2, 2, 2, 2, 1, 1, 1, 2, 2, 1, 0, 0, 0, 5, 0, 1, 2, 2, 2, 2],
			[2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 2, 2, 2, 2, 2],
			[2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
			[2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
			[2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2]
		]
	};

	this[1] =
	{
		dim:
		{
			x: 20,
			y: 16
		},

		spawn:
		{
			x: 4,
			y: 9
		},

		exit:
		{
			x: 13,
			y: 5
		},

		tiles:
		[
			[2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
			[2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
			[2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
			[2, 2, 2, 2, 2, 8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2],
			[2, 2, 2, 2, 0, 7, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 2, 2],
			[2, 2, 2, 0, 0, 3, 0, 2, 0, 0, 0, 0, 0, 5, 0, 0, 0, 7, 2, 2],
			[2, 2, 2, 0, 0, 4, 0, 2, 1, 0, 0, 1, 1, 1, 1, 0, 0, 7, 2, 2],
			[2, 2, 8, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 3, 4, 0, 0, 7, 2, 2],
			[2, 2, 8, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 4, 0, 0, 0, 7, 2, 2],
			[2, 2, 8, 0, 0, 0, 0, 0, 0, 0, 1, 2, 0, 0, 0, 0, 0, 2, 2, 2],
			[2, 2, 8, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 1, 2, 2, 2],
			[2, 2, 2, 0, 0, 0, 0, 4, 2, 0, 0, 0, 0, 0, 4, 0, 2, 2, 2, 2],
			[2, 2, 2, 1, 1, 0, 0, 0, 2, 1, 0, 1, 1, 0, 0, 1, 2, 2, 2, 2],
			[2, 2, 2, 2, 2, 1, 1, 1, 2, 2, 1, 2, 2, 6, 6, 2, 2, 2, 2, 2],
			[2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 2],
			[2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2]
		]
	};
}