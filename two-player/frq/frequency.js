/*
 * Frequency-Match Activity Javascript File
*/

let midHeight;
let gridWidth;
let boxSize;

let gridColor;
let playerColor;

let playerSpeed;
let playerSensitivity;
let playerLineWeight;

let gameIsPlaying = false;

let x;
let y;

let curState = new Object();
let prevState = new Object();
let periodStart;
let numTimesPassedAxis;
let goalPeriodLength;
let numGoalPeriods = 0;

let goalPeriodCount = 6;

function preload() {
    loadColors();

}

function setup() {
    createCanvas(window.innerWidth, window.innerHeight);

    midHeight = height / 2;
    gridWidth = 12;
    boxSize = width / gridWidth;

    playerSpeed = 5;
    playerLineWeight = boxSize / 6;
    playerSensitivity = 15;

    x = 0;

    numTimesPassedAxis = -1;
    goalPeriodLength = (gridWidth / goalPeriodCount) * boxSize;

    drawGrid();
    drawXAxis();

}

function draw() {

    if (!gameIsPlaying) {
        noLoop();
    } else {
        if (x > width) {
            noLoop();
            endGame();
        }

        updatePrevState(y, curState["sign"], curState["slope"]);

        x = x + playerSpeed;
        y = lerp(y, angle * playerSensitivity + midHeight, 0.05);

        ellipse(x, y, playerLineWeight);

        updateCurState(y, prevState);

        if (prevState["sign"]) {
            if (prevState["sign"] != curState["sign"]) {
                // middle
                if (numTimesPassedAxis < 0) {
                    numTimesPassedAxis = 0;
                    periodStart = x;
                } else {
                    numTimesPassedAxis += 1;

                    if (numTimesPassedAxis % 2 == 0) {
                        drawPeriod(periodStart, x);
                    }
                }
            }

            if (prevState["slope"] != curState["slope"]) {
                // peaks
            }

        }
    }

}

function startGame() {
    gameIsPlaying = true;

    let hideModal = document.getElementById('hideModal');
    hideModal.style.display = "none";

    y = angle * playerSensitivity + midHeight;
    updateCurState(y);

    noStroke();
    loop();

}

function endGame() {
    gameIsPlaying = false;
    document.getElementById("numPeriods").innerHTML = numGoalPeriods;

    let hideStatsModal = document.getElementById('hideStatsModal');
    hideStatsModal.style.display = "block";

}

function loadColors() {
    colorMode(HSB, 360, 100, 100);

    gridColor = color(0, 0, 100);
    playerColor = color(0, 0, 33);

}

function updatePrevState(y, sign, slope) {
    prevState["y"] = y;
    prevState["sign"] = sign;
    prevState["slope"] = slope;

}

function updateCurState(curY, prevState) {
    curState["y"] = curY;

    if (prevState) {
        curState["sign"] = (curY < midHeight) ? 1 : -1;
        curState["slope"] = (prevState["y"] > curY) ? 1 : -1;
    }

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
    for (let i = midHeight; i < height; i += boxSize) {
        line(0, i, width, i);
    }

    for (let i = midHeight; i > 0; i -= boxSize) {
        line(0, i, width, i);
    }

}

function drawXAxis() {
    // set pen
    stroke(gridColor);
    strokeWeight(8);
    setLineDash([0, 0]);

    // draw x-axis
    line(0, midHeight, width, midHeight);

}

function setLineDash(list) {
    drawingContext.setLineDash(list);

}