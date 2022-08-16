/*
 * Script for initial user gesture for serial permission:
 * 
 * Checks for previous permissions. If none found
 * then provide call-to-action to connect serial device.
 */

'use strict';

let portP1;
let portP2;

const butConnectP1 = document.getElementById('butConnectP1');
const butConnectP2 = document.getElementById('butConnectP2');
const noConnection = document.getElementById('noConnection');


document.addEventListener('DOMContentLoaded', () => {
    butConnectP1.addEventListener('click', function () { clickConnect(portP1, butConnectP1, "P1") });
    butConnectP2.addEventListener('click', function () { clickConnect(portP2, butConnectP2, "P2") });

    // Feature detection.
    if ('serial' in navigator) {
        const notSupported = document.getElementById('notSupported');
        notSupported.style.display = "none";

        // Check for open ports.
        // handleLoad();
    }

    // Set player settings
    if (sessionStorage.getItem("sensitivityP1") == null) {
        sessionStorage.setItem("sensitivityP1", 2);
        sessionStorage.setItem("sensitivityP2", 2);
        sessionStorage.setItem("speed", 2);
        sessionStorage.setItem("soundIsOn", true);
    }


});


/**
 * @name connect
 * Opens a Web Serial connection to a micro:bit and sets up the input and
 * output stream.
 */
async function connect(port, button, player) {
    // - Request a port and open a connection.
    port = await navigator.serial.requestPort();
    // - Wait for the port to open.
    await port.open({ baudRate: 9600 });

    // Hide instructions.
    noConnection.style.display = "none";

    // Close the port.
    await port.close();
    port = null;

    toggleUIConnected(true, button, player);
}

/**
 * @name clickConnect
 * Click handler for the connect button.
 */
async function clickConnect(port, button, player) {
    await connect(port, button, player);

}

async function checkOpenPorts() {
    // Get all serial ports the user has previously granted the website access to.
    const ports = await navigator.serial.getPorts();

    // Checking for serial connections.
    if (ports.length < 2) {
        console.log("Not enough serial devices connected!");

        // Show instructions.
        noConnection.style.display = "block";
    }

    if (ports.length == 1) {
        toggleUIConnected(true, butConnectP1, "P1");
    }

    if (ports.length == 2) {
        toggleUIConnected(true, butConnectP1, "P1");
        toggleUIConnected(true, butConnectP2, "P2");
    }
}

async function handleLoad() {
    await checkOpenPorts();
}

function toggleUIConnected(connected, button, player) {
    let lbl = 'Connect ' + player;
    if (connected) {
        lbl = player + ' Connected';
    }
    button.textContent = lbl;
    button.className = "button menu-button invalid-button";
}
