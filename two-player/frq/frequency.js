/*
 * Frequency-Match Activity Javascript File
*/

let midHeight;
let gridWidth;
let boxSize;

let gridColor;
let playerLineColor;

let playerSpeed;
let playerLineWeight;

let gameIsPlaying = false;

let player1;
let player2;

let goalPeriodLength;

let goalPeriodCount = 6;

function preload() {
    loadColors();
}

function setup() {
    createCanvas(window.innerWidth, window.innerHeight);

    midHeight = height / 2;
    gridWidth = 12;
    boxSize = width / gridWidth;

    playerSpeed = float(sessionStorage.getItem("speed")) + 3;
    playerLineWeight = boxSize / 4;

    player1 = new Player(1, 0, 0, midHeight * 0.5, float(sessionStorage.getItem("sensitivityP1")) * 2.5 + 10);
    player2 = new Player(2, 0, 0, midHeight * 1.5, float(sessionStorage.getItem("sensitivityP2")) * 2.5 + 10);

    goalPeriodLength = (gridWidth / goalPeriodCount) * boxSize;

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
        updatePlayer(player1, angle1);

        //player 2
        updatePlayer(player2, angle2);
    }

}

function startGame() {
    gameIsPlaying = true;

    let hideModal = document.getElementById('hideModal');
    hideModal.style.display = "none";

    player1.y = angle1 * player1.sensitivity + player1.midHeight;
    player2.y = angle2 * player2.sensitivity + player2.midHeight;
    
    updateCurState(player1);
    updateCurState(player2);

    noStroke();
    fill(playerLineColor);
    loop();

}

function endGame() {
    gameIsPlaying = false;

    document.getElementById("player1Score").innerHTML = player1.score;
    document.getElementById("player2Score").innerHTML = player2.score;

    let hideStatsModal = document.getElementById('hideStatsModal');
    hideStatsModal.style.display = "block";

}

function loadColors() {
    colorMode(HSB, 360, 100, 100);

    gridColor = color(30, 35, 30);
    playerLineColor = color(30, 35, 30);

}

function updatePlayer(player, angle) {
    updatePrevState(player);
    updatePlayerCoords(player, angle);
    ellipse(player.x, player.y, playerLineWeight);
    updateCurState(player);

    if (player.prevState["sign"]) {
        if (player.prevState["sign"] != player.curState["sign"]) {
            // middle
            if (player.numTimesPassedAxis < 0) {
                player.numTimesPassedAxis = 0;
                player.periodStart = player.x;
            } else {
                player.numTimesPassedAxis += 1;

                if (player.numTimesPassedAxis % 2 == 0) {
                    drawPeriod(player);
                }
            }
        }

    }
}

function updatePrevState(player) {
    player.prevState["y"] = player.curState["y"];
    player.prevState["sign"] = player.curState["sign"];
    player.prevState["slope"] = player.curState["slope"];

}

function updateCurState(player) {
    player.curState["y"] = player.y;

    if (player.prevState) {
        player.curState["sign"] = (player.y < player.midHeight) ? 1 : -1;
        player.curState["slope"] = (player.prevState["y"] > player.y) ? 1 : -1;
    }

}

function updatePlayerCoords(player, angle) {
    player.x = player.x + playerSpeed;
    player.y = lerp(player.y, angle * player.sensitivity + player.midHeight, 0.05);

}

function drawPlayerViews() {
    noStroke();

    fill(0, 0.1);
    rect(0, 0, width, height / 2);
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
    // for (let i = midHeight; i < height; i += boxSize) {
    //     line(0, i, width, i);
    // }

    // for (let i = midHeight; i > 0; i -= boxSize) {
    //     line(0, i, width, i);
    // }

}

function drawXAxes() {
    // set pen
    stroke(gridColor);
    strokeWeight(4);
    setLineDash([0, 0]);

    // draw x-axis
    line(0, player1.midHeight, width, player1.midHeight);
    line(0, player2.midHeight, width, player2.midHeight);

}

function setLineDash(list) {
    drawingContext.setLineDash(list);

}