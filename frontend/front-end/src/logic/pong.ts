import {gameSettings} from './controlPanel'

const bg_color: string = '#1C39BB'
const items_color: string = '#F5CB5C'

interface Player {
	x: number;
	y: number;
	width: number;
	height: number;
	color: string;
	score: number;
}

interface Ball {
	x: number;
	y: number;
	radius: number;
	speed: number;
	velocityX: number;
	velocityY: number;
	color: string;
}

interface Net {
	x: number;
	y: number;
	width: number;
	height: number;
	color: string;
}

// Keyboard settings

let wPressed = false;
let sPressed = false;
let upPressed = false;
let downPressed = false;

// Listen for key presses
window.addEventListener("keydown", (e) => {
  if (e.key === "w" || e.key === "W") wPressed = true;
  if (e.key === "s" || e.key === "S") sPressed = true;
  if (e.key === "ArrowUp") upPressed = true;
  if (e.key === "ArrowDown") downPressed = true;
});

// Listen for key releases
window.addEventListener("keyup", (e) => {
  if (e.key === "w" || e.key === "W") wPressed = false;
  if (e.key === "s" || e.key === "S") sPressed = false;
  if (e.key === "ArrowUp") upPressed = false;
  if (e.key === "ArrowDown") downPressed = false;
});

//Function

export function setPong()
{
	const { canvas, context } = getCanvasAndContext();
	if (!canvas || !context) return

	const player1: Player = {
		x: 30,
		y: canvas.height/2 - 100/2,
		width: 10,
		height: 100,
		color: items_color,
		score: 0,
	}

	const player2: Player = {
		x: canvas.width - 40,
		y: canvas.height/2 - 100/2,
		width: 10,
		height: 100,
		color: items_color,
		score: 0,
	}

	const ball: Ball = {
		x: canvas.width/2,
		y: canvas.height/2,
		radius: 10,
		speed: gameSettings.ballSpeed,
		velocityX: 0,
		velocityY: 0,
		color: items_color,
	}

	const net: Net = {
		x: canvas.width/2 - 1,
		y: 0,
		width: 2,
		height: 10,
		color: items_color
	}

	launchBall(ball)

	if (gameSettings.mouse && !gameSettings.multiplayer) {
		canvas.addEventListener("mousemove", movePaddle)
		function movePaddle(evt: any)
		{
			let rect = canvas!.getBoundingClientRect()
	
			let newY = evt.clientY - rect.top - player1.height / 2;
			  if (newY < 0) newY = 0;
			  if (newY + player1.height > canvas!.height) {
				newY = canvas!.height - player1.height;
			  }
	
			  player1.y = newY;
		}
	}
	
	function game() {
		if (gameSettings.multiplayer) movePaddlesWithKeyboard(canvas!, player1, player2)
		if (!gameSettings.multiplayer && !gameSettings.mouse) movePaddlePlayer1(canvas!, player1)
		update(canvas!, player1, player2, ball) 
		render(canvas!, context!, player1, player2, ball, net)
	}
	function gameLoop() {
	  game();
	  requestAnimationFrame(gameLoop);
	}
	requestAnimationFrame(gameLoop);
}

function launchBall(ball: Ball) {
    // Random angle between -45° and 45° (in radians)
    const angle = Math.random() * Math.PI / 2 - Math.PI / 4;
    // Random left (-1) or right (+1) horizontal direction
    const direction = Math.random() < 0.5 ? 1 : -1;

    ball.velocityX = direction * ball.speed * Math.cos(angle);
    ball.velocityY = ball.speed * Math.sin(angle);
}

function movePaddlesWithKeyboard(cvs: HTMLCanvasElement, player1: Player, player2: Player)
{
	// Player 1 movement (W/S)
	if (wPressed) player1.y -= gameSettings.paddleSpeed;
	if (sPressed) player1.y += gameSettings.paddleSpeed;	
	// Player 2 movement (Arrow keys)
	if (upPressed) player2.y -= gameSettings.paddleSpeed;
	if (downPressed) player2.y += gameSettings.paddleSpeed;	
	// Clamp positions to canvas
	player1.y = Math.max(0, Math.min(player1.y, cvs.height - player1.height));
	player2.y = Math.max(0, Math.min(player2.y, cvs.height - player2.height));
}

function movePaddlePlayer1(cvs: HTMLCanvasElement, player1: Player)
{
	if (wPressed) {
	  player1.y -= gameSettings.paddleSpeed;
	}
	if (sPressed) {
	  player1.y += gameSettings.paddleSpeed;
	}	
	// Clamp to canvas boundaries
	player1.y = Math.max(0, Math.min(player1.y, cvs!.height - player1.height));
}

