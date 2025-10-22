import { gameSettings } from "./gameSettings.js";

export class GameEngine
{
	player1;
	player2;
	ball;
	net;
	gameState = "start"; // Use string instead of GameState.START

	canvasWidth = gameSettings.canvasWidth;
	canvasHeight = gameSettings.canvasHeight;

	constructor(canvasWidth = gameSettings.canvasWidth, canvasHeight = gameSettings.canvasHeight)
	{
		this.canvasWidth = canvasWidth;
		this.canvasHeight = canvasHeight;

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

	resetBall(canvasWidth, canvasHeight)
	{
		this.ball.x = canvasWidth / 2;
		this.ball.y = canvasHeight / 2;
		this.ball.velocityX = 0;
		this.ball.velocityY = 0;
		if (gameSettings.resetSpeed) {
			this.ball.speed = gameSettings.ballSpeed;
		}
	}

	restart(canvasWidth, canvasHeight) 
	{
		this.player1.score = 0;
		this.player2.score = 0;
		this.player1.y = canvasHeight / 2 - this.player1.height / 2;
		this.player2.y = canvasHeight / 2 - this.player2.height / 2;
		this.resetBall(canvasWidth, canvasHeight);
		this.gameState = "start";
	}

	launchBall() 
	{
		if (this.ball.velocityX === 0 && this.ball.velocityY === 0) {
			// Random direction with consistent speed
			const angle = (Math.random() * Math.PI / 2) - Math.PI / 4; // -45 to +45 degrees
			this.ball.velocityX = Math.random() > 0.5 ? Math.cos(angle) * this.ball.speed : -Math.cos(angle) * this.ball.speed;
			this.ball.velocityY = Math.sin(angle) * this.ball.speed;
		}
	}

	collision(ball, player) 
	{
		return (
			ball.x + ball.radius > player.x &&
			ball.x - ball.radius < player.x + player.width &&
			ball.y + ball.radius > player.y &&
			ball.y - ball.radius < player.y + player.height
		);
	}

	update(canvasWidth, canvasHeight) 
	{
		if (this.gameState !== "playing") return;

		// Ball movement
		this.ball.x += this.ball.velocityX;
		this.ball.y += this.ball.velocityY;

		// Wall bounce (top and bottom)
		if (this.ball.y - this.ball.radius < 0 || this.ball.y + this.ball.radius > canvasHeight) {
			this.ball.velocityY = -this.ball.velocityY;
			
			// Adjust position to prevent sticking
			if (this.ball.y - this.ball.radius < 0) {
				this.ball.y = this.ball.radius;
			} else {
				this.ball.y = canvasHeight - this.ball.radius;
			}
		}

		// Paddle collision
		let player = this.ball.x < canvasWidth / 2 ? this.player1 : this.player2;
		if (this.collision(this.ball, player)) {
			// Calculate collision point on paddle (-0.5 to 0.5 from center)
			let collidePoint = (this.ball.y - (player.y + player.height / 2)) / (player.height / 2);
			collidePoint = Math.max(-0.5, Math.min(0.5, collidePoint)); // Clamp to paddle bounds
			
			// Calculate angle based on collision point
			const angleRad = collidePoint * (Math.PI / 3); // 60 degree max angle
			
			// Determine direction
			const direction = this.ball.x < canvasWidth / 2 ? 1 : -1;
			
			// Update velocity
			this.ball.velocityX = direction * this.ball.speed * Math.cos(angleRad);
			this.ball.velocityY = this.ball.speed * Math.sin(angleRad);
			
			// Increase speed slightly
			this.ball.speed += 0.1;
			
			// Adjust position to prevent multiple collisions
			if (direction === 1) {
				this.ball.x = player.x + player.width + this.ball.radius;
			} else {
				this.ball.x = player.x - this.ball.radius;
			}
		}

		// Scoring
		if (this.ball.x - this.ball.radius < 0) {
			this.player2.score++;
			this.ball.speed = (this.ball.speed || gameSettings.ballSpeed) + 1;
			this.resetBall(canvasWidth, canvasHeight);
			this.gameState = "scored";
			this._scoreTimer && clearTimeout(this._scoreTimer);
			// this._scoreTimer = setTimeout(() => {
				this.gameState = "playing";
				this.launchBall();
			// }, 1500);
		} else if (this.ball.x + this.ball.radius > canvasWidth) {
			this.player1.score++;
			this.ball.speed = (this.ball.speed || gameSettings.ballSpeed) + 1;
			this.resetBall(canvasWidth, canvasHeight);
			this.gameState = "scored";
			this._scoreTimer && clearTimeout(this._scoreTimer);
			// this._scoreTimer = setTimeout(() => {
				this.gameState = "playing";
				this.launchBall();
			// }, 1500);
		}

		// Game over condition
		if (this.player1.score >= gameSettings.scoreLimit || this.player2.score >= gameSettings.scoreLimit) {
			this.gameState = "game_over";
		}
	}

	// Helper method to get game state for clients
	getState() {
		return {
			gameState: this.gameState,
			ball: this.ball,
			paddles: {
				left: this.player1,
				right: this.player2
			},
			score: {
				left: this.player1.score,
				right: this.player2.score
			}
		};
	}

	// Provide a stable initial state representation for new matches
	getInitialState() {
		try {
			if (typeof this.getState === "function") return this.getState();
			if (typeof this.serialize === "function") return this.serialize();
			// minimal safe fallback
			return {
				players: this.players || [],
				ball: this.ball || null,
				score: this.score || { left: 0, right: 0 },
				settings: this.settings || {}
			};
		} catch (err) {
			console.warn("GameEngine.getInitialState fallback used:", err);
			return {};
		}
	}
}