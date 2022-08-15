const sensitivityP1CBs = document.querySelectorAll('input.sensitivityP1');
const sensitivityP2CBs = document.querySelectorAll('input.sensitivityP2');
const speedCBs = document.querySelectorAll('input.speed');

const soundOn = document.getElementById('soundOn');
const soundOff = document.getElementById('soundOff');

document.addEventListener('DOMContentLoaded', () => {
    initValues();
    initCheckboxes();

    soundOn.addEventListener('click', () => {
        updateSound("true");
    });

    soundOff.addEventListener('click', () => {
        updateSound("false");
    });

});

function initCheckboxes() {
    sensitivityP1CBs.forEach((cb, i) => {
        cb.addEventListener('change', () => {
            updateValue(sensitivityP1CBs, "sensitivityP1", i);
        });
    });

    sensitivityP2CBs.forEach((cb, i) => {
        cb.addEventListener('change', () => {
            updateValue(sensitivityP2CBs, "sensitivityP2", i);
        });
    });

    speedCBs.forEach((cb, i) => {
        cb.addEventListener('change', () => {
            updateValue(speedCBs, "speed", i);
        });
    });
}


function initValues() {
    let sensitivityP1 = sessionStorage.getItem("sensitivityP1");
    let sensitivityP2 = sessionStorage.getItem("sensitivityP2");
    let speed = sessionStorage.getItem("speed");
    let soundIsOn = sessionStorage.getItem("soundIsOn");

    console.log("sP1: " + sensitivityP1);
    console.log("sP2: " + sensitivityP2);
    console.log("speed: " + speed);
    console.log("soundIsOn: " + soundIsOn);

    if (sensitivityP1 == null) {
        sensitivityP1 = 2;
        sensitivityP2 = 2;
        speed = 2;
        soundIsOn = true;
    }

    updateCBs(sensitivityP1CBs, sensitivityP1);
    updateCBs(sensitivityP2CBs, sensitivityP2);
    updateCBs(speedCBs, speed);
    updateSound(soundIsOn);

}

function updateValue(cbs, property, value) {
    updateCBs(cbs, parseFloat(value));
    sessionStorage.setItem(property, parseFloat(value));
}

function updateCBs(cbs, value) {
    for (let i = 0; i < cbs.length; i += 1) {
        if (i <= value) {
            cbs[i].checked = true;
        } else {
            cbs[i].checked = false;
        }
    }
}

function updateSound(value) {
    let val = value == "true";
    sessionStorage.setItem("soundIsOn", val);

    if (val == true) {
        soundOff.classList.remove('active'); 
        soundOn.classList.add('active'); 
    } 

    if (val == false) {
        soundOn.classList.remove('active'); 
        soundOff.classList.add('active'); 
    }
}
