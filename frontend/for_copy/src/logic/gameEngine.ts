import { Player, Ball, Net, GameState, GameStateType } from "./pong_types";
import { gameSettings } from "./gameSettings.ts";

export class GameEngine
{
	player1: Player;
	player2: Player;
	ball: Ball;
	net: Net;
	gameState: GameStateType = GameState.START;

	constructor(canvasWidth: number, canvasHeight: number)
	{
		this.player1 = {
			x: 30,
			y: canvasHeight / 2 - 50,
			width: 10,
			height: 100,
			score: 0,
		};
		this.player2 = {
			x: canvasWidth - 40,
			y: canvasHeight / 2 - 50,
			width: 10,
			height: 100,
			score: 0,
		};
		this.ball = {
			x: canvasWidth / 2,
			y: canvasHeight / 2,
			radius: 10,
			velocityX: 0,
			velocityY: 0,
			speed: gameSettings.ballSpeed,
		};
		this.net = { x: canvasWidth / 2 - 1, y: 0, width: 2, height: 10 };
	}

	resetBall(canvasWidth: number, canvasHeight: number)
	{
		this.ball.x = canvasWidth / 2;
		this.ball.y = canvasHeight / 2;
		this.ball.velocityX = 0;
		this.ball.velocityY = 0;
		if (gameSettings.resetSpeed) {
			this.ball.speed = gameSettings.ballSpeed;
		}
	}

	restart(canvasWidth: number, canvasHeight: number) 
	{
		this.player1.score = 0;
		this.player2.score = 0;
		this.player1.y = canvasHeight / 2 - this.player1.height / 2;
		this.player2.y = canvasHeight / 2 - this.player2.height / 2;
		this.resetBall(canvasWidth, canvasHeight);
		this.gameState = GameState.START;
	}

	launchBall() 
	{
		if (this.ball.velocityX === 0 && this.ball.velocityY === 0) {
			this.ball.velocityX = Math.random() > 0.5 ? 5 : -5;
			this.ball.velocityY =
				(Math.random() * 4 + 2) * (Math.random() > 0.5 ? 1 : -1);
		}
	}

	collision(ball: Ball, player: Player): boolean 
	{
		return (
			ball.x + ball.radius > player.x &&
			ball.x - ball.radius < player.x + player.width &&
			ball.y + ball.radius > player.y &&
			ball.y - ball.radius < player.y + player.height
		);
	}

	update(canvasWidth: number, canvasHeight: number) 
	{
		if (this.gameState !== GameState.PLAYING) return;

		// Ball movement
		this.ball.x += this.ball.velocityX;
		this.ball.y += this.ball.velocityY;

		// Wall bounce
		if (
			this.ball.y - this.ball.radius < 0 ||
			this.ball.y + this.ball.radius > canvasHeight
		) {
			this.ball.velocityY = -this.ball.velocityY;
		}

		// Paddle collision
		const player =
			this.ball.x < canvasWidth / 2 ? this.player1 : this.player2;
		if (this.collision(this.ball, player)) {
			let collidePoint = this.ball.y - (player.y + player.height / 2);
			collidePoint = collidePoint / (player.height / 2);
			const angleRad = (Math.PI / 4) * collidePoint;
			const direction = this.ball.x < canvasWidth / 2 ? 1 : -1;
			this.ball.velocityX = direction * this.ball.speed * Math.cos(angleRad);
			this.ball.velocityY = this.ball.speed * Math.sin(angleRad);
			this.ball.speed += 0.5;
		}

		// Scoring
		if (this.ball.x - this.ball.radius < 0) {
			this.player2.score++;
			this.resetBall(canvasWidth, canvasHeight);
		} else if (this.ball.x + this.ball.radius > canvasWidth) {
			this.player1.score++;
			this.resetBall(canvasWidth, canvasHeight);
		}

		// Game over condition
		if (
			this.player1.score >= gameSettings.scoreLimit ||
			this.player2.score >= gameSettings.scoreLimit
		) {
			this.gameState = GameState.GAME_OVER;
		}
	}
}
