let c = document.getElementById("starsCanvas");
let ctx = c.getContext("2d");

ctx.canvas.width  = window.innerWidth;
ctx.canvas.height = window.innerHeight;

const img = new Image();        
img.src = '../../resources/images/stars/star.png';    


function drawStar(x, y) {
    let dimension = playerLineWeight * 4;
    ctx.drawImage(img, x - dimension / 2, y - dimension / 2, dimension, dimension);

}