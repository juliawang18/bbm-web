let c = document.getElementById("periodCanvas");
let ctx = c.getContext("2d");

let periodWidth = 0;

ctx.canvas.width  = window.innerWidth;
ctx.canvas.height = window.innerHeight;

function drawPeriod(startX, endX) {
    periodWidth = endX - startX;

    ctx.beginPath();

    distance = abs(periodWidth - goalPeriodLength);
    
    if (distance < 30) {
        successTone.play();
        ctx.fillStyle = "#219CBF";
        numGoalPeriods += 1;
    } else if (distance > 30 && distance < 100) {
        unsuccessTone.play();
        ctx.fillStyle = "#B78A90";
    } else {
        unsuccessTone.play();
        ctx.fillStyle = "#ED8383";
    }

    ctx.fillRect(startX, 0, periodWidth, ctx.canvas.height);

    ctx.fillStyle = "#4D3F32";
    ctx.fillRect(endX, 0, 2, ctx.canvas.height);

    ctx.closePath();
    
    periodStart = endX + 2;

}