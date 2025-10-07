import { gameSettings } from './controlPanel';
import { save_match } from './stats';

let verifyStart: boolean = false;
let verifyFirstCollision: boolean = false;

// ---- Game state  ----
const GameState = { START: "start", PLAYING: "playing", PAUSED: "paused", GAME_OVER: "gameOver" } as const;
type GameStateType = typeof GameState[keyof typeof GameState];
let gameState: GameStateType = GameState.START;

// ---- Types ----
interface Player {
	x: number;
	y: number;
	width: number;
	height: number;
	score: number;
}
interface Ball {
	x: number;
	y: number;
	radius: number;
	velocityX: number;
	velocityY: number;
	speed: number
}
interface Net {
	x: number;
	y: number;
	width: number;
	height: number;
}

// ---- Keyboard settings ----
let wPressed = false;
let sPressed = false;
let upPressed = false;
let downPressed = false;

window.addEventListener("keydown", (e) => {
	if (e.key === "w" || e.key === "W") wPressed = true;
	if (e.key === "s" || e.key === "S") sPressed = true;
	if (e.key === "ArrowUp") upPressed = true;
	if (e.key === "ArrowDown") downPressed = true;
});
window.addEventListener("keyup", (e) => {
	if (e.key === "w" || e.key === "W") wPressed = false;
	if (e.key === "s" || e.key === "S") sPressed = false;
	if (e.key === "ArrowUp") upPressed = false;
	if (e.key === "ArrowDown") downPressed = false;
});

function showOverlay_message(message: string)
{
	const overlay = document.getElementById("game-overlay") as HTMLDivElement | null;
	const msgEl = document.getElementById("game-message") as HTMLParagraphElement | null;
	if (!overlay || !msgEl) return;

	msgEl.textContent = message;
	overlay.classList.remove("hidden");
}

// ---- Overlay helpers ----
function showOverlay(btn_type: number, buttons: { text: string; onClick: () => void }[])
{
	const overlay = document.getElementById("game-overlay") as HTMLDivElement | null;
	const btns = document.getElementById("overlay-buttons") as HTMLDivElement | null;
	if (!overlay || !btns) return;

	btns.innerHTML = "";
	if (btn_type === 1) {
		buttons.forEach(b => {
			const btn = document.createElement("button");
			btn.textContent = b.text;
			btn.className =	"px-8 py-2 text-white font-lucky text-lg rounded-full shadow-lg transition-transform \
							transform bg-[#00091D] border-2 border-white hover:scale-105 hover:border-green-600 \
							hover:shadow-green-500/50 hover:shadow-2xl focus:outline-none hover:text-green-600";
			btn.onclick = b.onClick;
			btns.appendChild(btn);
		});
	}
	if (btn_type === 2) {
		buttons.forEach(b => {
			const btn = document.createElement("button");
			btn.textContent = b.text;
			btn.className =	"w-35 px-8 py-2 text-white font-lucky text-lg rounded-lg shadow-lg transition-transform \
							transform bg-[#00091D] border-2 border-white hover:scale-105 hover:border-blue-600 \
							hover:shadow-blue-500/50 hover:shadow-2xl focus:outline-none hover:text-blue-600";
			btn.onclick = b.onClick;
			btns.appendChild(btn);
		});
	}
		overlay.classList.remove("hidden");
}
function hideOverlay()
{
	const overlay = document.getElementById("game-overlay");
	if (overlay) overlay.classList.add("hidden");
}

