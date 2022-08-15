/*
 * Frequency-Match Activity Javascript File
*/

let midHeight;
let gridWidth;
let boxSize;

let gridColor;
let playerLineColor;

let playerSpeed;
let playerSensitivity;
let playerLineWeight;

// notes
let midTone;
let highTone;
let lowTone;
let toneCount;
let successTone;
let unsuccessTone;

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
    loadSounds();
}

function setup() {
    createCanvas(window.innerWidth, window.innerHeight);

    midHeight = height / 2;
    gridWidth = 12;
    boxSize = width / gridWidth;

    playerSpeed = float(sessionStorage.getItem("speed")) + 3;
    playerSensitivity = float(sessionStorage.getItem("sensitivityP1")) * 2.5 + 10;
    playerLineWeight = boxSize / 6;

    x = 0;

    numTimesPassedAxis = -1;
    goalPeriodLength = (gridWidth / goalPeriodCount) * boxSize;

    // initial background sketch
    drawGrid();
    drawXAxis();

    let soundIsOn = (sessionStorage.getItem("soundIsOn") === 'true');
    if (!soundIsOn) {
        outputVolume(0);
    }

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
                midTone.play();
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
                if (prevState["slope"] == 1) {
                    highTone.play();
                }

                if (prevState["slope"] == -1) {
                    lowTone.play();
                }
            }

        }
    }

}

function loadColors() {
    colorMode(HSB, 360, 100, 100);

    gridColor = color(30, 35, 30);
    playerLineColor = color(30, 35, 30);

}

function loadSounds() {
    soundFormats('wav', 'ogg');
    midTone = loadSound('../../resources/sounds/freq/Frequency_Matching_v1.a_Wood_Block_Counter-003');
    highTone = loadSound('../../resources/sounds/freq/Frequency_Matching_v1.a_Wood_Block_Counter-002');
    lowTone = loadSound('../../resources/sounds/freq/Frequency_Matching_v1.a_Wood_Block_Counter-001');
    successTone = loadSound('../../resources/sounds/freq/Frequency_Matching_v1.a_Success_Chord');
    unsuccessTone = loadSound('../../resources/sounds/freq/Frequency_Matching_v1.a_Unsuccessful_Chord');
}

function startGame() {
    gameIsPlaying = true;

    let hideModal = document.getElementById('hideModal');
    hideModal.style.display = "none";

    y = angle * playerSensitivity + midHeight;
    updateCurState(y);

    noStroke();
    fill(playerLineColor);
    loop();

}

function endGame() {
    gameIsPlaying = false;
    document.getElementById("numPeriods").innerHTML = numGoalPeriods;

    let hideStatsModal = document.getElementById('hideStatsModal');
    hideStatsModal.style.display = "block";

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