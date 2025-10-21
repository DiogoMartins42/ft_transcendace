// ---- Game states ----
export const GameState = {
	START: "start",
	PLAYING: "playing",
	PAUSED: "paused",
	GAME_OVER: "gameOver",
} as const;

export type GameStateType = typeof GameState[keyof typeof GameState];

// ---- Entities ----
export interface Player
{
	x: number;
	y: number;
	width: number;
	height: number;
	score: number;
}

export interface Ball
{
	x: number;
	y: number;
	radius: number;
	velocityX: number;
	velocityY: number;
	speed: number;
}

export interface Net 
{
	x: number;
	y: number;
	width: number;
	height: number;
}

// ---- WebSocket message formats ----
export interface InputMessage
{
	type: "input";
	player: "left" | "right";
	direction: "up" | "down" | "stop";
}


export interface ControlMessage
{
	type: "control";
	action: "start" | "pause" | "resume" | "restart";
}

export interface StateMessage
{
	type: "state";
	gameState: GameStateType;
	ball: Ball;
	paddles: { left: Player; right: Player };
	score: { left: number; right: number };
}