// ---- Main entry ----
export function setPong()
{
	const { canvas, context } = getCanvasAndContext();
	if (!canvas || !context) return;

	const player1: Player = {
		x: 30,
		y: canvas.height / 2 - 100 / 2,
		width: 10,
		height: 100,
		score: 0,
	};
	const player2: Player = {
		x: canvas.width - 40,
		y: canvas.height / 2 - 100 / 2,
		width: 10,
		height: 100,
		score: 0,
	};
	const ball: Ball = {
		x: canvas.width / 2,
		y: canvas.height / 2,
		radius: 10,
		velocityX: 0,
		velocityY: 0,
		speed: gameSettings.ballSpeed,
  	};
	const net: Net = {
		x: canvas.width / 2 - 1,
		y: 0,
		width: 2,
		height: 10,
	};

	// Keep paddles/ball centered for START
	player1.y = canvas.height / 2 - player1.height / 2;
	player2.y = canvas.height / 2 - player2.height / 2;
	ball.x = canvas.width / 2;
	ball.y = canvas.height / 2;
	ball.velocityX = 0;
	ball.velocityY = 0;

	const pauseBtn = document.getElementById("pause-btn") as HTMLButtonElement | null;
	const settingsBtn = document.getElementById("openSettings") as HTMLButtonElement | null;
	
	// Mouse control for single-player if enabled
	const movePaddleListener = (evt: any) => {
		movePaddleMouse(evt, canvas, player1)
	}
	if (gameSettings.mouse && !gameSettings.multiplayer) canvas.addEventListener("mousemove", movePaddleListener);

	// START overlay
	showOverlay(1, [
		{ text: "Start", onClick: () => { gameState = GameState.PLAYING; hideOverlay(); launchBall(ball); } },
	]);

	// Pause button
	if (pauseBtn) {
		pauseBtn.addEventListener("click", () => {
			if (gameState === GameState.PLAYING) {
				gameState = GameState.PAUSED;
				showOverlay(2, [
					{ text: "Resume", onClick: () => { gameState = GameState.PLAYING; hideOverlay(); } },
					{ text: "Restart", onClick: () => { restartGame(canvas, player1, player2, ball); } },
				]);
			}
		});
	}

	if (settingsBtn) {
		settingsBtn.addEventListener("click", () => {
			if (gameState === GameState.PLAYING) {
				gameState = GameState.PAUSED;
				showOverlay(2, [
					{ text: "Resume", onClick: () => { gameState = GameState.PLAYING; hideOverlay(); } },
					{ text: "Restart", onClick: () => { restartGame(canvas, player1, player2, ball); } },
				]);
			}
		});
	}

  // Space to pause/resume & start
	window.addEventListener("keydown", (e) => {
		if (e.code === "Space") {
			if (gameState === GameState.PLAYING) {
				gameState = GameState.PAUSED;
				showOverlay(2, [
					{ text: "Resume", onClick: () => { gameState = GameState.PLAYING; hideOverlay(); } },
					{ text: "Restart", onClick: () => { restartGame(canvas, player1, player2, ball); } },
				]);
			} else if (gameState === GameState.PAUSED) {
				gameState = GameState.PLAYING;
				hideOverlay();
			} else if (gameState === GameState.START) {
				gameState = GameState.PLAYING;
				hideOverlay();
				launchBall(ball);
			}
		}
	});

	function game() {
		// Always render so canvas is visible under overlay
		if (gameState === GameState.START || gameState === GameState.PAUSED || gameState === GameState.GAME_OVER) {
			render(canvas!, context!, player1, player2, ball, net);
			return;
		}
		if (gameSettings.multiplayer) movePaddlesWithKeyboard(canvas!, player1, player2);
		if (!gameSettings.multiplayer && !gameSettings.mouse) movePaddlePlayer1(canvas!, player1);
		update(canvas!, player1, player2, ball);
		render(canvas!, context!, player1, player2, ball, net);
	}

	function gameLoop() {
		//disable mouse
		if (!gameSettings.mouse || gameSettings.multiplayer) canvas!.removeEventListener("mousemove", movePaddleListener);
		game();
		requestAnimationFrame(gameLoop);
	}
	requestAnimationFrame(gameLoop);
}

// ---- Helpers ----

