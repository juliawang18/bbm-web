/*
 * Function-Match Activity Javascript File
*/

let midHeight;
let gridHeight;
let boxSize;

let gridColor;
let gradientColors = [];

let playerSpeed;
let playerSensitivity;
let playerLineWeight;

let sound;

let gameIsPlaying = false;

let x;
let y;

let targetPoints = new Object();
let numCorrect = 0;

function func(x) {
    return sin(x);
}

function loadColors() {
    colorMode(HSB, 360, 100, 100);

    gridColor = color(141, 19, 40);

    // correct to incorrect gradient
    gradientColors = [
        color(8, 60, 100),
        color(8, 56, 94),
        color(8, 54, 90),
        color(8, 47, 81),
        color(9, 42, 76),
        color(9, 36, 71),
        color(11, 25, 62),
        color(20, 13, 51),
        color(144, 4, 50),
        color(177, 15, 51)
    ]
}

function loadSounds() {
    soundFormats('wav', 'ogg');
    sound = loadSound('../../resources/sounds/fun/Function_Matching_v2_Loop');
}

function preload() {
    loadColors();
    loadSounds();
}

var toType = function(obj) {
    return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
  }

function setup() {
    createCanvas(window.innerWidth, window.innerHeight);

    midHeight = height / 2;
    gridHeight = 8;
    boxSize = height / gridHeight;

    playerSpeed = float(sessionStorage.getItem("speed")) + 3;
    playerSensitivity = float(sessionStorage.getItem("sensitivityP1")) * 2.5 + 10; 
    playerLineWeight = boxSize / 5;

    x = 0;

    populateTargetPoints();

    // initial background sketch
    drawGrid();
    drawFunction();

    let soundIsOn = (sessionStorage.getItem("soundIsOn") === 'true');
    if (soundIsOn) {
        sound.play();
    } 
}

function draw() {

    if (!gameIsPlaying) {
        noLoop();
    } else {
        if (x > width) {
            sound.stop();
            noLoop();
            endGame();
        }

        x = x + playerSpeed;
        y = lerp(y, angle * playerSensitivity + midHeight, 0.05);

        calculateFillColor(x, y);

        ellipse(x, y, playerLineWeight);
    }

}

function startGame() {
    gameIsPlaying = true;

    let hideModal = document.getElementById('hideModal');
    hideModal.style.display = "none";

    noStroke();

    y = angle * playerSensitivity + midHeight;

    loop();
}

function endGame() {
    gameIsPlaying = false;
    document.getElementById("percentCorrectText").innerHTML = round((numCorrect / Object.keys(targetPoints).length) * 100);

    let hideStatsModal = document.getElementById('hideStatsModal');
    hideStatsModal.style.display = "block";

}

function populateTargetPoints() {
    for (let i = 0; i < width; i += playerSpeed) {
        targetPoints[i] = func(i / (boxSize)) * (boxSize) + midHeight;
    }
}

function calculateFillColor(x, y) {
    distance = abs(targetPoints[x] - y);

    if (distance < 120) {
        index = round(distance / 13);
        fill(gradientColors[index]);
        if (index < 5) {
            numCorrect += 1;
        }
        outputVolume(1 - distance/120);
    } else if (distance) {
        fill(gradientColors[9]);
        outputVolume(0);
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

function drawFunction() {
    // set pen
    stroke(gridColor);
    strokeWeight(playerLineWeight * 0.8);

    // draw function
    for (let i = 0; i < width; i += 30) {
        point(i, func(i / (boxSize)) * (boxSize) + midHeight);
    }
}

function setLineDash(list) {
    drawingContext.setLineDash(list);
}