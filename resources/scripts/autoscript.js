'use strict';

let reader;
let inputDone;
let inputStream;
let angle;

let orient = [0, 0, 0];

document.addEventListener('DOMContentLoaded', () => {
    // Initiate auto-connection
    clickConnect();

});

/**
 * @name connect
 * Opens a Web Serial connection and sets up the input stream.
 */
async function serialConnect() {
    // Get all serial ports the user has previously granted the website access to.
    const ports = await navigator.serial.getPorts();

    // Checking for serial connections.
    if (ports.length == 0) {
        console.log("No serial device connected!")
        return;
    }

    // Assuming the first one is the one you want to open...
    const port = ports[0];

    // Open serial port without user gesture.
    await port.open({ baudRate: 9600 });

    // CODELAB: Add code to read the stream here.
    let decoder = new TextDecoderStream();
    inputDone = port.readable.pipeTo(decoder.writable);
    inputStream = decoder.readable
        .pipeThrough(new TransformStream(new LineBreakTransformer()));

    reader = inputStream.getReader();
    readLoop();

}


/**
 * @name disconnect
 * Closes the Web Serial connection.
 */
async function serialDisconnect() {

    // CODELAB: Close the input stream (reader).

    // CODELAB: Close the port.

}


/**
 * @name clickConnect
 * Click handler for the connect/disconnect button.
 */
async function clickConnect() {
    // CODELAB: Add disconnect code here.

    // CODELAB: Add connect code here.
    await serialConnect();

    // toggleUIConnected(true);
}


/**
 * @name readLoop
 * Reads data from the input stream and displays it on screen.
 */
async function readLoop() {
    // CODELAB: Add read loop here.
    while (true) {
        const { value, done } = await reader.read();
        if (value) {
            angle = parseFloat(value);
        }
        if (done) {
            console.log('[readLoop] DONE', done);
            reader.releaseLock();
            break;
        }
    }
}

// function toggleUIConnected(connected) {
//     let lbl = 'Connect';
//     if (connected) {
//         lbl = 'Disconnect';
//     }
//     butConnect.textContent = lbl;
//     ledCBs.forEach((cb) => {
//         if (connected) {
//             cb.removeAttribute('disabled');
//             return;
//         }
//         cb.setAttribute('disabled', true);
//     });
// }

/**
 * @name LineBreakTransformer
 * TransformStream to parse the stream into lines.
 */
 class LineBreakTransformer {
    constructor() {
      // A container for holding stream data until a new line.
      this.container = '';
    }
  
    transform(chunk, controller) {
      this.container += chunk;
      const lines = this.container.split('\n');
      this.container = lines.pop();
      lines.forEach(line => {
        controller.enqueue(line)
        // logData(line);
      });
    }
  
    flush(controller) {
      controller.enqueue(this.container);
    }
  }