function getCanvasAndContext() {
  const canvas = document.getElementById("pong") as HTMLCanvasElement | null;
  if (!canvas) return { canvas: null, context: null };

  return {
    canvas,
    context: canvas.getContext("2d")
  };
}

function drawRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, color: string)
{
	ctx.fillStyle = color
	ctx.fillRect(x, y, w, h)
}

function drawCircle(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, color: string)
{
	ctx.fillStyle = color
	ctx.beginPath()
	ctx.arc(x, y, r, 0, Math.PI*2, false)
	ctx.closePath()
	ctx.fill()
}

function drawText(ctx: CanvasRenderingContext2D, text: number, x: number, y: number, color: string)
{
	ctx.fillStyle = color
	ctx.font = "45px fantasy"
	ctx.fillText(text.toString(), x, y)
}

function drawNet(cvs: HTMLCanvasElement, ctx: CanvasRenderingContext2D, net: Net)
{
	for (let i = 0; i <= cvs.height; i += 15)
		drawRect(ctx, net.x, net.y + i, net.width, net.height, net.color)
}

function render(cvs: HTMLCanvasElement, ctx: CanvasRenderingContext2D, player1: Player, player2: Player, ball: Ball, net: Net)
{
	drawRect(ctx, 0, 0, cvs.width, cvs.height, bg_color)
	drawNet(cvs, ctx, net)
	drawText(ctx, player1.score, cvs.width/4, cvs.height/5, items_color)
	drawText(ctx, player2.score, 3*cvs.width/4, cvs.height/5, items_color)

	drawRect(ctx, player1.x, player1.y, player1.width, player1.height, player1.color)
	drawRect(ctx, player2.x, player2.y, player2.width, player2.height, player2.color)

	drawCircle(ctx, ball.x, ball.y, ball.radius, ball.color)
}

function collision(b: any, p: any)
{
	b.top = b.y - b.radius
	b.bottom = b.y + b.radius
	b.left = b.x - b.radius
	b.right = b.x + b.radius

	p.top = p.y
	p.bottom = p.y + p.height
	p.left = p.x
	p.right = p.x + p.width

	return b.right > p.left && b.bottom > p.top && b.left < p.right && b.top < p.bottom
}

function resetBall(cvs: HTMLCanvasElement, ball: Ball)
{
	ball.x = cvs.width/2
	ball.y = cvs.height/2

	if (gameSettings.resetSpeed){
		ball.speed = gameSettings.ballSpeed
	}
	launchBall(ball)
}

function moveCom(cvs: HTMLCanvasElement, player2: Player, ball: Ball) {
  // Find the center of player2's paddle
  const paddleCenter = player2.y + player2.height / 2;

  // Move toward the ball by a fraction (difficulty factor)
  player2.y += (ball.y - paddleCenter) * gameSettings.difficulty;

  // Clamp so it never goes out of bounds
  player2.y = Math.max(0, Math.min(player2.y, cvs.height - player2.height));
}

function update(cvs: HTMLCanvasElement, player1: Player, player2: Player, ball: Ball)
{
	ball.x += ball.velocityX
	ball.y += ball.velocityY

	if (!gameSettings.multiplayer) moveCom(cvs, player2, ball)
	
	if (ball.y + ball.radius > cvs.height) {
    ball.y = cvs.height - ball.radius; // push back inside
    ball.velocityY = -ball.velocityY;
	} else if (ball.y - ball.radius < 0) {
    ball.y = ball.radius; // push back inside
    ball.velocityY = -ball.velocityY;
	}

	let player = (ball.x < cvs.width/2) ? player1 : player2

	if (collision(ball, player)) {
	    // where the ball hits the player
	    let collidePoint = ball.y - (player.y + player.height / 2);

	    // normalization
	    collidePoint = collidePoint / (player.height / 2);

	    // calculate angle in radians
	    let angleRad = collidePoint * Math.PI / 4;

	    // X direction change when hit
	    let direction = (ball.x < cvs.width / 2) ? 1 : -1;

	    // change vel x/y
	    ball.velocityX = direction * ball.speed * Math.cos(angleRad);
	    ball.velocityY = ball.speed * Math.sin(angleRad);

	    // every time the ball hits a paddle, we increase its speed
	    ball.speed += 0.1;

	    // **Push ball outside paddle to avoid stuck collisions**
	    if (direction === 1) {
	        // Ball is on the left paddle
	        ball.x = player.x + player.width + ball.radius;
	    } else {
	        // Ball is on the right paddle
	        ball.x = player.x - ball.radius;
	    }
	}

	// update the score
	if(ball.x - ball.radius < 0)
	{
		player2.score++
		resetBall(cvs, ball)
	}
	else if (ball.x + ball.radius > cvs.width)
	{
		player1.score++
		resetBall(cvs, ball)
	}
}