function movePaddleMouse(evt: MouseEvent, canvas: HTMLCanvasElement, player1: Player) {
	const rect = canvas!.getBoundingClientRect();
	let newY = evt.clientY - rect.top - player1.height / 2;
	if (newY < 0) newY = 0;
	if (newY + player1.height > canvas!.height) newY = canvas!.height - player1.height;
	player1.y = newY;
}

function restartGame(cvs: HTMLCanvasElement, p1: Player, p2: Player, b: Ball)
{
	p1.score = 0;
	p2.score = 0;
	p1.y = cvs.height / 2 - p1.height / 2;
	p2.y = cvs.height / 2 - p2.height / 2;
	b.x = cvs.width / 2;
	b.y = cvs.height / 2;
	b.velocityX = 0;
	b.velocityY = 0;

	gameState = GameState.PLAYING;
	hideOverlay();
	launchBall(b);
}

function launchBall(ball: Ball)
{
	let ballSpeed = ball.speed;
	if (verifyStart === false) {
		ballSpeed = gameSettings.ballSpeed;
		verifyStart = true;
	}
	const angle = Math.random() * Math.PI / 2 - Math.PI / 4;
	const direction = Math.random() < 0.5 ? 1 : -1;
	ball.velocityX = direction * ballSpeed * Math.cos(angle);
	ball.velocityY = ballSpeed * Math.sin(angle);
}

function movePaddlesWithKeyboard(cvs: HTMLCanvasElement, player1: Player, player2: Player)
{
	if (wPressed) player1.y -= gameSettings.paddleSpeed;
	if (sPressed) player1.y += gameSettings.paddleSpeed;
	if (upPressed) player2.y -= gameSettings.paddleSpeed;
	if (downPressed) player2.y += gameSettings.paddleSpeed;
	player1.y = Math.max(0, Math.min(player1.y, cvs.height - player1.height));
	player2.y = Math.max(0, Math.min(player2.y, cvs.height - player2.height));
}

function movePaddlePlayer1(cvs: HTMLCanvasElement, player1: Player)
{
	if (wPressed) player1.y -= gameSettings.paddleSpeed;
	if (sPressed) player1.y += gameSettings.paddleSpeed;
	player1.y = Math.max(0, Math.min(player1.y, cvs.height - player1.height));
}

function getCanvasAndContext()
{
	const canvas = document.getElementById("pong") as HTMLCanvasElement | null;
	if (!canvas) return { canvas: null, context: null };
	return { canvas, context: canvas.getContext("2d") };
}

function drawRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, color: string, border: boolean = false, bdr_color: string = "none")
{
	ctx.fillStyle = color;
	ctx.fillRect(x, y, w, h);
	if (border) {
		ctx.strokeStyle = bdr_color;
		ctx.lineWidth = 2; ctx.strokeRect(0, 0, w, h);
	}
}

function drawCircle(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, color: string)
{
	ctx.fillStyle = color;
	ctx.beginPath();
	ctx.arc(x, y, r, 0, Math.PI * 2, false);
	ctx.closePath();
	ctx.fill();
}

function drawText(ctx: CanvasRenderingContext2D, text: number, x: number, y: number, color: string)
{
	ctx.fillStyle = color;
	ctx.font = "45px fantasy";
	ctx.fillText(text.toString(), x, y);
}

function drawNet(cvs: HTMLCanvasElement, ctx: CanvasRenderingContext2D, net: Net)
{
	drawCircle(ctx, net.x, 0, 30, gameSettings.itemsColor);
	for (let i = 0; i <= cvs.height; i += 15) {
		drawRect(ctx, net.x, net.y + i, net.width, net.height, gameSettings.itemsColor);
	}
}

