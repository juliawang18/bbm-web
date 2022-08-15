/*
 * Two-Player Calibration Activity Javascript File
*/

let midHeight;
let gridHeight;
let boxSize;

let backgroundColor;
let gridColor;

let playerSpeed;
let playerLineWeight;

let gameIsPlaying = false;

let player1;
let player2;

function loadColors() {
    colorMode(HSB, 360, 100, 100);
    
    backgroundColor = color(0, 0, 0);
    gridColor = color(0, 0, 0);
}

function preload() {
    loadColors();
}

function setup() {
    createCanvas(window.innerWidth, window.innerHeight);

    midHeight = height / 2;
    gridHeight = 12;
    boxSize = height / gridHeight;

    playerSpeed = 5;
    playerLineWeight = boxSize / 5;

    player1 = new Player(0, 0, color(0, 0, 0), color(36, 82, 100), midHeight * 0.5, 15);
    player2 = new Player(0, 0, color(0, 0, 0), color(14, 85, 100), midHeight * 1.5, 15);

    // initial background sketch
    drawPlayerViews();
    drawGrid();
    drawXAxes();
}

function draw() {

    if (!gameIsPlaying) {
        noLoop();
    } else {
        if (player1.x > width) {
            noLoop();
            endGame();
        }
    
        // player 1
        fill(player1.color);
        updatePlayer(player1, angle, false);
        ellipse(player1.x, player1.y, playerLineWeight);

        // player 2
        fill(player2.color);
        updatePlayer(player2, angle, false);
        ellipse(player2.x, player2.y, playerLineWeight);
    }

}

function startGame() {

    let hideModal = document.getElementById('hideModal');
    hideModal.style.display = "none";

    noStroke();

    // instantiate players
    player1.y = angle * player1.sensitivity + player1.midHeight;
    player2.y = angle * player2.sensitivity + player2.midHeight;

    gameIsPlaying = true;
    
    loop();
}

function endGame() {
    gameIsPlaying = false;

    // let hideStatsModal = document.getElementById('hideStatsModal');
    // hideStatsModal.style.display = "block";

}

function updatePlayer(player, angle) {
    player.x =  player.x + playerSpeed;
    player.y = lerp(player.y, angle *  player.sensitivity +  player.midHeight, 0.05);
}

function drawPlayerViews() {
    noStroke();

    fill(player1.backgroundColor);
    rect(0, 0, width, midHeight);

    fill(player2.backgroundColor);
    rect(0, midHeight, width, height);

    // set pen
    stroke(gridColor);
    strokeWeight(4);
    setLineDash([0, 0]);

    // draw x-axis
    line(0, midHeight, width, midHeight);
}

function drawGrid() {
    // set pen
    stroke(gridColor);
    strokeWeight(0.75);
    setLineDash([5, 5]);

    // draw vertical grid lines
    for (let i = boxSize; i < width; i += boxSize) {
        line(i, 0, i, height);
    }

    // draw horiz. grid lines
    for (let i = boxSize; i < height; i += boxSize) {
        line(0, i, width, i);
    }

}

function drawXAxes() {
     // set pen
    stroke(gridColor);
    strokeWeight(8);
    setLineDash([0, 0]);

    line(0, player1.midHeight, width, player1.midHeight);
    line(0, player2.midHeight, width, player2.midHeight);
}

function setLineDash(list) {
    drawingContext.setLineDash(list);
}