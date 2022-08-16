let c = document.getElementById("periodCanvas");
let ctx = c.getContext("2d");

let periodWidth = 0;

ctx.canvas.width  = window.innerWidth;
ctx.canvas.height = window.innerHeight;

function drawPeriod(player) {
    let startX = player.periodStart;
    let endX = player.x;

    periodWidth = endX - startX;

    ctx.beginPath();

    distance = abs(periodWidth - goalPeriodLength);
    
    if (distance < 30) {
        ctx.fillStyle = "#219CBF";
        player.score += 1;
    } else if (distance > 30 && distance < 100) {
        ctx.fillStyle = "#B78A90";
    } else {
        ctx.fillStyle = "#ED8383";
    }

    let startY;
    if (player.id == 1) {
        startY = 0;
    } else {
        startY = ctx.canvas.height / 2;
    }

    ctx.fillRect(startX, startY, periodWidth, ctx.canvas.height / 2);

    ctx.fillStyle = "#4D3F32";
    ctx.fillRect(endX, startY, 2, ctx.canvas.height / 2);

    ctx.closePath();
    
    player.periodStart = endX + 2;

}