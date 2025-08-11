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

export function setPong()
{
	const { canvas, context } = getCanvasAndContext();
	if (!canvas || !context) return
	// drawRect(context, 0, 0, canvas.width, canvas.height, "BLACK")
	// drawCircle(context, 100, 100, 50, "White")
	// drawText(context, "PONG", 300, 200, "white")

	const player1: Player = {
		x: 0,
		y: canvas.height/2 - 100/2,
		width: 10,
		height: 100,
		color: "WHITE",
		score: 0
	}

	const player2: Player = {
		x: canvas.width - 10,
		y: canvas.height/2 - 100/2,
		width: 10,
		height: 100,
		color: "WHITE",
		score: 0
	}

	const ball: Ball = {
		x: canvas.width/2,
		y: canvas.height/2,
		radius: 10,
		speed: 5,
		velocityX: 5,
		velocityY: 5,
		color: "WHITE",
	}

	const net: Net = {
		x: canvas.width/2 - 1,
		y: 0,
		width: 2,
		height: 10,
		color: "white"
	}

	canvas.addEventListener("mousemove", movePaddle)
	function movePaddle(evt: any)
	{
		let rect = canvas!.getBoundingClientRect()

		player1.y = evt.clientY - rect.top - player1.height/2
	}
	
	function game() {
		update(canvas!, player1, player2, ball)
		render(canvas!, context!, player1, player2, ball, net)
	}
	const framePerSecond = 50
	setInterval(game, 1000/framePerSecond)
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
	drawRect(ctx, 0, 0, cvs.width, cvs.height, "black")
	drawNet(cvs, ctx, net)
	drawText(ctx, player1.score, cvs.width/4, cvs.height/5, "white")
	drawText(ctx, player2.score, 3*cvs.width/4, cvs.height/5, "white")

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

	// ball.speed = 5
	ball.velocityX = - ball.velocityX
}

function update(cvs: HTMLCanvasElement, player1: Player, player2: Player, ball: Ball)
{
	ball.x += ball.velocityX
	ball.y += ball.velocityY

	let computerLevel = 0.1
	player2.y = (ball.y - (player2.y + player2.height/2) * computerLevel)

	if(ball.y + ball.radius > cvs.height || ball.y - ball.radius < 0)
	{
		ball.velocityY = - ball.velocityY
	}

	let player = (ball.x < cvs.width/2) ? player1 : player2

	if (collision(ball, player))
	{
		// where the ball hits the player
		let collidePoint = ball.y - (player.y + player.height)

		//normalization
		collidePoint = collidePoint/(player.height/2)

		//calculate angle in radion
		let angleRed = collidePoint * Math.PI/4

		// X direction change when hit
		let direction = (ball.x < cvs.width/2) ? 1 : -1

		//change vel x/y
		ball.velocityX = direction * ball.speed * Math.cos(angleRed)
		ball.velocityY = 			 ball.speed * Math.sin(angleRed)

		//everytime the ball hits a paddle, we increase its speed
		ball.speed += 0.5
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