function render(cvs: HTMLCanvasElement, ctx: CanvasRenderingContext2D, player1: Player, player2: Player, ball: Ball, net: Net)
{
	drawRect(ctx, 0, 0, cvs.width, cvs.height, gameSettings.bgColor, true, gameSettings.itemsColor);
	drawNet(cvs, ctx, net);
	drawText(ctx, player1.score, cvs.width / 4, cvs.height / 5, gameSettings.itemsColor);
	drawText(ctx, player2.score, (3 * cvs.width) / 4, cvs.height / 5, gameSettings.itemsColor);
	drawRect(ctx, player1.x, player1.y, player1.width, player1.height, gameSettings.itemsColor);
	drawRect(ctx, player2.x, player2.y, player2.width, player2.height, gameSettings.itemsColor);
	drawCircle(ctx, ball.x, ball.y, ball.radius, gameSettings.itemsColor);
}

function collision(b: any, p: any)
{
	b.top = b.y - b.radius;
	b.bottom = b.y + b.radius;
	b.left = b.x - b.radius;
	b.right = b.x + b.radius;
	p.top = p.y;
	p.bottom = p.y + p.height;
	p.left = p.x;
	p.right = p.x + p.width;
	return b.right > p.left && b.bottom > p.top && b.left < p.right && b.top < p.bottom;
}

function resetBall(cvs: HTMLCanvasElement, ball: Ball)
{
	ball.x = cvs.width / 2;
	ball.y = cvs.height / 2;
	if (gameSettings.resetSpeed) ball.speed = gameSettings.ballSpeed;
	launchBall(ball);
}

function moveCom(cvs: HTMLCanvasElement, player2: Player, ball: Ball)
{
	const paddleCenter = player2.y + player2.height / 2;
	player2.y += (ball.y - paddleCenter) * gameSettings.difficulty;
	player2.y = Math.max(0, Math.min(player2.y, cvs.height - player2.height));
}

function update(cvs: HTMLCanvasElement, player1: Player, player2: Player, ball: Ball)
{
	ball.x += ball.velocityX;
	ball.y += ball.velocityY;

	if (!gameSettings.multiplayer) moveCom(cvs, player2, ball);

	if (ball.y + ball.radius > cvs.height) {
		ball.y = cvs.height - ball.radius;
		ball.velocityY = -ball.velocityY;
	} else if (ball.y - ball.radius < 0) {
		ball.y = ball.radius;
		ball.velocityY = -ball.velocityY;
	}

	const player = (ball.x < cvs.width / 2) ? player1 : player2;

	if (collision(ball, player)) {

		// let ballSpeed = ball.speed;
		if (verifyFirstCollision === false) {
			ball.speed = gameSettings.ballSpeed;
			verifyFirstCollision = true;
		} 

		let collidePoint = ball.y - (player.y + player.height / 2);
		collidePoint = collidePoint / (player.height / 2);
		const angleRad = collidePoint * Math.PI / 4;
		const direction = (ball.x < cvs.width / 2) ? 1 : -1;
		ball.velocityX = direction * ball.speed * Math.cos(angleRad);
		ball.velocityY = ball.speed * Math.sin(angleRad);
		ball.speed += 0.1;
		if (direction === 1) ball.x = player.x + player.width + ball.radius;
		else ball.x = player.x - ball.radius;
	}

	// Scoring
	if (ball.x - ball.radius < 0) {
		player2.score++;
		resetBall(cvs, ball);
	} else if (ball.x + ball.radius > cvs.width) {
		player1.score++;
		resetBall(cvs, ball);
	}

	// Game over logic (show overlay + restart)
	if (player1.score === gameSettings.scoreLimit || player2.score === gameSettings.scoreLimit) {
		gameState = GameState.GAME_OVER;
		let message: string;
		if (player1.score === gameSettings.scoreLimit) message = "PLAYER 1 WINS!!!";
		else if (gameSettings.multiplayer) message = "PLAYER 2 WINS!!!";
		else message = "PLAYER 1 LOSES!!!";
		showOverlay(1, [
			{ text: "Restart", onClick: () => { restartGame(cvs, player1, player2, ball); } },
		]);
		showOverlay_message(message);
		setTimeout(() => {
		  save_match(player1.score, player2.score, gameSettings.multiplayer);
		}, 16);
	}
}