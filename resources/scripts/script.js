/*
 * Script for initial user gesture for serial permission:
 * 
 * Checks for previous permissions. If none found
 * then provide call-to-action to connect serial device.
 */

'use strict';

let port;

const butConnect = document.getElementById('butConnect');
const noConnection = document.getElementById('noConnection');


document.addEventListener('DOMContentLoaded', () => {
    butConnect.addEventListener('click', clickConnect);

    // Feature detection.
    if ('serial' in navigator) {
        const notSupported = document.getElementById('notSupported');
        notSupported.style.display = "none";
        
        // Check for open ports.
        handleLoad();
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
async function connect() {
    // - Request a port and open a connection.
    port = await navigator.serial.requestPort();
    // - Wait for the port to open.
    await port.open({ baudRate: 9600 });

    // Hide instructions.
    noConnection.style.display = "none";

    // Close the port.
    await port.close();
    port = null;

    toggleUIConnected(true);
}

/**
 * @name clickConnect
 * Click handler for the connect/disconnect button.
 */
async function clickConnect() {
    // Disconnect
    if (port) {
        await disconnect();
        return;
    }

    // Connect.
    await connect();

}

async function checkOpenPorts() {
    // Get all serial ports the user has previously granted the website access to.
    const ports = await navigator.serial.getPorts();

    // Checking for serial connections.
    if (ports.length == 0) {
        console.log("No serial device connected!");

        // Show imstructions.
        noConnection.style.display = "block";
    }  else {
        toggleUIConnected(true);
    }
}

async function handleLoad() {
    await checkOpenPorts();
}

function toggleUIConnected(connected) {
    let lbl = 'Connect';
    if (connected) {
      lbl = 'Connected';
    }
    butConnect.textContent = lbl;
    butConnect.className = "button menu-button invalid-button";
}
