/*
 * Amplitude-Match Activity Javascript File
*/

let midHeight;
let gridHeight;
let boxSize;

let gridColor;
let gradientColors;

let playerSpeed;
let playerSensitivity;
let playerLineWeight;

// sounds
let enterTopSound;
let exitTopSound;
let enterBottomSound;
let exitBottomSound;

let gameIsPlaying = false;

let x;
let y;

let curState = new Object();
let prevState = new Object();
let yAbove;
let yBelow;
let goalInPixels;
let allowGreen;
let numReached = 0;

let goalAmplitude = 2;

function preload() {
    loadColors();
    loadSounds();
}

function setup() {
    createCanvas(window.innerWidth, window.innerHeight);

    midHeight = height / 2;
    gridHeight = 8;
    boxSize = height / gridHeight;

    playerSpeed = float(sessionStorage.getItem("speed")) + 3;
    playerLineWeight = boxSize / 5;
    playerSensitivity = float(sessionStorage.getItem("sensitivityP1")) * 2.5 + 10;

    x = 0;

    goalInPixels = goalAmplitude * boxSize;
    allowGreen = true;
    yAbove = midHeight - goalInPixels;
    yBelow = midHeight + goalInPixels;

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

        updatePrevState(y, curState["section"], curState["sign"]);

        x = x + playerSpeed;
        y = lerp(y, angle * playerSensitivity + midHeight, 0.05);

        calculateFillColor(y);

        ellipse(x, y, playerLineWeight);

        updateCurState(y, prevState);

        if (prevState["section"] != curState["section"]) {
            if (prevState["section"] == 0 && curState["section"] == 1) {
                // enter top
                enterTopSound.play();
                if (allowGreen) {
                    drawStar(x, y);
                    numReached += 1;
                };
                allowGreen = false;
            } else if (prevState["section"] == 1 && curState["section"] == 0) {
                // exit top
                exitTopSound.play();
            } else if (prevState["section"] == 0 && curState["section"] == -1) {
                // enter bottom
                enterBottomSound.play();
                if (allowGreen) {
                    drawStar(x, y);
                    numReached += 1;
                };
                allowGreen = false;
            } else if (prevState["section"] == -1 && curState["section"] == 0) {
                // exit bottom
                exitBottomSound.play();
            }
        }

        if (prevState["sign"] != curState["sign"]) {
            allowGreen = true;
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
    document.getElementById("numReached").innerHTML = numReached;

    let hideStatsModal = document.getElementById('hideStatsModal');
    hideStatsModal.style.display = "block";

}

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

function loadSounds() {
    soundFormats('wav', 'ogg');
    enterTopSound = loadSound('../../resources/sounds/amp/Amplitude_Matching_v1_Enter_Green_Top.wav');
    exitTopSound = loadSound('../../resources/sounds/amp/Amplitude_Matching_v1_Exit_Green_Top.wav');
    enterBottomSound = loadSound('../../resources/sounds/amp/Amplitude_Matching_v1_Enter_Green_Bottom.wav');
    exitBottomSound = loadSound('../../resources/sounds/amp/Amplitude_Matching_v1_Exit_Green_Bottom.wav');
}

function updatePrevState(y, section, sign) {
    prevState["y"] = y;
    prevState["section"] = section;
    prevState["sign"] = sign;

}

function updateCurState(curY, prevState) {
    curState["y"] = curY;

    if (prevState) {
        if (curY < yAbove) {
            curState["section"] = 1;
        } else if (curY >= yAbove && curY <= yBelow) {
            curState["section"] = 0;
        } else {
            curState["section"] = -1;
        }

        curState["sign"] = (curY < midHeight) ? 1 : -1;
    }

}

function calculateFillColor(y) {
    playerAmp = abs(y - midHeight);
    distanceToGoal = abs(goalInPixels - playerAmp);


    if (distanceToGoal < 77 && allowGreen) {
        index = round(distanceToGoal / 11);
        fill(gradientColors[index]);
    } else if (distanceToGoal) {
        fill(gradientColors[7]);
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
    for (let i = boxSize; i < height; i += boxSize) {
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