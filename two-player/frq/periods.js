let c = document.getElementById("periodCanvas");
let ctx = c.getContext("2d");

let periodWidth = 0;

ctx.canvas.width  = window.innerWidth;
ctx.canvas.height = window.innerHeight;

function drawPeriod(startX, endX) {
    periodWidth = endX - startX;

    ctx.beginPath();

    distance = abs(periodWidth - goalPeriodLength);
    
    if (distance < 10) {
        ctx.fillStyle = "#0B6FFB";
        numGoalPeriods += 1;
    } else if (distance > 10 && distance < 200) {
        ctx.fillStyle = "#35CD76";
    } else {
        ctx.fillStyle = "#FFAB2E";
    }

    ctx.fillRect(startX, 0, periodWidth, ctx.canvas.height);

    ctx.fillStyle = "#000000";
    ctx.fillRect(endX, 0, 2, ctx.canvas.height);

    ctx.closePath();
    
    periodStart = endX + 2;

}