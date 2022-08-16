/*
 * Two-Player Amplitude-Match Activity Javascript File
*/

let midHeight;
let gridHeight;
let boxSize;

let gridColor;
let gradientColors;

let playerSpeed;
let playerLineWeight;

let gameIsPlaying = false;

let player1;
let player2;

let goalAmplitude = 2;
let goalInPixels;

function loadColors() {
    colorMode(HSB, 360, 100, 100);

    gridColor = color(188, 38, 60);

    // correct to incorrect
    gradientColors = [
        color(138, 71, 87),
        color(140, 70, 79),
        color(143, 67, 70),
        color(149, 64, 59),
        color(154, 61, 53),
        color(164, 57, 44),
        color(178, 52, 37),
        color(188, 51, 36)
    ]
}

function preload() {
    loadColors();
}

function setup() {
    createCanvas(window.innerWidth, window.innerHeight);

    midHeight = height / 2;
    gridHeight = 12;
    boxSize = height / gridHeight;

    playerSpeed = float(sessionStorage.getItem("speed")) + 3;
    playerLineWeight = boxSize / 4;

    goalInPixels = goalAmplitude * boxSize;

    player1 = new Player(0, 0, midHeight * 0.5 - goalInPixels, midHeight * 0.5 + goalInPixels, midHeight * 0.5, float(sessionStorage.getItem("sensitivityP1")) * 2.5 + 10);
    player2 = new Player(0, 0, midHeight * 1.5 - goalInPixels, midHeight * 1.5 + goalInPixels, midHeight * 1.5, float(sessionStorage.getItem("sensitivityP2")) * 2.5 + 10);

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
    let hideModal = document.getElementById('hideModal');
    hideModal.style.display = "none";

    noStroke();

    // instantiate players
    player1.y = angle1 * player1.sensitivity + player1.midHeight;
    player2.y = angle2 * player2.sensitivity + player2.midHeight;

    gameIsPlaying = true;

    loop();
}

function endGame() {
    gameIsPlaying = false;

    document.getElementById("player1Score").innerHTML = player1.score;
    document.getElementById("player2Score").innerHTML = player2.score;

    let hideStatsModal = document.getElementById('hideStatsModal');
    hideStatsModal.style.display = "block";

}

function updatePlayer(player, angle) {
    updatePrevState(player);
    updatePlayerCoords(player, angle);
    calculateFillColor(player);
    ellipse(player.x, player.y, playerLineWeight);
    updateCurState(player);

    if (player.prevState["section"] != player.curState["section"]) {
        if (player.prevState["section"] == 0 && player.curState["section"] == 1) {
            // enter top
            if (player.allowGreen) { 
                drawStar(player.x, player.y);
                player.score += 1;
            };
            player.allowGreen = false;
        }
        
        if (player.prevState["section"] == 0 && player.curState["section"] == -1) {
            // enter bottom
            if (player.allowGreen) { 
                drawStar(player.x, player.y);
                player.score += 1;
            };
            player.allowGreen = false;
        }
    }

    if (player.prevState["sign"] != player.curState["sign"]) {
        player.allowGreen = true;
    }
}

function updatePrevState(player) {
    player.prevState["y"] = player.curState["y"];
    player.prevState["section"] = player.curState["section"];
    player.prevState["sign"] = player.curState["sign"];

}

function updateCurState(player) {
    player.curState["y"] = player.y;

    if (player.prevState) {
        if (player.y < player.yAbove) {
            player.curState["section"] = 1;
        } else if (player.y >= player.yAbove && player.y <= player.yBelow) {
            player.curState["section"] = 0;
        } else {
            player.curState["section"] = -1;
        }

        player.curState["sign"] = (player.y < player.midHeight) ? 1 : -1;
    }

}

function updatePlayerCoords(player, angle) {
    player.x = player.x + playerSpeed;
    player.y = lerp(player.y, angle * player.sensitivity + player.midHeight, 0.05);

}

function calculateFillColor(player) {
    playerAmp = abs(player.y - player.midHeight);
    distanceToGoal = abs(goalInPixels - playerAmp);

    if (distanceToGoal < 77 && player.allowGreen) {
        index = round(distanceToGoal / 11);
        fill(gradientColors[index]);
    } else if (distanceToGoal) {
        fill(gradientColors[7]);
    }

}

function drawPlayerViews() {
    noStroke();

    fill(0, 0.3);
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
    for (let i = boxSize; i < height; i += boxSize) {
        line(0, i, width, i);
    }

}

function drawXAxes() {
    // set pen
    stroke(0);
    strokeWeight(4);
    setLineDash([0, 0]);

    // set pen
    stroke(gridColor);
    strokeWeight(8);

    line(0, player1.midHeight, width, player1.midHeight);
    line(0, player2.midHeight, width, player2.midHeight);
}

function setLineDash(list) {
    drawingContext.setLineDash(list);
}