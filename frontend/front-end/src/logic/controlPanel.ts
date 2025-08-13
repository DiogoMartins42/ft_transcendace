export let gameSettings: {difficulty: number, resetSpeed: boolean, 
	multiplayer: boolean, mouse: boolean, paddleSpeed: number, ballSpeed: number, 
	scoreLimit: number, bgColor: string, itemsColor: string, default: boolean} =
{
	//Defalut settings

	//Single player settings (should be disabled when multiplayer is true)
	difficulty: 0.1, //input: range from 1 to 10 (for the user and 0.1 - 1 for the program). 1-3: easy (color green), 4-6: normal (color yellow), 7-9: hard (color red), 10: impossible (color black) 
	mouse: false, //input: radio with two options, mouse for true and keyboard for false

	//modes
	multiplayer: false, //input: radio with two options, multiplayer for true and sigle player for false

	//general settings
	resetSpeed: true, //input: checkbox
	paddleSpeed: 5, // input: range from 1 to 10
	ballSpeed: 3,  // input: range from 1 to 10 
	scoreLimit: 5, //input: number, must be > 0
	bgColor: '#1C39BB', //input: color
	itemsColor: '#F5CB5C', //input: color
	default: false, //input: button that if clicked will reset all settings except modes to their default state
}